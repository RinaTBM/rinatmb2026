export const CARE_CHECKOUT_OPENED = 'mbm:care-checkout-opened';
export const CARE_CHECKOUT_REQUESTED = 'mbm:care-checkout-requested';

export function validatedCareCheckoutUrl(value: string): string {
  const url = new URL(value);
  if (url.origin !== 'https://app.genhealthehr.com' || url.username || url.password ||
      !/^\/f5e0mdyBYnDh7HGvek0C\/product\/[^/]+$/.test(url.pathname)) {
    throw new Error('GEN_CHECKOUT_URL_NOT_ALLOWED');
  }
  return url.toString();
}

/** Opens only on a user gesture. A closed/blocked window never means completed care. */
export function openCareCheckoutWindow(value: string): void {
  const url = validatedCareCheckoutUrl(value);
  if (import.meta.env.VITE_CARE_PROGRESS_ENABLED === 'true') {
    const request = new CustomEvent(CARE_CHECKOUT_REQUESTED, { cancelable: true, detail: { url } });
    if (!window.dispatchEvent(request)) return;
  }
  continueCareCheckoutWindow(url);
}

/** Explicit continuation after the optional progress form; never opens twice. */
export function continueCareCheckoutWindow(value: string): void {
  const url = validatedCareCheckoutUrl(value);
  try {
    window.open(url, '_blank', 'popup,width=620,height=820,noopener,noreferrer');
  } catch {
    // Some embedded browsers disallow popups; the return dialog provides a normal link.
  } finally {
    // noopener may return null even on success; offer an explicit fallback, not a second popup.
    window.dispatchEvent(new CustomEvent(CARE_CHECKOUT_OPENED, { detail: { url } }));
  }
}
