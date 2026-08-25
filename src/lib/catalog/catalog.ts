// =============================================================================
// Normalized catalog (single source for admin, validation, Stripe sync, seed).
// Money is ALWAYS integer cents here. Derived from src/data/products.ts so the
// storefront and the admin/sync pipeline never diverge.
//
// This module uses RELATIVE imports (not the "@/" alias) so it runs unchanged
// under Vite, tsc, Vitest, and tsx-based CLI scripts.
// =============================================================================
import {
  products as sourceProducts,
  memberships as sourceMemberships,
  type Product as SourceProduct,
  type Membership as SourceMembership,
} from '../../data/products';

export type Environment = 'test' | 'live';
export type BillingType = 'one_time' | 'recurring';
export type EntityType = 'product' | 'membership';

export interface CatalogVariant {
  variantKey: string;
  displayName: string;
  dosageForm: string;
  strength: string;
  size: string;
  priceCents: number;
  currency: string;
  billingType: BillingType;
  billingInterval: 'month' | null;
  isActive: boolean;
  sortOrder: number;
  /** Stable Scriptful/retail SKU when assigned. */
  sku?: string | null;
}

export interface CatalogProduct {
  /** Stable application id (also used as Stripe metadata app_product_id). */
  appId: string;
  slug: string;
  displayName: string;
  shortName: string;
  subtitle: string;
  category: string;
  dosageFormSummary: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  imageAlt: string;
  startingPriceCents: number;
  currency: string;
  status: 'active' | 'future';
  isVisible: boolean;
  launchPhase?: number;
  campaignTheme?: string;
  requiresProviderReview: boolean;
  requiresPrescription: boolean;
  requiresComplianceReview: boolean;
  requiresPharmacyVerification: boolean;
  autoRefillEligible: boolean;
  memberPricingEligible: boolean;
  excludedFromDiscounts: boolean;
  variants: CatalogVariant[];
}

export interface CatalogMembership {
  appId: string;
  slug: string;
  displayName: string;
  brandName: string;
  shortDescription: string;
  longDescription: string;
  monthlyPriceCents: number;
  currency: string;
  billingInterval: 'month';
  initialTermMonths: number;
  lockedRate: boolean;
  includedFormulations: string[];
  maximumIncludedFormulation: string;
  providerReviewRequired: boolean;
  prescriptionGuaranteed: boolean;
  shippingIncluded: boolean;
  status: 'active' | 'inactive';
  isVisible: boolean;
  /** Stripe app_product_id used for mapping (e.g. m1/m2). */
  checkoutProductId: string;
  /** Membership PROGRAM SKU (billing), when assigned. */
  programSku?: string | null;
}

export const CURRENCY = 'usd';

/** Storefront-only categories preserved from website-improvements; not part of Stripe catalog sync. */
const SYNC_EXCLUDED_CATEGORIES = new Set(['provider-care', 'accessories']);

/**
 * Products kept in the storefront catalog but NOT on the approved wellness sync list.
 * Do not create Stripe TEST objects for these until explicitly reviewed.
 */
const SYNC_EXCLUDED_PRODUCT_SLUGS = new Set(['tretinoin-cream', 'bimatoprost-solution']);

/**
 * Stripe-sync allowlist is independent of shop visibility.
 * Shop All may show legitimate public families that are not launch-purchasable.
 */
const STRIPE_SYNC_SLUGS = new Set(['semaglutide', 'tirzepatide', 'nad-plus']);

export const toCents = (dollars: number): number => Math.round(dollars * 100);
export const formatCents = (cents: number): string => `$${(cents / 100).toFixed(2)}`;

function mapVariants(p: SourceProduct): CatalogVariant[] {
  const multiForm = new Set(p.variants.map(v => v.dosageForm)).size > 1;
  return p.variants.map((v, i) => ({
    variantKey: v.id,
    displayName: multiForm ? `${v.dosageForm}, ${v.strength}, ${v.size}` : `${v.strength}, ${v.size}`,
    dosageForm: v.dosageForm,
    strength: v.strength,
    size: v.size,
    priceCents: toCents(v.price),
    currency: CURRENCY,
    billingType: 'one_time',
    billingInterval: null,
    isActive: true,
    sortOrder: i,
    sku: v.sku ?? null,
  }));
}

