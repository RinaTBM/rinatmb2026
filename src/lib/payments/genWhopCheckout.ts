/**
 * GEN Hosted Checkout → Whop routing policy (pure).
 * Default OFF. Never invent GEN product IDs. SEM/TIRZ membership is not BPC one-time.
 */

export type GenWhopPurchaseMode =
  | 'one_time'
  | 'recurring'
  | 'membership_program'
  | 'unsupported';

export type GenWhopCheckoutMapRow = {
  mbmSku: string;
  genProductId: string;
  genClientProductId: string;
  purchaseMode: GenWhopPurchaseMode;
  retailAmountCents: number;
  currency: string;
  storefrontEligible: boolean;
  checkoutEnabled: boolean;
  membershipRequired: boolean;
  visitRequired?: boolean | null;
  pharmacyName?: string | null;
  active: boolean;
};

export type GenWhopCartLine = {
  mbmSku: string;
  quantity: number;
  purchaseType?: string | null;
  unitAmountCents?: number | null;
};

export type GenWhopCartEvaluation =
  | {
      ok: true;
      route: 'gen_whop';
      lines: Array<GenWhopCartLine & { map: GenWhopCheckoutMapRow }>;
      reason: 'eligible';
    }
  | {
      ok: false;
      route: 'tagada' | 'blocked' | 'unsupported';
      reason: string;
      code: string;
    };

function truthy(v: string | undefined | null): boolean {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'on';
}

/** Server/edge env: GEN_WHOP_CHECKOUT_ENABLED defaults FALSE. */
export function resolveGenWhopCheckoutEnabled(
  env: { GEN_WHOP_CHECKOUT_ENABLED?: string } = {},
): boolean {
  return truthy(env.GEN_WHOP_CHECKOUT_ENABLED);
}

/** Vite UI hint only — never authoritative. */
export function resolveViteGenWhopCheckoutEnabled(
  env: { VITE_GEN_WHOP_CHECKOUT_ENABLED?: string } = {},
): boolean {
  return truthy(env.VITE_GEN_WHOP_CHECKOUT_ENABLED);
}

const ACC_PREFIX = 'MBM-ACC-';
const MEM_PREFIX = 'MBM-MEM-';
const SHIP_PREFIX = 'MBM-SHIP-';
const PC_PREFIX = 'MBM-PC-';

export function isAccessorySku(sku: string): boolean {
  return sku.toUpperCase().startsWith(ACC_PREFIX);
}

export function isMembershipSku(sku: string): boolean {
  return sku.toUpperCase().startsWith(MEM_PREFIX);
}

export function isShippingSku(sku: string): boolean {
  return sku.toUpperCase().startsWith(SHIP_PREFIX);
}

export function isProviderCareSku(sku: string): boolean {
  return sku.toUpperCase().startsWith(PC_PREFIX);
}

/**
 * Evaluate whether a cart should use GEN→Whop hosted checkout.
 * Accessories → Tagada (not GEN).
 * Membership SEM/TIRZ → not supported on this path (do not generalize from BPC).
 * Mixed Rx + accessory → blocked on GEN path (keep Tagada one-time mix until split-checkout designed).
 * Auto-refill / recurring → unsupported until mapped purchase_mode=recurring is owner-approved.
 */
