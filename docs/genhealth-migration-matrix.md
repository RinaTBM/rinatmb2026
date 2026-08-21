# GEN Health Migration Matrix — Phase 12B

**Baseline branch:** `deploy/ach-launch-clean-2026`
**Baseline SHA:** `5473777fa21c54f084ca86b330ea03f93c7152eb`
**Generated:** 2026-08-21T06:08:05.175Z
**Scope:** Design + local artifacts only. No Tagada / live DB / production / Edge / GEN API changes.

## Principles

- DO NOT UPDATE-IN-PLACE any existing SKU or historical Tagada mapping
- OLD SKU → DEPRECATE → NEW SKU → NEW GEN mapping → NEW Tagada mapping
- GEN product/pairing IDs are external references — MBM SKU remains commerce identity
- Never use Tagada priceId as a clinical identifier
- Do not invent GEN IDs
- Accessories excluded from GEN medication mapping

## Canonical mapping model (fields)

```
mbm_product_id
mbm_variant_id
mbm_sku
therapy_family
gen_product_id
gen_product_name
gen_medication_pairing_id
gen_medication_name
gen_pharmacy
gen_strength
gen_form
gen_package
gen_medication_cost_cents
gen_shipping_cost_cents
gen_total_cost_cents
match_type
match_confidence
mapping_status
preferred_pairing
alternate_pairing
active
source_checked_at
```

GEN fields remain `null` / **TBD — GEN ID REQUIRED** until real GEN IDs and costs are supplied. Do not invent IDs.

### Price analysis fields (when costs exist)

| Field | Rule |
|---|---|
| gen_medication_cost_cents | From GEN / pharmacy |
| gen_shipping_cost_cents | From GEN / pharmacy |
| gen_total_cost_cents | med + shipping |
| retail_plus_50_cents | total_cost × 1.50 |
| retail_plus_75_cents | total_cost × 1.75 |
| retail_plus_100_cents | total_cost × 2.00 |
| current_gross_over_cost_cents | current_retail − total_cost |

These are **markups on cost**, not automatic price changes.

---

## 1. Current medication catalog inventory

Sellable Rx medication SKUs: **28**
Provider care (separate): **4**
Accessories excluded from GEN med map: **19**
Hidden/future med rows: **2**

