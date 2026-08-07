import { describe, expect, it } from 'vitest';
import { getProduct, visibleProducts, SLUG_ALIASES } from '../../data/products';
import {
  ACCESSORY_UNIT_QUANTITY_MAX,
  OBSOLETE_ACCESSORY_STRIPE_TEST_IDS,
  accessoryCartName,
  accessoryCartVariantLabel,
  accessoryVariantOptionLabel,
  clampAccessoryQuantity,
  isAccessoryCountProduct,
} from './accessoryPurchase';

describe('accessory catalog consolidation', () => {
  it('exposes one Alcohol Prep Wipes product with 200 and 500 Count variants', () => {
    const wipes = getProduct('alcohol-prep-wipes')!;
    expect(wipes.displayName).toBe('Alcohol Prep Wipes');
    expect(wipes.variants.map(v => v.strength)).toEqual(['200 Count', '500 Count']);
    expect(wipes.variants.map(v => v.price)).toEqual([9.99, 18.99]);
    expect(wipes.startingPrice).toBe(9.99);
    expect(wipes.startingAt).toBe(true);
    expect(isAccessoryCountProduct(wipes)).toBe(true);
  });

  it('exposes one Premium Insulin Syringes product with 10–100 Pack by tens', () => {
    const syringes = getProduct('premium-insulin-syringes')!;
    expect(syringes.displayName).toBe('Premium Insulin Syringes');
    expect(syringes.variants).toHaveLength(10);
    expect(syringes.variants.map(v => v.strength)).toEqual([
      '10 Pack', '20 Pack', '30 Pack', '40 Pack', '50 Pack',
      '60 Pack', '70 Pack', '80 Pack', '90 Pack', '100 Pack',
    ]);
    expect(syringes.variants.map(v => v.price)).toEqual([
      3.99, 6.99, 9.49, 11.99, 14.49, 16.99, 19.49, 21.99, 24.49, 26.99,
    ]);
    expect(syringes.startingPrice).toBe(3.99);
  });

  it('does not list duplicate wipe/syringe cards in the visible catalog', () => {
    const accessorySlugs = visibleProducts
      .filter(p => p.category === 'accessories')
      .map(p => p.slug);
    expect(accessorySlugs.filter(s => s.includes('alcohol')).length).toBe(1);
    expect(accessorySlugs.filter(s => s.includes('syringe')).length).toBe(1);
    expect(accessorySlugs).not.toContain('alcohol-prep-wipes-100');
    expect(accessorySlugs).not.toContain('alcohol-prep-wipes-200');
    expect(accessorySlugs).not.toContain('premium-insulin-syringes-10');
    expect(accessorySlugs).not.toContain('premium-insulin-syringes-50');
    expect(accessorySlugs).not.toContain('premium-insulin-syringes-100');
    expect(accessorySlugs).toHaveLength(9);
  });

  it('aliases legacy wipe/syringe slugs to consolidated products', () => {
    expect(SLUG_ALIASES['alcohol-prep-wipes-100']).toBe('alcohol-prep-wipes');
    expect(SLUG_ALIASES['alcohol-prep-wipes-200']).toBe('alcohol-prep-wipes');
    expect(SLUG_ALIASES['premium-insulin-syringes-50']).toBe('premium-insulin-syringes');
    expect(getProduct('alcohol-prep-wipes-200')?.slug).toBe('alcohol-prep-wipes');
    expect(getProduct('premium-insulin-syringes-10')?.slug).toBe('premium-insulin-syringes');
  });

  it('builds cart names with selected count/pack and keeps quantity separate', () => {
    const syringes = getProduct('premium-insulin-syringes')!;
    const pack50 = syringes.variants.find(v => v.strength === '50 Pack')!;
    expect(accessoryCartName(syringes, pack50)).toBe('Premium Insulin Syringes — 50 Pack');
    expect(accessoryCartVariantLabel(syringes, pack50)).toBe('Count: 50 Pack');
    expect(accessoryVariantOptionLabel(pack50)).toBe('50 Pack');

    const bag = getProduct('discreet-travel-bag')!;
    expect(accessoryCartName(bag, bag.variants[0])).toBe('Discreet Travel Bag');
    expect(accessoryCartVariantLabel(bag, bag.variants[0])).toBeUndefined();
  });

  it('clamps accessory unit quantity to 1–10', () => {
    expect(clampAccessoryQuantity(0)).toBe(1);
    expect(clampAccessoryQuantity(10)).toBe(ACCESSORY_UNIT_QUANTITY_MAX);
    expect(clampAccessoryQuantity(99)).toBe(10);
  });

  it('documents obsolete Stripe test product ids for archival review', () => {
    expect(OBSOLETE_ACCESSORY_STRIPE_TEST_IDS.map(o => o.appProductId)).toEqual([
      'a8', 'a9', 'a10', 'a11', 'a12',
    ]);
  });
});
