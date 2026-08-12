/**
 * Server-side required provider-visit line injection / dedupe helpers.
 * Client cannot omit, remove, or reprice the required visit.
 */

import {
  determineProviderRequirement,
  type ApprovedTherapyHistoryRow,
  type PrescriptionLineInput,
  type ProviderRequirementResult,
} from './determineProviderRequirement';
import {
  isProviderVisitLine,
  visitForRequirement,
  type ProviderRequirementKind,
} from './providerVisits';
import { isProviderGuidedPrescriptionLine } from './therapyFamilies';

export interface RawOrderLine {
  productId?: string;
  productName?: string;
  quantity?: number;
  unitAmountCents?: number;
  variantId?: string;
  variantLabel?: string;
  sku?: string;
  fulfillmentSku?: string;
  section?: string;
  membershipSlug?: string;
  requestedFormulation?: string;
  purchaseType?: string;
  subscription?: boolean;
  isMembership?: boolean;
  slug?: string;
  [key: string]: unknown;
}

export interface InjectedOrderLine extends RawOrderLine {
  productId: string;
  productName: string;
  quantity: number;
  unitAmountCents: number;
  variantId?: string;
  variantLabel?: string;
  sku: string;
  section: string;
  requiredProviderVisit?: boolean;
}

const PROVIDER_CARE_TAX_RATE = 0.018;

export function stripClientProviderVisitLines(items: RawOrderLine[]): RawOrderLine[] {
  return items.filter(
    i =>
      !isProviderVisitLine({
        productId: typeof i.productId === 'string' ? i.productId : null,
        sku: typeof i.sku === 'string' ? i.sku : null,
      }),
  );
}

export function toPrescriptionLines(items: RawOrderLine[]): PrescriptionLineInput[] {
  const lines: PrescriptionLineInput[] = [];
  for (const i of items) {
    const productId = typeof i.productId === 'string' ? i.productId : '';
    if (!productId) continue;
    const isMembership =
      Boolean(i.isMembership) ||
      i.purchaseType === 'membership_program' ||
      productId === 'm1' ||
      productId === 'm2';
    const slug =
      (typeof i.membershipSlug === 'string' && i.membershipSlug) ||
      (typeof i.slug === 'string' && i.slug) ||
      undefined;
    if (
      !isProviderGuidedPrescriptionLine({
        productId,
        slug,
        section: typeof i.section === 'string' ? i.section : null,
        isMembership,
        purchaseType: typeof i.purchaseType === 'string' ? i.purchaseType : null,
      })
    ) {
      continue;
    }
    lines.push({
      productId,
      slug,
      sku: typeof i.sku === 'string' ? i.sku : null,
      fulfillmentSku: typeof i.fulfillmentSku === 'string' ? i.fulfillmentSku : null,
      variantId: typeof i.variantId === 'string' ? i.variantId : null,
      isMembership,
      purchaseType: typeof i.purchaseType === 'string' ? i.purchaseType : null,
      productName: typeof i.productName === 'string' ? i.productName : undefined,
    });
  }
  return lines;
}

export function buildRequiredVisitLine(
  requirement: ProviderRequirementKind,
): InjectedOrderLine | null {
  const visit = visitForRequirement(requirement);
  if (!visit) return null;
  return {
    productId: visit.productId,
    productName: visit.name,
    quantity: 1,
    unitAmountCents: visit.priceCents,
    variantId: visit.variantId,
    variantLabel: '1 session',
    sku: visit.sku,
    section: visit.section,
    requiredProviderVisit: true,
  };
}

export interface AuthoritativeOrderBuildResult {
  items: InjectedOrderLine[];
  requirement: ProviderRequirementResult;
  subtotalCents: number;
  providerCareTaxCents: number;
  accessorySalesTaxCents: number;
  taxCents: number;
  totalCents: number;
  discountCents: number;
  shippingCents: number;
}

/**
 * Strip client visit lines, evaluate requirement, inject authoritative visit, recalculate totals.
 * Client unit prices for non-visit lines are trusted for this phase (catalog already priced).
 * Provider visit price is always server-authoritative.
 */
export function buildAuthoritativeOrderLines(input: {
  customerUserId: string | null | undefined;
  items: RawOrderLine[];
  approvedTherapyHistory: ApprovedTherapyHistoryRow[];
  discountCents?: number;
  shippingCents?: number;
  /** Optional client accessory tax; recomputed from accessory lines when possible. */
  accessorySalesTaxRate?: number;
}): AuthoritativeOrderBuildResult {
  const stripped = stripClientProviderVisitLines(input.items);
  const prescriptionLines = toPrescriptionLines(stripped);
  const requirement = determineProviderRequirement({
    customerUserId: input.customerUserId,
    prescriptionLines,
    approvedTherapyHistory: input.approvedTherapyHistory,
  });

  const baseLines: InjectedOrderLine[] = stripped.map(i => {
    const qty = Math.max(1, Number(i.quantity) || 1);
    // Never trust client price for provider visits (already stripped); keep other lines.
    const unit = Math.max(0, Number(i.unitAmountCents) || 0);
    return {
      ...i,
      productId: String(i.productId || ''),
      productName: String(i.productName || 'Item'),
      quantity: qty,
      unitAmountCents: unit,
      sku: typeof i.sku === 'string' ? i.sku : '',
      section: typeof i.section === 'string' ? i.section : '',
    };
  });

  const visitLine = buildRequiredVisitLine(requirement.requirement);
  const items = visitLine ? [...baseLines, visitLine] : baseLines;

  const subtotalCents = items.reduce(
    (sum, i) => sum + i.unitAmountCents * Math.max(1, i.quantity),
    0,
  );
  const discountCents = Math.max(
    0,
    Math.min(Number(input.discountCents) || 0, subtotalCents),
  );
  const shippingCents = Math.max(0, Number(input.shippingCents) || 0);

  const providerCareSubtotal = items
    .filter(i => i.section === 'provider-care' || /^pc\d+$/i.test(i.productId))
    .reduce((sum, i) => sum + i.unitAmountCents * i.quantity, 0);
  const providerCareTaxCents = Math.round(providerCareSubtotal * PROVIDER_CARE_TAX_RATE);

  const accessoryRate = input.accessorySalesTaxRate ?? 0.08;
  const accessorySubtotal = items
    .filter(i => i.section === 'accessories' || /^a\d+/i.test(i.productId))
    .reduce((sum, i) => sum + i.unitAmountCents * i.quantity, 0);
  const accessorySalesTaxCents = Math.round(accessorySubtotal * accessoryRate);

  const taxCents = providerCareTaxCents + accessorySalesTaxCents;
  const totalCents = subtotalCents - discountCents + shippingCents + taxCents;

  return {
    items,
    requirement,
    subtotalCents,
    providerCareTaxCents,
    accessorySalesTaxCents,
    taxCents,
    totalCents,
    discountCents,
    shippingCents,
  };
}
