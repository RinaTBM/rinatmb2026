import { useState } from 'react';
import { ArrowRight, ExternalLink, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { navigate } from '@/router';
import { usePrescriptionBasket } from '@/context/PrescriptionBasketContext';
import { navigateToGenProductFirstCheckout, resolveGenProductFirstCheckout } from '@/lib/commerce/genHostedCheckout';

const HRT_CATEGORY = 'womens-hormone-therapy';
const INITIAL_VISIT_CENTS = 7500;

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function PrescriptionBasketDrawer() {
  const { items, isOpen, itemCount, medicationSubtotal, closeBasket, removeItem } = usePrescriptionBasket();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const hasHrt = items.some(item => item.category === HRT_CATEGORY);
  const hasLabItems = items.some(item => item.category === 'labs');
  const hasPrescriptionItems = items.some(item => item.category !== 'labs');
  const selectedItem = items.find(item => item.slug === selectedSlug) ?? items[0] ?? null;
  const selectedItemAvailable = selectedItem
    ? Boolean(selectedItem.checkoutUrl) || resolveGenProductFirstCheckout(selectedItem.genClientProductId).ok
    : false;
  const estimatedTotalCents =
    Math.round(medicationSubtotal * 100) +
    (hasPrescriptionItems ? INITIAL_VISIT_CENTS : 0);

  const beginGenCheckout = (item: NonNullable<typeof selectedItem>) => {
    if (item.checkoutUrl) {
      window.open(item.checkoutUrl, '_top', 'noopener,noreferrer');
      return;
    }
    const checkout = resolveGenProductFirstCheckout(item.genClientProductId);
    if (checkout.ok) navigateToGenProductFirstCheckout(checkout.url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[75]">
      <div className="absolute inset-0 bg-ink-950/45 backdrop-blur-sm animate-fade-in" onClick={closeBasket} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-cream-50 shadow-2xl animate-slide-in" aria-label="Care basket">
        <div className="flex items-center justify-between border-b border-cream-300 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={21} className="text-ink-800" />
            <span className="font-serif text-lg font-medium">Care Basket</span>
            <span className="text-sm text-ink-400">({itemCount})</span>
          </div>
          <button type="button" onClick={closeBasket} aria-label="Close care basket"><X size={22} className="text-ink-500 hover:text-ink-900" /></button>
        </div>

        <div className="mx-5 mt-4 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3">
          <p className="text-xs font-semibold text-gold-800">Prescriptions, labs, and accessories are purchased separately.</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-600">This basket saves care selections while you shop. GEN Health remains the secure source for final payment, intake, assessment, provider review, and approval.</p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-4 rounded-full bg-cream-200 p-6"><ShoppingBag size={32} className="text-ink-400" /></div>
            <p className="font-serif text-xl text-ink-900">Your care basket is empty</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">Add prescription or lab options here before starting secure GEN Health checkout.</p>
            <button type="button" onClick={() => { closeBasket(); navigate('/shop-all'); }} className="btn-primary mt-6">Browse prescriptions <ArrowRight size={16} /></button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-3">
                {items.map(item => {
                  const available = Boolean(item.checkoutUrl) || resolveGenProductFirstCheckout(item.genClientProductId).ok;
                  return (
                    <div
                      key={item.slug}
                      className={`rounded-2xl border bg-white p-3 transition-colors ${
                        selectedItem?.slug === item.slug ? 'border-gold-400 ring-1 ring-gold-300' : 'border-cream-300'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img src={item.image} alt={item.imageAlt} className="h-20 w-20 rounded-xl bg-cream-100 object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-gold-600">{item.subtitle}</p>
                              <h3 className="font-serif text-lg leading-tight text-ink-900">{item.displayName}</h3>
                            </div>
                            <div className="flex items-center gap-1">
                              <label className="flex items-center gap-1.5 text-[11px] text-ink-500">
                                <input
                                  type="radio"
                                  name="selected-prescription"
                                  checked={selectedItem?.slug === item.slug}
                                  onChange={() => setSelectedSlug(item.slug)}
                                  aria-label={`Select ${item.displayName} for GEN checkout`}
                                  className="accent-gold-500"
                                />
                                Select
                              </label>
                              <button type="button" onClick={() => removeItem(item.slug)} aria-label={`Remove ${item.displayName}`} className="p-1 text-ink-400 hover:text-ink-900"><X size={16} /></button>
                            </div>
                          </div>
                          <p className="mt-1 text-sm font-medium text-ink-900">{money(Math.round(item.price * 100))}</p>
                          <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-500"><ShieldCheck size={12} className="text-gold-600" /> {item.category === 'labs' ? 'Lab order opens securely for payment and intake' : 'Provider review required · prescription not guaranteed'}</p>
                        </div>
                      </div>
                      {!available && <p className="mt-3 rounded-lg bg-cream-100 px-3 py-2 text-xs text-ink-600">Temporarily unavailable for secure GEN checkout.</p>}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-cream-300 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">Hormone therapy labs</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">Only applies when a Women’s Hormone Therapy product is selected.</p>
                  </div>
                </div>
                {hasHrt && (
                  <div className="mt-3 rounded-xl border border-gold-200 bg-gold-50 px-3 py-3">
                    <p className="text-sm font-medium text-ink-900">Choose a lab option</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">
                      If labs are required, select the in-home or walk-in lab option that fits you and add it to this Care Basket before completing the hormone therapy purchase.
                    </p>
                    <button
                      type="button"
                      onClick={() => { closeBasket(); navigate('/order-labs'); }}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold-800 underline"
                    >
                      View lab options <ArrowRight size={13} />
                    </button>
                  </div>
                )}
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  {hasHrt
                    ? hasLabItems
                      ? 'Selected lab options are included in the care selections estimate above.'
                      : 'No lab has been added yet.'
                    : 'No hormone therapy labs are needed for the current selections.'}
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-gold-200 bg-gold-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-800">Planning estimate</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3"><span className="text-ink-600">Care selections</span><span className="font-medium text-ink-900">{money(Math.round(medicationSubtotal * 100))}</span></div>
                  {hasPrescriptionItems && <div className="flex justify-between gap-3"><span className="text-ink-600">Initial provider visit, if required</span><span className="font-medium text-ink-900">{money(INITIAL_VISIT_CENTS)}</span></div>}
                  {hasHrt && <div className="flex justify-between gap-3"><span className="text-ink-600">Hormone therapy labs, if required</span><span className="font-medium text-ink-900">{hasLabItems ? 'Included above' : 'Choose option'}</span></div>}
                  {hasPrescriptionItems && <div className="flex justify-between gap-3"><span className="text-ink-600">Separate storefront shipping</span><span className="font-medium text-ink-900">$0.00</span></div>}
                  <div className="flex justify-between gap-3 border-t border-gold-200 pt-2"><span className="font-medium text-ink-900">Estimated total before GEN confirmation</span><span className="font-medium text-ink-900">{money(estimatedTotalCents)}</span></div>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-gold-900">GEN Health is authoritative for the final amount, lab option, visit requirement, shipping availability, and clinical approval. This basket does not charge your card.</p>
              </div>
            </div>

            <div className="border-t border-cream-300 px-5 py-4">
              <p className="mb-3 text-xs leading-relaxed text-ink-500">GEN Health currently starts one care checkout at a time. Your other selections stay saved here while you complete each secure review.</p>
              {selectedItem && (
                <div className="mb-3 rounded-xl border border-gold-200 bg-gold-50 p-3">
                  <p className="text-xs text-gold-900">Selected for next checkout: <span className="font-semibold">{selectedItem.displayName}</span></p>
                  <button
                    type="button"
                    onClick={() => beginGenCheckout(selectedItem)}
                    disabled={!selectedItemAvailable}
                    className="btn-primary mt-2 w-full text-sm"
                  >
                    {selectedItemAvailable ? <>Continue to GEN Health <ExternalLink size={14} /></> : 'Temporarily unavailable'}
                  </button>
                </div>
              )}
              <button type="button" onClick={closeBasket} className="btn-ghost w-full">Keep shopping</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
