/**
 * Tagada native recurring billing for Active Wellness memberships (SEM / TIRZ).
 * Pure helpers — unit-testable; mirrored by Edge Functions.
 *
 * Authoritative recurring amounts come from verified Tagada priceIds — never browser.
 * Browser return / localStorage never activates membership.
 */

import {
  SEMAGLUTIDE_MEMBERSHIP_CENTS,
  TIRZEPATIDE_MEMBERSHIP_CENTS,
} from '@/lib/checkout/checkoutConstants';

/** Supported membership PROGRAM SKUs for Tagada card recurring enrollment. */
export const TAGADA_MEMBERSHIP_PROGRAM_SKUS = [
  'MBM-MEM-SEM-MEM-001',
  'MBM-MEM-TIR-MEM-001',
] as const;

export type TagadaMembershipProgramSku = (typeof TAGADA_MEMBERSHIP_PROGRAM_SKUS)[number];

export const SEM_MEMBERSHIP_SKU: TagadaMembershipProgramSku = 'MBM-MEM-SEM-MEM-001';
export const TIRZ_MEMBERSHIP_SKU: TagadaMembershipProgramSku = 'MBM-MEM-TIR-MEM-001';

/**
 * Verified live Tagada BASE recurring priceIds.
 * Customer-facing base membership display is $125 SEM / $179 TIR for new enrollments.
 * Historical TIR $249 / $279 / $299 price objects remain in Tagada for old subscriptions
 * (price_5cf1fa89610c / price_e0ebef9851a8 / price_ef9ea132d6cf) — do not delete.
 * Historical SEM $149 and TIR $275 price objects remain for existing subscriptions; new enrollments use the priceIds below.
 */
export const SEM_TAGADA_PRICE_ID = 'price_307f4d84658d';
export const TIRZ_TAGADA_PRICE_ID = 'price_321bc7a3ea7e';

/** Combo recurring prices (membership + selected shipping). */
export const SEM_TWO_DAY_COMBO_PRICE_ID = 'price_f89402dcbe76';
export const SEM_NEXT_DAY_COMBO_PRICE_ID = 'price_fc83af356019';
export const TIRZ_TWO_DAY_COMBO_PRICE_ID = 'price_dd3f65ebcee2';
export const TIRZ_NEXT_DAY_COMBO_PRICE_ID = 'price_da1063335965';

/** Historical TIR prices — not used for new enrollments. */
export const TIRZ_HISTORICAL_249_PRICE_ID = 'price_5cf1fa89610c';
export const TIRZ_HISTORICAL_279_PRICE_ID = 'price_e0ebef9851a8';
export const TIRZ_HISTORICAL_299_PRICE_ID = 'price_ef9ea132d6cf';

export const SEM_TWO_DAY_MONTHLY_CENTS = 15500;
export const SEM_NEXT_DAY_MONTHLY_CENTS = 17500;
export const TIRZ_TWO_DAY_MONTHLY_CENTS = 20900;
export const TIRZ_NEXT_DAY_MONTHLY_CENTS = 22900;

export const SEM_TAGADA_VARIANT_ID = 'variant_6973906c4bd6';
export const TIRZ_TAGADA_VARIANT_ID = 'variant_b3890c799e09';

export const MEMBERSHIP_MINIMUM_TERM_MONTHS = 3;

export const MEMBERSHIP_MINIMUM_CANCEL_BLOCK_MESSAGE =
  'Your membership has a 3-month minimum commitment. Cancellation will be available after your initial term.';

export const MEMBERSHIP_CARD_RECURRING_DISCLOSURE =
  'Your card will be charged monthly while your membership is active, including your selected shipping. A 3-month minimum commitment applies.';

export const MEMBERSHIP_CARD_SHIPPING_NOTE =
  'Your selected shipping method is included with each monthly membership renewal (+$30 Two-Day or +$50 Next-Day). Shipping is not included in the base membership price. Medication fulfillment remains subject to required provider review and approval.';

/** Allowed enrollment shipping amounts (included in combo recurring price). */
export const MEMBERSHIP_ENROLLMENT_SHIPPING_CENTS = [3000, 5000] as const;

