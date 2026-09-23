import { describe, expect, it } from 'vitest';
import { getProduct, visibleProducts } from '@/data/products';
import { SHOP_CATEGORY_IDS } from '@/lib/browse/productBrowse';
import { getWebsiteFamilyBySlug, listPatientVisibleVariants } from '@/data/websiteFamilies';
import { resolveGenProductFirstCheckout } from '@/lib/commerce/genHostedCheckout';
import { GEN_HOSTED_PRODUCTS } from '@/lib/commerce/genHostedProducts';

const EXPECTED_SHOP_SLUGS = [
  'semaglutide',
  'tirzepatide',
  'fat-burner',
  'estradiol-patch',
  'progesterone-capsules',
  'testosterone-cream',
  'nad-plus',
  'selank-semax-nasal-spray',
  'tesamorelin',
  'selank',
  'semax',
  'tretinoin-cream',
  'minoxidil-topical',
  'recovery-stack',
  'scream-cream',
  'aod-9604',
  'bpc-157',
  'ghk-cu-minoxidil',
  'ondansetron-odt',
  'initial-provider-consultation',
  'follow-up-appointment',
  'laboratory-review',
  'alcohol-prep-wipes',
  'complete-injection-starter-kit',
  'daily-weekly-wellness-planner',
  'discreet-travel-bag',
  'premium-3d-printed-peptide-case',
  'premium-insulin-syringes',
  'reusable-ice-pack',
  'sharps-container',
  'temperature-controlled-travel-case',
] as const;

describe('shop visibility vs purchase readiness', () => {
  it('shows the restored public wellness and accessory catalog on Shop All', () => {
    const shop = visibleProducts.filter((p) => SHOP_CATEGORY_IDS.has(p.category));
    expect(shop.map((p) => p.slug).sort()).toEqual([...EXPECTED_SHOP_SLUGS].sort());
    expect(shop).toHaveLength(31);
  });

  it('keeps future-hidden products off the storefront', () => {
    const slugs = visibleProducts.map((p) => p.slug);
    expect(slugs).not.toContain('sermorelin');
    expect(slugs).not.toContain('minoxidil-tablets');
    expect(slugs).not.toContain('bimatoprost-solution');
    expect(getProduct('bimatoprost-solution')).toBeUndefined();
  });

  it('reports prescription routing blockers without treating unknown SKUs as purchasable', () => {
    // Provider appointments use direct GEN booking links, not GEN_HOSTED_PRODUCTS.
    const shop = visibleProducts.filter(
      (p) => SHOP_CATEGORY_IDS.has(p.category) && p.category !== 'accessories' && p.category !== 'provider-appointments',
    );
    const purchasable: string[] = [];
    const unavailable: string[] = [];
    for (const p of shop) {
      const hosted = GEN_HOSTED_PRODUCTS[p.slug];
      if (hosted) {
        const options = hosted.options ?? [hosted];
        if (options.every(option => resolveGenProductFirstCheckout(option.genClientProductId).ok)) purchasable.push(p.slug);
        else unavailable.push(p.slug);
        continue;
      }
      const family = getWebsiteFamilyBySlug(p.slug);
      const hasVerifiedGenRoute = Boolean(
        family &&
          listPatientVisibleVariants(family).length > 0 &&
          listPatientVisibleVariants(family).every((variant) =>
            resolveGenProductFirstCheckout(variant.genClientProductId).ok,
          ),
      );
      if (hasVerifiedGenRoute) {
        purchasable.push(p.slug);
        continue;
      }
      unavailable.push(p.slug);
    }
    // GEN admin confirms both standalone products still need formulary pairing.
    // Visibility alone must never be reported as a working purchase path.
    expect(unavailable.sort()).toEqual(['selank', 'semax']);
    expect(purchasable).toHaveLength(17);
  });
});
