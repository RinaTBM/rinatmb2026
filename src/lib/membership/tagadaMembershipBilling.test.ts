import { describe, expect, it } from 'vitest';
import {
  SEMAGLUTIDE_MEMBERSHIP_CENTS,
  TIRZEPATIDE_MEMBERSHIP_CENTS,
} from '@/lib/checkout/checkoutConstants';
import {
  assertMembershipRecurringInitItem,
  assertMembershipRebillAmountMatches,
  buildMembershipEnrollmentTagadaInitItems,
  buildMembershipTagadaInitItem,
  canSelfServiceCancelMembership,
  computeMinimumTermEndsAt,
  evaluateMembershipCardCheckoutCart,
  extractTagadaSubscriptionFields,
  mapTagadaSubscriptionEventToMembershipStatus,
  membershipActivationFromBrowserReturn,
  membershipEnrollmentDueTodayCents,
  MEMBERSHIP_MINIMUM_CANCEL_BLOCK_MESSAGE,
  SEM_MEMBERSHIP_SKU,
  SEM_NEXT_DAY_COMBO_PRICE_ID,
  SEM_TAGADA_PRICE_ID,
  SEM_TAGADA_VARIANT_ID,
  SEM_TWO_DAY_COMBO_PRICE_ID,
  shouldActivateMembershipFromSources,
  TAGADA_MEMBERSHIP_PROGRAMS,
  TIRZ_MEMBERSHIP_SKU,
  TIRZ_NEXT_DAY_COMBO_PRICE_ID,
  TIRZ_TAGADA_PRICE_ID,
  TIRZ_TAGADA_VARIANT_ID,
  TIRZ_TWO_DAY_COMBO_PRICE_ID,
} from './tagadaMembershipBilling';
import { evaluateKashuCardCartEligibility } from '@/lib/payments/kashuTagada';
import { isStripeCheckoutEnabled } from '@/lib/payments/paymentsEnabled';
import { getActiveCheckoutPaymentMethods } from '@/lib/payments/paymentMethods';
import { FREE_SHIPPING_THRESHOLD_CENTS } from '@/lib/orders/shipping';
import { isFreeShippingEligibleMerchandiseLine } from '@/lib/checkout/authorizeCheckout';
import { getMembership } from '@/data/products';

