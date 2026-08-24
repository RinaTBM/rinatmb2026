# MBM Launch-State Map — Owner Review (3-State Model)

**Generated:** 2026-08-24T21:31:06Z  
**Phase:** MBM-LIVE-MAP-LOCK  
**Mode:** READ-ONLY — no GEN writes, no website writes, no pairing changes, GEN/Whop cutover OFF  
**Prior binary LIVE/FUTURE:** **SUPERSEDED** by 3-state model below.

Website authority: `src/data/products.ts` (visible + active medications + active memberships).

---

## 3-state model

| State | Meaning |
|---|---|
| **CURRENT_LIVE** | Actually offered on MyBareMethod.com today. Keep offering even if formulary mapping is incomplete. |
| **LAUNCH_WITH_WEBSITE_CUTOVER** | Not on website today. Owner-approved replacement architecture for the upcoming catalog cutover. `showPatient=false` / website OFF / checkout OFF until cutover. |
| **FUTURE_HIDDEN** | Prepared or wishlist only. Not for immediate website cutover. |

---

## Locked decisions

| Item | Status |
|---|---|
| TIR tiers | APPROVED |
| SEM membership $149 · one website offer | CURRENT_LIVE APPROVED |
| TIR membership website $249 → cutover $275 · one website offer | CURRENT_LIVE; price change at cutover |
| Membership backend B12/Glycine split | APPROVED IF REQUIRED BY GEN |
| B6 → B12/Glycine | APPROVED at website cutover; B6 stays CURRENT_LIVE until then |
| Custom HRT Cream / BPC-TB-GHK / Minoxidil Solution | **FUTURE_HIDDEN** |
| PT-141 Nasal / Scream Cream | **FUTURE_HIDDEN** (do not activate) |

---

## Final launch-state table

