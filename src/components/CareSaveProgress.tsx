import { useEffect, useRef, useState } from 'react';
import { CARE_CHECKOUT_REQUESTED, continueCareCheckoutWindow, validatedCareCheckoutUrl } from '@/lib/commerce/careCheckoutWindow';
import { CareProgressForm } from './CareProgressForm';

/** Checkout interception stays gated until reminder enrollment is verified. */
export function CareSaveProgress() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [url, setUrl] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const requested = (event: Event) => {
      const value = (event as CustomEvent<{ url: string }>).detail?.url;
      try {
        const destination = validatedCareCheckoutUrl(value);
        if (!dialog.current) return;
        event.preventDefault();
        setUrl(destination); setAttempt(value => value + 1);
        dialog.current.showModal();
      } catch { /* Invalid checkout destinations are not captured. */ }
    };
    window.addEventListener(CARE_CHECKOUT_REQUESTED, requested);
    return () => window.removeEventListener(CARE_CHECKOUT_REQUESTED, requested);
  }, []);
  return <dialog ref={dialog} aria-labelledby="care-save-title" className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl bg-cream-50 p-7 text-ink-900 shadow-2xl backdrop:bg-black/50">
    <h2 id="care-save-title" className="font-serif text-2xl">Save your progress</h2>
    {url && <CareProgressForm key={attempt} checkoutUrl={url} onContinue={() => {
      dialog.current?.close(); setUrl(''); continueCareCheckoutWindow(url);
    }} />}
    <button type="button" className="mt-4 w-full text-sm" onClick={() => { dialog.current?.close(); setUrl(''); }}>Back to shopping</button>
  </dialog>;
}
