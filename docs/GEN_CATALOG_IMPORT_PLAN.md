# GEN Catalog Import Plan (GEN-CATALOG-1B)

> **GEN-CATALOG-1C update:** Stop treating 253 master rows as 253 patient-facing GEN products.
> Use `docs/GEN_CLIENT_PRODUCT_BLUEPRINT.md` (+ `.json`) as the client-product architecture + owner decision queue.
> This import plan remains the prior row-level classification archive.


**Mode:** READ-ONLY — no POST / PATCH / DELETE
**Phase:** GEN-CATALOG-1B — Normalize existing GEN products + resolve review queue
**Branch:** `cursor/gen-catalog-1-import-plan-945c`
**Generated:** 2026-08-24T06:02:46Z
**Workbook:** `MyBareMethod_FINAL_GEN_Smart_Product_Upload_2026-08-23.xlsx`
**Production website modified:** NO
**GEN modified:** NO
**GEN/Whop cutover:** OFF

Companion reports:
- `docs/GEN_CATALOG_IMPORT_PLAN.json` (full machine-readable)
- `docs/GEN_CATALOG_NORMALIZATION_REPORT.md` (families, duplicates, REVIEW reasons)

---

## Final totals

| Classification | Count |
|---|---:|
| **TOTAL MASTER** | **253** |
| EXISTING EXACT | 0 |
| EXISTING NEEDS UPDATE | 7 |
| EXISTING NEEDS PAIRING | 51 |
| CREATE NEW | 0 |
| FUTURE CREATE HIDDEN | 0 |
| MERGE CANDIDATE | 10 |
| DEACTIVATE CANDIDATE | 0 |
| REVIEW REQUIRED | 185 |
| DO NOT ADD | 0 |

**Semaglutide structure:** **REVIEW**
**Tirzepatide structure:** **REVIEW**

**Metformin GEN products found:** 2 — `Metformin (Metabolic / Weight Support)`, `Metformin / Topiramate`
**Metformin action:** DEACTIVATE_CANDIDATE ONLY — NO WRITE

**GEN inventory DEACTIVATE_CANDIDATE (not in workbook):** `Add Sync`, `Metformin (Metabolic / Weight Support)`, `Metformin / Topiramate` — no write this phase.

---

## Live inventory

- Products: **254** (`/v2/client/products?limit=500`)
- Formulary pairings: **29** (`/v2/client/products?limit=500&view=formulary`)
- GEN parent-analysis totals: `{'FUTURE_KEEP_HIDDEN': 189, 'REVIEW_REQUIRED': 34, 'DEACTIVATE_CANDIDATE': 3, 'KEEP_PRIMARY': 28}`

### Confirmed formulary pairings (29)