| Product ID | Slug | Name | Category | Variant ID | Form | Strength | Package | Retail | SKU | Visible | Member eligible | Auto-Refill | Membership fulfillment? | Tagada variantId | Tagada priceId |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| p1 | semaglutide | Semaglutide + B6 Injection | weight-management | semaglutide-v1 | Injection | 0.5mg | Vial | $119.00 | `MBM-WM-SEM-INJ-001` | true | false | true | Yes (vial for program) | `variant_4786fced127f` | `price_59b410d4149c` |
| p1 | semaglutide | Semaglutide + B6 Injection | weight-management | semaglutide-v2 | Injection | 1mg | Vial | $139.00 | `MBM-WM-SEM-INJ-002` | true | false | true | Yes (vial for program) | `variant_e7e4aa7479b0` | `price_45e11dcc8f3d` |
| p1 | semaglutide | Semaglutide + B6 Injection | weight-management | semaglutide-v3 | Injection | 2.5mg | Vial | $189.02 | `MBM-WM-SEM-INJ-003` | true | false | true | Yes (vial for program) | `variant_1578824794e6` | `price_a6e38799524f` |
| p1 | semaglutide | Semaglutide + B6 Injection | weight-management | semaglutide-v4 | Injection | 5mg | Vial | $329.00 | `MBM-WM-SEM-INJ-004` | true | false | true | Yes (vial for program) | `variant_0858c18b808e` | `price_dbc846be2af8` |
| p5 | tirzepatide | Tirzepatide + B6 Injection | weight-management | tirzepatide-v1 | Injection | 2.5mg | Vial | $189.00 | `MBM-WM-TIR-INJ-001` | true | false | true | Yes (vial for program) | `variant_8ed93e38d4bb` | `price_a638edd7e278` |
| p5 | tirzepatide | Tirzepatide + B6 Injection | weight-management | tirzepatide-v2 | Injection | 7.5mg | Vial | $258.99 | `MBM-WM-TIR-INJ-002` | true | false | true | Yes (vial for program) | `variant_65197b99b7c1` | `price_025ae1e10e81` |
| p5 | tirzepatide | Tirzepatide + B6 Injection | weight-management | tirzepatide-v3 | Injection | 12.5mg | Vial | $369.00 | `MBM-WM-TIR-INJ-003` | true | false | true | Yes (vial for program) | `variant_c36104e1b53c` | `price_3c12d8bb293b` |
| p5 | tirzepatide | Tirzepatide + B6 Injection | weight-management | tirzepatide-v4 | Injection | 15mg | Vial | $429.00 | `MBM-WM-TIR-INJ-004` | true | false | true | Yes (vial for program) | `variant_89f15bb9ad30` | `price_8a73862931ca` |
| p74 | fat-burner | Fat Burner | weight-management | fat-burner-v1 | Injection | AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL) | 5mL vial | $259.00 | `MBM-WM-FB3-INJ-001` | true | true | true | No | `variant_2c53926ab625` | `price_197259afe856` |
| p16 | estradiol-patch | Estradiol Patch | womens-hormone-therapy | estradiol-patch-v1 | Patch | 0.025mg twice weekly | 8 patches | $129.00 | `MBM-HRT-EST-PAT-001` | true | true | true | No | `variant_77a5809b96cc` | `price_bb2cd434d6cb` |
| p16 | estradiol-patch | Estradiol Patch | womens-hormone-therapy | estradiol-patch-v2 | Patch | 0.05mg twice weekly | 8 patches | $138.98 | `MBM-HRT-EST-PAT-002` | true | true | true | No | `variant_96a619fecc8b` | `price_bc07cb8899a4` |
| p16 | estradiol-patch | Estradiol Patch | womens-hormone-therapy | estradiol-patch-v3 | Patch | 0.1mg twice weekly | 8 patches | $149.00 | `MBM-HRT-EST-PAT-003` | true | true | true | No | `variant_48a704f13621` | `price_22d08b77e3ac` |
| p23 | progesterone-capsules | Progesterone Capsules | womens-hormone-therapy | progesterone-capsules-v1 | Capsule | 100mg | 30 capsules | $39.00 | `MBM-HRT-PRG-CAP-001` | true | true | true | No | `variant_e37d0c490dba` | `price_a99f863c0fe1` |
| p23 | progesterone-capsules | Progesterone Capsules | womens-hormone-therapy | progesterone-capsules-v2 | Capsule | 200mg | 30 capsules | $59.00 | `MBM-HRT-PRG-CAP-002` | true | true | true | No | `variant_bdbc2b9f0ade` | `price_2e5104ff73e0` |
| p27 | testosterone-cream | Testosterone Cream | womens-hormone-therapy | testosterone-cream-v1 | Cream | 5mg/g | 30g | $79.00 | `MBM-HRT-TST-CRM-001` | true | true | true | No | `variant_39c27962b958` | `price_14296712e379` |
| p9 | nad-plus | NAD+ Injection | longevity-cognitive | nad-plus-v1 | Injection | 100mg/mL · 500mg total | 5mL | $199.00 | `MBM-LON-NAD-INJ-001` | true | true | true | No | `variant_d2b5be492da2` | `price_f7e899c11336` |
| p9 | nad-plus | NAD+ Injection | longevity-cognitive | nad-plus-v2 | Injection | 100mg/mL · 1,000mg total | 10mL | $229.00 | `MBM-LON-NAD-INJ-002` | true | true | true | No | `variant_5085e02375d1` | `price_94fd558220c1` |
| p48 | selank | Selank Injection | longevity-cognitive | selank-v1 | Injection | 5mg/mL | 2mL | $129.00 | `MBM-LON-SEL-INJ-001` | true | true | true | No | `variant_35f9129e2cae` | `price_0519a38f67b0` |
| p47 | semax | Semax Injection | longevity-cognitive | semax-v1 | Injection | 5mg/mL | 2mL | $129.00 | `MBM-LON-SMX-INJ-001` | true | true | true | No | `variant_8f66246f1d44` | `price_6aca1278605b` |
| p68 | selank-semax-nasal-spray | Selank + Semax Blend Nasal Spray | longevity-cognitive | selank-semax-nasal-spray-v1 | Nasal Spray | 50mcg/50mcg per spray | 10mL | $169.00 | `MBM-LON-SSN-NS-001` | true | true | true | No | `variant_7fa5cf5aab9c` | `price_12025a97b268` |
| p73 | tesamorelin | Tesamorelin Injection | longevity-cognitive | tesamorelin-v1 | Injection | 10mg total · 5mg/mL | 2mL vial | $149.00 | `MBM-LON-TESA-INJ-001` | true | true | true | No | `variant_2471d74b381b` | `price_9e528d04b5f4` |
| p41 | bpc-157-tb-500 | Wolverine: BPC-157/TB-500 | recovery-performance | bpc-157-tb-500-v1 | Capsule | Blend | Capsule | $99.00 | `MBM-RP-BPC-CAP-001` | true | true | true | No | `variant_5d38654f00fc` | `price_548c95f3d3bd` |
| p41 | bpc-157-tb-500 | Wolverine: BPC-157/TB-500 | recovery-performance | bpc-157-tb-500-v2 | Injection | Blend | Injection | $199.00 | `MBM-RP-BPC-INJ-001` | true | true | true | No | `variant_28a362285cd1` | `price_468c0be65863` |
| p69 | tretinoin-cream | Tretinoin Cream | prescription-skin-hair | tretinoin-cream-v1 | Cream | 0.025% | 20g | $79.00 | `MBM-SH-TRE-CRM-001` | true | true | true | No | `variant_708bb1c9f5f0` | `price_c7871c25c2eb` |
| p69 | tretinoin-cream | Tretinoin Cream | prescription-skin-hair | tretinoin-cream-v2 | Cream | 0.05% | 20g | $89.00 | `MBM-SH-TRE-CRM-002` | true | true | true | No | `variant_1988ad508047` | `price_8312c58ec718` |
| p69 | tretinoin-cream | Tretinoin Cream | prescription-skin-hair | tretinoin-cream-v3 | Cream | 0.1% | 20g | $109.00 | `MBM-SH-TRE-CRM-003` | true | true | true | No | `variant_8f7950e121d1` | `price_26636d01db04` |
| p70 | minoxidil-topical | Minoxidil Combination Topical Formula | prescription-skin-hair | minoxidil-topical-v1 | Topical Solution | Combination formula | Bottle | $129.00 | `MBM-SH-MIN-SOL-001` | true | true | true | No | `variant_f9e5928143c7` | `price_98520d872070` |
| p71 | bimatoprost-solution | Lash/Brow Growth Serum | prescription-skin-hair | bimatoprost-solution-v1 | Solution | 0.03% | 2.5mL | $89.00 | `MBM-SH-BIM-SOL-001` | true | true | true | No | `variant_321ade2267a1` | `price_338fe6049a04` |

