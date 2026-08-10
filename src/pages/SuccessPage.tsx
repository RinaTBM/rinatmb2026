import { Link } from '@/router';
import { Check, Truck, Mail, ShieldCheck } from 'lucide-react';

export function SuccessPage() {
  return (
    <div className="bg-cream-50 pt-28 md:pt-32 min-h-screen flex items-center">
      <div className="container-lux max-w-lg text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold-100">
          <Check size={40} className="text-gold-600" />
        </div>
        <h1 className="font-serif text-4xl text-ink-900 mb-3">Order update</h1>
        <p className="text-ink-500 mb-8">
          Thank you for your order. If you just submitted checkout, use your payment instructions page to complete your bank transfer.
        </p>
        <div className="card-lux p-6 text-left mb-6 space-y-4">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-gold-500 flex-shrink-0" />
            <p className="text-sm text-ink-600">A confirmation email is on its way with your order details.</p>
          </div>
          <div className="flex items-center gap-3">
            <Truck size={18} className="text-gold-500 flex-shrink-0" />
            <p className="text-sm text-ink-600">Most orders are processed within 1–3 business days after provider approval when applicable. You will receive tracking info once your order ships.</p>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-ink-600">If your order includes provider-reviewed items, you will receive a link to complete your medical intake. A licensed provider will review within 2 business days.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/track" className="btn-primary">Track Your Order</Link>
          <Link to="/" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
