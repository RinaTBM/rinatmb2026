# MBM LIVE vs FUTURE — Owner Review

**Generated:** 2026-08-24T21:12:57Z  
**Phase:** MBM-ARCHITECTURE-OWNER-REVIEW-2  
**Mode:** READ-ONLY — no GEN writes, no website writes, no pairing changes, GEN/Whop cutover OFF  
**LIVE/FUTURE map approval:** **PENDING**  
**Do not start GEN-CATALOG-2B.**

Website comparison source: `src/data/products.ts` (visible + active medication products + active memberships). Workbook “LIVE WEBSITE” SMART rows were **not** used as proof of launch.

---

## Owner decisions already locked

| Decision | Status |
|---|---|
| TIR tiers (5+10 / 15+20 / 25+30 / full Any Dose), separate B12 & Glycine | **APPROVED** |
| SEM membership $149 — one website offer | **APPROVED** |
| TIR membership $275 — one website offer | **APPROVED** |
| Membership backend B12/Glycine split if GEN requires | **APPROVED IF REQUIRED BY GEN** (backend-only; do not auto-expose on website) |
| B6 → B12/Glycine replacement (website not modified yet) | **APPROVED** |
| LIVE/FUTURE map (27 / 29) | **PENDING** — this document |

---

## Table 1 — Proposed LIVE NOW only (27)