| PRODUCT | CURRENT WEBSITE? | LAUNCH STATE | CURRENT PRICE | NEW PRICE | CURRENT FORMULATION | TARGET FORMULATION | GEN STATUS | FORMULARY STATUS | CUTOVER ACTION |
|---|---|---|---|---|---|---|---|---|---|
| Semaglutide + B6 Injection | YES | **CURRENT_LIVE** | $119–$329 (0.5/1/2.5/5mg) | Cutover → SEM B12/Glycine dose-group $X9 ladder (from $89) | Semaglutide + B6 | Replace at cutover with 8 SEM dose-group products (B12 + Glycine): Starting/Low, Mid, High, Any Dose | Legacy B6 website SKU; dose-group GEN products exist for cutover | NO_SELECTED_MATCH — B6 not in SELECTED; target is B12/Glycine ladders | **REPLACE_B6** |
| Tirzepatide + B6 Injection | YES | **CURRENT_LIVE** | $189–$429 (2.5/7.5/12.5/15mg) | Cutover → TIR B12/Glycine dose-group $X9 ladder (from $119) | Tirzepatide + B6 | Replace at cutover with 8 TIR dose-group products (B12 + Glycine); tiers APPROVED 5+10 / 15+20 / 25+30 / Any | — | NO_SELECTED_MATCH — B6 not in SELECTED; target is B12/Glycine ladders | **REPLACE_B6** |
| Fat Burner | YES | **CURRENT_LIVE** | $259 | $259 | AOD-9604 + MOTS-C + Tesamorelin (5mL) | No exact SELECTED match — do not invent; keep offered | — | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Estradiol Patch | YES | **CURRENT_LIVE** | $129–$149 | from $119 | 0.025 / 0.05 / 0.1 mg twice weekly | Estradiol Patch | REUSE_RENAME | SELECTED_MATCH — Valiant patch ladder (includes 0.0375mg/hr) | **REPRICE** |
| Progesterone Capsules | YES | **CURRENT_LIVE** | $39 / $59 (100mg / 200mg) | $29 | Progesterone oral capsules | Progesterone Capsules (Immediate Release) | REUSE_RENAME | SELECTED_MATCH — IR ladder (broader than website 100/200) | **REPRICE** |
| Testosterone Cream | YES | **CURRENT_LIVE** | $79 · 5mg/g · 30g | $79 · 5mg/g · 30g | Testosterone cream | Keep as Testosterone Cream CURRENT_LIVE — Custom HRT Cream moved to FUTURE_HIDDEN | — | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| NAD+ Injection | YES | **CURRENT_LIVE** | $199 / $229 (100mg/mL 5mL & 10mL) | $139 | NAD+ injection | NAD+ Injection — SELECTED 200mg/ml 5ml vial (1000mg) | REUSE_REPAIR | PARTIAL_MATCH — ingredient matches; strength/package differ from website variants | **REPRICE** |
| Selank Injection | YES | **CURRENT_LIVE** | $129 · 5mg/mL · 2mL | $129 · 5mg/mL · 2mL | Selank injection | SELECTED has Selank Nasal Spray only (FUTURE_HIDDEN) — no injection row | — | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Semax Injection | YES | **CURRENT_LIVE** | $129 · 5mg/mL · 2mL | $129 · 5mg/mL · 2mL | Semax injection | SELECTED has Semax Nasal Spray only (FUTURE_HIDDEN) — no injection row | — | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Selank + Semax Blend Nasal Spray | YES | **CURRENT_LIVE** | $169 · 50mcg/50mcg · 10mL | $169 · 50mcg/50mcg · 10mL | Selank + Semax blend nasal spray | No SELECTED blend row (separate nasal sprays are FUTURE_HIDDEN) | — | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Tesamorelin Injection | YES | **CURRENT_LIVE** | $149 · 10mg / 2mL (5mg/mL) | $149 · 10mg / 2mL (5mg/mL) | Tesamorelin injection | No plain Tesamorelin in SELECTED (MOTS-c/Tesamorelin blend is FUTURE_HIDDEN) | — | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Wolverine: BPC-157/TB-500 | YES | **CURRENT_LIVE** | Capsule $99 / Injection $199 | Inj $159 / Cap $29 | BPC-157/TB-500 blend (capsule + injection) | BPC-157 / TB-500 Capsules + BPC-157 / TB-500 Injection (architecture split); GHK triple stays FUTURE_HIDDEN | — | SELECTED_MATCH — plain BPC/TB capsule + injection rows exist | **STRUCTURE_CHANGE** |
| Tretinoin Cream | YES | **CURRENT_LIVE** | $79 / $89 / $109 (0.025/0.05/0.1% · 20g) | from $79 | Tretinoin cream | Tretinoin Cream — SELECTED has 0.15% + hyaluronic/niacinamide combo | — | PARTIAL_MATCH — strength/package differ from website | **REPRICE** |
| Minoxidil Combination Topical Formula | YES | **CURRENT_LIVE** | $129 | $129 | Combination formula (provider/pharmacy determined) | Not Minoxidil Solution (now FUTURE_HIDDEN). Closer to FUTURE Finasteride/Minoxidil topicals | — | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Lash/Brow Growth Serum | YES | **CURRENT_LIVE** | $89 · 0.03% · 2.5mL | $89 · 0.03% · 2.5mL | Bimatoprost solution | Architecture placeholder FUTURE_HIDDEN until source match — website stays CURRENT_LIVE | — | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP | YES | **CURRENT_LIVE** | $149/mo (website) | $149/mo | Includes Semaglutide + B6 Injection | Any Dose Semaglutide — B12 OR Glycine fulfillment (patient/provider selects) | REUSE_REPAIR | MEMBERSHIP — owner-approved; backend split allowed | **KEEP** |
| TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP | YES | **CURRENT_LIVE** | $249/mo (website) | $275/mo (cutover) | Includes Tirzepatide + B6 Injection through 15mg | Any Dose Tirzepatide — B12 OR Glycine fulfillment (patient/provider selects) | REUSE_REPAIR | MEMBERSHIP — owner-approved; backend split allowed | **REPRICE** |
| | | | | | | | | | |
| Semaglutide Injection — Starting / Low (B12) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $89 | — | Semaglutide + Vitamin B12 | REUSE_REPAIR | SELECTED attached (2 rows) | **REPLACE_B6** |
| Semaglutide Injection — Mid (B12) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | $109 | — | Semaglutide + Vitamin B12 | REUSE_REPAIR | SELECTED attached (1 rows) | **REPLACE_B6** |
| Semaglutide Injection — High (B12) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $109 | — | Semaglutide + Vitamin B12 | REUSE_REPAIR | SELECTED attached (2 rows) | **REPLACE_B6** |
| Semaglutide Injection — Any Dose (B12) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $89 | — | Semaglutide + Vitamin B12 | REUSE_REPAIR | SELECTED attached (5 rows) | **REPLACE_B6** |
| Semaglutide Injection — Starting / Low (Glycine) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $89 | — | Semaglutide + Glycine | REUSE_REPAIR | SELECTED attached (2 rows) | **REPLACE_B6** |
| Semaglutide Injection — Mid (Glycine) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | $109 | — | Semaglutide + Glycine | REUSE_REPAIR | SELECTED attached (1 rows) | **REPLACE_B6** |
| Semaglutide Injection — High (Glycine) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $109 | — | Semaglutide + Glycine | REUSE_REPAIR | SELECTED attached (2 rows) | **REPLACE_B6** |
| Semaglutide Injection — Any Dose (Glycine) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $89 | — | Semaglutide + Glycine | REUSE_REPAIR | SELECTED attached (5 rows) | **REPLACE_B6** |
| Tirzepatide Injection — Starting / Low (B12) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $119 | — | Tirzepatide + Vitamin B12 | NEW_REQUIRED | SELECTED attached (2 rows) | **REPLACE_B6** |
| Tirzepatide Injection — Mid (B12) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $149 | — | Tirzepatide + Vitamin B12 | NEW_REQUIRED | SELECTED attached (2 rows) | **REPLACE_B6** |
| Tirzepatide Injection — High (B12) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $169 | — | Tirzepatide + Vitamin B12 | NEW_REQUIRED | SELECTED attached (2 rows) | **REPLACE_B6** |
| Tirzepatide Injection — Any Dose (B12) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $119 | — | Tirzepatide + Vitamin B12 | NEW_REQUIRED | SELECTED attached (6 rows) | **REPLACE_B6** |
| Tirzepatide Injection — Starting / Low (Glycine) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $119 | — | Tirzepatide + Glycine | NEW_REQUIRED | SELECTED attached (2 rows) | **REPLACE_B6** |
| Tirzepatide Injection — Mid (Glycine) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $149 | — | Tirzepatide + Glycine | NEW_REQUIRED | SELECTED attached (2 rows) | **REPLACE_B6** |
| Tirzepatide Injection — High (Glycine) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $169 | — | Tirzepatide + Glycine | NEW_REQUIRED | SELECTED attached (2 rows) | **REPLACE_B6** |
| Tirzepatide Injection — Any Dose (Glycine) | NO | **LAUNCH_WITH_WEBSITE_CUTOVER** | — (not on website) | from $119 | — | Tirzepatide + Glycine | NEW_REQUIRED | SELECTED attached (6 rows) | **REPLACE_B6** |
| | | | | | | | | | |
| Semaglutide Injection — 3-Month (B12) | NO | FUTURE_HIDDEN | — | example @4mg → $329 (×3 rule) | — | Semaglutide + Vitamin B12 | REUSE_REPAIR | SELECTED (5 rows) — hidden | KEEP_HIDDEN |
| Estradiol Tablet | NO | FUTURE_HIDDEN | — | $19 | — | Estradiol oral tablet ladder | REUSE_RENAME | SELECTED (3 rows) — hidden | KEEP_HIDDEN |
| Estradiol Cypionate Injection | NO | FUTURE_HIDDEN | — | $89 | — | Estradiol Cypionate (MCT Oil) 10 mg/mL | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| Custom HRT Cream | NO | FUTURE_HIDDEN | — | from $69 | — | Customizable HRT cream (1–4 ingredients) | REUSE_RENAME | SELECTED (12 rows) — hidden | KEEP_HIDDEN |
| Custom Hormone Troche | NO | FUTURE_HIDDEN | — | $29 | — | Customizable hormone troche (1–3 ingredients) | REUSE_RENAME | SELECTED (9 rows) — hidden | KEEP_HIDDEN |
| Progesterone Capsules (Sustained Release) | NO | FUTURE_HIDDEN | — | $19 | — | Progesterone SR oral capsules | REUSE_RENAME | SELECTED (11 rows) — hidden | KEEP_HIDDEN |
| Testosterone Cypionate Injection | NO | FUTURE_HIDDEN | — | from $59 | — | Testosterone Cypionate injection ladder | REUSE_RENAME | SELECTED (5 rows) — hidden | KEEP_HIDDEN |
| Sildenafil / Testosterone Troche | NO | FUTURE_HIDDEN | — | $39 | — | Sildenafil 120mg / Testosterone 22mg | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| NAD+ Nasal Spray | NO | FUTURE_HIDDEN | — | from $79 | — | NAD+ nasal spray 50mg/ml & 200mg/ml | REUSE_RENAME | SELECTED (4 rows) — hidden | KEEP_HIDDEN |
| Glutathione Injection | NO | FUTURE_HIDDEN | — | from $59 | — | Glutathione 200mg/ml (10ml vial) | REUSE_RENAME | SELECTED (2 rows) — hidden | KEEP_HIDDEN |
| Semax Nasal Spray | NO | FUTURE_HIDDEN | — | $129 | — | Semax 2.5mg/mL nasal spray | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| Selank Nasal Spray | NO | FUTURE_HIDDEN | — | $129 | — | Selank 2.5mg/mL nasal spray | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| Thymosin Alpha-1 Injection | NO | FUTURE_HIDDEN | — | $159 | — | Thymosin Alpha-1 3 mg/mL (5 mL) | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| Methylene Blue Capsules | NO | FUTURE_HIDDEN | — | $19 | — | Methylene Blue oral 5–25 mg | NEW_REQUIRED | SELECTED (4 rows) — hidden | KEEP_HIDDEN |
| Dihexa Capsules | NO | FUTURE_HIDDEN | — | $29 | — | Dihexa 5mg | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| Dihexa / Tesofensine Capsules | NO | FUTURE_HIDDEN | — | $29 | — | Dihexa 5mg / Tesofensine 500mcg | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| BPC-157 / TB-500 / GHK-Cu Injection | NO | FUTURE_HIDDEN | — | $159 | — | BPC-157/TB-500/GHK-CU 3/3/10MG/ML | REUSE_REPAIR | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| BPC-157 / GHK-Cu / KPV / TB-500 Injection | NO | FUTURE_HIDDEN | — | $159 | — | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3mg/3mg/mL | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| BPC-157 / KPV / TB-500 Injection | NO | FUTURE_HIDDEN | — | $159 | — | BPC-157/KPV/TB500 3mg/3mg/3mg/mL | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| Minoxidil Cream | NO | FUTURE_HIDDEN | — | $89 | — | Minoxidil cream 7–15% | REUSE_RENAME | SELECTED (3 rows) — hidden | KEEP_HIDDEN |
| Minoxidil Solution | NO | FUTURE_HIDDEN | — | $29 | — | Minoxidil 2% solution | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| Finasteride / Minoxidil Topical | NO | FUTURE_HIDDEN | — | $79 | — | Finasteride/Minoxidil topical | REUSE_RENAME | SELECTED (2 rows) — hidden | KEEP_HIDDEN |
| Finasteride / Minoxidil / Tretinoin Topical | NO | FUTURE_HIDDEN | — | $89 | — | Finasteride/Minoxidil/Tretinoin topical | REUSE_RENAME | SELECTED (3 rows) — hidden | KEEP_HIDDEN |
| PT-141 Injection | NO | FUTURE_HIDDEN | — | $129 | — | PT-141 2mg/mL | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| PT-141 (Bremelanotide) Nasal Spray | NO | FUTURE_HIDDEN | — | $139 | — | Bremelanotide nasal 5 & 10 mg/mL | REUSE_RENAME | SELECTED (2 rows) — hidden | KEEP_HIDDEN |
| GHK-Cu Cream | NO | FUTURE_HIDDEN | — | from $109 | — | GHK-Cu cream ladder (+ CoQ10 variant) | REUSE_RENAME | SELECTED (7 rows) — hidden | KEEP_HIDDEN |
| MOTS-c Injection | NO | FUTURE_HIDDEN | — | $129 | — | MOTS-C 2mg/mL | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| MOTS-c / Tesamorelin Injection | NO | FUTURE_HIDDEN | — | $159 | — | MOTS-C/Tesamorelin 2mg/3mg/mL | REUSE_RENAME | SELECTED (1 rows) — hidden | KEEP_HIDDEN |
| Oxytocin Nasal Spray | NO | FUTURE_HIDDEN | — | TBD | — | Oxytocin 100 IU/ml | NEW_REQUIRED | FUTURE / not for immediate cutover | KEEP_HIDDEN |
| Sexual Wellness Compound Capsules | NO | FUTURE_HIDDEN | — | TBD | — | Flibanserin / Oxytocin / Tyrosine | NEW_REQUIRED | FUTURE / not for immediate cutover | KEEP_HIDDEN |
| Lash/Brow Growth Serum (Bimatoprost) | NO | FUTURE_HIDDEN | — | TBD | — | Bimatoprost — SOURCE MATCH NEEDED | NEW_REQUIRED | FUTURE / not for immediate cutover | KEEP_HIDDEN |
| Scream Cream | NO | FUTURE_HIDDEN | — | TBD | — | TBD — SOURCE MATCH NEEDED | NEW_REQUIRED | FUTURE / not for immediate cutover | KEEP_HIDDEN |

