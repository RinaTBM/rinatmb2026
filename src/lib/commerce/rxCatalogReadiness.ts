/**
 * Phase 12I.3 — Matrix-driven Rx storefront readiness (from Phase 12I.2 definitive matrix).
 * Does not invent GEN IDs or activate replacement SKUs.
 */

import { FAMILY_VARIANT_SKU_BY_ID } from '../../data/websiteFamilies/familyVariantSkus';

export type WebsiteRxAction =
  | 'KEEP_READY'
  | 'TEMPORARILY_UNAVAILABLE'
  | 'PREPARE_REPLACEMENT_SKU'
  | 'HIDE_DEPRECATED';

export type CustomerFacingRxStatus =
  | 'AVAILABLE'
  | 'TEMPORARILY_UNAVAILABLE'
  | 'COMING_SOON';

export type StorefrontRxAvailability = {
  mbmSku: string;
  websiteAction: WebsiteRxAction;
  customerFacingStatus: CustomerFacingRxStatus;
  /** Customer-safe copy only — never expose GEN/API internals. */
  customerMessage: string | null;
  /** Catalog may be READY while production purchase remains gated. */
  catalogReady: boolean;
  /** True when Tagada checkout is available; GEN handoff may remain manual. */
  productionPurchasable: boolean;
  proposedNewSku: string | null;
  replacesSku: string | null;
};

/** Exactly one READY catalog SKU from Phase 12I.2. */
export const CATALOG_READY_RX_SKUS = Object.freeze(['MBM-RP-BPC-INJ-001'] as const);

/** 9 NEW_SKU_REQUIRED rows — old SKUs blocked for new sales until replacements activate. */
export const NEW_SKU_REQUIRED_RX_SKUS = Object.freeze([
  'MBM-WM-SEM-INJ-001',
  'MBM-WM-SEM-INJ-002',
  'MBM-WM-SEM-INJ-003',
  'MBM-WM-SEM-INJ-004',
  'MBM-WM-TIR-INJ-001',
  'MBM-WM-TIR-INJ-002',
  'MBM-WM-TIR-INJ-003',
  'MBM-WM-TIR-INJ-004',
  'MBM-RP-BPC-CAP-001',
] as const);

/** Remaining sellable Rx SKUs with NO_MATCH / AMBIGUOUS (not READY, not in NEW_SKU list). */
export const TEMPORARILY_UNAVAILABLE_RX_SKUS = Object.freeze([
  'MBM-WM-FB3-INJ-001',
  'MBM-HRT-EST-PAT-001',
  'MBM-HRT-EST-PAT-002',
  'MBM-HRT-EST-PAT-003',
  'MBM-HRT-PRG-CAP-001',
  'MBM-HRT-PRG-CAP-002',
  'MBM-HRT-TST-CRM-001',
  'MBM-LON-NAD-INJ-001',
  'MBM-LON-NAD-INJ-002',
  'MBM-LON-SEL-INJ-001',
  'MBM-LON-SMX-INJ-001',
  'MBM-LON-SSN-NS-001',
  'MBM-LON-TESA-INJ-001',
  'MBM-SH-TRE-CRM-001',
  'MBM-SH-TRE-CRM-002',
  'MBM-SH-TRE-CRM-003',
  'MBM-SH-MIN-SOL-001',
  'MBM-SH-BIM-SOL-001',
] as const);

export type ProposedReplacementSku = {
  category: string;
  websiteProductName: string;
  internalExactFormulation: string;
  dosageForm: string;
  strength: string;
  package: string;
  proposedMbmSku: string;
  replacesMbmSku: string;
  genClientProductId: string | null;
  genPharmacy: string | null;
  genCostCents: number | null;
  websiteDisplayLabel: string;
  availabilityStatus: 'PREPARED_NOT_ACTIVATED';
  tagadaActionRequired: 'CREATE_NEW_PRODUCT_VARIANT';
  membershipImpact: string;
  oldSkuAction: 'BLOCK_NEW_SALES' | 'KEEP_HISTORICAL';
};

/**
 * Prepared replacements only — not activated on storefront / Tagada.
 * Sequences verified: SEM/TIR next = 005; BPC capsule next = 002.
 */
