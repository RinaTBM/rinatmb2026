/**
 * Formulation match rules for GEN catalog mapping (Phase 12G).
 * Never invent GEN IDs; never silently substitute additives/forms.
 */

export type GenMatchType =
  | 'EXACT'
  | 'VERIFIED_REPLACEMENT'
  | 'NO_MATCH'
  | 'AMBIGUOUS'
  | 'DEPRECATED';

export type FormulationParts = {
  actives: string[];
  additives: string[];
  form: string;
  strength?: string | null;
  package?: string | null;
};

const ADDITIVE_TOKENS = ['B6', 'B12', 'GLYCINE', 'VITAMIN B6', 'VITAMIN B12'] as const;

export function normalizeFormulationText(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9+/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractAdditives(formulation: string): string[] {
  const n = normalizeFormulationText(formulation);
  const found: string[] = [];
  for (const a of ADDITIVE_TOKENS) {
    if (n.includes(a)) found.push(a.replace('VITAMIN ', ''));
  }
  return [...new Set(found)];
}

export function formsCompatible(a: string, b: string): boolean {
  const na = normalizeFormulationText(a);
  const nb = normalizeFormulationText(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const injection = ['INJECTION', 'INJECTABLE', 'INJ'];
  const nasal = ['NASAL', 'NASAL SPRAY', 'NS'];
  const cream = ['CREAM'];
  const gel = ['GEL'];
  const patch = ['PATCH'];
  const capsule = ['CAPSULE', 'CAP', 'ORAL'];
  const groups = [injection, nasal, cream, gel, patch, capsule];
  for (const g of groups) {
    if (g.some((t) => na.includes(t)) && g.some((t) => nb.includes(t))) return true;
  }
  return false;
}

/**
 * Strict additive rule: B6 → B12 / glycine / plain is NOT an exact match.
 */
export function additiveChangeRequiresNewSku(input: {
  mbmFormulation: string;
  genFormulation: string;
}): boolean {
  const mbm = extractAdditives(input.mbmFormulation);
  const gen = extractAdditives(input.genFormulation);
  const mbmHasB6 = mbm.includes('B6');
  const genHasB6 = gen.includes('B6');
  const genHasB12 = gen.includes('B12');
  const genHasGlycine = gen.includes('GLYCINE');
  if (mbmHasB6 && (genHasB12 || genHasGlycine)) return true;
  if (mbmHasB6 && !genHasB6 && !genHasB12 && !genHasGlycine) {
    // plain base vs +B6
    return true;
  }
  return false;
}

export function formChangeRequiresNewSku(input: {
  mbmForm: string;
  genForm: string;
}): boolean {
  return !formsCompatible(input.mbmForm, input.genForm);
}

/**
 * Classify a candidate GEN product against an MBM SKU formulation.
 * Does not invent IDs — caller supplies candidate fields.
 */
export function classifyGenMatch(input: {
  mbmFormulation: string;
  mbmForm: string;
  mbmStrength?: string | null;
  mbmPackage?: string | null;
  genFormulation?: string | null;
  genForm?: string | null;
  genStrength?: string | null;
  genPackage?: string | null;
  genClientProductId?: string | null;
  ownerVerified?: boolean;
}): {
  matchType: GenMatchType;
  requiresNewSku: boolean;
  reason: string;
} {
  if (!input.genClientProductId?.trim()) {
    return {
      matchType: 'NO_MATCH',
      requiresNewSku: false,
      reason: 'No GEN clientProductId supplied — do not invent IDs.',
    };
  }
  if (!input.genFormulation && !input.genForm) {
    return {
      matchType: 'AMBIGUOUS',
      requiresNewSku: false,
      reason: 'GEN product id present but formulation/form incomplete.',
    };
  }
  if (input.genForm && formChangeRequiresNewSku({ mbmForm: input.mbmForm, genForm: input.genForm })) {
    return {
      matchType: 'NO_MATCH',
      requiresNewSku: true,
      reason: `Form substitution blocked (${input.mbmForm} → ${input.genForm}). New SKU required.`,
    };
  }
  if (
    input.genFormulation &&
    additiveChangeRequiresNewSku({
      mbmFormulation: input.mbmFormulation,
      genFormulation: input.genFormulation,
    })
  ) {
    return {
      matchType: 'NO_MATCH',
      requiresNewSku: true,
      reason: 'Additive change (e.g. B6→B12/glycine/plain) requires NEW MBM SKU.',
    };
  }
  if (input.ownerVerified) {
    return {
      matchType: 'EXACT',
      requiresNewSku: false,
      reason: 'Owner-verified GEN mapping.',
    };
  }
  // Strength/package must agree when both known
  if (
    input.mbmStrength &&
    input.genStrength &&
    normalizeFormulationText(input.mbmStrength) !== normalizeFormulationText(input.genStrength)
  ) {
    return {
      matchType: 'AMBIGUOUS',
      requiresNewSku: true,
      reason: 'Strength mismatch — do not silently map; propose new SKU if owner wants replacement.',
    };
  }
  if (
    input.mbmPackage &&
    input.genPackage &&
    normalizeFormulationText(input.mbmPackage) !== normalizeFormulationText(input.genPackage)
  ) {
    return {
      matchType: 'AMBIGUOUS',
      requiresNewSku: true,
      reason: 'Package mismatch — requires owner verification / new SKU.',
    };
  }
  if (input.genFormulation && input.genForm) {
    return {
      matchType: 'EXACT',
      requiresNewSku: false,
      reason: 'Formulation/form compatible pending owner activation.',
    };
  }
  return {
    matchType: 'AMBIGUOUS',
    requiresNewSku: false,
    reason: 'Insufficient fields for EXACT classification.',
  };
}

/** Propose next SEM/TIR injection SKU numbers without activating storefront. */
export function proposeNextInjectionSku(input: {
  family: 'SEM' | 'TIR';
  existingSkus: string[];
}): string {
  const prefix = input.family === 'SEM' ? 'MBM-WM-SEM-INJ-' : 'MBM-WM-TIR-INJ-';
  let max = 0;
  for (const s of input.existingSkus) {
    const m = s.toUpperCase().match(new RegExp(`^${prefix}(\\d+)$`));
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

export function markupFromCostCents(costCents: number, multiplier: number): number {
  return Math.round(costCents * multiplier);
}

export function costAnalysisRow(input: {
  currentRetailCents: number;
  medicationCostCents: number | null;
  shippingCostCents: number | null;
}): {
  medicationCostCents: number | null;
  shippingCostCents: number | null;
  totalCostCents: number | null;
  plus50Med: number | null;
  plus75Med: number | null;
  plus100Med: number | null;
  plus50Landed: number | null;
  plus75Landed: number | null;
  plus100Landed: number | null;
  currentGrossOverMed: number | null;
  currentGrossOverLanded: number | null;
} {
  const med = input.medicationCostCents;
  const ship = input.shippingCostCents;
  const landed =
    med != null && ship != null ? med + ship : med != null && ship == null ? null : null;
  const plus = (c: number | null, m: number) => (c == null ? null : markupFromCostCents(c, m));
  return {
    medicationCostCents: med,
    shippingCostCents: ship,
    totalCostCents: landed,
    plus50Med: plus(med, 1.5),
    plus75Med: plus(med, 1.75),
    plus100Med: plus(med, 2),
    plus50Landed: plus(landed, 1.5),
    plus75Landed: plus(landed, 1.75),
    plus100Landed: plus(landed, 2),
    currentGrossOverMed: med == null ? null : input.currentRetailCents - med,
    currentGrossOverLanded: landed == null ? null : input.currentRetailCents - landed,
  };
}
