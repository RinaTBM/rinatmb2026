import { useState } from 'react';
import { Link } from '@/router';
import { Package, Heart, RefreshCw, Settings, LogOut, Truck, Clock, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

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

export function AccountPage() {
  const { items } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions' | 'rewards' | 'settings'>('orders');

  return (
    <div className="bg-cream-50 pt-28 md:pt-32 min-h-screen">
      <div className="container-lux py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="eyebrow mb-2">Welcome back</p>
          <h1 className="font-serif text-4xl text-ink-900">My Account</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
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

          {/* Content */}
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
              <div>
                <h2 className="font-serif text-2xl text-ink-900 mb-6">Subscriptions</h2>
                {items.filter(i => i.subscription).length === 0 ? (
                  <div className="card-lux p-8 text-center">
                    <RefreshCw size={32} className="mx-auto text-ink-300 mb-3" />
                    <p className="text-ink-500 mb-4">You have no active subscriptions.</p>
                    <Link to="/section/longevity" className="btn-primary">Start a Subscription</Link>
                  </div>
                ) : (
                  <p className="text-ink-500">Your subscriptions will appear here.</p>
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
                    <input type="email" defaultValue="member@mybaremethod.com" className="input-lux" />
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
