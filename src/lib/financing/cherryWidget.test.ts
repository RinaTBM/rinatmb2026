import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CHERRY_HOST_ELEMENT_ID,
  CHERRY_LOADER_GLOBAL,
  CHERRY_LOGO_ABSOLUTE_URL,
  CHERRY_PARTNER_NAME,
  CHERRY_SLUG,
  CHERRY_WIDGET_SCRIPT_URL,
  __resetCherryWidgetForTests,
  ensureCherryFloatingEstimator,
  getCherryInitConfig,
} from './cherryWidget';

describe('Cherry financing widget config', () => {
  it('uses owner slug, branding, and production logo (no Google Drive)', () => {
    const config = getCherryInitConfig();
    expect(config.variables.slug).toBe(CHERRY_SLUG);
    expect(config.variables.slug).toBe('thebaremethod');
    expect(config.variables.name).toBe(CHERRY_PARTNER_NAME);
    expect(config.variables.defaultPurchaseAmount).toBe(500);
    expect(config.variables.imageCategory).toBe('medspa');
    expect(config.variables.language).toBe('en');
    expect(config.variables.customLogo).toBe(CHERRY_LOGO_ABSOLUTE_URL);
    expect(config.variables.customLogo).toContain('mybaremethod.com/images/logo/');
    expect(config.variables.customLogo.toLowerCase()).not.toContain('drive.google');
    expect(config.styles.primaryColor).toBe('#c5ac96');
    expect(config.styles.secondaryColor).toBe('#38200a');
    expect(config.styles.fontFamily).toBe('Playfair Display');
    expect(config.styles.headerFontFamily).toBe('Playfair Display');
    expect(config.styles.floatingEstimator.position).toBe('bottom-right');
    expect(config.styles.floatingEstimator.offset).toEqual({ x: '0px', y: '24px' });
    expect(config.styles.floatingEstimator.zIndex).toBe(9999);
    expect(config.styles.floatingEstimator.ctaColor).toBe('#c5ac96');
    expect(config.styles.floatingEstimator.ctaTextColor).toBe('#FFFFFF');
  });

  it('points at official Cherry script domain only', () => {
    expect(CHERRY_WIDGET_SCRIPT_URL).toBe('https://files.withcherry.com/widgets/widget.js');
    expect(CHERRY_HOST_ELEMENT_ID).toBe('floatingEstimator');
    expect(CHERRY_LOADER_GLOBAL).toBe('_hw');
  });
});

describe('ensureCherryFloatingEstimator', () => {
  const scripts: Array<{ id: string; src: string; async: boolean; onerror: unknown }> = [];
  let fakeWindow: { _hw?: (...args: unknown[]) => void };

  beforeEach(() => {
    __resetCherryWidgetForTests();
    scripts.length = 0;
    fakeWindow = {};

    const head = { appendChild: (el: { id: string; src: string }) => scripts.push(el as never) };
    const firstScript = {
      parentNode: {
        insertBefore: (el: { id: string; src: string }) => {
          scripts.push(el as never);
        },
      },
    };

    vi.stubGlobal('window', fakeWindow);
    vi.stubGlobal('document', {
      getElementById: (id: string) => scripts.find(s => s.id === id) ?? null,
      createElement: (tag: string) => {
        if (tag !== 'script') throw new Error(`unexpected tag ${tag}`);
        return {
          id: '',
          src: '',
          async: false,
          onerror: null as unknown,
        };
      },
      getElementsByTagName: (tag: string) => (tag === 'script' ? [firstScript] : []),
      head,
    });
  });

  afterEach(() => {
    __resetCherryWidgetForTests();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('injects script once and queues init without throwing', () => {
    ensureCherryFloatingEstimator();
    ensureCherryFloatingEstimator();

    expect(scripts.length).toBe(1);
    expect(scripts[0].id).toBe(CHERRY_LOADER_GLOBAL);
    expect(scripts[0].src).toContain('files.withcherry.com/widgets/widget.js');
    expect(typeof fakeWindow._hw).toBe('function');
    const q = (fakeWindow._hw as { q?: unknown[] }).q;
    expect(Array.isArray(q)).toBe(true);
    expect(q!.length).toBeGreaterThanOrEqual(1);
    const firstCall = q![0] as unknown[];
    expect(firstCall[0]).toBe('init');
    expect(firstCall[2]).toEqual([CHERRY_HOST_ELEMENT_ID]);
  });
});
