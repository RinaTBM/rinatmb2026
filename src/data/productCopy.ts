/**
 * Customer-facing product copy — structured for scannable product pages.
 * Sourced separately from commerce identity (IDs, prices, variants, SKUs).
 * Do not invent formulations, materials, or regulatory status not supported by the catalog.
 */

export interface ProductCopy {
  shortDescription: string;
  /** About This Product — one or more paragraphs separated by blank lines. */
  about: string;
  commonUses?: string[];
  howItWorks?: string;
  whatToExpect?: string;
  importantInformation?: string;
  /** Notes for docs/product-description-review.md — not rendered to customers. */
  reviewFlags?: string[];
  regulatoryNotes?: string[];
}

export interface MembershipCopy {
  shortDescription: string;
  about: string;
  commonUses?: string[];
  howItWorks?: string;
  whatToExpect?: string;
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
  'Emerging / research-oriented peptide wellness use — avoid presenting as established FDA-approved therapy for specific diagnoses; owner/provider should confirm public-facing regulatory framing.';

export const PRODUCT_COPY: Record<string, ProductCopy> = {
  // ===== WEIGHT MANAGEMENT =====
  semaglutide: {
    shortDescription:
      'A once-weekly-style injectable medication option that pairs semaglutide with vitamin B6, offered as part of provider-directed weight-management care.',
    about: [
      'Semaglutide + B6 Injection is a provider-guided weight-management option built around semaglutide, a medicine that acts on pathways involved in appetite and blood-sugar regulation. Our formulation also includes vitamin B6 as part of the compounded injectable preparation.',
      'People often explore this option when lifestyle changes alone have not been enough, or when a licensed provider recommends medication support as part of a broader plan. Treatment is individualized — purchasing starts a review process; it does not automatically mean a prescription will be issued.',
      'This page describes the retail injectable product. If you prefer a flat monthly program instead, see Semaglutide Membership.',
    ].join('\n\n'),
    commonUses: [
      'May be prescribed to support weight-management goals under licensed-provider care',
      'Commonly used when a provider wants a GLP-1 medication option that can help with appetite and fullness',
      'A provider may consider this alongside nutrition, activity, and follow-up monitoring',
      'May be discussed when blood-sugar regulation support is also relevant to your overall plan',
    ],
    howItWorks:
      'Semaglutide works with GLP-1 receptors involved in appetite and blood-sugar regulation. In everyday terms, it can help you feel full sooner and stay satisfied longer, which may make it easier to reduce overall food intake. Individual responses vary, and your provider decides whether this approach fits your health history.',
    whatToExpect:
      'This product is supplied as an injection (vial options by strength). A licensed provider reviews your intake before anything is dispensed and determines whether treatment is appropriate, which strength to use, and how often to take it. Do not change your dose on your own. Follow the instructions provided with your prescription and by your care team.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Do not claim FDA approval for this specific compounded Semaglutide + B6 product page.',
      'No guaranteed weight-loss amount.',
    ],
  },

