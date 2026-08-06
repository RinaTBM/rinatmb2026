// Pure admin-access decision logic — shared by the admin route guard and unit tests.
// Authorization is NEVER a frontend email comparison: the UI decides what to render from
// a Supabase-verified session + an `admins` row lookup (RLS-enforced), and the server
// independently re-verifies. This module only maps those inputs to a UI state.

export type AdminAccessState =
  | 'loading'
  | 'unconfigured'
  | 'oauth_error'
  | 'unauthenticated'
  | 'unauthorized'
  | 'authorized';

export interface SessionSnapshot {
  /** Supabase client is configured (Bolt-connected). */
  configured: boolean;
  /** Session/authorization still resolving. */
  loading: boolean;
  /** A verified Supabase session exists (email verified by the OAuth provider). */
  authenticated: boolean;
  /** The verified user is an active admin (from the `admins` table via RLS). */
  isAdmin: boolean;
  /** An OAuth error surfaced on the callback (e.g. access_denied). */
  oauthError?: string | null;
}

export function resolveAdminAccess(s: SessionSnapshot): AdminAccessState {
  if (s.oauthError) return 'oauth_error';
  if (!s.configured) return 'unconfigured';
  if (s.loading) return 'loading';
  if (!s.authenticated) return 'unauthenticated'; // anonymous OR expired session
  if (!s.isAdmin) return 'unauthorized';           // signed in with Google but not approved
  return 'authorized';
}

/** Should an unauthenticated visitor on a protected admin route be redirected to /admin/login? */
export function shouldRedirectToLogin(state: AdminAccessState): boolean {
  return state === 'unauthenticated';
}

/** Only the 'authorized' state may render the admin interface. */
export function canRenderAdmin(state: AdminAccessState): boolean {
  return state === 'authorized';
}

/**
 * Server-side decision: given the `admins` rows returned for the caller's verified user id,
 * is the caller an ACTIVE admin? Empty/missing rows (no admin, or no/invalid JWT so no rows)
 * → false. Revoked admins (is_active === false) → false.
 */
export function isActiveAdmin(rows: Array<{ is_active?: boolean }> | null | undefined): boolean {
  return Array.isArray(rows) && rows.length > 0 && rows.every(r => r.is_active === true);
}
