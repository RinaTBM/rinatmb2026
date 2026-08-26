/**
 * Owner-approved one-time GLP-1 fulfillment:
 * monthly active-drug requirement = weekly dose × 4 injections.
 * If no exact vial, use the next larger approved Dirx-Hub vial.
 * Vial-specific retail prices are locked from the workbook (not shared group prices).
 *
 * Membership is separate ($149 SEM / $275 TIR) and is not mapped here.
 * Getting Started / Not Sure does not assign a one-time vial.
 *
 * Do not expose concentration math to customers.
 */

import {
  GETTING_STARTED_DOSE,
  formatProviderReviewSnapshot,
  glp1FamilyIdFromProductId,
  glp1FamilyIdFromSku,
  glp1FamilyIdFromSlug,
  normalizeRequestedDose,
  validateGlp1Formulation,
  validateRequestedDose,
  type Glp1FamilyId,
  type Glp1Formulation,
} from './patientRequestedDose.ts';

export interface OneTimeVialMapping {
  familyId: Glp1FamilyId;
  formulation: Glp1Formulation;
  requestedDose: string;
  monthlyRequirementMg: number;
  vialTotalMg: number;
  /** Internal / provider snapshot only — not customer copy. */
  fulfillmentVialLabel: string;
  websiteVariantId: string;
  mbmSku: string;
  retailPriceCents: number;
  backendGroup: string;
  formularyExcelRow: number;
  genProductId: string;
  genClientProductId: string;
  mbmProductId: 'p1' | 'p5';
}

const SEM_GEN = {
  b12Low: {
    id: 'SkqQHmsc0WdsbK9vmV1y',
    full: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y',
  },
  b12Mid: {
    id: 'NF825utCtjVqbbGsnQN3',
    full: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_NF825utCtjVqbbGsnQN3',
  },
  b12High: {
    id: '34I2X8MpVZf3AQTff3bo',
    full: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_34I2X8MpVZf3AQTff3bo',
  },
  glyLow: {
    id: 'tk2GW39OGr7JX4MCCoJP',
    full: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_tk2GW39OGr7JX4MCCoJP',
  },
  glyMid: {
    id: 'CjqOUbPuGPZzxephqRou',
    full: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_CjqOUbPuGPZzxephqRou',
  },
  glyHigh: {
    id: 'sssEk3FDY4LFbQYGQsLx',
    full: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sssEk3FDY4LFbQYGQsLx',
  },
} as const;

const TIR_GEN = {
  id: 'SvFDJ7W4nmWL2bkLUMMS',
  full: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
} as const;

type VialSpec = {
  monthlyRequirementMg: number;
  vialTotalMg: number;
  fulfillmentVialLabel: string;
  websiteVariantId: string;
  mbmSku: string;
  retailPriceCents: number;
  backendGroup: string;
  formularyExcelRow: number;
  genProductId: string;
  genClientProductId: string;
};

