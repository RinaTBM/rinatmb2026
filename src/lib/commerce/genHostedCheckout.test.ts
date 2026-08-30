import { describe, expect, it } from 'vitest';
import { resolveGenProductFirstCheckout } from './genHostedCheckout';

describe('resolveGenProductFirstCheckout', () => {
  it('builds the default Product-first URL for an owner-verified product', () => {
    expect(
      resolveGenProductFirstCheckout(
        'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw',
      ),
    ).toEqual({
      ok: true,
      url: 'https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw',
    });
  });

  it('builds the Product-first URL for the live NAD+ Injectable wrapper', () => {
    expect(
      resolveGenProductFirstCheckout(
        'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SHJpGAACUFEeMONdpEbn',
      ),
    ).toEqual({
      ok: true,
      url: 'https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SHJpGAACUFEeMONdpEbn',
    });
  });

  it('builds the Product-first URL for the live Estradiol Patch wrapper', () => {
    expect(
      resolveGenProductFirstCheckout(
        'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_o7dNtf9QsnEqPCrLr2tR',
      ),
    ).toEqual({
      ok: true,
      url: 'https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_o7dNtf9QsnEqPCrLr2tR',
    });
  });

  it('does not route an unverified product', () => {
    expect(
      resolveGenProductFirstCheckout(
        'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_PRIG7DYPNNgco3lGf1zx',
      ),
    ).toEqual({ ok: false, code: 'PAIRING_NOT_VERIFIED' });
  });

  it('rejects a product belonging to another GEN client', () => {
    expect(
      resolveGenProductFirstCheckout(
        'otherClient_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw',
      ),
    ).toEqual({ ok: false, code: 'WRONG_CLIENT' });
  });
});
