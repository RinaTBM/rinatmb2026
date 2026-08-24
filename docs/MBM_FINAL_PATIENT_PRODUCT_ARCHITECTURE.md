# My Bare Method — Final Patient-Facing Product Architecture

**Generated:** 2026-08-24T18:06:19Z · **Owner-review-2 update:** 2026-08-24T21:12:57Z  
**Phase:** GEN-CATALOG-ARCHITECTURE-LOCK + MBM-ARCHITECTURE-OWNER-REVIEW-2  
**Mode:** READ-ONLY planning — **no GEN writes, no website writes, no pairing checklist, GEN/Whop cutover OFF**  
**Authority:** SELECTED FORMULARY for exact medications · Owner rules for SEM/TIR dose groups & memberships  

### Owner decisions (locked this review)

| Item | Status |
|---|---|
| TIR tiers 5+10 / 15+20 / 25+30 / Any Dose (B12 & Glycine separate) | **APPROVED** |
| SEM membership $149 · one website offer | **APPROVED** |
| TIR membership $275 · one website offer | **APPROVED** |
| Membership backend split if GEN requires | **APPROVED IF REQUIRED BY GEN** |
| B6 → B12/Glycine (website not modified yet) | **APPROVED** |
| LIVE/FUTURE map (27 / 29) | **PENDING** — see `docs/MBM_LIVE_VS_FUTURE_OWNER_REVIEW.md` |
| POSSIBLE_FALSE_LIVE flagged | **19** products |

**Stop:** LIVE/FUTURE still needs your approval before execution. **Do not start GEN-CATALOG-2B.**

---

## Owner snapshot (all patient-facing products)

