/*
 * Verify the Stripe TEST catalog — `npm run stripe:verify:test`.
 * Confirms products/prices exist, membership amounts are correct, and no duplicate
 * active Products/Prices were created. Requires STRIPE_SECRET_KEY_TEST. Live keys refused.
 */
import { syncableProducts, syncableMemberships } from '../src/lib/catalog/catalog';
import { StripeTestClient, LiveKeyRefusedError } from '../src/lib/catalog/stripeClient';

const ENV = 'test';
// Prefer STRIPE_SECRET_KEY_TEST; fall back to STRIPE_SECRET_KEY. Live keys are refused
// by the StripeTestClient guard, so there is no live-key fallback path.
const key = process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY;

async function main() {
  if (!key) {
    console.error('STRIPE_SECRET_KEY_TEST is not set — cannot verify against Stripe. No changes made.');
    process.exit(1);
  }
  let client: StripeTestClient;
  try { client = new StripeTestClient(key); }
  catch (e) { if (e instanceof LiveKeyRefusedError) { console.error(e.message); process.exit(2); } throw e; }

  const problems: string[] = [];
  console.log('Stripe TEST verification');
  console.log('========================');

  for (const p of syncableProducts()) {
    const found = (await client.searchProductsByMetadata(p.slug, ENV)).filter(x => x.active);
    if (found.length === 0) { problems.push(`Missing test Product for ${p.slug}`); continue; }
    if (found.length > 1) problems.push(`Duplicate active test Products for ${p.slug} (${found.length})`);
    const prices = await client.listActivePrices(found[0].id);
    for (const v of p.variants.filter(v => v.isActive)) {
      const matches = prices.filter(pr => pr.unit_amount === v.priceCents && !pr.recurring && pr.currency === v.currency && pr.metadata?.catalog_variant_key === v.variantKey);
      if (matches.length === 0) problems.push(`Missing test Price for ${p.slug}/${v.variantKey} (${v.priceCents})`);
      if (matches.length > 1) problems.push(`Duplicate active test Prices for ${p.slug}/${v.variantKey}`);
    }
    console.log(`  ${p.slug}: product ${found[0].id}, ${p.variants.length} variant price(s) checked`);
  }

  for (const m of syncableMemberships()) {
    const found = (await client.searchProductsByMetadata(m.slug, ENV)).filter(x => x.active);
    if (found.length === 0) { problems.push(`Missing test Product for membership ${m.slug}`); continue; }
    if (found.length > 1) problems.push(`Duplicate active test Products for membership ${m.slug}`);
    const prices = await client.listActivePrices(found[0].id);
    const recurring = prices.filter(pr => pr.recurring?.interval === 'month' && pr.unit_amount === m.monthlyPriceCents);
    if (recurring.length === 0) problems.push(`Missing $${m.monthlyPriceCents / 100}/mo test Price for ${m.slug}`);
    if (recurring.length > 1) problems.push(`Duplicate monthly test Prices for ${m.slug}`);
    if (prices.filter(pr => pr.recurring).length > 1) problems.push(`Membership ${m.slug} has more than one recurring Price (must be exactly one).`);
    console.log(`  ${m.slug}: product ${found[0].id}, monthly price ${recurring[0]?.id ?? 'MISSING'}`);
  }

  console.log('');
  if (problems.length) {
    console.log(`VERIFICATION FAILED (${problems.length}):`);
    problems.forEach(p => console.log(`  ✗ ${p}`));
    process.exit(1);
  }
  console.log('VERIFICATION PASSED — all active products/variants and both memberships have correct test Stripe objects; no duplicates.');
}

main().catch(err => { console.error('Verify failed:', err instanceof Error ? err.message : err); process.exit(1); });
