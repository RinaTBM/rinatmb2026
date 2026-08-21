/**
 * Phase 12D — GEN Health V2 scaffolding unit tests (mocked; no live GEN/Tagada).
 */

import { describe, expect, it, vi } from 'vitest';
import {
  assertGenHealthCallable,
  buildGenOrderSyncPatch,
  createGenOrder,
  createOrReuseGenPatient,
  formatGenLog,
  genRequest,
  getGenOrder,
  normalizeGenClinicalStatus,
  planGenHandoff,
  resolveGenHealthConfig,
  resolveGenProductForSku,
  shouldCreateGenOrderForVisitOrLabInjection,
  shouldCreateGenOrderOnMembershipRebill,
  snapshotRequiredActions,
  syncGenOrder,
  verifyGenWebhookSignature,
  type GenSkuMapping,
} from './genHealth';
import { executeGenHandoff, isDuplicateWebhookEvent } from './genHandoffOrchestrator';
import { mapTagadaSubscriptionEventToMembershipStatus } from '../membership/tagadaMembershipBilling';

const FIXTURE_SKU = 'fixture_SEM_TEST_SKU';
const FIXTURE_PRODUCT_ID = 'test_gen_client_product_001';
const FIXTURE_PATIENT_ID = 'test_gen_patient_001';
const FIXTURE_ORDER_ID = 'test_gen_order_001';

function readyMapping(overrides: Partial<GenSkuMapping> = {}): GenSkuMapping {
  return {
    mbmSku: FIXTURE_SKU,
    genClientProductId: FIXTURE_PRODUCT_ID,
    mappingStatus: 'READY',
    active: true,
    ...overrides,
  };
}

describe('GEN Health config / feature flag', () => {
  it('defaults GEN_HEALTH_ENABLED and handoff automation to false', () => {
    const cfg = resolveGenHealthConfig({});
    expect(cfg.enabled).toBe(false);
    expect(cfg.handoffAutomationEnabled).toBe(false);
    expect(cfg.baseUrl).toBe('https://api.gen-health.app');
    expect(cfg.apiKey).toBeNull();
  });

  it('enables handoff automation only when GEN_HANDOFF_AUTOMATION_ENABLED is truthy', () => {
    expect(
      resolveGenHealthConfig({ GEN_HANDOFF_AUTOMATION_ENABLED: 'true' })
        .handoffAutomationEnabled,
    ).toBe(true);
    expect(
      resolveGenHealthConfig({ GEN_HANDOFF_AUTOMATION_ENABLED: 'false' })
        .handoffAutomationEnabled,
    ).toBe(false);
  });

  it('does not require API key while disabled', () => {
    const gate = assertGenHealthCallable(resolveGenHealthConfig({}));
    expect(gate.ok).toBe(false);
    if (!gate.ok) expect(gate.code).toBe('GEN_DISABLED');
  });

  it('fails safely when enabled without API key', () => {
    const gate = assertGenHealthCallable(
      resolveGenHealthConfig({ GEN_HEALTH_ENABLED: 'true' }),
    );
    expect(gate.ok).toBe(false);
    if (!gate.ok) expect(gate.code).toBe('GEN_MISSING_API_KEY');
  });

  it('allows callable when enabled with key', () => {
    const gate = assertGenHealthCallable(
      resolveGenHealthConfig({
        GEN_HEALTH_ENABLED: 'true',
        GEN_HEALTH_API_KEY: 'test_key_not_real',
      }),
    );
    expect(gate.ok).toBe(true);
  });
});

