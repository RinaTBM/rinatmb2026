# GEN Client Product Blueprint (GEN-CATALOG-1C)

**Mode:** READ-ONLY — no POST / PATCH / DELETE
**Generated:** 2026-08-24T06:11:53Z
**Branch:** `cursor/gen-catalog-1-import-plan-945c`
**Principle:** Master formulary rows collapse under patient-facing client products; exact pharmacy/strength/package rows attach as formulary pairings.

Machine-readable: `docs/GEN_CLIENT_PRODUCT_BLUEPRINT.json`

---

## Final summary

- **MASTER ROWS:** 253
- **PROPOSED CLIENT PRODUCTS:** 127
- **LIVE NOW CLIENT PRODUCTS:** 16
- **FUTURE HIDDEN CLIENT PRODUCTS:** 111
- **ROWS ASSIGNED (LIVE):** 18
- **FUTURE ROWS ASSIGNED:** 226
- **EXCLUDED:** 2
- **DO NOT ADD:** 0
- **TRUE FORMULARY REVIEW:** 7

### Semaglutide
- Proposed client products: **36** (dose tier × B12/Glycine)
- Formulary rows covered (selected vials attached): **54**
- Unresolved master rows: **0**

### Tirzepatide
- Proposed client products: **14** (dose tier × B12/Glycine; FUTURE_HIDDEN until launch)
- Formulary rows covered: **53**
- Unresolved master rows: **2**

### Other families — READY: 34 · OWNER REVIEW: 3

- Existing GEN products reused: **75**
- Existing GEN products to update/pair: **67**
- New GEN products eventually required: **50**
- Merge candidates: **1**
- Deactivate candidates (inventory): **3** — Metformin ×2, Add Sync

**Metformin: DO NOT ADD** · DEACTIVATE_CANDIDATE only — no write

| Write gate | Status |
|---|---|
| GEN CREATED | 0 |
| GEN UPDATED | 0 |
| GEN DEACTIVATED | 0 |
| GEN MODIFIED | NO |
| GEN/WHOP CUTOVER | OFF |
| PRODUCTION WEBSITE MODIFIED | NO |

---

## Owner decision queue (product-level)

### Semaglutide
- Proposed client products: **36**
- Master rows covered: **44**
- Formulary pairings attached: **54**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 10 / 26
- **Decision needed:** Approve 36 client product(s) for Semaglutide; confirm formulary attachments; no true formulary blockers.

Client products:
- Semaglutide Injection — Starting / Low (Glycine)
- Semaglutide Injection — Mid (Glycine)
- Semaglutide Injection — High (Glycine)
- Semaglutide Injection — Any Dose (Glycine)
- Semaglutide Injection — 3-Month (Glycine)
- Semaglutide Injection — Starting / Low (B12)
- Semaglutide Injection — Mid (B12)
- Semaglutide Injection — High (B12)
- Semaglutide Injection — Any Dose (B12)
- Semaglutide Injection — 3-Month (B12)
- Semaglutide Oral / Sublingual — Starting / Low
- Semaglutide Injection — Any Dose (L-Carnitine)
- Semaglutide Weight Loss Plan – Semaglutide (Any Dose)
- Semaglutide Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply
- Semaglutide Weight Loss Plan – Semaglutide (High Dose / Maintenance)
- Semaglutide Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply
- Semaglutide Weight Loss Plan – Semaglutide (Low Dose)
- Semaglutide Weight Loss Plan – Semaglutide (Mid Dose)
- Semaglutide Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply
- Semaglutide Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply
- Semaglutide Injection — High (L-Carnitine)
- Semaglutide Injection — Mid (L-Carnitine)
- Semaglutide Injection — Starting / Low (L-Carnitine)
- Semaglutide + Ondansetron (Nausea Support)
- Semaglutide Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Low: 1→2→4mg)
- Semaglutide Oral / Sublingual — High
- Semaglutide Oral / Sublingual — Mid
- Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan
- Orforglipron (Oral) — Any Dose
- Orforglipron (Oral) — High
- Orforglipron (Oral) — Mid
- Orforglipron (Oral) — Starting / Low
- Ozempic (Semaglutide)
- Semaglutide/B12 (6 Months)
- Semaglutide/B12/Glycine
- The Ultimate Semaglutide Stack

### Tirzepatide
- Proposed client products: **14**
- Master rows covered: **28**
- Formulary pairings attached: **53**
- Unresolved rows: **2**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 14
- **Decision needed:** Approve 14 client product(s) for Tirzepatide; confirm formulary attachments; resolve 2 TRUE_FORMULARY_REVIEW row(s).

Client products:
- Tirzepatide Injection — Starting / Low (Glycine)
- Tirzepatide Injection — Mid (Glycine)
- Tirzepatide Injection — High (Glycine)
- Tirzepatide Injection — Any Dose (Glycine)
- Tirzepatide Injection — 3-Month (Glycine)
- Tirzepatide Injection — Starting / Low (B12)
- Tirzepatide Injection — Mid (B12)
- Tirzepatide Injection — High (B12)
- Tirzepatide Injection — Any Dose (B12)
- Tirzepatide Injection — 3-Month (B12)
- Tirzepatide + Ondansetron (Nausea Support)
- Tirzepatide Injection — B12+Glycine (ambiguous)
- Tirzepatide Injection — Starting / Low (L-Carnitine)
- Tirzepatide Injection — Starting / Low (Niacinamide)

Unresolved examples:
- Tirzepatide/B12/Glycine
- Tirzepatide/Glycine/B12

### BPC-157
- Proposed client products: **5**
- Master rows covered: **17**
- Formulary pairings attached: **20**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 3 / 2
- **Decision needed:** Approve 5 client product(s) for BPC-157; confirm formulary attachments; no true formulary blockers.

Client products:
- BPC-157 Injection
- BPC-157 — Unspecified
- BPC-157 — Unspecified
- BPC-157 / TB-500 Capsules
- BPC-157 — Unspecified

### NAD+
- Proposed client products: **5**
- Master rows covered: **9**
- Formulary pairings attached: **10**
- Unresolved rows: **1**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 5
- **Decision needed:** Approve 5 client product(s) for NAD+; confirm formulary attachments; resolve 1 TRUE_FORMULARY_REVIEW row(s).

