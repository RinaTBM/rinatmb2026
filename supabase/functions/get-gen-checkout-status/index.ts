import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Read-only GEN/Whop checkout correlation status.
 * Validates payment_access_token. NEVER marks an order paid.
 * Payment truth must come from future server-side Whop/GEN reconcile/webhook.
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
    const body = await req.json().catch(() => ({}));
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

    const headers = {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
    };

    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?public_order_number=eq.${encodeURIComponent(publicOrderNumber)}&select=id,payment_status,payment_method,payment_processor,payment_access_token,public_order_number,total_cents,currency&limit=1`,
      { headers },
    );
    if (!orderRes.ok) return json({ error: "Unable to look up order." }, 502);
    const orders = await orderRes.json();
    const order = Array.isArray(orders) ? orders[0] : null;
    if (!order) return json({ error: "order_not_found" }, 404);
    if (order.payment_access_token !== paymentAccessToken) {
      return json({ error: "invalid_token" }, 401);
    }

    const sessRes = await fetch(
      `${supabaseUrl}/rest/v1/gen_checkout_sessions?order_id=eq.${order.id}&select=*&order=created_at.desc&limit=1`,
      { headers },
    );
    const sessRows = sessRes.ok ? await sessRes.json() : [];
    const sess = Array.isArray(sessRows) ? sessRows[0] : null;

    return json({
      ok: true,
      publicOrderNumber: order.public_order_number,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      paymentProcessor: order.payment_processor,
      totalCents: order.total_cents,
      currency: order.currency || "usd",
      session: sess
        ? {
          status: sess.status,
          genCheckoutSessionId: sess.gen_checkout_session_id,
          whopCheckoutConfigId: sess.whop_checkout_config_id,
          whopPaymentId: sess.whop_payment_id ?? null,
          genOrderId: sess.gen_order_id ?? null,
          genPatientId: sess.gen_patient_id ?? null,
          mbmSku: sess.mbm_sku,
          purchaseMode: sess.purchase_mode,
          expectedAmountCents: sess.expected_amount_cents,
          correlationId: sess.correlation_id,
          // Never return whop_checkout_url on status polls (avoid re-open races in UI)
        }
        : null,
      // Correlation chain (explicit for ops / future webhook)
      correlation: {
        mbmOrder: order.public_order_number,
        genSession: sess?.gen_checkout_session_id ?? null,
        whopConfig: sess?.whop_checkout_config_id ?? null,
        whopPayment: sess?.whop_payment_id ?? null,
        genOrder: sess?.gen_order_id ?? null,
        genPatient: sess?.gen_patient_id ?? null,
      },
      markedPaid: false,
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
