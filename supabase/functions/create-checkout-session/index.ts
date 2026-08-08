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
  variantId?: string;
  /** Storefront section/category — used to authorize accessory member pricing. */
  section?: string;
  /** Per-SKU eligibility flag from catalog (bundles default false). */
  memberPricingEligible?: boolean;
}

/** Mirrors src/lib/checkout/checkoutConstants.ts + authorizeCheckout.ts */

const SEMAGLUTIDE_MEMBERSHIP_APP_ID = "m1";
const TIRZEPATIDE_MEMBERSHIP_APP_ID = "m2";
const SEMAGLUTIDE_MEMBERSHIP_CENTS = 19900;
const TIRZEPATIDE_MEMBERSHIP_CENTS = 24900;
const TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS = 35000;

const WELLNESS_MEMBER_DISCOUNT_PERCENT = 15;
const AUTO_REFILL_DISCOUNT_PERCENT = 10;
const ACCESSORY_MEMBER_DISCOUNT_PERCENT = 15;
/** Provider Care only — never a universal cart tax. */
const PROVIDER_CARE_TAX_RATE = 0.018;
const PROVIDER_CARE_TAX_RATE_PERCENT = 1.8;

const TWO_DAY_SHIPPING_CENTS = 3000;
const NEXT_DAY_SHIPPING_CENTS = 5000;
const FREE_SHIPPING_THRESHOLD_CENTS = 50000;

const ACCESSORY_BUNDLE_PRODUCT_IDS = new Set(["a1"]);
/** Semaglutide / Tirzepatide medication — never receive wellness 15% member discount. */
const WEIGHT_MED_PRODUCT_IDS = new Set(["p1", "p5"]);

const PROVIDER_CARE_FIXED_CENTS: Record<string, number> = {
  pc1: 7500,
  pc2: 5500,
  pc3: 5500,
};

const MEMBERSHIP_FIXED_CENTS: Record<string, number> = {
  [SEMAGLUTIDE_MEMBERSHIP_APP_ID]: SEMAGLUTIDE_MEMBERSHIP_CENTS,
  [TIRZEPATIDE_MEMBERSHIP_APP_ID]: TIRZEPATIDE_MEMBERSHIP_CENTS,
};

type ShippingMethod = "two_day" | "next_day" | "free_over_500" | "none";

interface CatalogMembershipRow {
  app_product_id: string;
  stripe_price_id_test: string | null;
  monthly_price_cents: number;
  display_name: string;
}

interface CatalogVariantRow {
  variant_key: string;
  stripe_price_id_test: string | null;
  price_cents: number;
  display_name: string;
  app_product_id: string;
}

type LineResolution =
  | {
    kind: "mapped_price";
    stripePriceId: string;
    quantity: number;
    unitAmountCents: number;
    recurring: boolean;
    source: "catalog_memberships" | "catalog_variants";
    productId: string;
    productName: string;
    variantLabel: string | null;
  }
  | {
    kind: "price_data";
    unitAmountCents: number;
    quantity: number;
    name: string;
    recurring: boolean;
    reason:
      | "auto_refill"
      | "wellness_member_discount"
      | "accessory_member_discount"
      | "accessory_standard"
      | "provider_care";
    productId: string;
    productName: string;
    variantLabel: string | null;
  };

function assertTestKey(secretKey: string) {
  if (secretKey.startsWith("sk_live_") || secretKey.startsWith("rk_live_")) {
    throw new Error("Checkout is TEST MODE only. Live Stripe keys are not allowed.");
  }
  if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("rk_test_")) {
    throw new Error("Checkout requires a Stripe TEST key (sk_test_… or rk_test_…).");
  }
}

function applyPercentOffCents(standardCents: number, percent: number): number {
  if (!Number.isFinite(standardCents) || standardCents < 0) return 0;
  const p = Math.min(100, Math.max(0, percent));
  return Math.round(standardCents * (1 - p / 100));
}

