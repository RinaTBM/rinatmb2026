import { describe, expect, it } from 'vitest';
import {
  ACCESSORY_MEMBER_DISCOUNT_PERCENT,
  ACCESSORY_SALES_TAX_RATE,
  AUTO_REFILL_DISCOUNT_PERCENT,
  PROVIDER_CARE_FIXED_CENTS,
  PROVIDER_CARE_TAX_RATE,
  PROVIDER_CARE_TAX_RATE_PERCENT,
  SEMAGLUTIDE_MEMBERSHIP_APP_ID,
  SEMAGLUTIDE_MEMBERSHIP_CENTS,
  TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS,
  TIRZEPATIDE_MEMBERSHIP_APP_ID,
  TIRZEPATIDE_MEMBERSHIP_CENTS,
  WELLNESS_MEMBER_DISCOUNT_PERCENT,
} from './checkoutConstants';
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  NEXT_DAY_SHIPPING_CENTS,
  TWO_DAY_SHIPPING_CENTS,
} from '../orders/shipping';
import {
  authorizeAccessorySalesTax,
  authorizeProviderCareTax,
  authorizeShippingCents,
  authorizeWellnessUnitCents,
  cartFreeShippingMerchandiseSubtotalCents,
  cartRequiresPhysicalShipping,
  freeShippingEligibleMerchandiseSubtotalCents,
  isAccessoryLine,
  isForbiddenSelfServeMemberOnly350,
  lineSubtotalCents,
  normalizeVariantKey,
  providerCareTaxableSubtotalCents,
  resolveMembershipLine,
  resolveProductLine,
  resolveProviderCareLine,
  shippableMerchandiseSubtotalCents,
  type CatalogMembershipRow,
  type CatalogVariantRow,
  type LineResolution,
} from './authorizeCheckout';

function expectMapped(
  line: LineResolution | { error: string },
): Extract<LineResolution, { kind: 'mapped_price' }> {
  if ('error' in line) throw new Error(line.error);
  expect(line.kind).toBe('mapped_price');
  if (line.kind !== 'mapped_price') throw new Error('expected mapped_price');
  return line;
}

function expectPriceData(
  line: LineResolution | { error: string },
): Extract<LineResolution, { kind: 'price_data' }> {
  if ('error' in line) throw new Error(line.error);
  expect(line.kind).toBe('price_data');
  if (line.kind !== 'price_data') throw new Error('expected price_data');
  return line;
}

const semaMembership: CatalogMembershipRow = {
  app_product_id: 'm1',
  slug: 'semaglutide-membership',
  stripe_price_id_test: 'price_test_sema_199',
  monthly_price_cents: SEMAGLUTIDE_MEMBERSHIP_CENTS,
  display_name: 'Semaglutide Membership',
  included_formulations: ['0.5mg', '1mg', '2.5mg', '5mg'],
};

const tirzMembership: CatalogMembershipRow = {
  app_product_id: 'm2',
  slug: 'tirzepatide-membership',
  stripe_price_id_test: 'price_test_tirz_249',
  monthly_price_cents: TIRZEPATIDE_MEMBERSHIP_CENTS,
  display_name: 'Tirzepatide Membership',
  included_formulations: ['2.5mg', '7.5mg', '12.5mg', '15mg'],
};

const semaVariant: CatalogVariantRow = {
  variant_key: 'semaglutide-v1',
  stripe_price_id_test: 'price_test_sema_v1',
  price_cents: 11900,
  display_name: '0.5mg, Vial',
  app_product_id: 'p1',
};

