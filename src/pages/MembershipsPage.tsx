import { useState } from 'react';
import { Check, X, Lock, ArrowRight, ShieldCheck, ClipboardList, Stethoscope, PackageCheck } from 'lucide-react';
import { Link } from '@/router';
import { visibleMemberships, type Membership } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Glp1FormulationSelector, Glp1PatientDoseSelector } from '@/components/Glp1PatientDoseSelector';
import { membershipJoinButtonClassName } from '@/lib/ui/membershipCta';
import { buildGlp1MembershipCartFields } from '@/lib/glp1/membershipCart';
import { glp1FamilyIdFromSlug } from '@/lib/glp1/patientRequestedDose';
import { MEMBERSHIP_ENROLLMENT_ENABLED } from '@/lib/commerce/controlledLaunch';

const howItWorks = [
  { icon: ClipboardList, title: 'Choose your program', description: 'Select the Semaglutide ($125/month) or Tirzepatide ($179/month) membership and your requested care details.' },
  { icon: PackageCheck, title: 'Review due today vs monthly', description: 'Confirm membership and any one-time Initial Provider Visit ($75 when required). Due-today totals are not the ongoing monthly rate.' },
  { icon: Lock, title: 'Pay by Credit / Debit Card', description: 'Complete enrollment through secure hosted card checkout. Your card is charged monthly for the recurring amount shown while active.' },
  { icon: ClipboardList, title: 'Complete intake', description: 'After payment is confirmed, complete a secure medical intake so a licensed provider can review your information.' },
  { icon: Stethoscope, title: 'Provider review', description: 'A licensed provider reviews your eligibility and determines the appropriate formulation, strength, and treatment plan. Payment does not guarantee approval.' },
  { icon: ShieldCheck, title: 'Fulfillment when approved', description: 'When payment is confirmed and treatment is approved, your prescription is sent to the dispensing pharmacy and fulfilled according to the existing workflow.' },
];

const faqs = [
  { q: 'Will my price increase if my treatment changes?', a: 'Your Semaglutide membership remains $125 per month while your membership stays continuously active and your provider-selected treatment remains within the included program. Your Tirzepatide membership remains $179 per month while your provider-selected treatment remains within the included program through 15mg.' },
  { q: 'Can I choose my dose?', a: 'No. Your licensed provider determines the appropriate formulation, strength, and treatment plan based on your eligibility and clinical information.' },
  { q: 'Does joining guarantee a prescription?', a: 'No. Membership enrollment and payment do not guarantee prescribing. A licensed provider must review your information and determine whether treatment is appropriate.' },
  { q: 'What happens if I cancel?', a: 'Canceling ends your locked membership rate. Future enrollment is subject to the membership price available at that time.' },
  { q: 'Can I switch programs?', a: 'Yes, when clinically appropriate. Switching programs requires enrollment at the current price for the new membership.' },
  { q: 'Is the highest Tirzepatide formulation included?', a: 'The $179 membership includes eligible provider-selected formulations through 15mg.' },
  { q: 'Are labs included?', a: 'Laboratory testing is not included unless the current workflow specifically states otherwise. A provider may request labs before or during treatment.' },
  { q: 'How is fulfillment handled?', a: 'Medication fulfillment remains subject to required provider review and approval. Processing and shipping timelines begin only after payment has been received and verified and any required provider review/approval has been completed. Certain medications may require temperature-controlled packaging.' },
  { q: 'How do I pay for my membership?', a: 'Join with Credit / Debit Card. Your card is charged monthly while your membership stays active. A 3-month minimum commitment applies.' },
  { q: 'Can I use Cherry financing with a membership?', a: 'Cherry financing availability and terms are determined by Cherry. Recurring membership billing remains subject to My Bare Method membership terms and is charged to your card monthly while active.' },
];

