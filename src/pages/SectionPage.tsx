import { useMemo, useState } from 'react';
import { Link } from '@/router';
import { ArrowLeft, ShieldCheck, Package } from 'lucide-react';
import { getProductsBySection, getSectionMeta, products, type Category } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ProviderCareSection } from '@/components/ProviderCareSection';
import { ProductBrowseBar } from '@/components/ProductBrowseBar';
import {
  SHOP_CATEGORY_IDS,
  filterAndSortProducts,
  type BrowseFilters,
} from '@/lib/browse/productBrowse';

export function SectionPage({ sectionId }: { sectionId: string; subFilter?: string }) {
  const section = getSectionMeta(sectionId as Category);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<BrowseFilters>({
    query: '',
    category: '',
    form: '',
    price: 'any',
    sort: 'featured',
  });

  const allProducts = useMemo(
    () => (section ? getProductsBySection(section.id) : []),
    [section],
  );

  const filtered = useMemo(
    () => filterAndSortProducts(allProducts, { ...filters, category: '' }, products),
    [allProducts, filters],
  );

  // Dedicated guide layout — Provider Care only.
  if (section?.id === 'provider-care') {
    return <ProviderCareSection />;
  }

  if (!section) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500">Category not found.</p>
        <Link to="/shop-all" className="btn-outline mt-6">Shop all</Link>
      </div>
    );
  }

  const isShopCategory = SHOP_CATEGORY_IDS.has(section.id);
  const isAccessories = section.id === 'accessories';

  // Accessories are intentionally outside the Shop experience — own top-level destination.
  if (isAccessories) {
    return (
      <div className="bg-cream-50 pt-28 md:pt-32">
        <section className="py-16 md:py-24">
          <div className="container-lux">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-8 transition-colors">
              <ArrowLeft size={14} /> Home
            </Link>
            <div className="flex items-start gap-5 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-200">
                <Package size={28} className="text-gold-500" />
              </div>
              <div>
                <p className="eyebrow mb-2 text-sm">{section.tagline}</p>
                <h1 className="font-serif text-4xl md:text-5xl text-ink-900">{section.label}</h1>
              </div>
            </div>
            <p className="text-lg text-ink-500 max-w-2xl leading-relaxed mb-3">{section.description}</p>
            <p className="text-sm text-ink-400 max-w-2xl">
              Optional add-ons to support your wellness routine — separate from our provider-guided product catalog.
            </p>
          </div>
        </section>

        <div className="container-lux">
          <div className="rounded-xl px-5 py-4 mb-10 text-sm bg-gold-50 text-gold-800">
            <div className="flex items-start gap-2">
              <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
              <p>{section.disclosure}</p>
            </div>
          </div>
        </div>

        <section className="pb-24 md:pb-32">
          <div className="container-lux">
            <p className="text-sm text-ink-500 mb-8">{allProducts.length} accessor{allProducts.length !== 1 ? 'ies' : 'y'}</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6 xl:gap-8">
              {allProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-24">
        <div className="container-lux">
          <Link to="/shop-all" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-8 transition-colors">
            <ArrowLeft size={14} /> Shop All
          </Link>
          <div className="flex items-start gap-5 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-200">
              <ShieldCheck size={28} className="text-gold-500" />
            </div>
            <div>
              <p className="eyebrow mb-2 text-sm">{section.tagline}</p>
              <h1 className="font-serif text-4xl md:text-5xl text-ink-900">{section.label}</h1>
            </div>
          </div>
          <p className="text-lg text-ink-500 max-w-2xl leading-relaxed">{section.description}</p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-lux">
          {isShopCategory && (
            <ProductBrowseBar
              filters={filters}
              onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
              showCategoryFilter={false}
              filtersOpen={filtersOpen}
              onToggleFilters={() => setFiltersOpen(o => !o)}
              resultCount={filtered.length}
            />
          )}

          {!isShopCategory && (
            <p className="text-sm text-ink-500 mb-6">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
          )}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6 xl:gap-8">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-ink-500 py-16">No products match this filter.</p>
          )}
        </div>
      </section>
    </div>
  );
}
