# Scriptful Variant SKUs — My Bare Method

Generated from the authoritative live catalog (`src/data/products.ts` + `src/data/variantSkus.ts`).

**Production origin:** `https://mybaremethod.com`

Route pattern: `/product/:slug`

**Note:** Tesamorelin and Fat Burner are included for Scriptful/admin readiness with **Public Status = Pending Medical Director Review**. Their URLs are not publicly ready yet.

## Policy

1. Every active selectable retail variant/dosage has exactly one stable SKU.
2. Membership programs have a PROGRAM SKU (billing).
3. Membership fulfillment uses the existing retail weight-management medication SKU for the requested dose — **no duplicate membership-medication SKUs**.

## Totals

| Metric | Count |
|---|---|
| Retail / selectable variant SKUs | 50 |
| Membership PROGRAM SKUs | 2 |
| **Total unique SKUs** | **52** (expected 52) |

## Validation snapshot

- Duplicate retail SKUs: none
- Missing active variant SKUs: none
- Orphan registry SKUs (no active variant): none
- Invalid SKU format: none

## Membership PROGRAM ↔ FULFILLMENT crosswalk

| Program | Program SKU | Requested Dose | Fulfillment SKU | Retail Variant ID |
|---|---|---|---|---|
| Semaglutide Membership | `MBM-MEM-SEM-MEM-001` | 0.5mg | `MBM-WM-SEM-INJ-001` | `semaglutide-v1` |
| Semaglutide Membership | `MBM-MEM-SEM-MEM-001` | 1mg | `MBM-WM-SEM-INJ-002` | `semaglutide-v2` |
| Semaglutide Membership | `MBM-MEM-SEM-MEM-001` | 2.5mg | `MBM-WM-SEM-INJ-003` | `semaglutide-v3` |
| Semaglutide Membership | `MBM-MEM-SEM-MEM-001` | 5mg | `MBM-WM-SEM-INJ-004` | `semaglutide-v4` |
| Tirzepatide Membership | `MBM-MEM-TIR-MEM-001` | 2.5mg | `MBM-WM-TIR-INJ-001` | `tirzepatide-v1` |
| Tirzepatide Membership | `MBM-MEM-TIR-MEM-001` | 7.5mg | `MBM-WM-TIR-INJ-002` | `tirzepatide-v2` |
| Tirzepatide Membership | `MBM-MEM-TIR-MEM-001` | 12.5mg | `MBM-WM-TIR-INJ-003` | `tirzepatide-v3` |
| Tirzepatide Membership | `MBM-MEM-TIR-MEM-001` | 15mg | `MBM-WM-TIR-INJ-004` | `tirzepatide-v4` |

### Example

Semaglutide Membership

- Program SKU: `MBM-MEM-SEM-MEM-001`
- Requested Dose: `2.5mg`
- Fulfillment SKU: `MBM-WM-SEM-INJ-003`

## Retail variant SKUs