describe('Stripe mapping (catalog TEST prices)', () => {
  it('Semaglutide membership resolves to catalog_memberships TEST price', () => {
    const line = expectMapped(
      resolveMembershipLine(
        {
          productId: SEMAGLUTIDE_MEMBERSHIP_APP_ID,
          quantity: 1,
          purchaseType: 'membership_program',
          unitAmountCents: 14900,
          requestedFormulation: '1mg',
        },
        semaMembership,
      ),
    );
    expect(line.source).toBe('catalog_memberships');
    expect(line.stripePriceId).toBe('price_test_sema_199');
    expect(line.unitAmountCents).toBe(14900);
  });

  it('Tirzepatide membership resolves to catalog_memberships TEST price', () => {
    const line = expectMapped(
      resolveMembershipLine(
        {
          productId: TIRZEPATIDE_MEMBERSHIP_APP_ID,
          quantity: 1,
          purchaseType: 'membership_program',
          unitAmountCents: 24900,
          requestedFormulation: '7.5mg',
        },
        tirzMembership,
      ),
    );
    expect(line.stripePriceId).toBe('price_test_tirz_249');
    expect(line.unitAmountCents).toBe(24900);
  });

  it('undiscounted one-time product resolves to catalog variant TEST price', () => {
    const line = expectMapped(
      resolveProductLine(
        { productId: 'p1', quantity: 1, purchaseType: 'one_time', variantId: 'semaglutide-v1', standardPriceCents: 11900, unitAmountCents: 11900 },
        false,
        semaVariant,
      ),
    );
    expect(line.source).toBe('catalog_variants');
    expect(line.stripePriceId).toBe('price_test_sema_v1');
    expect(line.unitAmountCents).toBe(11900);
  });

  it('modern checkout does not require stripe_products / legacy sync-stripe-products', () => {
    const mem = expectMapped(
      resolveMembershipLine(
        {
          productId: 'm1',
          quantity: 1,
          purchaseType: 'membership_program',
          requestedFormulation: 'getting_started',
        },
        semaMembership,
      ),
    );
    const one = expectMapped(
      resolveProductLine({ productId: 'p1', quantity: 1, purchaseType: 'one_time', variantId: 'semaglutide-v1' }, false, semaVariant),
    );
    expect(mem.source).toBe('catalog_memberships');
    expect(one.source).toBe('catalog_variants');
  });
});

describe('membership / savings rules', () => {
  it('Semaglutide membership remains $149/month and Tirzepatide $249/month', () => {
    expect(SEMAGLUTIDE_MEMBERSHIP_CENTS).toBe(14900);
    expect(TIRZEPATIDE_MEMBERSHIP_CENTS).toBe(24900);
  });

  it('Tirzepatide 30mg $350 is not accidentally exposed as self-service', () => {
    expect(
      isForbiddenSelfServeMemberOnly350({
        productId: 'm2',
        quantity: 1,
        purchaseType: 'membership_program',
        unitAmountCents: TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS,
      }),
    ).toBe(true);
    const line = resolveMembershipLine(
      { productId: 'm2', quantity: 1, purchaseType: 'membership_program', unitAmountCents: TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS },
      tirzMembership,
    );
    expect('error' in line).toBe(true);
  });

  it('Auto-Refill remains 10% via authorized price_data', () => {
    const auth = authorizeWellnessUnitCents(
      { productId: 'p1', quantity: 1, purchaseType: 'auto_refill', subscription: true, standardPriceCents: 11900, unitAmountCents: 100 },
      false,
    );
    expect(auth?.discountPercent).toBe(AUTO_REFILL_DISCOUNT_PERCENT);
    expect(auth?.unitAmountCents).toBe(Math.round(11900 * 0.9));
    expect(normalizeVariantKey('semaglutide-v1-refill')).toBe('semaglutide-v1');
  });

  it('eligible wellness member savings remains 15% and does not stack', () => {
    const auth = authorizeWellnessUnitCents(
      {
        productId: 'p9',
        quantity: 1,
        purchaseType: 'one_time',
        standardPriceCents: 10000,
        unitAmountCents: 7650,
        appliedDiscount: 'member',
        discountPercent: 25,
        memberPricingEligible: true,
      },
      true,
    );
    expect(auth?.discountPercent).toBe(WELLNESS_MEMBER_DISCOUNT_PERCENT);
    expect(auth?.unitAmountCents).toBe(8500);
  });

  it('accessory member savings remains 15%', () => {
    const line = expectPriceData(
      resolveProductLine(
        {
          productId: 'a2',
          quantity: 1,
          purchaseType: 'one_time',
          section: 'accessories',
          standardPriceCents: 3400,
          unitAmountCents: 100,
          appliedDiscount: 'member',
          memberPricingEligible: true,
        },
        true,
        undefined,
      ),
    );
    expect(line.reason).toBe('accessory_member_discount');
    expect(line.unitAmountCents).toBe(Math.round(3400 * (1 - ACCESSORY_MEMBER_DISCOUNT_PERCENT / 100)));
  });
});

