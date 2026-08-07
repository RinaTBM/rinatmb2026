# Admin / Stripe / Supabase Audit — 2026

Prepared for the Product & Membership Admin System build (branch `product-admin-stripe-sync-2026`).
No secret values are included in this document.

## Environment reality (this workspace)

- **No Stripe or Supabase credentials are present** in the environment (`STRIPE_*` and `SUPABASE_*` variable names are all unset).
- Consequence: the system is **built and unit-/dry-run-tested offline**, but live-service execution — applying migrations to a real Supabase project, creating Stripe **TEST** objects, live webhook/checkout-session tests — is **blocked pending credentials**. Exact steps are in `docs/stripe-sync-guide.md` and the final report.
- GitHub push authentication **is** available (origin remote uses an access token). The branch will be committed and pushed.

## Current architecture

- **Framework:** Vite + React 18 + TypeScript, Tailwind CSS. Single-page app with a custom hash/path router (`src/router.tsx`, `src/App.tsx`). No Node/Next server.
- **Routing:** client-side; `App.tsx` maps `path` → page component. `public/_redirects` provides SPA fallback. `scripts/prerender.tsx` prerenders routes to static HTML + generates `sitemap.xml` at build.
- **Catalog data source:** `src/data/products.ts` — the single client-side source of truth for the 13 products (with variants, categories, visibility, slug aliases) and the memberships (`memberships`, `visibleMemberships`). Money currently stored as **dollars** (numbers).
- **Cart/checkout:** `src/context/CartContext.tsx` (localStorage cart, variant + membership aware); `src/pages/CheckoutPage.tsx` calls the `create-checkout-session` edge function with `{ productId, quantity, subscription }`.
- **Images:** `public/images/**`, referenced by constants in `src/data/products.ts`.
- **No admin pages, no authentication, and no frontend Supabase client currently exist.**

## Current Stripe integration

- Two Supabase **Edge Functions** (Deno), using `fetch` against the Stripe REST API (no Stripe SDK):
  - `supabase/functions/sync-stripe-products/index.ts` — seed script that **creates** Stripe products/prices from a hardcoded `ProductSeed[]` (ids `p1..p67`, `m1`, `m2`) and upserts rows into `stripe_products`. Uses `STRIPE_SECRET_KEY`. Note: it always POSTs new Stripe products (not idempotent), and abbreviates names. Membership seeds `m1`/`m2` are `type: recurring`.
  - `supabase/functions/create-checkout-session/index.ts` — looks up `stripe_price_id` by `app_product_id` in `stripe_products`, builds Checkout Sessions, switches to `subscription` mode when a matched product `is_recurring` and the item is flagged `subscription`. Uses `STRIPE_SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- **Stripe SDK version:** none (raw REST via fetch). Environment variable in use: `STRIPE_SECRET_KEY` (single key; no explicit test/live split).
- **Existing Stripe Product/Price IDs:** none stored in the repo; they are created at runtime by the seed function and persisted only in the live `stripe_products` table (not in git). No test/live separation exists today.
- **Customer Portal:** not implemented.
- **Webhook endpoint:** **none** currently implemented.
- **Frontend Stripe keys:** `CheckoutPage` reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` to call the edge function; no publishable Stripe key used client-side.

## Current Supabase integration

- `supabase/migrations/`:
  - `20260729050749_create_stripe_products_table.sql` — creates `stripe_products` (`app_product_id`, `stripe_product_id`, `stripe_price_id`, `name`, `price`, `is_recurring`, timestamps).
  - `...lock_down_stripe_products_writes.sql.sql` and `...drop_stripe_products_write_policies.sql.sql` — RLS lockdown for `stripe_products`.
- No auth/roles, no `profiles`/`admins` table, no catalog tables. Edge functions use the service-role key server-side.

## Existing database schema (relevant)

- `stripe_products(app_product_id text, stripe_product_id text, stripe_price_id text, name text, price int, is_recurring bool, created_at, updated_at)` with RLS restricting writes.

