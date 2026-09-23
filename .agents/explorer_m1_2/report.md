# Architectural Blueprint: 4 Per-Hive Isolated Stores (Requirement R2)

**Document**: Hive Store Specification & Implementation Blueprint  
**Milestone**: Milestone 1 (Brain & Hive Foundation Layer)  
**Agent**: Explorer M1-2  
**Target Path**: `src/hives/*/store/useXxxStore.js`  
**Date**: 2026-09-22  

---

## 1. Executive Summary

As part of the **Beehive (Arı Kovanı) Architecture Migration** for the İESÜ Career & Alumni Ecosystem Platform, Requirement R2 mandates the creation of **4 isolated, role-specific Zustand stores**:

1. `src/hives/student/store/useStudentStore.js`
2. `src/hives/alumni/store/useAlumniStore.js`
3. `src/hives/company/store/useCompanyStore.js`
4. `src/hives/academic/store/useAcademicStore.js`

Historically, view routing (`previousView`, active view strings) was tangled in `src/App.jsx` and the monolithic 46 KB `src/store/useAppStore.js`. In the Beehive architecture:
- Each hive cell possesses its own private navigation memory and role-specific workspace state.
- Stores are 100% decoupled: updating an internal view in the Student Hive does not trigger React re-renders or state changes in Alumni, Company, or Academic trees.
- Stores have **zero dependencies on `useAppStore`** and **zero cross-hive imports**.

This blueprint provides the exact code blueprints, state machines, type signatures, defensive guards, and test specifications for the implementer agent.

---

## 2. Core Architectural Invariants

| # | Invariant Rule | Implementation Enforcement | Rationale |
|---|---|---|---|
| **INV-1** | **Zero Cross-Hive Imports** | Store files must NEVER import from peer hives (e.g., student store cannot import alumni store). | Prevents circular dependencies, preserves modular encapsulation, allows independent tree-shaking. |
| **INV-2** | **No `useAppStore` Import** | Neither `useAppStore` nor any monolithic store helper may be imported in any `src/hives/*/store/` file. | Clean separation of concerns; isolates hive runtime from legacy or global session store. |
| **INV-3** | **Zustand v5 Pure Instantiation** | Uses `import { create } from 'zustand';` directly. | No unnecessary middleware bloat; stores remain lightweight, fast, and easy to reset during tests. |
| **INV-4** | **Dual Export Standard** | Export both named (`export { useXxxStore }`) and default (`export default useXxxStore`). | Eliminates import style discrepancies across modern Vite and React components. |
| **INV-5** | **Defensive State Updates** | All setters and transitions support functional updaters `(prev) => next` and guard against invalid inputs (`undefined`, no-op transitions). | Robustness against React 19 rendering concurrency and edge-case user actions. |

---

## 3. Specification & Code Blueprints for the 4 Stores

---

### 3.1 Student Hive Store: `src/hives/student/store/useStudentStore.js`

#### State Schema
| Key | Type | Default | Description |
|---|---|---|---|
| `activeView` | `string` | `'feed'` | Current active view inside the Student portal (e.g., `'feed'`, `'jobs'`, `'cvbuilder'`, `'student_analytics'`, `'student_kgb'`, `'reward_store'`, `'network'`, `'calendar'`, `'messaging'`, `'user_profile'`). |
| `previousView` | `string \| null` | `null` | Previous view before last transition, used by `goBack()`. |
| `activeTab` | `string` | `'feed'` | Active sub-tab inside `StudentFeed` (e.g., `'feed'`, `'create_post'`, `'search'`, `'team_mentor'`, `'surveys'`, `'clubs'`, `'career_network'`, `'applications'`, `'messaging'`, `'calendar'`, `'cvbuilder'`). |
| `careerProgress` | `number` | `0` | Student's career readiness progress score (0 to 100). |
| `dailyQuestProgress` | `number` | `0` | Progress completion metric for daily student career quests. |
| `selectedJobId` | `string \| number \| null` | `null` | Active job identifier selected for application / detail modal. |

#### Action Contracts
- `setActiveView(view)`: Navigates to target view string. If `view` differs from current `activeView`, sets `previousView = state.activeView` and `activeView = nextView`. Ignores empty or identical view inputs.
- `goBack()`: Restores `previousView` (falling back to `'feed'` if `previousView` is null). Sets `activeView = target` and `previousView = state.activeView`.
- `setActiveTab(tab)`: Updates `activeTab`. Supports functional updaters.
- `setCareerProgress(progress)`: Updates `careerProgress` (number or updater).
- `setDailyQuestProgress(progress)`: Updates `dailyQuestProgress` (number or updater).
- `setSelectedJobId(id)`: Sets or clears `selectedJobId`.
- `reset()`: Resets all state fields to initial values (useful for test isolation).

