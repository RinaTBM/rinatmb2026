/**
 * Safe apply helper for owner-/policy-confirmed GEN pairing verification.
 *
 * After a GEN CP is classified PAIRING_ACCEPTABLE or
 * PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS under the amended policy:
 * 1. Add its genClientProductId to pairingVerificationRegistry.ts
 * 2. Run applyOwnerVerifiedPairingsToFamilies() to set genPairingVerified=true
 *    (and routingStatus ROUTING_READY when previously GEN_PAIRING_PENDING)
 *    only on matching variants — no unrelated field edits.
 *
 * Does not write to GEN. Cutover / real GEN orders stay OFF until separately enabled.
 */

import { isOwnerVerifiedGenClientProductId } from './pairingVerificationRegistry';
import type { WebsiteProductFamily, WebsiteProductVariant } from './types';

export interface ApplyPairingVerificationResult {
  familiesTouched: number;
  variantsFlippedToTrue: number;
  variantIdsFlipped: string[];
  routingStatusPromotedToReady: string[];
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
 * Promotes GEN_PAIRING_PENDING → ROUTING_READY for those variants only.
 * Does not invent GEN ids. Does not touch FORMULARY_PENDING / FUTURE_HIDDEN / BLOCKED.
 */
export function applyOwnerVerifiedPairingsToFamilies(
  families: WebsiteProductFamily[],
): { families: WebsiteProductFamily[]; result: ApplyPairingVerificationResult } {
  const variantIdsFlipped: string[] = [];
  const routingStatusPromotedToReady: string[] = [];
  let familiesTouched = 0;

  const next = families.map((family) => {
    let familyChanged = false;
    const variants = family.variants.map((v) => {
      const shouldVerify = isOwnerVerifiedGenClientProductId(v.genClientProductId);
      if (!shouldVerify) {
        return { ...v };
      }
      let nextVariant = { ...v };
      if (!v.genPairingVerified) {
        familyChanged = true;
        variantIdsFlipped.push(v.websiteVariantId);
        nextVariant = { ...nextVariant, genPairingVerified: true };
      }
      if (v.routingStatus === 'GEN_PAIRING_PENDING') {
        familyChanged = true;
        if (!routingStatusPromotedToReady.includes(v.websiteVariantId)) {
          routingStatusPromotedToReady.push(v.websiteVariantId);
        }
        nextVariant = { ...nextVariant, routingStatus: 'ROUTING_READY' };
      }
      return nextVariant;
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
      routingStatusPromotedToReady,
      anyVerified: variantIdsFlipped.length > 0 || routingStatusPromotedToReady.length > 0,
    },
  };
}
