/**
 * Approved shipping options for order records (Phase 2).
 * Policy: Two-Day $30, Next-Day $50, free shipping at $500+.
 * Do not use legacy $6.95 / $75 free-shipping threshold in new order records.
 */

export const SHIPPING_METHODS = [
  'two_day',
  'next_day',
  'free_over_500',
  'standard',
  'none',
] as const;

export type ShippingMethod = (typeof SHIPPING_METHODS)[number];

export const TWO_DAY_SHIPPING_CENTS = 3000;
export const NEXT_DAY_SHIPPING_CENTS = 5000;
export const FREE_SHIPPING_THRESHOLD_CENTS = 50000;

export const SHIPPING_METHOD_LABELS: Record<ShippingMethod, string> = {
  two_day: 'Two-Day Shipping',
  next_day: 'Next-Day Shipping',
  free_over_500: 'Free Shipping',
  standard: 'Standard Shipping',
  none: 'Shipping',
};

export function labelShippingMethod(method: string | null | undefined): string {
  if (!method) return 'Shipping';
  if ((SHIPPING_METHODS as readonly string[]).includes(method)) {
    return SHIPPING_METHOD_LABELS[method as ShippingMethod];
  }
  return method;
}

export function isFreeShippingEligible(subtotalCents: number): boolean {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
}

export function shippingCentsForMethod(
  method: ShippingMethod,
  subtotalCents: number,
): number {
  if (isFreeShippingEligible(subtotalCents) || method === 'free_over_500') return 0;
  if (method === 'two_day') return TWO_DAY_SHIPPING_CENTS;
  if (method === 'next_day') return NEXT_DAY_SHIPPING_CENTS;
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
