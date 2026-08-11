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
export const KASHU_CHECKOUT_UI_HELP = 'Processed securely by Kashu';

export const KASHU_CARD_RESULT_PENDING_COPY =
  'Payment is being confirmed. This page updates when Kashu verifies your card payment.';

export const KASHU_CARD_RESULT_PAID_COPY = 'Payment received. Thank you — your order is paid.';

export const KASHU_CARD_RESULT_CANCEL_COPY =
  'Payment was not completed. Your order remains unpaid. You can try card payment again or choose ACH / Wire.';

/** Official createSession item shape (docs: checkout-sessions). */
export interface TagadaCheckoutSessionItem {
  variantId: string;
  quantity: number;
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
export function extractPaidAmountCentsFromTagadaPayload(payload: unknown): number | null {
  if (!payload || typeof payload !== 'object') return null;
  const root = payload as Record<string, unknown>;
  const candidates: unknown[] = [
    root.amountCents,
    root.amount_cents,
    root.totalCents,
    root.total_cents,
    (root.order as Record<string, unknown> | undefined)?.amountCents,
    (root.order as Record<string, unknown> | undefined)?.totalCents,
    (root.order as Record<string, unknown> | undefined)?.amount_cents,
    (root.payment as Record<string, unknown> | undefined)?.amountCents,
    (root.payment as Record<string, unknown> | undefined)?.amount_cents,
    (root.data as Record<string, unknown> | undefined)?.amountCents,
  ];
  for (const c of candidates) {
    if (typeof c === 'number' && Number.isFinite(c)) return Math.trunc(c);
    if (typeof c === 'string' && c.trim() && !Number.isNaN(Number(c))) return Math.trunc(Number(c));
  }
  // Dollars → cents only when explicitly labeled
  const dollarFields = [root.amount, root.total, (root.order as Record<string, unknown> | undefined)?.total];
  for (const d of dollarFields) {
    if (typeof d === 'number' && Number.isFinite(d)) return Math.round(d * 100);
  }
  return null;
}

/**
 * Best-effort MBM order number from Tagada payload / return metadata.
 * Prefer explicit fields we pass via customerTags / returnUrl (mbmOrderNumber).
 */
export function extractMbmOrderNumberFromTagadaPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const root = payload as Record<string, unknown>;
  const keys = ['mbmOrderNumber', 'mbm_order_number', 'payment_reference', 'externalReference'];
  for (const k of keys) {
    const v = root[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  const meta = root.metadata;
  if (meta && typeof meta === 'object') {
    const m = meta as Record<string, unknown>;
    for (const k of keys) {
      const v = m[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
  }
  const tags = root.customerTags ?? (root.customer as Record<string, unknown> | undefined)?.tags;
  if (Array.isArray(tags)) {
    for (const t of tags) {
      if (typeof t === 'string' && t.startsWith('mbmOrder:')) return t.slice('mbmOrder:'.length);
    }
  }
  return null;
}

export function mbmOrderCustomerTag(orderNumber: string): string {
  return `mbmOrder:${orderNumber}`;
}

export function isKashuCardEnabled(): boolean {
  // Frontend feature flag — default OFF until secrets + product sync + deploy approved.
  try {
    const flag = import.meta.env?.VITE_KASHU_CARD_ENABLED;
    return flag === 'true';
  } catch {
    return false;
  }
}
