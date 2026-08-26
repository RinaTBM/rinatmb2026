# MBM Full Catalog Pricing Audit

**Audit:** `MBM-FULL-CATALOG-PRICING-AUDIT-1`  
**Mode:** READ-ONLY analysis; no implementation.  
**Generated:** 2026-08-26  

## Executive decision

**Recommendation: CONDITIONAL HYBRID pending missing inputs.** Keep owner-set memberships unchanged. The current numbers support evaluating Model B (or a minimum-margin floor) for weak, shipping-heavy packages, but they do not support a final blanket decision without target margin, sales mix, demand sensitivity, provider, processor, carrier, and operating costs. Do not price rows with unresolved quantity/source conflicts.

Why:

- Model A average raw gross margin: **35.63%** across **62** complete unique medication packages.
- Model B average raw gross margin: **42.37%**.
- Model A lowest: **Glutathione 200mg/ml — 20.00%**.
- **12** complete packages are below 30% under Model A before provider, payment, carrier, and operating costs.
- Model B suggested changes versus Model A suggested prices: **3** unchanged, **22** increase ≤$10, **23** increase $11–$20, **14** increase >$20.
- High-dose TIR would rise by $30 under clean Model B rounding; a blanket change should not be approved until missing commercial and operating inputs are supplied.

## Authority and caveats

- **Cost/pharmacy/shipping authority:** `docs/MBM_FINAL_PATIENT_PRODUCT_ARCHITECTURE.json`, embedding `MyBareMethod_FINAL_GEN.xlsx` (generated 2026-08-24; live-map lock 2026-08-24).
- **Website retail:** runtime `src/data/products.ts` at merged commit `41e733a`.
- **Tagada retail:** `src/lib/payments/launchReadyKashuMap.ts`, `docs/kashu-sku-map-seed.json`, and membership billing constants.
- No alternative pharmacy was substituted. No missing quantity, pharmacy, formulation, shipping, or cost was invented.
- **45** selected formulary records have incomplete customer-package economics: 42 per-unit/per-each/per-mL quantity gaps plus 3 source strength/package conflicts. Source cost is retained, but package model retail/profit/margin is null and excluded from aggregates.
- Model averages are unweighted across complete unique packages. They are not sales-weighted and exclude memberships, services, accessories, payment fees, provider costs, carrier costs, and operating overhead.
- Coverage normalization: 121 assigned unique Excel rows collapse to 102 unique monthly product/package/economics records because 19 repeated workbook copies occur inside the same architecture products. Five distinct three-month commercial packages are then added under the locked ×3 rule. Eleven separately listed duplicate workbook copies and four excluded rows are not double-counted.

## Owner summary

| Metric | Result |
|---|---:|
| Total products/packages audited | **148** |
| Full complete-package cost data | **62** |
| Missing/ambiguous cost data | **84** |
| Current prices match Model A | **24** |
| Current prices close to Model A | **1** |
| Current prices below Model A | **0** |
| Current prices above Model A | **2** |
| Website/Tagada price mismatches | **0** |
| Model A average raw gross margin | **35.63%** |
| Model B average raw gross margin | **42.37%** |
| Model A average suggested-price gross margin | **35.42%** |
| Model B average suggested-price gross margin | **43.04%** |
| Model A lowest-margin item | Glutathione 200mg/ml / **20.00%** |
| Model B lowest-margin item | Glutathione 200mg/ml / **25.00%** |

Count definition: 107 selected formulary commercial packages (102 monthly + 5 three-month) + 16 unresolved medication catalog entries + 2 memberships + 4 provider services + 19 accessory variants = 148. “Missing/ambiguous non-membership cost basis” includes 45 incomplete selected packages, 16 unresolved medications, and 23 services/accessories without approved at-cost data. Membership operating-cost gaps are listed separately.

## Calculation rules

```text
Total MBM cost = at cost + pharmacy shipping
Model A raw retail = (at cost × 1.75) + pharmacy shipping
Model B raw retail = (at cost × 2.00) + pharmacy shipping
Gross profit = raw retail − total MBM cost
Gross margin = gross profit / raw retail
```

Suggested monthly prices use nearest whole-dollar `$X9`, ties up. Locked multi-month pricing rounds the monthly customer price first, multiplies by months, then rounds to `$X9` again. Suggestions are suppressed when customer-package quantity or source strength/package is unresolved.

## GLP-1 one-time ladders

### Semaglutide

Current: **$89 / $99 / $109 / $109 / $109 / $109 / $119 / $119**  
Model B suggested: **$109 / $119 / $119 / $119 / $129 / $129 / $139 / $139**

| Formulation | Weekly dose | Monthly mg | Vial | Cost | Ship | Total cost | Website | Tagada | A raw | A suggested | A profit | A margin | B raw | B suggested | B profit | B margin | Δ profit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Vitamin B12 | 0.25 mg | 1 | 1 mg vial | $50 | $5 | $55 | $89 | $89 | $92.50 | $89 | $37.50 | 40.5% | $105 | $109 | $50 | 47.6% | $12.50 |
| Vitamin B12 | 0.5 mg | 2 | 2 mg vial | $55 | $5 | $60 | $99 | $99 | $101.25 | $99 | $41.25 | 40.7% | $115 | $119 | $55 | 47.8% | $13.75 |
| Vitamin B12 | 0.75 mg | 3 | 4 mg vial | $58 | $5 | $63 | $109 | $109 | $106.50 | $109 | $43.50 | 40.9% | $121 | $119 | $58 | 47.9% | $14.50 |
| Vitamin B12 | 1 mg | 4 | 4 mg vial | $58 | $5 | $63 | $109 | $109 | $106.50 | $109 | $43.50 | 40.9% | $121 | $119 | $58 | 47.9% | $14.50 |
| Vitamin B12 | 1.25 mg | 5 | 6 mg vial | $60 | $5 | $65 | $109 | $109 | $110 | $109 | $45 | 40.9% | $125 | $129 | $60 | 48.0% | $15 |
| Vitamin B12 | 1.5 mg | 6 | 6 mg vial | $60 | $5 | $65 | $109 | $109 | $110 | $109 | $45 | 40.9% | $125 | $129 | $60 | 48.0% | $15 |
| Vitamin B12 | 1.75 mg | 7 | 10 mg vial | $65 | $5 | $70 | $119 | $119 | $118.75 | $119 | $48.75 | 41.0% | $135 | $139 | $65 | 48.1% | $16.25 |
| Vitamin B12 | 2 mg | 8 | 10 mg vial | $65 | $5 | $70 | $119 | $119 | $118.75 | $119 | $48.75 | 41.0% | $135 | $139 | $65 | 48.1% | $16.25 |
| Glycine | 0.25 mg | 1 | 1 mg vial | $50 | $5 | $55 | $89 | $89 | $92.50 | $89 | $37.50 | 40.5% | $105 | $109 | $50 | 47.6% | $12.50 |
| Glycine | 0.5 mg | 2 | 2 mg vial | $55 | $5 | $60 | $99 | $99 | $101.25 | $99 | $41.25 | 40.7% | $115 | $119 | $55 | 47.8% | $13.75 |
| Glycine | 0.75 mg | 3 | 4 mg vial | $58 | $5 | $63 | $109 | $109 | $106.50 | $109 | $43.50 | 40.9% | $121 | $119 | $58 | 47.9% | $14.50 |
| Glycine | 1 mg | 4 | 4 mg vial | $58 | $5 | $63 | $109 | $109 | $106.50 | $109 | $43.50 | 40.9% | $121 | $119 | $58 | 47.9% | $14.50 |
| Glycine | 1.25 mg | 5 | 6 mg vial | $60 | $5 | $65 | $109 | $109 | $110 | $109 | $45 | 40.9% | $125 | $129 | $60 | 48.0% | $15 |
| Glycine | 1.5 mg | 6 | 6 mg vial | $60 | $5 | $65 | $109 | $109 | $110 | $109 | $45 | 40.9% | $125 | $129 | $60 | 48.0% | $15 |
| Glycine | 1.75 mg | 7 | 10 mg vial | $65 | $5 | $70 | $119 | $119 | $118.75 | $119 | $48.75 | 41.0% | $135 | $139 | $65 | 48.1% | $16.25 |
| Glycine | 2 mg | 8 | 10 mg vial | $65 | $5 | $70 | $119 | $119 | $118.75 | $119 | $48.75 | 41.0% | $135 | $139 | $65 | 48.1% | $16.25 |

