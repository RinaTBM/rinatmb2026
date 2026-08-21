# Phase 12I.2 — Remaining GEN Formulary / Catalog Mapping

**Generated:** 2026-08-21T17:59:52Z  
**Branch:** `deploy/ach-launch-clean-2026`  
**Staging:** `mxvaxkkwrbwhqasnsjpm` · **Production touched:** NO  
**GEN auto-handoff:** OFF  
**API Orders:** NOT ENABLED (Phase 12I.1)  
**External-paid parity assumed:** NO

## Summary

- GEN Products API still lists **22** products (unchanged vs 12G).
- Sellable Rx SKUs: **28** → staging map **1 READY + 27 BLOCKED**.
- No new EXACT owner-verified mappings added (no invented costs/IDs).
- Fat Burner + BPC capsule remain **AMBIGUOUS / BLOCKED**.
- SEM/TIR/HRT/NAD/Selank/Semax/Tesamorelin/skin-hair: **NO_MATCH**.
- Production Rx cutover remains **BLOCKED** until GEN enables API Orders.

## API Orders caveat

`GEN_MAPPING_READY` ≠ production-launchable. Even BPC READY cannot complete external-paid GEN order parity until API Orders is enabled (`GEN_API_ORDERS_NOT_ENABLED`). See `docs/PHASE_12I1_GEN_EXTERNAL_PAID_RESOLUTION.md`.

## BPC READY (reconfirmed)

