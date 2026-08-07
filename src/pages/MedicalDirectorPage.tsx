import { useEffect, useState } from 'react';
import { Link } from '@/router';
import {
  ArrowRight,
  Check,
  ClipboardList,
  FlaskConical,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';

const SEO_TITLE = 'Meet Our Medical Director | My Bare Method';
const SEO_DESCRIPTION =
  'Meet Dr. Jerry J. Cattelane Jr., D.O., Medical Director for My Bare Method, and learn about the clinical leadership supporting our provider-directed wellness programs.';

/** Expected path for the approved professional headshot asset. */
export const MEDICAL_DIRECTOR_HEADSHOT_SRC = '/images/team/jerry-j-cattelane-jr-do.jpg';

const leadershipItems = [
  { title: 'Clinical protocol oversight', description: 'Supports clinical standards across provider-directed wellness programs.' },
  { title: 'Provider support', description: 'Helps licensed providers deliver thoughtful, consistent clinical care.' },
  { title: 'Patient safety', description: 'Keeps patient safety at the center of the care experience.' },
  { title: 'Quality assurance', description: 'Supports quality practices that guide provider-directed services.' },
  { title: 'Evidence-informed wellness care', description: 'Encourages care decisions grounded in clinical appropriateness.' },
];

export function MedicalDirectorPage() {
  const [headshotFailed, setHeadshotFailed] = useState(false);

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
          <p className="eyebrow mb-4">Medical Leadership</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-5 tracking-tight">
            Meet Our Medical Director
          </h1>
          <p className="text-lg md:text-xl text-ink-500 leading-relaxed max-w-2xl mx-auto">
            Clinical leadership dedicated to safe, personalized, provider-directed wellness.
          </p>
        </div>
      </section>

      {/* Intro + credentials */}
      <section className="pb-16 md:pb-24">
        <div className="container-lux max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-14 items-start">
            <div className="mx-auto w-full max-w-[300px]">
              <div className="aspect-[4/5] overflow-hidden rounded-[28px] border border-cream-300 bg-cream-100 shadow-[0_12px_40px_-20px_rgba(26,26,26,0.25)]">
                {!headshotFailed ? (
                  <img
                    src={MEDICAL_DIRECTOR_HEADSHOT_SRC}
                    alt="Professional headshot of Dr. Jerry J. Cattelane Jr., D.O., Medical Director for My Bare Method"
                    width={600}
                    height={750}
                    className="h-full w-full object-cover object-center grayscale"
                    loading="eager"
                    decoding="async"
                    onError={() => setHeadshotFailed(true)}
                  />
                ) : (
                  <div
                    className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-cream-100 via-cream-50 to-cream-200 p-8 text-center"
                    role="img"
                    aria-label="Headshot placeholder — approved photo pending at public/images/team/jerry-j-cattelane-jr-do.jpg"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-200 bg-white/80 text-gold-600">
                      <UserRound size={28} strokeWidth={1.5} aria-hidden />
                    </div>
                    <p className="font-serif text-xl text-ink-900 mb-1">Jerry J. Cattelane Jr., D.O.</p>
                    <p className="text-xs uppercase tracking-wider text-ink-400">Approved headshot pending</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-2">
                Jerry J. Cattelane Jr., D.O.
              </h2>
              <p className="text-sm font-medium uppercase tracking-wider text-gold-700 mb-6">
                Medical Director
              </p>

              <p className="text-lg text-ink-600 leading-relaxed mb-5">
                Dr. Cattelane is a licensed physician in all states with expertise in Emergency Medicine, Medical
                Genetics, and Family Medicine. Since graduating from NYIT College of Osteopathic Medicine in 1997, he
                has brought decades of experience to patient care and clinical leadership.
              </p>

              <div className="space-y-4 text-ink-600 leading-relaxed">
                <p>
                  Dr. Jerry J. Cattelane Jr., D.O. serves as Medical Director for My Bare Method, providing clinical
                  leadership and supporting the provider-directed wellness programs available through the platform.
                </p>
                <p>
                  With expertise spanning Emergency Medicine, Medical Genetics, and Family Medicine, Dr. Cattelane
                  brings decades of experience in patient care, clinical decision-making, and medical leadership.
                </p>
                <p>
                  His approach emphasizes thoughtful, individualized care, patient safety, and evidence-informed
                  treatment. As Medical Director, he supports clinical protocols, provider collaboration, quality
                  standards, and the overall medical framework that guides My Bare Method’s provider-directed services.
                </p>
                <p>
                  Every treatment recommendation is evaluated individually by the licensed provider responsible for the
                  patient’s care. The Medical Director provides clinical oversight but may not personally evaluate every
                  patient.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Leadership & Oversight */}
      <section className="py-16 md:py-24 bg-cream-100/50">
        <div className="container-lux max-w-5xl">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Oversight</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-4">
              Clinical Leadership &amp; Oversight
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leadershipItems.map(item => (
              <div key={item.title} className="card-lux p-6">
                <h3 className="font-serif text-xl text-ink-900 mb-2">{item.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-gold-200 bg-gold-50/70 px-6 py-5 max-w-3xl mx-auto">
            <p className="text-sm md:text-base text-ink-700 leading-relaxed text-center">
              The Medical Director supports clinical standards and provider quality. Treatment decisions are made by
              the licensed provider responsible for your care.
            </p>
          </div>
        </div>
      </section>

      {/* Provider-Directed Care */}
      <section className="py-16 md:py-24">
        <div className="container-lux max-w-3xl">
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">How care works</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-4">Provider-Directed Care</h2>
          </div>
          <div className="card-lux p-8 md:p-10 space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                <Stethoscope size={22} aria-hidden />
              </div>
              <p className="text-ink-600 leading-relaxed pt-1">
                Every provider-directed treatment begins with an individual review. A licensed provider determines
                whether treatment is appropriate based on the information provided and may request additional
                consultation, records, or laboratory testing when clinically appropriate.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-cream-300 bg-cream-50 px-4 py-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gold-600" aria-hidden />
              <p className="text-sm text-ink-700 leading-relaxed">
                Payment or enrollment does not guarantee that a prescription will be issued.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/section/provider-care" className="btn-primary">
                Explore Provider Care <ArrowRight size={16} aria-hidden />
              </Link>
              <Link to="/memberships" className="btn-outline">
                View Memberships
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment strip */}
      <section className="py-16 md:py-20 bg-ink-900 text-cream-50">
        <div className="container-lux">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              { icon: HeartPulse, label: 'Personalized Care' },
              { icon: Stethoscope, label: 'Provider-Guided Treatment' },
              { icon: FlaskConical, label: 'Evidence-Informed Wellness' },
              { icon: ShieldCheck, label: 'Safety First' },
            ].map(({ icon: Icon, label }) => (
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

      {/* Important disclosure */}
      <section className="py-16 md:pb-28">
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
          <ul className="mt-8 space-y-3 max-w-2xl mx-auto">
            {[
              'Treatment decisions are individualized.',
              'No prescription is guaranteed.',
              'Providers may recommend additional consultation or testing before treatment.',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                <Check size={16} className="mt-0.5 shrink-0 text-gold-600" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
