/**
 * Phase 12H — GEN clinical status, requiredActions, pharmacy normalization.
 * Pure helpers only. GEN remains clinical source of truth.
 */

import type { GenHandoffStatus, GenRequiredAction } from "./genHealthTypes.ts";

export type RequiredActionCategory =
  | 'FORM'
  | 'UPLOAD'
  | 'IDENTITY'
  | 'LAB'
  | 'VISIT'
  | 'SCHEDULING'
  | 'PAYMENT'
  | 'OTHER';

export type NormalizedRequiredAction = {
  id?: string;
  type?: string;
  category: RequiredActionCategory;
  label: string;
  status?: string;
  completed: boolean;
  continuationUrl?: string;
  dueAt?: string;
  rawActionId?: string;
};

export type PharmacyShipmentStatus =
  | 'PHARMACY_PENDING'
  | 'PHARMACY_PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'UNKNOWN';

export type PortalClinicalStage =
  | 'payment_received'
  | 'health_information_needed'
  | 'provider_review'
  | 'prescription_approved'
  | 'pharmacy_processing'
  | 'shipped'
  | 'complete'
  | 'denied_follow_up'
  | 'preparing'
  | 'error_retry';

const CLINICAL_STATUS_MAP: Record<string, GenHandoffStatus> = {
  not_started: 'GEN_NOT_STARTED',
  gen_not_started: 'GEN_NOT_STARTED',
  patient_pending: 'GEN_PATIENT_PENDING',
  patient_created: 'GEN_PATIENT_CREATED',
  order_pending: 'GEN_ORDER_PENDING',
  pending: 'GEN_ORDER_PENDING',
  pending_payment: 'GEN_ORDER_PENDING',
  created: 'GEN_ORDER_CREATED',
  order_created: 'GEN_ORDER_CREATED',
  action_required: 'GEN_ACTION_REQUIRED',
  required_actions: 'GEN_ACTION_REQUIRED',
  actions_required: 'GEN_ACTION_REQUIRED',
  provider_review: 'GEN_PROVIDER_REVIEW',
  in_review: 'GEN_PROVIDER_REVIEW',
  under_review: 'GEN_PROVIDER_REVIEW',
  clinical_review: 'GEN_PROVIDER_REVIEW',
  approved: 'GEN_APPROVED',
  prescription_approved: 'GEN_APPROVED',
  denied: 'GEN_DENIED',
  rejected: 'GEN_DENIED',
  not_approved: 'GEN_DENIED',
  pharmacy: 'GEN_PHARMACY',
  pharmacy_pending: 'GEN_PHARMACY',
  pharmacy_processing: 'GEN_PHARMACY',
  fulfilling: 'GEN_PHARMACY',
  fulfillment: 'GEN_PHARMACY',
  shipped: 'GEN_SHIPPED',
  in_transit: 'GEN_SHIPPED',
  delivered: 'GEN_COMPLETE',
  complete: 'GEN_COMPLETE',
  completed: 'GEN_COMPLETE',
  done: 'GEN_COMPLETE',
  error: 'GEN_ERROR',
  failed: 'GEN_ERROR',
  retry: 'GEN_RETRY_REQUIRED',
  retry_required: 'GEN_RETRY_REQUIRED',
};

/**
 * Normalize opaque GEN orderStatus into internal clinical statuses.
 * Unknown → GEN_UNKNOWN (never auto-fulfill).
 */
export function normalizeGenClinicalStatus(raw: string | null | undefined): GenHandoffStatus {
  if (!raw) return 'GEN_UNKNOWN';
  const s = raw.trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (CLINICAL_STATUS_MAP[s]) return CLINICAL_STATUS_MAP[s];
  // Partial contains checks for verbose GEN strings
  if (s.includes('action') && s.includes('required')) return 'GEN_ACTION_REQUIRED';
  if (s.includes('provider') || s.includes('review')) return 'GEN_PROVIDER_REVIEW';
  if (s.includes('denied') || s.includes('reject')) return 'GEN_DENIED';
  if (s.includes('approv')) return 'GEN_APPROVED';
  if (s.includes('ship')) return 'GEN_SHIPPED';
  if (s.includes('deliver') || s.includes('complete')) return 'GEN_COMPLETE';
  if (s.includes('pharmac') || s.includes('fulfill')) return 'GEN_PHARMACY';
  if (s.includes('retry')) return 'GEN_RETRY_REQUIRED';
  if (s.includes('error') || s.includes('fail')) return 'GEN_ERROR';
  return 'GEN_UNKNOWN';
}

export function categorizeRequiredActionType(typeOrTitle: string | null | undefined): RequiredActionCategory {
  const s = (typeOrTitle || '').toLowerCase();
  if (!s) return 'OTHER';
  if (/(form|intake|questionnaire|assessment)/.test(s)) return 'FORM';
  if (/(upload|document|photo|id_doc|file)/.test(s)) return 'UPLOAD';
  if (/(patient_continuation|continuation|continue)/.test(s)) return 'OTHER';
  if (/(identity|kyc|verify.?id|id.?verif)/.test(s)) return 'IDENTITY';
  if (/(lab|blood|specimen)/.test(s)) return 'LAB';
  if (/(visit|consult|appointment|telehealth|provider.?visit)/.test(s)) return 'VISIT';
  if (/(schedul|book|calendar)/.test(s)) return 'SCHEDULING';
  if (/(payment|pay|invoice|billing)/.test(s)) return 'PAYMENT';
  return 'OTHER';
}

