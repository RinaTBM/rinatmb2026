# MBM GEN Routing Execution Queue

**Generated:** 2026-08-25T00:27:41Z  
**Phase:** MBM-OWNER-ROUTING-DECISION-GATE-2 — OWNER APPROVAL APPLIED  

**QUEUES ONLY — DO NOT EXECUTE.** No GEN writes. No website writes. No pairing writes. Cutover OFF.

Owner decisions locked: `A · A · B · A · A · B · A · A` · Remaining: **0**

Source matrix: [`MBM_WEBSITE_TO_GEN_ROUTING_MATRIX.md`](./MBM_WEBSITE_TO_GEN_ROUTING_MATRIX.md)

## Status counts (post–owner lock)

| Status | Count |
|---|---:|
| `ROUTING_READY` | 0 |
| `GEN_PRODUCT_CREATE_REQUIRED` | 8 |
| `GEN_PRODUCT_REPAIR_REQUIRED` | 10 |
| `GEN_PAIRING_REQUIRED` | 20 |
| `FORMULARY_PENDING` | 14 |
| `PRICE_PENDING` | 0 |
| `FUTURE_HIDDEN` | 51 |
| `BLOCKED_OWNER_REVIEW` | 0 |

## Queue legend (this pass)

- **A** — GEN CP CREATE
- **B** — GEN CP REPAIR
- **C** — FORMULARY PAIRING
- **D** — NO GEN ACTION NEEDED (ROUTING_READY)
- **E** — FORMULARY/SOURCING PENDING
- **F** — FUTURE HIDDEN (includes owner-excluded options + cutover B6 removals)

## QUEUE A — GEN CP CREATE

**Count:** 8

| Family | Variant | GEN CP | Price | Pharmacy | Actions | Why |
|---|---|---|---|---|---|---|
| Tirzepatide | `tir-b12-starting-low` | `CREATE` | 119–139 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not r… |
| Tirzepatide | `tir-b12-mid` | `CREATE` | 149–159 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not r… |
| Tirzepatide | `tir-b12-high` | `CREATE` | 169–179 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not r… |
| Tirzepatide | `tir-b12-any-dose` | `CREATE` | 119–179 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not r… |
| Tirzepatide | `tir-glycine-starting-low` | `CREATE` | 119–139 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not r… |
| Tirzepatide | `tir-glycine-mid` | `CREATE` | 149–159 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not r… |
| Tirzepatide | `tir-glycine-high` | `CREATE` | 169–179 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not r… |
| Tirzepatide | `tir-glycine-any-dose` | `CREATE` | 119–179 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not r… |

## QUEUE B — GEN CP REPAIR

**Count:** 10

| Family | Variant | GEN CP | Price | Pharmacy | Actions | Why |
|---|---|---|---|---|---|---|
| Semaglutide | `sem-b12-starting-low` | `SkqQHmsc0WdsbK9vmV1y` | 89–99 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP e… |
| Semaglutide | `sem-b12-high` | `34I2X8MpVZf3AQTff3bo` | 109–119 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP e… |
| Semaglutide | `sem-b12-any-dose` | `MkDIUw0NcJB7YL2pNzYW` | 89–119 | Dirx-Hub | REPAIR_FORMULARY_PAIRINGS_DIRX_HUB_ONLY, REMOVE_NON_SELECTED_PHARMACY_ATTACHMENTS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP e… |
| Semaglutide | `sem-glycine-starting-low` | `tk2GW39OGr7JX4MCCoJP` | 89–99 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP e… |
| Semaglutide | `sem-glycine-mid` | `CjqOUbPuGPZzxephqRou` | 109 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP e… |
| Semaglutide | `sem-glycine-high` | `sssEk3FDY4LFbQYGQsLx` | 109–119 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP e… |
| Semaglutide | `sem-glycine-any-dose` | `wQK2JsFnh7oFBf3Lag4n` | 89–119 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP e… |
| Semaglutide | `sem-membership` | `5F8jESeVeXcpkLU5rrdK` | 149 | Dirx-Hub | CONFIRM_OR_CREATE_BACKEND_B12_GLYCINE_MEMBERSHIP_SPLIT_IF_GEN_REQUIRES, KEEP_ONE_WEBSITE_MEMBERSHIP_OFFER, VERIFY_PRICE_149 | Owner membership price locked $149. |
| Tirzepatide | `tir-membership` | `E3MXZeeR01QROCuTLRLE` | 275 | Dirx-Hub | CONFIRM_OR_CREATE_BACKEND_B12_GLYCINE_MEMBERSHIP_SPLIT_IF_GEN_REQUIRES, KEEP_ONE_WEBSITE_MEMBERSHIP_OFFER, WEBSITE_REPRICE_249_TO_275_AT_CUTOVER | — |
| Wolverine / BPC-TB | `wolverine-injection` | `iJtyig611AZEDBGdvRd9` | 159 | Greenwich Pharmacy | VERIFY_PAIRING_IS_EXACT_R103_NOT_GHK_OR_KPV_BLEND, ALIGN_GEN_PRICE, OPTIONAL_RENAME_DISPLAY_TO_WOLVERINE | Live pairing exists to BPC-157/TB500 @ Greenwich — verify exact strength/package equals… |

