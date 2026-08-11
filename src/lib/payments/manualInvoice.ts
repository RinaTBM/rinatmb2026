/**
 * Manual invoice + ACH/wire order helpers (processor-neutral).
 * Pure functions — safe for unit tests and shared with Edge Functions.
 */

import type { OrderItemSnapshotInput } from '../orders/orderTypes';
import type { OrderStatus } from '../orders/orderStatus';
import {
  isOrderPaymentMethod,
  type ActiveCheckoutPaymentMethod,
  type PaymentMethod,
} from './paymentMethods';

/** Launch payment statuses (separate from fulfillment/provider status). */
export const MANUAL_PAYMENT_STATUSES = [
  'awaiting_payment',
  'payment_under_review',
  'paid',
  'payment_failed',
  'cancelled',
  'refunded',
] as const;

export type ManualPaymentStatus = (typeof MANUAL_PAYMENT_STATUSES)[number];

/** Legacy Stripe-era statuses still accepted for historical rows. */
export const LEGACY_PAYMENT_STATUSES = [
  'pending',
  'failed',
  'partially_refunded',
] as const;

export const ALL_PAYMENT_STATUSES = [
  ...MANUAL_PAYMENT_STATUSES,
  ...LEGACY_PAYMENT_STATUSES,
] as const;

export type AnyPaymentStatus = (typeof ALL_PAYMENT_STATUSES)[number];

