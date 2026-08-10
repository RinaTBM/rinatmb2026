import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  OrderAdminNoteRecord,
  OrderFulfillmentRecord,
  OrderItemRecord,
  OrderRecord,
  OrderStatusEventRecord,
  OrderWithDetails,
} from './orderTypes';
import { filterCustomerVisibleEvents } from './orderStatus';
import { resolveTrackingUrl } from './tracking';
import type { OrderStatus } from './orderStatus';
import { canAdvanceFulfillment } from '../payments/fulfillmentGuards';
import { assertMarkPaymentReceived } from '../payments/manualInvoice';

export async function listCustomerOrders(
  client: SupabaseClient,
  userId: string,
): Promise<{ orders: OrderRecord[]; error: string | null }> {
  const { data, error } = await client
    .from('orders')
    .select('*')
    .eq('customer_user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return { orders: [], error: error.message };
  return { orders: (data ?? []) as OrderRecord[], error: null };
}

export async function listOrderItemsForOrders(
  client: SupabaseClient,
  orderIds: string[],
): Promise<{ items: OrderItemRecord[]; error: string | null }> {
  if (orderIds.length === 0) return { items: [], error: null };
  const { data, error } = await client
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);
  if (error) return { items: [], error: error.message };
  return { items: (data ?? []) as OrderItemRecord[], error: null };
}

export async function getCustomerOrderDetail(
  client: SupabaseClient,
  userId: string,
  orderId: string,
): Promise<{ order: OrderWithDetails | null; error: string | null }> {
  const { data: order, error } = await client
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('customer_user_id', userId)
    .maybeSingle();

  if (error) return { order: null, error: error.message };
  if (!order) return { order: null, error: null };

  const [itemsRes, fulfillRes, eventsRes] = await Promise.all([
    client.from('order_items').select('*').eq('order_id', orderId),
    client.from('order_fulfillment').select('*').eq('order_id', orderId).maybeSingle(),
    client
      .from('order_status_events')
      .select('*')
      .eq('order_id', orderId)
      .eq('customer_visible', true)
      .order('event_at', { ascending: true }),
  ]);

  if (itemsRes.error) return { order: null, error: itemsRes.error.message };
  if (fulfillRes.error) return { order: null, error: fulfillRes.error.message };
  if (eventsRes.error) return { order: null, error: eventsRes.error.message };

  return {
    order: {
      ...(order as OrderRecord),
      items: (itemsRes.data ?? []) as OrderItemRecord[],
      fulfillment: (fulfillRes.data as OrderFulfillmentRecord | null) ?? null,
      status_events: filterCustomerVisibleEvents(
        (eventsRes.data ?? []) as OrderStatusEventRecord[],
      ),
    },
    error: null,
  };
}

/** Lookup by public order number for customers (still scoped to own user_id). */
export async function getCustomerOrderByNumber(
  client: SupabaseClient,
  userId: string,
  publicOrderNumber: string,
): Promise<{ order: OrderWithDetails | null; error: string | null }> {
  const { data: order, error } = await client
    .from('orders')
    .select('id')
    .eq('public_order_number', publicOrderNumber)
    .eq('customer_user_id', userId)
    .maybeSingle();
  if (error) return { order: null, error: error.message };
  if (!order) return { order: null, error: null };
  return getCustomerOrderDetail(client, userId, order.id as string);
}

export async function listAdminOrders(
  client: SupabaseClient,
): Promise<{ orders: OrderRecord[]; error: string | null }> {
  const { data, error } = await client
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) return { orders: [], error: error.message };
  return { orders: (data ?? []) as OrderRecord[], error: null };
}

export async function getAdminOrderDetail(
  client: SupabaseClient,
  orderId: string,
): Promise<{
  order: OrderWithDetails | null;
  adminNotes: OrderAdminNoteRecord[];
  error: string | null;
}> {
  const { data: order, error } = await client
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();
  if (error) return { order: null, adminNotes: [], error: error.message };
  if (!order) return { order: null, adminNotes: [], error: null };

  const [itemsRes, fulfillRes, eventsRes, notesRes] = await Promise.all([
    client.from('order_items').select('*').eq('order_id', orderId),
    client.from('order_fulfillment').select('*').eq('order_id', orderId).maybeSingle(),
    client
      .from('order_status_events')
      .select('*')
      .eq('order_id', orderId)
      .order('event_at', { ascending: true }),
    client
      .from('order_admin_notes')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false }),
  ]);

  const err =
    itemsRes.error?.message ||
    fulfillRes.error?.message ||
    eventsRes.error?.message ||
    notesRes.error?.message ||
    null;
  if (err) return { order: null, adminNotes: [], error: err };

  return {
    order: {
      ...(order as OrderRecord),
      items: (itemsRes.data ?? []) as OrderItemRecord[],
      fulfillment: (fulfillRes.data as OrderFulfillmentRecord | null) ?? null,
      status_events: (eventsRes.data ?? []) as OrderStatusEventRecord[],
    },
    adminNotes: (notesRes.data ?? []) as OrderAdminNoteRecord[],
    error: null,
  };
}

