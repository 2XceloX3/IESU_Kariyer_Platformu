# Beehive Architecture — Store & Data Decomposition Survey Report
**Agent**: Explorer 2 (Store & Data Explorer)  
**Date**: 2026-09-22  
**Target Repository**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active`  
**Reference Document**: `ORIGINAL_REQUEST.md` (Requirements R1, R2, R7, R8)  

---

## 1. Executive Summary

The İESÜ Career & Alumni Ecosystem Platform currently relies on a monolithic Zustand global store located at `src/store/useAppStore.js`. Our empirical analysis revealed that this single file is **46,125 bytes (~45.04 KB)**, spans **918 lines**, and manages over **78 distinct state variables, actions, and CMS data pools**.

Prior to any modifications, the existing test suite was executed via `npx vitest run`:
- **Test Files**: 40 passed (40 total)
- **Tests**: 360 passed (360 total)
- **Duration**: ~69.65s

Our static and runtime exploration surveyed **125+ consumer files** across `src/components/`, `src/services/`, and `src/__tests__/`. We established a concrete decomposition architecture that cleanly separates global read data into **Shared Brain** (`src/brain/useSharedStore.js`), administrative/CMS data into **Admin Brain** (`src/brain/useAdminStore.js`), portal-specific navigation and state into **4 Isolated Hive Stores** (`src/hives/*/store/useXxxStore.js`), coordinates cross-hive reactions via an asynchronous **EventBus** (`src/brain/eventBus.js`), and reduces `useAppStore.js` to strictly the **9 items mandated by R8** while preserving backward compatibility and shrinking the file size from 46 KB to **<5 KB (well below the 12 KB limit)**.

---

## 2. Monolithic Store Analysis: `src/store/useAppStore.js`

### 2.1 File Metrics
- **Exact Path**: `src/store/useAppStore.js`
- **File Size**: 46,125 bytes (~45.04 KB)
- **Total Lines**: 918 lines
- **Zustand Configuration**: `create(persist(..., { name: 'iesu-career-store-v22', partialize }))`
- **Partialized Keys in LocalStorage**: 42 keys persisted (lines 867–912)

### 2.2 Complete State Inventory & Taxonomy

The 78+ items in `useAppStore.js` can be classified into 6 architectural tiers:

#### A. Core Session & Identity (R8 Target Scope)
| State / Action | Type / Signature | Description |
|---|---|---|
| `userRole` / `setUserRole` | `string \| null` | Authenticated user role (`student`, `alumni`, `company`, `academic`, `admin`, `guest`) |
| `currentUser` / `setCurrentUser` | `object \| null` | Authenticated user profile object |
| `authenticatedUserId` / `setAuthenticatedUserId` | `string \| null` | Firebase/DB auth UID |
| `activeHive` / `setActiveHive` | `string` | Current active hive context (`student`, `alumni`, `company`, `academic`, `admin`) |
| `previousHive` / `setPreviousHive` | `string \| null` | Previous active hive context for backtracking |
| `selectedUserId` / `setSelectedUserId` | `string \| null` | Target user ID for public profile or DM viewing |
| `selectedGroupId` / `setSelectedGroupId` | `string \| null` | Target group ID for community pages |
| `logAction` | `(user, action, module, severity, meta) => void` | Audit logger (sanitizes input with DOMPurify) |
| `activePortalBranch` / `setActivePortalBranch` | `string` | Transition branch identifier with `localStorage` synchronization |

#### B. Read-Shared Content (R1 Shared Brain Scope)
| State / Action | Type / Default | Target Store |
|---|---|---|
| `posts`, `setPosts` | Array (`initialPosts`) | `useSharedStore` |
| `jobs`, `setJobs`, `swipedJobs`, `setSwipedJobs` | Array (`initialJobs`) | `useSharedStore` |
| `events`, `setEvents` | Array (`liveEventData`) | `useSharedStore` |
| `news`, `setNews` | Array (`liveNewsData`) | `useSharedStore` |
| `announcements`, `setAnnouncements` | Array (`liveAnnouncementData`) | `useSharedStore` |
| `generalEvents`, `setGeneralEvents` | Array (`initialGeneralEvents`) | `useSharedStore` |
| `careerOpportunities`, `setCareerOpportunities` | Array (`initialCareerOpportunities`) | `useSharedStore` |
| `featuredOpportunities`, `setFeaturedOpportunities` | Array (`initialFeatured`) | `useSharedStore` |
| `semCourses`, `setSemCourses` | Array (`initialSemCourses`) | `useSharedStore` |
| `internships`, `setInternships`, `voluntaryInternships`, `setVoluntaryInternships` | Arrays | `useSharedStore` |
| `isScraperLoading`, `lastUpdated`, `source`, `status`, `refreshScrapedData` | Scraper lifecycle states & async runner | `useSharedStore` |

#### C. Managed Administrative CMS Data (R1 Admin Brain Scope)
| State / Action | Type / Default | Target Store |
|---|---|---|
| `students`, `setStudents` | Array (`generateStudents()`) | `useAdminStore` |
| `alumni`, `setAlumni` | Array (`generateAlumni()`) | `useAdminStore` |
| `companies`, `setCompanies` | Array (`generateCompanies()`) | `useAdminStore` |
| `academicStaff`, `setAcademicStaff` | Array (`generateAcademicStaff()`) | `useAdminStore` |
| `surveys`, `setSurveys` | Array (`initialSurveys`) | `useAdminStore` |
| `siteConfig`, `setSiteConfig` | Object (branding, titles, maintenanceMode) | `useAdminStore` |
| `auditLogs` | Array of log objects | `useAdminStore` |
| `featureToggles` (`featureSurveys`, `featureCareerCheckup`, `featureAlumniCard`, `featureAlumniAssocToggle`, `featureClubsShowcase`, `featureClubApplications`, `featureCareerFair`, `featureSEMAcademy`, `featureSSPLeaderboard`) | Boolean flags | `useAdminStore` |
| `applications`, `setApplications`, `addApplication` | Array (`initialApplications`) | `useAdminStore` |
| `adminMessages`, `setAdminMessages` | Array of administrative inquiries | `useAdminStore` |
| `adminActiveTab`, `setAdminActiveTab` | String ('feed', etc.) | `useAdminStore` |
| `careerFairEvent`, `careerFairFormTemplate`, `careerFairApplications`, `careerFairStands`, `assignStandToCompany`, `addFormField`, `removeFormField`, `updateFormField`, `reorderFormFields` | Google Stitch career fair schema | `useAdminStore` |
| `researchLabs`, `researchCalls`, `researchConfig`, `labReservations`, `researchCallApplications`, CRUD actions | Campus R&D and research grant models | `useAdminStore` |
| `checkupRecords`, `addCheckupRecord` | Array of alumni checkup surveys | `useAdminStore` |
| `newsletterSubscribers`, `addNewsletterSubscriber` | Array of newsletter subscriptions | `useAdminStore` |
| `staffList`, `addStaffMember`, `updateStaffMember`, `deleteStaffMember` | Career office coordinator staff list | `useAdminStore` |
| `bmiRecords`, `addBmiRecord` | Health metrics data pool | `useAdminStore` |
| `helpdeskTickets`, `addHelpdeskTicket` | BIDB IT ticket pool | `useAdminStore` |
| `clubApplications`, `addClubApplication` | Student club membership applications | `useAdminStore` |
| `alumniCardApplications`, `alumniCardForms`, `alumniAssocBoard`, `alumniAssocApplications` | Alumni association data pools | `useAdminStore` |
| `kgbEnabled`, `kgbStudentRecords`, `kgbAlumniRecords` | Career development certificate records | `useAdminStore` |
| `sspEnabled`, `sspUsers` | Social responsibility points | `useAdminStore` |
| `institutionalStatsData`, `showInstitutionalStats` | Official university statistics | `useAdminStore` |
| `groups`, `mentorships`, `clubs`, `academicCatalog`, `academicApprovals` | Administrative reference data | `useAdminStore` |
| `swarmMetrics`, `incrementSwarmData` | AI metrics | `useAdminStore` |
| `hiveErrors` (New requirement R7) | Per-hive error counts `{ student: 0, alumni: 0, ... }` | `useAdminStore` |

#### D. User Messaging & Notifications
| State / Action | Type / Default | Target Placement |
|---|---|---|
| `messages`, `setMessages`, `sendMessage` | User peer messaging array | Shared or App Store |
| `notifications`, `setNotifications`, `unreadNotificationsCount`, `setUnreadNotificationsCount`, `markAllNotificationsRead`, `addNotification` | User alerts array | App Store / Shared |

#### E. Gamification & Personalization
| State / Action | Type / Default | Target Placement |
|---|---|---|
| `userBP`, `setUserBP`, `purchasedItems`, `setPurchasedItems`, `activeFrame`, `setActiveFrame`, `purchaseItem` | Gamification store | Student Store / Shared |
| `unlockedBadges`, `setUnlockedBadges` | User achievements | User Hive Store |

#### F. Hive Routing & View Navigation (R2 Isolated Scope)
| State / Action | Monolithic Location | Beehive Placement |
|---|---|---|
| `previousView`, `setPreviousView` | `useAppStore` | Isolated in `useStudentStore`, `useAlumniStore`, `useCompanyStore`, `useAcademicStore` |
| `viewState`, `setViewState` | `useAppStore` | Moved to respective Hive components |

---

## 3. Codebase Consumption Analysis

### 3.1 Overview of Consumers
- **Total files referencing `useAppStore`**: 127 files
- **Component files**: 98 files (including 25 CMS/admin components)
- **Services**: 2 files (`src/services/dbService.js`, `src/services/dbSync.js`)
- **Test files**: 21 test files (20 in `src/__tests__/`, 1 in `src/tests/`)
- **Root**: `src/App.jsx`

### 3.2 Property Consumption Frequencies

| Store Property | Consumer Count (Files) | Primary Consumers |
|---|:---:|---|
| `events` | 18 | `EventsPage`, `NewsEvents`, `CalendarView`, `StudentFeed`, `AlumniFeed`, `AdminDashboard` |
| `jobs` | 17 | `JobsAndInternships`, `StudentFeed`, `CompanyFeed`, `AlumniFeed`, `CMSJobs` |
| `announcements` | 15 | `KgmNewsSection`, `StudentFeed`, `AdminDashboard`, `CMSAnnouncements` |
| `students` | 15 | `StudentFeed`, `UserProfile`, `PublicUserProfile`, `AdminDashboard`, `CMSStudents`, `Login` |
| `alumni` | 15 | `AlumniFeed`, `GlobalAlumniMap`, `UserProfile`, `CMSAlumni`, `Login` |
| `activePortalBranch` | 15 | `App`, `UserProfile`, `PublicUserProfile`, `BranchNewsWidget`, `AdminFeed` |
| `posts` / `setPosts` | 14 / 12 | `StudentFeed`, `AlumniFeed`, `CompanyFeed`, `AcademicStaffFeed`, `PostComposer`, `dbService` |
| `news` / `setNews` | 14 | `PublicNewsView`, `NewsEvents`, `StudentFeed`, `AdminDashboard`, `CMSNews` |
| `companies` / `setCompanies` | 12 | `CompanyFeed`, `JobsAndInternships`, `AdminDashboard`, `CMSCompanies`, `Login` |
| `academicStaff` / `setAcademicStaff` | 12 | `AcademicStaffFeed`, `UserProfile`, `AdminDashboard`, `CMSAcademicStaff`, `Login` |
| `applications` / `setApplications` | 11 | `ApplicationsPanel`, `CompanyATSBoard`, `StudentFeed`, `JobApplicationAndAdminPool.test` |
| `notifications` / `addNotification` | 11 / 7 | `NotificationEngine`, `NotificationsPanel`, `StudentFeed`, `TopProfileMenu` |
| `messages` / `setMessages` | 10 / 8 | `MessagingInterface`, `TopProfileMenu`, `UserProfile`, `FloatingChatWidget` |
| `adminMessages` / `setAdminMessages` | 10 / 6 | `AdminDashboard`, `CMSMessages`, `CMSCompanyEventMessages` |
| `generalEvents` | 9 | `StudentFeed`, `AlumniFeed`, `AdminDashboard`, `CMSGeneralEvents` |
| `careerOpportunities` | 9 | `StudentFeed`, `AlumniFeed`, `JobsAndInternships`, `CMSCareerOpportunities` |
| `surveys` / `setSurveys` | 9 / 3 | `AlumniSurveys`, `SurveyPopupModal`, `AdminDashboard`, `CMSSurveys` |
| `logAction` | 9 | `App`, `StudentFeed`, `AdminDashboard`, `AuditLogsPanel`, `storeStateAndEdgeCases.test` |
| `careerFairApplications` / `Stands` / `Template` | 8 | `CMSCareerFair`, `empirical_m4_floorplan.test`, `CMSCareerFair.test` |
| `mentorships` / `setMentorships` | 8 | `StudentFeed`, `AlumniFeed`, `AdminDashboard`, `CMSMentorship` |
| `siteConfig` / `setSiteConfig` | 6 | `App`, `CMSSiteEditor`, `storeStateAndEdgeCases.test` |
| `researchLabs` / `Calls` / `Config` | 2 | `ResearchOSHub`, `AkademikPanel`, `ResearchLabAndCallManagement.test` |

### 3.3 Critical Test Dependencies

A key discovery in our investigation is that multiple test suites directly invoke Zustand methods on `useAppStore`:
1. **`storeStateAndEdgeCases.test.jsx`**:
   - `useAppStore.getState().isScraperLoading`
   - `useAppStore.getState().refreshScrapedData(true)`
   - `useAppStore.getState().logAction(payload, ...)`
   - `useAppStore.getState().auditLogs`
   - `useAppStore.getState().setSiteConfig(evilConfig)`
   - `useAppStore.getState().setUserRole('guest')`
2. **`CMSCareerFair.test.jsx` & `empirical_m4_floorplan.test.jsx`**:
   - `useAppStore.setState({ careerFairFormTemplate: [...] })`
   - `useAppStore.getState().careerFairFormTemplate`
   - `useAppStore.getState().careerFairStands`
   - `useAppStore.getState().assignStandToCompany(...)`
3. **`ResearchLabAndCallManagement.test.jsx`**:
   - `useAppStore.getState().researchLabs`
   - `useAppStore.getState().researchCalls`
   - `useAppStore.getState().labReservations`
   - `useAppStore.getState().researchCallApplications`
   - `useAppStore.getState().researchConfig`
4. **`deepcoder_core_transformations.test.jsx` & `JobApplicationAndAdminPool.test.jsx`**:
   - `useAppStore.getState().applications`
   - `useAppStore.setState({ applications: [...] })`
5. **`BranchContextAndAdminFeed.test.jsx` & `App.test.jsx`**:
   - `useAppStore.setState({ activePortalBranch: 'alumni', userRole: 'alumni' })`
   - `useAppStore.getState().userRole`
   - `useAppStore.getState().activePortalBranch`
6. **`ClubAdminPanel.test.jsx`**:
   - `vi.mock('../store/useAppStore', ...)`

**Crucial Takeaway**: If `useAppStore.js` is reduced to only 9 items without a backward-compatibility delegation mechanism, **at least 15 test suites (spanning ~120 tests) will immediately throw `TypeError: undefined is not a function` or property access errors**.

---

## 4. Beehive Store Decomposition Architecture

To satisfy all requirements (R1, R2, R7, R8) with zero regressions, the store architecture must be cleanly partitioned into three tiers:

```
                          ┌───────────────────────────┐
                          │   src/brain/eventBus.js   │
                          │   (Typed Pub/Sub Hub)     │
                          └─────────────▲─────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
┌──────────▼──────────┐      ┌──────────▼──────────┐      ┌──────────▼──────────┐
│  src/brain/         │      │  src/brain/         │      │  src/store/         │
│  useSharedStore.js  │      │  useAdminStore.js   │      │  useAppStore.js     │
│  (Read-Shared Data) │      │  (Admin Brain & CMS)│      │  (Reduced <12KB)    │
│  - posts, jobs      │      │  - CMS data pools   │      │  - 9 core items     │
│  - events, news     │      │  - siteConfig       │      │  - Proxy delegation │
│  - announcements    │      │  - auditLog         │      │    for compat       │
│  - scraper sync     │      │  - featureToggles   │      └─────────────────────┘
└──────────▲──────────┘      │  - hiveErrors (R7)  │
           │                 └─────────────────────┘
           │
           │ (Read Only via EventBus or Hook)
  ┌────────┴────────────────────────┬────────────────────────┐
  │                                 │                        │
┌─┴───────────────────┐  ┌──────────┴──────────┐  ┌──────────┴──────────┐  ┌─────────────────────┐
│ src/hives/student/  │  │ src/hives/alumni/   │  │ src/hives/company/  │  │ src/hives/academic/ │
│ store/              │  │ store/              │  │ store/              │  │ store/              │
│ useStudentStore.js  │  │ useAlumniStore.js   │  │ useCompanyStore.js  │  │ useAcademicStore.js │
│ - activeView('feed')│  │ - activeView('feed')│  │ - activeView('feed')│  │ - activeView('feed')│
│ - previousView      │  │ - previousView      │  │ - previousView      │  │ - previousView      │
│ - careerProgress    │  │ - mentorMode        │  │ - atsBoard          │  │ - researchMode      │
│ - dailyQuestProgress│  │ - alumniCardActive  │  │ - activeJobListings │  │ - setActiveView     │
│ - setActiveView     │  │ - setActiveView     │  │ - setActiveView     │  │ - goBack            │
│ - goBack            │  │ - goBack            │  │ - goBack            │  └─────────────────────┘
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

### 4.1 Tier 1: EventBus (`src/brain/eventBus.js`)
- **Role**: Publish/subscribe event broker for cross-hive communication without direct imports.
- **Exports**: `emit(event, payload)`, `on(event, handler)` (returns unsubscribe function), `off(event, handler)`, `once(event, handler)`.
- **Typed Event Catalog**:
  - `post:created`: Dispatched when a post is created; consumed by `useSharedStore`.
  - `job:published`: Dispatched when an employer publishes a job; updates `useSharedStore`.
  - `event:announced`: Dispatched when an event is added; updates `useSharedStore`.
  - `announcement:broadcast`: Dispatched when an announcement is posted; updates `useSharedStore`.
  - `application:status`: Dispatched when an application is updated; consumed by ATS and student notifications.
  - `feature:toggled`: Dispatched when admin flips a feature toggle in `useAdminStore`.
  - `user:connected`: Dispatched on login/role switch.
  - `audit:logged`: Cross-hive logging handler writing to `useAdminStore.auditLogs`.
  - `hive:error`: Error notification event tracking hive faults in `useAdminStore.hiveErrors`.
- **Metrics**: Event counter and timestamps tracking events per minute for the `HiveHealthMonitor` dashboard (R7).

### 4.2 Tier 2: Shared Brain (`src/brain/useSharedStore.js`)
- **Role**: Single source of truth for public, read-shared platform content.
- **State Fields**:
  - `posts` (initialized with `initialPosts`)
  - `jobs` (initialized with `initialJobs`)
  - `swipedJobs` (`[]`)
  - `internships` (`initialInternships`)
  - `voluntaryInternships` (`initialVoluntaryInternships`)
  - `events` (`liveEventData`)
  - `news` (`liveNewsData`)
  - `announcements` (`liveAnnouncementData`)
  - `generalEvents` (`initialGeneralEvents`)
  - `careerOpportunities` (`initialCareerOpportunities`)
  - `featuredOpportunities` (`initialFeatured`)
  - `semCourses` (`initialSemCourses`)
  - Scraper sync states: `lastUpdated`, `source`, `status`, `isScraperLoading`, `refreshScrapedData(forceRefresh)`
- **Writers**: Controlled exclusively through dedicated action setters and EventBus event listeners.
- **Readers**: All hives read from `useSharedStore`.

### 4.3 Tier 3: Admin Brain (`src/brain/useAdminStore.js`)
- **Role**: Single source of truth for platform management, CMS entities, configurations, and health monitoring.
- **State Fields**:
  - `students`, `setStudents` (`generateStudents()`)
  - `alumni`, `setAlumni` (`generateAlumni()`)
  - `companies`, `setCompanies` (`generateCompanies()`)
  - `academicStaff`, `setAcademicStaff` (`generateAcademicStaff()`)
  - `surveys`, `setSurveys` (`initialSurveys`)
  - `siteConfig`, `setSiteConfig` (branding, hero banners, maintenanceMode)
  - `auditLogs`, `logAction` (sanitized with DOMPurify)
  - `featureToggles`: `{ featureSurveys: true, featureCareerCheckup: true, featureAlumniCard: false, featureAlumniAssocToggle: true, featureClubsShowcase: true, featureClubApplications: true, featureCareerFair: false, featureSEMAcademy: false, featureSSPLeaderboard: false }`
  - `hiveErrors`: `{ student: 0, alumni: 0, company: 0, academic: 0, admin: 0 }` (Required for R7)
  - `recordHiveError(hive, err)`: Action to register an error for a given hive
  - Administrative Pools:
    - `applications`, `addApplication`
    - `adminMessages`, `setAdminMessages`
    - `careerFairEvent`, `careerFairFormTemplate`, `careerFairApplications`, `careerFairStands`, `assignStandToCompany`, `addFormField`, etc.
    - `researchLabs`, `researchCalls`, `researchConfig`, `labReservations`, `researchCallApplications`, status update actions
    - `checkupRecords`, `newsletterSubscribers`, `staffList`, `bmiRecords`, `helpdeskTickets`, `clubApplications`
    - `alumniCardApplications`, `alumniCardForms`, `alumniAssocBoard`, `alumniAssocApplications`
    - `kgbEnabled`, `kgbStudentRecords`, `kgbAlumniRecords`
    - `sspEnabled`, `sspUsers`
    - `institutionalStatsData`, `showInstitutionalStats`
    - `adminActiveTab`, `setAdminActiveTab`
- **Persistence**: Persisted under key `'iesu-career-admin-store'`.

### 4.4 Tier 4: Per-Hive Isolated Stores (`src/hives/*/store/useXxxStore.js`)
Each user-role hive owns its private navigation state and role-specific workflows.

#### 1. `src/hives/student/store/useStudentStore.js`
- `activeView`: `'feed'` (default)
- `previousView`: `'feed'` (default)
- `activeTab`: `'feed'`
- `careerProgress`: `0`
- `dailyQuestProgress`: `{}`
- `selectedJobId`: `null`
- `setActiveView(view)`: Updates `activeView` and records previous in `previousView`
- `goBack()`: Restores `previousView`
- `setSelectedJobId(id)`
- `updateCareerProgress(val)`
- `updateDailyQuest(id, progress)`
- **Constraint**: MUST NOT import `useAppStore`.

#### 2. `src/hives/alumni/store/useAlumniStore.js`
- `activeView`: `'feed'` (default)
- `previousView`: `'feed'` (default)
- `activeTab`: `'feed'`
- `mentorMode`: `false`
- `alumniCardActive`: `false`
- `setActiveView(view)`
- `goBack()`
- `setMentorMode(val)`
- `setAlumniCardActive(val)`
- **Constraint**: MUST NOT import `useAppStore`.

#### 3. `src/hives/company/store/useCompanyStore.js`
- `activeView`: `'feed'` (default)
- `previousView`: `'feed'` (default)
- `activeTab`: `'feed'`
- `atsBoard`: `{}`
- `activeJobListings`: `[]`
- `setActiveView(view)`
- `goBack()`
- `setAtsBoard(board)`
- `setActiveJobListings(listings)`
- **Constraint**: MUST NOT import `useAppStore`.

#### 4. `src/hives/academic/store/useAcademicStore.js`
- `activeView`: `'feed'` (default)
- `previousView`: `'feed'` (default)
- `activeTab`: `'feed'`
- `researchMode`: `false`
- `setActiveView(view)`
- `goBack()`
- `setResearchMode(val)`
- **Constraint**: MUST NOT import `useAppStore`.

---

## 5. Reduced `useAppStore.js` & Backward Compatibility Architecture

### 5.1 Strictly Scoped Core State (Requirement R8)
In compliance with R8, the internal Zustand slice of `src/store/useAppStore.js` must contain ONLY:
1. `userRole`, `setUserRole`
2. `currentUser`, `setCurrentUser`
3. `authenticatedUserId`, `setAuthenticatedUserId`
4. `activeHive`, `setActiveHive`
5. `previousHive`, `setPreviousHive`
6. `selectedUserId`, `setSelectedUserId`
7. `selectedGroupId`, `setSelectedGroupId`
8. `logAction` (dispatches to event bus and updates `useAdminStore.auditLogs`)
9. `activePortalBranch`, `setActivePortalBranch` (with localStorage sync)

### 5.2 Size Target
- Current: **46,125 bytes**
- R8 Requirement: **< 12 KB (12,288 bytes)**
- Target Architecture Size: **~4.2 KB (approx 120 lines)** — comfortably exceeding the requirement by >60%.

### 5.3 The Dual-Mode Proxy / Delegation Bridge
To guarantee that the 40 existing test files and legacy components continue to pass without code churn, `useAppStore.js` will export a smart facade around `useAppCoreStore`:

```javascript
// Architecture sketch of the facade in src/store/useAppStore.js:
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import DOMPurify from 'dompurify';
import useSharedStore from '../brain/useSharedStore';
import useAdminStore from '../brain/useAdminStore';
import eventBus from '../brain/eventBus';

