import type { OrderStatus, PaymentStatus } from './orderStatus';

export interface OrderRecord {
  id: string;
  customer_user_id: string | null;
  customer_email: string;
  customer_name: string;
  public_order_number: string;
  /** Legacy Stripe fields — retained for historical rows; unused by manual invoice checkout. */
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  order_status: OrderStatus | string;
  payment_status: PaymentStatus | string;
  /** Processor-neutral: manual_ach | manual_wire | plaid_ach (future). */
  payment_method?: string | null;
  payment_reference?: string | null;
  invoice_number?: string | null;
  paid_at?: string | null;
  paid_marked_by?: string | null;
  payment_admin_note?: string | null;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  shipping_method: string;
  free_shipping_eligible: boolean;
  currency: string;
  requires_provider_review: boolean;
  /** Provider appointment automation (nullable until migration applied). */
  provider_requirement?: string | null;
  provider_requirement_reason?: string | null;
  previous_variant_sku?: string | null;
  requested_variant_sku?: string | null;
  required_provider_product_id?: string | null;
  provider_visit_order_item_id?: string | null;
  provider_workflow_status?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerTherapyHistoryRecord {
  id: string;
  customer_user_id: string;
  therapy_family: string;
  product_id: string;
  variant_id: string;
  sku: string;
  approval_status: string;
  approved_at: string | null;
  approved_by: string | null;
  source_order_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  variant_snapshot: string | null;
  /** Purchased SKU (retail variant or membership PROGRAM SKU). */
  sku?: string | null;
  /** Storefront variant id / catalog variant_key when applicable. */
  variant_id?: string | null;
  /** Membership medication fulfillment SKU when applicable. */
  fulfillment_sku?: string | null;
  quantity: number;
  unit_price_cents: number;
  discount_cents: number;
  line_total_cents: number;
  created_at: string;
}

export interface OrderFulfillmentRecord {
  id: string;
  order_id: string;
  fulfillment_status: OrderStatus | string;
  pharmacy_name: string | null;
  carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  processing_started_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusEventRecord {
  id: string;
  order_id: string;
  status: OrderStatus | string;
  customer_visible: boolean;
  note: string | null;
  event_at: string;
  created_by: string;
  created_at: string;
}

export interface OrderAdminNoteRecord {
  id: string;
  order_id: string;
  note: string;
  created_by: string | null;
  created_at: string;
}

export interface OrderWithDetails extends OrderRecord {
  items: OrderItemRecord[];
  fulfillment: OrderFulfillmentRecord | null;
  status_events: OrderStatusEventRecord[];
}

/** Snapshot line from checkout — preserved for history. */
export interface OrderItemSnapshotInput {
  productId?: string;
  productName: string;
  variantLabel?: string | null;
  quantity: number;
  unitPriceCents: number;
  discountCents?: number;
  lineTotalCents: number;
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function productNamesSummary(items: OrderItemRecord[], max = 3): string {
  const names = items.map(i => i.product_name_snapshot);
  if (names.length <= max) return names.join(', ');
  return `${names.slice(0, max).join(', ')} +${names.length - max} more`;
}
