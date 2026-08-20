/**
 * Customer-facing pharmacy transparency copy.
 * Content-only — does not assert a specific pharmacy per SKU.
 */

export const PHARMACY_FULFILLMENT_HEADING = 'Prescription Pharmacy Fulfillment';

export const PHARMACY_FULFILLMENT_COPY = [
  'When prescribed, applicable compounded prescription therapies offered through My Bare Method are fulfilled through U.S. compounding pharmacy partners, including Ageless Pharma Rx (503A) and ProCompounding Pharmacy (503A), as applicable to the prescription and formulation.',
  "These are pharmacy-dispensed prescription products—not unverified 'research lab' products sold directly to consumers online. Provider review and a valid prescription are required where applicable.",
].join('\n\n');

/** Short trust line for About / FAQ / similar site-level sections (not homepage clutter). */
export const PHARMACY_FULFILLMENT_SHORT =
  'Prescription therapies are fulfilled through U.S. compounding pharmacy partners, including Ageless Pharma Rx (503A) and ProCompounding Pharmacy (503A), as applicable. Provider review and a valid prescription are required.';

export const PHARMACY_503A_FAQ = {
  q: 'What does a 503A pharmacy mean?',
  a: [
    'A 503A compounding pharmacy is a U.S. pharmacy that prepares compounded medications for individual patients based on a valid prescription from a licensed provider. These pharmacies operate under Section 503A of the Federal Food, Drug, and Cosmetic Act and are primarily regulated by state boards of pharmacy, while also being subject to applicable federal requirements.',
    'For My Bare Method, applicable compounded prescriptions may be fulfilled through pharmacy partners including Ageless Pharma Rx (503A) and ProCompounding Pharmacy (503A), depending on the medication and prescription.',
    "This is an important distinction from products marketed online as 'research use only' or sold directly by peptide or research-lab websites without an individual prescription. My Bare Method's prescription process includes provider review and pharmacy fulfillment when a prescription is appropriate.",
  ].join(' '),
} as const;

export const COMPOUNDED_FDA_FAQ = {
  q: 'Are compounded medications FDA-approved?',
  a: 'Compounded medications are not FDA-approved in the same way as commercially manufactured prescription drugs. They are prepared for individual patients when prescribed by a licensed provider and when a compounded option is determined to be appropriate. My Bare Method requires provider review for prescription therapies and uses U.S. pharmacy partners for applicable compounded prescriptions.',
} as const;