## QUEUE C — FORMULARY PAIRING

**Count:** 20

| Family | Variant | GEN CP | Price | Pharmacy | Actions | Why |
|---|---|---|---|---|---|---|
| Semaglutide | `sem-b12-mid` | `BLf8inX395YNc7WPCD4O` | 109 | Dirx-Hub | ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, VERIFY_PRICE_VS_LOCKED_X9 | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; GEN CP e… |
| NAD+ | `nad-nasal-r84` | `FVwkzvQqWIZRNAwbslGw` | 79 | St Luke | ATTACH_EXACT_NASAL_FORMULARY, ALIGN_GEN_PRICE, NEVER_CROSS_PAIR_WITH_INJECTION | OWNER LOCKED Decisions 4–5 — Verified nasal variant under ONE NAD+ website family (Inje… |
| NAD+ | `nad-nasal-r85` | `FVwkzvQqWIZRNAwbslGw` | 109 | St Luke | ATTACH_EXACT_NASAL_FORMULARY, ALIGN_GEN_PRICE, NEVER_CROSS_PAIR_WITH_INJECTION | OWNER LOCKED Decisions 4–5 — Verified nasal variant under ONE NAD+ website family (Inje… |
| Wolverine / BPC-TB | `wolverine-capsule` | `omhh3NabouO8AsNR5tkD` | 29 | Greenwich Pharmacy | ATTACH_FORMULARY_R104, ALIGN_GEN_PRICE_29_OR_OWNER_WEBSITE_PRICE_POLICY, VERIFY_NOT_USING_TRIPLE_BLEND_CPS | — |
| Minoxidil | `minoxidil-fin-minox-0.1-5` | `BboYS4a2Uj7APetrFo6W` | 79 | Vios | ATTACH_VIOS_R129_FIN_MINOX_0_1_5, SET_PRICE_79, DO_NOT_USE_GHK_CU_MINOXIDIL_CP | Owner-locked. SAFE_TO_REPAIR Dual Combo later. Do not use GHK-Cu/Minoxidil CP. |
| Estradiol | `estradiol-patch-r26` | `o7dNtf9QsnEqPCrLr2tR` | 119 | Valiant | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | GEN candidate is near-name only — pairing/repair required. Do not fuzzy-match vaginal p… |
| Estradiol | `estradiol-patch-r27` | `o7dNtf9QsnEqPCrLr2tR` | 129 | Valiant | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | GEN candidate is near-name only — pairing/repair required. Do not fuzzy-match vaginal p… |
| Estradiol | `estradiol-patch-r28` | `o7dNtf9QsnEqPCrLr2tR` | 139 | Valiant | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | GEN candidate is near-name only — pairing/repair required. Do not fuzzy-match vaginal p… |
| Estradiol | `estradiol-patch-r29` | `o7dNtf9QsnEqPCrLr2tR` | 149 | Valiant | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | GEN candidate is near-name only — pairing/repair required. Do not fuzzy-match vaginal p… |
| Progesterone | `prog-ir-r41` | `5dGkjdpLP7DkKKE2iVxh` | 29 | Vios | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | Prefer Progesterone GEN over BiEst combo near-name. |
| Progesterone | `prog-ir-r42` | `5dGkjdpLP7DkKKE2iVxh` | 29 | Vios | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | Prefer Progesterone GEN over BiEst combo near-name. |
| Progesterone | `prog-ir-r43` | `5dGkjdpLP7DkKKE2iVxh` | 29 | Vios | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | Prefer Progesterone GEN over BiEst combo near-name. |
| Progesterone | `prog-ir-r44` | `5dGkjdpLP7DkKKE2iVxh` | 29 | Vios | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | Prefer Progesterone GEN over BiEst combo near-name. |
| Progesterone | `prog-ir-r45` | `5dGkjdpLP7DkKKE2iVxh` | 29 | Vios | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | Prefer Progesterone GEN over BiEst combo near-name. |
| Progesterone | `prog-ir-r46` | `5dGkjdpLP7DkKKE2iVxh` | 29 | Vios | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | Prefer Progesterone GEN over BiEst combo near-name. |
| Progesterone | `prog-ir-r47` | `5dGkjdpLP7DkKKE2iVxh` | 29 | Vios | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | Prefer Progesterone GEN over BiEst combo near-name. |
| Progesterone | `prog-ir-r48` | `5dGkjdpLP7DkKKE2iVxh` | 29 | Vios | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | Prefer Progesterone GEN over BiEst combo near-name. |
| Progesterone | `prog-ir-r49` | `5dGkjdpLP7DkKKE2iVxh` | 29 | Vios | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | Prefer Progesterone GEN over BiEst combo near-name. |
| Selank | `selank-nasal-r119` | `Ukctbyh5Yrek3SnGSYA3` | 129 | Greenwich Pharmacy | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | Expose nasal only when ready. Do not substitute for injection pending. |
| Semax | `semax-nasal-r118` | `YTHcdrlRICMpt56hdxeJ` | 129 | Greenwich Pharmacy | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | — |

## QUEUE D — NO GEN ACTION NEEDED

**Count:** 0

_ROUTING_READY only. Owner-locked B6 removals and rejected formulary options are under FUTURE_HIDDEN (website cutover / do-not-use), not GEN-ready._

_Empty._

## QUEUE E — FORMULARY / SOURCING PENDING

**Count:** 14

| Family | Variant | GEN CP | Price | Pharmacy | Actions | Why |
|---|---|---|---|---|---|---|
| NAD+ | `nad-inj-5ml-500` | `SHJpGAACUFEeMONdpEbn` | 199 | — | SOURCE_EXACT_100MG_ML_INJECTABLE_FORMULARY, DO_NOT_SUBSTITUTE_200_FOR_100, KEEP_ONE_NAD_WEBSITE_PRODUCT | OWNER LOCKED Decision 3B — Keep website 100mg/mL. Do NOT substitute r83 200mg/mL. Exact… |
| NAD+ | `nad-inj-10ml-1000` | `SHJpGAACUFEeMONdpEbn` | 229 | — | SOURCE_EXACT_100MG_ML_INJECTABLE_FORMULARY, DO_NOT_SUBSTITUTE_200_FOR_100, KEEP_ONE_NAD_WEBSITE_PRODUCT | OWNER LOCKED Decision 3B — Keep website 100mg/mL. Do NOT substitute r83 200mg/mL. Exact… |
| Tretinoin | `tretinoin-0.025%` | `—` | 79 | — | SOURCE_PLAIN_TRETINOIN_EXACT_WEBSITE_STRENGTH, DO_NOT_SILENT_SUBSTITUTE_0_15_OR_COMBO | OWNER LOCKED Decision 6B — Keep website strength. Do NOT substitute 0.15% r126 or combo… |
| Tretinoin | `tretinoin-0.05%` | `—` | 89 | — | SOURCE_PLAIN_TRETINOIN_EXACT_WEBSITE_STRENGTH, DO_NOT_SILENT_SUBSTITUTE_0_15_OR_COMBO | OWNER LOCKED Decision 6B — Keep website strength. Do NOT substitute 0.15% r126 or combo… |
| Tretinoin | `tretinoin-0.1%` | `—` | 109 | — | SOURCE_PLAIN_TRETINOIN_EXACT_WEBSITE_STRENGTH, DO_NOT_SILENT_SUBSTITUTE_0_15_OR_COMBO | OWNER LOCKED Decision 6B — Keep website strength. Do NOT substitute 0.15% r126 or combo… |
| Fat Burner | `fat-burner-current` | `7Kix55LA15U0lNvY9QXI` | 259 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this phase. |
| Testosterone | `testosterone-current` | `Gn4XaP00anr4q9oheSTe` | 79 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this phase. |
| Selank | `selank-current` | `Ukctbyh5Yrek3SnGSYA3` | 129 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this phase. |
| Semax | `semax-current` | `YTHcdrlRICMpt56hdxeJ` | 129 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this phase. |
| Selank + Semax Blend | `selank-semax-blend-current` | `LWkYtwm66dIeLuDSvSfi` | 169 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this phase. |
| Tesamorelin | `tesamorelin-current` | `2cYxVfvwpWyyrANZx06G` | 149 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this phase. |
| Lash / Brow Growth Serum | `lash-brow-current` | `—` | 89 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this phase. |
| Oxytocin | `oxytocin-pending` | `—` | — | — | SOURCE_SELECTED_FORMULARY | FUTURE_HIDDEN_PENDING |
| Sexual Wellness Compound | `sexual-wellness-compound-pending` | `—` | — | — | SOURCE_SELECTED_FORMULARY | FUTURE_HIDDEN_PENDING |

## QUEUE F — FUTURE HIDDEN

**Count:** 51

| Family | Variant | GEN CP | Price | Pharmacy | Actions | Why |
|---|---|---|---|---|---|---|
| Semaglutide | `sem-current-b6` | `—` | — | — | REMOVE_AT_WEBSITE_CUTOVER, DO_NOT_REINTRODUCE_B6, NO_GEN_ACTION_FOR_B6 | OWNER LOCKED A — Remove legacy B6 at website cutover. Cutover architecture = B12 + Glyc… |
| Semaglutide | `sem-b12-3month` | `sN2ggSXRJINjElMYTQjf` | 359 | Dirx-Hub | REPAIR_PAIRING_WHEN_LAUNCHING, VERIFY_3MONTH_PRICE_FORMULA | — |
| Tirzepatide | `tir-current-b6` | `—` | — | — | REMOVE_AT_WEBSITE_CUTOVER, DO_NOT_REINTRODUCE_B6, NO_GEN_ACTION_FOR_B6 | OWNER LOCKED A — Remove legacy B6 at website cutover. Cutover architecture = B12 + Glyc… |
| NAD+ | `nad-inj-selected-r83` | `SHJpGAACUFEeMONdpEbn` | 139 | St Luke | DO_NOT_USE_AS_WEBSITE_INJECTION, DO_NOT_SUBSTITUTE_200_FOR_100, EXCLUDED_BY_OWNER_DECISION_3B | OWNER LOCKED B — Do NOT substitute 200mg/mL for website 100mg/mL. r83 excluded from web… |
| NAD+ | `nad-nasal-r81` | `FVwkzvQqWIZRNAwbslGw` | 79 | St Luke | EXCLUDE_FROM_WEBSITE_SELECTORS, USE_R84_INSTEAD, DO_NOT_USE_AS_INJECTION | OWNER LOCKED A — Exclude r81. Use verified r84 for 50mg/mL nasal. Duplicate/mislabeled. |
| NAD+ | `nad-nasal-r82` | `FVwkzvQqWIZRNAwbslGw` | 109 | St Luke | EXCLUDE_FROM_WEBSITE_SELECTORS, USE_R85_INSTEAD, DO_NOT_USE_AS_INJECTION | OWNER LOCKED A — Exclude r82. Use verified r85 for 200mg/mL nasal. Duplicate/mislabeled. |
| Minoxidil | `minoxidil-solution` | `489YrehNXRlL77fYPkOn` | 29 | Vios | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | Future variant under Minoxidil family or separate if clinically distinct — kept FUTURE_… |
| Minoxidil | `minoxidil-cream` | `489YrehNXRlL77fYPkOn` | 89 | Vios | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | Future variant under Minoxidil family or separate if clinically distinct — kept FUTURE_… |
| Minoxidil | `fin-minox-tret` | `EeWMcfCJf5EU2LkNQmp9` | 89 | Vios | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | Future variant under Minoxidil family or separate if clinically distinct — kept FUTURE_… |
| Estradiol | `estradiol-tablet-r37` | `o7dNtf9QsnEqPCrLr2tR` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Estradiol | `estradiol-tablet-r38` | `o7dNtf9QsnEqPCrLr2tR` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Estradiol | `estradiol-tablet-r39` | `o7dNtf9QsnEqPCrLr2tR` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Estradiol | `estradiol-injection-r40` | `o7dNtf9QsnEqPCrLr2tR` | 89 | Vios | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Progesterone | `prog-sr-r50` | `—` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Progesterone | `prog-sr-r51` | `—` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Progesterone | `prog-sr-r52` | `—` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Tretinoin | `tretinoin-selected-r126` | `EeWMcfCJf5EU2LkNQmp9` | 79 | Vios | DO_NOT_MAP_TO_WEBSITE_PLAIN_TRETINOIN, EXCLUDED_BY_OWNER_DECISION_6B | OWNER LOCKED B — Do NOT substitute 0.15% for website 0.025/0.05/0.1%. r126 not mapped t… |
| Tretinoin | `tretinoin-selected-r127` | `EeWMcfCJf5EU2LkNQmp9` | 129 | Vios | DO_NOT_MAP_TO_PLAIN_TRETINOIN, SEPARATE_FORMULATION, EXCLUDED_BY_OWNER_DECISION_7A | OWNER LOCKED A — Do NOT map combo HA/Niacinamide/Tretinoin to plain Tretinoin. Separate… |
| Testosterone | `testosterone-inj-r76` | `Cm94vp3KgPz0yhqy01gX` | 59 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | Do not mix cream pending with injection as same clinical SKU without owner approval — s… |
| Testosterone | `testosterone-inj-r77` | `Cm94vp3KgPz0yhqy01gX` | 59 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | Do not mix cream pending with injection as same clinical SKU without owner approval — s… |
| PT-141 | `pt141-inj-r115` | `7a11W067k20AKLSsL2xM` | 129 | Greenwich Pharmacy | WHEN_LAUNCHING_ATTACH_EXACT_FORMULARY | — |
| PT-141 | `pt141-nasal-r116` | `mSehcuPAbjD70fTWdckF` | 139 | Vios | WHEN_LAUNCHING_ATTACH_EXACT_FORMULARY, PT141_NASAL_REQUIRES_EXPLICIT_OWNER_ACTIVATION | Owner: do not activate nasal without explicit approval |
| PT-141 | `pt141-nasal-r117` | `mSehcuPAbjD70fTWdckF` | 139 | Vios | WHEN_LAUNCHING_ATTACH_EXACT_FORMULARY, PT141_NASAL_REQUIRES_EXPLICIT_OWNER_ACTIVATION | Owner: do not activate nasal without explicit approval |
| Glutathione | `glutathione-injection-r86` | `17H4pVR8uYnwvcBIz8iY` | 59 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Glutathione | `glutathione-injection-r87` | `17H4pVR8uYnwvcBIz8iY` | 99 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| GHK-Cu | `ghk-cream-r105` | `MXsSZY2GpiCByJUQer1p` | 109 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| GHK-Cu | `ghk-cream-r106` | `MXsSZY2GpiCByJUQer1p` | 129 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| GHK-Cu | `ghk-cream-r107` | `MXsSZY2GpiCByJUQer1p` | 189 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| GHK-Cu | `ghk-cream-r108` | `MXsSZY2GpiCByJUQer1p` | 109 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| MOTS-c | `mots-c-r112` | `7Kix55LA15U0lNvY9QXI` | 129 | Greenwich Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Thymosin Alpha-1 | `thymosin-a1-r114` | `qgn9vCpD8bBN5pXNPKE5` | 159 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Dihexa | `dihexa-r124` | `UIjUhnsOMiWRZFiKXFi7` | 29 | Greenwich Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Dihexa | `dihexa-tes-r125` | `UIjUhnsOMiWRZFiKXFi7` | 29 | Greenwich Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Methylene Blue | `methylene-blue-r120` | `—` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Methylene Blue | `methylene-blue-r121` | `—` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Methylene Blue | `methylene-blue-r122` | `—` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Methylene Blue | `methylene-blue-r123` | `—` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Custom HRT Cream | `hrt-custom-cream-r30` | `RWtVLDbXlP7rsR31FXmH` | 69 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Custom HRT Cream | `hrt-custom-cream-r31` | `RWtVLDbXlP7rsR31FXmH` | 79 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Custom HRT Cream | `hrt-custom-cream-r32` | `RWtVLDbXlP7rsR31FXmH` | 89 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Custom HRT Cream | `hrt-custom-cream-r33` | `RWtVLDbXlP7rsR31FXmH` | 99 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Custom Hormone Troche | `hrt-custom-troche-r34` | `CO68GB2vs5lyfN6awklC` | 29 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Custom Hormone Troche | `hrt-custom-troche-r35` | `CO68GB2vs5lyfN6awklC` | 29 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Custom Hormone Troche | `hrt-custom-troche-r36` | `CO68GB2vs5lyfN6awklC` | 29 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Custom Hormone Troche | `hrt-custom-troche-r65` | `CO68GB2vs5lyfN6awklC` | 29 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Sildenafil / Testosterone Troche | `sildenafil-testosterone-troche-r75` | `w0Rf0DXmI8ukPgoMtH6g` | 39 | St Luke | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| BPC Triple / Quad Blends | `bpc-tb-ghk-r100` | `5iCQzEtTXw90ctEhIhkB` | 159 | Greenwich Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| BPC Triple / Quad Blends | `bpc-ghk-kpv-tb-r101` | `MXsSZY2GpiCByJUQer1p` | 159 | Greenwich Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| BPC Triple / Quad Blends | `bpc-kpv-tb-r102` | `MXsSZY2GpiCByJUQer1p` | 159 | Greenwich Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| MOTS-c / Tesamorelin | `mots-tes-r113` | `7Kix55LA15U0lNvY9QXI` | 159 | Greenwich Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Scream Cream | `scream-cream-pending` | `—` | — | — | DO_NOT_ACTIVATE, NO_WEBSITE_ROUTE, NO_UNSUPPORTED_FORMULARY_MAPPING | OWNER LOCKED A — Remain FUTURE_HIDDEN. Do not activate. Do not create live website rout… |

## GEN execution eligibility

- **GEN EXECUTION-ELIGIBLE:** 38 (CREATE + REPAIR + PAIRING + ROUTING_READY)
- **GEN EXECUTION-BLOCKED:** 65 (FORMULARY_PENDING + PRICE_PENDING + FUTURE_HIDDEN + BLOCKED)
- **FORMULARY/SOURCING STILL REQUIRED:** 14

## Final report

| Item | Value |
|---|---|
| OWNER_DECISIONS_LOCKED | 8/8 |
| OWNER_DECISIONS_REMAINING | 0 |
| TOTAL_WEBSITE_FAMILIES | 30 |
| TOTAL_WEBSITE_VARIANTS | 103 |
| ROUTING_READY | 0 |
| GEN_PRODUCT_CREATE_REQUIRED | 8 |
| GEN_PRODUCT_REPAIR_REQUIRED | 10 |
| GEN_PAIRING_REQUIRED | 20 |
| FORMULARY_PENDING | 14 |
| PRICE_PENDING | 0 |
| FUTURE_HIDDEN | 51 |
| BLOCKED_OWNER_REVIEW | 0 |
| GEN_EXECUTION_ELIGIBLE_VARIANTS | 38 |
| GEN_EXECUTION_BLOCKED_VARIANTS | 65 |
| FORMULARY_SOURCING_ITEMS_STILL_REQUIRED | 14 |
| WEBSITE_ARCHITECTURE_CHANGED | False |
| GEN_MODIFIED | False |
| GEN_WRITES | 0 |
| PAIRING_WRITES | 0 |
| WEBSITE_MODIFIED | False |
| CHECKOUT_MODIFIED | False |
| CUTOVER | OFF |
| STOP | STOP FOR OWNER REVIEW — Do not execute GEN. Do not modify website. |

**STOP FOR OWNER REVIEW.** Do not execute these queues yet.
