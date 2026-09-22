import { CareProgressForm } from '@/components/CareProgressForm';
import { navigate } from '@/router';

export function SmsRemindersPage() {
  return <section className="bg-cream-50 px-4 pb-20 pt-32 text-ink-900">
    <div className="mx-auto max-w-xl rounded-3xl border border-ink-900/10 p-6 md:p-8">
      <p className="eyebrow mb-3">My Bare Method</p>
      <h1 className="font-serif text-3xl">Save your progress</h1>
      <CareProgressForm checkoutUrl="https://mybaremethod.com/sms-reminders" onContinue={() => navigate('/shop-all')} />
    </div>
  </section>;
}
