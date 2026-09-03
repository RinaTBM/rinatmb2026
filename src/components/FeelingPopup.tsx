import { useEffect, useState } from 'react';
import { Check, Plus, Sparkles, X } from 'lucide-react';
import { rememberGuidedPopupInterest } from '@/lib/highlevelPopupContext';
import { navigate } from '@/router';
import { usePrescriptionBasket } from '@/context/PrescriptionBasketContext';
import { getProduct } from '@/data/products';
import { GEN_HOSTED_PRODUCTS } from '@/lib/commerce/genHostedProducts';

const DISMISS_KEY = 'mbm_feeling_popup_dismissed';
const SHOW_DELAY_MS = 30_000;
const MAX_SELECTIONS = 3;

type FeelingId =
  | 'tired'
  | 'unfocused'
  | 'weight-gain'
  | 'difficulty-losing-weight'
  | 'bad-sleep'
  | 'low-mood'
  | 'low-libido'
  | 'brain-fog'
  | 'slow-recovery'
  | 'skin-hair';

type Feeling = {
  id: FeelingId;
  label: string;
  emoji: string;
};

const FEELINGS: Feeling[] = [
  { id: 'tired', label: 'Tired', emoji: '\u{1F614}' },
  { id: 'unfocused', label: 'Unfocused', emoji: '\u{1F9D0}' },
  { id: 'weight-gain', label: 'Weight Gain', emoji: '\u{1F4CA}' },
  { id: 'difficulty-losing-weight', label: 'Hard to Lose Weight', emoji: '\u{1F3CB}' },
  { id: 'bad-sleep', label: 'Bad Sleep', emoji: '\u{1F634}' },
  { id: 'low-mood', label: 'Low Mood', emoji: '\u{1F641}' },
  { id: 'low-libido', label: 'Low Libido', emoji: '\u{1F494}' },
  { id: 'brain-fog', label: 'Brain Fog', emoji: '\u{1F32B}' },
  { id: 'slow-recovery', label: 'Slow Recovery', emoji: '\u{1F9CB}' },
  { id: 'skin-hair', label: 'Skin & Hair', emoji: '\u{1F48E}' },
];

type Recommendation = {
  slug: string;
  title: string;
  blurb: string;
  emoji: string;
  price: number;
  genClientProductId: string;
};

const SUPPORT_POINTS: Record<string, [string, string, string]> = {
  'nad-plus': ['Cellular energy support', 'Focus and vitality support', 'Provider-guided wellness option'],
  'bpc-157': ['Recovery support', 'Tissue and connective-tissue support', 'Provider-guided wellness option'],
  'initial-provider-consultation': ['Personalized goal review', 'Licensed provider guidance', 'A plan matched to your needs'],
  semax: ['Focus support', 'Memory support', 'Provider-guided cognitive wellness'],
  selank: ['Calm-focus support', 'Stress-balance support', 'Provider-guided wellness option'],
  semaglutide: ['Appetite-regulation support', 'Weight-management support', 'Provider-guided care pathway'],
  tirzepatide: ['Dual-pathway support', 'Weight-management support', 'Provider-guided care pathway'],
  tesamorelin: ['Metabolic support', 'Body-composition support', 'Provider-guided care pathway'],
  'fat-burner': ['Fat-metabolism support', 'Body-composition support', 'Provider-guided wellness option'],
  'aod-9604': ['Lipotropic support', 'Fat-metabolism support', 'Provider-guided care pathway'],
  'testosterone-cream': ['Hormone-support option', 'Vitality support', 'Provider-guided care pathway'],
  'scream-cream': ['Sexual-wellness support', 'Topical application', 'Provider-guided option'],
  'estradiol-patch': ['Hormone-support option', 'Transdermal delivery', 'Provider-guided care pathway'],
  'selank-semax-nasal-spray': ['Calm-focus support', 'Cognitive support', 'Nasal delivery option'],
  'bpc-157-tb-500': ['Recovery support', 'Tissue-repair support', 'Provider-guided care pathway'],
  'recovery-stack': ['Multi-peptide recovery support', 'Tissue and mobility support', 'Provider-guided care pathway'],
  'tretinoin-cream': ['Skin-renewal support', 'Topical application', 'Prescription provider review'],
  'minoxidil-topical': ['Scalp-health support', 'Topical application', 'Prescription provider review'],
  'bimatoprost-solution': ['Lash and brow support', 'Targeted topical application', 'Prescription provider review'],
};

