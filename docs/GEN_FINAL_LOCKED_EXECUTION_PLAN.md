# GEN Final Locked Execution Plan (GEN-CATALOG-1G)

**READ-ONLY — approval update only. No GEN writes. Do not run GEN-CATALOG-2 yet.**
**Generated:** 2026-08-24T06:59:21Z
**Status:** LOCKED for final price + execution review

## Owner retail pricing rule (LOCKED)

**Authoritative for GEN-CATALOG-2 and website catalog sync:** `docs/GEN_FINAL_MBM_RETAIL_PRICING.md`

```
raw_retail = (pharmacy_medication_cost × 1.75) + pharmacy_shipping
final_retail = nearest whole-dollar ending in 9 (equidistant → ROUND UP)
```

**NOT** `(at_cost + shipping) × 1.75`

- Customer medication shipping included in retail — do not add again at checkout
- Website/GEN prices are reference only
- Multiple cost bases → MULTIPLE_COST_BASIS_REVIEW (no silent choice)
- 1H summary: PRODUCTS_PRICED=70, LIVE_NOW ready=8/16, FUTURE ready=37/111, MULTI review=25, MISSING_COST=57


---

## Final owner decisions (all 13 resolved)

### Decision #1 — Semaglutide Injection — Mid (B12)
- **Choice / status:** `A` / **APPROVED**
- **Owner instruction:** Create/retain separate Mid B12 client product. B12 ladder = Starting/Low, Mid, High, Any Dose, 3-Month as applicable.
- **Execution effect:** READY_FOR_WRITE (CREATE Mid B12 CP; pair Mid B12 vials only)

### Decision #2 — 5-Amino Injectable
- **Choice / status:** `A` / **APPROVED**
- **Owner instruction:** Keep injectable product; pair only to confirmed injectable formulary. Do not substitute capsule formulary.
- **Execution effect:** DEFERRED pending confirmed injectable 5-Amino-1MQ formulary (capsule pairing forbidden)

### Decision #3 — Accelerate & Thrive
- **Choice / status:** `A` / **APPROVED**
- **Owner instruction:** Split over-collapsed catch-all into appropriate distinct patient-facing products.
- **Execution effect:** SPLIT_REQUIRED — do not write umbrella; emit distinct CPs from master list (FUTURE_HIDDEN until each has clear formulary)
- **Distinct products to split into (31):**
  - Accelerate & Thrive
  - ARA-290 Neuroprotection & Nerve Repair Protocol
  - BAM-15 Mitochondrial Uncoupler Protocol
  - Elite Body Recomp
  - Elite Regenesis
  - Kisspeptin-10
  - KPV Anti-Inflammatory Gut & Systemic Protocol
  - Lean & Energized
  - Lean & Ready
  - Lean & Timeless
  - Melanotan 2 Tanning & Sexual Health Protocol
  - PE-22-28
  - PE-22-28 Antidepressant & Cognitive Protocol
  - Peak Performance
  - Peptides – Kisspeptin-10
  - Performance – Oxandrolone (High Dose)
  - Performance – Oxandrolone (Low Dose)
  - Performance – Stanozolol
  - Power & Recovery
  - Sculpt & Perform
  - Slim & Sensational
  - Slim & Timeless
  - SLU-PP-332 Metabolic & Exercise Mimetic Protocol
  - The Ultimate Protocol
  - Thyroid Support (BioThyroid)
  - Total Transformation
  - Vitality & Longevity
  - Wellness – Low-Dose Naltrexone (LDN) Starter
  - Wellness – Low-Dose Naltrexone (LDN) Therapeutic
  - Wellness – MIC-B12 (Lipotropic / Fat Burn)
  - Wellness – MIC-B12 (Lipotropic / Fat Burn)

### Decision #4 — HRT Other — Unspecified
- **Choice / status:** `A` / **APPROVED**
- **Owner instruction:** Split into distinct patient-facing products. Do not maintain one umbrella HRT product.
- **Execution effect:** SPLIT_REQUIRED — no umbrella HRT write
- **Distinct products to split into (16):**
  - Hormone + Intimacy
  - Kisspeptin-10 Reproductive Hormone Protocol
  - Men's Hormones – Fertility (Clomiphene)
  - Men's Hormones – Fertility (HCG)
  - Men's Hormones – Gonadorelin
  - Men's Hormones – PCT / Estrogen Blocker (Tamoxifen)
  - Men's Hormones (TRT) – Estrogen Management (Anastrozole)
  - Men's Hormones (TRT) – Fertility / HPTA Support (Enclomiphene)
  - Mens HRT/TRT In-Clinic Approval
  - Mens TRT/HRT 1 Month Plan
  - Mens TRT/HRT 3 Month Plan
  - Mens TRT/HRT 6 Month Plan
  - Womens HRT GFE In-Clinic Approval
  - Womens TRT/HRT 1 Month Plan
  - Womens TRT/HRT 3 Month Plan
  - Womens TRT/HRT 6 Month Plan

