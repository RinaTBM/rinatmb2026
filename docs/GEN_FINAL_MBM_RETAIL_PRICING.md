# GEN Final MBM Retail Pricing (GEN-CATALOG-1H)

**READ-ONLY — no GEN writes. STOP FOR FINAL OWNER REVIEW.**
**Generated:** 2026-08-24T07:09:42Z

This supersedes prior retail-price comparison logic and `docs/GEN_RETAIL_PRICING_RULE.md` rounding (nearest dollar).

---

## Authoritative pricing rule (LOCKED for GEN-CATALOG-2 + website sync)

```
raw_retail = (pharmacy_medication_cost × 1.75) + pharmacy_shipping
final_retail = round_to_nearest_whole_dollar_ending_in_9(raw_retail)
             # if equidistant between lower and upper *9 → ROUND UP
```

**NOT** `(at_cost + shipping) × 1.75`

- Customer-facing medication shipping: **INCLUDED** in retail — do **not** add pharmacy shipping again at website checkout
- Accessory shipping: **SEPARATE**
- Provider visit fees: **SEPARATE**
- Taxes: **SEPARATE** (not part of this calculation)
- Current website price / current GEN price: **reference only — NOT authority**
- Pricing authority: **newest verified formulary cost + shipping**
- Multiple eligible cost bases: calculate each; **do not silently choose** → `MULTIPLE_COST_BASIS_REVIEW` unless a single distinct (cost, ship) basis exists
- SEM/TIR: each B12/Glycine tier uses its exact formulary cost(s); keep additives **separate**

Examples: raw $173.50 → **$169**; raw $214.75 → **$219**; raw $174.00 (equidistant) → **$179**

Gross profit = FINAL − AT-COST − SHIPPING; Gross margin % = GP / FINAL

---

## Final report

| Metric | Value |
|---|---:|
| PRODUCTS_PRICED | 70 |
| PRICING_ROWS_WITH_FINAL_X9 | 134 |
| PRODUCTS_TOTAL | 127 |
| PRICE_CHANGES_REQUIRED | 44 |
| MULTIPLE_COST_BASIS_REVIEW | 25 |
| MISSING_COST | 57 |
| MISSING_SHIPPING | 0 |
| LIVE_NOW_TOTAL | 16 |
| LIVE_NOW_PRICING_READY | 8 |
| FUTURE_HIDDEN_TOTAL | 111 |
| FUTURE_HIDDEN_PRICING_READY | 37 |
| AUTHORITATIVE_SINGLE_BASIS_PRODUCTS | 45 |
| GEN_MODIFIED | NO |
| GEN_WRITES | 0 |
| WEBSITE_MODIFIED | NO |
| GEN_WHOP_CUTOVER | OFF |

---

## LIVE_NOW pricing rows

