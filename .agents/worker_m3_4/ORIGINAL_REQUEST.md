## 2026-07-24T00:29:37Z
You are Worker 4 for IESU Kariyer Platformu.
Working directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\worker_m3_4
Workspace root: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu

Your mission is to fix all failing test cases in the test suite so that `npm test` achieves 100% PASS (111/111 tests passing across all 11 test files), alongside passing `npm run build` and `npx oxlint src/`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or delete test cases. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Context of Failures:
When running `cmd /c npm test`, 5 test files fail (10 test cases fail out of 111):
1. `src/__tests__/AdminDashboard.test.jsx`
2. `src/__tests__/App.test.jsx`
3. `src/__tests__/CareerNetwork.test.jsx`
4. `src/__tests__/ClubsDirectory.test.jsx`
5. `src/__tests__/MessagingInterface.test.jsx`

Example failure details:
- `MessagingInterface.test.jsx`: Unable to find an element with text 'Contact 1' because mock contacts/users were updated with real/standard names in mock data.
- `ClubsDirectory.test.jsx`: Club names or categories updated in mock data vs old test expectations.
- `AdminDashboard.test.jsx`: Stat labels or mock data expectations shifted.
- `App.test.jsx`: Navigation/rendering text assertions shifted due to updated real university content in `innerPagesData.js` / `universityData.js`.
- `CareerNetwork.test.jsx`: Mock network connections / user roles shifted (`company` vs `employer`, etc.).

Instructions for Worker 4:
1. Inspect the 5 failing test files in `src/__tests__/` and run `cmd /c npm test` to see exact error outputs for each of the 10 failing test cases.
2. Update the test assertions or component props/mock data references in `src/__tests__/` (and components if needed) to accurately match the updated mock data structure (`mockData.js`, `innerPagesData.js`, `universityData.js`, `liveData.js`).
3. Ensure NO test cases are deleted or disabled (e.g. do not use `.skip` or remove tests). All 111 tests must run and pass genuinely.
4. Run verification commands:
   - `cmd /c npm test` (Must pass 111/111 tests across all 11 test files).
   - `cmd /c npx oxlint src/` (Must pass with 0 errors).
   - `cmd /c npm run build` (Must build cleanly with exit code 0).
5. Document all changes in `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\worker_m3_4\handoff.md` detailing observations, logic chain, caveats, conclusion, and verification method. Update `progress.md`.
6. Send a message to orchestrator with your results.