const useAppCoreStore = create(
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
        eventBus.emit('audit:logged', { user, action, module, severity, metadata });
        useAdminStore.getState().logAction?.(user, action, module, severity, metadata);
      },
      activePortalBranch: 'student',
      setActivePortalBranch: (branch) => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('iesu_active_portal_branch', branch);
          }
        } catch(e) {}
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

// Unified State Snapshot for getState()
const getMergedState = () => {
  const core = useAppCoreStore.getState();
  const shared = useSharedStore.getState();
  const admin = useAdminStore.getState();
  return new Proxy(core, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (prop in admin) return admin[prop];
      if (prop in shared) return shared[prop];
      return undefined;
    },
    has(target, prop) {
      return prop in target || prop in admin || prop in shared;
    }
  });
};

// Partitioned setState(...)
const setMergedState = (partial, replace) => {
  const update = typeof partial === 'function' ? partial(getMergedState()) : partial;
  if (!update || typeof update !== 'object') return;

  const coreKeys = new Set(['userRole', 'setUserRole', 'currentUser', 'setCurrentUser', 'authenticatedUserId', 'setAuthenticatedUserId', 'activeHive', 'setActiveHive', 'previousHive', 'setPreviousHive', 'selectedUserId', 'setSelectedUserId', 'selectedGroupId', 'setSelectedGroupId', 'logAction', 'activePortalBranch', 'setActivePortalBranch']);
  const coreUpdate = {};
  const adminUpdate = {};
  const sharedUpdate = {};

  const adminState = useAdminStore.getState();
  const sharedState = useSharedStore.getState();

  for (const [k, v] of Object.entries(update)) {
    if (coreKeys.has(k)) {
      coreUpdate[k] = v;
    } else if (k in adminState || k.startsWith('feature') || k.startsWith('careerFair') || k.startsWith('research')) {
      adminUpdate[k] = v;
    } else if (k in sharedState || ['posts', 'jobs', 'events', 'news', 'announcements'].includes(k)) {
      sharedUpdate[k] = v;
    } else {
      adminUpdate[k] = v;
    }
  }

  if (Object.keys(coreUpdate).length > 0) useAppCoreStore.setState(coreUpdate, replace);
  if (Object.keys(adminUpdate).length > 0) useAdminStore.setState(adminUpdate, replace);
  if (Object.keys(sharedUpdate).length > 0) useSharedStore.setState(sharedUpdate, replace);
};

