# CURRENT_LIVE Formulary Reconciliation (8 products)

**Generated:** 2026-08-24T21:40:56Z  
**Amended:** 2026-08-24T21:48:00Z (MBM-FORMULARY-AMENDMENT-1)  
**Phase:** MBM-FORMULARY-RECON-1 → **MBM-FORMULARY-AMENDMENT-1**  
**Mode:** READ-ONLY — no GEN writes, no website writes, no pairing changes, no deactivations  
**Launch map:** UNCHANGED (CURRENT_LIVE 17 / CUTOVER 16 / FUTURE 32 / TOTAL 65)  
**Authority:** SELECTED FORMULARY for medication identity · website catalog for what is offered today  

**Catalog ready gate:** [`MBM_SAFE_EXECUTION_SET.md`](./MBM_SAFE_EXECUTION_SET.md) — Minoxidil owner-accepted; 7 frozen as `CURRENT_LIVE_FORMULARY_PENDING`  
**Amendment queue:** [`MBM_FORMULARY_AMENDMENT_QUEUE.md`](./MBM_FORMULARY_AMENDMENT_QUEUE.md) + [`.json`](./MBM_FORMULARY_AMENDMENT_QUEUE.json)

---

## Owner decision table (post-amendment)

| PRODUCT | CURRENT WEBSITE FORMULATION | SELECTED FORMULARY MATCH | PHARMACY | GEN MATCH | CLASSIFICATION | CURRENT PRICE | NEW PRICE | OWNER DECISION NEEDED |
|---|---|---|---|---|---|---|---|---|
| Fat Burner | AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL) in 5mL | NONE | — | AOD-9604 / MOTS-C / Tesamorelin Injection (`7Kix55LA15U0lNvY9QXI`); Metabolic Triple (`yearpPaLo5H0k0FU5Ej8`) | **FORMULARY_ADDITION_REQUIRED** | $259 | — | NO — keep website; REQUEST_FROM_PHARMACY |
| Testosterone Cream | 5mg/g · 30g | NONE | — | Men's Hormones (TRT) – Testosterone Cream (`Gn4XaP00anr4q9oheSTe`) | **FORMULARY_ADDITION_REQUIRED** | $79 | — | NO — keep dedicated cream; REQUEST_FROM_PHARMACY |
| Selank Injection | 5mg/mL · 2mL | NONE | — | Selank Anxiolytic & Cognitive Protocol (`Ukctbyh5Yrek3SnGSYA3`) | **FORMULARY_ADDITION_REQUIRED** | $129 | — | NO — keep injection; REQUEST_FROM_PHARMACY |
| Semax Injection | 5mg/mL · 2mL | NONE | — | Semax Nootropic & Neuroprotective Protocol (`YTHcdrlRICMpt56hdxeJ`) | **FORMULARY_ADDITION_REQUIRED** | $129 | — | NO — keep injection; REQUEST_FROM_PHARMACY |
| Selank + Semax Blend Nasal Spray | 50mcg/50mcg per spray · 10mL | NONE | — | Semax / Selank Neuro & Cognitive Protocol (`LWkYtwm66dIeLuDSvSfi`) | **FORMULARY_ADDITION_REQUIRED** | $169 | — | NO — keep combined nasal; REQUEST_FROM_PHARMACY |
| Tesamorelin Injection | Lyophilized Tesamorelin 10mg total · 5mg/mL · 2mL vial | NONE | — | Peptides – Tesamorelin (`2cYxVfvwpWyyrANZx06G`); Tesamorelin Growth Hormone Protocol (`xSlOHrUWKRkKvzCGcsYc`) | **FORMULARY_ADDITION_REQUIRED** | $149 | — | NO — keep plain Tesamorelin; REQUEST_FROM_PHARMACY |
| Minoxidil Combination Topical Formula | Combination formula (unspecified on website) | **LOCKED:** `FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 %` (row 129) | Vios | Hair Loss Dual/Triple GEN candidates | **VERIFIED_SELECTED_FORMULARY_MATCH** | $129 | **$79** | NO — locked in MBM-FORMULARY-AMENDMENT-1 |
| Lash/Brow Growth Serum | Bimatoprost 0.03% · 2.5mL | NONE | — | — | **FORMULARY_ADDITION_REQUIRED** | $89 | — | NO — FUTURE TBD ≠ approved; REQUEST_FROM_PHARMACY |

