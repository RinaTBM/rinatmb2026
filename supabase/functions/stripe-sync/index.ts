import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Admin-guarded, TEST-ONLY Stripe sync. Never touches LIVE Stripe (live keys refused).
// Flow: verify caller is an admin → read catalog rows from Supabase → dry-run plan or
// apply (create/update products, create new prices idempotently, archive replaced prices
// AFTER the new one is stored) → write Stripe IDs + sync log back to Supabase.
// Secrets are read from Deno.env and never returned to the client.

const APP = "my-bare-method";
const ENV = "test";
const SCHEMA_VERSION = "1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

function stableHash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
const productFp = (slug: string) => `product:${ENV}:${slug}`;
const priceFp = (slug: string, variantKey: string, amount: number, currency: string, billingType: string, interval: string | null) =>
  ["price", ENV, slug, variantKey || "_", String(amount), currency, billingType, interval ?? "_"].join(":");
const idemKey = (kind: string, fp: string) => `mbm_${kind}_${stableHash(fp)}`;

function assertTestKey(key: string | undefined): string {
  if (!key) throw new Error("STRIPE_SECRET_KEY_TEST is not set.");
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_")) throw new Error("Refusing LIVE Stripe key. This action is TEST-only.");
  if (!(key.startsWith("sk_test_") || key.startsWith("rk_test_"))) throw new Error("Provided key is not a Stripe TEST key.");
  return key;
}