| productId | Master/GEN name | standardizedMedicationName | pharmacyName | medicationId |
|---|---|---|---|---|
| `CjqOUbPuGPZzxephqRou` | GLP-1 Weight Loss Plan – Semaglutide / Glycine (Mid Dose) | Semaglutide + Glycine | Dirx-Hub | `KFVdP0FaVZHpXt9ewjiV` |
| `CjqOUbPuGPZzxephqRou` | GLP-1 Weight Loss Plan – Semaglutide / Glycine (Mid Dose) | Semaglutide + Glycine | Dirx-Hub | `SX8kyR4siUDVAUrm9CvN` |
| `sssEk3FDY4LFbQYGQsLx` | GLP-1 Weight Loss Plan – Semaglutide / Glycine (High Dose) | Semaglutide + Glycine | Dirx-Hub | `IHYsg7nVwVWB2LjoAR6a` |
| `tk2GW39OGr7JX4MCCoJP` | GLP-1 Weight Loss Plan – Semaglutide / Glycine (Starting Dose) | Semaglutide + Glycine | Dirx-Hub | `KFVdP0FaVZHpXt9ewjiV` |
| `wQK2JsFnh7oFBf3Lag4n` | GLP-1 Weight Loss Membership – Semaglutide / Glycine (Any Dose) | Semaglutide + Glycine | Dirx-Hub | `IHYsg7nVwVWB2LjoAR6a` |
| `wQK2JsFnh7oFBf3Lag4n` | GLP-1 Weight Loss Membership – Semaglutide / Glycine (Any Dose) | Semaglutide + Glycine | Dirx-Hub | `KFVdP0FaVZHpXt9ewjiV` |
| `wQK2JsFnh7oFBf3Lag4n` | GLP-1 Weight Loss Membership – Semaglutide / Glycine (Any Dose) | Semaglutide + Glycine | Dirx-Hub | `SX8kyR4siUDVAUrm9CvN` |
| `wQK2JsFnh7oFBf3Lag4n` | GLP-1 Weight Loss Membership – Semaglutide / Glycine (Any Dose) | Semaglutide + Glycine | Dirx-Hub | `WPEBtvCdn2I8l6tRmT9R` |
| `34I2X8MpVZf3AQTff3bo` | GLP-1 Weight Loss Plan – Semaglutide / B12 (High Dose) | Semaglutide + Vitamin B12 | Dirx-Hub | `YqrJ1qnOv3U3ecJHuSzr` |
| `SkqQHmsc0WdsbK9vmV1y` | GLP-1 Weight Loss Plan – Semaglutide + B12 (Starting Dose / Micro-Dose) | Semaglutide + Vitamin B12 | Dirx-Hub | `gqe6H8ay1sw6QlS32SMH` |
| `TL7ikswK0XoNvUvHC1iz` | GLP-1 Weight Loss Plan – Semaglutide / B12 (Starting Dose) | Semaglutide + Vitamin B12 | Dirx-Hub | `gqe6H8ay1sw6QlS32SMH` |
| `uM0cXePP8e9c5hiMKcRt` | GLP-1 Weight Loss – Semaglutide (High Dose) | Semaglutide + Vitamin B12 | Dirx-Hub | `3NjukOZyupNSkFBL1vXj` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | Semaglutide B12 ( , , ) | Dirx-Hub | `99BZowkyXTMiGTu5cosT` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | Semaglutide B12 ( , , ) | Dirx-Hub | `ekw92avqC0Uf2thW7fA9` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | Semaglutide B12 ( , , ) | Dirx-Hub | `iXnkfsa6XHugbDanwjUX` |
| `sN2ggSXRJINjElMYTQjf` | GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | Semaglutide B12 ( , , ) | Dirx-Hub | `ekw92avqC0Uf2thW7fA9` |
| `7UMqZumyeXaWMX9zOPP3` | GLP-1 Weight Loss – Semaglutide (Low Dose) | Semaglutide / Pyridoxine | Epiq Scripts | `kcN5X4CfS81OBdBPKJu7` |
| `MXsSZY2GpiCByJUQer1p` | BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | BPC-157 / GHK-CU / KPV / TB500 | Greenwich Pharmacy | `KdwgRKpAwUEfZx9SvWWm` |
| `iJtyig611AZEDBGdvRd9` | BPC-157/TB500 | BPC-157 / TB500 | Greenwich Pharmacy | `27WtrIdo3z4Ssj5sDcc6` |
| `489YrehNXRlL77fYPkOn` | GHK-Cu | GHK-CU | Greenwich Pharmacy | `DEu7EzsWmcFP6d60NT9J` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | Semaglutide + B12 | Greenwich Pharmacy | `BmyTz7FPA4wUuojkq2Hy` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | Semaglutide + B12 | Greenwich Pharmacy | `Twz0VeW8olCbbL1UAuQr` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | Semaglutide + B12 | Greenwich Pharmacy | `lPPKidpoLhkYCSV1sLse` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | Semaglutide + B12 | Greenwich Pharmacy | `pBAQDkpmfv9FIcpoqhxa` |
| `MkDIUw0NcJB7YL2pNzYW` | GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | Semaglutide + B12 | Greenwich Pharmacy | `vCNPRlelLVcJmimIT7Wy` |
| `7Kix55LA15U0lNvY9QXI` | AOD-9604/MOTS-C | AOD 9604 | Optimal Balance Pharmacy | `UvuErUI2gDnbXcr4kqcN` |
| `PRIG7DYPNNgco3lGf1zx` | AOD-9604 | AOD 9604 | Optimal Balance Pharmacy | `UvuErUI2gDnbXcr4kqcN` |
| `yearpPaLo5H0k0FU5Ej8` | AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol | AOD 9604 / MOTS-C / Tesamorelin / Ipamorelin | Optimal Balance Pharmacy | `MFHi8Zq2mIOXiO8fgcw9` |
| `KXMm9SsbOEYnFy9phmZn` | BPC-157 | BPC-157 | Optimal Balance Pharmacy | `AlfsqIQwWXwQkyKOalZi` |

