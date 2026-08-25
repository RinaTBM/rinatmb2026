# GEN Owner Approval Report (GEN-CATALOG-1D)

**Mode:** READ-ONLY — no GEN mutations
**Generated:** 2026-08-24T06:23:41Z
**Branch:** `cursor/gen-catalog-1-import-plan-945c`
**Source:** `docs/GEN_CLIENT_PRODUCT_BLUEPRINT.md`

---

## Final report

- **CURRENT PROPOSED CLIENT PRODUCTS:** 127
- **AFTER SANITY CHECK — RECOMMENDED:** 110
- **REDUNDANT / COLLAPSIBLE:** 4
- **OWNER DECISION REQUIRED:** 13

- **LIVE NOW — CURRENT 16 / RECOMMENDED 14** (collapse 1, owner 1)
- **FUTURE HIDDEN — CURRENT 111 / RECOMMENDED 96** (collapse 3, owner 12)

### Semaglutide
- Current client products: **36**
- Recommended: **34**
- Can collapse: **1**
- Owner decisions: **1**
- Buckets: `{'CORE_INJECTION': 10, 'ORAL_SUBLINGUAL': 7, 'L_CARNITINE': 4, 'OTHER': 12, 'STACK_COMBINATION': 3}`
- **B12 vs Glycine:** KEEP SEPARATE (see evidence below) — do not merge under one dose-tier product

### Tirzepatide
- Current client products: **14**
- Recommended: **10**
- Can collapse: **3**
- Owner decisions: **1**
- **Unresolved (do not silently choose):** `Tirzepatide/B12/Glycine` · `Tirzepatide/Glycine/B12`

### True formulary review: **7**

### Deactivate candidates (no write)
- Add Sync
- Metformin (Metabolic / Weight Support)
- Metformin / Topiramate

| Gate | Status |
|---|---|
| GEN CREATED | 0 |
| GEN UPDATED | 0 |
| GEN DEACTIVATED | 0 |
| GEN MODIFIED | NO |
| GEN/WHOP CUTOVER | OFF |
| PRODUCTION WEBSITE MODIFIED | NO |

---

## 1. LIVE_NOW client products (16)

