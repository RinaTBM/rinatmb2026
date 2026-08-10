# Stripe legacy inventory (retired processor)

Stripe is permanently unavailable. This inventory classifies remaining references.
**Do not deploy, sync, or reconnect Stripe.**

| Area | Classification | Notes |
|------|----------------|-------|
| `src/pages/CheckoutPage.tsx` customer CTA | **A — removed from active path** | Calls `create-invoice-order` only; Stripe session create not invoked |
| `isStripeCheckoutEnabled()` | **A — hard false** | Always disabled |
| Admin “Legacy Sync” UI | **A — disabled** | Buttons removed; informational only |
| `supabase/functions/create-checkout-session` | **D — Edge / ops tooling** | Legacy; do not deploy for launch |
| `supabase/functions/stripe-sync` | **D — Edge / ops tooling** | Legacy; do not deploy |
| `supabase/functions/stripe-webhook` | **D — Edge / ops tooling** | Legacy; do not deploy |
| `supabase/functions/sync-stripe-products` | **D — Edge / ops tooling** | Legacy seed |
| `scripts/stripe-sync-test.ts`, `scripts/stripe-verify-test.ts` | **E — test / ops only** | Not part of storefront build |
| `src/lib/catalog/stripeClient.ts` | **B — legacy isolated** | Used by CLI scripts only |
| `src/lib/stripe/verifySignature.ts` | **E — test only** | Webhook signature helper |
| `orders.stripe_*` columns | **C — database metadata only** | Retained for historical rows; unused by manual invoice inserts |
| `catalog_* .stripe_price_id_test` | **C — database metadata only** | Catalog mapping fields; not required for manual invoice launch |
| Docs mentioning Stripe LIVE | **B — outdated docs** | Prefer `docs/project-status-2026.md` |

## Build / runtime requirement

- Website **build and run must not require** `STRIPE_*` environment variables.
- Manual banking secrets are Edge Function–only (`MANUAL_ACH_*`, `MANUAL_WIRE_*`).