### Minoxidil Combination — RESOLVED (VERIFIED_SELECTED_FORMULARY_MATCH)

**LOCKED:** Finasteride / Minoxidil **0.1% / 5%** · Vios · SELECTED row 129 · retail **$79** (cost $30 + ship $30 → raw $82.50 → $X9). Website copy verified compatible (no Tretinoin / alternate strength promises).

Other Fin/Minox (±Tret) options remain available as FUTURE alternatives only — not the locked CURRENT_LIVE identity.

| Option | Exact SELECTED formulation | Strength | Pharmacy | At cost | Ship | Raw retail | Final $X9 | vs website $129 |
|---:|---|---|---|---:|---:|---:|---:|---|
| 1 | FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 % (row 129) | 0.1/5 % | Vios | $30 | $30 | $82.5 | **$79** | -50 |
| 2 | FINASTERIDE/MINOXIDIL (PER ML) 0.1/7 % (row 130) | 0.1/7 % | Vios | $30 | $30 | $82.5 | **$79** | -50 |
| 3 | FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.25/5/0.01 % (row 134) | 0.25/5/0.01 % | Vios | $35 | $30 | $91.25 | **$89** | -40 |
| 4 | FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.25/5/0.03 % (row 135) | 0.25/5/0.03 % | Vios | $35 | $30 | $91.25 | **$89** | -40 |
| 5 | FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.5/5/0.01 % (row 136) | 0.5/5/0.01 % | Vios | $35 | $30 | $91.25 | **$89** | -40 |

Do **not** use GHK-Cu / Minoxidil GEN product (paired to GHK-CU only).

Plain Minoxidil 2%/7%/10%/15% rows are **not** combination formulas.

---

## Owner decisions applied (MBM-FORMULARY-AMENDMENT-1)

### Resolved
- **Minoxidil:** LOCK Finasteride/Minoxidil **0.1%/5%**, Vios, $79 (`VERIFIED_SELECTED_FORMULARY_MATCH`). Website copy verified compatible.

### Keep website product — FORMULARY_ADDITION_REQUIRED (7)
1. **Fat Burner** — AOD+MOTS+Tesamorelin **without** Ipamorelin  
2. **Testosterone Cream** — 5 mg/g dedicated cream (not Custom HRT Cream)  
3. **Selank Injection** — injection only  
4. **Semax Injection** — injection only  
5. **Selank + Semax Blend Nasal Spray** — combined formula only  
6. **Tesamorelin** — plain only (not MOTS-c blend)  
7. **Lash / Brow** — Bimatoprost (FUTURE ADDITIONS TBD ≠ approved)

Amendment search across SELECTED / SMART UPLOAD / FUTURE ADDITIONS / GEN formulary / prior workspace docs: **all 7 MISSING_FROM_AVAILABLE_FORMULARIES** → `REQUEST_FROM_PHARMACY`. Found exact outside SELECTED: **0**. Found with incomplete economics: **0**.

---

## Product detail

### Fat Burner

- **Classification:** `FORMULARY_ADDITION_REQUIRED` → `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Website:** Fat Burner · form `Injection` · ingredients ['AOD-9604', 'MOTS-C', 'Tesamorelin'] · **$259**
- **Website formulation:** AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL) in 5mL
- **Owner decision applied:** KEEP website product. Do NOT substitute AOD/MOTS/Tesamorelin/Ipamorelin.
- **Missing:** Exact 3-ingredient formulary row (pharmacy + cost + shipping + package).
- **Near misses (rejected):** Optimal Balance Ipamorelin quad @ $102+$20; SELECTED MOTS-C/Tesamorelin r113; GEN CP paired to AOD-only despite triple title.
- **GEN protect flags:** `7Kix55LA15U0lNvY9QXI`, `yearpPaLo5H0k0FU5Ej8`, `PRIG7DYPNNgco3lGf1zx`

### Testosterone Cream

- **Classification:** `FORMULARY_ADDITION_REQUIRED` → `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Website:** Testosterone Cream · form `Cream` · ingredients ['Testosterone'] · **$79**
- **Website formulation:** 5mg/g · 30g
- **Owner decision applied:** KEEP dedicated cream. Do NOT substitute Custom HRT Cream / pellet / troche / injection / combination HRT.
- **Near misses (rejected):** St Luke HRT Cream 1–4 ingredients (r68–71).
- **GEN protect flags:** `Gn4XaP00anr4q9oheSTe`

### Selank Injection