---

## EXISTING_EXACT (0)

_None._

---

## EXISTING_NEEDS_UPDATE (7)

| Product | GEN productId | Proposed formulary | Pharmacy | Live SF | Reason |
|---|---|---|---|---|---|
| AOD-9604 | `PRIG7DYPNNgco3lGf1zx` | AOD 9604 300 MCG | Optimal Balance Pharmacy | True | Confirmed formulary link present (['AOD 9604']) but not exact string match to proposed 'AOD 9604 300 |
| AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol | `yearpPaLo5H0k0FU5Ej8` | AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/ 2MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | True | Workbook AUTO MATCH - REVIEW with proposed 'AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/  |
| AOD-9604/MOTS-C | `7Kix55LA15U0lNvY9QXI` | AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/ 2MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | False | Confirmed formulary link present (['AOD 9604']) but not exact string match to proposed 'AOD 9604/ MO |
| BPC-157 | `KXMm9SsbOEYnFy9phmZn` | BPC-157 500 MCG | Optimal Balance Pharmacy | True | Confirmed formulary link present (['BPC-157']) but not exact string match to proposed 'BPC-157 500 M |
| BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | `MXsSZY2GpiCByJUQer1p` | BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml) | Greenwich Pharmacy | True | Workbook AUTO MATCH - REVIEW with proposed 'BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml)'; live links=['B |
| BPC-157/TB500 | `iJtyig611AZEDBGdvRd9` | BPC-157/TB500 capsules 500MCG/500MCG | Greenwich Pharmacy | True | Confirmed formulary link present (['BPC-157 / TB500']) but not exact string match to proposed 'BPC-1 |
| GHK-Cu | `489YrehNXRlL77fYPkOn` | Minoxidil 2.5mg/GHK-Cu 5mg/Apigenin 50mg/Fisetin 50mg | Epiq Scripts | True | Confirmed formulary link present (['GHK-CU']) but not exact string match to proposed 'Minoxidil 2.5m |

---

## EXISTING_NEEDS_PAIRING (51)

| Product | GEN productId | Proposed formulary | Pharmacy | Live SF | Reason |
|---|---|---|---|---|---|
| 5-Amino-1MQ Metabolic Protocol (Injectable) | `xjXSMUq3yZMTQik5Attj` | 5-AMINO-1MQ 5 MG/ML (5 ML) | Optimal Balance Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed '5-AMINO-1MQ 5 MG/ |
| BPC-157 + TB-500 + GHK-Cu Recovery & Anti-Aging Protocol | `kAekLzXT2Wl2MDSBxjls` | BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml) | Greenwich Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'BPC-157/TB-500/GH |
| BPC-157 Recovery Protocol (Injectable) | `TQBv1oBNGfwIGY8ypl86` | BPC-157 500 MCG | Optimal Balance Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'BPC-157 500 MCG'  |
| BPC-157/GHK-U/KPV/TB500 | `zpQmWLDx6QxyDz5N8IaI` | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL (5ml) | Greenwich Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'BPC-157/GHK-CU/KP |
| BPC-157/GHK/TB500 | `lkpQbjBhhWMeLUszAvbh` | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL (5ml) | Greenwich Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| BPC-157/KPV/TB500 | `26RwCZyLvfqRYRY7AG6T` | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL (5ml) | Greenwich Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| CJC-1295 / Ipamorelin Growth Hormone Protocol (Injectable) | `Nf8jQnIyG5Zf98SsmpUu` | CJC-1295/ IPAMORELIN 2 MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'CJC-1295/ IPAMORE |
| DSIP | `vqAq9bWAfFatzbOKQekn` | DSIP 1mg/mL (5ml) | Greenwich Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| DSIP/BPC/CJC | `hBU7BtIyLLIKPGdOKLsu` | DSIP/BPC/CJC 1mg/2mg/2mg (5ml) | Greenwich Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Epithalon | `ouWm9Tmk22yFes5EsHKD` | Epithalon 2mg/mL (5ml) | Greenwich Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Finasteride | `LA7Q6gQEPmnpkduoVnqa` | FINASTERIDE 1 mg | VitaScripts Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| GHK-Cu/Epithalon | `Yq6xdybfGS55O4kUDVI8` | GHK-CU/ EPITHALON 10 MG/ 2 MG/ML (5 ML) | Optimal Balance Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Glow – GHK-Cu + BPC-157 + TB-500 Anti-Aging & Recovery Protocol | `nVAoeyVUPnPNc4ufqrIR` | BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml) | Greenwich Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'BPC-157/TB-500/GH |
| IGF-1 LR3 | `17q5TysuAXRBu0rhqmxu` | IGF-LR3 200mcg/mL (5ml) | Greenwich Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'IGF-LR3 200mcg/mL |
| Ivermectin 18mg | `7QK64NwcsDkuCoYPaBtt` | Ivermectin 18mg | St Luke | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Liraglutide | `zN79C8bQeKWGSLDVCqTX` | LIRAGLUTIDE 6mg 5ml | Valiant | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| LL-37 | `mUbF6TIhmYT47WcbzASR` | LL-37 2MG/ML (5ml) | Greenwich Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| NAD+ (Injectable) | `SHJpGAACUFEeMONdpEbn` | NAD+ 50mg/ml | St Luke | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| NAD+ Anti-Aging Protocol (Topical) | `WcuHmnM1fVgeRx7JiJf2` | METHYLENE BLUE ANTI-AGING (30 ML) | Optimal Balance Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'METHYLENE BLUE AN |
| Peptides – BPC-157 (Injectable) | `f8iFGqOGRXlFbjSiyVU1` | BPC-157 500 MCG | Optimal Balance Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'BPC-157 500 MCG'  |
| Peptides – CJC-1295/Ipamorelin (Injectable) | `HbIjEpVpCqiM5t1qsBHc` | CJC-1295/ IPAMORELIN 2 MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'CJC-1295/ IPAMORE |
| Peptides – CJC-1295/Ipamorelin (Oral) | `kMfakgh2pcbUw6cdN1OL` | CJC-1295/ IPAMORELIN 2 MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'CJC-1295/ IPAMORE |
| Pinealon | `303OPy11nUVobkrWEQ3R` | Pinealon/PE22-28/Selank 2MG/2MG/ML (5ml) | Greenwich Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Pregnyl - HCG (Merck) | `1RKh7XAuwA2DM4fZ6exN` | HCG LYO (PREGNYL) 10,000 IU | Optimal Balance Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'HCG LYO (PREGNYL) |
| PT-141 (Bremelanotide) | `7a11W067k20AKLSsL2xM` | PT-141 (Bremelanotide) 1mg | St Luke | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Semaglutide Sublingual Drops | `l7KNmFa7tttKlccmpGqO` | SUBLINGUAL SEMAGLUTIDE 10mg/4mL | Greenwich Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'SUBLINGUAL SEMAGL |
| Semaglutide/B12 | `NF825utCtjVqbbGsnQN3` | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Semaglutide/B12 (3 Months) | `vHuDA25F1vt2B2dTvp2F` | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) | Dirx-Hub | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'SEMAGLUTIDE + VIT |
| Semaglutide/B12 (6 Months) | `7p32vVgCU88CBPLVI84N` | SEMAGLUTIDE/B12 0.6 MG/ 500 MCG/ML (2 ML) | Optimal Balance Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'SEMAGLUTIDE/B12 0 |
| Semaglutide/B12/Glycine | `k06szhcZp65aHkcCC8DT` | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'SEMAGLUTIDE + GLY |
| Semaglutide/L-Carnitine | `Mqv2XnhxqzVB4M9164lZ` | SEMAGLUTIDE/L-CARNITINE (2ML) 2mg/100mg/ml | Vios | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Sermorelin | `FQKMJhnusoHm9m1O0wgS` | SERMORELIN ACETATE (TROCHE) 1 MG | Vios | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Sildenafil | `aPAtIOI60gL39ESErrUR` | SILDENAFIL 100 mg | VitaScripts Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| SS-31 (Elamipretide) Mitochondrial Protection Protocol | `YWzXqs8KGRlhRHx6jHKc` | ELAMIPRETIDE (SS-31) 15 MG/ML (5 ML) | Optimal Balance Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'ELAMIPRETIDE (SS- |
| Tadalafil | `28jSrdfoFaTOwsdbnhOD` | TADALAFIL 10 mg | VitaScripts Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Tadalafil+Sildenafil | `4gFN4PmvWILkmbX3XJ87` | SILDENAFIL/ TADALAFIL 50 MG/ 10 MG | Optimal Balance Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| TB-500 Recovery Protocol | `Mld6DVZWa0X3dYxRdhai` | TB-500 3MG/ML (5ml) | Greenwich Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'TB-500 3MG/ML (5m |
| Tesamorelin/Ipamorelin | `qMhf4cGNtrnNbBd5tHbD` | Tesamorelin/Ipamorelin 3mg/2mg/mL (5ml) | Greenwich Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Thymosin A-1 | `qgn9vCpD8bBN5pXNPKE5` | Thymosin A-1 5mg/mL (5ml) | Greenwich Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Thymosin Alpha-1 Immune Support Protocol | `HsVceU1fVfQmIBRVTNPR` | THYMOSIN ALPHA-1 3 MG/ML (5 ML) | Optimal Balance Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'THYMOSIN ALPHA-1  |
| Tirzepatide | `9iUIrANb8j2XW3rNregB` | TIRZEPATIDE 0.5mg 30 count | Valiant | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Tirzepatide Sublingual Drops | `97LWq6CIZYvHO3jGKb5N` | SUBLINGUAL TIRZEPATIDE 10mg/4mL | Greenwich Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'SUBLINGUAL TIRZEP |
| Tirzepatide/B12/Glycine | `iWGB1hvWlU5AzzLsfuEj` | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'TIRZEPATIDE + GLY |
| Tirzepatide/Glycine/B12 | `fvEsD7VkIu1c6EGu5slC` | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'TIRZEPATIDE + GLY |
| Tirzepatide/L-Carnitine | `IKkLXq2GCbG1NwDSJwL4` | TIRZEPATIDE/L-CARNITINE (1ML) 10mg/100mg/ml | Vios | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Tirzepatide/Niacinamide | `RN7GYRnWVmFz8o26pEcD` | TIRZEPATIDE/NIACINAMIDE (68MG/8MG/4ML) 17mg/2mg/ml | Vios | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Topiramate+Bupropion+Yohimbine | `YRuOnlfY8zqhSDElCYh3` | Bella Lipo (Bupropion HCl/Caffeine/Oxytocin/Topiramate/Naltrexone HCl/Methylcobalamin) 65mg/20mg/100IU/15mg/8mg/1mg | St Luke | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'Bella Lipo (Bupro |
| Trimix T106 (Papaverine +Phentolamine +PGE) | `nKniwgJIqwyBvDQgxLpW` | SB4 TRIMIX PGE, Papaverine, Phentolamine  40mcg/30mg/3mg 2.5ml | Valiant | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'SB4 TRIMIX PGE, P |
| Vardenafil | `tnEy0RPo2Nzma5TYjTgS` | VARDENAFIL 20 MG | Optimal Balance Pharmacy | False | GEN product exists; no view=formulary link yet; workbook has high-confidence proposed formulary; rev |
| Vardenafil+Tadalafil+Apormorphine | `ABFmjDGL2geOrA9iNcI2` | Tadalafil 5mg/Vardenafil HCl 5mg/Vit D3 2000IU/Vit K2 1mg (GUM) | Epiq Scripts | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'Tadalafil 5mg/Var |
| Wolverine – BPC-157 + TB-500 Recovery Protocol | `omhh3NabouO8AsNR5tkD` | BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml) | Greenwich Pharmacy | False | Workbook AUTO MATCH - REVIEW; GEN product exists without formulary link; proposed 'BPC-157/TB-500/GH |

