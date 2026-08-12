import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Tagada / Kashu webhook receiver — payment source of truth.
 *
 * Official signature verification (docs.tagada.io webhooks-events):
 * - Header: X-TagadaPay-Signature: sha256=<hex>
 * - HMAC-SHA256(secret, rawBody) must match
 * - Do not parse JSON before verifying
 *
 * Browser success redirects MUST NOT mark orders paid.
 * DO NOT deploy until TAGADA_WEBHOOK_SECRET is set and endpoint registered.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey, X-TagadaPay-Signature, X-TagadaPay-Timestamp",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifySignature(rawBody: string, secret: string, header: string | null): Promise<boolean> {
  if (!header?.startsWith("sha256=")) return false;
  const expected = header.slice("sha256=".length);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const actual = Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

function mapStatus(eventType: string): string | null {
  switch (eventType) {
    case "order/paid":
    case "payment/succeeded":
      return "paid";
    case "order/failed":
    case "payment/failed":
    case "payment/rejected":
      return "payment_failed";
    case "order/refunded":
    case "payment/refunded":
      return "refunded";
    default:
      return null;
  }
}

function extractEventType(payload: Record<string, unknown>): string {
  const t = payload.eventType ?? payload.type ?? payload.event_type;
  return typeof t === "string" ? t : "";
}

function extractEventId(payload: Record<string, unknown>): string | null {
  const id = payload.id ?? payload.eventId ?? payload.event_id;
  return typeof id === "string" && id.trim() ? id.trim() : null;
}

function extractOrderNumber(payload: Record<string, unknown>): string | null {
  const direct = payload.mbmOrderNumber ?? payload.mbm_order_number ?? payload.payment_reference;
  if (typeof direct === "string" && direct.trim()) return direct.trim().toUpperCase();
  const meta = payload.metadata;
  if (meta && typeof meta === "object") {
    const m = meta as Record<string, unknown>;
    const v = m.mbmOrderNumber ?? m.mbm_order_number;
    if (typeof v === "string" && v.trim()) return v.trim().toUpperCase();
  }
  const tags = payload.customerTags;
  if (Array.isArray(tags)) {
    for (const t of tags) {
      if (typeof t === "string" && t.startsWith("mbmOrder:")) {
        return t.slice("mbmOrder:".length).toUpperCase();
      }
    }
  }
  return null;
}

function extractAmountCents(payload: Record<string, unknown>): number | null {
  const candidates = [
    payload.amountCents,
    payload.amount_cents,
    payload.totalCents,
    payload.total_cents,
    (payload.order as Record<string, unknown> | undefined)?.amountCents,
    (payload.order as Record<string, unknown> | undefined)?.totalCents,
    (payload.payment as Record<string, unknown> | undefined)?.amountCents,
  ];
  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c)) return Math.trunc(c);
    if (typeof c === "string" && c.trim() && !Number.isNaN(Number(c))) return Math.trunc(Number(c));
  }
  return null;
}

