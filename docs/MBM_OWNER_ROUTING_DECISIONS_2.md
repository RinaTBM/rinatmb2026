# Owner Routing Decisions — Pass 2

**For:** Owner review only  
**Phase:** MBM-OWNER-ROUTING-DECISION-GATE-2  
**Mode:** Read-only — no GEN, website, pairing, checkout, or cutover changes  

Website product-family architecture remains **LOCKED** (one clean product → variants → exact GEN route).

This document asks you to decide **only 8 blocked items**.  
It does **not** reopen SEM/TIR membership prices, B12/Glycine distinction, TIR tiers, B6 restoration, or NAD+ as one website product.

---

## How to use

For each decision, mark one box and write your choice at the bottom.

Recommended options are marked clearly. You can choose differently.

---

# DECISION 1 OF 8

**PRODUCT:** Semaglutide  
**VARIANT:** Current website “Semaglutide + B6” one-time (legacy)

**CUSTOMER WOULD SEE:**  
Semaglutide product page → one-time purchase with B6 formulation (current live storefront until cutover)

**CURRENT WEBSITE VERSION:**  
Semaglutide + B6 Injection — vials from **$119** (0.5mg / 1mg / 2.5mg / 5mg)

**FORMULARY OPTION:**  
None for B6 (B6 is not in the cutover target). Cutover target is Semaglutide + **B12** or **Glycine** dose groups (already approved).

**PHARMACY / STRENGTH / PACKAGE:** — (legacy; not SELECTED cutover path)  
**COST / SHIPPING / MBM RETAIL:** — (do not invent)

**CURRENT GEN:** No exact B6 cutover route (blocked for new routing)

**PROBLEM:**  
B6 is transitional only. Cutover architecture already replaces it with B12/Glycine. Need owner confirmation that B6 is removed at cutover and never restored.

[ ] **OPTION A** — At website cutover, remove B6 one-time from Semaglutide; replace with approved B12/Glycine dose selectors (recommended)  
[ ] **OPTION B** — Keep B6 visible longer after other cutover work (delay only; still do not reintroduce B6 as long-term formulary)  
[ ] **DEFER** — Decide later; leave blocked

**RECOMMENDATION:** OPTION A  
**WHY:** Matches locked Semaglutide family architecture; no B6 in SELECTED cutover path; cleanest patient experience.

**OWNER CHOICE:** __________

---

# DECISION 2 OF 8

**PRODUCT:** Tirzepatide  
**VARIANT:** Current website “Tirzepatide + B6” one-time (legacy)

**CUSTOMER WOULD SEE:**  
Tirzepatide product page → one-time purchase with B6 (current live storefront until cutover)

**CURRENT WEBSITE VERSION:**  
Tirzepatide + B6 Injection — vials from **$189** (2.5mg / 7.5mg / 12.5mg / 15mg)

**FORMULARY OPTION:**  
None for B6. Cutover target is Tirzepatide + **B12** or **Glycine** with approved tiers (5+10 / 15+20 / 25+30 / Any Dose).

**PHARMACY / STRENGTH / PACKAGE:** —  
**COST / SHIPPING / MBM RETAIL:** —

**CURRENT GEN:** No exact B6 cutover route (blocked for new routing)

**PROBLEM:**  
Same as Semaglutide B6 — transitional only; must confirm removal at cutover.

[ ] **OPTION A** — At website cutover, remove B6; replace with approved B12/Glycine dose selectors (recommended)  
[ ] **OPTION B** — Delay B6 removal only (still not long-term)  
[ ] **DEFER**

**RECOMMENDATION:** OPTION A  
**WHY:** Matches locked Tirzepatide architecture; B6 not in SELECTED cutover path.

**OWNER CHOICE:** __________

---

# DECISION 3 OF 8

**PRODUCT:** NAD+ *(still ONE website product — Injection vs Nasal)*  
**VARIANT:** Injection — adopt SELECTED **200mg/mL · 5mL (1000mg)** instead of current website **100mg/mL**

**CUSTOMER WOULD SEE (if approved):**  
NAD+ → Delivery: Injection → package/strength based on SELECTED injectable

