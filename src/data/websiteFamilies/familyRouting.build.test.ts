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
  it('enables website family cutover and keeps real GEN orders OFF', () => {
    expect(WEBSITE_FAMILY_CUTOVER_ENABLED).toBe(true);
    expect(REAL_GEN_ORDER_SUBMISSION_ENABLED).toBe(false);
  });

  it('defaults genPairingVerified false unless registry lists the GEN CP', () => {
    expect(() => assertNoInventedGenIds()).not.toThrow();
    for (const f of WEBSITE_PRODUCT_FAMILIES) {
      for (const v of f.variants) {
        if (v.genPairingVerified) {
          expect(OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.has(v.genClientProductId!)).toBe(true);
          expect(effectiveGenPairingVerified(v)).toBe(true);
        }
      }
    }
  });

  it('covers 30 families / 113 variants with amended pairing status buckets', () => {
    expect(WEBSITE_PRODUCT_FAMILIES).toHaveLength(30);
    const total = WEBSITE_PRODUCT_FAMILIES.reduce((n, f) => n + f.variants.length, 0);
    expect(total).toBe(113);
    const counts = countByRoutingStatus();
    expect(counts.ROUTING_READY).toBe(29);
    expect(counts.FORMULARY_PENDING).toBe(14);
    expect(counts.GEN_PAIRING_PENDING).toBe(17);
    expect(counts.FUTURE_HIDDEN).toBe(51);
    expect(counts.BLOCKED).toBe(2);
    expect(
      counts.FUTURE_HIDDEN +
        counts.BLOCKED +
        counts.GEN_PAIRING_PENDING +
        counts.FORMULARY_PENDING +
        counts.ROUTING_READY,
    ).toBe(113);
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
    expect(mem.variant?.finalRetailPrice).toBe(125);
    expect(b12.variant?.genClientProductId).toBeTruthy();
    expect(gly.variant?.genClientProductId).toBeTruthy();
    expect(b12.variant?.genClientProductId).not.toBe(gly.variant?.genClientProductId);
  });

  it('TIR membership is $179 and one-time tiers share approved SvFDJ7 backend', () => {
    const mem = resolveFamilyVariant('tirzepatide', { purchaseType: 'membership' });
    expect(mem.variant?.finalRetailPrice).toBe(179);
    expect(mem.variant?.genProductId).toBe('SvFDJ7W4nmWL2bkLUMMS');
    expect(mem.variant?.genPairingVerified).toBe(true);
    const tier = resolveFamilyVariant('tirzepatide', {
      purchaseType: 'one_time',
      additive: 'Vitamin B12',
      doseTier: 'Mid',
    });
    expect(tier.variant?.websiteVariantId).toBe('tir-b12-mid');
    expect(tier.variant?.genProductId).toBe('SvFDJ7W4nmWL2bkLUMMS');
    expect(tier.variant?.routingStatus).toBe('ROUTING_READY');
  });

  it('NAD selectors expose Tagada-ready injections and nasal r84; r85 stays held', () => {
    const inj = resolveFamilyVariant('nad', { form: 'Injection', package: '5mL' });
    const nasalA = resolveFamilyVariant('nad', { form: 'Nasal Spray', nasalOption: 'r84' });
    const nasalB = resolveFamilyVariant('nad', { form: 'Nasal Spray', nasalOption: 'r85' });
    expect(inj.ok).toBe(true);
    expect(inj.variant?.websiteVariantId).toBe('nad-inj-5ml-500');
    expect(inj.variant?.finalRetailPrice).toBe(199);
    expect(nasalA.variant?.websiteVariantId).toBe('nad-nasal-r84');
    expect(nasalA.variant?.finalRetailPrice).toBe(79);
    expect(nasalA.variant?.genClientProductId).toContain('FVwkzvQqWIZRNAwbslGw');
    expect(nasalB.ok).toBe(false);
    const nad = WEBSITE_PRODUCT_FAMILIES.find((x) => x.familyId === 'nad')!;
    expect(nad.variants.find((v) => v.websiteVariantId === 'nad-inj-5ml-500')?.routingStatus).toBe(
      'FORMULARY_PENDING',
    );
    expect(nad.variants.find((v) => v.websiteVariantId === 'nad-nasal-r85')?.genPairingVerified).toBe(
      false,
    );
  });

  it('Wolverine capsule vs injection stay on separate GEN CPs and are held from launch', () => {
    const family = WEBSITE_PRODUCT_FAMILIES.find((x) => x.familyId === 'wolverine-bpc-tb')!;
    const cap = family.variants.find((v) => v.websiteVariantId === 'wolverine-capsule')!;
    const inj = family.variants.find((v) => v.websiteVariantId === 'wolverine-injection')!;
    expect(cap.finalRetailPrice).toBe(29);
    expect(inj.finalRetailPrice).toBe(159);
    expect(cap.genClientProductId).not.toBe(inj.genClientProductId);
    expect(listPatientVisibleVariants(family)).toHaveLength(0);
  });

  it('Estradiol patch strengths exist as held backends (not on storefront yet)', () => {
    const family = WEBSITE_PRODUCT_FAMILIES.find((x) => x.familyId === 'estradiol')!;
    const a = family.variants.find((v) => v.websiteVariantId === 'estradiol-patch-r26')!;
    const b = family.variants.find((v) => v.websiteVariantId === 'estradiol-patch-r29')!;
    expect(a.genProductId).toBe('rziDZ07sJzDMXpdTvPcL');
    expect(b.genProductId).toBe('T4kMQnbixxDm7f0Ptjtq');
    expect(a.genPairingVerified).toBe(false);
    expect(b.finalRetailPrice).toBe(149);
    expect(listPatientVisibleVariants(family)).toHaveLength(0);
  });

  it('Minoxidil Dual Combo remains held until formulary is attached', () => {
    const family = WEBSITE_PRODUCT_FAMILIES.find((x) => x.familyId === 'minoxidil')!;
    const m = family.variants.find((v) => v.websiteVariantId === 'minoxidil-fin-minox-0.1-5')!;
    expect(m.finalRetailPrice).toBe(79);
    expect(m.genClientProductId).toContain('BboYS4a2Uj7APetrFo6W');
    expect(listPatientVisibleVariants(family)).toHaveLength(0);
  });

  it('GEN order gate requires pairing verified + ROUTING_READY + real GEN orders', () => {
    const unverifiedCp =
      'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BLf8inX395YNc7WPCD4O';
    const verifiedCp =
      'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y';

    const blocked = assertFamilyVariantGenOrderAllowed({
      genClientProductId: verifiedCp,
      genPairingVerified: true,
      routingStatus: 'ROUTING_READY',
    });
    expect(blocked.allowed).toBe(false);
    expect(blocked.code).toBe('REAL_GEN_ORDERS_DISABLED');

    const stillBlocked = assertFamilyVariantGenOrderAllowed({
      genClientProductId: verifiedCp,
      genPairingVerified: true,
      routingStatus: 'ROUTING_READY',
      websiteFamilyCutoverEnabled: true,
      realGenOrderSubmissionEnabled: true,
    });
    expect(stillBlocked.allowed).toBe(true);

    const pairingGate = assertFamilyVariantGenOrderAllowed({
      genClientProductId: unverifiedCp,
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
    const unverifiedCp =
      'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BLf8inX395YNc7WPCD4O';
    const verifiedCp =
      'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y';

    const pairingFalse = assertFamilyVariantGenOrderAllowed({
      ...base,
      genClientProductId: unverifiedCp,
      genPairingVerified: false,
      routingStatus: 'ROUTING_READY',
    });
    expect(pairingFalse.allowed).toBe(false);
    expect(pairingFalse.code).toBe('PAIRING_NOT_VERIFIED');

    // Verified + cutover on → structurally eligible (production cutover flags still OFF by default)
    const eligible = assertFamilyVariantGenOrderAllowed({
      ...base,
      genClientProductId: verifiedCp,
      genPairingVerified: true,
      routingStatus: 'ROUTING_READY',
    });
    expect(eligible.allowed).toBe(true);

    const genOrdersOff = assertFamilyVariantGenOrderAllowed({
      genClientProductId: verifiedCp,
      genPairingVerified: true,
      routingStatus: 'ROUTING_READY',
    });
    expect(genOrdersOff.allowed).toBe(false);
    expect(genOrdersOff.code).toBe('REAL_GEN_ORDERS_DISABLED');

    for (const status of ['FORMULARY_PENDING', 'FUTURE_HIDDEN', 'BLOCKED'] as const) {
      const r = assertFamilyVariantGenOrderAllowed({
        ...base,
        genClientProductId: verifiedCp,
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

  it('launch registry marks 10 compatible CPs verified including TIR SvFDJ7; apply is idempotent', () => {
    expect(OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.size).toBe(11);
    const verifiedVariants = WEBSITE_PRODUCT_FAMILIES.flatMap((f) =>
      f.variants.filter((v) => v.genPairingVerified),
    );
    // 8 SEM dose/membership backends + NAD r84 (membership shares Any Dose B12 CP)
    expect(verifiedVariants.length).toBeGreaterThanOrEqual(9);
    expect(verifiedVariants.every((v) => v.routingStatus === 'ROUTING_READY')).toBe(true);
    // Mid B12 now routes to owner NF825 — verified
    const midB12 = resolveFamilyVariant('semaglutide', {
      purchaseType: 'one_time',
      additive: 'Vitamin B12',
      doseTier: 'Mid',
    });
    expect(midB12.variant?.genProductId).toBe('NF825utCtjVqbbGsnQN3');
    expect(midB12.variant?.genPairingVerified).toBe(true);
    expect(midB12.variant?.routingStatus).toBe('ROUTING_READY');
    // Multiple Glycine Mid options acceptable — verified
    const midGly = resolveFamilyVariant('semaglutide', {
      purchaseType: 'one_time',
      additive: 'Glycine',
      doseTier: 'Mid',
    });
    expect(midGly.variant?.genPairingVerified).toBe(true);
    // SEM Any Dose B12 + NAD nasal r84 verified; Wolverine injection not (capsule still attached)
    const anyB12 = resolveFamilyVariant('semaglutide', {
      purchaseType: 'one_time',
      additive: 'Vitamin B12',
      doseTier: 'Any Dose',
    });
    expect(anyB12.variant?.genPairingVerified).toBe(true);
    const nadR84 = WEBSITE_PRODUCT_FAMILIES.flatMap((f) => f.variants).find(
      (v) => v.websiteVariantId === 'nad-nasal-r84',
    );
    expect(nadR84?.genPairingVerified).toBe(true);
    const wolInj = WEBSITE_PRODUCT_FAMILIES.flatMap((f) => f.variants).find(
      (v) => v.websiteVariantId === 'wolverine-injection',
    );
    expect(wolInj?.genPairingVerified).toBe(false);
    // TIR single backend mapped but not verified until 3-PACK removed
    const tirAny = resolveFamilyVariant('tirzepatide', {
      purchaseType: 'one_time',
      additive: 'Vitamin B12',
      doseTier: 'Any Dose',
    });
    expect(tirAny.variant?.genProductId).toBe('SvFDJ7W4nmWL2bkLUMMS');
    expect(tirAny.variant?.genPairingVerified).toBe(true);
    const { result } = applyOwnerVerifiedPairingsToFamilies(WEBSITE_PRODUCT_FAMILIES);
    expect(result.variantsFlippedToTrue).toBe(0);
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
