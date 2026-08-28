/**
 * Server-side required provider-visit + HRT lab package injection / dedupe helpers.
 * Client cannot omit, remove, or reprice required visit / lab package lines.
 * OGTBM discount is computed server-side when promo code is present.
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
import {
  buildHrtLabPackageLines,
  isLabPackageLine,
  shouldAutoAddHrtLabPackage,
} from './hrtLabPackage';
import { applyOgtbmPromo, isOgtbmPromoCode } from '@/lib/promo/ogtbmPromo';
import { applyMbmtest90Promo, isMbmtest90PromoCode } from '@/lib/promo/mbmtest90Promo';
import { PROVIDER_CARE_FIXED_CENTS } from '@/lib/checkout/checkoutConstants';

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
  requestedDose?: string;
  purchaseType?: string;
  subscription?: boolean;
  isMembership?: boolean;
  slug?: string;
  category?: string;
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
  requiredHrtLabPackage?: boolean;
  shippingIncluded?: boolean;
}

/** Retired add-on (tax-inclusive pricing). NEW orders must persist tax_cents = 0. */
const PROVIDER_CARE_TAX_RATE = 0;

export function stripClientProviderVisitLines(items: RawOrderLine[]): RawOrderLine[] {
  return items.filter(
    i =>
      !isProviderVisitLine({
        productId: typeof i.productId === 'string' ? i.productId : null,
        sku: typeof i.sku === 'string' ? i.sku : null,
      }),
  );
}

/** Client lab package lines are stripped; server re-injects at authoritative prices when required. */
export function stripClientLabPackageLines(items: RawOrderLine[]): RawOrderLine[] {
  return items.filter(
    i =>
      !isLabPackageLine({
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

function authorizeProviderCareUnitCents(productId: string, fallback: number): number {
  const fixed = PROVIDER_CARE_FIXED_CENTS[productId];
  return typeof fixed === 'number' ? fixed : Math.max(0, fallback);
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
  promoCode: string | null;
  hrtLabPackageAdded: boolean;
}

/**
 * Strip client visit/lab lines, evaluate requirement, inject authoritative visit + HRT lab
 * package (once), apply OGTBM when code present, recalculate totals.
 */
export function buildAuthoritativeOrderLines(input: {
  customerUserId: string | null | undefined;
  customerEmail?: string | null;
  items: RawOrderLine[];
  approvedTherapyHistory: ApprovedTherapyHistoryRow[];
  discountCents?: number;
  shippingCents?: number;
  promoCode?: string | null;
  /** Optional client accessory tax; recomputed from accessory lines when possible. */
  accessorySalesTaxRate?: number;
}): AuthoritativeOrderBuildResult {
  const strippedVisits = stripClientProviderVisitLines(input.items);
  const stripped = stripClientLabPackageLines(strippedVisits);
  const prescriptionLines = toPrescriptionLines(stripped);
  const requirement = determineProviderRequirement({
    customerUserId: input.customerUserId,
    prescriptionLines,
    approvedTherapyHistory: input.approvedTherapyHistory,
  });

  const baseLines: InjectedOrderLine[] = stripped.map(i => {
    const qty = Math.max(1, Number(i.quantity) || 1);
    const productId = String(i.productId || '');
    let unit = Math.max(0, Number(i.unitAmountCents) || 0);
    // Authoritative Provider Care prices (including Lab Review / Lab Kit if somehow present).
    if (/^pc\d+$/i.test(productId) || String(i.section || '') === 'provider-care') {
      unit = authorizeProviderCareUnitCents(productId, unit);
    }
    return {
      ...i,
      productId,
      productName: String(i.productName || 'Item'),
      quantity: qty,
      unitAmountCents: unit,
      sku: typeof i.sku === 'string' ? i.sku : '',
      section: typeof i.section === 'string' ? i.section : '',
    };
  });

  const visitLine = buildRequiredVisitLine(requirement.requirement);
  let items: InjectedOrderLine[] = visitLine ? [...baseLines, visitLine] : [...baseLines];

  let hrtLabPackageAdded = false;
  if (
    shouldAutoAddHrtLabPackage({
      items,
      approvedTherapyHistory: input.approvedTherapyHistory,
    })
  ) {
    const labLines = buildHrtLabPackageLines({ items });
    if (labLines.length) {
      items = [...items, ...labLines];
      hrtLabPackageAdded = true;
    }
  }

  const subtotalCents = items.reduce(
    (sum, i) => sum + i.unitAmountCents * Math.max(1, i.quantity),
    0,
  );

  // OGTBM and MBMTEST90 are server-authoritative when code is present. Otherwise clamp client discount
  // (member/auto-refill savings already baked into unit prices — typically 0 here).
  let discountCents = 0;
  let promoCode: string | null = null;
  const promoItems = items.map(i => ({
    productId: i.productId,
    sku: i.sku,
    purchaseType: typeof i.purchaseType === 'string' ? i.purchaseType : null,
    isMembership: Boolean(i.isMembership) || i.purchaseType === 'membership_program',
    subscription: i.subscription === true,
  }));
  const ogtbm = applyOgtbmPromo({
    code: input.promoCode,
    lines: items.map(i => ({
      productId: i.productId,
      sku: i.sku,
      section: i.section,
      category: typeof i.category === 'string' ? i.category : i.section,
      purchaseType: typeof i.purchaseType === 'string' ? i.purchaseType : null,
      isMembership: Boolean(i.isMembership) || i.purchaseType === 'membership_program',
      subscription: i.subscription === true,
      quantity: i.quantity,
      unitAmountCents: i.unitAmountCents,
    })),
  });

  const shippingCents = Math.max(0, Number(input.shippingCents) || 0);

  const mbmtest90 = applyMbmtest90Promo({
    code: input.promoCode,
    customerEmail: input.customerEmail,
    subtotalCents,
    shippingCents,
    items: promoItems,
  });
  if (ogtbm.ok) {
    promoCode = ogtbm.code;
    discountCents = Math.min(ogtbm.discountCents, subtotalCents);
  } else if (mbmtest90.ok) {
    promoCode = mbmtest90.code;
    discountCents = mbmtest90.discountCents;
  } else {
    discountCents = Math.max(
      0,
      Math.min(Number(input.discountCents) || 0, subtotalCents),
    );
    // Never trust a client-claimed promo amount without the code path above.
    if (isOgtbmPromoCode(input.promoCode) || isMbmtest90PromoCode(input.promoCode)) {
      discountCents = 0;
    }
  }

  const providerCareSubtotal = items
    .filter(i => i.section === 'provider-care' || /^pc\d+$/i.test(i.productId))
    .reduce((sum, i) => sum + i.unitAmountCents * i.quantity, 0);
  const providerCareTaxCents = Math.round(providerCareSubtotal * PROVIDER_CARE_TAX_RATE);

  const accessoryRate = 0;
  void input.accessorySalesTaxRate;
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
    promoCode,
    hrtLabPackageAdded,
  };
}
