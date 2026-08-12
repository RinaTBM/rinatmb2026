/**
 * Explicit therapy-family map for provider-guided prescription products.
 * Source of truth: docs/provider-automation-product-scope.md
 * Do NOT infer family from display-name strings at runtime.
 */

/** Stable therapy-family keys (product slug values for the 15 in-scope Rx products). */
export const THERAPY_FAMILIES = [
  'semaglutide',
  'tirzepatide',
  'fat-burner',
  'estradiol-patch',
  'progesterone-capsules',
  'testosterone-cream',
  'nad-plus',
  'selank',
  'semax',
  'selank-semax-nasal-spray',
  'tesamorelin',
  'bpc-157-tb-500',
  'tretinoin-cream',
  'minoxidil-topical',
  'bimatoprost-solution',
] as const;

export type TherapyFamily = (typeof THERAPY_FAMILIES)[number];

/** Product app ids → therapy family (15 provider-guided prescriptions). */
export const THERAPY_FAMILY_BY_PRODUCT_ID: Readonly<Record<string, TherapyFamily>> = {
  p1: 'semaglutide',
  p5: 'tirzepatide',
  p74: 'fat-burner',
  p16: 'estradiol-patch',
  p23: 'progesterone-capsules',
  p27: 'testosterone-cream',
  p9: 'nad-plus',
  p48: 'selank',
  p47: 'semax',
  p68: 'selank-semax-nasal-spray',
  p73: 'tesamorelin',
  p41: 'bpc-157-tb-500',
  p69: 'tretinoin-cream',
  p70: 'minoxidil-topical',
  p71: 'bimatoprost-solution',
};

/** Product slugs → therapy family. */
export const THERAPY_FAMILY_BY_SLUG: Readonly<Record<string, TherapyFamily>> = {
  semaglutide: 'semaglutide',
  tirzepatide: 'tirzepatide',
  'fat-burner': 'fat-burner',
  'estradiol-patch': 'estradiol-patch',
  'progesterone-capsules': 'progesterone-capsules',
  'testosterone-cream': 'testosterone-cream',
  'nad-plus': 'nad-plus',
  selank: 'selank',
  semax: 'semax',
  'selank-semax-nasal-spray': 'selank-semax-nasal-spray',
  tesamorelin: 'tesamorelin',
  'bpc-157-tb-500': 'bpc-157-tb-500',
  'tretinoin-cream': 'tretinoin-cream',
  'minoxidil-topical': 'minoxidil-topical',
  'bimatoprost-solution': 'bimatoprost-solution',
};

/**
 * Membership program ids/slugs resolve to medication therapy families.
 * Provider decisions must compare the requested fulfillment vial SKU, not the program SKU.
 */
export const MEMBERSHIP_THERAPY_FAMILY_BY_PRODUCT_ID: Readonly<Record<string, TherapyFamily>> = {
  m1: 'semaglutide',
  m2: 'tirzepatide',
  'semaglutide-membership': 'semaglutide',
  'tirzepatide-membership': 'tirzepatide',
};

export const MEMBERSHIP_THERAPY_FAMILY_BY_SLUG: Readonly<Record<string, TherapyFamily>> = {
  'semaglutide-membership': 'semaglutide',
  'tirzepatide-membership': 'tirzepatide',
};

export function resolveTherapyFamily(input: {
  productId?: string | null;
  slug?: string | null;
  isMembership?: boolean;
}): TherapyFamily | null {
  const productId = input.productId?.trim() || '';
  const slug = input.slug?.trim() || '';

  if (input.isMembership || productId === 'm1' || productId === 'm2' || slug.includes('membership')) {
    return (
      MEMBERSHIP_THERAPY_FAMILY_BY_PRODUCT_ID[productId] ??
      MEMBERSHIP_THERAPY_FAMILY_BY_SLUG[slug] ??
      null
    );
  }

  return (
    THERAPY_FAMILY_BY_PRODUCT_ID[productId] ??
    THERAPY_FAMILY_BY_SLUG[slug] ??
    null
  );
}

/** True when the line is one of the 15 provider-guided Rx products or a mapped membership. */
export function isProviderGuidedPrescriptionLine(input: {
  productId?: string | null;
  slug?: string | null;
  section?: string | null;
  isMembership?: boolean;
  purchaseType?: string | null;
}): boolean {
  const section = input.section ?? '';
  if (section === 'accessories' || section === 'provider-care') return false;
  const isMembership =
    Boolean(input.isMembership) ||
    input.purchaseType === 'membership_program' ||
    input.productId === 'm1' ||
    input.productId === 'm2';
  return resolveTherapyFamily({
    productId: input.productId,
    slug: input.slug,
    isMembership,
  }) != null;
}

export const THERAPY_FAMILY_COUNT = THERAPY_FAMILIES.length;
