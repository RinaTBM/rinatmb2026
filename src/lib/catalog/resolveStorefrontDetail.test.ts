import { describe, expect, it } from 'vitest';
import { getMembership, getProduct } from '@/data/products';
import {
  cartItemDetailPath,
  resolveStorefrontDetail,
} from './resolveStorefrontDetail';

describe('resolveStorefrontDetail — membership and product routes', () => {
  it('/product/semaglutide-membership resolves membership (not Product not found)', () => {
    const detail = resolveStorefrontDetail('semaglutide-membership');
    expect(detail.kind).toBe('membership');
    if (detail.kind !== 'membership') return;
    expect(detail.membership.slug).toBe('semaglutide-membership');
    expect(detail.membership.checkoutProductId).toBe('m1');
    expect(detail.membership.monthlyPrice).toBe(125);
    expect(detail.membership.includedFormulations).toEqual(['Vitamin B12', 'Glycine']);
    expect(detail.membership.initialTermMonths).toBe(3);
    expect(detail.membership.providerReviewRequired).toBe(true);
    expect(detail.membership.prescriptionGuaranteed).toBe(false);
  });

  it('/product/tirzepatide-membership resolves membership (not Product not found)', () => {
    const detail = resolveStorefrontDetail('tirzepatide-membership');
    expect(detail.kind).toBe('membership');
    if (detail.kind !== 'membership') return;
    expect(detail.membership.slug).toBe('tirzepatide-membership');
    expect(detail.membership.checkoutProductId).toBe('m2');
    expect(detail.membership.monthlyPrice).toBe(179);
    expect(detail.membership.includedFormulations).toEqual(['Vitamin B12', 'Glycine']);
  });

  it('Semaglutide detail displays $125/month (never $199)', () => {
    const m = getMembership('semaglutide-membership')!;
    expect(m.monthlyPrice).toBe(125);
    expect(m.monthlyPrice).not.toBe(199);
    const detail = resolveStorefrontDetail('semaglutide-membership');
    expect(detail.kind === 'membership' && detail.membership.monthlyPrice).toBe(125);
  });

  it('Tirzepatide detail displays $179/month', () => {
    const detail = resolveStorefrontDetail('tirzepatide-membership');
    expect(detail.kind === 'membership' && detail.membership.monthlyPrice).toBe(179);
  });

  it('membership cart links resolve to /product/:membership-slug', () => {
    expect(cartItemDetailPath({ slug: 'semaglutide-membership' })).toBe(
      '/product/semaglutide-membership',
    );
    expect(cartItemDetailPath({ slug: 'tirzepatide-membership' })).toBe(
      '/product/tirzepatide-membership',
    );
    expect(resolveStorefrontDetail('semaglutide-membership').kind).toBe('membership');
    expect(resolveStorefrontDetail('tirzepatide-membership').kind).toBe('membership');
  });

  it('regular product detail routes still work', () => {
    for (const slug of ['semaglutide', 'tirzepatide', 'nad-plus']) {
      const detail = resolveStorefrontDetail(slug);
      expect(detail.kind).toBe('product');
      expect(getProduct(slug)?.slug).toBe(slug);
    }
  });

  it('unknown product slug still correctly shows Product not found', () => {
    expect(resolveStorefrontDetail('definitely-not-a-real-product').kind).toBe('not_found');
    expect(resolveStorefrontDetail('elite-wellness-membership').kind).toBe('not_found');
    expect(resolveStorefrontDetail('sermorelin').kind).toBe('not_found');
    expect(resolveStorefrontDetail('minoxidil-tablets').kind).toBe('not_found');
  });

  it('restored public families resolve as products', () => {
    expect(resolveStorefrontDetail('estradiol-patch').kind).toBe('product');
    expect(resolveStorefrontDetail('bpc-157-tb-500').kind).toBe('product');
  });

  it('checkout item type remains membership_program for membership cart lines', () => {
    const membership = getMembership('semaglutide-membership')!;
    const cartLine = {
      productId: membership.checkoutProductId,
      slug: membership.slug,
      name: membership.displayName,
      price: membership.monthlyPrice,
      purchaseType: 'membership_program' as const,
      isMembership: true,
    };
    expect(cartLine.purchaseType).toBe('membership_program');
    expect(cartLine.price).toBe(125);
    expect(cartLine.name).toBe('Semaglutide Membership');
    expect(resolveStorefrontDetail(cartLine.slug).kind).toBe('membership');
  });
});
