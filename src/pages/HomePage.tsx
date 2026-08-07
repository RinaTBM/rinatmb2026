import { useEffect, useRef, useState } from 'react';
import { Link } from '@/router';
import {
  ArrowRight,
  Truck,
  Stethoscope,
  Sparkles,
  PackageCheck,
  HeartPulse,
  Activity,
  Mail,
  Check,
  Lock,
} from 'lucide-react';
import {
  concerns,
  sections,
  getBestSellers,
  visibleMemberships,
  getProductsBySection,
} from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

const featureCards = [
  {
    icon: Stethoscope,
    title: 'Expert Care',
    description: 'Licensed providers guide every step of your wellness journey with personalized, judgment-free support.',
  },
  {
    icon: Sparkles,
    title: 'Luxury Experience',
    description: 'Thoughtfully curated products and premium packaging that elevate your daily wellness ritual.',
  },
  {
    icon: PackageCheck,
    title: 'Discreet Shipping',
    description: 'Plain, unmarked packaging delivered with care. Most orders process within 1–3 business days after provider approval when applicable. Always private, always secure.',
  },
  {
    icon: HeartPulse,
    title: 'Wellness That Lasts',
    description: 'Sustainable protocols and ongoing support designed for long-term results, not quick fixes.',
  },
];

const howItWorksSteps = [
  { icon: Activity, title: 'Choose Your Concern', description: 'Browse by what matters to you — weight, longevity, hormones, energy, and more.' },
  { icon: Stethoscope, title: 'Provider Review', description: 'Complete a quick intake. Licensed providers review and approve your personalized plan.' },
  { icon: PackageCheck, title: 'Discreet Delivery', description: 'Your products ship in plain, temperature-controlled packaging right to your door.' },
  { icon: HeartPulse, title: 'Ongoing Support', description: 'Enjoy lasting results with recurring fulfillment, member discounts, and continuous care.' },
];



const faqs = [
  { q: 'Do I need a membership to purchase?', a: 'No. You can make a one-time purchase or choose Auto-Refill & Save (10% off eligible wellness products). Active Wellness Members save 15% on eligible wellness products and accessories. Provider care, shipping, and taxes are never discounted. Already-discounted accessory bundles do not automatically receive an additional member discount.' },
  { q: 'Is provider approval guaranteed?', a: 'No. Provider review and approval are required for certain products. Purchase does not guarantee approval. If not approved, a full refund is issued.' },
  { q: 'What is the 3-month commitment?', a: 'Active Wellness Memberships require a 3-month minimum commitment. After that period, you may submit a cancellation request. For Auto-Refill, please submit cancellation requests at least 7 calendar days before your renewal date so we can process them before the next cycle.' },
  { q: 'How is shipping handled?', a: 'Orders ship in plain, discreet packaging. Temperature-controlled shipping is used for products requiring cold chain maintenance.' },
];

