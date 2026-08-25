# MBM GEN Pairing — Owner Click-by-Click Guide

**Documentation only. Do not skip ahead. Do not invent medications.**

Work top to bottom in GEN Health. For each task: open the named product → Edit → Formulary / Medication → select exactly what is listed → remove extras → Save → check the boxes.

This guide covers the **15 GEN client products** that already have IDs (23 website variants). It does **not** include FORMULARY_PENDING, FUTURE_HIDDEN, TIR one-time CREATE, NAD r85 CREATE, or Estradiol patch CREATE.

## Direct GEN product URLs (owner-proven)

Authority: `docs/MBM_GEN_OWNER_DIRECT_URL_MAP.md`

GEN product URL pattern (constant prefix across owner-supplied links):

`https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_{CLIENT_PRODUCT_ID}`

**Prefer opening these exact links** for the unresolved locked CPs (do not rely on title search alone):

| Product | Client Product ID | Direct URL |
|---|---|---|
| SEM Mid B12 | `BLf8inX395YNc7WPCD4O` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BLf8inX395YNc7WPCD4O |
| SEM Membership $149 | `5F8jESeVeXcpkLU5rrdK` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5F8jESeVeXcpkLU5rrdK |
| TIR Membership $275 | `E3MXZeeR01QROCuTLRLE` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_E3MXZeeR01QROCuTLRLE |
| Wolverine Capsule | `omhh3NabouO8AsNR5tkD` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_omhh3NabouO8AsNR5tkD |
| Minoxidil Dual Combo | `BboYS4a2Uj7APetrFo6W` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BboYS4a2Uj7APetrFo6W |
| Wolverine Injection | `iJtyig611AZEDBGdvRd9` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_iJtyig611AZEDBGdvRd9 |
| Progesterone IR | `5dGkjdpLP7DkKKE2iVxh` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5dGkjdpLP7DkKKE2iVxh |

**Do NOT use for membership:** `SvFDJ7W4nmWL2bkLUMMS` (GLP-2 Tirzepatide Any Dose **$279**) — different product from TIR membership **$275**.

**Do NOT use for Minoxidil Dual Combo:** `489YrehNXRlL77fYPkOn` (GHK-Cu / Minoxidil).

## Before you start

1. Open GEN Health admin for My Bare Method — prefer the **direct product URLs** above for locked fixes.
2. Have this guide open next to GEN.
3. Prefer searching by the **exact product display name** below only if the direct URL is unavailable.
4. When picking formulary meds, match **pharmacy + strength + form + package** to the SELECTED FORMULARY text (not “close enough”). Under amended pairing policy, multiple compatible same-family strengths may remain.
5. If anything does not match: check **DOES NOT MATCH — STOP** and message the team. Do not guess.

## Out of scope (do not pair in this session)

### 🚫 NAD+ Nasal r85 ($109)

- **Status:** `STOP_NEEDS_RECONCILIATION_OR_CREATE`
- **Why:** No GEN clientProductId yet (CREATE pending). Do not pair onto r84 CP FVwkzvQqWIZRNAwbslGw.
- **Needed:** Create separate GEN CP for r85, then re-run pairing guide for that CP only.

### 🚫 NAD+ Injection 100mg/mL (website 5mL/10mL)

- **Status:** `STOP_DO_NOT_PAIR`
- **Why:** FORMULARY_PENDING — no authorized SELECTED FORMULARY sourcing for website 100mg/mL. Do not substitute r83 200mg/mL.
- **Needed:** Owner formulary resolution for 100mg/mL injection before any GEN pairing.

### 🚫 Tirzepatide one-time B12/Glycine dose groups (8 variants)

- **Status:** `STOP_DO_NOT_PAIR`
- **Why:** GEN CPs not created yet (CREATE). Not among the 15 checklist CPs.
- **Needed:** Create 8 one-time TIR CPs per write manifest, then new click tasks.

### 🚫 Estradiol patches r26–r29

- **Status:** `STOP_DO_NOT_PAIR`
- **Why:** CREATE ×4 pending. Do not reuse vaginal Estradiol CP o7dNtf9QsnEqPCrLr2tR.
- **Needed:** Create four patch CPs, then pairing guide for each strength.

---

## TASK 1 OF 15

**WEBSITE PRODUCT:** Semaglutide

**WEBSITE OPTION:** One-time · Formulation: Vitamin B12 · Dose: Starting / Low

