export type ProductSection = 'weight-management' | 'longevity' | 'hrt-women' | 'provider-care' | 'research' | 'accessories';

export type Goal =
  | 'weight-management'
  | 'longevity'
  | 'hrt-women'
  | 'performance'
  | 'recovery'
  | 'focus'
  | 'beauty'
  | 'daily-wellness';

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  section: ProductSection;
  subcategory: string;
  goals: Goal[];
  price: number;
  subscriptionPrice?: number;
  startingAt?: boolean;
  variablePricing?: boolean;
  priceLabel?: string;
  image: string;
  shortDescription: string;
  benefits: string[];
  ingredients: string;
  directions: string;
  bestSeller?: boolean;
  requiresIntake?: boolean;
  providerReviewed?: boolean;
  alaCarte?: boolean;
  featured?: boolean;
  bundleItems?: string[];
  bundleRegularPrice?: number;
  faqs: { q: string; a: string }[];
  disclosures?: string;
}

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
    id: 'glp1-membership',
    name: 'Bare GLP-1 Membership',
    price: 175,
    priceLabel: '/month',
    tagline: 'Semaglutide program',
    description: 'Your complete semaglutide weight management program. One locked-in price no matter the dose — provider-guided care included.',
    features: [
      'Semaglutide program',
      'Locked-in pricing at every dose',
      'Monthly refills',
      'Provider-guided care',
      '3-month minimum',
    ],
  },
  {
    id: 'glp1-gip-membership',
    name: 'Bare GLP-1/GIP Membership',
    price: 225,
    priceLabel: '/month',
    tagline: 'Tirzepatide program',
    description: 'Our premium dual incretin tirzepatide program. One locked-in price no matter the dose — with priority fulfillment and provider-guided care.',
    features: [
      'Tirzepatide program',
      'Locked-in pricing at every dose',
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
    tagline: 'All non-GLP-1 wellness products',
    description: 'Unlock exclusive member pricing on all non-GLP-1 wellness products, priority processing, and early access to new therapies.',
    features: [
      'Exclusive member pricing',
      'Priority processing',
      'Member-only promotions',
      'Early access to new therapies',
      'Discount on accessories',
    ],
  },
];

export interface Subcategory {
  id: string;
  label: string;
  description?: string;
}

export interface SectionMeta {
  id: ProductSection;
  label: string;
  tagline: string;
  description: string;
  disclosure: string;
  subcategories: Subcategory[];
}

export const IMG_CAPSULE  = '/images/products/file_00000000e110822fb1dd36d19b3c9896 copy.png';
export const IMG_INJECTION = '/images/products/file_0000000081dc822f831112a2c1e5d3d9 copy.png';
export const IMG_NASAL    = '/images/products/nasal-spray.png';
export const IMG_SPRAY    = '/images/products/ChatGPT_Image_Aug_3,_2026,_04_16_27_PM.png';
export const IMG_PATCH    = '/images/products/patches.png';
export const IMG_CREAM    = '/images/products/ChatGPT_Image_Jul_31,_2026,_04_22_43_PM.png';
export const IMG_GEL      = '/images/products/ChatGPT_Image_Aug_3,_2026,_04_14_54_PM.png';
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

/**
 * Returns the canonical product image for a given product name / subcategory.
 * Rules (in priority order):
 *  1. "nasal-spray" subcategory or name contains "nasal spray"  → nasal spray bottle
 *  2. "capsules" subcategory or name contains capsule/tablet/troche/oral → capsule bottle
 *  3. Everything else (injections, pellets, creams, gels, patches, services) → injection vial
 */
export function getFormImage(name: string, subcategory: string): string {
  const n = name.toLowerCase();
  const s = subcategory.toLowerCase();
  if (n.includes('injection starter kit') || n.includes('complete injection')) return IMG_INJECTION_KIT;
  if (n.includes('3d printed') || n.includes('peptide case')) return IMG_3D_CASE;
  if (n.includes('temperature') || n.includes('travel case')) return IMG_TEMP_CASE;
  if (n.includes('travel bag')) return IMG_TRAVEL_BAG;
  if (n.includes('ice pack')) return IMG_ICE_PACK;
  if (n.includes('planner')) return IMG_PLANNER;
  if (n.includes('sharps')) return IMG_SHARPS;
  if (n.includes('alcohol') || n.includes('wipe') || n.includes('prep pad')) return IMG_ALCOHOL_WIPES;
  if (n.includes('syringe') || s === 'supplies') return IMG_SYRINGE;
  if (n.includes('hard case') || s === 'cases') return IMG_HARD_CASE;
  if (s === 'nasal-spray' || n.includes('nasal spray')) return IMG_NASAL;
  if (n.includes('patch') || n.includes('transdermal')) return IMG_PATCH;
  if (n.includes('gel') || n.includes('topical gel')) return IMG_GEL;
  if (n.includes('topical spray')) return IMG_SPRAY;
  if (n.includes('cream')) return IMG_CREAM;
  if (n.includes('pellet')) return IMG_PELLET;
  if (n.includes('troche') || n.includes('lozenge')) return IMG_TROCHE;
  if (
    s === 'capsules' ||
    n.includes('capsule') ||
    n.includes('tablet') ||
    n.includes('methylene blue') ||
    n.includes('dihexa')
  ) return IMG_CAPSULE;
  return IMG_INJECTION;
}

