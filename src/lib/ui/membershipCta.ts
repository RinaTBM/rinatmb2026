/**
 * Shared active Join CTA classes for membership cards.
 *
 * Always use `btn-primary` alone for the active state. Never stack
 * `btn-outline` on top of `btn-primary` — outline's darker text token
 * (`text-ink-800`) overrides primary's light text (`text-cream-50`) when
 * both utility classes are present, producing unreadable dark-on-black.
 */
export const MEMBERSHIP_JOIN_CTA_ACTIVE_CLASS = 'btn-primary w-full';

/** Active membership Join CTA — dark background, light (near-white) label + icon. */
export function membershipJoinButtonClassName(options?: {
  highlighted?: boolean;
  disabled?: boolean;
}): string {
  // Highlighted vs non-highlighted cards share the same active CTA styling.
  // Card chrome (ring / badge) may differ; the button must not.
  void options;
  return MEMBERSHIP_JOIN_CTA_ACTIVE_CLASS;
}

/** True when the class string is a valid active Join CTA (no outline override). */
export function isReadableMembershipJoinCtaClass(className: string): boolean {
  const tokens = className.trim().split(/\s+/);
  return tokens.includes('btn-primary') && !tokens.includes('btn-outline');
}