| PRODUCT | FORMULATION | PHARMACY | AT-COST | SHIP | RAW RETAIL | FINAL $X9 | GEN $ | WEB $ | CHANGE? | MATCH | GP | GM% |
|---|---|---|---:|---:|---:|---:|---:|---:|:---:|---|---:|---:|
| Semaglutide Injection — Starting / Low (Glycine) | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50 | 5 | 92.5 | **89** | 119 | — | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_DIFFERS | 34 | 38.2 |
| Semaglutide Injection — Starting / Low (Glycine) | SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 55 | 5 | 101.25 | **99** | 119 | — | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_DIFFERS | 39 | 39.39 |
| Semaglutide Injection — Mid (Glycine) | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 58 | 5 | 106.5 | **109** | 109 | — |  | MATCHES_REFERENCE | 46 | 42.2 |
| Semaglutide Injection — High (Glycine) | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 60 | 5 | 110 | **109** | 129 | — | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_DIFFERS | 44 | 40.37 |
| Semaglutide Injection — High (Glycine) | SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 129 | — | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_DIFFERS | 49 | 41.18 |
| Semaglutide Injection — Any Dose (Glycine) | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50 | 5 | 92.5 | **89** | 149 | 149 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 34 | 38.2 |
| Semaglutide Injection — Any Dose (Glycine) | SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 55 | 5 | 101.25 | **99** | 149 | 149 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 39 | 39.39 |
| Semaglutide Injection — Any Dose (Glycine) | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 58 | 5 | 106.5 | **109** | 149 | 149 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 46 | 42.2 |
| Semaglutide Injection — Any Dose (Glycine) | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 60 | 5 | 110 | **109** | 149 | 149 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 44 | 40.37 |
| Semaglutide Injection — Any Dose (Glycine) | SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 149 | 149 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 49 | 41.18 |
| Semaglutide Injection — 3-Month (Glycine) | — | — | — | — | — | **—** | — | — |  | MISSING_COST | — | — |
| Semaglutide Injection — Starting / Low (B12) | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50 | 5 | 92.5 | **89** | — | — | YES | MULTIPLE_COST_BASIS_REVIEW|PRICED_NO_REFERENCE | 34 | 38.2 |
| Semaglutide Injection — Starting / Low (B12) | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 55 | 5 | 101.25 | **99** | — | — | YES | MULTIPLE_COST_BASIS_REVIEW|PRICED_NO_REFERENCE | 39 | 39.39 |
| Semaglutide Injection — Mid (B12) | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 58 | 5 | 106.5 | **109** | — | — |  | PRICED_NO_REFERENCE | 46 | 42.2 |
| Semaglutide Injection — High (B12) | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 60 | 5 | 110 | **109** | 199 | — | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_DIFFERS | 44 | 40.37 |
| Semaglutide Injection — High (B12) | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 199 | — | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_DIFFERS | 49 | 41.18 |
| Semaglutide Injection — Any Dose (B12) | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50 | 5 | 92.5 | **89** | 189 | 149 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 34 | 38.2 |
| Semaglutide Injection — Any Dose (B12) | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 55 | 5 | 101.25 | **99** | 189 | 149 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 39 | 39.39 |
| Semaglutide Injection — Any Dose (B12) | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 58 | 5 | 106.5 | **109** | 189 | 149 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 46 | 42.2 |
| Semaglutide Injection — Any Dose (B12) | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 60 | 5 | 110 | **109** | 189 | 149 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 44 | 40.37 |
| Semaglutide Injection — Any Dose (B12) | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 189 | 149 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 49 | 41.18 |
| Semaglutide Injection — 3-Month (B12) | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) | Dirx-Hub | 50 | 30 | 117.5 | **119** | 799 | — | YES | GEN_DIFFERS | 39 | 32.77 |
| AOD-9604 Injection | AOD 9604 300 MCG | Optimal Balance Pharmacy | 1.75 | 20 | 23.0625 | **19** | 179 | — | YES | GEN_DIFFERS | -2.75 | -14.47 |
| AOD-9604 / MOTS-C / Tesamorelin Injection | AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/ 2MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | 102 | 20 | 198.5 | **199** | 219 | 259 | YES | GEN_AND_WEBSITE_DIFFERS | 77 | 38.69 |
| BPC-157 Injection | BPC-157 500 MCG | Optimal Balance Pharmacy | 1.8 | 20 | 23.15 | **19** | 199 | 199 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | -2.8 | -14.74 |
| BPC-157 Injection | BPC-157/TB-500/GHK-CU 3/3/10MG/ML | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | 199 | 199 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 57 | 35.85 |
| BPC-157 Injection | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | 199 | 199 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 57 | 35.85 |
| BPC-157 Injection | BPC-157/KPV/TB500 3mg/3mg/3mg/mL | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | 199 | 199 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 57 | 35.85 |
| BPC-157 Injection | BPC-157/TB500 3mg/3mg/mL | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | 199 | 199 | YES | MULTIPLE_COST_BASIS_REVIEW|GEN_AND_WEBSITE_DIFFERS | 57 | 35.85 |
| BPC-157 — Unspecified | BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml) | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | 189 | — | YES | GEN_DIFFERS | 57 | 35.85 |
| BPC-157 / TB-500 Capsules | BPC-157/TB500 capsules 500MCG/500MCG | Greenwich Pharmacy | 3.2 | 25 | 30.6 | **29** | 169 | 99 | YES | GEN_AND_WEBSITE_DIFFERS | 0.8 | 2.76 |
| GHK-Cu / Minoxidil Topical Combo | Minoxidil 2.5mg/GHK-Cu 5mg/Apigenin 50mg/Fisetin 50mg | Epiq Scripts | 36.75 | 2 | 66.3125 | **69** | 149 | 129 | YES | GEN_AND_WEBSITE_DIFFERS | 30.25 | 43.84 |

### LIVE_NOW product readiness

