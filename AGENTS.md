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
- Flow: `CheckoutPage` → `create-invoice-order` → `create-kashu-checkout-session` → **top-level** navigate to `checkout.mybaremethod.com` via `navigateToKashuHostedCheckout` (HTTPS host allowlist). Bolt Preview embeds MBM in an iframe — **never** fall back to same-frame `window.location.assign` when framed (causes `checkout.mybaremethod.com refused to connect`). Breakout order: `window.top.location.href` → `top.location.assign` → `window.open(url, '_top')` → `<a target="_top">`. Browser return never marks paid.
- Kashu/Tagada gate: `resolveKashuCardEnabledFlag` — explicit `VITE_KASHU_CARD_ENABLED=false` kills card; `true` forces on; **undefined/empty defaults ON** (do not key off `import.meta.env.PROD` — Bolt Preview often builds non-PROD without reliable VITE injection). Prefer Tagada hosted checkout/init over Pay V2. If hosted init fails, show contact/retry copy — do **not** auto-fall back to public ACH/Wire.
- Card eligibility: one-time carts (no membership+ordinary-merchandise mix), **or** SEM/TIRZ membership recurring carts with optional required provider-visit SKU (IPV/FUV) as a one-time enrollment line; unsupported shipping, unmapped SKUs, and **any unexpected `tax_cents > 0`** (`TAGADA_UNEXPECTED_TAX_AMOUNT` fail-safe). Do not re-enable separate MBM tax add-ons without an explicit product decision.
- **Membership Tagada card recurring (SEM / TIRZ):**
  - Semaglutide Membership `MBM-MEM-SEM-MEM-001` — **$149/month base** (display) — base Tagada `price_344d3dacb4ab` (`variant_6973906c4bd6`) — keep; do not delete
  - Tirzepatide Membership `MBM-MEM-TIR-MEM-001` — **$249/month base** (display) — base Tagada `price_5cf1fa89610c` (`variant_b3890c799e09`) — keep; do not delete
  - **Combo recurring prices (membership + selected shipping)** — enrollment uses these `priceId`s (not base):
    - SEM + Two-Day `$179/mo` → `price_41179f7cafe2` (17900)
    - SEM + Next-Day `$199/mo` → `price_7ce0f74a7509` (19900)
    - TIRZ + Two-Day `$279/mo` → `price_e0ebef9851a8` (27900)
    - TIRZ + Next-Day `$299/mo` → `price_ef9ea132d6cf` (29900)
  - Hosted recurring init **must** send both `variantId` + **combo** `priceId` (priceId authoritative). Do not recreate Tagada store ShippingRates. Do not use `addDeliveryOnRebill`.
  - Tagada handles automatic monthly rebill; MBM `customer_memberships` + `tagada-webhook` `subscription/*` events are authoritative for status. Rebill amount validation uses stored `monthly_amount_cents` (combo), not always 14900/24900.
  - **Browser return never activates membership.** Activate only on Tagada payment/subscription evidence.
  - **3-month minimum** is MBM-enforced (`minimum_term_ends_at`) — do not assume Tagada-native cancel lock.
  - Recurring program product remains **not shippable** (`isShippable=false`, `addDeliveryOnRebill=false`). Shipping dollars are inside the combo recurring price — **do not** append `MBM-SHIP-*` on membership enrollment (prevents duplicate shipping). Membership value stays excluded from the **$500** free-shipping merchandise threshold.
  - Tirzepatide membership included formulations through **15mg**; **30mg excluded**. Requested dose is subject to provider approval (not guaranteed).
  - Public membership checkout: Credit/Debit Card only (ACH/Wire hidden). Mixed SEM+TIRZ or membership+ordinary merchandise carts fail safely.
  - **Required provider visit exception:** membership + Initial Provider Visit (`MBM-PC-IPV-SRV-001`, $75 one-time) is allowed in one Tagada hosted checkout. IPV never recurs.
  - **Combo enrollment shipping:** customer selects Two-Day `$30` or Next-Day `$50`. Storefront still breaks out Membership + Shipping. Due today = combo monthly + IPV; renews = combo monthly. Persist `base_membership_amount_cents`, `shipping_cents`, `selected_shipping_method`, `monthly_amount_cents` (combo), `tagada_price_id` (combo). Ordinary one-time product carts still append `MBM-SHIP-TWO-DAY-001` / `MBM-SHIP-NEXT-DAY-001`. Do **not** recreate Tagada store Shipping Rates.
  - Migrations: `20260819140000_customer_memberships.sql`, `20260819190000_membership_combo_shipping_fields.sql`. Redeploy Edge after apply: `create-kashu-checkout-session`, `tagada-webhook` (and `cancel-membership-subscription` if changed).
  - After membership combo shipping cutover: redeploy **`create-kashu-checkout-session`** + **`tagada-webhook`**.
