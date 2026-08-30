/**
 * Server-authoritative checkout pricing / shipping / tax decisions.
 * Edge function mirrors this logic; tests cover this module.
 */
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  NEXT_DAY_SHIPPING_CENTS,
  ACCESSORY_SHIPPING_CENTS,
  TWO_DAY_SHIPPING_CENTS,
  isFreeShippingEligible,
  type ShippingMethod,
} from '../orders/shipping';
import {
  labelRequestedFormulation,
  validateMembershipRequestedFormulation,
} from '../membership/requestedFormulation';
import {
  ACCESSORY_BUNDLE_PRODUCT_IDS,
  ACCESSORY_MEMBER_DISCOUNT_PERCENT,
  ACCESSORY_SALES_TAX_RATE,
  ACCESSORY_SALES_TAX_RATE_PERCENT,
  MEMBERSHIP_FIXED_CENTS,
  PROVIDER_CARE_FIXED_CENTS,
  PROVIDER_CARE_TAX_RATE,
  PROVIDER_CARE_TAX_RATE_PERCENT,
  SEMAGLUTIDE_MEMBERSHIP_APP_ID,
  TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS,
  TIRZEPATIDE_MEMBERSHIP_APP_ID,
  WEIGHT_MED_PRODUCT_IDS,
  WELLNESS_MEMBER_DISCOUNT_PERCENT,
} from './checkoutConstants';

export type PurchaseType = 'one_time' | 'auto_refill' | 'membership_program' | 'active_membership';

export interface CheckoutCartItem {
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
  section?: string;
  memberPricingEligible?: boolean;
  /** Normalized membership requested formulation (request only). */
  requestedFormulation?: string;
  /** Patient current/weekly dose — provider-review metadata only. */
  requestedDose?: string;
  membershipSlug?: string;
}

export interface CatalogMembershipRow {
  app_product_id: string;
  stripe_price_id_test: string | null;
  monthly_price_cents: number;
  display_name: string;
  slug?: string;
  included_formulations?: string[] | null;
}

export interface CatalogVariantRow {
  variant_key: string;
  stripe_price_id_test: string | null;
  price_cents: number;
  display_name: string;
  app_product_id: string;
  product_slug?: string;
}

export type LineResolution =
  | {
      kind: 'mapped_price';
      stripePriceId: string;
      quantity: number;
      unitAmountCents: number;
      recurring: boolean;
      source: 'catalog_memberships' | 'catalog_variants';
      productId: string;
      productName: string;
      variantLabel: string | null;
    }
  | {
      kind: 'price_data';
      unitAmountCents: number;
      quantity: number;
      name: string;
      recurring: boolean;
      reason:
        | 'auto_refill'
        | 'wellness_member_discount'
        | 'accessory_member_discount'
        | 'accessory_standard'
        | 'provider_care';
      productId: string;
      productName: string;
      variantLabel: string | null;
    };

export function isProgramMembership(
  item: Pick<CheckoutCartItem, 'productId' | 'purchaseType' | 'subscription'>,
): boolean {
  const purchaseType: PurchaseType =
    item.purchaseType ?? (item.subscription ? 'auto_refill' : 'one_time');
  return (
    purchaseType === 'membership_program' ||
    item.productId === SEMAGLUTIDE_MEMBERSHIP_APP_ID ||
    item.productId === TIRZEPATIDE_MEMBERSHIP_APP_ID
  );
}

export function isAccessoryLine(item: Pick<CheckoutCartItem, 'productId' | 'section'>): boolean {
  if (item.section === 'accessories') return true;
  return /^a\d+$/i.test(item.productId);
}

export function isProviderCareLine(item: Pick<CheckoutCartItem, 'productId' | 'section'>): boolean {
  if (item.section === 'provider-care') return true;
  return /^pc\d+$/i.test(item.productId);
}

export function isAccessoryEligibleForMemberDiscount(item: CheckoutCartItem): boolean {
  if (!isAccessoryLine(item)) return false;
  if (ACCESSORY_BUNDLE_PRODUCT_IDS.has(item.productId)) return false;
  if (item.memberPricingEligible === false) return false;
  return true;
}

