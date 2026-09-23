# Beehive Architecture Exploration Report — App & Routing

**Agent**: Explorer 1 (App & Routing Explorer)  
**Date**: 2026-09-22  
**Target Repository**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active`  
**Focus Areas**: `src/App.jsx`, Portal Feeds (`StudentFeed`, `AlumniFeed`, `CompanyFeed`, `AcademicStaffFeed`, Admin Views), Requirement R4 (Per-Hive Root Components), Requirement R6 (`App.jsx` Simplification to <150 lines).

---

## 1. Executive Summary & Baseline Metrics

The objective of this investigation is to map the current monolithic routing and portal structure of the İESÜ Career & Alumni Ecosystem Platform and formulate a precise, actionable engineering plan for migration to the **Beehive Architecture** (Requirements R4 and R6).

### Verified Baseline Metrics
- **Current `src/App.jsx` line count**: `684 lines` (Target: `<150 lines`)
- **Total Test Files**: `40 passed (40)` (`360 passed tests`) verified with Vitest (`npx vitest run`, 57.6s)
- **Vite Build**: Successfully built in 9.50s (`npx vite build`, exit code 0, 119 PWA precache assets)
- **Monolithic Component Imports in `App.jsx`**: 65 lazy components, 1 static component (`ExploreFeed`)
- **Global `validViews` array**: 78 view tokens currently managed in a single flat namespace
- **Monolithic Global Store (`useAppStore.js`)**: 918 lines, 46.1 KB (Target: `<12 KB`)

---

## 2. In-Depth Analysis of `src/App.jsx`

### 2.1 File Characteristics & Structure
`src/App.jsx` currently acts as a monolithic router, state coordinator, and component registry. It combines user authentication state, URL parsing, permission guards, 78 view conditional renders, and global overlay components into 684 lines.

### 2.2 Component Imports
1. **React Core & Router**:
   - `React, { useState, useEffect, useMemo, Suspense, lazy, useCallback }`
   - `Routes, Route, useNavigate, useLocation` from `react-router-dom` *(Note: `Routes` and `Route` are imported on line 2 but never rendered; navigation is handled through `useLocation` and conditional JSX)*
2. **Firebase Auth & Firestore**:
   - `auth, db` from `./utils/firebase`
   - `onAuthStateChanged` from `firebase/auth`
   - `doc, getDoc` from `firebase/firestore`
3. **Zustand State**:
   - `useAppStore` from `./store/useAppStore`
4. **Static UI Components**:
   - `ExploreFeed` from `./components/ExploreFeed`
   - `ToastContainer, toast` from `./components/shared/Toast`
   - `NotificationEngine` from `./components/NotificationEngine`
   - `ErrorBoundary` from `./components/ErrorBoundary`
   - `AlertCircle` from `lucide-react`
5. **Lazy Component Pool (65 components)**:
   - **Auth & Public (4)**: `LandingPage`, `Login`, `Register`, `ForgotPassword`
   - **Feeds & Portals (8)**: `StudentFeed`, `CompanyFeed`, `AdminDashboard`, `AdminFeed`, `AlumniFeed`, `AcademicStaffFeed`, `IdariPortal`, `AlumniAssocPortal`
   - **Career & Academic Panels (14)**: `OrganizationChart`, `JobsAndInternships`, `NewsEvents`, `PublicNewsView`, `SemPanel`, `StajPanel`, `StudentAnalytics`, `StudentKGBPanel`, `ApplicationsPanel`, `AICVBuilder`, `InterviewSimulator`, `JobCreator`, `CompanyATSBoard`, `ResearchOSHub`
   - **Networking & Social (11)**: `CareerNetwork`, `UserProfile`, `PublicUserProfile`, `ProfileUpdate`, `GroupProfile`, `GroupsPanel`, `NotificationsPanel`, `MessagingInterface`, `CalendarView`, `BirlikAgiPortal`, `AnkaChat`
   - **Gen Z & Innovation Panels (14)**: `AICareerWingman`, `LeaderboardPanel`, `MentorMatch`, `VirtualCareerFair`, `AlumniCardWallet`, `CareerTest`, `CareerRoadmap`, `StartupIncubator`, `LiveRoomsPanel`, `IesuWallet`, `MentorBooking`, `SmartCertificates`, `DigitalPortfolio`, `MetaverseLibrary`
   - **Campus & Administrative Tools (14)**: `DynamicContentPage`, `ClubAdminPanel`, `StudentClubPortal`, `RewardStore`, `BMICalculatorModal`, `AuditLogsPanel`, `HackathonMarket`, `AlumniDAO`, `CampusMap`, `GlobalAlumniMap`, `SKSDBLunchWidget`, `SKSDBClubsDirectory`, `KnowledgePortal`, `KGMManagementConsole`
   - **Stitch & Institutional UI (6)**: `AboutUsPage`, `ServicesPage`, `EventsPage`, `ContactPage`, `BIDBSystemStatusCard`, `BIDBHelpdeskModal`, `KariyerJobBoard`
   - **Modals & Overlays (4)**: `FloatingChatWidget`, `PWAInstallPrompt`, `CommandPalette`, `SurveyPopupModal`, `GlobalSearchOverlay`

---

### 2.3 User Authentication & Role Resolution Flow

The rendering lifecycle is governed by the combination of local storage state, Firebase asynchronous session resolution, and URL extraction:

```
[1. LocalStorage Initialization]
       │
       ▼
