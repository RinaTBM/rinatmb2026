import { useEffect, useState, type ReactNode } from 'react';
import { navigate } from '@/router';
import { supabase } from '@/lib/supabaseClient';
import {
  adminAddNote,
  adminMarkPaymentReceived,
  adminSetTracking,
  adminUpdateFulfillmentStatus,
  getAdminOrderDetail,
  listAdminOrders,
  listOrderItemsForOrders,
} from '@/lib/orders/orderService';
import type {
  OrderAdminNoteRecord,
  OrderItemRecord,
  OrderRecord,
  OrderWithDetails,
} from '@/lib/orders/orderTypes';
import { formatCents, productNamesSummary } from '@/lib/orders/orderTypes';
import {
  labelOrderStatus,
  labelPaymentStatus,
  type OrderStatus,
} from '@/lib/orders/orderStatus';
import { labelShippingMethod } from '@/lib/orders/shipping';
import { TRACKING_CARRIERS } from '@/lib/orders/tracking';
import { nextAdminStatusAction } from '@/lib/orders/webhookOrder';
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from '@/lib/payments/paymentMethods';
import { isPaymentReceived } from '@/lib/payments/fulfillmentGuards';

function Badge({ tone, children }: { tone: 'green' | 'gray' | 'gold' | 'red'; children: ReactNode }) {
  const map = {
    green: 'bg-green-100 text-green-800',
    gray: 'bg-cream-200 text-ink-600',
    gold: 'bg-gold-100 text-gold-700',
    red: 'bg-red-100 text-red-700',
  } as const;
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${map[tone]}`}>{children}</span>;
}

export function AdminOrdersList({ canWrite }: { canWrite: boolean }) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [itemsByOrder, setItemsByOrder] = useState<Record<string, OrderItemRecord[]>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!supabase || !canWrite) {
      setMsg('Connect Supabase and sign in as an admin to view orders.');
      return;
    }
    setLoading(true);
    setMsg(null);
    const { orders: rows, error } = await listAdminOrders(supabase);
    if (error) {
      setMsg(`Error: ${error}`);
      setOrders([]);
      setLoading(false);
      return;
    }
    setOrders(rows);
    const { items } = await listOrderItemsForOrders(
      supabase,
      rows.map(r => r.id),
    );
    const map: Record<string, OrderItemRecord[]> = {};
    for (const item of items) (map[item.order_id] ??= []).push(item);
    setItemsByOrder(map);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canWrite]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900 mb-2">Orders</h1>
      <p className="text-sm text-ink-500 mb-6">
        Manage fulfillment and tracking. Mark invoice payments received after bank funds are verified.
        Provider-directed prescriptions are fulfilled through Ageless Pharma Rx when applicable.
      </p>
      <button className="btn-outline mb-4" onClick={() => void load()} disabled={loading}>
        {loading ? 'Loading…' : 'Refresh'}
      </button>
      {msg && <p className="text-sm text-ink-500 mb-4">{msg}</p>}
      {orders.length === 0 && !msg ? (
        <p className="text-ink-500">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const actionRequired = order.order_status === 'action_required';
            const items = itemsByOrder[order.id] ?? [];
            return (
              <div key={order.id} className="card-lux p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink-900">{order.public_order_number}</p>
                    <p className="text-xs text-ink-500">
                      {order.customer_name || 'Customer'} · {order.customer_email || '—'}
                    </p>
                    <p className="text-xs text-ink-400">
                      {new Date(order.created_at).toLocaleString()} ·{' '}
                      {labelShippingMethod(order.shipping_method)}
                    </p>
                    <p className="text-xs text-ink-500 mt-1">
                      {items.length ? productNamesSummary(items, 2) : '—'}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-ink-900">{formatCents(order.total_cents)}</p>
                    <div className="flex flex-wrap gap-1 justify-end">
                      <Badge tone="gray">{labelPaymentStatus(order.payment_status)}</Badge>
                      <Badge tone={actionRequired ? 'red' : 'gold'}>
                        {labelOrderStatus(order.order_status)}
                      </Badge>
                      {actionRequired ? <Badge tone="red">Action Required</Badge> : null}
                    </div>
                    <button
                      className="btn-outline !py-1 !px-3 text-xs mt-2"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      Open order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminOrderDetail({
  orderId,
  canWrite,
  adminUserId,
  adminEmail,
}: {
  orderId: string;
  canWrite: boolean;
  adminUserId: string | null;
  adminEmail: string | null;
}) {
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [notes, setNotes] = useState<OrderAdminNoteRecord[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [carrier, setCarrier] = useState('UPS');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [paymentNote, setPaymentNote] = useState('');
  const [confirmPaid, setConfirmPaid] = useState(false);

  const load = async () => {
    if (!supabase || !canWrite) {
      setMsg('Connect Supabase and sign in as an admin.');
      return;
    }
    const { order: detail, adminNotes, error } = await getAdminOrderDetail(supabase, orderId);
    if (error) {
      setMsg(`Error: ${error}`);
      return;
    }
    setOrder(detail);
    setNotes(adminNotes);
    if (detail?.fulfillment?.carrier) setCarrier(detail.fulfillment.carrier);
    if (detail?.fulfillment?.tracking_number) setTrackingNumber(detail.fulfillment.tracking_number);
    if (detail?.fulfillment?.tracking_url) setTrackingUrl(detail.fulfillment.tracking_url);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, canWrite]);

  const runStatus = async (action: string) => {
    if (!supabase || !order) return;
    const status = nextAdminStatusAction(action);
    if (!status) return;
    setBusy(true);
    setMsg(null);
    const { error } = await adminUpdateFulfillmentStatus(
      supabase,
      order.id,
      status as OrderStatus,
      adminEmail || adminUserId || 'admin',
    );
    setBusy(false);
    if (error) setMsg(error);
    else await load();
  };

  const saveTracking = async () => {
    if (!supabase || !order) return;
    setBusy(true);
    setMsg(null);
    const { error } = await adminSetTracking(supabase, order.id, {
      carrier,
      trackingNumber,
      trackingUrl: carrier === 'Other' ? trackingUrl : null,
      markShipped: true,
      createdBy: adminEmail || adminUserId || 'admin',
    });
    setBusy(false);
    if (error) setMsg(error);
    else await load();
  };

  const saveNote = async () => {
    if (!supabase || !order || !note.trim()) return;
    setBusy(true);
    const { error } = await adminAddNote(supabase, order.id, note, adminUserId);
    setBusy(false);
    if (error) setMsg(error);
    else {
      setNote('');
      await load();
    }
  };

  const markPaid = async () => {
    if (!supabase || !order || !confirmPaid) {
      setMsg('Confirm the amount and payment details before marking payment received.');
      return;
    }
    setBusy(true);
    setMsg(null);
    const { error } = await adminMarkPaymentReceived(supabase, {
      orderId: order.id,
      adminIdentity: adminEmail || adminUserId || 'admin',
      confirmedTotalCents: order.total_cents,
      paymentNote,
    });
    setBusy(false);
    if (error) setMsg(error);
    else {
      setConfirmPaid(false);
      setPaymentNote('');
      await load();
    }
  };

  if (!order) {
    return (
      <div>
        <button className="btn-outline mb-4" onClick={() => navigate('/admin/orders')}>
          Back to orders
        </button>
        <p className="text-ink-500">{msg || 'Loading order…'}</p>
      </div>
    );
  }

  return (
    <div>
      <button className="btn-outline mb-4" onClick={() => navigate('/admin/orders')}>
        Back to orders
      </button>
      <h1 className="font-serif text-3xl text-ink-900 mb-2">{order.public_order_number}</h1>
      <p className="text-sm text-ink-500 mb-6">
        Admin order management — do not change charge amounts or prescription dose here.
      </p>
      {msg && <p className="text-sm text-red-700 mb-4" role="alert">{msg}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-lux p-5 space-y-2 text-sm">
          <h2 className="font-serif text-xl text-ink-900 mb-2">Customer</h2>
          <p>{order.customer_name || '—'}</p>
          <p className="text-ink-500">{order.customer_email || '—'}</p>
        </section>

        <section className="card-lux p-5 space-y-3 text-sm">
          <h2 className="font-serif text-xl text-ink-900 mb-2">Payment</h2>
          <p>Status: {labelPaymentStatus(order.payment_status)}</p>
          <p>
            Method:{' '}
            {order.payment_method
              ? PAYMENT_METHOD_LABELS[order.payment_method as PaymentMethod] || order.payment_method
              : '—'}
          </p>
          <p>Invoice: {order.invoice_number || '—'}</p>
          <p>Reference / memo: {order.payment_reference || order.public_order_number}</p>
          <p>Expected amount: {formatCents(order.total_cents)}</p>
          {order.paid_at ? (
            <p className="text-xs text-ink-500">
              Paid at {new Date(order.paid_at).toLocaleString()}
              {order.paid_marked_by ? ` · marked by ${order.paid_marked_by}` : ''}
            </p>
          ) : null}
          {!isPaymentReceived(order.payment_status) ? (
            <div className="mt-3 space-y-2 rounded-xl border border-cream-300 bg-cream-50 p-3">
              <p className="font-medium text-ink-900">Mark payment received</p>
              <p className="text-xs text-ink-500">
                Confirm funds for {order.public_order_number} ({formatCents(order.total_cents)}) via{' '}
                {order.payment_method
                  ? PAYMENT_METHOD_LABELS[order.payment_method as PaymentMethod] || order.payment_method
                  : 'selected method'}{' '}
                before continuing fulfillment.
              </p>
              <input
                className="input-lux text-xs"
                placeholder="Optional internal payment note / bank reference"
                value={paymentNote}
                onChange={e => setPaymentNote(e.target.value)}
              />
              <label className="flex items-start gap-2 text-xs text-ink-600">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={confirmPaid}
                  onChange={e => setConfirmPaid(e.target.checked)}
                />
                I confirm the expected amount was received and verified.
              </label>
              <button
                className="btn-primary !py-1 !px-3 text-xs"
                disabled={busy || !confirmPaid || !canWrite}
                onClick={() => void markPaid()}
              >
                Mark Payment Received
              </button>
            </div>
          ) : (
            <Badge tone="green">Payment received</Badge>
          )}
        </section>

        <section className="card-lux p-5 text-sm lg:col-span-2">
          <h2 className="font-serif text-xl text-ink-900 mb-3">Items</h2>
          <ul className="space-y-2">
            {order.items.map(item => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>
                  {item.product_name_snapshot}
                  {item.variant_snapshot ? ` · ${item.variant_snapshot}` : ''} × {item.quantity}
                </span>
                <span>{formatCents(item.line_total_cents)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-lux p-5 space-y-2 text-sm">
          <h2 className="font-serif text-xl text-ink-900 mb-2">Shipping</h2>
          <p>{labelShippingMethod(order.shipping_method)}</p>
          <p>{formatCents(order.shipping_cents)}</p>
          {order.free_shipping_eligible ? (
            <Badge tone="green">$500+ free-shipping eligible</Badge>
          ) : null}
        </section>

        <section className="card-lux p-5 space-y-2 text-sm">
          <h2 className="font-serif text-xl text-ink-900 mb-2">Fulfillment</h2>
          <p>{labelOrderStatus(order.fulfillment?.fulfillment_status ?? order.order_status)}</p>
          {order.fulfillment?.pharmacy_name ? (
            <p className="text-ink-500">Pharmacy: {order.fulfillment.pharmacy_name}</p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-2">
            <button className="btn-outline !py-1 !px-3 text-xs" disabled={busy} onClick={() => void runStatus('start_processing')}>
              Start Processing
            </button>
            <button className="btn-outline !py-1 !px-3 text-xs" disabled={busy} onClick={() => void runStatus('mark_preparing')}>
              Mark Preparing for Shipment
            </button>
            <button className="btn-outline !py-1 !px-3 text-xs" disabled={busy} onClick={() => void runStatus('mark_delivered')}>
              Mark Delivered
            </button>
            <button className="btn-outline !py-1 !px-3 text-xs" disabled={busy} onClick={() => void runStatus('mark_canceled')}>
              Mark Canceled
            </button>
            {order.requires_provider_review ? (
              <button className="btn-outline !py-1 !px-3 text-xs" disabled={busy} onClick={() => void runStatus('provider_review')}>
                Provider Review In Progress
              </button>
            ) : null}
          </div>
        </section>

        <section className="card-lux p-5 space-y-3 text-sm lg:col-span-2">
          <h2 className="font-serif text-xl text-ink-900 mb-2">Tracking</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="text-xs text-ink-500">Carrier</span>
              <select className="input-lux mt-1" value={carrier} onChange={e => setCarrier(e.target.value)}>
                {TRACKING_CARRIERS.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs text-ink-500">Tracking number</span>
              <input
                className="input-lux mt-1"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
              />
            </label>
            {carrier === 'Other' ? (
              <label className="block sm:col-span-3">
                <span className="text-xs text-ink-500">HTTPS tracking URL (required for Other)</span>
                <input
                  className="input-lux mt-1"
                  value={trackingUrl}
                  onChange={e => setTrackingUrl(e.target.value)}
                  placeholder="https://"
                />
              </label>
            ) : null}
          </div>
          <button className="btn-primary" disabled={busy} onClick={() => void saveTracking()}>
            Add Tracking / Mark Shipped
          </button>
        </section>

        <section className="card-lux p-5 text-sm">
          <h2 className="font-serif text-xl text-ink-900 mb-3">Status history</h2>
          <ul className="space-y-2">
            {order.status_events.map(ev => (
              <li key={ev.id} className="border-b border-cream-200 pb-2">
                <p className="font-medium text-ink-900">{labelOrderStatus(ev.status)}</p>
                <p className="text-xs text-ink-400">
                  {new Date(ev.event_at).toLocaleString()} · {ev.customer_visible ? 'Customer visible' : 'Internal'} ·{' '}
                  {ev.created_by}
                </p>
                {ev.note ? <p className="text-xs text-ink-600 mt-1">{ev.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="card-lux p-5 text-sm">
          <h2 className="font-serif text-xl text-ink-900 mb-2">Internal notes</h2>
          <p className="text-xs text-ink-400 mb-3">Never shown to customers.</p>
          <textarea
            className="input-lux min-h-[80px]"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Operational note…"
          />
          <button className="btn-outline mt-2" disabled={busy || !note.trim()} onClick={() => void saveNote()}>
            Add internal note
          </button>
          <ul className="mt-4 space-y-2">
            {notes.map(n => (
              <li key={n.id} className="text-xs border-b border-cream-200 pb-2">
                <p className="text-ink-700">{n.note}</p>
                <p className="text-ink-400">{new Date(n.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
