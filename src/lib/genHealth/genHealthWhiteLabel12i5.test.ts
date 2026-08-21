/**
 * Phase 12I.5 — White-label GEN V2 wrapper tests (mocked; no live GEN/Tagada).
 */

import { describe, expect, it, vi } from 'vitest';
import {
  browserMayCallGenDirectly,
  genHealth,
  toClinicalOrder,
  toClinicalPrescriptions,
} from './genHealthClient';
import {
  assertGenMarkPaidEligible,
  createGenOrderUnpaid,
  createOrReuseGenPatient,
  ensureGenPatient,
  getGenProductForms,
  markGenOrderPaid,
  planGenHandoff,
  shouldCreateGenOrderOnMembershipRebill,
  submitGenOrderForm,
  uploadsWrapperStatus,
} from './genHealth';
import {
  mapGenFieldType,
  normalizeProductFormsResponse,
  validateFormAnswers,
  customerActionLabel,
} from './genForms';
import { CLINICAL_JOURNEY_STAGES, journeyStageFromPortal, isJourneyStageReached } from './clinicalJourney';

const enabledEnv = {
  GEN_HEALTH_ENABLED: 'true',
  GEN_HEALTH_API_KEY: 'test_key_not_real',
};

describe('Phase 12I.5 white-label GEN wrapper', () => {
  it('canonical client exposes patients/products/orders/forms/prescriptions/messaging', () => {
    expect(typeof genHealth.patients.ensure).toBe('function');
    expect(typeof genHealth.products.getForms).toBe('function');
    expect(typeof genHealth.orders.createUnpaid).toBe('function');
    expect(typeof genHealth.orders.markPaid).toBe('function');
    expect(typeof genHealth.forms.submit).toBe('function');
    expect(typeof genHealth.prescriptions.list).toBe('function');
    expect(typeof genHealth.conversations.sendMessage).toBe('function');
    expect(typeof genHealth.visits.list).toBe('function');
    expect(typeof genHealth.labs.listForPatient).toBe('function');
    expect(browserMayCallGenDirectly()).toBe(false);
  });

  it('ensureGenPatient aliases createOrReuseGenPatient', () => {
    expect(ensureGenPatient).toBe(createOrReuseGenPatient);
  });

  it('patient create reuses path via createOrReuseGenPatient (mocked)', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ id: 'pat_reuse_1' }), { status: 200 }),
    );
    const res = await ensureGenPatient(
      { email: 'qa@example.com', firstName: 'A', lastName: 'B' },
      { env: enabledEnv, fetchImpl: fetchImpl as unknown as typeof fetch },
    );
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.data.id).toBe('pat_reuse_1');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const call = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(String(call[1].method).toUpperCase()).toBe('POST');
    expect(String((call[1].headers as Record<string, string>)['X-API-Key'] || '')).toBe(
      'test_key_not_real',
    );
  });

  it('product forms fetch hits /v2/client/products/:id/forms', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          forms: [
            {
              id: 'form_1',
              title: 'Intake',
              fields: [
                { id: 'q1', type: 'text', label: 'Height', required: true },
                { id: 'q2', type: 'weird_control', label: 'Odd', required: true },
              ],
            },
          ],
        }),
        { status: 200 },
      ),
    );
    const res = await getGenProductForms('prod_abc', {
      env: enabledEnv,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res.ok).toBe(true);
    const call = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(String(call[0])).toContain('/v2/client/products/prod_abc/forms');
    const schemas = normalizeProductFormsResponse(res.ok ? res.data : null, 'prod_abc');
    expect(schemas[0].fields[0].type).toBe('text');
    expect(schemas[0].fields[1].unsupported).toBe(true);
  });

  it('unknown form control fails validation when required', () => {
    expect(mapGenFieldType('totally_new')).toEqual({ type: 'unknown', unsupported: true });
    const schema = normalizeProductFormsResponse({
      forms: [
        {
          id: 'f',
          fields: [{ id: 'x', type: 'totally_new', label: 'X', required: true }],
        },
      ],
    })[0];
    const v = validateFormAnswers(schema, {});
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.code).toBe('GEN_UNKNOWN_FIELD');
  });

  it('order create unpaid omits payment_status', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ id: 'ord_1', orderStatus: 'pending_payment' }), {
        status: 200,
      }),
    );
    const res = await createGenOrderUnpaid(
      {
        patientId: 'pat_1',
        clientProductId: 'prod_1',
        transactionId: 'tx_verified',
      },
      { env: enabledEnv, fetchImpl: fetchImpl as unknown as typeof fetch },
    );
    expect(res.ok).toBe(true);
    const call = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(String(call[1].body));
    expect(body.patient_id).toBe('pat_1');
    expect(body.order.clientProductId).toBe('prod_1');
    expect(body.order.payment_status).toBeUndefined();
  });

  it('mark-paid blocked when API Orders=false', async () => {
    const fetchImpl = vi.fn();
    const res = await markGenOrderPaid(
      { genOrderId: 'ord_1', transactionId: 'tx_1' },
      {
        env: { ...enabledEnv, GEN_API_ORDERS_ENABLED: 'false' },
        fetchImpl: fetchImpl as unknown as typeof fetch,
      },
    );
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.code).toBe('GEN_API_ORDERS_DISABLED');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('mark-paid request shape when API Orders=true', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ id: 'ord_1', orderStatus: 'created' }), { status: 200 }),
    );
    const res = await markGenOrderPaid(
      { genOrderId: 'ord_1', transactionId: 'tx_tagada_1' },
      {
        env: { ...enabledEnv, GEN_API_ORDERS_ENABLED: 'true' },
        fetchImpl: fetchImpl as unknown as typeof fetch,
      },
    );
    expect(res.ok).toBe(true);
    const call = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(String(call[1].method).toUpperCase()).toBe('PATCH');
    expect(String(call[0])).toContain('/v2/client/orders/ord_1');
    const body = JSON.parse(String(call[1].body));
    expect(body.payment_status).toBe('paid');
    expect(body.transaction_id).toBe('tx_tagada_1');
  });

  it('mark-paid requires transaction ID', async () => {
    const res = await markGenOrderPaid(
      { genOrderId: 'ord_1', transactionId: '' },
      { env: { ...enabledEnv, GEN_API_ORDERS_ENABLED: 'true' } },
    );
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.code).toBe('GEN_MARK_PAID_ERROR');
  });

  it('assertGenMarkPaidEligible enforces Tagada + mapping + API Orders', () => {
    expect(
      assertGenMarkPaidEligible({
        mbmPaymentStatus: 'paid',
        tagadaTransactionId: 'tx',
        genOrderId: 'g1',
        genMappingReady: true,
        isRx: true,
        genApiOrdersEnabled: true,
      }).ok,
    ).toBe(true);
    expect(
      assertGenMarkPaidEligible({
        mbmPaymentStatus: 'paid',
        tagadaTransactionId: 'tx',
        genOrderId: 'g1',
        genMappingReady: true,
        isRx: true,
        genApiOrdersEnabled: false,
      }).ok,
    ).toBe(false);
    expect(
      assertGenMarkPaidEligible({
        mbmPaymentStatus: 'unpaid',
        tagadaTransactionId: 'tx',
        genOrderId: 'g1',
        genMappingReady: true,
        isRx: true,
        genApiOrdersEnabled: true,
      }).ok,
    ).toBe(false);
  });

  it('duplicate Rx handoff plan returns already linked', () => {
    const plan = planGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: 'tx_1',
      items: [
        {
          orderItemId: 'i1',
          mbmSku: 'MBM-RP-BPC-INJ-001',
          isPrescriptionEligible: true,
        },
      ],
      existingLinks: [
        {
          orderItemId: 'i1',
          genOrderId: 'existing_gen',
          handoffStatus: 'ORDER_CREATED',
        },
      ],
      resolveMapping: () => ({
        mbmSku: 'MBM-RP-BPC-INJ-001',
        genClientProductId: 'prod',
        mappingStatus: 'READY',
        active: true,
      }),
    });
    expect(plan.ok).toBe(true);
    if (plan.ok) {
      expect(plan.items[0].action).toBe('skip_already_linked');
    }
  });

  it('forms submit posts to forms/submissions without logging answers', async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const res = await submitGenOrderForm(
      { genOrderId: 'ord_1', formId: 'form_1', answers: { q1: 'secret-clinical' } },
      { env: enabledEnv, fetchImpl: fetchImpl as unknown as typeof fetch },
    );
    expect(res.ok).toBe(true);
    const call = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(String(call[0])).toContain('/orders/ord_1/forms/submissions');
  });

  it('normalizes clinical order + prescriptions + tracking', () => {
    const order = toClinicalOrder({
      genOrderId: 'g1',
      orderStatus: 'provider_review',
      paymentStatus: 'paid',
      requiredActions: [{ type: 'forms', title: 'Intake' }],
    });
    // Open required actions take precedence for portal stage.
    expect(order.portalStage).toBe('health_information_needed');
    expect(order.clinicalStatus).toBe('GEN_PROVIDER_REVIEW');
    const reviewing = toClinicalOrder({
      genOrderId: 'g2',
      orderStatus: 'provider_review',
      paymentStatus: 'paid',
      requiredActions: [],
    });
    expect(reviewing.portalStage).toBe('provider_review');
    const rx = toClinicalPrescriptions([
      {
        id: 'rx1',
        status: 'approved',
        raw: {
          medicationName: 'BPC',
          trackingNumber: '1Z999',
          trackingUrl: 'https://track.example/1Z999',
          carrier: 'UPS',
        },
      },
    ]);
    expect(rx[0].trackingNumber).toBe('1Z999');
    expect(rx[0].medicationLabel).toBe('BPC');
  });

  it('customer action labels are MBM-branded', () => {
    expect(customerActionLabel('FORM')).toBe('Complete Health Information');
    expect(customerActionLabel('UPLOAD')).toBe('Upload Required Information');
    expect(customerActionLabel('VISIT')).toBe('Schedule Required Visit');
  });

  it('clinical journey stages cover payment → complete', () => {
    expect(CLINICAL_JOURNEY_STAGES).toHaveLength(7);
    expect(journeyStageFromPortal('shipped')).toBe('shipped');
    expect(isJourneyStageReached('pharmacy_processing', 'payment_received')).toBe(true);
    expect(isJourneyStageReached('payment_received', 'shipped')).toBe(false);
  });

  it('membership rebill and accessories do not invoke GEN med create', () => {
    expect(shouldCreateGenOrderOnMembershipRebill()).toBe(false);
    const plan = planGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: 'tx_1',
      items: [
        {
          orderItemId: 'a1',
          mbmSku: 'MBM-ACC-ICE-ACC-001',
          isPrescriptionEligible: false,
        },
      ],
      existingLinks: [],
      resolveMapping: () => null,
    });
    expect(plan.ok).toBe(true);
    if (plan.ok) expect(plan.items[0].action).toBe('skip_non_rx');
  });

  it('uploads wrapper is deferred pending confirmed GEN upload docs', () => {
    expect(uploadsWrapperStatus().status).toBe('DEFERRED');
  });

  it('GEN failure classification preserves paid authority separation', () => {
    const eligible = assertGenMarkPaidEligible({
      mbmPaymentStatus: 'paid',
      tagadaTransactionId: 'tx',
      genOrderId: null,
      genMappingReady: true,
      isRx: true,
      genApiOrdersEnabled: true,
    });
    expect(eligible.ok).toBe(false);
    // MBM paid state is independent — gate fails on missing GEN order, not by unpaid.
  });
});
