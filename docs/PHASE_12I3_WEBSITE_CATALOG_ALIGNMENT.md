# Phase 12I.3 — Website Catalog Alignment + Owner Pricing Prep

**Branch:** `deploy/ach-launch-clean-2026`  
**Start head:** `54ec4dd923578014ecd82342c65d6b9a124c9a6c`  
**Staging:** `mxvaxkkwrbwhqasnsjpm` · **Production:** `bsgtuuzwgeetsjjdrtrm` (**untouched**)  
**Mode:** LOCAL + STAGING-SAFE CATALOG PREPARATION ONLY  
**GEN auto-handoff:** OFF  
**Tagada writes:** NO · **Website retail price changes:** NO  

Authoritative matrix source: `docs/PHASE_12I2_28_SKU_FORMULARY_PRICING_MATRIX.md` (+ `.json`).

---

## Production readiness summary

| Metric | Value |
|---|---|
| TOTAL RX | 28 |
| CATALOG READY | 1 (`MBM-RP-BPC-INJ-001`) |
| TEMPORARILY UNAVAILABLE | 18 |
| NEW SKU REQUIRED | 9 |
| PRODUCTION RX READY | **0** |
| API ORDERS | **PENDING** (`GEN_API_ORDERS_ENABLED=false`) |
| COST KNOWN | 1 |
| COST UNKNOWN | 27 |

`CATALOG READY` ≠ `PRODUCTION RX READY`.

---

## API Orders capability gate

| Flag | Meaning | Default |
|---|---|---|
| `GEN_HEALTH_ENABLED` | GEN API integration exists | `false` |
| `GEN_API_ORDERS_ENABLED` | External-paid / API Orders capability for this client — **required** for production Rx checkout when mapping guard is on | `false` |
| `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED` | May send `order.payment_status="paid"` in create payload | unset / `false` |
| `VITE_GEN_API_ORDERS_ENABLED` | **UX-only** storefront mirror (Coming soon vs Available). Never trusted by server | unset → false |

Implemented in:

- `src/lib/commerce/commerceEnvPolicy.ts` → `resolveGenApiOrdersEnabled`
- Edge mirror: `supabase/functions/_shared/commerceEnvPolicy.ts`
- Cart gate: `assertCartEligibleForCheckout({ genApiOrdersEnabled })`
- Invoice gate: `create-invoice-order` `assertRxGenMappingsReady` (mapping READY **and** API Orders)

See `docs/COMMERCE_STAGING_PRODUCTION_CONFIG.md`.

---

## 28-SKU website action table

