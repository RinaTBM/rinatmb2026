/**
 * Frontend payment gate helpers.
 * Stripe Checkout is permanently disabled.
 * Manual invoice checkout is enabled by default.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('isPaymentsEnabled / manual vs stripe gates', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('never enables Stripe checkout', async () => {
    const { isStripeCheckoutEnabled } = await import('./paymentsEnabled');
    expect(isStripeCheckoutEnabled()).toBe(false);
  });

  it('enables manual checkout when unset', async () => {
    vi.stubEnv('VITE_MANUAL_CHECKOUT_ENABLED', undefined);
    vi.stubEnv('VITE_PAYMENTS_ENABLED', undefined);
    const { isManualCheckoutEnabled, isPaymentsEnabled } = await import('./paymentsEnabled');
    expect(isManualCheckoutEnabled()).toBe(true);
    expect(isPaymentsEnabled()).toBe(true);
  });

  it('disables manual checkout when VITE_MANUAL_CHECKOUT_ENABLED=false', async () => {
    vi.stubEnv('VITE_MANUAL_CHECKOUT_ENABLED', 'false');
    const { isManualCheckoutEnabled } = await import('./paymentsEnabled');
    expect(isManualCheckoutEnabled()).toBe(false);
  });

  it('honors legacy VITE_PAYMENTS_ENABLED=false kill-switch', async () => {
    vi.stubEnv('VITE_PAYMENTS_ENABLED', 'false');
    const { isManualCheckoutEnabled } = await import('./paymentsEnabled');
    expect(isManualCheckoutEnabled()).toBe(false);
  });
});
