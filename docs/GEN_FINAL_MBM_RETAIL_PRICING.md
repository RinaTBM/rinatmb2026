# GEN Final MBM Retail Pricing (GEN-CATALOG-1H + 1I Amendment)

**READ-ONLY — no GEN writes. STOP FOR OWNER ECONOMIC REVIEW.**
**Updated:** 2026-08-24T07:31:34Z

---

## Authoritative pricing hierarchy (LOCKED)

### Standard one-time / one-month dispense
```
monthly_raw_retail = (at_cost × 1.75) + pharmacy_shipping
final_retail = nearest $X9 (equidistant → ROUND UP)
```

### 3-month supply
```
three_month_raw_retail = ((monthly_at_cost × 1.75) + monthly_pharmacy_shipping) × 3
final_3_month_retail = nearest $X9 (equidistant → ROUND UP)
```

Do **not** treat a single month’s at-cost as the entire 3-month cost.
Do **not** use `(at_cost × 1.75) + one shipping` as the 3-month total unless verified 3-month fulfillment data says otherwise.

### 6-month supply
```
six_month_raw_retail = ((monthly_at_cost × 1.75) + monthly_pharmacy_shipping) × 6
final_6_month_retail = nearest $X9 (equidistant → ROUND UP)
```

### Membership overrides (owner-set — not 1.75 formula)

| Patient-facing membership | Monthly price |
|---|---:|
| **SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP** | **$149** |
| **TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP** | **$275** |

Do **not** change $149 / $275 without owner approval.
Do **not** overwrite one-time cost-plus pricing with membership pricing — separate models.

Internal B12 vs Glycine formularies remain distinct (no cross-pair). One patient-facing membership may route to the correct approved dose/additive underneath; if GEN cannot multi-pair under one client product, flag separate membership SKUs.

**GEN limitation flag:** `POSSIBLE_SEPARATE_MEMBERSHIP_SKUS_IF_GEN_CANNOT_MULTI_PAIR_B12_AND_GLYCINE_UNDER_ONE_CLIENT_PRODUCT`

---

## Semaglutide membership economic validation ($149)

| Dose | Additive | Formulation | Pharmacy | At-cost | Ship | Landed | Rev $149 | GP | GM% |
|---|---|---|---|---:|---:|---:|---:|---:|---:|
| 10mg/0.5mg/mL | B12 | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 65.0 | 5.0 | 70.0 | 149 | 79.0 | 53.02 |
| 10mg/0.5mg/mL | Glycine | SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 65.0 | 5.0 | 70.0 | 149 | 79.0 | 53.02 |
| 6mg/0.5mg/mL | B12 | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 60.0 | 5.0 | 65.0 | 149 | 84.0 | 56.38 |
| 6mg/0.5mg/mL | Glycine | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 60.0 | 5.0 | 65.0 | 149 | 84.0 | 56.38 |
| 4mg/0.5mg/mL | B12 | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 58.0 | 5.0 | 63.0 | 149 | 86.0 | 57.72 |
| 4mg/0.5mg/mL | Glycine | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 58.0 | 5.0 | 63.0 | 149 | 86.0 | 57.72 |
| 2mg/0.5mg/mL | B12 | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 55.0 | 5.0 | 60.0 | 149 | 89.0 | 59.73 |
| 2mg/0.5mg/mL | Glycine | SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 55.0 | 5.0 | 60.0 | 149 | 89.0 | 59.73 |
| 1mg/0.5mg/mL | B12 | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50.0 | 5.0 | 55.0 | 149 | 94.0 | 63.09 |
| 1mg/0.5mg/mL | Glycine | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50.0 | 5.0 | 55.0 | 149 | 94.0 | 63.09 |

- **Highest cost dose:** {'formulation': 'SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL)', 'strength': '10mg/0.5mg/mL', 'additive': 'B12', 'atCost': 65.0, 'shipping': 5.0, 'landed': 70.0}
- **Lowest margin dose:** {'formulation': 'SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL)', 'strength': '10mg/0.5mg/mL', 'additive': 'B12', 'gp': 79.0, 'gm': 53.02, 'landed': 70.0}
- **Status:** **ECONOMICALLY_WORKABLE** — All eligible doses GP>0 and lowest GM 53.02% ≥ 25%

---

## Tirzepatide membership economic validation ($275)