| # | PATIENT-FACING PRODUCT | CATEGORY | FORM | FORMULATION / ADDITIVE | PRICE | WHY CLASSIFIED LIVE | CURRENTLY ON WEBSITE? | CURRENT WEBSITE NAME | GEN STATUS | OWNER RECOMMENDATION |
|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | Semaglutide Injection — Starting / Low (B12) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Semaglutide + Vitamin B12 | from $89 | Website currently sells Semaglutide (as +B6). Architecture proposes dose-group + additive products as the LIVE replacement set. | NO | Semaglutide + B6 Injection (single product; strengths 0.5/1/2.5/5mg — not matching SELECTED ladder) | REUSE_REPAIR | REVIEW — keep as intended LIVE replacement, or demote Glycine / some tiers to FUTURE until website can present formulation + dose-group UX |
| 2 | Semaglutide Injection — Mid (B12) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Semaglutide + Vitamin B12 | $109 | Website currently sells Semaglutide (as +B6). Architecture proposes dose-group + additive products as the LIVE replacement set. | NO | Semaglutide + B6 Injection (single product; strengths 0.5/1/2.5/5mg — not matching SELECTED ladder) | REUSE_REPAIR | REVIEW — keep as intended LIVE replacement, or demote Glycine / some tiers to FUTURE until website can present formulation + dose-group UX |
| 3 | Semaglutide Injection — High (B12) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Semaglutide + Vitamin B12 | from $109 | Website currently sells Semaglutide (as +B6). Architecture proposes dose-group + additive products as the LIVE replacement set. | NO | Semaglutide + B6 Injection (single product; strengths 0.5/1/2.5/5mg — not matching SELECTED ladder) | REUSE_REPAIR | REVIEW — keep as intended LIVE replacement, or demote Glycine / some tiers to FUTURE until website can present formulation + dose-group UX |
| 4 | Semaglutide Injection — Any Dose (B12) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Semaglutide + Vitamin B12 | from $89 | Website currently sells Semaglutide (as +B6). Architecture proposes dose-group + additive products as the LIVE replacement set. | NO | Semaglutide + B6 Injection (single product; strengths 0.5/1/2.5/5mg — not matching SELECTED ladder) | REUSE_REPAIR | REVIEW — keep as intended LIVE replacement, or demote Glycine / some tiers to FUTURE until website can present formulation + dose-group UX |
| 5 | Semaglutide Injection — Starting / Low (Glycine) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Semaglutide + Glycine | from $89 | Website currently sells Semaglutide (as +B6). Architecture proposes dose-group + additive products as the LIVE replacement set. | NO | Semaglutide + B6 Injection (single product; strengths 0.5/1/2.5/5mg — not matching SELECTED ladder) | REUSE_REPAIR | REVIEW — keep as intended LIVE replacement, or demote Glycine / some tiers to FUTURE until website can present formulation + dose-group UX |
| 6 | Semaglutide Injection — Mid (Glycine) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Semaglutide + Glycine | $109 | Website currently sells Semaglutide (as +B6). Architecture proposes dose-group + additive products as the LIVE replacement set. | NO | Semaglutide + B6 Injection (single product; strengths 0.5/1/2.5/5mg — not matching SELECTED ladder) | REUSE_REPAIR | REVIEW — keep as intended LIVE replacement, or demote Glycine / some tiers to FUTURE until website can present formulation + dose-group UX |
| 7 | Semaglutide Injection — High (Glycine) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Semaglutide + Glycine | from $109 | Website currently sells Semaglutide (as +B6). Architecture proposes dose-group + additive products as the LIVE replacement set. | NO | Semaglutide + B6 Injection (single product; strengths 0.5/1/2.5/5mg — not matching SELECTED ladder) | REUSE_REPAIR | REVIEW — keep as intended LIVE replacement, or demote Glycine / some tiers to FUTURE until website can present formulation + dose-group UX |
| 8 | Semaglutide Injection — Any Dose (Glycine) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Semaglutide + Glycine | from $89 | Website currently sells Semaglutide (as +B6). Architecture proposes dose-group + additive products as the LIVE replacement set. | NO | Semaglutide + B6 Injection (single product; strengths 0.5/1/2.5/5mg — not matching SELECTED ladder) | REUSE_REPAIR | REVIEW — keep as intended LIVE replacement, or demote Glycine / some tiers to FUTURE until website can present formulation + dose-group UX |
| 9 | SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP | WEIGHT MANAGEMENT | Membership | B12 ladder OR Glycine ladder (explicit selection) | $149/mo | Website already offers Semaglutide Membership at $149/mo (active + visible). | YES | Semaglutide Membership ($149/mo; currently includes Semaglutide + B6) | REUSE_REPAIR | KEEP membership offer on website; later RENAME/copy update for B12/Glycine fulfillment under the hood |
| 10 | Tirzepatide Injection — Starting / Low (B12) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Tirzepatide + Vitamin B12 | from $119 | Website currently sells Tirzepatide (as +B6). Architecture proposes dose-group + additive products; TIR tiers now owner-approved. | NO | Tirzepatide + B6 Injection (single product; strengths 2.5/7.5/12.5/15mg — not matching SELECTED 5–30 ladder) | NEW_REQUIRED | REVIEW — same as SEM: intended LIVE replacement set, but not currently launched as named products |
| 11 | Tirzepatide Injection — Mid (B12) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Tirzepatide + Vitamin B12 | from $149 | Website currently sells Tirzepatide (as +B6). Architecture proposes dose-group + additive products; TIR tiers now owner-approved. | NO | Tirzepatide + B6 Injection (single product; strengths 2.5/7.5/12.5/15mg — not matching SELECTED 5–30 ladder) | NEW_REQUIRED | REVIEW — same as SEM: intended LIVE replacement set, but not currently launched as named products |
| 12 | Tirzepatide Injection — High (B12) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Tirzepatide + Vitamin B12 | from $169 | Website currently sells Tirzepatide (as +B6). Architecture proposes dose-group + additive products; TIR tiers now owner-approved. | NO | Tirzepatide + B6 Injection (single product; strengths 2.5/7.5/12.5/15mg — not matching SELECTED 5–30 ladder) | NEW_REQUIRED | REVIEW — same as SEM: intended LIVE replacement set, but not currently launched as named products |
| 13 | Tirzepatide Injection — Any Dose (B12) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Tirzepatide + Vitamin B12 | from $119 | Website currently sells Tirzepatide (as +B6). Architecture proposes dose-group + additive products; TIR tiers now owner-approved. | NO | Tirzepatide + B6 Injection (single product; strengths 2.5/7.5/12.5/15mg — not matching SELECTED 5–30 ladder) | NEW_REQUIRED | REVIEW — same as SEM: intended LIVE replacement set, but not currently launched as named products |
| 14 | Tirzepatide Injection — Starting / Low (Glycine) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Tirzepatide + Glycine | from $119 | Website currently sells Tirzepatide (as +B6). Architecture proposes dose-group + additive products; TIR tiers now owner-approved. | NO | Tirzepatide + B6 Injection (single product; strengths 2.5/7.5/12.5/15mg — not matching SELECTED 5–30 ladder) | NEW_REQUIRED | REVIEW — same as SEM: intended LIVE replacement set, but not currently launched as named products |
| 15 | Tirzepatide Injection — Mid (Glycine) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Tirzepatide + Glycine | from $149 | Website currently sells Tirzepatide (as +B6). Architecture proposes dose-group + additive products; TIR tiers now owner-approved. | NO | Tirzepatide + B6 Injection (single product; strengths 2.5/7.5/12.5/15mg — not matching SELECTED 5–30 ladder) | NEW_REQUIRED | REVIEW — same as SEM: intended LIVE replacement set, but not currently launched as named products |
| 16 | Tirzepatide Injection — High (Glycine) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Tirzepatide + Glycine | from $169 | Website currently sells Tirzepatide (as +B6). Architecture proposes dose-group + additive products; TIR tiers now owner-approved. | NO | Tirzepatide + B6 Injection (single product; strengths 2.5/7.5/12.5/15mg — not matching SELECTED 5–30 ladder) | NEW_REQUIRED | REVIEW — same as SEM: intended LIVE replacement set, but not currently launched as named products |
| 17 | Tirzepatide Injection — Any Dose (Glycine) **POSSIBLE_FALSE_LIVE** | WEIGHT MANAGEMENT | Injection / Vial | Tirzepatide + Glycine | from $119 | Website currently sells Tirzepatide (as +B6). Architecture proposes dose-group + additive products; TIR tiers now owner-approved. | NO | Tirzepatide + B6 Injection (single product; strengths 2.5/7.5/12.5/15mg — not matching SELECTED 5–30 ladder) | NEW_REQUIRED | REVIEW — same as SEM: intended LIVE replacement set, but not currently launched as named products |
| 18 | TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP | WEIGHT MANAGEMENT | Membership | B12 ladder OR Glycine ladder (explicit selection) | $275/mo | Website already offers Tirzepatide Membership (active + visible), but at $249 vs owner-approved $275. | YES | Tirzepatide Membership ($249/mo; includes Tirzepatide + B6 through 15mg) | REUSE_REPAIR | KEEP one website membership offer; MEMBERSHIP PRICE UPDATE $249→$275 later; B6 copy later |
| 19 | Estradiol Patch | WOMEN'S HORMONE THERAPY | Patch | Estradiol transdermal patch ladder | from $119 | Website active product: Estradiol Patch. | YES | Estradiol Patch ($129–$149) | REUSE_RENAME | KEEP name; REPRICE to architecture $X9 ladder when executing website update |
| 20 | Custom HRT Cream **POSSIBLE_FALSE_LIVE** | WOMEN'S HORMONE THERAPY | Cream | Customizable HRT cream (1–4 ingredients) | from $69 | Mapped from website Testosterone Cream / HRT cream family — but architecture product is broader Custom HRT Cream. | NO | Closest website: Testosterone Cream ($79, 5mg/g) — not labeled Custom HRT Cream | REUSE_RENAME | REVIEW — either FUTURE HIDDEN Custom HRT Cream + keep Testosterone Cream as its own LIVE product, or RENAME website cream into custom HRT later |
| 21 | Progesterone Capsules (Immediate Release) | WOMEN'S HORMONE THERAPY | Capsule | Progesterone IR oral capsules | $29 | Website active product: Progesterone Capsules (100mg/200mg). | YES | Progesterone Capsules ($39 / $59) | REUSE_RENAME | RENAME to clarify IR if needed; REPRICE; keep LIVE |
| 22 | NAD+ Injection | LONGEVITY & COGNITIVE HEALTH | Injection | NAD+ 200mg/ml injectable | $139 | Website active product: NAD+ Injection. | YES | NAD+ Injection ($199 / $229; 100mg/mL 5mL & 10mL) — formulary row is different (200mg/ml 5ml vial) | REUSE_REPAIR | KEEP name; REPRICE / STRUCTURE CHANGE when pairing exact SELECTED vial |
| 23 | BPC-157 / TB-500 / GHK-Cu Injection **POSSIBLE_FALSE_LIVE** | RECOVERY & PERFORMANCE | Injection | BPC-157/TB-500/GHK-CU 3/3/10MG/ML | $159 | Recovery family is on website (Wolverine), and GEN 2A has this blend — but website product is not specifically GHK triple. | NO | Closest: Wolverine: BPC-157/TB-500 (Capsule $99 / Injection $199) — not GHK-Cu triple | REUSE_REPAIR | REVIEW — likely FUTURE HIDDEN until website offers this exact blend; do not treat as currently launched |
| 24 | BPC-157 / TB-500 Injection | RECOVERY & PERFORMANCE | Injection | BPC-157/TB500 3mg/3mg/mL | $159 | Website Wolverine includes Injection variant. | YES | Wolverine: BPC-157/TB-500 — Injection variant ($199) | REUSE_RENAME | STRUCTURE CHANGE — website is one product with 2 forms; architecture splits capsule vs injection (+ separate blends) |
| 25 | BPC-157 / TB-500 Capsules | RECOVERY & PERFORMANCE | Capsule | BPC-157/TB500 500mcg/500mcg capsules | $29 | Website Wolverine includes Capsule variant. | YES | Wolverine: BPC-157/TB-500 — Capsule variant ($99) | REUSE_RENAME | STRUCTURE CHANGE + REPRICE ($99 website vs $29 architecture starting) |
| 26 | Tretinoin Cream | PRESCRIPTION SKIN & HAIR | Cream | Tretinoin cream (± hyaluronic/niacinamide combo) | from $79 | Website active product: Tretinoin Cream. | YES | Tretinoin Cream ($79 / $89 / $109) | REUSE_RENAME | KEEP; confirm strengths vs SELECTED (0.15% and combo) — may need STRUCTURE CHANGE |
| 27 | Minoxidil Solution **POSSIBLE_FALSE_LIVE** | PRESCRIPTION SKIN & HAIR | Solution | Minoxidil 2% solution | $29 | Website has a minoxidil topical product — but it is a Combination Formula at $129, not plain 2% solution. | NO | Closest: Minoxidil Combination Topical Formula ($129) | REUSE_RENAME | REVIEW — likely FUTURE or map website combo to Finasteride/Minoxidil FUTURE products instead |

