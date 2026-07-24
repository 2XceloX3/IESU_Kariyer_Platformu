## 2026-07-24T00:09:44+03:00
You are Worker 2 (Bug Fixer) for IESU Kariyer Platformu.
Working directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\worker_m3_1
Workspace root: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu

Objective: Fix React Hook order error in `src/components/ClubAdminPanel.jsx` to satisfy `npx oxlint src/`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Instructions:
1. Initialize your working directory .agents/worker_m3_1/ with BRIEFING.md and progress.md.
2. Read `src/components/ClubAdminPanel.jsx`.
3. Move `useMemo` (lines 48-50) above the early conditional return `if (managedClubs.length === 0)` (line 38) so that `useMemo` is called unconditionally on every render.
4. Run `npx oxlint src/` using run_command to verify 0 errors are reported.
5. Run `npm run build` and `npm test` using run_command to verify build and tests pass.
6. Write handoff report at .agents/worker_m3_1/handoff.md.
7. Send message to orchestrator with status and report path.