Client products:
- NAD+ Nasal Spray
- NAD+ (Injectable)
- NAD+ Injection
- NAD+ — Topical
- NAD+ — Topical

Unresolved examples:
- NAD+ (Injectable)

### Other
- Proposed client products: **5**
- Master rows covered: **35**
- Formulary pairings attached: **35**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 5
- **Decision needed:** Approve 5 client product(s) for Other; confirm formulary attachments; no true formulary blockers.

Client products:
- Accelerate & Thrive
- Hair Loss – Dutasteride (Oral)
- Pregnyl - HCG (Merck)
- SS-31 (Elamipretide) Mitochondrial Protection Protocol
- Trimix T106 (Papaverine +Phentolamine +PGE)

### GHK-Cu
- Proposed client products: **4**
- Master rows covered: **5**
- Formulary pairings attached: **5**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 1 / 3
- **Decision needed:** Approve 4 client product(s) for GHK-Cu; confirm formulary attachments; no true formulary blockers.

Client products:
- GHK-Cu / Minoxidil Topical Combo
- GHK-Cu / Epithalon Injection
- GHK-Cu Injection
- GHK-Cu — Unspecified

### Scream Cream
- Proposed client products: **4**
- Master rows covered: **4**
- Formulary pairings attached: **4**
- Unresolved rows: **3**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 4
- **Decision needed:** Approve 4 client product(s) for Scream Cream; confirm formulary attachments; resolve 3 TRUE_FORMULARY_REVIEW row(s).

Client products:
- Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone
- Sildenafil (3 Month)
- Sildenafil (6 Month)
- Scream Cream

Unresolved examples:
- Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone
- Sildenafil (3 Month)
- Sildenafil (6 Month)

### Testosterone / HRT
- Proposed client products: **4**
- Master rows covered: **7**
- Formulary pairings attached: **12**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 4
- **Decision needed:** Approve 4 client product(s) for Testosterone / HRT; confirm formulary attachments; no true formulary blockers.

Client products:
- Testosterone / HRT — Unspecified
- Testosterone / HRT — Cream
- Testosterone / HRT — Injection
- Testosterone / HRT — Troche

### Finasteride / Hair
- Proposed client products: **3**
- Master rows covered: **3**
- Formulary pairings attached: **3**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 3
- **Decision needed:** Approve 3 client product(s) for Finasteride / Hair; confirm formulary attachments; no true formulary blockers.

Client products:
- Finasteride / Hair — Unspecified
- Finasteride / Hair — Capsule
- Finasteride / Hair — Topical

### Glutathione
- Proposed client products: **3**
- Master rows covered: **3**
- Formulary pairings attached: **4**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 3
- **Decision needed:** Approve 3 client product(s) for Glutathione; confirm formulary attachments; no true formulary blockers.

Client products:
- Glutathione — Injection
- Glutathione — Capsule
- Glutathione — Topical

### Ivermectin
- Proposed client products: **3**
- Master rows covered: **5**
- Formulary pairings attached: **5**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 3
- **Decision needed:** Approve 3 client product(s) for Ivermectin; confirm formulary attachments; no true formulary blockers.

Client products:
- Ivermectin — Capsule
- Ivermectin — Topical
- Ivermectin — Capsule

### Minoxidil / Hair
- Proposed client products: **3**
- Master rows covered: **3**
- Formulary pairings attached: **4**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 3
- **Decision needed:** Approve 3 client product(s) for Minoxidil / Hair; confirm formulary attachments; no true formulary blockers.

Client products:
- Minoxidil / Hair — Unspecified
- Minoxidil / Hair — Capsule
- Minoxidil / Hair — Topical

### Oxytocin
- Proposed client products: **3**
- Master rows covered: **3**
- Formulary pairings attached: **3**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 3
- **Decision needed:** Approve 3 client product(s) for Oxytocin; confirm formulary attachments; no true formulary blockers.

Client products:
- Oxytocin — Capsule
- Oxytocin — Unspecified
- Oxytocin — Nasal Spray

### Sermorelin
- Proposed client products: **3**
- Master rows covered: **5**
- Formulary pairings attached: **5**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 3
- **Decision needed:** Approve 3 client product(s) for Sermorelin; confirm formulary attachments; no true formulary blockers.

Client products:
- Sermorelin — Injection
- Sermorelin — Troche
- Sermorelin — Troche

### 5-Amino-1MQ
- Proposed client products: **2**
- Master rows covered: **3**
- Formulary pairings attached: **3**
- Unresolved rows: **1**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 2
- **Decision needed:** Approve 2 client product(s) for 5-Amino-1MQ; confirm formulary attachments; resolve 1 TRUE_FORMULARY_REVIEW row(s).

Client products:
- 5-Amino Injectable
- 5-Amino-1MQ Injection

Unresolved examples:
- 5-Amino Injectable

### AOD-9604
- Proposed client products: **2**
- Master rows covered: **5**
- Formulary pairings attached: **5**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 2 / 0
- **Decision needed:** Approve 2 client product(s) for AOD-9604; confirm formulary attachments; no true formulary blockers.

Client products:
- AOD-9604 Injection
- AOD-9604 / MOTS-C / Tesamorelin Injection

### HRT Other
- Proposed client products: **2**
- Master rows covered: **17**
- Formulary pairings attached: **17**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 2
- **Decision needed:** Approve 2 client product(s) for HRT Other; confirm formulary attachments; no true formulary blockers.

Client products:
- HRT Other — Unspecified
- HRT Other — Capsule

### IGF-1 LR3
- Proposed client products: **2**
- Master rows covered: **2**
- Formulary pairings attached: **2**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 2
- **Decision needed:** Approve 2 client product(s) for IGF-1 LR3; confirm formulary attachments; no true formulary blockers.

Client products:
- IGF-1 LR3 — Unspecified
- IGF-1 LR3 — Unspecified

### Progesterone / HRT
- Proposed client products: **2**
- Master rows covered: **4**
- Formulary pairings attached: **4**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 2
- **Decision needed:** Approve 2 client product(s) for Progesterone / HRT; confirm formulary attachments; no true formulary blockers.

Client products:
- Progesterone / HRT — Cream
- Progesterone / HRT — Unspecified

