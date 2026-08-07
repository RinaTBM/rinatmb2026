// =============================================================================
// My Bare Method — Central Product Catalog (single source of truth)
// -----------------------------------------------------------------------------
// Relaunch 2026: 13 active base products with selectable variants, grouped into
// 5 public categories. Retired products are preserved (not deleted) as hidden
// "future" products so they can be re-released later through campaigns.
//
// Compliance: no benefit/outcome/dosing claims, no branded drug names, no
// "FDA-approved compounded" or "generic <brand>" language. All active products
// are provider-directed and require licensed-provider review before fulfillment.
// `internalNotes` is NEVER rendered to customers.
// =============================================================================

// ---------------------------------------------------------------------------
// Public categories (5)
// ---------------------------------------------------------------------------
export type Category =
  | 'weight-management'
  | 'womens-hormone-therapy'
  | 'longevity-cognitive'
  | 'recovery-performance'
  | 'prescription-skin-hair';

// Legacy alias retained so existing components that reference `product.section`
// and `ProductSection` keep working. Section === Category in the relaunch.
export type ProductSection = Category;

export type Goal =
  | 'weight-management'
  | 'longevity'
  | 'hrt-women'
  | 'performance'
  | 'recovery'
  | 'focus'
  | 'beauty'
  | 'daily-wellness';

export type ProductStatus = 'active' | 'future';

export type DosageForm =
  | 'Injection'
  | 'Nasal Spray'
  | 'Capsule'
  | 'Patch'
  | 'Cream'
  | 'Topical Solution'
  | 'Solution';

export interface ProductVariant {
  id: string;
  dosageForm: DosageForm;
  strength: string;
  size: string;
  price: number;
  /** Full customer-facing label, e.g. "Injection, 5mg/mL, 2mL" or "1mg/1mg per mL, 2mL". */
  label: string;
}

export interface Product {
  // --- Identity ---
  id: string;
  slug: string;
  displayName: string;
  shortName: string;
  subtitle: string;
  category: Category;
  dosageForms: DosageForm[];

  // --- Copy ---
  shortDescription: string;
  longDescription: string;

  // --- Media ---
  image: string;
  imageAlt: string;

  // --- Commerce ---
  variants: ProductVariant[];
  startingPrice: number;

  // --- Lifecycle / campaign system ---
  status: ProductStatus;
  isVisible: boolean;
  launchPhase?: number;
  campaignTheme?: string;
  plannedLaunchDate?: string;

  // --- Compliance / fulfillment ---
  requiresProviderReview: boolean;
  requiresPrescription: boolean;
  requiresComplianceReview: boolean;
  requiresPharmacyVerification: boolean;
  providerDisclaimer: string;
  /** Internal only — must never be rendered to customers. */
  internalNotes?: string;
  needsDedicatedImage?: boolean;

  // --- Backward-compatible fields consumed by existing pages/components ---
  name: string;               // === displayName
  tagline: string;            // === subtitle
  section: ProductSection;    // === category
  subcategory: string;        // primary dosage form (kebab)
  goals: Goal[];
  price: number;              // === startingPrice
  subscriptionPrice?: number;
  startingAt?: boolean;       // true when >1 variant
  variablePricing?: boolean;  // always false in the relaunch (fixed variant prices)
  priceLabel?: string;
  benefits: string[];
  ingredients: string;
  directions: string;
  bestSeller?: boolean;
  requiresIntake?: boolean;   // === requiresProviderReview
  providerReviewed?: boolean; // === requiresProviderReview
  alaCarte?: boolean;
  featured?: boolean;
  bundleItems?: string[];
  bundleRegularPrice?: number;
  faqs: { q: string; a: string }[];
  disclosures?: string;
}

// ---------------------------------------------------------------------------
// Shared compliance copy
// ---------------------------------------------------------------------------
export const PROVIDER_ELIGIBILITY_NOTICE: string[] = [
  'Provider review is required before any product is dispensed.',
  'Purchasing does not guarantee a prescription.',
  'Eligibility is determined by a licensed provider.',
  'Exact formulation, strength, and treatment plan are determined by the provider and dispensing pharmacy.',
  'Labs or a consultation may be requested.',
  'Final availability depends on the dispensing pharmacy.',
  'Individual experiences and results vary.',
];

const RX_DISCLAIMER =
  'Prescription option available following licensed-provider evaluation. Exact formulation, concentration, and treatment plan are determined by the prescribing provider and dispensing pharmacy.';

const COMPOUNDED_DISCLAIMER =
  'Provider-directed compounded formulation available only following eligibility review. Exact formulation and availability are determined by the prescribing provider and dispensing pharmacy.';