**IN GEN, OPEN:** Semaglutide Injection — Starting / Low (B12)

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y`

**EXPECTED CUSTOMER PRICE:** $89–99 (band; confirm GEN customer price aligns with architecture)

**THEN CLICK:**

```
Products
→ Semaglutide Injection — Starting / Low (B12)
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **1mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r3**

2. **SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **2mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r5**

**EXPECTED FINAL PAIRINGS:** 2

**REMOVE:**

Remove any attached medication that is NOT exactly one of the SELECT rows below (wrong strength, Glycine, B6, Greenwich, or 3-PACK). Last audit showed 1 Dirx-Hub “Semaglutide + Vitamin B12” already attached — open it and keep ONLY if strength is 1mg/0.5mg/mL or 2mg/0.5mg/mL 1mL vial; otherwise remove and re-add the correct rows.

**DO NOT SELECT:**

- Any SEMAGLUTIDE + GLYCINE row (wrong additive for this CP)
- Any Semaglutide + B6 / Vitamin B6
- SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS) — 3-PACK row 12
- Greenwich Pharmacy Semaglutide + B12
- Tirzepatide medications

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 2 OF 15

**WEBSITE PRODUCT:** Semaglutide

**WEBSITE OPTION:** One-time · Formulation: Vitamin B12 · Dose: Mid

**IN GEN, OPEN:** Semaglutide Injection — Mid (B12)

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BLf8inX395YNc7WPCD4O`

**EXPECTED CUSTOMER PRICE:** $109

**THEN CLICK:**

```
Products
→ Semaglutide Injection — Mid (B12)
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **4mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r7**

**EXPECTED FINAL PAIRINGS:** 1

**REMOVE:**

NONE (if the product is still empty — then only add the SELECT list).

NONE currently attached per last live audit — if GEN now shows any pairing that is not row 7, remove it.

**DO NOT SELECT:**

- Glycine Semaglutide rows
- B6
- 1mg / 2mg / 6mg / 10mg B12 vials (wrong dose group)
- 3-PACK row 12
- Greenwich Semaglutide + B12

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 3 OF 15

**WEBSITE PRODUCT:** Semaglutide

**WEBSITE OPTION:** One-time · Formulation: Vitamin B12 · Dose: High

**IN GEN, OPEN:** Semaglutide Injection — High (B12)

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_34I2X8MpVZf3AQTff3bo`

**EXPECTED CUSTOMER PRICE:** $109–119

**THEN CLICK:**

```
Products
→ Semaglutide Injection — High (B12)
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **6mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r9**

2. **SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **10mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r11**

**EXPECTED FINAL PAIRINGS:** 2

**REMOVE:**

Last audit: 1 Dirx-Hub “Semaglutide + Vitamin B12” attached — keep ONLY if it is 6mg or 10mg /0.5mg/mL 1mL; remove otherwise. Final set must be exactly the two SELECT rows.

**DO NOT SELECT:**

- Glycine rows
- B6
- 3-PACK row 12
- Greenwich Semaglutide + B12
- Starting/Low or Mid strengths only without both High vials

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 4 OF 15

**WEBSITE PRODUCT:** Semaglutide

**WEBSITE OPTION:** One-time · Formulation: Vitamin B12 · Dose: Any Dose

**IN GEN, OPEN:** Semaglutide Injection — Any Dose (B12)

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MkDIUw0NcJB7YL2pNzYW`

**EXPECTED CUSTOMER PRICE:** $89–119

**THEN CLICK:**

```
Products
→ Semaglutide Injection — Any Dose (B12)
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **1mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r3**

2. **SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **2mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r5**

3. **SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **4mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r7**

4. **SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **6mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r9**

5. **SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **10mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r11**

**EXPECTED FINAL PAIRINGS:** 5

**REMOVE:**

- Semaglutide + B12 (Greenwich Pharmacy) _(medicationId `BmyTz7FPA4wUuojkq2Hy` · Greenwich Pharmacy)_
- Semaglutide + B12 (Greenwich Pharmacy) _(medicationId `Twz0VeW8olCbbL1UAuQr` · Greenwich Pharmacy)_
- Semaglutide + B12 (Greenwich Pharmacy) _(medicationId `lPPKidpoLhkYCSV1sLse` · Greenwich Pharmacy)_
- Semaglutide + B12 (Greenwich Pharmacy) _(medicationId `pBAQDkpmfv9FIcpoqhxa` · Greenwich Pharmacy)_
- Semaglutide + B12 (Greenwich Pharmacy) _(medicationId `vCNPRlelLVcJmimIT7Wy` · Greenwich Pharmacy)_

