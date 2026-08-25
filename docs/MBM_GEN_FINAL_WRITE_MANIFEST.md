# MBM GEN Final Write Manifest

**Generated:** 2026-08-25T00:38:03Z  
**Phase:** MBM-GEN-EXECUTION-PREFLIGHT-1  
**Mode:** FINAL READ-ONLY PREFLIGHT — **DO NOT EXECUTE**  

Owner decisions: **LOCKED 8/8** · Website architecture: **LOCKED** · Cutover: **OFF**

## Dedupe summary

- **Execution-eligible website variants:** 38
- **Unique GEN products to CREATE:** 8
- **Unique GEN products to REPAIR:** 10
- **Unique GEN CPs needing pairing:** 8 (active 6 · deferred FUTURE_HIDDEN launch 2)
- _38 website variants map to fewer unique GEN mutations via shared CPs (e.g. Estradiol patches×4 → 1 CP; Progesterone IR×9 → 1 CP; NAD nasal×2 → 1 CP)_

## Pairing API status

**PAIRING_EXECUTION_METHOD = MANUAL_GEN_ADMIN**

NOT_AVAILABLE — Client Products API cannot write formulary pairings (documented in GEN_CATALOG_2A_LIVE_WRITE_REPORT / GEN_LIVE_FORMULARY_PAIRING_AUDIT)

API_WRITABLE pairing actions: **0**

---

# SECTION A — GEN PRODUCTS TO CREATE

**TIR validation:** expected 4 B12 tier + 4 Glycine tier → B12=4 Glycine=4 · **exactly supported: True**

Forbidden reuse: Tirzepatide/B12/Glycine, Tirzepatide/Glycine/B12, legacy GLP-2 plan objects

## A1. Starting / Low (5+10) · Vitamin B12

- **Website family:** Tirzepatide
- **Website variant(s):** `tir-b12-starting-low`
- **Proposed GEN internal name:** Starting / Low (5+10) · Vitamin B12
- **Proposed GEN display name:** Starting / Low (5+10) · Vitamin B12
- **Form:** Injection
- **Formulation / additive:** Vitamin B12
- **Dose/tier:** Starting / Low (5+10)
- **Customer price:** 119–139
- **Status:** draft_until_cutover
- **storefrontEligible / showPatient:** `False` (enable at cutover)
- **Preflight:** `READY`

**Exact formulary rows to attach:**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship | x9 |
|---:|---|---|---|---|---:|---:|---:|
| 14 | TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | 5mg/0.5mg/mL | 2mL | Dirx-Hub | 65 | 5 | 119 |
| 16 | TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | 10mg/0.5mg/mL | 2mL | Dirx-Hub | 75 | 5 | 139 |

**Why new GEN CP required:** No appropriate TIR B12-only or Glycine-only dose-group CP exists. Must not reuse Tirzepatide/B12/Glycine, Tirzepatide/Glycine/B12, or legacy GLP-2 plan objects.

