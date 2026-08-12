# Provider Automation — Product Scope

Audit source: `src/data/products.ts`, `src/data/variantSkus.ts`, `src/data/productCopy.ts`, Scriptful/Kashu docs, and Supabase migrations (read-only).  
Generated: 2026-08-12.

**Provider Automation Applies = YES** only for **provider-guided prescription** retail products (`requiresPrescription: true`, not accessories, not provider-care services, not memberships).  
**Therapy Family** keys are stable product `slug` values (not display-name parsing of variants).

---

## Scope table

| Product | Product ID | Category | SKU(s) | Provider Automation Applies | Therapy Family | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Semaglutide + B6 Injection | `p1` | PROVIDER-GUIDED PRESCRIPTION (`weight-management`) | `MBM-WM-SEM-INJ-001`, `MBM-WM-SEM-INJ-002`, `MBM-WM-SEM-INJ-003`, `MBM-WM-SEM-INJ-004` | YES | `semaglutide` | Retail vial SKUs; `requiresPrescription` + `requiresProviderReview`. Member pricing off (membership is separate). |
| Tirzepatide + B6 Injection | `p5` | PROVIDER-GUIDED PRESCRIPTION (`weight-management`) | `MBM-WM-TIR-INJ-001`, `MBM-WM-TIR-INJ-002`, `MBM-WM-TIR-INJ-003`, `MBM-WM-TIR-INJ-004` | YES | `tirzepatide` | Retail vial SKUs; provider review required. |
| Fat Burner | `p74` | PROVIDER-GUIDED PRESCRIPTION (`weight-management`) | `MBM-WM-FB3-INJ-001` | YES | `fat-burner` | Compounded AOD-9604 / MOTS-C / Tesamorelin blend; slug-based family key. |
| Estradiol Patch | `p16` | PROVIDER-GUIDED PRESCRIPTION (`womens-hormone-therapy`) | `MBM-HRT-EST-PAT-001`, `MBM-HRT-EST-PAT-002`, `MBM-HRT-EST-PAT-003` | YES | `estradiol-patch` | RX disclaimer; strength = patch dose schedule. |
| Progesterone Capsules | `p23` | PROVIDER-GUIDED PRESCRIPTION (`womens-hormone-therapy`) | `MBM-HRT-PRG-CAP-001`, `MBM-HRT-PRG-CAP-002` | YES | `progesterone-capsules` | RX disclaimer. |
| Testosterone Cream | `p27` | PROVIDER-GUIDED PRESCRIPTION (`womens-hormone-therapy`) | `MBM-HRT-TST-CRM-001` | YES | `testosterone-cream` | RX disclaimer; single variant. |
| NAD+ Injection | `p9` | PROVIDER-GUIDED PRESCRIPTION (`longevity-cognitive`) | `MBM-LON-NAD-INJ-001`, `MBM-LON-NAD-INJ-002` | YES | `nad-plus` | Compounded; slug `nad-plus`. |
| Selank Injection | `p48` | PROVIDER-GUIDED PRESCRIPTION (`longevity-cognitive`) | `MBM-LON-SEL-INJ-001` | YES | `selank` | Compounded. |
| Semax Injection | `p47` | PROVIDER-GUIDED PRESCRIPTION (`longevity-cognitive`) | `MBM-LON-SMX-INJ-001` | YES | `semax` | Compounded. |
| Selank + Semax Blend Nasal Spray | `p68` | PROVIDER-GUIDED PRESCRIPTION (`longevity-cognitive`) | `MBM-LON-SSN-NS-001` | YES | `selank-semax-nasal-spray` | Distinct product/family from single-peptide injectables. |
| Tesamorelin Injection | `p73` | PROVIDER-GUIDED PRESCRIPTION (`longevity-cognitive`) | `MBM-LON-TESA-INJ-001` | YES | `tesamorelin` | Distinct from Fat Burner blend. |
| Wolverine: BPC-157/TB-500 | `p41` | PROVIDER-GUIDED PRESCRIPTION (`recovery-performance`) | `MBM-RP-BPC-CAP-001`, `MBM-RP-BPC-INJ-001` | YES | `bpc-157-tb-500` | Multi-form (Capsule + Injection); family from product slug. |
| Tretinoin Cream | `p69` | PROVIDER-GUIDED PRESCRIPTION (`prescription-skin-hair`) | `MBM-SH-TRE-CRM-001`, `MBM-SH-TRE-CRM-002`, `MBM-SH-TRE-CRM-003` | YES | `tretinoin-cream` | Storefront-visible; historically excluded from Stripe wellness sync list. |
| Minoxidil Combination Topical Formula | `p70` | PROVIDER-GUIDED PRESCRIPTION (`prescription-skin-hair`) | `MBM-SH-MIN-SOL-001` | YES | `minoxidil-topical` | Compounded combination formula. |
| Lash/Brow Growth Serum | `p71` | PROVIDER-GUIDED PRESCRIPTION (`prescription-skin-hair`) | `MBM-SH-BIM-SOL-001` | YES | `bimatoprost-solution` | Display name differs; therapy family = product slug `bimatoprost-solution` (IDs/SKU unchanged). |
| Initial Provider Visit | `pc1` | PROVIDER SERVICE (`provider-care`) | `MBM-PC-IPV-SRV-001` | NO | — | Consultation service, not a medication. Automation target is prescriptions, not the visit SKU itself. |
| Follow-Up Visit | `pc2` | PROVIDER SERVICE (`provider-care`) | `MBM-PC-FUV-SRV-001` | NO | — | Follow-up consultation service. |
| Laboratory Review | `pc3` | PROVIDER SERVICE (`provider-care`) | `MBM-PC-LAB-SRV-001` | NO | — | Lab-interpretation visit; not prescribing automation. |
| Complete Injection Starter Kit | `a1` | ACCESSORY (`accessories`) | `MBM-ACC-CIS-ACC-001` | NO | — | Supplies bundle; `requiresPrescription: false`. |
| Premium 3D Printed Peptide Case | `a2` | ACCESSORY (`accessories`) | `MBM-ACC-PPC-ACC-001` | NO | — | |
| Temperature-Controlled Travel Case | `a3` | ACCESSORY (`accessories`) | `MBM-ACC-TTC-ACC-001` | NO | — | |
| Discreet Travel Bag | `a4` | ACCESSORY (`accessories`) | `MBM-ACC-DTB-ACC-001` | NO | — | |
| Reusable Ice Pack | `a5` | ACCESSORY (`accessories`) | `MBM-ACC-ICE-ACC-001` | NO | — | |
| Daily & Weekly Wellness Planner | `a6` | ACCESSORY (`accessories`) | `MBM-ACC-DWP-ACC-001` | NO | — | |
| Sharps Container | `a7` | ACCESSORY (`accessories`) | `MBM-ACC-SHP-ACC-001` | NO | — | |
| Alcohol Prep Wipes | `a8` | ACCESSORY (`accessories`) | `MBM-ACC-APW-ACC-001`, `MBM-ACC-APW-ACC-002` | NO | — | Pack-count variants. |
| Premium Insulin Syringes | `a10` | ACCESSORY (`accessories`) | `MBM-ACC-PIS-ACC-001` … `MBM-ACC-PIS-ACC-010` | NO | — | Pack-count variants (10–100). |
| Semaglutide Membership | `semaglutide-membership` (`m1`) | MEMBERSHIP | `MBM-MEM-SEM-MEM-001` (program SKU) | NO | `semaglutide` (program context only) | Billing program, not a retail medication line. Fulfillment still uses retail `semaglutide` vial SKUs after provider approval. |
| Tirzepatide Membership | `tirzepatide-membership` (`m2`) | MEMBERSHIP | `MBM-MEM-TIR-MEM-001` (program SKU) | NO | `tirzepatide` (program context only) | Same pattern as Semaglutide membership. |