| PATIENT-FACING PRODUCT | LIVE/FUTURE | FORMULATION | FORM | PRICE | FORMULARY ROW COUNT | GEN STATUS |
|---|---|---|---|---|---:|---|
| Semaglutide Injection — Starting / Low (B12) | LIVE NOW | Semaglutide + Vitamin B12 | Injection / Vial | from $89 | 2 | REUSE_REPAIR (`SkqQHmsc0WdsbK9vmV1y`) |
| Semaglutide Injection — Mid (B12) | LIVE NOW | Semaglutide + Vitamin B12 | Injection / Vial | $109 | 1 | REUSE_REPAIR (`BLf8inX395YNc7WPCD4O`) |
| Semaglutide Injection — High (B12) | LIVE NOW | Semaglutide + Vitamin B12 | Injection / Vial | from $109 | 2 | REUSE_REPAIR (`34I2X8MpVZf3AQTff3bo`) |
| Semaglutide Injection — Any Dose (B12) | LIVE NOW | Semaglutide + Vitamin B12 | Injection / Vial | from $89 | 5 | REUSE_REPAIR (`MkDIUw0NcJB7YL2pNzYW`) |
| Semaglutide Injection — Starting / Low (Glycine) | LIVE NOW | Semaglutide + Glycine | Injection / Vial | from $89 | 2 | REUSE_REPAIR (`tk2GW39OGr7JX4MCCoJP`) |
| Semaglutide Injection — Mid (Glycine) | LIVE NOW | Semaglutide + Glycine | Injection / Vial | $109 | 1 | REUSE_REPAIR (`CjqOUbPuGPZzxephqRou`) |
| Semaglutide Injection — High (Glycine) | LIVE NOW | Semaglutide + Glycine | Injection / Vial | from $109 | 2 | REUSE_REPAIR (`sssEk3FDY4LFbQYGQsLx`) |
| Semaglutide Injection — Any Dose (Glycine) | LIVE NOW | Semaglutide + Glycine | Injection / Vial | from $89 | 5 | REUSE_REPAIR (`wQK2JsFnh7oFBf3Lag4n`) |
| SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP | LIVE NOW | B12 ladder OR Glycine ladder (explicit selection) | Membership | $149/mo | 0 | REUSE_REPAIR (`5F8jESeVeXcpkLU5rrdK`) |
| Semaglutide Injection — 3-Month (B12) | FUTURE HIDDEN | Semaglutide + Vitamin B12 | Injection / Vial | example @4mg → $329 (×3 rule) | 5 | REUSE_REPAIR (`sN2ggSXRJINjElMYTQjf`) |
| Tirzepatide Injection — Starting / Low (B12) | LIVE NOW | Tirzepatide + Vitamin B12 | Injection / Vial | from $119 | 2 | NEW_REQUIRED |
| Tirzepatide Injection — Mid (B12) | LIVE NOW | Tirzepatide + Vitamin B12 | Injection / Vial | from $149 | 2 | NEW_REQUIRED |
| Tirzepatide Injection — High (B12) | LIVE NOW | Tirzepatide + Vitamin B12 | Injection / Vial | from $169 | 2 | NEW_REQUIRED |
| Tirzepatide Injection — Any Dose (B12) | LIVE NOW | Tirzepatide + Vitamin B12 | Injection / Vial | from $119 | 6 | NEW_REQUIRED |
| Tirzepatide Injection — Starting / Low (Glycine) | LIVE NOW | Tirzepatide + Glycine | Injection / Vial | from $119 | 2 | NEW_REQUIRED |
| Tirzepatide Injection — Mid (Glycine) | LIVE NOW | Tirzepatide + Glycine | Injection / Vial | from $149 | 2 | NEW_REQUIRED |
| Tirzepatide Injection — High (Glycine) | LIVE NOW | Tirzepatide + Glycine | Injection / Vial | from $169 | 2 | NEW_REQUIRED |
| Tirzepatide Injection — Any Dose (Glycine) | LIVE NOW | Tirzepatide + Glycine | Injection / Vial | from $119 | 6 | NEW_REQUIRED |
| TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP | LIVE NOW | B12 ladder OR Glycine ladder (explicit selection) | Membership | $275/mo | 0 | REUSE_REPAIR (`E3MXZeeR01QROCuTLRLE`) |
| Estradiol Patch | LIVE NOW | Estradiol transdermal patch ladder | Patch | from $119 | 4 | REUSE_RENAME (`o7dNtf9QsnEqPCrLr2tR`) |
| Estradiol Tablet | FUTURE HIDDEN | Estradiol oral tablet ladder | Tablet | $19 | 3 | REUSE_RENAME (`o7dNtf9QsnEqPCrLr2tR`) |
| Estradiol Cypionate Injection | FUTURE HIDDEN | Estradiol Cypionate (MCT Oil) 10 mg/mL | Injection | $89 | 1 | REUSE_RENAME (`o7dNtf9QsnEqPCrLr2tR`) |
| Custom HRT Cream | LIVE NOW | Customizable HRT cream (1–4 ingredients) | Cream | from $69 | 12 | REUSE_RENAME (`RWtVLDbXlP7rsR31FXmH`) |
| Custom Hormone Troche | FUTURE HIDDEN | Customizable hormone troche (1–3 ingredients) | Troche | $29 | 9 | REUSE_RENAME (`CO68GB2vs5lyfN6awklC`) |
| Progesterone Capsules (Immediate Release) | LIVE NOW | Progesterone IR oral capsules | Capsule | $29 | 9 | REUSE_RENAME (`AVNvVWBE98DfINxyz5Dm`) |
| Progesterone Capsules (Sustained Release) | FUTURE HIDDEN | Progesterone SR oral capsules | Capsule | $19 | 11 | REUSE_RENAME (`AVNvVWBE98DfINxyz5Dm`) |
| Testosterone Cypionate Injection | FUTURE HIDDEN | Testosterone Cypionate injection ladder | Injection | from $59 | 5 | REUSE_RENAME (`KQ9cN6N6tMmBokvGrAtd`) |
| Sildenafil / Testosterone Troche | FUTURE HIDDEN | Sildenafil 120mg / Testosterone 22mg | Troche | $39 | 1 | REUSE_RENAME (`w0Rf0DXmI8ukPgoMtH6g`) |
| NAD+ Injection | LIVE NOW | NAD+ 200mg/ml injectable | Injection | $139 | 1 | REUSE_REPAIR (`SHJpGAACUFEeMONdpEbn`) |
| NAD+ Nasal Spray | FUTURE HIDDEN | NAD+ nasal spray 50mg/ml & 200mg/ml | Nasal Spray | from $79 | 4 | REUSE_RENAME (`FVwkzvQqWIZRNAwbslGw`) |
| Glutathione Injection | FUTURE HIDDEN | Glutathione 200mg/ml (10ml vial) | Injection | from $59 | 2 | REUSE_RENAME (`17H4pVR8uYnwvcBIz8iY`) |
| Semax Nasal Spray | FUTURE HIDDEN | Semax 2.5mg/mL nasal spray | Nasal Spray | $129 | 1 | REUSE_RENAME (`LWkYtwm66dIeLuDSvSfi`) |
| Selank Nasal Spray | FUTURE HIDDEN | Selank 2.5mg/mL nasal spray | Nasal Spray | $129 | 1 | REUSE_RENAME (`m9JetRlC44nTkpQvPKdT`) |
| Thymosin Alpha-1 Injection | FUTURE HIDDEN | Thymosin Alpha-1 3 mg/mL (5 mL) | Injection | $159 | 1 | REUSE_RENAME (`qgn9vCpD8bBN5pXNPKE5`) |
| Methylene Blue Capsules | FUTURE HIDDEN | Methylene Blue oral 5–25 mg | Capsule | $19 | 4 | NEW_REQUIRED |
| Dihexa Capsules | FUTURE HIDDEN | Dihexa 5mg | Capsule | $29 | 1 | REUSE_RENAME (`UIjUhnsOMiWRZFiKXFi7`) |
| Dihexa / Tesofensine Capsules | FUTURE HIDDEN | Dihexa 5mg / Tesofensine 500mcg | Capsule | $29 | 1 | REUSE_RENAME (`UIjUhnsOMiWRZFiKXFi7`) |
| BPC-157 / TB-500 / GHK-Cu Injection | LIVE NOW | BPC-157/TB-500/GHK-CU 3/3/10MG/ML | Injection | $159 | 1 | REUSE_REPAIR (`5iCQzEtTXw90ctEhIhkB`) |
| BPC-157 / GHK-Cu / KPV / TB-500 Injection | FUTURE HIDDEN | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL | Injection | $159 | 1 | REUSE_RENAME (`MXsSZY2GpiCByJUQer1p`) |
| BPC-157 / KPV / TB-500 Injection | FUTURE HIDDEN | BPC-157/KPV/TB500 3mg/3mg/3mg/mL | Injection | $159 | 1 | REUSE_RENAME (`MXsSZY2GpiCByJUQer1p`) |
| BPC-157 / TB-500 Injection | LIVE NOW | BPC-157/TB500 3mg/3mg/mL | Injection | $159 | 1 | REUSE_RENAME (`MXsSZY2GpiCByJUQer1p`) |
| BPC-157 / TB-500 Capsules | LIVE NOW | BPC-157/TB500 500mcg/500mcg capsules | Capsule | $29 | 1 | REUSE_RENAME (`KXMm9SsbOEYnFy9phmZn`) |
| Tretinoin Cream | LIVE NOW | Tretinoin cream (± hyaluronic/niacinamide combo) | Cream | from $79 | 2 | REUSE_RENAME (`EeWMcfCJf5EU2LkNQmp9`) |
| Minoxidil Cream | FUTURE HIDDEN | Minoxidil cream 7–15% | Cream | $89 | 3 | REUSE_RENAME (`489YrehNXRlL77fYPkOn`) |
| Minoxidil Solution | LIVE NOW | Minoxidil 2% solution | Solution | $29 | 1 | REUSE_RENAME (`489YrehNXRlL77fYPkOn`) |
| Finasteride / Minoxidil Topical | FUTURE HIDDEN | Finasteride/Minoxidil topical | Foam / Topical | $79 | 2 | REUSE_RENAME (`BboYS4a2Uj7APetrFo6W`) |
| Finasteride / Minoxidil / Tretinoin Topical | FUTURE HIDDEN | Finasteride/Minoxidil/Tretinoin topical | Foam / Topical | $89 | 3 | REUSE_RENAME (`EeWMcfCJf5EU2LkNQmp9`) |
| PT-141 Injection | FUTURE HIDDEN | PT-141 2mg/mL | Injection | $129 | 1 | REUSE_RENAME (`7a11W067k20AKLSsL2xM`) |
| PT-141 (Bremelanotide) Nasal Spray | FUTURE HIDDEN | Bremelanotide nasal 5 & 10 mg/mL | Nasal Spray | $139 | 2 | REUSE_RENAME (`7a11W067k20AKLSsL2xM`) |
| GHK-Cu Cream | FUTURE HIDDEN | GHK-Cu cream ladder (+ CoQ10 variant) | Cream | from $109 | 7 | REUSE_RENAME (`MXsSZY2GpiCByJUQer1p`) |
| MOTS-c Injection | FUTURE HIDDEN | MOTS-C 2mg/mL | Injection | $129 | 1 | REUSE_RENAME (`7Kix55LA15U0lNvY9QXI`) |
| MOTS-c / Tesamorelin Injection | FUTURE HIDDEN | MOTS-C/Tesamorelin 2mg/3mg/mL | Injection | $159 | 1 | REUSE_RENAME (`7Kix55LA15U0lNvY9QXI`) |
| Oxytocin Nasal Spray | FUTURE HIDDEN | Oxytocin 100 IU/ml | Nasal Spray | TBD | 0 | NEW_REQUIRED |
| Sexual Wellness Compound Capsules | FUTURE HIDDEN | Flibanserin / Oxytocin / Tyrosine | Capsule | TBD | 0 | NEW_REQUIRED |
| Lash/Brow Growth Serum (Bimatoprost) | FUTURE HIDDEN | Bimatoprost — SOURCE MATCH NEEDED | Solution | TBD | 0 | NEW_REQUIRED |
| Scream Cream | FUTURE HIDDEN | TBD — SOURCE MATCH NEEDED | Cream | TBD | 0 | NEW_REQUIRED |

---

## Decisions needed from you before execution

1. ~~Approve or revise TIR tier boundaries~~ **DONE — APPROVED**
2. ~~Acknowledge membership backend split flags~~ **DONE — approved if GEN requires (backend-only)** (`SEM_MEMBERSHIP_STRUCTURE_REQUIRES_SPLIT`, `TIR_MEMBERSHIP_STRUCTURE_REQUIRES_SPLIT`). Website may still show one membership offer.
3. **Confirm LIVE NOW vs FUTURE HIDDEN** rows in the category sections.
4. ~~Confirm B6 replacement~~ **DONE — approved; website not modified yet** — website Semaglutide/Tirzepatide + B6 are legacy vs SELECTED B12/Glycine.
5. **No GEN writes / no website writes / no pairing checklist** until you approve this architecture.