---

## CURRENT_LIVE detail (website authority)

| CURRENT WEBSITE NAME | CURRENT PRICE | CURRENT FORMULATION | NEW ARCHITECTURE TARGET | FORMULARY STATUS | PLANNED CUTOVER ACTION |
|---|---|---|---|---|---|
| Semaglutide + B6 Injection | $119–$329 (0.5/1/2.5/5mg) | Semaglutide + B6 | Replace at cutover with 8 SEM dose-group products (B12 + Glycine): Starting/Low, Mid, High, Any Dose | NO_SELECTED_MATCH — B6 not in SELECTED; target is B12/Glycine ladders | **REPLACE_B6** |
| Tirzepatide + B6 Injection | $189–$429 (2.5/7.5/12.5/15mg) | Tirzepatide + B6 | Replace at cutover with 8 TIR dose-group products (B12 + Glycine); tiers APPROVED 5+10 / 15+20 / 25+30 / Any | NO_SELECTED_MATCH — B6 not in SELECTED; target is B12/Glycine ladders | **REPLACE_B6** |
| Fat Burner | $259 | AOD-9604 + MOTS-C + Tesamorelin (5mL) | No exact SELECTED match — do not invent; keep offered | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Estradiol Patch | $129–$149 | 0.025 / 0.05 / 0.1 mg twice weekly | Estradiol Patch | SELECTED_MATCH — Valiant patch ladder (includes 0.0375mg/hr) | **REPRICE** |
| Progesterone Capsules | $39 / $59 (100mg / 200mg) | Progesterone oral capsules | Progesterone Capsules (Immediate Release) | SELECTED_MATCH — IR ladder (broader than website 100/200) | **REPRICE** |
| Testosterone Cream | $79 · 5mg/g · 30g | Testosterone cream | Keep as Testosterone Cream CURRENT_LIVE — Custom HRT Cream moved to FUTURE_HIDDEN | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| NAD+ Injection | $199 / $229 (100mg/mL 5mL & 10mL) | NAD+ injection | NAD+ Injection — SELECTED 200mg/ml 5ml vial (1000mg) | PARTIAL_MATCH — ingredient matches; strength/package differ from website variants | **REPRICE** |
| Selank Injection | $129 · 5mg/mL · 2mL | Selank injection | SELECTED has Selank Nasal Spray only (FUTURE_HIDDEN) — no injection row | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Semax Injection | $129 · 5mg/mL · 2mL | Semax injection | SELECTED has Semax Nasal Spray only (FUTURE_HIDDEN) — no injection row | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Selank + Semax Blend Nasal Spray | $169 · 50mcg/50mcg · 10mL | Selank + Semax blend nasal spray | No SELECTED blend row (separate nasal sprays are FUTURE_HIDDEN) | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Tesamorelin Injection | $149 · 10mg / 2mL (5mg/mL) | Tesamorelin injection | No plain Tesamorelin in SELECTED (MOTS-c/Tesamorelin blend is FUTURE_HIDDEN) | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Wolverine: BPC-157/TB-500 | Capsule $99 / Injection $199 | BPC-157/TB-500 blend (capsule + injection) | BPC-157 / TB-500 Capsules + BPC-157 / TB-500 Injection (architecture split); GHK triple stays FUTURE_HIDDEN | SELECTED_MATCH — plain BPC/TB capsule + injection rows exist | **STRUCTURE_CHANGE** |
| Tretinoin Cream | $79 / $89 / $109 (0.025/0.05/0.1% · 20g) | Tretinoin cream | Tretinoin Cream — SELECTED has 0.15% + hyaluronic/niacinamide combo | PARTIAL_MATCH — strength/package differ from website | **REPRICE** |
| Minoxidil Combination Topical Formula | $129 | Combination formula (provider/pharmacy determined) | Not Minoxidil Solution (now FUTURE_HIDDEN). Closer to FUTURE Finasteride/Minoxidil topicals | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| Lash/Brow Growth Serum | $89 · 0.03% · 2.5mL | Bimatoprost solution | Architecture placeholder FUTURE_HIDDEN until source match — website stays CURRENT_LIVE | FORMULARY_RECONCILIATION_REQUIRED | **FORMULARY_RECONCILIATION_REQUIRED** |
| SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP (website: Semaglutide Membership) | $149/mo | Includes Semaglutide + B6 Injection | Any Dose Semaglutide — B12 OR Glycine fulfillment (patient/provider selects) | MEMBERSHIP — owner-approved; backend split allowed | **KEEP** |
| TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP (website: Tirzepatide Membership) | $249/mo | Includes Tirzepatide + B6 Injection through 15mg | Any Dose Tirzepatide — B12 OR Glycine fulfillment (patient/provider selects) | MEMBERSHIP — owner-approved; backend split allowed | **REPRICE** |

