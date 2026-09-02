import { useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Home, MapPin } from 'lucide-react';
import { navigate } from '@/router';
import {
  getLabCheckoutUrl,
  getLabDisplayPriceCents,
  labOptions,
  labSlug,
  type LabCollection,
  type LabOption,
  type LabVendor,
} from '@/data/labs';
import { usePrescriptionBasket } from '@/context/PrescriptionBasketContext';

const collectionLabels: Record<LabCollection, string> = {
  'in-home': 'In-Home',
  'walk-in': 'Walk-In',
};

const vendorLabels: Record<LabVendor, string> = {
  labcorp: 'LabCorp',
  quest: 'Quest',
};

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

interface LabGroup {
  displayName: string;
  slug: string;
  labs: LabOption[];
  minPriceCents: number;
  markerCount: number;
  collections: LabCollection[];
  vendors: LabVendor[];
}

function groupLabsByDisplayName(): LabGroup[] {
  const map = new Map<string, LabGroup>();
  for (const lab of labOptions) {
    const slug = labSlug(lab.displayName);
    const priceCents = getLabDisplayPriceCents(lab);
    const existing = map.get(slug);
    if (existing) {
      existing.labs.push(lab);
      existing.minPriceCents = Math.min(existing.minPriceCents, priceCents);
      if (!existing.collections.includes(lab.collection)) existing.collections.push(lab.collection);
      if (!existing.vendors.includes(lab.vendor)) existing.vendors.push(lab.vendor);
    } else {
      map.set(slug, {
        displayName: lab.displayName,
        slug,
        labs: [lab],
        minPriceCents: priceCents,
        markerCount: lab.markerCount,
        collections: [lab.collection],
        vendors: [lab.vendor],
      });
    }
  }
  return Array.from(map.values());
}

