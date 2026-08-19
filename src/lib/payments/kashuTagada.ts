/**
 * Kashu / TagadaPay helpers (processor-neutral card path).
 * Pure functions — unit-testable; shared concepts with Edge Functions.
 *
 * Official docs (source of truth):
 * - https://docs.tagada.io/
 * - https://docs.tagada.io/developer-tools/node-sdk/checkout-sessions
 * - https://docs.tagada.io/developer-tools/node-sdk/webhooks-events
 * - API base: https://api.tagada.io/ (prod) · https://api.tagada.dev/ (sandbox)
 * - Auth: Authorization: Bearer <api-key>
 * - Package: @tagadapay/node-sdk (Node); Edge Functions use REST equivalents
 *
 * Do NOT put API keys in VITE_* or frontend source.
 */

import type { ManualPaymentStatus } from './manualInvoice';
import {
  evaluateMembershipCardCheckoutCart,
  evaluateMembershipEnrollmentShipping,
  isMembershipLineItem,
} from '@/lib/membership/tagadaMembershipBilling';

export const KASHU_PAYMENT_METHOD = 'kashu_card' as const;

/** Official Tagada API bases (docs.tagada.io OpenAPI servers). */
export const TAGADA_API_BASE_PRODUCTION = 'https://api.tagada.io';
export const TAGADA_API_BASE_SANDBOX = 'https://api.tagada.dev';

/** Official webhook signature header (docs: webhooks-events). */
export const TAGADA_SIGNATURE_HEADER = 'X-TagadaPay-Signature';
export const TAGADA_TIMESTAMP_HEADER = 'X-TagadaPay-Timestamp';

/**
 * Official webhook event types (slash format) from Tagada docs.
 * Only subscribe to what Phase 1 needs; list is for validation/mapping.
 */
export const TAGADA_WEBHOOK_EVENT_TYPES = [
  'order/paid',
  'order/created',
  'order/refunded',
  'order/failed',
  'order/upsellStarted',
  'order/paymentInitiated',
  'checkout/initiated',
  'checkout/emailValidated',
  'payment/created',
  'payment/succeeded',
  'payment/failed',
  'payment/refunded',
  'payment/authorized',
  'payment/rejected',
  'subscription/created',
  'subscription/canceled',
  'subscription/paused',
  'subscription/resumed',
  'subscription/pastDue',
  'subscription/rebillUpcoming',
  'subscription/rebillSucceeded',
  'subscription/rebillDeclined',
  'subscription/cancelScheduled',
  'subscription/rebillCaptureFailed',
] as const;

export type TagadaWebhookEventType = (typeof TAGADA_WEBHOOK_EVENT_TYPES)[number];

/** Phase 1 subscriptions for card checkout. */
export const KASHU_PHASE1_WEBHOOK_EVENTS = [
  'order/paid',
  'order/failed',
  'order/refunded',
  'payment/succeeded',
  'payment/failed',
  'payment/refunded',
  'payment/rejected',
] as const satisfies readonly TagadaWebhookEventType[];

export const KASHU_CHECKOUT_UI_LABEL = 'Credit / Debit Card';
export const KASHU_CHECKOUT_UI_HELP = 'Pay securely through our encrypted payment checkout.';

export const KASHU_CARD_SUBMIT_CTA = 'Continue to Secure Payment';

export const KASHU_CARD_RESULT_PENDING_COPY =
  'Payment is being confirmed. This page updates when your card payment is verified.';

export const KASHU_CARD_RESULT_PAID_COPY = 'Payment received. Thank you — your order is paid.';

export const KASHU_CARD_RESULT_CANCEL_COPY =
  'Payment was not completed. Your order remains unpaid. You can try card payment again or contact us for assistance.';

/**
 * Approved HTTPS hosts for Kashu/Tagada hosted checkout redirects.
 * Never navigate to an arbitrary URL returned by the network.
 */
export const APPROVED_KASHU_CHECKOUT_HOSTS = ['checkout.mybaremethod.com'] as const;