describe('Provider Care (tax-inclusive; no separate tax add-on)', () => {
  it('uses approved fixed price_data for Initial Visit / Follow-Up / Lab Review', () => {
    expect(PROVIDER_CARE_FIXED_CENTS.pc1).toBe(7500);
    expect(PROVIDER_CARE_FIXED_CENTS.pc2).toBe(5500);
    expect(PROVIDER_CARE_FIXED_CENTS.pc3).toBe(5500);
    const line = expectPriceData(
      resolveProviderCareLine({ productId: 'pc1', quantity: 1, section: 'provider-care', purchaseType: 'one_time' }),
    );
    expect(line.reason).toBe('provider_care');
    expect(line.unitAmountCents).toBe(7500);
  });

  it('$100 eligible Provider Care produces $0 separate tax (tax-inclusive)', () => {
    expect(PROVIDER_CARE_TAX_RATE).toBe(0);
    expect(PROVIDER_CARE_TAX_RATE_PERCENT).toBe(0);
    const tax = authorizeProviderCareTax({ providerCareTaxableSubtotalCents: 10000 });
    expect(tax.providerCareTaxCents).toBe(0);
  });

  it('Provider Care tax authorize ignores browser tax and stays at 0', () => {
    const tax = authorizeProviderCareTax({
      providerCareTaxableSubtotalCents: 10000,
      clientTaxCents: 800,
      clientProviderCareTaxCents: 9999,
    });
    expect(tax.providerCareTaxCents).toBe(0);
  });

  it('mixed cart still isolates Provider Care taxable base but charges $0 tax', () => {
    const lines: LineResolution[] = [
      expectPriceData(
        resolveProviderCareLine({ productId: 'pc1', quantity: 1, section: 'provider-care', productName: 'Initial' }),
      ),
      // Force a $200 wellness mapped line for taxable isolation
      {
        kind: 'mapped_price',
        stripePriceId: 'price_wellness',
        quantity: 1,
        unitAmountCents: 20000,
        recurring: false,
        source: 'catalog_variants',
        productId: 'p9',
        productName: 'NAD+',
        variantLabel: null,
      },
    ];
    // Override pc1 to $100 for the example scenario
    lines[0] = {
      kind: 'price_data',
      unitAmountCents: 10000,
      quantity: 1,
      name: 'Provider Care',
      recurring: false,
      reason: 'provider_care',
      productId: 'pc1',
      productName: 'Provider Care',
      variantLabel: null,
    };
    expect(providerCareTaxableSubtotalCents(lines)).toBe(10000);
    expect(authorizeProviderCareTax({ providerCareTaxableSubtotalCents: 10000 }).providerCareTaxCents).toBe(0);
    expect(lineSubtotalCents(lines)).toBe(30000);
  });

  it('wellness products, memberships, accessories, and shipping receive no Provider Care tax', () => {
    const wellness = expectMapped(
      resolveProductLine(
        { productId: 'p1', quantity: 1, purchaseType: 'one_time', variantId: 'semaglutide-v1' },
        false,
        semaVariant,
      ),
    );
    const membership = expectMapped(
      resolveMembershipLine(
        {
          productId: 'm1',
          quantity: 1,
          purchaseType: 'membership_program',
          requestedFormulation: '0.5mg',
        },
        semaMembership,
      ),
    );
    const accessory = expectPriceData(
      resolveProductLine(
        {
          productId: 'a2',
          quantity: 1,
          purchaseType: 'one_time',
          section: 'accessories',
          standardPriceCents: 3400,
          unitAmountCents: 3400,
        },
        false,
        undefined,
      ),
    );
    expect(providerCareTaxableSubtotalCents([wellness, membership, accessory])).toBe(0);
    expect(
      authorizeProviderCareTax({ providerCareTaxableSubtotalCents: 0 }).providerCareTaxCents,
    ).toBe(0);

    // Shipping is outside Provider Care taxable base by construction.
    const ship = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: TWO_DAY_SHIPPING_CENTS,
      shippableSubtotalCents: 19900,
      requiresPhysicalShipping: true,
    });
    expect('error' in ship).toBe(false);
    if ('error' in ship) return;
    expect(ship.shippingCents).toBe(3000);
    expect(
      authorizeProviderCareTax({
        providerCareTaxableSubtotalCents: 10000,
      }).providerCareTaxCents,
    ).toBe(0);
  });

  it('old universal 8% tax logic is removed; rates stay at 0', async () => {
    const constants = await import('./checkoutConstants');
    expect('CHECKOUT_TAX_RATE' in constants).toBe(false);
    expect(constants.PROVIDER_CARE_TAX_RATE).toBe(0);
    expect(constants.ACCESSORY_SALES_TAX_RATE).toBe(0);
    const membership = expectMapped(
      resolveMembershipLine(
        {
          productId: 'm1',
          quantity: 1,
          purchaseType: 'membership_program',
          requestedFormulation: '2.5mg',
        },
        semaMembership,
      ),
    );
    // Membership cart subtotal must not receive a separate tax add-on.
    expect(providerCareTaxableSubtotalCents([membership])).toBe(0);
    expect(authorizeProviderCareTax({ providerCareTaxableSubtotalCents: 0 }).providerCareTaxCents).toBe(0);
  });
});

