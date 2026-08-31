/**
 * My Bare Method customer-facing product copy.
 * Presentation style inspired by premium telehealth retail UX (benefit-forward, scannable).
 * Wording is original. Claims stay claims-safe — especially for emerging peptide/NAD+ products.
 */

export interface ProductCopy {
  /** Short benefit headline under the product name (~one line). */
  benefitHeadline: string;
  /** Hero description — ~40–70 words, 2–3 sentences. */
  shortDescription: string;
  /** 3–5 ultra-short highlight chips. */
  highlights: string[];
  /** About This Product — ~80–150 words. */
  about: string;
  /** Potential Benefits — 4–6 benefit-forward, claims-safe bullets. */
  potentialBenefits: string[];
  /** How It Works — ~75–150 words, plain-language science. */
  howItWorks: string;
  /** Why People Choose It — 3–5 bullets. */
  whyPeopleChooseIt: string[];
  /** What to Expect — ~60–120 words. */
  whatToExpect: string;
  importantInformation?: string;
  reviewFlags?: string[];
  regulatoryNotes?: string[];
}

export interface MembershipCopy {
  benefitHeadline: string;
  shortDescription: string;
  highlights: string[];
  about: string;
  potentialBenefits: string[];
  howItWorks: string;
  whyPeopleChooseIt: string[];
  whatToExpect: string;
  importantInformation?: string;
  benefits?: string[];
  reviewFlags?: string[];
  regulatoryNotes?: string[];
}

const DEFAULT_RX_IMPORTANT =
  'Availability is subject to provider review. Your provider will determine whether this option is appropriate for you and may recommend a different treatment, dose, testing, or follow-up based on your health history and individual needs. Completing payment does not guarantee a prescription.';

const DEFAULT_COMPOUNDED_IMPORTANT =
  `${DEFAULT_RX_IMPORTANT} This is a provider-directed compounded option. Exact formulation and availability are determined by the prescribing provider and dispensing pharmacy.`;

const RESEARCH_FLAG =
  'Emerging / research-oriented peptide wellness interest — keep proposed benefits clearly separated from established clinical outcomes; medical director should confirm public framing.';

