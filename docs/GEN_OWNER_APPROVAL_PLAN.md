# GEN Owner Approval Plan (GEN-CATALOG-1F)

**READ-ONLY — no GEN writes. Do not start GEN-CATALOG-2.**
**Generated:** 2026-08-24T06:53:00Z
**Sources:** existing decision sheet / approval report / blueprint only.

---

## Numbering clarification

Owner message "DECISION #10 — TIRZEPATIDE STRUCTURE" refers to the Tirzepatide B12 vs Glycine KEEP SEPARATE structural policy (from GEN-CATALOG-1D). In docs/GEN_OWNER_DECISION_SHEET.md, Decision #10 is "Sildenafil — Unspecified" (still unresolved). Decision #12 covers Tirzepatide/B12/Glycine and Tirzepatide/Glycine/B12 ambiguous labels and remains owner review.

---

## Recorded owner approvals

### Cleanup (APPROVED — no writes executed)

- **Add Sync** → `DEACTIVATE`
- **Metformin (Metabolic / Weight Support)** → `DEACTIVATE` — DO NOT ADD METFORMIN
- **Metformin / Topiramate** → `DEACTIVATE` — DO NOT ADD METFORMIN
- **BPC-157 (Copy 1)** → `MERGE_THEN_DEACTIVATE` → merge into **BPC-157 Injection** `KXMm9SsbOEYnFy9phmZn`, then deactivate duplicate

### Decision approvals

#### Decision #1 — Semaglutide Injection — Mid (B12) — APPROVED → Option A

APPROVE creation/retention of a separate Mid B12 client product so the B12 ladder contains Starting/Low, Mid, High, Any Dose and 3-Month as applicable.

Effect: B12 ladder retains Starting/Low, Mid, High, Any Dose, and 3-Month as applicable.

#### Tirzepatide structure (structural policy) — APPROVED

APPROVE keeping B12 and Glycine as separate product/dose ladders. Do not combine them.

**Not resolved (remain owner review):**
- `Tirzepatide/B12/Glycine`
- `Tirzepatide/Glycine/B12`

These map to **Decision #12** in the decision sheet.

**Sheet Decision #10 (Sildenafil — Unspecified) is NOT approved by this message** — still unresolved.

---

## Unresolved owner decisions only

### DECISION #2
**PRODUCT:** 5-Amino Injectable
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** Keep injectable 5-Amino-1MQ product; pair only to injectable formulary once confirmed.

**EXACT OPTION B:** Reclassify as capsule product and use capsule formulary only if that is the intended offer.

**PRICE/COST DIFFERENCE:** —

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: Injectable 5-Amino-1MQ formulary (confirm exact row)
- Formulary Option B: Capsule proposal: 5-Amino capsules 50mg
- Master products in scope: 5-Amino Injectable
- True formulary review `5-Amino Injectable`:
  - Candidate 1: 5-Amino capsules 50mg | pharmacy Greenwich Pharmacy | strength 50mg | form None | package 1EA | pharmacy cost 2.6 | shipping 25 | landed 27.6
  - Why ambiguous: Injectable product name paired to capsule formulary — form mismatch

**WHY THE DECISION EXISTS:** Name is injectable; workbook proposal is capsule.

**CURSOR STRUCTURAL RECOMMENDATION:** A — do not pair injectable-named product to capsule row.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #3
**PRODUCT:** Accelerate & Thrive
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**EXACT OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**PRICE/COST DIFFERENCE:** —

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: Split into distinct CPs (see masters in JSON)
- Formulary Option B: Keep catch-all (not recommended)
- Master products in scope: Accelerate & Thrive, ARA-290 Neuroprotection & Nerve Repair Protocol, BAM-15 Mitochondrial Uncoupler Protocol, Elite Body Recomp, Elite Regenesis, Kisspeptin-10, KPV Anti-Inflammatory Gut & Systemic Protocol, Lean & Energized, Lean & Ready, Lean & Timeless, Melanotan 2 Tanning & Sexual Health Protocol, PE-22-28, PE-22-28 Antidepressant & Cognitive Protocol, Peak Performance, Peptides – Kisspeptin-10, Performance – Oxandrolone (High Dose), Performance – Oxandrolone (Low Dose), Performance – Stanozolol, Power & Recovery, Sculpt & Perform, Slim & Sensational, Slim & Timeless, SLU-PP-332 Metabolic & Exercise Mimetic Protocol, The Ultimate Protocol, Thyroid Support (BioThyroid), Total Transformation, Vitality & Longevity, Wellness – Low-Dose Naltrexone (LDN) Starter, Wellness – Low-Dose Naltrexone (LDN) Therapeutic, Wellness – MIC-B12 (Lipotropic / Fat Burn), Wellness – MIC-B12 (Lipotropic / Fat Burn)