  tirzepatide: {
    shortDescription:
      'A provider-directed injectable weight-management option that pairs tirzepatide with vitamin B6 for appetite and metabolic support under clinical review.',
    about: [
      'Tirzepatide + B6 Injection is a provider-guided weight-management option. Tirzepatide acts on two related pathways (often described as GLP-1 and GIP) involved in appetite, fullness, and blood-sugar regulation. Vitamin B6 is included as part of this compounded injectable preparation.',
      'Compared with semaglutide alone, tirzepatide engages an additional pathway. That does not mean one is automatically “better” for everyone — a licensed provider helps decide which option, if any, fits your goals and medical history.',
      'This page is for the retail injectable product. For a flat monthly program through the included dose range, see Tirzepatide Membership.',
    ].join('\n\n'),
    commonUses: [
      'May be prescribed for provider-directed weight-management support',
      'Commonly considered when a dual-pathway (GLP-1/GIP) medication option is appropriate',
      'May help with appetite control and feeling satisfied after meals as part of a supervised plan',
      'A provider may pair this with lifestyle guidance and ongoing check-ins',
    ],
    howItWorks:
      'Tirzepatide works with receptors involved in appetite and blood-sugar regulation (GLP-1 and GIP pathways). Many people experience stronger feelings of fullness and reduced interest in large portions, which may support calorie reduction over time. Results vary. Your provider sets expectations based on your individual plan.',
    whatToExpect:
      'Supplied as an injection in vial strengths selected on this page. After you order, you complete intake and a licensed provider reviews eligibility. Exact dose, titration schedule, and follow-up are determined by the provider — not by the storefront selection alone.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Do not claim FDA approval for this specific compounded Tirzepatide + B6 product.',
      'Distinguish clearly from Semaglutide; products are not interchangeable.',
      'No guaranteed weight-loss amount.',
    ],
  },

  // ===== WOMEN'S HORMONE THERAPY =====
  'estradiol-patch': {
    shortDescription:
      'A skin patch that delivers estradiol — a form of estrogen — as part of provider-directed hormone therapy.',
    about: [
      'The Estradiol Patch is a transdermal (through-the-skin) way to receive estradiol, a primary form of estrogen. Patches are designed to release hormone steadily across the wear period selected by your provider.',
      'Providers may discuss estrogen therapy when evaluating symptoms related to menopause or other hormone changes. Whether a patch is right for you depends on your history, labs when needed, and clinical judgment — it is not a one-size-fits-all solution.',
    ].join('\n\n'),
    commonUses: [
      'May be prescribed as part of menopause or hormone-therapy care',
      'A provider may consider a patch when a steady, through-the-skin delivery method is preferred',
      'Commonly discussed for symptoms a clinician associates with low estrogen, when clinically appropriate',
      'May be used alongside other therapies (such as progesterone) when your provider recommends a combined plan',
    ],
    howItWorks:
      'Estradiol is a form of estrogen your body already recognizes. The patch delivers it through the skin into circulation so levels can be supported without an oral tablet. Your provider chooses strength and wear schedule based on your needs.',
    whatToExpect:
      'You select among available patch strengths and pack sizes on this page. Apply only as directed after provider approval. Skin placement, rotation, and change frequency are part of your personalized instructions — do not share patches or adjust strength without guidance.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Hormone therapy is not appropriate for everyone; avoid universal benefit claims.',
      'Do not promise “hormone balancing” outcomes.',
    ],
  },

  'progesterone-capsules': {
    shortDescription:
      'Oral progesterone capsules prescribed as part of individualized, provider-directed hormone therapy.',
    about: [
      'Progesterone Capsules provide an oral form of progesterone used in provider-guided hormone care. Progesterone is a hormone involved in the menstrual cycle and is often discussed alongside estrogen therapy.',
      'Your provider may recommend progesterone for specific clinical reasons — for example, as part of a combined hormone plan. Capsule strength and timing are individualized and should never be copied from someone else’s regimen.',
    ].join('\n\n'),
    commonUses: [
      'May be prescribed as part of menopause or hormone-therapy protocols',
      'Commonly considered when a provider wants oral progesterone as part of a treatment plan',
      'A provider may use this alongside estrogen therapy when clinically indicated',
      'May support goals your clinician defines after reviewing your history and, when needed, labs',
    ],
    howItWorks:
      'Progesterone is a hormone your body produces naturally. Capsules deliver a measured oral dose so your provider can support hormone therapy goals with a form that is straightforward to take. Effects and timing depend on your prescribed plan.',
    whatToExpect:
      'Available in capsule strengths listed on this page. Take only as directed after a licensed provider approves treatment. Timing (for example, evening dosing) may be part of your instructions — follow your prescription label.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Distinguish from estradiol and testosterone — not interchangeable.',
      'Avoid guaranteed symptom-resolution language.',
    ],
  },

  'testosterone-cream': {
    shortDescription:
      'A topical testosterone cream used in provider-directed hormone therapy when clinically appropriate.',
    about: [
      'Testosterone Cream is a topical (on-the-skin) preparation of testosterone for provider-guided care. While testosterone is often associated with men’s health, clinicians may also discuss carefully dosed testosterone as part of certain women’s hormone plans when appropriate.',
      'Because hormones affect many systems, this option requires individualized review. Strength, application site, and monitoring are determined by your provider — not by browsing alone.',
    ].join('\n\n'),
    commonUses: [
      'May be prescribed when a provider identifies a clinical need for topical testosterone',
      'A provider may consider this as part of a broader hormone-therapy plan',
      'Commonly discussed only after history review and, when indicated, laboratory evaluation',
      'May support goals defined by your clinician; it is not a general wellness cream for unsupervised use',
    ],
    howItWorks:
      'Testosterone is a hormone involved in energy, libido, muscle, and other body functions. A cream delivers a measured amount through the skin. Your provider selects whether this route and dose make sense compared with other options.',
    whatToExpect:
      'Supplied as a cream at the strength and size shown on this page. Apply only to areas and schedules your provider specifies. Wash hands after use and follow any transfer-prevention guidance included with your prescription.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Avoid implying testosterone cream is routine or appropriate for all women.',
      'No guaranteed energy, libido, or body-composition outcomes.',
    ],
  },

  // ===== LONGEVITY & COGNITIVE =====
  'nad-plus': {
    shortDescription:
      'A provider-directed compounded NAD+ injection that some people explore as part of longevity-focused wellness care.',
    about: [
      'NAD+ (nicotinamide adenine dinucleotide) is a molecule cells use in energy-related processes. This product is a compounded injectable NAD+ option available only after a licensed provider reviews your eligibility.',
      'Interest in NAD+ often comes from wellness and longevity conversations. Evidence and clinical practice continue to evolve, so we describe this carefully: it may be considered as part of a supervised plan, not as a proven “anti-aging cure.”',
    ].join('\n\n'),
    commonUses: [
      'A provider may consider NAD+ injection as part of a longevity-oriented wellness plan',
      'May be discussed when someone is exploring cellular-energy support under clinical guidance',
      'Commonly paired with intake review and clear expectations about what is (and is not) established',
      'Not a substitute for evaluation of fatigue, sleep, or medical conditions that need diagnosis',
    ],
    howItWorks:
      'NAD+ participates in cellular processes tied to energy metabolism. Injectable forms deliver NAD+ under a provider’s direction. How you feel afterward varies widely; your care team should set realistic expectations.',
    whatToExpect:
      'Offered as an injection in vial sizes/total amounts listed on this page. Provider review is required before dispensing. Administration details and schedule come from your prescribing provider and pharmacy materials.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [
      'Public marketing around NAD+ longevity benefits varies; confirm preferred claim boundary with medical director.',
    ],
    regulatoryNotes: [
      'Avoid “reverses aging,” “restores youth,” or guaranteed energy claims.',
      'Compounded product — do not imply FDA approval of this formulation.',
    ],
  },

  selank: {
    shortDescription:
      'A provider-directed compounded Selank injection some people discuss for calm focus and stress-related wellness goals.',
    about: [
      'Selank Injection is a compounded peptide option offered after eligibility review. Selank is distinct from Semax and from the Selank + Semax nasal blend — each product is its own formulation and route.',
      'Conversations about Selank often involve stress resilience, calm, or cognitive comfort. These uses are emerging and should not be presented as guaranteed treatments for anxiety disorders or other diagnoses.',
    ].join('\n\n'),
    commonUses: [
      'A provider may consider Selank when discussing calm-focus or stress-related wellness goals',
      'May be explored only after intake and clinical judgment',
      'Not interchangeable with Semax or the nasal Selank/Semax blend',
      'Should not replace evaluation of mental-health conditions that need dedicated care',
    ],
    howItWorks:
      'Selank is a research-oriented peptide discussed in wellness settings for its possible effects on stress-related signaling. Exact mechanisms and benefits are not established as everyday medical fact on this storefront — your provider can explain whether it belongs in your plan.',
    whatToExpect:
      'Supplied as an injection at the strength and vial size shown. Use only if prescribed. Dosing and frequency are provider-directed.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [RESEARCH_FLAG],
    regulatoryNotes: [
      'Flag investigational/emerging framing; do not claim FDA-approved anxiety treatment.',
    ],
  },

  semax: {
    shortDescription:
      'A provider-directed compounded Semax injection some people discuss for focus and cognitive-wellness support.',
    about: [
      'Semax Injection is a compounded peptide option available after licensed-provider review. It is not the same product as Selank Injection or the Selank + Semax Blend Nasal Spray.',
      'Interest in Semax often relates to focus, attention, or cognitive wellness. Those topics remain carefully framed here: a provider may consider this option, but it is not presented as a proven treatment for ADHD, dementia, or other specific diagnoses.',
    ].join('\n\n'),
    commonUses: [
      'A provider may consider Semax when discussing focus or cognitive-wellness goals',
      'May be used only under eligibility review and prescription when appropriate',
      'Distinct from Selank and from the nasal combination spray',
      'Not a replacement for neurological or mental-health evaluation when symptoms warrant it',
    ],
    howItWorks:
      'Semax is a research-oriented peptide discussed for possible effects related to focus and cognitive signaling. Because evidence is evolving, we avoid definitive medical claims; your provider interprets whether it is suitable for you.',
    whatToExpect:
      'Injectable vial at the listed strength/size. Provider determines if you receive it and how to use it. Do not combine peptide products unless your clinician specifically directs you to.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [RESEARCH_FLAG],
    regulatoryNotes: [
      'Do not claim established treatment for cognitive disease.',
    ],
  },

  'selank-semax-nasal-spray': {
    shortDescription:
      'A compounded nasal spray that combines Selank and Semax in one provider-directed blend — different from either injection alone.',
    about: [
      'Selank + Semax Blend Nasal Spray is a compounded combination delivered through the nose rather than by injection. It is not simply “the same as” ordering Selank Injection plus Semax Injection separately.',
      'People may ask about a nasal option for convenience or preference. Suitability still depends on provider review, and combination products deserve clear counseling about expectations and safety.',
    ].join('\n\n'),
    commonUses: [
      'A provider may consider a combined nasal option when both peptides are appropriate for a supervised plan',
      'May appeal to customers who prefer a nasal spray format over injections',
      'Not interchangeable with single-peptide injections',
      'Should be discussed with realistic expectations around focus, calm, or wellness goals',
    ],
    howItWorks:
      'The spray delivers a measured Selank/Semax blend through nasal absorption. Your provider explains technique, frequency, and whether a combination product fits better than a single agent.',
    whatToExpect:
      'Nasal spray bottle at the strength/size listed (micrograms per spray as shown in the catalog). Use only as prescribed. Follow pharmacy instructions for priming, storage, and dosing.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [RESEARCH_FLAG, 'Confirm preferred language for combination peptide nasal products.'],
    regulatoryNotes: [
      'Preserve catalog strength text (50mcg/50mcg per spray); do not invent additional concentrations.',
    ],
  },

  // ===== RECOVERY & PERFORMANCE =====
  'bpc-157-tb-500': {
    shortDescription:
      'A provider-directed compounded blend of BPC-157 and TB-500, available in capsule or injection form after eligibility review.',
    about: [
      'Wolverine: BPC-157/TB-500 is a compounded combination product. BPC-157 and TB-500 are peptides often discussed in recovery and performance wellness conversations. This listing offers two dosage forms — capsule and injection — so your provider can choose the route that fits the plan.',
      'Interest in these peptides is frequently tied to tissue comfort, training recovery, or general repair-oriented wellness. Those uses are emerging and should not be framed as guaranteed injury healing or sports-medicine cures.',
    ].join('\n\n'),
    commonUses: [
      'A provider may consider this blend when discussing recovery-oriented wellness support',
      'May be explored for performance-adjacent goals under clinical supervision',
      'Available as capsule or injection — forms are not automatically interchangeable without provider guidance',
      'Not a substitute for evaluation of injuries that need imaging, physical therapy, or specialist care',
    ],
    howItWorks:
      'BPC-157 and TB-500 are research-oriented peptides discussed for possible roles in tissue signaling and recovery-related pathways. Because the science is still developing, we describe potential use carefully and leave clinical decisions to your licensed provider.',
    whatToExpect:
      'Choose Capsule or Injection on this page (see Available Options). Exact blend details are determined by the prescribing provider and pharmacy. Administration method depends on the form prescribed. Do not self-direct peptide stacking.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [
      RESEARCH_FLAG,
      'Catalog strength is "Blend" only — do not invent mg amounts for BPC-157 or TB-500.',
    ],
    regulatoryNotes: [
      'No guaranteed healing, recovery time, or performance enhancement claims.',
      'Strength listed as Blend in catalog — preserve that language.',
    ],
  },

  // ===== SKIN & HAIR =====
  'tretinoin-cream': {
    shortDescription:
      'A prescription tretinoin cream used for acne and skin-renewal goals under licensed-provider guidance.',
    about: [
      'Tretinoin is a topical retinoid (a vitamin A–related medicine) long used in dermatology. On this page it is offered as a cream in multiple strengths after provider review.',
      'People may seek tretinoin for acne care, texture, or signs of sun-related skin aging. Cosmetic improvement is possible for some users, but results vary and irritation can occur — especially when starting. Your provider helps match strength and routine to your skin.',
    ].join('\n\n'),
    commonUses: [
      'May be prescribed for acne management',
      'Commonly used to support skin renewal and smoother texture over time',
      'A provider may consider it for photoaging concerns when appropriate',
      'May be part of a broader skincare plan that includes gentle cleansing and daily sunscreen',
    ],
    howItWorks:
      'Tretinoin encourages skin cell turnover. In plain language, it helps newer skin come to the surface more regularly, which may improve breakouts and the look of uneven texture over time. It can cause dryness or peeling while your skin adjusts.',
    whatToExpect:
      'Cream in the strengths and tube size listed. Apply a thin layer only as directed, usually at night, and use sunscreen daily. Do not increase strength on your own if irritation appears — contact your care team.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    regulatoryNotes: [
      'Distinguish acne/medical uses from cosmetic appearance benefits.',
      'Avoid guaranteed “glass skin” or wrinkle-erasure claims.',
    ],
  },

  'minoxidil-topical': {
    shortDescription:
      'A compounded topical formula featuring minoxidil for prescription hair-care support after provider review.',
    about: [
      'Minoxidil Combination Topical Formula is a compounded hair-care option built around minoxidil, a medicine commonly used to support hair density. The catalog describes this as a combination formula personalized by the prescribing provider and dispensing pharmacy.',
      'Because the exact companion ingredients are determined clinically (not listed as a fixed consumer recipe here), we do not invent a full ingredient deck. Your provider and pharmacy confirm what is in your specific preparation.',
    ].join('\n\n'),
    commonUses: [
      'May be prescribed to support hair-density goals',
      'Commonly considered for thinning hair when a topical approach is appropriate',
      'A provider may personalize the compounded combination based on your needs',
      'Results vary; ongoing use is often required to maintain benefit when treatment works for you',
    ],
    howItWorks:
      'Minoxidil is thought to support hair follicles and prolong growth phases for some users. A topical formula delivers medication to the scalp. Your provider explains application frequency and what realistic timelines look like.',
    whatToExpect:
      'Supplied as a topical solution bottle. Apply only as directed after approval. Exact compounded contents are set by provider and pharmacy — ask your care team for your specific formula details if needed.',
    importantInformation: DEFAULT_COMPOUNDED_IMPORTANT,
    reviewFlags: [
      'Exact combination ingredients beyond minoxidil are not defined in catalog — do not invent them.',
    ],
    regulatoryNotes: [
      'Strength listed as "Combination formula" — preserve; no guaranteed hair-growth claims.',
    ],
  },

  'bimatoprost-solution': {
    shortDescription:
      'A prescription bimatoprost solution offered for eyelash appearance support following licensed-provider review.',
    about: [
      'Bimatoprost Solution is a prescription topical solution. Bimatoprost is known in clinical practice for effects related to eyelash growth when used as directed on the eyelash area.',
      'This storefront listing presents it as a prescription option after provider review. Follow application instructions carefully — this is not a general face serum.',
    ].join('\n\n'),
    commonUses: [
      'May be prescribed to support fuller-looking eyelashes when clinically appropriate',
      'A provider may consider this after reviewing eye and medical history',
      'Not intended as an unsupervised cosmetic cosmetic shared among household members',
      'Application is typically limited to the approved eyelash area per prescription directions',
    ],
    howItWorks:
      'Bimatoprost can influence the growth cycle of eyelashes for some users, which may lead to longer or fuller-looking lashes over time with consistent use. Changes are gradual and vary by person.',
    whatToExpect:
      'Solution bottle at the strength and size listed. Use the applicator method your pharmacy and provider describe, usually along the upper eyelash line. Avoid getting solution in the eye unless your instructions say otherwise. Report eye irritation promptly.',
    importantInformation: DEFAULT_RX_IMPORTANT,
    reviewFlags: [
      'Confirm preferred consumer wording for indication (eyelash hypotrichosis vs cosmetic framing) with medical director if needed.',
    ],
    regulatoryNotes: [
      'No guaranteed dramatic lash results; application area per prescription only.',
    ],
  },

  // ===== PROVIDER CARE =====
  'initial-provider-consultation': {
    shortDescription:
      'Your first visit with a licensed provider to review goals, health history, and whether treatment options make sense for you.',
    about: [
      'The Initial Provider Visit is a consultation service — not a medication. It gives you dedicated time to discuss what you want to work on, share relevant history, and hear clinical guidance.',
      'After the visit, your provider may recommend labs, a treatment plan, a different service, or no medication at all. Booking this visit does not guarantee that a prescription will be written.',
    ].join('\n\n'),
    commonUses: [
      'A good starting point if you are new to My Bare Method care',
      'Helpful when you want clarity before committing to a medication or membership',
      'Useful for reviewing goals across weight management, hormones, or other wellness areas',
      'May identify next steps such as labs, follow-up, or a specific product discussion',
    ],
    howItWorks:
      'You schedule and complete the visit (details provided after purchase/scheduling guidance). The provider reviews your information, asks clarifying questions, and outlines options. Any prescribing decision happens only if clinically appropriate.',
    whatToExpect:
      'One consultation session as listed. Come prepared with medications, allergies, and goal priorities. You may be asked to complete intake forms. Prescription fulfillment, if any, is a separate step after approval.',
    importantInformation:
      'Provider Care services require scheduling and may involve medical intake. Evaluation is separate from guaranteed prescribing. Purchasing a visit does not guarantee medication approval.',
  },

  'follow-up-appointment': {
    shortDescription:
      'A follow-up visit to review progress, ask questions, and refine your plan with a licensed provider.',
    about: [
      'Follow-Up Visit is for people already in care — or advised to return — who need time with a provider to check progress and adjust plans.',
      'Bring updates on how you are feeling, side effects if any, and questions about your routine. Your provider may continue, modify, pause, or stop a treatment based on what they learn.',
    ].join('\n\n'),
    commonUses: [
      'Useful after starting a new therapy to review tolerance and response',
      'Helpful when symptoms, goals, or life circumstances change',
      'May be recommended before dose or formulation adjustments',
      'Supports ongoing shared decision-making — not automatic refill approval',
    ],
    howItWorks:
      'You meet with a provider who reviews your interval history and current plan. Together you decide on next steps. Medication changes still require clinical judgment and, when applicable, pharmacy coordination.',
    whatToExpect:
      'One follow-up session. Have recent questions ready. If labs were ordered, results may be part of the discussion. Any new prescription remains subject to provider approval.',
    importantInformation:
      'Follow-up does not guarantee continued prescribing. Your provider may recommend a different path based on safety and appropriateness.',
  },

  'laboratory-review': {
    shortDescription:
      'A provider review of your laboratory results with personalized explanation and recommended next steps.',
    about: [
      'Laboratory Review focuses on interpreting labs in context — not just handing you numbers. A licensed provider walks through findings that matter for your goals and safety.',
      'This service does not automatically include ordering labs or prescribing medication. It is an interpretation and guidance visit based on results available for review.',
    ].join('\n\n'),
    commonUses: [
      'Helpful when you have recent labs and want clinician interpretation',
      'Useful before adjusting hormone or metabolic therapies',
      'May clarify whether additional testing is needed',
      'Supports informed decisions about continuing or changing a plan',
    ],
    howItWorks:
      'Your provider reviews submitted or available results, explains plain-language takeaways, and recommends follow-up actions. Treatment changes are separate clinical decisions.',
    whatToExpect:
      'One laboratory-review session. Ensure results are available to the care team as instructed. Bring questions about markers you care about most.',
    importantInformation:
      'Lab review does not guarantee a prescription or a specific treatment. Recommendations depend on your full clinical picture.',
  },

  // ===== ACCESSORIES =====
  'complete-injection-starter-kit': {
    shortDescription:
      'A bundled starter kit that gathers core injection-day accessories into one convenient package.',
    about: [
      'The Complete Injection Starter Kit is designed for people who want the essentials in one place rather than buying each accessory separately.',
      'According to our catalog, the kit includes: a 3D printed peptide case, temperature-controlled travel case, discreet travel bag, reusable ice pack, wellness planner, sharps container, alcohol prep wipes, and insulin syringes.',
    ].join('\n\n'),
    commonUses: [
      'Helpful when you are setting up an injection routine for the first time',
      'Useful as a gift-to-self bundle for organized travel and home storage',
      'Convenient if you prefer one checkout instead of multiple accessory orders',
    ],
    howItWorks:
      'This is a supplies bundle — not a medication. Each included item supports storage, travel, prep, or disposal around injectable wellness routines.',
    whatToExpect:
      'You receive the kit components listed in the catalog description. Individual item specifications match the standalone accessory listings. Medications are sold separately and still require provider review when applicable.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications and do not require a prescription.',
    reviewFlags: [
      'Kit contents taken from catalog shortDescription — do not add unverified extra items.',
    ],
  },

  'premium-3d-printed-peptide-case': {
    shortDescription:
      'A custom 3D-printed case with compartments designed to hold peptide vials, syringes, and related supplies.',
    about: [
      'The Premium 3D Printed Peptide Case helps keep small vials and injection supplies organized in one protective shell.',
      'It is built for everyday storage and transport of accessories — it is not a medication and does not replace temperature control when your product requires refrigeration.',
    ].join('\n\n'),
    commonUses: [
      'Organize vials and syringes in one place',
      'Reduce clutter in a travel bag or home kit',
      'Pair with other accessories for a more complete routine setup',
    ],
    whatToExpect:
      'One case as listed. Use for organization and protection of supplies. Follow any storage guidance that comes with your medication separately.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications.',
  },

  'temperature-controlled-travel-case': {
    shortDescription:
      'An insulated travel case with thermal lining intended to help keep temperature-sensitive vials more stable on the go.',
    about: [
      'The Temperature-Controlled Travel Case is an insulated carrier with a built-in thermal lining for transporting peptide vials and similar supplies.',
      'Catalog copy notes temperature maintenance for up to 48 hours under intended use conditions. Real-world performance still depends on ambient heat, packing method, and ice-pack use — treat medication storage guidance from your pharmacy as the authority.',
    ].join('\n\n'),
    commonUses: [
      'Travel days when vials need insulation',
      'Commuting between home and another location',
      'Pairing with a reusable ice pack for added cold support',
    ],
    whatToExpect:
      'One insulated case. Add cold packs as needed and follow pharmacy storage instructions for your specific medication.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications. Insulation claims follow catalog language; verify packing for your climate and trip length.',
    reviewFlags: [
      '48-hour temperature claim comes from existing catalog copy — owner may wish to re-verify marketing precision.',
    ],
  },

  'discreet-travel-bag': {
    shortDescription:
      'A sleek travel bag with water-resistant lining designed to carry your wellness kit discreetly.',
    about: [
      'The Discreet Travel Bag is meant to hold your therapy-related accessories in a low-key everyday bag.',
      'Catalog materials describe a vegan-leather look with water-resistant lining. Exact dimensions are not listed on this page, so we do not invent measurements.',
    ].join('\n\n'),
    commonUses: [
      'Carry vials, cases, and supplies without a medical-looking bag',
      'Keep your routine organized while traveling',
      'Use as the outer bag paired with insert cases',
    ],
    whatToExpect:
      'One travel bag as listed. Fill with the accessories and medications appropriate for your plan.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications.',
  },

  'reusable-ice-pack': {
    shortDescription:
      'A reusable gel ice pack intended to help keep peptide vials cooler during transport.',
    about: [
      'The Reusable Ice Pack is a simple cold-support accessory for travel cases and bags.',
      'Catalog copy describes a non-toxic, long-lasting gel pack. Freeze according to the product’s included guidance and always follow medication-specific storage rules.',
    ].join('\n\n'),
    commonUses: [
      'Add cold support inside an insulated travel case',
      'Short trips where vials should stay cooler',
      'Backup cold pack for your kit',
    ],
    whatToExpect:
      'One reusable ice pack. Freeze before use. Do not place ice packs in direct contact with materials your pharmacy says should stay dry unless protected.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications.',
  },

  'daily-weekly-wellness-planner': {
    shortDescription:
      'A daily and weekly planner with habit trackers and reflection space designed around wellness routines.',
    about: [
      'The Daily & Weekly Wellness Planner helps you track habits, goals, and consistency — including therapy routines if you choose to log them.',
      'It is a paper planning tool, not a medical device, and it does not provide clinical advice.',
    ].join('\n\n'),
    commonUses: [
      'Track doses, habits, or check-ins if you like written logs',
      'Set weekly wellness goals and review progress',
      'Keep reflections in one place between provider visits',
    ],
    whatToExpect:
      'One planner as listed. Use it in whatever way supports your routine.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications.',
  },

  'sharps-container': {
    shortDescription:
      'An FDA-cleared sharps container for disposing of used syringes and needles safely.',
    about: [
      'The Sharps Container provides a puncture-resistant place to dispose of used syringes and needles.',
      'Catalog copy describes it as FDA-cleared, secure, and easy to use. Follow local rules for final disposal when the container is full.',
    ].join('\n\n'),
    commonUses: [
      'Home disposal of used injection supplies',
      'Keep sharps out of household trash bags',
      'Complete an injection kit with safer end-of-use handling',
    ],
    whatToExpect:
      'One container. Fill only to the indicated fill line. Do not force items inside or empty a used container.',
    importantInformation:
      'Accessories are wellness tools and supplies. Follow community guidelines for sharps drop-off when full.',
    regulatoryNotes: [
      'FDA-cleared language retained from existing catalog; not expanded.',
    ],
  },

  'alcohol-prep-wipes': {
    shortDescription:
      'Individually wrapped 70% isopropyl alcohol pads for cleaning injection sites before use.',
    about: [
      'Alcohol Prep Wipes are sterile-prep style pads for wiping skin before an injection when your routine calls for it.',
      'Choose 200-count or 500-count boxes on this page. Cart quantity is how many boxes you want — separate from the wipe count inside each box.',
    ].join('\n\n'),
    commonUses: [
      'Prep skin before injections when directed',
      'Keep a supply in your home kit or travel bag',
      'Stock up with larger counts if you inject regularly',
    ],
    whatToExpect:
      'Box of individually wrapped pads at the count you select. Use once and discard. Allow skin to dry before injecting if that is part of your instructions.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications.',
  },

  'premium-insulin-syringes': {
    shortDescription:
      'Sterile insulin syringes for subcutaneous injections, offered in multiple pack counts.',
    about: [
      'Premium Insulin Syringes provide sterile syringes for subcutaneous injections when your prescribed routine uses this supply type.',
      'Select a pack count from 10 to 100 on this page. Cart quantity is the number of packs, separate from how many syringes are inside the selected pack.',
    ].join('\n\n'),
    commonUses: [
      'Supply refills for subcutaneous injection routines',
      'Pair with alcohol wipes and a sharps container',
      'Choose a pack size that matches how often you inject',
    ],
    whatToExpect:
      'One pack at the count selected. Needle gauge and barrel markings are not listed in the catalog, so we do not invent those specs here — check the product packaging on arrival if you need exact details.',
    importantInformation:
      'Accessories are wellness tools and supplies. They are not medications. Dispose of used syringes in a proper sharps container.',
    reviewFlags: [
      'Needle gauge / unit markings not in catalog — flagged rather than invented.',
    ],
  },
};

