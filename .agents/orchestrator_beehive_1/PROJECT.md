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
  - `App.jsx` reduced to <150 lines as a hive selector and overlay host.
  - `useAppStore.js` reduced to <12KB with 9 core session/routing fields, backed by a backward-compatibility delegation facade to ensure 100% test compatibility across all 40 test suites.

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | EventBus Cross-Hive Messaging | Pub/Sub with emit, on, off, once, typed events & EPM tracking | M1 | R1 | DONE |
| 2 | Shared Brain Store | Zustand store for read-shared posts, jobs, events, news, announcements | M1 | R1 | DONE |
| 3 | Admin Brain Store | Zustand store for students, alumni, companies, staff, surveys, siteConfig, auditLog, featureToggles, hiveErrors | M1 | R1 | DONE |
| 4 | Per-Hive Isolated Stores | 4 stores (student, alumni, company, academic) with activeView, previousView, setActiveView, goBack, and private state | M1 | R2 | DONE |
| 5 | Per-Hive Context Wrappers | 4 HiveContext.jsx with useHiveContext() providing color, accent, and identity tokens | M1 | R3 | DONE |
| 6 | Admin HiveHealthMonitor | Widget showing honeycomb cells, throughput, per-hive errors, mounted in OverviewPanel | M1 | R7 | DONE |
| 7 | Per-Hive Root Components | 4 XxxHive.jsx wrapping feeds AS-IS and handling internal routing via hive store | M2 | R4 | PLANNED |
| 8 | Cross-Hive Profile Theme Invariant | PublicUserProfile & UserProfile accept viewerHive and maintain viewer theme + context badge | M2 | R5 | PLANNED |
| 9 | App.jsx Simplification | App.jsx reduced to <150 lines with hive switching and global overlays | M2 | R6 | PLANNED |
| 10 | useAppStore Shrinkage | useAppStore reduced to <12KB with 9 core session fields + backward-compat facade | M2 | R8 | PLANNED |
| 11 | Comprehensive Vitest & E2E Validation | Verify all 40 test files pass, Vite build passes, adversarial coverage hardening | M3 | Acceptance Criteria | PLANNED |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Brain & Hive Foundation Layer | `src/brain/eventBus.js`, `src/brain/useSharedStore.js`, `src/brain/useAdminStore.js`, `src/hives/*/store/useXxxStore.js`, `src/hives/*/HiveContext.jsx`, `src/brain/HiveHealthMonitor.jsx`, `OverviewPanel.jsx` | Survey | DONE |
| M2 | Hive Roots, Profile Invariant & App/Store Modernization | `src/hives/*/XxxHive.jsx`, `PublicUserProfile.jsx`, `UserProfile.jsx`, `src/App.jsx` (<150 lines), `src/store/useAppStore.js` (<12KB) | M1 | PLANNED |
| M3 | Platform Acceptance Verification & Hardening | Full 40 test files (360 tests), Vite build, adversarial tests, forensic audit | M2 | PLANNED |

## Interface Contracts
### eventBus.js
- `emit(event, data)`: publishes event with data payload and increments throughput counter
- `on(event, handler)`: subscribes handler to event; returns unsubscribe function
- `off(event, handler)`: removes subscription
- `once(event, handler)`: subscribes handler for single execution
- `clear(options)`: clears listeners (optionally `keepSubscribers`), throughput log, event history
- `resetMetrics()`: resets metrics without clearing subscribers
- `getThroughput()`: returns events per minute (EPM)
- Typed events: `post:created`, `job:published`, `event:announced`, `application:status`, `announcement:broadcast`, `feature:toggled`, `user:connected`, `hive:error`

### useSharedStore.js
- Read-shared state: `posts`, `jobs`, `events`, `news`, `announcements`, `generalEvents`, `careerOpportunities`
- Actions: `setPosts`, `setJobs`, `setEvents`, `setNews`, `setAnnouncements`, `refreshScrapedData`, `reset()`
- Subscriptions: `initSharedStoreSubscriptions()`

### useAdminStore.js
- Admin CMS state: `students`, `alumni`, `companies`, `academicStaff`, `surveys`, `siteConfig`, `auditLog`, `featureToggles`, `hiveErrors`
- Actions: `setStudents`, `setAlumni`, `setCompanies`, `setAcademicStaff`, `setSurveys`, `setSiteConfig`, `logAuditAction`, `reportHiveError`, `reset()`
- Subscriptions: `initAdminStoreSubscriptions()`

### useHiveStore (student, alumni, company, academic)
- Common: `activeView` (default: `'feed'`), `previousView`, `activeTab`, `setActiveView(view)`, `goBack()`, `reset()`
- Private fields:
  - Student: `careerProgress`, `dailyQuestProgress`, `selectedJobId`
  - Alumni: `mentorMode`, `alumniCardActive`
  - Company: `atsBoard`, `activeJobListings`
  - Academic: `researchMode`

### HiveContext (useHiveContext)
- Student: `{ hiveColor: '#990000', hiveName: 'student', hiveAccent: 'red' }`
- Alumni: `{ hiveColor: '#059669', hiveName: 'alumni', hiveAccent: 'emerald' }`
- Company: `{ hiveColor: '#1e3a5f', hiveName: 'company', hiveAccent: 'blue' }`
- Academic: `{ hiveColor: '#7c3aed', hiveName: 'academic', hiveAccent: 'violet' }`
- Admin: `{ hiveColor: '#b45309', hiveName: 'admin', hiveAccent: 'amber' }`

### Cross-Hive Profile Viewing
- `viewerHive`: `'student' | 'alumni' | 'company' | 'academic' | 'admin'`
- Visual chrome styling (headers, buttons, badges) adheres strictly to `viewerHive`.
- Context badge: "You are viewing from [YourHive] portal".

## Code Layout
- Shared Brain: `src/brain/`
- Hive Modules: `src/hives/{student,alumni,company,academic}/`
  - Root: `XxxHive.jsx`
  - Theme: `HiveContext.jsx`
  - Store: `store/useXxxStore.js`
- Core Session Store: `src/store/useAppStore.js`
- Root App: `src/App.jsx`
- Profiles: `src/components/PublicUserProfile.jsx`, `src/components/UserProfile.jsx`
- Admin Monitor: `src/brain/HiveHealthMonitor.jsx` in `src/components/admin/OverviewPanel.jsx`