const comparisonRows: { feature: string; sema: string | boolean; tirz: string | boolean; onetime: string | boolean }[] = [
  { feature: 'Monthly price', sema: '$125', tirz: '$179', onetime: 'Varies by selected product' },
  { feature: '15% off eligible wellness products', sema: true, tirz: true, onetime: false },
  { feature: '15% off accessories', sema: true, tirz: true, onetime: false },
  { feature: 'Included program', sema: 'Eligible included Semaglutide formulations', tirz: 'Eligible formulations through 15mg', onetime: 'Selected purchased formulation' },
  { feature: 'Locked continuous-member rate', sema: true, tirz: true, onetime: false },
  { feature: 'Provider review required', sema: true, tirz: true, onetime: 'Provider-directed when applicable' },
  { feature: 'Provider-directed treatment adjustments', sema: 'Yes, within included program', tirz: 'Yes, within included program maximum', onetime: 'Provider-directed when applicable' },
  { feature: 'Initial commitment', sema: '3 months', tirz: '3 months', onetime: 'None' },
  { feature: 'Recurring fulfillment', sema: 'Yes, when prescribed', tirz: 'Yes, when prescribed', onetime: false },
  { feature: 'One-time purchase option', sema: false, tirz: false, onetime: true },
  { feature: 'Prescription guaranteed', sema: false, tirz: false, onetime: false },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value
      ? <Check size={16} className="mx-auto text-gold-600" aria-label="Yes" />
      : <X size={16} className="mx-auto text-ink-300" aria-label="No" />;
  }
  return <span className="text-ink-700">{value}</span>;
}

