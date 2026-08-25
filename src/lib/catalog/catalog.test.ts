import { describe, it, expect } from 'vitest';
import {
  catalogProducts, syncableProducts, syncableMemberships, toCents,
} from './catalog';
import { validateCatalog } from './validate';
import { buildSyncPlan, summarizePlan, emptyState, type ExistingStripeState } from './syncPlan';
import { priceFingerprint, productFingerprint, idempotencyKey, stableHash } from './fingerprint';

describe('catalog normalization', () => {
  it('has 3 syncable launch-ready wellness families; held + review-hold + future excluded', () => {
    expect(syncableProducts()).toHaveLength(3);
    expect(catalogProducts.length).toBeGreaterThan(3);
    const slugs = syncableProducts().map(p => p.slug);
    expect(slugs).toContain('semaglutide');
    expect(slugs).toContain('tirzepatide');
    expect(slugs).toContain('nad-plus');
    expect(slugs).not.toContain('tesamorelin');
    expect(slugs).not.toContain('fat-burner');
    expect(slugs).not.toContain('sermorelin');
    expect(slugs).not.toContain('minoxidil-tablets');
    expect(slugs).not.toContain('tretinoin-cream');
    expect(slugs).not.toContain('bimatoprost-solution');
    const held = catalogProducts.filter(p => ['tesamorelin', 'fat-burner'].includes(p.slug));
    expect(held).toHaveLength(2);
    for (const p of held) {
      expect(p.status).toBe('active');
      expect(p.isVisible).toBe(false);
    }
  });

  it('stores money as integer cents and preserves fractional dollars', () => {
    for (const p of catalogProducts) {
      expect(Number.isInteger(p.startingPriceCents)).toBe(true);
      for (const v of p.variants) expect(Number.isInteger(v.priceCents)).toBe(true);
    }
    expect(toCents(189.02)).toBe(18902);
    expect(toCents(258.99)).toBe(25899);
    expect(toCents(138.98)).toBe(13898);
    const sema = syncableProducts().find(p => p.slug === 'semaglutide')!;
    expect(sema.variants.map(v => v.priceCents)).toEqual([
      8900, 10900, 10900, 8900, 8900, 10900, 10900, 8900,
    ]);
  });

  it('exposes exactly 2 syncable memberships at $149 and $275, monthly recurring', () => {
    const mems = syncableMemberships();
    expect(mems).toHaveLength(2);
    const sema = mems.find(m => m.slug === 'semaglutide-membership')!;
    const tirz = mems.find(m => m.slug === 'tirzepatide-membership')!;
    expect(sema.monthlyPriceCents).toBe(14900);
    expect(tirz.monthlyPriceCents).toBe(27500);
    expect(sema.billingInterval).toBe('month');
    expect(tirz.billingInterval).toBe('month');
    expect(sema.initialTermMonths).toBe(3);
    expect(tirz.initialTermMonths).toBe(3);
  });

  it('Tirzepatide membership caps at 15mg and excludes 30mg', () => {
    const tirz = syncableMemberships().find(m => m.slug === 'tirzepatide-membership')!;
    expect(tirz.maximumIncludedFormulation).toBe('15mg');
    expect(tirz.includedFormulations.some(f => f.startsWith('30mg'))).toBe(false);
  });

  it('no membership guarantees a prescription', () => {
    for (const m of syncableMemberships()) expect(m.prescriptionGuaranteed).toBe(false);
  });
});

describe('validation', () => {
  it('passes with no errors', () => {
    expect(validateCatalog().errors).toEqual([]);
  });

  it('flags negative price, duplicate slug, missing alt, and prescription guarantee', () => {
    const bad = validateCatalog(
      [{
        appId: 'x', slug: 'dup', displayName: '', shortName: '', subtitle: '', category: '',
        dosageFormSummary: '', shortDescription: '', longDescription: '', imageUrl: '', imageAlt: '',
        startingPriceCents: 0, currency: 'usd', status: 'active', isVisible: true,
        requiresProviderReview: true, requiresPrescription: true, requiresComplianceReview: true, requiresPharmacyVerification: true,
        autoRefillEligible: true, memberPricingEligible: true, excludedFromDiscounts: false,
        variants: [{ variantKey: 'v', displayName: 'v', dosageForm: 'Injection', strength: '', size: '', priceCents: -5, currency: 'usd', billingType: 'one_time', billingInterval: null, isActive: true, sortOrder: 0 }],
      }, {
        appId: 'y', slug: 'dup', displayName: 'Y', shortName: 'Y', subtitle: '', category: 'cat',
        dosageFormSummary: '', shortDescription: '', longDescription: '', imageUrl: '', imageAlt: 'alt',
        startingPriceCents: 100, currency: 'usd', status: 'active', isVisible: true,
        requiresProviderReview: true, requiresPrescription: true, requiresComplianceReview: true, requiresPharmacyVerification: true,
        autoRefillEligible: true, memberPricingEligible: true, excludedFromDiscounts: false,
        variants: [],
      }],
      [],
    );
    expect(bad.errors.some(e => /Negative price/.test(e))).toBe(true);
    expect(bad.errors.some(e => /Duplicate product slug/.test(e))).toBe(true);
    expect(bad.errors.some(e => /missing a name|missing a category/.test(e))).toBe(true);
    expect(bad.errors.some(e => /no image alt text/.test(e))).toBe(true);
  });
});