### TIR tier proposal (**APPROVED**)

Approved vial ladder: **5 / 10 / 15 / 20 / 25 / 30 mg** (each as B12 and as Glycine).

| Tier | Proposed vials |
|---|---|
| Starting / Low | 5mg + 10mg |
| Mid | 15mg + 20mg |
| High | 25mg + 30mg |
| Any Dose | full ladder 5 / 10 / 15 / 20 / 25 / 30mg |

**Status:** Owner approved this grouping (not the alternate).

Explicitly **excluded:** Tirzepatide/B12/Glycine · Tirzepatide/Glycine/B12 · 3-PACK cost rows.

### Membership backend

| Membership | Patient-facing price | Backend structure |
|---|---|---|
| SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP | **$149/mo** | **SEM_MEMBERSHIP_STRUCTURE_REQUIRES_SPLIT** |
| TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP | **$275/mo** | **TIR_MEMBERSHIP_STRUCTURE_REQUIRES_SPLIT** |

B12 and Glycine stay distinct underneath. Do not map one to the other without explicit patient/provider formulation selection. No workaround invented.

---

## WEIGHT MANAGEMENT

### Semaglutide Injection — Starting / Low (B12)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Semaglutide + Vitamin B12
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $89
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · Semaglutide Injection — Starting / Low (B12) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y`
- **Formulary rows under it (2):**
  - Row 3: SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) · 1mg/0.5mg/mL · cost $50+5 → $89
  - Row 5: SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) · 2mg/0.5mg/mL · cost $55+5 → $99
- **Note:** Owner-defined dose group. Approved vials: 1mg, 2mg.

### Semaglutide Injection — Mid (B12)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Semaglutide + Vitamin B12
- **Pharmacy:** Dirx-Hub
- **One-time price:** $109
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · Semaglutide Injection — Mid (B12) · `BLf8inX395YNc7WPCD4O`
- **Formulary rows under it (1):**
  - Row 7: SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) · 4mg/0.5mg/mL · cost $58+5 → $109
- **Note:** Owner-defined dose group. Approved vials: 4mg.

### Semaglutide Injection — High (B12)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Semaglutide + Vitamin B12
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $109
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · Semaglutide Injection — High (B12) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_34I2X8MpVZf3AQTff3bo`
- **Formulary rows under it (2):**
  - Row 9: SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) · 6mg/0.5mg/mL · cost $60+5 → $109
  - Row 11: SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) · 10mg/0.5mg/mL · cost $65+5 → $119
- **Note:** Owner-defined dose group. Approved vials: 6mg, 10mg.

### Semaglutide Injection — Any Dose (B12)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Semaglutide + Vitamin B12
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $89
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · Semaglutide Injection — Any Dose (B12) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MkDIUw0NcJB7YL2pNzYW`
- **Formulary rows under it (5):**
  - Row 3: SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) · 1mg/0.5mg/mL · cost $50+5 → $89
  - Row 5: SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) · 2mg/0.5mg/mL · cost $55+5 → $99
  - Row 7: SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) · 4mg/0.5mg/mL · cost $58+5 → $109
  - Row 9: SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) · 6mg/0.5mg/mL · cost $60+5 → $109
  - Row 11: SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) · 10mg/0.5mg/mL · cost $65+5 → $119
- **Note:** Owner-defined dose group. Approved vials: 1mg, 2mg, 4mg, 6mg, 10mg.

### Semaglutide Injection — Starting / Low (Glycine)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Semaglutide + Glycine
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $89
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · Semaglutide Injection — Starting / Low (Glycine) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_tk2GW39OGr7JX4MCCoJP`
- **Formulary rows under it (2):**
  - Row 2: SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) · 1mg/0.5mg/mL · cost $50+5 → $89
  - Row 4: SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) · 2mg/0.5mg/mL · cost $55+5 → $99
- **Note:** Owner-defined dose group. Approved vials: 1mg, 2mg.

### Semaglutide Injection — Mid (Glycine)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Semaglutide + Glycine
- **Pharmacy:** Dirx-Hub
- **One-time price:** $109
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · Semaglutide Injection — Mid (Glycine) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_CjqOUbPuGPZzxephqRou`
- **Formulary rows under it (1):**
  - Row 6: SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) · 4mg/0.5mg/mL · cost $58+5 → $109
- **Note:** Owner-defined dose group. Approved vials: 4mg.

### Semaglutide Injection — High (Glycine)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Semaglutide + Glycine
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $109
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · Semaglutide Injection — High (Glycine) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sssEk3FDY4LFbQYGQsLx`
- **Formulary rows under it (2):**
  - Row 8: SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) · 6mg/0.5mg/mL · cost $60+5 → $109
  - Row 10: SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) · 10mg/0.5mg/mL · cost $65+5 → $119
- **Note:** Owner-defined dose group. Approved vials: 6mg, 10mg.

### Semaglutide Injection — Any Dose (Glycine)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Semaglutide + Glycine
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $89
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · Semaglutide Injection — Any Dose (Glycine) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_wQK2JsFnh7oFBf3Lag4n`
- **Formulary rows under it (5):**
  - Row 2: SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) · 1mg/0.5mg/mL · cost $50+5 → $89
  - Row 4: SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) · 2mg/0.5mg/mL · cost $55+5 → $99
  - Row 6: SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) · 4mg/0.5mg/mL · cost $58+5 → $109
  - Row 8: SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) · 6mg/0.5mg/mL · cost $60+5 → $109
  - Row 10: SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) · 10mg/0.5mg/mL · cost $65+5 → $119
- **Note:** Owner-defined dose group. Approved vials: 1mg, 2mg, 4mg, 6mg, 10mg.

### SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Membership
- **Formulation:** B12 ladder OR Glycine ladder (explicit selection)
- **Pharmacy:** Dirx-Hub
- **One-time price:** $149/mo
- **Membership:** $149/mo · backend `SEM_MEMBERSHIP_STRUCTURE_REQUIRES_SPLIT`
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP · `5F8jESeVeXcpkLU5rrdK`
- **Formulary rows under it (0):**
  - _(none from SELECTED — structural / FUTURE placeholder)_
- **Note:** Owner-defined. Website may show ONE offer; GEN fulfillment likely needs split CPs.

### Semaglutide Injection — 3-Month (B12)

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Injection / Vial
- **Formulation:** Semaglutide + Vitamin B12
- **Pharmacy:** Dirx-Hub
- **One-time price:** example @4mg → $329 (×3 rule)
- **Membership:** —
- **3/6 month:** {'months': 3, 'example_4mg': 329}
- **GEN match:** REUSE_REPAIR · Semaglutide Injection — 3-Month (B12) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sN2ggSXRJINjElMYTQjf`
- **Formulary rows under it (5):**
  - Row 3: SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) · 1mg/0.5mg/mL · cost $50+5 → $89
  - Row 5: SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) · 2mg/0.5mg/mL · cost $55+5 → $99
  - Row 7: SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) · 4mg/0.5mg/mL · cost $58+5 → $109
  - Row 9: SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) · 6mg/0.5mg/mL · cost $60+5 → $109
  - Row 11: SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) · 10mg/0.5mg/mL · cost $65+5 → $119
- **Note:** Separate purchase model. Prep only. showPatient=false.