const WEIGHT_DISCLAIMER =
  'Prescription weight-management option available following licensed-provider evaluation. Exact formulation, concentration, and treatment plan are determined by the prescribing provider and dispensing pharmacy.';

const providerFaqs = [
  {
    q: 'What happens after I place my order?',
    a: 'You will complete a secure medical intake. A licensed provider reviews your information and determines eligibility. Fulfillment occurs only after provider approval.',
  },
  {
    q: 'Is a prescription guaranteed?',
    a: 'No. Purchasing does not guarantee a prescription. Eligibility is determined by a licensed provider, and a consultation or labs may be requested.',
  },
  {
    q: 'Who decides the exact formulation and strength?',
    a: 'The exact formulation, strength, and treatment plan are determined by the prescribing provider and the dispensing pharmacy. Final availability depends on the pharmacy.',
  },
  {
    q: 'What if I am not approved?',
    a: 'If the provider determines a product is not appropriate for you, you receive a full refund.',
  },
];

// ---------------------------------------------------------------------------
// Product images (existing assets preserved — no generated replacements)
// ---------------------------------------------------------------------------
export const IMG_CAPSULE   = '/images/products/file_00000000e110822fb1dd36d19b3c9896 copy.png';
export const IMG_INJECTION = '/images/products/file_0000000081dc822f831112a2c1e5d3d9 copy.png';
export const IMG_NASAL     = '/images/products/nasal-spray.png';
export const IMG_SPRAY     = '/images/products/ChatGPT_Image_Aug_3,_2026,_04_16_27_PM.png';
export const IMG_PATCH     = '/images/products/patches.png';
export const IMG_CREAM     = '/images/products/ChatGPT_Image_Jul_31,_2026,_04_22_43_PM.png';
export const IMG_GEL       = '/images/products/ChatGPT_Image_Aug_3,_2026,_04_14_54_PM.png';

// ---------------------------------------------------------------------------
// Categories (public taxonomy)
// ---------------------------------------------------------------------------
export interface Subcategory {
  id: string;
  label: string;
  description?: string;
}

export interface SectionMeta {
  id: Category;
  label: string;
  tagline: string;
  description: string;
  disclosure: string;
  subcategories: Subcategory[];
}

const RX_CATEGORY_DISCLOSURE =
  'These products require completion of a medical intake and review by a licensed provider. Fulfillment occurs only after provider approval. Purchasing does not guarantee a prescription. Exact formulation, strength, and treatment plan are determined by the provider and dispensing pharmacy.';

export const sections: SectionMeta[] = [
  {
    id: 'weight-management',
    label: 'Weight Management',
    tagline: 'Metabolic support, provider-guided',
    description: 'Provider-directed weight-management options, personalized following a licensed-provider evaluation.',
    disclosure: RX_CATEGORY_DISCLOSURE,
    subcategories: [],
  },
  {
    id: 'womens-hormone-therapy',
    label: "Women's Hormone Therapy",
    tagline: 'Hormone balance, personal',
    description: 'Provider-directed hormone therapy in multiple delivery formats, personalized after intake and review.',
    disclosure: RX_CATEGORY_DISCLOSURE,
    subcategories: [],
  },
  {
    id: 'longevity-cognitive',
    label: 'Longevity & Cognitive Health',
    tagline: 'Cellular and cognitive support',
    description: 'Provider-directed compounded formulations for longevity and cognitive-health support, available only after eligibility review.',
    disclosure: RX_CATEGORY_DISCLOSURE,
    subcategories: [],
  },
  {
    id: 'recovery-performance',
    label: 'Recovery & Performance',
    tagline: 'Recovery and performance support',
    description: 'Provider-directed compounded formulations for recovery and performance support, available only after eligibility review.',
    disclosure: RX_CATEGORY_DISCLOSURE,
    subcategories: [],
  },
  {
    id: 'prescription-skin-hair',
    label: 'Prescription Skin & Hair',
    tagline: 'Prescription skin & hair care',
    description: 'Prescription skin and hair treatments available following licensed-provider review.',
    disclosure: RX_CATEGORY_DISCLOSURE,
    subcategories: [],
  },
];

/** Alias — the relaunch taxonomy is categories. */
export const categories = sections;

export const CATEGORY_ORDER: Category[] = [
  'weight-management',
  'womens-hormone-therapy',
  'longevity-cognitive',
  'recovery-performance',
  'prescription-skin-hair',
];

// ---------------------------------------------------------------------------
// Variant + product builders
// ---------------------------------------------------------------------------
const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

interface VariantSeed {
  dosageForm: DosageForm;
  strength: string;
  size: string;
  price: number;
}

