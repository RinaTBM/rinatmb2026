// Catalog validation rules (Phase 5). Pure + dependency-free so it runs in the
// browser (admin editor), in Vitest, and in the `catalog:validate` CLI.
import { catalogProducts, catalogMemberships, type CatalogProduct, type CatalogMembership } from './catalog';

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export interface ValidateOptions {
  /** Slugs explicitly permitted to have a $0 active price. */
  allowZeroPriceSlugs?: string[];
}

export function validateCatalog(
  products: CatalogProduct[] = catalogProducts,
  memberships: CatalogMembership[] = catalogMemberships,
  opts: ValidateOptions = {},
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const allowZero = new Set(opts.allowZeroPriceSlugs ?? []);

  // --- Products ---
  const slugSeen = new Set<string>();
  for (const p of products) {
    if (!p.displayName?.trim()) errors.push(`Product "${p.slug || p.appId}" is missing a name.`);
    if (!p.category?.trim()) errors.push(`Product "${p.slug}" is missing a category.`);
    if (!p.slug?.trim()) errors.push(`Product "${p.displayName}" is missing a slug.`);
    if (slugSeen.has(p.slug)) errors.push(`Duplicate product slug: "${p.slug}".`);
    slugSeen.add(p.slug);

    if (p.isVisible && !p.imageAlt?.trim()) {
      errors.push(`Product "${p.slug}" is visible but has no image alt text.`);
    }

    const variantKeys = new Set<string>();
    if (p.variants.length === 0) warnings.push(`Product "${p.slug}" has no variants.`);
    for (const v of p.variants) {
      if (variantKeys.has(v.variantKey)) errors.push(`Duplicate variant key "${v.variantKey}" in product "${p.slug}".`);
      variantKeys.add(v.variantKey);
      if (v.priceCents < 0) errors.push(`Negative price on ${p.slug} / ${v.variantKey}.`);
      if (v.priceCents === 0 && p.status === 'active' && v.isActive && !allowZero.has(p.slug)) {
        errors.push(`Zero-price active variant ${p.slug} / ${v.variantKey} is not allowed.`);
      }
      if (!Number.isInteger(v.priceCents)) errors.push(`Non-integer cents on ${p.slug} / ${v.variantKey}.`);
    }
    if (p.startingPriceCents < 0) errors.push(`Negative starting price on "${p.slug}".`);
  }

  // --- Memberships ---
  const memSlugSeen = new Set<string>();
  for (const m of memberships) {
    if (!m.displayName?.trim()) errors.push(`Membership "${m.slug || m.appId}" is missing a name.`);
    if (memSlugSeen.has(m.slug)) errors.push(`Duplicate membership slug: "${m.slug}".`);
    memSlugSeen.add(m.slug);
    if (m.billingInterval !== 'month') errors.push(`Membership "${m.slug}" must have a monthly billing interval.`);
    if (m.monthlyPriceCents <= 0 && m.status === 'active') errors.push(`Membership "${m.slug}" must have a positive monthly price.`);
    if (!Number.isInteger(m.monthlyPriceCents)) errors.push(`Non-integer cents on membership "${m.slug}".`);
    if (m.status === 'active' && m.isVisible) {
      if (!m.maximumIncludedFormulation?.trim()) {
        warnings.push(`Membership "${m.slug}" has no maximum included formulation stated.`);
      }
      if (m.initialTermMonths <= 0) errors.push(`Membership "${m.slug}" must have a positive initial term.`);
      if (m.prescriptionGuaranteed) errors.push(`Membership "${m.slug}" must not guarantee a prescription.`);
      if (!m.checkoutProductId?.trim()) {
        errors.push(`Membership "${m.slug}" is missing a checkout product mapping (Stripe recurring product).`);
      }
    }
  }

  // --- Program-specific safety: Tirzepatide must not include obsolete 30mg ---
  const tirz = memberships.find(m => m.slug === 'tirzepatide-membership');
  if (tirz) {
    if (tirz.includedFormulations.some(f => f.startsWith('30mg'))) {
      errors.push('Tirzepatide membership must not include the 30mg formulation.');
    }
    if (tirz.status === 'active' && tirz.maximumIncludedFormulation !== '15mg') {
      warnings.push('Tirzepatide membership maximum included formulation should be "15mg".');
    }
  }

  const semaMem = memberships.find(m => m.slug === 'semaglutide-membership');
  if (semaMem && semaMem.status === 'active' && semaMem.monthlyPriceCents !== 12500) {
    warnings.push('Semaglutide membership monthly price should be 12500 cents ($125).');
  }

  return { errors, warnings };
}
