# GEN Owner Decision Sheet (GEN-CATALOG-1E)

**READ-ONLY — no GEN writes. Do not start GEN-CATALOG-2.**
**Generated:** 2026-08-24T06:48:22Z
**Sources only:** existing 1C/1D docs + workbook live prices + `src/data/products.ts`.

---

## Final owner summary

- **LIVE PRODUCTS:** 14
- **LIVE PRODUCTS READY WITHOUT DECISION:** 14
- **LIVE PRODUCTS REQUIRING OWNER DECISION:** 0 (within the 14)
- **LIVE-ADJACENT DECISION:** #1 Semaglutide Mid (B12) — outside the 14
- **OWNER DECISIONS TOTAL:** 13
- **TRUE FORMULARY REVIEWS:** 7
- **DUPLICATE DECISIONS:** 7
- **NET UNIQUE OWNER DECISIONS:** 13
- **FUTURE HIDDEN PRODUCTS:** 96

**Cleanup / deactivation approvals (no write):**
1. Add Sync → DEACTIVATE
2. Metformin (Metabolic / Weight Support) → DEACTIVATE (DO NOT ADD METFORMIN)
3. Metformin / Topiramate → DEACTIVATE (DO NOT ADD METFORMIN)
4. BPC-157 (Copy 1) → MERGE into BPC-157 Injection `KXMm9SsbOEYnFy9phmZn` then deactivate duplicate

| Gate | Status |
|---|---|
| GEN CREATED / UPDATED / DEACTIVATED | 0 / 0 / 0 |
| GEN MODIFIED | NO |
| GEN/WHOP CUTOVER | OFF |
| PRODUCTION WEBSITE MODIFIED | NO |

---

## Section 1 — Final 14 LIVE_NOW products

