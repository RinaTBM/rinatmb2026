/**
 * Cherry financing floating estimator — discovery/application only.
 * Does NOT create MBM orders, mark payment, or replace Tagada checkout.
 */

export const CHERRY_WIDGET_SCRIPT_URL =
  'https://files.withcherry.com/widgets/widget.js' as const;

/** Official Cherry partner slug (owner-supplied). */
export const CHERRY_SLUG = 'thebaremethod' as const;

export const CHERRY_PARTNER_NAME = 'The Bare Method' as const;

/**
 * Production-hosted brand logo (same asset as Header BrandLogo).
 * Never use Google Drive view URLs for Cherry customLogo.
 */
export const CHERRY_LOGO_ABSOLUTE_URL =
  'https://mybaremethod.com/images/logo/my-bare-method-logo.png' as const;

export const CHERRY_HOST_ELEMENT_ID = 'floatingEstimator' as const;

/** Script element id must be `_hw` for Cherry's loader contract. */
export const CHERRY_LOADER_GLOBAL = '_hw' as const;

export const CHERRY_DEFAULT_PURCHASE_AMOUNT = 500;

export const CHERRY_PRIMARY_COLOR = '#c5ac96';
export const CHERRY_SECONDARY_COLOR = '#38200a';
export const CHERRY_FONT_FAMILY = 'Playfair Display';

/**
 * bottom-middle keeps clear of LeadConnector chat (typically bottom-right).
 * Modest upward offset avoids mobile browser chrome / chat overlap without
 * covering checkout CTAs (which sit mid-page / above the fold on scroll).
 */
export const CHERRY_FLOATING_ESTIMATOR_STYLES = {
  position: 'bottom-middle' as const,
  offset: { x: '0px', y: '72px' },
  zIndex: 9999,
  ctaColor: CHERRY_PRIMARY_COLOR,
  ctaTextColor: '#FFFFFF',
  ctaFontFamily: CHERRY_FONT_FAMILY,
  bodyFontFamily: CHERRY_FONT_FAMILY,
};

export type CherryHwFn = ((...args: unknown[]) => void) & {
  q?: unknown[];
};

declare global {
  interface Window {
    _hw?: CherryHwFn;
  }
}

let cherryInitStarted = false;

export function getCherryInitConfig() {
  return {
    debug: false,
    variables: {
      slug: CHERRY_SLUG,
      name: CHERRY_PARTNER_NAME,
      defaultPurchaseAmount: CHERRY_DEFAULT_PURCHASE_AMOUNT,
      customLogo: CHERRY_LOGO_ABSOLUTE_URL,
      imageCategory: 'medspa',
      language: 'en',
    },
    styles: {
      primaryColor: CHERRY_PRIMARY_COLOR,
      secondaryColor: CHERRY_SECONDARY_COLOR,
      fontFamily: CHERRY_FONT_FAMILY,
      headerFontFamily: CHERRY_FONT_FAMILY,
      floatingEstimator: CHERRY_FLOATING_ESTIMATOR_STYLES,
    },
  };
}

/**
 * Load Cherry widget.js once and queue init for floatingEstimator.
 * Safe across SPA navigations / React Strict Mode double-mounts.
 * Failures are non-destructive (checkout unaffected).
 */
export function ensureCherryFloatingEstimator(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (cherryInitStarted) return;
  cherryInitStarted = true;

  try {
    const existing = document.getElementById(CHERRY_LOADER_GLOBAL);
    if (!window._hw) {
      const queueFn: CherryHwFn = (...args: unknown[]) => {
        (queueFn.q = queueFn.q || []).push(args);
      };
      window._hw = queueFn;
    }

    const config = getCherryInitConfig();
    window._hw('init', config, [CHERRY_HOST_ELEMENT_ID]);

    if (existing) return;

    const script = document.createElement('script');
    script.id = CHERRY_LOADER_GLOBAL;
    script.src = CHERRY_WIDGET_SCRIPT_URL;
    script.async = true;
    script.onerror = () => {
      // Non-destructive: financing discovery unavailable; leave checkout alone.
      console.warn('[Cherry] floating estimator script failed to load');
    };
    const first = document.getElementsByTagName('script')[0];
    if (first?.parentNode) {
      first.parentNode.insertBefore(script, first);
    } else {
      document.head.appendChild(script);
    }
  } catch {
    console.warn('[Cherry] floating estimator init skipped');
  }
}

/** Test helper — do not call from production UI. */
export function __resetCherryWidgetForTests(): void {
  cherryInitStarted = false;
}
