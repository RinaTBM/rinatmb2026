import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { Product } from '@/data/products';
import { paragraphs } from '@/data/productCopy';

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-serif text-2xl md:text-3xl text-ink-900">{title}</h2>
      {children}
    </div>
  );
}

function ParagraphBlock({ text }: { text: string }) {
  return (
    <div className="space-y-3">
      {paragraphs(text).map((p, i) => (
        <p key={i} className="text-ink-600 leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

/** Scannable product description stack shared by wellness + accessory PDPs. */
export function ProductDescriptionSections({
  product,
  showEligibility = true,
}: {
  product: Product;
  showEligibility?: boolean;
}) {
  const isAccessory = product.category === 'accessories';
  const isProviderCare = product.category === 'provider-care';

  return (
    <div className="space-y-10 md:space-y-12">
      <Section title="About This Product">
        <ParagraphBlock text={product.longDescription} />
      </Section>

      {product.commonUses.length > 0 && (
        <Section
          title={
            isAccessory || isProviderCare
              ? 'When It May Help'
              : 'Common Uses / Why It May Be Considered'
          }
        >
          <ul className="space-y-2.5">
            {product.commonUses.map(item => (
              <li key={item} className="flex items-start gap-2.5 text-ink-700">
                <Check size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {product.howItWorks.trim() && (
        <Section title="How It Works">
          <ParagraphBlock text={product.howItWorks} />
        </Section>
      )}

      {product.whatToExpect.trim() && (
        <Section title={isProviderCare ? 'What Happens Next' : 'What to Expect / How It Is Used'}>
          <ParagraphBlock text={product.whatToExpect} />
        </Section>
      )}

      <Section title="Available Options">
        {product.variants.length === 0 ? (
          <p className="text-ink-600">Options are shown above.</p>
        ) : (
          <ul className="space-y-2">
            {product.variants.map(v => (
              <li
                key={v.id}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-cream-300 bg-white px-4 py-3 text-sm"
              >
                <span className="text-ink-800">
                  <span className="font-medium">{v.label}</span>
                  {v.sku ? (
                    <span className="ml-2 font-mono text-xs text-ink-400">{v.sku}</span>
                  ) : null}
                </span>
                <span className="text-ink-600">${v.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        {!isAccessory && (
          <p className="mt-3 text-xs text-ink-500">
            Exact formulation details may be finalized by your prescribing provider and dispensing
            pharmacy when applicable.
          </p>
        )}
      </Section>

      <Section title="Important Information">
        <ParagraphBlock text={product.importantInformation || product.providerDisclaimer} />
      </Section>

      {showEligibility && !isAccessory && (
        <Section title="Eligibility & Provider Review">
          <ul className="space-y-2.5">
            {(
              [
                'Provider review is required before any prescription product is dispensed.',
                'Purchasing does not guarantee a prescription.',
                'Eligibility is determined by a licensed provider.',
                'Labs or a consultation may be requested.',
                'Individual experiences and results vary.',
              ] as const
            ).map(line => (
              <li key={line} className="flex items-start gap-2.5 text-ink-700">
                <Check size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
