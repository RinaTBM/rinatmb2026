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
    benefitHeadline: 'Appetite & Metabolic Support for Your Weight-Loss Journey',
    shortDescription:
      'Semaglutide + B6 Injection is a provider-guided injectable option designed to support appetite control and metabolic balance as part of a structured weight-management plan. Many people explore it when they want help feeling fuller sooner and staying satisfied longer — with vitamin B6 included in this compounded preparation.',
    highlights: [
      'Appetite Support',
      'Feel Fuller Longer',
      'Metabolic Support',
      'Provider-Guided Care',
      'Multiple Strengths',
    ],
    about: [
      'Semaglutide is a GLP-1 medication option used in provider-directed weight-management care. On My Bare Method, it is offered as a compounded injection that pairs semaglutide with vitamin B6.',
      'This page is for the retail injectable product with selectable vial strengths. If you prefer one predictable monthly program rate instead of paying per vial strength, see Semaglutide Membership.',
      'Treatment is personalized. Ordering begins a clinical review — it does not automatically mean a prescription will be issued.',
    ].join('\n\n'),
    potentialBenefits: [
      'May help you feel full sooner during meals',
      'May support staying satisfied longer between meals',
      'May make it easier to reduce overall food intake as part of a supervised plan',
      'Supports a structured, provider-guided approach to weight management',
      'Available in multiple strengths so your clinician can match treatment to your needs',
    ],
    howItWorks:
      'Semaglutide works with GLP-1 receptors involved in appetite and blood-sugar regulation. In everyday terms, those pathways help your body register fullness and manage metabolic signals after eating. Many people notice they are less driven to overeat and can stick with smaller portions more comfortably. Individual responses vary. Your provider decides whether this approach fits your health history and how to advance treatment over time.',
    whyPeopleChooseIt: [
      'Clear injectable format with labeled strength options on this page',
      'Pairs semaglutide with vitamin B6 in a provider-directed compounded preparation',
      'Fits customers who want medication support alongside lifestyle changes',
      'Can be purchased à la carte or explored through Semaglutide Membership for flat monthly pricing',
    ],
    whatToExpect:
      'Choose your preferred strength from the options below. After checkout you complete a medical intake. A licensed provider reviews your information and determines eligibility, dose, and follow-up. Use only as directed if approved. Do not change your dose on your own.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'No guaranteed weight-loss amount.',
      'Do not claim FDA approval for this specific compounded Semaglutide + B6 listing.',
    ],
  },

  tirzepatide: {
    benefitHeadline: 'Dual-Pathway Appetite Support for Deeper Metabolic Goals',
    shortDescription:
      'Tirzepatide + B6 Injection is a provider-guided injectable option that engages two related pathways involved in appetite and metabolic regulation. People often consider it when they want strong fullness support under clinical care — with vitamin B6 included in this compounded preparation.',
    highlights: [
      'Dual-Pathway Support',
      'Appetite Control',
      'Fullness Support',
      'Provider-Guided Care',
      'Multiple Strengths',
    ],
    about: [
      'Tirzepatide acts on GLP-1 and GIP pathways involved in appetite, fullness, and blood-sugar regulation. That dual-pathway design is what sets it apart from semaglutide alone — not a promise that it is automatically “better” for everyone.',
      'This listing is the retail injectable product. For a flat monthly program through the included dose maximum, see Tirzepatide Membership.',
      'A licensed provider reviews whether Tirzepatide, Semaglutide, or another plan is the right fit for you.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support stronger feelings of fullness after meals for some people',
      'May help reduce interest in large portions as part of a supervised plan',
      'Engages two metabolic pathways (GLP-1 and GIP) under provider direction',
      'Offers multiple vial strengths for individualized clinical titration',
      'Pairs treatment with vitamin B6 in this compounded injectable format',
    ],
    howItWorks:
      'Tirzepatide works with receptors tied to appetite and blood-sugar regulation — commonly described as GLP-1 and GIP pathways. Together, those signals can influence how quickly you feel satisfied and how your body manages metabolic cues after eating. Many people experience a quieter “food noise” and an easier time with portion control, though results vary. Your provider sets expectations and adjusts treatment based on your response and safety profile.',
    whyPeopleChooseIt: [
      'Distinct from Semaglutide — dual-pathway option when clinically appropriate',
      'Injectable strengths listed clearly for transparent shopping and clinical matching',
      'Designed for customers ready for structured, provider-guided weight-management care',
      'Membership alternative available for flat monthly pricing through the included maximum',
    ],
    whatToExpect:
      'Select a vial strength, complete intake after order, and wait for licensed-provider review. Exact dose, schedule, and follow-up are clinical decisions. Storefront selection informs the conversation — it does not override medical judgment.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Distinguish clearly from Semaglutide; not interchangeable.',
      'No guaranteed weight-loss amount.',
    ],
  },

  'fat-burner': {
    benefitHeadline: 'A Three-Peptide Compounded Option for Body-Composition Conversations',
    shortDescription:
      'Fat Burner is a provider-directed compounded injection combining AOD-9604, MOTS-C, and Tesamorelin. It is designed for supervised body-composition and metabolic wellness programs — with emerging research interest around each ingredient, and no guaranteed fat-loss or weight-loss outcomes.',
    highlights: [
      'AOD-9604 + MOTS-C + Tesamorelin',
      'Compounded Injection',
      'Provider-Guided',
      'Emerging Research Interest',
    ],
    about: [
      'This product’s customer-facing name is Fat Burner. The formulation is a compounded blend of AOD-9604 (6 mg), MOTS-C (10 mg), and Tesamorelin (15 mg) in a 5 mL vial (approximately 1.2 mg/mL, 2 mg/mL, and 3 mg/mL respectively).',
      'It is not the same as any oral “Fat Burner +” capsule product, and it does not include SLU-PP-332. The blend is not FDA-approved as a weight-loss drug, and this page does not claim clinically proven fat burning or guaranteed results.',
      'A licensed provider reviews whether this compounded option fits your history and goals before anything is dispensed.',
    ].join('\n\n'),
    potentialBenefits: [
      'May be considered in provider-guided body-composition or metabolic wellness programs',
      'Combines three ingredients that each have areas of emerging research interest',
      'Offers a single compounded injectable format when a clinician wants this specific blend',
      'Supports a supervised pathway rather than unsupervised supplement shopping',
      'Potential benefits are individualized and not guaranteed',
    ],
    howItWorks:
      'AOD-9604, MOTS-C, and Tesamorelin are each discussed in research and wellness settings for different proposed metabolic or body-composition interests. Tesamorelin is a growth hormone-releasing factor analog; AOD-9604 and MOTS-C are explored in emerging metabolic research contexts. Combining them in one compounded vial does not make the blend FDA-approved or clinically proven for weight loss. Your provider explains whether this approach is appropriate and how it should be used if approved.',
    whyPeopleChooseIt: [
      'Want a clearly labeled three-ingredient compounded injectable under clinical review',
      'Prefer provider-guided body-composition conversations over unverified over-the-counter products',
      'Appreciate transparent formulary amounts and concentrations on the product page',
      'Understand this is emerging-interest compounding — not a guaranteed fat-loss shot',
    ],
    whatToExpect:
      'One active variant is listed: the full AOD-9604 / MOTS-C / Tesamorelin 5 mL vial. After checkout you complete intake. A licensed provider determines eligibility and instructions. Use only as directed if approved. Do not combine with other peptide products unless your clinician specifically directs you to.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [
      'MEDICAL DIRECTOR REVIEW REQUIRED = YES — compounded AOD-9604/MOTS-C/Tesamorelin blend; emerging/research framing only; no FDA-approved blend or guaranteed fat-loss claims.',
      'Owner-approved retail $259.00 (at-cost $150.00).',
    ],
    regulatoryNotes: [
      'Do not imply the blend is FDA-approved.',
      'Do not claim clinically proven weight loss, fat burning, or metabolic improvement.',
      'Not SLU-PP-332 / Fat Burner+ capsules.',
    ],
  },

  // ===== WOMEN'S HORMONE THERAPY =====
  'estradiol-patch': {
    benefitHeadline: 'Steady Estrogen Support Through a Simple Skin Patch',
    shortDescription:
      'The Estradiol Patch delivers estradiol — a primary form of estrogen — through the skin as part of provider-directed hormone therapy. Many women explore this option when they want steady support without an oral tablet, personalized after clinical review.',
    highlights: [
      'Through-the-Skin Delivery',
      'Steady Hormone Support',
      'Multiple Patch Strengths',
      'Provider-Personalized',
    ],
    about: [
      'Estradiol is a form of estrogen your body already recognizes. A transdermal patch is designed to release hormone across the wear period your provider recommends.',
      'Clinicians may discuss estrogen therapy when evaluating menopause-related changes or other hormone concerns. Whether a patch is right for you depends on your history, goals, and — when needed — labs. Hormone therapy is not one-size-fits-all.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support estrogen-related goals defined with your provider',
      'Offers a non-oral delivery method some people prefer',
      'Designed for steady release across the prescribed wear schedule',
      'Multiple strengths available for individualized matching',
      'Can be part of a broader hormone plan when clinically appropriate',
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
      'Select a patch strength and pack size, then complete intake for provider review. If approved, apply only as directed — including site rotation and change timing. Do not share patches or adjust strength without guidance.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Hormone therapy is not appropriate for everyone.',
      'No guaranteed “hormone balancing” outcomes.',
    ],
  },

  'progesterone-capsules': {
    benefitHeadline: 'Oral Progesterone Support as Part of Personalized Hormone Care',
    shortDescription:
      'Progesterone Capsules provide an oral form of progesterone for provider-directed hormone therapy. Clinicians often discuss this option when building a personalized plan — sometimes alongside estrogen therapy — based on your history and goals.',
    highlights: [
      'Oral Capsule Convenience',
      'Hormone Therapy Support',
      'Two Strength Options',
      'Provider-Directed',
    ],
    about: [
      'Progesterone is a hormone involved in the menstrual cycle and is frequently part of menopause and hormone-therapy conversations. Capsules make dosing straightforward once a clinician has chosen a plan.',
      'Your provider may recommend progesterone for specific clinical reasons. Capsule strength and timing are individualized — never copy someone else’s regimen.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support hormone-therapy goals defined with your clinician',
      'Offers a familiar oral capsule format',
      'Available in more than one strength for personalized matching',
      'Can complement estrogen therapy when your provider recommends a combined plan',
      'Fits into a monitored, provider-guided care pathway',
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
      'Choose a capsule strength, complete intake, and await provider review. Take only as directed on your prescription label if approved. Report new or concerning symptoms to your care team promptly.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Distinguish from estradiol and testosterone.',
      'Avoid guaranteed symptom-resolution language.',
    ],
  },

  'testosterone-cream': {
    benefitHeadline: 'Targeted Topical Testosterone, Personalized to You',
    shortDescription:
      'Testosterone Cream is a topical option for provider-directed hormone therapy when clinically appropriate. Carefully dosed testosterone may be discussed as part of certain women’s hormone plans after a thorough review of goals, history, and — when needed — labs.',
    highlights: [
      'Topical Application',
      'Personalized Dosing',
      'Provider-Reviewed',
      'Hormone Therapy Option',
    ],
    about: [
      'Testosterone is a hormone involved in energy, libido, muscle, and other body functions. While it is often associated with men’s health, clinicians may also discuss carefully dosed topical testosterone in select women’s care plans.',
      'Because hormones affect many systems, this option requires individualized review. It is not a casual wellness cream for unsupervised use.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support hormone-related goals identified with your provider',
      'Topical format allows measured, clinician-directed application',
      'Can be considered when oral or other routes are less preferred',
      'Fits into a monitored hormone-therapy plan with follow-up',
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
      'After approval, apply only to areas and schedules your provider specifies. Wash hands after use and follow any transfer-prevention guidance included with your prescription.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Avoid implying testosterone cream is routine for all women.',
      'No guaranteed energy, libido, or body-composition outcomes.',
    ],
  },

  // ===== LONGEVITY & COGNITIVE =====
  'nad-plus': {
    benefitHeadline: 'Cellular Energy Conversations, Guided by Your Provider',
    shortDescription:
      'NAD+ Injection is a provider-directed compounded option people explore when they are curious about cellular energy and longevity-focused wellness care. It is available only after eligibility review — with clear expectations and no hype-driven promises.',
    highlights: [
      'Provider-Directed',
      'Compounded Injectable',
      'Wellness-Focused Interest',
      'Two Vial Options',
    ],
    about: [
      'NAD+ (nicotinamide adenine dinucleotide) is a molecule found naturally in the body and frequently discussed in wellness and longevity circles. This listing offers a compounded injectable form after a licensed provider reviews your eligibility.',
      'Common wellness interest is not the same as an established medical claim. We present NAD+ carefully: it may be considered as part of a supervised plan, not as an anti-aging cure or guaranteed energy fix.',
    ].join('\n\n'),
    potentialBenefits: [
      'May be considered for customers exploring NAD+ under clinical guidance',
      'Supports a structured intake and provider-review experience',
      'Offers more than one vial size/total amount for clinical matching',
      'Keeps expectations realistic — individual responses vary widely',
    ],
    howItWorks:
      'In general biology, NAD+ participates in normal cellular processes related to energy metabolism. A compounded injectable delivers NAD+ under provider direction. How any one person feels afterward varies, and this page does not claim a specific clinical outcome. Your care team explains whether it belongs in your plan and what “success” should look like for you.',
    whyPeopleChooseIt: [
      'Transparent vial options listed on this page',
      'Appeals to customers interested in longevity-oriented wellness conversations',
      'Provider gatekeeping before anything is dispensed',
      'Clear distinction from peptide products and other longevity listings',
    ],
    whatToExpect:
      'Select a vial option, complete intake, and wait for provider review. Administration details and schedule come from your prescribing provider and pharmacy materials if approved.',
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
    benefitHeadline: 'A Calm-Focus Peptide Option — Emerging Wellness Interest',
    shortDescription:
      'Selank Injection is a provider-directed compounded peptide some people discuss when they are exploring calm, focus, or stress-related wellness goals. Uses in this area are emerging — presented carefully, and only after eligibility review.',
    highlights: [
      'Calm-Focus Interest',
      'Compounded Peptide',
      'Provider Review Required',
      'Distinct from Semax',
    ],
    about: [
      'Selank is a research-oriented peptide offered here as a compounded injection. It is not the same product as Semax Injection or the Selank + Semax Blend Nasal Spray.',
      'Common wellness interest often involves calm or stress-related comfort. Proposed/emerging uses should not be confused with established treatments for anxiety disorders or other diagnoses. Your provider decides whether this option is appropriate.',
    ].join('\n\n'),
    potentialBenefits: [
      'May be discussed when exploring calm-focus wellness goals under supervision',
      'Offers an injectable format for provider-directed peptide care',
      'Keeps Selank distinct from Semax and combination nasal options',
      'Supports a cautious, education-first shopping experience',
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
      'Emerging framing only; no FDA-approved anxiety treatment claims.',
    ],
  },

  semax: {
    benefitHeadline: 'Focus-Oriented Peptide Interest — Carefully Framed',
    shortDescription:
      'Semax Injection is a provider-directed compounded peptide some people explore when focus, attention, or cognitive wellness is on their mind. Interest is emerging and research-oriented — not presented as a proven treatment for ADHD, dementia, or other diagnoses.',
    highlights: [
      'Focus-Oriented Interest',
      'Compounded Peptide',
      'Provider-Guided',
      'Distinct from Selank',
    ],
    about: [
      'Semax is a research-oriented peptide available as a compounded injection after licensed-provider review. It is intentionally separate from Selank and from the Selank + Semax nasal blend.',
      'Customers comparing peptides should know: Selank conversations often lean calm/stress wellness; Semax conversations more often lean focus/cognitive wellness. Neither is guaranteed, and neither replaces dedicated mental-health or neurological care when needed.',
    ].join('\n\n'),
    potentialBenefits: [
      'May be discussed when exploring focus-related wellness goals under supervision',
      'Provides a dedicated Semax injectable option (not a combo product)',
      'Supports informed comparison with Selank without overstating evidence',
      'Requires eligibility review before anything is dispensed',
    ],
    howItWorks:
      'Semax is discussed in research and wellness settings for possible focus-related interests. Storefront copy does not claim proven cognitive benefits or a specific mechanism of action. Your provider interprets whether it is suitable and how it should be used if approved.',
    whyPeopleChooseIt: [
      'Single-peptide clarity for customers who specifically want Semax',
      'Injectable format when that route fits the clinical plan',
      'Easy to distinguish from Selank and the nasal blend',
      'Education-first framing that respects emerging evidence',
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
    benefitHeadline: 'Selank + Semax Together — A Convenient Nasal Blend',
    shortDescription:
      'This compounded nasal spray combines Selank and Semax in one provider-directed blend for customers who prefer a nose spray over injections. It is not the same as ordering each injectable separately, and wellness interests around calm or focus remain emerging — not established cures.',
    highlights: [
      'Nasal Spray Convenience',
      'Combined Blend',
      'Provider-Directed',
      'Non-Injection Format',
    ],
    about: [
      'Selank + Semax Blend Nasal Spray delivers both peptides in a single compounded nasal format. People may choose it for convenience or preference — not because a blend automatically works “better” than a single agent.',
      'Any calm-focus or cognitive wellness interests discussed with Selank or Semax individually remain emerging here as well. This product is not presented as an established treatment for anxiety, ADHD, dementia, or other diagnoses.',
    ].join('\n\n'),
    potentialBenefits: [
      'Offers a needle-free nasal format some customers prefer',
      'Combines Selank and Semax when a clinician wants both in one product',
      'Catalog strength is clearly listed (micrograms per spray)',
      'Keeps expectations realistic for emerging peptide wellness interest',
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
    benefitHeadline: 'A Growth Hormone-Releasing Factor Option — Carefully Framed',
    shortDescription:
      'Tesamorelin Injection is a provider-directed compounded option featuring Tesamorelin, a growth hormone-releasing factor analog. People may discuss it in supervised body-composition or metabolic wellness conversations — with careful framing and no guaranteed fat-loss promises.',
    highlights: [
      'GHRH Analog',
      '10mg / 2mL Vial',
      'Provider-Directed',
      'Compounded Injectable',
    ],
    about: [
      'Tesamorelin is a growth hormone-releasing factor analog (not a GLP-1 medication and not interchangeable with Semaglutide or Tirzepatide). This listing is a compounded lyophilized injectable preparation totaling 10 mg in a 2 mL vial (5 mg/mL).',
      'Tesamorelin has an FDA-approved indication related to reducing excess abdominal fat in adults with HIV-associated lipodystrophy. Broader wellness or body-composition interest outside that labeled context must stay carefully qualified and is flagged for medical-director review.',
      'This page does not market Tesamorelin as FDA-approved general weight-loss therapy, an anti-aging treatment, or a guaranteed belly-fat or muscle solution.',
    ].join('\n\n'),
    potentialBenefits: [
      'May be discussed in provider-guided body-composition or metabolic wellness programs when clinically appropriate',
      'Offers a clearly labeled injectable strength and vial size for supervised care',
      'Supports an education-first experience that distinguishes GHRH analogs from GLP-1 options',
      'Keeps expectations realistic — individual responses vary and outcomes are not guaranteed',
    ],
    howItWorks:
      'Tesamorelin acts as a growth hormone-releasing factor analog — in plain language, it is designed to interact with pathways that stimulate the body’s own growth-hormone release signaling. That is a different mechanism family from GLP-1 appetite medications. How any one person responds varies. Your licensed provider decides whether this option fits your history, goals, and safety profile.',
    whyPeopleChooseIt: [
      'Want a GHRH-analog conversation distinct from Semaglutide/Tirzepatide',
      'Prefer transparent vial labeling (10 mg total · 5 mg/mL · 2 mL)',
      'Value provider review before compounded peptides are dispensed',
      'Appreciate clear boundaries around what is — and is not — being claimed',
    ],
    whatToExpect:
      'One active variant is listed: 10 mg total · 5 mg/mL · 2 mL vial for subcutaneous injection as directed. After order, complete intake for licensed-provider review. Exact use instructions come from your clinician and pharmacy if approved. Do not self-adjust dosing.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [
      'MEDICAL DIRECTOR REVIEW REQUIRED = YES — confirm public framing for uses beyond HIV-associated lipodystrophy labeled indication context.',
      'Owner-approved retail $149.00 (at-cost $83.33).',
    ],
    regulatoryNotes: [
      'Not a GLP-1; do not market as FDA-approved general weight loss.',
      'No guaranteed belly-fat loss, anti-aging, or muscle-gain claims.',
      'Compounded listing — do not imply FDA approval of this specific compounded product.',
    ],
  },

  // ===== RECOVERY & PERFORMANCE =====
  'bpc-157-tb-500': {
    benefitHeadline: 'Recovery-Oriented Peptide Blend — Capsule or Injection',
    shortDescription:
      'Wolverine combines BPC-157 and TB-500 in a provider-directed compounded blend available as capsule or injection. These peptides are often discussed in recovery and performance wellness conversations — as emerging interest, not guaranteed injury healing.',
    highlights: [
      'Capsule or Injection',
      'Two-Peptide Blend',
      'Recovery Wellness Interest',
      'Provider-Guided',
    ],
    about: [
      'BPC-157 and TB-500 are research-oriented peptides frequently mentioned in training-recovery and repair-oriented wellness discussions. This My Bare Method listing offers both peptides together as a compounded blend, with strength listed simply as “Blend” because exact amounts are set by the prescribing provider and pharmacy.',
      'Proposed/emerging uses should not be confused with established sports-medicine cures. This page does not describe FDA-approved treatment for specific injuries.',
    ].join('\n\n'),
    potentialBenefits: [
      'May be discussed when exploring recovery-oriented wellness support under supervision',
      'Lets your provider choose capsule or injection based on the plan',
      'Combines two commonly paired peptides in one compounded product',
      'Keeps healing and performance claims carefully framed as non-guaranteed',
    ],
    howItWorks:
      'These peptides are researched and discussed for possible roles related to tissue comfort and recovery-oriented wellness — but the science is still developing. This page does not claim a proven healing mechanism or clinical outcome. If prescribed, your provider determines blend details and how to use the selected form.',
    whyPeopleChooseIt: [
      'Two dosage forms on one product page for flexible clinical matching',
      'Single checkout for a BPC-157/TB-500 blend rather than sourcing separately',
      'Honest emerging-evidence framing for informed customers',
      'Provider review before anything ships',
    ],
    whatToExpect:
      'Choose Capsule or Injection below. Exact blend details come from your provider and pharmacy. Do not self-direct peptide stacking or treat this as a substitute for injury evaluation.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
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
    benefitHeadline: 'Prescription Skin Renewal for Smoother, Clearer-Looking Skin',
    shortDescription:
      'Tretinoin Cream is a prescription retinoid used to support skin renewal, help address breakouts, and improve the look of uneven texture over time. Multiple strengths let your provider match treatment to your skin — with guidance that keeps irritation in check.',
    highlights: [
      'Supports Skin Renewal',
      'Smoother-Looking Texture',
      'Helps Address Breakouts',
      'Multiple Strengths Available',
    ],
    about: [
      'Tretinoin is a topical vitamin A–related medicine long used in dermatology for acne and skin-renewal goals. On this page it is offered as a cream in several strengths after provider review.',
      'Cosmetic improvement is possible for some users, but results vary and dryness or peeling can happen — especially when starting. Your provider helps choose strength and a routine your skin can tolerate.',
    ].join('\n\n'),
    potentialBenefits: [
      'May help improve the look of breakouts over time',
      'May support smoother-looking skin texture with consistent use',
      'May assist with photoaging concerns when clinically appropriate',
      'Multiple strengths for a more personalized start',
      'Pairs well with gentle cleansing and daily sunscreen habits',
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
    benefitHeadline: 'Personalized Topical Hair Support Featuring Minoxidil',
    shortDescription:
      'This compounded topical formula features minoxidil for prescription hair-care support after provider review. The exact combination is personalized by your clinician and pharmacy — we do not invent a secret ingredient list on this page.',
    highlights: [
      'Features Minoxidil',
      'Compounded & Personalized',
      'Topical Hair Support',
      'Provider-Directed',
    ],
    about: [
      'Minoxidil is a medicine commonly used in hair-care treatment plans. My Bare Method offers a compounded combination topical that includes minoxidil, with companion ingredients determined clinically rather than listed as a fixed consumer recipe.',
      'That honesty matters: you get a personalized preparation, and your provider/pharmacy can tell you exactly what is in your bottle.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support hair-care goals when a topical approach is appropriate',
      'Built around minoxidil, a familiar option in thinning-hair plans',
      'Allows provider personalization of the compounded combination',
      'Fits customers who want prescription guidance — not guesswork aisle products',
    ],
    howItWorks:
      'Minoxidil is commonly used to support hair-care treatment plans applied to the scalp. Your compounded formula delivers medication as directed by your provider. We do not claim a specific amount of growth or a fixed timeline. Ask your care team what realistic expectations look like for your formula.',
    whyPeopleChooseIt: [
      'Prescription pathway with clinical personalization',
      'Topical convenience for at-home routines',
      'Transparent about what the catalog does — and does not — disclose',
      'Provider follow-up available when you need adjustments',
    ],
    whatToExpect:
      'Supplied as a topical solution bottle after approval. Apply only as directed. Request your specific ingredient details from your care team if you want the full formula breakdown.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [
      'Exact combination ingredients beyond minoxidil are not defined in catalog — do not invent them.',
    ],
    regulatoryNotes: [
      'Preserve “Combination formula” strength language.',
      'No guaranteed hair-growth claims.',
    ],
  },

  'bimatoprost-solution': {
    benefitHeadline: 'Prescription Support for Fuller-Looking Lashes',
    shortDescription:
      'Bimatoprost Solution is a prescription topical option people consider when they want fuller-looking eyelashes under clinical guidance. Application is typically limited to the lash line — this is not a general face serum.',
    highlights: [
      'Lash Appearance Support',
      'Prescription Topical',
      'Targeted Application',
      'Provider-Reviewed',
    ],
    about: [
      'Bimatoprost is used in clinical practice for effects related to eyelash growth when applied as directed. My Bare Method offers it as a prescription solution after provider review.',
      'Follow application instructions carefully and share eye or medical history during intake so your clinician can screen for appropriateness.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support fuller-looking eyelashes with consistent, directed use',
      'Provides a prescription pathway instead of unverified cosmetic shortcuts',
      'Targeted lash-line application when used as instructed',
      'Includes clinical review before treatment begins',
    ],
    howItWorks:
      'Bimatoprost can influence the growth cycle of eyelashes for some users, which may lead to longer or fuller-looking lashes over time with consistent use. Changes are gradual and vary by person. Your provider and pharmacy materials explain exact technique.',
    whyPeopleChooseIt: [
      'Clear prescription positioning for lash goals',
      'Small bottle size listed transparently on this page',
      'Clinical screening before use',
      'Instructions-focused experience that protects eye safety',
    ],
    whatToExpect:
      'Solution bottle at the strength and size listed. Use the applicator method described by your pharmacy and provider, usually along the upper eyelash line. Report eye irritation promptly.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    reviewFlags: [
      'Confirm preferred consumer wording for indication framing with medical director if needed.',
    ],
    regulatoryNotes: [
      'No guaranteed dramatic lash results.',
    ],
  },

  // ===== PROVIDER CARE =====
  'initial-provider-consultation': {
    benefitHeadline: 'Start With Clarity — A Personalized First Visit',
    shortDescription:
      'Your Initial Provider Visit is dedicated time with a licensed clinician to review goals, health history, and whether treatment options make sense for you. It is the clearest first step when you want guidance before committing to a medication or membership.',
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
      'Reduces guesswork before choosing a medication or membership',
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
    benefitHeadline: 'Stay On Track With a Focused Provider Check-In',
    shortDescription:
      'A Follow-Up Visit gives you time to review progress, talk through side effects or questions, and refine your plan with a licensed provider. It is built for people already in care — or advised to return — who want thoughtful adjustments, not automatic refills.',
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
      'Laboratory Review is a provider visit focused on interpreting your results in plain language and recommending sensible next steps. It turns numbers into a clearer plan — without automatically promising a prescription.',
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
      'This kit is designed for people who want the essentials in one checkout. According to our catalog, it includes a 3D printed peptide case, temperature-controlled travel case, discreet travel bag, reusable ice pack, wellness planner, sharps container, alcohol prep wipes, and insulin syringes.',
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
    benefitHeadline: 'Keep Vials and Supplies Neat, Protected, and Ready',
    shortDescription:
      'A custom 3D-printed case with compartments designed to hold peptide vials, syringes, and related supplies so your kit stays organized at home or in a larger travel bag.',
    highlights: [
      'Organized Compartments',
      'Vial Protection',
      'Travel-Friendly',
      'Daily-Kit Ready',
    ],
    about: [
      'This case helps small vials and injection supplies live in one protective shell instead of loose in a drawer or tote. It supports organization — it does not replace refrigeration guidance when your medication requires cold storage.',
    ].join('\n\n'),
    potentialBenefits: [
      'Reduces clutter around vials and syringes',
      'Makes grab-and-go packing simpler',
      'Helps protect fragile glass from bouncing loosely in a bag',
      'Pairs cleanly with other My Bare Method accessories',
    ],
    howItWorks:
      'Place vials and compatible supplies into the molded compartments. Use it as your daily organizer or as an insert inside a larger travel bag.',
    whyPeopleChooseIt: [
      'Purpose-built for peptide/injectable supply organization',
      'Lightweight everyday companion',
      'Complements insulated cases rather than replacing them',
    ],
    whatToExpect:
      'One case as listed. Follow medication storage rules from your pharmacy separately.',
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
      'This bag is meant to carry therapy-related accessories in a low-key everyday style. Catalog materials describe a vegan-leather look with water-resistant lining. Exact dimensions are not listed, so we do not invent measurements.',
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
      'Semaglutide Membership is a flat $149/month program for provider-guided Semaglutide + B6 care within the included dose range. You get structured support, a locked rate while continuously enrolled, and clear separation between the membership program and the medication vial used for fulfillment.',
    highlights: [
      '$149 Flat Monthly Rate',
      'Provider-Guided Care',
      'Included Dose Range',
      'Member Product Savings',
    ],
    about: [
      'This is a membership program purchase — not a one-off retail vial checkout. Your monthly rate stays predictable while you remain continuously enrolled and your provider-selected treatment stays within the included Semaglutide formulations.',
      'When you join, you share a requested dose for intake. Your licensed provider still decides whether treatment is appropriate and which dose is approved. Medication fulfillment uses the matching retail Semaglutide vial SKU — we do not create separate membership-only medication SKUs.',
    ].join('\n\n'),
    potentialBenefits: [
      'Predictable $149 monthly program pricing',
      'Provider-directed adjustments within included Semaglutide options while enrolled',
      'Locked rate while membership stays continuously active and in good standing',
      'Save 15% on other eligible wellness products and accessories per program terms',
      'Priority access to new wellness products',
    ],
    howItWorks:
      'You enroll in the membership PROGRAM and select a requested dose. After provider review, approved medication is fulfilled using the corresponding retail Semaglutide vial SKU for that dose. Your membership price remains flat through the included program while you stay continuously enrolled. Billing currently uses invoices with ACH/bank-transfer or domestic wire instructions each period — your bank is not automatically charged by the storefront.',
    whyPeopleChooseIt: [
      'Prefer flat monthly budgeting over paying per retail vial strength',
      'Want ongoing provider-guided Semaglutide care with a clear program maximum',
      'Value member savings on eligible add-on products',
      'Like transparent requested-dose intake without confusing “auto-debit” surprises',
    ],
    whatToExpect:
      'Initial term is 3 months, then month to month. Complete intake, await provider review, and pay each invoice via the instructions provided. Requested dose is not automatically the approved dose. Payment does not guarantee a prescription.',
    importantInformation:
      'Membership enrollment and payment do not guarantee a prescription. Availability depends on provider judgment, pharmacy fulfillment, and applicable requirements.',
    benefits: [
      'Flat $149 monthly program rate for Semaglutide membership',
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
      'Do not imply automatic bank charging under current invoice ACH/Wire flow.',
    ],
  },

  'tirzepatide-membership': {
    benefitHeadline: 'Flat Monthly Tirzepatide Care Through the Included Maximum',
    shortDescription:
      'Tirzepatide Membership is a flat $249/month program for provider-guided Tirzepatide + B6 care through the included dose maximum (formulations through 15mg). It is built for customers who want dual-pathway medication support with predictable membership pricing — not per-vial retail checkout.',
    highlights: [
      '$249 Flat Monthly Rate',
      'Through 15mg Maximum',
      'Provider-Guided Care',
      'Member Product Savings',
    ],
    about: [
      'This membership is a program purchase with one predictable monthly rate through the included Tirzepatide maximum. It is not interchangeable with Semaglutide Membership, and 30mg is not part of this program.',
      'You choose a requested dose when joining. A licensed provider reviews eligibility and may approve a different dose. Fulfillment uses the retail Tirzepatide vial SKU that matches the approved medication strength.',
    ].join('\n\n'),
    potentialBenefits: [
      'Predictable $249 monthly program pricing through the included maximum',
      'Provider-directed adjustments within listed Tirzepatide formulations while enrolled',
      'Locked rate while membership stays continuously active and in good standing',
      'Save 15% on other eligible wellness products and accessories per program terms',
      'Priority access to new wellness products',
    ],
    howItWorks:
      'Enrollment purchases the membership PROGRAM. Requested dose informs intake; approved treatment drives which retail fulfillment SKU is used. Your $249 rate remains locked while membership stays continuously active and within program rules. Each billing period currently uses an invoice with ACH/bank-transfer or domestic wire instructions — not automatic storefront bank charging.',
    whyPeopleChooseIt: [
      'Want Tirzepatide’s dual-pathway option with flat monthly budgeting',
      'Prefer a clear included maximum through 15mg',
      'Value member savings on eligible wellness products and accessories',
      'Appreciate transparent invoice-based ACH/Wire payment instead of surprise auto-debits',
    ],
    whatToExpect:
      'Initial term is 3 months, then month to month. Complete intake, complete provider review, and pay each invoice using the provided bank-transfer instructions. Payment does not guarantee a prescription.',
    importantInformation:
      'Payment and enrollment do not guarantee a prescription. Tirzepatide Membership is not interchangeable with Semaglutide Membership. 30mg is not included.',
    benefits: [
      'Flat $249 monthly program rate through included Tirzepatide maximum',
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
      'Do not imply automatic ACH debit under current invoice model.',
    ],
  },
};

export function paragraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean);
}
