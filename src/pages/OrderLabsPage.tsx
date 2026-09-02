import { useMemo, useState } from 'react';
import { Beaker, Check, Home, MapPin } from 'lucide-react';
import {
  getLabCheckoutUrl,
  getLabDisplayPriceCents,
  labOptions,
  type LabCollection,
  type LabVendor,
} from '@/data/labs';
import { usePrescriptionBasket } from '@/context/PrescriptionBasketContext';

type CollectionFilter = 'all' | LabCollection;
type VendorFilter = 'all' | LabVendor;

const collectionLabels: Record<LabCollection, string> = {
  'in-home': 'In-Home',
  'walk-in': 'Walk-In',
};

const vendorLabels: Record<LabVendor, string> = {
  labcorp: 'LabCorp',
  quest: 'Quest',
};

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export function OrderLabsPage() {
  const [collection, setCollection] = useState<CollectionFilter>('all');
  const [vendor, setVendor] = useState<VendorFilter>('all');
  const { items, addItem, openBasket } = usePrescriptionBasket();

  const filteredLabs = useMemo(
    () => labOptions.filter(lab =>
      (collection === 'all' || lab.collection === collection) &&
      (vendor === 'all' || lab.vendor === vendor)
    ),
    [collection, vendor],
  );

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-20">
        <div className="container-lux">
          <div>
            <p className="eyebrow mb-3">GEN Health labs</p>
            <h1 className="font-serif text-5xl text-ink-900 md:text-6xl">Order Labs</h1>
            <p className="mt-5 max-w-2xl text-ink-600 leading-relaxed">
              Choose an in-home or walk-in lab option. Add your selection to the Care Basket before continuing to GEN Health.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-lux">
          <div className="mb-8 flex flex-col gap-4 rounded-lg border border-cream-300 bg-white/80 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {([
                ['all', 'All labs'],
                ['in-home', 'In-Home'],
                ['walk-in', 'Walk-In'],
              ] as const).map(([value, label]) => (
                <button key={value} type="button" onClick={() => setCollection(value)} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${collection === value ? 'border-gold-500 bg-gold-100 text-ink-900' : 'border-cream-300 bg-white text-ink-600 hover:border-gold-300 hover:text-ink-900'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                ['all', 'All vendors'],
                ['labcorp', 'LabCorp'],
                ['quest', 'Quest'],
              ] as const).map(([value, label]) => (
                <button key={value} type="button" onClick={() => setVendor(value)} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${vendor === value ? 'border-ink-800 bg-ink-900 text-white' : 'border-cream-300 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredLabs.map(lab => {
              const Icon = lab.collection === 'in-home' ? Home : MapPin;
              const isAdded = items.some(item => item.slug === lab.productId);
              const basketItem = {
                slug: lab.productId,
                displayName: lab.displayName,
                subtitle: `${collectionLabels[lab.collection]} · ${vendorLabels[lab.vendor]}`,
                image: '/images/products/product-extra.png',
                imageAlt: `${lab.displayName} lab option`,
                price: getLabDisplayPriceCents(lab) / 100,
                genClientProductId: getLabCheckoutUrl(lab),
                category: 'labs',
              };

              return (
                <article key={`${lab.productId}-${lab.costCents}`} className="rounded-lg border border-cream-300 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-ink-700"><Icon size={13} />{collectionLabels[lab.collection]}</span>
                      <span className="rounded-full bg-gold-50 px-2.5 py-1 text-xs font-medium text-gold-700">{vendorLabels[lab.vendor]}</span>
                    </div>
                    <Beaker size={18} className="shrink-0 text-gold-600" />
                  </div>
                  <h2 className="min-h-14 font-serif text-2xl leading-tight text-ink-900">{lab.displayName}</h2>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-ink-400">Due in GEN Health</p>
                      <p className="mt-1 text-2xl font-semibold text-ink-900">{formatMoney(getLabDisplayPriceCents(lab))}</p>
                    </div>
                    <div className="text-right text-sm text-ink-500"><p>{lab.markerCount > 0 ? `${lab.markerCount} markers` : 'Panel'}</p><p>{lab.targetAudience}</p></div>
                  </div>
                  <p className="mt-4 text-sm text-ink-500">{lab.collection === 'in-home' ? 'This lab opens as an in-home order through Quest/LabCorp.' : 'This lab opens as a walk-in order through Quest/LabCorp.'}</p>
                  <button type="button" onClick={() => { addItem(basketItem); openBasket(); }} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-700">
                    {isAdded ? <><Check size={16} /> Added to Care Basket</> : 'Add to Care Basket'}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
