import { useEffect } from 'react';
import { Link } from '@/router';
import {
  ArrowRight,
  Check,
  ClipboardList,
  FlaskConical,
  HeartPulse,
  PackageCheck,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';

const SEO_TITLE = 'Meet Our Medical Director | My Bare Method';
const SEO_DESCRIPTION =
  'Learn about the experienced medical leadership behind My Bare Method and our commitment to safe, provider-directed wellness care.';

/**
 * Licensure note (public display):
 * LegitScript Licensure Template 09-2026 lists Jerry Cattelane, DO for all 50 U.S. states
 * (plus District of Columbia). No board certifications, residencies, or awards are displayed
 * beyond DO credentials and this multi-state licensure summary.
 */
const LICENSED_IN_ALL_50_STATES = true;

const roleItems = [
  { title: 'Clinical oversight', description: 'Helps guide clinical standards across provider-directed wellness programs.' },
  { title: 'Treatment protocol development', description: 'Supports thoughtful protocols designed for personalized care.' },
  { title: 'Provider support', description: 'Helps licensed providers deliver consistent, high-quality clinical judgment.' },
  { title: 'Patient safety', description: 'Prioritizes safety as the foundation of every wellness pathway.' },
  { title: 'Quality assurance', description: 'Supports ongoing quality practices across the care experience.' },
  { title: 'Evidence-informed wellness care', description: 'Encourages care decisions grounded in clinical appropriateness.' },
];

const processSteps = [
  'Choose your wellness program.',
  'Complete your secure intake.',
  'Licensed provider review.',
  'Additional information or laboratory testing may be requested when appropriate.',
  'Prescription issued only if medically appropriate.',
  'Pharmacy fulfillment where applicable.',
];

const commitments = [
  { icon: HeartPulse, label: 'Personalized Care' },
  { icon: Stethoscope, label: 'Provider-Guided Treatment' },
  { icon: FlaskConical, label: 'Evidence-Informed Wellness' },
  { icon: ShieldCheck, label: 'Safety First' },
];

export function MedicalDirectorPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = SEO_TITLE;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const created = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    const prevDescription = meta.content;
    meta.content = SEO_DESCRIPTION;
    return () => {
      document.title = prevTitle;
      if (meta) {
        if (created) meta.remove();
        else meta.content = prevDescription;
      }
    };
  }, []);

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container-lux max-w-4xl text-center">
          <p className="eyebrow mb-4">Clinical leadership</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-5 tracking-tight">
            Meet Our Medical Director
          </h1>
          <p className="text-lg md:text-xl text-ink-500 leading-relaxed max-w-2xl mx-auto">
            Clinical leadership dedicated to safe, personalized, provider-directed wellness.
          </p>
        </div>
      </section>

      {/* Introduction + credentials */}
      <section className="pb-16 md:pb-24">
        <div className="container-lux max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14 items-start">
            {/* Headshot placeholder */}
            <div className="mx-auto w-full max-w-[280px]">
              <div
                className="aspect-[4/5] rounded-[28px] border border-cream-300 bg-gradient-to-br from-cream-100 via-cream-50 to-gold-50 flex flex-col items-center justify-center text-center p-8"
                role="img"
                aria-label="Professional headshot placeholder for Dr. Jerry Cattelane"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-200 bg-white/80 text-gold-600">
                  <UserRound size={28} strokeWidth={1.5} aria-hidden />
                </div>
                <p className="font-serif text-xl text-ink-900 mb-1">Jerry Cattelane, DO</p>
                <p className="text-xs uppercase tracking-wider text-ink-400">Headshot coming soon</p>
              </div>
            </div>

            <div>
              <p className="eyebrow text-gold-600 mb-3">Medical Director</p>
              <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-2">Jerry Cattelane, DO</h2>
              {LICENSED_IN_ALL_50_STATES ? (
                <p className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gold-800 mb-6">
                  <Check size={14} aria-hidden /> Licensed in all 50 states
                </p>
              ) : (
                <p className="mb-6 rounded-xl border border-dashed border-ink-300 bg-cream-100 px-4 py-3 text-sm text-ink-600">
                  <strong className="text-ink-900">PLACEHOLDER — CONFIRM BEFORE PUBLISH:</strong> Multi-state licensure
                  statement pending manual verification from approved provider documentation.
                </p>
              )}
              <p className="text-lg text-ink-600 leading-relaxed mb-5">
                Dr. Jerry Cattelane serves as Medical Director for My Bare Method, helping oversee clinical protocols
                and supporting high-quality, patient-centered care.
              </p>
              <p className="text-ink-600 leading-relaxed mb-5">
                Under his clinical leadership, My Bare Method is committed to provider-directed wellness programs that
                prioritize safety, personalization, and thoughtful clinical standards.
              </p>
              <p className="text-ink-600 leading-relaxed">
                Every treatment recommendation is evaluated by a licensed provider based on individual medical history
                and clinical appropriateness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role */}
      <section className="py-16 md:py-24 bg-cream-100/50">
        <div className="container-lux max-w-5xl">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">The role</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-4">Clinical leadership, refined</h2>
            <p className="text-ink-500 max-w-2xl mx-auto leading-relaxed">
              The Medical Director helps shape the clinical foundation of My Bare Method — supporting providers,
              protocols, and a culture of patient safety.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roleItems.map(item => (
              <div key={item.title} className="card-lux p-6">
                <h3 className="font-serif text-xl text-ink-900 mb-2">{item.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider-directed process */}
      <section className="py-16 md:py-24">
        <div className="container-lux max-w-3xl">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">How care works</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-4">Our provider-directed process</h2>
            <p className="text-ink-500 leading-relaxed">
              A clear, thoughtful path from program selection to provider review — with prescriptions issued only when
              medically appropriate.
            </p>
          </div>
          <ol className="space-y-4">
            {processSteps.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-2xl border border-cream-300 bg-white p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-50 font-serif text-lg text-gold-700">
                  {i + 1}
                </span>
                <p className="pt-2 text-ink-700 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/section/provider-care" className="btn-primary">
              Explore Provider Care <ArrowRight size={16} aria-hidden />
            </Link>
            <Link to="/memberships" className="btn-outline">
              View Memberships
            </Link>
          </div>
        </div>
      </section>

      {/* Commitment icons */}
      <section className="py-16 md:py-20 bg-ink-900 text-cream-50">
        <div className="container-lux">
          <div className="text-center mb-12">
            <p className="eyebrow text-gold-300 mb-3">Our commitment</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream-50">Care with intention</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {commitments.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-cream-100/15 bg-ink-800/40 px-5 py-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/15 text-gold-300">
                  <Icon size={22} strokeWidth={1.5} aria-hidden />
                </div>
                <p className="font-serif text-lg text-cream-50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient safety */}
      <section className="py-16 md:py-24">
        <div className="container-lux max-w-3xl">
          <div className="card-lux p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                <ShieldCheck size={22} aria-hidden />
              </div>
              <div>
                <h2 className="font-serif text-3xl text-ink-900 mb-2">Patient safety</h2>
                <p className="text-ink-500 leading-relaxed">
                  Patient safety is our highest priority.
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                'Treatment decisions are individualized.',
                'No prescription is guaranteed.',
                'Providers may recommend additional consultation or testing before treatment.',
                'Enrollment and payment do not guarantee that a prescription will be issued.',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                  <Check size={16} className="mt-0.5 shrink-0 text-gold-600" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Important disclosure */}
      <section className="pb-20 md:pb-28">
        <div className="container-lux max-w-3xl">
          <div className="rounded-2xl border border-gold-200 bg-gold-50/70 px-6 py-7 md:px-8">
            <div className="flex items-start gap-3 mb-3">
              <ClipboardList size={18} className="mt-0.5 shrink-0 text-gold-700" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-800">Important disclosure</p>
            </div>
            <p className="text-sm md:text-base text-ink-700 leading-relaxed mb-3">
              The Medical Director oversees clinical protocols and supports provider quality and patient safety.
            </p>
            <p className="text-sm md:text-base text-ink-700 leading-relaxed">
              Treatment decisions are made by the licensed provider responsible for your care.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 text-center">
            <div className="rounded-xl border border-cream-300 bg-white px-4 py-5">
              <PackageCheck className="mx-auto mb-2 text-gold-600" size={20} aria-hidden />
              <p className="text-sm text-ink-600">Provider-directed programs</p>
            </div>
            <div className="rounded-xl border border-cream-300 bg-white px-4 py-5">
              <Stethoscope className="mx-auto mb-2 text-gold-600" size={20} aria-hidden />
              <p className="text-sm text-ink-600">Individual clinical review</p>
            </div>
            <div className="rounded-xl border border-cream-300 bg-white px-4 py-5">
              <ShieldCheck className="mx-auto mb-2 text-gold-600" size={20} aria-hidden />
              <p className="text-sm text-ink-600">Safety-first standards</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
