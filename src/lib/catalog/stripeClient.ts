// Minimal, fetch-based Stripe REST client used by the sync CLI.
// HARD GUARD: refuses any non-test key so this task can never touch LIVE Stripe.
// Never logs the key. Works under Node (global fetch) and Deno.

const STRIPE_API = 'https://api.stripe.com/v1';

export class LiveKeyRefusedError extends Error {}

export function assertTestKey(key: string | undefined): string {
  if (!key) {
    throw new Error('Stripe test key is not set. Expected STRIPE_SECRET_KEY_TEST (sk_test_… or rk_test_…).');
  }
  if (key.startsWith('sk_live_') || key.startsWith('rk_live_')) {
    throw new LiveKeyRefusedError('Refusing to run: a LIVE Stripe key was provided. This task is TEST-only.');
  }
  if (!(key.startsWith('sk_test_') || key.startsWith('rk_test_'))) {
    throw new Error('Provided Stripe key does not look like a TEST key (expected sk_test_… or rk_test_…).');
  }
  return key;
}

function form(params: Record<string, string | number | boolean | undefined>): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) sp.append(k, String(v));
  }
  return sp;
}

export class StripeTestClient {
  private key: string;
  constructor(key: string | undefined) {
    this.key = assertTestKey(key);
  }

  private async call<T>(method: string, path: string, body?: URLSearchParams, idempotencyKey?: string): Promise<T> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
    const res = await fetch(`${STRIPE_API}${path}`, { method, headers, body });
    const text = await res.text();
    let json: unknown;
    try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
    if (!res.ok) {
      const msg = (json as { error?: { message?: string } })?.error?.message || `Stripe ${res.status}`;
      throw new Error(`Stripe API error (${res.status}): ${msg}`);
    }
    return json as T;
  }

  createProduct(input: { name: string; description?: string; metadata: Record<string, string>; active?: boolean }, idempotencyKey: string) {
    const params = form({ name: input.name, description: input.description, active: input.active ?? true });
    Object.entries(input.metadata).forEach(([k, v]) => params.append(`metadata[${k}]`, v));
    return this.call<{ id: string }>('POST', '/products', params, idempotencyKey);
  }

  updateProduct(id: string, input: { name?: string; description?: string; active?: boolean; metadata?: Record<string, string> }) {
    const params = form({ name: input.name, description: input.description, active: input.active });
    if (input.metadata) Object.entries(input.metadata).forEach(([k, v]) => params.append(`metadata[${k}]`, v));
    return this.call<{ id: string }>('POST', `/products/${id}`, params);
  }

  createPrice(input: {
    product: string;
    unitAmount: number;
    currency: string;
    recurringInterval?: 'month';
    metadata: Record<string, string>;
    lookupKey?: string;
  }, idempotencyKey: string) {
    const params = form({
      product: input.product,
      unit_amount: input.unitAmount,
      currency: input.currency,
      lookup_key: input.lookupKey,
      transfer_lookup_key: input.lookupKey ? true : undefined,
    });
    if (input.recurringInterval) {
      params.append('recurring[interval]', input.recurringInterval);
      params.append('recurring[interval_count]', '1');
    }
    Object.entries(input.metadata).forEach(([k, v]) => params.append(`metadata[${k}]`, v));
    return this.call<{ id: string }>('POST', '/prices', params, idempotencyKey);
  }

  archivePrice(id: string) {
    return this.call<{ id: string }>('POST', `/prices/${id}`, form({ active: false }));
  }

  async searchProductsByMetadata(catalogSlug: string, environment: string): Promise<Array<{ id: string; name: string; active: boolean }>> {
    const query = encodeURIComponent(`metadata['catalog_slug']:'${catalogSlug}' AND metadata['environment']:'${environment}'`);
    const res = await this.call<{ data: Array<{ id: string; name: string; active: boolean }> }>('GET', `/products/search?query=${query}`);
    return res.data ?? [];
  }

  async listActivePrices(productId: string): Promise<Array<{ id: string; unit_amount: number | null; currency: string; recurring: { interval: string } | null; active: boolean; metadata: Record<string, string> }>> {
    const res = await this.call<{ data: Array<{ id: string; unit_amount: number | null; currency: string; recurring: { interval: string } | null; active: boolean; metadata: Record<string, string> }> }>(
      'GET', `/prices?product=${productId}&active=true&limit=100`,
    );
    return res.data ?? [];
  }
}
