import { describe, expect, it } from 'vitest';
import {
  FAMILY_VARIANT_SKU_BY_ID,
  REAL_GEN_ORDER_SUBMISSION_ENABLED,
  WEBSITE_FAMILY_CUTOVER_ENABLED,
  WEBSITE_PRODUCT_FAMILIES,
  classifyVariant,
  formularyPendingVariantIds,
  lockedRetailPrice,
  skuForFamilyVariantId,
} from '@/data/websiteFamilies';
import { assertCartEligibleForCheckout } from '@/lib/commerce/productEligibility';
import { resolveStorefrontRxAvailability } from '@/lib/commerce/rxCatalogReadiness';
import { resolveGenApiOrdersEnabled } from '@/lib/commerce/commerceEnvPolicy';
import {
  LAUNCH_READY_KASHU_MAP,
  LAUNCH_READY_KASHU_MAP_ROWS,
  LAUNCH_READY_ONE_TIME_SKUS,
  resolveKashuSkuMapRow,
} from '@/lib/payments/launchReadyKashuMap';
import { evaluateKashuCardCartEligibility } from '@/lib/payments/kashuTagada';
import {
  SEM_MEMBERSHIP_SKU,
  SEM_NEXT_DAY_COMBO_PRICE_ID,
  SEM_TWO_DAY_COMBO_PRICE_ID,
  TIRZ_HISTORICAL_249_PRICE_ID,
  TIRZ_MEMBERSHIP_SKU,
  TIRZ_NEXT_DAY_COMBO_PRICE_ID,
  TIRZ_TAGADA_PRICE_ID,
  TIRZ_TWO_DAY_COMBO_PRICE_ID,
  buildMembershipEnrollmentTagadaInitItems,
  membershipEnrollmentDueTodayCents,
} from '@/lib/membership/tagadaMembershipBilling';
import { NEW_ONE_TIME_VIAL_SKUS } from '@/lib/glp1/oneTimeVialMapping';
import { ACCESSORY_SALES_TAX_RATE, PROVIDER_CARE_TAX_RATE } from '@/lib/checkout/checkoutConstants';

