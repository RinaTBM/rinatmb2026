/**
 * Unit tests — GEN/Whop checkout routing policy (pure).
 */
import { describe, expect, it } from 'vitest';
import {
  evaluateGenWhopCheckoutCart,
  isApprovedWhopCheckoutRedirectUrl,
  resolveGenWhopCheckoutEnabled,
  cartMayAttemptGenWhopCheckout,
  type GenWhopCheckoutMapRow,
} from './genWhopCheckout';

const bpcMap: GenWhopCheckoutMapRow = {
  mbmSku: 'MBM-RP-BPC-INJ-001',
  genProductId: 'KXMm9SsbOEYnFy9phmZn',
  genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn',
  purchaseMode: 'one_time',
  retailAmountCents: 19900,
  currency: 'USD',
  storefrontEligible: true,
  checkoutEnabled: true,
  membershipRequired: false,
  active: true,
};

describe('resolveGenWhopCheckoutEnabled', () => {
  it('defaults false', () => {
    expect(resolveGenWhopCheckoutEnabled({})).toBe(false);
    expect(resolveGenWhopCheckoutEnabled({ GEN_WHOP_CHECKOUT_ENABLED: 'false' })).toBe(false);
  });
  it('true only when explicitly enabled', () => {
    expect(resolveGenWhopCheckoutEnabled({ GEN_WHOP_CHECKOUT_ENABLED: 'true' })).toBe(true);
  });
});

describe('evaluateGenWhopCheckoutCart', () => {
  it('routes to tagada when flag off', () => {
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: false,
      lines: [{ mbmSku: 'MBM-RP-BPC-INJ-001', quantity: 1, purchaseType: 'one_time' }],
      mapsBySku: { 'MBM-RP-BPC-INJ-001': bpcMap },
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('FLAG_OFF');
  });

  it('allows single mapped one-time Rx when enabled', () => {
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: true,
      lines: [{ mbmSku: 'MBM-RP-BPC-INJ-001', quantity: 1, purchaseType: 'one_time' }],
      mapsBySku: { 'MBM-RP-BPC-INJ-001': bpcMap },
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.route).toBe('gen_whop');
  });

  it('sends accessories to Tagada path', () => {
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: true,
      lines: [{ mbmSku: 'MBM-ACC-FOO-001', quantity: 1 }],
      mapsBySku: {},
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.route).toBe('tagada');
      expect(r.code).toBe('ACCESSORY_TAGADA');
    }
  });

  it('blocks SEM/TIRZ membership SKUs on GEN/Whop path', () => {
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: true,
      lines: [{ mbmSku: 'MBM-MEM-SEM-MEM-001', quantity: 1 }],
      mapsBySku: {},
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('MEMBERSHIP_UNSUPPORTED');
  });

  it('blocks auto_refill purchase type until recurring is designed', () => {
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: true,
      lines: [{ mbmSku: 'MBM-RP-BPC-INJ-001', quantity: 1, purchaseType: 'auto_refill' }],
      mapsBySku: { 'MBM-RP-BPC-INJ-001': bpcMap },
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('PURCHASE_TYPE_UNSUPPORTED');
  });

  it('blocks multi-product GEN carts', () => {
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: true,
      lines: [
        { mbmSku: 'MBM-RP-BPC-INJ-001', quantity: 1, purchaseType: 'one_time' },
        { mbmSku: 'MBM-RP-OTHER-001', quantity: 1, purchaseType: 'one_time' },
      ],
      mapsBySku: {
        'MBM-RP-BPC-INJ-001': bpcMap,
        'MBM-RP-OTHER-001': { ...bpcMap, mbmSku: 'MBM-RP-OTHER-001', genProductId: 'x' },
      },
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('MULTI_PRODUCT_BLOCKED');
  });

  it('blocks when checkout_enabled false', () => {
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: true,
      lines: [{ mbmSku: 'MBM-RP-BPC-INJ-001', quantity: 1, purchaseType: 'one_time' }],
      mapsBySku: { 'MBM-RP-BPC-INJ-001': { ...bpcMap, checkoutEnabled: false } },
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('CHECKOUT_DISABLED');
  });

  it('heuristic mayAttempt is true only for single one-time Rx (NO_MAP shape)', () => {
    expect(
      cartMayAttemptGenWhopCheckout([
        { mbmSku: 'MBM-RP-BPC-INJ-001', quantity: 1, purchaseType: 'one_time' },
      ]),
    ).toBe(true);
    expect(
      cartMayAttemptGenWhopCheckout([{ mbmSku: 'MBM-ACC-FOO-001', quantity: 1 }]),
    ).toBe(false);
    expect(
      cartMayAttemptGenWhopCheckout([{ mbmSku: 'MBM-MEM-SEM-MEM-001', quantity: 1 }]),
    ).toBe(false);
  });

  it('GEN BPC mapped amount stays $199 (no medication shipping added)', () => {
    expect(bpcMap.retailAmountCents).toBe(19900);
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: true,
      lines: [{ mbmSku: 'MBM-RP-BPC-INJ-001', quantity: 1, purchaseType: 'one_time' }],
      mapsBySku: { 'MBM-RP-BPC-INJ-001': bpcMap },
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.route).toBe('gen_whop');
      expect(r.lines[0]?.map.retailAmountCents).toBe(19900);
    }
  });
});

describe('isApprovedWhopCheckoutRedirectUrl', () => {
  it('accepts https://whop.com/checkout/...', () => {
    const r = isApprovedWhopCheckoutRedirectUrl('https://whop.com/checkout/ch_abc/');
    expect(r.ok).toBe(true);
  });
  it('rejects non-whop hosts', () => {
    const r = isApprovedWhopCheckoutRedirectUrl('https://checkout.mybaremethod.com/checkout/x');
    expect(r.ok).toBe(false);
  });
  it('rejects http', () => {
    const r = isApprovedWhopCheckoutRedirectUrl('http://whop.com/checkout/ch_abc/');
    expect(r.ok).toBe(false);
  });
});