| Product | Status | Bases |
|---|---|---:|
| Semaglutide Injection — Starting / Low (Glycine) | MULTIPLE_COST_BASIS_REVIEW | 2 |
| Semaglutide Injection — Mid (Glycine) | READY | 1 |
| Semaglutide Injection — High (Glycine) | MULTIPLE_COST_BASIS_REVIEW | 2 |
| Semaglutide Injection — Any Dose (Glycine) | MULTIPLE_COST_BASIS_REVIEW | 5 |
| Semaglutide Injection — 3-Month (Glycine) | MISSING_COST | 0 |
| Semaglutide Injection — Starting / Low (B12) | MULTIPLE_COST_BASIS_REVIEW | 2 |
| Semaglutide Injection — Mid (B12) | READY | 1 |
| Semaglutide Injection — High (B12) | MULTIPLE_COST_BASIS_REVIEW | 2 |
| Semaglutide Injection — Any Dose (B12) | MULTIPLE_COST_BASIS_REVIEW | 5 |
| Semaglutide Injection — 3-Month (B12) | READY | 1 |
| AOD-9604 Injection | READY | 1 |
| AOD-9604 / MOTS-C / Tesamorelin Injection | READY | 1 |
| BPC-157 Injection | MULTIPLE_COST_BASIS_REVIEW | 5 |
| BPC-157 — Unspecified | READY | 1 |
| BPC-157 / TB-500 Capsules | READY | 1 |
| GHK-Cu / Minoxidil Topical Combo | READY | 1 |

---

## MULTIPLE_COST_BASIS_REVIEW products

**Count:** 25

### Semaglutide Injection — Starting / Low (Glycine) (`sem-glycine-starting`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50 | 5 | 92.5 | **89** | 34 | 38.2 |
| SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 55 | 5 | 101.25 | **99** | 39 | 39.39 |

### Semaglutide Injection — High (Glycine) (`sem-glycine-high`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 60 | 5 | 110 | **109** | 44 | 40.37 |
| SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 49 | 41.18 |

### Semaglutide Injection — Any Dose (Glycine) (`sem-glycine-any`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50 | 5 | 92.5 | **89** | 34 | 38.2 |
| SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 55 | 5 | 101.25 | **99** | 39 | 39.39 |
| SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 58 | 5 | 106.5 | **109** | 46 | 42.2 |
| SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 60 | 5 | 110 | **109** | 44 | 40.37 |
| SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 49 | 41.18 |

### Semaglutide Injection — Starting / Low (B12) (`sem-b12-starting`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50 | 5 | 92.5 | **89** | 34 | 38.2 |
| SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 55 | 5 | 101.25 | **99** | 39 | 39.39 |

### Semaglutide Injection — High (B12) (`sem-b12-high`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 60 | 5 | 110 | **109** | 44 | 40.37 |
| SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 49 | 41.18 |

### Semaglutide Injection — Any Dose (B12) (`sem-b12-any`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50 | 5 | 92.5 | **89** | 34 | 38.2 |
| SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 55 | 5 | 101.25 | **99** | 39 | 39.39 |
| SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 58 | 5 | 106.5 | **109** | 46 | 42.2 |
| SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 60 | 5 | 110 | **109** | 44 | 40.37 |
| SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 49 | 41.18 |

### Tirzepatide Injection — Starting / Low (Glycine) (`tir-glycine-starting`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 49 | 41.18 |
| TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 75 | 5 | 136.25 | **139** | 59 | 42.45 |
| TIRZEPATIDE 0.5mg 30 count | Valiant | 35 | 30 | 91.25 | **89** | 24 | 26.97 |

### Tirzepatide Injection — Mid (Glycine) (`tir-glycine-mid`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 85 | 5 | 153.75 | **149** | 59 | 39.6 |
| TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 90 | 5 | 162.5 | **159** | 64 | 40.25 |

### Tirzepatide Injection — High (Glycine) (`tir-glycine-high`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 95 | 5 | 171.25 | **169** | 69 | 40.83 |
| TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 100 | 5 | 180 | **179** | 74 | 41.34 |

### Tirzepatide Injection — Any Dose (Glycine) (`tir-glycine-any`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 49 | 41.18 |
| TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 75 | 5 | 136.25 | **139** | 59 | 42.45 |
| TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 85 | 5 | 153.75 | **149** | 59 | 39.6 |
| TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 90 | 5 | 162.5 | **159** | 64 | 40.25 |
| TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 95 | 5 | 171.25 | **169** | 69 | 40.83 |
| TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 100 | 5 | 180 | **179** | 74 | 41.34 |