- Tagada credentials: keep real `TAGADA_API_KEY` / `TAGADA_STORE_ID` in **BSG Edge secrets**. Agent env may only see Management API digests — call Tagada via Edge (`tagada-product-sync`) instead of treating digests as keys. Store binding uses `checkout.mybaremethod.com`.
- Public `public_order_number` values are allocated server-side via Postgres `generate_public_order_number()` (`nextval` on `order_number_seq`). If the sequence drifts behind existing `MBM-YYYY-######` rows, insert can hit `orders_public_order_number_key` — repair with migration `20260819120000_repair_public_order_number_allocator.sql` (collision-skipping allocator + sequence resync). `create-invoice-order` also retries allocation on 23505 and never returns raw Postgres errors to customers.
- Payment instructions: `/order/payment/:publicOrderNumber?token=...` (token issued at order creation). Admin marks funds received via Orders UI / `mark-payment-received` after verification (ACH/Wire emergency path).
- Shared pricing authorization still lives in `src/lib/checkout/` (membership $149/$249, Auto-Refill 10%, member 15%, accessory 15% non-stacking, Two-Day $30 / Next-Day $50, memberships excluded from $500 free-shipping merchandise threshold). Accessory/Provider Care **add-on tax rates are 0** (tax-inclusive).
- Legacy Stripe Edge Functions remain in repo but must not be deployed for launch. **Do not re-enable Stripe.**

### Promo code OGTBM (pre-production)

- Code: **`OGTBM`** — **$50 off each eligible unit** (quantity-aware). Not $50 off the order. Never discounts a line below $0.
- Authoritative math: `src/lib/promo/ogtbmPromo.ts` (+ Edge `_shared/ogtbmPromo.ts`). Applied in `buildAuthoritativeOrderLines` / `create-invoice-order`; persists `orders.promo_code` + `discount_cents`.
- **Excluded** (structured category/SKU/productId — not display-name): accessories, dermatology (`prescription-skin-hair` / `MBM-SH-*`), all provider care (`pc*` / `MBM-PC-*` including Lab Kit + Lab Review), shipping (`MBM-SHIP-*`), memberships (`m1`/`m2` / `MBM-MEM-*`).
- **Membership:** OGTBM must never alter combo recurring amounts (SEM Two-Day 17900 / SEM Next-Day 19900 / TIRZ Two-Day 27900 / TIRZ Next-Day 29900). Checkout UI blocks promo on membership carts; `create-kashu-checkout-session` rejects membership enrollment when `discount_cents > 0`.
- Card path: when OGTBM applies, Edge binds discounted one-time Tagada `priceId`s on eligible variants so hosted total equals MBM `orders.total_cents`. Do not rely on Tagada dashboard promo rules for eligibility.

### HRT Lab Kit + Lab Review (pre-production)

- **Lab Kit** `pc4` / `MBM-PC-LAB-KIT-001` = **$200** (20000¢). Tagada: `product_b205358e0b51` / `variant_aae06bdc9f85` / `price_d2dc86f6b8d0`. **Shipping included** — do not add Two-Day/Next-Day for the kit; product is non-shippable provider-care.
- **Lab Review** `pc3` / `MBM-PC-LAB-SRV-001` = **$60** (6000¢). Tagada: `product_71d2d139cecb` / `variant_31baa3269d52` / `price_a02956edce74` (updated from $55).
- **Required package** = $260 once per applicable initial HRT order (not per HRT line). Auto-add via `src/lib/provider/hrtLabPackage.ts` inside `buildAuthoritativeOrderLines`.
- Copy: “Required for initial HRT order” / “Lab Kit shipping included.” Not medication.
- **Returning customers:** no dedicated lab-validity table. Skip auto-add when `customer_therapy_history` has any **APPROVED** HRT family (`estradiol-patch` / `progesterone-capsules` / `testosterone-cream`). Do not invent a lab-expiration window.
- Medication shipping still follows normal MBM rules when HRT meds are in the cart; Lab Kit itself does not contribute shippable merchandise.
- Migration: `20260819193000_orders_promo_code.sql`. Redeploy: `create-invoice-order`, `create-kashu-checkout-session`.

