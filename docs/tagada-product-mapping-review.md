# Tagada Product Mapping Review

**Generated:** 2026-08-11  
**Status:** DISCOVERY ONLY — provisional  
**MBM SKUs expected:** 52 (50 retail + 2 membership program)  
**Rows in this review:** 52

## Blocking caveat

Tagada catalog compare remains **blocked**.

### Auth retry (Cursor agent secrets — read-only)

| Check | Result |
|-------|--------|
| `TAGADA_API_KEY` / `TAGADA_STORE_ID` present in agent env | Yes |
| Value shape | 64-char hex digests (identical to Supabase Management API secret digests) |
| Tagada expected formats | UUID, `sk_crm_…`, or `tp_sk_…` + store id `store_…` |
| `POST https://api.tagada.io/api/public/v1/auth/test` | **401** invalid API key format |
| Sandbox auth | **401** same |
| Prior Edge runtime probe | BSG Edge values were docs placeholders (`Bearer your-api-key` / `string`) |

**AUTHENTICATION: FAIL**

Rows stay **MISSING IN TAGADA** = provisional **not yet compared** (not proof of empty catalog).

**No Tagada writes. No deploys. No Supabase secret modifications in this pass.**

### Unblock

Paste **real** Kashu/Tagada dashboard values into Cursor secrets (and update BSG Edge secrets to the same):

1. `TAGADA_API_KEY` = raw key only (UUID or `sk_crm_…`) — never a 64-char hex digest, never `Bearer …`
2. `TAGADA_STORE_ID` = `store_…` — never `string`, never a digest

Then re-run read-only discovery.


## Summary counts (provisional)

| Status | Count |
|--------|------:|
| MATCHED | 0 |
| MISSING IN TAGADA | 52 |
| AMBIGUOUS | 0 |
| PRICE MISMATCH | 0 |
| DUPLICATE | 0 |
| NOT APPLICABLE | 0 |

## Mapping design (recommended)

Keep MBM SKU as source of truth. Store Tagada IDs in `public.kashu_sku_map`:

| MBM | Tagada |
|-----|--------|
| `mbm_sku` | stable join key |
| `mbm_product_id` / `mbm_variant_id` | optional audit |
| `tagada_product_id` | Tagada product |
| `tagada_variant_id` | required for `checkout/init` items |
| `tagada_price_id` | required for subscriptions (`subscriptions/create`) |
| `tagada_unit_amount_cents` | for PRICE MISMATCH detection |

Membership program SKUs (`MBM-MEM-*`) map to recurring Tagada prices separately from fulfillment medication SKUs.

## Official Tagada list products (read-only)

- **Method:** `POST`
- **URL:** `https://api.tagada.io/api/public/v1/products/list` (sandbox: `api.tagada.dev`)
- **Auth:** `Authorization: Bearer <api-key>`
- **Required body:** `{ "storeId": "<storeId>" }`
- **Useful options:** `includeVariants: true`, `includePrices: true`, pagination `page` / `per_page`

## CSV

See [`docs/tagada-product-mapping-review.csv`](./tagada-product-mapping-review.csv).

## Rows