| Field | Value |
|---|---|
| MBM SKU | `MBM-RP-BPC-INJ-001` |
| GEN productId | `KXMm9SsbOEYnFy9phmZn` |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn` |
| Medication | BPC-157 / TB500 3 MG / 3 MG/ML (5 ML) |
| Pharmacy | Optimal Balance Pharmacy |
| Med cost / ship | $117.00 / NULL (ship unknown — not invented) |
| +50% / +75% / +100% (med) | $175.50 / $204.75 / $234.00 |
| Status | **READY** |
| Launch gate | `GEN_API_ORDERS_NOT_ENABLED` |

## Full pricing / mapping matrix

| CATEGORY | PRODUCT | FORM | STRENGTH | PACKAGE | MBM SKU | GEN CLIENT PRODUCT ID | GEN PRODUCT | GEN MEDICATION | PHARMACY | AT COST | SHIP | LANDED | +50% | +75% | +100% | WEBSITE $ | MATCH | STATUS | READINESS | ACTION | NOTES |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| semaglutide | Semaglutide + B6 Injection | Injection | 0.5mg | Vial | `MBM-WM-SEM-INJ-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $119.00 | NO_MATCH | **BLOCKED** | NEW_SKU_REQUIRED | PROPOSE_NEW_SKU | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glycine/plain requires NEW SKU (MBM-WM |
| semaglutide | Semaglutide + B6 Injection | Injection | 1mg | Vial | `MBM-WM-SEM-INJ-002` | — | — | — | — | — | UNKNOWN | — | — | — | — | $139.00 | NO_MATCH | **BLOCKED** | NEW_SKU_REQUIRED | PROPOSE_NEW_SKU | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glycine/plain requires NEW SKU (MBM-WM |
| semaglutide | Semaglutide + B6 Injection | Injection | 2.5mg | Vial | `MBM-WM-SEM-INJ-003` | — | — | — | — | — | UNKNOWN | — | — | — | — | $189.02 | NO_MATCH | **BLOCKED** | NEW_SKU_REQUIRED | PROPOSE_NEW_SKU | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glycine/plain requires NEW SKU (MBM-WM |
| semaglutide | Semaglutide + B6 Injection | Injection | 5mg | Vial | `MBM-WM-SEM-INJ-004` | — | — | — | — | — | UNKNOWN | — | — | — | — | $329.00 | NO_MATCH | **BLOCKED** | NEW_SKU_REQUIRED | PROPOSE_NEW_SKU | NO_MATCH: GEN catalog has no Semaglutide vial. Current +B6 preserved; future +B12/glycine/plain requires NEW SKU (MBM-WM |
| tirzepatide | Tirzepatide + B6 Injection | Injection | 2.5mg | Vial | `MBM-WM-TIR-INJ-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $189.00 | NO_MATCH | **BLOCKED** | NEW_SKU_REQUIRED | PROPOSE_NEW_SKU | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin — not a TIR vial match. Preserve + |
| tirzepatide | Tirzepatide + B6 Injection | Injection | 7.5mg | Vial | `MBM-WM-TIR-INJ-002` | — | — | — | — | — | UNKNOWN | — | — | — | — | $258.99 | NO_MATCH | **BLOCKED** | NEW_SKU_REQUIRED | PROPOSE_NEW_SKU | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin — not a TIR vial match. Preserve + |
| tirzepatide | Tirzepatide + B6 Injection | Injection | 12.5mg | Vial | `MBM-WM-TIR-INJ-003` | — | — | — | — | — | UNKNOWN | — | — | — | — | $369.00 | NO_MATCH | **BLOCKED** | NEW_SKU_REQUIRED | PROPOSE_NEW_SKU | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin — not a TIR vial match. Preserve + |
| tirzepatide | Tirzepatide + B6 Injection | Injection | 15mg | Vial | `MBM-WM-TIR-INJ-004` | — | — | — | — | — | UNKNOWN | — | — | — | — | $429.00 | NO_MATCH | **BLOCKED** | NEW_SKU_REQUIRED | PROPOSE_NEW_SKU | NO_MATCH: no Tirzepatide +B6 vial in GEN. Elite Body Recomp is Tirzepatide+Sermorelin — not a TIR vial match. Preserve + |
| fat-burner | Fat Burner | Injection | AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2 | 5mL vial | `MBM-WM-FB3-INJ-001` | candidate `yearpPaLo5H0k0FU5Ej8` | AOD-9604 / MOTS-C / Tesamorelin Metaboli | — | — | — | UNKNOWN | — | — | — | — | $259.00 | AMBIGUOUS | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | AMBIGUOUS: name-level actives overlap (AOD/MOTS/Tesamorelin) but strength/package/pharmacy/cost not API-exposed (pricing |
| estradiol-patch | Estradiol Patch | Patch | 0.025mg twice weekly | 8 patches | `MBM-HRT-EST-PAT-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $129.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Estradiol Patch in GEN. Do not substitute cream/gel. |
| estradiol-patch | Estradiol Patch | Patch | 0.05mg twice weekly | 8 patches | `MBM-HRT-EST-PAT-002` | — | — | — | — | — | UNKNOWN | — | — | — | — | $138.98 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Estradiol Patch in GEN. |
| estradiol-patch | Estradiol Patch | Patch | 0.1mg twice weekly | 8 patches | `MBM-HRT-EST-PAT-003` | — | — | — | — | — | UNKNOWN | — | — | — | — | $149.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Estradiol Patch in GEN. |
| progesterone-capsules | Progesterone Capsules | Capsule | 100mg | 30 capsules | `MBM-HRT-PRG-CAP-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $39.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Progesterone capsule in GEN. Do not map troche. |
| progesterone-capsules | Progesterone Capsules | Capsule | 200mg | 30 capsules | `MBM-HRT-PRG-CAP-002` | — | — | — | — | — | UNKNOWN | — | — | — | — | $59.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Progesterone capsule in GEN. |
| testosterone-cream | Testosterone Cream | Cream | 5mg/g | 30g | `MBM-HRT-TST-CRM-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $79.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Testosterone Cream in GEN. Do not map gel. |
| nad-plus | NAD+ Injection | Injection | 100mg/mL · 500mg total | 5mL | `MBM-LON-NAD-INJ-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $199.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no NAD+ injection exact match (Elite Regenesis mentions NAD+ in a multi-protocol — not a vial match). |
| nad-plus | NAD+ Injection | Injection | 100mg/mL · 1,000mg total | 10mL | `MBM-LON-NAD-INJ-002` | — | — | — | — | — | UNKNOWN | — | — | — | — | $229.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no NAD+ 1000mg injection in GEN. |
| selank | Selank Injection | Injection | 5mg/mL | 2mL | `MBM-LON-SEL-INJ-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $129.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Selank injection. Do not map to nasal. |
| semax | Semax Injection | Injection | 5mg/mL | 2mL | `MBM-LON-SMX-INJ-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $129.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Semax injection. Do not map to nasal. |
| selank-semax | Selank + Semax Blend Nasal Spray | Nasal Spray | 50mcg/50mcg per spray | 10mL | `MBM-LON-SSN-NS-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $169.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Selank+Semax nasal blend in GEN. |
| tesamorelin | Tesamorelin Injection | Injection | 10mg total · 5mg/mL | 2mL vial | `MBM-LON-TESA-INJ-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $149.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: Tesamorelin only inside Fat Burner triple / protocols — not standalone vial. |
| bpc-157-tb-500 | Wolverine: BPC-157/TB-500 | Capsule | Blend | Capsule | `MBM-RP-BPC-CAP-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $99.00 | AMBIGUOUS | **BLOCKED** | NEW_SKU_REQUIRED | PROPOSE_NEW_SKU | AMBIGUOUS: GEN oral products are BPC-157 alone (not BPC/TB blend). Form ok (capsule) but actives differ. BLOCKED; NEW SK |
| bpc-157-tb-500 | Wolverine: BPC-157/TB-500 | Injection | Blend | Injection | `MBM-RP-BPC-INJ-001` | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn` | BPC-157 / TB-500 Injection | BPC-157 / TB500 3 MG / 3 MG/ML (5 ML) | Optimal Balance Pharmacy | $117.00 | UNKNOWN | — | $175.50 | $204.75 | $234.00 | $199.00 | EXACT | **READY** | READY | KEEP_READY | Phase 12G owner-verified READY; Phase 12I.2 reconfirmed. Alternate list name iJtyig611AZEDBGdvRd9 (BPC-157/TB500) lacks  |
| tretinoin | Tretinoin Cream | Cream | 0.025% | 20g | `MBM-SH-TRE-CRM-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $79.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Tretinoin in GEN catalog. |
| tretinoin | Tretinoin Cream | Cream | 0.05% | 20g | `MBM-SH-TRE-CRM-002` | — | — | — | — | — | UNKNOWN | — | — | — | — | $89.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Tretinoin in GEN catalog. |
| tretinoin | Tretinoin Cream | Cream | 0.1% | 20g | `MBM-SH-TRE-CRM-003` | — | — | — | — | — | UNKNOWN | — | — | — | — | $109.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Tretinoin in GEN catalog. |
| minoxidil-topical | Minoxidil Combination Topical Formula | Topical Solution | Combination formula | Bottle | `MBM-SH-MIN-SOL-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $129.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Minoxidil combination topical in GEN. |
| bimatoprost | Lash/Brow Growth Serum | Solution | 0.03% | 2.5mL | `MBM-SH-BIM-SOL-001` | — | — | — | — | — | UNKNOWN | — | — | — | — | $89.00 | NO_MATCH | **BLOCKED** | GEN_BLOCKED | KEEP_BLOCKED | NO_MATCH: no Bimatoprost / lash serum in GEN. |

## GEN catalog (22) — research wellness flagged

| productId | name | research? | API price |
|---|---|---|---|
| `PRIG7DYPNNgco3lGf1zx` | AOD-9604 | no | 0 |
| `yearpPaLo5H0k0FU5Ej8` | AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol | no | 0 |
| `7Kix55LA15U0lNvY9QXI` | AOD-9604/MOTS-C | no | 0 |
| `t1JOySXRCJBAeXbkEXW4` | Add Sync | YES | 0 |
| `KXMm9SsbOEYnFy9phmZn` | BPC-157 | no | 0 |
| `MXsSZY2GpiCByJUQer1p` | BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | YES | 0 |
| `Kju2P3fGsc0mbI1UGVeF` | BPC-157 + KPV + TB-500 Anti-Inflammatory Recovery Protocol | no | 0 |
| `kAekLzXT2Wl2MDSBxjls` | BPC-157 + TB-500 + GHK-Cu Recovery & Anti-Aging Protocol | YES | 0 |
| `afROXeaudxZUdh0Y1Qfc` | BPC-157 Gut & Recovery Protocol (Oral Capsules) | no | 0 |
| `TQBv1oBNGfwIGY8ypl86` | BPC-157 Recovery Protocol (Injectable) | no | 0 |
| `NTN40APqv0NQokAGmuyg` | BPC-157 Recovery Protocol (Oral Capsule) | no | 0 |
| `zpQmWLDx6QxyDz5N8IaI` | BPC-157/GHK-U/KPV/TB500 | YES | 0 |
| `lkpQbjBhhWMeLUszAvbh` | BPC-157/GHK/TB500 | YES | 0 |
| `26RwCZyLvfqRYRY7AG6T` | BPC-157/KPV/TB500 | no | 0 |
| `iJtyig611AZEDBGdvRd9` | BPC-157/TB500 | no | 0 |
| `Zd3nud61fajtnKM8EHae` | Elite Body Recomp | YES | 0 |
| `lT5iApLmX80qlBQTr4qE` | Elite Regenesis | YES | 0 |
| `gpwERWfomPpuJyY9oB8V` | Epitalon Longevity & Anti-Aging Protocol | YES | 0 |
| `489YrehNXRlL77fYPkOn` | GHK-Cu | YES | 0 |
| `qQKHHjPkPzs5D35Wgh2x` | GHK-Cu + Epitalon Anti-Aging Protocol | YES | 0 |
| `2CVlt0n5ITgHB1cYxoNY` | GHK-Cu Anti-Aging & Skin Health Protocol (Injectable) | YES | 0 |
| `Yq6xdybfGS55O4kUDVI8` | GHK-Cu/Epithalon | YES | 0 |

## New SKU proposals (not activated)

| OLD SKU | OLD FORMULATION | NEW FORMULATION | PROPOSED NEW SKU | GEN PRODUCT ID | PHARMACY | COST | REASON |
|---|---|---|---|---|---|---|---|
| MBM-WM-SEM-INJ-001…004 | Semaglutide + B6 | Semaglutide + B12 / glycine / plain (when GEN supplies) | `MBM-WM-SEM-INJ-005+` | — | — | — | Additive change; do not reuse B6 SKUs. No GEN Semaglutide product in current 22-product catalog. |
| MBM-WM-TIR-INJ-001…004 | Tirzepatide + B6 | Tirzepatide + B12 / glycine / plain (when GEN supplies) | `MBM-WM-TIR-INJ-005+` | — | — | — | Additive change; Elite Body Recomp is not a vial substitute. No TIR+B6 in GEN catalog. |
| MBM-RP-BPC-CAP-001 | BPC-157 / TB-500 blend capsule | BPC-157 oral (alone) if owner approves replacement | `MBM-RP-BPC-CAP-002` | afROXeaudxZUdh0Y1Qfc or NTN40APqv0NQokAGmuyg (candidate) | — | — | Actives differ (blend vs BPC alone). Do not silently remap CAP-001. |

## Membership impact

**Crosswalk changes required:** NO (no new vial SKUs activated; SEM/TIR fulfillment SKUs remain `MBM-WM-SEM-INJ-001…004` / `MBM-WM-TIR-INJ-001…004`).
Membership rebill still must **not** create GEN orders.
If GEN later supplies +B12/glycine/plain vials and owner activates `005+` SKUs, update `membershipSkuCrosswalk.ts` in a dedicated change — not in this phase.

## Website readiness

| Class | Count |
|---|---|
| GEN_BLOCKED | 18 |
| NEW_SKU_REQUIRED | 9 |
| READY | 1 |

Production fail-closed: Rx without READY/ACTIVE GEN map → Temporarily unavailable. Accessories unaffected.

## Counts

| Metric | Value |
|---|---|
| TOTAL RX SKUS | 28 |
| EXACT READY | 1 |
| VERIFIED REPLACEMENT | 0 |
| AMBIGUOUS | 2 |
| NO MATCH | 25 |
| BLOCKED | 27 |
| NEW SKU REQUIRED (proposed) | SEM/TIR families + optional BPC oral |
| AT-COST known | 1 (BPC) |
| SHIPPING known | 0 |
| API ORDERS | NO / PENDING SUPPORT |
