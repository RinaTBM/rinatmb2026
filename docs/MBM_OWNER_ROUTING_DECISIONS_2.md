# Owner Routing Decisions — Pass 2 (LOCKED)

**For:** Owner record  
**Phase:** MBM-OWNER-ROUTING-DECISION-GATE-2 — OWNER APPROVAL LOCKED  
**Locked at:** 2026-08-25T00:27:41Z  
**Mode:** Read-only — no GEN, website, pairing, checkout, or cutover changes  

Website product-family architecture remains **LOCKED** (one clean product → variants → exact GEN route).

**OWNER CHOICES LOCKED: A · A · B · A · A · B · A · A**  
**OWNER DECISIONS REMAINING: 0**

Sourcing / missing formulary data is **not** resolved by these approvals.

---

# DECISION 1 OF 8 — LOCKED

**PRODUCT:** Semaglutide  
**VARIANT:** Current website “Semaglutide + B6” one-time (legacy)

**CUSTOMER WOULD SEE:** Semaglutide one-time with B6 until cutover (then removed)

**FORMULARY OPTION:** None for B6 — cutover = B12 + Glycine only  
**PHARMACY / STRENGTH / PACKAGE / COST / SHIPPING / RETAIL:** —  
**CURRENT GEN:** No B6 cutover route

**PROBLEM:** B6 transitional only.

[x] **OPTION A** — Remove B6 at cutover; replace with B12/Glycine  
[ ] OPTION B — Delay removal only  
[ ] DEFER

**RECOMMENDATION:** A  
**OWNER CHOICE: A — LOCKED**  
**EFFECT:** Route status → `FUTURE_HIDDEN` (remove at website cutover). Do not restore B6.

---

# DECISION 2 OF 8 — LOCKED

**PRODUCT:** Tirzepatide  
**VARIANT:** Current website “Tirzepatide + B6” one-time (legacy)

**CUSTOMER WOULD SEE:** Tirzepatide one-time with B6 until cutover (then removed)

**FORMULARY OPTION:** None for B6 — cutover = B12 + Glycine (approved tiers)  
**CURRENT GEN:** No B6 cutover route

**PROBLEM:** B6 transitional only.

[x] **OPTION A** — Remove B6 at cutover; replace with B12/Glycine  
[ ] OPTION B  
[ ] DEFER

**RECOMMENDATION:** A  
**OWNER CHOICE: A — LOCKED**  
**EFFECT:** Route status → `FUTURE_HIDDEN` (remove at website cutover). Do not restore B6.

---

# DECISION 3 OF 8 — LOCKED

**PRODUCT:** NAD+ *(ONE website product — Injection vs Nasal)*  
**VARIANT:** SELECTED r83 200mg/mL · 5mL (1000mg) — **rejected as website Injection**

**CURRENT WEBSITE VERSION:** Injection **100mg/mL** · 5mL/500mg @ $199 · 10mL/1000mg @ $229  

**FORMULARY OPTION (SELECTED r83 — NOT ADOPTED FOR WEBSITE):**  
St Luke · 200mg/mL · 5mL (1000mg) · cost $64 · ship $30 · retail **$139**

**CURRENT GEN:** `SHJpGAACUFEeMONdpEbn`

**PROBLEM:** Website promises 100mg/mL; cannot silent-substitute 200mg/mL.

[ ] OPTION A — Adopt 200mg/mL @ $139  
[x] **OPTION B** — Keep 100mg/mL; source exact formulary  
[ ] OPTION C — Nasal only temporarily  
[ ] DEFER

**RECOMMENDATION:** B  
**OWNER CHOICE: B — LOCKED**  
**EFFECT:** r83 → `FUTURE_HIDDEN` (excluded). Website 100mg/mL Injection variants remain `FORMULARY_PENDING` until sourced. NAD+ stays ONE product.

---

# DECISION 4 OF 8 — LOCKED

**PRODUCT:** NAD+  
**VARIANT:** Workbook r81 (duplicate / mislabeled)

**FORMULARY OPTION:** r81 50mg/mL nasal · $79 — use **r84** instead  
**CURRENT GEN:** `FVwkzvQqWIZRNAwbslGw`

[x] **OPTION A** — Exclude r81; use r84  
[ ] OPTION B — Keep r81  
[ ] DEFER

**OWNER CHOICE: A — LOCKED**  
**EFFECT:** r81 → `FUTURE_HIDDEN`. r84 remains verified selectable nasal variant.

---

# DECISION 5 OF 8 — LOCKED

**PRODUCT:** NAD+  
**VARIANT:** Workbook r82 (duplicate / mislabeled)

**FORMULARY OPTION:** r82 200mg/mL nasal · $109 — use **r85** instead  
**CURRENT GEN:** `FVwkzvQqWIZRNAwbslGw`

[x] **OPTION A** — Exclude r82; use r85  
[ ] OPTION B — Keep r82  
[ ] DEFER

**OWNER CHOICE: A — LOCKED**  
**EFFECT:** r82 → `FUTURE_HIDDEN`. r85 remains verified selectable nasal variant.

**NAD+ website architecture (unchanged):**  
NAD+ → Injection → Nasal Spray  
Verified nasal selectors: **r84 + r85** only.

---

# DECISION 6 OF 8 — LOCKED

**PRODUCT:** Tretinoin  
**VARIANT:** SELECTED r126 0.15% · 30g — **rejected as website substitute**

**CURRENT WEBSITE VERSION:** 0.025% @ $79 · 0.05% @ $89 · 0.1% @ $109 (20g)

**FORMULARY OPTION (SELECTED r126 — NOT ADOPTED FOR WEBSITE):**  
Vios · 0.15% · 30g · cost $25.50 · ship $30 · retail **$79**

