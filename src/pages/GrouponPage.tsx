import { useEffect, useState, type FormEvent } from 'react';
import { Link } from '@/router';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { GROUPON_PACKAGES, GROUPON_CARE_DISCLOSURE, validateGrouponSubmission, grouponRequest, type GrouponRedemption } from '@/lib/groupon/service';

export function GrouponPage({ embedded = false }: { embedded?: boolean }) {
  useEffect(() => {
    if (embedded) return;
    const previous = document.title;
    document.title = 'Redeem Your My Bare Method Groupon';
    const meta = document.createElement('meta');
    meta.name = 'robots'; meta.content = 'noindex,nofollow'; document.head.appendChild(meta);
    return () => { document.title = previous; meta.remove(); };
  }, [embedded]);
  const { user, profile, loading } = useCustomerAuth();
  const [open, setOpen] = useState(embedded);
  const [code, setCode] = useState('');
  const [packageId, setPackageId] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [received, setReceived] = useState(false);
  const [rows, setRows] = useState<GrouponRedemption[]>([]);
  useEffect(() => {
    setName([profile?.first_name, profile?.last_name].filter(Boolean).join(' '));
  }, [profile]);
  useEffect(() => {
    let active = true;
    setRows([]); setReceived(false); setCode('');
    if (user) grouponRequest<{ redemptions: GrouponRedemption[] }>({ action: 'list' })
      .then(r => { if (active) setRows(r.redemptions); })
      .catch(() => { if (active) setError('Unable to load your vouchers. Please try again later or contact support.'); });
    return () => { active = false; };
  }, [user?.id]);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError(null); setReceived(false);
    const invalid = validateGrouponSubmission(code, packageId);
    if (invalid) { setError(invalid); return; }
    if (!name.trim()) { setError('Enter your name.'); return; }
    setBusy(true);
    try {
      const r = await grouponRequest<{ redemption: GrouponRedemption }>({ action: 'submit', code, packageId, customerName: name });
      setRows(old => [r.redemption, ...old.filter(row => row.id !== r.redemption.id)]);
      setCode(''); setReceived(true); setOpen(false);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save your voucher. Please try again.'); }
    finally { setBusy(false); }
  }
  return <div className={embedded ? 'mt-4' : 'mx-auto max-w-3xl px-5 pb-12 pt-40 md:pt-44 sm:pb-20'} onKeyDown={e => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) { e.preventDefault(); e.stopPropagation(); if (user && open && !busy) void submit(e); }
  }}>
    {!embedded && <><p className="text-xs uppercase tracking-widest text-gold-700">My Bare Method · Groupon</p>
    <h1 className="mt-3 font-serif text-3xl text-ink-900 sm:text-4xl">Redeem Your My Bare Method Groupon</h1>
    <p className="mt-4 text-ink-600">Already purchased a My Bare Method offer on Groupon? Enter your voucher information below to begin your care process.</p></>}
    <section className={embedded ? 'space-y-4' : 'card-lux mt-8 p-5 sm:p-8'}>
      {loading ? <p>Loading your account…</p> : !user ? <>
        <h2 className="font-serif text-2xl">Begin Groupon Redemption</h2>
        <p className="mt-3 text-sm text-ink-600">Sign in or create an account to securely attach your voucher. Then choose Groupon vouchers in your account to return here.</p>
        <div className="mt-5 flex flex-wrap gap-3"><Link to="/account/login" className="btn-primary">Sign in</Link><Link to="/account/signup" className="btn-outline">Create account</Link></div>
      </> : <>
        {!open && <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => { setOpen(true); setReceived(false); setError(null); }}>Begin Groupon Redemption</button>}
        {open && <div className="space-y-5">
          <div><h2 className="font-serif text-2xl">Redeem Your Groupon</h2><p className="mt-2 text-sm text-ink-600">Enter the unique redemption code from your Groupon voucher.</p></div>
          <p className="text-sm text-ink-600">You can find your Redemption Code in your Groupon account under My Groupons. Enter it exactly as shown on your voucher.</p>
          <label className="block text-sm">Customer name<input className="input-lux mt-1" value={name} onChange={e => setName(e.target.value)} autoComplete="name" maxLength={160} /></label>
          <p className="break-all text-sm text-ink-600">Account email: {user.email}</p>
          <label className="block text-sm">Groupon Redemption Code<input className="input-lux mt-1" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter redemption code" autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={128} /></label>
          <label className="block text-sm">Groupon Package<select className="input-lux mt-1" value={packageId} onChange={e => setPackageId(e.target.value)}><option value="">Select your package</option>{GROUPON_PACKAGES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          {packageId && <p className="text-sm text-gold-800">{GROUPON_PACKAGES.find(p => p.id === packageId)?.therapy}</p>}
          <p className="text-xs leading-relaxed text-ink-600">{GROUPON_CARE_DISCLOSURE}</p>
          <button type="button" onClick={submit} className="btn-primary w-full" disabled={busy}>{busy ? 'Submitting…' : 'Apply Groupon'}</button>
        </div>}
      </>}
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      {received && <div role="status" className="mt-5 rounded-xl border border-gold-200 bg-gold-50 p-5">
        <h2 className="font-serif text-2xl">Groupon received</h2>
        <p className="mt-3 text-sm">Your Groupon redemption code has been submitted for verification. Your voucher covers only the services included in the Groupon package you purchased. Prescription treatment remains subject to medical eligibility and licensed-provider approval.</p>
        <p className="mt-3 text-sm">Additional shipping, upgrades, or services not included with your Groupon may be charged separately.</p>
        <p className="mt-3 text-sm font-medium">Please wait for our team to verify your voucher and coordinate your care. Do not purchase your covered package again while verification is pending.</p>
      </div>}
    </section>
    {rows.length > 0 && <section className="mt-8 space-y-3"><h2 className="font-serif text-2xl">Your Groupon vouchers</h2>{rows.map(r => <article key={r.id} className="card-lux p-5"><h3 className="font-medium">{r.groupon_package_name}</h3><p className="mt-2 text-sm">{r.masked_code} · {r.status}</p><p className="mt-1 text-xs text-ink-500">Submitted {new Date(r.submitted_at).toLocaleDateString()}</p></article>)}</section>}
    <section className="mt-8"><h2 className="font-serif text-2xl">Your hormone care process</h2><ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-600"><li>Select your requested therapy.</li><li>Complete intake and your initial consultation.</li><li>Complete a comprehensive hormone lab panel.</li><li>Attend your lab review appointment.</li><li>Your licensed provider determines medical eligibility and appropriate treatment.</li><li>Prescription fulfillment follows only if approved.</li></ol><p className="mt-4 text-sm text-ink-600">{GROUPON_CARE_DISCLOSURE}</p><Link to="/contact" className="mt-4 inline-block text-sm text-gold-800 underline">Contact our team</Link></section>
  </div>;
}
