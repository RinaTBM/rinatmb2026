import { useEffect, useRef, useState } from 'react';
import { CARE_CHECKOUT_OPENED, validatedCareCheckoutUrl } from '@/lib/commerce/careCheckoutWindow';

export function CareCheckoutReturn() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [url, setUrl] = useState('');
  useEffect(() => {
    const opened = (event: Event) => {
      try {
        setUrl(validatedCareCheckoutUrl((event as CustomEvent<{ url: string }>).detail.url));
        dialog.current?.showModal();
      } catch { /* Ignore invalid destinations. */ }
    };
    window.addEventListener(CARE_CHECKOUT_OPENED, opened);
    return () => window.removeEventListener(CARE_CHECKOUT_OPENED, opened);
  }, []);
  return (
    <dialog ref={dialog} aria-labelledby="care-window-title" className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl bg-cream-50 p-7 text-ink-900 shadow-2xl backdrop:bg-black/50">
      <h2 id="care-window-title" className="font-serif text-2xl">Your My Bare Method page stays here</h2>
      <p className="mt-4 text-sm leading-relaxed">Continue in the GEN Health window, then return here when you are ready. On your phone, checkout may open in a new tab.</p>
      <p className="mt-3 text-sm leading-relaxed">If checkout did not open, use the link below. If it is already open, continue in that window to avoid starting over.</p>
      {url && <a href={url} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4 w-full">Open GEN Health in a new tab</a>}
      <p className="mt-4 text-xs leading-relaxed text-ink-600">Returning here does not confirm payment or intake completion. If you already paid, do not pay again. Our team verifies external payments.</p>
      <a href="mailto:info@thebaremethodmn.com" className="mt-3 inline-block text-sm underline">Get help with your order</a>
      <button type="button" onClick={() => dialog.current?.close()} className="btn-primary mt-5 w-full">Back to My Bare Method</button>
    </dialog>
  );
}
