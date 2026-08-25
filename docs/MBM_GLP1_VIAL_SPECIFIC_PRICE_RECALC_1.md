# MBM-GLP1-VIAL-SPECIFIC-PRICE-RECALC-1

**Mode:** pricing analysis only.  
**Do not create Tagada variants.**  
**Do not modify website, Tagada, GEN, or Supabase.**

Membership is owner-set and was not recalculated: SEM **$149/month**, TIR **$275/month**.

## Cost authority

Newest verified SELECTED FORMULARY cost basis in-repo:

- Workbook: `MyBareMethod_FINAL_GEN.xlsx`
- Lock: `docs/MBM_FINAL_PATIENT_PRODUCT_ARCHITECTURE.json` (generated 2026-08-24; live-map-lock 2026-08-24)
- Pharmacy: **Dirx-Hub** for every SEM/TIR B12 and Glycine one-time vial below
- Shipping: **$5** pharmacy shipping on each of those rows
- B12 and Glycine were calculated separately; in this lock they have the **same** cost and shipping per matching vial size

Formula: `raw = (at_cost × 1.75) + pharmacy_shipping` → nearest whole-dollar **$X9** (equidistant → round UP).

No cost or shipping was invented. 3-vial / 3-pack rows remain excluded.

---

## 10 missing Tagada variants

| MBM SKU | FORMULATION | VIAL / TOTAL MG | PHARMACY | AT COST | SHIPPING | RAW RETAIL = (cost × 1.75) + shipping | FINAL $X9 RETAIL | PREVIOUS PROPOSED RETAIL | PRICE CHANGE REQUIRED |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MBM-WM-SEM-B12-005 | Vitamin B12 | 2 mg (1 mL vial) | Dirx-Hub | $55 | $5 | $101.25 | **$99** | $99 | NO |
| MBM-WM-SEM-B12-006 | Vitamin B12 | 10 mg (1 mL vial) | Dirx-Hub | $65 | $5 | $118.75 | **$119** | $119 | NO |
| MBM-WM-SEM-GLY-005 | Glycine | 2 mg (1 mL vial) | Dirx-Hub | $55 | $5 | $101.25 | **$99** | $99 | NO |
| MBM-WM-SEM-GLY-006 | Glycine | 10 mg (1 mL vial) | Dirx-Hub | $65 | $5 | $118.75 | **$119** | $119 | NO |
| MBM-WM-TIR-B12-005 | Vitamin B12 | 20 mg (2 mL vial) | Dirx-Hub | $75 | $5 | $136.25 | **$139** | $139 | NO |
| MBM-WM-TIR-B12-006 | Vitamin B12 | 40 mg (2 mL vial) | Dirx-Hub | $90 | $5 | $162.50 | **$159** | $159 | NO |
| MBM-WM-TIR-B12-007 | Vitamin B12 | 60 mg (2 mL vial) | Dirx-Hub | $100 | $5 | $180.00 | **$179** | $179 | NO |
| MBM-WM-TIR-GLY-005 | Glycine | 20 mg (2 mL vial) | Dirx-Hub | $75 | $5 | $136.25 | **$139** | $139 | NO |
| MBM-WM-TIR-GLY-006 | Glycine | 40 mg (2 mL vial) | Dirx-Hub | $90 | $5 | $162.50 | **$159** | $159 | NO |
| MBM-WM-TIR-GLY-007 | Glycine | 60 mg (2 mL vial) | Dirx-Hub | $100 | $5 | $180.00 | **$179** | $179 | NO |

Excel rows: SEM B12 5 / 11; SEM Glycine 4 / 10; TIR B12 16 / 20 / 24; TIR Glycine 15 / 19 / 23.

Tirzepatide Dirx packages are `mg/0.5mg/mL × 2 mL`. Customer/Tagada names stay total milligrams (20 / 40 / 60), not concentration math.

---

## All visible weekly-dose routing (B12 and Glycine identical $X9)

Website column = PR #23 weekly-dose architecture (`oneTimeVialMapping` / family overlay). Production live `/product/*` is still legacy B6 until cutover; that path is not this architecture.

Tagada column = live `LAUNCH_READY_KASHU_MAP` for existing 001/002/003. New 005/006/007 variants are **not created**.

### Semaglutide

| WEEKLY DOSE | FULFILLMENT VIAL | AT COST | SHIPPING | FINAL $X9 RETAIL | CURRENT WEBSITE PRICE | CURRENT TAGADA PRICE | CHANGE REQUIRED |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0.25 mg | 1 mg | $50 | $5 | $89 | $89 (001) | $89 | NO |
| 0.5 mg | 2 mg | $55 | $5 | $99 | $99 (005, PR #23) | none (variant not created) | NO vs website; Tagada create at $99 |
| 0.75 mg | 4 mg | $58 | $5 | $109 | $109 (002) | $109 | NO |
| 1 mg | 4 mg | $58 | $5 | $109 | $109 (002) | $109 | NO |
| 1.25 mg | 6 mg | $60 | $5 | $109 | $109 (003) | $109 | NO |
| 1.5 mg | 6 mg | $60 | $5 | $109 | $109 (003) | $109 | NO |
| 1.75 mg | 10 mg | $65 | $5 | $119 | $119 (006, PR #23) | none (variant not created) | NO vs website; Tagada create at $119 |
| 2 mg | 10 mg | $65 | $5 | $119 | $119 (006, PR #23) | none (variant not created) | NO vs website; Tagada create at $119 |

Apply separately to B12 (`MBM-WM-SEM-B12-*`) and Glycine (`MBM-WM-SEM-GLY-*`). Same dollars.

### Tirzepatide

| WEEKLY DOSE | FULFILLMENT VIAL | AT COST | SHIPPING | FINAL $X9 RETAIL | CURRENT WEBSITE PRICE | CURRENT TAGADA PRICE | CHANGE REQUIRED |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2.5 mg | 10 mg | $65 | $5 | $119 | $119 (001) | $119 | NO |
| 5 mg | 20 mg | $75 | $5 | $139 | $139 (005, PR #23) | none (variant not created) | NO vs website; Tagada create at $139 |
| 7.5 mg | 30 mg | $85 | $5 | $149 | $149 (002) | $149 | NO |
| 10 mg | 40 mg | $90 | $5 | $159 | $159 (006, PR #23) | none (variant not created) | NO vs website; Tagada create at $159 |
| 12.5 mg | 50 mg | $95 | $5 | $169 | $169 (003) | $169 | NO |
| 15 mg | 60 mg | $100 | $5 | $179 | $179 (007, PR #23) | none (variant not created) | NO vs website; Tagada create at $179 |

Apply separately to B12 (`MBM-WM-TIR-B12-*`) and Glycine (`MBM-WM-TIR-GLY-*`). Same dollars.

Existing 001 / 002 / 003 Tagada prices already equal formula $X9. Do not edit those historical variants.

---

## Status

```
PRICING FORMULA USED: (cost × 1.75) + shipping → nearest $X9
MEMBERSHIP PRICES CHANGED: NO
SEM MEMBERSHIP: $149
TIR MEMBERSHIP: $275
10 NEW TAGADA VARIANTS PRICED: 10 / 10
PRICE CHANGES VS PRIOR CHECKLIST: 0
MISSING COST BASIS: 0
MISSING SHIPPING: 0
SAFE TO CREATE TAGADA VARIANTS: YES
```

Pricing-complete does **not** mean create them in this step.

STOP BEFORE TAGADA CREATION.