REMOVE all five Greenwich Pharmacy “Semaglutide + B12” attachments (documented live). Then ensure exactly the five Dirx-Hub SELECT rows remain (add missing strengths; remove Dirx attachments that are not 1/2/4/6/10 mg B12 1mL vials).

**DO NOT SELECT:**

- Glycine Semaglutide
- B6
- 3-PACK row 12
- ALL Greenwich Pharmacy “Semaglutide + B12” medications

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 5 OF 15

**WEBSITE PRODUCT:** Semaglutide

**WEBSITE OPTION:** One-time · Formulation: Glycine · Dose: Starting / Low

**IN GEN, OPEN:** Semaglutide Injection — Starting / Low (Glycine)

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_tk2GW39OGr7JX4MCCoJP`

**EXPECTED CUSTOMER PRICE:** $89–99

**THEN CLICK:**

```
Products
→ Semaglutide Injection — Starting / Low (Glycine)
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **1mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r2**

2. **SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **2mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r4**

**EXPECTED FINAL PAIRINGS:** 2

**REMOVE:**

Last audit: 1 Dirx-Hub “Semaglutide + Glycine” — keep only if 1mg or 2mg /0.5mg/mL 1mL; add the missing strength; remove anything else.

**DO NOT SELECT:**

- Vitamin B12 Semaglutide
- B6
- 3-PACK
- Greenwich
- Mid/High Glycine only

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 6 OF 15

**WEBSITE PRODUCT:** Semaglutide

**WEBSITE OPTION:** One-time · Formulation: Glycine · Dose: Mid

**IN GEN, OPEN:** Semaglutide Injection — Mid (Glycine)

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_CjqOUbPuGPZzxephqRou`

**EXPECTED CUSTOMER PRICE:** $109

**THEN CLICK:**

```
Products
→ Semaglutide Injection — Mid (Glycine)
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **4mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r6**

**EXPECTED FINAL PAIRINGS:** 1

**REMOVE:**

Last audit: TWO Dirx-Hub “Semaglutide + Glycine” attached — Mid needs ONLY 4mg/0.5mg/mL (row 6). Open each attachment: KEEP the 4mg vial; REMOVE the other.

**DO NOT SELECT:**

- B12 Semaglutide
- B6
- 1mg/2mg/6mg/10mg Glycine (wrong group)
- Greenwich

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 7 OF 15

**WEBSITE PRODUCT:** Semaglutide

**WEBSITE OPTION:** One-time · Formulation: Glycine · Dose: High

**IN GEN, OPEN:** Semaglutide Injection — High (Glycine)

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sssEk3FDY4LFbQYGQsLx`

**EXPECTED CUSTOMER PRICE:** $109–119

**THEN CLICK:**

```
Products
→ Semaglutide Injection — High (Glycine)
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **6mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r8**

2. **SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **10mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r10**

**EXPECTED FINAL PAIRINGS:** 2

**REMOVE:**

Last audit: 1 Dirx Glycine — keep only if 6mg or 10mg; add the missing High strength; remove non-matching.

**DO NOT SELECT:**

- B12
- B6
- 3-PACK
- Greenwich

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 8 OF 15

**WEBSITE PRODUCT:** Semaglutide

**WEBSITE OPTION:** One-time · Formulation: Glycine · Dose: Any Dose

**IN GEN, OPEN:** Semaglutide Injection — Any Dose (Glycine)

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_wQK2JsFnh7oFBf3Lag4n`

**EXPECTED CUSTOMER PRICE:** $89–119

**THEN CLICK:**

```
Products
→ Semaglutide Injection — Any Dose (Glycine)
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **1mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r2**

2. **SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **2mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r4**

3. **SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **4mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r6**

4. **SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **6mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r8**

5. **SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **10mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r10**

**EXPECTED FINAL PAIRINGS:** 5

**REMOVE:**

Last audit: 4 Dirx Glycine attachments — Any Dose needs all five Glycine strengths (1/2/4/6/10). Add missing; remove any non-matching (wrong pharmacy/additive/strength).

**DO NOT SELECT:**

- B12 Semaglutide
- B6
- 3-PACK
- Greenwich

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 9 OF 15

**WEBSITE PRODUCT:** Semaglutide

**WEBSITE OPTION:** Membership · $149/month (single patient card; backend may carry full B12+Glycine ladder)

