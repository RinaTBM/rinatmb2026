# GEN Catalog Import Plan (GEN-CATALOG-1)

**Mode:** READ-ONLY — no POST / PATCH / DELETE  
**Branch:** `cursor/gen-catalog-1-import-plan-945c`  
**Generated:** 2026-08-24T03:45:00Z  
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
| EXISTING NEEDS UPDATE | 13 |
| CREATE NEW | 0 |
| FUTURE CREATE HIDDEN | 23 |
| REVIEW REQUIRED | 217 |
| DO NOT ADD | 0 |

**Metformin:** DO_NOT_ADD — Owner rule; Metformin rows excluded from this workbook (READ ME).

**Semaglutide structure:** **REVIEW**  
- SELECTED FORMULARY has Dirx-Hub Semaglutide +Glycine/+B12 vial ladder (SELECTED).
- Live website GLP-1 Semaglutide parent products are NO SAFE MATCH → REVIEW before pairing.
- Do not create one customer-facing GEN product per vial; preserve Starting/Low/Mid/High/Any Dose/3-Month parents.

**Tirzepatide structure:** **REVIEW**  
- SELECTED FORMULARY has Tirzepatide rows (SELECTED).
- No LIVE WEBSITE Tirzepatide parent products safely matched in Smart Upload.
- Workbook row Tirzepatide→0.5mg 30 count flagged REVIEW (not injectable dose-family parent).
- Do not map Elite Body Recomp as Tirzepatide substitute.

---

## Phase 1 — Schema audit (unchanged)

| Question | Answer |
|---|---|
| GEN CREATE PRODUCT ENDPOINT | **SUPPORTED** (request body schema UNKNOWN) |
| GEN UPDATE PRODUCT ENDPOINT | **SUPPORTED** (request body schema UNKNOWN) |
| MULTI-FORMULARY PRODUCT | **UNKNOWN** |
| DRAFT/HIDDEN PRODUCT | **SUPPORTED** (`storefrontEligible=false`) |
| FORMULARY PAIRING IN CREATE/PATCH | **UNKNOWN** |

Live GEN Products GET on 2026-08-24 returned **401 Invalid API key**; inventory below uses prior cached staging list (22 products).

---

## Phase 2 — Current GEN inventory (cached 22)

All 22 cached GEN client products appear in the master Smart Upload sheet by exact name. None are `EXISTING_EXACT` — each either needs pairing update or is `REVIEW_REQUIRED` (NO SAFE MATCH).

---

## EXISTING_NEEDS_UPDATE (13)

| Master product | GEN productId | Match | Proposed formulary | Pharmacy | Landed | Storefront |
|---|---|---|---|---|---:|---|
| AOD-9604 | `PRIG7DYPNNgco3lGf1zx` | HIGH CONFIDENCE MATCH | AOD 9604 300 MCG | Optimal Balance Pharmacy | 21.75 | hidden |
| AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol | `yearpPaLo5H0k0FU5Ej8` | AUTO MATCH - REVIEW | AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/ 2MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | 122.0 | website_live_candidate |
| AOD-9604/MOTS-C | `7Kix55LA15U0lNvY9QXI` | HIGH CONFIDENCE MATCH | AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/ 2MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | 122.0 | hidden |
| BPC-157 | `KXMm9SsbOEYnFy9phmZn` | HIGH CONFIDENCE MATCH | BPC-157 500 MCG | Optimal Balance Pharmacy | 21.8 | website_live_candidate |
| BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | `MXsSZY2GpiCByJUQer1p` | AUTO MATCH - REVIEW | BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml) | Greenwich Pharmacy | 102.0 | website_live_candidate |
| BPC-157 + TB-500 + GHK-Cu Recovery & Anti-Aging Protocol | `kAekLzXT2Wl2MDSBxjls` | AUTO MATCH - REVIEW | BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml) | Greenwich Pharmacy | 102.0 | hidden |
| BPC-157 Recovery Protocol (Injectable) | `TQBv1oBNGfwIGY8ypl86` | AUTO MATCH - REVIEW | BPC-157 500 MCG | Optimal Balance Pharmacy | 21.8 | hidden |
| BPC-157/GHK-U/KPV/TB500 | `zpQmWLDx6QxyDz5N8IaI` | AUTO MATCH - REVIEW | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL (5ml) | Greenwich Pharmacy | 102.0 | hidden |
| BPC-157/GHK/TB500 | `lkpQbjBhhWMeLUszAvbh` | HIGH CONFIDENCE MATCH | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL (5ml) | Greenwich Pharmacy | 102.0 | hidden |
| BPC-157/KPV/TB500 | `26RwCZyLvfqRYRY7AG6T` | HIGH CONFIDENCE MATCH | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL (5ml) | Greenwich Pharmacy | 102.0 | hidden |
| BPC-157/TB500 | `iJtyig611AZEDBGdvRd9` | HIGH CONFIDENCE MATCH | BPC-157/TB500 capsules 500MCG/500MCG | Greenwich Pharmacy | 28.2 | website_live_candidate |
| GHK-Cu | `489YrehNXRlL77fYPkOn` | HIGH CONFIDENCE MATCH | Minoxidil 2.5mg/GHK-Cu 5mg/Apigenin 50mg/Fisetin 50mg | Epiq Scripts | 38.75 | hidden |
| GHK-Cu/Epithalon | `Yq6xdybfGS55O4kUDVI8` | HIGH CONFIDENCE MATCH | GHK-CU/ EPITHALON 10 MG/ 2 MG/ML (5 ML) | Optimal Balance Pharmacy | 102.0 | hidden |