async function stripe(key: string, method: string, path: string, params?: URLSearchParams, idempotencyKey?: string) {
  const headers: Record<string, string> = { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  const res = await fetch(`https://api.stripe.com/v1${path}`, { method, headers, body: params });
  const txt = await res.text();
  const data = txt ? JSON.parse(txt) : {};
  if (!res.ok) throw new Error(data?.error?.message || `Stripe ${res.status}`);
  return data;
}

async function sb(url: string, key: string, method: string, path: string, body?: unknown, extraHeaders: Record<string, string> = {}) {
  const res = await fetch(`${url}${path}`, {
    method,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...extraHeaders },
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await res.text();
  return { ok: res.ok, status: res.status, data: txt ? JSON.parse(txt) : null };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  // Prefer the platform-provided SUPABASE_ANON_KEY; VITE_SUPABASE_ANON_KEY is only a
  // backward-compatible fallback. The anon key is used solely to verify the caller's
  // session below — the service-role key is NEVER used for caller authentication.
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("VITE_SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceKey || !anonKey) return json({ error: "Server not configured" }, 500);

  // --- Admin authorization (server-side) ---
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Missing authorization" }, 401);
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } });
  if (!userRes.ok) return json({ error: "Invalid session" }, 401);
  const user = await userRes.json();
  // Verify the caller is an ACTIVE admin (is_active = true). Google sign-in alone is not enough.
  const adminCheck = await sb(supabaseUrl, serviceKey, "GET", `/rest/v1/admins?user_id=eq.${user.id}&is_active=eq.true&select=user_id,is_active`);
  const adminRows = adminCheck.data as Array<{ is_active?: boolean }> | null;
  const isActiveAdmin = adminCheck.ok && Array.isArray(adminRows) && adminRows.length > 0 && adminRows.every((r) => r.is_active === true);
  if (!isActiveAdmin) {
    return json({ error: "Forbidden: active admin access required" }, 403);
  }

  let action = "dry-run";
  try { const body = await req.json(); action = body?.action === "apply" ? "apply" : "dry-run"; } catch { /* default */ }

  // Test/admin sync prefers STRIPE_SECRET_KEY_TEST, falling back to STRIPE_SECRET_KEY for
  // backward compatibility. There is NO live-key fallback: assertTestKey() refuses any
  // sk_live_/rk_live_ key regardless of which variable it came from.
  let key: string;
  try { key = assertTestKey(Deno.env.get("STRIPE_SECRET_KEY_TEST") || Deno.env.get("STRIPE_SECRET_KEY")); }
  catch (e) { return json({ error: (e as Error).message }, 400); }

  // --- Load catalog from Supabase (active + visible only) ---
  const prodRes = await sb(supabaseUrl, serviceKey, "GET", `/rest/v1/catalog_products?is_visible=eq.true&status=eq.active&select=*,catalog_variants(*)`);
  const memRes = await sb(supabaseUrl, serviceKey, "GET", `/rest/v1/catalog_memberships?is_visible=eq.true&status=eq.active&select=*`);
  if (!prodRes.ok || !memRes.ok) return json({ error: "Failed to load catalog" }, 500);
  const products = prodRes.data as Array<Record<string, unknown>>;
  const memberships = memRes.data as Array<Record<string, unknown>>;

  const plan: Array<Record<string, unknown>> = [];
  const applied: Array<Record<string, unknown>> = [];

  async function findProductId(slug: string): Promise<string | undefined> {
    const query = encodeURIComponent(`metadata['catalog_slug']:'${slug}' AND metadata['environment']:'${ENV}'`);
    const r = await stripe(key, "GET", `/products/search?query=${query}`);
    const active = (r.data || []).filter((p: { active: boolean }) => p.active);
    return active[0]?.id;
  }
  async function findActivePrice(productId: string, fp: string): Promise<string | undefined> {
    const r = await stripe(key, "GET", `/prices?product=${productId}&active=true&limit=100`);
    return (r.data || []).find((p: { metadata?: Record<string, string> }) => p.metadata?.price_fingerprint === fp)?.id;
  }

  async function log(entityType: string, entityId: string, operation: string, objType: string, objId: string | null, status: string, fingerprint: string, error?: string) {
    await sb(supabaseUrl!, serviceKey!, "POST", "/rest/v1/stripe_sync_log", {
      environment: ENV, entity_type: entityType, entity_id: entityId, operation,
      stripe_object_type: objType, stripe_object_id: objId, status, request_fingerprint: fingerprint,
      error_message: error ?? null, completed_at: new Date().toISOString(),
    }, { Prefer: "return=minimal" });
  }

  async function syncEntity(kind: "product" | "membership", row: Record<string, unknown>, prices: Array<{ variantKey: string; amount: number; currency: string; interval: string | null; variantId?: string }>, table: string) {
    const slug = row.slug as string;
    const name = row.display_name as string;
    const description = (row.short_description as string) || "";
    let productId = (row.stripe_product_id_test as string) || (await findProductId(slug));
    const md = { app: APP, catalog_entity_type: kind, catalog_entity_id: slug, catalog_slug: slug, environment: ENV, schema_version: SCHEMA_VERSION };

    if (action === "dry-run") {
      plan.push({ op: productId ? "update_product" : "create_product", entityType: kind, slug, existingStripeProductId: productId ?? null });
    } else {
      if (productId) {
        const p = new URLSearchParams({ name, description, active: "true" });
        Object.entries(md).forEach(([k, v]) => p.append(`metadata[${k}]`, v));
        await stripe(key, "POST", `/products/${productId}`, p);
      } else {
        const p = new URLSearchParams({ name, description, active: "true" });
        Object.entries(md).forEach(([k, v]) => p.append(`metadata[${k}]`, v));
        const created = await stripe(key, "POST", `/products`, p, idemKey("product", productFp(slug)));
        productId = created.id;
      }
      await sb(supabaseUrl!, serviceKey!, "PATCH", `/rest/v1/${table}?slug=eq.${slug}`, { stripe_product_id_test: productId, stripe_sync_status: "synced" }, { Prefer: "return=minimal" });
      await log(kind, slug, "sync_product", "product", productId!, "succeeded", productFp(slug));
    }

    for (const pr of prices) {
      const fp = priceFp(slug, pr.variantKey, pr.amount, pr.currency, pr.interval ? "recurring" : "one_time", pr.interval);
      const existingPriceId = productId ? await findActivePrice(productId, fp) : undefined;
      if (action === "dry-run") {
        plan.push({ op: existingPriceId ? "reuse_price" : "create_price", entityType: kind, slug, variantKey: pr.variantKey || null, amountCents: pr.amount, interval: pr.interval, existingStripePriceId: existingPriceId ?? null });
        continue;
      }
      if (existingPriceId) { await log(kind, `${slug}:${pr.variantKey}`, "reuse_price", "price", existingPriceId, "succeeded", fp); continue; }
      const params = new URLSearchParams({ product: productId!, unit_amount: String(pr.amount), currency: pr.currency });
      if (pr.interval) { params.append("recurring[interval]", pr.interval); params.append("recurring[interval_count]", "1"); }
      const priceMd = { ...md, catalog_variant_key: pr.variantKey, price_fingerprint: fp };
      Object.entries(priceMd).forEach(([k, v]) => params.append(`metadata[${k}]`, v));
      const createdPrice = await stripe(key, "POST", `/prices`, params, idemKey("price", fp));
      // Write price id back
      if (kind === "membership") {
        await sb(supabaseUrl!, serviceKey!, "PATCH", `/rest/v1/catalog_memberships?slug=eq.${slug}`, { stripe_price_id_test: createdPrice.id, stripe_sync_status: "synced" }, { Prefer: "return=minimal" });
      } else if (pr.variantId) {
        await sb(supabaseUrl!, serviceKey!, "PATCH", `/rest/v1/catalog_variants?id=eq.${pr.variantId}`, { stripe_price_id_test: createdPrice.id, stripe_sync_status: "synced" }, { Prefer: "return=minimal" });
      }
      await log(kind, `${slug}:${pr.variantKey}`, "create_price", "price", createdPrice.id, "succeeded", fp);
      applied.push({ slug, variantKey: pr.variantKey || null, priceId: createdPrice.id });
    }
  }

  try {
    for (const p of products) {
      const variants = ((p.catalog_variants as Array<Record<string, unknown>>) || []).filter((v) => v.is_active);
      await syncEntity("product", p, variants.map((v) => ({
        variantKey: v.variant_key as string, amount: v.price_cents as number, currency: (v.currency as string) || "usd",
        interval: (v.billing_interval as string | null) ?? null, variantId: v.id as string,
      })), "catalog_products");
    }
    for (const m of memberships) {
      await syncEntity("membership", m, [{
        variantKey: "", amount: m.monthly_price_cents as number, currency: (m.currency as string) || "usd", interval: "month",
      }], "catalog_memberships");
    }
  } catch (e) {
    return json({ error: (e as Error).message, environment: ENV }, 500);
  }

  return json({ environment: ENV, action, plan: action === "dry-run" ? plan : undefined, applied: action === "apply" ? applied : undefined });
});