export function applyPercentOffCents(standardCents: number, percent: number): number {
  if (!Number.isFinite(standardCents) || standardCents < 0) return 0;
  const p = Math.min(100, Math.max(0, percent));
  return Math.round(standardCents * (1 - p / 100));
}

/** Strip cart Auto-Refill suffix so catalog variant_key lookup works. */
export function normalizeVariantKey(variantId: string | undefined | null): string | null {
  if (!variantId) return null;
  return variantId.replace(/-refill$/i, '');
}

/**
 * Reject self-serve attempts to charge the Tirzepatide 30mg member-only $350 rate.
 * Public membership checkout uses owner-set $125 / $179 program prices via catalog_memberships.
 */
export function isForbiddenSelfServeMemberOnly350(item: CheckoutCartItem): boolean {
  if (!isProgramMembership(item)) return false;
  const requested = typeof item.unitAmountCents === 'number' ? Math.round(item.unitAmountCents) : null;
  if (requested === TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS) return true;
  if ((item.variantLabel ?? '').toLowerCase().includes('30mg') && requested === TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS) {
    return true;
  }
  // Membership lines must never carry a $350 unit amount under any label.
  if (requested === TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS) return true;
  return false;
}

export function authorizeAccessoryUnitCents(
  item: CheckoutCartItem,
  isActiveMember: boolean,
): number | null {
  if (!isAccessoryLine(item)) return null;
  const standard = Math.max(0, Math.round(item.standardPriceCents ?? item.unitAmountCents ?? 0));
  if (!standard) return null;

  if (!isActiveMember || !isAccessoryEligibleForMemberDiscount(item)) {
    return standard;
  }

  return applyPercentOffCents(standard, ACCESSORY_MEMBER_DISCOUNT_PERCENT);
}

/**
 * Authorize a single non-stacked discount for wellness products.
 * Auto-Refill 10% is not applied to new purchases.
 */
export function authorizeWellnessUnitCents(
  item: CheckoutCartItem,
  isActiveMember: boolean,
): { unitAmountCents: number; reason: 'auto_refill' | 'wellness_member_discount'; discountPercent: number } | null {
  if (isAccessoryLine(item) || isProviderCareLine(item) || isProgramMembership(item)) return null;
  const standard = Math.max(0, Math.round(item.standardPriceCents ?? 0));
  if (!standard) return null;

  const purchaseType: PurchaseType =
    item.purchaseType ?? (item.subscription ? 'auto_refill' : 'one_time');

  if (purchaseType === 'auto_refill' || item.subscription) {
    return {
      unitAmountCents: applyPercentOffCents(standard, 15),
      reason: 'auto_refill',
      discountPercent: 15,
    };
  }

  const wantsMember =
    isActiveMember &&
    item.memberPricingEligible !== false &&
    !WEIGHT_MED_PRODUCT_IDS.has(item.productId) &&
    (item.appliedDiscount === 'member' ||
      (typeof item.discountPercent === 'number' && item.discountPercent > 0) ||
      (typeof item.unitAmountCents === 'number' &&
        typeof item.standardPriceCents === 'number' &&
        item.unitAmountCents < item.standardPriceCents));

  if (wantsMember) {
    return {
      unitAmountCents: applyPercentOffCents(standard, WELLNESS_MEMBER_DISCOUNT_PERCENT),
      reason: 'wellness_member_discount',
      discountPercent: WELLNESS_MEMBER_DISCOUNT_PERCENT,
    };
  }

  return null;
}

