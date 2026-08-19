import { describe, expect, it } from 'vitest';
import {
  SEMAGLUTIDE_MEMBERSHIP_CENTS,
  TIRZEPATIDE_MEMBERSHIP_CENTS,
} from '@/lib/checkout/checkoutConstants';
import {
  assertMembershipRecurringInitItem,
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
  SEM_TAGADA_PRICE_ID,
  SEM_TAGADA_VARIANT_ID,
  shouldActivateMembershipFromSources,
  TAGADA_MEMBERSHIP_PROGRAMS,
  TIRZ_MEMBERSHIP_SKU,
  TIRZ_TAGADA_PRICE_ID,
  TIRZ_TAGADA_VARIANT_ID,
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

  it('includes verified recurring priceIds', () => {
    expect(SEM_TAGADA_PRICE_ID).toBe('price_344d3dacb4ab');
    expect(TIRZ_TAGADA_PRICE_ID).toBe('price_5cf1fa89610c');
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

  it('allows SEM-only membership card cart with $0 shipping and tax_cents=0', () => {
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
          productId: 'm1',
        },
      ],
    });
    expect(r).toEqual({ ok: true, membershipRecurring: true });
  });

  it('allows TIRZ-only membership card cart', () => {
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

  it('allows SEM membership + required Initial Provider Visit (one-time enrollment)', () => {
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
      }),
    ).toEqual({ ok: true, membershipRecurring: true });
  });

  it('SEM enrollment: first charge 22400; recurring rebill 14900 only (IPV never rebills)', () => {
    const due = membershipEnrollmentDueTodayCents({
      membershipSku: SEM_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
    });
    expect(due).toEqual({
      ok: true,
      dueTodayCents: 22400,
      monthlyRebillCents: 14900,
      visitCents: 7500,
    });
    const init = buildMembershipEnrollmentTagadaInitItems({
      membershipSku: SEM_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
      membershipVariantId: SEM_TAGADA_VARIANT_ID,
      visitVariantId: 'variant_08bf53e519ce',
      visitPriceId: 'price_6b59dbc48752',
    });
    expect(init.ok).toBe(true);
    if (!init.ok) return;
    expect(init.dueTodayCents).toBe(22400);
    expect(init.monthlyRebillCents).toBe(14900);
    expect(init.visitCents).toBe(7500);
    expect(init.items).toHaveLength(2);
    expect(init.items[0]).toEqual({
      variantId: SEM_TAGADA_VARIANT_ID,
      quantity: 1,
      priceId: SEM_TAGADA_PRICE_ID,
    });
    expect(init.items[1].priceId).not.toBe(SEM_TAGADA_PRICE_ID);
    expect(init.items[1].priceId).toBe('price_6b59dbc48752');
    // Shipping not in enrollment init.
    expect(init.items.every(i => !String(i.variantId).includes('ship'))).toBe(true);
  });

  it('TIRZ enrollment: first charge 32400; recurring rebill 24900 only', () => {
    const due = membershipEnrollmentDueTodayCents({
      membershipSku: TIRZ_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
    });
    expect(due).toEqual({
      ok: true,
      dueTodayCents: 32400,
      monthlyRebillCents: 24900,
      visitCents: 7500,
    });
    const cart = evaluateMembershipCardCheckoutCart([
      {
        isMembership: true,
        purchaseType: 'membership_program',
        quantity: 1,
        sku: TIRZ_MEMBERSHIP_SKU,
      },
      { purchaseType: 'one_time', quantity: 1, sku: 'MBM-PC-IPV-SRV-001' },
    ]);
    expect(cart).toMatchObject({
      ok: true,
      dueTodayCents: 32400,
      monthlyRebillCents: 24900,
      enrollmentVisitSku: 'MBM-PC-IPV-SRV-001',
    });
    const init = buildMembershipEnrollmentTagadaInitItems({
      membershipSku: TIRZ_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
      membershipVariantId: TIRZ_TAGADA_VARIANT_ID,
      visitVariantId: 'variant_08bf53e519ce',
      visitPriceId: 'price_6b59dbc48752',
    });
    expect(init.ok).toBe(true);
    if (!init.ok) return;
    expect(init.items[0].priceId).toBe(TIRZ_TAGADA_PRICE_ID);
    expect(init.monthlyRebillCents).toBe(24900);
    expect(init.dueTodayCents).toBe(32400);
  });

  it('membership enrollment shipping charged at enrollment is $0', () => {
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
    ).toBe(true);
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
      }).ok,
    ).toBe(false);
  });

  it('rejects visit priced with membership recurring priceId', () => {
    const bad = buildMembershipEnrollmentTagadaInitItems({
      membershipSku: SEM_MEMBERSHIP_SKU,
      visitSku: 'MBM-PC-IPV-SRV-001',
      membershipVariantId: SEM_TAGADA_VARIANT_ID,
      visitVariantId: 'variant_08bf53e519ce',
      visitPriceId: SEM_TAGADA_PRICE_ID,
    });
    expect(bad).toEqual({ ok: false, reason: 'visit_must_not_use_membership_price' });
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

  it('blocks membership card when paid shipping is attached to enrollment', () => {
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
        },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('shipping_parity');
  });

  it('tax_cents must be 0 for membership card', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 0,
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

  it('no recurring Tagada shipping on membership program config', () => {
    // Membership Tagada products are isShippable=false / addDeliveryOnRebill=false (verified live).
    // Enrollment init item is membership-only — no MBM-SHIP-* line.
    const item = buildMembershipTagadaInitItem(TAGADA_MEMBERSHIP_PROGRAMS[SEM_MEMBERSHIP_SKU]);
    expect(Object.keys(item).sort()).toEqual(['priceId', 'quantity', 'variantId']);
  });
});
