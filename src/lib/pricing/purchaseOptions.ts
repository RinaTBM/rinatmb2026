/**
 * New-purchase pricing: One-Time Purchase or Subscribe & Save 15%.
 * Subscriptions are available only for active prescription products. Provider
 * visits, labs, services, and accessories are always one-time purchases.
 */
import type { Category, Product, ProductVariant } from '../../data/products';
import {
  DEFAULT_AUTO_REFILL_DISCOUNT_PERCENT,
  DEFAULT_MEMBER_DISCOUNT_PERCENT,
  type PurchaseDiscountSettings,
  getDefaultPurchaseDiscountSettings,
} from './settings';
import type { WeightMembershipProgramMeta } from './weightMembership';

export type PurchaseOptionKind =
  | 'membership_program'
  | 'active_membership'
  | 'auto_refill'
  | 'one_time';
export type AppliedDiscount = 'member' | 'auto_refill' | 'none';

/** Historical storage value retained; customer-facing label is Subscribe & Save. */
export const NEW_PURCHASE_AUTO_REFILL_OFFERED = true;
export const NEW_PURCHASE_AUTO_REFILL_BLOCKER =
  'Subscriptions are available only for active prescription products.';

export const EXCLUDED_DISCOUNT_CATEGORIES: ReadonlySet<Category> = new Set([
  'provider-care',
  'accessories',
]);

export interface PricedPurchaseOption {
  kind: PurchaseOptionKind;
  label: string;
  badge?: string;
  description: string;
  cta: string;
  standardPrice: number;
  finalPrice: number;
  discountPercent: number;
  appliedDiscount: AppliedDiscount;
  recurring: boolean;
  billingFrequency: 'monthly' | null;
  savingsAmount: number;
  /** Flat-rate Semaglutide / Tirzepatide Wellness Membership metadata. */
  program?: WeightMembershipProgramMeta;
}

export interface ResolvePriceInput {
  standardPrice: number;
  product: Pick<
    Product,
    'category' | 'autoRefillEligible' | 'memberPricingEligible' | 'excludedFromDiscounts' | 'status'
  > & Partial<Pick<Product, 'requiresPrescription'>>;
  /** Customer already has an Active Wellness Membership (Semaglutide or Tirzepatide). */
  isActiveMember: boolean;
  /** Selected storefront option (membership CTA is navigational; pricing uses member/auto/one-time). */
  option: Exclude<PurchaseOptionKind, 'membership_program'>;
  settings?: PurchaseDiscountSettings;
}

export function isExcludedFromDiscounts(
  product: Pick<Product, 'category' | 'excludedFromDiscounts'>,
): boolean {
  if (product.excludedFromDiscounts) return true;
  return EXCLUDED_DISCOUNT_CATEGORIES.has(product.category);
}

export function isMemberPricingEligible(
  product: Pick<Product, 'category' | 'memberPricingEligible' | 'excludedFromDiscounts'>,
): boolean {
  // Provider care never receives automatic member % discounts.
  if (product.category === 'provider-care') return false;
  // Accessories use the dedicated accessory member-discount path (not wellness catalog %).
  if (product.category === 'accessories') return false;
  if (isExcludedFromDiscounts(product)) return false;
  return product.memberPricingEligible !== false;
}

/**
 * Catalog flag only (admin / historical). Does not offer Auto-Refill on the storefront.
 */
export function isAutoRefillEligible(
  product: Pick<Product, 'category' | 'autoRefillEligible' | 'excludedFromDiscounts' | 'status'> &
    Partial<Pick<Product, 'requiresPrescription'>>,
): boolean {
  if (isExcludedFromDiscounts(product)) return false;
  if (product.status === 'future') return false;
  return product.requiresPrescription !== false && product.autoRefillEligible === true;
}

export function isAutoRefillNewPurchaseAttempt(item: {
  purchaseType?: string | null;
  subscription?: boolean;
  isMembership?: boolean;
}): boolean {
  if (item.isMembership || item.purchaseType === 'membership_program') return false;
  return item.purchaseType === 'auto_refill' || item.subscription === true;
}

/** Apply a single discount. Never stacks. */
export function applyDiscount(standardPrice: number, percent: number): number {
  if (!Number.isFinite(standardPrice) || standardPrice <= 0) return 0;
  const p = Math.min(100, Math.max(0, percent));
  return Math.round(standardPrice * (1 - p / 100) * 100) / 100;
}

/**
 * Resolve the final unit price for a purchase option.
 * Priority when customer is an active member: member discount wins over auto-refill.
 * Never applies 15% member pricing to Semaglutide / Tirzepatide medication
 * (`memberPricingEligible: false` on those products).
 */
