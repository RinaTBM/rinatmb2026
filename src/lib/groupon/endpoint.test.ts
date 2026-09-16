import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { describe, expect, it, vi } from 'vitest';
import * as shared from '../../../supabase/functions/_shared/groupon';

// Execute the actual Edge handler with isolated Auth/PostgREST doubles, never live services.
const source = readFileSync(new URL('../../../supabase/functions/groupon-redemptions/index.ts', import.meta.url), 'utf8').replace(/^import .*;$/gm, '');
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None });
const record = { id: '10000000-0000-0000-0000-000000000001', customer_id: 'verified-user', redemption_code: 'sensitive-4821', internal_notes: 'staff-only', status: 'Pending Verification' };
function harness({ valid = true, admin = false, dbError = false } = {}) {
  let handler: (req: Request) => Promise<Response>;
  const rpc = vi.fn(async (_name: string, _args: Record<string, unknown>) => ({ data: { redemption: record, existing: false }, error: dbError ? new Error('private database error') : null }));
  const query: Record<string, unknown> = {};
  for (const method of ['select', 'order', 'limit', 'eq']) query[method] = vi.fn(() => query);
  query.then = (resolve: (v: unknown) => unknown) => resolve({ data: [record], error: null });
  const caller = { auth: { getUser: async () => ({ data: { user: valid ? { id: 'verified-user', email: 'verified@example.com' } : null }, error: null }) }, rpc: async () => ({ data: admin, error: null }) };
  runInNewContext(js, {
    ...shared, Request, Response, console,
    createClient: (_url: string, key: string) => key === 'service' ? { rpc, from: () => query } : caller,
    Deno: { env: { get: (key: string) => ({ SUPABASE_URL: 'https://example.invalid', SUPABASE_ANON_KEY: 'anon', SUPABASE_SERVICE_ROLE_KEY: 'service' })[key] }, serve: (fn: typeof handler) => { handler = fn; } },
  });
  return { rpc, query, call: (body: unknown, token = 'fake-token') => handler(new Request('https://example.invalid/groupon-redemptions', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: JSON.stringify(body) })) };
}
describe('Groupon Edge authorization and privacy', () => {
  it('rejects missing or invalid sessions', async () => {
    expect((await harness().call({ action: 'list' }, '')).status).toBe(401);
    expect((await harness({ valid: false }).call({ action: 'submit' })).status).toBe(401);
  });
  it('denies normal customers admin reads and writes before reaching the database', async () => {
    const h = harness();
    expect((await h.call({ action: 'admin_list' })).status).toBe(403);
    expect((await h.call({ action: 'update' })).status).toBe(403);
    expect(h.rpc).not.toHaveBeenCalled();
  });
  it('binds submission identity to the validated account and hides full codes and internal notes', async () => {
    const h = harness();
    const response = await h.call({ action: 'submit', code: ' sensitive-4821 ', packageId: 'GROUPON-ESTRADIOL', customerName: 'Customer', customer_id: 'attacker-selected', customerEmail: 'other@example.com', status: 'Redeemed' });
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.redemption.masked_code).toBe('••••••4821');
    expect(JSON.stringify(result)).not.toContain('sensitive-4821');
    expect(JSON.stringify(result)).not.toContain('staff-only');
    expect(h.rpc.mock.calls[0][1]).toMatchObject({ p_customer: 'verified-user', p_email: 'verified@example.com' });
    expect(h.rpc.mock.calls[0][1]).not.toHaveProperty('status');
  });
  it('filters customer reads by authenticated identity', async () => {
    const h = harness();
    await h.call({ action: 'list', customer_id: 'someone-else' });
    expect(h.query.eq).toHaveBeenCalledWith('customer_id','verified-user');
  });
  it('permits full-code reads only for admins', async () => {
    const response = await harness({ admin: true }).call({ action: 'admin_list' });
    expect((await response.json()).redemptions[0].redemption_code).toBe('sensitive-4821');
  });
  it('does not expose database errors', async () => {
    const response = await harness({ dbError: true }).call({ action: 'submit', code: '12345', packageId: 'GROUPON-ESTRADIOL', customerName: 'Customer' });
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain('private database');
  });
});
