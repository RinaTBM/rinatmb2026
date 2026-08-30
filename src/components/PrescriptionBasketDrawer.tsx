import { useState } from 'react';
import { ArrowRight, ChevronDown, ExternalLink, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { navigate } from '@/router';
import { usePrescriptionBasket } from '@/context/PrescriptionBasketContext';
import { navigateToGenProductFirstCheckout, resolveGenProductFirstCheckout } from '@/lib/commerce/genHostedCheckout';

type HrtLabOption = 'full_package' | 'own_labs';
type ShippingOption = 'two_day' | 'next_day';

const HRT_CATEGORY = 'womens-hormone-therapy';
const INITIAL_VISIT_CENTS = 7500;
const FULL_HRT_LAB_PACKAGE_CENTS = 26000;
const OWN_LABS_REVIEW_CENTS = 6000;
const TWO_DAY_SHIPPING_CENTS = 3000;
const NEXT_DAY_SHIPPING_CENTS = 5000;

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function PrescriptionBasketDrawer() {
  const { items, isOpen, itemCount, medicationSubtotal, closeBasket, removeItem } = usePrescriptionBasket();
  const [labOption, setLabOption] = useState<HrtLabOption>('full_package');
  const [shippingOption, setShippingOption] = useState<ShippingOption>('two_day');
  const hasHrt = items.some(item => item.category === HRT_CATEGORY);
  const labCents = hasHrt ? (labOption === 'full_package' ? FULL_HRT_LAB_PACKAGE_CENTS : OWN_LABS_REVIEW_CENTS) : 0;
  const shippingCents = shippingOption === 'two_day' ? TWO_DAY_SHIPPING_CENTS : NEXT_DAY_SHIPPING_CENTS;
  const estimatedTotalCents = Math.round(medicationSubtotal * 100) + labCents + shippingCents + INITIAL_VISIT_CENTS;
  const labDescription = labOption === 'full_package'
    ? 'Lab Kit + Lab Review · $260 total · Lab Kit shipping included'
    : 'Upload your own recent labs in GEN Health · Lab Review $60';

  const beginGenCheckout = (genClientProductId: string) => {
    const checkout = resolveGenProductFirstCheckout(genClientProductId);
    if (checkout.ok) navigateToGenProductFirstCheckout(checkout.url);
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
                  const available = resolveGenProductFirstCheckout(item.genClientProductId).ok;
                  return (
                    <div key={item.slug} className="rounded-2xl border border-cream-300 bg-white p-3">
                      <div className="flex gap-3">
                        <img src={item.image} alt={item.imageAlt} className="h-20 w-20 rounded-xl bg-cream-100 object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-gold-600">{item.subtitle}</p>
                              <h3 className="font-serif text-lg leading-tight text-ink-900">{item.displayName}</h3>
                            </div>
                            <button type="button" onClick={() => removeItem(item.slug)} aria-label={`Remove ${item.displayName}`} className="p-1 text-ink-400 hover:text-ink-900"><X size={16} /></button>
                          </div>
                          <p className="mt-1 text-sm font-medium text-ink-900">{money(Math.round(item.price * 100))}</p>
                          <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-500"><ShieldCheck size={12} className="text-gold-600" /> Provider review required · prescription not guaranteed</p>
                        </div>
                      </div>
                      {available ? (
                        <button type="button" onClick={() => beginGenCheckout(item.genClientProductId)} className="btn-primary mt-3 w-full text-sm">
                          Continue with {item.displayName} in GEN Health <ExternalLink size={14} />
                        </button>
                      ) : (
                        <p className="mt-3 rounded-lg bg-cream-100 px-3 py-2 text-xs text-ink-600">Temporarily unavailable for secure GEN checkout.</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-cream-300 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">HRT lab option</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">Only applies when a Women’s Hormone Therapy product is selected.</p>
                  </div>
                  <ChevronDown size={16} className="text-ink-400" />
                </div>
                {hasHrt && (
                  <div className="mt-3 grid gap-2">
                    <label className={`cursor-pointer rounded-xl border px-3 py-3 ${labOption === 'full_package' ? 'border-gold-400 bg-gold-50' : 'border-cream-300'}`}>
                      <input type="radio" name="hrt-lab-option" checked={labOption === 'full_package'} onChange={() => setLabOption('full_package')} className="mr-2" />
                      <span className="text-sm font-medium text-ink-900">Full HRT Lab Package · $260</span>
                      <span className="mt-1 block pl-6 text-xs text-ink-500">Lab Kit $200 + Lab Review $60; Lab Kit shipping included. This is the first-time HRT option when required.</span>
                    </label>
                    <label className={`cursor-pointer rounded-xl border px-3 py-3 ${labOption === 'own_labs' ? 'border-gold-400 bg-gold-50' : 'border-cream-300'}`}>
                      <input type="radio" name="hrt-lab-option" checked={labOption === 'own_labs'} onChange={() => setLabOption('own_labs')} className="mr-2" />
                      <span className="text-sm font-medium text-ink-900">Upload my own labs · $60 Lab Review</span>
                      <span className="mt-1 block pl-6 text-xs leading-relaxed text-ink-500">Upload recent labs in GEN Health and pay the $60 review fee with the initial visit. The provider must receive and approve them before prescribing, even if payment is made first.</span>
                    </label>
                  </div>
                )}
                <p className="mt-3 text-xs leading-relaxed text-ink-500">{hasHrt ? labDescription : 'No HRT lab package is added for the current selections.'}</p>
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
                  {hasHrt && <div className="flex justify-between gap-3"><span className="text-ink-600">{labOption === 'full_package' ? 'Full HRT lab package' : 'Lab review with own labs'}</span><span className="font-medium text-ink-900">{money(labCents)}</span></div>}
                  <div className="flex justify-between gap-3"><span className="text-ink-600">{shippingOption === 'two_day' ? 'Two-Day shipping' : 'Next-Day shipping'}</span><span className="font-medium text-ink-900">{money(shippingCents)}</span></div>
                  <div className="flex justify-between gap-3 border-t border-gold-200 pt-2"><span className="font-medium text-ink-900">Estimated total before GEN confirmation</span><span className="font-medium text-ink-900">{money(estimatedTotalCents)}</span></div>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-gold-900">GEN Health is authoritative for the final amount, lab option, visit requirement, shipping availability, and clinical approval. This basket does not charge your card.</p>
              </div>
            </div>

            <div className="border-t border-cream-300 px-5 py-4">
              <p className="mb-3 text-xs leading-relaxed text-ink-500">GEN Health currently starts one prescription checkout at a time. Your other selections stay saved here while you complete each secure review.</p>
              <button type="button" onClick={closeBasket} className="btn-ghost w-full">Keep shopping</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
