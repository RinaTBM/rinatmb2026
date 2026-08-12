import { useEffect, useMemo, useState } from 'react';
import { Link, navigate } from '@/router';
import { ArrowLeft, Lock, Check, ShieldCheck, Truck, Ban, RefreshCw, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useMember } from '@/context/MemberContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { upsertManagedSubscription } from '@/lib/account/subscriptions';
import {
  isFreeShippingEligible,
  labelShippingMethod,
  shippingCentsForMethod,
  type SelectableShippingMethod,
  type ShippingMethod,
} from '@/lib/orders/shipping';
import {
  authorizeAccessorySalesTax,
  authorizeProviderCareTax,
  cartAccessorySubtotalCents,
  cartFreeShippingMerchandiseSubtotalCents,
  cartProviderCareSubtotalCents,
  cartRequiresPhysicalShippingFromItems,
} from '@/lib/checkout/authorizeCheckout';
import { getMembership } from '@/data/products';
import {
  programSkuForMembershipAppId,
  skuForVariantId,
} from '@/data/variantSkus';
import { resolveMembershipFulfillmentSku } from '@/lib/catalog/membershipSkuCrosswalk';
import {
  labelRequestedFormulation,
  validateMembershipRequestedFormulation,
} from '@/lib/membership/requestedFormulation';
import { cartItemDetailPath } from '@/lib/catalog/resolveStorefrontDetail';
import {
  isManualCheckoutEnabled,
  isStripeCheckoutEnabled,
  PAYMENTS_UNAVAILABLE_MESSAGE,
} from '@/lib/payments/paymentsEnabled';
import {
  ACTIVE_CHECKOUT_PAYMENT_METHODS,
  assertSelectablePaymentMethod,
  PAYMENT_METHOD_HELP,
  PAYMENT_METHOD_LABELS,
  type ActiveCheckoutPaymentMethod,
} from '@/lib/payments/paymentMethods';
import {
  CHECKOUT_SUBMIT_CTA,
  CHECKOUT_SUBMIT_SUPPORTING_COPY,
} from '@/lib/payments/manualInvoice';
import {
  AUTO_REFILL_MANUAL_BILLING_NOTE,
  cartHasRecurringItems,
  MEMBERSHIP_MANUAL_BILLING_NOTE,
  RECURRING_MANUAL_PAYMENT_DISCLOSURE,
} from '@/lib/payments/recurringCopy';
import { submitInvoiceOrder } from '@/lib/payments/submitInvoiceOrder';
import { supabase } from '@/lib/supabaseClient';
import {
  determineProviderRequirement,
  guestPrescriptionRequiresAuth,
  type ApprovedTherapyHistoryRow,
} from '@/lib/provider/determineProviderRequirement';
import {
  customerCopyForRequirement,
  isProviderVisitLine,
  visitForRequirement,
} from '@/lib/provider/providerVisits';
import { isProviderGuidedPrescriptionLine } from '@/lib/provider/therapyFamilies';

