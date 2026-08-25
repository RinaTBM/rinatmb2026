# MBM GEN Price Conflict Resolution

**Generated:** 2026-08-25T00:48:39Z  
**Phase:** MBM-GEN-PRICE-CONFLICT-RESOLUTION-1  
**Mode:** READ-ONLY — DO NOT EXECUTE  

Website architecture remains **LOCKED** (one family → selectors → exact GEN backend route).
Website family ≠ GEN CP. Backend splits are allowed when price/formulation/package require it.

## Manifest list check

- Manifest PRICE_CONFLICT CPs: `5dGkjdpLP7DkKKE2iVxh, BboYS4a2Uj7APetrFo6W, FVwkzvQqWIZRNAwbslGw, Ukctbyh5Yrek3SnGSYA3, YTHcdrlRICMpt56hdxeJ, iJtyig611AZEDBGdvRd9, o7dNtf9QsnEqPCrLr2tR, omhh3NabouO8AsNR5tkD`
- Expected 8-item list match: **True**

---

# Conflict resolutions (8/8)

## 1. Wolverine Injection

- **GEN CP:** `iJtyig611AZEDBGdvRd9`
- **Current name / price:** BPC-157/TB500 / $169
- **Website family:** Wolverine / BPC-TB
- **Variants:** `wolverine-injection`
- **Classification:** `A_SIMPLE_PRICE_REPAIR`
- **Executable now:** True
- **Resolution:** Set GEN price 169 → 159. Exact SELECTED r103 supports $159 ((77×1.75)+25 → 159.75 → $159). Keep Greenwich pairing; verify strength 3mg/3mg/mL · 5mL in admin.
- **Formulary:** r103 · BPC-157/TB500 3mg/3mg/mL · Greenwich Pharmacy · cost $77 · ship $25 · locked **$159**

## 2. NAD+ Nasal

- **GEN CP:** `FVwkzvQqWIZRNAwbslGw`
- **Current name / price:** NAD + Nasal Spray / $0
- **Website family:** NAD+
- **Variants:** `nad-nasal-r84`, `nad-nasal-r85`
- **Classification:** `B_GEN_CP_SPLIT_REQUIRED`
- **Executable now:** True
- **Resolution:** One CP cannot hold both $79 and $109. Split backend: reuse existing NAD nasal CP for r84 @ $79; CREATE new CP for r85 @ $109. Website remains ONE NAD+ family with Nasal Spray → strength selectors.

## 3. Wolverine Capsule

- **GEN CP:** `omhh3NabouO8AsNR5tkD`
- **Current name / price:** Wolverine – BPC-157 + TB-500 Recovery Protocol / $0
- **Website family:** Wolverine / BPC-TB
- **Variants:** `wolverine-capsule`
- **Classification:** `A_SIMPLE_PRICE_REPAIR`
- **Executable now:** True
- **Resolution:** Single sellable capsule option. Set GEN price 0 → 29 from r104 ((3.2×1.75)+25 → 30.60 → $29). Pair Greenwich r104. Independent from injection economics.
- **Formulary:** r104 · BPC-157/TB500 capsules 500MCG/500MCG · Greenwich Pharmacy · cost $3.2 · ship $25 · locked **$29**

## 4. Minoxidil / Finasteride 0.1%/5%

- **GEN CP:** `BboYS4a2Uj7APetrFo6W`
- **Current name / price:** Hair Loss – Dual Combo (Finasteride/Minoxidil) / $0
- **Website family:** Minoxidil
- **Variants:** `minoxidil-fin-minox-0.1-5`
- **Classification:** `A_SIMPLE_PRICE_REPAIR`
- **Executable now:** True
- **Resolution:** Existing Dual Combo CP cleanly represents Finasteride/Minoxidil (not GHK-Cu/Minoxidil). Set price 0 → 79 from r129 ((30×1.75)+30 → 82.50 → $79). Manual pair Vios r129. Do not use 489YrehNXRlL77fYPkOn.
- **Formulary:** r129 · FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 % · Vios · cost $30 · ship $30 · locked **$79**

## 5. Estradiol patches

