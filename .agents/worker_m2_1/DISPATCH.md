## 2026-09-22T19:49:21Z

You are worker_m2_1, a teamwork_preview_worker subagent.
Your Working Directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\worker_m2_1
Project Directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You MUST read the following authoritative requirement and context files before starting:
- C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\ORIGINAL_REQUEST.md
- C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\orchestrator_beehive_1\PROJECT.md
- C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\orchestrator_beehive_1\handoff.md

TASK OBJECTIVE: Complete Milestone 2 Remaining Implementations:
1. R6: Simplify `src/App.jsx` to UNDER 150 lines (currently ~684 lines).
   - Read the existing `src/App.jsx` and the 4 Hive components in `src/hives/*/XxxHive.jsx` to understand what views they host.
   - Keep in App.jsx only:
     - Auth state (currentUser, isAdmin)
     - `activeHive` derived from currentUser.role
     - Hive switching rendering the appropriate Hive component:
       - `student` -> `StudentHive`
       - `alumni` -> `AlumniHive`
       - `company` -> `CompanyHive`
       - `academic` -> `AcademicHive`
       - `admin` or isAdmin -> `AdminDashboard`
     - Global overlays: CommandPalette, FloatingChatWidget, PWAInstallPrompt, NotificationEngine, ToastContainer
     - LandingPage, LoginModal/Login, RegisterModal/Register routes for unauthenticated users
     - Pass `currentUser` prop to the rendered Hive component.
   - Verify line count of `src/App.jsx` is strictly < 150 lines.

2. R8: Shrink `src/store/useAppStore.js` to UNDER 12KB (currently ~46KB).
   - Check current file size of `src/store/useAppStore.js`.
   - Core Zustand state in useAppStore must strictly maintain the 9 session/routing fields:
     - userRole, setUserRole
     - currentUser, setCurrentUser
     - authenticatedUserId, setAuthenticatedUserId
     - activeHive, setActiveHive
     - previousHive, setPreviousHive
     - selectedUserId, setSelectedUserId
     - selectedGroupId, setSelectedGroupId
     - logAction (audit logger — emits audit event or writes to useAdminStore via eventBus)
     - activePortalBranch, setActivePortalBranch
   - Backward-compatibility facade:
     - To ensure 100% test compatibility across all 40+ vitest test suites that import `useAppStore`, delegate legacy getters/setters/state to `useSharedStore` (for posts, jobs, events, announcements, scrapedData) and `useAdminStore` (for students, alumni, companies, academicStaff, surveys, siteConfig, auditLog, featureToggles, hiveErrors).
     - Ensure `useAppStore.getState()` and hook selectors return the expected delegating properties so tests don't break.
     - The file size of `src/store/useAppStore.js` MUST be strictly under 12,288 bytes (12KB).

3. Validation & Testing:
   - Run `npx vitest run` and confirm all 40+ test suites pass without regressions.
   - Run `npx vite build` and confirm exit code 0 with clean bundle generation.
   - Check file size of `useAppStore.js` (< 12KB) and line count of `App.jsx` (< 150 lines).
   - Document any fixes needed in test files or facade if subtle mocks require specific behavior.

4. Handoff:
   - Write your complete handoff report to `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\worker_m2_1\handoff.md`.
   - Report line counts, file sizes, vitest test count and results, and build results.
   - Send completion message to parent.