### Tagada / Kashu shipping + tax architecture (finalized — preserve)

Permanent rules for future agents. Do not regress these:

- My Bare Method is the authoritative shipping source of truth. Do not infer shipping from Tagada cart subtotal, store rates, or funnel UI.
- Do NOT recreate Tagada store-level Shipping Rates.
- Do NOT recreate/add the ShippingRates / Shipping Method island to the Simple Checkout funnel. (Applies to Simple Checkout on `checkout.mybaremethod.com`.)
- Hiding Tagada rates is NOT sufficient; store rates must remain absent. (Phase 2C proved hide ≠ disable; rates must stay deleted.)
- Two-Day shipping is represented by mapped MBM-SHIP-TWO-DAY-001. ($30 / `shipping_cents=3000`, appended by `create-kashu-checkout-session` for **one-time product carts only**.)
- Next-Day shipping is represented by mapped MBM-SHIP-NEXT-DAY-001. ($50 / `shipping_cents=5000`, appended by `create-kashu-checkout-session` for **one-time product carts only**.)
- Membership enrollment does **not** append MBM-SHIP lines — shipping is inside the combo recurring `priceId`.
- Free/service-only shipping uses no shipping line. (`shipping_cents=0`.)
- Allowed card-flow shipping amounts are currently $0, $30, or $50; other positive amounts must fail safely. (`TAGADA_SHIPPING_PARITY_BLOCKER`.)
- Tagada hosted total must exactly equal MBM `orders.total_cents`. (Reject with `TAGADA_CHECKOUT_TOTAL_MISMATCH` before redirect.)
- Do not weaken webhook amount equality. (Paid amount must match MBM order total.)
- Tagada payment products used by MBM hosted checkout remain **`isTaxable=false`**. Do **not** enable Tagada automatic tax / TaxJar categories for checkout totals. Do not delete unused dashboard Provider Tax 1.8% / Sales Tax 8% records unless explicitly required — they may remain unused config.
- Membership SEM/TIRZ card recurring is implemented separately from one-time hosted card (see membership section above). Do not treat remaining unmapped `MBM-MEM-*` SKUs as card-eligible.
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

### Tagada / GEN commerce hardening (Phase 12F.1 / 12G / 12H / 12I / 12I.1)

