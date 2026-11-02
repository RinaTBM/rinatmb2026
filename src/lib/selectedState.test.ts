import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

describe('selected shopper state', () => {
  it('restores a saved state, notifies subscribers and saves changes', async () => {
    const setItem = vi.fn();
    vi.stubGlobal('window', { localStorage: { getItem: () => 'CA', setItem }, addEventListener: vi.fn(), removeEventListener: vi.fn() });
    const state = await import('./selectedState');
    expect(state.getSelectedState()).toBe('CA');
    const listener = vi.fn();
    const unsubscribe = state.subscribeSelectedState(listener);
    state.setSelectedState('DC');
    expect(state.getSelectedState()).toBe('DC');
    expect(setItem).toHaveBeenCalledWith(state.STATE_STORAGE_KEY, 'DC');
    expect(listener).toHaveBeenCalledOnce();
    unsubscribe();
    state.setSelectedState('PR');
    expect(listener).toHaveBeenCalledOnce();
  });
  it('works in memory if localStorage throws', async () => {
    vi.stubGlobal('window', { get localStorage() { throw new Error('blocked'); } });
    const state = await import('./selectedState');
    expect(state.getSelectedState()).toBe('');
    state.setSelectedState('AL');
    expect(state.getSelectedState()).toBe('AL');
    state.setSelectedState('invalid');
    expect(state.getSelectedState()).toBe('');
  });
  it('is safe during server rendering', async () => {
    vi.stubGlobal('window', undefined);
    const state = await import('./selectedState');
    expect(state.getSelectedState()).toBe('');
  });
});
