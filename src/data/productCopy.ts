/**
 * My Bare Method customer-facing product copy.
 * Premium, benefit-forward, educational — original MBM wording.
 * Claims stay accurate without making PDPs sound like warning labels.
 */

export interface ProductCopy {
  /** Short benefit headline under the product name (~one line). */
  benefitHeadline: string;
  /** Hero description — ~2–4 sentences. */
  shortDescription: string;
  /** 3–5 ultra-short highlight chips. */
  highlights: string[];
  /** About This Product — What It Is + context. */
  about: string;
  /** Potential Benefits — specific, scannable, claims-safe. */
  potentialBenefits: string[];
  /** How It Works — plain-language mechanism. */
  howItWorks: string;
  /** Why People Choose It — goal-oriented bullets. */
  whyPeopleChooseIt: string[];
  /** What to Expect — experience without guaranteed outcomes. */
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
  'A licensed provider reviews whether this option is appropriate for you and may recommend a different treatment, dose, testing, or follow-up based on your health history. Completing payment does not guarantee a prescription.';

const DEFAULT_COMPOUNDED_IMPORTANT =
  `${DEFAULT_RX_IMPORTANT} This is a compounded, pharmacy-prepared option directed by your prescribing provider. Exact formulation and availability are determined clinically.`;

const RESEARCH_FLAG =
  'Emerging / research-oriented peptide interest — medical director should confirm public benefit framing.';

export const PRODUCT_COPY: Record<string, ProductCopy> = {
  // ===== WEIGHT MANAGEMENT =====
  semaglutide: {
    benefitHeadline: 'Appetite Control & Fullness Support for Weight Management',
    shortDescription:
      'Semaglutide + B6 Injection is a compounded medication in the GLP-1 class — the same hormone-signaling family widely used in modern weight-management care. People choose it when they want help feeling fuller sooner, quieter food noise, and an easier time sticking with smaller portions, with vitamin B6 included in this preparation.',
    highlights: [
      'GLP-1 Appetite Support',
      'Feel Fuller Sooner',
      'Weight-Management Focus',
      'Multiple Strengths',
      'Dose Progression Available',
    ],
    about: [
      'GLP-1 (glucagon-like peptide-1) is a natural hormone signal involved in appetite and fullness. Semaglutide is a medication designed to work with that pathway so your body registers “I’ve had enough” more readily after eating.',
      'On My Bare Method, this listing is a compounded Semaglutide + vitamin B6 injection with selectable vial strengths. It is prepared for your care plan by a pharmacy and is not sold here as a branded retail product. Your provider decides whether this option fits your history and goals.',
      'This page is for à-la-carte retail vials. Prefer one flat monthly program rate? See Semaglutide Membership.',
    ].join('\n\n'),
    potentialBenefits: [
      'Appetite control — may help reduce constant hunger cues',
      'Increased feelings of fullness during and after meals',
      'Support for lower overall food intake within a structured plan',
      'Weight-management support under clinical supervision',
      'Strength options that allow individualized dose progression',
    ],
    howItWorks:
      'After you eat, GLP-1 pathways help tell your brain and gut that you are satisfied. Semaglutide engages those signals, so many people notice they feel full with less food and think about snacking less often. Vitamin B6 is part of this compounded formula. Responses vary — your clinician sets the starting strength and how to advance over time.',
    whyPeopleChooseIt: [
      'Want medication support for appetite when lifestyle changes alone have not been enough',
      'Prefer a clear injectable plan with labeled strength choices',
      'Like the option to move into Semaglutide Membership for predictable monthly pricing',
      'Value clinical review before starting or changing doses',
    ],
    whatToExpect:
      'Select a preferred strength, complete checkout and medical intake, then wait for provider review. If approved, use only as directed — dose changes are clinical decisions. Results and timelines differ from person to person; no specific amount of weight loss is promised.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'No guaranteed weight-loss amount or timeline.',
      'Do not claim FDA approval for this compounded Semaglutide + B6 listing.',
      'Do not use branded drug names as if MBM sells the branded product.',
    ],
  },

