import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  assertSelectablePaymentMethod,
  isActiveCheckoutPaymentMethod,
  isPlaidAchEnabled,
  PAYMENT_METHODS,
} from './paymentMethods';
import {
  assertMarkPaymentReceived,
  bankInstructionsFromEnv,
  buildInvoiceViewModel,
  buildManualOrderInsert,
  canTransitionPaymentStatus,
  CHECKOUT_SUBMIT_CTA,
  invoiceNumberFromOrderNumber,
  paymentReferenceFromOrderNumber,
} from './manualInvoice';
import { canAdvanceFulfillment } from './fulfillmentGuards';
import {
  AUTO_REFILL_MANUAL_BILLING_NOTE,
  cartHasRecurringItems,
  MEMBERSHIP_MANUAL_BILLING_NOTE,
  RECURRING_MANUAL_PAYMENT_DISCLOSURE,
} from './recurringCopy';
import { SEMAGLUTIDE_MEMBERSHIP_CENTS, TIRZEPATIDE_MEMBERSHIP_CENTS } from '../checkout/checkoutConstants';
import { NEXT_DAY_SHIPPING_CENTS, TWO_DAY_SHIPPING_CENTS } from '../orders/shipping';
import { adminCanManageOrders } from '../orders/orderStatus';

describe('payment methods', () => {
  it('exposes processor-neutral methods including future plaid_ach', () => {
    expect(PAYMENT_METHODS).toEqual(['manual_ach', 'manual_wire', 'plaid_ach']);
    expect(isPlaidAchEnabled()).toBe(false);
    expect(isActiveCheckoutPaymentMethod('manual_ach')).toBe(true);
    expect(isActiveCheckoutPaymentMethod('plaid_ach')).toBe(false);
  });

  it('accepts ACH and wire only for checkout selection', () => {
    expect(assertSelectablePaymentMethod('manual_ach').ok).toBe(true);
    expect(assertSelectablePaymentMethod('manual_wire').ok).toBe(true);
    expect(assertSelectablePaymentMethod('plaid_ach').ok).toBe(false);
    expect(assertSelectablePaymentMethod('stripe').ok).toBe(false);
  });
});

describe('manual invoice order creation', () => {
  const baseTotals = {
    subtotalCents: 14900,
    discountCents: 0,
    shippingCents: TWO_DAY_SHIPPING_CENTS,
    taxCents: 0,
    totalCents: 14900 + TWO_DAY_SHIPPING_CENTS,
    shippingMethod: 'two_day',
    freeShippingEligible: false,
    requiresProviderReview: true,
  };

  it('creates awaiting_payment ACH order and never marks paid', () => {
    const built = buildManualOrderInsert({
      customer: {
        customerEmail: 'member@example.com',
        customerName: 'Test Member',
        customerUserId: 'user-1',
      },
      totals: baseTotals,
      paymentMethod: 'manual_ach',
      publicOrderNumber: 'MBM-2026-000123',
    });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    expect(built.order.payment_status).toBe('awaiting_payment');
    expect(built.order.order_status).toBe('order_received');
    expect(built.order.payment_method).toBe('manual_ach');
    expect(built.order.payment_reference).toBe('MBM-2026-000123');
    expect(built.order.invoice_number).toBe('INV-MBM-2026-000123');
    expect(built.order.stripe_checkout_session_id).toBeNull();
    expect(built.order.total_cents).toBe(17900);
  });

  it('creates awaiting_payment wire order with unique reference', () => {
    const built = buildManualOrderInsert({
      customer: { customerEmail: 'a@b.co', customerName: 'A B' },
      totals: { ...baseTotals, shippingCents: NEXT_DAY_SHIPPING_CENTS, totalCents: 14900 + NEXT_DAY_SHIPPING_CENTS },
      paymentMethod: 'manual_wire',
      publicOrderNumber: 'MBM-2026-000999',
    });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    expect(built.order.payment_method).toBe('manual_wire');
    expect(paymentReferenceFromOrderNumber(built.order.payment_reference)).toBe('MBM-2026-000999');
    expect(invoiceNumberFromOrderNumber('MBM-2026-000999')).toBe('INV-MBM-2026-000999');
  });

  it('rejects totals that do not reconcile and does not auto-pay', () => {
    const bad = buildManualOrderInsert({
      customer: { customerEmail: 'a@b.co', customerName: 'A B' },
      totals: { ...baseTotals, totalCents: 1 },
      paymentMethod: 'manual_ach',
      publicOrderNumber: 'MBM-2026-000001',
    });
    expect(bad.ok).toBe(false);
  });

  it('invoice amount matches persisted order totals', () => {
    const built = buildManualOrderInsert({
      customer: { customerEmail: 'a@b.co', customerName: 'Ada Lovelace' },
      totals: baseTotals,
      paymentMethod: 'manual_ach',
      publicOrderNumber: 'MBM-2026-000050',
    });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    const invoice = buildInvoiceViewModel({
      publicOrderNumber: 'MBM-2026-000050',
      customerName: built.order.customer_name,
      customerEmail: built.order.customer_email,
      orderDateIso: '2026-08-10T12:00:00.000Z',
      paymentMethod: 'manual_ach',
      paymentStatus: 'awaiting_payment',
      items: [
        {
          productName: 'Semaglutide Membership',
          quantity: 1,
          unitPriceCents: SEMAGLUTIDE_MEMBERSHIP_CENTS,
          lineTotalCents: SEMAGLUTIDE_MEMBERSHIP_CENTS,
          variantLabel: 'Requested dose: 0.5mg',
        },
      ],
      subtotalCents: built.order.subtotal_cents,
      discountCents: built.order.discount_cents,
      shippingCents: built.order.shipping_cents,
      taxCents: built.order.tax_cents,
      totalCents: built.order.total_cents,
      shippingMethod: built.order.shipping_method,
    });
    expect(invoice.totalCents).toBe(built.order.total_cents);
    expect(invoice.paymentStatus).toBe('awaiting_payment');
    expect(invoice.headline).toContain('awaiting payment');
  });
});

