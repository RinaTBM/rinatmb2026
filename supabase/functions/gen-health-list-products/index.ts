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
  const view = String((body as { view?: string }).view || "").trim();

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

  // default list — optional view=formulary for pairing inventory (read-only)
  const qs = new URLSearchParams({ limit: "500" });
  if (view) qs.set("view", view);
  const listPath = `/v2/client/products?${qs.toString()}`;
  const res = await fetch(`${cfg.baseUrl}${listPath}`, { headers });
  const text = await res.text();
  if (!res.ok) {
    return json(
      { error: "list_failed", status: res.status, path: listPath, preview: text.slice(0, 500) },
      502,
    );
  }
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(text);
  } catch {
    return json({ error: "list_parse_failed", path: listPath, preview: text.slice(0, 500) }, 502);
  }
  const data = (parsed?.data && typeof parsed.data === "object")
    ? parsed.data as Record<string, unknown>
    : {};
  // Formulary view nests under formularyProducts; default list under products
  const sourceKey = Array.isArray(data.formularyProducts)
    ? "formularyProducts"
    : Array.isArray(data.products)
    ? "products"
    : Array.isArray(data.clientProducts)
    ? "clientProducts"
    : "products";
  const productsRaw = (data[sourceKey] || parsed.products || []) as unknown[];
  const products = Array.isArray(productsRaw) ? productsRaw : [];
  return json({
    ok: true,
    path: listPath,
    sourceKey,
    count: products.length,
    dataKeys: Object.keys(data).sort(),
    topKeys: Object.keys(parsed).sort(),
    dataSummary: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [
        k,
        Array.isArray(v)
          ? `array:${v.length}`
          : (v && typeof v === "object" ? `object:${Object.keys(v as object).length}` : typeof v),
      ]),
    ),
    products: products.map((p: Record<string, unknown>) => ({
      ...p,
      keys: Object.keys(p).sort(),
    })),
  });
});
