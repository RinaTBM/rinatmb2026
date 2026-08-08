/**
 * Checkout authorization constants shared by storefront tests and mirrored
 * in supabase/functions/create-checkout-session (Deno edge runtime).
 */

export const SEMAGLUTIDE_MEMBERSHIP_APP_ID = 'm1';
export const TIRZEPATIDE_MEMBERSHIP_APP_ID = 'm2';

export const SEMAGLUTIDE_MEMBERSHIP_CENTS = 19900;
export const TIRZEPATIDE_MEMBERSHIP_CENTS = 24900;
/** Provider/admin-gated only — never a self-serve checkout amount. */
export const TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS = 35000;

export const WELLNESS_MEMBER_DISCOUNT_PERCENT = 15;
export const AUTO_REFILL_DISCOUNT_PERCENT = 10;
export const ACCESSORY_MEMBER_DISCOUNT_PERCENT = 15;

/**
 * Approved Provider Care fee/tax rate (1.8%).
 * Applies ONLY to eligible Provider Care line items — never to wellness,
 * memberships, accessories, Auto-Refill, or shipping.
 */
export const PROVIDER_CARE_TAX_RATE = 0.018;
/** Display / metadata form of the Provider Care tax rate. */
export const PROVIDER_CARE_TAX_RATE_PERCENT = 1.8;

/**
 * Accessory retail sales tax is intentionally NOT implemented here.
 * Do not hard-code a universal accessory tax (including the former 8%).
 * Destination-based / Stripe Tax path remains pending approval.
 */
export const ACCESSORY_SALES_TAX_PENDING = true;

export const ACCESSORY_BUNDLE_PRODUCT_IDS = new Set(['a1']);

/** Approved Provider Care fixed prices (storefront-only; not stripe-sync catalog). */
export const PROVIDER_CARE_FIXED_CENTS: Record<string, number> = {
  pc1: 7500, // Initial Provider Visit
  pc2: 5500, // Follow-Up Visit
  pc3: 5500, // Laboratory Review
};

/** Semaglutide / Tirzepatide medication SKUs — never receive wellness 15% member discount. */
export const WEIGHT_MED_PRODUCT_IDS = new Set(['p1', 'p5']);

export const MEMBERSHIP_FIXED_CENTS: Record<string, number> = {
  [SEMAGLUTIDE_MEMBERSHIP_APP_ID]: SEMAGLUTIDE_MEMBERSHIP_CENTS,
  [TIRZEPATIDE_MEMBERSHIP_APP_ID]: TIRZEPATIDE_MEMBERSHIP_CENTS,
};
