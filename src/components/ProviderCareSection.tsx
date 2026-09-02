import { Link } from '@/router';
import { ArrowLeft, ArrowRight, ClipboardList, ExternalLink, FlaskConical, UserRound } from 'lucide-react';
import type { Product } from '@/data/products';
import { PROVIDER_CARE_GEN_ACTIONS } from '@/lib/genHealth/providerCareLinks';

const whatToExpect = [
  'Begin with the care area that feels closest to what you need.',
  'GEN Health will guide any payment, intake, assessment, or lab steps that apply.',
  'A licensed provider reviews clinical information before any prescription is approved.',
  'If a paid prescription request is not approved, eligible amounts are refunded according to the Refund Policy.',
];

const guideCards = [
  {
    icon: UserRound,
    title: 'Weight or Hormone Support',
    cta: 'Explore Weight Management',
    href: '/section/weight-management',
    external: false,
  },
  {
    icon: ClipboardList,
    title: 'Follow-Up or Lab Review',
    cta: 'Open GEN Health',
    href: PROVIDER_CARE_GEN_ACTIONS['follow-up-appointment'].checkoutUrl ?? '#',
    external: true,
  },
  {
    icon: FlaskConical,
    title: 'Lab Options',
    cta: 'View Labs',
    href: '/order-labs',
    external: false,
  },
  {
    icon: UserRound,
    title: 'Client Portal',
    cta: 'Sign In',
    href: '/account/login',
    external: false,
  },
];

/** Simple guide layout for /section/provider-care only. */
export function ProviderCareSection({ products: _products }: { products: Product[] }) {
  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-24">
        <div className="container-lux">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm"
          >
            <ArrowLeft size={14} aria-hidden /> Home
          </Link>

          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-16">
            <p className="eyebrow mb-4">Provider-guided care</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] text-ink-900 mb-5 tracking-tight">
              Care Guidance
            </h1>
            <p className="text-base md:text-lg text-ink-500 leading-relaxed">
              Provider Care is here to make the next step easier to understand. When prescriptions, labs, visits, follow-ups, payment, intake, or clinical review are needed, those steps continue securely through GEN Health.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-2xl text-ink-900 mb-5 text-center">What to expect</h2>
            <ul className="space-y-3">
              {whatToExpect.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-cream-200 bg-white px-5 py-4 text-sm text-ink-600 leading-relaxed"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-xs font-semibold text-gold-700">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
            {guideCards.map(({ icon: Icon, title, cta, href, external }) => (
              <article
                key={title}
                className="flex flex-col h-full rounded-[20px] border border-cream-300 bg-white p-6 md:p-7 shadow-[0_8px_28px_-12px_rgba(26,26,26,0.12)]"
              >
                <span
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-cream-300 bg-cream-50 text-gold-600"
                  aria-hidden
                >
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <h3 className="font-serif text-xl text-ink-900 mb-4 leading-snug">{title}</h3>
                <div className="mt-auto pt-4 border-t border-cream-200">
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:text-gold-800 transition-colors"
                    >
                      {cta} <ExternalLink size={14} aria-hidden />
                    </a>
                  ) : (
                    <Link
                      to={href}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:text-gold-800 transition-colors"
                    >
                      {cta} <ArrowRight size={14} aria-hidden />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-12 max-w-3xl mx-auto text-center text-xs md:text-sm text-ink-400 leading-relaxed">
            Payment does not guarantee a prescription. Provider review and approval are required when applicable.
          </p>

          <div className="mt-10 max-w-xl mx-auto text-center rounded-2xl border border-cream-300 bg-white px-6 py-7">
            <p className="eyebrow mb-2">Clinical leadership</p>
            <p className="font-serif text-xl text-ink-900 mb-2">Meet Our Medical Director</p>
            <p className="text-sm text-ink-500 mb-5 leading-relaxed">
              Learn about the medical leadership supporting safe, personalized, provider-directed wellness.
            </p>
            <Link
              to="/medical-director"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:text-gold-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm"
            >
              Meet Dr. Jerry J. Cattelane Jr., D.O. <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
