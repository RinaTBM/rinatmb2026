import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { costAnalysisRow } from '@/lib/genHealth/genCatalogMatching';

type GenMapRow = {
  mbm_sku: string;
  gen_client_product_id: string | null;
  gen_product_name: string | null;
  gen_medication_name: string | null;
  gen_pharmacy: string | null;
  gen_strength: string | null;
  gen_form: string | null;
  gen_package: string | null;
  medication_cost_cents: number | null;
  shipping_cost_cents: number | null;
  mapping_status: string;
  replaces_mbm_sku: string | null;
  active: boolean;
  notes: string | null;
  last_verified_at: string | null;
};

const RETAIL_CENTS: Record<string, number> = {
  'MBM-RP-BPC-INJ-001': 19900,
};

/**
 * Admin GEN catalog mapping view (Phase 12G).
 * Read-only from gen_sku_map (admin RLS). Does not edit GEN IDs inline.
 */
export function AdminGenMapping() {
  const [rows, setRows] = useState<GenMapRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      if (!supabase) {
        setError('Supabase is not connected in this environment.');
        setRows([]);
        setLoading(false);
        return;
      }
      const { data, error: err } = await supabase
        .from('gen_sku_map')
        .select(
          'mbm_sku,gen_client_product_id,gen_product_name,gen_medication_name,gen_pharmacy,gen_strength,gen_form,gen_package,medication_cost_cents,shipping_cost_cents,mapping_status,replaces_mbm_sku,active,notes,last_verified_at',
        )
        .order('mbm_sku');
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setRows([]);
      } else {
        setError(null);
        setRows((data || []) as GenMapRow[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ready = rows.filter((r) => r.mapping_status === 'READY' || r.mapping_status === 'ACTIVE').length;
  const blocked = rows.filter((r) => r.mapping_status === 'BLOCKED').length;

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900 mb-2">GEN Catalog Mapping</h1>
      <p className="text-sm text-ink-500 mb-6 max-w-3xl">
        Clinical SKU map (`gen_sku_map`). READY/ACTIVE required for production Rx checkout.
        Automatic GEN handoff stays off until explicitly enabled. GEN product IDs are not
        edited here — update via verified staging workflows only.
      </p>
      <div className="flex gap-3 mb-6 text-sm">
        <span className="rounded-full bg-green-100 text-green-800 px-3 py-1">{ready} READY/ACTIVE</span>
        <span className="rounded-full bg-red-100 text-red-700 px-3 py-1">{blocked} BLOCKED</span>
        <span className="rounded-full bg-cream-200 text-ink-600 px-3 py-1">{rows.length} total</span>
      </div>
      {loading && <p className="text-ink-500">Loading…</p>}
      {error && (
        <p className="rounded-lg bg-red-50 text-red-700 p-3 text-sm mb-4">
          {error.includes('schema cache') || error.includes('does not exist')
            ? 'gen_sku_map is not available in this environment yet.'
            : error}
        </p>
      )}
      {!loading && !error && (
        <div className="overflow-x-auto card-lux">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-cream-100 text-ink-600">
              <tr>
                <th className="p-2">MBM SKU</th>
                <th className="p-2">Status</th>
                <th className="p-2">GEN product</th>
                <th className="p-2">Medication / pharmacy</th>
                <th className="p-2">Cost</th>
                <th className="p-2">Markup +50/+75/+100</th>
                <th className="p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const retail = RETAIL_CENTS[r.mbm_sku] ?? null;
                const costs =
                  retail != null
                    ? costAnalysisRow({
                        currentRetailCents: retail,
                        medicationCostCents: r.medication_cost_cents,
                        shippingCostCents: r.shipping_cost_cents,
                      })
                    : null;
                return (
                  <tr key={r.mbm_sku} className="border-t border-cream-200 align-top">
                    <td className="p-2 font-mono text-[11px]">{r.mbm_sku}</td>
                    <td className="p-2">
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          r.mapping_status === 'READY' || r.mapping_status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {r.mapping_status}
                      </span>
                      {r.replaces_mbm_sku ? (
                        <div className="text-[10px] text-ink-400 mt-1">replaces {r.replaces_mbm_sku}</div>
                      ) : null}
                    </td>
                    <td className="p-2">
                      <div>{r.gen_product_name || '—'}</div>
                      <div className="font-mono text-[10px] text-ink-400 break-all">
                        {r.gen_client_product_id || '—'}
                      </div>
                    </td>
                    <td className="p-2">
                      <div>{r.gen_medication_name || '—'}</div>
                      <div className="text-ink-500">{r.gen_pharmacy || '—'}</div>
                      <div className="text-ink-400">
                        {[r.gen_strength, r.gen_form, r.gen_package].filter(Boolean).join(' · ') || '—'}
                      </div>
                    </td>
                    <td className="p-2 font-mono">
                      {r.medication_cost_cents != null ? `$${(r.medication_cost_cents / 100).toFixed(2)}` : '—'}
                      {r.shipping_cost_cents != null
                        ? ` + ship $${(r.shipping_cost_cents / 100).toFixed(2)}`
                        : ' · ship TBD'}
                    </td>
                    <td className="p-2 font-mono text-[10px]">
                      {costs?.plus50Med != null
                        ? `$${((costs.plus50Med || 0) / 100).toFixed(2)} / $${((costs.plus75Med || 0) / 100).toFixed(2)} / $${((costs.plus100Med || 0) / 100).toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="p-2 text-ink-500 max-w-xs">{r.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