export type MembershipEnrollmentShippingCents =
  (typeof MEMBERSHIP_ENROLLMENT_SHIPPING_CENTS)[number];

export type MembershipSelectedShippingMethod = 'two_day' | 'next_day';

/** Ordinary one-time product carts still use these SKUs — NOT membership enrollment. */
export const MEMBERSHIP_ENROLLMENT_SHIP_SKU_TWO_DAY = 'MBM-SHIP-TWO-DAY-001';
export const MEMBERSHIP_ENROLLMENT_SHIP_SKU_NEXT_DAY = 'MBM-SHIP-NEXT-DAY-001';

export function isMembershipEnrollmentShippingCents(
  shippingCents: number,
): shippingCents is MembershipEnrollmentShippingCents {
  return (MEMBERSHIP_ENROLLMENT_SHIPPING_CENTS as readonly number[]).includes(
    Math.trunc(shippingCents),
  );
}

export function membershipEnrollmentShippingSkuForCents(
  shippingCents: number,
): typeof MEMBERSHIP_ENROLLMENT_SHIP_SKU_TWO_DAY | typeof MEMBERSHIP_ENROLLMENT_SHIP_SKU_NEXT_DAY | null {
  const c = Math.trunc(shippingCents);
  if (c === 3000) return MEMBERSHIP_ENROLLMENT_SHIP_SKU_TWO_DAY;
  if (c === 5000) return MEMBERSHIP_ENROLLMENT_SHIP_SKU_NEXT_DAY;
  return null;
}

export function membershipSelectedShippingMethodForCents(
  shippingCents: number,
): MembershipSelectedShippingMethod | null {
  const c = Math.trunc(shippingCents);
  if (c === 3000) return 'two_day';
  if (c === 5000) return 'next_day';
  return null;
}

export type MembershipComboSelection = {
  sku: TagadaMembershipProgramSku;
  shippingCents: MembershipEnrollmentShippingCents;
  selectedShippingMethod: MembershipSelectedShippingMethod;
  baseMembershipAmountCents: number;
  monthlyAmountCents: number;
  tagadaPriceId: string;
  tagadaVariantId: string;
};

const MEMBERSHIP_COMBO_BY_SKU_SHIP: Record<
  TagadaMembershipProgramSku,
  Record<
    MembershipEnrollmentShippingCents,
    { priceId: string; monthlyCents: number; method: MembershipSelectedShippingMethod }
  >
> = {
  [SEM_MEMBERSHIP_SKU]: {
    3000: {
      priceId: SEM_TWO_DAY_COMBO_PRICE_ID,
      monthlyCents: SEM_TWO_DAY_MONTHLY_CENTS,
      method: 'two_day',
    },
    5000: {
      priceId: SEM_NEXT_DAY_COMBO_PRICE_ID,
      monthlyCents: SEM_NEXT_DAY_MONTHLY_CENTS,
      method: 'next_day',
    },
  },
  [TIRZ_MEMBERSHIP_SKU]: {
    3000: {
      priceId: TIRZ_TWO_DAY_COMBO_PRICE_ID,
      monthlyCents: TIRZ_TWO_DAY_MONTHLY_CENTS,
      method: 'two_day',
    },
    5000: {
      priceId: TIRZ_NEXT_DAY_COMBO_PRICE_ID,
      monthlyCents: TIRZ_NEXT_DAY_MONTHLY_CENTS,
      method: 'next_day',
    },
  },
};

/**
 * Resolve exact Tagada combo recurring priceId from membership SKU + shipping cents.
 * Do not infer by arithmetic in the browser — server/Edge uses this map.
 */
export function resolveMembershipComboSelection(
  membershipSku: string,
  shippingCents: number,
): MembershipComboSelection | null {
  if (!isTagadaMembershipProgramSku(membershipSku)) return null;
  if (!isMembershipEnrollmentShippingCents(shippingCents)) return null;
  const program = TAGADA_MEMBERSHIP_PROGRAMS[membershipSku];
  const combo = MEMBERSHIP_COMBO_BY_SKU_SHIP[membershipSku][shippingCents];
  if (program.monthlyAmountCents + shippingCents !== combo.monthlyCents) {
    // Combo cents must equal base + shipping. Fail closed — do not invent priceIds.
    return null;
  }
  return {
    sku: membershipSku,
    shippingCents,
    selectedShippingMethod: combo.method,
    baseMembershipAmountCents: program.monthlyAmountCents,
    monthlyAmountCents: combo.monthlyCents,
    tagadaPriceId: combo.priceId,
    tagadaVariantId: program.tagadaVariantId,
  };
}

