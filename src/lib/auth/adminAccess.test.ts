import { describe, it, expect } from 'vitest';
import { resolveAdminAccess, shouldRedirectToLogin, canRenderAdmin, isActiveAdmin } from './adminAccess';

const base = { configured: true, loading: false, authenticated: false, isAdmin: false, oauthError: null };

describe('resolveAdminAccess (UI route guard)', () => {
  it('anonymous visitor is blocked from admin (unauthenticated → redirect to login)', () => {
    const state = resolveAdminAccess({ ...base, authenticated: false });
    expect(state).toBe('unauthenticated');
    expect(shouldRedirectToLogin(state)).toBe(true);
    expect(canRenderAdmin(state)).toBe(false);
  });

  it('authenticated NON-admin (signed in with Google, not approved) is blocked', () => {
    const state = resolveAdminAccess({ ...base, authenticated: true, isAdmin: false });
    expect(state).toBe('unauthorized');
    expect(canRenderAdmin(state)).toBe(false);
  });

  it('authorized Google admin is allowed', () => {
    const state = resolveAdminAccess({ ...base, authenticated: true, isAdmin: true });
    expect(state).toBe('authorized');
    expect(canRenderAdmin(state)).toBe(true);
  });

  it('expired session is treated as unauthenticated (redirect to login)', () => {
    // Token refresh failed → no verified session.
    const state = resolveAdminAccess({ ...base, authenticated: false });
    expect(state).toBe('unauthenticated');
    expect(shouldRedirectToLogin(state)).toBe(true);
  });

  it('sign-out removes access (no session → unauthenticated)', () => {
    const afterSignOut = resolveAdminAccess({ ...base, authenticated: false, isAdmin: false });
    expect(canRenderAdmin(afterSignOut)).toBe(false);
    expect(afterSignOut).toBe('unauthenticated');
  });

  it('loading and oauth-error and unconfigured states never render admin', () => {
    expect(resolveAdminAccess({ ...base, loading: true })).toBe('loading');
    expect(resolveAdminAccess({ ...base, oauthError: 'access_denied' })).toBe('oauth_error');
    expect(resolveAdminAccess({ ...base, configured: false })).toBe('unconfigured');
    expect(canRenderAdmin('loading')).toBe(false);
    expect(canRenderAdmin('oauth_error')).toBe(false);
    expect(canRenderAdmin('unconfigured')).toBe(false);
  });
});

describe('isActiveAdmin (server-side edge-function gate)', () => {
  it('rejects when there are no admin rows (missing/invalid JWT or non-admin)', () => {
    expect(isActiveAdmin([])).toBe(false);
    expect(isActiveAdmin(null)).toBe(false);
    expect(isActiveAdmin(undefined)).toBe(false);
  });

  it('rejects a revoked (inactive) admin', () => {
    expect(isActiveAdmin([{ is_active: false }])).toBe(false);
  });

  it('accepts an active authorized admin', () => {
    expect(isActiveAdmin([{ is_active: true }])).toBe(true);
  });
});