- Config table (names only): `docs/COMMERCE_STAGING_PRODUCTION_CONFIG.md`. Checkpoint notes: `docs/PHASE_12F1_COMMERCE_CHECKPOINT.md`. GEN mapping: `docs/PHASE_12G_GEN_CATALOG_MAPPING.md`. Definitive 28-SKU formulary/pricing matrix: `docs/PHASE_12I2_28_SKU_FORMULARY_PRICING_MATRIX.md` (+ `.json`). Website catalog alignment + owner pricing prep: `docs/PHASE_12I3_WEBSITE_CATALOG_ALIGNMENT.md`. Final formulary/pharmacy/pricing approval matrix: `docs/PHASE_12I4_FINAL_FORMULARY_PHARMACY_PRICING.md` (+ `.json`). White-label GEN V2 wrapper: `docs/PHASE_12I5_WHITE_LABEL_GEN_API_WRAPPER.md`. Remaining mapping notes: `docs/PHASE_12I2_REMAINING_GEN_MAPPING.md`. Clinical sync: `docs/PHASE_12H_GEN_CLINICAL_STATUS_SYNC.md`. Staging E2E + cutover plan: `docs/PHASE_12I_STAGING_E2E_AND_PRODUCTION_CUTOVER.md`. External-paid / API Orders: `docs/PHASE_12I1_GEN_EXTERNAL_PAID_RESOLUTION.md`.
- **Shipping:** server-authorized cents are only `0` / `3000` / `5000`. Demo Tagada `1156` and `demo_store_forced_shipping` are rejected. Do not reintroduce Demo shipping hacks into production paths.
- **Rx GEN guard:** `REQUIRE_GEN_MAPPING_FOR_RX` + `MBM_RUNTIME_ENV` + `GEN_API_ORDERS_ENABLED`. Production defaults fail-closed for Rx without READY/ACTIVE `gen_sku_map`; when that guard is on, also require `GEN_API_ORDERS_ENABLED=true` (default false until Scriptful/GEN enables API Orders). Staging defaults open for mapping guard. Accessories skip GEN mapping. Wired in `create-invoice-order` and `assertCartEligibleForCheckout`. Do not conflate with `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED` (payload flag) or `VITE_GEN_API_ORDERS_ENABLED` (UX-only).
- **12J.0 single-SKU live-test override:** `PRODUCTION_CHECKOUT_TEST_SKU` may temporarily allow **exactly one** Rx SKU past GEN map + API Orders gates for payment validation only. Does **not** enable GEN handoff or other Rx. Production currently has **no** `gen_sku_map` (GEN schema deferred) — payment-only tests use `kashu_sku_map` + Tagada webhook. See `docs/PHASE_12J0_CONTROLLED_LIVE_CHECKOUT.md`. Unset the secret after the test. Never enable `GEN_HANDOFF_AUTOMATION_ENABLED` for 12J.0.
- **Owner formulary rule (12I.4):** one pharmacy per product + delivery type; do not invent landed cost when shipping is unknown; do not treat different formulations as equivalent; do not activate pharmacy winners from external workbooks until cross-checked against GEN. `GEN_API_ORDERS_ENABLED` stays false unless owner confirms. Do not start 12J from formulary docs alone.
- **White-label GEN (12I.5):** NO browser→GEN. All GEN HTTP via server wrapper (`genHealth` / Edge `_shared`). Do not couple app code to raw GEN response shapes — normalize at wrapper boundary (`Clinical*` types). GEN product forms are clinical source of truth; do not invent questionnaires. Do not persist full clinical answers locally unless operationally required (prefer Edge → GEN submit). Tagada remains payment authority before `markGenOrderPaid`. `GEN_HANDOFF_AUTOMATION_ENABLED` stays false. No local clinical truth overrides (requiredActions completion only from GEN sync).
- **Paid authority:** browser / `get-order-payment-status` never marks paid; only `tagada-webhook` does. Correlation never uses email alone.
- **GEN:** `GEN_HEALTH_ENABLED` and `GEN_HANDOFF_AUTOMATION_ENABLED` default **false**. Post-paid gate: `canStartGenHandoff`. Manual handoff via admin-authenticated `gen-health-handoff` only (`forceManual=true` when automation off). Tagada webhook must not auto-call GEN. Membership rebill never creates GEN medication orders. Staging map: BPC READY; other Rx BLOCKED until verified. Migrations `20260821120000_gen_health_v2.sql`, `20260821160000_gen_clinical_status_sync_12h.sql`, `20260821170000_gen_service_role_grants_12i.sql` are additive — do **not** apply to production without approval.
- **GEN clinical sync (12H):** Admin refresh via `gen-health-sync` (JWT + `is_admin`). Customer-safe read via `get-order-clinical-status` or RLS `order_gen_orders` select-own. Browser never writes clinical status / never locally marks requiredActions complete. GEN webhook remains fail-closed until signature spec is documented. Unknown GEN statuses → `GEN_UNKNOWN` (never auto-fulfill). Payment stays `paid` on GEN sync failure (`GEN_RETRY_REQUIRED`).
- **GEN order create (12I / 12I.1 staging-confirmed):** POST body must be `{ patient_id, order: { clientProductId, transactionId, ... } }`. Documented external-paid field is nested `order.payment_status="paid"`. Staging client currently returns HTTP 400 (“…not enabled for this client… enable API Orders”) when that field is sent — keep `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED` unset until GEN support enables API Orders and staging re-verify shows non-`pending_payment`. Do **not** locally overwrite GEN payment/clinical state. `requiredActions` may be string tokens (`forms` / `uploads` / `patient_continuation`). Never persist or expose GEN `magicLink` / `magic-login` / `token=` URLs. Sync must **not wipe** a non-empty local requiredActions snapshot when GET omits actions. See `docs/PHASE_12I1_GEN_EXTERNAL_PAID_RESOLUTION.md`.
- **Staging-only GEN helpers:** `gen-health-list-products`, `gen-health-catalog-write`, `gen-health-qa-patient`, `gen-health-qa-patient-probe`, `gen-health-qa-order-probe` — **do not deploy to production**.
- Staging QA SKU `MBM-QA-TAGADA-DEMO-001` is DB-only — not a storefront catalog SKU. Do not promote Demo store / webhook / QA order artifacts to production. Phase 12I PATH B fixtures use `fixture_12i_tx_NOT_REAL_TAGADA_*` / `@example.com` only — never treat as Tagada payment authority.
- GEN Products API uses header `x-api-key` (not Bearer) for `/v2/client/products`.
- **GEN list vs formulary view:** default `GET /v2/client/products` → `data.products[]`. `?view=formulary` → `data.formularyProducts[]` (standardizedMedicationName + pharmacyName + medicationId linked by productId). Staging helper `gen-health-list-products` accepts `{"view":"formulary"}`. Catalog import plan: `docs/GEN_CATALOG_IMPORT_PLAN.md`.
- **GEN client product writes (GEN-CATALOG-2A confirmed):** `POST /v2/client/products` (create) and `PATCH /v2/client/products/{productId}` (update). Writable fields include `displayName`, `customerPrice`, `showPatient`, `status` (`active`/`inactive`), `requiresSyncVisit`, `quantityMonths`, `supplyUnit`, `displayDescription` — **not** nested `pricing`, not `active` boolean, not `storefrontEligible`, not `name`/`description` on PATCH. Deactivate via `status=inactive` (inactive products drop from the default list). `DELETE /v2/client/products/{id}` also works. **Formulary pairing create/update is not available** via the Client Products API (medicationId fields rejected; no pairing subpaths found) — pairings must be attached in GEN admin UI until an API is documented. Staging proxy: `gen-health-catalog-write` (`confirmWrite:true` required for mutations). Live write report: `docs/GEN_CATALOG_2A_LIVE_WRITE_REPORT.md`. Do **not** start GEN-CATALOG-2B (future hidden) or enable GEN/Whop cutover from 2A.
- **Patient-facing catalog architecture (GEN-CATALOG-ARCHITECTURE-LOCK):** Owner-facing lock of client products over SELECTED FORMULARY is in `docs/MBM_FINAL_PATIENT_PRODUCT_ARCHITECTURE.md` (+ `.json`). Target weight formulations are **B12 and Glycine** (not B6). SEM dose groups are owner-defined; TIR tier boundaries need owner approval. Membership backend flags `SEM_MEMBERSHIP_STRUCTURE_REQUIRES_SPLIT` / `TIR_MEMBERSHIP_STRUCTURE_REQUIRES_SPLIT` — do not invent a one-CP dual-ladder workaround. Stop for owner approval; no pairing checklist / no 2B until approved.
- **MyBareMethod medication pricing authority (owner-locked):**
  - **Standard one-time:** `(cost × 1.75) + pharmacy shipping` → nearest whole-dollar **$X9** (equidistant → round UP).
  - **3-month:** `((monthly cost × 1.75) + monthly shipping) × 3` → nearest $X9.
  - **6-month:** `((monthly cost × 1.75) + monthly shipping) × 6` → nearest $X9.
  - **Semaglutide Compound Any Dose Membership:** **$149/month** (owner-set; not auto 1.75).
  - **Tirzepatide Compound Any Dose Membership:** **$275/month** (owner-set; not auto 1.75).
  - Medication shipping is **included** in retail — do not add pharmacy shipping again at website checkout. Accessory shipping is separate. Provider visits separate.
  - Never treat per-unit / per-capsule / per-mL cost as complete dispense cost without verified quantity.
  - Newest verified pharmacy/formulary cost is cost authority. Current GEN and website retail are reference only.
  - Do not change these rules without explicit owner approval. Authority docs: `docs/GEN_FINAL_MBM_RETAIL_PRICING.md`, `docs/GEN_FINAL_LIVE_WRITE_GATE.md`.

