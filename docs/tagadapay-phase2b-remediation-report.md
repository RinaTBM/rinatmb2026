# Phase 2B — Tagada Catalog / Tax / Shipping Remediation

**Date:** 2026-08-19  
**Branch:** `integration/tagadapay-hosted-checkout-2026`  
**Supabase:** `bsgtuuzwgeetsjjdrtrm` (BSG)  
**Source of truth:** Phase 2A audit (`docs/tagadapay-phase2a-tax-shipping-sku-audit.md`)

**Safety:** `VITE_KASHU_CARD_ENABLED=false`. No production frontend deploy. No real card charge. Webhook amount equality unchanged. Stripe remains disabled. ACH/Wire operational. Main not modified.

---

## 1. Remap 23 stale Tagada variant IDs

Exact-SKU remaps applied to live `kashu_sku_map` (not by display name). Before/after evidence:

- `docs/tagadapay-phase2b-remap-before-after.json` (23 rows)
- Seed updated: `docs/kashu-sku-map-seed.json` (54 rows including shipping)

### Init revalidation (non-payment)

| Metric | Count |
|--------|------:|
| SKU TOTAL (active map, excl. ship lines) | 52 |
| SKU INIT PASS | **50** |
| SKU INIT FAIL | **0** |
| MEMBERSHIP DEFERRED | **2** |

Artifact: `docs/tagadapay-phase2b-sku-init.json`

---

## 2. Price drift audit

MBM `mbm_price_cents` / approved catalog pricing treated as authoritative.

PIS accessories previously drifted (e.g. PIS-001 `$399 → $499` on Tagada). Live Tagada variant prices were corrected to MBM cents.

Post-remediation live audit:

| Result | Count |
|--------|------:|
| PRICE PARITY PASS | **50** |
| PRICE PARITY FAIL | **0** |

Artifact: `docs/tagadapay-phase2b-price-parity.json`

```txt
TAGADA_PRICE_PARITY_BLOCKER: NO
```

---

## 3. Tax remediation

- All Tagada store products set `isTaxable=false`
- TaxJar / mapped tax category cleared
- Audit: `taxableCount=0` / `productCount=32`

### Semaglutide $595 hosted validation (no card)

Order `MBM-2B-*-SEM595` → hosted checkout:

| Field | Observed |
|-------|----------|
| Subtotal | **$595.00** |
| Shipping | Free (Free Two Day Shipping $500+) |
| Tax | **$0.00** (no $10.71) |
| Total | **$595.00** |

Screenshot: `/opt/cursor/artifacts/phase2b-screenshots/sem595-tax-pass.webp`

```txt
TAGADA_TAX_PARITY_BLOCKER: NO
TAX PARITY: PASS
SEM $595 TEST TOTAL: $595.00
```

Funnel still has `showTax: true` (UI section may render) but resolves to **$0** matching MBM `tax_cents=0`.

---

## 4. Provider visit non-shippable flags

| Product | isTaxable | isShippable |
|---------|-----------|-------------|
| Initial Provider Visit | false | **false** |
| Follow-Up Visit | false | **false** |
| Laboratory Review | false | **false** |

Checkout **init** for each service SKU: **PASS**.

Hosted UI still shows the funnel **ShippingRates** island after an address is entered (see §5) — product flag alone does not remove that island.

---

## 5. Shipping rate duplication (open blocker)

### Created / mapped Tagada shipping line items

| MBM SKU | Tagada product | Variant | Price ID | Amount |
|---------|----------------|---------|----------|--------|
| `MBM-SHIP-TWO-DAY-001` | `product_47ca0012c5f6` | `variant_d65972427b74` | `price_e6ed90434b4d` | $30 |
| `MBM-SHIP-NEXT-DAY-001` | `product_180ac01fef1b` | `variant_f01004df5c46` | `price_e3c7e9c9fb61` | $50 |

Both: one-time, non-taxable, non-shippable. Inserted into `kashu_sku_map`.

### Edge session behavior

`create-kashu-checkout-session` (deployed to BSG):

- `shipping_cents=3000` → append Two-Day line
- `shipping_cents=5000` → append Next-Day line
- `shipping_cents=0` → no shipping line
- unexpected positive cents → `TAGADA_SHIPPING_PARITY_BLOCKER`
- pre-redirect total assert → `TAGADA_CHECKOUT_TOTAL_MISMATCH` (verified)

### What is still enabled in Tagada (must change)

Hosted Simple Checkout funnel still includes:

