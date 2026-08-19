# AGENTS.md

## Cursor Cloud specific instructions

This is a **Vite + React + TypeScript** static e-commerce frontend ("My Bare Method"). It is a single-page app with a small custom hash/path router (`src/router.tsx`); there is no separate backend server to run for local development. Supabase Edge Functions power order creation and payment-instruction retrieval. Public one-time checkout is **tax-inclusive + Tagada hosted Credit/Debit Card** (ACH/Wire remain backend/admin fallbacks only; Stripe stays disabled). See `docs/project-status-2026.md`.

### Services / commands

There is a single service (the Vite frontend). Standard commands live in `package.json` scripts:

- Dev server: `npm run dev` (serves on http://localhost:5173).
- Lint: `npm run lint` (ESLint). Note: the checked-in code currently has pre-existing lint errors (unused imports, conditional-hook usage) and one `typecheck` error in `src/pages/ProductPage.tsx`. These are code issues, not environment issues — do not treat them as setup failures.
- Typecheck: `npm run typecheck` (`tsc --noEmit`).
- Build: `npm run build` — this does a normal `vite build`, then a second SSR build, then runs `node dist/prerender/prerender.js` to prerender ~109 static routes and generate `sitemap.xml`. The build does not run `tsc`, so the pre-existing type error does not block it.
- Preview production build: `npm run preview`.

### Non-obvious notes

- Active checkout CTA for card: **Continue to Secure Payment** (creates invoice order then Tagada hosted session). ACH/Wire emergency/admin path still uses payment-instructions pages. Stripe is retired — see `docs/stripe-legacy-inventory.md`.
- Without `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, browse/cart/checkout form still work; only final order submit fails.
- Bank ACH/wire details are **Edge Function secrets only** (`MANUAL_ACH_*` / `MANUAL_WIRE_*`). Never put them in `VITE_*` or frontend source.
- Node 22 is used here and works with Vite 5.
- Customer account portal (`/account/*`) uses the same browser Supabase anon client as checkout. Auth screens may show an “unavailable until configured” state when local env vars are missing; that does **not** mean Bolt/Supabase is unconfigured. Admin Google auth remains separate (`/admin/*`, `admins` / `is_admin()`). See `docs/customer-account-phase1.md`.

### Checkout (tax-inclusive + card-first)

- **Customer pricing is tax-inclusive.** Displayed retail/service prices are the customer product/service price. Do **not** add separate Sales Tax / Provider Care Tax lines at checkout. NEW orders must persist `tax_cents = 0`. Authoritative customer charge = `subtotal_cents + shipping_cents` (= `total_cents`). Historical orders may still have non-zero `tax_cents` — leave them untouched. Do not build a tax-filing engine in checkout.
- Disclosure (concise): “Applicable taxes are included in displayed prices where required.” Do not claim tax-free / exempt / no taxes.
- Public payment selector (eligible one-time carts): **Credit / Debit Card** only (primary/default). Hide ACH / Wire from the public storefront. Keep ACH/Wire backend + admin/manual invoice paths and payment enums (`manual_ach` / `manual_wire`). `plaid_ach` remains reserved/disabled.
- Flow: `CheckoutPage` → `create-invoice-order` → `create-kashu-checkout-session` → `checkout.mybaremethod.com` → `tagada-webhook` → MBM paid. Browser return never marks paid.
- Kashu/Tagada gate: `resolveKashuCardEnabledFlag` — explicit `VITE_KASHU_CARD_ENABLED=false` kills card; `true` forces on; **undefined/empty defaults ON** (do not key off `import.meta.env.PROD` — Bolt Preview often builds non-PROD without reliable VITE injection). Prefer Tagada hosted checkout/init over Pay V2. If hosted init fails, show contact/retry copy — do **not** auto-fall back to public ACH/Wire.
- Card eligibility blocks: memberships / mixed membership, unsupported shipping, unmapped SKUs, and **any unexpected `tax_cents > 0`** after tax-inclusive migration (`TAGADA_UNEXPECTED_TAX_AMOUNT` fail-safe — do not silently ignore). Do not re-enable separate MBM tax add-ons without an explicit product decision.
- Memberships: **not** one-time hosted card. Prefer controlled “online membership enrollment is being updated / contact us” messaging until recurring card billing exists. Preserve $149 / $249, 3-month minimum, locked pricing, provider-review rules. Do not modify membership pricing here.
- Tagada credentials: keep real `TAGADA_API_KEY` / `TAGADA_STORE_ID` in **BSG Edge secrets**. Agent env may only see Management API digests — call Tagada via Edge (`tagada-product-sync`) instead of treating digests as keys. Store binding uses `checkout.mybaremethod.com`.
- Orders are created with `payment_status = awaiting_payment` and are **never** auto-marked paid from the browser.
- Payment instructions: `/order/payment/:publicOrderNumber?token=...` (token issued at order creation). Admin marks funds received via Orders UI / `mark-payment-received` after verification (ACH/Wire emergency path).
- Shared pricing authorization still lives in `src/lib/checkout/` (membership $149/$249, Auto-Refill 10%, member 15%, accessory 15% non-stacking, Two-Day $30 / Next-Day $50, memberships excluded from $500 free-shipping merchandise threshold). Accessory/Provider Care **add-on tax rates are 0** (tax-inclusive).
- Legacy Stripe Edge Functions remain in repo but must not be deployed for launch. **Do not re-enable Stripe.**

### Tagada / Kashu shipping + tax architecture (finalized — preserve)

Permanent rules for future agents. Do not regress these:

- My Bare Method is the authoritative shipping source of truth. Do not infer shipping from Tagada cart subtotal, store rates, or funnel UI.
- Do NOT recreate Tagada store-level Shipping Rates.
- Do NOT recreate/add the ShippingRates / Shipping Method island to the Simple Checkout funnel. (Applies to Simple Checkout on `checkout.mybaremethod.com`.)
- Hiding Tagada rates is NOT sufficient; store rates must remain absent. (Phase 2C proved hide ≠ disable; rates must stay deleted.)
- Two-Day shipping is represented by mapped MBM-SHIP-TWO-DAY-001. ($30 / `shipping_cents=3000`, appended by `create-kashu-checkout-session`.)
- Next-Day shipping is represented by mapped MBM-SHIP-NEXT-DAY-001. ($50 / `shipping_cents=5000`, appended by `create-kashu-checkout-session`.)
- Free/service-only shipping uses no shipping line. (`shipping_cents=0`.)
- Allowed card-flow shipping amounts are currently $0, $30, or $50; other positive amounts must fail safely. (`TAGADA_SHIPPING_PARITY_BLOCKER`.)
- Tagada hosted total must exactly equal MBM `orders.total_cents`. (Reject with `TAGADA_CHECKOUT_TOTAL_MISMATCH` before redirect.)
- Do not weaken webhook amount equality. (Paid amount must match MBM order total.)
- Tagada payment products used by MBM hosted checkout remain **`isTaxable=false`**. Do **not** enable Tagada automatic tax / TaxJar categories for checkout totals. Do not delete unused dashboard Provider Tax 1.8% / Sales Tax 8% records unless explicitly required — they may remain unused config.
- Memberships remain outside one-time hosted card until recurring card processing is implemented separately. (`MEMBERSHIP_DEFERRED`.)
- Do not re-enable Stripe.
- Phase 3 controlled live card test **PASS**. Card gate defaults **ON** when `VITE_KASHU_CARD_ENABLED` is unset (Bolt Preview + production); explicit `false` remains the emergency kill switch. If customer card payments fail webhook/parity, disable the flag and redeploy immediately.

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

### New catalog candidates (Tesamorelin / Fat Burner)

- `tesamorelin` (`p73`) and `fat-burner` (`p74`) are in the TypeScript catalog + SKU registry + additive migration `20260811120000_tesamorelin_fat_burner.sql`.
- Owner-approved retail: Tesamorelin **$149.00** (at-cost $83.33); Fat Burner **$259.00** (at-cost $150.00). Customer-facing copy medical-director approved. Both products are **active + visible** in catalog/backend for storefront publish. Do not auto-deploy frontend from Cursor without explicit publish step.
- Fat Burner is **not** SLU-PP-332.

### Product descriptions

- Customer-facing copy lives in `src/data/productCopy.ts` (structured About / Common Uses / How It Works / What to Expect / Important Information) and is merged in `mk()` / membership definitions.
- PDP layout: `ProductDescriptionSections` on wellness + accessories; membership detail has its own stacked sections.
- Review packet: `docs/product-description-review.md` (regenerate via `npx tsx scripts/gen-product-description-review.ts`). Do not invent formulations when catalog says “Blend” / “Combination formula”.

### Variant-level SKUs (Scriptful)

- Registry: `src/data/variantSkus.ts` (48 retail + 2 membership PROGRAM SKUs = 50).
- Membership PROGRAM vs FULFILLMENT crosswalk: `src/lib/catalog/membershipSkuCrosswalk.ts`.
- Export: `docs/scriptful-variant-skus.md` + `docs/scriptful-variant-skus.csv` (regenerate via `npx tsx scripts/gen-scriptful-variant-skus.ts`).
- Additive migration (do **not** apply until approved): `supabase/migrations/20260811090000_variant_skus.sql` — adds `catalog_variants.sku` (unique when non-null), and `order_items.sku` / `variant_id` / `fulfillment_sku`.
- Accessories and provider-care SKUs live in TypeScript only (not DB `catalog_variants`).
- Invoice checkout sends SKU fields via `create-invoice-order` after the migration is applied; without the migration, PostgREST will reject unknown columns on insert.

### Provider appointment automation (Phase 2)

- Docs: `docs/provider-appointment-automation.md` (rules), `docs/provider-automation-product-scope.md` (15 Rx families).
- Pure engine: `src/lib/provider/` (mirrored in `supabase/functions/_shared/` for Deno).
- Pending migration (do **not** apply until approved): `supabase/migrations/20260812120000_provider_appointment_automation.sql` — `customer_therapy_history` + order `provider_*` fields.
- `create-invoice-order` injects required Initial ($75) / Follow-Up ($55) visit server-side; guest Rx requires auth.
- Admin: CrossTx is **manual tracking only** (Mark Completed); Record Provider Approval writes therapy history. Paid ≠ approved.
- Fulfillment: final shipping paths need paid + (NONE or COMPLETED workflow + APPROVED history). `provider_review_in_progress` still only needs paid.
- Do not call CrossTx APIs; do not enable Kashu card; do not treat payment as therapy approval.

### GitHub source of truth vs Bolt (permanent)

**Current ACH/Wire production tip (post-reconcile):** `deploy/ach-launch-clean-2026`  
**Historical immutable source label:** `production-source/my-bare-method-2026`  
**Immutable pre-launch tag:** `my-bare-method-integrated-prelaunch-v1`

- After production-source reconciliation (PRs #8 + #12 + #13), treat `deploy/ach-launch-clean-2026` as the production storefront tip (tax-inclusive + card-first for eligible one-time carts). Do not rely on committed `.env.production` for the card flag (Bolt may delete it); **unset `VITE_KASHU_CARD_ENABLED` defaults the gate ON** even in non-PROD/Bolt Preview builds. Explicit `false` is the kill switch. Memberships remain blocked from hosted card.
- Bolt-controlled branches (for example `deploy/my-bare-method-integrated-2026`, `release/my-bare-method-final-2026`, and similar Bolt sync targets) are **disposable mirrors only**.
- Never reconcile a source-of-truth / production-source branch by pulling a Bolt “Start repository” commit into it.
- Never force-update historical `production-source/*` labels from Bolt.
- All code changes originate from Cursor / GitHub source branches (`deploy/*`, `production-source/*`, `source-of-truth/*`, feature branches).
- Bolt must never be treated as authoritative Git history.
- Existing release tags (`my-bare-method-integrated-prelaunch-v1`, `customer-account-phase*-v1`, `deploy-pre-account-*`) are **immutable rollback points** — do not move or recreate them.
