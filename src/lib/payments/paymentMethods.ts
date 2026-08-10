/**
 * Processor-neutral payment methods for launch + future Plaid ACH.
 * Only manual_ach and manual_wire are customer-selectable today.
 */

export const PAYMENT_METHODS = ['manual_ach', 'manual_wire', 'plaid_ach'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const ACTIVE_CHECKOUT_PAYMENT_METHODS = ['manual_ach', 'manual_wire'] as const;
export type ActiveCheckoutPaymentMethod = (typeof ACTIVE_CHECKOUT_PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  manual_ach: 'ACH / Bank Transfer',
  manual_wire: 'Domestic Wire Transfer',
  plaid_ach: 'Bank payment (coming soon)',
};

export const PAYMENT_METHOD_HELP: Record<ActiveCheckoutPaymentMethod, string> = {
  manual_ach: 'Pay securely from your bank after submitting your order.',
  manual_wire: 'Send a domestic wire using the instructions provided after you submit your order.',
};

export function isPaymentMethod(value: string): value is PaymentMethod {
  return (PAYMENT_METHODS as readonly string[]).includes(value);
}

export function isActiveCheckoutPaymentMethod(value: string): value is ActiveCheckoutPaymentMethod {
  return (ACTIVE_CHECKOUT_PAYMENT_METHODS as readonly string[]).includes(value);
}

/** Plaid ACH is architected but disabled until production approval. */
export function isPlaidAchEnabled(): boolean {
  return false;
}

export function assertSelectablePaymentMethod(
  value: string | null | undefined,
): { ok: true; method: ActiveCheckoutPaymentMethod } | { ok: false; error: string } {
  if (!value || typeof value !== 'string') {
    return { ok: false, error: 'Please select a payment method.' };
  }
  if (value === 'plaid_ach') {
    return { ok: false, error: 'That payment method is not available yet. Please choose ACH / Bank Transfer or Domestic Wire.' };
  }
  if (!isActiveCheckoutPaymentMethod(value)) {
    return { ok: false, error: 'Please select ACH / Bank Transfer or Domestic Wire Transfer.' };
  }
  return { ok: true, method: value };
}
