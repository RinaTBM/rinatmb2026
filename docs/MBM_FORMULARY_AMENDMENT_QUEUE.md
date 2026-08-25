# MBM Formulary Amendment Queue — CURRENT_LIVE Missing Formulations

**Generated:** 2026-08-24T21:48:00Z  
**Phase:** MBM-FORMULARY-AMENDMENT-1  
**Mode:** READ-ONLY planning — no GEN/website writes, no pairing, no deactivations, cutover OFF  
**Launch map:** LOCKED unchanged (17 / 16 / 32 / 65)

---

## Minoxidil — RESOLVED

| Field | Value |
|---|---|
| Classification | **VERIFIED_SELECTED_FORMULARY_MATCH** |
| Locked formulation | Finasteride / Minoxidil **0.1% / 5%** |
| Pharmacy | Vios |
| SELECTED row | 129 · `FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 %` |
| At cost | $30 |
| Shipping | $30 |
| Raw retail | $82.50 |
| **Final $X9** | **$79** |
| Current website price | $129 |

**Website copy verification:** PASS — does not promise Tretinoin, a specific Finasteride %, a specific Minoxidil %, or other named companion actives. Copy states companion ingredients are clinician/pharmacy-determined. Locking 0.1%/5% does not silently contradict published claims.

---

## Formulary amendment table (7 remaining)

| CURRENT PRODUCT | REQUIRED FORMULATION | FORM | FOUND SOURCE? | SOURCE LOCATION | PHARMACY | STRENGTH | PACKAGE | COST | SHIPPING | MATCH STATUS | PROPOSED RETAIL | ACTION REQUIRED |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Fat Burner | AOD-9604 + MOTS-c + Tesamorelin (WITHOUT Ipamorelin) | Injection | NO | — | — | — | — | — | — | **MISSING_FROM_AVAILABLE_FORMULARIES** | — | **REQUEST_FROM_PHARMACY** |
| Testosterone Cream | Testosterone Cream 5 mg/g | Cream | NO | — | — | — | — | — | — | **MISSING_FROM_AVAILABLE_FORMULARIES** | — | **REQUEST_FROM_PHARMACY** |
| Selank Injection | Selank Injection | Injection | NO | — | — | — | — | — | — | **MISSING_FROM_AVAILABLE_FORMULARIES** | — | **REQUEST_FROM_PHARMACY** |
| Semax Injection | Semax Injection | Injection | NO | — | — | — | — | — | — | **MISSING_FROM_AVAILABLE_FORMULARIES** | — | **REQUEST_FROM_PHARMACY** |
| Selank + Semax Blend Nasal Spray | Combined Selank + Semax Nasal Spray | Nasal Spray | NO | — | — | — | — | — | — | **MISSING_FROM_AVAILABLE_FORMULARIES** | — | **REQUEST_FROM_PHARMACY** |
| Tesamorelin Injection | Plain Tesamorelin (not a blend) | Injection | NO | — | — | — | — | — | — | **MISSING_FROM_AVAILABLE_FORMULARIES** | — | **REQUEST_FROM_PHARMACY** |
| Lash/Brow Growth Serum | Bimatoprost 0.03% solution | Solution | NO | — | — | — | — | — | — | **MISSING_FROM_AVAILABLE_FORMULARIES** | — | **REQUEST_FROM_PHARMACY** |

---

## Detail + exact missing information

### Fat Burner