export const sections: SectionMeta[] = [
  {
    id: 'weight-management',
    label: 'Weight Management',
    tagline: 'Metabolic support, refined',
    description: 'GLP-1 and dual incretin therapies to support sustainable, feel-good progress — provider-guided and personalized to you.',
    disclosure: 'Weight Management products require completion of a medical intake and review by a licensed provider. Fulfillment occurs only after provider approval. This is not a guarantee of prescription. If not approved, a full refund is issued.',
    subcategories: [
      { id: 'glp-1', label: 'GLP-1', description: 'Single incretin receptor agonist therapies' },
      { id: 'glp-1-gip', label: 'GLP-1/GIP', description: 'Dual incretin receptor agonist therapies' },
    ],
  },
  {
    id: 'longevity',
    label: 'Longevity',
    tagline: 'Cellular health, gracefully',
    description: 'NAD+, B12, glutathione, and growth hormone support for cellular energy and healthy aging at every stage of life.',
    disclosure: 'Longevity products may require a medical intake and provider review. Fulfillment occurs only after provider approval when applicable.',
    subcategories: [
      { id: 'injections', label: 'Injections' },
      { id: 'nasal-spray', label: 'Nasal Spray' },
      { id: 'capsules', label: 'Capsules' },
    ],
  },
  {
    id: 'hrt-women',
    label: 'HRT for Women',
    tagline: 'Hormone balance, personal',
    description: 'Estrogen, progesterone, testosterone, and combination hormone therapies — in multiple delivery formats to fit your life.',
    disclosure: 'HRT for Women products require completion of a medical intake and review by a licensed provider. Fulfillment occurs only after provider approval. This is not a guarantee of prescription. If not approved, a full refund is issued. Pricing varies by medication, dosage, formulation, and treatment plan determined after intake.',
    subcategories: [
      { id: 'estrogen', label: 'Estrogen Therapy' },
      { id: 'progesterone', label: 'Progesterone Therapy' },
      { id: 'testosterone', label: 'Testosterone Therapy' },
      { id: 'combination', label: 'Combination Hormone Therapy' },
    ],
  },
  {
    id: 'provider-care',
    label: 'Provider Care',
    tagline: 'Care, guided by licensed providers',
    description: 'Consultations and laboratory reviews — personal, compassionate, and judgment-free.',
    disclosure: 'Provider Care services require scheduling and may involve a medical intake. Fulfillment occurs only after provider approval when applicable.',
    subcategories: [
      { id: 'consultation', label: 'Consultations' },
      { id: 'lab-review', label: 'Laboratory Review' },
    ],
  },
  {
    id: 'research',
    label: 'Research Catalog',
    tagline: 'For the scientifically curious',
    description: 'High-purity research peptides and reagents for laboratory and research purposes only. Not for human consumption.',
    disclosure: 'Research products are sold for laboratory use only. Not for human consumption. Not intended to diagnose, treat, cure, or prevent any disease.',
    subcategories: [
      { id: 'injections', label: 'Injections' },
      { id: 'capsules', label: 'Capsules' },
      { id: 'nasal-spray', label: 'Nasal Sprays' },
      { id: 'other', label: 'Other' },
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    tagline: 'Thoughtful essentials for your routine',
    description: 'Premium accessories to support your therapy and wellness routine — from storage cases to injection supplies.',
    disclosure: 'Accessories are non-refundable. All sales are final.',
    subcategories: [
      { id: 'cases', label: 'Cases' },
      { id: 'supplies', label: 'Supplies' },
      { id: 'bundles', label: 'Bundles' },
    ],
  },
];

const baseFaqs = (isProvider: boolean, isResearch: boolean) => {
  if (isResearch) return [
    { q: 'What does "research use only" mean?', a: 'This product is sold for laboratory and research purposes only. It is not a dietary supplement or medication and is not intended for human consumption.' },
    { q: 'How are research products shipped?', a: 'Research products are shipped with appropriate handling, including cold-chain options for temperature-sensitive reagents.' },
  ];
  if (isProvider) return [
    { q: 'What happens after I order?', a: 'You will receive a link to complete a secure medical intake. A licensed provider reviews your history and, if appropriate, approves and prescribes your personalized plan.' },
    { q: 'What if I am not approved?', a: 'If the provider determines this is not appropriate for you, you receive a full refund within 3 business days.' },
    { q: 'Which states do you serve?', a: 'We currently serve most US states. You will be notified during intake if your state is not yet supported.' },
  ];
  return [
    { q: 'Can I take this with my current medications?', a: 'Always consult your healthcare provider before adding any new therapy, especially if you take prescription medications.' },
  ];
};

let pid = 0;
const mk = (
  name: string, section: ProductSection, subcategory: string, goals: Goal[],
  price: number, opts: Partial<Product> = {}
): Product => {
  pid++;
  const isResearch = section === 'research';
  const isProvider = Boolean(section === 'provider-care' || opts.requiresIntake || opts.providerReviewed);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + `-${pid}`;
  const image = opts.image || getFormImage(name, subcategory);
  return {
    id: `p${pid}`,
    slug,
    name,
    tagline: opts.tagline || subcategory,
    section,
    subcategory,
    goals,
    price,
    subscriptionPrice: opts.subscriptionPrice,
    startingAt: opts.startingAt,
    variablePricing: opts.variablePricing,
    priceLabel: opts.priceLabel,
    image,
    shortDescription: opts.shortDescription || `${name} for ${section.replace(/-/g, ' ')}.`,
    benefits: opts.benefits || ['Supports your wellness goals', 'Premium quality', 'Provider-reviewed when applicable'],
    ingredients: opts.ingredients || 'Specific formulation determined after provider review.',
    directions: opts.directions || 'Use as directed by your provider.',
    bestSeller: opts.bestSeller,
    requiresIntake: opts.requiresIntake,
    providerReviewed: opts.providerReviewed,
    alaCarte: opts.alaCarte,
    featured: opts.featured,
    bundleItems: opts.bundleItems,
    bundleRegularPrice: opts.bundleRegularPrice,
    faqs: opts.faqs || baseFaqs(isProvider, isResearch),
    disclosures: opts.disclosures,
  };
};

export const products: Product[] = [
  // ===== WEIGHT MANAGEMENT: GLP-1 =====
  mk('GLP-1', 'weight-management', 'glp-1', ['weight-management'], 150, {
    tagline: 'Single incretin receptor agonist', shortDescription: 'GLP-1 receptor agonist injection to support appetite regulation and metabolic balance.',
    benefits: ['Supports appetite regulation', 'Promotes metabolic balance', 'Provider-personalized dosing', 'Weekly injection'],
    ingredients: 'Compounded GLP-1 receptor agonist. Specific formulation and dosage determined after provider review.',
    directions: 'Subcutaneous injection as directed by your provider. Typically once weekly.', bestSeller: true, requiresIntake: true, providerReviewed: true, startingAt: true, subscriptionPrice: 175,
  }),
  mk('GLP-1 + B12 Injection', 'weight-management', 'glp-1', ['weight-management'], 150, {
    tagline: 'GLP-1 with B12 energy support', shortDescription: 'GLP-1 receptor agonist combined with B12 for metabolic support and energy.',
    benefits: ['Appetite regulation', 'B12 energy support', 'Weekly injection', 'Provider-personalized'], requiresIntake: true, providerReviewed: true, startingAt: true, subscriptionPrice: 175,
  }),
  mk('GLP-1 + L-Carnitine Injection', 'weight-management', 'glp-1', ['weight-management'], 150, {
    tagline: 'GLP-1 with L-Carnitine', shortDescription: 'GLP-1 combined with L-Carnitine to support fat metabolism and energy production.',
    benefits: ['Appetite regulation', 'Supports fat metabolism', 'Energy production', 'Weekly injection'], requiresIntake: true, providerReviewed: true, startingAt: true, subscriptionPrice: 175,
  }),
  mk('GLP-1 + Glycine Injection', 'weight-management', 'glp-1', ['weight-management'], 150, {
    tagline: 'GLP-1 with Glycine', shortDescription: 'GLP-1 combined with glycine for metabolic support and improved sleep quality.',
    benefits: ['Appetite regulation', 'Supports restful sleep', 'Metabolic support', 'Weekly injection'], requiresIntake: true, providerReviewed: true, startingAt: true, subscriptionPrice: 175,
  }),

  // ===== WEIGHT MANAGEMENT: GLP-1/GIP =====
  mk('GLP-1/GIP', 'weight-management', 'glp-1-gip', ['weight-management'], 200, {
    tagline: 'Dual incretin receptor agonist', shortDescription: 'Dual GIP/GLP-1 receptor agonist injection for enhanced metabolic support.',
    benefits: ['Dual incretin pathway support', 'Enhanced appetite regulation', 'Provider-personalized dosing', 'Weekly injection'], bestSeller: true, requiresIntake: true, providerReviewed: true, startingAt: true, subscriptionPrice: 225,
  }),
  mk('GLP-1/GIP + B12 Injection', 'weight-management', 'glp-1-gip', ['weight-management'], 200, {
    tagline: 'Dual incretin with B12', shortDescription: 'Dual GIP/GLP-1 combined with B12 for comprehensive metabolic and energy support.',
    benefits: ['Dual incretin support', 'B12 energy boost', 'Weekly injection', 'Provider-personalized'], requiresIntake: true, providerReviewed: true, startingAt: true, subscriptionPrice: 225,
  }),
  mk('GLP-1/GIP + L-Carnitine Injection', 'weight-management', 'glp-1-gip', ['weight-management'], 200, {
    tagline: 'Dual incretin with L-Carnitine', shortDescription: 'Dual GIP/GLP-1 combined with L-Carnitine for enhanced fat metabolism.',
    benefits: ['Dual incretin support', 'Fat metabolism', 'Energy production', 'Weekly injection'], requiresIntake: true, providerReviewed: true, startingAt: true, subscriptionPrice: 225,
  }),
  mk('GLP-1/GIP + Glycine Injection', 'weight-management', 'glp-1-gip', ['weight-management'], 200, {
    tagline: 'Dual incretin with Glycine', shortDescription: 'Dual GIP/GLP-1 combined with glycine for metabolic support and sleep.',
    benefits: ['Dual incretin support', 'Sleep quality', 'Metabolic support', 'Weekly injection'], requiresIntake: true, providerReviewed: true, startingAt: true, subscriptionPrice: 225,
  }),

  // ===== LONGEVITY =====
  mk('NAD+ Injection', 'longevity', 'injections', ['longevity'], 149.99, {
    tagline: 'Cellular energy coenzyme', shortDescription: 'NAD+ injection to support cellular energy, DNA repair, and healthy aging.',
    benefits: ['Supports NAD+ levels', 'Cellular energy', 'DNA repair pathways', 'Subcutaneous injection'], bestSeller: true, startingAt: true,
  }),
  mk('NAD+ Nasal Spray', 'longevity', 'nasal-spray', ['longevity'], 186, {
    tagline: 'NAD+ via nasal delivery', shortDescription: 'NAD+ nasal spray for convenient daily cellular energy support.',
    benefits: ['Convenient daily use', 'Supports NAD+ levels', 'No injection needed', 'Cellular energy'], startingAt: true,
  }),
  mk('Glutathione Injection', 'longevity', 'injections', ['longevity', 'beauty'], 59.99, {
    tagline: 'Master antioxidant', shortDescription: 'Glutathione injection for powerful antioxidant support, detoxification, and skin health.',
    benefits: ['Master antioxidant', 'Detoxification support', 'Skin brightening', 'Immune support'], startingAt: true,
  }),
  mk('Sermorelin Injection', 'longevity', 'injections', ['longevity', 'recovery'], 119.99, {
    tagline: 'Growth hormone support', shortDescription: 'Sermorelin injection to support natural growth hormone production and recovery.',
    benefits: ['Supports natural GH production', 'Recovery support', 'Sleep quality', 'Body composition'], requiresIntake: true, providerReviewed: true, startingAt: true,
  }),
  mk('Sermorelin Capsules', 'longevity', 'capsules', ['longevity', 'recovery'], 211, {
    tagline: 'Oral growth hormone support', shortDescription: 'Sermorelin capsules for convenient daily growth hormone support.',
    benefits: ['Convenient oral format', 'Supports natural GH', 'Recovery support', 'Daily use'], requiresIntake: true, providerReviewed: true, startingAt: true,
  }),
  mk('B12 Injection', 'longevity', 'injections', ['longevity', 'daily-wellness'], 49, {
    tagline: 'Energy & metabolism support', shortDescription: 'B12 injection for energy production, metabolism, and nervous system health.',
    benefits: ['Energy production', 'Metabolism support', 'Nervous system health', 'Weekly injection'], bestSeller: true,
  }),

  // ===== HRT FOR WOMEN: ESTROGEN =====
  mk('Estrogen Tablets/Capsules', 'hrt-women', 'estrogen', ['hrt-women'], 0, {
    tagline: 'Oral estrogen therapy', shortDescription: 'Oral estrogen therapy for symptom relief and hormone balance.',
    benefits: ['Symptom relief', 'Hormone balance', 'Convenient oral format', 'Provider-personalized dosing'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Estrogen Transdermal Patch', 'hrt-women', 'estrogen', ['hrt-women'], 0, {
    tagline: 'Steady delivery patch', shortDescription: 'Estrogen transdermal patch for steady, consistent hormone delivery through the skin.',
    benefits: ['Steady delivery', 'Twice-weekly application', 'Avoids first-pass metabolism', 'Discreet'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Estrogen Topical Gel', 'hrt-women', 'estrogen', ['hrt-women'], 0, {
    tagline: 'Daily topical gel', shortDescription: 'Estrogen topical gel for daily hormone delivery with adjustable dosing.',
    benefits: ['Daily application', 'Adjustable dosing', 'Absorbs quickly', 'Flexible delivery'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Estrogen Topical Spray', 'hrt-women', 'estrogen', ['hrt-women'], 0, {
    tagline: 'Quick-drying spray', shortDescription: 'Estrogen topical spray for convenient, quick-drying daily hormone delivery.',
    benefits: ['Quick-drying', 'Convenient application', 'Daily use', 'Portable'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Estrogen Vaginal Cream', 'hrt-women', 'estrogen', ['hrt-women'], 0, {
    tagline: 'Localized vaginal therapy', shortDescription: 'Estrogen vaginal cream for localized symptom relief and vaginal health.',
    benefits: ['Localized relief', 'Vaginal health', 'Low systemic absorption', 'Targeted delivery'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Estrogen Vaginal Tablets', 'hrt-women', 'estrogen', ['hrt-women'], 0, {
    tagline: 'Vaginal estrogen tablets', shortDescription: 'Estrogen vaginal tablets for localized delivery and vaginal health support.',
    benefits: ['Localized delivery', 'Vaginal health', 'Convenient format', 'Low systemic absorption'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Estrogen Vaginal Ring', 'hrt-women', 'estrogen', ['hrt-women'], 0, {
    tagline: '3-month continuous delivery', shortDescription: 'Estrogen vaginal ring for continuous, low-dose hormone delivery over 3 months.',
    benefits: ['Continuous delivery', 'Lasts 3 months', 'Low maintenance', 'Steady dosing'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Estrogen Pellets', 'hrt-women', 'estrogen', ['hrt-women'], 0, {
    tagline: 'Long-acting pellet therapy', shortDescription: 'Estrogen pellets for continuous, long-acting hormone delivery over several months.',
    benefits: ['Continuous delivery', 'Lasts 3–6 months', 'No daily maintenance', 'Steady hormone levels'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),

  // ===== HRT FOR WOMEN: PROGESTERONE =====
  mk('Progesterone Capsules', 'hrt-women', 'progesterone', ['hrt-women'], 0, {
    tagline: 'Oral progesterone therapy', shortDescription: 'Oral progesterone capsules for hormone balance and sleep support.',
    benefits: ['Hormone balance', 'Sleep support', 'Convenient oral format', 'Provider-personalized'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Sustained-Release Progesterone', 'hrt-women', 'progesterone', ['hrt-women'], 0, {
    tagline: 'Extended-release formula', shortDescription: 'Sustained-release progesterone for steady hormone delivery throughout the day and night.',
    benefits: ['Steady delivery', 'Extended release', 'Sleep support', 'Once daily'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Progesterone Cream', 'hrt-women', 'progesterone', ['hrt-women'], 0, {
    tagline: 'Topical progesterone', shortDescription: 'Topical progesterone cream for convenient daily hormone delivery.',
    benefits: ['Topical delivery', 'Daily use', 'Adjustable dosing', 'Non-oral option'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Progesterone Troches', 'hrt-women', 'progesterone', ['hrt-women'], 0, {
    tagline: 'Sublingual troches', shortDescription: 'Progesterone troches for sublingual absorption and convenient delivery.',
    benefits: ['Sublingual absorption', 'Bypasses digestion', 'Fast delivery', 'Convenient format'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),

  // ===== HRT FOR WOMEN: TESTOSTERONE =====
  mk('Testosterone Cream', 'hrt-women', 'testosterone', ['hrt-women'], 0, {
    tagline: 'Topical testosterone', shortDescription: 'Testosterone cream for women to support libido, energy, and vitality.',
    benefits: ['Libido support', 'Energy & vitality', 'Topical delivery', 'Adjustable dosing'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Testosterone Gel', 'hrt-women', 'testosterone', ['hrt-women'], 0, {
    tagline: 'Daily testosterone gel', shortDescription: 'Testosterone gel for daily hormone delivery and vitality support.',
    benefits: ['Daily application', 'Quick absorption', 'Vitality support', 'Flexible dosing'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Testosterone Injections', 'hrt-women', 'testosterone', ['hrt-women'], 79.99, {
    tagline: 'Injectable testosterone', shortDescription: 'Testosterone injections for women seeking steady hormone delivery.',
    benefits: ['Steady delivery', 'Weekly injection', 'Vitality support', 'Provider-monitored'], requiresIntake: true, providerReviewed: true, startingAt: true,
  }),
  mk('Testosterone Pellets', 'hrt-women', 'testosterone', ['hrt-women'], 0, {
    tagline: 'Long-acting pellet therapy', shortDescription: 'Testosterone pellets for continuous, long-acting hormone delivery.',
    benefits: ['Continuous delivery', 'Lasts 3–6 months', 'No daily maintenance', 'Steady levels'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Testosterone Troches', 'hrt-women', 'testosterone', ['hrt-women'], 0, {
    tagline: 'Sublingual testosterone', shortDescription: 'Testosterone troches for sublingual absorption and convenient delivery.',
    benefits: ['Sublingual absorption', 'Convenient format', 'Bypasses digestion', 'Daily use'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),

  // ===== HRT FOR WOMEN: COMBINATION =====
  mk('Bi-Est', 'hrt-women', 'combination', ['hrt-women'], 0, {
    tagline: 'Estriol + Estradiol blend', shortDescription: 'Bi-Est combination therapy blending estriol and estradiol for balanced estrogen support.',
    benefits: ['Balanced estrogen support', 'Two estrogen forms', 'Personalized ratios', 'Comprehensive therapy'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Tri-Est', 'hrt-women', 'combination', ['hrt-women'], 0, {
    tagline: 'Three-estrogen blend', shortDescription: 'Tri-Est combination therapy blending estriol, estradiol, and estrone for comprehensive support.',
    benefits: ['Three estrogen forms', 'Comprehensive support', 'Personalized ratios', 'Mimics natural balance'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Estrogen + Progesterone', 'hrt-women', 'combination', ['hrt-women'], 0, {
    tagline: 'Combined hormone therapy', shortDescription: 'Estrogen and progesterone combined for balanced hormone replacement therapy.',
    benefits: ['Balanced hormone support', 'Convenient combination', 'Uterine protection', 'Provider-personalized'], bestSeller: true, requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),
  mk('Estrogen + Progesterone + Testosterone', 'hrt-women', 'combination', ['hrt-women'], 0, {
    tagline: 'Triple hormone therapy', shortDescription: 'Comprehensive triple hormone therapy combining estrogen, progesterone, and testosterone.',
    benefits: ['Comprehensive hormone support', 'All three key hormones', 'Personalized dosing', 'Single formulation'], requiresIntake: true, providerReviewed: true, variablePricing: true,
  }),

  // ===== PROVIDER CARE =====
  mk('Initial Provider Consultation', 'provider-care', 'consultation', ['hrt-women', 'weight-management', 'longevity'], 75, {
    image: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tagline: 'Your first step to personalized care', shortDescription: 'A comprehensive consultation with a licensed provider to review your history and build your personalized plan.',
    benefits: ['Comprehensive consultation', 'Personalized care plan', 'Licensed provider', 'Compassionate, judgment-free'], bestSeller: true, requiresIntake: true, providerReviewed: true,
  }),
  mk('Follow-Up Appointment', 'provider-care', 'consultation', ['hrt-women', 'weight-management', 'longevity'], 55, {
    image: 'https://images.pexels.com/photos/29995629/pexels-photo-29995629.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tagline: 'Ongoing care and adjustments', shortDescription: 'A follow-up consultation to review your progress and adjust your plan as needed.',
    benefits: ['Progress review', 'Plan adjustments', 'Ongoing provider access', 'Continued support'], requiresIntake: true, providerReviewed: true,
  }),
  mk('Laboratory Review', 'provider-care', 'lab-review', ['hrt-women', 'longevity', 'weight-management'], 55, {
    image: 'https://images.pexels.com/photos/5234519/pexels-photo-5234519.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tagline: 'Comprehensive lab analysis', shortDescription: 'A provider-reviewed analysis of your lab results with personalized recommendations.',
    benefits: ['Comprehensive lab review', 'Personalized recommendations', 'Provider-reviewed', 'Actionable insights'], requiresIntake: true, providerReviewed: true,
  }),
  // ===== RESEARCH CATALOG: INJECTIONS =====
  mk('GHK-Cu Injection', 'research', 'injections', ['longevity', 'beauty', 'recovery'], 109.99, {
    tagline: 'Copper peptide research reagent', shortDescription: 'Research-grade GHK-Cu copper peptide injection for tissue repair and longevity studies.',
    benefits: ['Tissue repair research', 'Collagen expression studies', 'High-purity peptide', 'For research use only'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption. Not intended to diagnose, treat, cure, or prevent any disease.',
  }),
  mk('BPC-157 / TB-500 Injection', 'research', 'injections', ['recovery', 'longevity'], 169.99, {
    tagline: 'Recovery peptide blend', shortDescription: 'Research-grade BPC-157 and TB-500 blend injection for tissue repair and recovery studies.',
    benefits: ['Tissue repair research', 'Recovery studies', 'Dual peptide blend', 'For research use only'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),
  mk('BPC-157 / TB-500 Capsules', 'research', 'capsules', ['recovery', 'longevity'], 99.99, {
    tagline: 'Oral recovery peptide blend', shortDescription: 'Research-grade BPC-157 and TB-500 in capsule form for laboratory research.',
    benefits: ['Oral delivery research', 'Recovery studies', 'Dual peptide blend', 'For research use only'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),
  mk('Tesamorelin / Ipamorelin Injection', 'research', 'injections', ['longevity', 'performance'], 159.99, {
    tagline: 'GHRH/GHRP blend', shortDescription: 'Research-grade tesamorelin and ipamorelin blend for growth hormone studies.',
    benefits: ['GH pathway research', 'Dual peptide blend', 'For research use only', 'High purity'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),
  mk('Tesamorelin / KPV Injection', 'research', 'injections', ['longevity', 'recovery'], 211, {
    tagline: 'GHRH + KPV blend', shortDescription: 'Research-grade tesamorelin and KPV blend for growth hormone and inflammation studies.',
    benefits: ['GH pathway research', 'Inflammation studies', 'Dual peptide blend', 'For research use only'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),
  mk('MOTS-c Injection', 'research', 'injections', ['longevity', 'weight-management'], 119.99, {
    tagline: 'Mitochondrial peptide', shortDescription: 'Research-grade MOTS-c injection for mitochondrial function and metabolic research.',
    benefits: ['Mitochondrial research', 'Metabolic studies', 'For research use only', 'High purity'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),
  mk('Thymosin Alpha-1 Injection', 'research', 'injections', ['longevity', 'daily-wellness'], 269.99, {
    tagline: 'Immune peptide research', shortDescription: 'Research-grade thymosin alpha-1 injection for immune function research.',
    benefits: ['Immune research', 'For research use only', 'High purity', 'Reagent-grade'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),

  // ===== RESEARCH CATALOG: NASAL SPRAYS =====
  mk('Semax Nasal Spray', 'research', 'nasal-spray', ['focus', 'longevity'], 219.99, {
    tagline: 'Cognitive peptide research', shortDescription: 'Research-grade semax nasal spray for cognitive function and neuroprotection studies.',
    benefits: ['Cognitive research', 'Neuroprotection studies', 'Nasal delivery', 'For research use only'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),
  mk('Selank Nasal Spray', 'research', 'nasal-spray', ['focus'], 219.99, {
    tagline: 'Anxiolytic peptide research', shortDescription: 'Research-grade selank nasal spray for anxiety and cognitive studies.',
    benefits: ['Anxiety research', 'Cognitive studies', 'Nasal delivery', 'For research use only'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),
  mk('PT-141 Nasal Spray', 'research', 'nasal-spray', ['daily-wellness'], 254, {
    tagline: 'Nasal peptide research', shortDescription: 'Research-grade PT-141 nasal spray for reproductive wellness studies.',
    benefits: ['Reproductive wellness research', 'Nasal delivery', 'For research use only', 'High purity'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),

  // ===== RESEARCH CATALOG: CAPSULES =====
  mk('Dihexa Capsules', 'research', 'capsules', ['focus', 'longevity'], 289.99, {
    tagline: 'Cognitive peptide research', shortDescription: 'Research-grade dihexa capsules for cognitive enhancement and neurogenesis studies.',
    benefits: ['Cognitive research', 'Neurogenesis studies', 'Oral delivery', 'For research use only'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),

  // ===== RESEARCH CATALOG: OTHER =====
  mk('Methylene Blue', 'research', 'other', ['longevity', 'focus'], 186, {
    tagline: 'Mitochondrial research reagent', shortDescription: 'Research-grade methylene blue for mitochondrial function and cellular energy studies.',
    benefits: ['Mitochondrial research', 'Cellular energy studies', 'For research use only', 'Reagent-grade'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),
  mk('KLOW/GLOW Injection', 'research', 'injections', ['beauty', 'longevity'], 149.99, {
    tagline: 'Beauty peptide research', shortDescription: 'Research-grade KLOW/GLOW injection for skin and beauty peptide studies.',
    benefits: ['Skin research', 'Beauty peptide studies', 'For research use only', 'High purity'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),
  mk('PT-141 Injection', 'research', 'injections', ['daily-wellness'], 139.99, {
    tagline: 'Reproductive peptide research', shortDescription: 'Research-grade PT-141 injection for reproductive wellness studies.',
    benefits: ['Reproductive wellness research', 'For research use only', 'High purity', 'Reagent-grade'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),
  mk('Oxytocin', 'research', 'other', ['daily-wellness'], 254, {
    tagline: 'Bonding peptide research', shortDescription: 'Research-grade oxytocin for social bonding and wellness studies.',
    benefits: ['Bonding research', 'Wellness studies', 'For research use only', 'Reagent-grade'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),
  mk('Tadalafil', 'research', 'other', ['performance', 'daily-wellness'], 39.99, {
    tagline: 'Circulation research reagent', shortDescription: 'Research-grade tadalafil for circulatory and vascular function studies.',
    benefits: ['Circulation research', 'Vascular studies', 'For research use only', 'Reagent-grade'], startingAt: true,
    disclosures: 'Sold for research/laboratory use only. Not for human consumption.',
  }),

  // ===== ACCESSORIES =====
  mk('Complete Injection Starter Kit', 'accessories', 'bundles', ['daily-wellness'], 119, {
    tagline: 'Everything you need, beautifully bundled',
    shortDescription: 'The ultimate starter kit: 3D printed peptide case, temperature-controlled travel case, discreet travel bag, reusable ice pack, wellness planner, sharps container, alcohol prep wipes, and insulin syringes — all in one. Save $71 versus buying each item separately.',
    benefits: [
      'Premium 3D Printed Peptide Case included',
      'Temperature-Controlled Travel Case included',
      'Discreet Travel Bag included',
      'Reusable Ice Pack included',
      'Daily & Weekly Wellness Planner included',
      'Sharps Container included',
      'Alcohol Prep Wipes (100 Count) included',
      'Premium Insulin Syringes (10 Pack) included',
    ],
    ingredients: 'Bundle includes: 1× Premium 3D Printed Peptide Case, 1× Temperature-Controlled Travel Case, 1× Discreet Travel Bag, 1× Reusable Ice Pack, 1× Daily & Weekly Wellness Planner, 1× Sharps Container, 1× Alcohol Prep Wipes (100 Count), 1× Premium Insulin Syringes (10 Pack).',
    directions: 'Use all items as directed. Single-use supplies should be disposed of in the included sharps container after use.', bestSeller: true, alaCarte: true, featured: true,
    bundleItems: [
      'Premium 3D Printed Peptide Case',
      'Temperature-Controlled Travel Case',
      'Discreet Travel Bag',
      'Reusable Ice Pack',
      'Daily & Weekly Wellness Planner',
      'Sharps Container',
      'Alcohol Prep Wipes (100 Count)',
      'Premium Insulin Syringes (10 Pack)',
    ],
    bundleRegularPrice: 190,
  }),
  mk('Premium 3D Printed Peptide Case', 'accessories', 'cases', ['daily-wellness'], 34, {
    tagline: 'Precision protection, custom-printed',
    shortDescription: 'A custom 3D-printed case with precision-cut compartments designed to hold your peptide vials, syringes, and supplies securely.',
    benefits: ['Custom 3D-printed precision fit', 'Lightweight and durable', 'Modular compartments', 'Compact and travel-friendly'],
    ingredients: '3D-printed PLA shell with modular internal compartments.',
    directions: 'Store vials and supplies in designated compartments. Keep away from extreme heat.', bestSeller: true, alaCarte: true,
  }),
  mk('Temperature-Controlled Travel Case', 'accessories', 'cases', ['daily-wellness'], 59, {
    tagline: 'Keep your therapy cold, anywhere',
    shortDescription: 'An insulated travel case with a built-in thermal lining that maintains temperature for up to 48 hours — perfect for transporting peptide vials.',
    benefits: ['Maintains temperature up to 48 hours', 'Insulated thermal lining', 'Compact and portable', 'Fits vials + ice pack'],
    ingredients: 'Insulated thermal-lined case with reinforced exterior.',
    directions: 'Place ice pack inside before travel. Store vials in the insulated compartment. Replace ice pack as needed.', bestSeller: true, alaCarte: true,
  }),
  mk('Discreet Travel Bag', 'accessories', 'cases', ['daily-wellness'], 39, {
    tagline: 'Carry your routine anywhere',
    shortDescription: 'A sleek, vegan-leather travel bag with water-resistant lining — designed to hold your entire therapy kit discreetly.',
    benefits: ['Water-resistant interior', 'Discreet design', 'Gold-tone hardware', 'Spacious main compartment'],
    ingredients: 'Vegan leather exterior, water-resistant lined interior.',
    directions: 'Store syringes, vials, and supplies securely. Wipe clean with a damp cloth.', bestSeller: true, alaCarte: true,
  }),
  mk('Reusable Ice Pack', 'accessories', 'supplies', ['daily-wellness'], 12, {
    tagline: 'Stay cool on the go',
    shortDescription: 'A reusable gel ice pack designed to keep your peptide vials cold during transport. Non-toxic and long-lasting.',
    benefits: ['Non-toxic gel formula', 'Stays cold up to 8 hours', 'Reusable and durable', 'Fits all travel cases'],
    ingredients: 'Non-toxic gel ice pack, BPA-free exterior.',
    directions: 'Freeze for at least 4 hours before use. Place inside travel case alongside vials. Reusable — refreeze after each use.', alaCarte: true,
  }),
  mk('Daily & Weekly Wellness Planner', 'accessories', 'supplies', ['daily-wellness'], 29, {
    tagline: 'Track your consistency',
    shortDescription: 'A daily/weekly planner with habit trackers, wellness goals, and progress reflection sections — designed around your therapy routine.',
    benefits: ['Daily + weekly planning pages', 'Habit trackers', 'Wellness goal setting', 'Progress reflection'],
    ingredients: 'Premium wire-bound notebook, 120 pages.',
    directions: 'Use daily to log injections, symptoms, energy levels, and goals.', alaCarte: true,
  }),
  mk('Sharps Container', 'accessories', 'supplies', ['daily-wellness'], 10, {
    tagline: 'Safe disposal, done right',
    shortDescription: 'A FDA-cleared sharps container for the safe disposal of used syringes and needles. Secure, puncture-resistant, and easy to use.',
    benefits: ['FDA-cleared design', 'Puncture-resistant', 'Secure locking lid', 'Compact countertop size'],
    ingredients: 'Puncture-resistant polypropylene container with locking lid.',
    directions: 'Dispose of used syringes and needles through the opening. Do not overfill. Seal and dispose of according to local regulations when full.', alaCarte: true,
  }),
  mk('Alcohol Prep Wipes (100 Count)', 'accessories', 'supplies', ['daily-wellness'], 9, {
    tagline: 'Sterile prep made simple',
    shortDescription: 'Individually wrapped 70% isopropyl alcohol prep pads for safe injection site preparation. 100-count box.',
    benefits: ['70% isopropyl alcohol', 'Individually wrapped', 'Sterile and single-use', 'For external use only'],
    ingredients: 'Box of 100 individually wrapped alcohol prep pads, 70% isopropyl alcohol.',
    directions: 'Swab injection site and allow to dry before injecting. For external use only.', alaCarte: true,
  }),
  mk('Alcohol Prep Wipes (200 Count)', 'accessories', 'supplies', ['daily-wellness'], 15, {
    tagline: 'Stock up and save',
    shortDescription: 'Individually wrapped 70% isopropyl alcohol prep pads for safe injection site preparation. 200-count box — better value.',
    benefits: ['70% isopropyl alcohol', 'Individually wrapped', 'Sterile and single-use', 'Best value per wipe'],
    ingredients: 'Box of 200 individually wrapped alcohol prep pads, 70% isopropyl alcohol.',
    directions: 'Swab injection site and allow to dry before injecting. For external use only.', alaCarte: true,
  }),
  mk('Premium Insulin Syringes (10 Pack)', 'accessories', 'supplies', ['daily-wellness'], 12, {
    tagline: 'Precision injection supplies',
    shortDescription: 'Sterile insulin syringes for subcutaneous injections. 10-pack — perfect for getting started.',
    benefits: ['Sterile and single-use', 'Fine-gauge 30G comfort', 'Clear unit markings', 'Convenient starter pack'],
    ingredients: 'Pack of 10 sterile insulin syringes (30G, 0.5mL, 1/2" needle).',
    directions: 'Use as directed by your provider for subcutaneous injection. Dispose of properly after single use.', alaCarte: true,
  }),
  mk('Premium Insulin Syringes (50 Pack)', 'accessories', 'supplies', ['daily-wellness'], 39, {
    tagline: 'Better value, same quality',
    shortDescription: 'Sterile insulin syringes for subcutaneous injections. 50-pack — save more per syringe.',
    benefits: ['Sterile and single-use', 'Fine-gauge 30G comfort', 'Clear unit markings', 'Best value per syringe'],
    ingredients: 'Pack of 50 sterile insulin syringes (30G, 0.5mL, 1/2" needle).',
    directions: 'Use as directed by your provider for subcutaneous injection. Dispose of properly after single use.', alaCarte: true,
  }),
  mk('Premium Insulin Syringes (100 Pack)', 'accessories', 'supplies', ['daily-wellness'], 69, {
    tagline: 'Maximum savings, maximum convenience',
    shortDescription: 'Sterile insulin syringes for subcutaneous injections. 100-pack — the best value for long-term therapy.',
    benefits: ['Sterile and single-use', 'Fine-gauge 30G comfort', 'Clear unit markings', 'Lowest price per syringe'],
    ingredients: 'Pack of 100 sterile insulin syringes (30G, 0.5mL, 1/2" needle).',
    directions: 'Use as directed by your provider for subcutaneous injection. Dispose of properly after single use.', alaCarte: true,
  }),
];

// ===== WELLNESS CONCERNS (Shop by Concern) =====
export type ConcernId =
  | 'weight-management'
  | 'longevity-aging'
  | 'hormone-balance'
  | 'energy-vitality'
  | 'cognitive-support'
  | 'recovery-performance'
  | 'immune-support'
  | 'metabolic-health'
  | 'sexual-wellness'
  | 'hair-skin-beauty'
  | 'sleep-stress';

export interface Concern {
  id: ConcernId;
  label: string;
  description: string;
  image: string;
  tagline: string;
}

export const concerns: Concern[] = [
  { id: 'weight-management', label: 'Weight Management', tagline: 'Sustainable, feel-good progress', description: 'GLP-1 and dual incretin therapies to support appetite regulation and metabolic balance.', image: 'https://images.pexels.com/photos/8846593/pexels-photo-8846593.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'longevity-aging', label: 'Longevity & Healthy Aging', tagline: 'Cellular health, gracefully', description: 'NAD+, glutathione, and growth hormone support for cellular energy and healthy aging.', image: 'https://images.pexels.com/photos/8939921/pexels-photo-8939921.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'hormone-balance', label: 'Hormone Balance (HRT for Women)', tagline: 'Hormone balance, personal', description: 'Estrogen, progesterone, testosterone, and combination hormone therapies.', image: 'https://images.pexels.com/photos/8551982/pexels-photo-8551982.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'energy-vitality', label: 'Energy & Vitality', tagline: 'Feel vibrant every day', description: 'B12, NAD+, and metabolic support to fuel your daily energy and vitality.', image: 'https://images.pexels.com/photos/1435822/pexels-photo-1435822.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'cognitive-support', label: 'Cognitive Support', tagline: 'Clarity for a busy mind', description: 'Research peptides and cognitive support products for focus and neuroprotection.', image: 'https://images.pexels.com/photos/4968357/pexels-photo-4968357.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'recovery-performance', label: 'Recovery & Performance', tagline: 'Repair, rebuild, perform', description: 'Peptides and growth hormone support for tissue repair, recovery, and performance.', image: 'https://images.pexels.com/photos/4970983/pexels-photo-4970983.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'immune-support', label: 'Immune Support', tagline: 'Foundational resilience', description: 'Glutathione, thymosin, and wellness products to support immune function.', image: 'https://images.pexels.com/photos/9263511/pexels-photo-9263511.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'metabolic-health', label: 'Metabolic Health', tagline: 'Balance from within', description: 'GLP-1, MOTS-c, and metabolic support products for healthy metabolic function.', image: 'https://images.pexels.com/photos/8846593/pexels-photo-8846593.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'sexual-wellness', label: 'Sexual Wellness', tagline: 'Intimacy, restored', description: 'Testosterone therapy, PT-141, and oxytocin for sexual health and wellness.', image: 'https://images.pexels.com/photos/10792946/pexels-photo-10792946.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'hair-skin-beauty', label: 'Hair, Skin & Beauty', tagline: 'Glow from within', description: 'Glutathione, GHK-Cu, and beauty peptides for skin, hair, and radiance.', image: 'https://images.pexels.com/photos/6417964/pexels-photo-6417964.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'sleep-stress', label: 'Sleep & Stress Support', tagline: 'Rest, restore, rebalance', description: 'Glycine, sermorelin, and progesterone for restful sleep and stress support.', image: 'https://images.pexels.com/photos/3795277/pexels-photo-3795277.jpeg?auto=compress&cs=tinysrgb&w=900' },
];

const concernToGoalsMap: Record<ConcernId, Goal[]> = {
  'weight-management': ['weight-management'],
  'longevity-aging': ['longevity'],
  'hormone-balance': ['hrt-women'],
  'energy-vitality': ['longevity', 'daily-wellness'],
  'cognitive-support': ['focus'],
  'recovery-performance': ['recovery', 'performance'],
  'immune-support': ['daily-wellness', 'longevity'],
  'metabolic-health': ['weight-management', 'longevity'],
  'sexual-wellness': ['daily-wellness', 'hrt-women'],
  'hair-skin-beauty': ['beauty', 'longevity'],
  'sleep-stress': ['recovery', 'hrt-women'],
};

const concernToSectionsMap: Record<ConcernId, ProductSection[]> = {
  'weight-management': ['weight-management', 'provider-care'],
  'longevity-aging': ['longevity', 'research', 'provider-care'],
  'hormone-balance': ['hrt-women', 'provider-care'],
  'energy-vitality': ['longevity', 'provider-care'],
  'cognitive-support': ['research', 'longevity'],
  'recovery-performance': ['research', 'longevity'],
  'immune-support': ['research', 'longevity'],
  'metabolic-health': ['weight-management', 'research', 'longevity'],
  'sexual-wellness': ['hrt-women', 'research'],
  'hair-skin-beauty': ['research', 'longevity'],
  'sleep-stress': ['hrt-women', 'longevity', 'research'],
};

export const getProductsByConcern = (concernId: ConcernId): Product[] => {
  const goals = concernToGoalsMap[concernId] || [];
  const sectionIds = concernToSectionsMap[concernId] || [];
  const seen = new Set<string>();
  const result: Product[] = [];
  for (const p of products) {
    if (seen.has(p.id)) continue;
    if (p.goals.some(g => goals.includes(g)) || sectionIds.includes(p.section)) {
      seen.add(p.id);
      result.push(p);
    }
  }
  return result;
};

export const getMembershipsForConcern = (concernId: ConcernId): Membership[] => {
  if (concernId === 'weight-management' || concernId === 'metabolic-health') return memberships;
  return [];
};

export const getAccessoriesForConcern = (): Product[] =>
  products.filter(p => p.section === 'accessories' && !p.featured).slice(0, 4);

export const getConcern = (id: string) => concerns.find(c => c.id === id as ConcernId);

// Goals for "Shop by Goal" navigation
export const goals: { id: Goal; label: string; description: string; image: string }[] = [
  { id: 'weight-management', label: 'Weight Management', description: 'GLP-1 and dual incretin therapies for sustainable, feel-good progress.', image: 'https://images.pexels.com/photos/8846593/pexels-photo-8846593.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'longevity', label: 'Longevity', description: 'NAD+, B12, glutathione, and growth hormone support for cellular health.', image: 'https://images.pexels.com/photos/8939921/pexels-photo-8939921.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'hrt-women', label: 'HRT for Women', description: 'Estrogen, progesterone, testosterone, and combination hormone therapies.', image: 'https://images.pexels.com/photos/8551982/pexels-photo-8551982.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'performance', label: 'Performance', description: 'Strength, stamina, and recovery optimization for every level.', image: 'https://images.pexels.com/photos/2787846/pexels-photo-2787846.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'recovery', label: 'Recovery', description: 'Muscle repair, restorative rest, and inflammation support.', image: 'https://images.pexels.com/photos/4970983/pexels-photo-4970983.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'focus', label: 'Focus', description: 'Cognitive clarity and calm for a busy mind.', image: 'https://images.pexels.com/photos/4968357/pexels-photo-4968357.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'beauty', label: 'Beauty', description: 'Skin, hair, and glow from within — at every age.', image: 'https://images.pexels.com/photos/6417964/pexels-photo-6417964.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'daily-wellness', label: 'Daily Wellness', description: 'Foundational nutrition and hydration for everyday living.', image: 'https://images.pexels.com/photos/3795277/pexels-photo-3795277.jpeg?auto=compress&cs=tinysrgb&w=900' },
];

export const getProduct = (slug: string) => products.find(p => p.slug === slug);
export const getSectionMeta = (id: ProductSection) => sections.find(s => s.id === id);
export const getProductsBySection = (section: ProductSection) => products.filter(p => p.section === section);
export const getProductsBySubcategory = (section: ProductSection, subcategory: string) =>
  products.filter(p => p.section === section && p.subcategory === subcategory);
export const getProductsByGoal = (goal: Goal) => products.filter(p => p.goals.includes(goal));
export const getBestSellers = () => products.filter(p => p.bestSeller);
export const getFeaturedBundle = () => products.find(p => p.featured);
export const getBundleItems = (product: Product) =>
  product.bundleItems ? product.bundleItems.map(name => products.find(p => p.name === name)).filter(Boolean) as Product[] : [];
export const getFrequentlyBoughtTogether = (product: Product, limit = 3) => {
  const bundle = getFeaturedBundle();
  if (product.featured) {
    return products.filter(p => p.section === 'accessories' && p.id !== product.id && !p.featured).slice(0, limit);
  }
  const fbt = products.filter(p => p.section === 'accessories' && p.id !== product.id && p.id !== bundle?.id);
  return fbt.slice(0, limit);
};
export const getRelatedProducts = (product: Product, limit = 4) =>
  products.filter(p => p.id !== product.id && (p.goals.some(g => product.goals.includes(g)) || p.section === product.section)).slice(0, limit);