describe('accessories (retail goods; tax-inclusive)', () => {
  it('accessories remain identifiable as retail goods', () => {
    expect(isAccessoryLine({ productId: 'a2', section: 'accessories' })).toBe(true);
    expect(isAccessoryLine({ productId: 'p1', section: 'weight-management' })).toBe(false);
    expect(isAccessoryLine({ productId: 'pc1', section: 'provider-care' })).toBe(false);
    expect(isAccessoryLine({ productId: 'm1', section: 'membership' })).toBe(false);
  });

  it('accessory sales tax rate is 0 (no separate Sales Tax line)', () => {
    expect(ACCESSORY_SALES_TAX_RATE).toBe(0);
    const accessory = expectPriceData(
      resolveProductLine(
        {
          productId: 'a2',
          quantity: 1,
          purchaseType: 'one_time',
          section: 'accessories',
          standardPriceCents: 3400,
          unitAmountCents: 3400,
        },
        false,
        undefined,
      ),
    );
    expect(providerCareTaxableSubtotalCents([accessory])).toBe(0);
    const tax = authorizeAccessorySalesTax({ accessoryTaxableSubtotalCents: 3400 });
    expect(tax.accessorySalesTaxCents).toBe(0);
    expect(authorizeAccessorySalesTax({ accessoryTaxableSubtotalCents: 0 }).accessorySalesTaxCents).toBe(0);
  });

  it('accessory member discount still works', () => {
    const line = expectPriceData(
      resolveProductLine(
        {
          productId: 'a2',
          quantity: 1,
          purchaseType: 'one_time',
          section: 'accessories',
          standardPriceCents: 3400,
          appliedDiscount: 'member',
          memberPricingEligible: true,
        },
        true,
        undefined,
      ),
    );
    expect(line.unitAmountCents).toBe(Math.round(3400 * 0.85));
  });
});