| Display name | Current website name | GEN clientProductId | Current GEN price | Proposed MBM retail | Delivery | Formulation | #Pairings | Pharmacies | Action | Material / price flag |
|---|---|---|---:|---:|---|---|---:|---|---|---|
| AOD-9604 / MOTS-C / Tesamorelin Injection | Fat Burner ($259) | `7Kix55LA15U0lNvY9QXI` | $219 | $219 | Injection | AOD-9604 | 3 | Optimal Balance Pharmacy | **UPDATE** | Closest website Fat Burner $259 vs workbook Triple $219 / GEN matched AOD-9604/MOTS-C amount 0 **PRICE FLAG:** Proposed $219.0 vs Fat Burner $259 |
| AOD-9604 Injection | No standalone AOD SKU (Fat Burner is the triple) | `PRIG7DYPNNgco3lGf1zx` | $179 | $179 | Injection | AOD-9604 | 2 | Optimal Balance Pharmacy | **UPDATE** | Standalone AOD $179 ≠ Fat Burner $259 |
| BPC-157 / TB-500 Capsules | Wolverine: BPC-157/TB-500 Capsule ($99) | `iJtyig611AZEDBGdvRd9` | $169 | $169 | Capsule | BPC-157 | 4 | Greenwich Pharmacy | **KEEP** | GEN/workbook $169 vs website capsule $99 **PRICE FLAG:** Proposed $169.0 vs website capsule $99 |
| BPC-157 Injection | Closest Wolverine injection $199 (blend — not plain BPC) | `KXMm9SsbOEYnFy9phmZn` | $199 | $199 | Injection | BPC-157 | 8 | Greenwich Pharmacy, Optimal Balance Pharmacy | **MERGE** | Price $199 matches Wolverine inj; formulation differs (plain BPC vs blend) |
| BPC-157 — Unspecified | Closest Wolverine / multi-peptide blend listings | `None` | $189 | $189 | Unspecified | BPC/TB/GHK/KPV blend | 4 | Greenwich Pharmacy | **CREATE** | Rename Unspecified; workbook live $189 vs Wolverine inj $199 **PRICE FLAG:** Blend $189.0 vs Wolverine inj $199 |
| GHK-Cu / Minoxidil Topical Combo | Minoxidil Combination Topical Formula ($129) — not exact match | `489YrehNXRlL77fYPkOn` | $149 | $149 | Topical | Minoxidil/GHK-Cu combo (workbook proposal) | 1 | Epiq Scripts | **UPDATE** | GEN/workbook $149 vs website minoxidil combo $129 **PRICE FLAG:** Proposed $149.0 vs website $129 |
| Semaglutide Injection — 3-Month (B12) | No dedicated 3-month SKU in current products.ts catalog | `sN2ggSXRJINjElMYTQjf` | $799 | $799 | Injection | B12 | 2 | Dirx-Hub | **UPDATE** | GEN/workbook $799 bundle — confirm website offer |
| Semaglutide Injection — Any Dose (B12) | Semaglutide Membership ($149/mo) — no separate B12 membership SKU | `MkDIUw0NcJB7YL2pNzYW` | $189 | $189 | Injection | B12 | 5 | Dirx-Hub | **UPDATE** | GEN Any Dose B12 $189 vs membership $149 **PRICE FLAG:** Proposed $189.0 vs membership $149 |
| Semaglutide Injection — Any Dose (Glycine) | Semaglutide Membership ($149/mo) | `wQK2JsFnh7oFBf3Lag4n` | $149 | $149 | Injection | Glycine | 5 | Dirx-Hub | **UPDATE** | Membership program formulation moving toward Glycine Any Dose vs historical +B6 copy |
| Semaglutide Injection — High (B12) | Semaglutide + B6 Injection (high vial SKUs) | `34I2X8MpVZf3AQTff3bo` | $199 | $199 | Injection | B12 | 2 | Dirx-Hub | **UPDATE** | Website +B6 vs GEN B12 **PRICE FLAG:** Dose-tier $199.0 ≠ website +B6 vial prices [119, 139, 189.02, 329] |
| Semaglutide Injection — High (Glycine) | Semaglutide + B6 Injection (high vial SKUs) | `sssEk3FDY4LFbQYGQsLx` | $129 | $129 | Injection | Glycine | 2 | Dirx-Hub | **UPDATE** | Website +B6 vs GEN Glycine mismatch **PRICE FLAG:** Dose-tier $129.0 ≠ website +B6 vial prices [119, 139, 189.02, 329] |
| Semaglutide Injection — Mid (Glycine) | Semaglutide + B6 Injection (mid vial SKUs) | `CjqOUbPuGPZzxephqRou` | $109 | $109 | Injection | Glycine | 1 | Dirx-Hub | **UPDATE** | Website +B6 vs GEN Glycine mismatch **PRICE FLAG:** Dose-tier $109.0 ≠ website +B6 vial prices [119, 139, 189.02, 329] |
| Semaglutide Injection — Starting / Low (B12) | Semaglutide + B6 Injection (starting vial SKUs) | `SkqQHmsc0WdsbK9vmV1y` | — | — | Injection | B12 | 3 | Dirx-Hub | **UPDATE** | Website +B6 vs GEN B12; GEN amount unset/0 |
| Semaglutide Injection — Starting / Low (Glycine) | Semaglutide + B6 Injection (starting/low vial SKUs) | `tk2GW39OGr7JX4MCCoJP` | $119 | $119 | Injection | Glycine | 2 | Dirx-Hub | **UPDATE** | Website still lists Semaglutide + B6; GEN ladder is Glycine |

Proposed retail = workbook Current GEN Price when present; else non-zero GEN amount. No new retail invented.

---

## Section 2 — The 13 owner decisions

### DECISION #1
**PRODUCT FAMILY:** Weight Management  
**PRODUCT:** Semaglutide Injection — Mid (B12)  
**LIVE_NOW or FUTURE_HIDDEN:** LIVE_NOW  

**CURRENT GEN PRODUCT(S):** None matched  
**PROPOSED PRODUCT(S):** Semaglutide Injection — Mid (B12)  

**FORMULARY OPTION A:** Dirx-Hub SEMAGLUTIDE + VITAMIN B12 mid-tier vial(s) under Mid (B12) CP  
**FORMULARY OPTION B:** No Mid (B12) CP; Mid vials only via Any Dose (B12)  

**PRICE DIFFERENCE:** —  
**WHY OWNER DECISION IS REQUIRED:** B12 Mid has formulary vial coverage in the blueprint but no LIVE website/GEN parent today.  

**OPTION A:** Create/prepare Semaglutide Injection — Mid (B12) (hidden or later live) and pair Mid B12 vials under it.

**OPTION B:** Omit Mid B12 client product for now; only use Mid vials under Any Dose (B12) later if multi-pairing is approved.

