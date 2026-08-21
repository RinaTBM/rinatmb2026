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
 *
 * Correlation order (never email-only): mbmOrder tag → external checkout/session →
 * payment/order IDs. Helpers: _shared/tagadaWebhookCorrelation.ts
 */

import {
  evaluateDuplicatePaidEvent,
  evaluatePaidAmountMatch,
  extractAmountCentsFromTagadaPayload,
  extractExternalIdsFromTagadaPayload,
  extractOrderNumberFromTagadaPayload,
} from "../_shared/tagadaWebhookCorrelation.ts";

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

const SUBSCRIPTION_EVENTS = new Set([
  "subscription/created",
  "subscription/canceled",
  "subscription/paused",
  "subscription/resumed",
  "subscription/pastDue",
  "subscription/rebillUpcoming",
  "subscription/rebillSucceeded",
  "subscription/rebillDeclined",
  "subscription/cancelScheduled",
  "subscription/rebillCaptureFailed",
]);

function mapSubscriptionStatus(eventType: string): string | "ignore" | null {
  switch (eventType) {
    case "subscription/created":
    case "subscription/rebillSucceeded":
    case "subscription/resumed":
      return "active";
    case "subscription/pastDue":
      return "past_due";
    case "subscription/rebillDeclined":
    case "subscription/rebillCaptureFailed":
      return "payment_issue";
    case "subscription/paused":
      return "paused";
    case "subscription/cancelScheduled":
      return "cancel_scheduled";
    case "subscription/canceled":
      return "canceled";
    case "subscription/rebillUpcoming":
      return "ignore";
    default:
      return null;
  }
}

