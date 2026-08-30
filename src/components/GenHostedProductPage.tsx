import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, X } from 'lucide-react';
import { Link } from '@/router';
import { usePrescriptionBasket } from '@/context/PrescriptionBasketContext';
import { getRelatedProducts, type Product } from '@/data/products';
import { navigateToGenProductFirstCheckout, resolveGenProductFirstCheckout } from '@/lib/commerce/genHostedCheckout';
import { GEN_HOSTED_PRODUCTS, type GenHostedProductOption } from '@/lib/commerce/genHostedProducts';
import { ProductDescriptionSections, ProductHighlights } from '@/components/ProductDescriptionSections';

export function GenHostedProductPage({ product, route }: { product: Product; route: (typeof GEN_HOSTED_PRODUCTS)[string] }) {
  const options: readonly GenHostedProductOption[] = route.options ?? [{
    label: product.dosageForms[0] || 'Prescription option',
    price: route.price,
    genClientProductId: route.genClientProductId,
  }];
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const selectedOption = options[selectedOptionIndex] ?? options[0];
  const checkout = resolveGenProductFirstCheckout(selectedOption.genClientProductId);
  const { addItem, openBasket, items: prescriptionItems } = usePrescriptionBasket();
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);
  const [recommendationOffset, setRecommendationOffset] = useState(0);
  const currentInBasket = prescriptionItems.some(item => item.slug === product.slug);
  const recommendations = useMemo(
    () =>
      getRelatedProducts(product, 8)
        .filter(candidate => candidate.category !== 'accessories' && candidate.category !== 'provider-care')
        .filter(candidate => {
          const candidateRoute = GEN_HOSTED_PRODUCTS[candidate.slug];
          return Boolean(candidateRoute && resolveGenProductFirstCheckout(candidateRoute.genClientProductId).ok);
        })
        .slice(0, 3),
    [product],
  );
  const orderedRecommendations = recommendations.length
    ? recommendations.map((_, index) => recommendations[(index + recommendationOffset) % recommendations.length])
    : [];

  const openRecommendations = () => {
    setRecommendationOffset(0);
    setRecommendationsOpen(true);
  };

  const addCurrentToBasket = () => {
    if (!checkout.ok) return;
    addItem({
      slug: product.slug,
      displayName: product.displayName,
      subtitle: product.subtitle,
      image: product.image,
      imageAlt: product.imageAlt,
      price: selectedOption.price,
      genClientProductId: selectedOption.genClientProductId,
      category: product.category,
    });
    openRecommendations();
  };

  const continueToGen = () => {
    if (checkout.ok) navigateToGenProductFirstCheckout(checkout.url);
  };

  return (
    <div className="bg-cream-50 pt-28 md:pt-32 pb-16">
      <div className="container-lux grid gap-8 lg:grid-cols-2 lg:gap-16">
        <img src={product.image} alt={product.imageAlt} className="aspect-square w-full rounded-3xl object-cover" />
        <div>
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider-2 text-gold-600"><ShieldCheck size={16} />Provider review required</p>
          <h1 className="mt-3 font-serif text-4xl text-ink-900">{product.displayName}</h1>
          <p className="mt-3 text-xl text-ink-700 leading-snug">{product.benefitHeadline}</p>
          <p className="mt-4 text-ink-600 leading-relaxed">{product.shortDescription}</p>
          <ProductHighlights highlights={product.highlights} />
          {options.length > 1 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-ink-900">Delivery method</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Delivery method">
                {options.map((option, index) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedOptionIndex(index)}
                    className={index === selectedOptionIndex ? 'rounded-full bg-ink-900 px-4 py-2 text-sm text-white' : 'rounded-full border border-cream-300 bg-white px-4 py-2 text-sm text-ink-700'}
                  >
                    {option.label} · ${option.price}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6 rounded-2xl border border-cream-300 bg-white p-5">
            <p className="text-sm text-ink-500">Due today in GEN Health</p>
            <p className="font-serif text-3xl text-ink-900">${selectedOption.price.toFixed(2)}</p>
            <p className="mt-2 text-xs text-ink-500">Final payment total and any applicable visit charge are shown by GEN Health before payment.</p>
            <button type="button" className="btn-primary mt-5 w-full" disabled={!checkout.ok} onClick={addCurrentToBasket}>{checkout.ok ? (currentInBasket ? 'Added — review prescription basket' : 'Add to Prescription Basket') : 'Temporarily unavailable'}</button>
            {currentInBasket && <button type="button" onClick={openBasket} className="btn-ghost mt-2 w-full">Open prescription basket</button>}
            <p className="mt-3 text-xs text-ink-500">You’ll continue securely in GEN Health for payment, intake, assessment, and provider review.</p>
          </div>
        </div>
      </div>
      <div className="container-lux -mt-8 pb-16 lg:-mt-16">
        <div className="lg:ml-[calc(50%+2rem)] lg:w-[calc(50%-2rem)] border-t border-cream-300 pt-8">
          <ProductDescriptionSections product={product} />
        </div>
      </div>

      {recommendationsOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/45 px-5 py-8 backdrop-blur-sm animate-fade-in"
          onClick={() => setRecommendationsOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-cream-300 bg-cream-50 p-5 shadow-2xl animate-scale-in md:p-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="commonly-purchased-title"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider-2 text-gold-600">Before you continue</p>
                <h2 id="commonly-purchased-title" className="mt-1 font-serif text-2xl text-ink-900 md:text-3xl">Commonly purchased with...</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">Explore other provider-reviewed options before checkout. Each prescription is purchased separately through GEN Health and requires its own eligibility review.</p>
              </div>
              <button type="button" onClick={() => setRecommendationsOpen(false)} aria-label="Close recommendations" className="p-1">
                <X size={22} className="text-ink-500 hover:text-ink-900" />
              </button>
            </div>

            {orderedRecommendations.length > 0 && (
              <div className="relative mt-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  {orderedRecommendations.map(candidate => {
                    const candidateRoute = GEN_HOSTED_PRODUCTS[candidate.slug];
                    if (!candidateRoute) return null;
                    return (
                      <Link
                        key={candidate.slug}
                        to={`/product/${candidate.slug}`}
                        onClick={() => setRecommendationsOpen(false)}
                        className="group overflow-hidden rounded-2xl border border-cream-300 bg-white transition-shadow hover:shadow-lg"
                      >
                        <img src={candidate.image} alt={candidate.imageAlt} className="aspect-[4/3] w-full object-cover" />
                        <div className="p-4">
                          <p className="text-[10px] uppercase tracking-wider text-gold-600">{candidate.subtitle}</p>
                          <h3 className="mt-1 font-serif text-xl leading-tight text-ink-900 group-hover:text-gold-700">{candidate.displayName}</h3>
                          <p className="mt-2 text-sm text-ink-500">Starting at ${candidateRoute.price.toFixed(2)}</p>
                          <p className="mt-3 text-xs font-medium text-gold-700">View details <span aria-hidden="true">→</span></p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {recommendations.length > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setRecommendationOffset(offset => (offset - 1 + recommendations.length) % recommendations.length)}
                      aria-label="Previous recommendations"
                      className="rounded-full border border-cream-300 bg-white p-2 text-ink-700 hover:border-gold-400 hover:text-gold-700"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-xs text-ink-400">{recommendations.length} prescription options</span>
                    <button
                      type="button"
                      onClick={() => setRecommendationOffset(offset => (offset + 1) % recommendations.length)}
                      aria-label="Next recommendations"
                      className="rounded-full border border-cream-300 bg-white p-2 text-ink-700 hover:border-gold-400 hover:text-gold-700"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-2 border-t border-cream-300 pt-5 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setRecommendationsOpen(false)} className="btn-ghost w-full sm:w-auto">Keep shopping</button>
              <button type="button" onClick={() => { setRecommendationsOpen(false); openBasket(); }} className="btn-ghost w-full sm:w-auto">Review prescription basket</button>
              <button type="button" onClick={continueToGen} className="btn-primary w-full sm:w-auto">Continue with this prescription</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
