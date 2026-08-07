import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AppliedDiscount, PurchaseOptionKind } from '@/lib/pricing/purchaseOptions';

export type CartPurchaseType = PurchaseOptionKind | 'membership_program';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  /** Final unit price charged (after a single applied discount). */
  price: number;
  /** Pre-discount catalog/standard unit price. */
  standardPrice?: number;
  image: string;
  quantity: number;
  /** True when Auto-Refill or program membership (recurring). */
  subscription: boolean;
  section: string;
  requiresIntake?: boolean;
  variantId?: string;
  variantLabel?: string;
  isMembership?: boolean;
  billingFrequency?: 'monthly';
  purchaseType?: CartPurchaseType;
  discountPercent?: number;
  appliedDiscount?: AppliedDiscount;
  /** Stable line identity: product + variant + purchase type. */
  key: string;
}

export function lineKey(
  productId: string,
  variantId: string | undefined,
  subscription: boolean,
  purchaseType?: CartPurchaseType,
) {
  const type = purchaseType ?? (subscription ? 'auto_refill' : 'one_time');
  return `${productId}|${variantId ?? ''}|${type}`;
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
  standardSubtotal: number;
  totalSavings: number;
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
        setItems(
          parsed.map(i => {
            const purchaseType: CartPurchaseType =
              i.purchaseType ??
              (i.isMembership ? 'membership_program' : i.subscription ? 'auto_refill' : 'one_time');
            return {
              ...i,
              purchaseType,
              standardPrice: i.standardPrice ?? i.price,
              discountPercent: i.discountPercent ?? 0,
              appliedDiscount: i.appliedDiscount ?? 'none',
              key: i.key ?? lineKey(i.productId, i.variantId, i.subscription, purchaseType),
            };
          }),
        );
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
    const purchaseType: CartPurchaseType =
      item.purchaseType ??
      (item.isMembership ? 'membership_program' : item.subscription ? 'auto_refill' : 'one_time');
    const key = lineKey(item.productId, item.variantId, item.subscription, purchaseType);
    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          ...item,
          purchaseType,
          standardPrice: item.standardPrice ?? item.price,
          discountPercent: item.discountPercent ?? 0,
          appliedDiscount: item.appliedDiscount ?? 'none',
          key,
          quantity,
        },
      ];
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
  const standardSubtotal = items.reduce(
    (sum, i) => sum + (i.standardPrice ?? i.price) * i.quantity,
    0,
  );
  const totalSavings = Math.max(0, Math.round((standardSubtotal - subtotal) * 100) / 100);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        standardSubtotal,
        totalSavings,
        itemCount,
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