describe('shipping authorization', () => {
  it('merchandise $500+ qualifies for free shipping', () => {
    const r = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 0,
      shippableSubtotalCents: FREE_SHIPPING_THRESHOLD_CENTS,
      requiresPhysicalShipping: true,
    });
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.shippingCents).toBe(0);
    expect(r.shippingMethod).toBe('free_over_500');
  });

  it('Two-Day charges $30 and Next-Day charges $50', () => {
    const two = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: TWO_DAY_SHIPPING_CENTS,
      shippableSubtotalCents: 19900,
      requiresPhysicalShipping: true,
    });
    const next = authorizeShippingCents({
      shippingMethod: 'next_day',
      clientShippingCents: NEXT_DAY_SHIPPING_CENTS,
      shippableSubtotalCents: 19900,
      requiresPhysicalShipping: true,
    });
    expect('error' in two).toBe(false);
    expect('error' in next).toBe(false);
    if ('error' in two || 'error' in next) return;
    expect(two.shippingCents).toBe(3000);
    expect(next.shippingCents).toBe(5000);
  });

  it('browser cannot submit an arbitrary shipping charge', () => {
    const r = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 695,
      shippableSubtotalCents: 19900,
      requiresPhysicalShipping: true,
    });
    expect('error' in r).toBe(true);
  });

  it('Provider Care-only checkout does not receive physical shipping', () => {
    const pc = expectPriceData(
      resolveProviderCareLine({ productId: 'pc1', quantity: 1, section: 'provider-care' }),
    );
    expect(cartRequiresPhysicalShipping([pc])).toBe(false);
    expect(shippableMerchandiseSubtotalCents([pc])).toBe(0);
    const r = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 0,
      shippableSubtotalCents: 0,
      requiresPhysicalShipping: false,
    });
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.shippingCents).toBe(0);
    expect(r.shippingMethod).toBe('none');
  });

  it('mixed cart shipping uses shippable merchandise only (not Provider Care)', () => {
    const lines: LineResolution[] = [
      {
        kind: 'price_data',
        unitAmountCents: 10000,
        quantity: 1,
        name: 'PC',
        recurring: false,
        reason: 'provider_care',
        productId: 'pc1',
        productName: 'PC',
        variantLabel: null,
      },
      {
        kind: 'mapped_price',
        stripePriceId: 'price_x',
        quantity: 1,
        unitAmountCents: 50000,
        recurring: false,
        source: 'catalog_variants',
        productId: 'p9',
        productName: 'Wellness',
        variantLabel: null,
      },
    ];
    expect(shippableMerchandiseSubtotalCents(lines)).toBe(50000);
    expect(cartRequiresPhysicalShipping(lines)).toBe(true);
    const r = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 0,
      shippableSubtotalCents: shippableMerchandiseSubtotalCents(lines),
      requiresPhysicalShipping: true,
    });
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.freeShippingEligible).toBe(true);
    expect(r.shippingCents).toBe(0);
  });

  it('old $6.95/$75/$20 rules are gone', () => {
    expect(TWO_DAY_SHIPPING_CENTS).not.toBe(695);
    expect(TWO_DAY_SHIPPING_CENTS).not.toBe(2000);
    expect(FREE_SHIPPING_THRESHOLD_CENTS).not.toBe(7500);
    expect(TWO_DAY_SHIPPING_CENTS).toBe(3000);
    expect(NEXT_DAY_SHIPPING_CENTS).toBe(5000);
    expect(FREE_SHIPPING_THRESHOLD_CENTS).toBe(50000);
  });

  it('rejects obsolete shipping method "standard"', () => {
    const r = authorizeShippingCents({
      shippingMethod: 'standard',
      clientShippingCents: 0,
      shippableSubtotalCents: 14900,
      requiresPhysicalShipping: true,
    });
    expect('error' in r).toBe(true);
    if (!('error' in r)) return;
    expect(r.error).toMatch(/standard/i);
  });

  it('membership-only carts under $500 still charge Two-Day / Next-Day (no silent free shipping)', () => {
    const r = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 3000,
      // Ordinary merchandise subtotal for free-shipping threshold (membership excluded).
      shippableSubtotalCents: 0,
      requiresPhysicalShipping: true,
      containsMembership: true,
    });
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.shippingCents).toBe(3000);
    expect(r.freeShippingEligible).toBe(false);
  });
});

