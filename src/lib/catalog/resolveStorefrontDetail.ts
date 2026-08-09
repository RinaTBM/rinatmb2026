import {
  getMembership,
  getProduct,
  type Membership,
  type Product,
} from '@/data/products';

export type StorefrontDetail =
  | { kind: 'product'; product: Product }
  | { kind: 'membership'; membership: Membership }
  | { kind: 'not_found' };

/**
 * Resolve a `/product/:slug` route against products first, then memberships.
 * Does not invent duplicate membership definitions — uses `getMembership`.
 */
export function resolveStorefrontDetail(slug: string): StorefrontDetail {
  const product = getProduct(slug);
  if (product) return { kind: 'product', product };

  const membership = getMembership(slug);
  if (membership) return { kind: 'membership', membership };

  return { kind: 'not_found' };
}

/** Cart / drawer link path for a line item (products and memberships share `/product/:slug`). */
export function cartItemDetailPath(item: { slug: string }): string {
  return `/product/${item.slug}`;
}
