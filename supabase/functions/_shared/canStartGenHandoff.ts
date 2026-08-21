/**
 * Phase 12G — GEN handoff eligibility gate (pure; no HTTP).
 * Automatic path requires GEN_HANDOFF_AUTOMATION_ENABLED; otherwise ELIGIBLE_BUT_AUTOMATION_OFF.
 */

import { isGenSkuMappingCallable } from './genHealthConfig.ts';
import type { GenSkuMapping } from './genHealthTypes.ts';

export type GenHandoffGateCode =
  | 'ELIGIBLE'
  | 'ELIGIBLE_BUT_AUTOMATION_OFF'
  | 'UNPAID'
  | 'MISSING_TRANSACTION_ID'
  | 'NOT_RX'
  | 'MISSING_SKU'
  | 'MAPPING_BLOCKED'
  | 'MAPPING_MISSING'
  | 'MISSING_GEN_PRODUCT_ID'
  | 'ALREADY_LINKED'
  | 'GEN_DISABLED'
  | 'GEN_FAILURE_PRESERVE_PAID';

export type CanStartGenHandoffInput = {
  paymentStatus: string;
  tagadaTransactionId: string | null | undefined;
  orderItemIsRxMedication: boolean;
  mbmSku: string | null | undefined;
  mapping: GenSkuMapping | null | undefined;
  existingGenOrderId: string | null | undefined;
  genHealthEnabled: boolean;
  handoffAutomationEnabled: boolean;
};

export type CanStartGenHandoffResult = {
  ok: boolean;
  code: GenHandoffGateCode;
  message: string;
  /** When ok and automation on — may call GEN. When ELIGIBLE_BUT_AUTOMATION_OFF — do not call GEN. */
  mayCallGen: boolean;
};

/**
 * Single server-side eligibility check for post-paid GEN handoff (per order item).
 */
export function canStartGenHandoff(input: CanStartGenHandoffInput): CanStartGenHandoffResult {
  if (input.paymentStatus !== 'paid') {
    return {
      ok: false,
      code: 'UNPAID',
      message: 'GEN handoff requires payment_status=paid.',
      mayCallGen: false,
    };
  }
  if (!input.tagadaTransactionId?.trim()) {
    return {
      ok: false,
      code: 'MISSING_TRANSACTION_ID',
      message: 'GEN handoff requires verified Tagada transaction id.',
      mayCallGen: false,
    };
  }
  if (!input.orderItemIsRxMedication) {
    return {
      ok: false,
      code: 'NOT_RX',
      message: 'GEN medication handoff is only for Rx medication lines.',
      mayCallGen: false,
    };
  }
  const sku = (input.mbmSku || '').trim();
  if (!sku) {
    return {
      ok: false,
      code: 'MISSING_SKU',
      message: 'Order item is missing mbm_sku.',
      mayCallGen: false,
    };
  }
  if (input.existingGenOrderId?.trim()) {
    return {
      ok: false,
      code: 'ALREADY_LINKED',
      message: 'GEN order already exists for this order item (idempotent skip).',
      mayCallGen: false,
    };
  }
  if (!input.mapping) {
    return {
      ok: false,
      code: 'MAPPING_MISSING',
      message: 'No gen_sku_map row for this SKU.',
      mayCallGen: false,
    };
  }
  if (!isGenSkuMappingCallable(input.mapping.mappingStatus) || input.mapping.active === false) {
    return {
      ok: false,
      code: 'MAPPING_BLOCKED',
      message: `gen_sku_map status ${input.mapping.mappingStatus} is not READY/ACTIVE.`,
      mayCallGen: false,
    };
  }
  if (!input.mapping.genClientProductId?.trim()) {
    return {
      ok: false,
      code: 'MISSING_GEN_PRODUCT_ID',
      message: 'READY/ACTIVE mapping is missing gen_client_product_id.',
      mayCallGen: false,
    };
  }
  if (!input.genHealthEnabled) {
    return {
      ok: false,
      code: 'GEN_DISABLED',
      message: 'GEN_HEALTH_ENABLED is not true.',
      mayCallGen: false,
    };
  }
  if (!input.handoffAutomationEnabled) {
    return {
      ok: true,
      code: 'ELIGIBLE_BUT_AUTOMATION_OFF',
      message:
        'Order item is eligible for GEN handoff but GEN_HANDOFF_AUTOMATION_ENABLED is false — do not call GEN.',
      mayCallGen: false,
    };
  }
  return {
    ok: true,
    code: 'ELIGIBLE',
    message: 'Eligible for GEN handoff.',
    mayCallGen: true,
  };
}

/**
 * Payment must never be reverted when GEN fails after Tagada paid.
 */
export function paymentStatusAfterGenFailure(currentPaymentStatus: string): string {
  return currentPaymentStatus === 'paid' ? 'paid' : currentPaymentStatus;
}

export function genFailureHandoffStatus(): 'GEN_RETRY_REQUIRED' | 'GEN_ERROR' {
  return 'GEN_RETRY_REQUIRED';
}
