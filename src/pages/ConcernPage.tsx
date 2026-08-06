import { Link } from '@/router';
import { ArrowLeft, ArrowRight, Stethoscope, ShieldCheck, Sparkles, Package } from 'lucide-react';
import { getConcern, getProductsByConcern, getMembershipsForConcern, getAccessoriesForConcern, concerns, type ConcernId } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

export function ConcernPage({ concernId }: { concernId: string }) {
  const concern = getConcern(concernId);
  const { addItem } = useCart();

  if (!concern) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500">Concern not found.</p>
        <Link to="/" className="btn-outline mt-6">Back home</Link>
      </div>
    );
  }

  const concernProducts = getProductsByConcern(concern.id as ConcernId);
  const concernMemberships = getMembershipsForConcern(concern.id as ConcernId);
  const accessories = getAccessoriesForConcern();

  const providerGuided = concernProducts.filter(p => p.requiresIntake);
  const generalWellness = concernProducts.filter(p => !p.requiresIntake && p.section !== 'research' && p.section !== 'accessories');
  const researchProducts = concernProducts.filter(p => p.section === 'research');
  const accessoryProducts = concernProducts.filter(p => p.section === 'accessories');

  const hasProvider = providerGuided.length > 0;
  const hasResearch = researchProducts.length > 0;

  return (
    <div className="bg-cream-50 pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={concern.image} alt={concern.label} className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream-50/80 to-cream-50" />
        </div>
        <div className="container-lux relative z-10 text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-6 transition-colors">
            <ArrowLeft size={14} /> All Concerns
          </Link>
          <p className="eyebrow mb-3 text-sm">Shop by Concern</p>
          <h1 className="font-serif text-4xl md:text-6xl text-ink-900 mb-4 text-balance">{concern.label}</h1>
          <p className="text-lg text-ink-500 max-w-md mx-auto">{concern.description}</p>
        </div>
      </section>

      {/* Provider notice */}
      {(hasProvider || hasResearch) && (
        <div className="container-lux">
          <div className={`rounded-xl px-5 py-4 mb-8 text-sm ${hasProvider ? 'bg-gold-50 text-gold-800' : 'bg-nude-100 text-nude-800'}`}>
            <div className="flex items-start gap-2">
              {hasProvider ? <Stethoscope size={18} className="flex-shrink-0 mt-0.5" /> : <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />}
              <p>Provider review and approval are required before fulfillment. Purchase does not guarantee approval.</p>
            </div>
          </div>
        </div>
      )}

      {/* Memberships */}
      {concernMemberships.length > 0 && (
        <section className="pb-12">
          <div className="container-lux">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={20} className="text-gold-500" />
              <h2 className="font-serif text-2xl text-ink-900">Recommended Memberships</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
              {concernMemberships.map(m => (
                <div key={m.id} className={`relative card-lux p-8 flex flex-col ${m.highlighted ? 'ring-2 ring-gold-400 shadow-lg' : ''}`}>
                  {m.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-400 px-4 py-1 text-xs font-semibold text-ink-900">
                      Best Value
                    </span>
                  )}
                  <div className="mb-4">
                    <h3 className="font-serif text-2xl text-ink-900 mb-1">{m.name}</h3>
                    <p className="text-sm text-ink-500">{m.tagline}</p>
                  </div>
                  <div className="mb-6">
                    <span className="font-serif text-4xl text-ink-900">${m.price}</span>
                    <span className="text-ink-500 ml-1">{m.priceLabel}</span>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {m.features.slice(0, 4).map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-ink-700">
                        <ShieldCheck size={16} className="flex-shrink-0 mt-0.5 text-gold-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => addItem({ productId: m.id, slug: m.id, name: m.name, price: m.price, image: '', subscription: true, section: 'membership', requiresIntake: true })}
                    className={`btn-primary w-full ${m.highlighted ? '' : 'btn-outline'}`}
                  >
                    Join {m.name.split(' ')[0]} <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Provider-guided products */}
      {providerGuided.length > 0 && (
        <section className="pb-12">
          <div className="container-lux">
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope size={20} className="text-gold-600" />
              <h2 className="font-serif text-2xl text-ink-900">Provider-Guided Products</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {providerGuided.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* General wellness */}
      {generalWellness.length > 0 && (
        <section className="pb-12">
          <div className="container-lux">
            <h2 className="font-serif text-2xl text-ink-900 mb-6">General Wellness Products</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {generalWellness.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Research products */}
      {researchProducts.length > 0 && (
        <section className="pb-12">
          <div className="container-lux">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={20} className="text-nude-700" />
              <h2 className="font-serif text-2xl text-ink-900">Research Products</h2>
            </div>
            <div className="rounded-xl px-5 py-4 mb-6 text-sm bg-nude-100 text-nude-800">
              <p>Research products are sold for laboratory and research use only. Not for human consumption.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {researchProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Accessories */}
      {(accessoryProducts.length > 0 || accessories.length > 0) && (
        <section className="pb-12">
          <div className="container-lux">
            <div className="flex items-center gap-2 mb-6">
              <Package size={20} className="text-gold-500" />
              <h2 className="font-serif text-2xl text-ink-900">Accessories</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {(accessoryProducts.length > 0 ? accessoryProducts : accessories).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Other concerns */}
      <section className="py-16 md:py-20 bg-cream-100/50">
        <div className="container-lux">
          <h2 className="font-serif text-3xl text-ink-900 mb-8 text-center">Explore other concerns</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {concerns.filter(c => c.id !== concern.id).map(c => (
              <Link key={c.id} to={`/concern/${c.id}`} className="rounded-full border border-ink-200 px-5 py-2.5 text-sm text-ink-700 hover:border-ink-900 hover:bg-ink-900 hover:text-cream-50 transition-all">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
