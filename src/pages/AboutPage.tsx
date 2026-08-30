import { Link } from '@/router';
import { GEN_DISPENSING_PHARMACIES_TEXT, PHARMACY_FULFILLMENT_SHORT } from '@/data/pharmacyFulfillmentCopy';
import { ShieldCheck, FlaskConical, Stethoscope, Sparkles, Heart, ArrowRight, Quote, Users, Scale, Activity, HeartPulse } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/917526/pexels-photo-917526.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Diverse women doing yoga together" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream-50/60 to-cream-50" />
        </div>
        <div className="container-lux relative z-10 text-center max-w-2xl mx-auto">
          <p className="eyebrow mb-4 text-sm">Our Story</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-6 text-balance">Wellness, beautifully bare.</h1>
          <p className="text-lg md:text-xl text-ink-600 leading-relaxed">
            My Bare Method was born from a simple belief: wellness should feel luxurious, personal, and honest. No noise, no fillers, no gimmicks — just thoughtfully curated products and provider-guided care that meets you where you are.
          </p>
        </div>
      </section>

      {/* Inclusivity banner */}
      <section className="py-16 md:py-20 bg-cream-100/50">
        <div className="container-lux max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-nude-200 text-gold-600">
              <Users size={30} />
            </div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-4 text-balance">For every body, every age, every story.</h2>
          <p className="text-lg text-ink-600 leading-relaxed mb-4">
            We believe wellness is not one-size-fits-all. It is not about perfection. It is about meeting yourself with care — at 25 or 75, in every body, at every stage.
          </p>
          <p className="text-lg text-ink-600 leading-relaxed">
            Our products and provider care are designed to support confidence, healthy aging, and realistic results. No before-and-after culture. No shame. Just support for the person you are today.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container-lux max-w-3xl text-center">
          <p className="eyebrow mb-3 text-sm">Our Mission</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-6 text-balance">
            To make premium wellness feel effortless and deeply personal.
          </h2>
          <p className="text-lg text-ink-600 leading-relaxed mb-4">
            We believe wellness is not one-size-fits-all. That is why we organize everything around your goals — whether that is weight management, longevity, hormone balance, or simply feeling your best every day.
          </p>
          <p className="text-lg text-ink-600 leading-relaxed">
            As a brand of The Bare Method, we carry forward the same commitment to quality, transparency, and care — refined into a luxury experience worthy of your wellness journey.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-cream-100/50">
        <div className="container-lux">
          <div className="mb-12 text-center">
            <p className="eyebrow mb-3 text-sm">What we stand for</p>
            <h2 className="font-serif text-4xl text-ink-900">Our Values</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Sparkles, title: 'Refined Quality', description: 'Premium, bioavailable ingredients. Third-party tested. No fillers, no shortcuts.' },
              { icon: ShieldCheck, title: 'Radical Transparency', description: 'Clear labels, honest disclosures, and real reviews. Always.' },
              { icon: Heart, title: 'Personal Care', description: 'Provider-guided programs and goal-based curation that meet you where you are.' },
              { icon: Scale, title: 'Body-Positive', description: 'No perfection culture. We celebrate every body and every stage of the journey.' },
            ].map((value, i) => (
              <div key={i} className="card-lux p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream-200 text-gold-600">
                  <value.icon size={26} />
                </div>
                <h3 className="font-serif text-xl text-ink-900 mb-2">{value.title}</h3>
                <p className="text-base text-ink-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusivity imagery section */}
      <section className="py-16 md:py-24">
        <div className="container-lux">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <img src="https://images.pexels.com/photos/33476389/pexels-photo-33476389.jpeg?auto=compress&cs=tinysrgb&w=900" alt="Confident woman with vitiligo posing outdoors" className="rounded-3xl w-full" />
            </div>
            <div>
              <p className="eyebrow mb-3 text-sm">Real people, real care</p>
              <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-4 text-balance">Confidence at every stage</h2>
              <p className="text-lg text-ink-600 leading-relaxed mb-4">
                We feature authentic, diverse people in our imagery — different ages, body types, skin tones, and genders. Because wellness belongs to all of us.
              </p>
              <p className="text-lg text-ink-600 leading-relaxed">
                Our community spans from people in their 20s building healthy foundations, to those in their 70s and beyond aging with grace. Every story matters. Every body is welcome.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three collections */}
      <section className="py-16 md:py-24 bg-cream-100/50">
        <div className="container-lux">
          <div className="mb-12 text-center">
            <p className="eyebrow mb-3 text-sm">Three ways to wellness</p>
            <h2 className="font-serif text-4xl text-ink-900">Our Collections</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Activity, title: 'Weight Management', description: 'Semaglutide and Tirzepatide options, provider-guided and personalized.', to: '/section/weight-management' },
              { icon: Sparkles, title: 'Longevity & Cognitive', description: 'NAD+ and cognitive wellness options available after licensed-provider review.', to: '/section/longevity' },
              { icon: HeartPulse, title: 'HRT for Women', description: 'Estrogen, progesterone, and testosterone options personalized after clinical review.', to: '/section/hrt-women' },
              { icon: Stethoscope, title: 'Provider Care', description: 'Consultations, lab kits, and laboratory reviews when required for care.', to: '/section/provider-care' },
              { icon: FlaskConical, title: 'Recovery & Performance', description: 'Provider-directed recovery and performance support after eligibility review.', to: '/section/recovery-performance' },
            ].map((col, i) => (
              <Link key={i} to={col.to} className="card-lux p-8 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream-200 text-gold-600">
                  <col.icon size={26} />
                </div>
                <h3 className="font-serif text-xl text-ink-900 mb-2">{col.title}</h3>
                <p className="text-base text-ink-500 leading-relaxed mb-4">{col.description}</p>
                <span className="text-sm text-gold-600 flex items-center gap-1">Explore <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 md:py-24 bg-ink-900 text-cream-50">
        <div className="container-lux max-w-3xl text-center">
          <Quote size={40} className="mx-auto text-gold-300 mb-6 opacity-50" />
          <p className="font-serif text-2xl md:text-3xl leading-relaxed text-balance mb-6">
            "We built My Bare Method to be the wellness brand we always wished existed — luxurious, honest, inclusive, and genuinely caring."
          </p>
          <p className="text-sm text-cream-100/60">— The My Bare Method Team</p>
        </div>
      </section>

      {/* Telemedicine & Provider Info */}
      <section className="py-16 md:py-24 bg-cream-100/50">
        <div className="container-lux max-w-3xl">
          <div className="mb-8 text-center">
            <p className="eyebrow mb-3 text-sm">Provider Information</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900">Telemedicine Services</h2>
          </div>
          <div className="card-lux p-8 md:p-10 space-y-6">
            <p className="text-lg text-ink-600 leading-relaxed">
              My Bare Method offers telemedicine services via Zoom. Appointments are booked directly on our website by the patient.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-ink-400 uppercase tracking-wider mb-1">Jurisdictions Served</p>
                <p className="text-ink-800">All 50 US States</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-400 uppercase tracking-wider mb-1">Medical Director</p>
                <p className="text-ink-800">Dr. Jerry J. Cattelane Jr., D.O.</p>
                <Link to="/medical-director" className="mt-2 inline-block text-sm text-gold-600 hover:text-gold-700 link-underline">
                  Meet Our Medical Director
                </Link>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-400 uppercase tracking-wider mb-1">Pharmacy Partners</p>
                <p className="text-ink-800">GEN Health dispensing network</p>
                <p className="mt-3 text-sm text-ink-600 leading-relaxed">
                  {PHARMACY_FULFILLMENT_SHORT} Current network: {GEN_DISPENSING_PHARMACIES_TEXT}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container-lux text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-4">Begin your journey</h2>
          <p className="text-lg text-ink-500 mb-8 max-w-md mx-auto">Find the products and care that support your goals — whatever they may be.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/goals" className="btn-primary text-base">Shop by Goal <ArrowRight size={16} /></Link>
            <Link to="/section/weight-management" className="btn-outline text-base">Browse Weight Management</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
