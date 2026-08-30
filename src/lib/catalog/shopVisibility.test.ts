import { describe, expect, it } from 'vitest';
import { getProduct, visibleProducts } from '@/data/products';
import { SHOP_CATEGORY_IDS } from '@/lib/browse/productBrowse';
import { skuForVariantId } from '@/data/variantSkus';
import { resolveStorefrontRxAvailability } from '@/lib/commerce/rxCatalogReadiness';
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
  'bpc-157-tb-500',
  'tretinoin-cream',
  'minoxidil-topical',
  'recovery-stack',
  'scream-cream',
  'aod-9604',
  'metabolic-triple',
  'bpc-157',
  'ghk-cu-minoxidil',
] as const;

describe('shop visibility vs purchase readiness', () => {
  it('shows the restored public wellness catalog on Shop All', () => {
    const shop = visibleProducts.filter((p) => SHOP_CATEGORY_IDS.has(p.category));
    expect(shop.map((p) => p.slug).sort()).toEqual([...EXPECTED_SHOP_SLUGS].sort());
    expect(shop).toHaveLength(18);
  });

  it('keeps future-hidden products off the storefront', () => {
    const slugs = visibleProducts.map((p) => p.slug);
    expect(slugs).not.toContain('sermorelin');
    expect(slugs).not.toContain('minoxidil-tablets');
    expect(slugs).not.toContain('bimatoprost-solution');
    expect(getProduct('bimatoprost-solution')).toBeUndefined();
  });

  it('allows purchase for every active storefront product', () => {
    const shop = visibleProducts.filter((p) => SHOP_CATEGORY_IDS.has(p.category));
    const purchasable: string[] = [];
    const unavailable: string[] = [];
    for (const p of shop) {
      const family = getWebsiteFamilyBySlug(p.slug);
      const hasVerifiedGenRoute = Boolean(
        family &&
          listPatientVisibleVariants(family).some((variant) =>
            resolveGenProductFirstCheckout(variant.genClientProductId).ok,
          ),
      );
      if (hasVerifiedGenRoute) {
        purchasable.push(p.slug);
        continue;
      }
      if (GEN_HOSTED_PRODUCTS[p.slug] && resolveGenProductFirstCheckout(GEN_HOSTED_PRODUCTS[p.slug].genClientProductId).ok) {
        purchasable.push(p.slug);
        continue;
      }

      const sku = p.variants[0]?.sku || skuForVariantId(p.variants[0]?.id);
      const rx = resolveStorefrontRxAvailability({ mbmSku: sku, genApiOrdersEnabled: false });
      if (!rx || rx.productionPurchasable) purchasable.push(p.slug);
      else unavailable.push(p.slug);
    }
    expect(purchasable.sort()).toEqual([...EXPECTED_SHOP_SLUGS].sort());
    expect(unavailable).toHaveLength(0);
  });
});
