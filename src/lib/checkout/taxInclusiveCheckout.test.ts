/**
 * Tax-inclusive customer pricing + card-first public checkout (Phase 17).
 */
import { describe, expect, it } from 'vitest';
import {
  ACCESSORY_SALES_TAX_RATE,
  PROVIDER_CARE_TAX_RATE,
  PROVIDER_CARE_FIXED_CENTS,
  TAX_INCLUSIVE_CHECKOUT_DISCLOSURE,
  authorizeAccessorySalesTax,
  authorizeProviderCareTax,
} from './index';
import { buildAuthoritativeOrderLines } from '@/lib/provider/injectProviderVisit';
import {
  TWO_DAY_SHIPPING_CENTS,
  NEXT_DAY_SHIPPING_CENTS,
} from '@/lib/orders/shipping';
import {
  evaluateKashuCardCartEligibility,
  assertKashuPaidAmountMatchesOrder,
  assertTagadaCheckoutTotalParity,
  TAGADA_UNEXPECTED_TAX_AMOUNT,
  MBM_SHIPPING_SKU_TWO_DAY,
  MBM_SHIPPING_SKU_NEXT_DAY,
  shippingSkuForCents,
} from '@/lib/payments/kashuTagada';
import {
  assertSelectablePaymentMethod,
  getActiveCheckoutPaymentMethods,
  isOrderPaymentMethod,
  BANK_CHECKOUT_PAYMENT_METHODS,
  MEMBERSHIP_CHECKOUT_UNAVAILABLE_MESSAGE,
  CARD_CHECKOUT_INIT_FAILED_MESSAGE,
  PAYMENT_METHODS,
} from '@/lib/payments/paymentMethods';
import { isStripeCheckoutEnabled } from '@/lib/payments/paymentsEnabled';
import { canTransitionPaymentStatus } from '@/lib/payments/manualInvoice';

