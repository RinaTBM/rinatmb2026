import { useEffect, useState } from 'react';
import { Link } from '@/router';
import {
  Package, Heart, RefreshCw, Settings, LogOut, Truck, Clock, CheckCircle, Crown, FileText,
} from 'lucide-react';
import { useMember } from '@/context/MemberContext';
import {
  SEMAGLUTIDE_MEMBERSHIP_MONTHLY,
  TIRZEPATIDE_MEMBERSHIP_MONTHLY,
} from '@/lib/pricing/weightMembership';
import {
  CANCELLATION_POLICY_COPY,
  listCancellationRequests,
  listManagedSubscriptions,
  submitCancellationRequest,
  type CancellationRequest,
  type ManagedSubscription,
} from '@/lib/account/subscriptions';

const mockOrders = [
  { id: 'MBM-A8K3F2', date: '2026-07-15', status: 'delivered', total: 122.00, items: 2, tracking: '1Z999AA10123456784' },
  { id: 'MBM-B2X9M4', date: '2026-07-22', status: 'shipped', total: 195.00, items: 1, tracking: '1Z999AA10123456790' },
  { id: 'MBM-C7P1Q8', date: '2026-07-26', status: 'processing', total: 68.00, items: 1, tracking: null },
];

const statusConfig = {
  processing: { label: 'Processing', icon: Clock, color: 'text-gold-600', bg: 'bg-gold-100' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
};

const cancelStatusLabel: Record<CancellationRequest['status'], string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  processed: 'Processed',
  cancellation_confirmed: 'Cancellation Confirmed',
  blocked_minimum_term: 'Blocked (3-month minimum)',
};

