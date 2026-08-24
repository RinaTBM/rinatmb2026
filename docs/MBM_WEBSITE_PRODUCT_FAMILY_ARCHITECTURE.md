# MBM Website Product Family Architecture

**Generated:** 2026-08-24T22:44:24Z  
**Phase:** MBM-WEBSITE-PRODUCT-ARCHITECTURE-LOCK  
**Mode:** READ-ONLY DESIGN — no GEN writes, no website writes, no checkout cutover, no pairing changes  
**GEN-CATALOG-2B:** NOT STARTED · **Cutover:** OFF

Companion routing: [`MBM_WEBSITE_TO_GEN_ROUTING_MATRIX.md`](./MBM_WEBSITE_TO_GEN_ROUTING_MATRIX.md) · [`MBM_WEBSITE_PRODUCT_FAMILY_ARCHITECTURE.json`](./MBM_WEBSITE_PRODUCT_FAMILY_ARCHITECTURE.json)

---

## Locked website model

**ONE clean patient-facing medication/product page** → customer selects applicable options → selected option maps to the **exact** GEN backend product / formulary route.

Do **not** create a separate website card for every dosage form, strength, additive, vial size, package, pharmacy, GEN client product, or formulary row — unless it is a genuinely different patient-facing medication.

One website product **may** map to multiple GEN client products. Customers do not see GEN architecture.

### Design principles

- One clean patient-facing medication/product page per family
- Customer selects applicable options underneath
- Selected option maps to exact GEN backend / formulary route
- Do not create a card per dosage form, strength, pharmacy, GEN CP, or formulary row
- One website product may map to multiple GEN client products
- No checkout without exact backend routing target

### Selectors (use only when applicable)

`DELIVERY METHOD` · `FORMULATION / ADDITIVE` · `DOSE / TIER` · `STRENGTH` · `PACKAGE SIZE` · `PURCHASE MODEL`

---

## Family index

| Family | Category | Current website slug | Selectors | Variants |
|---|---|---|---|---:|
| **Semaglutide** | Weight Management | `semaglutide` | purchase_type, formulation_additive, dose_tier | 11 |
| **Tirzepatide** | Weight Management | `tirzepatide` | purchase_type, formulation_additive, dose_tier | 10 |
| **NAD+** | Longevity & Cognitive | `nad-plus` | delivery_method, package_size | 7 |
| **Wolverine / BPC-TB** | Recovery & Performance | `bpc-157-tb-500` | delivery_method | 2 |
| **Minoxidil** | Prescription Skin & Hair | `minoxidil-topical` | formulation | 4 |
| **Estradiol** | Women's Hormone Therapy | `estradiol-patch` | delivery_method, strength | 8 |
| **Progesterone** | Women's Hormone Therapy | `progesterone-capsules` | formulation, strength | 12 |
| **Tretinoin** | Prescription Skin & Hair | `tretinoin-cream` | strength | 5 |
| **Fat Burner** | Weight Management | `fat-burner` | (pending — single current variant) | 1 |
| **Testosterone** | Men's Hormone Therapy | `testosterone-cream` | delivery_method | 3 |
| **Selank** | Longevity & Cognitive | `selank` | delivery_method | 2 |
| **Semax** | Longevity & Cognitive | `semax` | delivery_method | 2 |
| **Selank + Semax Blend** | Longevity & Cognitive | `selank-semax-nasal-spray` | (pending — single current variant) | 1 |
| **Tesamorelin** | Longevity & Cognitive | `tesamorelin` | (pending — single current variant) | 1 |
| **Lash / Brow Growth Serum** | Prescription Skin & Hair | `bimatoprost-solution` | (pending — single current variant) | 1 |
| **PT-141** | Sexual Wellness | `—` | delivery_method, strength | 3 |
| **Glutathione** | Longevity & Cognitive | `—` | delivery_method | 2 |
| **GHK-Cu** | Prescription Skin & Hair | `—` | strength | 4 |
| **MOTS-c** | Longevity & Cognitive | `—` | formulation | 1 |
| **Thymosin Alpha-1** | Longevity & Cognitive | `—` | (single / pending) | 1 |
| **Dihexa** | Longevity & Cognitive | `—` | formulation | 2 |
| **Methylene Blue** | Longevity & Cognitive | `—` | strength | 4 |
| **Custom HRT Cream** | Women's Hormone Therapy | `—` | formulation | 4 |
| **Custom Hormone Troche** | Women's Hormone Therapy | `—` | formulation | 4 |
| **Sildenafil / Testosterone Troche** | Sexual Wellness | `—` | (single / pending) | 1 |
| **BPC Triple / Quad Blends** | Recovery & Performance | `—` | formulation | 3 |
| **MOTS-c / Tesamorelin** | Longevity & Cognitive | `—` | (single / pending) | 1 |
| **Oxytocin** | Sexual Wellness | `—` | (single / pending) | 1 |
| **Sexual Wellness Compound** | Sexual Wellness | `—` | (single / pending) | 1 |
| **Scream Cream** | Sexual Wellness | `—` | (single / pending) | 1 |

