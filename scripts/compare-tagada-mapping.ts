/**
 * Read-only: compare MBM 52 SKUs to Tagada productsRaw snapshot.
 * Does not call Tagada APIs.
 */
import fs from 'fs';
import {
  VARIANT_SKU_BY_ID,
  MEMBERSHIP_PROGRAM_SKU_BY_APP_ID,
} from '../src/data/variantSkus.ts';
import { products, memberships } from '../src/data/products.ts';

type MbmRow = {
  mbmProduct: string;
  mbmVariant: string;
  mbmSku: string;
  mbmProductId: string;
  mbmVariantId: string;
  retailPrice: number;
};

type TagadaVar = {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  sku: string;
  priceId: string;
  amountCents: number | null;
  priceDollars: number | null;
};

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

const mbm: MbmRow[] = [];
for (const p of products) {
  for (const v of p.variants || []) {
    const sku = VARIANT_SKU_BY_ID[v.id as keyof typeof VARIANT_SKU_BY_ID];
    if (!sku) continue;
    const label =
      [v.dosageForm, v.strength, v.size].filter(Boolean).join(' · ') || v.id;
    mbm.push({
      mbmProduct: p.name,
      mbmVariant: label,
      mbmSku: sku,
      mbmProductId: p.id,
      mbmVariantId: v.id,
      retailPrice: Number(v.price),
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
  mbm.push({
    mbmProduct: m.displayName,
    mbmVariant: 'Membership program (monthly)',
    mbmSku: sku,
    mbmProductId: String(appId),
    mbmVariantId: String(appId),
    retailPrice: Number(m.monthlyPrice),
  });
}

const discovery = JSON.parse(
  fs.readFileSync('/tmp/tagada_discovery_safe.json', 'utf8'),
);
const items = discovery.productsRaw?.items || [];
const tagada: TagadaVar[] = [];
for (const p of items) {
  for (const v of p.variants || []) {
    for (const prc of v.prices || []) {
      const usd = prc.currencyOptions?.USD?.amount;
      const amountCents = typeof usd === 'number' ? usd : null;
      tagada.push({
        productId: p.id,
        productName: p.name,
        variantId: v.id,
        variantName: v.name || '',
        sku: String(v.sku || p.sku || '').trim(),
        priceId: prc.id,
        amountCents,
        priceDollars: amountCents != null ? amountCents / 100 : null,
      });
    }
  }
}

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function nameRelated(mbmName: string, tagName: string) {
  const a = norm(mbmName);
  const b = norm(tagName);
  if (a === b) return true;
  if (a.includes('bimatoprost') && (b.includes('bimatoprost') || b.includes('lash')))
    return true;
  if (a.includes('minoxidil') && b.includes('minoxidil')) return true;
  if (a.includes('tretinoin') && b.includes('tretinoin')) return true;
  if (
    (a.includes('bpc') || a.includes('wolverine')) &&
    (b.includes('bpc') || b.includes('wolverine'))
  )
    return true;
  if (a.includes('selank') && a.includes('semax') && b.includes('selank') && b.includes('semax'))
    return true;
  if (a.includes('semax') && !a.includes('selank') && b.includes('semax') && !b.includes('selank'))
    return true;
  if (
    a.includes('selank') &&
    !a.includes('semax') &&
    b.includes('selank') &&
    !b.includes('semax') &&
    !b.includes('nasal')
  )
    return true;
  if (a.includes('nad') && b.includes('nad')) return true;
  if (a.includes('testosterone') && b.includes('testosterone')) return true;
  if (a.includes('progesterone') && b.includes('progesterone')) return true;
  if (a.includes('estradiol') && b.includes('estradiol')) return true;
  if (a.includes('tirzepatide') && b.includes('tirzepatide')) return true;
  if (a.includes('semaglutide') && b.includes('semaglutide')) return true;
  if (a.includes('tesamorelin') && b.includes('tesamorelin')) return true;
  if (a.includes('fat burner') && b.includes('fat burner')) return true;
  return false;
}

const usedTagadaVariantIds = new Set<string>();
const out: Out[] = [];

for (const row of mbm) {
  const bySku = tagada.filter((t) => t.sku && t.sku === row.mbmSku);
  if (bySku.length === 1) {
    const t = bySku[0];
    usedTagadaVariantIds.add(t.variantId);
    const priceMatch =
      t.priceDollars != null && Math.abs(t.priceDollars - row.retailPrice) < 0.02;
    out.push({
      mbmProduct: row.mbmProduct,
      mbmVariant: row.mbmVariant,
      mbmSku: row.mbmSku,
      mbmProductId: row.mbmProductId,
      mbmVariantId: row.mbmVariantId,
      retailPrice: row.retailPrice.toFixed(2),
      tagadaProductId: t.productId,
      tagadaVariantId: t.variantId,
      tagadaPriceId: t.priceId,
      tagadaPrice: t.priceDollars != null ? t.priceDollars.toFixed(2) : '',
      mappingStatus: priceMatch ? 'MATCHED' : 'PRICE MISMATCH',
      notes: priceMatch
        ? 'Matched by Tagada variant SKU'
        : `SKU matched; Tagada price ${t.priceDollars} vs MBM ${row.retailPrice}`,
    });
    continue;
  }
  if (bySku.length > 1) {
    out.push({
      mbmProduct: row.mbmProduct,
      mbmVariant: row.mbmVariant,
      mbmSku: row.mbmSku,
      mbmProductId: row.mbmProductId,
      mbmVariantId: row.mbmVariantId,
      retailPrice: row.retailPrice.toFixed(2),
      tagadaProductId: bySku.map((t) => t.productId).join('|'),
      tagadaVariantId: bySku.map((t) => t.variantId).join('|'),
      tagadaPriceId: bySku.map((t) => t.priceId).join('|'),
      tagadaPrice: '',
      mappingStatus: 'DUPLICATE',
      notes: `Multiple Tagada variants share SKU ${row.mbmSku}`,
    });
    continue;
  }

  const related = tagada.filter(
    (t) =>
      nameRelated(row.mbmProduct, t.productName) ||
      nameRelated(row.mbmProduct, t.variantName),
  );
  const priceHits = related.filter(
    (t) => t.priceDollars != null && Math.abs(t.priceDollars - row.retailPrice) < 0.02,
  );
  if (priceHits.length === 1) {
    const t = priceHits[0];
    usedTagadaVariantIds.add(t.variantId);
    out.push({
      mbmProduct: row.mbmProduct,
      mbmVariant: row.mbmVariant,
      mbmSku: row.mbmSku,
      mbmProductId: row.mbmProductId,
      mbmVariantId: row.mbmVariantId,
      retailPrice: row.retailPrice.toFixed(2),
      tagadaProductId: t.productId,
      tagadaVariantId: t.variantId,
      tagadaPriceId: t.priceId,
      tagadaPrice: t.priceDollars!.toFixed(2),
      mappingStatus: 'MATCHED',
      notes:
        'Matched by product name + retail price (Tagada variant SKU empty). Confirm strength/formulation before sync.',
    });
    continue;
  }
  if (priceHits.length > 1) {
    out.push({
      mbmProduct: row.mbmProduct,
      mbmVariant: row.mbmVariant,
      mbmSku: row.mbmSku,
      mbmProductId: row.mbmProductId,
      mbmVariantId: row.mbmVariantId,
      retailPrice: row.retailPrice.toFixed(2),
      tagadaProductId: priceHits.map((t) => t.productId).join('|'),
      tagadaVariantId: priceHits.map((t) => t.variantId).join('|'),
      tagadaPriceId: priceHits.map((t) => t.priceId).join('|'),
      tagadaPrice: priceHits.map((t) => t.priceDollars!.toFixed(2)).join('|'),
      mappingStatus: 'AMBIGUOUS',
      notes:
        'Multiple Tagada variants share name+price; cannot uniquely map without SKU/strength metadata.',
    });
    continue;
  }
  if (related.length > 0) {
    const prices = related
      .map((t) => t.priceDollars)
      .filter((x): x is number => x != null);
    out.push({
      mbmProduct: row.mbmProduct,
      mbmVariant: row.mbmVariant,
      mbmSku: row.mbmSku,
      mbmProductId: row.mbmProductId,
      mbmVariantId: row.mbmVariantId,
      retailPrice: row.retailPrice.toFixed(2),
      tagadaProductId: related
        .map((t) => t.productId)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join('|'),
      tagadaVariantId: related.map((t) => t.variantId).join('|'),
      tagadaPriceId: related.map((t) => t.priceId).join('|'),
      tagadaPrice: prices.map((p) => p.toFixed(2)).join('|'),
      mappingStatus: related.length === 1 ? 'PRICE MISMATCH' : 'AMBIGUOUS',
      notes:
        related.length === 1
          ? `Related Tagada product found but price ${prices[0]} != MBM ${row.retailPrice}`
          : `Related Tagada variants found (${related.length}) but no unique price match for MBM ${row.retailPrice}. Tagada SKUs empty.`,
    });
    continue;
  }

  out.push({
    mbmProduct: row.mbmProduct,
    mbmVariant: row.mbmVariant,
    mbmSku: row.mbmSku,
    mbmProductId: row.mbmProductId,
    mbmVariantId: row.mbmVariantId,
    retailPrice: row.retailPrice.toFixed(2),
    tagadaProductId: '',
    tagadaVariantId: '',
    tagadaPriceId: '',
    tagadaPrice: '',
    mappingStatus: 'MISSING IN TAGADA',
    notes: 'No Tagada product/variant found by SKU or name. Product sync required.',
  });
}

const counts = {
  MATCHED: out.filter((r) => r.mappingStatus === 'MATCHED').length,
  'MISSING IN TAGADA': out.filter((r) => r.mappingStatus === 'MISSING IN TAGADA')
    .length,
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
const csv =
  [
    header.join(','),
    ...out.map((r) =>
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
        .join(','),
    ),
  ].join('\n') + '\n';
fs.writeFileSync('docs/tagada-product-mapping-review.csv', csv);

const md = `# Tagada Product Mapping Review

**Generated:** 2026-08-11 (read-only live catalog compare)  
**Auth:** PASS (BSG Edge secrets via temporary discovery function — deployed then deleted)  
**Store:** My Bare Method (type \`tagadapay\`, USD)  
**MBM SKUs expected:** 52  
**Rows:** ${out.length}

## Tagada catalog observed

| Metric | Count |
|--------|------:|
| Products | ${items.length} |
| Variants | ${tagada.length} |
| Prices | ${tagada.length} |
| Variants with MBM SKU set | ${tagada.filter((t) => t.sku && t.sku.startsWith('MBM-')).length} |

Tagada variant \`sku\` fields are mostly empty. Where unique, rows are matched by **product name + retail price**.

## Summary counts

| Status | Count |
|--------|------:|
| MATCHED | ${counts.MATCHED} |
| MISSING IN TAGADA | ${counts['MISSING IN TAGADA']} |
| DUPLICATE | ${counts.DUPLICATE} |
| AMBIGUOUS | ${counts.AMBIGUOUS} |
| PRICE MISMATCH | ${counts['PRICE MISMATCH']} |

## Product sync required

**YES** — catalog incomplete vs 52 MBM SKUs; existing Tagada variants lack MBM SKU metadata.

Do **not** create/update Tagada products until owner approval.

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

fs.writeFileSync(
  '/tmp/mapping_counts.json',
  JSON.stringify(
    {
      counts,
      tagadaProducts: items.length,
      tagadaVariants: tagada.length,
      tagadaPrices: tagada.length,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify({ mbm: mbm.length, ...counts, tagadaProducts: items.length, tagadaVariants: tagada.length }, null, 2));
