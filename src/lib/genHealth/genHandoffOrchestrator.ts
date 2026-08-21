/**
 * Pure / injectable GEN handoff orchestration for unit tests + Edge scaffold.
 * Does not import Deno. Live GEN calls remain gated by GEN_HEALTH_ENABLED.
 */

import {
  createGenOrder,
  createOrReuseGenPatient,
  planGenHandoff,
  resolveGenProductForSku,
  snapshotRequiredActions,
  type GenClientDeps,
  type GenHealthEnv,
  type GenOrderResponse,
  type GenPatientResponse,
  type GenRequestResult,
  type GenSkuMapping,
  type HandoffOrderItem,
  type HandoffPlanItem,
  type ExistingGenOrderLink,
} from './genHealth';

export type HandoffOrchestrationInput = {
  paymentStatus: string;
  tagadaTransactionId: string | null | undefined;
  mbmOrderId: string;
  patient: {
    email: string;
    firstName?: string;
    lastName?: string;
    existingGenPatientId?: string | null;
  };
  items: HandoffOrderItem[];
  existingLinks: ExistingGenOrderLink[];
  resolveMapping: (sku: string) => GenSkuMapping | null;
  env?: GenHealthEnv;
  deps?: GenClientDeps;
  /** Injectable patient/order creators for tests */
  createPatient?: (
    input: { email: string; firstName?: string; lastName?: string },
    deps?: GenClientDeps,
  ) => Promise<GenRequestResult<GenPatientResponse>>;
  createOrder?: (
    input: {
      patientId: string;
      clientProductId: string;
      paymentStatus: 'paid';
      transactionId: string;
      clientReference?: string;
      quantity?: number;
    },
    deps?: GenClientDeps,
  ) => Promise<GenRequestResult<GenOrderResponse>>;
};

export type HandoffLineResult =
  | { orderItemId: string; mbmSku: string; status: 'skipped_non_rx' }
  | { orderItemId: string; mbmSku: string; status: 'idempotent_skip'; genOrderId: string }
  | { orderItemId: string; mbmSku: string; status: 'blocked'; code: string; message: string }
  | {
      orderItemId: string;
      mbmSku: string;
      status: 'created';
      genOrderId: string;
      requiredActions: ReturnType<typeof snapshotRequiredActions>;
      genOrderStatus?: string;
      persist: {
        handoffStatus: string;
        clinicalStatus: string;
        requiredActionsJson: ReturnType<typeof snapshotRequiredActions>;
      };
    }
  | {
      orderItemId: string;
      mbmSku: string;
      status: 'error';
      code: string;
      retryable: boolean;
      paymentStatusPreserved: 'paid';
      handoffStatus: 'RETRY_REQUIRED' | 'FAILED';
    };

export type HandoffOrchestrationResult =
  | {
      ok: false;
      code: string;
      message: string;
      paymentStatusPreserved?: 'paid';
    }
  | {
      ok: true;
      genPatientId: string | null;
      results: HandoffLineResult[];
      /** True when any line needs admin retry; payment remains paid */
      needsRetry: boolean;
    };

/**
 * Execute GEN handoff plan with mocked or real client.
 * When GEN is disabled, returns GEN_DISABLED without calling fetch.
 */
