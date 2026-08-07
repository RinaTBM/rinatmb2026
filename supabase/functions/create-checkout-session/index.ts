import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type PurchaseType = "one_time" | "auto_refill" | "membership_program" | "active_membership";

interface CartItemRequest {
  productId: string;
  quantity: number;
  subscription?: boolean;
  purchaseType?: PurchaseType;
  unitAmountCents?: number;
  standardPriceCents?: number;
  discountPercent?: number;
  appliedDiscount?: string;
  productName?: string;
  variantLabel?: string;
  /** Storefront section/category — used to authorize accessory member pricing. */
  section?: string;
  /** Per-SKU eligibility flag from catalog (bundles default false). */
  memberPricingEligible?: boolean;
}

/** Default accessory member discount — mirrors storefront settings default. */
const ACCESSORY_MEMBER_DISCOUNT_PERCENT = 15;

/** Bundle/kit accessories never receive the member accessory discount by default. */
const ACCESSORY_BUNDLE_PRODUCT_IDS = new Set(["a1"]);

function assertTestKey(secretKey: string) {
  if (secretKey.startsWith("sk_live_") || secretKey.startsWith("rk_live_")) {
    throw new Error("Checkout is TEST MODE only. Live Stripe keys are not allowed.");
  }
  if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("rk_test_")) {
    throw new Error("Checkout requires a Stripe TEST key (sk_test_… or rk_test_…).");
  }
}

function expectedAccessoryMemberUnitCents(standardPriceCents: number, percent: number): number {
  if (!Number.isFinite(standardPriceCents) || standardPriceCents < 0) return 0;
  const p = Math.min(100, Math.max(0, percent));
  return Math.round(standardPriceCents * (1 - p / 100));
}

function isAccessoryLine(item: CartItemRequest): boolean {
  if (item.section === "accessories") return true;
  return /^a\d+$/i.test(item.productId);
}

function isAccessoryEligibleForMemberDiscount(item: CartItemRequest): boolean {
  if (!isAccessoryLine(item)) return false;
  if (ACCESSORY_BUNDLE_PRODUCT_IDS.has(item.productId)) return false;
  if (item.memberPricingEligible === false) return false;
  // Default individual accessories are eligible.
  return true;
}

/**
 * Authorize accessory unit cents server-side.
 * Does not trust localStorage / frontend-only membership for a deeper discount than configured.
 * Full Stripe subscription verification remains a documented dependency when auth is wired.
 */
