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
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string, subscription: boolean) => void;
  updateQuantity: (productId: string, subscription: boolean, quantity: number) => void;
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
      if (stored) setItems(JSON.parse(stored));
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
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.subscription === item.subscription);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId && i.subscription === item.subscription
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsOpen(true);
  };

  const removeItem: CartContextValue['removeItem'] = (productId, subscription) =>
    setItems(prev => prev.filter(i => !(i.productId === productId && i.subscription === subscription)));

  const updateQuantity: CartContextValue['updateQuantity'] = (productId, subscription, quantity) => {
    if (quantity < 1) return;
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.subscription === subscription ? { ...i, quantity } : i
      )
    );
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
