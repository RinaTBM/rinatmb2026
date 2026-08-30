import { useEffect, useState, type ReactNode } from 'react';
import { navigate } from '@/router';
import { supabase } from '@/lib/supabaseClient';
import {
  adminAddNote,
  adminMarkCrossTxAppointmentCompleted,
  adminMarkPaymentReceived,
  adminRecordProviderApproval,
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
import { adminClinicalBadge, adminPaymentBadge } from '@/lib/orders/adminStatusBadges';
import {
  FOLLOW_UP_PROVIDER_VISIT,
  INITIAL_PROVIDER_VISIT,
} from '@/lib/provider/providerVisits';
import { resolveTherapyFamily, THERAPY_FAMILIES } from '@/lib/provider/therapyFamilies';
function Badge({
  tone,
  children,
}: {
  tone: 'green' | 'gray' | 'gold' | 'red' | 'blue';
  children: ReactNode;
}) {
  const map = {
    green: 'bg-green-100 text-green-800',
    gray: 'bg-cream-200 text-ink-600',
    gold: 'bg-gold-100 text-gold-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-sky-100 text-sky-800',
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
        Provider-directed prescriptions are fulfilled through the eligible GEN Health dispensing pharmacy selected for the prescription.
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
                      {(() => {
                        const pay = adminPaymentBadge(order.payment_status);
                        const clinical = adminClinicalBadge({
                          paymentStatus: order.payment_status,
                          genHandoffStatus: (order as { gen_handoff_status?: string | null })
                            .gen_handoff_status,
                          orderStatus: order.order_status,
                          requiresProviderReview: order.requires_provider_review,
                        });
                        return (
                          <>
                            <Badge tone={pay.tone}>{pay.label}</Badge>
                            {clinical ? <Badge tone={clinical.tone}>{clinical.label}</Badge> : null}
                            <Badge tone={actionRequired ? 'red' : 'gold'}>
                              {labelOrderStatus(order.order_status)}
                            </Badge>
                            {actionRequired ? <Badge tone="red">Action Required</Badge> : null}
                          </>
                        );
                      })()}
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
  const [confirmCrossTx, setConfirmCrossTx] = useState(false);
  const [confirmApproval, setConfirmApproval] = useState(false);
  const [approvalFamily, setApprovalFamily] = useState('');
  const [approvalProductId, setApprovalProductId] = useState('');
  const [approvalVariantId, setApprovalVariantId] = useState('');
  const [approvalSku, setApprovalSku] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [genBusy, setGenBusy] = useState(false);

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
    if (detail) {
      const rxItem =
        detail.items.find(i => i.fulfillment_sku) ||
        detail.items.find(i => i.sku && !String(i.sku).startsWith('MBM-PC-'));
      if (rxItem) {
        setApprovalProductId(rxItem.product_id || '');
        setApprovalVariantId(rxItem.variant_id || '');
        setApprovalSku(rxItem.fulfillment_sku || rxItem.sku || detail.requested_variant_sku || '');
        const family =
          resolveTherapyFamily({
            productId: rxItem.product_id,
            isMembership: Boolean(rxItem.fulfillment_sku),
          }) || '';
        setApprovalFamily(family);
      }
    }
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

  const markCrossTxDone = async () => {
    if (!supabase || !order || !confirmCrossTx) {
      setMsg('Confirm CrossTx appointment was completed outside MBM before updating status.');
      return;
    }
    setBusy(true);
    setMsg(null);
    const { error } = await adminMarkCrossTxAppointmentCompleted(
      supabase,
      order.id,
      adminEmail || adminUserId || 'admin',
    );
    setBusy(false);
    if (error) setMsg(error);
    else {
      setConfirmCrossTx(false);
      await load();
    }
  };

  const recordApproval = async () => {
    if (!supabase || !order || !confirmApproval) {
      setMsg('Confirm provider approval before recording therapy history.');
      return;
    }
    if (!order.customer_user_id) {
      setMsg('Order has no authenticated customer user id — cannot record therapy history.');
      return;
    }
    setBusy(true);
    setMsg(null);
    const { error } = await adminRecordProviderApproval(supabase, {
      customerUserId: order.customer_user_id,
      therapyFamily: approvalFamily,
      productId: approvalProductId,
      variantId: approvalVariantId,
      sku: approvalSku,
      sourceOrderId: order.id,
      approvedBy: adminUserId,
      notes: approvalNotes,
      confirm: true,
    });
    setBusy(false);
    if (error) setMsg(error);
    else {
      setConfirmApproval(false);
      setApprovalNotes('');
      await load();
    }
  };

  const refreshGenStatus = async (mode: 'refresh' | 'retry', orderGenOrderId?: string) => {
    if (!supabase || !order) return;
    setGenBusy(true);
    setMsg(null);
    const { data, error } = await supabase.functions.invoke('gen-health-sync', {
      body: {
        orderId: order.id,
        orderGenOrderId,
        mode,
      },
    });
    setGenBusy(false);
    if (error) {
      setMsg(error.message || 'GEN sync failed');
      return;
    }
    if (data && typeof data === 'object' && 'error' in data && data.error) {
      setMsg(String((data as { error: string }).error));
      return;
    }
    setMsg(mode === 'retry' ? 'GEN retry requested.' : 'GEN status refreshed.');
    await load();
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

        <section className="card-lux p-5 space-y-4 text-sm lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-serif text-xl text-ink-900">GEN clinical</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-outline !py-1 !px-3 text-xs"
                disabled={genBusy || busy || !canWrite}
                onClick={() => void refreshGenStatus('refresh')}
              >
                Refresh GEN status
              </button>
              <button
                type="button"
                className="btn-outline !py-1 !px-3 text-xs"
                disabled={genBusy || busy || !canWrite}
                onClick={() => void refreshGenStatus('retry')}
              >
                Retry GEN sync
              </button>
            </div>
          </div>
          <p className="text-xs text-ink-500">
            GEN is clinical source of truth. Payment authority remains Tagada. No Mark Approved /
            Mark Shipped clinical overrides here.
          </p>
          <dl className="grid gap-2 sm:grid-cols-2 text-xs">
            <div>
              <dt className="text-ink-400">MBM payment status</dt>
              <dd>{labelPaymentStatus(order.payment_status)}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Order rollup handoff</dt>
              <dd>{order.gen_handoff_status || '—'}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Tagada transaction</dt>
              <dd className="break-all">
                {order.external_payment_id ||
                  (order.gen_orders || []).find((g) => g.tagada_transaction_id)
                    ?.tagada_transaction_id ||
                  '—'}
              </dd>
            </div>
          </dl>
          {(order.gen_orders || []).length === 0 ? (
            <p className="text-xs text-ink-500">
              No GEN clinical rows for this order yet (handoff not started or non-Rx only).
            </p>
          ) : (
            <ul className="space-y-4">
              {(order.gen_orders || []).map((g) => {
                const item = order.items.find((i) => i.id === g.order_item_id);
                const actions = Array.isArray(g.required_actions_json)
                  ? (g.required_actions_json as Array<{ id?: string; type?: string; title?: string; status?: string }>)
                  : [];
                const denied = (g.clinical_status || '').toUpperCase() === 'GEN_DENIED';
                return (
                  <li key={g.id} className="rounded-xl border border-cream-300 bg-cream-50 p-3 space-y-2">
                    <p className="font-medium text-ink-900">
                      {item?.product_name_snapshot || g.mbm_sku}
                      {denied ? (
                        <span className="ml-2">
                          <Badge tone="red">follow-up / refund review</Badge>
                        </span>
                      ) : null}
                    </p>
                    <dl className="grid gap-1 sm:grid-cols-2 text-xs">
                      <div>
                        <dt className="text-ink-400">GEN patient ID</dt>
                        <dd className="break-all">{g.gen_patient_id || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-400">GEN order ID</dt>
                        <dd className="break-all">{g.gen_order_id || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-400">clientProductId</dt>
                        <dd className="break-all">{g.gen_client_product_id || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-400">Raw GEN status</dt>
                        <dd>{g.gen_order_status || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-400">Normalized clinical</dt>
                        <dd>{g.clinical_status || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-400">Handoff / retries</dt>
                        <dd>
                          {g.handoff_status || '—'} · attempts {g.attempt_count ?? 0}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-ink-400">Prescription</dt>
                        <dd>
                          {g.prescription_status || '—'}
                          {g.gen_prescription_id ? ` (${g.gen_prescription_id})` : ''}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-ink-400">Pharmacy</dt>
                        <dd>
                          {g.pharmacy_status || '—'}
                          {g.tracking_number ? ` · track ${g.tracking_number}` : ''}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-ink-400">Last sync</dt>
                        <dd>
                          {g.last_synced_at
                            ? new Date(g.last_synced_at).toLocaleString()
                            : '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-ink-400">Last safe error</dt>
                        <dd>
                          {g.last_error_code
                            ? `${g.last_error_code}${
                                g.last_error_message_safe ? `: ${g.last_error_message_safe}` : ''
                              }`
                            : '—'}
                        </dd>
                      </div>
                    </dl>
                    {actions.length ? (
                      <div>
                        <p className="text-xs text-ink-400 mb-1">requiredActions</p>
                        <ul className="text-xs space-y-1">
                          {actions.map((a, idx) => (
                            <li key={a.id || `ra-${idx}`}>
                              {[a.type, a.title, a.status].filter(Boolean).join(' · ') || 'action'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        className="btn-outline !py-1 !px-2 text-[11px]"
                        disabled={genBusy || !canWrite}
                        onClick={() => void refreshGenStatus('refresh', g.id)}
                      >
                        Refresh line
                      </button>
                      <button
                        type="button"
                        className="btn-outline !py-1 !px-2 text-[11px]"
                        disabled={genBusy || !canWrite}
                        onClick={() => void refreshGenStatus('retry', g.id)}
                      >
                        Retry line
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
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
          <h2 className="font-serif text-xl text-ink-900 mb-2">Provider appointment</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <p>
              <span className="text-ink-500">Provider Requirement:</span>{' '}
              {order.provider_requirement || '—'}
            </p>
            <p>
              <span className="text-ink-500">Provider Workflow Status:</span>{' '}
              {order.provider_workflow_status === 'MANUAL_ACTION_REQUIRED' ? (
                <Badge tone="gold">CrossTx: Manual Action Required</Badge>
              ) : (
                order.provider_workflow_status || '—'
              )}
            </p>
            <p className="sm:col-span-2">
              <span className="text-ink-500">Provider Requirement Reason:</span>{' '}
              {order.provider_requirement_reason || '—'}
            </p>
            <p>
              <span className="text-ink-500">Previous Variant SKU:</span>{' '}
              {order.previous_variant_sku || '—'}
            </p>
            <p>
              <span className="text-ink-500">Requested Variant SKU:</span>{' '}
              {order.requested_variant_sku || '—'}
            </p>
            <p>
              <span className="text-ink-500">Required Provider Visit:</span>{' '}
              {order.required_provider_product_id === 'pc1'
                ? INITIAL_PROVIDER_VISIT.name
                : order.required_provider_product_id === 'pc2'
                  ? FOLLOW_UP_PROVIDER_VISIT.name
                  : order.required_provider_product_id || '—'}
            </p>
            <p>
              <span className="text-ink-500">Provider Visit Charge:</span>{' '}
              {order.required_provider_product_id === 'pc1'
                ? formatCents(INITIAL_PROVIDER_VISIT.priceCents)
                : order.required_provider_product_id === 'pc2'
                  ? formatCents(FOLLOW_UP_PROVIDER_VISIT.priceCents)
                  : '—'}
            </p>
          </div>

          {order.provider_workflow_status === 'MANUAL_ACTION_REQUIRED' ||
          order.provider_workflow_status === 'ERROR' ? (
            <div className="rounded-xl border border-gold-300 bg-gold-50 p-3 space-y-2">
              <p className="font-medium text-ink-900">CrossTx — Manual Action Required</p>
              <p className="text-xs text-ink-600">
                Create/complete the appointment in CrossTx outside MBM. This action only updates MBM
                tracking — it does not create an appointment via API.
              </p>
              <label className="flex items-start gap-2 text-xs text-ink-600">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={confirmCrossTx}
                  onChange={e => setConfirmCrossTx(e.target.checked)}
                />
                I confirm the CrossTx appointment was completed outside My Bare Method.
              </label>
              <button
                className="btn-primary !py-1 !px-3 text-xs"
                disabled={busy || !confirmCrossTx || !canWrite}
                onClick={() => void markCrossTxDone()}
              >
                Mark CrossTx Appointment Completed
              </button>
            </div>
          ) : null}

          <div className="rounded-xl border border-cream-300 bg-cream-50 p-3 space-y-2">
            <p className="font-medium text-ink-900">Record Provider Approval</p>
            <p className="text-xs text-ink-500">
              Therapy history is the source of truth. Do not auto-approve from payment or
              fulfillment status. CrossTx is manual — this does not create an API appointment.
            </p>
            <div className="rounded-lg border border-cream-300 bg-white p-2 text-xs text-ink-700 space-y-1">
              <p>
                <span className="text-ink-500">Customer:</span> {order.customer_name || '—'} (
                {order.customer_email || '—'})
              </p>
              <p>
                <span className="text-ink-500">Source order:</span> {order.public_order_number}
              </p>
              <p>
                <span className="text-ink-500">Therapy family:</span> {approvalFamily || '—'}
              </p>
              <p>
                <span className="text-ink-500">Product / variant / SKU:</span>{' '}
                {approvalProductId || '—'} / {approvalVariantId || '—'} / {approvalSku || '—'}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block text-xs">
                Therapy family
                <select
                  className="input-lux mt-1 text-xs"
                  value={approvalFamily}
                  onChange={e => setApprovalFamily(e.target.value)}
                >
                  <option value="">Select…</option>
                  {THERAPY_FAMILIES.map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs">
                Approved SKU
                <input
                  className="input-lux mt-1 text-xs"
                  value={approvalSku}
                  onChange={e => setApprovalSku(e.target.value)}
                />
              </label>
              <label className="block text-xs">
                Product ID
                <input
                  className="input-lux mt-1 text-xs"
                  value={approvalProductId}
                  onChange={e => setApprovalProductId(e.target.value)}
                />
              </label>
              <label className="block text-xs">
                Variant ID
                <input
                  className="input-lux mt-1 text-xs"
                  value={approvalVariantId}
                  onChange={e => setApprovalVariantId(e.target.value)}
                />
              </label>
              <label className="block text-xs sm:col-span-2">
                Notes (optional)
                <input
                  className="input-lux mt-1 text-xs"
                  value={approvalNotes}
                  onChange={e => setApprovalNotes(e.target.value)}
                />
              </label>
            </div>
            <label className="flex items-start gap-2 text-xs text-ink-600">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={confirmApproval}
                onChange={e => setConfirmApproval(e.target.checked)}
              />
              I confirm a licensed provider approved this therapy/option for this customer.
            </label>
            <button
              className="btn-outline !py-1 !px-3 text-xs"
              disabled={busy || !confirmApproval || !canWrite || !approvalFamily || !approvalSku}
              onClick={() => void recordApproval()}
            >
              Record Provider Approval
            </button>
            {msg && msg.toLowerCase().includes('approval') ? (
              <p className="text-xs text-green-800">
                After a successful save, refresh to confirm Approved status in therapy history notes.
              </p>
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
