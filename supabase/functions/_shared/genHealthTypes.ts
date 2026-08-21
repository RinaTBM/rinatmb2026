/**
 * GEN Health V2 types — Edge / Deno mirror of src/lib/genHealth/genHealthTypes.ts.
 * Only known/designed fields. Uncertain corners use optional / unknown JSON.
 */

import type { GenSkuMapCallableStatus } from "./genHealthConfig.ts";

export type GenMappingStatus =
  | "DRAFT"
  | "CURRENT"
  | "READY"
  | "ACTIVE"
  | "BLOCKED"
  | "STALE"
  | "UNPAIRED"
  | "DEPRECATED";

/** Internal clinical / sync status (not raw GEN strings). */
export type GenNormalizedClinicalStatus =
  | "GEN_NOT_STARTED"
  | "GEN_PATIENT_PENDING"
  | "GEN_PATIENT_CREATED"
  | "GEN_ORDER_PENDING"
  | "GEN_ORDER_CREATED"
  | "GEN_ACTION_REQUIRED"
  | "GEN_PROVIDER_REVIEW"
  | "GEN_APPROVED"
  | "GEN_DENIED"
  | "GEN_PHARMACY"
  | "GEN_SHIPPED"
  | "GEN_COMPLETE"
  | "GEN_ERROR"
  | "GEN_RETRY_REQUIRED"
  | "GEN_UNKNOWN";

/** @deprecated Prefer GenNormalizedClinicalStatus — kept as alias for shared helpers. */
export type GenHandoffStatus = GenNormalizedClinicalStatus;

/** Operational queue status on order_gen_orders.handoff_status (pipeline). */
export type GenPipelineHandoffStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "ORDER_CREATED"
  | "ACTION_REQUIRED"
  | "SYNCED"
  | "RETRY_REQUIRED"
  | "BLOCKED"
  | "FAILED"
  | "SKIPPED_NON_RX"
  | "GEN_NOT_STARTED";

export type GenPatientInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  /** ISO date YYYY-MM-DD — required by GEN V2 create patient (confirmed via API error). */
  dateOfBirth?: string;
  /**
   * Address keys confirmed by GEN V2 error remediation:
   * street1, city, state, zip (street2/country optional).
   */
  address?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    [key: string]: unknown;
  };
  extra?: Record<string, unknown>;
};

export type GenPatientResponse = {
  id: string;
  email?: string;
  raw?: unknown;
};

export type GenOrderCreateInput = {
  patientId: string;
  clientProductId: string;
  transactionId: string;
  paymentStatus: "paid";
  clientReference?: string;
  quantity?: number;
  extra?: Record<string, unknown>;
};

export type GenRequiredAction = {
  id?: string;
  type?: string;
  title?: string;
  status?: string;
  url?: string;
  raw?: unknown;
};

export type GenOrderResponse = {
  id: string;
  orderStatus?: string;
  requiredActions?: GenRequiredAction[];
  raw?: unknown;
};

export type GenPrescription = {
  id?: string;
  orderId?: string;
  status?: string;
  raw?: unknown;
};

export type GenApiError = {
  code: string;
  message: string;
  httpStatus?: number;
  retryable?: boolean;
};

export type GenSkuMapping = {
  mbmSku: string;
  genClientProductId: string | null;
  genProductName?: string | null;
  genMedicationPairingId?: string | null;
  genMedicationName?: string | null;
  genPharmacy?: string | null;
  genStrength?: string | null;
  genForm?: string | null;
  genPackage?: string | null;
  medicationCostCents?: number | null;
  shippingCostCents?: number | null;
  mappingStatus: GenMappingStatus | string;
  replacesMbmSku?: string | null;
  active: boolean;
};

export type GenSkuResolveResult =
  | {
    ok: true;
    mapping: GenSkuMapping;
    genClientProductId: string;
    status: GenSkuMapCallableStatus;
  }
  | {
    ok: false;
    code:
      | "GEN_SKU_NOT_FOUND"
      | "GEN_SKU_INACTIVE"
      | "GEN_SKU_BLOCKED"
      | "GEN_SKU_MISSING_PRODUCT_ID";
    message: string;
  };

export type GenSyncStatus = GenNormalizedClinicalStatus;

export type GenLogContext = {
  operation: string;
  mbmOrderId?: string;
  mbmOrderItemId?: string;
  mbmSku?: string;
  genOrderId?: string;
  tagadaTransactionId?: string;
  attempt?: number;
  httpStatus?: number;
  safeErrorCode?: string;
  correlationId?: string;
};

export type GenWebhookVerifyResult =
  | { ok: true; method: string }
  | {
    ok: false;
    code: "GEN_WEBHOOK_VERIFY_UNSUPPORTED" | "UNSIGNED" | "SECRET_MISSING" | "INVALID";
    message: string;
  };
