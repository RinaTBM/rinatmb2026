import { describe, expect, it } from 'vitest';
import {
  applyMbmtest90Promo,
  discountForEligibleUnit,
  evaluateMbmtest90Line,
  isMbmtest90EmailAuthorized,
  isMbmtest90EligibleLine,
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

describe('MBMTEST90 eligibility', () => {
  it('allows one-time prescription medications', () => {
    expect(isMbmtest90EligibleLine({ productId: 'p1', section: 'weight-management' })).toEqual({
      eligible: true,
      reason: 'eligible',
    });
  });

  it('excludes subscriptions', () => {
    expect(
      isMbmtest90EligibleLine({
        productId: 'p1',
        section: 'weight-management',
        subscription: true,
      }),
    ).toEqual({ eligible: false, reason: 'subscription' });
    expect(
      isMbmtest90EligibleLine({
        productId: 'p1',
        section: 'weight-management',
        purchaseType: 'auto_refill',
      }),
    ).toEqual({ eligible: false, reason: 'subscription' });
  });

  it('excludes memberships', () => {
    expect(
      isMbmtest90EligibleLine({ productId: 'm1', section: 'memberships' }),
    ).toEqual({ eligible: false, reason: 'membership' });
    expect(
      isMbmtest90EligibleLine({
        productId: 'x',
        sku: 'MBM-MEM-SEM-MEM-001',
        section: 'memberships',
      }),
    ).toEqual({ eligible: false, reason: 'membership' });
  });

  it('excludes accessories', () => {
    expect(
      isMbmtest90EligibleLine({ productId: 'a1', section: 'accessories' }),
    ).toEqual({ eligible: false, reason: 'accessory' });
    expect(
      isMbmtest90EligibleLine({ sku: 'MBM-ACC-001', section: 'accessories' }),
    ).toEqual({ eligible: false, reason: 'accessory' });
  });

  it('excludes provider care', () => {
    expect(
      isMbmtest90EligibleLine({ productId: 'pc1', section: 'provider-care' }),
    ).toEqual({ eligible: false, reason: 'provider_care' });
    expect(
      isMbmtest90EligibleLine({ sku: 'MBM-PC-IPV-SRV-001', section: 'provider-care' }),
    ).toEqual({ eligible: false, reason: 'provider_care' });
  });

  it('excludes dermatology / skin-hair', () => {
    expect(
      isMbmtest90EligibleLine({ productId: 'p5', section: 'prescription-skin-hair' }),
    ).toEqual({ eligible: false, reason: 'dermatology' });
    expect(
      isMbmtest90EligibleLine({ sku: 'MBM-SH-001', section: 'prescription-skin-hair' }),
    ).toEqual({ eligible: false, reason: 'dermatology' });
  });

  it('excludes shipping', () => {
    expect(
      isMbmtest90EligibleLine({ sku: 'MBM-SHIP-TWO-DAY-001', section: 'shipping' }),
    ).toEqual({ eligible: false, reason: 'shipping' });
  });

  it('excludes lab package', () => {
    expect(
      isMbmtest90EligibleLine({ productId: 'pc4', section: 'provider-care' }),
    ).toEqual({ eligible: false, reason: 'lab_package' });
    expect(
      isMbmtest90EligibleLine({ sku: 'MBM-PC-LAB-KIT-001', section: 'provider-care' }),
    ).toEqual({ eligible: false, reason: 'lab_package' });
  });
});

describe('MBMTEST90 line evaluation', () => {
  it('computes 90% discount per eligible unit', () => {
    const result = evaluateMbmtest90Line({
      productId: 'p1',
      section: 'weight-management',
      quantity: 2,
      unitAmountCents: 14900,
    });
    expect(result.eligible).toBe(true);
    expect(result.discountPerUnitCents).toBe(13410);
    expect(result.lineDiscountCents).toBe(26820);
  });

  it('returns zero discount for ineligible lines', () => {
    const result = evaluateMbmtest90Line({
      productId: 'a1',
      section: 'accessories',
      quantity: 1,
      unitAmountCents: 5000,
    });
    expect(result.eligible).toBe(false);
    expect(result.lineDiscountCents).toBe(0);
    expect(result.reason).toBe('accessory');
  });

  it('handles invalid quantity', () => {
    const result = evaluateMbmtest90Line({
      productId: 'p1',
      section: 'weight-management',
      quantity: 0,
      unitAmountCents: 10000,
    });
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('invalid_qty');
  });

  it('handles zero price', () => {
    const result = evaluateMbmtest90Line({
      productId: 'p1',
      section: 'weight-management',
      quantity: 1,
      unitAmountCents: 0,
    });
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('zero_price');
  });

  it('discountForEligibleUnit rounds correctly', () => {
    expect(discountForEligibleUnit(10000)).toBe(9000);
    expect(discountForEligibleUnit(14900)).toBe(13410);
    expect(discountForEligibleUnit(0)).toBe(0);
  });
});

describe('MBMTEST90 apply', () => {
  const eligibleLines = [
    {
      productId: 'p1',
      section: 'weight-management',
      quantity: 2,
      unitAmountCents: 14900,
    },
    {
      productId: 'a1',
      section: 'accessories',
      quantity: 1,
      unitAmountCents: 5000,
    },
  ];

  it('applies discount with authorized email', () => {
    const result = applyMbmtest90Promo({
      code: 'MBMTEST90',
      customerEmail: 'info@thebaremethodmn.com',
      lines: eligibleLines,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.code).toBe('MBMTEST90');
      expect(result.discountCents).toBe(26820);
      expect(result.eligibleUnitCount).toBe(2);
    }
  });

  it('rejects unauthorized email', () => {
    const result = applyMbmtest90Promo({
      code: 'MBMTEST90',
      customerEmail: 'someone@example.com',
      lines: eligibleLines,
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
      lines: eligibleLines,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('not_mbmtest90');
    }
  });

  it('does not discount shipping', () => {
    const result = applyMbmtest90Promo({
      code: 'MBMTEST90',
      customerEmail: 'info@thebaremethodmn.com',
      lines: [
        {
          sku: 'MBM-SHIP-TWO-DAY-001',
          section: 'shipping',
          quantity: 1,
          unitAmountCents: 3000,
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.discountCents).toBe(0);
    }
  });

  it('does not discount subscriptions', () => {
    const result = applyMbmtest90Promo({
      code: 'MBMTEST90',
      customerEmail: 'info@thebaremethodmn.com',
      lines: [
        {
          productId: 'p1',
          section: 'weight-management',
          purchaseType: 'auto_refill',
          subscription: true,
          quantity: 1,
          unitAmountCents: 12500,
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.discountCents).toBe(0);
    }
  });
});
