# MBM Website → GEN Routing Matrix

**Generated:** 2026-08-24T22:44:24Z  
**Phase:** MBM-WEBSITE-PRODUCT-ARCHITECTURE-LOCK  
**Mode:** READ-ONLY DESIGN — no fuzzy routing · no invented mappings

Family architecture: [`MBM_WEBSITE_PRODUCT_FAMILY_ARCHITECTURE.md`](./MBM_WEBSITE_PRODUCT_FAMILY_ARCHITECTURE.md) · JSON: [`MBM_WEBSITE_TO_GEN_ROUTING_MATRIX.json`](./MBM_WEBSITE_TO_GEN_ROUTING_MATRIX.json)

---

## Status definitions

- **`ROUTING_READY`** — Exact formulary + GEN CP + verified pairing — checkout-eligible when launch state allows
- **`FORMULARY_PENDING`** — Exact formulary/source missing — BACKEND_MAPPING_PENDING
- **`GEN_PRODUCT_CREATE_REQUIRED`** — Formulary verified; GEN client product must be created at execution
- **`GEN_PAIRING_REQUIRED`** — GEN CP exists; exact formulary pairing/repair still required — not fuzzy
- **`FUTURE_HIDDEN`** — Not patient-visible yet
- **`BLOCKED`** — Must not route / legacy / transitional B6 / do-not-activate

No website variant may become checkout-enabled without an exact backend routing target. If unavailable → `FORMULARY_PENDING` / `BACKEND_MAPPING_PENDING`.

---

## Counts

| Status | Count |
|---|---:|
| `FUTURE_HIDDEN` | 43 |
| `GEN_PAIRING_REQUIRED` | 35 |
| `FORMULARY_PENDING` | 14 |
| `GEN_PRODUCT_CREATE_REQUIRED` | 8 |
| `BLOCKED` | 3 |
| **TOTAL ROUTES** | **103** |

---

## Routing table (all selectable configurations)

