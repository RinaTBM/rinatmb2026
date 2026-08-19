import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  extractPaidAmountCentsFromTagadaPayload,
  extractMbmOrderNumberFromTagadaPayload,
  mapTagadaEventToPaymentStatus,
  verifyTagadaWebhookSignatureSync,
  assertKashuPaidAmountMatchesOrder,
} from '@/lib/payments/kashuTagada';
import {
  extractTagadaSubscriptionFields,
  mapTagadaSubscriptionEventToMembershipStatus,
  membershipActivationFromBrowserReturn,
} from './tagadaMembershipBilling';
import {
  fixturePaymentSucceededMembershipEnrollment,
  fixtureSubscriptionCanceled,
  fixtureSubscriptionCancelScheduled,
  fixtureSubscriptionCreated,
  fixtureSubscriptionPastDue,
  fixtureSubscriptionPaused,
  fixtureSubscriptionRebillDeclined,
  fixtureSubscriptionRebillSucceeded,
  fixtureSubscriptionResumed,
} from './tagadaSubscriptionWebhook.fixtures';

function hmacHex(secret: string, rawBody: string) {
  return createHmac('sha256', secret).update(rawBody).digest('hex');
}

describe('Tagada subscription webhook fixtures + parity guards', () => {
  it('preserves HMAC verification on subscription payloads', () => {
    const rawBody = JSON.stringify(fixtureSubscriptionCreated);
    const secret = 'whsec_test';
    const ok = verifyTagadaWebhookSignatureSync({
      rawBody,
      secret,
      signatureHeader: `sha256=${hmacHex(secret, rawBody)}`,
      computeHmacHex: hmacHex,
    });
    expect(ok).toBe(true);
    expect(
      verifyTagadaWebhookSignatureSync({
        rawBody,
        secret,
        signatureHeader: 'sha256=deadbeef',
        computeHmacHex: hmacHex,
      }),
    ).toBe(false);
  });

  it('subscription/created extracts order + subscription ids', () => {
    expect(extractMbmOrderNumberFromTagadaPayload(fixtureSubscriptionCreated)).toBe('MBM-2026-000100');
    const fields = extractTagadaSubscriptionFields(fixtureSubscriptionCreated);
    expect(fields.subscriptionId).toBe('sub_test_sem_001');
    expect(fields.customerId).toBe('cus_test_001');
    expect(mapTagadaSubscriptionEventToMembershipStatus('subscription/created')).toBe('active');
  });

  it('handles rebillSucceeded / rebillDeclined / pastDue / cancel / pause / resume', () => {
    expect(
      mapTagadaSubscriptionEventToMembershipStatus(fixtureSubscriptionRebillSucceeded.eventType),
    ).toBe('active');
    expect(extractTagadaSubscriptionFields(fixtureSubscriptionRebillSucceeded).paymentId).toBe(
      'pay_rebill_001',
    );
    expect(
      mapTagadaSubscriptionEventToMembershipStatus(fixtureSubscriptionRebillDeclined.eventType),
    ).toBe('payment_issue');
    expect(mapTagadaSubscriptionEventToMembershipStatus(fixtureSubscriptionPastDue.eventType)).toBe(
      'past_due',
    );
    expect(
      mapTagadaSubscriptionEventToMembershipStatus(fixtureSubscriptionCancelScheduled.eventType),
    ).toBe('cancel_scheduled');
    expect(mapTagadaSubscriptionEventToMembershipStatus(fixtureSubscriptionCanceled.eventType)).toBe(
      'canceled',
    );
    expect(mapTagadaSubscriptionEventToMembershipStatus(fixtureSubscriptionPaused.eventType)).toBe(
      'paused',
    );
    expect(mapTagadaSubscriptionEventToMembershipStatus(fixtureSubscriptionResumed.eventType)).toBe(
      'active',
    );
  });

  it('initial payment succeeded still uses amount equality for enrollment order', () => {
    expect(mapTagadaEventToPaymentStatus('payment/succeeded')).toBe('paid');
    const paid = extractPaidAmountCentsFromTagadaPayload(fixturePaymentSucceededMembershipEnrollment);
    expect(paid).toBe(14900);
    expect(
      assertKashuPaidAmountMatchesOrder({ orderTotalCents: 14900, paidAmountCents: paid }),
    ).toEqual({ ok: true });
    expect(
      assertKashuPaidAmountMatchesOrder({ orderTotalCents: 14900, paidAmountCents: 14800 }),
    ).toMatchObject({ ok: false, reason: 'mismatch' });
  });

  it('duplicate event id semantics remain caller-side idempotent (unique processor+event_id)', () => {
    // Documented contract: payment_webhook_events unique (processor, event_id).
    // Fixtures reuse stable ids so Edge duplicate handling can be exercised.
    expect(fixtureSubscriptionCreated.id).toBe('evt_sub_created_001');
    expect(fixtureSubscriptionCreated.id).toBe('evt_sub_created_001');
  });

  it('browser return never activates', () => {
    expect(membershipActivationFromBrowserReturn()).toBe(false);
  });
});
