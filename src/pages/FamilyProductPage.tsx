import { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from '@/router';
import {
  getRelatedProducts,
  sections,
  type Product,
} from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ProductDescriptionSections, ProductHighlights } from '@/components/ProductDescriptionSections';
import {
  getWebsiteFamilyBySlug,
  listPatientVisibleVariants,
  lockedRetailPrice,
  resolveFamilyVariant,
  WEBSITE_FAMILY_CUTOVER_ENABLED,
  type FamilySelectorState,
  type WebsiteProductFamily,
} from '@/data/websiteFamilies';
import {
  navigateToGenProductFirstCheckout,
  resolveGenProductFirstCheckout,
} from '@/lib/commerce/genHostedCheckout';

const LIVE_GLP1_PROGRAMS = {
  semaglutide: {
    low: { label: 'Low Dose', price: 139, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_7UMqZumyeXaWMX9zOPP3' },
    high: { label: 'High Dose', price: 149, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_uM0cXePP8e9c5hiMKcRt' },
    monthly: { label: 'Monthly', price: 129, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_1sgLVERqG9oWU9WKht9b' },
  },
  tirzepatide: {
    low: { label: 'Low Dose', price: 259, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_mhUSqSGlaFVCghW3V3DD' },
    high: { label: 'High Dose', price: 279, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_43kVbBgNLBocKyVUhQmG' },
    monthly: { label: 'Monthly', price: 249, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_YkHkffkLKFz3FjC7Wvno' },
  },
} as const;

type Glp1ProgramChoice = 'low' | 'high' | 'monthly';

function unique(values: Array<string | null | undefined>): string[] {
  const out: string[] = [];
  for (const v of values) {
    const s = (v || '').trim();
    if (s && !out.includes(s)) out.push(s);
  }
  return out;
}

function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
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
      initialPurchaseType={initialPurchaseType}
    />
  );
}

function FamilySelectors({
  product,
  family,
  related,
  sectionLabel,
  initialPurchaseType,
}: {
  product: Product;
  family: WebsiteProductFamily;
  related: Product[];
  sectionLabel?: string;
  initialPurchaseType?: 'one_time' | 'membership';
}) {
  const visible = listPatientVisibleVariants(family);
  const familyId = family.familyId;
  const isWeight = familyId === 'semaglutide' || familyId === 'tirzepatide';
  const isNad = familyId === 'nad';
  const isWolverine = familyId === 'wolverine-bpc-tb';

  const oneTime = visible.filter((v) => v.purchaseType === 'one_time');
  const additives = unique(oneTime.map((v) => v.additive));
  const forms = unique(visible.map((v) => v.form));
  const nasalOptions = unique(
    visible.filter((v) => (v.form || '').toLowerCase().includes('nasal')).map((v) => v.websiteVariantId),
  );

  void initialPurchaseType;
  const [additive] = useState(additives[0] || 'Vitamin B12');
  const [form, setForm] = useState(forms[0] || '');
  const [nasalOption, setNasalOption] = useState<'r84' | 'r85'>(
    nasalOptions.includes('nad-nasal-r85') && !nasalOptions.includes('nad-nasal-r84') ? 'r85' : 'r84',
  );
  const [injPackage, setInjPackage] = useState<'5mL' | '10mL'>('5mL');
  const [glp1Program, setGlp1Program] = useState<Glp1ProgramChoice>('low');
  const glp1FamilyId = familyId === 'semaglutide' || familyId === 'tirzepatide' ? familyId : null;
  const liveGlp1Program = glp1FamilyId ? LIVE_GLP1_PROGRAMS[glp1FamilyId][glp1Program] : null;

  const selectors: FamilySelectorState = useMemo(() => {
    if (isWeight) {
      return {
        purchaseType: 'one_time',
        additive,
        requestedDose: undefined,
      };
    }
    if (isNad) {
      return { form, nasalOption, package: injPackage };
    }
    if (isWolverine) {
      return { form };
    }
    return {};
  }, [isWeight, isNad, isWolverine, additive, form, nasalOption, injPackage]);

  const resolution = useMemo(
    () => resolveFamilyVariant(familyId, selectors),
    [familyId, selectors],
  );
  const variant = resolution.variant;
  const price = variant ? lockedRetailPrice(variant) : null;

  const injReady = visible.some((v) => v.websiteVariantId.startsWith('nad-inj-'));
  const nasalReady = visible.some((v) => v.websiteVariantId.startsWith('nad-nasal-'));
  const r84Ready = visible.some((v) => v.websiteVariantId === 'nad-nasal-r84');
  const r85Ready = visible.some((v) => v.websiteVariantId === 'nad-nasal-r85');

  const handleGenCheckout = () => {
    if (liveGlp1Program) {
      const checkout = resolveGenProductFirstCheckout(liveGlp1Program.id);
      if (!checkout.ok) return;
      navigateToGenProductFirstCheckout(checkout.url);
      return;
    }

    const checkout = resolveGenProductFirstCheckout(variant?.genClientProductId);
    if (!checkout.ok) return;
    navigateToGenProductFirstCheckout(checkout.url);
  };

  const displayPrice = liveGlp1Program?.price ?? price;
  // Recovery Stack has a fixed, separately disclosed $30 shipping charge in
  // GEN. Keep the website total equal to the GEN checkout total.
  const fixedShipping = familyId === 'bpc-advanced-blends' ? 30 : 0;
  const dueToday = displayPrice == null ? null : displayPrice + fixedShipping;
  const genCheckout = resolveGenProductFirstCheckout(liveGlp1Program?.id ?? variant?.genClientProductId);
  const canPurchase = glp1FamilyId
    ? Boolean(liveGlp1Program && genCheckout.ok)
    : Boolean(variant && price != null && resolution.ok && genCheckout.ok);

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
                {glp1FamilyId && (
                  <fieldset>
                    <legend className="text-sm font-medium text-ink-900 mb-2">Program option</legend>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(LIVE_GLP1_PROGRAMS[glp1FamilyId]) as Glp1ProgramChoice[]).map((choice) => {
                        const option = LIVE_GLP1_PROGRAMS[glp1FamilyId][choice];
                        return <SelectorChip key={choice} selected={glp1Program === choice} onClick={() => setGlp1Program(choice)} label={`${option.label} · ${formatPrice(option.price)}${choice === 'monthly' ? '/mo' : ''}`} />;
                      })}
                    </div>
                    <p className="mt-2 text-xs text-ink-500 leading-relaxed">Shipping and provider consultation are included. Your provider determines final clinical eligibility and treatment details.</p>
                  </fieldset>
                )}

                {isNad && (
                  <fieldset>
                    <legend className="text-sm font-medium text-ink-900 mb-2">Delivery method</legend>
                    <div className="flex flex-wrap gap-2">
                      <SelectorChip
                        selected={form === 'Injection'}
                        disabled={!injReady}
                        onClick={() => setForm('Injection')}
                        label={injReady ? 'Injection' : 'Injection · Temporarily unavailable'}
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
                      Select your preferred delivery method. Final formulation and directions are determined after provider review.
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
                          label="5 mL vial"
                        />
                      )}
                      {visible.some((v) => v.websiteVariantId === 'nad-inj-10ml-1000') && (
                        <SelectorChip
                          selected={injPackage === '10mL'}
                          onClick={() => setInjPackage('10mL')}
                          label="10 mL vial"
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
                          label="Nasal Spray Option 1"
                        />
                      )}
                      {r85Ready && (
                        <SelectorChip
                          selected={nasalOption === 'r85'}
                          onClick={() => setNasalOption('r85')}
                          label="Nasal Spray Option 2"
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

              <div className="rounded-2xl border border-cream-300 bg-white p-5 mb-6">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-ink-500">Due today in GEN Health</p>
                    <p className="font-serif text-3xl text-ink-900">
                      {dueToday != null ? formatPrice(dueToday) : '—'}
                    </p>
                    <p className="mt-1 text-xs text-ink-500">
                      {liveGlp1Program
                        ? `${glp1Program === 'monthly' ? 'Monthly price' : 'One-time price'} shown. Shipping and provider consultation are included by GEN Health.`
                        : fixedShipping > 0
                        ? `Includes ${formatPrice(fixedShipping)} shipping. Any applicable visit charge is shown by GEN Health before payment.`
                        : 'Final payment total and any applicable visit charge are shown by GEN Health before payment.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-primary w-full"
                  disabled={!canPurchase}
                  onClick={handleGenCheckout}
                >
                    {canPurchase
                        ? 'Continue to Checkout'
                        : 'Temporarily unavailable'}
                </button>
                <p className="mt-3 text-xs text-ink-500 leading-relaxed">
                  You’ll continue securely in GEN Health for payment, intake, assessment, and provider review.
                  Purchasing does not guarantee that a prescription will be issued.
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
