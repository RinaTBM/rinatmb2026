# Phase 12I.2 — Definitive 28-SKU GEN Formulary + Pricing Matrix

**Generated:** 2026-08-21T18:19:20Z  
**Branch:** `deploy/ach-launch-clean-2026`  
**Staging:** `mxvaxkkwrbwhqasnsjpm` · **Production:** `bsgtuuzwgeetsjjdrtrm` (untouched)  
**GEN auto-handoff:** OFF  
**Machine-readable:** `docs/PHASE_12I2_28_SKU_FORMULARY_PRICING_MATRIX.json`

## GEN API ORDERS — PENDING ENABLEMENT FROM SCRIPTIFUL / GEN

`CATALOG READY` ≠ `PRODUCTION RX READY`. Even BPC READY mapping is **not** production-purchasable for external-paid GEN handoff until API Orders is enabled.

## Summary

- **TOTAL RX SKUS:** 28
- **READY:** 1
- **BLOCKED:** 18
- **NEW_SKU_REQUIRED:** 9
- **GEN EXACT MATCH:** 1
- **VERIFIED REPLACEMENT:** 0
- **AMBIGUOUS:** 2
- **NO MATCH:** 25
- **CURRENT PRICES BELOW +50:** 0
- **CURRENT PRICES +50–75:** 1
- **CURRENT PRICES +75–100:** 0
- **CURRENT PRICES ABOVE +100:** 0
- **At-cost known:** 1 · **Shipping known:** 0 · **Shipping unknown:** 28

## Markup formulas

- AT COST = GEN medication cost (when known)
- COST +50% = cost × 1.50 · COST +75% = cost × 1.75 · COST +100% = cost × 2.00 (round to cents)
- Shipping / landed cost left **TBD** when not exposed — never invented

## Master 28-SKU matrix

> Wide table — use the JSON for spreadsheets.

