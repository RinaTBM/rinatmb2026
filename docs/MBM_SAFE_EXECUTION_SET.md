# MBM Safe Execution Set — Catalog Ready Gate

**Generated:** 2026-08-24T22:03:51Z  
**Phase:** MBM-CATALOG-READY-GATE-1  
**Mode:** READ-ONLY — no GEN writes, no website writes, no pairing writes, no deactivations  
**Cutover:** OFF · **GEN-CATALOG-2B:** NOT STARTED  
**Launch map:** LOCKED unchanged (CURRENT_LIVE **17** / CUTOVER **16** / FUTURE_HIDDEN **32** / TOTAL **65**)

Machine-readable: [`MBM_SAFE_EXECUTION_SET.json`](./MBM_SAFE_EXECUTION_SET.json) · GEN gate: [`MBM_GEN_PROTECTION_AND_CLEANUP_GATE.md`](./MBM_GEN_PROTECTION_AND_CLEANUP_GATE.md)

---

## Owner-accepted lock

| Field | Value |
|---|---|
| Product | Minoxidil Combination Topical Formula |
| Formulation | Finasteride / Minoxidil **0.1% / 5%** |
| Pharmacy | Vios |
| SELECTED row | **129** · `FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 %` |
| Retail | **$79** |
| Classification | `VERIFIED_SELECTED_FORMULARY_MATCH` |

Do **not** reopen unless underlying formulary data changes.

---

## A. VERIFIED_CURRENT_LIVE

Website products with verified SELECTED FORMULARY identity (safe to proceed later; not blocking).

| Product | SELECTED | Pharmacy | Notes |
|---|---|---|---|
| Minoxidil Combination Topical Formula | r129 FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 % → **$79** | Vios | Owner-locked |
| Estradiol Patch | rows 26,27,28,29 | Valiant | SELECTED patch ladder covers website 0.025/0.05/0.1 (plus SELECTED 0.0375). Cost+shipping complete. |
| Progesterone Capsules | rows 41,42,43,44,45,46,47,48,49 | Vios | Website 100mg/200mg map into SELECTED IR family. Cost+shipping complete. |
| Wolverine: BPC-157/TB-500 | rows 103 (inj), 104 (cap) | Greenwich Pharmacy | **ONE** website product / **TWO** dosage-form variants (integrity gate corrected architecture representation) |

**Count:** 4

---

## B. CURRENT_LIVE_FORMULARY_PENDING (frozen 7)

Remain **CURRENT_LIVE** on the website. **Not** authorized for new formulary pairing, replacement, GEN restructuring, or deactivation. Do not substitute. Do not invent pharmacy data. Do not use near-matches. Do **not** block the verified remainder of the catalog.

| Product | Status | Exact release requirement |
|---|---|---|
| Fat Burner | `CURRENT_LIVE_FORMULARY_PENDING` | AOD-9604 + MOTS-c + Tesamorelin WITHOUT Ipamorelin; target 1.2/2/3 mg/mL, 5 mL unless owner approves alternate; pharmacy + cost + shipping |
| Testosterone Cream | `CURRENT_LIVE_FORMULARY_PENDING` | Testosterone-only cream 5 mg/g; package/dispense + pharmacy + cost + shipping |
| Selank Injection | `CURRENT_LIVE_FORMULARY_PENDING` | injectable Selank; target 5 mg/mL, 2 mL unless owner approves alternate; pharmacy + cost + shipping |
| Semax Injection | `CURRENT_LIVE_FORMULARY_PENDING` | injectable Semax; target 5 mg/mL, 2 mL unless owner approves alternate; pharmacy + cost + shipping |
| Selank + Semax Blend Nasal Spray | `CURRENT_LIVE_FORMULARY_PENDING` | single combined Selank + Semax nasal; target 50 mcg/50 mcg, 10 mL unless owner approves alternate; pharmacy + cost + shipping |
| Tesamorelin | `CURRENT_LIVE_FORMULARY_PENDING` | plain Tesamorelin (not MOTS-c blend); strength + package + pharmacy + cost + shipping |
| Lash/Brow Growth Serum | `CURRENT_LIVE_FORMULARY_PENDING` | Bimatoprost 0.03%, 2.5 mL; confirmed pharmacy + cost + shipping. FUTURE ADDITIONS/TBD insufficient. |