**POSSIBLE_FALSE_LIVE count:** 19 of 27

### Why these were flagged

These products were marked LIVE because a related website family exists (or a GEN write exists), **not** because the exact patient-facing product is already launched on the storefront:

- **Semaglutide Injection — Starting / Low (B12)** — Not a current website-named product. LIVE was inferred from website Semaglutide family presence, not from an existing storefront SKU for this dose-group/additive.
- **Semaglutide Injection — Mid (B12)** — Not a current website-named product. LIVE was inferred from website Semaglutide family presence, not from an existing storefront SKU for this dose-group/additive.
- **Semaglutide Injection — High (B12)** — Not a current website-named product. LIVE was inferred from website Semaglutide family presence, not from an existing storefront SKU for this dose-group/additive.
- **Semaglutide Injection — Any Dose (B12)** — Not a current website-named product. LIVE was inferred from website Semaglutide family presence, not from an existing storefront SKU for this dose-group/additive.
- **Semaglutide Injection — Starting / Low (Glycine)** — Not a current website-named product. LIVE was inferred from website Semaglutide family presence, not from an existing storefront SKU for this dose-group/additive.
- **Semaglutide Injection — Mid (Glycine)** — Not a current website-named product. LIVE was inferred from website Semaglutide family presence, not from an existing storefront SKU for this dose-group/additive.
- **Semaglutide Injection — High (Glycine)** — Not a current website-named product. LIVE was inferred from website Semaglutide family presence, not from an existing storefront SKU for this dose-group/additive.
- **Semaglutide Injection — Any Dose (Glycine)** — Not a current website-named product. LIVE was inferred from website Semaglutide family presence, not from an existing storefront SKU for this dose-group/additive.
- **Tirzepatide Injection — Starting / Low (B12)** — Not a current website-named product. LIVE inferred from website Tirzepatide family presence.
- **Tirzepatide Injection — Mid (B12)** — Not a current website-named product. LIVE inferred from website Tirzepatide family presence.
- **Tirzepatide Injection — High (B12)** — Not a current website-named product. LIVE inferred from website Tirzepatide family presence.
- **Tirzepatide Injection — Any Dose (B12)** — Not a current website-named product. LIVE inferred from website Tirzepatide family presence.
- **Tirzepatide Injection — Starting / Low (Glycine)** — Not a current website-named product. LIVE inferred from website Tirzepatide family presence.
- **Tirzepatide Injection — Mid (Glycine)** — Not a current website-named product. LIVE inferred from website Tirzepatide family presence.
- **Tirzepatide Injection — High (Glycine)** — Not a current website-named product. LIVE inferred from website Tirzepatide family presence.
- **Tirzepatide Injection — Any Dose (Glycine)** — Not a current website-named product. LIVE inferred from website Tirzepatide family presence.
- **Custom HRT Cream** — Website does not sell “Custom HRT Cream”; it sells Testosterone Cream. LIVE classification over-broadened a formulary cream family.
- **BPC-157 / TB-500 / GHK-Cu Injection** — Exact BPC/TB/GHK blend is not a current website product. LIVE over-attributed from recovery category presence / GEN 2A write.
- **Minoxidil Solution** — Plain Minoxidil 2% Solution is not what the website currently sells.

