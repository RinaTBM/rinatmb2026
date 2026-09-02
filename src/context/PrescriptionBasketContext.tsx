import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface PrescriptionBasketItem {
  slug: string;
  displayName: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  price: number;
  genClientProductId: string;
  checkoutUrl?: string;
  category: string;
  checkoutUrl?: string;
}

interface PrescriptionBasketContextValue {
  items: PrescriptionBasketItem[];
  isOpen: boolean;
  itemCount: number;
  medicationSubtotal: number;
  openBasket: () => void;
  closeBasket: () => void;
  addItem: (item: PrescriptionBasketItem) => void;
  removeItem: (slug: string) => void;
  clearBasket: () => void;
}

const PrescriptionBasketContext = createContext<PrescriptionBasketContextValue | null>(null);
const STORAGE_KEY = 'mybaremethod_prescription_basket';

function readStoredItems(): PrescriptionBasketItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as PrescriptionBasketItem[];
    return Array.isArray(parsed) ? parsed.filter(item => item && typeof item.slug === 'string') : [];
  } catch {
    return [];
  }
}

export function PrescriptionBasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PrescriptionBasketItem[]>(readStoredItems);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* Ignore unavailable browser storage. */
    }
  }, [items]);

  const value = useMemo<PrescriptionBasketContextValue>(() => ({
    items,
    isOpen,
    itemCount: items.length,
    medicationSubtotal: items.reduce((sum, item) => sum + item.price, 0),
    openBasket: () => setIsOpen(true),
    closeBasket: () => setIsOpen(false),
    addItem: item => setItems(previous =>
      previous.some(existing => existing.slug === item.slug) ? previous : [...previous, item],
    ),
    removeItem: slug => setItems(previous => previous.filter(item => item.slug !== slug)),
    clearBasket: () => setItems([]),
  }), [items, isOpen]);

  return <PrescriptionBasketContext.Provider value={value}>{children}</PrescriptionBasketContext.Provider>;
}

export function usePrescriptionBasket() {
  const context = useContext(PrescriptionBasketContext);
  if (!context) throw new Error('usePrescriptionBasket must be used within PrescriptionBasketProvider');
  return context;
}
