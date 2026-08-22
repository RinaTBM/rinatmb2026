import { describe, expect, it } from 'vitest';
import {
  NEXT_DAY_SHIPPING_CENTS,
  SELECTABLE_SHIPPING_METHODS,
  SHIPPING_METHODS,
  TWO_DAY_SHIPPING_CENTS,
  isApprovedCheckoutShippingMethod,
  shippingCentsForMethod,
} from './shipping';
import { authorizeShippingCents } from '../checkout/authorizeCheckout';

describe('approved checkout shipping methods', () => {
  it('does not accept or list obsolete "standard" in modern checkout methods', () => {
    expect((SHIPPING_METHODS as readonly string[]).includes('standard')).toBe(false);
    expect(isApprovedCheckoutShippingMethod('standard')).toBe(false);
    expect([...SELECTABLE_SHIPPING_METHODS]).toEqual(['two_day', 'next_day']);
  });

  it('two_day resolves to $30 and next_day to $50', () => {
    expect(shippingCentsForMethod('two_day', 14900)).toBe(TWO_DAY_SHIPPING_CENTS);
    expect(shippingCentsForMethod('next_day', 14900)).toBe(NEXT_DAY_SHIPPING_CENTS);
    expect(TWO_DAY_SHIPPING_CENTS).toBe(3000);
    expect(NEXT_DAY_SHIPPING_CENTS).toBe(5000);
  });

  it('rejects arbitrary client shipping amounts', () => {
    const r = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 695,
      shippableSubtotalCents: 0,
      requiresPhysicalShipping: true,
      containsMembership: true,
    });
    expect('error' in r).toBe(true);
  });

  it('rejects Demo Tagada shipping 1156 (never production MBM shipping)', () => {
    const r = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 1156,
      shippableSubtotalCents: 0,
      requiresPhysicalShipping: true,
      containsMembership: false,
      containsAccessories: true,
    });
    expect('error' in r).toBe(true);
    const demoMethod = authorizeShippingCents({
      shippingMethod: 'demo_store_forced_shipping' as 'two_day',
      clientShippingCents: 1156,
      shippableSubtotalCents: 0,
      requiresPhysicalShipping: true,
      containsMembership: false,
      containsAccessories: true,
    });
    expect('error' in demoMethod).toBe(true);
  });

  it('membership shipping metadata matches charged shipping', () => {
    // Free-shipping subtotal is ordinary merchandise only (0 for membership-only carts).
    const two = authorizeShippingCents({
      shippingMethod: 'two_day',
      clientShippingCents: 3000,
      shippableSubtotalCents: 0,
      requiresPhysicalShipping: true,
      containsMembership: true,
    });
    const next = authorizeShippingCents({
      shippingMethod: 'next_day',
      clientShippingCents: 5000,
      shippableSubtotalCents: 0,
      requiresPhysicalShipping: true,
      containsMembership: true,
    });
    expect('error' in two).toBe(false);
    expect('error' in next).toBe(false);
    if ('error' in two || 'error' in next) return;
    expect(two.shippingMethod).toBe('two_day');
    expect(two.shippingCents).toBe(3000);
    expect(next.shippingMethod).toBe('next_day');
    expect(next.shippingCents).toBe(5000);
    // Stripe shipping_options amount uses the same authorized cents (not metadata-only).
    expect(two.shippingCents + 14900).toBe(17900);
    expect(next.shippingCents + 24900).toBe(29900);
  });
});