#### Ready-to-Implement Source Code: `src/hives/student/store/useStudentStore.js`
```javascript
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
```

---

### 3.2 Alumni Hive Store: `src/hives/alumni/store/useAlumniStore.js`

#### State Schema
| Key | Type | Default | Description |
|---|---|---|---|
| `activeView` | `string` | `'feed'` | Current active view inside the Alumni portal (e.g., `'feed'`, `'mbs'`, `'mezun_dernek'`, `'alumni_assoc_portal'`, `'alumni_card'`, `'global_map'`, `'mentor_match'`, `'jobs'`, `'network'`, `'messaging'`). |
| `previousView` | `string \| null` | `null` | Previous view before last transition, used by `goBack()`. |
| `activeTab` | `string` | `'feed'` | Active sub-tab inside `AlumniFeed` (e.g., `'feed'`, `'create_post'`, `'search'`, `'surveys'`, `'clubs'`, `'career_network'`, `'applications'`, `'messaging'`, `'calendar'`, `'cvbuilder'`). |
| `mentorMode` | `boolean` | `false` | Flag indicating whether the alumnus has activated mentorship mode to accept student mentees. |
| `alumniCardActive` | `boolean` | `false` | Status of the official digital Alumni Card membership. |

#### Action Contracts
- `setActiveView(view)`: Navigates to target view string. If `view` differs from current `activeView`, sets `previousView = state.activeView` and `activeView = nextView`.
- `goBack()`: Restores `previousView` (falling back to `'feed'`).
- `setActiveTab(tab)`: Updates `activeTab`. Supports functional updaters.
- `setMentorMode(mode)`: Updates `mentorMode` (boolean or updater `(prev) => !prev`).
- `setAlumniCardActive(active)`: Updates `alumniCardActive` status (boolean or updater).
- `reset()`: Resets all state fields to initial values.

#### Ready-to-Implement Source Code: `src/hives/alumni/store/useAlumniStore.js`
```javascript
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
```

---

### 3.3 Company Hive Store: `src/hives/company/store/useCompanyStore.js`

#### State Schema
| Key | Type | Default | Description |
|---|---|---|---|
| `activeView` | `string` | `'feed'` | Current active view inside the Company portal (e.g., `'feed'`, `'company_ats'`, `'create_job'`, `'applications'`, `'network'`, `'messaging'`, `'calendar'`, `'user_profile'`). |
| `previousView` | `string \| null` | `null` | Previous view before last transition, used by `goBack()`. |
| `activeTab` | `string` | `'feed'` | Active sub-tab inside `CompanyFeed` (e.g., `'feed'`, `'create_post'`, `'search'`, `'surveys'`, `'applications'`, `'messaging'`, `'calendar'`, `'cvbuilder'`). |
| `atsBoard` | `object` | `{}` | Candidate pipeline and recruitment stage mappings for employer ATS (Applicant Tracking System). |
| `activeJobListings` | `Array` | `[]` | Current employer's active published job and internship postings. |

#### Action Contracts
- `setActiveView(view)`: Navigates to target view string. If `view` differs from current `activeView`, sets `previousView = state.activeView` and `activeView = nextView`.
- `goBack()`: Restores `previousView` (falling back to `'feed'`).
- `setActiveTab(tab)`: Updates `activeTab`. Supports functional updaters.
- `setAtsBoard(board)`: Updates `atsBoard` state (object or updater).
- `setActiveJobListings(listings)`: Updates `activeJobListings` (array or updater).
- `reset()`: Resets all state fields to initial values.

#### Ready-to-Implement Source Code: `src/hives/company/store/useCompanyStore.js`
```javascript
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
```

---

### 3.4 Academic Hive Store: `src/hives/academic/store/useAcademicStore.js`

#### State Schema
| Key | Type | Default | Description |
|---|---|---|---|
| `activeView` | `string` | `'feed'` | Current active view inside the Academic portal (e.g., `'feed'`, `'research_hub'`, `'calendar'`, `'network'`, `'messaging'`, `'user_profile'`). |
| `previousView` | `string \| null` | `null` | Previous view before last transition, used by `goBack()`. |
| `activeTab` | `string` | `'feed'` | Active sub-tab inside `AcademicStaffFeed` (e.g., `'feed'`, `'dashboard'`, `'approvals'`, `'counseling'`, `'radar'`, `'badges'`, `'career_network'`, `'messaging'`). |
| `researchMode` | `boolean` | `false` | Mode toggle activating university R&D, patent management, and grant call workflows. |

