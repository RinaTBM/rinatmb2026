import { describe, expect, it } from 'vitest';
import { products } from './products';
import { LIVE_GLP1_PROGRAMS, getLiveGlp1StartingPrice } from './liveGlp1Programs';

describe('GLP-1 storefront price consistency', () => {
  it.each([
    ['semaglutide', 139, 129],
    ['tirzepatide', 259, 249],
  ] as const)('%s advertises its available one-time program price', (slug, expected, monthly) => {
    const product = products.find((item) => item.slug === slug)!;
    expect(product.startingPrice).toBe(expected);
    expect(product.price).toBe(expected);
    expect(product.startingPrice).toBe(LIVE_GLP1_PROGRAMS[slug].low.price);
    expect(LIVE_GLP1_PROGRAMS[slug].monthly.price).toBe(monthly);
    expect(product.startingPrice).not.toBe(monthly);
  });

  it('leaves other product families on their existing catalog prices', () => {
    expect(getLiveGlp1StartingPrice('nad-plus')).toBeUndefined();
    for (const product of products.filter((item) => !['semaglutide', 'tirzepatide'].includes(item.slug))) {
      const visiblePrices = product.variants.filter((variant) => !variant.id.endsWith('-any-dose')).map((variant) => variant.price);
      const minimum = Math.min(...visiblePrices);
      expect(product.startingPrice).toBe(Number.isFinite(minimum) ? minimum : 0);
    }
  });
});