| Display name | Category | Delivery | Retail price (GEN) | Existing productId | #Formulary | Pharmacies | Action | Website | Checkout | Confidence | Sanity |
|---|---|---|---:|---|---:|---|---|---|---|---|---|
| AOD-9604 / MOTS-C / Tesamorelin Injection | Recovery & Performance | Injection |  | `7Kix55LA15U0lNvY9QXI` | 3 | Optimal Balance Pharmacy | UPDATE | ON (intended) | ON (intended) | CONFIRMED | **KEEP_SEPARATE** |
| AOD-9604 Injection | Recovery & Performance | Injection | 179.0 | `PRIG7DYPNNgco3lGf1zx` | 2 | Optimal Balance Pharmacy | UPDATE | ON (intended) | ON (intended) | CONFIRMED | **KEEP_SEPARATE** |
| BPC-157 / TB-500 Capsules | Recovery & Performance | Capsule | 169.0 | `iJtyig611AZEDBGdvRd9` | 4 | Greenwich Pharmacy | KEEP | ON (intended) | ON (intended) | CONFIRMED | **KEEP_SEPARATE** |
| BPC-157 Injection | Recovery & Performance | Injection | 199.0 | `KXMm9SsbOEYnFy9phmZn` | 8 | Greenwich Pharmacy, Optimal Balance Pharmacy | UPDATE | ON (intended) | ON (intended) | CONFIRMED | **KEEP_SEPARATE** |
| BPC-157 — Unspecified | Recovery & Performance | Unspecified |  | `None` | 4 | Greenwich Pharmacy | CREATE | ON (intended) | ON (intended) | CONFIRMED | **KEEP_SEPARATE** |
| GHK-Cu / Minoxidil Topical Combo | Recovery & Performance | Topical | 149.0 | `489YrehNXRlL77fYPkOn` | 1 | Epiq Scripts | UPDATE | ON (intended) | ON (intended) | CONFIRMED | **KEEP_SEPARATE** |
| Semaglutide Injection — 3-Month (B12) | Weight Management | Injection | 799.0 | `sN2ggSXRJINjElMYTQjf` | 2 | Dirx-Hub | UPDATE | ON (intended) | ON (intended) | EXACT | **KEEP_SEPARATE** |
| Semaglutide Injection — 3-Month (Glycine) | Weight Management | Injection |  | `None` | 0 | — | OWNER_REVIEW | ON (intended) | ON (intended) | LOW | **CAN_COLLAPSE** |
| Semaglutide Injection — Any Dose (B12) | Weight Management | Injection | 189.0 | `MkDIUw0NcJB7YL2pNzYW` | 5 | Dirx-Hub | UPDATE | ON (intended) | ON (intended) | HIGH | **KEEP_SEPARATE** |
| Semaglutide Injection — Any Dose (Glycine) | Weight Management | Injection | 149.0 | `wQK2JsFnh7oFBf3Lag4n` | 5 | Dirx-Hub | UPDATE | ON (intended) | ON (intended) | HIGH | **KEEP_SEPARATE** |
| Semaglutide Injection — High (B12) | Weight Management | Injection | 199.0 | `34I2X8MpVZf3AQTff3bo` | 2 | Dirx-Hub | UPDATE | ON (intended) | ON (intended) | EXACT | **KEEP_SEPARATE** |
| Semaglutide Injection — High (Glycine) | Weight Management | Injection | 129.0 | `sssEk3FDY4LFbQYGQsLx` | 2 | Dirx-Hub | UPDATE | ON (intended) | ON (intended) | EXACT | **KEEP_SEPARATE** |
| Semaglutide Injection — Mid (B12) | Weight Management | Injection |  | `None` | 1 | Dirx-Hub | CREATE | ON (intended) | ON (intended) | EXACT | **OWNER_DECISION** |
| Semaglutide Injection — Mid (Glycine) | Weight Management | Injection | 109.0 | `CjqOUbPuGPZzxephqRou` | 1 | Dirx-Hub | UPDATE | ON (intended) | ON (intended) | EXACT | **KEEP_SEPARATE** |
| Semaglutide Injection — Starting / Low (B12) | Weight Management | Injection |  | `SkqQHmsc0WdsbK9vmV1y` | 3 | Dirx-Hub | UPDATE | ON (intended) | ON (intended) | EXACT | **KEEP_SEPARATE** |
| Semaglutide Injection — Starting / Low (Glycine) | Weight Management | Injection | 119.0 | `tk2GW39OGr7JX4MCCoJP` | 2 | Dirx-Hub | UPDATE | ON (intended) | ON (intended) | EXACT | **KEEP_SEPARATE** |

Retail price = GEN `pricing.amount` when non-zero; blank means unset/0 in GEN (not invented).

---

## 2. Sanity check — all 127 client products

| Verdict | Count |
|---|---:|
| KEEP_SEPARATE | 110 |
| CAN_COLLAPSE | 4 |
| OWNER_DECISION | 13 |

### CAN_COLLAPSE

- **Semaglutide Injection — 3-Month (Glycine)** (`sem-glycine-3month`) — Glycine 3-Month slot has zero masters and zero selected 3-vial packs; drop unless owner wants symmetry placeholder
- **Tirzepatide Injection — High (B12)** (`tir-b12-high`) — Dose-tier architecture slot with formulary vials attached; keep for clean ladder
- **Tirzepatide Injection — Mid (B12)** (`tir-b12-mid`) — Dose-tier architecture slot with formulary vials attached; keep for clean ladder
- **Tirzepatide Injection — Starting / Low (B12)** (`tir-b12-starting`) — Dose-tier architecture slot with formulary vials attached; keep for clean ladder

### OWNER_DECISION

