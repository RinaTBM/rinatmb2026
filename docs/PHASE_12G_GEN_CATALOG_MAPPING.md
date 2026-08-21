# Phase 12G — GEN Catalog Mapping + Gated Post-Paid Handoff

**Generated:** 2026-08-21T16:22:28.774937+00:00

**Staging:** `mxvaxkkwrbwhqasnsjpm` · **Production touched:** NO · **Auto handoff:** OFF

## Summary

- GEN Products API (`x-api-key`) listed **22** products — no SEM/TIR vials, HRT, NAD, Selank/Semax, or skin/hair.
- Only owner-verified **BPC injection** is READY.
- Fat Burner name-match `yearpPaLo5H0k0FU5Ej8` remains AMBIGUOUS (not READY).
- Staging `gen_sku_map`: 1 READY + 27 BLOCKED.
- `canStartGenHandoff` + admin-gated `gen-health-handoff` implemented.

## BPC verified mapping

| Field | Value |
|---|---|
| MBM SKU | `MBM-RP-BPC-INJ-001` |
| GEN productId | `KXMm9SsbOEYnFy9phmZn` |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn` |
| Medication | BPC-157 / TB500 3 MG / 3 MG/ML (5 ML) |
| Pharmacy | Optimal Balance Pharmacy |
| Strength / form / package | 3 MG / 3 MG/ML / Injection / 5 mL |
| Med cost / ship | $117.00 / NULL |
| Status | **READY** |

| Current retail | +50% med | +75% | +100% | Gross over med |
|---|---|---|---|---|
| $199.00 | $175.50 | $204.75 | $234.00 | $82.00 |

## Full 28-SKU matrix

| CATEGORY | PRODUCT | MBM SKU | FORMULATION | FORM | RETAIL | TAGADA PRICE | GEN CLIENT PRODUCT ID | MATCH | STATUS | NOTES |
|---|---|---|---|---|---|---|---|---|---|---|
| weight-management | Semaglutide (0.5mg) | `MBM-WM-SEM-INJ-001` | Semaglutide + B6 | Injection | $119.00 | `price_59b410d4149c` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: GEN catalog has no Semaglutide. +B6 SKU preserved; future +B12/glycine/plain requires NEW  |
| weight-management | Semaglutide (1mg) | `MBM-WM-SEM-INJ-002` | Semaglutide + B6 | Injection | $139.00 | `price_45e11dcc8f3d` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Semaglutide in GEN catalog. +B6 preserved. |
| weight-management | Semaglutide (2.5mg) | `MBM-WM-SEM-INJ-003` | Semaglutide + B6 | Injection | $189.02 | `price_a6e38799524f` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Semaglutide in GEN catalog. +B6 preserved. |
| weight-management | Semaglutide (5mg) | `MBM-WM-SEM-INJ-004` | Semaglutide + B6 | Injection | $329.00 | `price_dbc846be2af8` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Semaglutide in GEN catalog. +B6 preserved. |
| weight-management | Tirzepatide (2.5mg) | `MBM-WM-TIR-INJ-001` | Tirzepatide + B6 | Injection | $189.00 | `price_a638edd7e278` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Tirzepatide vial in GEN catalog. +B6 preserved. |
| weight-management | Tirzepatide (7.5mg) | `MBM-WM-TIR-INJ-002` | Tirzepatide + B6 | Injection | $258.99 | `price_025ae1e10e81` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Tirzepatide vial in GEN catalog. +B6 preserved. |
| weight-management | Tirzepatide (12.5mg) | `MBM-WM-TIR-INJ-003` | Tirzepatide + B6 | Injection | $369.00 | `price_3c12d8bb293b` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Tirzepatide vial in GEN catalog. +B6 preserved. |
| weight-management | Tirzepatide (15mg) | `MBM-WM-TIR-INJ-004` | Tirzepatide + B6 | Injection | $429.00 | `price_8a73862931ca` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Tirzepatide vial in GEN catalog. +B6 preserved. |
| weight-management | Fat Burner (triple) | `MBM-WM-FB3-INJ-001` | AOD/MOTS/Tesamorelin | Injection | $259.00 | `price_197259afe856` | `—` | AMBIGUOUS | **BLOCKED** | AMBIGUOUS candidate yearpPaLo5H0k0FU5Ej8 (AOD/MOTS/Tesamorelin) — strength/package/cost not owner-ve |
| womens-hormone-therapy | Estradiol Patch (0.025) | `MBM-HRT-EST-PAT-001` | Estradiol | Patch | $129.00 | `price_bb2cd434d6cb` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Estradiol Patch in GEN catalog. Do not substitute form. |
| womens-hormone-therapy | Estradiol Patch (0.05) | `MBM-HRT-EST-PAT-002` | Estradiol | Patch | $138.98 | `price_bc07cb8899a4` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Estradiol Patch in GEN catalog. |
| womens-hormone-therapy | Estradiol Patch (0.1) | `MBM-HRT-EST-PAT-003` | Estradiol | Patch | $149.00 | `price_22d08b77e3ac` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Estradiol Patch in GEN catalog. |
| womens-hormone-therapy | Progesterone (100mg) | `MBM-HRT-PRG-CAP-001` | Progesterone | Capsule | $39.00 | `price_a99f863c0fe1` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Progesterone in GEN catalog. |
| womens-hormone-therapy | Progesterone (200mg) | `MBM-HRT-PRG-CAP-002` | Progesterone | Capsule | $59.00 | `price_2e5104ff73e0` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Progesterone in GEN catalog. |
| womens-hormone-therapy | Testosterone Cream (5mg/g) | `MBM-HRT-TST-CRM-001` | Testosterone | Cream | $79.00 | `price_14296712e379` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Testosterone Cream in GEN catalog. |
| longevity-cognitive | NAD+ (500mg) | `MBM-LON-NAD-INJ-001` | NAD+ | Injection | $199.00 | `price_f7e899c11336` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no NAD+ injection exact match. |
| longevity-cognitive | NAD+ (1000mg) | `MBM-LON-NAD-INJ-002` | NAD+ | Injection | $229.00 | `price_94fd558220c1` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no NAD+ injection exact match. |
| longevity-cognitive | Selank (5mg/mL) | `MBM-LON-SEL-INJ-001` | Selank | Injection | $129.00 | `price_0519a38f67b0` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Selank injection. Do not map to nasal. |
| longevity-cognitive | Semax (5mg/mL) | `MBM-LON-SMX-INJ-001` | Semax | Injection | $129.00 | `price_6aca1278605b` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Semax injection. Do not map to nasal. |
| longevity-cognitive | Selank+Semax NS (blend) | `MBM-LON-SSN-NS-001` | Selank+Semax | Nasal Spray | $169.00 | `price_12025a97b268` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Selank/Semax nasal blend. |
| longevity-cognitive | Tesamorelin (10mg) | `MBM-LON-TESA-INJ-001` | Tesamorelin | Injection | $149.00 | `price_9e528d04b5f4` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: Tesamorelin only inside Fat Burner triple — not standalone. |
| recovery-performance | Wolverine BPC/TB (capsule) | `MBM-RP-BPC-CAP-001` | BPC-157/TB-500 | Capsule | $99.00 | `price_548c95f3d3bd` | `—` | AMBIGUOUS | **BLOCKED** | AMBIGUOUS: GEN oral BPC is BPC-157 alone, not BPC/TB blend. |
| recovery-performance | Wolverine BPC/TB (inj) | `MBM-RP-BPC-INJ-001` | BPC-157/TB-500 | Injection | $199.00 | `price_468c0be65863` | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn` | EXACT | **READY** | Phase 12G: owner-verified READY. GEN productId=KXMm9SsbOEYnFy9phmZn; gen_client_product_id=full clie |
| prescription-skin-hair | Tretinoin (0.025%) | `MBM-SH-TRE-CRM-001` | Tretinoin | Cream | $79.00 | `price_c7871c25c2eb` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Tretinoin in GEN catalog. |
| prescription-skin-hair | Tretinoin (0.05%) | `MBM-SH-TRE-CRM-002` | Tretinoin | Cream | $89.00 | `price_8312c58ec718` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Tretinoin in GEN catalog. |
| prescription-skin-hair | Tretinoin (0.1%) | `MBM-SH-TRE-CRM-003` | Tretinoin | Cream | $109.00 | `price_26636d01db04` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Tretinoin in GEN catalog. |
| prescription-skin-hair | Minoxidil combo (bottle) | `MBM-SH-MIN-SOL-001` | Minoxidil combo | Topical | $129.00 | `price_98520d872070` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Minoxidil combo topical. |
| prescription-skin-hair | Lash/Brow (0.03%) | `MBM-SH-BIM-SOL-001` | Bimatoprost | Solution | $89.00 | `price_338fe6049a04` | `—` | NO_MATCH | **BLOCKED** | NO_MATCH: no Bimatoprost / lash serum. |