**WHY THE DECISION EXISTS:** Over-collapsed catch-all (31 masters; signals=['combo', 'kisspeptin']) — should be split into separate patient-facing products before any GEN writes

**CURSOR STRUCTURAL RECOMMENDATION:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #4
**PRODUCT:** HRT Other — Unspecified
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**EXACT OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**PRICE/COST DIFFERENCE:** —

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: Split into distinct CPs (see masters in JSON)
- Formulary Option B: Keep catch-all (not recommended)
- Master products in scope: Hormone + Intimacy, Kisspeptin-10 Reproductive Hormone Protocol, Men's Hormones – Fertility (Clomiphene), Men's Hormones – Fertility (HCG), Men's Hormones – Gonadorelin, Men's Hormones – PCT / Estrogen Blocker (Tamoxifen), Men's Hormones (TRT) – Estrogen Management (Anastrozole), Men's Hormones (TRT) – Fertility / HPTA Support (Enclomiphene), Mens HRT/TRT In-Clinic Approval, Mens TRT/HRT 1 Month Plan, Mens TRT/HRT 3 Month Plan, Mens TRT/HRT 6 Month Plan, Womens HRT GFE In-Clinic Approval, Womens TRT/HRT 1 Month Plan, Womens TRT/HRT 3 Month Plan, Womens TRT/HRT 6 Month Plan

**WHY THE DECISION EXISTS:** Over-collapsed catch-all (16 masters; signals=['anastrozole', 'clomiphene', 'combo', 'enclomiphene', 'gonadorelin', 'hcg', 'kisspeptin', 'tamoxifen']) — should be split into separate patient-facing products before any GEN writes

**CURSOR STRUCTURAL RECOMMENDATION:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #5
**PRODUCT:** Minoxidil / Hair — Unspecified
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**EXACT OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**PRICE/COST DIFFERENCE:** —

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: Split into distinct CPs (see masters in JSON)
- Formulary Option B: Keep catch-all (not recommended)
- Master products in scope: Hair Loss – Dual Combo (Finasteride/Minoxidil)

**WHY THE DECISION EXISTS:** Over-collapsed catch-all (1 masters; signals=['combo', 'finasteride', 'minoxidil']) — should be split into separate patient-facing products before any GEN writes

**CURSOR STRUCTURAL RECOMMENDATION:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #6
**PRODUCT:** NAD+ (Injectable)
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** NAD+ Injection = injection formulary only.

**EXACT OPTION B:** NAD+ Nasal Spray = separate product; do not cross-pair.

**PRICE/COST DIFFERENCE:** Landed A=60 vs B=75

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: Confirm injectable NAD+ formulary
- Formulary Option B: Nasal proposal: NAD+ 50mg/ml
- Master products in scope: NAD+ (Injectable)
- True formulary review `NAD+ (Injectable)`:
  - Candidate 1: NAD+ 50mg/ml | pharmacy St Luke | strength 50mg/ml | form Nasal Spray | package 15ml | pharmacy cost 30 | shipping 30 | landed 60
  - Candidate 2: NAD+ 200mg/ml | pharmacy St Luke | strength 200mg/ml | form Nasal Spray | package 15ml | pharmacy cost 45 | shipping 30 | landed 75
  - Why ambiguous: Injectable NAD+ master row carries Nasal Spray form/proposed pairing

**WHY THE DECISION EXISTS:** Injectable NAD+ row carries nasal spray form/proposal.

**CURSOR STRUCTURAL RECOMMENDATION:** Use both as separate products (split by delivery form).

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #7
**PRODUCT:** Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** Approve one exact cream formulary under one FUTURE_HIDDEN Scream Cream product.

