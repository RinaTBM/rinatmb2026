/**
 * Processor-neutral payment methods for launch + future Plaid ACH + Kashu card.
 * Public storefront is card-first for eligible one-time carts.
 * ACH / Wire remain backend/admin emergency fallbacks (not shown publicly).
 */

import { isKashuCardEnabled, KASHU_CHECKOUT_UI_LABEL } from './kashuTagada';

export const PAYMENT_METHODS = ['manual_ach', 'manual_wire', 'plaid_ach', 'kashu_card'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Backend/admin bank methods (never deleted; not shown on public checkout). */
export const BANK_CHECKOUT_PAYMENT_METHODS = ['manual_ach', 'manual_wire'] as const;

/**
 * Public customer-selectable methods.
 * When card flag is on: Credit/Debit Card only.
 * When card flag is off: empty (contact / unavailable — do not expose ACH/Wire publicly).
 * Callers must still enforce cart eligibility (memberships blocked, shipping, unexpected tax).
 */
export function getActiveCheckoutPaymentMethods(): readonly PaymentMethod[] {
  if (isKashuCardEnabled()) {
    return ['kashu_card'];
  }
  return [];
}

/** @deprecated Prefer getActiveCheckoutPaymentMethods() — kept for existing imports. */
export const ACTIVE_CHECKOUT_PAYMENT_METHODS = BANK_CHECKOUT_PAYMENT_METHODS;
export type ActiveCheckoutPaymentMethod = PaymentMethod;

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  manual_ach: 'ACH / Bank Transfer',
  manual_wire: 'Domestic Wire Transfer',
  plaid_ach: 'Bank payment (coming soon)',
  kashu_card: KASHU_CHECKOUT_UI_LABEL,
};

export const PAYMENT_METHOD_HELP: Partial<Record<PaymentMethod, string>> = {
  manual_ach: 'Pay securely from your bank after submitting your order.',
  manual_wire: 'Send a domestic wire using the instructions provided after you submit your order.',
  kashu_card: 'Pay securely through our encrypted payment checkout.',
};

export const MEMBERSHIP_CHECKOUT_UNAVAILABLE_MESSAGE =
  'Online membership enrollment is being updated. Please contact us for assistance.';

export const CARD_CHECKOUT_INIT_FAILED_MESSAGE =
  "We couldn't start secure card checkout. Please try again or contact us for assistance.";

export function isPaymentMethod(value: string): value is PaymentMethod {
  return (PAYMENT_METHODS as readonly string[]).includes(value);
}

/** Methods allowed on persisted orders (includes ACH/Wire for admin / historical). */
export function isOrderPaymentMethod(value: string): value is PaymentMethod {
  return (
    value === 'manual_ach' ||
    value === 'manual_wire' ||
    value === 'kashu_card' ||
    value === 'plaid_ach'
  );
}

export function isActiveCheckoutPaymentMethod(value: string): value is PaymentMethod {
  return getActiveCheckoutPaymentMethods().includes(value as PaymentMethod);
}

/** Plaid ACH is architected but disabled until production approval. */
export function isPlaidAchEnabled(): boolean {
  return false;
}

export function assertSelectablePaymentMethod(
  value: string | null | undefined,
): { ok: true; method: PaymentMethod } | { ok: false; error: string } {
  if (!value || typeof value !== 'string') {
    return { ok: false, error: 'Please select a payment method.' };
  }
  if (value === 'plaid_ach') {
    return {
      ok: false,
      error: 'That payment method is not available. Please choose Credit / Debit Card or contact us.',
    };
  }
  if (value === 'manual_ach' || value === 'manual_wire') {
    return {
      ok: false,
      error:
        'Bank transfer is not available for online checkout. Please choose Credit / Debit Card or contact us.',
    };
  }
  if (value === 'kashu_card' && !isKashuCardEnabled()) {
    return {
      ok: false,
      error: 'Card payment is not available right now. Please contact us for assistance.',
    };
  }
  if (!isActiveCheckoutPaymentMethod(value)) {
    return {
      ok: false,
      error: 'Please select a valid payment method.',
    };
  }
  return { ok: true, method: value as PaymentMethod };
}