**Active + visible totals:** 15 prescription · 3 provider services · 9 accessories · 2 memberships = **29** commercial offerings (27 `visibleProducts` + 2 `visibleMemberships`).

**Hidden / not in scope table:** `sermorelin` (`p12`, future), `minoxidil-tablets` (`p72`, future), `elite-wellness-membership` (inactive).

---

## Classification rules used

| Class | Rule |
| --- | --- |
| PROVIDER-GUIDED PRESCRIPTION | `status=active` + `isVisible=true` + `requiresPrescription=true` (non-accessory wellness / RX categories) |
| ACCESSORY | `category === 'accessories'` |
| PROVIDER SERVICE | `category === 'provider-care'` |
| MEMBERSHIP | Entries in `memberships[]` with `status=active` + `isVisible=true` |
| OTHER | None among current active+visible catalog |

`mk()` defaults: non-accessory / non-provider-care → `requiresPrescription: true`, `requiresProviderReview: true`.  
Provider-care → `requiresPrescription: false`, `requiresProviderReview: true`.  
Accessories → both false.

---

## Provider service products (full extract)

### Initial Provider Visit

| Field | Value |
| --- | --- |
| displayName | Initial Provider Visit |
| product id | `pc1` |
| slug | `initial-provider-consultation` |
| variant id(s) | `initial-provider-consultation-v1` |
| sku(s) | `MBM-PC-IPV-SRV-001` |
| price | $75.00 |
| status / isVisible | `active` / `true` |
| category | `provider-care` |
| dosageForm | Service · strength `1 session` · size `Visit` |
| shortDescription | Your Initial Provider Visit is dedicated time with a licensed clinician to review goals, health history, and whether treatment options make sense for you… |
| longDescription (snippet) | This is a consultation service — not a medication. You and your provider discuss what you want to work on, review relevant history, and map sensible next steps… |
| Flags | `requiresProviderReview: true`, `requiresPrescription: false`, `excludedFromDiscounts: true` |

