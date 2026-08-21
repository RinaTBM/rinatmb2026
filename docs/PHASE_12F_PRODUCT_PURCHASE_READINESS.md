# Phase 12F — Product Purchase Readiness Report

**Branch:** `deploy/ach-launch-clean-2026`  
**Base HEAD:** `5473777fa21c54f084ca86b330ea03f93c7152eb`  
**COMMIT / PUSH:** NO (per phase instructions)  
**PRODUCTION TOUCHED:** NO

---

## Untracked Phase 12B–12E inventory (kept)

- `docs/GEN_HEALTH_V2_INTEGRATION_DESIGN.md`
- `docs/GEN_HEALTH_V2_SCHEMA_DRAFT.sql`
- `docs/genhealth-migration-matrix.json` / `.md`
- `src/lib/genHealth/**`
- `supabase/functions/_shared/genHealth*.ts`
- `supabase/functions/gen-health-handoff|qa-patient|qa-patient-probe|webhook/`
- `supabase/migrations/20260821120000_gen_health_v2.sql`

---

## Customer purchase flow (audited)

```
PDP → Cart → CheckoutPage → create-invoice-order
  → create-kashu-checkout-session → Tagada hosted checkout
  → KashuCardResultPage (poll get-order-payment-status)
  → tagada-webhook (paid SoT) → portal / admin
```

### Gap classification (pre-12F → status)

| Gap | Class | 12F action |
|---|---|---|
| Invoice shipping cents trusted from client | PAYMENT / BLOCKING | Fixed — server `authorizeInvoiceShippingCents` (0/3000/5000) |
| Card return page anon RLS stuck pending | UX | Fixed — `get-order-payment-status` token-gated |
| GEN handoff not on webhook | CLINICAL | Prepared queue model; automation remains OFF |
| All Rx GEN IDs missing | CLINICAL / DATA | Documented GEN_BLOCKED; commerce Tagada still allowed |
| Failure webhook missing_order_reference | PAYMENT | Improved — also match checkout/payment/order external IDs |
| Demo shipping 1156 staging hack | DATA | **REMOVED** from staging `create-kashu`; rejected in invoice auth + tests |
| Membership rebill → med order | CLINICAL | Invariant preserved (`false`) |

---

## Product eligibility model

Module: `src/lib/commerce/productEligibility.ts`

- Types: RX_MEDICATION | PROVIDER_VISIT | LAB | ACCESSORY | MEMBERSHIP | NON_RX | SHIPPING
- Readiness: READY | TAGADA_BLOCKED | GEN_BLOCKED | DEPRECATED | HIDDEN
- `requireGenMappingForRx` is environment-aware via `resolveRequireGenMappingForRx`:
  - **production** defaults **true** (Rx fail-closed without READY/ACTIVE GEN map)
  - **staging/dev** defaults **false** (commerce testing during migration)
  - Explicit `REQUIRE_GEN_MAPPING_FOR_RX` always wins
- When that flag is true, Rx without READY/ACTIVE GEN mapping fail closed; accessories still sell

### Catalog rollup (from seed + matrix)

| Class | Count |
|---|---|
| READY (accessories + shipping) | 21 |
| GEN_BLOCKED (Rx + visits + labs + membership) | 34 |
| TAGADA_BLOCKED (sellable) | 0 |
| HIDDEN / DEPRECATE | 2 (Sermorelin, Minoxidil Tablets) |

---

## Shipping policy (long-term)

Customer-facing:

| Method | Cents |
|---|---|
| two_day | 3000 |
| next_day | 5000 |
| free_over_500 (eligible merchandise ≥ $500) | 0 |

Membership value does **not** count toward free shipping.  
Demo `1156` / `demo_store_forced_shipping` is **not** a storefront option.

---

## Staging artifact plan

| Artifact | Class |
|---|---|
| `MBM-QA-TAGADA-DEMO-001` map | KEEP FOR STAGING QA |
| `MBM-QA-12E7D-001` order | KEEP FOR STAGING QA |
| Demo Store webhook `whe_755a478e5398` | KEEP FOR STAGING QA |
| Staging `create-kashu` Demo shipping 1156 patch | **REMOVED** (staging redeployed clean) |
| Temp Tagada probes | DELETE LATER (already deleted when used) |
| Old failed checkout `f829…` | IGNORE (not QA order session) |

---

## Security

- No `VITE_TAGADA_*` / `VITE_GEN_*` secrets
- Payment totals server-controlled on card path via `kashu_sku_map` parity
- Browser return cannot mark paid
- Webhook HMAC + amount equality preserved
- `get-order-payment-status` validates `payment_access_token` only

---

## GEN

- Auto-handoff: **NO**
- Post-paid queue prep helper: `src/lib/commerce/postPaidGenQueue.ts` (defaults SKIPPED_AUTOMATION_OFF)
- Clinical portal UX: `resolveClinicalNextSteps` + account order panel behind `VITE_GEN_CLINICAL_UI_ENABLED`

---

## Files changed in 12F (local, uncommitted)

- `src/lib/commerce/*` (eligibility, queue, clinical next steps + tests)
- `src/lib/orders/adminStatusBadges.ts` (+ test)
- `src/lib/orders/orderTypes.ts`
- `src/lib/payments/kashuTagada.ts` (return copy)
- `src/pages/KashuCardResultPage.tsx`
- `src/pages/account/AccountOrderDetailPage.tsx`
- `src/admin/AdminOrders.tsx`
- `supabase/functions/_shared/injectProviderVisit.ts` (shipping authority)
- `supabase/functions/create-invoice-order/index.ts`
- `supabase/functions/tagada-webhook/index.ts` (failure correlation)
- `supabase/functions/get-order-payment-status/index.ts` (new)
- `docs/PHASE_12F_PRODUCT_PURCHASE_READINESS.md` (this file)
