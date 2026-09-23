# Beehive Architecture Migration — Explorer 3 Investigation Report
**Role**: Test & Theme Invariant Explorer  
**Date**: 2026-09-22  
**Target Repository**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active`  

---

## Executive Summary

This report delivers a thorough empirical baseline and architectural roadmap for **Explorer Survey 3** covering:
1. **Test Suite Baseline**: Verification of `vitest` execution, complete inventory of test files, mock boundaries, and critical store dependencies.
2. **Hive Context Persistence & Theming Invariant**: Line-by-line inspection of `PublicUserProfile.jsx` and `UserProfile.jsx`, exact `viewerHive` integration patterns, and complete color tokens for all five hives.
3. **Requirement R7 (HiveHealthMonitor)**: Component architecture for `src/brain/HiveHealthMonitor.jsx` and its seamless integration into `src/components/admin/OverviewPanel.jsx`.

---

## 1. Test Suite Baseline & Architecture Analysis

### 1.1 Test Suite Execution Verification
A complete run of the test suite via `npx vitest run` was executed in the project root:
- **Test Files**: **40 passed** (40 total)
- **Tests**: **360 passed** (360 total)
- **Status**: 100% Pass Rate (0 failures, 0 skipped)
- **Duration**: ~102.52 seconds (transform 11.74s, setup 10.99s, import 67.10s, tests 31.47s, environment 84.48s)
- **Configuration**:
  - Test runner: Vitest v4.1.10
  - Environment: `jsdom`
  - Setup file: `./src/setupTests.js`
  - Workers: 2 (`maxWorkers: 2`)
  - Timeout: 15,000ms

### 1.2 The 40 Test Files Breakdown
Vitest scans `**/*.{test,spec}.?(c|m)[jt]s?(x)` excluding `node_modules` and `e2e`. The 40 files are distributed across three locations:

#### Location A: `src/__tests__/` (35 Files)
1. `AICareerWingman.test.jsx` — AI career coaching modal and advice generation.
2. `AdminDashboard.test.jsx` — Admin CMS tab navigation, isolation, KPI counts.
3. `AlumniEvaluationSurveyPopup.test.jsx` — Automatic survey popup for alumni branch, form submission, store persistence.
4. `App.test.jsx` — Route handling (`/`, `/login`, `/register`, `/admin_cms`, `/explore`), authentication states, dev role gating.
5. `BMICalculatorModal.test.jsx` — Campus health BMI calculator modal.
6. `BranchContextAndAdminFeed.test.jsx` — 1,077-line comprehensive test: branch switching, PublicUserProfile visitor mode, emerald/purple/blue branding, and back navigation.
7. `CMSCareerFair.test.jsx` — Career fair CMS stand management, form template builder, questions, drag/drop.
8. `CMSCareerOpportunities.test.jsx` — Career opportunities CMS CRUD and state mutations.
9. `CMSGeneralEvents.test.jsx` — General events CMS CRUD and date formatting.
10. `CareerNetwork.test.jsx` — University alumni & student networking directory.
11. `ClubAdminPanel.test.jsx` — Student club management console.
12. `ClubsDirectory.test.jsx` — Student club listings and filter options.
13. `CompanyProfilesAndTabs.test.jsx` — Company profiles (CMP-001 through CMP-005) rendering in PublicUserProfile.
14. `ComponentIntegrity.test.jsx` — Renders 15 core components across 5 roles (student, alumni, company, admin, academic, undefined, null) to ensure zero white-screen crashes.
15. `FloatingChatWidgetAndF5Persistence.test.jsx` — Real-time chat widget open/close state and localStorage message persistence.
16. `GlobalAlumniMapAndLocation.test.jsx` — Global alumni map, country markers, filter controls.
17. `GlobalAlumniMapLODAndRoutes.test.jsx` — Map LOD (level of detail) zoom steps and connection routes.
18. `JobApplicationAndAdminPool.test.jsx` — Job application flow and candidate review pool.
19. `JobsAndInternships.test.jsx` — Job and internship cards, search filters.
20. `Login.test.jsx` — Login form validation, error states, role routing.
21. `MessagingInterface.test.jsx` — Full-page chat layout, contact list, message thread rendering.
22. `ProfileUpdateBranchesAndCheckup.test.jsx` — Profile update views for all 4 roles + career checkup modal.
23. `Register.test.jsx` — Registration form, role select dropdown, submission validation.
24. `ResearchLabAndCallManagement.test.jsx` — Academic research grants, lab projects, publication management.
25. `StudentKGBPanel.test.jsx` — Student KGB (Kariyer Geliştirme Birimi) tracking.
26. `TopProfileMenu.test.jsx` — Sticky top navigation profile dropdown and logout trigger.
27. `WebRTCAndRouting.test.jsx` — Video call modal stubs and WebRTC state triggers.
28. `Worker_M2_3_Features.test.jsx` — Feature toggle regression tests from Milestone 2 & 3.
29. `deepcoder_core_transformations.test.jsx` — Data pipeline sanitization and normalizers.
30. `empirical_m4_floorplan.test.jsx` — SVG interactive fair stand map, reservation and company assignment.
31. `empirical_m4_stress.test.js` — High-load concurrency stress tests on stand reservations.
32. `feedAndLiveDataStress.test.jsx` — Scraped data feed combiners under malformed payload stress.
33. `gemini.test.js` — AI Gemini client helper unit tests.
34. `storeStateAndEdgeCases.test.jsx` — Zustand store edge cases: null resets, empty arrays, malformed IDs.
35. `utils.test.js` — Core utility helpers: formatters, time ago, validators.

#### Location B: `src/tests/` (4 Files)
36. `challenger.test.js` — Data scraper integrity, mock data validity, anti-crash checks.
37. `empirical_m3_stress.test.jsx` — M3 stress test for UI stability and heavy feed rendering.
38. `integration.test.jsx` — E-Devlet, OBS integration service mocks.
39. `scraper.test.js` — Live web-scraping parser tests.

#### Location C: `.agents/challenger_m3_1/` (1 File)
40. `chaos.test.js` — Chaos engineering suite for `combineFeedItems`, `exportToCSV`, and mock datasets.
> **Key Note on Test #40**: Vitest's `exclude` in `vitest.config.js` only lists `['**/node_modules/**', '**/e2e/**']`. As a result, Vitest traverses `.agents/` and executes `.agents/challenger_m3_1/chaos.test.js`. This accounts for the exact 40th file. Implementers must be careful not to delete or move this file without adjusting `vitest.config.js`.

### 1.3 Mock Boundaries & Global Stubs
The test suite relies on targeted mocks:
1. **Firebase**:
   - `firebase/auth`: `onAuthStateChanged`, `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`
   - `firebase/firestore`: `doc`, `getDoc`, `setDoc`
   - `../utils/firebase`: `{ auth: {}, db: {} }`
2. **Heavy Third-Party UI Libraries**:
   - `recharts`: `ResponsiveContainer` replaced with a simple mock container (`ComponentIntegrity.test.jsx`).
   - `react-simple-maps`: Vector map components replaced with SVG dummy nodes (`GlobalAlumniMap*.test.jsx`).
3. **Internal Route Views (in `App.test.jsx`)**:
   - `LandingPage`, `Login`, `Register`, `ExploreFeed`, `StudentFeed` are mocked to isolate App router logic.
4. **Browser Environment Polyfills (`src/setupTests.js`)**:
   - `window.localStorage` and `window.sessionStorage`: In-memory key-value dictionary mock.
   - `window.matchMedia`: Query stub returning `{ matches: false }`.
   - `window.AudioContext`: Oscillator and gain mock stubs.
   - `HTMLCanvasElement.prototype.getContext`: Full 2D canvas context mock (stubs `fillRect`, `measureText`, `getImageData`, etc.).
   - `window.alert`, `window.confirm`, `window.scrollTo`, `window.toast`: Vitest mock functions.

### 1.4 Critical Risk: `useAppStore` in Existing Tests
- `src/store/useAppStore.js` is currently **46.1 KB** and is directly imported by **over 30 test files**.
- Tests frequently execute:
  - `useAppStore.setState({ students: [...], jobs: [...], careerFairFormTemplate: [...] })`
  - `useAppStore.getState().assignStandToCompany(...)`
  - `useAppStore.getState().userRole`
- **Migration Warning (R8)**: When shrinking `useAppStore.js` to <12KB, if fields like `students`, `alumni`, `companies`, `posts`, `jobs`, or `careerFairFormTemplate` are removed without delegating getters/setters to `useSharedStore` and `useAdminStore`, dozens of existing tests will break.
- **Architectural Solution**: `useAppStore.js` must implement a transparent facade/delegator layer for state slices that moved to `useSharedStore` or `useAdminStore`.

---

## 2. Deep Dive: PublicUserProfile.jsx & UserProfile.jsx

### 2.1 Current Implementation State

#### A. `PublicUserProfile.jsx` (1,423 lines)
- **Current Props**: `({ userId, setView, setSelectedUserId, previousView, currentUser, setDirectMessageUser })` (does NOT currently accept `viewerHive`).
- **Branch Determination (lines 218-248)**: Derives `currentBranch` using `previousView`, `activePortalBranch`, and falls back to `userType` (the subject's role).
- **Theming Logic (lines 251-315)**: `branchTheme` object provides `logoColor`, `portalTitle`, `leafBadge`, `badgeClasses`, `coverGradient`, `homeTitle`.
- **Flaws against Invariant**:
  1. If `previousView` is undefined, line 242 falls back to `userType` (subject), flipping the theme to the subject!
  2. Follow Button (lines 555-562): Styles its background using `userType` (`userType === 'alumni' ? 'bg-emerald-600' : ...`), rather than the viewer's theme!
  3. Legacy branding `#0A2342` is hardcoded in line 171, 286, and 560.
- **Back Navigation (lines 318-336)**: `handleBack()` routes back to `student`, `alumni`, `academic`, `company`, or `admin` based on `currentBranch`.

#### B. `UserProfile.jsx` (3,542 lines)
- **Current Props**: `({ userId, setView, setSelectedUserId, previousView, currentUser, setDirectMessageUser })` (does NOT currently accept `viewerHive`).
- **Outer Header / Navbar (lines 2124-2182)**:
  - Logo color: `userType === 'alumni' ? 'emerald' : userType === 'academic' ? 'indigo' : userType === 'company' ? 'blue' : 'red'`.
  - Title color: `userType === 'alumni' ? 'text-emerald-800' : ...`.
  - Center Pill Badge: `userType === 'admin' ? ... : userType === 'alumni' ? ...`.
  - **Severe Invariant Breach**: The entire navigation bar is themed according to `userType` (the subject being viewed)! When an Alumni views an Academic profile, `userType` is `'academic'`, turning the entire navigation bar and badge purple!
- **Inner Profile Actions (`renderStudentProfile`, `renderAlumniProfile`, etc.)**:
  - Follow buttons use hardcoded colors (e.g. line 708: `#0A66C2`, line 1021: `#0A66C2`, line 1563: `#0A2342`, line 1888: `#4C1D95`).

---

### 2.2 Implementation Strategy for `viewerHive` Prop

Both `PublicUserProfile.jsx` and `UserProfile.jsx` must accept:
```tsx
viewerHive?: 'student' | 'alumni' | 'company' | 'academic' | 'admin'
```

#### Propagation Architecture:
1. **When rendered from a Hive root**:
   - `StudentHive.jsx` renders `<PublicUserProfile viewerHive="student" ... />`
   - `AlumniHive.jsx` renders `<PublicUserProfile viewerHive="alumni" ... />`
   - `CompanyHive.jsx` renders `<PublicUserProfile viewerHive="company" ... />`
   - `AcademicHive.jsx` renders `<PublicUserProfile viewerHive="academic" ... />`
2. **Backward-Compatibility Resolution Cascade**:
   ```javascript
   const effectiveHive = 
     viewerHive || 
     currentUser?.hive || 
     currentUser?.role || 
     currentBranch || 
     'student';
   ```
   This ensures existing tests passing only `previousView="alumni"` continue to resolve to the alumni theme without regressions.

---

### 2.3 Hive Color Identity Map & Theme Invariants

All chrome elements (navbar header, cover gradient, badges, follow/action buttons, back buttons) must strictly adhere to the Hive Color Identity Map:

| Hive Token | Role Key | Primary Color | Accent Tokens | Badge Tailwind Classes | Primary Button Classes |
|---|---|---|---|---|---|
| 🎓 **Student** | `student` | `#990000` | Red-50, Red-200 | `bg-red-50 text-[#990000] border-red-200 shadow-red-900/5` | `bg-[#990000] hover:bg-red-800 text-white shadow-red-900/20` |
| 🟢 **Alumni** | `alumni` | `#059669` | Emerald-50, Emerald-200 | `bg-emerald-50 text-[#059669] border-emerald-200 shadow-emerald-900/5` | `bg-[#059669] hover:bg-emerald-700 text-white shadow-emerald-900/20` |
| 👨‍🏫 **Academic** | `academic` | `#7c3aed` | Violet-50, Violet-200 | `bg-violet-50 text-[#7c3aed] border-violet-200 shadow-violet-900/5` | `bg-[#7c3aed] hover:bg-violet-800 text-white shadow-violet-900/20` |
| 🏢 **Company** | `company` | `#1e3a5f` | Blue-50, Blue-200 | `bg-blue-50 text-[#1e3a5f] border-blue-200 shadow-blue-900/5` | `bg-[#1e3a5f] hover:bg-slate-900 text-white shadow-blue-900/20` |
| 👑 **Admin** | `admin` | `#b45309` | Amber-50, Amber-200 | `bg-amber-50 text-[#b45309] border-amber-200 shadow-amber-900/5` | `bg-[#b45309] hover:bg-amber-700 text-white shadow-amber-900/20` |

#### Clean-up of Forbidden Colors:
- Replace `#0A2342` and `#1E3A8A` with Company Hive primary `#1e3a5f`.
- Replace legacy purple `#4C1D95` with Academic Hive primary `#7c3aed`.
- Replace legacy dark amber `#78350F` with Admin Hive primary `#b45309`.

---

### 2.4 Context Badge Specification: "You are viewing from [YourHive] portal"

#### Placement:
In the sticky top header of both `PublicUserProfile.jsx` and `UserProfile.jsx`, adjacent to or within the central role badge area.

#### Component Blueprint:
```jsx
// Helper mapping for Hive Labels
const HIVE_CONTEXT_CONFIG = {
  student: {
    label: 'Student',
    labelTr: 'Öğrenci',
    badgeClass: 'bg-red-50 text-[#990000] border-red-200',
    dotClass: 'bg-[#990000]',
    icon: '🎓'
  },
  alumni: {
    label: 'Alumni',
    labelTr: 'Mezun',
    badgeClass: 'bg-emerald-50 text-[#059669] border-emerald-200',
    dotClass: 'bg-[#059669]',
    icon: '🟢'
  },
  academic: {
    label: 'Academic',
    labelTr: 'Akademik',
    badgeClass: 'bg-violet-50 text-[#7c3aed] border-violet-200',
    dotClass: 'bg-[#7c3aed]',
    icon: '👨‍🏫'
  },
  company: {
    label: 'Company',
    labelTr: 'Kurumsal',
    badgeClass: 'bg-blue-50 text-[#1e3a5f] border-blue-200',
    dotClass: 'bg-[#1e3a5f]',
    icon: '🏢'
  },
  admin: {
    label: 'Admin',
    labelTr: 'Yönetim',
    badgeClass: 'bg-amber-50 text-[#b45309] border-amber-200',
    dotClass: 'bg-[#b45309]',
    icon: '👑'
  }
};

// Render Badge:
const hiveInfo = HIVE_CONTEXT_CONFIG[effectiveHive] || HIVE_CONTEXT_CONFIG.student;

<span 
  data-testid="hive-context-badge"
  className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-xs ${hiveInfo.badgeClass}`}
  title={`You are viewing this profile from the ${hiveInfo.label} Portal`}
>
  <span className={`w-2 h-2 rounded-full animate-pulse ${hiveInfo.dotClass}`}></span>
  <span>{hiveInfo.icon} You are viewing from {hiveInfo.label} portal</span>
</span>
```

---

## 3. Requirement R7: HiveHealthMonitor Architecture & OverviewPanel Integration

### 3.1 Component Architecture (`src/brain/HiveHealthMonitor.jsx`)
`HiveHealthMonitor.jsx` provides administrative visibility into the decentralized hive ecosystem.

#### Key Features:
1. **Honeycomb Cell Layout**:
   - 4 user-role hive cells (Student, Alumni, Academic, Company) arranged horizontally or in a modern hex-grid pattern.
   - Status: `active` (rendered in full hive color, pulsing indicator) or `idle` (muted tone, static indicator).
2. **EventBus Throughput Counter**:
   - Subscribes to `src/brain/eventBus.js`.
   - Tracks incoming events per minute (EPM) over a rolling 60-second window.
   - Displays real-time EPM metric with live activity graph / sparkline.
3. **Per-Hive Error Counts**:
   - Reads `hiveErrors` from `useAdminStore`: `{ student: 0, alumni: 0, company: 0, academic: 0 }`.
   - Displays warning pill if errors > 0.
4. **"All Hives Connected" Indicator**:
   - Verifies whether all 4 user-hive stores (`useStudentStore`, `useAlumniStore`, `useCompanyStore`, `useAcademicStore`) are active/initialized.
   - Displays:
     ```jsx
     <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-black">
       <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
       <span>✓ All hives connected</span>
     </div>
     ```

### 3.2 Integration into `src/components/admin/OverviewPanel.jsx`
- `OverviewPanel.jsx` currently starts with:
  ```jsx
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Kontrol Merkezi" sub="Sistemin genel durumu" />
  ```
- **Exact Integration Point**: Insert `<HiveHealthMonitor />` immediately after `<PanelHeader ... />` and before the AI Banner:
  ```jsx
  import HiveHealthMonitor from '../../brain/HiveHealthMonitor';

  export default function OverviewPanel({ setView }) {
    ...
    return (
      <div className="animate-fade-in space-y-6">
        <PanelHeader title="Kontrol Merkezi" sub="Sistemin genel durumu" />
        
        {/* R7 Beehive Health Monitor */}
        <HiveHealthMonitor />
        
        {/* AI Modülleri Banner */}
        ...
  ```
- Additionally, in `AdminDashboard.jsx` (which has an internal inline `OverviewPanel`), ensure `<HiveHealthMonitor />` is also imported and mounted to keep both overview views consistent.

---

## 4. Implementation Recommendations & Risk Mitigation

| Risk Area | Risk Description | Recommended Mitigation |
|---|---|---|
| **1. Store Shrinkage vs Tests** | Over 30 test files rely on `useAppStore.setState()` for `students`, `jobs`, `posts`, etc. | Implement a Proxy or facade in `useAppStore.js` delegating to `useSharedStore` and `useAdminStore` while keeping file size under 12KB. |
| **2. `.agents/` Test Discovery** | `.agents/challenger_m3_1/chaos.test.js` is part of the 40 baseline tests. | Do not remove or alter `chaos.test.js`. Maintain `vitest.config.js` exclude settings. |
| **3. Prop Drilling in Profiles** | Missing `viewerHive` in deeply nested sub-components. | Use React Context (`useHiveContext()`) within each Hive, and make `viewerHive` in `PublicUserProfile` default to `useHiveContext()?.hiveName || currentUser?.role`. |
| **4. Branding Consistency** | Lingering `#0A2342` and `#4C1D95` in profile cards. | Standardize all color declarations with the Hive Color Identity Map (`#1e3a5f` and `#7c3aed`). |

---

## 5. Verification Commands for Subsequent Workers
- **Run full test suite**: `npm test` or `npx vitest run` (baseline: 40 files, 360 passed).
- **Run PublicUserProfile tests**: `npx vitest run src/__tests__/BranchContextAndAdminFeed.test.jsx src/__tests__/CompanyProfilesAndTabs.test.jsx`.
- **Run ComponentIntegrity tests**: `npx vitest run src/__tests__/ComponentIntegrity.test.jsx`.
- **Verify Build**: `npm run build`.