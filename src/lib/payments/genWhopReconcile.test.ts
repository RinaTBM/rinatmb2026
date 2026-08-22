/**
 * Unit tests — GEN/Whop reconciliation authority rules.
 */
import { describe, expect, it } from 'vitest';
import {
  evaluateGenWhopReconcile,
  normalizeWhopAmountToCents,
  type GenWhopReconcileInput,
} from './genWhopReconcile';
import {
  cartMayAttemptGenWhopCheckout,
  evaluateGenWhopCheckoutCart,
  resolveGenWhopCheckoutEnabled,
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

const base: GenWhopReconcileInput = {
  mbmPaymentStatus: 'awaiting_payment',
  mbmPaymentMethod: 'gen_whop',
  expectedAmountCents: 19900,
  expectedCurrency: 'USD',
  expectedGenProductId: 'KXMm9SsbOEYnFy9phmZn',
  expectedGenClientProductId: bpcMap.genClientProductId,
  expectedWhopCheckoutConfigId: 'ch_test',
  expectedGenCheckoutSessionId: 'sfcs_test',
  currentSessionStatus: 'redirect_issued',
  whopPayments: [],
  genOrders: [],
};

describe('flag / mapping safety (WHOP-2A)', () => {
  it('flag off fails closed to Tagada', () => {
    expect(resolveGenWhopCheckoutEnabled({})).toBe(false);
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: false,
      lines: [{ mbmSku: 'MBM-RP-BPC-INJ-001', quantity: 1, purchaseType: 'one_time' }],
      mapsBySku: { 'MBM-RP-BPC-INJ-001': bpcMap },
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('FLAG_OFF');
  });

  it('unmapped SKU preserves Tagada route', () => {
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: true,
      lines: [{ mbmSku: 'MBM-RP-UNKNOWN-001', quantity: 1, purchaseType: 'one_time' }],
      mapsBySku: {},
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('NO_MAP');
  });

  it('checkout_enabled=false blocks session create', () => {
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: true,
      lines: [{ mbmSku: 'MBM-RP-BPC-INJ-001', quantity: 1, purchaseType: 'one_time' }],
      mapsBySku: { 'MBM-RP-BPC-INJ-001': { ...bpcMap, checkoutEnabled: false } },
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('CHECKOUT_DISABLED');
  });

  it('one-time BPC mapping eligible when enabled', () => {
    const r = evaluateGenWhopCheckoutCart({
      featureEnabled: true,
      lines: [{ mbmSku: 'MBM-RP-BPC-INJ-001', quantity: 1, purchaseType: 'one_time' }],
      mapsBySku: { 'MBM-RP-BPC-INJ-001': bpcMap },
    });
    expect(r.ok).toBe(true);
  });

  it('accessories excluded', () => {
    expect(cartMayAttemptGenWhopCheckout([{ mbmSku: 'MBM-ACC-X', quantity: 1 }])).toBe(false);
  });

  it('membership excluded', () => {
    expect(cartMayAttemptGenWhopCheckout([{ mbmSku: 'MBM-MEM-SEM-MEM-001', quantity: 1 }])).toBe(
      false,
    );
  });
});

describe('evaluateGenWhopReconcile', () => {
  it('ignores browser claim — cannot mark paid', () => {
    const r = evaluateGenWhopReconcile({ ...base, browserClaimPaid: true });
    expect(r.ok).toBe(false);
    expect(r.action).toBe('pending');
    expect(r.code).toBe('BROWSER_CLAIM_IGNORED');
    expect(r.sessionStatus).not.toBe('paid');
  });

  it('amount mismatch refuses', () => {
    const r = evaluateGenWhopReconcile({
      ...base,
      whopPayments: [
        {
          whopPaymentId: 'pay_1',
          whopCheckoutConfigId: 'ch_test',
          status: 'paid',
          amountCents: 10000,
          currency: 'usd',
          genProductId: 'KXMm9SsbOEYnFy9phmZn',
        },
      ],
    });
    expect(r.ok).toBe(false);
    expect(r.code).toBe('AMOUNT_MISMATCH');
  });

  it('duplicate/ambiguous paid evidence refuses', () => {
    const r = evaluateGenWhopReconcile({
      ...base,
      whopPayments: [
        {
          whopPaymentId: 'pay_1',
          whopCheckoutConfigId: 'ch_test',
          status: 'paid',
          amountCents: 19900,
          currency: 'usd',
        },
        {
          whopPaymentId: 'pay_2',
          whopCheckoutConfigId: 'ch_test',
          status: 'paid',
          amountCents: 19900,
          currency: 'usd',
        },
      ],
    });
    expect(r.ok).toBe(false);
    expect(r.code).toBe('AMBIGUOUS_PAYMENT_EVIDENCE');
  });

  it('successful authoritative reconcile marks paid', () => {
    const r = evaluateGenWhopReconcile({
      ...base,
      whopPayments: [
        {
          whopPaymentId: 'pay_ok',
          whopCheckoutConfigId: 'ch_test',
          status: 'paid',
          amountCents: 19900,
          currency: 'usd',
          genProductId: 'KXMm9SsbOEYnFy9phmZn',
        },
      ],
      genOrders: [
        {
          genOrderId: 'gen_ord_1',
          genPatientId: 'pat_1',
          paymentStatus: 'paid',
          amountCents: 19900,
          currency: 'USD',
          genProductId: 'KXMm9SsbOEYnFy9phmZn',
          whopCheckoutConfigId: 'ch_test',
          whopPaymentId: 'pay_ok',
        },
      ],
    });
    expect(r.ok).toBe(true);
    expect(r.action).toBe('mark_paid');
    expect(r.sessionStatus).toBe('paid');
    expect(r.whopPaymentId).toBe('pay_ok');
    expect(r.genOrderId).toBe('gen_ord_1');
  });

  it('failed payment fixture sets failed', () => {
    const r = evaluateGenWhopReconcile({
      ...base,
      whopPayments: [
        {
          whopPaymentId: 'pay_fail',
          whopCheckoutConfigId: 'ch_test',
          status: 'failed',
          amountCents: 19900,
          currency: 'usd',
        },
      ],
    });
    expect(r.ok).toBe(false);
    expect(r.action).toBe('failed');
    expect(r.code).toBe('PAYMENT_FAILED');
    expect(r.sessionStatus).toBe('failed');
  });

  it('already paid is idempotent', () => {
    const r = evaluateGenWhopReconcile({ ...base, mbmPaymentStatus: 'paid' });
    expect(r.ok).toBe(true);
    expect(r.action).toBe('already_paid');
  });

  it('Whop paid alone (matching amount) can mark paid', () => {
    const r = evaluateGenWhopReconcile({
      ...base,
      whopPayments: [
        {
          whopPaymentId: 'pay_solo',
          whopCheckoutConfigId: 'ch_test',
          status: 'succeeded',
          amountCents: 19900,
          currency: 'USD',
        },
      ],
    });
    expect(r.ok).toBe(true);
    expect(r.action).toBe('mark_paid');
  });
});

describe('normalizeWhopAmountToCents', () => {
  it('treats major units under 1000 as dollars', () => {
    expect(normalizeWhopAmountToCents(199)).toBe(19900);
  });
  it('keeps large values as cents', () => {
    expect(normalizeWhopAmountToCents(19900)).toBe(19900);
  });
});
