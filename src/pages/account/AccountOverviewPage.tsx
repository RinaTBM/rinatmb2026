import { Link } from '@/router';
import { AccountShell } from './AccountShell';
import { useAccountNoIndex } from './useAccountNoIndex';

const cards = [
  {
    title: 'Orders',
    description: 'View order history and shipment updates when available.',
    href: '/account/orders',
    available: false,
  },
  {
    title: 'Membership',
    description: 'Review membership details and plan information.',
    href: '/account/membership',
    available: false,
  },
  {
    title: 'Auto-Refill',
    description: 'Manage Auto-Refill preferences in a future update.',
    href: '/account/auto-refill',
    available: false,
  },
  {
    title: 'Requests',
    description: 'Submit refill, pause, or cancellation requests later.',
    href: '/account/requests',
    available: false,
  },
  {
    title: 'Profile',
    description: 'Update your name, phone, and account contact details.',
    href: '/account/profile',
    available: true,
  },
] as const;

export function AccountOverviewPage() {
  useAccountNoIndex('My Account | My Bare Method');

  return (
    <AccountShell active="overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cards.map(card => (
          <Link
            key={card.title}
            to={card.href}
            className="group rounded-2xl border border-cream-300 bg-white p-6 shadow-sm hover:border-gold-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="font-serif text-xl text-ink-900">{card.title}</h2>
              {!card.available ? (
                <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-gold-700 border border-gold-300 rounded-full px-2.5 py-1">
                  Coming Soon
                </span>
              ) : null}
            </div>
            <p className="text-sm text-ink-500 leading-relaxed">{card.description}</p>
          </Link>
        ))}
      </div>
    </AccountShell>
  );
}