- **GEN CP:** `o7dNtf9QsnEqPCrLr2tR`
- **Current name / price:** Women's Hormones (HRT) – Vaginal Health (Estradiol / DHEA) / $0
- **Website family:** Estradiol
- **Variants:** `estradiol-patch-r26`, `estradiol-patch-r27`, `estradiol-patch-r28`, `estradiol-patch-r29`
- **Classification:** `B_GEN_CP_SPLIT_REQUIRED`
- **Executable now:** True
- **Resolution:** Existing CP is Vaginal Health (Estradiol/DHEA) — clinically wrong for transdermal patches. Four patch strengths have four different retail prices. CREATE four backend CPs (one per strength/price). Do not repair vaginal CP into a patch product. Website remains ONE Estradiol family with patch strength selectors.

## 6. Progesterone IR

- **GEN CP:** `5dGkjdpLP7DkKKE2iVxh`
- **Current name / price:** Women's Hormones (HRT) – Progesterone / $0
- **Website family:** Progesterone
- **Variants:** `prog-ir-r41`, `prog-ir-r42`, `prog-ir-r43`, `prog-ir-r44`, `prog-ir-r45`, `prog-ir-r46`, `prog-ir-r47`, `prog-ir-r48`, `prog-ir-r49`
- **Classification:** `A_SIMPLE_PRICE_REPAIR`
- **Executable now:** True
- **Resolution:** CP identity (Progesterone) is appropriate. All 9 IR/capsule SELECTED rows lock to $29 — no price-driven split required. Set GEN price 0 → 29. Manual-pair exact Vios rows; verify each strength in admin. Prefer this CP over BiEst combo CPs.

## 7. Selank nasal

- **GEN CP:** `Ukctbyh5Yrek3SnGSYA3`
- **Current name / price:** Selank Anxiolytic & Cognitive Protocol / $0
- **Website family:** Selank
- **Variants:** `selank-nasal-r119`
- **Classification:** `E_FUTURE_HIDDEN_NO_EXECUTION`
- **Executable now:** False
- **Resolution:** Remove selank-nasal-r119 from executable manifest. Do not price/pair/activate now. Selank Injection (selank-current) remains FORMULARY_PENDING — nasal must not substitute.

## 8. Semax nasal

- **GEN CP:** `YTHcdrlRICMpt56hdxeJ`
- **Current name / price:** Semax Nootropic & Neuroprotective Protocol / $0
- **Website family:** Semax
- **Variants:** `semax-nasal-r118`
- **Classification:** `E_FUTURE_HIDDEN_NO_EXECUTION`
- **Executable now:** False
- **Resolution:** Remove semax-nasal-r118 from executable manifest. Do not price/pair/activate now. Semax Injection remains FORMULARY_PENDING — nasal must not substitute.

---

# Backend routing models

## NAD+

| Website family | Patient selector | Patient option | Retail | GEN CP | Row | Pharmacy | Status |
|---|---|---|---:|---|---:|---|---|
| NAD+ | Delivery | Injection · 5mL/500mg (100mg/mL) | 199 | `None` | — | — | FORMULARY_PENDING |
| NAD+ | Delivery | Injection · 10mL/1000mg (100mg/mL) | 229 | `None` | — | — | FORMULARY_PENDING |
| NAD+ | Delivery → Nasal Spray → Strength | 50mg/mL · 15mL (r84) | 79 | `FVwkzvQqWIZRNAwbslGw` | 84 | St Luke | REPAIR_PRICE_PLUS_PAIR |
| NAD+ | Delivery → Nasal Spray → Strength | 200mg/mL · 15mL (r85) | 109 | `CREATE_REQUIRED` | 85 | St Luke | CREATE_PLUS_PAIR |

## Estradiol

| Website family | Patient selector | Patient option | Retail | GEN CP | Row | Pharmacy | Status |
|---|---|---|---:|---|---:|---|---|
| Estradiol | Patch strength | 0.025mg/hr · 8 count | 119 | `CREATE_REQUIRED` | 26 | Valiant | CREATE_PLUS_PAIR |
| Estradiol | Patch strength | 0.0375mg/hr · 8 count | 129 | `CREATE_REQUIRED` | 27 | Valiant | CREATE_PLUS_PAIR |
| Estradiol | Patch strength | 0.05mg/hr · 8 count | 139 | `CREATE_REQUIRED` | 28 | Valiant | CREATE_PLUS_PAIR |
| Estradiol | Patch strength | 0.1mg/hr · 8 count | 149 | `CREATE_REQUIRED` | 29 | Valiant | CREATE_PLUS_PAIR |

## Wolverine

