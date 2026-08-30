import { useEffect, useState } from 'react';
import { Link } from '@/router';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { getCustomerOrderDetail } from '@/lib/orders/orderService';
import type { OrderWithDetails } from '@/lib/orders/orderTypes';
import { formatCents } from '@/lib/orders/orderTypes';
import {
  PHARMACY_FULFILLMENT_COPY,
  PROCESSING_POLICY_COPY,
  labelOrderStatus,
  labelPaymentStatus,
} from '@/lib/orders/orderStatus';
import { labelShippingMethod } from '@/lib/orders/shipping';
import { resolveClinicalLinesForOrder } from '@/lib/commerce/clinicalNextSteps';
import {
  CLINICAL_JOURNEY_STAGES,
  journeyStageFromPortal,
  isJourneyStageReached,
} from '@/lib/genHealth/clinicalJourney';
import { customerActionLabel } from '@/lib/genHealth/genForms';
import { AccountShell } from './AccountShell';
import { OrderStatusTimeline } from './OrderStatusTimeline';
import { useAccountNoIndex } from './useAccountNoIndex';

function isPortalRxSku(sku: string | null | undefined): boolean {
  if (!sku?.trim()) return false;
  const s = sku.trim().toUpperCase();
  if (s.includes('IPV') || s.includes('FUV') || s.includes('LAB') || s.includes('VISIT')) return false;
  if (s.includes('CASE') || s.includes('ACCESSORY') || s.includes('SERUM')) return false;
  if (s.includes('MEMBER') || s.includes('SUBSCR')) return false;
  return (
    s.startsWith('MBM-WM-') ||
    s.startsWith('MBM-HRT-') ||
    s.startsWith('MBM-LON-') ||
    s.startsWith('MBM-RP-') ||
    s.startsWith('MBM-SH-')
  );
}

type AccountOrderDetailPageProps = {
  orderId: string;
};

