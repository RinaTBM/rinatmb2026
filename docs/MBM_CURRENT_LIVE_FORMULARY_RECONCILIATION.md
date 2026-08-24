# CURRENT_LIVE Formulary Reconciliation (8 products)

**Generated:** 2026-08-24T21:40:56Z  
**Phase:** MBM-FORMULARY-RECON-1  
**Mode:** READ-ONLY — no GEN writes, no website writes, no pairing changes, no deactivations  
**Launch map:** UNCHANGED (CURRENT_LIVE 17 / CUTOVER 16 / FUTURE 32 / TOTAL 65)  
**Authority:** SELECTED FORMULARY for medication identity · website catalog for what is offered today

---

## Owner decision table

| PRODUCT | CURRENT WEBSITE FORMULATION | SELECTED FORMULARY MATCH | PHARMACY | GEN MATCH | CLASSIFICATION | CURRENT PRICE | NEW PRICE | OWNER DECISION NEEDED |
|---|---|---|---|---|---|---|---|---|
| Fat Burner | AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL) in 5mL | NONE | — | AOD-9604 / MOTS-C / Tesamorelin Injection (`7Kix55LA15U0lNvY9QXI`); AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol (`yearpPaLo5H0k0FU5Ej8`) | **NO_SELECTED_FORMULARY_MATCH** | $259 | — (unresolved identity) | YES — Provide/select a SELECTED FORMULARY row for AOD-9604 + MOTS-C + Tesamorelin (no Ipamorelin) matching website 1.2/2/3 mg/mL in 5mL — or change website formulation/name to an existing SELECTED identity. |
| Testosterone Cream | 5mg/g · 30g | NONE | — | Men's Hormones (TRT) – Testosterone Cream (`Gn4XaP00anr4q9oheSTe`); Men's Hormones – Nandrolone / Testosterone Cream (`RWtVLDbXlP7rsR31FXmH`) | **NO_SELECTED_FORMULARY_MATCH** | $79 | — (unresolved identity) | YES — Add exact Testosterone Cream (strength/package, e.g. 5mg/g 30g) to SELECTED FORMULARY, or explicitly approve mapping to St Luke 1-ingredient HRT cream with a defined testosterone strength. |
| Selank Injection | 5mg/mL · 2mL | NONE | — | Selank Anxiolytic & Cognitive Protocol (`Ukctbyh5Yrek3SnGSYA3`) | **NO_SELECTED_FORMULARY_MATCH** | $129 | — (unresolved identity) | YES — Add SELECTED injectable Selank (form + strength + package + pharmacy + cost), or change website product to Selank Nasal Spray (FUTURE_HIDDEN architecture exists). |
| Semax Injection | 5mg/mL · 2mL | NONE | — | Semax Nootropic & Neuroprotective Protocol (`YTHcdrlRICMpt56hdxeJ`) | **NO_SELECTED_FORMULARY_MATCH** | $129 | — (unresolved identity) | YES — Add SELECTED injectable Semax, or change website product to Semax Nasal Spray. |
| Selank + Semax Blend Nasal Spray | 50mcg/50mcg per spray · 10mL | NONE | — | Semax / Selank Neuro & Cognitive Protocol (`LWkYtwm66dIeLuDSvSfi`) | **NO_SELECTED_FORMULARY_MATCH** | $169 | — (unresolved identity) | YES — Add a SELECTED combined Selank+Semax nasal formulation, or replace website blend with two separate nasal products / remove blend SKU. |
| Tesamorelin Injection | Lyophilized Tesamorelin 10mg total · 5mg/mL · 2mL vial | NONE | — | Peptides – Tesamorelin (Growth Hormone) (`2cYxVfvwpWyyrANZx06G`); Tesamorelin Growth Hormone Protocol (`xSlOHrUWKRkKvzCGcsYc`) | **FORMULATION_CONFLICT** | $149 | — (unresolved identity) | YES — Either (A) add plain Tesamorelin to SELECTED, or (B) rename website product to MOTS-c / Tesamorelin blend and accept SELECTED r113 (would become VERIFIED_RENAME_MATCH / STRUCTURE_CHANGE after approval). |
| Minoxidil Combination Topical Formula | Combination formula (unspecified on website) | 5 SELECTED combo options (see below) | Vios (all combination options) | Hair Loss – Dual Combo (Finasteride/Minoxidil) (`BboYS4a2Uj7APetrFo6W`); Hair Loss – Triple Combo (Finasteride/Minoxidil/Tretinoin) (`7sX9dhAxA6i21Jg1swrK`) | **MULTIPLE_VALID_OPTIONS** | $129 | Depends on owner choice (see options) | YES — Choose which SELECTED combination formula the website product represents (or split into multiple storefront SKUs). |
| Lash/Brow Growth Serum | Bimatoprost 0.03% · 2.5mL | NONE | — | — | **NO_SELECTED_FORMULARY_MATCH** | $89 | — (unresolved identity) | YES — Source and add Bimatoprost (or exact lash/brow active) into SELECTED FORMULARY with pharmacy/cost, or retire/replace the website product after cutover planning. |

