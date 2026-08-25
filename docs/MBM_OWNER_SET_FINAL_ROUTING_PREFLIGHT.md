# MBM Owner-Set Final Routing Preflight

**Phase:** `MBM-OWNER-WORKING-SET-FINAL-ROUTING-PREFLIGHT`  
**Generated:** `2026-08-25T07:32:28Z`  
**Mode:** READ-ONLY PREFLIGHT — no GEN writes, no pairings, no creates, no publish, no cutover.

## Authority (locked)

| Item | Status |
|---|---|
| OWNER_SELECTED_GEN_WORKING_SET | **22 URLs — ACTIVE AUTHORITY** |
| Previous Locked-7 | `SUPERSEDED_BY_OWNER_DIRECT_GEN_WORKING_SET` |
| Website architecture | ONE family + selectors (do not expose GEN CPs as cards) |
| SEM membership | **$149/month** |
| TIR membership | **$275/month** |
| Legacy B6 | Do not use in new architecture |
| Provider selection | Multiple compatible meds/strengths OK |
| Pricing authority | MBM rules — not old GEN prices |

Working-set baseline: `docs/MBM_OWNER_SELECTED_GEN_WORKING_SET.md`

## 1. Accepted reuse findings (preserved)

- **sem_mid_b12:** Prefer NF825… (Dirx SEM+B12 present)
- **sem_membership:** ONE $149 offer; backends MkDIUw… + wQK2Js… allowed
- **tir_membership:** ONE $275 offer; SvFDJ7… backend after collapse approval
- **minoxidil:** Do not use 489Yreh… for Dual Combo
- **b6:** Do not route via 7UMq… or other B6

## 2. TIR collapse decision (SvFDJ7)

**TIR_SINGLE_BACKEND_CP_APPROVED: YES**

**TIR_NEW_GEN_TIER_CREATES_REQUIRED: 0**

Backend CP: `SvFDJ7W4nmWL2bkLUMMS` — GLP-2 Weight Loss – Tirzepatide (Any Dose) (GEN $279)

### Criteria

| # | Criterion | Pass |
|---|---|---|
| 1 | Compatible Tirzepatide B12/Glycine medication family present | NO |
| 2 | Provider can select appropriate medication/strength | YES |
| 3 | Routing does not order a materially different product family | YES |
| 4 | Website can display correct MBM price per selector | YES |
| 5 | Membership can display $275 regardless of GEN $279 | YES |

### Live formulary summary

Dirx-Hub attachments include multiple **Tirzepatide + Vitamin B12** and **Tirzepatide + Glycine** options (plus starter/mid-starter B12 labels). No B6.

### Repair before ROUTING READY (collapse still APPROVED)

- Remove or quarantine Tirzepatide + Glycine (3 PACK) attachment if monthly/one-time orders must not offer 3-pack
- Optional: rename displayName away from legacy GLP-2 title
- Confirm checkout/payment path uses MBM $275 / tier prices, not GEN customerPrice $279

Website remains **ONE Tirzepatide product family**. Do **not** CREATE ×8 tier CPs.

## 3. Create re-audit (owner set first)

| Item | Classification | Creates | Notes |
|---|---|---:|---|
| Wolverine Capsule | **CREATE_ACTUALLY_REQUIRED** | 1 | iJtyig611AZEDBGdvRd9 has BPC-157/TB500 Capsules attached alongside injectable — cannot safely serve Capsule selector as-is (would order injection CP / mixed forms). After CREATE, move/remove capsule med from Injection CP iJtyig… (Injection becomes REUSE_WITH_REPAIR). |
| Minoxidil Dual (Finasteride/Minoxidil 0.1%/5%) | **CREATE_ACTUALLY_REQUIRED** | 1 | 489YrehNXRlL77fYPkOn is GHK-CU only — owner-locked Dual Combo is Fin/Minox 0.1%/5% Vios. Not compatible. Do not use 489Yreh… for Minoxidil Dual. Outside-owner CPs (BboYS4 empty, Raw7m wrong strengths/tret) are out of working-set authority for auto-reuse. |
| NAD Injection (100mg/mL packages) | **FORMULARY_PENDING** | 0 | No NAD injection CP in owner 22 (PRIG7 is AOD-9604). Locked owner decision: 100mg/mL — do not substitute 200mg/mL. Remains FORMULARY/SOURCING PENDING until 100mg/mL injectable is pharmacy-sourced. Not counted as CREATE until formulary exists. Outside-owner empty NAD Injectable shells are not approved substitutes. |
| NAD nasal r85 (200mg/ml · 15ml) | **CREATE_ACTUALLY_REQUIRED** | 1 | FVwkzvQqWIZRNAwbslGw is r84 nasal (verified) — wrong strength for r85 200mg/ml. Keep separate backend CP under ONE NAD+ family. Do not overload r84 CP with r85. Website: NAD+ → Nasal → strength selector. |
| Estradiol patches ×4 | **CREATE_ACTUALLY_REQUIRED** | 4 | No Estradiol patch products in owner 22. Four patch CPs still required for cutover variants r26–r29. Tablets/injection remain FUTURE_HIDDEN. |

