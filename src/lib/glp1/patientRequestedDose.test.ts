import { describe, expect, it } from 'vitest';
import { getMembership } from '@/data/products';
import { lockedRetailPrice, resolveFamilyVariant, skuForFamilyVariantId } from '@/data/websiteFamilies';
import { LAUNCH_READY_KASHU_MAP } from '@/lib/payments/launchReadyKashuMap';
import {
  GETTING_STARTED_DOSE,
  GETTING_STARTED_DOSE_LABEL,
  SEM_PATIENT_WEEKLY_DOSES,
  TIR_PATIENT_WEEKLY_DOSES,
  formatProviderReviewSnapshot,
  isAllowedRequestedDose,
  labelRequestedDose,
  patientDoseOptions,
  validateGlp1Formulation,
  validateRequestedDose,
} from './patientRequestedDose';
import {
  NEW_ONE_TIME_VIAL_SKUS,
  ONE_TIME_GETTING_STARTED_BLOCKER,
  authorizeGlp1OneTimeOrderLine,
  listOneTimeVialMappings,
  patientSafeOneTimeCartLabel,
  resolveOneTimeVial,
} from './oneTimeVialMapping';

const SEM_PRICES: Record<string, number> = {
  '0.25 mg': 109,
  '0.5 mg': 119,
  '0.75 mg': 119,
  '1 mg': 119,
  '1.25 mg': 129,
  '1.5 mg': 129,
  '1.75 mg': 139,
  '2 mg': 139,
};

const TIR_PRICES: Record<string, number> = {
  '2.5 mg': 139,
  '5 mg': 159,
  '7.5 mg': 179,
  '10 mg': 189,
  '12.5 mg': 199,
  '15 mg': 209,
};

describe('GLP-1 patient weekly dose (provider-review metadata)', () => {
  it('SEM shows Getting Started plus 0.25–2 mg and never B6 / Pyridoxine / Any Dose', () => {
    const opts = patientDoseOptions('semaglutide');
    expect(opts.map(o => o.label)).toEqual([
      GETTING_STARTED_DOSE_LABEL,
      ...SEM_PATIENT_WEEKLY_DOSES,
    ]);
    const blob = opts.map(o => o.label).join(' ');
    expect(blob).not.toMatch(/B6|Pyridoxine|Any Dose|Starting \/ Low|Mid|High/i);
  });

  it('TIR shows Getting Started plus 2.5–15 mg and never grouping labels', () => {
    const opts = patientDoseOptions('tirzepatide');
    expect(opts.map(o => o.label)).toEqual([
      GETTING_STARTED_DOSE_LABEL,
      ...TIR_PATIENT_WEEKLY_DOSES,
    ]);
    const blob = opts.map(o => o.label).join(' ');
    expect(blob).not.toMatch(/B6|Pyridoxine|5\+10|15\+20|25\+30|Any Dose/i);
  });

  it('stores Getting Started as getting_started intent, not a vial strength', () => {
    const v = validateRequestedDose({
      requestedDose: GETTING_STARTED_DOSE_LABEL,
      familyId: 'semaglutide',
    });
    expect(v).toEqual({ ok: true, value: GETTING_STARTED_DOSE });
    expect(labelRequestedDose(GETTING_STARTED_DOSE)).toBe(GETTING_STARTED_DOSE_LABEL);
  });

  it('rejects TIR 30 mg and SEM grouping names as weekly doses', () => {
    expect(isAllowedRequestedDose('30 mg', 'tirzepatide')).toBe(false);
    expect(isAllowedRequestedDose('Starting / Low', 'semaglutide')).toBe(false);
    expect(isAllowedRequestedDose('Any Dose', 'semaglutide')).toBe(false);
  });

  it('formulation remains B12 or Glycine only', () => {
    expect(validateGlp1Formulation('Vitamin B12').ok).toBe(true);
    expect(validateGlp1Formulation('Glycine').ok).toBe(true);
    expect(validateGlp1Formulation('Vitamin B6').ok).toBe(false);
    expect(validateGlp1Formulation(GETTING_STARTED_DOSE).ok).toBe(false);
  });

  it('SEM membership stays $125 and TIR $179 for every patient dose', () => {
    const sem = getMembership('semaglutide-membership')!;
    const tir = getMembership('tirzepatide-membership')!;
    expect(sem.monthlyPrice).toBe(125);
    expect(tir.monthlyPrice).toBe(179);
    for (const dose of [GETTING_STARTED_DOSE, ...SEM_PATIENT_WEEKLY_DOSES]) {
      expect(sem.monthlyPrice).toBe(125);
      expect(isAllowedRequestedDose(dose, 'semaglutide')).toBe(true);
    }
    for (const dose of [GETTING_STARTED_DOSE, ...TIR_PATIENT_WEEKLY_DOSES]) {
      expect(tir.monthlyPrice).toBe(179);
      expect(isAllowedRequestedDose(dose, 'tirzepatide')).toBe(true);
    }
  });

  it('snapshot keeps formulation and current dose separate from fulfillment label', () => {
    expect(
      formatProviderReviewSnapshot({
        fulfillmentLabel: 'Starting / Low · Vitamin B12',
        formulation: 'Vitamin B12',
        requestedDose: '0.25 mg',
      }),
    ).toBe('Starting / Low · Vitamin B12 · Current dose: 0.25 mg');
    expect(
      formatProviderReviewSnapshot({
        formulation: 'Glycine',
        requestedDose: GETTING_STARTED_DOSE,
      }),
    ).toBe(`Formulation: Glycine · Current dose: ${GETTING_STARTED_DOSE_LABEL}`);
  });
});

