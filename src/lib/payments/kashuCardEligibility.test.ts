import { describe, expect, it } from 'vitest';
import {
  evaluateKashuCardCartEligibility,
  MBM_SHIPPING_SKU_NEXT_DAY,
  MBM_SHIPPING_SKU_TWO_DAY,
  shippingSkuForMethod,
  TAGADA_SHIPPING_PARITY_BLOCKER,
  buildTagadaCheckoutInitUrl,
  TAGADA_API_BASE_PRODUCTION,
} from './kashuTagada';
import {
  TWO_DAY_SHIPPING_CENTS,
  NEXT_DAY_SHIPPING_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  shippingCentsForMethod,
  isFreeShippingEligible,
} from '@/lib/orders/shipping';

describe('Kashu card cart eligibility (memberships + shipping)', () => {
  const oneTime = {
    purchaseType: 'one_time' as const,
    quantity: 1,
    sku: 'MBM-WM-SEM-INJ-001',
    productId: 'p1',
  };

  it('allows card when flag on, one-time items, and $0 shipping', () => {
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 0,
        items: [oneTime],
      }),
    ).toEqual({ ok: true });
  });

  it('blocks card when flag is off', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: false,
      shippingCents: 0,
      items: [oneTime],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('flag_off');
  });

  it('blocks recurring membership carts from card (ACH/Wire remain for those)', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 0,
      items: [
        {
          isMembership: true,
          purchaseType: 'membership_program',
          quantity: 1,
          sku: 'MBM-MEM-SEM-MEM-001',
          productId: 'm1',
        },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('membership');
  });

  it('blocks mixed membership + one-time from becoming a one-time card purchase', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 0,
      items: [
        oneTime,
        {
          isMembership: true,
          purchaseType: 'membership_program',
          quantity: 1,
          sku: 'MBM-MEM-TIR-MEM-001',
          productId: 'm2',
        },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('membership');
  });

  it('blocks positive Two-Day / Next-Day shipping until Tagada shipping SKUs are mapped', () => {
    const twoDay = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: TWO_DAY_SHIPPING_CENTS,
      items: [oneTime],
    });
    expect(twoDay.ok).toBe(false);
    if (!twoDay.ok) {
      expect(twoDay.reason).toBe('shipping_parity');
      expect(twoDay.blockerCode).toBe(TAGADA_SHIPPING_PARITY_BLOCKER);
    }

    const nextDay = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: NEXT_DAY_SHIPPING_CENTS,
      items: [oneTime],
    });
    expect(nextDay.ok).toBe(false);
    if (!nextDay.ok) expect(nextDay.blockerCode).toBe(TAGADA_SHIPPING_PARITY_BLOCKER);
  });

  it('allows free-shipping threshold carts ($0 shipping) for card eligibility', () => {
    expect(isFreeShippingEligible(FREE_SHIPPING_THRESHOLD_CENTS)).toBe(true);
    expect(shippingCentsForMethod('two_day', FREE_SHIPPING_THRESHOLD_CENTS)).toBe(0);
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 0,
        items: [{ ...oneTime, quantity: 2 }],
      }).ok,
    ).toBe(true);
  });

  it('allows service-only ($0 shipping) carts for card', () => {
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 0,
        items: [
          {
            purchaseType: 'one_time',
            quantity: 1,
            sku: 'MBM-PC-IPV-SRV-001',
            productId: 'pc1',
          },
        ],
      }).ok,
    ).toBe(true);
  });

  it('rejects invalid quantities', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 0,
      items: [{ ...oneTime, quantity: 0 }],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('invalid_quantity');
  });
});

describe('MBM shipping SKU mapping helpers (Tagada line-item parity)', () => {
  it('maps Two-Day / Next-Day to canonical MBM shipping SKUs', () => {
    expect(shippingSkuForMethod('two_day')).toBe(MBM_SHIPPING_SKU_TWO_DAY);
    expect(shippingSkuForMethod('next_day')).toBe(MBM_SHIPPING_SKU_NEXT_DAY);
    expect(shippingSkuForMethod('none')).toBeNull();
    expect(shippingSkuForMethod('free_over_500')).toBeNull();
  });

  it('keeps MBM Two-Day $30 and Next-Day $50 as authoritative cents', () => {
    expect(TWO_DAY_SHIPPING_CENTS).toBe(3000);
    expect(NEXT_DAY_SHIPPING_CENTS).toBe(5000);
  });
});

describe('Tagada init URL items encoding (no duplicate shipping guess)', () => {
  it('JSON-encodes items via URLSearchParams including optional shipping line', () => {
    const url = buildTagadaCheckoutInitUrl({
      apiBase: TAGADA_API_BASE_PRODUCTION,
      params: {
        storeId: 'store_test',
        currency: 'USD',
        checkoutUrl: 'https://checkout.mybaremethod.com/checkout',
        items: [
          { variantId: 'variant_product', quantity: 2 },
          { variantId: 'variant_ship', quantity: 1, priceId: 'price_ship' },
        ],
      },
    });
    const u = new URL(url);
    expect(u.origin + u.pathname).toBe(
      'https://api.tagada.io/api/public/v1/checkout/init',
    );
    expect(u.searchParams.get('storeId')).toBe('store_test');
    expect(u.searchParams.get('currency')).toBe('USD');
    expect(u.searchParams.get('checkoutUrl')).toBe(
      'https://checkout.mybaremethod.com/checkout',
    );
    const items = JSON.parse(u.searchParams.get('items') || '[]');
    expect(items).toEqual([
      { variantId: 'variant_product', quantity: 2 },
      { variantId: 'variant_ship', quantity: 1, priceId: 'price_ship' },
    ]);
    // Exactly one shipping line when provided — never invent a second charge.
    expect(items.filter((i: { variantId: string }) => i.variantId === 'variant_ship')).toHaveLength(
      1,
    );
  });
});
