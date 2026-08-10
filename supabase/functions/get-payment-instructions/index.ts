import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Return invoice + bank instructions for an order after creation.
 * Requires payment_access_token issued at order creation (not a public catalog page).
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

function bankInstructionsFromEnv(method: string) {
  if (method === "manual_ach") {
    const bankName = Deno.env.get("MANUAL_ACH_BANK_NAME")?.trim();
    const accountName = Deno.env.get("MANUAL_ACH_ACCOUNT_NAME")?.trim();
    const routingNumber = Deno.env.get("MANUAL_ACH_ROUTING_NUMBER")?.trim();
    const accountNumber = Deno.env.get("MANUAL_ACH_ACCOUNT_NUMBER")?.trim();
    const configured = Boolean(bankName && accountName && routingNumber && accountNumber);
    if (!configured) {
      return {
        method,
        configured: false,
        unavailableMessage:
          "Bank transfer details are being prepared. Please contact us with your order number for payment instructions.",
      };
    }
    return {
      method,
      configured: true,
      bankName,
      accountName,
      routingNumber,
      accountNumber,
      additionalInstructions: Deno.env.get("MANUAL_ACH_ADDITIONAL_INSTRUCTIONS")?.trim() || undefined,
    };
  }
  if (method === "manual_wire") {
    const wireBankName = Deno.env.get("MANUAL_WIRE_BANK_NAME")?.trim();
    const wireRoutingNumber = Deno.env.get("MANUAL_WIRE_ROUTING_NUMBER")?.trim();
    const wireAccountNumber = Deno.env.get("MANUAL_WIRE_ACCOUNT_NUMBER")?.trim();
    const configured = Boolean(wireBankName && wireRoutingNumber && wireAccountNumber);
    if (!configured) {
      return {
        method,
        configured: false,
        unavailableMessage:
          "Wire transfer details are being prepared. Please contact us with your order number for payment instructions.",
      };
    }
    return {
      method,
      configured: true,
      wireBankName,
      wireRoutingNumber,
      wireAccountNumber,
      wireSwift: Deno.env.get("MANUAL_WIRE_SWIFT")?.trim() || undefined,
      accountName: Deno.env.get("MANUAL_WIRE_ACCOUNT_NAME")?.trim() || undefined,
      additionalInstructions: Deno.env.get("MANUAL_WIRE_ADDITIONAL_INSTRUCTIONS")?.trim() || undefined,
    };
  }
  return {
    method,
    configured: false,
    unavailableMessage: "Payment instructions are unavailable for this method.",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const publicOrderNumber = String(body.publicOrderNumber ?? "").trim().toUpperCase();
    const paymentAccessToken = String(body.paymentAccessToken ?? "").trim();
    if (!publicOrderNumber || !paymentAccessToken) {
      return json({ error: "Order number and access token are required." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) return json({ error: "Order service is not configured." }, 500);

    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?public_order_number=eq.${encodeURIComponent(publicOrderNumber)}&select=*&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    if (!orderRes.ok) return json({ error: "Unable to load order." }, 500);
    const rows = await orderRes.json();
    const order = Array.isArray(rows) ? rows[0] : null;
    if (!order) return json({ error: "Order not found." }, 404);
    if (order.payment_access_token !== paymentAccessToken) {
      return json({ error: "Invalid or expired payment link." }, 403);
    }

    const itemsRes = await fetch(
      `${supabaseUrl}/rest/v1/order_items?order_id=eq.${encodeURIComponent(order.id)}&select=*`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    const itemRows = itemsRes.ok ? await itemsRes.json() : [];

    const method = String(order.payment_method || "manual_ach");
    const invoice = {
      invoiceNumber: order.invoice_number || `INV-${publicOrderNumber}`,
      orderNumber: publicOrderNumber,
      paymentReference: order.payment_reference || publicOrderNumber,
      customerName: order.customer_name || "",
      customerEmail: order.customer_email || "",
      orderDateIso: order.created_at,
      paymentMethod: method,
      paymentStatus: order.payment_status || "awaiting_payment",
      items: (itemRows as Array<Record<string, unknown>>).map((r) => ({
        productId: typeof r.product_id === "string" ? r.product_id : undefined,
        productName: String(r.product_name_snapshot || "Item"),
        variantLabel: typeof r.variant_snapshot === "string" ? r.variant_snapshot : null,
        quantity: Number(r.quantity) || 1,
        unitPriceCents: Number(r.unit_price_cents) || 0,
        discountCents: Number(r.discount_cents) || 0,
        lineTotalCents: Number(r.line_total_cents) || 0,
      })),
      subtotalCents: Number(order.subtotal_cents) || 0,
      discountCents: Number(order.discount_cents) || 0,
      shippingCents: Number(order.shipping_cents) || 0,
      taxCents: Number(order.tax_cents) || 0,
      totalCents: Number(order.total_cents) || 0,
      shippingMethod: order.shipping_method || "",
      currency: order.currency || "usd",
      headline: "Order received — awaiting payment",
      memoInstruction:
        "Please include your order number in the memo/reference field. Processing begins after payment has been received and verified.",
    };

    return json({
      invoice,
      bankInstructions: bankInstructionsFromEnv(method),
    });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500);
  }
});
