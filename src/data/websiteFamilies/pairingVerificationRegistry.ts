/**
 * Owner-confirmed GEN formulary pairing verification registry.
 *
 * SOURCE OF TRUTH (after amended-policy verification):
 *   - Policy: docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md
 *   - Checklist: docs/MBM_GEN_PAIRING_VERIFICATION_CHECKLIST.md
 *   - This registry: GEN clientProductIds with ACCEPTABLE / ACCEPTABLE_MULTIPLE_OPTIONS
 *   - Apply via applyPairingVerification.ts → families.generated.ts / .json
 *
 * Amended standard (MBM-GEN-PAIRING-POLICY-AMENDMENT-1):
 * - Do NOT require exact strength/package equality (API often omits those fields).
 * - ACCEPT when ≥1 compatible formulary option exists and no material mismatch.
 * - Multiple same-family strengths MAY remain attached for provider choice.
 * - Still reject B12↔Glycine cross-wire, wrong form (inj/nasal), wrong pharmacy family,
 *   legacy B6, unrelated actives/blends.
 */

import { PAIRING_POLICY_AMENDMENT_META } from './pairingPolicy';

/**
 * GEN clientProductIds verified under the amended pairing policy
 * (live formulary read: compatible medication family, no material mismatches).
 */
export const OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS: ReadonlySet<string> = new Set([
  // SEM B12 — Starting / Low (Dirx Semaglutide + Vitamin B12)
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y',
  // SEM B12 — High
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_34I2X8MpVZf3AQTff3bo',
  // SEM Glycine — Starting / Low
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_tk2GW39OGr7JX4MCCoJP',
  // SEM Glycine — Mid (multiple Dirx Glycine options — keep)
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_CjqOUbPuGPZzxephqRou',
  // SEM Glycine — High
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sssEk3FDY4LFbQYGQsLx',
  // SEM Glycine — Any Dose (multiple Dirx Glycine options — keep)
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_wQK2JsFnh7oFBf3Lag4n',
  // Wolverine Injection (Greenwich BPC-157/TB500)
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_iJtyig611AZEDBGdvRd9',
]);

export function isOwnerVerifiedGenClientProductId(
  genClientProductId: string | null | undefined,
): boolean {
  if (!genClientProductId?.trim()) return false;
  return OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.has(genClientProductId.trim());
}

export const PAIRING_VERIFICATION_REGISTRY_META = {
  phase: PAIRING_POLICY_AMENDMENT_META.phase,
  verifiedCount: OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.size,
  checklistDoc: 'docs/MBM_GEN_PAIRING_VERIFICATION_CHECKLIST.md',
  policyDoc: 'docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md',
  generatedDataFiles: [
    'src/data/websiteFamilies/families.generated.ts',
    'src/data/websiteFamilies/families.generated.json',
  ],
  requiresExactStrengthPackage: false,
  allowsMultipleCompatibleOptions: true,
  doNotAutoVerifyFromTitleAlone: true,
} as const;