- **5-Amino Injectable** (`review-5amino-form`) — Distinct delivery form (Capsule) — must remain separate client product
- **Accelerate & Thrive** (`other-other-unspecified`) — Over-collapsed catch-all (31 masters; signals=['combo', 'kisspeptin']) — should be split into separate patient-facing products before any GEN writes
- **HRT Other — Unspecified** (`hrt-hrtother-unspecified-`) — Over-collapsed catch-all (16 masters; signals=['anastrozole', 'clomiphene', 'combo', 'enclomiphene', 'gonadorelin', 'hcg', 'kisspeptin', 'tamoxifen']) — should be split into separate patient-facing products before any GEN writes
- **Minoxidil / Hair — Unspecified** (`minoxidil-unspecified`) — Over-collapsed catch-all (1 masters; signals=['combo', 'finasteride', 'minoxidil']) — should be split into separate patient-facing products before any GEN writes
- **NAD+ (Injectable)** (`review-nadinjectable`) — Distinct delivery form (Nasal Spray) — must remain separate client product
- **Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone** (`review-screamcreamsildenafilargininepapaverinet`) — Distinct delivery form (Cream) — must remain separate client product
- **Semaglutide Injection — Mid (B12)** (`sem-b12-mid`) — B12 Mid has selected formulary vial(s) but no LIVE website parent today — create hidden Mid B12 vs omit until needed
- **Sildenafil (3 Month)** (`review-sildenafil3month`) — Contains TRUE_FORMULARY_REVIEW master row(s)
- **Sildenafil (6 Month)** (`review-sildenafil6month`) — Contains TRUE_FORMULARY_REVIEW master row(s)
- **Sildenafil — Unspecified** (`sildenafil-unspecified`) — Over-collapsed catch-all (5 masters; signals=['combo', 'sildenafil', 'tadalafil']) — should be split into separate patient-facing products before any GEN writes
- **Tadalafil — Unspecified** (`tadalafil-unspecified`) — Over-collapsed catch-all (4 masters; signals=['combo', 'tadalafil', 'vardenafil']) — should be split into separate patient-facing products before any GEN writes
- **Tirzepatide Injection — B12+Glycine (ambiguous)** (`tir-b12-glycine-ambiguous`) — Tirzepatide/B12/Glycine naming conflict — do not silently choose; owner must pick B12 ladder, Glycine ladder, or reject both labels
- **Tretinoin / Skin — Unspecified** (`tretinoin-unspecified`) — Over-collapsed catch-all (3 masters; signals=['combo', 'finasteride', 'minoxidil', 'spray', 'tretinoin']) — should be split into separate patient-facing products before any GEN writes

Full per-product verdicts are in `docs/GEN_OWNER_APPROVAL_REPORT.json`.

---

## 3. Semaglutide sanity check

Why 36? Bucket counts: **{'CORE_INJECTION': 10, 'ORAL_SUBLINGUAL': 7, 'L_CARNITINE': 4, 'OTHER': 12, 'STACK_COMBINATION': 3}**

### B12 vs Glycine (critical)

**Recommendation: KEEP SEPARATE** — do not place both additives under one dose-tier client product.

- Live GEN already has separate client products per additive (e.g. Any Dose B12 productId MkDIUw0NcJB7YL2pNzYW vs Glycine wQK2JsFnh7oFBf3Lag4n).
- GEN pricing.amount differs by additive (examples: Any Dose B12≈189 vs Glycine≈149; High B12≈199 vs Glycine≈129).
- Selected formulary medications are distinct strings: SEMAGLUTIDE + VITAMIN B12 … vs SEMAGLUTIDE + GLYCINE … (Dirx-Hub).
- Website already sells separate purchasing options (membership Any Dose B12 vs Glycine).
- Collapsing would either misrepresent prescribed additive or force a hidden formulary choice without patient-facing clarity.

### Core injection ladder

