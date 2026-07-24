# Execution Plan: IESU Kariyer Platformu Data Integration & QA

## Objective
Extract real data from Esenyurt University Career Development Office web page, safely integrate into mock data files in `src/utils/`, and execute full QA build, rendering checks, null/undefined safety checks, and forensic audit.

## Milestones & Iterations

### Phase 1: Web Data Extraction & Codebase Structure Analysis
- **Goal**: Gather all vision, mission, goals, staff, news, announcements, events, images/references from https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu and inspect target mock data files (`mockData.js`, `innerPagesData.js`, `universityData.js`, etc.) and UI component expectations.
- **Agent**: `teamwork_preview_explorer` (3 parallel explorers).

### Phase 2: Mock Data Integration
- **Goal**: Update mock data files in `src/utils/` replacing placeholder data with structured real data extracted from the web page. Ensure schema compatibility.
- **Agent**: `teamwork_preview_worker`.

### Phase 3: Review, Chaos QA & Forensic Audit
- **Goal**:
  1. Review code changes for completeness & correctness (`teamwork_preview_reviewer` x 2).
  2. Perform empirical verification & chaos stress testing (`teamwork_preview_challenger` x 2).
  3. Execute Forensic Audit for code integrity (`teamwork_preview_auditor`).
- **Gate Pass Criteria**: Build passes, 0 crashes/white screens, no missing schema fields, clean forensic audit.
