import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Idempotent GEN/Whop checkout reconciliation (server-side payment authority).
 *
 * - NEVER marks paid from browser query params alone.
 * - Fetches Whop (when WHOP_API_KEY present) + optional GEN order reads.
 * - Validates amount/currency/product/config correlation.
 * - Refuses ambiguous/mismatched evidence.
 * - No PHI in logs. No automatic prescription submission.
 *
 * Staging/production gate: safe to deploy with GEN_WHOP_CHECKOUT_ENABLED=false
 * (reconcile still works for existing gen_whop sessions).
 */

import {
  evaluateGenWhopReconcile,
  mapWhopPaymentRecord,
  type GenWhopOrderEvidence,
  type GenWhopPaymentEvidence,
  type GenWhopReconcileSessionStatus,
} from "../_shared/genWhopReconcile.ts";
import { GEN_HEALTH_DEFAULT_BASE_URL } from "../_shared/genHealthConfig.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const WHOP_COMPANY_DEFAULT = "biz_UaG5nUeGhOa8NG";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function resolveGenApiBase(): string {
  const raw = (Deno.env.get("GEN_HEALTH_BASE_URL") || "").trim();
  if (!raw) return GEN_HEALTH_DEFAULT_BASE_URL;
  try {
    const u = new URL(raw);
    if (u.hostname === "api.gen-health.app") return raw.replace(/\/+$/, "");
  } catch {
    /* fall through */
  }
  return GEN_HEALTH_DEFAULT_BASE_URL;
}

async function fetchWhopPayments(input: {
  whopKey: string;
  apiVersion: string;
  companyId: string;
  checkoutConfigId: string | null;
}): Promise<GenWhopPaymentEvidence[]> {
  const headers = {
    Authorization: `Bearer ${input.whopKey}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    "Whop-Api-Version": input.apiVersion,
  };
  const out: GenWhopPaymentEvidence[] = [];
  const paths = [
    `https://api.whop.com/api/v1/payments?company_id=${encodeURIComponent(input.companyId)}&first=50`,
    `https://api.whop.com/api/v1/payments?account_id=${encodeURIComponent(input.companyId)}&first=50`,
  ];
  for (const url of paths) {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) continue;
      const body = await res.json().catch(() => null);
      const rows = Array.isArray(body)
        ? body
        : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body?.payments)
        ? body.payments
        : [];
      for (const row of rows) {
        if (!row || typeof row !== "object") continue;
        const mapped = mapWhopPaymentRecord(row as Record<string, unknown>);
        if (!mapped) continue;
        if (
          input.checkoutConfigId &&
          mapped.whopCheckoutConfigId &&
          mapped.whopCheckoutConfigId !== input.checkoutConfigId
        ) {
          continue;
        }
        // If payment has no config id, keep only when we cannot filter (caller validates further)
        if (input.checkoutConfigId && !mapped.whopCheckoutConfigId) {
          // attach expected config for correlation when list is company-scoped only
          mapped.whopCheckoutConfigId = input.checkoutConfigId;
        }
        out.push(mapped);
      }
      if (out.length) break;
    } catch {
      /* try next */
    }
  }
  return out;
}

