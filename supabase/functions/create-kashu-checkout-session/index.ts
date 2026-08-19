import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Create a Kashu / TagadaPay hosted checkout session for an existing MBM order.
 *
 * Official docs:
 * - createSession / GET /api/public/v1/checkout/init
 *   https://docs.tagada.io/developer-tools/node-sdk/checkout-sessions
 * - API bases: https://api.tagada.io (prod), https://api.tagada.dev (sandbox)
 *
 * Flow:
 * 1. MBM order already persisted (create-invoice-order) with authoritative total_cents
 * 2. This function maps order_items.sku → Tagada variantId via kashu_sku_map
 * 3. Calls Tagada checkout init and returns redirectUrl
 *
 * NEVER trusts frontend amounts. NEVER exposes API secrets to the browser.
 * DO NOT deploy until TAGADA_* secrets + kashu_sku_map rows exist.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function apiBase(): string {
  const env = Deno.env.get("TAGADA_API_BASE")?.trim();
  if (env) return env.replace(/\/$/, "");
  const mode = Deno.env.get("TAGADA_ENV")?.trim().toLowerCase();
  if (mode === "sandbox" || mode === "dev") return "https://api.tagada.dev";
  return "https://api.tagada.io";
}

function buildInitUrl(params: {
  storeId: string;
  items: { variantId: string; quantity: number }[];
  currency: string;
  checkoutUrl: string;
  returnUrl: string;
  customerEmail?: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerTags?: string[];
}): string {
  const q = new URLSearchParams();
  q.set("storeId", params.storeId);
  q.set("currency", params.currency);
  q.set("items", JSON.stringify(params.items));
  q.set("checkoutUrl", params.checkoutUrl);
  q.set("returnUrl", params.returnUrl);
  if (params.customerEmail) q.set("customerEmail", params.customerEmail);
  if (params.customerFirstName) q.set("customerFirstName", params.customerFirstName);
  if (params.customerLastName) q.set("customerLastName", params.customerLastName);
  if (params.customerTags?.length) q.set("customerTags", params.customerTags.join(","));
  return `${apiBase()}/api/public/v1/checkout/init?${q.toString()}`;
}

