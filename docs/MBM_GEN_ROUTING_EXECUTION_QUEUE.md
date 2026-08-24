# MBM GEN Routing Execution Queue

**Generated:** 2026-08-24T22:50:26Z  
**Phase:** MBM-GEN-ROUTING-COMPLETION-GATE-1  

**QUEUES ONLY — DO NOT EXECUTE.** No GEN writes. No website writes. No pairing writes. Cutover OFF.

Source matrix: [`MBM_WEBSITE_TO_GEN_ROUTING_MATRIX.md`](./MBM_WEBSITE_TO_GEN_ROUTING_MATRIX.md)

---

## QUEUE A — EXISTING GEN READY (ROUTING_READY)

**Count:** 0

_Empty._

## QUEUE B — GEN PRODUCT REPAIR

**Count:** 10

| Family | Variant | GEN CP | Price | Pharmacy | Actions | Why |
|---|---|---|---|---|---|---|
| Semaglutide | `sem-b12-starting-low` | `SkqQHmsc0WdsbK9vmV1y` | 89–99 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; G |
| Semaglutide | `sem-b12-high` | `34I2X8MpVZf3AQTff3bo` | 109–119 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; G |
| Semaglutide | `sem-b12-any-dose` | `MkDIUw0NcJB7YL2pNzYW` | 89–119 | Dirx-Hub | REPAIR_FORMULARY_PAIRINGS_DIRX_HUB_ONLY, REMOVE_NON_SELECTED_PHARMACY_ATTACHMENTS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; G |
| Semaglutide | `sem-glycine-starting-low` | `tk2GW39OGr7JX4MCCoJP` | 89–99 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; G |
| Semaglutide | `sem-glycine-mid` | `CjqOUbPuGPZzxephqRou` | 109 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; G |
| Semaglutide | `sem-glycine-high` | `sssEk3FDY4LFbQYGQsLx` | 109–119 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; G |
| Semaglutide | `sem-glycine-any-dose` | `wQK2JsFnh7oFBf3Lag4n` | 89–119 | Dirx-Hub | VERIFY_EXACT_STRENGTH_MED_IDS_MATCH_SELECTED_ROWS, ALIGN_GEN_PRICE_TO_LOCKED_AUTHORITY | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; G |
| Semaglutide | `sem-membership` | `5F8jESeVeXcpkLU5rrdK` | 149 | Dirx-Hub | CONFIRM_OR_CREATE_BACKEND_B12_GLYCINE_MEMBERSHIP_SPLIT_IF_GEN_REQUIRES, KEEP_ONE_WEBSITE_MEMBERSHIP_OFFER, VERIFY_PRICE_149 | Owner membership price locked $149. |
| Tirzepatide | `tir-membership` | `E3MXZeeR01QROCuTLRLE` | 275 | Dirx-Hub | CONFIRM_OR_CREATE_BACKEND_B12_GLYCINE_MEMBERSHIP_SPLIT_IF_GEN_REQUIRES, KEEP_ONE_WEBSITE_MEMBERSHIP_OFFER, WEBSITE_REPRICE_249_TO_275_AT_CUTOVER | — |
| Wolverine / BPC-TB | `wolverine-injection` | `iJtyig611AZEDBGdvRd9` | 159 | Greenwich Pharmacy | VERIFY_PAIRING_IS_EXACT_R103_NOT_GHK_OR_KPV_BLEND, ALIGN_GEN_PRICE, OPTIONAL_RENAME_DISPLAY_TO_WOLVERINE | Live pairing exists to BPC-157/TB500 @ Greenwich — verify exact strength/package |

## QUEUE C — GEN PRODUCT CREATE

**Count:** 8

| Family | Variant | GEN CP | Price | Pharmacy | Actions | Why |
|---|---|---|---|---|---|---|
| Tirzepatide | `tir-b12-starting-low` | `CREATE` | 119–139 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. D |
| Tirzepatide | `tir-b12-mid` | `CREATE` | 149–159 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. D |
| Tirzepatide | `tir-b12-high` | `CREATE` | 169–179 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. D |
| Tirzepatide | `tir-b12-any-dose` | `CREATE` | 119–179 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. D |
| Tirzepatide | `tir-glycine-starting-low` | `CREATE` | 119–139 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. D |
| Tirzepatide | `tir-glycine-mid` | `CREATE` | 149–159 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. D |
| Tirzepatide | `tir-glycine-high` | `CREATE` | 169–179 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. D |
| Tirzepatide | `tir-glycine-any-dose` | `CREATE` | 119–179 | Dirx-Hub | CREATE_GEN_CP, ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, SET_PRICE_FROM_LOCKED_X9 | Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. D |

