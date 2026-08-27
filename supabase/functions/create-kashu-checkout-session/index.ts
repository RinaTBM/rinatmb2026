import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { resolveKashuSkuMapRow } from "../_shared/launchReadyKashuMap.ts";

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
  items: { variantId: string; quantity: number; priceId?: string }[];
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

/** MBM shipping SKUs — used for ONE-TIME product carts only (not membership enrollment). */
const SHIP_SKU_TWO_DAY = "MBM-SHIP-TWO-DAY-001";
const SHIP_SKU_NEXT_DAY = "MBM-SHIP-NEXT-DAY-001";

function shippingSkuForCents(shippingCents: number): string | null {
  if (shippingCents === 3000) return SHIP_SKU_TWO_DAY;
  if (shippingCents === 5000) return SHIP_SKU_NEXT_DAY;
  return null;
}

const OGTBM_EXCLUDED_SKU_PREFIXES = ["MBM-ACC-", "MBM-SH-", "MBM-PC-", "MBM-MEM-", "MBM-SHIP-"];

function isOgtbmEligibleSku(sku: string): boolean {
  const s = sku.toUpperCase();
  return !OGTBM_EXCLUDED_SKU_PREFIXES.some((p) => s.startsWith(p));
}

async function ensureTagadaOneTimePrice(input: {
  apiKey: string;
  productId: string;
  variantId: string;
  amountCents: number;
}): Promise<string | null> {
  const base = Deno.env.get("TAGADA_API_BASE")?.trim()?.replace(/\/$/, "") || "https://api.tagada.io";
  const got = await fetch(`${base}/api/public/v1/products/${encodeURIComponent(input.productId)}`, {
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      Accept: "application/json",
    },
  });
  if (!got.ok) return null;
  const product = await got.json();
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const v = variants.find((x: { id?: string }) => x.id === input.variantId);
  if (!v) return null;
  const prices = Array.isArray(v.prices) ? v.prices : [];
  for (const prc of prices) {
    const amount = prc?.currencyOptions?.USD?.amount;
    const recurring = prc?.recurring === true;
    if (!recurring && Number(amount) === input.amountCents && typeof prc.id === "string") {
      return prc.id;
    }
  }
  const nextPrices = [
    ...prices.map((prc: Record<string, unknown>, idx: number) => ({
      id: prc.id,
      default: prc.default === true || idx === 0,
      currencyOptions: prc.currencyOptions,
      recurring: prc.recurring === true,
      billingTiming: prc.billingTiming ?? "usage",
      interval: prc.interval ?? null,
      intervalCount: prc.intervalCount ?? 1,
    })),
    {
      default: false,
      currencyOptions: { USD: { amount: input.amountCents } },
      recurring: false,
      billingTiming: "usage",
      interval: null,
      intervalCount: 1,
    },
  ];
  const put = await fetch(`${base}/api/public/v1/variants/${encodeURIComponent(input.variantId)}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      updatedData: {
        name: v.name,
        description: v.description ?? undefined,
        sku: v.sku,
        active: v.active !== false,
        default: v.default === true,
        prices: nextPrices,
      },
    }),
  });
  if (!put.ok) return null;
  const got2 = await fetch(`${base}/api/public/v1/products/${encodeURIComponent(input.productId)}`, {
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      Accept: "application/json",
    },
  });
  if (!got2.ok) return null;
  const product2 = await got2.json();
  const variants2 = Array.isArray(product2?.variants) ? product2.variants : [];
  const v2 = variants2.find((x: { id?: string }) => x.id === input.variantId);
  const prices2 = Array.isArray(v2?.prices) ? v2.prices : [];
  for (const prc of prices2) {
    const amount = prc?.currencyOptions?.USD?.amount;
    const recurring = prc?.recurring === true;
    if (!recurring && Number(amount) === input.amountCents && typeof prc.id === "string") {
      return prc.id;
    }
  }
  return null;
}

async function ensureTagadaMonthlyPrice(input: {
  apiKey: string;
  productId: string;
  variantId: string;
  amountCents: number;
}): Promise<string | null> {
  const base = Deno.env.get("TAGADA_API_BASE")?.trim()?.replace(/\/$/, "") || "https://api.tagada.io";
  const headers = { Authorization: `Bearer ${input.apiKey}`, Accept: "application/json" };
  const got = await fetch(`${base}/api/public/v1/products/${encodeURIComponent(input.productId)}`, { headers });
  if (!got.ok) return null;
  const product = await got.json();
  const variant = (Array.isArray(product?.variants) ? product.variants : [])
    .find((v: { id?: string }) => v.id === input.variantId);
  if (!variant) return null;
  const prices = Array.isArray(variant.prices) ? variant.prices : [];
  const matching = prices.find((price: Record<string, unknown>) =>
    price.recurring === true &&
    String(price.interval || "").toLowerCase() === "month" &&
    Number((price.currencyOptions as { USD?: { amount?: number } })?.USD?.amount) === input.amountCents
  );
  if (typeof matching?.id === "string") return matching.id;
  const nextPrices = [
    ...prices.map((price: Record<string, unknown>, index: number) => ({
      id: price.id,
      default: price.default === true || index === 0,
      currencyOptions: price.currencyOptions,
      recurring: price.recurring === true,
      billingTiming: price.billingTiming ?? "usage",
      interval: price.interval ?? null,
      intervalCount: price.intervalCount ?? 1,
    })),
    {
      default: false,
      currencyOptions: { USD: { amount: input.amountCents } },
      recurring: true,
      billingTiming: "advance",
      interval: "month",
      intervalCount: 1,
    },
  ];
  const put = await fetch(`${base}/api/public/v1/variants/${encodeURIComponent(input.variantId)}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ updatedData: {
      name: variant.name,
      description: variant.description ?? undefined,
      sku: variant.sku,
      active: variant.active !== false,
      default: variant.default === true,
      prices: nextPrices,
    } }),
  });
  if (!put.ok) return null;
  const refreshed = await fetch(`${base}/api/public/v1/products/${encodeURIComponent(input.productId)}`, { headers });
  if (!refreshed.ok) return null;
  const refreshedProduct = await refreshed.json();
  const refreshedVariant = (Array.isArray(refreshedProduct?.variants) ? refreshedProduct.variants : [])
    .find((v: { id?: string }) => v.id === input.variantId);
  return (Array.isArray(refreshedVariant?.prices) ? refreshedVariant.prices : [])
    .find((price: Record<string, unknown>) =>
      price.recurring === true && String(price.interval || "").toLowerCase() === "month" &&
      Number((price.currencyOptions as { USD?: { amount?: number } })?.USD?.amount) === input.amountCents
    )?.id ?? null;
}

