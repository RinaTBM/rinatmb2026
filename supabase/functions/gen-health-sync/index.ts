import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * GEN Health clinical status sync / refresh (Phase 12H).
 *
 * Admin-only. GET GEN order → persist authoritative clinical fields.
 * Does NOT create GEN orders, mark paid, or auto-fulfill.
 * Does NOT enable automatic handoff.
 *
 * POST body:
 *   { orderId: string, orderGenOrderId?: string, mode?: "refresh" | "retry" }
 *
 * retry: only re-runs status sync (or idempotent handoff is separate).
 * Never creates duplicate GEN orders — unique (order_id, order_item_id).
 */

import {
  createCorrelationId,
  formatGenLog,
  paymentStatusAfterGenFailure,
  resolveGenHealthConfig,
  syncGenOrder,
} from "../_shared/genHealth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Simple in-memory rate limit per admin+order (best-effort per isolate). */
const lastRefreshAt = new Map<string, number>();
const MIN_REFRESH_INTERVAL_MS = 8_000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const correlationId = createCorrelationId("sync");
  const config = resolveGenHealthConfig();

  const auth = req.headers.get("Authorization") || "";
  const jwt = auth.replace(/^Bearer\s+/i, "").trim();
  if (!jwt) {
    return json({ error: "admin_authorization_required", correlationId }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceKey || !anonKey) {
    return json({ error: "server_misconfigured", correlationId }, 500);
  }

  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${jwt}`, apikey: anonKey },
  });
  if (!userRes.ok) {
    return json({ error: "invalid_admin_session", correlationId }, 401);
  }
  const user = await userRes.json();
  if (!user?.id) return json({ error: "invalid_admin_session", correlationId }, 401);

  const adminRes = await fetch(`${supabaseUrl}/rest/v1/rpc/is_admin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  const isAdmin = adminRes.ok ? await adminRes.json() : false;
  if (isAdmin !== true) {
    return json({ error: "admin_required", correlationId }, 403);
  }

  let body: { orderId?: string; orderGenOrderId?: string; mode?: string } = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json", correlationId }, 400);
  }

  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  if (!orderId) {
    return json({ error: "order_id_required", correlationId }, 400);
  }

  const rateKey = `${user.id}:${orderId}`;
  const now = Date.now();
  const prev = lastRefreshAt.get(rateKey) || 0;
  if (now - prev < MIN_REFRESH_INTERVAL_MS) {
    return json({
      error: "rate_limited",
      correlationId,
      retryAfterMs: MIN_REFRESH_INTERVAL_MS - (now - prev),
    }, 429);
  }
  lastRefreshAt.set(rateKey, now);

  if (!config.enabled) {
    return json({
      ok: false,
      code: "GEN_DISABLED",
      message: "GEN Health integration is disabled.",
      correlationId,
    }, 503);
  }

  const { createClient } = await import("npm:@supabase/supabase-js@2");
  const sb = createClient(supabaseUrl, serviceKey);

  const { data: order, error: orderErr } = await sb
    .from("orders")
    .select("id, payment_status, gen_handoff_status")
    .eq("id", orderId)
    .maybeSingle();
  if (orderErr || !order) {
    return json({ error: "order_not_found", correlationId }, 404);
  }

  let query = sb.from("order_gen_orders").select("*").eq("order_id", orderId);
  if (body.orderGenOrderId) {
    query = query.eq("id", body.orderGenOrderId);
  }
  const { data: rows, error: rowsErr } = await query;
  if (rowsErr) {
    return json({ error: "order_gen_query_failed", correlationId }, 500);
  }
  const links = (rows || []) as Array<Record<string, unknown>>;
  if (links.length === 0) {
    return json({
      ok: false,
      code: "NO_GEN_LINKS",
      message: "No order_gen_orders rows for this order.",
      correlationId,
      paymentStatus: order.payment_status,
    }, 404);
  }

  const results: Array<Record<string, unknown>> = [];

  for (const link of links) {
    const genOrderId = typeof link.gen_order_id === "string" ? link.gen_order_id : null;
    const orderItemId = typeof link.order_item_id === "string" ? link.order_item_id : null;
    const attempt = (typeof link.attempt_count === "number" ? link.attempt_count : 0) + 1;

    if (!genOrderId) {
      // No GEN order yet — mark retry required if paid; never create here.
      const handoff = order.payment_status === "paid" ? "RETRY_REQUIRED" : "PENDING";
      await sb.from("order_gen_orders").update({
        handoff_status: handoff,
        clinical_status: order.payment_status === "paid" ? "GEN_RETRY_REQUIRED" : "GEN_NOT_STARTED",
        last_error_code: "GEN_ORDER_ID_MISSING",
        last_error_message_safe: "No GEN order id yet — use manual handoff, not sync create.",
        attempt_count: attempt,
        updated_at: new Date().toISOString(),
      }).eq("id", link.id);

      await sb.from("gen_sync_events").insert({
        order_id: orderId,
        order_item_id: orderItemId,
        order_gen_order_id: link.id,
        gen_order_id: null,
        operation: body.mode === "retry" ? "admin_retry" : "admin_refresh",
        attempt,
        status: "skipped",
        safe_error_code: "GEN_ORDER_ID_MISSING",
        correlation_id: correlationId,
      });

      results.push({
        orderGenOrderId: link.id,
        orderItemId,
        skipped: true,
        code: "GEN_ORDER_ID_MISSING",
        clinicalStatus: order.payment_status === "paid" ? "GEN_RETRY_REQUIRED" : "GEN_NOT_STARTED",
      });
      continue;
    }

    console.log(formatGenLog({
      operation: "get_order",
      correlationId,
      mbmOrderId: orderId,
      mbmOrderItemId: orderItemId || undefined,
      genOrderId,
      attempt,
    }));

    const sync = await syncGenOrder(genOrderId, { config });
    if (!sync.ok) {
      const retryable = sync.error.retryable !== false;
      const clinical = retryable ? "GEN_RETRY_REQUIRED" : "GEN_ERROR";
      console.log(formatGenLog({
        operation: "get_order",
        correlationId: sync.correlationId,
        mbmOrderId: orderId,
        mbmOrderItemId: orderItemId || undefined,
        genOrderId,
        attempt,
        httpStatus: sync.error.httpStatus,
        safeErrorCode: sync.error.code,
      }));

      await sb.from("order_gen_orders").update({
        clinical_status: clinical,
        handoff_status: retryable ? "RETRY_REQUIRED" : "FAILED",
        last_error_code: sync.error.code,
        last_error_message_safe: sync.error.message?.slice(0, 240) || sync.error.code,
        attempt_count: attempt,
        updated_at: new Date().toISOString(),
      }).eq("id", link.id);

      await sb.from("gen_sync_events").insert({
        order_id: orderId,
        order_item_id: orderItemId,
        order_gen_order_id: link.id,
        gen_order_id: genOrderId,
        operation: body.mode === "retry" ? "admin_retry" : "admin_refresh",
        attempt,
        status: "error",
        http_status: sync.error.httpStatus ?? null,
        safe_error_code: sync.error.code,
        correlation_id: sync.correlationId,
      });

      // Preserve payment — never reverse on GEN sync failure.
      void paymentStatusAfterGenFailure;

      results.push({
        orderGenOrderId: link.id,
        orderItemId,
        genOrderId,
        ok: false,
        clinicalStatus: clinical,
        code: sync.error.code,
        paymentStatusPreserved: order.payment_status,
      });
      continue;
    }

    const patch = sync.patch;
    const handoffStatus = patch.clinicalStatus === "GEN_ACTION_REQUIRED"
      ? "ACTION_REQUIRED"
      : patch.clinicalStatus === "GEN_DENIED"
      ? "BLOCKED"
      : patch.clinicalStatus === "GEN_RETRY_REQUIRED" || patch.clinicalStatus === "GEN_ERROR"
      ? "RETRY_REQUIRED"
      : "SYNCED";

    await sb.from("order_gen_orders").update({
      gen_order_status: patch.genOrderStatus,
      clinical_status: patch.clinicalStatus,
      required_actions_json: patch.requiredActionsJson,
      last_synced_at: patch.lastSyncedAt,
      gen_prescription_id: patch.genPrescriptionId ?? null,
      prescription_status: patch.prescriptionStatus ?? null,
      last_prescription_sync_at: patch.lastPrescriptionSyncAt ?? null,
      pharmacy_status: patch.pharmacyStatus ?? null,
      tracking_number: patch.trackingNumber ?? null,
      handoff_status: handoffStatus,
      last_error_code: null,
      last_error_message_safe: null,
      attempt_count: attempt,
      updated_at: new Date().toISOString(),
    }).eq("id", link.id);

    await sb.from("gen_sync_events").insert({
      order_id: orderId,
      order_item_id: orderItemId,
      order_gen_order_id: link.id,
      gen_order_id: genOrderId,
      operation: body.mode === "retry" ? "admin_retry" : "admin_refresh",
      attempt,
      status: "ok",
      http_status: sync.httpStatus,
      correlation_id: sync.correlationId,
    });

    results.push({
      orderGenOrderId: link.id,
      orderItemId,
      genOrderId,
      ok: true,
      clinicalStatus: patch.clinicalStatus,
      genOrderStatus: patch.genOrderStatus,
      requiredActionCount: patch.requiredActionsJson.length,
      pharmacyStatus: patch.pharmacyStatus ?? null,
      prescriptionStatus: patch.prescriptionStatus ?? null,
      lastSyncedAt: patch.lastSyncedAt,
    });
  }

  // Rollup on orders — operational only; does not touch payment_status.
  const worst = results.some((r) => r.clinicalStatus === "GEN_DENIED")
    ? "GEN_DENIED"
    : results.some((r) =>
      r.clinicalStatus === "GEN_RETRY_REQUIRED" || r.clinicalStatus === "GEN_ERROR" || r.skipped
    )
    ? "RETRY_REQUIRED"
    : results.some((r) => r.clinicalStatus === "GEN_ACTION_REQUIRED")
    ? "ACTION_REQUIRED"
    : "SYNCED";

  await sb.from("orders").update({
    gen_handoff_status: worst,
    gen_handoff_updated_at: new Date().toISOString(),
  }).eq("id", orderId);

  return json({
    ok: true,
    correlationId,
    orderId,
    paymentStatus: order.payment_status,
    paymentUnchanged: true,
    results,
  });
});
