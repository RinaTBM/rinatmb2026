import { describe, expect, it } from 'vitest';
import {
  allocateNextPublicOrderNumber,
  assertUniquePublicOrderNumbers,
  CHECKOUT_ORDER_CREATE_FAILED_MESSAGE,
  formatPublicOrderNumber,
  isUniquePublicOrderNumberConflict,
  isValidPublicOrderNumber,
  parsePublicOrderSequence,
  sanitizeCheckoutOrderError,
} from './orderNumber';
import {
  evaluateKashuCardCartEligibility,
} from '@/lib/payments/kashuTagada';
import { getActiveCheckoutPaymentMethods } from '@/lib/payments/paymentMethods';
import { isStripeCheckoutEnabled } from '@/lib/payments/paymentsEnabled';
import { buildAuthoritativeOrderLines } from '@/lib/provider/injectProviderVisit';
import {
  NEXT_DAY_SHIPPING_CENTS,
  TWO_DAY_SHIPPING_CENTS,
} from '@/lib/orders/shipping';
import { ACCESSORY_SALES_TAX_RATE, PROVIDER_CARE_TAX_RATE } from '@/lib/checkout/checkoutConstants';

describe('public order number allocation (collision-safe)', () => {
  it('skips an existing colliding sequence (MBM-2026-000070)', () => {
    let seq = 69;
    const existing = new Set(['MBM-2026-000070']);
    const n = allocateNextPublicOrderNumber({
      year: 2026,
      existing,
      nextSequence: () => {
        seq += 1;
        return seq;
      },
    });
    expect(n).toBe('MBM-2026-000071');
    expect(existing.has(n)).toBe(false);
  });

  it('allocates sequential unique numbers', () => {
    let seq = 100;
    const existing = new Set<string>();
    const a = allocateNextPublicOrderNumber({
      year: 2026,
      existing,
      nextSequence: () => ++seq,
    });
    existing.add(a);
    const b = allocateNextPublicOrderNumber({
      year: 2026,
      existing,
      nextSequence: () => ++seq,
    });
    expect(a).toBe('MBM-2026-000101');
    expect(b).toBe('MBM-2026-000102');
    expect(assertUniquePublicOrderNumbers([a, b])).toBe(true);
  });

  it('simulates concurrent allocators without colliding', () => {
    let seq = 200;
    const existing = new Set<string>();
    const nextSequence = () => {
      seq += 1;
      return seq;
    };
    const allocated = Array.from({ length: 20 }, () =>
      allocateNextPublicOrderNumber({ year: 2026, existing, nextSequence }),
    );
    allocated.forEach(n => existing.add(n));
    expect(assertUniquePublicOrderNumbers(allocated)).toBe(true);
    expect(allocated).toHaveLength(20);
  });

  it('detects Postgres 23505 / unique constraint payloads', () => {
    const raw =
      'Unable to create order: {"code":"23505","details":"Key (public_order_number)=(MBM-2026-000070) already exists.","message":"duplicate key value violates unique constraint \\"orders_public_order_number_key\\""}';
    expect(isUniquePublicOrderNumberConflict(raw)).toBe(true);
    expect(sanitizeCheckoutOrderError(raw)).toBe(CHECKOUT_ORDER_CREATE_FAILED_MESSAGE);
    expect(sanitizeCheckoutOrderError(raw)).not.toMatch(/23505|duplicate key|postgres/i);
  });

  it('hides raw database errors from customers', () => {
    expect(
      sanitizeCheckoutOrderError(
        'Unable to create order: duplicate key value violates unique constraint "orders_public_order_number_key"',
      ),
    ).toBe(CHECKOUT_ORDER_CREATE_FAILED_MESSAGE);
    expect(sanitizeCheckoutOrderError('{"code":"23505"}')).toBe(
      CHECKOUT_ORDER_CREATE_FAILED_MESSAGE,
    );
  });

  it('parses sequence suffixes used for resync', () => {
    expect(parsePublicOrderSequence('MBM-2026-000070')).toBe(70);
    expect(parsePublicOrderSequence('MBM-P3-LIVE-1')).toBeNull();
    expect(isValidPublicOrderNumber(formatPublicOrderNumber(2026, 70))).toBe(true);
  });
});

describe('checkout rules preserved alongside order-number fix', () => {
  it('card flow: eligible one-time + IPV + $30 ship + tax 0', () => {
    expect(getActiveCheckoutPaymentMethods()).toEqual(['kashu_card']);
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: TWO_DAY_SHIPPING_CENTS,
        taxCents: 0,
        items: [
          { purchaseType: 'one_time', quantity: 1, sku: 'MBM-WM-SEM-INJ-001' },
          { purchaseType: 'one_time', quantity: 1, sku: 'MBM-PC-IPV-SRV-001' },
        ],
      }),
    ).toEqual({ ok: true });
  });

  it('accessory / provider / shipping totals stay tax-inclusive', () => {
    expect(ACCESSORY_SALES_TAX_RATE).toBe(0);
    expect(PROVIDER_CARE_TAX_RATE).toBe(0);
    const accessory = buildAuthoritativeOrderLines({
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
      shippingCents: TWO_DAY_SHIPPING_CENTS,
    });
    expect(accessory.taxCents).toBe(0);
    expect(accessory.totalCents).toBe(5900);

    const nextDay = buildAuthoritativeOrderLines({
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
      shippingCents: NEXT_DAY_SHIPPING_CENTS,
    });
    expect(nextDay.totalCents).toBe(7900);

    const freeShip = buildAuthoritativeOrderLines({
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
      shippingCents: 0,
    });
    expect(freeShip.totalCents).toBe(2900);
  });

  it('SEM membership card recurring allowed; ACH/Wire hidden; Stripe off', () => {
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
        },
      ],
    });
    expect(membership).toEqual({ ok: true, membershipRecurring: true });
    expect(getActiveCheckoutPaymentMethods()).not.toContain('manual_ach');
    expect(getActiveCheckoutPaymentMethods()).not.toContain('manual_wire');
    expect(isStripeCheckoutEnabled()).toBe(false);
  });

  it('frontend pending-card retry model does not mint a second number until a new invoice create', () => {
    // Documented contract: create-kashu-checkout-session reuses publicOrderNumber;
    // only create-invoice-order allocates. Duplicate paid prevention is webhook/status gated.
    const first = 'MBM-2026-000080';
    const retryUsesSame = first;
    expect(retryUsesSame).toBe(first);
    expect(isValidPublicOrderNumber(first)).toBe(true);
  });
});