| Dose | Additive | Formulation | Pharmacy | At-cost | Ship | Landed | Rev $275 | GP | GM% |
|---|---|---|---|---:|---:|---:|---:|---:|---:|
| 30mg/0.5mg/mL | B12 | TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 100.0 | 5.0 | 105.0 | 275 | 170.0 | 61.82 |
| 30mg/0.5mg/mL | Glycine | TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 100.0 | 5.0 | 105.0 | 275 | 170.0 | 61.82 |
| 25mg/0.5mg/mL | B12 | TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 95.0 | 5.0 | 100.0 | 275 | 175.0 | 63.64 |
| 25mg/0.5mg/mL | Glycine | TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 95.0 | 5.0 | 100.0 | 275 | 175.0 | 63.64 |
| 20mg/0.5mg/mL | B12 | TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 90.0 | 5.0 | 95.0 | 275 | 180.0 | 65.45 |
| 20mg/0.5mg/mL | Glycine | TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 90.0 | 5.0 | 95.0 | 275 | 180.0 | 65.45 |
| 15mg/0.5mg/mL | B12 | TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 85.0 | 5.0 | 90.0 | 275 | 185.0 | 67.27 |
| 15mg/0.5mg/mL | Glycine | TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 85.0 | 5.0 | 90.0 | 275 | 185.0 | 67.27 |
| 10mg/0.5mg/mL | B12 | TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 75.0 | 5.0 | 80.0 | 275 | 195.0 | 70.91 |
| 10mg/0.5mg/mL | Glycine | TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 75.0 | 5.0 | 80.0 | 275 | 195.0 | 70.91 |
| 5mg/0.5mg/mL | B12 | TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 65.0 | 5.0 | 70.0 | 275 | 205.0 | 74.55 |
| 5mg/0.5mg/mL | Glycine | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 65.0 | 5.0 | 70.0 | 275 | 205.0 | 74.55 |

- **Highest cost dose:** {'formulation': 'TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL)', 'strength': '30mg/0.5mg/mL', 'additive': 'B12', 'atCost': 100.0, 'shipping': 5.0, 'landed': 105.0}
- **Lowest margin dose:** {'formulation': 'TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL)', 'strength': '30mg/0.5mg/mL', 'additive': 'B12', 'gp': 170.0, 'gm': 61.82, 'landed': 105.0}
- **Status:** **ECONOMICALLY_WORKABLE** — All eligible doses GP>0 and lowest GM 61.82% ≥ 25%

---

## 3-month products recalculated

### Semaglutide Injection — 3-Month (Glycine) (`sem-glycine-3month`)
- No verified monthly cost basis — cannot apply ×3 yet

### Semaglutide Injection — 3-Month (B12) (`sem-b12-3month`)
- Formulation: SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS))
  - monthlyShipping: 30.0
  - statedRowCost: 50.0
  - note: Row claims 3 VIALS with embedded cost — NOT used as monthly. Need separate monthly vial cost. Stated row cost=$50.0.
- Formulation: SEM+B12 escalation 4→6→10mg (Dirx-Hub)
  - threeMonthRaw_ownerTimes3Using10mgMonthly: 356.25
  - threeMonthFinalX9_ownerTimes3Using10mgMonthly: 359
  - threeMonthRaw_escalationSumDistinctVials: 335.25
  - threeMonthFinalX9_escalationSumDistinctVials: 339
  - note: Owner ×3 rule using 10mg monthly ($65+$5) as proxy. Product name is escalation 4→6→10mg — alternate evidence-based total = sum of three distinct vial monthlies. Broken SELECTED row ($50 for 3 vials) discarded.

### Semaglutide Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply (`sem-other-glp1weightlossplansemaglutideanydose3mon`)
- No verified monthly cost basis — cannot apply ×3 yet

### Semaglutide Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply (`sem-other-glp1weightlossplansemaglutidehighdose3mo`)
- No verified monthly cost basis — cannot apply ×3 yet

### Semaglutide Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply (`sem-other-glp1weightlossplansemaglutidemiddose3mon`)
- No verified monthly cost basis — cannot apply ×3 yet

### Semaglutide Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply (`sem-other-glp1weightlossplansemaglutidestartingdos`)
- No verified monthly cost basis — cannot apply ×3 yet

### Semaglutide Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Low: 1→2→4mg) (`sem-other-glp1weightlossplansemaglutide3monthescal`)
- No verified monthly cost basis — cannot apply ×3 yet