- **Cloud env gotcha:** some agent env vars named `STAGING_URL` / `SUPABASE_URL` may still point at production (`bsgtuuzwgeetsjjdrtrm`). For staging GEN ops always use project ref `mxvaxkkwrbwhqasnsjpm` explicitly (`https://mxvaxkkwrbwhqasnsjpm.supabase.co`). Never deploy GEN functions or migrations to production from Phase 12I / 12I.1.
- **Tagada sandbox caution:** prior CRM `testMode=true` + 4242 still hit live rails. Do not retry PATH A card flows until a true non-live sandbox rail is authoritatively confirmed.
- **Cutover:** keep `GEN_HANDOFF_AUTOMATION_ENABLED=false` on first production deploy. Seed only BPC READY; remaining Rx BLOCKED until owner-approved map readiness (staging GEN catalog is much larger than the old 22-product snapshot — see `docs/GEN_CATALOG_IMPORT_PLAN.md`; do not treat catalog presence as READY). SEM/TIR membership med-fulfillment promises while maps are BLOCKED are a launch blocker. **Production Rx cutover remains BLOCKED** until GEN API Orders / external-paid is enabled and staging GEN orders no longer stick at `pending_payment`/`unpaid` after paid handoff. Ambiguous GEN candidates must never be marked READY without owner validation. Metformin remains **DO NOT ADD** / do not website-activate even if present in GEN.