export const PROPOSED_REPLACEMENT_SKUS: readonly ProposedReplacementSku[] = Object.freeze([
  {
    category: 'weight-management',
    websiteProductName: 'Semaglutide',
    internalExactFormulation: 'TBD — GEN Semaglutide formulation when supplied (not +B6)',
    dosageForm: 'Injection',
    strength: '0.5mg',
    package: 'Vial',
    proposedMbmSku: 'MBM-WM-SEM-INJ-005',
    replacesMbmSku: 'MBM-WM-SEM-INJ-001',
    genClientProductId: null,
    genPharmacy: null,
    genCostCents: null,
    websiteDisplayLabel: 'Semaglutide',
    availabilityStatus: 'PREPARED_NOT_ACTIVATED',
    tagadaActionRequired: 'CREATE_NEW_PRODUCT_VARIANT',
    membershipImpact: 'Crosswalk update required only after owner activation',
    oldSkuAction: 'BLOCK_NEW_SALES',
  },
  {
    category: 'weight-management',
    websiteProductName: 'Semaglutide',
    internalExactFormulation: 'TBD — GEN Semaglutide formulation when supplied (not +B6)',
    dosageForm: 'Injection',
    strength: '1mg',
    package: 'Vial',
    proposedMbmSku: 'MBM-WM-SEM-INJ-006',
    replacesMbmSku: 'MBM-WM-SEM-INJ-002',
    genClientProductId: null,
    genPharmacy: null,
    genCostCents: null,
    websiteDisplayLabel: 'Semaglutide',
    availabilityStatus: 'PREPARED_NOT_ACTIVATED',
    tagadaActionRequired: 'CREATE_NEW_PRODUCT_VARIANT',
    membershipImpact: 'Crosswalk update required only after owner activation',
    oldSkuAction: 'BLOCK_NEW_SALES',
  },
  {
    category: 'weight-management',
    websiteProductName: 'Semaglutide',
    internalExactFormulation: 'TBD — GEN Semaglutide formulation when supplied (not +B6)',
    dosageForm: 'Injection',
    strength: '2.5mg',
    package: 'Vial',
    proposedMbmSku: 'MBM-WM-SEM-INJ-007',
    replacesMbmSku: 'MBM-WM-SEM-INJ-003',
    genClientProductId: null,
    genPharmacy: null,
    genCostCents: null,
    websiteDisplayLabel: 'Semaglutide',
    availabilityStatus: 'PREPARED_NOT_ACTIVATED',
    tagadaActionRequired: 'CREATE_NEW_PRODUCT_VARIANT',
    membershipImpact: 'Crosswalk update required only after owner activation',
    oldSkuAction: 'BLOCK_NEW_SALES',
  },
  {
    category: 'weight-management',
    websiteProductName: 'Semaglutide',
    internalExactFormulation: 'TBD — GEN Semaglutide formulation when supplied (not +B6)',
    dosageForm: 'Injection',
    strength: '5mg',
    package: 'Vial',
    proposedMbmSku: 'MBM-WM-SEM-INJ-008',
    replacesMbmSku: 'MBM-WM-SEM-INJ-004',
    genClientProductId: null,
    genPharmacy: null,
    genCostCents: null,
    websiteDisplayLabel: 'Semaglutide',
    availabilityStatus: 'PREPARED_NOT_ACTIVATED',
    tagadaActionRequired: 'CREATE_NEW_PRODUCT_VARIANT',
    membershipImpact: 'Crosswalk update required only after owner activation',
    oldSkuAction: 'BLOCK_NEW_SALES',
  },
  {
    category: 'weight-management',
    websiteProductName: 'Tirzepatide',
    internalExactFormulation: 'TBD — GEN Tirzepatide formulation when supplied (not +B6)',
    dosageForm: 'Injection',
    strength: '2.5mg',
    package: 'Vial',
    proposedMbmSku: 'MBM-WM-TIR-INJ-005',
    replacesMbmSku: 'MBM-WM-TIR-INJ-001',
    genClientProductId: null,
    genPharmacy: null,
    genCostCents: null,
    websiteDisplayLabel: 'Tirzepatide',
    availabilityStatus: 'PREPARED_NOT_ACTIVATED',
    tagadaActionRequired: 'CREATE_NEW_PRODUCT_VARIANT',
    membershipImpact: 'Crosswalk update required only after owner activation',
    oldSkuAction: 'BLOCK_NEW_SALES',
  },
  {
    category: 'weight-management',
    websiteProductName: 'Tirzepatide',
    internalExactFormulation: 'TBD — GEN Tirzepatide formulation when supplied (not +B6)',
    dosageForm: 'Injection',
    strength: '7.5mg',
    package: 'Vial',
    proposedMbmSku: 'MBM-WM-TIR-INJ-006',
    replacesMbmSku: 'MBM-WM-TIR-INJ-002',
    genClientProductId: null,
    genPharmacy: null,
    genCostCents: null,
    websiteDisplayLabel: 'Tirzepatide',
    availabilityStatus: 'PREPARED_NOT_ACTIVATED',
    tagadaActionRequired: 'CREATE_NEW_PRODUCT_VARIANT',
    membershipImpact: 'Crosswalk update required only after owner activation',
    oldSkuAction: 'BLOCK_NEW_SALES',
  },
  {
    category: 'weight-management',
    websiteProductName: 'Tirzepatide',
    internalExactFormulation: 'TBD — GEN Tirzepatide formulation when supplied (not +B6)',
    dosageForm: 'Injection',
    strength: '12.5mg',
    package: 'Vial',
    proposedMbmSku: 'MBM-WM-TIR-INJ-007',
    replacesMbmSku: 'MBM-WM-TIR-INJ-003',
    genClientProductId: null,
    genPharmacy: null,
    genCostCents: null,
    websiteDisplayLabel: 'Tirzepatide',
    availabilityStatus: 'PREPARED_NOT_ACTIVATED',
    tagadaActionRequired: 'CREATE_NEW_PRODUCT_VARIANT',
    membershipImpact: 'Crosswalk update required only after owner activation',
    oldSkuAction: 'BLOCK_NEW_SALES',
  },
  {
    category: 'weight-management',
    websiteProductName: 'Tirzepatide',
    internalExactFormulation: 'TBD — GEN Tirzepatide formulation when supplied (not +B6)',
    dosageForm: 'Injection',
    strength: '15mg',
    package: 'Vial',
    proposedMbmSku: 'MBM-WM-TIR-INJ-008',
    replacesMbmSku: 'MBM-WM-TIR-INJ-004',
    genClientProductId: null,
    genPharmacy: null,
    genCostCents: null,
    websiteDisplayLabel: 'Tirzepatide',
    availabilityStatus: 'PREPARED_NOT_ACTIVATED',
    tagadaActionRequired: 'CREATE_NEW_PRODUCT_VARIANT',
    membershipImpact: 'Crosswalk update required only after owner activation',
    oldSkuAction: 'BLOCK_NEW_SALES',
  },
  {
    category: 'recovery-performance',
    websiteProductName: 'Wolverine: BPC-157/TB-500',
    internalExactFormulation: 'BPC-157 oral (alone) — TBD owner-approved GEN pairing',
    dosageForm: 'Capsule',
    strength: 'TBD',
    package: 'Capsule',
    proposedMbmSku: 'MBM-RP-BPC-CAP-002',
    replacesMbmSku: 'MBM-RP-BPC-CAP-001',
    genClientProductId: null,
    genPharmacy: null,
    genCostCents: null,
    websiteDisplayLabel: 'BPC-157 (capsule)',
    availabilityStatus: 'PREPARED_NOT_ACTIVATED',
    tagadaActionRequired: 'CREATE_NEW_PRODUCT_VARIANT',
    membershipImpact: 'NO',
    oldSkuAction: 'BLOCK_NEW_SALES',
  },
] as const);

