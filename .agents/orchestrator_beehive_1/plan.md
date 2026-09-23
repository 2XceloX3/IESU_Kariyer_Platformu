# Implementation Plan: Beehive Architecture Migration

## Overview
Decomposed into 7 milestones:
- **Phase 0: Survey & Baselining** [DONE]
- **Milestone 1: Shared Brain Layer (R1)**
  - `src/brain/eventBus.js`
  - `src/brain/useSharedStore.js`
  - `src/brain/useAdminStore.js`
- **Milestone 2: Per-Hive Isolated Stores & Context Wrappers (R2, R3)**
  - Stores: `src/hives/{student,alumni,company,academic}/store/useXxxStore.js`
  - Contexts: `src/hives/{student,alumni,company,academic}/HiveContext.jsx`
- **Milestone 3: Per-Hive Root Components & Routing (R4)**
  - `StudentHive.jsx`, `AlumniHive.jsx`, `CompanyHive.jsx`, `AcademicHive.jsx`
  - Wrapping existing feeds AS-IS with `setView={setActiveView}`
- **Milestone 4: Cross-Hive Profile Viewing Theme Invariant (R5)**
  - `PublicUserProfile.jsx` and `UserProfile.jsx` with `viewerHive` prop
  - Theme follows viewer, context badge rendered
- **Milestone 5: Admin HiveHealthMonitor (R7)**
  - `src/brain/HiveHealthMonitor.jsx`
  - Mounted in `src/components/admin/OverviewPanel.jsx`
- **Milestone 6: App.jsx Simplification & useAppStore Shrinkage (R6, R8)**
  - `src/App.jsx` reduced to <150 lines
  - `src/store/useAppStore.js` reduced to <12KB with 9 core session fields + facade
- **Milestone 7: Full E2E & Vitest Verification (Acceptance Criteria)**
  - 40 test files (360 tests) pass
  - `npx vite build` exits 0
  - Zero cross-hive imports, zero useAppStore in hive stores
  - Challenger adversarial stress testing
  - Forensic integrity audit

## Execution Policy
Each milestone runs the standard cycle:
1. Dispatch Worker with explicit file ownership and instructions
2. Reviewers independently verify correctness and test suite
3. Challengers verify edge cases
4. Forensic Auditor verifies integrity (no hardcoded tricks, genuine logic)
5. Gate evaluation in GATE_STATUS.md
