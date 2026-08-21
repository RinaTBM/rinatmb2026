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
    const payKeys = [
      "paymentStatus","payment_status","paymentVerificationStatus","paymentVerification",
      "amount","balance","paymentRequired","paymentLink","paymentGateway","orderStatus","status",
      "checkoutStatus","refundStatus","refundedAmount","receipt","quantity","orderType",
      "clientProductId","productId","requiredActions","requirementSummary"
    ];
    const paymentSafe: Record<string, unknown> = {};
    if (data) {
      for (const k of payKeys) {
        if (!(k in data)) continue;
        const v = data[k];
        if (typeof v === "string") paymentSafe[k] = v.slice(0, 120);
        else if (typeof v === "number" || typeof v === "boolean" || v == null) paymentSafe[k] = v;
        else if (Array.isArray(v)) paymentSafe[k] = `array:${v.length}`;
        else if (typeof v === "object") paymentSafe[k] = Object.fromEntries(Object.entries(v as Record<string, unknown>).slice(0, 12).map(([kk,vv]) => [kk, typeof vv === "string" ? String(vv).slice(0,80) : typeof vv]));
      }
    }
    return json({
      ok: res.ok,
      httpStatus: res.status,
      variant,
      correlationId,
      orderId: data?.orderId ?? data?.id ?? null,
      orderStatus: data?.orderStatus ?? data?.status ?? null,
      requiredActionCount: safeActions.length,
      safeActions,
      dataKeys: data ? Object.keys(data).slice(0, 60) : [],
      paymentSafe,
      rootKeys: root ? Object.keys(root).slice(0, 20) : [],
    }, res.ok ? 200 : 400);
  }


  if (variant === "get_product") {
    const correlationId = createCorrelationId("qa_prod");
    const res = await fetch(`${config.baseUrl}/v2/client/products/${encodeURIComponent(clientProductId)}`, {
      method: "GET",
      headers: { Accept: "application/json", "X-API-Key": config.apiKey, "X-Correlation-Id": correlationId },
    });
    const textBody = await res.text();
    let parsed: unknown = null;
    try { parsed = textBody ? JSON.parse(textBody) : null; } catch { parsed = { unparsed: true }; }
    const root = parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : null;
    const data = root && root.data && typeof root.data === "object" ? root.data as Record<string, unknown> : root;
    const product = data && data.product && typeof data.product === "object"
      ? data.product as Record<string, unknown>
      : data;
    const safe: Record<string, unknown> = {};
    if (product) {
      for (const [k,v] of Object.entries(product).slice(0, 100)) {
        const lk = k.toLowerCase();
        if (/(email|phone|address|token|magic|ssn|dob)/.test(lk)) continue;
        if (typeof v === "string") safe[k] = v.slice(0, 200);
        else if (typeof v === "number" || typeof v === "boolean" || v == null) safe[k] = v;
        else if (Array.isArray(v)) safe[k] = `array:${v.length}`;
        else if (typeof v === "object") {
          const nested = v as Record<string, unknown>;
          safe[k] = Object.fromEntries(Object.entries(nested).slice(0, 20).map(([kk,vv]) => {
            if (typeof vv === "string") return [kk, vv.slice(0, 120)];
            if (typeof vv === "number" || typeof vv === "boolean" || vv == null) return [kk, vv];
            if (Array.isArray(vv)) return [kk, `array:${vv.length}`];
            return [kk, typeof vv];
          }));
        } else safe[k] = typeof v;
      }
    }
    return json({
      ok: res.ok,
      httpStatus: res.status,
      variant,
      correlationId,
      productKeys: product ? Object.keys(product).slice(0,100) : [],
      productSafe: safe,
      rootKeys: root ? Object.keys(root).slice(0,20) : [],
      dataKeys: data ? Object.keys(data).slice(0,40) : [],
    }, res.ok ? 200 : 400);
  }

  if (variant === "list_products_safe") {
    const correlationId = createCorrelationId("qa_plist");
    const res = await fetch(`${config.baseUrl}/v2/client/products`, {
      method: "GET",
      headers: { Accept: "application/json", "X-API-Key": config.apiKey, "X-Correlation-Id": correlationId },
    });
    const textBody = await res.text();
    let parsed: unknown = null;
    try { parsed = textBody ? JSON.parse(textBody) : null; } catch { parsed = { unparsed: true }; }
    const root = parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : null;
    const data = root && root.data && typeof root.data === "object" ? root.data as Record<string, unknown> : root;
    const list = Array.isArray(data?.products) ? data!.products as unknown[]
      : Array.isArray(data?.items) ? data!.items as unknown[]
      : Array.isArray(root?.products) ? (root!.products as unknown[])
      : Array.isArray(parsed) ? parsed as unknown[]
      : [];
    const target = clientProductId;
    const matches = [] as Array<Record<string, unknown>>;
    for (const item of list) {
      const pr = item && typeof item === "object" ? item as Record<string, unknown> : {};
      const id = String(pr.id || pr.productId || pr.clientProductId || "");
      const cid = String(pr.clientProductId || "");
      if (id.includes(target) || cid.includes(target) || target.includes(id) || String(pr.productName||"").toLowerCase().includes("bpc")) {
        const safe: Record<string, unknown> = {};
        for (const [k,v] of Object.entries(pr).slice(0, 60)) {
          const lk = k.toLowerCase();
          if (/(email|phone|address|token|magic)/.test(lk)) continue;
          if (typeof v === "string") safe[k] = v.slice(0, 160);
          else if (typeof v === "number" || typeof v === "boolean" || v == null) safe[k] = v;
          else if (Array.isArray(v)) safe[k] = `array:${v.length}`;
          else safe[k] = typeof v;
        }
        matches.push(safe);
      }
    }
    return json({
      ok: res.ok,
      httpStatus: res.status,
      variant,
      correlationId,
      listCount: list.length,
      matchCount: matches.length,
      matches: matches.slice(0, 5),
      dataKeys: data ? Object.keys(data).slice(0, 30) : [],
    }, res.ok ? 200 : 400);
  }

  if (variant === "probe_mark_paid_paths") {
    // OPTIONS/HEAD/GET discovery only — no mutating mark-paid calls
    const correlationId = createCorrelationId("qa_paths");
    const orderId = String(body.genOrderId || "");
    if (!orderId) return json({ error: "gen_order_id_required" }, 400);
    const paths = [
      `/v2/client/orders/${orderId}`,
      `/v2/client/orders/${orderId}/pay`,
      `/v2/client/orders/${orderId}/payment`,
      `/v2/client/orders/${orderId}/mark-paid`,
      `/v2/client/orders/${orderId}/mark_paid`,
      `/v2/client/orders/${orderId}/actions/mark-paid`,
      `/v2/client/orders/${orderId}/actions/pay`,
      `/v2/client/payments`,
      `/v2/client/orders/payment`,
    ];
    const results = [] as Array<Record<string, unknown>>;
    for (const path of paths) {
      for (const method of ["OPTIONS", "GET"]) {
        const res = await fetch(`${config.baseUrl}${path}`, {
          method,
          headers: { Accept: "application/json", "X-API-Key": config.apiKey, "X-Correlation-Id": correlationId },
        });
        const allow = res.headers.get("allow") || res.headers.get("Access-Control-Allow-Methods") || null;
        results.push({ method, path, status: res.status, allow, ok: res.ok });
      }
    }
    return json({ ok: true, variant, correlationId, results });
  }

  if (variant === "probe_payment_field_rejection") {
    // Re-confirm 400 on payment_status without creating a successful paid order.
    // Uses top_patient_id shape which previously created OR rejected — prefer a dry validation
    // by sending payment_status on a known-good nesting. If GEN creates despite rejection path,
    // we MUST abort: only allow when response is error.
    const correlationId = createCorrelationId("qa_payfield");
    const payload = {
      patient_id: patientId,
      order: {
        clientProductId,
        payment_status: "paid",
        transactionId: tx,
      },
    };
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
    const textBody = await res.text();
    let parsed: unknown = null;
    try { parsed = textBody ? JSON.parse(textBody) : null; } catch { parsed = { unparsed: true }; }
    const root = parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : null;
    const data = root && root.data && typeof root.data === "object" ? root.data as Record<string, unknown> : null;
    const createdId = data?.orderId ?? data?.id ?? root?.orderId ?? root?.id ?? null;
    // SAFETY: if unexpectedly created, report and do not continue probes
    return json({
      ok: res.ok,
      httpStatus: res.status,
      variant,
      correlationId,
      createdOrderId: createdId,
      message: typeof root?.message === "string" ? String(root.message).slice(0, 400) : null,
      error: typeof root?.error === "string" ? String(root.error).slice(0, 400) : (root?.error && typeof root.error === "object" ? JSON.stringify(root.error).slice(0,400) : null),
      code: root?.code ?? null,
      dataKeys: data ? Object.keys(data).slice(0, 20) : [],
      paymentStatus: data?.paymentStatus ?? null,
      orderStatus: data?.orderStatus ?? data?.status ?? null,
    }, res.status === 400 || res.status === 403 || res.status === 422 ? 200 : (res.ok ? 200 : 400));
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
