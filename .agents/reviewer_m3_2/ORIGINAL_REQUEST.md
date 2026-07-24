## 2026-07-24T00:07:29Z
You are Reviewer 2 (Build & Test Verification Reviewer) for IESU Kariyer Platformu.
Working directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\reviewer_m3_2
Workspace root: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu

Objective: Independently execute and verify build and unit test suites across the application.

Instructions:
1. Initialize your working directory .agents/reviewer_m3_2/ with BRIEFING.md and progress.md.
2. Execute `npm run build` using run_command and verify exit code 0 and dist output.
3. Execute `npm test` using run_command and verify all test files and individual tests pass.
4. Execute `npx oxlint src/` using run_command to check for code quality and syntax errors.
5. Write your review report at .agents/reviewer_m3_2/handoff.md.
6. Send a message to orchestrator with your verdict (PASS/FAIL) and report path.
