import { create } from 'zustand';

/**
 * Initial state definitions for Student Hive Store
 */
const initialState = {
  activeView: 'feed',
  previousView: null,
  activeTab: 'feed',
  careerProgress: 0,
  dailyQuestProgress: 0,
  selectedJobId: null,
};

/**
 * Isolated Zustand store for the Student Hive portal.
 *
 * INVARIANTS:
 * - Zero imports from useAppStore or other hives.
 * - Manages student portal view routing, tab states, and career tracking.
 */
export const useStudentStore = create((set) => ({
  ...initialState,

  /**
   * Set the active view within Student Hive and record previous view.
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
   * Set active sub-tab within the feed / views.
   * @param {string|Function} tab
   */
  setActiveTab: (tab) =>
    set((state) => ({
      activeTab: typeof tab === 'function' ? tab(state.activeTab) : tab,
    })),

  /**
   * Set student career readiness score (0-100).
   * @param {number|Function} progress
   */
  setCareerProgress: (progress) =>
    set((state) => ({
      careerProgress: typeof progress === 'function' ? progress(state.careerProgress) : progress,
    })),

  /**
   * Set daily career quest completion progress.
   * @param {number|Function} progress
   */
  setDailyQuestProgress: (progress) =>
    set((state) => ({
      dailyQuestProgress:
        typeof progress === 'function' ? progress(state.dailyQuestProgress) : progress,
    })),

  /**
   * Set currently selected job ID for drawer/modal inspection.
   * @param {string|number|null|Function} id
   */
  setSelectedJobId: (id) =>
    set((state) => ({
      selectedJobId: typeof id === 'function' ? id(state.selectedJobId) : id,
    })),

  /**
   * Reset store to initial state (for tests and session logout).
   */
  reset: () => set(initialState),
}));

export default useStudentStore;
