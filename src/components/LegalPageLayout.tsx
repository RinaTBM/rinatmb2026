import type { ReactNode } from 'react';

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

export function LegalPageLayout({
  eyebrow,
  title,
  intro,
  lastUpdated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="bg-cream-50 pt-16 md:pt-20">
      <section className="py-14 md:py-20 text-center">
        <div className="container-lux max-w-2xl">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-4">{title}</h1>
          <p className="text-ink-500 mb-3">{intro}</p>
          <p className="text-xs text-ink-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-lux max-w-3xl">
          {/* Table of contents */}
          <div className="card-lux p-6 mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-3">Contents</p>
            <ol className="space-y-1.5">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm text-ink-700 hover:text-gold-600 transition-colors">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-10">
            {sections.map((s, i) => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-ink-900 mb-4">
                  {i + 1}. {s.title}
                </h2>
                <div className="space-y-3 text-sm leading-relaxed text-ink-600">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function LegalBulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-outside space-y-2 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