| CATEGORY | MBM PRODUCT | VARIANT | MBM SKU | MBM FORMULATION | STRENGTH | FORM | PACKAGE | WEBSITE $ | TAGADA VARIANT | TAGADA PRICE | GEN CLIENT PRODUCT ID | GEN PRODUCT | GEN FORMULATION | PHARMACY | GEN STRENGTH | GEN FORM | GEN PKG | AT COST | SHIP | LANDED | +50% | +75% | +100% | VS +50¢ | VS +75¢ | VS +100¢ | BAND | MATCH | MAP | WEBSITE | NEW SKU? | PROPOSED NEW SKU | REPLACES | NOTES |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| semaglutide | Semaglutide + B6 Injection | semaglutide-v1 | `MBM-WM-SEM-INJ-001` | Semaglutide + B6 | 0.5mg | Injection | Vial | $119.00 | variant_4786fced127f | price_59b410d4149c | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | NEW_SKU_REQUIRED | YES | MBM-WM-SEM-INJ-005+ (family; per-strength TBD when GEN supplies) | — | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glyci... |
| semaglutide | Semaglutide + B6 Injection | semaglutide-v2 | `MBM-WM-SEM-INJ-002` | Semaglutide + B6 | 1mg | Injection | Vial | $139.00 | variant_e7e4aa7479b0 | price_45e11dcc8f3d | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | NEW_SKU_REQUIRED | YES | MBM-WM-SEM-INJ-005+ (family; per-strength TBD when GEN supplies) | — | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glyci... |
| semaglutide | Semaglutide + B6 Injection | semaglutide-v3 | `MBM-WM-SEM-INJ-003` | Semaglutide + B6 | 2.5mg | Injection | Vial | $189.02 | variant_1578824794e6 | price_a6e38799524f | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | NEW_SKU_REQUIRED | YES | MBM-WM-SEM-INJ-005+ (family; per-strength TBD when GEN supplies) | — | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glyci... |
| semaglutide | Semaglutide + B6 Injection | semaglutide-v4 | `MBM-WM-SEM-INJ-004` | Semaglutide + B6 | 5mg | Injection | Vial | $329.00 | variant_0858c18b808e | price_dbc846be2af8 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | NEW_SKU_REQUIRED | YES | MBM-WM-SEM-INJ-005+ (family; per-strength TBD when GEN supplies) | — | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glyci... |
| tirzepatide | Tirzepatide + B6 Injection | tirzepatide-v1 | `MBM-WM-TIR-INJ-001` | Tirzepatide + B6 | 2.5mg | Injection | Vial | $189.00 | variant_8ed93e38d4bb | price_a638edd7e278 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | NEW_SKU_REQUIRED | YES | MBM-WM-TIR-INJ-005+ (family; per-strength TBD when GEN supplies) | — | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin —... |
| tirzepatide | Tirzepatide + B6 Injection | tirzepatide-v2 | `MBM-WM-TIR-INJ-002` | Tirzepatide + B6 | 7.5mg | Injection | Vial | $258.99 | variant_65197b99b7c1 | price_025ae1e10e81 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | NEW_SKU_REQUIRED | YES | MBM-WM-TIR-INJ-005+ (family; per-strength TBD when GEN supplies) | — | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin —... |
| tirzepatide | Tirzepatide + B6 Injection | tirzepatide-v3 | `MBM-WM-TIR-INJ-003` | Tirzepatide + B6 | 12.5mg | Injection | Vial | $369.00 | variant_c36104e1b53c | price_3c12d8bb293b | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | NEW_SKU_REQUIRED | YES | MBM-WM-TIR-INJ-005+ (family; per-strength TBD when GEN supplies) | — | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin —... |
| tirzepatide | Tirzepatide + B6 Injection | tirzepatide-v4 | `MBM-WM-TIR-INJ-004` | Tirzepatide + B6 | 15mg | Injection | Vial | $429.00 | variant_89f15bb9ad30 | price_8a73862931ca | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | NEW_SKU_REQUIRED | YES | MBM-WM-TIR-INJ-005+ (family; per-strength TBD when GEN supplies) | — | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin —... |
| fat-burner | Fat Burner | fat-burner-v1 | `MBM-WM-FB3-INJ-001` | AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL) | AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL) | Injection | 5mL vial | $259.00 | variant_2c53926ab625 | price_197259afe856 | f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_yearpPaLo5H0k0FU5Ej8 | AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | AMBIGUOUS | BLOCKED | BLOCKED | NO | — | — | AMBIGUOUS: actives overlap but strength/package/pharmacy/cost not exposed (API amount=0... |
| estradiol-patch | Estradiol Patch | estradiol-patch-v1 | `MBM-HRT-EST-PAT-001` | Estradiol Patch | 0.025mg twice weekly | Patch | 8 patches | $129.00 | variant_77a5809b96cc | price_bb2cd434d6cb | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Estradiol Patch in GEN. Do not substitute cream/gel. |
| estradiol-patch | Estradiol Patch | estradiol-patch-v2 | `MBM-HRT-EST-PAT-002` | Estradiol Patch | 0.05mg twice weekly | Patch | 8 patches | $138.98 | variant_96a619fecc8b | price_bc07cb8899a4 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Estradiol Patch in GEN. |
| estradiol-patch | Estradiol Patch | estradiol-patch-v3 | `MBM-HRT-EST-PAT-003` | Estradiol Patch | 0.1mg twice weekly | Patch | 8 patches | $149.00 | variant_48a704f13621 | price_22d08b77e3ac | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Estradiol Patch in GEN. |
| progesterone-capsules | Progesterone Capsules | progesterone-capsules-v1 | `MBM-HRT-PRG-CAP-001` | Progesterone Capsules | 100mg | Capsule | 30 capsules | $39.00 | variant_e37d0c490dba | price_a99f863c0fe1 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Progesterone capsule in GEN. Do not map troche. |
| progesterone-capsules | Progesterone Capsules | progesterone-capsules-v2 | `MBM-HRT-PRG-CAP-002` | Progesterone Capsules | 200mg | Capsule | 30 capsules | $59.00 | variant_bdbc2b9f0ade | price_2e5104ff73e0 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Progesterone capsule in GEN. |
| testosterone-cream | Testosterone Cream | testosterone-cream-v1 | `MBM-HRT-TST-CRM-001` | Testosterone Cream | 5mg/g | Cream | 30g | $79.00 | variant_39c27962b958 | price_14296712e379 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Testosterone Cream in GEN. Do not map gel. |
| nad-plus | NAD+ Injection | nad-plus-v1 | `MBM-LON-NAD-INJ-001` | NAD+ Injection | 100mg/mL · 500mg total | Injection | 5mL | $199.00 | variant_d2b5be492da2 | price_f7e899c11336 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no NAD+ injection exact match (Elite Regenesis mentions NAD+ in a multi-proto... |
| nad-plus | NAD+ Injection | nad-plus-v2 | `MBM-LON-NAD-INJ-002` | NAD+ Injection | 100mg/mL · 1,000mg total | Injection | 10mL | $229.00 | variant_5085e02375d1 | price_94fd558220c1 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no NAD+ 1000mg injection in GEN. |
| selank | Selank Injection | selank-v1 | `MBM-LON-SEL-INJ-001` | Selank Injection | 5mg/mL | Injection | 2mL | $129.00 | variant_35f9129e2cae | price_0519a38f67b0 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Selank injection. Do not map to nasal. |
| semax | Semax Injection | semax-v1 | `MBM-LON-SMX-INJ-001` | Semax Injection | 5mg/mL | Injection | 2mL | $129.00 | variant_8f66246f1d44 | price_6aca1278605b | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Semax injection. Do not map to nasal. |
| selank-semax | Selank + Semax Blend Nasal Spray | selank-semax-nasal-spray-v1 | `MBM-LON-SSN-NS-001` | Selank + Semax Blend Nasal Spray | 50mcg/50mcg per spray | Nasal Spray | 10mL | $169.00 | variant_7fa5cf5aab9c | price_12025a97b268 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Selank+Semax nasal blend in GEN. |
| tesamorelin | Tesamorelin Injection | tesamorelin-v1 | `MBM-LON-TESA-INJ-001` | Tesamorelin Injection | 10mg total · 5mg/mL | Injection | 2mL vial | $149.00 | variant_2471d74b381b | price_9e528d04b5f4 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: Tesamorelin only inside Fat Burner triple / protocols — not standalone vial. |
| bpc-157-tb-500 | Wolverine: BPC-157/TB-500 | bpc-157-tb-500-v1 | `MBM-RP-BPC-CAP-001` | BPC-157 / TB-500 | Blend | Capsule | Capsule | $99.00 | variant_5d38654f00fc | price_548c95f3d3bd | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | AMBIGUOUS | BLOCKED | NEW_SKU_REQUIRED | YES | MBM-RP-BPC-CAP-002 | — | AMBIGUOUS: GEN oral is BPC-157 alone, not BPC/TB blend. NEW SKU if owner approves oral ... |
| bpc-157-tb-500 | Wolverine: BPC-157/TB-500 | bpc-157-tb-500-v2 | `MBM-RP-BPC-INJ-001` | BPC-157 / TB-500 | Blend | Injection | Injection | $199.00 | variant_28a362285cd1 | price_468c0be65863 | f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn | BPC-157 / TB-500 Injection | BPC-157 / TB500 3 MG / 3 MG/ML (5 ML) | Optimal Balance Pharmacy | 3 MG / 3 MG/ML | Injection | 5 mL | $117.00 | TBD | TBD | $175.50 | $204.75 | $234.00 | 2350 | -575 | -3500 | BETWEEN +50 AND +75 | EXACT | READY | READY | NO | — | — | Owner-verified READY (12G); reconfirmed 12I.2. Catalog READY=YES; Production RX READY=N... |
| tretinoin | Tretinoin Cream | tretinoin-cream-v1 | `MBM-SH-TRE-CRM-001` | Tretinoin Cream | 0.025% | Cream | 20g | $79.00 | variant_708bb1c9f5f0 | price_c7871c25c2eb | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Tretinoin in GEN catalog. |
| tretinoin | Tretinoin Cream | tretinoin-cream-v2 | `MBM-SH-TRE-CRM-002` | Tretinoin Cream | 0.05% | Cream | 20g | $89.00 | variant_1988ad508047 | price_8312c58ec718 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Tretinoin in GEN catalog. |
| tretinoin | Tretinoin Cream | tretinoin-cream-v3 | `MBM-SH-TRE-CRM-003` | Tretinoin Cream | 0.1% | Cream | 20g | $109.00 | variant_8f7950e121d1 | price_26636d01db04 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Tretinoin in GEN catalog. |
| minoxidil-topical | Minoxidil Combination Topical Formula | minoxidil-topical-v1 | `MBM-SH-MIN-SOL-001` | Minoxidil Combination Topical Formula | Combination formula | Topical Solution | Bottle | $129.00 | variant_f9e5928143c7 | price_98520d872070 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Minoxidil combination topical in GEN. |
| bimatoprost | Lash/Brow Growth Serum | bimatoprost-solution-v1 | `MBM-SH-BIM-SOL-001` | Lash/Brow Growth Serum | 0.03% | Solution | 2.5mL | $89.00 | variant_321ade2267a1 | price_338fe6049a04 | — | — | — | — | — | — | — | TBD | TBD | TBD | TBD | TBD | TBD | — | — | — | UNKNOWN | NO_MATCH | BLOCKED | BLOCKED | NO | — | — | NO_MATCH: no Bimatoprost / lash serum in GEN. |

## BPC detail (catalog READY)

| Field | Value |
|---|---|
| GEN ID | `KXMm9SsbOEYnFy9phmZn` |
| Formulation | BPC-157 / TB500 3 MG / 3 MG/ML (5 ML) |
| Pharmacy | Optimal Balance Pharmacy |
| At cost | $117.00 |
| +50% / +75% / +100% | $175.50 / $204.75 / $234.00 |
| Current website | $199.00 |
| Band | BETWEEN +50 AND +75 |
| Catalog READY | YES |
| Production RX READY | NO — API Orders pending |
| Website action | KEEP AS-IS (catalog); production gated |

## New SKU proposals

| CATEGORY | CURRENT SKU | CURRENT FORMULATION | GEN FORMULATION | GEN PRODUCT ID | PHARMACY | GEN COST | PROPOSED NEW SKU | OLD SKU ACTION | MEMBERSHIP IMPACT | TAGADA CHANGE | NOTES |
|---|---|---|---|---|---|---|---|---|---|---|---|
| semaglutide | `MBM-WM-SEM-INJ-001` | Semaglutide + B6 | TBD — GEN product not yet available / not exact | — | — | TBD | MBM-WM-SEM-INJ-005+ (family; per-strength TBD when GEN supplies) | KEEP HISTORICAL / BLOCK for new sales when replacement activates | YES if SEM/TIR vial | YES when new SKU activated | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glyci... |
| semaglutide | `MBM-WM-SEM-INJ-002` | Semaglutide + B6 | TBD — GEN product not yet available / not exact | — | — | TBD | MBM-WM-SEM-INJ-005+ (family; per-strength TBD when GEN supplies) | KEEP HISTORICAL / BLOCK for new sales when replacement activates | YES if SEM/TIR vial | YES when new SKU activated | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glyci... |
| semaglutide | `MBM-WM-SEM-INJ-003` | Semaglutide + B6 | TBD — GEN product not yet available / not exact | — | — | TBD | MBM-WM-SEM-INJ-005+ (family; per-strength TBD when GEN supplies) | KEEP HISTORICAL / BLOCK for new sales when replacement activates | YES if SEM/TIR vial | YES when new SKU activated | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glyci... |
| semaglutide | `MBM-WM-SEM-INJ-004` | Semaglutide + B6 | TBD — GEN product not yet available / not exact | — | — | TBD | MBM-WM-SEM-INJ-005+ (family; per-strength TBD when GEN supplies) | KEEP HISTORICAL / BLOCK for new sales when replacement activates | YES if SEM/TIR vial | YES when new SKU activated | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glyci... |
| tirzepatide | `MBM-WM-TIR-INJ-001` | Tirzepatide + B6 | TBD — GEN product not yet available / not exact | — | — | TBD | MBM-WM-TIR-INJ-005+ (family; per-strength TBD when GEN supplies) | KEEP HISTORICAL / BLOCK for new sales when replacement activates | YES if SEM/TIR vial | YES when new SKU activated | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin —... |
| tirzepatide | `MBM-WM-TIR-INJ-002` | Tirzepatide + B6 | TBD — GEN product not yet available / not exact | — | — | TBD | MBM-WM-TIR-INJ-005+ (family; per-strength TBD when GEN supplies) | KEEP HISTORICAL / BLOCK for new sales when replacement activates | YES if SEM/TIR vial | YES when new SKU activated | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin —... |
| tirzepatide | `MBM-WM-TIR-INJ-003` | Tirzepatide + B6 | TBD — GEN product not yet available / not exact | — | — | TBD | MBM-WM-TIR-INJ-005+ (family; per-strength TBD when GEN supplies) | KEEP HISTORICAL / BLOCK for new sales when replacement activates | YES if SEM/TIR vial | YES when new SKU activated | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin —... |
| tirzepatide | `MBM-WM-TIR-INJ-004` | Tirzepatide + B6 | TBD — GEN product not yet available / not exact | — | — | TBD | MBM-WM-TIR-INJ-005+ (family; per-strength TBD when GEN supplies) | KEEP HISTORICAL / BLOCK for new sales when replacement activates | YES if SEM/TIR vial | YES when new SKU activated | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin —... |
| bpc-157-tb-500 | `MBM-RP-BPC-CAP-001` | BPC-157 / TB-500 | TBD — GEN product not yet available / not exact | afROXeaudxZUdh0Y1Qfc / NTN40APqv0NQokAGmuyg | — | TBD | MBM-RP-BPC-CAP-002 | KEEP HISTORICAL / BLOCK for new sales when replacement activates | NO | YES when new SKU activated | AMBIGUOUS: GEN oral is BPC-157 alone, not BPC/TB blend. NEW SKU if owner approves oral ... |

## Membership impact

| MEMBERSHIP | PROGRAM SKU | CURRENT FULFILLMENT SKUS | NEW PROPOSED | GEN PRODUCT | MEMBERSHIP PRICE | GEN COST | CHANGE REQUIRED? | NOTES |
|---|---|---|---|---|---|---|---|---|
| Semaglutide Membership | `MBM-MEM-SEM-MEM-001` | `MBM-WM-SEM-INJ-001`, `MBM-WM-SEM-INJ-002`, `MBM-WM-SEM-INJ-003`, `MBM-WM-SEM-INJ-004` | MBM-WM-SEM-INJ-005+ (only if GEN supplies non-B6 and owner activates) | — | $149.00 | TBD | **NO** | No GEN Semaglutide vials today. Crosswalk unchanged. Do not change recurring Tagada prices. |
| Tirzepatide Membership | `MBM-MEM-TIR-MEM-001` | `MBM-WM-TIR-INJ-001`, `MBM-WM-TIR-INJ-002`, `MBM-WM-TIR-INJ-003`, `MBM-WM-TIR-INJ-004` | MBM-WM-TIR-INJ-005+ (only if GEN supplies non-B6 and owner activates) | — | $249.00 | TBD | **NO** | No GEN Tirzepatide +B6 vials. Elite Body Recomp is not a vial substitute. Crosswalk unchanged. |

## Website catalog action plan

| SKU | PRODUCT | WEBSITE STATUS | ACTION |
|---|---|---|---|
| `MBM-WM-SEM-INJ-001` | Semaglutide + B6 Injection | NEW_SKU_REQUIRED | CREATE NEW VARIANT / REPLACE WITH NEW SKU after owner approval; keep old historical |
| `MBM-WM-SEM-INJ-002` | Semaglutide + B6 Injection | NEW_SKU_REQUIRED | CREATE NEW VARIANT / REPLACE WITH NEW SKU after owner approval; keep old historical |
| `MBM-WM-SEM-INJ-003` | Semaglutide + B6 Injection | NEW_SKU_REQUIRED | CREATE NEW VARIANT / REPLACE WITH NEW SKU after owner approval; keep old historical |
| `MBM-WM-SEM-INJ-004` | Semaglutide + B6 Injection | NEW_SKU_REQUIRED | CREATE NEW VARIANT / REPLACE WITH NEW SKU after owner approval; keep old historical |
| `MBM-WM-TIR-INJ-001` | Tirzepatide + B6 Injection | NEW_SKU_REQUIRED | CREATE NEW VARIANT / REPLACE WITH NEW SKU after owner approval; keep old historical |
| `MBM-WM-TIR-INJ-002` | Tirzepatide + B6 Injection | NEW_SKU_REQUIRED | CREATE NEW VARIANT / REPLACE WITH NEW SKU after owner approval; keep old historical |
| `MBM-WM-TIR-INJ-003` | Tirzepatide + B6 Injection | NEW_SKU_REQUIRED | CREATE NEW VARIANT / REPLACE WITH NEW SKU after owner approval; keep old historical |
| `MBM-WM-TIR-INJ-004` | Tirzepatide + B6 Injection | NEW_SKU_REQUIRED | CREATE NEW VARIANT / REPLACE WITH NEW SKU after owner approval; keep old historical |
| `MBM-WM-FB3-INJ-001` | Fat Burner | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-HRT-EST-PAT-001` | Estradiol Patch | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-HRT-EST-PAT-002` | Estradiol Patch | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-HRT-EST-PAT-003` | Estradiol Patch | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-HRT-PRG-CAP-001` | Progesterone Capsules | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-HRT-PRG-CAP-002` | Progesterone Capsules | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-HRT-TST-CRM-001` | Testosterone Cream | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-LON-NAD-INJ-001` | NAD+ Injection | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-LON-NAD-INJ-002` | NAD+ Injection | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-LON-SEL-INJ-001` | Selank Injection | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-LON-SMX-INJ-001` | Semax Injection | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-LON-SSN-NS-001` | Selank + Semax Blend Nasal Spray | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-LON-TESA-INJ-001` | Tesamorelin Injection | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-RP-BPC-CAP-001` | Wolverine: BPC-157/TB-500 | NEW_SKU_REQUIRED | CREATE NEW VARIANT / REPLACE WITH NEW SKU after owner approval; keep old historical |
| `MBM-RP-BPC-INJ-001` | Wolverine: BPC-157/TB-500 | READY | KEEP AS-IS (catalog); production Rx gated on API Orders |
| `MBM-SH-TRE-CRM-001` | Tretinoin Cream | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-SH-TRE-CRM-002` | Tretinoin Cream | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-SH-TRE-CRM-003` | Tretinoin Cream | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-SH-MIN-SOL-001` | Minoxidil Combination Topical Formula | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |
| `MBM-SH-BIM-SOL-001` | Lash/Brow Growth Serum | BLOCKED | TEMPORARILY UNAVAILABLE under production fail-closed GEN map guard |

## Future / Research candidates (NOT in 28)

| GEN productId | Name | Note |
|---|---|---|
| `t1JOySXRCJBAeXbkEXW4` | Add Sync | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |
| `MXsSZY2GpiCByJUQer1p` | BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |
| `kAekLzXT2Wl2MDSBxjls` | BPC-157 + TB-500 + GHK-Cu Recovery & Anti-Aging Protocol | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |
| `zpQmWLDx6QxyDz5N8IaI` | BPC-157/GHK-U/KPV/TB500 | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |
| `lkpQbjBhhWMeLUszAvbh` | BPC-157/GHK/TB500 | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |
| `Zd3nud61fajtnKM8EHae` | Elite Body Recomp | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |
| `lT5iApLmX80qlBQTr4qE` | Elite Regenesis | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |
| `gpwERWfomPpuJyY9oB8V` | Epitalon Longevity & Anti-Aging Protocol | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |
| `489YrehNXRlL77fYPkOn` | GHK-Cu | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |
| `qQKHHjPkPzs5D35Wgh2x` | GHK-Cu + Epitalon Anti-Aging Protocol | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |
| `2CVlt0n5ITgHB1cYxoNY` | GHK-Cu Anti-Aging & Skin Health Protocol (Injectable) | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |
| `Yq6xdybfGS55O4kUDVI8` | GHK-Cu/Epithalon | Candidate only — not in MBM 28 sellable Rx; do not auto-activate |

## Next step

OWNER REVIEW OF 28-SKU MATRIX → approve formulations + pricing → update website/Tagada catalog → verify GEN API Orders enablement → controlled cutover.

Do **not** start 12J from this phase.

