/**
 * Safe apply helper for owner-confirmed GEN pairing verification.
 *
 * After the owner confirms exact formulary pairing for a GEN client product:
 * 1. Check the box in docs/MBM_GEN_PAIRING_VERIFICATION_CHECKLIST.md
 * 2. Add the genClientProductId to pairingVerificationRegistry.ts
 * 3. Call applyOwnerVerifiedPairingsToFamilies() when regenerating/persisting data
 *    so ONLY matching variants flip genPairingVerified → true
 *
 * This phase does not set any true values (registry is empty).
 */

import { isOwnerVerifiedGenClientProductId } from './pairingVerificationRegistry';
import type { WebsiteProductFamily, WebsiteProductVariant } from './types';

export interface ApplyPairingVerificationResult {
  familiesTouched: number;
  variantsFlippedToTrue: number;
  variantIdsFlipped: string[];
  /** Always false in MBM-WEBSITE-GEN-QA-1 (empty registry). */
  anyVerified: boolean;
}

/**
 * Effective pairing flag for gate / runtime checks.
 * Prefer registry over stale generated data so a confirmed CP is recognized
 * without hand-editing unrelated product fields.
 */
export function effectiveGenPairingVerified(
  variant: Pick<WebsiteProductVariant, 'genClientProductId' | 'genPairingVerified'>,
): boolean {
  if (isOwnerVerifiedGenClientProductId(variant.genClientProductId)) {
    return true;
  }
  return Boolean(variant.genPairingVerified);
}

/**
 * Returns a deep-copied family list with genPairingVerified set true only for
 * variants whose genClientProductId is in the owner registry.
 * Does not mutate unrelated fields. Does not invent GEN ids.
 */
export function applyOwnerVerifiedPairingsToFamilies(
  families: WebsiteProductFamily[],
): { families: WebsiteProductFamily[]; result: ApplyPairingVerificationResult } {
  const variantIdsFlipped: string[] = [];
  let familiesTouched = 0;

  const next = families.map((family) => {
    let familyChanged = false;
    const variants = family.variants.map((v) => {
      const shouldVerify = isOwnerVerifiedGenClientProductId(v.genClientProductId);
      if (shouldVerify && !v.genPairingVerified) {
        familyChanged = true;
        variantIdsFlipped.push(v.websiteVariantId);
        return { ...v, genPairingVerified: true };
      }
      // Never clear an existing true here — registry is additive for apply.
      // (This phase has no trues.)
      return { ...v };
    });
    if (familyChanged) familiesTouched += 1;
    return { ...family, variants };
  });

  return {
    families: next,
    result: {
      familiesTouched,
      variantsFlippedToTrue: variantIdsFlipped.length,
      variantIdsFlipped,
      anyVerified: variantIdsFlipped.length > 0,
    },
  };
}
