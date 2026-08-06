import { describe, it, expect } from 'vitest';
import { verifyStripeSignature, computeSignature } from './verifySignature';

const SECRET = 'whsec_test_dummy_secret_value';
const payload = JSON.stringify({ id: 'evt_1', type: 'checkout.session.completed' });

async function header(ts: number, secret = SECRET) {
  const sig = await computeSignature(payload, secret, ts);
  return `t=${ts},v1=${sig}`;
}

describe('verifyStripeSignature', () => {
  it('accepts a valid signature within tolerance', async () => {
    const now = 1_800_000_000;
    const h = await header(now);
    expect(await verifyStripeSignature(payload, h, SECRET, { nowSeconds: now })).toBe(true);
  });

  it('rejects a tampered payload', async () => {
    const now = 1_800_000_000;
    const h = await header(now);
    expect(await verifyStripeSignature(payload + 'x', h, SECRET, { nowSeconds: now })).toBe(false);
  });

  it('rejects a wrong secret', async () => {
    const now = 1_800_000_000;
    const h = await header(now, 'whsec_other');
    expect(await verifyStripeSignature(payload, h, SECRET, { nowSeconds: now })).toBe(false);
  });

  it('rejects an expired timestamp (outside tolerance)', async () => {
    const signedAt = 1_800_000_000;
    const h = await header(signedAt);
    expect(await verifyStripeSignature(payload, h, SECRET, { nowSeconds: signedAt + 10_000, toleranceSeconds: 300 })).toBe(false);
  });

  it('rejects a missing/empty header', async () => {
    expect(await verifyStripeSignature(payload, null, SECRET)).toBe(false);
    expect(await verifyStripeSignature(payload, '', SECRET)).toBe(false);
  });
});
