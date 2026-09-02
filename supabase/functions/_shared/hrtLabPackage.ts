/**
 * Legacy hormone-therapy lab package helpers.
 *
 * Fixed lab-package auto-add is retired for the storefront. Checkout should
 * prompt customers to choose from current lab options instead of silently
 * adding the old provider-care lab kit/review bundle.
 */

import type { ApprovedTherapyHistoryRow } from './determineProviderRequirement.ts';
import {
  THERAPY_FAMILY_BY_PRODUCT_ID,
  THERAPY_FAMILY_BY_SLUG,
} from './therapyFamilies.ts';

export const LAB_KIT = {
  productId: 'pc4',
  variantId: 'lab-kit-v1',
  sku: 'MBM-PC-LAB-KIT-001',
  name: 'Lab Kit',
  priceCents: 20000,
  section: 'provider-care',
  /** Shipping cost included in price — not a medication. */
  shippingIncluded: true as const,
} as const;

export const LAB_REVIEW = {
  productId: 'pc3',
  variantId: 'laboratory-review-v1',
  sku: 'MBM-PC-LAB-SRV-001',
  name: 'Laboratory Review',
  priceCents: 6000,
  section: 'provider-care',
} as const;

export const HRT_LAB_PACKAGE_TOTAL_CENTS = LAB_KIT.priceCents + LAB_REVIEW.priceCents; // 26000

export const HRT_THERAPY_FAMILIES = [
  'estradiol-patch',
  'progesterone-capsules',
  'testosterone-cream',
] as const;

export type HrtTherapyFamily = (typeof HRT_THERAPY_FAMILIES)[number];

export const HRT_PRODUCT_IDS: ReadonlySet<string> = new Set(['p16', 'p23', 'p27']);
export const HRT_SLUGS: ReadonlySet<string> = new Set([
  'estradiol-patch',
  'progesterone-capsules',
  'testosterone-cream',
]);

export const LAB_PACKAGE_SKUS: ReadonlySet<string> = new Set([LAB_KIT.sku, LAB_REVIEW.sku]);
export const LAB_PACKAGE_PRODUCT_IDS: ReadonlySet<string> = new Set([
  LAB_KIT.productId,
  LAB_REVIEW.productId,
]);

export const HRT_LAB_REQUIRED_COPY = 'Hormone therapy labs may be required before purchase completion';
export const HRT_LAB_PACKAGE_HEADING = 'Hormone Therapy Lab Options';
export const LAB_KIT_SHIPPING_INCLUDED_COPY = 'No separate storefront shipping charge for labs.';
/** Preferred checkout line under Lab Kit. */
export const LAB_KIT_INCLUDES_SHIPPING_COPY = 'Includes kit shipping';

/** Legacy storefront / bookmark product ids that still resolve to HRT. */
const HRT_LEGACY_PRODUCT_IDS = new Set([
  'estrogen-transdermal-patch-16',
  'progesterone-capsules-23',
  'testosterone-cream-27',
]);

export function isHrtProductLine(input: {
  productId?: string | null;
  slug?: string | null;
  sku?: string | null;
  section?: string | null;
  category?: string | null;
}): boolean {
  const productId = String(input.productId || '').trim();
  const slug = String(input.slug || '').trim().toLowerCase();
  const sku = String(input.sku || '').trim().toUpperCase();
  const section = String(input.section || input.category || '')
    .trim()
    .toLowerCase();

  if (HRT_PRODUCT_IDS.has(productId) || HRT_LEGACY_PRODUCT_IDS.has(productId)) {
    return true;
  }
  if (HRT_SLUGS.has(slug)) return true;
  if (sku.startsWith('MBM-HRT-')) return true;
  // Authoritative catalog category for Women's Hormone Therapy.
  if (section === 'womens-hormone-therapy') return true;

  const family =
    THERAPY_FAMILY_BY_PRODUCT_ID[productId] ||
    (slug ? THERAPY_FAMILY_BY_SLUG[slug] : undefined);
  if (family && (HRT_THERAPY_FAMILIES as readonly string[]).includes(family)) {
    return true;
  }
  return false;
}

export function isLabPackageLine(input: {
  productId?: string | null;
  sku?: string | null;
}): boolean {
  const productId = String(input.productId || '').trim();
  const sku = String(input.sku || '').trim().toUpperCase();
  return LAB_PACKAGE_PRODUCT_IDS.has(productId) || LAB_PACKAGE_SKUS.has(sku);
}