export function isRequiredActionCompleted(action: {
  status?: string | null;
  completed?: boolean | null;
}): boolean {
  if (action.completed === true) return true;
  if (action.completed === false) return false;
  const s = (action.status || '').toLowerCase();
  return s === 'completed' || s === 'complete' || s === 'done' || s === 'finished';
}

/**
 * Normalize GEN requiredActions into display-safe categories.
 * Does not invent completion — relies on GEN status/completed fields only.
 */
export function normalizeRequiredAction(raw: GenRequiredAction | Record<string, unknown>): NormalizedRequiredAction {
  const a = raw as GenRequiredAction & {
    name?: string;
    label?: string;
    href?: string;
    continuationUrl?: string;
    dueAt?: string;
    due_at?: string;
    completed?: boolean;
  };
  const type = a.type;
  const title = a.title || a.name || a.label || type || 'Required step';
  const category = categorizeRequiredActionType(`${type || ''} ${title}`);
  const rawContinuation = a.url || a.href || a.continuationUrl || undefined;
  // Never expose GEN magic-login / token URLs to portal or admin clients.
  const continuationUrl =
    rawContinuation && !/magic-login|token=/i.test(rawContinuation)
      ? rawContinuation
      : undefined;
  return {
    id: a.id,
    type,
    category,
    label: title,
    status: a.status,
    completed: isRequiredActionCompleted(a),
    continuationUrl,
    dueAt: a.dueAt || a.due_at,
    rawActionId: a.id,
  };
}

export function normalizeRequiredActionsList(
  actions: Array<GenRequiredAction | Record<string, unknown>> | null | undefined,
): NormalizedRequiredAction[] {
  return (actions || []).map(normalizeRequiredAction);
}

export function customerActionCardCopy(category: RequiredActionCategory): {
  title: string;
  description: string;
} {
  switch (category) {
    case 'FORM':
      return {
        title: 'Complete Health Form',
        description: 'Additional information is needed before your order can continue.',
      };
    case 'UPLOAD':
      return {
        title: 'Upload Information',
        description: 'Please upload the requested information to continue clinical setup.',
      };
    case 'IDENTITY':
      return {
        title: 'Verify Identity',
        description: 'Identity verification is needed before your order can continue.',
      };
    case 'LAB':
      return {
        title: 'Complete Lab Requirement',
        description: 'A lab requirement must be completed before clinical review can continue.',
      };
    case 'VISIT':
      return {
        title: 'Schedule Visit',
        description: 'A provider visit is needed as part of your clinical setup.',
      };
    case 'SCHEDULING':
      return {
        title: 'Schedule Appointment',
        description: 'Please schedule the required appointment to continue.',
      };
    case 'PAYMENT':
      return {
        title: 'Payment Follow-up',
        description: 'Additional payment information is requested by the care workflow.',
      };
    default:
      return {
        title: 'Continue Clinical Setup',
        description: 'Additional information is needed before your order can continue.',
      };
  }
}

export function normalizePharmacyShipmentStatus(
  raw: string | null | undefined,
): PharmacyShipmentStatus {
  if (!raw) return 'UNKNOWN';
  const s = raw.trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (s.includes('deliver')) return 'DELIVERED';
  if (s.includes('ship') || s.includes('transit')) return 'SHIPPED';
  if (s.includes('process') || s.includes('fulfill') || s === 'pharmacy') return 'PHARMACY_PROCESSING';
  if (s.includes('pending') || s.includes('queue')) return 'PHARMACY_PENDING';
  return 'UNKNOWN';
}

/** Portal stage from normalized clinical status + open actions. Never invents approval. */
export function portalStageFromClinical(input: {
  paymentStatus: string;
  clinicalStatus?: string | null;
  openRequiredActionCount?: number;
}): PortalClinicalStage {
  if (input.paymentStatus !== 'paid') return 'preparing';
  const st = (input.clinicalStatus || '').toUpperCase();
  if (!st || st === 'GEN_NOT_STARTED' || st === 'GEN_ORDER_PENDING' || st === 'GEN_ORDER_CREATED') {
    if ((input.openRequiredActionCount || 0) > 0) return 'health_information_needed';
    return 'preparing';
  }
  if (st === 'GEN_RETRY_REQUIRED' || st === 'GEN_ERROR') return 'error_retry';
  if (st === 'GEN_DENIED') return 'denied_follow_up';
  if (st === 'GEN_ACTION_REQUIRED' || (input.openRequiredActionCount || 0) > 0) {
    return 'health_information_needed';
  }
  if (st === 'GEN_PROVIDER_REVIEW') return 'provider_review';
  if (st === 'GEN_APPROVED') return 'prescription_approved';
  if (st === 'GEN_PHARMACY') return 'pharmacy_processing';
  if (st === 'GEN_SHIPPED') return 'shipped';
  if (st === 'GEN_COMPLETE') return 'complete';
  return 'preparing';
}

