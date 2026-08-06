import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CartItemRequest {
  productId: string;
  quantity: number;
  subscription?: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!secretKey) {
    return new Response(JSON.stringify({ error: "Stripe not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { items } = await req.json() as { items: CartItemRequest[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up Stripe price IDs from the database
    const productIds = items.map((i) => i.productId);
    const lookupRes = await fetch(
      `${supabaseUrl}/rest/v1/stripe_products?app_product_id=in.(${productIds.join(",")})`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );

    if (!lookupRes.ok) {
      return new Response(JSON.stringify({ error: "Failed to look up products" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dbProducts = await lookupRes.json() as Array<{
      app_product_id: string;
      stripe_product_id: string;
      stripe_price_id: string | null;
      name: string;
      price: number;
      is_recurring: boolean;
    }>;

    const productMap = new Map(dbProducts.map((p) => [p.app_product_id, p]));

    const lineItems: Array<Record<string, string>> = [];
    let hasVariablePricing = false;

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        return new Response(JSON.stringify({ error: `Product ${item.productId} not synced to Stripe` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!dbProduct.stripe_price_id) {
        hasVariablePricing = true;
        continue;
      }

      lineItems.push({
        price: dbProduct.stripe_price_id,
        quantity: String(item.quantity),
      });
    }

    if (hasVariablePricing && lineItems.length === 0) {
      return new Response(JSON.stringify({
        error: "Your cart contains only items with provider-determined pricing (e.g. HRT). After checkout you will complete a medical intake and, if needed, a consultation and lab review. Once your provider finalizes your treatment plan, you will receive an invoice for the exact cost before any charges are made.",
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const origin = req.headers.get("origin") || "https://mybaremethod.com";

    const sessionBody: Record<string, string> = {
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      "metadata[order_source]": "web",
    };

    // If any line item is recurring, use subscription mode
    const hasRecurring = dbProducts.some(
      (p) => p.is_recurring && items.some((i) => i.productId === p.app_product_id && i.subscription)
    );

    if (hasRecurring) {
      sessionBody.mode = "subscription";
      sessionBody.success_url = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
    }

    // Add line items as form params
    const params = new URLSearchParams(sessionBody);
    lineItems.forEach((li, idx) => {
      params.append(`line_items[${idx}][price]`, li.price);
      params.append(`line_items[${idx}][quantity]`, li.quantity);
    });

    const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!sessionRes.ok) {
      const err = await sessionRes.text();
      return new Response(JSON.stringify({ error: `Stripe error: ${err}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = await sessionRes.json();

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