function buildVariants(slug: string, seeds: VariantSeed[]): ProductVariant[] {
  const distinctForms = new Set(seeds.map(s => s.dosageForm));
  const multiForm = distinctForms.size > 1;
  return seeds.map((s, i) => ({
    id: `${slug}-v${i + 1}`,
    dosageForm: s.dosageForm,
    strength: s.strength,
    size: s.size,
    price: s.price,
    label: multiForm ? `${s.dosageForm}, ${s.strength}, ${s.size}` : `${s.strength}, ${s.size}`,
  }));
}

interface ProductSeed {
  id: string;
  slug: string;
  displayName: string;
  shortName: string;
  subtitle: string;
  category: Category;
  goals: Goal[];
  shortDescription: string;
  longDescription: string;
  image: string;
  imageAlt: string;
  variants: VariantSeed[];
  providerDisclaimer: string;
  bestSeller?: boolean;
  subscriptionPrice?: number;
  status?: ProductStatus;
  isVisible?: boolean;
  launchPhase?: number;
  campaignTheme?: string;
  plannedLaunchDate?: string;
  internalNotes?: string;
  needsDedicatedImage?: boolean;
}

function mk(seed: ProductSeed): Product {
  const variants = buildVariants(seed.slug, seed.variants);
  const startingPrice = variants.reduce((min, v) => Math.min(min, v.price), Infinity);
  const forms = Array.from(new Set(variants.map(v => v.dosageForm))) as DosageForm[];
  const status = seed.status ?? 'active';
  const isVisible = seed.isVisible ?? (status === 'active');
  return {
    id: seed.id,
    slug: seed.slug,
    displayName: seed.displayName,
    shortName: seed.shortName,
    subtitle: seed.subtitle,
    category: seed.category,
    dosageForms: forms,
    shortDescription: seed.shortDescription,
    longDescription: seed.longDescription,
    image: seed.image,
    imageAlt: seed.imageAlt,
    variants,
    startingPrice: Number.isFinite(startingPrice) ? startingPrice : 0,
    status,
    isVisible,
    launchPhase: seed.launchPhase,
    campaignTheme: seed.campaignTheme,
    plannedLaunchDate: seed.plannedLaunchDate,
    requiresProviderReview: true,
    requiresPrescription: true,
    requiresComplianceReview: true,
    requiresPharmacyVerification: true,
    providerDisclaimer: seed.providerDisclaimer,
    internalNotes: seed.internalNotes,
    needsDedicatedImage: seed.needsDedicatedImage,

    // Backward-compatible / derived
    name: seed.displayName,
    tagline: seed.subtitle,
    section: seed.category,
    subcategory: forms.length ? kebab(forms[0]) : 'other',
    goals: seed.goals,
    price: Number.isFinite(startingPrice) ? startingPrice : 0,
    subscriptionPrice: seed.subscriptionPrice,
    startingAt: variants.length > 1,
    variablePricing: false,
    benefits: [],
    ingredients: 'Exact compounded formulation is determined by the prescribing provider and dispensing pharmacy.',
    directions: 'Use only as directed by your prescribing provider.',
    bestSeller: seed.bestSeller,
    requiresIntake: true,
    providerReviewed: true,
    alaCarte: true,
    faqs: providerFaqs,
  };
}

