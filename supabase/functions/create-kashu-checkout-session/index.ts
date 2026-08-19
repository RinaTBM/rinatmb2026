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

/** Base membership display amounts (customer-facing). Kept; not deleted. */
const MEM_BASE_BY_SKU: Record<string, { basePriceId: string; baseCents: number; type: string }> = {
  "MBM-MEM-SEM-MEM-001": {
    basePriceId: "price_344d3dacb4ab",
    baseCents: 14900,
    type: "semaglutide",
  },
  "MBM-MEM-TIR-MEM-001": {
    basePriceId: "price_5cf1fa89610c",
    baseCents: 24900,
    type: "tirzepatide",
  },
};

/** Combo recurring prices: membership + shipping. Exact priceIds — do not infer in browser. */
const MEM_COMBO_BY_SKU_SHIP: Record<
  string,
  Record<number, { priceId: string; monthlyCents: number; method: "two_day" | "next_day" }>
> = {
  "MBM-MEM-SEM-MEM-001": {
    3000: { priceId: "price_41179f7cafe2", monthlyCents: 17900, method: "two_day" },
    5000: { priceId: "price_7ce0f74a7509", monthlyCents: 19900, method: "next_day" },
  },
  "MBM-MEM-TIR-MEM-001": {
    3000: { priceId: "price_e0ebef9851a8", monthlyCents: 27900, method: "two_day" },
    5000: { priceId: "price_ef9ea132d6cf", monthlyCents: 29900, method: "next_day" },
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
      !isMembershipCheckout && shippingCents > 0 ? shippingSkuForCents(shippingCents) : null;
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
        tagada_price_id?: string | null;
        mbm_price_cents?: number | null;
        tagada_price_cents?: number | null;
      }
    >(
      (Array.isArray(maps) ? maps : []).map((
        m: {
          mbm_sku: string;
          tagada_variant_id: string;
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
    for (const line of orderItems) {
      const sku = line.sku as string | null;
      const qty = Number(line.quantity) || 1;
      if (!sku) {
        missing.push(String(line.product_name_snapshot || "item"));
        continue;
      }
      const mapped = bySku.get(sku);
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
      if (isMembershipCheckout) {
        if (membershipCombo && sku === membershipCombo.memSku) {
          // Combo recurring priceId (membership + shipping). Map base cents stay 14900/24900
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
    const allowedShipping = isMembershipCheckout
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
    if (!isMembershipCheckout && shippingCents > 0) {
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
    // Expected Tagada charge = mapped merchandise + MBM shipping line only (tax must be 0).
    const calculatedTagadaTotalCents =
      calculatedTagadaMerchandiseCents + calculatedShippingCents + mbmTaxCents;
    if (calculatedTagadaTotalCents !== mbmTotalCents) {
      return json({
        error: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
        blocker: "TAGADA_CHECKOUT_TOTAL_MISMATCH",
        publicOrderNumber,
        mbmTotalCents,
        calculatedTagadaTotalCents,
        calculatedTagadaMerchandiseCents,
        calculatedShippingCents,
        mbmTaxCents,
        skuList,
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

    // Pending membership enrollment — unpaid until Tagada webhook activates.
    // Browser return must not activate. Requires migration 20260819140000_customer_memberships.sql
    // + 20260819190000_membership_combo_shipping_fields.sql for combo columns.
    if (isMembershipCheckout && membershipCombo) {
      const mapped = bySku.get(membershipCombo.memSku);
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

    return json({
      ok: true,
      redirectUrl,
      checkoutToken,
      publicOrderNumber,
      membershipRecurring: isMembershipCheckout,
      // Authoritative total for client display only — Kashu charges Tagada catalog prices.
      orderTotalCents: order.total_cents,
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
