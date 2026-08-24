# MBM Website → GEN Routing Matrix (Completion Gate)

**Generated:** 2026-08-24T22:50:26Z  
**Phase:** MBM-GEN-ROUTING-COMPLETION-GATE-1  
**Mode:** READ-ONLY RECONCILIATION — no GEN/website/pairing writes · Cutover OFF · No GEN-CATALOG-2B

Website architecture **LOCKED** (owner-approved): one product family → selectable variants → exact GEN route.

Execution queues (do not execute): [`MBM_GEN_ROUTING_EXECUTION_QUEUE.md`](./MBM_GEN_ROUTING_EXECUTION_QUEUE.md)

---

## Status definitions

- **`ROUTING_READY`** — Exact website→GEN CP→formulary→pharmacy→package→price path proven
- **`GEN_PRODUCT_CREATE_REQUIRED`** — No appropriate GEN CP; create at execution
- **`GEN_PRODUCT_REPAIR_REQUIRED`** — GEN CP exists but needs correction (price/pairing/name/attachments)
- **`GEN_PAIRING_REQUIRED`** — CP exists (or identified) but exact formulary attachment missing/unproven
- **`FORMULARY_PENDING`** — Exact formulary unavailable — sourcing required
- **`PRICE_PENDING`** — Cost/package incomplete — cannot compute retail
- **`FUTURE_HIDDEN`** — Not patient-visible yet
- **`BLOCKED_OWNER_REVIEW`** — Unsafe, transitional, or owner decision required before routing

Where multiple actions are needed: `PRIMARY_STATUS` + `REQUIRED_ACTIONS[]`.

---

## Counts

| Status | Count |
|---|---:|
| `ROUTING_READY` | 0 |
| `GEN_PRODUCT_CREATE_REQUIRED` | 8 |
| `GEN_PRODUCT_REPAIR_REQUIRED` | 10 |
| `GEN_PAIRING_REQUIRED` | 20 |
| `FORMULARY_PENDING` | 14 |
| `PRICE_PENDING` | 0 |
| `FUTURE_HIDDEN` | 43 |
| `BLOCKED_OWNER_REVIEW` | 8 |
| **TOTAL VARIANTS** | **103** |
| **TOTAL FAMILIES** | **30** |

---

## Semaglutide (1 family)

Live inventory: all 8 one-time dose-group CPs **exist**. Mid (B12) has **no** formulary attachment. Others need repair (price alignment / exact strength med verification / strip non-Dirx-Hub attachments on Any Dose B12).

| Option | GEN CP | Primary status | Required actions |
|---|---|---|---|
| `sem-b12-starting-low` | `SkqQHmsc0WdsbK9vmV1y` | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY |
| `sem-b12-mid` | `BLf8inX395YNc7WPCD4O` | `GEN_PAIRING_REQUIRED` | ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, VERIFY_PRICE_VS_LOCKED_X9 |
| `sem-b12-high` | `34I2X8MpVZf3AQTff3bo` | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY |
| `sem-b12-any-dose` | `MkDIUw0NcJB7YL2pNzYW` | `GEN_PRODUCT_REPAIR_REQUIRED` | REPAIR_FORMULARY_PAIRINGS_DIRX_HUB_ONLY, REMOVE_NON_SELECTED_PHARMACY_ATTACHMENTS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY, VERIFY_EXACT_STRENGTH_MED_IDS |
| `sem-glycine-starting-low` | `tk2GW39OGr7JX4MCCoJP` | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY |
| `sem-glycine-mid` | `CjqOUbPuGPZzxephqRou` | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY |
| `sem-glycine-high` | `sssEk3FDY4LFbQYGQsLx` | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY |
| `sem-glycine-any-dose` | `wQK2JsFnh7oFBf3Lag4n` | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY |
| `sem-current-b6` | `—` | `BLOCKED_OWNER_REVIEW` | REMOVE_AT_WEBSITE_CUTOVER, DO_NOT_REINTRODUCE_B6 |
| `sem-membership` | `5F8jESeVeXcpkLU5rrdK` | `GEN_PRODUCT_REPAIR_REQUIRED` | CONFIRM_OR_CREATE_BACKEND_B12_GLYCINE_MEMBERSHIP_SPLIT_IF_GEN_REQUIRES, KEEP_ONE_WEBSITE_MEMBERSHIP_OFFER, VERIFY_PRICE_149 |
| `sem-b12-3month` | `sN2ggSXRJINjElMYTQjf` | `FUTURE_HIDDEN` | REPAIR_PAIRING_WHEN_LAUNCHING, VERIFY_3MONTH_PRICE_FORMULA |

