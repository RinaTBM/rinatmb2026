import { useMemo, useState } from 'react';
import {
  getWebsiteFamily,
  listPatientVisibleVariants,
  resolveFamilyVariant,
  WEBSITE_PRODUCT_FAMILIES,
} from '@/data/websiteFamilies';
import { assertFamilyVariantGenOrderAllowed } from '@/lib/catalog/familyRoutingGate';
import { Link } from '@/router';

const FOCUS_FAMILY_IDS = [
  'semaglutide',
  'tirzepatide',
  'nad',
  'wolverine-bpc-tb',
  'estradiol',
  'minoxidil',
] as const;

/**
 * QA-only preview of locked family → selector → GEN route architecture.
 * Not the live cutover storefront. Does not enable GEN orders.
 */
export function FamilyProductPreviewPage({ familyId }: { familyId?: string }) {
  const focusFamilies = WEBSITE_PRODUCT_FAMILIES.filter((f) =>
    (FOCUS_FAMILY_IDS as readonly string[]).includes(f.familyId),
  );

  if (!familyId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">QA preview · cutover OFF</p>
        <h1 className="font-display text-3xl text-ink-900 mb-4">Website family routing</h1>
        <p className="text-ink-600 mb-8">
          Locked patient-facing families with backend GEN routes. Legacy B6 storefront remains live
          until cutover. Real GEN orders stay disabled.
        </p>
        <ul className="space-y-3">
          {focusFamilies.map((f) => (
            <li key={f.familyId}>
              <Link
                to={`/preview/families/${f.familyId}`}
                className="block rounded-lg border border-ink-100 bg-white px-4 py-3 hover:border-ink-300"
              >
                <div className="font-medium text-ink-900">{f.displayName}</div>
                <div className="text-sm text-ink-500">
                  {listPatientVisibleVariants(f).length} patient-visible options · starting{' '}
                  {f.startingAtPriceDisplay || '—'}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-ink-400">
          <Link to="/shop-all" className="underline">
            ← Back to live shop
          </Link>
        </p>
      </div>
    );
  }

  return <FamilySelectorPlayground familyId={familyId} />;
}

function FamilySelectorPlayground({ familyId }: { familyId: string }) {
  const family = getWebsiteFamily(familyId);
  const visible = family ? listPatientVisibleVariants(family) : [];

  const [purchaseType, setPurchaseType] = useState<'one_time' | 'membership'>('one_time');
  const [additive, setAdditive] = useState<'Vitamin B12' | 'Glycine'>('Vitamin B12');
  const [doseTier, setDoseTier] = useState('Starting / Low');
  const [form, setForm] = useState(
    familyId === 'nad' ? 'Injection' : familyId === 'wolverine-bpc-tb' ? 'Injection' : '',
  );
  const [nasalOption, setNasalOption] = useState<'r84' | 'r85'>('r84');
  const [estradiolStrength, setEstradiolStrength] = useState('0.025');

  const resolution = useMemo(() => {
    if (!family) return null;
    if (familyId === 'semaglutide' || familyId === 'tirzepatide') {
      return resolveFamilyVariant(familyId, { purchaseType, additive, doseTier });
    }
    if (familyId === 'nad') {
      return resolveFamilyVariant(familyId, {
        form,
        nasalOption,
        package: form === 'Injection' ? (nasalOption === 'r85' ? '10mL' : '5mL') : undefined,
        // for injection use package via nasalOption misuse — fix below
      });
    }
    if (familyId === 'wolverine-bpc-tb') {
      return resolveFamilyVariant(familyId, { form });
    }
    if (familyId === 'estradiol') {
      return resolveFamilyVariant(familyId, { strength: estradiolStrength });
    }
    if (familyId === 'minoxidil') {
      return resolveFamilyVariant(familyId, {});
    }
    return resolveFamilyVariant(familyId, {});
  }, [family, familyId, purchaseType, additive, doseTier, form, nasalOption, estradiolStrength]);

  // NAD injection package state
  const [injPackage, setInjPackage] = useState<'5mL' | '10mL'>('5mL');
  const nadResolution = useMemo(() => {
    if (familyId !== 'nad') return resolution;
    return resolveFamilyVariant(familyId, {
      form,
      nasalOption,
      package: injPackage,
    });
  }, [familyId, form, nasalOption, injPackage, resolution]);

  const active = familyId === 'nad' ? nadResolution : resolution;
  const variant = active?.variant || null;
  const gate = variant
    ? assertFamilyVariantGenOrderAllowed({
        genClientProductId: variant.genClientProductId,
        genPairingVerified: variant.genPairingVerified,
        routingStatus: variant.routingStatus,
      })
    : null;

  if (!family) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p>Unknown family.</p>
        <Link to="/preview/families" className="underline text-sm">
          Back
        </Link>
      </div>
    );
  }

  const doseOptions =
    familyId === 'tirzepatide'
      ? ['Starting / Low', 'Mid', 'High', 'Any Dose']
      : ['Starting / Low', 'Mid', 'High', 'Any Dose'];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">
        QA preview · cutover OFF · GEN orders OFF
      </p>
      <h1 className="font-display text-3xl text-ink-900 mb-2">{family.displayName}</h1>
      <p className="text-ink-600 mb-8">{family.architectureRule}</p>

      <div className="space-y-6 rounded-xl border border-ink-100 bg-white p-6">
        {(familyId === 'semaglutide' || familyId === 'tirzepatide') && (
          <>
            <fieldset>
              <legend className="text-sm font-medium text-ink-800 mb-2">Purchase type</legend>
              <div className="flex flex-wrap gap-2">
                {(['one_time', 'membership'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPurchaseType(opt)}
                    className={`rounded-full px-4 py-2 text-sm border ${
                      purchaseType === opt
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-ink-200 text-ink-700'
                    }`}
                  >
                    {opt === 'one_time' ? 'One-time' : 'Membership'}
                  </button>
                ))}
              </div>
            </fieldset>
            {purchaseType === 'one_time' && (
              <>
                <fieldset>
                  <legend className="text-sm font-medium text-ink-800 mb-2">Formulation</legend>
                  <div className="flex flex-wrap gap-2">
                    {(['Vitamin B12', 'Glycine'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAdditive(opt)}
                        className={`rounded-full px-4 py-2 text-sm border ${
                          additive === opt
                            ? 'border-ink-900 bg-ink-900 text-white'
                            : 'border-ink-200 text-ink-700'
                        }`}
                      >
                        {opt === 'Vitamin B12' ? 'Vitamin B12' : 'Glycine'}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-medium text-ink-800 mb-2">Dose</legend>
                  <div className="flex flex-wrap gap-2">
                    {doseOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDoseTier(opt)}
                        className={`rounded-full px-4 py-2 text-sm border ${
                          doseTier.startsWith(opt.split(' ')[0]) || doseTier === opt
                            ? 'border-ink-900 bg-ink-900 text-white'
                            : 'border-ink-200 text-ink-700'
                        }`}
                      >
                        {familyId === 'tirzepatide' && opt === 'Starting / Low'
                          ? 'Starting / Low (5+10)'
                          : familyId === 'tirzepatide' && opt === 'Mid'
                            ? 'Mid (15+20)'
                            : familyId === 'tirzepatide' && opt === 'High'
                              ? 'High (25+30)'
                              : opt}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </>
            )}
          </>
        )}

        {familyId === 'nad' && (
          <>
            <fieldset>
              <legend className="text-sm font-medium text-ink-800 mb-2">Delivery</legend>
              <div className="flex flex-wrap gap-2">
                {['Injection', 'Nasal Spray'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm(opt)}
                    className={`rounded-full px-4 py-2 text-sm border ${
                      form === opt
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-ink-200 text-ink-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </fieldset>
            {form === 'Injection' && (
              <fieldset>
                <legend className="text-sm font-medium text-ink-800 mb-2">Package</legend>
                <div className="flex flex-wrap gap-2">
                  {(['5mL', '10mL'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInjPackage(opt)}
                      className={`rounded-full px-4 py-2 text-sm border ${
                        injPackage === opt
                          ? 'border-ink-900 bg-ink-900 text-white'
                          : 'border-ink-200 text-ink-700'
                      }`}
                    >
                      {opt === '5mL' ? '5 mL / 500 mg' : '10 mL / 1000 mg'}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-amber-700">
                  100mg/mL injection remains formulary-pending — not substituted with 200mg/mL.
                </p>
              </fieldset>
            )}
            {form === 'Nasal Spray' && (
              <fieldset>
                <legend className="text-sm font-medium text-ink-800 mb-2">Nasal option</legend>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setNasalOption('r84')}
                    className={`rounded-full px-4 py-2 text-sm border ${
                      nasalOption === 'r84'
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-ink-200 text-ink-700'
                    }`}
                  >
                    50mg/mL · 15mL
                  </button>
                  <button
                    type="button"
                    onClick={() => setNasalOption('r85')}
                    className={`rounded-full px-4 py-2 text-sm border ${
                      nasalOption === 'r85'
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-ink-200 text-ink-700'
                    }`}
                  >
                    200mg/mL · 15mL
                  </button>
                </div>
              </fieldset>
            )}
          </>
        )}

        {familyId === 'wolverine-bpc-tb' && (
          <fieldset>
            <legend className="text-sm font-medium text-ink-800 mb-2">Form</legend>
            <div className="flex flex-wrap gap-2">
              {['Capsule', 'Injection'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setForm(opt)}
                  className={`rounded-full px-4 py-2 text-sm border ${
                    form === opt
                      ? 'border-ink-900 bg-ink-900 text-white'
                      : 'border-ink-200 text-ink-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {familyId === 'estradiol' && (
          <fieldset>
            <legend className="text-sm font-medium text-ink-800 mb-2">Patch strength</legend>
            <div className="flex flex-wrap gap-2">
              {['0.025', '0.0375', '0.05', '0.1'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setEstradiolStrength(opt)}
                  className={`rounded-full px-4 py-2 text-sm border ${
                    estradiolStrength === opt
                      ? 'border-ink-900 bg-ink-900 text-white'
                      : 'border-ink-200 text-ink-700'
                  }`}
                >
                  {opt} mg/hr
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {familyId === 'minoxidil' && (
          <p className="text-sm text-ink-600">
            Locked formula: Finasteride / Minoxidil 0.1% / 5% — $79
          </p>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-ink-200 bg-ink-50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500 mb-3">
          Resolved route (QA — not shown to patients)
        </h2>
        {!active?.ok || !variant ? (
          <p className="text-ink-700">No matching variant ({active?.reason || 'unresolved'}).</p>
        ) : (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-ink-400">Website variant</dt>
              <dd className="font-mono text-ink-900">{variant.websiteVariantId}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Patient label</dt>
              <dd className="text-ink-900">{variant.displayLabel}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Price</dt>
              <dd className="text-ink-900">
                {variant.finalRetailPrice == null
                  ? '—'
                  : typeof variant.finalRetailPrice === 'number'
                    ? `$${variant.finalRetailPrice}`
                    : `$${variant.finalRetailPrice}`}
                {familyId === 'semaglutide' && purchaseType === 'membership' ? ' / month' : ''}
                {familyId === 'tirzepatide' && purchaseType === 'membership' ? ' / month' : ''}
              </dd>
            </div>
            <div>
              <dt className="text-ink-400">Routing status</dt>
              <dd className="font-mono text-ink-900">{variant.routingStatus}</dd>
            </div>
            <div>
              <dt className="text-ink-400">GEN clientProductId</dt>
              <dd className="font-mono text-xs break-all text-ink-900">
                {variant.genClientProductId || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-ink-400">genPairingVerified</dt>
              <dd className="font-mono text-ink-900">{String(variant.genPairingVerified)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-ink-400">Live GEN order gate</dt>
              <dd className="font-mono text-ink-900">
                {gate?.allowed ? 'ALLOWED' : `BLOCKED (${gate?.code})`} — {gate?.message}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-ink-700 mb-2">Patient-visible options in this family</h3>
        <ul className="text-sm text-ink-600 space-y-1">
          {visible.map((v) => (
            <li key={v.websiteVariantId}>
              {v.displayLabel} · {v.routingStatus}
              {v.finalRetailPrice != null ? ` · $${v.finalRetailPrice}` : ''}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 text-sm text-ink-400">
        <Link to="/preview/families" className="underline">
          ← All families
        </Link>
      </p>
    </div>
  );
}
