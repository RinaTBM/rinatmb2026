# MBM Final Integrity Gate

**Generated:** from `MBM_FINAL_INTEGRITY_GATE.json`  
**Phase:** MBM-FINAL-INTEGRITY-GATE  
**Mode:** READ-ONLY — no GEN writes, no website writes, no pairing writes, no deactivations  
**Cutover:** OFF · **GEN-CATALOG-2B:** NOT STARTED  

**Locked launch map (unchanged):** CURRENT_LIVE **17** / CUTOVER **16** / FUTURE_HIDDEN **32** / TOTAL **65**

Machine-readable: [`MBM_FINAL_INTEGRITY_GATE.json`](./MBM_FINAL_INTEGRITY_GATE.json)

---

## Locked — do not reopen

- Launch model 17 / 16 / 32 / 65  
- CUTOVER_READY = 16 (SEM 8 + TIR 8)  
- SEM membership $149 · TIR membership $275 at cutover  
- Minoxidil Finasteride/Minoxidil 0.1%/5% · Vios · row 129 · $79  
- Frozen 7 × `CURRENT_LIVE_FORMULARY_PENDING` (Fat Burner, Testosterone Cream, Selank Inj, Semax Inj, Selank+Semax Nasal, Tesamorelin, Lash/Brow)

---

## ISSUE 1 — Wolverine count discrepancy — RESOLVED

### Determination: **A — ONE patient-facing website product with two variants/forms**

| Field | Value |
|---|---|
| Website slug | `bpc-157-tb-500` |
| Display name | Wolverine: BPC-157/TB-500 |
| Product id | `p41` |
| Patient-facing product count | **1** |
| Variant count | **2** |
| Locked CURRENT_LIVE count still valid | **YES** |
| Owner decision required | **NO** |

**Variants (from `src/data/products.ts`):**

| Dosage form | Website strength | Website price | SELECTED route |
|---|---|---:|---|
| Capsule | Blend | $99 | r104 · `BPC-157/TB500 capsules 500MCG/500MCG` · Greenwich · cost $3.20 + ship $25 → **$29** |
| Injection | Blend | $199 | r103 · `BPC-157/TB500 3mg/3mg/mL` · 5ML · Greenwich · cost $77 + ship $25 → **$159** |

Legacy slug aliases (`bpc-157-tb-500-injection`, `bpc-157-tb-500-capsules-41`, etc.) all map to the **same** website product.

**Why architecture previously showed 18:** it split Wolverine into two CURRENT_LIVE objects (`bpc-tb-inj` + `bpc-tb-cap`). That was a **representation error**, not a locked-count change.

**Correction applied:** architecture now represents **one** product `bpc-157-tb-500` with two dosage-form formulary routes. Architecture CURRENT_LIVE object count = **17**; TOTAL products = **65**. Launch map **not** changed (was already correct).

---

## ISSUE 2 — NAD+ strength reconciliation

### Classification: **FORMULATION_STRENGTH_CONFLICT**

| Field | Value |
|---|---|
| Website strength | **100mg/mL** explicit on both variants |
| Website packages | 5mL · 500mg total @ $199 ··· 10mL · 1,000mg total @ $229 |
| SELECTED injectable options | **Only r83** · `NAD+ … 200mg/ml` · Injection Solution · 5ml vial (1000mg) · St Luke · cost $64 + ship $30 → **$139** |
| Nasal excluded | r81, r82, r84, r85 (do not treat as injection) |
| Owner decision required | **YES** |
| Final formulary status | **CURRENT_LIVE_STRENGTH_PENDING** |

**Conflict:** website promises **100mg/mL**; SELECTED injectable is **200mg/ml** only. No 100mg/mL injectable SELECTED row exists. Name match alone is insufficient.

### Owner choices (do not silent-substitute)

1. **A)** Change website to SELECTED r83 (200mg/ml · 5ml / 1000mg · St Luke · **$139**)  
2. **B)** Request pharmacy formulary addition for **100mg/mL** injectable matching website 5mL/10mL packages (need cost + shipping)  
3. **C)** Keep website as-is; remain strength-pending (no pairing) until A or B  

---

## ISSUE 3 — Tretinoin strength reconciliation

### Classification: **FORMULATION_STRENGTH_CONFLICT**

| Field | Value |
|---|---|
| Website strengths | **0.025% / 0.05% / 0.1%** cream · **20g** @ $79 / $89 / $109 |
| SELECTED options | r126 `TRETINOIN 0.15%` · 30g · Vios · $25.50+$30 → **$79** ··· r127 `HA/NIACINAMIDE/TRETINOIN 0.5/4/0.025%` · 30g · Vios · $54+$30 → **$129** |
| Owner decision required | **YES** |
| Final formulary status | **CURRENT_LIVE_STRENGTH_PENDING** |

**Conflict:** website promises plain cream **0.025 / 0.05 / 0.1%** in **20g**. SELECTED has **0.15%** plain (30g) and a **combination** cream (not a silent substitute for plain 0.025%).

### Owner choices (do not silent-substitute)

1. **A)** Request SELECTED additions for plain Tretinoin **0.025% / 0.05% / 0.1%** (20g or owner-approved package) with cost + shipping  
2. **B)** Change website to SELECTED r126 (0.15% 30g @ $79); optionally list combo r127 as a separate product  
3. **C)** Keep website as-is; remain strength-pending (no pairing) until A or B  