All current SEM B12/Glycine dose prices conform to Model A. Matching formulations have identical economics.

### Tirzepatide

Current: **$119 / $139 / $149 / $159 / $169 / $179**  
Model B suggested: **$139 / $159 / $179 / $189 / $199 / $209**

| Formulation | Weekly dose | Monthly mg | Vial | Cost | Ship | Total cost | Website | Tagada | A raw | A suggested | A profit | A margin | B raw | B suggested | B profit | B margin | Δ profit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Vitamin B12 | 2.5 mg | 10 | 10 mg vial | $65 | $5 | $70 | $119 | $119 | $118.75 | $119 | $48.75 | 41.0% | $135 | $139 | $65 | 48.1% | $16.25 |
| Vitamin B12 | 5 mg | 20 | 20 mg vial | $75 | $5 | $80 | $139 | $139 | $136.25 | $139 | $56.25 | 41.3% | $155 | $159 | $75 | 48.4% | $18.75 |
| Vitamin B12 | 7.5 mg | 30 | 30 mg vial | $85 | $5 | $90 | $149 | $149 | $153.75 | $149 | $63.75 | 41.5% | $175 | $179 | $85 | 48.6% | $21.25 |
| Vitamin B12 | 10 mg | 40 | 40 mg vial | $90 | $5 | $95 | $159 | $159 | $162.50 | $159 | $67.50 | 41.5% | $185 | $189 | $90 | 48.6% | $22.50 |
| Vitamin B12 | 12.5 mg | 50 | 50 mg vial | $95 | $5 | $100 | $169 | $169 | $171.25 | $169 | $71.25 | 41.6% | $195 | $199 | $95 | 48.7% | $23.75 |
| Vitamin B12 | 15 mg | 60 | 60 mg vial | $100 | $5 | $105 | $179 | $179 | $180 | $179 | $75 | 41.7% | $205 | $209 | $100 | 48.8% | $25 |
| Glycine | 2.5 mg | 10 | 10 mg vial | $65 | $5 | $70 | $119 | $119 | $118.75 | $119 | $48.75 | 41.0% | $135 | $139 | $65 | 48.1% | $16.25 |
| Glycine | 5 mg | 20 | 20 mg vial | $75 | $5 | $80 | $139 | $139 | $136.25 | $139 | $56.25 | 41.3% | $155 | $159 | $75 | 48.4% | $18.75 |
| Glycine | 7.5 mg | 30 | 30 mg vial | $85 | $5 | $90 | $149 | $149 | $153.75 | $149 | $63.75 | 41.5% | $175 | $179 | $85 | 48.6% | $21.25 |
| Glycine | 10 mg | 40 | 40 mg vial | $90 | $5 | $95 | $159 | $159 | $162.50 | $159 | $67.50 | 41.5% | $185 | $189 | $90 | 48.6% | $22.50 |
| Glycine | 12.5 mg | 50 | 50 mg vial | $95 | $5 | $100 | $169 | $169 | $171.25 | $169 | $71.25 | 41.6% | $195 | $199 | $95 | 48.7% | $23.75 |
| Glycine | 15 mg | 60 | 60 mg vial | $100 | $5 | $105 | $179 | $179 | $180 | $179 | $75 | 41.7% | $205 | $209 | $100 | 48.8% | $25 |

All current TIR B12/Glycine dose prices conform to Model A. Matching formulations have identical economics.

## Membership economics (unchanged)

### Website ↔ Tagada recurring-price parity

| Program / SKU | Website base | Tagada base / price ID | Two-Day website / Tagada | Next-Day website / Tagada | Parity |
|---|---:|---|---|---|---|
| Semaglutide / `MBM-MEM-SEM-MEM-001` | $149 | $149 / `price_344d3dacb4ab` | $179 / $179 (`price_41179f7cafe2`) | $199 / $199 (`price_7ce0f74a7509`) | PASS |
| Tirzepatide / `MBM-MEM-TIR-MEM-001` | $275 | $275 / `price_2d2dd07b2f73` | $305 / $305 (`price_94c92b6e5749`) | $325 / $325 (`price_d6941e334598`) | PASS |

Membership figures below are **partial medication-only economics**. Base margins omit provider, Tagada/payment, carrier, and operating costs. Combo margins also omit the actual carrier cost, so they are not true gross margins.

### Semaglutide — $149 base / $179 Two-Day / $199 Next-Day

| Formulation | Dose | Vial | Medication cost | Pharmacy ship | Fulfillment cost | Base revenue | Base remaining / margin | Two-Day partial remaining / margin* | Next-Day partial remaining / margin* |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Vitamin B12 | 0.25 mg | 1 mg vial | $50 | $5 | $55 | $149 | **$94 / 63.1%** | $124 / 69.3% | $144 / 72.4% |
| Vitamin B12 | 0.5 mg | 2 mg vial | $55 | $5 | $60 | $149 | **$89 / 59.7%** | $119 / 66.5% | $139 / 69.8% |
| Vitamin B12 | 0.75 mg | 4 mg vial | $58 | $5 | $63 | $149 | **$86 / 57.7%** | $116 / 64.8% | $136 / 68.3% |
| Vitamin B12 | 1 mg | 4 mg vial | $58 | $5 | $63 | $149 | **$86 / 57.7%** | $116 / 64.8% | $136 / 68.3% |
| Vitamin B12 | 1.25 mg | 6 mg vial | $60 | $5 | $65 | $149 | **$84 / 56.4%** | $114 / 63.7% | $134 / 67.3% |
| Vitamin B12 | 1.5 mg | 6 mg vial | $60 | $5 | $65 | $149 | **$84 / 56.4%** | $114 / 63.7% | $134 / 67.3% |
| Vitamin B12 | 1.75 mg | 10 mg vial | $65 | $5 | $70 | $149 | **$79 / 53.0%** | $109 / 60.9% | $129 / 64.8% |
| Vitamin B12 | 2 mg | 10 mg vial | $65 | $5 | $70 | $149 | **$79 / 53.0%** | $109 / 60.9% | $129 / 64.8% |
| Glycine | 0.25 mg | 1 mg vial | $50 | $5 | $55 | $149 | **$94 / 63.1%** | $124 / 69.3% | $144 / 72.4% |
| Glycine | 0.5 mg | 2 mg vial | $55 | $5 | $60 | $149 | **$89 / 59.7%** | $119 / 66.5% | $139 / 69.8% |
| Glycine | 0.75 mg | 4 mg vial | $58 | $5 | $63 | $149 | **$86 / 57.7%** | $116 / 64.8% | $136 / 68.3% |
| Glycine | 1 mg | 4 mg vial | $58 | $5 | $63 | $149 | **$86 / 57.7%** | $116 / 64.8% | $136 / 68.3% |
| Glycine | 1.25 mg | 6 mg vial | $60 | $5 | $65 | $149 | **$84 / 56.4%** | $114 / 63.7% | $134 / 67.3% |
| Glycine | 1.5 mg | 6 mg vial | $60 | $5 | $65 | $149 | **$84 / 56.4%** | $114 / 63.7% | $134 / 67.3% |
| Glycine | 1.75 mg | 10 mg vial | $65 | $5 | $70 | $149 | **$79 / 53.0%** | $109 / 60.9% | $129 / 64.8% |
| Glycine | 2 mg | 10 mg vial | $65 | $5 | $70 | $149 | **$79 / 53.0%** | $109 / 60.9% | $129 / 64.8% |

**Lowest SEM margin:** 1.75 mg or 2 mg (B12 or Glycine), **$79 remaining / 53.02%** before undocumented costs.

### Tirzepatide — $275 base / $305 Two-Day / $325 Next-Day

