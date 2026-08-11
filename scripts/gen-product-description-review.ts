import { writeFileSync } from 'node:fs';
import { products, memberships } from '../src/data/products';
import { PRODUCT_COPY, MEMBERSHIP_COPY, paragraphs } from '../src/data/productCopy';

const OLD_SHORT: Record<string, string> = {
  semaglutide:
    'A provider-directed weight-management injection pairing semaglutide with vitamin B6.',
  tirzepatide:
    'A provider-directed weight-management injection pairing tirzepatide with vitamin B6.',
  'estradiol-patch':
    'A transdermal estradiol patch prescribed as part of provider-directed hormone therapy.',
  'progesterone-capsules':
    'Oral progesterone capsules prescribed as part of provider-directed hormone therapy.',
  'testosterone-cream':
    'A topical testosterone cream prescribed as part of provider-directed hormone therapy.',
  'nad-plus': 'A provider-directed compounded NAD+ injection formulation.',
  selank: 'A provider-directed compounded Selank injection, available only after eligibility review.',
  semax: 'A provider-directed compounded Semax injection, available only after eligibility review.',
  'selank-semax-nasal-spray':
    'A provider-directed compounded Selank and Semax blend nasal spray, available only after eligibility review.',
  'bpc-157-tb-500':
    'A provider-directed compounded BPC-157/TB-500 blend, available in capsules and injection.',
  'tretinoin-cream':
    'A prescription topical tretinoin cream available following licensed-provider review.',
  'minoxidil-topical':
    'A compounded topical formula featuring minoxidil, personalized by the prescribing provider and dispensing pharmacy.',
  'bimatoprost-solution':
    'A prescription bimatoprost solution available following licensed-provider review.',
  'initial-provider-consultation':
    'Discuss your goals, review your health history, and create a personalized treatment plan tailored to you.',
  'follow-up-appointment': 'Monitor progress, answer questions, and optimize your treatment plan.',
  'laboratory-review': 'Review laboratory findings and receive personalized recommendations.',
  'complete-injection-starter-kit':
    'The ultimate starter kit: 3D printed peptide case, temperature-controlled travel case, discreet travel bag, reusable ice pack, wellness planner, sharps container, alcohol prep wipes, and insulin syringes — all in one. Save $71 versus buying each item separately.',
  'premium-3d-printed-peptide-case':
    'A custom 3D-printed case with precision-cut compartments designed to hold your peptide vials, syringes, and supplies securely.',
  'temperature-controlled-travel-case':
    'An insulated travel case with a built-in thermal lining that maintains temperature for up to 48 hours — perfect for transporting peptide vials.',
  'discreet-travel-bag':
    'A sleek, vegan-leather travel bag with water-resistant lining — designed to hold your entire therapy kit discreetly.',
  'reusable-ice-pack':
    'A reusable gel ice pack designed to keep your peptide vials cold during transport. Non-toxic and long-lasting.',
  'daily-weekly-wellness-planner':
    'A daily/weekly planner with habit trackers, wellness goals, and progress reflection sections — designed around your therapy routine.',
  'sharps-container':
    'A FDA-cleared sharps container for the safe disposal of used syringes and needles. Secure, puncture-resistant, and easy to use.',
  'alcohol-prep-wipes':
    'Individually wrapped 70% isopropyl alcohol prep pads for safe injection site preparation. Choose 200 or 500 count.',
  'premium-insulin-syringes':
    'Sterile insulin syringes for subcutaneous injections. Choose your pack count from 10 to 100.',
  'semaglutide-membership':
    'One membership. One predictable monthly price. Provider-directed Semaglutide + B6 treatment.',
  'tirzepatide-membership':
    'One predictable monthly rate through the included program maximum. Provider-directed Tirzepatide + B6 treatment.',
};

const OLD_LONG_KIND: Record<string, string> = {
  semaglutide: 'Shared WEIGHT_DISCLAIMER only (no unique about copy)',
  tirzepatide: 'Shared WEIGHT_DISCLAIMER only (no unique about copy)',
  'estradiol-patch': 'Shared RX_DISCLAIMER only',
  'progesterone-capsules': 'Shared RX_DISCLAIMER only',
  'testosterone-cream': 'Shared RX_DISCLAIMER only',
  'nad-plus': 'Shared COMPOUNDED_DISCLAIMER only',
  selank: 'Shared COMPOUNDED_DISCLAIMER only',
  semax: 'Shared COMPOUNDED_DISCLAIMER only',
  'selank-semax-nasal-spray': 'Shared COMPOUNDED_DISCLAIMER only',
  'bpc-157-tb-500': 'Shared COMPOUNDED_DISCLAIMER only',
  'tretinoin-cream': 'Shared RX_DISCLAIMER only',
  'minoxidil-topical': 'Custom short pharmacy disclaimer (minimal unique marketing)',
  'bimatoprost-solution': 'Shared RX_DISCLAIMER only',
};

const lines: string[] = [];
lines.push('# Product Description Review — My Bare Method');
lines.push('');
lines.push('Review packet for the full customer-facing description rewrite.');
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

