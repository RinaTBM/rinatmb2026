/**
 * MBMTEST90 promo — 90% off EACH eligible one-time prescription medication unit.
 * Restricted to info@thebaremethodmn.com. Shipping remains full price.
 *
 * EXCLUDED (structured data — not display-name matching):
 * - subscriptions / auto-refill (purchaseType auto_refill, subscription true)
 * - accessories (category / productId a*)
 * - provider care (pc*, IPV/FUV/Lab Review/Lab Kit)
 * - dermatology / prescription-skin-hair
 * - memberships (m1/m2, membership_program)
 * - shipping (MBM-SHIP-*, shipping_cents)
 *
 * Only one-time prescription medications are eligible.
 * Never applies to Tagada recurring membership combo rebills.
 */

export const MBMTEST90_PROMO_CODE = 'MBMTEST90' as const;
export const MBMTEST90_DISCOUNT_RATE = 0.9 as const;
export const MBMTEST90_RESTRICTED_EMAIL = 'info@thebaremethodmn.com' as const;

const SHIPPING_SKUS = new Set(['MBM-SHIP-TWO-DAY-001', 'MBM-SHIP-NEXT-DAY-001']);
const LAB_PACKAGE_SKUS = new Set(['MBM-PC-LAB-SRV-001', 'MBM-PC-LAB-KIT-001']);
const LAB_PACKAGE_PRODUCT_IDS = new Set(['pc3', 'pc4']);
const PROVIDER_CARE_SKUS = new Set([
  'MBM-PC-IPV-SRV-001',
  'MBM-PC-FUV-SRV-001',
  'MBM-PC-LAB-SRV-001',
  'MBM-PC-LAB-KIT-001',
]);

export type Mbmtest90LineInput = {
  productId?: string | null;
  sku?: string | null;
  section?: string | null;
  category?: string | null;
  purchaseType?: string | null;
  isMembership?: boolean;
  subscription?: boolean;
  quantity: number;
  unitAmountCents: number;
};

export type Mbmtest90LineResult = {
  eligible: boolean;
  quantity: number;
  unitAmountCents: number;
  discountPerUnitCents: number;
  lineDiscountCents: number;
  reason:
    | 'eligible'
    | 'membership'
    | 'subscription'
    | 'accessory'
    | 'dermatology'
    | 'provider_care'
    | 'shipping'
    | 'lab_package'
    | 'zero_price'
    | 'invalid_qty';
};

export type Mbmtest90ApplyResult = {
  code: typeof MBMTEST90_PROMO_CODE;
  ok: true;
  discountCents: number;
  eligibleUnitCount: number;
  lines: Mbmtest90LineResult[];
};

export function normalizePromoCode(code: string | null | undefined): string {
  return String(code || '')
    .trim()
    .toUpperCase();
}

export function isMbmtest90PromoCode(code: string | null | undefined): boolean {
  return normalizePromoCode(code) === MBMTEST90_PROMO_CODE;
}

export function isMbmtest90EmailAuthorized(email: string | null | undefined): boolean {
  return String(email || '')
    .trim()
    .toLowerCase() === MBMTEST90_RESTRICTED_EMAIL;
}