// Facade Hook
export default function useAppStore(selector) {
  const core = useAppCoreStore((s) => s);
  const shared = useSharedStore((s) => s);
  const admin = useAdminStore((s) => s);

  const merged = React.useMemo(() => new Proxy(core, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (prop in admin) return admin[prop];
      if (prop in shared) return shared[prop];
      return undefined;
    }
  }), [core, shared, admin]);

  if (typeof selector === 'function') {
    return selector(merged);
  }
  return merged;
}

// Attach static Zustand store methods
useAppStore.getState = getMergedState;
useAppStore.setState = setMergedState;
useAppStore.subscribe = useAppCoreStore.subscribe;
```

### 5.4 Why This Guarantees Zero Regressions
1. **Tests using `useAppStore.getState().researchLabs`**: Resolves directly to `useAdminStore.getState().researchLabs`.
2. **Tests using `useAppStore.setState({ careerFairFormTemplate: [...] })`**: Directs update into `useAdminStore.setState`.
3. **Tests using `useAppStore.getState().refreshScrapedData(true)`**: Invokes scraper function on `useSharedStore`.
4. **Tests using `useAppStore.mockReturnValue(...)`** (`ClubAdminPanel.test.jsx`): Replaced at module level by Vitest as before.
5. **No circular dependencies**: `useSharedStore` and `useAdminStore` do NOT import `useAppStore`.
6. **Hive Stores are isolated**: `src/hives/*/store/*.js` only import Zustand directly and NEVER import `useAppStore`.

---

## 6. Implementation Checklist & Verification Matrix

| Step | Action | Files Created / Modified | Acceptance Criteria |
|---|---|---|---|
| 1 | Create EventBus | `src/brain/eventBus.js` | Exports `emit`, `on`, `off`, `once`, throughput counter |
| 2 | Create Shared Brain | `src/brain/useSharedStore.js` | Contains `posts`, `jobs`, `events`, `news`, `announcements`, scraper |
| 3 | Create Admin Brain | `src/brain/useAdminStore.js` | Contains CMS pools, `students`, `alumni`, `companies`, `siteConfig`, `hiveErrors` |
| 4 | Create Hive Stores | `src/hives/*/store/useXxxStore.js` | 4 isolated stores with `activeView` (default 'feed'), `previousView`, `setActiveView`, `goBack` |
| 5 | Reduce useAppStore | `src/store/useAppStore.js` | < 12 KB, 9 core items + compatibility facade |
| 6 | Create Hive Contexts | `src/hives/*/HiveContext.jsx` | 4 contexts with `hiveColor`, `hiveName`, `hiveAccent` |
| 7 | Create Hive Roots | `src/hives/*/XxxHive.jsx` | 4 root components wrapping existing feed views with internal routing |
| 8 | Create Health Monitor | `src/brain/HiveHealthMonitor.jsx` | Honeycomb dashboard mounted in `OverviewPanel.jsx` |
| 9 | Update Profiles | `PublicUserProfile.jsx`, `UserProfile.jsx` | Support `viewerHive` prop for theme persistence |
| 10 | Reduce App.jsx | `src/App.jsx` | < 150 lines, hive selector switch |
| 11 | Validation | Terminal | `npx vitest run` passes 360/360 tests, `npx vite build` exits 0 |

---
*Report prepared by Explorer 2 (Store & Data Explorer).*