### Hidden / future medication rows (not sellable)

| Name | Slug | Status | Visible | Action |
|---|---|---|---|---|
| Sermorelin | sermorelin | future | false | DEPRECATE |
| Minoxidil Tablets | minoxidil-tablets | future | false | DEPRECATE |

---

## 2. Current SKU classification

| SKU | Action | Reason |
|---|---|---|
| `MBM-WM-SEM-INJ-001` | **REQUIRES MANUAL REVIEW** | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-SEM-INJ-002` | **REQUIRES MANUAL REVIEW** | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-SEM-INJ-003` | **REQUIRES MANUAL REVIEW** | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-SEM-INJ-004` | **REQUIRES MANUAL REVIEW** | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-TIR-INJ-001` | **REQUIRES MANUAL REVIEW** | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-TIR-INJ-002` | **REQUIRES MANUAL REVIEW** | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-TIR-INJ-003` | **REQUIRES MANUAL REVIEW** | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-TIR-INJ-004` | **REQUIRES MANUAL REVIEW** | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-FB3-INJ-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-EST-PAT-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-EST-PAT-002` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-EST-PAT-003` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-PRG-CAP-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-PRG-CAP-002` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-TST-CRM-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-NAD-INJ-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-NAD-INJ-002` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-SEL-INJ-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-SMX-INJ-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-SSN-NS-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-TESA-INJ-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-RP-BPC-CAP-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-RP-BPC-INJ-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-SH-TRE-CRM-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-SH-TRE-CRM-002` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-SH-TRE-CRM-003` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-SH-MIN-SOL-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-SH-BIM-SOL-001` | **REQUIRES MANUAL REVIEW** | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |

**Classification policy (Phase 12B):** Without a supplied GEN Health / Scriptful formulary export, no medication is marked KEEP AS-IS or REPLACE WITH NEW SKU by guesswork. All sellable Rx SKUs are **REQUIRES MANUAL REVIEW**. Formulation-sensitive SEM/TIRZ (+B6) are explicitly flagged.

