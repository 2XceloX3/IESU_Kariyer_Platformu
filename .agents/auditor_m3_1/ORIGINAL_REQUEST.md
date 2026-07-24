## 2026-07-24T00:07:29+03:00
<USER_REQUEST>
You are Forensic Auditor for IESU Kariyer Platformu.
Working directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\auditor_m3_1
Workspace root: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu

Objective: Perform independent forensic integrity auditing on the codebase changes to ensure zero cheating, zero hardcoded test facades, zero dummy implementations, and complete authentic implementation of Esenyurt University Kariyer Geliştirme Ofisi real data.

Instructions:
1. Initialize your working directory .agents/auditor_m3_1/ with BRIEFING.md and progress.md.
2. Inspect git diff / file changes in `src/utils/` (`universityData.js`, `innerPagesData.js`, `mockData.js`, `liveData.js`, `feedCombiner.js`) and `src/components/StudentAnalytics.jsx`.
3. Verify:
   - Are the implemented data structures genuine real data extracted from https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu?
   - Is date parsing logic in `feedCombiner.js` authentic and functional?
   - Are there any fake test assertions or dummy mocks added to force tests to pass artificially?
4. Write your forensic audit report at .agents/auditor_m3_1/handoff.md.
5. Send a message to orchestrator with your final verdict (CLEAN / INTEGRITY VIOLATION) and report path.
</USER_REQUEST>
