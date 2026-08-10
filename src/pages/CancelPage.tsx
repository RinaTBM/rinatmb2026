import { Link } from '@/router';
import { XCircle } from 'lucide-react';

export function CancelPage() {
  return (
    <div className="bg-cream-50 pt-28 md:pt-32 min-h-screen flex items-center">
      <div className="container-lux max-w-lg text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h1 className="font-serif text-4xl text-ink-900 mb-3">Checkout Cancelled</h1>
        <p className="text-ink-500 mb-8">
          Your order was not completed and no payment has been recorded.
        </p>
        <p className="text-ink-500 mb-8">
          Your cart has been saved so you can try again whenever you are ready.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/checkout" className="btn-primary">Try Again</Link>
          <Link to="/" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