export function resolveMembershipLine(
  item: CheckoutCartItem,
  membership: CatalogMembershipRow | undefined,
): LineResolution | { error: string } {
  if (isForbiddenSelfServeMemberOnly350(item)) {
    return {
      error:
        'Tirzepatide 30mg member-only pricing is not available for self-service checkout. Provider/admin approval is required.',
    };
  }

  const expected = MEMBERSHIP_FIXED_CENTS[item.productId];
  if (expected == null) {
    return { error: `Unknown membership product ${item.productId}` };
  }

  if (!membership?.stripe_price_id_test) {
    return {
      error: `Membership ${item.productId} is not synced to Stripe TEST (catalog_memberships.stripe_price_id_test missing).`,
    };
  }

  // Trust catalog synced price; monthly_price_cents should match approved rates.
  if (membership.monthly_price_cents !== expected) {
    return {
      error: `Membership ${item.productId} catalog amount mismatch (expected ${expected}, got ${membership.monthly_price_cents}).`,
    };
  }

  const dose = validateMembershipRequestedFormulation({
    requestedFormulation: item.requestedFormulation,
    includedFormulations: membership.included_formulations ?? [],
  });
  if (!dose.ok) return { error: dose.error };

  // Never honor client-supplied custom membership amounts.
  if (
    typeof item.unitAmountCents === 'number' &&
    Math.round(item.unitAmountCents) !== expected
  ) {
    // Allow UI label drift only when amount matches; otherwise reject non-approved amounts.
    if (Math.round(item.unitAmountCents) === TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS) {
      return {
        error:
          'Tirzepatide 30mg member-only pricing is not available for self-service checkout. Provider/admin approval is required.',
      };
    }
  }

  const doseLabel = labelRequestedFormulation(dose.value);

  return {
    kind: 'mapped_price',
    stripePriceId: membership.stripe_price_id_test,
    quantity: Math.max(1, Math.round(item.quantity) || 1),
    unitAmountCents: expected,
    recurring: true,
    source: 'catalog_memberships',
    productId: item.productId,
    productName: item.productName ?? membership.display_name,
    variantLabel: item.variantLabel ?? `Formulation: ${doseLabel}`,
  };
}

export function resolveProviderCareLine(item: CheckoutCartItem): LineResolution | { error: string } {
  const fixed = PROVIDER_CARE_FIXED_CENTS[item.productId];
  if (fixed == null) {
    return { error: `Unknown Provider Care product ${item.productId}` };
  }
  // Provider Care is intentionally NOT in stripe-sync catalog_*.
  // Charge approved fixed storefront amounts via price_data.
  return {
    kind: 'price_data',
    unitAmountCents: fixed,
    quantity: Math.max(1, Math.round(item.quantity) || 1),
    name: item.productName ?? item.productId,
    recurring: false,
    reason: 'provider_care',
    productId: item.productId,
    productName: item.productName ?? item.productId,
    variantLabel: item.variantLabel ?? null,
  };
}

export function resolveProductLine(
  item: CheckoutCartItem,
  isActiveMember: boolean,
  variant: CatalogVariantRow | undefined,
): LineResolution | { error: string } {
  if (isProgramMembership(item)) {
    return { error: 'Membership lines must use resolveMembershipLine' };
  }

  if (isProviderCareLine(item)) {
    return resolveProviderCareLine(item);
  }

  const qty = Math.max(1, Math.round(item.quantity) || 1);

  if (isAccessoryLine(item)) {
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
      kind: 'price_data',
      unitAmountCents: unit,
      quantity: qty,
      name,
      recurring: false,
      reason: discounted ? 'accessory_member_discount' : 'accessory_standard',
      productId: item.productId,
      productName: item.productName ?? item.productId,
      variantLabel: item.variantLabel ?? null,
    };
  }

  const discounted = authorizeWellnessUnitCents(item, isActiveMember);
  if (discounted) {
    // Never accept a client amount below the authorized floor (no stacking / deeper cut).
    let unit = discounted.unitAmountCents;
    if (typeof item.unitAmountCents === 'number' && Math.round(item.unitAmountCents) > unit) {
      // Client asking to pay more than authorized discount is fine; still charge authorized.
      unit = discounted.unitAmountCents;
    }
    if (
      typeof item.unitAmountCents === 'number' &&
      Math.round(item.unitAmountCents) < unit
    ) {
      unit = discounted.unitAmountCents;
    }
    const name = item.variantLabel
      ? `${item.productName ?? item.productId} (${item.variantLabel})`
      : (item.productName ?? item.productId);
    return {
      kind: 'price_data',
      unitAmountCents: unit,
      quantity: qty,
      name,
      recurring: discounted.reason === 'auto_refill',
      reason: discounted.reason,
      productId: item.productId,
      productName: item.productName ?? item.productId,
      variantLabel: item.variantLabel ?? null,
    };
  }

  // Ordinary undiscounted one-time: catalog variant TEST price.
  const variantKey = normalizeVariantKey(item.variantId);
  if (!variantKey) {
    return { error: `Missing variantId for product ${item.productId}` };
  }
  if (!variant?.stripe_price_id_test) {
    return {
      error: `Product variant ${variantKey} is not synced to Stripe TEST (catalog_variants.stripe_price_id_test missing).`,
    };
  }
  if (variant.app_product_id && variant.app_product_id !== item.productId) {
    return { error: `Variant ${variantKey} does not belong to product ${item.productId}` };
  }

  return {
    kind: 'mapped_price',
    stripePriceId: variant.stripe_price_id_test,
    quantity: qty,
    unitAmountCents: variant.price_cents,
    recurring: false,
    source: 'catalog_variants',
    productId: item.productId,
    productName: item.productName ?? variant.display_name,
    variantLabel: item.variantLabel ?? variant.display_name,
  };
}