const READY_SET = new Set<string>(CATALOG_READY_RX_SKUS);
const NEW_SET = new Set<string>(NEW_SKU_REQUIRED_RX_SKUS);
const UNAVAIL_SET = new Set<string>(TEMPORARILY_UNAVAILABLE_RX_SKUS);

export function resolveStorefrontRxAvailability(input: {
  mbmSku: string | null | undefined;
  /** From resolveGenApiOrdersEnabled — server-safe capability. */
  genApiOrdersEnabled?: boolean;
}): StorefrontRxAvailability | null {
  const sku = (input.mbmSku || '').trim().toUpperCase();
  if (!sku.startsWith('MBM-') || sku.startsWith('MBM-ACC-') || sku.startsWith('MBM-MEM-') || sku.startsWith('MBM-SHIP-') || sku.startsWith('MBM-PC-')) {
    return null;
  }

  const familySkus = new Set(Object.values(FAMILY_VARIANT_SKU_BY_ID));
  if (familySkus.has(sku)) {
    return {
      mbmSku: sku,
      websiteAction: 'KEEP_READY',
      customerFacingStatus: 'AVAILABLE',
      customerMessage: null,
      catalogReady: true,
      // Payment-only: family SKUs may be purchased while GEN API Orders stays OFF.
      productionPurchasable: true,
      proposedNewSku: null,
      replacesSku: null,
    };
  }

  // Every active storefront Rx SKU has an exact active Tagada mapping in
  // production. GEN API Orders controls fulfillment automation, not payment.
  if (
    READY_SET.has(sku) ||
    NEW_SET.has(sku) ||
    UNAVAIL_SET.has(sku) ||
    sku.startsWith('MBM-WM-') ||
    sku.startsWith('MBM-HRT-') ||
    sku.startsWith('MBM-LON-') ||
    sku.startsWith('MBM-RP-') ||
    sku.startsWith('MBM-SH-')
  ) {
    return {
      mbmSku: sku,
      websiteAction: 'KEEP_READY',
      customerFacingStatus: 'AVAILABLE',
      customerMessage: null,
      catalogReady: true,
      productionPurchasable: true,
      proposedNewSku: null,
      replacesSku: null,
    };
  }

  return null;
}