function extractToken(redirectUrl: string): string | null {
  try {
    const u = new URL(redirectUrl);
    return u.searchParams.get("checkoutToken") || u.searchParams.get("token");
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const publicOrderNumber = String(body.publicOrderNumber ?? "").trim().toUpperCase();
    const paymentAccessToken = String(body.paymentAccessToken ?? "").trim();
    if (!publicOrderNumber || !paymentAccessToken) {
      return json({ error: "Order number and payment access token are required." }, 400);
    }

    const storeId = Deno.env.get("TAGADA_STORE_ID")?.trim();
    const checkoutUrl = Deno.env.get("TAGADA_CHECKOUT_URL")?.trim();
    const siteOrigin = Deno.env.get("MBM_SITE_ORIGIN")?.trim() || "https://mybaremethod.com";
    if (!storeId || !checkoutUrl) {
      return json({
        error:
          "Kashu card checkout is not configured (missing TAGADA_STORE_ID or TAGADA_CHECKOUT_URL).",
      }, 503);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      return json({ error: "Order service is not configured." }, 500);
    }

    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?public_order_number=eq.${encodeURIComponent(publicOrderNumber)}&select=*&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    if (!orderRes.ok) return json({ error: "Unable to load order." }, 500);
    const orders = await orderRes.json();
    const order = Array.isArray(orders) ? orders[0] : null;
    if (!order) return json({ error: "Order not found." }, 404);
    if (order.payment_access_token !== paymentAccessToken) {
      return json({ error: "Invalid payment access token." }, 403);
    }
    if (order.payment_method !== "kashu_card") {
      return json({ error: "This order is not a Kashu card checkout order." }, 400);
    }
    if (order.payment_status === "paid") {
      return json({ error: "This order is already paid." }, 409);
    }
    if (order.payment_status !== "awaiting_payment" && order.payment_status !== "payment_failed") {
      return json({ error: `Cannot start card checkout from status "${order.payment_status}".` }, 409);
    }

    const itemsRes = await fetch(
      `${supabaseUrl}/rest/v1/order_items?order_id=eq.${order.id}&select=sku,variant_id,quantity,product_name_snapshot`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    if (!itemsRes.ok) return json({ error: "Unable to load order items." }, 500);
    const orderItems = await itemsRes.json();
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return json({ error: "Order has no line items." }, 400);
    }

    const skus = [...new Set(orderItems.map((i: { sku: string | null }) => i.sku).filter(Boolean))];
    if (skus.length === 0) {
      return json({
        error: "Order items are missing SKUs. Cannot map to Kashu/Tagada variants.",
      }, 400);
    }

    const mapRes = await fetch(
      `${supabaseUrl}/rest/v1/kashu_sku_map?mbm_sku=in.(${skus.map((s: string) => `"${s}"`).join(",")})&is_active=eq.true&select=mbm_sku,tagada_variant_id,tagada_product_id`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    if (!mapRes.ok) {
      return json({
        error:
          "Kashu SKU map is unavailable. Apply the kashu_card migration and sync Tagada products first.",
        detail: await mapRes.text(),
      }, 503);
    }
    const maps = await mapRes.json();
    const bySku = new Map<string, { tagada_variant_id: string }>(
      (Array.isArray(maps) ? maps : []).map((m: { mbm_sku: string; tagada_variant_id: string }) => [
        m.mbm_sku,
        m,
      ]),
    );

    const missing: string[] = [];
    const tagadaItems: { variantId: string; quantity: number }[] = [];
    for (const line of orderItems) {
      const sku = line.sku as string | null;
      if (!sku) {
        missing.push(String(line.product_name_snapshot || "item"));
        continue;
      }
      const mapped = bySku.get(sku);
      if (!mapped?.tagada_variant_id) {
        missing.push(sku);
        continue;
      }
      tagadaItems.push({
        variantId: mapped.tagada_variant_id,
        quantity: Number(line.quantity) || 1,
      });
    }
    if (missing.length) {
      return json({
        error:
          "Tagada product sync incomplete. Missing kashu_sku_map rows for one or more SKUs.",
        missingSkus: missing,
      }, 409);
    }

    const nameParts = String(order.customer_name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || undefined;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined;
    const returnUrl =
      `${siteOrigin}/order/card-result/${encodeURIComponent(publicOrderNumber)}` +
      `?token=${encodeURIComponent(paymentAccessToken)}`;

    const initUrl = buildInitUrl({
      storeId,
      items: tagadaItems,
      currency: "USD",
      checkoutUrl,
      returnUrl,
      customerEmail: order.customer_email || undefined,
      customerFirstName: firstName,
      customerLastName: lastName,
      customerTags: [`mbmOrder:${publicOrderNumber}`],
    });

    // Official public checkout init — follows 302 to hosted checkout URL.
    const initRes = await fetch(initUrl, { redirect: "manual", method: "GET" });
    const location = initRes.headers.get("Location") || initRes.headers.get("location");
    if (!location && !initRes.ok) {
      return json({
        error: "Unable to create Kashu checkout session.",
        detail: await initRes.text(),
      }, 502);
    }
    const redirectUrl = location || (await initRes.json().catch(() => null))?.redirectUrl;
    if (!redirectUrl || typeof redirectUrl !== "string") {
      return json({
        error: "Kashu checkout did not return a redirect URL.",
        status: initRes.status,
      }, 502);
    }

    const checkoutToken = extractToken(redirectUrl);
    // Persist session linkage (columns require migration 20260811210000_kashu_card_payments.sql)
    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        payment_processor: "kashu_tagada",
        external_checkout_token: checkoutToken,
        // external_checkout_session_id filled when webhook/API provides it
      }),
    });

    return json({
      ok: true,
      redirectUrl,
      checkoutToken,
      publicOrderNumber,
      // Authoritative total for client display only — Kashu charges Tagada catalog prices.
      orderTotalCents: order.total_cents,
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
