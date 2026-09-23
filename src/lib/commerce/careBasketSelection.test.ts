import { describe, expect, it } from 'vitest';
import { saveCareBasketSelection } from './careBasketSelection';
import { GEN_HOSTED_PRODUCTS } from './genHostedProducts';
import { resolveGenProductFirstCheckout } from './genHostedCheckout';

describe('Care Basket delivery selection', () => {
  it('replaces NAD injection with the selected nasal price and checkout while preserving other care', () => {
    const [injection, nasal] = GEN_HOSTED_PRODUCTS['nad-plus'].options!;
    const other = { slug: 'bpc-157', ...GEN_HOSTED_PRODUCTS['bpc-157'] };
    const result = saveCareBasketSelection([other, { slug: 'nad-plus', ...injection }], { slug: 'nad-plus', ...nasal });
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(other);
    expect(result[1]).toMatchObject({ price: 79, genClientProductId: nasal.genClientProductId });
    expect(resolveGenProductFirstCheckout(result[1].genClientProductId)).toEqual({
      ok: true,
      url: expect.stringContaining(`${nasal.genClientProductId}`),
    });
  });
});
