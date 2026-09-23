# Project: İESÜ Career & Alumni Ecosystem Platform — Beehive Architecture Migration

## Architecture
Migration from monolithic architecture (46KB single store, 684-line App.jsx, shared global state) to fully isolated "Beehive" (Arı Kovanı) architecture:
- **Shared Brain Layer** (`src/brain/`):
  - `eventBus.js`: Pub/Sub event broker for cross-hive asynchronous messaging with typed events, throughput tracking (EPM), error boundaries, and safe metrics reset.
  - `useSharedStore.js`: Read-shared public/platform state (posts, jobs, events, news, announcements, generalEvents, careerOpportunities, scraper sync) with `initSharedStoreSubscriptions()` and `reset()`.
  - `useAdminStore.js`: Admin CMS single source of truth (students, alumni, companies, academicStaff, surveys, siteConfig, auditLog, featureToggles, hiveErrors) with `initAdminStoreSubscriptions()` and `reset()`.
- **Per-Hive Isolated Cells** (`src/hives/{student,alumni,company,academic}/`):
  - Each hive cell possesses its own isolated Zustand store (`useXxxStore.js`), its own React Context theme provider (`HiveContext.jsx`), and its own Root Component (`XxxHive.jsx`).
  - Zero direct cross-hive imports allowed. Zero `useAppStore` imports allowed in hive stores.
  - Existing large feed components (`StudentFeed`, `AlumniFeed`, `CompanyFeed`, `AcademicStaffFeed`) remain AS-IS wrapped inside each Hive root.
- **Critical Theme Invariant**:
  - Theme follows the VIEWER, never the content subject.
  - Student: `#990000` (Red-50, Red-200)
  - Alumni: `#059669` (Emerald-50, Emerald-200)
  - Academic: `#7c3aed` (Violet-50, Violet-200)
  - Company: `#1e3a5f` (Blue-50, Blue-200)
  - Admin: `#b45309` (Amber-50, Amber-200)
- **App.jsx & useAppStore Optimization**:
  - `App.jsx` reduced to 143 lines (< 150 lines) as an authentic hive selector and overlay host.
  - `useAppStore.js` reduced to 11,557 bytes (< 12KB) with 9 core session/routing fields, backed by a backward-compatibility delegation facade with memoized proxy snapshots.

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | EventBus Cross-Hive Messaging | Pub/Sub with emit, on, off, once, typed events & EPM tracking | M1 | R1 | DONE |
| 2 | Shared Brain Store | Zustand store for read-shared posts, jobs, events, news, announcements | M1 | R1 | DONE |
| 3 | Admin Brain Store | Zustand store for students, alumni, companies, staff, surveys, siteConfig, auditLog, featureToggles, hiveErrors | M1 | R1 | DONE |
| 4 | Per-Hive Isolated Stores | 4 stores (student, alumni, company, academic) with activeView, previousView, setActiveView, goBack, and private state | M1 | R2 | DONE |
| 5 | Per-Hive Context Wrappers | 4 HiveContext.jsx with useHiveContext() providing color, accent, and identity tokens | M1 | R3 | DONE |
| 6 | Admin HiveHealthMonitor | Widget showing honeycomb cells, throughput, per-hive errors, mounted in OverviewPanel | M1 | R7 | DONE |
| 7 | Per-Hive Root Components | 4 XxxHive.jsx wrapping feeds AS-IS and handling internal routing via hive store | M2 | R4 | DONE |
| 8 | Cross-Hive Profile Theme Invariant | PublicUserProfile & UserProfile accept viewerHive and maintain viewer theme + context badge | M2 | R5 | DONE |
| 9 | App.jsx Simplification | App.jsx reduced to 143 lines (<150L) with hive switching and global overlays | M2 | R6 | DONE |
| 10 | useAppStore Shrinkage | useAppStore reduced to 11,557 bytes (<12KB) with 9 core session fields + backward-compat facade | M2 | R8 | DONE |
| 11 | Comprehensive Vitest & E2E Validation | Verified 44 test suites, clean production build (119 chunks), boundary integrity, hardening | M3 | Acceptance Criteria | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Brain & Hive Foundation Layer | `src/brain/eventBus.js`, `src/brain/useSharedStore.js`, `src/brain/useAdminStore.js`, `src/hives/*/store/useXxxStore.js`, `src/hives/*/HiveContext.jsx`, `src/brain/HiveHealthMonitor.jsx`, `OverviewPanel.jsx` | Survey | DONE |
| M2 | Hive Roots, Profile Invariant & App/Store Modernization | `src/hives/*/XxxHive.jsx`, `PublicUserProfile.jsx`, `UserProfile.jsx`, `src/App.jsx` (<150 lines), `src/store/useAppStore.js` (<12KB) | M1 | DONE |
| M3 | Platform Acceptance Verification & Hardening | Full 44 test files, Vite build (119 assets), boundary isolation, forensic audit CLEAN | M2 | DONE |
