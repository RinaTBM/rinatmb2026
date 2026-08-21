# Phase 12J.0 — Controlled live checkout test (payment only)

**Mode:** ONE product · ONE real payment · NO GEN auto-handoff · NO broad Rx launch  
**Branch:** `deploy/ach-launch-clean-2026`  
**Production project:** `bsgtuuzwgeetsjjdrtrm`  
**Preferred SKU:** `MBM-RP-BPC-INJ-001`

## Hard stops (this run)

Scriptful-approved live-test SOP is **not** present in-repo as an authoritative checklist for:

| Question | Status |
|---|---|
| Real card required? | **UNKNOWN** (material) |
| Transaction settles / real money? | **UNKNOWN** (material) |
| Small real charge expected? | **UNKNOWN** (material) |
| Refund after validation? | **UNKNOWN** (material) |
| Specific product required by Scriptful? | Preferred BPC only — **owner must confirm** |
| Special merchant/account state? | **UNKNOWN** (material) |
| GEN/API Orders must be enabled before test? | **UNKNOWN** (material) — default for 12J.0 is payment-only with API Orders **off** |

Per brief §4: **STOP before payment** when these are unknown and material.

Also blocked until owner supplies:

- Approved live-test customer details
- Explicit confirmation that BPC is the live-test product
- Answers to the Scriptful questions above

Closest prior precedent (accessory, not BPC/Scriptful): `docs/tagadapay-phase3-controlled-live-test.md` ($33.99 syringes + shipping).

## Recommended product (if BPC appropriate)

| Field | Value |
|---|---|
| SKU | `MBM-RP-BPC-INJ-001` |
| Website product | Exists (`bpc-157-tb-500-v2` / catalog READY) |
| Production Tagada map (`kashu_sku_map`) | **YES** — `product_73694d0d8088` / `variant_28a362285cd1` / `price_468c0be65863` @ **19900¢** active |
| Catalog readiness | READY (12I.2 / 12I.3) |
| Production Rx purchasable (API Orders) | **NO** while `GEN_API_ORDERS_ENABLED` unset/false |
| Do not use | Semaglutide, Tirzepatide, HRT, new replacement SKUs, membership refill, lab, visit |

## Production safety snapshot (names only — no secret values)

| Item | Observation |
|---|---|
| Tagada Edge secrets present | `TAGADA_API_KEY`, `TAGADA_API_BASE`, `TAGADA_STORE_ID`, `TAGADA_CHECKOUT_URL`, `TAGADA_WEBHOOK_SECRET`, `TAGADA_ENV` |
| GEN Edge secrets on production | **None** (`GEN_*` not set) — correct for deferred clinical |
| `GEN_HANDOFF_AUTOMATION_ENABLED` | Not set (treated off) |
| `GEN_API_ORDERS_ENABLED` | Not set (false) |
| `PRODUCTION_CHECKOUT_TEST_SKU` | Not set (allowlist inactive until intentionally set) |
| `gen_sku_map` table | **Absent** on production (GEN schema deferred — OK for payment-only) |
| Commerce tables | `orders`, `order_items`, `kashu_sku_map`, `catalog_*` present |
| Active Edge (selected) | `create-invoice-order` v29, `create-kashu-checkout-session` v24, `tagada-webhook` v17 (updated ~2026-08-19) |
| Payment authority | `tagada-webhook` — browser return must not mark paid |
| Storefront | Public Rx remain fail-closed / Coming soon without API Orders or allowlist |

## Code prep shipped this phase

Temporary single-SKU override (approach C):

- Env: `PRODUCTION_CHECKOUT_TEST_SKU=<one MBM Rx SKU>`
- Shared: `resolveProductionCheckoutTestSku` / `isProductionCheckoutTestSkuCart`
- Server: `assertCartEligibleForCheckout` + Edge `create-invoice-order` `assertRxGenMappingsReady`
- Effect: cart whose **only** Rx SKU matches the allowlist bypasses GEN map + API Orders gates for **payment validation only**
- Non-effects: no GEN handoff, no other Rx unlocked, no membership rebill change, multi-SKU values rejected

**Do not set** this secret on production until Scriptful + owner confirm and Edge functions containing this code are redeployed.

## Owner runbook (after Scriptful answers)

1. Redeploy production Edge: `create-invoice-order` (and related if needed) from this branch tip.
2. Set Edge secret **only**: `PRODUCTION_CHECKOUT_TEST_SKU=MBM-RP-BPC-INJ-001` (do **not** set `GEN_API_ORDERS_ENABLED=true` unless Scriptful requires it).
3. Create **exactly one** MBM order (BPC ± authorized shipping) → `payment_status=awaiting_payment`.
4. Create **exactly one** `create-kashu-checkout-session` → verify `mbmOrder:<PUBLIC_ORDER_NUMBER>` tag, amount, store.
5. **STOP** for owner to enter card details (do not log card data).
6. After owner reports submit: verify Tagada payment/order + production webhook signature + amount match → `paid`. No manual mark-paid. No GEN handoff.
7. Cleanup: unset `PRODUCTION_CHECKOUT_TEST_SKU`; keep order as audit trail; refund only if Scriptful/owner instructs.

## Restore / cleanup

- Remove `PRODUCTION_CHECKOUT_TEST_SKU` from production secrets
- Leave `GEN_API_ORDERS_ENABLED` false
- Leave `GEN_HANDOFF_AUTOMATION_ENABLED` false
- Do not activate remaining Rx catalog
- Do not merge `main` unless explicitly instructed after review
