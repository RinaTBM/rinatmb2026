/**
 * Recurring billing copy for membership / Auto-Refill.
 * Membership card path uses Tagada native monthly rebilling when enabled.
 */

export const PAYMENT_MODEL_OVERVIEW =
  'Complete payment by Credit / Debit Card through our secure hosted checkout. Your order remains unpaid until payment is confirmed.';

export const NO_BANK_WITHDRAWAL_ON_SUBMIT =
  'Your order remains unpaid until card payment is confirmed through secure hosted checkout.';

export const AWAITING_PAYMENT_STATUS_NOTE =
  'Orders remain unpaid until payment is confirmed.';

export const PROCESSING_AFTER_PAYMENT_NOTE =
  'Processing begins after payment has been received and, where applicable, required provider review has been completed.';

export const RECURRING_MANUAL_PAYMENT_DISCLOSURE =
  'Payment is required for each billing period while Auto-Refill remains active.';

export const MEMBERSHIP_MANUAL_BILLING_NOTE =
  'Membership pricing is billed monthly. When card enrollment is unavailable for this cart, contact support for assistance. Membership remains inactive until payment is confirmed.';

export const MEMBERSHIP_CARD_BILLING_NOTE =
  'Your card will be charged monthly while your membership is active, including your selected shipping. A 3-month minimum commitment applies.';

export const AUTO_REFILL_MANUAL_BILLING_NOTE =
  'Auto-Refill saves 10% on eligible products. Each refill period is billed according to your selected payment method. Provider appointments, accessories, shipping, and taxes are never discounted by Auto-Refill.';

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
