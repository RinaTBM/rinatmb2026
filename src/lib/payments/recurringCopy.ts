/**
 * Temporary launch copy for membership / Auto-Refill while manual ACH is used.
 * Do not claim automatic bank debits until Plaid (or another automated ACH) is live.
 */

export const RECURRING_MANUAL_PAYMENT_DISCLOSURE =
  'Payment is required for each billing period until automated bank payments are enabled.';

export const MEMBERSHIP_MANUAL_BILLING_NOTE =
  'Membership pricing is billed per period. You will receive a new invoice for each billing period; your bank will not be charged automatically at this time.';

export const AUTO_REFILL_MANUAL_BILLING_NOTE =
  'Auto-Refill saves 10% on eligible products. Each refill period requires a new payment using the invoice instructions until automated bank payments are enabled.';

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