| Formulation | Dose | Vial | Medication cost | Pharmacy ship | Fulfillment cost | Base revenue | Base remaining / margin | Two-Day partial remaining / margin* | Next-Day partial remaining / margin* |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Vitamin B12 | 2.5 mg | 10 mg vial | $65 | $5 | $70 | $275 | **$205 / 74.5%** | $235 / 77.0% | $255 / 78.5% |
| Vitamin B12 | 5 mg | 20 mg vial | $75 | $5 | $80 | $275 | **$195 / 70.9%** | $225 / 73.8% | $245 / 75.4% |
| Vitamin B12 | 7.5 mg | 30 mg vial | $85 | $5 | $90 | $275 | **$185 / 67.3%** | $215 / 70.5% | $235 / 72.3% |
| Vitamin B12 | 10 mg | 40 mg vial | $90 | $5 | $95 | $275 | **$180 / 65.5%** | $210 / 68.8% | $230 / 70.8% |
| Vitamin B12 | 12.5 mg | 50 mg vial | $95 | $5 | $100 | $275 | **$175 / 63.6%** | $205 / 67.2% | $225 / 69.2% |
| Vitamin B12 | 15 mg | 60 mg vial | $100 | $5 | $105 | $275 | **$170 / 61.8%** | $200 / 65.6% | $220 / 67.7% |
| Glycine | 2.5 mg | 10 mg vial | $65 | $5 | $70 | $275 | **$205 / 74.5%** | $235 / 77.0% | $255 / 78.5% |
| Glycine | 5 mg | 20 mg vial | $75 | $5 | $80 | $275 | **$195 / 70.9%** | $225 / 73.8% | $245 / 75.4% |
| Glycine | 7.5 mg | 30 mg vial | $85 | $5 | $90 | $275 | **$185 / 67.3%** | $215 / 70.5% | $235 / 72.3% |
| Glycine | 10 mg | 40 mg vial | $90 | $5 | $95 | $275 | **$180 / 65.5%** | $210 / 68.8% | $230 / 70.8% |
| Glycine | 12.5 mg | 50 mg vial | $95 | $5 | $100 | $275 | **$175 / 63.6%** | $205 / 67.2% | $225 / 69.2% |
| Glycine | 15 mg | 60 mg vial | $100 | $5 | $105 | $275 | **$170 / 61.8%** | $200 / 65.6% | $220 / 67.7% |

**Lowest TIR margin:** 15 mg (B12 or Glycine), **$170 remaining / 61.82%** before undocumented costs.

*Combo partial margin subtracts documented medication + pharmacy shipping only. It does not subtract actual Two-Day/Next-Day carrier cost, provider cost, payment fees, or operations.

**Membership cost gaps (4):** provider cost, payment-processing fee, actual customer-shipping carrier cost, and operating overhead. True membership gross margin is therefore unresolved.

## Complete selected formulary package audit

`†` = customer-package economics incomplete. `Needed` states whether dispense quantity or corrected source strength/package is required. Model price/profit/margin fields remain blank rather than applying one unit plus one shipment as though it were a customer package.

### Weight Management

| Product / exact package | Form | Pharmacy | Cost | Ship | Total | Website | Tagada | A raw (profit / margin) | A suggested (profit / margin) | B raw (profit / margin) | B suggested (profit / margin) | Δ raw profit | Needed | Class |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Semaglutide Injection — 3-Month (B12) — SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) — 3-month commercial package (3 monthly fills) (1mg/0.5mg/mL; 3 × 1mL) | Injection / Vial | Dirx-Hub | $150 | $15 | $165 | — | — | $277.50 ($112.50 / 40.5%) | $269 ($104 / 38.7%) | $315 ($150 / 47.6%) | $329 ($164 / 49.9%) | $37.50 | — | `PRICE_SOURCE_UNCLEAR` |
| Semaglutide Injection — 3-Month (B12) — SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) — 3-month commercial package (3 monthly fills) (2mg/0.5mg/mL; 3 × 1mL) | Injection / Vial | Dirx-Hub | $165 | $15 | $180 | — | — | $303.75 ($123.75 / 40.7%) | $299 ($119 / 39.8%) | $345 ($165 / 47.8%) | $359 ($179 / 49.9%) | $41.25 | — | `PRICE_SOURCE_UNCLEAR` |
| Semaglutide Injection — 3-Month (B12) — SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) — 3-month commercial package (3 monthly fills) (4mg/0.5mg/mL; 3 × 1mL) | Injection / Vial | Dirx-Hub | $174 | $15 | $189 | — | — | $319.50 ($130.50 / 40.9%) | $329 ($140 / 42.5%) | $363 ($174 / 47.9%) | $359 ($170 / 47.4%) | $43.50 | — | `PRICE_SOURCE_UNCLEAR` |
| Semaglutide Injection — 3-Month (B12) — SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) — 3-month commercial package (3 monthly fills) (6mg/0.5mg/mL; 3 × 1mL) | Injection / Vial | Dirx-Hub | $180 | $15 | $195 | — | — | $330 ($135 / 40.9%) | $329 ($134 / 40.7%) | $375 ($180 / 48.0%) | $389 ($194 / 49.9%) | $45 | — | `PRICE_SOURCE_UNCLEAR` |
| Semaglutide Injection — 3-Month (B12) — SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) — 3-month commercial package (3 monthly fills) (10mg/0.5mg/mL; 3 × 1mL) | Injection / Vial | Dirx-Hub | $195 | $15 | $210 | — | — | $356.25 ($146.25 / 41.0%) | $359 ($149 / 41.5%) | $405 ($195 / 48.1%) | $419 ($209 / 49.9%) | $48.75 | — | `PRICE_SOURCE_UNCLEAR` |
| Semaglutide Injection — High (B12) — SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) (6mg/0.5mg/mL; 1mL) | Injection / Vial | Dirx-Hub | $60 | $5 | $65 | $109 | $109 | $110 ($45 / 40.9%) | $109 ($44 / 40.4%) | $125 ($60 / 48.0%) | $129 ($64 / 49.6%) | $15 | — | `MATCHES_MODEL_A` |
| Semaglutide Injection — High (B12) — SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (10mg/0.5mg/mL; 1mL) | Injection / Vial | Dirx-Hub | $65 | $5 | $70 | $119 | $119 | $118.75 ($48.75 / 41.0%) | $119 ($49 / 41.2%) | $135 ($65 / 48.1%) | $139 ($69 / 49.6%) | $16.25 | — | `MATCHES_MODEL_A` |
| Semaglutide Injection — High (Glycine) — SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) (6mg/0.5mg/mL; 1mL) | Injection / Vial | Dirx-Hub | $60 | $5 | $65 | $109 | $109 | $110 ($45 / 40.9%) | $109 ($44 / 40.4%) | $125 ($60 / 48.0%) | $129 ($64 / 49.6%) | $15 | — | `MATCHES_MODEL_A` |
| Semaglutide Injection — High (Glycine) — SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) (10mg/0.5mg/mL; 1mL) | Injection / Vial | Dirx-Hub | $65 | $5 | $70 | $119 | $119 | $118.75 ($48.75 / 41.0%) | $119 ($49 / 41.2%) | $135 ($65 / 48.1%) | $139 ($69 / 49.6%) | $16.25 | — | `MATCHES_MODEL_A` |
| Semaglutide Injection — Mid (B12) — SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) (4mg/0.5mg/mL; 1mL) | Injection / Vial | Dirx-Hub | $58 | $5 | $63 | $109 | $109 | $106.50 ($43.50 / 40.9%) | $109 ($46 / 42.2%) | $121 ($58 / 47.9%) | $119 ($56 / 47.1%) | $14.50 | — | `MATCHES_MODEL_A` |
| Semaglutide Injection — Mid (Glycine) — SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) (4mg/0.5mg/mL; 1mL) | Injection / Vial | Dirx-Hub | $58 | $5 | $63 | $109 | $109 | $106.50 ($43.50 / 40.9%) | $109 ($46 / 42.2%) | $121 ($58 / 47.9%) | $119 ($56 / 47.1%) | $14.50 | — | `MATCHES_MODEL_A` |
| Semaglutide Injection — Starting / Low (B12) — SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) (1mg/0.5mg/mL; 1mL) | Injection / Vial | Dirx-Hub | $50 | $5 | $55 | $89 | $89 | $92.50 ($37.50 / 40.5%) | $89 ($34 / 38.2%) | $105 ($50 / 47.6%) | $109 ($54 / 49.5%) | $12.50 | — | `MATCHES_MODEL_A` |
| Semaglutide Injection — Starting / Low (B12) — SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) (2mg/0.5mg/mL; 1mL) | Injection / Vial | Dirx-Hub | $55 | $5 | $60 | $99 | $99 | $101.25 ($41.25 / 40.7%) | $99 ($39 / 39.4%) | $115 ($55 / 47.8%) | $119 ($59 / 49.6%) | $13.75 | — | `MATCHES_MODEL_A` |
| Semaglutide Injection — Starting / Low (Glycine) — SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) (1mg/0.5mg/mL; 1mL) | Injection / Vial | Dirx-Hub | $50 | $5 | $55 | $89 | $89 | $92.50 ($37.50 / 40.5%) | $89 ($34 / 38.2%) | $105 ($50 / 47.6%) | $109 ($54 / 49.5%) | $12.50 | — | `MATCHES_MODEL_A` |
| Semaglutide Injection — Starting / Low (Glycine) — SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) (2mg/0.5mg/mL; 1mL) | Injection / Vial | Dirx-Hub | $55 | $5 | $60 | $99 | $99 | $101.25 ($41.25 / 40.7%) | $99 ($39 / 39.4%) | $115 ($55 / 47.8%) | $119 ($59 / 49.6%) | $13.75 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — High (B12) — TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) (25mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $95 | $5 | $100 | $169 | $169 | $171.25 ($71.25 / 41.6%) | $169 ($69 / 40.8%) | $195 ($95 / 48.7%) | $199 ($99 / 49.8%) | $23.75 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — High (B12) — TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) (30mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $100 | $5 | $105 | $179 | $179 | $180 ($75 / 41.7%) | $179 ($74 / 41.3%) | $205 ($100 / 48.8%) | $209 ($104 / 49.8%) | $25 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — High (Glycine) — TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) (25mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $95 | $5 | $100 | $169 | $169 | $171.25 ($71.25 / 41.6%) | $169 ($69 / 40.8%) | $195 ($95 / 48.7%) | $199 ($99 / 49.8%) | $23.75 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — High (Glycine) — TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) (30mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $100 | $5 | $105 | $179 | $179 | $180 ($75 / 41.7%) | $179 ($74 / 41.3%) | $205 ($100 / 48.8%) | $209 ($104 / 49.8%) | $25 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — Mid (B12) — TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) (15mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $85 | $5 | $90 | $149 | $149 | $153.75 ($63.75 / 41.5%) | $149 ($59 / 39.6%) | $175 ($85 / 48.6%) | $179 ($89 / 49.7%) | $21.25 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — Mid (B12) — TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) (20mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $90 | $5 | $95 | $159 | $159 | $162.50 ($67.50 / 41.5%) | $159 ($64 / 40.2%) | $185 ($90 / 48.6%) | $189 ($94 / 49.7%) | $22.50 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — Mid (Glycine) — TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) (15mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $85 | $5 | $90 | $149 | $149 | $153.75 ($63.75 / 41.5%) | $149 ($59 / 39.6%) | $175 ($85 / 48.6%) | $179 ($89 / 49.7%) | $21.25 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — Mid (Glycine) — TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) (20mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $90 | $5 | $95 | $159 | $159 | $162.50 ($67.50 / 41.5%) | $159 ($64 / 40.2%) | $185 ($90 / 48.6%) | $189 ($94 / 49.7%) | $22.50 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — Starting / Low (B12) — TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) (5mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $65 | $5 | $70 | $119 | $119 | $118.75 ($48.75 / 41.0%) | $119 ($49 / 41.2%) | $135 ($65 / 48.1%) | $139 ($69 / 49.6%) | $16.25 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — Starting / Low (B12) — TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) (10mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $75 | $5 | $80 | $139 | $139 | $136.25 ($56.25 / 41.3%) | $139 ($59 / 42.5%) | $155 ($75 / 48.4%) | $159 ($79 / 49.7%) | $18.75 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — Starting / Low (Glycine) — TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) (5mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $65 | $5 | $70 | $119 | $119 | $118.75 ($48.75 / 41.0%) | $119 ($49 / 41.2%) | $135 ($65 / 48.1%) | $139 ($69 / 49.6%) | $16.25 | — | `MATCHES_MODEL_A` |
| Tirzepatide Injection — Starting / Low (Glycine) — TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) (10mg/0.5mg/mL; 2mL) | Injection / Vial | Dirx-Hub | $75 | $5 | $80 | $139 | $139 | $136.25 ($56.25 / 41.3%) | $139 ($59 / 42.5%) | $155 ($75 / 48.4%) | $159 ($79 / 49.7%) | $18.75 | — | `MATCHES_MODEL_A` |