export function isLabKitLine(input: {
  productId?: string | null;
  sku?: string | null;
}): boolean {
  const productId = String(input.productId || '').trim();
  const sku = String(input.sku || '').trim().toUpperCase();
  return productId === LAB_KIT.productId || sku === LAB_KIT.sku;
}

/** Lab Kit does not trigger / contribute to physical shipping charges. */
export function isShippingChargeExemptLine(input: {
  productId?: string | null;
  sku?: string | null;
  section?: string | null;
}): boolean {
  if (isLabKitLine(input)) return true;
  const section = String(input.section || '').trim().toLowerCase();
  const productId = String(input.productId || '').trim();
  // Other provider-care services are non-shippable for charge purposes.
  if (section === 'provider-care' || /^pc\d+$/i.test(productId)) return true;
  return false;
}

export function cartContainsHrtProduct(
  items: Array<{
    productId?: string | null;
    slug?: string | null;
    sku?: string | null;
    section?: string | null;
    category?: string | null;
  }>,
): boolean {
  return items.some(isHrtProductLine);
}

export function hasApprovedHrtHistory(
  history: ApprovedTherapyHistoryRow[] | null | undefined,
): boolean {
  if (!history?.length) return false;
  const hrt = new Set<string>(HRT_THERAPY_FAMILIES);
  return history.some(
    (row) =>
      String(row.approval_status).toUpperCase() === 'APPROVED' &&
      typeof row.therapy_family === 'string' &&
      hrt.has(row.therapy_family),
  );
}

/**
 * Whether the initial HRT lab package must be auto-added (once).
 * Uses approved HRT therapy history as the only available signal —
 * there is no separate lab-completion / lab-validity table.
 */
export function shouldAutoAddHrtLabPackage(input: {
  items: Array<{
    productId?: string | null;
    slug?: string | null;
    sku?: string | null;
    section?: string | null;
    category?: string | null;
  }>;
  approvedTherapyHistory: ApprovedTherapyHistoryRow[];
}): boolean {
  if (!cartContainsHrtProduct(input.items)) return false;
  if (hasApprovedHrtHistory(input.approvedTherapyHistory)) return false;
  return true;
}

export function cartAlreadyHasLabPackage(
  items: Array<{ productId?: string | null; sku?: string | null }>,
): { hasKit: boolean; hasReview: boolean; complete: boolean } {
  const hasKit = items.some(isLabKitLine);
  const hasReview = items.some(
    (i) =>
      String(i.productId || '') === LAB_REVIEW.productId ||
      String(i.sku || '').toUpperCase() === LAB_REVIEW.sku,
  );
  return { hasKit, hasReview, complete: hasKit && hasReview };
}

export type HrtLabPackageLine = {
  productId: string;
  productName: string;
  quantity: number;
  unitAmountCents: number;
  variantId: string;
  variantLabel: string;
  sku: string;
  section: string;
  requiredHrtLabPackage: true;
  shippingIncluded?: true;
};

export function buildHrtLabPackageLines(input: {
  items: Array<{ productId?: string | null; sku?: string | null }>;
}): HrtLabPackageLine[] {
  const existing = cartAlreadyHasLabPackage(input.items);
  const lines: HrtLabPackageLine[] = [];
  if (!existing.hasKit) {
    lines.push({
      productId: LAB_KIT.productId,
      productName: LAB_KIT.name,
      quantity: 1,
      unitAmountCents: LAB_KIT.priceCents,
      variantId: LAB_KIT.variantId,
      variantLabel: '1 kit',
      sku: LAB_KIT.sku,
      section: LAB_KIT.section,
      requiredHrtLabPackage: true,
      shippingIncluded: true,
    });
  }
  if (!existing.hasReview) {
    lines.push({
      productId: LAB_REVIEW.productId,
      productName: LAB_REVIEW.name,
      quantity: 1,
      unitAmountCents: LAB_REVIEW.priceCents,
      variantId: LAB_REVIEW.variantId,
      variantLabel: '1 session',
      sku: LAB_REVIEW.sku,
      section: LAB_REVIEW.section,
      requiredHrtLabPackage: true,
    });
  }
  return lines;
}

export const RETURNING_HRT_LAB_STATUS_SOURCE =
  'customer_therapy_history (APPROVED rows for estradiol-patch / progesterone-capsules / testosterone-cream). No dedicated lab-completion or lab-validity table exists.';

export const REPEAT_ORDER_LAB_BEHAVIOR =
  'Fixed hormone lab-package auto-add is retired. When labs are required, checkout prompts the customer to choose from current lab options.';
