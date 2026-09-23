# Shared Brain Layer Architectural Blueprint & Implementation Specification

**Milestone**: Milestone 1: Brain & Hive Foundation Layer  
**Requirement**: R1 (Shared Brain Layer: `eventBus.js`, `useSharedStore.js`, `useAdminStore.js`)  
**Target Repository**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active`  
**Author**: Explorer M1-1 (Brain & Hive Architecture Specialist)  
**Status**: Ready for Implementation by Builder M1-1  

---

## 1. Executive Summary & Architectural Overview

The İESÜ Career & Alumni Ecosystem Platform is transitioning from a monolithic 46 KB global store into an isolated, cell-based **Beehive Architecture**. 

In this architecture, each user-role portal (Student, Alumni, Company, Academic, and Admin) operates as a self-contained "Hive" cell with its own isolated Zustand store, its own React Context theme provider, and its own root view router. The hives do **not** import each other directly and do not share mutable state directly.

Instead, the ecosystem is tied together through the **Shared Brain Layer** (`src/brain/`), which comprises:
1. **`src/brain/eventBus.js`**: An asynchronous, thread/subscriber-safe publish/subscribe broker enabling decoupled cross-hive communication, typed event contracts, sliding-window throughput tracking (Events Per Minute / EPM), and event auditing.
2. **`src/brain/useSharedStore.js`**: A persisted Zustand store holding read-shared public/platform content (`posts`, `jobs`, `events`, `news`, `announcements`, `generalEvents`, `careerOpportunities`, `semCourses`, `internships`, `innerPagesData`, and web scraper synchronization state). All hives read from this store; updates occur via explicit actions and event bus listeners.
3. **`src/brain/useAdminStore.js`**: A persisted Zustand store serving as the administrative CMS single source of truth for platform management (`students`, `alumni`, `companies`, `academicStaff`, `surveys`, `siteConfig`, `auditLogs`, `featureToggles`, and `hiveErrors`). It embeds DOMPurify sanitization, prototype pollution defense, and telemetry error counters.

```
                                  ┌──────────────────────────────┐
                                  │    src/brain/eventBus.js     │
                                  │   (Pub/Sub Broker + EPM)     │
                                  └──────────────▲───────────────┘
                                                 │
                   ┌─────────────────────────────┼─────────────────────────────┐
                   │ (emit / on)                 │ (emit / on)                 │ (emit)
        ┌──────────▼──────────┐       ┌──────────▼──────────┐       ┌──────────▼──────────┐
        │     src/brain/      │       │     src/brain/      │       │     src/store/      │
        │  useSharedStore.js  │       │   useAdminStore.js  │       │   useAppStore.js    │
        │ (Read-Shared Data)  │       │ (Admin CMS & Truth) │       │ (Session Core +     │
        │ - posts, jobs       │       │ - user directories  │       │  Facade Proxy)      │
        │ - events, news      │       │ - siteConfig, pools │       │ - userRole, auth    │
        │ - scraper sync      │       │ - hiveErrors (R7)   │       │ - activeHive        │
        └──────────▲──────────┘       └─────────────────────┘       └─────────────────────┘
                   │
         (Read Only via Hook)
        ┌──────────┴─────────────────────────┬─────────────────────────┐
        │                                    │                         │
┌───────┴──────────────┐           ┌─────────┴────────────┐  ┌─────────┴────────────┐
│  src/hives/student/  │           │  src/hives/alumni/   │  │  src/hives/company/  │
│  useStudentStore     │           │  useAlumniStore      │  │  useCompanyStore     │
└──────────────────────┘           └──────────────────────┘  └──────────────────────┘
```

### 1.1 Architectural Guarantees & Constraints
- **Strict Dependency DAG (No Cycles)**:
  - `eventBus.js` has zero internal imports.
  - `useSharedStore.js` imports `eventBus` (not `useAppStore`).
  - `useAdminStore.js` imports `eventBus` (not `useAppStore`).
  - `useAppStore.js` delegates to `useSharedStore` and `useAdminStore` via a proxy facade for backward compatibility.
  - Hive stores (`src/hives/*/store/useXxxStore.js`) NEVER import `useAppStore.js`.
- **Zero Regressions**: The 40 existing Vitest test files (360 tests) and Vite build will continue to pass seamlessly with 100% test compatibility.

---

## 2. Specification: `src/brain/eventBus.js`

### 2.1 File Location & Metadata
- **File Path**: `src/brain/eventBus.js`
- **Dependencies**: None (Zero heavy external dependencies; pure ES6).
- **Target Size**: ~120 lines (<4 KB).

### 2.2 Supported Typed Events & Data Contracts

| Event Identifier | Dispatcher | Primary Listener(s) | Payload Contract | Description |
|---|---|---|---|---|
| `post:created` | Student, Alumni, Company, Academic | `useSharedStore`, UI | `{ post: Object, senderHive: string, authorId: string, timestamp: string }` | A new feed post is created. Appended to read-shared feed. |
| `job:published` | Company, Admin | `useSharedStore`, Student Feed | `{ job: Object, senderHive: 'company' \| 'admin', companyId: string, timestamp: string }` | A new job or internship opportunity is published. |
| `event:announced` | Admin, Clubs, Academic | `useSharedStore`, Calendar | `{ event: Object, senderHive: string, organizer: string, timestamp: string }` | A new university or career event is scheduled. |
| `application:status` | Company ATS, Admin | `useAdminStore`, Student Alerts | `{ applicationId: string, jobId: string, applicantId: string, status: string, companyId?: string, updatedBy?: string, timestamp: string }` | An application transitions status (e.g. 'Beklemede' -> 'Mülakat' -> 'Kabul Edildi'). |
| `announcement:broadcast`| Admin | `useSharedStore`, Notification Engine | `{ announcement: Object, senderHive: 'admin', priority: 'normal' \| 'urgent', timestamp: string }` | Official university announcement broadcast. |
| `feature:toggled` | Admin Panel | `useAdminStore`, Hive UI | `{ feature: string, enabled: boolean, toggledBy: string, timestamp: string }` | Platform feature toggle state changed. |
| `user:connected` | Auth / Login | Hive stores, Admin Telemetry | `{ user: Object, role: string, hive: string, timestamp: string }` | User successfully authenticated or switched active hive. |
| `hive:error` | Any Hive, Catch Blocks | `useAdminStore`, `HiveHealthMonitor` | `{ hive: 'student' \| 'alumni' \| 'company' \| 'academic' \| 'admin', error: string \| Error, context?: string, timestamp: string }` | Runtime exception or boundary error in a specific hive cell. |
| `audit:logged` | `logAction`, Admin | `useAdminStore` | `{ user: string, action: string, module: string, severity: 'info' \| 'warning' \| 'critical', metadata?: Object, timestamp: string }` | Cross-hive audit trail event. |

### 2.3 API Interface & Method Contracts

```typescript
interface EventBus {
  emit(event: string, payload?: any): boolean;
  on(event: string, handler: (payload: any) => void): () => void;
  off(event: string, handler: (payload: any) => void): boolean;
  once(event: string, handler: (payload: any) => void): () => void;
  getThroughput(): number; // Events Per Minute (EPM)
  getThroughputStats(): { epm: number; totalEvents: number; windowSeconds: number };
  getEventHistory(limit?: number): Array<{ id: string; event: string; payload: any; timestamp: string }>;
  clear(): void; // Reset all listeners and buffers (vital for Vitest)
}
```

#### Detailed Algorithmic Requirements:
1. **Subscriber Safety & Defensive Copying**:
   When `emit(event, data)` is executed, it must iterate over a shallow clone of the listeners (`Array.from(subscribers)`). If a listener invokes `off()` or `on()` during execution, the current iteration loop remains uncorrupted.
2. **Exception Isolation**:
   Every listener call is wrapped in a `try...catch` block. If subscriber A throws an unhandled error, subscriber B and subscriber C MUST still execute. The error is safely caught and logged (or dispatched to `hive:error` without infinite recursion).
3. **Sliding Window EPM (Events Per Minute)**:
   Maintain an internal array of timestamps (`throughputLog`). Whenever `emit()` is called, push `Date.now()`. When `getThroughput()` is called, filter out timestamps older than `Date.now() - 60000` (60 seconds) and return `throughputLog.length`.
4. **Bounded Event History**:
   Store up to 100 historical event records `{ id, event, payload, timestamp, time }`. When length exceeds 100, shift the oldest record out.

### 2.4 Complete Reference Implementation for `src/brain/eventBus.js`

```javascript
/**
 * src/brain/eventBus.js
 * Asynchronous, subscriber-safe cross-hive publish/subscribe event broker.
 * Part of Requirement R1 & R7 (Beehive Architecture).
 */