### Women'S Hormone Therapy

| Product / exact package | Form | Pharmacy | Cost | Ship | Total | Website | Tagada | A raw (profit / margin) | A suggested (profit / margin) | B raw (profit / margin) | B suggested (profit / margin) | Δ raw profit | Needed | Class |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Custom HRT Cream — HRT Cream - 1 Ingredient (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) (—; 30gm) | Cream | St Luke | $25 | $30 | $55 | — | — | $73.75 ($18.75 / 25.4%) | $69 ($14 / 20.3%) | $80 ($25 / 31.2%) | $79 ($24 / 30.4%) | $6.25 | — | `PRICE_SOURCE_UNCLEAR` |
| Custom HRT Cream — HRT Cream - 2 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) (—; 30gm) | Cream | St Luke | $28 | $30 | $58 | — | — | $79 ($21 / 26.6%) | $79 ($21 / 26.6%) | $86 ($28 / 32.6%) | $89 ($31 / 34.8%) | $7 | — | `PRICE_SOURCE_UNCLEAR` |
| Custom HRT Cream — HRT Cream - 3 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) (—; 30gm) | Cream | St Luke | $35 | $30 | $65 | — | — | $91.25 ($26.25 / 28.8%) | $89 ($24 / 27.0%) | $100 ($35 / 35.0%) | $99 ($34 / 34.3%) | $8.75 | — | `PRICE_SOURCE_UNCLEAR` |
| Custom HRT Cream — HRT Cream - 4 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) (—; 30gm) | Cream | St Luke | $40 | $30 | $70 | — | — | $100 ($30 / 30.0%) | $99 ($29 / 29.3%) | $110 ($40 / 36.4%) | $109 ($39 / 35.8%) | $10 | — | `PRICE_SOURCE_UNCLEAR` |
| Custom Hormone Troche — Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 1 Ingredient (1 Ingredient; Each) † | Troche | St Luke | $1 | $30 | $31 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Custom Hormone Troche — Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 2 Ingredients (2 Ingredients; Each) † | Troche | St Luke | $1.50 | $30 | $31.50 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Custom Hormone Troche — Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 3 Ingredients (3 Ingredients; Each) † | Troche | St Luke | $2 | $30 | $32 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Estradiol Cypionate Injection — ESTRADIOL CYPIONATE (MCT OIL) 10 MG/ML (10 MG/ML; 3ml mg/ml) † | Injection | Vios | $32 | $30 | $62 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Correct source strength/package fields | `PRICE_SOURCE_UNCLEAR` |
| Estradiol Patch — ESTRADIOL TRANSDERMAL PATCH 0.025mg/hr 8 count (0.025mg/hr; package unspecified) | Patch | Valiant | $50 | $30 | $80 | $129 | $129 | $117.50 ($37.50 / 31.9%) | $119 ($39 / 32.8%) | $130 ($50 / 38.5%) | $129 ($49 / 38.0%) | $12.50 | — | `ABOVE_MODEL_A` |
| Estradiol Patch — ESTRADIOL TRANSDERMAL PATCH 0.0375mg/hr 8 count (0.0375mg/hr; package unspecified) | Patch | Valiant | $55 | $30 | $85 | — | — | $126.25 ($41.25 / 32.7%) | $129 ($44 / 34.1%) | $140 ($55 / 39.3%) | $139 ($54 / 38.9%) | $13.75 | — | `PRICE_SOURCE_UNCLEAR` |
| Estradiol Patch — ESTRADIOL TRANSDERMAL PATCH 0.05mg/hr 8 count (0.05mg/hr; package unspecified) | Patch | Valiant | $60 | $30 | $90 | $138.98 | $138.98 | $135 ($45 / 33.3%) | $139 ($49 / 35.2%) | $150 ($60 / 40.0%) | $149 ($59 / 39.6%) | $15 | — | `CLOSE_TO_MODEL_A` |
| Estradiol Patch — ESTRADIOL TRANSDERMAL PATCH 0.1mg/hr 8 count (0.1mg/hr; package unspecified) | Patch | Valiant | $70 | $30 | $100 | $149 | $149 | $152.50 ($52.50 / 34.4%) | $149 ($49 / 32.9%) | $170 ($70 / 41.2%) | $169 ($69 / 40.8%) | $17.50 | — | `MATCHES_MODEL_A` |
| Estradiol Tablet — ESTRADIOL 0.5MG TABLET 0.5MG (0.5MG; package unspecified) † | Tablet | Optimal Balance Pharmacy | $0.48 | $20 | $20.48 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Estradiol Tablet — ESTRADIOL 1 MG TABLET 1 MG (1 MG; package unspecified) † | Tablet | Optimal Balance Pharmacy | $0.48 | $20 | $20.48 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Estradiol Tablet — ESTRADIOL 2 MG TABLET 2 MG (2 MG; package unspecified) † | Tablet | Optimal Balance Pharmacy | $0.48 | $20 | $20.48 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Immediate Release) — PROGESTERONE 100MG CAPSULE 100mg (100mg; 1 mg) † | Capsule | Vios | $0.75 | $30 | $30.75 | $39 | $39 | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Immediate Release) — PROGESTERONE 200MG CAPSULE 200mg (200mg; 1 mg) † | Capsule | Vios | $0.75 | $30 | $30.75 | $59 | $59 | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Immediate Release) — PROGESTERONE 50MG CAPSULE 50mg (50mg; 1 mg) † | Capsule | Vios | $0.75 | $30 | $30.75 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Immediate Release) — PROGESTERONE IR 100 MG (100 MG; 1 each) † | Capsule | Vios | $0.85 | $30 | $30.85 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Immediate Release) — PROGESTERONE IR 150 MG (150 MG; 1 each) † | Capsule | Vios | $0.85 | $30 | $30.85 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Immediate Release) — PROGESTERONE IR 200 MG (200 MG; 1 each) † | Capsule | Vios | $0.85 | $30 | $30.85 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Immediate Release) — PROGESTERONE IR (DYE-FREE)(LACTOSE-FREE) (M NEW) 200MG (200MG; 1 each) † | Capsule | Vios | $0.85 | $30 | $30.85 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Immediate Release) — PROGESTERONE IR 300 MG (300 MG; 1 each) † | Capsule | Vios | $0.85 | $30 | $30.85 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Immediate Release) — PROGESTERONE IR 400 MG (400 MG; 1 each) † | Capsule | Vios | $0.85 | $30 | $30.85 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Sustained Release) — PROGESTERONE SR 100 MG (100 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.54 | $20 | $20.54 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Sustained Release) — PROGESTERONE SR 125 MG (125 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.54 | $20 | $20.54 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Sustained Release) — PROGESTERONE SR 150 MG (150 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.54 | $20 | $20.54 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Sustained Release) — PROGESTERONE SR 175 MG (175 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.54 | $20 | $20.54 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Sustained Release) — PROGESTERONE SR 200 MG (200 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.54 | $20 | $20.54 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Sustained Release) — PROGESTERONE SR 225 MG (225 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.54 | $20 | $20.54 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Sustained Release) — PROGESTERONE SR 25 MG (25 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.54 | $20 | $20.54 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Sustained Release) — PROGESTERONE SR 50 MG (50 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.54 | $20 | $20.54 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Sustained Release) — PROGESTERONE SR 75 MG (75 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.54 | $20 | $20.54 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Sustained Release) — PROGESTERONE SR 250 MG (250 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.67 | $20 | $20.67 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Progesterone Capsules (Sustained Release) — PROGESTERONE SR 300 MG (300 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.96 | $20 | $20.96 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Testosterone Cypionate Injection — TESTOSTERONE CYPIONATE (GRAPESEED OIL) 20 MG/ML (5 ML) (20 MG/ML (5 ML); 5 mL) | Injection | Optimal Balance Pharmacy | $23.75 | $20 | $43.75 | — | — | $61.56 ($17.81 / 28.9%) | $59 ($15.25 / 25.9%) | $67.50 ($23.75 / 35.2%) | $69 ($25.25 / 36.6%) | $5.94 | — | `PRICE_SOURCE_UNCLEAR` |
| Testosterone Cypionate Injection — TESTOSTERONE CYPIONATE (GRAPESEED OIL) 50 MG/ML (5 ML) (50 MG/ML (5 ML); 5 mL) | Injection | Optimal Balance Pharmacy | $23.75 | $20 | $43.75 | — | — | $61.56 ($17.81 / 28.9%) | $59 ($15.25 / 25.9%) | $67.50 ($23.75 / 35.2%) | $69 ($25.25 / 36.6%) | $5.94 | — | `PRICE_SOURCE_UNCLEAR` |
| Testosterone Cypionate Injection — TESTOSTERONE CYPIONATE (GRAPESEED OIL) 200 MG/ML (5 ML) (200 MG/ML (5 ML); 5 mL) | Injection | Optimal Balance Pharmacy | $25.50 | $20 | $45.50 | — | — | $64.62 ($19.12 / 29.6%) | $69 ($23.50 / 34.1%) | $71 ($25.50 / 35.9%) | $69 ($23.50 / 34.1%) | $6.38 | — | `PRICE_SOURCE_UNCLEAR` |
| Testosterone Cypionate Injection — TESTOSTERONE CYPIONATE (MCT OIL) 200 MG/ML (5 ML) (200 MG/ML (5 ML); 5 mL) | Injection | Optimal Balance Pharmacy | $35 | $20 | $55 | — | — | $81.25 ($26.25 / 32.3%) | $79 ($24 / 30.4%) | $90 ($35 / 38.9%) | $89 ($34 / 38.2%) | $8.75 | — | `PRICE_SOURCE_UNCLEAR` |
| Testosterone Cypionate Injection — TESTOSTERONE CYPIONATE INJECTION (CS) 200MG/ML 200MG/ML (10ML) (200MG/ML (10ML); 10 mL) | Injection | Optimal Balance Pharmacy | $37 | $20 | $57 | — | — | $84.75 ($27.75 / 32.7%) | $89 ($32 / 36.0%) | $94 ($37 / 39.4%) | $99 ($42 / 42.4%) | $9.25 | — | `PRICE_SOURCE_UNCLEAR` |

### Longevity & Cognitive Health

| Product / exact package | Form | Pharmacy | Cost | Ship | Total | Website | Tagada | A raw (profit / margin) | A suggested (profit / margin) | B raw (profit / margin) | B suggested (profit / margin) | Δ raw profit | Needed | Class |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Dihexa / Tesofensine Capsules — Dihexa/Tesofensine capsules 5mg/500mcg (5mg/500mcg; 1EA) † | Capsule | Greenwich Pharmacy | $3.20 | $25 | $28.20 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Dihexa Capsules — Dihexa capsules 5mg (5mg; 1EA) † | Capsule | Greenwich Pharmacy | $2.60 | $25 | $27.60 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Glutathione Injection — Glutathione 200mg/ml (200mg/ml; 10ml vial) | Injection | St Luke | $15 | $30 | $45 | — | — | $56.25 ($11.25 / 20.0%) | $59 ($14 / 23.7%) | $60 ($15 / 25.0%) | $59 ($14 / 23.7%) | $3.75 | — | `PRICE_SOURCE_UNCLEAR` |
| Glutathione Injection — Glutathione 200mg/ml (200mg/ml; 3x10ml vial (30ml)) | Injection | St Luke | $40 | $30 | $70 | — | — | $100 ($30 / 30.0%) | $99 ($29 / 29.3%) | $110 ($40 / 36.4%) | $109 ($39 / 35.8%) | $10 | — | `PRICE_SOURCE_UNCLEAR` |
| Methylene Blue Capsules — METHYLENE BLUE 5 MG (5 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $0.96 | $20 | $20.96 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Methylene Blue Capsules — METHYLENE BLUE 10 MG (10 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $1 | $20 | $21 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Methylene Blue Capsules — METHYLENE BLUE 15 MG (15 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $1.25 | $20 | $21.25 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Methylene Blue Capsules — METHYLENE BLUE 25 MG (25 MG; package unspecified) † | Capsule | Optimal Balance Pharmacy | $1.56 | $20 | $21.56 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| NAD+ Injection — NAD+ (Nicotinamide Adenine Dinucleotide) 200mg/ml (200mg/ml; 5ml vial (1000mg)) | Injection | St Luke | $64 | $30 | $94 | — | — | $142 ($48 / 33.8%) | $139 ($45 / 32.4%) | $158 ($64 / 40.5%) | $159 ($65 / 40.9%) | $16 | — | `PRICE_SOURCE_UNCLEAR` |
| NAD+ Nasal Spray — NAD+ 50mg/ml (50mg/ml; 15ml) | Nasal Spray | St Luke | $30 | $30 | $60 | $79 | $79 | $82.50 ($22.50 / 27.3%) | $79 ($19 / 24.1%) | $90 ($30 / 33.3%) | $89 ($29 / 32.6%) | $7.50 | — | `MATCHES_MODEL_A` |
| NAD+ Nasal Spray — NAD+ 200mg/ml (200mg/ml; 15ml) | Nasal Spray | St Luke | $45 | $30 | $75 | — | — | $108.75 ($33.75 / 31.0%) | $109 ($34 / 31.2%) | $120 ($45 / 37.5%) | $119 ($44 / 37.0%) | $11.25 | — | `PRICE_SOURCE_UNCLEAR` |
| Selank Nasal Spray — Selank 2.5mg/mL Nasal Spray (2.5mg/20mL; 20ml) † | Nasal Spray | Greenwich Pharmacy | $60 | $25 | $85 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Correct source strength/package fields | `PRICE_SOURCE_UNCLEAR` |
| Semax Nasal Spray — Semax 2.5mg/mL Nasal Spray (2.5mg/20mL; 20ml) † | Nasal Spray | Greenwich Pharmacy | $60 | $25 | $85 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Correct source strength/package fields | `PRICE_SOURCE_UNCLEAR` |
| Thymosin Alpha-1 Injection — THYMOSIN ALPHA-1 3 MG/ML (5 ML) (3 MG/ML (5 ML); 5 mL) | Injection | Optimal Balance Pharmacy | $82 | $20 | $102 | — | — | $163.50 ($61.50 / 37.6%) | $159 ($57 / 35.9%) | $184 ($82 / 44.6%) | $189 ($87 / 46.0%) | $20.50 | — | `PRICE_SOURCE_UNCLEAR` |

### Recovery & Performance

| Product / exact package | Form | Pharmacy | Cost | Ship | Total | Website | Tagada | A raw (profit / margin) | A suggested (profit / margin) | B raw (profit / margin) | B suggested (profit / margin) | Δ raw profit | Needed | Class |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| BPC-157 / GHK-Cu / KPV / TB-500 Injection — BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL (3mg/10mg/3mg/3mg/mL; 5ML) | Injection | Greenwich Pharmacy | $77 | $25 | $102 | — | — | $159.75 ($57.75 / 36.1%) | $159 ($57 / 35.9%) | $179 ($77 / 43.0%) | $179 ($77 / 43.0%) | $19.25 | — | `PRICE_SOURCE_UNCLEAR` |
| BPC-157 / KPV / TB-500 Injection — BPC-157/KPV/TB500 3mg/3mg/3mg/mL (3mg/3mg/3mg/mL; 5ML) | Injection | Greenwich Pharmacy | $77 | $25 | $102 | — | — | $159.75 ($57.75 / 36.1%) | $159 ($57 / 35.9%) | $179 ($77 / 43.0%) | $179 ($77 / 43.0%) | $19.25 | — | `PRICE_SOURCE_UNCLEAR` |
| BPC-157 / TB-500 / GHK-Cu Injection — BPC-157/TB-500/GHK-CU 3/3/10MG/ML (3/3/10mg/mL; 5ML) | Injection | Greenwich Pharmacy | $77 | $25 | $102 | — | — | $159.75 ($57.75 / 36.1%) | $159 ($57 / 35.9%) | $179 ($77 / 43.0%) | $179 ($77 / 43.0%) | $19.25 | — | `PRICE_SOURCE_UNCLEAR` |
| Wolverine: BPC-157/TB-500 — BPC-157/TB500 3mg/3mg/mL (3mg/3mg/mL; 5ML) | Capsule \| Injection | Greenwich Pharmacy | $77 | $25 | $102 | $199 | $199 | $159.75 ($57.75 / 36.1%) | $159 ($57 / 35.9%) | $179 ($77 / 43.0%) | $179 ($77 / 43.0%) | $19.25 | — | `ABOVE_MODEL_A` |
| Wolverine: BPC-157/TB-500 — BPC-157/TB500 capsules 500MCG/500MCG (500mcg/500mcg; 1EA) † | Capsule \| Injection | Greenwich Pharmacy | $3.20 | $25 | $28.20 | $99 | $99 | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |

### Prescription Skin & Hair

| Product / exact package | Form | Pharmacy | Cost | Ship | Total | Website | Tagada | A raw (profit / margin) | A suggested (profit / margin) | B raw (profit / margin) | B suggested (profit / margin) | Δ raw profit | Needed | Class |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Finasteride / Minoxidil / Tretinoin Topical — FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.25/5/0.01 % (0.25/5/0.01 %; 1 ml) † | Foam / Topical | Vios | $35 | $30 | $65 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Finasteride / Minoxidil / Tretinoin Topical — FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.25/5/0.03 % (0.25/5/0.03 %; 1 ml) † | Foam / Topical | Vios | $35 | $30 | $65 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Finasteride / Minoxidil / Tretinoin Topical — FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.5/5/0.01 % (0.5/5/0.01 %; 1 ml) † | Foam / Topical | Vios | $35 | $30 | $65 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Finasteride / Minoxidil Topical — FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 % (0.1/5 %; 1 ml) † | Foam / Topical | Vios | $30 | $30 | $60 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Finasteride / Minoxidil Topical — FINASTERIDE/MINOXIDIL (PER ML) 0.1/7 % (0.1/7 %; 1 ml) † | Foam / Topical | Vios | $30 | $30 | $60 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Minoxidil Cream — MINOXIDIL 10% (10%; 30 grams) | Cream | Vios | $32 | $30 | $62 | — | — | $86 ($24 / 27.9%) | $89 ($27 / 30.3%) | $94 ($32 / 34.0%) | $99 ($37 / 37.4%) | $8 | — | `PRICE_SOURCE_UNCLEAR` |
| Minoxidil Cream — MINOXIDIL 15% (15%; 30 grams) | Cream | Vios | $32 | $30 | $62 | — | — | $86 ($24 / 27.9%) | $89 ($27 / 30.3%) | $94 ($32 / 34.0%) | $99 ($37 / 37.4%) | $8 | — | `PRICE_SOURCE_UNCLEAR` |
| Minoxidil Cream — MINOXIDIL 7% (7%; 30 grams) | Cream | Vios | $32 | $30 | $62 | — | — | $86 ($24 / 27.9%) | $89 ($27 / 30.3%) | $94 ($32 / 34.0%) | $99 ($37 / 37.4%) | $8 | — | `PRICE_SOURCE_UNCLEAR` |
| Minoxidil Solution — MINOXIDIL 2% (2%; 1 ml) † | Solution | Vios | $1.28 | $30 | $31.28 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| Tretinoin Cream — TRETINOIN 0.15% (0.15%; 30 grams) | Cream | Vios | $25.50 | $30 | $55.50 | — | — | $74.62 ($19.12 / 25.6%) | $79 ($23.50 / 29.8%) | $81 ($25.50 / 31.5%) | $79 ($23.50 / 29.8%) | $6.38 | — | `PRICE_SOURCE_UNCLEAR` |
| Tretinoin Cream — HYALURONIC/NIACINAMIDE/TRETINOIN 0.5/4/0.025% (0.5/4/0.025%; 30 grams) | Cream | Vios | $54 | $30 | $84 | — | — | $124.50 ($40.50 / 32.5%) | $129 ($45 / 34.9%) | $138 ($54 / 39.1%) | $139 ($55 / 39.6%) | $13.50 | — | `PRICE_SOURCE_UNCLEAR` |

### Sexual Wellness

| Product / exact package | Form | Pharmacy | Cost | Ship | Total | Website | Tagada | A raw (profit / margin) | A suggested (profit / margin) | B raw (profit / margin) | B suggested (profit / margin) | Δ raw profit | Needed | Class |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| PT-141 (Bremelanotide) Nasal Spray — BREMELANOTIDE (PT-141) (PER ML) 10 MG/ML (10 MG/ML; 1 ml) † | Nasal Spray | Vios | $62 | $30 | $92 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| PT-141 (Bremelanotide) Nasal Spray — BREMELANOTIDE (PT-141) (PER ML) 5MG/ML (5MG/ML; 1 ml) † | Nasal Spray | Vios | $62 | $30 | $92 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |
| PT-141 Injection — PT-141 2mg/mL (2mg/mL; 5ML) | Injection | Greenwich Pharmacy | $62 | $25 | $87 | — | — | $133.50 ($46.50 / 34.8%) | $129 ($42 / 32.6%) | $149 ($62 / 41.6%) | $149 ($62 / 41.6%) | $15.50 | — | `PRICE_SOURCE_UNCLEAR` |
| Sildenafil / Testosterone Troche — Sildenafil/Testosterone 120mg/22mg (120mg/22mg; Each) † | Troche | St Luke | $2.75 | $30 | $32.75 | — | — | — (— / —) | — (— / —) | — (— / —) | — (— / —) | — | Verified dispense quantity/count/total mL | `PRICE_SOURCE_UNCLEAR` |

### Research Wellness

| Product / exact package | Form | Pharmacy | Cost | Ship | Total | Website | Tagada | A raw (profit / margin) | A suggested (profit / margin) | B raw (profit / margin) | B suggested (profit / margin) | Δ raw profit | Needed | Class |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| GHK-Cu Cream — GHK-Cu Cream 2mg/ml (2mg/ml; 30gm) | Cream | St Luke | $45 | $30 | $75 | — | — | $108.75 ($33.75 / 31.0%) | $109 ($34 / 31.2%) | $120 ($45 / 37.5%) | $119 ($44 / 37.0%) | $11.25 | — | `PRICE_SOURCE_UNCLEAR` |
| GHK-Cu Cream — GHK-Cu Cream 5mg/ml (5mg/ml; 30gm) | Cream | St Luke | $57 | $30 | $87 | — | — | $129.75 ($42.75 / 33.0%) | $129 ($42 / 32.6%) | $144 ($57 / 39.6%) | $149 ($62 / 41.6%) | $14.25 | — | `PRICE_SOURCE_UNCLEAR` |
| GHK-Cu Cream — GHK-Cu Cream 10mg/ml (10mg/ml; 30gm) | Cream | St Luke | $90 | $30 | $120 | — | — | $187.50 ($67.50 / 36.0%) | $189 ($69 / 36.5%) | $210 ($90 / 42.9%) | $209 ($89 / 42.6%) | $22.50 | — | `PRICE_SOURCE_UNCLEAR` |
| GHK-Cu Cream — GHK-Cu + CoQ10 Cream 1/1% (1/1%; 30gm) | Cream | St Luke | $50 | $30 | $80 | — | — | $117.50 ($37.50 / 31.9%) | $119 ($39 / 32.8%) | $130 ($50 / 38.5%) | $129 ($49 / 38.0%) | $12.50 | — | `PRICE_SOURCE_UNCLEAR` |
| MOTS-c / Tesamorelin Injection — MOTS-C/Tesamorelin 2mg/3mg/mL (2mg/3mg/mL; 5ml) | Injection | Greenwich Pharmacy | $79 | $25 | $104 | — | — | $163.25 ($59.25 / 36.3%) | $159 ($55 / 34.6%) | $183 ($79 / 43.2%) | $179 ($75 / 41.9%) | $19.75 | — | `PRICE_SOURCE_UNCLEAR` |
| MOTS-c Injection — MOTS-C 2mg/mL (2mg/mL; 5ML) | Injection | Greenwich Pharmacy | $62 | $25 | $87 | — | — | $133.50 ($46.50 / 34.8%) | $129 ($42 / 32.6%) | $149 ($62 / 41.6%) | $149 ($62 / 41.6%) | $15.50 | — | `PRICE_SOURCE_UNCLEAR` |

## Unresolved medication catalog entries

No model price is calculated for these records. The selected cost, shipping, formulation, package, or exact pharmacy join is missing/ambiguous.

| Product | Category | Status | Website | Tagada | Reason |
|---|---|---|---:|---:|---|
| Scream Cream | SEXUAL WELLNESS | FUTURE_HIDDEN | — | — | No selected formulary row/cost/shipping in locked architecture. |
| Sexual Wellness Compound Capsules | SEXUAL WELLNESS | FUTURE_HIDDEN | — | — | No selected formulary row/cost/shipping in locked architecture. |
| Oxytocin Nasal Spray | WOMEN'S HORMONE THERAPY | FUTURE_HIDDEN | — | — | No selected formulary row/cost/shipping in locked architecture. |
| Selank + Semax Blend Nasal Spray — 50mcg/50mcg per spray, 10mL | longevity-cognitive | VISIBLE_ACTIVE | $169 | $169 | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Selank Injection — 5mg/mL, 2mL | longevity-cognitive | VISIBLE_ACTIVE | $129 | $129 | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Semax Injection — 5mg/mL, 2mL | longevity-cognitive | VISIBLE_ACTIVE | $129 | $129 | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Sermorelin — 9mg/mL, 3mL | longevity-cognitive | FUTURE_HIDDEN | $119 | — | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Tesamorelin Injection — 10mg total · 5mg/mL, 2mL vial | longevity-cognitive | VISIBLE_ACTIVE | $149 | $149 | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Lash/Brow Growth Serum — 0.03%, 2.5mL | prescription-skin-hair | VISIBLE_ACTIVE | $89 | $89 | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Minoxidil Combination Topical Formula — Combination formula, Bottle | prescription-skin-hair | VISIBLE_ACTIVE | $129 | $129 | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Minoxidil Tablets — 2.5mg, 30 tablets | prescription-skin-hair | FUTURE_HIDDEN | $79 | — | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Tretinoin Cream — 0.025%, 20g | prescription-skin-hair | VISIBLE_ACTIVE | $79 | $79 | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Tretinoin Cream — 0.05%, 20g | prescription-skin-hair | VISIBLE_ACTIVE | $89 | $89 | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Tretinoin Cream — 0.1%, 20g | prescription-skin-hair | VISIBLE_ACTIVE | $109 | $109 | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Fat Burner — AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL), 5mL vial | weight-management | VISIBLE_ACTIVE | $259 | $259 | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |
| Testosterone Cream — 5mg/g, 30g | womens-hormone-therapy | VISIBLE_ACTIVE | $79 | $79 | No unambiguous exact selected pharmacy/formulation/package cost + shipping join; do not substitute a different formulation or per-unit proxy. |

## Provider-care/services (separate)

Medication markup models are not applied. Approved at-cost/provider-cost data is absent.

| Service | SKU | Website | Tagada | Match | Cost status |
|---|---|---:|---:|---|---|
| Initial Provider Visit | `MBM-PC-IPV-SRV-001` | $75 | $75 | YES | Missing approved at-cost |
| Follow-Up Visit | `MBM-PC-FUV-SRV-001` | $55 | $55 | YES | Missing approved at-cost |
| Laboratory Review | `MBM-PC-LAB-SRV-001` | $60 | $60 | YES | Missing approved at-cost |
| Lab Kit | `MBM-PC-LAB-KIT-001` | $200 | $200 | YES | Missing approved at-cost |

## Accessories (separate)

Medication markup models are not applied. Approved accessory at-cost data is absent.

| Accessory / variant | SKU | Website | Tagada | Match | Cost status |
|---|---|---:|---:|---|---|
| Complete Injection Starter Kit — Bundle, 1 kit | `MBM-ACC-CIS-ACC-001` | $119 | $119 | YES | Missing approved at-cost |
| Premium Protective Medication Case — Standard, 1 case | `MBM-ACC-PPC-ACC-001` | $34 | $34 | YES | Missing approved at-cost |
| Temperature-Controlled Travel Case — Standard, 1 case | `MBM-ACC-TTC-ACC-001` | $59 | $59 | YES | Missing approved at-cost |
| Discreet Travel Bag — Standard, 1 bag | `MBM-ACC-DTB-ACC-001` | $39 | $39 | YES | Missing approved at-cost |
| Reusable Ice Pack — Standard, 1 pack | `MBM-ACC-ICE-ACC-001` | $12 | $12 | YES | Missing approved at-cost |
| Daily & Weekly Wellness Planner — Standard, 1 planner | `MBM-ACC-DWP-ACC-001` | $29 | $29 | YES | Missing approved at-cost |
| Sharps Container — Standard, 1 container | `MBM-ACC-SHP-ACC-001` | $10 | $10 | YES | Missing approved at-cost |
| Alcohol Prep Wipes — 200 Count, 1 box | `MBM-ACC-APW-ACC-001` | $9.99 | $9.99 | YES | Missing approved at-cost |
| Alcohol Prep Wipes — 500 Count, 1 box | `MBM-ACC-APW-ACC-002` | $18.99 | $18.99 | YES | Missing approved at-cost |
| Premium Insulin Syringes — 10 Pack, 1 pack | `MBM-ACC-PIS-ACC-001` | $3.99 | $3.99 | YES | Missing approved at-cost |
| Premium Insulin Syringes — 20 Pack, 1 pack | `MBM-ACC-PIS-ACC-002` | $6.99 | $6.99 | YES | Missing approved at-cost |
| Premium Insulin Syringes — 30 Pack, 1 pack | `MBM-ACC-PIS-ACC-003` | $9.49 | $9.49 | YES | Missing approved at-cost |
| Premium Insulin Syringes — 40 Pack, 1 pack | `MBM-ACC-PIS-ACC-004` | $11.99 | $11.99 | YES | Missing approved at-cost |
| Premium Insulin Syringes — 50 Pack, 1 pack | `MBM-ACC-PIS-ACC-005` | $14.49 | $14.49 | YES | Missing approved at-cost |
| Premium Insulin Syringes — 60 Pack, 1 pack | `MBM-ACC-PIS-ACC-006` | $16.99 | $16.99 | YES | Missing approved at-cost |
| Premium Insulin Syringes — 70 Pack, 1 pack | `MBM-ACC-PIS-ACC-007` | $19.49 | $19.49 | YES | Missing approved at-cost |
| Premium Insulin Syringes — 80 Pack, 1 pack | `MBM-ACC-PIS-ACC-008` | $21.99 | $21.99 | YES | Missing approved at-cost |
| Premium Insulin Syringes — 90 Pack, 1 pack | `MBM-ACC-PIS-ACC-009` | $24.49 | $24.49 | YES | Missing approved at-cost |
| Premium Insulin Syringes — 100 Pack, 1 pack | `MBM-ACC-PIS-ACC-010` | $26.99 | $26.99 | YES | Missing approved at-cost |

## Source coverage appendix

| Coverage item | Count |
|---|---:|
| Selected workbook rows reported by lock | 136 |
| Usable rows reported by lock | 132 |
| Assigned unique Excel rows | 121 |
| Collapsed unique monthly product/package/economics records | 102 |
| Distinct multi-month commercial packages | 5 |
| Total selected commercial packages audited | 107 |
| Separately listed duplicate workbook copies not double-counted | 11 |
| Excluded workbook rows | 4 |

### Duplicate workbook copies not double-counted

| Excel row | Exact source label | Reason |
|---:|---|---|
| 88 | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | DUPLICATE workbook copy of SEM/TIR B12 ladder under Longevity/B12 — covered by Weight Management products; not assigned twice |
| 89 | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | DUPLICATE workbook copy of SEM/TIR B12 ladder under Longevity/B12 — covered by Weight Management products; not assigned twice |
| 90 | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | DUPLICATE workbook copy of SEM/TIR B12 ladder under Longevity/B12 — covered by Weight Management products; not assigned twice |
| 91 | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | DUPLICATE workbook copy of SEM/TIR B12 ladder under Longevity/B12 — covered by Weight Management products; not assigned twice |
| 92 | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | DUPLICATE workbook copy of SEM/TIR B12 ladder under Longevity/B12 — covered by Weight Management products; not assigned twice |
| 93 | TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | DUPLICATE workbook copy of SEM/TIR B12 ladder under Longevity/B12 — covered by Weight Management products; not assigned twice |
| 95 | TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | DUPLICATE workbook copy of SEM/TIR B12 ladder under Longevity/B12 — covered by Weight Management products; not assigned twice |
| 96 | TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) | DUPLICATE workbook copy of SEM/TIR B12 ladder under Longevity/B12 — covered by Weight Management products; not assigned twice |
| 97 | TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | DUPLICATE workbook copy of SEM/TIR B12 ladder under Longevity/B12 — covered by Weight Management products; not assigned twice |
| 98 | TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) | DUPLICATE workbook copy of SEM/TIR B12 ladder under Longevity/B12 — covered by Weight Management products; not assigned twice |
| 99 | TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | DUPLICATE workbook copy of SEM/TIR B12 ladder under Longevity/B12 — covered by Weight Management products; not assigned twice |

### Excluded workbook rows

| Excel row | Exact source label | Reason |
|---:|---|---|
| 12 | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) | unreliable_multivial_cost_basis |
| 25 | TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) (3 PACK)) | unreliable_multipack |
| 94 | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) | unreliable_multivial_cost_basis |
| 137 | Ondansetron | status=BLOCKED / TBD |