function isProgramMembership(item: CartItemRequest): boolean {
  const purchaseType: PurchaseType = item.purchaseType ?? (item.subscription ? "auto_refill" : "one_time");
  return (
    purchaseType === "membership_program" ||
    item.productId === SEMAGLUTIDE_MEMBERSHIP_APP_ID ||
    item.productId === TIRZEPATIDE_MEMBERSHIP_APP_ID
  );
}

function isAccessoryLine(item: CartItemRequest): boolean {
  if (item.section === "accessories") return true;
  return /^a\d+$/i.test(item.productId);
}

function isProviderCareLine(item: CartItemRequest): boolean {
  if (item.section === "provider-care") return true;
  return /^pc\d+$/i.test(item.productId);
}

function isAccessoryEligibleForMemberDiscount(item: CartItemRequest): boolean {
  if (!isAccessoryLine(item)) return false;
  if (ACCESSORY_BUNDLE_PRODUCT_IDS.has(item.productId)) return false;
  if (item.memberPricingEligible === false) return false;
  return true;
}

function normalizeVariantKey(variantId: string | undefined | null): string | null {
  if (!variantId) return null;
  return variantId.replace(/-refill$/i, "");
}

function isForbiddenSelfServeMemberOnly350(item: CartItemRequest): boolean {
  if (!isProgramMembership(item)) return false;
  const requested = typeof item.unitAmountCents === "number" ? Math.round(item.unitAmountCents) : null;
  return requested === TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS;
}

function authorizeAccessoryUnitCents(item: CartItemRequest, isActiveMember: boolean): number | null {
  if (!isAccessoryLine(item)) return null;
  const standard = Math.max(0, Math.round(item.standardPriceCents ?? item.unitAmountCents ?? 0));
  if (!standard) return null;
  if (!isActiveMember || !isAccessoryEligibleForMemberDiscount(item)) return standard;
  return applyPercentOffCents(standard, ACCESSORY_MEMBER_DISCOUNT_PERCENT);
}

function authorizeWellnessUnitCents(
  item: CartItemRequest,
  isActiveMember: boolean,
): { unitAmountCents: number; reason: "auto_refill" | "wellness_member_discount" } | null {
  if (isAccessoryLine(item) || isProviderCareLine(item) || isProgramMembership(item)) return null;
  const standard = Math.max(0, Math.round(item.standardPriceCents ?? 0));
  if (!standard) return null;

  const purchaseType: PurchaseType = item.purchaseType ?? (item.subscription ? "auto_refill" : "one_time");

  if (purchaseType === "auto_refill" || item.subscription) {
    return {
      unitAmountCents: applyPercentOffCents(standard, AUTO_REFILL_DISCOUNT_PERCENT),
      reason: "auto_refill",
    };
  }

  const wantsMember =
    isActiveMember &&
    item.memberPricingEligible !== false &&
    !WEIGHT_MED_PRODUCT_IDS.has(item.productId) &&
    (item.appliedDiscount === "member" ||
      (typeof item.discountPercent === "number" && item.discountPercent > 0) ||
      (typeof item.unitAmountCents === "number" &&
        typeof item.standardPriceCents === "number" &&
        item.unitAmountCents < item.standardPriceCents));

  if (wantsMember) {
    return {
      unitAmountCents: applyPercentOffCents(standard, WELLNESS_MEMBER_DISCOUNT_PERCENT),
      reason: "wellness_member_discount",
    };
  }

  return null;
}

function resolveMembershipLine(
  item: CartItemRequest,
  membership: CatalogMembershipRow | undefined,
): LineResolution | { error: string } {
  if (isForbiddenSelfServeMemberOnly350(item)) {
    return {
      error:
        "Tirzepatide 30mg member-only pricing is not available for self-service checkout. Provider/admin approval is required.",
    };
  }

  const expected = MEMBERSHIP_FIXED_CENTS[item.productId];
  if (expected == null) return { error: `Unknown membership product ${item.productId}` };
  if (!membership?.stripe_price_id_test) {
    return {
      error: `Membership ${item.productId} is not synced to Stripe TEST (catalog_memberships.stripe_price_id_test missing).`,
    };
  }
  if (membership.monthly_price_cents !== expected) {
    return {
      error: `Membership ${item.productId} catalog amount mismatch (expected ${expected}, got ${membership.monthly_price_cents}).`,
    };
  }

  return {
    kind: "mapped_price",
    stripePriceId: membership.stripe_price_id_test,
    quantity: Math.max(1, Math.round(item.quantity) || 1),
    unitAmountCents: expected,
    recurring: true,
    source: "catalog_memberships",
    productId: item.productId,
    productName: item.productName ?? membership.display_name,
    variantLabel: item.variantLabel ?? null,
  };
}

