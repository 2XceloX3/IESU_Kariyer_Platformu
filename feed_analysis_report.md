# İESÜ Kariyer Platformu — Feed Component Analysis Report

## 1. Executive Summary

This report analyzes the 4 role-specific feed components (Student, Alumni, Company, Academic Staff), 2 shared components (PostCard, ExploreFeed), and 46 admin panels in the İESÜ Kariyer Platformu codebase, combined with external research on university career center best practices and LinkedIn-style feed patterns.

---

## 2. Component Overview

| Component | Lines | File Size | Primary Function |
|-----------|-------|-----------|-----------------|
| `StudentFeed.jsx` | 931 | 63,447 B | Student dashboard with feed, jobs, network, clubs |
| `AlumniFeed.jsx` | 840 | 56,397 B | Alumni dashboard with feed, mentoring, network |
| `CompanyFeed.jsx` | 752 | 50,409 B | Employer dashboard with ATS, career fair, candidate search |
| `AcademicStaffFeed.jsx` | 506 | 35,159 B | Professor dashboard with approvals, radar, badge center |
| `PostCard.jsx` | 616 | 34,926 B | Reusable post card (shared across all feeds) |
| `ExploreFeed.jsx` | 244 | 13,296 B | Social discovery & search (shared) |
| `feedCombiner.js` | 84 | 3,481 B | Utility merging posts/events/news/jobs |

---

## 3. Shared Architecture — All Feeds

### 3.1 Common Layout (3-Column)

All 4 feeds share the same 3-column layout replicating LinkedIn's design:
- **Left Panel (300px)**: Profile card + admin shortcut
- **Center Panel (max 600px)**: Stories bar, feed tabs, PostCard stream
- **Right Panel (300px)**: KGM Haberleri, Keşfet widget, mentoring CTA, footer

### 3.2 Shared Imports

Every feed imports these identical components:
- `PostCard.jsx` — Renders individual posts
- `PostComposer.jsx` — Create/edit posts
- `ExploreFeed.jsx` — Search & discover content
- `StoriesBar.jsx` — Instagram-style story circles
- `CareerShorts.jsx` — TikTok-style short videos
- `CareerNetwork.jsx` — Visual career connection network
- `MessagingInterface.jsx` — Full messaging overlay
- `CareerRadar.jsx` — Career insights panel
- `TopProfileMenu.jsx` — User avatar dropdown menu
- `Logo.jsx` — University branding
- `FooterModals.jsx` — Legal/help modals
- `NavIcon.jsx` (shared/) — Reusable nav icon
- `combineFeedItems()` — Merges posts/events/news/announcements/jobs into a single feed

### 3.3 Common Store Subscriptions

All feeds subscribe from `useAppStore` to:
- posts, stories, notifications, news, events
- students, alumni, companies
- messages, groups, clubs
- featuredOpportunities, mentorships, applications
- surveys, announcements, academicStaff

### 3.4 Identical Navbar Structure

Every feed has a near-identical glassmorphism navbar with:
- Left: Star icon → create_post
- Center: Logo + "İstanbul Esenyurt Üniversitesi / Kariyer Portalı"
- Right: Bell notifications + TopProfileMenu

### 3.5 Instagram-Style Floating Dock

StudentFeed, AlumniFeed, CompanyFeed all have a `fixed bottom` dock with: Home, Jobs/Briefcase, Search (center, prominent), Messaging, Profile avatar. AcademicStaffFeed has a similar dock but slightly different layout.

### 3.6 Identical Overlay Modals

All feeds share these identical overlay implementations:
- ApplicationsPanel overlay (activeTab === 'applications')
- MessagingInterface overlay (activeTab === 'messaging')
- CalendarPlanning overlay (activeTab === 'calendar')
- AICVBuilder overlay (activeTab === 'cvbuilder')
- Mezun Kartı modal (showCardModal)
- Mentorship Application modal (showMentorshipModal)

