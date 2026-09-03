import { getMarketingAttribution, type MarketingAttribution } from './marketingAttribution';
import { trackMetaLead } from './metaPixel';
import { getGuidedPopupInterest } from './highlevelPopupContext';

export type HighLevelLeadEvent =
  | 'contact_form'
  | 'newsletter_signup'
  | 'product_interest'
  | 'category_interest'
  | 'abandoned_cart'
  | 'new_client_welcome';

export type HighLevelLeadPayload = {
  event: HighLevelLeadEvent;
  name?: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  sourcePage?: string;
  interestCategory?: string;
  interestLabel?: string;
  cartValueCents?: number;
  attribution?: MarketingAttribution;
};

export async function sendHighLevelLead(payload: HighLevelLeadPayload): Promise<{
  ok: boolean;
  skipped?: boolean;
  error?: string;
}> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!supabaseUrl || !anonKey) {
    return { ok: true, skipped: true };
  }

  try {
    const guidedPopupInterest = getGuidedPopupInterest();
    const res = await fetch(`${supabaseUrl}/functions/v1/highlevel-lead-capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        ...payload,
        interestCategory: payload.interestCategory || guidedPopupInterest?.interestCategory,
        interestLabel: payload.interestLabel || guidedPopupInterest?.interestLabel,
        attribution: payload.attribution || getMarketingAttribution(),
        sourcePage:
          payload.sourcePage ||
          (typeof window !== 'undefined'
            ? `${window.location.pathname}${window.location.search}`
            : undefined),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: data?.error || 'lead_capture_failed' };
    }
    trackMetaLead();
    return { ok: true };
  } catch {
    return { ok: false, error: 'lead_capture_unavailable' };
  }
}