### Minoxidil Combination — MULTIPLE_VALID_OPTIONS (owner must choose)

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

## Product detail

### Fat Burner

- **Classification:** `NO_SELECTED_FORMULARY_MATCH`
- **Website:** Fat Burner · form `Injection` · ingredients ['AOD-9604', 'MOTS-C', 'Tesamorelin'] · **$259**
- **Website formulation:** AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL) in 5mL
- **Missing:** SELECTED FORMULARY has no AOD-9604 and no AOD+MOTS-C+Tesamorelin triple. Do not invent from GEN Ipamorelin quad.
- **Related SELECTED / notes (not a safe match):**
  - {'excel_row': 112, 'exact': 'MOTS-C 2mg/mL', 'note': 'MOTS-C only — missing AOD-9604 and Tesamorelin'}
  - {'excel_row': 113, 'exact': 'MOTS-C/Tesamorelin 2mg/3mg/mL', 'note': 'Missing AOD-9604; different ratios vs website 2mg/mL MOTS-C + 3mg/mL Tesamorelin in different total amounts'}
- **Owner decision:** Provide/select a SELECTED FORMULARY row for AOD-9604 + MOTS-C + Tesamorelin (no Ipamorelin) matching website 1.2/2/3 mg/mL in 5mL — or change website formulation/name to an existing SELECTED identity.
- **GEN protect flags:**
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — AOD-9604 / MOTS-C / Tesamorelin Injection (`7Kix55LA15U0lNvY9QXI`) · prior bucket `REUSE_RENAME` · was in 153 deactivate list: False
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol (`yearpPaLo5H0k0FU5Ej8`) · prior bucket `AMBIGUOUS_DO_NOT_TOUCH` · was in 153 deactivate list: False
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — AOD-9604 (`PRIG7DYPNNgco3lGf1zx`) · prior bucket `AMBIGUOUS_DO_NOT_TOUCH` · was in 153 deactivate list: False

### Testosterone Cream

- **Classification:** `NO_SELECTED_FORMULARY_MATCH`
- **Website:** Testosterone Cream · form `Cream` · ingredients ['Testosterone'] · **$79**
- **Website formulation:** 5mg/g · 30g
- **Missing:** No SELECTED row for Testosterone-only cream at 5mg/g. Custom HRT Cream must not be silently substituted.
- **Related SELECTED / notes (not a safe match):**
  - {'excel_rows': [68, 69, 70, 71], 'exact': 'HRT Cream - 1–4 Ingredients (…/Testosterone)', 'pharmacy': 'St Luke', 'cost_range': '25–40 + ship 30', 'note': 'Customizable HRT cream CAN include testosterone as one ingredient, but is NOT a locked Testosterone 5mg/g product. Owner forbade substituting Custom HRT Cream.'}
  - {'note': 'SELECTED Testosterone Cypionate injections exist — wrong form (injection ≠ cream).'}
  - {'note': 'Sildenafil/Testosterone troche exists — wrong form.'}
- **Owner decision:** Add exact Testosterone Cream (strength/package, e.g. 5mg/g 30g) to SELECTED FORMULARY, or explicitly approve mapping to St Luke 1-ingredient HRT cream with a defined testosterone strength.
- **GEN protect flags:**
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — Men's Hormones (TRT) – Testosterone Cream (`Gn4XaP00anr4q9oheSTe`) · prior bucket `AMBIGUOUS_DO_NOT_TOUCH` · was in 153 deactivate list: False

### Selank Injection

- **Classification:** `NO_SELECTED_FORMULARY_MATCH`
- **Website:** Selank Injection · form `Injection` · ingredients ['Selank'] · **$129**
- **Website formulation:** 5mg/mL · 2mL
- **Missing:** SELECTED has Selank Nasal Spray only. No injectable Selank row.
- **Related SELECTED / notes (not a safe match):**
  - {'excel_row': 119, 'exact': 'Selank 2.5mg/mL Nasal Spray', 'pharmacy': 'Greenwich Pharmacy', 'cost': 60, 'ship': 25, 'note': 'NASAL only — must not map to injection.'}
