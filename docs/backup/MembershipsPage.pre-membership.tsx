import { Check, Lock, Sparkles, ArrowRight, TrendingDown, Calendar, Stethoscope, Tag, X } from 'lucide-react';
import { Link } from '@/router';
import { memberships } from '@/data/products';
import { useCart } from '@/context/CartContext';

const comparisonRows = [
  { feature: 'Monthly Subscription', membership: true, onetime: false },
  { feature: 'One-Time Purchase', membership: false, onetime: true },
  { feature: '3-Month Commitment', membership: 'Required', onetime: 'None' },
  { feature: 'Locked Pricing', membership: true, onetime: false },
  { feature: 'Discount on Accessories', membership: true, onetime: false },
  { feature: 'Exclusive Member Pricing', membership: true, onetime: false },
  { feature: 'Priority Processing', membership: true, onetime: false },
  { feature: 'Order Anytime', membership: true, onetime: true },
  { feature: 'Provider Approval When Required', membership: true, onetime: 'When applicable' },
];

export function MembershipsPage() {
  const { addItem } = useCart();

  const handleJoin = (m: typeof memberships[0]) => {
    addItem({
      productId: m.id,
      slug: m.id,
      name: m.name,
      price: m.price,
      image: '',
      subscription: true,
      section: 'membership',
      requiresIntake: true,
    });
  };

  return (
    <div className="bg-cream-50 pt-16 md:pt-20">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <div className="container-lux max-w-2xl">
          <p className="eyebrow mb-3">Memberships</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-4">Locked-In Pricing, Lasting Care</h1>
          <p className="text-ink-500 mb-8">
            Choose a membership and secure your pricing for as long as you remain active. Monthly fulfillment,
            provider support, and member-only benefits — all included.
          </p>
        </div>
      </section>

      {/* Membership cards */}
      <section className="pb-16 md:pb-20">
        <div className="container-lux">
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {memberships.map(m => (
              <div
                key={m.id}
                className={`relative card-lux p-8 flex flex-col ${
                  m.highlighted ? 'ring-2 ring-gold-400 shadow-lg' : ''
                }`}
              >
                {m.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-400 px-4 py-1 text-xs font-semibold text-ink-900 whitespace-nowrap">
                    Most Popular
                  </span>
                )}
                <div className="mb-4">
                  <h2 className="font-serif text-2xl text-ink-900 mb-1">{m.name}</h2>
                  <p className="text-sm text-ink-500">{m.tagline}</p>
                </div>
                <div className="mb-6">
                  {m.price > 0 ? (
                    <>
                      <span className="font-serif text-4xl text-ink-900">${m.price}</span>
                      <span className="text-ink-500 ml-1">{m.priceLabel}</span>
                    </>
                  ) : (
                    <span className="font-serif text-2xl text-ink-900">Starting at $—/month</span>
                  )}
                </div>
                <p className="text-sm text-ink-500 mb-6">{m.description}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {m.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <Check size={16} className="flex-shrink-0 mt-0.5 text-gold-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleJoin(m)}
                  className={`btn-primary w-full ${m.highlighted ? '' : 'btn-outline'}`}
                >
                  {m.price > 0 ? `Join for $${m.price}/mo` : 'Learn More'} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessory discount highlight */}
      <section className="pb-12">
        <div className="container-lux max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-r from-gold-50 to-cream-100 border border-gold-200 p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Tag size={24} className="text-gold-600" />
              <h3 className="font-serif text-2xl text-ink-900">Members Save on All Accessories</h3>
            </div>
            <p className="text-ink-500 max-w-lg mx-auto">
              Active members automatically receive a discount on every accessory in our catalog — from travel cases to injection kits. The discount is applied automatically at checkout.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 md:py-20 bg-cream-100/50">
        <div className="container-lux max-w-4xl">
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">Compare your options</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-3">Membership vs. One-Time Purchase</h2>
            <p className="text-ink-500 max-w-xl mx-auto">
              Two ways to get your wellness products. Memberships lock in your price long-term with exclusive
              benefits — one-time purchases offer flexibility with no commitment.
            </p>
          </div>

          <div className="card-lux overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-3 bg-ink-900 text-cream-50">
              <div className="p-4 text-sm font-medium">Feature</div>
              <div className="p-4 text-sm font-medium text-center bg-gold-400/20">
                <Sparkles size={14} className="inline mr-1 text-gold-400" /> Membership
              </div>
              <div className="p-4 text-sm font-medium text-center">One-Time Purchase</div>
            </div>
            {/* Body rows */}
            {comparisonRows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white' : 'bg-cream-50'} border-t border-cream-200`}
              >
                <div className="p-4 text-sm text-ink-700 font-medium">{row.feature}</div>
                <div className="p-4 text-sm text-center bg-gold-50/30">
                  {typeof row.membership === 'boolean' ? (
                    row.membership ? (
                      <Check size={16} className="mx-auto text-gold-600" />
                    ) : (
                      <X size={16} className="mx-auto text-ink-300" />
                    )
                  ) : (
                    <span className="text-ink-800 font-medium">{row.membership}</span>
                  )}
                </div>
                <div className="p-4 text-sm text-center">
                  {typeof row.onetime === 'boolean' ? (
                    row.onetime ? (
                      <Check size={16} className="mx-auto text-ink-600" />
                    ) : (
                      <X size={16} className="mx-auto text-ink-300" />
                    )
                  ) : (
                    <span className="text-ink-600">{row.onetime}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Locked pricing highlight */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="card-lux p-6 flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                <Lock size={22} className="text-gold-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-ink-900 mb-1">Locked Pricing</h3>
                <p className="text-sm text-ink-500">
                  Membership prices never increase while your membership remains active. What you pay today is what you
                  pay tomorrow — guaranteed.
                </p>
              </div>
            </div>
            <div className="card-lux p-6 flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                <TrendingDown size={22} className="text-gold-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-ink-900 mb-1">Membership Savings</h3>
                <p className="text-sm text-ink-500">
                  Members save on accessories and wellness products with exclusive pricing — plus the peace of
                  mind that comes with predictable monthly pricing.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/shop-all" className="btn-outline">
              Shop Without a Membership <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Membership terms detail */}
      <section className="py-16 md:py-20">
        <div className="container-lux max-w-3xl">
          <p className="eyebrow mb-3 text-center">Membership details</p>
          <h2 className="font-serif text-3xl text-ink-900 mb-8 text-center">What's Included</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-lux p-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={20} className="text-gold-500" />
                <h3 className="font-serif text-lg text-ink-900">Recurring Billing</h3>
              </div>
              <p className="text-sm text-ink-500">Monthly automatic billing on your enrollment date. Your card is charged each month until you cancel after the 3-month commitment.</p>
            </div>
            <div className="card-lux p-6">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope size={20} className="text-gold-500" />
                <h3 className="font-serif text-lg text-ink-900">Provider Review</h3>
              </div>
              <p className="text-sm text-ink-500">Provider approval is required when applicable. If not approved, a full refund is issued. Purchase does not guarantee approval.</p>
            </div>
            <div className="card-lux p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lock size={20} className="text-gold-500" />
                <h3 className="font-serif text-lg text-ink-900">Renewal & Cancellation</h3>
              </div>
              <p className="text-sm text-ink-500">Memberships auto-renew monthly. Cancel anytime after the 3-month minimum. Submit cancellation at least 7 days before your next billing date.</p>
            </div>
            <div className="card-lux p-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={20} className="text-gold-500" />
                <h3 className="font-serif text-lg text-ink-900">Shipping & Storage</h3>
              </div>
              <p className="text-sm text-ink-500">Monthly fulfillment includes temperature-controlled shipping. Storage instructions are provided with each order.</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link to="/membership-terms" className="text-sm text-gold-600 hover:text-gold-700 link-underline">
              Read full Membership & Cancellation Terms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
