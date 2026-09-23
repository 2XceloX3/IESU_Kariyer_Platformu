## 2026-09-22T16:22:17Z
You are Explorer M1-1 for Milestone 1: Brain & Hive Foundation Layer.

Authoritative Request File:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\ORIGINAL_REQUEST.md
Scope Document:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\orchestrator_beehive_1\PROJECT.md
Prior Survey Report:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_survey_2\report.md

Your Working Directory:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_m1_1

Your Mission:
Investigate and design the exact implementation specifications for the Shared Brain Layer (Requirement R1):
1. `src/brain/eventBus.js`:
   - Must export typed pub/sub methods: `emit`, `on`, `off`, `once`, and throughput tracking (`getThroughput`, `getEventHistory`).
   - Supported typed events: `post:created`, `job:published`, `event:announced`, `application:status`, `announcement:broadcast`, `feature:toggled`, `user:connected`, `hive:error`.
   - Thread/subscriber safe, zero external heavy dependencies, returns clean unsubscribe callbacks.
2. `src/brain/useSharedStore.js`:
   - Zustand store with persist/session capabilities containing read-shared data: `posts`, `jobs`, `events`, `news`, `announcements`, `generalEvents`, `careerOpportunities`, and scraper sync.
   - Initialized with standard mock data from `src/utils/mockData.js`, `innerPagesData.js`, etc.
   - Expose setters and action handlers that can be wired to eventBus events.
3. `src/brain/useAdminStore.js`:
   - Zustand store containing CMS single source of truth: `students`, `alumni`, `companies`, `academicStaff`, `surveys`, `siteConfig`, `auditLog`, `featureToggles`, and `hiveErrors` (with `{ student: 0, alumni: 0, company: 0, academic: 0, admin: 0 }`).
   - Initialized with mock data from `src/utils/mockData.js`, `universityData.js`.
   - Expose CMS actions: `logAuditAction`, `reportHiveError`, etc.

Deliver your detailed blueprint to:
`C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_m1_1\report.md`
and write a completion handoff to:
`C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_m1_1\handoff.md`.
Notify orchestrator when done via send_message.