export function isProviderCareResolvedLine(line: LineResolution): boolean {
  if (line.kind === 'price_data' && line.reason === 'provider_care') return true;
  return /^pc\d+$/i.test(line.productId);
}

export function isAccessoryResolvedLine(line: LineResolution): boolean {
  if (line.kind === 'price_data' && (line.reason === 'accessory_member_discount' || line.reason === 'accessory_standard')) {
    return true;
  }
  return /^a\d+$/i.test(line.productId);
}

/** Physical merchandise / memberships that may ship. Provider Care services do not. */
export function isShippableResolvedLine(line: LineResolution): boolean {
  return !isProviderCareResolvedLine(line);
}

/** Active Wellness membership medication lines (m1 / m2 / catalog_memberships). */
export function isMembershipResolvedLine(line: LineResolution): boolean {
  if (line.kind === 'mapped_price' && line.source === 'catalog_memberships') return true;
  return (
    line.productId === SEMAGLUTIDE_MEMBERSHIP_APP_ID ||
    line.productId === TIRZEPATIDE_MEMBERSHIP_APP_ID
  );
}

/**
 * Ordinary one-time (and Auto-Refill) shippable merchandise used for the $500
 * free-shipping threshold. Memberships and Provider Care are excluded.
 */
export function isFreeShippingEligibleMerchandiseLine(line: LineResolution): boolean {
  return isShippableResolvedLine(line) && !isMembershipResolvedLine(line);
}

export function lineSubtotalCents(lines: LineResolution[]): number {
  return lines.reduce((sum, line) => sum + line.unitAmountCents * line.quantity, 0);
}

export function providerCareTaxableSubtotalCents(lines: LineResolution[]): number {
  return lineSubtotalCents(lines.filter(isProviderCareResolvedLine));
}

export function accessoryTaxableSubtotalCents(lines: LineResolution[]): number {
  return lineSubtotalCents(lines.filter(isAccessoryResolvedLine));
}

/** All physically shippable lines (includes memberships; excludes Provider Care). */
export function shippableMerchandiseSubtotalCents(lines: LineResolution[]): number {
  return lineSubtotalCents(lines.filter(isShippableResolvedLine));
}

/**
 * Subtotal for $500 free-shipping eligibility only.
 * Membership medication value must never count toward this threshold.
 */
export function freeShippingEligibleMerchandiseSubtotalCents(lines: LineResolution[]): number {
  return lineSubtotalCents(lines.filter(isFreeShippingEligibleMerchandiseLine));
}

export function cartRequiresPhysicalShipping(lines: LineResolution[]): boolean {
  return lines.some(isShippableResolvedLine);
}

/**
 * Provider Care tax authorize helper — tax-inclusive checkout keeps rate at 0.
 * Does NOT apply to wellness, memberships, accessories, Auto-Refill, or shipping.
 * Ignores any client-supplied tax cents. NEW orders must persist tax_cents = 0.
 */
