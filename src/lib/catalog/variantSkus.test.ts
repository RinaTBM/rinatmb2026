import { describe, expect, it } from 'vitest';
import { products, memberships } from '../../data/products';
import {
  EXPECTED_MEMBERSHIP_PROGRAM_SKU_COUNT,
  EXPECTED_RETAIL_SKU_COUNT,
  EXPECTED_TOTAL_SKU_COUNT,
  MEMBERSHIP_PROGRAM_SKU_BY_APP_ID,
  SKU_PATTERN,
  VARIANT_SKU_BY_ID,
} from '../../data/variantSkus';
import {
  MEMBERSHIP_FULFILLMENT_CROSSWALK,
  resolveMembershipFulfillmentSku,
} from './membershipSkuCrosswalk';

describe('variant SKU registry', () => {
  it('has retail SKUs covering historical rows plus cutover family variants', () => {
    expect(Object.keys(VARIANT_SKU_BY_ID)).toHaveLength(EXPECTED_RETAIL_SKU_COUNT);
    expect(Object.keys(MEMBERSHIP_PROGRAM_SKU_BY_APP_ID)).toHaveLength(
      EXPECTED_MEMBERSHIP_PROGRAM_SKU_COUNT,
    );
    const all = [
      ...Object.values(VARIANT_SKU_BY_ID),
      ...Object.values(MEMBERSHIP_PROGRAM_SKU_BY_APP_ID),
    ];
    expect(all).toHaveLength(EXPECTED_TOTAL_SKU_COUNT);
    expect(new Set(all).size).toBe(EXPECTED_TOTAL_SKU_COUNT);
  });

  it('matches SKU format for every assigned code', () => {
    const all = [
      ...Object.values(VARIANT_SKU_BY_ID),
      ...Object.values(MEMBERSHIP_PROGRAM_SKU_BY_APP_ID),
    ];
    for (const sku of all) {
      expect(sku).toMatch(SKU_PATTERN);
    }
  });

  it('assigns a SKU to every active visible selectable product variant', () => {
    const active = products.filter(p => p.status === 'active' && p.isVisible);
    const missing: string[] = [];
    for (const p of active) {
      for (const v of p.variants) {
        if (!v.sku) missing.push(`${p.slug}/${v.id}`);
        else expect(v.sku).toBe(VARIANT_SKU_BY_ID[v.id]);
      }
    }
    expect(missing).toEqual([]);
  });

  it('keeps Tesamorelin and Fat Burner visible for browse while checkout stays unready', () => {
    const published = products.filter(p => ['tesamorelin', 'fat-burner'].includes(p.slug));
    expect(published).toHaveLength(2);
    const tesa = published.find(p => p.slug === 'tesamorelin')!;
    const fat = published.find(p => p.slug === 'fat-burner')!;
    for (const p of published) {
      expect(p.status).toBe('active');
      expect(p.isVisible).toBe(true);
    }
    expect(tesa.variants[0].sku).toBe('MBM-LON-TESA-INJ-001');
    expect(tesa.variants[0].price).toBe(149);
    expect(fat.variants[0].sku).toBe('MBM-WM-FB3-INJ-001');
    expect(fat.variants[0].price).toBe(259);
  });

  it('does not assign SKUs to future products or inactive memberships', () => {
    const future = products.filter(p => p.status === 'future');
    for (const p of future) {
      for (const v of p.variants) {
        expect(v.sku).toBeUndefined();
        expect(VARIANT_SKU_BY_ID[v.id]).toBeUndefined();
      }
    }
    const elite = memberships.find(m => m.slug === 'elite-wellness-membership');
    expect(elite?.status).toBe('inactive');
    expect(elite?.programSku).toBeUndefined();
  });

  it('excludes obsolete Tirzepatide 30mg from registry and membership', () => {
    expect(Object.values(VARIANT_SKU_BY_ID).some(s => s.includes('030'))).toBe(false);
    const tirz = memberships.find(m => m.slug === 'tirzepatide-membership');
    expect(tirz?.includedFormulations.some(f => f.includes('30mg'))).toBe(false);
  });
});

describe('membership PROGRAM vs FULFILLMENT crosswalk', () => {
  it('maps Semaglutide membership requested formulation to Any Dose family SKUs', () => {
    expect(resolveMembershipFulfillmentSku('m1', 'Vitamin B12')).toEqual({
      programSku: 'MBM-MEM-SEM-MEM-001',
      fulfillmentSku: 'MBM-WM-SEM-B12-004',
      fulfillmentVariantId: 'sem-b12-any-dose',
    });
    expect(resolveMembershipFulfillmentSku('m1', 'Glycine')?.fulfillmentSku).toBe(
      'MBM-WM-SEM-GLY-004',
    );
  });

  it('maps Tirzepatide membership requested formulation to Any Dose family SKUs', () => {
    expect(resolveMembershipFulfillmentSku('m2', 'Vitamin B12')?.fulfillmentSku).toBe(
      'MBM-WM-TIR-B12-004',
    );
    expect(resolveMembershipFulfillmentSku('m2', 'Glycine')?.fulfillmentSku).toBe(
      'MBM-WM-TIR-GLY-004',
    );
  });

  it('does not invent separate membership-medication SKUs', () => {
    for (const row of MEMBERSHIP_FULFILLMENT_CROSSWALK) {
      expect(row.programSku.startsWith('MBM-MEM-')).toBe(true);
      expect(row.fulfillmentSku.startsWith('MBM-WM-')).toBe(true);
      expect(row.fulfillmentSku).not.toMatch(/^MBM-MEM-.*-INJ-/);
    }
  });

  it('attaches programSku on active memberships only', () => {
    expect(memberships.find(m => m.checkoutProductId === 'm1')?.programSku).toBe(
      'MBM-MEM-SEM-MEM-001',
    );
    expect(memberships.find(m => m.checkoutProductId === 'm2')?.programSku).toBe(
      'MBM-MEM-TIR-MEM-001',
    );
  });
});
