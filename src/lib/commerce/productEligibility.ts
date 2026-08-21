/**
 * Phase 12F — storefront product eligibility model.
 * Classifies sellable items and checkout / clinical readiness without inventing GEN IDs.
 */

export type ProductCommerceType =
  | 'RX_MEDICATION'
  | 'PROVIDER_VISIT'
  | 'LAB'
  | 'ACCESSORY'
  | 'MEMBERSHIP'
  | 'NON_RX'
  | 'SHIPPING';

export type CatalogReadiness =
  | 'READY'
  | 'TAGADA_BLOCKED'
  | 'GEN_BLOCKED'
  | 'DEPRECATED'
  | 'HIDDEN';

export type GenMappingStatus =
  | 'READY'
  | 'ACTIVE'
  | 'PENDING'
  | 'MISSING'
  | 'EXCLUDED'
  | 'UNKNOWN';

export interface ProductEligibilityInput {
  mbmSku: string | null | undefined;
  productSection?: string | null;
  productId?: string | null;
  /** From kashu_sku_map when known. */
  hasActiveTagadaMapping?: boolean;
  /** From gen_sku_map when known — never invent IDs. */
  genMappingStatus?: GenMappingStatus;
  /** Catalog visibility. */
  isVisible?: boolean;
  status?: 'active' | 'future' | 'deprecated' | string | null;
}

export interface ProductEligibility {
  commerceType: ProductCommerceType;
  readiness: CatalogReadiness;
  /** Tagada card checkout may proceed when Tagada mapping exists. */
  tagadaCheckoutAllowed: boolean;
  /**
   * When GEN handoff automation is enabled, Rx lines without READY/ACTIVE mapping fail closed.
   * Commerce-only Tagada purchase remains allowed while automation is off.
   */
  genHandoffAllowed: boolean;
  requiresPaymentBeforeGen: boolean;
  customerBlockMessage: string | null;
}

const SHIP_SKUS = new Set(['MBM-SHIP-TWO-DAY-001', 'MBM-SHIP-NEXT-DAY-001']);
const MEM_PREFIX = 'MBM-MEM-';
const ACC_PREFIX = 'MBM-ACC-';
const PC_VISIT = new Set(['MBM-PC-IPV-SRV-001', 'MBM-PC-FUV-SRV-001']);
const PC_LAB = new Set(['MBM-PC-LAB-SRV-001', 'MBM-PC-LAB-KIT-001']);

export function classifyCommerceType(input: {
  mbmSku?: string | null;
  productSection?: string | null;
  productId?: string | null;
}): ProductCommerceType {
  const sku = (input.mbmSku || '').toUpperCase();
  if (SHIP_SKUS.has(sku)) return 'SHIPPING';
  if (sku.startsWith(MEM_PREFIX) || input.productId === 'm1' || input.productId === 'm2') {
    return 'MEMBERSHIP';
  }
  if (sku.startsWith(ACC_PREFIX) || input.productSection === 'accessories') return 'ACCESSORY';
  if (PC_VISIT.has(sku)) return 'PROVIDER_VISIT';
  if (PC_LAB.has(sku)) return 'LAB';
  if (input.productSection === 'provider-care') {
    if (/pc1|pc2/i.test(input.productId || '')) return 'PROVIDER_VISIT';
    if (/pc3|pc4/i.test(input.productId || '')) return 'LAB';
  }
  if (sku.startsWith('MBM-')) return 'RX_MEDICATION';
  if (input.productSection === 'accessories') return 'ACCESSORY';
  return 'NON_RX';
}

