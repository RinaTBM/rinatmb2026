# GEN Catalog Import Plan (GEN-CATALOG-1B)

**Mode:** READ-ONLY — no POST / PATCH / DELETE
**Phase:** GEN-CATALOG-1B — Normalize existing GEN products + resolve review queue
**Branch:** `cursor/gen-catalog-1-import-plan-945c`
**Generated:** 2026-08-24T05:55:25Z
**Workbook:** `MyBareMethod_FINAL_GEN_Smart_Product_Upload_2026-08-23.xlsx`
**Production website modified:** NO
**GEN modified:** NO
**GEN/Whop cutover:** OFF

Machine-readable twin: `docs/GEN_CATALOG_IMPORT_PLAN.json`.
Normalization detail: `docs/GEN_CATALOG_NORMALIZATION_REPORT.md`.

---

## Final report

| Metric | Value |
|---|---|
| GEN PRODUCTS READ | **254** |
| FORMULARY-PAIRED PRODUCTS | **29** |
| MASTER ROWS | **253** |
| EXISTING EXACT | 0 |
| EXISTING NEEDS UPDATE | 6 |
| EXISTING NEEDS PAIRING | 40 |
| CREATE NEW | 0 |
| FUTURE CREATE HIDDEN | 0 |
| MERGE CANDIDATE | 23 |
| DEACTIVATE CANDIDATE | 1 |
| REVIEW REQUIRED | 183 |
| DO NOT ADD | 0 |
| SEMAGLUTIDE | **REVIEW** |
| TIRZEPATIDE | **REVIEW** |
| METFORMIN GEN PRODUCTS FOUND | `Metformin (Metabolic / Weight Support)`, `Metformin / Topiramate` |
| METFORMIN ACTION | DEACTIVATE_CANDIDATE ONLY — NO WRITE |
| GEN PRODUCTS CREATED | 0 |
| GEN PRODUCTS UPDATED | 0 |
| GEN PRODUCTS DEACTIVATED | 0 |
| GEN MODIFIED | **NO** |
| PRODUCTION WEBSITE MODIFIED | **NO** |
| GEN/WHOP CUTOVER | **OFF** |

**Review queue change:** prior Phase 3–5 `REVIEW_REQUIRED=223` → **1B `REVIEW_REQUIRED=183`** (moved many rows into `EXISTING_NEEDS_PAIRING` / `MERGE_CANDIDATE` / specific review reasons).

---

## Live inventory

LIVE staging 2026-08-24T05:55:25Z: products=254, formularyProducts=29, products_with_formulary=18, storefrontEligible true=27.

### API field gaps (this client)

- `showPatient`, `status`, `displayDescription`, `customerPrice` are **not exposed** on list/detail — use `storefrontEligible` + `pricing.amount` as proxies.
- `view=formulary` returns medication/pharmacy links but **not** strength/form/package.

### Confirmed formulary pairings (29)

