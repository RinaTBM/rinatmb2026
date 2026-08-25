# Website → GEN Routing Matrix

**Generated:** 2026-08-25T00:27:41Z  
**Phase:** MBM-OWNER-ROUTING-DECISION-GATE-2 — OWNER APPROVAL APPLIED  
**Mode:** READ-ONLY — owner decisions locked into routing; no GEN/website writes  

Website architecture: **LOCKED** — one family → selectors/variants → exact GEN backend route.

**Owner decisions locked:** `A · A · B · A · A · B · A · A` (see [`MBM_OWNER_ROUTING_DECISIONS_2.md`](./MBM_OWNER_ROUTING_DECISIONS_2.md))

## Status definitions

- **`ROUTING_READY`** — Exact website→GEN CP→formulary→pharmacy→package→price path proven
- **`GEN_PRODUCT_CREATE_REQUIRED`** — No appropriate GEN CP; create at execution
- **`GEN_PRODUCT_REPAIR_REQUIRED`** — GEN CP exists but needs correction (price/pairing/name/attachments)
- **`GEN_PAIRING_REQUIRED`** — CP exists (or identified) but exact formulary attachment missing/unproven
- **`FORMULARY_PENDING`** — Exact formulary unavailable — sourcing required
- **`PRICE_PENDING`** — Cost/package incomplete — cannot compute retail
- **`FUTURE_HIDDEN`** — Not patient-visible yet
- **`BLOCKED_OWNER_REVIEW`** — Unsafe, transitional, or owner decision required before routing

## Counts (103 variants)

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
| **TOTAL** | **103** |

## Owner-decision effects (applied)

| Decision | Variant | Choice | New status |
|---:|---|:---:|---|
| 1 | `sem-current-b6` | A | FUTURE_HIDDEN — remove B6 at cutover |
| 2 | `tir-current-b6` | A | FUTURE_HIDDEN — remove B6 at cutover |
| 3 | `nad-inj-selected-r83` | B | FUTURE_HIDDEN — do not substitute 200mg/mL |
| 4 | `nad-nasal-r81` | A | FUTURE_HIDDEN — use r84 |
| 5 | `nad-nasal-r82` | A | FUTURE_HIDDEN — use r85 |
| 6 | `tretinoin-selected-r126` | B | FUTURE_HIDDEN — keep website 0.025/0.05/0.1% |
| 7 | `tretinoin-selected-r127` | A | FUTURE_HIDDEN — do not map combo to plain |
| 8 | `scream-cream-pending` | A | FUTURE_HIDDEN — do not activate |

**Also locked:** NAD+ 100mg/mL Injection + Tretinoin website strengths remain `FORMULARY_PENDING` (sourcing). NAD nasal **r84/r85** = `GEN_PAIRING_REQUIRED` under ONE NAD+ family.

## Full route table

