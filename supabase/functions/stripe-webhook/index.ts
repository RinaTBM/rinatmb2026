import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Stripe webhook (TEST). Verifies the signature against the RAW body using the
// environment-specific secret, then processes each event at most once
// (processed_stripe_events). On checkout.session.completed, upserts an order
// idempotently by stripe_checkout_session_id. No PHI or medical detail is stored.

const ENVIRONMENT = "test";

function parseSigHeader(header: string): { t: number; v1: string[] } {
  let t = 0;
  const v1: string[] = [];
  for (const part of header.split(",")) {
    const [k, v] = part.trim().split("=");
    if (k === "t") t = parseInt(v, 10);
    else if (k === "v1") v1.push(v);
  }
  return { t, v1 };
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let m = 0;
  for (let i = 0; i < a.length; i++) m |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return m === 0;
}

async function verify(rawBody: string, sigHeader: string | null, secret: string, tolerance = 300): Promise<boolean> {
  if (!sigHeader || !secret) return false;
  const { t, v1 } = parseSigHeader(sigHeader);
  if (!t || v1.length === 0) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - t) > tolerance) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = toHex(await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${rawBody}`)));
  return v1.some((c) => timingSafeEqual(c, sig));
}

type RestHeaders = Record<string, string>;

function restHeaders(serviceKey: string, prefer = "return=representation"): RestHeaders {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    Prefer: prefer,
  };
}

async function fetchCheckoutSessionWithLines(
  secretKey: string,
  sessionId: string,
): Promise<Record<string, unknown> | null> {
  const url =
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}` +
    `?expand[]=line_items.data.price.product`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  if (!res.ok) return null;
  return await res.json();
}

function mapPaymentStatus(session: Record<string, unknown>): string {
  const ps = String(session.payment_status ?? "").toLowerCase();
  if (ps === "paid" || ps === "no_payment_required") return "paid";
  if (ps === "unpaid") return "pending";
  return "pending";
}

