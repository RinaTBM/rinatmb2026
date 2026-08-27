import { Check, RefreshCw, Truck } from 'lucide-react';
import { Link } from '@/router';

export function SubscriptionsPage() {
  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-24">
        <div className="container-lux max-w-4xl text-center">
          <p className="eyebrow mb-3">Subscribe & Save</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-5">Save 15% on prescription renewals</h1>
          <p className="mx-auto max-w-2xl text-lg text-ink-600 leading-relaxed">
            Choose Subscribe & Save on any eligible prescription product. The selected medication and shipping method renew monthly after required provider approval.
          </p>
          <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
            {[
              { icon: Check, title: '15% medication savings', copy: 'The discount applies to the prescription product on every renewal.' },
              { icon: Truck, title: 'Recurring shipping', copy: 'Your selected $30 Two-Day or $50 Next-Day shipping renews with the medication.' },
              { icon: RefreshCw, title: 'Monthly billing', copy: 'Provider visits, labs, services, and accessories remain one-time charges.' },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="card-lux p-6">
                <Icon className="mb-3 text-gold-600" size={22} />
                <h2 className="font-serif text-xl text-ink-900">{title}</h2>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
          <Link to="/shop-all" className="btn-primary mt-10 inline-flex">Choose a prescription</Link>
          <p className="mt-5 text-xs text-ink-500">
            Payment does not guarantee a prescription. Medication fulfillment remains subject to clinical review and approval.
          </p>
        </div>
      </section>
    </div>
  );
}
