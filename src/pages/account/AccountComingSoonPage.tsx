import { AccountShell } from './AccountShell';
import { useAccountNoIndex } from './useAccountNoIndex';

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
        <p className="text-xs uppercase tracking-[0.2em] text-gold-600 mb-3">Coming Soon</p>
        <h2 className="font-serif text-2xl md:text-3xl text-ink-900 mb-4">{title}</h2>
        <p className="text-ink-500 leading-relaxed mb-8">{description}</p>
        <div className="rounded-2xl border border-cream-300 bg-white p-6 md:p-8">
          <p className="text-sm text-ink-500 leading-relaxed">
            This area will be available in a future update. Your profile and account access are available now.
          </p>
        </div>
      </div>
    </AccountShell>
  );
}