describe('payment status transitions + admin mark paid', () => {
  it('allows awaiting_payment → paid and records confirmation rules', () => {
    expect(canTransitionPaymentStatus('awaiting_payment', 'paid')).toBe(true);
    expect(assertMarkPaymentReceived({
      currentPaymentStatus: 'awaiting_payment',
      expectedTotalCents: 17900,
      confirmedTotalCents: 17900,
    }).ok).toBe(true);
  });

  it('rejects mark-paid with mismatched amount or illegal transition', () => {
    expect(assertMarkPaymentReceived({
      currentPaymentStatus: 'awaiting_payment',
      expectedTotalCents: 17900,
      confirmedTotalCents: 1,
    }).ok).toBe(false);
    expect(assertMarkPaymentReceived({
      currentPaymentStatus: 'refunded',
      expectedTotalCents: 17900,
      confirmedTotalCents: 17900,
    }).ok).toBe(false);
  });

  it('admin authorization gate remains required for order management', () => {
    expect(adminCanManageOrders(true)).toBe(true);
    expect(adminCanManageOrders(false)).toBe(false);
  });
});

describe('unpaid fulfillment guard', () => {
  it('blocks processing/shipping until paid', () => {
    expect(canAdvanceFulfillment({ paymentStatus: 'awaiting_payment', nextFulfillmentStatus: 'processing' }).ok).toBe(false);
    expect(canAdvanceFulfillment({ paymentStatus: 'awaiting_payment', nextFulfillmentStatus: 'shipped' }).ok).toBe(false);
    expect(canAdvanceFulfillment({ paymentStatus: 'awaiting_payment', nextFulfillmentStatus: 'provider_review_in_progress' }).ok).toBe(false);
    expect(canAdvanceFulfillment({ paymentStatus: 'paid', nextFulfillmentStatus: 'processing' }).ok).toBe(true);
    expect(canAdvanceFulfillment({ paymentStatus: 'awaiting_payment', nextFulfillmentStatus: 'canceled' }).ok).toBe(true);
  });
});

describe('bank instructions secrets mapping', () => {
  it('does not invent account numbers when secrets missing', () => {
    const ach = bankInstructionsFromEnv('manual_ach', {});
    expect(ach.configured).toBe(false);
    expect(ach.accountNumber).toBeUndefined();
    const wire = bankInstructionsFromEnv('manual_wire', {
      MANUAL_WIRE_BANK_NAME: 'Example Bank',
      MANUAL_WIRE_ROUTING_NUMBER: '110000000',
      MANUAL_WIRE_ACCOUNT_NUMBER: '000123456789',
    });
    expect(wire.configured).toBe(true);
    expect(wire.wireAccountNumber).toBe('000123456789');
  });
});