---

## Table 2 — Current website → new architecture

Starts from what patients can buy today (15 medication products + 2 active memberships).

| CURRENT WEBSITE PRODUCT | CURRENT PRICE | CURRENT FORMULATION | MATCHING NEW ARCHITECTURE PRODUCT | ACTION |
|---|---|---|---|---|
| Semaglutide + B6 Injection | $119–$329 (0.5/1/2.5/5mg) | Semaglutide + B6 | Semaglutide Injection — Starting/Low, Mid, High, Any Dose (B12) AND (Glycine) — 8 products | **REPLACE B6 WITH B12/GLYCINE** |
| Tirzepatide + B6 Injection | $189–$429 (2.5/7.5/12.5/15mg) | Tirzepatide + B6 | Tirzepatide Injection — Starting/Low, Mid, High, Any Dose (B12) AND (Glycine) — 8 products (tiers APPROVED) | **REPLACE B6 WITH B12/GLYCINE** |
| Semaglutide Membership | $149/mo | Includes Semaglutide + B6 | SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP ($149) | **KEEP** |
| Tirzepatide Membership | $249/mo | Includes Tirzepatide + B6 through 15mg | TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP ($275) | **MEMBERSHIP PRICE UPDATE** |
| Fat Burner | $259 | AOD-9604 + MOTS-C + Tesamorelin 5mL | No exact SELECTED match (closest FUTURE: MOTS-c / Tesamorelin blend — different) | **REVIEW** |
| Estradiol Patch | $129–$149 | 0.025 / 0.05 / 0.1 mg twice weekly | Estradiol Patch (from $119; includes 0.0375mg/hr row) | **REPRICE** |
| Progesterone Capsules | $39 / $59 | 100mg / 200mg | Progesterone Capsules (Immediate Release) ($29 architecture starting) | **REPRICE** |
| Testosterone Cream | $79 · 5mg/g · 30g | Testosterone cream | Custom HRT Cream (from $69) — imperfect match | **REVIEW** |
| NAD+ Injection | $199 / $229 | 100mg/mL · 500mg (5mL) & 1000mg (10mL) | NAD+ Injection ($139) — SELECTED: 200mg/ml 5ml vial (1000mg) | **REPRICE** |
| Selank Injection | $129 · 5mg/mL · 2mL | Selank injection | Selank Nasal Spray (FUTURE HIDDEN) — form mismatch | **REVIEW** |
| Semax Injection | $129 · 5mg/mL · 2mL | Semax injection | Semax Nasal Spray (FUTURE HIDDEN) — form mismatch | **REVIEW** |
| Selank + Semax Blend Nasal Spray | $169 | 50mcg/50mcg per spray · 10mL | No blend row in SELECTED (separate Semax Nasal + Selank Nasal are FUTURE) | **REVIEW** |
| Tesamorelin Injection | $149 · 10mg / 2mL | Tesamorelin 5mg/mL | No plain Tesamorelin in SELECTED (MOTS-c/Tesamorelin blend is FUTURE) | **REVIEW** |
| Wolverine: BPC-157/TB-500 | Capsule $99 / Injection $199 | BPC-157/TB-500 blend (two forms) | BPC-157 / TB-500 Capsules + BPC-157 / TB-500 Injection (+ separate FUTURE blends) | **STRUCTURE CHANGE** |
| Tretinoin Cream | $79 / $89 / $109 | 0.025% / 0.05% / 0.1% · 20g | Tretinoin Cream (from $79; SELECTED 0.15% + hyaluronic combo) | **REVIEW** |
| Minoxidil Combination Topical Formula | $129 | Combination formula (provider/pharmacy determined) | Not equal to Minoxidil Solution $29; closer to FUTURE Finasteride/Minoxidil topicals | **REVIEW** |
| Lash/Brow Growth Serum | $89 · 0.03% · 2.5mL | Bimatoprost solution | Lash/Brow Growth Serum (Bimatoprost) — FUTURE HIDDEN (source match needed) | **REVIEW** |

