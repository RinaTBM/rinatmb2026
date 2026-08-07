import { describe, expect, it } from 'vitest';
import { getProduct } from '../../data/products';
import {
  ACCESSORY_UNIT_QUANTITY_MAX,
  accessoryCartName,
  accessoryCartVariantLabel,
  clampAccessoryQuantity,
  getAccessoryCountFamily,
  getPricedCountOptions,
  reportMissingAccessoryPrices,
} from './accessoryPurchase';

describe('accessory purchase helpers', () => {
  it('exposes priced alcohol wipe counts without inventing 500', () => {
    const family = getAccessoryCountFamily('alcohol-prep-wipes-200')!;
    const options = getPricedCountOptions(family);
    expect(options.map(o => o.count)).toEqual([100, 200]);
    expect(options.find(o => o.count === 200)?.price).toBe(15);
    expect(options.find(o => o.count === 100)?.price).toBe(9);
    expect(family.missingCounts).toContain(500);
    expect(options.some(o => o.count === 500)).toBe(false);
  });

  it('exposes priced syringe counts 10/50/100 and reports missing tens', () => {
    const family = getAccessoryCountFamily('premium-insulin-syringes-50')!;
    const options = getPricedCountOptions(family);
    expect(options.map(o => o.count)).toEqual([10, 50, 100]);
    expect(options.find(o => o.count === 10)?.price).toBe(12);
    expect(options.find(o => o.count === 50)?.price).toBe(39);
    expect(options.find(o => o.count === 100)?.price).toBe(69);
    expect(family.missingCounts).toEqual([20, 30, 40, 60, 70, 80, 90]);
  });

  it('builds cart names with count labels for family products', () => {
    const wipes = getProduct('alcohol-prep-wipes-200')!;
    const syringes = getProduct('premium-insulin-syringes-10')!;
    const bag = getProduct('discreet-travel-bag')!;
    expect(accessoryCartName(wipes)).toBe('Alcohol Prep Wipes — 200 Count');
    expect(accessoryCartName(syringes)).toBe('Premium Insulin Syringes — 10');
    expect(accessoryCartName(bag)).toBe('Discreet Travel Bag');
    expect(accessoryCartVariantLabel(bag)).toBeUndefined();
  });

  it('clamps accessory unit quantity to 1–10', () => {
    expect(clampAccessoryQuantity(0)).toBe(1);
    expect(clampAccessoryQuantity(1)).toBe(1);
    expect(clampAccessoryQuantity(10)).toBe(ACCESSORY_UNIT_QUANTITY_MAX);
    expect(clampAccessoryQuantity(99)).toBe(10);
  });

  it('reports missing approved prices for the brief', () => {
    const report = reportMissingAccessoryPrices();
    const wipes = report.find(r => r.family === 'Alcohol Prep Wipes')!;
    const syringes = report.find(r => r.family === 'Premium Insulin Syringes')!;
    expect(wipes.missingCounts).toEqual([500]);
    expect(syringes.missingCounts).toEqual([20, 30, 40, 60, 70, 80, 90]);
  });
});
