import { useMemo, useState } from 'react';
import { Link } from '@/router';
import { Minus, Plus, Truck, Package } from 'lucide-react';
import {
  getRelatedProducts,
  sections,
  type Product,
} from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useMember } from '@/context/MemberContext';
import { ProductDescriptionSections, ProductHighlights } from '@/components/ProductDescriptionSections';
import { ProductCard } from '@/components/ProductCard';
import {
  ACCESSORY_UNIT_QUANTITY_MAX,
  ACCESSORY_UNIT_QUANTITY_MIN,
  accessoryCartName,
  accessoryCartVariantLabel,
  accessoryVariantOptionLabel,
  clampAccessoryQuantity,
  isAccessoryCountProduct,
} from '@/lib/accessories/accessoryPurchase';
import { resolveAccessoryUnitPrice } from '@/lib/pricing/accessoryMemberDiscount';
import {
  getDefaultPurchaseDiscountSettings,
  loadPurchaseDiscountSettings,
} from '@/lib/pricing/settings';

const ACCESSORY_NOTE = 'Accessories are wellness tools and supplies. They are not medications.';

export function AccessoryProductPage({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isActiveMember, status: membershipStatus } = useMember();
  const [quantity, setQuantity] = useState(1);
  const [variantIndex, setVariantIndex] = useState(0);
  const hasCountOptions = isAccessoryCountProduct(product);
  const settings = useMemo(() => {
    try {
      return loadPurchaseDiscountSettings();
    } catch {
      return getDefaultPurchaseDiscountSettings();
    }
  }, []);

  const variant = product.variants[Math.min(variantIndex, product.variants.length - 1)];
  const section = sections.find(s => s.id === product.category);
  const related = useMemo(
    () => getRelatedProducts(product).filter(p => p.category === 'accessories'),
    [product],
  );
  const standardPrice = variant?.price ?? product.startingPrice;
  const priced = resolveAccessoryUnitPrice({
    standardPrice,
    product,
    isActiveMember,
    membershipStatus,
    settings,
  });
  const showMemberBenefit = priced.appliedDiscount === 'member';

  const handleAddToCart = () => {
    if (!variant) return;
    const qty = clampAccessoryQuantity(quantity);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: accessoryCartName(product, variant),
      price: priced.finalPrice,
      standardPrice,
      image: product.image,
      subscription: false,
      section: product.category,
      requiresIntake: false,
      variantId: variant.id,
      variantLabel: accessoryCartVariantLabel(product, variant),
      purchaseType: 'one_time',
      discountPercent: priced.discountPercent,
      appliedDiscount: priced.appliedDiscount,
    }, qty);
  };

  const setQty = (next: number) => setQuantity(clampAccessoryQuantity(next));

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <div className="container-lux py-4">
        <div className="flex items-center gap-2 text-sm text-ink-400 flex-wrap">
          <Link to="/" className="hover:text-ink-900">Home</Link>
          <span>/</span>
          <Link to={`/section/${product.category}`} className="hover:text-ink-900">{section?.label}</Link>
          <span>/</span>
          <span className="text-ink-700">{product.displayName}</span>
        </div>
      </div>

      <section className="pb-12 md:pb-16">
        <div className="container-lux">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream-100 p-8 md:p-10">
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="h-full w-full object-contain object-center"
                />
                {product.bestSeller && (
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-ink-900 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-50">
                      Best Seller
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider-2 text-gold-600">
                  <Package size={16} /> {section?.label}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-2 leading-tight">
                {product.displayName}
              </h1>
              <p className="text-xl md:text-2xl text-ink-700 mb-3 leading-snug">
                {product.benefitHeadline}
              </p>
              <p className="text-ink-600 leading-relaxed mb-5">{product.shortDescription}</p>
              <ProductHighlights highlights={product.highlights} />

              {hasCountOptions && product.variants.length > 1 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-ink-900 mb-2">Select Count</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.variants.map((v, i) => {
                      const selected = i === variantIndex;
                      const optionPriced = resolveAccessoryUnitPrice({
                        standardPrice: v.price,
                        product,
                        isActiveMember,
                        membershipStatus,
                        settings,
                      });
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setVariantIndex(i)}
                          aria-pressed={selected}
                          className={`rounded-xl border-2 px-4 py-3 text-left transition-all ${
                            selected
                              ? 'border-gold-400 bg-gold-50'
                              : 'border-ink-200 bg-white hover:border-gold-200'
                          }`}
                        >
                          <span className="block text-sm font-medium text-ink-900">
                            {accessoryVariantOptionLabel(v)}
                          </span>
                          {optionPriced.appliedDiscount === 'member' ? (
                            <span className="block text-sm text-ink-600">
                              <span className="text-ink-400 line-through mr-1">${v.price.toFixed(2)}</span>
                              ${optionPriced.finalPrice.toFixed(2)}
                            </span>
                          ) : (
                            <span className="block text-sm text-ink-600">${v.price.toFixed(2)}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-cream-300 bg-white p-5 space-y-5">
                <div>
                  {showMemberBenefit ? (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">
                        Member Benefit · Save {priced.discountPercent}%
                      </p>
                      <p className="font-serif text-3xl text-ink-900">
                        ${priced.finalPrice.toFixed(2)}
                      </p>
                      <div className="text-sm text-ink-500 space-y-0.5">
                        <p>
                          Standard:{' '}
                          <span className="line-through">${standardPrice.toFixed(2)}</span>
                        </p>
                        <p className="text-gold-700">
                          Member Savings: −{priced.discountPercent}% (−${priced.savingsAmount.toFixed(2)})
                        </p>
                        <p className="text-ink-700 font-medium">
                          Active Member Price: ${priced.finalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="font-serif text-3xl text-ink-900">${standardPrice.toFixed(2)}</p>
                  )}
                  {hasCountOptions && variant && (
                    <p className="mt-1 text-sm text-ink-500">
                      Selected: {accessoryVariantOptionLabel(variant)}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-ink-900 mb-2">Select Quantity</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 rounded-full border border-ink-200 px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => setQty(quantity - 1)}
                        className="text-ink-500 hover:text-ink-900 p-1"
                        aria-label="Decrease quantity"
                        disabled={quantity <= ACCESSORY_UNIT_QUANTITY_MIN}
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-8 text-center text-base font-medium text-ink-900">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQty(quantity + 1)}
                        className="text-ink-500 hover:text-ink-900 p-1"
                        aria-label="Increase quantity"
                        disabled={quantity >= ACCESSORY_UNIT_QUANTITY_MAX}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <span className="text-xs text-ink-400">Up to {ACCESSORY_UNIT_QUANTITY_MAX}</span>
                  </div>
                  {hasCountOptions && (
                    <p className="mt-2 text-xs text-ink-400">
                      Quantity is the number of packs/boxes — separate from the count selected above.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-primary w-full text-base py-4"
                >
                  Add to Cart
                </button>

                <div className="rounded-xl bg-cream-100 px-4 py-3 text-sm text-ink-600">
                  {ACCESSORY_NOTE}
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs text-ink-500 pt-1">
                  <div className="flex flex-col items-center gap-1">
                    <Truck size={16} className="text-gold-500" /> Discreet shipping
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Package size={16} className="text-gold-500" /> Ships with your order
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-lux -mt-8 pb-16 lg:-mt-16">
        <div className="lg:ml-[calc(50%+2rem)] lg:w-[calc(50%-2rem)] border-t border-cream-300 pt-8">
          <ProductDescriptionSections product={product} showEligibility={false} />
        </div>
      </div>

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
