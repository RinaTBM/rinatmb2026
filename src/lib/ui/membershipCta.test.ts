import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { visibleMemberships } from '@/data/products';
import {
  isReadableMembershipJoinCtaClass,
  MEMBERSHIP_JOIN_CTA_ACTIVE_CLASS,
  membershipJoinButtonClassName,
} from './membershipCta';

describe('membership Join CTA active styling', () => {
  it('uses shared btn-primary (light/near-white text) for Semaglutide and Tirzepatide', () => {
    const sema = visibleMemberships.find(m => m.slug === 'semaglutide-membership');
    const tirz = visibleMemberships.find(m => m.slug === 'tirzepatide-membership');
    expect(sema).toBeTruthy();
    expect(tirz).toBeTruthy();

    const semaClass = membershipJoinButtonClassName({ highlighted: sema!.highlighted });
    const tirzClass = membershipJoinButtonClassName({ highlighted: tirz!.highlighted });

    expect(semaClass).toBe(MEMBERSHIP_JOIN_CTA_ACTIVE_CLASS);
    expect(tirzClass).toBe(MEMBERSHIP_JOIN_CTA_ACTIVE_CLASS);
    expect(semaClass).toBe(tirzClass);
    expect(isReadableMembershipJoinCtaClass(semaClass)).toBe(true);
    expect(isReadableMembershipJoinCtaClass(tirzClass)).toBe(true);
  });

  it('never stacks btn-outline on the active Join CTA (root cause of dark-on-black text)', () => {
    expect(membershipJoinButtonClassName({ highlighted: false })).not.toContain('btn-outline');
    expect(membershipJoinButtonClassName({ highlighted: true })).not.toContain('btn-outline');
    expect(isReadableMembershipJoinCtaClass('btn-primary w-full btn-outline')).toBe(false);
  });

  it('btn-primary shared styles keep light (cream-50 / white) text on dark background', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');
    const primaryBlock = css.match(/\.btn-primary\s*\{[\s\S]*?\}/)?.[0] ?? '';
    expect(primaryBlock).toContain('bg-ink-900');
    expect(primaryBlock).toContain('text-cream-50');
    expect(primaryBlock).not.toContain('text-ink-800');
    expect(primaryBlock).toContain('hover:bg-ink-800');
    expect(primaryBlock).toContain('focus-visible:outline');
    expect(primaryBlock).toContain('disabled:opacity-50');
  });
});