## QUEUE D — FORMULARY PAIRING

**Count:** 20

| Family | Variant | GEN CP | Price | Pharmacy | Actions | Why |
|---|---|---|---|---|---|---|
| Semaglutide | `sem-b12-mid` | `BLf8inX395YNc7WPCD4O` | 109 | Dirx-Hub | ATTACH_FORMULARY_DIRX_HUB_SELECTED_ROWS, VERIFY_PRICE_VS_LOCKED_X9 | SEM one-time cutover variant. B6 not used. Exact SELECTED Dirx-Hub rows known; G |
| NAD+ | `nad-nasal-r84` | `FVwkzvQqWIZRNAwbslGw` | 79 | St Luke | ATTACH_EXACT_NASAL_FORMULARY, ALIGN_GEN_PRICE, NEVER_CROSS_PAIR_WITH_INJECTION | Verified nasal SELECTED rows only (r84/r85). Rows 81/82 are Form=Nasal but Deliv |
| NAD+ | `nad-nasal-r85` | `FVwkzvQqWIZRNAwbslGw` | 109 | St Luke | ATTACH_EXACT_NASAL_FORMULARY, ALIGN_GEN_PRICE, NEVER_CROSS_PAIR_WITH_INJECTION | Verified nasal SELECTED rows only (r84/r85). Rows 81/82 are Form=Nasal but Deliv |
| Wolverine / BPC-TB | `wolverine-capsule` | `omhh3NabouO8AsNR5tkD` | 29 | Greenwich Pharmacy | ATTACH_FORMULARY_R104, ALIGN_GEN_PRICE_29_OR_OWNER_WEBSITE_PRICE_POLICY, VERIFY_NOT_USING_TRIPLE_BLEND_CPS | — |
| Minoxidil | `minoxidil-fin-minox-0.1-5` | `BboYS4a2Uj7APetrFo6W` | 79 | Vios | ATTACH_VIOS_R129_FIN_MINOX_0_1_5, SET_PRICE_79, DO_NOT_USE_GHK_CU_MINOXIDIL_CP | Owner-locked. SAFE_TO_REPAIR Dual Combo later. Do not use GHK-Cu/Minoxidil CP. |
| Estradiol | `estradiol-patch-r26` | `o7dNtf9QsnEqPCrLr2tR` | 119 | Valiant | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | GEN candidate is near-name only — pairing/repair required. Do not fuzzy-match va |
| Estradiol | `estradiol-patch-r27` | `o7dNtf9QsnEqPCrLr2tR` | 129 | Valiant | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | GEN candidate is near-name only — pairing/repair required. Do not fuzzy-match va |
| Estradiol | `estradiol-patch-r28` | `o7dNtf9QsnEqPCrLr2tR` | 139 | Valiant | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | GEN candidate is near-name only — pairing/repair required. Do not fuzzy-match va |
| Estradiol | `estradiol-patch-r29` | `o7dNtf9QsnEqPCrLr2tR` | 149 | Valiant | ATTACH_EXACT_FORMULARY, VERIFY_PRICE | GEN candidate is near-name only — pairing/repair required. Do not fuzzy-match va |
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

## QUEUE E — FORMULARY / SOURCING PENDING

**Count:** 14

