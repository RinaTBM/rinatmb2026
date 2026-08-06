import { useState } from 'react';
import { Link } from '@/router';
import { Minus, Plus, ShieldCheck, RefreshCw, Truck, Check } from 'lucide-react';
import { getProduct, getRelatedProducts, sections, PROVIDER_ELIGIBILITY_NOTICE } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';

export function ProductPage({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const { addItem } = useCart();
  const [variantIndex, setVariantIndex] = useState(0);
  const [subscription, setSubscription] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'formulation'>('overview');

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500">Product not found.</p>
        <Link to="/" className="btn-outline mt-6">Back home</Link>
      </div>
    );
  }

  const section = sections.find(s => s.id === product.category);
  const related = getRelatedProducts(product);
  const variant = product.variants[Math.min(variantIndex, product.variants.length - 1)];
  const hasMembership = Boolean(product.subscriptionPrice);
  const unitPrice = subscription && product.subscriptionPrice ? product.subscriptionPrice : variant.price;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.displayName,
      price: unitPrice,
      image: product.image,
      subscription,
      section: product.category,
      requiresIntake: product.requiresProviderReview,
      variantId: subscription ? `${variant.id}-sub` : variant.id,
      variantLabel: subscription ? `Membership · ${variant.label}` : variant.label,
    }, quantity);
  };

  return (
    <div className="bg-cream-50 pt-16 md:pt-20">
      {/* Breadcrumb */}
      <div className="container-lux py-4">
        <div className="flex items-center gap-2 text-sm text-ink-400 flex-wrap">
          <Link to="/" className="hover:text-ink-900">Home</Link>
          <span>/</span>
          <Link to={`/section/${product.category}`} className="hover:text-ink-900">{section?.label}</Link>
          <span>/</span>
          <span className="text-ink-700">{product.displayName}</span>
        </div>
      </div>

      {/* Product main */}
      <section className="pb-12 md:pb-16">
        <div className="container-lux">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {(() => {
                const containFit =
                  product.slug === 'discreet-travel-bag' ||
                  product.slug === 'temperature-controlled-travel-case';
                return (
                  <div className={`relative aspect-square overflow-hidden rounded-3xl bg-cream-100 ${containFit ? 'p-8 md:p-10' : ''}`}>
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      className={containFit ? 'h-full w-full object-contain object-center' : 'h-full w-full object-cover'}
                    />
                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      {product.bestSeller && (
                        <span className="rounded-full bg-ink-900 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-50">Best Seller</span>
                      )}
                      {product.requiresProviderReview && (
                        <span className="rounded-full bg-gold-400 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-900">Provider review required</span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider-2 text-gold-600">
                  <ShieldCheck size={16} /> {section?.label}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-2 leading-tight">{product.displayName}</h1>
              <p className="text-lg text-ink-500 mb-4">{product.subtitle}</p>

              <p className="text-ink-600 leading-relaxed mb-6">{product.shortDescription}</p>

              {/* Variant selector */}
              <div className="mb-6">
                <p className="text-sm font-medium text-ink-900 mb-2">
                  {product.dosageForms.length > 1 ? 'Select form & strength' : 'Select strength'}
                </p>
                <div className="space-y-2">
                  {product.variants.map((v, i) => {
                    const selected = i === variantIndex;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVariantIndex(i)}
                        aria-pressed={selected}
                        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                          selected ? 'border-gold-400 bg-gold-50' : 'border-ink-200 bg-white hover:border-gold-200'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${selected ? 'border-gold-500' : 'border-ink-300'}`}>
                            {selected && <span className="h-2 w-2 rounded-full bg-gold-500" />}
                          </span>
                          <span className="text-sm text-ink-800">{v.label}</span>
                        </span>
                        <span className="font-medium text-ink-900">${v.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Purchase options + Add to cart */}
              <div className="rounded-2xl border border-cream-300 bg-white p-5 space-y-4">
                {hasMembership && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSubscription(false)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${!subscription ? 'border-gold-400 bg-gold-50/50' : 'border-cream-200 hover:border-gold-200'}`}
                    >
                      <span className="block text-sm font-semibold text-ink-900">One-Time Purchase</span>
                      <span className="font-serif text-2xl text-ink-900">${variant.price}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubscription(true)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${subscription ? 'border-gold-400 bg-gold-50/50' : 'border-cream-200 hover:border-gold-200'}`}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                        Membership
                        <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-ink-900 uppercase">Best Value</span>
                      </span>
                      <span className="font-serif text-2xl text-ink-900">${product.subscriptionPrice}</span>
                      <span className="text-sm text-ink-500">/mo</span>
                    </button>
                  </div>
                )}

                {!hasMembership && (
                  <div className="rounded-xl border-2 border-gold-400 bg-gold-50/50 p-4">
                    <span className="block text-sm font-semibold text-ink-900">One-Time Purchase</span>
                    {product.startingAt && <span className="text-xs text-ink-400">Selected option</span>}
                    <div><span className="font-serif text-2xl text-ink-900">${variant.price}</span></div>
                  </div>
                )}

                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-ink-200 px-3 py-1.5">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-ink-500 hover:text-ink-900" aria-label="Decrease quantity"><Minus size={16} /></button>
                    <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="text-ink-500 hover:text-ink-900" aria-label="Increase quantity"><Plus size={16} /></button>
                  </div>
                  <button onClick={handleAddToCart} className="btn-primary flex-1 text-base py-4">
                    {subscription && product.subscriptionPrice
                      ? `Join Membership — $${product.subscriptionPrice}/mo`
                      : `Add to Cart — $${(unitPrice * quantity).toFixed(2)}`}
                  </button>
                </div>

                {/* Provider review notice */}
                <div className="flex items-start gap-2 rounded-xl bg-gold-50 p-3 text-sm text-gold-800">
                  <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
                  <p>{product.providerDisclaimer}</p>
                </div>

                {/* Trust badges */}
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs text-ink-500">
                  <div className="flex flex-col items-center gap-1"><Truck size={16} className="text-gold-500" /> Discreet shipping</div>
                  <div className="flex flex-col items-center gap-1"><ShieldCheck size={16} className="text-gold-500" /> Secure checkout</div>
                  <div className="flex flex-col items-center gap-1"><RefreshCw size={16} className="text-gold-500" /> {subscription ? 'Cancel anytime' : 'Provider-reviewed'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs: Overview / Eligibility / Formulation */}
      <section className="py-12 md:py-16 border-t border-cream-300">
        <div className="container-lux max-w-4xl">
          <div className="flex gap-2 border-b border-cream-300 mb-6">
            {([
              { id: 'overview', label: 'Overview' },
              { id: 'eligibility', label: 'Eligibility & Provider Review' },
              { id: 'formulation', label: 'Formulation' },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-400 hover:text-ink-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="prose prose-sm max-w-none">
            {activeTab === 'overview' && (
              <p className="text-ink-600 leading-relaxed">{product.longDescription}</p>
            )}
            {activeTab === 'eligibility' && (
              <ul className="space-y-3">
                {PROVIDER_ELIGIBILITY_NOTICE.map((line, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-700">
                    <Check size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'formulation' && (
              <p className="text-ink-600 leading-relaxed">{product.ingredients}</p>
            )}
          </div>
        </div>
      </section>

      {/* Product FAQ */}
      {product.faqs.length > 0 && (
        <section className="py-12 md:py-16 border-t border-cream-300">
          <div className="container-lux max-w-3xl">
            <h2 className="font-serif text-3xl text-ink-900 mb-6">Product FAQ</h2>
            <div className="space-y-3">
              {product.faqs.map((faq, i) => (
                <details key={i} className="card-lux group p-5">
                  <summary className="flex cursor-pointer items-center justify-between font-medium text-ink-900 list-none">
                    {faq.q}
                    <span className="ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cream-200 text-ink-600 transition-transform group-open:rotate-45">
                      <span className="text-lg leading-none">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-ink-500 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 border-t border-cream-300">
          <div className="container-lux">
            <h2 className="font-serif text-3xl text-ink-900 mb-8">You may also like</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
