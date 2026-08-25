/**
 * Owner-confirmed GEN formulary pairing verification registry.
 *
 * SOURCE OF TRUTH (after owner confirmation):
 *   - Checklist: docs/MBM_GEN_PAIRING_VERIFICATION_CHECKLIST.md
 *   - This registry: add verified GEN clientProductId strings here
 *   - Then apply via applyPairingVerification.ts → families.generated.ts / .json
 *
 * Rules:
 * - Do NOT infer verification from GEN product name, price, title, or id existence.
 * - Verification means owner (or live GEN formulary read) confirmed the exact
 *   intended medication/formulation is attached to that client product.
 * - MBM-WEBSITE-GEN-QA-1: intentionally empty — all genPairingVerified stay false.
 */

/** GEN clientProductIds the owner has explicitly confirmed. Empty in this phase. */
export const OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS: ReadonlySet<string> = new Set([
  // Example (do not uncomment until owner confirms):
  // 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y',
]);

export function isOwnerVerifiedGenClientProductId(
  genClientProductId: string | null | undefined,
): boolean {
  if (!genClientProductId?.trim()) return false;
  return OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.has(genClientProductId.trim());
}

export const PAIRING_VERIFICATION_REGISTRY_META = {
  phase: 'MBM-WEBSITE-GEN-QA-1',
  verifiedCount: OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.size,
  checklistDoc: 'docs/MBM_GEN_PAIRING_VERIFICATION_CHECKLIST.md',
  generatedDataFiles: [
    'src/data/websiteFamilies/families.generated.ts',
    'src/data/websiteFamilies/families.generated.json',
  ],
  doNotAutoVerify: true,
} as const;