describe('tax-inclusive checkout model', () => {
  it('keeps accessory $29 with tax_cents = 0', () => {
    expect(ACCESSORY_SALES_TAX_RATE).toBe(0);
    const tax = authorizeAccessorySalesTax({ accessoryTaxableSubtotalCents: 2900 });
    expect(tax.accessorySalesTaxCents).toBe(0);

    const built = buildAuthoritativeOrderLines({
      customerUserId: null,
      approvedTherapyHistory: [],
      items: [
        {
          productId: 'a2',
          productName: 'Planner',
          sku: 'MBM-ACC-PLN-ACC-001',
          quantity: 1,
          unitAmountCents: 2900,
          section: 'accessories',
        },
      ],
      shippingMethod: 'two_day',
      shippingCents: TWO_DAY_SHIPPING_CENTS,
    });
    expect(built.taxCents).toBe(0);
    expect(built.subtotalCents).toBe(2900);
    expect(built.shippingCents).toBe(3000);
    expect(built.totalCents).toBe(5900);
  });

  it('keeps provider visit $75 with tax_cents = 0', () => {
    expect(PROVIDER_CARE_TAX_RATE).toBe(0);
    expect(PROVIDER_CARE_FIXED_CENTS.pc1).toBe(7500);
    const tax = authorizeProviderCareTax({ providerCareTaxableSubtotalCents: 7500 });
    expect(tax.providerCareTaxCents).toBe(0);
    // Authoritative customer charge for service-only IPV (no separate tax).
    const subtotal = 7500;
    const shipping = 0;
    const taxCents = tax.providerCareTaxCents;
    expect(taxCents).toBe(0);
    expect(subtotal + shipping + taxCents).toBe(7500);
  });

  it('$29 + Two-Day = $59.00', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: null,
      approvedTherapyHistory: [],
      items: [
        {
          productId: 'a2',
          productName: 'Planner',
          sku: 'MBM-ACC-PLN-ACC-001',
          quantity: 1,
          unitAmountCents: 2900,
          section: 'accessories',
        },
      ],
      shippingMethod: 'two_day',
      shippingCents: TWO_DAY_SHIPPING_CENTS,
    });
    expect(built.taxCents).toBe(0);
    expect(built.shippingCents).toBe(3000);
    expect(built.totalCents).toBe(5900);
  });

  it('$29 + Next-Day = $79.00', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: null,
      approvedTherapyHistory: [],
      items: [
        {
          productId: 'a2',
          productName: 'Planner',
          sku: 'MBM-ACC-PLN-ACC-001',
          quantity: 1,
          unitAmountCents: 2900,
          section: 'accessories',
        },
      ],
      shippingMethod: 'next_day',
      shippingCents: NEXT_DAY_SHIPPING_CENTS,
    });
    expect(built.taxCents).toBe(0);
    expect(built.shippingCents).toBe(5000);
    expect(built.totalCents).toBe(7900);
  });

  it('$75 service-only total = $75.00', () => {
    const tax = authorizeProviderCareTax({ providerCareTaxableSubtotalCents: 7500 });
    expect(tax.providerCareTaxCents).toBe(0);
    expect(7500 + 0 + tax.providerCareTaxCents).toBe(7500);
  });

  it('mixed one-time product + provider-care has no separate tax', () => {
    // Rx product triggers Initial visit injection; tax-inclusive keeps tax_cents = 0.
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-1',
      approvedTherapyHistory: [],
      items: [
        {
          productId: 'a2',
          productName: 'Planner',
          sku: 'MBM-ACC-PLN-ACC-001',
          quantity: 1,
          unitAmountCents: 2900,
          section: 'accessories',
        },
        {
          productId: 'p1',
          productName: 'Semaglutide',
          sku: 'MBM-WM-SEM-INJ-001',
          slug: 'semaglutide',
          quantity: 1,
          unitAmountCents: 19900,
          section: 'weight-management',
        },
      ],
      shippingCents: TWO_DAY_SHIPPING_CENTS,
    });
    expect(built.taxCents).toBe(0);
    expect(built.items.some(i => i.sku === 'MBM-PC-IPV-SRV-001' || i.productId === 'pc1')).toBe(true);
    expect(built.totalCents).toBe(built.subtotalCents + built.shippingCents);
  });

  it('customer disclosure is tax-inclusive (not tax-free / exempt)', () => {
    expect(TAX_INCLUSIVE_CHECKOUT_DISCLOSURE).toMatch(/included/i);
    expect(TAX_INCLUSIVE_CHECKOUT_DISCLOSURE.toLowerCase()).not.toMatch(/tax-free|exempt|no taxes/);
  });
});

describe('Tagada hosted total parity under tax-inclusive model', () => {
  it('Tagada hosted total equals MBM total ($59 planner + Two-Day)', () => {
    const mbmTotal = 5900;
    expect(
      assertTagadaCheckoutTotalParity({
        publicOrderNumber: 'MBM-TEST-059',
        mbmTotalCents: mbmTotal,
        mappedMerchandiseCents: 2900,
        mappedShippingCents: 3000,
        mbmTaxCents: 0,
        skuList: ['MBM-ACC-PLN-ACC-001', MBM_SHIPPING_SKU_TWO_DAY],
      }),
    ).toEqual({ ok: true, calculatedTagadaTotalCents: 5900 });
    expect(
      assertKashuPaidAmountMatchesOrder({ orderTotalCents: mbmTotal, paidAmountCents: mbmTotal }),
    ).toEqual({ ok: true });
  });

  it('rejects Tagada total mismatch (no tolerance)', () => {
    expect(
      assertTagadaCheckoutTotalParity({
        publicOrderNumber: 'MBM-TEST-059',
        mbmTotalCents: 5900,
        mappedMerchandiseCents: 2900,
        mappedShippingCents: 3000,
        mbmTaxCents: 232,
        skuList: ['MBM-ACC-PLN-ACC-001'],
      }),
    ).toMatchObject({ ok: false });
    expect(
      assertKashuPaidAmountMatchesOrder({ orderTotalCents: 5900, paidAmountCents: 6132 }),
    ).toMatchObject({ ok: false });
  });

  it('unexpected tax_cents > 0 fails safely after migration', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 3000,
      taxCents: 232,
      items: [{ purchaseType: 'one_time', quantity: 1, sku: 'MBM-ACC-PLN-ACC-001' }],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe('unexpected_tax');
      expect(r.blockerCode).toBe(TAGADA_UNEXPECTED_TAX_AMOUNT);
    }
  });
});