**RECOMMENDED STRUCTURAL CHOICE:** A — keeps dose-ladder symmetry with live Glycine Mid; supported by selected Mid B12 vial coverage.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #2
**PRODUCT FAMILY:** Recovery & Performance  
**PRODUCT:** 5-Amino Injectable  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** 5-Amino Injectable  
**PROPOSED PRODUCT(S):** 5-Amino Injectable  

**FORMULARY OPTION A:** Injectable 5-Amino-1MQ formulary (confirm exact row)  
**FORMULARY OPTION B:** Capsule proposal: 5-Amino capsules 50mg  

**PRICE DIFFERENCE:** —  
**WHY OWNER DECISION IS REQUIRED:** Name is injectable; workbook proposal is capsule.  

**OPTION A:** Keep injectable 5-Amino-1MQ product; pair only to injectable formulary once confirmed.

**OPTION B:** Reclassify as capsule product and use capsule formulary only if that is the intended offer.

**RECOMMENDED STRUCTURAL CHOICE:** A — do not pair injectable-named product to capsule row.

**DUPLICATE of Section 3 True Review:** 5-Amino Injectable

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #3
**PRODUCT FAMILY:** Other  
**PRODUCT:** Accelerate & Thrive  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** Accelerate & Thrive  
**PROPOSED PRODUCT(S):** Accelerate & Thrive  

**FORMULARY OPTION A:** Split into distinct CPs (see masters in JSON)  
**FORMULARY OPTION B:** Keep catch-all (not recommended)  

**PRICE DIFFERENCE:** —  
**WHY OWNER DECISION IS REQUIRED:** Over-collapsed catch-all (31 masters; signals=['combo', 'kisspeptin']) — should be split into separate patient-facing products before any GEN writes  

**OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**RECOMMENDED STRUCTURAL CHOICE:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #4
**PRODUCT FAMILY:** Women's Hormone Therapy  
**PRODUCT:** HRT Other — Unspecified  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** None matched  
**PROPOSED PRODUCT(S):** HRT Other — Unspecified  

**FORMULARY OPTION A:** Split into distinct CPs (see masters in JSON)  
**FORMULARY OPTION B:** Keep catch-all (not recommended)  

**PRICE DIFFERENCE:** —  
**WHY OWNER DECISION IS REQUIRED:** Over-collapsed catch-all (16 masters; signals=['anastrozole', 'clomiphene', 'combo', 'enclomiphene', 'gonadorelin', 'hcg', 'kisspeptin', 'tamoxifen']) — should be split into separate patient-facing products before any GEN writes  

**OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**RECOMMENDED STRUCTURAL CHOICE:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #5
**PRODUCT FAMILY:** Prescription Skin & Hair  
**PRODUCT:** Minoxidil / Hair — Unspecified  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** Hair Loss – Dual Combo (Finasteride/Minoxidil)  
**PROPOSED PRODUCT(S):** Minoxidil / Hair — Unspecified  

**FORMULARY OPTION A:** Split into distinct CPs (see masters in JSON)  
**FORMULARY OPTION B:** Keep catch-all (not recommended)  

**PRICE DIFFERENCE:** —  
**WHY OWNER DECISION IS REQUIRED:** Over-collapsed catch-all (1 masters; signals=['combo', 'finasteride', 'minoxidil']) — should be split into separate patient-facing products before any GEN writes  

**OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**RECOMMENDED STRUCTURAL CHOICE:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #6
**PRODUCT FAMILY:** Longevity & Cognitive Health  
**PRODUCT:** NAD+ (Injectable)  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** NAD+ (Injectable)  
**PROPOSED PRODUCT(S):** NAD+ (Injectable)  

**FORMULARY OPTION A:** Confirm injectable NAD+ formulary  
**FORMULARY OPTION B:** Nasal proposal: NAD+ 50mg/ml  

**PRICE DIFFERENCE:** Landed A=60 vs B=75  
**WHY OWNER DECISION IS REQUIRED:** Injectable NAD+ row carries nasal spray form/proposal.  

**OPTION A:** NAD+ Injection = injection formulary only.

**OPTION B:** NAD+ Nasal Spray = separate product; do not cross-pair.

**RECOMMENDED STRUCTURAL CHOICE:** Use both as separate products (split by delivery form).