// ---------------------------------------------------------------------------
// Active catalog — 13 base products
// ---------------------------------------------------------------------------
export const products: Product[] = [
  // ===== WEIGHT MANAGEMENT =====
  mk({
    id: 'p1', // preserves the previous GLP-1 app_product_id for Stripe mapping
    slug: 'semaglutide',
    displayName: 'Semaglutide + B6 Injection',
    shortName: 'Semaglutide',
    subtitle: 'Provider-directed weight management',
    category: 'weight-management',
    goals: ['weight-management'],
    shortDescription: 'A provider-directed weight-management injection pairing semaglutide with vitamin B6.',
    longDescription: WEIGHT_DISCLAIMER,
    image: IMG_INJECTION,
    imageAlt: 'Amber injection vial for Semaglutide + B6, a provider-directed weight-management option',
    providerDisclaimer: WEIGHT_DISCLAIMER,
    bestSeller: true,
    subscriptionPrice: 175,
    variants: [
      { dosageForm: 'Injection', strength: '1mg/1mg per mL', size: '2mL', price: 149 },
      { dosageForm: 'Injection', strength: '2mg/2mg per mL', size: '2mL', price: 169 },
      { dosageForm: 'Injection', strength: '5mg/2mg per mL', size: '2mL', price: 199 },
    ],
  }),
  mk({
    id: 'p5', // preserves the previous GLP-1/GIP app_product_id for Stripe mapping
    slug: 'tirzepatide',
    displayName: 'Tirzepatide + B6 Injection',
    shortName: 'Tirzepatide',
    subtitle: 'Provider-directed weight management',
    category: 'weight-management',
    goals: ['weight-management'],
    shortDescription: 'A provider-directed weight-management injection pairing tirzepatide with vitamin B6.',
    longDescription: WEIGHT_DISCLAIMER,
    image: IMG_INJECTION,
    imageAlt: 'Amber injection vial for Tirzepatide + B6, a provider-directed weight-management option',
    providerDisclaimer: WEIGHT_DISCLAIMER,
    bestSeller: true,
    subscriptionPrice: 225,
    variants: [
      { dosageForm: 'Injection', strength: '5mg/2mg per mL', size: '2mL', price: 199 },
      { dosageForm: 'Injection', strength: '15mg/2mg per mL', size: '2mL', price: 269 },
      { dosageForm: 'Injection', strength: '25mg/2mg per mL', size: '2mL', price: 379 },
      { dosageForm: 'Injection', strength: '30mg/2mg per mL', size: '2mL', price: 449 },
    ],
    needsDedicatedImage: true,
  }),

  // ===== WOMEN'S HORMONE THERAPY =====
  mk({
    id: 'p16', // preserves previous Estrogen Transdermal Patch app_product_id
    slug: 'estradiol-patch',
    displayName: 'Estradiol Patch',
    shortName: 'Estradiol Patch',
    subtitle: 'Provider-directed hormone therapy',
    category: 'womens-hormone-therapy',
    goals: ['hrt-women'],
    shortDescription: 'A transdermal estradiol patch prescribed as part of provider-directed hormone therapy.',
    longDescription: RX_DISCLAIMER,
    image: IMG_PATCH,
    imageAlt: 'Estradiol transdermal patch, a provider-directed hormone therapy option',
    providerDisclaimer: RX_DISCLAIMER,
    variants: [
      { dosageForm: 'Patch', strength: '0.025mg twice weekly', size: '8 patches', price: 119 },
      { dosageForm: 'Patch', strength: '0.05mg twice weekly', size: '8 patches', price: 119 },
      { dosageForm: 'Patch', strength: '0.1mg twice weekly', size: '8 patches', price: 135 },
    ],
  }),
  mk({
    id: 'p23', // preserves previous Progesterone Capsules app_product_id
    slug: 'progesterone-capsules',
    displayName: 'Progesterone Capsules',
    shortName: 'Progesterone',
    subtitle: 'Provider-directed hormone therapy',
    category: 'womens-hormone-therapy',
    goals: ['hrt-women'],
    shortDescription: 'Oral progesterone capsules prescribed as part of provider-directed hormone therapy.',
    longDescription: RX_DISCLAIMER,
    image: IMG_CAPSULE,
    imageAlt: 'Progesterone capsules bottle, a provider-directed hormone therapy option',
    providerDisclaimer: RX_DISCLAIMER,
    variants: [
      { dosageForm: 'Capsule', strength: '100mg', size: '30 capsules', price: 49 },
      { dosageForm: 'Capsule', strength: '200mg', size: '30 capsules', price: 69 },
    ],
  }),
  mk({
    id: 'p27', // preserves previous Testosterone Cream app_product_id
    slug: 'testosterone-cream',
    displayName: 'Testosterone Cream',
    shortName: 'Testosterone Cream',
    subtitle: 'Provider-directed hormone therapy',
    category: 'womens-hormone-therapy',
    goals: ['hrt-women'],
    shortDescription: 'A topical testosterone cream prescribed as part of provider-directed hormone therapy.',
    longDescription: RX_DISCLAIMER,
    image: IMG_CREAM,
    imageAlt: 'Testosterone cream, a provider-directed hormone therapy option',
    providerDisclaimer: RX_DISCLAIMER,
    variants: [
      { dosageForm: 'Cream', strength: '5mg/g', size: '30g', price: 79 },
    ],
  }),

  // ===== LONGEVITY & COGNITIVE HEALTH =====
  mk({
    id: 'p9', // preserves previous NAD+ Injection app_product_id
    slug: 'nad-plus',
    displayName: 'NAD+',
    shortName: 'NAD+',
    subtitle: 'Provider-directed compounded formulation',
    category: 'longevity-cognitive',
    goals: ['longevity'],
    shortDescription: 'A provider-directed compounded NAD+ formulation, available in nasal spray and injection.',
    longDescription: COMPOUNDED_DISCLAIMER,
    image: IMG_INJECTION,
    imageAlt: 'NAD+ compounded formulation, provider-directed, available as nasal spray or injection',
    providerDisclaimer: COMPOUNDED_DISCLAIMER,
    bestSeller: true,
    variants: [
      { dosageForm: 'Nasal Spray', strength: '50mcg/50mcg per spray', size: '10mL', price: 149 },
      { dosageForm: 'Injection', strength: '100mg/mL', size: '5mL', price: 199 },
      { dosageForm: 'Injection', strength: '100mg/mL', size: '10mL', price: 219 },
    ],
  }),
  mk({
    id: 'p48', // preserves the previous Selank app_product_id
    slug: 'selank',
    displayName: 'Selank Injection',
    shortName: 'Selank',
    subtitle: 'Provider-directed compounded formulation',
    category: 'longevity-cognitive',
    goals: ['longevity', 'focus'],
    shortDescription: 'A provider-directed compounded Selank injection, available only after eligibility review.',
    longDescription: COMPOUNDED_DISCLAIMER,
    image: IMG_INJECTION,
    imageAlt: 'Selank injection, a provider-directed compounded formulation',
    providerDisclaimer: COMPOUNDED_DISCLAIMER,
    variants: [
      { dosageForm: 'Injection', strength: '5mg/mL', size: '2mL', price: 129 },
    ],
  }),
  mk({
    id: 'p47', // preserves the previous Semax app_product_id
    slug: 'semax',
    displayName: 'Semax Injection',
    shortName: 'Semax',
    subtitle: 'Provider-directed compounded formulation',
    category: 'longevity-cognitive',
    goals: ['longevity', 'focus'],
    shortDescription: 'A provider-directed compounded Semax injection, available only after eligibility review.',
    longDescription: COMPOUNDED_DISCLAIMER,
    image: IMG_INJECTION,
    imageAlt: 'Semax injection, a provider-directed compounded formulation',
    providerDisclaimer: COMPOUNDED_DISCLAIMER,
    variants: [
      { dosageForm: 'Injection', strength: '5mg/mL', size: '2mL', price: 129 },
    ],
  }),
  mk({
    id: 'p68',
    slug: 'selank-semax-nasal-spray',
    displayName: 'Selank + Semax Blend Nasal Spray',
    shortName: 'Selank + Semax Blend',
    subtitle: 'Provider-directed compounded formulation',
    category: 'longevity-cognitive',
    goals: ['longevity', 'focus'],
    shortDescription: 'A provider-directed compounded Selank and Semax blend nasal spray, available only after eligibility review.',
    longDescription: COMPOUNDED_DISCLAIMER,
    image: IMG_NASAL,
    imageAlt: 'Selank and Semax blend nasal spray, a provider-directed compounded formulation',
    providerDisclaimer: COMPOUNDED_DISCLAIMER,
    variants: [
      { dosageForm: 'Nasal Spray', strength: '50mcg/50mcg per spray', size: '10mL', price: 149 },
    ],
  }),

  // ===== RECOVERY & PERFORMANCE =====
  mk({
    id: 'p41', // preserves the previous BPC-157/TB-500 Injection app_product_id
    slug: 'bpc-157-tb-500',
    displayName: 'BPC-157/TB-500 Blend',
    shortName: 'BPC-157/TB-500',
    subtitle: 'Wolverine Blend',
    category: 'recovery-performance',
    goals: ['recovery', 'performance'],
    shortDescription: 'A provider-directed compounded BPC-157/TB-500 blend, available in capsules and injection.',
    longDescription: COMPOUNDED_DISCLAIMER,
    image: IMG_INJECTION,
    imageAlt: 'BPC-157/TB-500 blend, a provider-directed compounded formulation in capsule and injection forms',
    providerDisclaimer: COMPOUNDED_DISCLAIMER,
    variants: [
      { dosageForm: 'Capsule', strength: '500mcg/500mcg per capsule', size: '30 capsules', price: 99 },
      { dosageForm: 'Injection', strength: '1.66mg/3.33mg per mL', size: '3mL', price: 199 },
    ],
  }),

  // ===== PRESCRIPTION SKIN & HAIR =====
  mk({
    id: 'p69',
    slug: 'tretinoin-cream',
    displayName: 'Tretinoin Cream',
    shortName: 'Tretinoin',
    subtitle: 'Prescription skin care',
    category: 'prescription-skin-hair',
    goals: ['beauty'],
    shortDescription: 'A prescription topical tretinoin cream available following licensed-provider review.',
    longDescription: RX_DISCLAIMER,
    image: IMG_CREAM,
    imageAlt: 'Tretinoin cream, a prescription topical skin-care treatment',
    providerDisclaimer: RX_DISCLAIMER,
    bestSeller: true,
    variants: [
      { dosageForm: 'Cream', strength: '0.025%', size: '20g', price: 79 },
      { dosageForm: 'Cream', strength: '0.05%', size: '20g', price: 89 },
      { dosageForm: 'Cream', strength: '0.1%', size: '20g', price: 109 },
    ],
  }),
  mk({
    id: 'p70',
    slug: 'minoxidil-topical',
    displayName: 'Minoxidil Combination Topical Formula',
    shortName: 'Minoxidil Topical',
    subtitle: 'Prescription hair care',
    category: 'prescription-skin-hair',
    goals: ['beauty'],
    shortDescription: 'A compounded topical formula featuring minoxidil, personalized by the prescribing provider and dispensing pharmacy.',
    longDescription:
      'Prescription hair-care option available following licensed-provider review. Exact compounded formulation is determined by the prescribing provider and dispensing pharmacy.',
    image: IMG_GEL,
    imageAlt: 'Minoxidil combination topical formula, a prescription hair-care treatment',
    providerDisclaimer:
      'Exact compounded formulation is determined by the prescribing provider and dispensing pharmacy.',
    needsDedicatedImage: true,
    variants: [
      { dosageForm: 'Topical Solution', strength: '1% plus pharmacy-selected actives', size: '60mL', price: 119 },
    ],
  }),
  mk({
    id: 'p71',
    slug: 'bimatoprost-solution',
    displayName: 'Bimatoprost Solution',
    shortName: 'Bimatoprost',
    subtitle: 'Prescription eyelash care',
    category: 'prescription-skin-hair',
    goals: ['beauty'],
    shortDescription: 'A prescription bimatoprost solution available following licensed-provider review.',
    longDescription: RX_DISCLAIMER,
    image: IMG_SPRAY,
    imageAlt: 'Bimatoprost solution, a prescription treatment',
    providerDisclaimer: RX_DISCLAIMER,
    needsDedicatedImage: true,
    variants: [
      { dosageForm: 'Solution', strength: '0.03%', size: '2.5mL', price: 89 },
    ],
  }),

  // =========================================================================
  // FUTURE PRODUCTS — hidden, preserved for later campaign release (not deleted)
  // =========================================================================
  mk({
    id: 'p12', // preserves the previous Sermorelin Injection app_product_id
    slug: 'sermorelin',
    displayName: 'Sermorelin',
    shortName: 'Sermorelin',
    subtitle: 'Provider-directed compounded formulation',
    category: 'longevity-cognitive',
    goals: ['longevity'],
    shortDescription: 'A provider-directed compounded Sermorelin formulation.',
    longDescription: COMPOUNDED_DISCLAIMER,
    image: IMG_INJECTION,
    imageAlt: 'Sermorelin, a provider-directed compounded formulation',
    providerDisclaimer: COMPOUNDED_DISCLAIMER,
    status: 'future',
    isVisible: false,
    launchPhase: 2,
    campaignTheme: 'future longevity release',
    variants: [
      { dosageForm: 'Injection', strength: '9mg/mL', size: '3mL', price: 119 },
    ],
  }),
  mk({
    id: 'p72',
    slug: 'minoxidil-tablets',
    displayName: 'Minoxidil Tablets',
    shortName: 'Minoxidil Tablets',
    subtitle: 'Prescription hair care',
    category: 'prescription-skin-hair',
    goals: ['beauty'],
    shortDescription: 'Provider-directed oral minoxidil tablets.',
    longDescription: RX_DISCLAIMER,
    image: IMG_CAPSULE,
    imageAlt: 'Minoxidil tablets, a prescription hair-care treatment',
    providerDisclaimer: RX_DISCLAIMER,
    status: 'future',
    isVisible: false,
    launchPhase: 2,
    campaignTheme: 'future hair restoration release',
    variants: [
      { dosageForm: 'Capsule', strength: '2.5mg', size: '30 tablets', price: 79 },
    ],
  }),
];