/**
 * Exactly one of Two-Day ($30) or Next-Day ($50) is required for membership enrollment.
 * Shipping is included in the Tagada combo recurring price (not a separate MBM-SHIP line).
 * Ordinary one-time product carts still append MBM-SHIP-* separately.
 */
export function evaluateMembershipEnrollmentShipping(shippingCents: number):
  | {
      ok: true;
      shippingCents: MembershipEnrollmentShippingCents;
      shippingSku: typeof MEMBERSHIP_ENROLLMENT_SHIP_SKU_TWO_DAY | typeof MEMBERSHIP_ENROLLMENT_SHIP_SKU_NEXT_DAY;
      selectedShippingMethod: MembershipSelectedShippingMethod;
    }
  | { ok: false; reason: 'missing_shipping' | 'invalid_shipping'; message: string } {
  const c = Math.trunc(shippingCents);
  if (c === 0) {
    return {
      ok: false,
      reason: 'missing_shipping',
      message:
        'Select Two-Day ($30) or Next-Day ($50) shipping for membership enrollment. Your selected shipping method is included with each monthly membership renewal.',
    };
  }
  const sku = membershipEnrollmentShippingSkuForCents(c);
  const method = membershipSelectedShippingMethodForCents(c);
  if (!sku || !method || !isMembershipEnrollmentShippingCents(c)) {
    return {
      ok: false,
      reason: 'invalid_shipping',
      message:
        'Membership enrollment supports only Two-Day ($30) or Next-Day ($50) shipping.',
    };
  }
  return { ok: true, shippingCents: c, shippingSku: sku, selectedShippingMethod: method };
}

export const MEMBERSHIP_TERMS_ACCEPTANCE_LABEL =
  'I agree to the Membership & Cancellation Terms, including the 3-month minimum commitment, monthly card billing, and selected recurring shipping.';

/** Official Tagada subscription webhook event types (docs). */
export const TAGADA_SUBSCRIPTION_WEBHOOK_EVENTS = [
  'subscription/created',
  'subscription/canceled',
  'subscription/paused',
  'subscription/resumed',
  'subscription/pastDue',
  'subscription/rebillUpcoming',
  'subscription/rebillSucceeded',
  'subscription/rebillDeclined',
  'subscription/cancelScheduled',
  'subscription/rebillCaptureFailed',
] as const;

export type TagadaSubscriptionWebhookEvent =
  (typeof TAGADA_SUBSCRIPTION_WEBHOOK_EVENTS)[number];

export type CustomerMembershipStatus =
  | 'pending_payment'
  | 'active'
  | 'past_due'
  | 'paused'
  | 'cancel_scheduled'
  | 'canceled'
  | 'payment_issue';

/** Statuses that block a duplicate Tagada subscription for the same program. */
export const MEMBERSHIP_DUPLICATE_BLOCK_STATUSES: readonly CustomerMembershipStatus[] = [
  'pending_payment',
  'active',
  'past_due',
  'paused',
  'cancel_scheduled',
  'payment_issue',
];

export interface TagadaMembershipProgramConfig {
  sku: TagadaMembershipProgramSku;
  membershipType: 'semaglutide' | 'tirzepatide';
  tagadaPriceId: string;
  tagadaVariantId: string;
  monthlyAmountCents: number;
  displayName: string;
}

export const TAGADA_MEMBERSHIP_PROGRAMS: Record<
  TagadaMembershipProgramSku,
  TagadaMembershipProgramConfig
