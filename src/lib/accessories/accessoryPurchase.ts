/**
 * Accessory purchase helpers — count/pack variants, cart labels, quantity bounds.
 */
import type { Product, ProductVariant } from '../../data/products';

export const ACCESSORY_UNIT_QUANTITY_MIN = 1;
export const ACCESSORY_UNIT_QUANTITY_MAX = 10;

/** Slugs that expose in-page Select Count options from product.variants. */
export const ACCESSORY_COUNT_PRODUCT_SLUGS = new Set([
  'alcohol-prep-wipes',
  'premium-insulin-syringes',
]);

export function isAccessoryCountProduct(product: Pick<Product, 'slug' | 'category'>): boolean {
  return product.category === 'accessories' && ACCESSORY_COUNT_PRODUCT_SLUGS.has(product.slug);
}

/** Customer-facing option label (e.g. "200 Count", "50 Pack"). */
export function accessoryVariantOptionLabel(variant: ProductVariant): string {
  return variant.strength.trim();
}

export function clampAccessoryQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return ACCESSORY_UNIT_QUANTITY_MIN;
  return Math.min(
    ACCESSORY_UNIT_QUANTITY_MAX,
    Math.max(ACCESSORY_UNIT_QUANTITY_MIN, Math.round(quantity)),
  );
}

/** Cart line name — includes selected count/pack when applicable. */
export function accessoryCartName(product: Product, variant: ProductVariant): string {
  if (isAccessoryCountProduct(product)) {
    return `${product.displayName} — ${accessoryVariantOptionLabel(variant)}`;
  }
  return product.displayName;
}

/** Cart secondary line for count/pack (omit for simple accessories). */
export function accessoryCartVariantLabel(
  product: Product,
  variant: ProductVariant,
): string | undefined {
  if (!isAccessoryCountProduct(product)) return undefined;
  return `Count: ${accessoryVariantOptionLabel(variant)}`;
}

/** Obsolete Stripe test app_product_ids superseded by consolidated accessory products. */
export const OBSOLETE_ACCESSORY_STRIPE_TEST_IDS = [
  {
    appProductId: 'a8',
    formerSlug: 'alcohol-prep-wipes-100',
    note: 'Replaced by alcohol-prep-wipes variants (200/500). Former 100-count SKU removed from public catalog.',
  },
  {
    appProductId: 'a9',
    formerSlug: 'alcohol-prep-wipes-200',
    note: 'Duplicate wipe card removed; consolidated into alcohol-prep-wipes (a8) with 200/500 Count variants.',
  },
  {
    appProductId: 'a10',
    formerSlug: 'premium-insulin-syringes-10',
    note: 'ID reused for consolidated premium-insulin-syringes parent; former single 10-pack product superseded by pack variants.',
  },
  {
    appProductId: 'a11',
    formerSlug: 'premium-insulin-syringes-50',
    note: 'Duplicate syringe card removed; consolidated into premium-insulin-syringes (a10).',
  },
  {
    appProductId: 'a12',
    formerSlug: 'premium-insulin-syringes-100',
    note: 'Duplicate syringe card removed; consolidated into premium-insulin-syringes (a10).',
  },
] as const;