// ---------------------------------------------------------------------------
// Visibility helpers — catalog surfaces must only show visible/active products
// ---------------------------------------------------------------------------
export const visibleProducts = products.filter(p => p.isVisible && p.status === 'active');
export const futureProducts = products.filter(p => p.status === 'future');
export const getVisibleProducts = () => visibleProducts;

// ---------------------------------------------------------------------------
// Old-slug → new-slug redirect aliases (preserve bookmarked/marketing links)
// ---------------------------------------------------------------------------
export const SLUG_ALIASES: Record<string, string> = {
  // Weight management (old GLP-1 / GLP-1/GIP auto-slugs → new names)
  'glp-1-1': 'semaglutide',
  'glp-1': 'semaglutide',
  'glp-1-b12-injection-2': 'semaglutide',
  'glp-1-l-carnitine-injection-3': 'semaglutide',
  'glp-1-glycine-injection-4': 'semaglutide',
  'glp-1-gip-5': 'tirzepatide',
  'glp-1-gip': 'tirzepatide',
  'glp-1-gip-b12-injection-6': 'tirzepatide',
  'glp-1-gip-l-carnitine-injection-7': 'tirzepatide',
  'glp-1-gip-glycine-injection-8': 'tirzepatide',
  // NAD+
  'nad-injection-9': 'nad-plus',
  'nad-nasal-spray-10': 'nad-plus',
  // HRT
  'estrogen-transdermal-patch-16': 'estradiol-patch',
  'progesterone-capsules-23': 'progesterone-capsules',
  'testosterone-cream-27': 'testosterone-cream',
  // Recovery
  'bpc-157-tb-500-injection-40': 'bpc-157-tb-500',
  'bpc-157-tb-500-injection': 'bpc-157-tb-500',
  'bpc-157-tb-500-capsules-41': 'bpc-157-tb-500',
  // Cognitive
  'semax-nasal-spray-46': 'semax',
  'selank-nasal-spray-47': 'selank',
};

