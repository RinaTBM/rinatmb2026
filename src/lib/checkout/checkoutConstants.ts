/**
 * Checkout authorization constants shared by storefront tests and mirrored
 * in supabase/functions/create-checkout-session (Deno edge runtime).
 */

export const SEMAGLUTIDE_MEMBERSHIP_APP_ID = 'm1';
export const TIRZEPATIDE_MEMBERSHIP_APP_ID = 'm2';

export const SEMAGLUTIDE_MEMBERSHIP_CENTS = 14900;
export const TIRZEPATIDE_MEMBERSHIP_CENTS = 24900;
/** Provider/admin-gated only — never a self-serve checkout amount. */
export const TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS = 35000;

export const WELLNESS_MEMBER_DISCOUNT_PERCENT = 15;
export const AUTO_REFILL_DISCOUNT_PERCENT = 10;
export const ACCESSORY_MEMBER_DISCOUNT_PERCENT = 15;

/**
 * Customer-facing Provider Care add-on tax — RETIRED (tax-inclusive pricing).
 * Displayed retail/service prices are treated as tax-inclusive at checkout.
 * Keep rate at 0 so authorize/order builders persist tax_cents = 0 for NEW orders.
 * Do NOT re-enable a separate Provider Care Tax line without an explicit product decision.
 * Historical orders may still have non-zero tax_cents — leave them untouched.
 */
export const PROVIDER_CARE_TAX_RATE = 0;
/** Display / metadata form (retired add-on; kept for API shape stability). */
export const PROVIDER_CARE_TAX_RATE_PERCENT = 0;

/**
 * Customer-facing accessory sales-tax add-on — RETIRED (tax-inclusive pricing).
 * Displayed retail prices are treated as tax-inclusive at checkout.
 * Keep rate at 0 so NEW orders persist tax_cents = 0.
 * Do NOT re-enable a separate Sales Tax line without an explicit product decision.
 * Do NOT enable Tagada automatic tax / TaxJar for hosted checkout parity.
 */
export const ACCESSORY_SALES_TAX_RATE = 0;
export const ACCESSORY_SALES_TAX_RATE_PERCENT = 0;
/** Stripe Tax path remains disabled (Stripe checkout retired). */
export const ACCESSORY_SALES_TAX_USES_STRIPE_TAX = false;

/** Concise customer disclosure — not tax advice. */
export const TAX_INCLUSIVE_CHECKOUT_DISCLOSURE =
  'Applicable taxes are included in displayed prices where required.';

export const ACCESSORY_BUNDLE_PRODUCT_IDS = new Set(['a1']);

/** Approved Provider Care fixed prices (storefront-only; not stripe-sync catalog). */
export const PROVIDER_CARE_FIXED_CENTS: Record<string, number> = {
  pc1: 7500, // Initial Provider Visit
  pc2: 5500, // Follow-Up Visit
  pc3: 6000, // Laboratory Review ($60)
  pc4: 20000, // Lab Kit ($200) — shipping included
};

/** Semaglutide / Tirzepatide medication SKUs — never receive wellness 15% member discount. */
export const WEIGHT_MED_PRODUCT_IDS = new Set(['p1', 'p5']);

export const MEMBERSHIP_FIXED_CENTS: Record<string, number> = {
  [SEMAGLUTIDE_MEMBERSHIP_APP_ID]: SEMAGLUTIDE_MEMBERSHIP_CENTS,
  [TIRZEPATIDE_MEMBERSHIP_APP_ID]: TIRZEPATIDE_MEMBERSHIP_CENTS,
};
