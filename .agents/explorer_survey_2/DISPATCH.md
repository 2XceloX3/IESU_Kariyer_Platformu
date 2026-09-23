## 2026-09-22T16:10:00Z
You are Explorer 2 for the Beehive Architecture migration project.

Authoritative Request File:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\ORIGINAL_REQUEST.md
You MUST view and read ORIGINAL_REQUEST.md before starting work. Do NOT skip reading it.

Your Working Directory:
C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_survey_2

Your Role: Store & Data Explorer
Your Mission:
1. Thoroughly analyze `src/store/useAppStore.js`. Document its file size (bytes / KB), all state fields, getters, setters, and actions.
2. Investigate all usages of `useAppStore` across the codebase (`src/components/`, `src/utils/`, tests, etc.) using grep_search or file inspection.
3. Map out the exact decomposition required by R1, R2, and R8:
   - Shared Brain (`src/brain/useSharedStore.js`): posts, jobs, events, news, announcements, generalEvents, careerOpportunities.
   - Admin Brain (`src/brain/useAdminStore.js`): students, alumni, companies, academicStaff, surveys, siteConfig, auditLog, featureToggles, hiveErrors.
   - Isolated Hive Stores (`src/hives/*/store/useXxxStore.js`):
     * `useStudentStore`: activeView (default: 'feed'), previousView, activeTab, careerProgress, dailyQuestProgress, selectedJobId, setActiveView, goBack
     * `useAlumniStore`: activeView (default: 'feed'), previousView, activeTab, mentorMode, alumniCardActive, setActiveView, goBack
     * `useCompanyStore`: activeView (default: 'feed'), previousView, activeTab, atsBoard, activeJobListings, setActiveView, goBack
     * `useAcademicStore`: activeView (default: 'feed'), previousView, activeTab, researchMode, setActiveView, goBack
   - Reduced `useAppStore.js` (<12KB): strictly the 9 items specified in R8 (userRole, currentUser, authenticatedUserId, activeHive, previousHive, selectedUserId, selectedGroupId, logAction, activePortalBranch).
   - EventBus (`src/brain/eventBus.js`): emit, on, off, once, typed events.
4. Analyze how backward compatibility and cross-hive imports will be managed without breaking components.
5. Deliver a comprehensive, structured report to:
`C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_survey_2\report.md`
and write a completion handoff to:
`C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\explorer_survey_2\handoff.md`.
Notify orchestrator when done via send_message.
