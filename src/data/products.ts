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
  | 'prescription-skin-hair'
  | 'provider-care'
  | 'accessories';

// Legacy alias retained so existing components that reference `product.section`
// and `ProductSection` keep working. Section === Category in the relaunch.
// Also accept legacy website section ids via getSectionMeta aliases.
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
  | 'Solution'
  | 'Service'
  | 'Accessory';

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
export const IMG_PELLET   = '/images/products/ChatGPT_Image_Jul_31,_2026,_04_23_30_PM.png';
export const IMG_TROCHE   = '/images/products/ChatGPT_Image_Jul_31,_2026,_04_24_15_PM.png';
export const IMG_HARD_CASE     = '/images/products/file_00000000546481f5898eb9ada42950af.png';
export const IMG_SYRINGE       = '/images/accessories/file_000000005a08820c8885cbb8b78888fd(1).png';
export const IMG_ALCOHOL_WIPES = '/images/accessories/file_000000005a08820c8885cbb8b78888fd(2).png';
export const IMG_PLANNER       = '/images/accessories/file_000000005a08820c8885cbb8b78888fd(3).png';
export const IMG_TRAVEL_BAG    = '/images/accessories/file_000000005a08820c8885cbb8b78888fd(4) copy.png';
export const IMG_INJECTION_KIT = '/images/accessories/file_00000000337881f5bf54d5fb59169558.png';
export const IMG_3D_CASE       = '/images/accessories/file_00000000546481f5898eb9ada42950af.png';
export const IMG_TEMP_CASE     = '/images/accessories/file_000000005a08820c8885cbb8b78888fd(4).png';
export const IMG_ICE_PACK      = '/images/accessories/file_000000000ab481f5b59b55279823b203.png';
export const IMG_SHARPS        = '/images/accessories/file_000000000ab481f5b59b55279823b203(1).png';

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
  {
    id: 'provider-care',
    label: 'Provider Care',
    tagline: 'Consultations & laboratory review',
    description: 'Consultations and laboratory reviews — personal, compassionate, and judgment-free.',
    disclosure: 'Provider Care services require scheduling and may involve a medical intake. Fulfillment occurs only after provider approval when applicable.',
    subcategories: [
      { id: 'consultation', label: 'Consultations' },
      { id: 'lab-review', label: 'Laboratory Review' },
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    tagline: 'Essentials for your ritual',
    description: 'Travel cases, supplies, and thoughtfully designed accessories to support your wellness routine.',
    disclosure: 'Accessories are wellness tools and supplies. They are not medications and do not require a prescription.',
    subcategories: [
      { id: 'cases', label: 'Cases' },
      { id: 'supplies', label: 'Supplies' },
      { id: 'bundles', label: 'Bundles' },
    ],
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
  'provider-care',
  'accessories',
];

/** Legacy website section ids → current category ids (preserve old links). */
export const SECTION_ALIASES: Record<string, Category> = {
  longevity: 'longevity-cognitive',
  'hrt-women': 'womens-hormone-therapy',
  research: 'recovery-performance',
};

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
    requiresProviderReview: seed.category === 'accessories' ? false : seed.category === 'provider-care' ? true : true,
    requiresPrescription: seed.category === 'accessories' || seed.category === 'provider-care' ? false : true,
    requiresComplianceReview: seed.category === 'accessories' ? false : true,
    requiresPharmacyVerification: seed.category === 'accessories' || seed.category === 'provider-care' ? false : true,
    providerDisclaimer: seed.providerDisclaimer,
    internalNotes: seed.internalNotes,
    needsDedicatedImage: seed.needsDedicatedImage,

    // Backward-compatible / derived
    name: seed.displayName,
    tagline: seed.subtitle,
    section: seed.category,
    subcategory:
      seed.category === 'provider-care'
        ? (seed.slug.includes('laboratory') ? 'lab-review' : 'consultation')
        : seed.category === 'accessories'
          ? (
              seed.slug.includes('kit') ? 'bundles'
              : (seed.slug.includes('case') || seed.slug.includes('bag')) ? 'cases'
              : 'supplies'
            )
          : (forms.length ? kebab(forms[0]) : 'other'),
    goals: seed.goals,
    price: Number.isFinite(startingPrice) ? startingPrice : 0,
    subscriptionPrice: seed.subscriptionPrice,
    startingAt: variants.length > 1,
    variablePricing: false,
    benefits: [],
    ingredients: 'Exact compounded formulation is determined by the prescribing provider and dispensing pharmacy.',
    directions: 'Use only as directed by your prescribing provider.',
    bestSeller: seed.bestSeller,
    requiresIntake: seed.category !== 'accessories',
    providerReviewed: seed.category !== 'accessories',
    alaCarte: true,
    featured: seed.category === 'accessories' && seed.slug === 'complete-injection-starter-kit',
    faqs: seed.category === 'accessories' ? [] : providerFaqs,
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

  // ===== PROVIDER CARE (preserved from website-improvements) =====
  mk({
    id: 'pc1',
    slug: 'initial-provider-consultation',
    displayName: 'Initial Provider Consultation',
    shortName: 'Initial Consultation',
    subtitle: 'Your first step to personalized care',
    category: 'provider-care',
    goals: ['hrt-women', 'weight-management', 'longevity'],
    shortDescription: 'A comprehensive consultation with a licensed provider to review your history and build your personalized plan.',
    longDescription: 'A comprehensive consultation with a licensed provider to review your history and build your personalized plan.',
    image: IMG_INJECTION,
    imageAlt: 'Initial provider consultation',
    variants: [{ dosageForm: 'Service', strength: '1 session', size: 'Visit', price: 75 }],
    providerDisclaimer: 'Provider Care services require scheduling and may involve a medical intake.',
    bestSeller: true,
  }),
  mk({
    id: 'pc2',
    slug: 'follow-up-appointment',
    displayName: 'Follow-Up Appointment',
    shortName: 'Follow-Up',
    subtitle: 'Ongoing care and adjustments',
    category: 'provider-care',
    goals: ['hrt-women', 'weight-management', 'longevity'],
    shortDescription: 'A follow-up consultation to review your progress and adjust your plan as needed.',
    longDescription: 'A follow-up consultation to review your progress and adjust your plan as needed.',
    image: IMG_INJECTION,
    imageAlt: 'Follow-up provider appointment',
    variants: [{ dosageForm: 'Service', strength: '1 session', size: 'Visit', price: 55 }],
    providerDisclaimer: 'Provider Care services require scheduling and may involve a medical intake.',
  }),
  mk({
    id: 'pc3',
    slug: 'laboratory-review',
    displayName: 'Laboratory Review',
    shortName: 'Lab Review',
    subtitle: 'Understand your results',
    category: 'provider-care',
    goals: ['hrt-women', 'longevity', 'weight-management'],
    shortDescription: 'A focused review of your laboratory results with a licensed provider to inform your care plan.',
    longDescription: 'A focused review of your laboratory results with a licensed provider to inform your care plan.',
    image: IMG_INJECTION,
    imageAlt: 'Laboratory review with a licensed provider',
    variants: [{ dosageForm: 'Service', strength: '1 session', size: 'Visit', price: 55 }],
    providerDisclaimer: 'Provider Care services require scheduling and may involve a medical intake.',
  }),

  // ===== ACCESSORIES (preserved from website-improvements) =====
  mk({
    id: 'a1',
    slug: 'complete-injection-starter-kit',
    displayName: 'Complete Injection Starter Kit',
    shortName: 'Starter Kit',
    subtitle: 'Everything you need, beautifully bundled',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'The ultimate starter kit: 3D printed peptide case, temperature-controlled travel case, discreet travel bag, reusable ice pack, wellness planner, sharps container, alcohol prep wipes, and insulin syringes — all in one. Save $71 versus buying each item separately.',
    longDescription: 'The ultimate starter kit: 3D printed peptide case, temperature-controlled travel case, discreet travel bag, reusable ice pack, wellness planner, sharps container, alcohol prep wipes, and insulin syringes — all in one.',
    image: IMG_INJECTION_KIT,
    imageAlt: 'Complete injection starter kit',
    variants: [{ dosageForm: 'Accessory', strength: 'Bundle', size: '1 kit', price: 119 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
    bestSeller: true,
  }),
  mk({
    id: 'a2',
    slug: 'premium-3d-printed-peptide-case',
    displayName: 'Premium 3D Printed Peptide Case',
    shortName: 'Peptide Case',
    subtitle: 'Precision protection, custom-printed',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'A custom 3D-printed case with precision-cut compartments designed to hold your peptide vials, syringes, and supplies securely.',
    longDescription: 'A custom 3D-printed case with precision-cut compartments designed to hold your peptide vials, syringes, and supplies securely.',
    image: IMG_3D_CASE,
    imageAlt: 'Premium 3D printed peptide case',
    variants: [{ dosageForm: 'Accessory', strength: 'Standard', size: '1 case', price: 34 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
    bestSeller: true,
  }),
  mk({
    id: 'a3',
    slug: 'temperature-controlled-travel-case',
    displayName: 'Temperature-Controlled Travel Case',
    shortName: 'Travel Case',
    subtitle: 'Keep your therapy cold, anywhere',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'An insulated travel case with a built-in thermal lining that maintains temperature for up to 48 hours — perfect for transporting peptide vials.',
    longDescription: 'An insulated travel case with a built-in thermal lining that maintains temperature for up to 48 hours.',
    image: IMG_TEMP_CASE,
    imageAlt: 'Temperature-controlled travel case',
    variants: [{ dosageForm: 'Accessory', strength: 'Standard', size: '1 case', price: 59 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
    bestSeller: true,
  }),
  mk({
    id: 'a4',
    slug: 'discreet-travel-bag',
    displayName: 'Discreet Travel Bag',
    shortName: 'Travel Bag',
    subtitle: 'Carry your routine anywhere',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'A sleek, vegan-leather travel bag with water-resistant lining — designed to hold your entire therapy kit discreetly.',
    longDescription: 'A sleek, vegan-leather travel bag with water-resistant lining.',
    image: IMG_TRAVEL_BAG,
    imageAlt: 'Discreet travel bag',
    variants: [{ dosageForm: 'Accessory', strength: 'Standard', size: '1 bag', price: 39 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
    bestSeller: true,
  }),
  mk({
    id: 'a5',
    slug: 'reusable-ice-pack',
    displayName: 'Reusable Ice Pack',
    shortName: 'Ice Pack',
    subtitle: 'Stay cool on the go',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'A reusable gel ice pack designed to keep your peptide vials cold during transport. Non-toxic and long-lasting.',
    longDescription: 'A reusable gel ice pack designed to keep your peptide vials cold during transport.',
    image: IMG_ICE_PACK,
    imageAlt: 'Reusable ice pack',
    variants: [{ dosageForm: 'Accessory', strength: 'Standard', size: '1 pack', price: 12 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
  }),
  mk({
    id: 'a6',
    slug: 'daily-weekly-wellness-planner',
    displayName: 'Daily & Weekly Wellness Planner',
    shortName: 'Planner',
    subtitle: 'Track your consistency',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'A daily/weekly planner with habit trackers, wellness goals, and progress reflection sections — designed around your therapy routine.',
    longDescription: 'A daily/weekly planner with habit trackers, wellness goals, and progress reflection sections.',
    image: IMG_PLANNER,
    imageAlt: 'Daily and weekly wellness planner',
    variants: [{ dosageForm: 'Accessory', strength: 'Standard', size: '1 planner', price: 29 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
  }),
  mk({
    id: 'a7',
    slug: 'sharps-container',
    displayName: 'Sharps Container',
    shortName: 'Sharps',
    subtitle: 'Safe disposal, done right',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'A FDA-cleared sharps container for the safe disposal of used syringes and needles. Secure, puncture-resistant, and easy to use.',
    longDescription: 'A FDA-cleared sharps container for the safe disposal of used syringes and needles.',
    image: IMG_SHARPS,
    imageAlt: 'Sharps container',
    variants: [{ dosageForm: 'Accessory', strength: 'Standard', size: '1 container', price: 10 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
  }),
  mk({
    id: 'a8',
    slug: 'alcohol-prep-wipes-100',
    displayName: 'Alcohol Prep Wipes (100 Count)',
    shortName: 'Wipes 100',
    subtitle: 'Sterile prep made simple',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'Individually wrapped 70% isopropyl alcohol prep pads for safe injection site preparation. 100-count box.',
    longDescription: 'Individually wrapped 70% isopropyl alcohol prep pads for safe injection site preparation. 100-count box.',
    image: IMG_ALCOHOL_WIPES,
    imageAlt: 'Alcohol prep wipes 100 count',
    variants: [{ dosageForm: 'Accessory', strength: '100 count', size: '1 box', price: 9 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
  }),
  mk({
    id: 'a9',
    slug: 'alcohol-prep-wipes-200',
    displayName: 'Alcohol Prep Wipes (200 Count)',
    shortName: 'Wipes 200',
    subtitle: 'Stock up and save',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'Individually wrapped 70% isopropyl alcohol prep pads for safe injection site preparation. 200-count box — better value.',
    longDescription: 'Individually wrapped 70% isopropyl alcohol prep pads for safe injection site preparation. 200-count box.',
    image: IMG_ALCOHOL_WIPES,
    imageAlt: 'Alcohol prep wipes 200 count',
    variants: [{ dosageForm: 'Accessory', strength: '200 count', size: '1 box', price: 15 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
  }),
  mk({
    id: 'a10',
    slug: 'premium-insulin-syringes-10',
    displayName: 'Premium Insulin Syringes (10 Pack)',
    shortName: 'Syringes 10',
    subtitle: 'Precision injection supplies',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'Sterile insulin syringes for subcutaneous injections. 10-pack — perfect for getting started.',
    longDescription: 'Sterile insulin syringes for subcutaneous injections. 10-pack.',
    image: IMG_SYRINGE,
    imageAlt: 'Premium insulin syringes 10 pack',
    variants: [{ dosageForm: 'Accessory', strength: '10 pack', size: '1 pack', price: 12 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
  }),
  mk({
    id: 'a11',
    slug: 'premium-insulin-syringes-50',
    displayName: 'Premium Insulin Syringes (50 Pack)',
    shortName: 'Syringes 50',
    subtitle: 'Better value, same quality',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'Sterile insulin syringes for subcutaneous injections. 50-pack — save more per syringe.',
    longDescription: 'Sterile insulin syringes for subcutaneous injections. 50-pack.',
    image: IMG_SYRINGE,
    imageAlt: 'Premium insulin syringes 50 pack',
    variants: [{ dosageForm: 'Accessory', strength: '50 pack', size: '1 pack', price: 39 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
  }),
  mk({
    id: 'a12',
    slug: 'premium-insulin-syringes-100',
    displayName: 'Premium Insulin Syringes (100 Pack)',
    shortName: 'Syringes 100',
    subtitle: 'Maximum savings, maximum convenience',
    category: 'accessories',
    goals: ['daily-wellness'],
    shortDescription: 'Sterile insulin syringes for subcutaneous injections. 100-pack — the best value for long-term therapy.',
    longDescription: 'Sterile insulin syringes for subcutaneous injections. 100-pack.',
    image: IMG_SYRINGE,
    imageAlt: 'Premium insulin syringes 100 pack',
    variants: [{ dosageForm: 'Accessory', strength: '100 pack', size: '1 pack', price: 69 }],
    providerDisclaimer: 'Accessories are wellness tools and supplies. They are not medications.',
  }),
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
export type MembershipStatus = 'active' | 'inactive';

export interface Membership {
  // --- Identity ---
  id: string;
  slug: string;
  displayName: string;
  brandName: string;
  // --- Pricing / billing ---
  monthlyPrice: number;
  billingFrequency: 'monthly';
  initialTermMonths: number;
  lockedRate: boolean;
  // --- Program contents ---
  includedProducts: string[];
  includedFormulations: string[];
  maximumIncludedFormulation: string;
  excludedFormulations: string[];
  // --- Compliance / fulfillment ---
  providerReviewRequired: boolean;
  prescriptionGuaranteed: boolean;
  shippingIncluded: boolean;
  // --- Lifecycle ---
  status: MembershipStatus;
  isVisible: boolean;
  // --- Commerce / integration ---
  checkoutProductId: string; // Stripe app_product_id (must be a recurring, synced product)
  supabaseId: string;
  // --- Copy ---
  shortDescription: string;
  longDescription: string;
  valueStatement: string;
  secondaryValueStatement: string;
  benefits: string[];
  exclusions: string[];
  termsSummary: string[];
  faq: { q: string; a: string }[];
  cta: string;
  // --- SEO / media ---
  seoTitle: string;
  seoDescription: string;
  image: string;
  imageAlt: string;
  /** Internal only — never rendered, never shipped in customer copy. */
  internalNotes?: string;

  // --- Backward-compatible fields consumed by existing components ---
  name: string;        // === displayName
  price: number;       // === monthlyPrice
  priceLabel: string;  // '/month'
  tagline: string;     // === brandName
  description: string; // === longDescription
  features: string[];  // === benefits
  highlighted?: boolean;
}

const SHARED_MEMBERSHIP_BENEFITS = [
  'Monthly recurring fulfillment when prescribed',
  'Locked membership rate while continuously enrolled',
  'Licensed-provider eligibility review',
  'Routine renewal questionnaire or progress check-in',
  'Refill coordination',
  'Pharmacy coordination',
  'Access to member pricing',
  'Early access to future wellness launches',
];

const sharedTerms = (initialTermMonths: number) => [
  `Your initial membership term is ${initialTermMonths} months. After the initial term, your membership continues month to month until canceled.`,
  'Your monthly membership rate remains locked while your membership stays continuously active and in good standing.',
  'If your membership is canceled or lapses beyond the permitted payment grace period, future enrollment will be subject to the membership pricing available at that time.',
  'Membership enrollment and payment do not guarantee that a prescription will be issued. Continued treatment, formulation, strength, and fulfillment remain subject to provider approval, pharmacy availability, applicable law, and completion of required follow-up information.',
  'If a licensed provider determines that continued treatment is not appropriate, future membership charges will be discontinued according to the membership terms.',
  'Switching between Semaglutide and Tirzepatide requires enrollment in the current rate for the new membership program.',
];

export const memberships: Membership[] = [
  {
    id: 'semaglutide-membership',
    slug: 'semaglutide-membership',
    displayName: 'Semaglutide Membership',
    brandName: 'Bare Balance',
    monthlyPrice: 199,
    billingFrequency: 'monthly',
    initialTermMonths: 3,
    lockedRate: true,
    includedProducts: ['Semaglutide + B6 Injection'],
    includedFormulations: ['1mg/1mg per mL, 2mL', '2mg/2mg per mL, 2mL', '5mg/2mg per mL, 2mL'],
    maximumIncludedFormulation: '5mg/2mg per mL, 2mL',
    excludedFormulations: [],
    providerReviewRequired: true,
    prescriptionGuaranteed: false,
    shippingIncluded: false,
    status: 'active',
    isVisible: true,
    checkoutProductId: 'm1',
    supabaseId: 'm1',
    shortDescription: 'One membership. One predictable monthly price. Provider-directed Semaglutide + B6 treatment.',
    longDescription:
      'A provider-guided Semaglutide membership. Your monthly membership price stays the same as your provider adjusts your eligible treatment within the included program while you remain continuously enrolled.',
    valueStatement: 'One membership. One predictable monthly price.',
    secondaryValueStatement:
      'Your membership price stays the same as your provider adjusts your eligible treatment within the included program.',
    benefits: [
      ...SHARED_MEMBERSHIP_BENEFITS.slice(0, 4),
      'Provider-directed formulation or strength adjustments within the included program',
      ...SHARED_MEMBERSHIP_BENEFITS.slice(4),
    ],
    exclusions: [],
    termsSummary: sharedTerms(3),
    faq: [
      {
        q: 'Will my price increase if my treatment changes?',
        a: 'Your Semaglutide membership remains $199 per month while your membership stays continuously active and your provider-selected treatment remains within the included program.',
      },
    ],
    cta: 'Join Semaglutide Membership',
    seoTitle: 'Semaglutide Membership — My Bare Method',
    seoDescription: 'Locked-price provider-guided Semaglutide membership from My Bare Method.',
    image: IMG_INJECTION,
    imageAlt: 'Semaglutide Membership — provider-directed Semaglutide + B6 injection program',

    name: 'Semaglutide Membership',
    price: 199,
    priceLabel: '/month',
    tagline: 'Bare Balance',
    description:
      'A provider-guided Semaglutide membership. Your monthly membership price stays the same as your provider adjusts your eligible treatment within the included program while you remain continuously enrolled.',
    features: [
      ...SHARED_MEMBERSHIP_BENEFITS.slice(0, 4),
      'Provider-directed formulation or strength adjustments within the included program',
      ...SHARED_MEMBERSHIP_BENEFITS.slice(4),
    ],
  },
  {
    id: 'tirzepatide-membership',
    slug: 'tirzepatide-membership',
    displayName: 'Tirzepatide Membership',
    brandName: 'Bare Momentum',
    monthlyPrice: 249,
    billingFrequency: 'monthly',
    initialTermMonths: 3,
    lockedRate: true,
    includedProducts: ['Tirzepatide + B6 Injection'],
    includedFormulations: ['5mg/2mg per mL, 2mL', '15mg/2mg per mL, 2mL', '25mg/2mg per mL, 2mL'],
    maximumIncludedFormulation: '25mg/2mg per mL, 2mL',
    excludedFormulations: ['30mg/2mg per mL, 2mL'],
    providerReviewRequired: true,
    prescriptionGuaranteed: false,
    shippingIncluded: false,
    status: 'active',
    isVisible: true,
    checkoutProductId: 'm2',
    supabaseId: 'm2',
    shortDescription: 'One predictable monthly rate through the included program maximum. Provider-directed Tirzepatide + B6 treatment.',
    longDescription:
      'A provider-guided Tirzepatide membership. Your monthly membership price stays the same as your provider adjusts your eligible treatment within the included program through 25mg/2mg per mL, 2mL while you remain continuously enrolled.',
    valueStatement: 'One predictable monthly rate through the included program maximum.',
    secondaryValueStatement:
      'Your membership price stays the same as your provider adjusts your eligible treatment within the included program maximum.',
    benefits: [
      ...SHARED_MEMBERSHIP_BENEFITS.slice(0, 4),
      'Provider-directed formulation or strength adjustments within the included program maximum',
      ...SHARED_MEMBERSHIP_BENEFITS.slice(4),
    ],
    exclusions: ['Formulations above 25mg/2mg per mL, 2mL (including 30mg/2mg per mL, 2mL) are not part of this membership.'],
    termsSummary: [
      ...sharedTerms(3),
      'The $249 locked rate includes eligible provider-selected formulations through 25mg/2mg per mL, 2mL. Formulations above the included maximum are not part of this membership.',
    ],
    faq: [
      {
        q: 'Will my price increase if my treatment changes?',
        a: 'Your Tirzepatide membership remains $249 per month while your membership stays continuously active and your provider-selected treatment remains within the included program through 25mg/2mg per mL, 2mL.',
      },
      {
        q: 'Is the highest Tirzepatide formulation included?',
        a: 'The $249 membership includes eligible provider-selected formulations through 25mg/2mg per mL, 2mL. Formulations above that program maximum are not included.',
      },
    ],
    cta: 'Join Tirzepatide Membership',
    seoTitle: 'Tirzepatide Membership — My Bare Method',
    seoDescription: 'Locked-price provider-guided Tirzepatide membership through the included program maximum.',
    image: IMG_INJECTION,
    imageAlt: 'Tirzepatide Membership — provider-directed Tirzepatide + B6 injection program',
    highlighted: true,

    name: 'Tirzepatide Membership',
    price: 249,
    priceLabel: '/month',
    tagline: 'Bare Momentum',
    description:
      'A provider-guided Tirzepatide membership. Your monthly membership price stays the same as your provider adjusts your eligible treatment within the included program through 25mg/2mg per mL, 2mL while you remain continuously enrolled.',
    features: [
      ...SHARED_MEMBERSHIP_BENEFITS.slice(0, 4),
      'Provider-directed formulation or strength adjustments within the included program maximum',
      ...SHARED_MEMBERSHIP_BENEFITS.slice(4),
    ],
  },
  // Retained but hidden (preserved, not deleted): non-weight wellness membership.
  {
    id: 'elite-wellness-membership',
    slug: 'elite-wellness-membership',
    displayName: 'Bare Elite Wellness',
    brandName: 'Bare Elite Wellness',
    monthlyPrice: 49,
    billingFrequency: 'monthly',
    initialTermMonths: 3,
    lockedRate: true,
    includedProducts: [],
    includedFormulations: [],
    maximumIncludedFormulation: '',
    excludedFormulations: [],
    providerReviewRequired: true,
    prescriptionGuaranteed: false,
    shippingIncluded: false,
    status: 'inactive',
    isVisible: false,
    checkoutProductId: '',
    supabaseId: '',
    shortDescription: 'Member pricing on other wellness products.',
    longDescription: 'Member pricing on other wellness products, priority processing, and early access to new therapies.',
    valueStatement: '',
    secondaryValueStatement: '',
    benefits: ['Exclusive member pricing', 'Priority processing', 'Early access to new therapies'],
    exclusions: [],
    termsSummary: sharedTerms(3),
    faq: [],
    cta: 'Learn More',
    seoTitle: 'Bare Elite Wellness — My Bare Method',
    seoDescription: 'Member pricing on wellness products from My Bare Method.',
    image: IMG_INJECTION,
    imageAlt: 'Bare Elite Wellness membership',

    name: 'Bare Elite Wellness',
    price: 49,
    priceLabel: '/month',
    tagline: 'All other wellness products',
    description: 'Member pricing on other wellness products, priority processing, and early access to new therapies.',
    features: ['Exclusive member pricing', 'Priority processing', 'Early access to new therapies'],
  },
];

/** Public, visible memberships (weight-management program). */
export const visibleMemberships = memberships.filter(m => m.isVisible && m.status === 'active');
export const getMembership = (slug: string) => visibleMemberships.find(m => m.slug === slug);

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
  if (concernId === 'weight-management') return visibleMemberships;
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

export const getSectionMeta = (id: string) => {
  const resolved = (SECTION_ALIASES[id] ?? id) as Category;
  return sections.find(s => s.id === resolved);
};
export const getProductsBySection = (section: Category) => visibleProducts.filter(p => p.category === section);
export const getProductsBySubcategory = (section: Category, subcategory: string) =>
  visibleProducts.filter(p => p.category === section && p.subcategory === subcategory);
export const getProductsByGoal = (goal: Goal) => visibleProducts.filter(p => p.goals.includes(goal));
export const getBestSellers = () => visibleProducts.filter(p => p.bestSeller);
export const getFeaturedBundle = (): Product | undefined =>
  visibleProducts.find(p => p.category === 'accessories' && p.featured);
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
