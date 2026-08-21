/**
 * Phase 12I.5 — MBM-normalized clinical domain types.
 * Application code should depend on these, not raw GEN response shapes.
 * Normalization happens at the GEN wrapper boundary.
 */

import type { PortalClinicalStage, PharmacyShipmentStatus } from './clinicalStatus';
import type { GenNormalizedClinicalStatus } from './genHealthTypes';

export type ClinicalPatient = {
  externalPatientId: string;
  email?: string;
};

export type ClinicalProduct = {
  externalProductId: string;
  name?: string;
  pharmacy?: string | null;
};

export type ClinicalFormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'multi_select'
  | 'radio'
  | 'checkbox'
  | 'boolean'
  | 'file'
  | 'acknowledgment'
  | 'unknown';

export type ClinicalFormField = {
  id: string;
  type: ClinicalFormFieldType;
  label: string;
  required: boolean;
  options?: Array<{ value: string; label: string }>;
  helpText?: string;
  /** True when GEN field type was not in the supported set — render fail-safe. */
  unsupported: boolean;
  rawType?: string;
};

export type ClinicalFormSchema = {
  formId: string;
  title?: string;
  fields: ClinicalFormField[];
  productId?: string;
};

export type ClinicalRequiredAction = {
  id: string;
  category: string;
  label: string;
  completed: boolean;
  continuationUrl?: string;
};

export type ClinicalPrescription = {
  externalPrescriptionId: string | null;
  status: string | null;
  medicationLabel: string | null;
  fulfillmentStatus: string | null;
  pharmacyStatus: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  carrier: string | null;
};

export type ClinicalVisit = {
  externalVisitId: string | null;
  status: string | null;
  scheduledAt: string | null;
};

export type ClinicalLab = {
  externalLabId: string | null;
  status: string | null;
  label: string | null;
};

export type ClinicalMessage = {
  id: string;
  direction: 'inbound' | 'outbound' | 'unknown';
  bodyPreview: string | null;
  createdAt: string | null;
  /** Never include full clinical body in logs — preview truncated for UI only. */
};

export type ClinicalConversation = {
  externalConversationId: string;
  subject?: string | null;
  status?: string | null;
  messages?: ClinicalMessage[];
};

export type ClinicalOrder = {
  externalOrderId: string;
  status: string | null;
  paymentStatus: string | null;
  clinicalStatus: GenNormalizedClinicalStatus;
  portalStage: PortalClinicalStage;
  requiredActions: ClinicalRequiredAction[];
  prescriptionStatus: string | null;
  pharmacyStatus: PharmacyShipmentStatus | null;
  shippingStatus: PharmacyShipmentStatus | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
};

/** Normalized GEN wrapper error codes (customer-safe mapping lives elsewhere). */
export type GenWrapperErrorCode =
  | 'GEN_API_DISABLED'
  | 'GEN_API_ORDERS_DISABLED'
  | 'GEN_PATIENT_ERROR'
  | 'GEN_ORDER_CREATE_ERROR'
  | 'GEN_MARK_PAID_ERROR'
  | 'GEN_FORM_FETCH_ERROR'
  | 'GEN_FORM_SUBMIT_ERROR'
  | 'GEN_PRESCRIPTION_SYNC_ERROR'
  | 'GEN_MESSAGE_ERROR'
  | 'GEN_UPLOAD_ERROR'
  | 'GEN_RETRY_REQUIRED'
  | 'GEN_ALREADY_LINKED'
  | 'GEN_ALREADY_PAID'
  | 'GEN_CONFLICT'
  | 'GEN_FORBIDDEN'
  | 'GEN_UNKNOWN_FIELD'
  | 'GEN_AUTH_ERROR'
  | 'GEN_NETWORK_ERROR';

export function mapHttpToWrapperError(
  httpStatus: number | undefined,
  fallback: GenWrapperErrorCode,
): GenWrapperErrorCode {
  if (httpStatus === 403) return 'GEN_API_ORDERS_DISABLED';
  if (httpStatus === 409) return 'GEN_CONFLICT';
  if (httpStatus === 401) return 'GEN_AUTH_ERROR';
  if (httpStatus == null || httpStatus >= 500) return 'GEN_RETRY_REQUIRED';
  return fallback;
}
