import { getMarketingAttribution } from './marketingAttribution';
import { trackMetaLead } from './metaPixel';
import { supabase } from './supabaseClient';

export interface LeadCaptureInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  subject?: string;
  message?: string;
  formType?: string;
  smsConsent?: boolean;
  source?: string;
  pagePath?: string;
  attribution?: Record<string, unknown>;
}

export async function captureLead(payload: LeadCaptureInput): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!supabase) {
      return { ok: false, error: 'Lead capture is unavailable' };
    }

    const { data, error } = await supabase.functions.invoke('highlevel-lead-capture', {
      body: {
        ...payload,
        attribution: payload.attribution || getMarketingAttribution(),
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (data && typeof data === 'object' && 'error' in data) {
      return { ok: false, error: (data as { error: string }).error };
    }

    trackMetaLead();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Lead capture failed' };
  }
}
