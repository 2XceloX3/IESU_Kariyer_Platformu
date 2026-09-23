import { create } from 'zustand';

/**
 * Initial state definitions for Academic Hive Store
 */
const initialState = {
  activeView: 'feed',
  previousView: null,
  activeTab: 'feed',
  researchMode: false,
};

/**
 * Isolated Zustand store for the Academic Staff Hive portal.
 *
 * INVARIANTS:
 * - Zero imports from useAppStore or other hives.
 * - Manages academic portal view routing, tab states, and research workspace toggles.
 */
export const useAcademicStore = create((set) => ({
  ...initialState,

  /**
   * Set the active view within Academic Hive and record previous view.
   * @param {string|Function} view - Target view name or functional updater.
   */
  setActiveView: (view) =>
    set((state) => {
      const nextView = typeof view === 'function' ? view(state.activeView) : view;
      if (!nextView || nextView === state.activeView) return state;
      return {
        previousView: state.activeView,
        activeView: nextView,
      };
    }),

  /**
   * Restore previous view or fall back to default 'feed'.
   */
  goBack: () =>
    set((state) => {
      const targetView = state.previousView || 'feed';
      if (targetView === state.activeView) return state;
      return {
        previousView: state.activeView,
        activeView: targetView,
      };
    }),

  /**
   * Set active sub-tab within academic staff views.
   * @param {string|Function} tab
   */
  setActiveTab: (tab) =>
    set((state) => ({
      activeTab: typeof tab === 'function' ? tab(state.activeTab) : tab,
    })),

  /**
   * Toggle or set academic research mode.
   * @param {boolean|Function} mode
   */
  setResearchMode: (mode) =>
    set((state) => ({
      researchMode: typeof mode === 'function' ? mode(state.researchMode) : Boolean(mode),
    })),

  /**
   * Reset store to initial state (for tests and session logout).
   */
  reset: () => set(initialState),
}));

export default useAcademicStore;
