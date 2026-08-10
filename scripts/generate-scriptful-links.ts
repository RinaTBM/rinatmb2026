import { visibleProducts, visibleMemberships } from '../src/data/products.ts';
import { writeFileSync } from 'node:fs';

type Row = {
  product: string;
  category: string;
  slug: string;
  url: string;
  activeVisible: string;
  modes: string;
  formulation: string;
};

function purchaseModes(p: Record<string, unknown>): string {
  const modes: string[] = [];
  const opts = p.purchaseOptions as Record<string, unknown> | undefined;
  if (opts?.oneTime) modes.push('one_time');
  if (opts?.autoRefill) modes.push('auto_refill');
  if (p.isMembership || String(p.slug || '').includes('membership')) modes.push('membership_program');
  if (!modes.length) {
    if (Array.isArray(p.variants) && (p.variants as unknown[]).length) modes.push('one_time');
  }
  return modes.length ? modes.join(', ') : 'one_time';
}

function formulationReq(p: Record<string, unknown>): string {
  if (p.isMembership || String(p.slug || '').includes('membership')) {
    return 'Requested dose/formulation required before join/checkout';
  }
  const variants = (p.variants as Array<Record<string, unknown>> | undefined) || [];
  if (variants.some(v => /mg|dose|formulation|units/i.test(String(v.label || v.name || '')))) {
    return 'Variant/dose selection on product page';
  }
  if (variants.length > 1) return 'Variant selection on product page';
  return 'None beyond standard add-to-cart';
}

const rows: Row[] = [];
const seen = new Set<string>();

for (const m of visibleMemberships as Array<Record<string, unknown>>) {
  const slug = String(m.slug || '');
  if (!slug || seen.has(slug)) continue;
  seen.add(slug);
  rows.push({
    product: String(m.displayName || m.name),
    category: 'memberships',
    slug,
    url: `https://mybaremethod.com/product/${slug}`,
    activeVisible: 'status=active; visible=true',
    modes: 'membership_program',
    formulation: 'Requested dose/formulation required before join/checkout',
  });
}

for (const p of visibleProducts as Array<Record<string, unknown>>) {
  const slug = String(p.slug || '');
  if (!slug || seen.has(slug)) continue;
  // Skip future/hidden already filtered by visibleProducts
  if (p.status && p.status !== 'active') continue;
  seen.add(slug);
  rows.push({
    product: String(p.displayName || p.name),
    category: String(p.section || 'storefront'),
    slug,
    url: `https://mybaremethod.com/product/${slug}`,
    activeVisible: `status=${p.status || 'active'}; visible=true`,
    modes: purchaseModes(p),
    formulation: formulationReq(p),
  });
}

// Prefer wellness ordering
const order = [
  'memberships',
  'weight-management',
  'womens-hormone-therapy',
  'longevity-cognitive',
  'recovery-performance',
  'prescription-skin-hair',
  'provider-care',
  'accessories',
];
rows.sort((a, b) => {
  const ai = order.indexOf(a.category);
  const bi = order.indexOf(b.category);
  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.product.localeCompare(b.product);
});

const md = `# Scriptful Product Links — My Bare Method

Generated from the active storefront catalog on branch \`cursor/manual-ach-invoice-checkout-2026\` (commit \`58d1039\` lineage).

**Production origin:** \`https://mybaremethod.com\`

Route pattern verified in app router: \`/product/:slug\`

Do **not** use staging URLs for Scriptful. Do **not** include hidden/future/inactive products.

## Active product count

**${rows.length}**

## Product links

| Product | Category | Slug | Production URL | Active/Visible | Purchase modes | Formulation/dose requirements |
|---|---|---|---|---|---|---|
${rows
  .map(
    r =>
      `| ${r.product.replace(/\|/g, '/')} | ${r.category} | \`${r.slug}\` | ${r.url} | ${r.activeVisible} | ${r.modes} | ${r.formulation} |`,
  )
  .join('\n')}
`;

writeFileSync('docs/scriptful-product-links.md', md);
console.log('WROTE docs/scriptful-product-links.md rows=', rows.length);
for (const r of rows) console.log(r.slug, '->', r.url);
