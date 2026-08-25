import { describe, expect, it } from 'vitest';
import {
  WEBSITE_PRODUCT_FAMILIES,
  assertNoInventedGenIds,
  countByRoutingStatus,
  resolveFamilyVariant,
  REAL_GEN_ORDER_SUBMISSION_ENABLED,
  WEBSITE_FAMILY_CUTOVER_ENABLED,
  OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS,
  applyOwnerVerifiedPairingsToFamilies,
  effectiveGenPairingVerified,
  listPatientVisibleVariants,
} from '@/data/websiteFamilies';
import { assertFamilyVariantGenOrderAllowed } from '@/lib/catalog/familyRoutingGate';

describe('MBM website family → GEN routing build', () => {
  it('keeps cutover and real GEN orders OFF', () => {
    expect(WEBSITE_FAMILY_CUTOVER_ENABLED).toBe(false);
    expect(REAL_GEN_ORDER_SUBMISSION_ENABLED).toBe(false);
  });

  it('defaults genPairingVerified to false for every variant', () => {
    expect(() => assertNoInventedGenIds()).not.toThrow();
    for (const f of WEBSITE_PRODUCT_FAMILIES) {
      for (const v of f.variants) {
        expect(v.genPairingVerified).toBe(false);
      }
    }
  });

  it('covers 30 families / 103 variants with expected status buckets', () => {
    expect(WEBSITE_PRODUCT_FAMILIES).toHaveLength(30);
    const total = WEBSITE_PRODUCT_FAMILIES.reduce((n, f) => n + f.variants.length, 0);
    expect(total).toBe(103);
    const counts = countByRoutingStatus();
    expect(counts.ROUTING_READY).toBe(0);
    expect(counts.FORMULARY_PENDING).toBe(14);
    expect(counts.GEN_PAIRING_PENDING).toBeGreaterThan(0);
    expect(counts.FUTURE_HIDDEN + counts.BLOCKED + counts.GEN_PAIRING_PENDING + counts.FORMULARY_PENDING).toBe(103);
  });

  it('SEM B12 vs Glycine and membership resolve to distinct GEN routes', () => {
    const b12 = resolveFamilyVariant('semaglutide', {
      purchaseType: 'one_time',
      additive: 'Vitamin B12',
      doseTier: 'Starting / Low',
    });
    const gly = resolveFamilyVariant('semaglutide', {
      purchaseType: 'one_time',
      additive: 'Glycine',
      doseTier: 'Starting / Low',
    });
    const mem = resolveFamilyVariant('semaglutide', { purchaseType: 'membership' });
    expect(b12.ok && gly.ok && mem.ok).toBe(true);
    expect(b12.variant?.websiteVariantId).toBe('sem-b12-starting-low');
    expect(gly.variant?.websiteVariantId).toBe('sem-glycine-starting-low');
    expect(mem.variant?.websiteVariantId).toBe('sem-membership');
    expect(mem.variant?.finalRetailPrice).toBe(149);
    expect(b12.variant?.genClientProductId).toBeTruthy();
    expect(gly.variant?.genClientProductId).toBeTruthy();
    expect(b12.variant?.genClientProductId).not.toBe(gly.variant?.genClientProductId);
  });

  it('TIR membership is $275 and one-time tiers exist without inventing CREATE ids', () => {
    const mem = resolveFamilyVariant('tirzepatide', { purchaseType: 'membership' });
    expect(mem.variant?.finalRetailPrice).toBe(275);
    expect(mem.variant?.genClientProductId).toBeTruthy();
    const tier = resolveFamilyVariant('tirzepatide', {
      purchaseType: 'one_time',
      additive: 'Vitamin B12',
      doseTier: 'Mid',
    });
    expect(tier.variant?.websiteVariantId).toBe('tir-b12-mid');
    expect(tier.variant?.genClientProductId).toBeNull();
    expect(tier.variant?.routingStatus).toBe('BLOCKED');
  });

  it('NAD injection vs nasal and nasal A vs B route correctly', () => {
    const inj = resolveFamilyVariant('nad', { form: 'Injection', package: '5mL' });
    const nasalA = resolveFamilyVariant('nad', { form: 'Nasal Spray', nasalOption: 'r84' });
    const nasalB = resolveFamilyVariant('nad', { form: 'Nasal Spray', nasalOption: 'r85' });
    expect(inj.variant?.websiteVariantId).toBe('nad-inj-5ml-500');
    expect(inj.variant?.routingStatus).toBe('FORMULARY_PENDING');
    expect(inj.variant?.genClientProductId).toBeNull();
    expect(nasalA.variant?.websiteVariantId).toBe('nad-nasal-r84');
    expect(nasalA.variant?.finalRetailPrice).toBe(79);
    expect(nasalA.variant?.genClientProductId).toContain('FVwkzvQqWIZRNAwbslGw');
    expect(nasalB.variant?.websiteVariantId).toBe('nad-nasal-r85');
    expect(nasalB.variant?.finalRetailPrice).toBe(109);
    expect(nasalB.variant?.genClientProductId).toBeNull();
  });

  it('Wolverine capsule vs injection use separate GEN CPs and prices', () => {
    const cap = resolveFamilyVariant('wolverine-bpc-tb', { form: 'Capsule' });
    const inj = resolveFamilyVariant('wolverine-bpc-tb', { form: 'Injection' });
    expect(cap.variant?.finalRetailPrice).toBe(29);
    expect(inj.variant?.finalRetailPrice).toBe(159);
    expect(cap.variant?.genClientProductId).not.toBe(inj.variant?.genClientProductId);
  });

  it('Estradiol patch strengths resolve without vaginal CP substitution', () => {
    const a = resolveFamilyVariant('estradiol', { strength: '0.025' });
    const b = resolveFamilyVariant('estradiol', { strength: '0.1' });
    expect(a.variant?.websiteVariantId).toBe('estradiol-patch-r26');
    expect(b.variant?.websiteVariantId).toBe('estradiol-patch-r29');
    expect(a.variant?.genClientProductId).toBeNull();
    expect(b.variant?.finalRetailPrice).toBe(149);
  });

  it('Minoxidil locks Fin/Minox 0.1%/5% at $79', () => {
    const m = resolveFamilyVariant('minoxidil', {});
    expect(m.variant?.websiteVariantId).toBe('minoxidil-fin-minox-0.1-5');
    expect(m.variant?.finalRetailPrice).toBe(79);
    expect(m.variant?.genClientProductId).toContain('BboYS4a2Uj7APetrFo6W');
  });

  it('GEN order gate requires pairing verified + ROUTING_READY + cutover', () => {
    const blocked = assertFamilyVariantGenOrderAllowed({
      genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y',
      genPairingVerified: false,
      routingStatus: 'GEN_PAIRING_PENDING',
    });
    expect(blocked.allowed).toBe(false);
    expect(blocked.code).toBe('CUTOVER_OFF');

    const stillBlocked = assertFamilyVariantGenOrderAllowed({
      genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y',
      genPairingVerified: true,
      routingStatus: 'ROUTING_READY',
      websiteFamilyCutoverEnabled: true,
      realGenOrderSubmissionEnabled: true,
    });
    expect(stillBlocked.allowed).toBe(true);

    const pairingGate = assertFamilyVariantGenOrderAllowed({
      genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y',
      genPairingVerified: false,
      routingStatus: 'ROUTING_READY',
      websiteFamilyCutoverEnabled: true,
      realGenOrderSubmissionEnabled: true,
    });
    expect(pairingGate.allowed).toBe(false);
    expect(pairingGate.code).toBe('PAIRING_NOT_VERIFIED');
  });

  it('routing gate matrix: pairing false / formulary / future / blocked all deny handoff', () => {
    const base = {
      websiteFamilyCutoverEnabled: true,
      realGenOrderSubmissionEnabled: true,
    } as const;
    const genId = 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y';

    const pairingFalse = assertFamilyVariantGenOrderAllowed({
      ...base,
      genClientProductId: genId,
      genPairingVerified: false,
      routingStatus: 'ROUTING_READY',
    });
    expect(pairingFalse.allowed).toBe(false);
    expect(pairingFalse.code).toBe('PAIRING_NOT_VERIFIED');

    // Verified + cutover on → structurally eligible (production cutover flags still OFF by default)
    const eligible = assertFamilyVariantGenOrderAllowed({
      ...base,
      genClientProductId: genId,
      genPairingVerified: true,
      routingStatus: 'ROUTING_READY',
    });
    expect(eligible.allowed).toBe(true);

    // Same verified path with production defaults still blocked by cutover
    const cutoverOff = assertFamilyVariantGenOrderAllowed({
      genClientProductId: genId,
      genPairingVerified: true,
      routingStatus: 'ROUTING_READY',
    });
    expect(cutoverOff.allowed).toBe(false);
    expect(cutoverOff.code).toBe('CUTOVER_OFF');

    for (const status of ['FORMULARY_PENDING', 'FUTURE_HIDDEN', 'BLOCKED'] as const) {
      const r = assertFamilyVariantGenOrderAllowed({
        ...base,
        genClientProductId: genId,
        genPairingVerified: true,
        routingStatus: status,
      });
      expect(r.allowed).toBe(false);
      expect(r.code).toBe(status);
    }
  });

  it('keeps FUTURE_HIDDEN out of patient-visible catalog options', () => {
    const hiddenFamilies = ['pt-141', 'scream-cream', 'selank', 'semax'];
    for (const id of hiddenFamilies) {
      const f = WEBSITE_PRODUCT_FAMILIES.find((x) => x.familyId === id);
      expect(f).toBeTruthy();
      const visible = listPatientVisibleVariants(f!);
      expect(visible.every((v) => v.routingStatus !== 'FUTURE_HIDDEN')).toBe(true);
      if (id === 'pt-141' || id === 'scream-cream') {
        expect(visible).toHaveLength(0);
      }
    }
    const nad = WEBSITE_PRODUCT_FAMILIES.find((x) => x.familyId === 'nad')!;
    const nadVisible = listPatientVisibleVariants(nad);
    expect(nadVisible.some((v) => v.websiteVariantId.includes('r81'))).toBe(false);
    expect(nadVisible.some((v) => v.websiteVariantId.includes('r82'))).toBe(false);
  });

  it('pairing verification registry stays empty and apply flips nothing in this phase', () => {
    expect(OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.size).toBe(0);
    for (const f of WEBSITE_PRODUCT_FAMILIES) {
      for (const v of f.variants) {
        expect(effectiveGenPairingVerified(v)).toBe(false);
      }
    }
    const { result } = applyOwnerVerifiedPairingsToFamilies(WEBSITE_PRODUCT_FAMILIES);
    expect(result.variantsFlippedToTrue).toBe(0);
    expect(result.anyVerified).toBe(false);
  });

  it('FORMULARY_PENDING variants never invent a GEN clientProductId', () => {
    for (const f of WEBSITE_PRODUCT_FAMILIES) {
      for (const v of f.variants) {
        if (v.routingStatus === 'FORMULARY_PENDING') {
          expect(v.genClientProductId).toBeNull();
        }
      }
    }
  });
});