export function HomePage() {
  const bestSellers = getBestSellers().slice(0, 4);
  const accessories = getProductsBySection('accessories').filter(p => !p.featured).slice(0, 4);

  const heroRef = useRef<HTMLDivElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [heroImage] = useState(
    'https://images.pexels.com/photos/3765034/pexels-photo-3765034.jpeg?auto=compress&cs=tinysrgb&w=1200'
  );

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const offset = window.scrollY * 0.25;
        setParallaxOffset(offset);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroTrustItems = [
    { icon: Stethoscope, label: 'Licensed Providers' },
    { icon: Lock, label: 'Secure Checkout' },
    { icon: Truck, label: 'Discreet Shipping' },
    { icon: Sparkles, label: 'Premium Quality' },
  ];

  const floatingCardItems = [
    'Personalized Care',
    'Licensed Providers',
    'Fast, Discreet Shipping',
    'Ongoing Support',
  ];

  return (
    <div className="bg-cream-50">
      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] md:min-h-[100vh] min-h-[80vh] flex items-center overflow-hidden pt-32 pb-16 md:pt-36"
        style={{ background: 'linear-gradient(135deg, #FBF9F5 0%, #F7F4EF 40%, #F0EBE2 100%)' }}
      >
        {/* Subtle organic texture overlays */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-[#E8E0D4]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-[#C9A86A]/8 blur-3xl pointer-events-none" />

        <div className="container-lux relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-2">
            {/* LEFT: Copy + CTA */}
            <div className="order-2 lg:order-1 flex flex-col justify-center py-8 lg:py-0">
              <p
                className="hero-headline text-sm font-medium tracking-[0.2em] uppercase mb-5"
                style={{ color: '#C9A86A' }}
              >
                Wellness, Elevated.
              </p>
              <h1
                className="hero-subheadline font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-5 text-balance"
                style={{ color: '#222222' }}
              >
                Beautifully Personalized.
              </h1>
              <p
                className="hero-body text-lg md:text-xl leading-relaxed mb-10 max-w-md"
                style={{ color: '#555555' }}
              >
                Premium wellness products and provider-guided care thoughtfully curated to help you feel your best—delivered with discretion, quality, and care.
              </p>
              <div className="hero-cta">
                <Link
                  to="/shop-all"
                  className="hero-cta-btn"
                >
                  Explore Wellness <ArrowRight size={18} />
                </Link>
              </div>

              {/* Trust Row */}
              <div className="hero-trust mt-12 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-4">
                {heroTrustItems.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 text-center">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                      style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        boxShadow: '0 2px 12px -2px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(201, 168, 106, 0.15)',
                      }}
                    >
                      <Icon size={20} style={{ color: '#C9A86A' }} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-medium tracking-wide" style={{ color: '#666666' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Premium lifestyle image + floating glass card */}
            <div className="order-1 lg:order-2 relative hero-image-fade">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)]">
                <img
                  src={heroImage}
                  alt="Woman smiling with arms raised, enjoying natural light indoors"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    transform: `translateY(${parallaxOffset}px) scale(1.08)`,
                    transition: 'transform 0.1s linear',
                  }}
                  loading="eager"
                  fetchPriority="high"
                />
                {/* Soft gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>

              {/* Floating Glassmorphism Trust card */}
              <div className="hero-card-fade absolute -bottom-5 -left-5 sm:-left-8 lg:-left-10 glass-card rounded-2xl p-5 w-56 sm:w-60">
                <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: '#1F3A32' }}>
                  Why Members Trust Us
                </p>
                <ul className="space-y-2.5">
                  {floatingCardItems.map(item => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ background: '#1F3A32' }}
                      >
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </span>
                      <span className="text-xs font-medium" style={{ color: '#333333' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative soft glow */}
              <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-[#C9A86A]/15 blur-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SHOP BY CONCERN ===== */}
      <section className="py-20 md:py-28">
        <div className="container-lux">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Personalized wellness</p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink-900 mb-4">Shop by Concern</h2>
            <p className="text-lg text-ink-500 max-w-xl mx-auto">
              Whatever you're working toward, we've curated the right products, memberships, and accessories for your journey.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {concerns.map(concern => (
              <Link
                key={concern.id}
                to={`/concern/${concern.id}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
              >
                <img
                  src={concern.image}
                  alt={concern.label}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <p className="text-xs text-gold-300 mb-1 tracking-wider uppercase">{concern.tagline}</p>
                  <h3 className="font-serif text-2xl text-cream-50 mb-2">{concern.label}</h3>
                  <p className="text-sm text-cream-100/80 mb-3 line-clamp-2">{concern.description}</p>
                  <span className="text-sm text-gold-300 flex items-center gap-1">
                    Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY ===== */}
      <section className="py-20 md:py-28 bg-cream-100/50">
        <div className="container-lux">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Know what you need?</p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-ink-500 max-w-xl mx-auto">
              Browse our catalog by product type — from weight management to research products and accessories.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map(s => (
              <Link
                key={s.id}
                to={`/section/${s.id}`}
                className="group card-lux p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <p className="eyebrow text-gold-600 mb-2">{s.tagline}</p>
                <h3 className="font-serif text-2xl text-ink-900 mb-2">{s.label}</h3>
                <p className="text-sm text-ink-500 mb-4 line-clamp-2">{s.description}</p>
                <span className="text-sm text-gold-600 flex items-center gap-1">
                  Browse {s.label} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BEST SELLERS ===== */}
      <section className="py-20 md:py-28">
        <div className="container-lux">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow mb-3">Loved by thousands</p>
              <h2 className="font-serif text-4xl md:text-5xl text-ink-900">Best Sellers</h2>
            </div>
            <Link to="/best-sellers" className="hidden sm:flex items-center gap-1 text-sm text-gold-600 hover:text-gold-700">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/best-sellers" className="btn-outline">View all best sellers</Link>
          </div>
        </div>
      </section>

      {/* ===== PURCHASING OPTIONS ===== */}
      <section className="py-20 md:py-28 bg-ink-900 text-cream-50">
        <div className="container-lux">
          <div className="text-center mb-12">
            <p className="eyebrow text-gold-300 mb-3">Three ways to shop</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">Members Save More</h2>
            <p className="text-lg text-cream-100/70 max-w-2xl mx-auto">
              Active Wellness Members receive our best pricing, exclusive savings, and convenient ongoing wellness support.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-gold-400/40 bg-ink-800/50 p-8">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-400 px-4 py-1 text-xs font-semibold text-ink-900 whitespace-nowrap">
                BEST VALUE
              </span>
              <h3 className="font-serif text-2xl text-cream-50 mb-2">Active Wellness Membership</h3>
              <p className="text-sm text-gold-300 mb-4 font-medium">Members Save 15%</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Save 15% on eligible wellness products and accessories',
                  'Locked membership pricing',
                  'Priority access to new products',
                  'Convenient monthly wellness',
                  'Provider-guided care',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-cream-100/80">
                    <Check size={16} className="flex-shrink-0 mt-0.5 text-gold-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-3 mb-6">
                {visibleMemberships.map(m => (
                  <div key={m.id} className="flex items-baseline justify-between rounded-lg bg-ink-700/50 px-4 py-3">
                    <span className="text-sm text-cream-100/80">{m.name}</span>
                    <span className="font-serif text-lg text-gold-300">{m.price > 0 ? `$${m.price}${m.priceLabel}` : 'Starting at $—/month'}</span>
                  </div>
                ))}
              </div>
              <Link to="/memberships" className="btn-primary w-full">Become a Member <ArrowRight size={16} /></Link>
            </div>

            <div className="rounded-2xl border border-cream-100/20 bg-ink-800/40 p-8">
              <h3 className="font-serif text-2xl text-cream-50 mb-2">Auto-Refill & Save</h3>
              <p className="text-sm text-cream-100/70 mb-4 font-medium">Save 10%</p>
              <ul className="space-y-3 mb-8">
                {[
                  '10% off eligible wellness products',
                  'Monthly automatic deliveries',
                  'Easy subscription management',
                  'No membership required',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-cream-100/80">
                    <Check size={16} className="flex-shrink-0 mt-0.5 text-gold-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/shop-all" className="btn-outline w-full border-cream-100/30 text-cream-50 hover:bg-cream-50 hover:text-ink-900">
                Shop Auto-Refill <ArrowRight size={16} />
              </Link>
            </div>

            <div className="rounded-2xl border border-cream-100/20 bg-ink-800/30 p-8">
              <h3 className="font-serif text-2xl text-cream-50 mb-2">One-Time Purchase</h3>
              <p className="text-sm text-cream-100/60 mb-4">Buy once · standard pricing</p>
              <ul className="space-y-3 mb-8">
                {[
                  'No recurring commitment',
                  'Order or reorder anytime',
                  'Standard pricing',
                  'Provider approval when applicable',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-cream-100/80">
                    <Check size={16} className="flex-shrink-0 mt-0.5 text-cream-100/60" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/shop-all" className="btn-outline w-full border-cream-100/30 text-cream-50 hover:bg-cream-50 hover:text-ink-900">
                Buy Once <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 md:py-28">
        <div className="container-lux">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Simple, guided, personal</p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink-900">How It Works</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorksSteps.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cream-200 text-gold-600">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <p className="text-xs text-gold-600 font-medium mb-2">STEP {i + 1}</p>
                <h3 className="font-serif text-xl text-ink-900 mb-2">{title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACCESSORIES ===== */}
      <section className="py-20 md:py-28 bg-cream-100/50">
        <div className="container-lux">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow mb-3">Complete your kit</p>
              <h2 className="font-serif text-4xl md:text-5xl text-ink-900">Accessories</h2>
            </div>
            <Link to="/section/accessories" className="hidden sm:flex items-center gap-1 text-sm text-gold-600 hover:text-gold-700">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {accessories.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/section/accessories" className="btn-outline">View all accessories</Link>
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="py-20 md:py-28">
        <div className="container-lux">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">The My Bare Method difference</p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink-900 mb-4">Why Us</h2>
            <p className="text-lg text-ink-500 max-w-xl mx-auto">
              Every product is thoughtfully curated, provider-guided, and delivered with the discretion you deserve.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="card-lux p-8 hover:shadow-lg hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-cream-200 text-gold-600">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl text-ink-900 mb-3">{title}</h3>
                <p className="text-base text-ink-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ===== FAQs ===== */}
      <section className="py-20 md:py-28">
        <div className="container-lux max-w-3xl">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Questions & answers</p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink-900">FAQs</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="card-lux p-6 group">
                <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-ink-900 list-none">
                  {faq.q}
                  <ArrowRight size={18} className="text-gold-500 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-4 text-sm text-ink-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/faq" className="text-sm text-gold-600 hover:text-gold-700 link-underline">
              View all FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* ===== EMAIL SIGNUP ===== */}
      <section className="py-20 md:py-28 bg-ink-900 text-cream-50">
        <div className="container-lux max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/20">
            <Mail size={28} className="text-gold-300" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">Join the List</h2>
          <p className="text-lg text-cream-100/70 mb-8">
            Get wellness tips, exclusive offers, and early access to new products — delivered with discretion.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-full border border-cream-100/20 bg-ink-800/50 px-6 py-3.5 text-sm text-cream-50 placeholder-cream-100/40 focus:border-gold-400 focus:outline-none"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
          <p className="mt-4 text-xs text-cream-100/40">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
