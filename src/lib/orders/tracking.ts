export const TRACKING_CARRIERS = ['UPS', 'FedEx', 'USPS', 'Other'] as const;
export type TrackingCarrier = (typeof TRACKING_CARRIERS)[number];

export function isTrackingCarrier(value: string): value is TrackingCarrier {
  return (TRACKING_CARRIERS as readonly string[]).includes(value);
}

/** Build a trusted carrier tracking URL from number; never invent tracking numbers. */
export function buildCarrierTrackingUrl(
  carrier: TrackingCarrier | string | null | undefined,
  trackingNumber: string | null | undefined,
): string | null {
  const tn = (trackingNumber ?? '').trim();
  if (!tn) return null;
  const c = (carrier ?? '').trim();
  switch (c) {
    case 'UPS':
      return `https://www.ups.com/track?tracknum=${encodeURIComponent(tn)}`;
    case 'FedEx':
      return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(tn)}`;
    case 'USPS':
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(tn)}`;
    default:
      return null;
  }
}

export function isValidHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Resolve the tracking URL to store/display.
 * - UPS/FedEx/USPS: constructed from tracking number (ignores arbitrary URLs).
 * - Other: requires a validated HTTPS tracking URL.
 */
export function resolveTrackingUrl(input: {
  carrier: string | null | undefined;
  trackingNumber: string | null | undefined;
  trackingUrl?: string | null | undefined;
}): { ok: true; url: string | null } | { ok: false; error: string } {
  const carrier = (input.carrier ?? '').trim();
  const tn = (input.trackingNumber ?? '').trim();

  if (!carrier) {
    if (!tn && !input.trackingUrl) return { ok: true, url: null };
    return { ok: false, error: 'Select a carrier before adding tracking.' };
  }

  if (!isTrackingCarrier(carrier)) {
    return { ok: false, error: 'Unsupported carrier.' };
  }

  if (carrier === 'Other') {
    const url = (input.trackingUrl ?? '').trim();
    if (!url) return { ok: false, error: 'A HTTPS tracking URL is required for Other carriers.' };
    if (!isValidHttpsUrl(url)) return { ok: false, error: 'Tracking URL must be a valid HTTPS link.' };
    if (!tn) return { ok: false, error: 'Tracking number is required.' };
    return { ok: true, url };
  }

  if (!tn) return { ok: false, error: 'Tracking number is required.' };
  const built = buildCarrierTrackingUrl(carrier, tn);
  if (!built) return { ok: false, error: 'Could not build a trusted tracking URL.' };
  return { ok: true, url: built };
}

export function rejectArbitraryUnsafeTrackingUrl(
  carrier: string,
  candidateUrl: string | null | undefined,
): boolean {
  // For known carriers we never trust an arbitrary admin URL over constructed ones.
  if (carrier === 'UPS' || carrier === 'FedEx' || carrier === 'USPS') {
    if (!candidateUrl) return false;
    const builtPrefix =
      carrier === 'UPS'
        ? 'https://www.ups.com/'
        : carrier === 'FedEx'
          ? 'https://www.fedex.com/'
          : 'https://tools.usps.com/';
    return !candidateUrl.startsWith(builtPrefix);
  }
  return false;
}
