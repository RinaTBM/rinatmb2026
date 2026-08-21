import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  classifyOwnerPriceBand,
  costAnalysisRow,
  isProductionRxLaunchReady,
} from '@/lib/genHealth/genCatalogMatching';
import {
  catalogSummaryCounts,
  NEW_SKU_REQUIRED_RX_SKUS,
  PROPOSED_REPLACEMENT_SKUS,
  resolveStorefrontRxAvailability,
} from '@/lib/commerce/rxCatalogReadiness';

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

/** Current website retail cents for markup reference (not auto price changes). */
const RETAIL_CENTS: Record<string, number> = {
  'MBM-WM-SEM-INJ-001': 11900,
  'MBM-WM-SEM-INJ-002': 13900,
  'MBM-WM-SEM-INJ-003': 18902,
  'MBM-WM-SEM-INJ-004': 32900,
  'MBM-WM-TIR-INJ-001': 18900,
  'MBM-WM-TIR-INJ-002': 25899,
  'MBM-WM-TIR-INJ-003': 36900,
  'MBM-WM-TIR-INJ-004': 42900,
  'MBM-WM-FB3-INJ-001': 25900,
  'MBM-HRT-EST-PAT-001': 12900,
  'MBM-HRT-EST-PAT-002': 13898,
  'MBM-HRT-EST-PAT-003': 14900,
  'MBM-HRT-PRG-CAP-001': 3900,
  'MBM-HRT-PRG-CAP-002': 5900,
  'MBM-HRT-TST-CRM-001': 7900,
  'MBM-LON-NAD-INJ-001': 19900,
  'MBM-LON-NAD-INJ-002': 22900,
  'MBM-LON-SEL-INJ-001': 12900,
  'MBM-LON-SMX-INJ-001': 12900,
  'MBM-LON-SSN-NS-001': 16900,
  'MBM-LON-TESA-INJ-001': 14900,
  'MBM-RP-BPC-CAP-001': 9900,
  'MBM-RP-BPC-INJ-001': 19900,
  'MBM-SH-TRE-CRM-001': 7900,
  'MBM-SH-TRE-CRM-002': 8900,
  'MBM-SH-TRE-CRM-003': 10900,
  'MBM-SH-MIN-SOL-001': 12900,
  'MBM-SH-BIM-SOL-001': 8900,
};

const NEW_SKU_SET = new Set<string>(NEW_SKU_REQUIRED_RX_SKUS);
const PROPOSED_BY_OLD = new Map(
  PROPOSED_REPLACEMENT_SKUS.map((p) => [p.replacesMbmSku, p.proposedMbmSku]),
);

