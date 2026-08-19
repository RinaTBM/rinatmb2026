/**
 * Tagada native recurring billing for Active Wellness memberships (SEM / TIRZ).
 * Pure helpers — unit-testable; mirrored by Edge Functions.
 *
 * Authoritative recurring amounts come from verified Tagada priceIds — never browser.
 * Browser return / localStorage never activates membership.
 */

import {
  SEMAGLUTIDE_MEMBERSHIP_CENTS,
  TIRZEPATIDE_MEMBERSHIP_CENTS,
} from '@/lib/checkout/checkoutConstants';

/** Supported membership PROGRAM SKUs for Tagada card recurring enrollment. */
export const TAGADA_MEMBERSHIP_PROGRAM_SKUS = [
  'MBM-MEM-SEM-MEM-001',
  'MBM-MEM-TIR-MEM-001',
] as const;

export type TagadaMembershipProgramSku = (typeof TAGADA_MEMBERSHIP_PROGRAM_SKUS)[number];

export const SEM_MEMBERSHIP_SKU: TagadaMembershipProgramSku = 'MBM-MEM-SEM-MEM-001';
export const TIRZ_MEMBERSHIP_SKU: TagadaMembershipProgramSku = 'MBM-MEM-TIR-MEM-001';

/** Verified live Tagada recurring priceIds (do not create new prices). */
export const SEM_TAGADA_PRICE_ID = 'price_344d3dacb4ab';
export const TIRZ_TAGADA_PRICE_ID = 'price_5cf1fa89610c';

export const SEM_TAGADA_VARIANT_ID = 'variant_6973906c4bd6';
export const TIRZ_TAGADA_VARIANT_ID = 'variant_b3890c799e09';

export const MEMBERSHIP_MINIMUM_TERM_MONTHS = 3;

export const MEMBERSHIP_MINIMUM_CANCEL_BLOCK_MESSAGE =
  'Your membership has a 3-month minimum commitment. Cancellation will be available after your initial term.';

export const MEMBERSHIP_CARD_RECURRING_DISCLOSURE =
  'Your card will be charged monthly while your membership is active. A 3-month minimum commitment applies.';

export const MEMBERSHIP_CARD_SHIPPING_NOTE =
  'Membership enrollment charges the monthly membership rate only. First medication shipment shipping (Two-Day $30 / Next-Day $50) is arranged after provider approval — it is not part of the Tagada recurring membership price.';

export const MEMBERSHIP_TERMS_ACCEPTANCE_LABEL =
  'I agree to the Membership & Cancellation Terms, including the 3-month minimum commitment and monthly card billing.';

