/**
 * Authoritative provider-visit product constants.
 * Prices/SKUs must match storefront catalog — do not accept client overrides.
 */

export const INITIAL_PROVIDER_VISIT = {
  productId: 'pc1',
  variantId: 'initial-provider-consultation-v1',
  sku: 'MBM-PC-IPV-SRV-001',
  name: 'Initial Provider Visit',
  priceCents: 7500,
  section: 'provider-care',
} as const;

export const FOLLOW_UP_PROVIDER_VISIT = {
  productId: 'pc2',
  variantId: 'follow-up-appointment-v1',
  sku: 'MBM-PC-FUV-SRV-001',
  name: 'Follow-Up Visit',
  priceCents: 5500,
  section: 'provider-care',
} as const;

export const PROVIDER_VISIT_SKUS = new Set<string>([
  INITIAL_PROVIDER_VISIT.sku,
  FOLLOW_UP_PROVIDER_VISIT.sku,
]);

export const PROVIDER_VISIT_PRODUCT_IDS = new Set<string>([
  INITIAL_PROVIDER_VISIT.productId,
  FOLLOW_UP_PROVIDER_VISIT.productId,
]);

export type ProviderRequirementKind = 'INITIAL' | 'FOLLOW_UP' | 'NONE' | 'NEW_THERAPY';

export type ProviderWorkflowStatus =
  | 'NOT_REQUIRED'
  | 'MANUAL_ACTION_REQUIRED'
  | 'COMPLETED'
  | 'ERROR';

export function visitForRequirement(requirement: ProviderRequirementKind) {
  if (requirement === 'NONE') return null;
  if (requirement === 'FOLLOW_UP') return FOLLOW_UP_PROVIDER_VISIT;
  // INITIAL and NEW_THERAPY both bill Initial Provider Visit unless a separate product is defined.
  return INITIAL_PROVIDER_VISIT;
}

export function customerCopyForRequirement(requirement: ProviderRequirementKind): {
  title: string;
  detail: string;
  priceLabel: string;
} | null {
  if (requirement === 'NONE') {
    return {
      title: 'No provider visit required',
      detail: 'No provider visit required for this same-treatment, same-option reorder.',
      priceLabel: '',
    };
  }
  if (requirement === 'FOLLOW_UP') {
    return {
      title: 'Provider Follow-Up — $55',
      detail: 'Required because your selected treatment option has changed.',
      priceLabel: '$55.00',
    };
  }
  if (requirement === 'NEW_THERAPY') {
    return {
      title: 'Initial Provider Visit — $75',
      detail: 'Required because this is a new treatment for you.',
      priceLabel: '$75.00',
    };
  }
  return {
    title: 'Initial Provider Visit — $75',
    detail: 'Required for your first order for this treatment.',
    priceLabel: '$75.00',
  };
}

export function isProviderVisitLine(input: {
  productId?: string | null;
  sku?: string | null;
}): boolean {
  const productId = input.productId?.trim() || '';
  const sku = input.sku?.trim() || '';
  return PROVIDER_VISIT_PRODUCT_IDS.has(productId) || PROVIDER_VISIT_SKUS.has(sku);
}