**Searched existing candidates (rejected):**
- `SvFDJ7W4nmWL2bkLUMMS` — GLP-2 Weight Loss – Tirzepatide (Any Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `43kVbBgNLBocKyVUhQmG` — GLP-2 Weight Loss – Tirzepatide (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `mhUSqSGlaFVCghW3V3DD` — GLP-2 Weight Loss – Tirzepatide (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `I1cJ6CdD2A1WTBjNrZOw` — GLP-2 Weight Loss – Tirzepatide (Oral Drops) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `4ZWsN26iLt5ZpiLS1HCC` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `HYsMU8nGWX3WIziifSWH` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs

## A2. Mid (15+20) · Vitamin B12

- **Website family:** Tirzepatide
- **Website variant(s):** `tir-b12-mid`
- **Proposed GEN internal name:** Mid (15+20) · Vitamin B12
- **Proposed GEN display name:** Mid (15+20) · Vitamin B12
- **Form:** Injection
- **Formulation / additive:** Vitamin B12
- **Dose/tier:** Mid (15+20)
- **Customer price:** 149–159
- **Status:** draft_until_cutover
- **storefrontEligible / showPatient:** `False` (enable at cutover)
- **Preflight:** `READY`

**Exact formulary rows to attach:**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship | x9 |
|---:|---|---|---|---|---:|---:|---:|
| 18 | TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) | 15mg/0.5mg/mL | 2mL | Dirx-Hub | 85 | 5 | 149 |
| 20 | TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | 20mg/0.5mg/mL | 2mL | Dirx-Hub | 90 | 5 | 159 |

**Why new GEN CP required:** No appropriate TIR B12-only or Glycine-only dose-group CP exists. Must not reuse Tirzepatide/B12/Glycine, Tirzepatide/Glycine/B12, or legacy GLP-2 plan objects.

**Searched existing candidates (rejected):**
- `SvFDJ7W4nmWL2bkLUMMS` — GLP-2 Weight Loss – Tirzepatide (Any Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `43kVbBgNLBocKyVUhQmG` — GLP-2 Weight Loss – Tirzepatide (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `mhUSqSGlaFVCghW3V3DD` — GLP-2 Weight Loss – Tirzepatide (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `I1cJ6CdD2A1WTBjNrZOw` — GLP-2 Weight Loss – Tirzepatide (Oral Drops) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `4ZWsN26iLt5ZpiLS1HCC` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `HYsMU8nGWX3WIziifSWH` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs

## A3. High (25+30) · Vitamin B12

- **Website family:** Tirzepatide
- **Website variant(s):** `tir-b12-high`
- **Proposed GEN internal name:** High (25+30) · Vitamin B12
- **Proposed GEN display name:** High (25+30) · Vitamin B12
- **Form:** Injection
- **Formulation / additive:** Vitamin B12
- **Dose/tier:** High (25+30)
- **Customer price:** 169–179
- **Status:** draft_until_cutover
- **storefrontEligible / showPatient:** `False` (enable at cutover)
- **Preflight:** `READY`

**Exact formulary rows to attach:**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship | x9 |
|---:|---|---|---|---|---:|---:|---:|
| 22 | TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) | 25mg/0.5mg/mL | 2mL | Dirx-Hub | 95 | 5 | 169 |
| 24 | TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | 30mg/0.5mg/mL | 2mL | Dirx-Hub | 100 | 5 | 179 |

**Why new GEN CP required:** No appropriate TIR B12-only or Glycine-only dose-group CP exists. Must not reuse Tirzepatide/B12/Glycine, Tirzepatide/Glycine/B12, or legacy GLP-2 plan objects.

**Searched existing candidates (rejected):**
- `SvFDJ7W4nmWL2bkLUMMS` — GLP-2 Weight Loss – Tirzepatide (Any Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `43kVbBgNLBocKyVUhQmG` — GLP-2 Weight Loss – Tirzepatide (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `mhUSqSGlaFVCghW3V3DD` — GLP-2 Weight Loss – Tirzepatide (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `I1cJ6CdD2A1WTBjNrZOw` — GLP-2 Weight Loss – Tirzepatide (Oral Drops) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `4ZWsN26iLt5ZpiLS1HCC` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `HYsMU8nGWX3WIziifSWH` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs

## A4. Any Dose (5–30) · Vitamin B12

- **Website family:** Tirzepatide
- **Website variant(s):** `tir-b12-any-dose`
- **Proposed GEN internal name:** Any Dose (5–30) · Vitamin B12
- **Proposed GEN display name:** Any Dose (5–30) · Vitamin B12
- **Form:** Injection
- **Formulation / additive:** Vitamin B12
- **Dose/tier:** Any Dose (5–30)
- **Customer price:** 119–179
- **Status:** draft_until_cutover
- **storefrontEligible / showPatient:** `False` (enable at cutover)
- **Preflight:** `READY`

**Exact formulary rows to attach:**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship | x9 |
|---:|---|---|---|---|---:|---:|---:|
| 14 | TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | 5mg/0.5mg/mL | 2mL | Dirx-Hub | 65 | 5 | 119 |
| 16 | TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | 10mg/0.5mg/mL | 2mL | Dirx-Hub | 75 | 5 | 139 |
| 18 | TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) | 15mg/0.5mg/mL | 2mL | Dirx-Hub | 85 | 5 | 149 |
| 20 | TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | 20mg/0.5mg/mL | 2mL | Dirx-Hub | 90 | 5 | 159 |
| 22 | TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) | 25mg/0.5mg/mL | 2mL | Dirx-Hub | 95 | 5 | 169 |
| 24 | TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | 30mg/0.5mg/mL | 2mL | Dirx-Hub | 100 | 5 | 179 |

**Why new GEN CP required:** No appropriate TIR B12-only or Glycine-only dose-group CP exists. Must not reuse Tirzepatide/B12/Glycine, Tirzepatide/Glycine/B12, or legacy GLP-2 plan objects.

**Searched existing candidates (rejected):**
- `SvFDJ7W4nmWL2bkLUMMS` — GLP-2 Weight Loss – Tirzepatide (Any Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `43kVbBgNLBocKyVUhQmG` — GLP-2 Weight Loss – Tirzepatide (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `mhUSqSGlaFVCghW3V3DD` — GLP-2 Weight Loss – Tirzepatide (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `I1cJ6CdD2A1WTBjNrZOw` — GLP-2 Weight Loss – Tirzepatide (Oral Drops) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `4ZWsN26iLt5ZpiLS1HCC` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `HYsMU8nGWX3WIziifSWH` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs

## A5. Starting / Low (5+10) · Glycine

- **Website family:** Tirzepatide
- **Website variant(s):** `tir-glycine-starting-low`
- **Proposed GEN internal name:** Starting / Low (5+10) · Glycine
- **Proposed GEN display name:** Starting / Low (5+10) · Glycine
- **Form:** Injection
- **Formulation / additive:** Glycine
- **Dose/tier:** Starting / Low (5+10)
- **Customer price:** 119–139
- **Status:** draft_until_cutover
- **storefrontEligible / showPatient:** `False` (enable at cutover)
- **Preflight:** `READY`

**Exact formulary rows to attach:**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship | x9 |
|---:|---|---|---|---|---:|---:|---:|
| 13 | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | 5mg/0.5mg/mL | 2mL | Dirx-Hub | 65 | 5 | 119 |
| 15 | TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) | 10mg/0.5mg/mL | 2mL | Dirx-Hub | 75 | 5 | 139 |

**Why new GEN CP required:** No appropriate TIR B12-only or Glycine-only dose-group CP exists. Must not reuse Tirzepatide/B12/Glycine, Tirzepatide/Glycine/B12, or legacy GLP-2 plan objects.

**Searched existing candidates (rejected):**
- `SvFDJ7W4nmWL2bkLUMMS` — GLP-2 Weight Loss – Tirzepatide (Any Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `43kVbBgNLBocKyVUhQmG` — GLP-2 Weight Loss – Tirzepatide (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `mhUSqSGlaFVCghW3V3DD` — GLP-2 Weight Loss – Tirzepatide (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `I1cJ6CdD2A1WTBjNrZOw` — GLP-2 Weight Loss – Tirzepatide (Oral Drops) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `4ZWsN26iLt5ZpiLS1HCC` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `HYsMU8nGWX3WIziifSWH` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs

## A6. Mid (15+20) · Glycine

- **Website family:** Tirzepatide
- **Website variant(s):** `tir-glycine-mid`
- **Proposed GEN internal name:** Mid (15+20) · Glycine
- **Proposed GEN display name:** Mid (15+20) · Glycine
- **Form:** Injection
- **Formulation / additive:** Glycine
- **Dose/tier:** Mid (15+20)
- **Customer price:** 149–159
- **Status:** draft_until_cutover
- **storefrontEligible / showPatient:** `False` (enable at cutover)
- **Preflight:** `READY`

**Exact formulary rows to attach:**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship | x9 |
|---:|---|---|---|---|---:|---:|---:|
| 17 | TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) | 15mg/0.5mg/mL | 2mL | Dirx-Hub | 85 | 5 | 149 |
| 19 | TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) | 20mg/0.5mg/mL | 2mL | Dirx-Hub | 90 | 5 | 159 |

**Why new GEN CP required:** No appropriate TIR B12-only or Glycine-only dose-group CP exists. Must not reuse Tirzepatide/B12/Glycine, Tirzepatide/Glycine/B12, or legacy GLP-2 plan objects.

**Searched existing candidates (rejected):**
- `SvFDJ7W4nmWL2bkLUMMS` — GLP-2 Weight Loss – Tirzepatide (Any Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `43kVbBgNLBocKyVUhQmG` — GLP-2 Weight Loss – Tirzepatide (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `mhUSqSGlaFVCghW3V3DD` — GLP-2 Weight Loss – Tirzepatide (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `I1cJ6CdD2A1WTBjNrZOw` — GLP-2 Weight Loss – Tirzepatide (Oral Drops) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `4ZWsN26iLt5ZpiLS1HCC` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `HYsMU8nGWX3WIziifSWH` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs

## A7. High (25+30) · Glycine

- **Website family:** Tirzepatide
- **Website variant(s):** `tir-glycine-high`
- **Proposed GEN internal name:** High (25+30) · Glycine
- **Proposed GEN display name:** High (25+30) · Glycine
- **Form:** Injection
- **Formulation / additive:** Glycine
- **Dose/tier:** High (25+30)
- **Customer price:** 169–179
- **Status:** draft_until_cutover
- **storefrontEligible / showPatient:** `False` (enable at cutover)
- **Preflight:** `READY`

**Exact formulary rows to attach:**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship | x9 |
|---:|---|---|---|---|---:|---:|---:|
| 21 | TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) | 25mg/0.5mg/mL | 2mL | Dirx-Hub | 95 | 5 | 169 |
| 23 | TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | 30mg/0.5mg/mL | 2mL | Dirx-Hub | 100 | 5 | 179 |

**Why new GEN CP required:** No appropriate TIR B12-only or Glycine-only dose-group CP exists. Must not reuse Tirzepatide/B12/Glycine, Tirzepatide/Glycine/B12, or legacy GLP-2 plan objects.

**Searched existing candidates (rejected):**
- `SvFDJ7W4nmWL2bkLUMMS` — GLP-2 Weight Loss – Tirzepatide (Any Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `43kVbBgNLBocKyVUhQmG` — GLP-2 Weight Loss – Tirzepatide (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `mhUSqSGlaFVCghW3V3DD` — GLP-2 Weight Loss – Tirzepatide (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `I1cJ6CdD2A1WTBjNrZOw` — GLP-2 Weight Loss – Tirzepatide (Oral Drops) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `4ZWsN26iLt5ZpiLS1HCC` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `HYsMU8nGWX3WIziifSWH` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs

## A8. Any Dose (5–30) · Glycine

- **Website family:** Tirzepatide
- **Website variant(s):** `tir-glycine-any-dose`
- **Proposed GEN internal name:** Any Dose (5–30) · Glycine
- **Proposed GEN display name:** Any Dose (5–30) · Glycine
- **Form:** Injection
- **Formulation / additive:** Glycine
- **Dose/tier:** Any Dose (5–30)
- **Customer price:** 119–179
- **Status:** draft_until_cutover
- **storefrontEligible / showPatient:** `False` (enable at cutover)
- **Preflight:** `READY`

**Exact formulary rows to attach:**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship | x9 |
|---:|---|---|---|---|---:|---:|---:|
| 13 | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | 5mg/0.5mg/mL | 2mL | Dirx-Hub | 65 | 5 | 119 |
| 15 | TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) | 10mg/0.5mg/mL | 2mL | Dirx-Hub | 75 | 5 | 139 |
| 17 | TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) | 15mg/0.5mg/mL | 2mL | Dirx-Hub | 85 | 5 | 149 |
| 19 | TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) | 20mg/0.5mg/mL | 2mL | Dirx-Hub | 90 | 5 | 159 |
| 21 | TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) | 25mg/0.5mg/mL | 2mL | Dirx-Hub | 95 | 5 | 169 |
| 23 | TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | 30mg/0.5mg/mL | 2mL | Dirx-Hub | 100 | 5 | 179 |

**Why new GEN CP required:** No appropriate TIR B12-only or Glycine-only dose-group CP exists. Must not reuse Tirzepatide/B12/Glycine, Tirzepatide/Glycine/B12, or legacy GLP-2 plan objects.

**Searched existing candidates (rejected):**
- `SvFDJ7W4nmWL2bkLUMMS` — GLP-2 Weight Loss – Tirzepatide (Any Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `43kVbBgNLBocKyVUhQmG` — GLP-2 Weight Loss – Tirzepatide (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `mhUSqSGlaFVCghW3V3DD` — GLP-2 Weight Loss – Tirzepatide (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `I1cJ6CdD2A1WTBjNrZOw` — GLP-2 Weight Loss – Tirzepatide (Oral Drops) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `4ZWsN26iLt5ZpiLS1HCC` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (High Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs
- `HYsMU8nGWX3WIziifSWH` — GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (Low Dose) — Ambiguous additive combo or legacy GLP-2 plan object — forbidden for cutover TIR dose-group CPs

---

# SECTION B — GEN PRODUCTS TO REPAIR

## B1. `SkqQHmsc0WdsbK9vmV1y`

- **Current name:** Semaglutide Injection — Starting / Low (B12)
- **Current display:** Semaglutide Injection — Starting / Low (B12)
- **Current price:** 99
- **Current storefrontEligible:** True
- **Current formulary attachments:** 1
  - Semaglutide + Vitamin B12 @ Dirx-Hub · medId `gqe6H8ay1sw6QlS32SMH`
- **Desired name:** Semaglutide Injection — Starting / Low (B12)
- **Desired display:** Starting / Low · Vitamin B12
- **Desired price:** 89–99 _(note: Band prices: GEN holds one amount within band until cutover policy refined)_
- **Desired storefrontEligible:** True
- **Price check:** `PRICE_BAND_OK` — Current $99.0 within locked band $89–$99 (GEN holds single price)
- **Website variant(s):** `sem-b12-starting-low`
- **Exact reason:** SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP exists but not proven ROUTING_READY (pairing/price verification incomplete).
- **Preflight:** `READY_WITH_MANUAL_PAIRING`

**Attachments to REMOVE:**
- _(none flagged by pharmacy/additive heuristics)_

**Attachments to KEEP (pending strength verify in admin):**
- KEEP/VERIFY Semaglutide + Vitamin B12 @ Dirx-Hub

**Attachments to ADD (SELECTED rows — no inferred medicationId):**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship |
|---:|---|---|---|---|---:|---:|
| 3 | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | 1mL | Dirx-Hub | 50 | 5 |
| 5 | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | 1mL | Dirx-Hub | 55 | 5 |

## B2. `34I2X8MpVZf3AQTff3bo`

- **Current name:** Semaglutide Injection — High (B12)
- **Current display:** Semaglutide Injection — High (B12)
- **Current price:** 119
- **Current storefrontEligible:** True
- **Current formulary attachments:** 1
  - Semaglutide + Vitamin B12 @ Dirx-Hub · medId `YqrJ1qnOv3U3ecJHuSzr`
- **Desired name:** Semaglutide Injection — High (B12)
- **Desired display:** High · Vitamin B12
- **Desired price:** 109–119 _(note: Band prices: GEN holds one amount within band until cutover policy refined)_
- **Desired storefrontEligible:** True
- **Price check:** `PRICE_BAND_OK` — Current $119.0 within locked band $109–$119 (GEN holds single price)
- **Website variant(s):** `sem-b12-high`
- **Exact reason:** SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP exists but not proven ROUTING_READY (pairing/price verification incomplete).
- **Preflight:** `READY_WITH_MANUAL_PAIRING`

**Attachments to REMOVE:**
- _(none flagged by pharmacy/additive heuristics)_

**Attachments to KEEP (pending strength verify in admin):**
- KEEP/VERIFY Semaglutide + Vitamin B12 @ Dirx-Hub

**Attachments to ADD (SELECTED rows — no inferred medicationId):**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship |
|---:|---|---|---|---|---:|---:|
| 9 | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | 1mL | Dirx-Hub | 60 | 5 |
| 11 | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | 1mL | Dirx-Hub | 65 | 5 |

## B3. `MkDIUw0NcJB7YL2pNzYW`

- **Current name:** Semaglutide Injection — Any Dose (B12)
- **Current display:** Semaglutide Injection — Any Dose (B12)
- **Current price:** 119
- **Current storefrontEligible:** True
- **Current formulary attachments:** 8
  - Semaglutide B12 ( , , ) @ Dirx-Hub · medId `99BZowkyXTMiGTu5cosT`
  - Semaglutide B12 ( , , ) @ Dirx-Hub · medId `ekw92avqC0Uf2thW7fA9`
  - Semaglutide B12 ( , , ) @ Dirx-Hub · medId `iXnkfsa6XHugbDanwjUX`
  - Semaglutide + B12 @ Greenwich Pharmacy · medId `BmyTz7FPA4wUuojkq2Hy`
  - Semaglutide + B12 @ Greenwich Pharmacy · medId `Twz0VeW8olCbbL1UAuQr`
  - Semaglutide + B12 @ Greenwich Pharmacy · medId `lPPKidpoLhkYCSV1sLse`
  - Semaglutide + B12 @ Greenwich Pharmacy · medId `pBAQDkpmfv9FIcpoqhxa`
  - Semaglutide + B12 @ Greenwich Pharmacy · medId `vCNPRlelLVcJmimIT7Wy`
- **Desired name:** Semaglutide Injection — Any Dose (B12)
- **Desired display:** Any Dose · Vitamin B12
- **Desired price:** 89–119 _(note: Band prices: GEN holds one amount within band until cutover policy refined)_
- **Desired storefrontEligible:** True
- **Price check:** `PRICE_BAND_OK` — Current $119.0 within locked band $89–$119 (GEN holds single price)
- **Website variant(s):** `sem-b12-any-dose`
- **Exact reason:** SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP exists but not proven ROUTING_READY (pairing/price verification incomplete).
- **Preflight:** `READY_WITH_MANUAL_PAIRING`

**Attachments to REMOVE:**
- REMOVE Semaglutide + B12 @ Greenwich Pharmacy — Non-SELECTED pharmacy Greenwich Pharmacy — Dirx-Hub only for SEM cutover
- REMOVE Semaglutide + B12 @ Greenwich Pharmacy — Non-SELECTED pharmacy Greenwich Pharmacy — Dirx-Hub only for SEM cutover
- REMOVE Semaglutide + B12 @ Greenwich Pharmacy — Non-SELECTED pharmacy Greenwich Pharmacy — Dirx-Hub only for SEM cutover
- REMOVE Semaglutide + B12 @ Greenwich Pharmacy — Non-SELECTED pharmacy Greenwich Pharmacy — Dirx-Hub only for SEM cutover
- REMOVE Semaglutide + B12 @ Greenwich Pharmacy — Non-SELECTED pharmacy Greenwich Pharmacy — Dirx-Hub only for SEM cutover

**Attachments to KEEP (pending strength verify in admin):**
- KEEP/VERIFY Semaglutide B12 ( , , ) @ Dirx-Hub
- KEEP/VERIFY Semaglutide B12 ( , , ) @ Dirx-Hub
- KEEP/VERIFY Semaglutide B12 ( , , ) @ Dirx-Hub

**Attachments to ADD (SELECTED rows — no inferred medicationId):**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship |
|---:|---|---|---|---|---:|---:|
| 3 | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | 1mL | Dirx-Hub | 50 | 5 |
| 5 | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | 1mL | Dirx-Hub | 55 | 5 |
| 7 | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | 1mL | Dirx-Hub | 58 | 5 |
| 9 | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | 1mL | Dirx-Hub | 60 | 5 |
| 11 | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | 1mL | Dirx-Hub | 65 | 5 |

## B4. `tk2GW39OGr7JX4MCCoJP`

- **Current name:** Semaglutide Injection — Starting / Low (Glycine)
- **Current display:** Semaglutide Injection — Starting / Low (Glycine)
- **Current price:** 99
- **Current storefrontEligible:** True
- **Current formulary attachments:** 1
  - Semaglutide + Glycine @ Dirx-Hub · medId `KFVdP0FaVZHpXt9ewjiV`
- **Desired name:** Semaglutide Injection — Starting / Low (Glycine)
- **Desired display:** Starting / Low · Glycine
- **Desired price:** 89–99 _(note: Band prices: GEN holds one amount within band until cutover policy refined)_
- **Desired storefrontEligible:** True
- **Price check:** `PRICE_BAND_OK` — Current $99.0 within locked band $89–$99 (GEN holds single price)
- **Website variant(s):** `sem-glycine-starting-low`
- **Exact reason:** SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP exists but not proven ROUTING_READY (pairing/price verification incomplete).
- **Preflight:** `READY_WITH_MANUAL_PAIRING`

**Attachments to REMOVE:**
- _(none flagged by pharmacy/additive heuristics)_

**Attachments to KEEP (pending strength verify in admin):**
- KEEP/VERIFY Semaglutide + Glycine @ Dirx-Hub

**Attachments to ADD (SELECTED rows — no inferred medicationId):**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship |
|---:|---|---|---|---|---:|---:|
| 2 | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | 1mL | Dirx-Hub | 50 | 5 |
| 4 | SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | 1mL | Dirx-Hub | 55 | 5 |

## B5. `CjqOUbPuGPZzxephqRou`

- **Current name:** Semaglutide Injection — Mid (Glycine)
- **Current display:** Semaglutide Injection — Mid (Glycine)
- **Current price:** 109
- **Current storefrontEligible:** True
- **Current formulary attachments:** 2
  - Semaglutide + Glycine @ Dirx-Hub · medId `KFVdP0FaVZHpXt9ewjiV`
  - Semaglutide + Glycine @ Dirx-Hub · medId `SX8kyR4siUDVAUrm9CvN`
- **Desired name:** Semaglutide Injection — Mid (Glycine)
- **Desired display:** Mid · Glycine
- **Desired price:** 109
- **Desired storefrontEligible:** True
- **Price check:** `OK` — Matches locked $109
- **Website variant(s):** `sem-glycine-mid`
- **Exact reason:** SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP exists but not proven ROUTING_READY (pairing/price verification incomplete).
- **Preflight:** `READY_WITH_MANUAL_PAIRING`

**Attachments to REMOVE:**
- _(none flagged by pharmacy/additive heuristics)_

**Attachments to KEEP (pending strength verify in admin):**
- KEEP/VERIFY Semaglutide + Glycine @ Dirx-Hub
- KEEP/VERIFY Semaglutide + Glycine @ Dirx-Hub

**Attachments to ADD (SELECTED rows — no inferred medicationId):**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship |
|---:|---|---|---|---|---:|---:|
| 6 | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | 1mL | Dirx-Hub | 58 | 5 |

## B6. `sssEk3FDY4LFbQYGQsLx`

- **Current name:** Semaglutide Injection — High (Glycine)
- **Current display:** Semaglutide Injection — High (Glycine)
- **Current price:** 119
- **Current storefrontEligible:** True
- **Current formulary attachments:** 1
  - Semaglutide + Glycine @ Dirx-Hub · medId `IHYsg7nVwVWB2LjoAR6a`
- **Desired name:** Semaglutide Injection — High (Glycine)
- **Desired display:** High · Glycine
- **Desired price:** 109–119 _(note: Band prices: GEN holds one amount within band until cutover policy refined)_
- **Desired storefrontEligible:** True
- **Price check:** `PRICE_BAND_OK` — Current $119.0 within locked band $109–$119 (GEN holds single price)
- **Website variant(s):** `sem-glycine-high`
- **Exact reason:** SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP exists but not proven ROUTING_READY (pairing/price verification incomplete).
- **Preflight:** `READY_WITH_MANUAL_PAIRING`

**Attachments to REMOVE:**
- _(none flagged by pharmacy/additive heuristics)_

**Attachments to KEEP (pending strength verify in admin):**
- KEEP/VERIFY Semaglutide + Glycine @ Dirx-Hub

**Attachments to ADD (SELECTED rows — no inferred medicationId):**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship |
|---:|---|---|---|---|---:|---:|
| 8 | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | 1mL | Dirx-Hub | 60 | 5 |
| 10 | SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | 1mL | Dirx-Hub | 65 | 5 |

## B7. `wQK2JsFnh7oFBf3Lag4n`

- **Current name:** Semaglutide Injection — Any Dose (Glycine)
- **Current display:** Semaglutide Injection — Any Dose (Glycine)
- **Current price:** 119
- **Current storefrontEligible:** True
- **Current formulary attachments:** 4
  - Semaglutide + Glycine @ Dirx-Hub · medId `IHYsg7nVwVWB2LjoAR6a`
  - Semaglutide + Glycine @ Dirx-Hub · medId `KFVdP0FaVZHpXt9ewjiV`
  - Semaglutide + Glycine @ Dirx-Hub · medId `SX8kyR4siUDVAUrm9CvN`
  - Semaglutide + Glycine @ Dirx-Hub · medId `WPEBtvCdn2I8l6tRmT9R`
- **Desired name:** Semaglutide Injection — Any Dose (Glycine)
- **Desired display:** Any Dose · Glycine
- **Desired price:** 89–119 _(note: Band prices: GEN holds one amount within band until cutover policy refined)_
- **Desired storefrontEligible:** True
- **Price check:** `PRICE_BAND_OK` — Current $119.0 within locked band $89–$119 (GEN holds single price)
- **Website variant(s):** `sem-glycine-any-dose`
- **Exact reason:** SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP exists but not proven ROUTING_READY (pairing/price verification incomplete).
- **Preflight:** `READY_WITH_MANUAL_PAIRING`

**Attachments to REMOVE:**
- _(none flagged by pharmacy/additive heuristics)_

**Attachments to KEEP (pending strength verify in admin):**
- KEEP/VERIFY Semaglutide + Glycine @ Dirx-Hub
- KEEP/VERIFY Semaglutide + Glycine @ Dirx-Hub
- KEEP/VERIFY Semaglutide + Glycine @ Dirx-Hub
- KEEP/VERIFY Semaglutide + Glycine @ Dirx-Hub

**Attachments to ADD (SELECTED rows — no inferred medicationId):**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship |
|---:|---|---|---|---|---:|---:|
| 2 | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | 1mL | Dirx-Hub | 50 | 5 |
| 4 | SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | 1mL | Dirx-Hub | 55 | 5 |
| 6 | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | 1mL | Dirx-Hub | 58 | 5 |
| 8 | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | 1mL | Dirx-Hub | 60 | 5 |
| 10 | SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | 1mL | Dirx-Hub | 65 | 5 |

## B8. `5F8jESeVeXcpkLU5rrdK`

- **Current name:** SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP
- **Current display:** SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP
- **Current price:** 149
- **Current storefrontEligible:** True
- **Current formulary attachments:** 0
- **Desired name:** SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP
- **Desired display:** SEMAGLUTIDE COMPOUND — ANY DOSE Membership
- **Desired price:** 149
- **Desired storefrontEligible:** True
- **Price check:** `OK` — Owner override matches
- **Website variant(s):** `sem-membership`
- **Exact reason:** Owner membership price locked $149.
- **Preflight:** `READY_WITH_MANUAL_PAIRING`
- **Membership note:** Membership: attach full Dirx-Hub B12 + Glycine SELECTED ladders (SEM 10 rows / TIR 12 rows) unless GEN UI forces split — then GEN_STRUCTURE_DECISION_REQUIRED

**Attachments to REMOVE:**
- _(none flagged by pharmacy/additive heuristics)_

**Attachments to KEEP (pending strength verify in admin):**
- _(none)_

**Attachments to ADD (SELECTED rows — no inferred medicationId):**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship |
|---:|---|---|---|---|---:|---:|
| 2 | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | 1mL | Dirx-Hub | 50 | 5 |
| 3 | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | 1mL | Dirx-Hub | 50 | 5 |
| 4 | SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | 1mL | Dirx-Hub | 55 | 5 |
| 5 | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | 1mL | Dirx-Hub | 55 | 5 |
| 6 | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | 1mL | Dirx-Hub | 58 | 5 |
| 7 | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | 1mL | Dirx-Hub | 58 | 5 |
| 8 | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | 1mL | Dirx-Hub | 60 | 5 |
| 9 | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | 1mL | Dirx-Hub | 60 | 5 |
| 10 | SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | 1mL | Dirx-Hub | 65 | 5 |
| 11 | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | 1mL | Dirx-Hub | 65 | 5 |

## B9. `E3MXZeeR01QROCuTLRLE`

- **Current name:** TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP
- **Current display:** TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP
- **Current price:** 275
- **Current storefrontEligible:** True
- **Current formulary attachments:** 0
- **Desired name:** TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP
- **Desired display:** TIRZEPATIDE COMPOUND — ANY DOSE Membership
- **Desired price:** 275
- **Desired storefrontEligible:** True
- **Price check:** `OK` — Owner override matches
- **Website variant(s):** `tir-membership`
- **Exact reason:** CONFIRM_OR_CREATE_BACKEND_B12_GLYCINE_MEMBERSHIP_SPLIT_IF_GEN_REQUIRES; KEEP_ONE_WEBSITE_MEMBERSHIP_OFFER; WEBSITE_REPRICE_249_TO_275_AT_CUTOVER
- **Preflight:** `READY_WITH_MANUAL_PAIRING`
- **Membership note:** Membership: attach full Dirx-Hub B12 + Glycine SELECTED ladders (SEM 10 rows / TIR 12 rows) unless GEN UI forces split — then GEN_STRUCTURE_DECISION_REQUIRED

**Attachments to REMOVE:**
- _(none flagged by pharmacy/additive heuristics)_

**Attachments to KEEP (pending strength verify in admin):**
- _(none)_

**Attachments to ADD (SELECTED rows — no inferred medicationId):**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship |
|---:|---|---|---|---|---:|---:|
| 13 | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | 5mg/0.5mg/mL | 2mL | Dirx-Hub | 65 | 5 |
| 14 | TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | 5mg/0.5mg/mL | 2mL | Dirx-Hub | 65 | 5 |
| 15 | TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) | 10mg/0.5mg/mL | 2mL | Dirx-Hub | 75 | 5 |
| 16 | TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | 10mg/0.5mg/mL | 2mL | Dirx-Hub | 75 | 5 |
| 17 | TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) | 15mg/0.5mg/mL | 2mL | Dirx-Hub | 85 | 5 |
| 18 | TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) | 15mg/0.5mg/mL | 2mL | Dirx-Hub | 85 | 5 |
| 19 | TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) | 20mg/0.5mg/mL | 2mL | Dirx-Hub | 90 | 5 |
| 20 | TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | 20mg/0.5mg/mL | 2mL | Dirx-Hub | 90 | 5 |
| 21 | TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) | 25mg/0.5mg/mL | 2mL | Dirx-Hub | 95 | 5 |
| 22 | TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) | 25mg/0.5mg/mL | 2mL | Dirx-Hub | 95 | 5 |
| 23 | TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | 30mg/0.5mg/mL | 2mL | Dirx-Hub | 100 | 5 |
| 24 | TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | 30mg/0.5mg/mL | 2mL | Dirx-Hub | 100 | 5 |

## B10. `iJtyig611AZEDBGdvRd9`

- **Current name:** BPC-157/TB500
- **Current display:** BPC-157/TB500
- **Current price:** 169
- **Current storefrontEligible:** True
- **Current formulary attachments:** 1
  - BPC-157 / TB500 @ Greenwich Pharmacy · medId `27WtrIdo3z4Ssj5sDcc6`
- **Desired name:** BPC-157/TB500
- **Desired display:** Injection
- **Desired price:** 159
- **Desired storefrontEligible:** True
- **Price check:** `PRICE_CONFLICT` — Current $169.0 != locked $159
- **Website variant(s):** `wolverine-injection`
- **Exact reason:** Live pairing exists to BPC-157/TB500 @ Greenwich — verify exact strength/package equals SELECTED r103.
- **Preflight:** `STOP_PRICE_CONFLICT`

**Attachments to REMOVE:**
- _(none flagged by pharmacy/additive heuristics)_

**Attachments to KEEP (pending strength verify in admin):**
- KEEP/VERIFY BPC-157 / TB500 @ Greenwich Pharmacy

**Attachments to ADD (SELECTED rows — no inferred medicationId):**

| Row | Medication | Strength | Package | Pharmacy | Cost | Ship |
|---:|---|---|---|---|---:|---:|
| 103 | BPC-157/TB500 3mg/3mg/mL | 3mg/3mg/mL | 5ML | Greenwich Pharmacy | 77 | 25 |

**STOP items:**
- `PRICE_CONFLICT` — Current $169.0 != locked $159

---

# SECTION C — FORMULARY PAIRINGS — API WRITABLE

**Count: 0**

_Client Products API cannot create/update formulary pairings. Do not attempt undocumented routes._

---

# SECTION D — FORMULARY PAIRINGS — MANUAL GEN ADMIN

**Unique GEN CPs:** 8  
**PAIRING_EXECUTION_METHOD:** `MANUAL_GEN_ADMIN`

## D1. `BLf8inX395YNc7WPCD4O` — Semaglutide Injection — Mid (B12)

- **Website family:** Semaglutide
- **Website variant(s):** `sem-b12-mid`
- **Launch state(s):** LAUNCH_WITH_WEBSITE_CUTOVER
- **Preflight:** `READY_MANUAL_PAIRING`

**Current pairings:**
- _(none)_

**Desired final pairings:**

| Action | Row | Medication | Strength | Package | Pharmacy |
|---|---:|---|---|---|---|
| ADD | 7 | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | 1mL | Dirx-Hub |

## D2. `FVwkzvQqWIZRNAwbslGw` — NAD + Nasal Spray

- **Website family:** NAD+
- **Website variant(s):** `nad-nasal-r84`, `nad-nasal-r85`
- **Launch state(s):** CURRENT_LIVE
- **Preflight:** `STOP_PRICE_OR_STRUCTURE`

**Current pairings:**
- _(none)_

**Desired final pairings:**

| Action | Row | Medication | Strength | Package | Pharmacy |
|---|---:|---|---|---|---|
| ADD | 84 | NAD+ 50mg/ml | 50mg/ml | 15ml | St Luke |
| ADD | 85 | NAD+ 200mg/ml | 200mg/ml | 15ml | St Luke |

**Price / structure issues:**
- `PRICE_CONFLICT` — GEN price 0 vs desired 79 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 109 — align price before/with pairing

## D3. `omhh3NabouO8AsNR5tkD` — Wolverine – BPC-157 + TB-500 Recovery Protocol

- **Website family:** Wolverine / BPC-TB
- **Website variant(s):** `wolverine-capsule`
- **Launch state(s):** CURRENT_LIVE
- **Preflight:** `STOP_PRICE_OR_STRUCTURE`

**Current pairings:**
- _(none)_

**Desired final pairings:**

| Action | Row | Medication | Strength | Package | Pharmacy |
|---|---:|---|---|---|---|
| ADD | 104 | BPC-157/TB500 capsules 500MCG/500MCG | 500mcg/500mcg | 1EA | Greenwich Pharmacy |

**Price / structure issues:**
- `PRICE_CONFLICT` — GEN price 0 vs desired 29 — align price before/with pairing

## D4. `BboYS4a2Uj7APetrFo6W` — Hair Loss – Dual Combo (Finasteride/Minoxidil)

- **Website family:** Minoxidil
- **Website variant(s):** `minoxidil-fin-minox-0.1-5`
- **Launch state(s):** CURRENT_LIVE
- **Preflight:** `STOP_PRICE_OR_STRUCTURE`

**Current pairings:**
- _(none)_

**Desired final pairings:**

| Action | Row | Medication | Strength | Package | Pharmacy |
|---|---:|---|---|---|---|
| ADD | 129 | FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 % | 0.1/5 % | 1 ml | Vios |

**Price / structure issues:**
- `PRICE_CONFLICT` — GEN price 0 vs desired 79 — align price before/with pairing

## D5. `o7dNtf9QsnEqPCrLr2tR` — Women's Hormones (HRT) – Vaginal Health (Estradiol / DHEA)

- **Website family:** Estradiol
- **Website variant(s):** `estradiol-patch-r26`, `estradiol-patch-r27`, `estradiol-patch-r28`, `estradiol-patch-r29`
- **Launch state(s):** CURRENT_LIVE
- **Preflight:** `STOP_PRICE_OR_STRUCTURE`

**Current pairings:**
- _(none)_

**Desired final pairings:**

| Action | Row | Medication | Strength | Package | Pharmacy |
|---|---:|---|---|---|---|
| ADD | 26 | ESTRADIOL TRANSDERMAL PATCH 0.025mg/hr 8 count | 0.025mg/hr | None | Valiant |
| ADD | 27 | ESTRADIOL TRANSDERMAL PATCH 0.0375mg/hr 8 count | 0.0375mg/hr | None | Valiant |
| ADD | 28 | ESTRADIOL TRANSDERMAL PATCH 0.05mg/hr 8 count | 0.05mg/hr | None | Valiant |
| ADD | 29 | ESTRADIOL TRANSDERMAL PATCH 0.1mg/hr 8 count | 0.1mg/hr | None | Valiant |

**Price / structure issues:**
- `PRICE_CONFLICT` — GEN price 0 vs desired 119 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 129 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 139 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 149 — align price before/with pairing

## D6. `5dGkjdpLP7DkKKE2iVxh` — Women's Hormones (HRT) – Progesterone

- **Website family:** Progesterone
- **Website variant(s):** `prog-ir-r41`, `prog-ir-r42`, `prog-ir-r43`, `prog-ir-r44`, `prog-ir-r45`, `prog-ir-r46`, `prog-ir-r47`, `prog-ir-r48`, `prog-ir-r49`
- **Launch state(s):** CURRENT_LIVE
- **Preflight:** `STOP_PRICE_OR_STRUCTURE`

**Current pairings:**
- _(none)_

**Desired final pairings:**

| Action | Row | Medication | Strength | Package | Pharmacy |
|---|---:|---|---|---|---|
| ADD | 41 | PROGESTERONE 100MG CAPSULE 100mg | 100mg | 1 mg | Vios |
| ADD | 42 | PROGESTERONE 200MG CAPSULE 200mg | 200mg | 1 mg | Vios |
| ADD | 43 | PROGESTERONE 50MG CAPSULE 50mg | 50mg | 1 mg | Vios |
| ADD | 44 | PROGESTERONE IR 100 MG | 100 MG | 1 each | Vios |
| ADD | 45 | PROGESTERONE IR 150 MG | 150 MG | 1 each | Vios |
| ADD | 46 | PROGESTERONE IR 200 MG | 200 MG | 1 each | Vios |
| ADD | 47 | PROGESTERONE IR (DYE-FREE)(LACTOSE-FREE) (M NEW) 200MG | 200MG | 1 each | Vios |
| ADD | 48 | PROGESTERONE IR 300 MG | 300 MG | 1 each | Vios |
| ADD | 49 | PROGESTERONE IR 400 MG | 400 MG | 1 each | Vios |

**Price / structure issues:**
- `PRICE_CONFLICT` — GEN price 0 vs desired 29 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 29 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 29 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 29 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 29 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 29 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 29 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 29 — align price before/with pairing
- `PRICE_CONFLICT` — GEN price 0 vs desired 29 — align price before/with pairing

## D7. `Ukctbyh5Yrek3SnGSYA3` — Selank Anxiolytic & Cognitive Protocol

- **Website family:** Selank
- **Website variant(s):** `selank-nasal-r119`
- **Launch state(s):** FUTURE_HIDDEN
- **Preflight:** `DEFER_FUTURE_HIDDEN`
- **DEFER:** All website variants for this CP have launch_state FUTURE_HIDDEN — do not activate; pairing optional/deferred

**Current pairings:**
- _(none)_

**Desired final pairings:**

| Action | Row | Medication | Strength | Package | Pharmacy |
|---|---:|---|---|---|---|
| ADD | 119 | Selank 2.5mg/mL Nasal Spray | 2.5mg/20mL | 20ml | Greenwich Pharmacy |

**Price / structure issues:**
- `PRICE_CONFLICT` — GEN price 0 vs desired 129 — align price before/with pairing

## D8. `YTHcdrlRICMpt56hdxeJ` — Semax Nootropic & Neuroprotective Protocol

- **Website family:** Semax
- **Website variant(s):** `semax-nasal-r118`
- **Launch state(s):** FUTURE_HIDDEN
- **Preflight:** `DEFER_FUTURE_HIDDEN`
- **DEFER:** All website variants for this CP have launch_state FUTURE_HIDDEN — do not activate; pairing optional/deferred

**Current pairings:**
- _(none)_

**Desired final pairings:**

| Action | Row | Medication | Strength | Package | Pharmacy |
|---|---:|---|---|---|---|
| ADD | 118 | Semax 2.5mg/mL Nasal Spray | 2.5mg/20mL | 20ml | Greenwich Pharmacy |

**Price / structure issues:**
- `PRICE_CONFLICT` — GEN price 0 vs desired 129 — align price before/with pairing

---

# SECTION E — NO ACTION / ALREADY CORRECT

**Count: 0** (ROUTING_READY = 0)

---

# SECTION F — EXCLUDED — FORMULARY PENDING

**Count: 14** — do not invent formulary data.

| Family | Variant |
|---|---|
| NAD+ | `nad-inj-5ml-500` |
| NAD+ | `nad-inj-10ml-1000` |
| Tretinoin | `tretinoin-0.025%` |
| Tretinoin | `tretinoin-0.05%` |
| Tretinoin | `tretinoin-0.1%` |
| Fat Burner | `fat-burner-current` |
| Testosterone | `testosterone-current` |
| Selank | `selank-current` |
| Semax | `semax-current` |
| Selank + Semax Blend | `selank-semax-blend-current` |
| Tesamorelin | `tesamorelin-current` |
| Lash / Brow Growth Serum | `lash-brow-current` |
| Oxytocin | `oxytocin-pending` |
| Sexual Wellness Compound | `sexual-wellness-compound-pending` |

Includes NAD+ 100mg/mL injection and Tretinoin 0.025/0.05/0.1% per owner locks (no r83/r126/r127 substitution).

---

# SECTION G — EXCLUDED — FUTURE HIDDEN

**Count: 51** — do not create/pair/activate in this phase.

_Full list in JSON `section_G_excluded_future_hidden`._

---

# SECTION H — CONFLICTS / STOP ITEMS

**Unique stop/conflict entries:** 12

- **B_REPAIR** · `PRICE_CONFLICT` · `iJtyig611AZEDBGdvRd9` — Current $169.0 != locked $159
- **C_PAIRING** · `PRICE_CONFLICT` · `FVwkzvQqWIZRNAwbslGw` — GEN price 0 vs desired 79 — align price before/with pairing
- **C_PAIRING** · `PRICE_CONFLICT` · `omhh3NabouO8AsNR5tkD` — GEN price 0 vs desired 29 — align price before/with pairing
- **C_PAIRING** · `PRICE_CONFLICT` · `BboYS4a2Uj7APetrFo6W` — GEN price 0 vs desired 79 — align price before/with pairing
- **C_PAIRING** · `PRICE_CONFLICT` · `o7dNtf9QsnEqPCrLr2tR` — GEN price 0 vs desired 119 — align price before/with pairing
- **C_PAIRING** · `PRICE_CONFLICT` · `5dGkjdpLP7DkKKE2iVxh` — GEN price 0 vs desired 29 — align price before/with pairing
- **C_PAIRING** · `PRICE_CONFLICT` · `Ukctbyh5Yrek3SnGSYA3` — GEN price 0 vs desired 129 — align price before/with pairing
- **C_PAIRING** · `DEFER_FUTURE_HIDDEN` · `Ukctbyh5Yrek3SnGSYA3` — All website variants for this CP have launch_state FUTURE_HIDDEN — do not activate; pairing optional/deferred
- **C_PAIRING** · `PRICE_CONFLICT` · `YTHcdrlRICMpt56hdxeJ` — GEN price 0 vs desired 129 — align price before/with pairing
- **C_PAIRING** · `DEFER_FUTURE_HIDDEN` · `YTHcdrlRICMpt56hdxeJ` — All website variants for this CP have launch_state FUTURE_HIDDEN — do not activate; pairing optional/deferred
- **C_PAIRING** · `GEN_STRUCTURE_NOTE` · `o7dNtf9QsnEqPCrLr2tR` — Four website patch strengths/prices (119/129/139/149) share one GEN CP. Confirm whether one CP with multi-formulary is acceptable or separate CPs are required before write.
- **C_PAIRING** · `GEN_STRUCTURE_NOTE` · `FVwkzvQqWIZRNAwbslGw` — NAD nasal r84 ($79) and r85 ($109) share one GEN CP. GEN holds a single price — need owner rule: separate nasal CPs, or one CP with representative price, or GEN-native variant pricing.

---

# Proposed later execution order

1. CREATE required GEN CPs (8 TIR dose-group)
2. Verify created CPs by GET
3. REPAIR existing CPs (API-writable fields only: name/display/price/storefront) — skip any PRICE_CONFLICT until owner resolves
4. Verify repairs by GET
5. Formulary pairing — API writable: NONE
6. Manually complete GEN-admin-only pairings (Section D)
7. Re-read entire relevant GEN inventory
8. Validate website → GEN routing matrix
9. Only then approve website cutover work

_Do **not** perform these steps now._

---

# FINAL REPORT

| Item | Value |
|---|---|
| EXECUTION_ELIGIBLE_WEBSITE_VARIANTS | 38 |
| UNIQUE_GEN_PRODUCTS_TO_CREATE | 8 |
| UNIQUE_GEN_PRODUCTS_TO_REPAIR | 10 |
| PAIRING_ACTIONS_TOTAL | 20 |
| PAIRING_API_WRITABLE | 0 |
| PAIRING_MANUAL_GEN_ADMIN | 20 |
| ALREADY_CORRECT_NO_WRITE | 0 |
| PRICE_CONFLICTS | 8 |
| FORMULATION_CONFLICTS | 0 |
| MISSING_IDENTIFIERS | All pairing ADDs intentionally have medicationId=null (no inference); strength not returned by formulary API view |
| OTHER_STOP_ITEMS | 4 |
| SEM_GEN_OBJECTS_IN_MANIFEST | 9 |
| TIR_GEN_OBJECTS_IN_MANIFEST | 9 |
| NAD_GEN_OBJECTS_IN_MANIFEST | 1 |
| WOLVERINE_GEN_OBJECTS_IN_MANIFEST | 2 |
| FORMULARY_PENDING_EXCLUDED | 14 |
| FUTURE_HIDDEN_EXCLUDED | 51 |
| ALL_CREATE_ACTIONS_EXACTLY_SUPPORTED | True |
| ALL_REPAIR_ACTIONS_EXACTLY_SUPPORTED | False |
| ALL_PAIRING_ACTIONS_EXACTLY_SUPPORTED | False |
| READY_FOR_GEN_WRITE_EXECUTION | NO |
| READY_REASON | 8 unique GEN CPs with PRICE_CONFLICT; 4 structure/defer items; all formulary pairings MANUAL_GEN_ADMIN only; CREATE set (8 TIR) is exactly supported but overall manifest not clear for write |
| GEN_MODIFIED | False |
| GEN_WRITES | 0 |
| PAIRING_WRITES | 0 |
| WEBSITE_MODIFIED | False |
| CHECKOUT_MODIFIED | False |
| CUTOVER | OFF |
| PRICE_CONFLICT_CLIENT_PRODUCT_IDS | ['5dGkjdpLP7DkKKE2iVxh', 'BboYS4a2Uj7APetrFo6W', 'FVwkzvQqWIZRNAwbslGw', 'Ukctbyh5Yrek3SnGSYA3', 'YTHcdrlRICMpt56hdxeJ', 'iJtyig611AZEDBGdvRd9', 'o7dNtf9QsnEqPCrLr2tR', 'omhh3NabouO8AsNR5tkD'] |
| PAIRING_ACTIONS_ACTIVE_NON_DEFERRED | 18 |
| UNIQUE_GEN_CPS_FOR_PAIRING | 8 |

**STOP FOR OWNER APPROVAL. DO NOT EXECUTE THE MANIFEST.**

GEN MODIFIED: NO · GEN WRITES: 0 · PAIRING WRITES: 0  
WEBSITE MODIFIED: NO · CHECKOUT MODIFIED: NO · CUTOVER: OFF