export const MANUAL_PAYMENT_STATUS_LABELS: Record<ManualPaymentStatus, string> = {
  awaiting_payment: 'Awaiting Payment',
  payment_under_review: 'Payment Under Review',
  paid: 'Paid',
  payment_failed: 'Payment Failed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const CHECKOUT_SUBMIT_CTA = 'Submit Order & View Payment Instructions';

export const CHECKOUT_SUBMIT_SUPPORTING_COPY =
  "After submitting your order, you'll receive an electronic invoice and secure instructions to complete payment by ACH / bank transfer or domestic wire. No payment is withdrawn from your bank when you submit your order.";

export const INVOICE_RECEIVED_HEADLINE = 'Order received — awaiting payment';

export const INVOICE_MEMO_INSTRUCTION =
  'Please include your order number in the memo/reference field. Processing begins after payment has been received and verified.';

export interface ManualOrderTotalsInput {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  shippingMethod: string;
  freeShippingEligible: boolean;
  requiresProviderReview: boolean;
  currency?: string;
}

export interface ManualOrderCustomerInput {
  customerUserId?: string | null;
  customerEmail: string;
  customerName: string;
}

export interface BuiltManualOrderInsert {
  customer_user_id: string | null;
  customer_email: string;
  customer_name: string;
  order_status: OrderStatus;
  payment_status: ManualPaymentStatus;
  payment_method: ActiveCheckoutPaymentMethod;
  payment_reference: string;
  invoice_number: string;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  shipping_method: string;
  free_shipping_eligible: boolean;
  requires_provider_review: boolean;
  currency: string;
  /** Stripe columns left null — retired processor. */
  stripe_checkout_session_id: null;
  stripe_payment_intent_id: null;
  stripe_customer_id: null;
}

export interface InvoiceViewModel {
  invoiceNumber: string;
  orderNumber: string;
  paymentReference: string;
  customerName: string;
  customerEmail: string;
  orderDateIso: string;
  paymentMethod: PaymentMethod;
  paymentStatus: ManualPaymentStatus;
  items: OrderItemSnapshotInput[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  shippingMethod: string;
  currency: string;
  headline: string;
  memoInstruction: string;
}

export function isManualPaymentStatus(value: string): value is ManualPaymentStatus {
  return (MANUAL_PAYMENT_STATUSES as readonly string[]).includes(value);
}

export function isAnyPaymentStatus(value: string): value is AnyPaymentStatus {
  return (ALL_PAYMENT_STATUSES as readonly string[]).includes(value);
}

export function labelManualPaymentStatus(status: string): string {
  if (isManualPaymentStatus(status)) return MANUAL_PAYMENT_STATUS_LABELS[status];
  return status;
}

/** Use public order number as customer-visible payment memo/reference. */
export function paymentReferenceFromOrderNumber(publicOrderNumber: string): string {
  return publicOrderNumber.trim().toUpperCase();
}

export function invoiceNumberFromOrderNumber(publicOrderNumber: string): string {
  return `INV-${publicOrderNumber.trim().toUpperCase()}`;
}

export function buildManualOrderInsert(input: {
  customer: ManualOrderCustomerInput;
  totals: ManualOrderTotalsInput;
  paymentMethod: string;
  publicOrderNumber: string;
}): { ok: true; order: BuiltManualOrderInsert } | { ok: false; error: string } {
  if (!isOrderPaymentMethod(input.paymentMethod) || input.paymentMethod === 'plaid_ach') {
    return { ok: false, error: 'Invalid payment method.' };
  }
  const email = input.customer.customerEmail?.trim() ?? '';
  if (!email || !email.includes('@')) {
    return { ok: false, error: 'A valid email is required.' };
  }
  const name = input.customer.customerName?.trim() ?? '';
  if (!name) {
    return { ok: false, error: 'Customer name is required.' };
  }
  const t = input.totals;
  if (t.totalCents < 0 || t.subtotalCents < 0 || t.shippingCents < 0 || t.taxCents < 0) {
    return { ok: false, error: 'Order totals are invalid.' };
  }
  const expected = t.subtotalCents - t.discountCents + t.shippingCents + t.taxCents;
  if (expected !== t.totalCents) {
    return { ok: false, error: 'Order total does not reconcile with line amounts.' };
  }
  const publicOrderNumber = input.publicOrderNumber.trim().toUpperCase();
  if (!publicOrderNumber) {
    return { ok: false, error: 'Order number is required.' };
  }

  return {
    ok: true,
    order: {
      customer_user_id: input.customer.customerUserId ?? null,
      customer_email: email,
      customer_name: name,
      order_status: 'order_received',
      payment_status: 'awaiting_payment',
      payment_method: input.paymentMethod,
      payment_reference: paymentReferenceFromOrderNumber(publicOrderNumber),
      invoice_number: invoiceNumberFromOrderNumber(publicOrderNumber),
      subtotal_cents: t.subtotalCents,
      discount_cents: t.discountCents,
      shipping_cents: t.shippingCents,
      tax_cents: t.taxCents,
      total_cents: t.totalCents,
      shipping_method: t.shippingMethod,
      free_shipping_eligible: t.freeShippingEligible,
      requires_provider_review: t.requiresProviderReview,
      currency: t.currency ?? 'usd',
      stripe_checkout_session_id: null,
      stripe_payment_intent_id: null,
      stripe_customer_id: null,
    },
  };
}

export function buildInvoiceViewModel(input: {
  publicOrderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDateIso: string;
  paymentMethod: PaymentMethod;
  paymentStatus: ManualPaymentStatus;
  items: OrderItemSnapshotInput[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  shippingMethod: string;
  currency?: string;
}): InvoiceViewModel {
  const orderNumber = input.publicOrderNumber.trim().toUpperCase();
  return {
    invoiceNumber: invoiceNumberFromOrderNumber(orderNumber),
    orderNumber,
    paymentReference: paymentReferenceFromOrderNumber(orderNumber),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    orderDateIso: input.orderDateIso,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentStatus,
    items: input.items,
    subtotalCents: input.subtotalCents,
    discountCents: input.discountCents,
    shippingCents: input.shippingCents,
    taxCents: input.taxCents,
    totalCents: input.totalCents,
    shippingMethod: input.shippingMethod,
    currency: input.currency ?? 'usd',
    headline: INVOICE_RECEIVED_HEADLINE,
    memoInstruction: INVOICE_MEMO_INSTRUCTION,
  };
}

/** Allowed payment_status transitions for manual invoice flow. */
export function canTransitionPaymentStatus(
  from: string,
  to: ManualPaymentStatus,
): boolean {
  if (from === to) return true;
  const allowed: Record<string, ManualPaymentStatus[]> = {
    awaiting_payment: ['payment_under_review', 'paid', 'payment_failed', 'cancelled'],
    payment_under_review: ['paid', 'payment_failed', 'awaiting_payment', 'cancelled'],
    payment_failed: ['awaiting_payment', 'cancelled'],
    pending: ['awaiting_payment', 'paid', 'payment_failed', 'cancelled'], // legacy
    paid: ['refunded'],
    cancelled: [],
    refunded: [],
  };
  return (allowed[from] ?? []).includes(to);
}

export function assertMarkPaymentReceived(input: {
  currentPaymentStatus: string;
  expectedTotalCents: number;
  confirmedTotalCents: number;
}): { ok: true } | { ok: false; error: string } {
  if (!canTransitionPaymentStatus(input.currentPaymentStatus, 'paid')) {
    return {
      ok: false,
      error: `Cannot mark payment received from status "${input.currentPaymentStatus}".`,
    };
  }
  if (input.confirmedTotalCents !== input.expectedTotalCents) {
    return { ok: false, error: 'Confirmed amount must match the order total due.' };
  }
  return { ok: true };
}

export function createPaymentAccessToken(): string {
  const bytes = new Uint8Array(24);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export interface BankInstructionsPublic {
  method: PaymentMethod;
  configured: boolean;
  bankName?: string;
  accountName?: string;
  routingNumber?: string;
  accountNumber?: string;
  wireBankName?: string;
  wireRoutingNumber?: string;
  wireAccountNumber?: string;
  wireSwift?: string;
  additionalInstructions?: string;
  unavailableMessage?: string;
  /** Kashu hosted checkout — no bank details exposed. */
  hostedCheckout?: boolean;
}

/**
 * Maps server-side secrets into a customer-facing payload.
 * Never call this from the browser with real secrets — Edge Functions only.
 */
export function bankInstructionsFromEnv(
  method: PaymentMethod,
  env: Record<string, string | undefined>,
): BankInstructionsPublic {
  if (method === 'kashu_card') {
    return {
      method,
      configured: true,
      hostedCheckout: true,
      additionalInstructions:
        'You will be redirected to Kashu’s secure card checkout to complete payment.',
    };
  }
  if (method === 'manual_ach') {
    const bankName = env.MANUAL_ACH_BANK_NAME?.trim();
    const accountName = env.MANUAL_ACH_ACCOUNT_NAME?.trim();
    const routingNumber = env.MANUAL_ACH_ROUTING_NUMBER?.trim();
    const accountNumber = env.MANUAL_ACH_ACCOUNT_NUMBER?.trim();
    const configured = Boolean(bankName && accountName && routingNumber && accountNumber);
    if (!configured) {
      return {
        method,
        configured: false,
        unavailableMessage:
          'Bank transfer details are being prepared. Please contact us with your order number for payment instructions.',
      };
    }
    return {
      method,
      configured: true,
      bankName,
      accountName,
      routingNumber,
      accountNumber,
      additionalInstructions: env.MANUAL_ACH_ADDITIONAL_INSTRUCTIONS?.trim() || undefined,
    };
  }

  const wireBankName = env.MANUAL_WIRE_BANK_NAME?.trim();
  const wireRoutingNumber = env.MANUAL_WIRE_ROUTING_NUMBER?.trim();
  const wireAccountNumber = env.MANUAL_WIRE_ACCOUNT_NUMBER?.trim();
  const configured = Boolean(wireBankName && wireRoutingNumber && wireAccountNumber);
  if (!configured) {
    return {
      method,
      configured: false,
      unavailableMessage:
        'Wire transfer details are being prepared. Please contact us with your order number for payment instructions.',
    };
  }
  return {
    method,
    configured: true,
    wireBankName,
    wireRoutingNumber,
    wireAccountNumber,
    wireSwift: env.MANUAL_WIRE_SWIFT?.trim() || undefined,
    accountName: env.MANUAL_WIRE_ACCOUNT_NAME?.trim() || undefined,
    additionalInstructions: env.MANUAL_WIRE_ADDITIONAL_INSTRUCTIONS?.trim() || undefined,
  };
}
