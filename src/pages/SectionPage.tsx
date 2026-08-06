import { useState, useMemo } from 'react';
import { Link } from '@/router';
import { ArrowLeft, SlidersHorizontal, FlaskConical, Stethoscope, ShieldCheck, Syringe, Activity, HeartPulse, Package } from 'lucide-react';
import { sections, getProductsBySection, getSectionMeta, getFeaturedBundle, type ProductSection } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

const sectionIcons: Record<ProductSection, React.ReactNode> = {
  'weight-management': <Activity size={28} className="text-gold-500" />,
  'longevity': <ShieldCheck size={28} className="text-gold-500" />,
  'hrt-women': <HeartPulse size={28} className="text-gold-600" />,
  'provider-care': <Stethoscope size={28} className="text-gold-600" />,
  'research': <FlaskConical size={28} className="text-nude-700" />,
  'accessories': <Package size={28} className="text-gold-500" />,
};

export function SectionPage({ sectionId, subFilter }: { sectionId: string; subFilter?: string }) {
  const section = getSectionMeta(sectionId as ProductSection);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');

  if (!section) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500">Section not found.</p>
        <Link to="/" className="btn-outline mt-6">Back home</Link>
      </div>
    );
  }

  const allProducts = getProductsBySection(section.id);
  const activeSub = subFilter || 'all';
  const featuredBundle = section.id === 'accessories' ? getFeaturedBundle() : undefined;

  const products = useMemo(() => {
    let filtered = allProducts;
    if (activeSub !== 'all') {
      filtered = filtered.filter(p => p.subcategory === activeSub);
    }
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-high': sorted.sort((a, b) => b.price - a.price); break;
      default: sorted.sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller)); break;
    }
    return sorted;
  }, [allProducts, sortBy, activeSub]);

  // Group products by subcategory when showing all
  const groupedProducts = activeSub === 'all'
    ? section.subcategories.map(sub => ({
        subcategory: sub,
        items: allProducts.filter(p => p.subcategory === sub.id),
      })).filter(g => g.items.length > 0)
    : [{ subcategory: section.subcategories.find(s => s.id === activeSub) || { id: activeSub, label: activeSub }, items: products }];

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
              {sectionIcons[section.id]}
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
        <div className={`rounded-xl px-5 py-4 mb-8 text-sm ${
          section.id === 'research' ? 'bg-nude-100 text-nude-800' :
          section.id === 'provider-care' ? 'bg-gold-50 text-gold-800' :
          'bg-cream-200 text-ink-600'
        }`}>
          <div className="flex items-start gap-2">
            {section.id === 'research' ? <FlaskConical size={18} className="flex-shrink-0 mt-0.5" /> :
             section.id === 'provider-care' ? <Stethoscope size={18} className="flex-shrink-0 mt-0.5" /> :
             <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />}
            <p>{section.disclosure}</p>
          </div>
        </div>
      </div>

      {/* Featured bundle hero (accessories only) */}
      {featuredBundle && activeSub === 'all' && (
        <section className="pb-8">
          <div className="container-lux">
            <Link to={`/product/${featuredBundle.slug}`} className="group block overflow-hidden rounded-3xl border border-gold-200 bg-gradient-to-br from-gold-50 to-cream-100 transition-all hover:shadow-xl">
              <div className="grid gap-6 p-6 md:grid-cols-2 md:items-center md:gap-10 md:p-10">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <img src={featuredBundle.image} alt={featuredBundle.name} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-900">Featured Bundle</span>
                </div>
                <div>
                  <p className="eyebrow mb-2 text-gold-600">Complete Kit · Save $71</p>
                  <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-3">{featuredBundle.name}</h2>
                  <p className="text-ink-500 mb-4 leading-relaxed">{featuredBundle.shortDescription}</p>
                  <div className="flex items-baseline gap-3 mb-5">
                    <span className="font-serif text-3xl text-ink-900">${featuredBundle.price}</span>
                    <span className="text-lg text-ink-400 line-through">${featuredBundle.bundleRegularPrice}</span>
                    <span className="rounded-full bg-gold-400 px-2.5 py-0.5 text-xs font-medium text-ink-900">Save $71</span>
                  </div>
                  <span className="btn-primary inline-block">View Bundle</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Subcategory filter bar */}
      <div className="container-lux">
        <div className="mb-8 flex flex-col gap-4 border-b border-cream-300 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <SlidersHorizontal size={16} className="text-ink-400 flex-shrink-0" />
            <Link
              to={`/section/${section.id}`}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-all ${
                activeSub === 'all' ? 'bg-ink-900 text-cream-50' : 'text-ink-600 hover:bg-cream-200'
              }`}
            >
              All
            </Link>
            {section.subcategories.map(sub => (
              <Link
                key={sub.id}
                to={`/section/${section.id}?sub=${sub.id}`}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-all ${
                  activeSub === sub.id ? 'bg-ink-900 text-cream-50' : 'text-ink-600 hover:bg-cream-200'
                }`}
              >
                {sub.label}
              </Link>
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

      {/* Members Save More banner */}
      <div className="container-lux mb-6">
        <div className="rounded-xl bg-gradient-to-r from-gold-50 to-cream-100 border border-gold-200/60 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink-900">Members Save More</p>
            <p className="text-xs text-ink-500">Lock in exclusive pricing with a membership. Shop without a membership below.</p>
          </div>
          <Link to="/memberships" className="text-sm font-medium text-gold-700 hover:text-gold-800 whitespace-nowrap">
            View Memberships &rarr;
          </Link>
        </div>
      </div>

      {/* Products grouped by subcategory */}
      <section className="pb-20 md:pb-28">
        <div className="container-lux">
          {groupedProducts.map((group, gi) => (
            <div key={gi} className="mb-12 last:mb-0">
              {activeSub === 'all' && (
                <div className="mb-6">
                  <h2 className="font-serif text-2xl text-ink-900 mb-1">{group.subcategory.label}</h2>
                  {group.subcategory.description && (
                    <p className="text-sm text-ink-500">{group.subcategory.description}</p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                {group.items.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
