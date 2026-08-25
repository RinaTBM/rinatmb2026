# GEN Final Cost Basis Review (GEN-CATALOG-1I)

**READ-ONLY — no GEN writes. Do not run GEN-CATALOG-2.**
**Generated:** 2026-08-24T07:19:01Z

Pricing formula **unchanged / locked**:
```
raw_retail = (at_cost × 1.75) + pharmacy_shipping
final_retail = nearest $X9 (equidistant → ROUND UP)
```

This phase resolves **cost basis** only. Website/GEN retail are not used to infer pharmacy cost. Cheapest formulary is never chosen merely to lower retail.

Source authority: workbook `SELECTED FORMULARY` + `GEN SMART UPLOAD` via blueprint pairings.

---

## Final gate

| Metric | Value |
|---|---|
| LIVE_PRODUCTS_TOTAL | 16 |
| LIVE_COMPLETE_COST_VERIFIED | 7 |
| LIVE_COST_BASIS_UNRESOLVED | 9 |
| MULTIPLE_COST_BASIS_BEFORE | 25 |
| MULTIPLE_COST_BASIS_RESOLVED | 4 |
| MULTIPLE_COST_BASIS_REMAINING | 21 |
| MISSING_COST_BEFORE | 57 |
| MISSING_COST_RESOLVED | 0 |
| MISSING_COST_REMAINING | 57 |
| AOD_9604_COST_BASIS | PACKAGE_QUANTITY_UNKNOWN (PER_UNIT $1.75; no course qty) |
| BPC_TB_CAPSULE_COST_BASIS | PACKAGE_QUANTITY_UNKNOWN (PER_CAPSULE $3.20 Package=1EA; capsule count unknown) |
| BPC_157_INJECTION_COST_BASIS | UNRESOLVED — plain BPC PER_UNIT $1.80 qty unknown; blend 5mL @ $77 are COMPLETE but different formulations (MULTIPLE_VALID_FORMULARIES) |
| SEM_3_MONTH_B12_COST_BASIS | PACKAGE_QUANTITY_UNKNOWN — name claims 3 vials but cost $50 < single 10mg vial $65 (inconsistent) |
| SEM_START_LOW_READY | NO — MULTIPLE_VALID_FORMULARIES (1mg & 2mg each VERIFIED per-vial; no single controlling retail) |
| SEM_MID_READY | YES — VERIFIED_COMPLETE_COST (4mg vial) for B12 and Glycine |
| SEM_HIGH_READY | NO — MULTIPLE_VALID_FORMULARIES (6mg & 10mg each VERIFIED per-vial) |
| SEM_ANY_DOSE_READY | YES — ANY_DOSE_MAX_COST_BASIS (10mg vial $65+$5 → $119) for B12 and Glycine |
| SEM_3_MONTH_READY | NO — B12 package cost inconsistent; Glycine 3-month MISSING |
| PRICING_FORMULA_CHANGED | NO |
| GEN_MODIFIED | NO |
| GEN_WRITES | 0 |
| WEBSITE_MODIFIED | NO |
| GEN_WHOP_CUTOVER | OFF |
| LIVE_WRITE_GATE | BLOCKED — not every LIVE_NOW medication has verified COMPLETE DISPENSE/PACKAGE cost basis |

**LIVE write gate: BLOCKED** until every LIVE_NOW medication has verified COMPLETE DISPENSE/PACKAGE cost.

---

## Critical anomaly findings

### AOD-9604 Injection
- Source: `AOD 9604 300 MCG` @ **$1.75** + $20 ship (Package empty)
- Unit: **PER_UNIT** (dose), not complete course
- Status: **PACKAGE_QUANTITY_UNKNOWN**
- Cannot approve $19 formula retail as complete-package pricing

### BPC-157 / TB-500 Capsules
- Source: `BPC-157/TB500 capsules 500MCG/500MCG` @ **$3.20** Package=**1EA** + $25
- Unit: **PER_CAPSULE**
- Capsule count for course: **not in master**
- Status: **PACKAGE_QUANTITY_UNKNOWN**

### SEM 3-Month B12
- Formulary name: `...10MG... (3 VIALS))` @ **$50** + $30 ship, Package still `1mL`
- Single Dirx-Hub 10mg vial cost in SELECTED: **$65**
- $50 for 3 vials < 1 vial → **inconsistent / incomplete package cost**
- Status: **PACKAGE_QUANTITY_UNKNOWN** (will not invent 3×$65 without owner override of stated $50)

### BPC-157 Injection
- Plain `BPC-157 500 MCG` @ **$1.80** → PER_UNIT, qty unknown
- Greenwich blends `5mL` @ **$77** → COMPLETE_PACKAGE but **different formulations** (TB-500/GHK/KPV)
- Status: **MULTIPLE_VALID_FORMULARIES** + plain **PACKAGE_QUANTITY_UNKNOWN**

---

## SEM / TIR tier resolution

| Tier | B12 | Glycine | Notes |
|---|---|---|---|
| Starting/Low | MULTIPLE_VALID (1mg $50, 2mg $55) | same | each PER_VIAL verified; no single CP retail |
| Mid | VERIFIED 4mg $58+$5 → **$109** | same → **$109** | READY |
| High | MULTIPLE_VALID (6mg $60, 10mg $65) | same | each PER_VIAL verified |
| Any Dose | ANY_DOSE_MAX = 10mg $65+$5 → **$119** | same → **$119** | READY (max cost basis) |
| 3-Month | PACKAGE_QUANTITY_UNKNOWN | MISSING_SOURCE_COST | NOT READY |

Tirzepatide follows the same pattern (Any Dose → max verified vial; Start/Mid/High multi-strength → MULTIPLE_VALID_FORMULARIES unless single strength).

---

## Review rows (affected products)