- **Keep website product:** YES
- **Required:** Website identity: AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL) in 5mL vial
- **Status:** `FORMULARY_ADDITION_REQUIRED`
- **Match status:** `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Near misses (rejected):**
  - {'source': 'GEN SMART UPLOAD r13 + GEN formulary medId MFHi8Zq2mIOXiO8fgcw9', 'formulation': 'AOD 9604/ MOTS-C/ TESAMORELIN/ IPAMORELIN 1.2 MG/ 2 MG/ 2MG/ 2MG/ML (5 ML)', 'pharmacy': 'Optimal Balance Pharmacy', 'cost': 102, 'shipping': 20, 'why_rejected': 'Contains Ipamorelin; Tesamorelin concentration 2mg/mL ≠ website 3mg/mL. Owner forbade this substitute.'}
  - {'source': 'SELECTED FORMULARY r113', 'formulation': 'MOTS-C/Tesamorelin 2mg/3mg/mL', 'pharmacy': 'Greenwich Pharmacy', 'why_rejected': 'Missing AOD-9604; not the website triple.'}
  - {'source': 'GEN formulary / GEN CP 7Kix55LA15U0lNvY9QXI', 'formulation': 'Paired to AOD 9604 only (title suggests triple)', 'why_rejected': 'Not the full website formulation.'}
- **Exact missing information needed:**
  - Pharmacy able to compound AOD-9604 + MOTS-c + Tesamorelin WITHOUT Ipamorelin
  - Confirm concentrations matching website 1.2 / 2 / 3 mg/mL in 5mL (or owner-approved alternate package)
  - Medication cost for complete dispense package
  - Pharmacy shipping
  - Then OWNER_APPROVAL_TO_ADD_TO_SELECTED before treating as SELECTED authority

### Testosterone Cream

- **Keep website product:** YES
- **Required:** Dedicated testosterone-only cream; website 5mg/g · 30g
- **Status:** `FORMULARY_ADDITION_REQUIRED`
- **Match status:** `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Near misses (rejected):**
  - {'source': 'SELECTED FORMULARY r68–71 (St Luke HRT Cream 1–4 ingredients)', 'why_rejected': 'Custom HRT Cream family — owner forbade substitution; strength 5mg/g not specified.'}
  - {'source': "GEN SMART UPLOAD — Men's Hormones (TRT) – Testosterone Cream", 'match_status': 'NO SAFE MATCH', 'why_rejected': 'No proposed formulary row.'}
- **Exact missing information needed:**
  - Dedicated Testosterone-only cream formulary row
  - Strength confirming 5 mg/g (or owner-approved alternate)
  - Package (e.g. 30g)
  - Pharmacy
  - Medication cost + shipping
  - OWNER_APPROVAL_TO_ADD_TO_SELECTED after sourced

### Selank Injection

- **Keep website product:** YES
- **Required:** Website: 5mg/mL · 2mL injectable — not nasal
- **Status:** `FORMULARY_ADDITION_REQUIRED`
- **Match status:** `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Near misses (rejected):**
  - {'source': 'SELECTED FORMULARY r119', 'formulation': 'Selank 2.5mg/mL Nasal Spray · 20ml · Greenwich · $60+$25', 'why_rejected': 'Nasal ≠ Injection.'}
  - {'source': 'docs/PHASE_12I2_28_SKU_FORMULARY_PRICING_MATRIX', 'note': 'Already recorded NO_MATCH: no Selank injection. Do not map to nasal.'}
- **Exact missing information needed:**
  - Injectable Selank formulary listing
  - Strength (website shows 5mg/mL)
  - Package (website shows 2mL)
  - Pharmacy
  - Cost + shipping

### Semax Injection

- **Keep website product:** YES
- **Required:** Website: 5mg/mL · 2mL injectable — not nasal
- **Status:** `FORMULARY_ADDITION_REQUIRED`
- **Match status:** `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Near misses (rejected):**
  - {'source': 'SELECTED FORMULARY r118', 'formulation': 'Semax 2.5mg/mL Nasal Spray · 20ml · Greenwich · $60+$25', 'why_rejected': 'Nasal ≠ Injection.'}
- **Exact missing information needed:**
  - Injectable Semax formulary listing
  - Strength (website 5mg/mL)
  - Package (website 2mL)
  - Pharmacy
  - Cost + shipping

### Selank + Semax Blend Nasal Spray

- **Keep website product:** YES
- **Required:** Website: 50mcg/50mcg per spray · 10mL — single combined product
- **Status:** `FORMULARY_ADDITION_REQUIRED`
- **Match status:** `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Near misses (rejected):**
  - {'source': 'SELECTED r118 + r119', 'formulation': 'Separate Semax Nasal and Selank Nasal', 'why_rejected': 'Two independent nasal medications do not satisfy a combined blend SKU.'}
  - {'source': 'GEN SMART — Semax / Selank Neuro & Cognitive Protocol', 'match_status': 'NO SAFE MATCH'}
- **Exact missing information needed:**
  - Combined Selank+Semax nasal spray formulary row (single compound)
  - Strength per spray or per mL matching or owner-approved vs 50mcg/50mcg
  - Package (website 10mL)
  - Pharmacy
  - Cost + shipping

### Tesamorelin Injection

- **Keep website product:** YES
- **Required:** Website: lyophilized Tesamorelin 10mg total · 5mg/mL · 2mL vial
- **Status:** `FORMULARY_ADDITION_REQUIRED`
- **Match status:** `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Near misses (rejected):**
  - {'source': 'SELECTED r113', 'formulation': 'MOTS-C/Tesamorelin 2mg/3mg/mL · Greenwich · $79+$25', 'why_rejected': 'Blend — owner keeps plain Tesamorelin.'}
  - {'source': 'GEN SMART — Tesamorelin/Ipamorelin', 'formulation': 'Tesamorelin/Ipamorelin 3mg/2mg/mL · Greenwich · $77+$25', 'why_rejected': 'Blend with Ipamorelin.'}
  - {'source': 'GEN SMART — Peptides – Tesamorelin (Growth Hormone)', 'match_status': 'NO SAFE MATCH', 'why_rejected': 'Title exists; no proposed formulary economics.'}
