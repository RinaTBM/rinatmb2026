import { describe, expect, it } from 'vitest';
import {
  adminGenStatusRefreshRequiresAuth,
  browserMayWriteClinicalStatus,
  buildSafeCustomerClinicalLine,
  categorizeRequiredActionType,
  customerClinicalStatusReadsLocalStateOnly,
  customerMayMarkRequiredActionCompleteLocally,
  normalizeGenClinicalStatus,
  normalizePharmacyShipmentStatus,
  normalizeRequiredAction,
  normalizeRequiredActionsList,
  portalStageFromClinical,
} from './clinicalStatus';
import {
  buildGenOrderSyncPatch,
  paymentStatusAfterGenFailure,
  planGenHandoff,
} from './genHealth';

describe('Phase 12H clinical status + requiredActions', () => {
  it('requiredActions FORM normalization', () => {
    const n = normalizeRequiredAction({ type: 'intake_form', title: 'Health Form' });
    expect(n.category).toBe('FORM');
    expect(categorizeRequiredActionType('questionnaire')).toBe('FORM');
  });

  it('requiredActions LAB normalization', () => {
    const n = normalizeRequiredAction({ type: 'lab_order', title: 'Complete blood panel' });
    expect(n.category).toBe('LAB');
  });

  it('unknown action → OTHER', () => {
    expect(normalizeRequiredAction({ type: 'mystery_step', title: 'Do the thing' }).category).toBe(
      'OTHER',
    );
  });

  it('GEN raw unknown status → GEN_UNKNOWN', () => {
    expect(normalizeGenClinicalStatus('totally_made_up_xyz')).toBe('GEN_UNKNOWN');
    expect(normalizeGenClinicalStatus(null)).toBe('GEN_UNKNOWN');
  });

  it('provider review status', () => {
    expect(normalizeGenClinicalStatus('provider_review')).toBe('GEN_PROVIDER_REVIEW');
    expect(normalizeGenClinicalStatus('under review')).toBe('GEN_PROVIDER_REVIEW');
    expect(
      portalStageFromClinical({
        paymentStatus: 'paid',
        clinicalStatus: 'GEN_PROVIDER_REVIEW',
      }),
    ).toBe('provider_review');
  });

  it('denied status', () => {
    expect(normalizeGenClinicalStatus('denied')).toBe('GEN_DENIED');
    expect(normalizeGenClinicalStatus('not_approved')).toBe('GEN_DENIED');
    expect(
      portalStageFromClinical({ paymentStatus: 'paid', clinicalStatus: 'GEN_DENIED' }),
    ).toBe('denied_follow_up');
  });

  it('pharmacy status', () => {
    expect(normalizePharmacyShipmentStatus('pharmacy_processing')).toBe('PHARMACY_PROCESSING');
    expect(normalizeGenClinicalStatus('pharmacy')).toBe('GEN_PHARMACY');
  });

  it('shipped status', () => {
    expect(normalizeGenClinicalStatus('shipped')).toBe('GEN_SHIPPED');
    expect(normalizePharmacyShipmentStatus('in_transit')).toBe('SHIPPED');
  });

  it('customer cannot mark action complete locally', () => {
    expect(customerMayMarkRequiredActionCompleteLocally()).toBe(false);
  });

  it('browser cannot update clinical status', () => {
    expect(browserMayWriteClinicalStatus()).toBe(false);
  });

  it('admin refresh requires auth', () => {
    expect(adminGenStatusRefreshRequiresAuth()).toBe(true);
  });

  it('customer status endpoint reads local state only (no browser→GEN)', () => {
    expect(customerClinicalStatusReadsLocalStateOnly()).toBe(true);
  });

  it('sync GET patch updates clinical status from requiredActions', () => {
    const patch = buildGenOrderSyncPatch({
      id: 'gen_ord_1',
      orderStatus: 'action_required',
      requiredActions: [{ id: 'a1', type: 'form', title: 'Intake', url: 'https://example.com/a' }],
      raw: { pharmacyStatus: 'processing' },
    });
    expect(patch.clinicalStatus).toBe('GEN_ACTION_REQUIRED');
    expect(patch.requiredActionsJson).toHaveLength(1);
    expect(patch.requiredActionsJson[0]).not.toHaveProperty('raw');
    expect(patch.pharmacyStatus).toBe('PHARMACY_PROCESSING');
  });

  it('GEN timeout → GEN_RETRY_REQUIRED via failure helpers; payment stays paid', () => {
    expect(paymentStatusAfterGenFailure('paid')).toBe('paid');
    expect(
      portalStageFromClinical({
        paymentStatus: 'paid',
        clinicalStatus: 'GEN_RETRY_REQUIRED',
      }),
    ).toBe('error_retry');
  });

  it('duplicate handoff still prevented by planGenHandoff', () => {
    const plan = planGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: 'tx_test_1',
      items: [
        {
          orderItemId: 'oi1',
          mbmSku: 'MBM-RP-BPC-INJ-001',
          isPrescriptionEligible: true,
        },
      ],
      existingLinks: [{ orderItemId: 'oi1', genOrderId: 'existing_gen' }],
      resolveMapping: () => ({
        mbmSku: 'MBM-RP-BPC-INJ-001',
        genClientProductId: 'prod_x',
        mappingStatus: 'READY',
        active: true,
      }),
    });
    expect(plan.ok).toBe(true);
    if (plan.ok) {
      expect(plan.items[0].action).toBe('skip_already_linked');
    }
  });

  it('membership rebill still creates no GEN order', () => {
    const plan = planGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: 'tx_m',
      items: [
        {
          orderItemId: 'oi_m',
          mbmSku: 'MBM-MEMBER-REBILL',
          isPrescriptionEligible: false,
        },
      ],
      existingLinks: [],
      resolveMapping: () => null,
    });
    expect(plan.ok).toBe(true);
    if (plan.ok) {
      expect(plan.items[0].action).toBe('skip_non_rx');
    }
  });

  it('multi-Rx order has per-line status', () => {
    const a = buildSafeCustomerClinicalLine({
      orderItemId: '1',
      mbmSku: 'MBM-RP-BPC-INJ-001',
      paymentStatus: 'paid',
      clinicalStatus: 'GEN_PROVIDER_REVIEW',
    });
    const b = buildSafeCustomerClinicalLine({
      orderItemId: '2',
      mbmSku: 'MBM-WM-SEM-001',
      paymentStatus: 'paid',
      clinicalStatus: 'GEN_ACTION_REQUIRED',
      requiredActions: [{ type: 'form', title: 'Form' }],
    });
    expect(a.portalStage).toBe('provider_review');
    expect(b.portalStage).toBe('health_information_needed');
    expect(a.orderItemId).not.toBe(b.orderItemId);
  });

  it('normalizeRequiredActionsList preserves completion only from GEN fields', () => {
    const list = normalizeRequiredActionsList([
      { id: '1', type: 'form', status: 'completed' },
      { id: '2', type: 'lab', status: 'open' },
    ]);
    expect(list[0].completed).toBe(true);
    expect(list[1].completed).toBe(false);
  });
});
