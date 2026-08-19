/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Legacy optional publishable key — unused by active checkout. */
  readonly VITE_STRIPE_PUBLISHABLE_KEY_TEST?: string;
  /**
   * Manual invoice checkout kill-switch.
   * Default/unset = enabled. Set to "false" to disable order submission.
   */
  readonly VITE_MANUAL_CHECKOUT_ENABLED?: string;
  /**
   * Legacy kill-switch from interim payment-disable work.
   * "false" disables manual checkout. Does NOT enable Stripe.
   */
  readonly VITE_PAYMENTS_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