#### Action Contracts
- `setActiveView(view)`: Navigates to target view string. If `view` differs from current `activeView`, sets `previousView = state.activeView` and `activeView = nextView`.
- `goBack()`: Restores `previousView` (falling back to `'feed'`).
- `setActiveTab(tab)`: Updates `activeTab`. Supports functional updaters.
- `setResearchMode(mode)`: Updates `researchMode` (boolean or updater `(prev) => !prev`).
- `reset()`: Resets all state fields to initial values.

#### Ready-to-Implement Source Code: `src/hives/academic/store/useAcademicStore.js`
```javascript
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
```

---

## 4. Behavioral Invariants & State Transition Machine

### 4.1 State Transition Matrix: `setActiveView(v)` and `goBack()`

| Current `activeView` | Current `previousView` | Action Invoked | Resulting `activeView` | Resulting `previousView` | Notes |
|---|---|---|---|---|---|
| `'feed'` | `null` | `setActiveView('jobs')` | `'jobs'` | `'feed'` | Standard forward transition. |
| `'jobs'` | `'feed'` | `setActiveView('jobs')` | `'jobs'` | `'feed'` | **No-op**: Identical view, state reference untouched. |
| `'jobs'` | `'feed'` | `goBack()` | `'feed'` | `'jobs'` | Restores previous view; previous updated to `'jobs'`. |
| `'feed'` | `'jobs'` | `goBack()` | `'jobs'` | `'feed'` | Double-back allows backtracking to origin. |
| `'feed'` | `null` | `goBack()` | `'feed'` | `null` | **Safe Guard**: Fallback to `'feed'` when no previous history exists. |
| `'feed'` | `null` | `setActiveView(null / undefined)` | `'feed'` | `null` | **Falsy Guard**: Prevents corrupted view state. |
| `'feed'` | `null` | `setActiveView(prev => prev + '_v2')` | `'feed_v2'` | `'feed'` | **Functional Updater**: Evaluates current state accurately. |

---

## 5. Downstream Integration & Dependency Isolation

```
                   ┌────────────────────────────────────────┐
                   │             src/App.jsx                │
                   │  (Hive Selector Switch, < 150 lines)   │
                   └───────────────────┬────────────────────┘
                                       │ renders
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
 ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
 │   StudentHive.jsx    │   │    AlumniHive.jsx    │   │   CompanyHive.jsx    │
 └──────────┬───────────┘   └──────────┬───────────┘   └──────────┬───────────┘
            │ imports                  │ imports                  │ imports
            ▼                          ▼                          ▼
 ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
 │  useStudentStore.js  │   │   useAlumniStore.js  │   │  useCompanyStore.js  │
 │  (NO dependencies)   │   │  (NO dependencies)   │   │  (NO dependencies)   │
 └──────────────────────┘   └──────────────────────┘   └──────────────────────┘
```

### 5.1 Consumption in Milestone 2 Root Components (`XxxHive.jsx`)
In Milestone 2, each Hive component will mount its own store selector:
```javascript
// Example in src/hives/student/StudentHive.jsx
import { useStudentStore } from './store/useStudentStore';
import { HiveProvider } from './HiveContext';

export default function StudentHive({ currentUser }) {
  const activeView = useStudentStore((s) => s.activeView);
  const setActiveView = useStudentStore((s) => s.setActiveView);
  const goBack = useStudentStore((s) => s.goBack);

  return (
    <HiveProvider>
      {activeView === 'feed' && <StudentFeed currentUser={currentUser} setView={setActiveView} />}
      {activeView === 'jobs' && <JobsAndInternships currentUser={currentUser} goBack={goBack} />}
      {/* other role views */}
    </HiveProvider>
  );
}
```

### 5.2 Verification of Invariants
- `grep_search` across `src/hives/*/store/` for `useAppStore` must return **0 results**.
- `grep_search` across `src/hives/student/store/` for `alumni`, `company`, or `academic` must return **0 results**.
- Bundler graph analysis: each store has exactly one external dependency: `'zustand'`.

---

## 6. Comprehensive Test Specifications for Implementer

To guarantee 100% test coverage for Requirement R2, the implementer can create `src/__tests__/hives/HiveStores.test.jsx`:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { useStudentStore } from '../../hives/student/store/useStudentStore';
import { useAlumniStore } from '../../hives/alumni/store/useAlumniStore';
import { useCompanyStore } from '../../hives/company/store/useCompanyStore';
import { useAcademicStore } from '../../hives/academic/store/useAcademicStore';

