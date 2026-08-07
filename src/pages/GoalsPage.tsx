import { Link } from '@/router';
import { ArrowRight } from 'lucide-react';
import { goals } from '@/data/products';

export function GoalsPage() {
  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      {/* Header */}
      <section className="py-16 md:py-24 text-center">
        <div className="container-lux">
          <p className="eyebrow mb-3 text-sm">Personalized wellness</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-4">Shop by Goal</h1>
          <p className="text-lg text-ink-500 max-w-lg mx-auto">
            Whatever you are working toward, we have curated products to support your journey — for every body, at every age.
          </p>
        </div>
      </section>

      {/* Goals grid */}
      <section className="pb-20 md:pb-28">
        <div className="container-lux">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map(goal => (
              <Link key={goal.id} to={`/goal/${goal.id}`} className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
                <img src={goal.image} alt={goal.label} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h2 className="font-serif text-2xl text-cream-50 mb-2">{goal.label}</h2>
                  <p className="text-base text-cream-100/80 mb-3">{goal.description}</p>
                  <span className="text-sm text-gold-300 flex items-center gap-1">
                    Explore products <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