| CATEGORY | CURRENT PRODUCT | CURRENT SKU | MATRIX STATUS | WEBSITE ACTION | CUSTOMER-FACING | REPLACEMENT SKU | NOTES |
|---|---|---|---|---|---|---|---|
| Semaglutide | Semaglutide + B6 | `MBM-WM-SEM-INJ-001` | NEW_SKU_REQUIRED | PREPARE_REPLACEMENT_SKU | Temporarily unavailable | `MBM-WM-SEM-INJ-005` | Old +B6 preserved; not activated |
| Semaglutide | Semaglutide + B6 | `MBM-WM-SEM-INJ-002` | NEW_SKU_REQUIRED | PREPARE_REPLACEMENT_SKU | Temporarily unavailable | `MBM-WM-SEM-INJ-006` | |
| Semaglutide | Semaglutide + B6 | `MBM-WM-SEM-INJ-003` | NEW_SKU_REQUIRED | PREPARE_REPLACEMENT_SKU | Temporarily unavailable | `MBM-WM-SEM-INJ-007` | |
| Semaglutide | Semaglutide + B6 | `MBM-WM-SEM-INJ-004` | NEW_SKU_REQUIRED | PREPARE_REPLACEMENT_SKU | Temporarily unavailable | `MBM-WM-SEM-INJ-008` | |
| Tirzepatide | Tirzepatide + B6 | `MBM-WM-TIR-INJ-001` | NEW_SKU_REQUIRED | PREPARE_REPLACEMENT_SKU | Temporarily unavailable | `MBM-WM-TIR-INJ-005` | |
| Tirzepatide | Tirzepatide + B6 | `MBM-WM-TIR-INJ-002` | NEW_SKU_REQUIRED | PREPARE_REPLACEMENT_SKU | Temporarily unavailable | `MBM-WM-TIR-INJ-006` | |
| Tirzepatide | Tirzepatide + B6 | `MBM-WM-TIR-INJ-003` | NEW_SKU_REQUIRED | PREPARE_REPLACEMENT_SKU | Temporarily unavailable | `MBM-WM-TIR-INJ-007` | |
| Tirzepatide | Tirzepatide + B6 | `MBM-WM-TIR-INJ-004` | NEW_SKU_REQUIRED | PREPARE_REPLACEMENT_SKU | Temporarily unavailable | `MBM-WM-TIR-INJ-008` | |
| Fat Burner | Fat Burner | `MBM-WM-FB3-INJ-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | AMBIGUOUS — not activated |
| Estradiol | Estradiol Patch | `MBM-HRT-EST-PAT-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Estradiol | Estradiol Patch | `MBM-HRT-EST-PAT-002` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Estradiol | Estradiol Patch | `MBM-HRT-EST-PAT-003` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Progesterone | Progesterone Capsules | `MBM-HRT-PRG-CAP-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Progesterone | Progesterone Capsules | `MBM-HRT-PRG-CAP-002` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Testosterone | Testosterone Cream | `MBM-HRT-TST-CRM-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| NAD+ | NAD+ Injection | `MBM-LON-NAD-INJ-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| NAD+ | NAD+ Injection | `MBM-LON-NAD-INJ-002` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Selank | Selank Injection | `MBM-LON-SEL-INJ-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Semax | Semax Injection | `MBM-LON-SMX-INJ-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Selank+Semax | Nasal Spray | `MBM-LON-SSN-NS-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Tesamorelin | Tesamorelin Injection | `MBM-LON-TESA-INJ-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| BPC capsule | Wolverine capsule | `MBM-RP-BPC-CAP-001` | NEW_SKU_REQUIRED | PREPARE_REPLACEMENT_SKU | Temporarily unavailable | `MBM-RP-BPC-CAP-002` | |
| BPC injection | Wolverine injection | `MBM-RP-BPC-INJ-001` | READY | KEEP_READY | Coming soon | — | Catalog READY; API Orders pending |
| Tretinoin | Tretinoin Cream | `MBM-SH-TRE-CRM-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Tretinoin | Tretinoin Cream | `MBM-SH-TRE-CRM-002` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Tretinoin | Tretinoin Cream | `MBM-SH-TRE-CRM-003` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Minoxidil | Minoxidil Combination | `MBM-SH-MIN-SOL-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |
| Bimatoprost | Lash/Brow Growth Serum | `MBM-SH-BIM-SOL-001` | BLOCKED | TEMPORARILY_UNAVAILABLE | Temporarily unavailable | — | |

Counts: **1** KEEP_READY · **18** TEMPORARILY_UNAVAILABLE · **9** PREPARE_REPLACEMENT_SKU.

---

## 9 new SKU proposals (prepared · not activated)

| Proposed SKU | Replaces | Website name | Strength | GEN ID | Cost | Tagada future | Old SKU action |
|---|---|---|---|---|---|---|---|
| `MBM-WM-SEM-INJ-005` | `MBM-WM-SEM-INJ-001` | Semaglutide | 0.5mg | TBD | TBD | CREATE_NEW_PRODUCT_VARIANT | BLOCK_NEW_SALES + KEEP_HISTORICAL |
| `MBM-WM-SEM-INJ-006` | `MBM-WM-SEM-INJ-002` | Semaglutide | 1mg | TBD | TBD | CREATE_NEW_PRODUCT_VARIANT | BLOCK_NEW_SALES + KEEP_HISTORICAL |
| `MBM-WM-SEM-INJ-007` | `MBM-WM-SEM-INJ-003` | Semaglutide | 2.5mg | TBD | TBD | CREATE_NEW_PRODUCT_VARIANT | BLOCK_NEW_SALES + KEEP_HISTORICAL |
| `MBM-WM-SEM-INJ-008` | `MBM-WM-SEM-INJ-004` | Semaglutide | 5mg | TBD | TBD | CREATE_NEW_PRODUCT_VARIANT | BLOCK_NEW_SALES + KEEP_HISTORICAL |
| `MBM-WM-TIR-INJ-005` | `MBM-WM-TIR-INJ-001` | Tirzepatide | 2.5mg | TBD | TBD | CREATE_NEW_PRODUCT_VARIANT | BLOCK_NEW_SALES + KEEP_HISTORICAL |
| `MBM-WM-TIR-INJ-006` | `MBM-WM-TIR-INJ-002` | Tirzepatide | 7.5mg | TBD | TBD | CREATE_NEW_PRODUCT_VARIANT | BLOCK_NEW_SALES + KEEP_HISTORICAL |
| `MBM-WM-TIR-INJ-007` | `MBM-WM-TIR-INJ-003` | Tirzepatide | 12.5mg | TBD | TBD | CREATE_NEW_PRODUCT_VARIANT | BLOCK_NEW_SALES + KEEP_HISTORICAL |
| `MBM-WM-TIR-INJ-008` | `MBM-WM-TIR-INJ-004` | Tirzepatide | 15mg | TBD | TBD | CREATE_NEW_PRODUCT_VARIANT | BLOCK_NEW_SALES + KEEP_HISTORICAL |
| `MBM-RP-BPC-CAP-002` | `MBM-RP-BPC-CAP-001` | BPC-157 (capsule) | TBD | TBD | TBD | CREATE_NEW_PRODUCT_VARIANT | BLOCK_NEW_SALES + KEEP_HISTORICAL |

Internal formulation must be exact GEN text when supplied — do **not** display “+ B6” if replacement differs. Website family names remain Semaglutide / Tirzepatide.

Code: `PROPOSED_REPLACEMENT_SKUS` in `src/lib/commerce/rxCatalogReadiness.ts` (`PREPARED_NOT_ACTIVATED`).

---

## BPC launch state

| Field | Value |
|---|---|
| SKU | `MBM-RP-BPC-INJ-001` |
| GEN ID | `KXMm9SsbOEYnFy9phmZn` |
| Formulation | BPC-157 / TB500 3 MG / 3 MG/ML (5 ML) |
| Pharmacy | Optimal Balance Pharmacy |
| Current retail | **$199.00** (unchanged) |
| At cost | $117.00 |
| +50 / +75 / +100 | $175.50 / $204.75 / $234.00 |
| Price band | BETWEEN +50 AND +75 |
| Shipping | TBD (no landed margin) |
| Website state | COMING_SOON / catalog READY |
| Production purchasable | **NO** |

---

## Owner pricing review table

| PRODUCT | CURRENT $ | GEN COST | +50 | +75 | +100 | RECOMMENDED BAND | OWNER DECISION | FUTURE WEBSITE $ | FUTURE TAGADA |
|---|---|---|---|---|---|---|---|---|---|
| BPC injection | $199.00 | $117.00 | $175.50 | $204.75 | $234.00 | BETWEEN +50 AND +75 | TBD | TBD | NO_CHANGE until approved |
| All other 27 Rx | (see matrix) | TBD | TBD | TBD | TBD | UNKNOWN | TBD | TBD | TBD |

Admin view: `/admin` → GEN Mapping (enhanced columns). Prices **not** editable in this phase.

### Price approval model (documented · no DB migration)

Suggested future fields (not migrated in 12I.3):

- `pricing_review_status`: PENDING | APPROVED | REJECTED
- `approved_retail_cents`
- `approved_at` / `approved_by`

No Tagada update until owner approval + Phase 12I.4.

---

## Tagada future change plan (not executed)

| Class | Action |
|---|---|
| BPC READY | `NO_CHANGE` until owner pricing decision; then possible `PRICE_UPDATE` |
| 18 BLOCKED | `BLOCK_CHECKOUT` (server + UX) |
| 9 NEW_SKU_REQUIRED | `CREATE_NEW_PRODUCT_VARIANT` + `DEPRECATE_OLD_FOR_NEW_SALES` (history preserved) |

Do **not** reuse old Tagada price/variant IDs for materially different formulations.

---

## Customer-facing unavailable copy

- Temporarily unavailable / Check back soon
- Coming soon (catalog-ready BPC while API Orders off)
- Never show: `GEN_BLOCKED`, missing clientProductId, mapping error, pharmacy unavailable, API Orders disabled

Component: `RxAvailabilityBanner` + PDP CTA disable (UX only). Server remain fail-closed.

---

## Membership impact

| Program | Monthly | Status | Notes |
|---|---|---|---|
| Semaglutide Membership | $149 | `BLOCKED_PENDING_GEN` | Med maps NEW_SKU_REQUIRED; prices unchanged; rebill auto-med **NO** |
| Tirzepatide Membership | $249 | `BLOCKED_PENDING_GEN` | Same |

Membership crosswalk unchanged. Recurring billing unchanged. Owner review flagged for copy / fulfillment expectations in 12I.4.

---

## Accessories / visits / labs / clinical

- Accessories: unaffected (bypass GEN + API Orders guards)
- Shipping: unchanged (`0` / `3000` / `5000`)
- IPV / FUV / Lab Review / Lab Kit: unchanged
- Portal clinical UI (12H): unchanged — no requiredActions / timeline / sync changes

---

## Security

- No GEN / Tagada secrets client-side
- No PHI in catalog/pricing logs
- Browser cannot override `GEN_API_ORDERS_ENABLED` (server authoritative)
- Admin mapping/pricing requires admin auth

---

## Next step (do not start here)

OWNER REVIEW → Scriptful enables API Orders → approve replacement SKUs/pricing → **Phase 12I.4** website + Tagada catalog implementation → then **12J** controlled production cutover.

**STOP AFTER PHASE 12I.3.**