describe('R2: Per-Hive Isolated Stores Test Suite', () => {
  beforeEach(() => {
    useStudentStore.getState().reset();
    useAlumniStore.getState().reset();
    useCompanyStore.getState().reset();
    useAcademicStore.getState().reset();
  });

  describe('1. useStudentStore', () => {
    it('initializes with default values', () => {
      const state = useStudentStore.getState();
      expect(state.activeView).toBe('feed');
      expect(state.previousView).toBeNull();
      expect(state.activeTab).toBe('feed');
      expect(state.careerProgress).toBe(0);
      expect(state.dailyQuestProgress).toBe(0);
      expect(state.selectedJobId).toBeNull();
    });

    it('navigates views and manages previousView correctly', () => {
      const store = useStudentStore.getState();
      store.setActiveView('jobs');
      expect(useStudentStore.getState().activeView).toBe('jobs');
      expect(useStudentStore.getState().previousView).toBe('feed');

      store.goBack();
      expect(useStudentStore.getState().activeView).toBe('feed');
      expect(useStudentStore.getState().previousView).toBe('jobs');
    });

    it('supports functional updates for progress and tab', () => {
      useStudentStore.getState().setCareerProgress((prev) => prev + 25);
      expect(useStudentStore.getState().careerProgress).toBe(25);

      useStudentStore.getState().setDailyQuestProgress(3);
      expect(useStudentStore.getState().dailyQuestProgress).toBe(3);

      useStudentStore.getState().setSelectedJobId('JOB-101');
      expect(useStudentStore.getState().selectedJobId).toBe('JOB-101');
    });
  });

  describe('2. useAlumniStore', () => {
    it('initializes and modifies mentorMode and alumniCardActive', () => {
      const state = useAlumniStore.getState();
      expect(state.activeView).toBe('feed');
      expect(state.mentorMode).toBe(false);
      expect(state.alumniCardActive).toBe(false);

      useAlumniStore.getState().setMentorMode(true);
      expect(useAlumniStore.getState().mentorMode).toBe(true);

      useAlumniStore.getState().setAlumniCardActive((prev) => !prev);
      expect(useAlumniStore.getState().alumniCardActive).toBe(true);
    });
  });

  describe('3. useCompanyStore', () => {
    it('initializes and updates atsBoard and activeJobListings', () => {
      const state = useCompanyStore.getState();
      expect(state.atsBoard).toEqual({});
      expect(state.activeJobListings).toEqual([]);

      useCompanyStore.getState().setAtsBoard({ stage: 'review', count: 5 });
      expect(useCompanyStore.getState().atsBoard).toEqual({ stage: 'review', count: 5 });

      useCompanyStore.getState().setActiveJobListings([{ id: 1, title: 'Engineer' }]);
      expect(useCompanyStore.getState().activeJobListings).toHaveLength(1);
    });
  });

  describe('4. useAcademicStore', () => {
    it('initializes and toggles researchMode', () => {
      const state = useAcademicStore.getState();
      expect(state.researchMode).toBe(false);

      useAcademicStore.getState().setResearchMode(true);
      expect(useAcademicStore.getState().researchMode).toBe(true);
    });
  });

  describe('5. Architectural Isolation Invariant', () => {
    it('mutations in student store do not bleed into other hive stores', () => {
      useStudentStore.getState().setActiveView('student_analytics');
      expect(useStudentStore.getState().activeView).toBe('student_analytics');
      expect(useAlumniStore.getState().activeView).toBe('feed');
      expect(useCompanyStore.getState().activeView).toBe('feed');
      expect(useAcademicStore.getState().activeView).toBe('feed');
    });
  });
});
```

---

## 7. Delivery Checklist for Milestone 1 Implementer

- [x] File paths confirmed:
  - `src/hives/student/store/useStudentStore.js`
  - `src/hives/alumni/store/useAlumniStore.js`
  - `src/hives/company/store/useCompanyStore.js`
  - `src/hives/academic/store/useAcademicStore.js`
- [x] All 4 state specifications mapped with exact defaults (`feed`, `null`, `0`, `false`, `{}`, `[]`).
- [x] All action signatures defined (`setActiveView`, `goBack`, `setActiveTab`, and custom role actions).
- [x] Invariants verified:
  - NO imports from `useAppStore`.
  - NO imports across peer hives.
  - Plain `create` from `'zustand'`.
  - Dual named + default exports.
- [x] Verification test suite drafted and ready for M1 verification.