| productId | Master / GEN name | standardizedMedicationName | Pharmacy | medicationId |
|---|---|---|---|---|
| `CjqOUbPuGPZzxephqRou` | GLP-1 Weight Loss Plan – Semaglutide / G | Semaglutide + Glycine | Dirx-Hub | `KFVdP0FaVZHpXt9ewjiV` |
| `CjqOUbPuGPZzxephqRou` | GLP-1 Weight Loss Plan – Semaglutide / G | Semaglutide + Glycine | Dirx-Hub | `SX8kyR4siUDVAUrm9CvN` |
| `sssEk3FDY4LFbQYGQsLx` | GLP-1 Weight Loss Plan – Semaglutide / G | Semaglutide + Glycine | Dirx-Hub | `IHYsg7nVwVWB2LjoAR6a` |
| `tk2GW39OGr7JX4MCCoJP` | GLP-1 Weight Loss Plan – Semaglutide / G | Semaglutide + Glycine | Dirx-Hub | `KFVdP0FaVZHpXt9ewjiV` |
| `wQK2JsFnh7oFBf3Lag4n` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide + Glycine | Dirx-Hub | `IHYsg7nVwVWB2LjoAR6a` |
| `wQK2JsFnh7oFBf3Lag4n` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide + Glycine | Dirx-Hub | `KFVdP0FaVZHpXt9ewjiV` |
| `wQK2JsFnh7oFBf3Lag4n` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide + Glycine | Dirx-Hub | `SX8kyR4siUDVAUrm9CvN` |
| `wQK2JsFnh7oFBf3Lag4n` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide + Glycine | Dirx-Hub | `WPEBtvCdn2I8l6tRmT9R` |
| `34I2X8MpVZf3AQTff3bo` | GLP-1 Weight Loss Plan – Semaglutide / B | Semaglutide + Vitamin B12 | Dirx-Hub | `YqrJ1qnOv3U3ecJHuSzr` |
| `SkqQHmsc0WdsbK9vmV1y` | GLP-1 Weight Loss Plan – Semaglutide + B | Semaglutide + Vitamin B12 | Dirx-Hub | `gqe6H8ay1sw6QlS32SMH` |
| `TL7ikswK0XoNvUvHC1iz` | GLP-1 Weight Loss Plan – Semaglutide / B | Semaglutide + Vitamin B12 | Dirx-Hub | `gqe6H8ay1sw6QlS32SMH` |
| `uM0cXePP8e9c5hiMKcRt` | GLP-1 Weight Loss – Semaglutide (High Do | Semaglutide + Vitamin B12 | Dirx-Hub | `3NjukOZyupNSkFBL1vXj` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide B12 ( , , ) | Dirx-Hub | `99BZowkyXTMiGTu5cosT` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide B12 ( , , ) | Dirx-Hub | `ekw92avqC0Uf2thW7fA9` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide B12 ( , , ) | Dirx-Hub | `iXnkfsa6XHugbDanwjUX` |
| `sN2ggSXRJINjElMYTQjf` | GLP-1 Weight Loss Plan – Semaglutide 3-M | Semaglutide B12 ( , , ) | Dirx-Hub | `ekw92avqC0Uf2thW7fA9` |
| `7UMqZumyeXaWMX9zOPP3` | GLP-1 Weight Loss – Semaglutide (Low Dos | Semaglutide / Pyridoxine | Epiq Scripts | `kcN5X4CfS81OBdBPKJu7` |
| `MXsSZY2GpiCByJUQer1p` | BPC-157 + GHK-Cu + KPV + TB-500 Comprehe | BPC-157 / GHK-CU / KPV / TB500 | Greenwich Pharmacy | `KdwgRKpAwUEfZx9SvWWm` |
| `iJtyig611AZEDBGdvRd9` | BPC-157/TB500 | BPC-157 / TB500 | Greenwich Pharmacy | `27WtrIdo3z4Ssj5sDcc6` |
| `489YrehNXRlL77fYPkOn` | GHK-Cu | GHK-CU | Greenwich Pharmacy | `DEu7EzsWmcFP6d60NT9J` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide + B12 | Greenwich Pharmacy | `BmyTz7FPA4wUuojkq2Hy` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide + B12 | Greenwich Pharmacy | `Twz0VeW8olCbbL1UAuQr` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide + B12 | Greenwich Pharmacy | `lPPKidpoLhkYCSV1sLse` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide + B12 | Greenwich Pharmacy | `pBAQDkpmfv9FIcpoqhxa` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semagluti | Semaglutide + B12 | Greenwich Pharmacy | `vCNPRlelLVcJmimIT7Wy` |
| `7Kix55LA15U0lNvY9QXI` | AOD-9604/MOTS-C | AOD 9604 | Optimal Balance Pharmacy | `UvuErUI2gDnbXcr4kqcN` |
| `PRIG7DYPNNgco3lGf1zx` | AOD-9604 | AOD 9604 | Optimal Balance Pharmacy | `UvuErUI2gDnbXcr4kqcN` |
| `yearpPaLo5H0k0FU5Ej8` | AOD-9604 / MOTS-C / Tesamorelin Metaboli | AOD 9604 / MOTS-C / Tesamorelin / Ipamorelin | Optimal Balance Pharmacy | `MFHi8Zq2mIOXiO8fgcw9` |
| `KXMm9SsbOEYnFy9phmZn` | BPC-157 | BPC-157 | Optimal Balance Pharmacy | `AlfsqIQwWXwQkyKOalZi` |

---

## Product families (master rows)

| Family | Count |
|---|---:|
| Recovery / Performance | 57 |
| Other / Unclassified | 54 |
| Weight Management / Semaglutide | 44 |
| Weight Management / Tirzepatide+ | 28 |
| Longevity / Cognitive | 17 |
| Sexual Wellness | 17 |
| Women's Hormone Therapy | 13 |
| Prescription Skin & Hair | 10 |
| Anti-Infective | 5 |
| Sexual Wellness / Scream Cream | 4 |
| Plans / Membership / Ops | 2 |
| Weight Management / Other GLP | 2 |

---

## Semaglutide / Tirzepatide

**Semaglutide:** **REVIEW**
- Parent dose tiers must remain Starting/Low, Mid, High, Any Dose, 3-Month.
- Selected Formulary Dirx-Hub Semaglutide +Glycine / +B12 vial ladder is the exact under-parent formulary set.
- Do not create one customer-facing GEN product per vial.
- Any Dose parents must map to multiple exact dose formulations.
- Do not silently mix B12 / Glycine / L-Carnitine / oral / sublingual / injection.
- LIVE WEBSITE Semaglutide parents in workbook: 11 — all require owner parent→vial mapping (REVIEW).

**Tirzepatide:** **REVIEW**
- Parent dose tiers must remain Starting/Low, Mid, High, Any Dose, 3-Month.
- Selected Formulary Dirx-Hub Tirzepatide +Glycine / +B12 vial ladder is authoritative.
- Do not map Elite Body Recomp as Tirzepatide substitute.
- LIVE WEBSITE Tirzepatide parents in workbook: 0.

Conceptual parent structure (do not create one customer product per vial):

- Semaglutide: Starting/Low · Mid · High · Any Dose · 3-Month
- Tirzepatide: Starting/Low · Mid · High · Any Dose · 3-Month
- Any Dose → multiple exact vial formulations underneath
- Never silently mix B12 / Glycine / L-Carnitine / oral / sublingual / injection

---

## EXISTING_NEEDS_PAIRING (40)

| Master product | GEN productId | Proposed formulary | Pharmacy | Launch |
|---|---|---|---|---|
| 5-Amino-1MQ Metabolic Protocol (Injectable) | `xjXSMUq3yZMTQik5Attj` | 5-AMINO-1MQ 5 MG/ML (5 ML) | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | `MXsSZY2GpiCByJUQer1p` | BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml) | Greenwich Pharmacy | LIVE WEBSITE |
| CJC-1295 / Ipamorelin Growth Hormone Protocol (Injectable) | `Nf8jQnIyG5Zf98SsmpUu` | CJC-1295/ IPAMORELIN 2 MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| DSIP | `vqAq9bWAfFatzbOKQekn` | DSIP 1mg/mL (5ml) | Greenwich Pharmacy | FUTURE - PREP IN GEN |
| Epithalon | `ouWm9Tmk22yFes5EsHKD` | Epithalon 2mg/mL (5ml) | Greenwich Pharmacy | FUTURE - PREP IN GEN |
| Finasteride | `LA7Q6gQEPmnpkduoVnqa` | FINASTERIDE 1 mg | VitaScripts Pharmacy | FUTURE - PREP IN GEN |
| GHK-Cu/Epithalon | `Yq6xdybfGS55O4kUDVI8` | GHK-CU/ EPITHALON 10 MG/ 2 MG/ML (5 ML) | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| IGF-1 LR3 | `17q5TysuAXRBu0rhqmxu` | IGF-LR3 200mcg/mL (5ml) | Greenwich Pharmacy | FUTURE - PREP IN GEN |
| Ivermectin 18mg | `7QK64NwcsDkuCoYPaBtt` | Ivermectin 18mg | St Luke | FUTURE - PREP IN GEN |
| LL-37 | `mUbF6TIhmYT47WcbzASR` | LL-37 2MG/ML (5ml) | Greenwich Pharmacy | FUTURE - PREP IN GEN |
| Liraglutide | `zN79C8bQeKWGSLDVCqTX` | LIRAGLUTIDE 6mg 5ml | Valiant | FUTURE - PREP IN GEN |
| NAD+ (Injectable) | `SHJpGAACUFEeMONdpEbn` | NAD+ 50mg/ml | St Luke | FUTURE - PREP IN GEN |
| NAD+ Anti-Aging Protocol (Topical) | `WcuHmnM1fVgeRx7JiJf2` | METHYLENE BLUE ANTI-AGING (30 ML) | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| PT-141 (Bremelanotide) | `7a11W067k20AKLSsL2xM` | PT-141 (Bremelanotide) 1mg | St Luke | FUTURE - PREP IN GEN |
| Peptides – CJC-1295/Ipamorelin (Injectable) | `HbIjEpVpCqiM5t1qsBHc` | CJC-1295/ IPAMORELIN 2 MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| Peptides – CJC-1295/Ipamorelin (Oral) | `kMfakgh2pcbUw6cdN1OL` | CJC-1295/ IPAMORELIN 2 MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| Pinealon | `303OPy11nUVobkrWEQ3R` | Pinealon/PE22-28/Selank 2MG/2MG/ML (5ml) | Greenwich Pharmacy | FUTURE - PREP IN GEN |
| Pregnyl - HCG (Merck) | `1RKh7XAuwA2DM4fZ6exN` | HCG LYO (PREGNYL) 10,000 IU | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| SS-31 (Elamipretide) Mitochondrial Protection Protocol | `YWzXqs8KGRlhRHx6jHKc` | ELAMIPRETIDE (SS-31) 15 MG/ML (5 ML) | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| Semaglutide Sublingual Drops | `l7KNmFa7tttKlccmpGqO` | SUBLINGUAL SEMAGLUTIDE 10mg/4mL | Greenwich Pharmacy | FUTURE - PREP IN GEN |
| Semaglutide/B12 | `NF825utCtjVqbbGsnQN3` | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | FUTURE - PREP IN GEN |
| Semaglutide/B12 (3 Months) | `vHuDA25F1vt2B2dTvp2F` | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) | Dirx-Hub | FUTURE - PREP IN GEN |
| Semaglutide/B12 (6 Months) | `7p32vVgCU88CBPLVI84N` | SEMAGLUTIDE/B12 0.6 MG/ 500 MCG/ML (2 ML) | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| Semaglutide/L-Carnitine | `Mqv2XnhxqzVB4M9164lZ` | SEMAGLUTIDE/L-CARNITINE (2ML) 2mg/100mg/ml | Vios | FUTURE - PREP IN GEN |
| Sermorelin | `FQKMJhnusoHm9m1O0wgS` | SERMORELIN ACETATE (TROCHE) 1 MG | Vios | FUTURE - PREP IN GEN |
| Sildenafil | `aPAtIOI60gL39ESErrUR` | SILDENAFIL 100 mg | VitaScripts Pharmacy | FUTURE - PREP IN GEN |
| TB-500 Recovery Protocol | `Mld6DVZWa0X3dYxRdhai` | TB-500 3MG/ML (5ml) | Greenwich Pharmacy | FUTURE - PREP IN GEN |
| Tadalafil | `28jSrdfoFaTOwsdbnhOD` | TADALAFIL 10 mg | VitaScripts Pharmacy | FUTURE - PREP IN GEN |
| Tadalafil+Sildenafil | `4gFN4PmvWILkmbX3XJ87` | SILDENAFIL/ TADALAFIL 50 MG/ 10 MG | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| Tesamorelin/Ipamorelin | `qMhf4cGNtrnNbBd5tHbD` | Tesamorelin/Ipamorelin 3mg/2mg/mL (5ml) | Greenwich Pharmacy | FUTURE - PREP IN GEN |
| Thymosin A-1 | `qgn9vCpD8bBN5pXNPKE5` | Thymosin A-1 5mg/mL (5ml) | Greenwich Pharmacy | FUTURE - PREP IN GEN |
| Thymosin Alpha-1 Immune Support Protocol | `HsVceU1fVfQmIBRVTNPR` | THYMOSIN ALPHA-1 3 MG/ML (5 ML) | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| Tirzepatide | `9iUIrANb8j2XW3rNregB` | TIRZEPATIDE 0.5mg 30 count | Valiant | FUTURE - PREP IN GEN |
| Tirzepatide Sublingual Drops | `97LWq6CIZYvHO3jGKb5N` | SUBLINGUAL TIRZEPATIDE 10mg/4mL | Greenwich Pharmacy | FUTURE - PREP IN GEN |
| Tirzepatide/L-Carnitine | `IKkLXq2GCbG1NwDSJwL4` | TIRZEPATIDE/L-CARNITINE (1ML) 10mg/100mg/ml | Vios | FUTURE - PREP IN GEN |
| Tirzepatide/Niacinamide | `RN7GYRnWVmFz8o26pEcD` | TIRZEPATIDE/NIACINAMIDE (68MG/8MG/4ML) 17mg/2mg/ml | Vios | FUTURE - PREP IN GEN |
| Topiramate+Bupropion+Yohimbine | `YRuOnlfY8zqhSDElCYh3` | Bella Lipo (Bupropion HCl/Caffeine/Oxytocin/Topiramate/Naltrexone HCl/Methylcobalamin) 65mg/20mg/100IU/15mg/8mg/1mg | St Luke | FUTURE - PREP IN GEN |
| Trimix T106 (Papaverine +Phentolamine +PGE) | `nKniwgJIqwyBvDQgxLpW` | SB4 TRIMIX PGE, Papaverine, Phentolamine  40mcg/30mg/3mg 2.5ml | Valiant | FUTURE - PREP IN GEN |
| Vardenafil | `tnEy0RPo2Nzma5TYjTgS` | VARDENAFIL 20 MG | Optimal Balance Pharmacy | FUTURE - PREP IN GEN |
| Vardenafil+Tadalafil+Apormorphine | `ABFmjDGL2geOrA9iNcI2` | Tadalafil 5mg/Vardenafil HCl 5mg/Vit D3 2000IU/Vit K2 1mg (GUM) | Epiq Scripts | FUTURE - PREP IN GEN |