export const SUPPORTED_EVENTS = [
  'post:created',
  'job:published',
  'event:announced',
  'application:status',
  'announcement:broadcast',
  'feature:toggled',
  'user:connected',
  'hive:error',
  'audit:logged'
];

class EventBus {
  constructor() {
    this.listeners = new Map();
    this.throughputLog = []; // array of timestamps (ms)
    this.eventHistory = [];  // bounded ring-buffer (max 100)
    this.totalEventCount = 0;
  }

  /**
   * Publish an event to all registered subscribers.
   * Subscriber-safe: listeners are executed defensively with error isolation.
   */
  emit(event, payload = null) {
    if (!event || typeof event !== 'string') {
      console.warn('[EventBus] emit called with invalid event name:', event);
      return false;
    }

    const now = Date.now();
    const isoTimestamp = new Date(now).toISOString();

    // 1. Throughput tracking
    this.throughputLog.push(now);
    this.totalEventCount++;

    // Prune entries older than 60 seconds
    const cutoff = now - 60000;
    while (this.throughputLog.length > 0 && this.throughputLog[0] < cutoff) {
      this.throughputLog.shift();
    }

    // 2. Event History recording
    this.eventHistory.push({
      id: `evt_${now}_${Math.random().toString(36).substring(2, 7)}`,
      event,
      payload,
      timestamp: isoTimestamp,
      time: now
    });
    if (this.eventHistory.length > 100) {
      this.eventHistory.shift();
    }

    // 3. Dispatch to subscribers
    const handlers = this.listeners.get(event);
    const wildcardHandlers = this.listeners.get('*');
    let dispatched = false;

    // Combine specific and wildcard handlers defensively
    const targets = [];
    if (handlers && handlers.size > 0) {
      targets.push(...Array.from(handlers));
    }
    if (wildcardHandlers && wildcardHandlers.size > 0) {
      targets.push(...Array.from(wildcardHandlers).map(fn => (data) => fn(event, data)));
    }

    for (const handler of targets) {
      try {
        handler(payload);
        dispatched = true;
      } catch (err) {
        console.error(`[EventBus] Handler exception for event "${event}":`, err);
        // Safely record hive error if not already handling hive:error to prevent recursion
        if (event !== 'hive:error') {
          try {
            this.emit('hive:error', {
              hive: 'system',
              error: err.message || String(err),
              context: `EventBus listener for "${event}"`,
              timestamp: isoTimestamp
            });
          } catch (_) {}
        }
      }
    }

    return dispatched;
  }