**Membership backend:** ONE website offer $149; backend B12/Glycine split allowed if GEN requires — not exposed as separate cards

---

## Tirzepatide (1 family)

**Live inventory verification: CONFIRMED** — no `Tirzepatide Injection — {tier} (B12|Glycine)` CPs exist. Legacy GLP-2 plans and ambiguous `Tirzepatide/B12/Glycine` / `Tirzepatide/Glycine/B12` must **not** be reused.

All **8** one-time variants: `GEN_PRODUCT_CREATE_REQUIRED`.

**Membership backend:** ONE website offer $275 at cutover; backend B12/Glycine split allowed if GEN requires

---

## NAD+ (1 family)

| Variant | Strength/Package | Formulary | GEN | Status |
|---|---|---|---|---|
| `nad-inj-5ml-500` | NAD+ 100mg/mL (website) · 5mL / 500mg total | — | `SHJpGAACUFEeMONdpEbn` | `FORMULARY_PENDING` |
| `nad-inj-10ml-1000` | NAD+ 100mg/mL (website) · 10mL / 1000mg total | — | `SHJpGAACUFEeMONdpEbn` | `FORMULARY_PENDING` |
| `nad-inj-selected-r83` | NAD+ (Nicotinamide Adenine Dinucleotide) 200mg/ml · 5ml vial (1000mg) | r83 | `SHJpGAACUFEeMONdpEbn` | `BLOCKED_OWNER_REVIEW` |
| `nad-nasal-r84` | NAD+ 50mg/ml · 15ml | r84 | `FVwkzvQqWIZRNAwbslGw` | `GEN_PAIRING_REQUIRED` |
| `nad-nasal-r85` | NAD+ 200mg/ml · 15ml | r85 | `FVwkzvQqWIZRNAwbslGw` | `GEN_PAIRING_REQUIRED` |
| `nad-nasal-r81` | NAD+ 50mg/ml · 15ml | r81 | `FVwkzvQqWIZRNAwbslGw` | `BLOCKED_OWNER_REVIEW` |
| `nad-nasal-r82` | NAD+ 200mg/ml · 15ml | r82 | `FVwkzvQqWIZRNAwbslGw` | `BLOCKED_OWNER_REVIEW` |

Injection 100mg/mL website variants remain **FORMULARY_PENDING** — do **not** substitute SELECTED r83 200mg/ml.
Selectable nasal: **r84** (50mg/ml 15ml → $79) and **r85** (200mg/ml 15ml → $109) under GEN `FVwkzvQqWIZRNAwbslGw` → `GEN_PAIRING_REQUIRED`.

---

## Wolverine (1 family)

- **Capsule:** `GEN_PAIRING_REQUIRED` — SELECTED r104 · GEN `omhh3NabouO8AsNR5tkD`
- **Injection:** `GEN_PRODUCT_REPAIR_REQUIRED` — SELECTED r103 · GEN `iJtyig611AZEDBGdvRd9` (verify exact pairing, not GHK/KPV blends)

---

## PT-141 (1 family)

- Injection + Nasal: both **FUTURE_HIDDEN** (nasal requires explicit owner activation)
- SELECTED: r115 inj · r116/r117 nasal

---

## Full routing table

