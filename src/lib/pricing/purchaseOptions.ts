/**
 * Active Wellness Membership + Auto-Refill & Save + One-Time Purchase pricing.
 * Discounts never stack. Maximum automatic savings = member discount (default 15%).
 *
 * Semaglutide / Tirzepatide product pages use a separate flat-rate
 * `membership_program` option ($149 / $249) — never a 15% dose discount.
 */
import type { Category, Product, ProductVariant } from '../../data/products';
import {
  DEFAULT_AUTO_REFILL_DISCOUNT_PERCENT,
  DEFAULT_MEMBER_DISCOUNT_PERCENT,
  type PurchaseDiscountSettings,
  getDefaultPurchaseDiscountSettings,
} from './settings';
import {
  getWeightMembershipProgram,
  isWeightMedicationSlug,
  type WeightMembershipProgramMeta,
} from './weightMembership';

export type PurchaseOptionKind =
  | 'membership_program'
  | 'active_membership'
  | 'auto_refill'
  | 'one_time';
export type AppliedDiscount = 'member' | 'auto_refill' | 'none';

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
  >;
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

export function isAutoRefillEligible(
  product: Pick<Product, 'category' | 'autoRefillEligible' | 'excludedFromDiscounts' | 'status'>,
): boolean {
  if (isExcludedFromDiscounts(product)) return false;
  if (product.status === 'future') return false;
  return product.autoRefillEligible === true;
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
      recurring: option === 'auto_refill',
    };
  }

  // Active members always receive member pricing on eligible products (no stacking).
  if (isActiveMember && isMemberPricingEligible(product)) {
    return {
      finalPrice: applyDiscount(standardPrice, settings.memberDiscountPercent),
      discountPercent: settings.memberDiscountPercent,
      appliedDiscount: 'member',
      recurring: option === 'auto_refill',
    };
  }

  if (option === 'auto_refill' && isAutoRefillEligible(product)) {
    return {
      finalPrice: applyDiscount(standardPrice, settings.autoRefillDiscountPercent),
      discountPercent: settings.autoRefillDiscountPercent,
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

function buildWeightMembershipOption(
  product: Product,
  selectedVariant?: Pick<ProductVariant, 'strength' | 'size'> | null,
): PricedPurchaseOption | null {
  const program = getWeightMembershipProgram(product, selectedVariant);
  if (!program) return null;

  return {
    kind: 'membership_program',
    label: 'Wellness Membership',
    badge: 'BEST VALUE',
    description: program.supportingCopy,
    cta: program.cta,
    standardPrice: program.monthlyPrice,
    finalPrice: program.monthlyPrice,
    discountPercent: 0,
    appliedDiscount: 'none',
    recurring: true,
    billingFrequency: 'monthly',
    savingsAmount: 0,
    program,
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
  const { standardPrice, product, isActiveMember, selectedVariant } = input;
  const options: PricedPurchaseOption[] = [];

  const weightProgram = isWeightMedicationSlug(product.slug)
    ? buildWeightMembershipOption(product, selectedVariant)
    : null;
  if (weightProgram) {
    options.push(weightProgram);
  }

  // Percentage member pricing CTA for other eligible wellness products only.
  // Semaglutide / Tirzepatide keep memberPricingEligible: false so this stays off.
  const memberEligible = !weightProgram && isMemberPricingEligible(product);
  const autoEligible = isAutoRefillEligible(product);

  if (memberEligible) {
    const priced = resolveUnitPrice({
      standardPrice,
      product,
      isActiveMember,
      option: 'active_membership',
      settings,
    });
    options.push({
      kind: 'active_membership',
      label: isActiveMember ? 'Active Member Price' : 'Active Wellness Membership',
      badge: isActiveMember ? 'Save 15%'.replace('15', String(settings.memberDiscountPercent)) : 'BEST VALUE',
      description: isActiveMember
        ? 'You are receiving our best available pricing.'
        : 'Members receive our lowest available pricing on eligible wellness products.',
      cta: isActiveMember ? 'Active Member Price' : 'Become a Member',
      standardPrice,
      finalPrice: priced.finalPrice,
      discountPercent: priced.discountPercent,
      appliedDiscount: priced.appliedDiscount,
      recurring: false,
      billingFrequency: null,
      savingsAmount: Math.max(0, Math.round((standardPrice - priced.finalPrice) * 100) / 100),
    });
  }

  if (autoEligible) {
    const priced = resolveUnitPrice({
      standardPrice,
      product,
      isActiveMember,
      option: 'auto_refill',
      settings,
    });
    const shownPercent =
      priced.appliedDiscount === 'none'
        ? settings.autoRefillDiscountPercent
        : priced.discountPercent;
    options.push({
      kind: 'auto_refill',
      label: 'Auto-Refill & Save',
      badge: `Save ${shownPercent}%`,
      description: isActiveMember && isMemberPricingEligible(product)
        ? 'Convenient monthly deliveries at your Active Member price. Discounts do not stack. Each refill period is billed according to your selected payment method.'
        : 'Convenient monthly deliveries with 10% savings on eligible products. Each refill period is billed according to your selected payment method.',
      cta: 'Auto-Refill & Save',
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
