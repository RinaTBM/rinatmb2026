import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type ProductSeed = {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  type?: "one_time" | "recurring";
  interval?: "month";
};

const products: ProductSeed[] = [
  // Renamed for the 2026 relaunch (customer-facing display names). Prices/IDs unchanged
  // to preserve the existing Stripe price mapping. NOTE: relaunch variant prices differ
  // from these synced base prices and new products (p68-p71) still require a Stripe sync.
  { id: "p1", name: "Semaglutide + B6 Injection", price: 186, shortDescription: "Provider-directed weight-management injection pairing semaglutide with vitamin B6." },
  { id: "p2", name: "Semaglutide + B12 Injection", price: 186, shortDescription: "Provider-directed semaglutide injection combined with B12." },
  { id: "p3", name: "Semaglutide + L-Carnitine Injection", price: 186, shortDescription: "Provider-directed semaglutide injection combined with L-Carnitine." },
  { id: "p4", name: "Semaglutide + Glycine Injection", price: 186, shortDescription: "Provider-directed semaglutide injection combined with glycine." },
  { id: "p5", name: "Tirzepatide + B6 Injection", price: 211, shortDescription: "Provider-directed weight-management injection pairing tirzepatide with vitamin B6." },
  { id: "p6", name: "Tirzepatide + B12 Injection", price: 211, shortDescription: "Provider-directed tirzepatide injection combined with B12." },
  { id: "p7", name: "Tirzepatide + L-Carnitine Injection", price: 211, shortDescription: "Provider-directed tirzepatide injection combined with L-Carnitine." },
  { id: "p8", name: "Tirzepatide + Glycine Injection", price: 211, shortDescription: "Provider-directed tirzepatide injection combined with glycine." },
  { id: "p9", name: "NAD+ Injection", price: 186, shortDescription: "NAD+ injection to support cellular energy, DNA repair, and healthy aging." },
  { id: "p10", name: "NAD+ Nasal Spray", price: 186, shortDescription: "NAD+ nasal spray for convenient daily cellular energy support." },
  { id: "p11", name: "Glutathione Injection", price: 186, shortDescription: "Glutathione injection for powerful antioxidant support, detoxification, and skin health." },
  { id: "p12", name: "Sermorelin Injection", price: 211, shortDescription: "Sermorelin injection to support natural growth hormone production and recovery." },
  { id: "p13", name: "Sermorelin Capsules", price: 211, shortDescription: "Sermorelin capsules for convenient daily growth hormone support." },
  { id: "p14", name: "B12 Injection", price: 49, shortDescription: "B12 injection for energy production, metabolism, and nervous system health." },
  { id: "p15", name: "Estrogen Tablets/Capsules", price: 0, shortDescription: "Oral estrogen therapy for symptom relief and hormone balance." },
  { id: "p16", name: "Estrogen Transdermal Patch", price: 0, shortDescription: "Estrogen transdermal patch for steady, consistent hormone delivery through the skin." },
  { id: "p17", name: "Estrogen Topical Gel", price: 0, shortDescription: "Estrogen topical gel for daily hormone delivery with adjustable dosing." },
  { id: "p18", name: "Estrogen Topical Spray", price: 0, shortDescription: "Estrogen topical spray for convenient, quick-drying daily hormone delivery." },
  { id: "p19", name: "Estrogen Vaginal Cream", price: 0, shortDescription: "Estrogen vaginal cream for localized symptom relief and vaginal health." },
  { id: "p20", name: "Estrogen Vaginal Tablets", price: 0, shortDescription: "Estrogen vaginal tablets for localized delivery and vaginal health support." },
  { id: "p21", name: "Estrogen Vaginal Ring", price: 0, shortDescription: "Estrogen vaginal ring for continuous, low-dose hormone delivery over 3 months." },
  { id: "p22", name: "Estrogen Pellets", price: 0, shortDescription: "Estrogen pellets for continuous, long-acting hormone delivery over several months." },
  { id: "p23", name: "Progesterone Capsules", price: 0, shortDescription: "Oral progesterone capsules for hormone balance and sleep support." },
  { id: "p24", name: "Sustained-Release Progesterone", price: 0, shortDescription: "Sustained-release progesterone for steady hormone delivery throughout the day and night." },
  { id: "p25", name: "Progesterone Cream", price: 0, shortDescription: "Topical progesterone cream for convenient daily hormone delivery." },
  { id: "p26", name: "Progesterone Troches", price: 0, shortDescription: "Progesterone troches for sublingual absorption and convenient delivery." },
  { id: "p27", name: "Testosterone Cream", price: 0, shortDescription: "Testosterone cream for women to support libido, energy, and vitality." },
  { id: "p28", name: "Testosterone Gel", price: 0, shortDescription: "Testosterone gel for daily hormone delivery and vitality support." },
  { id: "p29", name: "Testosterone Injections", price: 0, shortDescription: "Testosterone injections for women seeking steady hormone delivery." },
  { id: "p30", name: "Testosterone Pellets", price: 0, shortDescription: "Testosterone pellets for continuous, long-acting hormone delivery." },
  { id: "p31", name: "Testosterone Troches", price: 0, shortDescription: "Testosterone troches for sublingual absorption and convenient delivery." },
  { id: "p32", name: "Bi-Est", price: 0, shortDescription: "Bi-Est combination therapy blending estriol and estradiol for balanced estrogen support." },
  { id: "p33", name: "Tri-Est", price: 0, shortDescription: "Tri-Est combination therapy blending estriol, estradiol, and estrone for comprehensive support." },
  { id: "p34", name: "Estrogen + Progesterone", price: 0, shortDescription: "Estrogen and progesterone combined for balanced hormone replacement therapy." },
  { id: "p35", name: "Estrogen + Progesterone + Testosterone", price: 0, shortDescription: "Comprehensive triple hormone therapy combining estrogen, progesterone, and testosterone." },
  { id: "p36", name: "Initial Provider Consultation", price: 149, shortDescription: "A comprehensive consultation with a licensed provider to review your history and build your personalized plan." },
  { id: "p37", name: "Follow-Up Appointment", price: 79, shortDescription: "A follow-up consultation to review your progress and adjust your plan as needed." },
  { id: "p38", name: "Laboratory Review", price: 99, shortDescription: "A provider-reviewed analysis of your lab results with personalized recommendations." },
  { id: "p39", name: "IV Hydration Therapy", price: 129, shortDescription: "IV hydration therapy with vitamins and minerals for recovery, energy, and wellness." },
  { id: "p40", name: "GHK-Cu Injection", price: 254, shortDescription: "Research-grade GHK-Cu copper peptide injection for tissue repair and longevity studies." },
  { id: "p41", name: "BPC-157 / TB-500 Injection", price: 254, shortDescription: "Research-grade BPC-157 and TB-500 blend injection for tissue repair and recovery studies." },
  { id: "p42", name: "BPC-157 / TB-500 Capsules", price: 254, shortDescription: "Research-grade BPC-157 and TB-500 in capsule form for laboratory research." },
  { id: "p43", name: "Tesamorelin / Ipamorelin Injection", price: 211, shortDescription: "Research-grade tesamorelin and ipamorelin blend for growth hormone studies." },
  { id: "p44", name: "Tesamorelin / KPV Injection", price: 211, shortDescription: "Research-grade tesamorelin and KPV blend for growth hormone and inflammation studies." },
  { id: "p45", name: "MOTS-c Injection", price: 186, shortDescription: "Research-grade MOTS-c injection for mitochondrial function and metabolic research." },
  { id: "p46", name: "Thymosin Alpha-1 Injection", price: 211, shortDescription: "Research-grade thymosin alpha-1 injection for immune function research." },
  { id: "p47", name: "Semax Nasal Spray", price: 186, shortDescription: "Research-grade semax nasal spray for cognitive function and neuroprotection studies." },
  { id: "p48", name: "Selank Nasal Spray", price: 186, shortDescription: "Research-grade selank nasal spray for anxiety and cognitive studies." },
  { id: "p49", name: "PT-141 Nasal Spray", price: 254, shortDescription: "Research-grade PT-141 nasal spray for reproductive wellness studies." },
  { id: "p50", name: "Dihexa Capsules", price: 186, shortDescription: "Research-grade dihexa capsules for cognitive enhancement and neurogenesis studies." },
  { id: "p51", name: "Methylene Blue", price: 186, shortDescription: "Research-grade methylene blue for mitochondrial function and cellular energy studies." },
  { id: "p52", name: "KLOW/GLOW Injection", price: 254, shortDescription: "Research-grade KLOW/GLOW injection for skin and beauty peptide studies." },
  { id: "p53", name: "PT-141 Injection", price: 254, shortDescription: "Research-grade PT-141 injection for reproductive wellness studies." },
  { id: "p54", name: "Oxytocin", price: 254, shortDescription: "Research-grade oxytocin for social bonding and wellness studies." },
  { id: "p55", name: "Tadalafil", price: 186, shortDescription: "Research-grade tadalafil for circulatory and vascular function studies." },
  { id: "p56", name: "Premium 3D Printed Peptide Case", price: 34, shortDescription: "A custom 3D-printed case with precision-cut compartments designed to hold your peptide vials, syringes, and supplies securely." },
  { id: "p57", name: "Temperature-Controlled Travel Case", price: 59, shortDescription: "An insulated travel case with a built-in thermal lining that maintains temperature for up to 48 hours for transporting peptide vials." },
  { id: "p58", name: "Discreet Travel Bag", price: 39, shortDescription: "A sleek, vegan-leather travel bag with water-resistant lining designed to hold your entire therapy kit discreetly." },
  { id: "p59", name: "Reusable Ice Pack", price: 12, shortDescription: "A reusable gel ice pack designed to keep your peptide vials cold during transport. Non-toxic and long-lasting." },
  { id: "p60", name: "Daily & Weekly Wellness Planner", price: 29, shortDescription: "A daily/weekly planner with habit trackers, wellness goals, and progress reflection sections designed around your therapy routine." },
  { id: "p61", name: "Sharps Container", price: 10, shortDescription: "An FDA-cleared sharps container for the safe disposal of used syringes and needles. Secure, puncture-resistant, and easy to use." },
  { id: "p62", name: "Alcohol Prep Wipes (100 Count)", price: 9, shortDescription: "Individually wrapped 70% isopropyl alcohol prep pads for safe injection site preparation. 100-count box." },
  { id: "p63", name: "Alcohol Prep Wipes (200 Count)", price: 15, shortDescription: "Individually wrapped 70% isopropyl alcohol prep pads for safe injection site preparation. 200-count box with better value." },
  { id: "p64", name: "Premium Insulin Syringes (10 Pack)", price: 12, shortDescription: "Sterile insulin syringes for subcutaneous injections. 10-pack, perfect for getting started. 30G, 0.5mL, 1/2 inch needle." },
  { id: "p65", name: "Premium Insulin Syringes (50 Pack)", price: 39, shortDescription: "Sterile insulin syringes for subcutaneous injections. 50-pack with better value per syringe. 30G, 0.5mL, 1/2 inch needle." },
  { id: "p66", name: "Premium Insulin Syringes (100 Pack)", price: 69, shortDescription: "Sterile insulin syringes for subcutaneous injections. 100-pack with the best value for long-term therapy. 30G, 0.5mL, 1/2 inch needle." },
  { id: "p67", name: "Complete Injection Starter Kit", price: 119, shortDescription: "The ultimate starter kit: 3D printed peptide case, temperature-controlled travel case, discreet travel bag, reusable ice pack, wellness planner, sharps container, alcohol prep wipes, and insulin syringes. Save $71 versus buying separately." },
  // 2026 weight-membership relaunch: locked monthly rates. Recurring; used by membership checkout.
  { id: "m1", name: "Semaglutide Membership", price: 199, shortDescription: "Locked-price provider-guided Semaglutide membership. Provider determines formulation and strength.", type: "recurring", interval: "month" },
  { id: "m2", name: "Tirzepatide Membership", price: 249, shortDescription: "Locked-price provider-guided Tirzepatide membership through the included program maximum (25mg/2mg per mL, 2mL).", type: "recurring", interval: "month" },
];

