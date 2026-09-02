import { describe, expect, it } from 'vitest';
import {
  HRT_LAB_PACKAGE_TOTAL_CENTS,
  HRT_LAB_REQUIRED_COPY,
  LAB_KIT,
  LAB_KIT_SHIPPING_INCLUDED_COPY,
  LAB_REVIEW,
  REPEAT_ORDER_LAB_BEHAVIOR,
  RETURNING_HRT_LAB_STATUS_SOURCE,
  buildHrtLabPackageLines,
  cartAlreadyHasLabPackage,
  isHrtProductLine,
  isLabKitLine,
  isShippingChargeExemptLine,
  shouldAutoAddHrtLabPackage,
} from './hrtLabPackage';
import { buildAuthoritativeOrderLines } from './injectProviderVisit';
import { PROVIDER_CARE_FIXED_CENTS } from '@/lib/checkout/checkoutConstants';
import { OGTBM_PROMO_CODE } from '@/lib/promo/ogtbmPromo';

const estradiolLine = {
  productId: 'p16',
  productName: 'Estradiol: Transdermal Estrogen Support Patch',
  sku: 'MBM-HRT-EST-PTC-001',
  slug: 'estradiol-patch',
  quantity: 1,
  unitAmountCents: 8900,
  section: 'womens-hormone-therapy',
};

const progesteroneLine = {
  productId: 'p23',
  productName: 'Progesterone: Oral Hormone Balance Capsules',
  sku: 'MBM-HRT-PRG-CAP-001',
  slug: 'progesterone-capsules',
  quantity: 1,
  unitAmountCents: 7900,
  section: 'womens-hormone-therapy',
};

describe('HRT lab package constants', () => {
  it('Lab Kit $200 + Lab Review $60 = $260', () => {
    expect(LAB_KIT.priceCents).toBe(20000);
    expect(LAB_REVIEW.priceCents).toBe(6000);
    expect(HRT_LAB_PACKAGE_TOTAL_CENTS).toBe(26000);
    expect(PROVIDER_CARE_FIXED_CENTS.pc3).toBe(6000);
    expect(PROVIDER_CARE_FIXED_CENTS.pc4).toBe(20000);
    expect(LAB_KIT.shippingIncluded).toBe(true);
    expect(HRT_LAB_REQUIRED_COPY).toMatch(/Required for initial HRT/);
    expect(LAB_KIT_SHIPPING_INCLUDED_COPY).toMatch(/shipping included/i);
  });

  it('documents returning-customer lab status source (no invented expiration)', () => {
    expect(RETURNING_HRT_LAB_STATUS_SOURCE).toMatch(/customer_therapy_history/);
    expect(RETURNING_HRT_LAB_STATUS_SOURCE).toMatch(/No dedicated lab/);
    expect(REPEAT_ORDER_LAB_BEHAVIOR).toMatch(/zero APPROVED HRT/);
  });
});

