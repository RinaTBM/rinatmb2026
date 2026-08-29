import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  resolve(here, '../../../supabase/functions/create-kashu-checkout-session/index.ts'),
  'utf-8',
);

// Extract the MBMTEST90 binding block (from the condition to the next top-level statement)
const mbmtest90Block =
  source.match(/mbmPromoCode === "MBMTEST90"[\s\S]*?(?=\n    const nameParts)/)?.[0] ?? '';

describe('MBMTEST90 Tagada hosted checkout binding (source contract)', () => {
  it('contains a MBMTEST90 discount binding block', () => {
    expect(mbmtest90Block.length).toBeGreaterThan(0);
    expect(mbmtest90Block).toContain('mbmtest90_discounted_priceIds');
  });

  it('binds every one-time order item to 10% of full price without OGTBM eligibility exclusions', () => {
    expect(mbmtest90Block).toContain('0.10');
    expect(mbmtest90Block).not.toContain('isOgtbmEligibleSku');
    expect(mbmtest90Block).toContain('orderItems');
  });

  it('binds server-authorized shipping to 10% of the selected shipping price', () => {
    expect(mbmtest90Block).toContain('shippingCents');
    expect(mbmtest90Block).toContain('shipSku');
    expect(mbmtest90Block).toContain('discountedShippingCents');
  });

  it('enforces exact parity with TAGADA_CHECKOUT_TOTAL_MISMATCH before redirect', () => {
    expect(mbmtest90Block).toContain('TAGADA_CHECKOUT_TOTAL_MISMATCH');
    expect(mbmtest90Block).toContain('recalculated');
    expect(mbmtest90Block).toContain('mbmTotalCents');
  });

  it('preserves approved-email restriction', () => {
    expect(mbmtest90Block).toContain('info@thebaremethodmn.com');
    expect(mbmtest90Block).toContain('MBMTEST90_EMAIL_NOT_AUTHORIZED');
  });

  it('blocks memberships and prescription subscriptions', () => {
    expect(mbmtest90Block).toContain('isMembershipCheckout');
    expect(mbmtest90Block).toContain('isPrescriptionSubscription');
  });

  it('does not pass a promo code to Tagada checkout init', () => {
    expect(source).not.toMatch(/promo[A-Z]?[Cc]ode.*buildInitUrl/);
    expect(source).not.toMatch(/buildInitUrl.*promo[A-Z]?[Cc]ode/);
  });
});
