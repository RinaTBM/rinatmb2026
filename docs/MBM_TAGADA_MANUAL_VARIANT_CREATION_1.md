# MBM-TAGADA-MANUAL-VARIANT-CREATION-1

Owner/manual Tagada dashboard checklist for the **10 missing vial-specific one-time SKUs** from PR #23.

**Do not deploy PR #23 yet.**  
**Do not create new Tagada product families.**  
**Do not create new GEN products.**  
**Do not enable GEN API Orders or GEN handoff.**  
**Do not merge PR #19.**  
**Do not invent Tagada IDs.**  
**Do not change historical variants or prices.**

Tagada public API cannot add a variant onto an existing product. Create these **in the Tagada dashboard** as new variants on the four existing products below.

Product flags to preserve on those families: **one-time USD**, **not recurring**, **isTaxable=false**, **isShippable=false**.

After each variant is created, copy:

- Tagada variant ID (`variant_…`)
- Tagada price ID (`price_…`)

Paste them into the reconciliation table (Task 3). Then fill `supabase/migrations/20260825234000_kashu_sku_map_glp1_vial_specific.sql` and apply via Bolt/Supabase only after approval.

---

## Existing Tagada product families (keep)

| Family | Product ID | Do not recreate |
| --- | --- | --- |
| Semaglutide + Vitamin B12 | `product_6b750325addf` | Keep |
| Semaglutide + Glycine | `product_dcc64482bbbf` | Keep |
| Tirzepatide + Vitamin B12 | `product_74cd4752c9d6` | Keep |
| Tirzepatide + Glycine | `product_861e0edd8ab2` | Keep |

---

## Task 1 — Dashboard checklist (10 new variants)

Display names are vial-specific fulfillment labels. They do **not** use Starting / Low, Mid, High, Any Dose, 5+10, 15+20, or 25+30. Tirzepatide names use total vial milligrams, not concentration math.

### 1. MBM-WM-SEM-B12-005

```
TAGADA PRODUCT FAMILY: Semaglutide + Vitamin B12
PRODUCT ID: product_6b750325addf
VARIANT DISPLAY NAME: 2 mg vial · Vitamin B12
SKU: MBM-WM-SEM-B12-005
PRICE: $99
PRICE CENTS: 9900
RECURRING: NO
FULFILLMENT TYPE: ONE-TIME MEDICATION
ASSOCIATED WEBSITE DOSE(S): 0.5 mg weekly
B12/GLYCINE FORMULATION: Vitamin B12
NOTES: Monthly requirement 2 mg → 2 mg vial. Add as a new variant on this existing product only. Do not edit MBM-WM-SEM-B12-001 ($89 / 1 mg vial).
```

### 2. MBM-WM-SEM-B12-006

```
TAGADA PRODUCT FAMILY: Semaglutide + Vitamin B12
PRODUCT ID: product_6b750325addf
VARIANT DISPLAY NAME: 10 mg vial · Vitamin B12
SKU: MBM-WM-SEM-B12-006
PRICE: $119
PRICE CENTS: 11900
RECURRING: NO
FULFILLMENT TYPE: ONE-TIME MEDICATION
ASSOCIATED WEBSITE DOSE(S): 1.75 mg weekly, 2 mg weekly
B12/GLYCINE FORMULATION: Vitamin B12
NOTES: Monthly requirement 7 mg / 8 mg → next larger approved vial 10 mg. Do not edit MBM-WM-SEM-B12-003 ($109 / 6 mg vial).
```

### 3. MBM-WM-SEM-GLY-005

```
TAGADA PRODUCT FAMILY: Semaglutide + Glycine
PRODUCT ID: product_dcc64482bbbf
VARIANT DISPLAY NAME: 2 mg vial · Glycine
SKU: MBM-WM-SEM-GLY-005
PRICE: $99
PRICE CENTS: 9900
RECURRING: NO
FULFILLMENT TYPE: ONE-TIME MEDICATION
ASSOCIATED WEBSITE DOSE(S): 0.5 mg weekly
B12/GLYCINE FORMULATION: Glycine
NOTES: Same 2 mg vial mapping as SEM B12-005, Glycine family. Do not edit MBM-WM-SEM-GLY-001 ($89 / 1 mg vial).
```

### 4. MBM-WM-SEM-GLY-006

```
TAGADA PRODUCT FAMILY: Semaglutide + Glycine
PRODUCT ID: product_dcc64482bbbf
VARIANT DISPLAY NAME: 10 mg vial · Glycine
SKU: MBM-WM-SEM-GLY-006
PRICE: $119
PRICE CENTS: 11900
RECURRING: NO
FULFILLMENT TYPE: ONE-TIME MEDICATION
ASSOCIATED WEBSITE DOSE(S): 1.75 mg weekly, 2 mg weekly
B12/GLYCINE FORMULATION: Glycine
NOTES: Same 10 mg vial mapping as SEM B12-006, Glycine family. Do not edit MBM-WM-SEM-GLY-003 ($109 / 6 mg vial).
```