### Launch-state coverage of selected package records

| Launch state | Records |
|---|---:|
| `CURRENT_LIVE` | 18 |
| `FUTURE_HIDDEN` | 67 |
| `LAUNCH_WITH_WEBSITE_CUTOVER` | 22 |

## Current website ↔ Tagada reconciliation

- Runtime website variants audited: **70**.
- Exact website/Tagada price matches: **68**.
- Website/Tagada price mismatches: **0**.
- Unmapped variants: **2** — hidden/future Sermorelin and Minoxidil Tablets have no SKU/Tagada map.

## Decision comparison

### Keep ×1.75

- Average raw gross margin: **35.63%**.
- Raw-margin range: **20.00%–41.67%**.
- Suggested-price average/range: **35.42%** / **20.29%–42.55%**.
- Weak economics: **12** complete packages below 30%, concentrated in shipping-heavy lower-cost formulations.
- Membership risk: medication-only minimums remain 53.02% SEM and 61.82% TIR, but true margin remains unknown because provider, processor, carrier, and operating costs are absent.
- Pricing inconsistency: current exact package prices include two above-Model-A records and one close record; no mapped complete package is below Model A.

### Move to ×2.00

- Average raw gross margin: **42.37%**.
- Raw-margin range: **25.00%–48.78%**.
- Suggested-price average/range: **43.04%** / **23.73%–49.88%**.
- Suggested changes versus Model A suggested prices: **3** unchanged; **22** increases ≤$10; **23** increases $11–$20; **14** increases >$20.
- Incremental raw gross profit per package equals 25% of medication at-cost and is listed row-by-row in this document/JSON.
- Memberships are unaffected unless separately repriced; this audit recommends no membership change.

## Recommendation

**CONDITIONAL HYBRID pending missing inputs.** Evaluate Model B or a minimum-margin floor for packages whose Model A economics remain weak after pharmacy shipping, but do not approve a blanket rule from this dataset alone. First supply target margin, sales mix, demand sensitivity, dispense quantities, provider/processor/carrier/operating costs, and unresolved current-product sourcing. Preserve SEM $149 and TIR $275 pending that review.

## Implementation status

```text
IMPLEMENTATION PERFORMED: NO
WEBSITE CHANGED: NO
TAGADA CHANGED: NO
SUPABASE CHANGED: NO
KASHU MAP CHANGED: NO
GEN CHANGED: NO
EDGE FUNCTIONS CHANGED: NO
MEMBERSHIP PRICES CHANGED: NO
STOP FOR OWNER REVIEW.
```