## EXISTING_NEEDS_UPDATE (6)

| Master product | GEN productId | Live formulary | Proposed | Reason |
|---|---|---|---|---|
| AOD-9604 | `PRIG7DYPNNgco3lGf1zx` | AOD 9604 | AOD 9604 300 MCG | Formulary linked (['AOD 9604']) roughly matches proposal; match=HIGH CONFIDENCE  |
| AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol | `yearpPaLo5H0k0FU5Ej8` | AOD 9604 / MOTS-C / Tesamorelin / Ipamorelin | AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/ 2MG/ 2MG/ML (5 ML) | Formulary linked (['AOD 9604 / MOTS-C / Tesamorelin / Ipamorelin']) roughly matc |
| AOD-9604/MOTS-C | `7Kix55LA15U0lNvY9QXI` | AOD 9604 | AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/ 2MG/ 2MG/ML (5 ML) | Formulary linked (['AOD 9604']) roughly matches proposal; match=HIGH CONFIDENCE  |
| BPC-157 | `KXMm9SsbOEYnFy9phmZn` | BPC-157 | BPC-157 500 MCG | Formulary linked (['BPC-157']) roughly matches proposal; match=HIGH CONFIDENCE M |
| BPC-157/TB500 | `iJtyig611AZEDBGdvRd9` | BPC-157 / TB500 | BPC-157/TB500 capsules 500MCG/500MCG | Formulary linked (['BPC-157 / TB500']) roughly matches proposal; match=HIGH CONF |
| GHK-Cu | `489YrehNXRlL77fYPkOn` | GHK-CU | Minoxidil 2.5mg/GHK-Cu 5mg/Apigenin 50mg/Fisetin 50mg | Formulary linked (['GHK-CU']) roughly matches proposal; match=HIGH CONFIDENCE MA |