### Website family → GEN routing (preview only — cutover OFF)

- Architecture data: `src/data/websiteFamilies/` (30 families / 103 variants). Preview routes: `/preview/families`, `/preview/families/:familyId`. Live `/product/*` storefront stays legacy (B6 SEM/TIR) until cutover.
- Flags stay OFF: `WEBSITE_FAMILY_CUTOVER_ENABLED`, `REAL_GEN_ORDER_SUBMISSION_ENABLED`. Do not publish new architecture, remove legacy B6, enable GEN/Whop cutover, or invent GEN `clientProductId`s.
- **Pairing policy (amended):** `docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md`. `genPairingVerified` may be true when the GEN CP has ≥1 **compatible** formulary medication (correct family/additive/form + approved pharmacy) and **no material mismatches**. Multiple same-family strengths may remain for provider choice. Do **not** require exact strength/package equality (GEN API often omits those fields). Still reject B12↔Glycine cross-wire, inj/nasal mismatch, wrong pharmacy family, B6, unrelated blends.
- Registry: `pairingVerificationRegistry.ts` → apply via `applyPairingVerification.ts` (also promotes `GEN_PAIRING_PENDING` → `ROUTING_READY` for verified CPs only). Latest: `docs/MBM_GEN_MANUAL_FIX_CLOSEOUT_2.md` — owner claimed 7 locked fixes done; **live GEN still shows those 7 missing/incompatible** (still **8/15** verified; CREATE phase **not** authorized). Fix plan: `docs/MBM_GEN_FINAL_MANUAL_FIX_PLAN.md`. Diagnostic: `docs/MBM_GEN_SCRIPTful_PAIRING_DISCREPANCY_DIAGNOSTIC.md` (watch wrong-target CPs: GLP-2 `SvFDJ7…`, Minoxidil `Raw7m…`, Wolverine capsule med on injection CP). Next creates: `docs/MBM_GEN_NEXT_CREATE_PREFLIGHT.md` (13) unchanged — do not execute.
- Owner QA / click guide / checklist: `docs/MBM_WEBSITE_FAMILY_OWNER_QA.md`, `docs/MBM_GEN_PAIRING_OWNER_CLICK_GUIDE.md`, `docs/MBM_GEN_PAIRING_VERIFICATION_CHECKLIST.md`.
- Live GEN handoff gate: `src/lib/catalog/familyRoutingGate.ts`. Browser UI must never bypass it. Cutover OFF still blocks real GEN orders even when `ROUTING_READY`.

### GitHub source of truth vs Bolt (permanent)

**Current ACH/Wire production tip (post-reconcile):** `deploy/ach-launch-clean-2026`  
**Historical immutable source label:** `production-source/my-bare-method-2026`  
**Immutable pre-launch tag:** `my-bare-method-integrated-prelaunch-v1`

- After production-source reconciliation (PRs #8 + #12 + #13), treat `deploy/ach-launch-clean-2026` as the production storefront tip (tax-inclusive + card-first for eligible one-time carts; SEM/TIRZ Tagada recurring membership card billing included). Do not rely on committed `.env.production` for the card flag (Bolt may delete it); **unset `VITE_KASHU_CARD_ENABLED` defaults the gate ON** even in non-PROD/Bolt Preview builds. Explicit `false` is the kill switch.
- Bolt-controlled branches (for example `deploy/my-bare-method-integrated-2026`, `release/my-bare-method-final-2026`, and similar Bolt sync targets) are **disposable mirrors only**.
- Never reconcile a source-of-truth / production-source branch by pulling a Bolt “Start repository” commit into it.
- Never force-update historical `production-source/*` labels from Bolt.
- All code changes originate from Cursor / GitHub source branches (`deploy/*`, `production-source/*`, `source-of-truth/*`, feature branches).
- Bolt must never be treated as authoritative Git history.
- Existing release tags (`my-bare-method-integrated-prelaunch-v1`, `customer-account-phase*-v1`, `deploy-pre-account-*`) are **immutable rollback points** — do not move or recreate them.
