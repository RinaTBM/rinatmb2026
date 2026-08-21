import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * GEN Health handoff — LOCAL SCAFFOLD ONLY (Phase 12D).
 * DO NOT DEPLOY until GEN_HEALTH_ENABLED is deliberately enabled in a later phase.
 *
 * Flow (when enabled):
 * 1. Accept MBM order id
 * 2. Confirm GEN_HEALTH_ENABLED
 * 3. Load MBM order; require payment_status=paid + Tagada transaction id
 * 4. Identify Rx order_items; resolve via gen_sku_map (ACTIVE/READY)
 * 5. Create/reuse GEN patient; create GEN order per line (Option A)
 * 6. Persist order_gen_orders; return summary
 *
 * Default: GEN_HEALTH_ENABLED=false → no outbound GEN calls.
 * Tagada webhook is NOT wired in 12D (deferred to 12E).
 */

import {
  createCorrelationId,
  createGenOrder,
  createOrReuseGenPatient,
  formatGenLog,
  planGenHandoff,
  resolveGenHealthConfig,
  resolveGenProductForSku,
  snapshotRequiredActions,
  type GenSkuMapping,
  type HandoffPlanItem,
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

type OrderRow = {
  id: string;
  payment_status: string;
  external_payment_id: string | null;
  customer_email: string;
  customer_name: string;
  customer_user_id: string | null;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  sku: string | null;
  quantity: number;
  product_name_snapshot: string;
};

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = (full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Customer", lastName: "MBM" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "MBM" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** Conservative Rx eligibility — exclude known non-Rx / visit / lab injection SKUs. */
function isPrescriptionEligibleSku(sku: string | null | undefined): boolean {
  if (!sku?.trim()) return false;
  const s = sku.trim().toUpperCase();
  // Visits / labs / accessories stay off GEN med handoff in 12D
  if (s.includes("IPV") || s.includes("FUV") || s.includes("LAB") || s.includes("VISIT")) {
    return false;
  }
  if (s.includes("CASE") || s.includes("ACCESSORY") || s.includes("SERUM")) return false;
  // Membership rebill never creates GEN med orders — membership SKUs skipped here
  if (s.includes("MEMBER") || s.includes("SUBSCR")) return false;
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const correlationId = createCorrelationId("handoff");
  const config = resolveGenHealthConfig();

  if (!config.enabled) {
    console.log(formatGenLog({
      operation: "handoff",
      correlationId,
      safeErrorCode: "GEN_DISABLED",
    }));
    return json({
      ok: false,
      code: "GEN_DISABLED",
      message: "GEN Health integration is disabled (GEN_HEALTH_ENABLED!=true).",
      correlationId,
    }, 503);
  }

  if (!config.apiKey) {
    console.log(formatGenLog({
      operation: "handoff",
      correlationId,
      safeErrorCode: "GEN_MISSING_API_KEY",
    }));
    return json({
      ok: false,
      code: "GEN_MISSING_API_KEY",
      message: "GEN_HEALTH_ENABLED is true but GEN_HEALTH_API_KEY is not configured.",
      correlationId,
    }, 500);
  }

  let body: { orderId?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json", correlationId }, 400);
  }

  const orderId = body.orderId?.trim();
  if (!orderId) {
    return json({ error: "orderId_required", correlationId }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return json({ error: "server_misconfigured", correlationId }, 500);
  }

  // Dynamic import keeps scaffold loadable in unit-test contexts that don't run Deno.serve
  const { createClient } = await import("npm:@supabase/supabase-js@2");
  const sb = createClient(supabaseUrl, serviceKey);

  const { data: order, error: orderErr } = await sb
    .from("orders")
    .select("id, payment_status, external_payment_id, customer_email, customer_name, customer_user_id")
    .eq("id", orderId)
    .maybeSingle();

  if (orderErr || !order) {
    return json({ error: "order_not_found", correlationId }, 404);
  }

  const orderRow = order as OrderRow;
  const tagadaTx = orderRow.external_payment_id;

  if (orderRow.payment_status !== "paid") {
    return json({
      ok: false,
      code: "GEN_HANDOFF_UNPAID",
      message: "Order must be payment_status=paid before GEN handoff",
      correlationId,
      mbmOrderId: orderId,
    }, 409);
  }

  if (!tagadaTx?.trim()) {
    return json({
      ok: false,
      code: "GEN_HANDOFF_MISSING_TX",
      message: "Verified Tagada/external transaction id required",
      correlationId,
      mbmOrderId: orderId,
    }, 409);
  }

  const { data: items, error: itemsErr } = await sb
    .from("order_items")
    .select("id, order_id, sku, quantity, product_name_snapshot")
    .eq("order_id", orderId);

  if (itemsErr) {
    return json({ error: "order_items_load_failed", correlationId }, 500);
  }

  const orderItems = (items || []) as OrderItemRow[];

  const { data: existingLinks } = await sb
    .from("order_gen_orders")
    .select("order_item_id, gen_order_id, handoff_status")
    .eq("order_id", orderId);

  const skus = [...new Set(orderItems.map((i) => i.sku).filter(Boolean))] as string[];
  const { data: mapRows } = skus.length
    ? await sb.from("gen_sku_map").select("*").in("mbm_sku", skus)
    : { data: [] as Record<string, unknown>[] };

  const mappingBySku = new Map<string, GenSkuMapping>();
  for (const row of mapRows || []) {
    const r = row as Record<string, unknown>;
    const mbmSku = String(r.mbm_sku || "");
    mappingBySku.set(mbmSku, {
      mbmSku,
      genClientProductId: (r.gen_client_product_id as string) || null,
      genProductName: (r.gen_product_name as string) || null,
      genMedicationPairingId: (r.gen_medication_pairing_id as string) || null,
      genMedicationName: (r.gen_medication_name as string) || null,
      genPharmacy: (r.gen_pharmacy as string) || null,
      genStrength: (r.gen_strength as string) || null,
      genForm: (r.gen_form as string) || null,
      genPackage: (r.gen_package as string) || null,
      medicationCostCents: (r.medication_cost_cents as number) ?? null,
      shippingCostCents: (r.shipping_cost_cents as number) ?? null,
      mappingStatus: String(r.mapping_status || "BLOCKED"),
      replacesMbmSku: (r.replaces_mbm_sku as string) || null,
      active: Boolean(r.active),
    });
  }

  const plan = planGenHandoff({
    paymentStatus: orderRow.payment_status,
    tagadaTransactionId: tagadaTx,
    items: orderItems.map((i) => ({
      orderItemId: i.id,
      mbmSku: i.sku || "",
      quantity: i.quantity,
      isPrescriptionEligible: isPrescriptionEligibleSku(i.sku),
    })),
    existingLinks: (existingLinks || []).map((l: { order_item_id: string; gen_order_id: string | null; handoff_status?: string }) => ({
      orderItemId: l.order_item_id,
      genOrderId: l.gen_order_id,
      handoffStatus: l.handoff_status,
    })),
    resolveMapping: (sku) => mappingBySku.get(sku) || null,
  });

  if (!plan.ok) {
    return json({ ok: false, code: plan.code, message: plan.message, correlationId }, 409);
  }

  // Ensure / reuse GEN patient (gated — only reached when enabled + key present)
  let genPatientId: string | null = null;
  if (orderRow.customer_user_id) {
    const { data: profile } = await sb
      .from("customer_profiles")
      .select("gen_patient_id")
      .eq("user_id", orderRow.customer_user_id)
      .maybeSingle();
    genPatientId = (profile as { gen_patient_id?: string } | null)?.gen_patient_id || null;
  }

  const needsCreate = plan.items.some((i) => i.action === "create");
  if (needsCreate && !genPatientId) {
    const { firstName, lastName } = splitName(orderRow.customer_name);
    const patientRes = await createOrReuseGenPatient(
      { email: orderRow.customer_email, firstName, lastName },
      { config },
    );
    if (!patientRes.ok) {
      console.log(formatGenLog({
        operation: "create_patient",
        correlationId: patientRes.correlationId,
        mbmOrderId: orderId,
        safeErrorCode: patientRes.error.code,
        httpStatus: patientRes.error.httpStatus,
      }));
      // Payment stays paid — mark retry
      await sb.from("orders").update({
        gen_handoff_status: "RETRY_REQUIRED",
        gen_handoff_last_error: patientRes.error.code,
        gen_handoff_updated_at: new Date().toISOString(),
      }).eq("id", orderId);
      return json({
        ok: false,
        code: patientRes.error.code,
        message: "GEN patient create failed; MBM payment unchanged",
        correlationId: patientRes.correlationId,
        paymentStatusPreserved: "paid",
      }, 502);
    }
    genPatientId = patientRes.data.id;
    if (orderRow.customer_user_id) {
      await sb.from("customer_profiles")
        .update({ gen_patient_id: genPatientId })
        .eq("user_id", orderRow.customer_user_id);
    }
  }

  const results: Array<Record<string, unknown>> = [];

  for (const item of plan.items as HandoffPlanItem[]) {
    if (item.action === "skip_non_rx") {
      results.push({ ...item, status: "skipped_non_rx" });
      continue;
    }
    if (item.action === "skip_already_linked") {
      results.push({ ...item, status: "idempotent_skip" });
      continue;
    }
    if (item.action === "blocked") {
      await sb.from("order_gen_orders").upsert({
        order_id: orderId,
        order_item_id: item.orderItemId,
        mbm_sku: item.mbmSku,
        tagada_transaction_id: tagadaTx,
        handoff_status: "BLOCKED",
        last_error_code: item.code,
        last_error_message_safe: item.message,
        gen_patient_id: genPatientId,
      }, { onConflict: "order_id,order_item_id" });
      results.push({ ...item, status: "blocked" });
      continue;
    }

    // action === create
    if (!genPatientId) {
      results.push({
        orderItemId: item.orderItemId,
        mbmSku: item.mbmSku,
        status: "blocked",
        code: "GEN_PATIENT_REQUIRED",
      });
      continue;
    }

    // Re-check mapping (fail closed)
    const resolved = resolveGenProductForSku(item.mbmSku, mappingBySku.get(item.mbmSku));
    if (!resolved.ok) {
      results.push({ orderItemId: item.orderItemId, status: "blocked", code: resolved.code });
      continue;
    }

    const orderRes = await createGenOrder({
      patientId: genPatientId,
      clientProductId: item.genClientProductId,
      paymentStatus: "paid",
      transactionId: tagadaTx!,
      clientReference: `${orderId}:${item.orderItemId}`,
      quantity: item.quantity,
    }, { config });

    if (!orderRes.ok) {
      const retryable = orderRes.error.retryable !== false;
      await sb.from("order_gen_orders").upsert({
        order_id: orderId,
        order_item_id: item.orderItemId,
        mbm_sku: item.mbmSku,
        gen_patient_id: genPatientId,
        gen_client_product_id: item.genClientProductId,
        tagada_transaction_id: tagadaTx,
        handoff_status: retryable ? "RETRY_REQUIRED" : "FAILED",
        last_error_code: orderRes.error.code,
        last_error_message_safe: orderRes.error.message,
        attempt_count: 1,
      }, { onConflict: "order_id,order_item_id" });

      await sb.from("gen_sync_events").insert({
        order_id: orderId,
        order_item_id: item.orderItemId,
        operation: "create_order",
        attempt: 1,
        status: retryable ? "retry" : "error",
        http_status: orderRes.error.httpStatus ?? null,
        safe_error_code: orderRes.error.code,
        mbm_sku: item.mbmSku,
        tagada_transaction_id: tagadaTx,
        correlation_id: orderRes.correlationId,
      });

      console.log(formatGenLog({
        operation: "create_order",
        correlationId: orderRes.correlationId,
        mbmOrderId: orderId,
        mbmOrderItemId: item.orderItemId,
        mbmSku: item.mbmSku,
        tagadaTransactionId: tagadaTx || undefined,
        safeErrorCode: orderRes.error.code,
        httpStatus: orderRes.error.httpStatus,
      }));

      results.push({
        orderItemId: item.orderItemId,
        mbmSku: item.mbmSku,
        status: "error",
        code: orderRes.error.code,
        paymentStatusPreserved: "paid",
      });
      continue;
    }

    const actions = snapshotRequiredActions(orderRes.data.requiredActions);
    await sb.from("order_gen_orders").upsert({
      order_id: orderId,
      order_item_id: item.orderItemId,
      mbm_sku: item.mbmSku,
      gen_patient_id: genPatientId,
      gen_order_id: orderRes.data.id,
      gen_client_product_id: item.genClientProductId,
      tagada_transaction_id: tagadaTx,
      gen_order_status: orderRes.data.orderStatus ?? null,
      required_actions_json: actions,
      clinical_status: actions.length ? "GEN_ACTION_REQUIRED" : "GEN_ORDER_CREATED",
      handoff_status: actions.length ? "ACTION_REQUIRED" : "ORDER_CREATED",
      attempt_count: 1,
      last_synced_at: new Date().toISOString(),
      last_error_code: null,
      last_error_message_safe: null,
    }, { onConflict: "order_id,order_item_id" });

    await sb.from("gen_sync_events").insert({
      order_id: orderId,
      order_item_id: item.orderItemId,
      gen_order_id: orderRes.data.id,
      operation: "create_order",
      attempt: 1,
      status: "ok",
      http_status: orderRes.httpStatus,
      mbm_sku: item.mbmSku,
      tagada_transaction_id: tagadaTx,
      correlation_id: orderRes.correlationId,
    });

    results.push({
      orderItemId: item.orderItemId,
      mbmSku: item.mbmSku,
      status: "created",
      genOrderId: orderRes.data.id,
      requiredActionsCount: actions.length,
    });
  }

  await sb.from("orders").update({
    gen_handoff_status: "PROCESSED",
    gen_handoff_updated_at: new Date().toISOString(),
  }).eq("id", orderId);

  return json({
    ok: true,
    correlationId,
    mbmOrderId: orderId,
    genPatientId,
    results,
  });
});
