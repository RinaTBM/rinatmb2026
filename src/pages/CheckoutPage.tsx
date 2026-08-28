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
import {
  glp1FamilyIdFromSku,
  glp1FamilyIdFromSlug,
  labelRequestedDose,
  validateRequestedDose,
} from '@/lib/glp1/patientRequestedDose';
import { authorizeGlp1OneTimeOrderLine } from '@/lib/glp1/oneTimeVialMapping';
import { cartItemDetailPath } from '@/lib/catalog/resolveStorefrontDetail';
import {
  isManualCheckoutEnabled,
  isStripeCheckoutEnabled,
  PAYMENTS_UNAVAILABLE_MESSAGE,
} from '@/lib/payments/paymentsEnabled';
import {
  assertSelectablePaymentMethod,
  CARD_CHECKOUT_INIT_FAILED_MESSAGE,
  getActiveCheckoutPaymentMethods,
  PAYMENT_METHOD_HELP,
  PAYMENT_METHOD_LABELS,
  type PaymentMethod,
} from '@/lib/payments/paymentMethods';
import {
  getTagadaMembershipProgram,
} from '@/lib/membership/tagadaMembershipBilling';
import {
  CHECKOUT_SUBMIT_CTA,
  CHECKOUT_SUBMIT_SUPPORTING_COPY,
} from '@/lib/payments/manualInvoice';
import {
  MEMBERSHIP_MANUAL_BILLING_NOTE,
} from '@/lib/payments/recurringCopy';
import { submitInvoiceOrder } from '@/lib/payments/submitInvoiceOrder';
import { createKashuCheckoutSession } from '@/lib/payments/createKashuCheckoutSession';
import {
  evaluateKashuCardCartEligibility,
  isKashuCardEnabled,
  KASHU_CARD_SUBMIT_CTA,
  KASHU_PAYMENT_METHOD,
  navigateToKashuHostedCheckout,
} from '@/lib/payments/kashuTagada';
import { TAX_INCLUSIVE_CHECKOUT_DISCLOSURE } from '@/lib/checkout/checkoutConstants';
import { supabase } from '@/lib/supabaseClient';
import {
  determineProviderRequirement,
  guestPrescriptionRequiresAuth,
  type ApprovedTherapyHistoryRow,
} from '@/lib/provider/determineProviderRequirement';
import {
  customerCopyForRequirement,
  visitForRequirement,
  isProviderVisitLine,
} from '@/lib/provider/providerVisits';
import { isProviderGuidedPrescriptionLine } from '@/lib/provider/therapyFamilies';
import {
  applyMbmTest90Promo,
  applyOgtbmPromo,
  isMbmTest90PromoCode,
  isOgtbmPromoCode,
  MBM_TEST_90_PROMO_CODE,
  OGTBM_PROMO_CODE,
} from '@/lib/promo/ogtbmPromo';
import {
  buildHrtLabPackageLines,
  HRT_LAB_PACKAGE_HEADING,
  HRT_LAB_PACKAGE_TOTAL_CENTS,
  HRT_LAB_REQUIRED_COPY,
  LAB_KIT_INCLUDES_SHIPPING_COPY,
  shouldAutoAddHrtLabPackage,
} from '@/lib/provider/hrtLabPackage';

const MEMBERSHIP_CARD_RECURRING_DISCLOSURE =
  'Your card will be charged monthly for the selected prescription at 15% off plus your selected recurring shipping.';
const MEMBERSHIP_CARD_SHIPPING_NOTE =
  'Your selected Two-Day ($30) or Next-Day ($50) shipping method is included with every monthly renewal. Provider visits, labs, and services are one-time charges.';
const MEMBERSHIP_TERMS_ACCEPTANCE_LABEL =
  'I authorize monthly card billing for my prescription subscription and selected recurring shipping until canceled.';

