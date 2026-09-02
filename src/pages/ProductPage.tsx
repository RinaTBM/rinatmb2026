import { useMemo, useState } from 'react';
import { Link } from '@/router';
import { Minus, Plus, ShieldCheck, RefreshCw, Truck, Check } from 'lucide-react';
import { getMembership, getProduct, getRelatedProducts, sections } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useMember } from '@/context/MemberContext';
import { ProductCard } from '@/components/ProductCard';
import { AccessoryProductPage } from '@/components/AccessoryProductPage';
import { MembershipDetailPage } from '@/components/MembershipDetailPage';
import { FamilyProductPage, isFamilyStorefrontSlug } from '@/pages/FamilyProductPage';
import { WEBSITE_FAMILY_CUTOVER_ENABLED } from '@/data/websiteFamilies';
import { MembershipRequestedDoseField } from '@/components/MembershipRequestedDoseField';
import { ProductDescriptionSections, ProductHighlights } from '@/components/ProductDescriptionSections';
import { paragraphs } from '@/data/productCopy';
import { resolveStorefrontDetail } from '@/lib/catalog/resolveStorefrontDetail';
import {
  labelRequestedFormulation,
  validateMembershipRequestedFormulation,
} from '@/lib/membership/requestedFormulation';
import {
  buildPurchaseOptions,
  type PurchaseOptionKind,
} from '@/lib/pricing/purchaseOptions';
import { loadPurchaseDiscountSettings } from '@/lib/pricing/settings';
import { skuForVariantId } from '@/data/variantSkus';
import {
  resolveClientGenApiOrdersEnabledForUx,
  resolveStorefrontRxAvailability,
} from '@/lib/commerce/rxCatalogReadiness';
import { RxAvailabilityBanner } from '@/components/RxAvailabilityBanner';
import { GEN_HOSTED_PRODUCTS } from '@/lib/commerce/genHostedProducts';
import { GenHostedProductPage } from '@/components/GenHostedProductPage';

function customerVariantLabel(productSlug: string, fallback: string): string {
  const peptideLabels: Record<string, string> = {
    'fat-burner': 'Fat Burner Peptide',
    'selank': 'Calm-Focus Support',
    'semax': 'Cognitive Support',
    'selank-semax-nasal-spray': 'Calm-Focus Support Nasal',
    'tesamorelin': 'Metabolic Support',
    'bpc-157-tb-500': 'Recovery Support',
  };
  if (productSlug === 'nad-plus') {
    if (/10\s*mL/i.test(fallback)) return 'NAD+ Injection · 10 mL';
    if (/5\s*mL/i.test(fallback)) return 'NAD+ Injection · 5 mL';
    return 'NAD+ Nasal Spray';
  }
  return peptideLabels[productSlug] ?? fallback;
}

const MAIN_PEPTIDE_LABEL_SLUGS = new Set([
  'fat-burner',
  'selank',
  'semax',
  'selank-semax-nasal-spray',
  'tesamorelin',
  'bpc-157-tb-500',
]);

/** Router — accessories get a simplified ecommerce page; wellness keeps existing purchase logic. */
export function ProductPage({ slug }: { slug: string }) {
  const detail = resolveStorefrontDetail(slug);
  if (detail.kind === 'membership') {
    if (WEBSITE_FAMILY_CUTOVER_ENABLED) {
      const familySlug =
        detail.membership.slug === 'semaglutide-membership'
          ? 'semaglutide'
          : detail.membership.slug === 'tirzepatide-membership'
            ? 'tirzepatide'
            : null;
      const familyProduct = familySlug ? getProduct(familySlug) : undefined;
      if (familyProduct && isFamilyStorefrontSlug(familyProduct.slug)) {
        return <FamilyProductPage product={familyProduct} initialPurchaseType="membership" />;
      }
    }
    return <MembershipDetailPage membership={detail.membership} />;
  }
  if (detail.kind === 'not_found') {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500">Product not found.</p>
        <Link to="/" className="btn-outline mt-6">Back home</Link>
      </div>
    );
  }
  const product = detail.product;
  if (product.category === 'accessories') {
    return <AccessoryProductPage product={product} />;
  }
  if (product.category === 'provider-care') {
    return <ProviderCareProductPage product={product} />;
  }
  const hostedRoute = GEN_HOSTED_PRODUCTS[product.slug];
  if (hostedRoute) return <GenHostedProductPage product={product} route={hostedRoute} />;
  if (isFamilyStorefrontSlug(product.slug)) {
    return <FamilyProductPage product={product} />;
  }
  return <WellnessProductPage slug={slug} />;
}

