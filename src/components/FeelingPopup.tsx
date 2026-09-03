import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { navigate } from '@/router';

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
};

const FEELING_TO_RECS: Record<FeelingId, Recommendation[]> = {
  tired: [
    { slug: 'nad-plus', title: 'NAD+ Cellular Energy', blurb: 'Supports cellular energy production and overall vitality.', emoji: '\u{1F50B}' },
    { slug: 'bpc-157', title: 'BPC-157 Recovery Peptide', blurb: 'Supports tissue repair and overall recovery.', emoji: '\u{1F489}' },
    { slug: 'initial-provider-consultation', title: 'Provider Consultation', blurb: 'A personalized review of your energy and wellness goals.', emoji: '\u{1F3E5}' },
  ],
  unfocused: [
    { slug: 'semax', title: 'Semax Cognitive Focus', blurb: 'Supports cognitive focus and mental clarity.', emoji: '\u{1F9E0}' },
    { slug: 'selank', title: 'Selank Calm-Focus', blurb: 'Supports calm, focused attention without jitters.', emoji: '\u{1F9CA}' },
    { slug: 'nad-plus', title: 'NAD+ Cellular Energy', blurb: 'Supports brain energy and cellular health.', emoji: '\u{1F50B}' },
  ],
  'weight-gain': [
    { slug: 'semaglutide', title: 'Semaglutide GLP-1', blurb: 'Provider-directed support for appetite regulation and weight management.', emoji: '\u{1F489}' },
    { slug: 'tirzepatide', title: 'Tirzepatide Dual GLP-1/GIP', blurb: 'Dual-action support for comprehensive weight management.', emoji: '\u{1F489}' },
    { slug: 'tesamorelin', title: 'Tesamorelin GHRH', blurb: 'Supports metabolic function and body composition.', emoji: '\u{1F489}' },
  ],
  'difficulty-losing-weight': [
    { slug: 'semaglutide', title: 'Semaglutide GLP-1', blurb: 'Provider-directed metabolic support for stubborn weight.', emoji: '\u{1F489}' },
    { slug: 'fat-burner', title: 'Fat Burner Peptide Blend', blurb: 'Supports fat oxidation and body-composition goals.', emoji: '\u{1F525}' },
    { slug: 'aod-9604', title: 'AOD-9604 Lipotropic', blurb: 'Supports fat metabolism and body composition.', emoji: '\u{1F489}' },
  ],
  'bad-sleep': [
    { slug: 'selank', title: 'Selank Calm-Focus', blurb: 'Supports relaxation and stress balance for better rest.', emoji: '\u{1F9CA}' },
    { slug: 'bpc-157', title: 'BPC-157 Recovery Peptide', blurb: 'Supports overall recovery, which is essential for restorative sleep.', emoji: '\u{1F489}' },
    { slug: 'initial-provider-consultation', title: 'Provider Consultation', blurb: 'A personalized review of your sleep and wellness patterns.', emoji: '\u{1F3E5}' },
  ],
  'low-mood': [
    { slug: 'selank', title: 'Selank Calm-Focus', blurb: 'Supports a balanced mood and stress resilience.', emoji: '\u{1F9CA}' },
    { slug: 'nad-plus', title: 'NAD+ Cellular Energy', blurb: 'Supports brain health and overall sense of well-being.', emoji: '\u{1F50B}' },
    { slug: 'initial-provider-consultation', title: 'Provider Consultation', blurb: 'A personalized review with a licensed provider.', emoji: '\u{1F3E5}' },
  ],
  'low-libido': [
    { slug: 'testosterone-cream', title: 'Testosterone Support Cream', blurb: 'Provider-directed hormone support for vitality and libido.', emoji: '\u{1F489}' },
    { slug: 'scream-cream', title: 'Scream Cream', blurb: 'Women\u2019s sexual wellness topical for enhanced sensation.', emoji: '\u{1F49B}' },
    { slug: 'estradiol-patch', title: 'Estradiol Patch', blurb: 'Provider-directed estrogen support for hormonal balance.', emoji: '\u{1FA79}' },
  ],
  'brain-fog': [
    { slug: 'semax', title: 'Semax Cognitive Focus', blurb: 'Supports memory, focus, and mental clarity.', emoji: '\u{1F9E0}' },
    { slug: 'selank-semax-nasal-spray', title: 'Selank + Semax Nasal Spray', blurb: 'Dual nootropic support for cognitive performance.', emoji: '\u{1F9CB}' },
    { slug: 'nad-plus', title: 'NAD+ Cellular Energy', blurb: 'Supports brain energy and cellular health.', emoji: '\u{1F50B}' },
  ],
  'slow-recovery': [
    { slug: 'bpc-157-tb-500', title: 'BPC-157 + TB-500 Recovery Blend', blurb: 'Supports tissue repair and musculoskeletal recovery.', emoji: '\u{1F489}' },
    { slug: 'bpc-157', title: 'BPC-157 Recovery Peptide', blurb: 'Supports tendon, ligament, and connective-tissue wellness.', emoji: '\u{1F489}' },
    { slug: 'recovery-stack', title: 'KLOW Recovery Blend', blurb: 'Four-peptide protocol for comprehensive recovery support.', emoji: '\u{1F489}' },
  ],
  'skin-hair': [
    { slug: 'tretinoin-cream', title: 'Tretinoin Skin Renewal', blurb: 'Prescription-strength skin renewal and collagen support.', emoji: '\u{1F9F4}' },
    { slug: 'minoxidil-topical', title: 'Minoxidil Hair Regrowth', blurb: 'Topical support for hair regrowth and scalp health.', emoji: '\u{1F9F4}' },
    { slug: 'bimatoprost-solution', title: 'Lash & Brow Growth Serum', blurb: 'Supports lash and brow fullness and length.', emoji: '\u{1F440}' },
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
    setStage('results');
  };

  const handleViewProduct = (slug: string) => {
    setVisible(false);
    navigate(`/product/${slug}`);
  };

  const handleBrowseAll = () => {
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
              {recs.map(rec => (
                <button
                  key={rec.slug}
                  type="button"
                  onClick={() => handleViewProduct(rec.slug)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-cream-300 bg-cream-50/60 px-4 py-3.5 text-left transition-all duration-200 hover:border-gold-300 hover:bg-gold-50/40 hover:shadow-sm"
                >
                  <span className="mt-0.5 text-2xl leading-none">{rec.emoji}</span>
                  <div className="flex-1">
                    <p className="font-serif text-base font-semibold text-ink-900">{rec.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{rec.blurb}</p>
                  </div>
                  <ArrowRight size={18} className="mt-1 shrink-0 text-ink-300" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleBrowseAll}
              className="btn-gold mt-5 w-full text-sm"
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