## Existing product & membership records

- Products: defined in code (`src/data/products.ts`) — 13 active + 2 hidden future (Sermorelin, Minoxidil tablets). Variants carry dollar prices.
- Memberships: `Semaglutide Membership` $199/mo (`checkoutProductId: m1`), `Tirzepatide Membership` $249/mo (`checkoutProductId: m2`), plus hidden `Bare Elite Wellness`. Stripe seed `m1`/`m2` currently seeded at $199/$249 recurring (names updated in the prior relaunch).

## GLP-1 / GLP-1/GIP customer-facing names

- Removed from customer-facing surfaces in the prior relaunch (verified 0 in the built bundle). Old slugs (`glp-1-1`, etc.) are retained only as redirect aliases in `SLUG_ALIASES`. Class-term references are not used in product/marketing copy.

## Duplicate product / pricing data

- Prices exist in two places today: `src/data/products.ts` (dollars, source of truth for the storefront) and the `sync-stripe-products` seed (cents, for Stripe). This build introduces a **single normalized catalog module** (`src/lib/catalog/`) in integer **cents** to drive validation, dry-run, sync, and (optionally) DB seeding, reducing duplication.

## Risks / missing pieces

1. **No credentials in this environment** → live migration apply + Stripe TEST sync + webhook/checkout live tests cannot be executed here; they are scripted and documented for the owner to run.
2. **No auth/admin** exists → this build adds Supabase-Auth-based admin gating (client guard + RLS + server-side edge-function checks). Requires a Supabase project + at least one admin user to be fully operational.
3. **Existing seed function is not idempotent** and has no test/live split → this build adds an idempotent, TEST-only sync service (deterministic fingerprints + Stripe idempotency keys, metadata mapping, new-Price-on-amount-change, archive-after-replace). The legacy `sync-stripe-products` function is left intact (not deleted) but superseded.
4. **Money as floats** in `products.ts` → normalized catalog uses integer cents.
5. **Checkout** currently keys on `app_product_id`; membership/one-time price mapping must resolve to the stored **test** Price IDs after sync.

## Files that will be changed / added

Added:
- `docs/admin-stripe-audit.md` (this file), `docs/product-admin-system.md`, `docs/stripe-sync-guide.md`, `docs/stripe-test-results.md`, `docs/live-stripe-release-checklist.md`
- `supabase/migrations/20260806090000_catalog_admin_schema.sql` (catalog tables, logs, processed events, RLS, admin role helper)
- `supabase/migrations/20260806090100_seed_catalog.sql` (idempotent seed of 13 products + variants + 2 memberships)
- `supabase/functions/stripe-sync/index.ts` (admin-guarded, TEST-only, idempotent sync + dry-run)
- `supabase/functions/stripe-webhook/index.ts` (signature verification + idempotent event handling)
- `src/lib/catalog/` (`catalog.ts` normalized source in cents, `validate.ts`, `syncPlan.ts`, `fingerprint.ts`, tests)
- `src/lib/supabaseClient.ts` (browser client, guarded when unset)
- `src/admin/**` (admin UI: guard + sections + editors)
- `scripts/catalog-validate.ts`, `scripts/stripe-sync-test.ts`, `scripts/stripe-verify-test.ts`
- `.env.example`
- Vitest config + tests

Modified:
- `package.json` (scripts + dev deps: vitest, tsx)
- `src/App.tsx` / `src/router.tsx` (mount `/admin` routes)
- `.gitignore` (ensure `.env*` coverage)
- `src/pages/CheckoutPage.tsx` (unchanged logic; documented mapping to stored test Price IDs)

## Database migrations required

- `catalog_products`, `catalog_variants`, `catalog_memberships`, `stripe_sync_log`, `admin_audit_log`, `processed_stripe_events`, and an `admins` (or role) mechanism, all with RLS. Money stored as integer cents. UUID primary keys.