function buildRec(slug: string, title: string, blurb: string, emoji: string): Recommendation {
  const route = GEN_HOSTED_PRODUCTS[slug];
  const product = getProduct(slug);
  const price = route?.price ?? product?.startingPrice ?? 0;
  const genClientProductId = route?.genClientProductId ?? '';
  return { slug, title, blurb, emoji, price, genClientProductId };
}

const FEELING_TO_RECS: Record<FeelingId, Recommendation[]> = {
  tired: [
    buildRec('nad-plus', 'NAD+ Cellular Energy', 'Supports cellular energy production and overall vitality.', '\u{1F50B}'),
    buildRec('bpc-157', 'BPC-157 Recovery Peptide', 'Supports tissue repair and overall recovery.', '\u{1F489}'),
    buildRec('initial-provider-consultation', 'Provider Consultation', 'A personalized review of your energy and wellness goals.', '\u{1F3E5}'),
  ],
  unfocused: [
    buildRec('semax', 'Semax Cognitive Focus', 'Supports cognitive focus and mental clarity.', '\u{1F9E0}'),
    buildRec('selank', 'Selank Calm-Focus', 'Supports calm, focused attention without jitters.', '\u{1F9CA}'),
    buildRec('nad-plus', 'NAD+ Cellular Energy', 'Supports brain energy and cellular health.', '\u{1F50B}'),
  ],
  'weight-gain': [
    buildRec('semaglutide', 'Semaglutide GLP-1', 'Provider-directed support for appetite regulation and weight management.', '\u{1F489}'),
    buildRec('tirzepatide', 'Tirzepatide Dual GLP-1/GIP', 'Dual-action support for comprehensive weight management.', '\u{1F489}'),
    buildRec('tesamorelin', 'Tesamorelin GHRH', 'Supports metabolic function and body composition.', '\u{1F489}'),
  ],
  'difficulty-losing-weight': [
    buildRec('semaglutide', 'Semaglutide GLP-1', 'Provider-directed metabolic support for stubborn weight.', '\u{1F489}'),
    buildRec('fat-burner', 'Fat Burner Peptide Blend', 'Supports fat oxidation and body-composition goals.', '\u{1F525}'),
    buildRec('aod-9604', 'AOD-9604 Lipotropic', 'Supports fat metabolism and body composition.', '\u{1F489}'),
  ],
  'bad-sleep': [
    buildRec('selank', 'Selank Calm-Focus', 'Supports relaxation and stress balance for better rest.', '\u{1F9CA}'),
    buildRec('bpc-157', 'BPC-157 Recovery Peptide', 'Supports overall recovery, which is essential for restorative sleep.', '\u{1F489}'),
    buildRec('initial-provider-consultation', 'Provider Consultation', 'A personalized review of your sleep and wellness patterns.', '\u{1F3E5}'),
  ],
  'low-mood': [
    buildRec('selank', 'Selank Calm-Focus', 'Supports a balanced mood and stress resilience.', '\u{1F9CA}'),
    buildRec('nad-plus', 'NAD+ Cellular Energy', 'Supports brain health and overall sense of well-being.', '\u{1F50B}'),
    buildRec('initial-provider-consultation', 'Provider Consultation', 'A personalized review with a licensed provider.', '\u{1F3E5}'),
  ],
  'low-libido': [
    buildRec('testosterone-cream', 'Testosterone Support Cream', 'Provider-directed hormone support for vitality and libido.', '\u{1F489}'),
    buildRec('scream-cream', 'Scream Cream', 'Women\u2019s sexual wellness topical for enhanced sensation.', '\u{1F49B}'),
    buildRec('estradiol-patch', 'Estradiol Patch', 'Provider-directed estrogen support for hormonal balance.', '\u{1FA79}'),
  ],
  'brain-fog': [
    buildRec('semax', 'Semax Cognitive Focus', 'Supports memory, focus, and mental clarity.', '\u{1F9E0}'),
    buildRec('selank-semax-nasal-spray', 'Selank + Semax Nasal Spray', 'Dual nootropic support for cognitive performance.', '\u{1F9CB}'),
    buildRec('nad-plus', 'NAD+ Cellular Energy', 'Supports brain energy and cellular health.', '\u{1F50B}'),
  ],
  'slow-recovery': [
    buildRec('bpc-157-tb-500', 'BPC-157 + TB-500 Recovery Blend', 'Supports tissue repair and musculoskeletal recovery.', '\u{1F489}'),
    buildRec('recovery-stack', 'KLOW Recovery Blend', 'Four-peptide protocol for comprehensive recovery support.', '\u{1F489}'),
    buildRec('nad-plus', 'NAD+ Cellular Energy', 'Supports cellular energy and overall vitality during recovery.', '\u{1F50B}'),
  ],
  'skin-hair': [
    buildRec('tretinoin-cream', 'Tretinoin Skin Renewal', 'Prescription-strength skin renewal and collagen support.', '\u{1F9F4}'),
    buildRec('minoxidil-topical', 'Minoxidil Hair Regrowth', 'Topical support for hair regrowth and scalp health.', '\u{1F9F4}'),
    buildRec('bimatoprost-solution', 'Lash & Brow Growth Serum', 'Supports lash and brow fullness and length.', '\u{1F440}'),
  ],
};

