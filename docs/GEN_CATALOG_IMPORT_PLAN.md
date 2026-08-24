# GEN Catalog Import Plan (GEN-CATALOG-1)

**Mode:** READ-ONLY — no POST / PATCH / DELETE
**Branch:** `cursor/gen-catalog-1-import-plan-945c`
**Generated:** 2026-08-24T04:33:10Z
**Workbook:** `MyBareMethod_FINAL_GEN_Smart_Product_Upload_2026-08-23.xlsx`
**Production website modified:** NO
**GEN modified:** NO
**GEN/Whop cutover:** OFF

Machine-readable twin: `docs/GEN_CATALOG_IMPORT_PLAN.json` (full 253 rows).

---

## Totals

| Classification | Count |
|---|---:|
| **TOTAL MASTER PRODUCTS** | **253** |
| EXISTING EXACT | 0 |
| EXISTING NEEDS UPDATE | 30 |
| CREATE NEW | 0 |
| FUTURE CREATE HIDDEN | 0 |
| REVIEW REQUIRED | 223 |
| DO NOT ADD | 0 |

**Metformin:** DO_NOT_ADD — Owner rule; Metformin rows excluded from this workbook (READ ME).
**Live GEN still contains:** `Metformin (Metabolic / Weight Support)`, `Metformin / Topiramate` — do not website-activate/pair; no deactivate mutation this phase.

**Semaglutide structure:** **REVIEW**
- SELECTED FORMULARY has Dirx-Hub Semaglutide vial ladder (+Glycine/+B12).
- All LIVE WEBSITE Semaglutide parent products exist in GEN but workbook Match Status = NO SAFE MATCH → REVIEW before pairing.
- Do not create one customer-facing GEN product per vial; preserve Starting/Low/Mid/High/Any Dose/3-Month parents.
- Live GEN formulary view currently links 22 Semaglutide formulary medication(s).

**Tirzepatide structure:** **REVIEW**
- SELECTED FORMULARY has Tirzepatide rows (SELECTED).
- No LIVE WEBSITE Tirzepatide parent products in Smart Upload LIVE WEBSITE set (0).
- Several FUTURE Tirzepatide plans exist in GEN with storefrontEligible=true — must keep/force hidden until owner launch approval.
- Do not map Elite Body Recomp as Tirzepatide substitute.

---

## Phase 1 — Schema audit (unchanged + formulary view)

| Question | Answer |
|---|---|
| GEN_CREATE_PRODUCT_ENDPOINT | SUPPORTED (request body schema UNKNOWN) |
| GEN_UPDATE_PRODUCT_ENDPOINT | SUPPORTED (request body schema UNKNOWN) |
| MULTI_FORMULARY_PRODUCT | UNKNOWN |
| DRAFT_HIDDEN_PRODUCT | SUPPORTED (storefrontEligible=false) |
| FORMULARY_PAIRING_IN_CREATE_PATCH | UNKNOWN |
| FORMULARY_VIEW | SUPPORTED — GET /v2/client/products?view=formulary returns data.formularyProducts[] with standardizedMedicationName + pharmacyName + medicationId linked by productId |

---

## Phase 3 — Current GEN inventory (LIVE)

LIVE staging read 2026-08-24T04:33:10Z: GET /v2/client/products?limit=500 → 254 products; GET /v2/client/products?limit=500&view=formulary → 29 formularyProducts covering 18 distinct productIds. storefrontEligible true/false mix present. Secret GEN_HEALTH_API_KEY updated_at=2026-08-24T04:27:59.256Z.

| Metric | Value |
|---|---|
| Products (`?limit=500`) | 254 |
| Formulary links (`?view=formulary`) | 29 |
| Distinct productIds with formulary | 18 |
| GEN products not in workbook | 2 (Metformin*) |
| Workbook rows missing from GEN | 1 (`BPC-157 (Copy 1)`) |

### Live formulary pairings (29)

