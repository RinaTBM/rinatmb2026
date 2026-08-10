# AGENTS.md

## Cursor Cloud specific instructions

This is a **Vite + React + TypeScript** static e-commerce frontend ("My Bare Method"). It is a single-page app with a small custom hash/path router (`src/router.tsx`); there is no separate backend server to run for local development. Supabase Edge Functions power order creation and payment-instruction retrieval. Active checkout uses **manual invoice + ACH/wire** (not Stripe). See `docs/project-status-2026.md`.

### Services / commands

There is a single service (the Vite frontend). Standard commands live in `package.json` scripts:

- Dev server: `npm run dev` (serves on http://localhost:5173).
- Lint: `npm run lint` (ESLint). Note: the checked-in code currently has pre-existing lint errors (unused imports, conditional-hook usage) and one `typecheck` error in `src/pages/ProductPage.tsx`. These are code issues, not environment issues — do not treat them as setup failures.
- Typecheck: `npm run typecheck` (`tsc --noEmit`).
- Build: `npm run build` — this does a normal `vite build`, then a second SSR build, then runs `node dist/prerender/prerender.js` to prerender ~109 static routes and generate `sitemap.xml`. The build does not run `tsc`, so the pre-existing type error does not block it.
- Preview production build: `npm run preview`.

### Non-obvious notes

- Active checkout CTA is **Submit Order & View Payment Instructions**. It calls `create-invoice-order` (not `create-checkout-session`). Stripe is retired — see `docs/stripe-legacy-inventory.md`.
- Without `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, browse/cart/checkout form still work; only final order submit fails.
- Bank ACH/wire details are **Edge Function secrets only** (`MANUAL_ACH_*` / `MANUAL_WIRE_*`). Never put them in `VITE_*` or frontend source.
- Node 22 is used here and works with Vite 5.
- Customer account portal (`/account/*`) uses the same browser Supabase anon client as checkout. Auth screens may show an “unavailable until configured” state when local env vars are missing; that does **not** mean Bolt/Supabase is unconfigured. Admin Google auth remains separate (`/admin/*`, `admins` / `is_admin()`). See `docs/customer-account-phase1.md`.

### Checkout (manual invoice launch)

- Payment methods: `manual_ach` (primary), `manual_wire` (secondary). `plaid_ach` is reserved/disabled until Plaid production approval.
- Orders are created with `payment_status = awaiting_payment` and are **never** auto-marked paid.
- Payment instructions: `/order/payment/:publicOrderNumber?token=...` (token issued at order creation).
- Admin marks funds received via Orders UI / `mark-payment-received` after verification.
- Shared pricing authorization still lives in `src/lib/checkout/` (membership $149/$249, Auto-Refill 10%, member 15%, accessory 15% non-stacking, Two-Day $30 / Next-Day $50, memberships excluded from $500 free-shipping merchandise threshold).
- Legacy Stripe Edge Functions remain in repo but must not be deployed for launch.

### Bolt Database / migration safety (permanent)

This project uses **Bolt Database backed by Supabase**.

- Cursor/local VM may not have `VITE_SUPABASE_*` or production database credentials.
- Do **not** assume missing local credentials mean Bolt/Supabase is unconfigured.
- Do **not** apply production database migrations from Cursor by default.
- Do **not** request or store production database secrets in source files.
- Prepare migration plans and verification SQL in Cursor.
- Apply approved migrations through Bolt/Supabase only after **explicit user approval**.
- Never run database reset, destructive migration, truncate, or drop commands against production.
- Never run live Stripe sync from Cursor unless the production execution path, credentials, dry-run, and explicit approval are all confirmed.
- Bolt-managed Supabase environment variables and secrets should remain server-side.
- Preserve existing customer, product, membership, Stripe, and admin data.

### Customer account Phase 1 — Bolt deployment checklist

Before the customer account portal can be fully tested in Bolt, manually verify:

1. Apply the approved customer-account migration.
2. Enable Email authentication.
3. Enable Google authentication.
4. Preserve the existing Google admin callback.
5. Add these allowed redirect paths:
   - `/account/auth/callback`
   - `/account/reset-password`
   - `/admin/auth/callback`
6. Configure the production Site URL.
7. Configure the password-reset email template.
8. Test customer signup/login in the actual Bolt/Supabase environment.

### Customer account Phase 2 — Bolt notes

- Pending migration: `supabase/migrations/20260807220000_customer_orders.sql` (orders, items, fulfillment, status events, admin notes). Apply only via Bolt/Supabase after approval.
- After migration: redeploy `stripe-webhook` and `create-checkout-session` edge functions (TEST only).
- Customer UI: `/account/orders`, `/account/orders/:orderId`. Admin UI: `/admin/orders`.
- See `docs/customer-account-phase2.md` and `docs/customer-account-phase2-verification.sql`.

### GitHub source of truth vs Bolt (permanent)

**Authoritative GitHub source branch:** `production-source/my-bare-method-2026`  
**Immutable pre-launch tag:** `my-bare-method-integrated-prelaunch-v1`

- Bolt-controlled branches (for example `deploy/my-bare-method-integrated-2026`, `release/my-bare-method-final-2026`, and similar Bolt sync targets) are **disposable mirrors only**.
- Never reconcile a source-of-truth / production-source branch by pulling a Bolt “Start repository” commit into it.
- Never force-update `production-source/my-bare-method-2026` from Bolt.
- All code changes originate from Cursor / GitHub source branches (`production-source/*`, `source-of-truth/*`, feature branches).
- Bolt must never be treated as authoritative Git history.
- Existing release tags (`my-bare-method-integrated-prelaunch-v1`, `customer-account-phase*-v1`, `deploy-pre-account-*`) are **immutable rollback points** — do not move or recreate them.
