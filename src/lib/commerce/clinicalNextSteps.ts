/**
 * Customer portal — clinical next-steps panel (Phase 12F / 12H).
 * GEN requiredActions are source of truth once handoff exists.
 * Behind GEN feature readiness — never invents medical questions.
 * Multi-Rx: one clinical line per order item (do not collapse).
 */

import {
  buildSafeCustomerClinicalLine,
  PORTAL_TIMELINE_STAGES,
  portalStageCopy,
  portalTimelineReachedIndex,
  type PortalClinicalStage,
  type SafeCustomerClinicalLine,
} from '@/lib/genHealth/clinicalStatus';

export type ClinicalNextStepsPhase =
  | 'awaiting_payment'
  | 'preparing_clinical_review'
  | 'action_required'
  | 'provider_review'
  | 'complete'
  | 'not_applicable'
  | 'denied_follow_up'
  | 'multi_line';

export interface ClinicalNextStepCard {
  id: string;
  title: string;
  description: string;
  /** When true, title/description came from GEN requiredActions (not invented). */
  fromGen: boolean;
  continuationUrl?: string;
}

export interface ResolveClinicalNextStepsInput {
  paymentStatus: string;
  /** From orders.gen_handoff_status when present. */
  genHandoffStatus?: string | null;
  /** GEN requiredActions payloads when available — pass through only. */
  genRequiredActions?: Array<{
    id?: string;
    type?: string;
    title?: string;
    description?: string;
    url?: string;
    status?: string;
  }>;
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
      headline: 'Payment received. We’re preparing your clinical review.',
      cards: [],
    };
  }

  const actions = input.genRequiredActions || [];
  if (actions.length > 0) {
    return {
      phase: 'action_required',
      headline: 'Additional information is needed before your order can continue.',
      cards: actions.map((a, i) => ({
        id: a.id || `gen-action-${i}`,
        title: a.title || a.type || 'Continue Clinical Setup',
        description: a.description || 'Complete this step in your secure clinical flow.',
        fromGen: true,
        continuationUrl: a.url,
      })),
    };
  }

  const gen = (input.genHandoffStatus || '').toUpperCase();
  if (gen.includes('DENIED')) {
    return {
      phase: 'denied_follow_up',
      headline: 'Your order requires follow-up from the care team.',
      cards: [],
    };
  }
  if (gen.includes('PROVIDER') || gen === 'IN_REVIEW' || gen === 'GEN_PROVIDER_REVIEW') {
    return {
      phase: 'provider_review',
      headline: 'Your information is being reviewed by the care team.',
      cards: [],
    };
  }

  if (
    gen === 'COMPLETED' ||
    gen === 'APPROVED' ||
    gen === 'GEN_APPROVED' ||
    gen === 'GEN_COMPLETE' ||
    gen === 'GEN_SHIPPED'
  ) {
    return {
      phase: 'complete',
      headline: 'Clinical review steps are complete for this order.',
      cards: [],
    };
  }

  return {
    phase: 'preparing_clinical_review',
    headline: 'Payment received. We’re preparing your clinical review.',
    cards: [],
  };
}

export type GenOrderLineSnapshot = {
  orderItemId: string;
  mbmSku?: string | null;
  productName?: string | null;
  clinicalStatus?: string | null;
  requiredActions?: Array<Record<string, unknown>> | null;
  pharmacyStatus?: string | null;
  trackingNumber?: string | null;
};

/** Per-line clinical view for multi-Rx orders. Accessories omitted by caller. */
export function resolveClinicalLinesForOrder(input: {
  paymentStatus: string;
  genUiEnabled: boolean;
  lines: GenOrderLineSnapshot[];
}): {
  applicable: boolean;
  lines: SafeCustomerClinicalLine[];
} {
  if (!input.lines.length) {
    return { applicable: false, lines: [] };
  }
  if (!input.genUiEnabled) {
    return {
      applicable: true,
      lines: input.lines.map((line) =>
        buildSafeCustomerClinicalLine({
          orderItemId: line.orderItemId,
          mbmSku: line.mbmSku,
          productName: line.productName,
          paymentStatus: input.paymentStatus,
          clinicalStatus: 'GEN_ORDER_PENDING',
          requiredActions: [],
        }),
      ),
    };
  }
  return {
    applicable: true,
    lines: input.lines.map((line) =>
      buildSafeCustomerClinicalLine({
        orderItemId: line.orderItemId,
        mbmSku: line.mbmSku,
        productName: line.productName,
        paymentStatus: input.paymentStatus,
        clinicalStatus: line.clinicalStatus,
        requiredActions: line.requiredActions,
        pharmacyStatusRaw: line.pharmacyStatus,
        trackingNumber: line.trackingNumber,
      }),
    ),
  };
}

export function clinicalTimelineLabels(): Array<{
  stage: PortalClinicalStage;
  label: string;
}> {
  return PORTAL_TIMELINE_STAGES.map((stage) => ({
    stage,
    label: portalStageCopy(stage === 'payment_received' ? 'payment_received' : stage).headline,
  }));
}

export function isTimelineStageReached(
  current: PortalClinicalStage,
  candidate: PortalClinicalStage,
): boolean {
  return portalTimelineReachedIndex(candidate) <= portalTimelineReachedIndex(current);
}

/** Safety: customer cannot mark GEN required actions complete locally. */
export function customerCanMarkActionCompleteLocally(): false {
  return false;
}