**IN GEN, OPEN:** SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5F8jESeVeXcpkLU5rrdK`

**EXPECTED CUSTOMER PRICE:** $149

**THEN CLICK:**

```
Products
→ SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **1mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r2**

2. **SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **1mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r3**

3. **SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **2mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r4**

4. **SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **2mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r5**

5. **SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **4mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r6**

6. **SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **4mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r7**

7. **SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **6mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r8**

8. **SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **6mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r9**

9. **SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **10mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r10**

10. **SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **10mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **1mL**
   - Formulary row: **r11**

**EXPECTED FINAL PAIRINGS:** 10

**REMOVE:**

NONE (if the product is still empty — then only add the SELECT list).

NONE attached per last audit. Add all 10 Dirx-Hub SELECT rows (full B12 + Glycine ladders). If GEN UI refuses mixing B12 and Glycine on one membership product: check DOES NOT MATCH — STOP and request membership CP split (do not invent a workaround).

**DO NOT SELECT:**

- B6
- 3-PACK row 12
- Greenwich Semaglutide
- Tirzepatide rows
- Tirzepatide/B12/Glycine combo products

**Note:** Architecture allows backend B12/Glycine split if GEN requires separate membership CPs.

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 10 OF 15

**WEBSITE PRODUCT:** Tirzepatide

**WEBSITE OPTION:** Membership · $275/month (single patient card; backend full B12+Glycine ladder r13–r24)

**IN GEN, OPEN:** TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_E3MXZeeR01QROCuTLRLE`

**EXPECTED CUSTOMER PRICE:** $275

**THEN CLICK:**

```
Products
→ TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **5mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r13**

2. **TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **5mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r14**

3. **TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **10mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r15**

4. **TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **10mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r16**

5. **TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **15mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r17**

6. **TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **15mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r18**

7. **TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **20mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r19**

8. **TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **20mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r20**

9. **TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **25mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r21**

10. **TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **25mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r22**

11. **TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **30mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r23**

12. **TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL)**
   - Pharmacy: **Dirx-Hub**
   - Strength: **30mg/0.5mg/mL**
   - Form: **Vial**
   - Package: **2mL**
   - Formulary row: **r24**

**EXPECTED FINAL PAIRINGS:** 12

**REMOVE:**

NONE (if the product is still empty — then only add the SELECT list).

NONE attached per last audit. Add all 12 Dirx-Hub SELECT rows (Glycine + B12 for 5/10/15/20/25/30 mg · 2mL). If GEN refuses mixing additives: DOES NOT MATCH — STOP for membership CP split.

**DO NOT SELECT:**

- Tirzepatide/B12/Glycine combined single-med products (ambiguous)
- Tirzepatide/Glycine/B12 ambiguous products
- Legacy B6
- 3-PACK TIR rows if present
- GLP-2 plans
- Semaglutide medications
- One-time TIR dose-group CPs (those are CREATE — not this product)

**Note:** TIR one-time website variants are NOT in this guide (GEN CPs not created yet).

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 11 OF 15

**WEBSITE PRODUCT:** NAD+

**WEBSITE OPTION:** Delivery: Nasal Spray · option r84 (NAD+ 50mg/ml · 15ml)

**IN GEN, OPEN:** NAD + Nasal Spray

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw`

**EXPECTED CUSTOMER PRICE:** $79

**THEN CLICK:**

```
Products
→ NAD + Nasal Spray
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **NAD+ 50mg/ml**
   - Pharmacy: **St Luke**
   - Strength: **50mg/ml**
   - Form: **Nasal Spray**
   - Package: **15ml**
   - Formulary row: **r84**

**EXPECTED FINAL PAIRINGS:** 1

**REMOVE:**

NONE (if the product is still empty — then only add the SELECT list).

NONE attached per last matrix/audit snapshot. If anything other than r84 St Luke NAD+ 50mg/ml Nasal Spray 15ml is attached, remove it.

**DO NOT SELECT:**

- NAD+ 200mg/ml (r85) — separate CREATE CP; do not attach here
- r81 / r82 (excluded FUTURE_HIDDEN — do not activate)
- r83 NAD+ 200mg/ml Injection Solution 5ml — do not substitute for website 100mg/mL injection
- Any NAD+ Injection 100mg/mL (FORMULARY_PENDING — do not invent)
- Any pharmacy other than St Luke for this nasal option

