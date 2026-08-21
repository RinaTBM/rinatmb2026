import { describe, expect, it } from 'vitest';
import {
  canStartGenHandoff,
  genFailureHandoffStatus,
  paymentStatusAfterGenFailure,
} from './canStartGenHandoff';
import {
  additiveChangeRequiresNewSku,
  classifyGenMatch,
  costAnalysisRow,
  formChangeRequiresNewSku,
  proposeNextInjectionSku,
} from './genCatalogMatching';
import { resolveRequireGenMappingForRx } from '../commerce/commerceEnvPolicy';
import { assertCartEligibleForCheckout } from '../commerce/productEligibility';
import { shouldCreateGenOrderOnMembershipRebill } from './genHealth';

const bpcReady = {
  mbmSku: 'MBM-RP-BPC-INJ-001',
  genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn',
  mappingStatus: 'READY' as const,
  active: true,
};

describe('Phase 12G GEN catalog + handoff gate', () => {
  it('verified BPC mapping READY is callable', () => {
    expect(bpcReady.mappingStatus).toBe('READY');
    expect(bpcReady.genClientProductId).toContain('KXMm9SsbOEYnFy9phmZn');
    const gate = canStartGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: 'pay_test',
      orderItemIsRxMedication: true,
      mbmSku: bpcReady.mbmSku,
      mapping: bpcReady,
      existingGenOrderId: null,
      genHealthEnabled: true,
      handoffAutomationEnabled: true,
    });
    expect(gate.code).toBe('ELIGIBLE');
    expect(gate.mayCallGen).toBe(true);
  });

  it('ambiguous mapping is not classified EXACT without verification', () => {
    const r = classifyGenMatch({
      mbmFormulation: 'BPC-157/TB-500',
      mbmForm: 'Injection',
      genClientProductId: 'candidate_id',
      genFormulation: undefined,
      genForm: undefined,
    });
    expect(r.matchType).toBe('AMBIGUOUS');
  });

  it('B6→B12 requires new SKU', () => {
    expect(
      additiveChangeRequiresNewSku({
        mbmFormulation: 'Semaglutide + B6',
        genFormulation: 'Semaglutide + B12',
      }),
    ).toBe(true);
    const c = classifyGenMatch({
      mbmFormulation: 'Semaglutide + B6',
      mbmForm: 'Injection',
      genFormulation: 'Semaglutide + B12',
      genForm: 'Injection',
      genClientProductId: 'x',
    });
    expect(c.requiresNewSku).toBe(true);
    expect(proposeNextInjectionSku({ family: 'SEM', existingSkus: ['MBM-WM-SEM-INJ-004'] })).toBe(
      'MBM-WM-SEM-INJ-005',
    );
  });

  it('injection→nasal requires new SKU', () => {
    expect(
      formChangeRequiresNewSku({ mbmForm: 'Injection', genForm: 'Nasal Spray' }),
    ).toBe(true);
  });

  it('missing GEN mapping blocks production Rx; accessories bypass', () => {
    const requireGen = resolveRequireGenMappingForRx({ MBM_RUNTIME_ENV: 'production' });
    expect(requireGen).toBe(true);
    const rx = {
      mbmSku: 'MBM-WM-SEM-INJ-001',
      hasActiveTagadaMapping: true,
      genMappingStatus: 'MISSING' as const,
    };
    const acc = {
      mbmSku: 'MBM-ACC-ICE-ACC-001',
      hasActiveTagadaMapping: true,
      genMappingStatus: 'EXCLUDED' as const,
    };
    expect(assertCartEligibleForCheckout({ lines: [rx], requireGenMappingForRx: requireGen }).ok).toBe(
      false,
    );
    expect(assertCartEligibleForCheckout({ lines: [acc], requireGenMappingForRx: requireGen }).ok).toBe(
      true,
    );
  });

  it('canStartGenHandoff rejects unpaid / missing tx / BLOCKED map', () => {
    const base = {
      orderItemIsRxMedication: true,
      mbmSku: 'MBM-RP-BPC-INJ-001',
      mapping: bpcReady,
      existingGenOrderId: null,
      genHealthEnabled: true,
      handoffAutomationEnabled: true,
      tagadaTransactionId: 'tx',
      paymentStatus: 'paid',
    };
    expect(canStartGenHandoff({ ...base, paymentStatus: 'awaiting_payment' }).code).toBe('UNPAID');
    expect(canStartGenHandoff({ ...base, tagadaTransactionId: null }).code).toBe(
      'MISSING_TRANSACTION_ID',
    );
    expect(
      canStartGenHandoff({
        ...base,
        mapping: { ...bpcReady, mappingStatus: 'BLOCKED' },
      }).code,
    ).toBe('MAPPING_BLOCKED');
  });

  it('accepts READY map and returns ELIGIBLE_BUT_AUTOMATION_OFF when automation off', () => {
    const ready = canStartGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: 'tx',
      orderItemIsRxMedication: true,
      mbmSku: bpcReady.mbmSku,
      mapping: bpcReady,
      existingGenOrderId: null,
      genHealthEnabled: true,
      handoffAutomationEnabled: false,
    });
    expect(ready.code).toBe('ELIGIBLE_BUT_AUTOMATION_OFF');
    expect(ready.ok).toBe(true);
    expect(ready.mayCallGen).toBe(false);
  });

  it('duplicate order_item prevents second GEN order', () => {
    const r = canStartGenHandoff({
      paymentStatus: 'paid',
      tagadaTransactionId: 'tx',
      orderItemIsRxMedication: true,
      mbmSku: bpcReady.mbmSku,
      mapping: bpcReady,
      existingGenOrderId: 'gen_ord_existing',
      genHealthEnabled: true,
      handoffAutomationEnabled: true,
    });
    expect(r.code).toBe('ALREADY_LINKED');
    expect(r.mayCallGen).toBe(false);
  });

  it('GEN failure preserves paid status', () => {
    expect(paymentStatusAfterGenFailure('paid')).toBe('paid');
    expect(genFailureHandoffStatus()).toBe('GEN_RETRY_REQUIRED');
  });

  it('membership rebill still creates no GEN order', () => {
    expect(shouldCreateGenOrderOnMembershipRebill()).toBe(false);
  });

  it('cost analysis computes +50/+75/+100 without inventing shipping', () => {
    const row = costAnalysisRow({
      currentRetailCents: 19900,
      medicationCostCents: 11700,
      shippingCostCents: null,
    });
    expect(row.plus50Med).toBe(17550);
    expect(row.plus75Med).toBe(20475);
    expect(row.plus100Med).toBe(23400);
    expect(row.totalCostCents).toBeNull();
    expect(row.plus50Landed).toBeNull();
    expect(row.currentGrossOverMed).toBe(8200);
  });
});
