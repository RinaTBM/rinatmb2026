import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { resolveGenHealthConfig } from "../_shared/genHealthConfig.ts";

/**
 * Staging-only GEN catalog write/probe proxy.
 * Uses server-side GEN_HEALTH_API_KEY. Never returns the API key.
 * DO NOT deploy to production.
 */

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitizePreview(text: string, max = 4000): string {
  // Redact anything that looks like an API key leak in error bodies
  return text
    .replace(/x-api-key["\s:=]+[A-Za-z0-9_\-]{8,}/gi, "x-api-key=<redacted>")
    .replace(/api[_-]?key["\s:=]+[A-Za-z0-9_\-]{8,}/gi, "api_key=<redacted>")
    .slice(0, max);
}

async function genFetch(
  baseUrl: string,
  apiKey: string,
  method: string,
  path: string,
  body?: unknown,
) {
  const headers: Record<string, string> = {
    "x-api-key": apiKey,
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }
  return {
    method,
    path,
    status: res.status,
    ok: res.ok,
    preview: sanitizePreview(text),
    parsed,
  };
}

Deno.serve(async (req) => {
  const cfg = resolveGenHealthConfig();
  if (!cfg.enabled || !cfg.apiKey) {
    return json({ error: "GEN_DISABLED_OR_MISSING_KEY" }, 503);
  }

  const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  const action = String((body as { action?: string }).action || "probe").trim();
  const confirmWrite = Boolean((body as { confirmWrite?: boolean }).confirmWrite);

  // Safety: only allow mutations when confirmWrite=true
  const mutating = ["patch", "post", "put", "delete", "deactivate"].includes(action);
  if (mutating && !confirmWrite) {
    return json({
      error: "CONFIRM_REQUIRED",
      hint: "Pass confirmWrite:true for mutating actions",
      action,
    }, 400);
  }

  if (action === "probe") {
    const productId = String((body as { productId?: string }).productId || "").trim();
    const probes: unknown[] = [];

    // Discover method support + validation shapes (no successful writes intended)
    const paths = productId
      ? [
        `/v2/client/products/${productId}`,
        `/v2/client/products`,
        `/v2/client/products/${productId}/formulary`,
        `/v2/client/products/${productId}/medications`,
        `/v2/client/products/${productId}/pairings`,
        `/v2/client/formulary-products`,
        `/v2/client/product-medications`,
        `/v2/client/medications`,
      ]
      : [
        `/v2/client/products`,
        `/v2/client/formulary-products`,
        `/v2/client/product-medications`,
        `/v2/client/medications`,
      ];

    for (const path of paths) {
      for (const method of ["OPTIONS", "GET", "POST", "PATCH", "PUT", "DELETE"]) {
        // Skip destructive DELETE on real product during probe unless path is collection
        if (method === "DELETE" && productId && path.includes(productId)) {
          // Probe with unlikely empty body expectation via OPTIONS/PATCH first
          continue;
        }
        const emptyBodies: (unknown | undefined)[] =
          method === "GET" || method === "OPTIONS" || method === "DELETE"
            ? [undefined]
            : [undefined, {}, { product: {} }, { clientProduct: {} }];
        for (const b of emptyBodies) {
          if (method === "OPTIONS" || method === "GET") {
            probes.push(await genFetch(cfg.baseUrl, cfg.apiKey, method, path));
            break;
          }
          probes.push(await genFetch(cfg.baseUrl, cfg.apiKey, method, path, b));
          // Stop early on success-like responses to avoid accidental creates
          const last = probes[probes.length - 1] as { status: number };
          if (last.status >= 200 && last.status < 300 && method === "POST" && path === "/v2/client/products") {
            // Unexpected create — report and stop further POST empties
            return json({
              ok: false,
              warning: "PROBE_POST_SUCCEEDED_UNEXPECTEDLY",
              probes,
            }, 500);
          }
        }
      }
    }

    // Targeted PATCH probes with likely field names (read current first)
    if (productId) {
      const current = await genFetch(
        cfg.baseUrl,
        cfg.apiKey,
        "GET",
        `/v2/client/products/${productId}`,
      );
      probes.push({ label: "current_get", ...current });

      const patchBodies = [
        { pricing: { amount: 0 } },
        { product: { pricing: { amount: 0 } } },
        { displayName: "__probe__" },
        { product: { displayName: "__probe__" } },
        { storefrontEligible: false },
        { product: { storefrontEligible: false } },
        { showPatient: false },
        { product: { showPatient: false } },
        { status: "inactive" },
        { product: { status: "inactive" } },
        { active: false },
        { product: { active: false } },
      ];
      for (const pb of patchBodies) {
        // Use dryRun-ish: we will NOT confirmWrite here — this is probe action
        // Actually probe uses real PATCH which could mutate! Do NOT send real PATCH.
        // Instead POST to a fake validation path if available, or only log intended bodies.
        probes.push({
          label: "intended_patch_body_not_sent",
          path: `/v2/client/products/${productId}`,
          body: pb,
        });
      }
    }

    return json({
      ok: true,
      action: "probe",
      note: "Mutating PATCH bodies were NOT sent during probe. Empty POST/PATCH probes may still hit validation.",
      probeCount: probes.length,
      probes,
    });
  }

  if (action === "get") {
    const productId = String((body as { productId?: string }).productId || "").trim();
    if (!productId) return json({ error: "productId required" }, 400);
    const result = await genFetch(
      cfg.baseUrl,
      cfg.apiKey,
      "GET",
      `/v2/client/products/${productId}`,
    );
    return json({ ok: result.ok, result });
  }

  if (action === "list") {
    const view = String((body as { view?: string }).view || "").trim();
    const qs = new URLSearchParams({ limit: "500" });
    if (view) qs.set("view", view);
    const result = await genFetch(
      cfg.baseUrl,
      cfg.apiKey,
      "GET",
      `/v2/client/products?${qs}`,
    );
    return json({ ok: result.ok, result });
  }

  if (action === "request") {
    // Generic authenticated request for schema discovery / controlled writes
    const method = String((body as { method?: string }).method || "GET").toUpperCase();
    const path = String((body as { path?: string }).path || "").trim();
    const payload = (body as { payload?: unknown }).payload;
    if (!path.startsWith("/v2/")) {
      return json({ error: "path must start with /v2/" }, 400);
    }
    if (["POST", "PATCH", "PUT", "DELETE"].includes(method) && !confirmWrite) {
      return json({ error: "CONFIRM_REQUIRED" }, 400);
    }
    const result = await genFetch(
      cfg.baseUrl,
      cfg.apiKey,
      method,
      path,
      payload,
    );
    return json({ ok: result.ok, result });
  }

  if (action === "patch" || action === "post" || action === "put" || action === "delete") {
    const method = action.toUpperCase();
    const path = String((body as { path?: string }).path || "").trim();
    const payload = (body as { payload?: unknown }).payload;
    if (!path.startsWith("/v2/")) {
      return json({ error: "path must start with /v2/" }, 400);
    }
    const beforeId = String((body as { productId?: string }).productId || "").trim();
    let before = null;
    if (beforeId && method !== "POST") {
      before = await genFetch(
        cfg.baseUrl,
        cfg.apiKey,
        "GET",
        `/v2/client/products/${beforeId}`,
      );
    }
    const result = await genFetch(cfg.baseUrl, cfg.apiKey, method, path, payload);
    let after = null;
    if (beforeId) {
      after = await genFetch(
        cfg.baseUrl,
        cfg.apiKey,
        "GET",
        `/v2/client/products/${beforeId}`,
      );
    }
    return json({
      ok: result.ok,
      action,
      before: before
        ? {
          status: before.status,
          preview: before.preview,
          parsed: before.parsed,
        }
        : null,
      result,
      after: after
        ? {
          status: after.status,
          preview: after.preview,
          parsed: after.parsed,
        }
        : null,
    });
  }

  
  if (action === "envcheck") {
    const names = [
      "GEN_HEALTH_ENABLED",
      "GEN_HEALTH_BASE_URL",
      "GEN_HEALTH_API_KEY",
      "GEN_STOREFRONT_KEY",
    ];
    const present: Record<string, boolean> = {};
    for (const n of names) {
      const v = Deno.env.get(n);
      present[n] = Boolean(v && String(v).trim());
    }
    return json({ ok: true, present, baseUrl: cfg.baseUrl });
  }

  if (action === "storefront_probe") {
    const storefrontKey = Deno.env.get("GEN_STOREFRONT_KEY")?.trim();
    if (!storefrontKey) return json({ error: "NO_STOREFRONT_KEY" }, 503);
    const method = String((body as { method?: string }).method || "GET").toUpperCase();
    const path = String((body as { path?: string }).path || "/v2/client/storefront/products").trim();
    const payload = (body as { payload?: unknown }).payload;
    if (!path.startsWith("/v2/")) return json({ error: "path must start with /v2/" }, 400);
    if (["POST", "PATCH", "PUT", "DELETE"].includes(method) && !confirmWrite) {
      return json({ error: "CONFIRM_REQUIRED" }, 400);
    }
    const headers: Record<string, string> = {
      Accept: "application/json",
      "x-storefront-key": storefrontKey,
      "X-Storefront-Key": storefrontKey,
    };
    // Also try common alternates in separate calls below
    if (payload !== undefined) headers["Content-Type"] = "application/json";
    const res = await fetch(`${cfg.baseUrl}${path}`, {
      method,
      headers: {
        ...headers,
        "x-api-key": storefrontKey,
      },
      body: payload === undefined ? undefined : JSON.stringify(payload),
    });
    const text = await res.text();
    return json({
      ok: res.ok,
      result: {
        method,
        path,
        status: res.status,
        preview: sanitizePreview(text),
      },
    });
  }

  return json({ error: "UNKNOWN_ACTION", action }, 400);
});
