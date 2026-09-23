import { isOwnerVerifiedGenClientProductId } from '@/data/websiteFamilies';
import { openCareCheckoutWindow } from './careCheckoutWindow';

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
 * Resolve an owner-verified GEN product to its canonical checkout URL.
 * Payment is completed first in GEN Health, followed by intake and provider review.
 * The legacy function name is retained for existing catalog callers.
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

/** Keep MBM open while the customer completes hosted checkout. */
export function navigateToGenProductFirstCheckout(url: string): void {
  openCareCheckoutWindow(url);
}