| GEN productId | Standardized medication | Pharmacy |
|---|---|---|
| `CjqOUbPuGPZzxephqRou` GLP-1 Weight Loss Plan – Semaglutide / G | Semaglutide + Glycine | Dirx-Hub |
| `CjqOUbPuGPZzxephqRou` GLP-1 Weight Loss Plan – Semaglutide / G | Semaglutide + Glycine | Dirx-Hub |
| `sssEk3FDY4LFbQYGQsLx` GLP-1 Weight Loss Plan – Semaglutide / G | Semaglutide + Glycine | Dirx-Hub |
| `tk2GW39OGr7JX4MCCoJP` GLP-1 Weight Loss Plan – Semaglutide / G | Semaglutide + Glycine | Dirx-Hub |
| `wQK2JsFnh7oFBf3Lag4n` GLP-1 Weight Loss Membership – Semagluti | Semaglutide + Glycine | Dirx-Hub |
| `wQK2JsFnh7oFBf3Lag4n` GLP-1 Weight Loss Membership – Semagluti | Semaglutide + Glycine | Dirx-Hub |
| `wQK2JsFnh7oFBf3Lag4n` GLP-1 Weight Loss Membership – Semagluti | Semaglutide + Glycine | Dirx-Hub |
| `wQK2JsFnh7oFBf3Lag4n` GLP-1 Weight Loss Membership – Semagluti | Semaglutide + Glycine | Dirx-Hub |
| `34I2X8MpVZf3AQTff3bo` GLP-1 Weight Loss Plan – Semaglutide / B | Semaglutide + Vitamin B12 | Dirx-Hub |
| `SkqQHmsc0WdsbK9vmV1y` GLP-1 Weight Loss Plan – Semaglutide + B | Semaglutide + Vitamin B12 | Dirx-Hub |
| `TL7ikswK0XoNvUvHC1iz` GLP-1 Weight Loss Plan – Semaglutide / B | Semaglutide + Vitamin B12 | Dirx-Hub |
| `uM0cXePP8e9c5hiMKcRt` GLP-1 Weight Loss – Semaglutide (High Do | Semaglutide + Vitamin B12 | Dirx-Hub |
| `MkDIUw0NcJB7YL2pNzYW` GLP-1 Weight Loss Membership – Semagluti | Semaglutide B12 ( , , ) | Dirx-Hub |
| `MkDIUw0NcJB7YL2pNzYW` GLP-1 Weight Loss Membership – Semagluti | Semaglutide B12 ( , , ) | Dirx-Hub |
| `MkDIUw0NcJB7YL2pNzYW` GLP-1 Weight Loss Membership – Semagluti | Semaglutide B12 ( , , ) | Dirx-Hub |
| `sN2ggSXRJINjElMYTQjf` GLP-1 Weight Loss Plan – Semaglutide 3-M | Semaglutide B12 ( , , ) | Dirx-Hub |
| `7UMqZumyeXaWMX9zOPP3` GLP-1 Weight Loss – Semaglutide (Low Dos | Semaglutide / Pyridoxine | Epiq Scripts |
| `MXsSZY2GpiCByJUQer1p` BPC-157 + GHK-Cu + KPV + TB-500 Comprehe | BPC-157 / GHK-CU / KPV / TB500 | Greenwich Pharmacy |
| `iJtyig611AZEDBGdvRd9` BPC-157/TB500 | BPC-157 / TB500 | Greenwich Pharmacy |
| `489YrehNXRlL77fYPkOn` GHK-Cu | GHK-CU | Greenwich Pharmacy |
| `MkDIUw0NcJB7YL2pNzYW` GLP-1 Weight Loss Membership – Semagluti | Semaglutide + B12 | Greenwich Pharmacy |
| `MkDIUw0NcJB7YL2pNzYW` GLP-1 Weight Loss Membership – Semagluti | Semaglutide + B12 | Greenwich Pharmacy |
| `MkDIUw0NcJB7YL2pNzYW` GLP-1 Weight Loss Membership – Semagluti | Semaglutide + B12 | Greenwich Pharmacy |
| `MkDIUw0NcJB7YL2pNzYW` GLP-1 Weight Loss Membership – Semagluti | Semaglutide + B12 | Greenwich Pharmacy |
| `MkDIUw0NcJB7YL2pNzYW` GLP-1 Weight Loss Membership – Semagluti | Semaglutide + B12 | Greenwich Pharmacy |
| `7Kix55LA15U0lNvY9QXI` AOD-9604/MOTS-C | AOD 9604 | Optimal Balance Pharmacy |
| `PRIG7DYPNNgco3lGf1zx` AOD-9604 | AOD 9604 | Optimal Balance Pharmacy |
| `yearpPaLo5H0k0FU5Ej8` AOD-9604 / MOTS-C / Tesamorelin Metaboli | AOD 9604 / MOTS-C / Tesamorelin / Ipamorelin | Optimal Balance Pharmacy |
| `KXMm9SsbOEYnFy9phmZn` BPC-157 | BPC-157 | Optimal Balance Pharmacy |

---

## EXISTING_NEEDS_UPDATE (30)

Exact proposed formulary from workbook. Live `view=formulary` often returns base standardizedMedicationName without strength/package — treat as needs verify/update.

| Master product | GEN productId | Match | Proposed formulary | Pharmacy | Landed | Storefront intent | Live SF |
|---|---|---|---|---|---:|---|---|
| AOD-9604 | `PRIG7DYPNNgco3lGf1zx` | HIGH CONFIDENCE MATCH | AOD 9604 300 MCG | Optimal Balance Pharmacy | 21.75 | website_live_candidate | True |
| AOD-9604/MOTS-C | `7Kix55LA15U0lNvY9QXI` | HIGH CONFIDENCE MATCH | AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/ 2MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | 122 | website_live_candidate | False |
| BPC-157 | `KXMm9SsbOEYnFy9phmZn` | HIGH CONFIDENCE MATCH | BPC-157 500 MCG | Optimal Balance Pharmacy | 21.8 | website_live_candidate | True |
| BPC-157/GHK/TB500 | `lkpQbjBhhWMeLUszAvbh` | HIGH CONFIDENCE MATCH | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL (5ml) | Greenwich Pharmacy | 102 | hidden | False |
| BPC-157/KPV/TB500 | `26RwCZyLvfqRYRY7AG6T` | HIGH CONFIDENCE MATCH | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL (5ml) | Greenwich Pharmacy | 102 | hidden | False |
| BPC-157/TB500 | `iJtyig611AZEDBGdvRd9` | HIGH CONFIDENCE MATCH | BPC-157/TB500 capsules 500MCG/500MCG | Greenwich Pharmacy | 28.2 | website_live_candidate | True |
| DSIP | `vqAq9bWAfFatzbOKQekn` | HIGH CONFIDENCE MATCH | DSIP 1mg/mL (5ml) | Greenwich Pharmacy | 87 | hidden | False |
| DSIP/BPC/CJC | `hBU7BtIyLLIKPGdOKLsu` | HIGH CONFIDENCE MATCH | DSIP/BPC/CJC 1mg/2mg/2mg (5ml) | Greenwich Pharmacy | 102 | hidden | False |
| Epithalon | `ouWm9Tmk22yFes5EsHKD` | HIGH CONFIDENCE MATCH | Epithalon 2mg/mL (5ml) | Greenwich Pharmacy | 87 | hidden | False |
| Finasteride | `LA7Q6gQEPmnpkduoVnqa` | HIGH CONFIDENCE MATCH | FINASTERIDE 1 mg | VitaScripts Pharmacy | 15.5 | hidden | False |
| GHK-Cu | `489YrehNXRlL77fYPkOn` | HIGH CONFIDENCE MATCH | Minoxidil 2.5mg/GHK-Cu 5mg/Apigenin 50mg/Fisetin 50mg | Epiq Scripts | 38.75 | website_live_candidate | True |
| GHK-Cu/Epithalon | `Yq6xdybfGS55O4kUDVI8` | HIGH CONFIDENCE MATCH | GHK-CU/ EPITHALON 10 MG/ 2 MG/ML (5 ML) | Optimal Balance Pharmacy | 102 | hidden | False |
| Ivermectin 18mg | `7QK64NwcsDkuCoYPaBtt` | HIGH CONFIDENCE MATCH | Ivermectin 18mg | St Luke | 32 | hidden | False |
| LL-37 | `mUbF6TIhmYT47WcbzASR` | HIGH CONFIDENCE MATCH | LL-37 2MG/ML (5ml) | Greenwich Pharmacy | 87 | hidden | False |
| Liraglutide | `zN79C8bQeKWGSLDVCqTX` | HIGH CONFIDENCE MATCH | LIRAGLUTIDE 6mg 5ml | Valiant | 130 | hidden | False |
| NAD+ (Injectable) | `SHJpGAACUFEeMONdpEbn` | HIGH CONFIDENCE MATCH | NAD+ 50mg/ml | St Luke | 60 | hidden | False |
| PT-141 (Bremelanotide) | `7a11W067k20AKLSsL2xM` | HIGH CONFIDENCE MATCH | PT-141 (Bremelanotide) 1mg | St Luke | 33 | hidden | False |
| Pinealon | `303OPy11nUVobkrWEQ3R` | HIGH CONFIDENCE MATCH | Pinealon/PE22-28/Selank 2MG/2MG/ML (5ml) | Greenwich Pharmacy | 102 | hidden | False |
| Semaglutide/B12 | `NF825utCtjVqbbGsnQN3` | HIGH CONFIDENCE MATCH | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 55 | hidden | False |
| Semaglutide/L-Carnitine | `Mqv2XnhxqzVB4M9164lZ` | HIGH CONFIDENCE MATCH | SEMAGLUTIDE/L-CARNITINE (2ML) 2mg/100mg/ml | Vios | 80 | hidden | False |
| Sermorelin | `FQKMJhnusoHm9m1O0wgS` | HIGH CONFIDENCE MATCH | SERMORELIN ACETATE (TROCHE) 1 MG | Vios | 30.85 | hidden | False |
| Sildenafil | `aPAtIOI60gL39ESErrUR` | HIGH CONFIDENCE MATCH | SILDENAFIL 100 mg | VitaScripts Pharmacy | 15.5 | hidden | False |
| Tadalafil | `28jSrdfoFaTOwsdbnhOD` | HIGH CONFIDENCE MATCH | TADALAFIL 10 mg | VitaScripts Pharmacy | 15.5 | hidden | False |
| Tadalafil+Sildenafil | `4gFN4PmvWILkmbX3XJ87` | HIGH CONFIDENCE MATCH | SILDENAFIL/ TADALAFIL 50 MG/ 10 MG | Optimal Balance Pharmacy | 21.56 | hidden | False |
| Tesamorelin/Ipamorelin | `qMhf4cGNtrnNbBd5tHbD` | HIGH CONFIDENCE MATCH | Tesamorelin/Ipamorelin 3mg/2mg/mL (5ml) | Greenwich Pharmacy | 102 | hidden | False |
| Thymosin A-1 | `qgn9vCpD8bBN5pXNPKE5` | HIGH CONFIDENCE MATCH | Thymosin A-1 5mg/mL (5ml) | Greenwich Pharmacy | 107 | hidden | False |
| Tirzepatide | `9iUIrANb8j2XW3rNregB` | HIGH CONFIDENCE MATCH | TIRZEPATIDE 0.5mg 30 count | Valiant | 65 | hidden | False |
| Tirzepatide/L-Carnitine | `IKkLXq2GCbG1NwDSJwL4` | HIGH CONFIDENCE MATCH | TIRZEPATIDE/L-CARNITINE (1ML) 10mg/100mg/ml | Vios | 100 | hidden | False |
| Tirzepatide/Niacinamide | `RN7GYRnWVmFz8o26pEcD` | HIGH CONFIDENCE MATCH | TIRZEPATIDE/NIACINAMIDE (68MG/8MG/4ML) 17mg/2mg/ml | Vios | 210 | hidden | False |
| Vardenafil | `tnEy0RPo2Nzma5TYjTgS` | HIGH CONFIDENCE MATCH | VARDENAFIL 20 MG | Optimal Balance Pharmacy | 23.95 | hidden | False |

---

## FUTURE_CREATE_HIDDEN

**0** — Future workbook products already exist in live GEN (234/235). Do **not** recreate. Keep `storefrontEligible=false`, no production routing, `checkout_enabled=false` until owner launch approval. High-confidence future rows are classified under EXISTING_NEEDS_UPDATE with action **KEEP HIDDEN + UPDATE PAIRING**.

---

## CREATE_NEW

**0** — every LIVE WEBSITE Smart Upload product already has an exact-name GEN client product.

---

## REVIEW_REQUIRED highlights

Total REVIEW_REQUIRED: **223** (full list in JSON).

### Live website parents (must review before pair)

| Master product | GEN productId | Match | Reason |
|---|---|---|---|
| AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol | `yearpPaLo5H0k0FU5Ej8` | AUTO MATCH - REVIEW | live formulary ['AOD 9604 / MOTS-C / Tesamorelin / Ipamorelin'] != proposed 'AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1 |
| BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | `MXsSZY2GpiCByJUQer1p` | AUTO MATCH - REVIEW | live formulary ['BPC-157 / GHK-CU / KPV / TB500'] != proposed 'BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml)' (view=formulary  |
| GLP-1 Weight Loss – Semaglutide (High Dose) | `uM0cXePP8e9c5hiMKcRt` | NO SAFE MATCH | live formulary ['Semaglutide + Vitamin B12'] != proposed None (view=formulary returns standardizedMedicationName only; s |
| GLP-1 Weight Loss – Semaglutide (Low Dose) | `7UMqZumyeXaWMX9zOPP3` | NO SAFE MATCH | live formulary ['Semaglutide / Pyridoxine'] != proposed None (view=formulary returns standardizedMedicationName only; st |
| GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | `MkDIUw0NcJB7YL2pNzYW` | NO SAFE MATCH | live formulary ['Semaglutide B12 ( , , )', 'Semaglutide B12 ( , , )', 'Semaglutide B12 ( , , )', 'Semaglutide + B12', 'S |
| GLP-1 Weight Loss Membership – Semaglutide / Glycine (Any Dose) | `wQK2JsFnh7oFBf3Lag4n` | NO SAFE MATCH | live formulary ['Semaglutide + Glycine', 'Semaglutide + Glycine', 'Semaglutide + Glycine', 'Semaglutide + Glycine'] != p |
| GLP-1 Weight Loss Plan – Semaglutide / B12 (High Dose) | `34I2X8MpVZf3AQTff3bo` | NO SAFE MATCH | live formulary ['Semaglutide + Vitamin B12'] != proposed None (view=formulary returns standardizedMedicationName only; s |
| GLP-1 Weight Loss Plan – Semaglutide / B12 (Starting Dose) | `TL7ikswK0XoNvUvHC1iz` | NO SAFE MATCH | live formulary ['Semaglutide + Vitamin B12'] != proposed None (view=formulary returns standardizedMedicationName only; s |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (High Dose) | `sssEk3FDY4LFbQYGQsLx` | NO SAFE MATCH | live formulary ['Semaglutide + Glycine'] != proposed None (view=formulary returns standardizedMedicationName only; stren |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (Mid Dose) | `CjqOUbPuGPZzxephqRou` | NO SAFE MATCH | live formulary ['Semaglutide + Glycine', 'Semaglutide + Glycine'] != proposed None (view=formulary returns standardizedM |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (Starting Dose) | `tk2GW39OGr7JX4MCCoJP` | NO SAFE MATCH | live formulary ['Semaglutide + Glycine'] != proposed None (view=formulary returns standardizedMedicationName only; stren |
| GLP-1 Weight Loss Plan – Semaglutide + B12 (Starting Dose / Micro-Dose) | `SkqQHmsc0WdsbK9vmV1y` | NO SAFE MATCH | live formulary ['Semaglutide + Vitamin B12'] != proposed None (view=formulary returns standardizedMedicationName only; s |
| GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | `sN2ggSXRJINjElMYTQjf` | NO SAFE MATCH | live formulary ['Semaglutide B12 ( , , )'] != proposed None (view=formulary returns standardizedMedicationName only; str |

### Safety / storefront guards

| Master product | Issue |
|---|---|
| 5-Amino Injectable | Injectable product paired to capsule formulary — REVIEW form mismatch; missing formulary pairing in GEN; reviewBeforeApply=VERIFY FORM/STRENGTH/PACKAGE |
| Elite Regenesis | Workbook Match Status = NO SAFE MATCH; Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; workbook mat |
| GLP-1 Weight Loss Plan – Semaglutide + Ondansetron (Nausea Support) | Workbook Match Status = NO SAFE MATCH; Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; workbook mat |
| GLP-2 Weight Loss Plan – Tirzepatide (High Dose / Maintenance) | Workbook Match Status = NO SAFE MATCH; Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; workbook mat |
| GLP-2 Weight Loss Plan – Tirzepatide (Low Dose) | Workbook Match Status = NO SAFE MATCH; Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; workbook mat |
| GLP-2 Weight Loss Plan – Tirzepatide (Mid Dose) | Workbook Match Status = NO SAFE MATCH; Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; workbook mat |
| GLP-2 Weight Loss Plan – Tirzepatide (Starting Dose / Micro-Dose) | Workbook Match Status = NO SAFE MATCH; Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; workbook mat |
| GLP-2 Weight Loss Plan – Tirzepatide + Ondansetron (Nausea Support) | Workbook Match Status = NO SAFE MATCH; Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; workbook mat |
| MOTS-C | Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; reviewBeforeApply=VERIFY FORM/STRENGTH/PACKAGE; FUT |
| NAD + Nasal Spray | Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; reviewBeforeApply=VERIFY FORM/STRENGTH/PACKAGE; FUT |
| Pinealon / PE-22-28 / Selank Neuro-Sleep Protocol | Workbook Match Status = NO SAFE MATCH; Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; workbook mat |
| PT-141 (Bremelanotide) Sexual Desire Protocol (Nasal Spray) | Workbook Match Status = AUTO MATCH - REVIEW; Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; workbo |
| Retatrutide | Workbook Match Status = NO SAFE MATCH; Future product is currently storefrontEligible=true in GEN — force REVIEW; missing formulary pairing in GEN; workbook mat |
| Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone | Proposed formulary is Scream Cream but product name is Sildenafil — do not silently substitute; Workbook Match Status = AUTO MATCH - REVIEW; Future product is c |
| Sildenafil (3 Month) | Proposed formulary is Scream Cream but product name is Sildenafil — do not silently substitute; missing formulary pairing in GEN; reviewBeforeApply=VERIFY FORM/ |
| Sildenafil (6 Month) | Proposed formulary is Scream Cream but product name is Sildenafil — do not silently substitute; missing formulary pairing in GEN; reviewBeforeApply=VERIFY FORM/ |

---

## Phase 5 — Proposed exact formulary pairings (owner apply later)

For each EXISTING_NEEDS_UPDATE / FUTURE high-confidence row, proposed pairing fields are:

- `proposedFormularyName`, `pharmacy`, `strength`, `form`, `package`
- Internal cost fields: `medicationCost`, `pharmacyShippingInternal`, `landedCost` (customer Rx shipping remains $0 / included)
- Live links from `view=formulary` when present (`medicationId`, `pharmacyId`, `standardizedMedicationName`)

**Do not bulk-apply** unresolved/ambiguous rows. Match and Preview in GEN Smart Upload first.

---

## Stop for owner review

| Gate | Status |
|---|---|
| PRODUCTS CREATED | **0** |
| PRODUCTS UPDATED | **0** |
| PRODUCTS DEACTIVATED | **0** |
| GEN MODIFIED | **NO** |
| Website / production cutover | **OFF / untouched** |

Awaiting owner approval before any GEN write operations.