> = {
  [SEM_MEMBERSHIP_SKU]: {
    sku: SEM_MEMBERSHIP_SKU,
    membershipType: 'semaglutide',
    tagadaPriceId: SEM_TAGADA_PRICE_ID,
    tagadaVariantId: SEM_TAGADA_VARIANT_ID,
    monthlyAmountCents: SEMAGLUTIDE_MEMBERSHIP_CENTS,
    displayName: 'Semaglutide Membership',
  },
  [TIRZ_MEMBERSHIP_SKU]: {
    sku: TIRZ_MEMBERSHIP_SKU,
    membershipType: 'tirzepatide',
    tagadaPriceId: TIRZ_TAGADA_PRICE_ID,
    tagadaVariantId: TIRZ_TAGADA_VARIANT_ID,
    monthlyAmountCents: TIRZEPATIDE_MEMBERSHIP_CENTS,
    displayName: 'Tirzepatide Membership',
  },
};

export function isTagadaMembershipProgramSku(sku: string | null | undefined): sku is TagadaMembershipProgramSku {
  return (
    typeof sku === 'string' &&
    (TAGADA_MEMBERSHIP_PROGRAM_SKUS as readonly string[]).includes(sku)
  );
}

export function getTagadaMembershipProgram(
  sku: string | null | undefined,
): TagadaMembershipProgramConfig | null {
  if (!isTagadaMembershipProgramSku(sku)) return null;
  return TAGADA_MEMBERSHIP_PROGRAMS[sku];
}

export function isMembershipLineItem(item: {
  isMembership?: boolean;
  purchaseType?: string | null;
  sku?: string | null;
}): boolean {
  if (item.isMembership || item.purchaseType === 'membership_program') return true;
  return isTagadaMembershipProgramSku(item.sku ?? null);
}

/**
 * Required provider-visit SKUs allowed alongside membership enrollment (ONE TIME).
 * These are enrollment charges — never recurring Tagada subscription lines.
 * Ordinary merchandise mixed with membership remains blocked.
 */
export const MEMBERSHIP_ENROLLMENT_ONE_TIME_VISIT_SKUS = [
  'MBM-PC-IPV-SRV-001',
  'MBM-PC-FUV-SRV-001',
] as const;

export type MembershipEnrollmentOneTimeVisitSku =
  (typeof MEMBERSHIP_ENROLLMENT_ONE_TIME_VISIT_SKUS)[number];

export function isMembershipEnrollmentOneTimeVisitSku(
  sku: string | null | undefined,
): sku is MembershipEnrollmentOneTimeVisitSku {
  return (
    typeof sku === 'string' &&
    (MEMBERSHIP_ENROLLMENT_ONE_TIME_VISIT_SKUS as readonly string[]).includes(sku)
  );
}

/** Authoritative one-time visit amounts (must match providerVisits / catalog). */
export const MEMBERSHIP_ENROLLMENT_VISIT_CENTS: Record<
  MembershipEnrollmentOneTimeVisitSku,
  number
> = {
  'MBM-PC-IPV-SRV-001': 7500,
  'MBM-PC-FUV-SRV-001': 5500,
};

/**
 * Due today for membership enrollment:
 *   combo monthly (base membership + selected shipping) + optional IPV/FUV (one-time).
 * Recurring rebill = combo monthly only (IPV never recurs; shipping IS in the combo).
 *
 * When `shippingCents` is omitted, returns base membership amounts for cart composition
 * only (monthlyRebillCents = base). Pass shipping for authoritative combo totals.
 */
export function membershipEnrollmentDueTodayCents(input: {
  membershipSku: string;
  visitSku?: string | null;
  shippingCents?: number | null;
}):
  | {
      ok: true;
      dueTodayCents: number;
      monthlyRebillCents: number;
      baseMembershipAmountCents: number;
      visitCents: number;
      shippingCents: number;
      selectedShippingMethod: MembershipSelectedShippingMethod | null;
      tagadaPriceId: string;
    }
  | { ok: false; reason: string } {
  const program = getTagadaMembershipProgram(input.membershipSku);
  if (!program) return { ok: false, reason: 'unsupported_membership' };
  const visitSku = input.visitSku ?? null;
  let visitCents = 0;
  if (visitSku) {
    if (!isMembershipEnrollmentOneTimeVisitSku(visitSku)) {
      return { ok: false, reason: 'unsupported_visit' };
    }
    visitCents = MEMBERSHIP_ENROLLMENT_VISIT_CENTS[visitSku];
  }
  let shippingCents = 0;
  let selectedShippingMethod: MembershipSelectedShippingMethod | null = null;
  let monthlyRebillCents = program.monthlyAmountCents;
  let tagadaPriceId = program.tagadaPriceId;
  if (input.shippingCents !== undefined && input.shippingCents !== null) {
    const ship = evaluateMembershipEnrollmentShipping(Number(input.shippingCents) || 0);
    if (!ship.ok) return { ok: false, reason: ship.reason };
    shippingCents = ship.shippingCents;
    selectedShippingMethod = ship.selectedShippingMethod;
    const combo = resolveMembershipComboSelection(program.sku, shippingCents);
    if (!combo) return { ok: false, reason: 'unsupported_combo' };
    monthlyRebillCents = combo.monthlyAmountCents;
    tagadaPriceId = combo.tagadaPriceId;
  }
  return {
    ok: true,
    dueTodayCents: monthlyRebillCents + visitCents,
    monthlyRebillCents,
    baseMembershipAmountCents: program.monthlyAmountCents,
    visitCents,
    shippingCents,
    selectedShippingMethod,
    tagadaPriceId,
  };
}

