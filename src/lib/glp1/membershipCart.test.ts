import { describe, expect, it } from 'vitest';
import { getMembership } from '@/data/products';
import { buildGlp1MembershipCartFields } from './membershipCart';
import { GETTING_STARTED_DOSE, GETTING_STARTED_DOSE_LABEL } from './patientRequestedDose';

describe('GLP-1 membership cart fields', () => {
  it('SEM membership price stays $125 across weekly doses including Getting Started', () => {
    const membership = getMembership('semaglutide-membership')!;
    for (const dose of [GETTING_STARTED_DOSE, '0.25 mg', '2 mg']) {
      const built = buildGlp1MembershipCartFields({
        membership,
        formulation: 'Vitamin B12',
        requestedDose: dose,
      });
      expect(built.ok).toBe(true);
      if (!built.ok) return;
      expect(built.monthlyPrice).toBe(125);
      expect(built.requestedFormulation).toBe('Vitamin B12');
      expect(built.requestedDose).toBe(dose);
      expect(built.variantLabel).toContain('Formulation: Vitamin B12');
      expect(built.variantLabel).toContain('Current dose:');
    }
  });

  it('TIR membership price stays $179 and stores Getting Started intent', () => {
    const membership = getMembership('tirzepatide-membership')!;
    const built = buildGlp1MembershipCartFields({
      membership,
      formulation: 'Glycine',
      requestedDose: GETTING_STARTED_DOSE_LABEL,
    });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    expect(built.monthlyPrice).toBe(179);
    expect(built.requestedDose).toBe(GETTING_STARTED_DOSE);
    expect(built.variantLabel).toContain(GETTING_STARTED_DOSE_LABEL);
    expect(built.variantLabel).not.toMatch(/30 mg|25\+30|B6/);
  });

  it('does not treat Getting Started as a formulation', () => {
    const membership = getMembership('semaglutide-membership')!;
    const built = buildGlp1MembershipCartFields({
      membership,
      formulation: GETTING_STARTED_DOSE,
      requestedDose: '0.5 mg',
    });
    expect(built.ok).toBe(false);
  });
});