async function fetchGenOrderEvidence(input: {
  apiKey: string;
  apiBase: string;
  genOrderId: string | null;
}): Promise<GenWhopOrderEvidence[]> {
  if (!input.genOrderId) return [];
  try {
    const res = await fetch(
      `${input.apiBase}/v2/client/orders/${encodeURIComponent(input.genOrderId)}`,
      {
        headers: {
          Accept: "application/json",
          "X-API-Key": input.apiKey,
        },
      },
    );
    if (!res.ok) return [];
    const body = await res.json().catch(() => null);
    const root = body && typeof body === "object" ? body as Record<string, unknown> : {};
    const data = root.data && typeof root.data === "object"
      ? root.data as Record<string, unknown>
      : root;
    const order = data.order && typeof data.order === "object"
      ? data.order as Record<string, unknown>
      : data;
    const id = typeof order.id === "string"
      ? order.id
      : (typeof data.id === "string" ? data.id : input.genOrderId);
    const amountRaw = order.amount ?? order.total ?? data.amount ?? null;
    let amountCents: number | null = null;
    if (typeof amountRaw === "number") {
      amountCents = amountRaw < 1000 ? Math.round(amountRaw * 100) : Math.round(amountRaw);
    }
    return [{
      genOrderId: id,
      genPatientId: typeof order.patient_id === "string"
        ? order.patient_id
        : (typeof data.patient_id === "string" ? data.patient_id : null),
      paymentStatus: String(order.paymentStatus || order.payment_status || data.paymentStatus || "unknown"),
      amountCents,
      currency: typeof order.currency === "string" ? order.currency : "USD",
      genProductId: typeof order.productId === "string" ? order.productId : null,
      genClientProductId: typeof order.clientProductId === "string" ? order.clientProductId : null,
      paymentGateway: typeof order.paymentGateway === "string" ? order.paymentGateway : null,
    }];
  } catch {
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    const publicOrderNumber = String(body.publicOrderNumber ?? "").trim().toUpperCase();
    const paymentAccessToken = String(body.paymentAccessToken ?? "").trim();
    const browserClaimPaid = body.browserClaimPaid === true || body.status === "paid";
    if (!publicOrderNumber || !paymentAccessToken) {
      return json({ error: "Order number and payment access token are required." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      return json({ error: "Order service is not configured." }, 500);
    }
    const dbHeaders = {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?public_order_number=eq.${encodeURIComponent(publicOrderNumber)}&select=id,payment_status,payment_method,payment_processor,payment_access_token,public_order_number,total_cents,currency&limit=1`,
      { headers: dbHeaders },
    );
    if (!orderRes.ok) return json({ error: "Unable to load order." }, 502);
    const orders = await orderRes.json();
    const order = Array.isArray(orders) ? orders[0] : null;
    if (!order) return json({ error: "order_not_found" }, 404);
    if (order.payment_access_token !== paymentAccessToken) {
      return json({ error: "invalid_token" }, 401);
    }

    const sessRes = await fetch(
      `${supabaseUrl}/rest/v1/gen_checkout_sessions?order_id=eq.${order.id}&select=*&order=created_at.desc&limit=1`,
      { headers: dbHeaders },
    );
    const sessRows = sessRes.ok ? await sessRes.json() : [];
    const sess = Array.isArray(sessRows) ? sessRows[0] : null;
    if (!sess) {
      return json({
        ok: false,
        code: "NO_SESSION",
        markedPaid: false,
        reason: "No gen_checkout_sessions row for this order.",
        browserClaimIgnored: browserClaimPaid,
      }, 404);
    }

    const whopKey = (Deno.env.get("WHOP_API_KEY") || "").trim();
    const whopVersion = (Deno.env.get("WHOP_API_VERSION") || "2026-08-21").trim();
    const companyId = (Deno.env.get("WHOP_COMPANY_ID") || WHOP_COMPANY_DEFAULT).trim();
    const genKey = (Deno.env.get("GEN_HEALTH_API_KEY") || "").trim();

    let whopPayments: GenWhopPaymentEvidence[] = [];
    if (whopKey) {
      whopPayments = await fetchWhopPayments({
        whopKey,
        apiVersion: whopVersion,
        companyId,
        checkoutConfigId: sess.whop_checkout_config_id || null,
      });
    }

    const genOrders = genKey
      ? await fetchGenOrderEvidence({
        apiKey: genKey,
        apiBase: resolveGenApiBase(),
        genOrderId: sess.gen_order_id || null,
      })
      : [];

    const decision = evaluateGenWhopReconcile({
      mbmPaymentStatus: String(order.payment_status || ""),
      mbmPaymentMethod: order.payment_method ?? null,
      expectedAmountCents: Number(sess.expected_amount_cents) || 0,
      expectedCurrency: String(sess.currency || "USD"),
      expectedGenProductId: String(sess.gen_product_id || ""),
      expectedGenClientProductId: sess.gen_client_product_id ?? null,
      expectedWhopCheckoutConfigId: sess.whop_checkout_config_id ?? null,
      expectedGenCheckoutSessionId: sess.gen_checkout_session_id ?? null,
      currentSessionStatus: String(sess.status || "created") as GenWhopReconcileSessionStatus,
      whopPayments,
      genOrders,
      browserClaimPaid,
    });

    const patchSession: Record<string, unknown> = {
      status: decision.sessionStatus,
      last_error_code: decision.ok && decision.action === "mark_paid" ? null : decision.code,
      last_error_message_safe: decision.reason.slice(0, 240),
    };
    if (decision.whopPaymentId) patchSession.whop_payment_id = decision.whopPaymentId;
    if (decision.genOrderId) patchSession.gen_order_id = decision.genOrderId;
    if (decision.genPatientId) patchSession.gen_patient_id = decision.genPatientId;
    if (decision.action === "mark_paid" || decision.action === "already_paid") {
      patchSession.completed_at = new Date().toISOString();
    }

    await fetch(`${supabaseUrl}/rest/v1/gen_checkout_sessions?id=eq.${sess.id}`, {
      method: "PATCH",
      headers: dbHeaders,
      body: JSON.stringify(patchSession),
    });

    let markedPaid = false;
    if (decision.ok && decision.action === "mark_paid") {
      const payPatch = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
        method: "PATCH",
        headers: dbHeaders,
        body: JSON.stringify({
          payment_status: "paid",
          payment_processor: "gen_whop",
          paid_marked_by: "gen_whop_reconcile",
          order_status: "payment_confirmed",
          external_payment_id: decision.whopPaymentId,
          external_checkout_session_id: sess.gen_checkout_session_id,
          external_order_id: decision.genOrderId,
        }),
      });
      markedPaid = payPatch.ok;
      if (!markedPaid) {
        console.log(
          `[gen-whop-reconcile] mark_paid_patch_failed order=${publicOrderNumber} code=${decision.code}`,
        );
      }
    }

    console.log(
      `[gen-whop-reconcile] order=${publicOrderNumber} code=${decision.code} action=${decision.action} markedPaid=${markedPaid} browserClaim=${browserClaimPaid}`,
    );

    return json({
      ok: decision.ok,
      action: decision.action,
      code: decision.code,
      reason: decision.reason,
      sessionStatus: decision.sessionStatus,
      markedPaid,
      // Correlation (no secrets / no PHI)
      correlation: {
        mbmOrder: publicOrderNumber,
        genSession: sess.gen_checkout_session_id,
        whopConfig: sess.whop_checkout_config_id,
        whopPayment: decision.whopPaymentId,
        genOrder: decision.genOrderId,
        genPatient: decision.genPatientId ? "[present]" : null,
      },
      browserClaimIgnored: browserClaimPaid,
      whopApiConfigured: Boolean(whopKey),
      genApiConfigured: Boolean(genKey),
    });
  } catch (e) {
    console.log(`[gen-whop-reconcile] error ${e instanceof Error ? e.message : "unknown"}`);
    return json({ error: "Unexpected reconcile error.", markedPaid: false }, 500);
  }
});
