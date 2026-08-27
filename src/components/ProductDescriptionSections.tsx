import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { Product } from '@/data/products';
import { paragraphs } from '@/data/productCopy';
import {
  PHARMACY_FULFILLMENT_COPY,
  PHARMACY_FULFILLMENT_HEADING,
} from '@/data/pharmacyFulfillmentCopy';

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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map(item => (
        <li key={item} className="flex items-start gap-2.5 text-ink-700">
          <Check size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Hero highlight chips — keep near top of PDP. */
export function ProductHighlights({ highlights }: { highlights: string[] }) {
  if (!highlights.length) return null;
  return (
    <ul className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
      {highlights.map(item => (
        <li
          key={item}
          className="flex items-center gap-2 rounded-xl border border-gold-200/80 bg-gold-50/60 px-3 py-2 text-sm text-ink-800"
        >
          <Check size={16} className="text-gold-600 flex-shrink-0" />
          <span className="font-medium">{item}</span>
        </li>
      ))}
    </ul>
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
  const potentialBenefits =
    product.potentialBenefits?.length ? product.potentialBenefits : product.commonUses;
  const whyChoose = product.whyPeopleChooseIt ?? [];

  return (
    <div className="space-y-10 md:space-y-12">
      <Section title="About This Product">
        <ParagraphBlock text={product.longDescription} />
      </Section>

      {potentialBenefits.length > 0 && (
        <Section title="Potential Benefits">
          <BulletList items={potentialBenefits} />
        </Section>
      )}

      {product.howItWorks.trim() && (
        <Section title="How It Works">
          <ParagraphBlock text={product.howItWorks} />
        </Section>
      )}

      {whyChoose.length > 0 && (
        <Section title="Why People Choose It">
          <BulletList items={whyChoose} />
        </Section>
      )}

      {(isAccessory || isProviderCare) && <Section title="Available Options">
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
                </span>
                <span className="text-ink-600">${v.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        {isProviderCare && (
          <p className="mt-3 text-xs text-ink-500">
            Exact formulation details may be finalized by your prescribing provider and dispensing
            pharmacy when applicable.
          </p>
        )}
      </Section>}

      {product.whatToExpect.trim() && (
        <Section title={isProviderCare ? 'What Happens Next' : 'What to Expect'}>
          <ParagraphBlock text={product.whatToExpect} />
        </Section>
      )}

      <Section title="Important Information">
        <ParagraphBlock text={product.importantInformation || product.providerDisclaimer} />
      </Section>

      {showEligibility && !isAccessory && (
        <Section title="Provider Review">
          <BulletList
            items={[
              'Provider review is required before any prescription product is dispensed.',
              'Purchasing does not guarantee a prescription.',
              'Eligibility is determined by a licensed provider.',
              'Labs or a consultation may be requested.',
              'Individual experiences and results vary.',
            ]}
          />
        </Section>
      )}

      {product.requiresPrescription && (
        <Section title={PHARMACY_FULFILLMENT_HEADING}>
          <ParagraphBlock text={PHARMACY_FULFILLMENT_COPY} />
        </Section>
      )}
    </div>
  );
}