### Decision #5 — Minoxidil / Hair — Unspecified
- **Choice / status:** `A` / **APPROVED**
- **Owner instruction:** Split into the actual distinct hair-loss/combo product(s).
- **Execution effect:** SPLIT_REQUIRED — use distinct hair products (e.g. Dual Combo Finasteride/Minoxidil), not unspecified umbrella
- **Distinct products to split into (1):**
  - Hair Loss – Dual Combo (Finasteride/Minoxidil)

### Decision #6 — NAD+ (Injectable)
- **Choice / status:** `SEPARATE_DELIVERY_FORMS` / **APPROVED**
- **Owner instruction:** NAD+ Injection and NAD+ Nasal Spray must remain separate client products. Never cross-pair nasal formulary to injectable product.
- **Execution effect:** READY structure: keep nad-injection and nad-nasal separate; reject cross-pair on review-nadinjectable; DEFERRED injectable pairing until injectable formulary confirmed for injectable-named row

### Decision #7 — Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone
- **Choice / status:** `B` / **DEFERRED**
- **Owner instruction:** Do not attach Sildenafil/Testosterone troche to Scream Cream. Keep Scream Cream FUTURE_HIDDEN; do not create/pair until exact cream formulation confirmed.
- **Execution effect:** DEFERRED — no create/pair in GEN-CATALOG-2 until exact cream formulary confirmed

### Decision #8 — Sildenafil (3 Month)
- **Choice / status:** `A` / **APPROVED**
- **Owner instruction:** Use Sildenafil tablet/capsule formulary only. Scream Cream remains separate.
- **Execution effect:** READY_FOR_WRITE only after tablet/capsule formulary confirmed; forbid Scream Cream / troche pairing

### Decision #9 — Sildenafil (6 Month)
- **Choice / status:** `A` / **APPROVED**
- **Owner instruction:** Use Sildenafil tablet/capsule formulary only. Scream Cream remains separate.
- **Execution effect:** READY_FOR_WRITE only after tablet/capsule formulary confirmed; forbid Scream Cream / troche pairing

### Decision #10 — Sildenafil — Unspecified
- **Choice / status:** `A` / **APPROVED**
- **Owner instruction:** Split distinct Sildenafil/Tadalafil/combo products. Do not use one umbrella ED product.
- **Execution effect:** SPLIT_REQUIRED — no umbrella ED write
- **Distinct products to split into (5):**
  - ED – Caffeine / Sildenafil (Performance Boost)
  - ED – Sildenafil (On-Demand)
  - ED – Sildenafil / Tadalafil Combo
  - Sildenafil
  - Tadalafil+Sildenafil

### Decision #11 — Tadalafil — Unspecified
- **Choice / status:** `A` / **APPROVED**
- **Owner instruction:** Split distinct daily/on-demand/combo products.
- **Execution effect:** SPLIT_REQUIRED — no umbrella Tadalafil write
- **Distinct products to split into (4):**
  - ED – Tadalafil (Daily / Low Dose)
  - ED – Tadalafil (On-Demand / High Dose)
  - Tadalafil
  - Vardenafil+Tadalafil+Apormorphine

### Decision #12 — Tirzepatide Injection — B12+Glycine (ambiguous)
- **Choice / status:** `REJECT_DEFER_AMBIGUOUS_LABELS` / **REJECTED_DEFERRED**
- **Owner instruction:** Do not map either ambiguous B12+Glycine label to a B12-only or Glycine-only formulary. Do not create a B12+Glycine product unless an actual matching B12+Glycine formulary is later confirmed. Existing policy: Tirzepatide B12 ladder separate; Tirzepatide Glycine ladder separate.
- **Execution effect:** EXCLUDE from write — reject/defer Tirzepatide/B12/Glycine and Tirzepatide/Glycine/B12 labels
- **Labels rejected/deferred:** `Tirzepatide/B12/Glycine`, `Tirzepatide/Glycine/B12`

### Decision #13 — Tretinoin / Skin — Unspecified
- **Choice / status:** `A` / **APPROVED**
- **Owner instruction:** Split into the actual distinct skin/hair products and combinations.
- **Execution effect:** SPLIT_REQUIRED — no umbrella tretinoin/skin write
- **Distinct products to split into (3):**
  - Finasteride, Tretinoin, Fluocinolone, VitaminE
  - Hair Loss - Minoxdil/Tretinoin/Fluocinolone/Finasteride Spray
  - Hair Loss – Triple Combo (Finasteride/Minoxidil/Tretinoin)

