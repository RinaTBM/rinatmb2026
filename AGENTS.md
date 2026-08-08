# AGENTS.md

## Cursor Cloud specific instructions

This is a **Vite + React + TypeScript** static e-commerce frontend ("My Bare Method"). It is a single-page app with a small custom hash/path router (`src/router.tsx`); there is no separate backend server to run for local development. Supabase Edge Functions (`supabase/functions/*`) plus Stripe are used only by the checkout "Place Order" action and are optional external services — the app runs and the full browse/add-to-cart/checkout-form flow works without them.

### Services / commands

There is a single service (the Vite frontend). Standard commands live in `package.json` scripts:

- Dev server: `npm run dev` (serves on http://localhost:5173).
- Lint: `npm run lint` (ESLint). Note: the checked-in code currently has pre-existing lint errors (unused imports, conditional-hook usage) and one `typecheck` error in `src/pages/ProductPage.tsx`. These are code issues, not environment issues — do not treat them as setup failures.
- Typecheck: `npm run typecheck` (`tsc --noEmit`).
- Build: `npm run build` — this does a normal `vite build`, then a second SSR build, then runs `node dist/prerender/prerender.js` to prerender ~109 static routes and generate `sitemap.xml`. The build does not run `tsc`, so the pre-existing type error does not block it.
- Preview production build: `npm run preview`.

### Non-obvious notes

- Stripe checkout (the final "Place Order" button on `/checkout`) calls a Supabase Edge Function using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (read from `import.meta.env`). Without a `.env` providing these, browsing/adding to cart/filling the checkout form all still work; only the final redirect-to-Stripe step will fail. Set those vars in a `.env` file only if you need to exercise real Stripe checkout.
- Node 22 is used here and works with Vite 5.
- Customer account portal (`/account/*`) uses the same browser Supabase anon client as checkout. Auth screens may show an “unavailable until configured” state when local env vars are missing; that does **not** mean Bolt/Supabase is unconfigured. Admin Google auth remains separate (`/admin/*`, `admins` / `is_admin()`). See `docs/customer-account-phase1.md`.

### Checkout alignment (create-checkout-session)

- Modern checkout maps Stripe TEST prices from `catalog_memberships.stripe_price_id_test` and `catalog_variants.stripe_price_id_test` after `stripe-sync`. It does **not** require legacy `public.stripe_products`.
- Shared authorization logic lives in `src/lib/checkout/` (mirrored in the Deno edge function). Frontend must send `variantId` for undiscounted one-time mapped products.
- Shipping is charged via Stripe Checkout `shipping_options` (Two-Day $30 / Next-Day $50 / free at $500+ merchandise). Browser `shipping_cents` is validated, not trusted. Provider Care–only carts do **not** get physical shipping.
- Provider Care tax: **1.8% only** on Provider Care eligible subtotal (`provider_care_tax_*` metadata + charged Stripe line item). Universal 8% is removed. Do **not** apply 1.8% to wellness, memberships, accessories, or shipping.
- Accessory sales tax is **pending** (no hardcoded rate). Stripe Tax is the recommended future path for destination-based accessory tax — do **not** enable without explicit approval.
- Provider Care (`pc1`/`pc2`/`pc3`) is intentionally **not** in stripe-sync catalog tables; checkout charges approved fixed amounts via `price_data`.
- Preserve webhook metadata keys (`client_reference_id`, `customer_user_id`, `shipping_cents`, `tax_cents`, `item_snapshots`, `provider_care_tax_*`, etc.). Do not modify `stripe-webhook` when changing checkout mapping.
- TEST-only: reject live Stripe keys. Run `stripe-sync` apply before first mapped membership/product checkout after a fresh DB.

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
