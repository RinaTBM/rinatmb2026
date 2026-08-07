import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, navigate, type Route } from '@/router';
import { useAdminSession, readOAuthError } from '@/admin/useAdminSession';
import { resolveAdminAccess, shouldRedirectToLogin, canRenderAdmin } from '@/lib/auth/adminAccess';
import { supabase } from '@/lib/supabaseClient';
import { BRAND_LOGO_SRC } from '@/components/BrandLogo';

const LOGO = BRAND_LOGO_SRC;

type Session = ReturnType<typeof useAdminSession>;

/** Adds noindex,nofollow robots meta while any /admin route is mounted; removes on unmount. */
function useNoIndexMeta() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = 'Admin — My Bare Method';
    return () => { document.head.removeChild(meta); document.title = prevTitle; };
  }, []);
}

/** Declarative client-side redirect. */
function RedirectTo({ to }: { to: string }) {
  useEffect(() => { navigate(to); }, [to]);
  return <div className="min-h-screen grid place-items-center text-ink-500">Redirecting…</div>;
}

function AccessDenied({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center text-center bg-cream-50">
      <div className="max-w-sm">
        <h1 className="font-serif text-2xl text-ink-900 mb-2">Access denied</h1>
        <p className="text-ink-500 mb-4">{email ?? 'This account'} is not an authorized administrator. Access is restricted to approved administrators.</p>
        <button className="btn-outline" onClick={onSignOut}>Sign out</button>
      </div>
    </div>
  );
}

function AdminLogin({ session }: { session: Session }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already-authorized admins skip the login page.
  if (session.configured && !session.loading && session.authenticated && session.isAdmin) {
    return <RedirectTo to="/admin/catalog" />;
  }

  const onGoogle = async () => {
    setBusy(true); setError(null);
    const r = await session.signInWithGoogle();
    if (r.error) { setError(r.error); setBusy(false); }
    // On success the browser is redirected to Google, then back to /admin/auth/callback.
  };

  return (
    <div className="min-h-screen bg-cream-50 grid place-items-center px-4">
      <div className="w-full max-w-sm card-lux p-8 text-center">
        <img src={LOGO} alt="My Bare Method Logo" className="mx-auto w-auto max-h-48 object-contain mb-4" />
        <h1 className="font-serif text-2xl text-ink-900 mb-1">Administrator Sign In</h1>
        <p className="text-sm text-ink-500 mb-6">Access is restricted to authorized administrators.</p>
        {!session.configured && (
          <p className="mb-4 rounded-lg bg-cream-100 p-3 text-xs text-ink-500">
            Supabase is not connected in this environment. Connect Supabase in Bolt to enable Google sign-in.
          </p>
        )}
        {session.authenticated && !session.isAdmin && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">
            {session.email} is signed in but not an authorized administrator.
          </p>
        )}
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
        <button onClick={onGoogle} disabled={busy || !session.configured} className="btn-primary w-full justify-center">
          {busy ? 'Redirecting to Google…' : 'Continue with Google'}
        </button>
        {session.authenticated && (
          <button onClick={session.signOut} className="mt-3 text-xs text-gold-600">Sign out</button>
        )}
      </div>
    </div>
  );
}