- **Classification:** `FORMULARY_ADDITION_REQUIRED` → `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Website:** Selank Injection · 5mg/mL · 2mL · **$129**
- **Owner decision applied:** KEEP injection. Do NOT substitute nasal spray.
- **Near misses (rejected):** SELECTED r119 Selank 2.5mg/mL Nasal Spray (Greenwich $60+$25).
- **GEN protect flags:** `Ukctbyh5Yrek3SnGSYA3`

### Semax Injection

- **Classification:** `FORMULARY_ADDITION_REQUIRED` → `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Website:** Semax Injection · 5mg/mL · 2mL · **$129**
- **Owner decision applied:** KEEP injection. Do NOT substitute nasal spray.
- **Near misses (rejected):** SELECTED r118 Semax 2.5mg/mL Nasal Spray (Greenwich $60+$25).
- **GEN protect flags:** `YTHcdrlRICMpt56hdxeJ`

### Selank + Semax Blend Nasal Spray

- **Classification:** `FORMULARY_ADDITION_REQUIRED` → `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Website:** 50mcg/50mcg per spray · 10mL · **$169**
- **Owner decision applied:** KEEP combined nasal. Two independent nasal medications do NOT satisfy.
- **Near misses (rejected):** SELECTED r118 + r119 separate sprays.
- **GEN protect flags:** `LWkYtwm66dIeLuDSvSfi`

### Tesamorelin Injection

- **Classification:** `FORMULARY_ADDITION_REQUIRED` → `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Website:** Lyophilized Tesamorelin 10mg total · 5mg/mL · 2mL vial · **$149**
- **Owner decision applied:** KEEP plain Tesamorelin. Do NOT adopt MOTS-c/Tesamorelin or AOD/MOTS/Tesamorelin/Ipamorelin.
- **Near misses (rejected):** SELECTED r113 MOTS-C/Tesamorelin; GEN SMART Tesamorelin/Ipamorelin.
- **GEN protect flags:** `2cYxVfvwpWyyrANZx06G`, `xSlOHrUWKRkKvzCGcsYc`

### Minoxidil Combination Topical Formula

- **Classification:** `VERIFIED_SELECTED_FORMULARY_MATCH`
- **Action:** `READY_FOR_PAIRING_WHEN_AUTHORIZED`
- **LOCKED:** Finasteride/Minoxidil **0.1%/5%** · Vios · row 129 · **$79**
- **Website copy verification:** PASS
- **GEN protect flags:** `BboYS4a2Uj7APetrFo6W`, `7sX9dhAxA6i21Jg1swrK`, `Raw7mUkuzzhVdAo88jpL`, `xKwPWxhRXlcoUonBXpg9`

### Lash/Brow Growth Serum

