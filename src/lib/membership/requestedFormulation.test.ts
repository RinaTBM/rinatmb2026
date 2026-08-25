import { describe, expect, it } from 'vitest';
import { getMembership } from '@/data/products';
import {
  GETTING_STARTED_FORMULATION,
  GETTING_STARTED_LABEL,
  isAllowedRequestedFormulation,
  labelRequestedFormulation,
  requestedFormulationOptions,
  validateMembershipRequestedFormulation,
} from './requestedFormulation';

describe('membership requested formulation options', () => {
  it('Semaglutide offers Getting Started / Not Sure + Vitamin B12 and Glycine', () => {
    const m = getMembership('semaglutide-membership')!;
    expect(m.monthlyPrice).toBe(149);
    const opts = requestedFormulationOptions(m.includedFormulations);
    expect(opts.map(o => o.value)).toEqual([
      GETTING_STARTED_FORMULATION,
      'Vitamin B12',
      'Glycine',
    ]);
    expect(opts[0].label).toBe(GETTING_STARTED_LABEL);
  });

  it('Tirzepatide offers Getting Started / Not Sure + Vitamin B12 and Glycine', () => {
    const m = getMembership('tirzepatide-membership')!;
    expect(m.monthlyPrice).toBe(275);
    const opts = requestedFormulationOptions(m.includedFormulations);
    expect(opts.map(o => o.value)).toEqual([
      GETTING_STARTED_FORMULATION,
      'Vitamin B12',
      'Glycine',
    ]);
  });

  it('accepts Getting Started / Not Sure as a request option', () => {
    const m = getMembership('semaglutide-membership')!;
    expect(isAllowedRequestedFormulation(GETTING_STARTED_FORMULATION, m.includedFormulations)).toBe(
      true,
    );
    expect(isAllowedRequestedFormulation(GETTING_STARTED_LABEL, m.includedFormulations)).toBe(true);
    expect(labelRequestedFormulation(GETTING_STARTED_FORMULATION)).toBe(GETTING_STARTED_LABEL);
  });

  it('rejects unsupported requested formulation', () => {
    const m = getMembership('semaglutide-membership')!;
    expect(isAllowedRequestedFormulation('30mg', m.includedFormulations)).toBe(false);
    expect(
      validateMembershipRequestedFormulation({
        requestedFormulation: '30mg',
        includedFormulations: m.includedFormulations,
      }).ok,
    ).toBe(false);
  });

  it('requires a selection before checkout can continue', () => {
    const m = getMembership('semaglutide-membership')!;
    const missing = validateMembershipRequestedFormulation({
      requestedFormulation: '',
      includedFormulations: m.includedFormulations,
    });
    expect(missing.ok).toBe(false);
  });

  it('requested formulation persists into cart-shaped payload and checkout metadata fields', () => {
    const m = getMembership('semaglutide-membership')!;
    const validated = validateMembershipRequestedFormulation({
      requestedFormulation: 'Vitamin B12',
      includedFormulations: m.includedFormulations,
    });
    expect(validated.ok).toBe(true);
    if (!validated.ok) return;

    const cartItem = {
      productId: m.checkoutProductId,
      slug: m.slug,
      name: m.displayName,
      price: m.monthlyPrice,
      purchaseType: 'membership_program' as const,
      isMembership: true,
      requestedFormulation: validated.value,
      variantLabel: `Requested dose: ${labelRequestedFormulation(validated.value)}`,
    };
    expect(cartItem.requestedFormulation).toBe('Vitamin B12');
    expect(cartItem.variantLabel).toBe('Requested dose: Vitamin B12');
    expect(cartItem.price).toBe(149);

    const checkoutPayload = {
      requested_formulation: cartItem.requestedFormulation,
      membership_slug: cartItem.slug,
      membership_app_product_id: cartItem.productId,
    };
    expect(checkoutPayload).toEqual({
      requested_formulation: 'Vitamin B12',
      membership_slug: 'semaglutide-membership',
      membership_app_product_id: 'm1',
    });
  });

  it('preserves provider-review / not-guaranteed semantics in membership data', () => {
    const sema = getMembership('semaglutide-membership')!;
    const tirz = getMembership('tirzepatide-membership')!;
    expect(sema.providerReviewRequired).toBe(true);
    expect(tirz.providerReviewRequired).toBe(true);
    expect(sema.prescriptionGuaranteed).toBe(false);
    expect(tirz.prescriptionGuaranteed).toBe(false);
    expect(sema.monthlyPrice).not.toBe(199);
  });
});