---

## Semaglutide

- **Family ID:** `semaglutide`
- **Category:** Weight Management
- **Launch summary:** CURRENT_LIVE (B6 transitional + membership) → CUTOVER replaces one-time with B12/Glycine dose groups
- **Rule:** ONE website product page. Selectors: Purchase Type, Formulation (B12|Glycine), Dose tier. Do not reintroduce B6.
- **Price display:** Starting at $89 (cutover one-time); Membership $149

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `sem-current-b6` | Semaglutide + B6 (current website until cutover) | Injection | Vitamin B6 (legacy website) | website current | — | one_time | — | `—` | `BLOCKED` | CURRENT_WEBSITE_ONLY | CURRENT_LIVE |
| `sem-b12-starting-low` | Starting / Low · Vitamin B12 | Injection | Vitamin B12 | Starting / Low | 1mL vials (owner dose group) | one_time | 89–99 | `SkqQHmsc0WdsbK9vmV1y` | `GEN_PAIRING_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `sem-b12-mid` | Mid · Vitamin B12 | Injection | Vitamin B12 | Mid | 1mL vials (owner dose group) | one_time | 109 | `BLf8inX395YNc7WPCD4O` | `GEN_PAIRING_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `sem-b12-high` | High · Vitamin B12 | Injection | Vitamin B12 | High | 1mL vials (owner dose group) | one_time | 109–119 | `34I2X8MpVZf3AQTff3bo` | `GEN_PAIRING_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `sem-b12-any-dose` | Any Dose · Vitamin B12 | Injection | Vitamin B12 | Any Dose | 1mL vials (owner dose group) | one_time | 89–119 | `MkDIUw0NcJB7YL2pNzYW` | `GEN_PAIRING_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `sem-glycine-starting-low` | Starting / Low · Glycine | Injection | Glycine | Starting / Low | 1mL vials (owner dose group) | one_time | 89–99 | `tk2GW39OGr7JX4MCCoJP` | `GEN_PAIRING_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `sem-glycine-mid` | Mid · Glycine | Injection | Glycine | Mid | 1mL vials (owner dose group) | one_time | 109 | `CjqOUbPuGPZzxephqRou` | `GEN_PAIRING_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `sem-glycine-high` | High · Glycine | Injection | Glycine | High | 1mL vials (owner dose group) | one_time | 109–119 | `sssEk3FDY4LFbQYGQsLx` | `GEN_PAIRING_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `sem-glycine-any-dose` | Any Dose · Glycine | Injection | Glycine | Any Dose | 1mL vials (owner dose group) | one_time | 89–119 | `wQK2JsFnh7oFBf3Lag4n` | `GEN_PAIRING_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `sem-membership` | SEMAGLUTIDE COMPOUND — ANY DOSE Membership | Injection | Any Dose (B12 or Glycine backend split i | Any Dose | — | membership | 149 | `5F8jESeVeXcpkLU5rrdK` | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE_MEMBERSHIP | CURRENT_LIVE |
| `sem-b12-3month` | 3-Month supply · Vitamin B12 | Injection | Vitamin B12 | multi-month | — | 3_month | — | `sN2ggSXRJINjElMYTQjf` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |

## Tirzepatide

- **Family ID:** `tirzepatide`
- **Category:** Weight Management
- **Launch summary:** CURRENT_LIVE (B6 transitional + membership) → CUTOVER B12/Glycine dose groups
- **Rule:** ONE website product. Selectors: Purchase Type, Formulation, Dose (owner tiers). Do not use Tirzepatide/B12/Glycine ambiguous blends.
- **Price display:** Starting at $119 (cutover one-time); Membership $275 at cutover

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `tir-current-b6` | Tirzepatide + B6 (current website until cutover) | Injection | Vitamin B6 (legacy website) | website current | — | one_time | — | `—` | `BLOCKED` | CURRENT_WEBSITE_ONLY | CURRENT_LIVE |
| `tir-b12-starting-low` | Starting / Low · Vitamin B12 | Injection | Vitamin B12 | Starting / Low (5+10) | 2mL vials | one_time | 119–139 | `—` | `GEN_PRODUCT_CREATE_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `tir-b12-mid` | Mid · Vitamin B12 | Injection | Vitamin B12 | Mid (15+20) | 2mL vials | one_time | 149–159 | `—` | `GEN_PRODUCT_CREATE_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `tir-b12-high` | High · Vitamin B12 | Injection | Vitamin B12 | High (25+30) | 2mL vials | one_time | 169–179 | `—` | `GEN_PRODUCT_CREATE_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `tir-b12-any-dose` | Any Dose · Vitamin B12 | Injection | Vitamin B12 | Any Dose (5–30) | 2mL vials | one_time | 119–179 | `—` | `GEN_PRODUCT_CREATE_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `tir-glycine-starting-low` | Starting / Low · Glycine | Injection | Glycine | Starting / Low (5+10) | 2mL vials | one_time | 119–139 | `—` | `GEN_PRODUCT_CREATE_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `tir-glycine-mid` | Mid · Glycine | Injection | Glycine | Mid (15+20) | 2mL vials | one_time | 149–159 | `—` | `GEN_PRODUCT_CREATE_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `tir-glycine-high` | High · Glycine | Injection | Glycine | High (25+30) | 2mL vials | one_time | 169–179 | `—` | `GEN_PRODUCT_CREATE_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `tir-glycine-any-dose` | Any Dose · Glycine | Injection | Glycine | Any Dose (5–30) | 2mL vials | one_time | 119–179 | `—` | `GEN_PRODUCT_CREATE_REQUIRED` | OFF_UNTIL_CUTOVER | LAUNCH_WITH_WEBSITE_CUTOVER |
| `tir-membership` | TIRZEPATIDE COMPOUND — ANY DOSE Membership | Injection | Any Dose (B12 or Glycine backend split i | Any Dose | — | membership | 275 | `E3MXZeeR01QROCuTLRLE` | `GEN_PAIRING_REQUIRED` | CURRENT_LIVE_MEMBERSHIP_REPRICE_AT_CUTOVER | CURRENT_LIVE |

## NAD+

- **Family ID:** `nad-plus`
- **Category:** Longevity & Cognitive
- **Launch summary:** CURRENT_LIVE injection (strength pending) + FUTURE nasal under ONE family
- **Rule:** ONE website product NAD+. Selectors: Delivery Method (Injection|Nasal), Package. Injection and nasal priced and GEN-mapped separately. Never cross-pair.
- **Price display:** Starting at $199 (current injection list) / nasal from $79 when launched

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `nad-inj-5ml-500` | Injection · 5 mL / 500 mg | Injection | NAD+ | — | 5mL / 500mg total | one_time | 199 | `SHJpGAACUFEeMONdpEbn` | `FORMULARY_PENDING` | CURRENT_WEBSITE_STRENGTH_PENDING | CURRENT_LIVE |
| `nad-inj-10ml-1000` | Injection · 10 mL / 1000 mg | Injection | NAD+ | — | 10mL / 1000mg total | one_time | 229 | `SHJpGAACUFEeMONdpEbn` | `FORMULARY_PENDING` | CURRENT_WEBSITE_STRENGTH_PENDING | CURRENT_LIVE |
| `nad-inj-selected-r83` | Injection · SELECTED r83 200mg/ml · 5ml (1000mg) — owner option A | Injection | NAD+ 200mg/ml | — | 5ml vial (1000mg) | one_time | 139 | `SHJpGAACUFEeMONdpEbn` | `GEN_PAIRING_REQUIRED` | OFF_PENDING_OWNER_STRENGTH_DECISION | CUTOVER_PENDING_FORMULARY |
| `nad-nasal-r81` | Nasal Spray · NAD+ 50mg/ml | Nasal Spray | NAD+ 50mg/ml | — | 15ml | one_time | 79 | `FVwkzvQqWIZRNAwbslGw` | `GEN_PAIRING_REQUIRED` | OFF | FUTURE_HIDDEN |
| `nad-nasal-r82` | Nasal Spray · NAD+ 200mg/ml | Nasal Spray | NAD+ 200mg/ml | — | 15ml | one_time | 109 | `FVwkzvQqWIZRNAwbslGw` | `GEN_PAIRING_REQUIRED` | OFF | FUTURE_HIDDEN |
| `nad-nasal-r84` | Nasal Spray · NAD+ 50mg/ml | Nasal Spray | NAD+ 50mg/ml | — | 15ml | one_time | 79 | `FVwkzvQqWIZRNAwbslGw` | `GEN_PAIRING_REQUIRED` | OFF | FUTURE_HIDDEN |
| `nad-nasal-r85` | Nasal Spray · NAD+ 200mg/ml | Nasal Spray | NAD+ 200mg/ml | — | 15ml | one_time | 109 | `FVwkzvQqWIZRNAwbslGw` | `GEN_PAIRING_REQUIRED` | OFF | FUTURE_HIDDEN |

## Wolverine / BPC-TB

- **Family ID:** `wolverine-bpc-tb`
- **Category:** Recovery & Performance
- **Launch summary:** CURRENT_LIVE — one product, two dosage-form variants
- **Rule:** ONE website product. Selector: Delivery Method (Capsules|Injection). Separate price, formulation, GEN mapping per variant. Do not count as two patient-facing products.
- **Price display:** Starting at $29 (architecture capsule) / Injection $159

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `wolverine-capsule` | Capsule | Capsule | BPC-157/TB-500 Blend | — | 1EA | one_time | 29 | `omhh3NabouO8AsNR5tkD` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `wolverine-injection` | Injection | Injection | BPC-157/TB-500 Blend | — | 5ML | one_time | 159 | `iJtyig611AZEDBGdvRd9` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |

## Minoxidil

- **Family ID:** `minoxidil`
- **Category:** Prescription Skin & Hair
- **Launch summary:** CURRENT_LIVE locked Fin/Minox 0.1%/5%; other topicals FUTURE_HIDDEN
- **Rule:** ONE current website product (combination topical). Locked formulation Fin/Minox 0.1%/5% Vios $79.
- **Price display:** $79 (locked)

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `minoxidil-fin-minox-0.1-5` | Finasteride / Minoxidil 0.1% / 5% | Topical | Finasteride/Minoxidil 0.1%/5% | — | per ml foam basis | one_time | 79 | `BboYS4a2Uj7APetrFo6W` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `minoxidil-solution` | Plain Minoxidil Solution | Topical | Minoxidil 2% solution | — | — | one_time | 29 | `489YrehNXRlL77fYPkOn` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |
| `minoxidil-cream` | Minoxidil Cream | Topical | Minoxidil cream 7–15% | — | — | one_time | 89 | `489YrehNXRlL77fYPkOn` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |
| `fin-minox-tret` | Fin/Minox/Tretinoin | Topical | Finasteride/Minoxidil/Tretinoin topical | — | — | one_time | 89 | `EeWMcfCJf5EU2LkNQmp9` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |

## Estradiol

- **Family ID:** `estradiol`
- **Category:** Women's Hormone Therapy
- **Launch summary:** CURRENT_LIVE Patch; Tablet/Injection FUTURE_HIDDEN under same family
- **Rule:** ONE family. Selector: Delivery Method + Strength. Only expose delivery methods with verified routes.
- **Price display:** Starting at $119

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `estradiol-patch-r26` | Patch · 0.025mg/hr | Patch | Estradiol transdermal | — | — | one_time | 119 | `o7dNtf9QsnEqPCrLr2tR` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `estradiol-patch-r27` | Patch · 0.0375mg/hr | Patch | Estradiol transdermal | — | — | one_time | 129 | `o7dNtf9QsnEqPCrLr2tR` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `estradiol-patch-r28` | Patch · 0.05mg/hr | Patch | Estradiol transdermal | — | — | one_time | 139 | `o7dNtf9QsnEqPCrLr2tR` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `estradiol-patch-r29` | Patch · 0.1mg/hr | Patch | Estradiol transdermal | — | — | one_time | 149 | `o7dNtf9QsnEqPCrLr2tR` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `estradiol-tablet-r37` | Tablet · 0.5MG | Tablet | ESTRADIOL 0.5MG TABLET 0.5MG | — | — | one_time | 19 | `o7dNtf9QsnEqPCrLr2tR` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |
| `estradiol-tablet-r38` | Tablet · 1 MG | Tablet | ESTRADIOL 1 MG TABLET 1 MG | — | — | one_time | 19 | `o7dNtf9QsnEqPCrLr2tR` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |
| `estradiol-tablet-r39` | Tablet · 2 MG | Tablet | ESTRADIOL 2 MG TABLET 2 MG | — | — | one_time | 19 | `o7dNtf9QsnEqPCrLr2tR` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |
| `estradiol-injection-r40` | Injection · 10 MG/ML | Injection | ESTRADIOL CYPIONATE (MCT OIL) 10 MG/ML | — | 3ml mg/ml | one_time | 89 | `o7dNtf9QsnEqPCrLr2tR` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |

## Progesterone

- **Family ID:** `progesterone`
- **Category:** Women's Hormone Therapy
- **Launch summary:** CURRENT_LIVE IR capsules; SR FUTURE_HIDDEN
- **Rule:** ONE family. Selectors: Release type (IR|SR), Strength.
- **Price display:** Starting at $29

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `prog-ir-r41` | IR Capsule · 100mg | Capsule | Progesterone IR | — | 1 mg | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `prog-ir-r42` | IR Capsule · 200mg | Capsule | Progesterone IR | — | 1 mg | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `prog-ir-r43` | IR Capsule · 50mg | Capsule | Progesterone IR | — | 1 mg | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `prog-ir-r44` | IR Capsule · 100 MG | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `prog-ir-r45` | IR Capsule · 150 MG | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `prog-ir-r46` | IR Capsule · 200 MG | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `prog-ir-r47` | IR Capsule · 200MG | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `prog-ir-r48` | IR Capsule · 300 MG | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `prog-ir-r49` | IR Capsule · 400 MG | Capsule | Progesterone IR | — | 1 each | one_time | 29 | `5dGkjdpLP7DkKKE2iVxh` | `GEN_PAIRING_REQUIRED` | CURRENT_WEBSITE | CURRENT_LIVE |
| `prog-sr-r50` | SR Capsule · 100 MG | Capsule | Progesterone SR | — | — | one_time | 19 | `—` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |
| `prog-sr-r51` | SR Capsule · 125 MG | Capsule | Progesterone SR | — | — | one_time | 19 | `—` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |
| `prog-sr-r52` | SR Capsule · 150 MG | Capsule | Progesterone SR | — | — | one_time | 19 | `—` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |

## Tretinoin

- **Family ID:** `tretinoin`
- **Category:** Prescription Skin & Hair
- **Launch summary:** CURRENT_LIVE strengths pending formulary match
- **Rule:** ONE website product. Selector: Strength. Do not silent-substitute 0.15% or combo for 0.025/0.05/0.1%.
- **Price display:** Starting at $79

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `tretinoin-0.025%` | Cream · 0.025% · 20g | Cream | Tretinoin 0.025% | — | 20g | one_time | 79 | `—` | `FORMULARY_PENDING` | CURRENT_WEBSITE_STRENGTH_PENDING | CURRENT_LIVE |
| `tretinoin-0.05%` | Cream · 0.05% · 20g | Cream | Tretinoin 0.05% | — | 20g | one_time | 89 | `—` | `FORMULARY_PENDING` | CURRENT_WEBSITE_STRENGTH_PENDING | CURRENT_LIVE |
| `tretinoin-0.1%` | Cream · 0.1% · 20g | Cream | Tretinoin 0.1% | — | 20g | one_time | 109 | `—` | `FORMULARY_PENDING` | CURRENT_WEBSITE_STRENGTH_PENDING | CURRENT_LIVE |
| `tretinoin-selected-r126` | SELECTED · TRETINOIN 0.15% | Cream | TRETINOIN 0.15% | — | 30 grams | one_time | 79 | `EeWMcfCJf5EU2LkNQmp9` | `GEN_PAIRING_REQUIRED` | OFF_PENDING_OWNER_STRENGTH_DECISION | CUTOVER_PENDING_FORMULARY |
| `tretinoin-selected-r127` | SELECTED · HYALURONIC/NIACINAMIDE/TRETINOIN 0.5/4/0.025% | Cream | HYALURONIC/NIACINAMIDE/TRETINOIN 0.5/4/0 | — | 30 grams | one_time | 129 | `EeWMcfCJf5EU2LkNQmp9` | `GEN_PAIRING_REQUIRED` | OFF_PENDING_OWNER_STRENGTH_DECISION | CUTOVER_PENDING_FORMULARY |

## Fat Burner

- **Family ID:** `fat-burner`
- **Category:** Weight Management
- **Launch summary:** CURRENT_LIVE_FORMULARY_PENDING (+ future delivery forms where verified)
- **Rule:** ONE website product family. Do not force near matches. Keep on website this phase.
- **Price display:** $259

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `fat-burner-current` | Injection · current website | Injection | AOD-9604 + MOTS-c + Tesamorelin (no Ipam | — | 1.2/2/3 mg/mL · 5mL | one_time | 259 | `7Kix55LA15U0lNvY9QXI` | `FORMULARY_PENDING` | CURRENT_WEBSITE_FORMULARY_PENDING | CURRENT_LIVE |

## Testosterone

- **Family ID:** `testosterone`
- **Category:** Men's Hormone Therapy
- **Launch summary:** CURRENT_LIVE_FORMULARY_PENDING (+ future delivery forms where verified)
- **Rule:** ONE website product family. Do not force near matches. Keep on website this phase.
- **Price display:** $79

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `testosterone-current` | Cream · current website | Cream | Testosterone-only cream 5 mg/g | — | e.g. 30g TBD | one_time | 79 | `Gn4XaP00anr4q9oheSTe` | `FORMULARY_PENDING` | CURRENT_WEBSITE_FORMULARY_PENDING | CURRENT_LIVE |
| `testosterone-inj-r76` | Injection · TESTOSTERONE CYPIONATE (GRAPESEED OIL) 20 MG/ML (5 ML) | Injection | TESTOSTERONE CYPIONATE (GRAPESEED OIL) 2 | — | 5 mL | one_time | 59 | `Cm94vp3KgPz0yhqy01gX` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |
| `testosterone-inj-r77` | Injection · TESTOSTERONE CYPIONATE (GRAPESEED OIL) 50 MG/ML (5 ML) | Injection | TESTOSTERONE CYPIONATE (GRAPESEED OIL) 5 | — | 5 mL | one_time | 59 | `Cm94vp3KgPz0yhqy01gX` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |

## Selank

- **Family ID:** `selank`
- **Category:** Longevity & Cognitive
- **Launch summary:** CURRENT_LIVE_FORMULARY_PENDING (+ future delivery forms where verified)
- **Rule:** ONE website product family. Do not force near matches. Keep on website this phase.
- **Price display:** $129

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `selank-current` | Injection · current website | Injection | Selank injectable | — | 5 mg/mL · 2mL target | one_time | 129 | `Ukctbyh5Yrek3SnGSYA3` | `FORMULARY_PENDING` | CURRENT_WEBSITE_FORMULARY_PENDING | CURRENT_LIVE |
| `selank-nasal-r119` | Nasal Spray · verified SELECTED | Nasal Spray | Selank 2.5mg/mL Nasal Spray | — | 20ml | one_time | 129 | `Ukctbyh5Yrek3SnGSYA3` | `GEN_PAIRING_REQUIRED` | OFF | FUTURE_HIDDEN |

## Semax

- **Family ID:** `semax`
- **Category:** Longevity & Cognitive
- **Launch summary:** CURRENT_LIVE_FORMULARY_PENDING (+ future delivery forms where verified)
- **Rule:** ONE website product family. Do not force near matches. Keep on website this phase.
- **Price display:** $129

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `semax-current` | Injection · current website | Injection | Semax injectable | — | 5 mg/mL · 2mL target | one_time | 129 | `YTHcdrlRICMpt56hdxeJ` | `FORMULARY_PENDING` | CURRENT_WEBSITE_FORMULARY_PENDING | CURRENT_LIVE |
| `semax-nasal-r118` | Nasal Spray · verified SELECTED | Nasal Spray | Semax 2.5mg/mL Nasal Spray | — | 20ml | one_time | 129 | `YTHcdrlRICMpt56hdxeJ` | `GEN_PAIRING_REQUIRED` | OFF | FUTURE_HIDDEN |

## Selank + Semax Blend

- **Family ID:** `selank-semax-blend`
- **Category:** Longevity & Cognitive
- **Launch summary:** CURRENT_LIVE_FORMULARY_PENDING (+ future delivery forms where verified)
- **Rule:** ONE website product family. Do not force near matches. Keep on website this phase.
- **Price display:** $169

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `selank-semax-blend-current` | Nasal Spray · current website | Nasal Spray | Combined Selank+Semax nasal | — | 50mcg/50mcg · 10mL | one_time | 169 | `LWkYtwm66dIeLuDSvSfi` | `FORMULARY_PENDING` | CURRENT_WEBSITE_FORMULARY_PENDING | CURRENT_LIVE |

## Tesamorelin

- **Family ID:** `tesamorelin`
- **Category:** Longevity & Cognitive
- **Launch summary:** CURRENT_LIVE_FORMULARY_PENDING (+ future delivery forms where verified)
- **Rule:** ONE website product family. Do not force near matches. Keep on website this phase.
- **Price display:** $149

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `tesamorelin-current` | Injection · current website | Injection | Plain Tesamorelin | — | 10mg / 2mL · 5mg/mL | one_time | 149 | `2cYxVfvwpWyyrANZx06G` | `FORMULARY_PENDING` | CURRENT_WEBSITE_FORMULARY_PENDING | CURRENT_LIVE |

## Lash / Brow Growth Serum

- **Family ID:** `lash-brow`
- **Category:** Prescription Skin & Hair
- **Launch summary:** CURRENT_LIVE_FORMULARY_PENDING (+ future delivery forms where verified)
- **Rule:** ONE website product family. Do not force near matches. Keep on website this phase.
- **Price display:** $89

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `lash-brow-current` | Solution · current website | Solution | Bimatoprost 0.03% | — | 2.5mL | one_time | 89 | `—` | `FORMULARY_PENDING` | CURRENT_WEBSITE_FORMULARY_PENDING | CURRENT_LIVE |

## PT-141

- **Family ID:** `pt-141`
- **Category:** Sexual Wellness
- **Launch summary:** FUTURE_HIDDEN — ONE product with Injection + Nasal when launched
- **Rule:** ONE website product. Selector: Delivery Method. Do not expose delivery without verified route.
- **Price display:** Starting at $129

| Option ID | Label | Delivery | Formulation | Dose | Package | Purchase | Retail | GEN productId | Mapping | Checkout | Launch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `pt141-inj-r115` | Injection · PT-141 2mg/mL | Injection | PT-141 2mg/mL | — | 5ML | one_time | 129 | `7a11W067k20AKLSsL2xM` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |
| `pt141-nasal-r116` | Nasal Spray · BREMELANOTIDE (PT-141) (PER ML) 10 MG/ML | Nasal Spray | BREMELANOTIDE (PT-141) (PER ML) 10 MG/ML | — | 1 ml | one_time | 139 | `mSehcuPAbjD70fTWdckF` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |
| `pt141-nasal-r117` | Nasal Spray · BREMELANOTIDE (PT-141) (PER ML) 5MG/ML | Nasal Spray | BREMELANOTIDE (PT-141) (PER ML) 5MG/ML | — | 1 ml | one_time | 139 | `mSehcuPAbjD70fTWdckF` | `FUTURE_HIDDEN` | OFF | FUTURE_HIDDEN |

## Glutathione

- **Family ID:** `glutathione`
- **Category:** Longevity & Cognitive
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** from $59

_Summary:_ 2 variants — see JSON for full routing rows.

## GHK-Cu

- **Family ID:** `ghk-cu`
- **Category:** Prescription Skin & Hair
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** from $109

_Summary:_ 4 variants — see JSON for full routing rows.

## MOTS-c

- **Family ID:** `mots-c`
- **Category:** Longevity & Cognitive
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** from $129

_Summary:_ 1 variants — see JSON for full routing rows.

## Thymosin Alpha-1

- **Family ID:** `thymosin-a1`
- **Category:** Longevity & Cognitive
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** from $159

_Summary:_ 1 variants — see JSON for full routing rows.

## Dihexa

- **Family ID:** `dihexa`
- **Category:** Longevity & Cognitive
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** from $29

_Summary:_ 2 variants — see JSON for full routing rows.

## Methylene Blue

- **Family ID:** `methylene-blue`
- **Category:** Longevity & Cognitive
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** from $19

_Summary:_ 4 variants — see JSON for full routing rows.

## Custom HRT Cream

- **Family ID:** `hrt-custom-cream`
- **Category:** Women's Hormone Therapy
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** from $69

_Summary:_ 4 variants — see JSON for full routing rows.

## Custom Hormone Troche

- **Family ID:** `hrt-custom-troche`
- **Category:** Women's Hormone Therapy
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** from $29

_Summary:_ 4 variants — see JSON for full routing rows.

## Sildenafil / Testosterone Troche

- **Family ID:** `sildenafil-testosterone-troche`
- **Category:** Sexual Wellness
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** from $39

_Summary:_ 1 variants — see JSON for full routing rows.

## BPC Triple / Quad Blends

- **Family ID:** `bpc-advanced-blends`
- **Category:** Recovery & Performance
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** from $159

_Summary:_ 3 variants — see JSON for full routing rows.

## MOTS-c / Tesamorelin

- **Family ID:** `mots-tes`
- **Category:** Longevity & Cognitive
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** from $159

_Summary:_ 1 variants — see JSON for full routing rows.

## Oxytocin

- **Family ID:** `oxytocin`
- **Category:** Sexual Wellness
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** TBD

_Summary:_ 1 variants — see JSON for full routing rows.

## Sexual Wellness Compound

- **Family ID:** `sexual-wellness-compound`
- **Category:** Sexual Wellness
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** TBD

_Summary:_ 1 variants — see JSON for full routing rows.

## Scream Cream

- **Family ID:** `scream-cream`
- **Category:** Sexual Wellness
- **Launch summary:** FUTURE_HIDDEN
- **Rule:** ONE website family when launched; only expose verified selectors.
- **Price display:** TBD

_Summary:_ 1 variants — see JSON for full routing rows.

---

## FINAL REPORT

- **CURRENT WEBSITE PATIENT-FACING PRODUCT FAMILIES:** 15 (memberships fold into SEM/TIR; today's storefront still shows 17 cards including 2 memberships until redesign)
- **TOTAL WEBSITE PRODUCT FAMILIES AFTER CUTOVER (designed):** 30
- **TOTAL WEBSITE VARIANTS:** 103

- **ROUTING_READY:** 0
- **FORMULARY_PENDING:** 14
- **GEN_PRODUCT_CREATE_REQUIRED:** 8
- **GEN_PAIRING_REQUIRED:** 35
- **FUTURE_HIDDEN:** 43
- **BLOCKED:** 3

- **NAD+:** ONE WEBSITE PRODUCT: YES · INJECTION VARIANTS: 3 · NASAL VARIANTS: 4
- **SEMAGLUTIDE:** ONE WEBSITE PRODUCT: YES · ONE-TIME OPTIONS: 8 · MEMBERSHIP OPTION: 1
- **TIRZEPATIDE:** ONE WEBSITE PRODUCT: YES · ONE-TIME OPTIONS: 8 · MEMBERSHIP OPTION: 1
- **WOLVERINE:** ONE WEBSITE PRODUCT: YES · CAPSULE: YES · INJECTION: YES
- **PT-141:** ONE WEBSITE PRODUCT: YES · INJECTION: YES · NASAL: YES (FUTURE_HIDDEN)

- **PATIENT-FACING PRODUCT COUNT REDUCED BY VARIANT GROUPING:** YES
  - Memberships fold into Semaglutide and Tirzepatide families (2 fewer standalone membership cards vs current 17-card model when redesigned)
  - 16 SEM/TIR cutover dose-group architecture products become selectors under 2 families (not 16 cards)
  - NAD+ injection + nasal = 1 family
  - Wolverine capsule + injection = 1 family
  - PT-141 injection + nasal = 1 family when launched
  - Selank/Semax injection + future nasal = 1 family each

- **GEN MODIFIED:** NO
- **GEN WRITES:** 0
- **WEBSITE MODIFIED:** NO
- **GEN/WHOP CUTOVER:** OFF

---



### Routing completion gate (MBM-GEN-ROUTING-COMPLETION-GATE-1)

Updated routing + execution queues (read-only): `docs/MBM_WEBSITE_TO_GEN_ROUTING_MATRIX.md` · `docs/MBM_GEN_ROUTING_EXECUTION_QUEUE.md`

**STOP FOR OWNER REVIEW.**

Do not execute website changes yet. Do not execute GEN changes yet. Do not create new pairings yet. Do not start GEN-CATALOG-2B.
