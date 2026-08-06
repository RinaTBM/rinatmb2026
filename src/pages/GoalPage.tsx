import { Link } from '@/router';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { goals, getProductsByGoal, type Goal } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

export function GoalPage({ goalId }: { goalId: string }) {
  const goal = goals.find(g => g.id === goalId as Goal);
  if (!goal) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-ink-500">Goal not found.</p>
        <Link to="/goals" className="btn-outline mt-6">View all goals</Link>
      </div>
    );
  }

  const products = getProductsByGoal(goal.id);

  return (
    <div className="bg-cream-50 pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={goal.image} alt={goal.label} className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream-50/80 to-cream-50" />
        </div>
        <div className="container-lux relative z-10 text-center">
          <Link to="/goals" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-6 transition-colors">
            <ArrowLeft size={14} /> All Goals
          </Link>
          <p className="eyebrow mb-3 text-sm">Shop by Goal</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-4">{goal.label}</h1>
          <p className="text-lg text-ink-500 max-w-md mx-auto">{goal.description}</p>
        </div>
      </section>

      {/* Products */}
      <section className="pb-20 md:pb-28">
        <div className="container-lux">
          {products.length === 0 ? (
            <p className="text-center text-ink-500 py-12">Products coming soon for this goal.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Other goals */}
      <section className="py-16 md:py-20 bg-cream-100/50">
        <div className="container-lux">
          <h2 className="font-serif text-3xl text-ink-900 mb-8 text-center">Explore other goals</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {goals.filter(g => g.id !== goal.id).map(g => (
              <Link key={g.id} to={`/goal/${g.id}`} className="rounded-full border border-ink-200 px-5 py-2.5 text-sm text-ink-700 hover:border-ink-900 hover:bg-ink-900 hover:text-cream-50 transition-all">
                {g.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