**DUPLICATE of Section 3 True Review:** NAD+ (Injectable)

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #7
**PRODUCT FAMILY:** Sexual Wellness  
**PRODUCT:** Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone  
**PROPOSED PRODUCT(S):** Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone  

**FORMULARY OPTION A:** Sildenafil/Testosterone 120mg/22mg  
**FORMULARY OPTION B:** Alternate cream variants / defer  

**PRICE DIFFERENCE:** —  
**WHY OWNER DECISION IS REQUIRED:** Exact Scream Cream composition/pharmacy still needs owner confirmation (variants exist).  

**OPTION A:** Approve one exact cream formulary under one FUTURE_HIDDEN Scream Cream product.

**OPTION B:** Defer Scream Cream until exact formulation is confirmed.

**RECOMMENDED STRUCTURAL CHOICE:** None — not enough evidence (no clinical call).

**DUPLICATE of Section 3 True Review:** Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #8
**PRODUCT FAMILY:** Sexual Wellness  
**PRODUCT:** Sildenafil (3 Month)  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** Sildenafil (3 Month)  
**PROPOSED PRODUCT(S):** Sildenafil (3 Month)  

**FORMULARY OPTION A:** SILDENAFIL tablet/capsule formulary (e.g. VitaScripts 100 mg)  
**FORMULARY OPTION B:** Sildenafil/Testosterone 120mg/22mg  

**PRICE DIFFERENCE:** —  
**WHY OWNER DECISION IS REQUIRED:** Sildenafil-named product proposed to Scream Cream formulary.  

**OPTION A:** Pair only to Sildenafil tablet/capsule formulary; keep Scream Cream separate.

**OPTION B:** Rename these offers to Scream Cream programs if cream is truly intended.

**RECOMMENDED STRUCTURAL CHOICE:** A — no silent Scream Cream substitution under Sildenafil name.

**DUPLICATE of Section 3 True Review:** Sildenafil (3 Month)

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #9
**PRODUCT FAMILY:** Sexual Wellness  
**PRODUCT:** Sildenafil (6 Month)  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** Sildenafil (6 Month)  
**PROPOSED PRODUCT(S):** Sildenafil (6 Month)  

**FORMULARY OPTION A:** SILDENAFIL tablet/capsule formulary (e.g. VitaScripts 100 mg)  
**FORMULARY OPTION B:** Sildenafil/Testosterone 120mg/22mg  

**PRICE DIFFERENCE:** —  
**WHY OWNER DECISION IS REQUIRED:** Sildenafil-named product proposed to Scream Cream formulary.  

**OPTION A:** Pair only to Sildenafil tablet/capsule formulary; keep Scream Cream separate.

**OPTION B:** Rename these offers to Scream Cream programs if cream is truly intended.

**RECOMMENDED STRUCTURAL CHOICE:** A — no silent Scream Cream substitution under Sildenafil name.

**DUPLICATE of Section 3 True Review:** Sildenafil (6 Month)

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #10
**PRODUCT FAMILY:** Sexual Wellness  
**PRODUCT:** Sildenafil — Unspecified  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** ED – Caffeine / Sildenafil (Performance Boost)  
**PROPOSED PRODUCT(S):** Sildenafil — Unspecified  

**FORMULARY OPTION A:** Split into distinct CPs (see masters in JSON)  
**FORMULARY OPTION B:** Keep catch-all (not recommended)  

**PRICE DIFFERENCE:** —  
**WHY OWNER DECISION IS REQUIRED:** Over-collapsed catch-all (5 masters; signals=['combo', 'sildenafil', 'tadalafil']) — should be split into separate patient-facing products before any GEN writes  

**OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**RECOMMENDED STRUCTURAL CHOICE:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #11
**PRODUCT FAMILY:** Sexual Wellness  
**PRODUCT:** Tadalafil — Unspecified  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** ED – Tadalafil (Daily / Low Dose)  
**PROPOSED PRODUCT(S):** Tadalafil — Unspecified  

**FORMULARY OPTION A:** Split into distinct CPs (see masters in JSON)  
**FORMULARY OPTION B:** Keep catch-all (not recommended)  

**PRICE DIFFERENCE:** —  
**WHY OWNER DECISION IS REQUIRED:** Over-collapsed catch-all (4 masters; signals=['combo', 'tadalafil', 'vardenafil']) — should be split into separate patient-facing products before any GEN writes  

**OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**RECOMMENDED STRUCTURAL CHOICE:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #12
**PRODUCT FAMILY:** Weight Management  
**PRODUCT:** Tirzepatide Injection — B12+Glycine (ambiguous)  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** None matched  
**PROPOSED PRODUCT(S):** Tirzepatide Injection — B12+Glycine (ambiguous)  

**FORMULARY OPTION A:** TIRZEPATIDE + GLYCINE vials (Dirx-Hub)  
**FORMULARY OPTION B:** Separate B12 + Glycine ladders (or reject)  

**PRICE DIFFERENCE:** Landed A=70 vs B=70  
**WHY OWNER DECISION IS REQUIRED:** Labels claim both B12 and Glycine, but proposed/selected context is Glycine-only. Silent choice would mis-label additive.  

**OPTION A:** Treat as Glycine-ladder products (rename) and attach Glycine vials only.

**OPTION B:** Split into separate B12 and Glycine Tirzepatide products, or reject both labels until clarified.

**RECOMMENDED STRUCTURAL CHOICE:** None — not enough evidence (no clinical call).

**DUPLICATE of Section 3 True Review:** Tirzepatide/B12/Glycine, Tirzepatide/Glycine/B12

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

### DECISION #13
**PRODUCT FAMILY:** Prescription Skin & Hair  
**PRODUCT:** Tretinoin / Skin — Unspecified  
**LIVE_NOW or FUTURE_HIDDEN:** FUTURE_HIDDEN  

**CURRENT GEN PRODUCT(S):** Finasteride, Tretinoin, Fluocinolone, VitaminE  
**PROPOSED PRODUCT(S):** Tretinoin / Skin — Unspecified  

**FORMULARY OPTION A:** Split into distinct CPs (see masters in JSON)  
**FORMULARY OPTION B:** Keep catch-all (not recommended)  

**PRICE DIFFERENCE:** —  
**WHY OWNER DECISION IS REQUIRED:** Over-collapsed catch-all (3 masters; signals=['combo', 'finasteride', 'minoxidil', 'spray', 'tretinoin']) — should be split into separate patient-facing products before any GEN writes  

**OPTION A:** Split catch-all into separate patient-facing products before GEN writes.

**OPTION B:** Keep one umbrella product (usually wrong for shopping/prescribing clarity).

**RECOMMENDED STRUCTURAL CHOICE:** A — this is over-collapse, not pharmacy/vial duplication.

**OWNER RESPONSE:**
- [ ] A
- [ ] B
- [ ] OTHER

---

## Section 3 — 7 TRUE FORMULARY REVIEWS

### 5-Amino Injectable
**DUPLICATE DECISION** — already in Decision #2. Do not decide twice.

- **Candidate formulation(s):** 5-Amino capsules 50mg
- **Pharmacy:** Greenwich Pharmacy
- **Strength/concentration:** 50mg
- **Dosage form:** 
- **Package/vial size:** 1EA
- **Pharmacy cost:** 2.6
- **Shipping cost:** 25
- **Total landed cost:** 27.6
- **Why unresolved:** Injectable product name paired to capsule formulary — form mismatch

### NAD+ (Injectable)
**DUPLICATE DECISION** — already in Decision #6. Do not decide twice.

- **Candidate formulation(s):** NAD+ 50mg/ml · Alt: NAD+ 200mg/ml
- **Pharmacy:** St Luke / St Luke
- **Strength/concentration:** 50mg/ml
- **Dosage form:** Nasal Spray
- **Package/vial size:** 15ml
- **Pharmacy cost:** 30
- **Shipping cost:** 30
- **Total landed cost:** 60
- **Why unresolved:** Injectable NAD+ master row carries Nasal Spray form/proposed pairing

### Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone
**DUPLICATE DECISION** — already in Decision #7. Do not decide twice.

- **Candidate formulation(s):** Sildenafil/Testosterone 120mg/22mg
- **Pharmacy:** St Luke
- **Strength/concentration:** 120mg/22mg
- **Dosage form:** Troche
- **Package/vial size:** Each
- **Pharmacy cost:** 2.75
- **Shipping cost:** 30
- **Total landed cost:** 32.75
- **Why unresolved:** Sildenafil-named product proposed to Scream Cream formulary — do not silently substitute; Scream Cream exact composition/pharmacy confirmation still required vs alternate cream formulas