### 5. MBM-WM-TIR-B12-005

```
TAGADA PRODUCT FAMILY: Tirzepatide + Vitamin B12
PRODUCT ID: product_74cd4752c9d6
VARIANT DISPLAY NAME: 20 mg vial · Vitamin B12
SKU: MBM-WM-TIR-B12-005
PRICE: $139
PRICE CENTS: 13900
RECURRING: NO
FULFILLMENT TYPE: ONE-TIME MEDICATION
ASSOCIATED WEBSITE DOSE(S): 5 mg weekly
B12/GLYCINE FORMULATION: Vitamin B12
NOTES: Monthly requirement 20 mg. Do not show concentration math on the dashboard name. Do not edit MBM-WM-TIR-B12-001 ($119).
```

### 6. MBM-WM-TIR-B12-006

```
TAGADA PRODUCT FAMILY: Tirzepatide + Vitamin B12
PRODUCT ID: product_74cd4752c9d6
VARIANT DISPLAY NAME: 40 mg vial · Vitamin B12
SKU: MBM-WM-TIR-B12-006
PRICE: $159
PRICE CENTS: 15900
RECURRING: NO
FULFILLMENT TYPE: ONE-TIME MEDICATION
ASSOCIATED WEBSITE DOSE(S): 10 mg weekly
B12/GLYCINE FORMULATION: Vitamin B12
NOTES: Monthly requirement 40 mg. Do not edit MBM-WM-TIR-B12-002 ($149).
```

### 7. MBM-WM-TIR-B12-007

```
TAGADA PRODUCT FAMILY: Tirzepatide + Vitamin B12
PRODUCT ID: product_74cd4752c9d6
VARIANT DISPLAY NAME: 60 mg vial · Vitamin B12
SKU: MBM-WM-TIR-B12-007
PRICE: $179
PRICE CENTS: 17900
RECURRING: NO
FULFILLMENT TYPE: ONE-TIME MEDICATION
ASSOCIATED WEBSITE DOSE(S): 15 mg weekly
B12/GLYCINE FORMULATION: Vitamin B12
NOTES: Monthly requirement 60 mg. Do not edit MBM-WM-TIR-B12-003 ($169).
```

### 8. MBM-WM-TIR-GLY-005

```
TAGADA PRODUCT FAMILY: Tirzepatide + Glycine
PRODUCT ID: product_861e0edd8ab2
VARIANT DISPLAY NAME: 20 mg vial · Glycine
SKU: MBM-WM-TIR-GLY-005
PRICE: $139
PRICE CENTS: 13900
RECURRING: NO
FULFILLMENT TYPE: ONE-TIME MEDICATION
ASSOCIATED WEBSITE DOSE(S): 5 mg weekly
B12/GLYCINE FORMULATION: Glycine
NOTES: Same 20 mg vial mapping as TIR B12-005, Glycine family. Do not edit MBM-WM-TIR-GLY-001 ($119).
```

### 9. MBM-WM-TIR-GLY-006

```
TAGADA PRODUCT FAMILY: Tirzepatide + Glycine
PRODUCT ID: product_861e0edd8ab2
VARIANT DISPLAY NAME: 40 mg vial · Glycine
SKU: MBM-WM-TIR-GLY-006
PRICE: $159
PRICE CENTS: 15900
RECURRING: NO
FULFILLMENT TYPE: ONE-TIME MEDICATION
ASSOCIATED WEBSITE DOSE(S): 10 mg weekly
B12/GLYCINE FORMULATION: Glycine
NOTES: Same 40 mg vial mapping as TIR B12-006, Glycine family. Do not edit MBM-WM-TIR-GLY-002 ($149).
```

### 10. MBM-WM-TIR-GLY-007

```
TAGADA PRODUCT FAMILY: Tirzepatide + Glycine
PRODUCT ID: product_861e0edd8ab2
VARIANT DISPLAY NAME: 60 mg vial · Glycine
SKU: MBM-WM-TIR-GLY-007
PRICE: $179
PRICE CENTS: 17900
RECURRING: NO
FULFILLMENT TYPE: ONE-TIME MEDICATION
ASSOCIATED WEBSITE DOSE(S): 15 mg weekly
B12/GLYCINE FORMULATION: Glycine
NOTES: Same 60 mg vial mapping as TIR B12-007, Glycine family. Do not edit MBM-WM-TIR-GLY-003 ($169).
```

---

## Task 2 — Website weekly dose → Tagada variant

Patient UI shows weekly dose only. Provider still makes the final prescription decision.

### Semaglutide (apply separately to B12 and Glycine)