export function AccountOrderDetailPage({ orderId }: AccountOrderDetailPageProps) {
  useAccountNoIndex('Order Details | My Bare Method');
  const { user } = useCustomerAuth();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!supabase || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { order: detail, error: err } = await getCustomerOrderDetail(
        supabase,
        user.id,
        orderId,
      );
      if (cancelled) return;
      if (err) {
        setError(err);
        setOrder(null);
      } else if (!detail) {
        setNotFound(true);
        setOrder(null);
      } else {
        setOrder(detail);
        setNotFound(false);
      }
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user, orderId]);

  return (
    <AccountShell active="orders">
      <div className="mb-6">
        <Link
          to="/account/orders"
          className="text-sm text-ink-500 hover:text-ink-900 underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
        >
          Back to My Orders
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-ink-500" role="status">
          Loading order…
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2" role="alert">
          {error}
        </p>
      ) : null}
      {notFound ? (
        <div className="rounded-2xl border border-cream-300 bg-white p-8 max-w-xl">
          <h2 className="font-serif text-2xl text-ink-900 mb-3">Order not found</h2>
          <p className="text-ink-500 mb-4">
            This order is unavailable. It may belong to another account or the link may be incorrect.
          </p>
          <Link to="/account/orders" className="btn-outline inline-flex">
            View your orders
          </Link>
        </div>
      ) : null}

      {order ? (
        <div className="space-y-8 max-w-3xl">
          <header>
            <h2 className="font-serif text-2xl md:text-3xl text-ink-900 mb-2">
              {order.public_order_number}
            </h2>
            <p className="text-ink-500 text-sm">
              Placed{' '}
              {new Date(order.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </header>

          <section className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm" aria-labelledby="order-summary-heading">
            <h3 id="order-summary-heading" className="font-serif text-xl text-ink-900 mb-4">
              Order Summary
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-ink-400">Order number</dt>
                <dd className="text-ink-900 font-medium">{order.public_order_number}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Order status</dt>
                <dd className="text-ink-900 font-medium">{labelOrderStatus(order.order_status)}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Payment status</dt>
                <dd className="text-ink-900">{labelPaymentStatus(order.payment_status)}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Total</dt>
                <dd className="text-ink-900 font-medium">{formatCents(order.total_cents)}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Shipping option</dt>
                <dd className="text-ink-900">{labelShippingMethod(order.shipping_method)}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Shipping amount</dt>
                <dd className="text-ink-900">{formatCents(order.shipping_cents)}</dd>
              </div>
              {order.discount_cents > 0 ? (
                <div>
                  <dt className="text-ink-400">Discounts</dt>
                  <dd className="text-ink-900">−{formatCents(order.discount_cents)}</dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-6 border-t border-cream-200 pt-4">
              <h4 className="text-sm font-medium text-ink-800 mb-3">Products purchased</h4>
              <ul className="space-y-3">
                {order.items.map(item => (
                  <li key={item.id} className="flex justify-between gap-4 text-sm">
                    <div>
                      <p className="text-ink-900 font-medium">{item.product_name_snapshot}</p>
                      {item.variant_snapshot ? (
                        <p className="text-ink-500 text-xs">{item.variant_snapshot}</p>
                      ) : null}
                      <p className="text-ink-500 text-xs">Qty {item.quantity}</p>
                    </div>
                    <p className="text-ink-800 shrink-0">{formatCents(item.line_total_cents)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {(() => {
            const genUiEnabled = import.meta.env.VITE_GEN_CLINICAL_UI_ENABLED === 'true';
            const genByItem = new Map(
              (order.gen_orders || []).map((g) => [g.order_item_id, g]),
            );
            const rxLines = order.items
              .filter((item) => isPortalRxSku(item.fulfillment_sku || item.sku))
              .map((item) => {
                const g = genByItem.get(item.id);
                const actions = Array.isArray(g?.required_actions_json)
                  ? (g!.required_actions_json as Array<Record<string, unknown>>)
                  : [];
                return {
                  orderItemId: item.id,
                  mbmSku: item.fulfillment_sku || item.sku,
                  productName: item.product_name_snapshot,
                  clinicalStatus: g?.clinical_status ?? order.gen_handoff_status ?? null,
                  requiredActions: actions,
                  pharmacyStatus: g?.pharmacy_status ?? null,
                  trackingNumber: g?.tracking_number ?? null,
                };
              });
            if (rxLines.length === 0) return null;
            const clinical = resolveClinicalLinesForOrder({
              paymentStatus: order.payment_status,
              genUiEnabled,
              lines: rxLines,
            });
            if (!clinical.applicable) return null;
            return (
              <section
                className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm"
                aria-labelledby="clinical-next-heading"
              >
                <h3 id="clinical-next-heading" className="font-serif text-xl text-ink-900 mb-3">
                  Your care journey
                </h3>
                <p className="text-xs text-ink-400 mb-4">
                  Status updates come from your My Bare Method care workflow after payment. We do
                  not invent medical questions or mark steps complete from this page.
                </p>
                <ul className="space-y-6">
                  {clinical.lines.map((line) => {
                    const journey = journeyStageFromPortal(line.portalStage);
                    return (
                    <li key={line.orderItemId} className="rounded-xl border border-cream-200 p-4">
                      <p className="text-sm font-medium text-ink-900 mb-1">
                        {line.productName || line.mbmSku || 'Prescription item'}
                      </p>
                      <p className="text-sm text-ink-800">{line.headline}</p>
                      <p className="text-xs text-ink-500 mt-1 mb-3">{line.body}</p>
                      <ol className="flex flex-wrap gap-2 mb-3" aria-label="Care journey progress">
                        {CLINICAL_JOURNEY_STAGES.map(({ id, label }) => {
                          const reached = isJourneyStageReached(journey, id);
                          return (
                            <li
                              key={id}
                              className={`text-[11px] rounded-full px-2.5 py-1 border ${
                                reached
                                  ? 'border-ink-800 bg-ink-900 text-cream-50'
                                  : 'border-cream-300 text-ink-400'
                              }`}
                            >
                              {label}
                            </li>
                          );
                        })}
                      </ol>
                      {line.requiredActions.length ? (
                        <ul className="space-y-2">
                          {line.requiredActions.map((card) => (
                            <li
                              key={card.id}
                              className="rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-left"
                            >
                              <p className="text-sm font-medium text-ink-900">
                                {customerActionLabel(card.category) || card.title}
                              </p>
                              <p className="text-xs text-ink-500 mt-1">{card.description}</p>
                              {card.continuationUrl ? (
                                <a
                                  href={card.continuationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex mt-2 text-xs font-medium text-ink-900 underline underline-offset-2"
                                >
                                  Continue
                                </a>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {line.trackingNumber ? (
                        <p className="text-xs text-ink-600 mt-3">
                          Tracking: {line.trackingNumber}
                        </p>
                      ) : null}
                    </li>
                    );
                  })}
                </ul>
              </section>
            );
          })()}

          <section className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm" aria-labelledby="fulfillment-heading">
            <h3 id="fulfillment-heading" className="font-serif text-xl text-ink-900 mb-4">
              Fulfillment
            </h3>
            <p className="text-sm text-ink-700 mb-2">
              Current status:{' '}
              <span className="font-medium">
                {labelOrderStatus(order.fulfillment?.fulfillment_status ?? order.order_status)}
              </span>
            </p>
            <p className="text-xs text-ink-500 mb-6">{PROCESSING_POLICY_COPY}</p>

            <OrderStatusTimeline
              currentStatus={order.fulfillment?.fulfillment_status ?? order.order_status}
              requiresProviderReview={order.requires_provider_review}
            />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {order.fulfillment?.processing_started_at ? (
                <div>
                  <p className="text-ink-400">Processing started</p>
                  <p className="text-ink-900">
                    {new Date(order.fulfillment.processing_started_at).toLocaleString()}
                  </p>
                </div>
              ) : null}
              {order.fulfillment?.shipped_at ? (
                <div>
                  <p className="text-ink-400">Shipment date</p>
                  <p className="text-ink-900">
                    {new Date(order.fulfillment.shipped_at).toLocaleString()}
                  </p>
                </div>
              ) : null}
              {order.fulfillment?.delivered_at ? (
                <div>
                  <p className="text-ink-400">Delivery date</p>
                  <p className="text-ink-900">
                    {new Date(order.fulfillment.delivered_at).toLocaleString()}
                  </p>
                </div>
              ) : null}
              {order.requires_provider_review ? (
                <div className="sm:col-span-2">
                  <p className="text-ink-500 text-xs leading-relaxed">{PHARMACY_FULFILLMENT_COPY}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-6 border-t border-cream-200 pt-4">
              {order.fulfillment?.tracking_number ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-ink-900">Shipped</p>
                  <p className="text-sm text-ink-600">
                    Carrier: {order.fulfillment.carrier ?? '—'}
                  </p>
                  <p className="text-sm text-ink-600">
                    Tracking: {order.fulfillment.tracking_number}
                  </p>
                  {order.fulfillment.tracking_url ? (
                    <a
                      href={order.fulfillment.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex mt-2 rounded-full bg-ink-900 text-cream-50 px-5 py-2.5 text-sm font-medium hover:bg-ink-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
                      aria-label={`Track package ${order.fulfillment.tracking_number} with ${order.fulfillment.carrier ?? 'carrier'}`}
                    >
                      Track Package
                    </a>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-ink-500">
                  Tracking information will appear here once your order ships.
                </p>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </AccountShell>
  );
}