function AdminAuthCallback({ session }: { session: Session }) {
  const [oauthError] = useState<string | null>(() => readOAuthError());
  const state = resolveAdminAccess({
    configured: session.configured,
    loading: session.loading,
    authenticated: session.authenticated,
    isAdmin: session.isAdmin,
    oauthError,
  });

  if (state === 'authorized') return <RedirectTo to="/admin/catalog" />;
  if (state === 'unauthorized') return <AccessDenied email={session.email} onSignOut={session.signOut} />;
  if (state === 'oauth_error') {
    return (
      <div className="min-h-screen grid place-items-center text-center bg-cream-50">
        <div className="max-w-sm">
          <h1 className="font-serif text-2xl text-ink-900 mb-2">Sign-in error</h1>
          <p className="text-ink-500 mb-4">{oauthError}</p>
          <Link to="/admin/login" className="btn-outline">Back to sign in</Link>
        </div>
      </div>
    );
  }
  if (state === 'unauthenticated') return <RedirectTo to="/admin/login" />;
  // loading / unconfigured
  return <div className="min-h-screen grid place-items-center text-ink-500">Completing sign-in…</div>;
}
import {
  catalogProducts, catalogMemberships, catalogCategories, formatCents,
  type CatalogProduct, type CatalogMembership,
} from '@/lib/catalog/catalog';
import { validateCatalog } from '@/lib/catalog/validate';
import { buildSyncPlan, summarizePlan, emptyState } from '@/lib/catalog/syncPlan';

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'products', label: 'Products' },
  { id: 'memberships', label: 'Memberships' },
  { id: 'categories', label: 'Categories' },
  { id: 'future', label: 'Future Releases' },
  { id: 'sync', label: 'Stripe Sync' },
  { id: 'sync-history', label: 'Sync History' },
  { id: 'audit', label: 'Audit History' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

function Badge({ tone, children }: { tone: 'green' | 'gray' | 'gold' | 'red'; children: ReactNode }) {
  const map = {
    green: 'bg-green-100 text-green-800',
    gray: 'bg-cream-200 text-ink-600',
    gold: 'bg-gold-100 text-gold-700',
    red: 'bg-red-100 text-red-700',
  } as const;
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${map[tone]}`}>{children}</span>;
}

function Dashboard() {
  const visible = catalogProducts.filter(p => p.isVisible && p.status === 'active');
  const future = catalogProducts.filter(p => p.status === 'future');
  const mems = catalogMemberships.filter(m => m.status === 'active' && m.isVisible);
  const stats = [
    { label: 'Active products', value: visible.length },
    { label: 'Future releases', value: future.length },
    { label: 'Active memberships', value: mems.length },
    { label: 'Categories', value: catalogCategories().length },
    { label: 'Total variants', value: visible.reduce((n, p) => n + p.variants.length, 0) },
  ];
  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900 mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(s => (
          <div key={s.label} className="card-lux p-5">
            <p className="text-3xl font-serif text-ink-900">{s.value}</p>
            <p className="text-xs uppercase tracking-wider text-ink-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductRow({ p }: { p: CatalogProduct }) {
  return (
    <tr className="border-t border-cream-200 hover:bg-cream-50">
      <td className="p-3"><img src={p.imageUrl} alt={p.imageAlt} className="h-12 w-12 rounded-lg object-cover" /></td>
      <td className="p-3">
        <button className="font-medium text-ink-900 hover:text-gold-600" onClick={() => navigate(`/admin/products/${p.slug}`)}>{p.displayName}</button>
        <div className="text-xs text-ink-400">{p.slug}</div>
      </td>
      <td className="p-3 text-sm text-ink-600">{p.category}</td>
      <td className="p-3">{p.isVisible ? <Badge tone="green">Visible</Badge> : <Badge tone="gray">Hidden</Badge>}</td>
      <td className="p-3">{p.status === 'active' ? <Badge tone="green">Active</Badge> : <Badge tone="gold">Future</Badge>}</td>
      <td className="p-3 text-sm">{formatCents(p.startingPriceCents)}</td>
      <td className="p-3 text-sm text-center">{p.variants.length}</td>
      <td className="p-3"><Badge tone="gray">test: not synced</Badge></td>
      <td className="p-3"><Badge tone="gray">live: n/a</Badge></td>
    </tr>
  );
}

function ProductsList() {
  const [q, setQ] = useState('');
  const rows = catalogProducts.filter(p => p.status === 'active').filter(p => p.displayName.toLowerCase().includes(q.toLowerCase()) || p.slug.includes(q.toLowerCase()));
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-ink-900">Products</h1>
        <input className="input-lux max-w-xs" placeholder="Search products…" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="card-lux overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-cream-100 text-ink-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Category</th>
              <th className="p-3">Visibility</th><th className="p-3">Status</th><th className="p-3">Starting price</th>
              <th className="p-3">Variants</th><th className="p-3">Test Stripe</th><th className="p-3">Live Stripe</th>
            </tr>
          </thead>
          <tbody>{rows.map(p => <ProductRow key={p.slug} p={p} />)}</tbody>
        </table>
      </div>
    </div>
  );
}

function ProductEditor({ slug, canWrite }: { slug: string; canWrite: boolean }) {
  const original = catalogProducts.find(p => p.slug === slug);
  const [draft, setDraft] = useState<CatalogProduct | undefined>(original);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  if (!draft) return <p className="text-ink-500">Product not found.</p>;

  const validation = validateCatalog([draft], []);
  const set = (patch: Partial<CatalogProduct>) => setDraft({ ...draft, ...patch });

  const save = async () => {
    if (!canWrite || !supabase) { setSaveMsg('Connect Supabase and sign in as an admin to persist.'); return; }
    const { error } = await supabase.from('catalog_products').update({
      display_name: draft.displayName, category: draft.category, short_description: draft.shortDescription,
      long_description: draft.longDescription, image_url: draft.imageUrl, image_alt: draft.imageAlt,
      is_visible: draft.isVisible, status: draft.status,
    }).eq('slug', draft.slug);
    setSaveMsg(error ? `Error: ${error.message}` : 'Saved to catalog. Preview Stripe Sync to propagate pricing.');
  };

  return (
    <div className="max-w-2xl">
      <button className="text-sm text-gold-600 mb-4" onClick={() => navigate('/admin/products')}>← Products</button>
      <h1 className="font-serif text-3xl text-ink-900 mb-6">{draft.displayName}</h1>
      <div className="space-y-4">
        <label className="block"><span className="text-xs uppercase tracking-wider text-ink-400">Name</span>
          <input className="input-lux" value={draft.displayName} onChange={e => set({ displayName: e.target.value })} /></label>
        <label className="block"><span className="text-xs uppercase tracking-wider text-ink-400">Slug (read-only)</span>
          <input className="input-lux bg-cream-100" value={draft.slug} readOnly /></label>
        <label className="block"><span className="text-xs uppercase tracking-wider text-ink-400">Category</span>
          <input className="input-lux" value={draft.category} onChange={e => set({ category: e.target.value })} /></label>
        <label className="block"><span className="text-xs uppercase tracking-wider text-ink-400">Short description</span>
          <textarea className="input-lux" rows={2} value={draft.shortDescription} onChange={e => set({ shortDescription: e.target.value })} /></label>
        <label className="block"><span className="text-xs uppercase tracking-wider text-ink-400">Image alt text</span>
          <input className="input-lux" value={draft.imageAlt} onChange={e => set({ imageAlt: e.target.value })} /></label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.isVisible} onChange={e => set({ isVisible: e.target.checked })} /> Visible</label>
          <label className="flex items-center gap-2 text-sm">Status
            <select className="input-lux !py-1 !w-auto" value={draft.status} onChange={e => set({ status: e.target.value as 'active' | 'future' })}>
              <option value="active">active</option><option value="future">future</option>
            </select></label>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-ink-400 mb-2">Variants</p>
          <div className="space-y-2">
            {draft.variants.map((v, i) => (
              <div key={v.variantKey} className="flex items-center gap-2 rounded-lg border border-cream-300 p-2 text-sm">
                <span className="flex-1">{v.displayName}</span>
                <span className="text-ink-400">{v.dosageForm}</span>
                <div className="flex items-center gap-1">
                  <span className="text-ink-400">$</span>
                  <input className="w-20 rounded border border-cream-300 px-2 py-1" type="number" min={0} step="0.01"
                    value={(v.priceCents / 100).toFixed(2)}
                    onChange={e => {
                      const cents = Math.round(parseFloat(e.target.value || '0') * 100);
                      const variants = [...draft.variants];
                      variants[i] = { ...v, priceCents: Number.isFinite(cents) ? cents : 0 };
                      set({ variants });
                    }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-cream-300 p-3 text-sm">
          <p className="font-medium text-ink-900 mb-1">Validation</p>
          {validation.errors.length === 0 ? <p className="text-green-700">No errors.</p> : validation.errors.map((e, i) => <p key={i} className="text-red-600">✗ {e}</p>)}
          {validation.warnings.map((w, i) => <p key={i} className="text-gold-700">! {w}</p>)}
        </div>

        {saveMsg && <p className="text-sm text-ink-600">{saveMsg}</p>}
        <button className="btn-primary" disabled={validation.errors.length > 0} onClick={save}>Save changes</button>
        {!canWrite && <p className="text-xs text-ink-400">Read-only preview — connect Supabase and sign in as an admin to persist changes.</p>}
      </div>
    </div>
  );
}

function Memberships() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900 mb-6">Memberships</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {catalogMemberships.filter(m => m.status === 'active').map((m: CatalogMembership) => (
          <div key={m.slug} className="card-lux p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-ink-900">{m.displayName}</h2>
              {m.isVisible ? <Badge tone="green">Visible</Badge> : <Badge tone="gray">Hidden</Badge>}
            </div>
            <p className="text-sm text-ink-500">{m.brandName}</p>
            <p className="font-serif text-2xl text-ink-900 mt-2">{formatCents(m.monthlyPriceCents)}<span className="text-sm text-ink-500">/mo</span></p>
            <p className="text-xs text-ink-500 mt-2">Initial term: {m.initialTermMonths} months · Locked rate: {m.lockedRate ? 'yes' : 'no'}</p>
            <p className="text-xs text-ink-500 mt-1">Included max: {m.maximumIncludedFormulation || '—'}</p>
            <ul className="mt-2 text-xs text-ink-600 space-y-0.5">
              {m.includedFormulations.map(f => <li key={f}>✓ {f}</li>)}
            </ul>
            <p className="mt-2 text-xs text-gold-700">Prescription guaranteed: {m.prescriptionGuaranteed ? 'YES (invalid!)' : 'no'} · Provider review: {m.providerReviewRequired ? 'required' : 'no'}</p>
            <p className="mt-2 text-xs text-ink-400">Stripe test/live: not synced (run Stripe Sync)</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Categories() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900 mb-6">Categories</h1>
      <div className="card-lux divide-y divide-cream-200">
        {catalogCategories().map(c => (
          <div key={c.id} className="flex items-center justify-between p-4">
            <span className="text-ink-800">{c.id}</span>
            <Badge tone="gold">{c.count} products</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function FutureReleases() {
  const future = catalogProducts.filter(p => p.status === 'future');
  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900 mb-6">Future Releases</h1>
      <p className="text-sm text-ink-500 mb-4">Preserved, hidden from the storefront. Set status to <em>active</em> and visibility on to release.</p>
      <div className="card-lux divide-y divide-cream-200">
        {future.length === 0 && <p className="p-4 text-ink-500">No future products.</p>}
        {future.map(p => (
          <div key={p.slug} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-ink-900">{p.displayName}</p>
              <p className="text-xs text-ink-400">{p.campaignTheme ?? '—'} · launch phase {p.launchPhase ?? '—'}</p>
            </div>
            <Badge tone="gold">Future</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function StripeSync({ canWrite, accessToken }: { canWrite: boolean; accessToken: string | null }) {
  const plan = useMemo(() => buildSyncPlan('test', emptyState()), []);
  const summary = summarizePlan(plan);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const invoke = async (action: 'dry-run' | 'apply') => {
    if (!supabase || !canWrite || !accessToken) { setResult('Connect Supabase and sign in as an admin to run against Stripe test mode.'); return; }
    setBusy(true); setResult(null);
    const { data, error } = await supabase.functions.invoke('stripe-sync', { body: { action } });
    setBusy(false);
    setResult(error ? `Error: ${error.message}` : JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900 mb-2">Stripe Sync (TEST)</h1>
      <p className="text-sm text-ink-500 mb-6">Preview the change plan, then sync to Stripe <strong>test</strong> mode. Live Stripe is never touched.</p>
      <div className="flex gap-3 mb-6">
        <button className="btn-outline" disabled={busy} onClick={() => invoke('dry-run')}>Preview Stripe Sync (dry-run)</button>
        <button className="btn-primary" disabled={busy} onClick={() => invoke('apply')}>Sync to Stripe Test</button>
      </div>
      <div className="card-lux p-4 mb-6 text-sm">
        <p className="font-medium text-ink-900 mb-2">Offline plan preview (first sync)</p>
        <p className="text-ink-600">create_product: {summary.createProducts} · create_price: {summary.createPrices} · reuse_price: {summary.reusePrices} · archive_price: {summary.archivePrices} · total: {summary.total}</p>
        <div className="mt-3 max-h-72 overflow-y-auto font-mono text-xs text-ink-600 space-y-0.5">
          {plan.map((i, idx) => (
            <div key={idx}>{i.op} — {i.entityType} {i.slug}{i.variantKey ? ` / ${i.variantKey}` : ''} {i.amountCents != null ? formatCents(i.amountCents) : ''}{i.billingInterval ? `/${i.billingInterval}` : ''}</div>
          ))}
        </div>
      </div>
      {result && <pre className="card-lux p-4 text-xs overflow-x-auto whitespace-pre-wrap">{result}</pre>}
    </div>
  );
}

function LogTable({ table, columns, canWrite }: { table: string; columns: string[]; canWrite: boolean }) {
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const load = async () => {
    if (!supabase || !canWrite) { setMsg('Connect Supabase and sign in as an admin to view.'); return; }
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false }).limit(50);
    if (error) setMsg(`Error: ${error.message}`); else setRows(data as Record<string, unknown>[]);
  };
  return (
    <div>
      <button className="btn-outline mb-4" onClick={load}>Load latest</button>
      {msg && <p className="text-sm text-ink-500">{msg}</p>}
      {rows && (
        <div className="card-lux overflow-x-auto"><table className="w-full text-left text-xs">
          <thead className="bg-cream-100 text-ink-500 uppercase"><tr>{columns.map(c => <th key={c} className="p-2">{c}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-cream-200">{columns.map(c => <td key={c} className="p-2">{String(r[c] ?? '')}</td>)}</tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export function AdminApp({ route }: { route: Route }) {
  const session = useAdminSession();
  useNoIndexMeta();
  const path = route.path;

  // Public auth routes (no guard).
  if (path === '/admin/login') return <AdminLogin session={session} />;
  if (path === '/admin/auth/callback') return <AdminAuthCallback session={session} />;

  // Section routing; /admin and /admin/catalog both map to the dashboard home.
  const parts = path.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
  const raw = parts[0] || 'catalog';
  const section = (raw === 'catalog' ? 'dashboard' : raw) as SectionId;
  const productSlug = section === 'products' ? parts[1] : undefined;
  const canWrite = session.configured && session.isAdmin;

  // Route guard (enforced when Supabase is connected). Anonymous/expired → login;
  // signed-in but not an approved admin → Access Denied; only 'authorized' renders admin.
  if (session.configured) {
    const access = resolveAdminAccess({
      configured: session.configured, loading: session.loading,
      authenticated: session.authenticated, isAdmin: session.isAdmin, oauthError: null,
    });
    if (access === 'loading') return <div className="min-h-screen grid place-items-center text-ink-500">Loading…</div>;
    if (shouldRedirectToLogin(access)) return <RedirectTo to="/admin/login" />;
    if (access === 'unauthorized') return <AccessDenied email={session.email} onSignOut={session.signOut} />;
    if (!canRenderAdmin(access)) return <RedirectTo to="/admin/login" />;
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <aside className="w-56 border-r border-cream-300 bg-white p-5 shrink-0">
        <Link to="/" className="font-serif text-lg text-ink-900">My Bare Method</Link>
        <p className="text-[10px] uppercase tracking-wider text-gold-600 mb-6">Admin</p>
        <nav className="space-y-1">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => navigate(`/admin/${s.id === 'dashboard' ? 'catalog' : s.id}`)}
              className={`block w-full text-left rounded-lg px-3 py-2 text-sm ${section === s.id ? 'bg-gold-50 text-gold-700 font-medium' : 'text-ink-700 hover:bg-cream-100'}`}>
              {s.label}
            </button>
          ))}
        </nav>
        <div className="mt-8 border-t border-cream-200 pt-4 text-xs text-ink-400">
          {session.configured
            ? <>Signed in as {session.email}<button className="block mt-2 text-gold-600" onClick={session.signOut}>Sign out</button></>
            : <span className="text-gold-700">Preview mode — Supabase not connected. Read-only.</span>}
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-x-hidden">
        {section === 'dashboard' && <Dashboard />}
        {section === 'products' && !productSlug && <ProductsList />}
        {section === 'products' && productSlug && <ProductEditor slug={productSlug} canWrite={canWrite} />}
        {section === 'memberships' && <Memberships />}
        {section === 'categories' && <Categories />}
        {section === 'future' && <FutureReleases />}
        {section === 'sync' && <StripeSync canWrite={canWrite} accessToken={session.accessToken} />}
        {section === 'sync-history' && <div><h1 className="font-serif text-3xl text-ink-900 mb-6">Sync History</h1><LogTable table="stripe_sync_log" columns={['created_at', 'environment', 'entity_type', 'entity_id', 'operation', 'stripe_object_id', 'status']} canWrite={canWrite} /></div>}
        {section === 'audit' && <div><h1 className="font-serif text-3xl text-ink-900 mb-6">Audit History</h1><LogTable table="admin_audit_log" columns={['created_at', 'admin_user_id', 'action', 'entity_type', 'entity_id']} canWrite={canWrite} /></div>}
      </main>
    </div>
  );
}