---

## 4. Role-Specific Features — What Makes Each Unique

### 4.1 StudentFeed.jsx (931 lines)

**Role**: Active student

**Unique Tabs/Navigation**:
- `activeTab` states: feed, create_post, search, team_mentor, surveys, clubs, career_network, calendar, cvbuilder, applications, messaging
- Has `TeamUpMentorHub` (team_mentor tab) — NOT in other feeds
- Club management via `ClubsDirectory` (clubs tab) — NOT in other feeds
- `featureAlumniAssocToggle` → Mezunlar Derneği button in feed tabs
- `getManagedClubs()` — Shows club management if user is a club president

**Unique Right Panel Widgets**:
- `DailyQuestsPanel` — Gamification (daily quests)
- Mentor Olun CTA (teal/emerald themed)
- Featured Opportunities section
- Mentorships section (active programs)

**Left Panel**:
- Shows admin profile+admin button when userRole==='admin'
- Shows student profile with "Kariyer Durumunu Güncelle" CTA
- Network count, post count stats
- "Kariyer Durumunu Güncelle" button

**Feed Tabs**: "Senin İçin" / "Ağım" / "Mezunlar Derneği" (conditional)

**Dock Icons**: Home, Jobs, Search, Surveys (conditional), Messages, Profile

**Bottom Line**: Most feature-rich feed. Combines social networking, career development, clubs, and mentoring.

---

### 4.2 AlumniFeed.jsx (840 lines)

**Role**: Graduate/Alumni

