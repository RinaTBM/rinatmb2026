/**
 * Recurring billing copy for membership / Auto-Refill.
 * Membership card path uses Tagada native monthly rebilling when enabled.
 */

export const PAYMENT_MODEL_OVERVIEW =
  "After submitting your order, you'll receive an electronic invoice and secure instructions to complete payment by ACH / bank transfer or domestic wire.";

export const NO_BANK_WITHDRAWAL_ON_SUBMIT =
  'No payment is withdrawn from your bank when you submit your order.';

export const AWAITING_PAYMENT_STATUS_NOTE =
  'Orders remain Awaiting Payment until funds are received and verified.';

export const PROCESSING_AFTER_PAYMENT_NOTE =
  'Processing begins after payment has been received and verified and, where applicable, required provider review has been completed.';

export const RECURRING_MANUAL_PAYMENT_DISCLOSURE =
  'Payment is required for each billing period until automated bank payments are enabled.';

export const MEMBERSHIP_MANUAL_BILLING_NOTE =
  'Membership pricing is billed per period. When card enrollment is unavailable, you will receive a new invoice for each billing period and payment must be completed using the provided bank-transfer instructions.';

export const MEMBERSHIP_CARD_BILLING_NOTE =
  'Your card will be charged monthly while your membership is active. A 3-month minimum commitment applies.';

export const AUTO_REFILL_MANUAL_BILLING_NOTE =
  'Auto-Refill saves 10% on eligible products. Until automated bank payments are enabled, each refill period requires payment using the invoice instructions provided.';

export function cartHasRecurringItems(items: Array<{
  isMembership?: boolean;
  purchaseType?: string;
  subscription?: boolean;
}>): boolean {
  return items.some(
    i =>
      i.isMembership ||
      i.purchaseType === 'membership_program' ||
      i.purchaseType === 'auto_refill' ||
      i.subscription === true,
  );
}
