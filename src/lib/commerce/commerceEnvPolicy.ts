/**
 * Server/runtime commerce policy flags (Phase 12F.1).
 * Prefer explicit env vars; never rely on browser hostname alone.
 */

export type CommerceEnvLike = {
  REQUIRE_GEN_MAPPING_FOR_RX?: string;
  /** Preferred runtime marker: production | staging | development */
  MBM_RUNTIME_ENV?: string;
  APP_ENV?: string;
  ENVIRONMENT?: string;
  NODE_ENV?: string;
  SUPABASE_URL?: string;
};

const PRODUCTION_SUPABASE_REF = 'bsgtuuzwgeetsjjdrtrm';
const STAGING_SUPABASE_REF = 'mxvaxkkwrbwhqasnsjpm';

function truthy(v: string | undefined | null): boolean {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'on';
}

function falsy(v: string | undefined | null): boolean {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === 'false' || s === '0' || s === 'no' || s === 'off';
}

/**
 * Detect production runtime from server-side config (not browser hostname).
 * Explicit MBM_RUNTIME_ENV / APP_ENV / ENVIRONMENT win; SUPABASE_URL ref is a safety net.
 */
export function isProductionCommerceRuntime(env: CommerceEnvLike = {}): boolean {
  const markers = [env.MBM_RUNTIME_ENV, env.APP_ENV, env.ENVIRONMENT]
    .map((v) => (v || '').trim().toLowerCase())
    .filter(Boolean);
  if (markers.some((m) => m === 'production' || m === 'prod')) return true;
  if (markers.some((m) => m === 'staging' || m === 'stage' || m === 'development' || m === 'dev')) {
    return false;
  }
  const url = (env.SUPABASE_URL || '').toLowerCase();
  if (url.includes(PRODUCTION_SUPABASE_REF)) return true;
  if (url.includes(STAGING_SUPABASE_REF)) return false;
  return false;
}

/**
 * Production Rx checkout must fail closed unless GEN mapping is READY/ACTIVE.
 * Staging/dev defaults false for continued commerce testing during migration.
 * Explicit REQUIRE_GEN_MAPPING_FOR_RX always wins.
 */
export function resolveRequireGenMappingForRx(env: CommerceEnvLike = {}): boolean {
  const raw = env.REQUIRE_GEN_MAPPING_FOR_RX;
  if (truthy(raw)) return true;
  if (falsy(raw)) return false;
  return isProductionCommerceRuntime(env);
}

/** Known MBM-authorized card/invoice shipping amounts (cents). Demo 1156 is never included. */
export const AUTHORIZED_MBM_SHIPPING_CENTS = Object.freeze([0, 3000, 5000] as const);

export function isAuthorizedMbmShippingCents(cents: number): boolean {
  return (AUTHORIZED_MBM_SHIPPING_CENTS as readonly number[]).includes(Math.round(cents));
}

export const COMMERCE_ENV_REFS = {
  stagingSupabaseRef: STAGING_SUPABASE_REF,
  productionSupabaseRef: PRODUCTION_SUPABASE_REF,
} as const;
