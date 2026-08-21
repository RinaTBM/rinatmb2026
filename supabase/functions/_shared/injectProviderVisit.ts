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
} from './determineProviderRequirement.ts';
import {
  isProviderVisitLine,
  visitForRequirement,
  type ProviderRequirementKind,
} from './providerVisits.ts';
import { isProviderGuidedPrescriptionLine } from './therapyFamilies.ts';
import {
  buildHrtLabPackageLines,
  isLabPackageLine,
  shouldAutoAddHrtLabPackage,
} from './hrtLabPackage.ts';
import { applyOgtbmPromo, isOgtbmPromoCode } from './ogtbmPromo.ts';
const PROVIDER_CARE_FIXED_CENTS: Record<string, number> = {
  pc1: 7500,
  pc2: 5500,
  pc3: 6000,
  pc4: 20000,
};

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
  shippingMethod?: string;
  shippingError?: string;
}

/**
 * Strip client visit/lab lines, evaluate requirement, inject authoritative visit + HRT lab
 * package (once), apply OGTBM when code present, recalculate totals.
 */
export function buildAuthoritativeOrderLines(input: {
  customerUserId: string | null | undefined;
  items: RawOrderLine[];
  approvedTherapyHistory: ApprovedTherapyHistoryRow[];
  discountCents?: number;
  shippingCents?: number;
  /** Customer-selected method: two_day | next_day (free_over_500 derived server-side). */
  shippingMethod?: string | null;
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

  // OGTBM is server-authoritative when code is present. Otherwise clamp client discount
  // (member/auto-refill savings already baked into unit prices — typically 0 here).
  let discountCents = 0;
  let promoCode: string | null = null;
  const ogtbm = applyOgtbmPromo({
    code: input.promoCode,
    lines: items.map(i => ({
      productId: i.productId,
      sku: i.sku,
      section: i.section,
      category: typeof i.category === 'string' ? i.category : i.section,
      purchaseType: typeof i.purchaseType === 'string' ? i.purchaseType : null,
      isMembership: Boolean(i.isMembership) || i.purchaseType === 'membership_program',
      quantity: i.quantity,
      unitAmountCents: i.unitAmountCents,
    })),
  });
  if (ogtbm.ok) {
    promoCode = ogtbm.code;
    discountCents = Math.min(ogtbm.discountCents, subtotalCents);
  } else {
    discountCents = Math.max(
      0,
      Math.min(Number(input.discountCents) || 0, subtotalCents),
    );
    // Never trust a client-claimed OGTBM amount without the code path above.
    if (isOgtbmPromoCode(input.promoCode)) {
      discountCents = 0;
    }
  }

  // Phase 12F: authorize shipping server-side (0 / 3000 / 5000). Never trust client cents alone.
  const shipAuth = authorizeInvoiceShippingCents({
    shippingMethod: input.shippingMethod,
    clientShippingCents: Number(input.shippingCents) || 0,
    items,
  });
  if (!shipAuth.ok) {
    return {
      items,
      requirement,
      subtotalCents,
      providerCareTaxCents: 0,
      accessorySalesTaxCents: 0,
      taxCents: 0,
      totalCents: 0,
      discountCents,
      shippingCents: 0,
      promoCode,
      hrtLabPackageAdded,
      shippingError: shipAuth.error,
    };
  }
  const shippingCents = shipAuth.shippingCents;

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
    shippingMethod: shipAuth.shippingMethod,
  };
}

const TWO_DAY_SHIPPING_CENTS = 3000;
const NEXT_DAY_SHIPPING_CENTS = 5000;
const FREE_SHIPPING_THRESHOLD_CENTS = 50000;

/**
 * Server-authoritative shipping for invoice orders.
 * Matches website policy: Two-Day $30, Next-Day $50, free at $500+ eligible merchandise.
 * Membership value does not count toward free shipping.
 */
export function authorizeInvoiceShippingCents(input: {
  shippingMethod?: string | null;
  clientShippingCents: number;
  items: InjectedOrderLine[];
}):
  | { ok: true; shippingCents: number; shippingMethod: string }
  | { ok: false; error: string } {
  const containsMembership = input.items.some(
    (i) =>
      i.purchaseType === 'membership_program' ||
      i.isMembership === true ||
      i.productId === 'm1' ||
      i.productId === 'm2' ||
      (typeof i.sku === 'string' && i.sku.toUpperCase().startsWith('MBM-MEM-')),
  );

  const requiresPhysicalShipping = input.items.some((i) => {
    if (i.section === 'provider-care' || /^pc\d+$/i.test(i.productId)) return false;
    return true;
  });

  if (!requiresPhysicalShipping) {
    if (Math.round(input.clientShippingCents) !== 0) {
      return { ok: false, error: 'Physical shipping is not applicable to this order.' };
    }
    return { ok: true, shippingCents: 0, shippingMethod: 'none' };
  }

  // Eligible merchandise for free-ship threshold excludes membership program lines.
  const shippableSubtotal = input.items
    .filter((i) => {
      if (i.purchaseType === 'membership_program' || i.isMembership) return false;
      if (i.productId === 'm1' || i.productId === 'm2') return false;
      if (typeof i.sku === 'string' && i.sku.toUpperCase().startsWith('MBM-MEM-')) return false;
      if (i.section === 'provider-care' || /^pc\d+$/i.test(i.productId)) return false;
      return true;
    })
    .reduce((sum, i) => sum + i.unitAmountCents * Math.max(1, i.quantity), 0);

  const methodIn = (input.shippingMethod || '').trim();
  if (methodIn === 'standard') {
    return {
      ok: false,
      error:
        'Unsupported shipping method: standard. Approved methods are two_day ($30) and next_day ($50).',
    };
  }

  const free = shippableSubtotal >= FREE_SHIPPING_THRESHOLD_CENTS;
  let method: string;
  if (free) {
    method = 'free_over_500';
  } else if (methodIn === 'next_day') {
    method = 'next_day';
  } else if (methodIn === 'two_day') {
    method = 'two_day';
  } else if (!methodIn || methodIn === 'none') {
    if (containsMembership) {
      return {
        ok: false,
        error: 'Membership checkout requires a shipping method: two_day ($30) or next_day ($50).',
      };
    }
    method = 'two_day';
  } else if (methodIn === 'free_over_500') {
    return {
      ok: false,
      error:
        'Free shipping requires $500 or more in eligible ordinary merchandise (membership value does not count).',
    };
  } else if (methodIn === 'demo_store_forced_shipping') {
    // Staging Demo-only QA method — not a customer-facing website option.
    return {
      ok: false,
      error: 'Unsupported shipping method for storefront checkout.',
    };
  } else {
    return { ok: false, error: `Unsupported shipping method: ${methodIn}` };
  }

  const authorized = free ? 0 : method === 'next_day' ? NEXT_DAY_SHIPPING_CENTS : TWO_DAY_SHIPPING_CENTS;
  // Demo Tagada shipping (1156) and any non-MBM amount must never pass.
  if (Math.round(input.clientShippingCents) === 1156) {
    return {
      ok: false,
      error: 'Unsupported shipping amount. Only $0, $30 (Two-Day), or $50 (Next-Day) are authorized.',
    };
  }
  if (Math.round(input.clientShippingCents) !== authorized) {
    return {
      ok: false,
      error: `Shipping amount mismatch (authorized ${authorized} cents for ${method}).`,
    };
  }
  return { ok: true, shippingCents: authorized, shippingMethod: method };
}