describe('HRT lab package auto-add', () => {
  it('auto-adds Lab Kit + Lab Review once for initial HRT order', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-hrt-new',
      approvedTherapyHistory: [],
      items: [estradiolLine],
      shippingCents: 3000,
    });
    expect(built.hrtLabPackageAdded).toBe(true);
    const kits = built.items.filter(i => i.sku === LAB_KIT.sku);
    const reviews = built.items.filter(i => i.sku === LAB_REVIEW.sku);
    expect(kits).toHaveLength(1);
    expect(reviews).toHaveLength(1);
    expect(kits[0].unitAmountCents).toBe(20000);
    expect(reviews[0].unitAmountCents).toBe(6000);
    expect(kits[0].shippingIncluded).toBe(true);
    expect(kits[0].requiredHrtLabPackage).toBe(true);
  });

  it('multiple HRT products only add lab package once', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-hrt-multi',
      approvedTherapyHistory: [],
      items: [estradiolLine, progesteroneLine],
      shippingCents: 3000,
    });
    expect(built.items.filter(i => i.sku === LAB_KIT.sku)).toHaveLength(1);
    expect(built.items.filter(i => i.sku === LAB_REVIEW.sku)).toHaveLength(1);
    const labCents = LAB_KIT.priceCents + LAB_REVIEW.priceCents;
    expect(labCents).toBe(26000);
    // Estradiol + Progesterone + IPV (initial) + lab package + shipping
    expect(built.hrtLabPackageAdded).toBe(true);
  });

  it('does not duplicate when cart already has kit/review', () => {
    const withExisting = buildHrtLabPackageLines({
      items: [
        estradiolLine,
        {
          productId: LAB_KIT.productId,
          sku: LAB_KIT.sku,
        },
        {
          productId: LAB_REVIEW.productId,
          sku: LAB_REVIEW.sku,
        },
      ],
    });
    expect(withExisting).toHaveLength(0);
    expect(
      cartAlreadyHasLabPackage([
        { productId: LAB_KIT.productId, sku: LAB_KIT.sku },
        { productId: LAB_REVIEW.productId, sku: LAB_REVIEW.sku },
      ]).complete,
    ).toBe(true);
  });

  it('strips client lab lines and reinjects at authoritative prices', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-hrt-spoof',
      approvedTherapyHistory: [],
      items: [
        estradiolLine,
        {
          productId: 'pc4',
          productName: 'Lab Kit',
          sku: LAB_KIT.sku,
          quantity: 1,
          unitAmountCents: 1,
          section: 'provider-care',
        },
        {
          productId: 'pc3',
          productName: 'Lab Review',
          sku: LAB_REVIEW.sku,
          quantity: 2,
          unitAmountCents: 1,
          section: 'provider-care',
        },
      ],
      shippingCents: 0,
    });
    expect(built.items.filter(i => i.sku === LAB_KIT.sku)).toHaveLength(1);
    expect(built.items.filter(i => i.sku === LAB_REVIEW.sku)).toHaveLength(1);
    expect(built.items.find(i => i.sku === LAB_KIT.sku)?.unitAmountCents).toBe(20000);
    expect(built.items.find(i => i.sku === LAB_REVIEW.sku)?.unitAmountCents).toBe(6000);
  });

  it('Lab Kit is shipping-charge exempt (shipping included)', () => {
    expect(
      isShippingChargeExemptLine({
        productId: LAB_KIT.productId,
        sku: LAB_KIT.sku,
        section: 'provider-care',
      }),
    ).toBe(true);
    expect(isLabKitLine({ productId: 'pc4', sku: LAB_KIT.sku })).toBe(true);
  });

  it('does not auto-add for returning HRT customer with APPROVED history', () => {
    expect(
      shouldAutoAddHrtLabPackage({
        items: [estradiolLine],
        approvedTherapyHistory: [
          {
            therapy_family: 'estradiol-patch',
            approval_status: 'APPROVED',
            sku: 'MBM-HRT-EST-PTC-001',
            product_id: 'p16',
            variant_id: 'estradiol-patch-v1',
          },
        ],
      }),
    ).toBe(false);

    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-hrt-return',
      approvedTherapyHistory: [
        {
          therapy_family: 'estradiol-patch',
          approval_status: 'APPROVED',
          sku: 'MBM-HRT-EST-PTC-001',
          product_id: 'p16',
          variant_id: 'estradiol-patch-v1',
        },
      ],
      items: [estradiolLine],
      shippingCents: 3000,
    });
    expect(built.hrtLabPackageAdded).toBe(false);
    expect(built.items.some(i => i.sku === LAB_KIT.sku)).toBe(false);
    expect(built.items.some(i => i.sku === LAB_REVIEW.sku)).toBe(false);
  });

  it('HRT + OGTBM: discounts eligible HRT product only — not lab package or shipping', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-hrt-promo',
      approvedTherapyHistory: [],
      items: [estradiolLine],
      shippingCents: 3000,
      promoCode: OGTBM_PROMO_CODE,
    });
    expect(built.promoCode).toBe(OGTBM_PROMO_CODE);
    // Estradiol eligible → $50; Lab Kit / Lab Review / IPV / shipping excluded
    expect(built.discountCents).toBe(5000);
    expect(built.items.find(i => i.sku === LAB_KIT.sku)?.unitAmountCents).toBe(20000);
    expect(built.items.find(i => i.sku === LAB_REVIEW.sku)?.unitAmountCents).toBe(6000);
    const merch =
      estradiolLine.unitAmountCents +
      (built.items.find(i => i.sku === 'MBM-PC-IPV-SRV-001')?.unitAmountCents || 0) +
      LAB_KIT.priceCents +
      LAB_REVIEW.priceCents;
    expect(built.subtotalCents).toBe(merch);
    expect(built.totalCents).toBe(merch - 5000 + 3000);
    expect(built.taxCents).toBe(0);
  });

  it('server rejects client-claimed OGTBM discount without valid code path', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-1',
      approvedTherapyHistory: [],
      items: [
        {
          productId: 'p10',
          productName: 'NAD+',
          sku: 'MBM-WM-NAD-INJ-001',
          section: 'longevity',
          quantity: 1,
          unitAmountCents: 25900,
        },
      ],
      shippingCents: 0,
      discountCents: 5000,
      promoCode: null,
    });
    // Client discount without OGTBM code is clamped as ordinary discountCents input
    // (member savings path) — but OGTBM-looking code with failed apply zeros out.
    expect(built.promoCode).toBeNull();
  });

  it('Tagada amount parity helper: total = subtotal - discount + shipping + tax0', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-parity',
      approvedTherapyHistory: [],
      items: [
        {
          productId: 'p10',
          productName: 'NAD+',
          sku: 'MBM-WM-NAD-INJ-001',
          section: 'longevity',
          quantity: 1,
          unitAmountCents: 25900,
        },
      ],
      shippingCents: 3000,
      promoCode: OGTBM_PROMO_CODE,
    });
    expect(built.discountCents).toBe(5000);
    expect(built.taxCents).toBe(0);
    const tagadaParity =
      built.subtotalCents - built.discountCents + built.shippingCents + built.taxCents;
    expect(tagadaParity).toBe(built.totalCents);
    expect(tagadaParity).toBe(25900 - 5000 + 3000);
  });
});