| MBM SKU | Product | Variant | Retail | Status |
|---------|---------|---------|-------:|--------|
| `MBM-WM-SEM-INJ-001` | Semaglutide + B6 Injection | Injection · 0.5mg · Vial | $119.00 | MISSING IN TAGADA |
| `MBM-WM-SEM-INJ-002` | Semaglutide + B6 Injection | Injection · 1mg · Vial | $139.00 | MISSING IN TAGADA |
| `MBM-WM-SEM-INJ-003` | Semaglutide + B6 Injection | Injection · 2.5mg · Vial | $189.02 | MISSING IN TAGADA |
| `MBM-WM-SEM-INJ-004` | Semaglutide + B6 Injection | Injection · 5mg · Vial | $329.00 | MISSING IN TAGADA |
| `MBM-WM-TIR-INJ-001` | Tirzepatide + B6 Injection | Injection · 2.5mg · Vial | $189.00 | MISSING IN TAGADA |
| `MBM-WM-TIR-INJ-002` | Tirzepatide + B6 Injection | Injection · 7.5mg · Vial | $258.99 | MISSING IN TAGADA |
| `MBM-WM-TIR-INJ-003` | Tirzepatide + B6 Injection | Injection · 12.5mg · Vial | $369.00 | MISSING IN TAGADA |
| `MBM-WM-TIR-INJ-004` | Tirzepatide + B6 Injection | Injection · 15mg · Vial | $429.00 | MISSING IN TAGADA |
| `MBM-WM-FB3-INJ-001` | Fat Burner | Injection · AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL) · 5mL vial | $259.00 | MISSING IN TAGADA |
| `MBM-HRT-EST-PAT-001` | Estradiol Patch | Patch · 0.025mg twice weekly · 8 patches | $129.00 | MISSING IN TAGADA |
| `MBM-HRT-EST-PAT-002` | Estradiol Patch | Patch · 0.05mg twice weekly · 8 patches | $138.98 | MISSING IN TAGADA |
| `MBM-HRT-EST-PAT-003` | Estradiol Patch | Patch · 0.1mg twice weekly · 8 patches | $149.00 | MISSING IN TAGADA |
| `MBM-HRT-PRG-CAP-001` | Progesterone Capsules | Capsule · 100mg · 30 capsules | $39.00 | MISSING IN TAGADA |
| `MBM-HRT-PRG-CAP-002` | Progesterone Capsules | Capsule · 200mg · 30 capsules | $59.00 | MISSING IN TAGADA |
| `MBM-HRT-TST-CRM-001` | Testosterone Cream | Cream · 5mg/g · 30g | $79.00 | MISSING IN TAGADA |
| `MBM-LON-NAD-INJ-001` | NAD+ Injection | Injection · 100mg/mL · 500mg total · 5mL | $199.00 | MISSING IN TAGADA |
| `MBM-LON-NAD-INJ-002` | NAD+ Injection | Injection · 100mg/mL · 1,000mg total · 10mL | $229.00 | MISSING IN TAGADA |
| `MBM-LON-SEL-INJ-001` | Selank Injection | Injection · 5mg/mL · 2mL | $129.00 | MISSING IN TAGADA |
| `MBM-LON-SMX-INJ-001` | Semax Injection | Injection · 5mg/mL · 2mL | $129.00 | MISSING IN TAGADA |
| `MBM-LON-SSN-NS-001` | Selank + Semax Blend Nasal Spray | Nasal Spray · 50mcg/50mcg per spray · 10mL | $169.00 | MISSING IN TAGADA |
| `MBM-LON-TESA-INJ-001` | Tesamorelin Injection | Injection · 10mg total · 5mg/mL · 2mL vial | $149.00 | MISSING IN TAGADA |
| `MBM-RP-BPC-CAP-001` | Wolverine: BPC-157/TB-500 | Capsule · Blend · Capsule | $99.00 | MISSING IN TAGADA |
| `MBM-RP-BPC-INJ-001` | Wolverine: BPC-157/TB-500 | Injection · Blend · Injection | $199.00 | MISSING IN TAGADA |
| `MBM-SH-TRE-CRM-001` | Tretinoin Cream | Cream · 0.025% · 20g | $79.00 | MISSING IN TAGADA |
| `MBM-SH-TRE-CRM-002` | Tretinoin Cream | Cream · 0.05% · 20g | $89.00 | MISSING IN TAGADA |
| `MBM-SH-TRE-CRM-003` | Tretinoin Cream | Cream · 0.1% · 20g | $109.00 | MISSING IN TAGADA |
| `MBM-SH-MIN-SOL-001` | Minoxidil Combination Topical Formula | Topical Solution · Combination formula · Bottle | $129.00 | MISSING IN TAGADA |
| `MBM-SH-BIM-SOL-001` | Bimatoprost Solution | Solution · 0.03% · 2.5mL | $89.00 | MISSING IN TAGADA |
| `MBM-PC-IPV-SRV-001` | Initial Provider Visit | Service · 1 session · Visit | $75.00 | MISSING IN TAGADA |
| `MBM-PC-FUV-SRV-001` | Follow-Up Visit | Service · 1 session · Visit | $55.00 | MISSING IN TAGADA |
| `MBM-PC-LAB-SRV-001` | Laboratory Review | Service · 1 session · Visit | $55.00 | MISSING IN TAGADA |
| `MBM-ACC-CIS-ACC-001` | Complete Injection Starter Kit | Accessory · Bundle · 1 kit | $119.00 | MISSING IN TAGADA |
| `MBM-ACC-PPC-ACC-001` | Premium 3D Printed Peptide Case | Accessory · Standard · 1 case | $34.00 | MISSING IN TAGADA |
| `MBM-ACC-TTC-ACC-001` | Temperature-Controlled Travel Case | Accessory · Standard · 1 case | $59.00 | MISSING IN TAGADA |
| `MBM-ACC-DTB-ACC-001` | Discreet Travel Bag | Accessory · Standard · 1 bag | $39.00 | MISSING IN TAGADA |
| `MBM-ACC-ICE-ACC-001` | Reusable Ice Pack | Accessory · Standard · 1 pack | $12.00 | MISSING IN TAGADA |
| `MBM-ACC-DWP-ACC-001` | Daily & Weekly Wellness Planner | Accessory · Standard · 1 planner | $29.00 | MISSING IN TAGADA |
| `MBM-ACC-SHP-ACC-001` | Sharps Container | Accessory · Standard · 1 container | $10.00 | MISSING IN TAGADA |
| `MBM-ACC-APW-ACC-001` | Alcohol Prep Wipes | Accessory · 200 Count · 1 box | $9.99 | MISSING IN TAGADA |
| `MBM-ACC-APW-ACC-002` | Alcohol Prep Wipes | Accessory · 500 Count · 1 box | $18.99 | MISSING IN TAGADA |
| `MBM-ACC-PIS-ACC-001` | Premium Insulin Syringes | Accessory · 10 Pack · 1 pack | $3.99 | MISSING IN TAGADA |
| `MBM-ACC-PIS-ACC-002` | Premium Insulin Syringes | Accessory · 20 Pack · 1 pack | $6.99 | MISSING IN TAGADA |
| `MBM-ACC-PIS-ACC-003` | Premium Insulin Syringes | Accessory · 30 Pack · 1 pack | $9.49 | MISSING IN TAGADA |
| `MBM-ACC-PIS-ACC-004` | Premium Insulin Syringes | Accessory · 40 Pack · 1 pack | $11.99 | MISSING IN TAGADA |
| `MBM-ACC-PIS-ACC-005` | Premium Insulin Syringes | Accessory · 50 Pack · 1 pack | $14.49 | MISSING IN TAGADA |
| `MBM-ACC-PIS-ACC-006` | Premium Insulin Syringes | Accessory · 60 Pack · 1 pack | $16.99 | MISSING IN TAGADA |
| `MBM-ACC-PIS-ACC-007` | Premium Insulin Syringes | Accessory · 70 Pack · 1 pack | $19.49 | MISSING IN TAGADA |
| `MBM-ACC-PIS-ACC-008` | Premium Insulin Syringes | Accessory · 80 Pack · 1 pack | $21.99 | MISSING IN TAGADA |
| `MBM-ACC-PIS-ACC-009` | Premium Insulin Syringes | Accessory · 90 Pack · 1 pack | $24.49 | MISSING IN TAGADA |
| `MBM-ACC-PIS-ACC-010` | Premium Insulin Syringes | Accessory · 100 Pack · 1 pack | $26.99 | MISSING IN TAGADA |
| `MBM-MEM-SEM-MEM-001` | Semaglutide Membership | Membership program (monthly) | $149.00 | MISSING IN TAGADA |
| `MBM-MEM-TIR-MEM-001` | Tirzepatide Membership | Membership program (monthly) | $249.00 | MISSING IN TAGADA |
