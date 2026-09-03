import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, Home, MapPin } from 'lucide-react';
import { Link } from '@/router';
import { usePrescriptionBasket } from '@/context/PrescriptionBasketContext';
import {
  getLabCheckoutUrl,
  getLabDisplayPriceCents,
  labOptions,
  type LabCollection,
  type LabOption,
  type LabVendor,
} from '@/data/labs';

const LAB_IMAGE = 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=1200';

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

function labSlug(displayName: string) {
  return displayName
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function labSummary(options: LabOption[]) {
  const first = options[0];
  const collections = new Set(options.map(option => option.collection));
  const vendors = new Set(options.map(option => option.vendor));
  const lowestPrice = Math.min(...options.map(getLabDisplayPriceCents));
  const highestPrice = Math.max(...options.map(getLabDisplayPriceCents));

  return {
    description: first.description,
    lowestPrice,
    highestPrice,
    markers: Math.max(...options.map(option => option.markerCount)),
    hasInHome: collections.has('in-home'),
    hasWalkIn: collections.has('walk-in'),
    hasLabCorp: vendors.has('labcorp'),
    hasQuest: vendors.has('quest'),
  };
}

function getLabGroups() {
  const groups = new Map<string, LabOption[]>();

  for (const lab of labOptions) {
    const current = groups.get(lab.displayName) ?? [];
    current.push(lab);
    groups.set(lab.displayName, current);
  }

  return [...groups.entries()]
    .map(([displayName, options]) => ({
      displayName,
      slug: labSlug(displayName),
      options: [...options].sort((a, b) => getLabDisplayPriceCents(a) - getLabDisplayPriceCents(b)),
      summary: labSummary(options),
    }))
    .sort((a, b) => a.summary.lowestPrice - b.summary.lowestPrice);
}

function optionExists(options: LabOption[], collection: LabCollection, vendor: LabVendor) {
  return options.some(option => option.collection === collection && option.vendor === vendor);
}

function resolveSelectedLab(options: LabOption[], collection: LabCollection, vendor: LabVendor) {
  return (
    options.find(option => option.collection === collection && option.vendor === vendor) ??
    options.find(option => option.collection === collection) ??
    options.find(option => option.vendor === vendor) ??
    options[0]
  );
}

export function OrderLabsPage() {
  const labGroups = useMemo(() => getLabGroups(), []);

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-20">
        <div className="container-lux">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Lab options</p>
            <h1 className="font-serif text-5xl text-ink-900 md:text-6xl">Order Labs</h1>
            <p className="mt-5 text-ink-600 leading-relaxed">
              Choose the lab panel that fits your next step. Each panel page lets you select collection style and lab network before ordering.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-lux">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {labGroups.map((group, index) => {
              const { summary } = group;
              const frequentlyPurchased = index < 3;
              const priceLabel =
                summary.lowestPrice === summary.highestPrice
                  ? formatMoney(summary.lowestPrice)
                  : `From ${formatMoney(summary.lowestPrice)}`;

              return (
                <Link
                  key={group.slug}
                  to={`/order-labs/${group.slug}`}
                  className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-lg border border-cream-300 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-md"
                >
                  {frequentlyPurchased ? (
                    <span className="absolute right-0 top-0 rounded-bl-lg bg-gold-100 px-3 py-1.5 text-center text-[10px] font-medium uppercase leading-tight tracking-[0.12em] text-gold-800">
                      Frequently<br />purchased
                    </span>
                  ) : null}

                  <div className="mb-5 flex flex-wrap gap-2 pr-24">
                    {summary.hasInHome ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-ink-700">
                        <Home size={13} />
                        In-Home
                      </span>
                    ) : null}
                    {summary.hasWalkIn ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-ink-700">
                        <MapPin size={13} />
                        Walk-In
                      </span>
                    ) : null}
                    {summary.hasLabCorp ? (
                      <span className="rounded-full bg-gold-50 px-2.5 py-1 text-xs font-medium text-gold-700">LabCorp</span>
                    ) : null}
                    {summary.hasQuest ? (
                      <span className="rounded-full bg-gold-50 px-2.5 py-1 text-xs font-medium text-gold-700">Quest</span>
                    ) : null}
                  </div>

                  <h2 className="font-serif text-[1.65rem] leading-tight text-ink-900">{group.displayName}</h2>
                  <p className="mt-3 text-sm leading-6 text-ink-500">{summary.description}</p>

                  <div className="mt-auto pt-6">
                    <div className="mb-5 flex items-end justify-between gap-4 border-t border-cream-200 pt-5">
                      <p className="text-2xl font-semibold text-ink-900">{priceLabel}</p>
                      <div className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-500">
                        {summary.markers > 0 ? `${summary.markers} markers` : 'Panel'}
                      </div>
                    </div>
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink-900 px-4 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-gold-700">
                      View Lab
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export function LabDetailPage({ slug }: { slug: string }) {
  const { addItem, openBasket, items } = usePrescriptionBasket();
  const group = useMemo(() => getLabGroups().find(item => item.slug === slug), [slug]);
  const [collection, setCollection] = useState<LabCollection>(group?.options[0]?.collection ?? 'in-home');
  const [vendor, setVendor] = useState<LabVendor>(group?.options[0]?.vendor ?? 'quest');

  if (!group) {
    return (
      <div className="bg-cream-50 pt-32 pb-20 text-center">
        <p className="font-serif text-3xl text-ink-900 mb-3">Lab option not found</p>
        <Link to="/order-labs" className="btn-outline">Back to Order Labs</Link>
      </div>
    );
  }

  const selectedLab = resolveSelectedLab(group.options, collection, vendor);
  const availableCollections = [...new Set(group.options.map(option => option.collection))];
  const availableVendors = [...new Set(group.options.map(option => option.vendor))];
  const canChooseCollection = availableCollections.length > 1;
  const canChooseVendor = availableVendors.length > 1;
  const hasChoices = canChooseCollection || canChooseVendor;
  const selectedSlug = `lab-${selectedLab.productId}`;
  const isInBasket = items.some(item => item.slug === selectedSlug);

  const addLabToBasket = () => {
    addItem({
      slug: selectedSlug,
      displayName: selectedLab.displayName,
      subtitle: `${collectionLabels[selectedLab.collection]} / ${vendorLabels[selectedLab.vendor]}`,
      image: LAB_IMAGE,
      imageAlt: `${selectedLab.displayName} lab review`,
      price: getLabDisplayPriceCents(selectedLab) / 100,
      genClientProductId: selectedLab.productId,
      checkoutUrl: getLabCheckoutUrl(selectedLab),
      category: 'labs',
    });
    openBasket();
  };

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <div className="container-lux py-4">
        <div className="flex items-center gap-2 text-sm text-ink-400 flex-wrap">
          <Link to="/" className="hover:text-ink-900">Home</Link>
          <span>/</span>
          <Link to="/order-labs" className="hover:text-ink-900">Order Labs</Link>
          <span>/</span>
          <span className="text-ink-700">{group.displayName}</span>
        </div>
      </div>

      <section className="pb-16 md:pb-24">
        <div className="container-lux">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-16">
            <div>
              <Link to="/order-labs" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900">
                <ArrowLeft size={15} />
                Back to all labs
              </Link>
              <p className="eyebrow mb-3">Lab option</p>
              <h1 className="font-serif text-5xl leading-tight text-ink-900 md:text-6xl">{group.displayName}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-600">{selectedLab.description}</p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-cream-300 bg-white p-4">
                  <p className="eyebrow mb-2 text-[10px]">Current Price</p>
                  <p className="text-2xl font-semibold text-ink-900">{formatMoney(getLabDisplayPriceCents(selectedLab))}</p>
                </div>
                <div className="rounded-lg border border-cream-300 bg-white p-4">
                  <p className="eyebrow mb-2 text-[10px]">Markers</p>
                  <p className="text-2xl font-semibold text-ink-900">{selectedLab.markerCount > 0 ? selectedLab.markerCount : 'Panel'}</p>
                </div>
                <div className="rounded-lg border border-cream-300 bg-white p-4">
                  <p className="eyebrow mb-2 text-[10px]">Next Step</p>
                  <p className="text-sm font-medium leading-snug text-ink-700">Order securely through your lab checkout</p>
                </div>
              </div>

              <div className="mt-10 rounded-lg border border-cream-300 bg-white p-6">
                <p className="eyebrow mb-3 text-[10px]">What this panel helps review</p>
                <p className="max-w-3xl text-base leading-7 text-ink-600">{selectedLab.detailDescription}</p>

                <div className="mt-6 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-lg bg-cream-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold-700">Best for</p>
                    <p className="mt-2 text-sm leading-6 text-ink-600">{selectedLab.bestFor}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold-700">Includes</p>
                    <ul className="mt-3 space-y-2">
                      {selectedLab.highlights.map(highlight => (
                        <li key={highlight} className="flex gap-2 text-sm leading-6 text-ink-600">
                          <Check className="mt-1 h-4 w-4 flex-none text-gold-700" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-lg border border-cream-300 bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-32 lg:self-start">
              <p className="mb-5 font-serif text-2xl text-ink-900">
                {hasChoices ? 'Select your lab details' : 'Your lab order'}
              </p>

              {hasChoices ? (
                <div className="space-y-5">
                  {canChooseCollection ? (
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-400">Collection style</p>
                      <div className="grid gap-2">
                        {availableCollections.map(value => {
                          const disabled = !optionExists(group.options, value, vendor);
                          const selected = selectedLab.collection === value;

                          return (
                            <button
                              key={value}
                              type="button"
                              disabled={disabled}
                              onClick={() => setCollection(value)}
                              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            selected
                              ? 'border-gold-400 bg-gold-50 text-ink-900 ring-1 ring-gold-200'
                              : 'border-cream-300 bg-cream-50 text-ink-700 hover:border-gold-300'
                              }`}
                            >
                              <span>{collectionLabels[value]}</span>
                              {selected ? <Check size={15} /> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {canChooseVendor ? (
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-400">Lab network</p>
                      <div className="grid gap-2">
                        {availableVendors.map(value => {
                          const disabled = !optionExists(group.options, collection, value);
                          const selected = selectedLab.vendor === value;

                          return (
                            <button
                              key={value}
                              type="button"
                              disabled={disabled}
                              onClick={() => setVendor(value)}
                              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            selected
                              ? 'border-gold-400 bg-gold-50 text-ink-900 ring-1 ring-gold-200'
                              : 'border-cream-300 bg-cream-50 text-ink-700 hover:border-gold-300'
                              }`}
                            >
                              <span>{vendorLabels[value]}</span>
                              {selected ? <Check size={15} /> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-lg bg-cream-50 p-4">
                  <p className="text-sm leading-relaxed text-ink-600">
                    This lab opens as {selectedLab.collection === 'in-home' ? 'an' : 'a'} {collectionLabels[selectedLab.collection].toLowerCase()} order through {vendorLabels[selectedLab.vendor]}.
                  </p>
                </div>
              )}

              <div className="mt-6 rounded-lg border border-gold-300 bg-gold-50 p-4 ring-1 ring-gold-100">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gold-800">Selected option</span>
                  <span className="text-sm font-medium text-ink-900">
                    {collectionLabels[selectedLab.collection]} / {vendorLabels[selectedLab.vendor]}
                  </span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-4 border-t border-gold-200 pt-3">
                  <span className="text-sm text-gold-800">Price</span>
                  <span className="font-serif text-3xl text-ink-900">{formatMoney(getLabDisplayPriceCents(selectedLab))}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={addLabToBasket}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-700"
              >
                {isInBasket ? 'Open Lab in Care Basket' : 'Add Lab to Care Basket'}
                <ArrowUpRight size={16} />
              </button>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
