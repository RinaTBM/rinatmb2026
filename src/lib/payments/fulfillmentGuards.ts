/**
 * Keep payment status separate from fulfillment. Unpaid orders must not
 * enter paid fulfillment paths as if funds were received.
 *
 * Provider-guided prescriptions also require provider workflow completion +
 * APPROVED therapy history before final fulfillment/shipping (not for
 * accessory / provider-service-only orders).
 *
 * Conflict note vs prior behavior:
 * - `provider_review_in_progress` still only requires paid (manual CrossTx window).
 * - Final paths (processing → delivered) additionally require provider satisfaction
 *   when `provider_requirement` is INITIAL / FOLLOW_UP / NEW_THERAPY.
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

/** Final fulfillment / shipping — provider must be satisfied when a visit was required. */
const REQUIRES_PROVIDER_SATISFIED = new Set<OrderStatus>([
  'processing',
  'preparing_for_shipment',
  'shipped',
  'delivered',
]);

export function isPaymentReceived(paymentStatus: string): boolean {
  return PAID_LIKE.has(paymentStatus);
}

export function isProviderRequirementSatisfied(input: {
  providerRequirement: string | null | undefined;
  providerWorkflowStatus: string | null | undefined;
  /** True when APPROVED therapy-history exists for ordered therapy/variant as appropriate. */
  hasApprovedTherapyForOrder: boolean;
}): { ok: true } | { ok: false; error: string } {
  const req = input.providerRequirement;
  if (!req || req === 'NONE') return { ok: true };

  if (input.providerWorkflowStatus !== 'COMPLETED') {
    return {
      ok: false,
      error: 'Provider review must be completed before this order can move to fulfillment.',
    };
  }
  if (!input.hasApprovedTherapyForOrder) {
    return {
      ok: false,
      error: 'Record the provider-approved treatment before fulfillment.',
    };
  }
  return { ok: true };
}

export function canAdvanceFulfillment(input: {
  paymentStatus: string;
  nextFulfillmentStatus: OrderStatus | string;
  providerRequirement?: string | null;
  providerWorkflowStatus?: string | null;
  hasApprovedTherapyForOrder?: boolean;
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
      error: 'Payment must be confirmed before fulfillment can continue.',
    };
  }
  if (REQUIRES_PAID.has(next) && !isPaymentReceived(input.paymentStatus)) {
    return {
      ok: false,
      error: 'Payment must be confirmed before fulfillment can continue.',
    };
  }

  if (REQUIRES_PROVIDER_SATISFIED.has(next)) {
    const providerGuard = isProviderRequirementSatisfied({
      providerRequirement: input.providerRequirement,
      providerWorkflowStatus: input.providerWorkflowStatus,
      hasApprovedTherapyForOrder: Boolean(input.hasApprovedTherapyForOrder),
    });
    if (!providerGuard.ok) return providerGuard;
  }

  return { ok: true };
}