describe('GEN client disabled short-circuit', () => {
  it('GEN disabled → no API request (fetch never called)', async () => {
    const fetchImpl = vi.fn();
    const res = await genRequest({
      path: '/v2/client/orders/x',
      env: {},
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.code).toBe('GEN_DISABLED');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('enabled without key → fails safely, no fetch', async () => {
    const fetchImpl = vi.fn();
    const res = await genRequest({
      path: '/v2/client/patients',
      method: 'POST',
      body: { email: 'fixture@example.com' },
      env: { GEN_HEALTH_ENABLED: 'true' },
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.code).toBe('GEN_MISSING_API_KEY');
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe('resolveGenProductForSku', () => {
  it('requires ACTIVE/READY + product id (fail closed)', () => {
    expect(resolveGenProductForSku(FIXTURE_SKU, null).ok).toBe(false);
    expect(
      resolveGenProductForSku(
        FIXTURE_SKU,
        readyMapping({ mappingStatus: 'BLOCKED' }),
      ).ok,
    ).toBe(false);
    expect(
      resolveGenProductForSku(
        FIXTURE_SKU,
        readyMapping({ mappingStatus: 'DRAFT' }),
      ).ok,
    ).toBe(false);
    expect(
      resolveGenProductForSku(
        FIXTURE_SKU,
        readyMapping({ genClientProductId: null }),
      ).ok,
    ).toBe(false);
    expect(
      resolveGenProductForSku(
        FIXTURE_SKU,
        readyMapping({ active: false }),
      ).ok,
    ).toBe(false);
    const ok = resolveGenProductForSku(FIXTURE_SKU, readyMapping());
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.genClientProductId).toBe(FIXTURE_PRODUCT_ID);
  });
});

describe('planGenHandoff payment guards', () => {
  it('rejects unpaid orders', () => {
    const plan = planGenHandoff({
      paymentStatus: 'pending',
      tagadaTransactionId: 'tx_test_1',
      items: [],
      existingLinks: [],
      resolveMapping: () => null,
    });
    expect(plan.ok).toBe(false);
    if (!plan.ok) expect(plan.code).toBe('GEN_HANDOFF_UNPAID');
  });

  it('requires Tagada transaction id', () => {
    const plan = planGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: null,
      items: [],
      existingLinks: [],
      resolveMapping: () => null,
    });
    expect(plan.ok).toBe(false);
    if (!plan.ok) expect(plan.code).toBe('GEN_HANDOFF_MISSING_TX');
  });

  it('missing GEN SKU mapping → blocked / no create', () => {
    const plan = planGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: 'tx_test_1',
      items: [
        {
          orderItemId: 'oi_1',
          mbmSku: FIXTURE_SKU,
          isPrescriptionEligible: true,
        },
      ],
      existingLinks: [],
      resolveMapping: () => null,
    });
    expect(plan.ok).toBe(true);
    if (plan.ok) {
      expect(plan.items[0].action).toBe('blocked');
    }
  });

  it('duplicate handoff → existing gen_order_id prevents create', () => {
    const plan = planGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: 'tx_test_1',
      items: [
        {
          orderItemId: 'oi_1',
          mbmSku: FIXTURE_SKU,
          isPrescriptionEligible: true,
        },
      ],
      existingLinks: [{ orderItemId: 'oi_1', genOrderId: FIXTURE_ORDER_ID }],
      resolveMapping: () => readyMapping(),
    });
    expect(plan.ok).toBe(true);
    if (plan.ok) {
      expect(plan.items[0].action).toBe('skip_already_linked');
      if (plan.items[0].action === 'skip_already_linked') {
        expect(plan.items[0].genOrderId).toBe(FIXTURE_ORDER_ID);
      }
    }
  });
});

describe('mocked patient + order create', () => {
  const enabledEnv = {
    GEN_HEALTH_ENABLED: 'true',
    GEN_HEALTH_API_KEY: 'test_key_not_real',
  };

  it('mocked patient create/reuse', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ id: FIXTURE_PATIENT_ID, email: 'fixture@example.com' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const res = await createOrReuseGenPatient(
      { email: 'fixture@example.com', firstName: 'Test', lastName: 'Patient' },
      { env: enabledEnv, fetchImpl: fetchImpl as unknown as typeof fetch },
    );
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.data.id).toBe(FIXTURE_PATIENT_ID);
    expect(fetchImpl).toHaveBeenCalledOnce();
    const call = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(call[1].headers).toMatchObject({
      'X-API-Key': 'test_key_not_real',
      'Content-Type': 'application/json',
    });
    const sent = JSON.parse(String(call[1].body));
    expect(sent).toEqual({
      patient: {
        email: 'fixture@example.com',
        firstName: 'Test',
        lastName: 'Patient',
      },
    });
  });

  it('mocked GEN order create + requiredActions snapshot', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          id: FIXTURE_ORDER_ID,
          orderStatus: 'action_required',
          requiredActions: [
            { id: 'ra_1', type: 'intake', title: 'Complete intake', url: 'https://example.test/intake' },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    const res = await createGenOrder(
      {
        patientId: FIXTURE_PATIENT_ID,
        clientProductId: FIXTURE_PRODUCT_ID,
        paymentStatus: 'paid',
        transactionId: 'tx_test_tagada_1',
      },
      { env: enabledEnv, fetchImpl: fetchImpl as unknown as typeof fetch },
    );
    expect(res.ok).toBe(true);
    const fetchCall = fetchImpl.mock.calls[0] as unknown as [unknown, { body?: string } | undefined];
    const sent = JSON.parse(String(fetchCall[1]?.body || '{}')) as {
      patient_id?: string;
      order?: { clientProductId?: string; transactionId?: string; payment_status?: string };
    };
    expect(sent.patient_id).toBe(FIXTURE_PATIENT_ID);
    expect(sent.order?.clientProductId).toBe(FIXTURE_PRODUCT_ID);
    expect(sent.order?.transactionId).toBe('tx_test_tagada_1');
    // payment_status omitted unless GEN_API_ORDERS_PAYMENT_STATUS_ENABLED
    expect(sent.order?.payment_status).toBeUndefined();
    if (res.ok) {
      expect(res.data.id).toBe(FIXTURE_ORDER_ID);
      const snap = snapshotRequiredActions(res.data.requiredActions);
      expect(snap).toHaveLength(1);
      expect(snap[0].type).toBe('intake');
      expect(snap[0].raw).toBeUndefined();
    }
  });
});

