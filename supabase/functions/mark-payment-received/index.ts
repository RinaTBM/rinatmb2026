import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Admin-only: mark an invoice order payment as received.
 * Does not collect bank credentials. Does not call Stripe.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const auth = req.headers.get("Authorization") || "";
    const jwt = auth.replace(/^Bearer\s+/i, "").trim();
    if (!jwt) return json({ error: "Admin authorization required." }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !serviceKey || !anonKey) {
      return json({ error: "Order service is not configured." }, 500);
    }

    // Validate caller via Auth + is_admin RPC.
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${jwt}`, apikey: anonKey },
    });
    if (!userRes.ok) return json({ error: "Invalid admin session." }, 401);
    const user = await userRes.json();
    const userId = user?.id as string | undefined;
    if (!userId) return json({ error: "Invalid admin session." }, 401);

    const adminRes = await fetch(`${supabaseUrl}/rest/v1/rpc/is_admin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: userId }),
    });
    const isAdmin = adminRes.ok ? await adminRes.json() : false;
    if (!isAdmin) return json({ error: "Admin authorization required." }, 403);

    const body = await req.json();
    const orderId = String(body.orderId ?? "").trim();
    const confirmedTotalCents = Number(body.confirmedTotalCents);
    const paymentNote = typeof body.paymentNote === "string" ? body.paymentNote.trim() : "";
    const confirm = body.confirm === true;
    if (!orderId) return json({ error: "Order id is required." }, 400);
    if (!confirm) return json({ error: "Confirmation is required before marking payment received." }, 400);

    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=*&limit=1`,
      { headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey } },
    );
    if (!orderRes.ok) return json({ error: "Unable to load order." }, 500);
    const rows = await orderRes.json();
    const order = Array.isArray(rows) ? rows[0] : null;
    if (!order) return json({ error: "Order not found." }, 404);

    const current = String(order.payment_status || "");
    const allowedFrom = new Set(["awaiting_payment", "payment_under_review", "pending"]);
    if (!allowedFrom.has(current)) {
      return json({ error: `Cannot mark payment received from status "${current}".` }, 400);
    }
    if (confirmedTotalCents !== Number(order.total_cents)) {
      return json({ error: "Confirmed amount must match the order total due." }, 400);
    }

    const paidAt = new Date().toISOString();
    const adminIdentity = (user.email as string) || userId;
    const patchRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          payment_status: "paid",
          paid_at: paidAt,
          paid_marked_by: adminIdentity,
          payment_admin_note: paymentNote || null,
          order_status: "payment_confirmed",
        }),
      },
    );
    if (!patchRes.ok) return json({ error: await patchRes.text() }, 500);

    await fetch(
      `${supabaseUrl}/rest/v1/order_fulfillment?order_id=eq.${encodeURIComponent(orderId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ fulfillment_status: "payment_confirmed" }),
      },
    );

    await fetch(`${supabaseUrl}/rest/v1/order_status_events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        order_id: orderId,
        status: "payment_confirmed",
        customer_visible: true,
        note: "Payment marked received by admin",
        created_by: adminIdentity,
      }),
    });

    if (paymentNote) {
      await fetch(`${supabaseUrl}/rest/v1/order_admin_notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          order_id: orderId,
          note: `Payment received note: ${paymentNote}`,
          created_by: userId,
        }),
      });
    }

    return json({
      ok: true,
      orderId,
      publicOrderNumber: order.public_order_number,
      paymentStatus: "paid",
      paidAt,
    });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500);
  }
});