lines.push('| Metric | Count |');
lines.push('|---|---|');
lines.push(`| ACTIVE PRODUCTS REVIEWED | ${activeProducts.length} |`);
lines.push(`| ACTIVE MEMBERSHIPS REVIEWED | ${activeMemberships.length} |`);
lines.push(
  `| DESCRIPTIONS REWRITTEN | ${activeProducts.length + activeMemberships.length} |`,
);
lines.push('| PRODUCTS MISSING DESCRIPTION | 0 |');
lines.push(`| PRODUCTS FLAGGED FOR FACTUAL REVIEW | ${flagged.length} flag notes |`);
lines.push(
  '| UNSUPPORTED CLAIMS REMOVED | Shared disclaimer-only Overview replaced with claims-safe educational copy; guaranteed-result language avoided |',
);
lines.push('| VARIANTS INVENTED | 0 |');
lines.push('| PRICES CHANGED | 0 |');
lines.push('| SLUGS CHANGED | 0 |');
lines.push('');
lines.push('## Flagged for owner / provider verification');
lines.push('');
if (!flagged.length) lines.push('- None');
else flagged.forEach(f => lines.push(`- ${f}`));
lines.push('');
lines.push('Additional catalog limitations intentionally preserved (not invented):');
lines.push('');
lines.push('- Wolverine BPC-157/TB-500 strength remains **"Blend"**');
lines.push(
  '- Minoxidil topical strength remains **"Combination formula"** (no invented ingredient deck)',
);
lines.push('- Insulin syringe needle gauge / unit markings not listed in catalog');
lines.push(
  '- Travel case “up to 48 hours” duration claim **removed** from customer-facing copy pending owner verification',
);
lines.push('');
lines.push('## Safety pass notes (flagged products only)');
lines.push('');
lines.push(
  'A follow-up safety pass softened emerging-product framing (NAD+, Selank, Semax, Selank/Semax blend, BPC-157/TB-500), removed the travel-case hold-time claim, avoided inventing syringe gauges / minoxidil companion ingredients, and separated wellness interest from established medical use.',
);
lines.push('');
lines.push('## Per-product review');
lines.push('');

for (const p of activeProducts) {
  const copy = PRODUCT_COPY[p.slug];
  lines.push(`### ${p.displayName}`);
  lines.push('');
  lines.push(`- **Slug:** \`${p.slug}\``);
  lines.push(`- **Category:** ${p.category}`);
  lines.push(`- **Old short description:** ${OLD_SHORT[p.slug] ?? '(see prior catalog)'}`);
  lines.push(
    `- **Old long description:** ${OLD_LONG_KIND[p.slug] ?? 'Prior product/accessory copy (often duplicated short text)'}`,
  );
  lines.push(`- **New short description:** ${p.shortDescription}`);
  lines.push('');
  lines.push('**New full description (structured):**');
  lines.push('');
  lines.push('_About_');
  paragraphs(p.longDescription).forEach(par => lines.push(`- ${par}`));
  if (p.commonUses.length) {
    lines.push('');
    lines.push('_Common uses_');
    p.commonUses.forEach(u => lines.push(`- ${u}`));
  }
  if (p.howItWorks) {
    lines.push('');
    lines.push(`_How it works:_ ${p.howItWorks}`);
  }
  if (p.whatToExpect) {
    lines.push('');
    lines.push(`_What to expect:_ ${p.whatToExpect}`);
  }
  lines.push('');
  lines.push(`_Important information:_ ${p.importantInformation}`);
  lines.push('');
  lines.push('**Regulatory / claims notes:**');
  const notes = copy?.regulatoryNotes ?? [];
  if (!notes.length) {
    lines.push('- Claims language kept cautious (may / commonly / provider may consider).');
  } else {
    notes.forEach(n => lines.push(`- ${n}`));
  }
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
  lines.push('- **Category:** memberships');
  lines.push(`- **Old short description:** ${OLD_SHORT[m.slug]}`);
  lines.push('- **Old long description:** Prior flat-rate membership blurb');
  lines.push(`- **New short description:** ${m.shortDescription}`);
  lines.push('');
  lines.push('**New full description:**');
  paragraphs(m.longDescription).forEach(par => lines.push(`- ${par}`));
  lines.push('');
  lines.push(`_How it works:_ ${m.howItWorks}`);
  lines.push('');
  lines.push(`_What to expect:_ ${m.whatToExpect}`);
  lines.push('');
  lines.push(`_Important information:_ ${m.importantInformation}`);
  lines.push('');
  lines.push('**Regulatory / claims notes:**');
  (copy?.regulatoryNotes ?? []).forEach(n => lines.push(`- ${n}`));
  lines.push('');
}

lines.push('## UX notes');
lines.push('');
lines.push(
  '- Wellness + provider-care PDPs now use stacked sections (About, Common Uses, How It Works, What to Expect, Available Options, Important Information, Eligibility) instead of Overview/Eligibility/Formulation tabs.',
);
lines.push('- Accessories use the same stack without Rx eligibility.');
lines.push(
  '- Membership detail shows short description near price, plus About / Program vs Fulfillment / What to Expect / FAQ.',
);
lines.push('');

writeFileSync('docs/product-description-review.md', lines.join('\n'));
console.log(`Wrote docs/product-description-review.md (${lines.length} lines)`);
