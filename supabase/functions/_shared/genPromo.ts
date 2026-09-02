/** GEN Health promo rules mirrored into MBM's authoritative one-time checkout. */

export const FIRSTTIME_PROMO_CODE = 'FIRSTTIME' as const;
export const OGTBM_PROMO_CODE = 'OGTBM' as const;
export const TEST_PROMO_CODE = 'TEST' as const;
export const TEST_PROMO_RESTRICTED_EMAIL = 'info@thebaremethodmn.com' as const;

export type GenPromoCode = typeof FIRSTTIME_PROMO_CODE | typeof OGTBM_PROMO_CODE | typeof TEST_PROMO_CODE;
export type GenPromoLine = {
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

export function normalizeGenPromoCode(code: string | null | undefined): string {
  return String(code || '').trim().toUpperCase();
}

export function isGenPromoCode(code: string | null | undefined): code is GenPromoCode {
  const normalized = normalizeGenPromoCode(code);
  return normalized === FIRSTTIME_PROMO_CODE || normalized === OGTBM_PROMO_CODE || normalized === TEST_PROMO_CODE;
}

export function isTestPromoEmailAuthorized(email: string | null | undefined): boolean {
  return String(email || '').trim().toLowerCase() === TEST_PROMO_RESTRICTED_EMAIL;
}

export function isGenPromoCartEligible(lines: GenPromoLine[], code?: string | null): boolean {
  const normalizedCode = normalizeGenPromoCode(code);
  return lines.every(line => {
    const productId = String(line.productId || '').trim();
    const sku = String(line.sku || '').trim().toUpperCase();
    const section = String(line.section || '').trim().toLowerCase();
    const category = String(line.category || '').trim().toLowerCase();
    const isMembershipOrSubscription =
      Boolean(line.isMembership) ||
      line.purchaseType === 'membership_program' ||
      productId === 'm1' ||
      productId === 'm2' ||
      sku.startsWith('MBM-MEM-') ||
      line.subscription === true ||
      line.purchaseType === 'auto_refill';
    if (isMembershipOrSubscription) return false;
    if (normalizedCode === TEST_PROMO_CODE) return true;
    return (
      !sku.startsWith('MBM-ACC-') && !sku.startsWith('MBM-PC-') && !sku.startsWith('MBM-SHIP-') &&
      !/^a\d+$/i.test(productId) && !/^pc\d+$/i.test(productId) &&
      section !== 'accessories' && section !== 'provider-care' &&
      category !== 'accessories' && category !== 'provider-care'
    );
  });
}

export function applyGenPromo(input: {
  code?: string | null;
  isAuthenticated?: boolean;
  customerEmail?: string | null;
  lines: GenPromoLine[];
}): { ok: true; code: GenPromoCode; discountCents: number } | { ok: false; reason: string } {
  const code = normalizeGenPromoCode(input.code);
  if (!isGenPromoCode(code)) return { ok: false, reason: 'unknown_code' };
  if (code === FIRSTTIME_PROMO_CODE && !input.isAuthenticated) return { ok: false, reason: 'sign_in_required' };
  if (code === TEST_PROMO_CODE && !isTestPromoEmailAuthorized(input.customerEmail)) return { ok: false, reason: 'email_not_authorized' };
  if (!isGenPromoCartEligible(input.lines, code)) return { ok: false, reason: 'cart_ineligible' };
  const subtotalCents = input.lines.reduce(
    (sum, line) => sum + Math.max(0, Math.trunc(Number(line.unitAmountCents) || 0)) * Math.max(1, Math.trunc(Number(line.quantity) || 0)),
    0,
  );
  const discountCents = code === FIRSTTIME_PROMO_CODE ? Math.min(2500, subtotalCents) : code === OGTBM_PROMO_CODE ? Math.round(subtotalCents * 0.25) : subtotalCents;
  return { ok: true, code, discountCents };
}
