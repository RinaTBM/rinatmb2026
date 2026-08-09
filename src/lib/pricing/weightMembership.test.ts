import { describe, expect, it } from 'vitest';
import { getProduct } from '../../data/products';
import {
  buildPurchaseOptions,
  isMemberPricingEligible,
  resolveUnitPrice,
} from './purchaseOptions';
import {
  SEMAGLUTIDE_MEMBERSHIP_CENTS,
  SEMAGLUTIDE_MEMBERSHIP_MONTHLY,
  TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS,
  TIRZEPATIDE_30MG_MEMBER_ONLY_MONTHLY,
  TIRZEPATIDE_MEMBERSHIP_CENTS,
  TIRZEPATIDE_MEMBERSHIP_MONTHLY,
  getWeightMembershipProgram,
  isTirzepatide30mgVariant,
} from './weightMembership';

const semaglutide = getProduct('semaglutide')!;
const tirzepatide = getProduct('tirzepatide')!;

describe('weight membership flat-rate program', () => {
  it('uses authoritative Semaglutide membership $149/month', () => {
    expect(SEMAGLUTIDE_MEMBERSHIP_MONTHLY).toBe(149);
    expect(SEMAGLUTIDE_MEMBERSHIP_CENTS).toBe(14900);
  });

  it('uses authoritative Tirzepatide membership $249/month', () => {
    expect(TIRZEPATIDE_MEMBERSHIP_MONTHLY).toBe(249);
    expect(TIRZEPATIDE_MEMBERSHIP_CENTS).toBe(24900);
    expect(TIRZEPATIDE_30MG_MEMBER_ONLY_MONTHLY).toBe(350);
    expect(TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS).toBe(35000);
  });

  it('Semaglutide page shows $149/month flat membership first', () => {
    const v1 = semaglutide.variants[0];
    const opts = buildPurchaseOptions({
      standardPrice: v1.price,
      product: semaglutide,
      isActiveMember: false,
      selectedVariant: v1,
    });
    expect(opts.map(o => o.kind)).toEqual(['membership_program', 'auto_refill', 'one_time']);
    expect(opts[0].finalPrice).toBe(149);
    expect(opts[0].cta).toContain('$149/month');
    expect(opts[0].program?.cartLabel).toBe('Semaglutide Wellness Membership — $149/month');
    expect(opts[0].program?.includedFormulations).toEqual(['0.5mg', '1mg', '2.5mg', '5mg']);
  });

  it('Semaglutide membership is not calculated from the selected dose', () => {
    const prices = semaglutide.variants.map(v =>
      buildPurchaseOptions({
        standardPrice: v.price,
        product: semaglutide,
        isActiveMember: false,
        selectedVariant: v,
      })[0].finalPrice,
    );
    expect(prices).toEqual([149, 149, 149, 149]);
    expect(new Set(prices).size).toBe(1);
  });

  it('Tirzepatide page shows $249/month flat membership through 15mg', () => {
    for (const v of tirzepatide.variants) {
      const opts = buildPurchaseOptions({
        standardPrice: v.price,
        product: tirzepatide,
        isActiveMember: false,
        selectedVariant: v,
      });
      expect(opts[0].finalPrice).toBe(249);
      expect(opts[0].program?.memberOnlyNotice).toBeNull();
      expect(opts[0].program?.cartLabel).toBe('Tirzepatide Wellness Membership — $249/month');
    }
  });

  it('authoritative Semaglutide retail variants preserve exact cents', () => {
    expect(semaglutide.variants.map(v => v.price)).toEqual([119, 139, 189.02, 329]);
  });

  it('authoritative Tirzepatide retail variants preserve exact cents', () => {
    expect(tirzepatide.variants.map(v => v.price)).toEqual([189, 258.99, 369, 429]);
  });

  it('obsolete Tirzepatide 30mg SKU is not in retail catalog', () => {
    expect(tirzepatide.variants.some(v => isTirzepatide30mgVariant(v))).toBe(false);
  });

  it('Auto-Refill remains 10% off the selected dose price', () => {
    const cases = [
      { product: semaglutide, price: 119, expected: 107.1 },
      { product: semaglutide, price: 189.02, expected: 170.12 },
      { product: tirzepatide, price: 258.99, expected: 233.09 },
      { product: tirzepatide, price: 429, expected: 386.1 },
    ];
    for (const c of cases) {
      const variant = c.product.variants.find(v => v.price === c.price)!;
      const opts = buildPurchaseOptions({
        standardPrice: variant.price,
        product: c.product,
        isActiveMember: false,
        selectedVariant: variant,
      });
      const auto = opts.find(o => o.kind === 'auto_refill')!;
      expect(auto.finalPrice).toBe(c.expected);
      expect(auto.discountPercent).toBe(10);
    }
  });

  it('customers cannot activate a $350 member-only rate via membership program', () => {
    const program = getWeightMembershipProgram(tirzepatide, tirzepatide.variants[0]);
    expect(program?.monthlyPrice).toBe(249);
    expect(program?.memberOnlyPurchasable).toBe(false);
    expect(program?.checkoutProductId).toBe('m2');
  });

  it('applies no 15% percentage discount to Semaglutide or Tirzepatide medication', () => {
    expect(isMemberPricingEligible(semaglutide)).toBe(false);
    expect(isMemberPricingEligible(tirzepatide)).toBe(false);
    for (const product of [semaglutide, tirzepatide]) {
      for (const option of ['one_time', 'auto_refill', 'active_membership'] as const) {
        const r = resolveUnitPrice({
          standardPrice: 429,
          product,
          isActiveMember: true,
          option,
        });
        if (option === 'auto_refill') {
          expect(r.appliedDiscount).toBe('auto_refill');
          expect(r.discountPercent).toBe(10);
        } else {
          expect(r.appliedDiscount).toBe('none');
          expect(r.finalPrice).toBe(429);
        }
      }
    }
  });
});
