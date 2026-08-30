import { ShieldCheck } from 'lucide-react';
import type { Product } from '@/data/products';
import { navigateToGenProductFirstCheckout, resolveGenProductFirstCheckout } from '@/lib/commerce/genHostedCheckout';
import type { GEN_HOSTED_PRODUCTS } from '@/lib/commerce/genHostedProducts';

export function GenHostedProductPage({ product, route }: { product: Product; route: (typeof GEN_HOSTED_PRODUCTS)[string] }) {
  const checkout = resolveGenProductFirstCheckout(route.genClientProductId);
  return <div className="bg-cream-50 pt-28 md:pt-32 pb-16"><div className="container-lux grid gap-8 lg:grid-cols-2 lg:gap-16"><img src={product.image} alt={product.imageAlt} className="aspect-square w-full rounded-3xl object-cover"/><div><p className="flex items-center gap-1.5 text-xs uppercase tracking-wider-2 text-gold-600"><ShieldCheck size={16}/>Provider review required</p><h1 className="mt-3 font-serif text-4xl text-ink-900">{product.displayName}</h1><p className="mt-4 text-ink-600 leading-relaxed">{product.shortDescription}</p><div className="mt-6 rounded-2xl border border-cream-300 bg-white p-5"><p className="text-sm text-ink-500">Due today in GEN Health</p><p className="font-serif text-3xl text-ink-900">${route.price.toFixed(2)}</p><p className="mt-2 text-xs text-ink-500">Final payment total and any applicable visit charge are shown by GEN Health before payment.</p><button type="button" className="btn-primary mt-5 w-full" disabled={!checkout.ok} onClick={() => { if (checkout.ok) navigateToGenProductFirstCheckout(checkout.url); }}>{checkout.ok ? 'Continue to Checkout' : 'Temporarily unavailable'}</button><p className="mt-3 text-xs text-ink-500">You’ll continue securely in GEN Health for payment, intake, assessment, and provider review.</p></div></div></div></div>;
}
