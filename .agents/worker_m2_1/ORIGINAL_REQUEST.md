## 2026-07-23T21:03:49Z
<USER_REQUEST>
You are Worker 1 (Mock Data Integrator & Bug Fixer) for IESU Kariyer Platformu.
Working directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\worker_m2_1
Workspace root: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu

Objective: Implement data integration of Esenyurt University Kariyer Geliştirme Ofisi real data into `src/utils/` mock data files and fix build/test encoding errors.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Instructions & Task Breakdown:
1. Initialize your working directory .agents/worker_m2_1/ with BRIEFING.md and progress.md.
2. Read the following reference reports carefully:
   - C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\explorer_m1_1\extracted_web_data.md
   - C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\explorer_m1_2\schema_analysis.md
   - C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\explorer_m1_3\mapping_blueprint.md
3. Update `src/utils/universityData.js`:
   - Replace legacy data with İstanbul Esenyurt Üniversitesi (IESU) faculties, high schools, and vocational schools.
   - Standardize master exports to `IESU_FACULTIES`, `IESU_YUKSEKOKUL`, `IESU_MYO`, `IESU_ENSTITU`.
   - Provide backward-compatible alias re-exports (`export const IGU_FACULTIES = IESU_FACULTIES;`, etc.).
4. Update `src/utils/innerPagesData.js`:
   - Populate `hakkimizda`, `hizmetlerimiz`, `ulusal_staj`, `akran_mentor`, `isbirlikleri`, `arastirma` with extracted verbatim vision, mission, leadership (Öğr. Gör. Mutlu Gülsev YAĞIZ, Zuhal ŞAHİN), contact details, staj forms, and regulations. Ensure clean UTF-8 text throughout.
5. Update `src/utils/mockData.js`:
   - Fix `generateCompanies()`: change `role: 'employer'` to `role: 'company'` to match component route/permission checks.
   - Replace placeholder news/events/announcements in `initialNews`, `initialEvents`, `initialAnnouncements` with real Esenyurt University items.
   - Complete missing fields in `initialSemCourses` (`instructor`, `quota`, `enrolled`).
   - Ensure clean UTF-8 encoding across all student, alumnus, faculty, and company generators.
6. Update `src/utils/liveData.js`:
   - Update live slider, news, and announcement objects with Esenyurt University content and clean UTF-8 text.
7. Update `src/utils/feedCombiner.js`:
   - Fix date sorting bug on lines 79-82: make date parsing robust against Turkish string dates (`"03 Aralık 2025 Çarşamba"`, `"Tarih belirtilmemiş"`) so `Array.prototype.sort()` never processes `NaN` values.
8. Fix UTF-8 encoding in `src/components/StudentAnalytics.jsx`:
   - Line 64: Change corrupted `GÃ¶rÃ¼ntÃ¼lenme` to `Görüntülenme` to resolve the Vite build crash.
9. Verification:
   - Run `npm run build` using run_command to verify the build succeeds with exit code 0.
   - Run `npm test` using run_command to verify all unit tests pass.
10. Deliverables:
    - Save detailed implementation log in .agents/worker_m2_1/changes.md.
    - Write handoff report in .agents/worker_m2_1/handoff.md detailing code changes, build results, and test pass evidence.
    - Send message to orchestrator with status and handoff report path.
</USER_REQUEST>