**CURRENT WEBSITE VERSION:**  
Injection **100mg/mL** · 5mL / 500mg @ **$199** ··· 10mL / 1000mg @ **$229**  
*(These current 100mg/mL options remain FORMULARY_PENDING — see sourcing table. Do not silent-substitute.)*

**FORMULARY OPTION (SELECTED):**  
`NAD+ (Nicotinamide Adenine Dinucleotide) 200mg/ml` · Injection Solution  
Row **83** · St Luke · 5ml vial (1000mg)

| Field | Value |
|---|---|
| PHARMACY | St Luke |
| STRENGTH | **200mg/mL** |
| PACKAGE | 5mL vial (1000mg total) |
| COST | $64 |
| SHIPPING | $30 |
| **MBM RETAIL** | **$139** |

**CURRENT GEN:** `SHJpGAACUFEeMONdpEbn` — NAD+ (Injectable) — needs pairing after owner decision

**PROBLEM:**  
Website promises **100mg/mL**. SELECTED injectable is only **200mg/mL**. Cannot silently substitute. Nasal stays separate under the same NAD+ page.

[ ] **OPTION A** — Change website Injection options to SELECTED **200mg/mL · 5mL (1000mg) @ $139**; keep Nasal as separate selectors under NAD+ (recommended **if** you accept strength change)  
[ ] **OPTION B** — Keep website **100mg/mL** Injection as shown; require pharmacy to source matching 100mg/mL injectable (5mL & 10mL) before routing  
[ ] **OPTION C** — Temporarily offer only Nasal under NAD+ until Injection formulary is resolved (Injection hidden/off)  
[ ] **DEFER**

**RECOMMENDATION:** OPTION B  
**WHY:** Closest match to what customers already see (100mg/mL). Avoids changing a published strength without sourcing. Option A is cleaner economically ($139, already SELECTED) only if you explicitly accept a website strength change.

**OWNER CHOICE:** __________

---

# DECISION 4 OF 8

**PRODUCT:** NAD+  
**VARIANT:** Workbook row **81** — NAD+ 50mg/mL nasal (mislabeled delivery)

**CUSTOMER WOULD SEE:**  
Should **not** appear as a separate Injection option. True nasal 50mg/mL is already represented by verified row **84**.

**FORMULARY OPTION:**  
Row 81 — Form = Nasal Spray · 50mg/mL · 15mL · St Luke · cost $30 + ship $30 → **$79**  
*(Delivery Type column incorrectly says “Injection”)*

**CURRENT GEN:** `FVwkzvQqWIZRNAwbslGw` — NAD + Nasal Spray

**PROBLEM:**  
Duplicate / dirty workbook row. Same chemistry as r84. Risk of wrongly treating it as injectable.

[ ] **OPTION A** — Exclude r81 from website selectors; use **r84** only for 50mg/mL nasal (recommended)  
[ ] **OPTION B** — Keep r81 as a selectable nasal variant (not recommended — duplicate of r84)  
[ ] **DEFER**

**RECOMMENDATION:** OPTION A  
**WHY:** Same nasal product as r84; avoids injection confusion.

**OWNER CHOICE:** __________

---

# DECISION 5 OF 8

**PRODUCT:** NAD+  
**VARIANT:** Workbook row **82** — NAD+ 200mg/mL nasal (mislabeled delivery)

**CUSTOMER WOULD SEE:**  
Should **not** appear as Injection. True nasal 200mg/mL is already represented by verified row **85**.

**FORMULARY OPTION:**  
Row 82 — Form = Nasal Spray · 200mg/mL · 15mL · St Luke · cost $45 + ship $30 → **$109**  
*(Delivery Type column incorrectly says “Injection”)*

**CURRENT GEN:** `FVwkzvQqWIZRNAwbslGw` — NAD + Nasal Spray

**PROBLEM:**  
Duplicate of r85 with mislabeled delivery.

[ ] **OPTION A** — Exclude r82 from website selectors; use **r85** only for 200mg/mL nasal (recommended)  
[ ] **OPTION B** — Keep r82 as a selectable nasal variant (not recommended)  
[ ] **DEFER**