export function authorizeProviderCareTax(input: {
  providerCareTaxableSubtotalCents: number;
  clientProviderCareTaxCents?: number;
  clientTaxCents?: number;
}): {
  providerCareTaxCents: number;
  providerCareTaxRatePercent: number;
  providerCareTaxableSubtotalCents: number;
} {
  const taxable = Math.max(0, Math.round(input.providerCareTaxableSubtotalCents));
  const authorized = Math.round(taxable * PROVIDER_CARE_TAX_RATE);
  void input.clientProviderCareTaxCents;
  void input.clientTaxCents;
  return {
    providerCareTaxableSubtotalCents: taxable,
    providerCareTaxRatePercent: PROVIDER_CARE_TAX_RATE_PERCENT,
    providerCareTaxCents: authorized,
  };
}

/**
 * Accessory sales-tax authorize helper — tax-inclusive checkout keeps rate at 0.
 * Applies ONLY to accessory merchandise when a rate is re-enabled. Not wellness / PC /
 * memberships / shipping. Do NOT re-enable without an explicit product decision.
 */
export function authorizeAccessorySalesTax(input: {
  accessoryTaxableSubtotalCents: number;
  clientAccessoryTaxCents?: number;
}): {
  accessorySalesTaxCents: number;
  accessorySalesTaxRatePercent: number;
  accessoryTaxableSubtotalCents: number;
} {
  const taxable = Math.max(0, Math.round(input.accessoryTaxableSubtotalCents));
  const authorized = Math.round(taxable * ACCESSORY_SALES_TAX_RATE);
  void input.clientAccessoryTaxCents;
  return {
    accessoryTaxableSubtotalCents: taxable,
    accessorySalesTaxRatePercent: ACCESSORY_SALES_TAX_RATE_PERCENT,
    accessorySalesTaxCents: authorized,
  };
}

export function authorizeShippingCents(input: {
  shippingMethod?: string;
  clientShippingCents?: number;
  /**
   * Subtotal used ONLY for the $500 free-shipping threshold.
   * Must be ordinary eligible merchandise — never membership medication value.
   */
  shippableSubtotalCents: number;
  requiresPhysicalShipping: boolean;
  /** When true, membership medication is in the cart (still ships; never free by itself). */
  containsMembership?: boolean;
  /** True only when every physical line is an accessory. */
  accessoryOnly?: boolean;
}): {
  shippingMethod: ShippingMethod;
  shippingCents: number;
  freeShippingEligible: boolean;
} | { error: string } {
  // Provider Care-only (and other non-shippable) carts must not be charged physical shipping.
  if (!input.requiresPhysicalShipping) {
    const authorized = 0;
    if (
      typeof input.clientShippingCents === 'number' &&
      Math.round(input.clientShippingCents) !== authorized
    ) {
      return { error: 'Physical shipping is not applicable to this order.' };
    }
    return {
      shippingMethod: 'none',
      shippingCents: 0,
      freeShippingEligible: false,
    };
  }

  if (input.shippingMethod === 'standard') {
    return {
      error:
        'Unsupported shipping method: standard. Approved methods are accessory ($10), two_day ($30), and next_day ($50).',
    };
  }

  // Free shipping is based solely on ordinary merchandise — membership value excluded.
  const free = isFreeShippingEligible(input.shippableSubtotalCents);
  let method: ShippingMethod;

  if (free) {
    method = 'free_over_500';
  } else if (input.shippingMethod === 'accessory') {
    if (!input.accessoryOnly) {
      return { error: 'Accessory shipping is available only for accessory-only orders.' };
    }
    method = 'accessory';
  } else if (input.shippingMethod === 'next_day') {
    method = 'next_day';
  } else if (input.shippingMethod === 'two_day') {
    method = 'two_day';
  } else if (
    !input.shippingMethod ||
    input.shippingMethod === 'none'
  ) {
    if (input.accessoryOnly) {
      method = 'accessory';
    } else {
      // Membership medication carts without free shipping must use paid Two-Day / Next-Day.
      if (input.containsMembership) {
        return {
          error:
            'Membership checkout requires a shipping method: two_day ($30) or next_day ($50).',
        };
      }
      method = 'two_day';
    }
  } else if (input.shippingMethod === 'free_over_500') {
    return {
      error:
        'Free shipping requires $500 or more in eligible ordinary merchandise (membership value does not count).',
    };
  } else {
    return { error: `Unsupported shipping method: ${input.shippingMethod}` };
  }

  const authorized = free
    ? 0
    : method === 'accessory'
      ? ACCESSORY_SHIPPING_CENTS
    : method === 'next_day'
      ? NEXT_DAY_SHIPPING_CENTS
      : TWO_DAY_SHIPPING_CENTS;

  if (
    typeof input.clientShippingCents === 'number' &&
    Math.round(input.clientShippingCents) !== authorized
  ) {
    return {
      error: `Shipping amount mismatch (authorized ${authorized} cents for ${method}).`,
    };
  }

  return {
    shippingMethod: method,
    shippingCents: authorized,
    freeShippingEligible: free,
  };
}