export function isApprovedKashuCheckoutRedirectUrl(
  redirectUrl: string,
): { ok: true; url: URL } | { ok: false; error: string } {
  let url: URL;
  try {
    url = new URL(redirectUrl);
  } catch {
    return { ok: false, error: 'Invalid checkout URL.' };
  }
  if (url.protocol !== 'https:') {
    return { ok: false, error: 'Checkout URL must use HTTPS.' };
  }
  if (!(APPROVED_KASHU_CHECKOUT_HOSTS as readonly string[]).includes(url.hostname)) {
    return { ok: false, error: 'Checkout URL host is not approved.' };
  }
  // Hosted Simple Checkout path is /checkout (optional trailing segments / query).
  if (!url.pathname.startsWith('/checkout')) {
    return { ok: false, error: 'Checkout URL path is not approved.' };
  }
  return { ok: true, url };
}

/**
 * Navigate the customer's top-level browser to Tagada hosted checkout.
 * Bolt Preview (and similar) embed MBM in an iframe — window.location.assign only
 * navigates the frame and can show "refused to connect". Prefer window.top.
 * Does not mark the order paid.
 */
export function navigateToKashuHostedCheckout(redirectUrl: string): { ok: true } | { ok: false; error: string } {
  const approved = isApprovedKashuCheckoutRedirectUrl(redirectUrl);
  if (!approved.ok) return approved;
  const href = approved.url.toString();
  try {
    if (typeof window !== 'undefined' && window.top && window.top !== window) {
      window.top.location.assign(href);
      return { ok: true };
    }
  } catch {
    // Cross-origin frame access can throw — fall through to same-window navigation.
  }
  if (typeof window !== 'undefined') {
    window.location.assign(href);
  }
  return { ok: true };
}

/**
 * Canonical MBM shipping SKUs for Tagada line-item parity.
 * Official checkout/init cannot take a custom shipping amount — only variantId items.
 * These SKUs must exist in kashu_sku_map (and Tagada catalog) at the exact MBM cents.
 */
export const MBM_SHIPPING_SKU_TWO_DAY = 'MBM-SHIP-TWO-DAY-001';
export const MBM_SHIPPING_SKU_NEXT_DAY = 'MBM-SHIP-NEXT-DAY-001';

export const TAGADA_SHIPPING_PARITY_BLOCKER = 'TAGADA_SHIPPING_PARITY_BLOCKER';
export const TAGADA_PRICE_PARITY_BLOCKER = 'TAGADA_PRICE_PARITY_BLOCKER';
export const TAGADA_TAX_PARITY_BLOCKER = 'TAGADA_TAX_PARITY_BLOCKER';
/** Fail-safe after tax-inclusive migration: NEW orders must have tax_cents = 0. */
export const TAGADA_UNEXPECTED_TAX_AMOUNT = 'TAGADA_UNEXPECTED_TAX_AMOUNT';
export const TAGADA_CHECKOUT_TOTAL_MISMATCH = 'TAGADA_CHECKOUT_TOTAL_MISMATCH';

/** Allowed MBM shipping cents for card checkout (MBM is source of truth). */
export const ALLOWED_CARD_SHIPPING_CENTS = [0, 3000, 5000] as const;

export function shippingSkuForMethod(shippingMethod: string): string | null {
  const m = shippingMethod.trim().toLowerCase();
  if (m === 'two_day') return MBM_SHIPPING_SKU_TWO_DAY;
  if (m === 'next_day') return MBM_SHIPPING_SKU_NEXT_DAY;
  return null;
}

/**
 * Map persisted MBM order.shipping_cents → shipping SKU.
 * Do not infer shipping from Tagada cart subtotal.
 */
export function shippingSkuForCents(shippingCents: number): string | null {
  const cents = Math.trunc(shippingCents);
  if (cents === 3000) return MBM_SHIPPING_SKU_TWO_DAY;
  if (cents === 5000) return MBM_SHIPPING_SKU_NEXT_DAY;
  return null;
}

export function isAllowedCardShippingCents(shippingCents: number): boolean {
  return (ALLOWED_CARD_SHIPPING_CENTS as readonly number[]).includes(Math.trunc(shippingCents));
}

/**
 * Remap stale Tagada IDs by exact MBM SKU only (never by display name).
 * Preserves MBM sku/product IDs; updates Tagada IDs from the live exact-SKU match.
 */