export const MEMBERSHIP_COPY: Record<string, MembershipCopy> = {
  'semaglutide-membership': {
    shortDescription:
      'A flat $149/month Semaglutide membership program with provider-guided care — distinct from buying a single retail vial.',
    about: [
      'Semaglutide Membership is a membership program, not a one-off retail medication SKU. You pay a predictable monthly membership rate for ongoing provider-guided Semaglutide + B6 care within the included dose range.',
      'When you join, you select a requested dose for intake. Your licensed provider still decides whether treatment is appropriate and which dose is approved. Medication fulfillment uses the matching retail vial SKU for the approved dose — we do not create separate “membership-only” medication SKUs.',
    ].join('\n\n'),
    commonUses: [
      'Best when you want a locked monthly program price instead of paying per retail vial strength',
      'Includes provider-guided adjustments within the listed Semaglutide formulations while continuously enrolled',
      'May include member savings on other eligible wellness products and accessories per current program terms',
    ],
    howItWorks:
      'You enroll in the membership program (PROGRAM SKU) and share a requested dose. After provider review, fulfilled medication uses the corresponding retail Semaglutide vial SKU for that dose. Your membership price stays flat while you remain continuously enrolled and within the included program.',
    whatToExpect:
      'Monthly membership is $149. Until automated bank payments are enabled, each billing period uses an invoice with ACH/bank-transfer or domestic wire instructions — your bank is not automatically charged by the storefront. Initial term is 3 months, then month to month. Provider review is required; payment does not guarantee a prescription.',
    importantInformation:
      'Membership enrollment and payment do not guarantee a prescription. Requested dose is not automatically the approved dose. Availability depends on provider judgment, pharmacy fulfillment, and applicable requirements.',
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
      'Distinguish PROGRAM SKU vs FULFILLMENT SKU in customer and ops copy.',
      'Do not imply automatic bank charging under current invoice ACH/Wire flow.',
    ],
  },

  'tirzepatide-membership': {
    shortDescription:
      'A flat $249/month Tirzepatide membership program through the included dose maximum — separate from retail vial checkout.',
    about: [
      'Tirzepatide Membership is a membership program with one predictable monthly rate through the included program maximum (formulations through 15mg). It is not the same checkout path as buying Tirzepatide retail vials à la carte.',
      'You choose a requested dose when joining. A licensed provider reviews eligibility and may approve a different dose. Fulfillment uses the retail Tirzepatide vial SKU that matches the approved medication strength — not a duplicate membership-medication SKU.',
    ].join('\n\n'),
    commonUses: [
      'Ideal when you want flat monthly Tirzepatide program pricing through the included maximum',
      'Supports provider-guided adjustments within listed Tirzepatide formulations while enrolled',
      'May include member savings on eligible wellness products and accessories per program terms',
    ],
    howItWorks:
      'Enrollment purchases the membership PROGRAM. Requested dose informs intake; approved treatment drives which retail fulfillment SKU is used. Your $249 rate remains locked while membership stays continuously active and within program rules.',
    whatToExpect:
      'Monthly membership is $249. Billing currently uses invoices with ACH/bank-transfer or domestic wire instructions each period — not automatic storefront bank charging. Initial term is 3 months, then month to month. Provider review required.',
    importantInformation:
      'Payment and enrollment do not guarantee a prescription. Tirzepatide Membership is not interchangeable with Semaglutide Membership. 30mg is not part of this program.',
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
