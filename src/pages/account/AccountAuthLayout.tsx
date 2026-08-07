import { BrandLogo } from '@/components/BrandLogo';
import { Link } from '@/router';

type AccountAuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AccountAuthLayout({ title, subtitle, children, footer }: AccountAuthLayoutProps) {
  return (
    <div className="min-h-[70vh] bg-cream-50 pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center mb-6" aria-label="My Bare Method home">
            <BrandLogo className="h-12 w-auto" />
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl text-ink-900 mb-3">{title}</h1>
          <p className="text-ink-500 text-sm md:text-base leading-relaxed">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white shadow-sm p-6 md:p-8">
          {children}
        </div>

        {footer ? <div className="mt-6 text-center text-sm text-ink-500">{footer}</div> : null}
      </div>
    </div>
  );
}