### Follow-Up Visit

| Field | Value |
| --- | --- |
| displayName | Follow-Up Visit |
| product id | `pc2` |
| slug | `follow-up-appointment` |
| variant id(s) | `follow-up-appointment-v1` |
| sku(s) | `MBM-PC-FUV-SRV-001` |
| price | $55.00 |
| status / isVisible | `active` / `true` |
| category | `provider-care` |
| dosageForm | Service · strength `1 session` · size `Visit` |
| shortDescription | A Follow-Up Visit gives you time to review progress, talk through side effects or questions, and refine your plan with a licensed provider… |
| longDescription (snippet) | Follow-up is where good care stays personal. Bring updates on how you feel, what is working, and what is not… |
| Flags | `requiresProviderReview: true`, `requiresPrescription: false`, `excludedFromDiscounts: true` |

### Laboratory Review

| Field | Value |
| --- | --- |
| displayName | Laboratory Review |
| product id | `pc3` |
| slug | `laboratory-review` |
| variant id(s) | `laboratory-review-v1` |
| sku(s) | `MBM-PC-LAB-SRV-001` |
| price | $55.00 |
| status / isVisible | `active` / `true` |
| category | `provider-care` |
| dosageForm | Service · strength `1 session` · size `Visit` |
| shortDescription | Laboratory Review is a provider visit focused on interpreting your results in plain language and recommending sensible next steps… |
| longDescription (snippet) | This service focuses on interpretation and guidance based on results available for review. It does not automatically include ordering labs or prescribing medication… |
| Flags | `requiresProviderReview: true`, `requiresPrescription: false`, `excludedFromDiscounts: true` |

---

## Cross-reference: Scriptful / Kashu / Supabase

| Source | Initial Provider Visit | Follow-Up Visit | Laboratory Review |
| --- | --- | --- | --- |
| `docs/scriptful-variant-skus.csv` | Present (`MBM-PC-IPV-SRV-001`, storefront-only note) | Present | Present |
| `docs/scriptful-variant-skus.md` | Present | Present | Present |
| `docs/scriptful-product-links.md` | Present (`status=active; visible=true`) | Present | Present |
| `docs/kashu-sku-map-seed.json` | Present (`pc1` / `initial-provider-consultation-v1`) | Present (`pc2`) | Present (`pc3` / `laboratory-review-v1`) |
| `docs/kashu-sku-map-seed.sql` | Present | Present | Present |
| `supabase/migrations` `catalog_variants` seed | **Not seeded** as DB rows | **Not seeded** | **Not seeded** |
| `20260811090000_variant_skus.sql` | Comment: accessories / provider-care remain storefront-only (SKU in TypeScript) | same | same |
| `20260807020000_purchase_savings_strategy.sql` | Mentions `provider-care` for discount exclusion / eligibility flags | same | same |
| `20260806090000_catalog_admin_schema.sql` | Defines `catalog_variants` table (no PC product rows) | same | same |

Conclusion: provider-care SKUs are first-class in the **TypeScript storefront + Scriptful/Kashu maps**, but are **not** inserted into Supabase `catalog_variants` (checkout uses `price_data` / `provider_care` resolution path).

---

## How variants expose therapy / dose fields

There is **no dedicated `therapyFamily` field** on variants. Family is derived from the **parent product** (`slug` / `id`).

| Concern | Where it lives | Shape |
| --- | --- | --- |
| Therapy / product family | Product `slug` (and `id`); variant ids prefix with slug | e.g. product `semaglutide` → variants `semaglutide-v1`…`v4` |
| variantId | `ProductVariant.id` ← `buildVariants()` = `` `${slug}-v${n}` `` | Also cart `CartItem.variantId`, checkout `variantId`, catalog `variantKey` |
| sku | `VARIANT_SKU_BY_ID[variantId]` attached on build; registry in `variantSkus.ts` | e.g. `MBM-WM-SEM-INJ-001` |
| dosage / strength | `ProductVariant.strength` | e.g. `0.5mg`, `0.025mg twice weekly`, `Blend`, `1 session` |
| formulation (delivery form) | `ProductVariant.dosageForm` (+ product `dosageForms[]`) | `Injection`, `Patch`, `Capsule`, `Cream`, `Nasal Spray`, `Service`, `Accessory`, … |
| size / pack | `ProductVariant.size` | e.g. `Vial`, `8 patches`, `Visit` |
| Customer-facing selection label | `ProductVariant.label` | `${strength}, ${size}` or `${dosageForm}, ${strength}, ${size}` when multi-form |
| Selected dose (cart/checkout) | Retail: implied by chosen `variantId` + `variantLabel`. Memberships: `CartItem.requestedFormulation` (request only, not guaranteed dose) | Line key includes `requestedFormulation` for memberships |

Normalized catalog (`src/lib/catalog/catalog.ts`) maps the same fields to `variantKey`, `displayName`, `dosageForm`, `strength`, `size`, `sku`.
