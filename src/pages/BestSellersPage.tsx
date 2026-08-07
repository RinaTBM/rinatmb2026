import { Link } from '@/router';
import { ArrowRight } from 'lucide-react';
import { getBestSellers, sections } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

export function BestSellersPage() {
  const bestSellers = getBestSellers();

  return (
    <div className="bg-cream-50 pt-16 md:pt-20">
      <section className="py-16 md:py-24 text-center">
        <div className="container-lux">
          <p className="eyebrow mb-3 text-sm">Loved by thousands</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-4">Best Sellers</h1>
          <p className="text-lg text-ink-500 max-w-md mx-auto">Our most-loved products, tried and trusted by our community.</p>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-lux">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {bestSellers.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream-100/50">
        <div className="container-lux">
          <h2 className="font-serif text-3xl text-ink-900 mb-8 text-center">Explore all collections</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {sections.map(s => (
              <Link key={s.id} to={`/section/${s.id}`} className="inline-flex items-center gap-1 rounded-full border border-ink-200 px-5 py-2.5 text-sm text-ink-700 hover:border-ink-900 hover:bg-ink-900 hover:text-cream-50 transition-all">
                {s.label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
