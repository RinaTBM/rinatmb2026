import { useState } from 'react';
import { ArrowRight, Check, Lock, ShieldCheck } from 'lucide-react';
import { Link } from '@/router';
import type { Membership } from '@/data/products';
import { paragraphs } from '@/data/productCopy';
import { useCart } from '@/context/CartContext';
import { MembershipRequestedDoseField } from '@/components/MembershipRequestedDoseField';
import { membershipJoinButtonClassName } from '@/lib/ui/membershipCta';
import {
  labelRequestedFormulation,
  validateMembershipRequestedFormulation,
} from '@/lib/membership/requestedFormulation';

/** Membership detail experience served at `/product/:membership-slug`. */
export function MembershipDetailPage({ membership }: { membership: Membership }) {
  const { addItem } = useCart();
  const [requestedFormulation, setRequestedFormulation] = useState('');
  const [doseError, setDoseError] = useState<string | null>(null);

  const handleJoin = () => {
    const validated = validateMembershipRequestedFormulation({
      requestedFormulation,
      includedFormulations: membership.includedFormulations,
    });
    if (!validated.ok) {
      setDoseError(validated.error);
      return;
    }
    setDoseError(null);
    const doseLabel = labelRequestedFormulation(validated.value);
    addItem({
      productId: membership.checkoutProductId || membership.id,
      slug: membership.slug,
      name: membership.displayName,
      price: membership.monthlyPrice,
      standardPrice: membership.monthlyPrice,
      image: membership.image,
      subscription: true,
      section: 'membership',
      requiresIntake: true,
      isMembership: true,
      billingFrequency: 'monthly',
      purchaseType: 'membership_program',
      discountPercent: 0,
      appliedDiscount: 'none',
      requestedFormulation: validated.value,
      variantLabel: `Requested dose: ${doseLabel}`,
    });
  };

  return (
    <div className="bg-cream-50 pt-28 md:pt-32 pb-20">
      <section className="pb-12">
        <div className="container-lux">
          <nav className="mb-6 text-sm text-ink-500">
            <Link to="/memberships" className="hover:text-ink-900">
              Memberships
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-800">{membership.displayName}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 max-w-5xl">
            <div className="overflow-hidden rounded-2xl bg-cream-100">
              <img
                src={membership.image}
                alt={membership.imageAlt}
                className="h-full w-full object-cover aspect-square"
              />
            </div>

            <div className="flex flex-col">
              <p className="eyebrow text-gold-600 mb-2">{membership.brandName}</p>
              <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-3">
                {membership.displayName}
              </h1>
              <p className="text-ink-600 leading-relaxed mb-4">{membership.shortDescription}</p>
              <div className="mb-4">
                <span className="font-serif text-4xl text-ink-900">${membership.monthlyPrice}</span>
                <span className="text-ink-500 ml-1">/month</span>
              </div>
              <p className="text-sm text-ink-500 mb-5">
                Initial term: {membership.initialTermMonths} months, then month to month.
              </p>

              <div className="mb-4 flex items-start gap-2 rounded-xl bg-gold-50 border border-gold-200/70 p-3 text-sm text-gold-800">
                <Lock size={16} className="flex-shrink-0 mt-0.5" />
                <span>
                  Locked monthly rate while your membership stays continuously active and in good
                  standing.
                </span>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">
                  Included formulations
                </p>
                <ul className="space-y-1.5">
                  {membership.includedFormulations.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-ink-700">
                      <Check size={14} className="text-gold-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {membership.maximumIncludedFormulation && (
                  <p className="mt-2 text-xs text-ink-500">
                    Program maximum: {membership.maximumIncludedFormulation}. Your provider
                    determines the appropriate formulation and treatment plan.
                  </p>
                )}
              </div>

              <div className="mb-5 rounded-xl border border-cream-300 bg-white p-4">
                <MembershipRequestedDoseField
                  id={`requested-dose-${membership.slug}`}
                  includedFormulations={membership.includedFormulations}
                  value={requestedFormulation}
                  onChange={v => {
                    setRequestedFormulation(v);
                    setDoseError(null);
                  }}
                />
                {doseError && <p className="mt-2 text-xs text-red-700">{doseError}</p>}
              </div>

              <ul className="space-y-2 mb-6">
                {membership.benefits.slice(0, 6).map(b => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-ink-700">
                    <Check size={16} className="flex-shrink-0 mt-0.5 text-gold-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <p className="mb-4 flex items-start gap-1.5 text-xs text-gold-700">
                <ShieldCheck size={14} className="mt-0.5 flex-shrink-0" />
                Licensed-provider review required · enrollment/payment does not guarantee a
                prescription
              </p>

              <button
                type="button"
                onClick={handleJoin}
                className={membershipJoinButtonClassName({ highlighted: membership.highlighted })}
              >
                {membership.cta} <ArrowRight size={16} aria-hidden="true" />
              </button>

              <p className="mt-3 text-center text-xs text-ink-500">
                <Link to="/memberships" className="text-gold-600 hover:text-gold-700 link-underline">
                  Compare memberships
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-t border-cream-300">
        <div className="container-lux max-w-4xl space-y-10">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl md:text-3xl text-ink-900">About This Membership</h2>
            {paragraphs(membership.longDescription).map((p, i) => (
              <p key={i} className="text-ink-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {membership.howItWorks && (
            <div className="space-y-3">
              <h2 className="font-serif text-2xl md:text-3xl text-ink-900">
                Program vs Medication Fulfillment
              </h2>
              {paragraphs(membership.howItWorks).map((p, i) => (
                <p key={i} className="text-ink-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          )}

          {membership.whatToExpect && (
            <div className="space-y-3">
              <h2 className="font-serif text-2xl md:text-3xl text-ink-900">What to Expect</h2>
              {paragraphs(membership.whatToExpect).map((p, i) => (
                <p key={i} className="text-ink-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          )}

          {membership.commonUses && membership.commonUses.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-serif text-2xl md:text-3xl text-ink-900">Why Members Choose This</h2>
              <ul className="space-y-2.5">
                {membership.commonUses.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-ink-700">
                    <Check size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="font-serif text-2xl md:text-3xl text-ink-900">Important Information</h2>
            {paragraphs(
              membership.importantInformation ||
                'Membership enrollment and payment do not guarantee a prescription. Your provider determines appropriateness and dose.',
            ).map((p, i) => (
              <p key={i} className="text-ink-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {membership.faq.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-ink-900">Membership FAQ</h2>
              <div className="space-y-3">
                {membership.faq.map(faq => (
                  <details key={faq.q} className="card-lux group p-5">
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
          )}
        </div>
      </section>
    </div>
  );
}
