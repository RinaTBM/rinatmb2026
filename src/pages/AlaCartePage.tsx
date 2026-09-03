import { ShieldCheck, Stethoscope, ArrowRight, Tag } from 'lucide-react';
import { Link } from '@/router';
import { visibleProducts } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

export function AlaCartePage() {
  const alaCarteProducts = visibleProducts;

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      {/* Hero */}
      <section className="py-16 md:py-20 text-center">
        <div className="container-lux max-w-2xl">
          <p className="eyebrow mb-3">Buy once</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-4">One-Time Purchases</h1>
          <p className="text-ink-500 mb-8">
            Purchase eligible products individually with no recurring commitment. Each product displays its approved
            starting price and any intake or provider requirements.
          </p>
        </div>
      </section>

      {/* Info banner */}
      <section className="pb-6">
        <div className="container-lux max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card-lux p-5 flex items-start gap-3">
              <Stethoscope size={20} className="flex-shrink-0 mt-0.5 text-gold-500" />
              <div>
                <p className="text-sm font-medium text-ink-900 mb-0.5">Provider Intake Required</p>
                <p className="text-xs text-ink-500">
                  Products marked with this icon require a medical intake and provider review before fulfillment.
                </p>
              </div>
            </div>
            <div className="card-lux p-5 flex items-start gap-3">
              <Tag size={20} className="flex-shrink-0 mt-0.5 text-gold-500" />
              <div>
                <p className="text-sm font-medium text-ink-900 mb-0.5">Starting At Pricing</p>
                <p className="text-xs text-ink-500">
                  The price shown is the approved starting price. Final pricing may vary based on your personalized plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="pb-20 md:pb-28">
        <div className="container-lux">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {alaCarteProducts.map(p => (
              <div key={p.id} className="relative">
                <ProductCard product={p} />
                {p.requiresIntake && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink-900/90 px-2.5 py-1 text-[10px] font-medium text-cream-50">
                    <ShieldCheck size={11} /> Intake
                  </div>
                )}
              </div>
            ))}
          </div>

          {alaCarteProducts.length === 0 && (
            <p className="text-center text-ink-500 py-12">No one-time purchase products are currently available.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cream-100/50">
        <div className="container-lux text-center max-w-lg">
          <h2 className="font-serif text-3xl text-ink-900 mb-3">Prefer convenient monthly renewals?</h2>
          <p className="text-ink-500 mb-6">
            Eligible prescription products offer Subscribe &amp; Save with 15% medication savings. Any required
            fulfillment details are shown before payment.
          </p>
          <Link to="/subscriptions" className="btn-primary">
            Explore Subscribe &amp; Save <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
