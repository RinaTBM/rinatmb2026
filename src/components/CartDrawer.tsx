import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link, navigate } from '@/router';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in" onClick={closeCart} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-cream-50 animate-slide-in flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cream-300 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-ink-800" />
                <span className="font-serif text-lg font-medium">Your Cart</span>
                <span className="text-sm text-ink-400">({itemCount})</span>
              </div>
              <button onClick={closeCart} aria-label="Close cart">
                <X size={22} className="text-ink-500 hover:text-ink-900" />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="mb-4 rounded-full bg-cream-200 p-6">
                  <ShoppingBag size={32} className="text-ink-400" />
                </div>
                <p className="font-serif text-xl text-ink-900 mb-2">Your cart is empty</p>
                <p className="text-sm text-ink-500 mb-6">Discover products crafted for your wellness journey.</p>
                <button onClick={() => { closeCart(); navigate('/section/weight-management'); }} className="btn-primary">
                  Shop Products <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={`${item.productId}-${item.subscription}`} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <Link to={`/product/${item.slug}`} onClick={closeCart} className="font-medium text-ink-900 hover:text-gold-600 text-sm">
                              {item.name}
                            </Link>
                            <button onClick={() => removeItem(item.productId, item.subscription)} className="text-ink-400 hover:text-ink-900 flex-shrink-0">
                              <X size={16} />
                            </button>
                          </div>
                          {item.subscription && (
                            <span className="inline-block mt-1 text-xs text-gold-600 font-medium">Subscription</span>
                          )}
                          {item.requiresIntake && (
                            <span className="inline-block mt-1 text-xs text-ink-500">Requires intake</span>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            {item.price === 0 ? (
                              <span className="text-xs text-ink-500">Price determined after intake</span>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 rounded-full border border-ink-200 px-2 py-1">
                                  <button onClick={() => updateQuantity(item.productId, item.subscription, item.quantity - 1)} className="text-ink-500 hover:text-ink-900">
                                    <Minus size={14} />
                                  </button>
                                  <span className="text-sm w-5 text-center">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.productId, item.subscription, item.quantity + 1)} className="text-ink-500 hover:text-ink-900">
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <span className="font-medium text-ink-900">${(item.price * item.quantity).toFixed(2)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-cream-300 px-5 py-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-600">Subtotal</span>
                    <span className="font-medium text-ink-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-ink-400">Shipping and taxes calculated at checkout.</p>
                  <button onClick={() => { closeCart(); navigate('/checkout'); }} className="btn-primary w-full">
                    Checkout <ArrowRight size={16} />
                  </button>
                  <button onClick={closeCart} className="btn-ghost w-full">Continue Shopping</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
