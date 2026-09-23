import { create } from 'zustand';

/**
 * Initial state definitions for Company Hive Store
 */
const initialState = {
  activeView: 'feed',
  previousView: null,
  activeTab: 'feed',
  atsBoard: {},
  activeJobListings: [],
};

/**
 * Isolated Zustand store for the Company / Employer Hive portal.
 *
 * INVARIANTS:
 * - Zero imports from useAppStore or other hives.
 * - Manages employer portal view routing, ATS pipeline board, and job postings.
 */
export const useCompanyStore = create((set) => ({
  ...initialState,

  /**
   * Set the active view within Company Hive and record previous view.
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
   * Set active sub-tab within the company feed.
   * @param {string|Function} tab
   */
  setActiveTab: (tab) =>
    set((state) => ({
      activeTab: typeof tab === 'function' ? tab(state.activeTab) : tab,
    })),

  /**
   * Update ATS (Applicant Tracking System) candidate board data.
   * @param {object|Function} board
   */
  setAtsBoard: (board) =>
    set((state) => ({
      atsBoard: typeof board === 'function' ? board(state.atsBoard) : (board || {}),
    })),

  /**
   * Set the employer's active job listings array.
   * @param {Array|Function} listings
   */
  setActiveJobListings: (listings) =>
    set((state) => ({
      activeJobListings:
        typeof listings === 'function' ? listings(state.activeJobListings) : (Array.isArray(listings) ? listings : []),
    })),

  /**
   * Reset store to initial state (for tests and session logout).
   */
  reset: () => set(initialState),
}));

export default useCompanyStore;