### Notes behind the actions

- **Semaglutide + B6 Injection:** Also STRUCTURE CHANGE (one website product → dose-group + additive architecture) + REPRICE to $X9 ladder
- **Tirzepatide + B6 Injection:** Also STRUCTURE CHANGE + REPRICE; strength ladder changes to 5–30mg
- **Semaglutide Membership:** Price already matches. Later copy/fulfillment update for B12/Glycine under one website offer. Backend split OK.
- **Tirzepatide Membership:** $249 → $275. Keep ONE website offer. Later B6→B12/Glycine copy. Backend split OK.
- **Fat Burner:** Website LIVE with no plain SELECTED Fat Burner / AOD triple row. Do not silently map to MOTS-c/Tesamorelin.
- **Estradiol Patch:** KEEP name. SELECTED adds 0.0375 — possible STRUCTURE CHANGE for variants.
- **Progesterone Capsules:** KEEP/RENAME (IR). SR remains FUTURE HIDDEN.
- **Testosterone Cream:** Architecture collapsed customizable HRT cream family; website is testosterone-specific. May need dedicated Testosterone Cream LIVE product.
- **NAD+ Injection:** KEEP name; confirm exact vial match — may also be STRUCTURE CHANGE.
- **Selank Injection:** SELECTED has nasal only. Website injection has no SELECTED injection row.
- **Semax Injection:** SELECTED has nasal only.
- **Selank + Semax Blend Nasal Spray:** Do not invent a blend client product from separate nasal rows.
- **Tesamorelin Injection:** Do not substitute blend for plain Tesamorelin.
- **Wolverine: BPC-157/TB-500:** Split forms; REPRICE; RENAME from Wolverine optional. GHK triple should not be assumed LIVE.
- **Tretinoin Cream:** KEEP name likely; strengths/package differ from SELECTED — confirm before REPRICE.
- **Minoxidil Combination Topical Formula:** Do not silently replace combo with plain 2% solution.
- **Lash/Brow Growth Serum:** Website LIVE but formulary source unmatched. Architecture correctly keeps FUTURE until sourced. Website may stay until then.

