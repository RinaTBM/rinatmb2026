# Full My Bare Method Launch Readiness QA

**Date:** 2026-08-12  
**Auditor branch:** `cursor/launch-readiness-qa-945c`  
**Live site:** https://mybaremethod.com  
**Live backend:** BSG `bsgtuuzwgeetsjjdrtrm`  
**Constraints honored:** no processor changes, no Airwallex testMode change, no real card charge, no `VITE_KASHU_CARD_ENABLED`, no Stripe revival, no ACH/Wire behavior change, no deploy of storefront, no orphan Tagada deletes.

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

### CRITICAL — blocks full card launch (not ACH/Wire)
1. Hosted checkout on `checkout.mybaremethod.com` returns **Store not found** for valid Tagada init tokens — Kashu must fix store/domain binding / exact `checkoutUrl`.
2. Awaiting Kashu confirmation of Airwallex **testMode → live** transition (processor not modified).

### HIGH — fix before declaring git = production
1. Merge PR #8 (publish + Lash/Brow rename) into production source so git matches live.
2. Legacy Stripe Edge Functions still ACTIVE on BSG — disable/undeploy for launch hygiene (storefront already unused).
3. Do not enable `VITE_KASHU_CARD_ENABLED` until (1)+(2) critical card blockers clear.

### MEDIUM
1. Home Auto-Refill “Monthly automatic deliveries” wording ambiguity.
2. `/shop` 404 on deploy-base builds — **fixed on this QA branch** via alias to `/shop-all`.
3. Multiple open Kashu PRs overlapping — collapse into Phase 2 tip when merging.

### LOW
1. ESLint react-refresh warnings (6).
2. Bundle size chunk warning (~758 kB JS).
3. Newsletter button label “Subscribe”.

### Safe fixes made on this QA branch (only)
1. `/shop` → `/shop-all` alias.
2. Deleted unrouted legacy `src/pages/checkout.html` Stripe sample.
3. This report document.

No payment, pricing, catalog SKU/price, auth, or legal policy rewrites.

---

## FINAL REPORT SUMMARY

```
SOURCE BRANCH: cursor/launch-readiness-qa-945c (from deploy/ach-launch-clean-2026)
HEAD: (see git after commit)
WORKING TREE: clean after commit

PRODUCTION SOURCE RECOMMENDATION:
  Merge #8 (lash/publish) → then #12 (kashu phase2) into deploy/ach-launch-clean-2026
  or new production-source/my-bare-method-launch-2026
  NOTE: live site already includes #8 catalog presentation.

CATALOG:
ACTIVE PRODUCTS: 25 visible on deploy base / 27 on live (Tesa+FB)
MEMBERSHIPS: 2
TOTAL SKUS: 52
MISSING SKUS: 0
DUPLICATE SKUS: 0

TAGADA:
PRODUCTS: 30
VARIANTS: 53
PRICES: 53
52/52 MAPPED: YES
PRICE MISMATCHES: 0

SCRIPTFUL:
ROWS: 60 (csv)
UNIQUE SKUS: 52
BROKEN LINKS: 0

ACH: PASS
WIRE: PASS
ADMIN: PASS
SHIPPING: PASS
DISCOUNTS: PASS
CUSTOMER COPY: PASS on live / FAIL display-name drift on git deploy base
POLICIES: PASS
AUTH: PASS
SECURITY: PASS (frontend bundle)

KASHU MIGRATION: APPLIED
KASHU SKU MAP: APPLIED
KASHU EDGE FUNCTIONS: DEPLOYED
MBM WEBHOOK: REGISTERED
HOSTED CHECKOUT DRY RUN: FAIL (Store not found)
AIRWALLEX: PROCESSOR FOUND (prior) / ENABLED true / TEST MODE true (unchanged)
CARD FRONTEND FLAG: OFF
STRIPE STOREFRONT INVOCATION: NO

BUILD: PASS
TESTS: 195 PASS
TYPECHECK: PASS
LINT: PASS (6 warnings)

READY FOR EXISTING ACH/WIRE LAUNCH: YES (live already serving ACH/Wire)
READY FOR KASHU TEST TRANSACTION: NO
READY FOR LIVE KASHU CARD PAYMENTS: NO

EXACT NEXT STEPS TO FULL LAUNCH:
1. Merge PR #8 into deploy/production-source so git matches live catalog.
2. Merge PR #12 Kashu Phase 2 code into that tip (card UI still off).
3. Ask Kashu to fix hosted checkout “Store not found” on checkout.mybaremethod.com.
4. Ask Kashu for Airwallex testMode→live transition plan/confirmation.
5. Undeploy/disable legacy Stripe Edge Functions on BSG.
6. Re-run hosted checkout dry run until page loads (still no real charge).
7. Only then consider controlled sandbox/test card with Kashu-approved method.
8. Only after success + owner approval set VITE_KASHU_CARD_ENABLED=true and redeploy storefront.

STOP. Do not enable live card payments. Do not change Airwallex processor. Do not perform a real card transaction.
```