function parseSnapshots(meta: Record<string, string>): Array<Record<string, unknown>> {
  const raw = meta.item_snapshots;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function lineSnapshotsFromStripe(session: Record<string, unknown>): Array<{
  product_name_snapshot: string;
  variant_snapshot: string | null;
  product_id: string | null;
  quantity: number;
  unit_price_cents: number;
  discount_cents: number;
  line_total_cents: number;
}> {
  const lineItems = (session.line_items as { data?: Array<Record<string, unknown>> } | undefined)?.data ?? [];
  return lineItems.map((li) => {
    const price = li.price as Record<string, unknown> | undefined;
    const product = price?.product;
    const productName =
      (typeof product === "object" && product && (product as { name?: string }).name) ||
      (li.description as string) ||
      "Item";
    const quantity = typeof li.quantity === "number" && li.quantity > 0 ? li.quantity : 1;
    const unit =
      typeof price?.unit_amount === "number"
        ? price.unit_amount
        : Math.round(Number(li.amount_subtotal ?? li.amount_total ?? 0) / quantity);
    const discount = Number(li.amount_discount ?? 0);
    const lineTotal = Number(li.amount_total ?? unit * quantity - discount);
    return {
      product_name_snapshot: String(productName),
      variant_snapshot: null,
      product_id: null,
      quantity,
      unit_price_cents: Math.max(0, unit),
      discount_cents: Math.max(0, discount),
      line_total_cents: Math.max(0, lineTotal),
    };
  });
}

async function upsertOrderFromCheckoutSession(
  supabaseUrl: string,
  serviceKey: string,
  stripeSecret: string,
  eventObj: Record<string, unknown>,
): Promise<{ created: boolean; duplicate: boolean; error?: string }> {
  const sessionId = String(eventObj.id ?? "");
  if (!sessionId) return { created: false, duplicate: false, error: "missing session id" };

  // Idempotency: skip if an order already exists for this checkout session.
  const existingRes = await fetch(
    `${supabaseUrl}/rest/v1/orders?stripe_checkout_session_id=eq.${encodeURIComponent(sessionId)}&select=id&limit=1`,
    { headers: restHeaders(serviceKey, "return=representation") },
  );
  if (existingRes.ok) {
    const existing = await existingRes.json();
    if (Array.isArray(existing) && existing.length > 0) {
      return { created: false, duplicate: true };
    }
  }

  const full = (await fetchCheckoutSessionWithLines(stripeSecret, sessionId)) ?? eventObj;
  const meta = (full.metadata ?? {}) as Record<string, string>;
  const customerDetails = (full.customer_details ?? {}) as { email?: string; name?: string };
  const totalDetails = (full.total_details ?? {}) as {
    amount_discount?: number;
    amount_shipping?: number;
    amount_tax?: number;
  };

  const subtotal = Number(meta.subtotal_cents) || Number(full.amount_subtotal) || Number(full.amount_total) || 0;
  const discount = Number(meta.discount_cents) || Number(totalDetails.amount_discount) || 0;
  const shipping = Number(meta.shipping_cents) || Number(totalDetails.amount_shipping) || 0;
  const tax = Number(meta.tax_cents) || Number(totalDetails.amount_tax) || 0;
  const total = Number(full.amount_total) || subtotal - discount + shipping + tax;
  const paymentStatus = mapPaymentStatus(full);
  const orderStatus = paymentStatus === "paid" ? "payment_confirmed" : "order_received";
  const userId = (full.client_reference_id as string) || meta.customer_user_id || null;
  const freeEligible = meta.free_shipping_eligible === "true" || subtotal >= 50000;
  const requiresReview = meta.requires_provider_review === "true";

  const numberRes = await fetch(`${supabaseUrl}/rest/v1/rpc/generate_public_order_number`, {
    method: "POST",
    headers: restHeaders(serviceKey, "return=representation"),
    body: "{}",
  });
  let publicOrderNumber = "";
  if (numberRes.ok) {
    const n = await numberRes.json();
    publicOrderNumber = typeof n === "string" ? n : String(n);
  } else {
    // Fallback unique number if RPC not yet applied (local/dev).
    publicOrderNumber = `MBM-${new Date().getUTCFullYear()}-${String(Date.now()).slice(-6)}`;
  }

  const orderRow = {
    customer_user_id: userId && String(userId).length > 10 ? userId : null,
    customer_email: customerDetails.email || (full.customer_email as string) || meta.customer_email || "",
    customer_name: customerDetails.name || meta.customer_name || "",
    public_order_number: publicOrderNumber,
    stripe_checkout_session_id: sessionId,
    stripe_payment_intent_id: typeof full.payment_intent === "string" ? full.payment_intent : null,
    stripe_customer_id: typeof full.customer === "string" ? full.customer : null,
    order_status: orderStatus,
    payment_status: paymentStatus,
    subtotal_cents: Math.max(0, subtotal),
    discount_cents: Math.max(0, discount),
    shipping_cents: Math.max(0, shipping),
    tax_cents: Math.max(0, tax),
    total_cents: Math.max(0, total),
    shipping_method: meta.shipping_method || "",
    free_shipping_eligible: freeEligible,
    requires_provider_review: requiresReview,
    currency: "usd",
  };

  const insertOrder = await fetch(`${supabaseUrl}/rest/v1/orders`, {
    method: "POST",
    headers: restHeaders(serviceKey, "return=representation"),
    body: JSON.stringify(orderRow),
  });

  if (insertOrder.status === 409) {
    return { created: false, duplicate: true };
  }
  if (!insertOrder.ok) {
    const errText = await insertOrder.text();
    return { created: false, duplicate: false, error: errText };
  }

  const inserted = await insertOrder.json();
  const orderId = Array.isArray(inserted) ? inserted[0]?.id : inserted?.id;
  if (!orderId) return { created: false, duplicate: false, error: "missing order id after insert" };

  const metaSnaps = parseSnapshots(meta);
  let items = metaSnaps.map((s) => ({
    order_id: orderId,
    product_id: typeof s.productId === "string" ? s.productId : null,
    product_name_snapshot: String(s.productName ?? "Item"),
    variant_snapshot: typeof s.variantLabel === "string" ? s.variantLabel : null,
    quantity: Number(s.quantity) || 1,
    unit_price_cents: Math.max(0, Number(s.unitPriceCents) || 0),
    discount_cents: Math.max(0, Number(s.discountCents) || 0),
    line_total_cents: Math.max(0, Number(s.lineTotalCents) || 0),
  }));
  if (items.length === 0) {
    items = lineSnapshotsFromStripe(full).map((s) => ({ ...s, order_id: orderId }));
  }

  if (items.length > 0) {
    await fetch(`${supabaseUrl}/rest/v1/order_items`, {
      method: "POST",
      headers: restHeaders(serviceKey, "return=minimal"),
      body: JSON.stringify(items),
    });
  }

  await fetch(`${supabaseUrl}/rest/v1/order_fulfillment`, {
    method: "POST",
    headers: restHeaders(serviceKey, "return=minimal"),
    body: JSON.stringify({
      order_id: orderId,
      fulfillment_status: orderStatus,
      pharmacy_name: requiresReview ? "GEN Health dispensing pharmacy" : null,
    }),
  });

  const events = [
    {
      order_id: orderId,
      status: "order_received",
      customer_visible: true,
      created_by: "stripe_webhook",
    },
  ];
  if (orderStatus === "payment_confirmed") {
    events.push({
      order_id: orderId,
      status: "payment_confirmed",
      customer_visible: true,
      created_by: "stripe_webhook",
    });
  }
  await fetch(`${supabaseUrl}/rest/v1/order_status_events`, {
    method: "POST",
    headers: restHeaders(serviceKey, "return=minimal"),
    body: JSON.stringify(events),
  });

  return { created: true, duplicate: false };
}

async function markOrderRefunded(
  supabaseUrl: string,
  serviceKey: string,
  paymentIntentId: string | null,
  sessionId: string | null,
  partial: boolean,
): Promise<void> {
  let query = "";
  if (paymentIntentId) {
    query = `stripe_payment_intent_id=eq.${encodeURIComponent(paymentIntentId)}`;
  } else if (sessionId) {
    query = `stripe_checkout_session_id=eq.${encodeURIComponent(sessionId)}`;
  } else {
    return;
  }
  const payment_status = partial ? "partially_refunded" : "refunded";
  const order_status = partial ? undefined : "refunded";
  const body: Record<string, string> = { payment_status };
  if (order_status) body.order_status = order_status;

  await fetch(`${supabaseUrl}/rest/v1/orders?${query}`, {
    method: "PATCH",
    headers: restHeaders(serviceKey, "return=minimal"),
    body: JSON.stringify(body),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET_TEST") || Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY_TEST") || Deno.env.get("STRIPE_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret || !supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Webhook not configured" }), { status: 500 });
  }

  const rawBody = await req.text();
  const ok = await verify(rawBody, req.headers.get("Stripe-Signature"), secret);
  if (!ok) return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });

  let event: { id: string; type: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }

  const insertRes = await fetch(`${supabaseUrl}/rest/v1/processed_stripe_events`, {
    method: "POST",
    headers: restHeaders(serviceKey, "return=minimal"),
    body: JSON.stringify({ event_id: event.id, environment: ENVIRONMENT, type: event.type }),
  });

  if (insertRes.status === 409) {
    return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 });
  }
  if (!insertRes.ok && insertRes.status !== 201) {
    return new Response(JSON.stringify({ error: "Failed to record event" }), { status: 500 });
  }

  const obj = event.data?.object ?? {};

  switch (event.type) {
    case "checkout.session.completed": {
      if (stripeSecret) {
        const result = await upsertOrderFromCheckoutSession(
          supabaseUrl,
          serviceKey,
          stripeSecret,
          obj,
        );
        if (result.error) {
          console.error("order upsert error", result.error);
        }
      }
      break;
    }
    case "checkout.session.expired":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "invoice.paid":
    case "invoice.payment_failed":
      break;
    case "charge.refunded": {
      const pi = typeof obj.payment_intent === "string" ? obj.payment_intent : null;
      await markOrderRefunded(supabaseUrl, serviceKey, pi, null, false);
      break;
    }
    default:
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
