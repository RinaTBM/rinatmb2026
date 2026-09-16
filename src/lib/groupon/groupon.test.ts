import { describe, expect, it } from 'vitest';
import { canChangeGrouponStatus, GROUPON_STATUSES, maskGrouponCode, normalizeGrouponCode, validateGrouponSubmission } from '../../../supabase/functions/_shared/groupon';
import { applyGenPromo } from '@/lib/promo/genPromo';
import { shippingCentsForMethod } from '@/lib/orders/shipping';

describe('manual Groupon boundary', () => {
  it('requires a real package selection and bounded nonblank code', () => {
    expect(validateGrouponSubmission(' ', 'GROUPON-ESTRADIOL')).toBeTruthy();
    expect(validateGrouponSubmission('voucher', 'not-a-package')).toBeTruthy();
    expect(validateGrouponSubmission('a'.repeat(129), 'GROUPON-SCREAM')).toBeTruthy();
    expect(validateGrouponSubmission('a\nb', 'GROUPON-SCREAM')).toBeTruthy();
    expect(validateGrouponSubmission(' Ab-12 ', 'GROUPON-COMPLETE')).toBeNull();
  });
  it('trims only and never exposes short codes in full', () => {
    expect(normalizeGrouponCode(' Ab-12 ')).toBe('Ab-12');
    expect(maskGrouponCode('1234')).toBe('••••••');
    expect(maskGrouponCode('voucher4821')).toBe('••••••4821');
  });
  it('requires verification before redemption and prevents reuse of terminal records', () => {
    expect(canChangeGrouponStatus('Pending Verification', 'Redeemed')).toBe(false);
    expect(canChangeGrouponStatus('Verified', 'Redeemed')).toBe(true);
    for (const status of ['Redeemed', 'Rejected', 'Cancelled'] as const) {
      for (const next of GROUPON_STATUSES.filter(s => s !== status)) expect(canChangeGrouponStatus(status, next)).toBe(false);
    }
  });
  it('does not turn voucher codes into existing promo codes', () => {
    const lines = [{ productId: 'p1', quantity: 1, unitAmountCents: 12900 }];
    expect(applyGenPromo({ code: 'voucher4821', lines })).toEqual({ ok: false, reason: 'unknown_code' });
    expect(applyGenPromo({ code: 'FIRSTTIME', isAuthenticated: true, lines })).toEqual({ ok: true, code: 'FIRSTTIME', discountCents: 2500 });
    expect(applyGenPromo({ code: 'OGTBM', lines })).toEqual({ ok: true, code: 'OGTBM', discountCents: 3225 });
    expect(shippingCentsForMethod('accessory', 10000)).toBe(1000);
    expect(shippingCentsForMethod('none', 10000)).toBe(0);
  });
});
