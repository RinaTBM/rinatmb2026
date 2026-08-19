# Phase 4 — Tax parity investigation (no charge / no Bolt publish)

**Date:** 2026-08-19  
**Branch tip at investigation:** `deploy/ach-launch-clean-2026`  
**Scope:** Can Tagada hosted checkout safely host MBM `orders.tax_cents` so card totals equal `orders.total_cents`?

**Safety:** No Bolt publish. No live card charge. No Tagada catalog/config changes. Webhook amount equality unchanged. ACH/Wire unchanged. Memberships remain ACH/Wire-only. Stripe remains off.

---

## Planner cart example

| Line | Amount |
|------|--------|
| Daily & Weekly Wellness Planner (`a6`, `MBM-ACC-DWP-ACC-001`) | $29.00 (2900¢) |
| Two-Day Shipping | $30.00 (3000¢) |
| Sales Tax (MBM accessory 8%) | **$2.32 (232¢)** |
| Total | $61.32 (6132¢) |

**Math:** `Math.round(2900 * 0.08) = 232`. Intentional interim accessory sales tax (`ACCESSORY_SALES_TAX_RATE` in `src/lib/checkout/checkoutConstants.ts`). Server recomputes in `buildAuthoritativeOrderLines` → `orders.tax_cents`. Client tax is not trusted.

**Label:** Checkout shows “Sales Tax” for accessory tax; Provider Care uses 1.8% on provider-care lines only (`PROVIDER_CARE_TAX_RATE`). Both sum into `orders.tax_cents`.

---

## Tagada capability (production integration)

| Capability | Result |
|------------|--------|
| Pass MBM tax cents into `checkout/init` / `createSession` | **NO** — official items are `{ variantId, quantity, priceId? }` only. OpenAPI query params have no tax/amount override ([initialize-checkout-session](https://docs.tagada.io/api-reference/checkout/initialize-checkout-session)). |
| Tagada auto-tax (`isTaxable` / TaxJar) | **UNSAFE for MBM parity** — Phase 2A proved independent Tagada tax ($10.71 on $595 wellness where MBM tax was $0). Live audit 2026-08-19: **taxableCount=0** (including Wellness Planner `isTaxable=false`). Must stay off. |
| Explicit tax as mapped line item (like `MBM-SHIP-*`) | **Not viable for V1** — shipping has only three fixed amounts ($0/$30/$50). Tax is continuous (`round(subtotal × rate)`), so a fixed catalog SKU cannot cover arbitrary cents without per-order price mutation or an unbounded SKU matrix. Per-order Tagada price updates would race concurrent checkouts and change Tagada configuration (out of scope / unsafe). |
| Hosted total == `orders.total_cents` when `tax_cents > 0` | **NO** under current architecture (merchandise + optional ship line only; tax not represented). |

Live read-only `tagada-product-sync` `audit_product_tax`: `productCount=32`, `taxableCount=0`.

---

## Decision

**Keep `TAGADA_TAX_PARITY_BLOCKER` for any `tax_cents > 0`.**

- Frontend: `evaluateKashuCardCartEligibility` → `tax_parity`
- Edge: `create-kashu-checkout-session` rejects before init
- Do **not** re-enable Tagada automatic tax
- Do **not** weaken webhook paid-amount === `orders.total_cents`

Card remains available for one-time carts with **`$0` tax** and allowed shipping ($0 / $30 / $50). Taxed accessory and Provider Care carts stay ACH/Wire until a future Tagada API supports injecting exact MBM tax (or an approved discrete tax-line architecture).

---

## Report fields

```
TAGADA TAX CAPABILITY: NO_CUSTOM_TAX_AMOUNT; AUTO_TAX_DISABLED_AND_UNSAFE_FOR_MBM; NO_SAFE_DYNAMIC_TAX_LINE_V1
MBM TAX SOURCE OF TRUTH: YES (orders.tax_cents via buildAuthoritativeOrderLines)
PLANNER $2.32 TAX CORRECT: YES (2900¢ × 8% interim accessory rate)
TAXED CARD CHECKOUT POSSIBLE: NO
IMPLEMENTATION REQUIRED: NO (blocker retained)
WEBHOOK PARITY PRESERVED: YES
PROVIDER CARE TAX HANDLING: MBM 1.8% → tax_cents; card blocked when > 0
ACCESSORY SALES TAX HANDLING: MBM interim 8% → tax_cents; card blocked when > 0
```