### Tirzepatide Injection — Starting / Low (B12) (`tir-b12-starting`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 49 | 41.18 |
| TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 75 | 5 | 136.25 | **139** | 59 | 42.45 |

### Tirzepatide Injection — Mid (B12) (`tir-b12-mid`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 85 | 5 | 153.75 | **149** | 59 | 39.6 |
| TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 90 | 5 | 162.5 | **159** | 64 | 40.25 |

### Tirzepatide Injection — High (B12) (`tir-b12-high`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 95 | 5 | 171.25 | **169** | 69 | 40.83 |
| TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 100 | 5 | 180 | **179** | 74 | 41.34 |

### Tirzepatide Injection — Any Dose (B12) (`tir-b12-any`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | 49 | 41.18 |
| TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 75 | 5 | 136.25 | **139** | 59 | 42.45 |
| TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 85 | 5 | 153.75 | **149** | 59 | 39.6 |
| TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 90 | 5 | 162.5 | **159** | 64 | 40.25 |
| TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 95 | 5 | 171.25 | **169** | 69 | 40.83 |
| TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 100 | 5 | 180 | **179** | 74 | 41.34 |

### BPC-157 Injection (`bpc157-injection`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| BPC-157 500 MCG | Optimal Balance Pharmacy | 1.8 | 20 | 23.15 | **19** | -2.8 | -14.74 |
| BPC-157/TB-500/GHK-CU 3/3/10MG/ML | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | 57 | 35.85 |
| BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | 57 | 35.85 |
| BPC-157/KPV/TB500 3mg/3mg/3mg/mL | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | 57 | 35.85 |
| BPC-157/TB500 3mg/3mg/mL | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | 57 | 35.85 |

### Tesamorelin / Ipamorelin Injection (`tesa-ipa-injection`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| CJC-1295/ IPAMORELIN 2 MG/ 2MG/ML (5 ML) | Optimal Balance Pharmacy | 97 | 20 | 189.75 | **189** | 72 | 38.1 |
| Tesamorelin/Ipamorelin 3mg/2mg/mL (5ml) | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | 57 | 35.85 |

### Dihexa — Unspecified (`other-dihexa-unspecified`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| Dihexa capsules 5mg | Greenwich Pharmacy | 2.6 | 25 | 29.55 | **29** | 1.4 | 4.83 |
| Dihexa/Tesofensine capsules 5mg/500mcg | Greenwich Pharmacy | 3.2 | 25 | 30.6 | **29** | 0.8 | 2.76 |

### Sildenafil — Unspecified (`sildenafil-unspecified`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| SILDENAFIL 100 mg | VitaScripts Pharmacy | 0.5 | 15 | 15.875 | **19** | 3.5 | 18.42 |
| SILDENAFIL/ TADALAFIL 50 MG/ 10 MG | Optimal Balance Pharmacy | 1.56 | 20 | 22.73 | **19** | -2.56 | -13.47 |

### Tadalafil — Unspecified (`tadalafil-unspecified`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| TADALAFIL 10 mg | VitaScripts Pharmacy | 0.5 | 15 | 15.875 | **19** | 3.5 | 18.42 |
| Tadalafil 5mg/Vardenafil HCl 5mg/Vit D3 2000IU/Vit K2 1mg (GUM) | Epiq Scripts | 26.25 | 2 | 47.9375 | **49** | 20.75 | 42.35 |

### Tretinoin / Skin — Unspecified (`tretinoin-unspecified`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| TRETINOIN 0.15% | Vios | 25.5 | 30 | 74.625 | **79** | 23.5 | 29.75 |
| HYALURONIC/NIACINAMIDE/TRETINOIN 0.5/4/0.025% | Vios | 54 | 30 | 124.5 | **129** | 45 | 34.88 |
| FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.25/5/0.01 % | Vios | 35 | 30 | 91.25 | **89** | 24 | 26.97 |
| FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.25/5/0.03 % | Vios | 35 | 30 | 91.25 | **89** | 24 | 26.97 |
| FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.5/5/0.01 % | Vios | 35 | 30 | 91.25 | **89** | 24 | 26.97 |

