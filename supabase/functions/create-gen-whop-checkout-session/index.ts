import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Create a GEN Hosted Checkout session → Whop redirect for an existing unpaid MBM order.
 *
 * Safety:
 * - GEN_WHOP_CHECKOUT_ENABLED defaults FALSE (no production cutover).
 * - Never exposes GEN_STOREFRONT_KEY / GEN_HEALTH_API_KEY to the browser.
 * - Browser never supplies GEN product IDs — derived from gen_whop_checkout_map.
 * - Accessories / SEM-TIRZ membership stay on Tagada paths.
 * - Browser redirect never marks paid.
 *
 * Secrets (server): GEN_STOREFRONT_KEY, GEN_HEALTH_BASE_URL, GEN_WHOP_CHECKOUT_ENABLED,
 *   MBM_SITE_ORIGIN, SUPABASE_*.
 */

import {
  buildGenWhopIdempotencyKey,
  createCorrelationId,
  evaluateGenWhopCheckoutCart,
  isApprovedWhopCheckoutRedirectUrl,
  isProviderCareSku,
  isShippingSku,
  mapDbRowToCheckoutMap,
  resolveGenWhopCheckoutEnabled,
  type GenWhopCheckoutMapRow,
} from "../_shared/genWhopCheckout.ts";
import { GEN_HEALTH_DEFAULT_BASE_URL } from "../_shared/genHealthConfig.ts";

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

function resolveApiBase(): string {
  const raw = (Deno.env.get("GEN_HEALTH_BASE_URL") || "").trim();
  if (!raw) return GEN_HEALTH_DEFAULT_BASE_URL;
  try {
    const u = new URL(raw);
    if (u.hostname === "api.gen-health.app") return raw.replace(/\/+$/, "");
  } catch {
    /* fall through */
  }
  return GEN_HEALTH_DEFAULT_BASE_URL;
}

