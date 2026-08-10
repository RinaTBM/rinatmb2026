import { useEffect, useState } from 'react';
import { Link, useRouter } from '@/router';
import { Lock, Check } from 'lucide-react';
import { formatCents } from '@/lib/orders/orderTypes';
import { labelPaymentStatus } from '@/lib/orders/orderStatus';
import { labelShippingMethod } from '@/lib/orders/shipping';
import {
  PAYMENT_METHOD_LABELS,
  type PaymentMethod,
} from '@/lib/payments/paymentMethods';
import type { BankInstructionsPublic, InvoiceViewModel } from '@/lib/payments/manualInvoice';
import { fetchPaymentInstructions } from '@/lib/payments/submitInvoiceOrder';

function BankDetails({ instructions }: { instructions: BankInstructionsPublic }) {
  if (!instructions.configured) {
    return (
      <p className="text-sm text-ink-600">
        {instructions.unavailableMessage ||
          'Payment details are being prepared. Please contact us with your order number.'}
      </p>
    );
  }

  if (instructions.method === 'manual_ach') {
    return (
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink-500">Bank name</dt>
          <dd className="font-medium text-ink-900">{instructions.bankName}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Account name</dt>
          <dd className="font-medium text-ink-900">{instructions.accountName}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Routing number</dt>
          <dd className="font-medium text-ink-900 font-mono">{instructions.routingNumber}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Account number</dt>
          <dd className="font-medium text-ink-900 font-mono">{instructions.accountNumber}</dd>
        </div>
        {instructions.additionalInstructions ? (
          <div className="sm:col-span-2">
            <dt className="text-ink-500">Additional instructions</dt>
            <dd className="text-ink-800">{instructions.additionalInstructions}</dd>
          </div>
        ) : null}
      </dl>
    );
  }

  return (
    <dl className="grid gap-2 text-sm sm:grid-cols-2">
      <div>
        <dt className="text-ink-500">Bank name</dt>
        <dd className="font-medium text-ink-900">{instructions.wireBankName}</dd>
      </div>
      {instructions.accountName ? (
        <div>
          <dt className="text-ink-500">Account name</dt>
          <dd className="font-medium text-ink-900">{instructions.accountName}</dd>
        </div>
      ) : null}
      <div>
        <dt className="text-ink-500">Routing number</dt>
        <dd className="font-medium text-ink-900 font-mono">{instructions.wireRoutingNumber}</dd>
      </div>
      <div>
        <dt className="text-ink-500">Account number</dt>
        <dd className="font-medium text-ink-900 font-mono">{instructions.wireAccountNumber}</dd>
      </div>
      {instructions.wireSwift ? (
        <div>
          <dt className="text-ink-500">SWIFT</dt>
          <dd className="font-medium text-ink-900 font-mono">{instructions.wireSwift}</dd>
        </div>
      ) : null}
      {instructions.additionalInstructions ? (
        <div className="sm:col-span-2">
          <dt className="text-ink-500">Additional instructions</dt>
          <dd className="text-ink-800">{instructions.additionalInstructions}</dd>
        </div>
      ) : null}
    </dl>
  );
}

