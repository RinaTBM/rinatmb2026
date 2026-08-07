import { useState } from 'react';
import { Link } from '@/router';
import { ArrowLeft, Lock, Check, ShieldCheck, Truck, Ban, RefreshCw, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useMember } from '@/context/MemberContext';
import { upsertManagedSubscription } from '@/lib/account/subscriptions';

export function CheckoutPage() {
  const { items, subtotal, standardSubtotal, totalSavings, clearCart } = useCart();
  const { isActiveMember, activateMembership } = useMember();
  const [step, setStep] = useState<'info' | 'payment' | 'complete'>('info');
  const [acknowledged, setAcknowledged] = useState<{ terms: boolean; privacy: boolean; refund: boolean; address: boolean }>({ terms: false, privacy: false, refund: false, address: false });
  const allAccepted = acknowledged.terms && acknowledged.privacy && acknowledged.refund && acknowledged.address;
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', state: '', zip: '', phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasProviderCare = items.some(i => i.requiresIntake);
  const hasVariablePricing = items.some(i => i.price === 0);
  const shipping = subtotal > 75 ? 0 : 6.95;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const recordLocalSubscriptions = () => {
    const renewal = new Date();
    renewal.setMonth(renewal.getMonth() + 1);
    const renewalDate = renewal.toISOString();

    for (const item of items) {
      if (item.isMembership || item.purchaseType === 'membership_program') {
        const program = item.slug.includes('tirzepatide') ? 'tirzepatide' : 'semaglutide';
        activateMembership({
          program,
          checkoutProductId: (item.productId === 'm2' ? 'm2' : 'm1'),
          displayName: item.name,
          renewalDate,
        });
        upsertManagedSubscription({
          id: `mem_${item.productId}`,
          kind: 'active_wellness_membership',
          name: item.name,
          productId: item.productId,
          slug: item.slug,
          unitPrice: item.price,
          standardPrice: item.standardPrice ?? item.price,
          discountPercent: 0,
          billingFrequency: 'monthly',
          renewalDate,
          status: 'active',
          createdAt: new Date().toISOString(),
        });
      } else if (item.purchaseType === 'auto_refill' || item.subscription) {
        upsertManagedSubscription({
          id: `refill_${item.key}`,
          kind: 'auto_refill',
          name: item.name,
          productId: item.productId,
          slug: item.slug,
          unitPrice: item.price,
          standardPrice: item.standardPrice ?? item.price,
          discountPercent: item.discountPercent ?? 0,
          billingFrequency: 'monthly',
          renewalDate,
          status: 'active',
          createdAt: new Date().toISOString(),
        });
      }
    }
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const res = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          isActiveMember,
          items: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            subscription: i.subscription,
            purchaseType: i.purchaseType ?? (i.isMembership ? 'membership_program' : i.subscription ? 'auto_refill' : 'one_time'),
            unitAmountCents: Math.round(i.price * 100),
            standardPriceCents: Math.round((i.standardPrice ?? i.price) * 100),
            discountPercent: i.discountPercent ?? 0,
            appliedDiscount: i.appliedDiscount ?? 'none',
            productName: i.name,
            variantLabel: i.variantLabel,
            section: i.section,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create checkout session');
      }

      const data = await res.json();
      if (data.url) {
        recordLocalSubscriptions();
        clearCart();
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 'complete') {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500 mb-4">Your cart is empty.</p>
        <Link to="/section/weight-management" className="btn-primary">Shop Products</Link>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="bg-cream-50 pt-28 md:pt-32 min-h-screen flex items-center">
        <div className="container-lux max-w-lg text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold-100">
            <Check size={40} className="text-gold-600" />
          </div>
          <h1 className="font-serif text-4xl text-ink-900 mb-3">Order Confirmed</h1>
          <p className="text-ink-500 mb-8">Thank you for your order. A confirmation has been sent to your email.</p>
          <div className="card-lux p-6 text-left mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-cream-300">
              <span className="text-sm text-ink-500">Order Number</span>
              <span className="font-medium text-ink-900">#MBM-{Math.random().toString(36).slice(2, 8).toUpperCase()}</span>
            </div>
            {hasProviderCare && (
              <div className="flex items-start gap-2 rounded-xl bg-gold-50 p-3 text-sm text-gold-800 mb-4">
                <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
                <p>Your order includes Provider Care products. You will receive an email link to complete your medical intake. A licensed provider will review within 2 business days.</p>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-ink-600">
              <Truck size={18} className="text-gold-500" />
              <span>Estimated delivery: 3–5 business days</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/track" className="btn-primary">Track Your Order</Link>
            <Link to="/" className="btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <div className="container-lux py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-6 transition-colors">
          <ArrowLeft size={14} /> Continue Shopping
        </Link>

        <div className="mb-8 flex items-center gap-4 text-sm">
          <span className={`flex items-center gap-2 ${step === 'info' ? 'text-ink-900 font-medium' : 'text-ink-400'}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step === 'info' ? 'bg-ink-900 text-cream-50' : 'bg-cream-200'}`}>1</span>
            Information
          </span>
          <span className="h-px w-8 bg-ink-200" />
          <span className={`flex items-center gap-2 ${step === 'payment' ? 'text-ink-900 font-medium' : 'text-ink-400'}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step === 'payment' ? 'bg-ink-900 text-cream-50' : 'bg-cream-200'}`}>2</span>
            Payment
          </span>
        </div>

        {isActiveMember && (
          <div className="mb-6 rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-gold-800">
            Active Wellness Member pricing applied automatically on eligible products. Discounts never stack.
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div>
            {step === 'info' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-ink-900 mb-4">Contact</h2>
                  <input type="email" required placeholder="Email" value={form.email} onChange={e => update('email', e.target.value)} className="input-lux" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-ink-900 mb-4">Shipping Address</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input required placeholder="First name" value={form.firstName} onChange={e => update('firstName', e.target.value)} className="input-lux" />
                    <input required placeholder="Last name" value={form.lastName} onChange={e => update('lastName', e.target.value)} className="input-lux" />
                    <input required placeholder="Address" value={form.address} onChange={e => update('address', e.target.value)} className="input-lux sm:col-span-2" />
                    <input required placeholder="City" value={form.city} onChange={e => update('city', e.target.value)} className="input-lux" />
                    <input required placeholder="State" value={form.state} onChange={e => update('state', e.target.value)} className="input-lux" />
                    <input required placeholder="ZIP" value={form.zip} onChange={e => update('zip', e.target.value)} className="input-lux" />
                    <input placeholder="Phone" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-lux" />
                  </div>
                </div>
                <button type="button" onClick={() => setStep('payment')} className="btn-primary">Continue to Payment</button>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-ink-900 mb-4">Confirm Shipping Address</h2>
                  <div className="rounded-xl border border-cream-300 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <Truck size={20} className="flex-shrink-0 mt-0.5 text-gold-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink-900">{form.firstName} {form.lastName}</p>
                        <p className="text-sm text-ink-600">{form.address}</p>
                        <p className="text-sm text-ink-600">{form.city}, {form.state} {form.zip}</p>
                        {form.phone && <p className="text-sm text-ink-600">{form.phone}</p>}
                        <button type="button" onClick={() => setStep('info')} className="mt-2 text-xs text-gold-600 hover:text-gold-700">
                          Edit address
                        </button>
                      </div>
                    </div>
                    <label
                      className={`mt-4 flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        acknowledged.address ? 'border-gold-400 bg-gold-50/50' : 'border-cream-300 bg-cream-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={acknowledged.address}
                        onChange={e => setAcknowledged(prev => ({ ...prev, address: e.target.checked }))}
                        className="mt-0.5 h-4 w-4 flex-shrink-0 accent-gold-500"
                      />
                      <span className="text-xs text-ink-600">
                        I confirm this shipping address is correct and complete.
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl text-ink-900 mb-4">Payment</h2>
                  <div className="rounded-xl border border-cream-300 bg-white p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock size={18} className="text-gold-500" />
                      <p className="text-sm text-ink-600">Secure payment powered by Stripe (Test Mode for discounted / Auto-Refill custom prices)</p>
                    </div>
                    <p className="text-sm text-ink-500 mb-4">
                      Click "Place Order" to be redirected to Stripe's secure checkout page where you can enter your payment details. Your card information is never stored on our servers.
                    </p>
                    {hasVariablePricing && (
                      <div className="rounded-lg bg-gold-50 p-4 text-sm text-gold-800 mb-4 leading-relaxed">
                        Your cart includes items with pricing determined after provider review (e.g. HRT). After checkout, you will complete a medical intake and, if needed, a consultation and lab review. Once your provider finalizes your personalized treatment plan, you will receive an invoice for the exact cost of your prescribed therapy before any charges are made.
                      </div>
                    )}
                    {error && (
                      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 mb-4">
                        {error}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-cream-300 bg-cream-100/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ban size={16} className="text-ink-600" />
                    <p className="text-xs font-semibold text-ink-900">Refund &amp; Replacement Policy</p>
                  </div>
                  <p className="text-xs text-ink-500 mb-2">
                    All sales are final. No refunds or exchanges after an order has been processed or shipped. Because
                    many products are compounded, customized, or temperature-sensitive, returns are not accepted.
                  </p>
                  <div className="flex items-start gap-1.5 text-xs text-ink-500">
                    <RefreshCw size={14} className="flex-shrink-0 mt-0.5 text-green-600" />
                    <p>
                      Damaged, lost, or delayed orders may be replaced at no cost. Notify us within 48 hours with
                      photos.
                    </p>
                  </div>
                  <Link to="/refund-policy" className="text-xs text-gold-600 hover:text-gold-700 mt-2 inline-block">
                    Read full policy →
                  </Link>
                </div>

                <div className="space-y-3">
                  {([
                    { key: 'terms', label: 'Terms & Conditions', href: '/terms' },
                    { key: 'privacy', label: 'Privacy Policy', href: '/privacy-policy' },
                    { key: 'refund', label: 'Refund & Replacement Policy', href: '/refund-policy' },
                  ] as const).map(item => (
                    <label
                      key={item.key}
                      className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                        acknowledged[item.key] ? 'border-gold-400 bg-gold-50/50' : 'border-cream-300 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={acknowledged[item.key]}
                        onChange={e => setAcknowledged(prev => ({ ...prev, [item.key]: e.target.checked }))}
                        className="mt-0.5 h-4 w-4 flex-shrink-0 accent-gold-500"
                      />
                      <span className="text-xs text-ink-600">
                        I have read and accept the{' '}
                        <Link to={item.href} className="text-gold-600 hover:text-gold-700">{item.label}</Link>.
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep('info')} className="btn-outline">Back</button>
                  <button
                    type="button"
                    disabled={!allAccepted || loading}
                    onClick={handleStripeCheckout}
                    className={`btn-primary flex-1 ${!allAccepted || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin" /> Redirecting to Stripe...
                      </span>
                    ) : hasVariablePricing ? (
                      'Begin Intake — Invoice After Review'
                    ) : (
                      `Place Order — $${total.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-lux p-5">
              <h3 className="font-serif text-xl text-ink-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                {items.map(item => {
                  const standard = item.standardPrice ?? item.price;
                  const savings = Math.max(0, (standard - item.price) * item.quantity);
                  return (
                    <div key={item.key} className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`h-14 w-14 rounded-lg bg-cream-100 ${
                            item.section === 'accessories' ? 'object-contain p-1' : 'object-cover'
                          }`}
                        />
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 text-[10px] font-medium text-cream-50">{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900 truncate">{item.name}</p>
                        {item.isMembership ? (
                          <>
                            <p className="text-xs text-gold-600">Active Wellness Membership · billed monthly</p>
                            <p className="text-xs text-ink-400">3-month initial term · Provider review required</p>
                          </>
                        ) : (
                          <>
                            {item.variantLabel && <p className="text-xs text-ink-500 truncate">{item.variantLabel}</p>}
                            {item.section === 'accessories' ? (
                              <p className="text-xs text-ink-500">Quantity: {item.quantity}</p>
                            ) : (
                              <p className="text-xs text-ink-500">
                                {item.purchaseType === 'auto_refill'
                                  ? '○ Auto-Refill & Save · Monthly'
                                  : '○ One-Time Purchase'}
                              </p>
                            )}
                            {standard > item.price && (
                              <p className="text-xs text-ink-400">
                                Standard ${standard.toFixed(2)}
                                {savings > 0 ? ` · Savings $${savings.toFixed(2)}` : ''}
                              </p>
                            )}
                            {item.purchaseType === 'auto_refill' && (
                              <p className="text-xs text-gold-600">Recurring price ${item.price.toFixed(2)}/mo</p>
                            )}
                            {item.requiresIntake && <p className="text-xs text-ink-400">Provider review required</p>}
                          </>
                        )}
                      </div>
                      {item.isMembership ? (
                        <span className="text-sm font-medium text-ink-900">${item.price}/mo</span>
                      ) : item.price === 0 ? (
                        <span className="text-xs text-ink-500">TBD</span>
                      ) : (
                        <span className="text-sm font-medium text-ink-900">
                          ${(item.price * item.quantity).toFixed(2)}
                          {item.purchaseType === 'auto_refill' ? '/mo' : ''}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 border-t border-cream-300 pt-4 text-sm">
                {!hasVariablePricing && standardSubtotal > subtotal && (
                  <div className="flex justify-between text-ink-500">
                    <span>Standard price</span>
                    <span>${standardSubtotal.toFixed(2)}</span>
                  </div>
                )}
                {totalSavings > 0 && (
                  <div className="flex justify-between text-gold-700">
                    <span>{isActiveMember ? 'Member savings' : 'Savings'}</span>
                    <span>−${totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-600"><span>Subtotal</span><span>{hasVariablePricing ? 'TBD after intake' : `$${subtotal.toFixed(2)}`}</span></div>
                {!hasVariablePricing && <>
                  <div className="flex justify-between text-ink-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between text-ink-600"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t border-cream-300 pt-2 font-medium text-ink-900 text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </>}
                {hasVariablePricing && (
                  <div className="flex justify-between border-t border-cream-300 pt-2 font-medium text-ink-900 text-base"><span>Total</span><span>TBD after intake</span></div>
                )}
              </div>
              {hasProviderCare && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-gold-50 p-3 text-xs text-gold-800">
                  <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
                  <p>Includes Provider Care. You will complete a medical intake after checkout. Provider review within 2 business days.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
