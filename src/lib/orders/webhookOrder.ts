/**
 * Pure helpers for Stripe webhook → order persistence (idempotent).
 * Used by the edge function and unit tests. No network I/O here.
 */

import type { OrderItemSnapshotInput } from './orderTypes';
import { shippingEligibilitySnapshot } from './shipping';
import { isOrderStatus, type OrderStatus, type PaymentStatus } from './orderStatus';

export interface CheckoutSessionLike {
  id: string;
  customer?: string | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
  payment_intent?: string | null;
  payment_status?: string | null;
  amount_total?: number | null;
  amount_subtotal?: number | null;
  total_details?: {
    amount_discount?: number | null;
    amount_shipping?: number | null;
    amount_tax?: number | null;
  } | null;
  metadata?: Record<string, string> | null;
  client_reference_id?: string | null;
  mode?: string | null;
}

export interface StripeLineItemLike {
  description?: string | null;
  quantity?: number | null;
  amount_total?: number | null;
  amount_subtotal?: number | null;
  amount_discount?: number | null;
  price?: { unit_amount?: number | null; product?: { name?: string | null } | string | null } | null;
}

export interface BuiltOrderInsert {
  customer_user_id: string | null;
  customer_email: string;
  customer_name: string;
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  shipping_method: string;
  free_shipping_eligible: boolean;
  requires_provider_review: boolean;
  currency: string;
}

export function mapStripePaymentStatus(session: CheckoutSessionLike): PaymentStatus {
  const ps = (session.payment_status ?? '').toLowerCase();
  if (ps === 'paid') return 'paid';
  if (ps === 'unpaid') return 'pending';
  if (ps === 'no_payment_required') return 'paid';
  return 'pending';
}

export function parseItemSnapshotsFromMetadata(
  metadata: Record<string, string> | null | undefined,
): OrderItemSnapshotInput[] | null {
  const raw = metadata?.item_snapshots;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed
      .map((row): OrderItemSnapshotInput | null => {
        if (!row || typeof row !== 'object') return null;
        const r = row as Record<string, unknown>;
        const productName = typeof r.productName === 'string' ? r.productName : null;
        const quantity = typeof r.quantity === 'number' ? r.quantity : Number(r.quantity);
        const unitPriceCents =
          typeof r.unitPriceCents === 'number' ? r.unitPriceCents : Number(r.unitPriceCents);
        const lineTotalCents =
          typeof r.lineTotalCents === 'number' ? r.lineTotalCents : Number(r.lineTotalCents);
        if (!productName || !quantity || Number.isNaN(unitPriceCents) || Number.isNaN(lineTotalCents)) {
          return null;
        }
        return {
          productId: typeof r.productId === 'string' ? r.productId : undefined,
          productName,
          variantLabel: typeof r.variantLabel === 'string' ? r.variantLabel : null,
          quantity,
          unitPriceCents,
          discountCents: typeof r.discountCents === 'number' ? r.discountCents : 0,
          lineTotalCents,
        };
      })
      .filter((x): x is OrderItemSnapshotInput => Boolean(x));
  } catch {
    return null;
  }
}

export function lineItemsFromStripe(
  lines: StripeLineItemLike[],
): OrderItemSnapshotInput[] {
  return lines.map(li => {
    const productName =
      (typeof li.price?.product === 'object' && li.price?.product?.name) ||
      li.description ||
      'Item';
    const quantity = li.quantity && li.quantity > 0 ? li.quantity : 1;
    const unit =
      typeof li.price?.unit_amount === 'number'
        ? li.price.unit_amount
        : Math.round((li.amount_subtotal ?? li.amount_total ?? 0) / quantity);
    const discount = li.amount_discount ?? 0;
    const lineTotal = li.amount_total ?? unit * quantity - discount;
    return {
      productName,
      quantity,
      unitPriceCents: Math.max(0, unit),
      discountCents: Math.max(0, discount),
      lineTotalCents: Math.max(0, lineTotal),
    };
  });
}

