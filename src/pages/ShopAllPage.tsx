import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { visibleProducts, sections, activeDosageForms } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

type PriceBand = 'all' | 'under-100' | '100-200' | '200-plus';

const priceBands: { id: PriceBand; label: string }[] = [
  { id: 'all', label: 'Any Price' },
  { id: 'under-100', label: 'Under $100' },
  { id: '100-200', label: '$100–$200' },
  { id: '200-plus', label: '$200+' },
];

export function ShopAllPage() {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formFilter, setFormFilter] = useState<string>('all');
  const [priceBand, setPriceBand] = useState<PriceBand>('all');

  const forms = useMemo(() => activeDosageForms(), []);

  const filtered = useMemo(() => visibleProducts.filter(p => {
    const q = query.trim().toLowerCase();
    const matchesQuery = q === '' ||
      p.displayName.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.dosageForms.some(f => f.toLowerCase().includes(q));
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesForm = formFilter === 'all' || p.dosageForms.some(f => f === formFilter);
    const price = p.startingPrice;
    const matchesPrice =
      priceBand === 'all' ||
      (priceBand === 'under-100' && price < 100) ||
      (priceBand === '100-200' && price >= 100 && price <= 200) ||
      (priceBand === '200-plus' && price > 200);
    return matchesQuery && matchesCategory && matchesForm && matchesPrice;
  }), [query, categoryFilter, formFilter, priceBand]);

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-20 text-center">
        <div className="container-lux max-w-2xl">
          <p className="eyebrow mb-3">Browse everything</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-4">Shop All</h1>
          <p className="text-ink-500 mb-8">
            Explore our provider-directed catalog. Every product is reviewed by a licensed provider before fulfillment.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-lux">
          {/* Category filter */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                categoryFilter === 'all' ? 'bg-ink-900 text-cream-50' : 'bg-white text-ink-700 hover:bg-cream-200'
              }`}
            >
              All Categories
            </button>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setCategoryFilter(s.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  categoryFilter === s.id ? 'bg-ink-900 text-cream-50' : 'bg-white text-ink-700 hover:bg-cream-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Dosage form + price + search */}
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-ink-400 mr-1">Form</span>
              <button
                onClick={() => setFormFilter('all')}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  formFilter === 'all' ? 'bg-gold-500 text-white' : 'bg-cream-100 text-ink-600 hover:bg-cream-200'
                }`}
              >
                All
              </button>
              {forms.map(f => (
                <button
                  key={f}
                  onClick={() => setFormFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    formFilter === f ? 'bg-gold-500 text-white' : 'bg-cream-100 text-ink-600 hover:bg-cream-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-ink-400 mr-1">Starting price</span>
              {priceBands.map(b => (
                <button
                  key={b.id}
                  onClick={() => setPriceBand(b.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    priceBand === b.id ? 'bg-gold-500 text-white' : 'bg-cream-100 text-ink-600 hover:bg-cream-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8 relative sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-cream-300 bg-white py-2 pl-9 pr-4 text-sm text-ink-900 placeholder-ink-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          <p className="text-sm text-ink-500 mb-6">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-ink-500 py-12">No products match your filters.</p>
          )}
        </div>
      </section>
    </div>
  );
}