| Product | Price | Formulation | #Rows | Launch | Needs own CP? |
|---|---:|---|---:|---|---|
| Semaglutide Injection — 3-Month (B12) | 799.0 | B12 | 2 | LIVE_NOW | **YES** |
| Semaglutide Injection — Any Dose (B12) | 189.0 | B12 | 5 | LIVE_NOW | **YES** |
| Semaglutide Injection — High (B12) | 199.0 | B12 | 2 | LIVE_NOW | **YES** |
| Semaglutide Injection — Mid (B12) |  | B12 | 1 | LIVE_NOW | **OWNER** |
| Semaglutide Injection — Starting / Low (B12) |  | B12 | 3 | LIVE_NOW | **YES** |
| Semaglutide Injection — 3-Month (Glycine) |  | Glycine | 0 | LIVE_NOW | **NO — collapse** |
| Semaglutide Injection — Any Dose (Glycine) | 149.0 | Glycine | 5 | LIVE_NOW | **YES** |
| Semaglutide Injection — High (Glycine) | 129.0 | Glycine | 2 | LIVE_NOW | **YES** |
| Semaglutide Injection — Mid (Glycine) | 109.0 | Glycine | 1 | LIVE_NOW | **YES** |
| Semaglutide Injection — Starting / Low (Glycine) | 119.0 | Glycine | 2 | LIVE_NOW | **YES** |

### Oral / sublingual (7)

- **Semaglutide Oral / Sublingual — Starting / Low** — rows=4, FUTURE_HIDDEN, **KEEP** — Distinct delivery form (Oral) — must remain separate client product
- **Semaglutide Oral / Sublingual — High** — rows=1, FUTURE_HIDDEN, **KEEP** — Distinct delivery form (Troche) — must remain separate client product
- **Semaglutide Oral / Sublingual — Mid** — rows=1, FUTURE_HIDDEN, **KEEP** — Distinct delivery form (Troche) — must remain separate client product
- **Orforglipron (Oral) — Any Dose** — rows=1, FUTURE_HIDDEN, **KEEP** — Distinct delivery form (Oral) — must remain separate client product
- **Orforglipron (Oral) — High** — rows=1, FUTURE_HIDDEN, **KEEP** — Distinct delivery form (Oral) — must remain separate client product
- **Orforglipron (Oral) — Mid** — rows=1, FUTURE_HIDDEN, **KEEP** — Distinct delivery form (Oral) — must remain separate client product
- **Orforglipron (Oral) — Starting / Low** — rows=1, FUTURE_HIDDEN, **KEEP** — Distinct delivery form (Oral) — must remain separate client product

### L-Carnitine (4)

- **Semaglutide Injection — Any Dose (L-Carnitine)** — rows=1, FUTURE_HIDDEN, **KEEP** — Different additive/support formulation — not interchangeable with B12/Glycine core ladder; keep separate
- **Semaglutide Injection — High (L-Carnitine)** — rows=1, FUTURE_HIDDEN, **KEEP** — Different additive/support formulation — not interchangeable with B12/Glycine core ladder; keep separate
- **Semaglutide Injection — Mid (L-Carnitine)** — rows=1, FUTURE_HIDDEN, **KEEP** — Different additive/support formulation — not interchangeable with B12/Glycine core ladder; keep separate
- **Semaglutide Injection — Starting / Low (L-Carnitine)** — rows=2, FUTURE_HIDDEN, **KEEP** — Different additive/support formulation — not interchangeable with B12/Glycine core ladder; keep separate

### Stack / combination (3)

- **Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **Ozempic (Semaglutide)** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **The Ultimate Semaglutide Stack** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint

### Other (12)

- **Semaglutide Weight Loss Plan – Semaglutide (Any Dose)** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **Semaglutide Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **Semaglutide Weight Loss Plan – Semaglutide (High Dose / Maintenance)** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **Semaglutide Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **Semaglutide Weight Loss Plan – Semaglutide (Low Dose)** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **Semaglutide Weight Loss Plan – Semaglutide (Mid Dose)** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **Semaglutide Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **Semaglutide Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **Semaglutide + Ondansetron (Nausea Support)** — rows=1, FUTURE_HIDDEN, **KEEP** — Different additive/support formulation — not interchangeable with B12/Glycine core ladder; keep separate
- **Semaglutide Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Low: 1→2→4mg)** — rows=2, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **Semaglutide/B12 (6 Months)** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint
- **Semaglutide/B12/Glycine** — rows=1, FUTURE_HIDDEN, **KEEP** — Clinically/product-distinct client product under current blueprint

