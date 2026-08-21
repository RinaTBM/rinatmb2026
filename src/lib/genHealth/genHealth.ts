/**
 * GEN Health V2 client + pure helpers (Phase 12D scaffolding).
 * Outbound HTTP is gated by GEN_HEALTH_ENABLED — default false.
 * Unit tests mock fetch; production paths must not call while disabled.
 */

import {
  assertGenHealthCallable,
  isGenSkuMappingCallable,
  resolveGenHealthConfig,
  type GenHealthConfig,
  type GenHealthEnv,
} from './genHealthConfig';
import type {
  GenApiError,
  GenHandoffStatus,
  GenLogContext,
  GenOrderCreateInput,
  GenOrderResponse,
  GenPatientInput,
  GenPatientResponse,
  GenPrescription,
  GenRequiredAction,
  GenSkuMapping,
  GenSkuResolveResult,
} from './genHealthTypes';
import {
  normalizeGenClinicalStatus,
  normalizePharmacyShipmentStatus,
} from './clinicalStatus';
export {
  normalizeGenClinicalStatus,
  normalizeRequiredAction,
  normalizeRequiredActionsList,
  categorizeRequiredActionType,
  normalizePharmacyShipmentStatus,
  buildSafeCustomerClinicalLine,
  portalStageFromClinical,
  portalStageCopy,
  customerMayMarkRequiredActionCompleteLocally,
  browserMayWriteClinicalStatus,
  adminGenStatusRefreshRequiresAuth,
  customerClinicalStatusReadsLocalStateOnly,
} from './clinicalStatus';
export type {
  RequiredActionCategory,
  NormalizedRequiredAction,
  PharmacyShipmentStatus,
  PortalClinicalStage,
  SafeCustomerClinicalLine,
} from './clinicalStatus';

export {
  assertGenHealthCallable,
  isGenSkuMappingCallable,
  resolveGenHealthConfig,
  GEN_HEALTH_DEFAULT_BASE_URL,
  GEN_SKU_MAP_CALLABLE_STATUSES,
} from './genHealthConfig';
export type { GenHealthConfig, GenHealthEnv } from './genHealthConfig';
export type * from './genHealthTypes';
export {
  canStartGenHandoff,
  paymentStatusAfterGenFailure,
  genFailureHandoffStatus,
} from './canStartGenHandoff';
export type { CanStartGenHandoffInput, CanStartGenHandoffResult, GenHandoffGateCode } from './canStartGenHandoff';
export {
  classifyGenMatch,
  additiveChangeRequiresNewSku,
  formChangeRequiresNewSku,
  proposeNextInjectionSku,
  costAnalysisRow,
} from './genCatalogMatching';

const DEFAULT_TIMEOUT_MS = 15_000;

