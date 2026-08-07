/**
 * Pure customer-account access decisions (UI route guards + unit tests).
 * Authorization for profile data is enforced by Supabase RLS (user_id = auth.uid()).
 * Admin access remains a separate check against the `admins` table — customer login
 * never grants admin privileges.
 */

export type CustomerAccessState =
  | 'loading'
  | 'unconfigured'
  | 'unauthenticated'
  | 'authenticated';

export interface CustomerSessionSnapshot {
  configured: boolean;
  loading: boolean;
  authenticated: boolean;
}

export function resolveCustomerAccess(s: CustomerSessionSnapshot): CustomerAccessState {
  if (!s.configured) return 'unconfigured';
  if (s.loading) return 'loading';
  if (!s.authenticated) return 'unauthenticated';
  return 'authenticated';
}

/** Anonymous users hitting /account/* (except login/signup/reset/callback) redirect to login. */
export function shouldRedirectCustomerToLogin(state: CustomerAccessState): boolean {
  return state === 'unauthenticated';
}

export function canRenderCustomerAccount(state: CustomerAccessState): boolean {
  return state === 'authenticated';
}

/** Public auth pages that signed-out users may visit. */
export const CUSTOMER_PUBLIC_AUTH_PATHS = new Set([
  '/account/login',
  '/account/signup',
  '/account/auth/callback',
  '/account/reset-password',
]);

export function isCustomerPublicAuthPath(path: string): boolean {
  return CUSTOMER_PUBLIC_AUTH_PATHS.has(path);
}

/**
 * Role separation: customer authentication alone never authorizes admin catalog.
 * Admin requires a separate active `admins` row (isAdmin === true).
 */
export function canAccessAdminCatalog(input: {
  authenticated: boolean;
  isAdmin: boolean;
}): boolean {
  return input.authenticated === true && input.isAdmin === true;
}

/** Fields customers may edit on their profile (never user_id / roles / clinical). */
export const CUSTOMER_PROFILE_EDITABLE_FIELDS = [
  'first_name',
  'last_name',
  'phone',
] as const;

export type CustomerProfileEditableField = (typeof CUSTOMER_PROFILE_EDITABLE_FIELDS)[number];

/** Medical / clinical fields must never appear on customer_profiles. */
export const FORBIDDEN_CUSTOMER_PROFILE_FIELDS = [
  'diagnosis',
  'medical_history',
  'symptoms',
  'prescription',
  'lab_results',
  'provider_notes',
  'clinical_notes',
  'medication_history',
] as const;

export function isAllowedProfileUpdate(patch: Record<string, unknown>): boolean {
  const keys = Object.keys(patch);
  if (keys.length === 0) return false;
  if (keys.some(k => (FORBIDDEN_CUSTOMER_PROFILE_FIELDS as readonly string[]).includes(k))) {
    return false;
  }
  // email / user_id / id changes are not allowed via direct profile update
  if (keys.includes('user_id') || keys.includes('id') || keys.includes('email')) {
    return false;
  }
  return keys.every(k => (CUSTOMER_PROFILE_EDITABLE_FIELDS as readonly string[]).includes(k));
}

export function sanitizeProfileUpdate(patch: Record<string, unknown>): {
  first_name?: string;
  last_name?: string;
  phone?: string | null;
} {
  const out: { first_name?: string; last_name?: string; phone?: string | null } = {};
  if (typeof patch.first_name === 'string') out.first_name = patch.first_name.trim();
  if (typeof patch.last_name === 'string') out.last_name = patch.last_name.trim();
  if (patch.phone === null) out.phone = null;
  else if (typeof patch.phone === 'string') out.phone = patch.phone.trim() || null;
  return out;
}

/** Account portal pages are private — always noindex,nofollow. */
export function accountRobotsMeta(): string {
  return 'noindex, nofollow';
}

export function shouldExcludeFromSitemap(path: string): boolean {
  return path === '/account' || path.startsWith('/account/');
}
