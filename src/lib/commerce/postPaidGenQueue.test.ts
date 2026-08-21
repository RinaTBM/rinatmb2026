import { describe, expect, it } from 'vitest';
import { preparePostPaidGenQueue } from './postPaidGenQueue';

describe('preparePostPaidGenQueue', () => {
  const rx = {
    orderItemId: 'oi-1',
    mbmSku: 'MBM-WM-SEM-INJ-001',
    commerceType: 'RX_MEDICATION' as const,
    genMappingReady: false,
  };

  it('skips accessories', () => {
    const r = preparePostPaidGenQueue({
      paymentStatus: 'paid',
      externalPaymentId: 'pay_x',
      automationEnabled: true,
      queuePrepEnabled: true,
      lines: [{ ...rx, commerceType: 'ACCESSORY', mbmSku: 'MBM-ACC-ICE-ACC-001' }],
    });
    expect(r.status).toBe('NOT_APPLICABLE');
  });

  it('blocks unpaid', () => {
    const r = preparePostPaidGenQueue({
      paymentStatus: 'awaiting_payment',
      externalPaymentId: 'pay_x',
      automationEnabled: true,
      queuePrepEnabled: true,
      lines: [rx],
    });
    expect(r.status).toBe('BLOCKED_UNPAID');
  });

  it('skips when automation off (Phase 12F default)', () => {
    const r = preparePostPaidGenQueue({
      paymentStatus: 'paid',
      externalPaymentId: 'pay_x',
      automationEnabled: false,
      queuePrepEnabled: false,
      lines: [{ ...rx, genMappingReady: true }],
    });
    expect(r.status).toBe('SKIPPED_AUTOMATION_OFF');
  });

  it('queues pending when enabled and mapped', () => {
    const r = preparePostPaidGenQueue({
      paymentStatus: 'paid',
      externalPaymentId: 'pay_x',
      automationEnabled: true,
      queuePrepEnabled: true,
      lines: [{ ...rx, genMappingReady: true }],
    });
    expect(r.status).toBe('QUEUED_PENDING');
    expect(r.eligibleLineCount).toBe(1);
  });
});