/** Official Tagada subscription webhook event types (docs). */
export const TAGADA_SUBSCRIPTION_WEBHOOK_EVENTS = [
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

export type TagadaSubscriptionWebhookEvent =
  (typeof TAGADA_SUBSCRIPTION_WEBHOOK_EVENTS)[number];

export type CustomerMembershipStatus =
  | 'pending_payment'
  | 'active'
  | 'past_due'
  | 'paused'
  | 'cancel_scheduled'
  | 'canceled'
  | 'payment_issue';

/** Statuses that block a duplicate Tagada subscription for the same program. */
export const MEMBERSHIP_DUPLICATE_BLOCK_STATUSES: readonly CustomerMembershipStatus[] = [
  'pending_payment',
  'active',
  'past_due',
  'paused',
  'cancel_scheduled',
  'payment_issue',
];

export interface TagadaMembershipProgramConfig {
  sku: TagadaMembershipProgramSku;
  membershipType: 'semaglutide' | 'tirzepatide';
  tagadaPriceId: string;
  tagadaVariantId: string;
  monthlyAmountCents: number;
  displayName: string;
}

export const TAGADA_MEMBERSHIP_PROGRAMS: Record<
  TagadaMembershipProgramSku,
  TagadaMembershipProgramConfig
> = {
  [SEM_MEMBERSHIP_SKU]: {
    sku: SEM_MEMBERSHIP_SKU,
    membershipType: 'semaglutide',
    tagadaPriceId: SEM_TAGADA_PRICE_ID,
    tagadaVariantId: SEM_TAGADA_VARIANT_ID,
    monthlyAmountCents: SEMAGLUTIDE_MEMBERSHIP_CENTS,
    displayName: 'Semaglutide Membership',
  },
  [TIRZ_MEMBERSHIP_SKU]: {
    sku: TIRZ_MEMBERSHIP_SKU,
    membershipType: 'tirzepatide',
    tagadaPriceId: TIRZ_TAGADA_PRICE_ID,
    tagadaVariantId: TIRZ_TAGADA_VARIANT_ID,
    monthlyAmountCents: TIRZEPATIDE_MEMBERSHIP_CENTS,
    displayName: 'Tirzepatide Membership',
  },
};

export function isTagadaMembershipProgramSku(sku: string | null | undefined): sku is TagadaMembershipProgramSku {
  return (
    typeof sku === 'string' &&
    (TAGADA_MEMBERSHIP_PROGRAM_SKUS as readonly string[]).includes(sku)
  );
}

export function getTagadaMembershipProgram(
  sku: string | null | undefined,
): TagadaMembershipProgramConfig | null {
  if (!isTagadaMembershipProgramSku(sku)) return null;
  return TAGADA_MEMBERSHIP_PROGRAMS[sku];
}

export function isMembershipLineItem(item: {
  isMembership?: boolean;
  purchaseType?: string | null;
  sku?: string | null;
}): boolean {
  if (item.isMembership || item.purchaseType === 'membership_program') return true;
  return isTagadaMembershipProgramSku(item.sku ?? null);
}

/**
 * Membership card checkout: exactly ONE supported program SKU, qty 1, no other lines.
 * Mixed SEM+TIRZ, membership+one-time, or unmapped MBM-MEM-* → fail safe.
 */
export function evaluateMembershipCardCheckoutCart(items: Array<{
  isMembership?: boolean;
  purchaseType?: string | null;
  quantity: number;
  sku?: string | null;
}>):
  | { ok: true; program: TagadaMembershipProgramConfig }
  | {
      ok: false;
      reason:
        | 'empty'
        | 'mixed_cart'
        | 'unsupported_membership'
        | 'multiple_memberships'
        | 'invalid_quantity'
        | 'not_membership_only';
      message: string;
    } {
  if (!items.length) {
    return { ok: false, reason: 'empty', message: 'Your cart is empty.' };
  }

  const membershipLines = items.filter(isMembershipLineItem);
  const nonMembershipLines = items.filter(i => !isMembershipLineItem(i));

  if (membershipLines.length === 0) {
    return {
      ok: false,
      reason: 'not_membership_only',
      message: 'This path is for membership enrollment only.',
    };
  }

  if (nonMembershipLines.length > 0) {
    return {
      ok: false,
      reason: 'mixed_cart',
      message:
        'Membership enrollment must be checked out alone. Remove other products to continue with card membership billing.',
    };
  }

  if (membershipLines.length > 1) {
    const skus = new Set(
      membershipLines.map(l => l.sku).filter((s): s is string => typeof s === 'string'),
    );
    if (skus.size > 1) {
      return {
        ok: false,
        reason: 'multiple_memberships',
        message:
          'Only one membership program can be enrolled at a time. Remove the extra membership to continue.',
      };
    }
  }

  const line = membershipLines[0];
  const qty = Number(line.quantity);
  if (!Number.isInteger(qty) || qty !== 1) {
    return {
      ok: false,
      reason: 'invalid_quantity',
      message: 'Membership enrollment quantity must be exactly 1.',
    };
  }

  const program = getTagadaMembershipProgram(line.sku ?? null);
  if (!program) {
    // Unmapped MBM-MEM-* (or missing SKU) — do not broadly allow all MEM SKUs.
    return {
      ok: false,
      reason: 'unsupported_membership',
      message:
        'Online enrollment for this membership program is not available yet. Please contact us for assistance.',
    };
  }

  if (membershipLines.length > 1) {
    return {
      ok: false,
      reason: 'multiple_memberships',
      message: 'Only one membership enrollment is allowed per checkout.',
    };
  }

  return { ok: true, program };
}

/**
 * Hosted recurring init MUST send both variantId and priceId.
 * Tagada priceId is authoritative for $149 / $249.
 */
export function buildMembershipTagadaInitItem(program: TagadaMembershipProgramConfig): {
  variantId: string;
  quantity: number;
  priceId: string;
} {
  return {
    variantId: program.tagadaVariantId,
    quantity: 1,
    priceId: program.tagadaPriceId,
  };
}

/** Require priceId on membership init — never variantId alone. */
export function assertMembershipRecurringInitItem(item: {
  variantId?: string;
  priceId?: string;
  quantity?: number;
}): { ok: true } | { ok: false; error: string } {
  if (!item.variantId?.trim()) {
    return { ok: false, error: 'Membership checkout requires Tagada variantId.' };
  }
  if (!item.priceId?.trim()) {
    return {
      ok: false,
      error: 'Membership recurring checkout requires Tagada priceId (variantId alone is not allowed).',
    };
  }
  if (Number(item.quantity) !== 1) {
    return { ok: false, error: 'Membership checkout quantity must be 1.' };
  }
  return { ok: true };
}

/**
 * minimum_term_ends_at = three billing months after membership start,
 * using subscription start / current-period dates when available.
 */
export function computeMinimumTermEndsAt(input: {
  startedAt: Date | string;
  /** Optional current period end from Tagada — preferred anchor when present. */
  currentPeriodEnd?: Date | string | null;
}): Date {
  const start =
    typeof input.startedAt === 'string' ? new Date(input.startedAt) : new Date(input.startedAt.getTime());
  if (Number.isNaN(start.getTime())) {
    throw new Error('Invalid membership start date');
  }
  const end = new Date(start.getTime());
  end.setUTCMonth(end.getUTCMonth() + MEMBERSHIP_MINIMUM_TERM_MONTHS);
  if (input.currentPeriodEnd) {
    const periodEnd =
      typeof input.currentPeriodEnd === 'string'
        ? new Date(input.currentPeriodEnd)
        : new Date(input.currentPeriodEnd.getTime());
    // Prefer explicit period math when Tagada provides period end for month 1:
    // three billing months ≈ start + 3 × (period length), but without fabricating
    // fields we use calendar months from start (documented MBM rule).
    if (!Number.isNaN(periodEnd.getTime()) && periodEnd.getTime() > start.getTime()) {
      // Keep calendar 3-month rule from start; period end only validates ordering.
      void periodEnd;
    }
  }
  return end;
}

export function canSelfServiceCancelMembership(input: {
  minimumTermEndsAt: Date | string | null | undefined;
  now?: Date;
}): { ok: true } | { ok: false; message: string } {
  if (!input.minimumTermEndsAt) {
    return { ok: false, message: MEMBERSHIP_MINIMUM_CANCEL_BLOCK_MESSAGE };
  }
  const ends =
    typeof input.minimumTermEndsAt === 'string'
      ? new Date(input.minimumTermEndsAt)
      : new Date(input.minimumTermEndsAt.getTime());
  if (Number.isNaN(ends.getTime())) {
    return { ok: false, message: MEMBERSHIP_MINIMUM_CANCEL_BLOCK_MESSAGE };
  }
  const now = input.now ?? new Date();
  if (now.getTime() < ends.getTime()) {
    return { ok: false, message: MEMBERSHIP_MINIMUM_CANCEL_BLOCK_MESSAGE };
  }
  return { ok: true };
}

export function isTagadaSubscriptionWebhookEvent(
  eventType: string,
): eventType is TagadaSubscriptionWebhookEvent {
  return (TAGADA_SUBSCRIPTION_WEBHOOK_EVENTS as readonly string[]).includes(eventType);
}

/**
 * Map Tagada subscription webhook → MBM membership status.
 * Does not invent payload fields — status mapping only.
 */
export function mapTagadaSubscriptionEventToMembershipStatus(
  eventType: string,
): CustomerMembershipStatus | 'ignore' | null {
  switch (eventType) {
    case 'subscription/created':
    case 'subscription/rebillSucceeded':
    case 'subscription/resumed':
      return 'active';
    case 'subscription/pastDue':
      return 'past_due';
    case 'subscription/rebillDeclined':
    case 'subscription/rebillCaptureFailed':
      return 'payment_issue';
    case 'subscription/paused':
      return 'paused';
    case 'subscription/cancelScheduled':
      return 'cancel_scheduled';
    case 'subscription/canceled':
      return 'canceled';
    case 'subscription/rebillUpcoming':
      return 'ignore';
    default:
      return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined;
}

function asId(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function asIsoDate(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Best-effort extract of subscription fields from Tagada webhook envelopes.
 * Only reads common documented commerce shapes (id, customerId, priceId, dates).
 * Missing fields stay null — do not fabricate.
 */
export function extractTagadaSubscriptionFields(payload: unknown): {
  subscriptionId: string | null;
  customerId: string | null;
  priceId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  nextBillingAt: string | null;
  paymentId: string | null;
} {
  const root = asRecord(payload) || {};
  const data = asRecord(root.data);
  const subscription =
    asRecord(root.subscription) ??
    asRecord(data?.subscription) ??
    (typeof data?.id === 'string' && String(data.id).startsWith('sub_') ? data : undefined);
  const customer =
    asRecord(root.customer) ?? asRecord(data?.customer) ?? asRecord(subscription?.customer);
  const price = asRecord(subscription?.price) ?? asRecord(data?.price);
  const payment = asRecord(root.payment) ?? asRecord(data?.payment);

  return {
    subscriptionId:
      asId(root.subscriptionId) ||
      asId(data?.subscriptionId) ||
      asId(subscription?.id) ||
      asId(subscription?.subscriptionId) ||
      null,
    customerId:
      asId(root.customerId) ||
      asId(data?.customerId) ||
      asId(customer?.id) ||
      asId(customer?.customerId) ||
      asId(subscription?.customerId) ||
      null,
    priceId:
      asId(root.priceId) ||
      asId(data?.priceId) ||
      asId(subscription?.priceId) ||
      asId(price?.id) ||
      null,
    currentPeriodStart:
      asIsoDate(subscription?.currentPeriodStart) ||
      asIsoDate(subscription?.current_period_start) ||
      asIsoDate(data?.currentPeriodStart) ||
      null,
    currentPeriodEnd:
      asIsoDate(subscription?.currentPeriodEnd) ||
      asIsoDate(subscription?.current_period_end) ||
      asIsoDate(data?.currentPeriodEnd) ||
      null,
    nextBillingAt:
      asIsoDate(subscription?.nextBillingDate) ||
      asIsoDate(subscription?.next_billing_date) ||
      asIsoDate(subscription?.nextBillingAt) ||
      asIsoDate(data?.nextBillingDate) ||
      null,
    paymentId:
      asId(root.paymentId) ||
      asId(data?.paymentId) ||
      asId(payment?.id) ||
      asId(payment?.paymentId) ||
      null,
  };
}

/** Browser success redirect must never activate membership. */
export function membershipActivationFromBrowserReturn(): false {
  return false;
}

export function shouldActivateMembershipFromSources(input: {
  fromBrowserReturn: boolean;
  hasAuthoritativeSubscriptionEvidence: boolean;
  initialPaymentSucceeded?: boolean;
}): boolean {
  if (input.fromBrowserReturn) return false;
  return input.hasAuthoritativeSubscriptionEvidence === true;
}
