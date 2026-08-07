import { useState } from 'react';
import { Link } from '@/router';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';

const mockTracking = {
  orderNumber: 'MBM-B2X9M4',
  carrier: 'UPS',
  trackingNumber: '1Z999AA10123456790',
  estimatedDelivery: 'July 30, 2026',
  stages: [
    { label: 'Order Placed', date: 'July 22, 2026 · 2:14 PM', completed: true },
    { label: 'Processing', date: 'July 23, 2026 · 9:00 AM', completed: true },
    { label: 'Shipped', date: 'July 24, 2026 · 11:30 AM', completed: true },
    { label: 'In Transit', date: 'July 26, 2026 · 8:15 AM', completed: true },
    { label: 'Out for Delivery', date: 'Expected July 30', completed: false },
    { label: 'Delivered', date: 'Expected July 30', completed: false },
  ],
};

export function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) setSearched(true);
  };

  return (
    <div className="bg-cream-50 pt-28 md:pt-32 min-h-screen">
      <div className="container-lux py-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-2">Order Status</p>
          <h1 className="font-serif text-4xl text-ink-900 mb-3">Track Your Order</h1>
          <p className="text-ink-500 max-w-md mx-auto">Enter your order number to see real-time tracking and delivery updates.</p>
        </div>

        <form onSubmit={handleSearch} className="mx-auto mb-10 flex max-w-md gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Order number (e.g. MBM-B2X9M4)"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              className="input-lux pl-11"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          </div>
          <button type="submit" className="btn-primary">Track</button>
        </form>

        {searched && (
          <div className="mx-auto max-w-2xl">
            <div className="card-lux p-6 md:p-8">
              {/* Order header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-cream-300">
                <div>
                  <p className="text-sm text-ink-400">Order Number</p>
                  <p className="font-serif text-2xl text-ink-900">#{mockTracking.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-ink-400">Estimated Delivery</p>
                  <p className="font-medium text-ink-900">{mockTracking.estimatedDelivery}</p>
                </div>
              </div>

              {/* Tracking number */}
              <div className="mb-8 flex items-center gap-2 rounded-xl bg-cream-100 p-3 text-sm">
                <Truck size={16} className="text-gold-500" />
                <span className="text-ink-500">{mockTracking.carrier} Tracking:</span>
                <span className="font-medium text-ink-900">{mockTracking.trackingNumber}</span>
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {mockTracking.stages.map((stage, i) => (
                  <div key={i} className="flex gap-4 pb-8 last:pb-0 relative">
                    {/* Line */}
                    {i < mockTracking.stages.length - 1 && (
                      <div className={`absolute left-[15px] top-8 h-full w-0.5 ${stage.completed ? 'bg-gold-400' : 'bg-cream-300'}`} />
                    )}
                    {/* Icon */}
                    <div className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      stage.completed ? 'bg-gold-400 text-ink-900' : 'bg-cream-200 text-ink-300'
                    }`}>
                      {stage.completed ? <CheckCircle size={16} /> : <Clock size={16} />}
                    </div>
                    {/* Content */}
                    <div className="pt-1">
                      <p className={`font-medium ${stage.completed ? 'text-ink-900' : 'text-ink-400'}`}>{stage.label}</p>
                      <p className="text-sm text-ink-400">{stage.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="mt-6 flex items-start gap-2 rounded-xl bg-cream-100 p-4 text-sm text-ink-600">
                <MapPin size={18} className="flex-shrink-0 mt-0.5 text-ink-400" />
                <div>
                  <p className="font-medium text-ink-800">Shipping to</p>
                  <p>15115 Cedar Ave Suite 33</p>
                  <p>Apple Valley, MN 55124</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/account" className="btn-ghost">Back to Account <ArrowRight size={14} /></Link>
            </div>
          </div>
        )}

        {!searched && (
          <div className="mx-auto max-w-md text-center">
            <Package size={48} className="mx-auto text-ink-200 mb-4" />
            <p className="text-ink-400">Your tracking details will appear here once you search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