const SEM_B12: Record<string, VialSpec> = {
  '0.25 mg': {
    monthlyRequirementMg: 1,
    vialTotalMg: 1,
    fulfillmentVialLabel: '1 mg vial',
    websiteVariantId: 'sem-b12-starting-low',
    mbmSku: 'MBM-WM-SEM-B12-001',
    retailPriceCents: 10900,
    backendGroup: 'Starting / Low',
    formularyExcelRow: 3,
    genProductId: SEM_GEN.b12Low.id,
    genClientProductId: SEM_GEN.b12Low.full,
  },
  '0.5 mg': {
    monthlyRequirementMg: 2,
    vialTotalMg: 2,
    fulfillmentVialLabel: '2 mg vial',
    websiteVariantId: 'sem-b12-2mg',
    mbmSku: 'MBM-WM-SEM-B12-005',
    retailPriceCents: 11900,
    backendGroup: 'Starting / Low',
    formularyExcelRow: 5,
    genProductId: SEM_GEN.b12Low.id,
    genClientProductId: SEM_GEN.b12Low.full,
  },
  '0.75 mg': {
    monthlyRequirementMg: 3,
    vialTotalMg: 4,
    fulfillmentVialLabel: '4 mg vial',
    websiteVariantId: 'sem-b12-mid',
    mbmSku: 'MBM-WM-SEM-B12-002',
    retailPriceCents: 11900,
    backendGroup: 'Mid',
    formularyExcelRow: 7,
    genProductId: SEM_GEN.b12Mid.id,
    genClientProductId: SEM_GEN.b12Mid.full,
  },
  '1 mg': {
    monthlyRequirementMg: 4,
    vialTotalMg: 4,
    fulfillmentVialLabel: '4 mg vial',
    websiteVariantId: 'sem-b12-mid',
    mbmSku: 'MBM-WM-SEM-B12-002',
    retailPriceCents: 11900,
    backendGroup: 'Mid',
    formularyExcelRow: 7,
    genProductId: SEM_GEN.b12Mid.id,
    genClientProductId: SEM_GEN.b12Mid.full,
  },
  '1.25 mg': {
    monthlyRequirementMg: 5,
    vialTotalMg: 6,
    fulfillmentVialLabel: '6 mg vial',
    websiteVariantId: 'sem-b12-high',
    mbmSku: 'MBM-WM-SEM-B12-003',
    retailPriceCents: 12900,
    backendGroup: 'High',
    formularyExcelRow: 9,
    genProductId: SEM_GEN.b12High.id,
    genClientProductId: SEM_GEN.b12High.full,
  },
  '1.5 mg': {
    monthlyRequirementMg: 6,
    vialTotalMg: 6,
    fulfillmentVialLabel: '6 mg vial',
    websiteVariantId: 'sem-b12-high',
    mbmSku: 'MBM-WM-SEM-B12-003',
    retailPriceCents: 12900,
    backendGroup: 'High',
    formularyExcelRow: 9,
    genProductId: SEM_GEN.b12High.id,
    genClientProductId: SEM_GEN.b12High.full,
  },
  '1.75 mg': {
    monthlyRequirementMg: 7,
    vialTotalMg: 10,
    fulfillmentVialLabel: '10 mg vial',
    websiteVariantId: 'sem-b12-10mg',
    mbmSku: 'MBM-WM-SEM-B12-006',
    retailPriceCents: 13900,
    backendGroup: 'High',
    formularyExcelRow: 11,
    genProductId: SEM_GEN.b12High.id,
    genClientProductId: SEM_GEN.b12High.full,
  },
  '2 mg': {
    monthlyRequirementMg: 8,
    vialTotalMg: 10,
    fulfillmentVialLabel: '10 mg vial',
    websiteVariantId: 'sem-b12-10mg',
    mbmSku: 'MBM-WM-SEM-B12-006',
    retailPriceCents: 13900,
    backendGroup: 'High',
    formularyExcelRow: 11,
    genProductId: SEM_GEN.b12High.id,
    genClientProductId: SEM_GEN.b12High.full,
  },
};