---

## 4. Tirzepatide sanity check

Buckets: `{'CORE_INJECTION': 11, 'ONDANSETRON_SUPPORT': 1, 'L_CARNITINE': 1, 'NIACINAMIDE': 1}`

Core B12/Glycine ladders: **KEEP SEPARATE** (same evidence pattern as Semaglutide; currently FUTURE_HIDDEN).

### Unresolved owner conflict (do not silently choose)

| Master label | Issue |
|---|---|
| Tirzepatide/B12/Glycine | Name claims both additives; proposed/selected context is Glycine vial |
| Tirzepatide/Glycine/B12 | Same ambiguity (reversed label order) |

**Owner must choose:** B12 ladder only · Glycine ladder only · two products · or reject both labels.

| Product | Bucket | #Rows | Launch | Sanity |
|---|---|---:|---|---|
| Tirzepatide Injection — 3-Month (B12) | CORE_INJECTION | 0 | FUTURE_HIDDEN | **KEEP_SEPARATE** |
| Tirzepatide Injection — Any Dose (B12) | CORE_INJECTION | 6 | FUTURE_HIDDEN | **KEEP_SEPARATE** |
| Tirzepatide Injection — B12+Glycine (ambiguous) | CORE_INJECTION | 2 | FUTURE_HIDDEN | **OWNER_DECISION** |
| Tirzepatide Injection — High (B12) | CORE_INJECTION | 2 | FUTURE_HIDDEN | **CAN_COLLAPSE** |
| Tirzepatide Injection — Mid (B12) | CORE_INJECTION | 2 | FUTURE_HIDDEN | **CAN_COLLAPSE** |
| Tirzepatide Injection — Starting / Low (B12) | CORE_INJECTION | 2 | FUTURE_HIDDEN | **CAN_COLLAPSE** |
| Tirzepatide Injection — 3-Month (Glycine) | CORE_INJECTION | 6 | FUTURE_HIDDEN | **KEEP_SEPARATE** |
| Tirzepatide Injection — Any Dose (Glycine) | CORE_INJECTION | 10 | FUTURE_HIDDEN | **KEEP_SEPARATE** |
| Tirzepatide Injection — High (Glycine) | CORE_INJECTION | 4 | FUTURE_HIDDEN | **KEEP_SEPARATE** |
| Tirzepatide Injection — Mid (Glycine) | CORE_INJECTION | 3 | FUTURE_HIDDEN | **KEEP_SEPARATE** |
| Tirzepatide Injection — Starting / Low (Glycine) | CORE_INJECTION | 11 | FUTURE_HIDDEN | **KEEP_SEPARATE** |
| Tirzepatide Injection — Starting / Low (L-Carnitine) | L_CARNITINE | 1 | FUTURE_HIDDEN | **KEEP_SEPARATE** |
| Tirzepatide Injection — Starting / Low (Niacinamide) | NIACINAMIDE | 1 | FUTURE_HIDDEN | **KEEP_SEPARATE** |
| Tirzepatide + Ondansetron (Nausea Support) | ONDANSETRON_SUPPORT | 3 | FUTURE_HIDDEN | **KEEP_SEPARATE** |

---

## 5. FUTURE_HIDDEN by family

All future products remain `showPatient=false`, website OFF, checkout OFF.

| Product family | # Client products | # Formulary rows | KEEP | COLLAPSE | OWNER |
|---|---:|---:|---:|---:|---:|
| Weight Management | 42 | 86 | 38 | 3 | 1 |
| Women's Hormone Therapy | 9 | 50 | 8 | 0 | 1 |
| Longevity & Cognitive Health | 11 | 22 | 10 | 0 | 1 |
| Recovery & Performance | 20 | 39 | 19 | 0 | 1 |
| Prescription Skin & Hair | 7 | 15 | 5 | 0 | 2 |
| Research Wellness | 1 | 6 | 1 | 0 | 0 |
| Sexual Wellness | 10 | 17 | 5 | 0 | 5 |
| Other | 11 | 45 | 10 | 0 | 1 |

