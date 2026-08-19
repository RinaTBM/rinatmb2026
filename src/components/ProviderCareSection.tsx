import { Link } from '@/router';
import { ArrowLeft, ArrowRight, ClipboardList, FlaskConical, Package, UserRound } from 'lucide-react';
import type { Product } from '@/data/products';

const ICONS = {
  'initial-provider-consultation': UserRound,
  'follow-up-appointment': ClipboardList,
  'laboratory-review': FlaskConical,
  'lab-kit': Package,
} as const;

/** Luxury concierge layout for /section/provider-care only. */
export function ProviderCareSection({ products }: { products: Product[] }) {
  // Preserve catalog order: Initial → Follow-Up → Laboratory Review → Lab Kit
  const order = [
    'initial-provider-consultation',
    'follow-up-appointment',
    'laboratory-review',
    'lab-kit',
  ];
  const cards = order
    .map(slug => products.find(p => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-24">
        <div className="container-lux">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm"
          >
            <ArrowLeft size={14} aria-hidden /> Home
          </Link>

          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-16">
            <p className="eyebrow mb-4">Care, guided by licensed providers</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] text-ink-900 mb-5 tracking-tight">
              Provider Care
            </h1>
            <p className="text-base md:text-lg text-ink-500 leading-relaxed">
              Personalized care, expert guidance, and ongoing support — every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
            {cards.map(product => {
              const Icon = ICONS[product.slug as keyof typeof ICONS] ?? UserRound;
              return (
                <article
                  key={product.id}
                  className="flex flex-col h-full overflow-hidden rounded-[20px] border border-cream-300 bg-white shadow-[0_8px_28px_-12px_rgba(26,26,26,0.12)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-100">
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      width={800}
                      height={600}
                      loading="lazy"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <div className="mb-4 flex items-start gap-3">
                      <span
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream-300 bg-cream-50 text-gold-600"
                        aria-hidden
                      >
                        <Icon size={18} strokeWidth={1.5} />
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-serif text-2xl text-ink-900 leading-snug">
                          {product.displayName}
                        </h2>
                        <p className="mt-1 text-sm italic text-ink-500">{product.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-sm text-ink-600 leading-relaxed mb-6 flex-1">
                      {product.shortDescription}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-cream-200">
                      <p className="font-serif text-xl text-ink-900">${product.startingPrice}</p>
                      <Link
                        to={`/product/${product.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-cream-50 transition-colors hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
                      >
                        Book visit <ArrowRight size={14} aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-12 max-w-3xl mx-auto text-center text-xs md:text-sm text-ink-400 leading-relaxed">
            Provider Care services require scheduling and may involve a medical intake. Fulfillment
            occurs only after provider approval when applicable.
          </p>

          <div className="mt-10 max-w-xl mx-auto text-center rounded-2xl border border-cream-300 bg-white px-6 py-7">
            <p className="eyebrow mb-2">Clinical leadership</p>
            <p className="font-serif text-xl text-ink-900 mb-2">Meet Our Medical Director</p>
            <p className="text-sm text-ink-500 mb-5 leading-relaxed">
              Learn about the medical leadership supporting safe, personalized, provider-directed wellness.
            </p>
            <Link
              to="/medical-director"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:text-gold-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm"
            >
              Meet Dr. Jerry J. Cattelane Jr., D.O. <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
