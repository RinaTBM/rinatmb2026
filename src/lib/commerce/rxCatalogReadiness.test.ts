import { describe, expect, it } from 'vitest';
import { resolveGenApiOrdersEnabled, resolveRequireGenMappingForRx } from './commerceEnvPolicy';
import { assertCartEligibleForCheckout, shouldCreateGenOrderOnMembershipRebill } from './productEligibility';
import {
  BPC_OWNER_PRICING,
  CATALOG_READY_RX_SKUS,
  catalogSummaryCounts,
  isHistoricalSkuPreserved,
  MEMBERSHIP_LAUNCH_AUDIT,
  NEW_SKU_REQUIRED_RX_SKUS,
  PROPOSED_REPLACEMENT_SKUS,
  resolveStorefrontRxAvailability,
  TEMPORARILY_UNAVAILABLE_RX_SKUS,
} from './rxCatalogReadiness';
import {
  classifyOwnerPriceBand,
  costAnalysisRow,
  markupFromCostCents,
} from '../genHealth/genCatalogMatching';

describe('Phase 12I.3 rx catalog readiness', () => {
  it('summary counts match definitive matrix', () => {
    const s = catalogSummaryCounts();
    expect(s.totalRx).toBe(28);
    expect(s.catalogReady).toBe(1);
    expect(s.temporarilyUnavailable).toBe(18);
    expect(s.newSkuRequired).toBe(9);
    expect(s.productionRxReady).toBe(0);
    expect(
      CATALOG_READY_RX_SKUS.length +
        TEMPORARILY_UNAVAILABLE_RX_SKUS.length +
        NEW_SKU_REQUIRED_RX_SKUS.length,
    ).toBe(28);
  });

  it('BPC catalog READY but production blocked when API Orders=false', () => {
    const a = resolveStorefrontRxAvailability({
      mbmSku: 'MBM-RP-BPC-INJ-001',
      genApiOrdersEnabled: false,
    });
    expect(a?.catalogReady).toBe(true);
    expect(a?.productionPurchasable).toBe(false);
    expect(a?.customerFacingStatus).toBe('COMING_SOON');
    expect(a?.websiteAction).toBe('KEEP_READY');
  });

  it('BPC production purchasable only when API Orders enabled', () => {
    const a = resolveStorefrontRxAvailability({
      mbmSku: 'MBM-RP-BPC-INJ-001',
      genApiOrdersEnabled: true,
    });
    expect(a?.productionPurchasable).toBe(true);
    expect(a?.customerFacingStatus).toBe('AVAILABLE');
  });

  it('BLOCKED Rx cannot checkout (storefront + server when guard on)', () => {
    const sku = 'MBM-LON-NAD-INJ-001';
    const store = resolveStorefrontRxAvailability({ mbmSku: sku, genApiOrdersEnabled: false });
    expect(store?.customerFacingStatus).toBe('TEMPORARILY_UNAVAILABLE');
    expect(store?.productionPurchasable).toBe(false);
    const blocked = assertCartEligibleForCheckout({
      lines: [
        {
          mbmSku: sku,
          hasActiveTagadaMapping: true,
          genMappingStatus: 'MISSING',
        },
      ],
      requireGenMappingForRx: true,
      genApiOrdersEnabled: false,
    });
    expect(blocked.ok).toBe(false);
  });

  it('NEW_SKU_REQUIRED old SKU cannot checkout', () => {
    const sku = 'MBM-WM-SEM-INJ-001';
    const store = resolveStorefrontRxAvailability({ mbmSku: sku });
    expect(store?.websiteAction).toBe('PREPARE_REPLACEMENT_SKU');
    expect(store?.productionPurchasable).toBe(false);
    expect(store?.proposedNewSku).toBe('MBM-WM-SEM-INJ-005');
    const blocked = assertCartEligibleForCheckout({
      lines: [
        {
          mbmSku: sku,
          hasActiveTagadaMapping: true,
          genMappingStatus: 'MISSING',
        },
      ],
      requireGenMappingForRx: true,
      genApiOrdersEnabled: true,
    });
    expect(blocked.ok).toBe(false);
  });

  it('accessory bypasses GEN/API Orders guard', () => {
    const ok = assertCartEligibleForCheckout({
      lines: [
        {
          mbmSku: 'MBM-ACC-ICE-ACC-001',
          hasActiveTagadaMapping: true,
          genMappingStatus: 'EXCLUDED',
        },
      ],
      requireGenMappingForRx: true,
      genApiOrdersEnabled: false,
    });
    expect(ok.ok).toBe(true);
    expect(
      resolveStorefrontRxAvailability({ mbmSku: 'MBM-ACC-ICE-ACC-001' }),
    ).toBeNull();
  });

  it('server guard cannot be bypassed by frontend (API Orders false blocks READY Rx)', () => {
    const requireGen = resolveRequireGenMappingForRx({ MBM_RUNTIME_ENV: 'production' });
    expect(resolveGenApiOrdersEnabled({})).toBe(false);
    const result = assertCartEligibleForCheckout({
      lines: [
        {
          mbmSku: 'MBM-RP-BPC-INJ-001',
          hasActiveTagadaMapping: true,
          genMappingStatus: 'READY',
        },
      ],
      requireGenMappingForRx: requireGen,
      // Frontend might claim available — server still requires this true.
      genApiOrdersEnabled: false,
    });
    expect(result.ok).toBe(false);
  });

  it('API Orders false blocks production Rx; true + READY map allows eligibility', () => {
    const line = {
      mbmSku: 'MBM-RP-BPC-INJ-001',
      hasActiveTagadaMapping: true,
      genMappingStatus: 'READY' as const,
    };
    expect(
      assertCartEligibleForCheckout({
        lines: [line],
        requireGenMappingForRx: true,
        genApiOrdersEnabled: false,
      }).ok,
    ).toBe(false);
    expect(
      assertCartEligibleForCheckout({
        lines: [line],
        requireGenMappingForRx: true,
        genApiOrdersEnabled: true,
      }).ok,
    ).toBe(true);
  });

  it('PRODUCTION_CHECKOUT_TEST_SKU allowlists only BPC; SEM still blocked', () => {
    const bpc = {
      mbmSku: 'MBM-RP-BPC-INJ-001',
      hasActiveTagadaMapping: true,
      genMappingStatus: 'MISSING' as const,
    };
    const sem = {
      mbmSku: 'MBM-WM-SEM-INJ-001',
      hasActiveTagadaMapping: true,
      genMappingStatus: 'READY' as const,
    };
    const ship = {
      mbmSku: 'MBM-SHIP-TWO-DAY-001',
      hasActiveTagadaMapping: true,
      genMappingStatus: 'EXCLUDED' as const,
    };
    expect(
      assertCartEligibleForCheckout({
        lines: [bpc, ship],
        requireGenMappingForRx: true,
        genApiOrdersEnabled: false,
        productionCheckoutTestSku: 'MBM-RP-BPC-INJ-001',
      }).ok,
    ).toBe(true);
    expect(
      assertCartEligibleForCheckout({
        lines: [sem],
        requireGenMappingForRx: true,
        genApiOrdersEnabled: false,
        productionCheckoutTestSku: 'MBM-RP-BPC-INJ-001',
      }).ok,
    ).toBe(false);
    expect(
      assertCartEligibleForCheckout({
        lines: [bpc, sem],
        requireGenMappingForRx: true,
        genApiOrdersEnabled: false,
        productionCheckoutTestSku: 'MBM-RP-BPC-INJ-001',
      }).ok,
    ).toBe(false);
  });

  it('unknown cost displays TBD / UNKNOWN band', () => {
    const row = costAnalysisRow({
      currentRetailCents: 19900,
      medicationCostCents: null,
      shippingCostCents: null,
    });
    expect(row.plus50Med).toBeNull();
    expect(row.priceBand).toBe('UNKNOWN');
    expect(classifyOwnerPriceBand({ currentRetailCents: 19900, medicationCostCents: null })).toBe(
      'UNKNOWN',
    );
  });

  it('BPC pricing markups: 11700 → 17550 → 20475 → 23400', () => {
    expect(BPC_OWNER_PRICING.atCostCents).toBe(11700);
    expect(markupFromCostCents(11700, 1.5)).toBe(17550);
    expect(markupFromCostCents(11700, 1.75)).toBe(20475);
    expect(markupFromCostCents(11700, 2)).toBe(23400);
    expect(BPC_OWNER_PRICING.plus50Cents).toBe(17550);
    expect(BPC_OWNER_PRICING.plus75Cents).toBe(20475);
    expect(BPC_OWNER_PRICING.plus100Cents).toBe(23400);
    expect(BPC_OWNER_PRICING.currentRetailCents).toBe(19900);
    expect(BPC_OWNER_PRICING.priceBand).toBe('BETWEEN +50 AND +75');
    const row = costAnalysisRow({
      currentRetailCents: 19900,
      medicationCostCents: 11700,
      shippingCostCents: null,
    });
    expect(row.plus50Med).toBe(17550);
    expect(row.plus75Med).toBe(20475);
    expect(row.plus100Med).toBe(23400);
    expect(row.totalCostCents).toBeNull(); // shipping unknown — no landed
    expect(row.priceBand).toBe('BETWEEN +50 AND +75');
  });

  it('replacement SKU does not overwrite old SKU', () => {
    const proposed = PROPOSED_REPLACEMENT_SKUS.map((p) => p.proposedMbmSku);
    const old = PROPOSED_REPLACEMENT_SKUS.map((p) => p.replacesMbmSku);
    expect(new Set(proposed).size).toBe(9);
    expect(new Set(old).size).toBe(9);
    for (const p of PROPOSED_REPLACEMENT_SKUS) {
      expect(p.proposedMbmSku).not.toBe(p.replacesMbmSku);
      expect(p.availabilityStatus).toBe('PREPARED_NOT_ACTIVATED');
      expect(NEW_SKU_REQUIRED_RX_SKUS).toContain(p.replacesMbmSku);
      expect(CATALOG_READY_RX_SKUS).not.toContain(p.proposedMbmSku);
    }
  });

  it('old historical SKU remains resolvable for past orders', () => {
    for (const sku of NEW_SKU_REQUIRED_RX_SKUS) {
      expect(isHistoricalSkuPreserved(sku)).toBe(true);
    }
    expect(isHistoricalSkuPreserved('MBM-RP-BPC-INJ-001')).toBe(true);
    expect(isHistoricalSkuPreserved('MBM-WM-SEM-INJ-005')).toBe(true); // proposed still tracked
  });

  it('membership rebill behavior unchanged', () => {
    expect(shouldCreateGenOrderOnMembershipRebill()).toBe(false);
    expect(MEMBERSHIP_LAUNCH_AUDIT.semaglutide.monthlyCents).toBe(14900);
    expect(MEMBERSHIP_LAUNCH_AUDIT.tirzepatide.monthlyCents).toBe(24900);
    expect(MEMBERSHIP_LAUNCH_AUDIT.semaglutide.status).toBe('BLOCKED_PENDING_GEN');
    expect(MEMBERSHIP_LAUNCH_AUDIT.tirzepatide.status).toBe('BLOCKED_PENDING_GEN');
  });

  it('GEN_API_ORDERS_ENABLED defaults false', () => {
    expect(resolveGenApiOrdersEnabled({})).toBe(false);
    expect(resolveGenApiOrdersEnabled({ GEN_API_ORDERS_ENABLED: 'true' })).toBe(true);
    expect(resolveGenApiOrdersEnabled({ GEN_API_ORDERS_ENABLED: 'false' })).toBe(false);
  });
});
