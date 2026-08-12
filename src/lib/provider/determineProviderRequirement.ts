/**
 * Pure provider-requirement rule engine.
 * Only APPROVED therapy-history rows count. PENDING/REJECTED/SUPERSEDED do not.
 * Paid / fulfilled / provider_review_in_progress orders do NOT establish approval.
 */

import { resolveTherapyFamily, type TherapyFamily } from './therapyFamilies';
import {
  visitForRequirement,
  type ProviderRequirementKind,
} from './providerVisits';

export type TherapyApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';

export interface ApprovedTherapyHistoryRow {
  therapy_family: string;
  product_id: string;
  variant_id: string;
  sku: string;
  approval_status: TherapyApprovalStatus | string;
  approved_at?: string | null;
  created_at?: string | null;
}

export interface PrescriptionLineInput {
  productId: string;
  slug?: string;
  /** Retail variant SKU, or membership PROGRAM SKU. */
  sku?: string | null;
  /** Membership → retail fulfillment vial SKU (preferred for comparison). */
  fulfillmentSku?: string | null;
  variantId?: string | null;
  isMembership?: boolean;
  purchaseType?: string | null;
  productName?: string;
}

export interface LineProviderDecision {
  therapyFamily: TherapyFamily;
  requirement: ProviderRequirementKind;
  requestedSku: string;
  previousSku: string | null;
  reason: string;
  productId: string;
}

export interface ProviderRequirementResult {
  requirement: ProviderRequirementKind;
  reason: string;
  previousVariantSku: string | null;
  requestedVariantSku: string | null;
  requiredProviderProductId: string | null;
  lineDecisions: LineProviderDecision[];
  /** Therapy families that triggered a non-NONE requirement. */
  triggeringFamilies: string[];
}

const PRIORITY: Record<ProviderRequirementKind, number> = {
  INITIAL: 3,
  NEW_THERAPY: 3,
  FOLLOW_UP: 2,
  NONE: 1,
};

/** Only APPROVED rows are eligible; SUPERSEDED/PENDING/REJECTED never count. */
export function selectCurrentApprovedForFamily(
  history: ApprovedTherapyHistoryRow[],
  therapyFamily: string,
): ApprovedTherapyHistoryRow | null {
  const approved = history.filter(
    h =>
      h.therapy_family === therapyFamily &&
      String(h.approval_status).toUpperCase() === 'APPROVED',
  );
  if (approved.length === 0) return null;
  approved.sort((a, b) => {
    const aTs = Date.parse(a.approved_at || a.created_at || '') || 0;
    const bTs = Date.parse(b.approved_at || b.created_at || '') || 0;
    return bTs - aTs;
  });
  return approved[0] ?? null;
}

export function hasAnyApprovedTherapy(history: ApprovedTherapyHistoryRow[]): boolean {
  return history.some(h => String(h.approval_status).toUpperCase() === 'APPROVED');
}

/**
 * SKU used for therapy-history comparison.
 * Memberships must use fulfillment vial SKU, never the program SKU.
 */
export function comparisonSkuForLine(line: PrescriptionLineInput): string | null {
  const isMembership =
    Boolean(line.isMembership) ||
    line.purchaseType === 'membership_program' ||
    line.productId === 'm1' ||
    line.productId === 'm2';
  if (isMembership) {
    const fulfillment = line.fulfillmentSku?.trim();
    return fulfillment || null;
  }
  const sku = line.sku?.trim();
  return sku || null;
}

export function determineLineProviderRequirement(input: {
  line: PrescriptionLineInput;
  approvedTherapyHistory: ApprovedTherapyHistoryRow[];
}): LineProviderDecision | null {
  const isMembership =
    Boolean(input.line.isMembership) ||
    input.line.purchaseType === 'membership_program' ||
    input.line.productId === 'm1' ||
    input.line.productId === 'm2';
  const family = resolveTherapyFamily({
    productId: input.line.productId,
    slug: input.line.slug,
    isMembership,
  });
  if (!family) return null;

  const requestedSku = comparisonSkuForLine(input.line);
  if (!requestedSku) {
    return {
      therapyFamily: family,
      requirement: 'INITIAL',
      requestedSku: '',
      previousSku: null,
      reason: `Unable to resolve fulfillment SKU for ${family}; treating as first therapy.`,
      productId: input.line.productId,
    };
  }

  const current = selectCurrentApprovedForFamily(input.approvedTherapyHistory, family);
  const anyApproved = hasAnyApprovedTherapy(input.approvedTherapyHistory);

  if (!current) {
    if (anyApproved) {
      return {
        therapyFamily: family,
        requirement: 'NEW_THERAPY',
        requestedSku,
        previousSku: null,
        reason: `New therapy (${family}); customer has prior approved treatment(s) in other families.`,
        productId: input.line.productId,
      };
    }
    return {
      therapyFamily: family,
      requirement: 'INITIAL',
      requestedSku,
      previousSku: null,
      reason: `First therapy order for ${family}; no approved history.`,
      productId: input.line.productId,
    };
  }

  if (current.sku === requestedSku) {
    return {
      therapyFamily: family,
      requirement: 'NONE',
      requestedSku,
      previousSku: current.sku,
      reason: `Same therapy (${family}) and same approved option (${requestedSku}).`,
      productId: input.line.productId,
    };
  }

  return {
    therapyFamily: family,
    requirement: 'FOLLOW_UP',
    requestedSku,
    previousSku: current.sku,
    reason: `Same therapy (${family}) with changed option (${current.sku} → ${requestedSku}).`,
    productId: input.line.productId,
  };
}

