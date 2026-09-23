## 2026-09-22T16:39:28Z

You are Worker M1-1 for Milestone 1: Brain & Hive Foundation Layer.

Authoritative Request File:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\ORIGINAL_REQUEST.md
Scope Document:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\orchestrator_beehive_1\PROJECT.md

Explorer Blueprints (READ ALL THREE):
1. Brain Layer Blueprint:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_m1_1\report.md
2. Hive Stores Blueprint:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_m1_2\report.md
3. Hive Contexts & HiveHealthMonitor Blueprint:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_m1_3\report.md

Your Working Directory:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\worker_m1_1

Your Exclusive Write Ownership:
- `src/brain/eventBus.js`
- `src/brain/useSharedStore.js`
- `src/brain/useAdminStore.js`
- `src/hives/student/store/useStudentStore.js`
- `src/hives/alumni/store/useAlumniStore.js`
- `src/hives/company/store/useCompanyStore.js`
- `src/hives/academic/store/useAcademicStore.js`
- `src/hives/student/HiveContext.jsx`
- `src/hives/alumni/HiveContext.jsx`
- `src/hives/company/HiveContext.jsx`
- `src/hives/academic/HiveContext.jsx`
- `src/brain/HiveHealthMonitor.jsx`
- `src/components/admin/OverviewPanel.jsx` (mount <HiveHealthMonitor /> beneath PanelHeader)
- `src/components/AdminDashboard.jsx` (sync OverviewPanel if needed)
- Optional unit test file if needed: `src/__tests__/BeehiveBrainAndHivesM1.test.jsx`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Core Implementation Rules:
1. `src/brain/eventBus.js`: Typed pub/sub (`emit`, `on`, `off`, `once`), event throughput counter (`getThroughput()` returning EPM), sliding 60s window, typed event catalog (`post:created`, `job:published`, `event:announced`, `application:status`, `announcement:broadcast`, `feature:toggled`, `user:connected`, `hive:error`, `audit:logged`).
2. `src/brain/useSharedStore.js`: Read-shared state (`posts`, `jobs`, `events`, `news`, `announcements`, `generalEvents`, `careerOpportunities`, scraper sync).
3. `src/brain/useAdminStore.js`: Admin CMS state (`students`, `alumni`, `companies`, `academicStaff`, `surveys`, `siteConfig`, `auditLog`, `featureToggles`, and `hiveErrors: { student: 0, alumni: 0, company: 0, academic: 0, admin: 0 }`).
4. Isolated Hive Stores: Each must manage `activeView` (default: `'feed'`), `previousView`, `activeTab`, `setActiveView(view)`, `goBack()`, and private fields as specified in R2.
   - ZERO direct cross-hive imports.
   - ZERO `useAppStore` imports inside any hive store file!
5. Hive Contexts: Provide the exact color and accent tokens specified in R3. Export `useHiveContext()` with safe fallback.
6. `HiveHealthMonitor.jsx`: 4 honeycomb cells, EPM throughput counter, per-hive error display, "All hives connected" green status, mounted beneath `PanelHeader` in `OverviewPanel.jsx`.
7. VERIFICATION: You MUST run `npx vitest run` to ensure all existing 40 test files (360 tests) pass, and `npx vite build` to ensure exit code 0.
8. Deliver handoff report with test/build outputs to:
`C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\worker_m1_1\handoff.md`.
Notify orchestrator when done via send_message.