---

## 3. GEN Health canonical mapping model

Target chain:

```
MyBareMethod Product → Variant → MBM SKU
  → GEN Provider-Network Product → Medication Pairing → Pharmacy
  → Medication / formulation → Strength → Form → Package
  → Pharmacy med cost + shipping cost → MBM retail
  → Tagada variantId / priceId (commerce only)
  → GEN product/order identifiers (clinical/ops external refs)
```

See JSON artifact `docs/genhealth-migration-matrix.json` for full schema, transition states, and empty GEN fields.

---

## 4. Semaglutide migration

Current public product: **Semaglutide + B6 Injection** (`p1` / `semaglutide`).

| SKU | Strength | Retail | Tagada variant | Tagada price | Membership fulfillment | Action |
|---|---|---|---|---|---|---|
| `MBM-WM-SEM-INJ-001` | 0.5mg | $119.00 | `variant_4786fced127f` | `price_59b410d4149c` | Program `MBM-MEM-SEM-MEM-001` | REQUIRES MANUAL REVIEW |
| `MBM-WM-SEM-INJ-002` | 1mg | $139.00 | `variant_e7e4aa7479b0` | `price_45e11dcc8f3d` | Program `MBM-MEM-SEM-MEM-001` | REQUIRES MANUAL REVIEW |
| `MBM-WM-SEM-INJ-003` | 2.5mg | $189.02 | `variant_1578824794e6` | `price_a6e38799524f` | Program `MBM-MEM-SEM-MEM-001` | REQUIRES MANUAL REVIEW |
| `MBM-WM-SEM-INJ-004` | 5mg | $329.00 | `variant_0858c18b808e` | `price_dbc846be2af8` | Program `MBM-MEM-SEM-MEM-001` | REQUIRES MANUAL REVIEW |

### Formulation change rule

- Current MBM identity includes **vitamin B6**.
- If GEN pairing is plain semaglutide, semaglutide+B12, semaglutide+glycine, or any other compound: **REPLACE WITH NEW SKU** (do not reuse `MBM-WM-SEM-INJ-001…004`).
- Do **not** silently rename +B6 → +B12/glycine/other.
- GEN IDs / pharmacy / costs: **TBD — GEN ID REQUIRED**.
- Proposed new SKUs: **none yet** (await GEN formulary).

---

## 5. Tirzepatide migration

Current public product: **Tirzepatide + B6 Injection** (`p5` / `tirzepatide`). Included through **15mg** (30mg excluded).

| SKU | Strength | Retail | Tagada variant | Tagada price | Membership fulfillment | Action |
|---|---|---|---|---|---|---|
| `MBM-WM-TIR-INJ-001` | 2.5mg | $189.00 | `variant_8ed93e38d4bb` | `price_a638edd7e278` | Program `MBM-MEM-TIR-MEM-001` | REQUIRES MANUAL REVIEW |
| `MBM-WM-TIR-INJ-002` | 7.5mg | $258.99 | `variant_65197b99b7c1` | `price_025ae1e10e81` | Program `MBM-MEM-TIR-MEM-001` | REQUIRES MANUAL REVIEW |
| `MBM-WM-TIR-INJ-003` | 12.5mg | $369.00 | `variant_c36104e1b53c` | `price_3c12d8bb293b` | Program `MBM-MEM-TIR-MEM-001` | REQUIRES MANUAL REVIEW |
| `MBM-WM-TIR-INJ-004` | 15mg | $429.00 | `variant_89f15bb9ad30` | `price_8a73862931ca` | Program `MBM-MEM-TIR-MEM-001` | REQUIRES MANUAL REVIEW |

Same +B6 formulation rule as Semaglutide. GEN match: **TBD — GEN ID REQUIRED**.

---

## 6. Other medication migration