| Weekly dose | Monthly requirement | Fulfillment vial | Retail | MBM SKU (B12) | MBM SKU (Glycine) | Tagada product | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0.25 mg | 1 mg | 1 mg vial | $89 | MBM-WM-SEM-B12-001 | MBM-WM-SEM-GLY-001 | existing | KEEP |
| 0.5 mg | 2 mg | 2 mg vial | $99 | MBM-WM-SEM-B12-005 | MBM-WM-SEM-GLY-005 | existing family, **new variant** | CREATE |
| 0.75 mg | 3 mg → 4 mg vial | 4 mg vial | $109 | MBM-WM-SEM-B12-002 | MBM-WM-SEM-GLY-002 | existing | KEEP |
| 1 mg | 4 mg | 4 mg vial | $109 | MBM-WM-SEM-B12-002 | MBM-WM-SEM-GLY-002 | existing | KEEP |
| 1.25 mg | 5 mg → 6 mg vial | 6 mg vial | $109 | MBM-WM-SEM-B12-003 | MBM-WM-SEM-GLY-003 | existing | KEEP |
| 1.5 mg | 6 mg | 6 mg vial | $109 | MBM-WM-SEM-B12-003 | MBM-WM-SEM-GLY-003 | existing | KEEP |
| 1.75 mg | 7 mg → 10 mg vial | 10 mg vial | $119 | MBM-WM-SEM-B12-006 | MBM-WM-SEM-GLY-006 | existing family, **new variant** | CREATE |
| 2 mg | 8 mg → 10 mg vial | 10 mg vial | $119 | MBM-WM-SEM-B12-006 | MBM-WM-SEM-GLY-006 | existing family, **new variant** | CREATE |

Existing SEM variants remain valid:

| Weekly dose | B12 SKU | Live Tagada (already mapped) | Glycine SKU | Live Tagada (already mapped) |
| --- | --- | --- | --- | --- |
| 0.25 mg | MBM-WM-SEM-B12-001 | product_6b750325addf / variant_f9ac5ea25184 / price_e31ac583370d / 8900 | MBM-WM-SEM-GLY-001 | product_dcc64482bbbf / variant_c51c894cfee6 / price_74822644bb1f / 8900 |
| 0.75 mg and 1 mg | MBM-WM-SEM-B12-002 | product_6b750325addf / variant_d839f0aab609 / price_0bf0b622fd45 / 10900 | MBM-WM-SEM-GLY-002 | product_dcc64482bbbf / variant_398f72f8ca6b / price_9113997a5445 / 10900 |
| 1.25 mg and 1.5 mg | MBM-WM-SEM-B12-003 | product_6b750325addf / variant_d9dac92d2f71 / price_3c22af390881 / 10900 | MBM-WM-SEM-GLY-003 | product_dcc64482bbbf / variant_a71889d8f2e1 / price_0c321507201f / 10900 |

### Tirzepatide (apply separately to B12 and Glycine)

| Weekly dose | Monthly requirement | Fulfillment vial | Retail | MBM SKU (B12) | MBM SKU (Glycine) | Tagada product | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2.5 mg | 10 mg | 10 mg vial | $119 | MBM-WM-TIR-B12-001 | MBM-WM-TIR-GLY-001 | existing | KEEP |
| 5 mg | 20 mg | 20 mg vial | $139 | MBM-WM-TIR-B12-005 | MBM-WM-TIR-GLY-005 | existing family, **new variant** | CREATE |
| 7.5 mg | 30 mg | 30 mg vial | $149 | MBM-WM-TIR-B12-002 | MBM-WM-TIR-GLY-002 | existing | KEEP |
| 10 mg | 40 mg | 40 mg vial | $159 | MBM-WM-TIR-B12-006 | MBM-WM-TIR-GLY-006 | existing family, **new variant** | CREATE |
| 12.5 mg | 50 mg | 50 mg vial | $169 | MBM-WM-TIR-B12-003 | MBM-WM-TIR-GLY-003 | existing | KEEP |
| 15 mg | 60 mg | 60 mg vial | $179 | MBM-WM-TIR-B12-007 | MBM-WM-TIR-GLY-007 | existing family, **new variant** | CREATE |

Existing TIR variants remain valid:

| Weekly dose | B12 SKU | Live Tagada (already mapped) | Glycine SKU | Live Tagada (already mapped) |
| --- | --- | --- | --- | --- |
| 2.5 mg | MBM-WM-TIR-B12-001 | product_74cd4752c9d6 / variant_2d96cc588f51 / price_ed0142289010 / 11900 | MBM-WM-TIR-GLY-001 | product_861e0edd8ab2 / variant_ddd60b897d66 / price_5e4581d60278 / 11900 |
| 7.5 mg | MBM-WM-TIR-B12-002 | product_74cd4752c9d6 / variant_0acda4e3b2d7 / price_3db063ba334a / 14900 | MBM-WM-TIR-GLY-002 | product_861e0edd8ab2 / variant_b7e1562ee522 / price_0e41d6b0aeab / 14900 |
| 12.5 mg | MBM-WM-TIR-B12-003 | product_74cd4752c9d6 / variant_5e13db7812ee / price_fb5946461765 / 16900 | MBM-WM-TIR-GLY-003 | product_861e0edd8ab2 / variant_121e6d8cd921 / price_9803c9a96da8 / 16900 |