export const PRODUCT_COPY: Record<string, ProductCopy> = {
  // ===== WEIGHT MANAGEMENT =====
  semaglutide: {
    benefitHeadline: 'GLP-1 Appetite & Metabolic Support for Provider-Guided Weight Management',
    shortDescription:
      'Semaglutide is a GLP-1 receptor agonist used in provider-directed weight-management care. It may help regulate appetite, promote feelings of fullness, and support blood-sugar management as part of a structured plan. Choose the low-dose, high-dose, or monthly option shown on this page; your provider confirms the appropriate treatment after clinical review.',
    highlights: [
      'GLP-1 Receptor Agonist',
      'Appetite & Fullness Support',
      'Blood-Sugar Regulation',
      'Provider-Guided Care',
      'Low, High & Monthly Options',
    ],
    about: [
      'Semaglutide is a GLP-1 medication option used in provider-directed weight-management care. On My Bare Method, the storefront presents low-dose, high-dose, and monthly prescription options linked to the corresponding GEN Health product pages.',
      'Your provider determines the appropriate treatment after review. A selected program option starts the conversation; it does not override clinical judgment.',
      'Treatment is personalized. Ordering begins a clinical review — it does not automatically mean a prescription will be issued.',
    ].join('\n\n'),
    potentialBenefits: [
      'May help you feel full sooner during meals by activating GLP-1 receptors that signal satiety to the brain',
      'May support staying satisfied longer between meals by slowing gastric emptying',
      'May help reduce overall food intake and support progressive weight loss as part of a supervised plan',
      'May assist with blood-sugar regulation and improved insulin sensitivity under clinical monitoring',
      'Supports a structured, provider-guided approach to weight management with clearly labeled dose options',
    ],
    howItWorks:
      'Semaglutide is a GLP-1 receptor agonist that mimics a naturally occurring hormone involved in appetite and blood-sugar regulation. By activating GLP-1 receptors in the brain and gut, it helps your body register fullness, slows stomach emptying, and supports glucose management after eating. Many people notice they are less driven to overeat and can stick with smaller portions more comfortably. Individual responses vary. Your provider decides whether this approach fits your health history and how to advance treatment over time.',
    whyPeopleChooseIt: [
      'Clear injectable format with labeled strength options on this page',
      'Choose the program option that best matches the care conversation you want to start',
      'Fits customers who want medication support alongside lifestyle changes',
      'Available as a one-time purchase or eligible prescription subscription',
    ],
    whatToExpect:
      'Choose a low-dose, high-dose, or monthly option, then complete medical intake after checkout. A licensed provider reviews your information and determines eligibility, dose, and follow-up. Use only as directed if approved. Do not change your dose on your own.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'No guaranteed weight-loss amount.',
      'Do not claim FDA approval for this specific compounded Semaglutide listing.',
    ],
  },

  tirzepatide: {
    benefitHeadline: 'Dual GLP-1/GIP Pathway Support for Provider-Guided Metabolic Goals',
    shortDescription:
      'Tirzepatide is a dual GLP-1 and GIP receptor agonist used in provider-directed weight-management care. By engaging two metabolic pathways, it may provide stronger appetite suppression, improved insulin sensitivity, and enhanced blood-sugar regulation. Choose the low-dose, high-dose, or monthly option shown on this page; your provider confirms the appropriate treatment after clinical review.',
    highlights: [
      'Dual GLP-1 + GIP Agonist',
      'Enhanced Appetite Control',
      'Insulin Sensitivity Support',
      'Provider-Guided Care',
      'Low, High & Monthly Options',
    ],
    about: [
      'Tirzepatide acts on GLP-1 and GIP pathways involved in appetite, fullness, and blood-sugar regulation. That dual-pathway design is what sets it apart from semaglutide alone — not a promise that it is automatically “better” for everyone.',
      'Choose a low-dose, high-dose, or monthly prescription option. Your provider determines the appropriate treatment after review.',
      'A licensed provider reviews whether Tirzepatide, Semaglutide, or another plan is the right fit for you.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support stronger feelings of fullness after meals by activating both GLP-1 and GIP receptors simultaneously',
      'May help reduce interest in large portions and quiet “food noise” as part of a supervised plan',
      'Engages two metabolic pathways (GLP-1 and GIP) for potentially enhanced appetite and glucose regulation',
      'May support improved insulin sensitivity and blood-sugar management under clinical monitoring',
      'Offers clearly labeled program options for individualized clinical matching',
    ],
    howItWorks:
      'Tirzepatide works with receptors tied to appetite and blood-sugar regulation — commonly described as GLP-1 and GIP pathways. Together, those signals can influence how quickly you feel satisfied and how your body manages metabolic cues after eating. Many people experience a quieter “food noise” and an easier time with portion control, though results vary. Your provider sets expectations and adjusts treatment based on your response and safety profile.',
    whyPeopleChooseIt: [
      'Distinct from Semaglutide — dual-pathway option when clinically appropriate',
      'Low-dose, high-dose, and monthly options listed clearly for transparent shopping and clinical matching',
      'Designed for customers ready for structured, provider-guided weight-management care',
      'Eligible prescription subscription available with 15% medication savings',
    ],
    whatToExpect:
      'Select a low-dose, high-dose, or monthly option, complete intake after order, and wait for licensed-provider review. Exact dose, schedule, and follow-up are clinical decisions. Storefront selection informs the conversation — it does not override medical judgment.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Distinguish clearly from Semaglutide; not interchangeable.',
      'No guaranteed weight-loss amount.',
    ],
  },

  'fat-burner': {
    benefitHeadline: 'Three-Peptide Metabolic & Body-Composition Support',
    shortDescription:
      'Fat Burner is a provider-directed compounded three-peptide injection blend potentially used to support fat metabolism, lean body composition, and metabolic wellness goals. Your licensed clinician decides whether it belongs in your plan after reviewing your history and goals.',
    highlights: [
      'Three-Peptide Blend',
      'Fat Metabolism Support',
      'Body-Composition Focus',
      'Compounded Injection',
      'Provider-Guided Care',
    ],
    about: [
      'This is a provider-directed compounded peptide option. Exact formulation details are determined by the prescribing provider and dispensing pharmacy.',
      'Providers may consider it when discussing supervised body-composition or metabolic wellness goals. Results vary, and no fat-loss or metabolic outcome is guaranteed.',
      'A licensed provider reviews your history and goals before anything is dispensed.',
    ].join('\n\n'),
    potentialBenefits: [
      'May be considered in provider-guided body-composition programs to support fat oxidation and metabolic rate',
      'Three-peptide compounded blend designed for lipotropic and metabolic wellness support',
      'May help preserve lean muscle mass during weight-management programs under clinical supervision',
      'Keeps pharmacy-level formulation details within the clinical review process for individualized care',
      'Supports an individualized plan — responses vary and are not guaranteed',
    ],
    howItWorks:
      'This compounded peptide option may be discussed in metabolic and body-composition wellness settings. It is not an FDA-approved weight-loss drug and does not guarantee clinical fat-loss outcomes. Your provider explains whether it may be appropriate and how it should be used if approved.',
    whyPeopleChooseIt: [
      'Want a provider-guided peptide option under clinical review',
      'Prefer provider-guided body-composition care over unsupervised supplement shopping',
      'Prefer a simple product choice without pharmacy-level formulation details',
      'Value realistic expectations with licensed-provider oversight',
    ],
    whatToExpect:
      'After checkout you complete intake. A licensed provider determines eligibility, the final formulation, and instructions. Use only as directed if approved. Do not combine with other peptide products unless your clinician specifically directs you to.',
    importantInformation: [
      DEFAULT_COMPOUNDED_IMPORTANT,
      'This compounded blend is not FDA-approved as a weight-loss or fat-loss drug. The name “Fat Burner” does not guarantee fat burning, abdominal fat reduction, weight loss, metabolic improvement, or muscle gain.',
      'This is not an oral “Fat Burner +” capsule product and does not include SLU-PP-332.',
    ].join(' '),
    reviewFlags: [
      'MEDICAL DIRECTOR REVIEW REQUIRED = YES — confirm public nickname “Fat Burner” + three-peptide framing remains acceptable.',
    ],
    regulatoryNotes: [
      'Do not imply the blend is FDA-approved.',
      'Do not claim clinically proven weight loss, fat burning, or metabolic improvement.',
      'Not SLU-PP-332 / Fat Burner+ capsules.',
    ],
  },

  'aod-9604': {
    benefitHeadline: 'AOD-9604 Lipotropic Peptide for Body-Composition Support',
    shortDescription:
      'AOD-9604 is a provider-directed compounded lipotropic peptide fragment potentially used to support fat metabolism, body-composition goals, and metabolic wellness. Availability, formulation, and instructions are determined after intake and licensed-provider review.',
    highlights: [
      'Lipotropic Peptide Fragment',
      'Fat Metabolism Support',
      'Body-Composition Focus',
      'Compounded Injection',
      'Provider-Directed Care',
    ],
    about: [
      'This option is offered through a provider-directed clinical pathway. My Bare Method keeps pharmacy-level formulation details within the clinical workflow so your provider and dispensing pharmacy can determine what is appropriate for you.',
      'This listing is for a supervised clinical conversation, not a promise of weight loss, fat loss, or any particular outcome.',
    ].join('\\n\\n'),
    potentialBenefits: [
      'May be considered in a provider-guided metabolic wellness plan to support lipolysis and fat oxidation',
      'AOD-9604 is a peptide fragment studied for potential effects on fat metabolism and body composition',
      'Offers an injectable format for individualized clinical discussion of body-composition goals',
      'Keeps formulation and treatment decisions with the provider and pharmacy for personalized care',
      'Supports realistic expectations and follow-up care under clinical supervision',
    ],
    howItWorks:
      'This option is discussed in provider-directed metabolic wellness settings. Exact strength, formulation, schedule, and instructions are determined after clinical review. Individual responses vary, and this page does not guarantee a specific metabolic or body-composition result.',
    whyPeopleChooseIt: [
      'Want a provider-guided metabolic peptide option',
      'Prefer an injectable format under clinical oversight',
      'Value a simple storefront choice with details finalized after intake',
    ],
    whatToExpect:
      'Complete intake after checkout. A licensed provider determines whether this option is appropriate and provides the final clinical instructions if approved.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    regulatoryNotes: [
      'No guaranteed weight-loss, fat-loss, or body-composition outcomes.',
      'Do not imply FDA approval of this specific compounded product.',
    ],
  },

  'metabolic-triple': {
    benefitHeadline: 'Three-Component Metabolic Protocol for Body-Composition Support',
    shortDescription:
      'Metabolic Triple is a provider-directed compounded three-component metabolic injection protocol potentially used to support metabolic function, fat oxidation, and body-composition goals. Your provider and dispensing pharmacy determine the final formulation and treatment instructions.',
    highlights: [
      'Three-Component Protocol',
      'Metabolic Function Support',
      'Fat Oxidation Focus',
      'Compounded Injection',
      'Clinical Review Required',
    ],
    about: [
      'Metabolic Triple Protocol is a provider-directed compounded option for customers exploring structured metabolic and body-composition care.',
      'The storefront intentionally does not publish pharmacy-level formulation details. Those details, along with eligibility and instructions, are finalized by the prescribing provider and dispensing pharmacy.',
    ].join('\\n\\n'),
    potentialBenefits: [
      'May be considered as part of a supervised metabolic wellness plan to support metabolic rate and fat oxidation',
      'Three-component coordinated protocol designed for comprehensive metabolic and body-composition support',
      'May help support lean body composition and energy metabolism under clinical supervision',
      'Keeps formulation decisions within the clinical review process for individualized care',
      'Supports individualized follow-up rather than one-size-fits-all use',
    ],
    howItWorks:
      'This protocol is reviewed as part of a provider-directed care plan. The provider determines whether it fits your history and goals, while the dispensing pharmacy confirms the final preparation and use instructions.',
    whyPeopleChooseIt: [
      'Prefer a coordinated metabolic protocol',
      'Want provider oversight from intake through fulfillment',
      'Value clear pricing with clinical details finalized after review',
    ],
    whatToExpect:
      'Complete intake after checkout and wait for licensed-provider review. Approval, formulation, and instructions are not guaranteed by purchase.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    regulatoryNotes: [
      'No guaranteed weight-loss or metabolic outcomes.',
      'Do not expose unverified formulation or concentration details.',
    ],
  },

  'bpc-157': {
    benefitHeadline: 'BPC-157 Tissue Recovery & Gut-Health Peptide Support',
    shortDescription:
      'BPC-157 is a provider-directed compounded peptide injection potentially used to support musculoskeletal recovery, tendon and ligament comfort, gastrointestinal healing, and connective-tissue wellness. Eligibility, formulation, and instructions are determined after licensed-provider review.',
    highlights: [
      'Musculoskeletal Recovery Support',
      'Tendon & Ligament Comfort',
      'Gut-Healing Potential',
      'Compounded Peptide Injection',
      'Provider Review Required',
    ],
    about: [
      'This option is offered for customers discussing recovery and performance-support goals with a licensed provider.',
      'Research interest should not be confused with an established treatment or guarantee of injury healing, tissue repair, or performance improvement.',
    ].join('\\n\\n'),
    potentialBenefits: [
      'May be discussed in a provider-guided recovery plan for musculoskeletal injury support and joint comfort',
      'Researched for potential effects on tendon, ligament, and connective-tissue healing',
      'May support gastrointestinal mucosal healing and gut-barrier integrity under clinical supervision',
      'Offers an injectable format for individualized clinical review of recovery and performance goals',
      'Supports realistic expectations around developing evidence — no guaranteed healing or tissue-repair outcomes',
    ],
    howItWorks:
      'This option is discussed in research-oriented wellness settings. This page does not claim a proven mechanism or guaranteed recovery outcome. If approved, your provider and pharmacy provide the final preparation and directions.',
    whyPeopleChooseIt: [
      'Want a dedicated recovery-oriented peptide option',
      'Prefer provider oversight before using a compounded product',
      'Value clear distinction between wellness interest and established treatment',
    ],
    whatToExpect:
      'Complete intake after checkout. A licensed provider determines eligibility and provides instructions only if the option is approved for you.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [RESEARCH_FLAG],
    regulatoryNotes: [
      'No guaranteed healing, tissue-repair, or performance outcomes.',
      'Do not imply FDA approval of this specific compounded product.',
    ],
  },

  'ghk-cu-minoxidil': {
    benefitHeadline: 'GHK-Cu + Minoxidil Topical for Hair & Skin Renewal',
    shortDescription:
      'GHK-Cu + Minoxidil is a provider-directed compounded topical combining copper peptide (GHK-Cu) and minoxidil, potentially used to support hair follicle stimulation, scalp health, collagen production, and skin renewal. Your provider and dispensing pharmacy determine the final strength and companion ingredients after review.',
    highlights: [
      'Copper Peptide + Minoxidil',
      'Hair Follicle Stimulation',
      'Collagen & Skin Renewal',
      'Provider-Personalized',
      'Prescription Review Required',
    ],
    about: [
      'This compounded topical option is prepared for customers discussing scalp and skin-care goals with a provider.',
      'The final strength, vehicle, and any companion ingredients are determined by the prescribing provider and dispensing pharmacy. Results vary and are not guaranteed.',
    ].join('\\n\\n'),
    potentialBenefits: [
      'May support hair follicle stimulation and visible hair density improvement through combined copper peptide and minoxidil action',
      'GHK-Cu copper peptide may support collagen production, skin elasticity, and tissue regeneration',
      'Minoxidil may help increase blood flow to scalp tissue and support thinning-hair management',
      'Offers a topical format for an at-home routine combining hair and skin support in one prescription',
      'Keeps exact formulation details within clinical review for personalized care',
    ],
    howItWorks:
      'Topical hair and skin-support options may be discussed in provider-directed care. Your provider determines whether this preparation is appropriate and explains the final ingredients and directions if approved.',
    whyPeopleChooseIt: [
      'Prefer a topical scalp-and-skin option',
      'Want one provider-guided combination instead of separate products',
      'Value a personalized prescription pathway',
    ],
    whatToExpect:
      'Complete intake and wait for provider review. Apply only as directed if approved, and ask your care team for the final ingredient and strength details for your preparation.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    regulatoryNotes: [
      'No guaranteed hair-growth, skin, or scalp outcomes.',
      'Do not invent companion ingredients, strengths, or application schedules.',
    ],
  },

  'ondansetron-odt': {
    benefitHeadline: 'Ondansetron ODT — Nausea & GI Support in an Orally Disintegrating Format',
    shortDescription:
      'Ondansetron ODT is a provider-directed orally disintegrating tablet potentially used to manage nausea, gastrointestinal discomfort, and medication-related side effects during supervised weight-management therapy. Your provider determines whether it is appropriate after intake.',
    highlights: [
      'Anti-Nausea Support',
      'Orally Disintegrating Format',
      'GLP-1 Side-Effect Management',
      'Provider-Reviewed',
    ],
    about: [
      'Nausea Support is an orally disintegrating tablet option that may be discussed when clinically appropriate.',
      'It is not a weight-loss medication and does not guarantee that nausea or other symptoms will improve. Your provider reviews your history, current medications, and goals before deciding whether it belongs in your plan.',
    ].join('\\n\\n'),
    potentialBenefits: [
      'May help manage nausea and vomiting associated with GLP-1 agonist therapy under provider direction',
      'Orally disintegrating format dissolves on the tongue — no need to swallow a conventional tablet during nausea episodes',
      'May support gastrointestinal comfort during supervised weight-management programs',
      'Can be discussed alongside Semaglutide or Tirzepatide therapy for side-effect management',
      'Keeps medication decisions connected to clinical review for safety',
    ],
    howItWorks:
      'The orally disintegrating tablet is designed to dissolve in the mouth. Your provider determines whether ondansetron is appropriate, how it should be used, and whether other causes of symptoms need attention.',
    whyPeopleChooseIt: [
      'Prefer an orally disintegrating format',
      'Want a provider-guided supportive-care option',
      'Value a clear distinction between symptom support and weight-loss treatment',
    ],
    whatToExpect:
      'Complete intake after checkout. Use only as directed if approved, and contact your care team if symptoms are severe, persistent, or concerning.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Do not market Ondansetron ODT as a weight-loss medication.',
      'Do not guarantee nausea relief or any other clinical outcome.',
    ],
  },

  // ===== WOMEN'S HORMONE THERAPY =====
  'estradiol-patch': {
    benefitHeadline: 'Steady Bioidentical Estrogen Support Through a Transdermal Patch',
    shortDescription:
      'The Estradiol Transdermal Patch delivers bioidentical estradiol — a primary form of estrogen — through the skin as part of provider-directed hormone replacement therapy. It may help support menopausal symptom relief, hot flash reduction, bone density, mood stability, and cardiovascular wellness. Many women explore this option when they want steady estrogen support without an oral tablet, personalized after clinical review.',
    highlights: [
      'Bioidentical Estradiol',
      'Transdermal Delivery',
      'Menopause Symptom Relief',
      'Multiple Patch Strengths',
      'Provider-Personalized',
    ],
    about: [
      'Estradiol is a form of estrogen your body already recognizes. A transdermal patch is designed to release hormone across the wear period your provider recommends.',
      'Clinicians may discuss estrogen therapy when evaluating menopause-related changes or other hormone concerns. Whether a patch is right for you depends on your history, goals, and — when needed — labs. Hormone therapy is not one-size-fits-all.',
      'Initial HRT orders require the Required HRT Lab Package ($260 total: Lab Kit $200 with Lab Kit shipping included, plus Lab Review $60). Medication shipping remains separate where applicable.',
    ].join('\n\n'),
    potentialBenefits: [
      'May help relieve hot flashes, night sweats, and vasomotor symptoms associated with menopause',
      'May support bone density maintenance and help reduce osteoporosis risk under clinical monitoring',
      'Transdermal delivery bypasses the liver, which some providers prefer for certain patients',
      'Designed for steady estrogen release across the prescribed wear schedule for consistent hormone levels',
      'Multiple strengths available for individualized matching to your symptom profile',
      'Can be part of a broader hormone plan alongside progesterone when clinically appropriate',
    ],
    howItWorks:
      'The patch places estradiol on the skin so it can be absorbed into circulation. That through-the-skin route bypasses the digestive tract, which is why some providers prefer it for certain patients. Your clinician chooses strength and change schedule based on your symptoms, labs when indicated, and overall plan — including whether progesterone or other therapies should be paired with estrogen.',
    whyPeopleChooseIt: [
      'Convenient patch format instead of daily oral estrogen for many routines',
      'Clear strength options listed on this page',
      'Fits provider-guided women’s hormone therapy workflows',
      'Easy to discuss alongside progesterone or other complementary options',
    ],
    whatToExpect:
      'Select a patch strength and pack size, then complete intake for provider review. Initial HRT orders include the Required HRT Lab Package once when applicable. If approved, apply only as directed — including site rotation and change timing. Do not share patches or adjust strength without guidance.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Hormone therapy is not appropriate for everyone.',
      'No guaranteed “hormone balancing” outcomes.',
    ],
  },

  'progesterone-capsules': {
    benefitHeadline: 'Oral Bioidentical Progesterone for Sleep, Mood & Hormone Balance',
    shortDescription:
      'Progesterone Capsules provide oral bioidentical progesterone for provider-directed hormone replacement therapy. Clinicians often discuss this option to support sleep quality, mood balance, menstrual cycle regulation, and endometrial protection during estrogen therapy — based on your history and goals.',
    highlights: [
      'Bioidentical Progesterone',
      'Sleep & Mood Support',
      'Endometrial Protection',
      'Oral Capsule Convenience',
      'Provider-Directed',
    ],
    about: [
      'Progesterone is a hormone involved in the menstrual cycle and is frequently part of menopause and hormone-therapy conversations. Capsules make dosing straightforward once a clinician has chosen a plan.',
      'Your provider may recommend progesterone for specific clinical reasons. Capsule strength and timing are individualized — never copy someone else’s regimen.',
      'Initial HRT orders require the Required HRT Lab Package ($260 total: Lab Kit $200 with Lab Kit shipping included, plus Lab Review $60). Medication shipping remains separate where applicable.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support sleep quality and help with insomnia related to hormone changes under clinical supervision',
      'May help stabilize mood and reduce anxiety associated with hormonal fluctuations',
      'Provides endometrial protection when paired with estrogen therapy in women with an intact uterus',
      'May support menstrual cycle regulation and progesterone-estrogen balance',
      'Fits into a monitored, provider-guided care pathway with ongoing follow-up',
    ],
    howItWorks:
      'Oral progesterone delivers a measured dose through the digestive system so your provider can support hormone-therapy goals with a form that is simple to take. Timing (for example, evening dosing) may matter for your plan. Effects depend on the prescribed regimen, your biology, and whether other hormones are part of treatment.',
    whyPeopleChooseIt: [
      'Straightforward capsule format for daily routines',
      'Clear 100mg and 200mg options on this page',
      'Common building block in provider-guided women’s hormone plans',
      'Easy to coordinate with estradiol or other therapies when indicated',
    ],
    whatToExpect:
      'Choose a capsule strength, complete intake, and await provider review. Initial HRT orders include the Required HRT Lab Package once when applicable. Take only as directed on your prescription label if approved. Report new or concerning symptoms to your care team promptly.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Distinguish from estradiol and testosterone.',
      'Avoid guaranteed symptom-resolution language.',
    ],
  },

  'testosterone-cream': {
    benefitHeadline: 'Topical Bioidentical Testosterone for Libido, Energy & Sexual Wellness',
    shortDescription:
      'Testosterone Cream is a topical bioidentical testosterone option for provider-directed hormone therapy. Carefully dosed testosterone may be discussed to support libido, energy levels, muscle tone, mood, and sexual wellness as part of certain women\'s hormone plans after a thorough review of goals, history, and — when needed — labs.',
    highlights: [
      'Bioidentical Testosterone',
      'Libido & Energy Support',
      'Topical Application',
      'Personalized Dosing',
      'Provider-Reviewed',
    ],
    about: [
      'Testosterone is a hormone involved in energy, libido, muscle, and other body functions. While it is often associated with men’s health, clinicians may also discuss carefully dosed topical testosterone in select women’s care plans.',
      'Because hormones affect many systems, this option requires individualized review. It is not a casual wellness cream for unsupervised use.',
      'Initial HRT orders require the Required HRT Lab Package ($260 total: Lab Kit $200 with Lab Kit shipping included, plus Lab Review $60). Medication shipping remains separate where applicable.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support libido and sexual wellness when testosterone is clinically indicated in a women\'s hormone plan',
      'May help improve energy levels, motivation, and mood under clinical supervision',
      'May support muscle tone and body composition goals as part of a broader hormone plan',
      'Topical format allows measured, clinician-directed application with precise dosing',
      'Can be considered when oral or other routes are less preferred for testosterone delivery',
    ],
    howItWorks:
      'A cream delivers testosterone through the skin in amounts selected by your provider. Absorption and response vary by person, application site, and dose. Your clinician compares this route with alternatives and decides whether monitoring (including labs) is needed over time.',
    whyPeopleChooseIt: [
      'Non-injection topical format',
      'Allows precise, provider-set dosing strategies',
      'Useful when testosterone is clinically indicated within a broader plan',
      'Pairs with ongoing provider follow-up rather than one-size-fits-all use',
    ],
    whatToExpect:
      'Initial HRT orders include the Required HRT Lab Package once when applicable. After approval, apply only to areas and schedules your provider specifies. Wash hands after use and follow any transfer-prevention guidance included with your prescription.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Avoid implying testosterone cream is routine for all women.',
      'No guaranteed energy, libido, or body-composition outcomes.',
    ],
  },

  // ===== LONGEVITY & COGNITIVE =====
  'nad-plus': {
    benefitHeadline: 'NAD+ Cellular Energy, Mitochondrial & Longevity Coenzyme Support',
    shortDescription:
      'NAD+ (nicotinamide adenine dinucleotide) is a coenzyme essential for cellular energy production and DNA repair. This provider-directed compounded option may support mitochondrial function, cognitive clarity, cellular repair, and healthy aging. Choose from injection and nasal spray options after eligibility review, with clear expectations and no hype-driven promises.',
    highlights: [
      'Cellular Energy Production',
      'Mitochondrial Function Support',
      'DNA Repair & Longevity',
      'Injection & Nasal Options',
      'Provider-Directed',
    ],
    about: [
      'NAD+ (nicotinamide adenine dinucleotide) is a molecule found naturally in the body and often discussed in wellness and longevity care. This listing offers compounded injection and nasal-spray options after a licensed provider reviews your eligibility.',
      'Wellness interest is not the same as an established medical claim. NAD+ may be considered as part of a supervised plan — not as an anti-aging cure or guaranteed energy fix.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support cellular energy production and ATP synthesis for improved vitality under clinical guidance',
      'May help maintain mitochondrial function and cellular respiration as NAD+ levels naturally decline with age',
      'May support DNA repair mechanisms and sirtuin activation related to healthy aging',
      'May help with cognitive clarity, mental focus, and brain fog reduction under provider supervision',
      'Available as both injection and nasal spray for individualized delivery preferences',
    ],
    howItWorks:
      'In general biology, NAD+ participates in normal cellular processes related to energy metabolism. A compounded nasal spray delivers NAD+ under provider direction. How any one person feels afterward varies, and this page does not claim a specific clinical outcome. Your care team explains whether it belongs in your plan.',
    whyPeopleChooseIt: [
      'Nasal spray option listed on this page',
      'Appeals to customers interested in longevity-oriented wellness care',
      'Provider review before anything is dispensed',
      'Clear distinction from peptide products and other longevity listings',
    ],
    whatToExpect:
      'Select the available option, complete intake, and wait for provider review. Administration details and schedule come from your prescribing provider and pharmacy materials if approved.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [
      'Confirm preferred public claim boundary for NAD+ with medical director.',
    ],
    regulatoryNotes: [
      'No anti-aging cure or guaranteed energy claims.',
      'Compounded — do not imply FDA approval of this formulation.',
    ],
  },

  selank: {
    benefitHeadline: 'Selank Peptide — Calm-Focus & Stress Resilience Support',
    shortDescription:
      'Selank is a provider-directed compounded peptide injection potentially used to support stress resilience, calm-focus states, anxiety-related wellness goals, cognitive clarity, and emotional balance. Evidence in this area is still developing, and use is available only after eligibility review.',
    highlights: [
      'Stress Resilience Support',
      'Calm-Focus Peptide',
      'Anxiety-Related Wellness',
      'Compounded Injection',
      'Provider Review Required',
    ],
    about: [
      'Selank is a research-oriented peptide offered here as a compounded injection. It is not the same product as Semax Injection or the Selank + Semax Blend Nasal Spray.',
      'Wellness interest often involves calm or stress-related comfort. That interest should not be confused with established treatments for anxiety disorders or other diagnoses. Your provider decides whether this option is appropriate.',
    ].join('\n\n'),
    potentialBenefits: [
      'May help support stress resilience and calm-focus states under clinical supervision',
      'Researched for potential anxiolytic effects related to stress and anxiety-adjacent wellness goals',
      'May support cognitive clarity and emotional balance without sedation',
      'Offers an injectable format for provider-directed peptide care distinct from Semax',
      'Supports a cautious, education-first approach with realistic expectations',
    ],
    howItWorks:
      'Selank is discussed in research and wellness settings for possible effects related to stress and calm-focus interests. This page does not claim a proven mechanism or guaranteed effect. If prescribed, your provider and pharmacy materials explain how to use it and what to watch for.',
    whyPeopleChooseIt: [
      'Clear single-peptide Selank offering (not a blend)',
      'Injectable route for customers whose plan calls for it',
      'Separated from Semax so comparisons stay honest',
      'Provider review before dispensing',
    ],
    whatToExpect:
      'Supplied at the strength and vial size shown. Use only if prescribed. Dosing and frequency are provider-directed — not DIY.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [RESEARCH_FLAG],
    regulatoryNotes: [
      'Research-oriented framing only; no FDA-approved anxiety treatment claims.',
    ],
  },

  semax: {
    benefitHeadline: 'Semax Peptide — Cognitive Focus, Memory & Neuroprotection Support',
    shortDescription:
      'Semax is a provider-directed compounded peptide injection potentially used to support focus, attention, memory consolidation, cognitive performance, neuroprotection, and mental clarity. Interest is research-oriented — not presented as a proven treatment for ADHD, dementia, or other diagnoses.',
    highlights: [
      'Focus & Attention Support',
      'Memory & Cognitive Enhancement',
      'Neuroprotection Potential',
      'Compounded Peptide Injection',
      'Provider-Guided',
    ],
    about: [
      'Semax is a research-oriented peptide available as a compounded injection after licensed-provider review. It is intentionally separate from Selank and from the Selank + Semax nasal blend.',
      'Customers comparing peptides should know: Selank conversations often lean calm/stress wellness; Semax conversations more often lean focus/cognitive wellness. Neither is guaranteed, and neither replaces dedicated mental-health or neurological care when needed.',
    ].join('\n\n'),
    potentialBenefits: [
      'May help support sustained focus and attention for cognitive performance under clinical supervision',
      'Researched for potential effects on memory consolidation and learning enhancement',
      'May support neuroprotection and neuronal health through BDNF-related pathways',
      'May help with mental clarity and cognitive stamina without stimulant effects',
      'Provides a dedicated Semax injectable option distinct from Selank and combination nasal products',
    ],
    howItWorks:
      'Semax is discussed in research and wellness settings for possible focus-related interests. Storefront copy does not claim proven cognitive benefits or a specific mechanism of action. Your provider interprets whether it is suitable and how it should be used if approved.',
    whyPeopleChooseIt: [
      'Single-peptide clarity for customers who specifically want Semax',
      'Injectable format when that route fits the clinical plan',
      'Easy to distinguish from Selank and the nasal blend',
      'Clear, realistic framing that respects developing evidence',
    ],
    whatToExpect:
      'Injectable vial at the listed strength/size. Provider determines approval and instructions. Do not combine peptide products unless your clinician specifically directs you to.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [RESEARCH_FLAG],
    regulatoryNotes: [
      'No established cognitive-disease treatment claims.',
    ],
  },

  'selank-semax-nasal-spray': {
    benefitHeadline: 'Selank + Semax Dual-Peptide Nasal Spray — Calm-Focus & Cognitive Blend',
    shortDescription:
      'This compounded nasal spray combines Selank and Semax peptides in one provider-directed blend, potentially used to support combined calm-focus states, stress resilience, cognitive clarity, memory, and emotional balance. It is a distinct formulation from ordering each injectable separately, designed for customers who prefer a nose spray over injections.',
    highlights: [
      'Dual-Peptide Nasal Blend',
      'Calm-Focus + Cognitive Support',
      'Needle-Free Format',
      'Provider-Directed',
      'Convenient Combination',
    ],
    about: [
      'Selank + Semax Blend Nasal Spray delivers both peptides in a single compounded nasal format. People may choose it for convenience or preference — not because a blend automatically works “better” than a single agent.',
      'Any calm-focus or cognitive wellness interests discussed with Selank or Semax individually remain research-oriented here as well. This product is not presented as an established treatment for anxiety, ADHD, dementia, or other diagnoses.',
    ].join('\n\n'),
    potentialBenefits: [
      'Combines Selank and Semax for dual calm-focus and cognitive support in one convenient nasal format',
      'May help support stress resilience, emotional balance, and mental clarity simultaneously',
      'Needle-free nasal delivery for customers who prefer to avoid injections',
      'Catalog strength is clearly listed (micrograms of each peptide per spray)',
      'Keeps expectations realistic for research-oriented peptide wellness support',
    ],
    howItWorks:
      'You spray a measured amount into the nose as directed. The catalog lists strength as micrograms of each peptide per spray. We do not claim a proven combined clinical effect. If prescribed, your provider explains technique, frequency, and whether a combination product fits better than a single peptide.',
    whyPeopleChooseIt: [
      'Convenience of one nasal product instead of two injectables',
      'Appeals to customers who dislike needles',
      'Transparent strength labeling from the live catalog',
      'Still protected by provider review before dispensing',
    ],
    whatToExpect:
      'Nasal spray bottle at the strength/size listed. Use only as prescribed. Follow pharmacy instructions for priming, storage, and dosing.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [RESEARCH_FLAG, 'Confirm preferred public language for combination peptide nasal products.'],
    regulatoryNotes: [
      'Preserve catalog strength (50mcg/50mcg per spray).',
      'No diagnosis-treatment claims for the blend.',
    ],
  },

  tesamorelin: {
    benefitHeadline: 'Tesamorelin GHRH Analog — Growth Hormone, Visceral Fat & Metabolic Support',
    shortDescription:
      'Tesamorelin is a provider-directed compounded injection featuring a growth hormone-releasing hormone (GHRH) analog. It may support natural growth hormone release, visceral fat reduction, lean body composition, lipid metabolism, and metabolic wellness under clinical review.',
    highlights: [
      'GHRH Analog',
      'Growth Hormone Release Support',
      'Visceral Fat Reduction',
      'Body-Composition Support',
      'Provider-Directed',
    ],
    about: [
      'Tesamorelin is offered as a provider-directed compounded injectable. Exact formulation details remain part of clinical review and pharmacy fulfillment.',
      'Tesamorelin has an FDA-approved indication related to reducing excess abdominal fat in adults with HIV-associated lipodystrophy. Outside that labeled context, broader body-composition or wellness interest is provider-guided and may be considered off-label — it is not an FDA-approved general weight-loss indication.',
      'A licensed provider reviews whether this option fits your history and goals before anything is dispensed.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support natural growth hormone release and HGH pathway activation under clinical supervision',
      'May help reduce visceral adipose tissue and support lean body composition goals',
      'May support lipid metabolism and cardiovascular metabolic markers under clinical monitoring',
      'Provides a GHRH-analog option for individualized clinical discussion of body-composition goals',
      'Supports an individualized plan — responses vary and outcomes are not guaranteed',
    ],
    howItWorks:
      'As a growth hormone–releasing factor analog, Tesamorelin is designed to interact with pathways involved in the body’s own growth-hormone release signaling. How any one person responds varies. Your licensed provider decides whether this option may fit your history, goals, and safety profile — including whether any discussion is within labeled use or a carefully considered off-label wellness conversation.',
    whyPeopleChooseIt: [
      'Want a GHRH-analog option under licensed-provider review',
      'Prefer a clearly identified main peptide with clinical formulation review',
      'Value provider review before compounded options are dispensed',
      'Appreciate clear education about labeled indication versus broader wellness interest',
    ],
    whatToExpect:
      'After ordering, complete intake for licensed-provider review. Exact formulation and use instructions come from your clinician and pharmacy if approved. Do not self-adjust dosing.',
    importantInformation: [
      DEFAULT_COMPOUNDED_IMPORTANT,
      'Tesamorelin’s FDA-approved indication relates to excess abdominal fat in adults with HIV-associated lipodystrophy. This compounded listing is not marketed as FDA-approved therapy for general weight loss, general obesity, anti-aging, guaranteed abdominal fat reduction in the general population, or guaranteed muscle growth.',
    ].join(' '),
    reviewFlags: [
      'MEDICAL DIRECTOR REVIEW REQUIRED = YES — confirm public framing for off-label/body-composition wellness interest beyond HIV-associated lipodystrophy labeled indication.',
    ],
    regulatoryNotes: [
      'Do not market as FDA-approved general weight loss.',
      'No guaranteed belly-fat loss, anti-aging, or muscle-gain claims.',
      'Compounded listing — do not imply FDA approval of this specific compounded product.',
    ],
  },

  // ===== RECOVERY & PERFORMANCE =====
  'recovery-stack': {
    benefitHeadline: 'Recovery Stack — Four-Peptide Tissue Repair & Recovery Blend',
    shortDescription:
      'Recovery Stack is a provider-directed compounded four-peptide recovery injection (BPC-157, GHK-Cu, KPV, TB-500), potentially used to support musculoskeletal recovery, tissue repair, inflammation modulation, wound healing, and athletic performance wellness. Your provider and dispensing pharmacy determine the final preparation and instructions.',
    highlights: [
      'Four-Peptide Recovery Blend',
      'Tissue Repair Support',
      'Inflammation Modulation',
      'Compounded Injection',
      'Provider Review Required',
    ],
    about: [
      'Recovery Stack is designed as a single provider-directed pathway for customers discussing recovery and wellness goals with a licensed provider.',
      'The storefront does not publish pharmacy-level formulation details. Eligibility, final preparation, and use instructions are determined through clinical review and pharmacy fulfillment.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support musculoskeletal recovery and tissue repair under clinical supervision',
      'Four-peptide blend (BPC-157, GHK-Cu, KPV, TB-500) for comprehensive recovery support',
      'May help modulate inflammation and support wound healing pathways',
      'May support tendon, ligament, and connective-tissue comfort for athletic performance wellness',
      'Keeps formulation and treatment decisions within the clinical workflow for individualized care',
    ],
    howItWorks:
      'Complete intake after checkout. A licensed provider reviews your history and goals, and the dispensing pharmacy confirms the final preparation and directions if approved.',
    whyPeopleChooseIt: [
      'Want a dedicated recovery and wellness option',
      'Prefer provider oversight before a compounded product is dispensed',
      'Value a customer-friendly name without pharmacy-level formulation details',
    ],
    whatToExpect:
      'Complete intake and wait for provider review. Approval, formulation, and instructions are not guaranteed by purchase.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    regulatoryNotes: [
      'No guaranteed recovery, performance, or wellness outcomes.',
      'Do not expose unverified formulation or concentration details.',
    ],
  },

  'bpc-157-tb-500': {
    benefitHeadline: 'BPC-157 + TB-500 Wolverine — Dual-Peptide Recovery Blend (Capsule or Injection)',
    shortDescription:
      'Wolverine is a provider-directed compounded BPC-157 and TB-500 dual-peptide blend, potentially used to support musculoskeletal recovery, tissue repair, inflammation modulation, tendon and ligament comfort, and athletic performance wellness. Available as capsule or injection with realistic expectations and no guaranteed injury healing.',
    highlights: [
      'BPC-157 + TB-500 Blend',
      'Capsule or Injection',
      'Tissue Repair Support',
      'Recovery & Performance Wellness',
      'Provider-Guided',
    ],
    about: [
      'BPC-157 and TB-500 are research-oriented peptides frequently mentioned in training-recovery and repair-oriented wellness discussions. This listing offers both peptides together as a compounded blend, with strength listed as “Blend” because exact amounts are set by the prescribing provider and pharmacy.',
      'Research interest should not be confused with established sports-medicine cures. This page does not describe FDA-approved treatment for specific injuries.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support musculoskeletal recovery and tissue repair under clinical supervision',
      'BPC-157 researched for potential effects on tendon, ligament, and gut mucosal healing',
      'TB-500 researched for potential effects on tissue regeneration and inflammation modulation',
      'Lets your provider choose capsule or injection based on the clinical plan',
      'Combines two commonly paired recovery peptides in one compounded product',
    ],
    howItWorks:
      'These peptides are researched and discussed for possible roles related to tissue comfort and recovery-oriented wellness — but the science is still developing. This page does not claim a proven healing mechanism or clinical outcome. If prescribed, your provider determines blend details and how to use the selected form.',
    whyPeopleChooseIt: [
      'Two dosage forms on one product page for flexible clinical matching',
      'Single checkout for a BPC-157/TB-500 blend rather than sourcing separately',
      'Clear, realistic framing for informed customers',
      'Provider review before anything ships',
    ],
    whatToExpect:
      'Choose Capsule or Injection below. Exact blend details come from your provider and pharmacy. Do not self-direct peptide stacking or treat this as a substitute for injury evaluation.',
    importantInformation: [
      DEFAULT_COMPOUNDED_IMPORTANT,
      'This product does not guarantee injury healing, tissue repair, or performance enhancement.',
    ].join(' '),
    reviewFlags: [
      RESEARCH_FLAG,
      'Catalog strength is "Blend" only — do not invent mg amounts.',
    ],
    regulatoryNotes: [
      'No guaranteed healing or performance enhancement.',
      'Preserve Blend strength language.',
    ],
  },

  // ===== SKIN & HAIR =====
  'tretinoin-cream': {
    benefitHeadline: 'Tretinoin Prescription Retinoid — Acne, Texture & Anti-Aging Skin Renewal',
    shortDescription:
      'Tretinoin is a prescription topical retinoid (vitamin A derivative) used in dermatology to support acne treatment, skin cell turnover, fine line and wrinkle reduction, uneven skin texture improvement, hyperpigmentation, and photoaging repair. Your provider matches treatment to your skin — with guidance that keeps irritation in check.',
    highlights: [
      'Prescription Retinoid',
      'Acne Treatment Support',
      'Fine Line & Wrinkle Reduction',
      'Skin Cell Turnover',
      'Multiple Strengths Available',
    ],
    about: [
      'Tretinoin is a topical vitamin A–related medicine long used in dermatology for acne and skin-renewal goals. On this page it is offered as a cream in several strengths after provider review.',
      'Cosmetic improvement is possible for some users, but results vary and dryness or peeling can happen — especially when starting. Your provider helps choose strength and a routine your skin can tolerate.',
    ].join('\n\n'),
    potentialBenefits: [
      'May help treat acne and reduce breakouts through increased skin cell turnover',
      'May help reduce fine lines, wrinkles, and visible signs of photoaging with consistent use',
      'May improve uneven skin texture, roughness, and hyperpigmentation over time',
      'May support collagen production and smoother-looking skin with long-term use',
      'Multiple strengths for a personalized start — pairs well with gentle cleansing and daily sunscreen',
    ],
    howItWorks:
      'Tretinoin encourages skin cell turnover — in plain language, it helps newer skin come to the surface more regularly. That process may improve breakouts and the appearance of uneven texture, while also explaining why mild irritation can occur as your skin adjusts. Patience and a smart routine matter more than rushing to a higher strength.',
    whyPeopleChooseIt: [
      'Trusted prescription retinoid category with clear strength choices',
      'Addresses both acne-care and skin-renewal conversations in one product family',
      'Provider guidance reduces the guesswork of starting too strong',
      'Straightforward cream format for nighttime routines',
    ],
    whatToExpect:
      'Select a strength, complete intake, and follow approved directions — usually a thin nighttime layer plus daily sunscreen. Do not increase strength on your own if irritation appears; contact your care team.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Distinguish medical acne uses from cosmetic appearance benefits.',
      'No guaranteed wrinkle-erasure claims.',
    ],
  },

  'minoxidil-topical': {
    benefitHeadline: 'Minoxidil Compounded Topical — Hair Follicle Stimulation & Thinning Hair Support',
    shortDescription:
      'Minoxidil Topical is a compounded prescription solution featuring minoxidil, potentially used to support hair follicle stimulation, increased blood flow to scalp tissue, thinning hair management, androgenetic alopecia treatment, and visible hair density improvement. Personalized based on provider evaluation and the formulation selected for you.',
    highlights: [
      'Hair Follicle Stimulation',
      'Androgenetic Alopecia Support',
      'Compounded & Personalized',
      'Scalp Blood Flow Support',
      'Provider-Directed',
    ],
    about: [
      'Minoxidil is a medicine commonly used in hair-care treatment plans. My Bare Method offers a compounded combination topical that includes minoxidil, with companion ingredients determined by your clinician and pharmacy for your preparation.',
      'You receive a personalized bottle, and your provider or pharmacy can confirm the exact ingredients in your formula.',
    ].join('\n\n'),
    potentialBenefits: [
      'May help stimulate hair follicles and support visible hair density improvement with consistent use',
      'May increase blood flow to scalp tissue to support follicle nourishment and hair growth',
      'May help manage thinning hair and androgenetic alopecia under clinical supervision',
      'Allows provider personalization of the compounded combination for individualized care',
      'Fits customers who want prescription guidance — not guesswork aisle products',
    ],
    howItWorks:
      'Minoxidil is commonly used to support hair-care treatment plans applied to the scalp. Your compounded formula delivers medication as directed by your provider. Results and timelines vary. Ask your care team what realistic expectations look like for your formula.',
    whyPeopleChooseIt: [
      'Prescription pathway with clinical personalization',
      'Topical convenience for at-home routines',
      'Provider follow-up available when you need adjustments',
      'Clear positioning as a compounded, clinician-directed option',
    ],
    whatToExpect:
      'Supplied as a topical solution bottle after approval. Apply only as directed. Request your specific ingredient details from your care team if you want the full formula breakdown.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [
      'FORMULATION REVIEW — Exact combination ingredients beyond minoxidil are not defined in the authoritative catalog. Keep wording general; do not invent companion ingredients.',
    ],
    regulatoryNotes: [
      'Preserve “Combination formula” strength language.',
      'No guaranteed hair-growth claims.',
    ],
  },

  'bimatoprost-solution': {
    benefitHeadline: 'Bimatoprost Prescription — Eyelash Length, Thickness & Brow Enhancement',
    shortDescription:
      'Bimatoprost is a prescription prostamide solution potentially used to support eyelash length, thickness, and darkness enhancement, as well as brow fullness and appearance improvement. Application is typically limited to the lash or brow line — this is not a general face serum.',
    highlights: [
      'Eyelash Length & Thickness',
      'Brow Fullness Support',
      'Prescription Prostamide',
      'Targeted Lash/Brow Application',
      'Provider-Reviewed',
    ],
    about: [
      'The customer-facing name for this product is Lash/Brow Growth Serum. The underlying formulation is a prescription bimatoprost solution. Bimatoprost is used in clinical practice for effects related to eyelash growth when applied as directed. My Bare Method offers it as a prescription solution after provider review.',
      'Follow application instructions carefully and share eye or medical history during intake so your clinician can screen for appropriateness.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support increased eyelash length, thickness, and darkness with consistent directed use',
      'May help improve brow fullness and appearance when your provider considers it appropriate',
      'Bimatoprost may influence the eyelash growth cycle, leading to longer or fuller-looking lashes over time',
      'Provides a prescription pathway instead of unverified cosmetic shortcuts',
      'Targeted line application along the upper eyelash line or as directed for brows',
    ],
    howItWorks:
      'Bimatoprost can influence the growth cycle of eyelashes for some users, which may lead to longer or fuller-looking lashes over time with consistent use. Changes are gradual and vary by person. Your provider and pharmacy materials explain exact technique.',
    whyPeopleChooseIt: [
      'Clear prescription positioning for lash and brow goals',
      'Small bottle size listed transparently on this page',
      'Clinical screening before use',
      'Instructions-focused experience that protects eye safety',
    ],
    whatToExpect:
      'Solution bottle at the strength and size listed. Use the applicator method described by your pharmacy and provider, usually along the upper eyelash line or as directed for brows. Report eye irritation promptly.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    reviewFlags: [
      'Display name is Lash/Brow Growth Serum; underlying formulation remains Bimatoprost Solution (slug/SKU unchanged).',
    ],
    regulatoryNotes: [
      'No guaranteed dramatic lash or brow results.',
      'Preserve formulation identity as bimatoprost solution for clinical/fulfillment clarity.',
    ],
  },

  // ===== PROVIDER CARE =====
  'initial-provider-consultation': {
    benefitHeadline: 'Start With Clarity — A Personalized Initial Clinical Consultation',
    shortDescription:
      'Your Initial Clinical Consultation is dedicated time with a licensed clinician to review goals, health history, and whether treatment options make sense for you. It is the clearest first step when you want guidance before choosing a medication or subscription.',
    highlights: [
      'Personalized First Visit',
      'Goal & History Review',
      'Clear Next Steps',
      'No Prescription Guarantee',
    ],
    about: [
      'This is a consultation service — not a medication. You and your provider discuss what you want to work on, review relevant history, and map sensible next steps.',
      'Those next steps might include labs, a follow-up, a product discussion, or no medication at all. Booking this visit does not guarantee that a prescription will be written.',
    ].join('\n\n'),
    potentialBenefits: [
      'Helps you start care with a clear clinical conversation',
      'Reduces guesswork before choosing a medication or subscription',
      'Creates space to ask questions about options and expectations',
      'May identify whether labs or follow-up should come next',
    ],
    howItWorks:
      'After purchase/scheduling guidance, you complete intake and meet with a licensed provider. Together you review goals and history. Any prescribing decision happens only if clinically appropriate — evaluation and prescribing are separate steps.',
    whyPeopleChooseIt: [
      'Ideal on-ramp for new My Bare Method customers',
      'Useful across weight management, hormones, and other wellness goals',
      'Sets expectations early about provider-guided care',
      'Transparent pricing for a defined consultation session',
    ],
    whatToExpect:
      'One consultation session as listed. Bring medications, allergies, and goal priorities. Prescription fulfillment, if any, is a separate step after approval.',
    importantInformation:
      'Provider Care services require scheduling and may involve medical intake. Purchasing a visit does not guarantee medication approval.',
  },

  'follow-up-appointment': {
    benefitHeadline: 'Stay On Track With a Focused Follow-Up Clinical Visit',
    shortDescription:
      'A Follow-Up Clinical Visit gives you time to review progress, talk through side effects or questions, and refine your plan with a licensed provider. It is built for people already in care — or advised to return — who want thoughtful adjustments, not automatic refills.',
    highlights: [
      'Progress Review',
      'Plan Adjustments',
      'Ask Anything',
      'Clinician-Guided',
    ],
    about: [
      'Follow-up is where good care stays personal. Bring updates on how you feel, what is working, and what is not. Your provider may continue, modify, pause, or stop a treatment based on what they learn.',
      'This visit supports shared decision-making. It is not a guarantee of continued prescribing.',
    ].join('\n\n'),
    potentialBenefits: [
      'Helps fine-tune treatment after you have real-world experience on a plan',
      'Creates space for side-effect and lifestyle questions',
      'Supports safer decisions before dose or formulation changes',
      'Keeps your care relationship active and informed',
    ],
    howItWorks:
      'You meet with a provider who reviews your interval history and current plan. Together you decide on next steps. Medication changes still require clinical judgment and, when applicable, pharmacy coordination.',
    whyPeopleChooseIt: [
      'Perfect after starting a new therapy',
      'Helpful when goals or life circumstances change',
      'More focused than starting from scratch with an initial visit',
      'Clear, affordable session pricing',
    ],
    whatToExpect:
      'One follow-up session. Have questions ready. If labs were ordered, results may be part of the discussion.',
    importantInformation:
      'Follow-up does not guarantee continued prescribing. Recommendations depend on safety and appropriateness.',
  },

  'laboratory-review': {
    benefitHeadline: 'Understand Your Labs — Then Decide What Comes Next',
    shortDescription:
      'Lab Review is a provider visit focused on interpreting your results in plain language and recommending sensible next steps. It turns numbers into a clearer plan — without automatically promising a prescription.',
    highlights: [
      'Plain-Language Lab Review',
      'Personalized Takeaways',
      'Informed Next Steps',
      'Provider Insight',
    ],
    about: [
      'This service focuses on interpretation and guidance based on results available for review. It does not automatically include ordering labs or prescribing medication.',
      'Bring the questions that matter most to you — energy, hormones, metabolic markers, or anything your clinician should prioritize.',
    ].join('\n\n'),
    potentialBenefits: [
      'Helps you understand which results matter for your goals',
      'May clarify whether more testing is needed',
      'Supports smarter decisions about continuing or changing a plan',
      'Reduces confusion from portal printouts without clinical context',
    ],
    howItWorks:
      'Your provider reviews submitted or available results, explains plain-language takeaways, and recommends follow-up actions. Treatment changes remain separate clinical decisions.',
    whyPeopleChooseIt: [
      'Ideal when you already have recent labs',
      'Useful before adjusting hormone or metabolic therapies',
      'Focused session instead of a generic consult',
      'Transparent pricing for interpretation time',
    ],
    whatToExpect:
      'One laboratory-review session. Ensure results are available to the care team as instructed.',
    importantInformation:
      'Lab review does not guarantee a prescription or a specific treatment.',
  },

  'lab-kit': {
    benefitHeadline: 'Specimen Collection Kit for Initial Hormone Therapy',
    shortDescription:
      'The Lab Kit is the required specimen collection kit for initial Women’s Hormone Therapy orders. Lab Kit shipping is included in the $200 kit price. This is not a medication.',
    highlights: [
      'Required for Initial HRT',
      'Lab Kit Shipping Included',
      'Not a Medication',
      'Pairs with Laboratory Review',
    ],
    about: [
      'Initial Women’s Hormone Therapy orders include the Required HRT Lab Package when applicable: Lab Kit ($200) plus Laboratory Review ($60) for $260 total, added once per applicable initial order.',
      'Lab Kit shipping is included in the $200 Lab Kit price. That does not include medication shipping, which remains separate where applicable. Established HRT customers with approved therapy history are not charged the package again under current history rules.',
    ].join('\n\n'),
    potentialBenefits: [
      'Removes guesswork about which labs are needed to start',
      'Keeps initial HRT checkout complete in one step',
      'Clear separation from medication pricing and medication shipping',
    ],
    howItWorks:
      'When an applicable HRT product enters checkout for a new HRT customer, Lab Kit ($200) and Laboratory Review ($60) are added once as the Required HRT Lab Package.',
    whyPeopleChooseIt: [
      'Required package for first HRT order',
      'Transparent $260 combined pricing',
      'Lab Kit shipping included',
    ],
    whatToExpect:
      'You receive the specimen collection kit with Lab Kit shipping included. Laboratory Review is a separate provider interpretation service — not a medication. Medication shipping is separate where applicable.',
    importantInformation:
      'Lab Kit and Laboratory Review are provider-care services, not medications. They are not discounted by OGTBM.',
  },

  // ===== ACCESSORIES =====
  'complete-injection-starter-kit': {
    benefitHeadline: 'Everything You Need to Start Organized — In One Bundle',
    shortDescription:
      'The Complete Injection Starter Kit gathers core injection-day accessories into one convenient package so you can set up storage, travel, prep, and disposal without hunting down each item separately.',
    highlights: [
      'All-in-One Bundle',
      'Storage + Travel',
      'Prep & Disposal',
      'Routine-Ready',
    ],
    about: [
      'This kit gathers core injection-day accessories into one checkout: a Premium Protective Medication Case, temperature-controlled travel case, discreet travel bag, reusable ice pack, wellness planner, sharps container, alcohol prep wipes, and insulin syringes.',
      'It is a supplies bundle — not a medication. Prescription products are sold separately and still require provider review when applicable.',
    ].join('\n\n'),
    potentialBenefits: [
      'Saves time versus buying each accessory individually',
      'Helps new injectable routines feel organized from day one',
      'Covers storage, travel, prep, and disposal basics in one kit',
      'Makes a thoughtful setup gift for someone starting a supervised injectable plan',
    ],
    howItWorks:
      'Each included item supports a practical piece of an injection routine — organizing vials, traveling more comfortably, prepping skin, tracking habits, or disposing of sharps safely. Use the components together or à la carte within your kit.',
    whyPeopleChooseIt: [
      'One bundle instead of eight separate decisions',
      'Ideal “first setup” purchase for injectable wellness routines',
      'Pairs naturally with provider-guided medication orders',
      'Catalog-confirmed contents — no mystery extras',
    ],
    whatToExpect:
      'You receive the kit components listed in the catalog description. Individual item details match the standalone accessory listings.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications and do not require a prescription.',
    reviewFlags: [
      'Kit contents taken from catalog — do not add unverified extra items.',
    ],
  },

  'premium-3d-printed-peptide-case': {
    benefitHeadline: 'Elevated Protection for Your Wellness Essentials',
    shortDescription:
      'A durable protective case designed to keep your wellness essentials organized, protected, and discreet at home or while traveling. Its structured construction helps protect your supplies while maintaining the clean, elevated aesthetic of My Bare Method.',
    highlights: [
      'Structured Protection',
      'Organized Storage',
      'Travel-Ready',
      'Discreet Aesthetic',
    ],
    about: [
      'A structured, durable medication and wellness-supply case designed for organized storage and convenient travel.',
    ].join('\n\n'),
    potentialBenefits: [
      'Helps keep compatible medication supplies organized and protected',
      'Provides a more discreet, polished alternative to loose storage',
      'Supports tidy routines at home or while traveling',
      'Pairs cleanly with other My Bare Method accessories',
    ],
    howItWorks:
      'Use it at home or while traveling to keep compatible wellness supplies together and easy to access.',
    whyPeopleChooseIt: [
      'Elevated, structured protection for everyday organization',
      'Discreet storage that fits the My Bare Method aesthetic',
      'Complements insulated travel cases rather than replacing pharmacy storage guidance',
    ],
    whatToExpect:
      'One case as listed. Follow medication storage rules from your pharmacy separately. This accessory is not a temperature-controlled, waterproof, or certified medical device.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications.',
  },

  'temperature-controlled-travel-case': {
    benefitHeadline: 'Insulated Travel Protection for Temperature-Sensitive Vials',
    shortDescription:
      'An insulated travel case with thermal lining designed to help buffer peptide vials during trips and commutes. Pack smart, add ice packs as needed, and always follow your pharmacy’s storage rules.',
    highlights: [
      'Insulated Design',
      'Thermal Lining',
      'Travel Ready',
      'Pairs With Ice Packs',
    ],
    about: [
      'This case is built for people who need a more protective carrier when vials should stay buffered from ambient swings. Performance depends on packing method, ice-pack use, and outdoor conditions.',
      'We do not publish a guaranteed hold-time on this page. Your pharmacy storage instructions remain the authority for medication temperature requirements.',
    ].join('\n\n'),
    potentialBenefits: [
      'Helps vials travel more comfortably than a standard tote',
      'Works well with a reusable ice pack for added cold support',
      'Useful for weekends away, flights, or long commute days',
      'Gives peace of mind when organization and insulation both matter',
    ],
    howItWorks:
      'Load vials using a sensible packing method, add cold packs when appropriate, and keep the case closed while in transit. Reassess packing for extreme heat or long delays.',
    whyPeopleChooseIt: [
      'Purpose-built insulated carrier for wellness injectables',
      'Complements — rather than replaces — pharmacy storage guidance',
      'Popular pairing with the Complete Injection Starter Kit components',
    ],
    whatToExpect:
      'One insulated case. Add cold packs as needed. No guaranteed hold-time is stated on this page.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications.',
    reviewFlags: [
      'Prior catalog “up to 48 hours” claim remains removed pending owner verification.',
    ],
    regulatoryNotes: [
      'No guaranteed temperature-hold duration in customer copy.',
    ],
  },

  'discreet-travel-bag': {
    benefitHeadline: 'Carry Your Routine Without Looking Clinical',
    shortDescription:
      'A sleek travel bag with water-resistant lining designed to hold your wellness kit discreetly — vials, cases, and day-of supplies included — whether you are commuting or heading through an airport.',
    highlights: [
      'Discreet Everyday Look',
      'Water-Resistant Lining',
      'Kit-Friendly Capacity',
      'Travel Ready',
    ],
    about: [
      'This bag is meant to carry therapy-related accessories in a low-key everyday style. It features a vegan-leather look with water-resistant lining for commuting and travel.',
    ].join('\n\n'),
    potentialBenefits: [
      'Keeps your routine organized while traveling',
      'Avoids an overly medical-looking bag aesthetic',
      'Works as the outer bag for insert cases and ice packs',
      'Helps separate wellness supplies from the rest of your luggage',
    ],
    howItWorks:
      'Pack your cases, vials (as appropriate), and day-of supplies inside. Use it as your dedicated wellness travel bag so nothing gets lost in a larger suitcase.',
    whyPeopleChooseIt: [
      'Style-forward alternative to clear medical pouches',
      'Practical lining for real travel days',
      'Pairs with insulated and 3D-printed insert cases',
    ],
    whatToExpect:
      'One travel bag as listed. Fill with the accessories and medications appropriate for your plan.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications.',
  },

  'reusable-ice-pack': {
    benefitHeadline: 'Simple Cold Support for On-the-Go Vials',
    shortDescription:
      'A reusable gel ice pack intended to help keep peptide vials cooler during transport when paired with an insulated case or travel bag.',
    highlights: [
      'Reusable Gel Pack',
      'Travel Cold Support',
      'Kit Essential',
      'Easy to Freeze',
    ],
    about: [
      'This is a straightforward cold-support accessory. Freeze it ahead of travel and pack it beside vials according to your case design and pharmacy guidance. Catalog copy describes a non-toxic, long-lasting gel pack.',
    ].join('\n\n'),
    potentialBenefits: [
      'Adds cold support inside an insulated travel case',
      'Handy backup pack for weekend bags',
      'Reusable for ongoing travel routines',
    ],
    howItWorks:
      'Freeze fully, then place in your case or bag. Avoid direct contact with materials your pharmacy says should stay dry unless protected.',
    whyPeopleChooseIt: [
      'Inexpensive essential for temperature-sensitive travel',
      'Works with My Bare Method insulated cases',
      'Easy to keep permanently in your kit rotation',
    ],
    whatToExpect:
      'One reusable ice pack. Freeze before use.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications.',
  },

  'daily-weekly-wellness-planner': {
    benefitHeadline: 'Track Consistency, Habits, and How You Feel',
    shortDescription:
      'A daily and weekly planner with habit trackers and reflection space designed around wellness routines — including therapy check-ins if you like written logs.',
    highlights: [
      'Habit Tracking',
      'Weekly Planning',
      'Reflection Space',
      'Routine Support',
    ],
    about: [
      'Consistency is easier when you can see it. This paper planner helps you map goals, habits, and notes between provider visits. It is not a medical device and does not provide clinical advice.',
    ].join('\n\n'),
    potentialBenefits: [
      'Helps you stay accountable to daily and weekly wellness habits',
      'Creates a simple log you can bring to follow-up visits',
      'Supports reflection without needing another app',
    ],
    howItWorks:
      'Use daily/weekly spreads to plan, track, and review. Adapt sections to doses, meals, movement, mood, or whatever your routine needs.',
    whyPeopleChooseIt: [
      'Analog clarity for people who prefer paper',
      'Purpose-built wellness framing',
      'Lightweight add-on to any care plan',
    ],
    whatToExpect:
      'One planner as listed.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications.',
  },

  'sharps-container': {
    benefitHeadline: 'Safer Disposal for Used Syringes and Needles',
    shortDescription:
      'An FDA-cleared sharps container for disposing of used syringes and needles at home — secure, puncture-resistant, and built for responsible end-of-use handling.',
    highlights: [
      'FDA-Cleared',
      'Puncture-Resistant',
      'Home Disposal',
      'Kit Essential',
    ],
    about: [
      'Used sharps do not belong in household trash bags. This container gives you a dedicated, puncture-resistant place to dispose of syringes and needles until you can follow local drop-off rules when full.',
    ].join('\n\n'),
    potentialBenefits: [
      'Helps keep used sharps out of regular trash',
      'Supports safer home injection routines',
      'Completes a responsible injectable supply kit',
    ],
    howItWorks:
      'Drop used syringes/needles into the container point-first as directed. Fill only to the indicated line. Do not force items or empty a used container.',
    whyPeopleChooseIt: [
      'Clear FDA-cleared positioning from catalog copy',
      'Essential companion to syringe purchases',
      'Simple, durable design for everyday use',
    ],
    whatToExpect:
      'One container. Follow community guidelines for sharps drop-off when full.',
    importantInformation:
      'Accessories are wellness tools and supplies. Follow local disposal rules when the container is full.',
    regulatoryNotes: [
      'FDA-cleared language retained from existing catalog.',
    ],
  },

  'alcohol-prep-wipes': {
    benefitHeadline: 'Clean Prep Pads for Confident Injection Days',
    shortDescription:
      'Individually wrapped 70% isopropyl alcohol pads for cleaning injection sites before use. Choose 200-count or 500-count boxes — cart quantity is how many boxes you want.',
    highlights: [
      '70% Isopropyl Alcohol',
      'Individually Wrapped',
      'Two Count Options',
      'Everyday Kit Staple',
    ],
    about: [
      'A quick wipe is a small step that helps injection routines feel cleaner and more consistent. These pads are built for site prep when your instructions call for it.',
    ].join('\n\n'),
    potentialBenefits: [
      'Convenient single-use prep pads',
      'Stock options for lighter or heavier routines',
      'Easy to stash in a travel bag or home kit',
    ],
    howItWorks:
      'Open a pad, wipe the site as directed, and allow skin to dry before injecting if that is part of your instructions. Discard after one use.',
    whyPeopleChooseIt: [
      'Clear 200 vs 500 count choices',
      'Familiar 70% IPA prep standard',
      'Affordable refill item',
    ],
    whatToExpect:
      'Box of individually wrapped pads at the count you select.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications.',
  },

  'premium-insulin-syringes': {
    benefitHeadline: 'Reliable Syringe Packs for Subcutaneous Routines',
    shortDescription:
      'Insulin syringes for subcutaneous injections when your prescribed routine calls for this supply type. Choose pack counts from 10 to 100 — cart quantity is the number of packs, not the syringes inside.',
    highlights: [
      'Multiple Pack Counts',
      'Subcutaneous Use',
      'Easy Refills',
      'Pairs With Sharps Container',
    ],
    about: [
      'These syringes support day-to-day injectable routines when your clinician or pharmacy recommends this supply type. Needle gauge and barrel markings are not listed in the live catalog, so this page does not invent them — check packaging on arrival or ask your care team which syringe you should use.',
    ].join('\n\n'),
    potentialBenefits: [
      'Flexible pack sizes for light or frequent use',
      'Straightforward refill shopping',
      'Pairs cleanly with alcohol wipes and a sharps container',
    ],
    howItWorks:
      'Select the pack count that matches your routine, confirm package specs on arrival, and dispose of used syringes in a proper sharps container.',
    whyPeopleChooseIt: [
      'Ten pack-count options on one page',
      'Clear separation between pack size and cart quantity',
      'Essential companion to injectable wellness plans',
    ],
    whatToExpect:
      'One pack at the count selected. Confirm gauge and markings on the package before use.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications. Use only the syringe type your provider or pharmacy recommends.',
    reviewFlags: [
      'Needle gauge / unit markings not in catalog — confirm before publishing specs later.',
    ],
    regulatoryNotes: [
      'No invented gauge or unit-marking claims.',
    ],
  },
};