### Selank
- Proposed client products: **2**
- Master rows covered: **3**
- Formulary pairings attached: **3**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 2
- **Decision needed:** Approve 2 client product(s) for Selank; confirm formulary attachments; no true formulary blockers.

Client products:
- Selank — Unspecified
- Selank — Unspecified

### TB-500 / Blends
- Proposed client products: **2**
- Master rows covered: **2**
- Formulary pairings attached: **2**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 2
- **Decision needed:** Approve 2 client product(s) for TB-500 / Blends; confirm formulary attachments; no true formulary blockers.

Client products:
- TB-500 / Blends — Unspecified
- TB-500 / Blends — Unspecified

### CJC / Ipamorelin
- Proposed client products: **1**
- Master rows covered: **1**
- Formulary pairings attached: **1**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for CJC / Ipamorelin; confirm formulary attachments; no true formulary blockers.

Client products:
- CJC-1295 / Ipamorelin Injection

### DSIP
- Proposed client products: **1**
- Master rows covered: **2**
- Formulary pairings attached: **2**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for DSIP; confirm formulary attachments; no true formulary blockers.

Client products:
- DSIP Injection

### Dihexa
- Proposed client products: **1**
- Master rows covered: **1**
- Formulary pairings attached: **3**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Dihexa; confirm formulary attachments; no true formulary blockers.

Client products:
- Dihexa — Unspecified

### Epithalon
- Proposed client products: **1**
- Master rows covered: **2**
- Formulary pairings attached: **2**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Epithalon; confirm formulary attachments; no true formulary blockers.

Client products:
- Epithalon Injection

### Estradiol / HRT
- Proposed client products: **1**
- Master rows covered: **2**
- Formulary pairings attached: **17**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Estradiol / HRT; confirm formulary attachments; no true formulary blockers.

Client products:
- Estradiol / HRT — Vaginal Cream

### LL-37
- Proposed client products: **1**
- Master rows covered: **2**
- Formulary pairings attached: **2**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for LL-37; confirm formulary attachments; no true formulary blockers.

Client products:
- LL-37 Injection

### Liraglutide
- Proposed client products: **1**
- Master rows covered: **1**
- Formulary pairings attached: **1**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Liraglutide; confirm formulary attachments; no true formulary blockers.

Client products:
- Liraglutide — Unspecified

### MOTS-C
- Proposed client products: **1**
- Master rows covered: **2**
- Formulary pairings attached: **4**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for MOTS-C; confirm formulary attachments; no true formulary blockers.

Client products:
- MOTS-C Injection

### PT-141
- Proposed client products: **1**
- Master rows covered: **4**
- Formulary pairings attached: **6**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for PT-141; confirm formulary attachments; no true formulary blockers.

Client products:
- PT-141 (Bremelanotide) Nasal Spray

### Pinealon
- Proposed client products: **1**
- Master rows covered: **1**
- Formulary pairings attached: **1**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Pinealon; confirm formulary attachments; no true formulary blockers.

Client products:
- Pinealon — Unspecified

### Retatrutide
- Proposed client products: **1**
- Master rows covered: **1**
- Formulary pairings attached: **1**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Retatrutide; confirm formulary attachments; no true formulary blockers.

Client products:
- Retatrutide — Unspecified

### Semax
- Proposed client products: **1**
- Master rows covered: **2**
- Formulary pairings attached: **3**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Semax; confirm formulary attachments; no true formulary blockers.

Client products:
- Semax — Unspecified

### Sildenafil
- Proposed client products: **1**
- Master rows covered: **5**
- Formulary pairings attached: **5**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Sildenafil; confirm formulary attachments; no true formulary blockers.

Client products:
- Sildenafil — Unspecified

### Tadalafil
- Proposed client products: **1**
- Master rows covered: **4**
- Formulary pairings attached: **4**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Tadalafil; confirm formulary attachments; no true formulary blockers.

Client products:
- Tadalafil — Unspecified

### Tesamorelin / Ipamorelin
- Proposed client products: **1**
- Master rows covered: **9**
- Formulary pairings attached: **9**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Tesamorelin / Ipamorelin; confirm formulary attachments; no true formulary blockers.

Client products:
- Tesamorelin / Ipamorelin Injection

### Thymosin Alpha-1
- Proposed client products: **1**
- Master rows covered: **2**
- Formulary pairings attached: **2**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Thymosin Alpha-1; confirm formulary attachments; no true formulary blockers.

Client products:
- Thymosin Alpha-1 Injection

### Tretinoin / Skin
- Proposed client products: **1**
- Master rows covered: **3**
- Formulary pairings attached: **8**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Tretinoin / Skin; confirm formulary attachments; no true formulary blockers.

Client products:
- Tretinoin / Skin — Unspecified

### Vardenafil
- Proposed client products: **1**
- Master rows covered: **1**
- Formulary pairings attached: **1**
- Unresolved rows: **0**
- LIVE_NOW / FUTURE_HIDDEN: 0 / 1
- **Decision needed:** Approve 1 client product(s) for Vardenafil; confirm formulary attachments; no true formulary blockers.

Client products:
- Vardenafil — Unspecified

---

## Client product blueprint (compact)

