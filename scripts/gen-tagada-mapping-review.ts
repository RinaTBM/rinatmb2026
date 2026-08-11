/**
 * Discovery-only: emit docs/tagada-product-mapping-review.{csv,md}
 * from the MBM SKU registry. Does NOT call Tagada APIs.
 */
import fs from 'fs';
import {
  VARIANT_SKU_BY_ID,
  MEMBERSHIP_PROGRAM_SKU_BY_APP_ID,
} from '../src/data/variantSkus.ts';
import { products, memberships } from '../src/data/products.ts';

type Row = {
  mbmProduct: string;
  mbmVariant: string;
  mbmSku: string;
  mbmProductId: string;
  mbmVariantId: string;
  retailPrice: string;
  tagadaProductId: string;
  tagadaVariantId: string;
  tagadaPriceId: string;
  tagadaPrice: string;
  mappingStatus: string;
  notes: string;
};

const note =
  'PROVISIONAL: Tagada List Products not probed — TAGADA_API_KEY and TAGADA_STORE_ID absent from agent environment. Re-run read-only compare after secrets are provided. Do NOT create Tagada products until owner approval.';

const rows: Row[] = [];

for (const p of products) {
  for (const v of p.variants || []) {
    const sku = VARIANT_SKU_BY_ID[v.id as keyof typeof VARIANT_SKU_BY_ID];
    if (!sku) continue;
    const label =
      [v.dosageForm, v.strength, v.size].filter(Boolean).join(' · ') || v.id;
    rows.push({
      mbmProduct: p.name || (p as { displayName?: string }).displayName || p.id,
      mbmVariant: label,
      mbmSku: sku,
      mbmProductId: p.id,
      mbmVariantId: v.id,
      retailPrice: Number(v.price).toFixed(2),
      tagadaProductId: '',
      tagadaVariantId: '',
      tagadaPriceId: '',
      tagadaPrice: '',
      mappingStatus: 'MISSING IN TAGADA',
      notes: note,
    });
  }
}

for (const m of memberships) {
  const appId = m.checkoutProductId || m.supabaseId || m.id;
  const sku =
    m.programSku ||
    MEMBERSHIP_PROGRAM_SKU_BY_APP_ID[
      appId as keyof typeof MEMBERSHIP_PROGRAM_SKU_BY_APP_ID
    ];
  if (!sku || !sku.includes('-MEM-')) continue;
  rows.push({
    mbmProduct: m.displayName || appId,
    mbmVariant: 'Membership program (monthly)',
    mbmSku: sku,
    mbmProductId: String(appId),
    mbmVariantId: String(appId),
    retailPrice: Number(m.monthlyPrice).toFixed(2),
    tagadaProductId: '',
    tagadaVariantId: '',
    tagadaPriceId: '',
    tagadaPrice: '',
    mappingStatus: 'MISSING IN TAGADA',
    notes:
      'Membership PROGRAM SKU (≠ fulfillment medication SKU). Recurring Tagada priceId TBD in Phase 2. ' +
      note,
  });
}

const header = [
  'MBM Product',
  'MBM Variant',
  'MBM SKU',
  'MBM Product ID',
  'MBM Variant ID',
  'Retail Price',
  'Tagada Product ID',
  'Tagada Variant ID',
  'Tagada Price ID',
  'Tagada Price',
  'Mapping Status',
  'Notes',
];

const esc = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
const csv =
  [
    header.join(','),
    ...rows.map((r) =>
      [
        r.mbmProduct,
        r.mbmVariant,
        r.mbmSku,
        r.mbmProductId,
        r.mbmVariantId,
        r.retailPrice,
        r.tagadaProductId,
        r.tagadaVariantId,
        r.tagadaPriceId,
        r.tagadaPrice,
        r.mappingStatus,
        r.notes,
      ]
        .map(esc)
        .join(',')
    ),
  ].join('\n') + '\n';

fs.writeFileSync('docs/tagada-product-mapping-review.csv', csv);

const matched = rows.filter((r) => r.mappingStatus === 'MATCHED').length;
const missing = rows.filter((r) => r.mappingStatus === 'MISSING IN TAGADA').length;
const ambiguous = rows.filter((r) => r.mappingStatus === 'AMBIGUOUS').length;
const priceMismatch = rows.filter((r) => r.mappingStatus === 'PRICE MISMATCH').length;

const md = `# Tagada Product Mapping Review

**Generated:** 2026-08-11  
**Status:** DISCOVERY ONLY — provisional  
**MBM SKUs expected:** 52 (50 retail + 2 membership program)  
**Rows in this review:** ${rows.length}

## Blocking caveat

Tagada \`POST /api/public/v1/products/list\` was **not executed**.

Reason: \`TAGADA_API_KEY\` (Bearer) and \`TAGADA_STORE_ID\` are **not available** in this cloud agent environment.

Therefore every row is marked **MISSING IN TAGADA** as a provisional status meaning **“not yet compared”**, not a confirmed empty Kashu catalog.

After secrets are provided, re-run read-only List Products / Get Product and update this file + CSV. **Do not create Tagada products until owner approval.**

## Summary counts (provisional)

| Status | Count |
|--------|------:|
| MATCHED | ${matched} |
| MISSING IN TAGADA | ${missing} |
| AMBIGUOUS | ${ambiguous} |
| PRICE MISMATCH | ${priceMismatch} |
| DUPLICATE | 0 |
| NOT APPLICABLE | 0 |

## Mapping design (recommended)

Keep MBM SKU as source of truth. Store Tagada IDs in \`public.kashu_sku_map\`:

| MBM | Tagada |
|-----|--------|
| \`mbm_sku\` | stable join key |
| \`mbm_product_id\` / \`mbm_variant_id\` | optional audit |
| \`tagada_product_id\` | Tagada product |
| \`tagada_variant_id\` | required for \`checkout/init\` items |
| \`tagada_price_id\` | required for subscriptions (\`subscriptions/create\`) |
| \`tagada_unit_amount_cents\` | for PRICE MISMATCH detection |

Membership program SKUs (\`MBM-MEM-*\`) map to recurring Tagada prices separately from fulfillment medication SKUs.

## Official Tagada list products (read-only)

- **Method:** \`POST\`
- **URL:** \`https://api.tagada.io/api/public/v1/products/list\` (sandbox: \`api.tagada.dev\`)
- **Auth:** \`Authorization: Bearer <api-key>\`
- **Required body:** \`{ "storeId": "<storeId>" }\`
- **Useful options:** \`includeVariants: true\`, \`includePrices: true\`, pagination \`page\` / \`per_page\`

## CSV

See [\`docs/tagada-product-mapping-review.csv\`](./tagada-product-mapping-review.csv).

## Rows

| MBM SKU | Product | Variant | Retail | Status |
|---------|---------|---------|-------:|--------|
${rows
  .map(
    (r) =>
      `| \`${r.mbmSku}\` | ${r.mbmProduct} | ${r.mbmVariant} | $${r.retailPrice} | ${r.mappingStatus} |`
  )
  .join('\n')}
`;

fs.writeFileSync('docs/tagada-product-mapping-review.md', md);
console.log({
  rows: rows.length,
  retail: rows.filter((r) => !r.mbmSku.includes('-MEM-')).length,
  mem: rows.filter((r) => r.mbmSku.includes('-MEM-')).length,
});
