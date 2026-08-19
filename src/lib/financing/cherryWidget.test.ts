import { afterEach, describe, expect, it, vi } from 'vitest';
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
    expect(config.styles.floatingEstimator.position).toBe('bottom-middle');
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
  afterEach(() => {
    __resetCherryWidgetForTests();
    document.getElementById(CHERRY_LOADER_GLOBAL)?.remove();
    delete window._hw;
    vi.restoreAllMocks();
  });

  it('injects script once and queues init without throwing', () => {
    ensureCherryFloatingEstimator();
    ensureCherryFloatingEstimator();

    const scripts = document.querySelectorAll(`#${CHERRY_LOADER_GLOBAL}`);
    expect(scripts.length).toBe(1);
    expect((scripts[0] as HTMLScriptElement).src).toContain('files.withcherry.com/widgets/widget.js');
    expect(typeof window._hw).toBe('function');
    expect(Array.isArray(window._hw?.q)).toBe(true);
    expect(window._hw?.q?.length).toBeGreaterThanOrEqual(1);
    const firstCall = window._hw?.q?.[0] as unknown[];
    expect(firstCall[0]).toBe('init');
    expect(firstCall[2]).toEqual([CHERRY_HOST_ELEMENT_ID]);
  });
});