**FORMULARY_RECONCILIATION_REQUIRED (8):**

- Fat Burner — CURRENT_LIVE. Closest FUTURE architecture is MOTS-c/Tesamorelin blend — different; do not silent-map.
- Testosterone Cream — Website product remains. Do not collapse into Custom HRT Cream for launch. Exact SELECTED testosterone-only cream row not isolated from custom HRT cream family.
- Selank Injection — CURRENT_LIVE. Do not invent injection formulary match. Do not remove from website.
- Semax Injection — CURRENT_LIVE. Do not invent injection formulary match.
- Selank + Semax Blend Nasal Spray — CURRENT_LIVE. Do not invent blend from separate rows.
- Tesamorelin Injection — CURRENT_LIVE. Do not substitute blend for plain Tesamorelin.
- Minoxidil Combination Topical Formula — CURRENT_LIVE. Do not silent-replace with plain 2% solution.
- Lash/Brow Growth Serum — CURRENT_LIVE on website. FUTURE ADDITIONS says source match needed. Do not invent formulary.

These stay **CURRENT_LIVE**. Do not remove them. Do not invent formulary matches.

---

## LAUNCH_WITH_WEBSITE_CUTOVER (16)

Not exposed until website catalog cutover. Replaces legacy B6 structure.

| Additive | Products |
|---|---|
| Semaglutide + Vitamin B12 | Starting/Low · Mid · High · Any Dose |
| Semaglutide + Glycine | Starting/Low · Mid · High · Any Dose |
| Tirzepatide + Vitamin B12 | Starting/Low · Mid · High · Any Dose (tiers APPROVED) |
| Tirzepatide + Glycine | Starting/Low · Mid · High · Any Dose (tiers APPROVED) |

