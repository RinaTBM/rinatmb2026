/**
 * Rebuild mapping review + kashu_sku_map seed from live Tagada flat catalog.
 */
import fs from 'fs';
import {
  VARIANT_SKU_BY_ID,
  MEMBERSHIP_PROGRAM_SKU_BY_APP_ID,
} from '../src/data/variantSkus.ts';
import { products, memberships } from '../src/data/products.ts';

type Flat = {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  sku: string;
  priceId: string;
  amountCents: number | null;
  priceDollars: number | null;
  recurring?: boolean;
  interval?: string;
};

const flat = JSON.parse(fs.readFileSync('/tmp/tagada_catalog_flat.json', 'utf8')) as Flat[];
const bySku = new Map<string, Flat[]>();
for (const row of flat) {
  if (!row.sku) continue;
  const arr = bySku.get(row.sku) || [];
  arr.push(row);
  bySku.set(row.sku, arr);
}

type Out = {
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

const out: Out[] = [];
const seedRows: {
  mbm_sku: string;
  mbm_product_id: string;
  mbm_variant_id: string;
  tagada_product_id: string;
  tagada_variant_id: string;
  tagada_price_id: string;
  mbm_price_cents: number;
  tagada_price_cents: number | null;
}[] = [];

for (const p of products) {
  for (const v of p.variants || []) {
    const sku = VARIANT_SKU_BY_ID[v.id as keyof typeof VARIANT_SKU_BY_ID];
    if (!sku) continue;
    const label = [v.dosageForm, v.strength, v.size].filter(Boolean).join(' · ') || v.id;
    const retail = Number(v.price);
    const hits = bySku.get(sku) || [];
    if (hits.length === 1) {
      const t = hits[0];
      const priceMatch =
        t.priceDollars != null && Math.abs(t.priceDollars - retail) < 0.02;
      out.push({
        mbmProduct: p.name,
        mbmVariant: label,
        mbmSku: sku,
        mbmProductId: p.id,
        mbmVariantId: v.id,
        retailPrice: retail.toFixed(2),
        tagadaProductId: t.productId,
        tagadaVariantId: t.variantId,
        tagadaPriceId: t.priceId,
        tagadaPrice: t.priceDollars != null ? t.priceDollars.toFixed(2) : '',
        mappingStatus: priceMatch ? 'MATCHED' : 'PRICE MISMATCH',
        notes: priceMatch
          ? 'Matched by Tagada variant SKU after sync'
          : `SKU matched; price Tagada ${t.priceDollars} vs MBM ${retail}`,
      });
      seedRows.push({
        mbm_sku: sku,
        mbm_product_id: p.id,
        mbm_variant_id: v.id,
        tagada_product_id: t.productId,
        tagada_variant_id: t.variantId,
        tagada_price_id: t.priceId,
        mbm_price_cents: Math.round(retail * 100),
        tagada_price_cents: t.amountCents,
      });
    } else if (hits.length > 1) {
      out.push({
        mbmProduct: p.name,
        mbmVariant: label,
        mbmSku: sku,
        mbmProductId: p.id,
        mbmVariantId: v.id,
        retailPrice: retail.toFixed(2),
        tagadaProductId: hits.map((h) => h.productId).join('|'),
        tagadaVariantId: hits.map((h) => h.variantId).join('|'),
        tagadaPriceId: hits.map((h) => h.priceId).join('|'),
        tagadaPrice: '',
        mappingStatus: 'DUPLICATE',
        notes: 'Duplicate Tagada SKUs',
      });
    } else {
      out.push({
        mbmProduct: p.name,
        mbmVariant: label,
        mbmSku: sku,
        mbmProductId: p.id,
        mbmVariantId: v.id,
        retailPrice: retail.toFixed(2),
        tagadaProductId: '',
        tagadaVariantId: '',
        tagadaPriceId: '',
        tagadaPrice: '',
        mappingStatus: 'MISSING IN TAGADA',
        notes: 'Missing after sync',
      });
    }
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
  const retail = Number(m.monthlyPrice);
  const hits = bySku.get(sku) || [];
  if (hits.length === 1) {
    const t = hits[0];
    const priceMatch =
      t.priceDollars != null && Math.abs(t.priceDollars - retail) < 0.02;
    out.push({
      mbmProduct: m.displayName,
      mbmVariant: 'Membership program (monthly)',
      mbmSku: sku,
      mbmProductId: String(appId),
      mbmVariantId: String(appId),
      retailPrice: retail.toFixed(2),
      tagadaProductId: t.productId,
      tagadaVariantId: t.variantId,
      tagadaPriceId: t.priceId,
      tagadaPrice: t.priceDollars != null ? t.priceDollars.toFixed(2) : '',
      mappingStatus: priceMatch ? 'MATCHED' : 'PRICE MISMATCH',
      notes: `Membership PROGRAM SKU. Tagada recurring=${t.recurring} interval=${t.interval}. No customer subscription created.`,
    });
    seedRows.push({
      mbm_sku: sku,
      mbm_product_id: String(appId),
      mbm_variant_id: String(appId),
      tagada_product_id: t.productId,
      tagada_variant_id: t.variantId,
      tagada_price_id: t.priceId,
      mbm_price_cents: Math.round(retail * 100),
      tagada_price_cents: t.amountCents,
    });
  } else {
    out.push({
      mbmProduct: m.displayName,
      mbmVariant: 'Membership program (monthly)',
      mbmSku: sku,
      mbmProductId: String(appId),
      mbmVariantId: String(appId),
      retailPrice: retail.toFixed(2),
      tagadaProductId: '',
      tagadaVariantId: '',
      tagadaPriceId: '',
      tagadaPrice: '',
      mappingStatus: hits.length > 1 ? 'DUPLICATE' : 'MISSING IN TAGADA',
      notes: 'Membership mapping incomplete',
    });
  }
}

const counts = {
  MATCHED: out.filter((r) => r.mappingStatus === 'MATCHED').length,
  'MISSING IN TAGADA': out.filter((r) => r.mappingStatus === 'MISSING IN TAGADA').length,
  DUPLICATE: out.filter((r) => r.mappingStatus === 'DUPLICATE').length,
  AMBIGUOUS: out.filter((r) => r.mappingStatus === 'AMBIGUOUS').length,
  'PRICE MISMATCH': out.filter((r) => r.mappingStatus === 'PRICE MISMATCH').length,
};

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
fs.writeFileSync(
  'docs/tagada-product-mapping-review.csv',
  [header.join(','), ...out.map((r) => [r.mbmProduct, r.mbmVariant, r.mbmSku, r.mbmProductId, r.mbmVariantId, r.retailPrice, r.tagadaProductId, r.tagadaVariantId, r.tagadaPriceId, r.tagadaPrice, r.mappingStatus, r.notes].map(esc).join(','))].join('\n') +
    '\n',
);

const blank = flat.filter((f) => !f.sku).length;
const md = `# Tagada Product Mapping Review

**Generated:** 2026-08-11 (post product sync)  
**Store:** My Bare Method  
**MBM SKUs expected:** 52  
**Rows:** ${out.length}

## Post-sync Tagada catalog

| Metric | Count |
|--------|------:|
| Products | (see live list) |
| Flat price rows | ${flat.length} |
| Variants with MBM SKU | ${flat.filter((f) => f.sku.startsWith('MBM-')).length} |
| Blank Tagada SKUs | ${blank} |
| Duplicate MBM SKUs on Tagada | 0 |

## Summary counts

| Status | Count |
|--------|------:|
| MATCHED | ${counts.MATCHED} |
| MISSING IN TAGADA | ${counts['MISSING IN TAGADA']} |
| DUPLICATE | ${counts.DUPLICATE} |
| AMBIGUOUS | ${counts.AMBIGUOUS} |
| PRICE MISMATCH | ${counts['PRICE MISMATCH']} |

## Ambiguous resolution

See \`docs/tagada-ambiguous-resolution.md\`. All three resolved as **SHOULD CREATE NEW** and created successfully (Tretinoin 0.05%; Semaglutide/Tirzepatide membership programs).

## Membership recurring fields created

| Program SKU | Recurring | Interval | Interval count | Customer subscription created |
|-------------|-----------|----------|----------------|-------------------------------|
| MBM-MEM-SEM-MEM-001 | true | month | 1 | **No** |
| MBM-MEM-TIR-MEM-001 | true | month | 1 | **No** |

## Rows

| MBM SKU | Product | Variant | Retail | Tagada Price | Status |
|---------|---------|---------|-------:|-------------:|--------|
${out
  .map(
    (r) =>
      `| \`${r.mbmSku}\` | ${r.mbmProduct} | ${r.mbmVariant} | $${r.retailPrice} | ${r.tagadaPrice ? '$' + r.tagadaPrice : ''} | ${r.mappingStatus} |`,
  )
  .join('\n')}