export function portalStageCopy(stage: PortalClinicalStage): { headline: string; body: string } {
  switch (stage) {
    case 'payment_received':
    case 'preparing':
      return {
        headline: 'Payment Received',
        body: 'Your payment has been confirmed. We’re preparing your clinical review.',
      };
    case 'health_information_needed':
      return {
        headline: 'Action Required',
        body: 'Additional information is needed before your order can continue.',
      };
    case 'provider_review':
      return {
        headline: 'Clinical Review',
        body: 'Your information is being reviewed by the care team.',
      };
    case 'prescription_approved':
      return {
        headline: 'Prescription Approved',
        body: 'Your prescription has been approved and is moving to pharmacy processing.',
      };
    case 'pharmacy_processing':
      return {
        headline: 'Pharmacy Processing',
        body: 'Your prescription has been sent for pharmacy processing.',
      };
    case 'shipped':
      return {
        headline: 'Shipped',
        body: 'Your order has shipped.',
      };
    case 'complete':
      return {
        headline: 'Complete',
        body: 'Clinical and pharmacy steps for this item are complete.',
      };
    case 'denied_follow_up':
      return {
        headline: 'Follow-up Needed',
        body: 'Your order requires follow-up from the care team.',
      };
    case 'error_retry':
      return {
        headline: 'Payment Received',
        body: 'Payment received. We’re preparing your clinical review.',
      };
  }
}

/** Ordered portal timeline stages for display (reached vs upcoming). */
export const PORTAL_TIMELINE_STAGES: PortalClinicalStage[] = [
  'payment_received',
  'health_information_needed',
  'provider_review',
  'prescription_approved',
  'pharmacy_processing',
  'shipped',
  'complete',
];

export function portalTimelineReachedIndex(stage: PortalClinicalStage): number {
  const map: Record<PortalClinicalStage, number> = {
    preparing: 0,
    payment_received: 0,
    error_retry: 0,
    health_information_needed: 1,
    provider_review: 2,
    prescription_approved: 3,
    pharmacy_processing: 4,
    shipped: 5,
    complete: 6,
    denied_follow_up: 2,
  };
  return map[stage] ?? 0;
}

/** Customer cannot locally mark GEN actions complete — only GEN sync can. */
export function customerMayMarkRequiredActionCompleteLocally(): false {
  return false;
}

/** Browser must never write clinical status. */
export function browserMayWriteClinicalStatus(): false {
  return false;
}

/** Admin GEN refresh/sync endpoints must require authenticated admin. */
export function adminGenStatusRefreshRequiresAuth(): true {
  return true;
}

/** Customer clinical status endpoint must never call GEN from the browser. */
export function customerClinicalStatusReadsLocalStateOnly(): true {
  return true;
}

export type SafeCustomerClinicalLine = {
  orderItemId: string;
  mbmSku: string | null;
  productName: string | null;
  clinicalStatus: string;
  portalStage: PortalClinicalStage;
  headline: string;
  body: string;
  requiredActions: Array<{
    id: string;
    category: RequiredActionCategory;
    title: string;
    description: string;
    continuationUrl?: string;
    completed: boolean;
  }>;
  pharmacyStatus: PharmacyShipmentStatus | null;
  trackingNumber: string | null;
};

export function buildSafeCustomerClinicalLine(input: {
  orderItemId: string;
  mbmSku?: string | null;
  productName?: string | null;
  paymentStatus: string;
  clinicalStatus?: string | null;
  requiredActions?: Array<GenRequiredAction | Record<string, unknown>> | null;
  pharmacyStatusRaw?: string | null;
  trackingNumber?: string | null;
}): SafeCustomerClinicalLine {
  const normalized = normalizeRequiredActionsList(input.requiredActions);
  const open = normalized.filter((a) => !a.completed);
  const stage = portalStageFromClinical({
    paymentStatus: input.paymentStatus,
    clinicalStatus: input.clinicalStatus,
    openRequiredActionCount: open.length,
  });
  const copy = portalStageCopy(stage);
  return {
    orderItemId: input.orderItemId,
    mbmSku: input.mbmSku ?? null,
    productName: input.productName ?? null,
    clinicalStatus: input.clinicalStatus || 'GEN_NOT_STARTED',
    portalStage: stage,
    headline: copy.headline,
    body: copy.body,
    requiredActions: open.map((a, i) => {
      const c = customerActionCardCopy(a.category);
      return {
        id: a.id || `action-${i}`,
        category: a.category,
        title: a.label || c.title,
        description: c.description,
        continuationUrl: a.continuationUrl,
        completed: a.completed,
      };
    }),
    pharmacyStatus: input.pharmacyStatusRaw
      ? normalizePharmacyShipmentStatus(input.pharmacyStatusRaw)
      : null,
    trackingNumber: input.trackingNumber?.trim() || null,
  };
}