describe('recurring manual payment disclosure', () => {
  it('detects membership/auto-refill and keeps pricing constants', () => {
    expect(cartHasRecurringItems([{ isMembership: true }])).toBe(true);
    expect(cartHasRecurringItems([{ purchaseType: 'auto_refill' }])).toBe(true);
    expect(cartHasRecurringItems([{ purchaseType: 'one_time' }])).toBe(false);
    expect(RECURRING_MANUAL_PAYMENT_DISCLOSURE.toLowerCase()).toContain('each billing period');
    expect(MEMBERSHIP_MANUAL_BILLING_NOTE.toLowerCase()).toContain('new invoice for each billing period');
    expect(MEMBERSHIP_MANUAL_BILLING_NOTE.toLowerCase()).not.toContain('payment method on file');
    expect(AUTO_REFILL_MANUAL_BILLING_NOTE).toContain('10%');
    expect(AUTO_REFILL_MANUAL_BILLING_NOTE.toLowerCase()).toContain('invoice instructions');
    expect(SEMAGLUTIDE_MEMBERSHIP_CENTS).toBe(14900);
    expect(TIRZEPATIDE_MEMBERSHIP_CENTS).toBe(24900);
    expect(TWO_DAY_SHIPPING_CENTS).toBe(3000);
    expect(NEXT_DAY_SHIPPING_CENTS).toBe(5000);
    expect(CHECKOUT_SUBMIT_CTA).toBe('Submit Order & View Payment Instructions');
  });
});

describe('paymentsEnabled gates', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('never enables Stripe checkout', async () => {
    vi.stubEnv('VITE_PAYMENTS_ENABLED', 'true');
    const mod = await import('./paymentsEnabled');
    expect(mod.isStripeCheckoutEnabled()).toBe(false);
  });

  it('enables manual checkout by default and honors kill switches', async () => {
    vi.stubEnv('VITE_MANUAL_CHECKOUT_ENABLED', undefined);
    vi.stubEnv('VITE_PAYMENTS_ENABLED', undefined);
    let mod = await import('./paymentsEnabled');
    expect(mod.isManualCheckoutEnabled()).toBe(true);

    vi.resetModules();
    vi.stubEnv('VITE_MANUAL_CHECKOUT_ENABLED', 'false');
    mod = await import('./paymentsEnabled');
    expect(mod.isManualCheckoutEnabled()).toBe(false);
  });
});

describe('checkout must not call Stripe session creator', () => {
  it('submitInvoiceOrder targets create-invoice-order only', async () => {
    const calls: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        calls.push(String(url));
        return {
          ok: true,
          json: async () => ({
            orderId: 'ord_1',
            publicOrderNumber: 'MBM-2026-000777',
            paymentAccessToken: 'token',
            invoice: { totalCents: 100, paymentStatus: 'awaiting_payment' },
            bankInstructions: { method: 'manual_ach', configured: false },
          }),
        };
      }),
    );
    const { submitInvoiceOrder } = await import('./submitInvoiceOrder');
    const result = await submitInvoiceOrder({
      supabaseUrl: 'https://example.supabase.co',
      anonKey: 'anon',
      body: {
        paymentMethod: 'manual_ach',
        isActiveMember: false,
        customerEmail: 'a@b.co',
        customerName: 'A B',
        subtotalCents: 100,
        discountCents: 0,
        shippingCents: 0,
        taxCents: 0,
        totalCents: 100,
        shippingMethod: 'none',
        freeShippingEligible: false,
        requiresProviderReview: false,
        items: [{ productId: 'a2', quantity: 1, unitAmountCents: 100, productName: 'Wipes' }],
      },
    });
    expect(result.ok).toBe(true);
    expect(calls.some(u => u.includes('create-invoice-order'))).toBe(true);
    expect(calls.some(u => u.includes('create-checkout-session'))).toBe(false);
    vi.unstubAllGlobals();
  });
});