| Client product | Family | Delivery | Launch | Existing GEN productId | Action | #Masters | #Pairings |
|---|---|---|---|---|---|---:|---:|
| 5-Amino Injectable | 5-Amino-1MQ | Capsule | FUTURE_HIDDEN | `hiqg8F331ERDpZUPRvwH` | OWNER_REVIEW | 1 | 1 |
| 5-Amino-1MQ Injection | 5-Amino-1MQ | Injection | FUTURE_HIDDEN | `yurRynEyiBZvUtEM9OKy` | PAIR | 2 | 2 |
| AOD-9604 / MOTS-C / Tesamorelin Injection | AOD-9604 | Injection | LIVE_NOW | `7Kix55LA15U0lNvY9QXI` | UPDATE | 3 | 3 |
| AOD-9604 Injection | AOD-9604 | Injection | LIVE_NOW | `PRIG7DYPNNgco3lGf1zx` | UPDATE | 2 | 2 |
| BPC-157 / TB-500 Capsules | BPC-157 | Capsule | LIVE_NOW | `iJtyig611AZEDBGdvRd9` | KEEP | 4 | 4 |
| BPC-157 Injection | BPC-157 | Injection | LIVE_NOW | `KXMm9SsbOEYnFy9phmZn` | MERGE | 4 | 8 |
| BPC-157 — Unspecified | BPC-157 | Unspecified | LIVE_NOW | `None` | CREATE_NEW | 4 | 4 |
| BPC-157 — Unspecified | BPC-157 | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| BPC-157 — Unspecified | BPC-157 | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 3 | 3 |
| CJC-1295 / Ipamorelin Injection | CJC / Ipamorelin | Injection | FUTURE_HIDDEN | `hBU7BtIyLLIKPGdOKLsu` | PAIR | 1 | 1 |
| DSIP Injection | DSIP | Injection | FUTURE_HIDDEN | `vqAq9bWAfFatzbOKQekn` | PAIR | 2 | 2 |
| Dihexa — Unspecified | Dihexa | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 3 |
| Epithalon Injection | Epithalon | Injection | FUTURE_HIDDEN | `gpwERWfomPpuJyY9oB8V` | PAIR | 2 | 2 |
| Estradiol / HRT — Vaginal Cream | Estradiol / HRT | Vaginal Cream | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 17 |
| Finasteride / Hair — Capsule | Finasteride / Hair | Capsule | FUTURE_HIDDEN | `jn0oZRngtKkKh64DRjTz` | PAIR | 1 | 1 |
| Finasteride / Hair — Topical | Finasteride / Hair | Topical | FUTURE_HIDDEN | `YoKTsMK3BMElUT3PPohU` | PAIR | 1 | 1 |
| Finasteride / Hair — Unspecified | Finasteride / Hair | Unspecified | FUTURE_HIDDEN | `LA7Q6gQEPmnpkduoVnqa` | PAIR | 1 | 1 |
| GHK-Cu / Epithalon Injection | GHK-Cu | Injection | FUTURE_HIDDEN | `Yq6xdybfGS55O4kUDVI8` | PAIR | 2 | 2 |
| GHK-Cu / Minoxidil Topical Combo | GHK-Cu | Topical | LIVE_NOW | `489YrehNXRlL77fYPkOn` | UPDATE | 1 | 1 |
| GHK-Cu Injection | GHK-Cu | Injection | FUTURE_HIDDEN | `489YrehNXRlL77fYPkOn` | KEEP | 1 | 1 |
| GHK-Cu — Unspecified | GHK-Cu | Unspecified | FUTURE_HIDDEN | `DTrcxHRUH1xB7ssj0K2P` | PAIR | 1 | 1 |
| Glutathione — Capsule | Glutathione | Capsule | FUTURE_HIDDEN | `3iYfB81PjUQJtNDIhLER` | PAIR | 1 | 1 |
| Glutathione — Injection | Glutathione | Injection | FUTURE_HIDDEN | `17H4pVR8uYnwvcBIz8iY` | PAIR | 1 | 2 |
| Glutathione — Topical | Glutathione | Topical | FUTURE_HIDDEN | `qz31EybbwRa6mME5Oe2v` | PAIR | 1 | 1 |
| HRT Other — Capsule | HRT Other | Capsule | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| HRT Other — Unspecified | HRT Other | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 16 | 16 |
| IGF-1 LR3 — Unspecified | IGF-1 LR3 | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| IGF-1 LR3 — Unspecified | IGF-1 LR3 | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Ivermectin — Capsule | Ivermectin | Capsule | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 2 |
| Ivermectin — Capsule | Ivermectin | Capsule | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Ivermectin — Topical | Ivermectin | Topical | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 2 |
| LL-37 Injection | LL-37 | Injection | FUTURE_HIDDEN | `mUbF6TIhmYT47WcbzASR` | PAIR | 2 | 2 |
| Liraglutide — Unspecified | Liraglutide | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| MOTS-C Injection | MOTS-C | Injection | FUTURE_HIDDEN | `So0N5GOR2qqLUp0hBdYc` | PAIR | 2 | 4 |
| Minoxidil / Hair — Capsule | Minoxidil / Hair | Capsule | FUTURE_HIDDEN | `M5oNllXUu1ikySSuXIR0` | PAIR | 1 | 1 |
| Minoxidil / Hair — Topical | Minoxidil / Hair | Topical | FUTURE_HIDDEN | `Raw7mUkuzzhVdAo88jpL` | PAIR | 1 | 2 |
| Minoxidil / Hair — Unspecified | Minoxidil / Hair | Unspecified | FUTURE_HIDDEN | `BboYS4a2Uj7APetrFo6W` | PAIR | 1 | 1 |
| NAD+ (Injectable) | NAD+ | Nasal Spray | FUTURE_HIDDEN | `SHJpGAACUFEeMONdpEbn` | OWNER_REVIEW | 1 | 1 |
| NAD+ Injection | NAD+ | Injection | FUTURE_HIDDEN | `X5KidsHhzKWDKPjo2W9h` | PAIR | 3 | 4 |
| NAD+ Nasal Spray | NAD+ | Nasal Spray | FUTURE_HIDDEN | `FVwkzvQqWIZRNAwbslGw` | PAIR | 3 | 3 |
| NAD+ — Topical | NAD+ | Topical | FUTURE_HIDDEN | `WcuHmnM1fVgeRx7JiJf2` | PAIR | 1 | 1 |
| NAD+ — Topical | NAD+ | Topical | FUTURE_HIDDEN | `7eeg2B8fT6y5ncSRoxOr` | PAIR | 1 | 1 |
| Accelerate & Thrive | Other | Unspecified | FUTURE_HIDDEN | `8u8eyuwwVUcf0DzsmZJb` | PAIR | 31 | 31 |
| Hair Loss – Dutasteride (Oral) | Other | Capsule | FUTURE_HIDDEN | `ikFje18cBOEGuJkV8mfb` | PAIR | 1 | 1 |
| Pregnyl - HCG (Merck) | Other | Unspecified | FUTURE_HIDDEN | `1RKh7XAuwA2DM4fZ6exN` | PAIR | 1 | 1 |
| SS-31 (Elamipretide) Mitochondrial Protection Protocol | Other | Unspecified | FUTURE_HIDDEN | `YWzXqs8KGRlhRHx6jHKc` | PAIR | 1 | 1 |
| Trimix T106 (Papaverine +Phentolamine +PGE) | Other | Unspecified | FUTURE_HIDDEN | `nKniwgJIqwyBvDQgxLpW` | PAIR | 1 | 1 |
| Oxytocin — Capsule | Oxytocin | Capsule | FUTURE_HIDDEN | `YRuOnlfY8zqhSDElCYh3` | PAIR | 1 | 1 |
| Oxytocin — Nasal Spray | Oxytocin | Nasal Spray | FUTURE_HIDDEN | `jgHdIW2hUKUtIdiOgCGR` | PAIR | 1 | 1 |
| Oxytocin — Unspecified | Oxytocin | Unspecified | FUTURE_HIDDEN | `xsx4IVyPEqFb2BFjUuos` | PAIR | 1 | 1 |
| PT-141 (Bremelanotide) Nasal Spray | PT-141 | Nasal Spray | FUTURE_HIDDEN | `7a11W067k20AKLSsL2xM` | PAIR | 4 | 6 |
| Pinealon — Unspecified | Pinealon | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Progesterone / HRT — Cream | Progesterone / HRT | Cream | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 2 |
| Progesterone / HRT — Unspecified | Progesterone / HRT | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 2 |
| Retatrutide — Unspecified | Retatrutide | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Scream Cream | Scream Cream | Cream | FUTURE_HIDDEN | `llc4XwX8XjHashrkv74r` | PAIR | 1 | 1 |
| Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone | Scream Cream | Cream | FUTURE_HIDDEN | `23ziOr7M8UnkrgwA9t3a` | OWNER_REVIEW | 1 | 1 |
| Sildenafil (3 Month) | Scream Cream | Vaginal Cream | FUTURE_HIDDEN | `XtvUeYHLBdmxzfxoM6rW` | OWNER_REVIEW | 1 | 1 |
| Sildenafil (6 Month) | Scream Cream | Vaginal Cream | FUTURE_HIDDEN | `L558M8WEFGDVXveGHwQ8` | OWNER_REVIEW | 1 | 1 |
| Selank — Unspecified | Selank | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Selank — Unspecified | Selank | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 2 |
| Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan | Semaglutide | Unspecified | FUTURE_HIDDEN | `0bq3yX9UMOoX21J9Kvum` | PAIR | 1 | 1 |
| Orforglipron (Oral) — Any Dose | Semaglutide | Oral | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Orforglipron (Oral) — High | Semaglutide | Oral | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Orforglipron (Oral) — Mid | Semaglutide | Oral | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Orforglipron (Oral) — Starting / Low | Semaglutide | Oral | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Ozempic (Semaglutide) | Semaglutide | Unspecified | FUTURE_HIDDEN | `uAft0k37VbE2UCx6fDQz` | PAIR | 1 | 1 |
| Semaglutide + Ondansetron (Nausea Support) | Semaglutide | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Semaglutide Injection — 3-Month (B12) | Semaglutide | Injection | LIVE_NOW | `sN2ggSXRJINjElMYTQjf` | UPDATE | 2 | 2 |
| Semaglutide Injection — 3-Month (Glycine) | Semaglutide | Injection | LIVE_NOW | `None` | OWNER_REVIEW | 0 | 0 |
| Semaglutide Injection — Any Dose (B12) | Semaglutide | Injection | LIVE_NOW | `MkDIUw0NcJB7YL2pNzYW` | UPDATE | 1 | 5 |
| Semaglutide Injection — Any Dose (Glycine) | Semaglutide | Injection | LIVE_NOW | `wQK2JsFnh7oFBf3Lag4n` | UPDATE | 1 | 5 |
| Semaglutide Injection — Any Dose (L-Carnitine) | Semaglutide | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Semaglutide Injection — High (B12) | Semaglutide | Injection | LIVE_NOW | `34I2X8MpVZf3AQTff3bo` | UPDATE | 1 | 2 |
| Semaglutide Injection — High (Glycine) | Semaglutide | Injection | LIVE_NOW | `sssEk3FDY4LFbQYGQsLx` | UPDATE | 2 | 2 |
| Semaglutide Injection — High (L-Carnitine) | Semaglutide | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Semaglutide Injection — Mid (B12) | Semaglutide | Injection | LIVE_NOW | `None` | CREATE_NEW | 0 | 1 |
| Semaglutide Injection — Mid (Glycine) | Semaglutide | Injection | LIVE_NOW | `CjqOUbPuGPZzxephqRou` | UPDATE | 1 | 1 |
| Semaglutide Injection — Mid (L-Carnitine) | Semaglutide | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Semaglutide Injection — Starting / Low (B12) | Semaglutide | Injection | LIVE_NOW | `SkqQHmsc0WdsbK9vmV1y` | UPDATE | 3 | 3 |
| Semaglutide Injection — Starting / Low (Glycine) | Semaglutide | Injection | LIVE_NOW | `tk2GW39OGr7JX4MCCoJP` | UPDATE | 2 | 2 |
| Semaglutide Injection — Starting / Low (L-Carnitine) | Semaglutide | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 2 |
| Semaglutide Oral / Sublingual — High | Semaglutide | Troche | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Semaglutide Oral / Sublingual — Mid | Semaglutide | Troche | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Semaglutide Oral / Sublingual — Starting / Low | Semaglutide | Oral | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 4 | 4 |
| Semaglutide Weight Loss Plan – Semaglutide (Any Dose) | Semaglutide | Unspecified | FUTURE_HIDDEN | `CdWCXaI7dpUXkzqGfGAJ` | PAIR | 1 | 1 |
| Semaglutide Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply | Semaglutide | Unspecified | FUTURE_HIDDEN | `AwwxOWjduXvEOcAXkLBH` | PAIR | 1 | 1 |
| Semaglutide Weight Loss Plan – Semaglutide (High Dose / Maintenance) | Semaglutide | Unspecified | FUTURE_HIDDEN | `ZWh2t0ZR2rsUsZ7EkNBF` | PAIR | 1 | 1 |
| Semaglutide Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply | Semaglutide | Unspecified | FUTURE_HIDDEN | `PNXIwHZZsS5kl3Xm7uPN` | PAIR | 1 | 1 |
| Semaglutide Weight Loss Plan – Semaglutide (Low Dose) | Semaglutide | Unspecified | FUTURE_HIDDEN | `wTvqATx0X8fO8Hr3SxhN` | PAIR | 1 | 1 |
| Semaglutide Weight Loss Plan – Semaglutide (Mid Dose) | Semaglutide | Unspecified | FUTURE_HIDDEN | `DtZIALzkINIQyBufL2VW` | PAIR | 1 | 1 |
| Semaglutide Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply | Semaglutide | Unspecified | FUTURE_HIDDEN | `JVsAjB7fGtbKBtmRUjPD` | PAIR | 1 | 1 |
| Semaglutide Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply | Semaglutide | Unspecified | FUTURE_HIDDEN | `YOlkiOC7QXXvfyGCRAoh` | PAIR | 1 | 1 |
| Semaglutide Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Low: 1→2→4mg) | Semaglutide | Unspecified | FUTURE_HIDDEN | `LEWPChDd8BdaMSJlV9pl` | PAIR | 2 | 2 |
| Semaglutide/B12 (6 Months) | Semaglutide | Unspecified | FUTURE_HIDDEN | `7p32vVgCU88CBPLVI84N` | PAIR | 1 | 1 |
| Semaglutide/B12/Glycine | Semaglutide | Injection | FUTURE_HIDDEN | `k06szhcZp65aHkcCC8DT` | PAIR | 1 | 1 |
| The Ultimate Semaglutide Stack | Semaglutide | Unspecified | FUTURE_HIDDEN | `5wY5LsuhMhaKtyWSCJPR` | PAIR | 1 | 1 |
| Semax — Unspecified | Semax | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 3 |
| Sermorelin — Injection | Sermorelin | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 2 |
| Sermorelin — Troche | Sermorelin | Troche | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 2 |
| Sermorelin — Troche | Sermorelin | Troche | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Sildenafil — Unspecified | Sildenafil | Unspecified | FUTURE_HIDDEN | `w0Rf0DXmI8ukPgoMtH6g` | PAIR | 5 | 5 |
| TB-500 / Blends — Unspecified | TB-500 / Blends | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| TB-500 / Blends — Unspecified | TB-500 / Blends | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Tadalafil — Unspecified | Tadalafil | Unspecified | FUTURE_HIDDEN | `4eSxN4A4oiycKWIk6VOP` | PAIR | 4 | 4 |
| Tesamorelin / Ipamorelin Injection | Tesamorelin / Ipamorelin | Injection | FUTURE_HIDDEN | `Nf8jQnIyG5Zf98SsmpUu` | PAIR | 9 | 9 |
| Testosterone / HRT — Cream | Testosterone / HRT | Cream | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 2 |
| Testosterone / HRT — Injection | Testosterone / HRT | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 6 |
| Testosterone / HRT — Troche | Testosterone / HRT | Troche | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Testosterone / HRT — Unspecified | Testosterone / HRT | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 3 | 3 |
| Thymosin Alpha-1 Injection | Thymosin Alpha-1 | Injection | FUTURE_HIDDEN | `qgn9vCpD8bBN5pXNPKE5` | PAIR | 2 | 2 |
| Tirzepatide + Ondansetron (Nausea Support) | Tirzepatide | Unspecified | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 3 | 3 |
| Tirzepatide Injection — 3-Month (B12) | Tirzepatide | Injection | FUTURE_HIDDEN | `None` | OWNER_REVIEW | 0 | 0 |
| Tirzepatide Injection — 3-Month (Glycine) | Tirzepatide | Injection | FUTURE_HIDDEN | `Mk6NCa9023u9hGBnFg8z` | PAIR | 5 | 6 |
| Tirzepatide Injection — Any Dose (B12) | Tirzepatide | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 0 | 6 |
| Tirzepatide Injection — Any Dose (Glycine) | Tirzepatide | Injection | FUTURE_HIDDEN | `SvFDJ7W4nmWL2bkLUMMS` | PAIR | 4 | 10 |
| Tirzepatide Injection — B12+Glycine (ambiguous) | Tirzepatide | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 2 | 2 |
| Tirzepatide Injection — High (B12) | Tirzepatide | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 0 | 2 |
| Tirzepatide Injection — High (Glycine) | Tirzepatide | Injection | FUTURE_HIDDEN | `43kVbBgNLBocKyVUhQmG` | PAIR | 2 | 4 |
| Tirzepatide Injection — Mid (B12) | Tirzepatide | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 0 | 2 |
| Tirzepatide Injection — Mid (Glycine) | Tirzepatide | Injection | FUTURE_HIDDEN | `nHLXeUgejEgm8y4MVGs4` | PAIR | 1 | 3 |
| Tirzepatide Injection — Starting / Low (B12) | Tirzepatide | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 0 | 2 |
| Tirzepatide Injection — Starting / Low (Glycine) | Tirzepatide | Injection | FUTURE_HIDDEN | `Ox7IM9d6zCgtDsHHUeWJ` | PAIR | 9 | 11 |
| Tirzepatide Injection — Starting / Low (L-Carnitine) | Tirzepatide | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Tirzepatide Injection — Starting / Low (Niacinamide) | Tirzepatide | Injection | FUTURE_HIDDEN | `None` | CREATE_HIDDEN | 1 | 1 |
| Tretinoin / Skin — Unspecified | Tretinoin / Skin | Unspecified | FUTURE_HIDDEN | `EeWMcfCJf5EU2LkNQmp9` | PAIR | 3 | 8 |
| Vardenafil — Unspecified | Vardenafil | Unspecified | FUTURE_HIDDEN | `tnEy0RPo2Nzma5TYjTgS` | PAIR | 1 | 1 |

