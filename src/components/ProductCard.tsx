import { Link } from '@/router';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/data/products';
import { sections } from '@/data/products';

export function ProductCard({ product }: { product: Product }) {
  const section = sections.find(s => s.id === product.section);

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="card-lux overflow-hidden hover:shadow-xl hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          <img
            src={product.image}
            alt={product.name}
            className={`h-full w-full transition-transform duration-700 group-hover:scale-105 ${product.section === 'accessories' ? 'object-contain p-4' : 'object-cover'}`}
            loading="lazy"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.bestSeller && (
              <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-50">
                Best Seller
              </span>
            )}
            {product.section === 'provider-care' && (
              <span className="rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-900">
                Provider Care
              </span>
            )}
            {product.section === 'research' && (
              <span className="rounded-full bg-nude-700 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-50">
                Research
              </span>
            )}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-white/80 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm">
            <ArrowUpRight size={16} className="text-ink-900" />
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-wider-2 text-ink-400 mb-1">{section?.label}</p>
          <h3 className="font-serif text-lg text-ink-900 leading-tight mb-1">{product.name}</h3>
          <p className="text-xs text-ink-500 mb-2 line-clamp-1">{product.tagline}</p>

          <div>
            <div className="flex items-baseline gap-1">
              {product.variablePricing ? (
                <span className="text-sm text-ink-500">Pricing after intake</span>
              ) : (
                <>
                  {product.startingAt && <span className="text-xs text-ink-400">Starting at</span>}
                  <span className="font-medium text-ink-900">${product.price}{product.priceLabel || ''}</span>
                  {product.subscriptionPrice && (
                    <span className="text-xs text-ink-400">or ${product.subscriptionPrice}/mo</span>
                  )}
                </>
              )}
            </div>
            {product.startingAt && !product.variablePricing && (
              <p className="text-[10px] text-ink-400 mt-0.5">Price varies by dosage</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