### Tirzepatide Injection — Starting / Low (B12)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Tirzepatide + Vitamin B12
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $119
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (2):**
  - Row 14: TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) · 5mg/0.5mg/mL · cost $65+5 → $119
  - Row 16: TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) · 10mg/0.5mg/mL · cost $75+5 → $139
- **Note:** PROPOSED tier (awaiting owner approval). Vials: 5mg, 10mg.

### Tirzepatide Injection — Mid (B12)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Tirzepatide + Vitamin B12
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $149
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (2):**
  - Row 18: TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) · 15mg/0.5mg/mL · cost $85+5 → $149
  - Row 20: TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) · 20mg/0.5mg/mL · cost $90+5 → $159
- **Note:** PROPOSED tier (awaiting owner approval). Vials: 15mg, 20mg.

### Tirzepatide Injection — High (B12)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Tirzepatide + Vitamin B12
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $169
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (2):**
  - Row 22: TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) · 25mg/0.5mg/mL · cost $95+5 → $169
  - Row 24: TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) · 30mg/0.5mg/mL · cost $100+5 → $179
- **Note:** PROPOSED tier (awaiting owner approval). Vials: 25mg, 30mg.

### Tirzepatide Injection — Any Dose (B12)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Tirzepatide + Vitamin B12
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $119
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (6):**
  - Row 14: TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) · 5mg/0.5mg/mL · cost $65+5 → $119
  - Row 16: TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) · 10mg/0.5mg/mL · cost $75+5 → $139
  - Row 18: TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) · 15mg/0.5mg/mL · cost $85+5 → $149
  - Row 20: TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) · 20mg/0.5mg/mL · cost $90+5 → $159
  - Row 22: TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) · 25mg/0.5mg/mL · cost $95+5 → $169
  - Row 24: TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) · 30mg/0.5mg/mL · cost $100+5 → $179
- **Note:** PROPOSED tier (awaiting owner approval). Vials: 5mg, 10mg, 15mg, 20mg, 25mg, 30mg.

### Tirzepatide Injection — Starting / Low (Glycine)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Tirzepatide + Glycine
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $119
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (2):**
  - Row 13: TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) · 5mg/0.5mg/mL · cost $65+5 → $119
  - Row 15: TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) · 10mg/0.5mg/mL · cost $75+5 → $139
- **Note:** PROPOSED tier (awaiting owner approval). Vials: 5mg, 10mg.

### Tirzepatide Injection — Mid (Glycine)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Tirzepatide + Glycine
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $149
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (2):**
  - Row 17: TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) · 15mg/0.5mg/mL · cost $85+5 → $149
  - Row 19: TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) · 20mg/0.5mg/mL · cost $90+5 → $159
- **Note:** PROPOSED tier (awaiting owner approval). Vials: 15mg, 20mg.

### Tirzepatide Injection — High (Glycine)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Tirzepatide + Glycine
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $169
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (2):**
  - Row 21: TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) · 25mg/0.5mg/mL · cost $95+5 → $169
  - Row 23: TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) · 30mg/0.5mg/mL · cost $100+5 → $179
- **Note:** PROPOSED tier (awaiting owner approval). Vials: 25mg, 30mg.

### Tirzepatide Injection — Any Dose (Glycine)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection / Vial
- **Formulation:** Tirzepatide + Glycine
- **Pharmacy:** Dirx-Hub
- **One-time price:** from $119
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (6):**
  - Row 13: TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) · 5mg/0.5mg/mL · cost $65+5 → $119
  - Row 15: TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) · 10mg/0.5mg/mL · cost $75+5 → $139
  - Row 17: TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) · 15mg/0.5mg/mL · cost $85+5 → $149
  - Row 19: TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) · 20mg/0.5mg/mL · cost $90+5 → $159
  - Row 21: TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) · 25mg/0.5mg/mL · cost $95+5 → $169
  - Row 23: TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) · 30mg/0.5mg/mL · cost $100+5 → $179
- **Note:** PROPOSED tier (awaiting owner approval). Vials: 5mg, 10mg, 15mg, 20mg, 25mg, 30mg.

### TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Membership
- **Formulation:** B12 ladder OR Glycine ladder (explicit selection)
- **Pharmacy:** Dirx-Hub
- **One-time price:** $275/mo
- **Membership:** $275/mo · backend `TIR_MEMBERSHIP_STRUCTURE_REQUIRES_SPLIT`
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP · `E3MXZeeR01QROCuTLRLE`
- **Formulary rows under it (0):**
  - _(none from SELECTED — structural / FUTURE placeholder)_
- **Note:** Owner-defined $275. Website $249 conflict noted only.

## WOMEN'S HORMONE THERAPY

### Estradiol Patch

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Patch
- **Formulation:** Estradiol transdermal patch ladder
- **Pharmacy:** Valiant
- **One-time price:** from $119
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Women's Hormones (HRT) – Vaginal Health (Estradiol / DHEA) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_o7dNtf9QsnEqPCrLr2tR`
- **Formulary rows under it (4):**
  - Row 26: ESTRADIOL TRANSDERMAL PATCH 0.025mg/hr 8 count · 0.025mg/hr · cost $50+30 → $119
  - Row 27: ESTRADIOL TRANSDERMAL PATCH 0.0375mg/hr 8 count · 0.0375mg/hr · cost $55+30 → $129
  - Row 28: ESTRADIOL TRANSDERMAL PATCH 0.05mg/hr 8 count · 0.05mg/hr · cost $60+30 → $139
  - Row 29: ESTRADIOL TRANSDERMAL PATCH 0.1mg/hr 8 count · 0.1mg/hr · cost $70+30 → $149
- **Note:** Website LIVE. Keep patch separate from other estradiol forms.

### Estradiol Tablet

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Tablet
- **Formulation:** Estradiol oral tablet ladder
- **Pharmacy:** Optimal Balance Pharmacy
- **One-time price:** $19
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Women's Hormones (HRT) – Vaginal Health (Estradiol / DHEA) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_o7dNtf9QsnEqPCrLr2tR`
- **Formulary rows under it (3):**
  - Row 37: ESTRADIOL 0.5MG TABLET 0.5MG · 0.5MG · cost $0.48+20 → $19
  - Row 38: ESTRADIOL 1 MG TABLET 1 MG · 1 MG · cost $0.48+20 → $19
  - Row 39: ESTRADIOL 2 MG TABLET 2 MG · 2 MG · cost $0.48+20 → $19
- **Note:** Not a current website standalone SKU.

### Estradiol Cypionate Injection

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Injection
- **Formulation:** Estradiol Cypionate (MCT Oil) 10 mg/mL
- **Pharmacy:** Vios
- **One-time price:** $89
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Women's Hormones (HRT) – Vaginal Health (Estradiol / DHEA) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_o7dNtf9QsnEqPCrLr2tR`
- **Formulary rows under it (1):**
  - Row 40: ESTRADIOL CYPIONATE (MCT OIL) 10 MG/ML · 10 MG/ML · cost $32+30 → $89
- **Note:** Keep injection separate.

