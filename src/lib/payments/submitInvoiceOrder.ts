/**
 * Client helper: submit manual invoice order via Edge Function.
 * Never sends or receives bank credentials through VITE_* env.
 */

import type { ActiveCheckoutPaymentMethod } from './paymentMethods';
import type { BankInstructionsPublic, InvoiceViewModel } from './manualInvoice';
import { sanitizeCheckoutOrderError } from '../orders/orderNumber';

export interface SubmitInvoiceOrderItem {
  productId: string;
  quantity: number;
  subscription?: boolean;
  purchaseType?: string;
  unitAmountCents: number;
  standardPriceCents?: number;
  discountPercent?: number;
  appliedDiscount?: string;
  productName: string;
  variantId?: string;
  variantLabel?: string;
  /** Retail variant SKU or membership PROGRAM SKU. */
  sku?: string;
  /** Membership dose → retail medication fulfillment SKU. */
  fulfillmentSku?: string;
  section?: string;
  /** Product slug (required for HRT / therapy-family detection server-side). */
  slug?: string;
  membershipSlug?: string;
  requestedFormulation?: string;
  memberPricingEligible?: boolean;
}

export interface SubmitInvoiceOrderRequest {
  paymentMethod: ActiveCheckoutPaymentMethod;
  isActiveMember: boolean;
  customerUserId?: string;
  customerEmail: string;
  customerName: string;
  subtotalCents: number;
  discountCents: number;
  /** Optional promo code (e.g. OGTBM). Server re-authorizes discount. */
  promoCode?: string | null;
  shippingCents: number;
  taxCents: number;
  providerCareTaxCents?: number;
  providerCareTaxableSubtotalCents?: number;
  accessorySalesTaxCents?: number;
  accessoryTaxableSubtotalCents?: number;
  shippingMethod: string;
  freeShippingEligible: boolean;
  requiresProviderReview: boolean;
  /** Must equal subtotal - discount + shipping + tax. */
  totalCents: number;
  items: SubmitInvoiceOrderItem[];
}

export interface SubmitInvoiceOrderSuccess {
  ok: true;
  orderId: string;
  publicOrderNumber: string;
  paymentAccessToken: string;
  paymentPath: string;
  invoice: InvoiceViewModel;
  bankInstructions: BankInstructionsPublic;
}

export interface SubmitInvoiceOrderFailure {
  ok: false;
  error: string;
}

export async function submitInvoiceOrder(input: {
  supabaseUrl: string;
  anonKey: string;
  accessToken?: string | null;
  body: SubmitInvoiceOrderRequest;
}): Promise<SubmitInvoiceOrderSuccess | SubmitInvoiceOrderFailure> {
  try {
    const res = await fetch(`${input.supabaseUrl}/functions/v1/create-invoice-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${input.accessToken || input.anonKey}`,
        apikey: input.anonKey,
      },
      body: JSON.stringify(input.body),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      return {
        ok: false,
        error: sanitizeCheckoutOrderError(
          typeof data.error === 'string' ? data.error : '',
        ),
      };
    }
    if (
      typeof data.orderId !== 'string' ||
      typeof data.publicOrderNumber !== 'string' ||
      typeof data.paymentAccessToken !== 'string'
    ) {
      return { ok: false, error: 'Order response was incomplete. Please contact us with your email.' };
    }
    return {
      ok: true,
      orderId: data.orderId,
      publicOrderNumber: data.publicOrderNumber,
      paymentAccessToken: data.paymentAccessToken,
      paymentPath:
        typeof data.paymentPath === 'string'
          ? data.paymentPath
          : `/order/payment/${encodeURIComponent(data.publicOrderNumber)}?token=${encodeURIComponent(data.paymentAccessToken)}`,
      invoice: data.invoice as InvoiceViewModel,
      bankInstructions: data.bankInstructions as BankInstructionsPublic,
    };
  } catch {
    return {
      ok: false,
      error: 'Unable to reach the order service. Please try again or contact us for assistance.',
    };
  }
}

export async function fetchPaymentInstructions(input: {
  supabaseUrl: string;
  anonKey: string;
  publicOrderNumber: string;
  paymentAccessToken: string;
}): Promise<
  | { ok: true; invoice: InvoiceViewModel; bankInstructions: BankInstructionsPublic }
  | { ok: false; error: string }
> {
  try {
    const res = await fetch(`${input.supabaseUrl}/functions/v1/get-payment-instructions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${input.anonKey}`,
        apikey: input.anonKey,
      },
      body: JSON.stringify({
        publicOrderNumber: input.publicOrderNumber,
        paymentAccessToken: input.paymentAccessToken,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      return {
        ok: false,
        error: typeof data.error === 'string' ? data.error : 'Unable to load payment instructions.',
      };
    }
    return {
      ok: true,
      invoice: data.invoice as InvoiceViewModel,
      bankInstructions: data.bankInstructions as BankInstructionsPublic,
    };
  } catch {
    return { ok: false, error: 'Unable to load payment instructions. Please contact us with your order number.' };
  }
}