/** Historical SKUs remain resolvable for past orders even when blocked for new sales. */
export function isHistoricalSkuPreserved(mbmSku: string): boolean {
  const sku = mbmSku.trim().toUpperCase();
  return (
    READY_SET.has(sku) ||
    NEW_SET.has(sku) ||
    UNAVAIL_SET.has(sku) ||
    PROPOSED_REPLACEMENT_SKUS.some((p) => p.proposedMbmSku === sku || p.replacesMbmSku === sku)
  );
}

export function catalogSummaryCounts(): {
  totalRx: number;
  catalogReady: number;
  temporarilyUnavailable: number;
  newSkuRequired: number;
  productionRxReady: number;
} {
  return {
    totalRx: 28,
    catalogReady: CATALOG_READY_RX_SKUS.length,
    temporarilyUnavailable: TEMPORARILY_UNAVAILABLE_RX_SKUS.length,
    newSkuRequired: NEW_SKU_REQUIRED_RX_SKUS.length,
    productionRxReady: 28,
  };
}

/** BPC owner pricing snapshot (Phase 12I.2) — display only; no auto retail change. */
export const BPC_OWNER_PRICING = Object.freeze({
  mbmSku: 'MBM-RP-BPC-INJ-001',
  genProductId: 'KXMm9SsbOEYnFy9phmZn',
  genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn',
  formulation: 'BPC-157 / TB500 3 MG / 3 MG/ML (5 ML)',
  pharmacy: 'Optimal Balance Pharmacy',
  currentRetailCents: 19900,
  atCostCents: 11700,
  plus50Cents: 17550,
  plus75Cents: 20475,
  plus100Cents: 23400,
  priceBand: 'BETWEEN +50 AND +75' as const,
  shippingCents: null as number | null,
});

/**
 * Membership launch classification (Phase 12I.3).
 * Prices: $125 SEM / $179 TIR website. Recurring rebill never auto-creates GEN meds.
 */
export type MembershipLaunchStatus =
  | 'SAFE_AS_IS'
  | 'COPY_CHANGE_REQUIRED'
  | 'TEMPORARILY_UNAVAILABLE'
  | 'BLOCKED_PENDING_GEN';

export const MEMBERSHIP_LAUNCH_AUDIT = Object.freeze({
  semaglutide: {
    programSku: 'MBM-MEM-SEM-MEM-001',
    monthlyCents: 12500,
    status: 'BLOCKED_PENDING_GEN' as MembershipLaunchStatus,
    notes:
      'SEM medication maps are NEW_SKU_REQUIRED — membership join must not imply immediate GEN fulfillment. Website membership is $125. Rebill auto-med: NO.',
  },
  tirzepatide: {
    programSku: 'MBM-MEM-TIR-MEM-001',
    monthlyCents: 17900,
    status: 'BLOCKED_PENDING_GEN' as MembershipLaunchStatus,
    notes:
      'TIR website membership is $179. New enrollments use Tagada $179 / $209 / $229. GEN fulfillment remains blocked (API Orders / external-paid OFF). Rebill auto-med: NO.',
  },
});

/**
 * Price approval design (documented — no DB migration in 12I.3).
 * Future fields: pricing_review_status PENDING|APPROVED|REJECTED,
 * approved_retail_cents, approved_at, approved_by.
 */
export const PRICE_APPROVAL_MODEL_NOTE =
  'Documented only in Phase 12I.3 — no Tagada write; no auto retail change.';

/** UX-only mirror of GEN_API_ORDERS_ENABLED. Never trusted by server guards. */
export function resolveClientGenApiOrdersEnabledForUx(): boolean {
  try {
    // Vite public env — display only; server uses GEN_API_ORDERS_ENABLED.
    return String(import.meta.env?.VITE_GEN_API_ORDERS_ENABLED || '').toLowerCase() === 'true';
  } catch {
    return false;
  }
}
