// Pure Stripe-sync PLANNER. Produces the dry-run change plan without contacting
// Stripe and without any secret. The same planner is used by the CLI dry-run,
// the admin "Preview Stripe Sync" screen, and the actual sync executor.
import { syncableProducts, syncableMemberships, type Environment } from './catalog';
import { priceFingerprint, productFingerprint, type PriceIdentity } from './fingerprint';

export type PlanOp =
  | 'create_product'
  | 'update_product'
  | 'create_price'
  | 'reuse_price'
  | 'archive_price';

export interface PlanItem {
  entityType: 'product' | 'membership';
  slug: string;
  entityName: string;
  variantKey?: string;
  op: PlanOp;
  amountCents?: number;
  currency?: string;
  billingType?: 'one_time' | 'recurring';
  billingInterval?: 'month' | null;
  fingerprint?: string;
  existingStripeProductId?: string;
  existingStripePriceId?: string;
  willArchivePriceId?: string;
  note?: string;
}

export interface ExistingStripeState {
  /** slug -> existing test Stripe product id */
  productIdBySlug: Record<string, string | undefined>;
  /** priceFingerprint -> existing active price id */
  priceIdByFingerprint: Record<string, string | undefined>;
  /** `${slug}::${variantKey}` -> current linked price + amount (to detect amount change) */
  currentPrice: Record<string, { priceId: string; amountCents: number } | undefined>;
}

export const emptyState = (): ExistingStripeState => ({
  productIdBySlug: {},
  priceIdByFingerprint: {},
  currentPrice: {},
});

function priceItems(
  entityType: 'product' | 'membership',
  slug: string,
  entityName: string,
  variantKey: string,
  identity: PriceIdentity,
  environment: Environment,
  existing: ExistingStripeState,
): PlanItem[] {
  const items: PlanItem[] = [];
  const fp = priceFingerprint(identity, environment);
  const existingId = existing.priceIdByFingerprint[fp];
  const currentKey = `${slug}::${variantKey}`;
  const current = existing.currentPrice[currentKey];

  const base = {
    entityType,
    slug,
    entityName,
    variantKey: variantKey || undefined,
    amountCents: identity.amountCents,
    currency: identity.currency,
    billingType: identity.billingType,
    billingInterval: identity.billingInterval,
    fingerprint: fp,
  } as const;

  if (existingId) {
    items.push({ ...base, op: 'reuse_price', existingStripePriceId: existingId, note: 'Matching active Price exists; reuse.' });
    return items;
  }

  // New Price needed. Never overwrite an existing amount — create a new Price.
  const willArchive = current && current.amountCents !== identity.amountCents ? current.priceId : undefined;
  items.push({
    ...base,
    op: 'create_price',
    willArchivePriceId: willArchive,
    note: willArchive
      ? 'Amount changed → create NEW Price; archive the previous Price only AFTER the new one is stored.'
      : 'No matching active Price → create new Price.',
  });
  if (willArchive) {
    items.push({
      entityType, slug, entityName, variantKey: variantKey || undefined,
      op: 'archive_price', existingStripePriceId: willArchive,
      note: 'Archive previous Price after replacement is created & stored. Never deleted; existing subscriptions untouched.',
    });
  }
  return items;
}

export function buildSyncPlan(environment: Environment, existing: ExistingStripeState = emptyState()): PlanItem[] {
  const plan: PlanItem[] = [];

  // Products + one-time variant prices
  for (const p of syncableProducts()) {
    const existingProductId = existing.productIdBySlug[p.slug];
    plan.push({
      entityType: 'product',
      slug: p.slug,
      entityName: p.displayName,
      op: existingProductId ? 'update_product' : 'create_product',
      existingStripeProductId: existingProductId,
      fingerprint: productFingerprint(p.slug, environment),
      note: existingProductId ? 'Product exists; update safe metadata (name/description/active/images).' : 'Create Stripe test Product.',
    });
    for (const v of p.variants.filter(v => v.isActive)) {
      plan.push(...priceItems('product', p.slug, `${p.displayName} — ${v.displayName}`, v.variantKey, {
        entityType: 'product',
        slug: p.slug,
        variantKey: v.variantKey,
        amountCents: v.priceCents,
        currency: v.currency,
        billingType: 'one_time',
        billingInterval: null,
      }, environment, existing));
    }
  }

  // Memberships: exactly ONE recurring monthly price each (no per-dose prices)
  for (const m of syncableMemberships()) {
    const existingProductId = existing.productIdBySlug[m.slug];
    plan.push({
      entityType: 'membership',
      slug: m.slug,
      entityName: m.displayName,
      op: existingProductId ? 'update_product' : 'create_product',
      existingStripeProductId: existingProductId,
      fingerprint: productFingerprint(m.slug, environment),
      note: existingProductId ? 'Membership product exists; update safe metadata.' : 'Create Stripe test Product for membership.',
    });
    plan.push(...priceItems('membership', m.slug, m.displayName, '', {
      entityType: 'membership',
      slug: m.slug,
      variantKey: '',
      amountCents: m.monthlyPriceCents,
      currency: m.currency,
      billingType: 'recurring',
      billingInterval: 'month',
    }, environment, existing));
  }

  return plan;
}

export interface PlanSummary {
  createProducts: number;
  updateProducts: number;
  createPrices: number;
  reusePrices: number;
  archivePrices: number;
  total: number;
}

export function summarizePlan(plan: PlanItem[]): PlanSummary {
  return {
    createProducts: plan.filter(i => i.op === 'create_product').length,
    updateProducts: plan.filter(i => i.op === 'update_product').length,
    createPrices: plan.filter(i => i.op === 'create_price').length,
    reusePrices: plan.filter(i => i.op === 'reuse_price').length,
    archivePrices: plan.filter(i => i.op === 'archive_price').length,
    total: plan.length,
  };
}