export function MembershipsPage() {
  const { addItem } = useCart();
  const [formulationBySlug, setFormulationBySlug] = useState<Record<string, string>>({});
  const [doseBySlug, setDoseBySlug] = useState<Record<string, string>>({});
  const [doseErrors, setDoseErrors] = useState<Record<string, string>>({});

  const handleJoin = (m: Membership) => {
    const built = buildGlp1MembershipCartFields({
      membership: m,
      formulation: formulationBySlug[m.slug],
      requestedDose: doseBySlug[m.slug],
    });
    if (!built.ok) {
      setDoseErrors(prev => ({ ...prev, [m.slug]: built.error }));
      return;
    }
    setDoseErrors(prev => {
      const next = { ...prev };
      delete next[m.slug];
      return next;
    });
    addItem({
      productId: m.checkoutProductId || m.id,
      slug: m.slug,
      name: m.displayName,
      price: built.monthlyPrice,
      standardPrice: built.monthlyPrice,
      image: m.image,
      subscription: true,
      section: 'membership',
      requiresIntake: true,
      isMembership: true,
      billingFrequency: 'monthly',
      purchaseType: 'membership_program',
      discountPercent: 0,
      appliedDiscount: 'none',
      requestedFormulation: built.requestedFormulation,
      requestedDose: built.requestedDose,
      variantLabel: built.variantLabel,
    });
  };

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <div className="container-lux max-w-3xl">
          <p className="eyebrow mb-3">Active Wellness Membership · Best Value</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-5">One Membership. One Price.</h1>
          <p className="text-lg text-ink-500 leading-relaxed mb-4">
            Unlike programs that increase monthly pricing as treatment changes, your membership rate stays the same
            while you remain continuously enrolled and your provider adjusts your eligible treatment within the
            included program.
          </p>
          <p className="text-base text-gold-700 font-medium">
            Active Wellness Members save 15% on eligible wellness products and accessories.
          </p>
          {!MEMBERSHIP_ENROLLMENT_ENABLED && (
            <div className="mt-6 rounded-xl border border-gold-200 bg-gold-50 px-5 py-4 text-left text-sm text-gold-900">
              <p className="font-semibold">New membership enrollment is temporarily unavailable.</p>
              <p className="mt-1">One-time purchases remain available while we complete final recurring-billing verification.</p>
              <Link to="/shop-all" className="mt-3 inline-flex font-semibold underline underline-offset-4">
                Shop one-time options
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Value emphasis */}
      <section className="pb-8">
        <div className="container-lux max-w-4xl">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Flat-rate membership pricing',
              'Save 15% on eligible wellness products',
              'Save 15% on accessories',
              'Priority access to new wellness products',
              'Convenient ongoing wellness support',
              'Provider-guided care',
            ].map(benefit => (
              <div key={benefit} className="flex items-center gap-2 rounded-xl border border-gold-200 bg-gold-50/60 px-4 py-3 text-sm text-ink-800">
                <Check size={16} className="text-gold-600 shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership cards */}
      <section className="pb-8 md:pb-12">
        <div className="container-lux">
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {visibleMemberships.map(m => (
              <div
                key={m.id}
                className={`relative card-lux p-8 flex flex-col ${m.highlighted ? 'ring-2 ring-gold-400 shadow-lg' : ''}`}
              >
                {m.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-400 px-4 py-1 text-xs font-semibold text-ink-900 whitespace-nowrap">
                    Most Popular
                  </span>
                )}
                <p className="eyebrow text-gold-600 mb-1">{m.brandName}</p>
                <h2 className="font-serif text-3xl text-ink-900 mb-2">{m.displayName}</h2>
                <div className="mb-3">
                  <span className="font-serif text-4xl text-ink-900">${m.monthlyPrice}</span>
                  <span className="text-ink-500 ml-1">/month</span>
                </div>
                <p className="text-sm text-ink-600 mb-4">{m.valueStatement}</p>

                <div className="mb-4 flex items-start gap-2 rounded-xl bg-gold-50 border border-gold-200/70 p-3 text-sm text-gold-800">
                  <Lock size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Locked monthly rate while your membership stays continuously active and in good standing.</span>
                </div>

                {/* Included program */}
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">Included program</p>
                  <p className="text-sm font-medium text-ink-900">{m.includedProducts.join(', ')}</p>
                  <ul className="mt-2 space-y-1">
                    {m.includedFormulations.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-ink-600">
                        <Check size={14} className="text-gold-500 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-ink-500">
                    Your provider determines the appropriate formulation, strength, and treatment plan. Strengths are not
                    selectable at checkout.
                  </p>
                </div>

                {/* Tirzepatide program-cap callout (not minimized) */}
                {m.excludedFormulations.length > 0 && (
                  <div className="mb-4 rounded-xl border border-ink-200 bg-cream-100 p-3 text-sm text-ink-700">
                    <p className="font-semibold text-ink-900">Included program maximum: {m.maximumIncludedFormulation}</p>
                    <p className="mt-1">
                      One predictable monthly rate through the included program maximum. {m.excludedFormulations[0]}
                    </p>
                  </div>
                )}

                <ul className="space-y-2.5 mb-6 flex-1">
                  {m.benefits.map(b => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <Check size={16} className="flex-shrink-0 mt-0.5 text-gold-500" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <p className="mb-2 flex items-center gap-1.5 text-xs text-gold-700">
                  <ShieldCheck size={14} /> Licensed-provider review required · enrollment does not guarantee a prescription
                </p>
                <p className="mb-4 text-xs text-ink-500">Your recurring amount is shown before enrollment. Initial term: 3 months, then month to month.</p>

                <div className="mb-4 space-y-4 rounded-xl border border-cream-300 bg-cream-50/80 p-3">
                  {glp1FamilyIdFromSlug(m.slug) && (
                    <>
                      <Glp1FormulationSelector
                        value={formulationBySlug[m.slug] ?? ''}
                        onChange={v => {
                          setFormulationBySlug(prev => ({ ...prev, [m.slug]: v }));
                          setDoseErrors(prev => {
                            const next = { ...prev };
                            delete next[m.slug];
                            return next;
                          });
                        }}
                      />
                      <Glp1PatientDoseSelector
                        familyId={glp1FamilyIdFromSlug(m.slug)!}
                        value={doseBySlug[m.slug] ?? ''}
                        allowGettingStarted
                        onChange={v => {
                          setDoseBySlug(prev => ({ ...prev, [m.slug]: v }));
                          setDoseErrors(prev => {
                            const next = { ...prev };
                            delete next[m.slug];
                            return next;
                          });
                        }}
                      />
                    </>
                  )}
                  {doseErrors[m.slug] && (
                    <p className="mt-2 text-xs text-red-700">{doseErrors[m.slug]}</p>
                  )}
                </div>

                <button
                  onClick={() => handleJoin(m)}
                  disabled={!MEMBERSHIP_ENROLLMENT_ENABLED}
                  className={membershipJoinButtonClassName({ highlighted: m.highlighted })}
                >
                  {MEMBERSHIP_ENROLLMENT_ENABLED ? m.cta : 'Enrollment temporarily unavailable'}
                  {MEMBERSHIP_ENROLLMENT_ENABLED && <ArrowRight size={16} aria-hidden="true" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-cream-100/50">
        <div className="container-lux">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Simple and guided</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900">How It Works</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cream-200 text-gold-600">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <p className="text-xs text-gold-600 font-medium mb-2">STEP {i + 1}</p>
                <h3 className="font-serif text-xl text-ink-900 mb-2">{title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locked-price explanation */}
      <section className="py-16 md:py-20">
        <div className="container-lux max-w-3xl">
          <div className="text-center mb-8">
            <p className="eyebrow mb-3">Predictable pricing</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900">Your Rate Stays Locked</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-lux p-6 flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                <Lock size={22} className="text-gold-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-ink-900 mb-1">Continuous enrollment</h3>
                <p className="text-sm text-ink-500">
                  Your monthly membership rate remains locked while your membership stays continuously active and in
                  good standing, even as your provider adjusts your eligible treatment within the included program.
                </p>
              </div>
            </div>
            <div className="card-lux p-6 flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                <ShieldCheck size={22} className="text-gold-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-ink-900 mb-1">Tirzepatide program maximum</h3>
                <p className="text-sm text-ink-500">
                  The $179 Tirzepatide rate includes eligible provider-selected formulations through 15mg.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 md:py-20 bg-cream-100/50">
        <div className="container-lux max-w-5xl">
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">Compare your options</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900">Membership Comparison</h2>
          </div>
          <div className="card-lux overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-ink-900 text-cream-50 text-left">
                  <th scope="col" className="p-4 font-medium">Feature</th>
                  <th scope="col" className="p-4 font-medium text-center bg-gold-400/20">Semaglutide Membership</th>
                  <th scope="col" className="p-4 font-medium text-center">Tirzepatide Membership</th>
                  <th scope="col" className="p-4 font-medium text-center">Shop Without a Membership</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={`${i % 2 === 0 ? 'bg-white' : 'bg-cream-50'} border-t border-cream-200`}>
                    <th scope="row" className="p-4 text-left font-medium text-ink-700">{row.feature}</th>
                    <td className="p-4 text-center bg-gold-50/30"><Cell value={row.sema} /></td>
                    <td className="p-4 text-center"><Cell value={row.tirz} /></td>
                    <td className="p-4 text-center"><Cell value={row.onetime} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <div className="container-lux max-w-3xl">
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">Questions & answers</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900">Membership FAQs</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="card-lux group p-5">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-ink-900 list-none">
                  {faq.q}
                  <span className="ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cream-200 text-ink-600 transition-transform group-open:rotate-45">
                    <span className="text-lg leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-ink-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Terms summary */}
      <section className="py-16 md:py-20 bg-cream-100/50">
        <div className="container-lux max-w-3xl">
          <div className="text-center mb-8">
            <p className="eyebrow mb-3">Membership terms</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900">The Essentials</h2>
          </div>
          <ul className="space-y-3">
            {visibleMemberships[0]?.termsSummary.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-ink-600">
                <Check size={16} className="flex-shrink-0 mt-0.5 text-gold-500" />
                <span>{t}</span>
              </li>
            ))}
            <li className="flex items-start gap-3 text-sm text-ink-600">
              <Check size={16} className="flex-shrink-0 mt-0.5 text-gold-500" />
              <span>The $179 Tirzepatide locked rate includes eligible provider-selected formulations through 15mg.</span>
            </li>
          </ul>
          <div className="mt-8 text-center">
            <Link to="/membership-terms" className="text-sm text-gold-600 hover:text-gold-700 link-underline">
              Read full Membership &amp; Cancellation Terms
            </Link>
          </div>
        </div>
      </section>

      {/* Shop Without a Membership */}
      <section className="py-16 md:py-20">
        <div className="container-lux max-w-lg text-center">
          <h2 className="font-serif text-3xl text-ink-900 mb-3">Shop Without a Membership</h2>
          <p className="text-ink-500 mb-6">
            Prefer flexibility? Choose an eligible product as a one-time purchase without monthly enrollment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop-all" className="btn-primary">Shop Without a Membership <ArrowRight size={16} /></Link>
            <Link to="/section/weight-management" className="btn-outline">Browse Weight Management</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
