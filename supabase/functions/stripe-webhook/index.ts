import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Stripe webhook (TEST). Verifies the signature against the RAW body using the
// environment-specific secret, then processes each event at most once
// (processed_stripe_events). No PHI or medical detail is read from or written to Stripe.

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

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  // Prefer the test webhook secret; fall back to STRIPE_WEBHOOK_SECRET for backward compatibility.
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET_TEST") || Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret || !supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Webhook not configured" }), { status: 500 });
  }

  const rawBody = await req.text(); // RAW body required for signature verification
  const ok = await verify(rawBody, req.headers.get("Stripe-Signature"), secret);
  if (!ok) return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });

  let event: { id: string; type: string };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }

  // Idempotency: record the event id; if it already exists, acknowledge without reprocessing.
  const insertRes = await fetch(`${supabaseUrl}/rest/v1/processed_stripe_events`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ event_id: event.id, environment: ENVIRONMENT, type: event.type }),
  });

  if (insertRes.status === 409) {
    return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 });
  }
  if (!insertRes.ok && insertRes.status !== 201) {
    return new Response(JSON.stringify({ error: "Failed to record event" }), { status: 500 });
  }

  // Handle only the events this application needs. Keep processing side-effect-light here.
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.expired":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "invoice.paid":
    case "invoice.payment_failed":
      // Application-specific fulfillment/subscription bookkeeping would go here.
      // Do NOT store medical/intake detail in Stripe or echo it back.
      break;
    default:
      break; // Unhandled events are acknowledged, not errored.
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
