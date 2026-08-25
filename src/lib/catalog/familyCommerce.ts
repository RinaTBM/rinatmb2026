/**
 * Website-family SKU → GEN clientProductId (server-safe).
 * Never invent IDs. Real GEN order submission stays fail-closed.
 */

import { WEBSITE_PRODUCT_FAMILIES } from '../../data/websiteFamilies/families.generated';
import { FAMILY_VARIANT_SKU_BY_ID } from '../../data/websiteFamilies/familyVariantSkus';
import { effectiveGenPairingVerified } from '../../data/websiteFamilies/applyPairingVerification';
import { classifyVariant } from '../../data/websiteFamilies/launchClassification';

export function resolveFamilyVariantBySku(sku: string | null | undefined) {
  const want = (sku || '').trim().toUpperCase();
  if (!want) return null;
  const websiteVariantId =
    Object.entries(FAMILY_VARIANT_SKU_BY_ID).find(([, mapped]) => mapped === want)?.[0] ?? null;
  if (!websiteVariantId) return null;
  for (const family of WEBSITE_PRODUCT_FAMILIES) {
    const variant = family.variants.find((v) => v.websiteVariantId === websiteVariantId);
    if (variant) return { family, variant };
  }
  return null;
}

export function resolveGenClientProductIdForSku(sku: string | null | undefined): string | null {
  const row = resolveFamilyVariantBySku(sku);
  if (!row) return null;
  const { classification } = classifyVariant(row.variant);
  if (classification !== 'LAUNCH_READY') return null;
  if (!effectiveGenPairingVerified(row.variant)) return null;
  return row.variant.genClientProductId?.trim() || null;
}
