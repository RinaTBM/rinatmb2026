/**
 * Owner-confirmed GEN formulary pairing verification registry.
 *
 * Policy: docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md
 * Closeout: docs/MBM_GEN_PAIRING_FINAL_CLOSEOUT.md
 *
 * TRUE only for CPs with ≥1 compatible formulary medication and no material mismatches.
 * Multiple same-family strengths are allowed (provider chooses).
 */

import { PAIRING_POLICY_AMENDMENT_META } from './pairingPolicy';

/**
 * Live-verified GEN clientProductIds (MBM-GEN-PAIRING-FINAL-CLOSEOUT).
 * Reconfirmed from current GEN formulary read — prior 8 remain acceptable;
 * the 7 previously open items are still NOT eligible on live GEN.
 */
export const OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS: ReadonlySet<string> = new Set([
  // SEM B12 — Starting / Low
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y',
  // SEM B12 — High
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_34I2X8MpVZf3AQTff3bo',
  // SEM B12 — Any Dose (Dirx multi-strength; Greenwich removed)
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MkDIUw0NcJB7YL2pNzYW',
  // SEM Glycine — Starting / Low
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_tk2GW39OGr7JX4MCCoJP',
  // SEM Glycine — Mid (multi)
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_CjqOUbPuGPZzxephqRou',
  // SEM Glycine — High
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sssEk3FDY4LFbQYGQsLx',
  // SEM Glycine — Any Dose (multi)
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_wQK2JsFnh7oFBf3Lag4n',
  // NAD+ Nasal r84 (St Luke NAD+ multi options)
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw',
]);

export function isOwnerVerifiedGenClientProductId(
  genClientProductId: string | null | undefined,
): boolean {
  if (!genClientProductId?.trim()) return false;
  return OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.has(genClientProductId.trim());
}

export const PAIRING_VERIFICATION_REGISTRY_META = {
  phase: 'MBM-GEN-PAIRING-FINAL-CLOSEOUT',
  verifiedCount: OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.size,
  checklistDoc: 'docs/MBM_GEN_PAIRING_VERIFICATION_CHECKLIST.md',
  policyDoc: 'docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md',
  closeoutDoc: 'docs/MBM_GEN_PAIRING_FINAL_CLOSEOUT.md',
  postcheckDoc: 'docs/MBM_GEN_PAIRING_POSTCHECK_3.md',
  generatedDataFiles: [
    'src/data/websiteFamilies/families.generated.ts',
    'src/data/websiteFamilies/families.generated.json',
  ],
  requiresExactStrengthPackage: false,
  allowsMultipleCompatibleOptions: true,
  doNotAutoVerifyFromTitleAlone: true,
  policyPhase: PAIRING_POLICY_AMENDMENT_META.phase,
} as const;
