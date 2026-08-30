import { describe, expect, it } from 'vitest';
import {
  assertKashuPaidAmountMatchesOrder,
  assertTagadaCheckoutTotalParity,
  assertTagadaTaxEqualsMbmTax,
  detectTagadaPriceDrift,
  evaluateKashuCardCartEligibility,
  isAllowedCardShippingCents,
  MBM_SHIPPING_SKU_NEXT_DAY,
  MBM_SHIPPING_SKU_TWO_DAY,
  remapKashuRowByExactSku,
  shippingSkuForCents,
  shippingSkuForMethod,
  TAGADA_CHECKOUT_TOTAL_MISMATCH,
  TAGADA_TAX_PARITY_BLOCKER,
  TAGADA_UNEXPECTED_TAX_AMOUNT,
} from './kashuTagada';

/** Phase 2A → 2B exact-SKU remaps (23 stale variant IDs). */
const STALE_REMAPS: Array<{
  mbmSku: string;
  beforeVariant: string;
  afterVariant: string;
  afterProduct: string;
  afterPrice: string;
}> = [
  {
    mbmSku: 'MBM-WM-FB3-INJ-001',
    beforeVariant: 'variant_ca761e048b82',
    afterVariant: 'variant_2c53926ab625',
    afterProduct: 'product_7a8f680446a9',
    afterPrice: 'price_197259afe856',
  },
  {
    mbmSku: 'MBM-PC-IPV-SRV-001',
    beforeVariant: 'variant_08bf53e519ce',
    afterVariant: 'variant_3b859fb20d65',
    afterProduct: 'product_0a40b08c46f5',
    afterPrice: 'price_6163adf08816',
  },
  {
    mbmSku: 'MBM-PC-FUV-SRV-001',
    beforeVariant: 'variant_106332e60747',
    afterVariant: 'variant_1478c178bf74',
    afterProduct: 'product_340add760d29',
    afterPrice: 'price_d38a8f90b0bb',
  },
  {
    mbmSku: 'MBM-PC-LAB-SRV-001',
    beforeVariant: 'variant_2d2333daacd2',
    afterVariant: 'variant_31baa3269d52',
    afterProduct: 'product_71d2d139cecb',
    afterPrice: 'price_a02956edce74',
  },
  {
    mbmSku: 'MBM-ACC-CIS-ACC-001',
    beforeVariant: 'variant_45486ee05687',
    afterVariant: 'variant_25b12b9aae1b',
    afterProduct: 'product_496499ba58ed',
    afterPrice: 'price_7c67e4c163f8',
  },
  {
    mbmSku: 'MBM-ACC-PIS-ACC-001',
    beforeVariant: 'variant_2b159acf7906',
    afterVariant: 'variant_33d8970be874',
    afterProduct: 'product_93be4341379b',
    afterPrice: 'price_b9cbbfc7bd2f',
  },
];

describe('Phase 2B exact-SKU remapping (23 stale IDs)', () => {
  it('remaps by exact MBM SKU only and preserves MBM sku/product ids', () => {
    for (const row of STALE_REMAPS) {
      const liveByExactSku = {
        [row.mbmSku]: {
          productId: row.afterProduct,
          variantId: row.afterVariant,
          priceId: row.afterPrice,
        },
        // Name-similar decoy must never win:
        OTHER_NAME_MATCH: {
          productId: 'product_decoy',
          variantId: 'variant_decoy',
          priceId: 'price_decoy',
        },
      };
      const result = remapKashuRowByExactSku({
        current: {
          mbmSku: row.mbmSku,
          mbmProductId: `mbm-${row.mbmSku}`,
          tagadaProductId: 'product_stale',
          tagadaVariantId: row.beforeVariant,
          tagadaPriceId: 'price_stale',
        },
        liveByExactSku,
      });
      expect(result.changed).toBe(true);
      if (!('row' in result) || !result.changed) throw new Error('expected remap');
      expect(result.row.mbmSku).toBe(row.mbmSku);
      expect(result.row.mbmProductId).toBe(`mbm-${row.mbmSku}`);
      expect(result.before.tagadaVariantId).toBe(row.beforeVariant);
      expect(result.after.tagadaVariantId).toBe(row.afterVariant);
      expect(result.after.tagadaProductId).toBe(row.afterProduct);
      expect(result.after.tagadaPriceId).toBe(row.afterPrice);
    }
  });

  it('does not change mappings that already match live exact SKU', () => {
    const result = remapKashuRowByExactSku({
      current: {
        mbmSku: 'MBM-WM-SEM-INJ-001',
        mbmProductId: 'p1',
        tagadaProductId: 'product_cfd1a23b5095',
        tagadaVariantId: 'variant_4786fced127f',
        tagadaPriceId: 'price_59b410d4149c',
      },
      liveByExactSku: {
        'MBM-WM-SEM-INJ-001': {
          productId: 'product_cfd1a23b5095',
          variantId: 'variant_4786fced127f',
          priceId: 'price_59b410d4149c',
        },
      },
    });
    expect(result.changed).toBe(false);
    if ('error' in result) throw new Error('unexpected miss');
  });

  it('refuses name-only matches (no exact SKU key)', () => {
    const result = remapKashuRowByExactSku({
      current: {
        mbmSku: 'MBM-PC-IPV-SRV-001',
        tagadaProductId: 'product_stale',
        tagadaVariantId: 'variant_stale',
      },
      liveByExactSku: {
        // Wrong key — display-name style key must not remap IPV
        'Initial Provider Visit': {
          productId: 'product_0a40b08c46f5',
          variantId: 'variant_3b859fb20d65',
        },
      },
    });
    expect(result).toEqual({ changed: false, error: 'no_exact_sku_match' });
  });
});