export function remapKashuRowByExactSku(input: {
  current: {
    mbmSku: string;
    mbmProductId?: string | null;
    tagadaProductId: string;
    tagadaVariantId: string;
    tagadaPriceId?: string | null;
  };
  liveByExactSku: Record<
    string,
    { productId: string; variantId: string; priceId?: string | null; priceCents?: number | null }
  >;
}):
  | { changed: false; row: typeof input.current }
  | {
      changed: true;
      row: {
        mbmSku: string;
        mbmProductId?: string | null;
        tagadaProductId: string;
        tagadaVariantId: string;
        tagadaPriceId?: string | null;
      };
      before: { tagadaProductId: string; tagadaVariantId: string; tagadaPriceId?: string | null };
      after: { tagadaProductId: string; tagadaVariantId: string; tagadaPriceId?: string | null };
    }
  | { changed: false; error: 'no_exact_sku_match' } {
  const live = input.liveByExactSku[input.current.mbmSku];
  if (!live?.variantId || !live.productId) {
    return { changed: false, error: 'no_exact_sku_match' };
  }
  const nextPriceId =
    live.priceId && live.priceId.length > 0
      ? live.priceId
      : input.current.tagadaPriceId ?? null;
  const same =
    live.productId === input.current.tagadaProductId &&
    live.variantId === input.current.tagadaVariantId &&
    (nextPriceId || null) === (input.current.tagadaPriceId || null);
  if (same) {
    return { changed: false, row: input.current };
  }
  return {
    changed: true,
    before: {
      tagadaProductId: input.current.tagadaProductId,
      tagadaVariantId: input.current.tagadaVariantId,
      tagadaPriceId: input.current.tagadaPriceId ?? null,
    },
    after: {
      tagadaProductId: live.productId,
      tagadaVariantId: live.variantId,
      tagadaPriceId: nextPriceId,
    },
    row: {
      mbmSku: input.current.mbmSku,
      mbmProductId: input.current.mbmProductId,
      tagadaProductId: live.productId,
      tagadaVariantId: live.variantId,
      tagadaPriceId: nextPriceId,
    },
  };
}

/** MBM catalog price is authoritative; Tagada must match for card-eligible SKUs. */
export function detectTagadaPriceDrift(input: {
  sku: string;
  mbmPriceCents: number;
  tagadaLivePriceCents: number;
}): { sku: string; mbmPriceCents: number; tagadaLivePriceCents: number; status: 'MATCH' | 'MISMATCH' } {
  const status =
    Math.trunc(input.mbmPriceCents) === Math.trunc(input.tagadaLivePriceCents) ? 'MATCH' : 'MISMATCH';
  return {
    sku: input.sku,
    mbmPriceCents: Math.trunc(input.mbmPriceCents),
    tagadaLivePriceCents: Math.trunc(input.tagadaLivePriceCents),
    status,
  };
}

/**
 * V1 tax parity: Tagada must not add independent tax beyond MBM tax_cents.
 * Hosted tax display may exist only when it resolves to exactly MBM tax.
 */
export function assertTagadaTaxEqualsMbmTax(input: {
  mbmTaxCents: number;
  tagadaTaxCents: number;
}): { ok: true } | { ok: false; blocker: typeof TAGADA_TAX_PARITY_BLOCKER } {
  if (Math.trunc(input.mbmTaxCents) === Math.trunc(input.tagadaTaxCents)) {
    return { ok: true };
  }
  return { ok: false, blocker: TAGADA_TAX_PARITY_BLOCKER };
}

/**
 * Pre-redirect total parity: mapped Tagada lines + MBM shipping line + MBM tax
 * must equal orders.total_cents. Do not redirect on mismatch.
 */
export function assertTagadaCheckoutTotalParity(input: {
  publicOrderNumber: string;
  mbmTotalCents: number;
  mappedMerchandiseCents: number;
  mappedShippingCents: number;
  mbmTaxCents: number;
  skuList: string[];
}):
  | { ok: true; calculatedTagadaTotalCents: number }
  | {
      ok: false;
      error: typeof TAGADA_CHECKOUT_TOTAL_MISMATCH;
      publicOrderNumber: string;
      mbmTotalCents: number;
      calculatedTagadaTotalCents: number;
      skuList: string[];
    } {
  const calculatedTagadaTotalCents =
    Math.trunc(input.mappedMerchandiseCents) +
    Math.trunc(input.mappedShippingCents) +
    Math.trunc(input.mbmTaxCents);
  if (calculatedTagadaTotalCents === Math.trunc(input.mbmTotalCents)) {
    return { ok: true, calculatedTagadaTotalCents };
  }
  return {
    ok: false,
    error: TAGADA_CHECKOUT_TOTAL_MISMATCH,
    publicOrderNumber: input.publicOrderNumber,
    mbmTotalCents: Math.trunc(input.mbmTotalCents),
    calculatedTagadaTotalCents,
    skuList: input.skuList,
  };
}