describe('Tagada membership recurring billing', () => {
  it('SEM membership price = 14900', () => {
    expect(SEMAGLUTIDE_MEMBERSHIP_CENTS).toBe(14900);
    expect(TAGADA_MEMBERSHIP_PROGRAMS[SEM_MEMBERSHIP_SKU].monthlyAmountCents).toBe(14900);
  });

  it('TIRZ membership price = 24900', () => {
    expect(TIRZEPATIDE_MEMBERSHIP_CENTS).toBe(24900);
    expect(TAGADA_MEMBERSHIP_PROGRAMS[TIRZ_MEMBERSHIP_SKU].monthlyAmountCents).toBe(24900);
  });

  it('includes verified base + combo recurring priceIds', () => {
    expect(SEM_TAGADA_PRICE_ID).toBe('price_344d3dacb4ab');
    expect(TIRZ_TAGADA_PRICE_ID).toBe('price_5cf1fa89610c');
    expect(SEM_TWO_DAY_COMBO_PRICE_ID).toBe('price_41179f7cafe2');
    expect(SEM_NEXT_DAY_COMBO_PRICE_ID).toBe('price_7ce0f74a7509');
    expect(TIRZ_TWO_DAY_COMBO_PRICE_ID).toBe('price_e0ebef9851a8');
    expect(TIRZ_NEXT_DAY_COMBO_PRICE_ID).toBe('price_ef9ea132d6cf');
  });

  it('builds init with variantId + priceId (never variant alone)', () => {
    const sem = buildMembershipTagadaInitItem(TAGADA_MEMBERSHIP_PROGRAMS[SEM_MEMBERSHIP_SKU]);
    expect(sem).toEqual({
      variantId: SEM_TAGADA_VARIANT_ID,
      quantity: 1,
      priceId: SEM_TAGADA_PRICE_ID,
    });
    expect(assertMembershipRecurringInitItem(sem)).toEqual({ ok: true });
    expect(assertMembershipRecurringInitItem({ variantId: SEM_TAGADA_VARIANT_ID, quantity: 1 })).toMatchObject({
      ok: false,
    });

    const tirz = buildMembershipTagadaInitItem(TAGADA_MEMBERSHIP_PROGRAMS[TIRZ_MEMBERSHIP_SKU]);
    expect(tirz.priceId).toBe(TIRZ_TAGADA_PRICE_ID);
    expect(tirz.variantId).toBe(TIRZ_TAGADA_VARIANT_ID);
  });

  it('allows SEM-only membership card cart with Two-Day shipping and tax_cents=0', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 3000,
      taxCents: 0,
      items: [
        {
          isMembership: true,
          purchaseType: 'membership_program',
          quantity: 1,
          sku: SEM_MEMBERSHIP_SKU,
          productId: 'm1',
        },
      ],
    });
    expect(r).toEqual({ ok: true, membershipRecurring: true });
  });

  it('allows TIRZ-only membership card cart with Next-Day shipping', () => {
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 5000,
        taxCents: 0,
        items: [
          {
            isMembership: true,
            purchaseType: 'membership_program',
            quantity: 1,
            sku: TIRZ_MEMBERSHIP_SKU,
          },
        ],
      }),
    ).toEqual({ ok: true, membershipRecurring: true });
  });

  it('blocks SEM/TIRZ mixed cart', () => {
    const r = evaluateMembershipCardCheckoutCart([
      { isMembership: true, purchaseType: 'membership_program', quantity: 1, sku: SEM_MEMBERSHIP_SKU },
      { isMembership: true, purchaseType: 'membership_program', quantity: 1, sku: TIRZ_MEMBERSHIP_SKU },
    ]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('multiple_memberships');
  });

  it('blocks membership + ordinary merchandise mixed cart (IPV exception is separate)', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 0,
      taxCents: 0,
      items: [
        { purchaseType: 'one_time', quantity: 1, sku: 'MBM-WM-SEM-INJ-001' },
        {
          isMembership: true,
          purchaseType: 'membership_program',
          quantity: 1,
          sku: SEM_MEMBERSHIP_SKU,
        },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('membership_mixed');
  });

  it('allows SEM membership + required Initial Provider Visit with Two-Day shipping', () => {
    const cart = evaluateMembershipCardCheckoutCart([
      {
        isMembership: true,
        purchaseType: 'membership_program',
        quantity: 1,
        sku: SEM_MEMBERSHIP_SKU,
      },
      { purchaseType: 'one_time', quantity: 1, sku: 'MBM-PC-IPV-SRV-001' },
    ]);
    expect(cart).toMatchObject({
      ok: true,
      enrollmentVisitSku: 'MBM-PC-IPV-SRV-001',
      dueTodayCents: 22400,
      monthlyRebillCents: 14900,
    });
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 3000,
        taxCents: 0,
        items: [
          {
            isMembership: true,
            purchaseType: 'membership_program',
            quantity: 1,
            sku: SEM_MEMBERSHIP_SKU,
          },
          { purchaseType: 'one_time', quantity: 1, sku: 'MBM-PC-IPV-SRV-001' },
        ],
      }),
    ).toEqual({ ok: true, membershipRecurring: true });
  });

  it('SEM + IPV + Two-Day: due today 25400; rebill 17900; combo price; no MBM-SHIP line', () => {
    const due = membershipEnrollmentDueTodayCents({
      membershipSku: SEM_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
      shippingCents: 3000,
    });
    expect(due).toEqual({
      ok: true,
      dueTodayCents: 25400,
      monthlyRebillCents: 17900,
      baseMembershipAmountCents: 14900,
      visitCents: 7500,
      shippingCents: 3000,
      selectedShippingMethod: 'two_day',
      tagadaPriceId: SEM_TWO_DAY_COMBO_PRICE_ID,
    });
    const init = buildMembershipEnrollmentTagadaInitItems({
      membershipSku: SEM_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
      shippingCents: 3000,
      membershipVariantId: SEM_TAGADA_VARIANT_ID,
      visitVariantId: 'variant_3b859fb20d65',
      visitPriceId: 'price_6163adf08816',
      shippingVariantId: 'variant_18c3ab5eadee',
      shippingPriceId: 'price_c65bb478d609',
    });
    expect(init.ok).toBe(true);
    if (!init.ok) return;
    expect(init.dueTodayCents).toBe(25400);
    expect(init.monthlyRebillCents).toBe(17900);
    expect(init.shippingCents).toBe(3000);
    expect(init.shippingSku).toBeNull();
    expect(init.items).toHaveLength(2);
    expect(init.items[0].priceId).toBe(SEM_TWO_DAY_COMBO_PRICE_ID);
    expect(init.items[1].priceId).toBe('price_6163adf08816');
    expect(init.items.some((i) => i.priceId === 'price_c65bb478d609')).toBe(false);
  });

  it('SEM + IPV + Next-Day: due today 27400; rebill 19900', () => {
    const due = membershipEnrollmentDueTodayCents({
      membershipSku: SEM_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
      shippingCents: 5000,
    });
    expect(due).toMatchObject({
      ok: true,
      dueTodayCents: 27400,
      monthlyRebillCents: 19900,
      shippingCents: 5000,
      tagadaPriceId: SEM_NEXT_DAY_COMBO_PRICE_ID,
    });
  });

  it('TIRZ + IPV + Two-Day: due today 35400; rebill 27900', () => {
    const due = membershipEnrollmentDueTodayCents({
      membershipSku: TIRZ_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
      shippingCents: 3000,
    });
    expect(due).toMatchObject({
      ok: true,
      dueTodayCents: 35400,
      monthlyRebillCents: 27900,
      shippingCents: 3000,
      tagadaPriceId: TIRZ_TWO_DAY_COMBO_PRICE_ID,
    });
  });

  it('TIRZ + IPV + Next-Day: due today 37400; rebill 29900', () => {
    const due = membershipEnrollmentDueTodayCents({
      membershipSku: TIRZ_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
      shippingCents: 5000,
    });
    expect(due).toMatchObject({
      ok: true,
      dueTodayCents: 37400,
      monthlyRebillCents: 29900,
      shippingCents: 5000,
    });
    const init = buildMembershipEnrollmentTagadaInitItems({
      membershipSku: TIRZ_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
      shippingCents: 5000,
      membershipVariantId: TIRZ_TAGADA_VARIANT_ID,
      visitVariantId: 'variant_3b859fb20d65',
      visitPriceId: 'price_6163adf08816',
      shippingVariantId: 'variant_6817c3c6e31a',
      shippingPriceId: 'price_53861f3e4cad',
    });
    expect(init.ok).toBe(true);
    if (!init.ok) return;
    expect(init.items).toHaveLength(2);
    expect(init.items[0].priceId).toBe(TIRZ_NEXT_DAY_COMBO_PRICE_ID);
    expect(init.monthlyRebillCents).toBe(29900);
    expect(init.dueTodayCents).toBe(37400);
    expect(init.shippingSku).toBeNull();
  });

  it('rejects missing enrollment shipping ($0)', () => {
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 0,
        taxCents: 0,
        items: [
          {
            isMembership: true,
            purchaseType: 'membership_program',
            quantity: 1,
            sku: SEM_MEMBERSHIP_SKU,
          },
          { purchaseType: 'one_time', quantity: 1, sku: 'MBM-PC-IPV-SRV-001' },
        ],
      }).ok,
    ).toBe(false);
  });

  it('rejects visit priced with combo/membership recurring priceId', () => {
    const bad = buildMembershipEnrollmentTagadaInitItems({
      membershipSku: SEM_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
      shippingCents: 3000,
      membershipVariantId: SEM_TAGADA_VARIANT_ID,
      visitVariantId: 'variant_3b859fb20d65',
      visitPriceId: SEM_TWO_DAY_COMBO_PRICE_ID,
    });
    expect(bad).toEqual({ ok: false, reason: 'one_time_must_not_use_membership_price' });
  });

  it('validates rebill against stored combo monthly amount (not base 14900)', () => {
    expect(
      assertMembershipRebillAmountMatches({
        expectedMonthlyAmountCents: 17900,
        paidAmountCents: 17900,
      }),
    ).toEqual({ ok: true });
    expect(
      assertMembershipRebillAmountMatches({
        expectedMonthlyAmountCents: 17900,
        paidAmountCents: 14900,
      }),
    ).toEqual({ ok: false, expected: 17900, paid: 14900 });
  });

  it('blocks unmapped MBM-MEM-* (not broadly all MEM SKUs)', () => {
    const r = evaluateMembershipCardCheckoutCart([
      {
        isMembership: true,
        purchaseType: 'membership_program',
        quantity: 1,
        sku: 'MBM-MEM-ELITE-001',
      },
    ]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('unsupported_membership');
  });

  it('blocks membership card when enrollment shipping is missing ($0)', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 0,
      taxCents: 0,
      items: [
        {
          isMembership: true,
          purchaseType: 'membership_program',
          quantity: 1,
          sku: SEM_MEMBERSHIP_SKU,
        },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('shipping_parity');
  });

  it('tax_cents must be 0 for membership card', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 3000,
      taxCents: 800,
      items: [
        {
          isMembership: true,
          purchaseType: 'membership_program',
          quantity: 1,
          sku: SEM_MEMBERSHIP_SKU,
        },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('unexpected_tax');
  });

  it('browser return never activates membership', () => {
    expect(membershipActivationFromBrowserReturn()).toBe(false);
    expect(
      shouldActivateMembershipFromSources({
        fromBrowserReturn: true,
        hasAuthoritativeSubscriptionEvidence: true,
        initialPaymentSucceeded: true,
      }),
    ).toBe(false);
    expect(
      shouldActivateMembershipFromSources({
        fromBrowserReturn: false,
        hasAuthoritativeSubscriptionEvidence: true,
      }),
    ).toBe(true);
  });

  it('maps subscription webhook events to membership status', () => {
    expect(mapTagadaSubscriptionEventToMembershipStatus('subscription/created')).toBe('active');
    expect(mapTagadaSubscriptionEventToMembershipStatus('subscription/rebillSucceeded')).toBe('active');
    expect(mapTagadaSubscriptionEventToMembershipStatus('subscription/rebillDeclined')).toBe(
      'payment_issue',
    );
    expect(mapTagadaSubscriptionEventToMembershipStatus('subscription/pastDue')).toBe('past_due');
    expect(mapTagadaSubscriptionEventToMembershipStatus('subscription/cancelScheduled')).toBe(
      'cancel_scheduled',
    );
    expect(mapTagadaSubscriptionEventToMembershipStatus('subscription/canceled')).toBe('canceled');
    expect(mapTagadaSubscriptionEventToMembershipStatus('subscription/paused')).toBe('paused');
    expect(mapTagadaSubscriptionEventToMembershipStatus('subscription/resumed')).toBe('active');
    expect(mapTagadaSubscriptionEventToMembershipStatus('subscription/rebillUpcoming')).toBe('ignore');
  });

  it('extracts subscription fields without inventing missing ones', () => {
    const fields = extractTagadaSubscriptionFields({
      eventType: 'subscription/created',
      data: {
        id: 'sub_abc123',
        customerId: 'cus_xyz',
        priceId: SEM_TAGADA_PRICE_ID,
        nextBillingDate: '2026-09-19T00:00:00.000Z',
        currentPeriodStart: '2026-08-19T00:00:00.000Z',
        currentPeriodEnd: '2026-09-19T00:00:00.000Z',
      },
    });
    expect(fields.subscriptionId).toBe('sub_abc123');
    expect(fields.customerId).toBe('cus_xyz');
    expect(fields.priceId).toBe(SEM_TAGADA_PRICE_ID);
    expect(fields.nextBillingAt).toBeTruthy();
    expect(extractTagadaSubscriptionFields({ eventType: 'subscription/created' }).subscriptionId).toBe(
      null,
    );
  });

  it('enforces three-month minimum cancel block', () => {
    const started = new Date('2026-08-19T00:00:00.000Z');
    const ends = computeMinimumTermEndsAt({ startedAt: started });
    expect(ends.toISOString()).toBe('2026-11-19T00:00:00.000Z');
    expect(
      canSelfServiceCancelMembership({
        minimumTermEndsAt: ends,
        now: new Date('2026-10-01T00:00:00.000Z'),
      }),
    ).toEqual({ ok: false, message: MEMBERSHIP_MINIMUM_CANCEL_BLOCK_MESSAGE });
    expect(
      canSelfServiceCancelMembership({
        minimumTermEndsAt: ends,
        now: new Date('2026-11-20T00:00:00.000Z'),
      }),
    ).toEqual({ ok: true });
  });

  it('preserves $500 free-shipping exclusion for membership lines', () => {
    expect(FREE_SHIPPING_THRESHOLD_CENTS).toBe(50000);
    const membershipLine = {
      kind: 'price_data' as const,
      unitAmountCents: 14900,
      quantity: 1,
      name: 'Semaglutide Membership',
      recurring: true,
      reason: 'wellness_member_discount' as const,
      productId: 'm1',
      productName: 'Semaglutide Membership',
      variantLabel: null,
    };
    expect(isFreeShippingEligibleMerchandiseLine(membershipLine)).toBe(false);
  });

  it('Tirzepatide current options through 15mg; 30mg excluded', () => {
    const m = getMembership('tirzepatide-membership');
    expect(m?.includedFormulations).toEqual(['2.5mg', '7.5mg', '12.5mg', '15mg']);
    expect(m?.includedFormulations.includes('30mg')).toBe(false);
  });

  it('Stripe remains disabled; public checkout is card-only when enabled', () => {
    expect(isStripeCheckoutEnabled()).toBe(false);
    expect(getActiveCheckoutPaymentMethods()).toEqual(['kashu_card']);
  });

  it('combo recurring price includes shipping dollars; no separate MBM-SHIP init line', () => {
    // Membership Tagada products remain isShippable=false / addDeliveryOnRebill=false.
    // Shipping is baked into combo recurring priceId — not a separate Tagada ShippingRate.
    const item = buildMembershipTagadaInitItem(TAGADA_MEMBERSHIP_PROGRAMS[SEM_MEMBERSHIP_SKU]);
    expect(Object.keys(item).sort()).toEqual(['priceId', 'quantity', 'variantId']);
    const enrollment = buildMembershipEnrollmentTagadaInitItems({
      membershipSku: SEM_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
      shippingCents: 3000,
      membershipVariantId: SEM_TAGADA_VARIANT_ID,
      visitVariantId: 'variant_3b859fb20d65',
      visitPriceId: 'price_6163adf08816',
    });
    expect(enrollment.ok).toBe(true);
    if (!enrollment.ok) return;
    expect(enrollment.items).toHaveLength(2);
    expect(enrollment.shippingSku).toBeNull();
    expect(enrollment.monthlyRebillCents).toBe(17900);
  });
});
