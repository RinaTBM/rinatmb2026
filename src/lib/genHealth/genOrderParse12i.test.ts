import { describe, expect, it } from 'vitest';
import { parseGenOrderResponse, snapshotRequiredActions } from './genHealth';
import { categorizeRequiredActionType, normalizeRequiredAction } from './clinicalStatus';

describe('GEN order parse — string requiredActions (12I)', () => {
  it('parses success.data envelope with string action tokens', () => {
    const parsed = parseGenOrderResponse({
      success: true,
      data: {
        orderId: 'gen_ord_fixture',
        orderStatus: 'pending_payment',
        requiredActions: ['forms', 'uploads', 'patient_continuation'],
        magicLink: 'https://app.example.test/magic-login?email=x&token=secret',
      },
    });
    expect(parsed?.id).toBe('gen_ord_fixture');
    expect(parsed?.orderStatus).toBe('pending_payment');
    const snap = snapshotRequiredActions(parsed?.requiredActions);
    expect(snap).toHaveLength(3);
    expect(snap[0].type).toBe('forms');
    // magic-login tokens must never be persisted into MBM snapshots
    expect(snap[0].url).toBeUndefined();
    expect(categorizeRequiredActionType('forms')).toBe('FORM');
    expect(categorizeRequiredActionType('uploads')).toBe('UPLOAD');
    expect(normalizeRequiredAction(snap[0]).category).toBe('FORM');
  });

  it('allows non-token continuation URLs', () => {
    const parsed = parseGenOrderResponse({
      success: true,
      data: {
        orderId: 'gen_ord_2',
        orderStatus: 'action_required',
        requiredActions: [{ type: 'form', title: 'Intake', url: 'https://clinical.example.test/intake' }],
      },
    });
    expect(snapshotRequiredActions(parsed?.requiredActions)[0].url).toBe(
      'https://clinical.example.test/intake',
    );
  });

  it('strips magic-login URLs on clinical normalize (read path)', () => {
    const n = normalizeRequiredAction({
      type: 'uploads',
      title: 'uploads',
      url: 'https://app.genhealthehr.com/magic-login?email=x&token=secret',
    });
    expect(n.category).toBe('UPLOAD');
    expect(n.continuationUrl).toBeUndefined();
  });
});