### Website action tally

- Current website medication products: **15**
- Current website active memberships: **2**
- Matching / mappable to new architecture (incl. imperfect): **14**
- Requiring B6 replacement: **2**
- Requiring price change (REPRICE or membership price update, or notes call out REPRICE): **8**

By action label:

- KEEP: 1
- MEMBERSHIP PRICE UPDATE: 1
- REPLACE B6 WITH B12/GLYCINE: 2
- REPRICE: 3
- REVIEW: 9
- STRUCTURE CHANGE: 1

Website products with **no clean SELECTED match** (stay REVIEW until you decide): Fat Burner, Selank Injection, Semax Injection, Selank+Semax Blend Nasal, Tesamorelin Injection, Lash/Brow Growth Serum.

---

## FUTURE HIDDEN sanity check (29)

### WEIGHT MANAGEMENT

- Semaglutide Injection — 3-Month (B12)

### WOMEN'S HORMONE THERAPY

- Estradiol Tablet
- Estradiol Cypionate Injection
- Custom Hormone Troche
- Progesterone Capsules (Sustained Release)
- Testosterone Cypionate Injection
- Oxytocin Nasal Spray

### LONGEVITY & COGNITIVE HEALTH

- NAD+ Nasal Spray
- Glutathione Injection
- Semax Nasal Spray
- Selank Nasal Spray
- Thymosin Alpha-1 Injection
- Methylene Blue Capsules
- Dihexa Capsules
- Dihexa / Tesofensine Capsules