describe('card-first public payment selector', () => {
  it('ACH and Wire are hidden publicly but backend enum preserved', () => {
    expect(getActiveCheckoutPaymentMethods()).not.toContain('manual_ach');
    expect(getActiveCheckoutPaymentMethods()).not.toContain('manual_wire');
    expect(assertSelectablePaymentMethod('manual_ach').ok).toBe(false);
    expect(assertSelectablePaymentMethod('manual_wire').ok).toBe(false);
    expect(BANK_CHECKOUT_PAYMENT_METHODS).toEqual(['manual_ach', 'manual_wire']);
    expect(isOrderPaymentMethod('manual_ach')).toBe(true);
    expect(isOrderPaymentMethod('manual_wire')).toBe(true);
    expect(PAYMENT_METHODS).toContain('manual_ach');
    expect(PAYMENT_METHODS).toContain('manual_wire');
  });

  it('SEM/TIRZ membership card recurring allowed; mixed membership still blocked', () => {
    const membership = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 3000,
      taxCents: 0,
      items: [
        {
          isMembership: true,
          purchaseType: 'membership_program',
          quantity: 1,
          sku: 'MBM-MEM-SEM-MEM-001',
          productId: 'm1',
        },
      ],
    });
    expect(membership).toEqual({ ok: true, membershipRecurring: true });

    const mixed = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 3000,
      taxCents: 0,
      items: [
        { purchaseType: 'one_time', quantity: 1, sku: 'MBM-ACC-PLN-ACC-001' },
        {
          isMembership: true,
          purchaseType: 'membership_program',
          quantity: 1,
          sku: 'MBM-MEM-TIR-MEM-001',
          productId: 'm2',
        },
      ],
    });
    expect(mixed.ok).toBe(false);
    if (!mixed.ok) expect(['membership', 'membership_mixed']).toContain(mixed.reason);
    expect(MEMBERSHIP_CHECKOUT_UNAVAILABLE_MESSAGE).toMatch(/contact us/i);
  });

  it('card init failure copy does not fall back to ACH/Wire', () => {
    expect(CARD_CHECKOUT_INIT_FAILED_MESSAGE).toMatch(/secure card checkout/i);
    expect(CARD_CHECKOUT_INIT_FAILED_MESSAGE.toLowerCase()).not.toMatch(/ach|wire|bank transfer/);
  });

  it('shipping $0 / $30 / $50 SKU map', () => {
    expect(shippingSkuForCents(0)).toBeNull();
    expect(shippingSkuForCents(3000)).toBe(MBM_SHIPPING_SKU_TWO_DAY);
    expect(shippingSkuForCents(5000)).toBe(MBM_SHIPPING_SKU_NEXT_DAY);
  });

  it('Stripe remains disabled; webhook amount equality preserved; duplicate paid noop shape', () => {
    expect(isStripeCheckoutEnabled()).toBe(false);
    expect(assertKashuPaidAmountMatchesOrder({ orderTotalCents: 7500, paidAmountCents: 7500 })).toEqual({
      ok: true,
    });
    // Idempotent paid→paid allowed for duplicate webhook delivery.
    expect(canTransitionPaymentStatus('paid', 'paid')).toBe(true);
  });

  it('one-time accessory / provider care / shipping carts are card-eligible at tax_cents=0', () => {
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 3000,
        taxCents: 0,
        items: [{ purchaseType: 'one_time', quantity: 1, sku: 'MBM-ACC-PLN-ACC-001' }],
      }),
    ).toEqual({ ok: true });
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 0,
        taxCents: 0,
        items: [{ purchaseType: 'one_time', quantity: 1, sku: 'MBM-PC-IPV-SRV-001' }],
      }),
    ).toEqual({ ok: true });
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 5000,
        taxCents: 0,
        items: [{ purchaseType: 'one_time', quantity: 1, sku: 'MBM-WM-SEM-INJ-001' }],
      }),
    ).toEqual({ ok: true });
  });
});