**EXACT OPTION B:** Defer Scream Cream until exact formulation is confirmed.

**PRICE/COST DIFFERENCE:** —

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: Sildenafil/Testosterone 120mg/22mg
- Formulary Option B: Alternate cream variants / defer
- Master products in scope: Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone
- True formulary review `Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone`:
  - Candidate 1: Sildenafil/Testosterone 120mg/22mg | pharmacy St Luke | strength 120mg/22mg | form Troche | package Each | pharmacy cost 2.75 | shipping 30 | landed 32.75
  - Why ambiguous: Sildenafil-named product proposed to Scream Cream formulary — do not silently substitute
  - Why ambiguous: Scream Cream exact composition/pharmacy confirmation still required vs alternate cream formulas

**WHY THE DECISION EXISTS:** Exact Scream Cream composition/pharmacy still needs owner confirmation (variants exist).

**CURSOR STRUCTURAL RECOMMENDATION:** None — not enough evidence (no clinical call).

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #8
**PRODUCT:** Sildenafil (3 Month)
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** Pair only to Sildenafil tablet/capsule formulary; keep Scream Cream separate.

**EXACT OPTION B:** Rename these offers to Scream Cream programs if cream is truly intended.

**PRICE/COST DIFFERENCE:** —

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: SILDENAFIL tablet/capsule formulary (e.g. VitaScripts 100 mg)
- Formulary Option B: Sildenafil/Testosterone 120mg/22mg
- Master products in scope: Sildenafil (3 Month)
- True formulary review `Sildenafil (3 Month)`:
  - Candidate 1: Sildenafil/Testosterone 120mg/22mg | pharmacy St Luke | strength 120mg/22mg | form Troche | package Each | pharmacy cost 2.75 | shipping 30 | landed 32.75
  - Why ambiguous: Sildenafil-named product proposed to Scream Cream formulary — do not silently substitute

**WHY THE DECISION EXISTS:** Sildenafil-named product proposed to Scream Cream formulary.

**CURSOR STRUCTURAL RECOMMENDATION:** A — no silent Scream Cream substitution under Sildenafil name.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #9
**PRODUCT:** Sildenafil (6 Month)
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** Pair only to Sildenafil tablet/capsule formulary; keep Scream Cream separate.

**EXACT OPTION B:** Rename these offers to Scream Cream programs if cream is truly intended.

**PRICE/COST DIFFERENCE:** —

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: SILDENAFIL tablet/capsule formulary (e.g. VitaScripts 100 mg)
- Formulary Option B: Sildenafil/Testosterone 120mg/22mg
- Master products in scope: Sildenafil (6 Month)
- True formulary review `Sildenafil (6 Month)`:
  - Candidate 1: Sildenafil/Testosterone 120mg/22mg | pharmacy St Luke | strength 120mg/22mg | form Troche | package Each | pharmacy cost 2.75 | shipping 30 | landed 32.75
  - Why ambiguous: Sildenafil-named product proposed to Scream Cream formulary — do not silently substitute

**WHY THE DECISION EXISTS:** Sildenafil-named product proposed to Scream Cream formulary.

**CURSOR STRUCTURAL RECOMMENDATION:** A — no silent Scream Cream substitution under Sildenafil name.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #10
**PRODUCT:** Sildenafil — Unspecified
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**EXACT OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**PRICE/COST DIFFERENCE:** —

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: Split into distinct CPs (see masters in JSON)
- Formulary Option B: Keep catch-all (not recommended)
- Master products in scope: ED – Caffeine / Sildenafil (Performance Boost), ED – Sildenafil (On-Demand), ED – Sildenafil / Tadalafil Combo, Sildenafil, Tadalafil+Sildenafil

**WHY THE DECISION EXISTS:** Over-collapsed catch-all (5 masters; signals=['combo', 'sildenafil', 'tadalafil']) — should be split into separate patient-facing products before any GEN writes