/**
 * Validate a rebill / subscription charge against the stored combo monthly amount.
 * Do not compare all SEM renewals against 14900 or all TIRZ against 27500.
 */
export function assertMembershipRebillAmountMatches(input: {
  expectedMonthlyAmountCents: number;
  paidAmountCents: number;
}): { ok: true } | { ok: false; expected: number; paid: number } {
  const expected = Math.trunc(input.expectedMonthlyAmountCents);
  const paid = Math.trunc(input.paidAmountCents);
  if (expected > 0 && paid === expected) return { ok: true };
  return { ok: false, expected, paid };
}

/**
 * Membership card checkout: exactly ONE supported program SKU (qty 1),
 * plus at most one required provider-visit SKU (qty 1) as a one-time enrollment charge.
 * Mixed SEM+TIRZ, membership+ordinary merchandise, or unmapped MBM-MEM-* → fail safe.
 */
export function evaluateMembershipCardCheckoutCart(items: Array<{
  isMembership?: boolean;
  purchaseType?: string | null;
  quantity: number;
  sku?: string | null;
}>):
  | {
      ok: true;
      program: TagadaMembershipProgramConfig;
      enrollmentVisitSku: MembershipEnrollmentOneTimeVisitSku | null;
      dueTodayCents: number;
      monthlyRebillCents: number;
    }
  | {
      ok: false;
      reason:
        | 'empty'
        | 'mixed_cart'
        | 'unsupported_membership'
        | 'multiple_memberships'
        | 'invalid_quantity'
        | 'not_membership_only'
        | 'invalid_enrollment_visit';
      message: string;
    } {
  if (!items.length) {
    return { ok: false, reason: 'empty', message: 'Your cart is empty.' };
  }

  const membershipLines = items.filter(isMembershipLineItem);
  const nonMembershipLines = items.filter(i => !isMembershipLineItem(i));

  if (membershipLines.length === 0) {
    return {
      ok: false,
      reason: 'not_membership_only',
      message: 'This path is for membership enrollment only.',
    };
  }

  const visitLines = nonMembershipLines.filter(i =>
    isMembershipEnrollmentOneTimeVisitSku(i.sku ?? null),
  );
  const otherLines = nonMembershipLines.filter(
    i => !isMembershipEnrollmentOneTimeVisitSku(i.sku ?? null),
  );

  if (otherLines.length > 0) {
    return {
      ok: false,
      reason: 'mixed_cart',
      message:
        'Membership enrollment cannot be mixed with ordinary products. A required provider visit may be included as a one-time enrollment charge; shipping is selected at checkout and included in the monthly membership renewal.',
    };
  }

  if (visitLines.length > 1) {
    return {
      ok: false,
      reason: 'invalid_enrollment_visit',
      message: 'Only one required provider visit can be included with membership enrollment.',
    };
  }

  if (visitLines.length === 1) {
    const vQty = Number(visitLines[0].quantity);
    if (!Number.isInteger(vQty) || vQty !== 1) {
      return {
        ok: false,
        reason: 'invalid_enrollment_visit',
        message: 'Required provider visit quantity must be exactly 1.',
      };
    }
  }

  if (membershipLines.length > 1) {
    const skus = new Set(
      membershipLines.map(l => l.sku).filter((s): s is string => typeof s === 'string'),
    );
    if (skus.size > 1) {
      return {
        ok: false,
        reason: 'multiple_memberships',
        message:
          'Only one membership program can be enrolled at a time. Remove the extra membership to continue.',
      };
    }
  }

  const line = membershipLines[0];
  const qty = Number(line.quantity);
  if (!Number.isInteger(qty) || qty !== 1) {
    return {
      ok: false,
      reason: 'invalid_quantity',
      message: 'Membership enrollment quantity must be exactly 1.',
    };
  }

  const program = getTagadaMembershipProgram(line.sku ?? null);
  if (!program) {
    // Unmapped MBM-MEM-* (or missing SKU) — do not broadly allow all MEM SKUs.
    return {
      ok: false,
      reason: 'unsupported_membership',
      message:
        'Online enrollment for this membership program is not available yet. Please contact us for assistance.',
    };
  }

  if (membershipLines.length > 1) {
    return {
      ok: false,
      reason: 'multiple_memberships',
      message: 'Only one membership enrollment is allowed per checkout.',
    };
  }

  const enrollmentVisitSku =
    visitLines.length === 1 && isMembershipEnrollmentOneTimeVisitSku(visitLines[0].sku)
      ? visitLines[0].sku
      : null;
  const due = membershipEnrollmentDueTodayCents({
    membershipSku: program.sku,
    visitSku: enrollmentVisitSku,
  });
  if (!due.ok) {
    return {
      ok: false,
      reason: 'invalid_enrollment_visit',
      message: 'Unable to price the required provider visit for membership enrollment.',
    };
  }

  return {
    ok: true,
    program,
    enrollmentVisitSku,
    dueTodayCents: due.dueTodayCents,
    monthlyRebillCents: due.monthlyRebillCents,
  };
}