### Testosterone / HRT — Injection (`hrt-testosteronehrt-injection-`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| TESTOSTERONE CYPIONATE (GRAPESEED OIL) 20 MG/ML (5 ML) | Optimal Balance Pharmacy | 23.75 | 20 | 61.5625 | **59** | 15.25 | 25.85 |
| TESTOSTERONE CYPIONATE (GRAPESEED OIL) 50 MG/ML (5 ML) | Optimal Balance Pharmacy | 23.75 | 20 | 61.5625 | **59** | 15.25 | 25.85 |
| TESTOSTERONE CYPIONATE (GRAPESEED OIL) 200 MG/ML (5 ML) | Optimal Balance Pharmacy | 25.5 | 20 | 64.625 | **69** | 23.5 | 34.06 |
| TESTOSTERONE CYPIONATE (MCT OIL) 200 MG/ML (5 ML) | Optimal Balance Pharmacy | 35 | 20 | 81.25 | **79** | 24 | 30.38 |
| TESTOSTERONE CYPIONATE INJECTION (CS) 200MG/ML 200MG/ML (10ML) | Optimal Balance Pharmacy | 37 | 20 | 84.75 | **89** | 32 | 35.96 |

### MOTS-C Injection (`motsc-injection`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| MOTS-C 2mg/mL (5ml) | Greenwich Pharmacy | 62 | 25 | 133.5 | **129** | 42 | 32.56 |
| MOTS-C 2mg/mL | Greenwich Pharmacy | 62 | 25 | 133.5 | **129** | 42 | 32.56 |
| MOTS-C/Tesamorelin 2mg/3mg/mL | Greenwich Pharmacy | 79 | 25 | 163.25 | **159** | 55 | 34.59 |

### PT-141 (Bremelanotide) Nasal Spray (`pt141-nasal`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| PT-141 (Bremelanotide) 1mg | St Luke | 3 | 30 | 35.25 | **39** | 6 | 15.38 |
| BREMELANOTIDE (PT-141) (PER ML) 10 MG/ML | Vios | 62 | 30 | 138.5 | **139** | 47 | 33.81 |
| BREMELANOTIDE (PT-141) (PER ML) 5MG/ML | Vios | 62 | 30 | 138.5 | **139** | 47 | 33.81 |

### Thymosin Alpha-1 Injection (`thymosin-a1-injection`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| Thymosin A-1 5mg/mL (5ml) | Greenwich Pharmacy | 77 | 30 | 164.75 | **169** | 62 | 36.69 |
| THYMOSIN ALPHA-1 3 MG/ML (5 ML) | Optimal Balance Pharmacy | 82 | 20 | 163.5 | **159** | 57 | 35.85 |

### Estradiol / HRT — Vaginal Cream (`hrt-estradiolhrt-vaginalcream-`)
| FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GP | GM% |
|---|---|---:|---:|---:|---:|---:|---:|
| ESTRADIOL TRANSDERMAL PATCH 0.025mg/hr 8 count | Valiant | 50 | 30 | 117.5 | **119** | 39 | 32.77 |
| ESTRADIOL TRANSDERMAL PATCH 0.0375mg/hr 8 count | Valiant | 55 | 30 | 126.25 | **129** | 44 | 34.11 |
| ESTRADIOL TRANSDERMAL PATCH 0.05mg/hr 8 count | Valiant | 60 | 30 | 135 | **139** | 49 | 35.25 |
| ESTRADIOL TRANSDERMAL PATCH 0.1mg/hr 8 count | Valiant | 70 | 30 | 152.5 | **149** | 49 | 32.89 |
| HRT Cream - 1 Ingredient (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) | St Luke | 25 | 30 | 73.75 | **69** | 14 | 20.29 |
| HRT Cream - 2 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) | St Luke | 28 | 30 | 79 | **79** | 21 | 26.58 |
| HRT Cream - 3 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) | St Luke | 35 | 30 | 91.25 | **89** | 24 | 26.97 |
| HRT Cream - 4 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) | St Luke | 40 | 30 | 100 | **99** | 29 | 29.29 |
| Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 1 Ingredient | St Luke | 1 | 30 | 31.75 | **29** | -2 | -6.9 |
| Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 2 Ingredients | St Luke | 1.5 | 30 | 32.625 | **29** | -2.5 | -8.62 |
| Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 3 Ingredients | St Luke | 2 | 30 | 33.5 | **29** | -3 | -10.34 |
| ESTRADIOL 0.5MG TABLET 0.5MG | Optimal Balance Pharmacy | 0.48 | 20 | 20.84 | **19** | -1.48 | -7.79 |
| ESTRADIOL 1 MG TABLET 1 MG | Optimal Balance Pharmacy | 0.48 | 20 | 20.84 | **19** | -1.48 | -7.79 |
| ESTRADIOL 2 MG TABLET 2 MG | Optimal Balance Pharmacy | 0.48 | 20 | 20.84 | **19** | -1.48 | -7.79 |
| ESTRADIOL CYPIONATE (MCT OIL) 10 MG/ML | Vios | 32 | 30 | 86 | **89** | 27 | 30.34 |