function abbreviate(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length <= 4 ? w : w.slice(0, 4)))
    .join(" ")
    .trim();
}

async function upsertStripeProduct(
  supabaseUrl: string,
  serviceKey: string,
  row: {
    app_product_id: string;
    stripe_product_id: string;
    stripe_price_id: string | null;
    name: string;
    price: number;
    is_recurring: boolean;
  }
) {
  const res = await fetch(`${supabaseUrl}/rest/v1/stripe_products?app_product_id=eq.${row.app_product_id}`, {
    method: "GET",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
  });
  const existing = await res.json();

  const body = {
    app_product_id: row.app_product_id,
    stripe_product_id: row.stripe_product_id,
    stripe_price_id: row.stripe_price_id,
    name: row.name,
    price: row.price,
    is_recurring: row.is_recurring,
    updated_at: new Date().toISOString(),
  };

  if (existing && existing.length > 0) {
    await fetch(`${supabaseUrl}/rest/v1/stripe_products?app_product_id=eq.${row.app_product_id}`, {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    });
  } else {
    await fetch(`${supabaseUrl}/rest/v1/stripe_products`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    });
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Legacy function — TEST MODE ONLY. Prefer stripe-sync for authenticated admin sync.
  const secretKey = Deno.env.get("STRIPE_SECRET_KEY_TEST") || Deno.env.get("STRIPE_SECRET_KEY");
  if (!secretKey) {
    return new Response(JSON.stringify({ error: "STRIPE_SECRET_KEY_TEST not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (secretKey.startsWith("sk_live_") || secretKey.startsWith("rk_live_")) {
    return new Response(JSON.stringify({ error: "Refusing LIVE Stripe key. sync-stripe-products is TEST-only." }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("rk_test_")) {
    return new Response(JSON.stringify({ error: "Provided key is not a Stripe TEST key." }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Supabase env vars not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results: { id: string; name: string; abbreviation: string; price: number; productId?: string; priceId?: string; error?: string }[] = [];

  for (const product of products) {
    const abbrev = abbreviate(product.name);
    const unitAmount = Math.round(product.price * 100);

    try {
      const productRes = await fetch("https://api.stripe.com/v1/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          name: abbrev,
          description: product.shortDescription,
          "metadata[app_id]": product.id,
        }),
      });

      if (!productRes.ok) {
        const err = await productRes.text();
        results.push({ id: product.id, name: product.name, abbreviation: abbrev, price: product.price, error: `Product: ${err}` });
        continue;
      }

      const productData = await productRes.json();
      const productId = productData.id;

      let priceId: string | null = null;
      if (unitAmount > 0) {
        const isRecurring = product.type === "recurring";
        const priceBody: Record<string, string> = {
          product: productId,
          unit_amount: String(unitAmount),
          currency: "usd",
        };
        if (isRecurring) {
          priceBody["recurring[interval]"] = product.interval || "month";
          priceBody["recurring[interval_count]"] = "1";
        }
        const priceRes = await fetch("https://api.stripe.com/v1/prices", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(priceBody),
        });

        if (priceRes.ok) {
          const priceData = await priceRes.json();
          priceId = priceData.id;
        }
      }

      await upsertStripeProduct(supabaseUrl, serviceKey, {
        app_product_id: product.id,
        stripe_product_id: productId,
        stripe_price_id: priceId,
        name: product.name,
        price: unitAmount,
        is_recurring: product.type === "recurring",
      });

      results.push({ id: product.id, name: product.name, abbreviation: abbrev, price: product.price, productId, priceId });
    } catch (e) {
      results.push({ id: product.id, name: product.name, abbreviation: abbrev, price: product.price, error: String(e) });
    }
  }

  const succeeded = results.filter((r) => !r.error).length;
  const failed = results.filter((r) => r.error).length;

  return new Response(JSON.stringify({ succeeded, failed, total: results.length, results }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