| Family | Variant | GEN CP | Price | Pharmacy | Actions | Why |
|---|---|---|---|---|---|---|
| NAD+ | `nad-inj-5ml-500` | `SHJpGAACUFEeMONdpEbn` | 199 | — | SOURCE_OR_ADD_SELECTED_100MG_ML_INJECTABLE, OR_OWNER_DECIDES_WEBSITE_CHANGE_TO_R83_200MG_ML, DO_NOT_SUBSTITUTE_200_FOR_100 | FORMULATION_STRENGTH_CONFLICT vs SELECTED injectable r83 200mg/ml only. Do not s |
| NAD+ | `nad-inj-10ml-1000` | `SHJpGAACUFEeMONdpEbn` | 229 | — | SOURCE_OR_ADD_SELECTED_100MG_ML_INJECTABLE, OR_OWNER_DECIDES_WEBSITE_CHANGE_TO_R83_200MG_ML, DO_NOT_SUBSTITUTE_200_FOR_100 | FORMULATION_STRENGTH_CONFLICT vs SELECTED injectable r83 200mg/ml only. Do not s |
| Tretinoin | `tretinoin-0.025%` | `CREATE` | 79 | — | SOURCE_PLAIN_TRETINOIN_WEBSITE_STRENGTHS_OR_OWNER_WEBSITE_CHANGE, DO_NOT_SILENT_SUBSTITUTE_0_15_OR_COMBO | Website explicit strengths. No exact SELECTED match (SELECTED has 0.15% and comb |
| Tretinoin | `tretinoin-0.05%` | `CREATE` | 89 | — | SOURCE_PLAIN_TRETINOIN_WEBSITE_STRENGTHS_OR_OWNER_WEBSITE_CHANGE, DO_NOT_SILENT_SUBSTITUTE_0_15_OR_COMBO | Website explicit strengths. No exact SELECTED match (SELECTED has 0.15% and comb |
| Tretinoin | `tretinoin-0.1%` | `CREATE` | 109 | — | SOURCE_PLAIN_TRETINOIN_WEBSITE_STRENGTHS_OR_OWNER_WEBSITE_CHANGE, DO_NOT_SILENT_SUBSTITUTE_0_15_OR_COMBO | Website explicit strengths. No exact SELECTED match (SELECTED has 0.15% and comb |
| Fat Burner | `fat-burner-current` | `7Kix55LA15U0lNvY9QXI` | 259 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this p |
| Testosterone | `testosterone-current` | `Gn4XaP00anr4q9oheSTe` | 79 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this p |
| Selank | `selank-current` | `Ukctbyh5Yrek3SnGSYA3` | 129 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this p |
| Semax | `semax-current` | `YTHcdrlRICMpt56hdxeJ` | 129 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this p |
| Selank + Semax Blend | `selank-semax-blend-current` | `LWkYtwm66dIeLuDSvSfi` | 169 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this p |
| Tesamorelin | `tesamorelin-current` | `2cYxVfvwpWyyrANZx06G` | 149 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this p |
| Lash / Brow Growth Serum | `lash-brow-current` | `CREATE` | 89 | — | REQUEST_FROM_PHARMACY, KEEP_CURRENT_LIVE_PROTECTED, NO_NEAR_MATCH | CURRENT_LIVE_FORMULARY_PENDING. Keep protected. No near-match. No removal this p |
| Oxytocin | `oxytocin-pending` | `CREATE` | — | — | SOURCE_SELECTED_FORMULARY | FUTURE_HIDDEN_PENDING |
| Sexual Wellness Compound | `sexual-wellness-compound-pending` | `CREATE` | — | — | SOURCE_SELECTED_FORMULARY | FUTURE_HIDDEN_PENDING |

## QUEUE F — FUTURE HIDDEN

**Count:** 43

| Family | Variant | GEN CP | Price | Pharmacy | Actions | Why |
|---|---|---|---|---|---|---|
| Semaglutide | `sem-b12-3month` | `sN2ggSXRJINjElMYTQjf` | 359 | Dirx-Hub | REPAIR_PAIRING_WHEN_LAUNCHING, VERIFY_3MONTH_PRICE_FORMULA | — |
| Minoxidil | `minoxidil-solution` | `489YrehNXRlL77fYPkOn` | 29 | Vios | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | Future variant under Minoxidil family or separate if clinically distinct — kept  |
| Minoxidil | `minoxidil-cream` | `489YrehNXRlL77fYPkOn` | 89 | Vios | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | Future variant under Minoxidil family or separate if clinically distinct — kept  |
| Minoxidil | `fin-minox-tret` | `EeWMcfCJf5EU2LkNQmp9` | 89 | Vios | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | Future variant under Minoxidil family or separate if clinically distinct — kept  |
| Estradiol | `estradiol-tablet-r37` | `o7dNtf9QsnEqPCrLr2tR` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Estradiol | `estradiol-tablet-r38` | `o7dNtf9QsnEqPCrLr2tR` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Estradiol | `estradiol-tablet-r39` | `o7dNtf9QsnEqPCrLr2tR` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Estradiol | `estradiol-injection-r40` | `o7dNtf9QsnEqPCrLr2tR` | 89 | Vios | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Progesterone | `prog-sr-r50` | `CREATE` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Progesterone | `prog-sr-r51` | `CREATE` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Progesterone | `prog-sr-r52` | `CREATE` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Testosterone | `testosterone-inj-r76` | `Cm94vp3KgPz0yhqy01gX` | 59 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | Do not mix cream pending with injection as same clinical SKU without owner appro |
| Testosterone | `testosterone-inj-r77` | `Cm94vp3KgPz0yhqy01gX` | 59 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | Do not mix cream pending with injection as same clinical SKU without owner appro |
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
| Methylene Blue | `methylene-blue-r120` | `CREATE` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Methylene Blue | `methylene-blue-r121` | `CREATE` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Methylene Blue | `methylene-blue-r122` | `CREATE` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
| Methylene Blue | `methylene-blue-r123` | `CREATE` | 19 | Optimal Balance Pharmacy | NO_ACTION_UNTIL_LAUNCH, GEN_PAIRING_REQUIRED_AT_LAUNCH | — |
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

## QUEUE G — OWNER REVIEW

**Count:** 8

| Family | Variant | GEN CP | Price | Pharmacy | Actions | Why |
|---|---|---|---|---|---|---|
| Semaglutide | `sem-current-b6` | `CREATE` | — | — | REMOVE_AT_WEBSITE_CUTOVER, DO_NOT_REINTRODUCE_B6 | Transitional CURRENT_LIVE website identity. Blocked for new routing. |
| Tirzepatide | `tir-current-b6` | `CREATE` | — | — | REMOVE_AT_WEBSITE_CUTOVER, DO_NOT_REINTRODUCE_B6 | — |
| NAD+ | `nad-inj-selected-r83` | `SHJpGAACUFEeMONdpEbn` | 139 | St Luke | OWNER_APPROVES_WEBSITE_STRENGTH_CHANGE_TO_200MG_ML, THEN_GEN_PAIRING_REQUIRED, VERIFY_PRICE_139 | Not activated unless owner chooses option A from integrity gate. |
| NAD+ | `nad-nasal-r81` | `FVwkzvQqWIZRNAwbslGw` | 79 | St Luke | DO_NOT_USE_AS_INJECTION, DUPLICATE_OF_TRUE_NASAL_R84_R85, EXCLUDE_FROM_WEBSITE_SELECTORS | SELECTED rows 81/82 have Form=Nasal Spray but Delivery Type=Injection. Not valid |
| NAD+ | `nad-nasal-r82` | `FVwkzvQqWIZRNAwbslGw` | 109 | St Luke | DO_NOT_USE_AS_INJECTION, DUPLICATE_OF_TRUE_NASAL_R84_R85, EXCLUDE_FROM_WEBSITE_SELECTORS | SELECTED rows 81/82 have Form=Nasal Spray but Delivery Type=Injection. Not valid |
| Tretinoin | `tretinoin-selected-r126` | `EeWMcfCJf5EU2LkNQmp9` | 79 | Vios | OWNER_APPROVES_WEBSITE_STRENGTH_CHANGE_FIRST, THEN_GEN_PAIRING | Owner option only — do not silent-substitute for website strengths. |
| Tretinoin | `tretinoin-selected-r127` | `EeWMcfCJf5EU2LkNQmp9` | 129 | Vios | OWNER_APPROVES_WEBSITE_STRENGTH_CHANGE_FIRST, THEN_GEN_PAIRING | Owner option only — do not silent-substitute for website strengths. |
| Scream Cream | `scream-cream-pending` | `CREATE` | — | — | — | No SELECTED rows / explicit do-not-activate |

---

## FINAL REPORT

- ROUTING_READY: 0
- CREATE: 8 · REPAIR: 10 · PAIRING: 20
- FORMULARY_PENDING: 14 · FUTURE_HIDDEN: 43 · OWNER_REVIEW: 8

- **GEN WRITES:** 0 · **WEBSITE MODIFIED:** NO · **CUTOVER:** OFF

**STOP FOR OWNER REVIEW.** Do not begin execution.
