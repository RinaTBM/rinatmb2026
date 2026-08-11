import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Create a manual invoice order (ACH / wire).
 * Does NOT call Stripe. Does NOT mark payment as paid.
 * Bank instructions come from Edge Function secrets only (never VITE_*).
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type PaymentMethod = "manual_ach" | "manual_wire";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function createPaymentAccessToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function bankInstructionsFromEnv(method: PaymentMethod) {
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const paymentMethod = body.paymentMethod as string;
    if (paymentMethod !== "manual_ach" && paymentMethod !== "manual_wire") {
      return json({ error: "Please select ACH / Bank Transfer or Domestic Wire Transfer." }, 400);
    }

    const customerEmail = String(body.customerEmail ?? "").trim();
    const customerName = String(body.customerName ?? "").trim();
    if (!customerEmail.includes("@")) return json({ error: "A valid email is required." }, 400);
    if (!customerName) return json({ error: "Customer name is required." }, 400);

    const subtotalCents = Number(body.subtotalCents) || 0;
    const discountCents = Number(body.discountCents) || 0;
    const shippingCents = Number(body.shippingCents) || 0;
    const taxCents = Number(body.taxCents) || 0;
    const totalCents = Number(body.totalCents);
    const expected = subtotalCents - discountCents + shippingCents + taxCents;
    if (!Number.isInteger(totalCents) || totalCents !== expected || totalCents < 0) {
      return json({ error: "Order total does not reconcile. Please refresh checkout and try again." }, 400);
    }

    const shippingMethod = String(body.shippingMethod ?? "");
    const allowedShipping = new Set(["two_day", "next_day", "free_over_500", "none"]);
    if (!allowedShipping.has(shippingMethod) || shippingMethod === "standard") {
      return json({ error: "Invalid shipping method. Choose Two-Day or Next-Day shipping." }, 400);
    }

    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) return json({ error: "Your cart is empty." }, 400);

    // Idempotency: reject empty-token duplicates only via unique order numbers from RPC.
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      return json({ error: "Order service is not configured." }, 500);
    }

    const numberRes = await fetch(`${supabaseUrl}/rest/v1/rpc/generate_public_order_number`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    if (!numberRes.ok) {
      const t = await numberRes.text();
      return json({ error: `Unable to allocate order number: ${t}` }, 500);
    }
    const publicOrderNumber = String(await numberRes.json()).trim().toUpperCase();
    const paymentAccessToken = createPaymentAccessToken();
    const paymentReference = publicOrderNumber;
    const invoiceNumber = `INV-${publicOrderNumber}`;
    const now = new Date().toISOString();

    const orderInsert = {
      customer_user_id: body.customerUserId || null,
      customer_email: customerEmail,
      customer_name: customerName,
      public_order_number: publicOrderNumber,
      stripe_checkout_session_id: null,
      stripe_payment_intent_id: null,
      stripe_customer_id: null,
      order_status: "order_received",
      payment_status: "awaiting_payment",
      payment_method: paymentMethod,
      payment_reference: paymentReference,
      invoice_number: invoiceNumber,
      payment_access_token: paymentAccessToken,
      subtotal_cents: subtotalCents,
      discount_cents: discountCents,
      shipping_cents: shippingCents,
      tax_cents: taxCents,
      total_cents: totalCents,
      shipping_method: shippingMethod,
      free_shipping_eligible: Boolean(body.freeShippingEligible),
      currency: "usd",
      requires_provider_review: Boolean(body.requiresProviderReview),
    };

    const orderRes = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(orderInsert),
    });
    if (!orderRes.ok) {
      const t = await orderRes.text();
      return json({
        error:
          t.includes("payment_status") || t.includes("payment_method")
            ? "Orders database needs the manual-payment migration before invoice checkout can run."
            : `Unable to create order: ${t}`,
      }, 500);
    }
    const orderRows = await orderRes.json();
    const order = Array.isArray(orderRows) ? orderRows[0] : orderRows;
    const orderId = order.id as string;

    const itemRows = items.map((i: Record<string, unknown>) => {
      const qty = Math.max(1, Number(i.quantity) || 1);
      const unit = Math.max(0, Number(i.unitAmountCents) || 0);
      const line = unit * qty;
      const formulation = typeof i.requestedFormulation === "string" ? i.requestedFormulation : null;
      const variantParts = [
        typeof i.variantLabel === "string" ? i.variantLabel : null,
        formulation ? `Requested dose: ${formulation}` : null,
      ].filter(Boolean);
      const sku = typeof i.sku === "string" && i.sku.trim() ? i.sku.trim() : null;
      const variantId = typeof i.variantId === "string" && i.variantId.trim() ? i.variantId.trim() : null;
      const fulfillmentSku =
        typeof i.fulfillmentSku === "string" && i.fulfillmentSku.trim()
          ? i.fulfillmentSku.trim()
          : null;
      return {
        order_id: orderId,
        product_id: typeof i.productId === "string" ? i.productId : null,
        product_name_snapshot: String(i.productName || "Item"),
        variant_snapshot: variantParts.length ? variantParts.join(" · ") : null,
        sku,
        variant_id: variantId,
        fulfillment_sku: fulfillmentSku,
        quantity: qty,
        unit_price_cents: unit,
        discount_cents: 0,
        line_total_cents: line,
      };
    });

    const itemsRes = await fetch(`${supabaseUrl}/rest/v1/order_items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(itemRows),
    });
    if (!itemsRes.ok) {
      return json({ error: `Order created but items failed: ${await itemsRes.text()}` }, 500);
    }

    await fetch(`${supabaseUrl}/rest/v1/order_fulfillment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        order_id: orderId,
        fulfillment_status: "order_received",
      }),
    });

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
        status: "order_received",
        customer_visible: true,
        note: "Order submitted — awaiting payment",
        created_by: "system",
      }),
    });

    const invoiceItems = itemRows.map((r: { product_id: string | null; product_name_snapshot: string; variant_snapshot: string | null; quantity: number; unit_price_cents: number; discount_cents: number; line_total_cents: number }) => ({
      productId: r.product_id ?? undefined,
      productName: r.product_name_snapshot,
      variantLabel: r.variant_snapshot,
      quantity: r.quantity,
      unitPriceCents: r.unit_price_cents,
      discountCents: r.discount_cents,
      lineTotalCents: r.line_total_cents,
    }));

    const invoice = {
      invoiceNumber,
      orderNumber: publicOrderNumber,
      paymentReference,
      customerName,
      customerEmail,
      orderDateIso: now,
      paymentMethod,
      paymentStatus: "awaiting_payment",
      items: invoiceItems,
      subtotalCents,
      discountCents,
      shippingCents,
      taxCents,
      totalCents,
      shippingMethod,
      currency: "usd",
      headline: "Order received — awaiting payment",
      memoInstruction:
        "Please include your order number in the memo/reference field. Processing begins after payment has been received and verified.",
    };

    const bankInstructions = bankInstructionsFromEnv(paymentMethod);
    const paymentPath =
      `/order/payment/${encodeURIComponent(publicOrderNumber)}?token=${encodeURIComponent(paymentAccessToken)}`;

    return json({
      orderId,
      publicOrderNumber,
      paymentAccessToken,
      paymentPath,
      invoice,
      bankInstructions,
    });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500);
  }
});
