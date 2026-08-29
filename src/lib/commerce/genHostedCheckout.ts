import { isOwnerVerifiedGenClientProductId } from '@/data/websiteFamilies';

const GEN_APP_ORIGIN = 'https://app.genhealthehr.com';
const MBM_GEN_CLIENT_ID = 'f5e0mdyBYnDh7HGvek0C';
const MBM_GEN_PRODUCT_PREFIX = `${MBM_GEN_CLIENT_ID}_MoDyAcICE5RDa4DfaeBX_`;

/** Recurring GEN checkout has not yet been production-verified for MBM. */
export const GEN_RECURRING_CHECKOUT_ENABLED = false;

export type GenHostedCheckoutResolution =
  | { ok: true; url: string }
  | {
      ok: false;
      code: 'MISSING_PRODUCT_ID' | 'WRONG_CLIENT' | 'PAIRING_NOT_VERIFIED';
    };

/**
 * Resolve an owner-verified GEN client product to its Product-first checkout.
 *
 * GEN's default product URL is Product-first: payment, then onboarding/intake
 * and visit scheduling when required. Do not append intake_first or visit_first.
 */
export function resolveGenProductFirstCheckout(
  genClientProductId: string | null | undefined,
): GenHostedCheckoutResolution {
  const id = (genClientProductId || '').trim();
  if (!id) return { ok: false, code: 'MISSING_PRODUCT_ID' };
  if (!id.startsWith(MBM_GEN_PRODUCT_PREFIX)) {
    return { ok: false, code: 'WRONG_CLIENT' };
  }
  if (!isOwnerVerifiedGenClientProductId(id)) {
    return { ok: false, code: 'PAIRING_NOT_VERIFIED' };
  }

  return {
    ok: true,
    url: `${GEN_APP_ORIGIN}/${MBM_GEN_CLIENT_ID}/product/${encodeURIComponent(id)}`,
  };
}

/** Top-level navigation is required when MBM is rendered inside Bolt Preview. */
export function navigateToGenProductFirstCheckout(url: string): void {
  const parsed = new URL(url);
  if (parsed.origin !== GEN_APP_ORIGIN || !parsed.pathname.startsWith(`/${MBM_GEN_CLIENT_ID}/product/`)) {
    throw new Error('GEN_CHECKOUT_URL_NOT_ALLOWED');
  }

  try {
    if (window.top && window.top !== window) {
      window.top.location.href = parsed.toString();
      return;
    }
  } catch {
    // Cross-origin frame access may be restricted; continue to explicit _top.
  }

  const link = document.createElement('a');
  link.href = parsed.toString();
  link.target = '_top';
  link.rel = 'noopener noreferrer';
  link.click();
}