function mapProduct(p: SourceProduct): CatalogProduct {
  return {
    appId: p.id,
    slug: p.slug,
    displayName: p.displayName,
    shortName: p.shortName,
    subtitle: p.subtitle,
    category: p.category,
    dosageFormSummary: p.dosageForms.join(', '),
    shortDescription: p.shortDescription,
    longDescription: p.longDescription,
    imageUrl: p.image,
    imageAlt: p.imageAlt,
    startingPriceCents: toCents(p.startingPrice),
    currency: CURRENCY,
    status: p.status,
    isVisible: p.isVisible,
    launchPhase: p.launchPhase,
    campaignTheme: p.campaignTheme,
    requiresProviderReview: p.requiresProviderReview,
    requiresPrescription: p.requiresPrescription,
    requiresComplianceReview: p.requiresComplianceReview,
    requiresPharmacyVerification: p.requiresPharmacyVerification,
    autoRefillEligible: p.autoRefillEligible,
    memberPricingEligible: p.memberPricingEligible,
    excludedFromDiscounts: p.excludedFromDiscounts,
    variants: mapVariants(p),
  };
}

function mapMembership(m: SourceMembership): CatalogMembership {
  return {
    appId: m.checkoutProductId || m.id,
    slug: m.slug,
    displayName: m.displayName,
    brandName: m.brandName,
    shortDescription: m.shortDescription,
    longDescription: m.longDescription,
    monthlyPriceCents: toCents(m.monthlyPrice),
    currency: CURRENCY,
    billingInterval: 'month',
    initialTermMonths: m.initialTermMonths,
    lockedRate: m.lockedRate,
    includedFormulations: m.includedFormulations,
    maximumIncludedFormulation: m.maximumIncludedFormulation,
    providerReviewRequired: m.providerReviewRequired,
    prescriptionGuaranteed: m.prescriptionGuaranteed,
    shippingIncluded: m.shippingIncluded,
    status: m.status,
    isVisible: m.isVisible,
    checkoutProductId: m.checkoutProductId,
    programSku: m.programSku ?? null,
  };
}

export const catalogProducts: CatalogProduct[] = sourceProducts
  .filter(p => !SYNC_EXCLUDED_CATEGORIES.has(p.category))
  .map(mapProduct);
export const catalogMemberships: CatalogMembership[] = sourceMemberships.map(mapMembership);

/** Products that should be synced to Stripe (launch-ready wellness only). Shop visibility is separate. */
export const syncableProducts = (): CatalogProduct[] =>
  catalogProducts.filter(
    p =>
      p.status === 'active' &&
      STRIPE_SYNC_SLUGS.has(p.slug) &&
      !SYNC_EXCLUDED_PRODUCT_SLUGS.has(p.slug),
  );

/** Active storefront products intentionally withheld from stripe-sync pending review. */
export const syncReviewHoldProducts = (): CatalogProduct[] =>
  catalogProducts.filter(p => SYNC_EXCLUDED_PRODUCT_SLUGS.has(p.slug));

/** Memberships that should be synced to Stripe (active + visible). */
export const syncableMemberships = (): CatalogMembership[] =>
  catalogMemberships.filter(m => m.status === 'active' && m.isVisible);

export const getCatalogProduct = (slug: string) => catalogProducts.find(p => p.slug === slug);
export const getCatalogMembership = (slug: string) => catalogMemberships.find(m => m.slug === slug);

export const catalogCategories = (): { id: string; count: number }[] => {
  const counts = new Map<string, number>();
  syncableProducts().forEach(p => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
  return Array.from(counts, ([id, count]) => ({ id, count }));
};
