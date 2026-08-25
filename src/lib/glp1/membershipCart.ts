import type { Membership } from '@/data/products';
import {
  formatProviderReviewSnapshot,
  glp1FamilyIdFromSlug,
  validateGlp1Formulation,
  validateRequestedDose,
} from './patientRequestedDose';

export function buildGlp1MembershipCartFields(input: {
  membership: Membership;
  formulation: string;
  requestedDose: string;
}):
  | {
      ok: true;
      requestedFormulation: string;
      requestedDose: string;
      variantLabel: string;
      monthlyPrice: number;
    }
  | { ok: false; error: string } {
  const familyId = glp1FamilyIdFromSlug(input.membership.slug);
  if (!familyId) {
    return { ok: false, error: 'This membership is not a Semaglutide or Tirzepatide program.' };
  }
  const formulation = validateGlp1Formulation(input.formulation);
  if (!formulation.ok) return formulation;
  const dose = validateRequestedDose({ requestedDose: input.requestedDose, familyId });
  if (!dose.ok) return dose;
  return {
    ok: true,
    requestedFormulation: formulation.value,
    requestedDose: dose.value,
    variantLabel: formatProviderReviewSnapshot({
      formulation: formulation.value,
      requestedDose: dose.value,
    }),
    monthlyPrice: input.membership.monthlyPrice,
  };
}