export function shippingDisplayName(method: ShippingMethod): string {
  if (method === 'free_over_500') return 'Free Shipping ($500+)';
  if (method === 'next_day') return 'Next-Day Shipping';
  if (method === 'two_day') return 'Two-Day Shipping';
  if (method === 'accessory') return 'Accessory Shipping';
  if (method === 'none') return 'No shipping';
  return 'Shipping';
}

/** Cart helpers for frontend display before Stripe session creation. */
function cartLineCents(
  item: Pick<CheckoutCartItem, 'quantity' | 'unitAmountCents'> & { priceDollars?: number },
): number {
  const unit =
    typeof item.unitAmountCents === 'number'
      ? Math.round(item.unitAmountCents)
      : Math.round((item.priceDollars ?? 0) * 100);
  const qty = Math.max(1, Math.round(item.quantity) || 1);
  return unit * qty;
}

export function cartProviderCareSubtotalCents(
  items: Array<Pick<CheckoutCartItem, 'productId' | 'section' | 'quantity' | 'unitAmountCents'> & { priceDollars?: number }>,
): number {
  return items.reduce((sum, item) => (isProviderCareLine(item) ? sum + cartLineCents(item) : sum), 0);
}

export function cartAccessorySubtotalCents(
  items: Array<Pick<CheckoutCartItem, 'productId' | 'section' | 'quantity' | 'unitAmountCents'> & { priceDollars?: number }>,
): number {
  return items.reduce((sum, item) => (isAccessoryLine(item) ? sum + cartLineCents(item) : sum), 0);
}

/** All physically shippable cart cents (includes memberships; excludes Provider Care). */
export function cartShippableSubtotalCents(
  items: Array<
    Pick<CheckoutCartItem, 'productId' | 'section' | 'quantity' | 'unitAmountCents' | 'purchaseType' | 'subscription'> & {
      priceDollars?: number;
    }
  >,
): number {
  return items.reduce((sum, item) => (isProviderCareLine(item) ? sum : sum + cartLineCents(item)), 0);
}

/**
 * Ordinary merchandise cents for the $500 free-shipping threshold.
 * Memberships (m1/m2 / membership_program) never contribute.
 */
export function cartFreeShippingMerchandiseSubtotalCents(
  items: Array<
    Pick<CheckoutCartItem, 'productId' | 'section' | 'quantity' | 'unitAmountCents' | 'purchaseType' | 'subscription'> & {
      priceDollars?: number;
    }
  >,
): number {
  return items.reduce((sum, item) => {
    if (isProviderCareLine(item) || isProgramMembership(item)) return sum;
    return sum + cartLineCents(item);
  }, 0);
}

export function cartContainsMembership(
  items: Array<Pick<CheckoutCartItem, 'productId' | 'purchaseType' | 'subscription' | 'section'>>,
): boolean {
  return items.some(isProgramMembership);
}

export function cartRequiresPhysicalShippingFromItems(
  items: Array<Pick<CheckoutCartItem, 'productId' | 'section'>>,
): boolean {
  return items.some((item) => !isProviderCareLine(item));
}

// Re-export shipping constants used by checkout tests/callers.
export { FREE_SHIPPING_THRESHOLD_CENTS, TWO_DAY_SHIPPING_CENTS, NEXT_DAY_SHIPPING_CENTS };
