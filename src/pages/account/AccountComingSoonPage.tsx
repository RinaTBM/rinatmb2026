import { AccountShell } from './AccountShell';
import { useAccountNoIndex } from './useAccountNoIndex';
import { ArrowUpRight } from 'lucide-react';
import { GEN_HEALTH_PORTAL_URL } from '@/lib/genHealth/portalLinks';

type AccountComingSoonPageProps = {
  active: 'orders' | 'membership' | 'requests';
  title: string;
  description: string;
};

export function AccountComingSoonPage({ active, title, description }: AccountComingSoonPageProps) {
  useAccountNoIndex(`${title} | My Bare Method`);

  return (
    <AccountShell active={active}>
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-gold-600 mb-3">Managed in GEN Health</p>
        <h2 className="font-serif text-2xl md:text-3xl text-ink-900 mb-4">{title}</h2>
        <p className="text-ink-500 leading-relaxed mb-8">{description}</p>
        <div className="rounded-2xl border border-cream-300 bg-white p-6 md:p-8">
          <p className="text-sm text-ink-500 leading-relaxed">
            Please continue in GEN Health for prescription requests, renewals, follow-ups, lab review steps, and clinical updates.
          </p>
          <a
            href={GEN_HEALTH_PORTAL_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-5 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          >
            Open GEN Health <ArrowUpRight size={14} aria-hidden />
          </a>
        </div>
      </div>
    </AccountShell>
  );
}