Until cutover: `showPatient=false` · website OFF · checkout OFF.

---

## FUTURE_HIDDEN

Moved this phase from prior POSSIBLE_FALSE_LIVE:

- Custom HRT Cream
- BPC-157 / TB-500 / GHK-Cu Injection
- Minoxidil Solution

Explicitly remain FUTURE (do not activate):

- PT-141 (Bremelanotide) Nasal Spray
- Scream Cream

### WEIGHT MANAGEMENT

- Semaglutide Injection — 3-Month (B12)

### WOMEN'S HORMONE THERAPY

- Estradiol Tablet
- Estradiol Cypionate Injection
- Custom HRT Cream
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

- BPC-157 / TB-500 / GHK-Cu Injection
- BPC-157 / GHK-Cu / KPV / TB-500 Injection
- BPC-157 / KPV / TB-500 Injection

### PRESCRIPTION SKIN & HAIR

- Minoxidil Cream
- Minoxidil Solution
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

---


---

## Formulary reconciliation status (MBM-FORMULARY-RECON-1)

Launch states above are **unchanged**. Status only:

| Product | Classification | Owner decision? |
|---|---|---|
| Fat Burner | NO_SELECTED_FORMULARY_MATCH | YES |
| Testosterone Cream | NO_SELECTED_FORMULARY_MATCH | YES |
| Selank Injection | NO_SELECTED_FORMULARY_MATCH | YES |
| Semax Injection | NO_SELECTED_FORMULARY_MATCH | YES |
| Selank + Semax Blend Nasal Spray | NO_SELECTED_FORMULARY_MATCH | YES |
| Tesamorelin Injection | FORMULATION_CONFLICT | YES |
| Minoxidil Combination Topical Formula | MULTIPLE_VALID_OPTIONS | YES |
| Lash/Brow Growth Serum | NO_SELECTED_FORMULARY_MATCH | YES |

