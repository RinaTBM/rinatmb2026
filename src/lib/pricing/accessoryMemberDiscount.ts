/**
 * Active Wellness Membership — 15% off eligible accessories.
 * Does not stack. Bundles default OFF. Provider care / shipping / taxes excluded.
 *
 * Server-side checkout must recompute unit amounts from standardPrice + percent.
 * Never trust a lower client-supplied unit amount.
 */
import type { Product } from '../../data/products';
import {
  DEFAULT_ACCESSORY_MEMBER_DISCOUNT_PERCENT,
  type PurchaseDiscountSettings,
  getDefaultPurchaseDiscountSettings,
} from './settings';
import { applyDiscount, isExcludedFromDiscounts } from './purchaseOptions';

/** Bundle / kit accessories do not receive the member accessory discount by default. */
export function isAccessoryBundle(
  product: Pick<Product, 'slug' | 'featured' | 'category'>,
): boolean {
  if (product.category !== 'accessories') return false;
  if (product.featured) return true;
  return /kit|bundle/i.test(product.slug);
}

/**
 * Eligible for the Active Wellness Member accessory discount.
 * Requires explicit memberPricingEligible (default true for non-bundle accessories).
 * Never applies to provider-care or hard-excluded non-accessory categories.
 */
export function isAccessoryMemberDiscountEligible(
  product: Pick<
    Product,
    'category' | 'memberPricingEligible' | 'excludedFromDiscounts' | 'slug' | 'featured'
  >,
): boolean {
  if (product.category !== 'accessories') return false;
  if (isAccessoryBundle(product)) return false;
  // Per-product admin flag — false disables the benefit for this SKU.
  return product.memberPricingEligible === true;
}

export function resolveAccessoryUnitPrice(input: {
  standardPrice: number;
  product: Pick<
    Product,
    'category' | 'memberPricingEligible' | 'excludedFromDiscounts' | 'slug' | 'featured'
  >;
  isActiveMember: boolean;
  membershipStatus?: 'active' | 'none' | string;
  settings?: PurchaseDiscountSettings;
}): {
  finalPrice: number;
  discountPercent: number;
  appliedDiscount: 'member' | 'none';
  savingsAmount: number;
} {
  const settings = input.settings ?? getDefaultPurchaseDiscountSettings();
  const standard = input.standardPrice;
  const membershipActive =
    input.isActiveMember === true &&
    (input.membershipStatus == null || input.membershipStatus === 'active');

  if (
    !membershipActive ||
    !settings.accessoryMemberDiscountEnabled ||
    !isAccessoryMemberDiscountEligible(input.product)
  ) {
    return {
      finalPrice: standard,
      discountPercent: 0,
      appliedDiscount: 'none',
      savingsAmount: 0,
    };
  }

  // Never stack — accessory member discount is the only automatic accessory savings.
  // accessoryMemberDiscountStackable is forced false in settings.
  void settings.accessoryMemberDiscountStackable;

  const percent = settings.accessoryMemberDiscountPercent;
  const finalPrice = applyDiscount(standard, percent);
  return {
    finalPrice,
    discountPercent: percent,
    appliedDiscount: 'member',
    savingsAmount: Math.max(0, Math.round((standard - finalPrice) * 100) / 100),
  };
}

/** Authoritative dollar price after member accessory discount. */
export function expectedAccessoryMemberPrice(
  standardPrice: number,
  percent: number = DEFAULT_ACCESSORY_MEMBER_DISCOUNT_PERCENT,
): number {
  return applyDiscount(standardPrice, percent);
}

/** Authoritative cents for checkout validation (never trust a lower client amount). */
export function expectedAccessoryMemberUnitCents(
  standardPriceCents: number,
  percent: number = DEFAULT_ACCESSORY_MEMBER_DISCOUNT_PERCENT,
): number {
  if (!Number.isFinite(standardPriceCents) || standardPriceCents < 0) return 0;
  const p = Math.min(100, Math.max(0, percent));
  return Math.round(standardPriceCents * (1 - p / 100));
}

/**
 * Authorize the unit amount charged for an accessory line at checkout.
 * - Non-members / ineligible / disabled → standard retail cents
 * - Active members on eligible accessories → expected member cents only
 * - Never grants a deeper discount than the configured percent
 * - Never stacks; client-requested amounts below authorized are ignored
 */
export function authorizeAccessoryCheckoutUnitCents(input: {
  standardPriceCents: number;
  requestedUnitCents?: number;
  isActiveMember: boolean;
  membershipStatus?: 'active' | 'none' | string;
  productEligible: boolean;
  settings?: PurchaseDiscountSettings;
}): { unitAmountCents: number; appliedDiscount: 'member' | 'none'; discountPercent: number } {
  const settings = input.settings ?? getDefaultPurchaseDiscountSettings();
  const standard = Math.max(0, Math.round(input.standardPriceCents));
  const membershipActive =
    input.isActiveMember === true &&
    (input.membershipStatus == null || input.membershipStatus === 'active');

  if (
    !membershipActive ||
    !settings.accessoryMemberDiscountEnabled ||
    !input.productEligible
  ) {
    return { unitAmountCents: standard, appliedDiscount: 'none', discountPercent: 0 };
  }

  // Stacking is disallowed by policy (settings force stackable=false).
  void settings.accessoryMemberDiscountStackable;

  const percent = settings.accessoryMemberDiscountPercent;
  const authorized = expectedAccessoryMemberUnitCents(standard, percent);
  // Reject deeper client discounts; never charge less than authorized member price.
  if (
    typeof input.requestedUnitCents === 'number' &&
    Number.isFinite(input.requestedUnitCents) &&
    Math.round(input.requestedUnitCents) < authorized
  ) {
    return { unitAmountCents: authorized, appliedDiscount: 'member', discountPercent: percent };
  }

  return {
    unitAmountCents: authorized,
    appliedDiscount: 'member',
    discountPercent: percent,
  };
}

/** Provider care / appointments / labs / shipping are never accessory-member-discounted. */
export function isHardExcludedFromAccessoryMemberDiscount(
  product: Pick<Product, 'category' | 'excludedFromDiscounts'>,
): boolean {
  if (product.category === 'provider-care') return true;
  if (product.category !== 'accessories') return isExcludedFromDiscounts(product);
  return false;
}