describe('fingerprints & idempotency', () => {
  it('is deterministic and amount-sensitive', () => {
    const base = { entityType: 'product' as const, slug: 's', variantKey: 'v1', amountCents: 14900, currency: 'usd', billingType: 'one_time' as const, billingInterval: null };
    expect(priceFingerprint(base, 'test')).toBe(priceFingerprint(base, 'test'));
    expect(priceFingerprint(base, 'test')).not.toBe(priceFingerprint({ ...base, amountCents: 15900 }, 'test'));
    expect(priceFingerprint(base, 'test')).not.toBe(priceFingerprint(base, 'live'));
    expect(idempotencyKey('price', priceFingerprint(base, 'test'))).toBe(idempotencyKey('price', priceFingerprint(base, 'test')));
    expect(stableHash('a')).toBe(stableHash('a'));
    expect(productFingerprint('semaglutide', 'test')).toContain('semaglutide');
  });
});

describe('sync plan', () => {
  it('first sync creates 5 Stripe products (3 launch-ready wellness families + 2 memberships)', () => {
    const plan = buildSyncPlan('test', emptyState());
    const s = summarizePlan(plan);
    expect(s.createProducts).toBe(5); // 3 products + 2 memberships
    expect(s.reusePrices).toBe(0);
    expect(s.archivePrices).toBe(0);
    // exactly one recurring membership price each
    const recurringCreates = plan.filter(i => i.op === 'create_price' && i.billingType === 'recurring');
    expect(recurringCreates).toHaveLength(2);
    expect(recurringCreates.map(i => i.amountCents).sort()).toEqual([14900, 27500]);
  });

  it('reuses product + price when they already exist (idempotent)', () => {
    const state: ExistingStripeState = emptyState();
    // seed existing state as if a prior sync ran
    const first = buildSyncPlan('test', emptyState());
    for (const item of first) {
      if (item.op === 'create_product') state.productIdBySlug[item.slug] = `prod_${item.slug}`;
    }
    for (const item of first) {
      if (item.op === 'create_price' && item.fingerprint) {
        state.priceIdByFingerprint[item.fingerprint] = `price_${item.slug}_${item.variantKey ?? ''}`;
        state.currentPrice[`${item.slug}::${item.variantKey ?? ''}`] = { priceId: `price_${item.slug}`, amountCents: item.amountCents! };
      }
    }
    const plan = buildSyncPlan('test', state);
    const s = summarizePlan(plan);
    expect(s.createProducts).toBe(0);
    expect(s.updateProducts).toBe(5);
    expect(s.createPrices).toBe(0);
    expect(s.reusePrices).toBeGreaterThan(0);
    expect(s.archivePrices).toBe(0);
  });

  it('creates a NEW price and archives the old when an amount changes (never overwrites)', () => {
    const state = emptyState();
    state.productIdBySlug['semaglutide'] = 'prod_sema';
    // A stale current price at a different amount, with no matching fingerprint for the new amount
    state.currentPrice['semaglutide::sem-b12-starting-low'] = { priceId: 'price_old', amountCents: 13900 };
    const plan = buildSyncPlan('test', state);
    const semaV1 = plan.filter(i => i.slug === 'semaglutide' && i.variantKey === 'sem-b12-starting-low');
    const create = semaV1.find(i => i.op === 'create_price');
    const archive = semaV1.find(i => i.op === 'archive_price');
    expect(create).toBeTruthy();
    expect(create!.willArchivePriceId).toBe('price_old');
    expect(archive).toBeTruthy();
    expect(archive!.existingStripePriceId).toBe('price_old');
  });
});
