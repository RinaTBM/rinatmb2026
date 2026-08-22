/**
 * Client helper: start GEN Hosted Checkout → Whop for a persisted MBM order.
 * Never sends GEN product IDs or storefront secrets from the browser — Edge only.
 */

import {
  GEN_WHOP_CHECKOUT_INIT_FAILED_MESSAGE,
  isApprovedWhopCheckoutRedirectUrl,
  navigateToWhopHostedCheckout,
} from './genWhopCheckout';

export interface CreateGenWhopCheckoutSuccess {
  ok: true;
  redirectUrl: string;
  publicOrderNumber: string;
  genCheckoutSessionId: string;
  whopCheckoutConfigId: string | null;
  reused: boolean;
  correlationId: string | null;
  expectedAmountCents: number;
  currency: string;
}

export interface CreateGenWhopCheckoutFailure {
  ok: false;
  error: string;
  code?: string;
  route?: string;
}

export async function createGenWhopCheckoutSession(input: {
  supabaseUrl: string;
  anonKey: string;
  accessToken?: string | null;
  publicOrderNumber: string;
  paymentAccessToken: string;
}): Promise<CreateGenWhopCheckoutSuccess | CreateGenWhopCheckoutFailure> {
  try {
    const res = await fetch(`${input.supabaseUrl}/functions/v1/create-gen-whop-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${input.accessToken || input.anonKey}`,
        apikey: input.anonKey,
      },
      body: JSON.stringify({
        publicOrderNumber: input.publicOrderNumber,
        paymentAccessToken: input.paymentAccessToken,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.redirectUrl) {
      return {
        ok: false,
        error:
          typeof data?.error === 'string'
            ? data.error
            : GEN_WHOP_CHECKOUT_INIT_FAILED_MESSAGE,
        code: typeof data?.code === 'string' ? data.code : undefined,
        route: typeof data?.route === 'string' ? data.route : undefined,
      };
    }
    const redirectUrl = String(data.redirectUrl);
    const approved = isApprovedWhopCheckoutRedirectUrl(redirectUrl);
    if (!approved.ok) {
      return { ok: false, error: GEN_WHOP_CHECKOUT_INIT_FAILED_MESSAGE, code: 'UNAPPROVED_REDIRECT' };
    }
    return {
      ok: true,
      redirectUrl: approved.url.toString(),
      publicOrderNumber: String(data.publicOrderNumber || input.publicOrderNumber),
      genCheckoutSessionId: String(data.genCheckoutSessionId || ''),
      whopCheckoutConfigId:
        typeof data.whopCheckoutConfigId === 'string' ? data.whopCheckoutConfigId : null,
      reused: Boolean(data.reused),
      correlationId: typeof data.correlationId === 'string' ? data.correlationId : null,
      expectedAmountCents: Number(data.expectedAmountCents) || 0,
      currency: String(data.currency || 'USD'),
    };
  } catch {
    return {
      ok: false,
      error: 'Network error starting clinical checkout. Please try again.',
      code: 'NETWORK',
    };
  }
}

export { navigateToWhopHostedCheckout };