export function evaluateGenWhopCheckoutCart(input: {
  featureEnabled: boolean;
  lines: GenWhopCartLine[];
  mapsBySku: Record<string, GenWhopCheckoutMapRow | undefined>;
}): GenWhopCartEvaluation {
  if (!input.featureEnabled) {
    return { ok: false, route: 'tagada', reason: 'GEN/Whop checkout feature flag is off.', code: 'FLAG_OFF' };
  }

  const lines = (input.lines || []).filter((l) => (l.mbmSku || '').trim() && l.quantity > 0);
  if (!lines.length) {
    return { ok: false, route: 'blocked', reason: 'Cart is empty.', code: 'EMPTY_CART' };
  }

  if (lines.some((l) => isAccessorySku(l.mbmSku))) {
    return {
      ok: false,
      route: 'tagada',
      reason: 'Accessories must use existing Tagada/Kashu checkout — not GEN/Whop.',
      code: 'ACCESSORY_TAGADA',
    };
  }

  if (lines.some((l) => isMembershipSku(l.mbmSku))) {
    return {
      ok: false,
      route: 'unsupported',
      reason:
        'Membership programs (e.g. Semaglutide/Tirzepatide) are not routed through GEN/Whop from the BPC one-time model.',
      code: 'MEMBERSHIP_UNSUPPORTED',
    };
  }

  // Shipping / provider visit lines alone are not a GEN storefront product checkout
  const productLines = lines.filter(
    (l) => !isShippingSku(l.mbmSku) && !isProviderCareSku(l.mbmSku),
  );
  if (!productLines.length) {
    return {
      ok: false,
      route: 'tagada',
      reason: 'No GEN-mappable product lines in cart.',
      code: 'NO_PRODUCT_LINES',
    };
  }

  // v1: single GEN product line only (no multi-SKU GEN session yet)
  if (productLines.length > 1) {
    return {
      ok: false,
      route: 'blocked',
      reason:
        'Mixed multi-product GEN/Whop carts are not supported yet. Checkout Rx products individually or use Tagada where applicable.',
      code: 'MULTI_PRODUCT_BLOCKED',
    };
  }

  // If cart also has accessories we already returned. Provider visit + Rx:
  // visit injection is MBM-side; GEN storefront session is product-only.
  // Allow Rx + IPV/FUV/SHIP in cart for order create, but session maps the single Rx SKU.
  const rxLine = productLines[0];
  const purchaseType = String(rxLine.purchaseType || 'one_time').toLowerCase();
  if (purchaseType === 'auto_refill' || purchaseType === 'membership_program') {
    return {
      ok: false,
      route: 'unsupported',
      reason:
        'Auto-refill / membership purchase types are not enabled on GEN/Whop routing until purchase_mode is owner-verified.',
      code: 'PURCHASE_TYPE_UNSUPPORTED',
    };
  }

  const map = input.mapsBySku[rxLine.mbmSku.toUpperCase()] || input.mapsBySku[rxLine.mbmSku];
  if (!map || !map.active) {
    return {
      ok: false,
      route: 'tagada',
      reason: 'No active GEN/Whop checkout mapping for this SKU — preserve Tagada path.',
      code: 'NO_MAP',
    };
  }

  if (map.membershipRequired || map.purchaseMode === 'membership_program') {
    return {
      ok: false,
      route: 'unsupported',
      reason: 'This SKU requires membership checkout architecture, not one-time GEN/Whop.',
      code: 'MEMBERSHIP_REQUIRED',
    };
  }

  if (map.purchaseMode === 'unsupported') {
    return {
      ok: false,
      route: 'unsupported',
      reason: 'Mapped as unsupported for GEN/Whop checkout.',
      code: 'MAP_UNSUPPORTED',
    };
  }

  if (map.purchaseMode === 'recurring') {
    return {
      ok: false,
      route: 'unsupported',
      reason: 'Recurring GEN/Whop checkout is not enabled yet.',
      code: 'RECURRING_UNSUPPORTED',
    };
  }

  if (!map.checkoutEnabled || !map.storefrontEligible) {
    return {
      ok: false,
      route: 'blocked',
      reason: 'GEN/Whop mapping exists but checkout is not enabled or product is not storefront-eligible.',
      code: 'CHECKOUT_DISABLED',
    };
  }

  if (map.purchaseMode !== 'one_time') {
    return {
      ok: false,
      route: 'unsupported',
      reason: `Unsupported purchase_mode: ${map.purchaseMode}`,
      code: 'MODE_UNSUPPORTED',
    };
  }

  if (!map.genProductId || !map.genClientProductId) {
    return {
      ok: false,
      route: 'blocked',
      reason: 'GEN product IDs missing on mapping row.',
      code: 'MISSING_GEN_IDS',
    };
  }

  return {
    ok: true,
    route: 'gen_whop',
    lines: [{ ...rxLine, map }],
    reason: 'eligible',
  };
}

/** Approved Whop hosted checkout hosts for top-level redirect. */
export function isApprovedWhopCheckoutRedirectUrl(url: string): {
  ok: true;
  url: URL;
} | { ok: false; error: string } {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, error: 'Invalid checkout URL.' };
  }
  if (parsed.protocol !== 'https:') {
    return { ok: false, error: 'Checkout URL must be HTTPS.' };
  }
  const host = parsed.hostname.toLowerCase();
  if (host !== 'whop.com' && host !== 'www.whop.com') {
    return { ok: false, error: 'Checkout host is not an approved Whop host.' };
  }
  if (!parsed.pathname.startsWith('/checkout')) {
    return { ok: false, error: 'Checkout path is not a Whop checkout path.' };
  }
  return { ok: true, url: parsed };
}