const SEM_GLY: Record<string, VialSpec> = {
  '0.25 mg': { ...SEM_B12['0.25 mg'], websiteVariantId: 'sem-glycine-starting-low', mbmSku: 'MBM-WM-SEM-GLY-001', formularyExcelRow: 2, genProductId: SEM_GEN.glyLow.id, genClientProductId: SEM_GEN.glyLow.full },
  '0.5 mg': { ...SEM_B12['0.5 mg'], websiteVariantId: 'sem-glycine-2mg', mbmSku: 'MBM-WM-SEM-GLY-005', formularyExcelRow: 4, genProductId: SEM_GEN.glyLow.id, genClientProductId: SEM_GEN.glyLow.full },
  '0.75 mg': { ...SEM_B12['0.75 mg'], websiteVariantId: 'sem-glycine-mid', mbmSku: 'MBM-WM-SEM-GLY-002', formularyExcelRow: 6, genProductId: SEM_GEN.glyMid.id, genClientProductId: SEM_GEN.glyMid.full },
  '1 mg': { ...SEM_B12['1 mg'], websiteVariantId: 'sem-glycine-mid', mbmSku: 'MBM-WM-SEM-GLY-002', formularyExcelRow: 6, genProductId: SEM_GEN.glyMid.id, genClientProductId: SEM_GEN.glyMid.full },
  '1.25 mg': { ...SEM_B12['1.25 mg'], websiteVariantId: 'sem-glycine-high', mbmSku: 'MBM-WM-SEM-GLY-003', formularyExcelRow: 8, genProductId: SEM_GEN.glyHigh.id, genClientProductId: SEM_GEN.glyHigh.full },
  '1.5 mg': { ...SEM_B12['1.5 mg'], websiteVariantId: 'sem-glycine-high', mbmSku: 'MBM-WM-SEM-GLY-003', formularyExcelRow: 8, genProductId: SEM_GEN.glyHigh.id, genClientProductId: SEM_GEN.glyHigh.full },
  '1.75 mg': { ...SEM_B12['1.75 mg'], websiteVariantId: 'sem-glycine-10mg', mbmSku: 'MBM-WM-SEM-GLY-006', formularyExcelRow: 10, genProductId: SEM_GEN.glyHigh.id, genClientProductId: SEM_GEN.glyHigh.full },
  '2 mg': { ...SEM_B12['2 mg'], websiteVariantId: 'sem-glycine-10mg', mbmSku: 'MBM-WM-SEM-GLY-006', formularyExcelRow: 10, genProductId: SEM_GEN.glyHigh.id, genClientProductId: SEM_GEN.glyHigh.full },
};

const TIR_B12: Record<string, VialSpec> = {
  '2.5 mg': {
    monthlyRequirementMg: 10,
    vialTotalMg: 10,
    fulfillmentVialLabel: '10 mg vial',
    websiteVariantId: 'tir-b12-starting-low',
    mbmSku: 'MBM-WM-TIR-B12-001',
    retailPriceCents: 13900,
    backendGroup: 'Starting / Low',
    formularyExcelRow: 14,
    genProductId: TIR_GEN.id,
    genClientProductId: TIR_GEN.full,
  },
  '5 mg': {
    monthlyRequirementMg: 20,
    vialTotalMg: 20,
    fulfillmentVialLabel: '20 mg vial',
    websiteVariantId: 'tir-b12-10mg-ml',
    mbmSku: 'MBM-WM-TIR-B12-005',
    retailPriceCents: 15900,
    backendGroup: 'Starting / Low',
    formularyExcelRow: 16,
    genProductId: TIR_GEN.id,
    genClientProductId: TIR_GEN.full,
  },
  '7.5 mg': {
    monthlyRequirementMg: 30,
    vialTotalMg: 30,
    fulfillmentVialLabel: '30 mg vial',
    websiteVariantId: 'tir-b12-mid',
    mbmSku: 'MBM-WM-TIR-B12-002',
    retailPriceCents: 17900,
    backendGroup: 'Mid',
    formularyExcelRow: 18,
    genProductId: TIR_GEN.id,
    genClientProductId: TIR_GEN.full,
  },
  '10 mg': {
    monthlyRequirementMg: 40,
    vialTotalMg: 40,
    fulfillmentVialLabel: '40 mg vial',
    websiteVariantId: 'tir-b12-20mg-ml',
    mbmSku: 'MBM-WM-TIR-B12-006',
    retailPriceCents: 18900,
    backendGroup: 'Mid',
    formularyExcelRow: 20,
    genProductId: TIR_GEN.id,
    genClientProductId: TIR_GEN.full,
  },
  '12.5 mg': {
    monthlyRequirementMg: 50,
    vialTotalMg: 50,
    fulfillmentVialLabel: '50 mg vial',
    websiteVariantId: 'tir-b12-high',
    mbmSku: 'MBM-WM-TIR-B12-003',
    retailPriceCents: 19900,
    backendGroup: 'High',
    formularyExcelRow: 22,
    genProductId: TIR_GEN.id,
    genClientProductId: TIR_GEN.full,
  },
  '15 mg': {
    monthlyRequirementMg: 60,
    vialTotalMg: 60,
    fulfillmentVialLabel: '60 mg vial',
    websiteVariantId: 'tir-b12-30mg-ml',
    mbmSku: 'MBM-WM-TIR-B12-007',
    retailPriceCents: 20900,
    backendGroup: 'High',
    formularyExcelRow: 24,
    genProductId: TIR_GEN.id,
    genClientProductId: TIR_GEN.full,
  },
};