---

## MISSING_COST products

**Count:** 57

- Semaglutide Injection — 3-Month (Glycine) (LIVE_NOW)
- Semaglutide Oral / Sublingual — Starting / Low (FUTURE_HIDDEN)
- Semaglutide Injection — Any Dose (L-Carnitine) (FUTURE_HIDDEN)
- Semaglutide Weight Loss Plan – Semaglutide (Any Dose) (FUTURE_HIDDEN)
- Semaglutide Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply (FUTURE_HIDDEN)
- Semaglutide Weight Loss Plan – Semaglutide (High Dose / Maintenance) (FUTURE_HIDDEN)
- Semaglutide Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply (FUTURE_HIDDEN)
- Semaglutide Weight Loss Plan – Semaglutide (Low Dose) (FUTURE_HIDDEN)
- Semaglutide Weight Loss Plan – Semaglutide (Mid Dose) (FUTURE_HIDDEN)
- Semaglutide Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply (FUTURE_HIDDEN)
- Semaglutide Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply (FUTURE_HIDDEN)
- Semaglutide Injection — High (L-Carnitine) (FUTURE_HIDDEN)
- Semaglutide Injection — Mid (L-Carnitine) (FUTURE_HIDDEN)
- Semaglutide + Ondansetron (Nausea Support) (FUTURE_HIDDEN)
- Semaglutide Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Low: 1→2→4mg) (FUTURE_HIDDEN)
- Semaglutide Oral / Sublingual — High (FUTURE_HIDDEN)
- Semaglutide Oral / Sublingual — Mid (FUTURE_HIDDEN)
- Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan (FUTURE_HIDDEN)
- Orforglipron (Oral) — Any Dose (FUTURE_HIDDEN)
- Orforglipron (Oral) — High (FUTURE_HIDDEN)
- Orforglipron (Oral) — Mid (FUTURE_HIDDEN)
- Orforglipron (Oral) — Starting / Low (FUTURE_HIDDEN)
- Ozempic (Semaglutide) (FUTURE_HIDDEN)
- The Ultimate Semaglutide Stack (FUTURE_HIDDEN)
- Tirzepatide Injection — 3-Month (B12) (FUTURE_HIDDEN)
- Tirzepatide + Ondansetron (Nausea Support) (FUTURE_HIDDEN)
- Accelerate & Thrive (FUTURE_HIDDEN)
- Ivermectin — Capsule (FUTURE_HIDDEN)
- Ivermectin — Topical (FUTURE_HIDDEN)
- BPC-157 — Unspecified (FUTURE_HIDDEN)
- Testosterone / HRT — Unspecified (FUTURE_HIDDEN)
- GHK-Cu Injection (FUTURE_HIDDEN)
- Minoxidil / Hair — Unspecified (FUTURE_HIDDEN)
- Hair Loss – Dutasteride (Oral) (FUTURE_HIDDEN)
- Finasteride / Hair — Capsule (FUTURE_HIDDEN)
- Finasteride / Hair — Topical (FUTURE_HIDDEN)
- GHK-Cu — Unspecified (FUTURE_HIDDEN)
- Minoxidil / Hair — Capsule (FUTURE_HIDDEN)
- HRT Other — Unspecified (FUTURE_HIDDEN)
- IGF-1 LR3 — Unspecified (FUTURE_HIDDEN)
- Testosterone / HRT — Cream (FUTURE_HIDDEN)
- Testosterone / HRT — Troche (FUTURE_HIDDEN)
- HRT Other — Capsule (FUTURE_HIDDEN)
- Sermorelin — Injection (FUTURE_HIDDEN)
- Sermorelin — Troche (FUTURE_HIDDEN)
- Selank — Unspecified (FUTURE_HIDDEN)
- Pinealon — Unspecified (FUTURE_HIDDEN)
- Retatrutide — Unspecified (FUTURE_HIDDEN)
- TB-500 / Blends — Unspecified (FUTURE_HIDDEN)
- Glutathione — Capsule (FUTURE_HIDDEN)
- Glutathione — Topical (FUTURE_HIDDEN)
- NAD+ — Topical (FUTURE_HIDDEN)
- Progesterone / HRT — Cream (FUTURE_HIDDEN)
- Progesterone / HRT — Unspecified (FUTURE_HIDDEN)
- Scream Cream (FUTURE_HIDDEN)
- Oxytocin — Unspecified (FUTURE_HIDDEN)
- Oxytocin — Nasal Spray (FUTURE_HIDDEN)

