# MBM Website → GEN Routing Build Report

**Generated:** 2026-08-25T01:11:11Z  
**Phase:** MBM-WEBSITE-GEN-ROUTING-BUILD-1  

## What shipped

Normalized **family → selectors → variant → GEN clientProductId** routing layer for the locked architecture.

- Preview QA UI: `/preview/families` and `/preview/families/:familyId`
- Live storefront `/product/*` **unchanged** (legacy B6 SEM/TIR preserved)
- Cutover **OFF** · Real GEN order submission **OFF**
- `genPairingVerified` defaults **false** on every variant (never auto-true)
- Order gate: `assertFamilyVariantGenOrderAllowed` requires cutover + real orders + GEN id + pairing verified + `ROUTING_READY`

## Counts

| Metric | Value |
|---|---:|
| Website families implemented | 30 |
| Website variants implemented | 103 |
| ROUTING_READY | 0 |
| GEN_PAIRING_PENDING | 23 |
| FORMULARY_PENDING | 14 |
| FUTURE_HIDDEN | 51 |
| BLOCKED | 15 |
| Variants with GEN clientProductId | 23 |
| Variants without GEN clientProductId | 80 |

## Focus families

| Family | Complete | Notes |
|---|---|---|
| Semaglutide | YES | B12/Glycine × tiers + $149 membership; B6 blocked in new model |
| Tirzepatide | YES | B12/Glycine × tiers + $275 membership; CREATE CPs pending (no invented IDs) |
| NAD+ | YES | Injection formulary-pending; Nasal r84 routed, r85 awaiting CREATE |
| Wolverine | YES | Capsule $29 / Injection $159 separate GEN CPs |
| Estradiol | YES | Patch selectors; no vaginal CP substitution; CREATE pending |
| Minoxidil | YES | Fin/Minox 0.1%/5% @ $79 Dual Combo CP |

## QA

| Check | Result |
|---|---|
| BUILD | PASS |
| TYPECHECK | PASS |
| TESTS | PASS (527; +10 family routing) |

## Final report

| Item | Value |
|---|---|
| WEBSITE_FAMILIES_IMPLEMENTED | 30 |
| WEBSITE_VARIANTS_IMPLEMENTED | 103 |
| ROUTING_READY | 0 |
| GEN_PAIRING_PENDING | 23 |
| FORMULARY_PENDING | 14 |
| FUTURE_HIDDEN | 51 |
| BLOCKED | 15 |
| VARIANTS_WITH_GEN_CLIENT_PRODUCT_ID | 23 |
| VARIANTS_WITHOUT_GEN_CLIENT_PRODUCT_ID | 80 |
| SEM_FAMILY_COMPLETE | YES |
| TIR_FAMILY_COMPLETE | YES |
| NAD_FAMILY_COMPLETE | YES |
| WOLVERINE_FAMILY_COMPLETE | YES |
| ESTRADIOL_FAMILY_COMPLETE | YES |
| MINOXIDIL_FAMILY_COMPLETE | YES |
| GEN_PAIRING_VERIFICATION_GATE_IMPLEMENTED | YES |
| REAL_GEN_ORDER_SUBMISSION_ENABLED | NO |
| LEGACY_B6_STILL_PRESERVED_UNTIL_CUTOVER | YES |
| GEN_MODIFIED | NO |
| FORMULARY_PAIRINGS_MODIFIED | NO |
| WEBSITE_MODIFIED | YES |
| CHECKOUT_CUTOVER | OFF |
| GEN_WHOP_CUTOVER | OFF |
| BUILD | PASS |
| TYPECHECK | PASS |
| TESTS | PASS |

**STOP FOR OWNER QA.**

Do not publish/cut over the new product architecture yet.  
GEN formulary pairings remain owner-manual. GEN products were not modified.
