import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Cancel a Tagada wellness membership subscription after MBM 3-month minimum.
 * Uses official POST /api/public/v1/subscriptions/cancel.
 * Does NOT invent a Tagada cancellation lock — MBM enforces minimum_term_ends_at.
 */

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

function apiBase(): string {
  const env = Deno.env.get("TAGADA_API_BASE")?.trim();
  if (env) return env.replace(/\/$/, "");
  const mode = Deno.env.get("TAGADA_ENV")?.trim().toLowerCase();
  if (mode === "sandbox" || mode === "dev") return "https://api.tagada.dev";
  return "https://api.tagada.io";
}

const MINIMUM_BLOCK =
  "Your membership has a 3-month minimum commitment. Cancellation will be available after your initial term.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const membershipId = String(body.membershipId ?? "").trim();
    const cancelAtPeriodEnd = body.cancelAtPeriodEnd !== false;
    if (!membershipId) return json({ error: "membershipId is required." }, 400);

    const apiKey = Deno.env.get("TAGADA_API_KEY")?.trim();
    if (!apiKey) return json({ error: "Tagada API is not configured." }, 503);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) return json({ error: "Order service is not configured." }, 500);

    const memRes = await fetch(
      `${supabaseUrl}/rest/v1/customer_memberships?id=eq.${encodeURIComponent(membershipId)}&select=*&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    if (!memRes.ok) return json({ error: "Unable to load membership." }, 500);
    const rows = await memRes.json();
    const membership = Array.isArray(rows) ? rows[0] : null;
    if (!membership) return json({ error: "Membership not found." }, 404);

    const status = String(membership.status || "");
    if (status === "canceled") {
      return json({ ok: true, alreadyCanceled: true });
    }
    if (!["active", "past_due", "paused", "cancel_scheduled", "payment_issue"].includes(status)) {
      return json({ error: `Cannot cancel membership in status "${status}".` }, 409);
    }

    const minimumEnds = membership.minimum_term_ends_at
      ? new Date(String(membership.minimum_term_ends_at))
      : null;
    if (!minimumEnds || Number.isNaN(minimumEnds.getTime()) || Date.now() < minimumEnds.getTime()) {
      return json({ error: MINIMUM_BLOCK, code: "MINIMUM_TERM_ACTIVE" }, 403);
    }

    const subscriptionId = String(membership.tagada_subscription_id || "").trim();
    if (!subscriptionId) {
      return json({
        error: "Membership has no Tagada subscription id yet. Please contact us for assistance.",
      }, 409);
    }

    const cancelRes = await fetch(`${apiBase()}/api/public/v1/subscriptions/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriptionIds: [subscriptionId],
        cancelAtPeriodEnd,
      }),
    });
    if (!cancelRes.ok) {
      return json({
        error: "Unable to cancel Tagada subscription.",
        detail: await cancelRes.text(),
      }, 502);
    }

    const now = new Date().toISOString();
    await fetch(`${supabaseUrl}/rest/v1/customer_memberships?id=eq.${membership.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: cancelAtPeriodEnd ? "cancel_scheduled" : "canceled",
        cancel_scheduled_at: cancelAtPeriodEnd ? now : membership.cancel_scheduled_at,
        canceled_at: cancelAtPeriodEnd ? null : now,
        updated_at: now,
      }),
    });

    return json({
      ok: true,
      membershipId: membership.id,
      cancelAtPeriodEnd,
      status: cancelAtPeriodEnd ? "cancel_scheduled" : "canceled",
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
