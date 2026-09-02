import { describe, expect, it } from 'vitest';
import { applyGenPromo, isGenPromoCode, TEST_PROMO_RESTRICTED_EMAIL } from './genPromo';

const accessory = {
  productId: 'a1',
  sku: 'MBM-ACC-TEST-001',
  section: 'accessories',
  category: 'accessories',
  quantity: 1,
  unitAmountCents: 10000,
};

const wellness = {
  productId: 'p74',
  sku: 'MBM-WM-FB-INJ-001',
  section: 'weight-management',
  category: 'weight-management',
  quantity: 1,
  unitAmountCents: 10000,
};

describe('GEN Health promo mapping', () => {
  it('recognizes the three configured codes', () => {
    expect(isGenPromoCode(' firsttime ')).toBe(true);
    expect(isGenPromoCode('OGTBM')).toBe(true);
    expect(isGenPromoCode('test')).toBe(true);
  });

  it('applies $25 FIRSTTIME to a signed-in eligible checkout', () => {
    expect(applyGenPromo({ code: 'FIRSTTIME', isAuthenticated: true, lines: [wellness] })).toMatchObject({
      ok: true,
      discountCents: 2500,
    });
  });

  it('requires sign-in for FIRSTTIME', () => {
    expect(applyGenPromo({ code: 'FIRSTTIME', lines: [wellness] })).toEqual({
      ok: false,
      reason: 'sign_in_required',
    });
  });

  it('applies 25% OGTBM to eligible wellness lines', () => {
    expect(applyGenPromo({ code: 'OGTBM', lines: [wellness] })).toMatchObject({ ok: true, discountCents: 2500 });
  });

  it('applies 100% TEST only for the authorized owner email', () => {
    expect(
      applyGenPromo({
        code: 'TEST',
        customerEmail: TEST_PROMO_RESTRICTED_EMAIL,
        lines: [accessory],
      }),
    ).toMatchObject({ ok: true, discountCents: 10000 });
    expect(
      applyGenPromo({
        code: 'TEST',
        customerEmail: 'customer@example.com',
        lines: [accessory],
      }),
    ).toEqual({
      ok: false,
      reason: 'email_not_authorized',
    });
  });

  it('blocks accessories and provider care checkout', () => {
    expect(applyGenPromo({ code: 'OGTBM', lines: [accessory] })).toEqual({
      ok: false,
      reason: 'cart_ineligible',
    });
    expect(
      applyGenPromo({
        code: 'OGTBM',
        lines: [{ ...wellness, productId: 'pc1', sku: 'MBM-PC-IPV-SRV-001', section: 'provider-care' }],
      }),
    ).toEqual({
      ok: false,
      reason: 'cart_ineligible',
    });
  });

  it('blocks recurring and membership checkout', () => {
    expect(applyGenPromo({ code: 'TEST', customerEmail: TEST_PROMO_RESTRICTED_EMAIL, lines: [{ ...accessory, subscription: true }] })).toMatchObject({ ok: false });
    expect(applyGenPromo({ code: 'TEST', customerEmail: TEST_PROMO_RESTRICTED_EMAIL, lines: [{ ...accessory, productId: 'm1', isMembership: true }] })).toMatchObject({ ok: false });
  });
});
