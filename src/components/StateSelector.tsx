import { useId, useSyncExternalStore } from 'react';
import { STATES } from '@/data/treatmentAvailability';
import { getSelectedState, setSelectedState, subscribeSelectedState } from '@/lib/selectedState';

export function useSelectedState(): string {
  return useSyncExternalStore(subscribeSelectedState, getSelectedState, () => '');
}

export function StateSelector() {
  const state = useSelectedState();
  const id = useId();
  return (
    <div className="mb-6 rounded-2xl border border-cream-300 bg-white p-4 md:p-5">
      <label htmlFor={id} className="block text-sm font-medium text-ink-900">Shop treatments available in your state</label>
      <p className="mt-1 text-xs leading-relaxed text-ink-500">Not every treatment can be prescribed or shipped to every state. You can change your selection any time.</p>
      <select id={id} value={state} onChange={event => setSelectedState(event.target.value)} className="input-lux mt-3 w-full md:max-w-sm">
        <option value="">Select your state</option>
        {Object.entries(STATES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>
    </div>
  );
}

export function StateUnavailableNotice({ state }: { state: string }) {
  return <p role="status" className="mt-5 rounded-xl border border-cream-300 bg-cream-100 p-4 text-sm text-ink-700">This treatment isn't available in {STATES[state]} yet</p>;
}
