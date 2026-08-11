/**
 * Processor-neutral payment methods for launch + future Plaid ACH + Kashu card.
 * ACH / Wire remain the primary bank methods. Card is Kashu/TagadaPay (not Stripe).
 */

import { isKashuCardEnabled, KASHU_CHECKOUT_UI_HELP, KASHU_CHECKOUT_UI_LABEL } from './kashuTagada';

export const PAYMENT_METHODS = ['manual_ach', 'manual_wire', 'plaid_ach', 'kashu_card'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Always-available bank methods (never removed). */
export const BANK_CHECKOUT_PAYMENT_METHODS = ['manual_ach', 'manual_wire'] as const;

/**
 * Customer-selectable methods. Card appears only when VITE_KASHU_CARD_ENABLED=true
 * (after secrets + Tagada product sync + owner approval). ACH/Wire always included.
 */
export function getActiveCheckoutPaymentMethods(): readonly PaymentMethod[] {
  if (isKashuCardEnabled()) {
    return ['manual_ach', 'manual_wire', 'kashu_card'];
  }
  return BANK_CHECKOUT_PAYMENT_METHODS;
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
  kashu_card: KASHU_CHECKOUT_UI_HELP,
};

export function isPaymentMethod(value: string): value is PaymentMethod {
  return (PAYMENT_METHODS as readonly string[]).includes(value);
}

/** Methods allowed on persisted orders (includes card even when UI flag is off). */
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
      error:
        'That payment method is not available yet. Please choose ACH / Bank Transfer or Domestic Wire.',
    };
  }
  if (value === 'kashu_card' && !isKashuCardEnabled()) {
    return {
      ok: false,
      error: 'Card payment is not available yet. Please choose ACH / Bank Transfer or Domestic Wire.',
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