describe('owner-approved one-time vial mapping', () => {
  it('maps every SEM weekly dose × B12/Glycine to vial-specific retail', () => {
    for (const formulation of ['Vitamin B12', 'Glycine'] as const) {
      for (const dose of SEM_PATIENT_WEEKLY_DOSES) {
        const resolved = resolveOneTimeVial({
          familyId: 'semaglutide',
          formulation,
          requestedDose: dose,
        });
        expect(resolved.ok).toBe(true);
        if (!resolved.ok) continue;
        expect(resolved.mapping.retailPriceCents).toBe(SEM_PRICES[dose] * 100);
        const route = resolveFamilyVariant('semaglutide', {
          purchaseType: 'one_time',
          additive: formulation,
          requestedDose: dose,
        });
        expect(route.ok).toBe(true);
        expect(route.variant?.websiteVariantId).toBe(resolved.mapping.websiteVariantId);
        expect(lockedRetailPrice(route.variant!)).toBe(SEM_PRICES[dose]);
        expect(skuForFamilyVariantId(route.variant!.websiteVariantId)).toBe(resolved.mapping.mbmSku);
        expect(patientSafeOneTimeCartLabel({ formulation, requestedDose: dose })).not.toMatch(
          /Starting \/ Low|Mid|High|Any Dose|mg\/mL/i,
        );
      }
    }
  });

  it('maps every TIR weekly dose × B12/Glycine to vial-specific retail', () => {
    for (const formulation of ['Vitamin B12', 'Glycine'] as const) {
      for (const dose of TIR_PATIENT_WEEKLY_DOSES) {
        const resolved = resolveOneTimeVial({
          familyId: 'tirzepatide',
          formulation,
          requestedDose: dose,
        });
        expect(resolved.ok).toBe(true);
        if (!resolved.ok) continue;
        expect(resolved.mapping.retailPriceCents).toBe(TIR_PRICES[dose] * 100);
        const route = resolveFamilyVariant('tirzepatide', {
          purchaseType: 'one_time',
          additive: formulation,
          requestedDose: dose,
        });
        expect(route.ok).toBe(true);
        expect(route.variant?.websiteVariantId).toBe(resolved.mapping.websiteVariantId);
        expect(lockedRetailPrice(route.variant!)).toBe(TIR_PRICES[dose]);
        expect(skuForFamilyVariantId(route.variant!.websiteVariantId)).toBe(resolved.mapping.mbmSku);
        expect(resolved.mapping.fulfillmentVialLabel).not.toMatch(/mg\/mL|× 2 mL|x 2 mL/i);
      }
    }
  });

  it('does not invent a one-time vial for Getting Started / Not Sure', () => {
    const blocked = resolveOneTimeVial({
      familyId: 'semaglutide',
      formulation: 'Vitamin B12',
      requestedDose: GETTING_STARTED_DOSE,
    });
    expect(blocked).toEqual({ ok: false, error: ONE_TIME_GETTING_STARTED_BLOCKER });
    const route = resolveFamilyVariant('semaglutide', {
      purchaseType: 'one_time',
      additive: 'Vitamin B12',
      requestedDose: GETTING_STARTED_DOSE,
    });
    expect(route.ok).toBe(false);
    const auth = authorizeGlp1OneTimeOrderLine({
      productId: 'p1',
      slug: 'semaglutide',
      purchaseType: 'one_time',
      requestedFormulation: 'Vitamin B12',
      requestedDose: GETTING_STARTED_DOSE,
      unitAmountCents: 10900,
    });
    expect(auth.ok).toBe(false);
  });

  it('membership resolution stays flat and ignores weekly dose for price', () => {
    const sem = resolveFamilyVariant('semaglutide', {
      purchaseType: 'membership',
      requestedDose: '2 mg',
    });
    const tir = resolveFamilyVariant('tirzepatide', {
      purchaseType: 'membership',
      requestedDose: GETTING_STARTED_DOSE,
    });
    expect(sem.variant?.finalRetailPrice).toBe(125);
    expect(tir.variant?.finalRetailPrice).toBe(179);
  });

  it('covers 28 one-time dose/formulation pairs and 10 new SKUs', () => {
    expect(listOneTimeVialMappings()).toHaveLength(28);
    expect(NEW_ONE_TIME_VIAL_SKUS).toHaveLength(10);
  });

  it('reuses existing Tagada prices when the vial SKU already exists', () => {
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-SEM-B12-001']?.mbm_price_cents).toBe(10900);
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-SEM-B12-002']?.mbm_price_cents).toBe(11900);
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-TIR-B12-001']?.mbm_price_cents).toBe(13900);
    expect(LAUNCH_READY_KASHU_MAP['MBM-WM-TIR-B12-002']?.mbm_price_cents).toBe(17900);
  });
});
