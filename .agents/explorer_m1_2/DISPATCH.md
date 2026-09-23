## 2026-09-22T16:22:17Z
You are Explorer M1-2 for Milestone 1: Brain & Hive Foundation Layer.

Authoritative Request File:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\ORIGINAL_REQUEST.md
Scope Document:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\orchestrator_beehive_1\PROJECT.md
Prior Survey Report:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_survey_2\report.md

Your Working Directory:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_m1_2

Your Mission:
Investigate and design the exact implementation specifications for the 4 Per-Hive Isolated Stores (Requirement R2):
1. `src/hives/student/store/useStudentStore.js`:
   - student-only state: `activeView` (default: `'feed'`), `previousView`, `activeTab` (default: `'feed'`), `careerProgress` (default: 0), `dailyQuestProgress` (default: 0), `selectedJobId` (default: null).
   - Actions: `setActiveView(view)`, `goBack()` (restores previousView), `setActiveTab(tab)`, `setCareerProgress`, `setDailyQuestProgress`, `setSelectedJobId`.
2. `src/hives/alumni/store/useAlumniStore.js`:
   - alumni-only state: `activeView` (default: `'feed'`), `previousView`, `activeTab` (default: `'feed'`), `mentorMode` (default: false), `alumniCardActive` (default: false).
   - Actions: `setActiveView(view)`, `goBack()`, `setActiveTab(tab)`, `setMentorMode`, `setAlumniCardActive`.
3. `src/hives/company/store/useCompanyStore.js`:
   - company-only state: `activeView` (default: `'feed'`), `previousView`, `activeTab` (default: `'feed'`), `atsBoard` (default: {}), `activeJobListings` (default: []).
   - Actions: `setActiveView(view)`, `goBack()`, `setActiveTab(tab)`, `setAtsBoard`, `setActiveJobListings`.
4. `src/hives/academic/store/useAcademicStore.js`:
   - academic-only state: `activeView` (default: `'feed'`), `previousView`, `activeTab` (default: `'feed'`), `researchMode` (default: false).
   - Actions: `setActiveView(view)`, `goBack()`, `setActiveTab(tab)`, `setResearchMode`.

CRITICAL INVARIANTS:
- No direct cross-hive imports (student store must NOT import alumni store, etc.).
- `useAppStore` is NOT imported inside ANY hive store file.
- Zustand store creation (`create` from `'zustand'`).

Deliver your detailed blueprint to:
`C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_m1_2\report.md`
and write a completion handoff to:
`C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_m1_2\handoff.md`.
Notify orchestrator when done via send_message.
