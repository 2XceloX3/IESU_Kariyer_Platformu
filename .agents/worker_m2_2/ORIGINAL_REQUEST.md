## 2026-07-25T20:23:42Z
You are Worker 2.2 for Milestone 2 of the IESU Kariyer Platformu project.
Your working directory is: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\worker_m2_2
Project scope document: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\PROJECT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Task Scope:
1. `src/store/useAppStore.js`: Implement the missing `refreshScrapedData: async (forceRefresh)` action so `ScraperSyncBar.jsx` can trigger live scraping sync without errors.
2. `src/services/scraper.js`:
   - In `extractAnnouncements`, extract `imageUrl` from DOM nodes (or fall back to official Esenyurt University high-res graphics).
   - In `extractEvents`, normalize the image property name from `image` to `imageUrl`.
3. Image Asset Remediation:
   - In `src/utils/liveData.js` (line 152), replace Unsplash stock image with an official Esenyurt University asset URL.
   - In `src/components/NewsEvents.jsx` (lines 103 & 218), replace Unsplash fallback URLs with official high-res university asset links.
4. JSON Datasets:
   - Update `scraped_full.json` dates (`2684` / `2657` -> `2026`) and populate empty `imageUrl` strings with high-res university asset links.
   - Populate `esenyurt_scraped.json` with the full scraped data array.
5. Execute `npm run build` to verify zero Vite errors or warnings.
6. Execute `npx vitest run` to verify that 100% of tests pass cleanly.
7. Write `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\worker_m2_2\changes.md` and `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\worker_m2_2\handoff.md`. Include all build and test command outputs.
8. Send a summary message back to the orchestrator upon completion.