**GEN products actually still required: 7** (was 8 minimum; NAD Injection reclassified to FORMULARY_PENDING; TIR creates = 0)

## 4. Fat Burner — 7Kix55

**FAT_BURNER_7KIX55_REUSE: NO**

**Incompatibility:** Live formulary on 7Kix55LA15U0lNvY9QXI contains only AOD 9604. Intended Fat Burner compound is AOD-9604 + MOTS-c + Tesamorelin (no Ipamorelin). Missing MOTS-c and Tesamorelin from attached formulary is a material under-delivery of the intended compound — not merely multiple compatible options. Title claims blend; attachments do not. yearpPaLo5H0k0FU5Ej8 includes Ipamorelin — also incompatible with no-Ipamorelin Fat Burner.

**Path:** Attach AOD+MOTS+Tes (no Ipamorelin) to 7Kix55… when pharmacy sourced; then REUSE_WITH_REPAIR toward website $259. Do not CREATE duplicate unless attach fails.

## 5. Final website → GEN routing table

Backend IDs are for routing only — **do not expose in customer UI**.

| WEBSITE FAMILY | WEBSITE SELECTOR | WEBSITE OPTION | WEBSITE PRICE | GEN CLIENT PRODUCT ID | GEN PRODUCT NAME | ROUTING METHOD | PAIRING STATUS | READY FOR WEBSITE ROUTING |
|---|---|---|---:|---|---|---|---|---|
| Semaglutide | Purchase · Formulation · Dose | Starting/Low · B12 | 89–99 | `SkqQHmsc0WdsbK9vmV1y` | Semaglutide Injection — Starting / Low (B12) | REUSE_AS_IS | PAIRING_VERIFIED | **YES** |
| Semaglutide | Purchase · Formulation · Dose | Mid · B12 | $109 | `NF825utCtjVqbbGsnQN3` | Semaglutide/B12 | REUSE_WITH_REPAIR | PAIRING_COMPATIBLE_NEEDS_REPAIR | **NO** |
| Semaglutide | Purchase · Formulation · Dose | High · B12 | 109–119 | `34I2X8MpVZf3AQTff3bo` | Semaglutide Injection — High (B12) | REUSE_AS_IS | PAIRING_VERIFIED | **YES** |
| Semaglutide | Purchase · Formulation · Dose | Any Dose · B12 | 89–119 | `MkDIUw0NcJB7YL2pNzYW` | Semaglutide Injection — Any Dose (B12) | REUSE_AS_IS | PAIRING_VERIFIED | **YES** |
| Semaglutide | Purchase · Formulation · Dose | Starting/Low · Glycine | 89–99 | `tk2GW39OGr7JX4MCCoJP` | Semaglutide Injection — Starting / Low (Glycine) | REUSE_AS_IS | PAIRING_VERIFIED | **YES** |
| Semaglutide | Purchase · Formulation · Dose | Mid · Glycine | $109 | `CjqOUbPuGPZzxephqRou` | Semaglutide Injection — Mid (Glycine) | REUSE_AS_IS | PAIRING_VERIFIED | **YES** |
| Semaglutide | Purchase · Formulation · Dose | High · Glycine | 109–119 | `sssEk3FDY4LFbQYGQsLx` | Semaglutide Injection — High (Glycine) | REUSE_AS_IS | PAIRING_VERIFIED | **YES** |
| Semaglutide | Purchase · Formulation · Dose | Any Dose · Glycine | 89–119 | `wQK2JsFnh7oFBf3Lag4n` | Semaglutide Injection — Any Dose (Glycine) | REUSE_AS_IS | PAIRING_VERIFIED | **YES** |
| Semaglutide | Purchase Type | Membership $149/mo (B12 backend) | $149 | `MkDIUw0NcJB7YL2pNzYW` | Semaglutide Injection — Any Dose (B12) | REUSE_WITH_REPAIR | PAIRING_VERIFIED_BACKEND_SPLIT | **NO** |
| Semaglutide | Purchase Type | Membership $149/mo (Glycine backend) | $149 | `wQK2JsFnh7oFBf3Lag4n` | Semaglutide Injection — Any Dose (Glycine) | REUSE_WITH_REPAIR | PAIRING_VERIFIED_BACKEND_SPLIT | **NO** |
| Semaglutide | Purchase · Formulation | Legacy B6 (until cutover) | — | `—` | — | DO_NOT_ROUTE_NEW_ARCH | B6_EXCLUDED | **NO** |
| Tirzepatide | Formulation · Dose | Starting/Low · B12 | 119–139 | `SvFDJ7W4nmWL2bkLUMMS` | GLP-2 Weight Loss – Tirzepatide (Any Dose) | REUSE_WITH_REPAIR_SINGLE_BACKEND | PAIRING_COMPATIBLE_NEEDS_REPAIR | **NO** |
| Tirzepatide | Formulation · Dose | Mid · B12 | 149–159 | `SvFDJ7W4nmWL2bkLUMMS` | GLP-2 Weight Loss – Tirzepatide (Any Dose) | REUSE_WITH_REPAIR_SINGLE_BACKEND | PAIRING_COMPATIBLE_NEEDS_REPAIR | **NO** |
| Tirzepatide | Formulation · Dose | High · B12 | 169–179 | `SvFDJ7W4nmWL2bkLUMMS` | GLP-2 Weight Loss – Tirzepatide (Any Dose) | REUSE_WITH_REPAIR_SINGLE_BACKEND | PAIRING_COMPATIBLE_NEEDS_REPAIR | **NO** |
| Tirzepatide | Formulation · Dose | Any Dose · B12 | 119–179 | `SvFDJ7W4nmWL2bkLUMMS` | GLP-2 Weight Loss – Tirzepatide (Any Dose) | REUSE_WITH_REPAIR_SINGLE_BACKEND | PAIRING_COMPATIBLE_NEEDS_REPAIR | **NO** |
| Tirzepatide | Formulation · Dose | Starting/Low · Glycine | 119–139 | `SvFDJ7W4nmWL2bkLUMMS` | GLP-2 Weight Loss – Tirzepatide (Any Dose) | REUSE_WITH_REPAIR_SINGLE_BACKEND | PAIRING_COMPATIBLE_NEEDS_REPAIR | **NO** |
| Tirzepatide | Formulation · Dose | Mid · Glycine | 149–159 | `SvFDJ7W4nmWL2bkLUMMS` | GLP-2 Weight Loss – Tirzepatide (Any Dose) | REUSE_WITH_REPAIR_SINGLE_BACKEND | PAIRING_COMPATIBLE_NEEDS_REPAIR | **NO** |
| Tirzepatide | Formulation · Dose | High · Glycine | 169–179 | `SvFDJ7W4nmWL2bkLUMMS` | GLP-2 Weight Loss – Tirzepatide (Any Dose) | REUSE_WITH_REPAIR_SINGLE_BACKEND | PAIRING_COMPATIBLE_NEEDS_REPAIR | **NO** |
| Tirzepatide | Formulation · Dose | Any Dose · Glycine | 119–179 | `SvFDJ7W4nmWL2bkLUMMS` | GLP-2 Weight Loss – Tirzepatide (Any Dose) | REUSE_WITH_REPAIR_SINGLE_BACKEND | PAIRING_COMPATIBLE_NEEDS_REPAIR | **NO** |
| Tirzepatide | Purchase Type | Membership $275/mo | $275 | `SvFDJ7W4nmWL2bkLUMMS` | GLP-2 Weight Loss – Tirzepatide (Any Dose) | REUSE_WITH_REPAIR_SINGLE_BACKEND | PAIRING_COMPATIBLE_NEEDS_REPAIR | **NO** |
| Tirzepatide | Purchase · Formulation | Legacy B6 (until cutover) | — | `—` | — | DO_NOT_ROUTE_NEW_ARCH | B6_EXCLUDED | **NO** |
| NAD+ | Delivery · Package | Nasal Spray · r84 · 50mg/ml · 15ml | $79 | `FVwkzvQqWIZRNAwbslGw` | NAD + Nasal Spray | REUSE_WITH_REPAIR | PAIRING_VERIFIED | **NO** |
| NAD+ | Delivery · Package | Nasal Spray · r85 · 200mg/ml · 15ml | $109 | `—` | — | CREATE_ACTUALLY_REQUIRED | NO_OWNER_CP | **NO** |
| NAD+ | Delivery · Package | Injection · 5 mL / 500 mg (100mg/mL) | $199 | `—` | — | FORMULARY_PENDING | NO_100MG_ML_IN_OWNER_SET | **NO** |
| NAD+ | Delivery · Package | Injection · 10 mL / 1000 mg (100mg/mL) | $229 | `—` | — | FORMULARY_PENDING | NO_100MG_ML_IN_OWNER_SET | **NO** |
| Wolverine / BPC-TB | Form | Injection | $159 | `iJtyig611AZEDBGdvRd9` | BPC-157/TB500 | REUSE_WITH_REPAIR | PAIRING_HAS_INCOMPATIBLE_MEDICATION | **NO** |
| Wolverine / BPC-TB | Form | Capsule | $29 | `—` | — | CREATE_ACTUALLY_REQUIRED | NO_OWNER_CAPSULE_CP | **NO** |
| Minoxidil | Formulation | Finasteride/Minoxidil 0.1%/5% Dual Combo | $79 | `—` | — | CREATE_ACTUALLY_REQUIRED | NO_COMPATIBLE_OWNER_CP | **NO** |
| Estradiol | Form · Strength | Transdermal patch r26 | $119 | `—` | — | CREATE_ACTUALLY_REQUIRED | NO_OWNER_CP | **NO** |
| Estradiol | Form · Strength | Transdermal patch r27 | $129 | `—` | — | CREATE_ACTUALLY_REQUIRED | NO_OWNER_CP | **NO** |
| Estradiol | Form · Strength | Transdermal patch r28 | $139 | `—` | — | CREATE_ACTUALLY_REQUIRED | NO_OWNER_CP | **NO** |
| Estradiol | Form · Strength | Transdermal patch r29 | $149 | `—` | — | CREATE_ACTUALLY_REQUIRED | NO_OWNER_CP | **NO** |
| Progesterone | Form · Strength | Progesterone IR (r41) | $29 | `5dGkjdpLP7DkKKE2iVxh` | Women's Hormones (HRT) – Progesterone | REUSE_WITH_REPAIR | PAIRING_HAS_INCOMPATIBLE_MEDICATION | **NO** |
| Progesterone | Form · Strength | Progesterone IR (r42) | $29 | `5dGkjdpLP7DkKKE2iVxh` | Women's Hormones (HRT) – Progesterone | REUSE_WITH_REPAIR | PAIRING_HAS_INCOMPATIBLE_MEDICATION | **NO** |
| Progesterone | Form · Strength | Progesterone IR (r43) | $29 | `5dGkjdpLP7DkKKE2iVxh` | Women's Hormones (HRT) – Progesterone | REUSE_WITH_REPAIR | PAIRING_HAS_INCOMPATIBLE_MEDICATION | **NO** |
| Progesterone | Form · Strength | Progesterone IR (r44) | $29 | `5dGkjdpLP7DkKKE2iVxh` | Women's Hormones (HRT) – Progesterone | REUSE_WITH_REPAIR | PAIRING_HAS_INCOMPATIBLE_MEDICATION | **NO** |
| Progesterone | Form · Strength | Progesterone IR (r45) | $29 | `5dGkjdpLP7DkKKE2iVxh` | Women's Hormones (HRT) – Progesterone | REUSE_WITH_REPAIR | PAIRING_HAS_INCOMPATIBLE_MEDICATION | **NO** |
| Progesterone | Form · Strength | Progesterone IR (r46) | $29 | `5dGkjdpLP7DkKKE2iVxh` | Women's Hormones (HRT) – Progesterone | REUSE_WITH_REPAIR | PAIRING_HAS_INCOMPATIBLE_MEDICATION | **NO** |
| Progesterone | Form · Strength | Progesterone IR (r47) | $29 | `5dGkjdpLP7DkKKE2iVxh` | Women's Hormones (HRT) – Progesterone | REUSE_WITH_REPAIR | PAIRING_HAS_INCOMPATIBLE_MEDICATION | **NO** |
| Progesterone | Form · Strength | Progesterone IR (r48) | $29 | `5dGkjdpLP7DkKKE2iVxh` | Women's Hormones (HRT) – Progesterone | REUSE_WITH_REPAIR | PAIRING_HAS_INCOMPATIBLE_MEDICATION | **NO** |
| Progesterone | Form · Strength | Progesterone IR (r49) | $29 | `5dGkjdpLP7DkKKE2iVxh` | Women's Hormones (HRT) – Progesterone | REUSE_WITH_REPAIR | PAIRING_HAS_INCOMPATIBLE_MEDICATION | **NO** |
| Fat Burner | Compound | AOD-9604 + MOTS-c + Tesamorelin (no Ipamorelin) | $259 | `7Kix55LA15U0lNvY9QXI` | AOD-9604 / MOTS-C / Tesamorelin Injection | FORMULARY_PENDING | INCOMPLETE_FORMULARY_AOD_ONLY | **NO** |

