/**
 * Keep payment status separate from fulfillment. Unpaid orders must not
 * enter paid fulfillment paths as if funds were received.
 */

import type { OrderStatus } from '../orders/orderStatus';

const PAID_LIKE = new Set(['paid']);

/** Fulfillment statuses that require verified payment first. */
const REQUIRES_PAID = new Set<OrderStatus>([
  'payment_confirmed',
  'processing',
  'preparing_for_shipment',
  'shipped',
  'delivered',
]);

export function isPaymentReceived(paymentStatus: string): boolean {
  return PAID_LIKE.has(paymentStatus);
}

export function canAdvanceFulfillment(input: {
  paymentStatus: string;
  nextFulfillmentStatus: OrderStatus | string;
}): { ok: true } | { ok: false; error: string } {
  const next = input.nextFulfillmentStatus as OrderStatus;
  if (next === 'canceled' || next === 'refunded' || next === 'order_received' || next === 'action_required') {
    return { ok: true };
  }
  // Provider review may begin after payment is verified for prescription items;
  // unpaid orders stay at order_received / awaiting payment messaging.
  if (next === 'provider_review_in_progress' && !isPaymentReceived(input.paymentStatus)) {
    return {
      ok: false,
      error: 'Payment must be marked received before provider review can begin.',
    };
  }
  if (REQUIRES_PAID.has(next) && !isPaymentReceived(input.paymentStatus)) {
    return {
      ok: false,
      error: 'Payment must be marked received before fulfillment can advance.',
    };
  }
  return { ok: true };
}
