# GEN Retail Pricing Rule (GEN-CATALOG-1G)

**READ-ONLY — no GEN writes.**
**Generated:** 2026-08-24T07:05:53Z

## Owner pricing rule (LOCKED)

**retail = medicationCost × 1.75 + pharmacyShippingInternal**

- Customer medication shipping charge = $0 (shipping baked into retail per READ ME - RULES).
- Workbook SELECTED FORMULARY column "Cost +75%" = landedCost × 1.75 (i.e. (cost+shipping)×1.75). Owner rule differs: cost×1.75+shipping only.
- Multi-vial / Any Dose: price **each fill** with the formula for that vial’s cost + shipping.
- Round to nearest dollar only after owner confirms (exact values shown below).

## LIVE_NOW (+ Mid B12) formula table

| Product | Formulary cost basis | Ship | Formula retail (exact) | Rounded | Prior proposed | Current GEN | Website $ | Flags |
|---|---|---:|---:|---:|---:|---:|---:|---|
| AOD-9604 / MOTS-C / Tesamorelin Injection | AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/ 2MG/ 2MG/ML (5 ML) @ $102.0 | 20.0 | **198.5** | 198 | 219.0 | 219.0 | 259.0 |  |
| AOD-9604 Injection | AOD 9604 300 MCG @ $1.75 | 20.0 | **23.06** | 23 | 179.0 | 179.0 | None | COST_LOOKS_PER_UNIT |
| BPC-157 / TB-500 Capsules | BPC-157/TB500 capsules 500MCG/500MCG @ $3.2 | 25.0 | **30.6** | 31 | 169.0 | 169.0 | 99.0 | COST_LOOKS_PER_UNIT |
| BPC-157 Injection | BPC-157 500 MCG: $1.8+ship20.0→**$23.15**<br>BPC-157/TB-500/GHK-CU 3/3/10MG/ML: $77.0+ship25.0→**$159.75**<br>BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL: $77.0+ship25.0→**$159.75**<br>BPC-157/KPV/TB500 3mg/3mg/3mg/mL: $77.0+ship25.0→**$159.75**<br>BPC-157/TB500 3mg/3mg/mL: $77.0+ship25.0→**$159.75** | (per row) | **band 23.15–159.75** | — | 199.0 | 199.0 | 199.0 | BLEND_FORMULARY_UNDER_PLAIN_BPC_PRODUCT,COST_LOOKS_PER_UNIT,NEEDS_PACKAGE_COST_CONFIRMATION |
| BPC-157 — Unspecified | BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml) @ $77.0 | 25.0 | **159.75** | 160 | 189.0 | 189.0 | None |  |
| GHK-Cu / Minoxidil Topical Combo | Minoxidil 2.5mg/GHK-Cu 5mg/Apigenin 50mg/Fisetin 50mg @ $36.75 | 2.0 | **66.31** | 66 | 149.0 | 149.0 | 129.0 |  |
| Semaglutide Injection — 3-Month (B12) | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) @ $50.0 | 30.0 | **117.5** | 118 | 799.0 | 799.0 | None | THREE_MONTH_COST_LOOKS_UNDERSTATED |
| Semaglutide Injection — Any Dose (B12) | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL): $50.0+ship5.0→**$92.5**<br>SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL): $55.0+ship5.0→**$101.25**<br>SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL): $58.0+ship5.0→**$106.5**<br>SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL): $60.0+ship5.0→**$110.0**<br>SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL): $65.0+ship5.0→**$118.75** | (per row) | **band 92.5–118.75** | — | 189.0 | 189.0 | 149.0 |  |
| Semaglutide Injection — Any Dose (Glycine) | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL): $50.0+ship5.0→**$92.5**<br>SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL): $55.0+ship5.0→**$101.25**<br>SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL): $58.0+ship5.0→**$106.5**<br>SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL): $60.0+ship5.0→**$110.0**<br>SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL): $65.0+ship5.0→**$118.75** | (per row) | **band 92.5–118.75** | — | 149.0 | 149.0 | 149.0 |  |
| Semaglutide Injection — High (B12) | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL): $60.0+ship5.0→**$110.0**<br>SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL): $65.0+ship5.0→**$118.75** | (per row) | **band 110.0–118.75** | — | 199.0 | 199.0 | None |  |
| Semaglutide Injection — High (Glycine) | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL): $60.0+ship5.0→**$110.0**<br>SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL): $65.0+ship5.0→**$118.75** | (per row) | **band 110.0–118.75** | — | 129.0 | 129.0 | None |  |
| Semaglutide Injection — Mid (Glycine) | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) @ $58.0 | 5.0 | **106.5** | 106 | 109.0 | 109.0 | None |  |
| Semaglutide Injection — Starting / Low (B12) | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL): $50.0+ship5.0→**$92.5**<br>SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL): $55.0+ship5.0→**$101.25** | (per row) | **band 92.5–101.25** | — | None | None | None |  |
| Semaglutide Injection — Starting / Low (Glycine) | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL): $50.0+ship5.0→**$92.5**<br>SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL): $55.0+ship5.0→**$101.25** | (per row) | **band 92.5–101.25** | — | 119.0 | 119.0 | None |  |
| Semaglutide Injection — Mid (B12) | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) @ $58.0 | 5.0 | **106.5** | 106 | None | None | None |  |

## Notable deltas (formula vs prior proposed / website)

- **AOD-9604 / MOTS-C / Tesamorelin Injection**: formula $198.5 (rounded $198) — vs prior proposed: -20.5; vs website: -61.0; vs GEN: -21.0
- **AOD-9604 Injection**: formula $23.06 (rounded $23) — vs prior proposed: -155.94; vs GEN: -156.0
- **BPC-157 / TB-500 Capsules**: formula $30.6 (rounded $31) — vs prior proposed: -138.4; vs website: -68.0; vs GEN: -138.0
- **BPC-157 — Unspecified**: formula $159.75 (rounded $160) — vs prior proposed: -29.25; vs GEN: -29.0
- **GHK-Cu / Minoxidil Topical Combo**: formula $66.31 (rounded $66) — vs prior proposed: -82.69; vs website: -63.0; vs GEN: -83.0
- **Semaglutide Injection — 3-Month (B12)**: formula $117.5 (rounded $118) — vs prior proposed: -681.5; vs GEN: -681.0
- **Semaglutide Injection — Mid (Glycine)**: formula $106.5 (rounded $106) — vs prior proposed: -2.5; vs GEN: -3.0

## Flags requiring owner attention before write

- **AOD-9604 Injection**: COST_LOOKS_PER_UNIT
- **BPC-157 / TB-500 Capsules**: COST_LOOKS_PER_UNIT
- **BPC-157 Injection**: BLEND_FORMULARY_UNDER_PLAIN_BPC_PRODUCT, COST_LOOKS_PER_UNIT, NEEDS_PACKAGE_COST_CONFIRMATION
- **Semaglutide Injection — 3-Month (B12)**: THREE_MONTH_COST_LOOKS_UNDERSTATED

## Status

- GEN MODIFIED: **NO**
- GEN WRITES: **0**
- GEN/WHOP CUTOVER: **OFF**

**STOP FOR FINAL PRICE + EXECUTION REVIEW** (now using formula retail).