---

## FUTURE_CREATE_HIDDEN (23)

Prepare in GEN only: `storefrontEligible=false`, not active on MyBareMethod.com, `checkout_enabled=false`, no production routing.

| Master product | Proposed formulary | Pharmacy | Cost | Ship | Landed |
|---|---|---|---:|---:|---:|
| DSIP | DSIP 1mg/mL (5ml) | Greenwich Pharmacy | 62.0 | 25.0 | 87.0 |
| DSIP/BPC/CJC | DSIP/BPC/CJC 1mg/2mg/2mg (5ml) | Greenwich Pharmacy | 77.0 | 25.0 | 102.0 |
| Epithalon | Epithalon 2mg/mL (5ml) | Greenwich Pharmacy | 62.0 | 25.0 | 87.0 |
| Finasteride | FINASTERIDE 1 mg | VitaScripts Pharmacy | 0.5 | 15.0 | 15.5 |
| Ivermectin 18mg | Ivermectin 18mg | St Luke | 2.0 | 30.0 | 32.0 |
| Liraglutide | LIRAGLUTIDE 6mg 5ml | Valiant | 100.0 | 30.0 | 130.0 |
| LL-37 | LL-37 2MG/ML (5ml) | Greenwich Pharmacy | 62.0 | 25.0 | 87.0 |
| MOTS-C | MOTS-C 2mg/mL (5ml) | Greenwich Pharmacy | 62.0 | 25.0 | 87.0 |
| NAD + Nasal Spray | NAD+ 50mg/ml | St Luke | 30.0 | 30.0 | 60.0 |
| NAD+ (Injectable) | NAD+ 50mg/ml | St Luke | 30.0 | 30.0 | 60.0 |
| Pinealon | Pinealon/PE22-28/Selank 2MG/2MG/ML (5ml) | Greenwich Pharmacy | 77.0 | 25.0 | 102.0 |
| PT-141 (Bremelanotide) | PT-141 (Bremelanotide) 1mg | St Luke | 3.0 | 30.0 | 33.0 |
| Semaglutide/B12 | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50.0 | 5.0 | 55.0 |
| Semaglutide/L-Carnitine | SEMAGLUTIDE/L-CARNITINE (2ML) 2mg/100mg/ml | Vios | 50.0 | 30.0 | 80.0 |
| Sermorelin | SERMORELIN ACETATE (TROCHE) 1 MG | Vios | 0.85 | 30.0 | 30.85 |
| Sildenafil | SILDENAFIL 100 mg | VitaScripts Pharmacy | 0.5 | 15.0 | 15.5 |
| Tadalafil | TADALAFIL 10 mg | VitaScripts Pharmacy | 0.5 | 15.0 | 15.5 |
| Tadalafil+Sildenafil | SILDENAFIL/ TADALAFIL 50 MG/ 10 MG | Optimal Balance Pharmacy | 1.56 | 20.0 | 21.56 |
| Tesamorelin/Ipamorelin | Tesamorelin/Ipamorelin 3mg/2mg/mL (5ml) | Greenwich Pharmacy | 77.0 | 25.0 | 102.0 |
| Thymosin A-1 | Thymosin A-1 5mg/mL (5ml) | Greenwich Pharmacy | 77.0 | 30.0 | 107.0 |
| Tirzepatide/L-Carnitine | TIRZEPATIDE/L-CARNITINE (1ML) 10mg/100mg/ml | Vios | 70.0 | 30.0 | 100.0 |
| Tirzepatide/Niacinamide | TIRZEPATIDE/NIACINAMIDE (68MG/8MG/4ML) 17mg/2mg/ml | Vios | 180.0 | 30.0 | 210.0 |
| Vardenafil | VARDENAFIL 20 MG | Optimal Balance Pharmacy | 3.95 | 20.0 | 23.95 |