---

## Semaglutide dose-ladder detail

### Semaglutide Injection — 3-Month (B12)
- Key: `sem-b12-3month`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg)` / `sN2ggSXRJINjElMYTQjf`
- Action: **UPDATE** · Launch: **LIVE_NOW**
- Proposed showPatient=True storefrontEligible=True
- Master rows: 2

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
| SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) | Dirx-Hub | 10mg/0.5mg/mL | 1mL | EXACT |
| SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) | Dirx-Hub | 10mg/0.5mg/mL | 1mL | HIGH |

### Semaglutide Injection — Any Dose (B12)
- Key: `sem-b12-any`
- Existing GEN: `GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose)` / `MkDIUw0NcJB7YL2pNzYW`
- Action: **UPDATE** · Launch: **LIVE_NOW**
- Proposed showPatient=True storefrontEligible=True
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
| SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 1mg/0.5mg/mL | 1mL | HIGH |
| SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 2mg/0.5mg/mL | 1mL | HIGH |
| SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 4mg/0.5mg/mL | 1mL | HIGH |
| SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 6mg/0.5mg/mL | 1mL | HIGH |
| SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 10mg/0.5mg/mL | 1mL | HIGH |

### Semaglutide Injection — High (B12)
- Key: `sem-b12-high`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide / B12 (High Dose)` / `34I2X8MpVZf3AQTff3bo`
- Action: **UPDATE** · Launch: **LIVE_NOW**
- Proposed showPatient=True storefrontEligible=True
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
| SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 6mg/0.5mg/mL | 1mL | EXACT |
| SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 10mg/0.5mg/mL | 1mL | EXACT |