### Structural policy (confirmed)
- **Tirzepatide:** Tirzepatide B12 ladder = separate. Tirzepatide Glycine ladder = separate. Do not combine.

### Cleanup (approved — no writes executed)
- **Add Sync** → `DEACTIVATE`
- **Metformin (Metabolic / Weight Support)** → `DEACTIVATE` (DO NOT ADD METFORMIN)
- **Metformin / Topiramate** → `DEACTIVATE` (DO NOT ADD METFORMIN)
- **BPC-157 (Copy 1)** → `MERGE_THEN_DEACTIVATE` → `BPC-157 Injection` `KXMm9SsbOEYnFy9phmZn`

---

## 1. Products READY FOR WRITE

Gated by **final price + execution review**. No writes until that gate clears.

**Total:** 112 (LIVE 15 · FUTURE_HIDDEN 97)

### LIVE_NOW / live-adjacent

| Product | GEN id | Action | Proposed retail | Price review required |
|---|---|---|---:|:---:|
| AOD-9604 / MOTS-C / Tesamorelin Injection | `7Kix55LA15U0lNvY9QXI` | UPDATE | 219.0 | YES |
| AOD-9604 Injection | `PRIG7DYPNNgco3lGf1zx` | UPDATE | 179.0 | no |
| BPC-157 / TB-500 Capsules | `iJtyig611AZEDBGdvRd9` | KEEP | 169.0 | YES |
| BPC-157 Injection | `KXMm9SsbOEYnFy9phmZn` | MERGE | 199.0 | no |
| BPC-157 — Unspecified | `None` | CREATE | 189.0 | YES |
| GHK-Cu / Minoxidil Topical Combo | `489YrehNXRlL77fYPkOn` | UPDATE | 149.0 | YES |
| Semaglutide Injection — 3-Month (B12) | `sN2ggSXRJINjElMYTQjf` | UPDATE | 799.0 | no |
| Semaglutide Injection — Any Dose (B12) | `MkDIUw0NcJB7YL2pNzYW` | UPDATE | 189.0 | YES |
| Semaglutide Injection — Any Dose (Glycine) | `wQK2JsFnh7oFBf3Lag4n` | UPDATE | 149.0 | no |
| Semaglutide Injection — High (B12) | `34I2X8MpVZf3AQTff3bo` | UPDATE | 199.0 | YES |
| Semaglutide Injection — High (Glycine) | `sssEk3FDY4LFbQYGQsLx` | UPDATE | 129.0 | YES |
| Semaglutide Injection — Mid (Glycine) | `CjqOUbPuGPZzxephqRou` | UPDATE | 109.0 | YES |
| Semaglutide Injection — Starting / Low (B12) | `SkqQHmsc0WdsbK9vmV1y` | UPDATE | None | YES |
| Semaglutide Injection — Starting / Low (Glycine) | `tk2GW39OGr7JX4MCCoJP` | UPDATE | 119.0 | no |
| Semaglutide Injection — Mid (B12) | `None` | CREATE | None | YES |


### FUTURE_HIDDEN (showPatient=false · website OFF · checkout OFF)

97 structurally eligible future products (existing GEN id and/or formulary pairings; not deferred; not umbrella-split). Full list in JSON `categories.READY_FOR_WRITE` where `bucket=FUTURE_HIDDEN`.

---

## 2. Products DEFERRED pending exact formulary

| Product | Reason |
|---|---|
| 5-Amino Injectable | Decision #2 A — wait for confirmed injectable formulary; capsule forbidden |
| NAD+ (Injectable) mis-paired nasal row | Decision #6 — never cross-pair nasal to injectable; injectable formulary must be confirmed separately |
| Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone | Decision #7 B DEFER — no create/pair until exact cream formulation confirmed; no troche |
| Women's Sexual Health – Arousal (Scream Cream) | Decision #7 B DEFER — same Scream Cream hold |
| Sildenafil (3 Month) | Decision #8 A — tablet/capsule formulary must be confirmed before pair; Scream Cream forbidden |
| Sildenafil (6 Month) | Decision #9 A — tablet/capsule formulary must be confirmed before pair; Scream Cream forbidden |
| Tirzepatide/B12/Glycine | Decision #12 REJECT/DEFER — do not map to B12-only or Glycine-only; no B12+Glycine CP without matching formulary |
| Tirzepatide/Glycine/B12 | Decision #12 REJECT/DEFER — same as above |