export function CheckoutPage() {
  const { items, subtotal, standardSubtotal, totalSavings, clearCart } = useCart();
  const { isActiveMember, activateMembership } = useMember();
  const { user, session } = useCustomerAuth();
  const [step, setStep] = useState<'info' | 'payment' | 'complete'>('info');
  const [acknowledged, setAcknowledged] = useState<{
    terms: boolean;
    privacy: boolean;
    refund: boolean;
    address: boolean;
    membershipTerms: boolean;
  }>({ terms: false, privacy: false, refund: false, address: false, membershipTerms: false });
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', state: '', zip: '', phone: '',
  });
  const [shippingMethod, setShippingMethod] = useState<SelectableShippingMethod>('two_day');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kashu_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCardOrder, setPendingCardOrder] = useState<{
    publicOrderNumber: string;
    paymentAccessToken: string;
  } | null>(null);
  const [therapyHistory, setTherapyHistory] = useState<ApprovedTherapyHistoryRow[]>([]);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const checkoutEnabled = isManualCheckoutEnabled();

  const hasProviderCare = items.some(i => i.section === 'provider-care' || /^pc\d+$/i.test(i.productId));
  const hasMembership = items.some(
    i => i.isMembership || i.purchaseType === 'membership_program' || i.purchaseType === 'auto_refill',
  );
  const prescriptionSubscriptionItems = items.filter(i => i.purchaseType === 'auto_refill');
  const allAccepted =
    acknowledged.terms &&
    acknowledged.privacy &&
    acknowledged.refund &&
    acknowledged.address &&
    (!hasMembership || acknowledged.membershipTerms);
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
          requestedDose: i.requestedDose,
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
    .flatMap(i => {
      const membership = getMembership(i.slug);
      const issues: Array<{
        key: string;
        slug: string;
        name: string;
        error: string;
        fixPath: string;
      }> = [];
      const formulation = validateMembershipRequestedFormulation({
        requestedFormulation: i.requestedFormulation,
        includedFormulations: membership?.includedFormulations ?? [],
      });
      if (!formulation.ok) {
        issues.push({
          key: i.key,
          slug: i.slug,
          name: i.name,
          error: formulation.error,
          fixPath: cartItemDetailPath(i),
        });
      }
      const familyId = glp1FamilyIdFromSlug(i.slug);
      if (familyId) {
        const dose = validateRequestedDose({
          requestedDose: i.requestedDose,
          familyId,
          allowGettingStarted: true,
        });
        if (!dose.ok) {
          issues.push({
            key: `${i.key}-dose`,
            slug: i.slug,
            name: i.name,
            error: dose.error,
            fixPath: cartItemDetailPath(i),
          });
        }
      }
      return issues;
    });
  const membershipDoseBlocking = membershipDoseIssues.length > 0;

  const glp1OneTimeDoseIssues = items
    .filter(i => !i.isMembership && i.purchaseType !== 'membership_program')
    .flatMap(i => {
      const familyId =
        glp1FamilyIdFromSlug(i.slug) || glp1FamilyIdFromSku(skuForVariantId(i.variantId));
      if (!familyId) return [];
      const auth = authorizeGlp1OneTimeOrderLine({
        productId: i.productId,
        slug: i.slug,
        sku: skuForVariantId(i.variantId),
        purchaseType: i.purchaseType,
        isMembership: i.isMembership,
        requestedFormulation: i.requestedFormulation,
        requestedDose: i.requestedDose,
        unitAmountCents: Math.round(i.price * 100),
        variantId: i.variantId,
      });
      if (auth.ok) return [];
      return [
        {
          key: `${i.key}-dose`,
          slug: i.slug,
          name: i.name,
          error: auth.error,
          fixPath: cartItemDetailPath(i),
        },
      ];
    });
  const glp1DoseBlocking = membershipDoseBlocking || glp1OneTimeDoseIssues.length > 0;

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

  const hrtLabPreview = useMemo(() => {
    const previewItems = items.map(i => ({
      productId: i.productId,
      slug: i.slug,
      sku: skuForVariantId(i.variantId) ?? programSkuForMembershipAppId(i.productId) ?? null,
      section: i.section,
      category: i.section,
    }));
    // Show required package whenever HRT is in cart and no APPROVED HRT history suppresses it.
    // Do not require auth for preview — guests still need to see the $260 package before signing in.
    // Logged-in customers use loaded therapyHistory (empty array until fetch completes / when none).
    if (
      !shouldAutoAddHrtLabPackage({
        items: previewItems,
        approvedTherapyHistory: user?.id ? therapyHistory : [],
      })
    ) {
      return { lines: [] as ReturnType<typeof buildHrtLabPackageLines>, cents: 0 };
    }
    const lines = buildHrtLabPackageLines({ items: previewItems });
    return {
      lines,
      cents: lines.reduce((s, l) => s + l.unitAmountCents * l.quantity, 0),
    };
  }, [items, user?.id, therapyHistory]);

  const displaySubtotalCents =
    merchandiseSubtotalCents + requiredVisitCents + hrtLabPreview.cents;
  const subtotalCents = displaySubtotalCents;

  const ogtbmPreview = useMemo(() => {
    if (
      (!isOgtbmPromoCode(appliedPromoCode) && !isMbmTest90PromoCode(appliedPromoCode)) ||
      hasMembership
    ) {
      return { discountCents: 0, eligibleUnitCount: 0 };
    }
    const lines = [
      ...items
        .filter(
          i =>
            !isProviderVisitLine({
              productId: i.productId,
              sku: skuForVariantId(i.variantId) ?? null,
            }),
        )
        .map(i => ({
          productId: i.productId,
          sku: skuForVariantId(i.variantId) ?? programSkuForMembershipAppId(i.productId) ?? null,
          section: i.section,
          category: i.section,
          purchaseType: i.purchaseType,
          isMembership: Boolean(i.isMembership),
          quantity: i.quantity,
          unitAmountCents: Math.round(i.price * 100),
        })),
      ...(requiredVisit && user?.id
        ? [
            {
              productId: requiredVisit.productId,
              sku: requiredVisit.sku,
              section: requiredVisit.section,
              category: 'provider-care',
              purchaseType: 'one_time' as const,
              isMembership: false,
              quantity: 1,
              unitAmountCents: requiredVisit.priceCents,
            },
          ]
        : []),
      ...hrtLabPreview.lines.map(l => ({
        productId: l.productId,
        sku: l.sku,
        section: l.section,
        category: 'provider-care',
        purchaseType: 'one_time' as const,
        isMembership: false,
        quantity: l.quantity,
        unitAmountCents: l.unitAmountCents,
      })),
    ];
    const applied = isMbmTest90PromoCode(appliedPromoCode)
      ? applyMbmTest90Promo({
          code: appliedPromoCode,
          customerEmail: form.email || user?.email || '',
          lines,
        })
      : applyOgtbmPromo({ code: appliedPromoCode, lines });
    if (!applied.ok) return { discountCents: 0, eligibleUnitCount: 0 };
    return {
      discountCents: applied.discountCents,
      eligibleUnitCount: applied.eligibleUnitCount,
    };
  }, [
    appliedPromoCode,
    hasMembership,
    items,
    requiredVisit,
    user?.id,
    hrtLabPreview.lines,
    form.email,
    user?.email,
  ]);

  const promoDiscountCents = ogtbmPreview.discountCents;
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
    requiresPhysicalShipping &&
    !hasMembership &&
    isFreeShippingEligible(freeShippingMerchandiseSubtotalCents);
  const resolvedShippingMethod: ShippingMethod = !requiresPhysicalShipping
    ? 'none'
    : freeShippingEligible
      ? 'free_over_500'
      : shippingMethod;
  // Membership: collect Two-Day ($30) / Next-Day ($50); shipping is included in combo monthly rebill.
  // Never free-ship membership enrollment via the $500 merchandise threshold.
  // One-time carts: $500 free-shipping threshold uses ordinary merchandise ONLY.
  const shipping = !requiresPhysicalShipping
    ? 0
    : hasMembership
      ? shippingCentsForMethod(
          resolvedShippingMethod === 'next_day' ? 'next_day' : 'two_day',
          0,
        ) / 100
      : freeShippingEligible
        ? 0
        : shippingCentsForMethod(resolvedShippingMethod, 0) / 100;
  const displaySubtotal = displaySubtotalCents / 100;
  const total = Math.max(
    0,
    displaySubtotal + shipping - promoDiscountCents / 100,
  );
  const shippingCents = Math.round(shipping * 100);

  const membershipProgramSku = items
    .filter(i => i.isMembership || i.purchaseType === 'membership_program')
    .map(i => programSkuForMembershipAppId(i.productId))
    .find((s): s is string => Boolean(s));
  const membershipProgram = getTagadaMembershipProgram(membershipProgramSku);
  const membershipBaseCents = items
    .filter(i => i.purchaseType === 'auto_refill' || i.isMembership || i.purchaseType === 'membership_program')
    .reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
  const membershipMonthlyCents =
    hasMembership && shippingCents > 0
      ? membershipBaseCents + shippingCents
      : membershipBaseCents;
  const membershipEnrollmentVisitCents =
    hasMembership && requiredVisit && user?.id && providerPreview.requirement !== 'NONE'
      ? requiredVisit.priceCents
      : 0;
  const membershipDueTodayCents = hasMembership
    ? membershipMonthlyCents + membershipEnrollmentVisitCents
    : 0;

  const taxCents =
    providerCareTaxAuth.providerCareTaxCents + accessoryTaxAuth.accessorySalesTaxCents;
  const cardEligibilityItems = items.map(i => {
    const isMembershipLine =
      Boolean(i.isMembership) || i.purchaseType === 'membership_program';
    return {
      isMembership: i.isMembership,
      purchaseType: i.purchaseType,
      quantity: i.quantity,
      sku: isMembershipLine
        ? programSkuForMembershipAppId(i.productId) ?? undefined
        : i.variantId
          ? skuForVariantId(i.variantId) ?? undefined
          : undefined,
      productId: i.productId,
    };
  });
  // Include server-required provider visit in eligibility so membership+IPV is evaluated
  // the same way create-invoice-order / create-kashu-checkout-session will see it.
  if (requiredVisit && user?.id && providerPreview.requirement !== 'NONE') {
    cardEligibilityItems.push({
      isMembership: false,
      purchaseType: 'one_time',
      quantity: 1,
      sku: requiredVisit.sku,
      productId: requiredVisit.productId,
    });
  }
  const cardEligibility = evaluateKashuCardCartEligibility({
    flagEnabled: isKashuCardEnabled(),
    shippingCents,
    taxCents,
    items: cardEligibilityItems,
  });

  const hasMembershipItems = hasMembership;

  const selectablePaymentMethods = getActiveCheckoutPaymentMethods().filter(method => {
    if (method !== KASHU_PAYMENT_METHOD) return false;
    return cardEligibility.ok;
  });

  useEffect(() => {
    if (selectablePaymentMethods.includes(KASHU_PAYMENT_METHOD)) {
      setPaymentMethod(KASHU_PAYMENT_METHOD);
      return;
    }
    if (paymentMethod === KASHU_PAYMENT_METHOD && !cardEligibility.ok) {
      // Keep method selected but submit will be blocked — no ACH fallback.
    }
  }, [paymentMethod, cardEligibility.ok, selectablePaymentMethods.join(',')]);

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const recordLocalSubscriptions = (opts?: { activateMemberships?: boolean }) => {
    const renewal = new Date();
    renewal.setMonth(renewal.getMonth() + 1);
    const renewalDate = renewal.toISOString();
    const activateMemberships = opts?.activateMemberships !== false;

    for (const item of items) {
      if (item.isMembership || item.purchaseType === 'membership_program') {
        // Card membership: browser return / order create must NOT activate.
        // Webhook + customer_memberships are authoritative.
        if (!activateMemberships) continue;
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

    if (hasMembershipItems && !cardEligibility.ok) {
      setError(cardEligibility.message);
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

    if (methodCheck.method === KASHU_PAYMENT_METHOD && !cardEligibility.ok) {
      setError(cardEligibility.message);
      return;
    }

    setLoading(true);
    setError(null);

    if (glp1DoseBlocking) {
      setError(
        'Please select a formulation and current dose before checkout. Open the product details to complete provider-review information.',
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

      // Retry hosted checkout for an already-created unpaid card order (avoid duplicates).
      if (
        methodCheck.method === KASHU_PAYMENT_METHOD &&
        pendingCardOrder?.publicOrderNumber &&
        pendingCardOrder.paymentAccessToken
      ) {
        const kashu = await createKashuCheckoutSession({
          supabaseUrl,
          anonKey,
          accessToken: session?.access_token ?? null,
          publicOrderNumber: pendingCardOrder.publicOrderNumber,
          paymentAccessToken: pendingCardOrder.paymentAccessToken,
        });
        if (!kashu.ok) {
          throw new Error(
            CARD_CHECKOUT_INIT_FAILED_MESSAGE +
              (kashu.error ? ` ${kashu.error}` : '') +
              (!kashu.error && kashu.missingSkus?.length
                ? ` Missing SKU mapping: ${kashu.missingSkus.join(', ')}`
                : ''),
          );
        }
        clearCart();
        const nav = navigateToKashuHostedCheckout(kashu.redirectUrl);
        if (!nav.ok) {
          throw new Error(
            nav.error ||
              CARD_CHECKOUT_INIT_FAILED_MESSAGE +
                ' If you are in Bolt Preview, open the site in a full browser tab and retry.',
          );
        }
        return;
      }

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
          discountCents:
            hasMembership || isOgtbmPromoCode(appliedPromoCode) || isMbmTest90PromoCode(appliedPromoCode)
              ? 0
              : Math.round(totalSavings * 100),
          promoCode: hasMembership ? null : appliedPromoCode,
          shippingCents,
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
            slug: line.slug,
            membershipSlug: line.membershipSlug,
            requestedFormulation: line.requestedFormulation,
            requestedDose: line.requestedDose,
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

      if (methodCheck.method === KASHU_PAYMENT_METHOD) {
        setPendingCardOrder({
          publicOrderNumber: result.publicOrderNumber,
          paymentAccessToken: result.paymentAccessToken,
        });
        const kashu = await createKashuCheckoutSession({
          supabaseUrl,
          anonKey,
          accessToken: session?.access_token ?? null,
          publicOrderNumber: result.publicOrderNumber,
          paymentAccessToken: result.paymentAccessToken,
        });
        if (!kashu.ok) {
          throw new Error(
            CARD_CHECKOUT_INIT_FAILED_MESSAGE +
              (kashu.error ? ` ${kashu.error}` : '') +
              (!kashu.error && kashu.missingSkus?.length
                ? ` Missing SKU mapping: ${kashu.missingSkus.join(', ')}`
                : '') +
              ` Your order ${result.publicOrderNumber} was saved unpaid — you can retry secure payment without creating a duplicate.`,
          );
        }
        // Do NOT activate membership on redirect — Tagada webhooks are authoritative.
        recordLocalSubscriptions({ activateMemberships: false });
        clearCart();
        const nav = navigateToKashuHostedCheckout(kashu.redirectUrl);
        if (!nav.ok) {
          throw new Error(
            nav.error ||
              CARD_CHECKOUT_INIT_FAILED_MESSAGE +
                ' If you are in Bolt Preview, open the site in a full browser tab and retry.',
          );
        }
        return;
      }

      recordLocalSubscriptions({ activateMemberships: !hasMembershipItems });
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
                {(membershipDoseBlocking || glp1OneTimeDoseIssues.length > 0) && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <p className="font-medium mb-1">Provider-review information required</p>
                    <p className="text-xs mb-2">
                      Checkout cannot continue until each Semaglutide or Tirzepatide item has a
                      formulation and current dose. Your selection is a request only and does not
                      guarantee approval or a prescription.
                    </p>
                    <ul className="space-y-1 text-xs">
                      {[...membershipDoseIssues, ...glp1OneTimeDoseIssues].map(issue => (
                        <li key={issue.key}>
                          {issue.name}:{' '}
                          <Link to={issue.fixPath} className="underline font-medium">
                            complete selection
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!guestAuthGate.ok && (
                  <div className="rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-gold-900">
                    <p className="font-medium mb-1">Account required for prescription treatments</p>
                    <p className="text-xs mb-2">
                      We need an account to securely match your treatment history and determine whether
                      a provider visit is needed.
                    </p>
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
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink-900 break-words">{providerCopy.title}</p>
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
                        <p className="font-medium">Shipping collected today</p>
                        <p className="mt-1 text-xs leading-relaxed">{MEMBERSHIP_CARD_SHIPPING_NOTE}</p>
                      </div>
                    )}
                    {freeShippingEligible ? (
                      <div className="rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-gold-800">
                        Orders of $500 or more in eligible ordinary merchandise qualify for free shipping.
                        Prescription subscription value does not count toward this threshold.
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
                            ? 'Prescription subscription value is excluded from the $500 free-shipping merchandise threshold. Medication ships after required provider review and approval.'
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
                  disabled={glp1DoseBlocking || !guestAuthGate.ok}
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
                            Pay securely by Credit / Debit Card through our encrypted payment checkout.
                          </p>
                        </div>
                        {selectablePaymentMethods.length === 0 ? (
                          <p className="text-sm text-ink-700">
                            {!isKashuCardEnabled()
                              ? PAYMENTS_UNAVAILABLE_MESSAGE
                              : cardEligibility.ok
                                ? PAYMENTS_UNAVAILABLE_MESSAGE
                                : cardEligibility.message}
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {selectablePaymentMethods.map(method => (
                              <label
                                key={method}
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                                  paymentMethod === method
                                    ? 'border-ink-900 bg-white'
                                    : 'border-cream-300 bg-cream-50'
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
                                  </span>
                                  <span className="text-ink-500 text-xs">
                                    {PAYMENT_METHOD_HELP[method]}
                                  </span>
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                        {isKashuCardEnabled() &&
                        !cardEligibility.ok &&
                        cardEligibility.reason !== 'flag_off' &&
                        selectablePaymentMethods.length > 0 ? (
                          <p className="text-xs text-ink-500">{cardEligibility.message}</p>
                        ) : null}
                        {selectablePaymentMethods.length > 0 ? (
                          <p className="text-sm text-ink-500">
                            {paymentMethod === KASHU_PAYMENT_METHOD
                              ? hasMembershipItems
                                ? 'You will be redirected to complete recurring card enrollment securely. Your subscription stays inactive until payment and subscription are confirmed.'
                                : 'You will be redirected to complete card payment securely. Your order stays unpaid until payment is confirmed.'
                              : CHECKOUT_SUBMIT_SUPPORTING_COPY}
                          </p>
                        ) : null}
                        {hasMembershipItems && selectablePaymentMethods.length > 0 ? (
                          <div className="rounded-lg bg-gold-50 p-4 text-sm text-gold-800 leading-relaxed space-y-2">
                            <p className="font-medium">{MEMBERSHIP_CARD_RECURRING_DISCLOSURE}</p>
                            <p>{MEMBERSHIP_CARD_SHIPPING_NOTE}</p>
                            <p className="text-xs">
                              Applicable taxes are included in displayed prices where required. Monthly rate:{' '}
                              {items
                                .filter(i => i.isMembership || i.purchaseType === 'membership_program' || i.purchaseType === 'auto_refill')
                                .map(i => `${i.name} $${i.price.toFixed(0)}/month`)
                                .join(' · ')}
                            </p>
                          </div>
                        ) : null}
                        {hasMembershipItems && selectablePaymentMethods.length === 0 ? (
                          <div className="rounded-lg bg-gold-50 p-4 text-sm text-gold-800 leading-relaxed space-y-2">
                            <p className="font-medium">{cardEligibility.ok ? PAYMENTS_UNAVAILABLE_MESSAGE : cardEligibility.message}</p>
                            <p>{MEMBERSHIP_MANUAL_BILLING_NOTE}</p>
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
                  {hasMembershipItems ? (
                    <label
                      className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                        acknowledged.membershipTerms ? 'border-gold-400 bg-gold-50/50' : 'border-cream-300 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={acknowledged.membershipTerms}
                        onChange={e =>
                          setAcknowledged(prev => ({ ...prev, membershipTerms: e.target.checked }))
                        }
                        className="mt-0.5 h-4 w-4 flex-shrink-0 accent-gold-500"
                      />
                      <span className="text-xs text-ink-600">
                        {MEMBERSHIP_TERMS_ACCEPTANCE_LABEL}{' '}
                        <Link to="/subscription-terms" className="text-gold-600 hover:text-gold-700">
                          Subscription &amp; Cancellation Terms
                        </Link>
                        .
                      </span>
                    </label>
                  ) : null}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep('info')} className="btn-outline">Back</button>
                  {checkoutEnabled ? (
                    <button
                      type="button"
                      disabled={
                        !allAccepted ||
                        loading ||
                        glp1DoseBlocking ||
                        !guestAuthGate.ok ||
                        selectablePaymentMethods.length === 0
                      }
                      onClick={handleSubmitInvoiceOrder}
                      className={`btn-primary flex-1 ${
                        !allAccepted ||
                        loading ||
                        glp1DoseBlocking ||
                        !guestAuthGate.ok ||
                        selectablePaymentMethods.length === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={18} className="animate-spin" />{' '}
                          {paymentMethod === KASHU_PAYMENT_METHOD
                            ? 'Preparing secure payment…'
                            : 'Submitting order…'}
                        </span>
                      ) : paymentMethod === KASHU_PAYMENT_METHOD ? (
                        KASHU_CARD_SUBMIT_CTA
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
                                Formulation: {labelRequestedFormulation(item.requestedFormulation)}
                              </p>
                            )}
                            {item.requestedDose && (
                              <p className="text-xs text-ink-700">
                                Current dose: {labelRequestedDose(item.requestedDose)}
                              </p>
                            )}
                            <p className="text-xs text-gold-600">Active Wellness Membership · billed monthly</p>
                            <p className="text-xs text-ink-400">
                              3-month initial term · Provider review required · prescription not guaranteed
                            </p>
                          </>
                        ) : (
                          <>
                            {item.variantLabel && (
                              <p className="text-xs text-ink-500 truncate">{item.variantLabel}</p>
                            )}
                            {item.requestedDose && (
                              <p className="text-xs text-ink-700">
                                Current dose: {labelRequestedDose(item.requestedDose)}
                              </p>
                            )}
                            {item.section === 'accessories' ? (
                              <p className="text-xs text-ink-500">Quantity: {item.quantity}</p>
                            ) : (
                              <p className="text-xs text-ink-500">
                                ○ One-Time Purchase
                              </p>
                            )}
                            {standard > item.price && (
                              <p className="text-xs text-ink-400">
                                Standard ${standard.toFixed(2)}
                                {savings > 0 ? ` · Savings $${savings.toFixed(2)}` : ''}
                              </p>
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
                {hrtLabPreview.lines.length > 0 ? (
                  <div className="space-y-2 rounded-lg border border-cream-300 bg-cream-50 p-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                      {HRT_LAB_PACKAGE_HEADING}
                    </p>
                    <p className="text-[11px] text-ink-500">{HRT_LAB_REQUIRED_COPY}</p>
                    {hrtLabPreview.lines.map(line => (
                      <div key={line.sku} className="flex gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink-900">{line.productName}</p>
                          {line.shippingIncluded ? (
                            <p className="text-xs text-ink-500">{LAB_KIT_INCLUDES_SHIPPING_COPY}</p>
                          ) : (
                            <p className="text-xs text-ink-500">Not a medication</p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-ink-900">
                          ${(line.unitAmountCents / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-cream-300 pt-2 text-sm font-medium text-ink-900">
                      <span>Total required lab package</span>
                      <span>${(HRT_LAB_PACKAGE_TOTAL_CENTS / 100).toFixed(2)}</span>
                    </div>
                  </div>
                ) : null}
              </div>
              {!hasMembershipItems ? (
                <div className="border-t border-cream-300 pt-4">
                  <label className="block text-xs font-medium text-ink-600 mb-1" htmlFor="promo-code">
                    Promo code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="promo-code"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 rounded-md border border-cream-300 bg-white px-3 py-2 text-sm"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className="rounded-md bg-ink-900 px-3 py-2 text-sm text-cream-50"
                      onClick={() => {
                        const code = promoInput.trim().toUpperCase();
                        if (isMbmTest90PromoCode(code)) {
                          const checkoutEmail = (form.email || user?.email || '').trim().toLowerCase();
                          if (checkoutEmail !== 'info@thebaremethodmn.com') {
                            setAppliedPromoCode(null);
                            setError('MBMTEST90 is restricted to the approved testing email.');
                            return;
                          }
                          if (items.some(item => item.purchaseType === 'auto_refill' || item.subscription)) {
                            setAppliedPromoCode(null);
                            setError('MBMTEST90 is available for one-time medication checkout testing only.');
                            return;
                          }
                          setAppliedPromoCode(MBM_TEST_90_PROMO_CODE);
                          setError(null);
                        } else if (isOgtbmPromoCode(code)) {
                          setAppliedPromoCode(OGTBM_PROMO_CODE);
                          setError(null);
                        } else if (code) {
                          setAppliedPromoCode(null);
                          setError('That promo code is not valid.');
                        } else {
                          setAppliedPromoCode(null);
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromoCode ? (
                    <p className="mt-1 text-xs text-gold-700">
                      {appliedPromoCode} applied
                      {ogtbmPreview.eligibleUnitCount > 0
                        ? ` — $${(promoDiscountCents / 100).toFixed(2)} off (${ogtbmPreview.eligibleUnitCount} eligible item${ogtbmPreview.eligibleUnitCount === 1 ? '' : 's'})`
                        : ' — no eligible items in this cart'}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div className="space-y-2 border-t border-cream-300 pt-4 text-sm">
                {!hasVariablePricing && standardSubtotal > subtotal && !hasMembershipItems && (
                  <div className="flex justify-between text-ink-500">
                    <span>Standard price</span>
                    <span>${standardSubtotal.toFixed(2)}</span>
                  </div>
                )}
                {totalSavings > 0 && !hasMembershipItems && (
                  <div className="flex justify-between text-gold-700">
                    <span>{isActiveMember ? 'Member savings' : 'Savings'}</span>
                    <span>−${totalSavings.toFixed(2)}</span>
                  </div>
                )}
                {promoDiscountCents > 0 && !hasMembershipItems && (
                  <div className="flex justify-between text-gold-700">
                    <span>Promo ({appliedPromoCode || OGTBM_PROMO_CODE})</span>
                    <span>−${(promoDiscountCents / 100).toFixed(2)}</span>
                  </div>
                )}
                {hasMembershipItems && !hasVariablePricing ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Due today</p>
                    {membershipProgram ? (
                      <div className="flex justify-between text-ink-600">
                        <span>{membershipProgram.displayName}</span>
                        <span>${(membershipBaseCents / 100).toFixed(2)}</span>
                      </div>
                    ) : prescriptionSubscriptionItems.map(item => (
                      <div key={item.key} className="flex justify-between text-ink-600">
                        <span>{item.name} · Subscribe &amp; Save</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {membershipEnrollmentVisitCents > 0 && requiredVisit ? (
                      <div className="flex justify-between text-ink-600">
                        <span>{requiredVisit.name}</span>
                        <span>${(membershipEnrollmentVisitCents / 100).toFixed(2)}</span>
                      </div>
                    ) : null}
                    {shippingCents > 0 && (
                      <div className="flex justify-between text-ink-600">
                        <span>{labelShippingMethod(resolvedShippingMethod === 'next_day' ? 'next_day' : 'two_day')}</span>
                        <span>${(shippingCents / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <p className="text-[11px] text-ink-500 leading-snug">{TAX_INCLUSIVE_CHECKOUT_DISCLOSURE}</p>
                    <div className="flex justify-between border-t border-cream-300 pt-2 font-medium text-ink-900 text-base">
                      <span>Total due today</span>
                      <span>${(membershipDueTodayCents / 100).toFixed(2)}</span>
                    </div>
                    <div className="mt-3 space-y-1 rounded-lg border border-cream-300 bg-cream-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                        Renews monthly
                      </p>
                      {membershipProgram ? (
                        <div className="flex justify-between text-sm text-ink-700">
                          <span>{membershipProgram.displayName}</span>
                          <span>${(membershipBaseCents / 100).toFixed(2)}</span>
                        </div>
                      ) : prescriptionSubscriptionItems.map(item => (
                        <div key={item.key} className="flex justify-between text-sm text-ink-700">
                          <span>{item.name} · Subscribe &amp; Save</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {shippingCents > 0 && (
                        <div className="flex justify-between text-sm text-ink-700">
                          <span>
                            {labelShippingMethod(
                              resolvedShippingMethod === 'next_day' ? 'next_day' : 'two_day',
                            )}
                          </span>
                          <span>${(shippingCents / 100).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-cream-300 pt-2 text-sm font-medium text-ink-900">
                        <span>Monthly renewal</span>
                        <span>${(membershipMonthlyCents / 100).toFixed(2)}/month</span>
                      </div>
                      <p className="text-[11px] text-ink-500 leading-snug">
                        {MEMBERSHIP_CARD_SHIPPING_NOTE}
                      </p>
                      {membershipEnrollmentVisitCents > 0 ? (
                        <p className="text-[11px] text-ink-500 leading-snug">
                          Initial Provider Visit is a one-time enrollment charge and does not rebill.
                        </p>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-ink-600">
                      <span>Subtotal</span>
                      <span>
                        {hasVariablePricing ? 'TBD after intake' : `$${displaySubtotal.toFixed(2)}`}
                      </span>
                    </div>
                    {!hasVariablePricing && (
                      <>
                        {requiresPhysicalShipping && (
                          <div className="flex justify-between text-ink-600">
                            <span>{labelShippingMethod(resolvedShippingMethod)}</span>
                            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                          </div>
                        )}
                        <p className="text-[11px] text-ink-500 leading-snug">
                          {TAX_INCLUSIVE_CHECKOUT_DISCLOSURE}
                        </p>
                        <div className="flex justify-between border-t border-cream-300 pt-2 font-medium text-ink-900 text-base">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    {hasVariablePricing && (
                      <div className="flex justify-between border-t border-cream-300 pt-2 font-medium text-ink-900 text-base">
                        <span>Total</span>
                        <span>TBD after intake</span>
                      </div>
                    )}
                  </>
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
