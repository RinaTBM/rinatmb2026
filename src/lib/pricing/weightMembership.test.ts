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
  it('uses authoritative Semaglutide membership cents and dollars', () => {
    expect(SEMAGLUTIDE_MEMBERSHIP_MONTHLY).toBe(199);
    expect(SEMAGLUTIDE_MEMBERSHIP_CENTS).toBe(19900);
  });

  it('uses authoritative Tirzepatide membership and 30mg member-only cents', () => {
    expect(TIRZEPATIDE_MEMBERSHIP_MONTHLY).toBe(249);
    expect(TIRZEPATIDE_MEMBERSHIP_CENTS).toBe(24900);
    expect(TIRZEPATIDE_30MG_MEMBER_ONLY_MONTHLY).toBe(350);
    expect(TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS).toBe(35000);
  });

  it('Semaglutide page shows $199/month flat membership first', () => {
    const v1 = semaglutide.variants[0];
    const opts = buildPurchaseOptions({
      standardPrice: v1.price,
      product: semaglutide,
      isActiveMember: false,
      selectedVariant: v1,
    });
    expect(opts.map(o => o.kind)).toEqual(['membership_program', 'auto_refill', 'one_time']);
    expect(opts[0].label).toBe('Wellness Membership');
    expect(opts[0].badge).toBe('BEST VALUE');
    expect(opts[0].finalPrice).toBe(199);
    expect(opts[0].recurring).toBe(true);
    expect(opts[0].savingsAmount).toBe(0);
    expect(opts[0].discountPercent).toBe(0);
    expect(opts[0].cta).toContain('$199/month');
    expect(opts[0].program?.cartLabel).toBe('Semaglutide Wellness Membership — $199/month');
    expect(opts[0].program?.includedFormulations).toEqual([
      '1mg/1mg per mL, 2mL',
      '2mg/2mg per mL, 2mL',
      '5mg/2mg per mL, 2mL',
    ]);
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
    expect(prices).toEqual([199, 199, 199]);
    expect(new Set(prices).size).toBe(1);
  });

  it('Tirzepatide page shows $249/month flat membership through 25mg', () => {
    for (const v of tirzepatide.variants.filter(x => x.strength !== '30mg/2mg per mL')) {
      const opts = buildPurchaseOptions({
        standardPrice: v.price,
        product: tirzepatide,
        isActiveMember: false,
        selectedVariant: v,
      });
      expect(opts.map(o => o.kind)).toEqual(['membership_program', 'auto_refill', 'one_time']);
      expect(opts[0].finalPrice).toBe(249);
      expect(opts[0].program?.memberOnlyNotice).toBeNull();
      expect(opts[0].program?.cartLabel).toBe('Tirzepatide Wellness Membership — $249/month');
    }
  });

  it('selecting Tirzepatide 30mg displays the $350/month member-only explanation', () => {
    const v30 = tirzepatide.variants.find(v => v.strength === '30mg/2mg per mL')!;
    expect(isTirzepatide30mgVariant(v30)).toBe(true);
    const opts = buildPurchaseOptions({
      standardPrice: v30.price,
      product: tirzepatide,
      isActiveMember: false,
      selectedVariant: v30,
    });
    const membership = opts[0];
    expect(membership.kind).toBe('membership_program');
    expect(membership.finalPrice).toBe(249);
    expect(membership.program?.memberOnlyNotice?.title).toBe('30MG MEMBER-ONLY RATE');
    expect(membership.program?.memberOnlyNotice?.monthlyPrice).toBe(350);
    expect(membership.program?.memberOnlyNotice?.monthlyPriceCents).toBe(35000);
    expect(membership.program?.memberOnlyPurchasable).toBe(false);
    expect(membership.program?.supportingCopy).toMatch(/through 25mg/);
  });

  it('Tirzepatide 30mg One-Time Purchase remains $449', () => {
    const v30 = tirzepatide.variants.find(v => v.strength === '30mg/2mg per mL')!;
    expect(v30.price).toBe(449);
    const opts = buildPurchaseOptions({
      standardPrice: v30.price,
      product: tirzepatide,
      isActiveMember: false,
      selectedVariant: v30,
    });
    const oneTime = opts.find(o => o.kind === 'one_time')!;
    expect(oneTime.finalPrice).toBe(449);
    expect(oneTime.appliedDiscount).toBe('none');
  });

  it('Auto-Refill remains 10% off the selected dose price', () => {
    const cases = [
      { product: semaglutide, price: 149, expected: 134.1 },
      { product: semaglutide, price: 169, expected: 152.1 },
      { product: semaglutide, price: 199, expected: 179.1 },
      { product: tirzepatide, price: 199, expected: 179.1 },
      { product: tirzepatide, price: 269, expected: 242.1 },
      { product: tirzepatide, price: 379, expected: 341.1 },
      { product: tirzepatide, price: 449, expected: 404.1 },
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
      expect(auto.badge).toBe('Save 10%');
    }
  });

  it('One-Time Purchase remains dose-based for Semaglutide and Tirzepatide', () => {
    expect(semaglutide.variants.map(v => v.price)).toEqual([149, 169, 199]);
    expect(tirzepatide.variants.map(v => v.price)).toEqual([199, 269, 379, 449]);
    for (const product of [semaglutide, tirzepatide]) {
      for (const v of product.variants) {
        const opts = buildPurchaseOptions({
          standardPrice: v.price,
          product,
          isActiveMember: false,
          selectedVariant: v,
        });
        expect(opts.find(o => o.kind === 'one_time')!.finalPrice).toBe(v.price);
      }
    }
  });

  it('customers cannot select a membership dose or activate the 30mg member-only rate', () => {
    const program = getWeightMembershipProgram(tirzepatide, {
      strength: '30mg/2mg per mL',
      size: '2mL',
    });
    expect(program?.monthlyPrice).toBe(249);
    expect(program?.memberOnlyPurchasable).toBe(false);
    expect(program?.memberOnlyNotice?.requiresProviderApproval).toBe(true);
    expect(program?.memberOnlyNotice?.requiresAdminApproval).toBe(true);
    // Membership cart identity has no variant / dose fields in program meta.
    expect(program?.cartLabel).not.toMatch(/30mg/);
    expect(program?.checkoutProductId).toBe('m2');
  });

  it('applies no 15% percentage discount to Semaglutide or Tirzepatide', () => {
    expect(isMemberPricingEligible(semaglutide)).toBe(false);
    expect(isMemberPricingEligible(tirzepatide)).toBe(false);
    for (const product of [semaglutide, tirzepatide]) {
      for (const option of ['one_time', 'auto_refill', 'active_membership'] as const) {
        const r = resolveUnitPrice({
          standardPrice: 449,
          product,
          isActiveMember: true,
          option,
        });
        if (option === 'auto_refill') {
          expect(r.appliedDiscount).toBe('auto_refill');
          expect(r.discountPercent).toBe(10);
        } else {
          expect(r.appliedDiscount).toBe('none');
          expect(r.finalPrice).toBe(449);
        }
      }
      const opts = buildPurchaseOptions({
        standardPrice: 199,
        product,
        isActiveMember: true,
        selectedVariant: product.variants[0],
      });
      expect(opts.some(o => o.kind === 'active_membership')).toBe(false);
      expect(opts[0].kind).toBe('membership_program');
      expect(opts[0].discountPercent).toBe(0);
      expect(opts[0].finalPrice).not.toBe(applyFifteen(199));
    }
  });
});

function applyFifteen(price: number) {
  return Math.round(price * 0.85 * 100) / 100;
}
