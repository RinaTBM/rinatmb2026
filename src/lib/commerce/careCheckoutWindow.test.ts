import { afterEach, describe, expect, it, vi } from 'vitest';
import { openCareCheckoutWindow, validatedCareCheckoutUrl } from './careCheckoutWindow';

const url = 'https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/lab-example';
afterEach(() => vi.unstubAllGlobals());

describe('hosted care window', () => {
  it('rejects destinations outside the clinic checkout', () => {
    for (const value of ['https://evil.example/', url.replace('https:', 'http:'), url.replace('f5e0mdyBYnDh7HGvek0C', 'other'), url.replace('/product/lab-example', '/settings'), url.replace('https://', 'https://user:pass@')]) {
      expect(() => validatedCareCheckoutUrl(value)).toThrow();
    }
  });
  it.each(['allowed', 'blocked', 'throws'])('preserves main window when popup is %s', mode => {
    const open = vi.fn(() => { if (mode === 'throws') throw Error('Popup denied'); return null; });
    const dispatchEvent = vi.fn();
    const location = { href: 'https://mybaremethod.com/product/example' };
    vi.stubGlobal('window', { open, dispatchEvent, location, top: { location } });
    vi.stubGlobal('CustomEvent', class { constructor(public type: string, public options: unknown) {} });
    expect(() => openCareCheckoutWindow(url)).not.toThrow();
    expect(open).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith(url, '_blank', expect.stringContaining('noopener'));
    expect(location.href).toBe('https://mybaremethod.com/product/example');
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(dispatchEvent.mock.calls)).not.toMatch(/paid|completed/);
  });
});
