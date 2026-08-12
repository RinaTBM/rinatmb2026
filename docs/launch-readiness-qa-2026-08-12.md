# Full My Bare Method Launch Readiness QA

**Date:** 2026-08-12 (updated with Kashu underwriting status)  
**Auditor branch:** `cursor/launch-readiness-qa-945c`  
**Live site:** https://mybaremethod.com  
**Live backend:** BSG `bsgtuuzwgeetsjjdrtrm`  
**Constraints honored:** no processor changes, no Airwallex testMode change, no real card charge, no `VITE_KASHU_CARD_ENABLED`, no Stripe revival, no ACH/Wire behavior change, no deploy of storefront, no orphan Tagada deletes.

---

## KASHU STATUS UPDATE (authoritative)

Kashu confirmed:

- Merchant application **completed**
- Underwriting **still pending**
- My Bare Method has **NOT** been assigned a final processor
- After underwriting approval, Kashu will submit for gateway protection/configuration and test transactions
- A processor will then be assigned

| Field | Value |
|-------|-------|
| **KASHU CARD STATUS** | **UNDERWRITING PENDING** |
| **KASHU PROCESSOR STATUS** | **NOT YET ASSIGNED** |
| **AIRWALLEX ENTRY** (`My Bare Method - Airwallex`) | **TEMPORARY/TEST — DO NOT MODIFY** |
| **CARD LAUNCH BLOCKER** | **FINAL PROCESSOR ASSIGNMENT + KASHU TEST TRANSACTION APPROVAL** |

Do **not** assume Airwallex is the final processor. Do **not** represent card payments as live.

---

## READY NOW vs WAITING ON KASHU

### READY NOW — safe for ACH/Wire launch