### Weight Management — proposed names

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
- Tirzepatide Injection — B12+Glycine (ambiguous)
- Tirzepatide Injection — High (B12)
- Tirzepatide Injection — High (Glycine)
- Tirzepatide Injection — Mid (B12)
- Tirzepatide Injection — Mid (Glycine)
- Tirzepatide Injection — Starting / Low (B12)
- Tirzepatide Injection — Starting / Low (Glycine)
- Tirzepatide Injection — Starting / Low (L-Carnitine)
- Tirzepatide Injection — Starting / Low (Niacinamide)

### Women's Hormone Therapy — proposed names

- Estradiol / HRT — Vaginal Cream
- HRT Other — Capsule
- HRT Other — Unspecified
- Progesterone / HRT — Cream
- Progesterone / HRT — Unspecified
- Testosterone / HRT — Cream
- Testosterone / HRT — Injection
- Testosterone / HRT — Troche
- Testosterone / HRT — Unspecified

### Longevity & Cognitive Health — proposed names

- Dihexa — Unspecified
- Epithalon Injection
- NAD+ (Injectable)
- NAD+ Injection
- NAD+ Nasal Spray
- NAD+ — Topical
- NAD+ — Topical
- Pinealon — Unspecified
- Selank — Unspecified
- Selank — Unspecified
- Semax — Unspecified

### Recovery & Performance — proposed names

- 5-Amino Injectable
- 5-Amino-1MQ Injection
- BPC-157 — Unspecified
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
- IGF-1 LR3 — Unspecified
- LL-37 Injection
- MOTS-C Injection
- TB-500 / Blends — Unspecified
- TB-500 / Blends — Unspecified
- Tesamorelin / Ipamorelin Injection
- Thymosin Alpha-1 Injection

### Prescription Skin & Hair — proposed names

- Finasteride / Hair — Capsule
- Finasteride / Hair — Topical
- Finasteride / Hair — Unspecified
- Minoxidil / Hair — Capsule
- Minoxidil / Hair — Topical
- Minoxidil / Hair — Unspecified
- Tretinoin / Skin — Unspecified

### Research Wellness — proposed names

- PT-141 (Bremelanotide) Nasal Spray

### Sexual Wellness — proposed names

- Oxytocin — Capsule
- Oxytocin — Nasal Spray
- Oxytocin — Unspecified
- Scream Cream
- Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone
- Sildenafil (3 Month)
- Sildenafil (6 Month)
- Sildenafil — Unspecified
- Tadalafil — Unspecified
- Vardenafil — Unspecified

### Other — proposed names

- Accelerate & Thrive
- Hair Loss – Dutasteride (Oral)
- Ivermectin — Capsule
- Ivermectin — Capsule
- Ivermectin — Topical
- Pregnyl - HCG (Merck)
- SS-31 (Elamipretide) Mitochondrial Protection Protocol
- Sermorelin — Injection
- Sermorelin — Troche
- Sermorelin — Troche
- Trimix T106 (Papaverine +Phentolamine +PGE)

---

## 6. TRUE_FORMULARY_REVIEW (7)

### 5-Amino Injectable
- **Candidate #1:** 5-Amino capsules 50mg
  - Pharmacy: Greenwich Pharmacy
  - Strength: 50mg
  - Form: 
  - Package: 1EA
  - Cost / ship / landed: 2.6 / 25 / 27.6
- **Candidate #2:** —
- **Why ambiguous:** Injectable product name paired to capsule formulary — form mismatch
- **Recommended action:** Do not pair injectable 5-Amino to capsule row; locate injectable 5-Amino-1MQ formulary or leave unpaired

### NAD+ (Injectable)
- **Candidate #1:** NAD+ 50mg/ml
  - Pharmacy: St Luke
  - Strength: 50mg/ml
  - Form: Nasal Spray
  - Package: 15ml
  - Cost / ship / landed: 30 / 30 / 60
- **Candidate #2:** NAD+ 200mg/ml
  - Pharmacy: St Luke
  - Strength/Form/Package: 200mg/ml / Nasal Spray / 15ml
  - Landed: 75
