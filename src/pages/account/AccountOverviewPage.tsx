import { useEffect, useState } from 'react';
import { Link } from '@/router';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { listCustomerOrders } from '@/lib/orders/orderService';
import { labelOrderStatus } from '@/lib/orders/orderStatus';
import { AccountShell } from './AccountShell';
import { useAccountNoIndex } from './useAccountNoIndex';

export function AccountOverviewPage() {
  useAccountNoIndex('My Account | My Bare Method');
  const { user } = useCustomerAuth();
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [latestStatus, setLatestStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!supabase || !user) return;
      const { orders } = await listCustomerOrders(supabase, user.id);
      if (cancelled) return;
      setOrderCount(orders.length);
      setLatestStatus(orders[0]?.order_status ?? null);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <AccountShell active="overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          to="/account/orders"
          className="group rounded-2xl border border-cream-300 bg-white p-6 shadow-sm hover:border-gold-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 sm:col-span-2"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="font-serif text-xl text-ink-900">Orders</h2>
          </div>
          <p className="text-sm font-medium text-ink-800 mb-1">Recent Orders</p>
          <p className="text-sm text-ink-500 leading-relaxed mb-4">
            {orderCount == null
              ? 'View order history, fulfillment status, and shipping information.'
              : orderCount === 0
                ? 'No orders yet.'
                : latestStatus
                  ? `${orderCount} order${orderCount === 1 ? '' : 's'} · Latest: ${labelOrderStatus(latestStatus)}`
                  : `${orderCount} order${orderCount === 1 ? '' : 's'}`}
          </p>
          <span className="inline-flex text-sm font-medium text-ink-900 underline underline-offset-2 group-hover:text-gold-700">
            View Orders
          </span>
        </Link>

        <Link
          to="/account/subscriptions"
          className="group rounded-2xl border border-cream-300 bg-white p-6 shadow-sm hover:border-gold-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="font-serif text-xl text-ink-900">Subscriptions</h2>
            <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-gold-700 border border-gold-300 rounded-full px-2.5 py-1">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-ink-500 leading-relaxed">
            Review recurring prescription orders and subscription details.
          </p>
        </Link>

        <Link
          to="/account/requests"
          className="group rounded-2xl border border-cream-300 bg-white p-6 shadow-sm hover:border-gold-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="font-serif text-xl text-ink-900">Requests</h2>
            <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-gold-700 border border-gold-300 rounded-full px-2.5 py-1">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-ink-500 leading-relaxed">
            Submit refill, pause, or cancellation requests later.
          </p>
        </Link>

        <Link
          to="/account/profile"
          className="group rounded-2xl border border-cream-300 bg-white p-6 shadow-sm hover:border-gold-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
        >
          <h2 className="font-serif text-xl text-ink-900 mb-3">Profile</h2>
          <p className="text-sm text-ink-500 leading-relaxed">
            Update your name, phone, and account contact details.
          </p>
        </Link>
      </div>
    </AccountShell>
  );
}
