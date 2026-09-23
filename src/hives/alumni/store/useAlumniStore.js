import { create } from 'zustand';

/**
 * Initial state definitions for Alumni Hive Store
 */
const initialState = {
  activeView: 'feed',
  previousView: null,
  activeTab: 'feed',
  mentorMode: false,
  alumniCardActive: false,
};

/**
 * Isolated Zustand store for the Alumni Hive portal.
 *
 * INVARIANTS:
 * - Zero imports from useAppStore or other hives.
 * - Manages alumni portal view routing, mentor mode toggles, and digital card status.
 */
export const useAlumniStore = create((set) => ({
  ...initialState,

  /**
   * Set the active view within Alumni Hive and record previous view.
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
   * Set active sub-tab within the alumni feed.
   * @param {string|Function} tab
   */
  setActiveTab: (tab) =>
    set((state) => ({
      activeTab: typeof tab === 'function' ? tab(state.activeTab) : tab,
    })),

  /**
   * Toggle or set mentor mode.
   * @param {boolean|Function} mode
   */
  setMentorMode: (mode) =>
    set((state) => ({
      mentorMode: typeof mode === 'function' ? mode(state.mentorMode) : Boolean(mode),
    })),

  /**
   * Set status of the digital alumni card.
   * @param {boolean|Function} active
   */
  setAlumniCardActive: (active) =>
    set((state) => ({
      alumniCardActive: typeof active === 'function' ? active(state.alumniCardActive) : Boolean(active),
    })),

  /**
   * Reset store to initial state (for tests and session logout).
   */
  reset: () => set(initialState),
}));

export default useAlumniStore;
