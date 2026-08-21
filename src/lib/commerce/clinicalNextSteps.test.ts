import { describe, expect, it } from 'vitest';
import { resolveClinicalNextSteps } from './clinicalNextSteps';

describe('resolveClinicalNextSteps', () => {
  it('skips non-Rx', () => {
    expect(
      resolveClinicalNextSteps({
        paymentStatus: 'paid',
        hasRxLine: false,
      }).phase,
    ).toBe('not_applicable');
  });

  it('shows preparing when paid and GEN UI off', () => {
    const v = resolveClinicalNextSteps({
      paymentStatus: 'paid',
      hasRxLine: true,
      genUiEnabled: false,
    });
    expect(v.phase).toBe('preparing_clinical_review');
    expect(v.headline).toMatch(/Preparing your clinical review/i);
  });

  it('renders GEN requiredActions only when provided', () => {
    const v = resolveClinicalNextSteps({
      paymentStatus: 'paid',
      hasRxLine: true,
      genUiEnabled: true,
      genRequiredActions: [
        { id: 'ra1', type: 'intake', title: 'Health intake', description: 'Complete intake' },
      ],
    });
    expect(v.phase).toBe('action_required');
    expect(v.cards[0].fromGen).toBe(true);
    expect(v.cards[0].title).toBe('Health intake');
  });
});