const TIR_GLY: Record<string, VialSpec> = {
  '2.5 mg': { ...TIR_B12['2.5 mg'], websiteVariantId: 'tir-glycine-starting-low', mbmSku: 'MBM-WM-TIR-GLY-001', formularyExcelRow: 13 },
  '5 mg': { ...TIR_B12['5 mg'], websiteVariantId: 'tir-glycine-10mg-ml', mbmSku: 'MBM-WM-TIR-GLY-005', formularyExcelRow: 15 },
  '7.5 mg': { ...TIR_B12['7.5 mg'], websiteVariantId: 'tir-glycine-mid', mbmSku: 'MBM-WM-TIR-GLY-002', formularyExcelRow: 17 },
  '10 mg': { ...TIR_B12['10 mg'], websiteVariantId: 'tir-glycine-20mg-ml', mbmSku: 'MBM-WM-TIR-GLY-006', formularyExcelRow: 19 },
  '12.5 mg': { ...TIR_B12['12.5 mg'], websiteVariantId: 'tir-glycine-high', mbmSku: 'MBM-WM-TIR-GLY-003', formularyExcelRow: 21 },
  '15 mg': { ...TIR_B12['15 mg'], websiteVariantId: 'tir-glycine-30mg-ml', mbmSku: 'MBM-WM-TIR-GLY-007', formularyExcelRow: 23 },
};

function tableFor(familyId: Glp1FamilyId, formulation: Glp1Formulation): Record<string, VialSpec> {
  if (familyId === 'semaglutide') return formulation === 'Vitamin B12' ? SEM_B12 : SEM_GLY;
  return formulation === 'Vitamin B12' ? TIR_B12 : TIR_GLY;
}

export const ONE_TIME_GETTING_STARTED_BLOCKER =
  'Choose a current weekly dose for a one-time purchase, or join membership if you are not sure. Getting Started / Not Sure does not assign a one-time vial — a licensed provider reviews first.';

export function resolveOneTimeVial(input: {
  familyId: Glp1FamilyId;
  formulation: string;
  requestedDose: string | null | undefined;
}): { ok: true; mapping: OneTimeVialMapping } | { ok: false; error: string } {
  const formulation = validateGlp1Formulation(input.formulation);
  if (!formulation.ok) return formulation;
  const dose = validateRequestedDose({
    requestedDose: input.requestedDose,
    familyId: input.familyId,
  });
  if (!dose.ok) return dose;
  if (dose.value === GETTING_STARTED_DOSE) {
    return { ok: false, error: ONE_TIME_GETTING_STARTED_BLOCKER };
  }
  const spec = tableFor(input.familyId, formulation.value)[dose.value];
  if (!spec) {
    return { ok: false, error: `No one-time fulfillment vial is mapped for ${dose.value}.` };
  }
  return {
    ok: true,
    mapping: {
      familyId: input.familyId,
      formulation: formulation.value,
      requestedDose: dose.value,
      ...spec,
      mbmProductId: input.familyId === 'semaglutide' ? 'p1' : 'p5',
    },
  };
}

export function isGettingStartedDose(raw: string | null | undefined): boolean {
  return normalizeRequestedDose(raw) === GETTING_STARTED_DOSE;
}

/** New vial-specific SKUs. 10/10 live-mapped 2026-08-26 via Tagada GET. */
export const NEW_ONE_TIME_VIAL_SKUS = [
  'MBM-WM-SEM-B12-005',
  'MBM-WM-SEM-B12-006',
  'MBM-WM-SEM-GLY-005',
  'MBM-WM-SEM-GLY-006',
  'MBM-WM-TIR-B12-005',
  'MBM-WM-TIR-B12-006',
  'MBM-WM-TIR-B12-007',
  'MBM-WM-TIR-GLY-005',
  'MBM-WM-TIR-GLY-006',
  'MBM-WM-TIR-GLY-007',
] as const;