- **Owner decision:** Add SELECTED injectable Selank (form + strength + package + pharmacy + cost), or change website product to Selank Nasal Spray (FUTURE_HIDDEN architecture exists).
- **GEN protect flags:**
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — Selank Anxiolytic & Cognitive Protocol (`Ukctbyh5Yrek3SnGSYA3`) · prior bucket `AMBIGUOUS_DO_NOT_TOUCH` · was in 153 deactivate list: False

### Semax Injection

- **Classification:** `NO_SELECTED_FORMULARY_MATCH`
- **Website:** Semax Injection · form `Injection` · ingredients ['Semax'] · **$129**
- **Website formulation:** 5mg/mL · 2mL
- **Missing:** SELECTED has Semax Nasal Spray only. No injectable Semax row.
- **Related SELECTED / notes (not a safe match):**
  - {'excel_row': 118, 'exact': 'Semax 2.5mg/mL Nasal Spray', 'pharmacy': 'Greenwich Pharmacy', 'cost': 60, 'ship': 25, 'note': 'NASAL only — must not map to injection.'}
- **Owner decision:** Add SELECTED injectable Semax, or change website product to Semax Nasal Spray.
- **GEN protect flags:**
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — Semax Nootropic & Neuroprotective Protocol (`YTHcdrlRICMpt56hdxeJ`) · prior bucket `AMBIGUOUS_DO_NOT_TOUCH` · was in 153 deactivate list: False

### Selank + Semax Blend Nasal Spray

- **Classification:** `NO_SELECTED_FORMULARY_MATCH`
- **Website:** Selank + Semax Blend Nasal Spray · form `Nasal Spray` · ingredients ['Selank', 'Semax'] · **$169**
- **Website formulation:** 50mcg/50mcg per spray · 10mL
- **Missing:** No combined Selank+Semax nasal row in SELECTED. Separate nasal rows cannot satisfy this product.
- **Related SELECTED / notes (not a safe match):**
  - {'excel_row': 118, 'exact': 'Semax 2.5mg/mL Nasal Spray', 'note': 'Semax alone — not a blend'}
  - {'excel_row': 119, 'exact': 'Selank 2.5mg/mL Nasal Spray', 'note': 'Selank alone — not a blend'}
- **Owner decision:** Add a SELECTED combined Selank+Semax nasal formulation, or replace website blend with two separate nasal products / remove blend SKU.
- **GEN protect flags:**
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — Semax / Selank Neuro & Cognitive Protocol (`LWkYtwm66dIeLuDSvSfi`) · prior bucket `REUSE_RENAME` · was in 153 deactivate list: False

### Tesamorelin Injection

- **Classification:** `FORMULATION_CONFLICT`
- **Website:** Tesamorelin Injection · form `Injection` · ingredients ['Tesamorelin'] · **$149**
- **Website formulation:** Lyophilized Tesamorelin 10mg total · 5mg/mL · 2mL vial
- **Missing:** SELECTED has no plain Tesamorelin. Only MOTS-C/Tesamorelin blend.
- **Related SELECTED / notes (not a safe match):**
  - {'excel_row': 113, 'exact': 'MOTS-C/Tesamorelin 2mg/3mg/mL', 'pharmacy': 'Greenwich Pharmacy', 'cost': 79, 'ship': 25, 'note': 'BLEND containing Tesamorelin — not plain Tesamorelin. Do not map without renaming patient-facing product.'}
- **Owner decision:** Either (A) add plain Tesamorelin to SELECTED, or (B) rename website product to MOTS-c / Tesamorelin blend and accept SELECTED r113 (would become VERIFIED_RENAME_MATCH / STRUCTURE_CHANGE after approval).
- **GEN protect flags:**
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — Peptides – Tesamorelin (Growth Hormone) (`2cYxVfvwpWyyrANZx06G`) · prior bucket `AMBIGUOUS_DO_NOT_TOUCH` · was in 153 deactivate list: False
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — Tesamorelin Growth Hormone Protocol (`xSlOHrUWKRkKvzCGcsYc`) · prior bucket `AMBIGUOUS_DO_NOT_TOUCH` · was in 153 deactivate list: False

### Minoxidil Combination Topical Formula

