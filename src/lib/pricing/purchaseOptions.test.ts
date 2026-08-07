import { describe, expect, it } from 'vitest';
import type { Product } from '../../data/products';
import {
  applyDiscount,
  buildPurchaseOptions,
  isAutoRefillEligible,
  isExcludedFromDiscounts,
  isMemberPricingEligible,
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

  it('auto-refill receives 10% for non-members', () => {
    const r = resolveUnitPrice({
      standardPrice: 200,
      product: wellness,
      isActiveMember: false,
      option: 'auto_refill',
    });
    expect(r.finalPrice).toBe(180);
    expect(r.discountPercent).toBe(10);
    expect(r.appliedDiscount).toBe('auto_refill');
    expect(r.recurring).toBe(true);
  });

  it('active member receives 15% even on auto-refill (no stacking)', () => {
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
    expect(auto.recurring).toBe(true);
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

  it('applyDiscount rounds to cents', () => {
    expect(applyDiscount(149, 15)).toBe(126.65);
    expect(applyDiscount(169, 10)).toBe(152.1);
  });
});

describe('buildPurchaseOptions', () => {
  const product = {
    ...wellness,
    id: 'p1',
    slug: 'semaglutide',
    displayName: 'Semaglutide',
  } as Product;

  it('orders membership → auto-refill → one-time and hides become-member CTA when active', () => {
    const nonMember = buildPurchaseOptions({
      standardPrice: 199,
      product,
      isActiveMember: false,
    });
    expect(nonMember.map(o => o.kind)).toEqual(['active_membership', 'auto_refill', 'one_time']);
    expect(nonMember[0].cta).toBe('Become a Member');
    expect(nonMember[0].badge).toBe('BEST VALUE');

    const member = buildPurchaseOptions({
      standardPrice: 199,
      product,
      isActiveMember: true,
    });
    expect(member[0].label).toBe('Active Member Price');
    expect(member[0].cta).toBe('Active Member Price');
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
});