---

## 3. Products FUTURE_HIDDEN

Blueprint FUTURE_HIDDEN client products: **111**

All remain: `showPatient=false` · website OFF · checkout OFF until a later explicit launch decision.

Umbrellas marked **SPLIT_REQUIRED** (do not write as one product):
- Decision #3 — **Accelerate & Thrive** → 31 distinct products
- Decision #4 — **HRT Other — Unspecified** → 16 distinct products
- Decision #5 — **Minoxidil / Hair — Unspecified** → 1 distinct products
- Decision #10 — **Sildenafil — Unspecified** → 5 distinct products
- Decision #11 — **Tadalafil — Unspecified** → 4 distinct products
- Decision #13 — **Tretinoin / Skin — Unspecified** → 3 distinct products

---

## 4. Products LIVE_NOW

**Recommended live set: 14** (+ approved **Semaglutide Mid (B12)** CREATE = live-adjacent #15).

| Display name | GEN id | Action | Proposed retail | Price flag |
|---|---|---|---:|:---:|
| AOD-9604 / MOTS-C / Tesamorelin Injection | `7Kix55LA15U0lNvY9QXI` | UPDATE | 219.0 | YES |
| AOD-9604 Injection | `PRIG7DYPNNgco3lGf1zx` | UPDATE | 179.0 |  |
| BPC-157 / TB-500 Capsules | `iJtyig611AZEDBGdvRd9` | KEEP | 169.0 | YES |
| BPC-157 Injection | `KXMm9SsbOEYnFy9phmZn` | MERGE | 199.0 |  |
| BPC-157 — Unspecified | `None` | CREATE | 189.0 | YES |
| GHK-Cu / Minoxidil Topical Combo | `489YrehNXRlL77fYPkOn` | UPDATE | 149.0 | YES |
| Semaglutide Injection — 3-Month (B12) | `sN2ggSXRJINjElMYTQjf` | UPDATE | 799.0 |  |
| Semaglutide Injection — Any Dose (B12) | `MkDIUw0NcJB7YL2pNzYW` | UPDATE | 189.0 | YES |
| Semaglutide Injection — Any Dose (Glycine) | `wQK2JsFnh7oFBf3Lag4n` | UPDATE | 149.0 |  |
| Semaglutide Injection — High (B12) | `34I2X8MpVZf3AQTff3bo` | UPDATE | 199.0 | YES |
| Semaglutide Injection — High (Glycine) | `sssEk3FDY4LFbQYGQsLx` | UPDATE | 129.0 | YES |
| Semaglutide Injection — Mid (Glycine) | `CjqOUbPuGPZzxephqRou` | UPDATE | 109.0 | YES |
| Semaglutide Injection — Starting / Low (B12) | `SkqQHmsc0WdsbK9vmV1y` | UPDATE | None |  |
| Semaglutide Injection — Starting / Low (Glycine) | `tk2GW39OGr7JX4MCCoJP` | UPDATE | 119.0 |  |
| Semaglutide Injection — Mid (B12) | `None` | CREATE | None |  |

---

## 5. Products to MERGE

- **BPC-157 (Copy 1)** → **BPC-157 Injection** `KXMm9SsbOEYnFy9phmZn` then **DEACTIVATE duplicate** (approved; writeNow=false)

---

## 6. Products approved for DEACTIVATION

- **Add Sync** → DEACTIVATE (approved; writeNow=false)
- **Metformin (Metabolic / Weight Support)** → DEACTIVATE — DO NOT ADD METFORMIN (approved; writeNow=false)
- **Metformin / Topiramate** → DEACTIVATE — DO NOT ADD METFORMIN (approved; writeNow=false)

*(BPC-157 Copy 1 is MERGE then deactivate — listed under MERGE.)*

---

## Final retail-price table

Superseded by **GEN-CATALOG-1H** authoritative table:

- `docs/GEN_FINAL_MBM_RETAIL_PRICING.md`
- `docs/GEN_FINAL_MBM_RETAIL_PRICING.json`

Website/GEN columns are comparison only. Formula + $X9 rounding is pricing authority.


---

## Split plans (from approved Option A)

### Decision #3 — Accelerate & Thrive
Do **not** write umbrella. Distinct patient-facing products:
- Accelerate & Thrive
- ARA-290 Neuroprotection & Nerve Repair Protocol
- BAM-15 Mitochondrial Uncoupler Protocol
- Elite Body Recomp
- Elite Regenesis
- Kisspeptin-10
- KPV Anti-Inflammatory Gut & Systemic Protocol
- Lean & Energized
- Lean & Ready
- Lean & Timeless
- Melanotan 2 Tanning & Sexual Health Protocol
- PE-22-28
- PE-22-28 Antidepressant & Cognitive Protocol
- Peak Performance
- Peptides – Kisspeptin-10
- Performance – Oxandrolone (High Dose)
- Performance – Oxandrolone (Low Dose)
- Performance – Stanozolol
- Power & Recovery
- Sculpt & Perform
- Slim & Sensational
- Slim & Timeless
- SLU-PP-332 Metabolic & Exercise Mimetic Protocol
- The Ultimate Protocol
- Thyroid Support (BioThyroid)
- Total Transformation
- Vitality & Longevity
- Wellness – Low-Dose Naltrexone (LDN) Starter
- Wellness – Low-Dose Naltrexone (LDN) Therapeutic
- Wellness – MIC-B12 (Lipotropic / Fat Burn)
- Wellness – MIC-B12 (Lipotropic / Fat Burn)

### Decision #4 — HRT Other — Unspecified
Do **not** write umbrella. Distinct patient-facing products:
- Hormone + Intimacy
- Kisspeptin-10 Reproductive Hormone Protocol
- Men's Hormones – Fertility (Clomiphene)
- Men's Hormones – Fertility (HCG)
- Men's Hormones – Gonadorelin
- Men's Hormones – PCT / Estrogen Blocker (Tamoxifen)
- Men's Hormones (TRT) – Estrogen Management (Anastrozole)
- Men's Hormones (TRT) – Fertility / HPTA Support (Enclomiphene)
- Mens HRT/TRT In-Clinic Approval
- Mens TRT/HRT 1 Month Plan
- Mens TRT/HRT 3 Month Plan
- Mens TRT/HRT 6 Month Plan
- Womens HRT GFE In-Clinic Approval
- Womens TRT/HRT 1 Month Plan
- Womens TRT/HRT 3 Month Plan
- Womens TRT/HRT 6 Month Plan

### Decision #5 — Minoxidil / Hair — Unspecified
Do **not** write umbrella. Distinct patient-facing products:
- Hair Loss – Dual Combo (Finasteride/Minoxidil)

### Decision #10 — Sildenafil — Unspecified
Do **not** write umbrella. Distinct patient-facing products:
- ED – Caffeine / Sildenafil (Performance Boost)
- ED – Sildenafil (On-Demand)
- ED – Sildenafil / Tadalafil Combo
- Sildenafil
- Tadalafil+Sildenafil

### Decision #11 — Tadalafil — Unspecified
Do **not** write umbrella. Distinct patient-facing products:
- ED – Tadalafil (Daily / Low Dose)
- ED – Tadalafil (On-Demand / High Dose)
- Tadalafil
- Vardenafil+Tadalafil+Apormorphine

### Decision #13 — Tretinoin / Skin — Unspecified
Do **not** write umbrella. Distinct patient-facing products:
- Finasteride, Tretinoin, Fluocinolone, VitaminE
- Hair Loss - Minoxdil/Tretinoin/Fluocinolone/Finasteride Spray
- Hair Loss – Triple Combo (Finasteride/Minoxidil/Tretinoin)

---

## Final counts

| Metric | Value |
|---|---|
| OWNER_DECISIONS_RESOLVED | 13 |
| OWNER_DECISIONS_REMAINING | 0 |
| CLEANUP_APPROVED | 4 |
| LIVE_NOW_RECOMMENDED | 14 |
| LIVE_NOW_PLUS_MID_B12_CREATE | 15 |
| READY_FOR_WRITE_TOTAL | 112 |
| READY_FOR_WRITE_LIVE | 15 |
| READY_FOR_WRITE_FUTURE_HIDDEN | 97 |
| DEFERRED | 8 |
| FUTURE_HIDDEN_CLIENT_PRODUCTS_IN_BLUEPRINT | 111 |
| SPLIT_UMBRELLAS | 6 |
| MERGE | 1 |
| DEACTIVATION | 3 |
| PRICE_FLAGS_IN_LIVE_14 | 8 |
| GEN_MODIFIED | NO |
| GEN_WRITES | 0 |
| GEN_WHOP_CUTOVER | OFF |
| PRODUCTION_WEBSITE_MODIFIED | NO |

**GEN MODIFIED:** NO  
**GEN WRITES:** 0  
**GEN/WHOP CUTOVER:** OFF  

**STOP FOR FINAL OWNER REVIEW (GEN-CATALOG-1H pricing).**  
Do **not** run GEN-CATALOG-2 until this gate is cleared.
