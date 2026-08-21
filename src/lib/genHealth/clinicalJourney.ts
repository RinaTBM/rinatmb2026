/**
 * Phase 12I.5 — Customer clinical journey stages (MBM branding).
 * Derived from normalized GEN clinical state — never from frontend clicks alone.
 */

import type { PortalClinicalStage } from './clinicalStatus';

export type ClinicalJourneyStageId =
  | 'payment_received'
  | 'health_information'
  | 'provider_review'
  | 'prescription'
  | 'pharmacy_processing'
  | 'shipped'
  | 'complete';

export const CLINICAL_JOURNEY_STAGES: ReadonlyArray<{
  id: ClinicalJourneyStageId;
  label: string;
}> = [
  { id: 'payment_received', label: 'Payment Received' },
  { id: 'health_information', label: 'Health Information' },
  { id: 'provider_review', label: 'Provider Review' },
  { id: 'prescription', label: 'Prescription' },
  { id: 'pharmacy_processing', label: 'Pharmacy Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'complete', label: 'Complete' },
];

export function journeyStageFromPortal(stage: PortalClinicalStage): ClinicalJourneyStageId {
  switch (stage) {
    case 'health_information_needed':
      return 'health_information';
    case 'provider_review':
      return 'provider_review';
    case 'prescription_approved':
      return 'prescription';
    case 'pharmacy_processing':
      return 'pharmacy_processing';
    case 'shipped':
      return 'shipped';
    case 'complete':
      return 'complete';
    case 'denied_follow_up':
      return 'provider_review';
    case 'error_retry':
    case 'preparing':
    default:
      return 'payment_received';
  }
}

export function isJourneyStageReached(
  current: ClinicalJourneyStageId,
  candidate: ClinicalJourneyStageId,
): boolean {
  const order = CLINICAL_JOURNEY_STAGES.map((s) => s.id);
  return order.indexOf(candidate) <= order.indexOf(current);
}