/** Base membership display amounts (customer-facing). Kept; not deleted. */
const MEM_BASE_BY_SKU: Record<string, { basePriceId: string; baseCents: number; type: string }> = {
  "MBM-MEM-SEM-MEM-001": {
    basePriceId: "price_307f4d84658d",
    baseCents: 12500,
    type: "semaglutide",
  },
  "MBM-MEM-TIR-MEM-001": {
    basePriceId: "price_321bc7a3ea7e",
    baseCents: 17900,
    type: "tirzepatide",
  },
};

/** Combo recurring prices: membership + shipping. Exact priceIds — do not infer in browser. */
const MEM_COMBO_BY_SKU_SHIP: Record<
  string,
  Record<number, { priceId: string; monthlyCents: number; method: "two_day" | "next_day" }>
> = {
  "MBM-MEM-SEM-MEM-001": {
    3000: { priceId: "price_f89402dcbe76", monthlyCents: 15500, method: "two_day" },
    5000: { priceId: "price_fc83af356019", monthlyCents: 17500, method: "next_day" },
  },
  "MBM-MEM-TIR-MEM-001": {
    3000: { priceId: "price_dd3f65ebcee2", monthlyCents: 20900, method: "two_day" },
    5000: { priceId: "price_da1063335965", monthlyCents: 22900, method: "next_day" },
  },
};

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
      `${supabaseUrl}/rest/v1/order_items?order_id=eq.${order.id}&select=sku,variant_id,quantity,unit_price_cents,product_name_snapshot`,
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

    const SUPPORTED_MEM_SKUS = new Set(["MBM-MEM-SEM-MEM-001", "MBM-MEM-TIR-MEM-001"]);
    const ENROLLMENT_VISIT_SKUS = new Set(["MBM-PC-IPV-SRV-001", "MBM-PC-FUV-SRV-001"]);
    const ENROLLMENT_VISIT_CENTS: Record<string, number> = {
      "MBM-PC-IPV-SRV-001": 7500,
      "MBM-PC-FUV-SRV-001": 5500,
    };
    const membershipSkus = skus.filter((s: string) => String(s).startsWith("MBM-MEM-"));
    const visitSkus = skus.filter((s: string) => ENROLLMENT_VISIT_SKUS.has(String(s)));
    const otherSkus = skus.filter(
      (s: string) => !String(s).startsWith("MBM-MEM-") && !ENROLLMENT_VISIT_SKUS.has(String(s)),
    );
    const isMembershipCheckout = membershipSkus.length > 0;
    const subscriptionSku = typeof order.subscription_sku === "string"
      ? order.subscription_sku.trim()
      : "";
    const isPrescriptionSubscription = subscriptionSku.length > 0;
    if (isMembershipCheckout && isPrescriptionSubscription) {
      return json({ error: "Membership and prescription subscription checkout cannot be combined." }, 409);
    }
    if (isPrescriptionSubscription) {
      const recurringLines = orderItems.filter((line: { sku?: string; quantity?: number }) =>
        line.sku === subscriptionSku
      );
      const unsupported = orderItems.filter((line: { sku?: string }) =>
        line.sku !== subscriptionSku && !String(line.sku || "").startsWith("MBM-PC-")
      );
      if (recurringLines.length !== 1 || Number(recurringLines[0]?.quantity) !== 1 || unsupported.length > 0) {
        return json({
          error: "Subscribe & Save allows one prescription (quantity 1) plus required one-time provider services.",
          code: "SUBSCRIPTION_CART_INVALID",
        }, 409);
      }
      const email = String(order.customer_email || "").trim().toLowerCase();
      if (email) {
        const duplicate = await fetch(
          `${supabaseUrl}/rest/v1/customer_prescription_subscriptions?prescription_sku=eq.${encodeURIComponent(subscriptionSku)}&customer_email=ilike.${encodeURIComponent(email)}&status=in.(active,past_due,paused,cancel_scheduled,payment_issue)&select=id,status&limit=1`,
          { headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey } },
        );
        if (duplicate.ok) {
          const rows = await duplicate.json();
          if (Array.isArray(rows) && rows.length > 0) {
            return json({
              error: "You already have an open subscription for this prescription. Manage it from your account or contact support.",
              existingSubscriptionId: rows[0].id,
            }, 409);
          }
        }
      }
    }
    let membershipCombo:
      | {
          memSku: string;
          priceId: string;
          monthlyCents: number;
          baseCents: number;
          shippingCents: number;
          method: "two_day" | "next_day";
          type: string;
        }
      | null = null;
    if (isMembershipCheckout) {
      // Allowed: exactly one supported MEM program (+ optional one required provider visit).
      // Provider visit is ONE-TIME. Shipping is selected and baked into the combo recurring price.
      // Do NOT append MBM-SHIP-* on membership enrollment (prevents duplicate shipping).
      if (membershipSkus.length !== 1 || otherSkus.length > 0 || visitSkus.length > 1) {
        return json({
          error:
            "Membership card enrollment allows exactly one supported membership program plus an optional required provider visit (one-time). Shipping is included in the monthly membership renewal. Ordinary products cannot be mixed into the Tagada subscription session.",
          code: "MEMBERSHIP_ENROLLMENT_CART_INVALID",
          membershipSkus,
          visitSkus,
          otherSkus,
        }, 409);
      }
      const memSku = membershipSkus[0];
      if (!SUPPORTED_MEM_SKUS.has(memSku)) {
        return json({
          error:
            "Online enrollment for this membership program is not available yet. Please contact us for assistance.",
          code: "UNSUPPORTED_MEMBERSHIP",
          membershipSku: memSku,
        }, 409);
      }
      const memLines = orderItems.filter((i: { sku: string | null }) => i.sku === memSku);
      if (memLines.length !== 1 || Number(memLines[0].quantity) !== 1) {
        return json({
          error: "Membership enrollment quantity must be exactly 1.",
          code: "INVALID_MEMBERSHIP_QUANTITY",
        }, 409);
      }
      if (visitSkus.length === 1) {
        const vSku = visitSkus[0];
        const visitLines = orderItems.filter((i: { sku: string | null }) => i.sku === vSku);
        if (visitLines.length !== 1 || Number(visitLines[0].quantity) !== 1) {
          return json({
            error: "Required provider visit quantity must be exactly 1.",
            code: "INVALID_ENROLLMENT_VISIT_QUANTITY",
          }, 409);
        }
      }
      // Require exactly one enrollment shipping selection ($30 or $50) → combo priceId.
      const memShipCents = Number(order.shipping_cents) || 0;
      const baseCfg = MEM_BASE_BY_SKU[memSku];
      const comboCfg = MEM_COMBO_BY_SKU_SHIP[memSku]?.[memShipCents];
      if (!baseCfg || !comboCfg) {
        return json({
          error:
            "Membership card enrollment requires Two-Day ($30) or Next-Day ($50) shipping. Shipping is included with each monthly membership renewal.",
          blocker: "TAGADA_SHIPPING_PARITY_BLOCKER",
          shippingCents: memShipCents,
        }, 409);
      }
      if (baseCfg.baseCents + memShipCents !== comboCfg.monthlyCents) {
        return json({
          error: "Membership card checkout is temporarily unavailable for this program. Please contact support.",
          blocker: "TAGADA_MEMBERSHIP_COMBO_STALE",
          shippingCents: memShipCents,
          expectedMonthlyCents: baseCfg.baseCents + memShipCents,
          comboMonthlyCents: comboCfg.monthlyCents,
        }, 409);
      }
      membershipCombo = {
        memSku,
        priceId: comboCfg.priceId,
        monthlyCents: comboCfg.monthlyCents,
        baseCents: baseCfg.baseCents,
        shippingCents: memShipCents,
        method: comboCfg.method,
        type: baseCfg.type,
      };
      // Duplicate open enrollment guard (same email + program).
      const email = String(order.customer_email || "").trim().toLowerCase();
      if (email) {
        const dupRes = await fetch(
          `${supabaseUrl}/rest/v1/customer_memberships?membership_sku=eq.${encodeURIComponent(memSku)}&customer_email=ilike.${encodeURIComponent(email)}&status=in.(pending_payment,active,past_due,paused,cancel_scheduled,payment_issue)&select=id,status&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              apikey: serviceKey,
            },
          },
        );
        if (dupRes.ok) {
          const dups = await dupRes.json();
          if (Array.isArray(dups) && dups.length > 0 && dups[0].status !== "pending_payment") {
            return json({
              error:
                "You already have an active or open membership for this program. Manage it from your account or contact us — a duplicate subscription was not created.",
              existingMembershipId: dups[0].id,
              existingStatus: dups[0].status,
            }, 409);
          }
        }
      }
    }

    const shippingCents = Number(order.shipping_cents) || 0;
    // Membership: do NOT append MBM-SHIP (shipping is in combo recurring price).
    // One-time carts: append mapped MBM-SHIP when shipping > 0.
    const shipSku =
      !isMembershipCheckout && !isPrescriptionSubscription && shippingCents > 0
        ? shippingSkuForCents(shippingCents)
        : null;
    const mapSkus = shipSku ? [...skus, shipSku] : skus;

    const mapRes = await fetch(
      `${supabaseUrl}/rest/v1/kashu_sku_map?mbm_sku=in.(${mapSkus.map((s: string) => `"${s}"`).join(",")})&is_active=eq.true&select=mbm_sku,tagada_variant_id,tagada_product_id,tagada_price_id,mbm_price_cents,tagada_price_cents`,
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
    const bySku = new Map<
      string,
      {
        tagada_variant_id: string;
        tagada_product_id?: string | null;
        tagada_price_id?: string | null;
        mbm_price_cents?: number | null;
        tagada_price_cents?: number | null;
      }
    >(
      (Array.isArray(maps) ? maps : []).map((
        m: {
          mbm_sku: string;
          tagada_variant_id: string;
          tagada_product_id?: string | null;
          tagada_price_id?: string | null;
          mbm_price_cents?: number | null;
          tagada_price_cents?: number | null;
        },
      ) => [m.mbm_sku, m]),
    );

    const missing: string[] = [];
    const tagadaItems: { variantId: string; quantity: number; priceId?: string }[] = [];
    const skuList: string[] = [];
    let calculatedTagadaMerchandiseCents = 0;
    let subscriptionPriceId: string | null = null;
    let subscriptionMonthlyCents = 0;
    for (const line of orderItems) {
      const sku = line.sku as string | null;
      const qty = Number(line.quantity) || 1;
      if (!sku) {
        missing.push(String(line.product_name_snapshot || "item"));
        continue;
      }
      const mappedRaw = bySku.get(sku);
      const mapped = resolveKashuSkuMapRow(sku, mappedRaw ?? null);
      if (!mapped?.tagada_variant_id) {
        missing.push(sku);
        continue;
      }
      const unit = Number(mapped.tagada_price_cents ?? mapped.mbm_price_cents);
      if (!Number.isFinite(unit)) {
        missing.push(sku);
        continue;
      }
      calculatedTagadaMerchandiseCents += Math.trunc(unit) * qty;
      skuList.push(`${sku}×${qty}`);
      if (isPrescriptionSubscription && sku === subscriptionSku) {
        const retailCents = Math.trunc(unit);
        const discountedCents = Math.round(retailCents * 0.85);
        const storedBase = Math.trunc(Number(order.subscription_base_amount_cents) || 0);
        const storedMonthly = Math.trunc(Number(order.subscription_monthly_amount_cents) || 0);
        subscriptionMonthlyCents = discountedCents + shippingCents;
        const storedLineCents = Math.trunc(Number(line.unit_price_cents) || 0);
        if (storedLineCents !== discountedCents || storedBase !== discountedCents || storedMonthly !== subscriptionMonthlyCents) {
          return json({
            error: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
            blocker: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
            message: "Subscription price must equal 15% off the authoritative prescription price plus selected recurring shipping.",
            sku,
          }, 409);
        }
        const tagadaApiKey = Deno.env.get("TAGADA_API_KEY")?.trim();
        if (!tagadaApiKey || !mapped.tagada_product_id) {
          return json({ error: "Prescription subscription catalog setup is unavailable." }, 503);
        }
        subscriptionPriceId = await ensureTagadaMonthlyPrice({
          apiKey: tagadaApiKey,
          productId: mapped.tagada_product_id,
          variantId: mapped.tagada_variant_id,
          amountCents: subscriptionMonthlyCents,
        });
        if (!subscriptionPriceId) {
          return json({ error: "Unable to create the verified monthly Tagada subscription price." }, 502);
        }
        calculatedTagadaMerchandiseCents += subscriptionMonthlyCents - retailCents;
        tagadaItems.push({ variantId: mapped.tagada_variant_id, quantity: 1, priceId: subscriptionPriceId });
      } else if (isMembershipCheckout) {
        if (membershipCombo && sku === membershipCombo.memSku) {
          // Combo recurring priceId (membership + shipping). Map base cents stay 12500/17900
          // for display; Tagada charge uses combo monthly cents.
          if (Math.trunc(unit) !== membershipCombo.baseCents) {
            return json({
              error: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
              blocker: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
              message: "Membership Tagada base price cents do not match verified MBM membership amount.",
              sku,
              mappedCents: unit,
              expectedCents: membershipCombo.baseCents,
            }, 409);
          }
          calculatedTagadaMerchandiseCents += membershipCombo.monthlyCents - Math.trunc(unit);
          tagadaItems.push({
            variantId: mapped.tagada_variant_id,
            quantity: 1,
            priceId: membershipCombo.priceId,
          });
        } else if (ENROLLMENT_VISIT_SKUS.has(sku)) {
          // ONE-TIME enrollment visit — use mapped one-time priceId; never a recurring MEM price.
          const expectedVisit = ENROLLMENT_VISIT_CENTS[sku];
          if (Math.trunc(unit) !== expectedVisit) {
            return json({
              error: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
              blocker: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
              message: "Provider visit Tagada price cents do not match verified MBM visit amount.",
              sku,
              mappedCents: unit,
              expectedCents: expectedVisit,
            }, 409);
          }
          tagadaItems.push({
            variantId: mapped.tagada_variant_id,
            quantity: 1,
            ...(mapped.tagada_price_id ? { priceId: mapped.tagada_price_id } : {}),
          });
        } else {
          return json({
            error: "Unexpected SKU on membership enrollment checkout.",
            code: "MEMBERSHIP_ENROLLMENT_CART_INVALID",
            sku,
          }, 409);
        }
      } else {
        tagadaItems.push({
          variantId: mapped.tagada_variant_id,
          quantity: qty,
          ...(mapped.tagada_price_id ? { priceId: mapped.tagada_price_id } : {}),
        });
      }
    }
    if (missing.length) {
      return json({
        error:
          "Tagada product sync incomplete. Missing kashu_sku_map rows for one or more SKUs.",
        missingSkus: missing,
      }, 409);
    }

    // MBM is shipping source of truth.
    // Membership: $30/$50 required (baked into combo recurring price — no MBM-SHIP Tagada line).
    // One-time card: $0 / $30 / $50 via mapped MBM-SHIP line when > 0.
    const allowedShipping = isMembershipCheckout || isPrescriptionSubscription
      ? new Set([3000, 5000])
      : new Set([0, 3000, 5000]);
    if (!allowedShipping.has(shippingCents)) {
      return json({
        error: isMembershipCheckout
          ? "Membership card enrollment requires Two-Day ($30) or Next-Day ($50) shipping. Shipping is included with each monthly membership renewal."
          : "Unexpected MBM shipping amount for card checkout. Only $0, $30 (Two-Day), or $50 (Next-Day) are supported.",
        blocker: "TAGADA_SHIPPING_PARITY_BLOCKER",
        shippingCents,
        shippingMethod: order.shipping_method,
      }, 409);
    }

    let calculatedShippingCents = 0;
    if (!isMembershipCheckout && !isPrescriptionSubscription && shippingCents > 0) {
      if (!shipSku) {
        return json({
          error:
            "Card checkout cannot represent this shipping method in Tagada yet. Use a supported $30 / $50 shipping selection.",
          blocker: "TAGADA_SHIPPING_PARITY_BLOCKER",
          shippingCents,
          shippingMethod: order.shipping_method,
        }, 409);
      }
      const shipMap = bySku.get(shipSku);
      const shipPrice =
        shipMap?.tagada_price_cents ?? shipMap?.mbm_price_cents ?? null;
      if (!shipMap?.tagada_variant_id || shipPrice !== shippingCents) {
        return json({
          error:
            "Tagada shipping line mapping missing or price mismatch. MBM shipping is authoritative; card checkout blocked until a matching Tagada shipping variant exists.",
          blocker: "TAGADA_SHIPPING_PARITY_BLOCKER",
          shippingSku: shipSku,
          shippingCents,
          mappedPriceCents: shipPrice,
        }, 409);
      }
      calculatedShippingCents = shippingCents;
      skuList.push(`${shipSku}×1`);
      tagadaItems.push({
        variantId: shipMap.tagada_variant_id,
        quantity: 1,
        ...(shipMap.tagada_price_id ? { priceId: shipMap.tagada_price_id } : {}),
      });
    }
    // Membership: shipping dollars are already inside combo monthlyCents — do not add again.
    // Order.total_cents still includes shipping_cents; merchandise total was adjusted to combo.

    const mbmTaxCents = Number(order.tax_cents) || 0;
    const mbmTotalCents = Number(order.total_cents) || 0;
    const mbmDiscountCents = Math.max(0, Number(order.discount_cents) || 0);
    const mbmPromoCode = typeof order.promo_code === "string"
      ? order.promo_code.trim().toUpperCase()
      : "";
    // Tax-inclusive architecture: NEW orders must have tax_cents = 0.
    // Fail safe on unexpected tax (stale deploy / mixed logic) — do not redirect.
    if (mbmTaxCents > 0) {
      return json({
        error: "TAGADA_UNEXPECTED_TAX_AMOUNT",
        blocker: "TAGADA_UNEXPECTED_TAX_AMOUNT",
        message:
          "This order has an unexpected tax amount. Card checkout requires tax-inclusive totals (tax_cents = 0).",
        publicOrderNumber,
        mbmTaxCents,
        mbmTotalCents,
      }, 409);
    }
    // Membership enrollment must never carry OGTBM (recurring combo amounts are fixed).
    if (isMembershipCheckout && mbmDiscountCents > 0) {
      return json({
        error: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
        blocker: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
        message:
          "Membership enrollment cannot include promotional discounts. Recurring membership amounts are fixed.",
        publicOrderNumber,
        mbmDiscountCents,
        promoCode: mbmPromoCode || null,
      }, 409);
    }
    // Expected Tagada charge = mapped merchandise + shipping − server OGTBM discount (tax = 0).
    const calculatedTagadaTotalCents =
      calculatedTagadaMerchandiseCents +
      calculatedShippingCents +
      mbmTaxCents -
      mbmDiscountCents;
    if (calculatedTagadaTotalCents !== mbmTotalCents) {
      return json({
        error: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
        blocker: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
        publicOrderNumber,
        mbmTotalCents,
        calculatedTagadaTotalCents,
        calculatedTagadaMerchandiseCents,
        calculatedShippingCents,
        mbmDiscountCents,
        mbmTaxCents,
        skuList,
      }, 409);
    }

    // When OGTBM applies, swap eligible Tagada lines to discounted one-time priceIds
    // so hosted charge equals MBM total (full map cents − $50/eligible unit).
    if (mbmPromoCode === "OGTBM" && mbmDiscountCents > 0 && !isMembershipCheckout) {
      const tagadaApiKey = Deno.env.get("TAGADA_API_KEY")?.trim();
      if (!tagadaApiKey) {
        return json({
          error: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
          blocker: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
          message: "OGTBM card checkout requires Tagada API access to bind discounted priceIds.",
        }, 503);
      }
      // Rebuild items with discounted prices for eligible SKUs.
      const discountedItems: { variantId: string; quantity: number; priceId?: string }[] = [];
      let discountedMerch = 0;
      for (const line of orderItems) {
        const sku = line.sku as string | null;
        const qty = Number(line.quantity) || 1;
        if (!sku) continue;
        const mapped = resolveKashuSkuMapRow(sku, bySku.get(sku) ?? null);
        if (!mapped?.tagada_variant_id || !mapped.tagada_product_id) {
          return json({
            error: "Tagada product sync incomplete for OGTBM discount binding.",
            missingSkus: [sku],
          }, 409);
        }
        const fullUnit = Math.trunc(Number(mapped.tagada_price_cents ?? mapped.mbm_price_cents) || 0);
        let unit = fullUnit;
        let priceId = mapped.tagada_price_id || undefined;
        if (isOgtbmEligibleSku(sku) && fullUnit > 0) {
          const discountPer = Math.min(5000, fullUnit);
          unit = fullUnit - discountPer;
          const ensured = await ensureTagadaOneTimePrice({
            apiKey: tagadaApiKey,
            productId: mapped.tagada_product_id,
            variantId: mapped.tagada_variant_id,
            amountCents: unit,
          });
          if (!ensured) {
            return json({
              error: "Unable to bind OGTBM discounted Tagada priceId.",
              sku,
              amountCents: unit,
            }, 502);
          }
          priceId = ensured;
        }
        discountedMerch += unit * qty;
        discountedItems.push({
          variantId: mapped.tagada_variant_id,
          quantity: qty,
          ...(priceId ? { priceId } : {}),
        });
      }
      // Keep shipping lines already appended in tagadaItems after merchandise.
      const shipItems = tagadaItems.slice(orderItems.length);
      tagadaItems.length = 0;
      tagadaItems.push(...discountedItems, ...shipItems);
      calculatedTagadaMerchandiseCents = discountedMerch;
      // Recheck: merch(discounted) + ship + tax must equal total (discount already in unit prices).
      const recalculated =
        calculatedTagadaMerchandiseCents + calculatedShippingCents + mbmTaxCents;
      if (recalculated !== mbmTotalCents) {
        return json({
          error: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
          blocker: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
          publicOrderNumber,
          mbmTotalCents,
          calculatedTagadaTotalCents: recalculated,
          calculatedTagadaMerchandiseCents,
          calculatedShippingCents,
          mbmDiscountCents,
          note: "ogtbm_discounted_priceIds",
        }, 409);
      }
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

    // Pending membership enrollment — unpaid until Tagada webhook activates.
    // Browser return must not activate. Requires migration 20260819140000_customer_memberships.sql
    // + 20260819190000_membership_combo_shipping_fields.sql for combo columns.
    if (isMembershipCheckout && membershipCombo) {
      const mapped = resolveKashuSkuMapRow(
        membershipCombo.memSku,
        bySku.get(membershipCombo.memSku) ?? null,
      );
      await fetch(`${supabaseUrl}/rest/v1/customer_memberships`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          customer_user_id: order.customer_user_id || null,
          customer_email: order.customer_email || null,
          enrollment_order_id: order.id,
          enrollment_public_order_number: publicOrderNumber,
          membership_sku: membershipCombo.memSku,
          membership_type: membershipCombo.type,
          status: "pending_payment",
          tagada_price_id: membershipCombo.priceId,
          tagada_variant_id: mapped?.tagada_variant_id || null,
          base_membership_amount_cents: membershipCombo.baseCents,
          shipping_cents: membershipCombo.shippingCents,
          selected_shipping_method: membershipCombo.method,
          monthly_amount_cents: membershipCombo.monthlyCents,
          currency: "USD",
          updated_at: new Date().toISOString(),
        }),
      });
    }

    if (isPrescriptionSubscription && subscriptionPriceId) {
      const mapped = resolveKashuSkuMapRow(subscriptionSku, bySku.get(subscriptionSku) ?? null);
      await fetch(`${supabaseUrl}/rest/v1/customer_prescription_subscriptions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          customer_user_id: order.customer_user_id || null,
          customer_email: order.customer_email || null,
          enrollment_order_id: order.id,
          enrollment_public_order_number: publicOrderNumber,
          prescription_sku: subscriptionSku,
          status: "pending_payment",
          tagada_price_id: subscriptionPriceId,
          tagada_variant_id: mapped?.tagada_variant_id || null,
          medication_amount_cents: Number(order.subscription_base_amount_cents) || 0,
          shipping_cents: Number(order.subscription_shipping_cents) || 0,
          selected_shipping_method: Number(order.subscription_shipping_cents) === 5000 ? "next_day" : "two_day",
          monthly_amount_cents: subscriptionMonthlyCents,
          discount_percent: 15,
          currency: "USD",
          updated_at: new Date().toISOString(),
        }),
      });
    }

    return json({
      ok: true,
      redirectUrl,
      checkoutToken,
      publicOrderNumber,
      subscriptionRecurring: isMembershipCheckout || isPrescriptionSubscription,
      // Authoritative total for client display only — Kashu charges Tagada catalog prices.
      orderTotalCents: order.total_cents,
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
