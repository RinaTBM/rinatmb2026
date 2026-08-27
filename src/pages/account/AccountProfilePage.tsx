import { FormEvent, useEffect, useState } from 'react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { AccountShell } from './AccountShell';
import { useAccountNoIndex } from './useAccountNoIndex';

const inputClass =
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:border-gold-400';

export function AccountProfilePage() {
  useAccountNoIndex('Profile | My Bare Method');
  const { profile, user, saveProfile } = useCustomerAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setFirstName(profile?.first_name ?? '');
    setLastName(profile?.last_name ?? '');
    setPhone(profile?.phone ?? '');
  }, [profile]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);
    const result = await saveProfile({
      first_name: firstName,
      last_name: lastName,
      phone: phone.trim() || null,
    });
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess('Your profile has been saved.');
  }

  return (
    <AccountShell active="profile">
      <div className="max-w-xl">
        <h2 className="font-serif text-2xl md:text-3xl text-ink-900 mb-3">Profile</h2>
        <p className="text-ink-500 mb-8">
          Update your basic account information. Medical and subscription details are not managed here.
        </p>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-cream-300 bg-white p-6 md:p-8 space-y-5 shadow-sm"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-first-name" className="block text-sm font-medium text-ink-800 mb-1.5">
                First Name
              </label>
              <input
                id="profile-first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="profile-last-name" className="block text-sm font-medium text-ink-800 mb-1.5">
                Last Name
              </label>
              <input
                id="profile-last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-ink-800 mb-1.5">
              Email
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              value={user?.email ?? profile?.email ?? ''}
              readOnly
              className="w-full rounded-xl border border-cream-300 bg-cream-100 px-4 py-2.5 text-ink-500 cursor-not-allowed"
              aria-describedby="profile-email-help"
            />
            <p id="profile-email-help" className="mt-1.5 text-xs text-ink-400">
              Email is managed through secure account verification. Contact support if you need to change it.
            </p>
          </div>

          <div>
            <label htmlFor="profile-phone" className="block text-sm font-medium text-ink-800 mb-1.5">
              Phone
            </label>
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>

          {error ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="text-sm text-ink-800 bg-cream-50 border border-cream-300 rounded-xl px-3 py-2" role="status">
              {success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-ink-900 text-cream-50 px-8 py-3 text-sm font-medium tracking-wide hover:bg-ink-800 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          >
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AccountShell>
  );
}
