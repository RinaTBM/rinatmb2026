import { Link } from '@/router';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import type { Product } from '@/data/products';
import { sections } from '@/data/products';

/** Accessory photos that should show the full product (no crop). */
const CONTAIN_FIT_SLUGS = new Set([
  'discreet-travel-bag',
  'temperature-controlled-travel-case',
  'reusable-ice-pack',
]);

export function ProductCard({ product }: { product: Product }) {
  const section = sections.find(s => s.id === product.category);
  const primaryForm = product.dosageForms[0];
  const containFit = CONTAIN_FIT_SLUGS.has(product.slug);

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="card-lux overflow-hidden hover:shadow-xl hover:-translate-y-1">
        <div className={`relative aspect-square overflow-hidden bg-cream-100 ${containFit ? 'p-5 md:p-6' : ''}`}>
          <img
            src={product.image}
            alt={product.imageAlt}
            className={
              containFit
                ? 'h-full w-full object-contain object-center transition-transform duration-700 group-hover:scale-[1.02]'
                : 'h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
            }
            loading="lazy"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.bestSeller && (
              <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-50">
                Best Seller
              </span>
            )}
            {primaryForm && (
              <span className="rounded-full bg-cream-50/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-700 backdrop-blur-sm">
                {product.dosageForms.length > 1 ? 'Multiple forms' : primaryForm}
              </span>
            )}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-white/80 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm">
            <ArrowUpRight size={16} className="text-ink-900" />
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-wider-2 text-ink-400 mb-1">{section?.label}</p>
          <h3 className="font-serif text-lg text-ink-900 leading-tight mb-1">{product.displayName}</h3>
          <p className="text-xs text-ink-500 mb-2 line-clamp-1">{product.subtitle}</p>

          <div className="flex items-baseline gap-1">
            {product.startingAt && <span className="text-xs text-ink-400">Starting at</span>}
            <span className="font-medium text-ink-900">${product.startingPrice}</span>
          </div>
          {product.requiresProviderReview && (
            <p className="mt-1.5 flex items-center gap-1 text-[10px] text-gold-600">
              <ShieldCheck size={11} /> Provider review required
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