function resolveProviderCareLine(item: CartItemRequest): LineResolution | { error: string } {
  const fixed = PROVIDER_CARE_FIXED_CENTS[item.productId];
  if (fixed == null) return { error: `Unknown Provider Care product ${item.productId}` };
  // Intentionally not in stripe-sync catalog_* — charge approved fixed storefront amounts.
  return {
    kind: "price_data",
    unitAmountCents: fixed,
    quantity: Math.max(1, Math.round(item.quantity) || 1),
    name: item.productName ?? item.productId,
    recurring: false,
    reason: "provider_care",
    productId: item.productId,
    productName: item.productName ?? item.productId,
    variantLabel: item.variantLabel ?? null,
  };
}

function resolveProductLine(
  item: CartItemRequest,
  isActiveMember: boolean,
  variant: CatalogVariantRow | undefined,
): LineResolution | { error: string } {
  if (isProviderCareLine(item)) return resolveProviderCareLine(item);

  const qty = Math.max(1, Math.round(item.quantity) || 1);
  const purchaseType: PurchaseType = item.purchaseType ?? (item.subscription ? "auto_refill" : "one_time");

  if (isAccessoryLine(item)) {
    if (purchaseType === "auto_refill" || item.subscription) {
      return { error: "Auto-Refill is not available on accessories." };
    }
    const unit = authorizeAccessoryUnitCents(item, isActiveMember);
    if (unit == null || unit <= 0) {
      return { error: `Missing unit amount for accessory ${item.productId}` };
    }
    const name = item.variantLabel
      ? `${item.productName ?? item.productId} (${item.variantLabel})`
      : (item.productName ?? item.productId);
    const discounted =
      isActiveMember &&
      isAccessoryEligibleForMemberDiscount(item) &&
      unit < Math.round(item.standardPriceCents ?? unit);
    return {
      kind: "price_data",
      unitAmountCents: unit,
      quantity: qty,
      name,
      recurring: false,
      reason: discounted ? "accessory_member_discount" : "accessory_standard",
      productId: item.productId,
      productName: item.productName ?? item.productId,
      variantLabel: item.variantLabel ?? null,
    };
  }

  const discounted = authorizeWellnessUnitCents(item, isActiveMember);
  if (discounted) {
    const name = item.variantLabel
      ? `${item.productName ?? item.productId} (${item.variantLabel})`
      : (item.productName ?? item.productId);
    return {
      kind: "price_data",
      unitAmountCents: discounted.unitAmountCents,
      quantity: qty,
      name,
      recurring: discounted.reason === "auto_refill",
      reason: discounted.reason,
      productId: item.productId,
      productName: item.productName ?? item.productId,
      variantLabel: item.variantLabel ?? null,
    };
  }

  const variantKey = normalizeVariantKey(item.variantId);
  if (!variantKey) return { error: `Missing variantId for product ${item.productId}` };
  if (!variant?.stripe_price_id_test) {
    return {
      error: `Product variant ${variantKey} is not synced to Stripe TEST (catalog_variants.stripe_price_id_test missing).`,
    };
  }
  if (variant.app_product_id && variant.app_product_id !== item.productId) {
    return { error: `Variant ${variantKey} does not belong to product ${item.productId}` };
  }

  return {
    kind: "mapped_price",
    stripePriceId: variant.stripe_price_id_test,
    quantity: qty,
    unitAmountCents: variant.price_cents,
    recurring: false,
    source: "catalog_variants",
    productId: item.productId,
    productName: item.productName ?? variant.display_name,
    variantLabel: item.variantLabel ?? variant.display_name,
  };
}

