/**
 * Admin-facing order status badges for payment + clinical rollup (Phase 12F).
 * Display-only — never used to mutate payment_status.
 */

export type AdminBadgeTone = 'green' | 'gray' | 'gold' | 'red' | 'blue';

export interface AdminStatusBadge {
  label: string;
  tone: AdminBadgeTone;
}

export function adminPaymentBadge(paymentStatus: string | null | undefined): AdminStatusBadge {
  switch (paymentStatus) {
    case 'awaiting_payment':
    case 'pending':
      return { label: 'Awaiting Payment', tone: 'gold' };
    case 'paid':
      return { label: 'Paid', tone: 'green' };
    case 'payment_under_review':
      return { label: 'Under Review', tone: 'red' };
    case 'payment_failed':
    case 'failed':
      return { label: 'Payment Failed', tone: 'red' };
    case 'cancelled':
      return { label: 'Cancelled', tone: 'gray' };
    case 'refunded':
    case 'partially_refunded':
      return { label: 'Refunded', tone: 'gray' };
    default:
      return { label: paymentStatus || 'Unknown', tone: 'gray' };
  }
}

export function adminClinicalBadge(input: {
  paymentStatus?: string | null;
  genHandoffStatus?: string | null;
  orderStatus?: string | null;
  fulfillmentStatus?: string | null;
  requiresProviderReview?: boolean | null;
}): AdminStatusBadge | null {
  const pay = input.paymentStatus || '';
  const gen = (input.genHandoffStatus || '').toUpperCase();
  const fulfill = (input.fulfillmentStatus || '').toLowerCase();
  const order = (input.orderStatus || '').toLowerCase();

  if (pay !== 'paid') return null;

  if (gen === 'REFUND_REQUIRED' || gen.includes('REFUND')) {
    return { label: 'Refund Required', tone: 'red' };
  }
  if (gen.includes('ERROR') || gen === 'FAILED') {
    return { label: 'GEN Error', tone: 'red' };
  }
  if (gen === 'PENDING' || gen === 'QUEUED' || gen === 'RETRY_REQUIRED') {
    return { label: 'Clinical Review Required', tone: 'gold' };
  }
  if (input.requiresProviderReview || order === 'provider_review_in_progress') {
    return { label: 'Provider Review', tone: 'gold' };
  }
  if (fulfill === 'shipped' || order === 'shipped') {
    return { label: 'Shipped', tone: 'blue' };
  }
  if (fulfill.includes('pharmacy') || fulfill === 'processing') {
    return { label: 'Pharmacy Processing', tone: 'blue' };
  }
  if (order === 'payment_confirmed' || fulfill === 'payment_confirmed') {
    return { label: 'Preparing your clinical review', tone: 'gold' };
  }
  if (gen === 'COMPLETED' || gen === 'APPROVED') {
    return { label: 'Approved', tone: 'green' };
  }
  return null;
}