export function AccountPage() {
  const member = useMember();
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions' | 'rewards' | 'settings'>('subscriptions');
  const [subs, setSubs] = useState<ManagedSubscription[]>([]);
  const [cancels, setCancels] = useState<CancellationRequest[]>([]);
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const refresh = () => {
    setSubs(listManagedSubscriptions());
    setCancels(listCancellationRequests());
  };

  useEffect(() => { refresh(); }, [member.isActiveMember]);

  const memberships = subs.filter(s => s.kind === 'active_wellness_membership');
  const autoRefills = subs.filter(s => s.kind === 'auto_refill');

  const handleCancel = (subscription: ManagedSubscription) => {
    const result = submitCancellationRequest({
      subscription,
      customerEmail: email,
      customerNote: note || undefined,
    });
    if ('ok' in result && result.ok === false) {
      setMessage(result.error);
      return;
    }
    setNote('');
    setMessage('Cancellation request submitted. Our team will review and process it. This does not automatically end the current billing period or reverse a payment that has already been received.');
    refresh();
  };

  return (
    <div className="bg-cream-50 pt-28 md:pt-32 min-h-screen">
      <div className="container-lux py-8 md:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Welcome back</p>
            <h1 className="font-serif text-4xl text-ink-900">My Account</h1>
          </div>
          {member.isActiveMember && (
            <div className="rounded-full bg-gold-100 px-4 py-2 text-sm text-gold-800 flex items-center gap-2">
              <Crown size={16} /> Active Wellness Member · Save 15% on products and accessories
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside>
            <nav className="space-y-1">
              {([
                { id: 'orders', label: 'Orders', icon: Package },
                { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
                { id: 'rewards', label: 'Rewards', icon: Heart },
                { id: 'settings', label: 'Settings', icon: Settings },
              ] as const).map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === item.id ? 'bg-ink-900 text-cream-50' : 'text-ink-600 hover:bg-cream-200'
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
              <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink-400 hover:bg-cream-200 transition-colors">
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </aside>

          <div>
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-serif text-2xl text-ink-900 mb-6">Order History</h2>
                <div className="space-y-4">
                  {mockOrders.map(order => {
                    const status = statusConfig[order.status as keyof typeof statusConfig];
                    return (
                      <div key={order.id} className="card-lux p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-medium text-ink-900">#{order.id}</span>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.color}`}>
                                <status.icon size={12} /> {status.label}
                              </span>
                            </div>
                            <p className="text-sm text-ink-400">Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-sm text-ink-500 mt-1">{order.items} item(s) · ${order.total.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            {order.tracking && (
                              <Link to="/track" className="btn-ghost text-xs">Track Order</Link>
                            )}
                            <button className="btn-ghost text-xs">View Details</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl text-ink-900 mb-2">Active Wellness Membership</h2>
                  <p className="text-sm text-ink-500 mb-4">Members receive our best available pricing on eligible wellness products.</p>
                  {memberships.length === 0 && !member.isActiveMember ? (
                    <div className="card-lux p-6 text-center">
                      <Crown size={28} className="mx-auto text-ink-300 mb-3" />
                      <p className="text-ink-500 mb-4">You do not have an Active Wellness Membership.</p>
                      <Link to="/memberships" className="btn-primary">Become a Member</Link>
                      <div className="mt-4 pt-4 border-t border-cream-200">
                        <button
                          type="button"
                          className="text-xs text-gold-700 underline"
                          onClick={() => member.setDemoActiveMember(true, 'tirzepatide')}
                        >
                          Demo: simulate active Tirzepatide membership (for pricing tests)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="card-lux p-5 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-ink-900">{member.displayName ?? memberships[0]?.name}</p>
                          <p className="text-sm text-gold-700">
                            Status: {(memberships[0]?.status ?? 'active').replace(/_/g, ' ')}
                            {memberships[0]?.status === 'active' || !memberships[0]
                              ? ' · Preferred Member Pricing (15% on eligible products and accessories)'
                              : ''}
                          </p>
                          <p className="text-sm text-ink-500">
                            Monthly price:{' '}
                            $
                            {(
                              memberships[0]?.monthlyAmountCents != null
                                ? memberships[0].monthlyAmountCents / 100
                                : memberships[0]?.unitPrice ??
                                  (member.program === 'semaglutide'
                                    ? SEMAGLUTIDE_MEMBERSHIP_MONTHLY
                                    : TIRZEPATIDE_MEMBERSHIP_MONTHLY)
                            ).toFixed(0)}
                            /month
                          </p>
                          <p className="text-sm text-ink-500">
                            Next billing:{' '}
                            {new Date(
                              memberships[0]?.nextBillingAt ??
                                member.renewalDate ??
                                memberships[0]?.renewalDate ??
                                Date.now(),
                            ).toLocaleDateString()}
                          </p>
                          {memberships[0]?.minimumTermEndsAt ? (
                            <p className="text-sm text-ink-500">
                              Minimum commitment ends:{' '}
                              {new Date(memberships[0].minimumTermEndsAt).toLocaleDateString()}
                            </p>
                          ) : (
                            <p className="text-sm text-ink-500">
                              3-month minimum commitment applies from membership start.
                            </p>
                          )}
                          {memberships[0]?.cancelScheduledAt ? (
                            <p className="text-sm text-ink-500">
                              Cancellation scheduled:{' '}
                              {new Date(memberships[0].cancelScheduledAt).toLocaleDateString()}
                            </p>
                          ) : null}
                        </div>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          {(memberships[0]?.status ?? 'active').replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-ink-500">Customers cannot modify medication strength or provider-directed treatment from this portal. Full server-backed membership portal sync is a follow-up phase.</p>
                      <div className="flex flex-wrap gap-2">
                        <Link to="/track" className="btn-outline text-xs inline-flex items-center gap-1">
                          <FileText size={14} /> Payment Status
                        </Link>
                        {(memberships[0] || member.isActiveMember) && (
                          <button
                            type="button"
                            className="btn-ghost text-xs"
                            onClick={() => {
                              const sub = memberships[0] ?? {
                                id: `mem_${member.checkoutProductId ?? 'm2'}`,
                                kind: 'active_wellness_membership' as const,
                                name: member.displayName ?? 'Active Wellness Membership',
                                productId: member.checkoutProductId ?? 'm2',
                                slug: member.program === 'semaglutide' ? 'semaglutide-membership' : 'tirzepatide-membership',
                                unitPrice: member.program === 'semaglutide' ? SEMAGLUTIDE_MEMBERSHIP_MONTHLY : TIRZEPATIDE_MEMBERSHIP_MONTHLY,
                                standardPrice: member.program === 'semaglutide' ? SEMAGLUTIDE_MEMBERSHIP_MONTHLY : TIRZEPATIDE_MEMBERSHIP_MONTHLY,
                                discountPercent: 0,
                                billingFrequency: 'monthly' as const,
                                renewalDate: member.renewalDate ?? new Date().toISOString(),
                                status: 'active' as const,
                                createdAt: new Date().toISOString(),
                              };
                              handleCancel(sub);
                            }}
                          >
                            Submit Cancellation Request
                          </button>
                        )}
                        <button type="button" className="btn-ghost text-xs" onClick={() => member.setDemoActiveMember(false)}>
                          Clear demo membership
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="font-serif text-2xl text-ink-900 mb-2">Auto-Refill Subscriptions</h2>
                  {autoRefills.length === 0 ? (
                    <div className="card-lux p-6 text-center">
                      <RefreshCw size={28} className="mx-auto text-ink-300 mb-3" />
                      <p className="text-ink-500 mb-4">You have no Auto-Refill subscriptions.</p>
                      <Link to="/shop-all" className="btn-primary">Shop Auto-Refill & Save</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {autoRefills.map(sub => (
                        <div key={sub.id} className="card-lux p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-ink-900">{sub.name}</p>
                              <p className="text-sm text-ink-500">
                                ${sub.unitPrice.toFixed(2)}/mo
                                {sub.discountPercent > 0 ? ` · Save ${sub.discountPercent}%` : ''}
                              </p>
                              <p className="text-sm text-ink-500">Renewal: {new Date(sub.renewalDate).toLocaleDateString()}</p>
                              <p className="text-xs text-ink-400 mt-1">Status: {sub.status.replace('_', ' ')}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Link to="/track" className="btn-outline text-xs inline-flex items-center gap-1">
                                <FileText size={14} /> View Payment Instructions
                              </Link>
                              {sub.status === 'active' && (
                                <button type="button" className="btn-ghost text-xs" onClick={() => handleCancel(sub)}>
                                  Submit Cancellation Request
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-cream-300 bg-white p-5">
                  <h3 className="font-medium text-ink-900 mb-2">Cancellation Request Policy</h3>
                  <p className="text-sm text-ink-600 leading-relaxed mb-4">{CANCELLATION_POLICY_COPY}</p>
                  <p className="text-xs text-ink-500 mb-3">
                    The 7-day notice is a customer communication policy so our team can process your request before the
                    next billing period. Cancellation requests are reviewed manually and do not automatically reverse
                    prior card charges.
                  </p>
                  <label className="block text-xs text-ink-500 mb-1">Email for confirmation</label>
                  <input className="input-lux mb-3" value={email} onChange={e => setEmail(e.target.value)} />
                  <label className="block text-xs text-ink-500 mb-1">Optional note</label>
                  <textarea className="input-lux" rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Optional message for our team" />
                  {message && <p className="mt-3 text-sm text-gold-700">{message}</p>}
                </div>

                {cancels.length > 0 && (
                  <div>
                    <h3 className="font-serif text-xl text-ink-900 mb-3">Cancellation Requests</h3>
                    <div className="space-y-2">
                      {cancels.map(c => (
                        <div key={c.id} className="rounded-xl border border-cream-300 bg-white px-4 py-3 text-sm flex flex-wrap justify-between gap-2">
                          <div>
                            <p className="font-medium text-ink-900">{c.subscriptionName}</p>
                            <p className="text-xs text-ink-500">Submitted {new Date(c.submittedAt).toLocaleString()}</p>
                          </div>
                          <span className="rounded-full bg-cream-200 px-3 py-1 text-xs text-ink-700">{cancelStatusLabel[c.status]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rewards' && (
              <div>
                <h2 className="font-serif text-2xl text-ink-900 mb-6">Rewards</h2>
                <div className="card-lux p-8 text-center bg-gradient-to-br from-nude-100 to-cream-200">
                  <Heart size={32} className="mx-auto text-gold-500 mb-3" />
                  <p className="font-serif text-3xl text-ink-900 mb-1">1,250 points</p>
                  <p className="text-sm text-ink-500 mb-4">You are 250 points away from your next reward.</p>
                  <div className="mx-auto max-w-xs">
                    <div className="h-2 rounded-full bg-cream-300 overflow-hidden">
                      <div className="h-full rounded-full bg-gold-400" style={{ width: '83%' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="font-serif text-2xl text-ink-900 mb-6">Account Settings</h2>
                <div className="card-lux p-6 space-y-4">
                  <div>
                    <label className="text-sm text-ink-500 block mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-lux" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-ink-500 block mb-1">First name</label>
                      <input type="text" defaultValue="" placeholder="First name" className="input-lux" />
                    </div>
                    <div>
                      <label className="text-sm text-ink-500 block mb-1">Last name</label>
                      <input type="text" defaultValue="" placeholder="Last name" className="input-lux" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-ink-500 block mb-1">Address</label>
                    <input type="text" placeholder="Shipping address" className="input-lux" />
                  </div>
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