---

## FUTURE_HIDDEN — authoritative single-basis (pricing ready)

| PRODUCT | FORMULATION | PHARMACY | AT-COST | SHIP | RAW | FINAL $X9 | GEN $ | CHANGE? | GP | GM% |
|---|---|---|---:|---:|---:|---:|---:|:---:|---:|---:|
| Semaglutide Injection — Starting / Low (L-Carnitine) | SEMAGLUTIDE/L-CARNITINE (2ML) 2mg/100mg/ml | Vios | 50 | 30 | 117.5 | **119** | — |  | 39 | 32.77 |
| Semaglutide/B12 (6 Months) | SEMAGLUTIDE/B12 0.6 MG/ 500 MCG/ML (2 ML) | Optimal Balance Pharmacy | 62 | 20 | 128.5 | **129** | — |  | 47 | 36.43 |
| Semaglutide/B12/Glycine | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 50 | 5 | 92.5 | **89** | — |  | 34 | 38.2 |
| Tirzepatide Injection — 3-Month (Glycine) | TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) (3 PACK)) | Dirx-Hub | 225 | 30 | 423.75 | **419** | — |  | 164 | 39.14 |
| Tirzepatide Injection — B12+Glycine (ambiguous) | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | Dirx-Hub | 65 | 5 | 118.75 | **119** | — |  | 49 | 41.18 |
| Tirzepatide Injection — Starting / Low (L-Carnitine) | TIRZEPATIDE/L-CARNITINE (1ML) 10mg/100mg/ml | Vios | 70 | 30 | 152.5 | **149** | — |  | 49 | 32.89 |
| Tirzepatide Injection — Starting / Low (Niacinamide) | TIRZEPATIDE/NIACINAMIDE (68MG/8MG/4ML) 17mg/2mg/ml | Vios | 180 | 30 | 345 | **349** | — |  | 139 | 39.83 |
| 5-Amino Injectable | 5-Amino capsules 50mg | Greenwich Pharmacy | 2.6 | 25 | 29.55 | **29** | — |  | 1.4 | 4.83 |
| 5-Amino-1MQ Injection | 5-AMINO-1MQ 5 MG/ML (5 ML) | Optimal Balance Pharmacy | 77 | 20 | 154.75 | **159** | — |  | 62 | 38.99 |
| BPC-157 — Unspecified | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL (5ml) | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | 189 | YES | 57 | 35.85 |
| DSIP Injection | DSIP 1mg/mL (5ml) | Greenwich Pharmacy | 62 | 25 | 133.5 | **129** | — |  | 42 | 32.56 |
| CJC-1295 / Ipamorelin Injection | DSIP/BPC/CJC 1mg/2mg/2mg (5ml) | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | — |  | 57 | 35.85 |
| Epithalon Injection | Epithalon 2mg/mL (5ml) | Greenwich Pharmacy | 62 | 25 | 133.5 | **129** | — |  | 42 | 32.56 |
| Finasteride / Hair — Unspecified | FINASTERIDE 1 mg | VitaScripts Pharmacy | 0.5 | 15 | 15.875 | **19** | — |  | 3.5 | 18.42 |
| GHK-Cu / Epithalon Injection | GHK-CU/ EPITHALON 10 MG/ 2 MG/ML (5 ML) | Optimal Balance Pharmacy | 82 | 20 | 163.5 | **159** | — |  | 57 | 35.85 |
| Minoxidil / Hair — Topical | MINOXIDIL 2% | Vios | 1.28 | 30 | 32.24 | **29** | — |  | -2.28 | -7.86 |
| IGF-1 LR3 — Unspecified | IGF-LR3 200mcg/mL (5ml) | Greenwich Pharmacy | 62 | 25 | 133.5 | **129** | — |  | 42 | 32.56 |
| Ivermectin — Capsule | Ivermectin 18mg | St Luke | 2 | 30 | 33.5 | **29** | — |  | -3 | -10.34 |
| Liraglutide — Unspecified | LIRAGLUTIDE 6mg 5ml | Valiant | 100 | 30 | 205 | **209** | — |  | 79 | 37.8 |
| LL-37 Injection | LL-37 2MG/ML (5ml) | Greenwich Pharmacy | 62 | 25 | 133.5 | **129** | — |  | 42 | 32.56 |
| NAD+ Nasal Spray | NAD+ 50mg/ml | St Luke | 30 | 30 | 82.5 | **79** | — |  | 19 | 24.05 |
| NAD+ (Injectable) | NAD+ 50mg/ml | St Luke | 30 | 30 | 82.5 | **79** | — |  | 19 | 24.05 |
| NAD+ Injection | NAD+ (Nicotinamide Adenine Dinucleotide) 200mg/ml | St Luke | 64 | 30 | 142 | **139** | — |  | 45 | 32.37 |
| NAD+ — Topical | METHYLENE BLUE ANTI-AGING (30 ML) | Optimal Balance Pharmacy | 52 | 20 | 111 | **109** | — |  | 37 | 33.94 |
| Selank — Unspecified | Pinealon/PE22-28/Selank 2MG/2MG/ML (5ml) | Greenwich Pharmacy | 77 | 25 | 159.75 | **159** | — |  | 57 | 35.85 |
| Pregnyl - HCG (Merck) | HCG LYO (PREGNYL) 10,000 IU | Optimal Balance Pharmacy | 40.8 | 20 | 91.4 | **89** | — |  | 28.2 | 31.69 |
| Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone | SCREAM CREAM (THEOPHYLLINE/L-ARGININE/SILDENAFIL/TESTOSTERONE 30MG/60MG/20MG/11MG/GM (3%/6%/2%/1.1%) | Vios | 55.25 | 30 | 126.6875 | **129** | — |  | 43.75 | 33.91 |
| Semax — Unspecified | Semax 2.5mg/mL Nasal Spray | Greenwich Pharmacy | 60 | 25 | 130 | **129** | — |  | 44 | 34.11 |
| Sermorelin — Troche | SERMORELIN ACETATE (TROCHE) 1 MG | Vios | 0.85 | 30 | 31.4875 | **29** | — |  | -1.85 | -6.38 |
| Sildenafil (3 Month) | Scream Cream (Pentoxifylline/Arginine HCl/Sildenafil) 3/6/2% | St Luke | 45 | 30 | 108.75 | **109** | — |  | 34 | 31.19 |
| Sildenafil (6 Month) | Scream Cream (Pentoxifylline/Arginine HCl/Sildenafil) 3/6/2% | St Luke | 45 | 30 | 108.75 | **109** | — |  | 34 | 31.19 |
| SS-31 (Elamipretide) Mitochondrial Protection Protocol | ELAMIPRETIDE (SS-31) 15 MG/ML (5 ML) | Optimal Balance Pharmacy | 82 | 20 | 163.5 | **159** | — |  | 57 | 35.85 |
| TB-500 / Blends — Unspecified | TB-500 3MG/ML (5ml) | Greenwich Pharmacy | 62 | 25 | 133.5 | **129** | — |  | 42 | 32.56 |
| Oxytocin — Capsule | Bella Lipo (Bupropion HCl/Caffeine/Oxytocin/Topiramate/Naltrexone HCl/Methylcobalamin) 65mg/20mg/100IU/15mg/8mg/1mg | St Luke | 1.5 | 30 | 32.625 | **29** | — |  | -2.5 | -8.62 |
| Trimix T106 (Papaverine +Phentolamine +PGE) | SB4 TRIMIX PGE, Papaverine, Phentolamine  40mcg/30mg/3mg 2.5ml | Valiant | 85 | 30 | 178.75 | **179** | — |  | 64 | 35.75 |
| Vardenafil — Unspecified | VARDENAFIL 20 MG | Optimal Balance Pharmacy | 3.95 | 20 | 26.9125 | **29** | — |  | 5.05 | 17.41 |
| Glutathione — Injection | Glutathione 200mg/ml | St Luke | 15 | 30 | 56.25 | **59** | — |  | 14 | 23.73 |

FUTURE_HIDDEN multi/missing details: see JSON (`pricingRows` / `productMeta`). Total FUTURE_HIDDEN products: 111; pricing ready: 37.

---

## Status gates

- **GEN MODIFIED:** NO
- **GEN WRITES:** 0
- **WEBSITE MODIFIED:** NO
- **GEN/WHOP CUTOVER:** OFF

**STOP FOR FINAL OWNER REVIEW.** Do not run GEN-CATALOG-2 until cleared.