export async function adminUpdateFulfillmentStatus(
  client: SupabaseClient,
  orderId: string,
  status: OrderStatus,
  createdBy: string,
): Promise<{ error: string | null }> {
  const { data: existing, error: loadErr } = await client
    .from('orders')
    .select('payment_status')
    .eq('id', orderId)
    .maybeSingle();
  if (loadErr) return { error: loadErr.message };
  if (!existing) return { error: 'Order not found.' };

  const guard = canAdvanceFulfillment({
    paymentStatus: String((existing as { payment_status?: string }).payment_status ?? ''),
    nextFulfillmentStatus: status,
  });
  if (!guard.ok) return { error: guard.error };

  const patch: Record<string, unknown> = {
    fulfillment_status: status,
  };
  if (status === 'processing') patch.processing_started_at = new Date().toISOString();
  if (status === 'shipped') patch.shipped_at = new Date().toISOString();
  if (status === 'delivered') patch.delivered_at = new Date().toISOString();

  const { error: fErr } = await client
    .from('order_fulfillment')
    .update(patch)
    .eq('order_id', orderId);
  if (fErr) return { error: fErr.message };

  const { error: oErr } = await client
    .from('orders')
    .update({ order_status: status })
    .eq('id', orderId);
  if (oErr) return { error: oErr.message };

  const { error: eErr } = await client.from('order_status_events').insert({
    order_id: orderId,
    status,
    customer_visible: true,
    created_by: createdBy,
  });
  if (eErr) return { error: eErr.message };
  return { error: null };
}

export async function adminMarkPaymentReceived(
  client: SupabaseClient,
  input: {
    orderId: string;
    adminIdentity: string;
    confirmedTotalCents: number;
    paymentNote?: string;
  },
): Promise<{ error: string | null }> {
  const { data: order, error: loadErr } = await client
    .from('orders')
    .select('id, payment_status, total_cents, public_order_number')
    .eq('id', input.orderId)
    .maybeSingle();
  if (loadErr) return { error: loadErr.message };
  if (!order) return { error: 'Order not found.' };

  const row = order as {
    payment_status: string;
    total_cents: number;
    public_order_number: string;
  };
  const check = assertMarkPaymentReceived({
    currentPaymentStatus: row.payment_status,
    expectedTotalCents: row.total_cents,
    confirmedTotalCents: input.confirmedTotalCents,
  });
  if (!check.ok) return { error: check.error };

  const paidAt = new Date().toISOString();
  const { error: oErr } = await client
    .from('orders')
    .update({
      payment_status: 'paid',
      paid_at: paidAt,
      paid_marked_by: input.adminIdentity,
      payment_admin_note: input.paymentNote?.trim() || null,
      order_status: 'payment_confirmed',
    })
    .eq('id', input.orderId);
  if (oErr) return { error: oErr.message };

  await client
    .from('order_fulfillment')
    .update({ fulfillment_status: 'payment_confirmed' })
    .eq('order_id', input.orderId);

  const { error: eErr } = await client.from('order_status_events').insert({
    order_id: input.orderId,
    status: 'payment_confirmed',
    customer_visible: true,
    note: 'Payment marked received by admin',
    created_by: input.adminIdentity,
  });
  if (eErr) return { error: eErr.message };

  if (input.paymentNote?.trim()) {
    await client.from('order_admin_notes').insert({
      order_id: input.orderId,
      note: `Payment received note: ${input.paymentNote.trim()}`,
      created_by: null,
    });
  }

  return { error: null };
}

export async function adminSetTracking(
  client: SupabaseClient,
  orderId: string,
  input: {
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string | null;
    markShipped?: boolean;
    createdBy: string;
  },
): Promise<{ error: string | null }> {
  if (input.markShipped !== false) {
    const { data: existing, error: loadErr } = await client
      .from('orders')
      .select('payment_status')
      .eq('id', orderId)
      .maybeSingle();
    if (loadErr) return { error: loadErr.message };
    const guard = canAdvanceFulfillment({
      paymentStatus: String((existing as { payment_status?: string } | null)?.payment_status ?? ''),
      nextFulfillmentStatus: 'shipped',
    });
    if (!guard.ok) return { error: guard.error };
  }

  const resolved = resolveTrackingUrl({
    carrier: input.carrier,
    trackingNumber: input.trackingNumber,
    trackingUrl: input.trackingUrl,
  });
  if (!resolved.ok) return { error: resolved.error };

  const patch: Record<string, unknown> = {
    carrier: input.carrier,
    tracking_number: input.trackingNumber.trim(),
    tracking_url: resolved.url,
  };
  if (input.markShipped !== false) {
    patch.fulfillment_status = 'shipped';
    patch.shipped_at = new Date().toISOString();
  }

  const { error: fErr } = await client
    .from('order_fulfillment')
    .update(patch)
    .eq('order_id', orderId);
  if (fErr) return { error: fErr.message };

  if (input.markShipped !== false) {
    const { error: oErr } = await client
      .from('orders')
      .update({ order_status: 'shipped' })
      .eq('id', orderId);
    if (oErr) return { error: oErr.message };
    const { error: eErr } = await client.from('order_status_events').insert({
      order_id: orderId,
      status: 'shipped',
      customer_visible: true,
      note: `Shipped via ${input.carrier}`,
      created_by: input.createdBy,
    });
    if (eErr) return { error: eErr.message };
  }
  return { error: null };
}

export async function adminAddNote(
  client: SupabaseClient,
  orderId: string,
  note: string,
  adminUserId: string | null,
): Promise<{ error: string | null }> {
  const { error } = await client.from('order_admin_notes').insert({
    order_id: orderId,
    note: note.trim(),
    created_by: adminUserId,
  });
  return { error: error?.message ?? null };
}

export async function adminAddCustomerVisibleEvent(
  client: SupabaseClient,
  orderId: string,
  status: OrderStatus,
  note: string | null,
  createdBy: string,
): Promise<{ error: string | null }> {
  const { error } = await client.from('order_status_events').insert({
    order_id: orderId,
    status,
    customer_visible: true,
    note,
    created_by: createdBy,
  });
  return { error: error?.message ?? null };
}