export function listOneTimeVialMappings(): OneTimeVialMapping[] {
  const out: OneTimeVialMapping[] = [];
  for (const familyId of ['semaglutide', 'tirzepatide'] as const) {
    for (const formulation of ['Vitamin B12', 'Glycine'] as const) {
      const table = tableFor(familyId, formulation);
      for (const requestedDose of Object.keys(table)) {
        const resolved = resolveOneTimeVial({ familyId, formulation, requestedDose });
        if (resolved.ok) out.push(resolved.mapping);
      }
    }
  }
  return out;
}

/** Patient cart/PDP label — formulation + weekly dose only. No vial math, no group names. */
export function patientSafeOneTimeCartLabel(input: {
  formulation: string;
  requestedDose: string;
}): string {
  return formatProviderReviewSnapshot({
    formulation: input.formulation,
    requestedDose: input.requestedDose,
  });
}

/** Provider/order snapshot. Distinct labeled fields — do not overload requestedFormulation. */
export function formatOneTimeProviderSnapshot(
  mapping: OneTimeVialMapping,
  tagadaPriceId?: string | null,
): string {
  const parts = [
    `medication: ${mapping.familyId}`,
    'purchaseType: one_time',
    `formulation: ${mapping.formulation}`,
    `requestedWeeklyDose: ${mapping.requestedDose}`,
    `monthlyRequirementMg: ${mapping.monthlyRequirementMg}`,
    `fulfillmentVial: ${mapping.fulfillmentVialLabel}`,
    `websiteVariantId: ${mapping.websiteVariantId}`,
    `mbmSku: ${mapping.mbmSku}`,
  ];
  if (tagadaPriceId) parts.push(`tagadaPriceId: ${tagadaPriceId}`);
  return parts.join(' · ');
}

export function isGlp1OneTimePurchase(item: {
  purchaseType?: string | null;
  isMembership?: boolean;
  subscription?: boolean;
  productId?: string | null;
}): boolean {
  if (item.isMembership) return false;
  if (item.purchaseType === 'membership_program') return false;
  if (item.productId === 'm1' || item.productId === 'm2') return false;
  return true;
}

/**
 * Authorize one-time SEM/TIR lines against the locked vial map.
 * Getting Started does not assign a vial — caller must block checkout.
 */
export function authorizeGlp1OneTimeOrderLine(item: {
  productId?: string | null;
  slug?: string | null;
  sku?: string | null;
  purchaseType?: string | null;
  isMembership?: boolean;
  subscription?: boolean;
  requestedFormulation?: string | null;
  requestedDose?: string | null;
  unitAmountCents?: number | null;
  variantId?: string | null;
}):
  | { ok: true; skipped: true }
  | { ok: true; skipped: false; mapping: OneTimeVialMapping }
  | { ok: false; error: string } {
  if (!isGlp1OneTimePurchase(item)) return { ok: true, skipped: true };
  const familyId =
    glp1FamilyIdFromSlug(item.slug) ||
    glp1FamilyIdFromSku(item.sku) ||
    glp1FamilyIdFromProductId(item.productId);
  if (!familyId) return { ok: true, skipped: true };

  const vial = resolveOneTimeVial({
    familyId,
    formulation: item.requestedFormulation || '',
    requestedDose: item.requestedDose,
  });
  if (!vial.ok) return vial;

  if (
    typeof item.unitAmountCents === 'number' &&
    Number.isFinite(item.unitAmountCents) &&
    Math.round(item.unitAmountCents) !== vial.mapping.retailPriceCents
  ) {
    return {
      ok: false,
      error: `One-time ${familyId} price does not match the approved vial-specific retail.`,
    };
  }
  if (item.sku && item.sku.trim() && item.sku.trim().toUpperCase() !== vial.mapping.mbmSku) {
    return { ok: false, error: 'One-time SKU does not match the approved fulfillment vial.' };
  }
  if (item.variantId && item.variantId.trim() && item.variantId.trim() !== vial.mapping.websiteVariantId) {
    return { ok: false, error: 'One-time variant does not match the approved fulfillment vial.' };
  }
  return { ok: true, skipped: false, mapping: vial.mapping };
}
