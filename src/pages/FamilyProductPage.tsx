import { useMemo, useState } from 'react';
import { Minus, Plus, ShieldCheck } from 'lucide-react';
import { Link } from '@/router';
import {
  getMembership,
  getRelatedProducts,
  sections,
  type Product,
} from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';
import { ProductDescriptionSections, ProductHighlights } from '@/components/ProductDescriptionSections';
import { Glp1FormulationSelector, Glp1PatientDoseSelector } from '@/components/Glp1PatientDoseSelector';
import {
  getWebsiteFamilyBySlug,
  listPatientVisibleVariants,
  lockedRetailPrice,
  resolveFamilyVariant,
  skuForFamilyVariantId,
  WEBSITE_FAMILY_CUTOVER_ENABLED,
  type FamilySelectorState,
  type WebsiteProductFamily,
  type WebsiteProductVariant,
} from '@/data/websiteFamilies';
import { buildGlp1MembershipCartFields } from '@/lib/glp1/membershipCart';
import {
  ONE_TIME_GETTING_STARTED_BLOCKER,
  isGettingStartedDose,
  patientSafeOneTimeCartLabel,
  resolveOneTimeVial,
} from '@/lib/glp1/oneTimeVialMapping';
import {
  doseSelectionAfterPurchaseTypeChange,
  ONE_TIME_WEEKLY_DOSE_REQUIRED,
  validateGlp1Formulation,
  validateRequestedDose,
  type Glp1FamilyId,
} from '@/lib/glp1/patientRequestedDose';

function unique(values: Array<string | null | undefined>): string[] {
  const out: string[] = [];
  for (const v of values) {
    const s = (v || '').trim();
    if (s && !out.includes(s)) out.push(s);
  }
  return out;
}

function formatPrice(amount: number, membership: boolean): string {
  return membership ? `$${amount.toFixed(0)}/mo` : `$${amount.toFixed(2)}`;
}

function variantLabel(v: WebsiteProductVariant): string {
  const raw =
    v.displayLabel || [v.form, v.additive].filter(Boolean).join(' · ');
  return raw
    .replace(/\s*\(\d+\+\d+\)/g, '')
    .replace(/\s*\(\d+[–-]\d+\)/g, '')
    .replace(/COMPOUND — ANY DOSE\s*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s·\s·/g, ' · ')
    .trim();
}

export function isFamilyStorefrontSlug(slug: string): boolean {
  if (!WEBSITE_FAMILY_CUTOVER_ENABLED) return false;
  const family = getWebsiteFamilyBySlug(slug);
  if (!family) return false;
  return listPatientVisibleVariants(family).length > 0;
}

export function FamilyProductPage({
  product,
  initialPurchaseType,
}: {
  product: Product;
  initialPurchaseType?: 'one_time' | 'membership';
}) {
  const family = getWebsiteFamilyBySlug(product.slug);
  const { addItem, openCart } = useCart();
  const related = getRelatedProducts(product);
  const section = sections.find((s) => s.id === product.category);

  if (!family) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500">Product not found.</p>
        <Link to="/shop-all" className="btn-outline mt-6">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <FamilySelectors
      product={product}
      family={family}
      related={related}
      sectionLabel={section?.label}
      addItem={addItem}
      openCart={openCart}
      initialPurchaseType={initialPurchaseType}
    />
  );
}