| SKU | Product | Strength/Form | Retail | Action | GEN match |
|---|---|---|---|---|---|
| `MBM-WM-FB3-INJ-001` | Fat Burner | AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL) / Injection | $259.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-HRT-EST-PAT-001` | Estradiol Patch | 0.025mg twice weekly / Patch | $129.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-HRT-EST-PAT-002` | Estradiol Patch | 0.05mg twice weekly / Patch | $138.98 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-HRT-EST-PAT-003` | Estradiol Patch | 0.1mg twice weekly / Patch | $149.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-HRT-PRG-CAP-001` | Progesterone Capsules | 100mg / Capsule | $39.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-HRT-PRG-CAP-002` | Progesterone Capsules | 200mg / Capsule | $59.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-HRT-TST-CRM-001` | Testosterone Cream | 5mg/g / Cream | $79.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-LON-NAD-INJ-001` | NAD+ Injection | 100mg/mL · 500mg total / Injection | $199.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-LON-NAD-INJ-002` | NAD+ Injection | 100mg/mL · 1,000mg total / Injection | $229.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-LON-SEL-INJ-001` | Selank Injection | 5mg/mL / Injection | $129.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-LON-SMX-INJ-001` | Semax Injection | 5mg/mL / Injection | $129.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-LON-SSN-NS-001` | Selank + Semax Blend Nasal Spray | 50mcg/50mcg per spray / Nasal Spray | $169.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-LON-TESA-INJ-001` | Tesamorelin Injection | 10mg total · 5mg/mL / Injection | $149.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-RP-BPC-CAP-001` | Wolverine: BPC-157/TB-500 | Blend / Capsule | $99.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-RP-BPC-INJ-001` | Wolverine: BPC-157/TB-500 | Blend / Injection | $199.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-SH-TRE-CRM-001` | Tretinoin Cream | 0.025% / Cream | $79.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-SH-TRE-CRM-002` | Tretinoin Cream | 0.05% / Cream | $89.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-SH-TRE-CRM-003` | Tretinoin Cream | 0.1% / Cream | $109.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-SH-MIN-SOL-001` | Minoxidil Combination Topical Formula | Combination formula / Topical Solution | $129.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |
| `MBM-SH-BIM-SOL-001` | Lash/Brow Growth Serum | 0.03% / Solution | $89.00 | REQUIRES MANUAL REVIEW | TBD — GEN ID REQUIRED |

Notable formulation notes (MBM-side, pending GEN compare):
- **Fat Burner** (`MBM-WM-FB3-INJ-001`): AOD-9604 / MOTS-C / Tesamorelin blend — compound match must be exact.
- **Wolverine BPC/TB**: capsule vs injection are separate SKUs.
- **Minoxidil topical** vs hidden oral tablets: oral remains DEPRECATE/hidden.

---

## 7. Membership economics

### Semaglutide Membership (`MBM-MEM-SEM-MEM-001`)

- Base retail: **$149.00**/month
- Base Tagada priceId: `price_344d3dacb4ab`
- Tagada variantId: `variant_6973906c4bd6`
- Combo recurring (membership + shipping):

| Shipping | Ship ¢ | Monthly | Tagada combo priceId |
|---|---|---|---|
| two_day | 3000 | $179.00 | `price_41179f7cafe2` |
| next_day | 5000 | $199.00 | `price_7ce0f74a7509` |

Fulfillment vial SKUs (from `membershipSkuCrosswalk.ts`):

| Requested dose | Fulfillment SKU | Variant |
|---|---|---|
| 0.5mg | `MBM-WM-SEM-INJ-001` | semaglutide-v1 |
| 1mg | `MBM-WM-SEM-INJ-002` | semaglutide-v2 |
| 2.5mg | `MBM-WM-SEM-INJ-003` | semaglutide-v3 |
| 5mg | `MBM-WM-SEM-INJ-004` | semaglutide-v4 |

- Financial safety under GEN costs: **UNKNOWN — GEN pharmacy medication + shipping costs not supplied**
- New recurring Tagada priceIds likely required: **CONDITIONAL — likely if GEN unit costs exceed current gross room OR if fulfillment SKUs change formulation (e.g. leave +B6). Do not create Tagada prices in Phase 12B.**

### Tirzepatide Membership (`MBM-MEM-TIR-MEM-001`)

- Base retail: **$249.00**/month
- Base Tagada priceId: `price_5cf1fa89610c`
- Tagada variantId: `variant_b3890c799e09`
- Combo recurring (membership + shipping):

| Shipping | Ship ¢ | Monthly | Tagada combo priceId |
|---|---|---|---|
| two_day | 3000 | $279.00 | `price_e0ebef9851a8` |
| next_day | 5000 | $299.00 | `price_ef9ea132d6cf` |

Fulfillment vial SKUs (from `membershipSkuCrosswalk.ts`):