| Product | Variant / Dose | SKU | Parent ID | Variant ID | Category | Form | Strength | Size | URL | Public Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Semaglutide + B6 Injection | 0.5mg, Vial | `MBM-WM-SEM-INJ-001` | `p1` | `semaglutide-v1` | weight-management | Injection | 0.5mg | Vial | https://mybaremethod.com/product/semaglutide | Public |  |
| Semaglutide + B6 Injection | 1mg, Vial | `MBM-WM-SEM-INJ-002` | `p1` | `semaglutide-v2` | weight-management | Injection | 1mg | Vial | https://mybaremethod.com/product/semaglutide | Public |  |
| Semaglutide + B6 Injection | 2.5mg, Vial | `MBM-WM-SEM-INJ-003` | `p1` | `semaglutide-v3` | weight-management | Injection | 2.5mg | Vial | https://mybaremethod.com/product/semaglutide | Public |  |
| Semaglutide + B6 Injection | 5mg, Vial | `MBM-WM-SEM-INJ-004` | `p1` | `semaglutide-v4` | weight-management | Injection | 5mg | Vial | https://mybaremethod.com/product/semaglutide | Public |  |
| Tirzepatide + B6 Injection | 2.5mg, Vial | `MBM-WM-TIR-INJ-001` | `p5` | `tirzepatide-v1` | weight-management | Injection | 2.5mg | Vial | https://mybaremethod.com/product/tirzepatide | Public |  |
| Tirzepatide + B6 Injection | 7.5mg, Vial | `MBM-WM-TIR-INJ-002` | `p5` | `tirzepatide-v2` | weight-management | Injection | 7.5mg | Vial | https://mybaremethod.com/product/tirzepatide | Public |  |
| Tirzepatide + B6 Injection | 12.5mg, Vial | `MBM-WM-TIR-INJ-003` | `p5` | `tirzepatide-v3` | weight-management | Injection | 12.5mg | Vial | https://mybaremethod.com/product/tirzepatide | Public |  |
| Tirzepatide + B6 Injection | 15mg, Vial | `MBM-WM-TIR-INJ-004` | `p5` | `tirzepatide-v4` | weight-management | Injection | 15mg | Vial | https://mybaremethod.com/product/tirzepatide | Public |  |
| Fat Burner | AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL), 5mL vial | `MBM-WM-FB3-INJ-001` | `p74` | `fat-burner-v1` | weight-management | Injection | AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL) | 5mL vial | https://mybaremethod.com/product/fat-burner | Pending Medical Director Review | Public Status = Pending Medical Director Review. Admin/backend ready; URL not publicly ready. |
| Estradiol Patch | 0.025mg twice weekly, 8 patches | `MBM-HRT-EST-PAT-001` | `p16` | `estradiol-patch-v1` | womens-hormone-therapy | Patch | 0.025mg twice weekly | 8 patches | https://mybaremethod.com/product/estradiol-patch | Public |  |
| Estradiol Patch | 0.05mg twice weekly, 8 patches | `MBM-HRT-EST-PAT-002` | `p16` | `estradiol-patch-v2` | womens-hormone-therapy | Patch | 0.05mg twice weekly | 8 patches | https://mybaremethod.com/product/estradiol-patch | Public |  |
| Estradiol Patch | 0.1mg twice weekly, 8 patches | `MBM-HRT-EST-PAT-003` | `p16` | `estradiol-patch-v3` | womens-hormone-therapy | Patch | 0.1mg twice weekly | 8 patches | https://mybaremethod.com/product/estradiol-patch | Public |  |
| Progesterone Capsules | 100mg, 30 capsules | `MBM-HRT-PRG-CAP-001` | `p23` | `progesterone-capsules-v1` | womens-hormone-therapy | Capsule | 100mg | 30 capsules | https://mybaremethod.com/product/progesterone-capsules | Public |  |
| Progesterone Capsules | 200mg, 30 capsules | `MBM-HRT-PRG-CAP-002` | `p23` | `progesterone-capsules-v2` | womens-hormone-therapy | Capsule | 200mg | 30 capsules | https://mybaremethod.com/product/progesterone-capsules | Public |  |
| Testosterone Cream | 5mg/g, 30g | `MBM-HRT-TST-CRM-001` | `p27` | `testosterone-cream-v1` | womens-hormone-therapy | Cream | 5mg/g | 30g | https://mybaremethod.com/product/testosterone-cream | Public |  |
| NAD+ Injection | 100mg/mL · 500mg total, 5mL | `MBM-LON-NAD-INJ-001` | `p9` | `nad-plus-v1` | longevity-cognitive | Injection | 100mg/mL · 500mg total | 5mL | https://mybaremethod.com/product/nad-plus | Public |  |
| NAD+ Injection | 100mg/mL · 1,000mg total, 10mL | `MBM-LON-NAD-INJ-002` | `p9` | `nad-plus-v2` | longevity-cognitive | Injection | 100mg/mL · 1,000mg total | 10mL | https://mybaremethod.com/product/nad-plus | Public |  |
| Selank Injection | 5mg/mL, 2mL | `MBM-LON-SEL-INJ-001` | `p48` | `selank-v1` | longevity-cognitive | Injection | 5mg/mL | 2mL | https://mybaremethod.com/product/selank | Public |  |
| Semax Injection | 5mg/mL, 2mL | `MBM-LON-SMX-INJ-001` | `p47` | `semax-v1` | longevity-cognitive | Injection | 5mg/mL | 2mL | https://mybaremethod.com/product/semax | Public |  |
| Selank + Semax Blend Nasal Spray | 50mcg/50mcg per spray, 10mL | `MBM-LON-SSN-NS-001` | `p68` | `selank-semax-nasal-spray-v1` | longevity-cognitive | Nasal Spray | 50mcg/50mcg per spray | 10mL | https://mybaremethod.com/product/selank-semax-nasal-spray | Public |  |
| Tesamorelin Injection | 10mg total · 5mg/mL, 2mL vial | `MBM-LON-TESA-INJ-001` | `p73` | `tesamorelin-v1` | longevity-cognitive | Injection | 10mg total · 5mg/mL | 2mL vial | https://mybaremethod.com/product/tesamorelin | Pending Medical Director Review | Public Status = Pending Medical Director Review. Admin/backend ready; URL not publicly ready. |
| Wolverine: BPC-157/TB-500 | Capsule, Blend, Capsule | `MBM-RP-BPC-CAP-001` | `p41` | `bpc-157-tb-500-v1` | recovery-performance | Capsule | Blend | Capsule | https://mybaremethod.com/product/bpc-157-tb-500 | Public | Catalog strength is "Blend" — concentration not invented. |
| Wolverine: BPC-157/TB-500 | Injection, Blend, Injection | `MBM-RP-BPC-INJ-001` | `p41` | `bpc-157-tb-500-v2` | recovery-performance | Injection | Blend | Injection | https://mybaremethod.com/product/bpc-157-tb-500 | Public | Catalog strength is "Blend" — concentration not invented. |
| Tretinoin Cream | 0.025%, 20g | `MBM-SH-TRE-CRM-001` | `p69` | `tretinoin-cream-v1` | prescription-skin-hair | Cream | 0.025% | 20g | https://mybaremethod.com/product/tretinoin-cream | Public | Storefront-active; excluded from Stripe sync until reviewed. |
| Tretinoin Cream | 0.05%, 20g | `MBM-SH-TRE-CRM-002` | `p69` | `tretinoin-cream-v2` | prescription-skin-hair | Cream | 0.05% | 20g | https://mybaremethod.com/product/tretinoin-cream | Public | Storefront-active; excluded from Stripe sync until reviewed. |
| Tretinoin Cream | 0.1%, 20g | `MBM-SH-TRE-CRM-003` | `p69` | `tretinoin-cream-v3` | prescription-skin-hair | Cream | 0.1% | 20g | https://mybaremethod.com/product/tretinoin-cream | Public | Storefront-active; excluded from Stripe sync until reviewed. |
| Minoxidil Combination Topical Formula | Combination formula, Bottle | `MBM-SH-MIN-SOL-001` | `p70` | `minoxidil-topical-v1` | prescription-skin-hair | Topical Solution | Combination formula | Bottle | https://mybaremethod.com/product/minoxidil-topical | Public | Catalog strength is "Combination formula" — concentration not invented. |
| Bimatoprost Solution | 0.03%, 2.5mL | `MBM-SH-BIM-SOL-001` | `p71` | `bimatoprost-solution-v1` | prescription-skin-hair | Solution | 0.03% | 2.5mL | https://mybaremethod.com/product/bimatoprost-solution | Public | Storefront-active; excluded from Stripe sync until reviewed. |
| Initial Provider Visit | 1 session, Visit | `MBM-PC-IPV-SRV-001` | `pc1` | `initial-provider-consultation-v1` | provider-care | Service | 1 session | Visit | https://mybaremethod.com/product/initial-provider-consultation | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Follow-Up Visit | 1 session, Visit | `MBM-PC-FUV-SRV-001` | `pc2` | `follow-up-appointment-v1` | provider-care | Service | 1 session | Visit | https://mybaremethod.com/product/follow-up-appointment | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Laboratory Review | 1 session, Visit | `MBM-PC-LAB-SRV-001` | `pc3` | `laboratory-review-v1` | provider-care | Service | 1 session | Visit | https://mybaremethod.com/product/laboratory-review | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Complete Injection Starter Kit | Bundle, 1 kit | `MBM-ACC-CIS-ACC-001` | `a1` | `complete-injection-starter-kit-v1` | accessories | Accessory | Bundle | 1 kit | https://mybaremethod.com/product/complete-injection-starter-kit | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Premium 3D Printed Peptide Case | Standard, 1 case | `MBM-ACC-PPC-ACC-001` | `a2` | `premium-3d-printed-peptide-case-v1` | accessories | Accessory | Standard | 1 case | https://mybaremethod.com/product/premium-3d-printed-peptide-case | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Temperature-Controlled Travel Case | Standard, 1 case | `MBM-ACC-TTC-ACC-001` | `a3` | `temperature-controlled-travel-case-v1` | accessories | Accessory | Standard | 1 case | https://mybaremethod.com/product/temperature-controlled-travel-case | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Discreet Travel Bag | Standard, 1 bag | `MBM-ACC-DTB-ACC-001` | `a4` | `discreet-travel-bag-v1` | accessories | Accessory | Standard | 1 bag | https://mybaremethod.com/product/discreet-travel-bag | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Reusable Ice Pack | Standard, 1 pack | `MBM-ACC-ICE-ACC-001` | `a5` | `reusable-ice-pack-v1` | accessories | Accessory | Standard | 1 pack | https://mybaremethod.com/product/reusable-ice-pack | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Daily & Weekly Wellness Planner | Standard, 1 planner | `MBM-ACC-DWP-ACC-001` | `a6` | `daily-weekly-wellness-planner-v1` | accessories | Accessory | Standard | 1 planner | https://mybaremethod.com/product/daily-weekly-wellness-planner | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Sharps Container | Standard, 1 container | `MBM-ACC-SHP-ACC-001` | `a7` | `sharps-container-v1` | accessories | Accessory | Standard | 1 container | https://mybaremethod.com/product/sharps-container | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Alcohol Prep Wipes | 200 Count, 1 box | `MBM-ACC-APW-ACC-001` | `a8` | `alcohol-prep-wipes-v1` | accessories | Accessory | 200 Count | 1 box | https://mybaremethod.com/product/alcohol-prep-wipes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Alcohol Prep Wipes | 500 Count, 1 box | `MBM-ACC-APW-ACC-002` | `a8` | `alcohol-prep-wipes-v2` | accessories | Accessory | 500 Count | 1 box | https://mybaremethod.com/product/alcohol-prep-wipes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Premium Insulin Syringes | 10 Pack, 1 pack | `MBM-ACC-PIS-ACC-001` | `a10` | `premium-insulin-syringes-v1` | accessories | Accessory | 10 Pack | 1 pack | https://mybaremethod.com/product/premium-insulin-syringes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Premium Insulin Syringes | 20 Pack, 1 pack | `MBM-ACC-PIS-ACC-002` | `a10` | `premium-insulin-syringes-v2` | accessories | Accessory | 20 Pack | 1 pack | https://mybaremethod.com/product/premium-insulin-syringes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Premium Insulin Syringes | 30 Pack, 1 pack | `MBM-ACC-PIS-ACC-003` | `a10` | `premium-insulin-syringes-v3` | accessories | Accessory | 30 Pack | 1 pack | https://mybaremethod.com/product/premium-insulin-syringes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Premium Insulin Syringes | 40 Pack, 1 pack | `MBM-ACC-PIS-ACC-004` | `a10` | `premium-insulin-syringes-v4` | accessories | Accessory | 40 Pack | 1 pack | https://mybaremethod.com/product/premium-insulin-syringes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Premium Insulin Syringes | 50 Pack, 1 pack | `MBM-ACC-PIS-ACC-005` | `a10` | `premium-insulin-syringes-v5` | accessories | Accessory | 50 Pack | 1 pack | https://mybaremethod.com/product/premium-insulin-syringes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Premium Insulin Syringes | 60 Pack, 1 pack | `MBM-ACC-PIS-ACC-006` | `a10` | `premium-insulin-syringes-v6` | accessories | Accessory | 60 Pack | 1 pack | https://mybaremethod.com/product/premium-insulin-syringes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Premium Insulin Syringes | 70 Pack, 1 pack | `MBM-ACC-PIS-ACC-007` | `a10` | `premium-insulin-syringes-v7` | accessories | Accessory | 70 Pack | 1 pack | https://mybaremethod.com/product/premium-insulin-syringes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Premium Insulin Syringes | 80 Pack, 1 pack | `MBM-ACC-PIS-ACC-008` | `a10` | `premium-insulin-syringes-v8` | accessories | Accessory | 80 Pack | 1 pack | https://mybaremethod.com/product/premium-insulin-syringes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Premium Insulin Syringes | 90 Pack, 1 pack | `MBM-ACC-PIS-ACC-009` | `a10` | `premium-insulin-syringes-v9` | accessories | Accessory | 90 Pack | 1 pack | https://mybaremethod.com/product/premium-insulin-syringes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |
| Premium Insulin Syringes | 100 Pack, 1 pack | `MBM-ACC-PIS-ACC-010` | `a10` | `premium-insulin-syringes-v10` | accessories | Accessory | 100 Pack | 1 pack | https://mybaremethod.com/product/premium-insulin-syringes | Public | Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog. |

## Membership program SKUs

| Product | SKU (Program) | Parent ID | URL | Notes |
|---|---|---|---|---|
| Semaglutide Membership | `MBM-MEM-SEM-MEM-001` | `m1` | https://mybaremethod.com/product/semaglutide-membership | PROGRAM SKU; fulfillment via retail WM SKUs |
| Tirzepatide Membership | `MBM-MEM-TIR-MEM-001` | `m2` | https://mybaremethod.com/product/tirzepatide-membership | PROGRAM SKU; fulfillment via retail WM SKUs |

## CSV

Machine-readable export: [`scriptful-variant-skus.csv`](./scriptful-variant-skus.csv)

CSV includes membership dose rows with both Program SKU and Fulfillment SKU columns populated, plus Public Status.

## Exclusions

- Inactive Tirzepatide 30mg — excluded
- Inactive Bare Elite Wellness — excluded
- Future products (Sermorelin, Minoxidil Tablets) — no SKU assigned
- Tesamorelin / Fat Burner — included with SKUs but Public Status = Pending Medical Director Review (not publicly ready)
