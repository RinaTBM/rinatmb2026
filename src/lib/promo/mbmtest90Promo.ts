/**
 * MBMTEST90 promo — 90% off the entire one-time order total
 * (medications + provider visits + shipping).
 * Restricted to info@thebaremethodmn.com.
 *
 * EXCLUDED cart types (no discount at all):
 * - subscriptions / auto-refill (purchaseType auto_refill, subscription true)
 * - memberships (m1/m2, membership_program)
 *
 * For eligible one-time carts, the discount is 90% of (subtotal + shipping).
 * Provider visits, lab packages, accessories, skin/hair, and shipping are
 * all included in the discounted total.
 */

export const MBMTEST90_PROMO_CODE = 'MBMTEST90' as const;
export const MBMTEST90_DISCOUNT_RATE = 0.9 as const;
export const MBMTEST90_RESTRICTED_EMAIL = 'info@thebaremethodmn.com' as const;

export type Mbmtest90CartInput = {
  productId?: string | null;
  sku?: string | null;
  purchaseType?: string | null;
  isMembership?: boolean;
  subscription?: boolean;
};

export type Mbmtest90ApplyResult = {
  code: typeof MBMTEST90_PROMO_CODE;
  ok: true;
  discountCents: number;
  discountedTotalCents: number;
};

export function normalizePromoCode(code: string | null | undefined): string {
  return String(code || '')
    .trim()
    .toUpperCase();
}

export function isMbmtest90PromoCode(code: string | null | undefined): boolean {
  return normalizePromoCode(code) === MBMTEST90_PROMO_CODE;
}

export function isMbmtest90EmailAuthorized(email: string | null | undefined): boolean {
  return String(email || '')
    .trim()
    .toLowerCase() === MBMTEST90_RESTRICTED_EMAIL;
}

export function isMbmtest90CartEligible(items: Mbmtest90CartInput[]): boolean {
  for (const item of items) {
    const productId = String(item.productId || '').trim();
    const sku = String(item.sku || '').trim().toUpperCase();
    const isMembership =
      Boolean(item.isMembership) ||
      item.purchaseType === 'membership_program' ||
      productId === 'm1' ||
      productId === 'm2' ||
      sku.startsWith('MBM-MEM-');
    if (isMembership) return false;
    if (item.subscription === true || item.purchaseType === 'auto_refill') return false;
  }
  return true;
}

/**
 * Authoritative MBMTEST90 discount for a cart/order.
 * Returns 90% of (subtotal + shipping) for eligible one-time carts.
 * Returns failure when code is absent/invalid, email not authorized,
 * or cart contains memberships/subscriptions.
 */
export function applyMbmtest90Promo(input: {
  code?: string | null;
  customerEmail?: string | null;
  subtotalCents: number;
  shippingCents?: number;
  items: Mbmtest90CartInput[];
}): Mbmtest90ApplyResult | { ok: false; reason: 'not_mbmtest90' | 'email_not_authorized' | 'cart_ineligible' } {
  if (!isMbmtest90PromoCode(input.code)) {
    return { ok: false, reason: 'not_mbmtest90' };
  }
  if (!isMbmtest90EmailAuthorized(input.customerEmail)) {
    return { ok: false, reason: 'email_not_authorized' };
  }
  if (!isMbmtest90CartEligible(input.items)) {
    return { ok: false, reason: 'cart_ineligible' };
  }
  const subtotal = Math.max(0, Math.trunc(input.subtotalCents));
  const shipping = Math.max(0, Math.trunc(input.shippingCents || 0));
  const orderTotal = subtotal + shipping;
  const discountCents = Math.round(orderTotal * MBMTEST90_DISCOUNT_RATE);
  const discountedTotalCents = orderTotal - discountCents;
  return {
    ok: true,
    code: MBMTEST90_PROMO_CODE,
    discountCents,
    discountedTotalCents,
  };
}