- **Classification:** `MULTIPLE_VALID_OPTIONS`
- **Website:** Minoxidil Combination Topical Formula · form `Topical Solution` · ingredients ['Minoxidil', '(other actives unspecified on storefront)'] · **$129**
- **Website formulation:** Combination formula (unspecified on website)
- **Explicitly excluded:**
  - {'exact': 'MINOXIDIL 2% / 7% / 10% / 15%', 'reason': 'Plain minoxidil — not combination'}
  - {'gen_name': 'GHK-Cu / Minoxidil Topical Combo', 'gen_id': '489YrehNXRlL77fYPkOn', 'reason': 'GEN title suggests combo but formulary pairing is GHK-CU only @ Greenwich — do not reuse as Minoxidil combination match'}
- **Owner decision:** Choose which SELECTED combination formula the website product represents (or split into multiple storefront SKUs).
- **GEN protect flags:**
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — Hair Loss – Dual Combo (Finasteride/Minoxidil) (`BboYS4a2Uj7APetrFo6W`) · prior bucket `REUSE_RENAME` · was in 153 deactivate list: False
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — Hair Loss – Triple Combo (Finasteride/Minoxidil/Tretinoin) (`7sX9dhAxA6i21Jg1swrK`) · prior bucket `AMBIGUOUS_DO_NOT_TOUCH` · was in 153 deactivate list: False
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — Hair Loss – Minoxidil (Topical) (`Raw7mUkuzzhVdAo88jpL`) · prior bucket `AMBIGUOUS_DO_NOT_TOUCH` · was in 153 deactivate list: False
  - `PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION` — Hair Loss - Minoxdil/Tretinoin/Fluocinolone/Finasteride Spray (`xKwPWxhRXlcoUonBXpg9`) · prior bucket `AMBIGUOUS_DO_NOT_TOUCH` · was in 153 deactivate list: False

### Lash/Brow Growth Serum

- **Classification:** `NO_SELECTED_FORMULARY_MATCH`
- **Website:** Lash/Brow Growth Serum · form `Solution` · ingredients ['Bimatoprost'] · **$89**
- **Website formulation:** Bimatoprost 0.03% · 2.5mL
- **Missing:** SELECTED FORMULARY has zero Bimatoprost rows. FUTURE ADDITIONS explicitly says source match needed.
- **Related SELECTED / notes (not a safe match):**
  - {'source': 'FUTURE ADDITIONS', 'product': 'Bimatoprost', 'status': 'FUTURE - TBD', 'exact': 'No matching Bimatoprost entry confirmed in supplied formulary', 'note': 'FUTURE ADDITIONS is NOT SELECTED. Do not promote into SELECTED.'}
- **Owner decision:** Source and add Bimatoprost (or exact lash/brow active) into SELECTED FORMULARY with pharmacy/cost, or retire/replace the website product after cutover planning.

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

- **CURRENT_LIVE RECONCILIATION PRODUCTS:** 8

- **EXACT_FORMULARY_MATCH:** 0
- **VERIFIED_RENAME_MATCH:** 0
- **VERIFIED_STRUCTURE_CHANGE:** 0
- **MULTIPLE_VALID_OPTIONS:** 1
- **NO_SELECTED_FORMULARY_MATCH:** 6
- **FORMULATION_CONFLICT:** 1

- **READY WITHOUT OWNER DECISION:** 0
- **OWNER DECISIONS REQUIRED:** 8
- **MISSING FORMULARY PRODUCTS:**
  - AOD-9604 + MOTS-C + Tesamorelin triple (website Fat Burner identity)
  - Testosterone Cream 5mg/g (dedicated)
  - Selank Injection
  - Semax Injection
  - Selank + Semax combined Nasal Spray
  - Plain Tesamorelin Injection
  - Bimatoprost / Lash-Brow solution in SELECTED

- **FAT BURNER:** NO_SELECTED_FORMULARY_MATCH
- **TESTOSTERONE CREAM:** NO_SELECTED_FORMULARY_MATCH
- **SELANK INJECTION:** NO_SELECTED_FORMULARY_MATCH
- **SEMAX INJECTION:** NO_SELECTED_FORMULARY_MATCH
- **SELANK+SEMAX NASAL:** NO_SELECTED_FORMULARY_MATCH
- **TESAMORELIN:** FORMULATION_CONFLICT
- **MINOXIDIL COMBINATION:** MULTIPLE_VALID_OPTIONS
- **LASH/BROW:** NO_SELECTED_FORMULARY_MATCH

- **GEN OBJECTS PROTECTED FROM DEACTIVATION:** 13

- **LAUNCH MAP CHANGED:** NO
- **GEN MODIFIED:** NO
- **GEN WRITES:** 0
- **WEBSITE MODIFIED:** NO
- **GEN/WHOP CUTOVER:** OFF

---

**STOP FOR OWNER REVIEW.**

No GEN pairing checklist. No GEN-CATALOG-2B.