1. **`ShippingRates` island** (title “Shipping Method”) — loads Tagada rates by location/subtotal **independently** of MBM.
2. Live rates observed: **Two Day Shipping $30**, **Next Day Shipping $50**, plus free threshold messaging.
3. Order summary **`showShipping: true`**.

Public shipping-rate list API paths remain **404/unavailable** from Edge; rates appear funnel-managed.

### Hosted validation (double charge)

| Cart | Expected | Observed hosted | Result |
|------|----------|-----------------|--------|
| $30 Two-Day line | Total **$149** | Subtotal $149 + ShippingRates **$50** = **$199** | **FAIL** |
| $50 Next-Day line | Total **$169** | Subtotal $169 + ShippingRates **$50** = **$219** | **FAIL** |
| IPV service-only | Total **$75** | Subtotal $75 + ShippingRates **$50** = **$125** | **FAIL** |
| $595 free ship | Total **$595** | **$595** (free rate selected) | PASS |

Screenshots: `phase2b-screenshots/ship30-double-ship-fail.webp`, `ship50-double-ship-fail.webp`, `ipv-shipping-fail.webp`

```txt
TAGADA_SHIPPING_PARITY_BLOCKER: YES
```

### Exact Tagada dashboard steps (required — do not invent)

Until these are done, keep card checkout disabled and keep FE eligibility blocking `shipping_cents > 0`:

1. Open Tagada → Store **My Bare Method** → Checkout / Funnels → **Simple Checkout** used by `checkout.mybaremethod.com`.
2. Remove or disable the **ShippingRates** island on that funnel (or configure **zero active shipping rates** so the island cannot add an amount).
3. Confirm paid shipping is represented **only** via mapped line items `MBM-SHIP-TWO-DAY-001` / `MBM-SHIP-NEXT-DAY-001`.
4. Re-test $30, $50, and service-only carts: hosted Total must equal MBM `total_cents` with **no** second ShippingRates charge.
5. Optional: set Order Summary `showShipping` false if shipping is only a line item.

Do **not** blindly delete rates without confirming free-threshold UX for $500+ carts after the island is disabled.

---

## 6–8. Session total parity + memberships

- Total mismatch rejection: **PASS** (live 409 `TAGADA_CHECKOUT_TOTAL_MISMATCH`)
- Unexpected shipping cents: **PASS** (live 409 `TAGADA_SHIPPING_PARITY_BLOCKER`)
- Memberships: remain **MEMBERSHIP_DEFERRED** / ACH-Wire only (2 maps)
- Webhook amount equality: tests unchanged / still strict

---

## 9. Validation matrix (session init; no card)

Artifact: `docs/tagadapay-phase2b-validation-matrix.json`

| Case | Session | Hosted total parity |
|------|---------|---------------------|
| All non-membership SKU inits | PASS (50) | n/a |
| Sem $595 | INIT PASS | **PASS** ($595 / tax $0) |
| $0 shipping | INIT PASS | PASS (tax $0) |
| $30 shipping | INIT PASS | **FAIL** (double ship) |
| $50 shipping | INIT PASS | **FAIL** (double ship) |
| Free-threshold | INIT PASS | PASS |
| IPV / FUV / LAB | INIT PASS | IPV hosted **FAIL** (ShippingRates) |
| Accessory | INIT PASS | n/a |

Frontend card eligibility still blocks `shipping_cents > 0` while ShippingRates double-charge remains.

---

## 10. Tests

`npm test` → **21 files / 259 tests passed** (includes `tagadaPhase2bParity.test.ts`).

---

## Final scoreboard

```txt
SKU TOTAL: 52
SKU INIT PASS: 50
SKU INIT FAIL: 0
MEMBERSHIP DEFERRED: 2
PRICE PARITY PASS: 50
PRICE PARITY FAIL: 0
TAX PARITY: PASS
SEM $595 TEST TOTAL: $595.00
TWO-DAY SHIPPING PARITY: FAIL
NEXT-DAY SHIPPING PARITY: FAIL
FREE SHIPPING PARITY: PASS
IPV INIT: PASS
FOLLOW-UP INIT: PASS
LAB REVIEW INIT: PASS
TAGADA_TAX_PARITY_BLOCKER: NO
TAGADA_SHIPPING_PARITY_BLOCKER: YES
TAGADA_PRICE_PARITY_BLOCKER: NO
TESTS: 259 passed
MAIN MODIFIED: NO
PRODUCTION DEPLOYED: NO
LIVE CARD PAYMENT ENABLED: NO
```