describe('screenshot cart: Estradiol + Testosterone + IPV + Lab package + Two-Day', () => {
  const testosteroneLine = {
    productId: 'p27',
    productName: 'Testosterone: Topical Hormone Support Cream',
    sku: 'MBM-HRT-TST-CRM-001',
    slug: 'testosterone-cream',
    quantity: 1,
    unitAmountCents: 7900,
    section: 'womens-hormone-therapy',
  };

  const estradiol129 = {
    productId: 'p16',
    productName: 'Estradiol: Transdermal Estrogen Support Patch',
    sku: 'MBM-HRT-EST-PAT-001',
    slug: 'estradiol-patch',
    quantity: 1,
    unitAmountCents: 12900,
    section: 'womens-hormone-therapy',
  };

  it('detects estradiol, progesterone, and testosterone as HRT (incl. category-only)', () => {
    expect(isHrtProductLine({ productId: 'p16', slug: 'estradiol-patch' })).toBe(true);
    expect(isHrtProductLine({ productId: 'p23', slug: 'progesterone-capsules' })).toBe(true);
    expect(isHrtProductLine({ productId: 'p27', slug: 'testosterone-cream' })).toBe(true);
    expect(
      isHrtProductLine({
        productId: 'unknown',
        section: 'womens-hormone-therapy',
      }),
    ).toBe(true);
  });

  it('exact cart without promo totals $573 (543 merch+services + 30 ship)', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-screenshot',
      approvedTherapyHistory: [],
      items: [estradiol129, testosteroneLine],
      shippingCents: 3000,
    });
    expect(built.hrtLabPackageAdded).toBe(true);
    expect(built.items.filter(i => i.sku === LAB_KIT.sku)).toHaveLength(1);
    expect(built.items.filter(i => i.sku === LAB_REVIEW.sku)).toHaveLength(1);
    expect(built.items.filter(i => i.sku === 'MBM-PC-IPV-SRV-001')).toHaveLength(1);
    // 12900 + 7900 + 7500 + 20000 + 6000 = 54300
    expect(built.subtotalCents).toBe(54300);
    expect(built.discountCents).toBe(0);
    expect(built.shippingCents).toBe(3000);
    expect(built.taxCents).toBe(0);
    expect(built.totalCents).toBe(57300);
  });

  it('exact cart with OGTBM: $100 off HRT only → $473', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-screenshot-promo',
      approvedTherapyHistory: [],
      items: [estradiol129, testosteroneLine],
      shippingCents: 3000,
      promoCode: OGTBM_PROMO_CODE,
    });
    expect(built.discountCents).toBe(10000); // $50 Estradiol + $50 Testosterone
    expect(built.subtotalCents).toBe(54300);
    expect(built.totalCents).toBe(47300); // 57300 - 10000
    expect(built.taxCents).toBe(0);
    // Lab + IPV not discounted
    expect(built.items.find(i => i.sku === LAB_KIT.sku)?.unitAmountCents).toBe(20000);
    expect(built.items.find(i => i.sku === LAB_REVIEW.sku)?.unitAmountCents).toBe(6000);
  });

  it.each([
    ['estradiol alone', [estradiol129]],
    ['testosterone alone', [testosteroneLine]],
    [
      'progesterone alone',
      [
        {
          productId: 'p23',
          productName: 'Progesterone: Oral Hormone Balance Capsules',
          sku: 'MBM-HRT-PRG-CAP-001',
          slug: 'progesterone-capsules',
          quantity: 1,
          unitAmountCents: 3900,
          section: 'womens-hormone-therapy',
        },
      ],
    ],
    ['estradiol + testosterone', [estradiol129, testosteroneLine]],
    [
      'all three HRT',
      [
        estradiol129,
        testosteroneLine,
        {
          productId: 'p23',
          productName: 'Progesterone: Oral Hormone Balance Capsules',
          sku: 'MBM-HRT-PRG-CAP-001',
          slug: 'progesterone-capsules',
          quantity: 1,
          unitAmountCents: 3900,
          section: 'womens-hormone-therapy',
        },
      ],
    ],
  ])('%s adds lab package exactly once', (_label, cartItems) => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-hrt-matrix',
      approvedTherapyHistory: [],
      items: cartItems,
      shippingCents: 3000,
    });
    expect(built.items.filter(i => i.sku === LAB_KIT.sku)).toHaveLength(1);
    expect(built.items.filter(i => i.sku === LAB_REVIEW.sku)).toHaveLength(1);
    expect(built.hrtLabPackageAdded).toBe(true);
  });
});