| Website family | Patient selector | Patient option | Retail | GEN CP | Row | Pharmacy | Status |
|---|---|---|---:|---|---:|---|---|
| Wolverine / BPC-TB | Form | Injection | 159 | `iJtyig611AZEDBGdvRd9` | 103 | Greenwich Pharmacy | SIMPLE_PRICE_REPAIR |
| Wolverine / BPC-TB | Form | Capsule | 29 | `omhh3NabouO8AsNR5tkD` | 104 | Greenwich Pharmacy | SIMPLE_PRICE_REPAIR_PLUS_PAIR |

## Minoxidil

| Website family | Patient selector | Patient option | Retail | GEN CP | Row | Pharmacy | Status |
|---|---|---|---:|---|---:|---|---|
| Minoxidil | Formula | Finasteride/Minoxidil 0.1%/5% | 79 | `BboYS4a2Uj7APetrFo6W` | 129 | Vios | SIMPLE_PRICE_REPAIR_PLUS_PAIR |

## Progesterone

| Website family | Patient selector | Patient option | Retail | GEN CP | Row | Pharmacy | Status |
|---|---|---|---:|---|---:|---|---|
| Progesterone | IR strength | PROGESTERONE 100MG CAPSULE 100mg | 29 | `5dGkjdpLP7DkKKE2iVxh` | 41 | Vios | SIMPLE_PRICE_REPAIR_PLUS_PAIR |
| Progesterone | IR strength | PROGESTERONE 200MG CAPSULE 200mg | 29 | `5dGkjdpLP7DkKKE2iVxh` | 42 | Vios | SIMPLE_PRICE_REPAIR_PLUS_PAIR |
| Progesterone | IR strength | PROGESTERONE 50MG CAPSULE 50mg | 29 | `5dGkjdpLP7DkKKE2iVxh` | 43 | Vios | SIMPLE_PRICE_REPAIR_PLUS_PAIR |
| Progesterone | IR strength | PROGESTERONE IR 100 MG | 29 | `5dGkjdpLP7DkKKE2iVxh` | 44 | Vios | SIMPLE_PRICE_REPAIR_PLUS_PAIR |
| Progesterone | IR strength | PROGESTERONE IR 150 MG | 29 | `5dGkjdpLP7DkKKE2iVxh` | 45 | Vios | SIMPLE_PRICE_REPAIR_PLUS_PAIR |
| Progesterone | IR strength | PROGESTERONE IR 200 MG | 29 | `5dGkjdpLP7DkKKE2iVxh` | 46 | Vios | SIMPLE_PRICE_REPAIR_PLUS_PAIR |
| Progesterone | IR strength | PROGESTERONE IR (DYE-FREE)(LACTOSE-FREE) (M NEW) 200MG | 29 | `5dGkjdpLP7DkKKE2iVxh` | 47 | Vios | SIMPLE_PRICE_REPAIR_PLUS_PAIR |
| Progesterone | IR strength | PROGESTERONE IR 300 MG | 29 | `5dGkjdpLP7DkKKE2iVxh` | 48 | Vios | SIMPLE_PRICE_REPAIR_PLUS_PAIR |
| Progesterone | IR strength | PROGESTERONE IR 400 MG | 29 | `5dGkjdpLP7DkKKE2iVxh` | 49 | Vios | SIMPLE_PRICE_REPAIR_PLUS_PAIR |

---

# Recalculated execution set

| Status | Count |
|---|---:|
| `ROUTING_READY` | 0 |
| `GEN_PRODUCT_CREATE_REQUIRED` | 13 |
| `GEN_PRODUCT_REPAIR_REQUIRED` | 22 |
| `GEN_PAIRING_REQUIRED` | 1 |
| `FORMULARY_PENDING` | 14 |
| `PRICE_PENDING` | 0 |
| `FUTURE_HIDDEN` | 53 |
| `BLOCKED_OWNER_REVIEW` | 0 |

- **Execution-eligible website variants:** 36
- **Unique GEN CREATE:** 13
- **Unique GEN REPAIR CPs:** 14
- **GEN_PAIRING_REQUIRED status residual:** 1 (`BLf8inX395YNc7WPCD4O` SEM Mid B12)
- **Unique GEN targets needing pairing work (create+repair+pair):** 28
- **Manual GEN admin pairing row actions:** 64 (API writable: 0)
- **Remaining PRICE_CONFLICT / STRUCTURE / STOP:** 0 / 0 / 0

