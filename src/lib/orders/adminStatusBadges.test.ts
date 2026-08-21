import { describe, expect, it } from 'vitest';
import { adminClinicalBadge, adminPaymentBadge } from './adminStatusBadges';

describe('adminStatusBadges', () => {
  it('maps payment statuses', () => {
    expect(adminPaymentBadge('awaiting_payment').label).toBe('Awaiting Payment');
    expect(adminPaymentBadge('paid').tone).toBe('green');
    expect(adminPaymentBadge('payment_under_review').tone).toBe('red');
  });

  it('shows clinical badges only when paid', () => {
    expect(
      adminClinicalBadge({ paymentStatus: 'awaiting_payment', genHandoffStatus: 'PENDING' }),
    ).toBeNull();
    expect(
      adminClinicalBadge({ paymentStatus: 'paid', genHandoffStatus: 'PENDING' })?.label,
    ).toBe('Clinical Review Required');
    expect(
      adminClinicalBadge({ paymentStatus: 'paid', genHandoffStatus: 'GEN_ERROR' })?.label,
    ).toBe('GEN Error');
  });
});
