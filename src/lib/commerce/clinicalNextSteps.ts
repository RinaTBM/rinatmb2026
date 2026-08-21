/**
 * Customer portal — clinical next-steps panel (Phase 12F).
 * GEN requiredActions are source of truth once handoff exists.
 * Behind GEN feature readiness — never invents medical questions.
 */

export type ClinicalNextStepsPhase =
  | 'awaiting_payment'
  | 'preparing_clinical_review'
  | 'action_required'
  | 'provider_review'
  | 'complete'
  | 'not_applicable';

export interface ClinicalNextStepCard {
  id: string;
  title: string;
  description: string;
  /** When true, title/description came from GEN requiredActions (not invented). */
  fromGen: boolean;
}

export interface ResolveClinicalNextStepsInput {
  paymentStatus: string;
  /** From orders.gen_handoff_status when present. */
  genHandoffStatus?: string | null;
  /** GEN requiredActions payloads when available — pass through only. */
  genRequiredActions?: Array<{ id?: string; type?: string; title?: string; description?: string }>;
  hasRxLine: boolean;
  genUiEnabled?: boolean;
}

export interface ClinicalNextStepsView {
  phase: ClinicalNextStepsPhase;
  headline: string;
  cards: ClinicalNextStepCard[];
}

export function resolveClinicalNextSteps(
  input: ResolveClinicalNextStepsInput,
): ClinicalNextStepsView {
  if (!input.hasRxLine) {
    return {
      phase: 'not_applicable',
      headline: '',
      cards: [],
    };
  }

  if (input.paymentStatus !== 'paid') {
    return {
      phase: 'awaiting_payment',
      headline: 'Payment required before clinical review can begin.',
      cards: [],
    };
  }

  if (!input.genUiEnabled) {
    return {
      phase: 'preparing_clinical_review',
      headline: 'Payment received. Preparing your clinical review.',
      cards: [],
    };
  }

  const actions = input.genRequiredActions || [];
  if (actions.length > 0) {
    return {
      phase: 'action_required',
      headline: 'Action required to continue your clinical review.',
      cards: actions.map((a, i) => ({
        id: a.id || `gen-action-${i}`,
        title: a.title || a.type || 'Required step',
        description: a.description || 'Complete this step in your secure clinical flow.',
        fromGen: true,
      })),
    };
  }

  const gen = (input.genHandoffStatus || '').toUpperCase();
  if (gen.includes('PROVIDER') || gen === 'IN_REVIEW') {
    return {
      phase: 'provider_review',
      headline: 'Your information is with the provider for review.',
      cards: [],
    };
  }

  if (gen === 'COMPLETED' || gen === 'APPROVED') {
    return {
      phase: 'complete',
      headline: 'Clinical review steps are complete for this order.',
      cards: [],
    };
  }

  return {
    phase: 'preparing_clinical_review',
    headline: 'Payment received. Preparing your clinical review.',
    cards: [],
  };
}