  tirzepatide: {
    benefitHeadline: 'Dual-Pathway Appetite & Fullness Support for Weight Goals',
    shortDescription:
      'Tirzepatide + B6 Injection works with two hormone-signaling pathways — GLP-1 and GIP — that help regulate appetite, fullness, and metabolic cues after eating. People often choose it when they want strong satiety support as part of a supervised weight-management plan, with vitamin B6 included in this compounded preparation.',
    highlights: [
      'GLP-1 + GIP Signaling',
      'Strong Fullness Support',
      'Appetite Control Focus',
      'Multiple Strengths',
      'Clinical Dose Matching',
    ],
    about: [
      'Tirzepatide is designed to engage two related pathways involved in appetite and blood-sugar regulation — commonly called GLP-1 and GIP. In plain language, that dual approach can influence how quickly you feel satisfied and how intensely food cues show up between meals.',
      'This listing is a compounded Tirzepatide + vitamin B6 injection with selectable vial strengths. It is not interchangeable with Semaglutide, and it is not marketed here as a branded retail product. A licensed provider decides whether Tirzepatide, Semaglutide, or another plan fits you best.',
      'For a flat monthly program through the included maximum, see Tirzepatide Membership.',
    ].join('\n\n'),
    potentialBenefits: [
      'Appetite support through two hormone-signaling pathways',
      'May increase feelings of fullness after meals',
      'May make it easier to reduce portion sizes and snacking',
      'Weight-management support with clinical supervision',
      'Multiple vial strengths for thoughtful dose progression',
    ],
    howItWorks:
      'GLP-1 and GIP signals help your body manage fullness and metabolic cues after eating. Tirzepatide works with both, which is why many people experience quieter food noise and an easier time with portions — though individual results vary. Your provider matches strength and schedule to your response and safety profile.',
    whyPeopleChooseIt: [
      'Want a dual-pathway option when a clinician recommends it',
      'Prefer transparent injectable strengths while shopping',
      'Ready for structured weight-management care with follow-up',
      'May prefer Tirzepatide Membership for flat monthly budgeting',
    ],
    whatToExpect:
      'Choose a vial strength, complete intake, and await provider review. Exact dose and follow-up are clinical decisions. Storefront selection starts the conversation — it does not override medical judgment. No specific weight-loss amount is guaranteed.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Not interchangeable with Semaglutide.',
      'No guaranteed weight-loss amount.',
      'Do not claim FDA approval for this compounded Tirzepatide + B6 listing.',
    ],
  },

  'fat-burner': {
    benefitHeadline: 'Three Peptides Aimed at Body Composition & Metabolic Goals',
    shortDescription:
      'Fat Burner combines AOD-9604, MOTS-C, and Tesamorelin in one compounded injection for people focused on body composition and metabolic wellness. Each peptide brings a different area of research interest — and your clinician decides whether this blend belongs in your plan. The product name describes the conversation topic, not a guaranteed result.',
    highlights: [
      'AOD-9604 + MOTS-C + Tesamorelin',
      'Body-Composition Focus',
      'Metabolic Pathway Interest',
      'One Compounded Vial',
      'Clinician-Directed',
    ],
    about: [
      'This is an AOD-9604 + MOTS-C + Tesamorelin compounded injection. The customer-facing name is Fat Burner. The vial contains AOD-9604 6 mg, MOTS-C 10 mg, and Tesamorelin 15 mg in 5 mL (about 1.2 mg/mL, 2 mg/mL, and 3 mg/mL).',
      'AOD-9604 is a modified fragment related to growth-hormone research, commonly explored for metabolic and body-composition applications. MOTS-C is a mitochondrial-derived peptide studied in connection with cellular energy and metabolic signaling. Tesamorelin is a GHRH analog that signals the pituitary to increase the body’s own growth-hormone release — a pathway often discussed in body-composition programs.',
      'Providers may consider combining these three areas of interest when a single compounded vial fits the care plan. Ordering starts a clinical review; it does not promise fat loss or weight loss.',
    ].join('\n\n'),
    potentialBenefits: [
      'Body-composition support within a supervised wellness plan',
      'Metabolic wellness conversations tied to three researched pathways',
      'Cellular-energy pathway interest via MOTS-C research',
      'Growth-hormone signaling interest via Tesamorelin',
      'Transparent formulary amounts for informed clinical discussion',
    ],
    howItWorks:
      'AOD-9604 is explored in metabolic and body-composition research. MOTS-C is studied for its relationship to mitochondrial and metabolic signaling. Tesamorelin works with the GHRH pathway so the body can increase its own growth-hormone release rather than receiving growth hormone directly. Pairing them in one vial does not create a proven fat-loss drug or guarantee results — your provider explains whether the blend may fit your goals and how to use it if approved.',
    whyPeopleChooseIt: [
      'Want one clearly labeled three-peptide injection instead of sourcing components separately',
      'Focused on body composition rather than appetite-only GLP-1 plans',
      'Prefer clinician oversight for emerging peptide combinations',
      'Appreciate honest framing: interesting pathways, individualized outcomes',
    ],
    whatToExpect:
      'One active option is listed: the AOD-9604 / MOTS-C / Tesamorelin 5 mL vial. After checkout, complete intake for clinical review. Use only as directed if approved. Do not stack other peptides unless your clinician specifically instructs you to.',
    importantInformation: [
      DEFAULT_COMPOUNDED_IMPORTANT,
      'The name “Fat Burner” is a product name only — it does not guarantee fat burning, weight loss, abdominal fat reduction, metabolic improvement, or muscle gain.',
      'This is not an oral “Fat Burner +” capsule product and does not include SLU-PP-332.',
    ].join(' '),
    reviewFlags: [
      'MEDICAL DIRECTOR REVIEW REQUIRED = YES — confirm public nickname “Fat Burner” + three-peptide benefit framing.',
      'Owner-approved retail $259.00 (at-cost $150.00).',
    ],
    regulatoryNotes: [
      'Do not claim clinically proven triple-peptide fat loss.',
      'Do not imply the blend is an FDA-approved weight-loss drug.',
      'Not SLU-PP-332 / Fat Burner+ capsules.',
    ],
  },

  // ===== WOMEN'S HORMONE THERAPY =====
  'estradiol-patch': {
    benefitHeadline: 'Steady Estrogen Support for Menopause & Hormone Goals',
    shortDescription:
      'The Estradiol Patch delivers estradiol — your body’s primary form of estrogen — through the skin as part of personalized hormone therapy. Women often discuss it when hot flashes, night sweats, sleep changes, mood shifts, or other estrogen-related symptoms are affecting daily life, and they want steady support without a daily tablet.',
    highlights: [
      'Through-the-Skin Estrogen',
      'Steady Daily Support',
      'Multiple Patch Strengths',
      'Personalized Plans',
    ],
    about: [
      'Estradiol is a form of estrogen involved in temperature regulation, vaginal comfort, bone health, and other systems that can shift during menopause or other hormone transitions.',
      'A transdermal patch releases hormone across the wear schedule your clinician recommends. Strength and whether to pair estrogen with progesterone are individualized — hormone therapy is never one-size-fits-all, and not everyone with these symptoms needs treatment.',
    ].join('\n\n'),
    potentialBenefits: [
      'May help ease hot flashes and night sweats when estrogen support is appropriate',
      'May support sleep quality when night sweats disrupt rest',
      'May help with vaginal comfort and related estrogen-deficiency symptoms',
      'Steady delivery without a daily oral estrogen tablet',
      'Multiple strengths so dosing can match your plan',
    ],
    howItWorks:
      'The patch places estradiol on the skin so it can enter circulation gradually. That route skips the digestive tract, which some clinicians prefer for certain patients. Your provider chooses strength, change schedule, and whether other hormones belong in the plan based on your history, goals, and labs when needed.',
    whyPeopleChooseIt: [
      'Seeking relief from menopause-related symptoms under clinical care',
      'Prefer a patch format that is easy to remember',
      'Want clear strength options listed up front',
      'Building a broader women’s hormone plan with follow-up',
    ],
    whatToExpect:
      'Select a patch strength, complete intake, and await review. If approved, apply only as directed — including site rotation and change timing. Symptom improvement varies; report new or concerning symptoms promptly.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Hormone therapy is not appropriate for everyone.',
      'Do not diagnose the customer from storefront copy.',
    ],
  },

  'progesterone-capsules': {
    benefitHeadline: 'Oral Progesterone for Personalized Hormone Balance',
    shortDescription:
      'Progesterone Capsules provide a measured oral dose of progesterone for women in provider-directed hormone therapy. Clinicians often discuss progesterone when building a menopause or hormone plan — sometimes alongside estrogen — to support sleep, cycle-related comfort, and a balanced hormone strategy tailored to you.',
    highlights: [
      'Oral Capsule Convenience',
      'Hormone Plan Building Block',
      '100mg & 200mg Options',
      'Individualized Timing',
    ],
    about: [
      'Progesterone is a hormone involved in the menstrual cycle and is frequently part of menopause and hormone-therapy conversations. Oral capsules make dosing straightforward once your clinician chooses a plan.',
      'Your provider may recommend progesterone for specific clinical reasons — including supporting a combined plan when estrogen is also prescribed. Strength and timing are individualized; never copy someone else’s regimen.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support sleep when evening dosing is part of your plan',
      'May help with cycle- or menopause-related hormone goals defined with your clinician',
      'Familiar capsule format that fits daily routines',
      'Can complement estrogen therapy when a combined plan is recommended',
      'Two strengths for personalized matching',
    ],
    howItWorks:
      'Oral progesterone delivers a measured dose through the digestive system. Timing — often evening — may matter for how you feel. Effects depend on the prescribed regimen, your biology, and whether other hormones are included.',
    whyPeopleChooseIt: [
      'Building or refining a women’s hormone therapy plan',
      'Prefer capsules over other delivery forms',
      'Need a progesterone option that pairs cleanly with estradiol when indicated',
      'Want transparent 100mg and 200mg choices',
    ],
    whatToExpect:
      'Choose a strength, complete intake, and take only as directed if approved. Share sleep, mood, or bleeding changes with your care team so the plan can be refined.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Distinguish from estradiol and testosterone.',
      'Avoid guaranteed symptom-resolution language.',
    ],
  },

  'testosterone-cream': {
    benefitHeadline: 'Topical Testosterone for Energy, Libido & Hormone Goals',
    shortDescription:
      'Testosterone Cream is a carefully dosed topical option some women discuss when low energy, reduced libido, or other hormone-related changes are part of the clinical picture. Applied to the skin in amounts set by your provider, it belongs in a monitored plan — not as a casual wellness cream.',
    highlights: [
      'Topical Measured Dosing',
      'Libido & Energy Conversations',
      'Personalized Application',
      'Monitored Hormone Care',
    ],
    about: [
      'Testosterone is a hormone involved in desire, energy, muscle, and other body functions. While often associated with men’s health, clinicians may discuss carefully dosed topical testosterone in select women’s care plans when symptoms and labs support that conversation.',
      'Because hormones affect many systems, this option requires individualized review. Not everyone with fatigue or low libido needs testosterone — your provider decides whether it fits.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support libido goals when testosterone is clinically indicated',
      'May help with energy-related hormone goals identified with your clinician',
      'Topical format allows measured, clinician-set application',
      'Fits into a monitored plan with follow-up and labs when needed',
    ],
    howItWorks:
      'The cream delivers testosterone through the skin in amounts selected by your provider. Absorption and response vary by person, site, and dose. Your clinician compares this route with alternatives and decides what monitoring you need over time.',
    whyPeopleChooseIt: [
      'Exploring hormone-related libido or energy concerns with clinical guidance',
      'Prefer a non-injection topical format',
      'Want precise dosing rather than one-size-fits-all products',
      'Ready for follow-up rather than unsupervised use',
    ],
    whatToExpect:
      'After approval, apply only to areas and schedules your provider specifies. Wash hands after use and follow any transfer-prevention guidance. Outcomes are individualized.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Avoid implying testosterone cream is routine for all women.',
      'No guaranteed energy, libido, or body-composition outcomes.',
    ],
  },

  // ===== LONGEVITY & COGNITIVE =====
  'nad-plus': {
    benefitHeadline: 'Cellular Energy Support People Explore for Recovery & Longevity Interest',
    shortDescription:
      'NAD+ is a coenzyme your cells already use to turn nutrients into usable energy. This compounded injectable option is for people curious about energy-focused wellness, recovery, cellular health, and healthy-aging research — delivered under clinical review, without aging-cure claims.',
    highlights: [
      'Cellular Energy Pathways',
      'Recovery-Oriented Interest',
      'Metabolic Wellness Focus',
      'Two Vial Sizes',
    ],
    about: [
      'NAD+ (nicotinamide adenine dinucleotide) is a naturally occurring coenzyme involved in cellular energy production and everyday metabolic processes. Wellness customers often ask about it for energy, recovery, cellular health, metabolic wellness, and healthy-aging research interest.',
      'This listing is a compounded injectable NAD+ option after eligibility review. Knowing NAD+’s biological role is not the same as proving that injections deliver every wellness outcome people hope for. We do not claim NAD+ reverses aging, cures fatigue, or treats disease.',
      'Note: the current catalog offers NAD+ Injection only (two vial sizes) — there is no separate NAD+ nasal spray listing on this storefront.',
    ].join('\n\n'),
    potentialBenefits: [
      'Cellular-energy pathway support under clinical guidance',
      'Recovery- and wellness-oriented conversations after demanding periods',
      'Metabolic wellness interest tied to NAD+’s natural cellular role',
      'Healthy-aging research interest without cure claims',
      'Two vial totals so clinicians can match volume to the plan',
    ],
    howItWorks:
      'In normal biology, NAD+ helps cells convert food into energy and supports many cellular reactions. A compounded injectable delivers NAD+ as directed by your provider. How you feel afterward varies widely — your care team sets expectations that fit you, not a marketing timeline.',
    whyPeopleChooseIt: [
      'Curious about cellular energy and longevity-oriented wellness with oversight',
      'Want transparent vial options instead of vague supplement claims',
      'Prefer clinical screening before starting injectable wellness therapies',
      'Appreciate clear boundaries: interesting biology, individualized results',
    ],
    whatToExpect:
      'Select a vial size, complete intake, and await review. Administration details come from your provider and pharmacy materials if approved. Responses differ; no energy or anti-aging outcome is guaranteed.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [
      'Confirm preferred public claim boundary for NAD+ with medical director.',
    ],
    regulatoryNotes: [
      'No anti-aging cure, disease treatment, lifespan extension, or guaranteed energy claims.',
      'Compounded injectable — do not imply FDA approval of this formulation.',
      'Catalog has NAD+ Injection only — no nasal spray SKU.',
    ],
  },

  selank: {
    benefitHeadline: 'A Calm-Focus Neuropeptide for Stress-Response Research Interest',
    shortDescription:
      'Selank is a research-oriented neuropeptide people discuss when they want support around stress response, emotional steadiness, and calm focus. Interest comes from emerging research — not from an established U.S. anxiety or focus medication claim — and any use here requires clinical review.',
    highlights: [
      'Stress-Response Interest',
      'Calm-Focus Conversations',
      'Neuropeptide Research',
      'Injectable Format',
    ],
    about: [
      'Selank is a synthetic peptide related to research on neuropeptides and stress-response pathways. In wellness settings, people ask about it for calm focus, emotional regulation under pressure, and mental clarity during busy seasons.',
      'Human evidence for these wellness uses is still developing. Selank is not presented here as an established treatment for anxiety disorders or other diagnoses, and it is not the same product as Semax or the Selank + Semax nasal blend.',
    ].join('\n\n'),
    potentialBenefits: [
      'Stress-response research interest under clinical supervision',
      'Calm-focus wellness conversations for high-pressure routines',
      'Emotional-regulation research interest (emerging evidence)',
      'Dedicated Selank injectable — not a combination product',
    ],
    howItWorks:
      'Researchers study Selank in connection with neuropeptide signaling that may influence how the body responds to stress. Storefront copy does not claim a proven mechanism or guaranteed calm. If prescribed, your provider and pharmacy materials explain dosing and what to watch for.',
    whyPeopleChooseIt: [
      'Want to understand Selank before asking a clinician about it',
      'Prefer a single-peptide option focused on calm/stress conversations',
      'Comparing Selank vs Semax honestly before choosing',
      'Value screening before starting research-oriented peptides',
    ],
    whatToExpect:
      'Supplied at the listed strength and vial size. Use only if prescribed. Dosing is clinician-directed — not DIY stacking.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [RESEARCH_FLAG],
    regulatoryNotes: [
      'Emerging/investigational framing; no FDA-established anxiety or cognitive treatment claims.',
    ],
  },

  semax: {
    benefitHeadline: 'A Focus & Clarity Neuropeptide for Cognitive Research Interest',
    shortDescription:
      'Semax is a research-oriented neuropeptide people explore when attention, mental clarity, and cognitive performance are top of mind. Interest is emerging and research-driven — not an established U.S. treatment for ADHD, dementia, or other diagnoses — and use requires clinical review.',
    highlights: [
      'Focus & Attention Interest',
      'Mental Clarity Conversations',
      'Cognitive Research',
      'Injectable Format',
    ],
    about: [
      'Semax is a synthetic peptide discussed in research settings involving neurological signaling, attention, and cognitive performance interest. Wellness customers often compare it with Selank: Selank conversations lean calm/stress; Semax conversations lean focus and clarity.',
      'Neither peptide is guaranteed to deliver those outcomes, and neither replaces dedicated mental-health or neurological care when needed. Semax here is a dedicated injectable — separate from Selank and from the combination nasal spray.',
    ].join('\n\n'),
    potentialBenefits: [
      'Cognitive-performance research interest under supervision',
      'Attention and focus-oriented wellness conversations',
      'Mental-clarity research interest (emerging evidence)',
      'Dedicated Semax injectable for clean comparison shopping',
    ],
    howItWorks:
      'Semax is studied in contexts involving neuropeptide signaling related to attention and cognitive performance. This page does not claim proven cognitive benefits. Your provider decides whether it fits and how it should be used if approved.',
    whyPeopleChooseIt: [
      'Want plain-language education on Semax before a clinical visit',
      'Specifically seeking focus/clarity conversations rather than calm-focus blends',
      'Prefer injectable format when that route fits the plan',
      'Appreciate emerging-evidence honesty',
    ],
    whatToExpect:
      'Injectable vial at the listed strength. Approval and instructions come from your clinician. Do not combine peptides unless directed.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [RESEARCH_FLAG],
    regulatoryNotes: [
      'No established cognitive-disease treatment claims.',
      'Not presented as treatment for ADHD, dementia, or related diagnoses.',
    ],
  },

  'selank-semax-nasal-spray': {
    benefitHeadline: 'Calm Focus + Cognitive Interest — Together in a Nasal Spray',
    shortDescription:
      'This compounded nasal spray pairs Selank and Semax for people who want both stress-response and cognitive research interests in one needle-free format. Selank is often discussed for calm focus; Semax for attention and clarity. Combining them is a convenience choice — not a proven “better together” guarantee.',
    highlights: [
      'Needle-Free Nasal Format',
      'Selank + Semax Blend',
      'Calm + Clarity Interest',
      'Convenient Daily Use',
    ],
    about: [
      'Selank + Semax Blend Nasal Spray delivers both research-oriented neuropeptides in one compounded spray. People may choose it when they want a combined cognitive + stress-response wellness approach without two separate injectables.',
      'Any benefits discussed for Selank or Semax individually remain emerging here as well. This is not presented as an established treatment for anxiety, ADHD, dementia, or other diagnoses.',
    ].join('\n\n'),
    potentialBenefits: [
      'Combined stress-response and cognitive research interest in one product',
      'Needle-free format for people who prefer not to inject',
      'Clear microgram-per-spray labeling from the live catalog',
      'Convenient option when a clinician wants both peptides together',
    ],
    howItWorks:
      'You spray a measured amount into the nose as directed. Catalog strength is listed as micrograms of each peptide per spray. We do not claim proven combined synergy. Your provider explains technique, frequency, and whether a blend fits better than a single peptide.',
    whyPeopleChooseIt: [
      'Want both calm-focus and cognitive conversations covered in one bottle',
      'Prefer nasal delivery over injections',
      'Shopping a combination after learning what each peptide is known for',
      'Still want clinical review before starting',
    ],
    whatToExpect:
      'Nasal spray at the listed strength/size. Use only as prescribed. Follow pharmacy instructions for priming, storage, and dosing.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [RESEARCH_FLAG, 'Confirm preferred public language for combination peptide nasal products.'],
    regulatoryNotes: [
      'Preserve catalog strength (50mcg/50mcg per spray).',
      'No diagnosis-treatment claims; no proven synergy claims.',
    ],
  },

  tesamorelin: {
    benefitHeadline: 'Targeted Growth-Hormone Signaling for Body-Composition Goals',
    shortDescription:
      'Tesamorelin is a peptide that works with the body’s natural growth-hormone signaling pathway. In provider-guided wellness programs, it may be considered for individuals focused on body composition, metabolic wellness, and maintaining lean body composition as part of a personalized treatment plan.',
    highlights: [
      'GHRH Analog Peptide',
      'Body-Composition Focus',
      'Growth-Hormone Signaling',
      '10mg / 2mL Vial',
      'Not a GLP-1',
    ],
    about: [
      'Tesamorelin is a growth hormone–releasing hormone (GHRH) analog. Rather than supplying growth hormone directly, it signals the pituitary gland to increase the body’s own growth-hormone release.',
      'People discuss Tesamorelin when body composition — including abdominal body-composition goals — and metabolic wellness are priorities, and when a clinician believes growth-hormone signaling may belong in the plan. It is a different pathway family from GLP-1 appetite medications like Semaglutide or Tirzepatide.',
      'This listing is a compounded injectable totaling 10 mg in a 2 mL vial (5 mg/mL). Your provider reviews whether it fits your history and goals before anything is dispensed.',
    ].join('\n\n'),
    potentialBenefits: [
      'Body-composition support within an individualized clinical plan',
      'Abdominal body-composition goals discussed with your provider',
      'Growth-hormone signaling without supplying growth hormone directly',
      'Metabolic wellness conversations distinct from GLP-1 appetite medications',
      'Support for maintaining lean body composition when clinically appropriate',
    ],
    howItWorks:
      'As a GHRH analog, Tesamorelin interacts with pathways that encourage the pituitary to release more of the body’s own growth hormone. That signaling is why clinicians may discuss it in body-composition programs. How any one person responds varies. Your provider decides whether this option may fit — and how it should be used if approved. This page does not promise weight loss, belly-fat loss, muscle gain, or anti-aging results.',
    whyPeopleChooseIt: [
      'Focused on body composition rather than appetite-only medications',
      'Want to understand GHRH signaling before a clinical conversation',
      'Prefer a clearly labeled injectable strength and vial size',
      'Value personalized review instead of unsupervised peptide shopping',
    ],
    whatToExpect:
      'One active option: 10 mg total · 5 mg/mL · 2 mL vial for injection as directed. Complete intake after order. Use instructions come from your clinician and pharmacy if approved. Do not self-adjust dosing.',
    importantInformation: [
      DEFAULT_COMPOUNDED_IMPORTANT,
      'This compounded Tesamorelin listing is not marketed as an FDA-approved product. Outcomes are individualized and not guaranteed.',
    ].join(' '),
    reviewFlags: [
      'OWNER RULE: no HIV / HIV-associated lipodystrophy language in any customer-facing Tesamorelin copy.',
      'OWNER RULE: do not claim FDA-approved indication on the Tesamorelin PDP; do not call the compounded MBM product FDA-approved.',
      'MEDICAL DIRECTOR REVIEW REQUIRED = YES — confirm body-composition / GHRH public framing without labeled-indication language.',
      'Owner-approved retail $149.00 (at-cost $83.33).',
    ],
    regulatoryNotes: [
      'Customer-facing HIV references: NONE.',
      'Compounded product called FDA-approved: NO.',
      'Not a GLP-1; no guaranteed weight loss, belly-fat loss, muscle gain, or anti-aging claims.',
    ],
  },

  // ===== RECOVERY & PERFORMANCE =====
  'bpc-157-tb-500': {
    benefitHeadline: 'Recovery-Focused Peptide Blend for Mobility & Training Goals',
    shortDescription:
      'Wolverine pairs BPC-157 and TB-500 — two research-oriented peptides people commonly discuss for recovery, mobility, and exercise-related wellness. Available as capsule or injection after clinical review. Popularity reflects recovery interest; it does not mean injuries are healed or tissue is regenerated as an established clinical result.',
    highlights: [
      'BPC-157 + TB-500',
      'Capsule or Injection',
      'Recovery & Mobility Interest',
      'Exercise-Recovery Conversations',
    ],
    about: [
      'BPC-157 and TB-500 are research-oriented peptides frequently mentioned together in recovery and performance wellness conversations. Interest often centers on tissue-repair pathways, mobility, musculoskeletal comfort, and bouncing back from training stress.',
      'Human evidence and long-term safety information for these wellness uses remain limited and emerging. This listing offers both peptides as a compounded blend — strength listed as “Blend” because exact amounts are set by your provider and pharmacy. It is not presented as FDA-established injury treatment.',
    ].join('\n\n'),
    potentialBenefits: [
      'Recovery-focused research interest under clinical supervision',
      'Mobility and musculoskeletal wellness conversations',
      'Exercise-recovery support discussions after hard training blocks',
      'Choice of capsule or injection to match the care plan',
    ],
    howItWorks:
      'These peptides are studied for possible roles related to tissue-repair pathways and recovery-oriented wellness. The science is still developing — this page does not claim proven healing, tendon repair, or tissue regeneration. If prescribed, your provider sets blend details and how to use the selected form.',
    whyPeopleChooseIt: [
      'Want plain-language education on what BPC-157 and TB-500 are',
      'Looking for a recovery-oriented peptide conversation with oversight',
      'Prefer one blend product with two delivery forms',
      'Appreciate honest emerging-evidence framing',
    ],
    whatToExpect:
      'Choose Capsule or Injection. Exact blend details come from your provider and pharmacy. Do not self-stack peptides or skip professional evaluation of injuries.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [
      RESEARCH_FLAG,
      'Catalog strength is "Blend" only — do not invent mg amounts.',
    ],
    regulatoryNotes: [
      'No guaranteed healing, tissue regeneration, surgical recovery acceleration, or performance enhancement.',
      'Preserve Blend strength language.',
    ],
  },

  // ===== SKIN & HAIR =====
  'tretinoin-cream': {
    benefitHeadline: 'Prescription Retinoid for Clearer Texture & Renewed-Looking Skin',
    shortDescription:
      'Tretinoin Cream is a prescription retinoid people use to support healthier cell turnover — helping with breakouts, smoother-looking texture, uneven tone, and the look of fine lines from sun exposure over time. Multiple strengths let your clinician match treatment to your skin’s tolerance.',
    highlights: [
      'Cell Turnover Support',
      'Acne & Texture Focus',
      'Tone & Fine-Line Interest',
      'Three Strength Options',
    ],
    about: [
      'Tretinoin is a topical vitamin A–related medicine long used in dermatology for acne and skin-renewal goals. Cosmetic uses for texture, tone, and photoaging are common in clinical practice and may sit alongside established acne uses depending on your plan.',
      'Results build with consistent use. Dryness, peeling, or sensitivity can happen — especially at first. Your provider helps pick a strength and routine your skin can handle.',
    ].join('\n\n'),
    potentialBenefits: [
      'May help clear and prevent breakouts with consistent use',
      'Supports smoother-looking skin texture through cell turnover',
      'May improve the look of uneven tone over time',
      'May soften the appearance of fine lines related to photoaging',
      'Three strengths so you can start where your skin can tolerate',
    ],
    howItWorks:
      'Tretinoin encourages skin cells to turn over more regularly — newer skin comes to the surface, which can improve breakouts and texture while explaining temporary dryness. Pair with gentle cleansing and daily sunscreen. Patience beats jumping to a higher strength too soon.',
    whyPeopleChooseIt: [
      'Want prescription-strength retinoid care instead of guessing with cosmetics',
      'Addressing acne and skin-renewal goals in one product family',
      'Prefer clear strength choices with clinical guidance',
      'Building a nighttime skincare routine that actually works',
    ],
    whatToExpect:
      'Select a strength, complete intake, and follow approved directions — usually a thin nighttime layer plus daily SPF. If irritation appears, contact your care team rather than pushing through a stronger dose on your own.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Distinguish medical acne uses from cosmetic appearance benefits where needed.',
      'No guaranteed wrinkle-erasure claims.',
    ],
  },

  'minoxidil-topical': {
    benefitHeadline: 'Personalized Topical Hair Support Built Around Minoxidil',
    shortDescription:
      'This compounded topical features minoxidil — a medicine commonly used to support hair growth and follicle activity for thinning-hair concerns. Your clinician and pharmacy personalize the combination formula; companion ingredients are not listed as a fixed consumer recipe on this page.',
    highlights: [
      'Minoxidil Hair Support',
      'Follicle Activity Focus',
      'Compounded & Personalized',
      'At-Home Topical Routine',
    ],
    about: [
      'Minoxidil is widely used in hair-care plans for people concerned about thinning. My Bare Method offers a compounded combination topical that includes minoxidil, with any companion ingredients determined clinically rather than published as a fixed storefront formula.',
      'Ask your care team for the exact ingredients in your bottle. We do not invent a secret ingredient list here.',
    ].join('\n\n'),
    potentialBenefits: [
      'Hair-growth support when a topical approach is appropriate',
      'May support follicle activity as part of a thinning-hair plan',
      'Personalized compounding instead of one-size-fits-all aisle products',
      'Convenient at-home scalp routine with clinical follow-up available',
    ],
    howItWorks:
      'Minoxidil is commonly used to support hair-care treatment applied to the scalp. Your compounded formula delivers medication as directed. We do not claim a specific amount of regrowth or a fixed timeline — ask what realistic expectations look like for your formula.',
    whyPeopleChooseIt: [
      'Want prescription guidance for thinning hair',
      'Prefer topical care over oral options when recommended',
      'Value personalization when combination ingredients matter',
      'Ready for follow-up if the plan needs adjusting',
    ],
    whatToExpect:
      'Supplied as a topical bottle after approval. Apply only as directed. Consistency matters; visible changes, if any, take time and vary by person.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [
      'Exact combination ingredients beyond minoxidil are not defined in catalog — do not invent them. Owner/formulary review if public ingredient list is desired.',
    ],
    regulatoryNotes: [
      'Preserve “Combination formula” strength language.',
      'No guaranteed hair-growth amount or timeline.',
    ],
  },

  'bimatoprost-solution': {
    benefitHeadline: 'Fuller-Looking Lashes & Brows With Prescription Bimatoprost',
    shortDescription:
      'Lash/Brow Growth Serum is a prescription topical featuring bimatoprost 0.03% (2.5 mL). Bimatoprost can influence the hair-growth cycle of lashes — and, when your clinician considers it appropriate, brows — so many people use it for fuller, longer-looking lashes with consistent, careful application.',
    highlights: [
      'Bimatoprost 0.03%',
      'Lash Growth Cycle Support',
      'Brow Conversations When Appropriate',
      'Targeted Line Application',
    ],
    about: [
      'The customer-facing name is Lash/Brow Growth Serum. The formulation is Bimatoprost Solution 0.03% / 2.5 mL. Bimatoprost is a prostaglandin analog used in clinical practice for effects related to eyelash growth when applied along the lash line as directed.',
      'Brow-appearance use should be framed as clinician-directed and may sit outside the most common labeled lash use depending on your plan. Share eye history during intake so appropriateness can be screened.',
    ].join('\n\n'),
    potentialBenefits: [
      'May support fuller, longer-looking eyelashes with consistent use',
      'May be discussed for brow-appearance goals when clinically appropriate',
      'Prescription pathway instead of unverified cosmetic serums',
      'Targeted application along the lash or brow line as instructed',
    ],
    howItWorks:
      'Bimatoprost can influence the growth phase of eyelash hairs for some users, which may lead to longer or fuller-looking lashes over weeks of consistent use. Changes are gradual and vary. Your provider and pharmacy materials explain exact technique — this is not a general face serum.',
    whyPeopleChooseIt: [
      'Want the real active (bimatoprost) behind the Lash/Brow Growth Serum name',
      'Prefer prescription screening for eye-area products',
      'Seeking a clearer alternative to over-the-counter lash serums',
      'Ready to follow precise application instructions',
    ],
    whatToExpect:
      'Bottle at 0.03%, 2.5 mL. Use the applicator method from your pharmacy and provider. Report eye irritation promptly. Dramatic results are not guaranteed.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    reviewFlags: [
      'Display name remains Lash/Brow Growth Serum; formulation remains Bimatoprost Solution (slug/SKU/price unchanged).',
    ],
    regulatoryNotes: [
      'No guaranteed dramatic lash or brow results.',
      'Preserve slug bimatoprost-solution, SKU MBM-SH-BIM-SOL-001, price $89.',
      'Brow use: clinician-directed; may be off-label depending on plan.',
    ],
  },

  // ===== PROVIDER CARE =====
  'initial-provider-consultation': {
    benefitHeadline: 'Your First Clinical Conversation — Clear Goals, Clear Next Steps',
    shortDescription:
      'The Initial Provider Visit is dedicated time with a licensed clinician to review your goals, health history, and whether treatment options make sense for you. It is the right starting point when you want guidance before committing to a medication or membership — and it does not guarantee a prescription.',
    highlights: [
      'Personalized First Visit',
      'Goals & History Review',
      'Treatment Fit Assessment',
      'Clear Next Steps',
    ],
    about: [
      'This is a consultation service — not a medication. You and your provider discuss what you want to work on, review relevant history, and map sensible next steps.',
      'Under current care workflows, an initial visit may be required when appropriate for a customer’s first treatment or order. Next steps might include labs, a follow-up, a product discussion, or no medication at all. Scheduling is handled through the care team’s normal process — this page does not claim automatic third-party scheduling.',
    ].join('\n\n'),
    potentialBenefits: [
      'Start care with a clear clinical conversation instead of guessing',
      'Understand which options may fit before you buy a medication or membership',
      'Ask questions about expectations, side effects, and timelines',
      'Learn whether labs or a follow-up should come next',
    ],
    howItWorks:
      'After purchase, you complete intake and meet with a licensed provider. Together you review goals and history. Prescribing happens only if clinically appropriate — evaluation and prescribing are separate steps.',
    whyPeopleChooseIt: [
      'New to My Bare Method and want a guided start',
      'Comparing weight-management, hormone, or wellness options',
      'Prefer clinical clarity before spending on medication',
      'Transparent session pricing for a defined first visit',
    ],
    whatToExpect:
      'One consultation session ($75). Bring medications, allergies, and goal priorities. Any prescription fulfillment is a separate step after approval.',
    importantInformation:
      'Provider Care services require scheduling and medical intake as applicable. Purchasing a visit does not guarantee medication approval.',
  },

  'follow-up-appointment': {
    benefitHeadline: 'Check In, Adjust, and Keep Your Plan Working for You',
    shortDescription:
      'A Follow-Up Visit gives you focused time to review progress, talk through side effects, and refine treatment with a licensed provider. It is used when ongoing review is needed — including dose changes or other qualifying follow-up — not as an automatic refill button.',
    highlights: [
      'Progress & Side-Effect Review',
      'Dose-Change Conversations',
      'Plan Refinement',
      'Shared Decision-Making',
    ],
    about: [
      'Follow-up keeps care personal. Bring updates on how you feel, what is working, and what is not. Your provider may continue, modify, pause, or stop a treatment based on what they learn.',
      'This visit supports shared decision-making when provider review is required for a dose change or other qualifying follow-up. It does not guarantee continued prescribing.',
    ].join('\n\n'),
    potentialBenefits: [
      'Fine-tune treatment after real-world experience on a plan',
      'Space to discuss side effects and lifestyle questions',
      'Safer decisions before changing dose or formulation',
      'Keeps your care relationship active and informed',
    ],
    howItWorks:
      'You meet with a provider who reviews your interval history and current plan. Together you decide on next steps. Medication changes still require clinical judgment and pharmacy coordination when applicable.',
    whyPeopleChooseIt: [
      'Starting a new therapy and want a structured check-in',
      'Considering a dose change that requires clinical review',
      'Goals or life circumstances have shifted',
      'Prefer a focused session over starting from scratch',
    ],
    whatToExpect:
      'One follow-up session ($55). Have questions ready. Lab results may be part of the discussion if ordered.',
    importantInformation:
      'Follow-up does not guarantee continued prescribing. Recommendations depend on safety and appropriateness.',
  },

  'laboratory-review': {
    benefitHeadline: 'Turn Lab Numbers Into a Clear, Actionable Plan',
    shortDescription:
      'Laboratory Review is a provider visit focused on interpreting your results in plain language and recommending sensible next steps. Ideal when you already have labs and want clinical context before adjusting hormones, metabolic care, or other therapies.',
    highlights: [
      'Plain-Language Interpretation',
      'Personalized Takeaways',
      'Informed Next Steps',
      'No Automatic Prescription',
    ],
    about: [
      'This service focuses on interpretation and guidance based on results available for review. It does not automatically include ordering new labs or prescribing medication.',
      'Bring the questions that matter — energy, hormones, metabolic markers, or anything your clinician should prioritize — so the visit matches how labs are used in the current workflow.',
    ].join('\n\n'),
    potentialBenefits: [
      'Understand which results matter for your goals',
      'Clarify whether more testing is needed',
      'Make smarter decisions about continuing or changing a plan',
      'Reduce confusion from portal printouts without clinical context',
    ],
    howItWorks:
      'Your provider reviews submitted or available results, explains plain-language takeaways, and recommends follow-up actions. Treatment changes remain separate clinical decisions.',
    whyPeopleChooseIt: [
      'Already have recent labs and want expert interpretation',
      'Preparing to adjust hormone or metabolic therapies',
      'Prefer a focused lab session over a generic consult',
      'Transparent pricing for interpretation time',
    ],
    whatToExpect:
      'One laboratory-review session ($55). Ensure results are available to the care team as instructed.',
    importantInformation:
      'Lab review does not guarantee a prescription or a specific treatment.',
  },

  // ===== ACCESSORIES =====
  'complete-injection-starter-kit': {
    benefitHeadline: 'Your Injection Day Essentials — Organized in One Bundle',
    shortDescription:
      'The Complete Injection Starter Kit gathers storage, travel, prep, and disposal accessories into one checkout so you can start an injectable routine without hunting down each item separately.',
    highlights: [
      'All-in-One Bundle',
      'Storage + Travel',
      'Prep & Disposal',
      'Routine-Ready',
    ],
    about: [
      'What it is: a supplies bundle — not a medication. Why it’s useful: new injectable routines feel easier when organization tools arrive together.',
      'What’s included (catalog): 3D printed peptide case, temperature-controlled travel case, discreet travel bag, reusable ice pack, wellness planner, sharps container, alcohol prep wipes, and insulin syringes. How it fits your routine: use it as day-one setup; prescription products are sold separately.',
    ].join('\n\n'),
    potentialBenefits: [
      'Saves time versus buying accessories one by one',
      'Helps new injectable routines feel organized from day one',
      'Covers storage, travel, prep, and disposal basics',
      'Thoughtful setup gift for someone starting supervised injectable care',
    ],
    howItWorks:
      'Each item supports a practical piece of an injection routine — organizing vials, traveling more comfortably, prepping skin, tracking habits, or disposing of sharps safely.',
    whyPeopleChooseIt: [
      'One bundle instead of eight separate decisions',
      'Ideal first-setup purchase for injectable wellness routines',
      'Pairs naturally with medication orders',
    ],
    whatToExpect:
      'You receive the kit components listed in the catalog. Individual item details match the standalone accessory listings.',
    importantInformation:
      'Accessories are wellness tools and supplies — not medications.',
    reviewFlags: [
      'Kit contents taken from catalog — do not add unverified extra items.',
    ],
  },

  'premium-3d-printed-peptide-case': {
    benefitHeadline: 'Protect and Organize Vials, Syringes & Day-Of Supplies',
    shortDescription:
      'A custom 3D-printed case with compartments designed to hold peptide vials, syringes, and related supplies so your kit stays neat at home or inside a larger travel bag.',
    highlights: [
      'Organized Compartments',
      'Vial Protection',
      'Travel-Friendly',
      'Daily-Kit Ready',
    ],
    about: [
      'What it is: a purpose-built organizer shell. Why it’s useful: keeps fragile glass from bouncing loosely in a drawer or tote.',
      'What’s included: one case. How it fits your routine: daily organizer or insert inside a travel bag. It does not replace refrigeration rules when cold storage is required.',
    ].join('\n\n'),
    potentialBenefits: [
      'Reduces clutter around vials and syringes',
      'Simplifies grab-and-go packing',
      'Helps protect glass from loose bag bounce',
    ],
    howItWorks:
      'Place vials and compatible supplies into the molded compartments.',
    whyPeopleChooseIt: [
      'Purpose-built for injectable supply organization',
      'Lightweight everyday companion',
      'Complements insulated cases rather than replacing them',
    ],
    whatToExpect:
      'One case as listed. Follow pharmacy storage rules separately.',
    importantInformation:
      'Accessories are wellness tools and supplies — not medications.',
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
      'What it is: an insulated carrier with thermal lining. Why it’s useful: buffers vials better than a standard tote during travel.',
      'What’s included: one insulated case. How it fits your routine: load vials, add cold packs when appropriate, keep closed in transit. No guaranteed hold-time is published — pharmacy instructions remain the authority.',
    ].join('\n\n'),
    potentialBenefits: [
      'Helps vials travel more comfortably than a standard tote',
      'Works well with a reusable ice pack',
      'Useful for weekends away, flights, or long commute days',
    ],
    howItWorks:
      'Load vials, add cold packs when appropriate, and keep the case closed while in transit.',
    whyPeopleChooseIt: [
      'Need better temperature buffering for injectable travel',
      'Complements — rather than replaces — pharmacy storage guidance',
      'Popular pairing with starter-kit components',
    ],
    whatToExpect:
      'One insulated case. Add cold packs as needed. No guaranteed hold-time on this page.',
    importantInformation:
      'Accessories are wellness tools and supplies — not medications.',
    reviewFlags: [
      'Prior catalog “up to 48 hours” claim remains removed pending owner verification.',
    ],
    regulatoryNotes: [
      'No guaranteed temperature-hold duration in customer copy.',
    ],
  },

  'discreet-travel-bag': {
    benefitHeadline: 'Carry Your Wellness Kit Without Looking Clinical',
    shortDescription:
      'A sleek travel bag with water-resistant lining designed to hold vials, cases, and day-of supplies discreetly — whether you are commuting or heading through an airport.',
    highlights: [
      'Discreet Everyday Look',
      'Water-Resistant Lining',
      'Kit-Friendly Capacity',
      'Travel Ready',
    ],
    about: [
      'What it is: a low-key everyday bag for therapy-related accessories. Why it’s useful: carries your kit without looking clinical.',
      'What’s included: one travel bag (vegan-leather look with water-resistant lining per catalog; exact dimensions not listed). How it fits your routine: outer bag for insert cases, ice packs, and day-of supplies.',
    ].join('\n\n'),
    potentialBenefits: [
      'Keeps your routine organized while traveling',
      'Avoids an overly medical-looking bag aesthetic',
      'Works as the outer bag for insert cases and ice packs',
    ],
    howItWorks:
      'Pack cases, vials (as appropriate), and day-of supplies inside as your dedicated wellness travel bag.',
    whyPeopleChooseIt: [
      'Style-forward alternative to clear medical pouches',
      'Practical lining for real travel days',
      'Pairs with insulated and 3D-printed insert cases',
    ],
    whatToExpect:
      'One travel bag as listed.',
    importantInformation:
      'Accessories are wellness tools and supplies — not medications.',
  },

  'reusable-ice-pack': {
    benefitHeadline: 'Reusable Cold Support for On-the-Go Vials',
    shortDescription:
      'A reusable gel ice pack intended to help keep peptide vials cooler during transport when paired with an insulated case or travel bag.',
    highlights: [
      'Reusable Gel Pack',
      'Travel Cold Support',
      'Kit Essential',
      'Easy to Freeze',
    ],
    about: [
      'What it is: a reusable gel ice pack. Why it’s useful: adds cold support inside an insulated travel case.',
      'What’s included: one pack. How it fits your routine: freeze ahead of travel and pack beside vials per your case design and pharmacy guidance.',
    ].join('\n\n'),
    potentialBenefits: [
      'Adds cold support inside an insulated travel case',
      'Handy backup for weekend bags',
      'Reusable for ongoing travel routines',
    ],
    howItWorks:
      'Freeze fully, then place in your case or bag.',
    whyPeopleChooseIt: [
      'Inexpensive essential for temperature-sensitive travel',
      'Works with My Bare Method insulated cases',
    ],
    whatToExpect:
      'One reusable ice pack. Freeze before use.',
    importantInformation:
      'Accessories are wellness tools and supplies — not medications.',
  },

  'daily-weekly-wellness-planner': {
    benefitHeadline: 'Track Habits, Consistency & How You Feel',
    shortDescription:
      'A daily and weekly planner with habit trackers and reflection space designed around wellness routines — including therapy check-ins if you like written logs.',
    highlights: [
      'Habit Tracking',
      'Weekly Planning',
      'Reflection Space',
      'Routine Support',
    ],
    about: [
      'What it is: a paper wellness planner. Why it’s useful: consistency is easier when you can see it.',
      'What’s included: one planner. How it fits your routine: map goals, habits, and notes between visits. Not a medical device.',
    ].join('\n\n'),
    potentialBenefits: [
      'Stay accountable to daily and weekly wellness habits',
      'Create a simple log you can bring to follow-up visits',
      'Reflect without needing another app',
    ],
    howItWorks:
      'Use daily/weekly spreads to plan, track, and review doses, meals, movement, mood, or whatever your routine needs.',
    whyPeopleChooseIt: [
      'Prefer paper clarity over digital clutter',
      'Want purpose-built wellness framing',
    ],
    whatToExpect:
      'One planner as listed.',
    importantInformation:
      'Accessories are wellness tools and supplies — not medications.',
  },

  'sharps-container': {
    benefitHeadline: 'Safer Home Disposal for Used Syringes & Needles',
    shortDescription:
      'An FDA-cleared sharps container for disposing of used syringes and needles at home — secure, puncture-resistant, and built for responsible end-of-use handling.',
    highlights: [
      'FDA-Cleared',
      'Puncture-Resistant',
      'Home Disposal',
      'Kit Essential',
    ],
    about: [
      'What it is: a puncture-resistant sharps disposal container. Why it’s useful: used sharps do not belong in household trash bags.',
      'What’s included: one container. How it fits your routine: drop used syringes/needles point-first until full, then follow local drop-off rules.',
    ].join('\n\n'),
    potentialBenefits: [
      'Keeps used sharps out of regular trash',
      'Supports safer home injection routines',
      'Completes a responsible injectable supply kit',
    ],
    howItWorks:
      'Drop used syringes/needles point-first. Fill only to the indicated line. Do not force items or empty a used container.',
    whyPeopleChooseIt: [
      'Essential companion to syringe purchases',
      'Clear FDA-cleared positioning from catalog copy',
    ],
    whatToExpect:
      'One container. Follow community guidelines for sharps drop-off when full.',
    importantInformation:
      'Accessories are wellness tools and supplies. Follow local disposal rules when full.',
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
      '200 or 500 Count',
      'Everyday Kit Staple',
    ],
    about: [
      'What it is: individually wrapped 70% IPA prep pads. Why it’s useful: a quick wipe helps injection routines feel cleaner and more consistent.',
      'What’s included: a box at the count you select. How it fits your routine: wipe the site as directed, let dry if instructed, then inject.',
    ].join('\n\n'),
    potentialBenefits: [
      'Convenient single-use prep pads',
      'Stock options for lighter or heavier routines',
      'Easy to stash in a travel bag or home kit',
    ],
    howItWorks:
      'Open a pad, wipe the site as directed, allow skin to dry if instructed, discard after one use.',
    whyPeopleChooseIt: [
      'Clear 200 vs 500 count choices',
      'Familiar 70% IPA prep standard',
      'Affordable refill item',
    ],
    whatToExpect:
      'Box of individually wrapped pads at the count you select.',
    importantInformation:
      'Accessories are wellness tools and supplies — not medications.',
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
      'What it is: insulin syringes for subcutaneous injectable routines when recommended. Why it’s useful: flexible pack sizes for light or frequent use.',
      'What’s included: one pack at the count you select. Needle gauge and barrel markings are not listed in the live catalog — check packaging or ask your care team. How it fits your routine: use with alcohol wipes; dispose in a sharps container.',
    ].join('\n\n'),
    potentialBenefits: [
      'Flexible pack sizes for light or frequent use',
      'Straightforward refill shopping',
      'Pairs cleanly with alcohol wipes and a sharps container',
    ],
    howItWorks:
      'Select the pack count that matches your routine, confirm package specs on arrival, dispose of used syringes properly.',
    whyPeopleChooseIt: [
      'Ten pack-count options on one page',
      'Clear separation between pack size and cart quantity',
      'Essential companion to injectable wellness plans',
    ],
    whatToExpect:
      'One pack at the count selected. Confirm gauge and markings on the package before use.',
    importantInformation:
      'Accessories are wellness tools and supplies — not medications. Use only the syringe type your provider or pharmacy recommends.',
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
    benefitHeadline: 'One Flat Monthly Rate for Semaglutide Care',
    shortDescription:
      'Semaglutide Membership is a $149/month program for Semaglutide + B6 care within the included dose range. You enroll in a membership PROGRAM — medication fulfillment uses the matching retail vial for your approved dose. Predictable pricing; clinical review still applies.',
    highlights: [
      '$149 / Month Flat Rate',
      'Included Dose Range',
      '3-Month Minimum',
      'Member Product Savings',
    ],
    about: [
      'This is a membership PROGRAM purchase — not a one-off retail vial checkout. Your monthly rate stays predictable while you remain continuously enrolled and treatment stays within included Semaglutide formulations (0.5mg, 1mg, 2.5mg, 5mg).',
      'You share a requested dose at join. Your licensed provider still decides whether treatment is appropriate and which dose is approved. Medication fulfillment uses the matching retail Semaglutide vial SKU. Program membership and medication dose/fulfillment are related but distinct.',
    ].join('\n\n'),
    potentialBenefits: [
      'Predictable $149 monthly program pricing',
      'Clinical adjustments within included Semaglutide options while enrolled',
      'Locked rate while membership stays continuously active and in good standing',
      'Save 15% on other eligible wellness products and accessories per program terms',
      'Priority access to new wellness products',
    ],
    howItWorks:
      'Enroll in the membership PROGRAM and select a requested dose. After clinical review, approved medication is fulfilled using the corresponding retail Semaglutide vial SKU. Your membership price remains flat while you stay continuously enrolled. Credit/debit card enrollment charges the monthly membership rate on a recurring schedule while active; a 3-month minimum commitment applies. First medication shipment shipping is arranged after approval and is not part of the recurring membership price.',
    whyPeopleChooseIt: [
      'Prefer flat monthly budgeting over paying per retail vial strength',
      'Want ongoing Semaglutide care with a clear program maximum',
      'Value member savings on eligible add-on products',
      'Appreciate clear separation between program membership and medication fulfillment',
    ],
    whatToExpect:
      'Initial term is 3 months, then month to month. Complete intake, await clinical review, and complete card enrollment for recurring membership billing. Requested dose is not automatically the approved dose. Payment does not guarantee a prescription.',
    importantInformation:
      'Membership enrollment and payment do not guarantee a prescription. Availability depends on clinical judgment, pharmacy fulfillment, and applicable requirements.',
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
      'Membership payment copy aligned to current card recurring enrollment (copy only).',
      'Do not alter Tagada recurring priceIds or fulfillment SKU logic.',
    ],
  },

  'tirzepatide-membership': {
    benefitHeadline: 'Flat Monthly Tirzepatide Care Through the Included Maximum',
    shortDescription:
      'Tirzepatide Membership is a $249/month program for Tirzepatide + B6 care through the included dose maximum (formulations through 15mg). You enroll in a membership PROGRAM — medication fulfillment uses the matching retail vial for your approved dose.',
    highlights: [
      '$249 / Month Flat Rate',
      'Through 15mg Maximum',
      '3-Month Minimum',
      'Member Product Savings',
    ],
    about: [
      'This membership is a PROGRAM purchase with one predictable monthly rate through the included Tirzepatide maximum (2.5mg, 7.5mg, 12.5mg, 15mg). It is not interchangeable with Semaglutide Membership, and 30mg is not part of this program.',
      'You choose a requested dose when joining. A licensed provider reviews eligibility and may approve a different dose. Fulfillment uses the retail Tirzepatide vial SKU that matches the approved strength. Program membership and medication dose/fulfillment are related but distinct.',
    ].join('\n\n'),
    potentialBenefits: [
      'Predictable $249 monthly program pricing through the included maximum',
      'Clinical adjustments within listed Tirzepatide formulations while enrolled',
      'Locked rate while membership stays continuously active and in good standing',
      'Save 15% on other eligible wellness products and accessories per program terms',
      'Priority access to new wellness products',
    ],
    howItWorks:
      'Enrollment purchases the membership PROGRAM. Requested dose informs intake; approved treatment drives which retail fulfillment SKU is used. Your $249 rate remains locked while membership stays continuously active and within program rules. Credit/debit card enrollment charges the monthly membership rate on a recurring schedule while active; a 3-month minimum commitment applies. First medication shipment shipping is arranged after approval and is not part of the recurring membership price.',
    whyPeopleChooseIt: [
      'Want Tirzepatide’s dual-pathway option with flat monthly budgeting',
      'Prefer a clear included maximum through 15mg',
      'Value member savings on eligible products and accessories',
      'Appreciate clear separation between program membership and medication fulfillment',
    ],
    whatToExpect:
      'Initial term is 3 months, then month to month. Complete intake, complete clinical review, and complete card enrollment for recurring membership billing. Payment does not guarantee a prescription.',
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
      'Distinguish PROGRAM SKU vs FULFILLMENT SKU.',
      'Membership payment copy aligned to current card recurring enrollment (copy only).',
      'Do not alter Tagada recurring priceIds or fulfillment SKU logic.',
    ],
  },
};

export function paragraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean);
}