**Count:** 7

---

## CURRENT_LIVE transitional (until cutover)

| Product | Status | Note |
|---|---|---|
| Semaglutide + B6 Injection | `CURRENT_LIVE_TRANSITIONAL_UNTIL_CUTOVER` | Remains CURRENT_LIVE until website cutover replaces with B12/Glycine dose groups. No B6 SELECTED target. Do not formulary-pair as long-term identity. |
| Tirzepatide + B6 Injection | `CURRENT_LIVE_TRANSITIONAL_UNTIL_CUTOVER` | Same as SEM B6. Do not reintroduce B6 into cutover architecture. |

---

## CURRENT_LIVE strength pending (MBM-FINAL-INTEGRITY-GATE)

Both are **FORMULATION_STRENGTH_CONFLICT**. Owner decision required. Not added to frozen-7 pharmacy queue. Full detail: [`MBM_FINAL_INTEGRITY_GATE.md`](./MBM_FINAL_INTEGRITY_GATE.md).

| Product | Classification | Website | SELECTED | Status |
|---|---|---|---|---|
| NAD+ Injection | FORMULATION_STRENGTH_CONFLICT | **100mg/mL** · 5mL/$199 · 10mL/$229 | r83 **200mg/ml** inj only · St Luke · $139 (nasal excluded) | CURRENT_LIVE_STRENGTH_PENDING |
| Tretinoin Cream | FORMULATION_STRENGTH_CONFLICT | **0.025/0.05/0.1%** · 20g | r126 **0.15%** 30g $79 · r127 combo $129 (not plain substitute) | CURRENT_LIVE_STRENGTH_PENDING |

---

## C. CUTOVER_READY (16) — SEM/TIR B12 + Glycine

Owner-approved dose groups. Exact SELECTED rows verified. **Do not reintroduce B6.** Do not use ambiguous `Tirzepatide/B12/Glycine` or `Tirzepatide/Glycine/B12`. Do not use broken 3-pack / 3-vial rows.

### SEM + B12

| Product | Dose group | SELECTED rows | Exact | $X9 |
|---|---|---|---|---|
| `sem-b12-starting-low` | Starting/Low 1+2 | r3, r5 | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | $89–$99 |
| `sem-b12-mid` | Mid 4 | r7 | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | $109 |
| `sem-b12-high` | High 6+10 | r9, r11 | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | $109–$119 |
| `sem-b12-any-dose` | Any Dose 1+2+4+6+10 | r3, r5, r7, r9, r11 | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | $89–$119 |

### SEM + Glycine

| Product | Dose group | SELECTED rows | Exact | $X9 |
|---|---|---|---|---|
| `sem-glycine-starting-low` | Starting/Low 1+2 | r2, r4 | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | $89–$99 |
| `sem-glycine-mid` | Mid 4 | r6 | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | $109 |
| `sem-glycine-high` | High 6+10 | r8, r10 | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | $109–$119 |
| `sem-glycine-any-dose` | Any Dose 1+2+4+6+10 | r2, r4, r6, r8, r10 | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL); SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | $89–$119 |

### TIR + B12 (owner tiers 5+10 / 15+20 / 25+30 / full)

| Product | Dose group | SELECTED rows | Exact | $X9 |
|---|---|---|---|---|
| `tir-b12-starting-low` | Starting/Low 5+10 | r14, r16 | TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | $119–$139 |
| `tir-b12-mid` | Mid 15+20 | r18, r20 | TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | $149–$159 |
| `tir-b12-high` | High 25+30 | r22, r24 | TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | $169–$179 |
| `tir-b12-any-dose` | Any Dose 5–30 | r14, r16, r18, r20, r22, r24 | TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | $119–$179 |

### TIR + Glycine

| Product | Dose group | SELECTED rows | Exact | $X9 |
|---|---|---|---|---|
| `tir-glycine-starting-low` | Starting/Low 5+10 | r13, r15 | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) | $119–$139 |
| `tir-glycine-mid` | Mid 15+20 | r17, r19 | TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) | $149–$159 |
| `tir-glycine-high` | High 25+30 | r21, r23 | TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | $169–$179 |
| `tir-glycine-any-dose` | Any Dose 5–30 | r13, r15, r17, r19, r21, r23 | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL); TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | $119–$179 |