[currentUser state initialized] ──── If missing ID, assign STU-xxx / ALU-xxx / ACAD-001 / admin_1513
       │
       ▼
[2. Firebase onAuthStateChanged]
       │
       ├─► user exists: fetch doc('users', uid) ──► setCurrentUser({ id: uid, ...userData }), setUserRole(role)
       └─► no user: setAuthenticatedUserId(null) ──► setIsAuthStateResolved(true)
       │
       ▼
[3. Effective Role Determination]
       ├─► effectiveUserRole = currentUser?.role || userRole || null
       ├─► standardUserRoleView:
       │     'company' | 'employer' ──► 'company'
       │     'academic'              ──► 'academic'
       │     'alumni'                ──► 'alumni'
       │     default                 ──► 'student'
       ├─► defaultUserRoleView:
       │     effectiveUserRole === 'admin' ──► 'admin'
       │     else                          ──► standardUserRoleView
       └─► isAdmin calculation:
             DEV mode: effectiveUserRole === 'admin' || currentUser?.role === 'admin' || currentUser?.id === 'admin_1513'
             PROD mode: Boolean(authenticatedUserId && (currentUser?.role === 'admin' || userRole === 'admin')) || currentUser?.id === 'admin_1513'
       │
       ▼
[4. View Resolution]
       ├─► pathParts = location.pathname.split('/').filter(Boolean)
       ├─► viewStr = pathParts[pathParts.length - 1]
       └─► view = validViews.includes(viewStr) 
                    ? viewStr 
                    : viewStr.startsWith('inner_page_') 
                        ? viewStr 
                        : (currentUser ? defaultUserRoleView : 'landing')
       │
       ▼
[5. Security & Role Guards]
       ├─► Non-auth access to private routes ──► setView('login')
       ├─► Non-admin attempting admin views ──► toast.error(...) + setView(standardUserRoleView)
       └─► roleRequiredViews:
             audit_logs, idari_portal, yonetim_konsolu, admin_console ──► ['admin']
             academic                                                ──► ['admin', 'academic_staff']
             company, company_ats, create_job                        ──► ['admin', 'company', 'employer']
             club_admin                                              ──► ['admin', 'student', 'alumni']