export function isMbmtest90EligibleLine(input: {
  productId?: string | null;
  sku?: string | null;
  section?: string | null;
  category?: string | null;
  purchaseType?: string | null;
  isMembership?: boolean;
  subscription?: boolean;
}): { eligible: false; reason: Mbmtest90LineResult['reason'] } | { eligible: true; reason: 'eligible' } {
  const productId = String(input.productId || '').trim();
  const sku = String(input.sku || '').trim().toUpperCase();
  const section = String(input.section || '').trim().toLowerCase();
  const category = String(input.category || section || '').trim().toLowerCase();
  const isMembership =
    Boolean(input.isMembership) ||
    input.purchaseType === 'membership_program' ||
    productId === 'm1' ||
    productId === 'm2' ||
    sku.startsWith('MBM-MEM-');

  if (isMembership) return { eligible: false, reason: 'membership' };
  if (input.subscription === true || input.purchaseType === 'auto_refill') {
    return { eligible: false, reason: 'subscription' };
  }
  if (SHIPPING_SKUS.has(sku) || sku.startsWith('MBM-SHIP-')) {
    return { eligible: false, reason: 'shipping' };
  }
  if (
    LAB_PACKAGE_SKUS.has(sku) ||
    LAB_PACKAGE_PRODUCT_IDS.has(productId) ||
    productId === 'pc3' ||
    productId === 'pc4'
  ) {
    return { eligible: false, reason: 'lab_package' };
  }
  if (
    section === 'provider-care' ||
    category === 'provider-care' ||
    /^pc\d+$/i.test(productId) ||
    PROVIDER_CARE_SKUS.has(sku)
  ) {
    return { eligible: false, reason: 'provider_care' };
  }
  if (
    section === 'accessories' ||
    category === 'accessories' ||
    /^a\d+/i.test(productId) ||
    sku.startsWith('MBM-ACC-')
  ) {
    return { eligible: false, reason: 'accessory' };
  }
  if (
    section === 'prescription-skin-hair' ||
    category === 'prescription-skin-hair' ||
    sku.startsWith('MBM-SH-')
  ) {
    return { eligible: false, reason: 'dermatology' };
  }
  return { eligible: true, reason: 'eligible' };
}

export function discountForEligibleUnit(unitAmountCents: number): number {
  const unit = Math.max(0, Math.trunc(unitAmountCents));
  return Math.round(unit * MBMTEST90_DISCOUNT_RATE);
}

export function evaluateMbmtest90Line(line: Mbmtest90LineInput): Mbmtest90LineResult {
  const qty = Math.trunc(Number(line.quantity) || 0);
  const unitAmountCents = Math.max(0, Math.trunc(Number(line.unitAmountCents) || 0));
  if (!Number.isInteger(qty) || qty < 1) {
    return {
      eligible: false,
      quantity: Math.max(0, qty),
      unitAmountCents,
      discountPerUnitCents: 0,
      lineDiscountCents: 0,
      reason: 'invalid_qty',
    };
  }
  if (unitAmountCents <= 0) {
    return {
      eligible: false,
      quantity: qty,
      unitAmountCents,
      discountPerUnitCents: 0,
      lineDiscountCents: 0,
      reason: 'zero_price',
    };
  }
  const gate = isMbmtest90EligibleLine(line);
  if (!gate.eligible) {
    return {
      eligible: false,
      quantity: qty,
      unitAmountCents,
      discountPerUnitCents: 0,
      lineDiscountCents: 0,
      reason: gate.reason,
    };
  }
  const discountPerUnitCents = discountForEligibleUnit(unitAmountCents);
  return {
    eligible: true,
    quantity: qty,
    unitAmountCents,
    discountPerUnitCents,
    lineDiscountCents: discountPerUnitCents * qty,
    reason: 'eligible',
  };
}

/**
 * Authoritative MBMTEST90 discount for a cart/order.
 * Returns 0 when code is absent/invalid or email not authorized.
 * Does not stack with itself or OGTBM.
 */
export function applyMbmtest90Promo(input: {
  code?: string | null;
  customerEmail?: string | null;
  lines: Mbmtest90LineInput[];
}): Mbmtest90ApplyResult | { ok: false; reason: 'not_mbmtest90' | 'email_not_authorized' } {
  if (!isMbmtest90PromoCode(input.code)) {
    return { ok: false, reason: 'not_mbmtest90' };
  }
  if (!isMbmtest90EmailAuthorized(input.customerEmail)) {
    return { ok: false, reason: 'email_not_authorized' };
  }
  const lines = input.lines.map(evaluateMbmtest90Line);
  const discountCents = lines.reduce((sum, l) => sum + l.lineDiscountCents, 0);
  const eligibleUnitCount = lines.reduce(
    (sum, l) => sum + (l.eligible ? l.quantity : 0),
    0,
  );
  return {
    ok: true,
    code: MBMTEST90_PROMO_CODE,
    discountCents,
    eligibleUnitCount,
    lines,
  };
}
