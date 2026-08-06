import { useState } from 'react';
import { Search } from 'lucide-react';
import { products, sections } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

export function ShopAllPage() {
  const [query, setQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');

  const filtered = products.filter(p => {
    const matchesQuery = query === '' ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(query.toLowerCase());
    const matchesSection = sectionFilter === 'all' || p.section === sectionFilter;
    return matchesQuery && matchesSection;
  });

  return (
    <div className="bg-cream-50 pt-16 md:pt-20">
      <section className="py-16 md:py-20 text-center">
        <div className="container-lux max-w-2xl">
          <p className="eyebrow mb-3">Browse everything</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-4">Shop All</h1>
          <p className="text-ink-500 mb-8">
            Explore our complete catalog of therapies, wellness products, accessories, and research reagents.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-lux">
          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSectionFilter('all')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  sectionFilter === 'all' ? 'bg-ink-900 text-cream-50' : 'bg-white text-ink-700 hover:bg-cream-200'
                }`}
              >
                All
              </button>
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSectionFilter(s.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    sectionFilter === s.id ? 'bg-ink-900 text-cream-50' : 'bg-white text-ink-700 hover:bg-cream-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-cream-300 bg-white py-2 pl-9 pr-4 text-sm text-ink-900 placeholder-ink-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <p className="text-sm text-ink-500 mb-6">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-ink-500 py-12">No products match your search.</p>
          )}
        </div>
      </section>
    </div>
  );
}
