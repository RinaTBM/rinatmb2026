/**
 * Edge mirror of src/lib/commerce/commerceEnvPolicy.ts — keep in sync.
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
   * Exactly one MBM SKU. Empty/unset = no override. Does NOT enable GEN handoff.
   */
  PRODUCTION_CHECKOUT_TEST_SKU?: string;
  MBM_RUNTIME_ENV?: string;
  APP_ENV?: string;
  ENVIRONMENT?: string;
  NODE_ENV?: string;
  SUPABASE_URL?: string;
};

const PRODUCTION_SUPABASE_REF = "bsgtuuzwgeetsjjdrtrm";
const STAGING_SUPABASE_REF = "mxvaxkkwrbwhqasnsjpm";

function truthy(v: string | undefined | null): boolean {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes" || s === "on";
}

function falsy(v: string | undefined | null): boolean {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === "false" || s === "0" || s === "no" || s === "off";
}

function readEnv(env?: CommerceEnvLike): CommerceEnvLike {
  if (env) return env;
  return {
    REQUIRE_GEN_MAPPING_FOR_RX: Deno.env.get("REQUIRE_GEN_MAPPING_FOR_RX") ?? undefined,
    GEN_API_ORDERS_ENABLED: Deno.env.get("GEN_API_ORDERS_ENABLED") ?? undefined,
    PRODUCTION_CHECKOUT_TEST_SKU: Deno.env.get("PRODUCTION_CHECKOUT_TEST_SKU") ?? undefined,
    MBM_RUNTIME_ENV: Deno.env.get("MBM_RUNTIME_ENV") ?? undefined,
    APP_ENV: Deno.env.get("APP_ENV") ?? undefined,
    ENVIRONMENT: Deno.env.get("ENVIRONMENT") ?? undefined,
    SUPABASE_URL: Deno.env.get("SUPABASE_URL") ?? undefined,
  };
}

export function isProductionCommerceRuntime(env?: CommerceEnvLike): boolean {
  const e = readEnv(env);
  const markers = [e.MBM_RUNTIME_ENV, e.APP_ENV, e.ENVIRONMENT]
    .map((v) => (v || "").trim().toLowerCase())
    .filter(Boolean);
  if (markers.some((m) => m === "production" || m === "prod")) return true;
  if (markers.some((m) => m === "staging" || m === "stage" || m === "development" || m === "dev")) {
    return false;
  }
  const url = (e.SUPABASE_URL || "").toLowerCase();
  if (url.includes(PRODUCTION_SUPABASE_REF)) return true;
  if (url.includes(STAGING_SUPABASE_REF)) return false;
  return false;
}

/**
 * Production Rx checkout fail-closed unless GEN mapping READY/ACTIVE.
 * Staging defaults off unless REQUIRE_GEN_MAPPING_FOR_RX=true.
 */
export function resolveRequireGenMappingForRx(env?: CommerceEnvLike): boolean {
  const e = readEnv(env);
  const raw = e.REQUIRE_GEN_MAPPING_FOR_RX;
  if (truthy(raw)) return true;
  if (falsy(raw)) return false;
  return isProductionCommerceRuntime(e);
}

/**
 * GEN API Orders / external-paid capability for this client.
 * Default false until Scriptful/GEN confirms enablement.
 * Distinct from GEN_HEALTH_ENABLED and GEN_API_ORDERS_PAYMENT_STATUS_ENABLED.
 */
export function resolveGenApiOrdersEnabled(env?: CommerceEnvLike): boolean {
  const e = readEnv(env);
  return truthy(e.GEN_API_ORDERS_ENABLED);
}

/**
 * Temporary production live-test allowlist: exactly one SKU string, or null.
 * Rejects comma/space-separated multi-SKU values (fail closed).
 */
export function resolveProductionCheckoutTestSku(env?: CommerceEnvLike): string | null {
  const e = readEnv(env);
  const raw = (e.PRODUCTION_CHECKOUT_TEST_SKU || "").trim().toUpperCase();
  if (!raw) return null;
  if (/[\s,]/.test(raw)) return null;
  if (!raw.startsWith("MBM-")) return null;
  if (
    raw.startsWith("MBM-MEM-") ||
    raw.startsWith("MBM-SHIP-") ||
    raw.startsWith("MBM-ACC-") ||
    raw.startsWith("MBM-PC-")
  ) {
    return null;
  }
  return raw;
}

/**
 * True when Rx SKUs are exactly the single allowlisted test SKU.
 * Payment-only: does not imply GEN handoff or clinical readiness.
 */
export function isProductionCheckoutTestSkuCart(
  rxSkus: readonly string[],
  env?: CommerceEnvLike,
): boolean {
  const allowed = resolveProductionCheckoutTestSku(env);
  if (!allowed) return false;
  const unique = [
    ...new Set(
      rxSkus
        .map((s) => (typeof s === "string" ? s.trim().toUpperCase() : ""))
        .filter(Boolean),
    ),
  ];
  return unique.length === 1 && unique[0] === allowed;
}

export const AUTHORIZED_MBM_SHIPPING_CENTS = Object.freeze([0, 3000, 5000] as const);

export function isAuthorizedMbmShippingCents(cents: number): boolean {
  return (AUTHORIZED_MBM_SHIPPING_CENTS as readonly number[]).includes(Math.round(cents));
}