export async function executeGenHandoff(
  input: HandoffOrchestrationInput,
): Promise<HandoffOrchestrationResult> {
  const plan = planGenHandoff({
    paymentStatus: input.paymentStatus,
    tagadaTransactionId: input.tagadaTransactionId,
    items: input.items,
    existingLinks: input.existingLinks,
    resolveMapping: input.resolveMapping,
  });

  if (!plan.ok) {
    return { ok: false, code: plan.code, message: plan.message };
  }

  const deps: GenClientDeps = {
    ...(input.deps || {}),
    env: input.env ?? input.deps?.env,
  };

  const createPatient = input.createPatient ?? createOrReuseGenPatient;
  const createOrder = input.createOrder ?? createGenOrder;

  let genPatientId = input.patient.existingGenPatientId || null;
  const needsCreate = plan.items.some((i) => i.action === 'create');

  if (needsCreate && !genPatientId) {
    const patientRes = await createPatient(
      {
        email: input.patient.email,
        firstName: input.patient.firstName,
        lastName: input.patient.lastName,
      },
      deps,
    );
    if (!patientRes.ok) {
      return {
        ok: false,
        code: patientRes.error.code,
        message: patientRes.error.message,
        paymentStatusPreserved: 'paid',
      };
    }
    genPatientId = patientRes.data.id;
  }

  const results: HandoffLineResult[] = [];
  let needsRetry = false;

  for (const item of plan.items as HandoffPlanItem[]) {
    if (item.action === 'skip_non_rx') {
      results.push({
        orderItemId: item.orderItemId,
        mbmSku: item.mbmSku,
        status: 'skipped_non_rx',
      });
      continue;
    }
    if (item.action === 'skip_already_linked') {
      results.push({
        orderItemId: item.orderItemId,
        mbmSku: item.mbmSku,
        status: 'idempotent_skip',
        genOrderId: item.genOrderId,
      });
      continue;
    }
    if (item.action === 'blocked') {
      results.push({
        orderItemId: item.orderItemId,
        mbmSku: item.mbmSku,
        status: 'blocked',
        code: item.code,
        message: item.message,
      });
      continue;
    }

    if (!genPatientId) {
      results.push({
        orderItemId: item.orderItemId,
        mbmSku: item.mbmSku,
        status: 'blocked',
        code: 'GEN_PATIENT_REQUIRED',
        message: 'GEN patient id missing',
      });
      continue;
    }

    // Fail-closed re-check
    const resolved = resolveGenProductForSku(item.mbmSku, input.resolveMapping(item.mbmSku));
    if (!resolved.ok) {
      results.push({
        orderItemId: item.orderItemId,
        mbmSku: item.mbmSku,
        status: 'blocked',
        code: resolved.code,
        message: resolved.message,
      });
      continue;
    }

    const orderRes = await createOrder(
      {
        patientId: genPatientId,
        clientProductId: item.genClientProductId,
        paymentStatus: 'paid',
        transactionId: input.tagadaTransactionId!.trim(),
        clientReference: `${input.mbmOrderId}:${item.orderItemId}`,
        quantity: item.quantity,
      },
      deps,
    );

    if (!orderRes.ok) {
      const retryable = orderRes.error.retryable !== false;
      if (retryable) needsRetry = true;
      results.push({
        orderItemId: item.orderItemId,
        mbmSku: item.mbmSku,
        status: 'error',
        code: orderRes.error.code,
        retryable,
        paymentStatusPreserved: 'paid',
        handoffStatus: retryable ? 'RETRY_REQUIRED' : 'FAILED',
      });
      continue;
    }

    const requiredActions = snapshotRequiredActions(orderRes.data.requiredActions);
    results.push({
      orderItemId: item.orderItemId,
      mbmSku: item.mbmSku,
      status: 'created',
      genOrderId: orderRes.data.id,
      requiredActions,
      genOrderStatus: orderRes.data.orderStatus,
      persist: {
        handoffStatus: requiredActions.length ? 'ACTION_REQUIRED' : 'ORDER_CREATED',
        clinicalStatus: requiredActions.length ? 'GEN_ACTION_REQUIRED' : 'GEN_ORDER_CREATED',
        requiredActionsJson: requiredActions,
      },
    });
  }

  return { ok: true, genPatientId, results, needsRetry };
}

/** Webhook duplicate detection helper (pure). */
export function isDuplicateWebhookEvent(input: {
  existingExternalEventId: string | null;
  incomingExternalEventId: string | null;
  existingContentHash: string | null;
  incomingContentHash: string;
}): boolean {
  if (
    input.incomingExternalEventId &&
    input.existingExternalEventId &&
    input.incomingExternalEventId === input.existingExternalEventId
  ) {
    return true;
  }
  if (input.existingContentHash && input.existingContentHash === input.incomingContentHash) {
    return true;
  }
  return false;
}