function authorizeAccessoryUnitCents(
  item: CartItemRequest,
  isActiveMember: boolean,
): number | null {
  if (!isAccessoryLine(item)) return null;
  const standard = Math.max(0, Math.round(item.standardPriceCents ?? item.unitAmountCents ?? 0));
  if (!standard) return null;

  const wantsMember =
    isActiveMember === true &&
    isAccessoryEligibleForMemberDiscount(item) &&
    (item.appliedDiscount === "member" || (item.discountPercent ?? 0) > 0 || isActiveMember);

  if (!wantsMember || !isActiveMember || !isAccessoryEligibleForMemberDiscount(item)) {
    // Non-members and ineligible accessories always pay standard retail.
    return standard;
  }

  const authorized = expectedAccessoryMemberUnitCents(standard, ACCESSORY_MEMBER_DISCOUNT_PERCENT);
  const requested = typeof item.unitAmountCents === "number" ? Math.round(item.unitAmountCents) : authorized;
  // Never accept a client amount below the authorized member price (no stacking / deeper cut).
  if (requested < authorized) return authorized;
  return authorized;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const secretKey = Deno.env.get("STRIPE_SECRET_KEY_TEST") || Deno.env.get("STRIPE_SECRET_KEY");
  if (!secretKey) {
    return new Response(JSON.stringify({ error: "Stripe not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    assertTestKey(secretKey);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json() as {
      items: CartItemRequest[];
      isActiveMember?: boolean;
      customerUserId?: string;
      customerEmail?: string;
      customerName?: string;
      shippingMethod?: string;
      shippingCents?: number;
      taxCents?: number;
      subtotalCents?: number;
      discountCents?: number;
      freeShippingEligible?: boolean;
      requiresProviderReview?: boolean;
    };
    const {
      items,
      isActiveMember,
      customerUserId,
      customerEmail,
      customerName,
      shippingMethod,
      shippingCents,
      taxCents,
      subtotalCents,
      discountCents,
      freeShippingEligible,
      requiresProviderReview,
    } = body;
    // Client-claimed membership is accepted only after unit amounts are recomputed server-side.
    // Full Stripe subscription / auth verification is not performed in this function yet.
    const memberClaim = isActiveMember === true;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const productIds = items.map((i) => i.productId);
    const lookupRes = await fetch(
      `${supabaseUrl}/rest/v1/stripe_products?app_product_id=in.(${productIds.join(",")})`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      },
    );

    if (!lookupRes.ok) {
      return new Response(JSON.stringify({ error: "Failed to look up products" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dbProducts = await lookupRes.json() as Array<{
      app_product_id: string;
      stripe_product_id: string;
      stripe_price_id: string | null;
      name: string;
      price: number;
      is_recurring: boolean;
    }>;

    const productMap = new Map(dbProducts.map((p) => [p.app_product_id, p]));
    const lineItems: Array<Record<string, string>> = [];
    let hasVariablePricing = false;
    let usesCustomPriceData = false;
    let hasRecurring = false;

    for (const [idx, item] of items.entries()) {
      const purchaseType: PurchaseType = item.purchaseType
        ?? (item.subscription ? "auto_refill" : "one_time");
      const isProgramMembership = purchaseType === "membership_program" || item.productId === "m1" || item.productId === "m2";

      // Accessories: always authorize unit amount server-side when a custom/member price is involved.
      const accessoryAuthorized = authorizeAccessoryUnitCents(item, memberClaim);
      const isAccessory = isAccessoryLine(item);

      const needsCustomAmount =
        !isProgramMembership &&
        (
          isAccessory ||
          purchaseType === "auto_refill" ||
          (typeof item.discountPercent === "number" && item.discountPercent > 0) ||
          (typeof item.unitAmountCents === "number" &&
            typeof item.standardPriceCents === "number" &&
            item.unitAmountCents !== item.standardPriceCents)
        );

      if (needsCustomAmount) {
        usesCustomPriceData = true;
        let unitAmount = item.unitAmountCents;
        if (accessoryAuthorized != null) {
          unitAmount = accessoryAuthorized;
        }
        if (!unitAmount || unitAmount < 0) {
          return new Response(JSON.stringify({ error: `Missing unit amount for ${item.productId}` }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        // Reject attempted stacking / deeper cuts on accessories.
        if (
          isAccessory &&
          typeof item.standardPriceCents === "number" &&
          memberClaim &&
          isAccessoryEligibleForMemberDiscount(item)
        ) {
          const floor = expectedAccessoryMemberUnitCents(
            item.standardPriceCents,
            ACCESSORY_MEMBER_DISCOUNT_PERCENT,
          );
          if (unitAmount < floor) unitAmount = floor;
        }
        const name = item.variantLabel
          ? `${item.productName ?? item.productId} (${item.variantLabel})`
          : (item.productName ?? item.productId);
        const recurring = purchaseType === "auto_refill" || !!item.subscription;
        // Accessories never use Auto-Refill.
        if (isAccessory && recurring) {
          return new Response(JSON.stringify({ error: "Auto-Refill is not available on accessories." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (recurring) hasRecurring = true;

        lineItems.push({
          [`line_items[${idx}][price_data][currency]`]: "usd",
          [`line_items[${idx}][price_data][unit_amount]`]: String(unitAmount),
          [`line_items[${idx}][price_data][product_data][name]`]: name,
          [`line_items[${idx}][quantity]`]: String(item.quantity),
          ...(recurring
            ? {
              [`line_items[${idx}][price_data][recurring][interval]`]: "month",
            }
            : {}),
        });
        continue;
      }

      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        return new Response(JSON.stringify({ error: `Product ${item.productId} not synced to Stripe` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!dbProduct.stripe_price_id) {
        hasVariablePricing = true;
        continue;
      }

      if (dbProduct.is_recurring && (item.subscription || isProgramMembership)) {
        hasRecurring = true;
      }

      lineItems.push({
        [`line_items[${idx}][price]`]: dbProduct.stripe_price_id,
        [`line_items[${idx}][quantity]`]: String(item.quantity),
      });
    }

    if (hasVariablePricing && lineItems.length === 0) {
      return new Response(JSON.stringify({
        error: "Your cart contains only items with provider-determined pricing (e.g. HRT). After checkout you will complete a medical intake and, if needed, a consultation and lab review. Once your provider finalizes your treatment plan, you will receive an invoice for the exact cost before any charges are made.",
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const origin = req.headers.get("origin") || "https://mybaremethod.com";

    const sessionBody: Record<string, string> = {
      mode: hasRecurring ? "subscription" : "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      "metadata[order_source]": "web",
      "metadata[is_active_member]": memberClaim ? "true" : "false",
      "metadata[stripe_mode]": usesCustomPriceData ? "test_custom_pricing" : "mapped_prices",
      "metadata[accessory_member_discount_percent]": String(ACCESSORY_MEMBER_DISCOUNT_PERCENT),
    };

    if (customerUserId) {
      sessionBody.client_reference_id = customerUserId;
      sessionBody["metadata[customer_user_id]"] = customerUserId;
    }
    if (customerEmail) sessionBody["metadata[customer_email]"] = customerEmail.slice(0, 500);
    if (customerName) sessionBody["metadata[customer_name]"] = customerName.slice(0, 500);
    if (shippingMethod) sessionBody["metadata[shipping_method]"] = shippingMethod.slice(0, 100);
    if (typeof shippingCents === "number") sessionBody["metadata[shipping_cents]"] = String(Math.max(0, Math.round(shippingCents)));
    if (typeof taxCents === "number") sessionBody["metadata[tax_cents]"] = String(Math.max(0, Math.round(taxCents)));
    if (typeof subtotalCents === "number") sessionBody["metadata[subtotal_cents]"] = String(Math.max(0, Math.round(subtotalCents)));
    if (typeof discountCents === "number") sessionBody["metadata[discount_cents]"] = String(Math.max(0, Math.round(discountCents)));
    if (typeof freeShippingEligible === "boolean") {
      sessionBody["metadata[free_shipping_eligible]"] = freeShippingEligible ? "true" : "false";
    }
    if (requiresProviderReview) sessionBody["metadata[requires_provider_review]"] = "true";

    // Compact item snapshots for order history (Stripe metadata value max 500 chars).
    const snapshots = items.map((i) => ({
      productId: i.productId,
      productName: i.productName ?? i.productId,
      variantLabel: i.variantLabel ?? null,
      quantity: i.quantity,
      unitPriceCents: i.unitAmountCents ?? undefined,
      discountCents: 0,
      lineTotalCents:
        typeof i.unitAmountCents === "number" ? i.unitAmountCents * i.quantity : undefined,
    }));
    const snapJson = JSON.stringify(snapshots);
    if (snapJson.length <= 500) {
      sessionBody["metadata[item_snapshots]"] = snapJson;
    }

    const params = new URLSearchParams(sessionBody);
    for (const li of lineItems) {
      for (const [k, v] of Object.entries(li)) {
        params.append(k, v);
      }
    }

    const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!sessionRes.ok) {
      const err = await sessionRes.text();
      return new Response(JSON.stringify({ error: `Stripe error: ${err}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = await sessionRes.json();

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
