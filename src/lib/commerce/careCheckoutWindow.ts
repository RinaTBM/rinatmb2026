export const CARE_CHECKOUT_OPENED = 'mbm:care-checkout-opened';

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
  try {
    window.open(url, '_blank', 'popup,width=620,height=820,noopener,noreferrer');
  } catch {
    // Some embedded browsers disallow popups; the return dialog provides a normal link.
  } finally {
    // noopener may return null even on success; offer an explicit fallback, not a second popup.
    window.dispatchEvent(new CustomEvent(CARE_CHECKOUT_OPENED, { detail: { url } }));
  }
}