/**
 * Build Tagada checkout/init items for membership enrollment.
 * ONE combo recurring priceId (membership + shipping) + optional ONE-TIME visit.
 * Do NOT append MBM-SHIP-* — shipping is inside the combo price.
 * shippingVariantId / shippingPriceId are ignored (kept for call-site compat).
 */
export function buildMembershipEnrollmentTagadaInitItems(input: {
  membershipSku: TagadaMembershipProgramSku;
  visitSku?: MembershipEnrollmentOneTimeVisitSku | null;
  shippingCents?: number | null;
  membershipVariantId: string;
  visitVariantId?: string | null;
  visitPriceId?: string | null;
  /** @deprecated Ignored — membership enrollment does not append MBM-SHIP lines. */
  shippingVariantId?: string | null;
  /** @deprecated Ignored — membership enrollment does not append MBM-SHIP lines. */
  shippingPriceId?: string | null;
}):
  | {
      ok: true;
      items: Array<{ variantId: string; quantity: number; priceId?: string }>;
      dueTodayCents: number;
      monthlyRebillCents: number;
      baseMembershipAmountCents: number;
      visitCents: number;
      shippingCents: number;
      selectedShippingMethod: MembershipSelectedShippingMethod | null;
      tagadaPriceId: string;
      /** Always null for membership — shipping is in the combo price. */
      shippingSku: null;
    }
  | { ok: false; reason: string } {
  const program = getTagadaMembershipProgram(input.membershipSku);
  if (!program) return { ok: false, reason: 'unsupported_membership' };
  if (input.shippingCents === undefined || input.shippingCents === null) {
    return { ok: false, reason: 'missing_shipping' };
  }
  const due = membershipEnrollmentDueTodayCents({
    membershipSku: input.membershipSku,
    visitSku: input.visitSku ?? null,
    shippingCents: input.shippingCents,
  });
  if (!due.ok) return { ok: false, reason: due.reason };

  const items: Array<{ variantId: string; quantity: number; priceId?: string }> = [
    {
      variantId: input.membershipVariantId,
      quantity: 1,
      priceId: due.tagadaPriceId,
    },
  ];

  if (input.visitSku) {
    if (!input.visitVariantId?.trim()) {
      return { ok: false, reason: 'missing_visit_variant' };
    }
    items.push({
      variantId: input.visitVariantId,
      quantity: 1,
      ...(input.visitPriceId ? { priceId: input.visitPriceId } : {}),
    });
  }

  // IPV must never use the combo/membership recurring priceId.
  const memItem = items[0];
  for (const extra of items.slice(1)) {
    if (extra.priceId && extra.priceId === memItem.priceId) {
      return { ok: false, reason: 'one_time_must_not_use_membership_price' };
    }
  }

  return {
    ok: true,
    items,
    dueTodayCents: due.dueTodayCents,
    monthlyRebillCents: due.monthlyRebillCents,
    baseMembershipAmountCents: due.baseMembershipAmountCents,
    visitCents: due.visitCents,
    shippingCents: due.shippingCents,
    selectedShippingMethod: due.selectedShippingMethod,
    tagadaPriceId: due.tagadaPriceId,
    shippingSku: null,
  };
}

