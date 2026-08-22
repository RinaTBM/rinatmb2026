import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Read-only payment status for card return page.
 * Validates payment_access_token. NEVER marks an order paid.
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const publicOrderNumber = String(body.publicOrderNumber ?? "").trim().toUpperCase();
    const paymentAccessToken = String(body.paymentAccessToken ?? "").trim();
    if (!publicOrderNumber || !paymentAccessToken) {
      return json({ error: "Order number and payment access token are required." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      return json({ error: "Order service is not configured." }, 500);
    }

    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?public_order_number=eq.${encodeURIComponent(publicOrderNumber)}&select=id,payment_status,public_order_number,payment_access_token,payment_method,payment_processor,total_cents,currency,gen_handoff_status&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    if (!orderRes.ok) {
      return json({ error: "Unable to look up order." }, 502);
    }
    const rows = await orderRes.json();
    const order = Array.isArray(rows) ? rows[0] : null;
    if (!order) {
      return json({ error: "order_not_found" }, 404);
    }
    if (
      typeof order.payment_access_token !== "string" ||
      order.payment_access_token !== paymentAccessToken
    ) {
      return json({ error: "invalid_token" }, 401);
    }

    let genCheckout: {
      status: string;
      genCheckoutSessionId: string | null;
      whopCheckoutConfigId: string | null;
      whopPaymentId: string | null;
      genOrderId: string | null;
    } | null = null;

    if (order.payment_method === "gen_whop" || order.payment_processor === "gen_whop") {
      const sessRes = await fetch(
        `${supabaseUrl}/rest/v1/gen_checkout_sessions?order_id=eq.${order.id}&select=status,gen_checkout_session_id,whop_checkout_config_id,whop_payment_id,gen_order_id&order=created_at.desc&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            apikey: serviceKey,
          },
        },
      );
      if (sessRes.ok) {
        const sessRows = await sessRes.json();
        const sess = Array.isArray(sessRows) ? sessRows[0] : null;
        if (sess) {
          genCheckout = {
            status: String(sess.status || "created"),
            genCheckoutSessionId: sess.gen_checkout_session_id ?? null,
            whopCheckoutConfigId: sess.whop_checkout_config_id ?? null,
            whopPaymentId: sess.whop_payment_id ?? null,
            genOrderId: sess.gen_order_id ?? null,
          };
        }
      }
    }

    // Never expose the token back to the client.
    // Never mutate payment_status — browser return is display-only.
    return json({
      ok: true,
      publicOrderNumber: order.public_order_number,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method ?? null,
      paymentProcessor: order.payment_processor ?? null,
      totalCents: order.total_cents,
      currency: order.currency || "usd",
      genHandoffStatus: order.gen_handoff_status ?? null,
      genCheckout,
      // Explicit: this endpoint never mutates payment_status.
      markedPaid: false,
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
