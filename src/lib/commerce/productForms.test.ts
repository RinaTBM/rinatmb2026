import { describe, expect, it } from 'vitest';
import { getProduct } from '@/data/products';
import { GEN_HOSTED_PRODUCTS } from './genHostedProducts';
import { resolveGenProductFirstCheckout } from './genHostedCheckout';
import { savePrescriptionSelection } from './prescriptionBasket';
import { WEBSITE_PRODUCT_FAMILIES } from '@/data/websiteFamilies';

describe('separate products and delivery methods', () => {
  it('keeps the combined nasal spray separate from each single-peptide injection', () => {
    const slugs = ['selank', 'semax', 'selank-semax-nasal-spray'];
    const products = slugs.map(slug => getProduct(slug)!);
    expect(products.every(Boolean)).toBe(true);
    expect(new Set(products.map(product => product.id)).size).toBe(3);
    expect(products.map(product => product.dosageForms)).toEqual([
      ['Injection'], ['Injection'], ['Nasal Spray'],
    ]);
    // No nasal or blend ID may stand in for an unverified single-peptide injection.
    expect(GEN_HOSTED_PRODUCTS.selank).toBeUndefined();
    expect(GEN_HOSTED_PRODUCTS.semax).toBeUndefined();
  });

  it.each([
    ['nad-plus', ['Injection', 'Nasal Spray'], [139, 79]],
    ['bpc-157-tb-500', ['Injection', 'Capsules'], [169, 189]],
  ])('%s has two distinct verified checkout options', (slug, labels, prices) => {
    expect(getProduct(slug as string)).toBeDefined();
    const options = GEN_HOSTED_PRODUCTS[slug as string].options!;
    expect(options.map(option => option.label)).toEqual(labels);
    expect(options.map(option => option.price)).toEqual(prices);
    expect(new Set(options.map(option => option.genClientProductId)).size).toBe(2);
    for (const option of options) {
      const checkout = resolveGenProductFirstCheckout(option.genClientProductId);
      expect(checkout.ok).toBe(true);
      if (checkout.ok) expect(checkout.url).toContain(option.genClientProductId);
    }
  });

  it('keeps the mismatched combined nasal pairing unavailable pending correction', () => {
    expect(resolveGenProductFirstCheckout(
      GEN_HOSTED_PRODUCTS['selank-semax-nasal-spray'].genClientProductId,
    )).toEqual({ ok: false, code: 'PAIRING_NOT_VERIFIED' });
    const blend = WEBSITE_PRODUCT_FAMILIES.find(family => family.familyId === 'selank-semax-blend')!;
    expect(blend.variants.every(variant => !variant.genPairingVerified)).toBe(true);
  });

  it('preserves delivery method, price, and destination when saving both forms', () => {
    const product = getProduct('nad-plus')!;
    const selections = GEN_HOSTED_PRODUCTS['nad-plus'].options!.map(option => ({
      slug: `${product.slug}:${option.genClientProductId}`,
      displayName: `${product.displayName} - ${option.label}`,
      subtitle: option.label,
      image: product.image,
      imageAlt: product.imageAlt,
      price: option.price,
      genClientProductId: option.genClientProductId,
      category: product.category,
    }));
    let basket = savePrescriptionSelection([], selections[0]);
    basket = savePrescriptionSelection(basket, selections[1]);
    expect(basket).toEqual(selections);
    expect(savePrescriptionSelection(basket, selections[0])).toEqual(selections);
    const oldBasket = [{ ...selections[0], slug: product.slug }];
    expect(savePrescriptionSelection(oldBasket, selections[0])).toEqual([selections[0]]);
  });
});