export type KashuCardCartLine = {
  isMembership?: boolean;
  purchaseType?: string | null;
  quantity: number;
  sku?: string | null;
  productId?: string;
};

export type KashuCardEligibility =
  | { ok: true; membershipRecurring?: true }
  | {
      ok: false;
      reason:
        | 'flag_off'
        | 'empty'
        | 'membership'
        | 'membership_mixed'
        | 'shipping_parity'
        | 'unexpected_tax'
        | 'invalid_quantity';
      message: string;
      blockerCode?:
        | typeof TAGADA_SHIPPING_PARITY_BLOCKER
        | typeof TAGADA_UNEXPECTED_TAX_AMOUNT
        | typeof TAGADA_TAX_PARITY_BLOCKER;
    };

/**
 * Card eligibility: flag on, non-empty cart, positive qty.
 * - One-time carts: no membership; shipping $0 / $30 / $50; tax_cents = 0.
 * - Membership recurring (SEM/TIRZ only): exactly one program SKU, qty 1,
 *   optional required provider-visit SKU (IPV/FUV) as ONE-TIME enrollment charge,
 *   plus exactly one shipping selection ($30 Two-Day or $50 Next-Day) included in
 *   the combo recurring Tagada priceId (do NOT append MBM-SHIP on membership).
 *   Ordinary merchandise mixed with membership remains blocked.
 * Tax-inclusive architecture: NEW orders must have tax_cents = 0.
 */
export function evaluateKashuCardCartEligibility(input: {
  flagEnabled: boolean;
  items: KashuCardCartLine[];
  shippingCents: number;
  /** MBM tax_cents. Must be 0 under tax-inclusive checkout. */
  taxCents?: number;
}): KashuCardEligibility {
  if (!input.flagEnabled) {
    return {
      ok: false,
      reason: 'flag_off',
      message: 'Card payment is not available right now. Please contact us for assistance.',
    };
  }
  if (!input.items.length) {
    return { ok: false, reason: 'empty', message: 'Your cart is empty.' };
  }

  const hasMembership = input.items.some(isMembershipLineItem);
  if (hasMembership) {
    const membershipCart = evaluateMembershipCardCheckoutCart(input.items);
    if (!membershipCart.ok) {
      return {
        ok: false,
        reason: membershipCart.reason === 'mixed_cart' || membershipCart.reason === 'multiple_memberships'
          ? 'membership_mixed'
          : 'membership',
        message: membershipCart.message,
      };
    }
    // Membership enrollment requires $30/$50 shipping selection (combo recurring price).
    const ship = evaluateMembershipEnrollmentShipping(Math.trunc(input.shippingCents));
    if (!ship.ok) {
      return {
        ok: false,
        reason: 'shipping_parity',
        blockerCode: TAGADA_SHIPPING_PARITY_BLOCKER,
        message: ship.message,
      };
    }
    const taxCents = Math.max(0, Math.trunc(Number(input.taxCents ?? 0) || 0));
    if (taxCents > 0) {
      return {
        ok: false,
        reason: 'unexpected_tax',
        blockerCode: TAGADA_UNEXPECTED_TAX_AMOUNT,
        message:
          'This order has an unexpected tax amount for card checkout. Please contact us for assistance.',
      };
    }
    return { ok: true, membershipRecurring: true };
  }

  for (const item of input.items) {
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return {
        ok: false,
        reason: 'invalid_quantity',
        message: 'Each item must have a positive whole-number quantity.',
      };
    }
  }
  const shippingCents = Math.trunc(input.shippingCents);
  if (!isAllowedCardShippingCents(shippingCents)) {
    return {
      ok: false,
      reason: 'shipping_parity',
      blockerCode: TAGADA_SHIPPING_PARITY_BLOCKER,
      message:
        'Card checkout only supports $0, $30 (Two-Day), or $50 (Next-Day) shipping. Please adjust shipping or contact us.',
    };
  }
  const taxCents = Math.max(0, Math.trunc(Number(input.taxCents ?? 0) || 0));
  if (taxCents > 0) {
    return {
      ok: false,
      reason: 'unexpected_tax',
      blockerCode: TAGADA_UNEXPECTED_TAX_AMOUNT,
      message:
        'This order has an unexpected tax amount for card checkout. Please contact us for assistance.',
    };
  }
  return { ok: true };
}

