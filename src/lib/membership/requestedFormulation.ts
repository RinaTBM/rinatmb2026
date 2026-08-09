/**
 * Membership requested-dose helpers.
 * Selection is a REQUEST only — never a guaranteed prescription/dose.
 */

export const GETTING_STARTED_FORMULATION = 'getting_started';
export const GETTING_STARTED_LABEL = 'Getting Started / Not Sure';

export const REQUESTED_DOSE_FIELD_LABEL = 'Requested dose';
export const REQUESTED_DOSE_HINT =
  'Select the dose you are currently using or would like the provider to review.';
export const REQUESTED_DOSE_DISCLAIMER =
  'Your selection is a request only. Final treatment, dose, and prescription are determined by the licensed provider after review.';

export interface RequestedFormulationOption {
  value: string;
  label: string;
}

/** Options = Getting Started / Not Sure + catalog included_formulations. */
export function requestedFormulationOptions(
  includedFormulations: readonly string[] | null | undefined,
): RequestedFormulationOption[] {
  const included = (includedFormulations ?? []).filter(Boolean);
  return [
    { value: GETTING_STARTED_FORMULATION, label: GETTING_STARTED_LABEL },
    ...included.map(f => ({ value: f, label: f })),
  ];
}

export function normalizeRequestedFormulation(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase().replace(/[\s/-]+/g, '_');
  if (
    lower === GETTING_STARTED_FORMULATION ||
    lower === 'getting_started_not_sure' ||
    trimmed === GETTING_STARTED_LABEL
  ) {
    return GETTING_STARTED_FORMULATION;
  }
  return trimmed;
}

export function isAllowedRequestedFormulation(
  value: string | null | undefined,
  includedFormulations: readonly string[] | null | undefined,
): boolean {
  const normalized = normalizeRequestedFormulation(value);
  if (!normalized) return false;
  if (normalized === GETTING_STARTED_FORMULATION) return true;
  return (includedFormulations ?? []).includes(normalized);
}

export function labelRequestedFormulation(value: string | null | undefined): string {
  const normalized = normalizeRequestedFormulation(value);
  if (!normalized) return '';
  if (normalized === GETTING_STARTED_FORMULATION) return GETTING_STARTED_LABEL;
  return normalized;
}

export function validateMembershipRequestedFormulation(input: {
  requestedFormulation: string | null | undefined;
  includedFormulations: readonly string[] | null | undefined;
}): { ok: true; value: string } | { ok: false; error: string } {
  const normalized = normalizeRequestedFormulation(input.requestedFormulation);
  if (!normalized) {
    return {
      ok: false,
      error: 'Please select a requested dose before continuing with membership checkout.',
    };
  }
  if (!isAllowedRequestedFormulation(normalized, input.includedFormulations)) {
    return {
      ok: false,
      error: `Unsupported requested formulation: ${input.requestedFormulation}`,
    };
  }
  return { ok: true, value: normalized };
}