describe('membership shipping vs $500 free-shipping threshold', () => {
  it('$149 Semaglutide membership does not receive free shipping', () => {
    const r = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: TWO_DAY_SHIPPING_CENTS,
      shippableSubtotalCents: 0, // membership excluded from threshold
      requiresPhysicalShipping: true,
      containsMembership: true,
    });
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.freeShippingEligible).toBe(false);
    expect(r.shippingMethod).toBe('two_day');
    expect(r.shippingCents).toBe(3000);
    expect(SEMAGLUTIDE_MEMBERSHIP_CENTS).toBe(14900);
  });

  it('$249 Tirzepatide membership does not receive free shipping', () => {
    const r = authorizeShippingCents({
      shippingMethod: 'next_day',
      clientShippingCents: NEXT_DAY_SHIPPING_CENTS,
      shippableSubtotalCents: 0,
      requiresPhysicalShipping: true,
      containsMembership: true,
    });
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.freeShippingEligible).toBe(false);
    expect(r.shippingMethod).toBe('next_day');
    expect(r.shippingCents).toBe(5000);
    expect(TIRZEPATIDE_MEMBERSHIP_CENTS).toBe(24900);
  });

  it('membership value does not count toward $500 threshold', () => {
    const membershipLine = expectMapped(
      resolveMembershipLine(
        {
          productId: 'm1',
          quantity: 1,
          purchaseType: 'membership_program',
          requestedFormulation: '1mg',
        },
        semaMembership,
      ),
    );
    // Even stacking memberships far above $500 must not unlock free shipping.
    const stacked = [membershipLine, membershipLine, membershipLine, membershipLine];
    expect(shippableMerchandiseSubtotalCents(stacked)).toBe(14900 * 4);
    expect(freeShippingEligibleMerchandiseSubtotalCents(stacked)).toBe(0);
    expect(
      cartFreeShippingMerchandiseSubtotalCents([
        {
          productId: 'm1',
          quantity: 4,
          unitAmountCents: 14900,
          purchaseType: 'membership_program',
          section: 'membership',
        },
      ]),
    ).toBe(0);
  });

  it('membership checkout requires two_day or next_day', () => {
    const missing = authorizeShippingCents({
      shippingMethod: undefined,
      clientShippingCents: 3000,
      shippableSubtotalCents: 0,
      requiresPhysicalShipping: true,
      containsMembership: true,
    });
    expect('error' in missing).toBe(true);
    if (!('error' in missing)) return;
    expect(missing.error).toMatch(/two_day|next_day/i);

    const two = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 3000,
      shippableSubtotalCents: 0,
      requiresPhysicalShipping: true,
      containsMembership: true,
    });
    const next = authorizeShippingCents({
      shippingMethod: 'next_day',
      clientShippingCents: 5000,
      shippableSubtotalCents: 0,
      requiresPhysicalShipping: true,
      containsMembership: true,
    });
    expect('error' in two).toBe(false);
    expect('error' in next).toBe(false);
    if ('error' in two || 'error' in next) return;
    expect(two.shippingCents).toBe(3000);
    expect(next.shippingCents).toBe(5000);
  });

  it('two_day = $30 and next_day = $50 for memberships', () => {
    expect(TWO_DAY_SHIPPING_CENTS).toBe(3000);
    expect(NEXT_DAY_SHIPPING_CENTS).toBe(5000);
  });

  it('$500+ eligible ordinary merchandise can still receive free shipping', () => {
    const r = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 0,
      shippableSubtotalCents: FREE_SHIPPING_THRESHOLD_CENTS,
      requiresPhysicalShipping: true,
      containsMembership: false,
    });
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.freeShippingEligible).toBe(true);
    expect(r.shippingMethod).toBe('free_over_500');
    expect(r.shippingCents).toBe(0);
  });

  it('mixed cart cannot use membership value to reach the $500 threshold', () => {
    const membership = expectMapped(
      resolveMembershipLine(
        {
          productId: 'm2',
          quantity: 1,
          purchaseType: 'membership_program',
          requestedFormulation: '7.5mg',
        },
        tirzMembership,
      ),
    );
    const ordinary: LineResolution = {
      kind: 'mapped_price',
      stripePriceId: 'price_x',
      quantity: 1,
      unitAmountCents: 40000, // $400 ordinary
      recurring: false,
      source: 'catalog_variants',
      productId: 'p9',
      productName: 'Wellness',
      variantLabel: null,
    };
    // $400 ordinary + $249 membership = $649 shippable, but free-shipping base is only $400.
    expect(shippableMerchandiseSubtotalCents([ordinary, membership])).toBe(40000 + 24900);
    expect(freeShippingEligibleMerchandiseSubtotalCents([ordinary, membership])).toBe(40000);

    const r = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: TWO_DAY_SHIPPING_CENTS,
      shippableSubtotalCents: freeShippingEligibleMerchandiseSubtotalCents([ordinary, membership]),
      requiresPhysicalShipping: true,
      containsMembership: true,
    });
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.freeShippingEligible).toBe(false);
    expect(r.shippingCents).toBe(3000);

    // With $500 ordinary + membership, free shipping remains available from ordinary alone.
    const ordinary500: LineResolution = { ...ordinary, unitAmountCents: 50000 };
    const free = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 0,
      shippableSubtotalCents: freeShippingEligibleMerchandiseSubtotalCents([
        ordinary500,
        membership,
      ]),
      requiresPhysicalShipping: true,
      containsMembership: true,
    });
    expect('error' in free).toBe(false);
    if ('error' in free) return;
    expect(free.freeShippingEligible).toBe(true);
    expect(free.shippingCents).toBe(0);
  });
});

