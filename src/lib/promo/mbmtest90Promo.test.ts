import { describe, expect, it } from 'vitest';
import {
  applyMbmtest90Promo,
  isMbmtest90CartEligible,
  isMbmtest90EmailAuthorized,
  isMbmtest90PromoCode,
  MBMTEST90_DISCOUNT_RATE,
  MBMTEST90_PROMO_CODE,
  MBMTEST90_RESTRICTED_EMAIL,
  normalizePromoCode,
} from './mbmtest90Promo';

describe('MBMTEST90 promo code', () => {
  it('identifies the code case-insensitively', () => {
    expect(isMbmtest90PromoCode('mbmtest90')).toBe(true);
    expect(isMbmtest90PromoCode('MBMTEST90')).toBe(true);
    expect(isMbmtest90PromoCode('OGTBM')).toBe(false);
    expect(isMbmtest90PromoCode(null)).toBe(false);
  });

  it('normalizes promo codes', () => {
    expect(normalizePromoCode('  mbmtest90 ')).toBe('MBMTEST90');
  });

  it('restricts to authorized email', () => {
    expect(isMbmtest90EmailAuthorized('info@thebaremethodmn.com')).toBe(true);
    expect(isMbmtest90EmailAuthorized('INFO@THEBAREMETHODMN.COM')).toBe(true);
    expect(isMbmtest90EmailAuthorized('someone@example.com')).toBe(false);
    expect(isMbmtest90EmailAuthorized(null)).toBe(false);
  });

  it('exports correct constants', () => {
    expect(MBMTEST90_PROMO_CODE).toBe('MBMTEST90');
    expect(MBMTEST90_DISCOUNT_RATE).toBe(0.9);
    expect(MBMTEST90_RESTRICTED_EMAIL).toBe('info@thebaremethodmn.com');
  });
});

describe('MBMTEST90 cart eligibility', () => {
  it('allows one-time carts with medications and provider visits', () => {
    expect(
      isMbmtest90CartEligible([
        { productId: 'p1', purchaseType: 'one_time' },
        { productId: 'pc1', purchaseType: 'one_time' },
      ]),
    ).toBe(true);
  });

  it('excludes carts with memberships', () => {
    expect(
      isMbmtest90CartEligible([
        { productId: 'm1', purchaseType: 'membership_program' },
      ]),
    ).toBe(false);
    expect(
      isMbmtest90CartEligible([
        { sku: 'MBM-MEM-SEM-MEM-001' },
      ]),
    ).toBe(false);
  });

  it('excludes carts with subscriptions', () => {
    expect(
      isMbmtest90CartEligible([
        { productId: 'p1', subscription: true },
      ]),
    ).toBe(false);
    expect(
      isMbmtest90CartEligible([
        { productId: 'p1', purchaseType: 'auto_refill' },
      ]),
    ).toBe(false);
  });
});

describe('MBMTEST90 apply', () => {
  const eligibleItems = [
    { productId: 'p1', purchaseType: 'one_time' },
    { productId: 'pc1', purchaseType: 'one_time' },
  ];

  it('applies 90% off subtotal + shipping', () => {
    const result = applyMbmtest90Promo({
      code: 'MBMTEST90',
      customerEmail: 'info@thebaremethodmn.com',
      subtotalCents: 14900,
      shippingCents: 3000,
      items: eligibleItems,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.code).toBe('MBMTEST90');
      expect(result.discountCents).toBe(16110);
      expect(result.discountedTotalCents).toBe(1790);
    }
  });

  it('applies 90% off with zero shipping', () => {
    const result = applyMbmtest90Promo({
      code: 'MBMTEST90',
      customerEmail: 'info@thebaremethodmn.com',
      subtotalCents: 10000,
      shippingCents: 0,
      items: eligibleItems,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.discountCents).toBe(9000);
      expect(result.discountedTotalCents).toBe(1000);
    }
  });

  it('rejects unauthorized email', () => {
    const result = applyMbmtest90Promo({
      code: 'MBMTEST90',
      customerEmail: 'someone@example.com',
      subtotalCents: 14900,
      shippingCents: 3000,
      items: eligibleItems,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('email_not_authorized');
    }
  });

  it('rejects wrong code', () => {
    const result = applyMbmtest90Promo({
      code: 'OGTBM',
      customerEmail: 'info@thebaremethodmn.com',
      subtotalCents: 14900,
      shippingCents: 3000,
      items: eligibleItems,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('not_mbmtest90');
    }
  });

  it('rejects membership carts', () => {
    const result = applyMbmtest90Promo({
      code: 'MBMTEST90',
      customerEmail: 'info@thebaremethodmn.com',
      subtotalCents: 12500,
      shippingCents: 3000,
      items: [{ productId: 'm1', purchaseType: 'membership_program' }],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('cart_ineligible');
    }
  });

  it('rejects subscription carts', () => {
    const result = applyMbmtest90Promo({
      code: 'MBMTEST90',
      customerEmail: 'info@thebaremethodmn.com',
      subtotalCents: 12500,
      shippingCents: 3000,
      items: [{ productId: 'p1', subscription: true }],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('cart_ineligible');
    }
  });
});
