import { useEffect, useState } from 'react';
import { Link, useRouter } from '@/router';
import { Check, Clock, XCircle, ShieldCheck } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import {
  KASHU_CARD_RESULT_CANCEL_COPY,
  KASHU_CARD_RESULT_PAID_COPY,
  KASHU_CARD_RESULT_PENDING_COPY,
} from '@/lib/payments/kashuTagada';

type ViewState = 'loading' | 'paid' | 'pending' | 'failed' | 'cancelled' | 'error';

/**
 * Card payment return page.
 * Browser redirect NEVER marks an order paid — webhook is source of truth.
 */
export function KashuCardResultPage() {
  const { path } = useRouter();
  const [state, setState] = useState<ViewState>('loading');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const match = path.match(/^\/order\/card-result\/([^/?]+)/);
    const num = match?.[1] ? decodeURIComponent(match[1]) : '';
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || '';
    const cancelled = params.get('cancelled') === '1' || params.get('cancel') === '1';
    setOrderNumber(num);

    if (cancelled) {
      setState('cancelled');
      setMessage(KASHU_CARD_RESULT_CANCEL_COPY);
      return;
    }

    if (!num || !token) {
      setState('error');
      setMessage('Missing order reference. If you completed card payment, please contact us with your order number.');
      return;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) {
      setState('pending');
      setMessage(KASHU_CARD_RESULT_PENDING_COPY);
      return;
    }

    const client = createClient(supabaseUrl, anonKey);
    let cancelledFetch = false;

    const load = async () => {
      const { data, error } = await client
        .from('orders')
        .select('payment_status, public_order_number, payment_access_token')
        .eq('public_order_number', num.toUpperCase())
        .maybeSingle();

      if (cancelledFetch) return;
      if (error || !data) {
        setState('pending');
        setMessage(KASHU_CARD_RESULT_PENDING_COPY);
        return;
      }
      if (data.payment_access_token && data.payment_access_token !== token) {
        setState('error');
        setMessage('Invalid payment link.');
        return;
      }
      if (data.payment_status === 'paid') {
        setState('paid');
        setMessage(KASHU_CARD_RESULT_PAID_COPY);
        return;
      }
      if (data.payment_status === 'payment_failed' || data.payment_status === 'cancelled') {
        setState('failed');
        setMessage(KASHU_CARD_RESULT_CANCEL_COPY);
        return;
      }
      setState('pending');
      setMessage(KASHU_CARD_RESULT_PENDING_COPY);
    };

    void load();
    const t = window.setInterval(() => void load(), 4000);
    return () => {
      cancelledFetch = true;
      window.clearInterval(t);
    };
  }, [path]);

  const icon =
    state === 'paid' ? (
      <Check size={40} className="text-gold-600" />
    ) : state === 'cancelled' || state === 'failed' || state === 'error' ? (
      <XCircle size={40} className="text-ink-500" />
    ) : (
      <Clock size={40} className="text-gold-600" />
    );

  const title =
    state === 'paid'
      ? 'Payment received'
      : state === 'cancelled' || state === 'failed'
        ? 'Payment not completed'
        : state === 'error'
          ? 'Payment status unavailable'
          : 'Confirming payment';

  return (
    <div className="bg-cream-50 pt-28 md:pt-32 min-h-screen flex items-center">
      <div className="container-lux max-w-lg text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold-100">
          {icon}
        </div>
        <h1 className="font-serif text-4xl text-ink-900 mb-3">{title}</h1>
        {orderNumber ? (
          <p className="text-sm text-ink-500 mb-4">
            Order <span className="font-mono text-ink-800">{orderNumber}</span>
          </p>
        ) : null}
        <p className="text-ink-500 mb-8">{message || KASHU_CARD_RESULT_PENDING_COPY}</p>
        <div className="card-lux p-6 text-left mb-6 space-y-3">
          <div className="flex items-start gap-3">
            <ShieldCheck size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-ink-600">
              Card payments are confirmed by our secure payment processor after checkout.
          This page does not finalize payment by itself — confirmation comes from the
          verified server notification.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/track" className="btn-primary">
            Track Your Order
          </Link>
          <Link to="/" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
