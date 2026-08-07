/**
 * Flat-rate Semaglutide / Tirzepatide Wellness Membership purchase options.
 * Prices are authoritative program rates — never derived from a selected dose.
 *
 * Money constants are duplicated as dollars + cents so UI and Stripe test
 * wiring can share a single source of truth without trusting the browser.
 */
import { getMembership, type Membership, type Product, type ProductVariant } from '../../data/products';

/** Authoritative monthly rates (dollars). */
export const SEMAGLUTIDE_MEMBERSHIP_MONTHLY = 199;
export const TIRZEPATIDE_MEMBERSHIP_MONTHLY = 249;
/** Provider/admin-gated; not a public self-serve upgrade. */
export const TIRZEPATIDE_30MG_MEMBER_ONLY_MONTHLY = 350;

/** Authoritative monthly rates (integer cents). */
export const SEMAGLUTIDE_MEMBERSHIP_CENTS = 19900;
export const TIRZEPATIDE_MEMBERSHIP_CENTS = 24900;
export const TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS = 35000;

export const TIRZEPATIDE_30MG_STRENGTH = '30mg/2mg per mL';
export const TIRZEPATIDE_30MG_SIZE = '2mL';

export type WeightMedicationSlug = 'semaglutide' | 'tirzepatide';

export interface WeightMembershipProgramMeta {
  membershipSlug: string;
  checkoutProductId: string;
  monthlyPrice: number;
  monthlyPriceCents: number;
  cartLabel: string;
  cta: string;
  supportingCopy: string;
  customerNote: string;
  includedFormulations: string[];
  /** Informational only — never a storefront purchase path. */
  memberOnlyNotice: WeightMemberOnlyNotice | null;
  /** Customers cannot self-activate the member-only rate from the product page. */
  memberOnlyPurchasable: false;
}

export interface WeightMemberOnlyNotice {
  title: string;
  monthlyPrice: number;
  monthlyPriceCents: number;
  description: string;
  requiresActiveMembership: true;
  requiresProviderApproval: true;
  requiresAdminApproval: true;
  requiresCustomerAcknowledgment: true;
}

export function isWeightMedicationSlug(slug: string): slug is WeightMedicationSlug {
  return slug === 'semaglutide' || slug === 'tirzepatide';
}

export function isTirzepatide30mgVariant(
  variant: Pick<ProductVariant, 'strength' | 'size'> | null | undefined,
): boolean {
  if (!variant) return false;
  return variant.strength === TIRZEPATIDE_30MG_STRENGTH && variant.size === TIRZEPATIDE_30MG_SIZE;
}

function membershipForSlug(slug: WeightMedicationSlug): Membership | undefined {
  return getMembership(slug === 'semaglutide' ? 'semaglutide-membership' : 'tirzepatide-membership');
}

/**
 * Build flat-rate Wellness Membership metadata for Semaglutide / Tirzepatide PDPs.
 * Price is never calculated from `selectedVariant`.
 */
export function getWeightMembershipProgram(
  product: Pick<Product, 'slug'>,
  selectedVariant?: Pick<ProductVariant, 'strength' | 'size'> | null,
): WeightMembershipProgramMeta | null {
  if (!isWeightMedicationSlug(product.slug)) return null;

  const membership = membershipForSlug(product.slug);
  if (!membership) return null;

  if (product.slug === 'semaglutide') {
    return {
      membershipSlug: membership.slug,
      checkoutProductId: membership.checkoutProductId || membership.id,
      monthlyPrice: SEMAGLUTIDE_MEMBERSHIP_MONTHLY,
      monthlyPriceCents: SEMAGLUTIDE_MEMBERSHIP_CENTS,
      cartLabel: `Semaglutide Wellness Membership — $${SEMAGLUTIDE_MEMBERSHIP_MONTHLY}/month`,
      cta: `Join Semaglutide Membership — $${SEMAGLUTIDE_MEMBERSHIP_MONTHLY}/month`,
      supportingCopy:
        'One predictable monthly price across all included provider-selected Semaglutide formulations.',
      customerNote:
        'Your membership rate stays the same while you remain continuously enrolled and your treatment remains within the included program.',
      includedFormulations: [...membership.includedFormulations],
      memberOnlyNotice: null,
      memberOnlyPurchasable: false,
    };
  }

  const show30mgNotice = isTirzepatide30mgVariant(selectedVariant);
  return {
    membershipSlug: membership.slug,
    checkoutProductId: membership.checkoutProductId || membership.id,
    monthlyPrice: TIRZEPATIDE_MEMBERSHIP_MONTHLY,
    monthlyPriceCents: TIRZEPATIDE_MEMBERSHIP_CENTS,
    cartLabel: `Tirzepatide Wellness Membership — $${TIRZEPATIDE_MEMBERSHIP_MONTHLY}/month`,
    cta: `Join Tirzepatide Membership — $${TIRZEPATIDE_MEMBERSHIP_MONTHLY}/month`,
    supportingCopy: show30mgNotice
      ? 'The standard $249/month membership includes provider-selected formulations only through 25mg/2mg per mL, 2mL.'
      : 'One predictable monthly price through the included Tirzepatide program maximum.',
    customerNote: 'Includes eligible provider-selected formulations through 25mg/2mg per mL, 2mL.',
    includedFormulations: [...membership.includedFormulations],
    memberOnlyNotice: show30mgNotice
      ? {
          title: '30MG MEMBER-ONLY RATE',
          monthlyPrice: TIRZEPATIDE_30MG_MEMBER_ONLY_MONTHLY,
          monthlyPriceCents: TIRZEPATIDE_30MG_MEMBER_ONLY_CENTS,
          description: 'Available only to active Tirzepatide Wellness Members when provider-directed.',
          requiresActiveMembership: true,
          requiresProviderApproval: true,
          requiresAdminApproval: true,
          requiresCustomerAcknowledgment: true,
        }
      : null,
    memberOnlyPurchasable: false,
  };
}
