import { describe, expect, it } from 'vitest';
import { getMembership } from '@/data/products';
import { resolveFamilyVariant, skuForFamilyVariantId } from '@/data/websiteFamilies';
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

  it('SEM membership stays $149 and TIR $275 for every patient dose', () => {
    const sem = getMembership('semaglutide-membership')!;
    const tir = getMembership('tirzepatide-membership')!;
    expect(sem.monthlyPrice).toBe(149);
    expect(tir.monthlyPrice).toBe(275);
    for (const dose of [GETTING_STARTED_DOSE, ...SEM_PATIENT_WEEKLY_DOSES]) {
      expect(sem.monthlyPrice).toBe(149);
      expect(isAllowedRequestedDose(dose, 'semaglutide')).toBe(true);
    }
    for (const dose of [GETTING_STARTED_DOSE, ...TIR_PATIENT_WEEKLY_DOSES]) {
      expect(tir.monthlyPrice).toBe(275);
      expect(isAllowedRequestedDose(dose, 'tirzepatide')).toBe(true);
    }
  });

  it('weekly dose does not change one-time fulfillment variant / SKU / Tagada price', () => {
    const b12Low = resolveFamilyVariant('semaglutide', {
      purchaseType: 'one_time',
      additive: 'Vitamin B12',
      doseTier: 'Starting / Low',
    });
    expect(b12Low.variant?.websiteVariantId).toBe('sem-b12-starting-low');
    const sku = skuForFamilyVariantId(b12Low.variant!.websiteVariantId)!;
    const tagada = LAUNCH_READY_KASHU_MAP[sku];
    expect(tagada?.mbm_price_cents).toBe(8900);
    for (const dose of SEM_PATIENT_WEEKLY_DOSES) {
      const again = resolveFamilyVariant('semaglutide', {
        purchaseType: 'one_time',
        additive: 'Vitamin B12',
        doseTier: 'Starting / Low',
      });
      expect(again.variant?.websiteVariantId).toBe('sem-b12-starting-low');
      expect(skuForFamilyVariantId(again.variant!.websiteVariantId)).toBe(sku);
      expect(LAUNCH_READY_KASHU_MAP[sku]?.tagada_price_id).toBe(tagada?.tagada_price_id);
      expect(isAllowedRequestedDose(dose, 'semaglutide')).toBe(true);
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