### Custom HRT Cream

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Cream
- **Formulation:** Customizable HRT cream (1–4 ingredients)
- **Pharmacy:** St Luke
- **One-time price:** from $69
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Men's Hormones – Nandrolone / Testosterone Cream · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_RWtVLDbXlP7rsR31FXmH`
- **Formulary rows under it (12):**
  - Row 30: HRT Cream - 1 Ingredient (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $25+30 → $69
  - Row 31: HRT Cream - 2 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $28+30 → $79
  - Row 32: HRT Cream - 3 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $35+30 → $89
  - Row 33: HRT Cream - 4 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $40+30 → $99
  - Row 61: HRT Cream - 1 Ingredient (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $25+30 → $69
  - Row 62: HRT Cream - 2 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $28+30 → $79
  - Row 63: HRT Cream - 3 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $35+30 → $89
  - Row 64: HRT Cream - 4 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $40+30 → $99
  - Row 68: HRT Cream - 1 Ingredient (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $25+30 → $69
  - Row 69: HRT Cream - 2 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $28+30 → $79
  - Row 70: HRT Cream - 3 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $35+30 → $89
  - Row 71: HRT Cream - 4 Ingredients (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) · None · cost $40+30 → $99
- **Note:** Website LIVE testosterone cream intent maps to this customizable cream family. Identical cream rows appear under Estradiol/Progesterone/Testosterone workbook labels — assigned once here to all matching excel rows.

### Custom Hormone Troche

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Troche
- **Formulation:** Customizable hormone troche (1–3 ingredients)
- **Pharmacy:** St Luke
- **One-time price:** $29
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · CJC-1295 / Ipamorelin Growth Hormone Protocol (Oral / Troche) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_CO68GB2vs5lyfN6awklC`
- **Formulary rows under it (9):**
  - Row 34: Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 1 Ingredient · 1 Ingredient · cost $1+30 → $29
  - Row 35: Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 2 Ingredients · 2 Ingredients · cost $1.5+30 → $29
  - Row 36: Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 3 Ingredients · 3 Ingredients · cost $2+30 → $29
  - Row 65: Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 1 Ingredient · 1 Ingredient · cost $1+30 → $29
  - Row 66: Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 2 Ingredients · 2 Ingredients · cost $1.5+30 → $29
  - Row 67: Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 3 Ingredients · 3 Ingredients · cost $2+30 → $29
  - Row 72: Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 1 Ingredient · 1 Ingredient · cost $1+30 → $29
  - Row 73: Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 2 Ingredients · 2 Ingredients · cost $1.5+30 → $29
  - Row 74: Hormone Troche (Estradiol/Estriol/DHEA/Pregnenolone/Progesterone/Testosterone) - 3 Ingredients · 3 Ingredients · cost $2+30 → $29
- **Note:** Keep troche separate from cream/patch/injection.

### Progesterone Capsules (Immediate Release)

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Capsule
- **Formulation:** Progesterone IR oral capsules
- **Pharmacy:** Vios
- **One-time price:** $29
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Women's Hormones (HRT) – BiEst / Progesterone / Testosterone Combo Cream · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_AVNvVWBE98DfINxyz5Dm`
- **Formulary rows under it (9):**
  - Row 41: PROGESTERONE 100MG CAPSULE 100mg · 100mg · cost $0.75+30 → $29
  - Row 42: PROGESTERONE 200MG CAPSULE 200mg · 200mg · cost $0.75+30 → $29
  - Row 43: PROGESTERONE 50MG CAPSULE 50mg · 50mg · cost $0.75+30 → $29
  - Row 44: PROGESTERONE IR 100 MG · 100 MG · cost $0.85+30 → $29
  - Row 45: PROGESTERONE IR 150 MG · 150 MG · cost $0.85+30 → $29
  - Row 46: PROGESTERONE IR 200 MG · 200 MG · cost $0.85+30 → $29
  - Row 47: PROGESTERONE IR (DYE-FREE)(LACTOSE-FREE) (M NEW) 200MG · 200MG · cost $0.85+30 → $29
  - Row 48: PROGESTERONE IR 300 MG · 300 MG · cost $0.85+30 → $29
  - Row 49: PROGESTERONE IR 400 MG · 400 MG · cost $0.85+30 → $29
- **Note:** Website LIVE progesterone capsules → IR family.

### Progesterone Capsules (Sustained Release)

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Capsule
- **Formulation:** Progesterone SR oral capsules
- **Pharmacy:** Optimal Balance Pharmacy
- **One-time price:** $19
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Women's Hormones (HRT) – BiEst / Progesterone / Testosterone Combo Cream · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_AVNvVWBE98DfINxyz5Dm`
- **Formulary rows under it (11):**
  - Row 50: PROGESTERONE SR 100 MG · 100 MG · cost $0.54+20 → $19
  - Row 51: PROGESTERONE SR 125 MG · 125 MG · cost $0.54+20 → $19
  - Row 52: PROGESTERONE SR 150 MG · 150 MG · cost $0.54+20 → $19
  - Row 53: PROGESTERONE SR 175 MG · 175 MG · cost $0.54+20 → $19
  - Row 54: PROGESTERONE SR 200 MG · 200 MG · cost $0.54+20 → $19
  - Row 55: PROGESTERONE SR 225 MG · 225 MG · cost $0.54+20 → $19
  - Row 56: PROGESTERONE SR 25 MG · 25 MG · cost $0.54+20 → $19
  - Row 57: PROGESTERONE SR 50 MG · 50 MG · cost $0.54+20 → $19
  - Row 58: PROGESTERONE SR 75 MG · 75 MG · cost $0.54+20 → $19
  - Row 59: PROGESTERONE SR 250 MG · 250 MG · cost $0.67+20 → $19
  - Row 60: PROGESTERONE SR 300 MG · 300 MG · cost $0.96+20 → $19
- **Note:** SR kinetics differ — do not collapse into IR.

### Testosterone Cypionate Injection

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Injection
- **Formulation:** Testosterone Cypionate injection ladder
- **Pharmacy:** Optimal Balance Pharmacy
- **One-time price:** from $59
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Depo-Testosterone (Pfizer) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KQ9cN6N6tMmBokvGrAtd`
- **Formulary rows under it (5):**
  - Row 76: TESTOSTERONE CYPIONATE (GRAPESEED OIL) 20 MG/ML (5 ML) · 20 MG/ML (5 ML) · cost $23.75+20 → $59
  - Row 77: TESTOSTERONE CYPIONATE (GRAPESEED OIL) 50 MG/ML (5 ML) · 50 MG/ML (5 ML) · cost $23.75+20 → $59
  - Row 78: TESTOSTERONE CYPIONATE (GRAPESEED OIL) 200 MG/ML (5 ML) · 200 MG/ML (5 ML) · cost $25.5+20 → $69
  - Row 79: TESTOSTERONE CYPIONATE (MCT OIL) 200 MG/ML (5 ML) · 200 MG/ML (5 ML) · cost $35+20 → $79
  - Row 80: TESTOSTERONE CYPIONATE INJECTION (CS) 200MG/ML 200MG/ML (10ML) · 200MG/ML (10ML) · cost $37+20 → $89
- **Note:** Website currently LIVE cream only; injectable is future/hidden.

### Oxytocin Nasal Spray

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Nasal Spray
- **Formulation:** Oxytocin 100 IU/ml
- **Pharmacy:** —
- **One-time price:** TBD
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (0):**
  - _(none from SELECTED — structural / FUTURE placeholder)_
- **Note:** FUTURE ADDITIONS only — not in SELECTED. Prep hidden.

## LONGEVITY & COGNITIVE HEALTH

### NAD+ Injection

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection
- **Formulation:** NAD+ 200mg/ml injectable
- **Pharmacy:** St Luke
- **One-time price:** $139
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · NAD+ (Injectable) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SHJpGAACUFEeMONdpEbn`
- **Formulary rows under it (1):**
  - Row 83: NAD+ (Nicotinamide Adenine Dinucleotide) 200mg/ml · 200mg/ml · cost $64+30 → $139
- **Note:** Website LIVE.

### NAD+ Nasal Spray

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Nasal Spray
- **Formulation:** NAD+ nasal spray 50mg/ml & 200mg/ml
- **Pharmacy:** St Luke
- **One-time price:** from $79
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · NAD + Nasal Spray · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw`
- **Formulary rows under it (4):**
  - Row 81: NAD+ 50mg/ml · 50mg/ml · cost $30+30 → $79
  - Row 82: NAD+ 200mg/ml · 200mg/ml · cost $45+30 → $109
  - Row 84: NAD+ 50mg/ml · 50mg/ml · cost $30+30 → $79
  - Row 85: NAD+ 200mg/ml · 200mg/ml · cost $45+30 → $109
- **Note:** Keep nasal separate from injection. Workbook duplicates included.

### Glutathione Injection

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Injection
- **Formulation:** Glutathione 200mg/ml (10ml vial)
- **Pharmacy:** St Luke
- **One-time price:** from $59
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Wellness – Glutathione (Injectable) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_17H4pVR8uYnwvcBIz8iY`
- **Formulary rows under it (2):**
  - Row 86: Glutathione 200mg/ml · 200mg/ml · cost $15+30 → $59
  - Row 87: Glutathione 200mg/ml · 200mg/ml · cost $40+30 → $99
- **Note:** 3x multipack excluded from architecture cost basis.

### Semax Nasal Spray

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Nasal Spray
- **Formulation:** Semax 2.5mg/mL nasal spray
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $129
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Semax / Selank Neuro & Cognitive Protocol · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_LWkYtwm66dIeLuDSvSfi`
- **Formulary rows under it (1):**
  - Row 118: Semax 2.5mg/mL Nasal Spray · 2.5mg/20mL · cost $60+25 → $129
- **Note:** SELECTED is nasal. Website Semax Injection is legacy form mismatch — not inventing injection rows.

### Selank Nasal Spray

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Nasal Spray
- **Formulation:** Selank 2.5mg/mL nasal spray
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $129
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Pinealon / PE-22-28 / Selank Neuro-Sleep Protocol · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_m9JetRlC44nTkpQvPKdT`
- **Formulary rows under it (1):**
  - Row 119: Selank 2.5mg/mL Nasal Spray · 2.5mg/20mL · cost $60+25 → $129
- **Note:** SELECTED is nasal. Website Selank Injection is legacy form mismatch.

### Thymosin Alpha-1 Injection

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Injection
- **Formulation:** Thymosin Alpha-1 3 mg/mL (5 mL)
- **Pharmacy:** Optimal Balance Pharmacy
- **One-time price:** $159
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Thymosin A-1 · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_qgn9vCpD8bBN5pXNPKE5`
- **Formulary rows under it (1):**
  - Row 114: THYMOSIN ALPHA-1 3 MG/ML (5 ML) · 3 MG/ML (5 ML) · cost $82+20 → $159

### Methylene Blue Capsules

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Capsule
- **Formulation:** Methylene Blue oral 5–25 mg
- **Pharmacy:** Optimal Balance Pharmacy
- **One-time price:** $19
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (4):**
  - Row 120: METHYLENE BLUE 5 MG · 5 MG · cost $0.96+20 → $19
  - Row 121: METHYLENE BLUE 10 MG · 10 MG · cost $1+20 → $19
  - Row 122: METHYLENE BLUE 15 MG · 15 MG · cost $1.25+20 → $19
  - Row 123: METHYLENE BLUE 25 MG · 25 MG · cost $1.56+20 → $19

### Dihexa Capsules

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Capsule
- **Formulation:** Dihexa 5mg
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $29
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Dihexa Cognitive Enhancement Protocol · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_UIjUhnsOMiWRZFiKXFi7`
- **Formulary rows under it (1):**
  - Row 124: Dihexa capsules 5mg · 5mg · cost $2.6+25 → $29

### Dihexa / Tesofensine Capsules

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Capsule
- **Formulation:** Dihexa 5mg / Tesofensine 500mcg
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $29
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Dihexa Cognitive Enhancement Protocol · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_UIjUhnsOMiWRZFiKXFi7`
- **Formulary rows under it (1):**
  - Row 125: Dihexa/Tesofensine capsules 5mg/500mcg · 5mg/500mcg · cost $3.2+25 → $29
- **Note:** Keep blend separate from plain Dihexa.

## RECOVERY & PERFORMANCE

### BPC-157 / TB-500 / GHK-Cu Injection

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection
- **Formulation:** BPC-157/TB-500/GHK-CU 3/3/10MG/ML
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $159
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_REPAIR · BPC-157/TB-500/GHK-Cu 3/3/10 mg/mL (5 mL) Injection · `5iCQzEtTXw90ctEhIhkB`
- **Formulary rows under it (1):**
  - Row 100: BPC-157/TB-500/GHK-CU 3/3/10MG/ML · 3/3/10mg/mL · cost $77+25 → $159
- **Note:** Website LIVE recovery blend family. GEN 2A product exists.

### BPC-157 / GHK-Cu / KPV / TB-500 Injection

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Injection
- **Formulation:** BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $159
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MXsSZY2GpiCByJUQer1p`
- **Formulary rows under it (1):**
  - Row 101: BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL · 3mg/10mg/3mg/3mg/mL · cost $77+25 → $159
- **Note:** 4-ingredient blend — keep distinct.

### BPC-157 / KPV / TB-500 Injection

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Injection
- **Formulation:** BPC-157/KPV/TB500 3mg/3mg/3mg/mL
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $159
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MXsSZY2GpiCByJUQer1p`
- **Formulary rows under it (1):**
  - Row 102: BPC-157/KPV/TB500 3mg/3mg/3mg/mL · 3mg/3mg/3mg/mL · cost $77+25 → $159
- **Note:** Distinct blend.

### BPC-157 / TB-500 Injection

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Injection
- **Formulation:** BPC-157/TB500 3mg/3mg/mL
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $159
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MXsSZY2GpiCByJUQer1p`
- **Formulary rows under it (1):**
  - Row 103: BPC-157/TB500 3mg/3mg/mL · 3mg/3mg/mL · cost $77+25 → $159
- **Note:** Website LIVE Wolverine injection variant.

### BPC-157 / TB-500 Capsules

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Capsule
- **Formulation:** BPC-157/TB500 500mcg/500mcg capsules
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $29
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · BPC-157 · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn`
- **Formulary rows under it (1):**
  - Row 104: BPC-157/TB500 capsules 500MCG/500MCG · 500mcg/500mcg · cost $3.2+25 → $29
- **Note:** Website LIVE capsule variant. Keep separate from injection.

## PRESCRIPTION SKIN & HAIR

### Tretinoin Cream

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Cream
- **Formulation:** Tretinoin cream (± hyaluronic/niacinamide combo)
- **Pharmacy:** Vios
- **One-time price:** from $79
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Finasteride, Tretinoin, Fluocinolone, VitaminE · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_EeWMcfCJf5EU2LkNQmp9`
- **Formulary rows under it (2):**
  - Row 126: TRETINOIN 0.15% · 0.15% · cost $25.5+30 → $79
  - Row 127: HYALURONIC/NIACINAMIDE/TRETINOIN 0.5/4/0.025% · 0.5/4/0.025% · cost $54+30 → $129
- **Note:** Website LIVE. Owner may later split combo cream.

### Minoxidil Cream

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Cream
- **Formulation:** Minoxidil cream 7–15%
- **Pharmacy:** Vios
- **One-time price:** $89
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · GHK-Cu / Minoxidil Topical Combo · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_489YrehNXRlL77fYPkOn`
- **Formulary rows under it (3):**
  - Row 131: MINOXIDIL 10% · 10% · cost $32+30 → $89
  - Row 132: MINOXIDIL 15% · 15% · cost $32+30 → $89
  - Row 133: MINOXIDIL 7% · 7% · cost $32+30 → $89

### Minoxidil Solution

- **LIVE / FUTURE:** LIVE NOW
- **Form:** Solution
- **Formulation:** Minoxidil 2% solution
- **Pharmacy:** Vios
- **One-time price:** $29
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · GHK-Cu / Minoxidil Topical Combo · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_489YrehNXRlL77fYPkOn`
- **Formulary rows under it (1):**
  - Row 128: MINOXIDIL 2% · 2% · cost $1.28+30 → $29
- **Note:** Website LIVE topical minoxidil family — plain solution row.

### Finasteride / Minoxidil Topical

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Foam / Topical
- **Formulation:** Finasteride/Minoxidil topical
- **Pharmacy:** Vios
- **One-time price:** $79
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Hair Loss – Dual Combo (Finasteride/Minoxidil) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BboYS4a2Uj7APetrFo6W`
- **Formulary rows under it (2):**
  - Row 129: FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 % · 0.1/5 % · cost $30+30 → $79
  - Row 130: FINASTERIDE/MINOXIDIL (PER ML) 0.1/7 % · 0.1/7 % · cost $30+30 → $79
- **Note:** FUTURE — also on FUTURE ADDITIONS.

### Finasteride / Minoxidil / Tretinoin Topical

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Foam / Topical
- **Formulation:** Finasteride/Minoxidil/Tretinoin topical
- **Pharmacy:** Vios
- **One-time price:** $89
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · Finasteride, Tretinoin, Fluocinolone, VitaminE · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_EeWMcfCJf5EU2LkNQmp9`
- **Formulary rows under it (3):**
  - Row 134: FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.25/5/0.01 % · 0.25/5/0.01 % · cost $35+30 → $89
  - Row 135: FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.25/5/0.03 % · 0.25/5/0.03 % · cost $35+30 → $89
  - Row 136: FINASTERIDE/MINOXIDIL/TRETINOIN (PER ML) 0.5/5/0.01 % · 0.5/5/0.01 % · cost $35+30 → $89
- **Note:** Triple combo — do not collapse into dual. FUTURE.

### Lash/Brow Growth Serum (Bimatoprost)

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Solution
- **Formulation:** Bimatoprost — SOURCE MATCH NEEDED
- **Pharmacy:** —
- **One-time price:** TBD
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (0):**
  - _(none from SELECTED — structural / FUTURE placeholder)_
- **Note:** Website currently sells this, but FUTURE ADDITIONS says no formulary match. Structural only — do not invent.

## SEXUAL WELLNESS

### Sildenafil / Testosterone Troche

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Troche
- **Formulation:** Sildenafil 120mg / Testosterone 22mg
- **Pharmacy:** St Luke
- **One-time price:** $39
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · ED – Caffeine / Sildenafil (Performance Boost) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_w0Rf0DXmI8ukPgoMtH6g`
- **Formulary rows under it (1):**
  - Row 75: Sildenafil/Testosterone 120mg/22mg · 120mg/22mg · cost $2.75+30 → $39
- **Note:** Do not fold into standard HRT troche.

### PT-141 Injection

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Injection
- **Formulation:** PT-141 2mg/mL
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $129
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · PT-141 (Bremelanotide) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_7a11W067k20AKLSsL2xM`
- **Formulary rows under it (1):**
  - Row 115: PT-141 2mg/mL · 2mg/mL · cost $62+25 → $129

### PT-141 (Bremelanotide) Nasal Spray

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Nasal Spray
- **Formulation:** Bremelanotide nasal 5 & 10 mg/mL
- **Pharmacy:** Vios
- **One-time price:** $139
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · PT-141 (Bremelanotide) · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_7a11W067k20AKLSsL2xM`
- **Formulary rows under it (2):**
  - Row 116: BREMELANOTIDE (PT-141) (PER ML) 10 MG/ML · 10 MG/ML · cost $62+30 → $139
  - Row 117: BREMELANOTIDE (PT-141) (PER ML) 5MG/ML · 5MG/ML · cost $62+30 → $139
- **Note:** Also on FUTURE ADDITIONS. Hidden until launch.

### Sexual Wellness Compound Capsules

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Capsule
- **Formulation:** Flibanserin / Oxytocin / Tyrosine
- **Pharmacy:** —
- **One-time price:** TBD
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (0):**
  - _(none from SELECTED — structural / FUTURE placeholder)_
- **Note:** FUTURE ADDITIONS — not Scream Cream. Prep hidden.

### Scream Cream

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Cream
- **Formulation:** TBD — SOURCE MATCH NEEDED
- **Pharmacy:** —
- **One-time price:** TBD
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** NEW_REQUIRED · — · `—`
- **Formulary rows under it (0):**
  - _(none from SELECTED — structural / FUTURE placeholder)_
- **Note:** Owner wishlist. Do not substitute. No SELECTED row.

## RESEARCH WELLNESS

### GHK-Cu Cream

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Cream
- **Formulation:** GHK-Cu cream ladder (+ CoQ10 variant)
- **Pharmacy:** St Luke
- **One-time price:** from $109
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MXsSZY2GpiCByJUQer1p`
- **Formulary rows under it (7):**
  - Row 105: GHK-Cu Cream 2mg/ml · 2mg/ml · cost $45+30 → $109
  - Row 106: GHK-Cu Cream 5mg/ml · 5mg/ml · cost $57+30 → $129
  - Row 107: GHK-Cu Cream 10mg/ml · 10mg/ml · cost $90+30 → $189
  - Row 108: GHK-Cu Cream 2mg/ml · 2mg/ml · cost $45+30 → $109
  - Row 109: GHK-Cu + CoQ10 Cream 1/1% · 1/1% · cost $50+30 → $119
  - Row 110: GHK-Cu Cream 5mg/ml · 5mg/ml · cost $57+30 → $129
  - Row 111: GHK-Cu Cream 10mg/ml · 10mg/ml · cost $90+30 → $189
- **Note:** Workbook duplicates across Delivery Type deduped by assigning all matching rows once.

### MOTS-c Injection

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Injection
- **Formulation:** MOTS-C 2mg/mL
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $129
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · AOD-9604 / MOTS-C / Tesamorelin Injection · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_7Kix55LA15U0lNvY9QXI`
- **Formulary rows under it (1):**
  - Row 112: MOTS-C 2mg/mL · 2mg/mL · cost $62+25 → $129

### MOTS-c / Tesamorelin Injection

- **LIVE / FUTURE:** FUTURE HIDDEN
- **Form:** Injection
- **Formulation:** MOTS-C/Tesamorelin 2mg/3mg/mL
- **Pharmacy:** Greenwich Pharmacy
- **One-time price:** $159
- **Membership:** —
- **3/6 month:** — (separate purchase models only when launched)
- **GEN match:** REUSE_RENAME · AOD-9604 / MOTS-C / Tesamorelin Injection · `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_7Kix55LA15U0lNvY9QXI`
- **Formulary rows under it (1):**
  - Row 113: MOTS-C/Tesamorelin 2mg/3mg/mL · 2mg/3mg/mL · cost $79+25 → $159
- **Note:** Not a substitute for website plain Tesamorelin / Fat Burner without owner decision.

---

## Pricing rules (locked)

- **ONE-TIME:** `(cost × 1.75) + pharmacy shipping` → nearest **$X9** (equidistant rounds **UP**)
- **3-MONTH:** `((monthly cost × 1.75) + pharmacy shipping) × 3` → nearest $X9
- **6-MONTH:** same × 6 → nearest $X9
- Do **not** use malformed pharmacy multi-pack / multi-vial rows when package/cost basis is unreliable (excluded SEM 3-vial and TIR 3-PACK rows).

---

## Legacy B6 to replace

| Source | Name |
|---|---|
| Website | Semaglutide + B6 Injection |
| Website | Tirzepatide + B6 Injection |
| Website memberships | Still reference +B6; TIR membership still $249 vs owner $275 |
| GEN | _(no GEN display names containing B6 found in current pull)_ |

Target replacements: **Semaglutide/Tirzepatide + Vitamin B12** and **+ Glycine** dose-group products + memberships above.

---

## Old GEN catalog classification (no deactivations this phase)

| Class | Count |
|---|---:|
| KEEP_EXACT | 0 |
| REUSE_RENAME | 19 |
| REUSE_REPAIR | 13 |
| DUPLICATE_DEACTIVATE_CANDIDATE | 36 |
| LEGACY_DEACTIVATE_CANDIDATE | 117 |
| AMBIGUOUS_DO_NOT_TOUCH | 70 |

Full ID lists are in the JSON. **No deactivations performed.**

### REUSE_REPAIR (architecture-aligned GEN names)

- `5iCQzEtTXw90ctEhIhkB` — BPC-157/TB-500/GHK-Cu 3/3/10 mg/mL (5 mL) Injection → BPC-157 / TB-500 / GHK-Cu Injection
- `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SHJpGAACUFEeMONdpEbn` — NAD+ (Injectable) → NAD+ Injection
- `5F8jESeVeXcpkLU5rrdK` — SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP → SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP
- `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sN2ggSXRJINjElMYTQjf` — Semaglutide Injection — 3-Month (B12) → Semaglutide Injection — 3-Month (B12)
- `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MkDIUw0NcJB7YL2pNzYW` — Semaglutide Injection — Any Dose (B12) → Semaglutide Injection — Any Dose (B12)
- `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_wQK2JsFnh7oFBf3Lag4n` — Semaglutide Injection — Any Dose (Glycine) → Semaglutide Injection — Any Dose (Glycine)
- `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_34I2X8MpVZf3AQTff3bo` — Semaglutide Injection — High (B12) → Semaglutide Injection — High (B12)
- `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sssEk3FDY4LFbQYGQsLx` — Semaglutide Injection — High (Glycine) → Semaglutide Injection — High (Glycine)
- `BLf8inX395YNc7WPCD4O` — Semaglutide Injection — Mid (B12) → Semaglutide Injection — Mid (B12)
- `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_CjqOUbPuGPZzxephqRou` — Semaglutide Injection — Mid (Glycine) → Semaglutide Injection — Mid (Glycine)
- `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y` — Semaglutide Injection — Starting / Low (B12) → Semaglutide Injection — Starting / Low (B12)
- `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_tk2GW39OGr7JX4MCCoJP` — Semaglutide Injection — Starting / Low (Glycine) → Semaglutide Injection — Starting / Low (Glycine)
- `E3MXZeeR01QROCuTLRLE` — TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP → TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP

---

## Formulary assignment checks

- **Unassigned SELECTED rows (real gaps):** 0
- **Unassigned duplicate Longevity/B12 copies (OK — covered under SEM/TIR):** 11
- **Assigned more than once — true conflicts:** 0
- **Assigned more than once — intentional (tier + Any Dose / 3-month):** 22

### Conflicts / watch-outs

- **LEGACY_B6_WEBSITE:** Website LIVE Semaglutide + B6 / Tirzepatide + B6 — B6 not in SELECTED. Replace with B12 and Glycine architecture.
- **WEBSITE_FORM_MISMATCH:** Website LIVE Selank Injection, Semax Injection, Selank+Semax Blend Nasal — SELECTED has only separate Semax Nasal and Selank Nasal.
- **WEBSITE_WITHOUT_SELECTED_PLAIN_ROW:** Website LIVE Tesamorelin, Sermorelin, Fat Burner, Minoxidil Tablets — no plain SELECTED rows (MOTS-c/Tesamorelin blend exists only for Tesamorelin-adjacent).
- **MEMBERSHIP_PRICE_WEBSITE:** Website Tirzepatide Membership $249 vs owner-locked $275. No website write this phase.
- **BIMATOPROST_SOURCE:** Website Lash/Brow LIVE but formulary source unmatched (FUTURE ADDITIONS TBD).

### Excluded SELECTED rows

- Row 12: SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) — unreliable_multivial_cost_basis
- Row 25: TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) (3 PACK)) — unreliable_multipack
- Row 94: SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (3 VIALS)) — unreliable_multivial_cost_basis
- Row 137: Ondansetron — status=BLOCKED / TBD

---

## FINAL REPORT

- **TOTAL PATIENT-FACING PRODUCTS:** 56
- **LIVE NOW (proposed):** 27
- **FUTURE HIDDEN (proposed):** 29
- **POSSIBLE_FALSE_LIVE:** 19 — see `docs/MBM_LIVE_VS_FUTURE_OWNER_REVIEW.md`

- **SEM B12 PRODUCTS:** 4
- **SEM GLYCINE PRODUCTS:** 4
- **SEM MEMBERSHIP:** $149/mo **APPROVED** (one website offer)
- **SEM MEMBERSHIP BACKEND STRUCTURE:** `SEM_MEMBERSHIP_STRUCTURE_REQUIRES_SPLIT` — **APPROVED IF REQUIRED BY GEN**

- **TIR B12 PRODUCTS:** 4
- **TIR GLYCINE PRODUCTS:** 4
- **TIR MEMBERSHIP:** $275/mo **APPROVED** (one website offer)
- **TIR MEMBERSHIP BACKEND STRUCTURE:** `TIR_MEMBERSHIP_STRUCTURE_REQUIRES_SPLIT` — **APPROVED IF REQUIRED BY GEN**

- **TIR TIER PROPOSAL:** **APPROVED** — Starting/Low 5+10 · Mid 15+20 · High 25+30 · Any Dose full ladder

- **B6 → B12/GLYCINE:** **APPROVED** (website not modified yet)
- **LIVE/FUTURE OWNER APPROVAL:** **PENDING**

- **PT-141 NASAL:** FUTURE HIDDEN (do not activate)
- **SCREAM CREAM:** FUTURE HIDDEN (do not activate)

- **GEN MODIFIED:** NO
- **GEN WRITES:** 0
- **WEBSITE MODIFIED:** NO
- **GEN/WHOP CUTOVER:** OFF

---

**STOP FOR OWNER REVIEW of LIVE/FUTURE map.**

No pairing checklist produced. No GEN-CATALOG-2B started.