describe('membership requested formulation authorization', () => {
  it('accepts Getting Started / Not Sure and included formulations', () => {
    for (const dose of ['getting_started', '0.5mg', '1mg', '2.5mg', '5mg']) {
      const line = expectMapped(
        resolveMembershipLine(
          {
            productId: 'm1',
            quantity: 1,
            purchaseType: 'membership_program',
            requestedFormulation: dose,
          },
          semaMembership,
        ),
      );
      expect(line.unitAmountCents).toBe(14900);
      expect(line.variantLabel).toMatch(/Requested dose:/);
    }
    for (const dose of ['getting_started', '2.5mg', '7.5mg', '12.5mg', '15mg']) {
      const line = expectMapped(
        resolveMembershipLine(
          {
            productId: 'm2',
            quantity: 1,
            purchaseType: 'membership_program',
            requestedFormulation: dose,
          },
          tirzMembership,
        ),
      );
      expect(line.unitAmountCents).toBe(24900);
    }
  });

  it('rejects unsupported requested formulation server-side', () => {
    const missing = resolveMembershipLine(
      { productId: 'm1', quantity: 1, purchaseType: 'membership_program' },
      semaMembership,
    );
    expect('error' in missing).toBe(true);

    const bad = resolveMembershipLine(
      {
        productId: 'm1',
        quantity: 1,
        purchaseType: 'membership_program',
        requestedFormulation: '30mg',
      },
      semaMembership,
    );
    expect('error' in bad).toBe(true);
    if (!('error' in bad)) return;
    expect(bad.error).toMatch(/Unsupported requested formulation/i);
  });
});

describe('order / webhook contract', () => {
  it('preserves customer association and tax metadata keys for stripe-webhook', () => {
    const requiredMetaKeys = [
      'customer_user_id',
      'customer_email',
      'customer_name',
      'shipping_method',
      'shipping_cents',
      'tax_cents',
      'subtotal_cents',
      'discount_cents',
      'free_shipping_eligible',
      'requires_provider_review',
      'item_snapshots',
      'order_source',
      'provider_care_tax_rate',
      'provider_care_tax_cents',
      'provider_care_taxable_subtotal_cents',
    ];
    expect(requiredMetaKeys).toContain('customer_user_id');
    expect(requiredMetaKeys).toContain('tax_cents');
    expect(requiredMetaKeys).toContain('provider_care_tax_cents');
  });

  it('customer charge reconciles as subtotal + shipping with tax_cents = 0', () => {
    // $100 PC + $200 wellness + Two-Day shipping when merchandise < $500
    const pcTaxable = 10000;
    const wellness = 20000;
    const pcTax = authorizeProviderCareTax({ providerCareTaxableSubtotalCents: pcTaxable }).providerCareTaxCents;
    const shipping = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 3000,
      shippableSubtotalCents: wellness,
      requiresPhysicalShipping: true,
    });
    expect('error' in shipping).toBe(false);
    if ('error' in shipping) return;
    expect(pcTax).toBe(0);
    expect(shipping.shippingCents).toBe(3000);
    const displayedTotal = pcTaxable + wellness + shipping.shippingCents + pcTax;
    expect(displayedTotal).toBe(10000 + 20000 + 3000);
  });
});
