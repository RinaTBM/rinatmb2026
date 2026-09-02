declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

let initialized = false;

export function initMetaPixel() {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !document.head || initialized) return;

  const pixelId = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
  if (!pixelId) return;

  initialized = true;

  if (!window.fbq) {
    const fbq = (...args: unknown[]) => {
      (fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args));
    };
    fbq.queue = [] as unknown[];
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.callMethod = undefined as undefined | ((...args: unknown[]) => void);
    window.fbq = fbq as typeof window.fbq;
    window._fbq = window.fbq;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }

  window.fbq?.('init', pixelId);
  window.fbq?.('track', 'PageView');
}

export function trackMetaLead() {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'Lead');
}