function resolveSlug(slug: string): string {
  if (SLUG_ALIASES[slug]) return SLUG_ALIASES[slug];
  const base = slug.replace(/-\d+$/, '');
  if (SLUG_ALIASES[base]) return SLUG_ALIASES[base];
  return slug;
}

// ---------------------------------------------------------------------------
// Memberships
// ---------------------------------------------------------------------------
export interface Membership {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  tagline: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const memberships: Membership[] = [
  {
    id: 'semaglutide-membership',
    name: 'Bare Semaglutide Membership',
    price: 175,
    priceLabel: '/month',
    tagline: 'Semaglutide program',
    description:
      'Your provider-guided semaglutide weight-management program. One locked-in monthly price with provider-directed care.',
    features: [
      'Semaglutide program',
      'Locked-in pricing while active',
      'Monthly refills',
      'Provider-guided care',
      '3-month minimum',
    ],
  },
  {
    id: 'tirzepatide-membership',
    name: 'Bare Tirzepatide Membership',
    price: 225,
    priceLabel: '/month',
    tagline: 'Tirzepatide program',
    description:
      'Our tirzepatide weight-management program. One locked-in monthly price with priority fulfillment and provider-directed care.',
    features: [
      'Tirzepatide program',
      'Locked-in pricing while active',
      'Monthly refills',
      'Provider-guided care',
      'Priority fulfillment',
      '3-month minimum',
    ],
    highlighted: true,
  },
  {
    id: 'elite-wellness-membership',
    name: 'Bare Elite Wellness',
    price: 49,
    priceLabel: '/month',
    tagline: 'All other wellness products',
    description:
      'Member pricing on all other wellness products, priority processing, and early access to new therapies.',
    features: [
      'Exclusive member pricing',
      'Priority processing',
      'Member-only promotions',
      'Early access to new therapies',
    ],
  },
];

// ---------------------------------------------------------------------------
// Wellness concerns (Shop by Concern) — surfaces visible products only
// ---------------------------------------------------------------------------
export type ConcernId =
  | 'weight-management'
  | 'hormone-balance'
  | 'longevity-aging'
  | 'cognitive-support'
  | 'recovery-performance'
  | 'hair-skin-beauty';

export interface Concern {
  id: ConcernId;
  label: string;
  description: string;
  image: string;
  tagline: string;
}

export const concerns: Concern[] = [
  { id: 'weight-management', label: 'Weight Management', tagline: 'Provider-guided progress', description: 'Provider-directed weight-management options personalized after a licensed-provider evaluation.', image: 'https://images.pexels.com/photos/8846593/pexels-photo-8846593.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'hormone-balance', label: "Women's Hormone Therapy", tagline: 'Hormone balance, personal', description: 'Provider-directed estradiol, progesterone, and testosterone therapy in multiple formats.', image: 'https://images.pexels.com/photos/8551982/pexels-photo-8551982.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'longevity-aging', label: 'Longevity & Cognitive Health', tagline: 'Cellular and cognitive support', description: 'Provider-directed compounded formulations for longevity and cognitive-health support.', image: 'https://images.pexels.com/photos/8939921/pexels-photo-8939921.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'cognitive-support', label: 'Cognitive Support', tagline: 'Clarity, provider-directed', description: 'Provider-directed compounded formulations for cognitive-health support.', image: 'https://images.pexels.com/photos/4968357/pexels-photo-4968357.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'recovery-performance', label: 'Recovery & Performance', tagline: 'Recovery and performance support', description: 'Provider-directed compounded formulations for recovery and performance support.', image: 'https://images.pexels.com/photos/4970983/pexels-photo-4970983.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'hair-skin-beauty', label: 'Prescription Skin & Hair', tagline: 'Prescription skin & hair', description: 'Prescription skin and hair treatments available following licensed-provider review.', image: 'https://images.pexels.com/photos/6417964/pexels-photo-6417964.jpeg?auto=compress&cs=tinysrgb&w=900' },
];

const concernToCategoryMap: Record<ConcernId, Category> = {
  'weight-management': 'weight-management',
  'hormone-balance': 'womens-hormone-therapy',
  'longevity-aging': 'longevity-cognitive',
  'cognitive-support': 'longevity-cognitive',
  'recovery-performance': 'recovery-performance',
  'hair-skin-beauty': 'prescription-skin-hair',
};

export const getProductsByConcern = (concernId: ConcernId): Product[] => {
  const cat = concernToCategoryMap[concernId];
  return visibleProducts.filter(p => p.category === cat);
};

export const getMembershipsForConcern = (concernId: ConcernId): Membership[] => {
  if (concernId === 'weight-management') return memberships.filter(m => m.id !== 'elite-wellness-membership');
  return [];
};

export const getAccessoriesForConcern = (): Product[] => [];

export const getConcern = (id: string) => concerns.find(c => c.id === id as ConcernId);

// ---------------------------------------------------------------------------
// Goals ("Shop by Goal")
// ---------------------------------------------------------------------------
export const goals: { id: Goal; label: string; description: string; image: string }[] = [
  { id: 'weight-management', label: 'Weight Management', description: 'Provider-directed weight-management options, personalized after evaluation.', image: 'https://images.pexels.com/photos/8846593/pexels-photo-8846593.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'hrt-women', label: "Women's Hormone Therapy", description: 'Estradiol, progesterone, and testosterone therapy in multiple formats.', image: 'https://images.pexels.com/photos/8551982/pexels-photo-8551982.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'longevity', label: 'Longevity & Cognitive Health', description: 'Provider-directed compounded formulations for longevity and cognitive-health support.', image: 'https://images.pexels.com/photos/8939921/pexels-photo-8939921.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'focus', label: 'Cognitive Support', description: 'Provider-directed compounded formulations for cognitive support.', image: 'https://images.pexels.com/photos/4968357/pexels-photo-4968357.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'recovery', label: 'Recovery', description: 'Provider-directed compounded formulations for recovery support.', image: 'https://images.pexels.com/photos/4970983/pexels-photo-4970983.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'performance', label: 'Performance', description: 'Provider-directed compounded formulations for performance support.', image: 'https://images.pexels.com/photos/2787846/pexels-photo-2787846.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'beauty', label: 'Prescription Skin & Hair', description: 'Prescription skin and hair treatments following provider review.', image: 'https://images.pexels.com/photos/6417964/pexels-photo-6417964.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'daily-wellness', label: 'Daily Wellness', description: 'Provider-directed wellness options.', image: 'https://images.pexels.com/photos/3795277/pexels-photo-3795277.jpeg?auto=compress&cs=tinysrgb&w=900' },
];

// ---------------------------------------------------------------------------
// Query helpers (all catalog-facing helpers operate on visible products)
// ---------------------------------------------------------------------------
export const getProduct = (slug: string): Product | undefined => {
  const target = resolveSlug(slug);
  return visibleProducts.find(p => p.slug === target);
};

export const getSectionMeta = (id: Category) => sections.find(s => s.id === id);
export const getProductsBySection = (section: Category) => visibleProducts.filter(p => p.category === section);
export const getProductsBySubcategory = (section: Category, subcategory: string) =>
  visibleProducts.filter(p => p.category === section && p.subcategory === subcategory);
export const getProductsByGoal = (goal: Goal) => visibleProducts.filter(p => p.goals.includes(goal));
export const getBestSellers = () => visibleProducts.filter(p => p.bestSeller);
export const getFeaturedBundle = (): Product | undefined => undefined;
export const getBundleItems = (): Product[] => [];

/** Distinct dosage forms present in the active catalog (for filters). */
export const activeDosageForms = (): DosageForm[] => {
  const forms = new Set<DosageForm>();
  visibleProducts.forEach(p => p.dosageForms.forEach(f => forms.add(f)));
  return Array.from(forms);
};

export const getFrequentlyBoughtTogether = (product: Product, limit = 3): Product[] =>
  visibleProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit);

export const getRelatedProducts = (product: Product, limit = 4): Product[] => {
  const sameCategory = visibleProducts.filter(p => p.id !== product.id && p.category === product.category);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = visibleProducts.filter(
    p => p.id !== product.id && p.category !== product.category
  );
  return [...sameCategory, ...others].slice(0, limit);
};