### RECOVERY & PERFORMANCE

- BPC-157 / GHK-Cu / KPV / TB-500 Injection
- BPC-157 / KPV / TB-500 Injection

### PRESCRIPTION SKIN & HAIR

- Minoxidil Cream
- Finasteride / Minoxidil Topical
- Finasteride / Minoxidil / Tretinoin Topical
- Lash/Brow Growth Serum (Bimatoprost)

### SEXUAL WELLNESS

- Sildenafil / Testosterone Troche
- PT-141 Injection
- PT-141 (Bremelanotide) Nasal Spray
- Sexual Wellness Compound Capsules
- Scream Cream

### RESEARCH WELLNESS

- GHK-Cu Cream
- MOTS-c Injection
- MOTS-c / Tesamorelin Injection

_Counted FUTURE HIDDEN: 29_

### Explicit confirmations (do not activate)

| Product | Status | Activate? |
|---|---|---|
| PT-141 Nasal Spray (`PT-141 (Bremelanotide) Nasal Spray`) | **FUTURE HIDDEN** | **NO** |
| Scream Cream | **FUTURE HIDDEN** | **NO** |

---

## Reconcile the 56

| Check | Value |
|---|---|
| TOTAL ARCHITECTURE PRODUCTS | 56 |
| PROPOSED LIVE | 27 |
| PROPOSED FUTURE | 29 |
| LIVE + FUTURE | 56 |
| Equals 56? | YES |
| POSSIBLE_FALSE_LIVE | 19 |

No product was classified LIVE solely because a workbook SMART “LIVE WEBSITE” row existed. LIVE was based on intended website catalog presence / replacement intent — and that is exactly why several SEM/TIR dose-group SKUs and a few others are now flagged **POSSIBLE_FALSE_LIVE** for your decision.

---

## FINAL REPORT

- **TOTAL ARCHITECTURE PRODUCTS:** 56
- **PROPOSED LIVE:** 27
- **PROPOSED FUTURE:** 29
- **CURRENT WEBSITE MEDICATION PRODUCTS:** 15
- **CURRENT WEBSITE MATCHING NEW ARCHITECTURE:** 14
- **CURRENT WEBSITE REQUIRING REPLACEMENT:** 2
- **CURRENT WEBSITE REQUIRING PRICE CHANGE:** 8
- **POSSIBLE FALSE LIVE:** 19
- **PT 141 NASAL:** FUTURE HIDDEN
- **SCREAM CREAM:** FUTURE HIDDEN
- **TIR TIERS:** APPROVED
- **SEM MEMBERSHIP:** $149 APPROVED
- **TIR MEMBERSHIP:** $275 APPROVED
- **MEMBERSHIP BACKEND SPLIT:** APPROVED IF REQUIRED BY GEN
- **B6 TO B12 GLYCINE:** APPROVED
- **LIVE FUTURE OWNER APPROVAL:** PENDING
- **GEN MODIFIED:** NO
- **GEN WRITES:** 0
- **WEBSITE MODIFIED:** NO
- **GEN WHOP CUTOVER:** OFF

---

**STOP FOR OWNER REVIEW.**

No GEN execution checklist. No pairing checklist. No GEN-CATALOG-2B.