**Unique Aspects**:
- SEO title: "Mezun Paneli"
- `setMentorships` state from store — writes back (StudentFeed doesn't have this setter)
- Feed filter for 'following' checks `post.author?.role === 'alumni' || post.category === 'Mezun'` — alumni-specific filtering
- Same activeTab states as StudentFeed but **missing**: team_mentor, clubs
- No `CareerNetwork` additional props (no `userRole`, `previousView`)
- No `DailyQuestsPanel`

**Left Panel**: 
- Shows "Mezun Bilgi Sistemi" styled differently with user graduation info
- "Kariyer Durumunu Güncelle" button

**Right Panel**: 
- Mentor Olun widget (blue-themed instead of teal)
- Same KGM Haberleri, Keşfet, MBS shortcut

**Dock Icons**: Same as StudentFeed (Home, Jobs, Search, Surveys, Messages, Profile)

**Bottom Line**: Slightly simplified version of StudentFeed — fewer social features (no clubs, no team mentoring hub, no daily quests), more focus on alumni networking.

---

### 4.3 CompanyFeed.jsx (752 lines)

**Role**: Employer/Corporate

**Unique Features (Career-Fair-Centric)**:
- `featureCareerFair` — Career fair banner with registration form
- `careerFairEvent` — Fair details from store
- `careerFairApplications` — Company fair applications
- `setCareerFairApplications` — Write-back to store
- `handleFairSubmit()` — Career fair participation form
- `hasApplied` — Check if company already applied
- Dedicated Career Fair Modal (showFairModal)

**Unique Store Subscriptions**: featureCareerFair, careerFairEvent, careerFairFormTemplate, careerFairApplications, setCareerFairApplications

**Tabs**: feed, create_post, search, surveys, calendar, cvbuilder, applications, messaging
- **Missing**: team_mentor, clubs, career_network (no CareerNetwork tab)
- No `featureAlumniAssocToggle`
- No `featureClubsShowcase`, `featureClubApplications`

**Left Panel**:
- Shows **Corporate ATS Profile** with Active Listings (4) and Candidate Applications (28)
- "Yeni İlan / Staj Yayınla" button
- Admin view with "Firma İlan & Aday Yetkileri"

**Right Panel**:
- **Corporate ATS Summary Widget** — shows company's job listings with applicant counts
- **Candidate CV Search CTA** — "Yetenekli Öğrenci & Mezun CV Arama"
- "Tüm İlanları & Adayları Yönet" button
- No KGM Haberleri widget (replaced with ATS widgets)
- No DailyQuestsPanel
- No Mentorships section

**Dock Icons**: Home, Jobs, Search, Applications (FileText), Messages, Profile
- Center Search button uses `bg-gradient-to-tr from-[#990000] to-purple-900` (branded differently)
- Applications tab is dedicated dock item

**Footer Links**: Different legal links — "Kurumsal Sözleşme & KVKK", "Reklam Seçenekleri"

**Bottom Line**: Most unique feed — entirely employer-focused with ATS (Applicant Tracking System) features, career fair participation, and candidate sourcing. Least social, most transactional.

---

### 4.4 AcademicStaffFeed.jsx (506 lines)

**Role**: Professor/Academic Staff

**Unique Tab System**: `activeTab` = dashboard, approvals, radar, badges, search, career_network, messaging
- **Default**: 'dashboard' instead of 'feed'
- **No**: create_post, feed, surveys, clubs, team_mentor, applications, calendar, cvbuilder

**Unique Features**:
- **Radar/Yönetim Paneli** (collapsible, `isRadarOpen` state) — This is the core differentiator
  - 4 sub-tabs within radar:
    1. **dashboard** — Quick actions + department internship statistics
    2. **approvals** (Onay Havuzu) — Internship & ÇAP approval queue with accept/reject
    3. **radar** (Stajyer Radarı) — Table of student internships (name, company, status, term)
    4. **badges** (Rozet Merkezi) — Assign badges to students (Sınıf Temsilcisi, Kulüp Başkanı, etc.)
- `academicApprovals` store integration
- `stats` object: totalStudents (450), activeInterns (124), pendingApprovals (computed)
- `handleApproveInternship()` — Approve individual internship

**Left Panel**: 
- Profile card with student/intern counts
- "Radar & İstatistikler" button (opens radar panel)
- Student count (450), Intern count (124)

**Center Panel**:
- "Hoş Geldiniz" header with pending approvals badge
- Direct PostComposer (no separate composer tab)
- Feed stream using `combineFeedItems` but with role-appropriate content

**Right Panel**:
- Minimal — only KGM Haberleri + Keşfet widget
- No mentoring, no opportunities, no quests, no ATS

**Dock Icons**: Home (dashboard), Jobs, Search, Messages, Profile
- **No** Surveys, Applications, or Calendar in dock

**Bottom Line**: Most focused feed — centered on **academic administration** (internship approval workflow, student oversight, badge assignment). Least "social media"-like; most workflow/task-oriented. No PostComposer create_post tab, feed is secondary to dashboard.

---

## 5. Shared Component Analysis

### 5.1 PostCard.jsx (616 lines)

**Capabilities**:
- Like/unlike with heart animation (double-tap on images)
- Comment system (inline add/display)
- Bookmark
- Share (WhatsApp, Discord, link copy, internal messaging)
- Repost with comment
- Edit/Delete (if owner or admin)
- Survey participation (Likert scale + open text)
- Badge rendering (verified, top_voice, president, rep)
- PDF attachment display
- Video player
- Job quick-apply button
- Post menu (edit/delete for owners, report for others)

**Props**: post, currentUser, setPosts, setMessages (+ students/alumni arrays)

**State Split**: 10 useState hooks → too many for optimal performance (consider useReducer)

**Missing**: 
- No post-level analytics (views, shares count)
- No moderation flagging system (only "Şikayet Et" toast)
- No edit history tracking
- Comments not persisted to store (only local state)

### 5.2 ExploreFeed.jsx (244 lines)

**Capabilities**:
- Search bar (by content, author name, author role, title)
- Category pills: Tümü / Öğrenciler / Mezunlar / Firmalar / Akademisyenler
- Follow/unfollow users
- Masonry grid layout (2 columns on md+)
- Post detail modal (selectPost → show PostCard)

**Props**: posts, setView, setSelectedUserId, currentUser

**State**: searchQuery, activeCategory, followedUsers, selectedPost

**Missing**:
- No infinite scroll / pagination (loads all posts at once)
- No trending/hashtag system
- No content recommendations algorithm

### 5.3 feedCombiner.js (84 lines)

**Function**: `combineFeedItems(posts, events, news, announcements, jobs)`

- Merges all item types into a single sorted feed
- Auto-assigns admin author metadata to system-generated items
- Filters out statuses: 'Beklemede', 'Reddedildi', 'Taslak', 'Pasif'
- Sorts by deterministic timestamp from ID hash
- Converts events, news, announcements, jobs into a PostCard-compatible shape

**Limitation**: Uses deterministic fake dates from ID hashes rather than real timestamps.

---

## 6. Shared Component Map

```
                    ┌─────────────────────────────────────────┐
                    │              StudentFeed                 │
                    │  tabs: feed, create_post, search,        │
                    │  team_mentor, surveys, clubs,            │
                    │  career_network, calendar, cvbuilder     │
                    └────────────────┬────────────────────────┘
                                     │
                    ┌─────────────────────────────────────────┐
                    │              AlumniFeed                  │
                    │  tabs: feed, create_post, search,        │
                    │  surveys, career_network, calendar,      │
                    │  cvbuilder, applications, messaging      │
                    └────────────────┬────────────────────────┘
                                     │
                    ┌─────────────────────────────────────────┐
                    │              CompanyFeed                 │
                    │  tabs: feed, create_post, search,        │
                    │  surveys, career_network, calendar,      │
                    │  cvbuilder, applications, messaging      │
                    │  ★ Career Fair ★                        │
                    └────────────────┬────────────────────────┘
                                     │
                    ┌─────────────────────────────────────────┐
                    │           AcademicStaffFeed              │
                    │  tabs: dashboard, approvals, radar,      │
                    │  badges, search, career_network,         │
                    │  messaging                               │
                    │  ★ Internship Approval Workflow ★       │
                    └────────────────┬────────────────────────┘
                                     │
                                     ▼
           ┌───────────────────────────────────────────────────┐
           │                 Shared Components                  │
           │                                                   │
           │  PostCard.jsx ←─────── All feeds                  │
           │  ExploreFeed.jsx ←──── All feeds                  │
           │  PostComposer.jsx ←─── All feeds                  │
           │  StoriesBar.jsx ←───── All feeds                  │
           │  CareerShorts.jsx ←─── All feeds                  │
           │  CareerNetwork.jsx ←── All feeds (except Company) │
           │  MessagingInterface ←─ All feeds                  │
           │  TopProfileMenu.jsx ←─ All feeds                  │
           │  FooterModals.jsx ←─── All feeds                  │
           └───────────────────────────────────────────────────┘
```

---

## 7. Admin Panels Analysis

### 7.1 All Admin Panels (46 total in admin/)

| Panel | Type | Career Center Relevance |
|-------|------|------------------------|
| **CMSJobs.jsx** | Core | ★★★ Essential — Job/internship management |
| **CMSStudents.jsx** | Core | ★★★ Essential — Student database |
| **CMSAlumni.jsx** | Core | ★★★ Essential — Alumni database |
| **CMSCompanies.jsx** | Core | ★★★ Essential — Employer management |
| **CMSEvents.jsx** | Core | ★★★ Essential — Event management |
| **CMSNews.jsx** | Core | ★★★ Essential — News management |
| **CMSAnnouncements.jsx** | Core | ★★★ Essential — Announcements |
| **CMSMentorship.jsx** | Core | ★★★ Essential — Mentorship programs |
| **CMSFeatured.jsx** | Core | ★★★ Essential — Featured opportunities |
| **CMSVoluntaryInternships.jsx** | Core | ★★★ Essential — Internship management |
| **CMSSurveys.jsx** | Core | ★★★ Essential — Survey platform |
| **CMSAnalytics.jsx** | Core | ★★★ Essential — Analytics dashboard |
| **CMSCareerFair.jsx** | Core | ★★★ Essential — Career fair management |
| **CMSMessages.jsx** | Core | ★★★ Essential — Internal messaging |
| **CMSAcademicStaff.jsx** | Core | ★★★ Essential — Faculty database |
| **CMSAcademicApprovals.jsx** | Core | ★★★ Essential — Internship approval workflow |
| **CMSAlumniAssoc.jsx** | Support | ★★☆ Important — Alumni association |
| **CMSAlumniCard.jsx** | Support | ★★☆ Important — Alumni card system |
| **CMSGroups.jsx** | Support | ★★☆ Important — Groups/communities |
| **CMSClubs.jsx** | Support | ★★☆ Important — Student clubs |
| **CMSStaff.jsx** | Support | ★★☆ Important — Staff management |
| **CMSSyncCenter.jsx** | Support | ★★☆ Important — Data sync/import |
| **CMSDataPoolExport.jsx** | Support | ★★☆ Important — Data export |
| **CMSIntegrations.jsx** | Support | ★★☆ Important — External integrations |
| **PlatformSettings.jsx** | Support | ★★☆ Important — Platform config |
| **InstitutionalStatsManager.jsx** | Support | ★★☆ Important — Stats management |
| **CMSGallery.jsx** | Support | ★☆☆ Nice-to-have — Photo gallery |
| **CMSLiveRooms.jsx** | Support | ★☆☆ Nice-to-have — Live streaming |
| **CMSWorldMap.jsx** | Support | ★☆☆ Nice-to-have — Alumni world map |
| **CMSAISwarmCenter.jsx** | Novelty | ★☆☆ Novelty — AI agent coordination |
| **CMSAcademicCatalog.jsx** | Tangential | ★☆☆ Academic course catalog (not career center core) |
| **CMSSEMCourses.jsx** | Tangential | ★☆☆ SEM course management |
| **CMSSSP.jsx** | Tangential | ★☆☆ Social Service Procurement |
| **DataCleanup.jsx** | Utility | — Maintenance tool |
| **AttachmentUploader.jsx** | Utility | — Shared upload component |
| **MediaUploader.jsx** | Utility | — Media upload component |
| **AdminCMSLayout.jsx** | Shared | — Admin layout shell |
| **AdminShared.jsx** | Shared | — Shared admin components |
| **PanelHeader.jsx** | Shared | — Panel header component |
| **OverviewPanel.jsx** | Shared | — Dashboard overview |
| **CMSAuditLogs.jsx** | Support | ★★☆ Important — Audit trail |
| **CMSPortfolios.jsx** | Support | ★★☆ Important — Student portfolios |
| **CMSSEMCourses.jsx** | Tangential | — SEM training courses |
| **OperasyonPanel.jsx** | Support | — Operations panel |
| **AkademikPanel.jsx** | Support | — Academic panel |
| **OfficialContentImport.jsx** | Support | — Content import tool |

### 7.2 Essential Career Center Admin Panels

**Most critical (core career center operations)**:
1. CMSJobs — Job & internship postings with ATS
2. CMSStudents — Student profiles, CVs, activity
3. CMSAlumni — Alumni tracking, engagement
4. CMSCompanies — Employer accounts, partnerships
5. CMSEvents — Career fairs, workshops, webinars
6. CMSMentorship — Mentoring program management
7. CMSAnalytics — KPIs, placement stats, engagement metrics
8. CMSAcademicApprovals — Internship approval workflow

**Panels needing improvement**:
- CMSCareerFair (95KB!) — Extremely large, likely bloated; needs refactoring
- CMSDataPoolExport — Could be broken into smaller sub-components
- CMSAnalytics — Likely missing real-time data feeds
- CMSCompanies — Should integrate with ATS more tightly

**Panels NOT related to career center core**:
- CMSAcademicCatalog — Course catalog belongs in academic system
- CMSSEMCourses — SEM/continuing education (adjacent, not career center)
- CMSSSP — Social service procurement (not career center function)
- CMSWorldMap — Alumni map (nice-to-have, not core)
- CMSGallery — Photo gallery (not core)
- CMSLiveRooms — Live rooms (not core career center)

---

## 8. Key Issues Found

### 8.1 Code Duplication
- **Massive copy-paste**: StudentFeed, AlumniFeed, and CompanyFeed share ~70% identical code (navbar, left panel admin logic, right panel widgets, overlays, dock)
- feedFilter logic duplicated across 3 feeds
- handleCardSubmit, handleMentorSubmit identical across StudentFeed, AlumniFeed, CompanyFeed
- The dock/navigation bar is rewritten in every feed
- Overlay modals (applications, messaging, calendar, cvbuilder, mezun kartı, mentorship) are duplicated

### 8.2 Missing Features
- **No role-specific onboarding** — No first-time user experience for any role
- **No content moderation queue** — Only a "Şikayet Et" toast
- **No real notifications** — Mock badge count only
- **No analytics tracking** on posts
- **No pagination/infinite scroll** in any feed
- **No real-time updates** — All data is localStorage-bound
- **No saved searches** or job alert subscriptions
- **No company following** — follow state is local to ExploreFeed only
- **No accessibility audit** — aria labels present but incomplete

### 8.3 Performance Concerns
- PostCard: 10 separate useState hooks (consider useReducer)
- AcademicStaffFeed: 450/124 hardcoded stats
- combineFeedItems runs on every render (not memoized in some feeds)
- Large file sizes: StudentFeed 63KB, AlumniFeed 56KB, PostCard 35KB
- All feeds import ALL store properties regardless of need

### 8.4 State Management
- Inconsistent localStorage writes mixed with Zustand store
- setMentorships only present in AlumniFeed (bug: StudentFeed can't save mentorships)
- MessagingInterface overlay receives different props in each feed

---

## 9. Best Practices Research

### 9.1 University Career Center Platform Best Practices

1. **Comprehensive Dashboard** (NAFSA, AAC&U standards):
   - Student: Internship tracker, resume builder, mock interview scheduler, career fair registration
   - Alumni: Mentoring dashboard, job posting, networking events, giving back
   - Employer: ATS integration, recruitment events, branded company page
   - Faculty: Student progress tracking, internship approval, department stats

2. **Unified Activity Feed** (LinkedIn, Handshake models):
   - Aggregated content from all roles (jobs, events, news, posts)
   - Interest-based filtering (not just role-based)
   - Trending topics and recommended connections

3. **Career Development Pipeline**:
   - Year 1-2: Career exploration, skills assessment
   - Year 3-4: Internship placement, mentoring
   - Post-grad: Alumni networking, lifelong learning

4. **Key Industry Platforms**:
   - **Handshake** — Dominant university career platform; role-based portals, event RSVP, interview scheduling
   - **12Twenty** — Alumni-centric career platform with mentor matching
   - **Symplicity** — Comprehensive CSM with appointment booking, OCR
   - **LinkedIn for Education** — University-specific LinkedIn integration with alumni paths

### 9.2 LinkedIn-Style Feed Design Patterns

1. **Content Hierarchy**:
   - Top: Stories bar (visual, ephemeral)
   - Middle: Feed tabs (For You / Following) + filter pills
   - Main: Chronological card stream with like/comment/share

2. **Card Design**:
   - Avatar + Name + Role + Timestamp (header)
   - Content text (expandable)
   - Media (images, video, documents)
   - Engagement bar (like/comment/share/bookmark)
   - Comments section (collapsible, inline)

3. **Engagement Patterns**:
   - Like (simple toggle), Comment (inline), Share (modal with options)
   - Bookmark for save-for-later
   - Repost with commentary
   - Notification badges for interactions

4. **What İESÜ Does Well**:
   - LinkedIn-style 3-column layout ✓
   - Instagram-style stories ✓
   - TikTok-style CareerShorts ✓
   - Category pills in ExploreFeed ✓
   - Floating dock navigation ✓
   - Reply/repost/share modals ✓

5. **What's Missing (vs. LinkedIn)**:
   - No algorithm-driven recommendations
   - No "Who's viewed your profile"
   - No content moderation at scale
   - No sponsored/promoted content
   - No skill endorsements
   - No article publishing (long-form)

### 9.3 Role-Based Dashboard Patterns

| Feature | Student | Alumni | Employer | Academic |
|---------|---------|--------|----------|----------|
| Feed (social) | ✓ | ✓ | ✓ | ✓ |
| Create post | ✓ | ✓ | ✓ | ✗ (PostComposer inline) |
| Job board | ✓ | ✓ | ✓ (ATS) | ✗ |
| Profile | ✓ | ✓ | ✓ (Company) | ✓ |
| Messaging | ✓ | ✓ | ✓ | ✓ |
| Mentoring | ✓ | ✓ | ✗ | ✗ |
| Clubs | ✓ | ✗ | ✗ | ✗ |
| Surveys | ✓ | ✓ | ✓ | ✗ |
| CV Builder | ✓ | ✓ | ✗ | ✗ |
| Calendar | ✓ | ✓ | ✓ | ✗ |
| Career Network | ✓ | ✓ | ✗ | ✓ |
| Career Fair | ✗ | ✗ | ✓ | ✗ |
| Internship Approval | ✗ | ✗ | ✗ | ✓ |
| Badge Assignment | ✗ | ✗ | ✗ | ✓ |

---

## 10. Recommendations

### High Priority
1. **Extract a shared BaseFeed component** — Eliminate 70% code duplication across the 3 main feeds. Use composition with role-specific slots (left panel variant, right panel widgets, tabs config, dock config).
2. **Add infinite scroll / pagination** — All feeds load every post at once.
3. **Move PostCard state to useReducer** — 10 useState hooks is a performance risk.
4. **Fix setMentorships inconsistency** — StudentFeed and CompanyFeed don't save mentorship applications to store.
5. **Memoize combineFeedItems** — Several feeds call it on every render without useMemo.

### Medium Priority
6. **Add role-specific onboarding flows**
7. **Implement real notifications system** (replace mock badge counts)
8. **Add moderation queue to admin panels** — Report management
9. **Refactor CMSCareerFair.jsx** — 95KB is bloated
10. **Standardize MessagingInterface props across all feeds**

### Low Priority
11. **Prune non-career-center admin panels** (CMSAcademicCatalog, CMSSSP, CMSWorldMap, CMSGallery)
12. **Add Skill endorsements and recommendations algorithm**
13. **Add "Who viewed my profile" tracking**
14. **Add article publishing (LinkedIn long-form)**

---

## 11. Files Examined

| File | Path |
|------|------|
| StudentFeed.jsx | `src/components/StudentFeed.jsx` |
| AlumniFeed.jsx | `src/components/AlumniFeed.jsx` |
| CompanyFeed.jsx | `src/components/CompanyFeed.jsx` |
| AcademicStaffFeed.jsx | `src/components/AcademicStaffFeed.jsx` |
| PostCard.jsx | `src/components/PostCard.jsx` |
| ExploreFeed.jsx | `src/components/ExploreFeed.jsx` |
| feedCombiner.js | `src/utils/feedCombiner.js` |
| AdminDashboard.jsx | `src/components/AdminDashboard.jsx` |
| 46 admin panels | `src/components/admin/*.jsx` |
| 4 shared components | `src/components/shared/*.jsx` |
