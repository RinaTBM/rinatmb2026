import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  APPROVED_KASHU_CHECKOUT_HOSTS,
  isApprovedKashuCheckoutRedirectUrl,
  isEmbeddedInIframe,
  navigateToKashuHostedCheckout,
} from './kashuTagada';

const CHECKOUT_URL = 'https://checkout.mybaremethod.com/checkout?checkoutToken=tok';

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

  it('Bolt Preview iframe: uses window.top (not iframe) navigation', () => {
    const topAssign = vi.fn();
    const selfAssign = vi.fn();
    const fakeTop = {
      location: {
        assign: topAssign,
        set href(_v: string) {
          /* href setter used by top_href path */
        },
        get href() {
          return '';
        },
      },
    };
    // Make href setter trackable
    let topHref = '';
    Object.defineProperty(fakeTop.location, 'href', {
      configurable: true,
      get: () => topHref,
      set: (v: string) => {
        topHref = v;
      },
    });
    const fakeSelf = {
      top: fakeTop,
      location: { assign: selfAssign },
      open: vi.fn(),
      document: {
        createElement: vi.fn(() => ({
          href: '',
          target: '',
          rel: '',
          setAttribute: vi.fn(),
          click: vi.fn(),
          remove: vi.fn(),
        })),
        body: { appendChild: vi.fn() },
      },
    };
    vi.stubGlobal('window', fakeSelf);
    vi.stubGlobal('document', fakeSelf.document);

    expect(isEmbeddedInIframe()).toBe(true);
    const result = navigateToKashuHostedCheckout(CHECKOUT_URL);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.method).toBe('top_href');
    expect(topHref).toBe(CHECKOUT_URL);
    expect(selfAssign).not.toHaveBeenCalled();
  });

  it('Bolt Preview iframe: when top.location throws, never navigates the iframe', () => {
    const selfAssign = vi.fn();
    const open = vi.fn();
    const click = vi.fn();
    const fakeTop = {
      location: {
        get href() {
          throw new Error('blocked');
        },
        set href(_v: string) {
          throw new Error('blocked');
        },
        assign: () => {
          throw new Error('blocked');
        },
      },
    };
    const anchor = {
      href: '',
      target: '',
      rel: '',
      setAttribute: vi.fn(),
      click,
      remove: vi.fn(),
    };
    const fakeSelf = {
      top: fakeTop,
      location: { assign: selfAssign },
      open,
      document: {
        createElement: vi.fn(() => anchor),
        body: { appendChild: vi.fn() },
      },
    };
    vi.stubGlobal('window', fakeSelf);
    vi.stubGlobal('document', fakeSelf.document);

    // open succeeds → open_top (assign throws, href throws)
    const result = navigateToKashuHostedCheckout(CHECKOUT_URL);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.method).toBe('open_top');
    expect(open).toHaveBeenCalledWith(CHECKOUT_URL, '_top');
    expect(selfAssign).not.toHaveBeenCalled();
  });

  it('Bolt Preview iframe: uses <a target="_top"> when top + open fail', () => {
    const selfAssign = vi.fn();
    const click = vi.fn();
    const remove = vi.fn();
    const appendChild = vi.fn();
    const anchor = {
      href: '',
      target: '',
      rel: '',
      setAttribute: vi.fn(),
      click,
      remove,
    };
    const fakeTop = {
      location: {
        set href(_v: string) {
          throw new Error('blocked');
        },
        get href() {
          return '';
        },
        assign: () => {
          throw new Error('blocked');
        },
      },
    };
    const fakeSelf = {
      top: fakeTop,
      location: { assign: selfAssign },
      open: () => {
        throw new Error('blocked');
      },
      document: {
        createElement: vi.fn(() => anchor),
        body: { appendChild },
      },
    };
    vi.stubGlobal('window', fakeSelf);
    vi.stubGlobal('document', fakeSelf.document);

    const result = navigateToKashuHostedCheckout(CHECKOUT_URL);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.method).toBe('anchor_top');
    expect(anchor.target).toBe('_top');
    expect(anchor.href).toBe(CHECKOUT_URL);
    expect(click).toHaveBeenCalled();
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

    const result = navigateToKashuHostedCheckout(CHECKOUT_URL);
    expect(result).toEqual({ ok: true, method: 'self_assign' });
    expect(assign).toHaveBeenCalledWith(CHECKOUT_URL);
  });

  it('does not navigate to unapproved hosts', () => {
    const assign = vi.fn();
    vi.stubGlobal('window', { top: null, location: { assign } });
    const result = navigateToKashuHostedCheckout('https://evil.example/phish');
    expect(result.ok).toBe(false);
    expect(assign).not.toHaveBeenCalled();
  });

  it('covers one-time / HRT / SEM / TIRZ checkout URLs with same top-level helper', () => {
    // All Tagada card flows share navigateToKashuHostedCheckout — validate URL shape only.
    const urls = [
      'https://checkout.mybaremethod.com/checkout?checkoutToken=one-time',
      'https://checkout.mybaremethod.com/checkout?checkoutToken=hrt-lab',
      'https://checkout.mybaremethod.com/checkout?checkoutToken=sem-membership',
      'https://checkout.mybaremethod.com/checkout?checkoutToken=tirz-membership',
    ];
    for (const url of urls) {
      expect(isApprovedKashuCheckoutRedirectUrl(url).ok).toBe(true);
    }
  });
});