export function resolveUnitPrice(input: ResolvePriceInput): {
  finalPrice: number;
  discountPercent: number;
  appliedDiscount: AppliedDiscount;
  recurring: boolean;
} {
  const settings = input.settings ?? getDefaultPurchaseDiscountSettings();
  const { standardPrice, product, isActiveMember, option } = input;
  const excluded = isExcludedFromDiscounts(product);

  if (option === 'active_membership') {
    // Navigational option — pricing display uses member rate for illustration.
    if (excluded || !isMemberPricingEligible(product)) {
      return { finalPrice: standardPrice, discountPercent: 0, appliedDiscount: 'none', recurring: false };
    }
    return {
      finalPrice: applyDiscount(standardPrice, settings.memberDiscountPercent),
      discountPercent: settings.memberDiscountPercent,
      appliedDiscount: 'member',
      recurring: false,
    };
  }

  if (excluded) {
    return {
      finalPrice: standardPrice,
      discountPercent: 0,
      appliedDiscount: 'none',
      recurring: false,
    };
  }

  // Active members always receive member pricing on eligible products (no stacking).
  if (isActiveMember && isMemberPricingEligible(product)) {
    return {
      finalPrice: applyDiscount(standardPrice, settings.memberDiscountPercent),
      discountPercent: settings.memberDiscountPercent,
      appliedDiscount: 'member',
      recurring: false,
    };
  }

  if (option === 'auto_refill' && isAutoRefillEligible(product)) {
    return {
      finalPrice: applyDiscount(standardPrice, settings.memberDiscountPercent),
      discountPercent: settings.memberDiscountPercent,
      appliedDiscount: 'auto_refill',
      recurring: true,
    };
  }

  return {
    finalPrice: standardPrice,
    discountPercent: 0,
    appliedDiscount: 'none',
    recurring: false,
  };
}

export function buildPurchaseOptions(input: {
  standardPrice: number;
  product: Product;
  isActiveMember: boolean;
  settings?: PurchaseDiscountSettings;
  /** Selected dose — used only for Tirzepatide 30mg member-only notice; never prices membership. */
  selectedVariant?: Pick<ProductVariant, 'strength' | 'size'> | null;
}): PricedPurchaseOption[] {
  const settings = input.settings ?? getDefaultPurchaseDiscountSettings();
  const { standardPrice, product, isActiveMember } = input;
  const options: PricedPurchaseOption[] = [];

  if (isAutoRefillEligible(product)) {
    const priced = resolveUnitPrice({
      standardPrice,
      product,
      isActiveMember: false,
      option: 'auto_refill',
      settings,
    });
    options.push({
      kind: 'auto_refill',
      label: 'Subscribe & Save',
      badge: `Save ${settings.memberDiscountPercent}%`,
      description: 'Delivered monthly after provider approval. Any required fulfillment details are shown before payment.',
      cta: 'Subscribe',
      standardPrice,
      finalPrice: priced.finalPrice,
      discountPercent: priced.discountPercent,
      appliedDiscount: priced.appliedDiscount,
      recurring: true,
      billingFrequency: 'monthly',
      savingsAmount: Math.max(0, Math.round((standardPrice - priced.finalPrice) * 100) / 100),
    });
  }

  {
    const priced = resolveUnitPrice({
      standardPrice,
      product,
      isActiveMember,
      option: 'one_time',
      settings,
    });
    options.push({
      kind: 'one_time',
      label: 'One-Time Purchase',
      badge: priced.appliedDiscount === 'member' ? `Members Save ${priced.discountPercent}%` : undefined,
      description:
        priced.appliedDiscount === 'member'
          ? 'Purchase today at your Active Member price. No recurring commitment.'
          : 'Purchase today. No recurring commitment.',
      cta: 'Buy Once',
      standardPrice,
      finalPrice: priced.finalPrice,
      discountPercent: priced.discountPercent,
      appliedDiscount: priced.appliedDiscount,
      recurring: false,
      billingFrequency: null,
      savingsAmount: Math.max(0, Math.round((standardPrice - priced.finalPrice) * 100) / 100),
    });
  }

  return options;
}

export function discountLabel(applied: AppliedDiscount, percent: number): string | null {
  if (applied === 'member') return `Member savings ${percent}%`;
  if (applied === 'auto_refill') return `Auto-Refill savings ${percent}%`;
  return null;
}

export { DEFAULT_MEMBER_DISCOUNT_PERCENT, DEFAULT_AUTO_REFILL_DISCOUNT_PERCENT };
export {
  SEMAGLUTIDE_MEMBERSHIP_CENTS,
  TIRZEPATIDE_MEMBERSHIP_CENTS,
  TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS,
  getWeightMembershipProgram,
  isTirzepatide30mgVariant,
  isWeightMedicationSlug,
} from './weightMembership';