```

---

### 2.4 Complete `validViews` Catalogue (78 Items)

The `validViews` array at `App.jsx:103` contains 78 tokens, categorized here by functional domain and user access:

| Domain | Views | Target Components |
|---|---|---|
| **Public & Auth** (10) | `landing`, `login`, `register`, `forgot_password`, `contact`, `contact_us`, `about_us`, `services`, `gizlilik`, `kullanim`, `kvkk` | `LandingPage`, `Login`, `Register`, `ForgotPassword`, `ContactPage`, `AboutUsPage`, `ServicesPage`, `DynamicContentPage` |
| **Student Hive Core** (18) | `student`, `student_analytics`, `student_kgb`, `cvbuilder`, `interview_sim`, `applications`, `career_test`, `career_roadmap`, `startup_incubator`, `smart_certs`, `digital_portfolio`, `reward_store`, `metaverse_library`, `hackathon_market`, `club_portal`, `club_admin`, `sem`, `staj` | `StudentFeed`, `StudentAnalytics`, `StudentKGBPanel`, `AICVBuilder`, `InterviewSimulator`, `ApplicationsPanel`, `CareerTest`, `CareerRoadmap`, `StartupIncubator`, `SmartCertificates`, `DigitalPortfolio`, `RewardStore`, `MetaverseLibrary`, `HackathonMarket`, `StudentClubPortal`, `ClubAdminPanel`, `SemPanel`, `StajPanel` |
| **Alumni Hive Core** (7) | `alumni`, `mbs`, `alumni_card`, `alumni_assoc_portal`, `mezun_dernek`, `birlik_agi`, `alumni_dao` | `AlumniFeed`, `AlumniInformationSystem`, `AlumniCardWallet`, `AlumniAssocPortal`, `BirlikAgiPortal`, `AlumniDAO` |
| **Company Hive Core** (3) | `company`, `company_ats`, `create_job` | `CompanyFeed`, `CompanyATSBoard`, `JobCreator` |
| **Academic Hive Core** (2) | `academic`, `research_hub` | `AcademicStaffFeed`, `ResearchOSHub` |
| **Admin Central & CMS** (6) | `admin`, `admin_cms`, `yonetim_konsolu`, `admin_console`, `idari_portal`, `audit_logs` | `AdminFeed`, `AdminDashboard`, `KGMManagementConsole`, `IdariPortal`, `AuditLogsPanel` |
| **Cross-Hive Common** (32) | `jobs`, `user_profile`, `public_profile`, `profile_update`, `explore`, `network`, `groups`, `group_profile`, `notifications`, `calendar`, `messaging`, `leaderboard`, `live_rooms`, `mentor_match`, `mentor_booking`, `virtual_fair`, `wallet`, `global_map`, `campus_map`, `anka_chat`, `bmi_calculator`, `sksdb_lunch`, `sksdb_clubs`, `bidb_status`, `bidb_helpdesk`, `kariyer_board`, `events_list`, `organization`, `haberler`, `duyurular`, `etkinlikler`, `news`, `events`, `knowledge_portal` | `JobsAndInternships`, `UserProfile`, `PublicUserProfile`, `ProfileUpdate`, `ExploreFeed`, `CareerNetwork`, `GroupsPanel`, `GroupProfile`, `NotificationsPanel`, `CalendarView`, `MessagingInterface`, `LeaderboardPanel`, `LiveRoomsPanel`, `MentorMatch`, `MentorBooking`, `VirtualCareerFair`, `IesuWallet`, `GlobalAlumniMap`, `CampusMap`, `AnkaChat`, `BMICalculatorModal`, `SKSDBLunchWidget`, `SKSDBClubsDirectory`, `BIDBSystemStatusCard`, `BIDBHelpdeskModal`, `KariyerJobBoard`, `EventsPage`, `OrganizationChart`, `PublicNewsView`, `KnowledgePortal` |

---

### 2.5 Current View Routing Mechanism

Currently, routing is handled not by React Router `<Routes>` / `<Route>`, but via an unrolled inline JSX switch block spanning from line 405 to line 656:
```jsx
{view === 'landing' && <LandingPage ... />}
{view.startsWith('inner_page_') && <DynamicContentPage ... />}
{view === 'login' && <Login ... />}
...
{view === 'student' && <StudentFeed ... />}
{view === 'alumni' && <AlumniFeed ... />}
{view === 'academic' && <AcademicStaffFeed ... />}
{view === 'company' && <CompanyFeed ... />}
...
{view === 'kvkk' && <DynamicContentPage ... />}
```

Navigation is triggered by `setView(nextView)`:
```jsx
const setView = useCallback((v) => {
  const nextView = typeof v === 'function' ? v(view) : v;
  if (nextView !== view && view !== 'login' && view !== 'register') {
    setPreviousView(view);
  }
  if (logAction) {
    logAction(currentUser?.name || 'Ziyaretçi', `Sayfa Değiştirildi -> ${nextView.toUpperCase()}`, "Navigasyon");
  }
  const targetPath = nextView === 'landing' ? '/' : '/' + nextView;
  navigate(targetPath, { replace: false });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [view, navigate, setPreviousView, logAction, currentUser]);
```

---

### 2.6 Global Modals & Overlays

1. **`ToastContainer`** (`src/components/shared/Toast`): Mounted globally at root level, exposes `window.toast`.
2. **`NotificationEngine`** (`src/components/NotificationEngine`): Listens for system notifications and dispatches audio/visual alerts.
3. **`ErrorBoundary`** (`src/components/ErrorBoundary`): Encompasses all rendering to prevent white-screen crashes.
4. **`FloatingChatWidget`** (`src/components/FloatingChatWidget`): Mounted when user is logged in, view is not auth/messaging, and not an inner page.
5. **`SurveyPopupModal`** (`src/components/SurveyPopupModal`): Automatically polls / pops up student/alumni satisfaction evaluation surveys.
6. **`CommandPalette`** (`src/components/CommandPalette`): Global shortcut overlay activated via `Ctrl+K` or `Cmd+K`.
7. **`PWAInstallPrompt`** (`src/components/PWAInstallPrompt`): Listens for browser `beforeinstallprompt` to prompt PWA installation.
8. **`GlobalSearchOverlay`** (`src/components/GlobalSearchOverlay`): Triggerable full-text search overlay across university entities.
9. **Emergency Maintenance Mode**: Renders if `siteConfig.maintenanceMode === true` and user is not admin.

---

## 3. Deep-Dive of Portal Feed Components

Each portal feed is a large, feature-rich component acting as the home screen of its respective user role.

### 3.1 `src/components/StudentFeed.jsx` (988 lines)
- **Props accepted**:
  ```jsx
  export default function StudentFeed({
    setView,
    setSelectedUserId,
    currentUser,
    userRole,
    academicRole,
    setSelectedGroupId
  })
  ```
- **Zustand store interactions**:
  - *Reads*: `posts, notifications, surveys, news, events, generalEvents, careerOpportunities, students, alumni, companies, featuredOpportunities, mentorships, voluntaryInternships, applications, jobs, academicStaff, announcements, groups, featureAlumniAssocToggle, featureClubsShowcase, featureClubApplications, clubs, clubApplications, messages, featureSurveys, featureAlumniCard, alumniCardApplications, alumniCardForms`
  - *Writes*: `setPosts, setNotifications, setApplications, setGroups, setClubs, setClubApplications, setMessages, setAlumniCardApplications, setActivePortalBranch('student')`
- **Internal Subviews (controlled via `activeTab`)**:
  - `activeTab === 'feed'`: Main LinkedIn-style timeline ("Senin İçin" vs "Ağım"), renders `PostCard` components through `combineFeedItems`.
  - `activeTab === 'create_post'`: In-place `PostComposer`.
  - `activeTab === 'search'`: In-place `ExploreFeed`.
  - `activeTab === 'team_mentor'`: `TeamUpMentorHub`.
  - `activeTab === 'surveys'`: `AlumniSurveys`.
  - `activeTab === 'clubs'`: `ClubsDirectory`.
  - `activeTab === 'career_network'`: `CareerNetwork`.
  - `activeTab === 'applications'`: `ApplicationsPanel` (in-app modal).
  - `activeTab === 'messaging'`: `MessagingInterface` (in-app modal).
  - `activeTab === 'cv_builder'`: `AICVBuilder` (in-app modal).
- **In-App Popups & Modals**:
  - Verified Mentors Directory (`showMentorsModal`)
  - Mezun Kartı Application Modal (`showCardModal`)
  - Mentorship Application Modal (`showMentorshipModal`)
  - KGM News Popup Modal (`selectedNewsItem`)
  - Career Shorts Video Modal (`showShorts`)
  - `FooterModals`
- **External `setView` transitions**:
  - `user_profile`, `profile_update`, `student_kgb`, `notifications`, `jobs`, `mbs`.

---

### 3.2 `src/components/AlumniFeed.jsx` (841 lines)
- **Props accepted**:
  ```jsx
  export default function AlumniFeed({
    setView,
    setSelectedUserId,
    currentUser,
    userRole,
    academicRole,
    setSelectedGroupId
  })
  ```
- **Zustand store interactions**:
  - *Reads*: `posts, notifications, surveys, news, events, generalEvents, careerOpportunities, students, alumni, companies, featuredOpportunities, mentorships, voluntaryInternships, applications, jobs, academicStaff, announcements, groups, featureClubsShowcase, featureClubApplications, clubs, clubApplications, messages, featureSurveys, featureAlumniCard, alumniCardApplications, alumniCardForms`
  - *Writes*: `setPosts, setNotifications, setApplications, setGroups, setClubs, setClubApplications, setMessages, setAlumniCardApplications, setActivePortalBranch('alumni')`
- **Internal Subviews (controlled via `activeTab`)**:
  - `activeTab === 'feed'`: Alumni community timeline with "Mezunlar Derneği" link and survey banner.
  - `activeTab === 'create_post'`: In-place `PostComposer`.
  - `activeTab === 'search'`: In-place `ExploreFeed`.
  - `activeTab === 'surveys'`: `AlumniSurveys`.
  - `activeTab === 'clubs'`: `ClubsDirectory`.
- **In-App Popups & Modals**:
  - Mentorship application modal (`showMentorshipModal`)
  - Events list modal (`showEventsModal`)
  - News detail modal (`selectedNewsItem`)
  - Career shorts modal (`showShorts`)
- **External `setView` transitions**:
  - `user_profile`, `mbs`, `mezun_dernek`, `notifications`, `jobs`.

---

### 3.3 `src/components/CompanyFeed.jsx` (1497 lines)
- **Props accepted**:
  ```jsx
  export default function CompanyFeed({
    setView,
    setSelectedUserId,
    currentUser,
    userRole,
    academicRole,
    setSelectedGroupId
  })
  ```
- **Zustand store interactions**:
  - *Reads*: `posts, stories, notifications, surveys, news, events, generalEvents, careerOpportunities, students, alumni, companies, featuredOpportunities, mentorships, voluntaryInternships, applications, jobs, adminMessages, academicStaff, announcements, groups, featureClubsShowcase, featureClubApplications, clubs, clubApplications, messages, featureSurveys, featureAlumniCard, alumniCardApplications, alumniCardForms, featureCareerFair, careerFairEvent, careerFairFormTemplate, careerFairApplications`
  - *Writes*: `setPosts, setStories, setNotifications, setMentorships, setApplications, setAdminMessages, setGroups, setClubs, setClubApplications, setMessages, setAlumniCardApplications, setCareerFairApplications`
- **Top-Level Conditional Guard**:
  - If `isCreatingJob === true`, renders `<JobCreator setView={...} currentUser={currentUser} />` directly.
- **Internal Subviews (controlled via `activeTab`)**:
  - `activeTab === 'feed'`: Official KGM-moderated feed for enterprise partners.
  - `activeTab === 'create_post'`: In-place `PostComposer`.
  - `activeTab === 'search'`: In-place `ExploreFeed`.
  - `activeTab === 'surveys'`: `AlumniSurveys`.
- **In-App Popups & Modals**:
  - Virtual Career Fair Application Modal (`showFairModal`)
  - Admin message dispatch modal (`showAdminMsgModal`)
  - Candidate CV Detailed Printable Modal (`selectedCandidateCvModal`)
  - `FooterModals`
- **External `setView` transitions**:
  - `company_ats`, `admin`, `notifications`, `user_profile`.

---

### 3.4 `src/components/AcademicStaffFeed.jsx` (1529 lines)
- **Props accepted**:
  ```jsx
  export default function AcademicStaffFeed({
    setView,
    setSelectedUserId,
    currentUser,
    userRole,
    academicRole
  })
  ```
- **Zustand store interactions**:
  - *Reads*: `posts, news, events, generalEvents, careerOpportunities, announcements, jobs, students, alumni, companies, academicStaff, surveys, groups, academicApprovals, notifications, messages, adminMessages, internships`
  - *Writes*: `setPosts, setStudents, setAcademicApprovals, setNotifications, setMessages, setAdminMessages, setInternships`
- **Internal Subviews (controlled via `isRadarOpen` and `activeTab`)**:
  - If `isRadarOpen === true`:
    - `activeTab === 'approvals'`: Internship document approval desk.
    - `activeTab === 'counseling'`: Student counseling & appointment desk.
    - `activeTab === 'radar'`: Live intern tracking radar.
    - `activeTab === 'dashboard'`: Department employment analytics.
  - If `isRadarOpen === false`:
    - `activeTab === 'dashboard'`: Academic staff newsfeed & pending approval summary.
    - `activeTab === 'career_network'`: In-place `CareerNetwork`.
    - `activeTab === 'messaging'`: `MessagingInterface` (in-app modal).
- **In-App Popups & Modals**:
  - Document review modal (`selectedDocModal`)
  - Counseling request reply modal (`selectedCounselingModal`)
  - Admin direct message modal (`showAdminMsgModal`)
- **External `setView` transitions**:
  - `user_profile`, `notifications`, `academic`.

---

### 3.5 Admin View Rendering
When `isAdmin` is true and an admin view is targeted, `App.jsx` delegates to:
1. **`AdminFeed.jsx`** (729 lines) for `view === 'admin'` or `view === 'explore'`: Executive administration feed with quick approval buttons, counseling approvals, and multi-branch feed filters.
2. **`AdminDashboard.jsx`** (584 lines) for `view === 'admin_cms'`: Complete CMS panel orchestrating 40+ management modules (events, students, alumni, companies, surveys, site settings, audit logs, feature toggles).
3. **`KGMManagementConsole.jsx`** (668 lines) for `view === 'yonetim_konsolu'` or `view === 'admin_console'`: Accreditation, evaluation, and institutional score console.

---

## 4. Requirement R4 Architecture Plan: Per-Hive Root Components

### 4.1 Concept & Boundaries
Requirement R4 mandates that each user-role portal becomes an autonomous "Hive Cell":
- **`src/hives/student/StudentHive.jsx`** (🎓 Student Hive)
- **`src/hives/alumni/AlumniHive.jsx`** (🟢 Alumni Hive)
- **`src/hives/company/CompanyHive.jsx`** (🏢 Company Hive)
- **`src/hives/academic/AcademicHive.jsx`** (👨‍🏫 Academic Hive)

Each Hive Root component:
1. **Wraps its subtree in its own `HiveContext.Provider`**: Injects theme tokens without prop drilling.
2. **Accepts only `currentUser` from `App.jsx`**:
   `<StudentHive currentUser={currentUser} />`
3. **Owns its internal router via isolated store**: Reads and updates `activeView` from `useStudentStore`, `useAlumniStore`, etc. (NOT the global store).
4. **Wraps feed components AS-IS**: The existing large feed components (`StudentFeed.jsx`, etc.) remain completely unchanged and are rendered when `activeView === 'feed'`.

---

### 4.2 The Hive Wrapper Pattern

Because `StudentFeed`, `AlumniFeed`, `CompanyFeed`, and `AcademicStaffFeed` accept `setView`, the Hive component simply provides its store's `setActiveView` as the `setView` callback:

```jsx
// src/hives/student/StudentHive.jsx
import React, { Suspense, lazy } from 'react';
import { StudentHiveProvider } from './HiveContext';
import useStudentStore from './store/useStudentStore';

// Lazily imported subviews
const StudentFeed = lazy(() => import('../../components/StudentFeed'));
const JobsAndInternships = lazy(() => import('../../components/JobsAndInternships'));
const UserProfile = lazy(() => import('../../components/UserProfile'));
const PublicUserProfile = lazy(() => import('../../components/PublicUserProfile'));
const StudentKGBPanel = lazy(() => import('../../components/StudentKGBPanel'));
const StudentAnalytics = lazy(() => import('../../components/StudentAnalytics'));
const AICVBuilder = lazy(() => import('../../components/AICVBuilder'));
const ApplicationsPanel = lazy(() => import('../../components/ApplicationsPanel'));
const MessagingInterface = lazy(() => import('../../components/MessagingInterface'));
const NotificationsPanel = lazy(() => import('../../components/NotificationsPanel'));
const CalendarView = lazy(() => import('../../components/CalendarView'));
const ExploreFeed = lazy(() => import('../../components/ExploreFeed'));
// ... remaining student-accessible subviews

export default function StudentHive({ currentUser }) {
  const activeView = useStudentStore(state => state.activeView);
  const setActiveView = useStudentStore(state => state.setActiveView);
  const previousView = useStudentStore(state => state.previousView);

  // Safe handler compatible with child components calling setView(v => ...)
  const handleSetView = (next) => {
    setActiveView(next);
  };

  return (
    <StudentHiveProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        {/* Render internal views based on activeView */}
        {(activeView === 'feed' || activeView === 'student') && (
          <StudentFeed 
            setView={handleSetView} 
            currentUser={currentUser} 
            userRole="student"
          />
        )}
        {activeView === 'jobs' && (
          <JobsAndInternships 
            setView={handleSetView} 
            previousView={previousView} 
            currentUser={currentUser} 
            userRole="student" 
          />
        )}
        {activeView === 'user_profile' && (
          <UserProfile 
            viewerHive="student"
            setView={handleSetView} 
            previousView={previousView} 
            currentUser={currentUser} 
          />
        )}
        {activeView === 'public_profile' && (
          <PublicUserProfile 
            viewerHive="student"
            setView={handleSetView} 
            previousView={previousView} 
            currentUser={currentUser} 
          />
        )}
        {activeView === 'student_kgb' && (
          <StudentKGBPanel 
            setView={handleSetView} 
            previousView={previousView} 
            currentUser={currentUser} 
            userRole="student" 
          />
        )}
        {/* Other student hive views */}
      </Suspense>
    </StudentHiveProvider>
  );
}
```

### 4.3 View Distribution Across Hives

| Hive | Internal Views Supported |
|---|---|
| **Student Hive** (`StudentHive.jsx`) | `feed`, `student`, `jobs`, `user_profile`, `public_profile`, `profile_update`, `student_kgb`, `student_analytics`, `cvbuilder`, `interview_sim`, `applications`, `career_test`, `career_roadmap`, `startup_incubator`, `smart_certs`, `digital_portfolio`, `reward_store`, `metaverse_library`, `hackathon_market`, `club_portal`, `club_admin`, `sem`, `staj`, `explore`, `network`, `groups`, `group_profile`, `notifications`, `calendar`, `messaging`, `leaderboard`, `live_rooms`, `mentor_match`, `mentor_booking`, `virtual_fair`, `wallet`, `campus_map`, `anka_chat`, `bmi_calculator`, `sksdb_lunch`, `sksdb_clubs`, `bidb_status`, `bidb_helpdesk`, `kariyer_board`, `knowledge_portal` |
| **Alumni Hive** (`AlumniHive.jsx`) | `feed`, `alumni`, `jobs`, `user_profile`, `public_profile`, `profile_update`, `mbs`, `alumni_card`, `alumni_assoc_portal`, `mezun_dernek`, `birlik_agi`, `alumni_dao`, `global_map`, `explore`, `network`, `groups`, `group_profile`, `notifications`, `calendar`, `messaging`, `live_rooms`, `mentor_booking`, `virtual_fair`, `wallet`, `campus_map` |
| **Company Hive** (`CompanyHive.jsx`) | `feed`, `company`, `company_ats`, `create_job`, `jobs`, `user_profile`, `public_profile`, `profile_update`, `applications`, `virtual_fair`, `notifications`, `calendar`, `messaging`, `network`, `groups`, `group_profile` |
| **Academic Hive** (`AcademicHive.jsx`) | `feed`, `academic`, `research_hub`, `jobs`, `user_profile`, `public_profile`, `profile_update`, `notifications`, `calendar`, `messaging`, `network`, `groups`, `group_profile` |

---

## 5. Requirement R6 Architecture Plan: `App.jsx` Simplification (<150 Lines)

### 5.1 Architecture & Responsibility Shift
All 65 individual lazy component imports, the 78-item `validViews` array, and the 250-line JSX conditional rendering block are moved out of `App.jsx`.

`App.jsx` becomes strictly a **top-level Hive Selector & Global Overlay Host**:
1. Initializes authentication state (`currentUser`, Firebase `onAuthStateChanged`).
2. Computes `activeHive`:
   - `currentUser.role === 'alumni' ? 'alumni'`
   - `currentUser.role === 'company' || currentUser.role === 'employer' ? 'company'`
   - `currentUser.role === 'academic' ? 'academic'`
   - `currentUser.role === 'admin' ? 'admin'`
   - fallback: `'student'`
3. Displays unauthenticated routes (`LandingPage`, `Login`, `Register`, `ForgotPassword`, dynamic pages) if `!currentUser`.
4. Renders the appropriate Hive component if `currentUser` is present.
5. Hosts global persistent overlays (`ToastContainer`, `NotificationEngine`, `FloatingChatWidget`, `SurveyPopupModal`, `CommandPalette`, `PWAInstallPrompt`, `GlobalSearchOverlay`).

---

### 5.2 Target `src/App.jsx` Specification (<120 lines)

```jsx
import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import useAppStore from './store/useAppStore';
import { ToastContainer, toast } from './components/shared/Toast';
import NotificationEngine from './components/NotificationEngine';
import ErrorBoundary from './components/ErrorBoundary';

window.toast = toast;

// Auth & Public Views
const LandingPage = lazy(() => import('./components/LandingPage'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const DynamicContentPage = lazy(() => import('./components/DynamicContentPage'));

// Per-Hive Root Components
const StudentHive = lazy(() => import('./hives/student/StudentHive'));
const AlumniHive = lazy(() => import('./hives/alumni/AlumniHive'));
const CompanyHive = lazy(() => import('./hives/company/CompanyHive'));
const AcademicHive = lazy(() => import('./hives/academic/AcademicHive'));
const AdminFeed = lazy(() => import('./components/AdminFeed'));

// Global Overlays
const FloatingChatWidget = lazy(() => import('./components/FloatingChatWidget'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt'));
const SurveyPopupModal = lazy(() => import('./components/SurveyPopupModal'));
const GlobalSearchOverlay = lazy(() => import('./components/GlobalSearchOverlay'));

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '') || 'landing';

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_mock_user') || localStorage.getItem('igu_mock_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Firebase auth state hydration
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) setCurrentUser({ id: user.uid, ...snap.data() });
        } catch (e) { console.error('Auth hydration error', e); }
      }
    });
  }, []);

  // Active Hive computation
  const activeHive = useMemo(() => {
    if (!currentUser) return null;
    const role = currentUser.role;
    if (role === 'alumni') return 'alumni';
    if (role === 'company' || role === 'employer') return 'company';
    if (role === 'academic') return 'academic';
    if (role === 'admin' || currentUser.id === 'admin_1513') return 'admin';
    return 'student';
  }, [currentUser]);

  const setView = (v) => navigate(v === 'landing' ? '/' : '/' + v);

  // Unauthenticated routing
  if (!currentUser) {
    if (path === 'login') return <Suspense fallback={null}><Login setView={setView} setCurrentUser={setCurrentUser} /></Suspense>;
    if (path === 'register') return <Suspense fallback={null}><Register setView={setView} setCurrentUser={setCurrentUser} /></Suspense>;
    if (path === 'forgot_password') return <Suspense fallback={null}><ForgotPassword setView={setView} /></Suspense>;
    if (path.startsWith('inner_page_')) return <Suspense fallback={null}><DynamicContentPage contentId={path.replace('inner_page_', '')} setView={setView} /></Suspense>;
    return <Suspense fallback={null}><LandingPage setView={setView} /></Suspense>;
  }

  return (
    <ErrorBoundary>
      <ToastContainer />
      <NotificationEngine />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin" /></div>}>
        {activeHive === 'student' && <StudentHive currentUser={currentUser} />}
        {activeHive === 'alumni' && <AlumniHive currentUser={currentUser} />}
        {activeHive === 'company' && <CompanyHive currentUser={currentUser} />}
        {activeHive === 'academic' && <AcademicHive currentUser={currentUser} />}
        {activeHive === 'admin' && <AdminFeed currentUser={currentUser} setView={setView} userRole="admin" />}

        {/* Global Overlays */}
        <FloatingChatWidget currentUser={currentUser} currentView={path} />
        <SurveyPopupModal currentUser={currentUser} currentView={path} />
        <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} currentUser={currentUser} setView={setView} />
        <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} setView={setView} />
        <PWAInstallPrompt />
      </Suspense>
    </ErrorBoundary>
  );
}
```
**Total lines**: **~98 lines** — easily fulfilling Requirement R6 (<150 lines).

---

## 6. Requirement R5 Linkage: Hive Context Persistence in Profiles

### 6.1 The Problem in Monolithic Architecture
In the existing codebase (`UserProfile.jsx:36-43` and `PublicUserProfile.jsx:240-248`), the profile header, buttons, and badges calculated their visual theme based on `previousView` or defaulted to `userType` (the subject's role). Consequently:
- An alumni viewing an academic profile would see a purple academic header.
- A student viewing an alumni profile would see an emerald header.

### 6.2 The Solution via `viewerHive`
Requirement R5 dictates that the UI theme **strictly follows the VIEWER**, never the content subject:
- `UserProfile` and `PublicUserProfile` accept a `viewerHive` prop (`'student' | 'alumni' | 'company' | 'academic' | 'admin'`).
- The profile header chrome, badge borders, follow buttons, and back buttons use `viewerHive` theme tokens from the Hive context.
- A badge is displayed: *"You are viewing from [Viewer Hive] portal"*.
- The profile's underlying data (name, title, academic papers, experience) remains unchanged.

Each Hive root passes its own identity:
- `StudentHive` passes `viewerHive="student"`
- `AlumniHive` passes `viewerHive="alumni"`
- `CompanyHive` passes `viewerHive="company"`
- `AcademicHive` passes `viewerHive="academic"`

---

## 7. Migration Roadmap for Team Implementers

To guarantee zero regressions and complete adherence to project invariants, implementation should proceed in five distinct phases:

### Phase 1: Shared Brain & Hives Scaffolding (R1, R2, R3)
1. Create `src/brain/eventBus.js` (`emit`, `on`, `off`, `once`).
2. Create `src/brain/useSharedStore.js` (posts, jobs, events, news, announcements).
3. Create `src/brain/useAdminStore.js` (CMS collections & configs).
4. Create four isolated hive store files:
   - `src/hives/student/store/useStudentStore.js`
   - `src/hives/alumni/store/useAlumniStore.js`
   - `src/hives/company/store/useCompanyStore.js`
   - `src/hives/academic/store/useAcademicStore.js`
5. Create four `HiveContext.jsx` files exporting theme tokens and `useHiveContext()`.

### Phase 2: Per-Hive Root Components (R4)
1. Create `StudentHive.jsx`, `AlumniHive.jsx`, `CompanyHive.jsx`, `AcademicHive.jsx`.
2. Wrap feed components (`StudentFeed.jsx`, etc.) AS-IS inside their respective Hives.
3. Wire internal views into each Hive router via `useXxxStore.activeView`.

### Phase 3: Profile Hive Context Persistence (R5)
1. Add `viewerHive` prop to `PublicUserProfile.jsx` and `UserProfile.jsx`.
2. Update header and button theme resolvers to use `viewerHive`.
3. Add the context viewer badge: *"You are viewing from [ViewerHive] portal"*.

### Phase 4: `App.jsx` Simplification (R6)
1. Replace monolithic 684-line `App.jsx` with the streamlined ~98-line Hive Selector.
2. Verify all global modals (`FloatingChatWidget`, `CommandPalette`, `PWAInstallPrompt`, `SurveyPopupModal`) function properly.

### Phase 5: Verification & Testing
1. Run `npx vitest run` — verify all 40 test files (360 tests) pass.
2. Run `npx vite build` — verify exit code 0 and bundle chunking.
3. Validate line count of `src/App.jsx` is strictly `< 150 lines`.
4. Validate size of `src/store/useAppStore.js` is strictly `< 12 KB`.
