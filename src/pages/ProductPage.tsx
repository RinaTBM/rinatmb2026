import { useState } from 'react';
import { Link } from '@/router';
import { ArrowLeft, Minus, Plus, ShieldCheck, FlaskConical, Stethoscope, RefreshCw, Truck, Check, ChevronDown } from 'lucide-react';
import { getProduct, getRelatedProducts, getFeaturedBundle, getBundleItems, getFrequentlyBoughtTogether, sections, goals, type Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';

export function ProductPage({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [subscription, setSubscription] = useState(false);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'directions'>('benefits');

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500">Product not found.</p>
        <Link to="/" className="btn-outline mt-6">Back home</Link>
      </div>
    );
  }

  const section = sections.find(s => s.id === product.section);
  const related = getRelatedProducts(product);
  const price = product.variablePricing ? 0 : (subscription && product.subscriptionPrice ? product.subscriptionPrice : product.price);
  const productGoals = goals.filter(g => product.goals.includes(g.id));
  const bundleItemsList = product.bundleItems ? getBundleItems(product) : [];
  const bundleSavings = product.bundleRegularPrice ? product.bundleRegularPrice - product.price : 0;
  const fbt = getFrequentlyBoughtTogether(product);
  const [fbtSelected, setFbtSelected] = useState<Record<string, boolean>>({});
  const fbtTotal = price + fbt.reduce((sum, p) => sum + (fbtSelected[p.id] ? p.price : 0), 0);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price,
      image: product.image,
      subscription,
      section: product.section,
      requiresIntake: product.requiresIntake,
    }, quantity);
    Object.entries(fbtSelected).forEach(([pid, selected]) => {
      if (selected) {
        const p = fbt.find(fp => fp.id === pid);
        if (p) {
          addItem({
            productId: p.id,
            slug: p.slug,
            name: p.name,
            price: p.price,
            image: p.image,
            subscription: false,
            section: p.section,
            requiresIntake: p.requiresIntake,
          }, 1);
        }
      }
    });
  };

  const sectionIcon = product.section === 'research' ? <FlaskConical size={16} /> : product.section === 'provider-care' ? <Stethoscope size={16} /> : <ShieldCheck size={16} />;

  return (
    <div className="bg-cream-50 pt-16 md:pt-20">
      {/* Breadcrumb */}
      <div className="container-lux py-4">
        <div className="flex items-center gap-2 text-sm text-ink-400">
          <Link to="/" className="hover:text-ink-900">Home</Link>
          <span>/</span>
          <Link to={`/section/${product.section}`} className="hover:text-ink-900">{section?.label}</Link>
          <span>/</span>
          <span className="text-ink-700">{product.name}</span>
        </div>
      </div>

      {/* Product main */}
      <section className="pb-12 md:pb-16">
        <div className="container-lux">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream-100">
                <img src={product.image} alt={product.name} className={`h-full w-full ${product.section === 'accessories' ? 'object-contain p-6' : 'object-cover'}`} />
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  {product.featured && (
                    <span className="rounded-full bg-gold-400 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-900">Featured Bundle</span>
                  )}
                  {product.bestSeller && (
                    <span className="rounded-full bg-ink-900 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-50">Best Seller</span>
                  )}
                  {product.section === 'provider-care' && (
                    <span className="rounded-full bg-gold-400 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-900">Provider Care</span>
                  )}
                  {product.section === 'research' && (
                    <span className="rounded-full bg-nude-700 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-50">Research Use Only</span>
                  )}
                </div>
              </div>
              {/* Bundle items list */}
              {bundleItemsList.length > 0 && (
                <div className="mt-4 rounded-2xl border border-cream-300 bg-white p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-gold-600 mb-3">What's inside ({bundleItemsList.length} items)</p>
                  <div className="grid grid-cols-2 gap-3">
                    {bundleItemsList.map(item => (
                      <Link key={item.id} to={`/product/${item.slug}`} className="flex items-center gap-2 rounded-lg bg-cream-50 p-2 hover:bg-cream-100 transition-colors">
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                        <span className="text-xs text-ink-700 leading-tight">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider-2 text-gold-600">
                  {sectionIcon} {section?.label}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-2 leading-tight">{product.name}</h1>
              <p className="text-lg text-ink-500 mb-4">{product.tagline}</p>


              <p className="text-ink-600 leading-relaxed mb-6">{product.shortDescription}</p>

              {/* Goals */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {productGoals.map(g => (
                    <Link key={g.id} to={`/goal/${g.id}`} className="rounded-full bg-cream-200 px-3 py-1.5 text-xs text-ink-600 hover:bg-cream-300 transition-colors">
                      {g.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Subscription toggle */}
              {product.subscriptionPrice && !product.variablePricing && (
                <div className="mb-6 space-y-2">
                  <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${subscription ? 'border-gold-400 bg-gold-50' : 'border-ink-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="purchase" checked={!subscription} onChange={() => setSubscription(false)} className="accent-ink-900" />
                      <div>
                        <p className="font-medium text-ink-900">One-time purchase</p>
                        <p className="text-sm text-ink-500">${product.price}{product.priceLabel || ''}</p>
                      </div>
                    </div>
                  </label>
                  <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${subscription ? 'border-gold-400 bg-gold-50' : 'border-ink-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="purchase" checked={subscription} onChange={() => setSubscription(true)} className="accent-gold-500" />
                      <div>
                        <p className="font-medium text-ink-900 flex items-center gap-2">
                          Subscription <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-semibold text-gold-700">SAVE 20%</span>
                        </p>
                        <p className="text-sm text-ink-500">${product.subscriptionPrice}/mo · cancel anytime</p>
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* Bundle savings badge */}
              {bundleSavings > 0 && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-gold-50 border border-gold-200 px-4 py-3">
                  <span className="text-sm font-medium text-gold-800">Save ${bundleSavings} when you bundle</span>
                  <span className="text-xs text-gold-600">· Regular price ${product.bundleRegularPrice}</span>
                </div>
              )}

              {/* Price + Add to cart */}
              <div className="rounded-2xl border border-cream-300 bg-white p-5 space-y-4">
                {/* Membership option (for products with subscriptionPrice) */}
                {product.subscriptionPrice && !product.variablePricing && (
                  <div
                    className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${subscription ? 'border-gold-400 bg-gold-50/50' : 'border-cream-200 hover:border-gold-200'}`}
                    onClick={() => setSubscription(true)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${subscription ? 'border-gold-500' : 'border-ink-300'}`}>
                          {subscription && <div className="w-2 h-2 rounded-full bg-gold-500" />}
                        </div>
                        <span className="text-sm font-semibold text-ink-900">Become a Member</span>
                      </div>
                      <span className="rounded-full bg-gold-400 px-2.5 py-0.5 text-[10px] font-bold text-ink-900 uppercase tracking-wide">Best Value</span>
                    </div>
                    <div className="ml-6">
                      <span className="font-serif text-2xl text-ink-900">${product.subscriptionPrice}</span>
                      <span className="text-sm text-ink-500">/month</span>
                      <p className="text-xs text-ink-400 mt-1">Same price no matter the dose. 3-month minimum. Provider-guided care.</p>
                    </div>
                  </div>
                )}

                {/* One-Time Purchase option */}
                {!product.variablePricing && (
                  <div
                    className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${!subscription || !product.subscriptionPrice ? 'border-gold-400 bg-gold-50/50' : 'border-cream-200 hover:border-gold-200'}`}
                    onClick={() => setSubscription(false)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!subscription || !product.subscriptionPrice ? 'border-gold-500' : 'border-ink-300'}`}>
                          {(!subscription || !product.subscriptionPrice) && <div className="w-2 h-2 rounded-full bg-gold-500" />}
                        </div>
                        <span className="text-sm font-semibold text-ink-900">One-Time Purchase</span>
                      </div>
                    </div>
                    <div className="ml-6">
                      {product.startingAt && <span className="text-xs text-ink-400 block">Starting at</span>}
                      <span className="font-serif text-2xl text-ink-900">${product.price.toFixed(2)}</span>
                      {product.startingAt && (
                        <p className="text-xs text-ink-400 mt-1">Price varies depending on dosage needed</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Variable pricing (HRT) */}
                {product.variablePricing && (
                  <div className="rounded-xl border-2 border-cream-200 p-4">
                    <p className="text-sm text-ink-400 mb-1">Pricing after intake</p>
                    <span className="font-serif text-2xl text-ink-700">Determined by provider</span>
                  </div>
                )}

                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-3">
                  {!product.variablePricing && (
                    <div className="flex items-center gap-2 rounded-full border border-ink-200 px-3 py-1.5">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-ink-500 hover:text-ink-900"><Minus size={16} /></button>
                      <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="text-ink-500 hover:text-ink-900"><Plus size={16} /></button>
                    </div>
                  )}
                  <button onClick={handleAddToCart} className="btn-primary flex-1 text-base py-4">
                    {product.variablePricing
                      ? 'Begin Intake'
                      : subscription && product.subscriptionPrice
                        ? `Join Membership — ${product.subscriptionPrice}/mo`
                        : `Add to Cart — ${(price * quantity).toFixed(2)}`}
                  </button>
                </div>

                {/* Provider care notice */}
                {product.requiresIntake && (
                  <div className="flex items-start gap-2 rounded-xl bg-gold-50 p-3 text-sm text-gold-800">
                    <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
                    <p>
                      This product requires a medical intake. A licensed provider will review your case and, if needed, a consultation and lab review before fulfillment. {product.variablePricing ? 'Once your provider finalizes your personalized treatment plan, you will receive an invoice for the exact cost before any charges are made. ' : ''}If not approved, you will receive a full refund.
                    </p>
                  </div>
                )}

                {/* Research notice */}
                {product.section === 'research' && (
                  <div className="flex items-start gap-2 rounded-xl bg-nude-100 p-3 text-sm text-nude-800">
                    <FlaskConical size={18} className="flex-shrink-0 mt-0.5" />
                    <p>For research and laboratory use only. Not for human consumption. Not intended to diagnose, treat, cure, or prevent any disease.</p>
                  </div>
                )}

                {/* Trust badges */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-ink-500">
                  <div className="flex flex-col items-center gap-1"><Truck size={16} className="text-gold-500" /> 3–5 day shipping</div>
                  <div className="flex flex-col items-center gap-1"><ShieldCheck size={16} className="text-gold-500" /> Secure checkout</div>
                  <div className="flex flex-col items-center gap-1"><RefreshCw size={16} className="text-gold-500" /> {subscription ? 'Cancel anytime' : '30-day returns'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs: Benefits / Ingredients / Directions */}
      <section className="py-12 md:py-16 border-t border-cream-300">
        <div className="container-lux max-w-4xl">
          <div className="flex gap-2 border-b border-cream-300 mb-6">
            {(['benefits', 'ingredients', 'directions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-400 hover:text-ink-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="prose prose-sm max-w-none">
            {activeTab === 'benefits' && (
              <ul className="space-y-3">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-700">
                    <Check size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'ingredients' && (
              <p className="text-ink-600 leading-relaxed whitespace-pre-line">{product.ingredients}</p>
            )}
            {activeTab === 'directions' && (
              <p className="text-ink-600 leading-relaxed whitespace-pre-line">{product.directions}</p>
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


      {/* Frequently Bought Together */}
      {fbt.length > 0 && (
        <section className="py-12 md:py-16 border-t border-cream-300 bg-cream-100/40">
          <div className="container-lux">
            <h2 className="font-serif text-3xl text-ink-900 mb-2">Frequently Bought Together</h2>
            <p className="text-sm text-ink-500 mb-6">Add these items to your cart for the complete experience.</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {fbt.map(p => (
                <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all ${fbtSelected[p.id] ? 'border-gold-400 bg-gold-50' : 'border-cream-300 bg-white hover:border-cream-400'}`}>
                  <input type="checkbox" checked={!!fbtSelected[p.id]} onChange={() => setFbtSelected(s => ({ ...s, [p.id]: !s[p.id] }))} className="h-4 w-4 accent-gold-500" />
                  <Link to={`/product/${p.slug}`} className="flex items-center gap-3 flex-1" onClick={e => e.stopPropagation()}>
                    <img src={p.image} alt={p.name} className="h-14 w-14 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-ink-900 leading-tight">{p.name}</p>
                      <p className="text-xs text-ink-500">${p.price}</p>
                    </div>
                  </Link>
                </label>
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
