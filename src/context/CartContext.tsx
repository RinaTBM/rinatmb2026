import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  subscription: boolean;
  section: string;
  requiresIntake?: boolean;
  variantId?: string;
  variantLabel?: string;
  isMembership?: boolean;
  billingFrequency?: 'monthly';
  /** Stable line identity: product + variant + purchase type. */
  key: string;
}

export function lineKey(productId: string, variantId: string | undefined, subscription: boolean) {
  return `${productId}|${variantId ?? ''}|${subscription ? 'sub' : 'one'}`;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity' | 'key'>, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'mybaremethod_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        // Backfill `key` for any items persisted before variants existed.
        setItems(parsed.map(i => ({ ...i, key: i.key ?? lineKey(i.productId, i.variantId, i.subscription) })));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const addItem: CartContextValue['addItem'] = (item, quantity = 1) => {
    const key = lineKey(item.productId, item.variantId, item.subscription);
    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { ...item, key, quantity }];
    });
    setIsOpen(true);
  };

  const removeItem: CartContextValue['removeItem'] = key =>
    setItems(prev => prev.filter(i => i.key !== key));

  const updateQuantity: CartContextValue['updateQuantity'] = (key, quantity) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(i => (i.key === key ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
        addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
