import type { DosageForm, Product } from '@/data/products';

export type SortId = 'featured' | 'newest' | 'price-low' | 'price-high' | 'alpha';
export type PriceBand = 'any' | 'under-100' | '100-199' | '200-299' | '300-plus';

/**
 * Wellness categories used in Shop navigation and filters.
 * Accessories and Provider Care are intentionally excluded — they remain
 * top-level destinations outside the Shop catalog experience.
 */
export const SHOP_CATEGORIES: { id: string; label: string }[] = [
  { id: 'weight-management', label: 'Weight Management' },
  { id: 'womens-hormone-therapy', label: "Women's Hormone Therapy" },
  { id: 'longevity-cognitive', label: 'Longevity & Cognitive Health' },
  { id: 'recovery-performance', label: 'Recovery & Performance' },
  { id: 'prescription-skin-hair', label: 'Prescription Skin & Hair' },
];

export const SHOP_CATEGORY_IDS = new Set(SHOP_CATEGORIES.map(c => c.id));

/** Dosage forms offered in browse filters (no Accessory / Service / Solution / All). */
export const FORM_FILTER_OPTIONS: DosageForm[] = [
  'Injection',
  'Capsule',
  'Orally disintegrating tablet',
  'Cream',
  'Patch',
  'Nasal Spray',
  'Topical Solution',
];

export const PRICE_FILTER_OPTIONS: { id: PriceBand; label: string }[] = [
  { id: 'any', label: 'Any' },
  { id: 'under-100', label: 'Under $100' },
  { id: '100-199', label: '$100–199' },
  { id: '200-299', label: '$200–299' },
  { id: '300-plus', label: '$300+' },
];

export const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-low', label: 'Price Low to High' },
  { id: 'price-high', label: 'Price High to Low' },
  { id: 'alpha', label: 'Alphabetical' },
];

export interface BrowseFilters {
  query: string;
  category: string; // '' = any
  form: string; // '' = any
  price: PriceBand;
  sort: SortId;
}

export function matchesPriceBand(price: number, band: PriceBand): boolean {
  switch (band) {
    case 'any': return true;
    case 'under-100': return price < 100;
    case '100-199': return price >= 100 && price <= 199;
    case '200-299': return price >= 200 && price <= 299;
    case '300-plus': return price >= 300;
    default: return true;
  }
}

export function filterAndSortProducts(
  source: Product[],
  filters: BrowseFilters,
  /** Stable catalog order used for "Newest" (higher index ≈ later in catalog). */
  catalogOrder: Product[] = source,
): Product[] {
  const q = filters.query.trim().toLowerCase();
  const orderIndex = new Map(catalogOrder.map((p, i) => [p.id, i]));

  const list = source.filter(p => {
    const matchesQuery = q === ''
      || p.displayName.toLowerCase().includes(q)
      || p.shortName.toLowerCase().includes(q)
      || p.shortDescription.toLowerCase().includes(q)
      || p.dosageForms.some(f => f.toLowerCase().includes(q));
    const matchesCategory = !filters.category || p.category === filters.category;
    const matchesForm = !filters.form || p.dosageForms.some(f => f === filters.form);
    const matchesPrice = matchesPriceBand(p.startingPrice, filters.price);
    return matchesQuery && matchesCategory && matchesForm && matchesPrice;
  });

  const sorted = [...list];
  switch (filters.sort) {
    case 'price-low':
      sorted.sort((a, b) => a.startingPrice - b.startingPrice);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.startingPrice - a.startingPrice);
      break;
    case 'alpha':
      sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
      break;
    case 'newest':
      sorted.sort((a, b) => (orderIndex.get(b.id) ?? 0) - (orderIndex.get(a.id) ?? 0));
      break;
    case 'featured':
    default:
      sorted.sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller) || a.displayName.localeCompare(b.displayName));
      break;
  }
  return sorted;
}