| Family | Variant | Delivery | Price | GEN CP | Formulary | Status | Launch |
|---|---|---|---|---|---|---|---|
| Semaglutide | `sem-b12-starting-low` | Injection | 89–99 | `SkqQHmsc0WdsbK9vmV1y` | r3,r5 | `GEN_PRODUCT_REPAIR_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-b12-mid` | Injection | 109 | `BLf8inX395YNc7WPCD4O` | r7 | `GEN_PAIRING_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-b12-high` | Injection | 109–119 | `34I2X8MpVZf3AQTff3bo` | r9,r11 | `GEN_PRODUCT_REPAIR_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-b12-any-dose` | Injection | 89–119 | `MkDIUw0NcJB7YL2pNzYW` | r3,r5,r7,r9,r11 | `GEN_PRODUCT_REPAIR_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-starting-low` | Injection | 89–99 | `tk2GW39OGr7JX4MCCoJP` | r2,r4 | `GEN_PRODUCT_REPAIR_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-mid` | Injection | 109 | `CjqOUbPuGPZzxephqRou` | r6 | `GEN_PRODUCT_REPAIR_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-high` | Injection | 109–119 | `sssEk3FDY4LFbQYGQsLx` | r8,r10 | `GEN_PRODUCT_REPAIR_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-any-dose` | Injection | 89–119 | `wQK2JsFnh7oFBf3Lag4n` | r2,r4,r6,r8,r10 | `GEN_PRODUCT_REPAIR_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-current-b6` | Injection | — | `—` | — | `FUTURE_HIDDEN` | CURRENT_LIVE_UNTIL_CUTOVER_THEN_REMOVE |
| Semaglutide | `sem-membership` | Injection | 149 | `5F8jESeVeXcpkLU5rrdK` | — | `GEN_PRODUCT_REPAIR_REQUIRED` | CURRENT_LIVE |
| Semaglutide | `sem-b12-3month` | Injection | 359 | `sN2ggSXRJINjElMYTQjf` | r3,r5,r7,r9,r11 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Tirzepatide | `tir-b12-starting-low` | Injection | 119–139 | `—` | r14,r16 | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-b12-mid` | Injection | 149–159 | `—` | r18,r20 | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-b12-high` | Injection | 169–179 | `—` | r22,r24 | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-b12-any-dose` | Injection | 119–179 | `—` | r14,r16,r18,r20,r22,r24 | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-starting-low` | Injection | 119–139 | `—` | r13,r15 | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-mid` | Injection | 149–159 | `—` | r17,r19 | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-high` | Injection | 169–179 | `—` | r21,r23 | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-any-dose` | Injection | 119–179 | `—` | r13,r15,r17,r19,r21,r23 | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-current-b6` | Injection | — | `—` | — | `FUTURE_HIDDEN` | CURRENT_LIVE_UNTIL_CUTOVER_THEN_REMOVE |
| Tirzepatide | `tir-membership` | Injection | 275 | `E3MXZeeR01QROCuTLRLE` | — | `GEN_PRODUCT_REPAIR_REQUIRED` | CURRENT_LIVE |
| NAD+ | `nad-inj-5ml-500` | Injection | 199 | `SHJpGAACUFEeMONdpEbn` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| NAD+ | `nad-inj-10ml-1000` | Injection | 229 | `SHJpGAACUFEeMONdpEbn` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| NAD+ | `nad-inj-selected-r83` | Injection | 139 | `SHJpGAACUFEeMONdpEbn` | r83 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| NAD+ | `nad-nasal-r84` | Nasal Spray | 79 | `FVwkzvQqWIZRNAwbslGw` | r84 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| NAD+ | `nad-nasal-r85` | Nasal Spray | 109 | `FVwkzvQqWIZRNAwbslGw` | r85 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Wolverine / BPC-TB | `wolverine-capsule` | Capsule | 29 | `omhh3NabouO8AsNR5tkD` | r104 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Wolverine / BPC-TB | `wolverine-injection` | Injection | 159 | `iJtyig611AZEDBGdvRd9` | r103 | `GEN_PRODUCT_REPAIR_REQUIRED` | CURRENT_LIVE |
| NAD+ | `nad-nasal-r81` | Nasal Spray | 79 | `FVwkzvQqWIZRNAwbslGw` | r81 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| NAD+ | `nad-nasal-r82` | Nasal Spray | 109 | `FVwkzvQqWIZRNAwbslGw` | r82 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Minoxidil | `minoxidil-fin-minox-0.1-5` | Topical | 79 | `BboYS4a2Uj7APetrFo6W` | r129 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Minoxidil | `minoxidil-solution` | Topical | 29 | `489YrehNXRlL77fYPkOn` | r128 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Minoxidil | `minoxidil-cream` | Topical | 89 | `489YrehNXRlL77fYPkOn` | r131,r132,r133 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Minoxidil | `fin-minox-tret` | Topical | 89 | `EeWMcfCJf5EU2LkNQmp9` | r134,r135,r136 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Estradiol | `estradiol-patch-r26` | Patch | 119 | `o7dNtf9QsnEqPCrLr2tR` | r26 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Estradiol | `estradiol-patch-r27` | Patch | 129 | `o7dNtf9QsnEqPCrLr2tR` | r27 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Estradiol | `estradiol-patch-r28` | Patch | 139 | `o7dNtf9QsnEqPCrLr2tR` | r28 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Estradiol | `estradiol-patch-r29` | Patch | 149 | `o7dNtf9QsnEqPCrLr2tR` | r29 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Estradiol | `estradiol-tablet-r37` | Tablet | 19 | `o7dNtf9QsnEqPCrLr2tR` | r37 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Estradiol | `estradiol-tablet-r38` | Tablet | 19 | `o7dNtf9QsnEqPCrLr2tR` | r38 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Estradiol | `estradiol-tablet-r39` | Tablet | 19 | `o7dNtf9QsnEqPCrLr2tR` | r39 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Estradiol | `estradiol-injection-r40` | Injection | 89 | `o7dNtf9QsnEqPCrLr2tR` | r40 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Progesterone | `prog-ir-r41` | Capsule | 29 | `5dGkjdpLP7DkKKE2iVxh` | r41 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r42` | Capsule | 29 | `5dGkjdpLP7DkKKE2iVxh` | r42 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r43` | Capsule | 29 | `5dGkjdpLP7DkKKE2iVxh` | r43 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r44` | Capsule | 29 | `5dGkjdpLP7DkKKE2iVxh` | r44 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r45` | Capsule | 29 | `5dGkjdpLP7DkKKE2iVxh` | r45 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r46` | Capsule | 29 | `5dGkjdpLP7DkKKE2iVxh` | r46 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r47` | Capsule | 29 | `5dGkjdpLP7DkKKE2iVxh` | r47 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r48` | Capsule | 29 | `5dGkjdpLP7DkKKE2iVxh` | r48 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r49` | Capsule | 29 | `5dGkjdpLP7DkKKE2iVxh` | r49 | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-sr-r50` | Capsule | 19 | `—` | r50 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Progesterone | `prog-sr-r51` | Capsule | 19 | `—` | r51 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Progesterone | `prog-sr-r52` | Capsule | 19 | `—` | r52 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Tretinoin | `tretinoin-0.025%` | Cream | 79 | `—` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Tretinoin | `tretinoin-0.05%` | Cream | 89 | `—` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Tretinoin | `tretinoin-0.1%` | Cream | 109 | `—` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Tretinoin | `tretinoin-selected-r126` | Cream | 79 | `EeWMcfCJf5EU2LkNQmp9` | r126 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Tretinoin | `tretinoin-selected-r127` | Cream | 129 | `EeWMcfCJf5EU2LkNQmp9` | r127 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Fat Burner | `fat-burner-current` | Injection | 259 | `7Kix55LA15U0lNvY9QXI` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Testosterone | `testosterone-current` | Cream | 79 | `Gn4XaP00anr4q9oheSTe` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Testosterone | `testosterone-inj-r76` | Injection | 59 | `Cm94vp3KgPz0yhqy01gX` | r76 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Testosterone | `testosterone-inj-r77` | Injection | 59 | `Cm94vp3KgPz0yhqy01gX` | r77 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Selank | `selank-current` | Injection | 129 | `Ukctbyh5Yrek3SnGSYA3` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Selank | `selank-nasal-r119` | Nasal Spray | 129 | `Ukctbyh5Yrek3SnGSYA3` | r119 | `GEN_PAIRING_REQUIRED` | FUTURE_HIDDEN |
| Semax | `semax-current` | Injection | 129 | `YTHcdrlRICMpt56hdxeJ` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Semax | `semax-nasal-r118` | Nasal Spray | 129 | `YTHcdrlRICMpt56hdxeJ` | r118 | `GEN_PAIRING_REQUIRED` | FUTURE_HIDDEN |
| Selank + Semax Blend | `selank-semax-blend-current` | Nasal Spray | 169 | `LWkYtwm66dIeLuDSvSfi` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Tesamorelin | `tesamorelin-current` | Injection | 149 | `2cYxVfvwpWyyrANZx06G` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Lash / Brow Growth Serum | `lash-brow-current` | Solution | 89 | `—` | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| PT-141 | `pt141-inj-r115` | Injection | 129 | `7a11W067k20AKLSsL2xM` | r115 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| PT-141 | `pt141-nasal-r116` | Nasal Spray | 139 | `mSehcuPAbjD70fTWdckF` | r116 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| PT-141 | `pt141-nasal-r117` | Nasal Spray | 139 | `mSehcuPAbjD70fTWdckF` | r117 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Glutathione | `glutathione-injection-r86` | Injection | 59 | `17H4pVR8uYnwvcBIz8iY` | r86 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Glutathione | `glutathione-injection-r87` | Injection | 99 | `17H4pVR8uYnwvcBIz8iY` | r87 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r105` | Cream | 109 | `MXsSZY2GpiCByJUQer1p` | r105 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r106` | Cream | 129 | `MXsSZY2GpiCByJUQer1p` | r106 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r107` | Cream | 189 | `MXsSZY2GpiCByJUQer1p` | r107 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r108` | Cream | 109 | `MXsSZY2GpiCByJUQer1p` | r108 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| MOTS-c | `mots-c-r112` | Injection | 129 | `7Kix55LA15U0lNvY9QXI` | r112 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Thymosin Alpha-1 | `thymosin-a1-r114` | Injection | 159 | `qgn9vCpD8bBN5pXNPKE5` | r114 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Dihexa | `dihexa-r124` | Capsule | 29 | `UIjUhnsOMiWRZFiKXFi7` | r124 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Dihexa | `dihexa-tes-r125` | Capsule | 29 | `UIjUhnsOMiWRZFiKXFi7` | r125 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r120` | Capsule | 19 | `—` | r120 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r121` | Capsule | 19 | `—` | r121 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r122` | Capsule | 19 | `—` | r122 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r123` | Capsule | 19 | `—` | r123 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r30` | Cream | 69 | `RWtVLDbXlP7rsR31FXmH` | r30 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r31` | Cream | 79 | `RWtVLDbXlP7rsR31FXmH` | r31 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r32` | Cream | 89 | `RWtVLDbXlP7rsR31FXmH` | r32 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r33` | Cream | 99 | `RWtVLDbXlP7rsR31FXmH` | r33 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r34` | Troche | 29 | `CO68GB2vs5lyfN6awklC` | r34 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r35` | Troche | 29 | `CO68GB2vs5lyfN6awklC` | r35 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r36` | Troche | 29 | `CO68GB2vs5lyfN6awklC` | r36 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r65` | Troche | 29 | `CO68GB2vs5lyfN6awklC` | r65 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Sildenafil / Testosterone Troche | `sildenafil-testosterone-troche-r75` | Troche | 39 | `w0Rf0DXmI8ukPgoMtH6g` | r75 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| BPC Triple / Quad Blends | `bpc-tb-ghk-r100` | Injection | 159 | `5iCQzEtTXw90ctEhIhkB` | r100 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| BPC Triple / Quad Blends | `bpc-ghk-kpv-tb-r101` | Injection | 159 | `MXsSZY2GpiCByJUQer1p` | r101 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| BPC Triple / Quad Blends | `bpc-kpv-tb-r102` | Injection | 159 | `MXsSZY2GpiCByJUQer1p` | r102 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| MOTS-c / Tesamorelin | `mots-tes-r113` | Injection | 159 | `7Kix55LA15U0lNvY9QXI` | r113 | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Oxytocin | `oxytocin-pending` | — | — | `—` | — | `FORMULARY_PENDING` | FUTURE_HIDDEN |
| Sexual Wellness Compound | `sexual-wellness-compound-pending` | — | — | `—` | — | `FORMULARY_PENDING` | FUTURE_HIDDEN |
| Scream Cream | `scream-cream-pending` | — | — | `—` | — | `FUTURE_HIDDEN` | FUTURE_HIDDEN |

## Family summaries

- **BPC Triple / Quad Blends:** variants=3 · {'FUTURE_HIDDEN': 3}
- **Custom HRT Cream:** variants=4 · {'FUTURE_HIDDEN': 4}
- **Custom Hormone Troche:** variants=4 · {'FUTURE_HIDDEN': 4}
- **Dihexa:** variants=2 · {'FUTURE_HIDDEN': 2}
- **Estradiol:** variants=8 · {'GEN_PAIRING_REQUIRED': 4, 'FUTURE_HIDDEN': 4}
- **Fat Burner:** variants=1 · {'FORMULARY_PENDING': 1}
- **GHK-Cu:** variants=4 · {'FUTURE_HIDDEN': 4}
- **Glutathione:** variants=2 · {'FUTURE_HIDDEN': 2}
- **Lash / Brow Growth Serum:** variants=1 · {'FORMULARY_PENDING': 1}
- **MOTS-c:** variants=1 · {'FUTURE_HIDDEN': 1}
- **MOTS-c / Tesamorelin:** variants=1 · {'FUTURE_HIDDEN': 1}
- **Methylene Blue:** variants=4 · {'FUTURE_HIDDEN': 4}
- **Minoxidil:** variants=4 · {'GEN_PAIRING_REQUIRED': 1, 'FUTURE_HIDDEN': 3}
- **NAD+:** variants=7 · {'FORMULARY_PENDING': 2, 'FUTURE_HIDDEN': 3, 'GEN_PAIRING_REQUIRED': 2}
- **Oxytocin:** variants=1 · {'FORMULARY_PENDING': 1}
- **PT-141:** variants=3 · {'FUTURE_HIDDEN': 3}
- **Progesterone:** variants=12 · {'GEN_PAIRING_REQUIRED': 9, 'FUTURE_HIDDEN': 3}
- **Scream Cream:** variants=1 · {'FUTURE_HIDDEN': 1}
- **Selank:** variants=2 · {'FORMULARY_PENDING': 1, 'GEN_PAIRING_REQUIRED': 1}
- **Selank + Semax Blend:** variants=1 · {'FORMULARY_PENDING': 1}
- **Semaglutide:** variants=11 · {'GEN_PRODUCT_REPAIR_REQUIRED': 8, 'GEN_PAIRING_REQUIRED': 1, 'FUTURE_HIDDEN': 2}
- **Semax:** variants=2 · {'FORMULARY_PENDING': 1, 'GEN_PAIRING_REQUIRED': 1}
- **Sexual Wellness Compound:** variants=1 · {'FORMULARY_PENDING': 1}
- **Sildenafil / Testosterone Troche:** variants=1 · {'FUTURE_HIDDEN': 1}
- **Tesamorelin:** variants=1 · {'FORMULARY_PENDING': 1}
- **Testosterone:** variants=3 · {'FORMULARY_PENDING': 1, 'FUTURE_HIDDEN': 2}
- **Thymosin Alpha-1:** variants=1 · {'FUTURE_HIDDEN': 1}
- **Tirzepatide:** variants=10 · {'GEN_PRODUCT_CREATE_REQUIRED': 8, 'FUTURE_HIDDEN': 1, 'GEN_PRODUCT_REPAIR_REQUIRED': 1}
- **Tretinoin:** variants=5 · {'FORMULARY_PENDING': 3, 'FUTURE_HIDDEN': 2}
- **Wolverine / BPC-TB:** variants=2 · {'GEN_PAIRING_REQUIRED': 1, 'GEN_PRODUCT_REPAIR_REQUIRED': 1}

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

**STOP FOR OWNER REVIEW.** Do not execute GEN. Do not modify website. Cutover OFF.
