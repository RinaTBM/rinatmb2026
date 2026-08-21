import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Phase 12I.5 — Customer clinical white-label API (staging).
 *
 * Authenticated customer JWT required.
 * Server resolves GEN patient/order ownership — never trust browser patientId/orderId alone.
 * Proxies only safe operations through shared GEN wrapper. Never exposes API keys.
 *
 * Actions:
 * - status: local order_gen_orders snapshot (no GEN HTTP required)
 * - get_forms: GET product forms via GEN (requires GEN_HEALTH_ENABLED)
 * - submit_form: POST form submissions (answers not logged)
 * - list_messages / send_message: conversation wrappers
 *
 * Does NOT enable auto-handoff. Does NOT mark paid. Does NOT toggle API Orders.
 */

import {
  createCorrelationId,
  formatGenLog,
  getGenProductForms,
  listGenConversations,
  sendGenConversationMessage,
  submitGenOrderForm,
  buildSafeCustomerClinicalLine,
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

type Action =
  | "status"
  | "get_forms"
  | "submit_form"
  | "list_messages"
  | "send_message";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const correlationId = createCorrelationId("wl");
  const auth = req.headers.get("Authorization") || "";
  const jwt = auth.replace(/^Bearer\s+/i, "").trim();
  if (!jwt) return json({ error: "authorization_required", correlationId }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceKey || !anonKey) {
    return json({ error: "server_misconfigured", correlationId }, 500);
  }

  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${jwt}`, apikey: anonKey },
  });
  if (!userRes.ok) return json({ error: "invalid_session", correlationId }, 401);
  const user = await userRes.json();
  if (!user?.id) return json({ error: "invalid_session", correlationId }, 401);

  let body: {
    action?: Action;
    orderId?: string;
    orderItemId?: string;
    genProductId?: string;
    formId?: string;
    answers?: Record<string, unknown>;
    conversationId?: string;
    messageBody?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json", correlationId }, 400);
  }

  const action = body.action;
  const orderId = (body.orderId || "").trim();
  if (!action || !orderId) {
    return json({ error: "action_and_orderId_required", correlationId }, 400);
  }

  // Ownership: order must belong to authenticated customer.
  const orderRes = await fetch(
    `${supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=id,customer_user_id,payment_status,public_order_number`,
    {
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
    },
  );
  if (!orderRes.ok) return json({ error: "order_lookup_failed", correlationId }, 500);
  const orders = await orderRes.json();
  const order = Array.isArray(orders) ? orders[0] : null;
  if (!order || order.customer_user_id !== user.id) {
    console.log(formatGenLog({
      operation: "wl_clinical_denied",
      correlationId,
      mbmOrderId: orderId,
      safeErrorCode: "cross_user_denied",
    }));
    return json({ error: "not_found", correlationId }, 404);
  }

  const linksRes = await fetch(
    `${supabaseUrl}/rest/v1/order_gen_orders?order_id=eq.${encodeURIComponent(orderId)}&select=id,order_item_id,gen_order_id,gen_patient_id,clinical_status,required_actions_json,gen_order_status,prescription_status,pharmacy_status,tracking_number,tracking_url,mbm_sku`,
    {
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
    },
  );
  const links = linksRes.ok ? await linksRes.json() : [];
  const linkList = Array.isArray(links) ? links : [];
  const itemLink = body.orderItemId
    ? linkList.find((l: { order_item_id?: string }) => l.order_item_id === body.orderItemId)
    : linkList[0];

  if (action === "status") {
    const lines = linkList.map((g: Record<string, unknown>, idx: number) => {
      const actions = Array.isArray(g.required_actions_json) ? g.required_actions_json : [];
      const orderItemId =
        typeof g.order_item_id === "string" && g.order_item_id
          ? g.order_item_id
          : `line_${idx}`;
      return buildSafeCustomerClinicalLine({
        orderItemId,
        paymentStatus: order.payment_status || "unpaid",
        clinicalStatus: typeof g.clinical_status === "string" ? g.clinical_status : null,
        requiredActions: actions as never[],
        pharmacyStatusRaw: typeof g.pharmacy_status === "string" ? g.pharmacy_status : null,
        trackingNumber: typeof g.tracking_number === "string" ? g.tracking_number : null,
        mbmSku: typeof g.mbm_sku === "string" ? g.mbm_sku : null,
      });
    });
    return json({
      ok: true,
      correlationId,
      paymentStatus: order.payment_status,
      lines,
      genApiOrdersEnabled: Deno.env.get("GEN_API_ORDERS_ENABLED") === "true",
      autoHandoff: false,
    });
  }

  if (action === "get_forms") {
    const productId = (body.genProductId || "").trim();
    if (!productId) return json({ error: "genProductId_required", correlationId }, 400);
    const res = await getGenProductForms(productId, {
      env: Deno.env.toObject(),
    });
    console.log(formatGenLog({
      operation: "wl_get_forms",
      correlationId,
      mbmOrderId: orderId,
      httpStatus: res.ok ? res.httpStatus : res.error.httpStatus,
      safeErrorCode: res.ok ? undefined : res.error.code,
    }));
    if (!res.ok) {
      return json({
        ok: false,
        correlationId,
        error: "forms_unavailable",
        code: res.error.code === "GEN_DISABLED" ? "GEN_API_DISABLED" : "GEN_FORM_FETCH_ERROR",
      }, res.error.code === "GEN_DISABLED" ? 503 : 502);
    }
    return json({ ok: true, correlationId, forms: res.data });
  }

  if (action === "submit_form") {
    const genOrderId = itemLink?.gen_order_id;
    if (!genOrderId || typeof genOrderId !== "string") {
      return json({ error: "gen_order_required", correlationId }, 400);
    }
    const answers = body.answers && typeof body.answers === "object" ? body.answers : null;
    if (!answers) return json({ error: "answers_required", correlationId }, 400);
    const res = await submitGenOrderForm(
      {
        genOrderId,
        formId: body.formId,
        answers: answers as Record<string, unknown>,
      },
      { env: Deno.env.toObject() },
    );
    console.log(formatGenLog({
      operation: "wl_submit_form",
      correlationId,
      mbmOrderId: orderId,
      mbmOrderItemId: body.orderItemId,
      genOrderId,
      httpStatus: res.ok ? res.httpStatus : res.error.httpStatus,
      safeErrorCode: res.ok ? undefined : res.error.code,
    }));
    if (!res.ok) {
      return json({
        ok: false,
        correlationId,
        error: "submit_failed",
        code: "GEN_FORM_SUBMIT_ERROR",
      }, 502);
    }
    return json({ ok: true, correlationId });
  }

  if (action === "list_messages") {
    const patientId = itemLink?.gen_patient_id;
    if (!patientId || typeof patientId !== "string") {
      return json({ ok: true, correlationId, conversations: [] });
    }
    const res = await listGenConversations(
      { patientId },
      { env: Deno.env.toObject() },
    );
    console.log(formatGenLog({
      operation: "wl_list_messages",
      correlationId,
      mbmOrderId: orderId,
      httpStatus: res.ok ? res.httpStatus : res.error.httpStatus,
      safeErrorCode: res.ok ? undefined : res.error.code,
    }));
    if (!res.ok) {
      return json({
        ok: false,
        correlationId,
        error: "messages_unavailable",
        code: "GEN_MESSAGE_ERROR",
      }, 502);
    }
    return json({ ok: true, correlationId, conversations: res.data });
  }

  if (action === "send_message") {
    const conversationId = (body.conversationId || "").trim();
    const messageBody = (body.messageBody || "").trim();
    if (!conversationId || !messageBody) {
      return json({ error: "conversationId_and_message_required", correlationId }, 400);
    }
    const res = await sendGenConversationMessage(
      { conversationId, body: messageBody },
      { env: Deno.env.toObject() },
    );
    console.log(formatGenLog({
      operation: "wl_send_message",
      correlationId,
      mbmOrderId: orderId,
      httpStatus: res.ok ? res.httpStatus : res.error.httpStatus,
      safeErrorCode: res.ok ? undefined : res.error.code,
    }));
    if (!res.ok) {
      return json({
        ok: false,
        correlationId,
        error: "send_failed",
        code: "GEN_MESSAGE_ERROR",
      }, 502);
    }
    return json({ ok: true, correlationId });
  }

  return json({ error: "unknown_action", correlationId }, 400);
});
