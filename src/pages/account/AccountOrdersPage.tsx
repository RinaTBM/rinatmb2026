import { useEffect, useMemo, useState } from 'react';
import { Link } from '@/router';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { supabase } from '@/lib/supabaseClient';
import {
  listCustomerOrders,
  listOrderItemsForOrders,
} from '@/lib/orders/orderService';
import type { OrderItemRecord, OrderRecord } from '@/lib/orders/orderTypes';
import { formatCents, productNamesSummary } from '@/lib/orders/orderTypes';
import { labelOrderStatus, labelPaymentStatus } from '@/lib/orders/orderStatus';
import { AccountShell } from './AccountShell';
import { useAccountNoIndex } from './useAccountNoIndex';

export function AccountOrdersPage() {
  useAccountNoIndex('My Orders | My Bare Method');
  const { user } = useCustomerAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [itemsByOrder, setItemsByOrder] = useState<Record<string, OrderItemRecord[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!supabase || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { orders: rows, error: err } = await listCustomerOrders(supabase, user.id);
      if (cancelled) return;
      if (err) {
        setError(err);
        setOrders([]);
        setLoading(false);
        return;
      }
      setOrders(rows);
      const { items, error: iErr } = await listOrderItemsForOrders(
        supabase,
        rows.map(r => r.id),
      );
      if (cancelled) return;
      if (iErr) setError(iErr);
      const map: Record<string, OrderItemRecord[]> = {};
      for (const item of items) {
        (map[item.order_id] ??= []).push(item);
      }
      setItemsByOrder(map);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <p className="text-sm text-ink-500" role="status">
          Loading your orders…
        </p>
      );
    }
    if (error) {
      return (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2" role="alert">
          {error}
        </p>
      );
    }
    if (orders.length === 0) {
      return (
        <div className="rounded-2xl border border-cream-300 bg-white p-8 md:p-10 text-center max-w-xl">
          <h2 className="font-serif text-2xl text-ink-900 mb-3">No Orders Yet</h2>
          <p className="text-ink-500 leading-relaxed mb-6">
            When you place an order with My Bare Method, you’ll be able to view its status and shipping
            information here.
          </p>
          <Link to="/memberships" className="btn-primary inline-flex">
            Explore Wellness
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map(order => {
          const items = itemsByOrder[order.id] ?? [];
          const trackingReady =
            order.order_status === 'shipped' || order.order_status === 'delivered';
          return (
            <article
              key={order.id}
              className="rounded-2xl border border-cream-300 bg-white p-5 md:p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-serif text-xl text-ink-900">{order.public_order_number}</h2>
                  <p className="text-sm text-ink-500 mt-1">
                    {new Date(order.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium text-ink-900">
                    {labelOrderStatus(order.order_status)}
                  </p>
                  <p className="text-xs text-ink-500">
                    Payment: {labelPaymentStatus(order.payment_status)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-ink-600 mb-2">
                {items.length > 0 ? productNamesSummary(items) : 'Order items'}
              </p>
              <p className="text-sm text-ink-800 font-medium mb-2">
                Total {formatCents(order.total_cents)}
              </p>
              <p className="text-xs text-ink-500 mb-4">
                Fulfillment: {labelOrderStatus(order.order_status)}
                {trackingReady ? ' · Tracking available' : ''}
              </p>

              <Link
                to={`/account/orders/${order.id}`}
                className="inline-flex rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-800 hover:border-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              >
                View Details
              </Link>
            </article>
          );
        })}
      </div>
    );
  }, [loading, error, orders, itemsByOrder]);

  return (
    <AccountShell active="orders">
      <div className="mb-8 max-w-2xl">
        <h2 className="font-serif text-2xl md:text-3xl text-ink-900 mb-3">My Orders</h2>
        <p className="text-ink-500 leading-relaxed">
          View your recent orders, fulfillment status, and shipping information.
        </p>
      </div>
      {content}
    </AccountShell>
  );
}
