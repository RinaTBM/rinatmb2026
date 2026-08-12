/**
 * Admin therapy-history approval helpers (pure / testable).
 * Does NOT auto-approve from paid orders.
 */

import type { TherapyApprovalStatus } from './determineProviderRequirement.ts';

export interface TherapyHistoryRowLike {
  id: string;
  customer_user_id: string;
  therapy_family: string;
  product_id: string;
  variant_id: string;
  sku: string;
  approval_status: TherapyApprovalStatus | string;
}

export interface RecordProviderApprovalInput {
  customerUserId: string;
  therapyFamily: string;
  productId: string;
  variantId: string;
  sku: string;
  sourceOrderId?: string | null;
  approvedBy: string | null;
  notes?: string | null;
  /** Existing APPROVED rows for same customer + family (to supersede). */
  currentApprovedRows: TherapyHistoryRowLike[];
  nowIso?: string;
}

export interface RecordProviderApprovalPlan {
  supersedeIds: string[];
  insertRow: {
    customer_user_id: string;
    therapy_family: string;
    product_id: string;
    variant_id: string;
    sku: string;
    approval_status: 'APPROVED';
    approved_at: string;
    approved_by: string | null;
    source_order_id: string | null;
    notes: string | null;
  };
}

export function planRecordProviderApproval(
  input: RecordProviderApprovalInput,
): RecordProviderApprovalPlan {
  const now = input.nowIso ?? new Date().toISOString();
  const supersedeIds = input.currentApprovedRows
    .filter(
      r =>
        r.customer_user_id === input.customerUserId &&
        r.therapy_family === input.therapyFamily &&
        String(r.approval_status).toUpperCase() === 'APPROVED',
    )
    .map(r => r.id);

  return {
    supersedeIds,
    insertRow: {
      customer_user_id: input.customerUserId,
      therapy_family: input.therapyFamily,
      product_id: input.productId,
      variant_id: input.variantId,
      sku: input.sku,
      approval_status: 'APPROVED',
      approved_at: now,
      approved_by: input.approvedBy,
      source_order_id: input.sourceOrderId ?? null,
      notes: input.notes ?? null,
    },
  };
}

export function workflowStatusAfterPayment(providerRequirement: string | null | undefined): {
  provider_workflow_status: 'NOT_REQUIRED' | 'MANUAL_ACTION_REQUIRED';
} {
  if (!providerRequirement || providerRequirement === 'NONE') {
    return { provider_workflow_status: 'NOT_REQUIRED' };
  }
  return { provider_workflow_status: 'MANUAL_ACTION_REQUIRED' };
}

export function planMarkCrossTxAppointmentCompleted(input: {
  currentWorkflowStatus: string | null | undefined;
}): { ok: true; next: 'COMPLETED' } | { ok: false; error: string } {
  if (input.currentWorkflowStatus === 'COMPLETED') {
    return { ok: false, error: 'CrossTx appointment already marked completed.' };
  }
  if (input.currentWorkflowStatus === 'NOT_REQUIRED') {
    return { ok: false, error: 'No CrossTx action is required for this order.' };
  }
  if (
    input.currentWorkflowStatus !== 'MANUAL_ACTION_REQUIRED' &&
    input.currentWorkflowStatus !== 'ERROR'
  ) {
    return {
      ok: false,
      error: 'Mark CrossTx Appointment Completed is only available when manual action is required.',
    };
  }
  return { ok: true, next: 'COMPLETED' };
}