## MERGE_CANDIDATE (23)

| Master product | GEN productId | Primary candidate | Reason |
|---|---|---|---|
| BPC-157 + KPV + TB-500 Anti-Inflammatory Recovery Protocol | `Kju2P3fGsc0mbI1UGVeF` | BPC-157/TB500 | Near-duplicate/alternate naming vs primary `BPC-157/TB500` — owner confirm merge vs keep-as-variant |
| BPC-157 + TB-500 + GHK-Cu Recovery & Anti-Aging Protocol | `kAekLzXT2Wl2MDSBxjls` | BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | Near-duplicate/alternate naming vs primary `BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery P |
| BPC-157 Recovery Protocol (Injectable) | `TQBv1oBNGfwIGY8ypl86` | BPC-157 | Near-duplicate/alternate naming vs primary `BPC-157` — owner confirm merge vs keep-as-variant |
| BPC-157/GHK-U/KPV/TB500 | `zpQmWLDx6QxyDz5N8IaI` | BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | Near-duplicate/alternate naming vs primary `BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery P |
| BPC-157/GHK/TB500 | `lkpQbjBhhWMeLUszAvbh` | BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | Near-duplicate/alternate naming vs primary `BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery P |
| BPC-157/KPV/TB500 | `26RwCZyLvfqRYRY7AG6T` | BPC-157/TB500 | Near-duplicate/alternate naming vs primary `BPC-157/TB500` — owner confirm merge vs keep-as-variant |
| DSIP + BPC-157 + CJC-1295 Sleep & Recovery Protocol | `DshqOc7J1SI03I365DnR` | BPC-157 | Near-duplicate/alternate naming vs primary `BPC-157` — owner confirm merge vs keep-as-variant |
| DSIP/BPC/CJC | `hBU7BtIyLLIKPGdOKLsu` | BPC-157 | Near-duplicate/alternate naming vs primary `BPC-157` — owner confirm merge vs keep-as-variant |
| GHK-Cu Anti-Aging & Skin Health Protocol (Injectable) | `2CVlt0n5ITgHB1cYxoNY` | GHK-Cu | Near-duplicate/alternate naming vs primary `GHK-Cu` — owner confirm merge vs keep-as-variant |
| GLP-1 Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply | `AwwxOWjduXvEOcAXkLBH` | GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | Near-duplicate/alternate naming vs primary `GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation  |
| GLP-1 Weight Loss Plan – Semaglutide (High Dose / Maintenance) | `ZWh2t0ZR2rsUsZ7EkNBF` | GLP-1 Weight Loss – Semaglutide (High Dose) | Near-duplicate/alternate naming vs primary `GLP-1 Weight Loss – Semaglutide (High Dose)` — owner con |
| GLP-1 Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply | `PNXIwHZZsS5kl3Xm7uPN` | GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | Near-duplicate/alternate naming vs primary `GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation  |
| GLP-1 Weight Loss Plan – Semaglutide (Low Dose) | `wTvqATx0X8fO8Hr3SxhN` | GLP-1 Weight Loss – Semaglutide (Low Dose) | Near-duplicate/alternate naming vs primary `GLP-1 Weight Loss – Semaglutide (Low Dose)` — owner conf |
| GLP-1 Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply | `JVsAjB7fGtbKBtmRUjPD` | GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | Near-duplicate/alternate naming vs primary `GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation  |
| GLP-1 Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply | `YOlkiOC7QXXvfyGCRAoh` | GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | Near-duplicate/alternate naming vs primary `GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation  |
| GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Low: 1→2→4mg) | `LEWPChDd8BdaMSJlV9pl` | GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | Near-duplicate/alternate naming vs primary `GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation  |
| GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Mid: 2→4→6mg) | `XQA8d31lsyU41o8Tb87o` | GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | Near-duplicate/alternate naming vs primary `GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation  |
| Glow – GHK-Cu + BPC-157 + TB-500 Anti-Aging & Recovery Protocol | `nVAoeyVUPnPNc4ufqrIR` | BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | Near-duplicate/alternate naming vs primary `BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery P |
| Hair Loss – GHK-Cu Peptide Scalp Protocol | `DTrcxHRUH1xB7ssj0K2P` | GHK-Cu | Near-duplicate/alternate naming vs primary `GHK-Cu` — owner confirm merge vs keep-as-variant |
| Peptides – BPC-157 (Injectable) | `f8iFGqOGRXlFbjSiyVU1` | BPC-157 | Near-duplicate/alternate naming vs primary `BPC-157` — owner confirm merge vs keep-as-variant |
| Weight Loss Support – AOD-9604 / MOTS-C Metabolic Peptide Protocol | `b4HNekUWbQUvnyfJcQoU` | AOD-9604/MOTS-C | Near-duplicate/alternate naming vs primary `AOD-9604/MOTS-C` — owner confirm merge vs keep-as-varian |
| Weight Loss Support – AOD-9604 Fat-Burning Peptide Protocol | `RggWfvhVVeUMDJDiHuDV` | AOD-9604 | Near-duplicate/alternate naming vs primary `AOD-9604` — owner confirm merge vs keep-as-variant |
| Wolverine – BPC-157 + TB-500 Recovery Protocol | `omhh3NabouO8AsNR5tkD` | BPC-157/TB500 | Near-duplicate/alternate naming vs primary `BPC-157/TB500` — owner confirm merge vs keep-as-variant |

