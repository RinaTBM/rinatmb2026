/**
 * OGTBM promo — $50 off EACH eligible item (quantity-aware).
 * NOT $50 off the order. Never discounts below $0.
 *
 * EXCLUDED (structured data — not display-name matching):
 * - accessories (category / productId a*)
 * - dermatology / prescription-skin-hair
 * - provider care (pc*, IPV/FUV/Lab Review/Lab Kit)
 * - memberships (m1/m2, membership_program)
 * - shipping (MBM-SHIP-*, shipping_cents)
 *
 * NEVER applies to Tagada recurring membership combo rebills.
 */

import type { Category } from '@/data/products';

export const OGTBM_PROMO_CODE = 'OGTBM' as const;
export const OGTBM_DISCOUNT_PER_ELIGIBLE_UNIT_CENTS = 5000 as const;
export const MBM_TEST_90_PROMO_CODE = 'MBMTEST90' as const;
export const MBM_TEST_90_EMAIL = 'info@thebaremethodmn.com' as const;
export const MBM_TEST_90_EXPIRES_AT = '2026-09-01T06:00:00.000Z' as const;

/** Categories that never receive OGTBM. */
export const OGTBM_EXCLUDED_CATEGORIES: ReadonlySet<Category | string> = new Set([
  'accessories',
  'prescription-skin-hair',
  'provider-care',
]);

export type OgtbmLineInput = {
  productId?: string | null;
  sku?: string | null;
  section?: string | null;
  category?: string | null;
  purchaseType?: string | null;
  isMembership?: boolean;
  quantity: number;
  /** Pre-promo unit price in cents (member/auto-refill already applied if any). */
  unitAmountCents: number;
};

export type OgtbmLineResult = {
  eligible: boolean;
  quantity: number;
  unitAmountCents: number;
  discountPerUnitCents: number;
  lineDiscountCents: number;
  reason:
    | 'eligible'
    | 'membership'
    | 'accessory'
    | 'dermatology'
    | 'provider_care'
    | 'shipping'
    | 'lab_package'
    | 'zero_price'
    | 'invalid_qty';
};

export type OgtbmApplyResult = {
  code: typeof OGTBM_PROMO_CODE;
  ok: true;
  discountCents: number;
  eligibleUnitCount: number;
  lines: OgtbmLineResult[];
};

const SHIPPING_SKUS = new Set(['MBM-SHIP-TWO-DAY-001', 'MBM-SHIP-NEXT-DAY-001']);
const LAB_PACKAGE_SKUS = new Set(['MBM-PC-LAB-SRV-001', 'MBM-PC-LAB-KIT-001']);
const LAB_PACKAGE_PRODUCT_IDS = new Set(['pc3', 'pc4']);
const PROVIDER_CARE_SKUS = new Set([
  'MBM-PC-IPV-SRV-001',
  'MBM-PC-FUV-SRV-001',
  'MBM-PC-LAB-SRV-001',
  'MBM-PC-LAB-KIT-001',
]);

export function normalizePromoCode(code: string | null | undefined): string {
  return String(code || '')
    .trim()
    .toUpperCase();
}

export function isOgtbmPromoCode(code: string | null | undefined): boolean {
  return normalizePromoCode(code) === OGTBM_PROMO_CODE;
}

export function isMbmTest90PromoCode(code: string | null | undefined): boolean {
  return normalizePromoCode(code) === MBM_TEST_90_PROMO_CODE;
}

export function applyMbmTest90Promo(input: {
  code?: string | null;
  customerEmail?: string | null;
  lines: OgtbmLineInput[];
  now?: Date;
}) {
  if (!isMbmTest90PromoCode(input.code)) return { ok: false as const, reason: 'not_test_code' as const };
  if (String(input.customerEmail || '').trim().toLowerCase() !== MBM_TEST_90_EMAIL) {
    return { ok: false as const, reason: 'email_not_allowed' as const };
  }
  if ((input.now ?? new Date()).getTime() >= Date.parse(MBM_TEST_90_EXPIRES_AT)) {
    return { ok: false as const, reason: 'expired' as const };
  }
  let discountCents = 0;
  let eligibleUnitCount = 0;
  for (const line of input.lines) {
    const purchaseType = String(line.purchaseType || '');
    if (purchaseType === 'auto_refill' || purchaseType === 'membership_program') continue;
    const gate = isOgtbmEligibleLine(line);
    const qty = Math.max(0, Math.trunc(Number(line.quantity) || 0));
    const unit = Math.max(0, Math.trunc(Number(line.unitAmountCents) || 0));
    if (!gate.eligible || qty < 1 || unit < 1) continue;
    discountCents += Math.round(unit * 0.9) * qty;
    eligibleUnitCount += qty;
  }
  return { ok: true as const, code: MBM_TEST_90_PROMO_CODE, discountCents, eligibleUnitCount };
}

export function isOgtbmEligibleLine(input: {
  productId?: string | null;
  sku?: string | null;
  section?: string | null;
  category?: string | null;
  purchaseType?: string | null;
  isMembership?: boolean;
}): { eligible: false; reason: OgtbmLineResult['reason'] } | { eligible: true; reason: 'eligible' } {
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
  return Math.min(OGTBM_DISCOUNT_PER_ELIGIBLE_UNIT_CENTS, unit);
}

export function evaluateOgtbmLine(line: OgtbmLineInput): OgtbmLineResult {
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
  const gate = isOgtbmEligibleLine(line);
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
 * Authoritative OGTBM discount for a cart/order.
 * Returns 0 when code is absent/invalid. Does not stack with itself.
 */
export function applyOgtbmPromo(input: {
  code?: string | null;
  lines: OgtbmLineInput[];
}): OgtbmApplyResult | { ok: false; reason: 'not_ogtbm' } {
  if (!isOgtbmPromoCode(input.code)) {
    return { ok: false, reason: 'not_ogtbm' };
  }
  const lines = input.lines.map(evaluateOgtbmLine);
  const discountCents = lines.reduce((sum, l) => sum + l.lineDiscountCents, 0);
  const eligibleUnitCount = lines.reduce(
    (sum, l) => sum + (l.eligible ? l.quantity : 0),
    0,
  );
  return {
    ok: true,
    code: OGTBM_PROMO_CODE,
    discountCents,
    eligibleUnitCount,
    lines,
  };
}

/** Membership recurring amounts must never be altered by OGTBM. */
export function assertOgtbmDoesNotAlterMembershipRebill(input: {
  monthlyAmountCents: number;
  expectedMonthlyAmountCents: number;
}): boolean {
  return (
    Math.trunc(input.monthlyAmountCents) === Math.trunc(input.expectedMonthlyAmountCents)
  );
}