| # | Item | Status |
|---|------|--------|
| 1 | Production source completeness (ACH/Wire + 52-SKU system on live) | PASS on **live**; merge PR #8 into git tip so source matches live |
| 2 | All 52 SKUs | PASS |
| 3 | 52/52 Tagada mappings | PASS (prep only; not customer card path) |
| 4 | Product pages and links (live) | PASS |
| 5 | Scriptful exports (52 unique SKUs) | PASS (align display names via PR #8 in git) |
| 6 | Tesamorelin / Fat Burner | PASS on **live** (public); git deploy base still hidden until PR #7/#8 merged |
| 7 | Lash/Brow Growth Serum rename | PASS on **live**; git deploy base still “Bimatoprost Solution” until PR #8 |
| 8 | ACH checkout | PASS |
| 9 | Wire checkout | PASS |
| 10 | Admin payment confirmation | PASS |
| 11 | Order SKU persistence | PASS (incl. `MBM-LON-TESA-INJ-001` on ACH test order) |
| 12 | Shipping ($30 / $50) | PASS |
| 13 | Discounts (10% / 15% / 15% non-stack) | PASS |
| 14 | Membership pricing ($149 / $249) | PASS |
| 15 | Customer policies/copy (ACH/Wire; no live card claims) | PASS on live |
| 16 | Google admin auth | PASS |
| 17 | Supabase/RLS security (orders + Kashu tables locked down) | PASS |
| 18 | Kashu DB migration safety (additive) | PASS — applied on BSG |
| 19 | Kashu SKU-map seed integrity (52/0 mismatch) | PASS — applied |
| 20 | Kashu webhook security/code (unsigned → 401; HMAC path) | PASS — registered |
| 21 | Hosted checkout **init code** (session/token; no payment) | PASS code path; page load still “Store not found” (Kashu infra) |
| 22 | Frontend secret exposure scan | PASS |
| 23 | Stripe-disabled verification (storefront) | PASS |
| 24 | Build / tests / typecheck / lint | PASS (195 tests; 6 lint warnings) |
| 25 | Mobile/desktop route QA (live) | PASS |

### WAITING ON KASHU — requires final processor assignment

| Item | Why blocked |
|------|-------------|
| Final payment processor assignment | Underwriting pending — Airwallex is temporary/test only |
| Gateway protection / configuration | Kashu performs after underwriting |
| Kashu-approved test transactions | Not authorized until processor assigned |
| Hosted checkout storefront load | `checkout.mybaremethod.com` returns **Store not found** for valid init tokens |
| Any representation of card as live | Forbidden until Kashu approval |
| `VITE_KASHU_CARD_ENABLED=true` | Forbidden until above clear |
| Live card payments | **NO** |

---

## 1 — GIT / SOURCE OF TRUTH

### Branch / PR status (vs `origin/deploy/ach-launch-clean-2026` @ `34b5d13`)

| Branch / PR | State | vs deploy base | Role |
|-------------|-------|----------------|------|
| `deploy/ach-launch-clean-2026` | base | — | Current git ACH launch base; includes merged variant SKU system (PR #6) |
| `cursor/variant-level-sku-system-945c` (PR #6) | **MERGED** | in base | 50 retail SKUs + membership program SKUs |
| `cursor/publish-tesamorelin-fat-burner-945c` (PR #7) | OPEN | +1 commit | Sets Tesamorelin + Fat Burner `isVisible=true` |
| `cursor/lash-brow-growth-serum-rename-945c` (PR #8) | OPEN | +2 (includes publish) | Display rename → Lash/Brow Growth Serum |
| `cursor/kashu-tagadapay-card-945c` (PR #9) | OPEN | +3 | Local Kashu scaffolding (superseded in part by later Kashu PRs) |
| `cursor/kashu-tagada-discovery-docs-945c` (PR #10) | OPEN | +6 | Docs-only discovery |
| `cursor/kashu-tagada-product-sync-945c` (PR #11) | OPEN | +8 | Tagada 52-SKU sync docs/scripts |
| `cursor/kashu-phase2-webhook-backend-945c` (PR #12) | OPEN | +9 | Kashu migration + Edge functions + Phase 2 report |
| `cursor/manual-ach-invoice-checkout-2026` (PR #5) | OPEN / stale | behind base | Superseded by deploy ACH base |
| `production-source/my-bare-method-prelaunch-final-2026` | stale | behind base | Historical; do not use as tip |

### Critical drift: LIVE site ≠ git deploy base

Live https://mybaremethod.com already shows:

- **Lash/Brow Growth Serum** (not “Bimatoprost Solution”)
- **Tesamorelin** public
- **Fat Burner** public
- ACH / Wire only at checkout (no card)

That matches **`cursor/lash-brow-growth-serum-rename-945c`**, not `deploy/ach-launch-clean-2026` (where Tesamorelin/Fat Burner are hidden and display name is still Bimatoprost).

**Implication:** storefront was published from the rename/publish line without merging those PRs back into `deploy/ach-launch-clean-2026`. Git deploy base is **behind live catalog presentation**.

### PRODUCTION SOURCE RECOMMENDATION

Create / fast-forward a single tip:

**`production-source/my-bare-method-launch-2026`** (or update `deploy/ach-launch-clean-2026`) by merging **in this order**:

1. `cursor/lash-brow-growth-serum-rename-945c` — restores git ↔ live catalog (Tesamorelin, Fat Burner, Lash/Brow rename, Scriptful updates)
2. `cursor/kashu-phase2-webhook-backend-945c` — Kashu backend scaffolding/docs (card UI remains off). Resolve any `products.ts` / Scriptful conflicts favoring the rename branch for catalog display.
3. This QA branch’s safe hygiene (`/shop` alias, remove orphan Stripe sample HTML) if not already present.

**Do not lose:** ACH/Wire checkout on deploy base, 52-SKU system, product descriptions, Tesamorelin/Fat Burner publish, Lash/Brow rename, Scriptful exports, Kashu Phase 2 backend.

**Stale / do not merge as tip:** PR #5 manual ACH fork, Bolt `website-improvements` / `release/*` mirrors, older `production-source/my-bare-method-prelaunch-final-2026`.

### Missing commits before calling deploy base “production source”

| Required for launch | In deploy base? | In live site? | In open PR |
|---------------------|-----------------|---------------|------------|
| ACH/Wire checkout | YES | YES | — |
| Cleaned payment language | YES | YES | — |
| 52-SKU system | YES (hidden Tesa/FB) | YES (Tesa/FB visible) | #7/#8 |
| Product descriptions | YES | YES | — |
| Tesamorelin public | NO (`isVisible=false`) | YES | #7/#8 |
| Fat Burner public | NO | YES | #7/#8 |
| Lash/Brow Growth Serum display name | NO | YES | #8 |
| Scriptful exports current | Partial (Pending MD for Tesa/FB) | N/A docs | #7/#8 |
| Kashu scaffolding | NO in deploy tip | Backend already on BSG | #12 |

---

## 2 — FULL PRODUCT CATALOG AUDIT (git deploy base / this QA branch)

| Metric | Value |
|--------|------:|
| ACTIVE PRODUCTS (visible) | 25 |
| MEMBERSHIPS (visible) | 2 |
| TOTAL UNIQUE SKUs (retail+program) | 52 |
| MISSING SKUs | 0 |
| DUPLICATE SKUs | 0 |
| Active variants without SKU | 0 |
| Tirzepatide 30mg | Excluded (PASS) |
| Bare Elite | inactive + hidden (PASS) |

| Product | Expected | Git deploy base | Live site |
|---------|----------|-----------------|-----------|
| Tesamorelin $149 `MBM-LON-TESA-INJ-001` | public if approved | active, **hidden** | **public** |
| Fat Burner $259 `MBM-WM-FB3-INJ-001` | public if approved | active, **hidden** | **public** |
| Lash/Brow Growth Serum $89 `MBM-SH-BIM-SOL-001` | display rename; slug `bimatoprost-solution`; Bimatoprost 0.03%/2.5mL | **display still “Bimatoprost Solution”** | **Lash/Brow Growth Serum** |
| Semaglutide membership | $149/mo | PASS | PASS |
| Tirzepatide membership | $249/mo | PASS | PASS |

---

## 3 — TAGADA CATALOG AUDIT (READ ONLY)

Re-fetched via temporary Edge helper (deleted after audit).

| Metric | Value |
|--------|------:|
| PRODUCTS | 30 |
| VARIANTS | 53 |
| PRICES | 53 |
| 52/52 MAPPED | YES |
| PRICE MISMATCHES | 0 |
| AMBIGUOUS | 0 |
| DUPLICATE mapped SKUs | 0 |
| Blank-SKU orphan | 1 — Tretinoin `$99` `variant_312812933f47` (**untouched**) |
| Customer subscriptions | **0** |
| Membership Semaglutide | $149 · recurring=true · month · intervalCount=1 |
| Membership Tirzepatide | $249 · recurring=true · month · intervalCount=1 |

---

## 4 — SCRIPTFUL AUDIT (deploy-base tree)

| File | Rows / notes |
|------|----------------|
| `docs/scriptful-variant-skus.csv` | **60** data rows · **52** unique SKUs |
| `docs/scriptful-variant-skus.md` | Documents 52 unique SKUs |
| `docs/scriptful-product-links.md` | **27** link rows (visible products+memberships on deploy base; omits hidden Tesa/FB) |

| Check | Result |
|-------|--------|
| Tesamorelin / Fat Burner in SKU docs | YES (Pending MD on deploy-base docs) |
| Lash/Brow display name in Scriptful | **NO on deploy base** (still Bimatoprost); **YES on PR #8 / live** |
| Formulation retained | YES (Bimatoprost 0.03% / 2.5mL) |
| Broken production URLs | None found (all `mybaremethod.com`) |
| BROKEN LINKS | 0 |

---

## 5 — STOREFRONT QA

| Route | Local preview (deploy-base build) | Live |
|-------|-----------------------------------|------|
| HOME | PASS | PASS |
| SHOP | `/shop` was 404 → **fixed alias** on this QA branch; use `/shop-all` | PASS (nav uses shop-all) |
| CATEGORY | PASS | PASS |
| PRODUCT (core) | PASS | PASS |
| Tesamorelin / Fat Burner | NOT FOUND (hidden) | PASS visible |
| Bimatoprost/Lash page | “Bimatoprost Solution” | “Lash/Brow Growth Serum” |
| MEMBERSHIPS | PASS | PASS |
| PROVIDER CARE / ACCESSORIES | PASS | PASS |
| CART | PASS | PASS |
| CHECKOUT | PASS · ACH+Wire only | PASS · ACH+Wire only (no card) |
| FAQ / CONTACT / LEGAL | PASS | PASS |
| Mobile ~390 | spot-check PASS (live) | PASS |
| Console-breaking errors | none observed | none observed |

---

## 6 — PRODUCT COPY / POLICY AUDIT

| Check | Result |
|-------|--------|
| Customer-facing “Stripe” brand | PASS (none) |
| Card / payment method on file promises | PASS (none) |
| Customer “Test Mode” | PASS (none) |
| Subscribe & Save | PASS (none; newsletter “Subscribe” only) |
| Automatic ACH debit promises | PASS (explicitly negated) |
| Membership auto-charge card promises | PASS (invoice language) |
| Old Bimatoprost display name | **FAIL on git deploy base** · **PASS on live** |
| Home “Monthly automatic deliveries” | MEDIUM — could over-imply automation vs invoice-per-period |

Allowed internal/admin Stripe/Test Mode references remain in admin + legacy Edge code.

---

## 7–9 — ACH / WIRE / ADMIN (BSG live API)

| Suite | Result | Evidence |
|-------|--------|----------|
| ACH | **PASS** | `MBM-2026-000014` · awaiting_payment · SKU persisted · shipping $30 · bank instructions · fulfillment `order_received` · no Stripe |
| WIRE | **PASS** | `MBM-2026-000015` · awaiting_payment · shipping $50 · wire instructions · fulfillment blocked |
| ADMIN | **PASS** | wrong amount rejected; confirm required; mark paid → `paid_at` + admin identity; fulfillment → `payment_confirmed` |
| SHIPPING | **PASS** | Two-Day 3000¢ / Next-Day 5000¢ (code + live order totals) |
| DISCOUNTS | **PASS** | Auto-Refill 10% / Member 15% / Accessories 15% / non-stacking (unit tests) |

Test orders soft-cancelled after QA where possible.

---

## 10 — KASHU DATABASE READINESS

Migration `20260811210000_kashu_card_payments.sql`: still **safe/additive** (kashu_card, payment_processor, external IDs, payment_webhook_events, kashu_sku_map + RLS lockdown).

| | |
|--|--|
| MIGRATION APPLIED | **YES** (on BSG) |
| MAP SEED APPLIED | **YES** — 52 rows, 0 mismatch vs live Tagada SKUs |

---

## 11 — KASHU EDGE FUNCTIONS (audit; no new deploy)

| Function | BSG | Security notes |
|----------|-----|----------------|
| `create-kashu-checkout-session` | DEPLOYED | Server secrets only; amount from MBM order; SKU via map; returns redirect/token only |
| `tagada-webhook` | DEPLOYED | Raw-body HMAC `X-TagadaPay-Signature`; constant-time compare; idempotent events; amount mismatch → under_review; failed ≠ paid; refund handled; unknown order protected |
| `create-invoice-order` | DEPLOYED | Supports `kashu_card` + hostedCheckout instructions; ACH/Wire unchanged |

Return URL must not mark paid — webhook is source of truth (implemented).

**Note:** Legacy Stripe Edge Functions (`create-checkout-session`, `stripe-webhook`, `stripe-sync`, `sync-stripe-products`) are still **ACTIVE** on BSG — storefront does not call them, but ops risk remains (**HIGH**).

---

## 12 — KASHU HOSTED CHECKOUT DRY RUN

| | |
|--|--|
| Session created | YES |
| Domain | `checkout.mybaremethod.com` |
| Server total authoritative | YES (client override ignored) |
| API secret exposed | NO |
| Hosted page load | **FAIL** — HTTP 404 title **Store not found** |
| Card entered | NO |

HOSTED CHECKOUT DRY RUN: **FAIL** (session OK; storefront app not resolving store)

---

## 13 — WEBHOOK READINESS

| | |
|--|--|
| MBM WEBHOOK REGISTERED | **YES** — `…/functions/v1/tagada-webhook` |
| Kashu webhook preserved | YES — `https://mrp.kashupay.com/api/webhooks/tagada-store` |
| Missing / malformed / bad HMAC | PASS → 401 |
| Full signed suite | Previously PASS in Phase 2 (valid/idempotent/wrong amount/failed/refund) |

---

## 14 — MEMBERSHIP READINESS

Tagada + MBM: Semaglutide $149/mo and Tirzepatide $249/mo recurring monthly; **0** Tagada subscriptions; frontend does not promise auto-charge; manual invoice path intact.

---

## 15 — AUTH / SECURITY

| Check | Result |
|-------|--------|
| Google admin auth / `is_admin` | PASS (admin mark-payment used live) |
| Service role / Tagada / bank secrets in frontend `dist` | **PASS** — not present |
| `VITE_KASHU_CARD_ENABLED` in dist | OFF / absent |
| Payment instruction tokens | token-gated path returned; RLS on orders |
| Admin routes | separate AdminApp chrome |

Redirect URL inventory for Supabase Auth (mybaremethod.com / checkout.mybaremethod.com) should be confirmed in Supabase dashboard by owner (not fully enumerated via API in this pass).

---

## 16 — LEGACY STRIPE CHECK

| Storefront invocation | **NO** |
| Stripe card UI dependency | **NO** |
| Internal legacy | Edge functions still deployed on BSG; orphan `src/pages/checkout.html` **removed on this QA branch** |

---

## 17 — BUILD / AUTOMATED TESTS

| | |
|--|--|
| BUILD | PASS · `index-vbv3iiAd.js` 757.86 kB (gzip 194.46 kB) · CSS 52.81 kB |
| TESTS | **195 passed** / 17 files |
| TYPECHECK | PASS |
| LINT | PASS with **6 warnings** (react-refresh export style only) |

---

## 18 — BLOCKER CLASSIFICATION

### CRITICAL — blocks card launch only (not ACH/Wire)
1. **Final processor not assigned** — Kashu underwriting pending.
2. Hosted checkout page on `checkout.mybaremethod.com` returns **Store not found** for valid init tokens (gateway/storefront binding — Kashu).
3. No Kashu-authorized test transaction until processor assignment + gateway config.

### HIGH — git hygiene before treating deploy tip as SoT
1. Merge PR #8 (publish + Lash/Brow rename) into production source so git matches live.
2. Legacy Stripe Edge Functions still ACTIVE on BSG — disable/undeploy for hygiene (storefront unused).
3. Keep `VITE_KASHU_CARD_ENABLED` off; do not market card as available.

### MEDIUM
1. Home Auto-Refill “Monthly automatic deliveries” wording ambiguity.
2. `/shop` 404 on deploy-base builds — **fixed on this QA branch**.
3. Overlapping Kashu PRs — collapse to Phase 2 tip when merging.

### LOW
1. ESLint react-refresh warnings (6).
2. Bundle size chunk warning (~758 kB JS).
3. Newsletter button label “Subscribe”.

### Safe fixes on this QA branch only
1. `/shop` → `/shop-all` alias.
2. Removed unrouted `src/pages/checkout.html` Stripe sample.
3. This report (incl. Kashu underwriting status update).

No payment, pricing, catalog SKU/price, auth, legal, or processor changes.

---

## FINAL REPORT SUMMARY

```
SOURCE BRANCH: cursor/launch-readiness-qa-945c
HEAD: 4cbed8c
WORKING TREE: clean after commit

PRODUCTION SOURCE RECOMMENDATION:
  Merge PR #8 (Tesamorelin + Fat Burner + Lash/Brow) into deploy/ach-launch-clean-2026
  so git matches live, then merge PR #12 (Kashu Phase 2; card UI off).
  Live storefront already reflects PR #8 catalog presentation.

READY NOW (ACH/Wire launch-safe):
  - 52 SKUs / live product pages / Scriptful uniqueness
  - Tesamorelin, Fat Burner, Lash/Brow Growth Serum on LIVE
  - ACH + Wire checkout, admin mark-paid, SKU persistence
  - Shipping $30/$50, discounts 10/15/15 non-stack
  - Membership $149/$249 pricing + recurring catalog (no subscriptions created)
  - Policies/copy without live-card claims
  - Google admin auth, RLS, frontend secret scan
  - Stripe storefront disabled
  - Build/tests/typecheck/lint
  - Kashu DB migration + 52-row map + webhook HMAC code (prep only)
  - Hosted checkout SESSION INIT code (no payment completed)

WAITING ON KASHU:
  - Underwriting approval
  - Final processor assignment (Airwallex is NOT final)
  - Gateway protection/configuration
  - Authorized test transactions
  - Hosted checkout page load (“Store not found” today)
  - Any live-card enablement

KASHU PROCESSOR STATUS: NOT YET ASSIGNED
KASHU CARD STATUS: UNDERWRITING PENDING
AIRWALLEX ENTRY: TEMPORARY/TEST — DO NOT MODIFY
CARD FRONTEND FLAG: OFF
STRIPE STOREFRONT INVOCATION: NO

CATALOG: 52 SKUs / 0 missing / 0 duplicates
TAGADA: 30 products / 53 variants / 53 prices / 52/52 mapped / 0 mismatches
SCRIPTFUL: 60 csv rows / 52 unique SKUs / 0 broken links

ACH: PASS
WIRE: PASS
ADMIN: PASS
SHIPPING: PASS
DISCOUNTS: PASS
BUILD: PASS | TESTS: 195 PASS | TYPECHECK: PASS | LINT: PASS (6 warnings)

READY FOR ACH/WIRE LAUNCH: YES
READY FOR KASHU INTEGRATION TEST AFTER PROCESSOR ASSIGNED: YES
  (backend map + webhook + session init ready; still need Kashu processor,
   gateway config, working hosted page, and Kashu test approval)
READY FOR LIVE CARD PAYMENTS: NO

EXACT REMAINING STEPS AFTER KASHU APPROVAL:
1. Merge PR #8 into production-source/deploy tip (git = live catalog).
2. Keep PR #12 Kashu backend merged with VITE_KASHU_CARD_ENABLED=false.
3. Await Kashu underwriting approval + final processor assignment.
4. Do NOT modify the temporary Airwallex entry; let Kashu configure the assigned processor.
5. Kashu completes gateway protection/configuration.
6. Kashu confirms hosted checkout loads (no more Store not found).
7. Run Kashu-authorized test transaction only (no ad-hoc real charges).
8. Confirm webhook marks paid correctly on that test event.
9. Owner approval → set VITE_KASHU_CARD_ENABLED=true and redeploy storefront.
10. Only then treat card as a customer payment option alongside ACH/Wire.

STOP. Do not enable live card payments. Do not change Airwallex. Do not perform a card charge. Do not deploy automatically.
```
