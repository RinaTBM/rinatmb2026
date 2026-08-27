import { describe, expect, it } from 'vitest';
import type { Product } from '../../data/products';
import { products } from '../../data/products';
import {
  applyDiscount,
  buildPurchaseOptions,
  isAutoRefillEligible,
  isAutoRefillNewPurchaseAttempt,
  isExcludedFromDiscounts,
  isMemberPricingEligible,
  NEW_PURCHASE_AUTO_REFILL_OFFERED,
  resolveUnitPrice,
} from './purchaseOptions';

const wellness = {
  category: 'weight-management',
  autoRefillEligible: true,
  memberPricingEligible: true,
  excludedFromDiscounts: false,
  status: 'active',
} as Pick<Product, 'category' | 'autoRefillEligible' | 'memberPricingEligible' | 'excludedFromDiscounts' | 'status'>;

const accessory = {
  category: 'accessories',
  autoRefillEligible: false,
  memberPricingEligible: false,
  excludedFromDiscounts: true,
  status: 'active',
} as typeof wellness;

const provider = {
  category: 'provider-care',
  autoRefillEligible: false,
  memberPricingEligible: false,
  excludedFromDiscounts: true,
  status: 'active',
} as typeof wellness;

const future = {
  category: 'longevity-cognitive',
  autoRefillEligible: false,
  memberPricingEligible: false,
  excludedFromDiscounts: false,
  status: 'future',
} as typeof wellness;

describe('discount eligibility', () => {
  it('excludes accessories and provider care', () => {
    expect(isExcludedFromDiscounts(accessory)).toBe(true);
    expect(isExcludedFromDiscounts(provider)).toBe(true);
    expect(isMemberPricingEligible(accessory)).toBe(false);
    expect(isAutoRefillEligible(provider)).toBe(false);
  });

  it('allows active wellness products; future defaults off for auto-refill', () => {
    expect(isMemberPricingEligible(wellness)).toBe(true);
    expect(isAutoRefillEligible(wellness)).toBe(true);
    expect(isAutoRefillEligible(future)).toBe(false);
  });
});

describe('resolveUnitPrice — hierarchy & no stacking', () => {
  it('one-time receives standard price for non-members', () => {
    const r = resolveUnitPrice({
      standardPrice: 200,
      product: wellness,
      isActiveMember: false,
      option: 'one_time',
    });
    expect(r.finalPrice).toBe(200);
    expect(r.appliedDiscount).toBe('none');
  });

  it('auto-refill is not offered and does not apply 10% for new purchases', () => {
    expect(NEW_PURCHASE_AUTO_REFILL_OFFERED).toBe(false);
    const r = resolveUnitPrice({
      standardPrice: 200,
      product: wellness,
      isActiveMember: false,
      option: 'auto_refill',
    });
    expect(r.finalPrice).toBe(200);
    expect(r.discountPercent).toBe(0);
    expect(r.appliedDiscount).toBe('none');
    expect(r.recurring).toBe(false);
  });

  it('active member receives 15% even if a leftover auto-refill option is requested (no stacking, no 10%)', () => {
    const one = resolveUnitPrice({
      standardPrice: 200,
      product: wellness,
      isActiveMember: true,
      option: 'one_time',
    });
    const auto = resolveUnitPrice({
      standardPrice: 200,
      product: wellness,
      isActiveMember: true,
      option: 'auto_refill',
    });
    expect(one.finalPrice).toBe(170);
    expect(auto.finalPrice).toBe(170);
    expect(one.appliedDiscount).toBe('member');
    expect(auto.appliedDiscount).toBe('member');
    expect(auto.recurring).toBe(false);
  });

  it('never discounts provider appointments or accessories', () => {
    for (const product of [provider, accessory]) {
      for (const option of ['one_time', 'auto_refill', 'active_membership'] as const) {
        const r = resolveUnitPrice({
          standardPrice: 75,
          product,
          isActiveMember: true,
          option,
        });
        expect(r.finalPrice).toBe(75);
        expect(r.appliedDiscount).toBe('none');
      }
    }
  });

  it('does not apply member savings when memberPricingEligible is false', () => {
    const ineligible = { ...wellness, memberPricingEligible: false };
    const one = resolveUnitPrice({
      standardPrice: 199,
      product: ineligible,
      isActiveMember: true,
      option: 'one_time',
    });
    const auto = resolveUnitPrice({
      standardPrice: 199,
      product: ineligible,
      isActiveMember: true,
      option: 'auto_refill',
    });
    expect(one.finalPrice).toBe(199);
    expect(one.appliedDiscount).toBe('none');
    // Auto-Refill 10% is not applied for new purchases.
    expect(auto.finalPrice).toBe(199);
    expect(auto.appliedDiscount).toBe('none');
  });

  it('applyDiscount rounds to cents', () => {
    expect(applyDiscount(149, 15)).toBe(126.65);
    expect(applyDiscount(169, 10)).toBe(152.1);
  });
});

