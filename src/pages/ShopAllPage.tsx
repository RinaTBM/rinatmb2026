import { useMemo, useState } from 'react';
import { products, visibleProducts } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ProductBrowseBar } from '@/components/ProductBrowseBar';
import {
  SHOP_CATEGORY_IDS,
  filterAndSortProducts,
  type BrowseFilters,
} from '@/lib/browse/productBrowse';

export function ShopAllPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<BrowseFilters>({
    query: '',
    category: '',
    form: '',
    price: 'any',
    sort: 'featured',
  });

  const catalog = useMemo(
    () => visibleProducts.filter(p => SHOP_CATEGORY_IDS.has(p.category)),
    [],
  );

  const filtered = useMemo(
    () => filterAndSortProducts(catalog, filters, products),
    [catalog, filters],
  );

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-24 text-center">
        <div className="container-lux max-w-2xl">
          <p className="eyebrow mb-3">Provider-guided wellness</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-5">Shop All</h1>
          <p className="text-ink-500 leading-relaxed">
            Browse provider-directed wellness products and supportive accessories in one place.
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-lux">
          <ProductBrowseBar
            filters={filters}
            onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
            showCategoryFilter
            filtersOpen={filtersOpen}
            onToggleFilters={() => setFiltersOpen(o => !o)}
            resultCount={filtered.length}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-ink-500 py-16">No products match your filters.</p>
          )}
        </div>
      </section>
    </div>
  );
}