function asId(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function asIso(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Extract subscription fields only from common Tagada shapes — do not invent. */
function extractSubscriptionFields(payload: Record<string, unknown>) {
  const data = asRecord(payload.data);
  const subscription =
    asRecord(payload.subscription) ??
    asRecord(data?.subscription) ??
    (typeof data?.id === "string" && String(data.id).startsWith("sub_") ? data : undefined);
  const customer =
    asRecord(payload.customer) ?? asRecord(data?.customer) ?? asRecord(subscription?.customer);
  const price = asRecord(subscription?.price) ?? asRecord(data?.price);
  const payment = asRecord(payload.payment) ?? asRecord(data?.payment);
  return {
    subscriptionId:
      asId(payload.subscriptionId) ||
      asId(data?.subscriptionId) ||
      asId(subscription?.id) ||
      asId(subscription?.subscriptionId) ||
      null,
    customerId:
      asId(payload.customerId) ||
      asId(data?.customerId) ||
      asId(customer?.id) ||
      asId(customer?.customerId) ||
      asId(subscription?.customerId) ||
      null,
    priceId:
      asId(payload.priceId) ||
      asId(data?.priceId) ||
      asId(subscription?.priceId) ||
      asId(price?.id) ||
      null,
    currentPeriodStart:
      asIso(subscription?.currentPeriodStart) ||
      asIso(subscription?.current_period_start) ||
      asIso(data?.currentPeriodStart) ||
      null,
    currentPeriodEnd:
      asIso(subscription?.currentPeriodEnd) ||
      asIso(subscription?.current_period_end) ||
      asIso(data?.currentPeriodEnd) ||
      null,
    nextBillingAt:
      asIso(subscription?.nextBillingDate) ||
      asIso(subscription?.next_billing_date) ||
      asIso(subscription?.nextBillingAt) ||
      asIso(data?.nextBillingDate) ||
      null,
    paymentId:
      asId(payload.paymentId) ||
      asId(data?.paymentId) ||
      asId(payment?.id) ||
      asId(payment?.paymentId) ||
      null,
  };
}

function addMonthsUtc(iso: string, months: number): string {
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString();
}

function extractEventType(payload: Record<string, unknown>): string {
  const t = payload.eventType ?? payload.type ?? payload.event_type;
  return typeof t === "string" ? t : "";
}

function extractEventId(payload: Record<string, unknown>): string | null {
  const id = payload.id ?? payload.eventId ?? payload.event_id;
  return typeof id === "string" && id.trim() ? id.trim() : null;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
}

const extractOrderNumber = extractOrderNumberFromTagadaPayload;
const extractAmountCents = extractAmountCentsFromTagadaPayload;
const extractExternalIds = extractExternalIdsFromTagadaPayload;

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
    if (SUBSCRIPTION_EVENTS.has(eventType)) {
      const subStatus = mapSubscriptionStatus(eventType);
      const fields = extractSubscriptionFields(payload);
      const orderNumber = extractOrderNumber(payload);

      // Resolve membership by Tagada subscription id first, then by enrollment order.
      let membership: Record<string, unknown> | null = null;
      if (fields.subscriptionId) {
        const bySub = await fetch(
          `${supabaseUrl}/rest/v1/customer_memberships?tagada_subscription_id=eq.${encodeURIComponent(fields.subscriptionId)}&select=*&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              apikey: serviceKey,
            },
          },
        );
        const rows = await bySub.json();
        membership = Array.isArray(rows) ? rows[0] : null;
      }
      if (!membership && orderNumber) {
        const byOrder = await fetch(
          `${supabaseUrl}/rest/v1/customer_memberships?enrollment_public_order_number=eq.${encodeURIComponent(orderNumber)}&select=*&order=created_at.desc&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              apikey: serviceKey,
            },
          },
        );
        const rows = await byOrder.json();
        membership = Array.isArray(rows) ? rows[0] : null;
      }

      if (!membership) {
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
              processing_result: "subscription_membership_not_found",
              public_order_number: orderNumber,
              error_message: `subscriptionId=${fields.subscriptionId}`,
            }),
          },
        );
        return json({
          ok: false,
          error: "subscription_membership_not_found",
          eventType,
        }, 200);
      }

      if (subStatus === "ignore") {
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
              processing_result: "subscription_ignored_informational",
              public_order_number: orderNumber,
              order_id: membership.enrollment_order_id ?? null,
            }),
          },
        );
        return json({ ok: true, ignored: true, eventType });
      }

      const now = new Date().toISOString();
      const startedAt =
        (typeof membership.started_at === "string" && membership.started_at) ||
        fields.currentPeriodStart ||
        now;
      const minimumTermEndsAt =
        (typeof membership.minimum_term_ends_at === "string" && membership.minimum_term_ends_at) ||
        addMonthsUtc(startedAt, 3);

      // Validate rebill against stored combo monthly_amount_cents (not always base 14900/24900).
      const expectedMonthlyCents = Number(membership.monthly_amount_cents) || 0;
      const rebillPaidCents = extractAmountCents(payload);
      const rebillAmountMismatch =
        eventType === "subscription/rebillSucceeded" &&
        rebillPaidCents != null &&
        expectedMonthlyCents > 0 &&
        rebillPaidCents !== expectedMonthlyCents;
      const effectiveSubStatus = rebillAmountMismatch ? "payment_issue" : subStatus;

      const patch: Record<string, unknown> = {
        status: effectiveSubStatus,
        updated_at: now,
        last_rebill_status: eventType,
      };
      if (fields.subscriptionId) patch.tagada_subscription_id = fields.subscriptionId;
      if (fields.customerId) patch.tagada_customer_id = fields.customerId;
      if (fields.priceId) patch.tagada_price_id = fields.priceId;
      if (fields.currentPeriodStart) patch.current_period_start = fields.currentPeriodStart;
      if (fields.currentPeriodEnd) patch.current_period_end = fields.currentPeriodEnd;
      if (fields.nextBillingAt) patch.next_billing_at = fields.nextBillingAt;

      if (effectiveSubStatus === "active") {
        patch.started_at = startedAt;
        patch.minimum_term_ends_at = minimumTermEndsAt;
        if (eventType === "subscription/rebillSucceeded") {
          patch.last_rebill_at = now;
          if (fields.paymentId) patch.last_rebill_payment_id = fields.paymentId;
        }
      }
      if (effectiveSubStatus === "past_due" || effectiveSubStatus === "payment_issue") {
        patch.past_due_at = now;
      }
      if (effectiveSubStatus === "cancel_scheduled") {
        patch.cancel_scheduled_at = now;
      }
      if (effectiveSubStatus === "canceled") {
        patch.canceled_at = now;
      }

      await fetch(`${supabaseUrl}/rest/v1/customer_memberships?id=eq.${membership.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patch),
      });

      // Idempotent rebill event log (unique on tagada_event_id).
      if (
        eventType === "subscription/rebillSucceeded" ||
        eventType === "subscription/rebillDeclined" ||
        eventType === "subscription/rebillCaptureFailed"
      ) {
        await fetch(`${supabaseUrl}/rest/v1/membership_rebill_events`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            apikey: serviceKey,
            "Content-Type": "application/json",
            Prefer: "resolution=ignore-duplicates,return=minimal",
          },
          body: JSON.stringify({
            customer_membership_id: membership.id,
            tagada_event_id: eventId,
            tagada_payment_id: fields.paymentId,
            event_type: eventType,
            amount_cents: rebillPaidCents ?? membership.monthly_amount_cents ?? null,
            processing_result: rebillAmountMismatch
              ? "rebill_amount_mismatch_under_review"
              : `applied_${effectiveSubStatus}`,
          }),
        });
      }

      // Initial activation: also mark enrollment order paid when subscription/created
      // coincides with authoritative evidence (amount equality still required for order/paid path).
      // subscription/created alone activates membership; payment/succeeded / order/paid still
      // run through the one-time amount-equality path for the enrollment order.

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
            processing_result: rebillAmountMismatch
              ? "rebill_amount_mismatch_under_review"
              : `subscription_applied_${effectiveSubStatus}`,
            public_order_number: orderNumber,
            order_id: membership.enrollment_order_id ?? null,
            ...(rebillAmountMismatch
              ? {
                  error_message:
                    `expected_monthly=${expectedMonthlyCents};paid=${rebillPaidCents}`,
                }
              : {}),
          }),
        },
      );
      return json({
        ok: !rebillAmountMismatch,
        eventType,
        membershipStatus: effectiveSubStatus,
        membershipId: membership.id,
        ...(rebillAmountMismatch
          ? {
              error: "rebill_amount_mismatch",
              expectedMonthlyCents,
              paidCents: rebillPaidCents,
            }
          : {}),
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
        body: JSON.stringify({ processing_result: "ignored_unmapped_event" }),
      },
    );
    return json({ ok: true, ignored: true, eventType });
  }

  // Correlation order (never email-only):
  // 1) mbmOrder tag / metadata
  // 2) external_checkout_session_id
  // 3) external_payment_id / external_order_id already on an MBM order
  let orderNumber = extractOrderNumber(payload);
  const ids = extractExternalIds(payload);
  let order: Record<string, unknown> | null = null;

  if (orderNumber) {
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
    order = Array.isArray(orders) ? orders[0] : null;
  }

  if (!order && ids.externalCheckoutSessionId) {
    const byCs = await fetch(
      `${supabaseUrl}/rest/v1/orders?external_checkout_session_id=eq.${encodeURIComponent(ids.externalCheckoutSessionId)}&select=*&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    const rows = await byCs.json();
    order = Array.isArray(rows) ? rows[0] : null;
    if (order && typeof order.public_order_number === "string") {
      orderNumber = order.public_order_number;
    }
  }

  if (!order && ids.externalPaymentId) {
    const byPay = await fetch(
      `${supabaseUrl}/rest/v1/orders?external_payment_id=eq.${encodeURIComponent(ids.externalPaymentId)}&select=*&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    const rows = await byPay.json();
    order = Array.isArray(rows) ? rows[0] : null;
    if (order && typeof order.public_order_number === "string") {
      orderNumber = order.public_order_number;
    }
  }

  if (!order && ids.externalOrderId) {
    const byOrd = await fetch(
      `${supabaseUrl}/rest/v1/orders?external_order_id=eq.${encodeURIComponent(ids.externalOrderId)}&select=*&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    const rows = await byOrd.json();
    order = Array.isArray(rows) ? rows[0] : null;
    if (order && typeof order.public_order_number === "string") {
      orderNumber = order.public_order_number;
    }
  }

  if (!orderNumber || !order) {
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
          error_message:
            "Could not resolve MBM order via mbmOrder tag or persisted Tagada external IDs (never email-only)",
        }),
      },
    );
    // 200 so Tagada does not endless-retry; ops must investigate mapping
    return json({ ok: false, error: "missing_order_reference" }, 200);
  }

  // Already paid + duplicate paid event → idempotent success
  if (
    evaluateDuplicatePaidEvent({
      currentPaymentStatus: String(order.payment_status || ""),
      targetStatus,
    }) === "duplicate_already_paid"
  ) {
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
    const amountCheck = evaluatePaidAmountMatch({
      orderTotalCents: Number(order.total_cents),
      paidCents,
    });
    if (amountCheck !== "ok") {
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

    // Membership enrollment: initial payment success is authoritative activation evidence
    // together with (or ahead of) subscription/created. Browser return never does this.
    const memRes = await fetch(
      `${supabaseUrl}/rest/v1/customer_memberships?enrollment_order_id=eq.${order.id}&select=*&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    if (memRes.ok) {
      const memRows = await memRes.json();
      const mem = Array.isArray(memRows) ? memRows[0] : null;
      if (mem && (mem.status === "pending_payment" || mem.status === "payment_issue" || mem.status === "past_due")) {
        const startedAt = mem.started_at || now;
        const minimumTermEndsAt = mem.minimum_term_ends_at || addMonthsUtc(startedAt, 3);
        await fetch(`${supabaseUrl}/rest/v1/customer_memberships?id=eq.${mem.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            apikey: serviceKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "active",
            started_at: startedAt,
            minimum_term_ends_at: minimumTermEndsAt,
            updated_at: now,
            last_rebill_status: eventType,
          }),
        });
      }
    }
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
