import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  APPROVED_KASHU_CHECKOUT_HOSTS,
  isApprovedKashuCheckoutRedirectUrl,
  navigateToKashuHostedCheckout,
} from './kashuTagada';

describe('Kashu hosted checkout redirect allowlist + top-level navigation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('approves checkout.mybaremethod.com HTTPS /checkout URLs only', () => {
    expect(APPROVED_KASHU_CHECKOUT_HOSTS).toEqual(['checkout.mybaremethod.com']);
    const ok = isApprovedKashuCheckoutRedirectUrl(
      'https://checkout.mybaremethod.com/checkout?checkoutToken=abc',
    );
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.url.hostname).toBe('checkout.mybaremethod.com');
  });

  it('rejects arbitrary / non-HTTPS / wrong-host redirects', () => {
    expect(isApprovedKashuCheckoutRedirectUrl('http://checkout.mybaremethod.com/checkout').ok).toBe(
      false,
    );
    expect(isApprovedKashuCheckoutRedirectUrl('https://evil.example/checkout').ok).toBe(false);
    expect(isApprovedKashuCheckoutRedirectUrl('https://checkout.mybaremethod.com/admin').ok).toBe(
      false,
    );
    expect(isApprovedKashuCheckoutRedirectUrl('not-a-url').ok).toBe(false);
  });

  it('uses window.top.location.assign when embedded in an iframe (Bolt Preview)', () => {
    const topAssign = vi.fn();
    const selfAssign = vi.fn();
    const fakeTop = { location: { assign: topAssign } };
    const fakeSelf = {
      top: fakeTop,
      location: { assign: selfAssign },
    };
    vi.stubGlobal('window', fakeSelf);

    const result = navigateToKashuHostedCheckout(
      'https://checkout.mybaremethod.com/checkout?checkoutToken=tok',
    );
    expect(result).toEqual({ ok: true });
    expect(topAssign).toHaveBeenCalledWith(
      'https://checkout.mybaremethod.com/checkout?checkoutToken=tok',
    );
    expect(selfAssign).not.toHaveBeenCalled();
  });

  it('falls back to window.location.assign when not framed', () => {
    const assign = vi.fn();
    const fakeSelf: { top: unknown; location: { assign: typeof assign } } = {
      top: null as unknown,
      location: { assign },
    };
    fakeSelf.top = fakeSelf;
    vi.stubGlobal('window', fakeSelf);

    const result = navigateToKashuHostedCheckout(
      'https://checkout.mybaremethod.com/checkout?checkoutToken=tok',
    );
    expect(result).toEqual({ ok: true });
    expect(assign).toHaveBeenCalledWith(
      'https://checkout.mybaremethod.com/checkout?checkoutToken=tok',
    );
  });

  it('does not navigate to unapproved hosts', () => {
    const assign = vi.fn();
    vi.stubGlobal('window', { top: null, location: { assign } });
    const result = navigateToKashuHostedCheckout('https://evil.example/phish');
    expect(result.ok).toBe(false);
    expect(assign).not.toHaveBeenCalled();
  });
});