**CURSOR STRUCTURAL RECOMMENDATION:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #11
**PRODUCT:** Tadalafil — Unspecified
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**EXACT OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**PRICE/COST DIFFERENCE:** —

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: Split into distinct CPs (see masters in JSON)
- Formulary Option B: Keep catch-all (not recommended)
- Master products in scope: ED – Tadalafil (Daily / Low Dose), ED – Tadalafil (On-Demand / High Dose), Tadalafil, Vardenafil+Tadalafil+Apormorphine

**WHY THE DECISION EXISTS:** Over-collapsed catch-all (4 masters; signals=['combo', 'tadalafil', 'vardenafil']) — should be split into separate patient-facing products before any GEN writes

**CURSOR STRUCTURAL RECOMMENDATION:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #12
**PRODUCT:** Tirzepatide Injection — B12+Glycine (ambiguous)
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** Treat as Glycine-ladder products (rename) and attach Glycine vials only.

**EXACT OPTION B:** Split into separate B12 and Glycine Tirzepatide products, or reject both labels until clarified.

**PRICE/COST DIFFERENCE:** Landed A=70 vs B=70

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: TIRZEPATIDE + GLYCINE vials (Dirx-Hub)
- Formulary Option B: Separate B12 + Glycine ladders (or reject)
- Master products in scope: Tirzepatide/B12/Glycine, Tirzepatide/Glycine/B12
- True formulary review `Tirzepatide/B12/Glycine`:
  - Candidate 1: TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | pharmacy Dirx-Hub | strength 5mg/0.5mg/mL | form Vial | package 2mL | pharmacy cost 65 | shipping 5 | landed 70
  - Candidate 2: TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | pharmacy Dirx-Hub | strength 5mg/0.5mg/mL | form Vial | package 2mL | pharmacy cost 65 | shipping 5 | landed 70
  - Why ambiguous: Label claims both B12 and Glycine; proposed row is Glycine-only vial — ambiguous which ladder
- True formulary review `Tirzepatide/Glycine/B12`:
  - Candidate 1: TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | pharmacy Dirx-Hub | strength 5mg/0.5mg/mL | form Vial | package 2mL | pharmacy cost 65 | shipping 5 | landed 70
  - Candidate 2: TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | pharmacy Dirx-Hub | strength 5mg/0.5mg/mL | form Vial | package 2mL | pharmacy cost 65 | shipping 5 | landed 70
  - Why ambiguous: Label claims both B12 and Glycine; proposed row is Glycine-only vial — ambiguous which ladder

**WHY THE DECISION EXISTS:** Labels claim both B12 and Glycine, but proposed/selected context is Glycine-only. Silent choice would mis-label additive.

**CURSOR STRUCTURAL RECOMMENDATION:** None — not enough evidence (no clinical call).

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #13
**PRODUCT:** Tretinoin / Skin — Unspecified
**LIVE/FUTURE:** FUTURE_HIDDEN

**EXACT OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**EXACT OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**PRICE/COST DIFFERENCE:** —

**FORMULARY/PHARMACY DIFFERENCE:**
- Formulary Option A: Split into distinct CPs (see masters in JSON)
- Formulary Option B: Keep catch-all (not recommended)
- Master products in scope: Finasteride, Tretinoin, Fluocinolone, VitaminE, Hair Loss - Minoxdil/Tretinoin/Fluocinolone/Finasteride Spray, Hair Loss – Triple Combo (Finasteride/Minoxidil/Tretinoin)

**WHY THE DECISION EXISTS:** Over-collapsed catch-all (3 masters; signals=['combo', 'finasteride', 'minoxidil', 'spray', 'tretinoin']) — should be split into separate patient-facing products before any GEN writes

**CURSOR STRUCTURAL RECOMMENDATION:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

## Final counts

- **OWNER DECISIONS APPROVED:** 1 (#1 Semaglutide Mid (B12) → Option A)
- **STRUCTURAL POLICIES APPROVED:** 1 (Tirzepatide B12 and Glycine remain separate product/dose ladders (do not combine))
- **OWNER DECISIONS REMAINING:** 12 (#2, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13)
- **CLEANUP APPROVED:** 4
- **TRUE UNIQUE DECISIONS REMAINING:** 12

- **GEN MODIFIED:** NO
- **GEN WRITES:** 0
- **GEN/WHOP CUTOVER:** OFF

**STOP.** Do not run GEN-CATALOG-2.