function isProviderCareResolvedLine(line: LineResolution): boolean {
  if (line.kind === "price_data" && line.reason === "provider_care") return true;
  return /^pc\d+$/i.test(line.productId);
}

function authorizeShippingCents(input: {
  shippingMethod?: string;
  clientShippingCents?: number;
  shippableSubtotalCents: number;
  requiresPhysicalShipping: boolean;
}): { shippingMethod: ShippingMethod; shippingCents: number; freeShippingEligible: boolean } | { error: string } {
  if (!input.requiresPhysicalShipping) {
    if (
      typeof input.clientShippingCents === "number" &&
      Math.round(input.clientShippingCents) !== 0
    ) {
      return { error: "Physical shipping is not applicable to this order." };
    }
    return { shippingMethod: "none", shippingCents: 0, freeShippingEligible: false };
  }

  const free = input.shippableSubtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  let method: ShippingMethod;

  if (free) {
    method = "free_over_500";
  } else if (input.shippingMethod === "next_day") {
    method = "next_day";
  } else if (
    input.shippingMethod === "two_day" ||
    !input.shippingMethod ||
    input.shippingMethod === "none"
  ) {
    method = "two_day";
  } else if (input.shippingMethod === "free_over_500") {
    return { error: "Free shipping requires a shippable merchandise subtotal of $500 or more." };
  } else {
    return { error: `Unsupported shipping method: ${input.shippingMethod}` };
  }

  const authorized = free
    ? 0
    : method === "next_day"
    ? NEXT_DAY_SHIPPING_CENTS
    : TWO_DAY_SHIPPING_CENTS;

  if (
    typeof input.clientShippingCents === "number" &&
    Math.round(input.clientShippingCents) !== authorized
  ) {
    return {
      error: `Shipping amount mismatch (authorized ${authorized} cents for ${method}).`,
    };
  }

  return { shippingMethod: method, shippingCents: authorized, freeShippingEligible: free };
}

function shippingDisplayName(method: ShippingMethod): string {
  if (method === "free_over_500") return "Free Shipping ($500+)";
  if (method === "next_day") return "Next-Day Shipping";
  if (method === "none") return "No shipping";
  return "Two-Day Shipping";
}

