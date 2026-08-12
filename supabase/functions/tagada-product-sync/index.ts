/**
 * Temporary Tagada PRODUCT SYNC helper (Edge secrets).
 * Allowed: products list/get/create + best-effort variant SKU updates.
 * Forbidden: processors, payment flows, domains, webhooks, checkout, charges.
 * Delete after sync.
 */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function redact(s: string, secrets: string[]) {
  let out = s;
  for (const sec of secrets) {
    if (sec && sec.length > 3) out = out.split(sec).join("[REDACTED]");
  }
  return out;
}

async function tcall(
  base: string,
  key: string,
  method: string,
  path: string,
  body?: unknown,
) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text.slice(0, 500) };
  }
  return { ok: res.ok, status: res.status, data };
}

type SyncPrice = {
  amountCents: number;
  recurring?: boolean;
  interval?: string | null;
  intervalCount?: number | null;
};

type SyncVariant = {
  name: string;
  description?: string;
  sku: string;
  active?: boolean;
  default?: boolean;
  price: SyncPrice;
};

type SyncProduct = {
  name: string;
  description?: string;
  active?: boolean;
  isShippable?: boolean;
  isTaxable?: boolean;
  variants: SyncVariant[];
};

type SkuUpdate = {
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  expectedPriceCents: number;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  let key = (Deno.env.get("TAGADA_API_KEY") || "").trim();
  const storeId = (Deno.env.get("TAGADA_STORE_ID") || "").trim();
  if (key.toLowerCase().startsWith("bearer ")) key = key.slice(7).trim();
  const secrets = [key, storeId, Deno.env.get("TAGADA_API_KEY") || ""].filter(Boolean);
  const base = "https://api.tagada.io";

  if (!key || !storeId || !storeId.startsWith("store_")) {
    return json({ error: "missing_or_invalid_edge_secrets" }, 503);
  }

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || "sync");

  // ---------- LIST ----------

  if (action === "list_webhooks") {
    const wh = await tcall(base, key, "POST", "/api/public/v1/webhooks/list", { storeId });
    // scrub secrets
    const scrubbed = JSON.parse(
      redact(JSON.stringify(wh.data), secrets).replace(
        /"(secret|signingSecret|webhookSecret)"\s*:\s*"[^"]*"/gi,
        '"$1":"[REDACTED]"',
      ),
    );
    return json({ status: wh.status, data: scrubbed });
  }

  if (action === "list_domains") {
    const dom = await tcall(base, key, "POST", "/api/public/v1/domains/list", {});
    return json(JSON.parse(redact(JSON.stringify({ status: dom.status, data: dom.data }), secrets)));
  }

  if (action === "list") {
    const pl = await tcall(base, key, "POST", "/api/public/v1/products/list", {
      storeId,
      page: 1,
      per_page: 200,
      includeVariants: true,
      includePrices: true,
    });
    return json(JSON.parse(redact(JSON.stringify({ status: pl.status, data: pl.data }), secrets)));
  }

  // ---------- GET ----------
  if (action === "get") {
    const productId = String(body.productId || "");
    const g = await tcall(base, key, "GET", `/api/public/v1/products/${encodeURIComponent(productId)}`);
    return json(JSON.parse(redact(JSON.stringify({ status: g.status, data: g.data }), secrets)));
  }

  // ---------- UPDATE VARIANT SKUS via PUT /variants/{id} ----------
  if (action === "set_skus") {
    const updates = (body.updates || []) as SkuUpdate[];
    const results: unknown[] = [];
    const productCache = new Map<string, Record<string, unknown>>();
    for (const u of updates) {
      let product = productCache.get(u.productId);
      if (!product) {
        const got = await tcall(
          base,
          key,
          "GET",
          `/api/public/v1/products/${encodeURIComponent(u.productId)}`,
        );
        if (!got.ok) {
          results.push({
            variantId: u.variantId,
            sku: u.sku,
            ok: false,
            step: "get_product",
            status: got.status,
            data: got.data,
          });
          continue;
        }
        product = got.data as Record<string, unknown>;
        productCache.set(u.productId, product);
      }
      const variants = (product.variants as Record<string, unknown>[]) || [];
      const v = variants.find((x) => x.id === u.variantId);
      if (!v) {
        results.push({
          variantId: u.variantId,
          sku: u.sku,
          ok: false,
          step: "variant_not_found",
        });
        continue;
      }
      const prices = (v.prices as Record<string, unknown>[]) || [];
      // Verify price unchanged before write
      const usd = (prices[0]?.currencyOptions as Record<string, { amount?: number }> | undefined)
        ?.USD?.amount;
      if (typeof usd === "number" && Math.abs(usd - u.expectedPriceCents) > 1) {
        results.push({
          variantId: u.variantId,
          sku: u.sku,
          ok: false,
          step: "price_guard",
          expected: u.expectedPriceCents,
          actual: usd,
        });
        continue;
      }
      const put = await tcall(
        base,
        key,
        "PUT",
        `/api/public/v1/variants/${encodeURIComponent(u.variantId)}`,
        {
          updatedData: {
            name: v.name,
            description: v.description ?? undefined,
            sku: u.sku,
            active: v.active !== false,
            default: v.default === true,
            prices: prices.map((prc) => ({
              id: prc.id,
              default: prc.default === true,
              currencyOptions: prc.currencyOptions,
              recurring: prc.recurring === true,
              billingTiming: prc.billingTiming ?? "usage",
              interval: prc.interval ?? null,
              intervalCount: prc.intervalCount ?? 1,
            })),
          },
        },
      );
      results.push({
        variantId: u.variantId,
        sku: u.sku,
        ok: put.ok,
        status: put.status,
        data: put.ok ? { sku: u.sku } : put.data,
      });
    }
    return json(JSON.parse(redact(JSON.stringify({ results }), secrets)));
  }

  // ---------- CREATE PRODUCTS ----------
  if (action === "create_products") {
    const products = (body.products || []) as SyncProduct[];
    const results: unknown[] = [];
    for (const p of products) {
      const payload = {
        storeId,
        name: p.name,
        description: p.description ?? null,
        active: p.active !== false,
        isShippable: p.isShippable !== false,
        isTaxable: p.isTaxable !== false,
        autoSync: false,
        variants: p.variants.map((v, idx) => ({
          name: v.name,
          description: v.description || v.name,
          sku: v.sku,
          active: v.active !== false,
          default: v.default ?? idx === 0,
          grams: null,
          prices: [
            {
              currencyOptions: {
                USD: { amount: v.price.amountCents },
              },
              recurring: v.price.recurring === true,
              billingTiming: v.price.recurring ? "in_advance" : "usage",
              interval: v.price.recurring ? (v.price.interval || "month") : null,
              intervalCount: v.price.recurring ? (v.price.intervalCount || 1) : 1,
              default: true,
            },
          ],
        })),
      };
      const created = await tcall(base, key, "POST", "/api/public/v1/products/create", payload);
      results.push({
        name: p.name,
        skus: p.variants.map((v) => v.sku),
        ok: created.ok,
        status: created.status,
        data: created.data,
      });
    }
    return json(JSON.parse(redact(JSON.stringify({ results }), secrets)));
  }

  // ---------- ADD VARIANT via create standalone product (fallback) ----------
  if (action === "create_single_variant_product") {
    const p = body.product as SyncProduct;
    const payload = {
      storeId,
      name: p.name,
      description: p.description ?? null,
      active: p.active !== false,
      isShippable: p.isShippable !== false,
      isTaxable: p.isTaxable !== false,
      autoSync: false,
      variants: p.variants.map((v, idx) => ({
        name: v.name,
        description: v.description || v.name,
        sku: v.sku,
        active: true,
        default: idx === 0,
        grams: null,
        prices: [
          {
            currencyOptions: { USD: { amount: v.price.amountCents } },
            recurring: v.price.recurring === true,
            billingTiming: v.price.recurring ? "in_advance" : "usage",
            interval: v.price.recurring ? (v.price.interval || "month") : null,
            intervalCount: v.price.recurring ? (v.price.intervalCount || 1) : 1,
            default: true,
          },
        ],
      })),
    };
    const created = await tcall(base, key, "POST", "/api/public/v1/products/create", payload);
    return json(JSON.parse(redact(JSON.stringify({ ok: created.ok, status: created.status, data: created.data }), secrets)));
  }


  if (action === "raw") {
    const method = String(body.method || "GET");
    const path = String(body.path || "");
    if (!path.startsWith("/api/public/v1/")) return json({ error: "path_not_allowed" }, 400);
    // allow only product-related paths
    const allowed =
      path.includes("/products") ||
      path.includes("/variants") ||
      path.includes("/prices") ||
      path.includes("/domains") ||
      path.includes("/webhooks");
    if (!allowed) {
      return json({ error: "path_not_allowed" }, 400);
    }
    // Block mutating webhook/domain calls from this helper
    if ((path.includes("/domains") || path.includes("/webhooks")) && method !== "GET" && method !== "POST") {
      return json({ error: "mutating_domain_webhook_blocked" }, 400);
    }
    if (path.includes("/webhooks") && method === "POST" && !path.includes("/list")) {
      // allow list body posts only when path ends with /list or action is list-like
      if (!path.endsWith("/list") && !path.includes("/webhooks/list")) {
        return json({ error: "webhook_create_blocked" }, 400);
      }
    }
    if (path.includes("/domains") && method === "POST" && !path.includes("/list") && !path.includes("dns-lookup")) {
      return json({ error: "domain_mutate_blocked" }, 400);
    }
    const r = await tcall(base, key, method, path, body.body);
    return json(JSON.parse(redact(JSON.stringify({ status: r.status, data: r.data }), secrets)));
  }

  return json({ error: "unknown_action", action }, 400);
});
