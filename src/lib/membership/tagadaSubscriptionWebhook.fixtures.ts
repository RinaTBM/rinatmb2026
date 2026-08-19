/**
 * Fixtures for Tagada subscription webhook envelopes.
 * Field names mirror documented Tagada event types + common nested `data` shapes.
 * Do not invent undocumented commerce fields in production handlers.
 */

import { SEM_TAGADA_PRICE_ID } from '@/lib/membership/tagadaMembershipBilling';

export const fixtureSubscriptionCreated = {
  id: 'evt_sub_created_001',
  eventType: 'subscription/created',
  data: {
    id: 'sub_test_sem_001',
    customerId: 'cus_test_001',
    priceId: SEM_TAGADA_PRICE_ID,
    currentPeriodStart: '2026-08-19T12:00:00.000Z',
    currentPeriodEnd: '2026-09-19T12:00:00.000Z',
    nextBillingDate: '2026-09-19T12:00:00.000Z',
    customer: {
      id: 'cus_test_001',
      tags: ['mbmOrder:MBM-2026-000100'],
    },
  },
};

export const fixtureSubscriptionRebillSucceeded = {
  id: 'evt_sub_rebill_ok_001',
  eventType: 'subscription/rebillSucceeded',
  data: {
    id: 'sub_test_sem_001',
    subscriptionId: 'sub_test_sem_001',
    customerId: 'cus_test_001',
    priceId: SEM_TAGADA_PRICE_ID,
    paymentId: 'pay_rebill_001',
    nextBillingDate: '2026-10-19T12:00:00.000Z',
    currentPeriodStart: '2026-09-19T12:00:00.000Z',
    currentPeriodEnd: '2026-10-19T12:00:00.000Z',
    customer: { tags: ['mbmOrder:MBM-2026-000100'] },
  },
};

export const fixtureSubscriptionRebillDeclined = {
  id: 'evt_sub_rebill_declined_001',
  eventType: 'subscription/rebillDeclined',
  data: {
    id: 'sub_test_sem_001',
    subscriptionId: 'sub_test_sem_001',
    customerId: 'cus_test_001',
    paymentId: 'pay_rebill_fail_001',
    customer: { tags: ['mbmOrder:MBM-2026-000100'] },
  },
};

export const fixtureSubscriptionPastDue = {
  id: 'evt_sub_past_due_001',
  eventType: 'subscription/pastDue',
  data: {
    id: 'sub_test_sem_001',
    subscriptionId: 'sub_test_sem_001',
    customer: { tags: ['mbmOrder:MBM-2026-000100'] },
  },
};

export const fixtureSubscriptionCancelScheduled = {
  id: 'evt_sub_cancel_sched_001',
  eventType: 'subscription/cancelScheduled',
  data: {
    id: 'sub_test_sem_001',
    subscriptionId: 'sub_test_sem_001',
    customer: { tags: ['mbmOrder:MBM-2026-000100'] },
  },
};

export const fixtureSubscriptionCanceled = {
  id: 'evt_sub_canceled_001',
  eventType: 'subscription/canceled',
  data: {
    id: 'sub_test_sem_001',
    subscriptionId: 'sub_test_sem_001',
    customer: { tags: ['mbmOrder:MBM-2026-000100'] },
  },
};

export const fixtureSubscriptionPaused = {
  id: 'evt_sub_paused_001',
  eventType: 'subscription/paused',
  data: {
    id: 'sub_test_sem_001',
    subscriptionId: 'sub_test_sem_001',
    customer: { tags: ['mbmOrder:MBM-2026-000100'] },
  },
};

export const fixtureSubscriptionResumed = {
  id: 'evt_sub_resumed_001',
  eventType: 'subscription/resumed',
  data: {
    id: 'sub_test_sem_001',
    subscriptionId: 'sub_test_sem_001',
    customer: { tags: ['mbmOrder:MBM-2026-000100'] },
  },
};

export const fixturePaymentSucceededMembershipEnrollment = {
  id: 'evt_pay_mem_001',
  eventType: 'payment/succeeded',
  data: {
    amount: 14900,
    paymentId: 'pay_enroll_001',
    orderId: 'order_tagada_001',
    customer: { tags: ['mbmOrder:MBM-2026-000100'] },
    order: { paidAmount: 14900 },
  },
};