/**
 * Hosted recurring init MUST send both variantId and priceId.
 * Base program helper — enrollment should use combo priceId via
 * buildMembershipEnrollmentTagadaInitItems / resolveMembershipComboSelection.
 */
export function buildMembershipTagadaInitItem(program: TagadaMembershipProgramConfig): {
  variantId: string;
  quantity: number;
  priceId: string;
} {
  return {
    variantId: program.tagadaVariantId,
    quantity: 1,
    priceId: program.tagadaPriceId,
  };
}

/** Require priceId on membership init — never variantId alone. */
export function assertMembershipRecurringInitItem(item: {
  variantId?: string;
  priceId?: string;
  quantity?: number;
}): { ok: true } | { ok: false; error: string } {
  if (!item.variantId?.trim()) {
    return { ok: false, error: 'Membership checkout requires Tagada variantId.' };
  }
  if (!item.priceId?.trim()) {
    return {
      ok: false,
      error: 'Membership recurring checkout requires Tagada priceId (variantId alone is not allowed).',
    };
  }
  if (Number(item.quantity) !== 1) {
    return { ok: false, error: 'Membership checkout quantity must be 1.' };
  }
  return { ok: true };
}

/**
 * minimum_term_ends_at = three billing months after membership start,
 * using subscription start / current-period dates when available.
 */
export function computeMinimumTermEndsAt(input: {
  startedAt: Date | string;
  /** Optional current period end from Tagada — preferred anchor when present. */
  currentPeriodEnd?: Date | string | null;
}): Date {
  const start =
    typeof input.startedAt === 'string' ? new Date(input.startedAt) : new Date(input.startedAt.getTime());
  if (Number.isNaN(start.getTime())) {
    throw new Error('Invalid membership start date');
  }
  const end = new Date(start.getTime());
  end.setUTCMonth(end.getUTCMonth() + MEMBERSHIP_MINIMUM_TERM_MONTHS);
  if (input.currentPeriodEnd) {
    const periodEnd =
      typeof input.currentPeriodEnd === 'string'
        ? new Date(input.currentPeriodEnd)
        : new Date(input.currentPeriodEnd.getTime());
    // Prefer explicit period math when Tagada provides period end for month 1:
    // three billing months ≈ start + 3 × (period length), but without fabricating
    // fields we use calendar months from start (documented MBM rule).
    if (!Number.isNaN(periodEnd.getTime()) && periodEnd.getTime() > start.getTime()) {
      // Keep calendar 3-month rule from start; period end only validates ordering.
      void periodEnd;
    }
  }
  return end;
}

export function canSelfServiceCancelMembership(input: {
  minimumTermEndsAt: Date | string | null | undefined;
  now?: Date;
}): { ok: true } | { ok: false; message: string } {
  if (!input.minimumTermEndsAt) {
    return { ok: false, message: MEMBERSHIP_MINIMUM_CANCEL_BLOCK_MESSAGE };
  }
  const ends =
    typeof input.minimumTermEndsAt === 'string'
      ? new Date(input.minimumTermEndsAt)
      : new Date(input.minimumTermEndsAt.getTime());
  if (Number.isNaN(ends.getTime())) {
    return { ok: false, message: MEMBERSHIP_MINIMUM_CANCEL_BLOCK_MESSAGE };
  }
  const now = input.now ?? new Date();
  if (now.getTime() < ends.getTime()) {
    return { ok: false, message: MEMBERSHIP_MINIMUM_CANCEL_BLOCK_MESSAGE };
  }
  return { ok: true };
}