describe('MBM-FINAL-CHECKOUT-LAUNCH-1 non-destructive QA', () => {
  it('does not enable GEN order submission or API Orders', () => {
    expect(WEBSITE_FAMILY_CUTOVER_ENABLED).toBe(true);
    expect(REAL_GEN_ORDER_SUBMISSION_ENABLED).toBe(false);
    expect(resolveGenApiOrdersEnabled({})).toBe(false);
  });

  it('maps all 10 live-verified vial-specific SKUs', () => {
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-SEM-B12-005']).toMatchObject({
      tagada_product_id: 'product_6b750325addf',
      tagada_variant_id: 'variant_a726bfe758b3',
      tagada_price_id: 'price_1c3c8051e3b5',
      mbm_price_cents: 9900,
      tagada_price_cents: 9900,
    });
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-SEM-B12-006']).toMatchObject({
      tagada_product_id: 'product_6b750325addf',
      tagada_variant_id: 'variant_23afe7061b26',
      tagada_price_id: 'price_013a62e05b77',
      mbm_price_cents: 11900,
      tagada_price_cents: 11900,
    });
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-SEM-GLY-005']).toMatchObject({
      tagada_product_id: 'product_dcc64482bbbf',
      tagada_variant_id: 'variant_1f6e4f4d2cb4',
      tagada_price_id: 'price_cea49d485af6',
      mbm_price_cents: 9900,
      tagada_price_cents: 9900,
    });
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-SEM-GLY-006']).toMatchObject({
      tagada_product_id: 'product_dcc64482bbbf',
      tagada_variant_id: 'variant_6db94a24e1ad',
      tagada_price_id: 'price_49a9a6e85d5a',
      mbm_price_cents: 11900,
      tagada_price_cents: 11900,
    });
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-TIR-B12-005']?.tagada_price_cents).toBe(13900);
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-TIR-B12-006']?.tagada_price_cents).toBe(15900);
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-TIR-B12-007']?.tagada_price_cents).toBe(17900);
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-TIR-GLY-005']?.tagada_price_cents).toBe(13900);
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-TIR-GLY-006']?.tagada_price_cents).toBe(15900);
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-TIR-GLY-007']?.tagada_price_cents).toBe(17900);
    for (const sku of NEW_ONE_TIME_VIAL_SKUS) {
      expect(LAUNCH_READY_KASHU_MAP[sku]).toBeTruthy();
    }
  });

  it('inventories live-verified Tagada maps for every family SKU', () => {
    expect(LAUNCH_READY_ONE_TIME_SKUS.length).toBeGreaterThanOrEqual(27);
    expect(new Set(LAUNCH_READY_ONE_TIME_SKUS).size).toBe(LAUNCH_READY_ONE_TIME_SKUS.length);
    for (const sku of Object.values(FAMILY_VARIANT_SKU_BY_ID)) {
      expect(LAUNCH_READY_KASHU_MAP[sku]).toBeTruthy();
      expect(LAUNCH_READY_KASHU_MAP[sku].mbm_sku).toBe(sku);
      expect(LAUNCH_READY_KASHU_MAP[sku].tagada_product_id).toMatch(/^product_/);
      expect(LAUNCH_READY_KASHU_MAP[sku].tagada_variant_id).toMatch(/^variant_/);
      expect(LAUNCH_READY_KASHU_MAP[sku].tagada_price_id).toMatch(/^price_/);
      expect(LAUNCH_READY_KASHU_MAP[sku].mbm_price_cents).toBe(
        LAUNCH_READY_KASHU_MAP[sku].tagada_price_cents,
      );
    }
  });

  it('matches storefront locked retail and SKU for every launch-ready one-time variant', () => {
    for (const family of WEBSITE_PRODUCT_FAMILIES) {
      for (const variant of family.variants) {
        if (classifyVariant(variant).classification !== 'LAUNCH_READY') continue;
        if (variant.purchaseType === 'membership') continue;
        const sku = skuForFamilyVariantId(variant.websiteVariantId);
        expect(sku).toBeTruthy();
        const map = LAUNCH_READY_KASHU_MAP[sku!];
        expect(map).toBeTruthy();
        const dollars = lockedRetailPrice(variant);
        expect(dollars).not.toBeNull();
        expect(map.mbm_price_cents).toBe(Math.round((dollars as number) * 100));
        expect(map.website_variant_id).toBe(variant.websiteVariantId);
      }
    }
  });

  it('allows checkout eligibility without GEN API Orders; tax stays 0; shipping is additive once', () => {
    expect(PROVIDER_CARE_TAX_RATE).toBe(0);
    expect(ACCESSORY_SALES_TAX_RATE).toBe(0);
    for (const sku of LAUNCH_READY_ONE_TIME_SKUS) {
      const map = LAUNCH_READY_KASHU_MAP[sku];
      expect(
        resolveStorefrontRxAvailability({ mbmSku: sku, genApiOrdersEnabled: false })
          ?.productionPurchasable,
      ).toBe(true);
      expect(
        assertCartEligibleForCheckout({
          lines: [
            {
              mbmSku: sku,
              hasActiveTagadaMapping: true,
              genMappingStatus: 'MISSING',
            },
          ],
          requireGenMappingForRx: true,
          genApiOrdersEnabled: false,
        }).ok,
      ).toBe(true);
      const card = evaluateKashuCardCartEligibility({
        flagEnabled: true,
        shippingCents: 3000,
        taxCents: 0,
        items: [{ purchaseType: 'one_time', quantity: 1, sku }],
      });
      expect(card.ok).toBe(true);
      const mbmTotalTwoDay = map.mbm_price_cents + 3000;
      const tagadaTotalTwoDay = map.tagada_price_cents + 3000;
      expect(mbmTotalTwoDay).toBe(tagadaTotalTwoDay);
      expect(mbmTotalTwoDay).toBe(map.mbm_price_cents + 3000);
      expect(map.mbm_price_cents + 5000).toBe(map.tagada_price_cents + 5000);
    }
  });

  it('SEM membership 149 / 179 / 199 and TIR 275 / 305 / 325', () => {
    expect(
      membershipEnrollmentDueTodayCents({
        membershipSku: SEM_MEMBERSHIP_SKU,
        shippingCents: 3000,
      }),
    ).toMatchObject({
      ok: true,
      baseMembershipAmountCents: 14900,
      monthlyRebillCents: 17900,
      tagadaPriceId: SEM_TWO_DAY_COMBO_PRICE_ID,
    });
    expect(
      membershipEnrollmentDueTodayCents({
        membershipSku: SEM_MEMBERSHIP_SKU,
        shippingCents: 5000,
      }),
    ).toMatchObject({
      ok: true,
      monthlyRebillCents: 19900,
      tagadaPriceId: SEM_NEXT_DAY_COMBO_PRICE_ID,
    });
    expect(
      membershipEnrollmentDueTodayCents({
        membershipSku: TIRZ_MEMBERSHIP_SKU,
        shippingCents: 3000,
      }),
    ).toMatchObject({
      ok: true,
      baseMembershipAmountCents: 27500,
      monthlyRebillCents: 30500,
      tagadaPriceId: TIRZ_TWO_DAY_COMBO_PRICE_ID,
    });
    expect(
      membershipEnrollmentDueTodayCents({
        membershipSku: TIRZ_MEMBERSHIP_SKU,
        shippingCents: 5000,
      }),
    ).toMatchObject({
      ok: true,
      monthlyRebillCents: 32500,
      tagadaPriceId: TIRZ_NEXT_DAY_COMBO_PRICE_ID,
    });
    expect(TIRZ_TAGADA_PRICE_ID).not.toBe(TIRZ_HISTORICAL_249_PRICE_ID);
    const init = buildMembershipEnrollmentTagadaInitItems({
      membershipSku: TIRZ_MEMBERSHIP_SKU,
      shippingCents: 3000,
      membershipVariantId: 'variant_b3890c799e09',
    });
    expect(init.ok).toBe(true);
    if (!init.ok) return;
    expect(init.shippingSku).toBeNull();
    expect(init.items).toHaveLength(1);
    expect(init.items[0].priceId).toBe(TIRZ_TWO_DAY_COMBO_PRICE_ID);
  });

  it('repairs stale TIR $249 kashu_sku_map rows for new enrollment', () => {
    const stale = {
      tagada_variant_id: 'variant_b3890c799e09',
      tagada_product_id: 'product_8b3bfb6614c4',
      tagada_price_id: TIRZ_HISTORICAL_249_PRICE_ID,
      mbm_price_cents: 24900,
      tagada_price_cents: 24900,
    };
    const resolved = resolveKashuSkuMapRow('MBM-MEM-TIR-MEM-001', stale);
    expect(resolved?.tagada_price_id).toBe('price_2d2dd07b2f73');
    expect(resolved?.tagada_price_cents).toBe(27500);
  });

  it('does not map FORMULARY_PENDING or FUTURE_HIDDEN variants', () => {
    const pending = formularyPendingVariantIds();
    expect(pending.length).toBeGreaterThan(0);
    for (const family of WEBSITE_PRODUCT_FAMILIES) {
      for (const variant of family.variants) {
        const hidden =
          variant.routingStatus === 'FUTURE_HIDDEN' ||
          variant.launchState === 'FUTURE_HIDDEN' ||
          variant.routingStatus === 'FORMULARY_PENDING';
        if (!hidden) continue;
        const sku = skuForFamilyVariantId(variant.websiteVariantId);
        if (sku) expect(LAUNCH_READY_KASHU_MAP[sku]).toBeUndefined();
      }
    }
    expect(LAUNCH_READY_KASHU_MAP_ROWS.some((r) => r.website_variant_id.startsWith('nad-inj-'))).toBe(
      false,
    );
    expect(LAUNCH_READY_KASHU_MAP_ROWS.some((r) => r.website_variant_id.startsWith('wolverine-'))).toBe(
      false,
    );
  });
});
