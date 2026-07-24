# Explorer 2 Handoff Report — Codebase Schema Analysis

**Agent**: Explorer 2 (Codebase Schema Analyst)  
**Recipient**: Orchestrator (`81511386-c04c-443b-93a3-7378ca43454f`)  
**Date**: 2026-07-24  
**Working Directory**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\explorer_m1_2`  
**Workspace Root**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu`

---

## 1. Observation

1. **Mock Data Files Analyzed**:
   - `src/utils/mockData.js` (511 lines): Exports `generateStudents`, `generateAlumni`, `generateCompanies`, `generateAcademicStaff`, `initialNews` (10 items), `initialEvents` (9 items), `initialAnnouncements` (12 items), `initialSemCourses` (5 items), `initialJobs` (5 items), `initialFeatured` (5 items), `initialGroups` (2 items), `initialSurveys` (2 items), `initialPosts` (4 items), `initialAcademicCatalog` (hierarchical unit tree), and empty array exports (`initialMentorships`, `initialVoluntaryInternships`, `initialAcademicApprovals`, `initialInternships`, `academicStaff`).
   - `src/utils/innerPagesData.js` (123 lines): Exports static content dictionary `innerPagesData` (`hakkimizda`, `hizmetlerimiz`, `ulusal_staj`, `akran_mentor`, `isbirlikleri`, `arastirma`).
   - `src/utils/universityData.js` (140 lines): Master lists `IGU_FACULTIES`, `IGU_YUKSEKOKUL`, `IGU_MYO`, `IGU_ENSTITU` and accessors `getAllDepartments()`, `getAllFacultyNames()`, `getDepartmentsByFaculty()`.
   - `src/utils/liveData.js` (174 lines): Exports `liveSliderData`, `liveNewsData`, `liveAnnouncementsData`, `liveStatsData`, `kariyerEventImages`.
   - `src/utils/feedCombiner.js` (86 lines): Exports `combineFeedItems()` normalizing social posts, events, news, announcements, and job postings.
   - `src/utils/export.js` (36 lines): Exports `exportToCSV()`.
   - `src/utils/integrationService.js` (99 lines): Async proxy methods `fetchStudentFromOBS`, `verifyEDevlet`, `syncAlumniData`.
   - `src/data/mockAdminData.js` (56 lines): Legacy seed data (`STUDENTS`, `SURVEYS_INIT`, `SEM_INIT`, `EVENTS_INIT`, `ORG`).
   - `src/data/AIEngine.js` (793 lines): `AI_KNOWLEDGE_ARCHIVE` knowledge base and AI search engine algorithms.
   - `src/store/useAppStore.js` (505 lines): Zustand central store hydrating initial state from `mockData.js` and managing local persistence.

2. **Schema Inconsistencies & Property Mismatches Identified**:
   - **Company Role Mismatch**: `generateCompanies()` sets `role: 'employer'`, while `App.jsx`, `CompanyFeed.jsx`, and `TopProfileMenu.jsx` check `userRole === 'company'` or `role === 'company'`.
   - **Department Property Name Mismatch**: `mockData.js` uses `department`, whereas `mockAdminData.js` uses `dept`.
   - **Image Key Variation**: `mockData.js` / `liveNewsData` use `imageUrl`, `liveSliderData` uses `image`, and `kariyerEventImages` uses `url`.
   - **Course Schema Incompleteness**: `initialSemCourses` in `mockData.js` lacks `instructor`, `quota`, and `enrolled` fields which are present in `mockAdminData.js` (`SEM_INIT`).
   - **Date Sorting Failure in Feed Combiner**: `combineFeedItems` (lines 79-82) attempts `new Date(a.createdAt || a.timestamp || 0).getTime()`. News items (`"03 Aralık 2025 Çarşamba"`) and events (`"Tarih belirtilmemiş"`) yield `NaN`, causing array sort corruption.

---

## 2. Logic Chain

1. **Observation**: `generateCompanies()` in `mockData.js:24-27` defines company objects with `role: 'employer'`.
2. **Observation**: `App.jsx:272` checks `userRole !== 'admin'` and redirects based on `userRole === 'company'`. `CompanyFeed.jsx` checks `currentUser.role === 'company'`.
3. **Deduction**: A user logged in with `role: 'employer'` from `generateCompanies()` will fail role checks expecting `'company'`, leading to unintended route redirects or blank feed displays.
4. **Observation**: `feedCombiner.js` normalizes items from `posts`, `events`, `news`, `announcements`, `jobs`.
5. **Observation**: News and event dates in `mockData.js` are formatted as human-readable Turkish strings (`"03 Aralık 2025 Çarşamba"`, `"Tarih belirtilmemiş"`).
6. **Deduction**: `new Date("Tarih belirtilmemiş").getTime()` returns `NaN`. Performing `NaN - NaN` in `Array.prototype.sort()` returns indeterminate results, producing broken post order in `StudentFeed.jsx` and `ExploreFeed.jsx`.

---

## 3. Caveats

- **No Source Code Changes Made**: In compliance with the Explorer archetype, no source files under `src/` were edited.
- **Uninvestigated Runtime States**: Backend API proxy responses in `integrationService.js` were analyzed structurally, but actual network behavior depends on runtime environment variables (`VITE_INTERNAL_API_URL`).

---

## 4. Conclusion

The mock data layer is rich and detailed, but exhibits critical schema mismatches and data parsing vulnerabilities:
1. **High Risk**: Role string mismatch (`employer` vs `company`) and date sort `NaN` corruption in `feedCombiner.js`.
2. **Medium Risk**: Missing property fields (`instructor`, `quota`, `enrolled` in `initialSemCourses`), property key alias fragmentation (`imageUrl` vs `image` vs `url`), and empty seed array lookups.
3. **Actionable Deliverable**: Detailed schema analysis and remediation guidance written to `.agents/explorer_m1_2/schema_analysis.md`.

---

## 5. Verification Method

To independently verify these findings:
1. Inspect `.agents/explorer_m1_2/schema_analysis.md` for full schema specifications.
2. Check `src/utils/mockData.js:24-27` vs `src/App.jsx:272` to confirm the `employer` vs `company` mismatch.
3. Check `src/utils/feedCombiner.js:79-82` vs `src/utils/mockData.js:49,134` to verify `new Date()` evaluation on Turkish date strings.
4. Execute `npm test` or `npx vite build` to check build consistency.
