import { ArrowLeft, ArrowRight, ClipboardList, ExternalLink, FlaskConical, HeartPulse, UserRound } from 'lucide-react';
import { Link } from '@/router';
import { GEN_HEALTH_PORTAL_URL } from '@/lib/genHealth/portalLinks';
import { getProviderCareGenAction } from '@/lib/genHealth/providerCareLinks';

const followUpAction = getProviderCareGenAction('follow-up-appointment');

const carePaths = [
  {
    icon: HeartPulse,
    title: 'Weight or Hormone Support',
    description:
      'Explore the care area that fits what you are looking for. GEN Health will guide intake, payment, assessment, and provider review when those steps are needed.',
    label: 'Explore Weight Management',
    to: '/section/weight-management',
  },
  {
    icon: ClipboardList,
    title: 'Follow-Up or Lab Review',
    description:
      'For established clients who need a provider check-in, medication-change review, or help reviewing completed labs.',
    label: 'Open GEN Health',
    href: followUpAction?.checkoutUrl ?? GEN_HEALTH_PORTAL_URL,
  },
  {
    icon: FlaskConical,
    title: 'Lab Options',
    description:
      'Choose an in-home or walk-in lab option when your care plan calls for updated labs.',
    label: 'View Labs',
    to: '/order-labs',
  },
  {
    icon: UserRound,
    title: 'Client Portal',
    description:
      'Return to your account for order details, support, and an easy way back into GEN Health.',
    label: 'Sign In',
    to: '/account/login',
  },
];

const whatHappensNext = [
  'Begin with the care area that feels closest to what you need.',
  'GEN Health will guide any payment, intake, assessment, or lab steps that apply.',
  'A licensed provider reviews clinical information before any prescription is approved.',
  'If a paid prescription request is not approved, eligible amounts are refunded according to the Refund Policy.',
];

export function ProviderCareSection() {
  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-24">
        <div className="container-lux">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-1 rounded-sm text-sm text-ink-500 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            <ArrowLeft size={14} aria-hidden /> Home
          </Link>

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="eyebrow mb-4">Provider-guided care</p>
              <h1 className="mb-5 font-serif text-4xl tracking-tight text-ink-900 md:text-5xl lg:text-[3.5rem]">
                Care Guidance
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-ink-500 md:text-lg">
                Provider Care is here to make the next step easier to understand. When prescriptions, labs, visits, follow-ups, payment, intake, or clinical review are needed, those steps continue securely through GEN Health.
              </p>
            </div>

            <div className="border-y border-cream-300 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {whatHappensNext.map(item => (
                  <div key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold-500" aria-hidden />
                    <p className="text-sm leading-relaxed text-ink-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {carePaths.map(({ icon: Icon, title, description, label, to, href }) => (
              <article key={title} className="card-lux flex min-h-[280px] flex-col p-6 md:p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-cream-200 text-gold-600">
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <h2 className="font-serif text-2xl leading-snug text-ink-900">{title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">{description}</p>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-ink-900 px-5 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
                  >
                    {label} <ExternalLink size={14} aria-hidden />
                  </a>
                ) : (
                  <Link
                    to={to}
                    className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-ink-900 px-5 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
                  >
                    {label} <ArrowRight size={14} aria-hidden />
                  </Link>
                )}
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-6 rounded-2xl border border-cream-300 bg-white p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <p className="eyebrow mb-2">Clinical leadership</p>
              <h2 className="font-serif text-2xl text-ink-900">Meet Our Medical Director</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Learn about the medical leadership supporting safe, personalized, provider-directed wellness.
              </p>
            </div>
            <Link
              to="/medical-director"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gold-300 px-5 py-3 text-sm font-medium text-gold-700 transition-colors hover:bg-gold-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              Medical Director <ArrowRight size={14} aria-hidden />
            </Link>
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-ink-400 md:text-sm">
            Payment does not guarantee a prescription. Provider review and approval are required when applicable.
          </p>
        </div>
      </section>
    </div>
  );
}
