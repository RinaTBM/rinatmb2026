import { useState } from 'react';
import { Link, navigate } from '@/router';
import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

const NAV = [
  { id: 'overview', label: 'Overview', path: '/account' },
  { id: 'orders', label: 'Orders', path: '/account/orders' },
  { id: 'membership', label: 'Membership', path: '/account/membership' },
  { id: 'auto-refill', label: 'Past subscriptions', path: '/account/auto-refill' },
  { id: 'requests', label: 'Requests', path: '/account/requests' },
  { id: 'profile', label: 'Profile', path: '/account/profile' },
] as const;

export function AccountShell({
  active,
  children,
}: {
  active: (typeof NAV)[number]['id'];
  children: React.ReactNode;
}) {
  const { firstName, signOut } = useCustomerAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeItem = NAV.find(n => n.id === active) ?? NAV[0];

  return (
    <div className="bg-cream-50 pt-28 md:pt-32 pb-20 md:pb-28">
      <div className="container-lux max-w-5xl">
        <div className="mb-8 md:mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">My Bare Method</p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900">My Account</h1>
            <p className="mt-2 text-ink-500">Welcome, {firstName}</p>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 hover:border-gold-300 hover:text-ink-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            <LogOut size={16} aria-hidden /> Sign Out
          </button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden mb-6 relative">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-2xl border border-cream-300 bg-white px-4 py-3 text-sm font-medium text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(o => !o)}
          >
            {activeItem.label}
            <ChevronDown size={16} className={mobileOpen ? 'rotate-180' : ''} aria-hidden />
          </button>
          {mobileOpen && (
            <div className="absolute z-20 mt-2 w-full rounded-2xl border border-cream-300 bg-white p-2 shadow-xl">
              {NAV.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm ${
                    item.id === active ? 'bg-gold-50 text-ink-900' : 'text-ink-600 hover:bg-cream-100'
                  }`}
                  onClick={() => {
                    setMobileOpen(false);
                    navigate(item.path);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-[200px_1fr]">
          <aside className="hidden md:block">
            <nav className="space-y-1" aria-label="Account">
              {NAV.map(item => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                    item.id === active
                      ? 'bg-gold-50 font-medium text-ink-900'
                      : 'text-ink-600 hover:bg-cream-100 hover:text-ink-900'
                  }`}
                >
                  {item.id === 'profile' && <UserRound size={14} aria-hidden />}
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