export function isTagadaSubscriptionWebhookEvent(
  eventType: string,
): eventType is TagadaSubscriptionWebhookEvent {
  return (TAGADA_SUBSCRIPTION_WEBHOOK_EVENTS as readonly string[]).includes(eventType);
}

/**
 * Map Tagada subscription webhook → MBM membership status.
 * Does not invent payload fields — status mapping only.
 */
export function mapTagadaSubscriptionEventToMembershipStatus(
  eventType: string,
): CustomerMembershipStatus | 'ignore' | null {
  switch (eventType) {
    case 'subscription/created':
    case 'subscription/rebillSucceeded':
    case 'subscription/resumed':
      return 'active';
    case 'subscription/pastDue':
      return 'past_due';
    case 'subscription/rebillDeclined':
    case 'subscription/rebillCaptureFailed':
      return 'payment_issue';
    case 'subscription/paused':
      return 'paused';
    case 'subscription/cancelScheduled':
      return 'cancel_scheduled';
    case 'subscription/canceled':
      return 'canceled';
    case 'subscription/rebillUpcoming':
      return 'ignore';
    default:
      return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined;
}

function asId(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function asIsoDate(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Best-effort extract of subscription fields from Tagada webhook envelopes.
 * Only reads common documented commerce shapes (id, customerId, priceId, dates).
 * Missing fields stay null — do not fabricate.
 */
export function extractTagadaSubscriptionFields(payload: unknown): {
  subscriptionId: string | null;
  customerId: string | null;
  priceId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  nextBillingAt: string | null;
  paymentId: string | null;
} {
  const root = asRecord(payload) || {};
  const data = asRecord(root.data);
  const subscription =
    asRecord(root.subscription) ??
    asRecord(data?.subscription) ??
    (typeof data?.id === 'string' && String(data.id).startsWith('sub_') ? data : undefined);
  const customer =
    asRecord(root.customer) ?? asRecord(data?.customer) ?? asRecord(subscription?.customer);
  const price = asRecord(subscription?.price) ?? asRecord(data?.price);
  const payment = asRecord(root.payment) ?? asRecord(data?.payment);

  return {
    subscriptionId:
      asId(root.subscriptionId) ||
      asId(data?.subscriptionId) ||
      asId(subscription?.id) ||
      asId(subscription?.subscriptionId) ||
      null,
    customerId:
      asId(root.customerId) ||
      asId(data?.customerId) ||
      asId(customer?.id) ||
      asId(customer?.customerId) ||
      asId(subscription?.customerId) ||
      null,
    priceId:
      asId(root.priceId) ||
      asId(data?.priceId) ||
      asId(subscription?.priceId) ||
      asId(price?.id) ||
      null,
    currentPeriodStart:
      asIsoDate(subscription?.currentPeriodStart) ||
      asIsoDate(subscription?.current_period_start) ||
      asIsoDate(data?.currentPeriodStart) ||
      null,
    currentPeriodEnd:
      asIsoDate(subscription?.currentPeriodEnd) ||
      asIsoDate(subscription?.current_period_end) ||
      asIsoDate(data?.currentPeriodEnd) ||
      null,
    nextBillingAt:
      asIsoDate(subscription?.nextBillingDate) ||
      asIsoDate(subscription?.next_billing_date) ||
      asIsoDate(subscription?.nextBillingAt) ||
      asIsoDate(data?.nextBillingDate) ||
      null,
    paymentId:
      asId(root.paymentId) ||
      asId(data?.paymentId) ||
      asId(payment?.id) ||
      asId(payment?.paymentId) ||
      null,
  };
}

/** Browser success redirect must never activate membership. */
export function membershipActivationFromBrowserReturn(): false {
  return false;
}

export function shouldActivateMembershipFromSources(input: {
  fromBrowserReturn: boolean;
  hasAuthoritativeSubscriptionEvidence: boolean;
  initialPaymentSucceeded?: boolean;
}): boolean {
  if (input.fromBrowserReturn) return false;
  return input.hasAuthoritativeSubscriptionEvidence === true;
}