**RECOMMENDATION:** OPTION A  
**WHY:** Same as r85; keeps NAD+ nasal selectors clean (r84 + r85 only).

**OWNER CHOICE:** __________

---

# DECISION 6 OF 8

**PRODUCT:** Tretinoin  
**VARIANT:** Adopt SELECTED plain cream **0.15% · 30g** (instead of current website 0.025 / 0.05 / 0.1% · 20g)

**CUSTOMER WOULD SEE (if approved):**  
Tretinoin → strength **0.15%** cream (30g)

**CURRENT WEBSITE VERSION:**  
0.025% @ **$79** · 0.05% @ **$89** · 0.1% @ **$109** — all **20g**

**FORMULARY OPTION:**  
Row **126** — `TRETINOIN 0.15%` · Cream · 30 grams · Vios

| Field | Value |
|---|---|
| PHARMACY | Vios |
| STRENGTH | **0.15%** |
| PACKAGE | 30 grams |
| COST | $25.50 |
| SHIPPING | $30 |
| **MBM RETAIL** | **$79** |

**CURRENT GEN:** `EeWMcfCJf5EU2LkNQmp9` (near-name only — pairing later if approved)

**PROBLEM:**  
Website lists three strengths that are **not** in SELECTED. SELECTED has 0.15% plain. Do not silent-substitute.

[ ] **OPTION A** — Change website to SELECTED **0.15% · 30g @ $79** (only if you accept strength/package change)  
[ ] **OPTION B** — Keep website 0.025 / 0.05 / 0.1% · 20g; require pharmacy sourcing for those exact strengths (recommended if you want to keep current storefront claims)  
[ ] **OPTION C** — Offer both: keep current strengths as pending + add 0.15% as an additional selectable strength once paired  
[ ] **DEFER**

**RECOMMENDATION:** OPTION B  
**WHY:** Matches what customers already see. Option A is simpler for GEN/formulary but changes published strengths.

**OWNER CHOICE:** __________

---

# DECISION 7 OF 8

**PRODUCT:** Tretinoin  
**VARIANT:** Adopt SELECTED **combo** cream HA / Niacinamide / Tretinoin **0.5 / 4 / 0.025% · 30g**

**CUSTOMER WOULD SEE (if approved):**  
A combination cream (not plain tretinoin) — either as a separate selector under Tretinoin or as a different product family

**CURRENT WEBSITE VERSION:**  
Plain tretinoin strengths only (no HA/Niacinamide combo promised)

**FORMULARY OPTION:**  
Row **127** — `HYALURONIC/NIACINAMIDE/TRETINOIN 0.5/4/0.025%` · 30g · Vios

| Field | Value |
|---|---|
| PHARMACY | Vios |
| STRENGTH | 0.5% HA / 4% Niacinamide / 0.025% Tretinoin |
| PACKAGE | 30 grams |
| COST | $54 |
| SHIPPING | $30 |
| **MBM RETAIL** | **$129** |

**CURRENT GEN:** `EeWMcfCJf5EU2LkNQmp9` (near-name — not proven match)

**PROBLEM:**  
This is a **different clinical combination**, not a substitute for plain tretinoin 0.025%.

[ ] **OPTION A** — Do **not** map this to current plain Tretinoin website product; keep as FUTURE separate variant/family only (recommended)  
[ ] **OPTION B** — Add as an explicit “Combination cream” selector under Tretinoin (customer must see it is not plain tretinoin)  
[ ] **OPTION C** — Replace plain tretinoin website offering with this combo (not recommended)  
[ ] **DEFER**

**RECOMMENDATION:** OPTION A  
**WHY:** Website grouping is UX only — not permission to merge different actives. Combo ≠ plain tretinoin.

**OWNER CHOICE:** __________

---

# DECISION 8 OF 8

**PRODUCT:** Scream Cream  
**VARIANT:** Future placeholder (no SELECTED formulary)

**CUSTOMER WOULD SEE:**  
Nothing today (FUTURE_HIDDEN). No formulary row to sell against.

