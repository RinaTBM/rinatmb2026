# Live Stripe Release Checklist

Do **not** perform any of this during the current task. This checklist is for a future, explicitly-approved go-live. Live changes require owner sign-off at every step.

## Pre-flight

- [ ] Compliance/legal approval of all customer-facing names, descriptions, and membership terms.
- [ ] Pharmacy availability confirmed for every active product/formulation.
- [ ] Final names and prices confirmed (products + both memberships: Semaglutide $199/mo, Tirzepatide $249/mo).
- [ ] Confirm the two memberships each map to exactly one recurring Price; dose remains provider-directed (no per-dose subscription Prices).

## Stripe live configuration

- [ ] Create a **restricted LIVE** Stripe key limited to: Products (write), Prices (write), Checkout Sessions (write), Customers (read), Subscriptions (read), Billing Portal (only if used). Store as `STRIPE_SECRET_KEY_LIVE` (server-only).
- [ ] Configure the **live** webhook endpoint (the `stripe-webhook` function URL) and store `STRIPE_WEBHOOK_SECRET_LIVE`.
- [ ] Confirm the sync tooling has a `live` code path that mirrors the test path, writing to `*_live` columns (the current tooling is intentionally test-only; add the live path deliberately, behind an explicit `environment=live` flag and owner approval).

## Controlled rollout

- [ ] Run a **live dry-run** and export the full planned change list.
- [ ] Manually review every planned live Product/Price create/update. Confirm no unexpected archives.
- [ ] Obtain **explicit written owner approval** of the plan.
- [ ] Sync **only the approved objects** to live.
- [ ] Never overwrite an existing live Price amount (create new + archive old after storing). Never cancel/migrate existing customer subscriptions.
- [ ] Complete **one controlled live checkout** with a real card for a low-value item, verify fulfillment + webhook, then refund if appropriate.

## Deployment

- [ ] Confirm Bolt environment variables (browser `VITE_*`; server secrets on the edge functions, not the frontend bundle).
- [ ] Confirm `.env*` files are not committed and no secret appears in the client bundle.
- [ ] Publish only after successful review and sign-off.

## Guardrails (always)

- No hard-delete of live Stripe Products or Prices.
- No exposure of secret keys in code, logs, docs, or git.
- No wholesale cost / markup / pharmacy-source / profit data in client-readable tables or Stripe metadata.
- No medical/intake detail stored in Stripe.
