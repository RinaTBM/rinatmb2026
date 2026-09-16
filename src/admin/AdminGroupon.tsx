import { useEffect, useState } from 'react';
import { Link } from '@/router';
import { GROUPON_STATUSES, canChangeGrouponStatus, grouponRequest, verifyGrouponVoucher, type GrouponRedemption, type GrouponStatus } from '@/lib/groupon/service';

function Voucher({ row, refresh }: { row: GrouponRedemption; refresh: () => void }) {
  const [status, setStatus] = useState<GrouponStatus>(row.status);
  const [notes, setNotes] = useState(row.internal_notes || '');
  const [orderId, setOrderId] = useState(row.order_id || '');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function save() {
    setBusy(true); setError('');
    try { await verifyGrouponVoucher({ id: row.id, status, notes, orderId: orderId.trim() || null, version: row.version!, confirmRedeemed: confirm }); refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to save voucher.'); }
    finally { setBusy(false); }
  }
  return <article className="card-lux space-y-4 p-5">
    <div><p className="text-xs uppercase tracking-wide text-gold-700">Source: Groupon</p><h2 className="mt-1 font-serif text-xl">{row.groupon_package_name}</h2><p className="mt-2 break-all text-sm">{row.customer_name} · {row.customer_email}</p></div>
    <dl className="text-sm"><dt className="text-ink-500">Groupon Redemption Code</dt><dd className="break-all font-mono">{row.redemption_code}</dd><dt className="mt-2 text-ink-500">Voucher Status</dt><dd>{row.status}</dd><dt className="mt-2 text-ink-500">Submitted</dt><dd>{new Date(row.submitted_at).toLocaleString()}</dd>{row.verified_at && <><dt className="mt-2 text-ink-500">Verified</dt><dd>{new Date(row.verified_at).toLocaleString()}</dd></>}{row.redeemed_at && <><dt className="mt-2 text-ink-500">Redeemed</dt><dd>{new Date(row.redeemed_at).toLocaleString()}</dd></>}</dl>
    {row.order_id ? <Link to={`/admin/orders/${row.order_id}`} className="text-sm text-gold-800 underline">View related order, clinical status and provider approval</Link> : <p className="text-sm text-ink-500">Clinical Status / Provider Approval: no linked order. Verify the voucher, then coordinate intake, consultation, labs and lab review through the existing care process.</p>}
    <label className="block text-sm">Related order ID (optional)<input className="input-lux mt-1" value={orderId} onChange={e => setOrderId(e.target.value)} disabled={Boolean(row.order_id)} placeholder="Existing order belonging to this customer" /></label>
    <label className="block text-sm">Voucher status<select className="input-lux mt-1" value={status} onChange={e => { setStatus(e.target.value as GrouponStatus); setConfirm(false); }}>{GROUPON_STATUSES.filter(s => canChangeGrouponStatus(row.status, s)).map(s => <option key={s}>{s}</option>)}</select></label>
    <label className="block text-sm">Internal notes<textarea className="input-lux mt-1" rows={3} value={notes} onChange={e => setNotes(e.target.value)} maxLength={4000} /></label>
    {status === 'Redeemed' && row.status !== 'Redeemed' && <label className="flex gap-3 text-sm"><input type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)} /><span>I have manually redeemed this voucher in Groupon Merchant. Saving records that action here; it does not contact Groupon.</span></label>}
    <p className="text-xs text-ink-500">Verification records voucher validity only. It does not change payment, shipping, clinical approval or subscription status. Arrange the prepaid care handoff before directing the customer to any payment checkout.</p>
    <button className="btn-primary" type="button" onClick={save} disabled={busy || (status === 'Redeemed' && row.status !== 'Redeemed' && !confirm)}>{busy ? 'Saving…' : 'Save voucher review'}</button>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </article>;
}
export function AdminGroupon({ canWrite, orderId }: { canWrite: boolean; orderId?: string }) {
  const [rows, setRows] = useState<GrouponRedemption[]>([]);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let active = true;
    if (!canWrite) return;
    setLoading(true); setError('');
    grouponRequest<{ redemptions: GrouponRedemption[] }>({ action: 'admin_list', orderId })
      .then(r => { if (active) setRows(r.redemptions); })
      .catch(e => { if (active) setError(e instanceof Error ? e.message : 'Unable to load vouchers.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [canWrite, orderId, revision]);
  return <section className="space-y-5"><h1 className="font-serif text-3xl">Groupon vouchers</h1><p className="text-sm text-ink-600">Manually verify the code and purchased package in Groupon Merchant before choosing Verified. Record redemption here only after redeeming it there.</p>
    <button className="btn-outline" type="button" disabled={!canWrite || loading} onClick={() => setRevision(r => r + 1)}>Refresh vouchers</button>
    {!canWrite ? <p>Administrator sign-in is required.</p> : loading ? <p>Loading vouchers…</p> : <><p className="text-xs text-ink-500">Showing up to 100 most recent submissions.</p>{rows.map(r => <Voucher key={`${r.id}-${r.version}`} row={r} refresh={() => setRevision(v => v + 1)} />)}{!error && rows.length === 0 && <p>No voucher submissions yet.</p>}</>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </section>;
}
