import { STATES } from '../data/treatmentAvailability';

export const STATE_STORAGE_KEY = 'mybaremethod_selected_state';
let selected = '';
let initialized = false;
const listeners = new Set<() => void>();

export function getSelectedState(): string {
  if (!initialized && typeof window !== 'undefined') {
    initialized = true;
    try {
      const saved = window.localStorage.getItem(STATE_STORAGE_KEY) ?? '';
      selected = STATES[saved] ? saved : '';
    } catch { /* Keep the selector usable when storage is blocked. */ }
  }
  return selected;
}

export function setSelectedState(value: string): void {
  selected = STATES[value] ? value : '';
  initialized = true;
  try { window.localStorage.setItem(STATE_STORAGE_KEY, selected); } catch { /* Session-only fallback. */ }
  listeners.forEach(listener => listener());
}

export function subscribeSelectedState(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STATE_STORAGE_KEY && event.key !== null) return;
    initialized = false;
    getSelectedState();
    listeners.forEach(notify => notify());
  };
  if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
  };
}