function money(cents: number | null | undefined): string {
  if (cents == null) return 'TBD';
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Admin GEN catalog mapping + owner pricing review (Phase 12G / 12I.2 / 12I.3).
 * Read-only from gen_sku_map (admin RLS). Does not edit GEN IDs or Tagada prices.
 * Ambiguous rows must never be marked READY here.
 */
export function AdminGenMapping() {
  const [rows, setRows] = useState<GenMapRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Admin review treats API Orders as OFF until Scriptful/GEN confirms (Phase 12I.1 / 12I.3).
  const genApiOrdersEnabled = false;

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

  const summary = catalogSummaryCounts();
  const ready = rows.filter((r) => r.mapping_status === 'READY' || r.mapping_status === 'ACTIVE').length;
  const blocked = rows.filter((r) => r.mapping_status === 'BLOCKED').length;
  const costKnown = rows.filter((r) => r.medication_cost_cents != null).length;
  const costUnknown = Math.max(0, 28 - costKnown);
  const launchGate = isProductionRxLaunchReady({
    mappingStatus: ready > 0 ? 'READY' : 'BLOCKED',
    genApiOrdersEnabled,
  });

  const matrixNote = useMemo(
    () =>
      `Matrix: ${summary.catalogReady} catalog ready · ${summary.temporarilyUnavailable} temporarily unavailable · ${summary.newSkuRequired} new SKU required · ${summary.productionRxReady} production Rx ready`,
    [summary],
  );

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900 mb-2">GEN Catalog Mapping</h1>
      <p className="text-sm text-ink-500 mb-4 max-w-3xl">
        Clinical SKU map (`gen_sku_map`) + owner pricing review. READY/ACTIVE required for
        production Rx checkout fail-closed. Automatic GEN handoff stays off. Ambiguous rows must
        not be marked READY without owner validation. Prices are not editable here — no Tagada
        writes.
      </p>

      <div className="mb-6 rounded-lg border border-ink-200 bg-cream-50 p-4 text-sm text-ink-800 max-w-4xl">
        <div className="font-medium mb-2">Phase 12I.3 catalog summary</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div>
            TOTAL RX: <strong>{summary.totalRx}</strong>
          </div>
          <div>
            CATALOG READY: <strong>{summary.catalogReady}</strong>
          </div>
          <div>
            TEMPORARILY UNAVAILABLE: <strong>{summary.temporarilyUnavailable}</strong>
          </div>
          <div>
            NEW SKU REQUIRED: <strong>{summary.newSkuRequired}</strong>
          </div>
          <div>
            PRODUCTION RX READY: <strong>{summary.productionRxReady}</strong>
          </div>
          <div>
            API ORDERS: <strong>PENDING</strong>
          </div>
          <div>
            COST KNOWN: <strong>{costKnown}</strong>
          </div>
          <div>
            COST UNKNOWN: <strong>{costUnknown}</strong>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-ink-500">{matrixNote}</p>
      </div>

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 max-w-4xl">
        <div className="font-medium mb-1">Capability status (distinct from mapping readiness)</div>
        <ul className="list-disc pl-5 space-y-1 text-amber-900">
          <li>
            <span className="font-mono">GEN_HEALTH_ENABLED</span>: integration present (separate)
          </li>
          <li>
            <span className="font-mono">GEN_MAPPING_READY</span>:{' '}
            {ready > 0 ? `${ready} SKU(s) READY/ACTIVE` : 'none'}
          </li>
          <li>
            <span className="font-mono">GEN_API_ORDERS_ENABLED</span>: <strong>false</strong>{' '}
            (checkout capability gate — default until Scriptful/GEN enablement)
          </li>
          <li>
            <span className="font-mono">GEN_API_ORDERS_PAYMENT_STATUS_ENABLED</span>: keep unset
            until API Orders confirmed (payload `payment_status` gate)
          </li>
          <li>
            Production Rx cutover: <strong>BLOCKED</strong>
            {launchGate.code === 'GEN_API_ORDERS_NOT_ENABLED' ? ' (current)' : ''}.
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 text-sm">
        <span className="rounded-full bg-green-100 text-green-800 px-3 py-1">{ready} READY/ACTIVE</span>
        <span className="rounded-full bg-red-100 text-red-700 px-3 py-1">{blocked} BLOCKED</span>
        <span className="rounded-full bg-cream-200 text-ink-600 px-3 py-1">{rows.length} total</span>
        <span className="rounded-full bg-amber-100 text-amber-900 px-3 py-1">API Orders: OFF</span>
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
                <th className="p-2">Mapping</th>
                <th className="p-2">Website status</th>
                <th className="p-2">Exact formulation</th>
                <th className="p-2">GEN ID / pharmacy</th>
                <th className="p-2">Current retail</th>
                <th className="p-2">At-cost / ship / landed</th>
                <th className="p-2">+50 / +75 / +100</th>
                <th className="p-2">Price band</th>
                <th className="p-2">New SKU</th>
                <th className="p-2">API Orders</th>
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
                const band =
                  costs?.priceBand ??
                  classifyOwnerPriceBand({
                    currentRetailCents: retail,
                    medicationCostCents: r.medication_cost_cents,
                  });
                const rowLaunch = isProductionRxLaunchReady({
                  mappingStatus: r.mapping_status,
                  genApiOrdersEnabled,
                });
                const storefront = resolveStorefrontRxAvailability({
                  mbmSku: r.mbm_sku,
                  genApiOrdersEnabled,
                });
                const newSkuRequired = NEW_SKU_SET.has(r.mbm_sku);
                const proposed = PROPOSED_BY_OLD.get(r.mbm_sku) ?? null;
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
                      {r.mapping_status === 'READY' || r.mapping_status === 'ACTIVE' ? (
                        <div className="text-[10px] text-amber-800 mt-1 font-mono">
                          {rowLaunch.code}
                        </div>
                      ) : null}
                      {r.replaces_mbm_sku ? (
                        <div className="text-[10px] text-ink-400 mt-1">replaces {r.replaces_mbm_sku}</div>
                      ) : null}
                    </td>
                    <td className="p-2">
                      <div>{storefront?.customerFacingStatus ?? '—'}</div>
                      <div className="text-[10px] text-ink-400 font-mono">
                        {storefront?.websiteAction ?? '—'}
                      </div>
                    </td>
                    <td className="p-2">
                      <div>{r.gen_medication_name || r.gen_product_name || '—'}</div>
                      <div className="text-ink-400">
                        {[r.gen_strength, r.gen_form, r.gen_package].filter(Boolean).join(' · ') ||
                          '—'}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-ink-500">{r.gen_pharmacy || '—'}</div>
                      <div className="font-mono text-[10px] text-ink-400 break-all">
                        {r.gen_client_product_id || '—'}
                      </div>
                    </td>
                    <td className="p-2 font-mono">{money(retail)}</td>
                    <td className="p-2 font-mono text-[10px]">
                      <div>cost {money(r.medication_cost_cents)}</div>
                      <div>ship {money(r.shipping_cost_cents)}</div>
                      <div>landed {money(costs?.totalCostCents)}</div>
                    </td>
                    <td className="p-2 font-mono text-[10px]">
                      {costs?.plus50Med != null
                        ? `${money(costs.plus50Med)} / ${money(costs.plus75Med)} / ${money(costs.plus100Med)}`
                        : 'TBD'}
                    </td>
                    <td className="p-2 text-[10px]">{band}</td>
                    <td className="p-2 text-[10px]">
                      {newSkuRequired ? (
                        <>
                          <div className="font-medium text-amber-900">NEW SKU REQUIRED</div>
                          <div className="font-mono">{proposed || '—'}</div>
                          <div className="text-ink-400">prepared · not activated</div>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-2 text-[10px] font-mono">
                      {genApiOrdersEnabled ? 'ENABLED' : 'PENDING / OFF'}
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