/** Official createSession item shape (docs: checkout-sessions). */
export interface TagadaCheckoutSessionItem {
  variantId: string;
  quantity: number;
  priceId?: string;
}

/**
 * Official createSession params we use (docs: checkout-sessions).
 * Field names must match Tagada — do not invent.
 */
export interface TagadaCreateSessionParams {
  storeId: string;
  items: TagadaCheckoutSessionItem[];
  currency: string;
  checkoutUrl: string;
  returnUrl?: string;
  locale?: string;
  customerEmail?: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
  customerTags?: string[];
  cartToken?: string;
  draft?: string | boolean;
}

export interface TagadaCreateSessionResult {
  redirectUrl: string;
  checkoutToken: string | null;
}

/** Map MBM SKU → Tagada commerce IDs (products must exist in Tagada first). */
export interface KashuSkuMapping {
  mbmSku: string;
  mbmVariantId: string | null;
  tagadaProductId: string;
  tagadaVariantId: string;
  active: boolean;
}

export function isTagadaWebhookEventType(value: string): value is TagadaWebhookEventType {
  return (TAGADA_WEBHOOK_EVENT_TYPES as readonly string[]).includes(value);
}

/**
 * Verify Tagada webhook HMAC-SHA256 signature.
 * Official algorithm (docs: webhooks-events):
 * 1. Raw body string (do not parse JSON first)
 * 2. HMAC-SHA256(secret, rawBody) → hex
 * 3. Compare to X-TagadaPay-Signature after `sha256=` prefix (timing-safe)
 */
export async function verifyTagadaWebhookSignature(input: {
  rawBody: string;
  secret: string;
  signatureHeader: string | null | undefined;
}): Promise<boolean> {
  const header = input.signatureHeader?.trim() ?? '';
  if (!header.startsWith('sha256=')) return false;
  const expectedHex = header.slice('sha256='.length);
  if (!expectedHex || !input.secret) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(input.secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(input.rawBody));
  const actualHex = Array.from(new Uint8Array(sig), b => b.toString(16).padStart(2, '0')).join('');

  if (actualHex.length !== expectedHex.length) return false;
  // Constant-time compare
  let diff = 0;
  for (let i = 0; i < actualHex.length; i++) {
    diff |= actualHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  }
  return diff === 0;
}