**FORMULARY OPTION:** None in SELECTED  
**PHARMACY / STRENGTH / PACKAGE / COST / SHIPPING / RETAIL:** —  
**CURRENT GEN:** None approved for this architecture path

**PROBLEM:**  
Prior lock: do not activate without explicit owner approval and formulary source.

[ ] **OPTION A** — Keep **FUTURE_HIDDEN / do not activate** until formulary is sourced and owner explicitly launches (recommended)  
[ ] **OPTION B** — Prioritize pharmacy sourcing now (still no website launch until sourced)  
[ ] **DEFER**

**RECOMMENDATION:** OPTION A  
**WHY:** No SELECTED formulary; activating would invent a product.

**OWNER CHOICE:** __________

---

# SOURCING / FORMULARY INFORMATION NEEDED

These **14** variants are **FORMULARY_PENDING**.  
They are **not** owner multiple-choice decisions — they need pharmacy / formulary data.

| # | Product family | Variant | Missing information |
|---:|---|---|---|
| 1 | NAD+ | Injection 5mL / 500mg (website 100mg/mL) | Exact injectable formulary matching **100mg/mL**; package 5mL; pharmacy; cost; shipping |
| 2 | NAD+ | Injection 10mL / 1000mg (website 100mg/mL) | Exact injectable formulary matching **100mg/mL**; package 10mL; pharmacy; cost; shipping |
| 3 | Tretinoin | Cream 0.025% · 20g | Plain tretinoin **0.025%**; package **20g** (or owner-approved package); pharmacy; cost; shipping |
| 4 | Tretinoin | Cream 0.05% · 20g | Plain tretinoin **0.05%**; package 20g; pharmacy; cost; shipping |
| 5 | Tretinoin | Cream 0.1% · 20g | Plain tretinoin **0.1%**; package 20g; pharmacy; cost; shipping |
| 6 | Fat Burner | AOD + MOTS-c + Tesamorelin (no Ipamorelin) | Exact 3-ingredient injectable; target 1.2/2/3 mg/mL · 5mL; pharmacy; cost; shipping |
| 7 | Testosterone | Cream 5 mg/g | Dedicated testosterone-only cream; strength 5 mg/g; package (e.g. 30g); pharmacy; cost; shipping |
| 8 | Selank | Injection | Injectable Selank; target 5 mg/mL · 2mL; pharmacy; cost; shipping *(nasal already exists separately — do not substitute)* |
| 9 | Semax | Injection | Injectable Semax; target 5 mg/mL · 2mL; pharmacy; cost; shipping |
| 10 | Selank + Semax Blend | Combined nasal | Single combined Selank+Semax nasal compound; target 50mcg/50mcg · 10mL; pharmacy; cost; shipping |
| 11 | Tesamorelin | Plain injection | Plain Tesamorelin only (not MOTS-c blend); strength/package; pharmacy; cost; shipping |
| 12 | Lash / Brow | Bimatoprost 0.03% · 2.5mL | Confirmed pharmacy (not TBD); cost; shipping; SELECTED-ready row |
| 13 | Oxytocin | Nasal (future) | Full SELECTED formulary: strength, package, pharmacy, cost, shipping |
| 14 | Sexual Wellness Compound | Capsules (future) | Full SELECTED formulary: formulation, strength, package, pharmacy, cost, shipping |

---

## FINAL REPORT

| Item | Value |
|---|---|
| OWNER DECISIONS PRESENTED | **8** |
| FORMULARY/SOURCING PENDING | **14** |
| OWNER DECISIONS RESOLVED THIS PASS | **0** (await owner response) |
| ARCHITECTURE REOPENED | **NO** |
| SEM/TIR LOCKS CHANGED | **NO** |
| NAD+ ONE-PRODUCT ARCHITECTURE CHANGED | **NO** |
| GEN MODIFIED | **NO** |
| GEN WRITES | **0** |
| FORMULARY PAIRING WRITES | **0** |
| WEBSITE MODIFIED | **NO** |
| CHECKOUT MODIFIED | **NO** |
| CUTOVER | **OFF** |

**STOP FOR OWNER DECISIONS.**

Do not execute Queues B, C, or D.