Membership is unchanged and is not part of this checklist: SEM **$149/month**, TIR **$275/month**. Getting Started / Not Sure remains membership-only for pricing; one-time Getting Started does not assign a vial.

---

## Task 3 — Reconciliation table (paste live IDs after creation)

Live-verified 2026-08-26 via Edge `tagada-product-sync` GET (read-only). Confirm Tagada price cents equal MBM price cents before applying the Kashu SQL.

| MBM SKU | TAGADA PRODUCT ID | TAGADA VARIANT ID | TAGADA PRICE ID | MBM PRICE CENTS | TAGADA PRICE CENTS | ACTIVE |
| --- | --- | --- | --- | --- | --- | --- |
| MBM-WM-SEM-B12-005 | product_6b750325addf | variant_a726bfe758b3 | price_1c3c8051e3b5 | 9900 | 9900 | YES |
| MBM-WM-SEM-B12-006 | product_6b750325addf | variant_23afe7061b26 | price_013a62e05b77 | 11900 | 11900 | YES |
| MBM-WM-SEM-GLY-005 | product_dcc64482bbbf | variant_1f6e4f4d2cb4 | price_cea49d485af6 | 9900 | 9900 | YES |
| MBM-WM-SEM-GLY-006 | product_dcc64482bbbf | variant_6db94a24e1ad | price_49a9a6e85d5a | 11900 | 11900 | YES |
| MBM-WM-TIR-B12-005 | product_74cd4752c9d6 | variant_1f1dab8b6177 | price_ea84cec6ed40 | 13900 | 13900 | YES |
| MBM-WM-TIR-B12-006 | product_74cd4752c9d6 | variant_dd351c9f2fd1 | price_e6ef11aa3bd1 | 15900 | 15900 | YES |
| MBM-WM-TIR-B12-007 | product_74cd4752c9d6 | variant_56e8f07d6ab2 | price_bc09750e5e79 | 17900 | 17900 | YES |
| MBM-WM-TIR-GLY-005 | product_861e0edd8ab2 | variant_7726800f83dd | price_33457ae01ee9 | 13900 | 13900 | YES |
| MBM-WM-TIR-GLY-006 | product_861e0edd8ab2 | variant_57cd2414aabf | price_2a8c8629ae5c | 15900 | 15900 | YES |
| MBM-WM-TIR-GLY-007 | product_861e0edd8ab2 | variant_1446f75121d7 | price_5bcb6c9f666c | 17900 | 17900 | YES |

After all 10 rows are filled:

1. Paste the same IDs into `supabase/migrations/20260825234000_kashu_sku_map_glp1_vial_specific.sql`
2. Uncomment the `INSERT … ON CONFLICT` block
3. Apply via Bolt/Supabase after explicit approval (do not apply from Cursor)
4. Add the same 10 rows to `src/lib/payments/launchReadyKashuMap.ts` and the Edge `_shared` copy
5. Re-run typecheck / tests / build
6. Only then consider PR #23 deployable

---

## Task 4 — Kashu map SQL

Prepared, **not executed**: `supabase/migrations/20260825234000_kashu_sku_map_glp1_vial_specific.sql`

- Additive upsert of these 10 SKUs only, with live-verified Tagada IDs
- No deletes, truncates, or unrelated rows
- No historical price deletion
- No GEN changes
- Do not apply from Cursor. Apply via Bolt/Supabase after owner approval.

---

## Task 5 — Status

```
MISSING TAGADA VARIANTS: 0
LIVE-VERIFIED: 10 / 10
DUPLICATE PRODUCT FAMILIES REQUIRED: NO
KASHU MAP MIGRATION PREPARED: YES (10/10 live IDs filled; not executed)
PR #23 TECHNICALLY READY FOR SUPABASE MAPPING STEP: YES
PR #23 DEPLOYABLE NOW: NO
GEN API ORDERS: OFF
GEN HANDOFF: OFF
STOP BEFORE DATABASE WRITE OR DEPLOY.
```

After variants + map, also fill `LAUNCH_READY_KASHU_MAP` in `src/lib/payments/launchReadyKashuMap.ts` and `supabase/functions/_shared/launchReadyKashuMap.ts`, then re-run typecheck / tests / build. Do not apply the Kashu SQL from Cursor. Do not deploy until the owner says so.
