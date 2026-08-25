import { useState } from 'react';
import { Link } from '@/router';
import { ArrowLeft, ArrowRight, Stethoscope, ShieldCheck, Sparkles } from 'lucide-react';
import { getConcern, getProductsByConcern, getMembershipsForConcern, concerns, type ConcernId } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Glp1FormulationSelector, Glp1PatientDoseSelector } from '@/components/Glp1PatientDoseSelector';
import { useCart } from '@/context/CartContext';
import { membershipJoinButtonClassName } from '@/lib/ui/membershipCta';
import { buildGlp1MembershipCartFields } from '@/lib/glp1/membershipCart';
import { glp1FamilyIdFromSlug } from '@/lib/glp1/patientRequestedDose';

export function ConcernPage({ concernId }: { concernId: string }) {
  const concern = getConcern(concernId);
  const { addItem } = useCart();
  const [formulationBySlug, setFormulationBySlug] = useState<Record<string, string>>({});
  const [doseBySlug, setDoseBySlug] = useState<Record<string, string>>({});
  const [doseErrors, setDoseErrors] = useState<Record<string, string>>({});

  if (!concern) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500">Concern not found.</p>
        <Link to="/" className="btn-outline mt-6">Back home</Link>
      </div>
    );
  }

  const concernProducts = getProductsByConcern(concern.id as ConcernId);
  const concernMemberships = getMembershipsForConcern(concern.id as ConcernId);

  const providerGuided = concernProducts;
  const hasProvider = providerGuided.length > 0;
  const hasResearch = false;

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={concern.image} alt={concern.label} className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream-50/80 to-cream-50" />
        </div>
        <div className="container-lux relative z-10 text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-6 transition-colors">
            <ArrowLeft size={14} /> All Concerns
          </Link>
          <p className="eyebrow mb-3 text-sm">Shop by Concern</p>
          <h1 className="font-serif text-4xl md:text-6xl text-ink-900 mb-4 text-balance">{concern.label}</h1>
          <p className="text-lg text-ink-500 max-w-md mx-auto">{concern.description}</p>
        </div>
      </section>

      {/* Provider notice */}
      {(hasProvider || hasResearch) && (
        <div className="container-lux">
          <div className={`rounded-xl px-5 py-4 mb-8 text-sm ${hasProvider ? 'bg-gold-50 text-gold-800' : 'bg-nude-100 text-nude-800'}`}>
            <div className="flex items-start gap-2">
              {hasProvider ? <Stethoscope size={18} className="flex-shrink-0 mt-0.5" /> : <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />}
              <p>Provider review and approval are required before fulfillment. Purchase does not guarantee approval.</p>
            </div>
          </div>
        </div>
      )}

      {/* Memberships */}
      {concernMemberships.length > 0 && (
        <section className="pb-12">
          <div className="container-lux">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={20} className="text-gold-500" />
              <h2 className="font-serif text-2xl text-ink-900">Recommended Memberships</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
              {concernMemberships.map(m => (
                <div key={m.id} className={`relative card-lux p-8 flex flex-col ${m.highlighted ? 'ring-2 ring-gold-400 shadow-lg' : ''}`}>
                  {m.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-400 px-4 py-1 text-xs font-semibold text-ink-900">
                      Best Value
                    </span>
                  )}
                  <div className="mb-4">
                    <h3 className="font-serif text-2xl text-ink-900 mb-1">{m.name}</h3>
                    <p className="text-sm text-ink-500">{m.tagline}</p>
                  </div>
                  <div className="mb-6">
                    <span className="font-serif text-4xl text-ink-900">${m.price}</span>
                    <span className="text-ink-500 ml-1">{m.priceLabel}</span>
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {m.features.slice(0, 4).map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-ink-700">
                        <ShieldCheck size={16} className="flex-shrink-0 mt-0.5 text-gold-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
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
                    onClick={() => {
                      const built = buildGlp1MembershipCartFields({
                        membership: m,
                        formulation: formulationBySlug[m.slug],
                        requestedDose: doseBySlug[m.slug],
                      });
                      if (!built.ok) {
                        setDoseErrors(prev => ({ ...prev, [m.slug]: built.error }));
                        return;
                      }
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
                    }}
                    className={membershipJoinButtonClassName({ highlighted: m.highlighted })}
                  >
                    Join {m.displayName.split(' ')[0]} <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Provider-guided products */}
      {providerGuided.length > 0 && (
        <section className="pb-12">
          <div className="container-lux">
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope size={20} className="text-gold-600" />
              <h2 className="font-serif text-2xl text-ink-900">Provider-Guided Products</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {providerGuided.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Other concerns */}
      <section className="py-16 md:py-20 bg-cream-100/50">
        <div className="container-lux">
          <h2 className="font-serif text-3xl text-ink-900 mb-8 text-center">Explore other concerns</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {concerns.filter(c => c.id !== concern.id).map(c => (
              <Link key={c.id} to={`/concern/${c.id}`} className="rounded-full border border-ink-200 px-5 py-2.5 text-sm text-ink-700 hover:border-ink-900 hover:bg-ink-900 hover:text-cream-50 transition-all">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