| Family | Option | Delivery | Purchase | Retail | GEN | Formulary | Primary | Actions | Launch |
|---|---|---|---|---|---|---|---|---|---|
| Semaglutide | `sem-b12-starting-low` | Injection | one_time | 89–99 | `SkqQHmsc0WdsbK9vmV1y` | r3,r5 | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS;ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-b12-mid` | Injection | one_time | 109 | `BLf8inX395YNc7WPCD4O` | r7 | `GEN_PAIRING_REQUIRED` | ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS;VERIFY_PRICE_VS_LOCKED_X9 | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-b12-high` | Injection | one_time | 109–119 | `34I2X8MpVZf3AQTff3bo` | r9,r11 | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS;ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-b12-any-dose` | Injection | one_time | 89–119 | `MkDIUw0NcJB7YL2pNzYW` | r3,r5,r7,r9,r11 | `GEN_PRODUCT_REPAIR_REQUIRED` | REPAIR_FORMULARY_PAIRINGS_DIRX_HUB_ONLY;REMOVE_NON_SELECTED_PHARMACY_ATTACHMENTS | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-starting-low` | Injection | one_time | 89–99 | `tk2GW39OGr7JX4MCCoJP` | r2,r4 | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS;ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-mid` | Injection | one_time | 109 | `CjqOUbPuGPZzxephqRou` | r6 | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS;ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-high` | Injection | one_time | 109–119 | `sssEk3FDY4LFbQYGQsLx` | r8,r10 | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS;ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-any-dose` | Injection | one_time | 89–119 | `wQK2JsFnh7oFBf3Lag4n` | r2,r4,r6,r8,r10 | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS;ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-current-b6` | Injection | one_time | — | `—` | — | `BLOCKED_OWNER_REVIEW` | REMOVE_AT_WEBSITE_CUTOVER;DO_NOT_REINTRODUCE_B6 | CURRENT_LIVE |
| Semaglutide | `sem-membership` | Injection | membership | 149 | `5F8jESeVeXcpkLU5rrdK` | — | `GEN_PRODUCT_REPAIR_REQUIRED` | CONFIRM_OR_CREATE_BACKEND_B12_GLYCINE_MEMBERSHIP_SPLIT_IF_GEN_REQUIRES;KEEP_ONE_WEBSITE_MEMBERSHIP_OFFER | CURRENT_LIVE |
| Semaglutide | `sem-b12-3month` | Injection | 3_month | — | `sN2ggSXRJINjElMYTQjf` | r3,r5,r7,r9,r11 | `FUTURE_HIDDEN` | REPAIR_PAIRING_WHEN_LAUNCHING;VERIFY_3MONTH_PRICE_FORMULA | FUTURE_HIDDEN |
| Tirzepatide | `tir-b12-starting-low` | Injection | one_time | 119–139 | `—` | r14,r16 | `GEN_PRODUCT_CREATE_REQUIRED` | CREATE_GEN_CP;ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-b12-mid` | Injection | one_time | 149–159 | `—` | r18,r20 | `GEN_PRODUCT_CREATE_REQUIRED` | CREATE_GEN_CP;ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-b12-high` | Injection | one_time | 169–179 | `—` | r22,r24 | `GEN_PRODUCT_CREATE_REQUIRED` | CREATE_GEN_CP;ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-b12-any-dose` | Injection | one_time | 119–179 | `—` | r14,r16,r18,r20,r22,r24 | `GEN_PRODUCT_CREATE_REQUIRED` | CREATE_GEN_CP;ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-starting-low` | Injection | one_time | 119–139 | `—` | r13,r15 | `GEN_PRODUCT_CREATE_REQUIRED` | CREATE_GEN_CP;ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-mid` | Injection | one_time | 149–159 | `—` | r17,r19 | `GEN_PRODUCT_CREATE_REQUIRED` | CREATE_GEN_CP;ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-high` | Injection | one_time | 169–179 | `—` | r21,r23 | `GEN_PRODUCT_CREATE_REQUIRED` | CREATE_GEN_CP;ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-any-dose` | Injection | one_time | 119–179 | `—` | r13,r15,r17,r19,r21,r23 | `GEN_PRODUCT_CREATE_REQUIRED` | CREATE_GEN_CP;ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-current-b6` | Injection | one_time | — | `—` | — | `BLOCKED_OWNER_REVIEW` | REMOVE_AT_WEBSITE_CUTOVER;DO_NOT_REINTRODUCE_B6 | CURRENT_LIVE |
| Tirzepatide | `tir-membership` | Injection | membership | 275 | `E3MXZeeR01QROCuTLRLE` | — | `GEN_PRODUCT_REPAIR_REQUIRED` | CONFIRM_OR_CREATE_BACKEND_B12_GLYCINE_MEMBERSHIP_SPLIT_IF_GEN_REQUIRES;KEEP_ONE_WEBSITE_MEMBERSHIP_OFFER | CURRENT_LIVE |
| NAD+ | `nad-inj-5ml-500` | Injection | one_time | 199 | `SHJpGAACUFEeMONdpEbn` | — | `FORMULARY_PENDING` | SOURCE_OR_ADD_SELECTED_100MG_ML_INJECTABLE;OR_OWNER_DECIDES_WEBSITE_CHANGE_TO_R83_200MG_ML | CURRENT_LIVE |
| NAD+ | `nad-inj-10ml-1000` | Injection | one_time | 229 | `SHJpGAACUFEeMONdpEbn` | — | `FORMULARY_PENDING` | SOURCE_OR_ADD_SELECTED_100MG_ML_INJECTABLE;OR_OWNER_DECIDES_WEBSITE_CHANGE_TO_R83_200MG_ML | CURRENT_LIVE |
| NAD+ | `nad-inj-selected-r83` | Injection | one_time | 139 | `SHJpGAACUFEeMONdpEbn` | r83 | `BLOCKED_OWNER_REVIEW` | OWNER_APPROVES_WEBSITE_STRENGTH_CHANGE_TO_200MG_ML;THEN_GEN_PAIRING_REQUIRED | CUTOVER_PENDING_FORMULARY |
| NAD+ | `nad-nasal-r84` | Nasal Spray | one_time | 79 | `FVwkzvQqWIZRNAwbslGw` | r84 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_NASAL_FORMULARY;ALIGN_GEN_PRICE | FUTURE_HIDDEN |
| NAD+ | `nad-nasal-r85` | Nasal Spray | one_time | 109 | `FVwkzvQqWIZRNAwbslGw` | r85 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_NASAL_FORMULARY;ALIGN_GEN_PRICE | FUTURE_HIDDEN |
| Wolverine / BPC-TB | `wolverine-capsule` | Capsule | one_time | 29 | `omhh3NabouO8AsNR5tkD` | r104 | `GEN_PAIRING_REQUIRED` | ATTACH_FORMULARY_R104;ALIGN_GEN_PRICE_29_OR_OWNER_WEBSITE_PRICE_POLICY | CURRENT_LIVE |
| Wolverine / BPC-TB | `wolverine-injection` | Injection | one_time | 159 | `iJtyig611AZEDBGdvRd9` | r103 | `GEN_PRODUCT_REPAIR_REQUIRED` | VERIFY_PAIRING_IS_EXACT_R103_NOT_GHK_OR_KPV_BLEND;ALIGN_GEN_PRICE | CURRENT_LIVE |
| NAD+ | `nad-nasal-r81` | Nasal Spray | one_time | 79 | `FVwkzvQqWIZRNAwbslGw` | r81 | `BLOCKED_OWNER_REVIEW` | DO_NOT_USE_AS_INJECTION;DUPLICATE_OF_TRUE_NASAL_R84_R85 | FUTURE_HIDDEN |
| NAD+ | `nad-nasal-r82` | Nasal Spray | one_time | 109 | `FVwkzvQqWIZRNAwbslGw` | r82 | `BLOCKED_OWNER_REVIEW` | DO_NOT_USE_AS_INJECTION;DUPLICATE_OF_TRUE_NASAL_R84_R85 | FUTURE_HIDDEN |
| Minoxidil | `minoxidil-fin-minox-0.1-5` | Topical | one_time | 79 | `BboYS4a2Uj7APetrFo6W` | r129 | `GEN_PAIRING_REQUIRED` | ATTACH_VIOS_R129_FIN_MINOX_0_1_5;SET_PRICE_79 | CURRENT_LIVE |
| Minoxidil | `minoxidil-solution` | Topical | one_time | 29 | `489YrehNXRlL77fYPkOn` | r128 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Minoxidil | `minoxidil-cream` | Topical | one_time | 89 | `489YrehNXRlL77fYPkOn` | r131,r132,r133 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Minoxidil | `fin-minox-tret` | Topical | one_time | 89 | `EeWMcfCJf5EU2LkNQmp9` | r134,r135,r136 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Estradiol | `estradiol-patch-r26` | Patch | one_time | 119 | `o7dNtf9QsnEqPCrLr2tR` | r26 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Estradiol | `estradiol-patch-r27` | Patch | one_time | 129 | `o7dNtf9QsnEqPCrLr2tR` | r27 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Estradiol | `estradiol-patch-r28` | Patch | one_time | 139 | `o7dNtf9QsnEqPCrLr2tR` | r28 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Estradiol | `estradiol-patch-r29` | Patch | one_time | 149 | `o7dNtf9QsnEqPCrLr2tR` | r29 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Estradiol | `estradiol-tablet-r37` | Tablet | one_time | 19 | `o7dNtf9QsnEqPCrLr2tR` | r37 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Estradiol | `estradiol-tablet-r38` | Tablet | one_time | 19 | `o7dNtf9QsnEqPCrLr2tR` | r38 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Estradiol | `estradiol-tablet-r39` | Tablet | one_time | 19 | `o7dNtf9QsnEqPCrLr2tR` | r39 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Estradiol | `estradiol-injection-r40` | Injection | one_time | 89 | `o7dNtf9QsnEqPCrLr2tR` | r40 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Progesterone | `prog-ir-r41` | Capsule | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r41 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Progesterone | `prog-ir-r42` | Capsule | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r42 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Progesterone | `prog-ir-r43` | Capsule | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r43 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Progesterone | `prog-ir-r44` | Capsule | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r44 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Progesterone | `prog-ir-r45` | Capsule | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r45 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Progesterone | `prog-ir-r46` | Capsule | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r46 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Progesterone | `prog-ir-r47` | Capsule | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r47 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Progesterone | `prog-ir-r48` | Capsule | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r48 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Progesterone | `prog-ir-r49` | Capsule | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r49 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | CURRENT_LIVE |
| Progesterone | `prog-sr-r50` | Capsule | one_time | 19 | `—` | r50 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Progesterone | `prog-sr-r51` | Capsule | one_time | 19 | `—` | r51 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Progesterone | `prog-sr-r52` | Capsule | one_time | 19 | `—` | r52 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Tretinoin | `tretinoin-0.025%` | Cream | one_time | 79 | `—` | — | `FORMULARY_PENDING` | SOURCE_PLAIN_TRETINOIN_WEBSITE_STRENGTHS_OR_OWNER_WEBSITE_CHANGE;DO_NOT_SILENT_SUBSTITUTE_0_15_OR_COMBO | CURRENT_LIVE |
| Tretinoin | `tretinoin-0.05%` | Cream | one_time | 89 | `—` | — | `FORMULARY_PENDING` | SOURCE_PLAIN_TRETINOIN_WEBSITE_STRENGTHS_OR_OWNER_WEBSITE_CHANGE;DO_NOT_SILENT_SUBSTITUTE_0_15_OR_COMBO | CURRENT_LIVE |
| Tretinoin | `tretinoin-0.1%` | Cream | one_time | 109 | `—` | — | `FORMULARY_PENDING` | SOURCE_PLAIN_TRETINOIN_WEBSITE_STRENGTHS_OR_OWNER_WEBSITE_CHANGE;DO_NOT_SILENT_SUBSTITUTE_0_15_OR_COMBO | CURRENT_LIVE |
| Tretinoin | `tretinoin-selected-r126` | Cream | one_time | 79 | `EeWMcfCJf5EU2LkNQmp9` | r126 | `BLOCKED_OWNER_REVIEW` | OWNER_APPROVES_WEBSITE_STRENGTH_CHANGE_FIRST;THEN_GEN_PAIRING | CUTOVER_PENDING_FORMULARY |
| Tretinoin | `tretinoin-selected-r127` | Cream | one_time | 129 | `EeWMcfCJf5EU2LkNQmp9` | r127 | `BLOCKED_OWNER_REVIEW` | OWNER_APPROVES_WEBSITE_STRENGTH_CHANGE_FIRST;THEN_GEN_PAIRING | CUTOVER_PENDING_FORMULARY |
| Fat Burner | `fat-burner-current` | Injection | one_time | 259 | `7Kix55LA15U0lNvY9QXI` | — | `FORMULARY_PENDING` | REQUEST_FROM_PHARMACY;KEEP_CURRENT_LIVE_PROTECTED | CURRENT_LIVE |
| Testosterone | `testosterone-current` | Cream | one_time | 79 | `Gn4XaP00anr4q9oheSTe` | — | `FORMULARY_PENDING` | REQUEST_FROM_PHARMACY;KEEP_CURRENT_LIVE_PROTECTED | CURRENT_LIVE |
| Testosterone | `testosterone-inj-r76` | Injection | one_time | 59 | `Cm94vp3KgPz0yhqy01gX` | r76 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Testosterone | `testosterone-inj-r77` | Injection | one_time | 59 | `Cm94vp3KgPz0yhqy01gX` | r77 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Selank | `selank-current` | Injection | one_time | 129 | `Ukctbyh5Yrek3SnGSYA3` | — | `FORMULARY_PENDING` | REQUEST_FROM_PHARMACY;KEEP_CURRENT_LIVE_PROTECTED | CURRENT_LIVE |
| Selank | `selank-nasal-r119` | Nasal Spray | one_time | 129 | `Ukctbyh5Yrek3SnGSYA3` | r119 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | FUTURE_HIDDEN |
| Semax | `semax-current` | Injection | one_time | 129 | `YTHcdrlRICMpt56hdxeJ` | — | `FORMULARY_PENDING` | REQUEST_FROM_PHARMACY;KEEP_CURRENT_LIVE_PROTECTED | CURRENT_LIVE |
| Semax | `semax-nasal-r118` | Nasal Spray | one_time | 129 | `YTHcdrlRICMpt56hdxeJ` | r118 | `GEN_PAIRING_REQUIRED` | ATTACH_EXACT_FORMULARY;VERIFY_PRICE | FUTURE_HIDDEN |
| Selank + Semax Blend | `selank-semax-blend-current` | Nasal Spray | one_time | 169 | `LWkYtwm66dIeLuDSvSfi` | — | `FORMULARY_PENDING` | REQUEST_FROM_PHARMACY;KEEP_CURRENT_LIVE_PROTECTED | CURRENT_LIVE |
| Tesamorelin | `tesamorelin-current` | Injection | one_time | 149 | `2cYxVfvwpWyyrANZx06G` | — | `FORMULARY_PENDING` | REQUEST_FROM_PHARMACY;KEEP_CURRENT_LIVE_PROTECTED | CURRENT_LIVE |
| Lash / Brow Growth Serum | `lash-brow-current` | Solution | one_time | 89 | `—` | — | `FORMULARY_PENDING` | REQUEST_FROM_PHARMACY;KEEP_CURRENT_LIVE_PROTECTED | CURRENT_LIVE |
| PT-141 | `pt141-inj-r115` | Injection | one_time | 129 | `7a11W067k20AKLSsL2xM` | r115 | `FUTURE_HIDDEN` | WHEN_LAUNCHING_ATTACH_EXACT_FORMULARY | FUTURE_HIDDEN |
| PT-141 | `pt141-nasal-r116` | Nasal Spray | one_time | 139 | `mSehcuPAbjD70fTWdckF` | r116 | `FUTURE_HIDDEN` | WHEN_LAUNCHING_ATTACH_EXACT_FORMULARY;PT141_NASAL_REQUIRES_EXPLICIT_OWNER_ACTIVATION | FUTURE_HIDDEN |
| PT-141 | `pt141-nasal-r117` | Nasal Spray | one_time | 139 | `mSehcuPAbjD70fTWdckF` | r117 | `FUTURE_HIDDEN` | WHEN_LAUNCHING_ATTACH_EXACT_FORMULARY;PT141_NASAL_REQUIRES_EXPLICIT_OWNER_ACTIVATION | FUTURE_HIDDEN |
| Glutathione | `glutathione-injection-r86` | Injection | one_time | 59 | `17H4pVR8uYnwvcBIz8iY` | r86 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Glutathione | `glutathione-injection-r87` | Injection | one_time | 99 | `17H4pVR8uYnwvcBIz8iY` | r87 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r105` | Cream | one_time | 109 | `MXsSZY2GpiCByJUQer1p` | r105 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r106` | Cream | one_time | 129 | `MXsSZY2GpiCByJUQer1p` | r106 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r107` | Cream | one_time | 189 | `MXsSZY2GpiCByJUQer1p` | r107 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r108` | Cream | one_time | 109 | `MXsSZY2GpiCByJUQer1p` | r108 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| MOTS-c | `mots-c-r112` | Injection | one_time | 129 | `7Kix55LA15U0lNvY9QXI` | r112 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Thymosin Alpha-1 | `thymosin-a1-r114` | Injection | one_time | 159 | `qgn9vCpD8bBN5pXNPKE5` | r114 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Dihexa | `dihexa-r124` | Capsule | one_time | 29 | `UIjUhnsOMiWRZFiKXFi7` | r124 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Dihexa | `dihexa-tes-r125` | Capsule | one_time | 29 | `UIjUhnsOMiWRZFiKXFi7` | r125 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r120` | Capsule | one_time | 19 | `—` | r120 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r121` | Capsule | one_time | 19 | `—` | r121 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r122` | Capsule | one_time | 19 | `—` | r122 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r123` | Capsule | one_time | 19 | `—` | r123 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r30` | Cream | one_time | 69 | `RWtVLDbXlP7rsR31FXmH` | r30 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r31` | Cream | one_time | 79 | `RWtVLDbXlP7rsR31FXmH` | r31 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r32` | Cream | one_time | 89 | `RWtVLDbXlP7rsR31FXmH` | r32 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r33` | Cream | one_time | 99 | `RWtVLDbXlP7rsR31FXmH` | r33 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r34` | Troche | one_time | 29 | `CO68GB2vs5lyfN6awklC` | r34 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r35` | Troche | one_time | 29 | `CO68GB2vs5lyfN6awklC` | r35 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r36` | Troche | one_time | 29 | `CO68GB2vs5lyfN6awklC` | r36 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r65` | Troche | one_time | 29 | `CO68GB2vs5lyfN6awklC` | r65 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Sildenafil / Testosterone Troche | `sildenafil-testosterone-troche-r75` | Troche | one_time | 39 | `w0Rf0DXmI8ukPgoMtH6g` | r75 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| BPC Triple / Quad Blends | `bpc-tb-ghk-r100` | Injection | one_time | 159 | `5iCQzEtTXw90ctEhIhkB` | r100 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| BPC Triple / Quad Blends | `bpc-ghk-kpv-tb-r101` | Injection | one_time | 159 | `MXsSZY2GpiCByJUQer1p` | r101 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| BPC Triple / Quad Blends | `bpc-kpv-tb-r102` | Injection | one_time | 159 | `MXsSZY2GpiCByJUQer1p` | r102 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| MOTS-c / Tesamorelin | `mots-tes-r113` | Injection | one_time | 159 | `7Kix55LA15U0lNvY9QXI` | r113 | `FUTURE_HIDDEN` | NO_ACTION_UNTIL_LAUNCH;GEN_PAIRING_REQUIRED_AT_LAUNCH | FUTURE_HIDDEN |
| Oxytocin | `oxytocin-pending` | — | one_time | — | `—` | — | `FORMULARY_PENDING` | SOURCE_SELECTED_FORMULARY | FUTURE_HIDDEN |
| Sexual Wellness Compound | `sexual-wellness-compound-pending` | — | one_time | — | `—` | — | `FORMULARY_PENDING` | SOURCE_SELECTED_FORMULARY | FUTURE_HIDDEN |
| Scream Cream | `scream-cream-pending` | — | one_time | — | `—` | — | `BLOCKED_OWNER_REVIEW` | — | FUTURE_HIDDEN |

