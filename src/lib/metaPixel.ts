const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

function getHead(): HTMLHeadElement | null {
  if (typeof document === 'undefined') return null;
  return document.head || document.getElementsByTagName('head')[0] || null;
}

export function initMetaPixel(): void {
  if (typeof window === 'undefined') return;
  if (!META_PIXEL_ID) return;
  const head = getHead();
  if (!head) return;

  const w = window as typeof window & { fbq?: any; _fbq?: any };
  if (w.fbq) return;

  const n: any = function (this: any) {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  w.fbq = n;
  w._fbq = n;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  head.appendChild(script);

  w.fbq('init', META_PIXEL_ID);
  w.fbq('track', 'PageView');
}

export function trackMetaEvent(eventName: string, data?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const w = window as typeof window & { fbq?: any };
  if (!w.fbq) return;
  w.fbq('track', eventName, data);
}
