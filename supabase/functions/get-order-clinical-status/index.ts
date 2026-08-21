import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Customer-safe clinical status endpoint (Phase 12H).
 *
 * Authenticated customer JWT required.
 * Reads local order_gen_orders only — does NOT call GEN from the browser path.
 * Actual GEN refresh is admin/server rate-limited via gen-health-sync.
 *
 * Never exposes: API keys, raw PHI, form answers, internal debug payloads.
 */

import {
  buildSafeCustomerClinicalLine,
  createCorrelationId,
} from "../_shared/genHealth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isRxSku(sku: string | null | undefined): boolean {
  if (!sku?.trim()) return false;
  const s = sku.trim().toUpperCase();
  if (s.includes("IPV") || s.includes("FUV") || s.includes("LAB") || s.includes("VISIT")) {
    return false;
  }
  if (s.includes("CASE") || s.includes("ACCESSORY") || s.includes("SERUM")) return false;
  if (s.includes("MEMBER") || s.includes("SUBSCR")) return false;
  return (
    s.startsWith("MBM-WM-") ||
    s.startsWith("MBM-HRT-") ||
    s.startsWith("MBM-LON-") ||
    s.startsWith("MBM-RP-") ||
    s.startsWith("MBM-SH-")
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const correlationId = createCorrelationId("clinical");
  const auth = req.headers.get("Authorization") || "";
  const jwt = auth.replace(/^Bearer\s+/i, "").trim();
  if (!jwt) {
    return json({ error: "authorization_required", correlationId }, 401);
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
    return json({ error: "invalid_session", correlationId }, 401);
  }
  const user = await userRes.json();
  if (!user?.id) return json({ error: "invalid_session", correlationId }, 401);

  let body: { orderId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json", correlationId }, 400);
  }
  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  if (!orderId) {
    return json({ error: "order_id_required", correlationId }, 400);
  }

  const { createClient } = await import("npm:@supabase/supabase-js@2");
  const sb = createClient(supabaseUrl, serviceKey);

  const { data: order, error: orderErr } = await sb
    .from("orders")
    .select(
      "id, customer_user_id, payment_status, order_status, public_order_number, gen_handoff_status",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (orderErr || !order) {
    return json({ error: "order_not_found", correlationId }, 404);
  }
  if (order.customer_user_id !== user.id) {
    return json({ error: "forbidden", correlationId }, 403);
  }

  const [{ data: items }, { data: genRows }] = await Promise.all([
    sb.from("order_items").select("id, sku, product_name_snapshot, fulfillment_sku").eq(
      "order_id",
      orderId,
    ),
    sb.from("order_gen_orders").select(
      "id, order_item_id, mbm_sku, gen_order_id, clinical_status, required_actions_json, pharmacy_status, tracking_number, handoff_status, last_synced_at, prescription_status",
    ).eq("order_id", orderId),
  ]);

  const itemList = (items || []) as Array<{
    id: string;
    sku: string | null;
    product_name_snapshot: string;
    fulfillment_sku: string | null;
  }>;
  const genList = (genRows || []) as Array<Record<string, unknown>>;
  const genByItem = new Map(genList.map((g) => [String(g.order_item_id), g]));

  const lines = itemList.map((item) => {
    const sku = item.fulfillment_sku || item.sku;
    if (!isRxSku(sku)) {
      return {
        orderItemId: item.id,
        mbmSku: sku,
        productName: item.product_name_snapshot,
        isClinical: false as const,
      };
    }
    const g = genByItem.get(item.id);
    const actions = Array.isArray(g?.required_actions_json)
      ? (g!.required_actions_json as Array<Record<string, unknown>>)
      : [];
    const safe = buildSafeCustomerClinicalLine({
      orderItemId: item.id,
      mbmSku: sku,
      productName: item.product_name_snapshot,
      paymentStatus: order.payment_status,
      clinicalStatus: (g?.clinical_status as string) || null,
      requiredActions: actions,
      pharmacyStatusRaw: (g?.pharmacy_status as string) || null,
      trackingNumber: (g?.tracking_number as string) || null,
    });
    return {
      isClinical: true as const,
      ...safe,
      lastSyncedAt: (g?.last_synced_at as string) || null,
      // Never expose gen_order_id internals beyond existence flag for UX
      hasGenOrder: Boolean(g?.gen_order_id),
    };
  });

  return json({
    ok: true,
    correlationId,
    orderId: order.id,
    publicOrderNumber: order.public_order_number,
    paymentStatus: order.payment_status,
    orderStatus: order.order_status,
    genHandoffStatus: order.gen_handoff_status ?? null,
    // Browser must not write clinical status — clients receive read-only snapshot.
    clinicalWritable: false,
    requiredActionsLocallyCompletable: false,
    lines,
  });
});