function extractExternalIds(payload: Record<string, unknown>) {
  const order = payload.order as Record<string, unknown> | undefined;
  const payment = payload.payment as Record<string, unknown> | undefined;
  return {
    externalOrderId:
      (typeof payload.orderId === "string" && payload.orderId) ||
      (typeof order?.id === "string" && order.id) ||
      null,
    externalPaymentId:
      (typeof payload.paymentId === "string" && payload.paymentId) ||
      (typeof payment?.id === "string" && payment.id) ||
      null,
    externalCheckoutSessionId:
      (typeof payload.checkoutSessionId === "string" && payload.checkoutSessionId) ||
      (typeof payload.checkout_session_id === "string" && payload.checkout_session_id) ||
      null,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const secret = Deno.env.get("TAGADA_WEBHOOK_SECRET")?.trim();
  if (!secret) {
    return json({ error: "Webhook secret not configured." }, 503);
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("X-TagadaPay-Signature");
  const valid = await verifySignature(rawBody, secret, signatureHeader);
  if (!valid) {
    return json({ error: "Invalid webhook signature." }, 401);
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const eventType = extractEventType(payload);
  const eventId = extractEventId(payload) || `hash:${await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawBody)).then((b) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join("").slice(0, 32))}`;
  const targetStatus = mapStatus(eventType);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return json({ error: "Order service is not configured." }, 500);
  }

  // Idempotency insert — unique (processor, event_id)
  const insertEvt = await fetch(`${supabaseUrl}/rest/v1/payment_webhook_events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
      Prefer: "return=representation,resolution=ignore-duplicates",
    },
    body: JSON.stringify({
      processor: "kashu_tagada",
      event_id: eventId,
      event_type: eventType || null,
      signature_valid: true,
      payload,
      processing_result: "received",
    }),
  });

  // If duplicate, treat as success (idempotent)
  if (insertEvt.status === 409 || insertEvt.headers.get("Preference-Applied") === "resolution=ignore-duplicates") {
    // fall through — check if already processed
  }

  if (!targetStatus) {
    await fetch(
      `${supabaseUrl}/rest/v1/payment_webhook_events?processor=eq.kashu_tagada&event_id=eq.${encodeURIComponent(eventId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ processing_result: "ignored_unmapped_event" }),
      },
    );
    return json({ ok: true, ignored: true, eventType });
  }

  const orderNumber = extractOrderNumber(payload);
  if (!orderNumber) {
    await fetch(
      `${supabaseUrl}/rest/v1/payment_webhook_events?processor=eq.kashu_tagada&event_id=eq.${encodeURIComponent(eventId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          processing_result: "missing_order_reference",
          error_message: "Could not resolve MBM order number from Tagada payload",
        }),
      },
    );
    // 200 so Tagada does not endless-retry; ops must investigate mapping
    return json({ ok: false, error: "missing_order_reference" }, 200);
  }

  const orderRes = await fetch(
    `${supabaseUrl}/rest/v1/orders?public_order_number=eq.${encodeURIComponent(orderNumber)}&select=*&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
    },
  );
  const orders = await orderRes.json();
  const order = Array.isArray(orders) ? orders[0] : null;
  if (!order) {
    return json({ ok: false, error: "order_not_found", orderNumber }, 200);
  }

  // Already paid + duplicate paid event → idempotent success
  if (order.payment_status === "paid" && targetStatus === "paid") {
    await fetch(
      `${supabaseUrl}/rest/v1/payment_webhook_events?processor=eq.kashu_tagada&event_id=eq.${encodeURIComponent(eventId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          processing_result: "duplicate_already_paid",
          public_order_number: orderNumber,
          order_id: order.id,
        }),
      },
    );
    return json({ ok: true, duplicate: true, orderNumber });
  }

  if (targetStatus === "paid") {
    const paidCents = extractAmountCents(payload);
    if (paidCents == null || paidCents !== Number(order.total_cents)) {
      await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_status: "payment_under_review",
          payment_admin_note:
            `Kashu webhook amount mismatch or missing. expected=${order.total_cents} paid=${paidCents}`,
        }),
      });
      await fetch(
        `${supabaseUrl}/rest/v1/payment_webhook_events?processor=eq.kashu_tagada&event_id=eq.${encodeURIComponent(eventId)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            apikey: serviceKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            processing_result: "amount_mismatch_under_review",
            public_order_number: orderNumber,
            order_id: order.id,
            error_message: `expected=${order.total_cents} paid=${paidCents}`,
          }),
        },
      );
      // Do NOT unlock fulfillment
      return json({ ok: false, error: "amount_mismatch", expected: order.total_cents, paid: paidCents }, 200);
    }

    const ids = extractExternalIds(payload);
    const now = new Date().toISOString();
    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_status: "paid",
        payment_processor: "kashu_tagada",
        paid_at: now,
        paid_marked_by: "tagada_webhook",
        order_status: "payment_confirmed",
        external_payment_id: ids.externalPaymentId,
        external_order_id: ids.externalOrderId,
        external_checkout_session_id: ids.externalCheckoutSessionId,
      }),
    });
    await fetch(`${supabaseUrl}/rest/v1/order_fulfillment?order_id=eq.${order.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fulfillment_status: "payment_confirmed" }),
    });
    await fetch(`${supabaseUrl}/rest/v1/order_status_events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: order.id,
        status: "payment_confirmed",
        customer_visible: true,
        note: "Card payment confirmed by Kashu/Tagada webhook",
        created_by: "tagada_webhook",
      }),
    });
  } else {
    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_status: targetStatus,
        payment_processor: "kashu_tagada",
      }),
    });
  }

  await fetch(
    `${supabaseUrl}/rest/v1/payment_webhook_events?processor=eq.kashu_tagada&event_id=eq.${encodeURIComponent(eventId)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        processing_result: `applied_${targetStatus}`,
        public_order_number: orderNumber,
        order_id: order.id,
      }),
    },
  );

  return json({ ok: true, orderNumber, paymentStatus: targetStatus });
});