| Requested dose | Fulfillment SKU | Variant |
|---|---|---|
| 2.5mg | `MBM-WM-TIR-INJ-001` | tirzepatide-v1 |
| 7.5mg | `MBM-WM-TIR-INJ-002` | tirzepatide-v2 |
| 12.5mg | `MBM-WM-TIR-INJ-003` | tirzepatide-v3 |
| 15mg | `MBM-WM-TIR-INJ-004` | tirzepatide-v4 |

- Financial safety under GEN costs: **UNKNOWN — GEN pharmacy medication + shipping costs not supplied**
- New recurring Tagada priceIds likely required: **CONDITIONAL — likely if GEN unit costs exceed current gross room OR if fulfillment SKUs change formulation (e.g. leave +B6). Do not create Tagada prices in Phase 12B.**

**Do not modify Tagada in Phase 12B.**

### Rebill policy (unchanged)

Phase 12A confirmed `subscription/rebillSucceeded` does **not** create medication orders. Phase 12B does not change that.

Future GEN participation options (choose later with API evidence):

1. **rebill payment only + manual/clinical refill** ← aligns with today
1. **rebill triggers GEN refill workflow** (requires GEN API evidence)
1. **GEN handles refill payment separately** (requires GEN billing evidence)

---

## 8. Provider visits / labs

| SKU | Name | Retail | Remain MBM commerce SKU? | Later GEN entity | Pricing | Injection logic |
|---|---|---|---|---|---|---|
| `MBM-PC-IPV-SRV-001` | Initial Provider Visit | $75.00 | true | GEN Visit — TBD — GEN ID REQUIRED | UNCHANGED until GEN visit/lab economics supplied | PRESERVE current injectProviderVisit / hrtLabPackage logic — do not modify in Phase 12B |
| `MBM-PC-FUV-SRV-001` | Follow-Up Visit | $55.00 | true | GEN Visit — TBD — GEN ID REQUIRED | UNCHANGED until GEN visit/lab economics supplied | PRESERVE current injectProviderVisit / hrtLabPackage logic — do not modify in Phase 12B |
| `MBM-PC-LAB-SRV-001` | Laboratory Review | $60.00 | true | GEN Lab Review / clinical service — TBD — GEN ID REQUIRED | UNCHANGED until GEN visit/lab economics supplied | PRESERVE current injectProviderVisit / hrtLabPackage logic — do not modify in Phase 12B |
| `MBM-PC-LAB-KIT-001` | Lab Kit | $200.00 | true | GEN Lab Kit / specimen — TBD — GEN ID REQUIRED | UNCHANGED until GEN visit/lab economics supplied | PRESERVE current injectProviderVisit / hrtLabPackage logic — do not modify in Phase 12B |

---

## 9. Future GEN external ID model (design only)

DESIGN ONLY — no live DB migration in Phase 12B

| Target | Additive fields (proposed) |
|---|---|
| orders | gen_order_id, gen_patient_id |
| order_items | gen_product_id, gen_medication_pairing_id, gen_prescription_id, gen_pharmacy_id |
| customer_profiles or customer_therapy_history | gen_patient_id |
| proposed table gen_sku_map | mbm_sku, gen_product_id, gen_medication_pairing_id, gen_pharmacy, gen_medication_cost_cents, gen_shipping_cost_cents, mapping_status, replaces_mbm_sku, active, source_checked_at |

No live migration applied.

---

## 10. Migration matrix