**Note:** NAD+ Injection 100mg/mL and nasal r85 are NOT pairable in this guide.

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 12 OF 15

**WEBSITE PRODUCT:** Wolverine / BPC-TB

**WEBSITE OPTION:** Delivery: Capsule

**IN GEN, OPEN:** Wolverine – BPC-157 + TB-500 Recovery Protocol

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_omhh3NabouO8AsNR5tkD`

**EXPECTED CUSTOMER PRICE:** $29

**THEN CLICK:**

```
Products
→ Wolverine – BPC-157 + TB-500 Recovery Protocol
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **BPC-157/TB500 capsules 500MCG/500MCG**
   - Pharmacy: **Greenwich Pharmacy**
   - Strength: **500mcg/500mcg**
   - Form: **(see GEN picker — SELECTED FORMULARY Form blank)**
   - Package: **1EA**
   - Formulary row: **r104**

**EXPECTED FINAL PAIRINGS:** 1

**REMOVE:**

NONE (if the product is still empty — then only add the SELECT list).

NONE attached per last audit. Attach only row 104 capsule. Do not cross-pair injection.

**DO NOT SELECT:**

- BPC-157/TB500 3mg/3mg/mL injection (row 103) — wrong form; use injection CP instead
- BPC-157/TB-500/GHK-Cu blend
- Any non-Greenwich Pharmacy BPC/TB capsule

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 13 OF 15

**WEBSITE PRODUCT:** Wolverine / BPC-TB

**WEBSITE OPTION:** Delivery: Injection

**IN GEN, OPEN:** BPC-157/TB500

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_iJtyig611AZEDBGdvRd9`

**EXPECTED CUSTOMER PRICE:** $159

**THEN CLICK:**

```
Products
→ BPC-157/TB500
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **BPC-157/TB500 3mg/3mg/mL**
   - Pharmacy: **Greenwich Pharmacy**
   - Strength: **3mg/3mg/mL**
   - Form: **(see GEN picker — SELECTED FORMULARY Form blank)**
   - Package: **5ML**
   - Formulary row: **r103**

**EXPECTED FINAL PAIRINGS:** 1

**REMOVE:**

Last audit: “BPC-157 / TB500” @ Greenwich Pharmacy already attached (medId 27WtrIdo3z4Ssj5sDcc6). KEEP only if GEN UI shows strength 3mg/3mg/mL and package 5ML matching row 103. If it is a GHK-Cu blend or wrong strength/package: REMOVE and attach the exact row 103 medication.

**DO NOT SELECT:**

- BPC-157/TB500 capsules 500MCG/500MCG (row 104)
- BPC-157/TB-500/GHK-Cu 3/3/10 mg/mL (wrong blend product)
- Any GHK-Cu / KPV advanced blend

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 14 OF 15

**WEBSITE PRODUCT:** Minoxidil

**WEBSITE OPTION:** Locked formula: Finasteride/Minoxidil 0.1%/5%

**IN GEN, OPEN:** Hair Loss – Dual Combo (Finasteride/Minoxidil)

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BboYS4a2Uj7APetrFo6W`

**EXPECTED CUSTOMER PRICE:** $79

**THEN CLICK:**

```
Products
→ Hair Loss – Dual Combo (Finasteride/Minoxidil)
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 %**
   - Pharmacy: **Vios**
   - Strength: **0.1/5 %**
   - Form: **Foam**
   - Package: **1 ml**
   - Formulary row: **r129**

**EXPECTED FINAL PAIRINGS:** 1

**REMOVE:**

NONE (if the product is still empty — then only add the SELECT list).

NONE attached per last audit. Attach only Vios FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 % Foam 1 ml (row 129).

**DO NOT SELECT:**

- GHK-Cu / Minoxidil Topical Combo (different GEN product — do not pair here)
- Minoxidil solution / cream / Fin+Minox+Tret FUTURE_HIDDEN variants
- Any pharmacy other than Vios for this locked formula

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## TASK 15 OF 15

**WEBSITE PRODUCT:** Progesterone

**WEBSITE OPTION:** All authorized IR capsule strengths (one GEN CP)

**IN GEN, OPEN:** Women's Hormones (HRT) – Progesterone

