/**
 * Patient-facing GLP-1 current/weekly dose — provider-review metadata only.
 * Mirrored from src/lib/glp1/patientRequestedDose.ts for Deno Edge.
 * Does NOT select pharmacy vial / SKU / Tagada / GEN.
 */

export const GETTING_STARTED_DOSE = 'getting_started';
export const GETTING_STARTED_DOSE_LABEL = 'Getting Started / Not Sure';

export const SEM_PATIENT_WEEKLY_DOSES = [
  '0.25 mg',
  '0.5 mg',
  '0.75 mg',
  '1 mg',
  '1.25 mg',
  '1.5 mg',
  '1.75 mg',
  '2 mg',
] as const;

export const TIR_PATIENT_WEEKLY_DOSES = [
  '2.5 mg',
  '5 mg',
  '7.5 mg',
  '10 mg',
  '12.5 mg',
  '15 mg',
] as const;

export type Glp1FamilyId = 'semaglutide' | 'tirzepatide';
export const GLP1_FORMULATION_OPTIONS = ['Vitamin B12', 'Glycine'] as const;
export type Glp1Formulation = (typeof GLP1_FORMULATION_OPTIONS)[number];

export function glp1FamilyIdFromSlug(slug: string | null | undefined): Glp1FamilyId | null {
  const s = (slug || '').trim().toLowerCase();
  if (s === 'semaglutide' || s === 'semaglutide-membership') return 'semaglutide';
  if (s === 'tirzepatide' || s === 'tirzepatide-membership') return 'tirzepatide';
  return null;
}

export function glp1FamilyIdFromSku(sku: string | null | undefined): Glp1FamilyId | null {
  const s = (sku || '').trim().toUpperCase();
  if (s.startsWith('MBM-WM-SEM-') || s === 'MBM-MEM-SEM-MEM-001') return 'semaglutide';
  if (s.startsWith('MBM-WM-TIR-') || s === 'MBM-MEM-TIR-MEM-001') return 'tirzepatide';
  return null;
}

export function glp1FamilyIdFromProductId(productId: string | null | undefined): Glp1FamilyId | null {
  const id = (productId || '').trim();
  if (id === 'm1' || id === 'p1') return 'semaglutide';
  if (id === 'm2' || id === 'p5') return 'tirzepatide';
  return null;
}

function weeklyDoses(familyId: Glp1FamilyId): readonly string[] {
  return familyId === 'semaglutide' ? SEM_PATIENT_WEEKLY_DOSES : TIR_PATIENT_WEEKLY_DOSES;
}

export function normalizeRequestedDose(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase().replace(/[\s/-]+/g, '_');
  if (
    lower === GETTING_STARTED_DOSE ||
    lower === 'getting_started_not_sure' ||
    trimmed === GETTING_STARTED_DOSE_LABEL
  ) {
    return GETTING_STARTED_DOSE;
  }
  const compact = trimmed.toLowerCase().replace(/\s+/g, '');
  const matchMg = compact.match(/^(\d+(?:\.\d+)?)m?g$/);
  if (matchMg) return `${matchMg[1]} mg`;
  return trimmed;
}

export function isAllowedRequestedDose(
  value: string | null | undefined,
  familyId: Glp1FamilyId,
): boolean {
  const normalized = normalizeRequestedDose(value);
  if (!normalized) return false;
  if (normalized === GETTING_STARTED_DOSE) return true;
  return weeklyDoses(familyId).includes(normalized);
}

export function labelRequestedDose(value: string | null | undefined): string {
  const normalized = normalizeRequestedDose(value);
  if (!normalized) return '';
  if (normalized === GETTING_STARTED_DOSE) return GETTING_STARTED_DOSE_LABEL;
  return normalized;
}

export function validateRequestedDose(input: {
  requestedDose: string | null | undefined;
  familyId: Glp1FamilyId;
}): { ok: true; value: string } | { ok: false; error: string } {
  const normalized = normalizeRequestedDose(input.requestedDose);
  if (!normalized) {
    return {
      ok: false,
      error: 'Please select your current dose or Getting Started / Not Sure.',
    };
  }
  if (!isAllowedRequestedDose(normalized, input.familyId)) {
    return { ok: false, error: `Unsupported current dose: ${input.requestedDose}` };
  }
  return { ok: true, value: normalized };
}

export function validateGlp1Formulation(
  value: string | null | undefined,
): { ok: true; value: Glp1Formulation } | { ok: false; error: string } {
  const v = (value || '').trim();
  if (v === 'Vitamin B12' || v === 'Glycine') return { ok: true, value: v };
  return { ok: false, error: 'Please select a formulation (Vitamin B12 or Glycine).' };
}

export function formatProviderReviewSnapshot(input: {
  fulfillmentLabel?: string | null;
  formulation?: string | null;
  requestedDose?: string | null;
}): string {
  const parts: string[] = [];
  const fulfillment = (input.fulfillmentLabel || '').trim();
  if (fulfillment) parts.push(fulfillment);
  const formulation = (input.formulation || '').trim();
  if (formulation && !fulfillment.toLowerCase().includes(formulation.toLowerCase())) {
    parts.push(`Formulation: ${formulation}`);
  }
  const doseLabel = labelRequestedDose(input.requestedDose);
  if (doseLabel && !fulfillment.toLowerCase().includes('current dose:')) {
    parts.push(`Current dose: ${doseLabel}`);
  }
  return parts.join(' · ');
}
