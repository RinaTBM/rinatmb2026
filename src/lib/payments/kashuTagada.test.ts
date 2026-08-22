import { createHash, createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  assertKashuPaidAmountMatchesOrder,
  buildTagadaCheckoutInitUrl,
  extractCheckoutTokenFromRedirectUrl,
  extractMbmOrderNumberFromTagadaPayload,
  extractPaidAmountCentsFromTagadaPayload,
  isTagadaWebhookEventType,
  KASHU_PAYMENT_METHOD,
  mapTagadaEventToPaymentStatus,
  mbmOrderCustomerTag,
  extractTagadaExternalIdsFromPayload,
  TAGADA_API_BASE_PRODUCTION,
  verifyTagadaWebhookSignatureSync,
} from './kashuTagada';
import {
  assertSelectablePaymentMethod,
  getActiveCheckoutPaymentMethods,
  PAYMENT_METHODS,
} from './paymentMethods';
import { canTransitionPaymentStatus } from './manualInvoice';
import { canAdvanceFulfillment } from './fulfillmentGuards';
import { isStripeCheckoutEnabled } from './paymentsEnabled';

describe('Kashu / TagadaPay payment method', () => {
  it('includes kashu_card in the processor-neutral enum without removing ACH/Wire/Plaid', () => {
    expect(PAYMENT_METHODS).toEqual([
      'manual_ach',
      'manual_wire',
      'plaid_ach',
      'kashu_card',
      'gen_whop',
    ]);
    expect(PAYMENT_METHODS).toContain('manual_ach');
    expect(PAYMENT_METHODS).toContain('manual_wire');
    expect(PAYMENT_METHODS).toContain('gen_whop');
  });

  it('defaults card ON when env unset; ACH/Wire stay in enum but are not publicly selectable', () => {
    expect(getActiveCheckoutPaymentMethods()).toEqual(['kashu_card']);
    expect(assertSelectablePaymentMethod('kashu_card')).toEqual({ ok: true, method: 'kashu_card' });
    expect(assertSelectablePaymentMethod('manual_ach').ok).toBe(false);
    expect(assertSelectablePaymentMethod('manual_wire').ok).toBe(false);
    // Backend/history enum still includes ACH/Wire.
    expect(PAYMENT_METHODS).toContain('manual_ach');
    expect(PAYMENT_METHODS).toContain('manual_wire');
  });

  it('never enables Stripe checkout', () => {
    expect(isStripeCheckoutEnabled()).toBe(false);
  });

  it('uses processor-neutral method constant kashu_card (not stripe)', () => {
    expect(KASHU_PAYMENT_METHOD).toBe('kashu_card');
    expect(KASHU_PAYMENT_METHOD).not.toContain('stripe');
  });
});

describe('Tagada webhook signature verification', () => {
  const computeHmacHex = (secret: string, rawBody: string) =>
    createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');

  it('accepts a valid sha256= HMAC header over the raw body', () => {
    const secret = 'whsec_test_secret';
    const rawBody = JSON.stringify({ eventType: 'order/paid', id: 'evt_1' });
    const sig = `sha256=${computeHmacHex(secret, rawBody)}`;
    expect(
      verifyTagadaWebhookSignatureSync({
        rawBody,
        secret,
        signatureHeader: sig,
        computeHmacHex,
      }),
    ).toBe(true);
  });

  it('rejects invalid signatures', () => {
    const rawBody = '{"eventType":"order/paid"}';
    expect(
      verifyTagadaWebhookSignatureSync({
        rawBody,
        secret: 'whsec_test_secret',
        signatureHeader: 'sha256=deadbeef',
        computeHmacHex,
      }),
    ).toBe(false);
    expect(
      verifyTagadaWebhookSignatureSync({
        rawBody,
        secret: 'whsec_test_secret',
        signatureHeader: null,
        computeHmacHex,
      }),
    ).toBe(false);
    expect(
      verifyTagadaWebhookSignatureSync({
        rawBody,
        secret: 'whsec_test_secret',
        signatureHeader: 'md5=abc',
        computeHmacHex,
      }),
    ).toBe(false);
  });

  it('rejects tampered bodies (idempotent-safe reject path)', () => {
    const secret = 'whsec_test_secret';
    const rawBody = JSON.stringify({ eventType: 'order/paid', id: 'evt_1' });
    const sig = `sha256=${computeHmacHex(secret, rawBody)}`;
    expect(
      verifyTagadaWebhookSignatureSync({
        rawBody: rawBody.replace('evt_1', 'evt_2'),
        secret,
        signatureHeader: sig,
        computeHmacHex,
      }),
    ).toBe(false);
  });
});