export function resolveProductEligibility(input: ProductEligibilityInput): ProductEligibility {
  const commerceType = classifyCommerceType(input);
  const visible = input.isVisible !== false && input.status !== 'future';
  const deprecated = input.status === 'deprecated';
  const sku = (input.mbmSku || '').trim();
  const hasTagada = input.hasActiveTagadaMapping === true;
  const gen = input.genMappingStatus ?? 'UNKNOWN';

  if (!visible || deprecated || !sku) {
    return {
      commerceType,
      readiness: deprecated ? 'DEPRECATED' : 'HIDDEN',
      tagadaCheckoutAllowed: false,
      genHandoffAllowed: false,
      requiresPaymentBeforeGen: commerceType === 'RX_MEDICATION',
      customerBlockMessage: 'This product is not available for purchase.',
    };
  }

  if (commerceType === 'ACCESSORY' || commerceType === 'SHIPPING' || commerceType === 'NON_RX') {
    return {
      commerceType,
      readiness: hasTagada || input.hasActiveTagadaMapping === undefined ? 'READY' : 'TAGADA_BLOCKED',
      tagadaCheckoutAllowed: hasTagada || input.hasActiveTagadaMapping === undefined,
      genHandoffAllowed: false,
      requiresPaymentBeforeGen: false,
      customerBlockMessage:
        hasTagada || input.hasActiveTagadaMapping === undefined
          ? null
          : 'This item is temporarily unavailable for card checkout.',
    };
  }

  // Clinical / membership / visits / labs — Tagada commerce OK when mapped; GEN separate.
  if (!hasTagada && input.hasActiveTagadaMapping === false) {
    return {
      commerceType,
      readiness: 'TAGADA_BLOCKED',
      tagadaCheckoutAllowed: false,
      genHandoffAllowed: false,
      requiresPaymentBeforeGen: true,
      customerBlockMessage: 'This item is temporarily unavailable for card checkout.',
    };
  }

  const genReady = gen === 'READY' || gen === 'ACTIVE';
  const genExcluded = gen === 'EXCLUDED';
  const readiness: CatalogReadiness =
    commerceType === 'RX_MEDICATION' ||
    commerceType === 'PROVIDER_VISIT' ||
    commerceType === 'LAB' ||
    commerceType === 'MEMBERSHIP'
      ? genReady || genExcluded
        ? 'READY'
        : 'GEN_BLOCKED'
      : 'READY';

  return {
    commerceType,
    readiness,
    tagadaCheckoutAllowed: true,
    genHandoffAllowed: commerceType === 'RX_MEDICATION' && genReady,
    requiresPaymentBeforeGen: commerceType === 'RX_MEDICATION',
    customerBlockMessage: null,
  };
}

/**
 * Cart gate for Tagada checkout.
 * Pass requireGenMappingForRx from resolveRequireGenMappingForRx(env):
 * - production → true by default (Rx fail-closed without READY/ACTIVE GEN map)
 * - staging/dev → false by default (commerce testing during migration)
 * Explicit REQUIRE_GEN_MAPPING_FOR_RX always wins at the env layer.
 *
 * When requireGenMappingForRx is true, production Rx also requires
 * genApiOrdersEnabled (resolveGenApiOrdersEnabled). Accessories bypass both.
 *
 * Phase 12J.0: productionCheckoutTestSku (from resolveProductionCheckoutTestSku)
 * allows exactly one allowlisted Rx SKU to bypass GEN map + API Orders gates
 * for payment-only live validation. Does not enable GEN handoff.
 * Frontend CTA disable is UX only — this server gate is authoritative.
 */
export function assertCartEligibleForCheckout(input: {
  lines: ProductEligibilityInput[];
  requireGenMappingForRx?: boolean;
  /** From resolveGenApiOrdersEnabled — never trust browser override. */
  genApiOrdersEnabled?: boolean;
  /**
   * From resolveProductionCheckoutTestSku — exact one SKU or null/undefined.
   * When the cart's only Rx SKU matches, GEN map + API Orders gates are skipped.
   */
  productionCheckoutTestSku?: string | null;
}): { ok: true } | { ok: false; message: string; blockedSku?: string } {
  const requireGen = input.requireGenMappingForRx === true;
  const apiOrders = input.genApiOrdersEnabled === true;
  const allowSku = (input.productionCheckoutTestSku || '').trim().toUpperCase() || null;

  const rxSkus = input.lines
    .map((line) => {
      const el = resolveProductEligibility(line);
      if (el.commerceType !== 'RX_MEDICATION') return '';
      return (line.mbmSku || '').trim().toUpperCase();
    })
    .filter(Boolean);
  const testCart =
    !!allowSku &&
    [...new Set(rxSkus)].length === 1 &&
    [...new Set(rxSkus)][0] === allowSku;

  for (const line of input.lines) {
    const el = resolveProductEligibility(line);
    if (!el.tagadaCheckoutAllowed && line.hasActiveTagadaMapping === false) {
      return {
        ok: false,
        message: el.customerBlockMessage || 'An item in your cart is unavailable for checkout.',
        blockedSku: line.mbmSku || undefined,
      };
    }
    if (requireGen && el.commerceType === 'RX_MEDICATION') {
      if (testCart) {
        // Payment-only allowlist: Tagada still required above; GEN/API Orders deferred.
        continue;
      }
      if (!el.genHandoffAllowed) {
        return {
          ok: false,
          message:
            'This medication cannot be checked out until clinical product mapping is ready. Please contact support.',
          blockedSku: line.mbmSku || undefined,
        };
      }
      if (!apiOrders) {
        return {
          ok: false,
          message:
            'This medication is temporarily unavailable for checkout. Please contact support.',
          blockedSku: line.mbmSku || undefined,
        };
      }
    }
  }
  return { ok: true };
}

/** Membership rebill must never auto-create a medication / GEN order. */
export function shouldCreateGenOrderOnMembershipRebill(): false {
  return false;
}