CREATE variants: `tir-b12-starting-low`, `tir-b12-mid`, `tir-b12-high`, `tir-b12-any-dose`, `tir-glycine-starting-low`, `tir-glycine-mid`, `tir-glycine-high`, `tir-glycine-any-dose`, `nad-nasal-r85`, `estradiol-patch-r26`, `estradiol-patch-r27`, `estradiol-patch-r28`, `estradiol-patch-r29`

---

# FINAL REPORT

| Item | Value |
|---|---|
| PRICE_CONFLICTS_STARTING | 8 |
| SIMPLE_PRICE_REPAIR | 4 |
| GEN_CP_SPLIT_REQUIRED | 2 |
| ALREADY_CORRECT | 0 |
| FORMULARY_PENDING_FROM_CONFLICTS | 0 |
| FUTURE_HIDDEN_REMOVED | 2 |
| OTHER_BLOCKERS | 0 |
| NAD_NASAL_BACKEND_STRUCTURE | SPLIT — r84 reuses FVwkzvQqWIZRNAwbslGw @$79; r85 CREATE @$109; one website NAD+ family |
| ESTRADIOL_BACKEND_STRUCTURE | SPLIT CREATE×4 patch CPs (do not reuse vaginal Estradiol/DHEA CP); one website Estradiol family |
| WOLVERINE_BACKEND_STRUCTURE | Injection CP iJty… @$159 + Capsule CP omhh… @$29; one website Wolverine family |
| MINOXIDIL_BACKEND_STRUCTURE | Reuse Dual Combo BboYS… @$79 + Vios r129; not GHK-Cu/Minoxidil |
| PROGESTERONE_BACKEND_STRUCTURE | Reuse Progesterone CP 5dGk… @$29 with multi-strength IR pairings (all $29) |
| SELANK_NASAL_EXECUTABLE | NO |
| SEMAX_NASAL_EXECUTABLE | NO |
| UNIQUE_GEN_CREATE_REQUIRED | 13 |
| UNIQUE_GEN_REPAIR_REQUIRED | 14 |
| UNIQUE_GEN_CPS_REQUIRING_PAIRING_STATUS_ONLY | 1 |
| MANUAL_GEN_ADMIN_PAIRING_ACTIONS | 64 |
| REMAINING_PRICE_CONFLICTS | 0 |
| REMAINING_STRUCTURE_CONFLICTS | 0 |
| REMAINING_STOP_ITEMS | 0 |
| FORMULARY_PENDING | 14 |
| FUTURE_HIDDEN | 53 |
| EXECUTION_ELIGIBLE_WEBSITE_VARIANTS | 36 |
| ALL_EXECUTABLE_PRICES_VERIFIED_FROM_COST_SHIPPING | YES |
| ALL_EXECUTABLE_GEN_CP_IDENTITIES_EXACTLY_SUPPORTED | YES |
| READY_FOR_GEN_WRITE_EXECUTION | YES |
| READY_NOTE | READY means resolution cleared STOP items. Owner must still explicitly authorize write execution. Pairings remain MANUAL_GEN_ADMIN. |
| GEN_MODIFIED | False |
| GEN_WRITES | 0 |
| PAIRING_WRITES | 0 |
| WEBSITE_MODIFIED | False |
| CHECKOUT_MODIFIED | False |
| CUTOVER | OFF |
| UNIQUE_GEN_CPS_REQUIRING_PAIRING | 28 |
| MANUAL_PAIRING_NOTE | Row-level ADD count includes SEM/TIR membership ladders and multi-strength Prog/SEM dose groups. API writable = 0. |

| Classification | Count |
|---|---:|
| A_SIMPLE_PRICE_REPAIR | 4 |
| B_GEN_CP_SPLIT_REQUIRED | 2 |
| C_ALREADY_CORRECT_NO_WRITE | 0 |
| D_FORMULARY_PENDING | 0 |
| E_FUTURE_HIDDEN_NO_EXECUTION | 2 |
| F_OTHER_BLOCKER | 0 |

**STOP FOR OWNER REVIEW. DO NOT EXECUTE.**

GEN MODIFIED: NO · WRITES: 0 · PAIRING WRITES: 0  
WEBSITE / CHECKOUT MODIFIED: NO · CUTOVER: OFF
