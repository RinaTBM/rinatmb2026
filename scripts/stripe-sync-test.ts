/*
 * Stripe TEST sync CLI.
 *   npm run stripe:sync:test:dry-run   → prints the change plan (no writes, no secrets printed)
 *   npm run stripe:sync:test           → executes create/update against Stripe TEST mode
 *
 * Guarantees: TEST-only (live keys refused), idempotent (deterministic fingerprints +
 * Stripe idempotency keys), never overwrites a Price amount (creates a new Price and
 * archives the old one AFTER the replacement is stored), never deletes anything, never
 * alters subscriptions.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncableProducts, syncableMemberships } from '../src/lib/catalog/catalog';
import { buildSyncPlan, summarizePlan, emptyState, type ExistingStripeState } from '../src/lib/catalog/syncPlan';
import { priceFingerprint, productFingerprint, idempotencyKey } from '../src/lib/catalog/fingerprint';
import { StripeTestClient, LiveKeyRefusedError } from '../src/lib/catalog/stripeClient';

const ENV = 'test' as const;
const SCHEMA_VERSION = '1';
const APP = 'my-bare-method';
const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = join(__dirname, '.stripe-sync-state.test.json');

const apply = process.argv.includes('--apply');
// Prefer STRIPE_SECRET_KEY_TEST; fall back to STRIPE_SECRET_KEY. No live-key fallback:
// the StripeTestClient/assertTestKey guard refuses any live key regardless of source.
const key = process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY;

interface StateFile {
  productIdBySlug: Record<string, string>;
  priceIdByFingerprint: Record<string, string>;
  currentPrice: Record<string, { priceId: string; amountCents: number }>;
}

function loadLocalState(): ExistingStripeState {
  if (!existsSync(STATE_PATH)) return emptyState();
  try {
    const s = JSON.parse(readFileSync(STATE_PATH, 'utf-8')) as StateFile;
    return { productIdBySlug: s.productIdBySlug ?? {}, priceIdByFingerprint: s.priceIdByFingerprint ?? {}, currentPrice: s.currentPrice ?? {} };
  } catch { return emptyState(); }
}

function saveLocalState(state: ExistingStripeState) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

async function loadStripeState(client: StripeTestClient): Promise<ExistingStripeState> {
  const state = emptyState();
  const slugs = [...syncableProducts().map(p => p.slug), ...syncableMemberships().map(m => m.slug)];
  for (const slug of slugs) {
    const found = (await client.searchProductsByMetadata(slug, ENV)).filter(p => p.active);
    if (found.length === 0) continue;
    const productId = found[0].id;
    state.productIdBySlug[slug] = productId;
    const prices = await client.listActivePrices(productId);
    for (const pr of prices) {
      const fp = pr.metadata?.price_fingerprint;
      if (fp) state.priceIdByFingerprint[fp] = pr.id;
      const variantKey = pr.metadata?.catalog_variant_key ?? '';
      if (pr.unit_amount != null) state.currentPrice[`${slug}::${variantKey}`] = { priceId: pr.id, amountCents: pr.unit_amount };
    }
  }
  return state;
}

function priceMetadata(entityType: 'product' | 'membership', slug: string, variantKey: string, fp: string): Record<string, string> {
  return {
    app: APP,
    catalog_entity_type: entityType,
    catalog_entity_id: slug,
    catalog_slug: slug,
    catalog_variant_key: variantKey,
    price_fingerprint: fp,
    environment: ENV,
    schema_version: SCHEMA_VERSION,
  };
}

function printPlan(state: ExistingStripeState) {
  const plan = buildSyncPlan(ENV, state);
  const s = summarizePlan(plan);
  console.log('Stripe TEST sync — DRY RUN plan');
  console.log('==============================');
  console.log(`Environment: test | schema_version: ${SCHEMA_VERSION}`);
  console.log(`Syncable products: ${syncableProducts().length} | memberships: ${syncableMemberships().length}`);
  console.log('');
  for (const item of plan) {
    const bits = [
      item.op.toUpperCase().padEnd(15),
      item.entityType,
      item.slug + (item.variantKey ? ` / ${item.variantKey}` : ''),
      item.amountCents != null ? `${(item.amountCents / 100).toFixed(2)} ${item.currency} ${item.billingType}${item.billingInterval ? '/' + item.billingInterval : ''}` : '',
      item.existingStripeProductId ? `product=${item.existingStripeProductId}` : '',
      item.existingStripePriceId ? `price=${item.existingStripePriceId ?? ''}` : '',
      item.willArchivePriceId ? `archive=${item.willArchivePriceId}` : '',
    ].filter(Boolean).join('  ');
    console.log(`  ${bits}`);
    if (item.note) console.log(`      ${item.note}`);
  }
  console.log('');
  console.log(`Summary: create_product=${s.createProducts} update_product=${s.updateProducts} create_price=${s.createPrices} reuse_price=${s.reusePrices} archive_price=${s.archivePrices} total=${s.total}`);
  console.log('No secret values are printed.');
  return plan;
}

async function main() {
  // Determine existing state: prefer live Stripe query when a key is present.
  let client: StripeTestClient | null = null;
  if (key) {
    try { client = new StripeTestClient(key); }
    catch (e) {
      if (e instanceof LiveKeyRefusedError) { console.error(e.message); process.exit(2); }
      throw e;
    }
  }

  const state = client ? await loadStripeState(client) : loadLocalState();
  const plan = printPlan(state);

  if (!apply) {
    console.log('\nDry run only. Re-run with the test sync command to apply.');
    return;
  }

  if (!client) {
    console.error('\nSTRIPE_SECRET_KEY_TEST is not set — cannot apply. No changes were made.');
    process.exit(1);
  }

  console.log('\nApplying to Stripe TEST mode…');
  const next: ExistingStripeState = { ...state };

  // 1) Products (create or update metadata)
  const allEntities = [
    ...syncableProducts().map(p => ({ type: 'product' as const, slug: p.slug, name: p.displayName, description: p.shortDescription })),
    ...syncableMemberships().map(m => ({ type: 'membership' as const, slug: m.slug, name: m.displayName, description: m.shortDescription })),
  ];
  for (const e of allEntities) {
    const md = { app: APP, catalog_entity_type: e.type, catalog_entity_id: e.slug, catalog_slug: e.slug, environment: ENV, schema_version: SCHEMA_VERSION };
    const existingId = next.productIdBySlug[e.slug];
    if (existingId) {
      await client.updateProduct(existingId, { name: e.name, description: e.description, active: true, metadata: md });
      console.log(`  updated product ${e.slug} (${existingId})`);
    } else {
      const created = await client.createProduct({ name: e.name, description: e.description, metadata: md }, idempotencyKey('product', productFingerprint(e.slug, ENV)));
      next.productIdBySlug[e.slug] = created.id;
      console.log(`  created product ${e.slug} (${created.id})`);
    }
  }

  // 2) Prices (create new when needed; archive old AFTER new is stored)
  const priceTasks: { entityType: 'product' | 'membership'; slug: string; variantKey: string; amountCents: number; currency: string; interval: 'month' | null }[] = [];
  for (const p of syncableProducts()) {
    for (const v of p.variants.filter(v => v.isActive)) {
      priceTasks.push({ entityType: 'product', slug: p.slug, variantKey: v.variantKey, amountCents: v.priceCents, currency: v.currency, interval: null });
    }
  }
  for (const m of syncableMemberships()) {
    priceTasks.push({ entityType: 'membership', slug: m.slug, variantKey: '', amountCents: m.monthlyPriceCents, currency: m.currency, interval: 'month' });
  }

  for (const t of priceTasks) {
    const fp = priceFingerprint({ entityType: t.entityType, slug: t.slug, variantKey: t.variantKey, amountCents: t.amountCents, currency: t.currency, billingType: t.interval ? 'recurring' : 'one_time', billingInterval: t.interval }, ENV);
    if (next.priceIdByFingerprint[fp]) { console.log(`  reuse price ${t.slug}/${t.variantKey || '_'} (${next.priceIdByFingerprint[fp]})`); continue; }
    const productId = next.productIdBySlug[t.slug];
    const created = await client.createPrice({
      product: productId,
      unitAmount: t.amountCents,
      currency: t.currency,
      recurringInterval: t.interval ?? undefined,
      metadata: priceMetadata(t.entityType, t.slug, t.variantKey, fp),
    }, idempotencyKey('price', fp));
    next.priceIdByFingerprint[fp] = created.id;
    const prevKey = `${t.slug}::${t.variantKey}`;
    const prev = next.currentPrice[prevKey];
    next.currentPrice[prevKey] = { priceId: created.id, amountCents: t.amountCents };
    console.log(`  created price ${t.slug}/${t.variantKey || '_'} (${created.id})`);
    if (prev && prev.amountCents !== t.amountCents) {
      await client.archivePrice(prev.priceId);
      console.log(`    archived previous price ${prev.priceId} (amount changed)`);
    }
  }

  saveLocalState(next);
  console.log('\nApplied. Mapping saved locally (IDs only, no secrets).');
  void plan;
}

main().catch(err => { console.error('Sync failed:', err instanceof Error ? err.message : err); process.exit(1); });