## Semaglutide / Tirzepatide

Current +B6 SKUs **preserved**. GEN has no Semaglutide; no TIR vial SKU.
If GEN later supplies +B12/glycine/plain → propose `MBM-WM-SEM-INJ-005+` / `MBM-WM-TIR-INJ-005+` (do not reuse B6 SKUs).

| OLD SKU | NEW FORMULATION | PROPOSED NEW SKU | REASON |
|---|---|---|---|
| MBM-WM-SEM-INJ-001…004 | Semaglutide +B12/glycine/plain | MBM-WM-SEM-INJ-005+ | Additive change |
| MBM-WM-TIR-INJ-001…004 | Tirzepatide +B12/glycine/plain | MBM-WM-TIR-INJ-005+ | Additive change |

## GEN catalog (22)

| productId | name |
|---|---|
| `PRIG7DYPNNgco3lGf1zx` | AOD-9604 |
| `yearpPaLo5H0k0FU5Ej8` | AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol |
| `7Kix55LA15U0lNvY9QXI` | AOD-9604/MOTS-C |
| `t1JOySXRCJBAeXbkEXW4` | Add Sync |
| `KXMm9SsbOEYnFy9phmZn` | BPC-157 |
| `MXsSZY2GpiCByJUQer1p` | BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol |
| `Kju2P3fGsc0mbI1UGVeF` | BPC-157 + KPV + TB-500 Anti-Inflammatory Recovery Protocol |
| `kAekLzXT2Wl2MDSBxjls` | BPC-157 + TB-500 + GHK-Cu Recovery & Anti-Aging Protocol |
| `afROXeaudxZUdh0Y1Qfc` | BPC-157 Gut & Recovery Protocol (Oral Capsules) |
| `TQBv1oBNGfwIGY8ypl86` | BPC-157 Recovery Protocol (Injectable) |
| `NTN40APqv0NQokAGmuyg` | BPC-157 Recovery Protocol (Oral Capsule) |
| `zpQmWLDx6QxyDz5N8IaI` | BPC-157/GHK-U/KPV/TB500 |
| `lkpQbjBhhWMeLUszAvbh` | BPC-157/GHK/TB500 |
| `26RwCZyLvfqRYRY7AG6T` | BPC-157/KPV/TB500 |
| `iJtyig611AZEDBGdvRd9` | BPC-157/TB500 |
| `Zd3nud61fajtnKM8EHae` | Elite Body Recomp |
| `lT5iApLmX80qlBQTr4qE` | Elite Regenesis |
| `gpwERWfomPpuJyY9oB8V` | Epitalon Longevity & Anti-Aging Protocol |
| `489YrehNXRlL77fYPkOn` | GHK-Cu |
| `qQKHHjPkPzs5D35Wgh2x` | GHK-Cu + Epitalon Anti-Aging Protocol |
| `2CVlt0n5ITgHB1cYxoNY` | GHK-Cu Anti-Aging & Skin Health Protocol (Injectable) |
| `Yq6xdybfGS55O4kUDVI8` | GHK-Cu/Epithalon |

## Membership impact

**Crosswalk changes required:** NO (no new vial SKUs activated).

## Handoff

- Gate: `canStartGenHandoff`
- Auto: OFF (`GEN_HANDOFF_AUTOMATION_ENABLED=false`)
- Manual: admin JWT + optional `forceManual=true`
- Paid preserved on GEN failure → `GEN_RETRY_REQUIRED`
- Visits/labs unchanged
