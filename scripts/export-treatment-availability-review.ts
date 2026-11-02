import { mkdirSync, writeFileSync } from 'node:fs';
import { products, memberships } from '../src/data/products';
import { GEN_HOSTED_PRODUCTS } from '../src/lib/commerce/genHostedProducts';
import { unavailableStatesFor } from '../src/data/treatmentAvailability';

const rows = products.map(product => {
  const route = GEN_HOSTED_PRODUCTS[product.slug];
  const prices = product.variants.map(variant => `${variant.label}: $${variant.price.toFixed(2)}`).join('<br>');
  const hostedPrices = route?.options?.map(option => `${option.label}: $${option.price.toFixed(2)}`).join('<br>') ?? (route ? `$${route.price.toFixed(2)}` : 'Family selector / existing route');
  const states = product.variants.map(variant => `${variant.dosageForm}: ${variant.unavailableStates.join(', ')}`).filter((value, index, values) => values.indexOf(value) === index).join('<br>');
  return `| ${product.displayName} | ${product.isVisible && product.status === 'active' ? 'Visible' : 'Hidden'} | ${prices} | ${hostedPrices} | Not mirrored; unchanged | Not mirrored; unchanged | ${states} |`;
});
const membershipRows = memberships.map(product => `| ${product.displayName} | ${product.isVisible && product.status === 'active' ? 'Visible' : 'Hidden'} | $${product.monthlyPrice.toFixed(2)}/mo (existing membership record) | Existing program selector | Not mirrored; unchanged | Not mirrored; unchanged | ${unavailableStatesFor(product.slug).join(', ')} |`);
const report = `# November 2026 catalog and state-availability review

Base: deploy/ach-launch-clean-2026 at 632a8b5e7e623f5101a45787c50117af7b910e96.

Gen Health is authoritative for unavailable states, video visits and labs. This branch does not mirror per-product syncVisit or labsRequired booleans. Those requirements remain unchanged pending sections 1, 2 and 4; “not mirrored” is not false. Existing hormone-lab prompts and provider visit logic are preserved. No production API, database, payment provider or checkout URL is modified.

The table includes all catalog products, hidden entries and legacy membership records. Catalog variant prices and explicit hosted route prices are shown separately because the base branch already stores them separately; neither price source is changed by this PR. GLP-1 family selectors retain their existing prices: Semaglutide low $139, high $149, monthly $129; Tirzepatide low $259, high $279, monthly $249.

| Product | Visibility | Catalog price(s) | Hosted route price(s) | syncVisit | labsRequired | unavailableStates by form |
| --- | --- | --- | --- | --- | --- | --- |
${[...rows, ...membershipRows].join('\n')}

## Section 0 reconciliation

- Tirzepatide already uses GLP-1/GIP in this public catalog; no GLP-2 wording occurs in the public product definitions. The exact high/low/any-dose plan titles supplied by the owner are not separate public products here. No new names or prices are invented for them.
- Scream Cream is renamed to “Scream Cream: Sildenafil / Arginine / Testosterone”. Its existing catalog and hosted price are both $129 and remain unchanged. No public Papaverine wording was found.
- Estradiol's displayed short description is replaced with the supplied 0.025–0.1 mg/hr, 8-patch text. Its existing $129 entry and all other variant prices are preserved.
- MOTS-C, Pinealon / PE-22-28 / Selank Neuro-Sleep Protocol and PT-141 nasal spray are not public products in this base. Future architecture records are not activated, repriced or routed. Applying the supplied prices to a future launch needs the correct storefront product/GEN mapping.
- The no-price Semaglutide + Ondansetron and five Tirzepatide duplicate plans are absent from this public catalog. Nothing is removed by fuzzy name matching. The standalone Ondansetron product is preserved.

## Availability

- One fallback data file contains the supplied November 1, 2026 restrictions, including absent/future exception keys without publishing those treatments.
- Every other product defaults to PR unavailable; DC is available for all.
- NAD+ nasal and Wolverine capsule exceptions are form-specific. Injection alternatives retain the default rule. Catalog variants expose unavailableStates as well as their parent product.
- Cards remain visible and greyed with a badge and disabled order button. Product pages remove order actions for the unavailable state. Changing state also rechecks saved Care Basket items, including older nasal/capsule routes.
- Selector supports 50 states, DC and PR, safe localStorage persistence, memory fallback and cross-tab updates.

Regenerate this review with: pnpm exec tsx scripts/export-treatment-availability-review.ts
`;
mkdirSync('docs', { recursive: true });
writeFileSync('docs/catalog-state-availability-review-2026-11.md', report);
console.log(`Wrote ${rows.length + membershipRows.length} product/membership rows.`);