export function createCorrelationId(prefix = 'gw'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Idempotency key for one session attempt per unpaid order + SKU. */
export function buildGenWhopIdempotencyKey(input: {
  publicOrderNumber: string;
  mbmSku: string;
}): string {
  return `gen_whop:${input.publicOrderNumber}:${input.mbmSku.toUpperCase()}`;
}

export function isSafeWhopCheckoutUrl(url: string): boolean {
  return isApprovedWhopCheckoutRedirectUrl(url).ok;
}

export function mapDbRowToCheckoutMap(row: Record<string, unknown>): GenWhopCheckoutMapRow {
  return {
    mbmSku: String(row.mbm_sku || ''),
    genProductId: String(row.gen_product_id || ''),
    genClientProductId: String(row.gen_client_product_id || ''),
    purchaseMode: String(row.purchase_mode || 'unsupported') as GenWhopPurchaseMode,
    retailAmountCents: Number(row.retail_amount_cents) || 0,
    currency: String(row.currency || 'USD'),
    storefrontEligible: row.storefront_eligible === true,
    checkoutEnabled: row.checkout_enabled === true,
    membershipRequired: row.membership_required === true,
    visitRequired: typeof row.visit_required === 'boolean' ? row.visit_required : null,
    pharmacyName: typeof row.pharmacy_name === 'string' ? row.pharmacy_name : null,
    active: row.active === true,
  };
}

/**
 * Client-side heuristic only (no GEN IDs, no map rows).
 * Edge + `gen_whop_checkout_map` remain authoritative.
 * When Vite flag is off this is never consulted for routing.
 */
export function cartMayAttemptGenWhopCheckout(lines: GenWhopCartLine[]): boolean {
  const evalWithoutMaps = evaluateGenWhopCheckoutCart({
    featureEnabled: true,
    lines,
    mapsBySku: {},
  });
  // Without maps, evaluate returns NO_MAP for a single one-time Rx — that is still
  // a candidate for the GEN path (Edge will confirm map / checkout_enabled).
  if (!evalWithoutMaps.ok && evalWithoutMaps.code === 'NO_MAP') return true;
  // Accessory / membership / multi-product / purchase-type blocks → do not attempt.
  return false;
}

export type WhopCheckoutNavigationMethod =
  | 'top_href'
  | 'top_assign'
  | 'open_top'
  | 'anchor_top'
  | 'self_assign';

function isEmbeddedInIframe(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.top != null && window.top !== window;
  } catch {
    return true;
  }
}

/** Top-level navigate to Whop hosted checkout (iframe breakout safe). */
export function navigateToWhopHostedCheckout(
  redirectUrl: string,
): { ok: true; method: WhopCheckoutNavigationMethod } | { ok: false; error: string } {
  const approved = isApprovedWhopCheckoutRedirectUrl(redirectUrl);
  if (!approved.ok) return approved;
  const href = approved.url.toString();
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Checkout navigation is unavailable.' };
  }

  if (isEmbeddedInIframe()) {
    try {
      if (window.top) {
        window.top.location.href = href;
        return { ok: true, method: 'top_href' };
      }
    } catch {
      /* continue */
    }
    try {
      if (window.top) {
        window.top.location.assign(href);
        return { ok: true, method: 'top_assign' };
      }
    } catch {
      /* continue */
    }
    try {
      window.open(href, '_top');
      return { ok: true, method: 'open_top' };
    } catch {
      /* continue */
    }
    try {
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.target = '_top';
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      return { ok: true, method: 'anchor_top' };
    } catch {
      return {
        ok: false,
        error:
          'Unable to open Whop checkout from this embedded preview. Open the site in a full browser tab and retry.',
      };
    }
  }

  window.location.assign(href);
  return { ok: true, method: 'self_assign' };
}

export const GEN_WHOP_CHECKOUT_INIT_FAILED_MESSAGE =
  "We couldn't start secure clinical checkout. Please try again or contact us for assistance.";

export const GEN_WHOP_RESULT_PENDING_COPY =
  'Payment is still processing. This page does not confirm payment — we will update your order when payment is verified server-side.';

export const GEN_WHOP_RESULT_CANCEL_COPY =
  'Checkout was cancelled. Your order remains unpaid — you can retry payment from checkout.';
