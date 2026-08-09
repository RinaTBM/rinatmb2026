import { describe, expect, it } from 'vitest';
import { products, memberships } from '../../data/products';
import {
  authorizeAccessoryCheckoutUnitCents,
  expectedAccessoryMemberPrice,
  expectedAccessoryMemberUnitCents,
  isAccessoryBundle,
  isAccessoryMemberDiscountEligible,
  isHardExcludedFromAccessoryMemberDiscount,
  resolveAccessoryUnitPrice,
} from './accessoryMemberDiscount';
import {
  DEFAULT_ACCESSORY_MEMBER_DISCOUNT_PERCENT,
  DEFAULT_AUTO_REFILL_DISCOUNT_PERCENT,
  getDefaultPurchaseDiscountSettings,
} from './settings';
import {
  applyDiscount,
  isAutoRefillEligible,
  resolveUnitPrice,
} from './purchaseOptions';
import {
  SEMAGLUTIDE_MEMBERSHIP_MONTHLY,
  TIRZEPATIDE_MEMBERSHIP_MONTHLY,
  TIRZEPATIDE_30MG_MEMBER_ONLY_MONTHLY,
} from './weightMembership';

const peptideCase = products.find(p => p.slug === 'premium-3d-printed-peptide-case')!;
const travelBag = products.find(p => p.slug === 'discreet-travel-bag')!;
const starterKit = products.find(p => p.slug === 'complete-injection-starter-kit')!;
const providerVisit = products.find(p => p.category === 'provider-care')!;

describe('accessory member discount — eligibility', () => {
  it('defaults individual accessories as eligible', () => {
    expect(isAccessoryMemberDiscountEligible(peptideCase)).toBe(true);
    expect(isAccessoryMemberDiscountEligible(travelBag)).toBe(true);
  });

  it('keeps bundle member discount OFF by default', () => {
    expect(isAccessoryBundle(starterKit)).toBe(true);
    expect(starterKit.memberPricingEligible).toBe(false);
    expect(isAccessoryMemberDiscountEligible(starterKit)).toBe(false);
  });

  it('excludes provider appointments', () => {
    expect(isHardExcludedFromAccessoryMemberDiscount(providerVisit)).toBe(true);
    expect(
      resolveAccessoryUnitPrice({
        standardPrice: providerVisit.startingPrice,
        product: providerVisit,
        isActiveMember: true,
        membershipStatus: 'active',
      }).appliedDiscount,
    ).toBe('none');
  });
});

describe('accessory member discount — active Wellness Members', () => {
  it('Active Semaglutide member receives 15% off accessories', () => {
    const priced = resolveAccessoryUnitPrice({
      standardPrice: 39,
      product: travelBag,
      isActiveMember: true,
      membershipStatus: 'active',
    });
    expect(priced.discountPercent).toBe(DEFAULT_ACCESSORY_MEMBER_DISCOUNT_PERCENT);
    expect(priced.appliedDiscount).toBe('member');
    expect(priced.finalPrice).toBe(expectedAccessoryMemberPrice(39));
    expect(priced.finalPrice).toBe(applyDiscount(39, 15));
  });

  it('Active Tirzepatide member receives 15% off accessories', () => {
    const priced = resolveAccessoryUnitPrice({
      standardPrice: peptideCase.startingPrice,
      product: peptideCase,
      isActiveMember: true,
      membershipStatus: 'active',
    });
    expect(priced.appliedDiscount).toBe('member');
    expect(priced.discountPercent).toBe(15);
    expect(priced.finalPrice).toBe(expectedAccessoryMemberPrice(peptideCase.startingPrice));
  });

  it('non-member pays standard accessory retail price', () => {
    const priced = resolveAccessoryUnitPrice({
      standardPrice: 39,
      product: travelBag,
      isActiveMember: false,
      membershipStatus: 'none',
    });
    expect(priced.finalPrice).toBe(39);
    expect(priced.appliedDiscount).toBe('none');
    expect(priced.discountPercent).toBe(0);
  });

  it('inactive/canceled member does not receive 15%', () => {
    const priced = resolveAccessoryUnitPrice({
      standardPrice: 39,
      product: travelBag,
      isActiveMember: false,
      membershipStatus: 'none',
    });
    expect(priced.appliedDiscount).toBe('none');
    expect(priced.finalPrice).toBe(39);

    const canceledClaim = resolveAccessoryUnitPrice({
      standardPrice: 39,
      product: travelBag,
      isActiveMember: true,
      membershipStatus: 'canceled',
    });
    expect(canceledClaim.appliedDiscount).toBe('none');
    expect(canceledClaim.finalPrice).toBe(39);
  });

  it('does not apply member discount to bundles by default', () => {
    const priced = resolveAccessoryUnitPrice({
      standardPrice: starterKit.startingPrice,
      product: starterKit,
      isActiveMember: true,
      membershipStatus: 'active',
    });
    expect(priced.finalPrice).toBe(starterKit.startingPrice);
    expect(priced.appliedDiscount).toBe('none');
  });

  it('accessory member discount does not stack', () => {
    const settings = getDefaultPurchaseDiscountSettings();
    expect(settings.accessoryMemberDiscountStackable).toBe(false);
    const priced = resolveAccessoryUnitPrice({
      standardPrice: 100,
      product: travelBag,
      isActiveMember: true,
      membershipStatus: 'active',
      settings,
    });
    // Single 15% only — never 15% + 10% auto-refill.
    expect(priced.finalPrice).toBe(85);
    expect(isAutoRefillEligible(travelBag)).toBe(false);
  });
});

