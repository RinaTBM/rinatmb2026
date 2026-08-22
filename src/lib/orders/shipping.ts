/**
 * Approved shipping options for order records.
 *
 * Policy (WHOP-2B.1 / owner):
 * - One-time Rx / medication retail prices INCLUDE pharmacy shipping → method `included`, $0.
 * - Accessories are fulfilled separately by MBM; billable shipping uses existing Two-Day ($30) /
 *   Next-Day ($50) Tagada SKUs (USPS Priority Mail fulfillment). Free at $500+ accessory merchandise.
 * - Membership enrollment still selects Two-Day / Next-Day (combo recurring prices).
 * - Provider Care / visits never generate physical shipping charges.
 *
 * Do not use legacy $6.95 / $75 free-shipping threshold or "standard" in new checkout.
 */

/** Methods accepted by modern checkout authorization. */
export const SHIPPING_METHODS = [
  'two_day',
  'next_day',
  'free_over_500',
  'included',
  'none',
] as const;

export type ShippingMethod = (typeof SHIPPING_METHODS)[number];

/** Customer-selectable paid methods (excludes free_over_500 / included / none). */
export const SELECTABLE_SHIPPING_METHODS = ['two_day', 'next_day'] as const;
export type SelectableShippingMethod = (typeof SELECTABLE_SHIPPING_METHODS)[number];

export const TWO_DAY_SHIPPING_CENTS = 3000;
export const NEXT_DAY_SHIPPING_CENTS = 5000;
export const FREE_SHIPPING_THRESHOLD_CENTS = 50000;

export const SHIPPING_METHOD_LABELS: Record<ShippingMethod, string> = {
  two_day: 'Two-Day Shipping',
  next_day: 'Next-Day Shipping',
  free_over_500: 'Free Shipping',
  included: 'Shipping included',
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
  if (method === 'included' || method === 'none') return 0;
  if (isFreeShippingEligible(subtotalCents) || method === 'free_over_500') return 0;
  if (method === 'two_day') return TWO_DAY_SHIPPING_CENTS;
  if (method === 'next_day') return NEXT_DAY_SHIPPING_CENTS;
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
