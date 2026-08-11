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
  it('has exactly 50 retail SKUs and 2 membership program SKUs', () => {
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

  it('does not assign SKUs to future/hidden products or inactive memberships', () => {
    const future = products.filter(p => p.status === 'future' || !p.isVisible);
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
  it('maps Semaglutide membership doses to retail WM SKUs', () => {
    expect(resolveMembershipFulfillmentSku('m1', '0.5mg')).toEqual({
      programSku: 'MBM-MEM-SEM-MEM-001',
      fulfillmentSku: 'MBM-WM-SEM-INJ-001',
      fulfillmentVariantId: 'semaglutide-v1',
    });
    expect(resolveMembershipFulfillmentSku('m1', '1mg')?.fulfillmentSku).toBe(
      'MBM-WM-SEM-INJ-002',
    );
    expect(resolveMembershipFulfillmentSku('m1', '2.5mg')?.fulfillmentSku).toBe(
      'MBM-WM-SEM-INJ-003',
    );
    expect(resolveMembershipFulfillmentSku('m1', '5mg')?.fulfillmentSku).toBe(
      'MBM-WM-SEM-INJ-004',
    );
  });

  it('maps Tirzepatide membership doses to retail WM SKUs', () => {
    expect(resolveMembershipFulfillmentSku('m2', '2.5mg')?.fulfillmentSku).toBe(
      'MBM-WM-TIR-INJ-001',
    );
    expect(resolveMembershipFulfillmentSku('m2', '7.5mg')?.fulfillmentSku).toBe(
      'MBM-WM-TIR-INJ-002',
    );
    expect(resolveMembershipFulfillmentSku('m2', '12.5mg')?.fulfillmentSku).toBe(
      'MBM-WM-TIR-INJ-003',
    );
    expect(resolveMembershipFulfillmentSku('m2', '15mg')?.fulfillmentSku).toBe(
      'MBM-WM-TIR-INJ-004',
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