[ ] OPTION A — Change website to 0.15%  
[x] **OPTION B** — Keep 0.025/0.05/0.1%; source exact  
[ ] OPTION C — Offer both  
[ ] DEFER

**OWNER CHOICE: B — LOCKED**  
**EFFECT:** r126 → `FUTURE_HIDDEN` (not mapped to plain Tretinoin website). Website strengths remain `FORMULARY_PENDING`.

---

# DECISION 7 OF 8 — LOCKED

**PRODUCT:** Tretinoin  
**VARIANT:** SELECTED r127 combo HA/Niacinamide/Tretinoin

**FORMULARY OPTION:** Vios · 0.5/4/0.025% · 30g · cost $54 · ship $30 · retail **$129**

[x] **OPTION A** — Do not map to plain Tretinoin  
[ ] OPTION B — Add as explicit combination selector  
[ ] OPTION C — Replace plain with combo  
[ ] DEFER

**OWNER CHOICE: A — LOCKED**  
**EFFECT:** r127 → `FUTURE_HIDDEN`. Combo ≠ plain Tretinoin.

---

# DECISION 8 OF 8 — LOCKED

**PRODUCT:** Scream Cream  
**VARIANT:** Future placeholder

**FORMULARY OPTION:** None

[x] **OPTION A** — Remain FUTURE_HIDDEN / do not activate  
[ ] OPTION B — Prioritize sourcing only  
[ ] DEFER

**OWNER CHOICE: A — LOCKED**  
**EFFECT:** Stay `FUTURE_HIDDEN`. No live website route. No invented formulary mapping.

---

# SOURCING / FORMULARY INFORMATION NEEDED

These **14** variants remain **FORMULARY_PENDING**.  
Owner approval did **not** invent missing formulary data.

| # | Product family | Variant | Missing information |
|---:|---|---|---|
| 1 | NAD+ | Injection · 5 mL / 500 mg | medication/formulation: NAD+ injectable 100mg/mL (exact); strength: 100mg/mL; dosage form: Injection; package: 5mL / 500mg total; pharmacy; cost; shipping |
| 2 | NAD+ | Injection · 10 mL / 1000 mg | medication/formulation: NAD+ injectable 100mg/mL (exact); strength: 100mg/mL; dosage form: Injection; package: 10mL / 1000mg total; pharmacy; cost; shipping |
| 3 | Tretinoin | Tretinoin 0.025% | medication/formulation: plain Tretinoin Tretinoin 0.025%; strength: as website; dosage form: Cream; package: 20g (website) or owner-approved package; pharmacy; cost; shipping |
| 4 | Tretinoin | Tretinoin 0.05% | medication/formulation: plain Tretinoin Tretinoin 0.05%; strength: as website; dosage form: Cream; package: 20g (website) or owner-approved package; pharmacy; cost; shipping |
| 5 | Tretinoin | Tretinoin 0.1% | medication/formulation: plain Tretinoin Tretinoin 0.1%; strength: as website; dosage form: Cream; package: 20g (website) or owner-approved package; pharmacy; cost; shipping |
| 6 | Fat Burner | AOD-9604 + MOTS-c + Tesamorelin (no Ipamorelin) | medication/formulation: AOD-9604 + MOTS-c + Tesamorelin (no Ipamorelin); strength; dosage form: Injection; package; pharmacy; cost; shipping |
| 7 | Testosterone | Testosterone-only cream 5 mg/g | medication/formulation: Testosterone-only cream; strength: 5 mg/g; dosage form: Cream; package; pharmacy; cost; shipping |
| 8 | Selank | Selank injectable | medication/formulation: Selank injectable; strength; dosage form: Injection; package; pharmacy; cost; shipping |
| 9 | Semax | Semax injectable | medication/formulation: Semax injectable; strength; dosage form: Injection; package; pharmacy; cost; shipping |
| 10 | Selank + Semax Blend | Combined Selank+Semax nasal | medication/formulation: Combined Selank+Semax nasal; strength; dosage form: Nasal Spray; package; pharmacy; cost; shipping |
| 11 | Tesamorelin | Plain Tesamorelin | medication/formulation: Plain Tesamorelin (not MOTS-c blend); strength; dosage form: Injection; package; pharmacy; cost; shipping |
| 12 | Lash / Brow Growth Serum | Bimatoprost 0.03% | medication/formulation: Bimatoprost 0.03%; strength: 0.03%; dosage form: Solution; package: 2.5mL; pharmacy (confirmed); cost; shipping |
| 13 | Oxytocin | oxytocin-pending | medication/formulation; strength; dosage form; package; pharmacy; cost; shipping |
| 14 | Sexual Wellness Compound | sexual-wellness-compound-pending | medication/formulation; strength; dosage form; package; pharmacy; cost; shipping |

---

## FINAL REPORT (DECISIONS)

| Item | Value |
|---|---|
| OWNER DECISIONS LOCKED | **8/8** |
| OWNER DECISIONS REMAINING | **0** |
| OWNER CHOICES | A A B A A B A A |
| FORMULARY/SOURCING PENDING | **14** |
| ARCHITECTURE REOPENED | **NO** |
| SEM/TIR LOCKS CHANGED | **NO** |
| NAD+ ONE-PRODUCT ARCHITECTURE CHANGED | **NO** |
| GEN MODIFIED | **NO** |
| GEN WRITES | **0** |
| FORMULARY PAIRING WRITES | **0** |
| WEBSITE MODIFIED | **NO** |
| CHECKOUT MODIFIED | **NO** |
| CUTOVER | **OFF** |
