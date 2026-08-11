/**
 * Membership PROGRAM SKU vs FULFILLMENT SKU crosswalk.
 *
 * Program SKU = membership/program purchase (billing).
 * Fulfillment SKU = retail weight-management medication vial used for pharmacy fulfillment.
 * Do NOT invent separate membership-medication SKUs.
 */

import {
  MEMBERSHIP_PROGRAM_SKU_BY_APP_ID,
  VARIANT_SKU_BY_ID,
} from '../../data/variantSkus';

export interface MembershipFulfillmentMapping {
  membershipAppId: 'm1' | 'm2';
  membershipSlug: string;
  programName: string;
  programSku: string;
  requestedDose: string;
  fulfillmentSku: string;
  fulfillmentVariantId: string;
  fulfillmentProductId: string;
}

const SEMA_DOSE_TO_VARIANT: Readonly<Record<string, string>> = {
  '0.5mg': 'semaglutide-v1',
  '1mg': 'semaglutide-v2',
  '2.5mg': 'semaglutide-v3',
  '5mg': 'semaglutide-v4',
};

const TIRZ_DOSE_TO_VARIANT: Readonly<Record<string, string>> = {
  '2.5mg': 'tirzepatide-v1',
  '7.5mg': 'tirzepatide-v2',
  '12.5mg': 'tirzepatide-v3',
  '15mg': 'tirzepatide-v4',
};

function normalizeDose(dose: string): string {
  return dose.trim().toLowerCase().replace(/\s+/g, '');
}

function findDoseKey(map: Readonly<Record<string, string>>, dose: string): string | null {
  const want = normalizeDose(dose);
  for (const key of Object.keys(map)) {
    if (normalizeDose(key) === want) return key;
  }
  return null;
}

export function getMembershipProgramSku(membershipAppId: string): string | null {
  return MEMBERSHIP_PROGRAM_SKU_BY_APP_ID[membershipAppId] ?? null;
}

/**
 * Resolve fulfillment SKU for a membership requested dose.
 * Returns null if membership or dose is unknown.
 */
export function resolveMembershipFulfillmentSku(
  membershipAppId: string,
  requestedDose: string | undefined | null,
): { programSku: string; fulfillmentSku: string; fulfillmentVariantId: string } | null {
  if (!requestedDose) return null;
  const programSku = getMembershipProgramSku(membershipAppId);
  if (!programSku) return null;

  const doseMap = membershipAppId === 'm1' ? SEMA_DOSE_TO_VARIANT
    : membershipAppId === 'm2' ? TIRZ_DOSE_TO_VARIANT
    : null;
  if (!doseMap) return null;

  const doseKey = findDoseKey(doseMap, requestedDose);
  if (!doseKey) return null;
  const fulfillmentVariantId = doseMap[doseKey];
  const fulfillmentSku = VARIANT_SKU_BY_ID[fulfillmentVariantId];
  if (!fulfillmentSku) return null;

  return { programSku, fulfillmentSku, fulfillmentVariantId };
}

/** Full approved crosswalk rows for docs / Scriptful. */
export const MEMBERSHIP_FULFILLMENT_CROSSWALK: readonly MembershipFulfillmentMapping[] = [
  ...Object.entries(SEMA_DOSE_TO_VARIANT).map(([requestedDose, fulfillmentVariantId]) => ({
    membershipAppId: 'm1' as const,
    membershipSlug: 'semaglutide-membership',
    programName: 'Semaglutide Membership',
    programSku: MEMBERSHIP_PROGRAM_SKU_BY_APP_ID.m1,
    requestedDose,
    fulfillmentSku: VARIANT_SKU_BY_ID[fulfillmentVariantId],
    fulfillmentVariantId,
    fulfillmentProductId: 'p1',
  })),
  ...Object.entries(TIRZ_DOSE_TO_VARIANT).map(([requestedDose, fulfillmentVariantId]) => ({
    membershipAppId: 'm2' as const,
    membershipSlug: 'tirzepatide-membership',
    programName: 'Tirzepatide Membership',
    programSku: MEMBERSHIP_PROGRAM_SKU_BY_APP_ID.m2,
    requestedDose,
    fulfillmentSku: VARIANT_SKU_BY_ID[fulfillmentVariantId],
    fulfillmentVariantId,
    fulfillmentProductId: 'p5',
  })),
];
