/**
 * Approved shipping options for order records (Phase 2).
 * Policy: accessories use a separate $10 storefront shipping charge.
 * Prescription, lab, provider-care, and other non-accessory checkout paths do
 * not add a separate storefront shipping charge.
 * Do not use legacy $6.95 / $75 free-shipping threshold or "standard" in new checkout.
 */

/** Methods accepted by modern checkout authorization. */
export const SHIPPING_METHODS = [
  'accessory',
  'two_day',
  'next_day',
  'free_over_500',
  'none',
] as const;

export type ShippingMethod = (typeof SHIPPING_METHODS)[number];

/** Customer-selectable paid methods (excludes free_over_500 / none). */
export const SELECTABLE_SHIPPING_METHODS = ['accessory'] as const;
export type SelectableShippingMethod = (typeof SELECTABLE_SHIPPING_METHODS)[number];

export const TWO_DAY_SHIPPING_CENTS = 3000;
export const NEXT_DAY_SHIPPING_CENTS = 5000;
export const ACCESSORY_SHIPPING_CENTS = 1000;
export const FREE_SHIPPING_THRESHOLD_CENTS = 50000;

export const SHIPPING_METHOD_LABELS: Record<ShippingMethod, string> = {
  accessory: 'Accessory Shipping',
  two_day: 'Two-Day Shipping',
  next_day: 'Next-Day Shipping',
  free_over_500: 'Free Shipping',
  none: 'Shipping',
};

/** Labels for historical/legacy order rows only — never submitted by modern checkout. */
const LEGACY_SHIPPING_LABELS: Record<string, string> = {
  standard: 'Standard Shipping',
  ground: 'Ground Shipping',
  economy: 'Economy Shipping',
};

export function labelShippingMethod(method: string | null | undefined): string {
  if (!method) return 'Shipping';
  if ((SHIPPING_METHODS as readonly string[]).includes(method)) {
    return SHIPPING_METHOD_LABELS[method as ShippingMethod];
  }
  return LEGACY_SHIPPING_LABELS[method] ?? method;
}

/** Reject obsolete values such as "standard" before calling Stripe. */
export function isApprovedCheckoutShippingMethod(method: string | null | undefined): boolean {
  if (!method) return false;
  return (SHIPPING_METHODS as readonly string[]).includes(method);
}

export function isFreeShippingEligible(subtotalCents: number): boolean {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
}

export function shippingCentsForMethod(
  method: ShippingMethod | string,
  subtotalCents: number,
): number {
  if (isFreeShippingEligible(subtotalCents) || method === 'free_over_500') return 0;
  if (method === 'accessory') return ACCESSORY_SHIPPING_CENTS;
  if (method === 'two_day' || method === 'next_day') return 0;
  // Obsolete methods (e.g. "standard") must not silently charge $0 in checkout —
  // callers should reject them via authorizeShippingCents before charging.
  return 0;
}

/** Preserve $500+ eligibility flag on the order snapshot. */
export function shippingEligibilitySnapshot(subtotalCents: number): {
  free_shipping_eligible: boolean;
  threshold_cents: number;
} {
  return {
    free_shipping_eligible: isFreeShippingEligible(subtotalCents),
    threshold_cents: FREE_SHIPPING_THRESHOLD_CENTS,
  };
}