describe('buildPurchaseOptions', () => {
  const product = {
    ...wellness,
    id: 'p-nad',
    slug: 'nad-plus',
    displayName: 'NAD+',
  } as Product;

  it('orders membership → one-time and never offers Auto-Refill', () => {
    const nonMember = buildPurchaseOptions({
      standardPrice: 199,
      product,
      isActiveMember: false,
    });
    expect(nonMember.map(o => o.kind)).toEqual(['active_membership', 'one_time']);
    expect(nonMember.some(o => o.kind === 'auto_refill')).toBe(false);
    expect(nonMember[0].cta).toBe('Become a Member');
    expect(nonMember[0].badge).toBe('BEST VALUE');

    const member = buildPurchaseOptions({
      standardPrice: 199,
      product,
      isActiveMember: true,
    });
    expect(member[0].label).toBe('Active Member Price');
    expect(member[0].cta).toBe('Active Member Price');
    expect(member[1].kind).toBe('one_time');
    expect(member[1].finalPrice).toBe(member[0].finalPrice);
  });

  it('omits membership/auto options for accessories', () => {
    const opts = buildPurchaseOptions({
      standardPrice: 12,
      product: { ...product, ...accessory, slug: 'reusable-ice-pack' } as Product,
      isActiveMember: false,
    });
    expect(opts.map(o => o.kind)).toEqual(['one_time']);
    expect(opts[0].finalPrice).toBe(12);
  });

  it('uses flat-rate Wellness Membership (not 15%) on Semaglutide and Tirzepatide', () => {
    // Full catalog products are covered in weightMembership.test.ts.
    // Synthetic products with weight slugs still must not get the % CTA.
    for (const slug of ['semaglutide', 'tirzepatide'] as const) {
      const opts = buildPurchaseOptions({
        standardPrice: 199,
        product: {
          ...product,
          slug,
          displayName: slug,
          memberPricingEligible: false,
          autoRefillEligible: true,
        } as Product,
        isActiveMember: false,
      });
      // Without catalog membership linkage via getMembership, flat option still
      // resolves when slug matches; getMembership looks up real program data.
      expect(opts.some(o => o.kind === 'active_membership')).toBe(false);
      expect(opts.map(o => o.kind)).not.toContain('auto_refill');
      expect(opts.map(o => o.kind)).toContain('one_time');
    }
  });

  it('never emits Auto-Refill as a selectable new-purchase option', () => {
    expect(NEW_PURCHASE_AUTO_REFILL_OFFERED).toBe(false);
    expect(isAutoRefillNewPurchaseAttempt({ purchaseType: 'auto_refill' })).toBe(true);
    expect(isAutoRefillNewPurchaseAttempt({ subscription: true })).toBe(true);
    expect(isAutoRefillNewPurchaseAttempt({ isMembership: true, subscription: true })).toBe(false);
    expect(isAutoRefillNewPurchaseAttempt({ purchaseType: 'membership_program', subscription: true })).toBe(false);
    for (const catalogProduct of products.filter(p => p.isVisible)) {
      const opts = buildPurchaseOptions({
        standardPrice: catalogProduct.startingPrice,
        product: catalogProduct,
        isActiveMember: false,
      });
      expect(opts.some(o => o.kind === 'auto_refill')).toBe(false);
    }
  });
});
