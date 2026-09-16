import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { GROUPON_PACKAGES, GROUPON_STATUSES, GROUPON_REFERENCE_COMPONENTS, GROUPON_DUPLICATE_MESSAGE, normalizeGrouponCode, maskGrouponCode, validateGrouponSubmission } from '../_shared/groupon.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const fail = (error: string, status = 400) => json({ safe: true, error }, status);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type Row = Record<string, unknown> & { redemption_code: string };
function project(row: Row, admin: boolean) {
  const masked_code = maskGrouponCode(row.redemption_code);
  if (admin) return { ...row, masked_code };
  const { id, groupon_package_id, groupon_package_name, customer_id, order_id, source, status, submitted_at, verified_at, redeemed_at } = row;
  return { id, groupon_package_id, groupon_package_name, customer_id, order_id, source, status, submitted_at, verified_at, redeemed_at, masked_code };
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return fail('Method not allowed.', 405);
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const anon = Deno.env.get('SUPABASE_ANON_KEY');
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !anon || !service) return fail('Voucher service is unavailable. Please contact support.', 503);
    const jwt = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
    if (!jwt) return fail('Please sign in to submit or view your voucher.', 401);
    const caller = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${jwt}` } }, auth: { persistSession: false } });
    const { data: auth, error: authError } = await caller.auth.getUser(jwt);
    if (authError || !auth.user || auth.user.is_anonymous || !auth.user.email) return fail('Please sign in to submit or view your voucher.', 401);
    const text = await req.text();
    if (text.length > 12000) return fail('Submission is too long.');
    let body: Record<string, unknown>;
    try { body = JSON.parse(text); } catch { return fail('Invalid submission.'); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return fail('Invalid submission.');
    const db = createClient(url, service, { auth: { persistSession: false } });
    const isAdminAction = body.action === 'admin_list' || body.action === 'update';
    if (isAdminAction) {
      const { data: isAdmin, error } = await caller.rpc('is_admin');
      if (error || isAdmin !== true) return fail('Administrator access is required.', 403);
    }
    if (body.action === 'list' || body.action === 'admin_list') {
      let query = db.from('groupon_redemptions').select('*').order('submitted_at', { ascending: false }).limit(100);
      if (!isAdminAction) query = query.eq('customer_id', auth.user.id);
      if (body.orderId != null) {
        if (!uuid.test(String(body.orderId))) return fail('Invalid order.');
        query = query.eq('order_id', body.orderId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return json({ redemptions: (data || []).map(r => project(r, isAdminAction)) });
    }
    if (body.action === 'submit') {
      const invalid = validateGrouponSubmission(body.code, body.packageId);
      if (invalid) return fail(invalid);
      const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
      if (!customerName || customerName.length > 160) return fail('Enter your name (up to 160 characters).');
      const pkg = GROUPON_PACKAGES.find(p => p.id === body.packageId)!;
      const { data, error } = await db.rpc('submit_groupon_redemption', {
        p_code: normalizeGrouponCode(body.code), p_package: pkg.id, p_name: pkg.name,
        p_customer: auth.user.id, p_customer_name: customerName, p_email: auth.user.email,
        p_components: GROUPON_REFERENCE_COMPONENTS,
      });
      if (error) throw error;
      if (data.error) return fail(GROUPON_DUPLICATE_MESSAGE, 409);
      return json({ redemption: project(data.redemption, false), existing: data.existing });
    }
    if (body.action === 'update') {
      if (!uuid.test(String(body.id)) || !GROUPON_STATUSES.includes(body.status as never) || !Number.isInteger(body.version)) return fail('Invalid voucher update.');
      if (typeof body.notes !== 'string' || body.notes.length > 4000) return fail('Internal notes must be 4,000 characters or fewer.');
      if (body.orderId != null && !uuid.test(String(body.orderId))) return fail('Enter a valid order ID.');
      const { data, error } = await db.rpc('update_groupon_redemption', {
        p_id: body.id, p_status: body.status, p_note: body.notes.trim(), p_version: body.version,
        p_confirm: body.confirmRedeemed === true, p_actor: auth.user.id, p_order: body.orderId || null,
      });
      if (error) throw error;
      const errors: Record<string, string> = {
        stale: 'This voucher changed. Refresh before saving.', not_found: 'Voucher not found.',
        transition: 'This status change is not allowed. Verify the voucher before recording redemption.',
        confirmation: 'Confirm manual Groupon Merchant redemption before marking Redeemed.',
        order: 'Use an order belonging to this customer. An existing order link cannot be reassigned.',
      };
      if (data.error) return fail(errors[data.error] || 'Unable to update voucher.', 409);
      return json({ redemption: project(data.redemption, true) });
    }
    return fail('Invalid action.');
  } catch {
    // Never log request bodies, full codes, auth tokens or database errors.
    return fail('We could not save or load your voucher. Please try again or contact support.', 500);
  }
});