### Semaglutide Injection — Mid (B12)
- Key: `sem-b12-mid`
- Existing GEN: `None` / `None`
- Action: **CREATE_NEW** · Launch: **LIVE_NOW**
- Proposed showPatient=True storefrontEligible=True
- Master rows: 0

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
| SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 4mg/0.5mg/mL | 1mL | EXACT |

### Semaglutide Injection — Starting / Low (B12)
- Key: `sem-b12-starting`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide + B12 (Starting Dose / Micro-Dose)` / `SkqQHmsc0WdsbK9vmV1y`
- Action: **UPDATE** · Launch: **LIVE_NOW**
- Proposed showPatient=True storefrontEligible=True
- Master rows: 3

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
| SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 1mg/0.5mg/mL | 1mL | EXACT |
| SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 2mg/0.5mg/mL | 1mL | EXACT |
| SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 1mg/0.5mg/mL | 1mL | HIGH |

### Semaglutide Injection — 3-Month (Glycine)
- Key: `sem-glycine-3month`
- Existing GEN: `None` / `None`
- Action: **OWNER_REVIEW** · Launch: **LIVE_NOW**
- Proposed showPatient=True storefrontEligible=True
- Master rows: 0

### Semaglutide Injection — Any Dose (Glycine)
- Key: `sem-glycine-any`
- Existing GEN: `GLP-1 Weight Loss Membership – Semaglutide / Glycine (Any Dose)` / `wQK2JsFnh7oFBf3Lag4n`
- Action: **UPDATE** · Launch: **LIVE_NOW**
- Proposed showPatient=True storefrontEligible=True
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
| SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 1mg/0.5mg/mL | 1mL | HIGH |
| SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 2mg/0.5mg/mL | 1mL | HIGH |
| SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 4mg/0.5mg/mL | 1mL | HIGH |
| SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 6mg/0.5mg/mL | 1mL | HIGH |
| SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 10mg/0.5mg/mL | 1mL | HIGH |

### Semaglutide Injection — High (Glycine)
- Key: `sem-glycine-high`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide / Glycine (High Dose)` / `sssEk3FDY4LFbQYGQsLx`
- Action: **UPDATE** · Launch: **LIVE_NOW**
- Proposed showPatient=True storefrontEligible=True
- Master rows: 2

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
| SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 6mg/0.5mg/mL | 1mL | EXACT |
| SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 10mg/0.5mg/mL | 1mL | EXACT |

