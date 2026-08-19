/**
 * Client helper: start Kashu/Tagada hosted checkout for a persisted MBM order.
 * Never sends API secrets from the browser — Edge Function only.
 */

import { isApprovedKashuCheckoutRedirectUrl } from './kashuTagada';

export interface CreateKashuCheckoutSuccess {
  ok: true;
  redirectUrl: string;
  checkoutToken: string | null;
  publicOrderNumber: string;
  orderTotalCents: number;
}

export interface CreateKashuCheckoutFailure {
  ok: false;
  error: string;
  missingSkus?: string[];
}

export async function createKashuCheckoutSession(input: {
  supabaseUrl: string;
  anonKey: string;
  accessToken?: string | null;
  publicOrderNumber: string;
  paymentAccessToken: string;
}): Promise<CreateKashuCheckoutSuccess | CreateKashuCheckoutFailure> {
  try {
    const res = await fetch(`${input.supabaseUrl}/functions/v1/create-kashu-checkout-session`, {
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
        error: typeof data?.error === 'string' ? data.error : 'Unable to start card checkout.',
        missingSkus: Array.isArray(data?.missingSkus) ? data.missingSkus : undefined,
      };
    }
    const redirectUrl = String(data.redirectUrl);
    const approved = isApprovedKashuCheckoutRedirectUrl(redirectUrl);
    if (!approved.ok) {
      return { ok: false, error: 'Unable to start card checkout.' };
    }
    return {
      ok: true,
      redirectUrl: approved.url.toString(),
      checkoutToken: data.checkoutToken ?? null,
      publicOrderNumber: String(data.publicOrderNumber || input.publicOrderNumber),
      orderTotalCents: Number(data.orderTotalCents) || 0,
    };
  } catch {
    return { ok: false, error: 'Network error starting card checkout. Please try again.' };
  }
}