## DEACTIVATE_CANDIDATE (1 master + 2 Metformin GEN-only)

| Product | Scope | Reason |
|---|---|---|
| BPC-157 (Copy 1) | master | Workbook copy row — not a customer-facing parent; ignore/deactivate later |
| Metformin (Metabolic / Weight Support) (`aWmuj8jNPv0S1vsLaMnN`) | GEN-only | Metformin DO NOT ADD — DEACTIVATE_CANDIDATE ONLY — NO WRITE |
| Metformin / Topiramate (`XHU8xCrpXQmFzJGce7d7`) | GEN-only | Metformin DO NOT ADD — DEACTIVATE_CANDIDATE ONLY — NO WRITE |

---

## REVIEW_REQUIRED

Total: **183** — every row has a specific reason + owner decision in JSON / normalization report.

See `docs/GEN_CATALOG_NORMALIZATION_REPORT.md` for the full REVIEW queue table.

---

## Stop for owner review

| Gate | Status |
|---|---|
| PRODUCTS CREATED | **0** |
| PRODUCTS UPDATED | **0** |
| PRODUCTS DEACTIVATED | **0** |
| GEN MODIFIED | **NO** |
| Website / production cutover | **OFF / untouched** |

Awaiting owner decisions on REVIEW / MERGE / PAIRING / SEM-TIR dose-ladder matrices before any GEN write phase.