describe('executeGenHandoff orchestration', () => {
  it('paid order required path creates GEN order when mapped', async () => {
    const result = await executeGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: 'tx_test_1',
      mbmOrderId: 'ord_test_1',
      patient: { email: 'fixture@example.com', firstName: 'A', lastName: 'B' },
      items: [
        {
          orderItemId: 'oi_1',
          mbmSku: FIXTURE_SKU,
          isPrescriptionEligible: true,
          quantity: 1,
        },
      ],
      existingLinks: [],
      resolveMapping: () => readyMapping(),
      env: { GEN_HEALTH_ENABLED: 'true', GEN_HEALTH_API_KEY: 'test_key' },
      createPatient: async () => ({
        ok: true,
        data: { id: FIXTURE_PATIENT_ID },
        httpStatus: 200,
        correlationId: 'c1',
      }),
      createOrder: async () => ({
        ok: true,
        data: {
          id: FIXTURE_ORDER_ID,
          orderStatus: 'action_required',
          requiredActions: [{ type: 'form', url: 'https://example.test/f' }],
        },
        httpStatus: 200,
        correlationId: 'c2',
      }),
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.results[0].status).toBe('created');
      if (result.results[0].status === 'created') {
        expect(result.results[0].persist.requiredActionsJson).toHaveLength(1);
        expect(result.results[0].persist.handoffStatus).toBe('ACTION_REQUIRED');
      }
    }
  });

  it('GEN API timeout → payment stays paid, handoff retry-required', async () => {
    const result = await executeGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: 'tx_test_1',
      mbmOrderId: 'ord_test_1',
      patient: {
        email: 'fixture@example.com',
        existingGenPatientId: FIXTURE_PATIENT_ID,
      },
      items: [
        {
          orderItemId: 'oi_1',
          mbmSku: FIXTURE_SKU,
          isPrescriptionEligible: true,
        },
      ],
      existingLinks: [],
      resolveMapping: () => readyMapping(),
      env: { GEN_HEALTH_ENABLED: 'true', GEN_HEALTH_API_KEY: 'test_key' },
      createOrder: async () => ({
        ok: false,
        correlationId: 'c_timeout',
        error: { code: 'GEN_TIMEOUT', message: 'GEN request timed out', retryable: true },
      }),
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.needsRetry).toBe(true);
      expect(result.results[0].status).toBe('error');
      if (result.results[0].status === 'error') {
        expect(result.results[0].paymentStatusPreserved).toBe('paid');
        expect(result.results[0].handoffStatus).toBe('RETRY_REQUIRED');
      }
    }
  });

  it('unpaid order rejected before any create', async () => {
    const createOrder = vi.fn();
    const result = await executeGenHandoff({
      paymentStatus: 'pending',
      tagadaTransactionId: 'tx_test_1',
      mbmOrderId: 'ord_test_1',
      patient: { email: 'fixture@example.com' },
      items: [
        {
          orderItemId: 'oi_1',
          mbmSku: FIXTURE_SKU,
          isPrescriptionEligible: true,
        },
      ],
      existingLinks: [],
      resolveMapping: () => readyMapping(),
      createOrder,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('GEN_HANDOFF_UNPAID');
    expect(createOrder).not.toHaveBeenCalled();
  });
});

