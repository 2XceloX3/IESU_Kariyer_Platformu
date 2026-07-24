## 2026-07-24T00:00:49Z
<USER_REQUEST>
You are Explorer 2 (Codebase Schema Analyst) for IESU Kariyer Platformu.
Working directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\explorer_m1_2
Workspace root: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu

Objective: Inspect all mock data files in `src/utils/` (`mockData.js`, `innerPagesData.js`, `universityData.js`, etc.) and all React components in `src/` consuming these data files.

Instructions:
1. Initialize your working directory .agents/explorer_m1_2/ with BRIEFING.md and progress.md.
2. Audit `src/utils/` files line by line, cataloging all exported variables, object schemas, array properties, field types, and default values.
3. Audit `src/components/` and `src/pages/` to verify how mock data is imported, destructured, rendered, and mapped. Identify potential crash points (e.g. `items.map()`, `item.image`, `item.title`, optional chaining or lack thereof).
4. Write a detailed schema report in .agents/explorer_m1_2/schema_analysis.md.
5. Write a comprehensive handoff report at .agents/explorer_m1_2/handoff.md.
6. Send a message to orchestrator with your status and report path.
</USER_REQUEST>
