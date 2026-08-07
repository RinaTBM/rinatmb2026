# Stripe Test Results

## Environment status

This build was completed in an environment with **no Stripe or Supabase credentials** (all `STRIPE_*`/`SUPABASE_*` names unset). Therefore the live-service steps below were **built and dry-run/unit-tested offline** but could **not** be executed against real services here. **No live Stripe object was created or modified (impossible without a key; live keys are also actively refused).**

To complete the actual TEST sync, the owner must provide credentials (see `docs/stripe-sync-guide.md`) and run the commands below.

## What was executed here (offline, no secrets)

- `npm run catalog:validate` → **PASSED** — 13 syncable products, 2 syncable memberships, 0 errors.
- `npm run stripe:sync:test:dry-run` → produced the first-sync plan:
  - **create_product: 15** (13 products + 2 memberships)
  - **create_price: 28** (26 one-time variant Prices + 2 recurring membership Prices)
  - reuse_price: 0, archive_price: 0, total: 43
  - Membership Prices in the plan: **Semaglutide $199.00/month**, **Tirzepatide $249.00/month** (one recurring Price each; no per-dose membership Prices).
- `npm run test` (Vitest) → **16/16 passed**, including: 13 syncable products (future/hidden excluded), money-in-cents, membership amounts $199/$249 monthly, Tirzepatide caps at 25mg / excludes 30mg, no prescription guarantee, deterministic fingerprints/idempotency keys, first-sync plan counts, idempotent reuse on re-sync, and new-Price + archive-old on amount change. Webhook signature verification: valid/ tampered/ wrong-secret/ expired/ missing all handled.
- `npm run typecheck` → **PASSED**. `npm run lint` → **PASSED** (0 errors; 4 pre-existing react-refresh warnings). `npm run build` → **PASSED** (client + SSR prerender; `/admin` excluded from sitemap).
- Manual: `/admin` renders (preview mode) with all 8 sections; Products table (13), product editor validation "No errors", Memberships ($199/$249 with Tirzepatide 25mg max), Stripe Sync dry-run plan; storefront `/` and `/shop-all` still work. No admin console errors (one pre-existing `fetchPriority` warning on the storefront hero).

## Owner steps to run the real TEST sync

```
# 1. Configure .env.local (see .env.example) with test/sandbox values.
# 2. Apply Supabase migrations + add yourself to admins (see product-admin-system.md).
# 3. Preview, then apply, then verify:
npm run catalog:validate
npm run stripe:sync:test:dry-run
npm run stripe:sync:test
npm run stripe:verify:test
```

Then fill in the results below:

| Item | Expected | Actual (owner to fill) |
| --- | --- | --- |
| Stripe test Products created/reused | 15 (13 products + 2 memberships) | _pending_ |
| Stripe test Prices created/reused | 28 (26 one-time + 2 recurring) | _pending_ |
| Semaglutide Membership test Price ID | `price_…` ($199/mo) | _pending_ |
| Tirzepatide Membership test Price ID | `price_…` ($249/mo) | _pending_ |
| Duplicate Products/Prices | none | _pending_ |
| Live Stripe objects changed | none | none |
| Test Checkout Session (one-time) | created with variant test Price | _pending_ |
| Test Checkout Session (subscription) | created with membership test Price | _pending_ |
| Webhook signature verification (test) | valid accepted / invalid rejected / duplicate ignored | _pending_ |
