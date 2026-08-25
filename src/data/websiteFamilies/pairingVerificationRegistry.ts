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
 * - Remains empty until a live GEN read proves EXACT formulary match
 *   (medication + pharmacy + strength + form + package) per the click guide.
 * - MBM-GEN-PAIRING-POSTCHECK-1: 0 of 15 CPs reached PAIRING_VERIFIED — keep empty.
 */

/** GEN clientProductIds proven exact in live GEN. Empty until postcheck verifies. */
export const OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS: ReadonlySet<string> = new Set([
  // Do not add IDs from docs alone. Add only after PAIRING_VERIFIED in
  // docs/MBM_GEN_PAIRING_POSTCHECK_*.json (or a later postcheck).
]);

export function isOwnerVerifiedGenClientProductId(
  genClientProductId: string | null | undefined,
): boolean {
  if (!genClientProductId?.trim()) return false;
  return OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.has(genClientProductId.trim());
}

export const PAIRING_VERIFICATION_REGISTRY_META = {
  phase: 'MBM-GEN-PAIRING-POSTCHECK-1',
  verifiedCount: OWNER_VERIFIED_GEN_CLIENT_PRODUCT_IDS.size,
  checklistDoc: 'docs/MBM_GEN_PAIRING_VERIFICATION_CHECKLIST.md',
  generatedDataFiles: [
    'src/data/websiteFamilies/families.generated.ts',
    'src/data/websiteFamilies/families.generated.json',
  ],
  doNotAutoVerify: true,
} as const;
