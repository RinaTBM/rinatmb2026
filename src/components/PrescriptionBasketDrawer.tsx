import { useState } from 'react';
import { ArrowRight, ChevronDown, ExternalLink, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { navigate } from '@/router';
import { usePrescriptionBasket } from '@/context/PrescriptionBasketContext';
import { resolveGenProductFirstCheckout } from '@/lib/commerce/genHostedCheckout';

type ShippingOption = 'two_day' | 'next_day';

const HRT_CATEGORY = 'womens-hormone-therapy';
const INITIAL_VISIT_CENTS = 7500;
const TWO_DAY_SHIPPING_CENTS = 3000;
const NEXT_DAY_SHIPPING_CENTS = 5000;

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function PrescriptionBasketDrawer() {
  const { items, isOpen, itemCount, medicationSubtotal, closeBasket, removeItem } = usePrescriptionBasket();
  const [shippingOption, setShippingOption] = useState<ShippingOption>('two_day');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const hasHrt = items.some(item => item.category === HRT_CATEGORY);
  const hasLabItems = items.some(item => item.category === 'labs');
  const selectedItem = items.find(item => item.slug === selectedSlug) ?? items[0] ?? null;
  const selectedItemAvailable = selectedItem
    ? Boolean(selectedItem.checkoutUrl) || resolveGenProductFirstCheckout(selectedItem.genClientProductId).ok
    : false;
  const shippingCents = shippingOption === 'two_day' ? TWO_DAY_SHIPPING_CENTS : NEXT_DAY_SHIPPING_CENTS;
  const estimatedTotalCents = Math.round(medicationSubtotal * 100) + shippingCents + INITIAL_VISIT_CENTS;

  const beginCheckout = (item: typeof selectedItem) => {
    if (!item) return;
    if (item.checkoutUrl) {
      window.open(item.checkoutUrl, '_top', 'noopener,noreferrer');
      return;
    }
    const checkout = resolveGenProductFirstCheckout(item.genClientProductId);
    if (checkout.ok) window.open(checkout.url, '_top', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[75]">
      <div className="absolute inset-0 bg-ink-950/45 backdrop-blur-sm animate-fade-in" onClick={closeBasket} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-cream-50 shadow-2xl animate-slide-in" aria-label="Prescription care basket">
        <div className="flex items-center justify-between border-b border-cream-300 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={21} className="text-ink-800" />
            <span className="font-serif text-lg font-medium">Prescription Care</span>
            <span className="text-sm text-ink-400">({itemCount})</span>
          </div>
          <button type="button" onClick={closeBasket} aria-label="Close prescription basket"><X size={22} className="text-ink-500 hover:text-ink-900" /></button>
        </div>

        <div className="mx-5 mt-4 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3">
          <p className="text-xs font-semibold text-gold-800">Prescriptions and accessories are purchased separately.</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-600">This basket saves prescription selections while you shop. GEN Health remains the secure source for final payment, intake, assessment, provider review, and approval.</p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-4 rounded-full bg-cream-200 p-6"><ShoppingBag size={32} className="text-ink-400" /></div>
            <p className="font-serif text-xl text-ink-900">Your prescription basket is empty</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">Add prescription options here before starting secure GEN Health checkout.</p>
            <button type="button" onClick={() => { closeBasket(); navigate('/shop-all'); }} className="btn-primary mt-6">Browse prescriptions <ArrowRight size={16} /></button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-3">
                {items.map(item => {
                  const available = Boolean(item.checkoutUrl) || resolveGenProductFirstCheckout(item.genClientProductId).ok;
                  const isLab = item.category === 'labs';
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
                                  aria-label={`Select ${item.displayName} for checkout`}
                                  className="accent-gold-500"
                                />
                                Select
                              </label>
                              <button type="button" onClick={() => removeItem(item.slug)} aria-label={`Remove ${item.displayName}`} className="p-1 text-ink-400 hover:text-ink-900"><X size={16} /></button>
                            </div>
                          </div>
                          <p className="mt-1 text-sm font-medium text-ink-900">{money(Math.round(item.price * 100))}</p>
                          {isLab
                            ? <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-500"><ShieldCheck size={12} className="text-gold-600" /> Lab order opens securely for payment and intake</p>
                            : <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-500"><ShieldCheck size={12} className="text-gold-600" /> Provider review required · prescription not guaranteed</p>}
                        </div>
                      </div>
                      {!available && <p className="mt-3 rounded-lg bg-cream-100 px-3 py-2 text-xs text-ink-600">Temporarily unavailable for secure checkout.</p>}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-cream-300 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">Choose a lab option</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">If labs are required, select an in-home or walk-in lab option and add it to your Care Basket before completing your hormone therapy purchase.</p>
                  </div>
                  <ChevronDown size={16} className="text-ink-400" />
                </div>
                {hasHrt && (
                  <div className="mt-3 rounded-xl border border-cream-300 bg-cream-50 px-3 py-3">
                    <p className="text-xs leading-relaxed text-ink-500">Browse available lab options on the Order Labs page and add the right one to your Care Basket.</p>
                    <button type="button" onClick={() => { closeBasket(); navigate('/order-labs'); }} className="mt-2 text-xs font-medium text-gold-700 underline">View lab options</button>
                  </div>
                )}
                <p className="mt-3 text-xs leading-relaxed text-ink-500">{hasLabItems ? 'Selected lab options are included in the care selections estimate above.' : 'No lab has been added yet.'}</p>
                {hasHrt && <p className="mt-2 text-[11px] leading-relaxed text-ink-500">When GEN Health opens, select the matching lab path there. Uploads and final charges are handled by GEN Health; do not pay until the option shown matches your choice.</p>}
              </div>

              <div className="mt-4 rounded-2xl border border-cream-300 bg-white p-4">
                <p className="text-sm font-medium text-ink-900">Shipping preference</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <label className={`cursor-pointer rounded-xl border px-3 py-3 ${shippingOption === 'two_day' ? 'border-gold-400 bg-gold-50' : 'border-cream-300'}`}>
                    <input type="radio" name="prescription-shipping" checked={shippingOption === 'two_day'} onChange={() => setShippingOption('two_day')} className="mr-2" />
                    <span className="text-sm font-medium text-ink-900">Two-Day</span>
                    <span className="mt-1 block pl-6 text-xs text-ink-500">$30</span>
                  </label>
                  <label className={`cursor-pointer rounded-xl border px-3 py-3 ${shippingOption === 'next_day' ? 'border-gold-400 bg-gold-50' : 'border-cream-300'}`}>
                    <input type="radio" name="prescription-shipping" checked={shippingOption === 'next_day'} onChange={() => setShippingOption('next_day')} className="mr-2" />
                    <span className="text-sm font-medium text-ink-900">Next-Day</span>
                    <span className="mt-1 block pl-6 text-xs text-ink-500">$50</span>
                  </label>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-gold-200 bg-gold-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-800">Planning estimate</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3"><span className="text-ink-600">Medication selections</span><span className="font-medium text-ink-900">{money(Math.round(medicationSubtotal * 100))}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-ink-600">Initial provider visit, if required</span><span className="font-medium text-ink-900">{money(INITIAL_VISIT_CENTS)}</span></div>
                  {hasHrt && <div className="flex justify-between gap-3"><span className="text-ink-600">Hormone therapy labs</span><span className="font-medium text-ink-900">{hasLabItems ? 'Included above' : 'Choose option'}</span></div>}
                  <div className="flex justify-between gap-3"><span className="text-ink-600">{shippingOption === 'two_day' ? 'Two-Day shipping' : 'Next-Day shipping'}</span><span className="font-medium text-ink-900">{money(shippingCents)}</span></div>
                  <div className="flex justify-between gap-3 border-t border-gold-200 pt-2"><span className="font-medium text-ink-900">Estimated total before GEN confirmation</span><span className="font-medium text-ink-900">{money(estimatedTotalCents)}</span></div>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-gold-900">GEN Health is authoritative for the final amount, lab option, visit requirement, shipping availability, and clinical approval. This basket does not charge your card.</p>
              </div>
            </div>

            <div className="border-t border-cream-300 px-5 py-4">
              <p className="mb-3 text-xs leading-relaxed text-ink-500">GEN Health currently starts one prescription checkout at a time. Your other selections stay saved here while you complete each secure review.</p>
              {selectedItem && (
                <div className="mb-3 rounded-xl border border-gold-200 bg-gold-50 p-3">
                  <p className="text-xs text-gold-900">Selected for next checkout: <span className="font-semibold">{selectedItem.displayName}</span></p>
                  <button
                    type="button"
                    onClick={() => beginCheckout(selectedItem)}
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
