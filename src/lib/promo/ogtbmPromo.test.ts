import { describe, expect, it } from 'vitest';
import {
  OGTBM_DISCOUNT_PER_ELIGIBLE_UNIT_CENTS,
  OGTBM_PROMO_CODE,
  applyOgtbmPromo,
  assertOgtbmDoesNotAlterMembershipRebill,
  discountForEligibleUnit,
  evaluateOgtbmLine,
  isOgtbmEligibleLine,
  isOgtbmPromoCode,
} from './ogtbmPromo';
import {
  SEM_NEXT_DAY_MONTHLY_CENTS,
  SEM_TWO_DAY_MONTHLY_CENTS,
  TIRZ_NEXT_DAY_MONTHLY_CENTS,
  TIRZ_TWO_DAY_MONTHLY_CENTS,
} from '@/lib/membership/tagadaMembershipBilling';

describe('OGTBM promo code', () => {
  it('recognizes OGTBM case-insensitively', () => {
    expect(isOgtbmPromoCode('OGTBM')).toBe(true);
    expect(isOgtbmPromoCode('ogtbm')).toBe(true);
    expect(isOgtbmPromoCode(' Ogtbm ')).toBe(true);
    expect(isOgtbmPromoCode('SAVE50')).toBe(false);
    expect(isOgtbmPromoCode(null)).toBe(false);
  });

  it('discount per eligible unit is $50 and never exceeds unit price', () => {
    expect(OGTBM_DISCOUNT_PER_ELIGIBLE_UNIT_CENTS).toBe(5000);
    expect(discountForEligibleUnit(25900)).toBe(5000);
    expect(discountForEligibleUnit(3000)).toBe(3000);
    expect(discountForEligibleUnit(0)).toBe(0);
  });

  it('one eligible wellness item $259 → $50 discount → $209 net', () => {
    const result = applyOgtbmPromo({
      code: OGTBM_PROMO_CODE,
      lines: [
        {
          productId: 'p10',
          sku: 'MBM-WM-NAD-INJ-001',
          section: 'longevity',
          category: 'longevity',
          quantity: 1,
          unitAmountCents: 25900,
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.discountCents).toBe(5000);
    expect(result.eligibleUnitCount).toBe(1);
    expect(25900 - result.discountCents).toBe(20900);
  });

  it('two eligible items → $100 total discount', () => {
    const result = applyOgtbmPromo({
      code: 'ogtbm',
      lines: [
        {
          productId: 'p10',
          sku: 'MBM-WM-NAD-INJ-001',
          section: 'longevity',
          quantity: 1,
          unitAmountCents: 25900,
        },
        {
          productId: 'p11',
          sku: 'MBM-WM-GLUT-INJ-001',
          section: 'longevity',
          quantity: 1,
          unitAmountCents: 19900,
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.discountCents).toBe(10000);
    expect(result.eligibleUnitCount).toBe(2);
  });

  it('quantity > 1 multiplies per-unit discount', () => {
    const result = applyOgtbmPromo({
      code: OGTBM_PROMO_CODE,
      lines: [
        {
          productId: 'p10',
          sku: 'MBM-WM-NAD-INJ-001',
          section: 'longevity',
          quantity: 2,
          unitAmountCents: 25900,
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.discountCents).toBe(10000);
    expect(result.eligibleUnitCount).toBe(2);
  });

  it('excludes accessories', () => {
    expect(
      isOgtbmEligibleLine({
        productId: 'a1',
        sku: 'MBM-ACC-CIS-ACC-001',
        section: 'accessories',
        category: 'accessories',
      }).eligible,
    ).toBe(false);
    const result = applyOgtbmPromo({
      code: OGTBM_PROMO_CODE,
      lines: [
        {
          productId: 'a1',
          sku: 'MBM-ACC-CIS-ACC-001',
          section: 'accessories',
          quantity: 1,
          unitAmountCents: 11900,
        },
      ],
    });
    expect(result.ok && result.discountCents).toBe(0);
  });

  it('excludes dermatology / prescription-skin-hair', () => {
    expect(
      isOgtbmEligibleLine({
        productId: 'p50',
        sku: 'MBM-SH-TRET-CRM-001',
        section: 'prescription-skin-hair',
        category: 'prescription-skin-hair',
      }).eligible,
    ).toBe(false);
    const result = applyOgtbmPromo({
      code: OGTBM_PROMO_CODE,
      lines: [
        {
          productId: 'p50',
          sku: 'MBM-SH-TRET-CRM-001',
          section: 'prescription-skin-hair',
          quantity: 1,
          unitAmountCents: 8900,
        },
      ],
    });
    expect(result.ok && result.discountCents).toBe(0);
  });

  it('excludes provider care (IPV / FUV)', () => {
    for (const line of [
      { productId: 'pc1', sku: 'MBM-PC-IPV-SRV-001', section: 'provider-care' },
      { productId: 'pc2', sku: 'MBM-PC-FUV-SRV-001', section: 'provider-care' },
    ]) {
      expect(isOgtbmEligibleLine(line).eligible).toBe(false);
    }
  });

  it('excludes Lab Kit and Lab Review', () => {
    for (const line of [
      { productId: 'pc3', sku: 'MBM-PC-LAB-SRV-001', section: 'provider-care' },
      { productId: 'pc4', sku: 'MBM-PC-LAB-KIT-001', section: 'provider-care' },
    ]) {
      expect(isOgtbmEligibleLine(line).eligible).toBe(false);
      expect(isOgtbmEligibleLine(line).reason).toBe('lab_package');
    }
    const result = applyOgtbmPromo({
      code: OGTBM_PROMO_CODE,
      lines: [
        {
          productId: 'pc4',
          sku: 'MBM-PC-LAB-KIT-001',
          section: 'provider-care',
          quantity: 1,
          unitAmountCents: 20000,
        },
        {
          productId: 'pc3',
          sku: 'MBM-PC-LAB-SRV-001',
          section: 'provider-care',
          quantity: 1,
          unitAmountCents: 6000,
        },
      ],
    });
    expect(result.ok && result.discountCents).toBe(0);
  });

  it('excludes shipping charges', () => {
    for (const sku of ['MBM-SHIP-TWO-DAY-001', 'MBM-SHIP-NEXT-DAY-001']) {
      expect(isOgtbmEligibleLine({ sku, productId: 'ship' }).eligible).toBe(false);
    }
  });

  it('excludes memberships', () => {
    expect(
      isOgtbmEligibleLine({
        productId: 'm1',
        sku: 'MBM-MEM-SEM-001',
        purchaseType: 'membership_program',
        isMembership: true,
      }).eligible,
    ).toBe(false);
  });

  it('mixed cart: only eligible items receive $50 each', () => {
    const result = applyOgtbmPromo({
      code: OGTBM_PROMO_CODE,
      lines: [
        {
          productId: 'p10',
          sku: 'MBM-WM-NAD-INJ-001',
          section: 'longevity',
          quantity: 1,
          unitAmountCents: 25900,
        },
        {
          productId: 'a1',
          sku: 'MBM-ACC-CIS-ACC-001',
          section: 'accessories',
          quantity: 1,
          unitAmountCents: 11900,
        },
        {
          productId: 'pc1',
          sku: 'MBM-PC-IPV-SRV-001',
          section: 'provider-care',
          quantity: 1,
          unitAmountCents: 7500,
        },
        {
          sku: 'MBM-SHIP-TWO-DAY-001',
          quantity: 1,
          unitAmountCents: 3000,
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.discountCents).toBe(5000);
    expect(result.eligibleUnitCount).toBe(1);
  });

  it('discount cannot exceed eligible item price', () => {
    const line = evaluateOgtbmLine({
      productId: 'p99',
      sku: 'MBM-WM-CHEAP-001',
      section: 'longevity',
      quantity: 1,
      unitAmountCents: 2500,
    });
    expect(line.eligible).toBe(true);
    expect(line.discountPerUnitCents).toBe(2500);
    expect(line.lineDiscountCents).toBe(2500);
    expect(line.unitAmountCents - line.discountPerUnitCents).toBe(0);
  });

  it('does not alter approved membership recurring combo amounts', () => {
    expect(
      assertOgtbmDoesNotAlterMembershipRebill({
        monthlyAmountCents: SEM_TWO_DAY_MONTHLY_CENTS,
        expectedMonthlyAmountCents: 17900,
      }),
    ).toBe(true);
    expect(
      assertOgtbmDoesNotAlterMembershipRebill({
        monthlyAmountCents: SEM_NEXT_DAY_MONTHLY_CENTS,
        expectedMonthlyAmountCents: 19900,
      }),
    ).toBe(true);
    expect(
      assertOgtbmDoesNotAlterMembershipRebill({
        monthlyAmountCents: TIRZ_TWO_DAY_MONTHLY_CENTS,
        expectedMonthlyAmountCents: 27900,
      }),
    ).toBe(true);
    expect(
      assertOgtbmDoesNotAlterMembershipRebill({
        monthlyAmountCents: TIRZ_NEXT_DAY_MONTHLY_CENTS,
        expectedMonthlyAmountCents: 29900,
      }),
    ).toBe(true);
  });

  it('unknown promo code does not apply', () => {
    const result = applyOgtbmPromo({
      code: 'NOTREAL',
      lines: [
        {
          productId: 'p10',
          sku: 'MBM-WM-NAD-INJ-001',
          section: 'longevity',
          quantity: 1,
          unitAmountCents: 25900,
        },
      ],
    });
    expect(result.ok).toBe(false);
  });
});