**CUTOVER_READY:** 16 · **CUTOVER_BLOCKED:** 0

Pharmacy for all 16: **Dirx-Hub**.

> GEN note (report only): SEM dose-group Client Products already exist for later repair. **No TIR B12/Glycine dose-group CPs** in current GEN REUSE set — formulary-ready does not imply GEN objects exist yet. Create/repair is later; not this phase.

---

## D. MEMBERSHIP_READY

| Membership | Price | Backend |
|---|---|---|
| SEM | **$149**/month | B12/Glycine split allowed if GEN requires; do not expose split to patients |
| TIR | **$275**/month at cutover (website still $249) | Same split rule |

---

## E. FUTURE_HIDDEN_READY

**Count:** 28 — formulation + SELECTED rows + cost/shipping sufficiently verified.

| ID | Product | SELECTED rows | Pharmacy | From $ |
|---|---|---|---|---|
| `sem-b12-3month` | Semaglutide Injection — 3-Month (B12) | 3,5,7,9,11 | Dirx-Hub | — |
| `estradiol-tablet` | Estradiol Tablet | 37,38,39 | Optimal Balance Pharmacy | $19 |
| `estradiol-injection` | Estradiol Cypionate Injection | 40 | Vios | $89 |
| `hrt-custom-cream` | Custom HRT Cream | 30,31,32,33,61,62,63,64,68,69,70,71 | St Luke | $69 |
| `hrt-custom-troche` | Custom Hormone Troche | 34,35,36,65,66,67,72,73,74 | St Luke | $29 |
| `progesterone-sr` | Progesterone Capsules (Sustained Release) | 50,51,52,53,54,55,56,57,58,59,60 | Optimal Balance Pharmacy | $19 |
| `testosterone-injection` | Testosterone Cypionate Injection | 76,77,78,79,80 | Optimal Balance Pharmacy | $59 |
| `sildenafil-testosterone-troche` | Sildenafil / Testosterone Troche | 75 | St Luke | $39 |
| `nad-nasal` | NAD+ Nasal Spray | 81,82,84,85 | St Luke | $79 |
| `glutathione-injection` | Glutathione Injection | 86,87 | St Luke | $59 |
| `semax-nasal` | Semax Nasal Spray | 118 | Greenwich Pharmacy | $129 |
| `selank-nasal` | Selank Nasal Spray | 119 | Greenwich Pharmacy | $129 |
| `thymosin-a1` | Thymosin Alpha-1 Injection | 114 | Optimal Balance Pharmacy | $159 |
| `methylene-blue` | Methylene Blue Capsules | 120,121,122,123 | Optimal Balance Pharmacy | $19 |
| `dihexa` | Dihexa Capsules | 124 | Greenwich Pharmacy | $29 |
| `dihexa-tesofensine` | Dihexa / Tesofensine Capsules | 125 | Greenwich Pharmacy | $29 |
| `bpc-tb-ghk` | BPC-157 / TB-500 / GHK-Cu Injection | 100 | Greenwich Pharmacy | $159 |
| `bpc-ghk-kpv-tb` | BPC-157 / GHK-Cu / KPV / TB-500 Injection | 101 | Greenwich Pharmacy | $159 |
| `bpc-kpv-tb` | BPC-157 / KPV / TB-500 Injection | 102 | Greenwich Pharmacy | $159 |
| `minoxidil-cream` | Minoxidil Cream | 131,132,133 | Vios | $89 |
| `minoxidil-solution` | Minoxidil Solution | 128 | Vios | $29 |
| `fin-minox` | Finasteride / Minoxidil Topical | 129,130 | Vios | $79 |
| `fin-minox-tret` | Finasteride / Minoxidil / Tretinoin Topical | 134,135,136 | Vios | $89 |
| `pt141-inj` | PT-141 Injection | 115 | Greenwich Pharmacy | $129 |
| `pt141-nasal` | PT-141 (Bremelanotide) Nasal Spray ⚠️ DO_NOT_ACTIVATE_WITHOUT_EXPLICIT_APPROVAL | 116,117 | Vios | $139 |
| `ghk-cream` | GHK-Cu Cream | 105,106,107,108,109,110,111 | St Luke | $109 |
| `mots-c` | MOTS-c Injection | 112 | Greenwich Pharmacy | $129 |
| `mots-tes` | MOTS-c / Tesamorelin Injection | 113 | Greenwich Pharmacy | $159 |

