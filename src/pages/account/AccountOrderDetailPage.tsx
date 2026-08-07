import { useEffect, useState } from 'react';
import { Link } from '@/router';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { getCustomerOrderDetail } from '@/lib/orders/orderService';
import type { OrderWithDetails } from '@/lib/orders/orderTypes';
import { formatCents } from '@/lib/orders/orderTypes';
import {
  AGELESS_FULFILLMENT_COPY,
  AGELESS_PHARMACY_NAME,
  PROCESSING_POLICY_COPY,
  labelOrderStatus,
  labelPaymentStatus,
} from '@/lib/orders/orderStatus';
import { labelShippingMethod } from '@/lib/orders/shipping';
import { AccountShell } from './AccountShell';
import { OrderStatusTimeline } from './OrderStatusTimeline';
import { useAccountNoIndex } from './useAccountNoIndex';

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
              {order.fulfillment?.pharmacy_name === AGELESS_PHARMACY_NAME ||
              order.requires_provider_review ? (
                <div className="sm:col-span-2">
                  <p className="text-ink-500 text-xs leading-relaxed">{AGELESS_FULFILLMENT_COPY}</p>
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
