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
import { MembershipRequestedDoseField } from '@/components/MembershipRequestedDoseField';
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
import {
  labelRequestedFormulation,
  validateMembershipRequestedFormulation,
} from '@/lib/membership/requestedFormulation';

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
    v.displayLabel || [v.form, v.additive, v.doseTier].filter(Boolean).join(' · ');
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
  const doseOptions = unique(
    oneTime.filter((v) => !additive || (v.additive || '') === additive).map((v) => v.doseTier),
  );
  const [doseTier, setDoseTier] = useState(doseOptions[0] || 'Starting / Low');
  const [form, setForm] = useState(forms[0] || '');
  const [nasalOption, setNasalOption] = useState<'r84' | 'r85'>(
    nasalOptions.includes('nad-nasal-r85') && !nasalOptions.includes('nad-nasal-r84') ? 'r85' : 'r84',
  );
  const [injPackage, setInjPackage] = useState<'5mL' | '10mL'>('5mL');
  const [quantity, setQuantity] = useState(1);
  const [requestedFormulation, setRequestedFormulation] = useState('');
  const [doseError, setDoseError] = useState<string | null>(null);

  const availableDoses = unique(
    oneTime.filter((v) => !additive || (v.additive || '') === additive).map((v) => v.doseTier),
  );

  const selectors: FamilySelectorState = useMemo(() => {
    if (isWeight) {
      return {
        purchaseType,
        additive: purchaseType === 'membership' ? undefined : additive,
        doseTier: purchaseType === 'membership' ? undefined : doseTier,
      };
    }
    if (isNad) {
      return { form, nasalOption, package: injPackage };
    }
    if (isWolverine) {
      return { form };
    }
    return {};
  }, [isWeight, isNad, isWolverine, purchaseType, additive, doseTier, form, nasalOption, injPackage]);

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
    if (!variant || price == null) return;

    if (isMembership && membership) {
      const included = membership.includedFormulations;
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
      addItem(
        {
          productId: membership.checkoutProductId || membership.id,
          slug: membership.slug,
          name: membership.displayName,
          price: membership.monthlyPrice,
          standardPrice: membership.monthlyPrice,
          image: membership.image,
          subscription: true,
          section: 'membership',
          requiresIntake: true,
          isMembership: true,
          billingFrequency: 'monthly',
          purchaseType: 'membership_program',
          discountPercent: 0,
          appliedDiscount: 'none',
          requestedFormulation: validated.value,
          variantLabel: `Requested formulation: ${doseLabel}`,
        },
        1,
      );
      openCart();
      return;
    }

    const sku = skuForFamilyVariantId(variant.websiteVariantId);
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
    void sku;
    openCart();
  };

  const canAdd = Boolean(variant && price != null && resolution.ok);

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
                          onClick={() => setPurchaseType('one_time')}
                          label="One-time"
                        />
                      )}
                      {purchaseTypes.includes('membership') && (
                        <SelectorChip
                          selected={purchaseType === 'membership'}
                          onClick={() => setPurchaseType('membership')}
                          label={
                            familyId === 'semaglutide'
                              ? 'Membership · $149/month'
                              : 'Membership · $275/month'
                          }
                        />
                      )}
                    </div>
                  </fieldset>
                )}

                {isWeight && purchaseType === 'one_time' && additives.length > 0 && (
                  <fieldset>
                    <legend className="text-sm font-medium text-ink-900 mb-2">Formulation</legend>
                    <div className="flex flex-wrap gap-2">
                      {additives.map((opt) => (
                        <SelectorChip
                          key={opt}
                          selected={additive === opt}
                          onClick={() => {
                            setAdditive(opt);
                            const nextDoses = unique(
                              oneTime.filter((v) => (v.additive || '') === opt).map((v) => v.doseTier),
                            );
                            if (nextDoses[0]) setDoseTier(nextDoses[0]);
                          }}
                          label={opt}
                        />
                      ))}
                    </div>
                  </fieldset>
                )}

                {isWeight && purchaseType === 'one_time' && availableDoses.length > 0 && (
                  <fieldset>
                    <legend className="text-sm font-medium text-ink-900 mb-2">Dose option</legend>
                    <div className="flex flex-wrap gap-2">
                      {availableDoses.map((opt) => (
                        <SelectorChip
                          key={opt}
                          selected={doseTier === opt}
                          onClick={() => setDoseTier(opt)}
                          label={opt}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-ink-500 leading-relaxed">
                      Your licensed provider confirms the exact strength after review. Pharmacy
                      fulfillment is included in this price. Delivery method is selected at checkout.
                    </p>
                  </fieldset>
                )}

                {isNad && injReady && nasalReady && (
                  <fieldset>
                    <legend className="text-sm font-medium text-ink-900 mb-2">Delivery method</legend>
                    <div className="flex flex-wrap gap-2">
                      {injReady && (
                        <SelectorChip
                          selected={form === 'Injection'}
                          onClick={() => setForm('Injection')}
                          label="Injection"
                        />
                      )}
                      {nasalReady && (
                        <SelectorChip
                          selected={form === 'Nasal Spray'}
                          onClick={() => setForm('Nasal Spray')}
                          label="Nasal Spray"
                        />
                      )}
                    </div>
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

              {isMembership && membership && (
                <div className="mb-6 rounded-xl border border-cream-300 bg-cream-50/80 p-4">
                  <MembershipRequestedDoseField
                    id={`family-requested-${membership.slug}`}
                    includedFormulations={membership.includedFormulations}
                    value={requestedFormulation}
                    onChange={(next) => {
                      setRequestedFormulation(next);
                      setDoseError(null);
                    }}
                  />
                  {doseError ? <p className="mt-2 text-xs text-red-700">{doseError}</p> : null}
                </div>
              )}

              <div className="rounded-2xl border border-cream-300 bg-white p-5 mb-6">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-ink-500">{isMembership ? 'Membership' : 'Due today'}</p>
                    <p className="font-serif text-3xl text-ink-900">
                      {price != null ? formatPrice(price, isMembership) : '—'}
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
                    : canAdd
                      ? `Add to Cart — $${((price || 0) * quantity).toFixed(2)}`
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
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full px-4 py-2 text-sm border transition-colors ${
        selected ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400'
      }`}
    >
      {label}
    </button>
  );
}
