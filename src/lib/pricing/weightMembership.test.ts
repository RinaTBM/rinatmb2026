import { describe, expect, it } from 'vitest';
import { getProduct } from '../../data/products';
import { applyDiscount, buildPurchaseOptions, resolveUnitPrice } from './purchaseOptions';
import { isTirzepatide30mgVariant } from './weightMembership';

const semaglutide = getProduct('semaglutide')!;
const tirzepatide = getProduct('tirzepatide')!;

describe('weight prescription subscriptions', () => {
  it('offers Subscribe & Save 15% plus one-time purchase for every active variant', () => {
    for (const product of [semaglutide, tirzepatide]) {
      for (const variant of product.variants) {
        const options = buildPurchaseOptions({
          standardPrice: variant.price,
          product,
          isActiveMember: false,
          selectedVariant: variant,
        });
        expect(options.map(option => option.kind)).toEqual(['auto_refill', 'one_time']);
        expect(options[0].finalPrice).toBe(applyDiscount(variant.price, 15));
        expect(options[0].billingFrequency).toBe('monthly');
        expect(options[1].finalPrice).toBe(variant.price);
      }
    }
  });

  it('keeps authoritative retail variants unchanged', () => {
    expect(semaglutide.variants.map(v => v.price)).toEqual([
      109, 119, 119, 129, 139, 89, 109, 119, 119, 129, 139, 89,
    ]);
    expect(tirzepatide.variants.map(v => v.price)).toEqual([
      139, 159, 179, 189, 199, 209, 119, 139, 159, 179, 189, 199, 209, 119,
    ]);
  });

  it('does not expose the obsolete Tirzepatide 30mg SKU', () => {
    expect(tirzepatide.variants.some(v => isTirzepatide30mgVariant(v))).toBe(false);
  });

  it('does not discount one-time weight prescriptions', () => {
    const resolved = resolveUnitPrice({
      standardPrice: 199,
      product: tirzepatide,
      isActiveMember: false,
      option: 'one_time',
    });
    expect(resolved.finalPrice).toBe(199);
    expect(resolved.appliedDiscount).toBe('none');
  });
});