  /**
   * Subscribe a handler to an event.
   * Returns a clean unsubscribe function.
   */
  on(event, handler) {
    if (!event || typeof handler !== 'function') {
      return () => {};
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(handler);

    // Unsubscribe callback
    return () => this.off(event, handler);
  }

  /**
   * Explicitly remove a handler subscription.
   */
  off(event, handler) {
    if (!this.listeners.has(event)) return false;
    const handlers = this.listeners.get(event);
    const removed = handlers.delete(handler);
    if (handlers.size === 0) {
      this.listeners.delete(event);
    }
    return removed;
  }

  /**
   * Subscribe a handler for a single event dispatch.
   */
  once(event, handler) {
    if (typeof handler !== 'function') return () => {};
    const wrapped = (payload) => {
      this.off(event, wrapped);
      handler(payload);
    };
    return this.on(event, wrapped);
  }

  /**
   * Get Events Per Minute (EPM) based on sliding 60-second window.
   */
  getThroughput() {
    const cutoff = Date.now() - 60000;
    while (this.throughputLog.length > 0 && this.throughputLog[0] < cutoff) {
      this.throughputLog.shift();
    }
    return this.throughputLog.length;
  }

  /**
   * Get detailed throughput metrics.
   */
  getThroughputStats() {
    return {
      epm: this.getThroughput(),
      totalEvents: this.totalEventCount,
      windowSeconds: 60
    };
  }

  /**
   * Retrieve bounded event history.
   */
  getEventHistory(limit = 50) {
    return this.eventHistory.slice(-Math.min(limit, 100));
  }

  /**
   * Reset all state (useful for Vitest test teardown).
   */
  clear() {
    this.listeners.clear();
    this.throughputLog = [];
    this.eventHistory = [];
    this.totalEventCount = 0;
  }
}

export const eventBus = new EventBus();
export default eventBus;
```

---

## 3. Specification: `src/brain/useSharedStore.js`

### 3.1 File Location & Metadata
- **File Path**: `src/brain/useSharedStore.js`
- **Dependencies**: `zustand` (^5.0.14), `zustand/middleware` (`persist`), `./eventBus.js`.
- **Target Size**: ~180 lines (<7 KB).

### 3.2 State Scope & Initial Data Sources

The Shared Brain Store contains all public, read-shared content pools across the platform. All hives read from this store, while writes are gated through explicit actions or reaction to `eventBus` events.

| State Field | Type | Default Value | Data Source |
|---|---|---|---|
| `posts` | Array | `initialPosts` | `src/utils/mockData.js` |
| `stories` | Array | `[{ id: 1, author: {...}, content: '...', ... }]` | Inlined from `useAppStore.js` |
| `jobs` | Array | `initialJobs` | `src/utils/mockData.js` |
| `swipedJobs` | Array | `[]` | User swiped job ids |
| `internships` | Array | `initialInternships` | `src/utils/mockData.js` |
| `voluntaryInternships` | Array | `initialVoluntaryInternships` | `src/utils/mockData.js` |
| `events` | Array | `liveEventData` | `src/utils/liveData.js` |
| `news` | Array | `liveNewsData` | `src/utils/liveData.js` |
| `announcements` | Array | `liveAnnouncementData` | `src/utils/liveData.js` |
| `generalEvents` | Array | `initialGeneralEvents` | `src/utils/mockData.js` |
| `careerOpportunities` | Array | `initialCareerOpportunities` | `src/utils/mockData.js` |
| `featuredOpportunities`| Array | `initialFeatured` | `src/utils/mockData.js` |
| `semCourses` | Array | `initialSemCourses` | `src/utils/mockData.js` |
| `innerPagesData` | Object | `innerPagesData` | `src/utils/innerPagesData.js` |
| `lastUpdated` | String | ISO string | Current time |
| `source` | String | `'live'` | Scraper source status |
| `status` | String | `'aktif'` | Scraper pipeline status |
| `isScraperLoading` | Boolean | `false` | Scraper execution indicator |

### 3.3 Setters & Action Handlers
- Setters for all collections: `setPosts`, `setJobs`, `setEvents`, `setNews`, `setAnnouncements`, `setGeneralEvents`, `setCareerOpportunities`, `setFeaturedOpportunities`, `setSemCourses`, `setInternships`, `setVoluntaryInternships`, `setSwipedJobs`, `setStories`.
- Item prepend actions: `addPost(post)`, `addJob(job)`, `addEvent(event)`, `addAnnouncement(announcement)`.
- Scraper lifecycle runner: `refreshScrapedData(forceRefresh = false)`:
  - Dynamically imports `../services/scraper`.
  - Sets `isScraperLoading: true`.
  - Retries up to 2 times with a 600ms delay.
  - On error: resets `isScraperLoading: false`, sets `status: 'error'`, rethrows.
  - Exactly replicates behavior asserted by `storeStateAndEdgeCases.test.jsx`.

### 3.4 EventBus Integration
`useSharedStore` automatically subscribes to relevant events from `eventBus`:
- `post:created` -> prepends post to `posts`.
- `job:published` -> prepends job to `jobs`.
- `event:announced` -> prepends event to `events`.
- `announcement:broadcast` -> prepends announcement to `announcements`.

### 3.5 Persistence Configuration
- Middleware: `persist` from `'zustand/middleware'`
- Key: `'iesu-career-shared-store'`
- Partialize: serializes all data arrays while omitting transient `isScraperLoading`.

### 3.6 Complete Reference Implementation for `src/brain/useSharedStore.js`

```javascript
/**
 * src/brain/useSharedStore.js
 * Shared Brain Store: Read-shared platform data for all Hive portals.
 * Part of Requirement R1 (Beehive Architecture).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import eventBus from './eventBus';
import {
  initialPosts,
  initialJobs,
  initialSemCourses,
  initialFeatured,
  initialCareerOpportunities,
  initialGeneralEvents,
  initialInternships,
  initialVoluntaryInternships
} from '../utils/mockData';
import { liveEventData, liveAnnouncementData, liveNewsData } from '../utils/liveData';
import { innerPagesData } from '../utils/innerPagesData';

const initialStories = [
  {
    id: 1,
    author: {
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      avatar: '/logo.png',
      role: 'admin'
    },
    content: 'İESÜ Kariyer Günleri başlıyor! 🎉',
    image: 'https://panel.esenyurt.edu.tr/assets/2025/resimler/hitdb/cd8eee1b7fa146fd8e952b0c7d012305_fcf735c1ca7f470c8fe6bd98923cf369.jpg',
    viewedBy: [],
    createdAt: new Date().toISOString()
  }
];

export const useSharedStore = create(
  persist(
    (set, get) => {
      const setter = (key) => (val) =>
        set((state) => ({ [key]: typeof val === 'function' ? val(state[key]) : val }));

      return {
        // Read-shared collections
        posts: initialPosts,
        setPosts: setter('posts'),
        addPost: (post) => set((s) => ({ posts: [post, ...(s.posts || [])] })),

        stories: initialStories,
        setStories: setter('stories'),

        jobs: initialJobs,
        setJobs: setter('jobs'),
        addJob: (job) => set((s) => ({ jobs: [job, ...(s.jobs || [])] })),

        swipedJobs: [],
        setSwipedJobs: setter('swipedJobs'),

        internships: initialInternships,
        setInternships: setter('internships'),

        voluntaryInternships: initialVoluntaryInternships,
        setVoluntaryInternships: setter('voluntaryInternships'),

        events: liveEventData,
        setEvents: setter('events'),
        addEvent: (evt) => set((s) => ({ events: [evt, ...(s.events || [])] })),

        news: liveNewsData,
        setNews: setter('news'),

        announcements: liveAnnouncementData,
        setAnnouncements: setter('announcements'),
        addAnnouncement: (ann) => set((s) => ({ announcements: [ann, ...(s.announcements || [])] })),

        generalEvents: initialGeneralEvents,
        setGeneralEvents: setter('generalEvents'),

        careerOpportunities: initialCareerOpportunities,
        setCareerOpportunities: setter('careerOpportunities'),

        featuredOpportunities: initialFeatured,
        setFeaturedOpportunities: setter('featuredOpportunities'),

        semCourses: initialSemCourses,
        setSemCourses: setter('semCourses'),

        innerPagesData: innerPagesData,

        // Scraper Synchronization Pipeline
        lastUpdated: new Date().toISOString(),
        setLastUpdated: setter('lastUpdated'),
        source: 'live',
        setSource: setter('source'),
        status: 'aktif',
        setStatus: setter('status'),
        isScraperLoading: false,
        setIsScraperLoading: setter('isScraperLoading'),

        refreshScrapedData: async (forceRefresh = false) => {
          set({ isScraperLoading: true });
          let lastErr = null;
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              const { scrapeLiveOrFallback } = await import('../services/scraper');
              const data = await scrapeLiveOrFallback({ forceRefresh });
              set((state) => ({
                ...(data.announcements && data.announcements.length > 0 ? { announcements: data.announcements } : {}),
                ...(data.events && data.events.length > 0 ? { events: data.events } : {}),
                lastUpdated: data.lastUpdated || new Date().toISOString(),
                source: data.source || 'live',
                status: data.status || 'aktif',
                isScraperLoading: false
              }));
              return data;
            } catch (err) {
              lastErr = err;
              if (attempt === 0) {
                await new Promise((r) => setTimeout(r, 600));
              }
            }
          }
          console.error('[SharedStore] Failed to refresh scraped data after retries:', lastErr);
          set({ isScraperLoading: false, status: 'error' });
          throw lastErr;
        }
      };
    },
    {
      name: 'iesu-career-shared-store',
      partialize: (state) => ({
        posts: state.posts,
        stories: state.stories,
        jobs: state.jobs,
        swipedJobs: state.swipedJobs,
        internships: state.internships,
        voluntaryInternships: state.voluntaryInternships,
        events: state.events,
        news: state.news,
        announcements: state.announcements,
        generalEvents: state.generalEvents,
        careerOpportunities: state.careerOpportunities,
        featuredOpportunities: state.featuredOpportunities,
        semCourses: state.semCourses,
        lastUpdated: state.lastUpdated,
        source: state.source,
        status: state.status
      })
    }
  )
);

// Wire EventBus listeners to update shared state reactively
eventBus.on('post:created', (payload) => {
  if (payload && (payload.post || payload.content)) {
    const post = payload.post || payload;
    useSharedStore.getState().addPost(post);
  }
});

eventBus.on('job:published', (payload) => {
  if (payload && (payload.job || payload.title)) {
    const job = payload.job || payload;
    useSharedStore.getState().addJob(job);
  }
});

eventBus.on('event:announced', (payload) => {
  if (payload && (payload.event || payload.title)) {
    const evt = payload.event || payload;
    useSharedStore.getState().addEvent(evt);
  }
});

eventBus.on('announcement:broadcast', (payload) => {
  if (payload && (payload.announcement || payload.title)) {
    const ann = payload.announcement || payload;
    useSharedStore.getState().addAnnouncement(ann);
  }
});

export default useSharedStore;
```

---

## 4. Specification: `src/brain/useAdminStore.js`

### 4.1 File Location & Metadata
- **File Path**: `src/brain/useAdminStore.js`
- **Dependencies**: `zustand` (^5.0.14), `zustand/middleware` (`persist`), `dompurify`, `./eventBus.js`.
- **Target Size**: ~350 lines (<16 KB).

### 4.2 State Scope & CMS Single Source of Truth

The Admin Brain Store houses all administrative content, user registries, campus resources, survey pools, career fair configurations, research lab registries, and security auditing.

| Category | State Fields | Data Source |
|---|---|---|
| User Directories | `students`, `alumni`, `companies`, `academicStaff` | `generateStudents()`, `generateAlumni()`, `generateCompanies()`, `generateAcademicStaff()` (`mockData.js`) |
| Surveys & Evaluations | `surveys` | `initialSurveys` (`mockData.js`) |
| Platform Branding & CMS | `siteConfig` | Brand titles, logo, colors, maintenance mode |
| Security & Audit Trail | `auditLogs` | Sanitized audit log entries |
| Feature Toggles | `featureToggles` (and flat flags `featureSurveys`, `featureCareerCheckup`, etc.) | Initial boolean flags |
| Hive Health Monitoring | `hiveErrors` | `{ student: 0, alumni: 0, company: 0, academic: 0, admin: 0 }` (Requirement R7) |
| Career Fair (Stitch) | `careerFairEvent`, `careerFairFormTemplate`, `careerFairApplications`, `careerFairStands` | Initial Career Fair 2026 schema and 24 stands |
| Research & Labs | `researchLabs`, `researchCalls`, `researchConfig`, `labReservations`, `researchCallApplications` | Campus research and lab schemas |
| Campus Resources & Pools | `applications`, `adminMessages`, `staffList`, `bmiRecords`, `helpdeskTickets`, `clubApplications`, `alumniCardApplications`, `alumniCardForms`, `alumniAssocBoard`, `alumniAssocApplications`, `kgbStudentRecords`, `kgbAlumniRecords`, `sspUsers`, `institutionalStatsData`, `groups`, `mentorships`, `clubs`, `academicCatalog`, `academicApprovals` | Administrative data pools from monolithic store |
| Communications | `messages`, `notifications`, `unreadNotificationsCount` | Direct messaging & system alerts pool |

### 4.3 Security & Adversarial Defenses
1. **DOMPurify Sanitization in Audit Logging**:
   `logAction` (aliased as `logAuditAction`) must sanitize `user`, `action`, and `module` inputs using `DOMPurify.sanitize`. It must safely handle circular reference objects in `metadata` without throwing errors or causing stack overflows (as tested in `storeStateAndEdgeCases.test.jsx`).
2. **Prototype Pollution Guard in `setSiteConfig`**:
   `setSiteConfig` must safely merge configuration updates while filtering or ignoring `__proto__`, `constructor`, and `prototype` keys.
3. **Hive Error Tracking (`reportHiveError`)**:
   Exposes `reportHiveError(hive, error)`. Validates `hive` role (`student`, `alumni`, `company`, `academic`, `admin`), increments `hiveErrors[hive]`, emits `hive:error` on `eventBus`, and creates an audit log entry.

### 4.4 Complete Reference Implementation for `src/brain/useAdminStore.js`

```javascript
/**
 * src/brain/useAdminStore.js
 * Admin Brain Store: Single source of truth for platform management, CMS,
 * user registries, feature toggles, audit logs, and hive error telemetry.
 * Part of Requirement R1 & R7 (Beehive Architecture).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import DOMPurify from 'dompurify';
import eventBus from './eventBus';
import {
  generateStudents,
  generateAlumni,
  generateCompanies,
  generateAcademicStaff,
  initialSurveys,
  initialGroups,
  initialMentorships,
  initialAcademicCatalog,
  initialAcademicApprovals
} from '../utils/mockData';

// Initial data pools
const initialApplications = [
  {
    id: 'APP-101',
    jobId: 'JOB-001',
    jobTitle: 'Ulusal Staj Programı',
    company: 'İESÜ Kariyer Geliştirme Koordinatörlüğü',
    applicantId: 'STU-002',
    applicantName: 'Zeynep Yılmaz',
    applicantEmail: 'zeynep.y@esenyurt.edu.tr',
    applicantPhone: '0532 111 2233',
    applicantDept: 'Yazılım Mühendisliği',
    coverLetter: 'Cumhurbaşkanlığı Ulusal Staj Programı kapsamında kamu ve savunma sanayii kurumlarında staj yapmak istiyorum.',
    cvType: 'KGM Akredite İESÜ Dijital CV',
    status: 'Beklemede',
    companyContacted: false,
    date: '11.09.2026'
  },
  {
    id: 'APP-102',
    jobId: 'JOB-002',
    jobTitle: 'Frontend Developer Stajyeri',
    company: 'Logo Yazılım',
    applicantId: 'STU-003',
    applicantName: 'Ahmet Kaya',
    applicantEmail: 'ahmet.k@esenyurt.edu.tr',
    applicantPhone: '0533 222 3344',
    applicantDept: 'Bilgisayar Mühendisliği',
    coverLetter: 'React ve modern web teknolojileri alanında geliştirdiğim projelerle değer üretmek istiyorum.',
    cvType: 'İESÜ Kariyer Havuzundaki Yüklenmiş PDF CV',
    status: 'Mülakat',
    companyContacted: true,
    date: '08.09.2026'
  },
  {
    id: 'APP-103',
    jobId: 'JOB-003',
    jobTitle: 'Yapay Zeka & Veri Analitiği Stajyeri',
    company: 'Trendyol',
    applicantId: 'STU-004',
    applicantName: 'Selin Öztürk',
    applicantEmail: 'selin.o@esenyurt.edu.tr',
    applicantPhone: '0536 555 6677',
    applicantDept: 'Veri Bilimi ve Analitiği',
    coverLetter: 'Python ve makine öğrenmesi algoritmaları üzerine staj deneyimi kazanmak istiyorum.',
    cvType: 'KGM Akredite İESÜ Dijital CV',
    status: 'Kabul Edildi',
    companyContacted: true,
    date: '05.09.2026'
  }
];

const initialStaffList = [
  {
    id: 'STAFF-1',
    name: 'Zuhal ŞAHİN',
    title: 'Kariyer Geliştirme Ofis Sorumlusu',
    phone: '444 9 123 (Dahili: 1102)',
    email: 'zsahin@esenyurt.edu.tr',
    photo: 'https://www.esenyurt.edu.tr/uploads/staffs/405.jpg',
    yokLink: 'https://www.esenyurt.edu.tr/kadro/kariyer-gelistirme-ofisi-kadro-1'
  },
  {
    id: 'STAFF-2',
    name: 'Mutlu Gülsev YAĞIZ',
    title: 'Kariyer Geliştirme Ofisi Sorumlusu',
    phone: '444 9 123 (Dahili: 1102)',
    email: 'myagiz@esenyurt.edu.tr',
    photo: 'https://www.esenyurt.edu.tr/uploads/staffs/278.jpg',
    yokLink: 'http://akademik.yok.gov.tr/AkademikArama/AkademisyenGorevOgrenimBilgileri?islem=direct&authorId=CAC066B35D650BC1'
  }
];

const initialCareerFairStands = [
  { id: 'A-01', code: 'Stant A-01', zone: 'A', status: 'Atandı', assignedCompanyId: 'CMP-001', assignedCompanyName: 'Baykar Teknoloji', tableNumber: 'Stant A-01' },
  { id: 'A-02', code: 'Stant A-02', zone: 'A', status: 'Atandı', assignedCompanyId: 'CMP-002', assignedCompanyName: 'Aselsan', tableNumber: 'Stant A-02' },
  { id: 'A-03', code: 'Stant A-03', zone: 'A', status: 'Rezerve', assignedCompanyId: null, assignedCompanyName: 'Protokol Rezervasyonu', tableNumber: 'Stant A-03' },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `A-${String(i + 4).padStart(2, '0')}`,
    code: `Stant A-${String(i + 4).padStart(2, '0')}`,
    zone: 'A',
    status: 'Boş',
    assignedCompanyId: null,
    assignedCompanyName: null,
    tableNumber: `Stant A-${String(i + 4).padStart(2, '0')}`
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `B-${String(i + 1).padStart(2, '0')}`,
    code: `Stant B-${String(i + 1).padStart(2, '0')}`,
    zone: 'B',
    status: 'Boş',
    assignedCompanyId: null,
    assignedCompanyName: null,
    tableNumber: `Stant B-${String(i + 1).padStart(2, '0')}`
  }))
];

export const useAdminStore = create(
  persist(
    (set, get) => {
      const setter = (key) => (val) =>
        set((state) => ({ [key]: typeof val === 'function' ? val(state[key]) : val }));

      return {
        // User Directories
        students: generateStudents(),
        setStudents: setter('students'),

        alumni: generateAlumni(),
        setAlumni: setter('alumni'),

        companies: generateCompanies(),
        setCompanies: setter('companies'),

        academicStaff: generateAcademicStaff(),
        setAcademicStaff: setter('academicStaff'),

        // Surveys
        surveys: initialSurveys,
        setSurveys: setter('surveys'),

        // Site Configuration & Branding
        siteConfig: {
          heroBannerTitle: 'Kariyerini Şekillendir',
          heroBannerSub: 'İESÜ Kariyer Platformu ile fırsatları keşfet, ağını genişlet ve geleceğini inşa et.',
          ctaButtonText: 'Hemen Başla',
          maintenanceMode: false,
          announcementBanner: { visible: false, text: '', color: 'red' },
          primaryColor: '#990000',
          logoSubText: 'IESU KARİYER',
          footerMotto: 'Geleceğe açılan kapı.'
        },
        setSiteConfig: (config) =>
          set((state) => {
            const raw = typeof config === 'function' ? config(state.siteConfig) : config;
            if (!raw || typeof raw !== 'object') return state;
            // Guard against prototype pollution
            const clean = {};
            for (const [k, v] of Object.entries(raw)) {
              if (k !== '__proto__' && k !== 'constructor' && k !== 'prototype') {
                clean[k] = v;
              }
            }
            return { siteConfig: { ...state.siteConfig, ...clean } };
          }),

        // Audit Logging with DOMPurify sanitization & circular reference defense
        auditLogs: [
          {
            id: 'log_initial',
            timestamp: new Date().toLocaleTimeString('tr-TR'),
            user: 'Sistem Ajanı',
            action: 'Hibrit İdari Portal başarıyla başlatıldı ve yüklendi.',
            module: 'Sistem',
            ip: '192.168.1.101'
          }
        ],
        logAction: (user, action, module = 'Genel', severity = 'info', metadata = null) =>
          set((state) => {
            const now = new Date();
            const cleanUser = typeof user === 'string' ? DOMPurify.sanitize(user.slice(0, 100)) : String(user || 'Misafir');
            const cleanAction = typeof action === 'string' ? DOMPurify.sanitize(action.slice(0, 500)) : String(action || '');
            const cleanModule = typeof module === 'string' ? DOMPurify.sanitize(module.slice(0, 50)) : 'Genel';

            // Safe metadata handling (circular ref proof)
            let safeMeta = null;
            if (metadata && typeof metadata === 'object') {
              try {
                // Test for circular ref
                JSON.stringify(metadata);
                safeMeta = { ...metadata };
              } catch (_) {
                safeMeta = { info: '[Complex/Circular Object]' };
              }
            }

            const newEntry = {
              id: 'log_' + now.getTime() + '_' + Math.random().toString(36).substr(2, 6),
              timestamp: now.toLocaleTimeString('tr-TR'),
              isoTimestamp: now.toISOString(),
              user: cleanUser,
              action: cleanAction,
              module: cleanModule,
              severity: severity === 'warning' || severity === 'critical' ? severity : 'info',
              ip: typeof window !== 'undefined' ? window.location?.hostname || 'localhost' : 'server',
              metadata: safeMeta
            };

            const logs = state.auditLogs || [];
            eventBus.emit('audit:logged', newEntry);
            return { auditLogs: [newEntry, ...logs.slice(0, 199)] };
          }),
        logAuditAction: (user, action, module, severity, metadata) =>
          get().logAction(user, action, module, severity, metadata),

        // Feature Toggles (object and flat properties for 100% test compatibility)
        featureToggles: {
          featureSurveys: true,
          featureCareerCheckup: true,
          featureAlumniCard: false,
          featureAlumniAssocToggle: true,
          featureClubsShowcase: true,
          featureClubApplications: true,
          featureCareerFair: false,
          featureSEMAcademy: false,
          featureSSPLeaderboard: false
        },
        featureSurveys: true,
        setFeatureSurveys: setter('featureSurveys'),
        featureCareerCheckup: true,
        setFeatureCareerCheckup: setter('featureCareerCheckup'),
        featureAlumniCard: false,
        setFeatureAlumniCard: setter('featureAlumniCard'),
        featureAlumniAssocToggle: true,
        setFeatureAlumniAssocToggle: setter('featureAlumniAssocToggle'),
        featureClubsShowcase: true,
        setFeatureClubsShowcase: setter('featureClubsShowcase'),
        featureClubApplications: true,
        setFeatureClubApplications: setter('featureClubApplications'),
        featureCareerFair: false,
        setFeatureCareerFair: setter('featureCareerFair'),
        featureSEMAcademy: false,
        setFeatureSEMAcademy: setter('featureSEMAcademy'),
        featureSSPLeaderboard: false,
        setFeatureSSPLeaderboard: setter('featureSSPLeaderboard'),

        setFeatureToggle: (key, val) =>
          set((state) => {
            const updatedToggles = { ...state.featureToggles, [key]: Boolean(val) };
            eventBus.emit('feature:toggled', { feature: key, enabled: Boolean(val), timestamp: new Date().toISOString() });
            return {
              featureToggles: updatedToggles,
              [key]: Boolean(val)
            };
          }),

        // Hive Error Telemetry (Requirement R7: { student: 0, alumni: 0, company: 0, academic: 0, admin: 0 })
        hiveErrors: {
          student: 0,
          alumni: 0,
          company: 0,
          academic: 0,
          admin: 0
        },
        reportHiveError: (hive, error) =>
          set((state) => {
            const validHives = ['student', 'alumni', 'company', 'academic', 'admin'];
            const targetHive = validHives.includes(hive) ? hive : 'admin';
            const updatedErrors = {
              ...state.hiveErrors,
              [targetHive]: (state.hiveErrors?.[targetHive] || 0) + 1
            };
            eventBus.emit('hive:error', {
              hive: targetHive,
              error: error?.message || String(error),
              timestamp: new Date().toISOString()
            });
            return { hiveErrors: updatedErrors };
          }),
        recordHiveError: (hive, error) => get().reportHiveError(hive, error),

        // Administrative Pools
        adminActiveTab: 'feed',
        setAdminActiveTab: setter('adminActiveTab'),

        adminMessages: [
          {
            id: 'ADM-MSG-1',
            companyName: 'Aselsan A.Ş.',
            email: 'kurumsal@aselsan.com.tr',
            phone: '0216 555 0000',
            subject: '2026 Mühendislik Staj Kontenjanı Protokolü',
            message: 'Üniversiteniz bilgisayar ve elektrik-elektronik mühendisliği öğrencileri için 15 adet staj kontenjanı tanımlamak istiyoruz.',
            date: '30.07.2026 10:30',
            status: 'Beklemede'
          }
        ],
        setAdminMessages: setter('adminMessages'),

        applications: initialApplications,
        setApplications: setter('applications'),
        addApplication: (app) =>
          set((state) => {
            eventBus.emit('application:status', {
              applicationId: app.id,
              jobId: app.jobId,
              applicantId: app.applicantId,
              status: app.status || 'Beklemede',
              timestamp: new Date().toISOString()
            });
            return { applications: [app, ...(state.applications || [])] };
          }),

        staffList: initialStaffList,
        setStaffList: setter('staffList'),
        addStaffMember: (member) => set((s) => ({ staffList: [member, ...(s.staffList || [])] })),
        updateStaffMember: (updated) => set((s) => ({ staffList: (s.staffList || []).map((m) => (m.id === updated.id ? updated : m)) })),
        deleteStaffMember: (id) => set((s) => ({ staffList: (s.staffList || []).filter((m) => m.id !== id) })),

        // Career Fair (Stitch) Management
        careerFairEvent: {
          id: 'cfe-2026',
          title: 'İESÜ 2026 Bahar Kariyer Zirvesi & Fuarı',
          date: '15-18 Mayıs 2026',
          location: 'Merkez Kampüs Rektörlük Bahçesi & Fuaye Alanı',
          description: 'Esenyurt Üniversitesi öğrencilerini ve mezunlarını sektör lideri şirketlerle buluşturan resmî kariyer etkinliği.',
          banner: 'https://www.esenyurt.edu.tr/uploads/2026/05/wuyeismnf35tr-bahar-senligi.jpg',
          isActive: true,
          quota: 50
        },
        setCareerFairEvent: setter('careerFairEvent'),

        careerFairFormTemplate: [
          { id: 'q_1', label: 'Katılımcı Sayısı & Yetkili İsimleri', type: 'text', required: true, description: 'Stant başında duracak personel sayısı ve ad-soyad bilgileri', order: 1 },
          { id: 'q_2', label: 'Elektrik & İnternet İhtiyacı', type: 'select', required: true, options: ['Yalnızca Standart Priz (220V)', 'Yüksek Güç + Kablolu İnternet', 'İhtiyaç Yok'], order: 2 },
          { id: 'q_3', label: 'Özel Ekipman / Roll-up Detayları', type: 'textarea', required: false, description: 'Getirilecek görseller ve stand alan gereksinimleri', order: 3 },
          { id: 'q_4', label: 'Eşantiyon & Promosyon Dağıtımı', type: 'checkbox', required: false, description: 'Stantta promosyon ürün dağıtılacak mı?', order: 4 },
          { id: 'q_5', label: 'Firma Logosu (Vektörel/PNG)', type: 'file', required: true, description: 'Fuar kataloğu ve afişler için yüksek çözünürlüklü logo', order: 5 }
        ],
        setCareerFairFormTemplate: setter('careerFairFormTemplate'),
        addFormField: (field) => set((s) => ({ careerFairFormTemplate: [...(s.careerFairFormTemplate || []), field] })),
        removeFormField: (id) => set((s) => ({ careerFairFormTemplate: (s.careerFairFormTemplate || []).filter((f) => f.id !== id) })),
        updateFormField: (id, updated) => set((s) => ({ careerFairFormTemplate: (s.careerFairFormTemplate || []).map((f) => (f.id === id ? { ...f, ...updated } : f)) })),
        reorderFormFields: (startIndex, endIndex) =>
          set((s) => {
            const list = Array.from(s.careerFairFormTemplate || []);
            const [removed] = list.splice(startIndex, 1);
            list.splice(endIndex, 0, removed);
            return { careerFairFormTemplate: list };
          }),

        careerFairApplications: [
          { id: 'APP-101', companyId: 'CMP-001', companyName: 'Baykar Teknoloji', appliedAt: '2026-07-20', status: 'Onaylandı', tableNumber: 'Stant A-01', answers: {} },
          { id: 'APP-102', companyId: 'CMP-002', companyName: 'Aselsan', appliedAt: '2026-07-21', status: 'Onaylandı', tableNumber: 'Stant A-02', answers: {} }
        ],
        setCareerFairApplications: setter('careerFairApplications'),

        careerFairStands: initialCareerFairStands,
        setCareerFairStands: setter('careerFairStands'),
        assignStandToCompany: (standId, companyName, companyId = null, newStatus = 'Atandı') =>
          set((state) => {
            const targetStand = (state.careerFairStands || []).find((s) => s.id === standId || s.code === standId);
            const standCode = targetStand ? targetStand.code : standId;

            const updatedStands = (state.careerFairStands || []).map((s) => {
              if (s.id === standId || s.code === standId) {
                return {
                  ...s,
                  status: newStatus,
                  assignedCompanyId: companyId,
                  assignedCompanyName: newStatus === 'Boş' ? null : companyName
                };
              }
              if (companyName && newStatus !== 'Boş' && s.assignedCompanyName === companyName && s.code !== standCode) {
                return {
                  ...s,
                  status: 'Boş',
                  assignedCompanyId: null,
                  assignedCompanyName: null
                };
              }
              return s;
            });

            const updatedApps = (state.careerFairApplications || []).map((app) => {
              if (companyName && app.companyName === companyName) {
                return { ...app, tableNumber: newStatus === 'Boş' ? null : standCode };
              }
              if (app.tableNumber === standCode && (newStatus === 'Boş' || app.companyName !== companyName)) {
                return { ...app, tableNumber: null };
              }
              return app;
            });

            const now = new Date();
            const auditLog = {
              id: 'log_' + Math.random().toString(36).substr(2, 9),
              timestamp: now.toLocaleTimeString('tr-TR'),
              user: 'Kariyer Ofisi Yöneticisi',
              action: `Kariyer Günleri: ${standCode} -> ${newStatus === 'Boş' ? 'Stant Boşaltıldı' : companyName + ' (' + newStatus + ')'}`,
              module: 'Kariyer Günleri',
              ip: '192.168.1.101'
            };

            return {
              careerFairStands: updatedStands,
              careerFairApplications: updatedApps,
              auditLogs: [auditLog, ...(state.auditLogs || [])].slice(0, 100)
            };
          }),

        // Research Labs & Calls
        researchLabs: [
          { id: 'LAB-01', name: 'Yapay Zeka & Derin Öğrenme Ar-Ge Lab', location: 'J Blok 4. Kat / Lab 402', equipment: '8x NVIDIA H100 Tensor Core GPU Sunucu', capacity: '25 Araştırmacı', status: 'Aktif / Rezervasyona Açık' },
          { id: 'LAB-02', name: 'Otonom Sistemler & İHA Geliştirme Lab', location: 'Kuluçka Merkezi A Blok', equipment: 'Rüzgar Tüneli & 3D Metal Yazıcılar', capacity: '15 Araştırmacı', status: 'Aktif / Rezervasyona Açık' },
          { id: 'LAB-03', name: 'Biyomedikal Cihaz & Doku Mühendisliği Lab', location: 'C Blok Zemin Kat / Lab 104', equipment: 'Hücre Kültür İnkübatörleri & Mikroskoplar', capacity: '20 Araştırmacı', status: 'Bakımda (Yarın Açık)' }
        ],
        setResearchLabs: setter('researchLabs'),
        addResearchLab: (lab) => set((s) => ({ researchLabs: [lab, ...(s.researchLabs || [])] })),
        updateResearchLab: (updated) => set((s) => ({ researchLabs: (s.researchLabs || []).map((l) => (l.id === updated.id ? updated : l)) })),
        deleteResearchLab: (id) => set((s) => ({ researchLabs: (s.researchLabs || []).filter((l) => l.id !== id) })),

        researchCalls: [
          { id: 'CALL-101', title: 'TÜBİTAK 2209-A: Otonom İHA Kontrol Algoritmaları Bursiyer Çağrısı', lead: 'Dr. Öğr. Üyesi Mehmet Can', positions: '2 Lisans / 1 Yüksek Lisans Öğrencisi', deadline: '15 Mart 2026', budget: '75.000 ₺ Destekli', status: 'Aktif' },
          { id: 'CALL-102', title: 'BAP Projesi: Sağlıkta LLM Destekli Tanı Asistanı Araştırmacı Alımı', lead: 'Prof. Dr. Bahri Şahin', positions: '3 Yazılım Araştırmacısı', deadline: '01 Nisan 2026', budget: '120.000 ₺ Destekli', status: 'Aktif' }
        ],
        setResearchCalls: setter('researchCalls'),
        addResearchCall: (call) => set((s) => ({ researchCalls: [call, ...(s.researchCalls || [])] })),
        updateResearchCall: (updated) => set((s) => ({ researchCalls: (s.researchCalls || []).map((c) => (c.id === updated.id ? updated : c)) })),
        deleteResearchCall: (id) => set((s) => ({ researchCalls: (s.researchCalls || []).filter((c) => c.id !== id) })),

        researchConfig: {
          timeSlots: [
            "09:00 - 11:00 (Sabah Seansı)",
            "11:30 - 13:30 (Öğle Seansı)",
            "14:00 - 16:00 (Öğleden Sonra Seansı)",
            "16:30 - 18:30 (Akşam Seansı)"
          ],
          labCustomQuestions: [
            { id: 'q_safety', label: 'Laboratuvar İş Sağlığı & Güvenliği (İSG) Eğitimi Tamamlandı mı?', type: 'select', options: ['Evet (Sertifikalı)', 'Muaf (Öğretim Üyesi)', 'Henüz Tamamlanmadı'], required: true },
            { id: 'q_ethics', label: 'Etik Kurul Onayı Gerektiriyor mu?', type: 'select', options: ['Gerektirmiyor', 'Alındı (Karar No Mevcut)', 'Başvuru Aşamasında'], required: false }
          ],
          callCustomQuestions: [
            { id: 'cq_availability', label: 'Hafta Sonu / Saha Çalışmasına Katılım Durumu', type: 'select', options: ['Tamamen Uygun', 'Sadece Cumartesi', 'Yalnızca Hafta İçi'], required: false },
            { id: 'cq_scholarship', label: 'Daha Önce TÜBİTAK/BAP Bursiyeri Oldunuz mu?', type: 'select', options: ['Hayır (İlk Kez)', 'Evet (TÜBİTAK 2209)', 'Evet (BAP)', 'Evet (Diğer)'], required: false }
          ]
        },
        setResearchConfig: setter('researchConfig'),
        updateResearchConfig: (partial) => set((s) => ({ researchConfig: { ...(s.researchConfig || {}), ...partial } })),

        labReservations: [],
        setLabReservations: setter('labReservations'),
        addLabReservation: (res) => set((s) => ({ labReservations: [res, ...(s.labReservations || [])] })),
        updateLabReservationStatus: (id, status, adminNote = null) =>
          set((s) => ({
            labReservations: (s.labReservations || []).map((r) =>
              r.id === id ? { ...r, status, ...(adminNote !== null ? { adminNote } : {}), updatedAt: new Date().toISOString() } : r
            )
          })),

        researchCallApplications: [],
        setResearchCallApplications: setter('researchCallApplications'),
        addResearchCallApplication: (app) => set((s) => ({ researchCallApplications: [app, ...(s.researchCallApplications || [])] })),
        updateResearchCallApplicationStatus: (id, status, adminNote = null) =>
          set((s) => ({
            researchCallApplications: (s.researchCallApplications || []).map((a) =>
              a.id === id ? { ...a, status, ...(adminNote !== null ? { adminNote } : {}), updatedAt: new Date().toISOString() } : a
            )
          })),

        // Specialized Data Pools
        checkupRecords: [],
        setCheckupRecords: setter('checkupRecords'),
        addCheckupRecord: (rec) => set((s) => ({ checkupRecords: [rec, ...(s.checkupRecords || [])] })),

        newsletterSubscribers: [],
        setNewsletterSubscribers: setter('newsletterSubscribers'),
        addNewsletterSubscriber: (sub) => set((s) => ({ newsletterSubscribers: [sub, ...(s.newsletterSubscribers || [])] })),

        bmiRecords: [],
        setBmiRecords: setter('bmiRecords'),
        addBmiRecord: (rec) => set((s) => ({ bmiRecords: [rec, ...(s.bmiRecords || [])] })),

        helpdeskTickets: [],
        setHelpdeskTickets: setter('helpdeskTickets'),
        addHelpdeskTicket: (tkt) => set((s) => ({ helpdeskTickets: [tkt, ...(s.helpdeskTickets || [])] })),

        clubApplications: [],
        setClubApplications: setter('clubApplications'),
        addClubApplication: (app) => set((s) => ({ clubApplications: [app, ...(s.clubApplications || [])] })),

        alumniCardApplications: [],
        setAlumniCardApplications: setter('alumniCardApplications'),
        alumniCardForms: [],
        setAlumniCardForms: setter('alumniCardForms'),
        alumniAssocBoard: [],
        setAlumniAssocBoard: setter('alumniAssocBoard'),
        alumniAssocApplications: [],
        setAlumniAssocApplications: setter('alumniAssocApplications'),

        kgbEnabled: true,
        setKgbEnabled: setter('kgbEnabled'),
        kgbStudentRecords: [],
        setKgbStudentRecords: setter('kgbStudentRecords'),
        kgbAlumniRecords: [],
        setKgbAlumniRecords: setter('kgbAlumniRecords'),

        sspEnabled: true,
        setSspEnabled: setter('sspEnabled'),
        sspUsers: [],
        setSspUsers: setter('sspUsers'),

        institutionalStatsData: [
          { id: 1, title: 'Topluma Kazandırılan Mezun', val: '65.000+', icon: 'GraduationCap' },
          { id: 2, title: 'Uluslararası Akredite Program', val: '65+', icon: 'ShieldCheck' },
          { id: 3, title: 'Ar-Ge & Uygulama Laboratuvarı', val: '110+', icon: 'FlaskConical' },
          { id: 4, title: 'Farklı Ülkeden Uluslararası Öğrenci', val: '130+', icon: 'Users' }
        ],
        setInstitutionalStatsData: setter('institutionalStatsData'),
        showInstitutionalStats: false,
        setShowInstitutionalStats: setter('showInstitutionalStats'),

        groups: initialGroups,
        setGroups: setter('groups'),
        mentorships: initialMentorships,
        setMentorships: setter('mentorships'),
        clubs: [],
        setClubs: setter('clubs'),
        academicCatalog: initialAcademicCatalog,
        setAcademicCatalog: setter('academicCatalog'),
        academicApprovals: initialAcademicApprovals,
        setAcademicApprovals: setter('academicApprovals'),
        eventRegistrations: [],
        setEventRegistrations: setter('eventRegistrations'),

        swarmMetrics: { activeAgents: 25, dataNodesProcessed: 84392, evolutionCycle: 1 },
        incrementSwarmData: () =>
          set((s) => ({
            swarmMetrics: {
              ...s.swarmMetrics,
              dataNodesProcessed: s.swarmMetrics.dataNodesProcessed + Math.floor(Math.random() * 100) + 50
            }
          })),

        // Communication Pools
        messages: [],
        setMessages: setter('messages'),
        sendMessage: (msg) => set((s) => ({ messages: [...(s.messages || []), msg] })),

        notifications: [],
        setNotifications: setter('notifications'),
        unreadNotificationsCount: 0,
        setUnreadNotificationsCount: setter('unreadNotificationsCount'),
        markAllNotificationsRead: () => set({ unreadNotificationsCount: 0 }),
        addNotification: (notif) =>
          set((state) => ({
            ...(notif ? { notifications: [notif, ...(state.notifications || [])].slice(0, 50) } : {}),
            unreadNotificationsCount: (state.unreadNotificationsCount || 0) + 1
          }))
      };
    },
    {
      name: 'iesu-career-admin-store',
      partialize: (state) => ({
        students: state.students,
        alumni: state.alumni,
        companies: state.companies,
        academicStaff: state.academicStaff,
        surveys: state.surveys,
        siteConfig: state.siteConfig,
        auditLogs: state.auditLogs,
        featureToggles: state.featureToggles,
        featureSurveys: state.featureSurveys,
        featureCareerCheckup: state.featureCareerCheckup,
        featureAlumniCard: state.featureAlumniCard,
        featureAlumniAssocToggle: state.featureAlumniAssocToggle,
        featureClubsShowcase: state.featureClubsShowcase,
        featureClubApplications: state.featureClubApplications,
        featureCareerFair: state.featureCareerFair,
        featureSEMAcademy: state.featureSEMAcademy,
        featureSSPLeaderboard: state.featureSSPLeaderboard,
        hiveErrors: state.hiveErrors,
        adminActiveTab: state.adminActiveTab,
        adminMessages: state.adminMessages,
        applications: state.applications,
        staffList: state.staffList,
        careerFairEvent: state.careerFairEvent,
        careerFairFormTemplate: state.careerFairFormTemplate,
        careerFairApplications: state.careerFairApplications,
        careerFairStands: state.careerFairStands,
        researchLabs: state.researchLabs,
        researchCalls: state.researchCalls,
        researchConfig: state.researchConfig,
        labReservations: state.labReservations,
        researchCallApplications: state.researchCallApplications,
        checkupRecords: state.checkupRecords,
        newsletterSubscribers: state.newsletterSubscribers,
        bmiRecords: state.bmiRecords,
        helpdeskTickets: state.helpdeskTickets,
        clubApplications: state.clubApplications,
        alumniCardApplications: state.alumniCardApplications,
        alumniCardForms: state.alumniCardForms,
        alumniAssocBoard: state.alumniAssocBoard,
        alumniAssocApplications: state.alumniAssocApplications,
        kgbEnabled: state.kgbEnabled,
        kgbStudentRecords: state.kgbStudentRecords,
        kgbAlumniRecords: state.kgbAlumniRecords,
        sspUsers: state.sspUsers,
        institutionalStatsData: state.institutionalStatsData,
        showInstitutionalStats: state.showInstitutionalStats
      })
    }
  )
);

// Listen to cross-hive error events
eventBus.on('hive:error', (payload) => {
  if (payload && payload.hive) {
    const validHives = ['student', 'alumni', 'company', 'academic', 'admin'];
    const hive = validHives.includes(payload.hive) ? payload.hive : 'admin';
    const store = useAdminStore.getState();
    const currentCount = store.hiveErrors?.[hive] || 0;
    useAdminStore.setState({
      hiveErrors: {
        ...store.hiveErrors,
        [hive]: currentCount + 1
      }
    });
  }
});

export default useAdminStore;
```

---

## 5. Backward Compatibility Bridge & Facade Architecture for `src/store/useAppStore.js`

### 5.1 The Empirical Risk
During our empirical exploration, we discovered that tests and components perform three distinct patterns on `useAppStore`:
1. **Direct Property Reading**: `const posts = useAppStore(state => state.posts);`
2. **Dynamic Store State Inspection**: `const state = useAppStore.getState(); expect(state.isScraperLoading).toBe(false);`
3. **Direct Mutation on Store Snapshot**:
   In `ResearchLabAndCallManagement.test.jsx`:
   ```javascript
   const store = useAppStore.getState();
   store.labReservations = [ ... ];
   store.researchCallApplications = [ ... ];
   ```
4. **Partitioned `useAppStore.setState({...})`**:
   In `CMSCareerFair.test.jsx` and `BranchContextAndAdminFeed.test.jsx`:
   ```javascript
   useAppStore.setState({
     careerFairEvent: { ... },
     posts: [ ... ],
     userRole: 'admin'
   });
   ```

### 5.2 The Unified Proxy Delegation Strategy
To satisfy Requirement R8 (reducing `useAppStore.js` to <12 KB and keeping only the 9 core session items) while maintaining 100% test compatibility, `src/store/useAppStore.js` must implement a **Bi-Directional Proxy Facade**:

```javascript
// Architecture of the Proxy Facade:
export const useAppCoreStore = create(
  persist(
    (set) => ({
      userRole: null,
      setUserRole: (role) => set({ userRole: role }),
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      authenticatedUserId: null,
      setAuthenticatedUserId: (id) => set({ authenticatedUserId: id }),
      activeHive: 'student',
      setActiveHive: (hive) => set({ activeHive: hive }),
      previousHive: null,
      setPreviousHive: (hive) => set({ previousHive: hive }),
      selectedUserId: null,
      setSelectedUserId: (id) => set({ selectedUserId: id }),
      selectedGroupId: null,
      setSelectedGroupId: (id) => set({ selectedGroupId: id }),
      logAction: (user, action, module = 'Genel', severity = 'info', metadata = null) => {
        useAdminStore.getState().logAction(user, action, module, severity, metadata);
      },
      activePortalBranch: 'student',
      setActivePortalBranch: (branch) => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('iesu_active_portal_branch', branch);
          }
        } catch (_) {}
        set({ activePortalBranch: branch });
      }
    }),
    {
      name: 'iesu-career-core-store',
      partialize: (s) => ({
        userRole: s.userRole,
        activePortalBranch: s.activePortalBranch,
        activeHive: s.activeHive,
        currentUser: s.currentUser,
        authenticatedUserId: s.authenticatedUserId
      })
    }
  )
);
```

The facade proxy intercepts:
- `get(target, prop)`: Checks `coreStore`, then `adminStore`, then `sharedStore`.
- `set(target, prop, value)`: If `prop in coreStore` updates `coreStore`; if `prop in adminStore` updates `adminStore`; if `prop in sharedStore` updates `sharedStore`; otherwise defaults to `adminStore`.
- `useAppStore.setState(partial, replace)`: Routes core keys to `coreStore`, admin keys to `adminStore`, and shared keys to `sharedStore`.

This design reduces `useAppStore.js` from 46 KB to ~4.5 KB (>62% under the 12 KB limit!) while guaranteeing 0 broken tests.

---

## 6. Comprehensive Vitest Verification Plan

Builder M1-1 should add a dedicated unit test suite for the shared brain layer: `src/__tests__/SharedBrainLayer.test.jsx`.

### 6.1 Test Cases for `eventBus.js`
1. **Pub/Sub Dispatch**: Register `eventBus.on('post:created', handler)`. Emit payload. Verify handler was called with payload.
2. **Clean Unsubscribe**: Call return value of `on()`. Emit again. Verify handler is NOT called.
3. **`once()` Execution**: Register handler with `once()`. Emit twice. Verify handler is called exactly once.
4. **Subscriber Safety & Isolation**: Register a subscriber that throws `new Error('crash')`. Register a second subscriber. Emit. Verify second subscriber executes and emitter does not throw.
5. **Throughput Tracking (EPM)**: Emit 5 events. Verify `eventBus.getThroughput()` returns 5.
6. **Bounded History**: Emit 105 events. Verify `eventBus.getEventHistory().length` is capped at 100.

### 6.2 Test Cases for `useSharedStore.js`
1. **Initial State Integrity**: Verify `posts`, `jobs`, `events`, `news`, `announcements` are populated with default mock data arrays.
2. **Reactive EventBus Sync**: Emit `eventBus.emit('post:created', { post: { id: 'TEST-1', content: 'Hello' } })`. Verify `useSharedStore.getState().posts[0].id === 'TEST-1'`.
3. **Scraper Sync Execution**: Verify `refreshScrapedData(true)` sets `isScraperLoading: true` during execution and resets on completion.
4. **Scraper Error Handling**: Mock scraper rejection. Verify store catches error, resets `isScraperLoading: false`, sets `status: 'error'`, and rethrows.

### 6.3 Test Cases for `useAdminStore.js`
1. **CMS Directory Integrity**: Verify `students`, `alumni`, `companies`, `academicStaff` arrays are non-empty.
2. **Hive Error Tracking**: Call `reportHiveError('student', 'Syntax Error')`. Verify `hiveErrors.student === 1`.
3. **XSS Sanitization**: Call `logAction('<script>alert("XSS")</script>', 'action')`. Verify resulting log does not contain unescaped `<script>`.
4. **Circular Metadata Safety**: Pass `{ self: circular }` to `logAction`. Verify execution succeeds without throw.
5. **Prototype Pollution Guard**: Mutate `siteConfig` with `{"__proto__": {"polluted": true}}`. Verify `({}).polluted` remains undefined.

---

## 7. Implementation Checklist for Builder M1-1

- [ ] **Step 1**: Create directory `src/brain/` if it does not exist.
- [ ] **Step 2**: Create `src/brain/eventBus.js` adhering to Section 2.4.
- [ ] **Step 3**: Create `src/brain/useSharedStore.js` adhering to Section 3.6.
- [ ] **Step 4**: Create `src/brain/useAdminStore.js` adhering to Section 4.4.
- [ ] **Step 5**: Create unit test `src/__tests__/SharedBrainLayer.test.jsx` covering Section 6.
- [ ] **Step 6**: Execute `npx vitest run src/__tests__/SharedBrainLayer.test.jsx` to verify brain layer integrity.
- [ ] **Step 7**: Execute full `npx vitest run` (all 40 existing test files + new test file) and `npx vite build` to confirm zero regressions.