| CURRENT SKU | PRODUCT | VARIANT | PRICE | TAGADA VARIANT | TAGADA PRICE | ACTION | NEW SKU | GEN PRODUCT | GEN MED | PHARMACY | STRENGTH | FORM | PACKAGE | MED COST | SHIP | TOTAL | +50% | +75% | +100% | REC. RETAIL | GEN MATCH | NOTES |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `MBM-WM-SEM-INJ-001` | Semaglutide + B6 Injection | semaglutide-v1 | $119.00 | `variant_4786fced127f` | `price_59b410d4149c` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-SEM-INJ-002` | Semaglutide + B6 Injection | semaglutide-v2 | $139.00 | `variant_e7e4aa7479b0` | `price_45e11dcc8f3d` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-SEM-INJ-003` | Semaglutide + B6 Injection | semaglutide-v3 | $189.02 | `variant_1578824794e6` | `price_a6e38799524f` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-SEM-INJ-004` | Semaglutide + B6 Injection | semaglutide-v4 | $329.00 | `variant_0858c18b808e` | `price_dbc846be2af8` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-TIR-INJ-001` | Tirzepatide + B6 Injection | tirzepatide-v1 | $189.00 | `variant_8ed93e38d4bb` | `price_a638edd7e278` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-TIR-INJ-002` | Tirzepatide + B6 Injection | tirzepatide-v2 | $258.99 | `variant_65197b99b7c1` | `price_025ae1e10e81` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-TIR-INJ-003` | Tirzepatide + B6 Injection | tirzepatide-v3 | $369.00 | `variant_c36104e1b53c` | `price_3c12d8bb293b` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-TIR-INJ-004` | Tirzepatide + B6 Injection | tirzepatide-v4 | $429.00 | `variant_89f15bb9ad30` | `price_8a73862931ca` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | Current MBM formulation includes vitamin B6 (+B6). Any GEN pairing with different additive (B12, glycine, plain base, etc.) requires REPLACE WITH NEW SKU — never silent rename. |
| `MBM-WM-FB3-INJ-001` | Fat Burner | fat-burner-v1 | $259.00 | `variant_2c53926ab625` | `price_197259afe856` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-EST-PAT-001` | Estradiol Patch | estradiol-patch-v1 | $129.00 | `variant_77a5809b96cc` | `price_bb2cd434d6cb` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-EST-PAT-002` | Estradiol Patch | estradiol-patch-v2 | $138.98 | `variant_96a619fecc8b` | `price_bc07cb8899a4` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-EST-PAT-003` | Estradiol Patch | estradiol-patch-v3 | $149.00 | `variant_48a704f13621` | `price_22d08b77e3ac` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-PRG-CAP-001` | Progesterone Capsules | progesterone-capsules-v1 | $39.00 | `variant_e37d0c490dba` | `price_a99f863c0fe1` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-PRG-CAP-002` | Progesterone Capsules | progesterone-capsules-v2 | $59.00 | `variant_bdbc2b9f0ade` | `price_2e5104ff73e0` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-HRT-TST-CRM-001` | Testosterone Cream | testosterone-cream-v1 | $79.00 | `variant_39c27962b958` | `price_14296712e379` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-NAD-INJ-001` | NAD+ Injection | nad-plus-v1 | $199.00 | `variant_d2b5be492da2` | `price_f7e899c11336` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-NAD-INJ-002` | NAD+ Injection | nad-plus-v2 | $229.00 | `variant_5085e02375d1` | `price_94fd558220c1` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-SEL-INJ-001` | Selank Injection | selank-v1 | $129.00 | `variant_35f9129e2cae` | `price_0519a38f67b0` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-SMX-INJ-001` | Semax Injection | semax-v1 | $129.00 | `variant_8f66246f1d44` | `price_6aca1278605b` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-SSN-NS-001` | Selank + Semax Blend Nasal Spray | selank-semax-nasal-spray-v1 | $169.00 | `variant_7fa5cf5aab9c` | `price_12025a97b268` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-LON-TESA-INJ-001` | Tesamorelin Injection | tesamorelin-v1 | $149.00 | `variant_2471d74b381b` | `price_9e528d04b5f4` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-RP-BPC-CAP-001` | Wolverine: BPC-157/TB-500 | bpc-157-tb-500-v1 | $99.00 | `variant_5d38654f00fc` | `price_548c95f3d3bd` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-RP-BPC-INJ-001` | Wolverine: BPC-157/TB-500 | bpc-157-tb-500-v2 | $199.00 | `variant_28a362285cd1` | `price_468c0be65863` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-SH-TRE-CRM-001` | Tretinoin Cream | tretinoin-cream-v1 | $79.00 | `variant_708bb1c9f5f0` | `price_c7871c25c2eb` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-SH-TRE-CRM-002` | Tretinoin Cream | tretinoin-cream-v2 | $89.00 | `variant_1988ad508047` | `price_8312c58ec718` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-SH-TRE-CRM-003` | Tretinoin Cream | tretinoin-cream-v3 | $109.00 | `variant_8f7950e121d1` | `price_26636d01db04` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-SH-MIN-SOL-001` | Minoxidil Combination Topical Formula | minoxidil-topical-v1 | $129.00 | `variant_f9e5928143c7` | `price_98520d872070` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |
| `MBM-SH-BIM-SOL-001` | Lash/Brow Growth Serum | bimatoprost-solution-v1 | $89.00 | `variant_321ade2267a1` | `price_338fe6049a04` | REQUIRES MANUAL REVIEW | — | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD — GEN ID REQUIRED | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD — GEN ID REQUIRED | GEN Health / Scriptful formulary IDs, pharmacy pairing, and costs not yet supplied. Exact KEEP AS-IS vs REPLACE cannot be asserted without GEN data. |

Machine-readable twin: `docs/genhealth-migration-matrix.json`.

---

## 11. New SKU proposals

No new SKUs proposed in Phase 12B — GEN formulary not supplied. After GEN review, propose e.g. MBM-WM-SEM-INJ-005+ only if formulation changes.

### SKU creation rules

- Preserve MBM-[CATEGORY]-[PRODUCT]-[FORM]-[NNN]
- New formulation = new SKU (never reuse retired SKU)
- B6 → B12/glycine/other additive change = new SKU
- Propose NEW SKUs only after GEN pairing confirms formulation delta

---

## 12. Transition state model

| State | Meaning | Checkout |
|---|---|---|
| **CURRENT** | Live MBM sellable; GEN fields null/TBD | Unchanged Tagada path via existing kashu_sku_map + combo priceIds |
| **NEW_READY** | New MBM SKU + GEN pairing + costs complete; Tagada map for NEW SKU prepared; not yet storefront-primary | Not sellable until dual-cutover flip |
| **DUAL_MAPPED** | New SKU live for new enrollments; old SKU deprecated for new sales; history intact | Storefront sells NEW SKU only; old map may remain inactive for disputes |
| **DEPRECATED** | Old SKU not sellable; retained for historical orders | Must not be purchasable |
| **BLOCKED** | Missing GEN pairing/costs or unpaired | Must not be purchasable — fail closed |

**Hard rule:** BLOCKED / unpaired GEN products must not be purchasable.

---

## 13. Blocked / unknown items

1. Full GEN Health formulary / provider-network product list not in repo.
2. GEN medication pairing IDs unknown.
3. Pharmacy assignment (Ageless vs ProCompounding vs other) per SKU unknown at GEN layer.
4. Medication cost + pharmacy shipping cost unknown → markups/gross cannot be computed.
5. Whether GEN SEM/TIRZ pairings preserve +B6 unknown → formulation REPLACE risk.
6. Live BSG `kashu_sku_map` not dumped in this phase (seed JSON used as reference only).
7. Membership financial safety under GEN costs unknown.
8. Rebill→GEN refill API not evidenced — keep payment-only rebill.

---

## 14. Phase 12C preconditions

1. Obtain owner-approved GEN Health formulary export (product, pairing, pharmacy, strength, form, package, costs).
2. Fill GEN fields in this matrix; compute markups; set match_type / confidence.
3. For every SEM/TIRZ pairing, explicitly certify formulation equality vs +B6 or propose NEW SKUs.
4. Decide membership crosswalk updates only after vial SKU decisions.
5. Only then design NEW Tagada map rows / combo priceIds (still no live Tagada writes until approved).
6. Design fail-closed checkout for BLOCKED statuses.
7. Keep DEPRECATE+CREATE for any SKU remaps; never update-in-place historical SKUs/Tagada IDs.
8. Keep rebill behavior: no auto medication order creation until GEN API option chosen.

---

## Checklist

| Item | Result |
|---|---|
| CURRENT MEDICATION SKUS INVENTORIED | YES (28 sellable) |
| GEN MAPPING MODEL DESIGNED | YES |
| OLD SKU PRESERVATION CONFIRMED | YES (no in-place updates) |
| NEW SKU REQUIREMENTS IDENTIFIED | CONDITIONAL (await GEN; +B6 changes force new SKU) |
| SEM FORMULATION CHANGES IDENTIFIED | FLAGGED AS RISK — GEN compare pending |
| TIRZ FORMULATION CHANGES IDENTIFIED | FLAGGED AS RISK — GEN compare pending |
| MEMBERSHIP FINANCIAL IMPACT REVIEWED | YES (costs unknown → UNKNOWN safety) |
| GEN IDS STILL REQUIRED | YES |
| TAGADA CHANGES MADE | NO |
| DATABASE CHANGES MADE | NO |
| SUPABASE CHANGES MADE | NO |
| PRODUCTION TOUCHED | NO |
