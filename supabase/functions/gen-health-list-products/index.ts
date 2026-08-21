import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { resolveGenHealthConfig } from "../_shared/genHealthConfig.ts";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const cfg = resolveGenHealthConfig();
  if (!cfg.enabled || !cfg.apiKey) {
    return json({ error: "GEN_DISABLED_OR_MISSING_KEY" }, 503);
  }
  const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  const mode = String((body as { mode?: string }).mode || "list");

  const headers = { "x-api-key": cfg.apiKey, Accept: "application/json" };

  if (mode === "detail") {
    const ids = Array.isArray((body as { ids?: string[] }).ids)
      ? (body as { ids: string[] }).ids
      : [];
    const details = [];
    for (const id of ids) {
      const paths = [
        `/v2/client/products/${id}`,
        `/v2/client/products?productId=${id}`,
        `/v2/client/products?clientProductId=${encodeURIComponent(id)}`,
      ];
      const tried = [];
      for (const path of paths) {
        const res = await fetch(`${cfg.baseUrl}${path}`, { headers });
        const text = await res.text();
        tried.push({ path, status: res.status, preview: text.slice(0, 2500) });
        if (res.ok) break;
      }
      details.push({ id, tried });
    }
    return json({ ok: true, details });
  }

  // default list
  const res = await fetch(`${cfg.baseUrl}/v2/client/products?limit=500`, { headers });
  const text = await res.text();
  if (!res.ok) return json({ error: "list_failed", status: res.status, preview: text.slice(0, 500) }, 502);
  const parsed = JSON.parse(text);
  const products = parsed?.data?.products || [];
  return json({
    ok: true,
    count: products.length,
    products: products.map((p: Record<string, unknown>) => ({
      clientProductId: p.clientProductId,
      productId: p.productId,
      name: p.name,
      displayName: p.displayName,
      description: p.description,
      pricing: p.pricing,
      requiresSyncVisit: p.requiresSyncVisit,
      storefrontEligible: p.storefrontEligible,
      categories: p.categories,
    })),
  });
});
