import { describe, expect, it } from 'vitest';
import {
  customerCanMarkActionCompleteLocally,
  resolveClinicalLinesForOrder,
  resolveClinicalNextSteps,
} from './clinicalNextSteps';

describe('resolveClinicalNextSteps', () => {
  it('skips non-Rx / accessory — customer portal hides GEN', () => {
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

  it('denied copy avoids promissory approval language', () => {
    const v = resolveClinicalNextSteps({
      paymentStatus: 'paid',
      hasRxLine: true,
      genUiEnabled: true,
      genHandoffStatus: 'GEN_DENIED',
    });
    expect(v.phase).toBe('denied_follow_up');
    expect(v.headline).toMatch(/follow-up from the care team/i);
    expect(v.headline.toLowerCase()).not.toMatch(/medication is approved/);
  });

  it('customer cannot mark action complete locally', () => {
    expect(customerCanMarkActionCompleteLocally()).toBe(false);
  });

  it('multi-Rx lines keep independent clinical stages', () => {
    const { lines } = resolveClinicalLinesForOrder({
      paymentStatus: 'paid',
      genUiEnabled: true,
      lines: [
        {
          orderItemId: 'a',
          mbmSku: 'MBM-RP-BPC-INJ-001',
          clinicalStatus: 'GEN_PROVIDER_REVIEW',
        },
        {
          orderItemId: 'b',
          mbmSku: 'MBM-RP-OTHER',
          clinicalStatus: 'GEN_ACTION_REQUIRED',
          requiredActions: [{ type: 'form', title: 'Form' }],
        },
      ],
    });
    expect(lines).toHaveLength(2);
    expect(lines[0].portalStage).toBe('provider_review');
    expect(lines[1].portalStage).toBe('health_information_needed');
  });
});
