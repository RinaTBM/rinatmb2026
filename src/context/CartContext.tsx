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
  /** True for Wellness Membership (recurring). Auto-Refill is not offered for new carts. */
  subscription: boolean;
  section: string;
  requiresIntake?: boolean;
  variantId?: string;
  variantLabel?: string;
  isMembership?: boolean;
  /**
   * Formulation additive (Vitamin B12 / Glycine). Not a weekly dose.
   */
  requestedFormulation?: string;
  /**
   * Patient current/weekly dose (`getting_started` or e.g. `0.25 mg`).
   * One-time checkout maps this to a fulfillment vial; membership price stays flat.
   */
  requestedDose?: string;
  billingFrequency?: 'monthly';
  purchaseType?: CartPurchaseType;
  discountPercent?: number;
  appliedDiscount?: AppliedDiscount;
  /** Stable line identity: product + variant + purchase type + formulation + weekly dose. */
  key: string;
}

export function lineKey(
  productId: string,
  variantId: string | undefined,
  subscription: boolean,
  purchaseType?: CartPurchaseType,
  requestedFormulation?: string,
  requestedDose?: string,
) {
  const type = purchaseType ?? (subscription ? 'auto_refill' : 'one_time');
  const formulation = requestedFormulation ?? '';
  const dose = requestedDose ?? '';
  return `${productId}|${variantId ?? ''}|${type}|${formulation}|${dose}`;
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

function isMembershipCartLine(item: Pick<CartItem, 'isMembership' | 'purchaseType'>): boolean {
  return Boolean(item.isMembership) || item.purchaseType === 'membership_program';
}

/** Convert leftover Auto-Refill cart lines to one-time so they cannot check out as a subscription. */
export function normalizeCartItemAwayFromAutoRefill(item: CartItem): CartItem {
  if (isMembershipCartLine(item)) {
    return {
      ...item,
      purchaseType: 'membership_program',
      subscription: true,
    };
  }
  const isAuto = item.purchaseType === 'auto_refill' || item.subscription === true;
  const purchaseType: CartPurchaseType =
    !isAuto && item.purchaseType && item.purchaseType !== 'auto_refill'
      ? item.purchaseType
      : 'one_time';
  const variantId = item.variantId?.replace(/-refill$/i, '') ?? item.variantId;
  const standard = item.standardPrice ?? item.price;
  const appliedDiscount = item.appliedDiscount === 'auto_refill' ? 'none' : (item.appliedDiscount ?? 'none');
  const price = isAuto && item.appliedDiscount === 'auto_refill' ? standard : item.price;
  const variantLabel = (item.variantLabel ?? '').replace(/^Auto-Refill\s*·\s*/i, '');
  return {
    ...item,
    subscription: false,
    purchaseType,
    appliedDiscount,
    discountPercent: appliedDiscount === 'none' ? 0 : item.discountPercent,
    price,
    standardPrice: standard,
    variantId,
    variantLabel: variantLabel || item.variantLabel,
    billingFrequency: purchaseType === 'one_time' ? undefined : item.billingFrequency,
    key: lineKey(
      item.productId,
      variantId,
      false,
      purchaseType,
      item.requestedFormulation,
      item.requestedDose,
    ),
  };
}

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
            return normalizeCartItemAwayFromAutoRefill({
              ...i,
              purchaseType,
              standardPrice: i.standardPrice ?? i.price,
              discountPercent: i.discountPercent ?? 0,
              appliedDiscount: i.appliedDiscount ?? 'none',
              key:
                i.key ??
                lineKey(
                  i.productId,
                  i.variantId,
                  i.subscription,
                  purchaseType,
                  i.requestedFormulation,
                  i.requestedDose,
                ),
            });
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
      (item.isMembership ? 'membership_program' : 'one_time');
    const normalized = normalizeCartItemAwayFromAutoRefill({
      ...item,
      quantity: quantity,
      purchaseType,
      standardPrice: item.standardPrice ?? item.price,
      discountPercent: item.discountPercent ?? 0,
      appliedDiscount: item.appliedDiscount ?? 'none',
      key: lineKey(
        item.productId,
        item.variantId,
        item.subscription,
        purchaseType,
        item.requestedFormulation,
        item.requestedDose,
      ),
    });
    const key = normalized.key;
    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          ...normalized,
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