describe('accessory checkout authorization (server-side price math)', () => {
  it('authorizes expected member cents and rejects deeper client cuts', () => {
    const standardCents = 2999;
    const authorized = expectedAccessoryMemberUnitCents(standardCents, 15);
    expect(authorized).toBe(Math.round(2999 * 0.85));

    const ok = authorizeAccessoryCheckoutUnitCents({
      standardPriceCents: standardCents,
      requestedUnitCents: authorized,
      isActiveMember: true,
      membershipStatus: 'active',
      productEligible: true,
    });
    expect(ok.unitAmountCents).toBe(authorized);
    expect(ok.appliedDiscount).toBe('member');

    const tooLow = authorizeAccessoryCheckoutUnitCents({
      standardPriceCents: standardCents,
      requestedUnitCents: authorized - 500,
      isActiveMember: true,
      membershipStatus: 'active',
      productEligible: true,
    });
    expect(tooLow.unitAmountCents).toBe(authorized);

    const nonMember = authorizeAccessoryCheckoutUnitCents({
      standardPriceCents: standardCents,
      requestedUnitCents: authorized,
      isActiveMember: false,
      productEligible: true,
    });
    expect(nonMember.unitAmountCents).toBe(standardCents);
    expect(nonMember.appliedDiscount).toBe('none');
  });

  it('shipping remains excluded (not an accessory product)', () => {
    // Shipping is computed at checkout outside product pricing — confirm accessories path never
    // treats a non-accessory category as discounted via this helper.
    const fakeShipping = {
      category: 'provider-care' as const,
      memberPricingEligible: true,
      excludedFromDiscounts: true,
      slug: 'shipping',
      featured: false,
    };
    expect(isAccessoryMemberDiscountEligible(fakeShipping)).toBe(false);
  });
});

describe('unchanged membership / medication / auto-refill pricing', () => {
  it('Semaglutide flat membership remains $149', () => {
    expect(SEMAGLUTIDE_MEMBERSHIP_MONTHLY).toBe(149);
    const m = memberships.find(x => x.slug === 'semaglutide-membership')!;
    expect(m.monthlyPrice).toBe(149);
  });

  it('Tirzepatide flat membership remains $249', () => {
    expect(TIRZEPATIDE_MEMBERSHIP_MONTHLY).toBe(249);
    const m = memberships.find(x => x.slug === 'tirzepatide-membership')!;
    expect(m.monthlyPrice).toBe(249);
  });

  it('Tirzepatide 30mg member-only remains $350', () => {
    expect(TIRZEPATIDE_30MG_MEMBER_ONLY_MONTHLY).toBe(350);
  });

  it('Auto-Refill remains 10% for eligible wellness products only', () => {
    expect(DEFAULT_AUTO_REFILL_DISCOUNT_PERCENT).toBe(10);
    const wellness = products.find(
      p => p.category === 'weight-management' && p.autoRefillEligible && !p.slug.includes('semaglutide') && !p.slug.includes('tirzepatide'),
    );
    // NAD+ or similar — if present, auto-refill 10%. Accessories never.
    expect(isAutoRefillEligible(travelBag)).toBe(false);
    if (wellness) {
      const priced = resolveUnitPrice({
        standardPrice: wellness.startingPrice,
        product: wellness,
        isActiveMember: false,
        option: 'auto_refill',
      });
      expect(priced.discountPercent).toBe(10);
      expect(priced.appliedDiscount).toBe('auto_refill');
    }
  });

  it('One-Time medication pricing remains unchanged (no 15% on Sema/Tirz)', () => {
    const sema = products.find(p => p.slug === 'semaglutide')!;
    const tirz = products.find(p => p.slug === 'tirzepatide')!;
    expect(sema.memberPricingEligible).toBe(false);
    expect(tirz.memberPricingEligible).toBe(false);
    const oneTime = resolveUnitPrice({
      standardPrice: sema.variants[0]?.price ?? sema.startingPrice,
      product: sema,
      isActiveMember: true,
      option: 'one_time',
    });
    expect(oneTime.appliedDiscount).toBe('none');
    expect(oneTime.finalPrice).toBe(sema.variants[0]?.price ?? sema.startingPrice);
  });

  it('membership benefit copy includes accessories without implying medication 15% off', () => {
    for (const m of memberships.filter(x => x.isVisible)) {
      expect(m.benefits.some(b => /15% on accessories/i.test(b))).toBe(true);
      expect(m.benefits.some(b => /eligible wellness products/i.test(b))).toBe(true);
      expect(m.benefits.some(b => /Semaglutide 15%|Tirzepatide 15%/i.test(b))).toBe(false);
    }
  });
});
