/**
 * MBM-FINAL-WEBSITE-LAUNCH-1 — CURRENT/CUTOVER variant launch classification.
 * Does not re-audit the GEN catalog. Uses owner working set + amended pairing.
 */

import { FAMILY_VARIANT_SKU_BY_ID } from './familyVariantSkus';
import { WEBSITE_PRODUCT_FAMILIES } from './appliedFamilies';
import { effectiveGenPairingVerified } from './applyPairingVerification';
import type { WebsiteProductFamily, WebsiteProductVariant } from './types';

export type LaunchClass = 'LAUNCH_READY' | 'HOLD_FROM_LAUNCH';

export interface LaunchVariantRow {
  familyId: string;
  familyDisplayName: string;
  websiteVariantId: string;
  displayLabel: string | null;
  purchaseType: string;
  form: string | null;
  classification: LaunchClass;
  holdReason: string | null;
  routingStatus: string;
  genProductId: string | null;
  genClientProductId: string | null;
  lockedPrice: number | null;
  sku: string | null;
}

const LEGACY_B6_IDS = new Set(['sem-current-b6', 'tir-current-b6']);

export function lockedRetailPrice(variant: WebsiteProductVariant): number | null {
  if (typeof variant.finalRetailPrice === 'number' && Number.isFinite(variant.finalRetailPrice)) {
    return variant.finalRetailPrice;
  }
  if (typeof variant.startingPrice === 'number' && Number.isFinite(variant.startingPrice)) {
    return variant.startingPrice;
  }
  return null;
}

export function isCurrentCutoverVariant(variant: WebsiteProductVariant): boolean {
  if (LEGACY_B6_IDS.has(variant.websiteVariantId)) return false;
  if (variant.routingStatus === 'FUTURE_HIDDEN') return false;
  if (variant.launchState === 'FUTURE_HIDDEN') return false;
  return true;
}

export function classifyVariant(variant: WebsiteProductVariant): {
  classification: LaunchClass;
  holdReason: string | null;
} {
  if (LEGACY_B6_IDS.has(variant.websiteVariantId)) {
    return { classification: 'HOLD_FROM_LAUNCH', holdReason: 'Legacy B6 excluded from new architecture' };
  }
  if (variant.routingStatus === 'FUTURE_HIDDEN' || variant.launchState === 'FUTURE_HIDDEN') {
    return { classification: 'HOLD_FROM_LAUNCH', holdReason: 'FUTURE_HIDDEN' };
  }
  if (variant.routingStatus === 'FORMULARY_PENDING') {
    return { classification: 'HOLD_FROM_LAUNCH', holdReason: 'no compatible formulary exists' };
  }
  if (variant.routingStatus === 'BLOCKED') {
    return { classification: 'HOLD_FROM_LAUNCH', holdReason: 'routing cannot safely be completed' };
  }
  const genId = variant.genClientProductId?.trim() || variant.genProductId?.trim() || '';
  if (!genId) {
    return { classification: 'HOLD_FROM_LAUNCH', holdReason: 'no usable GEN backend exists' };
  }
  if (!effectiveGenPairingVerified(variant)) {
    return {
      classification: 'HOLD_FROM_LAUNCH',
      holdReason: 'compatible formulary not attached / pairing unverified',
    };
  }
  if (lockedRetailPrice(variant) == null) {
    return { classification: 'HOLD_FROM_LAUNCH', holdReason: 'website price is not locked' };
  }
  if (variant.routingStatus !== 'ROUTING_READY') {
    return { classification: 'HOLD_FROM_LAUNCH', holdReason: 'website routing target not ready' };
  }
  return { classification: 'LAUNCH_READY', holdReason: null };
}

export function isLaunchReadyVariant(variant: WebsiteProductVariant): boolean {
  return classifyVariant(variant).classification === 'LAUNCH_READY';
}

export function listLaunchReadyVariants(family: WebsiteProductFamily): WebsiteProductVariant[] {
  return family.variants.filter(isLaunchReadyVariant);
}

export function familyHasLaunchReadyVariant(family: WebsiteProductFamily): boolean {
  return family.variants.some(isLaunchReadyVariant);
}

export function classifyCurrentCutoverVariants(): LaunchVariantRow[] {
  const rows: LaunchVariantRow[] = [];
  for (const family of WEBSITE_PRODUCT_FAMILIES) {
    for (const variant of family.variants) {
      if (!isCurrentCutoverVariant(variant)) continue;
      const { classification, holdReason } = classifyVariant(variant);
      rows.push({
        familyId: family.familyId,
        familyDisplayName: family.displayName,
        websiteVariantId: variant.websiteVariantId,
        displayLabel: variant.displayLabel,
        purchaseType: variant.purchaseType,
        form: variant.form,
        classification,
        holdReason,
        routingStatus: variant.routingStatus,
        genProductId: variant.genProductId,
        genClientProductId: variant.genClientProductId,
        lockedPrice: lockedRetailPrice(variant),
        sku: FAMILY_VARIANT_SKU_BY_ID[variant.websiteVariantId] ?? null,
      });
    }
  }
  return rows;
}

export function formularyPendingVariantIds(): string[] {
  const ids: string[] = [];
  for (const family of WEBSITE_PRODUCT_FAMILIES) {
    for (const variant of family.variants) {
      if (!isCurrentCutoverVariant(variant)) continue;
      if (variant.routingStatus === 'FORMULARY_PENDING') ids.push(variant.websiteVariantId);
    }
  }
  return ids;
}
