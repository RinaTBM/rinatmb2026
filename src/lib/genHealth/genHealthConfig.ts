/**
 * GEN Health V2 — server-side config (Phase 12D scaffolding).
 * Defaults DISABLED. Never use VITE_* or browser secrets.
 */

export const GEN_HEALTH_DEFAULT_BASE_URL = 'https://api.gen-health.app';

export type GenHealthEnv = {
  GEN_HEALTH_ENABLED?: string;
  GEN_HEALTH_BASE_URL?: string;
  GEN_HEALTH_API_KEY?: string;
  GEN_HEALTH_WEBHOOK_SECRET?: string;
  /** When true, post-paid automation may enqueue/execute GEN handoff. Defaults FALSE. */
  GEN_HANDOFF_AUTOMATION_ENABLED?: string;
};

export type GenHealthConfig = {
  enabled: boolean;
  baseUrl: string;
  apiKey: string | null;
  webhookSecret: string | null;
  /** Defaults false — never auto-create GEN orders from Tagada webhook. */
  handoffAutomationEnabled: boolean;
};

function truthy(v: string | undefined | null): boolean {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'on';
}

/**
 * Resolve GEN Health config from an env-like object (Deno.env / process.env / test stub).
 * GEN_HEALTH_ENABLED defaults to FALSE when unset.
 */
export function resolveGenHealthConfig(env: GenHealthEnv = {}): GenHealthConfig {
  const enabled = truthy(env.GEN_HEALTH_ENABLED);
  const baseUrl = (env.GEN_HEALTH_BASE_URL || GEN_HEALTH_DEFAULT_BASE_URL).replace(/\/+$/, '');
  const apiKey = env.GEN_HEALTH_API_KEY?.trim() ? env.GEN_HEALTH_API_KEY.trim() : null;
  const webhookSecret = env.GEN_HEALTH_WEBHOOK_SECRET?.trim()
    ? env.GEN_HEALTH_WEBHOOK_SECRET.trim()
    : null;
  const handoffAutomationEnabled = truthy(env.GEN_HANDOFF_AUTOMATION_ENABLED);
  return { enabled, baseUrl, apiKey, webhookSecret, handoffAutomationEnabled };
}

/**
 * Gate for any outbound GEN HTTP call.
 * Requires enabled flag AND non-empty API key.
 */
export function assertGenHealthCallable(config: GenHealthConfig):
  | { ok: true; config: GenHealthConfig & { apiKey: string } }
  | { ok: false; code: 'GEN_DISABLED' | 'GEN_MISSING_API_KEY'; message: string } {
  if (!config.enabled) {
    return {
      ok: false,
      code: 'GEN_DISABLED',
      message: 'GEN Health integration is disabled (GEN_HEALTH_ENABLED!=true).',
    };
  }
  if (!config.apiKey) {
    return {
      ok: false,
      code: 'GEN_MISSING_API_KEY',
      message: 'GEN_HEALTH_ENABLED is true but GEN_HEALTH_API_KEY is not configured.',
    };
  }
  return { ok: true, config: { ...config, apiKey: config.apiKey } };
}

/** Mapping statuses that allow handoff (fail-closed otherwise). */
export const GEN_SKU_MAP_CALLABLE_STATUSES = ['ACTIVE', 'READY'] as const;
export type GenSkuMapCallableStatus = (typeof GEN_SKU_MAP_CALLABLE_STATUSES)[number];

export function isGenSkuMappingCallable(status: string | null | undefined): boolean {
  return (GEN_SKU_MAP_CALLABLE_STATUSES as readonly string[]).includes(String(status || ''));
}