export const MEMBERSHIP_COPY: Record<string, MembershipCopy> = {
  'semaglutide-membership': {
    benefitHeadline: 'One Membership. One Predictable Monthly Price.',
    shortDescription:
      'Semaglutide Membership is a flat $125/month program for provider-guided Semaglutide care with Vitamin B12 or Glycine options. You get structured support, a locked rate while continuously enrolled, and clear separation between the membership program and medication fulfillment.',
    highlights: [
      '$125 Flat Monthly Rate',
      'Provider-Guided Care',
      'Included Dose Range',
      'Member Product Savings',
    ],
    about: [
      'This is a membership program purchase — not a one-off retail vial checkout. Your monthly rate stays predictable while you remain continuously enrolled and your provider-selected treatment stays within the included Semaglutide formulations.',
      'When you join, you share a requested dose for intake. Your licensed provider still decides whether treatment is appropriate and which dose is approved. Medication fulfillment uses the matching retail Semaglutide vial SKU.',
      'Selected shipping renews monthly with your card charge and is not included in the base $125 membership price. A one-time Initial Provider Visit ($75) may apply when required.',
    ].join('\n\n'),
    potentialBenefits: [
      'Predictable $125 monthly program pricing',
      'Provider-directed adjustments within included Semaglutide options while enrolled',
      'Locked rate while membership stays continuously active and in good standing',
      'Save 15% on other eligible wellness products and accessories per program terms',
      'Priority access to new wellness products',
    ],
    howItWorks:
      'You enroll in the membership PROGRAM, select a requested dose, and choose Two-Day or Next-Day shipping. Your card is charged monthly for the $125 membership plus selected shipping ($155 or $175/month). A one-time Initial Provider Visit ($75) may apply when required. After provider review, approved medication is fulfilled using the corresponding retail Semaglutide vial SKU. Payment does not guarantee a prescription.',
    whyPeopleChooseIt: [
      'Prefer flat monthly budgeting over paying per retail vial strength',
      'Want ongoing provider-guided Semaglutide care with a clear program maximum',
      'Value member savings on eligible add-on products',
      'Like clear due-today versus monthly renewal totals at checkout',
    ],
    whatToExpect:
      'Initial term is 3 months, then month to month. Complete secure card checkout, complete intake, and await provider review. Requested dose is not automatically the approved dose. Selected shipping renews monthly with your card. Payment does not guarantee a prescription.',
    importantInformation:
      'Membership enrollment and payment do not guarantee a prescription. Availability depends on provider judgment, pharmacy fulfillment, and applicable requirements.',
    benefits: [
      'Flat $125 monthly program rate for Semaglutide membership',
      'Locked membership pricing while continuously enrolled in good standing',
      'Provider-directed formulation adjustments within included Semaglutide options',
      'Save 15% on other eligible wellness products',
      'Save 15% on accessories',
      'Priority access to new wellness products',
      'Provider-guided care with eligibility review',
      'Refill and pharmacy coordination support',
    ],
    regulatoryNotes: [
      'Distinguish PROGRAM SKU vs FULFILLMENT SKU.',
      'Customer copy: card monthly billing with recurring shipping; do not imply ACH-primary public checkout.',
    ],
  },

  'tirzepatide-membership': {
    benefitHeadline: 'Flat Monthly Tirzepatide Care Through the Included Maximum',
    shortDescription:
      'Tirzepatide Membership is a flat $179/month program for provider-guided Tirzepatide care with Vitamin B12 or Glycine options through the included dose maximum (formulations through 15mg). It is built for customers who want dual-pathway medication support with predictable membership pricing — not per-vial retail checkout.',
    highlights: [
      '$179 Flat Monthly Rate',
      'Through 15mg Maximum',
      'Provider-Guided Care',
      'Member Product Savings',
    ],
    about: [
      'This membership is a program purchase with one predictable monthly rate through the included Tirzepatide maximum. It is not interchangeable with Semaglutide Membership, and 30mg is not part of this program.',
      'You choose a requested dose when joining. A licensed provider reviews eligibility and may approve a different dose. Fulfillment uses the retail Tirzepatide vial SKU that matches the approved medication strength.',
      'Selected shipping renews monthly with your card charge and is not included in the base $179 membership price. A one-time Initial Provider Visit ($75) may apply when required.',
    ].join('\n\n'),
    potentialBenefits: [
      'Predictable $179 monthly program pricing through the included maximum',
      'Provider-directed adjustments within listed Tirzepatide formulations while enrolled',
      'Locked rate while membership stays continuously active and in good standing',
      'Save 15% on other eligible wellness products and accessories per program terms',
      'Priority access to new wellness products',
    ],
    howItWorks:
      'Enrollment purchases the membership PROGRAM. You select a requested formulation and shipping. Your card is charged monthly for the $179 membership plus selected shipping. A one-time Initial Provider Visit ($75) may apply when required. Requested formulation informs intake; approved treatment drives fulfillment. Payment does not guarantee a prescription.',
    whyPeopleChooseIt: [
      'Want Tirzepatide’s dual-pathway option with flat monthly budgeting',
      'Prefer a clear included maximum through 15mg',
      'Value member savings on eligible wellness products and accessories',
      'Prefer secure monthly card billing with clear shipping renewal amounts',
    ],
    whatToExpect:
      'Initial term is 3 months, then month to month. Complete secure card checkout, complete intake, and complete provider review. Selected shipping renews monthly with your card. Payment does not guarantee a prescription.',
    importantInformation:
      'Payment and enrollment do not guarantee a prescription. Tirzepatide Membership is not interchangeable with Semaglutide Membership. 30mg is not included.',
    benefits: [
      'Flat $179 monthly program rate through included Tirzepatide maximum',
      'Locked membership pricing while continuously enrolled in good standing',
      'Provider-directed adjustments within included formulations through 15mg',
      'Save 15% on other eligible wellness products',
      'Save 15% on accessories',
      'Priority access to new wellness products',
      'Provider-guided care with eligibility review',
      'Refill and pharmacy coordination support',
    ],
    regulatoryNotes: [
      'No 30mg offering.',
      'Customer copy: card monthly billing with recurring shipping; do not imply ACH-primary public checkout.',
    ],
  },
};

export function paragraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean);
}