export function OrderLabsPage() {
  const groups = useMemo(() => groupLabsByDisplayName(), []);

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-20">
        <div className="container-lux">
          <p className="eyebrow mb-3">GEN Health labs</p>
          <h1 className="font-serif text-5xl text-ink-900 md:text-6xl">Order Labs</h1>
          <p className="mt-5 max-w-2xl text-ink-600 leading-relaxed">
            Choose an in-home or walk-in lab option. Add your selection to the Care Basket before continuing to GEN Health.
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-lux">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group, index) => (
              <button
                key={group.slug}
                type="button"
                onClick={() => navigate(`/order-labs/${group.slug}`)}
                className="group relative flex flex-col rounded-lg border border-cream-300 bg-white p-5 text-left shadow-sm transition-all hover:border-gold-400 hover:shadow-md"
              >
                {index < 3 && (
                  <span className="absolute right-4 top-4 rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-700">
                    Frequently purchased
                  </span>
                )}
                <div className="mb-4 flex flex-wrap gap-2">
                  {group.collections.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-ink-700">
                      {c === 'in-home' ? <Home size={13} /> : <MapPin size={13} />}
                      {collectionLabels[c]}
                    </span>
                  ))}
                  {group.vendors.map(v => (
                    <span key={v} className="rounded-full bg-gold-50 px-2.5 py-1 text-xs font-medium text-gold-700">
                      {vendorLabels[v]}
                    </span>
                  ))}
                </div>
                <h2 className="font-serif text-2xl leading-tight text-ink-900">{group.displayName}</h2>
                <div className="mt-auto pt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-ink-400">From</p>
                    <p className="mt-1 text-2xl font-semibold text-ink-900">{formatMoney(group.minPriceCents)}</p>
                  </div>
                  <p className="text-right text-sm text-ink-500">{group.markerCount > 0 ? `${group.markerCount} markers` : 'Panel'}</p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-700 group-hover:text-gold-800">
                  View options <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function LabDetailPage({ slug }: { slug: string }) {
  const { items, addItem, openBasket } = usePrescriptionBasket();
  const [selectedCollection, setSelectedCollection] = useState<LabCollection | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<LabVendor | null>(null);

  const group = useMemo(() => groupLabsByDisplayName().find(g => g.slug === slug) ?? null, [slug]);

  if (!group) {
    return (
      <div className="bg-cream-50 pt-28 md:pt-32 pb-20 text-center">
        <p className="font-serif text-3xl text-ink-900 mb-3">Lab not found</p>
        <button type="button" onClick={() => navigate('/order-labs')} className="btn-primary">Back to Order Labs</button>
      </div>
    );
  }

  const needsCollectionChoice = group.collections.length > 1;
  const needsVendorChoice = group.vendors.length > 1;
  const availableLabs = group.labs.filter(lab =>
    (!needsCollectionChoice || lab.collection === selectedCollection) &&
    (!needsVendorChoice || lab.vendor === selectedVendor),
  );
  const selectedLab = availableLabs[0] ?? null;
  const canChoose = (!needsCollectionChoice || selectedCollection !== null) && (!needsVendorChoice || selectedVendor !== null);
  const isAdded = selectedLab ? items.some(item => item.slug === selectedLab.productId) : false;

  const handleAddLab = () => {
    if (!selectedLab) return;
    addItem({
      slug: selectedLab.productId,
      displayName: selectedLab.displayName,
      subtitle: `${collectionLabels[selectedLab.collection]} · ${vendorLabels[selectedLab.vendor]}`,
      image: '/images/products/product-extra.png',
      imageAlt: `${selectedLab.displayName} lab option`,
      price: getLabDisplayPriceCents(selectedLab) / 100,
      genClientProductId: selectedLab.productId,
      category: 'labs',
      checkoutUrl: getLabCheckoutUrl(selectedLab),
    });
    openBasket();
  };

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-20">
        <div className="container-lux">
          <button type="button" onClick={() => navigate('/order-labs')} className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gold-700 hover:text-gold-800">
            <ArrowLeft size={16} /> Back to labs
          </button>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow mb-3">GEN Health labs</p>
              <h1 className="font-serif text-4xl text-ink-900 md:text-5xl">{group.displayName}</h1>
              <p className="mt-4 text-ink-600 leading-relaxed">
                {group.markerCount > 0 ? `${group.markerCount} markers` : 'Panel'} · {group.collections.length > 1 || group.vendors.length > 1 ? 'Choose your collection and lab network below.' : 'Ready to add to your Care Basket.'}
              </p>
            </div>

            <div className="rounded-2xl border border-gold-200 bg-gold-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-gold-800">Selected option</p>
              <div className="mt-4 space-y-4">
                {needsCollectionChoice && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-ink-600">Collection style</p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.collections.map(c => (
                        <button key={c} type="button" onClick={() => setSelectedCollection(c)} className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${selectedCollection === c ? 'border-gold-500 bg-white text-ink-900' : 'border-cream-300 bg-white/50 text-ink-500 hover:border-gold-300'}`}>
                          {collectionLabels[c]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {needsVendorChoice && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-ink-600">Lab network</p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.vendors.map(v => (
                        <button key={v} type="button" onClick={() => setSelectedVendor(v)} className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${selectedVendor === v ? 'border-gold-500 bg-white text-ink-900' : 'border-cream-300 bg-white/50 text-ink-500 hover:border-gold-300'}`}>
                          {vendorLabels[v]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {canChoose && selectedLab && (
                <div className="mt-5 rounded-xl border border-gold-300 bg-white px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-ink-900">{collectionLabels[selectedLab.collection]} · {vendorLabels[selectedLab.vendor]}</p>
                      <p className="mt-1 text-xs text-ink-500">{selectedLab.collection === 'in-home' ? 'This lab opens as an in-home order through Quest/LabCorp.' : 'This lab opens as a walk-in order through Quest/LabCorp.'}</p>
                    </div>
                    <p className="text-xl font-semibold text-ink-900">{formatMoney(getLabDisplayPriceCents(selectedLab))}</p>
                  </div>
                </div>
              )}

              <button type="button" onClick={handleAddLab} disabled={!canChoose || !selectedLab} className="btn-primary mt-5 w-full text-sm">
                {isAdded ? <><Check size={16} /> Added to Care Basket</> : 'Add Lab to Care Basket'}
              </button>
              {!canChoose && <p className="mt-3 text-center text-xs text-ink-500">Select a collection style and lab network to continue.</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
