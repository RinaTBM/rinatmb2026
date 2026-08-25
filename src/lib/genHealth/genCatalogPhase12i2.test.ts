import { describe, expect, it } from 'vitest';
import {
  additiveChangeRequiresNewSku,
  classifyGenMatch,
  classifyWebsiteRxReadiness,
  costAnalysisRow,
  formChangeRequiresNewSku,
  isProductionRxLaunchReady,
  isResearchWellnessGenProduct,
  mayMarkMappingReady,
  markupFromCostCents,
  proposeNextInjectionSku,
} from './genCatalogMatching';
import { MEMBERSHIP_FULFILLMENT_CROSSWALK } from '../catalog/membershipSkuCrosswalk';

describe('Phase 12I.2 GEN formulary matching', () => {
  it('B6→B12 mismatch requires new SKU', () => {
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
      genClientProductId: 'gen_sem_b12',
    });
    expect(c.matchType).toBe('NO_MATCH');
    expect(c.requiresNewSku).toBe(true);
  });

  it('B6→glycine mismatch requires new SKU', () => {
    expect(
      additiveChangeRequiresNewSku({
        mbmFormulation: 'Tirzepatide + B6',
        genFormulation: 'Tirzepatide + glycine',
      }),
    ).toBe(true);
  });

  it('B6→plain base requires new SKU', () => {
    expect(
      additiveChangeRequiresNewSku({
        mbmFormulation: 'Semaglutide + B6',
        genFormulation: 'Semaglutide',
      }),
    ).toBe(true);
  });

  it('form mismatch injection→nasal requires new SKU', () => {
    expect(formChangeRequiresNewSku({ mbmForm: 'Injection', genForm: 'Nasal Spray' })).toBe(true);
    const c = classifyGenMatch({
      mbmFormulation: 'Selank',
      mbmForm: 'Injection',
      genFormulation: 'Selank',
      genForm: 'Nasal Spray',
      genClientProductId: 'gen_selank_ns',
    });
    expect(c.matchType).toBe('NO_MATCH');
    expect(c.requiresNewSku).toBe(true);
  });

  it('strength mismatch is AMBIGUOUS and not READY', () => {
    const c = classifyGenMatch({
      mbmFormulation: 'Estradiol',
      mbmForm: 'Patch',
      mbmStrength: '0.025mg',
      genFormulation: 'Estradiol',
      genForm: 'Patch',
      genStrength: '0.05mg',
      genClientProductId: 'gen_est',
    });
    expect(c.matchType).toBe('AMBIGUOUS');
    expect(c.requiresNewSku).toBe(true);
    expect(mayMarkMappingReady({ matchType: c.matchType })).toBe(false);
  });

  it('package mismatch is AMBIGUOUS', () => {
    const c = classifyGenMatch({
      mbmFormulation: 'NAD+',
      mbmForm: 'Injection',
      mbmPackage: '5mL',
      genFormulation: 'NAD+',
      genForm: 'Injection',
      genPackage: '10mL',
      genClientProductId: 'gen_nad',
    });
    expect(c.matchType).toBe('AMBIGUOUS');
  });

  it('exact owner-verified map may be READY', () => {
    const c = classifyGenMatch({
      mbmFormulation: 'BPC-157 / TB500',
      mbmForm: 'Injection',
      mbmStrength: '3 MG / 3 MG/ML',
      mbmPackage: '5 mL',
      genFormulation: 'BPC-157 / TB500 3 MG / 3 MG/ML (5 ML)',
      genForm: 'Injection',
      genStrength: '3 MG / 3 MG/ML',
      genPackage: '5 mL',
      genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn',
      ownerVerified: true,
    });
    expect(c.matchType).toBe('EXACT');
    expect(mayMarkMappingReady({ matchType: 'EXACT', ownerVerified: true })).toBe(true);
  });

  it('ambiguous map stays BLOCKED / cannot mark READY', () => {
    expect(mayMarkMappingReady({ matchType: 'AMBIGUOUS', ownerVerified: true })).toBe(false);
    expect(
      classifyWebsiteRxReadiness({
        mappingStatus: 'BLOCKED',
        matchType: 'AMBIGUOUS',
      }),
    ).toBe('GEN_BLOCKED');
  });

  it('new SKU proposal generation for SEM/TIR sequences', () => {
    expect(
      proposeNextInjectionSku({
        family: 'SEM',
        existingSkus: ['MBM-WM-SEM-INJ-001', 'MBM-WM-SEM-INJ-004'],
      }),
    ).toBe('MBM-WM-SEM-INJ-005');
    expect(
      proposeNextInjectionSku({
        family: 'TIR',
        existingSkus: ['MBM-WM-TIR-INJ-001', 'MBM-WM-TIR-INJ-004'],
      }),
    ).toBe('MBM-WM-TIR-INJ-005');
  });

  it('11700 cost yields exact +50/+75/+100 cents', () => {
    expect(markupFromCostCents(11700, 1.5)).toBe(17550);
    expect(markupFromCostCents(11700, 1.75)).toBe(20475);
    expect(markupFromCostCents(11700, 2)).toBe(23400);
    const row = costAnalysisRow({
      currentRetailCents: 19900,
      medicationCostCents: 11700,
      shippingCostCents: null,
    });
    expect(row.plus50Med).toBe(17550);
    expect(row.plus75Med).toBe(20475);
    expect(row.plus100Med).toBe(23400);
    // current $199 vs +50 $175.50 → above +50 band for med-only analysis
    expect(19900 - 17550).toBe(2350);
  });

  it('rounds markup cents (half-up via Math.round)', () => {
    // 3333 * 1.5 = 4999.5 → 5000
    expect(markupFromCostCents(3333, 1.5)).toBe(5000);
    expect(markupFromCostCents(3333, 1.75)).toBe(5833);
  });

  it('unknown cost and unknown shipping stay null (not invented)', () => {
    const row = costAnalysisRow({
      currentRetailCents: 10000,
      medicationCostCents: null,
      shippingCostCents: null,
    });
    expect(row.plus50Med).toBeNull();
    expect(row.plus75Med).toBeNull();
    expect(row.plus100Med).toBeNull();
    expect(row.totalCostCents).toBeNull();
    expect(row.plus50Landed).toBeNull();
  });

  it('landed cost tiers only when shipping known', () => {
    const row = costAnalysisRow({
      currentRetailCents: 19900,
      medicationCostCents: 10000,
      shippingCostCents: 2000,
    });
    expect(row.totalCostCents).toBe(12000);
    expect(row.plus50Landed).toBe(18000);
    expect(row.plus75Landed).toBe(21000);
    expect(row.plus100Landed).toBe(24000);
  });

  it('Research Wellness GEN products stay separate from sellable activation', () => {
    expect(isResearchWellnessGenProduct('Epitalon Longevity & Anti-Aging Protocol')).toBe(true);
    expect(isResearchWellnessGenProduct('GHK-Cu Anti-Aging & Skin Health Protocol')).toBe(true);
    expect(isResearchWellnessGenProduct('Elite Body Recomp')).toBe(true);
    expect(isResearchWellnessGenProduct('BPC-157 / TB500')).toBe(false);
  });

  it('membership crosswalk is not auto-updated by mapping helpers', () => {
    // Phase 12I.2 must document crosswalk needs without mutating the live table.
    const sem = MEMBERSHIP_FULFILLMENT_CROSSWALK.filter((r) => r.membershipAppId === 'm1');
    const tir = MEMBERSHIP_FULFILLMENT_CROSSWALK.filter((r) => r.membershipAppId === 'm2');
    expect(sem.map((r) => r.fulfillmentSku)).toEqual([
      'MBM-WM-SEM-B12-004',
      'MBM-WM-SEM-GLY-004',
      'MBM-WM-SEM-B12-004',
    ]);
    expect(tir.map((r) => r.fulfillmentSku)).toEqual([
      'MBM-WM-TIR-B12-004',
      'MBM-WM-TIR-GLY-004',
      'MBM-WM-TIR-B12-004',
    ]);
  });

  it('READY mapping still blocked from production launch when API Orders unavailable', () => {
    const r = isProductionRxLaunchReady({
      mappingStatus: 'READY',
      genApiOrdersEnabled: false,
    });
    expect(r.mappingReady).toBe(true);
    expect(r.productionRxLaunchReady).toBe(false);
    expect(r.code).toBe('GEN_API_ORDERS_NOT_ENABLED');
  });

  it('website readiness NEW_SKU_REQUIRED when formulation replacement needed', () => {
    expect(
      classifyWebsiteRxReadiness({
        mappingStatus: 'BLOCKED',
        requiresNewSku: true,
      }),
    ).toBe('NEW_SKU_REQUIRED');
  });
});
