import { useState, useMemo } from 'react';
import { Link } from '@/router';
import { ArrowLeft, SlidersHorizontal, ShieldCheck, Stethoscope, Package } from 'lucide-react';
import { getProductsBySection, getSectionMeta, type Category, type DosageForm } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

export function SectionPage({ sectionId, subFilter }: { sectionId: string; subFilter?: string }) {
  const section = getSectionMeta(sectionId as Category);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [formFilter, setFormFilter] = useState<string>('all');

  const allProducts = useMemo(
    () => (section ? getProductsBySection(section.id) : []),
    [section]
  );

  const forms = useMemo(() => {
    const set = new Set<DosageForm>();
    allProducts.forEach(p => p.dosageForms.forEach(f => set.add(f)));
    return Array.from(set);
  }, [allProducts]);

  const products = useMemo(() => {
    let filtered = allProducts;
    const activeForm = subFilter || formFilter;
    if (activeForm && activeForm !== 'all') {
      filtered = filtered.filter(p => p.dosageForms.some(f => f === activeForm));
    }
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low': sorted.sort((a, b) => a.startingPrice - b.startingPrice); break;
      case 'price-high': sorted.sort((a, b) => b.startingPrice - a.startingPrice); break;
      default: sorted.sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller)); break;
    }
    return sorted;
  }, [allProducts, sortBy, formFilter, subFilter]);

  if (!section) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500">Category not found.</p>
        <Link to="/shop-all" className="btn-outline mt-6">Shop all</Link>
      </div>
    );
  }

  const activeForm = subFilter || formFilter;

  return (
    <div className="bg-cream-50 pt-16 md:pt-20">
      {/* Header */}
      <section className="py-16 md:py-24">
        <div className="container-lux">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-6 transition-colors">
            <ArrowLeft size={14} /> Home
          </Link>
          <div className="flex items-start gap-5 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-200">
              {section.id === 'provider-care' ? <Stethoscope size={28} className="text-gold-600" /> :
               section.id === 'accessories' ? <Package size={28} className="text-gold-500" /> :
               <ShieldCheck size={28} className="text-gold-500" />}
            </div>
            <div>
              <p className="eyebrow mb-2 text-sm">{section.tagline}</p>
              <h1 className="font-serif text-4xl md:text-5xl text-ink-900">{section.label}</h1>
            </div>
          </div>
          <p className="text-lg text-ink-500 max-w-2xl leading-relaxed">{section.description}</p>
        </div>
      </section>

      {/* Disclosure banner */}
      <div className="container-lux">
        <div className="rounded-xl px-5 py-4 mb-8 text-sm bg-gold-50 text-gold-800">
          <div className="flex items-start gap-2">
            <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
            <p>{section.disclosure}</p>
          </div>
        </div>
      </div>

      {/* Filter + sort bar */}
      <div className="container-lux">
        <div className="mb-8 flex flex-col gap-4 border-b border-cream-300 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <SlidersHorizontal size={16} className="text-ink-400 flex-shrink-0" />
            <button
              onClick={() => setFormFilter('all')}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-all ${
                activeForm === 'all' ? 'bg-ink-900 text-cream-50' : 'text-ink-600 hover:bg-cream-200'
              }`}
            >
              All Forms
            </button>
            {forms.map(f => (
              <button
                key={f}
                onClick={() => setFormFilter(f)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-all ${
                  activeForm === f ? 'bg-ink-900 text-cream-50' : 'text-ink-600 hover:bg-cream-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-ink-400">Sort</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm text-ink-800 focus:border-gold-400 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="pb-20 md:pb-28">
        <div className="container-lux">
          <p className="text-sm text-ink-500 mb-6">{products.length} product{products.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="text-center text-ink-500 py-12">No products match this filter.</p>
          )}
        </div>
      </section>
    </div>
  );
}