- **Classification:** `FORMULARY_ADDITION_REQUIRED` → `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Website:** Bimatoprost 0.03% · 2.5mL · **$89**
- **Owner decision applied:** Keep website product. FUTURE ADDITIONS Bimatoprost TBD is NOT approved without pharmacy data.
- **Near misses (rejected):** FUTURE ADDITIONS r8 placeholder only.
- **GEN protect flags:** none identified

---

## GEN objects protected from deactivation

Associated with these CURRENT_LIVE website products. **Do not deactivate** until reconciliation completes.

| GEN ID | GEN NAME | SUPPORTS WEBSITE PRODUCT | PRIOR BUCKET | WAS IN 153 DEACTIVATE LIST |
|---|---|---|---|---|
| `7Kix55LA15U0lNvY9QXI` | AOD-9604 / MOTS-C / Tesamorelin Injection | Fat Burner | REUSE_RENAME | False |
| `yearpPaLo5H0k0FU5Ej8` | AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol | Fat Burner | AMBIGUOUS_DO_NOT_TOUCH | False |
| `PRIG7DYPNNgco3lGf1zx` | AOD-9604 | Fat Burner | AMBIGUOUS_DO_NOT_TOUCH | False |
| `Gn4XaP00anr4q9oheSTe` | Men's Hormones (TRT) – Testosterone Cream | Testosterone Cream | AMBIGUOUS_DO_NOT_TOUCH | False |
| `Ukctbyh5Yrek3SnGSYA3` | Selank Anxiolytic & Cognitive Protocol | Selank Injection | AMBIGUOUS_DO_NOT_TOUCH | False |
| `YTHcdrlRICMpt56hdxeJ` | Semax Nootropic & Neuroprotective Protocol | Semax Injection | AMBIGUOUS_DO_NOT_TOUCH | False |
| `LWkYtwm66dIeLuDSvSfi` | Semax / Selank Neuro & Cognitive Protocol | Selank + Semax Blend Nasal Spray | REUSE_RENAME | False |
| `2cYxVfvwpWyyrANZx06G` | Peptides – Tesamorelin (Growth Hormone) | Tesamorelin Injection | AMBIGUOUS_DO_NOT_TOUCH | False |
| `xSlOHrUWKRkKvzCGcsYc` | Tesamorelin Growth Hormone Protocol | Tesamorelin Injection | AMBIGUOUS_DO_NOT_TOUCH | False |
| `BboYS4a2Uj7APetrFo6W` | Hair Loss – Dual Combo (Finasteride/Minoxidil) | Minoxidil Combination Topical Formula | REUSE_RENAME | False |
| `7sX9dhAxA6i21Jg1swrK` | Hair Loss – Triple Combo (Finasteride/Minoxidil/Tretinoin) | Minoxidil Combination Topical Formula | AMBIGUOUS_DO_NOT_TOUCH | False |
| `Raw7mUkuzzhVdAo88jpL` | Hair Loss – Minoxidil (Topical) | Minoxidil Combination Topical Formula | AMBIGUOUS_DO_NOT_TOUCH | False |
| `xKwPWxhRXlcoUonBXpg9` | Hair Loss - Minoxdil/Tretinoin/Fluocinolone/Finasteride Spray | Minoxidil Combination Topical Formula | AMBIGUOUS_DO_NOT_TOUCH | False |

_None of the directly associated objects above were in the prior 153 DUPLICATE/LEGACY deactivate-candidate lists; several were AMBIGUOUS or REUSE_RENAME. They are still flagged **PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION** so future cleanup cannot drop CURRENT_LIVE support._

---

## FINAL REPORT

- **CURRENT LIVE RECONCILIATION STARTING:** 8

- **MINOXIDIL RESOLVED:** YES

- **FORMULARY ADDITIONS REQUIRED:** 7
- **FOUND EXACT OUTSIDE SELECTED:** 0
- **FOUND BUT ECONOMICS INCOMPLETE:** 0
- **NOT FOUND IN AVAILABLE SOURCES:** 7
- **PHARMACY INFORMATION REQUESTS REQUIRED:** 7

- **VERIFIED_SELECTED_FORMULARY_MATCH:** 1 (Minoxidil)
- **FORMULARY_ADDITION_REQUIRED:** 7

- **FAT BURNER:** pharmacy able to compound AOD+MOTS+Tesamorelin WITHOUT Ipamorelin; concentrations 1.2/2/3 mg/mL in 5mL (or owner-approved alternate); cost; shipping
- **TESTOSTERONE CREAM:** dedicated Testosterone-only cream 5 mg/g; package (e.g. 30g); pharmacy; cost; shipping
- **SELANK INJECTION:** injectable Selank; strength (website 5mg/mL); package (2mL); pharmacy; cost; shipping
- **SEMAX INJECTION:** injectable Semax; strength (website 5mg/mL); package (2mL); pharmacy; cost; shipping
- **SELANK+SEMAX NASAL:** combined Selank+Semax nasal (single compound); strength vs 50mcg/50mcg; package (10mL); pharmacy; cost; shipping
- **TESAMORELIN:** plain Tesamorelin injectable (no MOTS-c / Ipamorelin / AOD); strength/package; pharmacy; cost; shipping
- **LASH/BROW:** Bimatoprost 0.03%; package 2.5mL; pharmacy (not TBD); cost; shipping; then OWNER_APPROVAL_TO_ADD_TO_SELECTED

- **CURRENT_LIVE FULLY RECONCILED:** NO

- **GEN OBJECTS PROTECTED FROM DEACTIVATION:** 13

- **LAUNCH MAP CHANGED:** NO
- **GEN MODIFIED:** NO
- **GEN WRITES:** 0
- **WEBSITE MODIFIED:** NO
- **GEN/WHOP CUTOVER:** OFF

---

Full amendment detail: [`MBM_FORMULARY_AMENDMENT_QUEUE.md`](./MBM_FORMULARY_AMENDMENT_QUEUE.md).

**STOP FOR OWNER REVIEW.**

No GEN pairing checklist. No GEN-CATALOG-2B.