### Sildenafil (3 Month)
**DUPLICATE DECISION** — already in Decision #8. Do not decide twice.

- **Candidate formulation(s):** Sildenafil/Testosterone 120mg/22mg
- **Pharmacy:** St Luke
- **Strength/concentration:** 120mg/22mg
- **Dosage form:** Troche
- **Package/vial size:** Each
- **Pharmacy cost:** 2.75
- **Shipping cost:** 30
- **Total landed cost:** 32.75
- **Why unresolved:** Sildenafil-named product proposed to Scream Cream formulary — do not silently substitute

### Sildenafil (6 Month)
**DUPLICATE DECISION** — already in Decision #9. Do not decide twice.

- **Candidate formulation(s):** Sildenafil/Testosterone 120mg/22mg
- **Pharmacy:** St Luke
- **Strength/concentration:** 120mg/22mg
- **Dosage form:** Troche
- **Package/vial size:** Each
- **Pharmacy cost:** 2.75
- **Shipping cost:** 30
- **Total landed cost:** 32.75
- **Why unresolved:** Sildenafil-named product proposed to Scream Cream formulary — do not silently substitute

### Tirzepatide/B12/Glycine
**DUPLICATE DECISION** — already in Decision #12. Do not decide twice.

- **Candidate formulation(s):** TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) · Alt: TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL)
- **Pharmacy:** Dirx-Hub / Dirx-Hub
- **Strength/concentration:** 5mg/0.5mg/mL
- **Dosage form:** Vial
- **Package/vial size:** 2mL
- **Pharmacy cost:** 65
- **Shipping cost:** 5
- **Total landed cost:** 70
- **Why unresolved:** Label claims both B12 and Glycine; proposed row is Glycine-only vial — ambiguous which ladder

### Tirzepatide/Glycine/B12
**DUPLICATE DECISION** — already in Decision #12. Do not decide twice.

- **Candidate formulation(s):** TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) · Alt: TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL)
- **Pharmacy:** Dirx-Hub / Dirx-Hub
- **Strength/concentration:** 5mg/0.5mg/mL
- **Dosage form:** Vial
- **Package/vial size:** 2mL
- **Pharmacy cost:** 65
- **Shipping cost:** 5
- **Total landed cost:** 70
- **Why unresolved:** Label claims both B12 and Glycine; proposed row is Glycine-only vial — ambiguous which ladder

---

## Section 4 — Cleanup approval (no writes)

1. **Add Sync** — Proposed: **DEACTIVATE**
2. **Metformin (Metabolic / Weight Support)** — Proposed: **DEACTIVATE** — DO NOT ADD METFORMIN
3. **Metformin / Topiramate** — Proposed: **DEACTIVATE** — DO NOT ADD METFORMIN
4. **BPC-157 (Copy 1)** — Proposed: **MERGE** into **BPC-157 Injection** `KXMm9SsbOEYnFy9phmZn`, then deactivate duplicate

Confirm primary BPC: **BPC-157 Injection** / `KXMm9SsbOEYnFy9phmZn`

**Owner cleanup approval:**
- [ ] Approve cleanup list (still no GEN writes)
- [ ] Hold

---

## Section 5 — Future catalog (96 recommended)

All remain: showPatient=false · website OFF · checkout OFF

**PT-141 Nasal Spray in blueprint:** YES  
**Scream Cream in blueprint:** YES

### Weight Management
- Client products: **38**
- Formulary pairings: **78**
- Existing GEN reused: **19**
- New GEN eventually required: **19**

- Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan
- Liraglutide — Unspecified
- Orforglipron (Oral) — Any Dose
- Orforglipron (Oral) — High
- Orforglipron (Oral) — Mid
- Orforglipron (Oral) — Starting / Low
- Ozempic (Semaglutide)
- Retatrutide — Unspecified
- Semaglutide + Ondansetron (Nausea Support)
- Semaglutide Injection — Any Dose (L-Carnitine)
- Semaglutide Injection — High (L-Carnitine)
- Semaglutide Injection — Mid (L-Carnitine)
- Semaglutide Injection — Starting / Low (L-Carnitine)
- Semaglutide Oral / Sublingual — High
- Semaglutide Oral / Sublingual — Mid
- Semaglutide Oral / Sublingual — Starting / Low
- Semaglutide Weight Loss Plan – Semaglutide (Any Dose)
- Semaglutide Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply
- Semaglutide Weight Loss Plan – Semaglutide (High Dose / Maintenance)
- Semaglutide Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply
- Semaglutide Weight Loss Plan – Semaglutide (Low Dose)
- Semaglutide Weight Loss Plan – Semaglutide (Mid Dose)
- Semaglutide Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply
- Semaglutide Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply
- Semaglutide Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Low: 1→2→4mg)
- Semaglutide/B12 (6 Months)
- Semaglutide/B12/Glycine
- The Ultimate Semaglutide Stack
- Tirzepatide + Ondansetron (Nausea Support)
- Tirzepatide Injection — 3-Month (B12)
- Tirzepatide Injection — 3-Month (Glycine)
- Tirzepatide Injection — Any Dose (B12)
- Tirzepatide Injection — Any Dose (Glycine)
- Tirzepatide Injection — High (Glycine)
- Tirzepatide Injection — Mid (Glycine)
- Tirzepatide Injection — Starting / Low (Glycine)
- Tirzepatide Injection — Starting / Low (L-Carnitine)
- Tirzepatide Injection — Starting / Low (Niacinamide)

### Longevity & Cognitive Health
- Client products: **10**
- Formulary pairings: **21**
- Existing GEN reused: **5**
- New GEN eventually required: **5**

- Dihexa — Unspecified
- Epithalon Injection
- NAD+ Injection
- NAD+ Nasal Spray
- NAD+ — Topical
- Pinealon — Unspecified
- Selank — Unspecified
- Semax — Unspecified

### Recovery & Performance
- Client products: **19**
- Formulary pairings: **38**
- Existing GEN reused: **13**
- New GEN eventually required: **6**

- 5-Amino-1MQ Injection
- BPC-157 — Unspecified
- CJC-1295 / Ipamorelin Injection
- DSIP Injection
- GHK-Cu / Epithalon Injection
- GHK-Cu Injection
- GHK-Cu — Unspecified
- Glutathione — Capsule
- Glutathione — Injection
- Glutathione — Topical
- IGF-1 LR3 — Unspecified
- LL-37 Injection
- MOTS-C Injection
- TB-500 / Blends — Unspecified
- Tesamorelin / Ipamorelin Injection
- Thymosin Alpha-1 Injection

### Women's Hormone Therapy
- Client products: **8**
- Formulary pairings: **34**
- Existing GEN reused: **0**
- New GEN eventually required: **8**

- Estradiol / HRT — Vaginal Cream
- HRT Other — Capsule
- Progesterone / HRT — Cream
- Progesterone / HRT — Unspecified
- Testosterone / HRT — Cream
- Testosterone / HRT — Injection
- Testosterone / HRT — Troche
- Testosterone / HRT — Unspecified

### Prescription Skin & Hair
- Client products: **5**
- Formulary pairings: **6**
- Existing GEN reused: **5**
- New GEN eventually required: **0**

- Finasteride / Hair — Capsule
- Finasteride / Hair — Topical
- Finasteride / Hair — Unspecified
- Minoxidil / Hair — Capsule
- Minoxidil / Hair — Topical

### Sexual Wellness
- Client products: **5**
- Formulary pairings: **5**
- Existing GEN reused: **5**
- New GEN eventually required: **0**

- Oxytocin — Capsule
- Oxytocin — Nasal Spray
- Oxytocin — Unspecified
- Scream Cream
- Vardenafil — Unspecified

### Research Wellness
- Client products: **1**
- Formulary pairings: **6**
- Existing GEN reused: **1**
- New GEN eventually required: **0**

- PT-141 (Bremelanotide) Nasal Spray

### Other
- Client products: **10**
- Formulary pairings: **14**
- Existing GEN reused: **4**
- New GEN eventually required: **6**

- Hair Loss – Dutasteride (Oral)
- Ivermectin — Capsule
- Ivermectin — Topical
- Pregnyl - HCG (Merck)
- SS-31 (Elamipretide) Mitochondrial Protection Protocol
- Sermorelin — Injection
- Sermorelin — Troche
- Trimix T106 (Papaverine +Phentolamine +PGE)

---

**STOP FOR OWNER APPROVAL.**

Do **not** run GEN-CATALOG-2. Do **not** POST/PATCH/DELETE in GEN.