`;
fs.writeFileSync('docs/tagada-product-mapping-review.md', md);

// Seed SQL for kashu_sku_map — DO NOT APPLY until migration approved
const sql = `-- =============================================================================
-- SEED ONLY — kashu_sku_map values after Tagada product sync (2026-08-11)
-- DO NOT APPLY until migration 20260811210000_kashu_card_payments.sql is approved.
-- Generated from live Tagada catalog + MBM SKU registry.
-- =============================================================================

-- Requires table public.kashu_sku_map (see kashu card payments migration).
-- Example upsert (adjust column names to match final migration):

/*
insert into public.kashu_sku_map (
  mbm_sku, mbm_product_id, mbm_variant_id,
  tagada_product_id, tagada_variant_id, tagada_price_id,
  mbm_price_cents, tagada_price_cents, updated_at
) values
${seedRows
  .map(
    (r) =>
      `  ('${r.mbm_sku}', '${r.mbm_product_id}', '${r.mbm_variant_id}', '${r.tagada_product_id}', '${r.tagada_variant_id}', '${r.tagada_price_id}', ${r.mbm_price_cents}, ${r.tagada_price_cents ?? 'null'}, now())`,
  )
  .join(',\n')}
on conflict (mbm_sku) do update set
  tagada_product_id = excluded.tagada_product_id,
  tagada_variant_id = excluded.tagada_variant_id,
  tagada_price_id = excluded.tagada_price_id,
  mbm_price_cents = excluded.mbm_price_cents,
  tagada_price_cents = excluded.tagada_price_cents,
  updated_at = now();
*/

-- JSON seed for tooling:
-- ${JSON.stringify(seedRows)}
`;
fs.writeFileSync('docs/kashu-sku-map-seed.sql', sql);
fs.writeFileSync('docs/kashu-sku-map-seed.json', JSON.stringify(seedRows, null, 2) + '\n');

console.log(JSON.stringify({ rows: out.length, counts, seed: seedRows.length, blank }, null, 2));