function jsonError(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sbGet<T>(supabaseUrl: string, serviceKey: string, path: string): Promise<T | { error: string }> {
  const res = await fetch(`${supabaseUrl}${path}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    return { error: `Catalog lookup failed (${res.status}): ${text}` };
  }
  return await res.json() as T;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const secretKey = Deno.env.get("STRIPE_SECRET_KEY_TEST") || Deno.env.get("STRIPE_SECRET_KEY");
  if (!secretKey) return jsonError("Stripe not configured", 500);

  try {
    assertTestKey(secretKey);
  } catch (err) {
    return jsonError(err.message, 500);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return jsonError("Supabase not configured", 500);

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
      discountCents,
      requiresProviderReview,
    } = body;

    const memberClaim = isActiveMember === true;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return jsonError("No items provided");
    }

    // ---- Catalog lookups (modern stripe-sync targets). No stripe_products. ----
    const membershipIds = [
      ...new Set(
        items.filter(isProgramMembership).map((i) => i.productId).filter((id) => id === "m1" || id === "m2"),
      ),
    ];
    const variantKeys = [
      ...new Set(
        items
          .filter((i) => !isProgramMembership(i) && !isAccessoryLine(i) && !isProviderCareLine(i))
          .map((i) => normalizeVariantKey(i.variantId))
          .filter((k): k is string => !!k),
      ),
    ];

    const membershipMap = new Map<string, CatalogMembershipRow>();
    if (membershipIds.length > 0) {
      const mem = await sbGet<CatalogMembershipRow[]>(
        supabaseUrl,
        serviceKey,
        `/rest/v1/catalog_memberships?app_product_id=in.(${membershipIds.join(",")})&select=app_product_id,stripe_price_id_test,monthly_price_cents,display_name`,
      );
      if ("error" in mem) return jsonError(mem.error, 500);
      for (const row of mem) membershipMap.set(row.app_product_id, row);
    }

    const variantMap = new Map<string, CatalogVariantRow>();
    if (variantKeys.length > 0) {
      const encoded = variantKeys.map((k) => `"${k}"`).join(",");
      const rows = await sbGet<
        Array<{
          variant_key: string;
          stripe_price_id_test: string | null;
          price_cents: number;
          display_name: string;
          catalog_products: { app_product_id: string } | { app_product_id: string }[] | null;
        }>
      >(
        supabaseUrl,
        serviceKey,
        `/rest/v1/catalog_variants?variant_key=in.(${encoded})&select=variant_key,stripe_price_id_test,price_cents,display_name,catalog_products!inner(app_product_id)`,
      );
      if ("error" in rows) return jsonError(rows.error, 500);
      for (const row of rows) {
        const product = Array.isArray(row.catalog_products)
          ? row.catalog_products[0]
          : row.catalog_products;
        variantMap.set(row.variant_key, {
          variant_key: row.variant_key,
          stripe_price_id_test: row.stripe_price_id_test,
          price_cents: row.price_cents,
          display_name: row.display_name,
          app_product_id: product?.app_product_id ?? "",
        });
      }
    }

    const resolved: LineResolution[] = [];
    let usesCustomPriceData = false;
    let hasRecurring = false;

    for (const item of items) {
      let line: LineResolution | { error: string };
      if (isProgramMembership(item)) {
        line = resolveMembershipLine(item, membershipMap.get(item.productId));
      } else {
        const key = normalizeVariantKey(item.variantId) ?? "";
        line = resolveProductLine(item, memberClaim, variantMap.get(key));
      }
      if ("error" in line) return jsonError(line.error);

      if (line.kind === "price_data") usesCustomPriceData = true;
      if (line.recurring) hasRecurring = true;
      resolved.push(line);
    }

    if (resolved.length === 0) {
      return jsonError(
        "Your cart contains only items with provider-determined pricing (e.g. HRT). After checkout you will complete a medical intake and, if needed, a consultation and lab review. Once your provider finalizes your treatment plan, you will receive an invoice for the exact cost before any charges are made.",
      );
    }

    const authorizedSubtotal = resolved.reduce(
      (sum, line) => sum + line.unitAmountCents * line.quantity,
      0,
    );
    const providerCareTaxableSubtotal = resolved.reduce((sum, line) => {
      if (!isProviderCareResolvedLine(line)) return sum;
      return sum + line.unitAmountCents * line.quantity;
    }, 0);
    const shippableSubtotal = authorizedSubtotal - providerCareTaxableSubtotal;
    const requiresPhysicalShipping = resolved.some((line) => !isProviderCareResolvedLine(line));

    const shippingAuth = authorizeShippingCents({
      shippingMethod,
      clientShippingCents: shippingCents,
      shippableSubtotalCents: shippableSubtotal,
      requiresPhysicalShipping,
    });
    if ("error" in shippingAuth) return jsonError(shippingAuth.error);

    // Provider Care 1.8% only — never universal 8%, never on wellness/accessories/shipping.
    const providerCareTaxCents = Math.round(providerCareTaxableSubtotal * PROVIDER_CARE_TAX_RATE);
    void taxCents;

    const origin = req.headers.get("origin") || "https://mybaremethod.com";

    const sessionBody: Record<string, string> = {
      mode: hasRecurring ? "subscription" : "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      "metadata[order_source]": "web",
      "metadata[is_active_member]": memberClaim ? "true" : "false",
      "metadata[stripe_mode]": usesCustomPriceData ? "test_custom_pricing" : "mapped_prices",
      "metadata[accessory_member_discount_percent]": String(ACCESSORY_MEMBER_DISCOUNT_PERCENT),
      "metadata[catalog_price_source]": "catalog_memberships_and_variants_test",
      "metadata[provider_care_tax_rate]": String(PROVIDER_CARE_TAX_RATE_PERCENT),
      "metadata[provider_care_tax_cents]": String(providerCareTaxCents),
      "metadata[provider_care_taxable_subtotal_cents]": String(providerCareTaxableSubtotal),
      // Webhook compatibility: tax_cents mirrors Provider Care tax (not accessory sales tax).
      "metadata[tax_cents]": String(providerCareTaxCents),
    };

    if (requiresPhysicalShipping) {
      sessionBody["shipping_address_collection[allowed_countries][0]"] = "US";
      sessionBody["shipping_options[0][shipping_rate_data][type]"] = "fixed_amount";
      sessionBody["shipping_options[0][shipping_rate_data][fixed_amount][amount]"] = String(
        shippingAuth.shippingCents,
      );
      sessionBody["shipping_options[0][shipping_rate_data][fixed_amount][currency]"] = "usd";
      sessionBody["shipping_options[0][shipping_rate_data][display_name]"] = shippingDisplayName(
        shippingAuth.shippingMethod,
      );
    }

    if (customerUserId) {
      sessionBody.client_reference_id = customerUserId;
      sessionBody["metadata[customer_user_id]"] = customerUserId;
    }
    if (customerEmail) sessionBody["metadata[customer_email]"] = customerEmail.slice(0, 500);
    if (customerName) sessionBody["metadata[customer_name]"] = customerName.slice(0, 500);

    sessionBody["metadata[shipping_method]"] = shippingAuth.shippingMethod;
    sessionBody["metadata[shipping_cents]"] = String(shippingAuth.shippingCents);
    sessionBody["metadata[subtotal_cents]"] = String(authorizedSubtotal);
    if (typeof discountCents === "number") {
      sessionBody["metadata[discount_cents]"] = String(Math.max(0, Math.round(discountCents)));
    }
    sessionBody["metadata[free_shipping_eligible]"] = shippingAuth.freeShippingEligible ? "true" : "false";
    if (requiresProviderReview) sessionBody["metadata[requires_provider_review]"] = "true";

    const snapshots = resolved.map((line) => ({
      productId: line.productId,
      productName: line.productName,
      variantLabel: line.variantLabel,
      quantity: line.quantity,
      unitPriceCents: line.unitAmountCents,
      discountCents: 0,
      lineTotalCents: line.unitAmountCents * line.quantity,
    }));
    const snapJson = JSON.stringify(snapshots);
    if (snapJson.length <= 500) {
      sessionBody["metadata[item_snapshots]"] = snapJson;
    }

    const params = new URLSearchParams(sessionBody);

    resolved.forEach((line, idx) => {
      if (line.kind === "mapped_price") {
        params.append(`line_items[${idx}][price]`, line.stripePriceId);
        params.append(`line_items[${idx}][quantity]`, String(line.quantity));
        return;
      }
      params.append(`line_items[${idx}][price_data][currency]`, "usd");
      params.append(`line_items[${idx}][price_data][unit_amount]`, String(line.unitAmountCents));
      params.append(`line_items[${idx}][price_data][product_data][name]`, line.name);
      params.append(`line_items[${idx}][quantity]`, String(line.quantity));
      if (line.recurring) {
        params.append(`line_items[${idx}][price_data][recurring][interval]`, "month");
      }
    });

    // Charge Provider Care 1.8% in Stripe when applicable (not metadata-only).
    if (providerCareTaxCents > 0) {
      const taxIdx = resolved.length;
      params.append(`line_items[${taxIdx}][price_data][currency]`, "usd");
      params.append(`line_items[${taxIdx}][price_data][unit_amount]`, String(providerCareTaxCents));
      params.append(`line_items[${taxIdx}][price_data][product_data][name]`, "Provider Care Tax (1.8%)");
      params.append(`line_items[${taxIdx}][quantity]`, "1");
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
      return jsonError(`Stripe error: ${err}`, 500);
    }

    const session = await sessionRes.json();

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return jsonError(err.message, 500);
  }
});