/** Node/crypto-compatible sync verifier for Vitest (mirrors official sample). */
export function verifyTagadaWebhookSignatureSync(input: {
  rawBody: string;
  secret: string;
  signatureHeader: string | null | undefined;
  /** hex digest of HMAC-SHA256(secret, rawBody) — test injects precomputed when needed */
  computeHmacHex: (secret: string, rawBody: string) => string;
}): boolean {
  const header = input.signatureHeader?.trim() ?? '';
  if (!header.startsWith('sha256=')) return false;
  const expected = header.slice('sha256='.length);
  const hmac = input.computeHmacHex(input.secret, input.rawBody);
  if (expected.length !== hmac.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ hmac.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Map official Tagada webhook event types → MBM payment_status.
 * Only uses documented event type strings.
 */
export function mapTagadaEventToPaymentStatus(
  eventType: string,
): ManualPaymentStatus | null {
  switch (eventType) {
    case 'order/paid':
    case 'payment/succeeded':
      return 'paid';
    case 'order/failed':
    case 'payment/failed':
    case 'payment/rejected':
      return 'payment_failed';
    case 'order/refunded':
    case 'payment/refunded':
      return 'refunded';
    default:
      return null;
  }
}

export type KashuAmountCheckResult =
  | { ok: true }
  | { ok: false; reason: 'missing_amount' | 'mismatch'; expectedCents: number; paidCents: number | null };

/**
 * Never trust frontend amounts. Webhook/server paid amount must match persisted MBM total.
 * Amounts compared in integer cents.
 */
export function assertKashuPaidAmountMatchesOrder(input: {
  orderTotalCents: number;
  paidAmountCents: number | null | undefined;
}): KashuAmountCheckResult {
  if (input.paidAmountCents == null || !Number.isFinite(input.paidAmountCents)) {
    return {
      ok: false,
      reason: 'missing_amount',
      expectedCents: input.orderTotalCents,
      paidCents: null,
    };
  }
  if (Math.trunc(input.paidAmountCents) !== Math.trunc(input.orderTotalCents)) {
    return {
      ok: false,
      reason: 'mismatch',
      expectedCents: input.orderTotalCents,
      paidCents: Math.trunc(input.paidAmountCents),
    };
  }
  return { ok: true };
}

/**
 * Build public GET /api/public/v1/checkout/init query (official OpenAPI).
 * Used by Edge Function when creating a hosted checkout redirect.
 */
export function buildTagadaCheckoutInitUrl(input: {
  apiBase: string;
  params: TagadaCreateSessionParams;
}): string {
  const base = input.apiBase.replace(/\/$/, '');
  const q = new URLSearchParams();
  q.set('storeId', input.params.storeId);
  q.set('currency', input.params.currency);
  q.set('items', JSON.stringify(input.params.items));
  q.set('checkoutUrl', input.params.checkoutUrl);
  if (input.params.returnUrl) q.set('returnUrl', input.params.returnUrl);
  if (input.params.locale) q.set('locale', input.params.locale);
  if (input.params.customerEmail) q.set('customerEmail', input.params.customerEmail);
  if (input.params.customerFirstName) q.set('customerFirstName', input.params.customerFirstName);
  if (input.params.customerLastName) q.set('customerLastName', input.params.customerLastName);
  if (input.params.customerPhone) q.set('customerPhone', input.params.customerPhone);
  if (input.params.customerTags?.length) q.set('customerTags', input.params.customerTags.join(','));
  if (input.params.cartToken) q.set('cartToken', input.params.cartToken);
  if (input.params.draft != null) q.set('draft', String(input.params.draft));
  return `${base}/api/public/v1/checkout/init?${q.toString()}`;
}

/**
 * Extract checkout token from a Tagada redirect URL when present.
 * Official createSession returns checkoutToken parsed from the redirect URL.
 */
export function extractCheckoutTokenFromRedirectUrl(redirectUrl: string): string | null {
  try {
    const u = new URL(redirectUrl);
    return (
      u.searchParams.get('checkoutToken') ||
      u.searchParams.get('token') ||
      u.searchParams.get('checkout_token') ||
      null
    );
  } catch {
    return null;
  }
}

/**
 * Best-effort extract of paid amount in cents from a Tagada webhook JSON payload.
 * Official payload field names for amount are not fully documented in the public
 * webhook guide we reviewed — try common documented/commerce shapes only.
 * Returns null if no trusted amount field is present (caller must NOT mark paid).
 */
function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined;
}

function centsCandidate(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
    return Math.trunc(Number(value));
  }
  return null;
}

/**
 * Best-effort extract of paid amount in cents from a Tagada webhook JSON payload.
 * Live Tagada `payment/succeeded` envelopes put cents on `data.amount` and
 * `data.order.paidAmount` (already cents — do NOT multiply by 100).
 * Returns null if no trusted amount field is present (caller must NOT mark paid).
 */
export function extractPaidAmountCentsFromTagadaPayload(payload: unknown): number | null {
  if (!payload || typeof payload !== 'object') return null;
  const root = payload as Record<string, unknown>;
  const data = asRecord(root.data);
  const order = asRecord(root.order) ?? asRecord(data?.order);
  const payment = asRecord(root.payment) ?? asRecord(data?.payment);
  const candidates: unknown[] = [
    root.amountCents,
    root.amount_cents,
    root.totalCents,
    root.total_cents,
    // Live Tagada payment/succeeded — integer cents
    data?.amount,
    data?.amountCents,
    order?.paidAmount,
    order?.amountCents,
    order?.totalCents,
    order?.amount_cents,
    payment?.amountCents,
    payment?.amount_cents,
    payment?.amount,
    // Flat payloads / tests
    root.amount,
  ];
  for (const c of candidates) {
    const n = centsCandidate(c);
    if (n != null) return n;
  }
  // Dollars → cents only when explicitly labeled as dollars
  const dollarFields = [
    root.amountDollars,
    root.totalDollars,
    order?.totalDollars,
    data?.amountDollars,
  ];
  for (const d of dollarFields) {
    if (typeof d === 'number' && Number.isFinite(d)) return Math.round(d * 100);
  }
  return null;
}

