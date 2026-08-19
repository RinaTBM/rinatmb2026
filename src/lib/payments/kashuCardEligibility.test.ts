import { describe, expect, it } from 'vitest';
import {
  evaluateKashuCardCartEligibility,
  MBM_SHIPPING_SKU_NEXT_DAY,
  MBM_SHIPPING_SKU_TWO_DAY,
  resolveKashuCardEnabledFlag,
  shippingSkuForMethod,
  TAGADA_SHIPPING_PARITY_BLOCKER,
  TAGADA_UNEXPECTED_TAX_AMOUNT,
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
import { getActiveCheckoutPaymentMethods } from './paymentMethods';
import { isStripeCheckoutEnabled } from './paymentsEnabled';

describe('Kashu card cart eligibility (memberships + shipping + tax)', () => {
  const oneTime = {
    purchaseType: 'one_time' as const,
    quantity: 1,
    sku: 'MBM-WM-SEM-INJ-001',
    productId: 'p1',
  };

  it('allows card when flag on, one-time items, $0 shipping, and $0 tax', () => {
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 0,
        taxCents: 0,
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

  it('allows SEM membership recurring card carts (variantId+priceId path)', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 0,
      taxCents: 0,
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
    expect(r).toEqual({ ok: true, membershipRecurring: true });
  });

  it('blocks mixed membership + ordinary one-time merchandise from becoming a one-time card purchase', () => {
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
    if (!r.ok) expect(['membership', 'membership_mixed']).toContain(r.reason);
  });

  it('allows SEM membership + required IPV as enrollment (not ordinary mixed cart)', () => {
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 0,
        taxCents: 0,
        items: [
          {
            isMembership: true,
            purchaseType: 'membership_program',
            quantity: 1,
            sku: 'MBM-MEM-SEM-MEM-001',
            productId: 'm1',
          },
          {
            purchaseType: 'one_time',
            quantity: 1,
            sku: 'MBM-PC-IPV-SRV-001',
            productId: 'pc1',
          },
        ],
      }),
    ).toEqual({ ok: true, membershipRecurring: true });
  });

  it('allows Two-Day / Next-Day shipping when mapped MBM-SHIP line items are used ($30 / $50)', () => {
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: TWO_DAY_SHIPPING_CENTS,
        taxCents: 0,
        items: [oneTime],
      }),
    ).toEqual({ ok: true });

    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: NEXT_DAY_SHIPPING_CENTS,
        taxCents: 0,
        items: [oneTime],
      }),
    ).toEqual({ ok: true });
  });

  it('blocks unexpected positive shipping cents (not $0 / $30 / $50)', () => {
    const weird = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 2500,
      items: [oneTime],
    });
    expect(weird.ok).toBe(false);
    if (!weird.ok) {
      expect(weird.reason).toBe('shipping_parity');
      expect(weird.blockerCode).toBe(TAGADA_SHIPPING_PARITY_BLOCKER);
    }
  });

  it('allows free-shipping threshold carts ($0 shipping) for card eligibility', () => {
    expect(isFreeShippingEligible(FREE_SHIPPING_THRESHOLD_CENTS)).toBe(true);
    expect(shippingCentsForMethod('two_day', FREE_SHIPPING_THRESHOLD_CENTS)).toBe(0);
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 0,
        taxCents: 0,
        items: [{ ...oneTime, quantity: 2 }],
      }).ok,
    ).toBe(true);
  });

  it('allows service-only ($0 shipping, $0 tax) carts for card', () => {
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 0,
        taxCents: 0,
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

  it('fail-safe: unexpected tax_cents > 0 rejects with TAGADA_UNEXPECTED_TAX_AMOUNT', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: TWO_DAY_SHIPPING_CENTS,
      taxCents: 135,
      items: [
        oneTime,
        {
          purchaseType: 'one_time',
          quantity: 1,
          sku: 'MBM-PC-IPV-SRV-001',
          productId: 'pc1',
        },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe('unexpected_tax');
      expect(r.blockerCode).toBe(TAGADA_UNEXPECTED_TAX_AMOUNT);
    }
  });

  it('fail-safe: Estradiol + IPV + $30 ship + unexpected tax rejects card', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 3000,
      taxCents: 135,
      items: [
        {
          purchaseType: 'one_time',
          quantity: 1,
          sku: 'MBM-HRT-EST-PTC-001',
          productId: 'estradiol',
        },
        {
          purchaseType: 'one_time',
          quantity: 1,
          sku: 'MBM-PC-IPV-SRV-001',
          productId: 'pc1',
        },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('unexpected_tax');
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

describe('Phase 4 card flag resolveKashuCardEnabledFlag', () => {
  it('env undefined/empty => card ON (Bolt preview + production; no PROD dependency)', () => {
    expect(resolveKashuCardEnabledFlag(undefined, true)).toBe(true);
    expect(resolveKashuCardEnabledFlag(null, true)).toBe(true);
    expect(resolveKashuCardEnabledFlag('', true)).toBe(true);
    expect(resolveKashuCardEnabledFlag(undefined, false)).toBe(true);
    expect(resolveKashuCardEnabledFlag(null, false)).toBe(true);
    expect(resolveKashuCardEnabledFlag('', false)).toBe(true);
  });

  it('explicit env false => card disabled (kill switch)', () => {
    expect(resolveKashuCardEnabledFlag('false', true)).toBe(false);
    expect(resolveKashuCardEnabledFlag('false', false)).toBe(false);
    expect(resolveKashuCardEnabledFlag(false, true)).toBe(false);
  });

  it('explicit env true => card enabled', () => {
    expect(resolveKashuCardEnabledFlag('true', true)).toBe(true);
    expect(resolveKashuCardEnabledFlag('true', false)).toBe(true);
    expect(resolveKashuCardEnabledFlag(true, false)).toBe(true);
  });

  it('unset flag defaults public methods to Credit/Debit Card only; Stripe stays disabled', () => {
    // Vitest typically has no VITE_KASHU_CARD_ENABLED → default ON → card only.
    expect(getActiveCheckoutPaymentMethods()).toEqual(['kashu_card']);
    expect(isStripeCheckoutEnabled()).toBe(false);
  });

  it('Bolt preview–style cart (one-time + IPV + $30 ship + $0 tax) is card-eligible when flag on', () => {
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 3000,
        taxCents: 0,
        items: [
          {
            purchaseType: 'one_time',
            quantity: 1,
            sku: 'MBM-WM-SEM-INJ-001',
            productId: 'p1',
          },
          {
            purchaseType: 'one_time',
            quantity: 1,
            sku: 'MBM-PC-IPV-SRV-001',
            productId: 'pc1',
          },
        ],
      }),
    ).toEqual({ ok: true });
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
