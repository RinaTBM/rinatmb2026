import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * GEN Health webhook receiver — LOCAL SCAFFOLD ONLY (Phase 12D).
 * DO NOT DEPLOY until GEN webhook signature specification is confirmed.
 *
 * Architecture:
 * 1. Receive GEN webhook
 * 2. Verify signature (FAIL CLOSED — stub until documented)
 * 3. Persist event / replay identity
 * 4. Do not trust payload as clinical SoT
 * 5. Extract GEN order id → GET order → persist authoritative status
 *
 * Signature verification: TBD / unsupported until documented.
 * This function REJECTS all events until verification is implemented.
 */

import {
  createCorrelationId,
  formatGenLog,
  hashWebhookBodyForReplay,
  resolveGenHealthConfig,
  syncGenOrder,
  verifyGenWebhookSignature,
} from "../_shared/genHealth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey, X-Gen-Signature, X-Signature",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function extractGenOrderId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const r = payload as Record<string, unknown>;
  const candidates = [
    r.orderId,
    r.order_id,
    r.genOrderId,
    r.gen_order_id,
    (r.data as Record<string, unknown> | undefined)?.orderId,
    (r.data as Record<string, unknown> | undefined)?.order_id,
    (r.order as Record<string, unknown> | undefined)?.id,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return null;
}

function extractExternalEventId(payload: unknown, headers: Headers): string | null {
  const headerId = headers.get("X-Event-Id") || headers.get("X-Gen-Event-Id");
  if (headerId?.trim()) return headerId.trim();
  if (!payload || typeof payload !== "object") return null;
  const r = payload as Record<string, unknown>;
  for (const k of ["id", "eventId", "event_id", "eventID"]) {
    const v = r[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const correlationId = createCorrelationId("webhook");
  const config = resolveGenHealthConfig();
  const rawBody = await req.text();

  const signatureHeader =
    req.headers.get("X-Gen-Signature") ||
    req.headers.get("X-Signature") ||
    req.headers.get("X-GEN-Signature");

  // FAIL CLOSED — do not invent verification details
  const verify = verifyGenWebhookSignature({
    rawBody,
    signatureHeader,
    secret: config.webhookSecret,
  });

  if (!verify.ok) {
    console.log(formatGenLog({
      operation: "webhook_sync",
      correlationId,
      safeErrorCode: verify.code,
    }));

    // Persist rejection for audit when DB available (best-effort)
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (supabaseUrl && serviceKey) {
        const { createClient } = await import("npm:@supabase/supabase-js@2");
        const sb = createClient(supabaseUrl, serviceKey);
        const contentHash = await hashWebhookBodyForReplay(rawBody);
        let parsed: unknown = null;
        try {
          parsed = JSON.parse(rawBody);
        } catch {
          parsed = null;
        }
        await sb.from("gen_webhook_events").upsert({
          external_event_id: extractExternalEventId(parsed, req.headers),
          content_hash: contentHash,
          event_type: typeof (parsed as { type?: string } | null)?.type === "string"
            ? (parsed as { type: string }).type
            : null,
          gen_order_id: extractGenOrderId(parsed),
          signature_verified: false,
          signature_verify_result: verify.code,
          processing_status: "rejected",
          safe_error: verify.message,
          received_at: new Date().toISOString(),
        }, { onConflict: "content_hash", ignoreDuplicates: true });
      }
    } catch {
      // Best-effort audit only
    }

    return json({
      ok: false,
      code: verify.code,
      message: verify.message,
      correlationId,
    }, 401);
  }

  // Unreachable until verifyGenWebhookSignature is implemented with a real ok:true path.
  // Kept for structural completeness of the GET-as-SoT flow.
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return json({ error: "invalid_json", correlationId }, 400);
  }

  const genOrderId = extractGenOrderId(parsed);
  if (!genOrderId) {
    return json({ error: "gen_order_id_missing", correlationId }, 400);
  }

  if (!config.enabled) {
    return json({
      ok: false,
      code: "GEN_DISABLED",
      message: "Webhook accepted structurally but GEN_HEALTH_ENABLED=false — no GET sync",
      correlationId,
    }, 503);
  }

  const sync = await syncGenOrder(genOrderId, { config });
  if (!sync.ok) {
    console.log(formatGenLog({
      operation: "get_order",
      correlationId: sync.correlationId,
      genOrderId,
      safeErrorCode: sync.error.code,
      httpStatus: sync.error.httpStatus,
    }));
    return json({
      ok: false,
      code: sync.error.code,
      correlationId: sync.correlationId,
    }, 502);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return json({ error: "server_misconfigured", correlationId }, 500);
  }

  const { createClient } = await import("npm:@supabase/supabase-js@2");
  const sb = createClient(supabaseUrl, serviceKey);

  await sb.from("order_gen_orders").update({
    gen_order_status: sync.patch.genOrderStatus,
    clinical_status: sync.patch.clinicalStatus,
    required_actions_json: sync.patch.requiredActionsJson,
    last_synced_at: sync.patch.lastSyncedAt,
    handoff_status: sync.patch.clinicalStatus === "GEN_ACTION_REQUIRED"
      ? "ACTION_REQUIRED"
      : "SYNCED",
  }).eq("gen_order_id", genOrderId);

  await sb.from("gen_sync_events").insert({
    gen_order_id: genOrderId,
    operation: "webhook_sync",
    attempt: 1,
    status: "ok",
    http_status: sync.httpStatus,
    correlation_id: sync.correlationId,
  });

  const contentHash = await hashWebhookBodyForReplay(rawBody);
  await sb.from("gen_webhook_events").upsert({
    external_event_id: extractExternalEventId(parsed, req.headers),
    content_hash: contentHash,
    event_type: typeof (parsed as { type?: string }).type === "string"
      ? (parsed as { type: string }).type
      : null,
    gen_order_id: genOrderId,
    signature_verified: true,
    signature_verify_result: "ok",
    processing_status: "processed",
    processed_at: new Date().toISOString(),
  }, { onConflict: "content_hash" });

  return json({
    ok: true,
    correlationId: sync.correlationId,
    genOrderId,
    clinicalStatus: sync.patch.clinicalStatus,
  });
});
