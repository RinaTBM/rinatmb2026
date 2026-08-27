/**
 * Patient-facing GLP-1 current/weekly dose — provider-review metadata only.
 *
 * Does NOT select pharmacy vial strength, MBM SKU, Tagada price, or GEN CP.
 * Membership pricing stays flat by program ($125 SEM / $179 TIR).
 */

export const GETTING_STARTED_DOSE = 'getting_started';
export const GETTING_STARTED_DOSE_LABEL = 'Getting Started / Not Sure';

export const PATIENT_DOSE_FIELD_LABEL = 'Current dose / where are you starting?';

export const PATIENT_DOSE_HINT =
  'Not sure which dose to select? Choose Getting Started / Not Sure. Your licensed provider will review your history and determine the appropriate dose, formulation, and prescription.';

export const PATIENT_DOSE_DISCLAIMER =
  'Your licensed provider makes the final prescribing decision after review.';

export const GLP1_FORMULATION_OPTIONS = ['Vitamin B12', 'Glycine'] as const;
export type Glp1Formulation = (typeof GLP1_FORMULATION_OPTIONS)[number];

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

export type SemPatientWeeklyDose = (typeof SEM_PATIENT_WEEKLY_DOSES)[number];
export type TirPatientWeeklyDose = (typeof TIR_PATIENT_WEEKLY_DOSES)[number];

export type Glp1FamilyId = 'semaglutide' | 'tirzepatide';

export interface PatientDoseOption {
  value: string;
  label: string;
}

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

export const ONE_TIME_WEEKLY_DOSE_REQUIRED =
  'Please select a weekly dose for a one-time purchase.';

export function patientWeeklyDosesForFamily(
  familyId: Glp1FamilyId,
): readonly string[] {
  return familyId === 'semaglutide' ? SEM_PATIENT_WEEKLY_DOSES : TIR_PATIENT_WEEKLY_DOSES;
}

export function patientDoseOptions(
  familyId: Glp1FamilyId,
  input?: { allowGettingStarted?: boolean },
): PatientDoseOption[] {
  const weekly = patientWeeklyDosesForFamily(familyId).map(d => ({ value: d, label: d }));
  if (input?.allowGettingStarted === false) return weekly;
  return [
    { value: GETTING_STARTED_DOSE, label: GETTING_STARTED_DOSE_LABEL },
    ...weekly,
  ];
}

/** Getting Started / Not Sure is membership-only. One-time must pick a weekly dose. */
export function allowGettingStartedForPurchaseType(
  purchaseType: 'one_time' | 'membership' | string | null | undefined,
): boolean {
  return purchaseType === 'membership' || purchaseType === 'membership_program';
}

/**
 * Switching Membership → One-Time must not keep Getting Started / Not Sure.
 * Do not map it onto a weekly dose.
 */
export function doseSelectionAfterPurchaseTypeChange(input: {
  nextPurchaseType: 'one_time' | 'membership';
  requestedDose: string;
}): string {
  if (input.nextPurchaseType !== 'one_time') return input.requestedDose;
  if (normalizeRequestedDose(input.requestedDose) === GETTING_STARTED_DOSE) return '';
  return input.requestedDose;
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
  if (matchMg) {
    const n = matchMg[1];
    return `${n} mg`;
  }
  return trimmed;
}

export function isAllowedRequestedDose(
  value: string | null | undefined,
  familyId: Glp1FamilyId,
  input?: { allowGettingStarted?: boolean },
): boolean {
  const normalized = normalizeRequestedDose(value);
  if (!normalized) return false;
  if (normalized === GETTING_STARTED_DOSE) {
    return input?.allowGettingStarted !== false;
  }
  return (patientWeeklyDosesForFamily(familyId) as readonly string[]).includes(normalized);
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
  allowGettingStarted?: boolean;
}): { ok: true; value: string } | { ok: false; error: string } {
  const allowGettingStarted = input.allowGettingStarted !== false;
  const normalized = normalizeRequestedDose(input.requestedDose);
  if (!normalized) {
    return {
      ok: false,
      error: allowGettingStarted
        ? 'Please select your current dose or Getting Started / Not Sure.'
        : ONE_TIME_WEEKLY_DOSE_REQUIRED,
    };
  }
  if (normalized === GETTING_STARTED_DOSE && !allowGettingStarted) {
    return { ok: false, error: ONE_TIME_WEEKLY_DOSE_REQUIRED };
  }
  if (!isAllowedRequestedDose(normalized, input.familyId, { allowGettingStarted })) {
    return {
      ok: false,
      error: `Unsupported current dose: ${input.requestedDose}`,
    };
  }
  return { ok: true, value: normalized };
}

export function isAllowedGlp1Formulation(value: string | null | undefined): boolean {
  const v = (value || '').trim();
  return v === 'Vitamin B12' || v === 'Glycine';
}

export function validateGlp1Formulation(
  value: string | null | undefined,
): { ok: true; value: Glp1Formulation } | { ok: false; error: string } {
  const v = (value || '').trim();
  if (v === 'Vitamin B12' || v === 'Glycine') return { ok: true, value: v };
  return { ok: false, error: 'Please select a formulation (Vitamin B12 or Glycine).' };
}

/** Snapshot text for cart / order_items.variant_snapshot — never used as a SKU key. */
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