describe('GET order authoritative sync', () => {
  it('syncGenOrder builds patch without mapping to MBM fulfillment', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          id: FIXTURE_ORDER_ID,
          orderStatus: 'provider_review',
          requiredActions: [],
        }),
        { status: 200 },
      ),
    );
    const res = await syncGenOrder(FIXTURE_ORDER_ID, {
      env: { GEN_HEALTH_ENABLED: 'true', GEN_HEALTH_API_KEY: 'test_key' },
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.patch.clinicalStatus).toBe('GEN_PROVIDER_REVIEW');
      expect(res.patch.genOrderId).toBe(FIXTURE_ORDER_ID);
    }
  });

  it('normalizeGenClinicalStatus unknown → GEN_UNKNOWN', () => {
    expect(normalizeGenClinicalStatus('totally_unknown_xyz')).toBe('GEN_UNKNOWN');
    expect(normalizeGenClinicalStatus('shipped')).toBe('GEN_SHIPPED');
  });

  it('buildGenOrderSyncPatch snapshots requiredActions', () => {
    const patch = buildGenOrderSyncPatch({
      id: FIXTURE_ORDER_ID,
      orderStatus: 'action_required',
      requiredActions: [{ type: 'lab', url: 'https://example.test', raw: { secret: 'no' } }],
    });
    expect(patch.clinicalStatus).toBe('GEN_ACTION_REQUIRED');
    expect(patch.requiredActionsJson[0].raw).toBeUndefined();
  });
});

describe('GEN webhook fail-closed + idempotency', () => {
  it('unsigned/unknown GEN webhook → rejected', () => {
    const v = verifyGenWebhookSignature({
      rawBody: '{"id":"evt_1"}',
      signatureHeader: null,
      secret: null,
    });
    expect(v.ok).toBe(false);
    expect(v.code).toBe('GEN_WEBHOOK_VERIFY_UNSUPPORTED');
  });

  it('duplicate GEN webhook → idempotent via event id or content hash', () => {
    expect(
      isDuplicateWebhookEvent({
        existingExternalEventId: 'evt_fixture_1',
        incomingExternalEventId: 'evt_fixture_1',
        existingContentHash: null,
        incomingContentHash: 'abc',
      }),
    ).toBe(true);
    expect(
      isDuplicateWebhookEvent({
        existingExternalEventId: null,
        incomingExternalEventId: null,
        existingContentHash: 'deadbeef',
        incomingContentHash: 'deadbeef',
      }),
    ).toBe(true);
    expect(
      isDuplicateWebhookEvent({
        existingExternalEventId: 'evt_a',
        incomingExternalEventId: 'evt_b',
        existingContentHash: 'aaa',
        incomingContentHash: 'bbb',
      }),
    ).toBe(false);
  });
});

describe('membership rebill + visit/lab invariants', () => {
  it('membership rebill does NOT create GEN med order', () => {
    expect(shouldCreateGenOrderOnMembershipRebill()).toBe(false);
  });

  it('visit/lab injection does NOT create GEN med order in 12D', () => {
    expect(shouldCreateGenOrderForVisitOrLabInjection()).toBe(false);
  });

  it('existing membership rebill maps to membership status only (no GEN create)', () => {
    // tagada-webhook continues to update customer_memberships / log rebill events only
    expect(mapTagadaSubscriptionEventToMembershipStatus('subscription/rebillSucceeded')).toBe(
      'active',
    );
    expect(shouldCreateGenOrderOnMembershipRebill()).toBe(false);
  });
});

describe('observability safety', () => {
  it('formatGenLog never includes secrets or PHI fields', () => {
    const line = formatGenLog({
      operation: 'create_order',
      mbmOrderId: 'ord_1',
      mbmSku: FIXTURE_SKU,
      genOrderId: FIXTURE_ORDER_ID,
      tagadaTransactionId: 'tx_1',
      safeErrorCode: 'GEN_TIMEOUT',
      httpStatus: 408,
    });
    expect(line).toContain('op=create_order');
    expect(line).not.toMatch(/api[_-]?key/i);
    expect(line).not.toMatch(/password/i);
    expect(line).not.toMatch(/\bDOB\b/i);
  });
});

describe('getGenOrder disabled path', () => {
  it('getGenOrder short-circuits when disabled', async () => {
    const fetchImpl = vi.fn();
    const res = await getGenOrder(FIXTURE_ORDER_ID, {
      env: {},
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res.ok).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