### Semaglutide Injection — Mid (Glycine)
- Key: `sem-glycine-mid`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide / Glycine (Mid Dose)` / `CjqOUbPuGPZzxephqRou`
- Action: **UPDATE** · Launch: **LIVE_NOW**
- Proposed showPatient=True storefrontEligible=True
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
| SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 4mg/0.5mg/mL | 1mL | EXACT |

### Semaglutide Injection — Starting / Low (Glycine)
- Key: `sem-glycine-starting`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide / Glycine (Starting Dose)` / `tk2GW39OGr7JX4MCCoJP`
- Action: **UPDATE** · Launch: **LIVE_NOW**
- Proposed showPatient=True storefrontEligible=True
- Master rows: 2

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
| SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 1mg/0.5mg/mL | 1mL | EXACT |
| SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 2mg/0.5mg/mL | 1mL | EXACT |

### Semaglutide Injection — Any Dose (L-Carnitine)
- Key: `sem-lcarnitine-any`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Injection — High (L-Carnitine)
- Key: `sem-lcarnitine-high`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Injection — Mid (L-Carnitine)
- Key: `sem-lcarnitine-mid`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Injection — Starting / Low (L-Carnitine)
- Key: `sem-lcarnitine-starting`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 2

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |
| SEMAGLUTIDE/L-CARNITINE (2ML) 2mg/100mg/ml | Vios | 2mg/100mg/ml | 2 ml | HIGH |

### Semaglutide + Ondansetron (Nausea Support)
- Key: `sem-ondansetron-support`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Oral / Sublingual — High
- Key: `sem-oral-high`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Oral / Sublingual — Mid
- Key: `sem-oral-mid`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Oral / Sublingual — Starting / Low
- Key: `sem-oral-starting`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 4

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |
|  |  |  |  | REVIEW |
|  |  |  |  | REVIEW |
| SUBLINGUAL SEMAGLUTIDE 10mg/4mL | Greenwich Pharmacy | 2.5mg/1mL | 4ML | REVIEW |