| PRODUCT | FORMULATION | PHARMACY | FORMULARY ROW | SOURCE COST | UNIT | QTY | COMPLETE COST | SHIP | RAW | FINAL $X9 | STATUS | EVIDENCE |
|---|---|---|---|---:|---|---|---:|---:|---:|---:|---|---|
| AOD-9604 / MOTS-C / Tesamorelin Injection | AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/ 2MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | AOD-9604 / MOTS-C / Tesamorelin Metaboli | 102.0 | COMPLETE_PACKAGE | 5 mL | 102.0 | 20.0 | 198.5 | 199 | **VERIFIED_COMPLETE_COST** | Single verified complete cost basis; unit=COMPLETE_PACKAGE; package=5 mL. |
| AOD-9604 Injection | AOD 9604 300 MCG | Optimal Balance Pharmacy | AOD-9604 | 1.75 | PER_UNIT | — | — | 20.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Source cost $1.75 for 'AOD 9604 300 MCG' with empty Package. Looks like PER_UNIT/per-dose, not complete dispense. No quantity in master t... |
| BPC-157 / TB-500 Capsules | BPC-157/TB500 capsules 500MCG/500MCG | Greenwich Pharmacy | BPC-157/TB500 | 3.2 | PER_CAPSULE | — | — | 25.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | SELECTED/SMART cost $3.20 Package=1EA for BPC-157/TB500 capsules 500MCG/500MCG. Unit = PER_CAPSULE. Capsule count for month/course NOT in... |
| BPC-157 Injection | BPC-157 500 MCG | Optimal Balance Pharmacy | BPC-157 | 1.8 | PER_UNIT | — | — | 20.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Plain BPC-157 500 MCG @ $1.8 + ship — PER_UNIT/dose; Package empty. Not a verified complete dispense for BPC-157 Injection. |
| BPC-157 Injection | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL | Greenwich Pharmacy | [SELECTED] BPC-157 / TB-500 — BPC-157/GH | 77.0 | COMPLETE_PACKAGE | 1 × 5mL vial | 77.0 | 25.0 | 159.75 | 159 | **MULTIPLE_VALID_FORMULARIES** | Greenwich 5mL blend vial @ $77.0 is a COMPLETE package cost, but formulation is NOT plain BPC-157 (contains TB-500/GHK/KPV variants). Val... |
| BPC-157 Injection | BPC-157/KPV/TB500 3mg/3mg/3mg/mL | Greenwich Pharmacy | [SELECTED] BPC-157 / TB-500 — BPC-157/KP | 77.0 | COMPLETE_PACKAGE | 1 × 5mL vial | 77.0 | 25.0 | 159.75 | 159 | **MULTIPLE_VALID_FORMULARIES** | Greenwich 5mL blend vial @ $77.0 is a COMPLETE package cost, but formulation is NOT plain BPC-157 (contains TB-500/GHK/KPV variants). Val... |
| BPC-157 Injection | BPC-157/TB-500/GHK-CU 3/3/10MG/ML | Greenwich Pharmacy | [SELECTED] BPC-157 / TB-500 — BPC-157/TB | 77.0 | COMPLETE_PACKAGE | 1 × 5mL vial | 77.0 | 25.0 | 159.75 | 159 | **MULTIPLE_VALID_FORMULARIES** | Greenwich 5mL blend vial @ $77.0 is a COMPLETE package cost, but formulation is NOT plain BPC-157 (contains TB-500/GHK/KPV variants). Val... |
| BPC-157 Injection | BPC-157/TB500 3mg/3mg/mL | Greenwich Pharmacy | [SELECTED] BPC-157 / TB-500 — BPC-157/TB | 77.0 | COMPLETE_PACKAGE | 1 × 5mL vial | 77.0 | 25.0 | 159.75 | 159 | **MULTIPLE_VALID_FORMULARIES** | Greenwich 5mL blend vial @ $77.0 is a COMPLETE package cost, but formulation is NOT plain BPC-157 (contains TB-500/GHK/KPV variants). Val... |
| BPC-157 — Unspecified | BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml) | Greenwich Pharmacy | BPC-157 + GHK-Cu + KPV + TB-500 Comprehe | 77.0 | COMPLETE_PACKAGE | 5ML | 77.0 | 25.0 | 159.75 | 159 | **VERIFIED_COMPLETE_COST** | Single verified complete cost basis; unit=COMPLETE_PACKAGE; package=5ML. |
| GHK-Cu / Minoxidil Topical Combo | Minoxidil 2.5mg/GHK-Cu 5mg/Apigenin 50mg/Fisetin 50mg | Epiq Scripts | GHK-Cu | 36.75 | OTHER | 30 | 36.75 | 2.0 | 66.3125 | 69 | **VERIFIED_COMPLETE_COST** | Single verified complete cost basis; unit=OTHER; package=30. |
| Semaglutide Injection — 3-Month (B12) | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + VITAMIN B12 10M | 50.0 | 3_MONTH_PACKAGE_CLAIMED | 3 vials claimed in formulary name | — | 30.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Formulary name claims '(3 VIALS))' but Medication Cost=$50 with Package still '1mL'. Single Dirx-Hub SEM+B12 10mg vial cost in SELECTED i... |
| Semaglutide Injection — 3-Month (Glycine) | — | — | — | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No formulary pairings in blueprint (empty Glycine 3-Month collapsed in 1D). NO_EXACT_FORMULARY for Glycine 3-month package. |
| Semaglutide Injection — Any Dose (B12) | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + VITAMIN B12 10M | 65.0 | PER_VIAL | 1 × 1mL vial | 65.0 | 5.0 | 118.75 | 119 | **ANY_DOSE_MAX_COST_BASIS** | CONTROLLING Any Dose retail basis (highest verified vial cost). Package 1mL — complete single-vial dispense for this strength. Additive=B12. |
| Semaglutide Injection — Any Dose (B12) | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + VITAMIN B12 1MG | 50.0 | PER_VIAL | 1 × 1mL vial | 50.0 | 5.0 | 92.5 | 89 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 1mL — complete single-vial dispense for this strength. Additive=B12. |
| Semaglutide Injection — Any Dose (B12) | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + VITAMIN B12 2MG | 55.0 | PER_VIAL | 1 × 1mL vial | 55.0 | 5.0 | 101.25 | 99 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 1mL — complete single-vial dispense for this strength. Additive=B12. |
| Semaglutide Injection — Any Dose (B12) | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + VITAMIN B12 4MG | 58.0 | PER_VIAL | 1 × 1mL vial | 58.0 | 5.0 | 106.5 | 109 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 1mL — complete single-vial dispense for this strength. Additive=B12. |
| Semaglutide Injection — Any Dose (B12) | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + VITAMIN B12 6MG | 60.0 | PER_VIAL | 1 × 1mL vial | 60.0 | 5.0 | 110.0 | 109 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 1mL — complete single-vial dispense for this strength. Additive=B12. |
| Semaglutide Injection — Any Dose (Glycine) | SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + GLYCINE 10MG/0. | 65.0 | PER_VIAL | 1 × 1mL vial | 65.0 | 5.0 | 118.75 | 119 | **ANY_DOSE_MAX_COST_BASIS** | CONTROLLING Any Dose retail basis (highest verified vial cost). Package 1mL — complete single-vial dispense for this strength. Additive=G... |
| Semaglutide Injection — Any Dose (Glycine) | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + GLYCINE 1MG/0.5 | 50.0 | PER_VIAL | 1 × 1mL vial | 50.0 | 5.0 | 92.5 | 89 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 1mL — complete single-vial dispense for this strength. Additive=Glycine. |
| Semaglutide Injection — Any Dose (Glycine) | SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + GLYCINE 2MG/0.5 | 55.0 | PER_VIAL | 1 × 1mL vial | 55.0 | 5.0 | 101.25 | 99 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 1mL — complete single-vial dispense for this strength. Additive=Glycine. |
| Semaglutide Injection — Any Dose (Glycine) | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + GLYCINE 4MG/0.5 | 58.0 | PER_VIAL | 1 × 1mL vial | 58.0 | 5.0 | 106.5 | 109 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 1mL — complete single-vial dispense for this strength. Additive=Glycine. |
| Semaglutide Injection — Any Dose (Glycine) | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + GLYCINE 6MG/0.5 | 60.0 | PER_VIAL | 1 × 1mL vial | 60.0 | 5.0 | 110.0 | 109 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 1mL — complete single-vial dispense for this strength. Additive=Glycine. |
| Semaglutide Injection — High (B12) | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + VITAMIN B12 10M | 65.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 65.0 | 5.0 | 118.75 | 119 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for High tier (B12). Tier CP spans multiple strengths; each strength is a valid complete dispense. No sil... |
| Semaglutide Injection — High (B12) | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + VITAMIN B12 6MG | 60.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 60.0 | 5.0 | 110.0 | 109 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for High tier (B12). Tier CP spans multiple strengths; each strength is a valid complete dispense. No sil... |
| Semaglutide Injection — High (Glycine) | SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + GLYCINE 10MG/0. | 65.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 65.0 | 5.0 | 118.75 | 119 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for High tier (Glycine). Tier CP spans multiple strengths; each strength is a valid complete dispense. No... |
| Semaglutide Injection — High (Glycine) | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + GLYCINE 6MG/0.5 | 60.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 60.0 | 5.0 | 110.0 | 109 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for High tier (Glycine). Tier CP spans multiple strengths; each strength is a valid complete dispense. No... |
| Semaglutide Injection — Mid (B12) | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + VITAMIN B12 4MG | 58.0 | PER_VIAL | 1 × vial (complete dispense for Mid tier) | 58.0 | 5.0 | 106.5 | 109 | **VERIFIED_COMPLETE_COST** | Single Mid-tier vial strength with Package=1mL. Complete vial cost. Additive=B12. |
| Semaglutide Injection — Mid (Glycine) | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + GLYCINE 4MG/0.5 | 58.0 | PER_VIAL | 1 × vial (complete dispense for Mid tier) | 58.0 | 5.0 | 106.5 | 109 | **VERIFIED_COMPLETE_COST** | Single Mid-tier vial strength with Package=1mL. Complete vial cost. Additive=Glycine. |
| Semaglutide Injection — Starting / Low (B12) | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + VITAMIN B12 1MG | 50.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 50.0 | 5.0 | 92.5 | 89 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for Starting/Low tier (B12). Tier CP spans multiple strengths; each strength is a valid complete dispense... |
| Semaglutide Injection — Starting / Low (B12) | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + VITAMIN B12 2MG | 55.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 55.0 | 5.0 | 101.25 | 99 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for Starting/Low tier (B12). Tier CP spans multiple strengths; each strength is a valid complete dispense... |
| Semaglutide Injection — Starting / Low (Glycine) | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + GLYCINE 1MG/0.5 | 50.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 50.0 | 5.0 | 92.5 | 89 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for Starting/Low tier (Glycine). Tier CP spans multiple strengths; each strength is a valid complete disp... |
| Semaglutide Injection — Starting / Low (Glycine) | SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | [SELECTED] SEMAGLUTIDE + GLYCINE 2MG/0.5 | 55.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 55.0 | 5.0 | 101.25 | 99 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for Starting/Low tier (Glycine). Tier CP spans multiple strengths; each strength is a valid complete disp... |
| Accelerate & Thrive | — | — | Accelerate & Thrive | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ['Accelerate & Thrive', 'ARA-290 Neuroprotection & Nerve... |
| BPC-157 — Unspecified | — | — | BPC-157 + KPV + TB-500 Anti-Inflammatory | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ['BPC-157 + KPV + TB-500 Anti-Inflammatory Recovery Prot... |
| Dihexa — Unspecified | Dihexa capsules 5mg | Greenwich Pharmacy | [SELECTED] Dihexa — Dihexa capsules 5mg | 2.6 | PER_CAPSULE | — | — | 25.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_CAPSULE, package=1EA. Complete dispense quantity not evidenced. Part of multi-basis set (2 distinct cost/ship). |
| Dihexa — Unspecified | Dihexa/Tesofensine capsules 5mg/500mcg | Greenwich Pharmacy | [SELECTED] Dihexa — Dihexa/Tesofensine c | 3.2 | PER_CAPSULE | — | — | 25.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_CAPSULE, package=1EA. Complete dispense quantity not evidenced. Part of multi-basis set (2 distinct cost/ship). |
| Estradiol / HRT — Vaginal Cream | ESTRADIOL 0.5MG TABLET 0.5MG | Optimal Balance Pharmacy | [SELECTED] Estradiol — ESTRADIOL 0.5MG T | 0.48 | PER_UNIT | — | — | 20.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_UNIT, package=None. Complete dispense quantity not evidenced. Part of multi-basis set (13 distinct cost/ship). |
| Estradiol / HRT — Vaginal Cream | ESTRADIOL 1 MG TABLET 1 MG | Optimal Balance Pharmacy | [SELECTED] Estradiol — ESTRADIOL 1 MG TA | 0.48 | PER_UNIT | — | — | 20.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_UNIT, package=None. Complete dispense quantity not evidenced. Part of multi-basis set (13 distinct cost/ship). |
| Estradiol / HRT — Vaginal Cream | ESTRADIOL 2 MG TABLET 2 MG | Optimal Balance Pharmacy | [SELECTED] Estradiol — ESTRADIOL 2 MG TA | 0.48 | PER_UNIT | — | — | 20.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_UNIT, package=None. Complete dispense quantity not evidenced. Part of multi-basis set (13 distinct cost/ship). |
| Estradiol / HRT — Vaginal Cream | ESTRADIOL CYPIONATE (MCT OIL) 10 MG/ML | Vios | [SELECTED] Estradiol — ESTRADIOL CYPIONA | 32.0 | OTHER | 3ml mg/ml | — | 30.0 | — | — | **MULTIPLE_VALID_FORMULARIES** | Unit=OTHER; cannot confirm complete dispense uniquely among multi bases. |
| Estradiol / HRT — Vaginal Cream | ESTRADIOL TRANSDERMAL PATCH 0.025mg/hr 8 count | Valiant | [SELECTED] Estradiol — ESTRADIOL TRANSDE | 50.0 | COMPLETE_DISPENSE | 1 package | 50.0 | 30.0 | 117.5 | 119 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($50.0) but CP has 13 distinct cost bases — no silent choice. |
| Estradiol / HRT — Vaginal Cream | ESTRADIOL TRANSDERMAL PATCH 0.0375mg/hr 8 count | Valiant | [SELECTED] Estradiol — ESTRADIOL TRANSDE | 55.0 | COMPLETE_DISPENSE | 1 package | 55.0 | 30.0 | 126.25 | 129 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($55.0) but CP has 13 distinct cost bases — no silent choice. |
| Estradiol / HRT — Vaginal Cream | ESTRADIOL TRANSDERMAL PATCH 0.05mg/hr 8 count | Valiant | [SELECTED] Estradiol — ESTRADIOL TRANSDE | 60.0 | COMPLETE_DISPENSE | 1 package | 60.0 | 30.0 | 135.0 | 139 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($60.0) but CP has 13 distinct cost bases — no silent choice. |
| Estradiol / HRT — Vaginal Cream | ESTRADIOL TRANSDERMAL PATCH 0.1mg/hr 8 count | Valiant | [SELECTED] Estradiol — ESTRADIOL TRANSDE | 70.0 | COMPLETE_DISPENSE | 1 package | 70.0 | 30.0 | 152.5 | 149 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($70.0) but CP has 13 distinct cost bases — no silent choice. |
| Estradiol / HRT — Vaginal Cream | HRT Cream - 1 Ingredient (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) | St Luke | [SELECTED] Estradiol — HRT Cream - 1 Ing | 25.0 | COMPLETE_PACKAGE | 30gm | 25.0 | 30.0 | 73.75 | 69 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($25.0) but CP has 13 distinct cost bases — no silent choice. |
| Estradiol / HRT — Vaginal Cream | HRT Cream - 2 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) | St Luke | [SELECTED] Estradiol — HRT Cream - 2 Ing | 28.0 | COMPLETE_PACKAGE | 30gm | 28.0 | 30.0 | 79.0 | 79 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($28.0) but CP has 13 distinct cost bases — no silent choice. |
| Estradiol / HRT — Vaginal Cream | HRT Cream - 3 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) | St Luke | [SELECTED] Estradiol — HRT Cream - 3 Ing | 35.0 | COMPLETE_PACKAGE | 30gm | 35.0 | 30.0 | 91.25 | 89 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($35.0) but CP has 13 distinct cost bases — no silent choice. |
| Estradiol / HRT — Vaginal Cream | HRT Cream - 4 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) | St Luke | [SELECTED] Estradiol — HRT Cream - 4 Ing | 40.0 | COMPLETE_PACKAGE | 30gm | 40.0 | 30.0 | 100.0 | 99 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($40.0) but CP has 13 distinct cost bases — no silent choice. |
| Estradiol / HRT — Vaginal Cream | Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 1 Ingredient | St Luke | [SELECTED] Estradiol — Hormone Troche (E | 1.0 | PER_UNIT | — | — | 30.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_UNIT, package=Each. Complete dispense quantity not evidenced. Part of multi-basis set (13 distinct cost/ship). |
| Estradiol / HRT — Vaginal Cream | Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 2 Ingredients | St Luke | [SELECTED] Estradiol — Hormone Troche (E | 1.5 | PER_UNIT | — | — | 30.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_UNIT, package=Each. Complete dispense quantity not evidenced. Part of multi-basis set (13 distinct cost/ship). |
| Estradiol / HRT — Vaginal Cream | Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 3 Ingredients | St Luke | [SELECTED] Estradiol — Hormone Troche (E | 2.0 | PER_UNIT | — | — | 30.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_UNIT, package=Each. Complete dispense quantity not evidenced. Part of multi-basis set (13 distinct cost/ship). |
| Finasteride / Hair — Capsule | — | — | Hair Loss – Finasteride (Oral) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Hair Loss – Finasteride (Oral)'] |
| Finasteride / Hair — Topical | — | — | Hair Loss – Finasteride (Topical) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Hair Loss – Finasteride (Topical)'] |
| GHK-Cu Injection | — | — | GHK-Cu Anti-Aging & Skin Health Protocol | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GHK-Cu Anti-Aging & Skin Health Protocol (Injectable)'] |
| GHK-Cu — Unspecified | — | — | Hair Loss – GHK-Cu Peptide Scalp Protoco | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ['Hair Loss – GHK-Cu Peptide Scalp Protocol'] |
| Glutathione — Capsule | — | — | Wellness – Glutathione (Oral) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Wellness – Glutathione (Oral)'] |
| Glutathione — Topical | — | — | Wellness – Glutathione (Topical) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Wellness – Glutathione (Topical)'] |
| HRT Other — Capsule | — | — | MK-677 (Ibutamoren) Oral Growth Hormone  | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['MK-677 (Ibutamoren) Oral Growth Hormone Protocol'] |
| HRT Other — Unspecified | — | — | Hormone + Intimacy | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ['Hormone + Intimacy', 'Kisspeptin-10 Reproductive Hormo... |
| Hair Loss – Dutasteride (Oral) | — | — | Hair Loss – Dutasteride (Oral) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Hair Loss – Dutasteride (Oral)'] |
| IGF-1 LR3 — Unspecified | — | — | IGF-1 LR3 Growth Factor Protocol | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ['IGF-1 LR3 Growth Factor Protocol'] |
| Ivermectin — Capsule | — | — | Anti-Infective – Ivermectin (Oral) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Anti-Infective – Ivermectin (Oral)', 'Anti-Infective... |
| Ivermectin — Topical | — | — | Anti-Infective – Ivermectin (Topical) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Anti-Infective – Ivermectin (Topical)', 'Anti-Infect... |
| Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan | — | — | Lean & Ready – Semaglutide + BPC-157 + A | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan'] |
| MOTS-C Injection | MOTS-C 2mg/mL | Greenwich Pharmacy | [SELECTED] MOTS-c — MOTS-C 2mg/mL | 62.0 | COMPLETE_PACKAGE | 5ML | 62.0 | 25.0 | 133.5 | 129 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($62.0) but CP has 2 distinct cost bases — no silent choice. |
| MOTS-C Injection | MOTS-C 2mg/mL (5ml) | Greenwich Pharmacy | MOTS-C | 62.0 | COMPLETE_PACKAGE | 5ML | 62.0 | 25.0 | 133.5 | 129 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($62.0) but CP has 2 distinct cost bases — no silent choice. |
| MOTS-C Injection | MOTS-C/Tesamorelin 2mg/3mg/mL | Greenwich Pharmacy | [SELECTED] MOTS-c — MOTS-C/Tesamorelin 2 | 79.0 | COMPLETE_PACKAGE | 5ml | 79.0 | 25.0 | 163.25 | 159 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($79.0) but CP has 2 distinct cost bases — no silent choice. |
| Minoxidil / Hair — Capsule | — | — | Hair Loss – Minoxidil (Oral) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Hair Loss – Minoxidil (Oral)'] |
| Minoxidil / Hair — Unspecified | — | — | Hair Loss – Dual Combo (Finasteride/Mino | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ['Hair Loss – Dual Combo (Finasteride/Minoxidil)'] |
| NAD+ — Topical | — | — | Wellness – NAD+ (Topical) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Wellness – NAD+ (Topical)'] |
| Orforglipron (Oral) — Any Dose | — | — | Oral GLP-1 Weight Loss Plan – Orforglipr | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Oral GLP-1 Weight Loss Plan – Orforglipron (Any Dose)'] |
| Orforglipron (Oral) — High | — | — | Oral GLP-1 Weight Loss Plan – Orforglipr | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Oral GLP-1 Weight Loss Plan – Orforglipron (High Dos... |
| Orforglipron (Oral) — Mid | — | — | Oral GLP-1 Weight Loss Plan – Orforglipr | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Oral GLP-1 Weight Loss Plan – Orforglipron (Mid Dose... |
| Orforglipron (Oral) — Starting / Low | — | — | Oral GLP-1 Weight Loss Plan – Orforglipr | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Oral GLP-1 Weight Loss Plan – Orforglipron (Starting... |
| Oxytocin — Nasal Spray | — | — | Women's Sexual Health – Intimacy (Oxytoc | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ["Women's Sexual Health – Intimacy (Oxytocin) Nasal Sp... |
| Oxytocin — Unspecified | — | — | Women's Sexual Health – Intimacy (Oxytoc | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ["Women's Sexual Health – Intimacy (Oxytocin)"] |
| Ozempic (Semaglutide) | — | — | Ozempic (Semaglutide) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Ozempic (Semaglutide)'] |
| PT-141 (Bremelanotide) Nasal Spray | BREMELANOTIDE (PT-141) (PER ML) 10 MG/ML | Vios | [SELECTED] PT-141 — BREMELANOTIDE (PT-14 | 62.0 | PER_ML | — | — | 30.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_ML, package=1 ml. Complete dispense quantity not evidenced. Part of multi-basis set (2 distinct cost/ship). |
| PT-141 (Bremelanotide) Nasal Spray | BREMELANOTIDE (PT-141) (PER ML) 5MG/ML | Vios | [SELECTED] PT-141 — BREMELANOTIDE (PT-14 | 62.0 | PER_ML | — | — | 30.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_ML, package=1 ml. Complete dispense quantity not evidenced. Part of multi-basis set (2 distinct cost/ship). |
| PT-141 (Bremelanotide) Nasal Spray | PT-141 (Bremelanotide) 1mg | St Luke | PT-141 (Bremelanotide) | 3.0 | PER_CAPSULE | — | — | 30.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_CAPSULE, package=Each. Complete dispense quantity not evidenced. Part of multi-basis set (2 distinct cost/ship). |
| Pinealon — Unspecified | — | — | Pinealon Neuroprotective & Anti-Aging Pr | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ['Pinealon Neuroprotective & Anti-Aging Protocol'] |
| Progesterone / HRT — Cream | — | — | Women's Hormones (HRT) – BiEst / Progest | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ["Women's Hormones (HRT) – BiEst / Progesterone / Test... |
| Progesterone / HRT — Unspecified | — | — | Women's Hormones (HRT) – Progesterone | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ["Women's Hormones (HRT) – Progesterone", "Women's Hormo... |
| Retatrutide — Unspecified | — | — | Retatrutide | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ['Retatrutide'] |
| Scream Cream | — | — | Women's Sexual Health – Arousal (Scream  | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ["Women's Sexual Health – Arousal (Scream Cream)"] |
| Selank — Unspecified | — | — | Pinealon / PE-22-28 / Selank Neuro-Sleep | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ['Pinealon / PE-22-28 / Selank Neuro-Sleep Protocol', 'S... |
| Semaglutide + Ondansetron (Nausea Support) | — | — | GLP-1 Weight Loss Plan – Semaglutide + O | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide + Ondansetron (... |
| Semaglutide Injection — Any Dose (L-Carnitine) | — | — | GLP-1 Weight Loss Membership – Semagluti | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Membership – Semaglutide / L-Carni... |
| Semaglutide Injection — High (L-Carnitine) | — | — | GLP-1 Weight Loss Plan – Semaglutide / L | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide / L-Carnitine (... |
| Semaglutide Injection — Mid (L-Carnitine) | — | — | GLP-1 Weight Loss Plan – Semaglutide / L | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide / L-Carnitine (... |
| Semaglutide Oral / Sublingual — High | — | — | GLP-1 Weight Loss Plan – Sublingual Sema | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Sublingual Semaglutide Oral... |
| Semaglutide Oral / Sublingual — Mid | — | — | GLP-1 Weight Loss Plan – Sublingual Sema | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Sublingual Semaglutide Oral... |
| Semaglutide Oral / Sublingual — Starting / Low | — | — | GLP-1 Weight Loss – Semaglutide (Oral Dr | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss – Semaglutide (Oral Drops)', 'GLP-... |
| Semaglutide Weight Loss Plan – Semaglutide (Any Dose) | — | — | GLP-1 Weight Loss Plan – Semaglutide (An | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide (Any Dose)'] |
| Semaglutide Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply | — | — | GLP-1 Weight Loss Plan – Semaglutide (An | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide (Any Dose) – 3 ... |
| Semaglutide Weight Loss Plan – Semaglutide (High Dose / Maintenance) | — | — | GLP-1 Weight Loss Plan – Semaglutide (Hi | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide (High Dose / Ma... |
| Semaglutide Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply | — | — | GLP-1 Weight Loss Plan – Semaglutide (Hi | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide (High Dose) – 3... |
| Semaglutide Weight Loss Plan – Semaglutide (Low Dose) | — | — | GLP-1 Weight Loss Plan – Semaglutide (Lo | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide (Low Dose)'] |
| Semaglutide Weight Loss Plan – Semaglutide (Mid Dose) | — | — | GLP-1 Weight Loss Plan – Semaglutide (Mi | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide (Mid Dose)'] |
| Semaglutide Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply | — | — | GLP-1 Weight Loss Plan – Semaglutide (Mi | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide (Mid Dose) – 3 ... |
| Semaglutide Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply | — | — | GLP-1 Weight Loss Plan – Semaglutide (St | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide (Starting Dose)... |
| Semaglutide Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Low: 1→2→4mg) | — | — | GLP-1 Weight Loss Plan – Semaglutide 3-M | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalat... |
| Sermorelin — Injection | — | — | Peptides – Sermorelin (Injectable) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Peptides – Sermorelin (Injectable)', 'Sermorelin Gro... |
| Sermorelin — Troche | — | — | Peptides – Sermorelin (Oral / Troche) | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['Peptides – Sermorelin (Oral / Troche)', 'Sermorelin ... |
| Sildenafil — Unspecified | SILDENAFIL 100 mg | VitaScripts Pharmacy | Sildenafil | 0.5 | PER_UNIT | — | — | 15.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_UNIT, package=None. Complete dispense quantity not evidenced. Part of multi-basis set (2 distinct cost/ship). |
| Sildenafil — Unspecified | SILDENAFIL/ TADALAFIL 50 MG/ 10 MG | Optimal Balance Pharmacy | Tadalafil+Sildenafil | 1.56 | PER_UNIT | — | — | 20.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_UNIT, package=None. Complete dispense quantity not evidenced. Part of multi-basis set (2 distinct cost/ship). |
| TB-500 / Blends — Unspecified | — | — | Thymosin Beta-4 (TB-500) Tissue Repair P | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ['Thymosin Beta-4 (TB-500) Tissue Repair Protocol'] |
| Tadalafil — Unspecified | TADALAFIL 10 mg | VitaScripts Pharmacy | Tadalafil | 0.5 | PER_UNIT | — | — | 15.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_UNIT, package=None. Complete dispense quantity not evidenced. Part of multi-basis set (2 distinct cost/ship). |
| Tadalafil — Unspecified | Tadalafil 5mg/Vardenafil HCl 5mg/Vit D3 2000IU/Vit K2 1mg (GUM) | Epiq Scripts | Vardenafil+Tadalafil+Apormorphine | 26.25 | OTHER | 30 | — | 2.0 | — | — | **MULTIPLE_VALID_FORMULARIES** | Unit=OTHER; cannot confirm complete dispense uniquely among multi bases. |
| Tesamorelin / Ipamorelin Injection | CJC-1295/ IPAMORELIN 2 MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | CJC-1295 / Ipamorelin Growth Hormone Pro | 97.0 | COMPLETE_PACKAGE | 5 mL | 97.0 | 20.0 | 189.75 | 189 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($97.0) but CP has 2 distinct cost bases — no silent choice. |
| Tesamorelin / Ipamorelin Injection | Tesamorelin/Ipamorelin 3mg/2mg/mL (5ml) | Greenwich Pharmacy | Tesamorelin/Ipamorelin | 77.0 | COMPLETE_PACKAGE | 5ML | 77.0 | 25.0 | 159.75 | 159 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($77.0) but CP has 2 distinct cost bases — no silent choice. |
| Testosterone / HRT — Cream | — | — | Men's Hormones – Nandrolone / Testostero | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ["Men's Hormones – Nandrolone / Testosterone Cream", "... |
| Testosterone / HRT — Injection | TESTOSTERONE CYPIONATE (GRAPESEED OIL) 20 MG/ML (5 ML) | Optimal Balance Pharmacy | [SELECTED] Testosterone — TESTOSTERONE C | 23.75 | COMPLETE_PACKAGE | 5 mL | 23.75 | 20.0 | 61.5625 | 59 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($23.75) but CP has 4 distinct cost bases — no silent choice. |
| Testosterone / HRT — Injection | TESTOSTERONE CYPIONATE (GRAPESEED OIL) 200 MG/ML (5 ML) | Optimal Balance Pharmacy | [SELECTED] Testosterone — TESTOSTERONE C | 25.5 | COMPLETE_PACKAGE | 5 mL | 25.5 | 20.0 | 64.625 | 69 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($25.5) but CP has 4 distinct cost bases — no silent choice. |
| Testosterone / HRT — Injection | TESTOSTERONE CYPIONATE (GRAPESEED OIL) 50 MG/ML (5 ML) | Optimal Balance Pharmacy | [SELECTED] Testosterone — TESTOSTERONE C | 23.75 | COMPLETE_PACKAGE | 5 mL | 23.75 | 20.0 | 61.5625 | 59 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($23.75) but CP has 4 distinct cost bases — no silent choice. |
| Testosterone / HRT — Injection | TESTOSTERONE CYPIONATE (MCT OIL) 200 MG/ML (5 ML) | Optimal Balance Pharmacy | [SELECTED] Testosterone — TESTOSTERONE C | 35.0 | COMPLETE_PACKAGE | 5 mL | 35.0 | 20.0 | 81.25 | 79 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($35.0) but CP has 4 distinct cost bases — no silent choice. |
| Testosterone / HRT — Injection | TESTOSTERONE CYPIONATE INJECTION (CS) 200MG/ML 200MG/ML (10ML) | Optimal Balance Pharmacy | [SELECTED] Testosterone — TESTOSTERONE C | 37.0 | OTHER | 10 mL | — | 20.0 | — | — | **MULTIPLE_VALID_FORMULARIES** | Unit=OTHER; cannot confirm complete dispense uniquely among multi bases. |
| Testosterone / HRT — Troche | — | — | Men's Hormones (TRT) – Testosterone Troc | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ["Men's Hormones (TRT) – Testosterone Troche"] |
| Testosterone / HRT — Unspecified | — | — | Depo-Testosterone (Pfizer) | — | OTHER | — | — | — | — | — | **DEFERRED** | No medicationCost on formulary pairings. Class=DEFERRED_PRODUCT. Masters sample: ['Depo-Testosterone (Pfizer)', "Men's Hormones (TRT) – T... |
| The Ultimate Semaglutide Stack | — | — | The Ultimate Semaglutide Stack | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['The Ultimate Semaglutide Stack'] |
| Thymosin Alpha-1 Injection | THYMOSIN ALPHA-1 3 MG/ML (5 ML) | Optimal Balance Pharmacy | Thymosin Alpha-1 Immune Support Protocol | 82.0 | COMPLETE_PACKAGE | 5 mL | 82.0 | 20.0 | 163.5 | 159 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($82.0) but CP has 2 distinct cost bases — no silent choice. |
| Thymosin Alpha-1 Injection | Thymosin A-1 5mg/mL (5ml) | Greenwich Pharmacy | Thymosin A-1 | 77.0 | COMPLETE_PACKAGE | 5ml | 77.0 | 30.0 | 164.75 | 169 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($77.0) but CP has 2 distinct cost bases — no silent choice. |
| Tirzepatide + Ondansetron (Nausea Support) | — | — | GLP-2 Weight Loss – Tirzepatide / Ondans | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=NO_EXACT_FORMULARY. Masters sample: ['GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (H... |
| Tirzepatide Injection — 3-Month (B12) | — | — | — | — | OTHER | — | — | — | — | — | **MISSING_SOURCE_COST** | No medicationCost on formulary pairings. Class=MISSING_SOURCE_COST. Masters sample: [] |
| Tirzepatide Injection — Any Dose (B12) | TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 10M | 75.0 | PER_VIAL | 2mL | 75.0 | 5.0 | 136.25 | 139 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 2mL — complete single-vial dispense for this strength. Additive=B12. |
| Tirzepatide Injection — Any Dose (B12) | TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 15M | 85.0 | PER_VIAL | 2mL | 85.0 | 5.0 | 153.75 | 149 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 2mL — complete single-vial dispense for this strength. Additive=B12. |
| Tirzepatide Injection — Any Dose (B12) | TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 20M | 90.0 | PER_VIAL | 2mL | 90.0 | 5.0 | 162.5 | 159 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 2mL — complete single-vial dispense for this strength. Additive=B12. |
| Tirzepatide Injection — Any Dose (B12) | TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 25M | 95.0 | PER_VIAL | 2mL | 95.0 | 5.0 | 171.25 | 169 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 2mL — complete single-vial dispense for this strength. Additive=B12. |
| Tirzepatide Injection — Any Dose (B12) | TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 30M | 100.0 | PER_VIAL | 2mL | 100.0 | 5.0 | 180.0 | 179 | **ANY_DOSE_MAX_COST_BASIS** | CONTROLLING Any Dose retail basis (highest verified vial cost). Package 2mL — complete single-vial dispense for this strength. Additive=B12. |
| Tirzepatide Injection — Any Dose (B12) | TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 5MG | 65.0 | PER_VIAL | 2mL | 65.0 | 5.0 | 118.75 | 119 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 2mL — complete single-vial dispense for this strength. Additive=B12. |
| Tirzepatide Injection — Any Dose (Glycine) | TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 10MG/0. | 75.0 | PER_VIAL | 2mL | 75.0 | 5.0 | 136.25 | 139 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 2mL — complete single-vial dispense for this strength. Additive=Glycine. |
| Tirzepatide Injection — Any Dose (Glycine) | TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 15MG/0. | 85.0 | PER_VIAL | 2mL | 85.0 | 5.0 | 153.75 | 149 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 2mL — complete single-vial dispense for this strength. Additive=Glycine. |
| Tirzepatide Injection — Any Dose (Glycine) | TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 20MG/0. | 90.0 | PER_VIAL | 2mL | 90.0 | 5.0 | 162.5 | 159 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 2mL — complete single-vial dispense for this strength. Additive=Glycine. |
| Tirzepatide Injection — Any Dose (Glycine) | TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 25MG/0. | 95.0 | PER_VIAL | 2mL | 95.0 | 5.0 | 171.25 | 169 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 2mL — complete single-vial dispense for this strength. Additive=Glycine. |
| Tirzepatide Injection — Any Dose (Glycine) | TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 30MG/0. | 100.0 | PER_VIAL | 2mL | 100.0 | 5.0 | 180.0 | 179 | **ANY_DOSE_MAX_COST_BASIS** | CONTROLLING Any Dose retail basis (highest verified vial cost). Package 2mL — complete single-vial dispense for this strength. Additive=G... |
| Tirzepatide Injection — Any Dose (Glycine) | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 5MG/0.5 | 65.0 | PER_VIAL | 2mL | 65.0 | 5.0 | 118.75 | 119 | **VERIFIED_COMPLETE_COST** | Eligible strength under Any Dose (not controlling). Package 2mL — complete single-vial dispense for this strength. Additive=Glycine. |
| Tirzepatide Injection — High (B12) | TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 25M | 95.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 95.0 | 5.0 | 171.25 | 169 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for High tier (B12). Tier CP spans multiple strengths; each strength is a valid complete dispense. No sil... |
| Tirzepatide Injection — High (B12) | TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 30M | 100.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 100.0 | 5.0 | 180.0 | 179 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for High tier (B12). Tier CP spans multiple strengths; each strength is a valid complete dispense. No sil... |
| Tirzepatide Injection — High (Glycine) | TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 25MG/0. | 95.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 95.0 | 5.0 | 171.25 | 169 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for High tier (Glycine). Tier CP spans multiple strengths; each strength is a valid complete dispense. No... |
| Tirzepatide Injection — High (Glycine) | TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 30MG/0. | 100.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 100.0 | 5.0 | 180.0 | 179 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for High tier (Glycine). Tier CP spans multiple strengths; each strength is a valid complete dispense. No... |
| Tirzepatide Injection — Mid (B12) | TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 15M | 85.0 | PER_VIAL | 2mL | 85.0 | 5.0 | 153.75 | 149 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($85.0) but CP has 2 distinct cost bases — no silent choice. |
| Tirzepatide Injection — Mid (B12) | TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 20M | 90.0 | PER_VIAL | 2mL | 90.0 | 5.0 | 162.5 | 159 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($90.0) but CP has 2 distinct cost bases — no silent choice. |
| Tirzepatide Injection — Mid (Glycine) | TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 15MG/0. | 85.0 | PER_VIAL | 2mL | 85.0 | 5.0 | 153.75 | 149 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($85.0) but CP has 2 distinct cost bases — no silent choice. |
| Tirzepatide Injection — Mid (Glycine) | TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 20MG/0. | 90.0 | PER_VIAL | 2mL | 90.0 | 5.0 | 162.5 | 159 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($90.0) but CP has 2 distinct cost bases — no silent choice. |
| Tirzepatide Injection — Starting / Low (B12) | TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 10M | 75.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 75.0 | 5.0 | 136.25 | 139 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for Starting/Low tier (B12). Tier CP spans multiple strengths; each strength is a valid complete dispense... |
| Tirzepatide Injection — Starting / Low (B12) | TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + VITAMIN B12 5MG | 65.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 65.0 | 5.0 | 118.75 | 119 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for Starting/Low tier (B12). Tier CP spans multiple strengths; each strength is a valid complete dispense... |
| Tirzepatide Injection — Starting / Low (Glycine) | TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 10MG/0. | 75.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 75.0 | 5.0 | 136.25 | 139 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for Starting/Low tier (Glycine). Tier CP spans multiple strengths; each strength is a valid complete disp... |
| Tirzepatide Injection — Starting / Low (Glycine) | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | [SELECTED] TIRZEPATIDE + GLYCINE 5MG/0.5 | 65.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 65.0 | 5.0 | 118.75 | 119 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for Starting/Low tier (Glycine). Tier CP spans multiple strengths; each strength is a valid complete disp... |
| Tirzepatide Injection — Starting / Low (Glycine) | TIRZEPATIDE 0.5mg 30 count | Valiant | Tirzepatide | 35.0 | PER_VIAL | 1 × vial (complete dispense for this strength) | 35.0 | 30.0 | 91.25 | 89 | **MULTIPLE_VALID_FORMULARIES** | Verified complete PER_VIAL cost for Starting/Low tier (Glycine). Tier CP spans multiple strengths; each strength is a valid complete disp... |
| Tretinoin / Skin — Unspecified | FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.25/5/0.01 % | Vios | [SELECTED] Minoxidil — FINASTERIDE/MINOX | 35.0 | PER_ML | — | — | 30.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_ML, package=1 ml. Complete dispense quantity not evidenced. Part of multi-basis set (3 distinct cost/ship). |
| Tretinoin / Skin — Unspecified | FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.25/5/0.03 % | Vios | [SELECTED] Minoxidil — FINASTERIDE/MINOX | 35.0 | PER_ML | — | — | 30.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_ML, package=1 ml. Complete dispense quantity not evidenced. Part of multi-basis set (3 distinct cost/ship). |
| Tretinoin / Skin — Unspecified | FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.5/5/0.01 % | Vios | [SELECTED] Minoxidil — FINASTERIDE/MINOX | 35.0 | PER_ML | — | — | 30.0 | — | — | **PACKAGE_QUANTITY_UNKNOWN** | Inferred unit=PER_ML, package=1 ml. Complete dispense quantity not evidenced. Part of multi-basis set (3 distinct cost/ship). |
| Tretinoin / Skin — Unspecified | HYALURONIC/NIACINAMIDE/TRETINOIN 0.5/4/0.025% | Vios | [SELECTED] Tretinoin — HYALURONIC/NIACIN | 54.0 | COMPLETE_PACKAGE | 30 grams | 54.0 | 30.0 | 124.5 | 129 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($54.0) but CP has 3 distinct cost bases — no silent choice. |
| Tretinoin / Skin — Unspecified | TRETINOIN 0.15% | Vios | [SELECTED] Tretinoin — TRETINOIN 0.15% | 25.5 | COMPLETE_PACKAGE | 30 grams | 25.5 | 30.0 | 74.625 | 79 | **MULTIPLE_VALID_FORMULARIES** | Appears complete package/vial cost ($25.5) but CP has 3 distinct cost bases — no silent choice. |

---

## Original 25 MULTIPLE_COST_BASIS_REVIEW — product outcomes

| Product | Outcome | Resolved? |
|---|---|:---:|
| BPC-157 Injection | MULTIPLE_VALID_FORMULARIES | NO |
| Dihexa — Unspecified | PACKAGE_QUANTITY_UNKNOWN | NO |
| Estradiol / HRT — Vaginal Cream | MULTIPLE_VALID_FORMULARIES | NO |
| MOTS-C Injection | MULTIPLE_VALID_FORMULARIES | NO |
| PT-141 (Bremelanotide) Nasal Spray | PACKAGE_QUANTITY_UNKNOWN | NO |
| Semaglutide Injection — Any Dose (B12) | ANY_DOSE_MAX_COST_BASIS | YES |
| Semaglutide Injection — Any Dose (Glycine) | ANY_DOSE_MAX_COST_BASIS | YES |
| Semaglutide Injection — High (B12) | MULTIPLE_VALID_FORMULARIES | NO |
| Semaglutide Injection — High (Glycine) | MULTIPLE_VALID_FORMULARIES | NO |
| Semaglutide Injection — Starting / Low (B12) | MULTIPLE_VALID_FORMULARIES | NO |
| Semaglutide Injection — Starting / Low (Glycine) | MULTIPLE_VALID_FORMULARIES | NO |
| Sildenafil — Unspecified | PACKAGE_QUANTITY_UNKNOWN | NO |
| Tadalafil — Unspecified | MULTIPLE_VALID_FORMULARIES | NO |
| Tesamorelin / Ipamorelin Injection | MULTIPLE_VALID_FORMULARIES | NO |
| Testosterone / HRT — Injection | MULTIPLE_VALID_FORMULARIES | NO |
| Thymosin Alpha-1 Injection | MULTIPLE_VALID_FORMULARIES | NO |
| Tirzepatide Injection — Any Dose (B12) | ANY_DOSE_MAX_COST_BASIS | YES |
| Tirzepatide Injection — Any Dose (Glycine) | ANY_DOSE_MAX_COST_BASIS | YES |
| Tirzepatide Injection — High (B12) | MULTIPLE_VALID_FORMULARIES | NO |
| Tirzepatide Injection — High (Glycine) | MULTIPLE_VALID_FORMULARIES | NO |
| Tirzepatide Injection — Mid (B12) | MULTIPLE_VALID_FORMULARIES | NO |
| Tirzepatide Injection — Mid (Glycine) | MULTIPLE_VALID_FORMULARIES | NO |
| Tirzepatide Injection — Starting / Low (B12) | MULTIPLE_VALID_FORMULARIES | NO |
| Tirzepatide Injection — Starting / Low (Glycine) | MULTIPLE_VALID_FORMULARIES | NO |
| Tretinoin / Skin — Unspecified | MULTIPLE_VALID_FORMULARIES | NO |

Resolved: **4** / 25 · Remaining: **21**

---

## Missing cost (57)

No costs invented. All 57 remain unresolved pending master formulary cost.

Classification mixed across rows: `MISSING_SOURCE_COST`, `NO_EXACT_FORMULARY`, `DEFERRED_PRODUCT` (see JSON `missingClass` / status).

Future products may stay unpriced + hidden. **LIVE_NOW may not write without verified complete cost.**

---

## Status

- PRICING FORMULA CHANGED: **NO**
- GEN MODIFIED: **NO**
- GEN WRITES: **0**
- WEBSITE MODIFIED: **NO**
- GEN/WHOP CUTOVER: **OFF**

**STOP.** Do not proceed to GEN-CATALOG-2.
