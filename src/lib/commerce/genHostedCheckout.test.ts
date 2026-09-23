import { describe, expect, it } from 'vitest';
import { resolveGenProductFirstCheckout } from './genHostedCheckout';
import { GEN_HOSTED_PRODUCTS } from './genHostedProducts';

describe('resolveGenProductFirstCheckout', () => {
  it.each([
    ['bpc-157', 'KXMm9SsbOEYnFy9phmZn'],
    ['fat-burner', '7Kix55LA15U0lNvY9QXI'],
  ])('routes %s to its live-verified GEN checkout', (slug, productId) => {
    // Verified against GEN admin checkout links and public assessment titles on 2026-09-22.
    expect(resolveGenProductFirstCheckout(GEN_HOSTED_PRODUCTS[slug].genClientProductId)).toEqual({
      ok: true,
      url: `https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_${productId}`,
    });
  });

  it('keeps missing and unverified products blocked', () => {
    expect(resolveGenProductFirstCheckout(null)).toEqual({ ok: false, code: 'MISSING_PRODUCT_ID' });
    expect(resolveGenProductFirstCheckout('f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_unverified')).toEqual({ ok: false, code: 'PAIRING_NOT_VERIFIED' });
  });
  it('builds the canonical checkout URL for an owner-verified product', () => {
    expect(
      resolveGenProductFirstCheckout(
        'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw',
      ),
    ).toEqual({
      ok: true,
      url: 'https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw',
    });
  });

  it('builds the canonical checkout URL for the live NAD+ Injectable wrapper', () => {
    expect(
      resolveGenProductFirstCheckout(
        'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SHJpGAACUFEeMONdpEbn',
      ),
    ).toEqual({
      ok: true,
      url: 'https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SHJpGAACUFEeMONdpEbn',
    });
  });

  it('builds the canonical checkout URL for the live Estradiol Patch wrapper', () => {
    expect(
      resolveGenProductFirstCheckout(
        'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_o7dNtf9QsnEqPCrLr2tR',
      ),
    ).toEqual({
      ok: true,
      url: 'https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_o7dNtf9QsnEqPCrLr2tR',
    });
  });

  it('routes an owner-verified active workbook product', () => {
    expect(
      resolveGenProductFirstCheckout(
        'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_PRIG7DYPNNgco3lGf1zx',
      ),
    ).toEqual({ ok: true, url: 'https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_PRIG7DYPNNgco3lGf1zx' });
  });

  it('rejects a product belonging to another GEN client', () => {
    expect(
      resolveGenProductFirstCheckout(
        'otherClient_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw',
      ),
    ).toEqual({ ok: false, code: 'WRONG_CLIENT' });
  });
});