export function CheckoutPage() {
  const { items, subtotal, standardSubtotal, totalSavings, clearCart } = useCart();
  const { isActiveMember, activateMembership } = useMember();
  const { user, session } = useCustomerAuth();
  const [step, setStep] = useState<'info' | 'payment' | 'complete'>('info');
  const [acknowledged, setAcknowledged] = useState<{ terms: boolean; privacy: boolean; refund: boolean; address: boolean }>({ terms: false, privacy: false, refund: false, address: false });
  const allAccepted = acknowledged.terms && acknowledged.privacy && acknowledged.refund && acknowledged.address;
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', state: '', zip: '', phone: '',
  });
  const [shippingMethod, setShippingMethod] = useState<SelectableShippingMethod>('two_day');
  const [paymentMethod, setPaymentMethod] = useState<ActiveCheckoutPaymentMethod>('manual_ach');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [therapyHistory, setTherapyHistory] = useState<ApprovedTherapyHistoryRow[]>([]);
  const checkoutEnabled = isManualCheckoutEnabled();
  const hasRecurring = cartHasRecurringItems(items);

  const hasProviderCare = items.some(i => i.section === 'provider-care' || /^pc\d+$/i.test(i.productId));
  const hasMembership = items.some(
    i => i.isMembership || i.purchaseType === 'membership_program',
  );
  const requiresProviderReview = hasProviderCare || items.some(i => i.requiresIntake) || hasMembership;
  const hasVariablePricing = items.some(i => i.price === 0);

  const cartLinesForProvider = useMemo(
    () =>
      items.map(i => {
        const purchaseType =
          i.purchaseType ??
          (i.isMembership ? 'membership_program' : i.subscription ? 'auto_refill' : 'one_time');
        const isMembershipLine =
          Boolean(i.isMembership) || purchaseType === 'membership_program';
        let sku: string | undefined;
        let fulfillmentSku: string | undefined;
        if (isMembershipLine) {
          sku = programSkuForMembershipAppId(i.productId) ?? undefined;
          fulfillmentSku = resolveMembershipFulfillmentSku(i.productId, i.requestedFormulation)
            ?.fulfillmentSku;
        } else {
          sku = skuForVariantId(i.variantId) ?? undefined;
        }
        return {
          productId: i.productId,
          productName: i.name,
          quantity: i.quantity,
          unitAmountCents: Math.round(i.price * 100),
          variantId: i.variantId,
          variantLabel: i.variantLabel,
          sku,
          fulfillmentSku,
          section: i.section,
          slug: i.slug,
          membershipSlug: isMembershipLine ? i.slug : undefined,
          requestedFormulation: i.requestedFormulation,
          purchaseType,
          isMembership: isMembershipLine,
        };
      }),
    [items],
  );

  const hasProviderGuidedPrescription = cartLinesForProvider.some(line =>
    isProviderGuidedPrescriptionLine({
      productId: line.productId,
      slug: line.slug,
      section: line.section,
      isMembership: line.isMembership,
      purchaseType: line.purchaseType,
    }),
  );

  const guestAuthGate = guestPrescriptionRequiresAuth({
    customerUserId: user?.id,
    hasProviderGuidedPrescription,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!supabase || !user?.id) {
        setTherapyHistory([]);
        return;
      }
      const { data } = await supabase
        .from('customer_therapy_history')
        .select('therapy_family,product_id,variant_id,sku,approval_status,approved_at,created_at')
        .eq('customer_user_id', user.id);
      if (!cancelled) {
        setTherapyHistory((data as ApprovedTherapyHistoryRow[]) ?? []);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const providerPreview = useMemo(() => {
    if (!user?.id || !hasProviderGuidedPrescription) {
      return determineProviderRequirement({
        customerUserId: user?.id,
        prescriptionLines: [],
        approvedTherapyHistory: [],
      });
    }
    return determineProviderRequirement({
      customerUserId: user.id,
      prescriptionLines: cartLinesForProvider
        .filter(line =>
          isProviderGuidedPrescriptionLine({
            productId: line.productId,
            slug: line.slug,
            section: line.section,
            isMembership: line.isMembership,
            purchaseType: line.purchaseType,
          }),
        )
        .map(line => ({
          productId: line.productId,
          slug: line.slug,
          sku: line.sku,
          fulfillmentSku: line.fulfillmentSku,
          variantId: line.variantId,
          isMembership: line.isMembership,
          purchaseType: line.purchaseType,
        })),
      approvedTherapyHistory: therapyHistory,
    });
  }, [user?.id, hasProviderGuidedPrescription, cartLinesForProvider, therapyHistory]);

  const providerCopy = customerCopyForRequirement(providerPreview.requirement);
  const requiredVisit = visitForRequirement(providerPreview.requirement);

  const membershipDoseIssues = items
    .filter(i => i.isMembership || i.purchaseType === 'membership_program')
    .map(i => {
      const membership = getMembership(i.slug);
      const validated = validateMembershipRequestedFormulation({
        requestedFormulation: i.requestedFormulation,
        includedFormulations: membership?.includedFormulations ?? [],
      });
      return validated.ok
        ? null
        : {
            key: i.key,
            slug: i.slug,
            name: i.name,
            error: validated.error,
            fixPath: cartItemDetailPath(i),
          };
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  const membershipDoseBlocking = membershipDoseIssues.length > 0;

  // Strip client provider-visit lines from merchandise subtotal; reinject required visit for display.
  const merchandiseSubtotalCents = items
    .filter(
      i =>
        !isProviderVisitLine({
          productId: i.productId,
          sku: skuForVariantId(i.variantId) ?? null,
        }),
    )
    .reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0);
  const requiredVisitCents = requiredVisit && user?.id ? requiredVisit.priceCents : 0;
  const displaySubtotalCents = merchandiseSubtotalCents + requiredVisitCents;
  const subtotalCents = displaySubtotalCents;
  const cartItemsForAuth = items
    .filter(
      i =>
        !isProviderVisitLine({
          productId: i.productId,
          sku: skuForVariantId(i.variantId) ?? null,
        }),
    )
    .map(i => ({
      productId: i.productId,
      section: i.section,
      quantity: i.quantity,
      unitAmountCents: Math.round(i.price * 100),
      purchaseType: i.purchaseType,
      subscription: i.subscription,
    }));
  if (requiredVisit && user?.id) {
    cartItemsForAuth.push({
      productId: requiredVisit.productId,
      section: requiredVisit.section,
      quantity: 1,
      unitAmountCents: requiredVisit.priceCents,
      purchaseType: 'one_time',
      subscription: false,
    });
  }
  const requiresPhysicalShipping = cartRequiresPhysicalShippingFromItems(cartItemsForAuth);
  // $500 free-shipping threshold uses ordinary merchandise ONLY — never membership value.
  const freeShippingMerchandiseSubtotalCents =
    cartFreeShippingMerchandiseSubtotalCents(cartItemsForAuth);
  const providerCareTaxableCents = cartProviderCareSubtotalCents(cartItemsForAuth);
  const accessoryTaxableCents = cartAccessorySubtotalCents(cartItemsForAuth);
  const providerCareTaxAuth = authorizeProviderCareTax({
    providerCareTaxableSubtotalCents: providerCareTaxableCents,
  });
  const accessoryTaxAuth = authorizeAccessorySalesTax({
    accessoryTaxableSubtotalCents: accessoryTaxableCents,
  });
  const freeShippingEligible =
    requiresPhysicalShipping && isFreeShippingEligible(freeShippingMerchandiseSubtotalCents);
  const resolvedShippingMethod: ShippingMethod = !requiresPhysicalShipping
    ? 'none'
    : freeShippingEligible
      ? 'free_over_500'
      : shippingMethod;
  // Membership carts without free shipping always charge Two-Day / Next-Day amounts.
  // Pass 0 as free-shipping subtotal here so membership value cannot zero out paid shipping.
  const shipping = !requiresPhysicalShipping
    ? 0
    : freeShippingEligible
      ? 0
      : shippingCentsForMethod(resolvedShippingMethod, 0) / 100;
  const providerCareTax = providerCareTaxAuth.providerCareTaxCents / 100;
  const accessorySalesTax = accessoryTaxAuth.accessorySalesTaxCents / 100;
  const displaySubtotal = displaySubtotalCents / 100;
  const total = displaySubtotal + shipping + providerCareTax + accessorySalesTax;

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

  const handleSubmitInvoiceOrder = async () => {
    // Stripe checkout is permanently disabled — never call create-checkout-session.
    if (isStripeCheckoutEnabled()) {
      setError(PAYMENTS_UNAVAILABLE_MESSAGE);
      return;
    }
    if (!checkoutEnabled) {
      setError(PAYMENTS_UNAVAILABLE_MESSAGE);
      return;
    }

    if (!guestAuthGate.ok) {
      setError(guestAuthGate.error);
      return;
    }

    const methodCheck = assertSelectablePaymentMethod(paymentMethod);
    if (!methodCheck.ok) {
      setError(methodCheck.error);
      return;
    }

    setLoading(true);
    setError(null);

    if (membershipDoseBlocking) {
      setError(
        'Please select a requested dose for each membership before checkout. Open the membership details to choose a formulation.',
      );
      setLoading(false);
      return;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anonKey) {
        throw new Error('Checkout is not configured. Please contact us for assistance.');
      }

      const taxCents =
        providerCareTaxAuth.providerCareTaxCents + accessoryTaxAuth.accessorySalesTaxCents;
      const totalCents = Math.round(total * 100);

      const result = await submitInvoiceOrder({
        supabaseUrl,
        anonKey,
        accessToken: session?.access_token ?? null,
        body: {
          paymentMethod: methodCheck.method,
          isActiveMember,
          customerUserId: user?.id,
          customerEmail: form.email || user?.email || '',
          customerName: [form.firstName, form.lastName].filter(Boolean).join(' ') || '',
          subtotalCents,
          discountCents: Math.round(totalSavings * 100),
          shippingCents: Math.round(shipping * 100),
          taxCents,
          totalCents,
          providerCareTaxCents: providerCareTaxAuth.providerCareTaxCents,
          providerCareTaxableSubtotalCents: providerCareTaxAuth.providerCareTaxableSubtotalCents,
          accessorySalesTaxCents: accessoryTaxAuth.accessorySalesTaxCents,
          accessoryTaxableSubtotalCents: accessoryTaxAuth.accessoryTaxableSubtotalCents,
          shippingMethod: resolvedShippingMethod,
          freeShippingEligible,
          requiresProviderReview:
            requiresProviderReview || providerPreview.requirement !== 'NONE',
          items: cartLinesForProvider.map(line => ({
            productId: line.productId,
            quantity: line.quantity,
            subscription: items.find(i => i.productId === line.productId)?.subscription,
            purchaseType: line.purchaseType,
            unitAmountCents: line.unitAmountCents,
            productName: line.productName,
            variantId: line.variantId,
            variantLabel: line.variantLabel,
            sku: line.sku,
            fulfillmentSku: line.fulfillmentSku,
            section: line.section,
            membershipSlug: line.membershipSlug,
            requestedFormulation: line.requestedFormulation,
            memberPricingEligible: line.productId === 'a1' ? false : undefined,
          })),
        },
      });

      if (!result.ok) {
        throw new Error(result.error);
      }

      try {
        sessionStorage.setItem(
          `mbm-invoice:${result.publicOrderNumber}`,
          JSON.stringify({
            invoice: result.invoice,
            bankInstructions: result.bankInstructions,
            token: result.paymentAccessToken,
          }),
        );
      } catch {
        /* ignore quota */
      }

      recordLocalSubscriptions();
      clearCart();
      navigate(result.paymentPath);
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
              <span>Processing begins after payment is verified and any required provider approval is complete</span>
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
                {membershipDoseBlocking && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <p className="font-medium mb-1">Requested dose required</p>
                    <p className="text-xs mb-2">
                      Membership checkout cannot continue until each membership has a requested dose.
                      Your selection is a request only and does not guarantee approval or a prescription.
                    </p>
                    <ul className="space-y-1 text-xs">
                      {membershipDoseIssues.map(issue => (
                        <li key={issue.key}>
                          {issue.name}:{' '}
                          <Link to={issue.fixPath} className="underline font-medium">
                            choose requested dose
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!guestAuthGate.ok && (
                  <div className="rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-gold-900">
                    <p className="font-medium mb-1">Account required for prescription treatments</p>
                    <p className="text-xs mb-2">{guestAuthGate.error}</p>
                    <Link to="/account/login" className="text-xs font-medium underline">
                      Sign in or create an account
                    </Link>
                  </div>
                )}
                {guestAuthGate.ok && hasProviderGuidedPrescription && providerCopy && (
                  <div className="rounded-xl border border-cream-300 bg-white px-4 py-3 text-sm text-ink-800">
                    <p className="font-medium text-ink-900">Provider visit</p>
                    {providerPreview.requirement === 'NONE' ? (
                      <p className="mt-1 text-xs text-ink-600">{providerCopy.detail}</p>
                    ) : (
                      <>
                        <div className="mt-2 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-ink-900">{providerCopy.title}</p>
                            <p className="text-xs text-ink-500 mt-0.5">{providerCopy.detail}</p>
                            <p className="mt-1 inline-block rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-700">
                              Required
                            </p>
                          </div>
                          <span className="text-sm font-medium text-ink-900 whitespace-nowrap">
                            {providerCopy.priceLabel}
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] text-ink-400">
                          This visit is required and cannot be removed. Pricing is set by My Bare Method.
                        </p>
                      </>
                    )}
                  </div>
                )}
                {requiresPhysicalShipping ? (
                  <div>
                    <h2 className="font-serif text-2xl text-ink-900 mb-4">Shipping Method</h2>
                    {hasMembership && (
                      <div className="mb-3 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-800">
                        <p className="font-medium">Shipping after provider approval</p>
                        <p className="mt-1 text-xs leading-relaxed">
                          Choose your preferred shipping speed. Shipping occurs after provider approval
                          and fulfillment processing. Shipping speed does not include provider-review time.
                        </p>
                      </div>
                    )}
                    {freeShippingEligible ? (
                      <div className="rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-gold-800">
                        Orders of $500 or more in eligible ordinary merchandise qualify for free shipping.
                        Membership medication value does not count toward this threshold.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm ${shippingMethod === 'two_day' ? 'border-ink-900 bg-white' : 'border-cream-300 bg-white'}`}>
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={shippingMethod === 'two_day'}
                              onChange={() => setShippingMethod('two_day')}
                            />
                            Two-Day Shipping
                          </span>
                          <span className="font-medium text-ink-900">$30</span>
                        </label>
                        <label className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm ${shippingMethod === 'next_day' ? 'border-ink-900 bg-white' : 'border-cream-300 bg-white'}`}>
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={shippingMethod === 'next_day'}
                              onChange={() => setShippingMethod('next_day')}
                            />
                            Next-Day Shipping
                          </span>
                          <span className="font-medium text-ink-900">$50</span>
                        </label>
                        <p className="text-xs text-ink-500">
                          {hasMembership
                            ? 'Processing and shipping timelines begin only after payment has been received and verified and any required provider review/approval has been completed. Shipping speed applies after fulfillment processing.'
                            : 'Orders of $500 or more in merchandise are eligible for free shipping. Processing and shipping timelines begin only after payment has been received and verified and any required provider review/approval has been completed.'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-cream-300 bg-white px-4 py-3 text-sm text-ink-600">
                    This order contains Provider Care services only. No physical shipping is charged.
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="btn-primary"
                  disabled={membershipDoseBlocking || !guestAuthGate.ok}
                >
                  Continue to Payment
                </button>
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
                  <div className="rounded-xl border border-cream-300 bg-white p-5 space-y-4">
                    {!checkoutEnabled ? (
                      <div className="flex items-start gap-3">
                        <Lock size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-ink-900">{PAYMENTS_UNAVAILABLE_MESSAGE}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <Lock size={18} className="text-gold-500" />
                          <p className="text-sm text-ink-600">
                            Select how you will pay after submitting your order. No payment is withdrawn from your bank
                            when you submit your order.
                          </p>
                        </div>
                        <div className="space-y-2">
                          {ACTIVE_CHECKOUT_PAYMENT_METHODS.map(method => (
                            <label
                              key={method}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                                paymentMethod === method ? 'border-ink-900 bg-white' : 'border-cream-300 bg-cream-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                className="mt-1"
                                checked={paymentMethod === method}
                                onChange={() => setPaymentMethod(method)}
                              />
                              <span>
                                <span className="font-medium text-ink-900 block">
                                  {PAYMENT_METHOD_LABELS[method]}
                                  {method === 'manual_ach' ? (
                                    <span className="ml-2 text-[10px] uppercase tracking-wide text-gold-700">
                                      Recommended
                                    </span>
                                  ) : null}
                                </span>
                                <span className="text-ink-500 text-xs">{PAYMENT_METHOD_HELP[method]}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                        <p className="text-sm text-ink-500">{CHECKOUT_SUBMIT_SUPPORTING_COPY}</p>
                        {hasRecurring ? (
                          <div className="rounded-lg bg-gold-50 p-4 text-sm text-gold-800 leading-relaxed space-y-2">
                            <p className="font-medium">{RECURRING_MANUAL_PAYMENT_DISCLOSURE}</p>
                            <p>{MEMBERSHIP_MANUAL_BILLING_NOTE}</p>
                            <p>{AUTO_REFILL_MANUAL_BILLING_NOTE}</p>
                          </div>
                        ) : null}
                        {hasVariablePricing && (
                          <div className="rounded-lg bg-gold-50 p-4 text-sm text-gold-800 leading-relaxed">
                            Your cart includes items with pricing determined after provider review (e.g. HRT). After
                            payment is received, you will complete a medical intake and, if needed, a consultation and
                            lab review. Once your provider finalizes your personalized treatment plan, you will receive
                            an invoice for any additional prescribed therapy cost before those charges are due.
                          </div>
                        )}
                      </>
                    )}
                    {error && (
                      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
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
                  {checkoutEnabled ? (
                    <button
                      type="button"
                      disabled={!allAccepted || loading || membershipDoseBlocking || !guestAuthGate.ok}
                      onClick={handleSubmitInvoiceOrder}
                      className={`btn-primary flex-1 ${!allAccepted || loading || membershipDoseBlocking || !guestAuthGate.ok ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={18} className="animate-spin" /> Submitting order…
                        </span>
                      ) : (
                        CHECKOUT_SUBMIT_CTA
                      )}
                    </button>
                  ) : (
                    <div
                      role="status"
                      className="flex-1 rounded-xl border border-cream-300 bg-cream-100 px-4 py-3 text-sm text-ink-700"
                    >
                      {PAYMENTS_UNAVAILABLE_MESSAGE}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-lux p-5">
              <h3 className="font-serif text-xl text-ink-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                {items
                  .filter(
                    item =>
                      !isProviderVisitLine({
                        productId: item.productId,
                        sku: skuForVariantId(item.variantId) ?? null,
                      }),
                  )
                  .map(item => {
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
                            {item.requestedFormulation && (
                              <p className="text-xs text-ink-700">
                                Requested dose: {labelRequestedFormulation(item.requestedFormulation)}
                              </p>
                            )}
                            <p className="text-xs text-gold-600">Active Wellness Membership · billed monthly</p>
                            <p className="text-xs text-ink-400">
                              3-month initial term · Provider review required · prescription not guaranteed
                            </p>
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
                {requiredVisit && user?.id && providerCopy && providerPreview.requirement !== 'NONE' ? (
                  <div className="flex gap-3 rounded-lg border border-cream-300 bg-cream-50 p-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900">{requiredVisit.name}</p>
                      <p className="text-xs text-ink-500">{providerCopy.detail}</p>
                      <p className="mt-1 inline-block rounded-full bg-ink-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cream-50">
                        Required
                      </p>
                    </div>
                    <span className="text-sm font-medium text-ink-900">
                      ${(requiredVisit.priceCents / 100).toFixed(2)}
                    </span>
                  </div>
                ) : null}
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
                <div className="flex justify-between text-ink-600"><span>Subtotal</span><span>{hasVariablePricing ? 'TBD after intake' : `$${displaySubtotal.toFixed(2)}`}</span></div>
                {!hasVariablePricing && <>
                  {requiresPhysicalShipping && (
                    <div className="flex justify-between text-ink-600">
                      <span>{labelShippingMethod(resolvedShippingMethod)}</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                  )}
                  {providerCareTax > 0 && (
                    <div className="flex justify-between text-ink-600">
                      <span>Provider Care Tax (1.8%)</span>
                      <span>${providerCareTax.toFixed(2)}</span>
                    </div>
                  )}
                  {accessorySalesTax > 0 && (
                    <div className="flex justify-between text-ink-600">
                      <span>Sales Tax</span>
                      <span>${accessorySalesTax.toFixed(2)}</span>
                    </div>
                  )}
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