---

## CREATE_NEW

**0** — no live-website Smart Upload row both lacked a GEN inventory name match and had HIGH CONFIDENCE MATCH. Live Semaglutide parent products are present but **NO SAFE MATCH** → REVIEW.

---

## REVIEW_REQUIRED highlights

**217** rows total. Notable subsets:

### Live website Semaglutide parents (NO SAFE MATCH)

- **GLP-1 Weight Loss – Semaglutide (High Dose)** — NO SAFE MATCH — do not create/update without exact verified pairing
- **GLP-1 Weight Loss – Semaglutide (Low Dose)** — NO SAFE MATCH — do not create/update without exact verified pairing
- **GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose)** — NO SAFE MATCH — do not create/update without exact verified pairing
- **GLP-1 Weight Loss Membership – Semaglutide / Glycine (Any Dose)** — NO SAFE MATCH — do not create/update without exact verified pairing
- **GLP-1 Weight Loss Plan – Semaglutide / B12 (High Dose)** — NO SAFE MATCH — do not create/update without exact verified pairing
- **GLP-1 Weight Loss Plan – Semaglutide / B12 (Starting Dose)** — NO SAFE MATCH — do not create/update without exact verified pairing
- **GLP-1 Weight Loss Plan – Semaglutide / Glycine (High Dose)** — NO SAFE MATCH — do not create/update without exact verified pairing
- **GLP-1 Weight Loss Plan – Semaglutide / Glycine (Mid Dose)** — NO SAFE MATCH — do not create/update without exact verified pairing
- **GLP-1 Weight Loss Plan – Semaglutide / Glycine (Starting Dose)** — NO SAFE MATCH — do not create/update without exact verified pairing
- **GLP-1 Weight Loss Plan – Semaglutide + B12 (Starting Dose / Micro-Dose)** — NO SAFE MATCH — do not create/update without exact verified pairing
- **GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg)** — NO SAFE MATCH — do not create/update without exact verified pairing

### Safety mismatch / form guards (examples)

- **5-Amino Injectable** — Injectable product paired to capsule formulary — REVIEW form mismatch
- **Sildenafil (3 Month)** — Proposed formulary is Scream Cream but product name is not Scream Cream — do not silently substitute
- **Sildenafil (6 Month)** — Proposed formulary is Scream Cream but product name is not Scream Cream — do not silently substitute

### Existing GEN products with NO SAFE MATCH (9)

- **Add Sync** (`t1JOySXRCJBAeXbkEXW4`)
- **BPC-157 + KPV + TB-500 Anti-Inflammatory Recovery Protocol** (`Kju2P3fGsc0mbI1UGVeF`)
- **BPC-157 Gut & Recovery Protocol (Oral Capsules)** (`afROXeaudxZUdh0Y1Qfc`)
- **BPC-157 Recovery Protocol (Oral Capsule)** (`NTN40APqv0NQokAGmuyg`)
- **Elite Body Recomp** (`Zd3nud61fajtnKM8EHae`)
- **Elite Regenesis** (`lT5iApLmX80qlBQTr4qE`)
- **Epitalon Longevity & Anti-Aging Protocol** (`gpwERWfomPpuJyY9oB8V`)
- **GHK-Cu + Epitalon Anti-Aging Protocol** (`qQKHHjPkPzs5D35Wgh2x`)
- **GHK-Cu Anti-Aging & Skin Health Protocol (Injectable)** (`2CVlt0n5ITgHB1cYxoNY`)

Full reasons for every REVIEW row: JSON `rows[].reasonForReview`.

---

## SELECTED FORMULARY — Semaglutide / Tirzepatide ladders

### Semaglutide (Dirx-Hub)

| Formulation | Strength | Med cost | Ship | Landed | +50% | Status | Customer ship |
|---|---|---:|---:|---:|---:|---|---|
| SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | 50 | 5 | 55 | None | SELECTED | $0 — included in medication retail |
| SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | 50 | 5 | 55 | None | SELECTED | $0 — included in medication retail |
| SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | 55 | 5 | 60 | None | SELECTED | $0 — included in medication retail |
| SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | 55 | 5 | 60 | None | SELECTED | $0 — included in medication retail |
| SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | 58 | 5 | 63 | None | SELECTED | $0 — included in medication retail |
| SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | 58 | 5 | 63 | None | SELECTED | $0 — included in medication retail |
| SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | 60 | 5 | 65 | None | SELECTED | $0 — included in medication retail |
| SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | 60 | 5 | 65 | None | SELECTED | $0 — included in medication retail |
| SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | 65 | 5 | 70 | None | SELECTED | $0 — included in medication retail |
| SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | 65 | 5 | 70 | None | SELECTED | $0 — included in medication retail |
| SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) | 10mg/0.5mg/mL | 50 | 30 | 80 | None | SELECTED | $0 — included in medication retail |