- **Exact missing information needed:**
  - Plain Tesamorelin injectable formulary row (no MOTS-c, no Ipamorelin, no AOD)
  - Strength/package (website 10mg / 2mL / 5mg/mL or owner-approved alternate)
  - Pharmacy
  - Cost + shipping

### Lash/Brow Growth Serum

- **Keep website product:** YES
- **Required:** Website identity confirmed: Bimatoprost 0.03% · 2.5mL (display name Lash/Brow Growth Serum)
- **Status:** `FORMULARY_ADDITION_REQUIRED`
- **Match status:** `MISSING_FROM_AVAILABLE_FORMULARIES`
- **Action:** `REQUEST_FROM_PHARMACY`
- **Near misses (rejected):**
  - {'source': 'FUTURE ADDITIONS r8 — Bimatoprost', 'status': 'FUTURE - TBD', 'exact': 'No matching Bimatoprost entry confirmed in supplied formulary', 'pharmacy': 'TBD', 'cost': None, 'shipping': None, 'why_rejected': 'Placeholder only — not SELECTED; incomplete economics; do not promote without supporting formulary data.'}
- **Exact missing information needed:**
  - Bimatoprost (or confirmed equivalent) SELECTED-ready formulary row
  - Strength (website 0.03%)
  - Package (website 2.5mL)
  - Pharmacy (not TBD)
  - Medication cost + shipping
  - OWNER_APPROVAL_TO_ADD_TO_SELECTED after sourced (FUTURE ADDITIONS is insufficient alone)

---

## GEN protection (continued)

13 previously identified GEN objects remain **PROTECT_FROM_DEACTIVATION_PENDING_RECONCILIATION**. No deactivations. No replacement GEN objects created.

---

## FINAL REPORT

- **CURRENT LIVE RECONCILIATION STARTING:** 8
- **MINOXIDIL RESOLVED:** YES
- **FORMULARY ADDITIONS REQUIRED:** 7
- **FOUND EXACT OUTSIDE SELECTED:** 0
- **FOUND BUT ECONOMICS INCOMPLETE:** 0
- **NOT FOUND IN AVAILABLE SOURCES:** 7
- **PHARMACY INFORMATION REQUESTS REQUIRED:** 7

- **FAT BURNER:** FORMULARY_ADDITION_REQUIRED — MISSING_FROM_AVAILABLE_FORMULARIES — REQUEST_FROM_PHARMACY
- **TESTOSTERONE CREAM:** FORMULARY_ADDITION_REQUIRED — MISSING_FROM_AVAILABLE_FORMULARIES — REQUEST_FROM_PHARMACY
- **SELANK INJECTION:** FORMULARY_ADDITION_REQUIRED — MISSING_FROM_AVAILABLE_FORMULARIES — REQUEST_FROM_PHARMACY
- **SEMAX INJECTION:** FORMULARY_ADDITION_REQUIRED — MISSING_FROM_AVAILABLE_FORMULARIES — REQUEST_FROM_PHARMACY
- **SELANK+SEMAX NASAL:** FORMULARY_ADDITION_REQUIRED — MISSING_FROM_AVAILABLE_FORMULARIES — REQUEST_FROM_PHARMACY
- **TESAMORELIN:** FORMULARY_ADDITION_REQUIRED — MISSING_FROM_AVAILABLE_FORMULARIES — REQUEST_FROM_PHARMACY
- **LASH/BROW:** FORMULARY_ADDITION_REQUIRED — MISSING_FROM_AVAILABLE_FORMULARIES — REQUEST_FROM_PHARMACY
- **MINOXIDIL:** VERIFIED_SELECTED_FORMULARY_MATCH — Finasteride/Minoxidil 0.1%/5% Vios — $79

- **CURRENT_LIVE FULLY RECONCILED:** NO

- **LAUNCH MAP CHANGED:** NO
- **GEN MODIFIED:** NO
- **GEN WRITES:** 0
- **WEBSITE MODIFIED:** NO
- **CUTOVER:** OFF

---

**STOP FOR OWNER REVIEW.**

No pairing checklist. No GEN-CATALOG-2B.