## 6. Recalculated needs

```
OWNER WORKING SET: 22
WEBSITE VARIANTS ROUTABLE USING OWNER SET: 31
REUSE AS-IS: 7
REUSE + REPAIR: 23
GEN PRODUCTS ACTUALLY STILL REQUIRED: 7
FORMULARY/SOURCING PENDING: NAD Injection 100mg/mL + Fat Burner 7Kix55 attach (+ other CURRENT families outside owner set)
TIR NEW CP CREATES: 0
ESTRADIOL NEW CP CREATES: 4
NAD NEW CP CREATES: 1
WOLVERINE NEW CP CREATES: 1
MINOXIDIL NEW CP CREATES: 1
FAT BURNER NEW CP CREATES: 0
```

Notes:
- REUSE AS-IS / REUSE + REPAIR counts are **routing-table variant rows** (TIR collapse maps 9 selectors to one repair CP).
- NAD Injection is **FORMULARY_PENDING** (not a create) until 100mg/mL is sourced.
- Fat Burner create = 0 if 7Kix55 can be completed without Ipamorelin.

## 7. Website readiness gate

**WEBSITE FAMILY UX READY:** YES  
_Family architecture (one product + selectors) is locked and previewable; customer UI must not expose GEN IDs._

**WEBSITE → GEN ROUTING MAP READY:** YES  
_This preflight map is the proposed final map under owner 22 authority — pending owner acceptance of TIR collapse YES and create/pending lists._