**GEN CLIENT PRODUCT ID:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5dGkjdpLP7DkKKE2iVxh`

**EXPECTED CUSTOMER PRICE:** $29

**THEN CLICK:**

```
Products
→ Women's Hormones (HRT) – Progesterone
→ Edit
→ Formulary / Medication
```

**SELECT EXACTLY:**

1. **PROGESTERONE 100MG CAPSULE 100mg**
   - Pharmacy: **Vios**
   - Strength: **100mg**
   - Form: **Capsule**
   - Package: **1 mg**
   - Formulary row: **r41**

2. **PROGESTERONE 200MG CAPSULE 200mg**
   - Pharmacy: **Vios**
   - Strength: **200mg**
   - Form: **Capsule**
   - Package: **1 mg**
   - Formulary row: **r42**

3. **PROGESTERONE 50MG CAPSULE 50mg**
   - Pharmacy: **Vios**
   - Strength: **50mg**
   - Form: **Capsule**
   - Package: **1 mg**
   - Formulary row: **r43**

4. **PROGESTERONE IR 100 MG**
   - Pharmacy: **Vios**
   - Strength: **100 MG**
   - Form: **Capsule**
   - Package: **1 each**
   - Formulary row: **r44**

5. **PROGESTERONE IR 150 MG**
   - Pharmacy: **Vios**
   - Strength: **150 MG**
   - Form: **Capsule**
   - Package: **1 each**
   - Formulary row: **r45**

6. **PROGESTERONE IR 200 MG**
   - Pharmacy: **Vios**
   - Strength: **200 MG**
   - Form: **Capsule**
   - Package: **1 each**
   - Formulary row: **r46**

7. **PROGESTERONE IR (DYE-FREE)(LACTOSE-FREE) (M NEW) 200MG**
   - Pharmacy: **Vios**
   - Strength: **200MG**
   - Form: **Capsule**
   - Package: **1 each**
   - Formulary row: **r47**

8. **PROGESTERONE IR 300 MG**
   - Pharmacy: **Vios**
   - Strength: **300 MG**
   - Form: **Capsule**
   - Package: **1 each**
   - Formulary row: **r48**

9. **PROGESTERONE IR 400 MG**
   - Pharmacy: **Vios**
   - Strength: **400 MG**
   - Form: **Capsule**
   - Package: **1 each**
   - Formulary row: **r49**

**EXPECTED FINAL PAIRINGS:** 9

**REMOVE:**

NONE (if the product is still empty — then only add the SELECT list).

NONE attached per last audit. Attach all nine Vios IR SELECT rows. Remove any SR or non-Vios progesterone if present.

**DO NOT SELECT:**

- PROGESTERONE SR rows (r50–r52) — FUTURE_HIDDEN / different pharmacy
- Estradiol patch or vaginal medications
- Vaginal Estradiol CP o7dNtf9QsnEqPCrLr2tR (wrong product family)

**Note:** Estradiol patches are NOT in this 15-CP set (CREATE pending — do not reuse vaginal CP).

**FINAL CHECK:**

- [ ] Product name matches
- [ ] Price matches
- [ ] Correct pharmacy
- [ ] Correct formulation
- [ ] Correct strength(s)
- [ ] Correct package(s)
- [ ] No extra medication pairings
- [ ] SAVED IN GEN

**OWNER RESULT:**

- [ ] VERIFIED EXACT
- [ ] DOES NOT MATCH — STOP

---

## Final report

```
GEN_CPS_EXPECTED: 15
GEN_CPS_REVALIDATED: 15
GEN_CPS_SAFE_FOR_OWNER_PAIRING: 15
GEN_CPS_STOPPED_FOR_RECONCILIATION: 0
WEBSITE_VARIANTS_COVERED: 23
EXACT_FORMULARY_SELECTIONS_DOCUMENTED: 55
EXACT_REMOVALS_DOCUMENTED: 5
CONDITIONAL_REMOVAL_GUIDANCE_TASKS: 8
FORMULARY_PENDING_INCLUDED: 0
FUTURE_HIDDEN_ACTIVATED: 0
LEGACY_B6_USED: 0
INVENTED_MATCHES: 0
GEN_MODIFIED: NO
PAIRINGS_MODIFIED: NO
WEBSITE_MODIFIED: NO
genPairingVerified_TRUE: 0
REAL_GEN_ORDERS: OFF
WEBSITE_CUTOVER: OFF
GEN_WHOP_CUTOVER: OFF
PR_19: KEEP OPEN / DO NOT MERGE
```

**STOP FOR OWNER MANUAL PAIRING.**

Do not merge PR #19. Do not set `genPairingVerified=true`. Do not enable cutover or real GEN orders.