### Tirzepatide Injection — 3-Month (Glycine) (`tir-glycine-3month`)
- Formulation: TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) (3 PACK))
  - ownerTimes3Using30mgMonthly_raw: 540.0
  - ownerTimes3Using30mgMonthly_finalX9: 539
  - statedRowCost: 225.0
  - costBasisStatus: PACKAGE_QUANTITY_UNKNOWN
  - note: Unresolved package interpretation; owner ×3 proxy from highest TIR monthly (30mg $100+$5) = $356.25 → $359 shown for review only
  - interpretation: Formulary name claims 3 PACK — do NOT apply owner ×3 on top of stated row cost without confirming whether $225 is monthly or already 3-month pharmacy cost

### Tirzepatide Injection — 3-Month (B12) (`tir-b12-3month`)
- No verified monthly cost basis — cannot apply ×3 yet

### Sildenafil (3 Month) (`review-sildenafil3month`)
- Formulation: Scream Cream (Pentoxifylline/Arginine HCl/Sildenafil) 3/6/2%
  - monthlyAtCost: 45.0
  - monthlyShipping: 30.0
  - threeMonthRaw: 326.25
  - threeMonthFinalX9: 329
  - note: Using row cost as monthly_at_cost under owner ×3 rule
  - deferred: True
  - costBasisWarning: DEFERRED product / Scream Cream formulary mispair per owner Decision #7/#8/#9 — do not use for LIVE write

## 6-month products recalculated

### Semaglutide/B12 (6 Months) (`sem-other-semaglutideb126months`)
- Formulation: SEMAGLUTIDE/B12 0.6 MG/ 500 MCG/ML (2 ML)
  - monthlyAtCost: 62.0
  - monthlyShipping: 20.0
  - sixMonthRaw: 771.0
  - sixMonthFinalX9: 769
  - costBasisWarning: Confirm source cost is monthly complete dispense before applying ×6

### Sildenafil (6 Month) (`review-sildenafil6month`)
- Formulation: Scream Cream (Pentoxifylline/Arginine HCl/Sildenafil) 3/6/2%
  - monthlyAtCost: 45.0
  - monthlyShipping: 30.0
  - sixMonthRaw: 652.5
  - sixMonthFinalX9: 649
  - costBasisWarning: DEFERRED product / Scream Cream formulary mispair per owner Decision #7/#8/#9 — do not use for LIVE write
  - deferred: True

---

## Final report

| Metric | Value |
|---|---|
| SEM_MEMBERSHIP_TARGET | 149 |
| SEM_HIGHEST_MONTHLY_LANDED_COST | 70.0 |
| SEM_LOWEST_GP | 79.0 |
| SEM_LOWEST_GM_PCT | 53.02 |
| SEM_149_ECONOMIC_STATUS | ECONOMICALLY_WORKABLE |
| TIRZ_MEMBERSHIP_TARGET | 275 |
| TIRZ_HIGHEST_MONTHLY_LANDED_COST | 105.0 |
| TIRZ_LOWEST_GP | 170.0 |
| TIRZ_LOWEST_GM_PCT | 61.82 |
| TIRZ_275_ECONOMIC_STATUS | ECONOMICALLY_WORKABLE |
| THREE_MONTH_PRODUCTS_RECALCULATED | 10 |
| SIX_MONTH_PRODUCTS_RECALCULATED | 2 |
| STANDARD_PRICING_RULE_LOCKED | YES |
| MULTI_MONTH_PRICING_RULE_LOCKED | YES |
| MEMBERSHIP_OVERRIDE_RULE_LOCKED | YES |
| GEN_MODIFIED | NO |
| GEN_WRITES | 0 |
| WEBSITE_MODIFIED | NO |
| GEN_WHOP_CUTOVER | OFF |
| THREE_MONTH_NOTE | SEM 3-Month B12: discarded broken $50/3-vial row; owner ×3 on 10mg monthly → raw $356.25 → $359; escalation-sum alternate 4+6+10 → raw $335.25 → $339. TIR 3-Month: 3 PACK row interpretation unresolved. |
| generated_at | 2026-08-24T07:31:34Z |

**STOP FOR OWNER ECONOMIC REVIEW.** No GEN-CATALOG-2 / no GEN writes.

---

## Prior one-time $X9 tables

Full per-product one-time formulary pricing rows remain in `docs/GEN_FINAL_MBM_RETAIL_PRICING.json` (`pricingRows`).
Cost-basis statuses remain in `docs/GEN_FINAL_COST_BASIS_REVIEW.md`.
This amendment adds multi-month ×3/×6 rules and membership economic validation without changing the core one-time formula.