**GEN BACKEND READY FOR ALL CURRENT/CUTOVER ROUTES:** NO

**FORMULARY/SOURCING ITEMS STILL BLOCKING:**

- NAD+ Injection 100mg/mL (5mL/10mL) — source exact 100mg/mL; do not substitute 200mg/mL
- Fat Burner 7Kix55… — attach full AOD+MOTS+Tes (no Ipamorelin) formulary
- Other CURRENT FORMULARY_PENDING families outside owner set (Tretinoin, Testosterone cream, Selank/Semax, Tesamorelin plain, Lash/Brow, Oxytocin, Sexual Wellness) — not covered by owner 22

**GEN CREATES STILL REQUIRED:**

- Wolverine Capsule ×1
- Minoxidil Dual Combo ×1
- NAD nasal r85 ×1
- Estradiol patches ×4

**GEN REPAIRS STILL REQUIRED:**

- NF825… SEM Mid B12: rename/reprice $109; re-verify
- SvFDJ7… TIR: remove 3-PACK; optional rename; confirm MBM price path; then verify for all TIR selectors
- FVwkzv… NAD r84: set retail toward $79
- iJtyig… Wolverine Injection: remove capsule medication
- 5dGkjdp… Progesterone: remove Pregnenolone + SR
- SEM Membership routing: wire MkDIUw…/wQK2Js… backends @ $149 (ONE website offer)
- TIR Membership routing: wire SvFDJ7… @ $275 (ONE website offer)