function getRecommendations(selected: FeelingId[]): Recommendation[] {
  const seen = new Set<string>();
  const recs: Recommendation[] = [];
  for (const feeling of selected) {
    for (const rec of FEELING_TO_RECS[feeling] ?? []) {
      if (!seen.has(rec.slug)) {
        seen.add(rec.slug);
        recs.push(rec);
      }
      if (recs.length >= 3) break;
    }
    if (recs.length >= 3) break;
  }
  return recs.slice(0, 3);
}

export function FeelingPopup() {
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<'select' | 'results'>('select');
  const [selected, setSelected] = useState<FeelingId[]>([]);
  const { addItem, openBasket, items: basketItems } = usePrescriptionBasket();
  const [addedSlugs, setAddedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      /* ignore */
    }
  };

  const toggleFeeling = (id: FeelingId) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(f => f !== id);
      if (prev.length >= MAX_SELECTIONS) return prev;
      return [...prev, id];
    });
  };

  const handleSeeResults = () => {
    if (selected.length === 0) return;
    rememberGuidedPopupInterest();
    setStage('results');
  };

  const handleAddToBasket = (rec: Recommendation) => {
    if (!rec.genClientProductId) {
      rememberGuidedPopupInterest();
      setVisible(false);
      navigate(`/product/${rec.slug}`);
      return;
    }
    const product = getProduct(rec.slug);
    addItem({
      slug: rec.slug,
      displayName: product?.displayName ?? rec.title,
      subtitle: product?.subtitle ?? '',
      image: product?.image ?? '',
      imageAlt: product?.imageAlt ?? '',
      price: rec.price,
      genClientProductId: rec.genClientProductId,
      category: product?.category ?? '',
    });
    setAddedSlugs(prev => new Set(prev).add(rec.slug));
  };

  const handleAddAllToBasket = () => {
    for (const rec of recs) {
      if (!rec.genClientProductId || basketItems.some(item => item.slug === rec.slug) || addedSlugs.has(rec.slug)) continue;
      const product = getProduct(rec.slug);
      addItem({
        slug: rec.slug,
        displayName: product?.displayName ?? rec.title,
        subtitle: product?.subtitle ?? '',
        image: product?.image ?? '',
        imageAlt: product?.imageAlt ?? '',
        price: rec.price,
        genClientProductId: rec.genClientProductId,
        category: product?.category ?? '',
      });
      setAddedSlugs(prev => new Set(prev).add(rec.slug));
    }
    rememberGuidedPopupInterest();
    setVisible(false);
    openBasket();
  };

  const handleBrowseAll = () => {
    rememberGuidedPopupInterest();
    setVisible(false);
    navigate('/shop-all');
  };

  if (!visible) return null;

  const recs = getRecommendations(selected);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm animate-fade-in" onClick={dismiss} />
      <div className="relative w-full max-w-md animate-scale-in overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500" />

        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-5 z-10 rounded-full p-1.5 text-ink-400 transition-colors hover:bg-cream-100 hover:text-ink-700"
        >
          <X size={18} />
        </button>

        {stage === 'select' ? (
          <div className="px-7 pb-7 pt-8">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-700">
              <Sparkles size={13} />
              Wellness Check-In
            </div>

            <h2 className="font-serif text-3xl leading-tight text-ink-900">
              Are You Feeling&hellip;
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Select up to 3 that resonate with you. We&rsquo;ll suggest options our clients love &mdash; not medical advice.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {FEELINGS.map(f => {
                const isSelected = selected.includes(f.id);
                const isDisabled = !isSelected && selected.length >= MAX_SELECTIONS;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFeeling(f.id)}
                    disabled={isDisabled}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'border-gold-400 bg-gold-50 text-ink-900 shadow-sm'
                        : isDisabled
                          ? 'border-cream-200 bg-cream-50 text-ink-300 cursor-not-allowed'
                          : 'border-cream-300 bg-white text-ink-700 hover:border-gold-300 hover:bg-gold-50/40'
                    }`}
                  >
                    <span className="text-lg leading-none">{f.emoji}</span>
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-ink-400">
                {selected.length} of {MAX_SELECTIONS} selected
              </span>
              <button
                type="button"
                onClick={handleSeeResults}
                disabled={selected.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium tracking-wide text-cream-50 transition-all duration-300 hover:bg-ink-800 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                See My Options
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="px-7 pb-7 pt-8">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-700">
              <Sparkles size={13} />
              Curated For You
            </div>

            <h2 className="font-serif text-2xl leading-tight text-ink-900">
              Top Picks For How You&rsquo;re Feeling
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-ink-400">
              These are popular options among our clients with similar goals &mdash; not medical advice. A licensed provider reviews every order.
            </p>

            <div className="mt-5 space-y-3">
              {recs.map(rec => {
                const isAdded = addedSlugs.has(rec.slug) || basketItems.some(item => item.slug === rec.slug);
                return (
                  <div
                    key={rec.slug}
                    className="flex w-full items-start gap-3 rounded-2xl border border-cream-300 bg-cream-50/60 px-4 py-3.5 text-left transition-all duration-200 hover:border-gold-300 hover:bg-gold-50/40 hover:shadow-sm"
                  >
                    <span className="mt-0.5 text-2xl leading-none">{rec.emoji}</span>
                    <div className="flex-1">
                      <p className="font-serif text-base font-semibold text-ink-900">{rec.title}</p>
                      {rec.price > 0 && (
                        <p className="mt-0.5 text-sm font-medium text-gold-700">${rec.price.toFixed(2)}</p>
                      )}
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{rec.blurb}</p>
                      <div className="mt-2 space-y-1">
                        {SUPPORT_POINTS[rec.slug]?.map(point => (
                          <p key={point} className="text-[11px] leading-tight text-ink-500">
                            <span className="mr-1 text-gold-600">•</span>{point}
                          </p>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToBasket(rec)}
                      disabled={isAdded}
                      className={`mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                        isAdded
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-ink-900 text-cream-50 hover:bg-ink-800 hover:shadow-md'
                      }`}
                    >
                      {isAdded ? <><Check size={13} /> Added</> : <><Plus size={13} /> Add to Care Basket</>}
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddAllToBasket}
              className="btn-gold mt-4 w-full text-sm"
            >
              Add All To Care Basket
            </button>
            <button
              type="button"
              onClick={handleBrowseAll}
              className="mt-2 w-full text-sm font-medium text-ink-600 underline underline-offset-2 hover:text-ink-900"
            >
              Browse All Products
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="mt-3 w-full text-xs text-ink-400 underline underline-offset-2 hover:text-ink-700"
            >
              No thanks, continue browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