export function OrderPaymentInstructionsPage({
  publicOrderNumber: propNumber,
}: {
  publicOrderNumber?: string;
}) {
  const route = useRouter();
  const fromPath = propNumber || route.path.replace(/^\/order\/payment\//, '').split('?')[0];
  const publicOrderNumber = decodeURIComponent(fromPath || '');
  const token = route.query.token || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<InvoiceViewModel | null>(null);
  const [bank, setBank] = useState<BankInstructionsPublic | null>(null);

  useEffect(() => {
    let cancelled = false;
    let hasSnapshot = false;
    const run = async () => {
      setLoading(true);
      setError(null);

      // Prefer snapshot saved immediately after checkout submit (same browser session).
      try {
        const raw = sessionStorage.getItem(`mbm-invoice:${publicOrderNumber}`);
        if (raw) {
          const parsed = JSON.parse(raw) as {
            invoice?: InvoiceViewModel;
            bankInstructions?: BankInstructionsPublic;
            token?: string;
          };
          if (parsed.invoice && (!token || !parsed.token || parsed.token === token)) {
            hasSnapshot = true;
            if (!cancelled) {
              setInvoice(parsed.invoice);
              setBank(parsed.bankInstructions ?? null);
              setLoading(false);
            }
          }
        }
      } catch {
        /* ignore */
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anonKey || !token) {
        if (!cancelled && !hasSnapshot) {
          setError(
            token
              ? 'Unable to load payment instructions right now. Please contact us with your order number.'
              : 'This payment link is missing an access token. Use the link from your order confirmation or contact us.',
          );
          setLoading(false);
        }
        return;
      }

      const result = await fetchPaymentInstructions({
        supabaseUrl,
        anonKey,
        publicOrderNumber,
        paymentAccessToken: token,
      });
      if (cancelled) return;
      if (!result.ok) {
        if (!hasSnapshot) setError(result.error);
        setLoading(false);
        return;
      }
      setInvoice(result.invoice);
      setBank(result.bankInstructions);
      setError(null);
      setLoading(false);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [publicOrderNumber, token]);

  if (loading && !invoice) {
    return (
      <div className="bg-cream-50 pt-28 md:pt-32 min-h-screen">
        <div className="container-lux max-w-3xl py-12 text-center text-ink-500">Loading payment instructions…</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="bg-cream-50 pt-28 md:pt-32 min-h-screen">
        <div className="container-lux max-w-3xl py-12 text-center">
          <p className="text-ink-700 mb-4">{error || 'Payment instructions unavailable.'}</p>
          <Link to="/contact" className="btn-primary">
            Contact us
          </Link>
        </div>
      </div>
    );
  }

  const methodLabel =
    PAYMENT_METHOD_LABELS[(invoice.paymentMethod as PaymentMethod) || 'manual_ach'] ||
    invoice.paymentMethod;

  return (
    <div className="bg-cream-50 pt-28 md:pt-32 min-h-screen pb-16">
      <div className="container-lux max-w-3xl py-8 space-y-6">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
            <Check size={32} className="text-gold-600" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink-900 mb-2">{invoice.headline}</h1>
          <p className="text-ink-500">{invoice.memoInstruction}</p>
        </div>

        {error ? (
          <div className="rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-900">
            Showing your saved invoice details. {error}
          </div>
        ) : null}

        <section className="card-lux p-6 space-y-3 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} className="text-gold-500" />
            <h2 className="font-serif text-xl text-ink-900">Invoice</h2>
          </div>
          <dl className="grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-ink-500">Invoice number</dt>
              <dd className="font-medium text-ink-900">{invoice.invoiceNumber}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Order number</dt>
              <dd className="font-medium text-ink-900">{invoice.orderNumber}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Payment reference / memo</dt>
              <dd className="font-medium text-ink-900 font-mono">{invoice.paymentReference}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Payment status</dt>
              <dd className="font-medium text-ink-900">{labelPaymentStatus(invoice.paymentStatus)}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Customer</dt>
              <dd className="font-medium text-ink-900">{invoice.customerName}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Order date</dt>
              <dd className="font-medium text-ink-900">
                {new Date(invoice.orderDateIso).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-ink-500">Selected payment method</dt>
              <dd className="font-medium text-ink-900">{methodLabel}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Shipping</dt>
              <dd className="font-medium text-ink-900">{labelShippingMethod(invoice.shippingMethod)}</dd>
            </div>
          </dl>
        </section>

        <section className="card-lux p-6 text-sm">
          <h2 className="font-serif text-xl text-ink-900 mb-3">Order summary</h2>
          <ul className="space-y-2 mb-4">
            {invoice.items.map((item, idx) => (
              <li key={`${item.productName}-${idx}`} className="flex justify-between gap-3">
                <span>
                  {item.productName}
                  {item.variantLabel ? ` · ${item.variantLabel}` : ''} × {item.quantity}
                </span>
                <span>{formatCents(item.lineTotalCents)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-cream-300 pt-3">
            <div className="flex justify-between">
              <span className="text-ink-500">Subtotal</span>
              <span>{formatCents(invoice.subtotalCents)}</span>
            </div>
            {invoice.discountCents > 0 ? (
              <div className="flex justify-between text-green-700">
                <span>Discounts</span>
                <span>−{formatCents(invoice.discountCents)}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span className="text-ink-500">Shipping</span>
              <span>{formatCents(invoice.shippingCents)}</span>
            </div>
            {invoice.taxCents > 0 ? (
              <div className="flex justify-between">
                <span className="text-ink-500">Taxes / fees</span>
                <span>{formatCents(invoice.taxCents)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-base font-medium text-ink-900 pt-2">
              <span>Amount due</span>
              <span>{formatCents(invoice.totalCents)}</span>
            </div>
          </div>
        </section>

        <section className="card-lux p-6 space-y-3">
          <h2 className="font-serif text-xl text-ink-900">Payment instructions</h2>
          <p className="text-sm text-ink-600">
            Initiate the transfer from your own bank. Include reference{' '}
            <span className="font-mono font-medium text-ink-900">{invoice.paymentReference}</span> in
            the memo field. No payment is withdrawn on this website.
          </p>
          {bank ? <BankDetails instructions={bank} /> : null}
        </section>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/contact" className="btn-primary">
            Contact us for help
          </Link>
          <Link to="/" className="btn-outline">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