**MANUAL GEN PAIRINGS STILL REQUIRED:**

- After repairs above, re-verify pairings for NF825, SvFDJ7, iJtyig, 5dGkjdp
- After CREATE: Wolverine Capsule, Minoxidil Dual, NAD r85, Estradiol ×4 — attach formulary in GEN admin
- After Fat Burner formulary attach on 7Kix55 — verify
- NAD Injection 100mg/mL — pair only after sourcing

**READY TO BUILD FINAL WEBSITE ROUTING:** YES  
_Code/routing table build may proceed against this map after owner accepts preflight; do not publish or enable cutover/real GEN orders yet._

**READY TO PUBLISH:** NO

## Hard locks

```
GEN MODIFIED: NO
PAIRINGS MODIFIED: NO
GEN PRODUCTS CREATED: 0
WEBSITE PUBLISHED: NO
REAL GEN ORDERS: OFF
CUTOVER: OFF
LEGACY B6 PRODUCTION: UNCHANGED
PR #19: OPEN / NOT MERGED
STOP FOR OWNER REVIEW.
```

## Related

- `docs/MBM_OWNER_SELECTED_GEN_WORKING_SET.md`
- `docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md`
- Machine twin: `docs/MBM_OWNER_SET_FINAL_ROUTING_PREFLIGHT.json`

