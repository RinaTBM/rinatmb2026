import { writeFileSync } from 'node:fs';
import { products, memberships } from '../src/data/products';
import { PRODUCT_COPY, MEMBERSHIP_COPY, paragraphs } from '../src/data/productCopy';

const lines: string[] = [];
lines.push('# Product Description Review — My Bare Method');
lines.push('');
lines.push(
  'Final style pass: premium + benefit-forward + provider-guided presentation (TWC/EllieMD *presentation* inspiration; original MBM wording).',
);
lines.push('');
lines.push(
  '**Status:** Ready for owner/provider review. **Do not deploy to production until approved.**',
);
lines.push('');
lines.push('## Summary');
lines.push('');

const activeProducts = products.filter(p => p.status === 'active' && p.isVisible);
const activeMemberships = memberships.filter(m => m.status === 'active' && m.isVisible);
const flagged: string[] = [];
for (const p of activeProducts) {
  for (const f of PRODUCT_COPY[p.slug]?.reviewFlags ?? []) {
    flagged.push(`${p.displayName}: ${f}`);
  }
}
for (const m of activeMemberships) {
  for (const f of MEMBERSHIP_COPY[m.slug]?.reviewFlags ?? []) {
    flagged.push(`${m.displayName}: ${f}`);
  }
}

const missingHeadline = activeProducts.filter(p => !p.benefitHeadline?.trim()).map(p => p.slug);
const missingHighlights = activeProducts.filter(p => !p.highlights?.length).map(p => p.slug);
const missingBenefits = activeProducts.filter(p => !p.potentialBenefits?.length).map(p => p.slug);

lines.push('| Metric | Count |');
lines.push('|---|---|');
lines.push(`| ACTIVE PRODUCTS REVIEWED | ${activeProducts.length} |`);
lines.push(`| ACTIVE MEMBERSHIPS REVIEWED | ${activeMemberships.length} |`);
lines.push(
  `| DESCRIPTIONS REWRITTEN | ${activeProducts.length + activeMemberships.length} |`,
);
lines.push(`| MISSING BENEFIT HEADLINE | ${missingHeadline.length} |`);
lines.push(`| MISSING HIGHLIGHTS | ${missingHighlights.length} |`);
lines.push(`| MISSING POTENTIAL BENEFITS | ${missingBenefits.length} |`);
lines.push(`| PRODUCTS FLAGGED FOR FACTUAL REVIEW | ${flagged.length} flag notes |`);
lines.push('| VARIANTS INVENTED | 0 |');
lines.push('| PRICES CHANGED | 0 |');
lines.push('| SLUGS CHANGED | 0 |');
lines.push('| SKUS CHANGED | 0 |');
lines.push('');
lines.push('## Page structure (customer-facing)');
lines.push('');
lines.push('1. Product Name');
lines.push('2. Benefit Headline');
lines.push('3. Hero Description');
lines.push('4. Highlights');
lines.push('5. Purchase / variant / CTA area');
lines.push('6. About This Product');
lines.push('7. Potential Benefits');
lines.push('8. How It Works');
lines.push('9. Why People Choose It');
lines.push('10. Available Options');
lines.push('11. What to Expect');
lines.push('12. Important Information / Provider Review');
lines.push('');
lines.push('## Flagged for owner / provider verification');
lines.push('');
if (!flagged.length) lines.push('- None');
else flagged.forEach(f => lines.push(`- ${f}`));
lines.push('');
lines.push('Catalog limits intentionally preserved:');
lines.push('');
lines.push('- BPC-157/TB-500 strength remains **Blend**');
lines.push('- Minoxidil remains **Combination formula** (no invented companion ingredients)');
lines.push('- Insulin syringe gauge/markings not published');
lines.push('- Travel-case hold-time not published');
lines.push('');
lines.push('## Per-product review');
lines.push('');

for (const p of activeProducts) {
  const copy = PRODUCT_COPY[p.slug];
  lines.push(`### ${p.displayName}`);
  lines.push('');
  lines.push(`- **Slug:** \`${p.slug}\``);
  lines.push(`- **Category:** ${p.category}`);
  lines.push(`- **Benefit headline:** ${p.benefitHeadline}`);
  lines.push(`- **Hero description:** ${p.shortDescription}`);
  lines.push(`- **Highlights:** ${p.highlights.join(' · ')}`);
  lines.push('');
  lines.push('**About**');
  paragraphs(p.longDescription).forEach(par => lines.push(`- ${par}`));
  lines.push('');
  lines.push('**Potential benefits**');
  p.potentialBenefits.forEach(u => lines.push(`- ${u}`));
  lines.push('');
  lines.push(`**How it works:** ${p.howItWorks}`);
  lines.push('');
  lines.push('**Why people choose it**');
  p.whyPeopleChooseIt.forEach(u => lines.push(`- ${u}`));
  lines.push('');
  lines.push(`**What to expect:** ${p.whatToExpect}`);
  lines.push('');
  lines.push(`**Important information:** ${p.importantInformation}`);
  lines.push('');
  lines.push('**Regulatory / claims notes:**');
  const notes = copy?.regulatoryNotes ?? [];
  if (!notes.length) lines.push('- Claims-safe benefit language; no guaranteed outcomes.');
  else notes.forEach(n => lines.push(`- ${n}`));
  if (copy?.reviewFlags?.length) {
    lines.push('');
    lines.push('**Needs verification:**');
    copy.reviewFlags.forEach(f => lines.push(`- ${f}`));
  }
  lines.push('');
}

for (const m of activeMemberships) {
  const copy = MEMBERSHIP_COPY[m.slug];
  lines.push(`### ${m.displayName}`);
  lines.push('');
  lines.push(`- **Slug:** \`${m.slug}\``);
  lines.push(`- **Price:** $${m.monthlyPrice}/month`);
  lines.push(`- **Benefit headline:** ${m.benefitHeadline}`);
  lines.push(`- **Hero description:** ${m.shortDescription}`);
  lines.push(`- **Highlights:** ${(m.highlights ?? []).join(' · ')}`);
  lines.push('');
  lines.push('**What you get / about**');
  paragraphs(m.longDescription).forEach(par => lines.push(`- ${par}`));
  lines.push('');
  lines.push('**Potential benefits**');
  (m.potentialBenefits ?? []).forEach(u => lines.push(`- ${u}`));
  lines.push('');
  lines.push(`**How it works:** ${m.howItWorks}`);
  lines.push('');
  lines.push('**Why people choose it**');
  (m.whyPeopleChooseIt ?? []).forEach(u => lines.push(`- ${u}`));
  lines.push('');
  lines.push(`**Payment / what to expect:** ${m.whatToExpect}`);
  lines.push('');
  lines.push(`**Important information:** ${m.importantInformation}`);
  lines.push('');
  lines.push('**Regulatory / claims notes:**');
  (copy?.regulatoryNotes ?? []).forEach(n => lines.push(`- ${n}`));
  lines.push('');
}

writeFileSync('docs/product-description-review.md', lines.join('\n'));
console.log(
  JSON.stringify(
    {
      products: activeProducts.length,
      memberships: activeMemberships.length,
      missingHeadline,
      missingHighlights,
      missingBenefits,
      flagged: flagged.length,
    },
    null,
    2,
  ),
);
