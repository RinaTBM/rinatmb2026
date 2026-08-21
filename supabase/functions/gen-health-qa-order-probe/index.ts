import "jsr:@supabase/functions-js/edge-runtime.d.ts";
/**
 * STAGING-ONLY probe for GEN order create payload shapes.
 * DO NOT deploy to production.
 */
import { createCorrelationId, formatGenLog, resolveGenHealthConfig } from "../_shared/genHealth.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const config = resolveGenHealthConfig();
  if (!config.enabled || !config.apiKey) {
    return json({ ok: false, code: "GEN_DISABLED" }, 503);
  }
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }

  // Only allow fixture/QA markers
  const tx = String(body.transactionId || "");
  if (!tx.startsWith("fixture_12i_") && !tx.startsWith("qa_")) {
    return json({ error: "fixture_transaction_required" }, 400);
  }
  const patientId = String(body.patientId || "");
  const clientProductId = String(body.clientProductId || "");
  if (!patientId || !clientProductId) return json({ error: "patient_and_product_required" }, 400);

  const variant = String(body.variant || "nested_order");
  if (variant === "get_order") {
    const genOrderId = String(body.genOrderId || "");
    if (!genOrderId) return json({ error: "gen_order_id_required" }, 400);
    const correlationId = createCorrelationId("qa_get");
    const res = await fetch(`${config.baseUrl}/v2/client/orders/${encodeURIComponent(genOrderId)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-Key": config.apiKey,
        "X-Correlation-Id": correlationId,
      },
    });
    const text = await res.text();
    let parsed: unknown = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { parsed = { unparsed: true }; }
    const root = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
    const dataLayer = root && root.data && typeof root.data === "object" ? root.data as Record<string, unknown> : root;
    const data = dataLayer && dataLayer.order && typeof dataLayer.order === "object"
      ? dataLayer.order as Record<string, unknown>
      : dataLayer;
    const actions = Array.isArray(data?.requiredActions) ? data!.requiredActions as unknown[] : [];
    const safeActions = actions.slice(0, 10).map((a, i) => {
      const ar = a && typeof a === "object" ? a as Record<string, unknown> : {};
      return {
        i,
        id: typeof ar.id === "string" ? ar.id : undefined,
        type: typeof ar.type === "string" ? ar.type : undefined,
        title: typeof ar.title === "string" ? ar.title : (typeof ar.name === "string" ? ar.name : undefined),
        status: typeof ar.status === "string" ? ar.status : undefined,
        hasUrl: Boolean(ar.url || ar.href || ar.continuationUrl),
      };
    });
    return json({
      ok: res.ok,
      httpStatus: res.status,
      variant,
      correlationId,
      orderId: data?.orderId ?? data?.id ?? null,
      orderStatus: data?.orderStatus ?? data?.status ?? null,
      requiredActionCount: safeActions.length,
      safeActions,
      dataKeys: data ? Object.keys(data).slice(0, 40) : [],
    }, res.ok ? 200 : 400);
  }

  const correlationId = createCorrelationId("qa_order");
  let payload: Record<string, unknown>;
  if (variant === "flat") {
    payload = {
      patientId,
      clientProductId,
      payment_status: "paid",
      transactionId: tx,
    };
  } else if (variant === "nested_camel") {
    payload = {
      order: {
        patientId,
        clientProductId,
        paymentStatus: "paid",
        transactionId: tx,
      },
    };
  } else if (variant === "nested_productId") {
    payload = {
      order: {
        patientId,
        productId: String(body.productId || clientProductId.split("_").pop()),
        payment_status: "paid",
        transactionId: tx,
      },
    };
  } else if (variant === "nested_snake") {
    payload = {
      order: {
        patient_id: patientId,
        clientProductId,
        payment_status: "paid",
        transactionId: tx,
      },
    };
  } else if (variant === "nested_snake_full") {
    payload = {
      order: {
        patient_id: patientId,
        clientProductId,
        payment_status: "paid",
        transaction_id: tx,
        client_reference: String(body.clientReference || "fixture_12i"),
        quantity: 1,
      },
    };
  } else if (variant === "top_patient_id") {
    payload = {
      patient_id: patientId,
      order: {
        clientProductId,
        payment_status: "paid",
        transactionId: tx,
      },
    };
  } else if (variant === "top_patient_no_pay") {
    payload = {
      patient_id: patientId,
      order: {
        clientProductId,
        transactionId: tx,
      },
    };
  } else if (variant === "top_patient_pay_camel") {
    payload = {
      patient_id: patientId,
      order: {
        clientProductId,
        paymentStatus: "paid",
        transactionId: tx,
      },
    };
  } else {
    payload = {
      order: {
        patientId,
        clientProductId,
        payment_status: "paid",
        transactionId: tx,
      },
    };
  }

  console.log(formatGenLog({ operation: "qa_order_probe", correlationId, safeErrorCode: variant }));
  const res = await fetch(`${config.baseUrl}/v2/client/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-Key": config.apiKey,
      "X-Correlation-Id": correlationId,
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let parsed: unknown = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = { unparsed: true, len: text.length }; }
  // Return only safe summary — never full PHI
  const root = parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? parsed as Record<string, unknown>
    : null;
  const data = root && root.data && typeof root.data === "object" && !Array.isArray(root.data)
    ? root.data as Record<string, unknown>
    : null;
  const safeParsed = root
    ? {
      id: data?.orderId ?? data?.id ?? root.orderId ?? root.id ?? null,
      orderStatus: data?.orderStatus ?? data?.status ?? root.orderStatus ?? root.status ?? null,
      requiredActionCount: Array.isArray(data?.requiredActions)
        ? (data!.requiredActions as unknown[]).length
        : Array.isArray(root.requiredActions)
        ? (root.requiredActions as unknown[]).length
        : null,
      code: root.code ?? null,
      message: typeof root.message === "string" ? String(root.message).slice(0, 300) : null,
      error: typeof root.error === "string" ? String(root.error).slice(0, 300) : null,
      keys: Object.keys(root).slice(0, 20),
      dataKeys: data ? Object.keys(data).slice(0, 30) : [],
      actionSampleKeys: Array.isArray(data?.requiredActions) && data.requiredActions[0] && typeof data.requiredActions[0]==="object"
        ? Object.keys(data.requiredActions[0] as Record<string, unknown>).slice(0, 30)
        : [],
      actionSampleSafe: Array.isArray(data?.requiredActions)
        ? (data.requiredActions as unknown[]).slice(0, 3).map((a) => {
            if (typeof a === "string") return { string: a.slice(0, 80) };
            const ar = a && typeof a === "object" ? a as Record<string, unknown> : {};
            const out: Record<string, unknown> = { _keys: Object.keys(ar).slice(0, 40), _type: typeof a };
            for (const k of Object.keys(ar)) {
              const v = ar[k];
              if (typeof v === "string" && v.length < 160) out[k] = v.slice(0, 160);
              else if (typeof v === "boolean" || typeof v === "number") out[k] = v;
              else if (v == null) out[k] = null;
              else out[k] = Array.isArray(v) ? `array:${v.length}` : typeof v;
            }
            return out;
          })
        : [],
      requirementSummarySafe: data?.requirementSummary && typeof data.requirementSummary === "object"
        ? Object.fromEntries(Object.entries(data.requirementSummary as Record<string, unknown>).slice(0, 20).map(([k,v]) => [k, typeof v === "string" ? v.slice(0,120) : typeof v]))
        : data?.requirementSummary ?? null,
      continuationSupported: data?.continuationSupported ?? null,
      intakeMode: data?.intakeMode ?? null,
      hasMagicLink: typeof data?.magicLink === "string" && Boolean(data.magicLink),
      paymentStatus: data?.paymentStatus ?? null,
    }
    : { type: typeof parsed };

  return json({
    ok: res.ok,
    httpStatus: res.status,
    variant,
    correlationId,
    safeParsed,
  }, res.ok ? 200 : 400);
});
