import { describe, expect, it } from 'vitest';
import { resolveRequireGenMappingForRx } from './commerceEnvPolicy';
import {
  assertCartEligibleForCheckout,
  classifyCommerceType,
  resolveProductEligibility,
  shouldCreateGenOrderOnMembershipRebill,
} from './productEligibility';

describe('productEligibility', () => {
  it('classifies commerce types from SKU prefixes', () => {
    expect(classifyCommerceType({ mbmSku: 'MBM-WM-SEM-INJ-001' })).toBe('RX_MEDICATION');
    expect(classifyCommerceType({ mbmSku: 'MBM-ACC-CIS-ACC-001' })).toBe('ACCESSORY');
    expect(classifyCommerceType({ mbmSku: 'MBM-MEM-SEM-MEM-001' })).toBe('MEMBERSHIP');
    expect(classifyCommerceType({ mbmSku: 'MBM-PC-IPV-SRV-001' })).toBe('PROVIDER_VISIT');
    expect(classifyCommerceType({ mbmSku: 'MBM-PC-LAB-KIT-001' })).toBe('LAB');
    expect(classifyCommerceType({ mbmSku: 'MBM-SHIP-TWO-DAY-001' })).toBe('SHIPPING');
  });

  it('marks accessories READY without GEN', () => {
    const el = resolveProductEligibility({
      mbmSku: 'MBM-ACC-ICE-ACC-001',
      hasActiveTagadaMapping: true,
      genMappingStatus: 'EXCLUDED',
    });
    expect(el.readiness).toBe('READY');
    expect(el.genHandoffAllowed).toBe(false);
    expect(el.tagadaCheckoutAllowed).toBe(true);
  });

  it('marks Rx GEN_BLOCKED when mapping missing but Tagada OK', () => {
    const el = resolveProductEligibility({
      mbmSku: 'MBM-RP-BPC-INJ-001',
      hasActiveTagadaMapping: true,
      genMappingStatus: 'MISSING',
    });
    expect(el.readiness).toBe('GEN_BLOCKED');
    expect(el.tagadaCheckoutAllowed).toBe(true);
    expect(el.genHandoffAllowed).toBe(false);
    expect(el.requiresPaymentBeforeGen).toBe(true);
  });

  it('fail-closes Tagada-blocked SKUs', () => {
    const el = resolveProductEligibility({
      mbmSku: 'MBM-WM-SEM-INJ-001',
      hasActiveTagadaMapping: false,
    });
    expect(el.readiness).toBe('TAGADA_BLOCKED');
    expect(el.tagadaCheckoutAllowed).toBe(false);
  });

  it('cart gate allows GEN_BLOCKED Rx unless requireGenMappingForRx', () => {
    const line = {
      mbmSku: 'MBM-WM-SEM-INJ-001',
      hasActiveTagadaMapping: true,
      genMappingStatus: 'MISSING' as const,
    };
    expect(assertCartEligibleForCheckout({ lines: [line] }).ok).toBe(true);
    const blocked = assertCartEligibleForCheckout({
      lines: [line],
      requireGenMappingForRx: true,
    });
    expect(blocked.ok).toBe(false);
  });

  it('production env policy fail-closes Rx without GEN mapping; accessories still ok', () => {
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
    expect(
      assertCartEligibleForCheckout({ lines: [acc], requireGenMappingForRx: requireGen }).ok,
    ).toBe(true);
    const readyRx = {
      ...rx,
      genMappingStatus: 'READY' as const,
    };
    // READY map alone is not enough — API Orders required when production guard is on.
    expect(
      assertCartEligibleForCheckout({
        lines: [readyRx],
        requireGenMappingForRx: requireGen,
        genApiOrdersEnabled: false,
      }).ok,
    ).toBe(false);
    expect(
      assertCartEligibleForCheckout({
        lines: [readyRx],
        requireGenMappingForRx: requireGen,
        genApiOrdersEnabled: true,
      }).ok,
    ).toBe(true);
  });

  it('launch-ready family SKUs may pay while GEN API Orders stays off', () => {
    const line = {
      mbmSku: 'MBM-WM-SEM-B12-001',
      hasActiveTagadaMapping: true,
      genMappingStatus: 'MISSING' as const,
    };
    expect(
      assertCartEligibleForCheckout({
        lines: [line],
        requireGenMappingForRx: true,
        genApiOrdersEnabled: false,
      }).ok,
    ).toBe(true);
    const otherRx = {
      mbmSku: 'MBM-RP-BPC-INJ-001',
      hasActiveTagadaMapping: true,
      genMappingStatus: 'READY' as const,
    };
    expect(
      assertCartEligibleForCheckout({
        lines: [otherRx],
        requireGenMappingForRx: true,
        genApiOrdersEnabled: false,
      }).ok,
    ).toBe(false);
  });

  it('membership rebill never creates GEN medication orders', () => {
    expect(shouldCreateGenOrderOnMembershipRebill()).toBe(false);
  });
});
