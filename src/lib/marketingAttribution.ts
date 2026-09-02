export type MarketingAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  gclid?: string;
  msclkid?: string;
  landingPage?: string;
  referrer?: string;
  capturedAt?: string;
};

const STORAGE_KEY = 'mbm_marketing_attribution';

const PARAM_MAP: Array<[keyof MarketingAttribution, string]> = [
  ['utmSource', 'utm_source'],
  ['utmMedium', 'utm_medium'],
  ['utmCampaign', 'utm_campaign'],
  ['utmContent', 'utm_content'],
  ['utmTerm', 'utm_term'],
  ['fbclid', 'fbclid'],
  ['gclid', 'gclid'],
  ['msclkid', 'msclkid'],
];

function clean(value: string | null, max = 300) {
  return value ? value.trim().slice(0, max) : '';
}

function readStoredAttribution(): MarketingAttribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MarketingAttribution) : {};
  } catch {
    return {};
  }
}

export function captureMarketingAttribution() {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const next: MarketingAttribution = {};

  for (const [field, param] of PARAM_MAP) {
    const value = clean(params.get(param));
    if (value) next[field] = value;
  }

  if (!Object.keys(next).length) return;

  const existing = readStoredAttribution();
  const attribution: MarketingAttribution = {
    ...existing,
    ...next,
    landingPage: existing.landingPage || `${window.location.pathname}${window.location.search}`,
    referrer: existing.referrer || clean(document.referrer, 500),
    capturedAt: existing.capturedAt || new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution is helpful, not required for checkout or lead capture.
  }
}

export function getMarketingAttribution(): MarketingAttribution {
  return readStoredAttribution();
}
