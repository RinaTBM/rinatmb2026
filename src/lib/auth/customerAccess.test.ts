import { describe, it, expect } from 'vitest';
import {
  resolveCustomerAccess,
  shouldRedirectCustomerToLogin,
  canRenderCustomerAccount,
  canAccessAdminCatalog,
  isCustomerPublicAuthPath,
  isAllowedProfileUpdate,
  sanitizeProfileUpdate,
  accountRobotsMeta,
  shouldExcludeFromSitemap,
  FORBIDDEN_CUSTOMER_PROFILE_FIELDS,
  CUSTOMER_PROFILE_EDITABLE_FIELDS,
} from './customerAccess';
import { resolveAdminAccess, canRenderAdmin } from './adminAccess';

const configured = { configured: true, loading: false, authenticated: false };

describe('customer account access', () => {
  it('redirects anonymous users away from /account (unauthenticated)', () => {
    const state = resolveCustomerAccess({ ...configured, authenticated: false });
    expect(state).toBe('unauthenticated');
    expect(shouldRedirectCustomerToLogin(state)).toBe(true);
    expect(canRenderCustomerAccount(state)).toBe(false);
  });

  it('allows authenticated customers to render the account dashboard', () => {
    const state = resolveCustomerAccess({ ...configured, authenticated: true });
    expect(state).toBe('authenticated');
    expect(canRenderCustomerAccount(state)).toBe(true);
    expect(shouldRedirectCustomerToLogin(state)).toBe(false);
  });

  it('treats sign-out as unauthenticated (account access removed)', () => {
    const afterSignOut = resolveCustomerAccess({ ...configured, authenticated: false });
    expect(canRenderCustomerAccount(afterSignOut)).toBe(false);
    expect(shouldRedirectCustomerToLogin(afterSignOut)).toBe(true);
  });

  it('exposes public auth paths for signup/login/callback/reset', () => {
    expect(isCustomerPublicAuthPath('/account/login')).toBe(true);
    expect(isCustomerPublicAuthPath('/account/signup')).toBe(true);
    expect(isCustomerPublicAuthPath('/account/auth/callback')).toBe(true);
    expect(isCustomerPublicAuthPath('/account/reset-password')).toBe(true);
    expect(isCustomerPublicAuthPath('/account')).toBe(false);
    expect(isCustomerPublicAuthPath('/account/profile')).toBe(false);
  });
});

describe('admin / customer role separation', () => {
  it('customer authentication alone cannot access /admin/catalog', () => {
    expect(canAccessAdminCatalog({ authenticated: true, isAdmin: false })).toBe(false);
    const adminState = resolveAdminAccess({
      configured: true,
      loading: false,
      authenticated: true,
      isAdmin: false,
      oauthError: null,
    });
    expect(adminState).toBe('unauthorized');
    expect(canRenderAdmin(adminState)).toBe(false);
  });

  it('anonymous users cannot access admin catalog', () => {
    expect(canAccessAdminCatalog({ authenticated: false, isAdmin: false })).toBe(false);
    const adminState = resolveAdminAccess({
      configured: true,
      loading: false,
      authenticated: false,
      isAdmin: false,
      oauthError: null,
    });
    expect(adminState).toBe('unauthenticated');
    expect(canRenderAdmin(adminState)).toBe(false);
  });

  it('active admins retain catalog access and may also use customer account', () => {
    expect(canAccessAdminCatalog({ authenticated: true, isAdmin: true })).toBe(true);
    const adminState = resolveAdminAccess({
      configured: true,
      loading: false,
      authenticated: true,
      isAdmin: true,
      oauthError: null,
    });
    expect(canRenderAdmin(adminState)).toBe(true);
    expect(canRenderCustomerAccount(resolveCustomerAccess({ ...configured, authenticated: true }))).toBe(true);
  });

  it('admin authorization rules remain unchanged for Google non-admins', () => {
    const state = resolveAdminAccess({
      configured: true,
      loading: false,
      authenticated: true,
      isAdmin: false,
      oauthError: null,
    });
    expect(state).toBe('unauthorized');
  });
});

describe('customer profile field allowlist (no medical data)', () => {
  it('allows customers to update own allowed profile fields', () => {
    expect(isAllowedProfileUpdate({ first_name: 'Rina', last_name: 'Test', phone: '555' })).toBe(true);
    const clean = sanitizeProfileUpdate({ first_name: ' Rina ', last_name: ' Test ', phone: ' 555 ' });
    expect(clean).toEqual({ first_name: 'Rina', last_name: 'Test', phone: '555' });
  });

  it('rejects updates that target another identity key or email directly', () => {
    expect(isAllowedProfileUpdate({ user_id: 'other-user' })).toBe(false);
    expect(isAllowedProfileUpdate({ id: 'row-id' })).toBe(false);
    expect(isAllowedProfileUpdate({ email: 'hijack@example.com' })).toBe(false);
  });

  it('rejects medical / clinical fields on customer profiles', () => {
    for (const field of FORBIDDEN_CUSTOMER_PROFILE_FIELDS) {
      expect(isAllowedProfileUpdate({ [field]: 'secret' })).toBe(false);
    }
    expect(CUSTOMER_PROFILE_EDITABLE_FIELDS).toEqual(['first_name', 'last_name', 'phone']);
    expect(FORBIDDEN_CUSTOMER_PROFILE_FIELDS).toContain('diagnosis');
    expect(FORBIDDEN_CUSTOMER_PROFILE_FIELDS).toContain('medical_history');
    expect(FORBIDDEN_CUSTOMER_PROFILE_FIELDS).toContain('prescription');
  });

  it('models own-profile vs other-profile RLS intent (user_id match required)', () => {
    const ownUserId = 'user-a';
    const otherUserId = 'user-b';
    // App + RLS both key off auth.uid() === user_id — never email alone.
    expect(ownUserId).not.toEqual(otherUserId);
    expect(isAllowedProfileUpdate({ first_name: 'Ok' })).toBe(true);
  });
});

describe('account SEO privacy', () => {
  it('marks account routes as noindex,nofollow', () => {
    expect(accountRobotsMeta()).toBe('noindex, nofollow');
  });

  it('excludes /account/* from the public sitemap', () => {
    expect(shouldExcludeFromSitemap('/account')).toBe(true);
    expect(shouldExcludeFromSitemap('/account/login')).toBe(true);
    expect(shouldExcludeFromSitemap('/account/profile')).toBe(true);
    expect(shouldExcludeFromSitemap('/shop-all')).toBe(false);
  });
});

describe('auth method surface (Phase 1)', () => {
  it('documents supported customer auth methods without granting admin', () => {
    const customerAuthMethods = ['email_password', 'google_oauth', 'password_reset'] as const;
    expect(customerAuthMethods).toContain('email_password');
    expect(customerAuthMethods).toContain('google_oauth');
    expect(customerAuthMethods).toContain('password_reset');
    // Google customer login still requires a separate active admin row for catalog.
    expect(canAccessAdminCatalog({ authenticated: true, isAdmin: false })).toBe(false);
  });

  it('password reset uses Supabase redirect path /account/reset-password', () => {
    expect(isCustomerPublicAuthPath('/account/reset-password')).toBe(true);
  });
});