Full report: `docs/MBM_CURRENT_LIVE_FORMULARY_RECONCILIATION.md`

## FINAL REPORT

- **CURRENT_LIVE:** 17 (15 website medications + 2 memberships)
- **LAUNCH_WITH_WEBSITE_CUTOVER:** 16
- **FUTURE_HIDDEN:** 32
- **TOTAL:** 65

- **CURRENT WEBSITE PRODUCTS NEEDING FORMULARY RECONCILIATION:** 8

- **SEM/TIR DOSE-GROUP CUTOVER PRODUCTS:** 16
- **CUSTOM HRT CREAM:** FUTURE_HIDDEN
- **BPC/TB/GHK:** FUTURE_HIDDEN
- **MINOXIDIL SOLUTION:** FUTURE_HIDDEN
- **PT-141 NASAL:** FUTURE_HIDDEN
- **SCREAM CREAM:** FUTURE_HIDDEN

- **SEM MEMBERSHIP:** CURRENT_LIVE — $149
- **TIR MEMBERSHIP:** CURRENT_LIVE — website currently $249; CUTOVER PRICE — $275

- **B6 PRODUCTS:** CURRENT_LIVE UNTIL CUTOVER
- **B12/GLYCINE DOSE GROUPS:** LAUNCH_WITH_WEBSITE_CUTOVER

- **GEN MODIFIED:** NO
- **GEN WRITES:** 0
- **WEBSITE MODIFIED:** NO
- **GEN/WHOP CUTOVER:** OFF

---

**STOP FOR OWNER REVIEW.**

No pairing checklist. No GEN-CATALOG-2B.
