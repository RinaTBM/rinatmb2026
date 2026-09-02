const HIGHLEVEL_WEBHOOK_URL = import.meta.env.VITE_HIGHLEVEL_WEBHOOK_URL;

export const LEAD_CAPTURE_SOURCE = 'highlevel-lead-capture';

export interface LeadCaptureData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  page?: string;
}

export async function captureHighLevelLead(data: LeadCaptureData): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === 'undefined') return { ok: false, error: 'Server-side' };
  if (!HIGHLEVEL_WEBHOOK_URL) return { ok: false, error: 'Not configured' };

  try {
    const response = await fetch(HIGHLEVEL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        source: data.source || LEAD_CAPTURE_SOURCE,
        page: data.page || window.location.pathname,
        timestamp: new Date().toISOString(),
      }),
    });
    if (!response.ok) return { ok: false, error: `HTTP ${response.status}` };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