| Family | Option ID | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Formulary rows | Pharmacy | Status | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Semaglutide | `sem-current-b6` | Injection | Vitamin B6 (legacy website) | website current | — | one_time | — | `—` | — | — | `BLOCKED` | CURRENT_LIVE |
| Semaglutide | `sem-b12-starting-low` | Injection | Vitamin B12 | Starting / Low | 1mL vials (owner dose group) | one_time | 89–99 | `SkqQHmsc0WdsbK9vmV1y` | r3,r5 | Dirx-Hub | `GEN_PAIRING_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-b12-mid` | Injection | Vitamin B12 | Mid | 1mL vials (owner dose group) | one_time | 109 | `BLf8inX395YNc7WPCD4O` | r7 | Dirx-Hub | `GEN_PAIRING_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-b12-high` | Injection | Vitamin B12 | High | 1mL vials (owner dose group) | one_time | 109–119 | `34I2X8MpVZf3AQTff3bo` | r9,r11 | Dirx-Hub | `GEN_PAIRING_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-b12-any-dose` | Injection | Vitamin B12 | Any Dose | 1mL vials (owner dose group) | one_time | 89–119 | `MkDIUw0NcJB7YL2pNzYW` | r3,r5,r7,r9,r11 | Dirx-Hub | `GEN_PAIRING_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-starting-low` | Injection | Glycine | Starting / Low | 1mL vials (owner dose group) | one_time | 89–99 | `tk2GW39OGr7JX4MCCoJP` | r2,r4 | Dirx-Hub | `GEN_PAIRING_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-mid` | Injection | Glycine | Mid | 1mL vials (owner dose group) | one_time | 109 | `CjqOUbPuGPZzxephqRou` | r6 | Dirx-Hub | `GEN_PAIRING_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-high` | Injection | Glycine | High | 1mL vials (owner dose group) | one_time | 109–119 | `sssEk3FDY4LFbQYGQsLx` | r8,r10 | Dirx-Hub | `GEN_PAIRING_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-glycine-any-dose` | Injection | Glycine | Any Dose | 1mL vials (owner dose group) | one_time | 89–119 | `wQK2JsFnh7oFBf3Lag4n` | r2,r4,r6,r8,r10 | Dirx-Hub | `GEN_PAIRING_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Semaglutide | `sem-membership` | Injection | Any Dose (B12 or Glycine backend spl | Any Dose | — | membership | 149 | `5F8jESeVeXcpkLU5rrdK` | — | Dirx-Hub | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Semaglutide | `sem-b12-3month` | Injection | Vitamin B12 | multi-month | — | 3_month | — | `sN2ggSXRJINjElMYTQjf` | r3,r5,r7,r9,r11 | Dirx-Hub | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Tirzepatide | `tir-current-b6` | Injection | Vitamin B6 (legacy website) | website current | — | one_time | — | `—` | — | — | `BLOCKED` | CURRENT_LIVE |
| Tirzepatide | `tir-b12-starting-low` | Injection | Vitamin B12 | Starting / Low (5+10) | 2mL vials | one_time | 119–139 | `—` | r14,r16 | Dirx-Hub | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-b12-mid` | Injection | Vitamin B12 | Mid (15+20) | 2mL vials | one_time | 149–159 | `—` | r18,r20 | Dirx-Hub | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-b12-high` | Injection | Vitamin B12 | High (25+30) | 2mL vials | one_time | 169–179 | `—` | r22,r24 | Dirx-Hub | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-b12-any-dose` | Injection | Vitamin B12 | Any Dose (5–30) | 2mL vials | one_time | 119–179 | `—` | r14,r16,r18,r20,r22,r24 | Dirx-Hub | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-starting-low` | Injection | Glycine | Starting / Low (5+10) | 2mL vials | one_time | 119–139 | `—` | r13,r15 | Dirx-Hub | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-mid` | Injection | Glycine | Mid (15+20) | 2mL vials | one_time | 149–159 | `—` | r17,r19 | Dirx-Hub | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-high` | Injection | Glycine | High (25+30) | 2mL vials | one_time | 169–179 | `—` | r21,r23 | Dirx-Hub | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-glycine-any-dose` | Injection | Glycine | Any Dose (5–30) | 2mL vials | one_time | 119–179 | `—` | r13,r15,r17,r19,r21,r23 | Dirx-Hub | `GEN_PRODUCT_CREATE_REQUIRED` | LAUNCH_WITH_WEBSITE_CUTOVER |
| Tirzepatide | `tir-membership` | Injection | Any Dose (B12 or Glycine backend spl | Any Dose | — | membership | 275 | `E3MXZeeR01QROCuTLRLE` | — | Dirx-Hub | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| NAD+ | `nad-inj-5ml-500` | Injection | NAD+ | — | 5mL / 500mg total | one_time | 199 | `SHJpGAACUFEeMONdpEbn` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| NAD+ | `nad-inj-10ml-1000` | Injection | NAD+ | — | 10mL / 1000mg total | one_time | 229 | `SHJpGAACUFEeMONdpEbn` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| NAD+ | `nad-inj-selected-r83` | Injection | NAD+ 200mg/ml | — | 5ml vial (1000mg) | one_time | 139 | `SHJpGAACUFEeMONdpEbn` | r83 | St Luke | `GEN_PAIRING_REQUIRED` | CUTOVER_PENDING_FORMULARY |
| NAD+ | `nad-nasal-r81` | Nasal Spray | NAD+ 50mg/ml | — | 15ml | one_time | 79 | `FVwkzvQqWIZRNAwbslGw` | r81 | St Luke | `GEN_PAIRING_REQUIRED` | FUTURE_HIDDEN |
| NAD+ | `nad-nasal-r82` | Nasal Spray | NAD+ 200mg/ml | — | 15ml | one_time | 109 | `FVwkzvQqWIZRNAwbslGw` | r82 | St Luke | `GEN_PAIRING_REQUIRED` | FUTURE_HIDDEN |
| NAD+ | `nad-nasal-r84` | Nasal Spray | NAD+ 50mg/ml | — | 15ml | one_time | 79 | `FVwkzvQqWIZRNAwbslGw` | r84 | St Luke | `GEN_PAIRING_REQUIRED` | FUTURE_HIDDEN |
| NAD+ | `nad-nasal-r85` | Nasal Spray | NAD+ 200mg/ml | — | 15ml | one_time | 109 | `FVwkzvQqWIZRNAwbslGw` | r85 | St Luke | `GEN_PAIRING_REQUIRED` | FUTURE_HIDDEN |
| Wolverine / BPC-TB | `wolverine-capsule` | Capsule | BPC-157/TB-500 Blend | — | 1EA | one_time | 29 | `omhh3NabouO8AsNR5tkD` | r104 | Greenwich Pharmacy | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Wolverine / BPC-TB | `wolverine-injection` | Injection | BPC-157/TB-500 Blend | — | 5ML | one_time | 159 | `iJtyig611AZEDBGdvRd9` | r103 | Greenwich Pharmacy | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Minoxidil | `minoxidil-fin-minox-0.1-5` | Topical | Finasteride/Minoxidil 0.1%/5% | — | per ml foam basis | one_time | 79 | `BboYS4a2Uj7APetrFo6W` | r129 | Vios | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Minoxidil | `minoxidil-solution` | Topical | Minoxidil 2% solution | — | — | one_time | 29 | `489YrehNXRlL77fYPkOn` | r128 | Vios | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Minoxidil | `minoxidil-cream` | Topical | Minoxidil cream 7–15% | — | — | one_time | 89 | `489YrehNXRlL77fYPkOn` | r131,r132,r133 | Vios | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Minoxidil | `fin-minox-tret` | Topical | Finasteride/Minoxidil/Tretinoin topi | — | — | one_time | 89 | `EeWMcfCJf5EU2LkNQmp9` | r134,r135,r136 | Vios | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Estradiol | `estradiol-patch-r26` | Patch | Estradiol transdermal | — | — | one_time | 119 | `o7dNtf9QsnEqPCrLr2tR` | r26 | Valiant | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Estradiol | `estradiol-patch-r27` | Patch | Estradiol transdermal | — | — | one_time | 129 | `o7dNtf9QsnEqPCrLr2tR` | r27 | Valiant | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Estradiol | `estradiol-patch-r28` | Patch | Estradiol transdermal | — | — | one_time | 139 | `o7dNtf9QsnEqPCrLr2tR` | r28 | Valiant | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Estradiol | `estradiol-patch-r29` | Patch | Estradiol transdermal | — | — | one_time | 149 | `o7dNtf9QsnEqPCrLr2tR` | r29 | Valiant | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Estradiol | `estradiol-tablet-r37` | Tablet | ESTRADIOL 0.5MG TABLET 0.5MG | — | — | one_time | 19 | `o7dNtf9QsnEqPCrLr2tR` | r37 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Estradiol | `estradiol-tablet-r38` | Tablet | ESTRADIOL 1 MG TABLET 1 MG | — | — | one_time | 19 | `o7dNtf9QsnEqPCrLr2tR` | r38 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Estradiol | `estradiol-tablet-r39` | Tablet | ESTRADIOL 2 MG TABLET 2 MG | — | — | one_time | 19 | `o7dNtf9QsnEqPCrLr2tR` | r39 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Estradiol | `estradiol-injection-r40` | Injection | ESTRADIOL CYPIONATE (MCT OIL) 10 MG/ | — | 3ml mg/ml | one_time | 89 | `o7dNtf9QsnEqPCrLr2tR` | r40 | Vios | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Progesterone | `prog-ir-r41` | Capsule | Progesterone IR | — | 1 mg | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r41 | Vios | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r42` | Capsule | Progesterone IR | — | 1 mg | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r42 | Vios | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r43` | Capsule | Progesterone IR | — | 1 mg | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r43 | Vios | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r44` | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r44 | Vios | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r45` | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r45 | Vios | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r46` | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r46 | Vios | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r47` | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r47 | Vios | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r48` | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r48 | Vios | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-ir-r49` | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | r49 | Vios | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE |
| Progesterone | `prog-sr-r50` | Capsule | Progesterone SR | — | — | one_time | 19 | `—` | r50 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Progesterone | `prog-sr-r51` | Capsule | Progesterone SR | — | — | one_time | 19 | `—` | r51 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Progesterone | `prog-sr-r52` | Capsule | Progesterone SR | — | — | one_time | 19 | `—` | r52 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Tretinoin | `tretinoin-0.025%` | Cream | Tretinoin 0.025% | — | 20g | one_time | 79 | `—` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Tretinoin | `tretinoin-0.05%` | Cream | Tretinoin 0.05% | — | 20g | one_time | 89 | `—` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Tretinoin | `tretinoin-0.1%` | Cream | Tretinoin 0.1% | — | 20g | one_time | 109 | `—` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Tretinoin | `tretinoin-selected-r126` | Cream | TRETINOIN 0.15% | — | 30 grams | one_time | 79 | `EeWMcfCJf5EU2LkNQmp9` | r126 | Vios | `GEN_PAIRING_REQUIRED` | CUTOVER_PENDING_FORMULARY |
| Tretinoin | `tretinoin-selected-r127` | Cream | HYALURONIC/NIACINAMIDE/TRETINOIN 0.5 | — | 30 grams | one_time | 129 | `EeWMcfCJf5EU2LkNQmp9` | r127 | Vios | `GEN_PAIRING_REQUIRED` | CUTOVER_PENDING_FORMULARY |
| Fat Burner | `fat-burner-current` | Injection | AOD-9604 + MOTS-c + Tesamorelin (no  | — | 1.2/2/3 mg/mL · 5mL | one_time | 259 | `7Kix55LA15U0lNvY9QXI` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Testosterone | `testosterone-current` | Cream | Testosterone-only cream 5 mg/g | — | e.g. 30g TBD | one_time | 79 | `Gn4XaP00anr4q9oheSTe` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Testosterone | `testosterone-inj-r76` | Injection | TESTOSTERONE CYPIONATE (GRAPESEED OI | — | 5 mL | one_time | 59 | `Cm94vp3KgPz0yhqy01gX` | r76 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Testosterone | `testosterone-inj-r77` | Injection | TESTOSTERONE CYPIONATE (GRAPESEED OI | — | 5 mL | one_time | 59 | `Cm94vp3KgPz0yhqy01gX` | r77 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Selank | `selank-current` | Injection | Selank injectable | — | 5 mg/mL · 2mL target | one_time | 129 | `Ukctbyh5Yrek3SnGSYA3` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Selank | `selank-nasal-r119` | Nasal Spray | Selank 2.5mg/mL Nasal Spray | — | 20ml | one_time | 129 | `Ukctbyh5Yrek3SnGSYA3` | r119 | Greenwich Pharmacy | `GEN_PAIRING_REQUIRED` | FUTURE_HIDDEN |
| Semax | `semax-current` | Injection | Semax injectable | — | 5 mg/mL · 2mL target | one_time | 129 | `YTHcdrlRICMpt56hdxeJ` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Semax | `semax-nasal-r118` | Nasal Spray | Semax 2.5mg/mL Nasal Spray | — | 20ml | one_time | 129 | `YTHcdrlRICMpt56hdxeJ` | r118 | Greenwich Pharmacy | `GEN_PAIRING_REQUIRED` | FUTURE_HIDDEN |
| Selank + Semax Blend | `selank-semax-blend-current` | Nasal Spray | Combined Selank+Semax nasal | — | 50mcg/50mcg · 10mL | one_time | 169 | `LWkYtwm66dIeLuDSvSfi` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Tesamorelin | `tesamorelin-current` | Injection | Plain Tesamorelin | — | 10mg / 2mL · 5mg/mL | one_time | 149 | `2cYxVfvwpWyyrANZx06G` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| Lash / Brow Growth Serum | `lash-brow-current` | Solution | Bimatoprost 0.03% | — | 2.5mL | one_time | 89 | `—` | — | — | `FORMULARY_PENDING` | CURRENT_LIVE |
| PT-141 | `pt141-inj-r115` | Injection | PT-141 2mg/mL | — | 5ML | one_time | 129 | `7a11W067k20AKLSsL2xM` | r115 | Greenwich Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| PT-141 | `pt141-nasal-r116` | Nasal Spray | BREMELANOTIDE (PT-141) (PER ML) 10 M | — | 1 ml | one_time | 139 | `mSehcuPAbjD70fTWdckF` | r116 | Vios | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| PT-141 | `pt141-nasal-r117` | Nasal Spray | BREMELANOTIDE (PT-141) (PER ML) 5MG/ | — | 1 ml | one_time | 139 | `mSehcuPAbjD70fTWdckF` | r117 | Vios | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Glutathione | `glutathione-injection-r86` | Injection | Glutathione 200mg/ml | — | 10ml vial | one_time | 59 | `17H4pVR8uYnwvcBIz8iY` | r86 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Glutathione | `glutathione-injection-r87` | Injection | Glutathione 200mg/ml | — | 3x10ml vial (30ml) | one_time | 99 | `17H4pVR8uYnwvcBIz8iY` | r87 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r105` | Cream | GHK-Cu Cream 2mg/ml | — | 30gm | one_time | 109 | `MXsSZY2GpiCByJUQer1p` | r105 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r106` | Cream | GHK-Cu Cream 5mg/ml | — | 30gm | one_time | 129 | `MXsSZY2GpiCByJUQer1p` | r106 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r107` | Cream | GHK-Cu Cream 10mg/ml | — | 30gm | one_time | 189 | `MXsSZY2GpiCByJUQer1p` | r107 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| GHK-Cu | `ghk-cream-r108` | Cream | GHK-Cu Cream 2mg/ml | — | 30gm | one_time | 109 | `MXsSZY2GpiCByJUQer1p` | r108 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| MOTS-c | `mots-c-r112` | Injection | MOTS-C 2mg/mL | — | 5ML | one_time | 129 | `7Kix55LA15U0lNvY9QXI` | r112 | Greenwich Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Thymosin Alpha-1 | `thymosin-a1-r114` | Injection | THYMOSIN ALPHA-1 3 MG/ML (5 ML) | — | 5 mL | one_time | 159 | `qgn9vCpD8bBN5pXNPKE5` | r114 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Dihexa | `dihexa-r124` | Capsule | Dihexa capsules 5mg | — | 1EA | one_time | 29 | `UIjUhnsOMiWRZFiKXFi7` | r124 | Greenwich Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Dihexa | `dihexa-tes-r125` | Capsule | Dihexa/Tesofensine capsules 5mg/500m | — | — | one_time | 29 | `UIjUhnsOMiWRZFiKXFi7` | r125 | Greenwich Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r120` | Capsule | METHYLENE BLUE 5 MG | — | — | one_time | 19 | `—` | r120 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r121` | Capsule | METHYLENE BLUE 10 MG | — | — | one_time | 19 | `—` | r121 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r122` | Capsule | METHYLENE BLUE 15 MG | — | — | one_time | 19 | `—` | r122 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Methylene Blue | `methylene-blue-r123` | Capsule | METHYLENE BLUE 25 MG | — | — | one_time | 19 | `—` | r123 | Optimal Balance Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r30` | Cream | HRT Cream - 1 Ingredient (Estradiol/ | — | 30gm | one_time | 69 | `RWtVLDbXlP7rsR31FXmH` | r30 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r31` | Cream | HRT Cream - 2 Ingredients (Estradiol | — | 30gm | one_time | 79 | `RWtVLDbXlP7rsR31FXmH` | r31 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r32` | Cream | HRT Cream - 3 Ingredients (Estradiol | — | 30gm | one_time | 89 | `RWtVLDbXlP7rsR31FXmH` | r32 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom HRT Cream | `hrt-custom-cream-r33` | Cream | HRT Cream - 4 Ingredients (Estradiol | — | 30gm | one_time | 99 | `RWtVLDbXlP7rsR31FXmH` | r33 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r34` | Troche | Hormone Troche (Estradiol/Estriol/DH | — | Each | one_time | 29 | `CO68GB2vs5lyfN6awklC` | r34 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r35` | Troche | Hormone Troche (Estradiol/Estriol/DH | — | Each | one_time | 29 | `CO68GB2vs5lyfN6awklC` | r35 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r36` | Troche | Hormone Troche (Estradiol/Estriol/DH | — | Each | one_time | 29 | `CO68GB2vs5lyfN6awklC` | r36 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Custom Hormone Troche | `hrt-custom-troche-r65` | Troche | Hormone Troche (Estradiol/Estriol/DH | — | Each | one_time | 29 | `CO68GB2vs5lyfN6awklC` | r65 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Sildenafil / Testosterone Troche | `sildenafil-testosterone-troche-r75` | Troche | Sildenafil/Testosterone 120mg/22mg | — | Each | one_time | 39 | `w0Rf0DXmI8ukPgoMtH6g` | r75 | St Luke | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| BPC Triple / Quad Blends | `bpc-tb-ghk-r100` | Injection | BPC-157/TB-500/GHK-CU 3/3/10MG/ML | — | 5ML | one_time | 159 | `5iCQzEtTXw90ctEhIhkB` | r100 | Greenwich Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| BPC Triple / Quad Blends | `bpc-ghk-kpv-tb-r101` | Injection | BPC-157/GHK-CU/KPV/TB500 3mg/10mg/3m | — | 5ML | one_time | 159 | `MXsSZY2GpiCByJUQer1p` | r101 | Greenwich Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| BPC Triple / Quad Blends | `bpc-kpv-tb-r102` | Injection | BPC-157/KPV/TB500 3mg/3mg/3mg/mL | — | 5ML | one_time | 159 | `MXsSZY2GpiCByJUQer1p` | r102 | Greenwich Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| MOTS-c / Tesamorelin | `mots-tes-r113` | Injection | MOTS-C/Tesamorelin 2mg/3mg/mL | — | 5ml | one_time | 159 | `7Kix55LA15U0lNvY9QXI` | r113 | Greenwich Pharmacy | `FUTURE_HIDDEN` | FUTURE_HIDDEN |
| Oxytocin | `oxytocin-pending` | — | — | — | — | one_time | — | `—` | — | — | `FORMULARY_PENDING` | FUTURE_HIDDEN |
| Sexual Wellness Compound | `sexual-wellness-compound-pending` | — | — | — | — | one_time | — | `—` | — | — | `FORMULARY_PENDING` | FUTURE_HIDDEN |
| Scream Cream | `scream-cream-pending` | — | — | — | — | one_time | — | `—` | — | — | `BLOCKED` | FUTURE_HIDDEN |

---

## Key examples (locked patterns)

### NAD+

| Website config | Backend |
|---|---|
| Injection · 5mL/500mg or 10mL/1000mg (current) | `FORMULARY_PENDING` — 100mg/mL conflict vs SELECTED 200mg/ml |
| Injection · SELECTED r83 (owner option A) | GEN `SHJpGAACUFEeMONdpEbn` · St Luke r83 · `GEN_PAIRING_REQUIRED` |
| Nasal Spray · SELECTED nasal rows | GEN `FVwkzvQqWIZRNAwbslGw` · never cross-pair with injection |

### Semaglutide

| Website config | Backend |
|---|---|
| One-Time · B12 · Starting/Low|Mid|High|Any Dose | Existing SEM dose-group CPs · Dirx-Hub rows · `GEN_PAIRING_REQUIRED` |
| One-Time · Glycine · same tiers | Existing SEM Glycine CPs · `GEN_PAIRING_REQUIRED` |
| Membership $149 | GEN `5F8jESeVeXcpkLU5rrdK` · backend split invisible |

### Tirzepatide

| Website config | Backend |
|---|---|
| One-Time · B12/Glycine · owner tiers | Formulary verified · **`GEN_PRODUCT_CREATE_REQUIRED`** (8) |
| Membership $275 | GEN `E3MXZeeR01QROCuTLRLE` · `GEN_PAIRING_REQUIRED` |

### Wolverine

| Website config | Backend |
|---|---|
| Capsules | SELECTED r104 · GEN candidate · `GEN_PAIRING_REQUIRED` |
| Injection | SELECTED r103 · GEN `iJtyig611AZEDBGdvRd9` (BPC-157/TB500 paired) · verify exact · `GEN_PAIRING_REQUIRED` |

---

## FINAL REPORT

- **ROUTING_READY:** 0
- **FORMULARY_PENDING:** 14
- **GEN_PRODUCT_CREATE_REQUIRED:** 8
- **GEN_PAIRING_REQUIRED:** 35
- **FUTURE_HIDDEN:** 43
- **BLOCKED:** 3

- **GEN MODIFIED:** NO · **GEN WRITES:** 0 · **WEBSITE MODIFIED:** NO · **CUTOVER:** OFF

**STOP FOR OWNER REVIEW.** No GEN-CATALOG-2B. No website execution. No new pairings.