function siteOrigin(): string {
  return (Deno.env.get("MBM_SITE_ORIGIN") || "").trim() || "https://mybaremethod.com";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const correlationId = createCorrelationId("gw");

  try {
    if (!resolveGenWhopCheckoutEnabled()) {
      return json(
        {
          error: "GEN/Whop hosted checkout is not enabled.",
          code: "GEN_WHOP_CHECKOUT_DISABLED",
          correlationId,
        },
        503,
      );
    }

    const storefrontKey = (Deno.env.get("GEN_STOREFRONT_KEY") || "").trim();
    if (!storefrontKey) {
      return json(
        {
          error: "GEN storefront checkout is not configured.",
          code: "GEN_STOREFRONT_KEY_ABSENT",
          correlationId,
        },
        503,
      );
    }

    const body = await req.json().catch(() => ({}));
    const publicOrderNumber = String(body.publicOrderNumber ?? "").trim().toUpperCase();
    const paymentAccessToken = String(body.paymentAccessToken ?? "").trim();
    if (!publicOrderNumber || !paymentAccessToken) {
      return json({ error: "Order number and payment access token are required.", correlationId }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      return json({ error: "Order service is not configured.", correlationId }, 500);
    }

    const dbHeaders = {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?public_order_number=eq.${encodeURIComponent(publicOrderNumber)}&select=*&limit=1`,
      { headers: dbHeaders },
    );
    if (!orderRes.ok) return json({ error: "Unable to load order.", correlationId }, 500);
    const orders = await orderRes.json();
    const order = Array.isArray(orders) ? orders[0] : null;
    if (!order) return json({ error: "Order not found.", correlationId }, 404);
    if (order.payment_access_token !== paymentAccessToken) {
      return json({ error: "Invalid payment access token.", correlationId }, 403);
    }
    if (order.payment_method !== "gen_whop") {
      return json(
        {
          error: "This order is not a GEN/Whop checkout order.",
          code: "WRONG_PAYMENT_METHOD",
          correlationId,
        },
        400,
      );
    }
    if (order.payment_status === "paid") {
      return json({ error: "This order is already paid.", correlationId }, 409);
    }
    if (order.payment_status !== "awaiting_payment" && order.payment_status !== "payment_failed") {
      return json(
        {
          error: `Cannot start GEN/Whop checkout from status "${order.payment_status}".`,
          correlationId,
        },
        409,
      );
    }

    const itemsRes = await fetch(
      `${supabaseUrl}/rest/v1/order_items?order_id=eq.${order.id}&select=sku,quantity,unit_price_cents,product_name_snapshot,product_id`,
      { headers: dbHeaders },
    );
    if (!itemsRes.ok) return json({ error: "Unable to load order items.", correlationId }, 500);
    const orderItems = await itemsRes.json();
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return json({ error: "Order has no line items.", correlationId }, 400);
    }

    const cartLines = orderItems
      .filter((i: { sku?: string | null }) => i.sku)
      .map((i: {
        sku: string;
        quantity: number;
        unit_price_cents?: number | null;
        product_id?: string | null;
      }) => ({
        mbmSku: String(i.sku),
        quantity: Number(i.quantity) || 1,
        unitAmountCents: i.unit_price_cents ?? null,
        // order_items has no purchase_type column on staging/prod — default one_time;
        // membership/auto-refill are identified by SKU prefix in policy.
        purchaseType: "one_time",
      }));

    const productSkus = [
      ...new Set(
        cartLines
          .map((l) => l.mbmSku)
          .filter((s) => !isShippingSku(s) && !isProviderCareSku(s)),
      ),
    ];
    if (productSkus.length === 0) {
      return json({ error: "Order has no GEN-mappable product SKUs.", correlationId }, 400);
    }

    const mapRes = await fetch(
      `${supabaseUrl}/rest/v1/gen_whop_checkout_map?mbm_sku=in.(${
        productSkus.map((s) => `"${s.replace(/"/g, "")}"`).join(",")
      })&select=*`,
      { headers: dbHeaders },
    );
    if (!mapRes.ok) {
      return json(
        {
          error: "Unable to load GEN/Whop checkout mappings. Ensure migration is applied.",
          code: "MAP_TABLE_UNAVAILABLE",
          correlationId,
        },
        503,
      );
    }
    const mapRows = await mapRes.json();
    const mapsBySku: Record<string, GenWhopCheckoutMapRow | undefined> = {};
    if (Array.isArray(mapRows)) {
      for (const row of mapRows) {
        const mapped = mapDbRowToCheckoutMap(row as Record<string, unknown>);
        mapsBySku[mapped.mbmSku] = mapped;
        mapsBySku[mapped.mbmSku.toUpperCase()] = mapped;
      }
    }

    const evaluation = evaluateGenWhopCheckoutCart({
      featureEnabled: true,
      lines: cartLines,
      mapsBySku,
    });
    if (!evaluation.ok) {
      return json(
        {
          error: evaluation.reason,
          code: evaluation.code,
          route: evaluation.route,
          correlationId,
        },
        409,
      );
    }

    const eligible = evaluation.lines[0];
    const map = eligible.map;
    const idempotencyKey = buildGenWhopIdempotencyKey({
      publicOrderNumber,
      mbmSku: map.mbmSku,
    });

    // Duplicate protection: reuse existing open session for same idempotency key
    const existingRes = await fetch(
      `${supabaseUrl}/rest/v1/gen_checkout_sessions?idempotency_key=eq.${
        encodeURIComponent(idempotencyKey)
      }&select=*&limit=1`,
      { headers: dbHeaders },
    );
    if (existingRes.ok) {
      const existingRows = await existingRes.json();
      const existing = Array.isArray(existingRows) ? existingRows[0] : null;
      if (
        existing &&
        existing.whop_checkout_url &&
        ["created", "redirect_issued", "processing"].includes(String(existing.status))
      ) {
        const approved = isApprovedWhopCheckoutRedirectUrl(String(existing.whop_checkout_url));
        if (approved.ok) {
          console.log(
            `[gen-whop-checkout] reuse cid=${correlationId} order=${publicOrderNumber} session=${existing.gen_checkout_session_id}`,
          );
          return json({
            ok: true,
            reused: true,
            redirectUrl: approved.url.toString(),
            publicOrderNumber,
            genCheckoutSessionId: existing.gen_checkout_session_id,
            whopCheckoutConfigId: existing.whop_checkout_config_id,
            expectedAmountCents: existing.expected_amount_cents,
            currency: existing.currency,
            purchaseMode: existing.purchase_mode,
            correlationId,
            status: existing.status,
          });
        }
      }
    }

    const apiBase = resolveApiBase();
    const origin = siteOrigin();
    const createRes = await fetch(`${apiBase}/v2/client/storefront/checkout/sessions`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Storefront-Key": storefrontKey,
        Origin: origin,
        Referer: `${origin}/`,
        "X-Correlation-Id": correlationId,
      },
      body: JSON.stringify({
        clientProductId: map.genClientProductId,
        productId: map.genProductId,
        quantity: eligible.quantity || 1,
      }),
    });
    const createText = await createRes.text();
    let createJson: unknown = null;
    try {
      createJson = createText ? JSON.parse(createText) : null;
    } catch {
      createJson = null;
    }

    if (!createRes.ok) {
      const errMsg =
        createJson && typeof createJson === "object" &&
          typeof (createJson as Record<string, unknown>).error === "string"
          ? String((createJson as Record<string, unknown>).error).slice(0, 240)
          : `GEN storefront session create failed (HTTP ${createRes.status})`;
      console.log(
        `[gen-whop-checkout] create_fail cid=${correlationId} order=${publicOrderNumber} http=${createRes.status}`,
      );
      return json(
        {
          error: errMsg,
          code: "GEN_SESSION_CREATE_FAILED",
          correlationId,
        },
        502,
      );
    }

    const root =
      createJson && typeof createJson === "object"
        ? (createJson as Record<string, unknown>)
        : {};
    const data =
      root.data && typeof root.data === "object"
        ? (root.data as Record<string, unknown>)
        : root;
    const sess =
      data.session && typeof data.session === "object"
        ? (data.session as Record<string, unknown>)
        : data;

    const genSessionId =
      (typeof sess.checkoutSessionId === "string" && sess.checkoutSessionId) ||
      (typeof sess.id === "string" && sess.id) ||
      null;
    const whopUrl =
      (typeof sess.whopCheckoutUrl === "string" && sess.whopCheckoutUrl) ||
      (typeof sess.checkoutUrl === "string" && sess.checkoutUrl) ||
      null;
    const whopConfigId =
      (typeof sess.whopCheckoutConfigId === "string" && sess.whopCheckoutConfigId) ||
      null;

    if (!genSessionId || !whopUrl) {
      return json(
        {
          error: "GEN session response missing session id or Whop checkout URL.",
          code: "GEN_SESSION_INCOMPLETE",
          correlationId,
        },
        502,
      );
    }

    const approved = isApprovedWhopCheckoutRedirectUrl(whopUrl);
    if (!approved.ok) {
      return json(
        { error: approved.error, code: "UNAPPROVED_REDIRECT", correlationId },
        502,
      );
    }

    const insertBody = {
      order_id: order.id,
      public_order_number: publicOrderNumber,
      mbm_sku: map.mbmSku,
      gen_product_id: map.genProductId,
      gen_client_product_id: map.genClientProductId,
      purchase_mode: map.purchaseMode,
      expected_amount_cents: map.retailAmountCents,
      currency: map.currency,
      gen_checkout_session_id: genSessionId,
      whop_checkout_config_id: whopConfigId,
      whop_checkout_url: approved.url.toString(),
      status: "redirect_issued",
      correlation_id: correlationId,
      idempotency_key: idempotencyKey,
    };

    const ins = await fetch(`${supabaseUrl}/rest/v1/gen_checkout_sessions`, {
      method: "POST",
      headers: dbHeaders,
      body: JSON.stringify(insertBody),
    });
    if (!ins.ok) {
      const insText = await ins.text();
      // Unique violation → race; try reload
      if (ins.status === 409 || /duplicate|unique/i.test(insText)) {
        const again = await fetch(
          `${supabaseUrl}/rest/v1/gen_checkout_sessions?idempotency_key=eq.${
            encodeURIComponent(idempotencyKey)
          }&select=*&limit=1`,
          { headers: dbHeaders },
        );
        const rows = again.ok ? await again.json() : [];
        const row = Array.isArray(rows) ? rows[0] : null;
        if (row?.whop_checkout_url) {
          return json({
            ok: true,
            reused: true,
            redirectUrl: String(row.whop_checkout_url),
            publicOrderNumber,
            genCheckoutSessionId: row.gen_checkout_session_id,
            whopCheckoutConfigId: row.whop_checkout_config_id,
            expectedAmountCents: row.expected_amount_cents,
            currency: row.currency,
            purchaseMode: row.purchase_mode,
            correlationId,
            status: row.status,
          });
        }
      }
      console.log(
        `[gen-whop-checkout] persist_fail cid=${correlationId} order=${publicOrderNumber} http=${ins.status}`,
      );
      return json(
        {
          error: "Unable to persist checkout session correlation.",
          code: "CORRELATION_PERSIST_FAILED",
          correlationId,
        },
        500,
      );
    }

    // Stamp processor on order (safe metadata)
    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
      method: "PATCH",
      headers: dbHeaders,
      body: JSON.stringify({
        payment_processor: "gen_whop",
      }),
    }).catch(() => null);

    console.log(
      `[gen-whop-checkout] created cid=${correlationId} order=${publicOrderNumber} genSession=${genSessionId} whopConfig=${whopConfigId || "n/a"}`,
    );

    return json({
      ok: true,
      reused: false,
      redirectUrl: approved.url.toString(),
      publicOrderNumber,
      genCheckoutSessionId: genSessionId,
      whopCheckoutConfigId: whopConfigId,
      expectedAmountCents: map.retailAmountCents,
      currency: map.currency,
      purchaseMode: map.purchaseMode,
      productName: "mapped",
      mbmSku: map.mbmSku,
      correlationId,
      status: "redirect_issued",
      // Explicit: payment not created yet
      paymentSubmitted: false,
    });
  } catch (e) {
    console.log(`[gen-whop-checkout] error cid=${correlationId} ${e instanceof Error ? e.message : "unknown"}`);
    return json({ error: "Unexpected error starting GEN/Whop checkout.", correlationId }, 500);
  }
});
