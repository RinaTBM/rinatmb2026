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
 * Live-verified GEN clientProductIds after MBM-FINAL-WEBSITE-LAUNCH-1.
 *
 * TIR SvFDJ7 is included under the amended pairing policy + owner-approved
 * single-backend collapse: compatible Tirzepatide + B12 and Tirzepatide + Glycine
 * medications are attached. Exact package equality is not required; the provider
 * chooses among compatible options. Remaining 3-PACK cleanup is GEN admin, not a
 * website-family launch hold.
 */
export const OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS: ReadonlySet<string> = new Set([
  // SEM B12 — Starting / Low
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y',
  // SEM B12 — Mid (owner NF825; repaired display/price)
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_NF825utCtjVqbbGsnQN3',
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
  // NAD+ Injectable — MBM live generic injection wrapper
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SHJpGAACUFEeMONdpEbn',
  // Estradiol Patch — MBM live generic patch wrapper
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_o7dNtf9QsnEqPCrLr2tR',
  // TIR Any Dose B12/Glycine — owner-approved single backend
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  // Recovery Stack / KLOW — exact BPC-157 + GHK-Cu + KPV + TB-500 pairing
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MXsSZY2GpiCByJUQer1p',
  // Owner-supplied live MBM wrappers verified in GEN checkout.
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5dGkjdpLP7DkKKE2iVxh',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_AVNvVWBE98DfINxyz5Dm',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_EeWMcfCJf5EU2LkNQmp9',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_LWkYtwm66dIeLuDSvSfi',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_2cYxVfvwpWyyrANZx06G',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_iJtyig611AZEDBGdvRd9',
  // Scream Cream — owner-updated MBM Women's Hormone Therapy wrapper.
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_llc4XwX8XjHashrkv74r',
  // Owner-confirmed live wrappers; clinical details remain in GEN.
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_Raw7mUkuzzhVdAo88jpL',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_7Kix55LA15U0lNvY9QXI',
  // GLP-1 live website programs — owner-supplied GEN checkout wrappers.
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_7UMqZumyeXaWMX9zOPP3',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_uM0cXePP8e9c5hiMKcRt',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_1sgLVERqG9oWU9WKht9b',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_mhUSqSGlaFVCghW3V3DD',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_43kVbBgNLBocKyVUhQmG',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_YkHkffkLKFz3FjC7Wvno',
  // Wolverine injection and capsule wrappers are separate GEN choices.
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_omhh3NabouO8AsNR5tkD',
]);

export function isOwnerVerifiedGenClientProductId(
  genClientProductId: string | null | undefined,
): boolean {
  if (!genClientProductId?.trim()) return false;
  return OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.has(genClientProductId.trim());
}

export const PAIRING_VERIFICATION_REGISTRY_META = {
  phase: 'MBM-FINAL-WEBSITE-LAUNCH-1',
  verifiedCount: OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.size,
  checklistDoc: 'docs/MBM_GEN_PAIRING_VERIFICATION_CHECKLIST.md',
  policyDoc: 'docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md',
  closeoutDoc: 'docs/MBM_GEN_BACKEND_COMPLETION_1.md',
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