export function buildOrderFromCheckoutSession(
  session: CheckoutSessionLike,
  options?: { requiresProviderReview?: boolean },
): BuiltOrderInsert {
  const meta = session.metadata ?? {};
  const subtotal =
    Number(meta.subtotal_cents) ||
    session.amount_subtotal ||
    session.amount_total ||
    0;
  const discount =
    Number(meta.discount_cents) || session.total_details?.amount_discount || 0;
  const shipping =
    Number(meta.shipping_cents) || session.total_details?.amount_shipping || 0;
  const tax = Number(meta.tax_cents) || session.total_details?.amount_tax || 0;
  const total = session.amount_total ?? subtotal - discount + shipping + tax;
  const eligibility = shippingEligibilitySnapshot(subtotal);
  const paymentStatus = mapStripePaymentStatus(session);
  const orderStatus: OrderStatus =
    paymentStatus === 'paid' ? 'payment_confirmed' : 'order_received';

  const userId = session.client_reference_id || meta.customer_user_id || null;
  const email =
    session.customer_details?.email ||
    session.customer_email ||
    meta.customer_email ||
    '';
  const name =
    session.customer_details?.name ||
    meta.customer_name ||
    '';

  return {
    customer_user_id: userId && userId.length > 10 ? userId : null,
    customer_email: email,
    customer_name: name,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === 'string' ? session.payment_intent : null,
    stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
    order_status: orderStatus,
    payment_status: paymentStatus,
    subtotal_cents: Math.max(0, subtotal),
    discount_cents: Math.max(0, discount),
    shipping_cents: Math.max(0, shipping),
    tax_cents: Math.max(0, tax),
    total_cents: Math.max(0, total),
    shipping_method: meta.shipping_method || '',
    free_shipping_eligible:
      meta.free_shipping_eligible === 'true' || eligibility.free_shipping_eligible,
    requires_provider_review:
      options?.requiresProviderReview === true || meta.requires_provider_review === 'true',
    currency: 'usd',
  };
}

/** Idempotency: same checkout session id must not create a second order. */
export function shouldSkipDuplicateCheckoutSession(
  existingSessionIds: Set<string>,
  sessionId: string,
): boolean {
  return existingSessionIds.has(sessionId);
}

export function paymentStatusFromRefundEvent(eventType: string): PaymentStatus | null {
  if (eventType === 'charge.refunded') return 'refunded';
  if (eventType === 'refund.updated') return 'partially_refunded';
  return null;
}

export function applyPaymentStatusUpdate(
  current: PaymentStatus,
  next: PaymentStatus,
): PaymentStatus {
  if (current === 'refunded') return 'refunded';
  return next;
}

export function nextAdminStatusAction(action: string): OrderStatus | null {
  const map: Record<string, OrderStatus> = {
    start_processing: 'processing',
    mark_preparing: 'preparing_for_shipment',
    mark_shipped: 'shipped',
    mark_delivered: 'delivered',
    mark_canceled: 'canceled',
    provider_review: 'provider_review_in_progress',
    action_required: 'action_required',
  };
  const status = map[action];
  return status && isOrderStatus(status) ? status : null;
}

/** Extension points for future transactional email (do not send duplicates here). */
export const ORDER_EMAIL_EVENT_TYPES = [
  'order_received',
  'processing',
  'shipped',
  'delivered',
  'action_required',
] as const;

export type OrderEmailEventType = (typeof ORDER_EMAIL_EVENT_TYPES)[number];

export function emailEventForStatus(status: OrderStatus): OrderEmailEventType | null {
  if ((ORDER_EMAIL_EVENT_TYPES as readonly string[]).includes(status)) {
    return status as OrderEmailEventType;
  }
  if (status === 'payment_confirmed') return 'order_received';
  if (status === 'preparing_for_shipment') return 'processing';
  return null;
}