describe('Phase 2B price drift detection (MBM authoritative)', () => {
  it('flags PIS-001 $399 vs Tagada $499 as MISMATCH', () => {
    expect(
      detectTagadaPriceDrift({
        sku: 'MBM-ACC-PIS-ACC-001',
        mbmPriceCents: 399,
        tagadaLivePriceCents: 499,
      }),
    ).toEqual({
      sku: 'MBM-ACC-PIS-ACC-001',
      mbmPriceCents: 399,
      tagadaLivePriceCents: 499,
      status: 'MISMATCH',
    });
  });

  it('MATCH when Tagada corrected to MBM price', () => {
    expect(
      detectTagadaPriceDrift({
        sku: 'MBM-ACC-PIS-ACC-001',
        mbmPriceCents: 399,
        tagadaLivePriceCents: 399,
      }).status,
    ).toBe('MATCH');
  });
});

describe('Phase 2B shipping line SKUs ($0 / $10 / $30 / $50)', () => {
  it('appends Two-Day SKU only for shipping_cents=3000', () => {
    expect(shippingSkuForCents(3000)).toBe(MBM_SHIPPING_SKU_TWO_DAY);
    expect(shippingSkuForMethod('two_day')).toBe(MBM_SHIPPING_SKU_TWO_DAY);
  });

  it('appends Next-Day SKU only for shipping_cents=5000', () => {
    expect(shippingSkuForCents(5000)).toBe(MBM_SHIPPING_SKU_NEXT_DAY);
  });

  it('appends no shipping line for $0', () => {
    expect(shippingSkuForCents(0)).toBeNull();
    expect(isAllowedCardShippingCents(0)).toBe(true);
  });

  it('rejects unexpected positive shipping cents', () => {
    expect(isAllowedCardShippingCents(2500)).toBe(false);
    expect(shippingSkuForCents(2500)).toBeNull();
  });
});

describe('Phase 2B tax parity (Tagada tax === MBM tax_cents)', () => {
  it('passes when both are $0 (Semaglutide wellness cart)', () => {
    expect(assertTagadaTaxEqualsMbmTax({ mbmTaxCents: 0, tagadaTaxCents: 0 })).toEqual({ ok: true });
  });

  it('blocks independent Tagada tax ($10.71 on $595)', () => {
    const r = assertTagadaTaxEqualsMbmTax({ mbmTaxCents: 0, tagadaTaxCents: 1071 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.blocker).toBe(TAGADA_TAX_PARITY_BLOCKER);
  });
});

describe('Phase 2B total mismatch rejection', () => {
  it('allows redirect when mapped lines + shipping + tax equal MBM total', () => {
    expect(
      assertTagadaCheckoutTotalParity({
        publicOrderNumber: 'MBM-2B-TEST',
        mbmTotalCents: 14900,
        mappedMerchandiseCents: 11900,
        mappedShippingCents: 3000,
        mbmTaxCents: 0,
        skuList: ['MBM-WM-SEM-INJ-001×1', 'MBM-SHIP-TWO-DAY-001×1'],
      }),
    ).toEqual({ ok: true, calculatedTagadaTotalCents: 14900 });
  });

  it('returns TAGADA_CHECKOUT_TOTAL_MISMATCH without redirecting', () => {
    const r = assertTagadaCheckoutTotalParity({
      publicOrderNumber: 'MBM-2B-BAD',
      mbmTotalCents: 13134,
      mappedMerchandiseCents: 11900,
      mappedShippingCents: 0,
      mbmTaxCents: 0,
      skuList: ['MBM-WM-SEM-INJ-001×1'],
    });
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error('expected mismatch');
    expect(r.error).toBe(TAGADA_CHECKOUT_TOTAL_MISMATCH);
    expect(r.mbmTotalCents).toBe(13134);
    expect(r.calculatedTagadaTotalCents).toBe(11900);
    expect(r.skuList).toEqual(['MBM-WM-SEM-INJ-001×1']);
  });
});

describe('Phase 2B membership recurring card + webhook amount equality intact', () => {
  it('allows SEM membership SKU on recurring card path (Two-Day shipping)', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 3000,
      taxCents: 0,
      items: [
        {
          isMembership: true,
          purchaseType: 'membership_program',
          quantity: 1,
          sku: 'MBM-MEM-SEM-MEM-001',
        },
      ],
    });
    expect(r).toEqual({ ok: true, membershipRecurring: true });
  });

  it('does not weaken webhook amount equality', () => {
    expect(assertKashuPaidAmountMatchesOrder({ orderTotalCents: 59500, paidAmountCents: 59500 })).toEqual({
      ok: true,
    });
    expect(
      assertKashuPaidAmountMatchesOrder({ orderTotalCents: 59500, paidAmountCents: 60571 }),
    ).toMatchObject({ ok: false, reason: 'mismatch' });
  });

  it('provider-visit carts remain card-eligible at $0 shipping and $0 tax (non-shippable services)', () => {
    expect(
      evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 0,
        taxCents: 0,
        items: [{ purchaseType: 'one_time', quantity: 1, sku: 'MBM-PC-IPV-SRV-001' }],
      }).ok,
    ).toBe(true);
  });

  it('blocks provider-visit carts when unexpected tax_cents > 0 (fail-safe)', () => {
    const r = evaluateKashuCardCartEligibility({
      flagEnabled: true,
      shippingCents: 0,
      taxCents: 135,
      items: [{ purchaseType: 'one_time', quantity: 1, sku: 'MBM-PC-IPV-SRV-001' }],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe('unexpected_tax');
      expect(r.blockerCode).toBe(TAGADA_UNEXPECTED_TAX_AMOUNT);
    }
  });
});