### Orforglipron (Oral) — Any Dose
- Key: `sem-orforglipron-any`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Orforglipron (Oral) — High
- Key: `sem-orforglipron-high`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Orforglipron (Oral) — Mid
- Key: `sem-orforglipron-mid`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Orforglipron (Oral) — Starting / Low
- Key: `sem-orforglipron-starting`
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Low: 1→2→4mg)
- Key: `sem-other-glp1weightlossplansemaglutide3monthescal`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Low: 1→2→4mg)` / `LEWPChDd8BdaMSJlV9pl`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 2

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |
|  |  |  |  | REVIEW |

### Semaglutide Weight Loss Plan – Semaglutide (Any Dose)
- Key: `sem-other-glp1weightlossplansemaglutideanydose`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide (Any Dose)` / `CdWCXaI7dpUXkzqGfGAJ`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply
- Key: `sem-other-glp1weightlossplansemaglutideanydose3mon`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply` / `AwwxOWjduXvEOcAXkLBH`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply
- Key: `sem-other-glp1weightlossplansemaglutidehighdose3mo`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply` / `PNXIwHZZsS5kl3Xm7uPN`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Weight Loss Plan – Semaglutide (High Dose / Maintenance)
- Key: `sem-other-glp1weightlossplansemaglutidehighdosemai`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide (High Dose / Maintenance)` / `ZWh2t0ZR2rsUsZ7EkNBF`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Weight Loss Plan – Semaglutide (Low Dose)
- Key: `sem-other-glp1weightlossplansemaglutidelowdose`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide (Low Dose)` / `wTvqATx0X8fO8Hr3SxhN`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Weight Loss Plan – Semaglutide (Mid Dose)
- Key: `sem-other-glp1weightlossplansemaglutidemiddose`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide (Mid Dose)` / `DtZIALzkINIQyBufL2VW`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply
- Key: `sem-other-glp1weightlossplansemaglutidemiddose3mon`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply` / `JVsAjB7fGtbKBtmRUjPD`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply
- Key: `sem-other-glp1weightlossplansemaglutidestartingdos`
- Existing GEN: `GLP-1 Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply` / `YOlkiOC7QXXvfyGCRAoh`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Semaglutide/B12 (6 Months)
- Key: `sem-other-semaglutideb126months`
- Existing GEN: `Semaglutide/B12 (6 Months)` / `7p32vVgCU88CBPLVI84N`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
| SEMAGLUTIDE/B12 0.6 MG/ 500 MCG/ML (2 ML) | Optimal Balance Pharmacy | 0.6 MG/ 500 MCG/ML (2 ML) | 2 mL | REVIEW |

### Semaglutide/B12/Glycine
- Key: `sem-other-semaglutideb12glycine`
- Existing GEN: `Semaglutide/B12/Glycine` / `k06szhcZp65aHkcCC8DT`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
| SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | Dirx-Hub | 1mg/0.5mg/mL | 1mL | REVIEW |

### Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan
- Key: `sem-stack-leanreadysemaglutidebpc157aod9604plan`
- Existing GEN: `Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan` / `0bq3yX9UMOoX21J9Kvum`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### Ozempic (Semaglutide)
- Key: `sem-stack-ozempicsemaglutide`
- Existing GEN: `Ozempic (Semaglutide)` / `uAft0k37VbE2UCx6fDQz`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

### The Ultimate Semaglutide Stack
- Key: `sem-stack-theultimatesemaglutidestack`
- Existing GEN: `The Ultimate Semaglutide Stack` / `5wY5LsuhMhaKtyWSCJPR`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Proposed showPatient=False storefrontEligible=False
- Master rows: 1

| Medication | Pharmacy | Strength | Package | Confidence |
|---|---|---|---|---|
|  |  |  |  | REVIEW |

---

## Tirzepatide dose-ladder detail

### Tirzepatide Injection — 3-Month (B12)
- Existing GEN: `None` / `None`
- Action: **OWNER_REVIEW** · Launch: **FUTURE_HIDDEN**
- Master rows: 0 · Pairings: 0

### Tirzepatide Injection — Any Dose (B12)
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Master rows: 0 · Pairings: 6

### Tirzepatide Injection — B12+Glycine (ambiguous)
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Master rows: 2 · Pairings: 2

### Tirzepatide Injection — High (B12)
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Master rows: 0 · Pairings: 2

### Tirzepatide Injection — Mid (B12)
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Master rows: 0 · Pairings: 2

### Tirzepatide Injection — Starting / Low (B12)
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Master rows: 0 · Pairings: 2

### Tirzepatide Injection — 3-Month (Glycine)
- Existing GEN: `GLP-2 Weight Loss Membership – Tirzepatide Any Dose (3 Months)` / `Mk6NCa9023u9hGBnFg8z`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Master rows: 5 · Pairings: 6

### Tirzepatide Injection — Any Dose (Glycine)
- Existing GEN: `GLP-2 Weight Loss – Tirzepatide (Any Dose)` / `SvFDJ7W4nmWL2bkLUMMS`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Master rows: 4 · Pairings: 10

### Tirzepatide Injection — High (Glycine)
- Existing GEN: `GLP-2 Weight Loss – Tirzepatide (High Dose)` / `43kVbBgNLBocKyVUhQmG`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Master rows: 2 · Pairings: 4

### Tirzepatide Injection — Mid (Glycine)
- Existing GEN: `GLP-2 Weight Loss Plan – Tirzepatide (Mid Dose)` / `nHLXeUgejEgm8y4MVGs4`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Master rows: 1 · Pairings: 3

### Tirzepatide Injection — Starting / Low (Glycine)
- Existing GEN: `Accelerate & Thrive – Tirzepatide + NAD+ Plan` / `Ox7IM9d6zCgtDsHHUeWJ`
- Action: **PAIR** · Launch: **FUTURE_HIDDEN**
- Master rows: 9 · Pairings: 11

### Tirzepatide Injection — Starting / Low (L-Carnitine)
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Master rows: 1 · Pairings: 1

### Tirzepatide Injection — Starting / Low (Niacinamide)
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Master rows: 1 · Pairings: 1

### Tirzepatide + Ondansetron (Nausea Support)
- Existing GEN: `None` / `None`
- Action: **CREATE_HIDDEN** · Launch: **FUTURE_HIDDEN**
- Master rows: 3 · Pairings: 3

---

## Coverage audit (253/253)

| Coverage | Count |
|---|---:|
| FUTURE_ASSIGNED | 226 |
| ASSIGNED_TO_CLIENT_PRODUCT | 18 |
| TRUE_FORMULARY_REVIEW | 7 |
| EXCLUDED | 2 |

**STOP FOR OWNER REVIEW.**