export function createCorrelationId(prefix = 'gen'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Safe structured log line — never includes secrets or PHI payloads. */
export function formatGenLog(ctx: GenLogContext): string {
  const parts = [
    `op=${ctx.operation}`,
    ctx.correlationId ? `cid=${ctx.correlationId}` : null,
    ctx.mbmOrderId ? `mbmOrder=${ctx.mbmOrderId}` : null,
    ctx.mbmOrderItemId ? `mbmItem=${ctx.mbmOrderItemId}` : null,
    ctx.mbmSku ? `sku=${ctx.mbmSku}` : null,
    ctx.genOrderId ? `genOrder=${ctx.genOrderId}` : null,
    ctx.tagadaTransactionId ? `tagadaTx=${ctx.tagadaTransactionId}` : null,
    ctx.attempt != null ? `attempt=${ctx.attempt}` : null,
    ctx.httpStatus != null ? `http=${ctx.httpStatus}` : null,
    ctx.safeErrorCode ? `err=${ctx.safeErrorCode}` : null,
  ].filter(Boolean);
  return `[gen-health] ${parts.join(' ')}`;
}

export function classifyGenHttpError(httpStatus: number | undefined): {
  retryable: boolean;
  code: string;
} {
  if (httpStatus == null) return { retryable: true, code: 'GEN_NETWORK_ERROR' };
  if (httpStatus === 408 || httpStatus === 429) return { retryable: true, code: 'GEN_RETRYABLE_HTTP' };
  if (httpStatus >= 500) return { retryable: true, code: 'GEN_SERVER_ERROR' };
  if (httpStatus >= 400) return { retryable: false, code: 'GEN_CLIENT_ERROR' };
  return { retryable: false, code: 'GEN_HTTP_ERROR' };
}

export type GenRequestOptions = {
  method?: string;
  path: string;
  body?: unknown;
  timeoutMs?: number;
  correlationId?: string;
  fetchImpl?: typeof fetch;
  env?: GenHealthEnv;
  config?: GenHealthConfig;
};

export type GenRequestResult<T> =
  | { ok: true; data: T; httpStatus: number; correlationId: string }
  | { ok: false; error: GenApiError; correlationId: string };

/**
 * Low-level GEN HTTP wrapper. Short-circuits when disabled.
 */
export async function genRequest<T = unknown>(
  opts: GenRequestOptions,
): Promise<GenRequestResult<T>> {
  const correlationId = opts.correlationId || createCorrelationId();
  const config = opts.config ?? resolveGenHealthConfig(opts.env ?? {});
  const gate = assertGenHealthCallable(config);
  if (!gate.ok) {
    return {
      ok: false,
      correlationId,
      error: { code: gate.code, message: gate.message, retryable: false },
    };
  }

  const method = (opts.method || 'GET').toUpperCase();
  const url = `${gate.config.baseUrl}${opts.path.startsWith('/') ? opts.path : `/${opts.path}`}`;
  const fetchImpl = opts.fetchImpl ?? fetch;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetchImpl(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-API-Key': gate.config.apiKey,
        'X-Correlation-Id': correlationId,
      },
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      signal: controller.signal,
    });

    const httpStatus = res.status;
    let parsed: unknown = null;
    const text = await res.text();
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { unparsed: true };
      }
    }

    if (!res.ok) {
      const cls = classifyGenHttpError(httpStatus);
      // Extract only safe, non-PHI error codes/messages from GEN error JSON.
      let safeDetail: string | undefined;
      const collect = (node: unknown, depth = 0): void => {
        if (safeDetail || depth > 3 || node == null) return;
        if (typeof node === 'string') {
          const c = node.trim();
          if (c && c.length < 240 && !(/@|street|dob|ssn/i.test(c) && c.length > 80)) {
            safeDetail = c;
          }
          return;
        }
        if (Array.isArray(node)) {
          for (const item of node.slice(0, 5)) collect(item, depth + 1);
          return;
        }
        if (typeof node === 'object') {
          const pr = node as Record<string, unknown>;
          for (const key of ['code', 'error', 'errorCode', 'message', 'msg', 'detail', 'title', 'remediation']) {
            if (key in pr) collect(pr[key], depth + 1);
            if (safeDetail) return;
          }
        }
      };
      collect(parsed);
      return {
        ok: false,
        correlationId,
        error: {
          code: cls.code,
          message: safeDetail
            ? `GEN request failed with HTTP ${httpStatus}: ${safeDetail}`
            : `GEN request failed with HTTP ${httpStatus}`,
          httpStatus,
          retryable: cls.retryable,
        },
      };
    }

    return { ok: true, data: parsed as T, httpStatus, correlationId };
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError';
    return {
      ok: false,
      correlationId,
      error: {
        code: aborted ? 'GEN_TIMEOUT' : 'GEN_NETWORK_ERROR',
        message: aborted ? 'GEN request timed out' : 'GEN network error',
        retryable: true,
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Fail-closed SKU → GEN product resolution (pure; caller supplies map row). */
export function resolveGenProductForSku(
  mbmSku: string,
  mapping: GenSkuMapping | null | undefined,
): GenSkuResolveResult {
  if (!mapping || mapping.mbmSku !== mbmSku) {
    return {
      ok: false,
      code: 'GEN_SKU_NOT_FOUND',
      message: `No gen_sku_map row for SKU ${mbmSku}`,
    };
  }
  if (!mapping.active) {
    return {
      ok: false,
      code: 'GEN_SKU_INACTIVE',
      message: `gen_sku_map row inactive for SKU ${mbmSku}`,
    };
  }
  if (!isGenSkuMappingCallable(mapping.mappingStatus)) {
    return {
      ok: false,
      code: 'GEN_SKU_BLOCKED',
      message: `gen_sku_map status ${mapping.mappingStatus} is not callable for SKU ${mbmSku}`,
    };
  }
  const productId = mapping.genClientProductId?.trim() || null;
  if (!productId) {
    return {
      ok: false,
      code: 'GEN_SKU_MISSING_PRODUCT_ID',
      message: `gen_client_product_id missing for SKU ${mbmSku}`,
    };
  }
  return {
    ok: true,
    mapping,
    genClientProductId: productId,
    status: mapping.mappingStatus as 'ACTIVE' | 'READY',
  };
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

export function parseGenPatientResponse(raw: unknown): GenPatientResponse | null {
  const r = asRecord(raw);
  if (!r) return null;
  const data = asRecord(r.data);
  const patient = asRecord(r.patient) || asRecord(data?.patient);
  const id =
    asString(r.id) ||
    asString(r.patientId) ||
    asString(r.patient_id) ||
    asString(data?.patientId) ||
    asString(data?.patient_id) ||
    asString(data?.id) ||
    asString(patient?.id) ||
    asString(patient?.patientId);
  if (!id) return null;
  const email =
    asString(r.email) ||
    asString(data?.email) ||
    asString(patient?.email) ||
    undefined;
  return { id, email: email ?? undefined, raw };
}

export function parseGenOrderResponse(raw: unknown): GenOrderResponse | null {
  const r = asRecord(raw);
  if (!r) return null;
  const data = asRecord(r.data);
  const nestedOrder =
    asRecord(r.order) ||
    asRecord(data?.order) ||
    null;
  const id =
    asString(r.id) ||
    asString(r.orderId) ||
    asString(r.order_id) ||
    asString(data?.orderId) ||
    asString(data?.id) ||
    asString(data?.order_id) ||
    asString(nestedOrder?.id) ||
    asString(nestedOrder?.orderId) ||
    asString(nestedOrder?.order_id);
  if (!id) return null;
  const orderStatus =
    asString(r.orderStatus) ||
    asString(r.order_status) ||
    asString(r.status) ||
    asString(data?.orderStatus) ||
    asString(data?.status) ||
    asString(nestedOrder?.orderStatus) ||
    asString(nestedOrder?.status) ||
    undefined;
  const actionsRaw =
    r.requiredActions ??
    r.required_actions ??
    data?.requiredActions ??
    data?.required_actions ??
    nestedOrder?.requiredActions ??
    nestedOrder?.required_actions;
  const continuationFromEnvelope =
    asString(data?.magicLink) ||
    asString(r.magicLink) ||
    asString(nestedOrder?.magicLink) ||
    undefined;
  // Never persist magic-login tokens / email-bearing one-time links in MBM DB.
  const safeContinuation =
    continuationFromEnvelope &&
    !/magic-login|token=/i.test(continuationFromEnvelope)
      ? continuationFromEnvelope
      : undefined;
  const requiredActions: GenRequiredAction[] | undefined = Array.isArray(actionsRaw)
    ? actionsRaw.map((a, idx) => {
        if (typeof a === 'string') {
          const token = a.trim();
          return {
            id: `gen-action-${token || idx}`,
            type: token,
            title: token,
            url: safeContinuation,
          };
        }
        const ar = asRecord(a) || {};
        const rawUrl =
          asString(ar.url) ??
          asString(ar.href) ??
          asString(ar.continuationUrl) ??
          safeContinuation;
        const url =
          rawUrl && !/magic-login|token=/i.test(rawUrl) ? rawUrl : undefined;
        return {
          id: asString(ar.id) ?? undefined,
          type: asString(ar.type) ?? asString(ar.actionType) ?? undefined,
          title:
            asString(ar.title) ??
            asString(ar.name) ??
            asString(ar.label) ??
            asString(ar.type) ??
            undefined,
          status: asString(ar.status) ?? undefined,
          url,
          raw: a,
        };
      })
    : undefined;
  return { id, orderStatus, requiredActions, raw };
}

export type GenClientDeps = {
  env?: GenHealthEnv;
  config?: GenHealthConfig;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

export async function createOrReuseGenPatient(
  input: GenPatientInput,
  deps: GenClientDeps = {},
): Promise<GenRequestResult<GenPatientResponse>> {
  // GEN V2 expects a nested `patient` object (confirmed by API 400 remediation paths).
  const patient: Record<string, unknown> = {
    email: input.email,
  };
  if (input.firstName) patient.firstName = input.firstName;
  if (input.lastName) patient.lastName = input.lastName;
  if (input.phone) patient.phone = input.phone;
  if (input.dateOfBirth) patient.dateOfBirth = input.dateOfBirth;
  if (input.address) {
    const a: Record<string, unknown> = {};
    if (input.address.street1) a.street1 = input.address.street1;
    if (input.address.street2) a.street2 = input.address.street2;
    if (input.address.city) a.city = input.address.city;
    if (input.address.state) a.state = input.address.state;
    if (input.address.zip) a.zip = input.address.zip;
    if (input.address.country) a.country = input.address.country;
    patient.address = a;
  }
  if (input.extra) Object.assign(patient, input.extra);

  const body: Record<string, unknown> = { patient };

  const res = await genRequest<unknown>({
    method: 'POST',
    path: '/v2/client/patients',
    body,
    ...deps,
  });
  if (!res.ok) return res;
  const parsed = parseGenPatientResponse(res.data);
  if (!parsed) {
    return {
      ok: false,
      correlationId: res.correlationId,
      error: {
        code: 'GEN_PATIENT_PARSE_ERROR',
        message: 'GEN patient response missing id',
        httpStatus: res.httpStatus,
        retryable: false,
      },
    };
  }
  return { ok: true, data: parsed, httpStatus: res.httpStatus, correlationId: res.correlationId };
}

export async function createGenOrder(
  input: GenOrderCreateInput,
  deps: GenClientDeps = {},
): Promise<GenRequestResult<GenOrderResponse>> {
  if (input.paymentStatus !== 'paid') {
    return {
      ok: false,
      correlationId: createCorrelationId(),
      error: {
        code: 'GEN_PAYMENT_NOT_PAID',
        message: 'createGenOrder requires paymentStatus=paid after Tagada verification',
        retryable: false,
      },
    };
  }
  // GEN V2 order create shape (confirmed via staging 400 remediation + probe):
  // { patient_id, order: { clientProductId, transactionId, ... } }
  // Nested patientId alone is rejected. payment_status requires GEN "API Orders"
  // enablement — omit unless GEN_API_ORDERS_PAYMENT_STATUS_ENABLED=true.
  const order: Record<string, unknown> = {
    clientProductId: input.clientProductId,
    transactionId: input.transactionId,
  };
  if (input.clientReference) order.clientReference = input.clientReference;
  if (input.quantity != null) order.quantity = input.quantity;

  const env = deps.env;
  const allowPaymentStatus =
    String(env?.GEN_API_ORDERS_PAYMENT_STATUS_ENABLED || '').toLowerCase() === 'true';
  if (allowPaymentStatus) {
    order.payment_status = 'paid';
  }
  if (input.extra) Object.assign(order, input.extra);

  const res = await genRequest<unknown>({
    method: 'POST',
    path: '/v2/client/orders',
    body: {
      patient_id: input.patientId,
      order,
    },
    ...deps,
  });
  if (!res.ok) return res;
  const parsed = parseGenOrderResponse(res.data);
  if (!parsed) {
    return {
      ok: false,
      correlationId: res.correlationId,
      error: {
        code: 'GEN_ORDER_PARSE_ERROR',
        message: 'GEN order response missing id',
        httpStatus: res.httpStatus,
        retryable: false,
      },
    };
  }
  return { ok: true, data: parsed, httpStatus: res.httpStatus, correlationId: res.correlationId };
}

export async function getGenOrder(
  genOrderId: string,
  deps: GenClientDeps = {},
): Promise<GenRequestResult<GenOrderResponse>> {
  const res = await genRequest<unknown>({
    method: 'GET',
    path: `/v2/client/orders/${encodeURIComponent(genOrderId)}`,
    ...deps,
  });
  if (!res.ok) return res;
  const parsed = parseGenOrderResponse(res.data);
  if (!parsed) {
    return {
      ok: false,
      correlationId: res.correlationId,
      error: {
        code: 'GEN_ORDER_PARSE_ERROR',
        message: 'GEN GET order response missing id',
        httpStatus: res.httpStatus,
        retryable: false,
      },
    };
  }
  return { ok: true, data: parsed, httpStatus: res.httpStatus, correlationId: res.correlationId };
}

/**
 * Prescriptions-by-order path not fully confirmed in-repo.
 * Uses a provisional path; treat failures as TBD until API reference verified.
 */
export async function getPrescriptionsForOrder(
  genOrderId: string,
  deps: GenClientDeps = {},
): Promise<GenRequestResult<GenPrescription[]>> {
  const res = await genRequest<unknown>({
    method: 'GET',
    path: `/v2/client/orders/${encodeURIComponent(genOrderId)}/prescriptions`,
    ...deps,
  });
  if (!res.ok) return res;
  const list = Array.isArray(res.data)
    ? res.data
    : Array.isArray(asRecord(res.data)?.prescriptions)
      ? (asRecord(res.data)!.prescriptions as unknown[])
      : [];
  const prescriptions: GenPrescription[] = list.map((p) => {
    const r = asRecord(p) || {};
    return {
      id: asString(r.id) ?? undefined,
      orderId: asString(r.orderId) ?? asString(r.order_id) ?? genOrderId,
      status: asString(r.status) ?? undefined,
      raw: p,
    };
  });
  return {
    ok: true,
    data: prescriptions,
    httpStatus: res.httpStatus,
    correlationId: res.correlationId,
  };
}

/** Alias used by Phase 12I.5 docs — same as createOrReuseGenPatient. */
export const ensureGenPatient = createOrReuseGenPatient;

/**
 * Create GEN order without requiring nested payment_status.
 * Two-phase external-paid flow: create unpaid → Tagada verify → markPaid.
 * transactionId may be omitted until mark-paid if GEN allows; prefer including
 * verified Tagada id when already known (current MBM post-paid create path).
 */
export async function createGenOrderUnpaid(
  input: {
    patientId: string;
    clientProductId: string;
    transactionId?: string;
    clientReference?: string;
    quantity?: number;
    extra?: Record<string, unknown>;
  },
  deps: GenClientDeps = {},
): Promise<GenRequestResult<GenOrderResponse>> {
  const order: Record<string, unknown> = {
    clientProductId: input.clientProductId,
  };
  if (input.transactionId) order.transactionId = input.transactionId;
  if (input.clientReference) order.clientReference = input.clientReference;
  if (input.quantity != null) order.quantity = input.quantity;
  // Never send payment_status on unpaid create.
  if (input.extra) Object.assign(order, input.extra);

  const res = await genRequest<unknown>({
    method: 'POST',
    path: '/v2/client/orders',
    body: {
      patient_id: input.patientId,
      order,
    },
    ...deps,
  });
  if (!res.ok) {
    return {
      ok: false,
      correlationId: res.correlationId,
      error: {
        ...res.error,
        code: res.error.code === 'GEN_CLIENT_ERROR' ? 'GEN_ORDER_CREATE_ERROR' : res.error.code,
      },
    };
  }
  const parsed = parseGenOrderResponse(res.data);
  if (!parsed) {
    return {
      ok: false,
      correlationId: res.correlationId,
      error: {
        code: 'GEN_ORDER_CREATE_ERROR',
        message: 'GEN order response missing id',
        httpStatus: res.httpStatus,
        retryable: false,
      },
    };
  }
  return { ok: true, data: parsed, httpStatus: res.httpStatus, correlationId: res.correlationId };
}

/**
 * PATCH GEN order to paid after verified Tagada payment.
 * Requires GEN_API_ORDERS_ENABLED=true. No workaround when capability is off.
 */
export async function markGenOrderPaid(
  input: { genOrderId: string; transactionId: string },
  deps: GenClientDeps = {},
): Promise<GenRequestResult<GenOrderResponse>> {
  const tx = (input.transactionId || '').trim();
  const oid = (input.genOrderId || '').trim();
  if (!oid || !tx) {
    return {
      ok: false,
      correlationId: createCorrelationId(),
      error: {
        code: 'GEN_MARK_PAID_ERROR',
        message: 'genOrderId and transactionId are required',
        retryable: false,
      },
    };
  }

  const env = deps.env ?? {};
  const apiOrdersOn =
    String((env as GenHealthEnv).GEN_API_ORDERS_ENABLED || '').toLowerCase() === 'true';
  if (!apiOrdersOn) {
    return {
      ok: false,
      correlationId: createCorrelationId(),
      error: {
        code: 'GEN_API_ORDERS_DISABLED',
        message: 'GEN API Orders capability is not enabled for this client',
        retryable: false,
      },
    };
  }

  const res = await genRequest<unknown>({
    method: 'PATCH',
    path: `/v2/client/orders/${encodeURIComponent(oid)}`,
    body: {
      payment_status: 'paid',
      transaction_id: tx,
    },
    ...deps,
  });

  if (!res.ok) {
    let code = 'GEN_MARK_PAID_ERROR';
    if (res.error.httpStatus === 403) code = 'GEN_API_ORDERS_DISABLED';
    else if (res.error.httpStatus === 409) {
      // Duplicate / not pending — treat as conflict; caller may interpret already-paid.
      code = 'GEN_CONFLICT';
    }
    return {
      ok: false,
      correlationId: res.correlationId,
      error: { ...res.error, code },
    };
  }

  const parsed = parseGenOrderResponse(res.data) || { id: oid, raw: res.data };
  return { ok: true, data: parsed, httpStatus: res.httpStatus, correlationId: res.correlationId };
}

/** Pure eligibility for GEN mark-paid — Tagada remains payment authority. */
export function assertGenMarkPaidEligible(input: {
  mbmPaymentStatus: string | null | undefined;
  tagadaTransactionId: string | null | undefined;
  genOrderId: string | null | undefined;
  genMappingReady: boolean;
  isRx: boolean;
  genApiOrdersEnabled: boolean;
}): { ok: true } | { ok: false; code: string; message: string } {
  if (!input.isRx) {
    return { ok: false, code: 'GEN_SKIP_NON_RX', message: 'Non-Rx lines do not invoke GEN mark-paid' };
  }
  if (input.mbmPaymentStatus !== 'paid') {
    return {
      ok: false,
      code: 'GEN_PAYMENT_NOT_PAID',
      message: 'MBM order must be paid via verified Tagada before GEN mark-paid',
    };
  }
  if (!input.tagadaTransactionId?.trim()) {
    return {
      ok: false,
      code: 'GEN_MARK_PAID_ERROR',
      message: 'Verified Tagada transaction ID required',
    };
  }
  if (!input.genMappingReady) {
    return { ok: false, code: 'GEN_MAPPING_NOT_READY', message: 'GEN mapping must be READY/ACTIVE' };
  }
  if (!input.genOrderId?.trim()) {
    return { ok: false, code: 'GEN_ORDER_CREATE_ERROR', message: 'GEN order must exist before mark-paid' };
  }
  if (!input.genApiOrdersEnabled) {
    return {
      ok: false,
      code: 'GEN_API_ORDERS_DISABLED',
      message: 'GEN API Orders capability is not enabled',
    };
  }
  return { ok: true };
}

/** GET /v2/client/products/:id/forms — GEN intake schema source of truth. */
export async function getGenProductForms(
  genProductId: string,
  deps: GenClientDeps = {},
): Promise<GenRequestResult<unknown>> {
  const id = (genProductId || '').trim();
  if (!id) {
    return {
      ok: false,
      correlationId: createCorrelationId(),
      error: {
        code: 'GEN_FORM_FETCH_ERROR',
        message: 'product id required',
        retryable: false,
      },
    };
  }
  const res = await genRequest<unknown>({
    method: 'GET',
    path: `/v2/client/products/${encodeURIComponent(id)}/forms`,
    ...deps,
  });
  if (!res.ok) {
    return {
      ok: false,
      correlationId: res.correlationId,
      error: {
        ...res.error,
        code: res.error.httpStatus === 404 ? 'GEN_FORM_FETCH_ERROR' : res.error.code || 'GEN_FORM_FETCH_ERROR',
      },
    };
  }
  return res;
}

/** POST /v2/client/orders/:id/forms/submissions — white-label form submit. */
export async function submitGenOrderForm(
  input: {
    genOrderId: string;
    formId?: string;
    answers: Record<string, unknown>;
  },
  deps: GenClientDeps = {},
): Promise<GenRequestResult<unknown>> {
  const oid = (input.genOrderId || '').trim();
  if (!oid) {
    return {
      ok: false,
      correlationId: createCorrelationId(),
      error: {
        code: 'GEN_FORM_SUBMIT_ERROR',
        message: 'genOrderId required',
        retryable: false,
      },
    };
  }
  // Never log answers. Body forwarded to GEN only.
  const body: Record<string, unknown> = {
    answers: input.answers,
  };
  if (input.formId) body.formId = input.formId;

  const res = await genRequest<unknown>({
    method: 'POST',
    path: `/v2/client/orders/${encodeURIComponent(oid)}/forms/submissions`,
    body,
    ...deps,
  });
  if (!res.ok) {
    return {
      ok: false,
      correlationId: res.correlationId,
      error: { ...res.error, code: 'GEN_FORM_SUBMIT_ERROR' },
    };
  }
  return res;
}

/** GET /v2/client/prescriptions — patient-scoped list when supported. */
export async function listGenPrescriptions(
  input: { patientId?: string; orderId?: string } = {},
  deps: GenClientDeps = {},
): Promise<GenRequestResult<GenPrescription[]>> {
  const qs = new URLSearchParams();
  if (input.patientId) qs.set('patient_id', input.patientId);
  if (input.orderId) qs.set('order_id', input.orderId);
  const q = qs.toString();
  const res = await genRequest<unknown>({
    method: 'GET',
    path: `/v2/client/prescriptions${q ? `?${q}` : ''}`,
    ...deps,
  });
  if (!res.ok) {
    return {
      ok: false,
      correlationId: res.correlationId,
      error: { ...res.error, code: 'GEN_PRESCRIPTION_SYNC_ERROR' },
    };
  }
  const root = asRecord(res.data);
  const list = Array.isArray(res.data)
    ? res.data
    : Array.isArray(root?.prescriptions)
      ? (root!.prescriptions as unknown[])
      : Array.isArray(root?.data)
        ? (root!.data as unknown[])
        : [];
  const prescriptions: GenPrescription[] = list.map((p) => {
    const r = asRecord(p) || {};
    return {
      id: asString(r.id) ?? undefined,
      orderId: asString(r.orderId) ?? asString(r.order_id) ?? input.orderId,
      status: asString(r.status) ?? undefined,
      raw: p,
    };
  });
  return {
    ok: true,
    data: prescriptions,
    httpStatus: res.httpStatus,
    correlationId: res.correlationId,
  };
}

/** Conversations list — wrapper readiness; path follows GEN V2 docs. */
export async function listGenConversations(
  input: { patientId?: string } = {},
  deps: GenClientDeps = {},
): Promise<GenRequestResult<unknown>> {
  const qs = input.patientId ? `?patient_id=${encodeURIComponent(input.patientId)}` : '';
  const res = await genRequest<unknown>({
    method: 'GET',
    path: `/v2/client/conversations${qs}`,
    ...deps,
  });
  if (!res.ok) {
    return {
      ok: false,
      correlationId: res.correlationId,
      error: { ...res.error, code: 'GEN_MESSAGE_ERROR' },
    };
  }
  return res;
}

export async function sendGenConversationMessage(
  input: { conversationId: string; body: string },
  deps: GenClientDeps = {},
): Promise<GenRequestResult<unknown>> {
  const cid = (input.conversationId || '').trim();
  const body = (input.body || '').trim();
  if (!cid || !body) {
    return {
      ok: false,
      correlationId: createCorrelationId(),
      error: {
        code: 'GEN_MESSAGE_ERROR',
        message: 'conversationId and body required',
        retryable: false,
      },
    };
  }
  // Do not log message body.
  const res = await genRequest<unknown>({
    method: 'POST',
    path: `/v2/client/conversations/${encodeURIComponent(cid)}/messages`,
    body: { body },
    ...deps,
  });
  if (!res.ok) {
    return {
      ok: false,
      correlationId: res.correlationId,
      error: { ...res.error, code: 'GEN_MESSAGE_ERROR' },
    };
  }
  return res;
}

/** Visits wrapper readiness — list patient visits (documented GEN path). */
export async function listGenVisits(
  input: { patientId?: string } = {},
  deps: GenClientDeps = {},
): Promise<GenRequestResult<unknown>> {
  const qs = input.patientId ? `?patient_id=${encodeURIComponent(input.patientId)}` : '';
  return genRequest<unknown>({
    method: 'GET',
    path: `/v2/client/visits${qs}`,
    ...deps,
  });
}

/** Labs wrapper readiness — list patient labs (documented GEN path). */
export async function listGenLabs(
  input: { patientId?: string } = {},
  deps: GenClientDeps = {},
): Promise<GenRequestResult<unknown>> {
  const qs = input.patientId ? `?patient_id=${encodeURIComponent(input.patientId)}` : '';
  return genRequest<unknown>({
    method: 'GET',
    path: `/v2/client/labs${qs}`,
    ...deps,
  });
}

/**
 * Upload wrapper readiness — documented pattern only.
 * Returns deferred until GEN upload/token path is confirmed in staging.
 */
export function uploadsWrapperStatus(): {
  status: 'DEFERRED';
  reason: string;
} {
  return {
    status: 'DEFERRED',
    reason:
      'GEN upload/token endpoints require confirmed staging docs before white-label upload UI submits files.',
  };
}

/** Snapshot for DB persistence — no PHI beyond action metadata returned by GEN. */
export function snapshotRequiredActions(
  actions: GenRequiredAction[] | undefined,
): GenRequiredAction[] {
  return (actions || []).map((a) => ({
    id: a.id,
    type: a.type,
    title: a.title,
    status: a.status,
    url: a.url,
  }));
}

/** Persistable sync patch from GET order — does not mutate MBM fulfillment. */
export type GenOrderSyncPatch = {
  genOrderId: string;
  genOrderStatus: string | null;
  clinicalStatus: GenHandoffStatus;
  requiredActionsJson: GenRequiredAction[];
  lastSyncedAt: string;
  /** Safe prescription id/status when exposed by GEN order/prescription GET. */
  genPrescriptionId?: string | null;
  prescriptionStatus?: string | null;
  lastPrescriptionSyncAt?: string | null;
  /** Pharmacy/shipment normalization — only when GEN exposes it. */
  pharmacyStatus?: string | null;
  trackingNumber?: string | null;
};

function extractPharmacyAndPrescriptionFromOrder(order: GenOrderResponse): {
  genPrescriptionId: string | null;
  prescriptionStatus: string | null;
  pharmacyStatusRaw: string | null;
  trackingNumber: string | null;
} {
  const raw = (order.raw && typeof order.raw === 'object' ? order.raw : {}) as Record<
    string,
    unknown
  >;
  const pickStr = (...vals: unknown[]): string | null => {
    for (const v of vals) {
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
    return null;
  };
  const rx =
    (raw.prescription && typeof raw.prescription === 'object'
      ? (raw.prescription as Record<string, unknown>)
      : null) ||
    (Array.isArray(raw.prescriptions) && raw.prescriptions[0] && typeof raw.prescriptions[0] === 'object'
      ? (raw.prescriptions[0] as Record<string, unknown>)
      : null);
  const ship =
    (raw.shipment && typeof raw.shipment === 'object'
      ? (raw.shipment as Record<string, unknown>)
      : null) ||
    (raw.shipping && typeof raw.shipping === 'object'
      ? (raw.shipping as Record<string, unknown>)
      : null) ||
    (raw.pharmacy && typeof raw.pharmacy === 'object'
      ? (raw.pharmacy as Record<string, unknown>)
      : null);
  return {
    genPrescriptionId: pickStr(rx?.id, raw.prescriptionId, raw.prescription_id, raw.genPrescriptionId),
    prescriptionStatus: pickStr(rx?.status, raw.prescriptionStatus, raw.prescription_status),
    pharmacyStatusRaw: pickStr(
      ship?.status,
      raw.pharmacyStatus,
      raw.pharmacy_status,
      raw.fulfillmentStatus,
      raw.fulfillment_status,
      raw.shippingStatus,
      raw.shipping_status,
    ),
    trackingNumber: pickStr(
      ship?.trackingNumber,
      ship?.tracking_number,
      raw.trackingNumber,
      raw.tracking_number,
    ),
  };
}

export function buildGenOrderSyncPatch(
  order: GenOrderResponse,
  syncedAt: string = new Date().toISOString(),
): GenOrderSyncPatch {
  const extra = extractPharmacyAndPrescriptionFromOrder(order);
  const clinicalStatus = normalizeGenClinicalStatus(order.orderStatus);
  // Prefer explicit pharmacy/shipment fields; fall back to clinical when clearly shipped/pharmacy.
  let pharmacyStatus: string | null = null;
  if (extra.pharmacyStatusRaw) {
    pharmacyStatus = normalizePharmacyShipmentStatus(extra.pharmacyStatusRaw);
  } else if (clinicalStatus === 'GEN_SHIPPED') {
    pharmacyStatus = 'SHIPPED';
  } else if (clinicalStatus === 'GEN_COMPLETE') {
    pharmacyStatus = 'DELIVERED';
  } else if (clinicalStatus === 'GEN_PHARMACY') {
    pharmacyStatus = 'PHARMACY_PROCESSING';
  }
  return {
    genOrderId: order.id,
    genOrderStatus: order.orderStatus ?? null,
    clinicalStatus,
    requiredActionsJson: snapshotRequiredActions(order.requiredActions),
    lastSyncedAt: syncedAt,
    genPrescriptionId: extra.genPrescriptionId,
    prescriptionStatus: extra.prescriptionStatus,
    lastPrescriptionSyncAt: extra.genPrescriptionId || extra.prescriptionStatus ? syncedAt : null,
    pharmacyStatus,
    trackingNumber: extra.trackingNumber,
  };
}

/**
 * GET GEN order → normalize → sync patch. Does not write DB (caller persists).
 * Does not map into MBM fulfillment until mapping rules are explicitly defined.
 */
export async function syncGenOrder(
  genOrderId: string,
  deps: GenClientDeps = {},
): Promise<
  | { ok: true; patch: GenOrderSyncPatch; correlationId: string; httpStatus: number }
  | { ok: false; error: GenApiError; correlationId: string }
> {
  const res = await getGenOrder(genOrderId, deps);
  if (!res.ok) return res;
  return {
    ok: true,
    patch: buildGenOrderSyncPatch(res.data),
    correlationId: res.correlationId,
    httpStatus: res.httpStatus,
  };
}

export type HandoffOrderItem = {
  orderItemId: string;
  mbmSku: string;
  quantity?: number;
  isPrescriptionEligible: boolean;
};

export type ExistingGenOrderLink = {
  orderItemId: string;
  genOrderId: string | null;
  handoffStatus?: string | null;
};

export type HandoffPlanItem =
  | { orderItemId: string; mbmSku: string; action: 'skip_non_rx' }
  | { orderItemId: string; mbmSku: string; action: 'skip_already_linked'; genOrderId: string }
  | { orderItemId: string; mbmSku: string; action: 'blocked'; code: string; message: string }
  | {
      orderItemId: string;
      mbmSku: string;
      action: 'create';
      genClientProductId: string;
      quantity?: number;
    };

/**
 * Pure handoff planner — Option A (one GEN order per Rx line).
 * Does not call GEN. Used by Edge scaffold + tests.
 */
export function planGenHandoff(input: {
  paymentStatus: string;
  tagadaTransactionId: string | null | undefined;
  items: HandoffOrderItem[];
  existingLinks: ExistingGenOrderLink[];
  resolveMapping: (sku: string) => GenSkuMapping | null;
}):
  | { ok: true; items: HandoffPlanItem[] }
  | { ok: false; code: string; message: string } {
  if (input.paymentStatus !== 'paid') {
    return {
      ok: false,
      code: 'GEN_HANDOFF_UNPAID',
      message: 'GEN handoff requires MBM payment_status=paid after Tagada verification',
    };
  }
  if (!input.tagadaTransactionId?.trim()) {
    return {
      ok: false,
      code: 'GEN_HANDOFF_MISSING_TX',
      message: 'GEN handoff requires verified Tagada transaction id',
    };
  }

  const byItem = new Map(input.existingLinks.map((l) => [l.orderItemId, l]));
  const items: HandoffPlanItem[] = [];

  for (const item of input.items) {
    if (!item.isPrescriptionEligible) {
      items.push({ orderItemId: item.orderItemId, mbmSku: item.mbmSku, action: 'skip_non_rx' });
      continue;
    }
    const existing = byItem.get(item.orderItemId);
    if (existing?.genOrderId) {
      items.push({
        orderItemId: item.orderItemId,
        mbmSku: item.mbmSku,
        action: 'skip_already_linked',
        genOrderId: existing.genOrderId,
      });
      continue;
    }
    const resolved = resolveGenProductForSku(item.mbmSku, input.resolveMapping(item.mbmSku));
    if (!resolved.ok) {
      items.push({
        orderItemId: item.orderItemId,
        mbmSku: item.mbmSku,
        action: 'blocked',
        code: resolved.code,
        message: resolved.message,
      });
      continue;
    }
    items.push({
      orderItemId: item.orderItemId,
      mbmSku: item.mbmSku,
      action: 'create',
      genClientProductId: resolved.genClientProductId,
      quantity: item.quantity,
    });
  }

  return { ok: true, items };
}

/**
 * Service-layer retry planner — reuses planGenHandoff (idempotent).
 * Does not call GEN. Live execution remains gated by GEN_HEALTH_ENABLED.
 */
export function retryGenHandoffPlan(input: Parameters<typeof planGenHandoff>[0]) {
  return planGenHandoff(input);
}

/**
 * Read-only admin status summary helper (no mutations, no GEN calls).
 */
export function summarizeGenHandoffAdminStatus(links: ExistingGenOrderLink[]): {
  total: number;
  linked: number;
  pending: number;
  retryRequired: number;
  blocked: number;
} {
  let linked = 0;
  let pending = 0;
  let retryRequired = 0;
  let blocked = 0;
  for (const l of links) {
    if (l.genOrderId) linked += 1;
    const hs = String(l.handoffStatus || '').toUpperCase();
    if (hs.includes('RETRY')) retryRequired += 1;
    else if (hs.includes('BLOCK')) blocked += 1;
    else if (!l.genOrderId) pending += 1;
  }
  return { total: links.length, linked, pending, retryRequired, blocked };
}

/**
 * GEN webhook verification stub — FAIL CLOSED until signature spec is documented.
 * Do not invent verification algorithms.
 */
export function verifyGenWebhookSignature(_input: {
  rawBody: string;
  signatureHeader: string | null;
  secret: string | null;
}): { ok: false; code: 'GEN_WEBHOOK_VERIFY_UNSUPPORTED'; message: string } {
  return {
    ok: false,
    code: 'GEN_WEBHOOK_VERIFY_UNSUPPORTED',
    message:
      'GEN webhook signature verification is TBD — VERIFY AGAINST GEN V2 API REFERENCE. Rejecting unsigned/unverified events (fail closed).',
  };
}

/** Content-hash replay key when external event id is absent (TBD). */
export async function hashWebhookBodyForReplay(rawBody: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawBody));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Membership rebill must never create GEN medication orders (invariant helper). */
export function shouldCreateGenOrderOnMembershipRebill(): false {
  return false;
}

/**
 * Visits / labs stay on existing MBM injection paths in Phase 12D.
 * GEN Visit/Lab APIs must not create duplicate commerce charges.
 */
export function shouldCreateGenOrderForVisitOrLabInjection(): false {
  return false;
}