---

## CREATE_NEW (0)

_None._

---

## FUTURE_CREATE_HIDDEN (0)

_None._

---

## MERGE_CANDIDATE (10)

| Product | GEN productId | Proposed formulary | Pharmacy | Live SF | Reason |
|---|---|---|---|---|---|
| BPC-157 (Copy 1) | `KXMm9SsbOEYnFy9phmZn` |  |  | True | Duplicate/copy master row — merge into primary GEN product; primary candidate `BPC-157` (KXMm9SsbOEY |
| BPC-157 + KPV + TB-500 Anti-Inflammatory Recovery Protocol | `Kju2P3fGsc0mbI1UGVeF` |  |  | False | Marketing/protocol parent overlaps compound family bpc-157; short primary candidates=['BPC-157', 'BP |
| BPC-157 Gut & Recovery Protocol (Oral Capsules) | `afROXeaudxZUdh0Y1Qfc` |  |  | False | Marketing/protocol parent overlaps compound family bpc-157; short primary candidates=['BPC-157', 'BP |
| BPC-157 Recovery Protocol (Oral Capsule) | `NTN40APqv0NQokAGmuyg` |  |  | False | Marketing/protocol parent overlaps compound family bpc-157; short primary candidates=['BPC-157', 'BP |
| DSIP + BPC-157 + CJC-1295 Sleep & Recovery Protocol | `DshqOc7J1SI03I365DnR` |  |  | False | Marketing/protocol parent overlaps compound family bpc-157; short primary candidates=['BPC-157', 'BP |
| GHK-Cu + Epitalon Anti-Aging Protocol | `qQKHHjPkPzs5D35Wgh2x` |  |  | False | Marketing/protocol parent overlaps compound family ghk-cu; short primary candidates=['GHK-Cu', 'GHK- |
| GHK-Cu Anti-Aging & Skin Health Protocol (Injectable) | `2CVlt0n5ITgHB1cYxoNY` |  |  | False | Marketing/protocol parent overlaps compound family ghk-cu; short primary candidates=['GHK-Cu', 'GHK- |
| Hair Loss – GHK-Cu Peptide Scalp Protocol | `DTrcxHRUH1xB7ssj0K2P` |  |  | False | Marketing/protocol parent overlaps compound family ghk-cu; short primary candidates=['GHK-Cu', 'GHK- |
| Weight Loss Support – AOD-9604 / MOTS-C Metabolic Peptide Protocol | `b4HNekUWbQUvnyfJcQoU` |  |  | False | Marketing/protocol parent overlaps compound family aod-9604; short primary candidates=['AOD-9604', ' |
| Weight Loss Support – AOD-9604 Fat-Burning Peptide Protocol | `RggWfvhVVeUMDJDiHuDV` |  |  | False | Marketing/protocol parent overlaps compound family aod-9604; short primary candidates=['AOD-9604', ' |

---

## DEACTIVATE_CANDIDATE (0)

_None._

---

## REVIEW_REQUIRED (185)

See `docs/GEN_CATALOG_NORMALIZATION_REPORT.md` for every REVIEW row with exact reason + owner decision.

### Live-website REVIEW subset

| Product | productId | Reason | Owner decision |
|---|---|---|---|
| GLP-1 Weight Loss – Semaglutide (High Dose) | `uM0cXePP8e9c5hiMKcRt` | Semaglutide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do no | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss – Semaglutide (Low Dose) | `7UMqZumyeXaWMX9zOPP3` | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation fam | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | `MkDIUw0NcJB7YL2pNzYW` | Semaglutide Any Dose parent exists in GEN; workbook NO SAFE MATCH; addonFamily=B12; must pair only to matching formulation family (do not mi | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Membership – Semaglutide / Glycine (Any Dose) | `wQK2JsFnh7oFBf3Lag4n` | Semaglutide Any Dose parent exists in GEN; workbook NO SAFE MATCH; addonFamily=Glycine; must pair only to matching formulation family (do no | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / B12 (High Dose) | `34I2X8MpVZf3AQTff3bo` | Semaglutide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=B12; must pair only to matching formulation family (do not mix B1 | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / B12 (Starting Dose) | `TL7ikswK0XoNvUvHC1iz` | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=B12; must pair only to matching formulation family (do  | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (High Dose) | `sssEk3FDY4LFbQYGQsLx` | Semaglutide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=Glycine; must pair only to matching formulation family (do not mi | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (Mid Dose) | `CjqOUbPuGPZzxephqRou` | Semaglutide Mid parent exists in GEN; workbook NO SAFE MATCH; addonFamily=Glycine; must pair only to matching formulation family (do not mix | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (Starting Dose) | `tk2GW39OGr7JX4MCCoJP` | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=Glycine; must pair only to matching formulation family  | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide + B12 (Starting Dose / Micro-Dose) | `SkqQHmsc0WdsbK9vmV1y` | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=B12; must pair only to matching formulation family (do  | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | `sN2ggSXRJINjElMYTQjf` | Semaglutide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |

---

## DO_NOT_ADD (0)

_None._

---

## Stop for owner review

| Gate | Status |
|---|---|
| GEN PRODUCTS CREATED | **0** |
| GEN PRODUCTS UPDATED | **0** |
| GEN PRODUCTS DEACTIVATED | **0** |
| GEN MODIFIED | **NO** |
| PRODUCTION WEBSITE MODIFIED | **NO** |
| GEN/WHOP CUTOVER | **OFF** |
