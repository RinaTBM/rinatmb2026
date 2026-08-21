/**
 * Server/runtime commerce policy flags (Phase 12F.1).
 * Prefer explicit env vars; never rely on browser hostname alone.
 */

export type CommerceEnvLike = {
  REQUIRE_GEN_MAPPING_FOR_RX?: string;
  /**
   * When true, production Rx checkout may proceed for READY/ACTIVE GEN-mapped SKUs.
   * Distinct from GEN_HEALTH_ENABLED and GEN_API_ORDERS_PAYMENT_STATUS_ENABLED.
   */
  GEN_API_ORDERS_ENABLED?: string;
  /**
   * Phase 12J.0 — temporary single-SKU production checkout allowlist.
   * Exactly one MBM SKU (e.g. MBM-RP-BPC-INJ-001). Empty/unset = no override.
   * Does NOT enable GEN handoff. Does NOT enable other Rx. Remove after live test.
   */
  PRODUCTION_CHECKOUT_TEST_SKU?: string;
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

/**
 * GEN API Orders / external-paid capability for this client.
 * Default false until Scriptful/GEN confirms enablement.
 *
 * Distinct from:
 * - GEN_HEALTH_ENABLED — GEN API integration exists
 * - GEN_API_ORDERS_PAYMENT_STATUS_ENABLED — may send order.payment_status="paid"
 *
 * Production Rx checkout (when REQUIRE_GEN_MAPPING_FOR_RX is on) requires this true
 * in addition to READY/ACTIVE gen_sku_map.
 */
export function resolveGenApiOrdersEnabled(env: CommerceEnvLike = {}): boolean {
  return truthy(env.GEN_API_ORDERS_ENABLED);
}

/**
 * Temporary production live-test allowlist: exactly one SKU string, or null.
 * Rejects comma/space-separated multi-SKU values (fail closed — no broad unlock).
 */
export function resolveProductionCheckoutTestSku(env: CommerceEnvLike = {}): string | null {
  const raw = (env.PRODUCTION_CHECKOUT_TEST_SKU || '').trim().toUpperCase();
  if (!raw) return null;
  if (/[\s,]/.test(raw)) return null;
  if (!raw.startsWith('MBM-')) return null;
  // Never allowlist memberships, shipping, labs, visits, or accessories via this gate.
  if (
    raw.startsWith('MBM-MEM-') ||
    raw.startsWith('MBM-SHIP-') ||
    raw.startsWith('MBM-ACC-') ||
    raw.startsWith('MBM-PC-')
  ) {
    return null;
  }
  return raw;
}

/**
 * True when the cart's prescription medication SKUs are exactly the single allowlisted test SKU.
 * Accessories / shipping may also be present; any other Rx SKU fails closed.
 */
export function isProductionCheckoutTestSkuCart(
  rxSkus: readonly string[],
  env: CommerceEnvLike = {},
): boolean {
  const allowed = resolveProductionCheckoutTestSku(env);
  if (!allowed) return false;
  const unique = [
    ...new Set(
      rxSkus
        .map((s) => (typeof s === 'string' ? s.trim().toUpperCase() : ''))
        .filter(Boolean),
    ),
  ];
  return unique.length === 1 && unique[0] === allowed;
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