- **Why ambiguous:** Injectable NAD+ master row carries Nasal Spray form/proposed pairing
- **Recommended action:** Split: use NAD+ Injection client product with injectable formulary; do not use nasal spray pairing

### Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone
- **Candidate #1:** Sildenafil/Testosterone 120mg/22mg
  - Pharmacy: St Luke
  - Strength: 120mg/22mg
  - Form: Troche
  - Package: Each
  - Cost / ship / landed: 2.75 / 30 / 32.75
- **Candidate #2:** —
- **Why ambiguous:** Sildenafil-named product proposed to Scream Cream formulary — do not silently substitute; Scream Cream exact composition/pharmacy confirmation still required vs alternate cream formulas
- **Recommended action:** Reject Scream Cream pairing for Sildenafil-named products; pair only to confirmed Sildenafil tablet formulary or rename product to Scream Cream intentionally

### Sildenafil (3 Month)
- **Candidate #1:** Sildenafil/Testosterone 120mg/22mg
  - Pharmacy: St Luke
  - Strength: 120mg/22mg
  - Form: Troche
  - Package: Each
  - Cost / ship / landed: 2.75 / 30 / 32.75
- **Candidate #2:** —
- **Why ambiguous:** Sildenafil-named product proposed to Scream Cream formulary — do not silently substitute
- **Recommended action:** Reject Scream Cream pairing for Sildenafil-named products; pair only to confirmed Sildenafil tablet formulary or rename product to Scream Cream intentionally

### Sildenafil (6 Month)
- **Candidate #1:** Sildenafil/Testosterone 120mg/22mg
  - Pharmacy: St Luke
  - Strength: 120mg/22mg
  - Form: Troche
  - Package: Each
  - Cost / ship / landed: 2.75 / 30 / 32.75
- **Candidate #2:** —
- **Why ambiguous:** Sildenafil-named product proposed to Scream Cream formulary — do not silently substitute
- **Recommended action:** Reject Scream Cream pairing for Sildenafil-named products; pair only to confirmed Sildenafil tablet formulary or rename product to Scream Cream intentionally

### Tirzepatide/B12/Glycine
- **Candidate #1:** TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL)
  - Pharmacy: Dirx-Hub
  - Strength: 5mg/0.5mg/mL
  - Form: Vial
  - Package: 2mL
  - Cost / ship / landed: 65 / 5 / 70
- **Candidate #2:** TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL)
  - Pharmacy: Dirx-Hub
  - Strength/Form/Package: 5mg/0.5mg/mL / Vial / 2mL
  - Landed: 70
- **Why ambiguous:** Label claims both B12 and Glycine; proposed row is Glycine-only vial — ambiguous which ladder
- **Recommended action:** _Insufficient evidence — owner decision required_

### Tirzepatide/Glycine/B12
- **Candidate #1:** TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL)
  - Pharmacy: Dirx-Hub
  - Strength: 5mg/0.5mg/mL
  - Form: Vial
  - Package: 2mL
  - Cost / ship / landed: 65 / 5 / 70
- **Candidate #2:** TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL)
  - Pharmacy: Dirx-Hub
  - Strength/Form/Package: 5mg/0.5mg/mL / Vial / 2mL
  - Landed: 70
- **Why ambiguous:** Label claims both B12 and Glycine; proposed row is Glycine-only vial — ambiguous which ladder
- **Recommended action:** _Insufficient evidence — owner decision required_

---

## 7. Deactivation candidates

| Product | Action | Write now |
|---|---|---|
| Metformin (Metabolic / Weight Support) | DEACTIVATE_CANDIDATE | NO |
| Metformin / Topiramate | DEACTIVATE_CANDIDATE | NO |
| Add Sync | DEACTIVATE_CANDIDATE | NO |

### BPC-157 (Copy 1)

- Treat as **MERGE** into primary **BPC-157 Injection**
- Primary GEN productId: `KXMm9SsbOEYnFy9phmZn`
- After merge confirmation, copy becomes deactivate-candidate — **no write this phase**

---

**STOP FOR OWNER APPROVAL.**
