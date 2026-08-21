/**
 * Phase 12F — post-paid GEN queue preparation (no GEN HTTP).
 * Does not invoke gen-health-handoff. Automation remains off until a later phase.
 */

export type GenQueuePrepStatus =
  | 'NOT_APPLICABLE'
  | 'QUEUED_PENDING'
  | 'BLOCKED_NO_GEN_MAP'
  | 'BLOCKED_UNPAID'
  | 'BLOCKED_MISSING_TX'
  | 'SKIPPED_AUTOMATION_OFF';

export interface PostPaidGenQueueLine {
  orderItemId: string;
  mbmSku: string;
  commerceType: 'RX_MEDICATION' | string;
  genMappingReady: boolean;
}

export interface PreparePostPaidGenQueueInput {
  paymentStatus: string;
  externalPaymentId: string | null | undefined;
  automationEnabled: boolean;
  queuePrepEnabled: boolean;
  lines: PostPaidGenQueueLine[];
}

export interface PreparePostPaidGenQueueResult {
  status: GenQueuePrepStatus;
  eligibleLineCount: number;
  blockedLineCount: number;
  reason: string;
}

/**
 * Decide queue outcome after Tagada webhook marks an order paid.
 * Never creates a GEN clinical order.
 */
export function preparePostPaidGenQueue(
  input: PreparePostPaidGenQueueInput,
): PreparePostPaidGenQueueResult {
  const rxLines = input.lines.filter((l) => l.commerceType === 'RX_MEDICATION');
  if (rxLines.length === 0) {
    return {
      status: 'NOT_APPLICABLE',
      eligibleLineCount: 0,
      blockedLineCount: 0,
      reason: 'No Rx medication lines — accessories/membership/visits skip GEN queue.',
    };
  }

  if (input.paymentStatus !== 'paid') {
    return {
      status: 'BLOCKED_UNPAID',
      eligibleLineCount: 0,
      blockedLineCount: rxLines.length,
      reason: 'GEN queue requires payment_status=paid.',
    };
  }

  if (!input.externalPaymentId?.trim()) {
    return {
      status: 'BLOCKED_MISSING_TX',
      eligibleLineCount: 0,
      blockedLineCount: rxLines.length,
      reason: 'GEN queue requires verified Tagada external_payment_id.',
    };
  }

  if (!input.queuePrepEnabled || !input.automationEnabled) {
    return {
      status: 'SKIPPED_AUTOMATION_OFF',
      eligibleLineCount: rxLines.filter((l) => l.genMappingReady).length,
      blockedLineCount: rxLines.filter((l) => !l.genMappingReady).length,
      reason:
        'GEN post-paid queue prep recorded as skipped — automation/handoff flags are off (Phase 12F).',
    };
  }

  const ready = rxLines.filter((l) => l.genMappingReady);
  const blocked = rxLines.filter((l) => !l.genMappingReady);
  if (ready.length === 0) {
    return {
      status: 'BLOCKED_NO_GEN_MAP',
      eligibleLineCount: 0,
      blockedLineCount: blocked.length,
      reason: 'No READY/ACTIVE gen_sku_map rows for paid Rx lines.',
    };
  }

  return {
    status: 'QUEUED_PENDING',
    eligibleLineCount: ready.length,
    blockedLineCount: blocked.length,
    reason: 'Eligible Rx lines may be upserted as PENDING without calling GEN HTTP.',
  };
}