### Tirzepatide

| Formulation | Pharmacy | Strength | Med cost | Ship | Landed | Status |
|---|---|---|---:|---:|---:|---|
| TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 5mg/0.5mg/mL | 65 | 5 | 70 | SELECTED |
| TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 5mg/0.5mg/mL | 65 | 5 | 70 | SELECTED |
| TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 10mg/0.5mg/mL | 75 | 5 | 80 | SELECTED |
| TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 10mg/0.5mg/mL | 75 | 5 | 80 | SELECTED |
| TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 15mg/0.5mg/mL | 85 | 5 | 90 | SELECTED |
| TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 15mg/0.5mg/mL | 85 | 5 | 90 | SELECTED |
| TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 20mg/0.5mg/mL | 90 | 5 | 95 | SELECTED |
| TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 20mg/0.5mg/mL | 90 | 5 | 95 | SELECTED |
| TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 25mg/0.5mg/mL | 95 | 5 | 100 | SELECTED |
| TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 25mg/0.5mg/mL | 95 | 5 | 100 | SELECTED |
| TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 30mg/0.5mg/mL | 100 | 5 | 105 | SELECTED |
| TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 30mg/0.5mg/mL | 100 | 5 | 105 | SELECTED |
| TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) (3 PACK)) | Dirx-Hub | 30mg/0.5mg/mL | 225 | 30 | 255 | SELECTED |

---

## FUTURE ADDITIONS sheet (8)

| Product | Delivery | Pharmacy | Formulation | Landed | Website Active | GEN Action |
|---|---|---|---|---:|---|---|
| PT-141 (Bremelanotide) | Nasal Spray | Vios | BREMELANOTIDE (PT-141) (PER ML) 10 MG/ML | 92 | NO | PREP/PAIR IN GEN ONLY — DO NOT LAUNCH |
| PT-141 (Bremelanotide) | Nasal Spray | Vios | BREMELANOTIDE (PT-141) (PER ML) 5MG/ML | 92 | NO | PREP/PAIR IN GEN ONLY — DO NOT LAUNCH |
| Oxytocin | Nasal Spray | St Luke | Oxytocin 100 IU/ml | 75 | NO | PREP/PAIR IN GEN ONLY — DO NOT LAUNCH |
| Sexual Wellness Compound | Capsule | Epiq Scripts | 100mg Flibanserin, 100iu Oxytocin, 50mg Tyrosine | 191 | NO | PREP/PAIR IN GEN ONLY — DO NOT LAUNCH |
| Finasteride / Minoxidil | Topical | Vios | FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 % | 60 | NO | PREP/PAIR IN GEN ONLY — DO NOT LAUNCH |
| Finasteride / Minoxidil / Tretinoin | Topical | Vios | FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.25/5/0.01 % | 65 | NO | PREP/PAIR IN GEN ONLY — DO NOT LAUNCH |
| Bimatoprost | Solution | TBD | No matching Bimatoprost entry confirmed in supplied formulary | None | NO | PREP/PAIR IN GEN ONLY — DO NOT LAUNCH |
| Scream Cream | Topical Cream | TBD | No exact Scream Cream formulation confirmed in supplied formulary | None | NO | PREP/PAIR IN GEN ONLY — DO NOT LAUNCH |

---

## Owner rules (from workbook READ ME)

- Only CURRENT/LIVE MyBareMethod.com products may be website-active.
- Future products may be prepared in GEN but must stay OFF on the website.
- Medication shipping included in retail (customer med shipping $0).
- Accessories separate (USPS Priority).
- Metformin: DO NOT ADD.
- Never silently substitute compound/form/strength/package.
- Semaglutide/Tirzepatide dose-group products must pair to intended exact formulations.
- Match and Preview before Apply; do not bulk-apply unresolved rows.

---

## Execution gate

| Action | Count this phase |
|---|---:|
| PRODUCTS CREATED | 0 |
| PRODUCTS UPDATED | 0 |
| PRODUCTS DEACTIVATED | 0 |

**STOP FOR OWNER REVIEW.** Do not POST/PATCH until owner approves an execution phase and POST/PATCH body schemas are confirmed.
