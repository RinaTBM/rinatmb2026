import { writeFileSync } from 'node:fs';
import { products, memberships } from '../src/data/products';
import { MEMBERSHIP_FULFILLMENT_CROSSWALK } from '../src/lib/catalog/membershipSkuCrosswalk';
import {
  EXPECTED_TOTAL_SKU_COUNT,
  MEMBERSHIP_PROGRAM_SKU_BY_APP_ID,
  SKU_PATTERN,
  VARIANT_SKU_BY_ID,
} from '../src/data/variantSkus';

const ORIGIN = 'https://mybaremethod.com';

const csvEscape = (v: unknown) => {
  const s = v == null ? '' : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

type Product = (typeof products)[number];
type Variant = Product['variants'][number];

const publicStatusFor = (p: Product) => {
  if (p.status === 'active' && p.isVisible) return 'Approved / Active';
  return 'Hidden';
};

const notesFor = (p: Product, v: Variant) => {
  const notes: string[] = [];
  if (['tesamorelin', 'fat-burner'].includes(p.slug)) {
    notes.push('Medical-director copy approved. Public Status = Approved / Active.');
  }
  if (v.strength === 'Blend') notes.push('Catalog strength is "Blend" — concentration not invented.');
  if (v.strength === 'Combination formula') {
    notes.push('Catalog strength is "Combination formula" — concentration not invented.');
  }
  if (p.category === 'provider-care' || p.category === 'accessories') {
    notes.push('Storefront-only variant (not in catalog_variants DB); SKU lives in TypeScript catalog.');
  }
  if (['tretinoin-cream', 'bimatoprost-solution'].includes(p.slug)) {
    notes.push('Storefront-active; excluded from Stripe sync until reviewed.');
  }
  return notes.join(' ');
};

type Row = {
  product: string;
  variant: string;
  sku: string;
  programSku: string;
  fulfillmentSku: string;
  parentId: string;
  variantId: string;
  category: string;
  dosageForm: string;
  strength: string;
  size: string;
  url: string;
  active: string;
  publicStatus: string;
  notes: string;
};

const retailRows: Row[] = [];
for (const p of products.filter(x => x.status === 'active' && x.isVisible)) {
  for (const v of p.variants) {
    retailRows.push({
      product: p.displayName,
      variant: v.label,
      sku: v.sku || VARIANT_SKU_BY_ID[v.id] || '',
      programSku: '',
      fulfillmentSku: '',
      parentId: p.id,
      variantId: v.id,
      category: p.category,
      dosageForm: v.dosageForm,
      strength: v.strength,
      size: v.size,
      url: `${ORIGIN}/product/${p.slug}`,
      active: 'true',
      publicStatus: publicStatusFor(p),
      notes: notesFor(p, v),
    });
  }
}

const memRows: Row[] = [];
for (const m of memberships.filter(x => x.status === 'active' && x.isVisible)) {
  const programSku = m.programSku || MEMBERSHIP_PROGRAM_SKU_BY_APP_ID[m.checkoutProductId] || '';
  memRows.push({
    product: m.displayName,
    variant: 'Membership program (billing)',
    sku: programSku,
    programSku,
    fulfillmentSku: '',
    parentId: m.checkoutProductId,
    variantId: `${m.slug}-program`,
    category: 'memberships',
    dosageForm: 'Membership',
    strength: 'n/a',
    size: 'monthly',
    url: `${ORIGIN}/product/${m.slug}`,
    active: 'true',
    publicStatus: 'Approved / Active',
    notes:
      'PROGRAM SKU only. Fulfillment uses retail WM SKUs via dose crosswalk — no duplicate membership-medication SKUs.',
  });
  for (const dose of m.includedFormulations) {
    const cross = MEMBERSHIP_FULFILLMENT_CROSSWALK.find(
      r => r.membershipAppId === m.checkoutProductId && r.requestedDose === dose,
    );
    memRows.push({
      product: m.displayName,
      variant: `Requested dose: ${dose}`,
      sku: programSku,
      programSku,
      fulfillmentSku: cross?.fulfillmentSku || '',
      parentId: m.checkoutProductId,
      variantId: `${m.slug}-dose-${dose}`,
      category: 'memberships',
      dosageForm: 'Membership',
      strength: dose,
      size: 'monthly program',
      url: `${ORIGIN}/product/${m.slug}`,
      active: 'true',
      publicStatus: 'Approved / Active',
      notes: `PROGRAM SKU=${programSku}; FULFILLMENT SKU=${cross?.fulfillmentSku || 'MISSING'} (retail vial ${cross?.fulfillmentVariantId || ''}).`,
    });
  }
}

const headers = [
  'Product',
  'Variant / Dose',
  'SKU',
  'Program SKU if applicable',
  'Fulfillment SKU if applicable',
  'MBM Parent Product ID',
  'MBM Variant ID',
  'Category',
  'Dosage Form',
  'Strength / Concentration',
  'Size / Quantity',
  'Production URL',
  'Active',
  'Public Status',
  'Notes',
];

const allExportRows = [...retailRows, ...memRows];
const csvLines = [headers.join(',')];
for (const r of allExportRows) {
  csvLines.push(
    [
      r.product,
      r.variant,
      r.sku,
      r.programSku,
      r.fulfillmentSku,
      r.parentId,
      r.variantId,
      r.category,
      r.dosageForm,
      r.strength,
      r.size,
      r.url,
      r.active,
      r.publicStatus,
      r.notes,
    ]
      .map(csvEscape)
      .join(','),
  );
}

const retailSkus = retailRows.map(r => r.sku);
const programSkus = Object.values(MEMBERSHIP_PROGRAM_SKU_BY_APP_ID);
const uniqueRetail = new Set(retailSkus);
const allUnique = new Set([...retailSkus, ...programSkus]);
const invalid = [...allUnique].filter(s => !SKU_PATTERN.test(s));
const missing = retailRows.filter(r => !r.sku).map(r => r.variantId);
const orphans = Object.keys(VARIANT_SKU_BY_ID).filter(
  id => !retailRows.some(r => r.variantId === id),
);

const md: string[] = [];
md.push('# Scriptful Variant SKUs — My Bare Method');
md.push('');
md.push(
  'Generated from the authoritative live catalog (`src/data/products.ts` + `src/data/variantSkus.ts`).',
);
md.push('');
md.push('**Production origin:** `https://mybaremethod.com`');
md.push('');
md.push('Route pattern: `/product/:slug`');
md.push('');
md.push(
  '**Note:** Tesamorelin and Fat Burner are medical-director approved with **Public Status = Approved / Active**.',
);
md.push('');
md.push('## Policy');
md.push('');
md.push('1. Every active selectable retail variant/dosage has exactly one stable SKU.');
md.push('2. Membership programs have a PROGRAM SKU (billing).');
md.push(
  '3. Membership fulfillment uses the existing retail weight-management medication SKU for the requested dose — **no duplicate membership-medication SKUs**.',
);
md.push('');
md.push('## Totals');
md.push('');
md.push('| Metric | Count |');
md.push('|---|---|');
md.push(`| Retail / selectable variant SKUs | ${uniqueRetail.size} |`);
md.push(`| Membership PROGRAM SKUs | ${programSkus.length} |`);
md.push(
  `| **Total unique SKUs** | **${allUnique.size}** (expected ${EXPECTED_TOTAL_SKU_COUNT}) |`,
);
md.push('');
md.push('## Validation snapshot');
md.push('');
md.push(
  `- Duplicate retail SKUs: ${retailSkus.length === uniqueRetail.size ? 'none' : 'FOUND'}`,
);
md.push(`- Missing active variant SKUs: ${missing.length ? missing.join(', ') : 'none'}`);
md.push(
  `- Orphan registry SKUs (no active variant): ${orphans.length ? orphans.join(', ') : 'none'}`,
);
md.push(`- Invalid SKU format: ${invalid.length ? invalid.join(', ') : 'none'}`);
md.push('');
md.push('## Membership PROGRAM ↔ FULFILLMENT crosswalk');
md.push('');
md.push('| Program | Program SKU | Requested Dose | Fulfillment SKU | Retail Variant ID |');
md.push('|---|---|---|---|---|');
for (const r of MEMBERSHIP_FULFILLMENT_CROSSWALK) {
  md.push(
    `| ${r.programName} | \`${r.programSku}\` | ${r.requestedDose} | \`${r.fulfillmentSku}\` | \`${r.fulfillmentVariantId}\` |`,
  );
}
md.push('');
md.push('### Example');
md.push('');
md.push('Semaglutide Membership');
md.push('');
md.push('- Program SKU: `MBM-MEM-SEM-MEM-001`');
md.push('- Requested Dose: `2.5mg`');
md.push('- Fulfillment SKU: `MBM-WM-SEM-INJ-003`');
md.push('');
md.push('## Retail variant SKUs');
md.push('');
md.push(
  '| Product | Variant / Dose | SKU | Parent ID | Variant ID | Category | Form | Strength | Size | URL | Public Status | Notes |',
);
md.push('|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const r of retailRows) {
  md.push(
    `| ${r.product} | ${r.variant} | \`${r.sku}\` | \`${r.parentId}\` | \`${r.variantId}\` | ${r.category} | ${r.dosageForm} | ${r.strength} | ${r.size} | ${r.url} | ${r.publicStatus} | ${r.notes || ''} |`,
  );
}
md.push('');
md.push('## Membership program SKUs');
md.push('');
md.push('| Product | SKU (Program) | Parent ID | URL | Notes |');
md.push('|---|---|---|---|---|');
for (const m of memberships.filter(x => x.status === 'active' && x.isVisible)) {
  const sku = m.programSku || MEMBERSHIP_PROGRAM_SKU_BY_APP_ID[m.checkoutProductId];
  md.push(
    `| ${m.displayName} | \`${sku}\` | \`${m.checkoutProductId}\` | ${ORIGIN}/product/${m.slug} | PROGRAM SKU; fulfillment via retail WM SKUs |`,
  );
}
md.push('');
md.push('## CSV');
md.push('');
md.push('Machine-readable export: [`scriptful-variant-skus.csv`](./scriptful-variant-skus.csv)');
md.push('');
md.push(
  'CSV includes membership dose rows with both Program SKU and Fulfillment SKU columns populated, plus Public Status.',
);
md.push('');
md.push('## Exclusions');
md.push('');
md.push('- Inactive Tirzepatide 30mg — excluded');
md.push('- Inactive Bare Elite Wellness — excluded');
md.push('- Future products (Sermorelin, Minoxidil Tablets) — no SKU assigned');
md.push('');

writeFileSync('docs/scriptful-variant-skus.md', md.join('\n'));
writeFileSync('docs/scriptful-variant-skus.csv', csvLines.join('\n') + '\n');
console.log(
  JSON.stringify(
    {
      retail: uniqueRetail.size,
      program: programSkus.length,
      total: allUnique.size,
      missing,
      orphans,
      invalid,
      csvRows: allExportRows.length,
      approvedActive: retailRows.filter(r =>
        ['tesamorelin-v1', 'fat-burner-v1'].includes(r.variantId),
      ).map(r => ({ sku: r.sku, status: r.publicStatus })),
    },
    null,
    2,
  ),
);
