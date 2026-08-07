/**
 * Accessory purchase helpers — count families, cart labels, and quantity bounds.
 * Does not invent prices. Only exposes counts that already have approved catalog pricing.
 */
import { getProduct, type Product } from '../../data/products';

export const ACCESSORY_UNIT_QUANTITY_MIN = 1;
export const ACCESSORY_UNIT_QUANTITY_MAX = 10;

export interface AccessoryCountOption {
  count: number;
  /** Customer-facing label, e.g. "200 Count" or "50". */
  label: string;
  slug: string;
  price: number;
  productId: string;
}

export interface AccessoryCountFamily {
  id: string;
  /** Shared storefront title when viewing any member of the family. */
  displayName: string;
  variantLabel: 'Count';
  /** Counts requested in the product brief (may include unpriced counts). */
  requestedCounts: number[];
  /** Counts with no approved catalog price — not offered for checkout. */
  missingCounts: number[];
  /** How to format a count option label. */
  formatLabel: (count: number) => string;
  memberSlugs: string[];
}

const WIPE_FAMILY: AccessoryCountFamily = {
  id: 'alcohol-wipes',
  displayName: 'Alcohol Prep Wipes',
  variantLabel: 'Count',
  requestedCounts: [200, 500],
  missingCounts: [500],
  formatLabel: count => `${count} Count`,
  memberSlugs: ['alcohol-prep-wipes-100', 'alcohol-prep-wipes-200'],
};

const SYRINGE_FAMILY: AccessoryCountFamily = {
  id: 'insulin-syringes',
  displayName: 'Premium Insulin Syringes',
  variantLabel: 'Count',
  requestedCounts: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  missingCounts: [20, 30, 40, 60, 70, 80, 90],
  formatLabel: count => String(count),
  memberSlugs: [
    'premium-insulin-syringes-10',
    'premium-insulin-syringes-50',
    'premium-insulin-syringes-100',
  ],
};

const FAMILIES: AccessoryCountFamily[] = [WIPE_FAMILY, SYRINGE_FAMILY];

/** Parse pack/count from an accessory variant strength like "200 count" or "50 pack". */
export function parseAccessoryCount(product: Product): number | null {
  const strength = product.variants[0]?.strength ?? '';
  const match = strength.match(/(\d+)\s*(count|pack)/i);
  if (match) return Number(match[1]);
  const fromSlug = product.slug.match(/(\d+)$/);
  return fromSlug ? Number(fromSlug[1]) : null;
}

export function getAccessoryCountFamily(slug: string): AccessoryCountFamily | null {
  return FAMILIES.find(f => f.memberSlugs.includes(slug)) ?? null;
}

export function getPricedCountOptions(family: AccessoryCountFamily): AccessoryCountOption[] {
  const options: AccessoryCountOption[] = [];
  for (const slug of family.memberSlugs) {
    const product = getProduct(slug);
    if (!product || product.category !== 'accessories') continue;
    const count = parseAccessoryCount(product);
    const price = product.variants[0]?.price;
    if (count == null || price == null) continue;
    options.push({
      count,
      label: family.formatLabel(count),
      slug: product.slug,
      price,
      productId: product.id,
    });
  }
  return options.sort((a, b) => a.count - b.count);
}

export function clampAccessoryQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return ACCESSORY_UNIT_QUANTITY_MIN;
  return Math.min(
    ACCESSORY_UNIT_QUANTITY_MAX,
    Math.max(ACCESSORY_UNIT_QUANTITY_MIN, Math.round(quantity)),
  );
}

/** Cart line name — includes count when part of a count family. */
export function accessoryCartName(product: Product): string {
  const family = getAccessoryCountFamily(product.slug);
  if (!family) return product.displayName;
  const count = parseAccessoryCount(product);
  if (count == null) return family.displayName;
  return `${family.displayName} — ${family.formatLabel(count)}`;
}

/** Cart secondary line for count/size (omit for simple single-SKU accessories). */
export function accessoryCartVariantLabel(product: Product): string | undefined {
  const family = getAccessoryCountFamily(product.slug);
  if (!family) return undefined;
  const count = parseAccessoryCount(product);
  if (count == null) return undefined;
  return `${family.variantLabel}: ${family.formatLabel(count)}`;
}

export function accessoryStorefrontTitle(product: Product): string {
  return getAccessoryCountFamily(product.slug)?.displayName ?? product.displayName;
}

export function reportMissingAccessoryPrices(): {
  family: string;
  missingCounts: number[];
  available: { count: number; price: number; slug: string }[];
}[] {
  return FAMILIES.map(family => ({
    family: family.displayName,
    missingCounts: [...family.missingCounts],
    available: getPricedCountOptions(family).map(o => ({
      count: o.count,
      price: o.price,
      slug: o.slug,
    })),
  }));
}
