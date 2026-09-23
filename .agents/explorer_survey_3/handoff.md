# Handoff Report — Explorer Survey 3 (Test & Theme Invariant Explorer)

## 1. Observation
1. **Test Suite Baseline**:
   - Command: `npx vitest run` executed in `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active`
   - Exact output:
     ```
     Test Files  40 passed (40)
          Tests  360 passed (360)
       Start at  19:10:55
       Duration  102.52s (transform 11.74s, setup 10.99s, import 67.10s, tests 31.47s, environment 84.48s)
     ```
   - Test file locations:
     - `src/__tests__/`: 35 files
     - `src/tests/`: 4 files
     - `.agents/challenger_m3_1/chaos.test.js`: 1 file (discovered because `vitest.config.js` exclude is only `['**/node_modules/**', '**/e2e/**']`).
2. **Mock Boundaries**:
   - `firebase/auth`, `firebase/firestore`, `../utils/firebase` mocked in `App.test.jsx`, `Login.test.jsx`, `Register.test.jsx`.
   - `recharts` mocked in `ComponentIntegrity.test.jsx`.
   - `react-simple-maps` mocked in `GlobalAlumniMapAndLocation.test.jsx`.
   - `window.localStorage`, `sessionStorage`, `matchMedia`, `AudioContext`, `HTMLCanvasElement.getContext`, `alert`, `confirm`, `scrollTo`, `toast` mocked in `src/setupTests.js`.
3. **`useAppStore.js` State & Coupling**:
   - File size: 46,125 bytes (~46KB).
   - Direct imports and calls: `useAppStore.setState({...})` and `useAppStore.getState()...` are used in over 30 test files for setting mock datasets (`students`, `alumni`, `companies`, `jobs`, `posts`, `careerFairFormTemplate`, etc.).
4. **`PublicUserProfile.jsx` (1,423 lines)**:
   - Line 17-24: Props are `({ userId, setView, setSelectedUserId, previousView, currentUser, setDirectMessageUser })` — does not accept `viewerHive`.
   - Lines 218-248: Derives `currentBranch` using `previousView`, `activePortalBranch`, or falls back to `userType`.
   - Lines 555-562: Action follow button uses `userType` (subject's role) instead of the viewer's hive.
   - Lines 171, 286, 560: Still reference forbidden `#0A2342` branding.
5. **`UserProfile.jsx` (3,542 lines)**:
   - Line 13: Props are `({ userId, setView, setSelectedUserId, previousView, currentUser, setDirectMessageUser })` — does not accept `viewerHive`.
   - Lines 2128-2159: Top navigation bar Logo color, title color, and center pill badge are driven by `userType` (subject's role). When an alumni views an academic, the navigation flips to purple/indigo, violating the Hive Context Persistence invariant.
   - Lines 708, 1021, 1563, 1888: Action buttons use hardcoded subject colors or external blues (`#0A66C2`, `#0A2342`).
6. **Requirement R7 & OverviewPanel**:
   - `src/brain/` does not exist yet.
   - `src/components/admin/OverviewPanel.jsx` exists and has `PanelHeader` at lines 14-16.
   - `AdminDashboard.jsx` also contains an inline `OverviewPanel` at line 76.

## 2. Logic Chain
1. *From Observation 1 & 3*: Over 30 test files rely on `useAppStore` containing fields like `students`, `alumni`, `jobs`, `careerFairFormTemplate`. When Requirement R8 reduces `useAppStore.js` to <12KB by moving data to `useSharedStore` and `useAdminStore`, removing these fields without backward compatibility will immediately cause multiple test failures.
   - *Inference*: `useAppStore.js` must implement getter/setter proxies or delegation to `useSharedStore` and `useAdminStore`.
2. *From Observation 1*: The 40th test file is `.agents/challenger_m3_1/chaos.test.js`. Any clean-up or exclusion of `.agents/` in `vitest.config.js` would drop the file count to 39, violating the requirement of 40 test files passing.
   - *Inference*: Keep `.agents/challenger_m3_1/chaos.test.js` intact or ensure vitest continues to include it.
3. *From Observation 4 & 5*: Both `PublicUserProfile` and `UserProfile` calculate visual styling based on the viewed profile (`userType`) rather than the viewer (`viewerHive` / `currentUser.role`).
   - *Inference*: Adding `viewerHive` with fallback `currentUser?.role || currentBranch || 'student'` guarantees that the viewer's theme persists across all cross-role views, satisfying Requirement R5 while maintaining 100% backward compatibility with existing tests.
4. *From Observation 6*: `OverviewPanel.jsx` in `src/components/admin/` is cleanly modularized with `PanelHeader`.
   - *Inference*: Placing `<HiveHealthMonitor />` immediately after `<PanelHeader ... />` seamlessly injects the honeycomb monitoring widget into the admin dashboard without altering the existing KPI grid or banner.

## 3. Caveats
- `AdminDashboard.jsx` contains both an inline `OverviewPanel` and is distinct from `src/components/admin/OverviewPanel.jsx`. Both should be kept consistent or unified during implementation.
- While `npx vitest run` takes ~102 seconds on the current environment, running individual test files takes only 2-4 seconds.

## 4. Conclusion
1. **Baseline**: 40 test files and 360 tests are passing with 100% green status.
2. **Theming & Invariants**: Both `PublicUserProfile.jsx` and `UserProfile.jsx` require the addition of `viewerHive`, replacement of `userType`-based header and button styling with `effectiveHive` (`viewerHive || currentUser?.role || currentBranch`), removal of `#0A2342` and `#4C1D95` in favor of `#1e3a5f` and `#7c3aed`, and rendering of the context badge `"You are viewing from [YourHive] portal"`.
3. **Requirement R7**: `HiveHealthMonitor.jsx` should be created in `src/brain/` with 4 honeycomb cells, EventBus throughput tracking, error display, and mounted directly beneath `PanelHeader` in `src/components/admin/OverviewPanel.jsx`.
4. **Safety Guarantee**: Transparent store facade delegation in `useAppStore.js` is essential to preserve all 360 passing tests.

## 5. Verification Method
- **Test Suite Command**:
  ```bash
  npx vitest run
  ```
  Expected: 40 test files passed, 360 tests passed, 0 failures.
- **Specific Profile Test Verification**:
  ```bash
  npx vitest run src/__tests__/BranchContextAndAdminFeed.test.jsx
  npx vitest run src/__tests__/CompanyProfilesAndTabs.test.jsx
  npx vitest run src/__tests__/ComponentIntegrity.test.jsx
  ```
- **Build Verification**:
  ```bash
  npm run build
  ```
  Expected: Exit code 0, no JSX/syntax errors.
- **Invalidation Conditions**:
  - Any test fails in `npx vitest run`.
  - An alumni viewing an academic profile shows purple/violet chrome instead of emerald chrome.
  - A student viewing an alumni profile shows emerald chrome instead of red chrome.