---

## TIR GEN object gap (recorded — no creates)

The **8** TIR cutover products are:

`FORMULARY_VERIFIED` · `ARCHITECTURE_APPROVED` · `CUTOVER_READY`

Corresponding patient-facing GEN client products: **do not currently exist**.

**GEN action:** `CREATE_REQUIRED_AT_EXECUTION` — **do not create now**.

| Cutover product | SELECTED rows (exact) |
|---|---|
| `tir-b12-starting-low` | r14 `TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL)` · r16 `… 10MG/0.5MG/ML (2ML VIAL)` |
| `tir-b12-mid` | r18 `… 15MG…` · r20 `… 20MG…` |
| `tir-b12-high` | r22 `… 25MG…` · r24 `… 30MG…` |
| `tir-b12-any-dose` | r14, r16, r18, r20, r22, r24 |
| `tir-glycine-starting-low` | r13 `TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL)` · r15 `… 10MG…` |
| `tir-glycine-mid` | r17 `… 15MG…` · r19 `… 20MG…` |
| `tir-glycine-high` | r21 `… 25MG…` · r23 `… 30MG…` |
| `tir-glycine-any-dose` | r13, r15, r17, r19, r21, r23 |

Pharmacy: **Dirx-Hub**. Do not use ambiguous `Tirzepatide/B12/Glycine` or `Tirzepatide/Glycine/B12`. Do not use broken 3-pack rows.

---

## GEN safety (unchanged)

| Class | Count |
|---|---:|
| KEEP_PROTECTED | **13** |
| SAFE_TO_REPAIR_LATER | **13** |
| SAFE_DEACTIVATION_CANDIDATE | **89** (not promoted to executable deletion) |
| AMBIGUOUS_DO_NOT_TOUCH | **140** |

No GEN changes. Deactivations this phase: **0**.

---

## FINAL REPORT

### WOLVERINE
- **CURRENT WEBSITE STRUCTURE:** ONE product / TWO variants (Capsule + Injection)  
- **PATIENT-FACING PRODUCT COUNT:** 1  
- **VARIANT COUNT:** 2  
- **LOCKED CURRENT_LIVE COUNT STILL VALID:** YES  
- **OWNER DECISION REQUIRED:** NO  

### NAD+
- **CLASSIFICATION:** FORMULATION_STRENGTH_CONFLICT  
- **WEBSITE STRENGTH:** 100mg/mL (5mL/500mg @ $199 · 10mL/1000mg @ $229)  
- **SELECTED OPTIONS:** r83 only — 200mg/ml Injection Solution · 5ml (1000mg) · St Luke · **$139**  
- **OWNER DECISION REQUIRED:** YES  
- **FINAL FORMULARY STATUS:** CURRENT_LIVE_STRENGTH_PENDING  

### TRETINOIN
- **CLASSIFICATION:** FORMULATION_STRENGTH_CONFLICT  
- **WEBSITE STRENGTH:** 0.025% / 0.05% / 0.1% · 20g @ $79 / $89 / $109  
- **SELECTED OPTIONS:** r126 0.15% 30g @ **$79** · r127 combo @ **$129** (not plain substitute)  
- **OWNER DECISION REQUIRED:** YES  
- **FINAL FORMULARY STATUS:** CURRENT_LIVE_STRENGTH_PENDING  

### Catalog totals
| Metric | Value |
|---|---|
| CURRENT_LIVE | **17** (not silently changed) |
| VERIFIED_CURRENT_LIVE | **4** |
| CURRENT_LIVE_FORMULARY_PENDING | **7** |
| CURRENT_LIVE_STRENGTH_PENDING | **2** (NAD+, Tretinoin) |
| CUTOVER_READY | **16** |
| CUTOVER_BLOCKED | **0** |
| TIR GEN EXISTING | **0** |
| TIR GEN CREATE_REQUIRED | **8** |
| MEMBERSHIP_READY | **2** |
| FUTURE_HIDDEN_READY | **28** |
| FUTURE_HIDDEN_PENDING | **4** |
| KEEP_PROTECTED | **13** |
| SAFE_TO_REPAIR_LATER | **13** |
| SAFE_DEACTIVATION_CANDIDATE | **89** |
| AMBIGUOUS_DO_NOT_TOUCH | **140** |

| Flag | Value |
|---|---|
| GEN MODIFIED | NO |
| GEN WRITES | 0 |
| WEBSITE MODIFIED | NO |
| CUTOVER | OFF |

### FINAL_EXECUTION_PLAN_READY: **NO**

Remaining issues that prevent generation of a safe execution plan:

1. **NAD+** — `FORMULATION_STRENGTH_CONFLICT` — owner must choose A/B/C above  
2. **Tretinoin** — `FORMULATION_STRENGTH_CONFLICT` — owner must choose A/B/C above  

(Frozen 7 do not block a plan for the verified remainder. TIR `CREATE_REQUIRED_AT_EXECUTION` can be a plan step, not a blocker. Wolverine count is resolved.)

---

**STOP FOR OWNER REVIEW.**

Do not start GEN-CATALOG-2B. Do not generate an execution script. Do not create a pairing checklist.
