const ATTRIBUTION_KEY = 'mbm_marketing_attribution';

interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_page?: string;
  timestamp: string;
}

function getQueryParam(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return new URLSearchParams(window.location.search).get(name) ?? undefined;
  } catch {
    return undefined;
  }
}

function readStoredAttribution(): AttributionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(ATTRIBUTION_KEY);
    return stored ? (JSON.parse(stored) as AttributionData) : null;
  } catch {
    return null;
  }
}

function writeStoredAttribution(data: AttributionData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data));
  } catch {
    /* Ignore unavailable browser storage. */
  }
}

export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  const utm_source = getQueryParam('utm_source');
  const utm_medium = getQueryParam('utm_medium');
  const utm_campaign = getQueryParam('utm_campaign');
  const utm_term = getQueryParam('utm_term');
  const utm_content = getQueryParam('utm_content');

  const hasNewUtm = Boolean(utm_source || utm_medium || utm_campaign);
  const existing = readStoredAttribution();

  if (hasNewUtm || !existing) {
    writeStoredAttribution({
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      referrer: document.referrer || undefined,
      landing_page: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  }
}

export function getAttribution(): AttributionData | null {
  return readStoredAttribution();
}