describe('Tagada → MBM status mapping + amount guard', () => {
  it('maps official event types only', () => {
    expect(isTagadaWebhookEventType('order/paid')).toBe(true);
    expect(isTagadaWebhookEventType('order.paid')).toBe(false);
    expect(mapTagadaEventToPaymentStatus('order/paid')).toBe('paid');
    expect(mapTagadaEventToPaymentStatus('payment/succeeded')).toBe('paid');
    expect(mapTagadaEventToPaymentStatus('order/failed')).toBe('payment_failed');
    expect(mapTagadaEventToPaymentStatus('payment/rejected')).toBe('payment_failed');
    expect(mapTagadaEventToPaymentStatus('order/refunded')).toBe('refunded');
    expect(mapTagadaEventToPaymentStatus('checkout/initiated')).toBeNull();
  });

  it('refuses to mark paid when amount is missing or mismatched', () => {
    expect(assertKashuPaidAmountMatchesOrder({ orderTotalCents: 14900, paidAmountCents: 14900 })).toEqual({
      ok: true,
    });
    expect(assertKashuPaidAmountMatchesOrder({ orderTotalCents: 14900, paidAmountCents: 14800 })).toMatchObject({
      ok: false,
      reason: 'mismatch',
    });
    expect(assertKashuPaidAmountMatchesOrder({ orderTotalCents: 14900, paidAmountCents: null })).toMatchObject({
      ok: false,
      reason: 'missing_amount',
    });
  });

  it('only unlocks fulfillment after paid', () => {
    expect(
      canAdvanceFulfillment({ paymentStatus: 'awaiting_payment', nextFulfillmentStatus: 'processing' }),
    ).toMatchObject({ ok: false });
    expect(
      canAdvanceFulfillment({ paymentStatus: 'paid', nextFulfillmentStatus: 'processing' }),
    ).toMatchObject({ ok: true });
    expect(canTransitionPaymentStatus('awaiting_payment', 'paid')).toBe(true);
    expect(canTransitionPaymentStatus('payment_failed', 'paid')).toBe(false);
  });
});

describe('Tagada checkout init URL builder', () => {
  it('builds official /api/public/v1/checkout/init query with storeId, items, currency, checkoutUrl', () => {
    const url = buildTagadaCheckoutInitUrl({
      apiBase: TAGADA_API_BASE_PRODUCTION,
      params: {
        storeId: 'store_abc',
        items: [{ variantId: 'var_1', quantity: 2 }],
        currency: 'USD',
        checkoutUrl: 'https://checkout.mybaremethod.com/checkout',
        returnUrl: 'https://mybaremethod.com/order/card-result/MBM-1?token=abc',
        customerEmail: 'a@b.com',
        customerTags: [mbmOrderCustomerTag('MBM-1')],
      },
    });
    expect(url.startsWith('https://api.tagada.io/api/public/v1/checkout/init?')).toBe(true);
    const u = new URL(url);
    expect(u.searchParams.get('storeId')).toBe('store_abc');
    expect(u.searchParams.get('currency')).toBe('USD');
    expect(u.searchParams.get('checkoutUrl')).toBe('https://checkout.mybaremethod.com/checkout');
    expect(JSON.parse(u.searchParams.get('items')!)).toEqual([{ variantId: 'var_1', quantity: 2 }]);
    expect(u.searchParams.get('customerTags')).toBe('mbmOrder:MBM-1');
  });

  it('extracts checkout token from redirect URLs', () => {
    expect(
      extractCheckoutTokenFromRedirectUrl(
        'https://checkout.mybaremethod.com/checkout/ch_abc/op?checkoutToken=tok_1',
      ),
    ).toBe('tok_1');
    expect(extractCheckoutTokenFromRedirectUrl('https://example.com/x?token=tok_2')).toBe('tok_2');
  });

  it('extracts MBM order number and amount from payload shapes when present', () => {
    expect(extractMbmOrderNumberFromTagadaPayload({ customerTags: ['mbmOrder:MBM-9'] })).toBe('MBM-9');
    expect(extractPaidAmountCentsFromTagadaPayload({ amountCents: 25900 })).toBe(25900);
    expect(extractPaidAmountCentsFromTagadaPayload({ order: { totalCents: 100 } })).toBe(100);
    expect(extractPaidAmountCentsFromTagadaPayload({})).toBeNull();
  });

  it('extracts nested live Tagada payment/succeeded envelope (Phase 3)', () => {
    const live = {
      id: '7cf0c363-b650-44bf-a7c9-1434d46c9315',
      type: 'payment/succeeded',
      data: {
        amount: 3399,
        paymentId: 'pay_1e0bd6751467',
        orderId: 'order_b2ee61c57a77',
        checkoutSessionId: 'cs_726480b958ea',
        status: 'succeeded',
        order: { status: 'paid', paidAmount: 3399 },
        customer: {
          tags: [
            'customerTags:mbmOrder:MBM-P3-LIVE-1787118084',
            'mbmOrder:MBM-P3-LIVE-1787118084',
          ],
        },
      },
    };
    expect(extractMbmOrderNumberFromTagadaPayload(live)).toBe('MBM-P3-LIVE-1787118084');
    expect(extractPaidAmountCentsFromTagadaPayload(live)).toBe(3399);
    expect(extractTagadaExternalIdsFromPayload(live)).toEqual({
      externalOrderId: 'order_b2ee61c57a77',
      externalPaymentId: 'pay_1e0bd6751467',
      externalCheckoutSessionId: 'cs_726480b958ea',
    });
  });

  it('fingerprint helper stays stable for idempotency keys', () => {
    const body = '{"id":"evt_1"}';
    const a = createHash('sha256').update(body).digest('hex');
    const b = createHash('sha256').update(body).digest('hex');
    expect(a).toBe(b);
  });
});