---

## FINAL REPORT

- **TOTAL WEBSITE FAMILIES:** 30
- **TOTAL WEBSITE VARIANTS:** 103

- **ROUTING_READY:** 0
- **GEN_PRODUCT_CREATE_REQUIRED:** 8
- **GEN_PRODUCT_REPAIR_REQUIRED:** 10
- **GEN_PAIRING_REQUIRED:** 20
- **FORMULARY_PENDING:** 14
- **PRICE_PENDING:** 0
- **FUTURE_HIDDEN:** 43
- **BLOCKED_OWNER_REVIEW:** 8

- **SEM:** families=1 · variants=11 · {'GEN_PRODUCT_REPAIR_REQUIRED': 8, 'GEN_PAIRING_REQUIRED': 1, 'BLOCKED_OWNER_REVIEW': 1, 'FUTURE_HIDDEN': 1}
  - membership backend: ONE website offer $149; backend B12/Glycine split allowed if GEN requires — not exposed as separate cards
- **TIR:** families=1 · variants=10 · {'GEN_PRODUCT_CREATE_REQUIRED': 8, 'BLOCKED_OWNER_REVIEW': 1, 'GEN_PRODUCT_REPAIR_REQUIRED': 1} · create confirmed vs live inventory: YES
  - membership backend: ONE website offer $275 at cutover; backend B12/Glycine split allowed if GEN requires
- **NAD+:** families=1 · injection=3 · nasal selectable=2 · {'FORMULARY_PENDING': 2, 'BLOCKED_OWNER_REVIEW': 3, 'GEN_PAIRING_REQUIRED': 2}
- **WOLVERINE:** families=1 · capsule=GEN_PAIRING_REQUIRED · injection=GEN_PRODUCT_REPAIR_REQUIRED
- **PT-141:** families=1 · injection/nasal=FUTURE_HIDDEN / FUTURE_HIDDEN (explicit owner activation required)

- **CURRENT_LIVE unresolved:** formulary-pending frozen 7 + NAD+ 100mg/mL + Tretinoin strengths + B6 transitional
- **CUTOVER unresolved:** SEM repair/pairing · TIR create×8 · membership backend splits
- **FUTURE_HIDDEN:** 43 variants

- **WEBSITE ARCHITECTURE CHANGED:** NO
- **GEN MODIFIED:** NO · **GEN WRITES:** 0 · **FORMULARY PAIRING WRITES:** 0
- **WEBSITE MODIFIED:** NO · **CHECKOUT MODIFIED:** NO · **CUTOVER:** OFF

**STOP FOR OWNER REVIEW.** Do not begin execution.