---

## F. FUTURE_HIDDEN_PENDING

**Count:** 4

| ID | Product | Gap |
|---|---|---|
| `oxytocin-nasal` | Oxytocin Nasal Spray | No SELECTED rows / incomplete formulary authority |
| `sexual-wellness-compound` | Sexual Wellness Compound Capsules | No SELECTED rows / incomplete formulary authority |
| `bimatoprost` | Lash/Brow Growth Serum (Bimatoprost) | No SELECTED rows / incomplete formulary authority |
| `scream-cream` | Scream Cream | No SELECTED rows / incomplete formulary authority |

---

## Minoxidil GEN target (no writes)

| Field | Value |
|---|---|
| Website → formulary | Finasteride/Minoxidil 0.1%/5% · Vios r129 · **$79** |
| Existing GEN CP | `BboYS4a2Uj7APetrFo6W` Hair Loss – Dual Combo (Finasteride/Minoxidil) |
| Currently paired? | **No** (price $0; not storefront eligible) |
| **GEN ACTION LATER** | **SAFE_TO_REPAIR** |
| Rejected | GHK-Cu/Minoxidil (`489YrehNXRlL77fYPkOn`) — wrong pairing; Triple Combo; plain Minoxidil |

---

## Pricing authority (unchanged)

- One-time: `(cost × 1.75) + pharmacy shipping` → nearest $X9
- 3-month: `((monthly cost × 1.75) + shipping) × 3` → nearest $X9
- 6-month: `((monthly cost × 1.75) + shipping) × 6` → nearest $X9
- SEM membership **$149** · TIR membership **$275**
- Do not invent missing cost basis

---

## Discrepancies reported (launch map NOT changed)

- ~~Architecture Wolverine split~~ → **RESOLVED** in MBM-FINAL-INTEGRITY-GATE: ONE product / TWO variants; architecture CURRENT_LIVE objects = 17; TOTAL = 65.
- NAD+ and Tretinoin: **FORMULATION_STRENGTH_CONFLICT** / `CURRENT_LIVE_STRENGTH_PENDING` — owner A/B/C choices in `MBM_FINAL_INTEGRITY_GATE.md`.
- website-current-minoxidil-topical architecture placeholder may still lack formulary_rows; lock lives in recon/amendment (row 129).
- No TIR B12/Glycine dose-group GEN CPs yet → `CREATE_REQUIRED_AT_EXECUTION` (8).

---

## FINAL REPORT

- **CURRENT_LIVE TOTAL:** 17
- **VERIFIED_CURRENT_LIVE:** 4
- **CURRENT_LIVE_FORMULARY_PENDING:** 7
- **CURRENT_LIVE_STRENGTH_PENDING:** 2 (NAD+, Tretinoin)
- **CUTOVER_READY:** 16
- **CUTOVER_BLOCKED:** 0
- **SEM CUTOVER PRODUCTS VERIFIED:** 8
- **TIR CUTOVER PRODUCTS VERIFIED:** 8
- **TIR GEN CREATE_REQUIRED:** 8
- **MEMBERSHIP_READY:** 2 (SEM $149: YES · TIR $275: YES)
- **FUTURE_HIDDEN_READY:** 28
- **FUTURE_HIDDEN_PENDING:** 4

- **MINOXIDIL:** Finasteride/Minoxidil 0.1%/5% · Vios · $79 · GEN ACTION LATER = **SAFE_TO_REPAIR**

- **UNRESOLVED CURRENT-LIVE (formulary pending):** Fat Burner · Testosterone Cream · Selank Injection · Semax Injection · Selank+Semax Nasal · Tesamorelin · Lash/Brow

- **FINAL_EXECUTION_PLAN_READY:** NO — blockers: NAD+ + Tretinoin strength conflicts (see `MBM_FINAL_INTEGRITY_GATE.md`)

- **LAUNCH MAP CHANGED:** NO
- **GEN MODIFIED:** NO
- **GEN WRITES:** 0
- **WEBSITE MODIFIED:** NO
- **CUTOVER:** OFF

---

**STOP FOR OWNER REVIEW.**

Do not start GEN-CATALOG-2B. Do not generate an execution script. Do not generate a pairing checklist.
