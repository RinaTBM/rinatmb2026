import { WEBSITE_PRODUCT_FAMILIES, WEBSITE_FAMILY_BUILD_META } from './families.generated';
import type {
  FamilyRouteResolution,
  FamilySelectorState,
  WebsiteProductFamily,
  WebsiteProductVariant,
  WebsiteRoutingStatus,
} from './types';

export * from './types';
export { WEBSITE_PRODUCT_FAMILIES, WEBSITE_FAMILY_BUILD_META };
export {
  OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS,
  isOwnerVerifiedGenClientProductId,
  PAIRING_VERIFICATION_REGISTRY_META,
} from './pairingVerificationRegistry';
export {
  effectiveGenPairingVerified,
  applyOwnerVerifiedPairingsToFamilies,
} from './applyPairingVerification';

/** Cutover stays OFF — legacy B6 storefront remains production-active. */
export const WEBSITE_FAMILY_CUTOVER_ENABLED = false;

/** Real GEN order submission stays OFF for this build phase. */
export const REAL_GEN_ORDER_SUBMISSION_ENABLED = false;

export function getWebsiteFamily(familyId: string): WebsiteProductFamily | undefined {
  return WEBSITE_PRODUCT_FAMILIES.find((f) => f.familyId === familyId);
}

export function getWebsiteFamilyBySlug(slug: string): WebsiteProductFamily | undefined {
  return WEBSITE_PRODUCT_FAMILIES.find((f) => f.currentWebsiteSlug === slug);
}

export function listPatientVisibleVariants(
  family: WebsiteProductFamily,
): WebsiteProductVariant[] {
  return family.variants.filter(
    (v) =>
      v.routingStatus !== 'FUTURE_HIDDEN' &&
      // Legacy B6 stays on legacy PDP until cutover — not in new family selectors
      v.websiteVariantId !== 'sem-current-b6' &&
      v.websiteVariantId !== 'tir-current-b6',
  );
}

function norm(s: string | null | undefined): string {
  return (s || '').trim().toLowerCase();
}

function additiveMatches(variantAdditive: string | null, wanted: string | undefined): boolean {
  if (!wanted) return true;
  const a = norm(variantAdditive);
  const w = norm(wanted);
  if (w.includes('b12') || w.includes('vitamin b12')) {
    return a.includes('b12');
  }
  if (w.includes('glycine')) return a.includes('glycine');
  return a === w;
}

function doseMatches(variantDose: string | null, wanted: string | undefined): boolean {
  if (!wanted) return true;
  const d = norm(variantDose);
  const w = norm(wanted);
  if (w.includes('starting') || w.includes('low')) {
    return d.includes('starting') || d.includes('low');
  }
  if (w.includes('mid')) return d.includes('mid');
  if (w.includes('high')) return d.includes('high');
  if (w.includes('any')) return d.includes('any');
  return d.includes(w);
}

/**
 * Resolve patient selectors → exact website variant (and GEN route metadata).
 * Does not enable checkout cutover.
 */