function FamilySelectors({
  product,
  family,
  related,
  sectionLabel,
  addItem,
  openCart,
  initialPurchaseType,
}: {
  product: Product;
  family: WebsiteProductFamily;
  related: Product[];
  sectionLabel?: string;
  addItem: ReturnType<typeof useCart>['addItem'];
  openCart: () => void;
  initialPurchaseType?: 'one_time' | 'membership';
}) {
  const visible = listPatientVisibleVariants(family);
  const familyId = family.familyId;
  const isWeight = familyId === 'semaglutide' || familyId === 'tirzepatide';
  const isNad = familyId === 'nad';
  const isWolverine = familyId === 'wolverine-bpc-tb';

  const purchaseTypes = unique(visible.map((v) => v.purchaseType));
  const oneTime = visible.filter((v) => v.purchaseType === 'one_time');
  const additives = unique(oneTime.map((v) => v.additive));
  const forms = unique(visible.map((v) => v.form));
  const nasalOptions = unique(
    visible.filter((v) => (v.form || '').toLowerCase().includes('nasal')).map((v) => v.websiteVariantId),
  );

  const [purchaseType, setPurchaseType] = useState<'one_time' | 'membership'>(
    initialPurchaseType === 'membership' && purchaseTypes.includes('membership')
      ? 'membership'
      : purchaseTypes.includes('one_time')
        ? 'one_time'
        : 'membership',
  );
  const [additive, setAdditive] = useState(additives[0] || 'Vitamin B12');
  const [form, setForm] = useState(forms[0] || '');
  const [nasalOption, setNasalOption] = useState<'r84' | 'r85'>(
    nasalOptions.includes('nad-nasal-r85') && !nasalOptions.includes('nad-nasal-r84') ? 'r85' : 'r84',
  );
  const [injPackage, setInjPackage] = useState<'5mL' | '10mL'>('5mL');
  const [quantity, setQuantity] = useState(1);
  const [requestedDose, setRequestedDose] = useState('');
  const [doseError, setDoseError] = useState<string | null>(null);
  const glp1FamilyId: Glp1FamilyId | null =
    familyId === 'semaglutide' || familyId === 'tirzepatide' ? familyId : null;

  const selectors: FamilySelectorState = useMemo(() => {
    if (isWeight) {
      return {
        purchaseType,
        additive: purchaseType === 'membership' ? undefined : additive,
        requestedDose:
          purchaseType === 'one_time' && requestedDose ? requestedDose : undefined,
      };
    }
    if (isNad) {
      return { form, nasalOption, package: injPackage };
    }
    if (isWolverine) {
      return { form };
    }
    return {};
  }, [isWeight, isNad, isWolverine, purchaseType, additive, requestedDose, form, nasalOption, injPackage]);

  const resolution = useMemo(
    () => resolveFamilyVariant(familyId, selectors),
    [familyId, selectors],
  );
  const variant = resolution.variant;
  const price = variant ? lockedRetailPrice(variant) : null;
  const isMembership = isWeight && purchaseType === 'membership';
  const membership = isMembership
    ? getMembership(familyId === 'semaglutide' ? 'semaglutide-membership' : 'tirzepatide-membership')
    : undefined;

  const injReady = visible.some((v) => v.websiteVariantId.startsWith('nad-inj-'));
  const nasalReady = visible.some((v) => v.websiteVariantId.startsWith('nad-nasal-'));
  const r84Ready = visible.some((v) => v.websiteVariantId === 'nad-nasal-r84');
  const r85Ready = visible.some((v) => v.websiteVariantId === 'nad-nasal-r85');

  const handleAdd = () => {
    if (glp1FamilyId) {
      if (isMembership) {
        if (!membership) return;
        const built = buildGlp1MembershipCartFields({
          membership,
          formulation: additive,
          requestedDose,
        });
        if (!built.ok) {
          setDoseError(built.error);
          return;
        }
        setDoseError(null);
        addItem(
          {
            productId: membership.checkoutProductId || membership.id,
            slug: membership.slug,
            name: membership.displayName,
            price: built.monthlyPrice,
            standardPrice: built.monthlyPrice,
            image: membership.image,
            subscription: true,
            section: 'membership',
            requiresIntake: true,
            isMembership: true,
            billingFrequency: 'monthly',
            purchaseType: 'membership_program',
            discountPercent: 0,
            appliedDiscount: 'none',
            requestedFormulation: built.requestedFormulation,
            requestedDose: built.requestedDose,
            variantLabel: built.variantLabel,
          },
          1,
        );
        openCart();
        return;
      }

      const formulation = validateGlp1Formulation(additive);
      if (!formulation.ok) {
        setDoseError(formulation.error);
        return;
      }
      const vial = resolveOneTimeVial({
        familyId: glp1FamilyId,
        formulation: formulation.value,
        requestedDose,
      });
      if (!vial.ok) {
        setDoseError(vial.error);
        return;
      }
      setDoseError(null);
      const mappedPrice = vial.mapping.retailPriceCents / 100;

      addItem(
        {
          productId: product.id,
          slug: product.slug,
          name: product.displayName,
          price: mappedPrice,
          standardPrice: mappedPrice,
          image: product.image,
          subscription: false,
          section: product.category,
          requiresIntake: product.requiresProviderReview,
          variantId: vial.mapping.websiteVariantId,
          variantLabel: patientSafeOneTimeCartLabel({
            formulation: formulation.value,
            requestedDose: vial.mapping.requestedDose,
          }),
          purchaseType: 'one_time',
          discountPercent: 0,
          appliedDiscount: 'none',
          requestedFormulation: formulation.value,
          requestedDose: vial.mapping.requestedDose,
        },
        quantity,
      );
      void skuForFamilyVariantId(vial.mapping.websiteVariantId);
      openCart();
      return;
    }

    if (!variant || price == null) return;

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.displayName,
        price,
        standardPrice: price,
        image: product.image,
        subscription: false,
        section: product.category,
        requiresIntake: product.requiresProviderReview,
        variantId: variant.websiteVariantId,
        variantLabel: variantLabel(variant),
        purchaseType: 'one_time',
        discountPercent: 0,
        appliedDiscount: 'none',
      },
      quantity,
    );
    openCart();
  };

  const oneTimeVial =
    glp1FamilyId && !isMembership
      ? resolveOneTimeVial({
          familyId: glp1FamilyId,
          formulation: additive,
          requestedDose,
        })
      : null;
  const oneTimeGettingStarted = Boolean(
    glp1FamilyId && !isMembership && isGettingStartedDose(requestedDose),
  );
  const glp1Ready =
    !glp1FamilyId ||
    (validateGlp1Formulation(additive).ok &&
      validateRequestedDose({
        requestedDose,
        familyId: glp1FamilyId,
        allowGettingStarted: isMembership,
      }).ok);
  const displayPrice =
    isMembership && membership
      ? membership.monthlyPrice
      : oneTimeVial?.ok
        ? oneTimeVial.mapping.retailPriceCents / 100
        : price;
  const canAdd = isMembership
    ? Boolean(membership && resolution.ok && glp1Ready)
    : glp1FamilyId
      ? Boolean(oneTimeVial?.ok && glp1Ready)
      : Boolean(variant && price != null && resolution.ok);

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <div className="container-lux py-4">
        <div className="flex items-center gap-2 text-sm text-ink-400 flex-wrap">
          <Link to="/" className="hover:text-ink-900">
            Home
          </Link>
          <span>/</span>
          <Link to={`/section/${product.category}`} className="hover:text-ink-900">
            {sectionLabel}
          </Link>
          <span>/</span>
          <span className="text-ink-700">{family.displayName}</span>
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
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  {product.bestSeller && (
                    <span className="rounded-full bg-ink-900 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-50">
                      Best Seller
                    </span>
                  )}
                  {product.requiresProviderReview && (
                    <span className="rounded-full bg-cream-50/95 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-900">
                      Provider review required
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider-2 text-gold-600">
                  <ShieldCheck size={16} /> {sectionLabel}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-2 leading-tight">
                {family.displayName}
              </h1>
              <p className="text-xl md:text-2xl text-ink-700 mb-3 leading-snug">{product.benefitHeadline}</p>
              <p className="text-ink-600 leading-relaxed mb-5">{product.shortDescription}</p>
              <ProductHighlights highlights={product.highlights} />

              <div className="mb-6 space-y-5">
                {isWeight && purchaseTypes.length > 1 && (
                  <fieldset>
                    <legend className="text-sm font-medium text-ink-900 mb-2">Purchase type</legend>
                    <div className="flex flex-wrap gap-2">
                      {purchaseTypes.includes('one_time') && (
                        <SelectorChip
                          selected={purchaseType === 'one_time'}
                          onClick={() => {
                            setPurchaseType('one_time');
                            const nextDose = doseSelectionAfterPurchaseTypeChange({
                              nextPurchaseType: 'one_time',
                              requestedDose,
                            });
                            if (nextDose !== requestedDose) {
                              setRequestedDose(nextDose);
                              setDoseError(ONE_TIME_WEEKLY_DOSE_REQUIRED);
                            } else {
                              setDoseError(null);
                            }
                          }}
                          label="One-Time Purchase"
                        />
                      )}
                      {purchaseTypes.includes('membership') && (
                        <SelectorChip
                          selected={purchaseType === 'membership'}
                          onClick={() => {
                            setPurchaseType('membership');
                            setDoseError(null);
                          }}
                          label={
                            familyId === 'semaglutide'
                              ? 'Wellness Membership · $125/month'
                              : 'Wellness Membership · $179/month'
                          }
                        />
                      )}
                    </div>
                  </fieldset>
                )}

                {isWeight && (
                  <Glp1FormulationSelector
                    value={additive}
                    onChange={opt => {
                      setAdditive(opt);
                      setDoseError(null);
                    }}
                  />
                )}

                {glp1FamilyId && (
                  <Glp1PatientDoseSelector
                    familyId={glp1FamilyId}
                    value={requestedDose}
                    allowGettingStarted={isMembership}
                    onChange={next => {
                      setRequestedDose(next);
                      setDoseError(null);
                    }}
                  />
                )}

                {oneTimeGettingStarted && (
                  <p className="text-xs text-ink-600 leading-relaxed">{ONE_TIME_GETTING_STARTED_BLOCKER}</p>
                )}

                {isNad && (
                  <fieldset>
                    <legend className="text-sm font-medium text-ink-900 mb-2">Delivery method</legend>
                    <div className="flex flex-wrap gap-2">
                      <SelectorChip
                        selected={false}
                        disabled
                        onClick={() => undefined}
                        label="Injection · Temporarily unavailable"
                      />
                      {nasalReady && (
                        <SelectorChip
                          selected={form === 'Nasal Spray' || !form}
                          onClick={() => setForm('Nasal Spray')}
                          label="Nasal Spray"
                        />
                      )}
                    </div>
                    <p className="mt-2 text-xs text-ink-500 leading-relaxed">
                      Injection is temporarily unavailable. Nasal spray remains available after provider review.
                    </p>
                  </fieldset>
                )}

                {isNad && form === 'Injection' && injReady && (
                  <fieldset>
                    <legend className="text-sm font-medium text-ink-900 mb-2">Package</legend>
                    <div className="flex flex-wrap gap-2">
                      {visible.some((v) => v.websiteVariantId === 'nad-inj-5ml-500') && (
                        <SelectorChip
                          selected={injPackage === '5mL'}
                          onClick={() => setInjPackage('5mL')}
                          label="5 mL / 500 mg"
                        />
                      )}
                      {visible.some((v) => v.websiteVariantId === 'nad-inj-10ml-1000') && (
                        <SelectorChip
                          selected={injPackage === '10mL'}
                          onClick={() => setInjPackage('10mL')}
                          label="10 mL / 1000 mg"
                        />
                      )}
                    </div>
                  </fieldset>
                )}

                {isNad && form === 'Nasal Spray' && r84Ready && r85Ready && (
                  <fieldset>
                    <legend className="text-sm font-medium text-ink-900 mb-2">Nasal option</legend>
                    <div className="flex flex-wrap gap-2">
                      {r84Ready && (
                        <SelectorChip
                          selected={nasalOption === 'r84'}
                          onClick={() => setNasalOption('r84')}
                          label="50 mg/mL · 15 mL"
                        />
                      )}
                      {r85Ready && (
                        <SelectorChip
                          selected={nasalOption === 'r85'}
                          onClick={() => setNasalOption('r85')}
                          label="200 mg/mL · 15 mL"
                        />
                      )}
                    </div>
                  </fieldset>
                )}

                {isWolverine && forms.length > 0 && (
                  <fieldset>
                    <legend className="text-sm font-medium text-ink-900 mb-2">Form</legend>
                    <div className="flex flex-wrap gap-2">
                      {forms.map((opt) => (
                        <SelectorChip
                          key={opt}
                          selected={form === opt}
                          onClick={() => setForm(opt)}
                          label={opt}
                        />
                      ))}
                    </div>
                  </fieldset>
                )}
              </div>

              {doseError ? (
                <p className="mb-4 text-xs text-red-700">{doseError}</p>
              ) : null}

              <div className="rounded-2xl border border-cream-300 bg-white p-5 mb-6">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-ink-500">{isMembership ? 'Membership' : 'Due today'}</p>
                    <p className="font-serif text-3xl text-ink-900">
                      {displayPrice != null ? formatPrice(displayPrice, isMembership) : '—'}
                    </p>
                    {!isMembership && (
                      <p className="mt-1 text-xs text-ink-500">Pharmacy fulfillment included in this price</p>
                    )}
                  </div>
                  {!isMembership && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="rounded-full border border-ink-200 p-2"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center text-ink-900">{quantity}</span>
                      <button
                        type="button"
                        className="rounded-full border border-ink-200 p-2"
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-primary w-full"
                  disabled={!canAdd}
                  onClick={handleAdd}
                >
                  {isMembership
                    ? membership?.cta || 'Join membership'
                    : oneTimeGettingStarted
                      ? 'Choose a weekly dose or join membership'
                      : canAdd
                        ? `Add to Cart — $${((displayPrice || 0) * quantity).toFixed(2)}`
                        : 'Select an option'}
                </button>
                <p className="mt-3 text-xs text-ink-500 leading-relaxed">
                  Provider review is required. Purchasing does not guarantee a prescription. Applicable taxes are
                  included in displayed prices where required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-t border-cream-300">
        <div className="container-lux max-w-4xl">
          <ProductDescriptionSections product={product} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="pb-24">
          <div className="container-lux">
            <h2 className="font-serif text-2xl text-ink-900 mb-6">You may also consider</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function SelectorChip({
  selected,
  onClick,
  label,
  disabled,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      className={`rounded-full px-4 py-2 text-sm border transition-colors ${
        disabled
          ? 'border-ink-100 bg-cream-100 text-ink-400 cursor-not-allowed'
          : selected
            ? 'border-ink-900 bg-ink-900 text-white'
            : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400'
      }`}
    >
      {label}
    </button>
  );
}