function mbmOrderFromTags(tags: unknown): string | null {
  if (!Array.isArray(tags)) return null;
  for (const t of tags) {
    if (typeof t !== 'string') continue;
    if (t.startsWith('mbmOrder:')) return t.slice('mbmOrder:'.length).trim();
    // Tagada sometimes stores the init query echo as customerTags:mbmOrder:...
    const echoed = t.match(/(?:^|:)mbmOrder:([A-Z0-9-]+)/i);
    if (echoed?.[1]) return echoed[1];
  }
  return null;
}

/**
 * Best-effort MBM order number from Tagada payload / return metadata.
 * Prefer explicit fields we pass via customerTags / returnUrl (mbmOrderNumber).
 * Live webhooks nest tags under `data.customer.tags` (not top-level customerTags).
 */
export function extractMbmOrderNumberFromTagadaPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const root = payload as Record<string, unknown>;
  const data = asRecord(root.data);
  const keys = ['mbmOrderNumber', 'mbm_order_number', 'payment_reference', 'externalReference'];
  for (const layer of [root, data, asRecord(root.metadata), asRecord(data?.metadata)]) {
    if (!layer) continue;
    for (const k of keys) {
      const v = layer[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
  }
  const tagSets = [
    root.customerTags,
    asRecord(root.customer)?.tags,
    asRecord(data?.customer)?.tags,
    data?.customerTags,
  ];
  for (const tags of tagSets) {
    const fromTags = mbmOrderFromTags(tags);
    if (fromTags) return fromTags;
  }
  // order/paid metadata may echo the init query string
  const orderMeta = asRecord(data?.order_metadata);
  const qp = orderMeta?.queryParams;
  if (typeof qp === 'string' && qp.includes('mbmOrder')) {
    try {
      const params = new URLSearchParams(qp.startsWith('?') ? qp.slice(1) : qp);
      const raw = params.get('customerTags') || '';
      const fromQuery = mbmOrderFromTags(raw.split(',').map((s) => s.trim()).filter(Boolean));
      if (fromQuery) return fromQuery;
    } catch {
      /* ignore */
    }
  }
  return null;
}

/** External Tagada IDs from live nested `data` envelopes or flat test payloads. */
export function extractTagadaExternalIdsFromPayload(payload: unknown): {
  externalOrderId: string | null;
  externalPaymentId: string | null;
  externalCheckoutSessionId: string | null;
} {
  const root = asRecord(payload) || {};
  const data = asRecord(root.data);
  const order = asRecord(root.order) ?? asRecord(data?.order);
  const payment = asRecord(root.payment) ?? asRecord(data?.payment);
  const asId = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);
  return {
    externalOrderId:
      asId(root.orderId) || asId(data?.orderId) || asId(order?.id) || asId(order?.orderId) || null,
    externalPaymentId:
      asId(root.paymentId) ||
      asId(data?.paymentId) ||
      asId(payment?.id) ||
      asId(payment?.paymentId) ||
      null,
    externalCheckoutSessionId:
      asId(root.checkoutSessionId) ||
      asId(root.checkout_session_id) ||
      asId(data?.checkoutSessionId) ||
      null,
  };
}

export function mbmOrderCustomerTag(orderNumber: string): string {
  return `mbmOrder:${orderNumber}`;
}

/**
 * Resolve Tagada card top-level gate from Vite env.
 * - explicit "false" / false → OFF (emergency kill switch)
 * - explicit "true" / true → ON
 * - undefined / empty / unset → ON by default
 *
 * Do NOT key the default off import.meta.env.PROD: Bolt Preview often runs as a
 * non-production Vite build without reliable VITE_* injection, which previously
 * hid card checkout for eligible carts. Kill switch remains explicit false only.
 * Eligibility rules (membership, shipping, unexpected tax, SKU map) still apply.
 *
 * @param _isProd retained for call-site compatibility; unused for the default.
 */
export function resolveKashuCardEnabledFlag(
  raw: string | boolean | undefined | null,
  _isProd?: boolean,
): boolean {
  void _isProd;
  if (raw === false || raw === 'false') return false;
  if (raw === true || raw === 'true') return true;
  return true;
}

export function isKashuCardEnabled(): boolean {
  // Use static import.meta.env.VITE_* access (no optional chaining) so Vite inlines env at build time.
  try {
    return resolveKashuCardEnabledFlag(
      import.meta.env.VITE_KASHU_CARD_ENABLED as string | boolean | undefined,
      import.meta.env.PROD,
    );
  } catch {
    // Fail closed only on unexpected runtime errors — not on unset env.
    return false;
  }
}