export function resolveFamilyVariant(
  familyId: string,
  selectors: FamilySelectorState,
): FamilyRouteResolution {
  const family = getWebsiteFamily(familyId);
  if (!family) {
    return { ok: false, familyId, variant: null, reason: 'UNKNOWN_FAMILY' };
  }

  const candidates = listPatientVisibleVariants(family);

  if (familyId === 'semaglutide' || familyId === 'tirzepatide') {
    if (selectors.purchaseType === 'membership') {
      const membership = candidates.find((v) => v.purchaseType === 'membership');
      if (!membership) {
        return { ok: false, familyId, variant: null, reason: 'MEMBERSHIP_VARIANT_MISSING' };
      }
      return { ok: true, familyId, variant: membership };
    }
    const oneTime = candidates.filter((v) => v.purchaseType === 'one_time');
    const match = oneTime.find(
      (v) =>
        additiveMatches(v.additive, selectors.additive) &&
        doseMatches(v.doseTier, selectors.doseTier),
    );
    if (!match) {
      return { ok: false, familyId, variant: null, reason: 'NO_MATCHING_ONE_TIME_VARIANT' };
    }
    return { ok: true, familyId, variant: match };
  }

  if (familyId === 'nad') {
    const form = selectors.form || '';
    if (norm(form).includes('nasal')) {
      const option = selectors.nasalOption || selectors.strength || '';
      if (String(option).includes('85') || norm(option).includes('200')) {
        const v = candidates.find((x) => x.websiteVariantId === 'nad-nasal-r85');
        return v
          ? { ok: true, familyId, variant: v }
          : { ok: false, familyId, variant: null, reason: 'NAD_NASAL_R85_MISSING' };
      }
      // default / r84 / 50mg
      const v = candidates.find((x) => x.websiteVariantId === 'nad-nasal-r84');
      return v
        ? { ok: true, familyId, variant: v }
        : { ok: false, familyId, variant: null, reason: 'NAD_NASAL_R84_MISSING' };
    }
    if (norm(form).includes('inject')) {
      const pkg = selectors.package || selectors.strength || '';
      if (String(pkg).includes('10') || norm(pkg).includes('1000')) {
        const v = candidates.find((x) => x.websiteVariantId === 'nad-inj-10ml-1000');
        return v
          ? { ok: true, familyId, variant: v }
          : { ok: false, familyId, variant: null, reason: 'NAD_INJ_10_MISSING' };
      }
      const v = candidates.find((x) => x.websiteVariantId === 'nad-inj-5ml-500');
      return v
        ? { ok: true, familyId, variant: v }
        : { ok: false, familyId, variant: null, reason: 'NAD_INJ_5_MISSING' };
    }
    return { ok: false, familyId, variant: null, reason: 'NAD_FORM_REQUIRED' };
  }

  if (familyId === 'wolverine-bpc-tb') {
    const form = norm(selectors.form);
    if (form.includes('cap')) {
      const v = candidates.find((x) => x.websiteVariantId === 'wolverine-capsule');
      return v
        ? { ok: true, familyId, variant: v }
        : { ok: false, familyId, variant: null, reason: 'WOLVERINE_CAPSULE_MISSING' };
    }
    if (form.includes('inject')) {
      const v = candidates.find((x) => x.websiteVariantId === 'wolverine-injection');
      return v
        ? { ok: true, familyId, variant: v }
        : { ok: false, familyId, variant: null, reason: 'WOLVERINE_INJECTION_MISSING' };
    }
    return { ok: false, familyId, variant: null, reason: 'WOLVERINE_FORM_REQUIRED' };
  }

  if (familyId === 'estradiol') {
    const strength = selectors.strength || '';
    const map: Record<string, string> = {
      '0.025': 'estradiol-patch-r26',
      '0.0375': 'estradiol-patch-r27',
      '0.05': 'estradiol-patch-r28',
      '0.1': 'estradiol-patch-r29',
    };
    const key = Object.keys(map).find((k) => strength.includes(k));
    if (!key) {
      return { ok: false, familyId, variant: null, reason: 'ESTRADIOL_STRENGTH_REQUIRED' };
    }
    const v = candidates.find((x) => x.websiteVariantId === map[key]);
    return v
      ? { ok: true, familyId, variant: v }
      : { ok: false, familyId, variant: null, reason: 'ESTRADIOL_VARIANT_MISSING' };
  }

  if (familyId === 'minoxidil') {
    const v = candidates.find((x) => x.websiteVariantId === 'minoxidil-fin-minox-0.1-5');
    return v
      ? { ok: true, familyId, variant: v }
      : { ok: false, familyId, variant: null, reason: 'MINOXIDIL_LOCKED_VARIANT_MISSING' };
  }

  // Generic: single visible non-hidden variant or exact strength match
  if (candidates.length === 1) {
    return { ok: true, familyId, variant: candidates[0] };
  }
  if (selectors.strength) {
    const v = candidates.find(
      (x) =>
        norm(x.displayLabel).includes(norm(selectors.strength)) ||
        norm(x.doseTier).includes(norm(selectors.strength)),
    );
    if (v) return { ok: true, familyId, variant: v };
  }
  return { ok: false, familyId, variant: null, reason: 'SELECTOR_UNRESOLVED' };
}

export function countByRoutingStatus(): Record<WebsiteRoutingStatus, number> {
  const counts: Record<WebsiteRoutingStatus, number> = {
    ROUTING_READY: 0,
    GEN_PAIRING_PENDING: 0,
    FORMULARY_PENDING: 0,
    FUTURE_HIDDEN: 0,
    BLOCKED: 0,
  };
  for (const f of WEBSITE_PRODUCT_FAMILIES) {
    for (const v of f.variants) {
      counts[v.routingStatus] += 1;
    }
  }
  return counts;
}

export function assertNoInventedGenIds(families: WebsiteProductFamily[] = WEBSITE_PRODUCT_FAMILIES): void {
  for (const f of families) {
    for (const v of f.variants) {
      if (v.genPairingVerified) {
        throw new Error(`genPairingVerified must default false: ${v.websiteVariantId}`);
      }
      if (v.genClientProductId && !v.genProductId && v.routingStatus === 'GEN_PAIRING_PENDING') {
        // full client id should embed product id when present
        if (!v.genClientProductId.includes('_')) {
          throw new Error(`Unexpected genClientProductId shape: ${v.websiteVariantId}`);
        }
      }
    }
  }
}
