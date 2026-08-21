import { describe, expect, it } from 'vitest';
import {
  evaluateDuplicatePaidEvent,
  evaluatePaidAmountMatch,
  extractExternalIdsFromTagadaPayload,
  extractOrderNumberFromTagadaPayload,
  planTagadaOrderCorrelation,
} from './tagadaWebhookCorrelation';

describe('tagadaWebhookCorrelation', () => {
  it('success path: resolves mbmOrder from data.customer.tags', () => {
    const payload = {
      data: {
        amount: 3468,
        customer: { tags: ['mbmOrder:MBM-QA-12E7D-001', 'other'] },
        checkoutSessionId: 'cs_abc',
      },
    };
    expect(extractOrderNumberFromTagadaPayload(payload)).toBe('MBM-QA-12E7D-001');
    const plan = planTagadaOrderCorrelation(payload);
    expect(plan.primaryStep).toBe('mbmOrder_tag');
    expect(plan.orderNumber).toBe('MBM-QA-12E7D-001');
  });

  it('failure without tag: unmatched when no external ids (never email)', () => {
    const payload = {
      data: {
        amount: 100,
        customer: { email: 'qa@example.com', tags: [] },
      },
      customerEmail: 'qa@example.com',
    };
    const plan = planTagadaOrderCorrelation(payload);
    expect(plan.primaryStep).toBe('unmatched');
    expect(plan.orderNumber).toBeNull();
  });

  it('external checkout session ID fallback when mbmOrder missing', () => {
    const payload = {
      data: {
        checkoutSessionId: 'cs_fallback_001',
        paymentId: 'pay_x',
        orderId: 'ord_x',
      },
    };
    expect(extractOrderNumberFromTagadaPayload(payload)).toBeNull();
    const plan = planTagadaOrderCorrelation(payload);
    expect(plan.primaryStep).toBe('external_checkout_session_id');
    expect(plan.ids.externalCheckoutSessionId).toBe('cs_fallback_001');
    expect(extractExternalIdsFromTagadaPayload(payload).externalPaymentId).toBe('pay_x');
  });

  it('duplicate paid webhook is idempotent', () => {
    expect(
      evaluateDuplicatePaidEvent({
        currentPaymentStatus: 'paid',
        targetStatus: 'paid',
      }),
    ).toBe('duplicate_already_paid');
    expect(
      evaluateDuplicatePaidEvent({
        currentPaymentStatus: 'awaiting_payment',
        targetStatus: 'paid',
      }),
    ).toBe('proceed');
  });

  it('amount mismatch fails closed', () => {
    expect(
      evaluatePaidAmountMatch({ orderTotalCents: 3468, paidCents: 3468 }),
    ).toBe('ok');
    expect(
      evaluatePaidAmountMatch({ orderTotalCents: 3468, paidCents: 1156 }),
    ).toBe('amount_mismatch');
    expect(
      evaluatePaidAmountMatch({ orderTotalCents: 3468, paidCents: null }),
    ).toBe('amount_missing');
  });
});