function ProviderCareProductPage({ product }: { product: NonNullable<ReturnType<typeof getProduct>> }) {
  const section = sections.find(s => s.id === product.category);
  const variant = product.variants[0];

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <div className="container-lux py-4">
        <div className="flex items-center gap-2 text-sm text-ink-400 flex-wrap">
          <Link to="/" className="hover:text-ink-900">Home</Link>
          <span>/</span>
          <Link to="/section/provider-care" className="hover:text-ink-900">{section?.label}</Link>
          <span>/</span>
          <span className="text-ink-700">{product.displayName}</span>
        </div>
      </div>

      <section className="pb-12 md:pb-16">
        <div className="container-lux">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream-100">
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-cream-50/95 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-900">
                    GEN Health checkout
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider-2 text-gold-600">
                  <ShieldCheck size={16} /> {section?.label}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-2 leading-tight">{product.displayName}</h1>
              <p className="text-xl md:text-2xl text-ink-700 mb-3 leading-snug">{product.benefitHeadline}</p>
              <p className="text-ink-600 leading-relaxed mb-5">{product.shortDescription}</p>
              <ProductHighlights highlights={product.highlights} />

              <div className="mb-6 rounded-xl border border-gold-200 bg-gold-50 p-4">
                <p className="text-sm font-medium text-ink-900">Handled in GEN Health</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">
                  Provider Care checkout, scheduling, intake, and payment are handled through GEN Health.
                  These services are not purchased through the My Bare Method cart.
                </p>
              </div>

              {variant && (
                <div className="mb-6 rounded-xl border border-cream-300 bg-white p-4">
                  <p className="text-sm text-ink-500">Due in GEN Health</p>
                  <p className="font-serif text-3xl text-ink-900">${variant.price}</p>
                  <p className="mt-1 text-xs text-ink-500">Final amount and required steps are confirmed in GEN Health.</p>
                </div>
              )}

              <a
                href="mailto:info@thebaremethodmn.com?subject=Provider%20Care%20GEN%20Health%20checkout"
                className="btn-primary w-full justify-center"
              >
                Contact Us to Continue in GEN Health
              </a>

              <ProductDescriptionSections product={product} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WellnessProductPage({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const { addItem } = useCart();
  const { isActiveMember } = useMember();
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  /** null = default to Subscribe & Save when eligible. */
  const [selectedKind, setSelectedKind] = useState<PurchaseOptionKind | null>(null);
  const [requestedFormulation, setRequestedFormulation] = useState('');
  const [doseError, setDoseError] = useState<string | null>(null);
  const settings = useMemo(() => loadPurchaseDiscountSettings(), []);

  const variant = product
    ? product.variants[Math.min(variantIndex, product.variants.length - 1)]
    : null;
  const options = useMemo(() => {
    if (!product || !variant) return [];
    return buildPurchaseOptions({
      standardPrice: variant.price,
      product,
      isActiveMember,
      settings,
      selectedVariant: variant,
    });
  }, [product, variant, isActiveMember, settings]);

  const preferredDefault: PurchaseOptionKind = options.some(o => o.kind === 'auto_refill')
    ? 'auto_refill'
      : options.some(o => o.kind === 'one_time')
        ? 'one_time'
        : (options[0]?.kind ?? 'one_time');

  const resolvedKind = selectedKind ?? preferredDefault;

  const selected =
    options.find(o => o.kind === resolvedKind) ??
    options.find(o => o.kind === 'one_time') ??
    options[0];

  if (!product || !variant) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500">Product not found.</p>
        <Link to="/" className="btn-outline mt-6">Back home</Link>
      </div>
    );
  }

  const section = sections.find(s => s.id === product.category);
  const related = getRelatedProducts(product);
  const isProgramMembership = selected?.kind === 'membership_program';
  const containFit = false;

  const variantSku = skuForVariantId(variant.id);
  const rxAvailability = resolveStorefrontRxAvailability({
    mbmSku: variantSku,
    // UX-only mirror — server GEN_API_ORDERS_ENABLED remains authoritative.
    genApiOrdersEnabled: resolveClientGenApiOrdersEnabledForUx(),
  });
  // Prescription products that do not yet have an owner-verified GEN hosted
  // route must never fall back to the historical Tagada checkout.
  const genNativeCheckoutUnavailable = true;
  const purchaseBlocked =
    genNativeCheckoutUnavailable ||
    (!!rxAvailability &&
      !rxAvailability.productionPurchasable &&
      selected?.kind !== 'membership_program');
  const publicVariantLabel = customerVariantLabel(product.slug, variant.label);

  const handlePrimaryAction = () => {
    if (!selected) return;
    if (purchaseBlocked) return;

    if (selected.kind === 'membership_program' && selected.program) {
      const membership = getMembership(selected.program.membershipSlug);
      const included =
        membership?.includedFormulations ?? selected.program.includedFormulations ?? [];
      const validated = validateMembershipRequestedFormulation({
        requestedFormulation,
        includedFormulations: included,
      });
      if (!validated.ok) {
        setDoseError(validated.error);
        return;
      }
      setDoseError(null);
      const doseLabel = labelRequestedFormulation(validated.value);
      addItem({
        productId: selected.program.checkoutProductId,
        slug: selected.program.membershipSlug,
        name: selected.program.cartLabel,
        price: selected.program.monthlyPrice,
        standardPrice: selected.program.monthlyPrice,
        image: membership?.image ?? product.image,
        subscription: true,
        section: 'membership',
        requiresIntake: true,
        isMembership: true,
        billingFrequency: 'monthly',
        purchaseType: 'membership_program',
        discountPercent: 0,
        appliedDiscount: 'none',
        requestedFormulation: validated.value,
        variantLabel: `Requested dose: ${doseLabel}`,
      }, 1);
      return;
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.displayName,
      price: selected.finalPrice,
      standardPrice: variant.price,
      image: product.image,
      subscription: selected.kind === 'auto_refill',
      section: product.category,
      requiresIntake: product.requiresProviderReview,
      variantId: variant.id,
      variantLabel:
        selected.appliedDiscount === 'member'
          ? `${publicVariantLabel} · Member price`
          : publicVariantLabel,
      purchaseType: selected.kind === 'auto_refill' ? 'auto_refill' : 'one_time',
      discountPercent: selected.discountPercent,
      appliedDiscount: selected.appliedDiscount,
      billingFrequency: selected.kind === 'auto_refill' ? 'monthly' : undefined,
    }, quantity);
  };

  const primaryLabel = () => {
    if (!selected) return 'Add to Cart';
    if (selected.kind === 'membership_program') return selected.cta;
    return `${selected.cta} — $${(selected.finalPrice * quantity).toFixed(2)}`;
  };

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
                  {options.some(option => option.kind === 'auto_refill') && (
                    <span className="rounded-full bg-gold-400 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-900">
                      Subscribe &amp; Save {settings.memberDiscountPercent}%
                    </span>
                  )}
                  {product.requiresProviderReview && (
                    <span className="rounded-full bg-cream-50/95 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-900">Provider review required</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider-2 text-gold-600">
                  <ShieldCheck size={16} /> {section?.label}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-2 leading-tight">{product.displayName}</h1>
              <p className="text-xl md:text-2xl text-ink-700 mb-3 leading-snug">{product.benefitHeadline}</p>
              <p className="text-ink-600 leading-relaxed mb-5">{product.shortDescription}</p>
              <ProductHighlights highlights={product.highlights} />

              <div className="mb-6">
                <h2 className="font-serif text-2xl text-ink-900 mb-3">About This Product</h2>
                <div className="space-y-3">
                  {paragraphs(product.longDescription).map((p, i) => (
                    <p key={i} className="text-ink-600 leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>

              {rxAvailability && rxAvailability.customerFacingStatus !== 'AVAILABLE' ? (
                <div className="mb-6">
                  <RxAvailabilityBanner
                    status={rxAvailability.customerFacingStatus}
                    message={rxAvailability.customerMessage}
                  />
                </div>
              ) : null}

              {genNativeCheckoutUnavailable && !rxAvailability ? (
                <div className="mb-6 rounded-xl border border-gold-200 bg-gold-50 p-4">
                  <p className="text-sm font-medium text-ink-900">Online enrollment is being connected</p>
                  <p className="mt-1 text-sm text-ink-600">
                    This prescription product is not yet available through the secure GEN Health payment and intake flow.
                  </p>
                </div>
              ) : null}

              <div className="mb-6">
                <p className="text-sm font-medium text-ink-900 mb-2">
                  {isProgramMembership
                    ? 'Formulations in this program'
                    : MAIN_PEPTIDE_LABEL_SLUGS.has(product.slug)
                      ? 'Product'
                    : product.dosageForms.length > 1
                      ? 'Select form & strength'
                      : 'Select strength'}
                </p>
                {isProgramMembership && (
                  <p className="mb-3 text-xs text-ink-500 leading-relaxed">
                    Wellness Membership is a flat monthly rate. Customers do not select a membership dose — your
                    licensed provider determines the appropriate formulation and strength. Strength selection below
                    only affects One-Time Purchase pricing.
                  </p>
                )}
                <div className="space-y-2">
                  {product.variants.map((v, i) => {
                    const selectedVariant = i === variantIndex;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVariantIndex(i)}
                        aria-pressed={selectedVariant}
                        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                          selectedVariant ? 'border-gold-400 bg-gold-50' : 'border-ink-200 bg-white hover:border-gold-200'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${selectedVariant ? 'border-gold-500' : 'border-ink-300'}`}>
                            {selectedVariant && <span className="h-2 w-2 rounded-full bg-gold-500" />}
                          </span>
                          <span className="text-sm text-ink-800">{customerVariantLabel(product.slug, v.label)}</span>
                        </span>
                        <span className="font-medium text-ink-900">${v.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-cream-300 bg-white p-5 space-y-3">
                <p className="text-sm font-medium text-ink-900">Choose how you’d like to purchase</p>

                {options.map(option => {
                  const isSelected = selected?.kind === option.kind;
                  const isFlatMembership = option.kind === 'membership_program';
                  const isPercentMembership = option.kind === 'active_membership';
                  const isMembershipOption = isFlatMembership || isPercentMembership;
                  const showBestValueRibbon = isMembershipOption && !(isPercentMembership && isActiveMember);
                  const hideMemberCta = isPercentMembership && isActiveMember;
                  const program = option.program;
                  return (
                    <button
                      key={option.kind}
                      type="button"
                      onClick={() => setSelectedKind(option.kind)}
                      aria-pressed={isSelected}
                      className={`relative w-full overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
                        isMembershipOption
                          ? isSelected
                            ? 'border-gold-400 bg-gradient-to-br from-gold-50 via-cream-50 to-white shadow-sm ring-1 ring-gold-300/60'
                            : 'border-gold-300/70 bg-gradient-to-br from-gold-50/80 via-white to-white hover:border-gold-400'
                          : isSelected
                            ? 'border-gold-400 bg-gold-50/40'
                            : 'border-cream-200 hover:border-gold-200'
                      }`}
                    >
                      {showBestValueRibbon && (
                        <span
                          className="pointer-events-none absolute -right-9 top-3 w-32 rotate-45 bg-gold-400/95 py-1 text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-900 shadow-sm"
                          aria-hidden="true"
                        >
                          Best Value
                        </span>
                      )}
                      <div className="flex items-start justify-between gap-3 pr-6">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-ink-900">
                              {option.label}
                            </span>
                            {option.badge && !showBestValueRibbon && (
                              <span className="rounded-full bg-gold-400/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-900">
                                {option.badge}
                              </span>
                            )}
                            {isMembershipOption && isSelected && showBestValueRibbon && (
                              <span className="text-[10px] font-medium uppercase tracking-wider text-gold-700">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-ink-500 leading-relaxed mb-2">{option.description}</p>
                          {isFlatMembership && program && (
                            <div className="space-y-2 mb-1">
                              <ul className="space-y-1">
                                {program.includedFormulations.map(f => (
                                  <li key={f} className="flex items-start gap-1.5 text-[11px] text-ink-600">
                                    <Check size={12} className="mt-0.5 shrink-0 text-gold-600" />
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="text-[11px] text-ink-500 leading-relaxed">{program.customerNote}</p>
                              {program.memberOnlyNotice && (
                                <div className="rounded-lg border border-ink-200 bg-cream-50 p-3">
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-800">
                                    {program.memberOnlyNotice.title}
                                  </p>
                                  <p className="mt-1 font-serif text-xl text-ink-900">
                                    ${program.memberOnlyNotice.monthlyPrice}
                                    <span className="text-sm text-ink-500">/month</span>
                                  </p>
                                  <p className="mt-1 text-[11px] text-ink-600 leading-relaxed">
                                    {program.memberOnlyNotice.description}
                                  </p>
                                  <p className="mt-1.5 text-[10px] text-ink-500">
                                    Not available for self-serve purchase. Requires active membership, provider
                                    direction, and authorized admin approval.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          {isPercentMembership && !isActiveMember && (
                            <p className="text-xs text-gold-700">Members Save {settings.memberDiscountPercent}% · Preferred member pricing</p>
                          )}
                          {hideMemberCta && (
                            <p className="text-xs text-gold-700 font-medium">Save {option.discountPercent}% · best available pricing</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {!isFlatMembership && option.savingsAmount > 0 && (
                            <p className="text-xs text-ink-400 line-through">${option.standardPrice.toFixed(2)}</p>
                          )}
                          <p className="font-serif text-2xl text-ink-900">
                            ${option.finalPrice.toFixed(2)}
                            {option.recurring || isFlatMembership ? <span className="text-sm text-ink-500">/mo</span> : null}
                          </p>
                          {isFlatMembership ? (
                            <p className="text-xs text-ink-500">flat rate</p>
                          ) : option.savingsAmount > 0 ? (
                            <p className="text-xs text-gold-700">Save ${option.savingsAmount.toFixed(2)}</p>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {isProgramMembership && selected?.program && (
                  <div className="rounded-xl border border-cream-300 bg-cream-50/80 p-4">
                    <MembershipRequestedDoseField
                      id={`pdp-requested-dose-${selected.program.membershipSlug}`}
                      includedFormulations={
                        getMembership(selected.program.membershipSlug)?.includedFormulations ??
                        selected.program.includedFormulations
                      }
                      value={requestedFormulation}
                      onChange={v => {
                        setRequestedFormulation(v);
                        setDoseError(null);
                      }}
                    />
                    {doseError && <p className="mt-2 text-xs text-red-700">{doseError}</p>}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  {!isProgramMembership && (
                    <div className="flex items-center gap-2 rounded-full border border-ink-200 px-3 py-1.5">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-ink-500 hover:text-ink-900" aria-label="Decrease quantity" disabled={purchaseBlocked}><Minus size={16} /></button>
                      <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="text-ink-500 hover:text-ink-900" aria-label="Increase quantity" disabled={purchaseBlocked}><Plus size={16} /></button>
                    </div>
                  )}
                  <button
                    onClick={handlePrimaryAction}
                    className="btn-primary flex-1 text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={purchaseBlocked}
                    aria-disabled={purchaseBlocked}
                  >
                    {purchaseBlocked
                      ? rxAvailability?.customerFacingStatus === 'COMING_SOON'
                        ? 'Coming soon'
                        : 'Temporarily unavailable'
                      : primaryLabel()}
                  </button>
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-gold-50 p-3 text-sm text-gold-800">
                  <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
                  <p>{product.providerDisclaimer}</p>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs text-ink-500">
                  <div className="flex flex-col items-center gap-1"><Truck size={16} className="text-gold-500" /> Discreet shipping</div>
                  <div className="flex flex-col items-center gap-1"><ShieldCheck size={16} className="text-gold-500" /> Secure checkout</div>
                  <div className="flex flex-col items-center gap-1"><RefreshCw size={16} className="text-gold-500" /> {selected?.kind === 'membership_program' ? 'Monthly membership billing' : 'Provider-reviewed'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-lux -mt-8 pb-16 lg:-mt-16">
        <div className="lg:ml-[calc(50%+2rem)] lg:w-[calc(50%-2rem)] border-t border-cream-300 pt-8">
          <ProductDescriptionSections product={product} showAbout={false} />
        </div>
      </div>

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