/**
 * Evaluate each prescription line, then collapse to ONE required provider visit max.
 * Priority: INITIAL / NEW_THERAPY > FOLLOW_UP > NONE
 */
export function determineProviderRequirement(input: {
  customerUserId: string | null | undefined;
  prescriptionLines: PrescriptionLineInput[];
  approvedTherapyHistory: ApprovedTherapyHistoryRow[];
}): ProviderRequirementResult {
  const lineDecisions: LineProviderDecision[] = [];
  for (const line of input.prescriptionLines) {
    const decision = determineLineProviderRequirement({
      line,
      approvedTherapyHistory: input.approvedTherapyHistory,
    });
    if (decision) lineDecisions.push(decision);
  }

  if (lineDecisions.length === 0) {
    return {
      requirement: 'NONE',
      reason: 'No provider-guided prescription lines in cart.',
      previousVariantSku: null,
      requestedVariantSku: null,
      requiredProviderProductId: null,
      lineDecisions: [],
      triggeringFamilies: [],
    };
  }

  let best: LineProviderDecision = lineDecisions[0];
  for (const d of lineDecisions.slice(1)) {
    if (PRIORITY[d.requirement] > PRIORITY[best.requirement]) {
      best = d;
    } else if (
      PRIORITY[d.requirement] === PRIORITY[best.requirement] &&
      d.requirement !== 'NONE'
    ) {
      // Prefer INITIAL label over NEW_THERAPY when both top-priority (same visit product).
      if (d.requirement === 'INITIAL' && best.requirement === 'NEW_THERAPY') {
        best = d;
      }
    }
  }

  // Collapse: if any INITIAL or NEW_THERAPY exists, prefer that over FOLLOW_UP.
  const hasInitial = lineDecisions.some(d => d.requirement === 'INITIAL');
  const hasNew = lineDecisions.some(d => d.requirement === 'NEW_THERAPY');
  const hasFollowUp = lineDecisions.some(d => d.requirement === 'FOLLOW_UP');

  let requirement: ProviderRequirementKind = 'NONE';
  if (hasInitial) requirement = 'INITIAL';
  else if (hasNew) requirement = 'NEW_THERAPY';
  else if (hasFollowUp) requirement = 'FOLLOW_UP';

  const triggers = lineDecisions.filter(d => d.requirement !== 'NONE');
  const triggeringFamilies = [...new Set(triggers.map(d => d.therapyFamily))];

  const reasonParts = triggers.map(d => d.reason);
  const reason =
    requirement === 'NONE'
      ? lineDecisions.map(d => d.reason).join(' ')
      : `Collapsed to ${requirement} (one visit max). Triggered by: ${triggeringFamilies.join(', ')}. ${reasonParts.join(' | ')}`;

  const visit = visitForRequirement(requirement);
  const primary =
    triggers.find(d => d.requirement === requirement) ??
    best;

  return {
    requirement,
    reason,
    previousVariantSku: primary.previousSku,
    requestedVariantSku: primary.requestedSku || null,
    requiredProviderProductId: visit?.productId ?? null,
    lineDecisions,
    triggeringFamilies,
  };
}

/** Guest carts with any provider-guided Rx must authenticate before finalizing. */
export function guestPrescriptionRequiresAuth(input: {
  customerUserId: string | null | undefined;
  hasProviderGuidedPrescription: boolean;
}): { ok: true } | { ok: false; error: string } {
  if (input.hasProviderGuidedPrescription && !input.customerUserId) {
    return {
      ok: false,
      error:
        'Please sign in or create an account to continue. We need an account to securely match your treatment history and determine whether a provider visit is needed.',
    };
  }
  return { ok: true };
}
