/**
 * Stripe card checkout is permanently retired for this project.
 * Manual invoice + ACH/wire is the active launch path.
 *
 * VITE_PAYMENTS_ENABLED is retained only as an emergency kill-switch for the
 * entire checkout submit CTA (not a Stripe toggle). Default = enabled for
 * manual invoice checkout unless explicitly set to a non-"true" disable value.
 *
 * Set VITE_MANUAL_CHECKOUT_ENABLED=false to disable order submission.
 * Unset or "true" keeps manual checkout available.
 */

export const PAYMENTS_UNAVAILABLE_MESSAGE =
  'Online payment is temporarily unavailable. Please contact us for assistance.';

/** Stripe Checkout / create-checkout-session must never be invoked from the storefront. */
export function isStripeCheckoutEnabled(): boolean {
  return false;
}

/**
 * Manual invoice checkout (ACH / wire). Enabled by default.
 * Disable only with VITE_MANUAL_CHECKOUT_ENABLED=false (or legacy VITE_PAYMENTS_ENABLED=false).
 */
export function isManualCheckoutEnabled(): boolean {
  const manual = import.meta.env.VITE_MANUAL_CHECKOUT_ENABLED;
  if (manual === 'false') return false;
  // Legacy kill-switch from the interim payment-disable branch.
  const legacy = import.meta.env.VITE_PAYMENTS_ENABLED;
  if (legacy === 'false') return false;
  return true;
}

/** @deprecated Use isManualCheckoutEnabled / isStripeCheckoutEnabled */
export function isPaymentsEnabled(): boolean {
  return isManualCheckoutEnabled();
}
