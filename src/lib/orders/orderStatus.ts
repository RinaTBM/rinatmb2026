/**
 * Customer-facing / operational order & fulfillment statuses (Phase 2).
 * No clinical statuses (e.g. Prescription Approved/Denied).
 */

export const ORDER_STATUSES = [
  'order_received',
  'payment_confirmed',
  'action_required',
  'provider_review_in_progress',
  'processing',
  'preparing_for_shipment',
  'shipped',
  'delivered',
  'canceled',
  'refunded',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  'pending',
  'paid',
  'failed',
  'refunded',
  'partially_refunded',
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  order_received: 'Order Received',
  payment_confirmed: 'Payment Confirmed',
  action_required: 'Action Required',
  provider_review_in_progress: 'Provider Review In Progress',
  processing: 'Processing',
  preparing_for_shipment: 'Preparing for Shipment',
  shipped: 'Shipped',
  delivered: 'Delivered',
  canceled: 'Canceled',
  refunded: 'Refunded',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
  partially_refunded: 'Partially Refunded',
};

/** Default timeline stages for a typical fulfillment path. */
export const DEFAULT_TIMELINE: OrderStatus[] = [
  'order_received',
  'processing',
  'preparing_for_shipment',
  'shipped',
  'delivered',
];

/** Timeline when provider review applies (operational wording only). */
export const PROVIDER_REVIEW_TIMELINE: OrderStatus[] = [
  'order_received',
  'provider_review_in_progress',
  'processing',
  'preparing_for_shipment',
  'shipped',
  'delivered',
];

export const PROCESSING_POLICY_COPY =
  'Most eligible orders are processed within 1–3 business days after required review and approval. Shipping transit time begins after processing is complete.';

export const AGELESS_PHARMACY_NAME = 'Ageless Pharma Rx';

export const AGELESS_FULFILLMENT_COPY =
  'Provider-approved prescriptions are fulfilled through Ageless Pharma Rx.';

/** Fields that must never appear on order / fulfillment tables. */
export const FORBIDDEN_ORDER_FIELDS = [
  'diagnosis',
  'medical_history',
  'clinical_notes',
  'provider_notes',
  'lab_results',
  'prescription_instructions',
  'dose_change',
  'symptoms',
] as const;

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function isPaymentStatus(value: string): value is PaymentStatus {
  return (PAYMENT_STATUSES as readonly string[]).includes(value);
}

export function labelOrderStatus(status: string): string {
  if (isOrderStatus(status)) return ORDER_STATUS_LABELS[status];
  return status;
}

export function labelPaymentStatus(status: string): string {
  if (isPaymentStatus(status)) return PAYMENT_STATUS_LABELS[status];
  return status;
}

export function timelineForOrder(requiresProviderReview: boolean): OrderStatus[] {
  return requiresProviderReview ? [...PROVIDER_REVIEW_TIMELINE] : [...DEFAULT_TIMELINE];
}

/**
 * Index of current status in the timeline, or -1 if terminal/off-path
 * (canceled/refunded/action_required handled separately in UI).
 */
export function timelineStepIndex(timeline: OrderStatus[], current: OrderStatus): number {
  return timeline.indexOf(current);
}

export function isTerminalStatus(status: OrderStatus): boolean {
  return status === 'canceled' || status === 'refunded';
}

export function customerCanViewOrder(input: {
  authenticatedUserId: string | null;
  orderCustomerUserId: string | null;
}): boolean {
  if (!input.authenticatedUserId || !input.orderCustomerUserId) return false;
  return input.authenticatedUserId === input.orderCustomerUserId;
}

export function customerCanUpdateFulfillment(): boolean {
  return false;
}

export function adminCanManageOrders(isAdmin: boolean): boolean {
  return isAdmin === true;
}

export function filterCustomerVisibleEvents<T extends { customer_visible: boolean }>(
  events: T[],
): T[] {
  return events.filter(e => e.customer_visible);
}

export function sanitizeAdminNoteForCustomer(note: string | null | undefined): null {
  void note;
  return null;
}
