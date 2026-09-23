# Original User Request

## Initial Request — 2026-07-24T00:00:19+03:00

Proje: İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi web sitesindeki (https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu) tüm verilerin (vizyon, misyon, hedefler, personel, etkinlikler, haberler ve varsa görsel referanslar) çekilerek IESU Kariyer Platformu'na entegre edilmesi ve sistemin çökme testine (Chaos Engineering) tabi tutulması.

Working directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu
Integrity mode: development

## Requirements

### R1. Veri Sömürme ve Ayrıştırma (Data Extraction)
Ajan ekibi (Browser ajanı dâhil) Esenyurt Kariyer Geliştirme Ofisi sayfasını tüm detaylarıyla (metinler, personeller, haberler, etkinlik içerikleri vb.) taramalı ve analiz etmelidir. "Her şeyi sömürme modu" aktif olmalı, mümkün olan en fazla yararlı içerik alınmalıdır.

### R2. Veritabanı (Mock) Güncellemesi
Elde edilen bu yepyeni veriler, projedeki `src/utils/mockData.js`, `src/utils/innerPagesData.js`, `src/utils/universityData.js` vb. dosyalara mantıklı bir yapıyla eklenmelidir. Yer tutucu (placeholder) veriler gerçek verilerle yer değiştirmelidir.

### R3. Güvenli Entegrasyon (Crash Prevention)
Eklenecek verilerin formatı (özellikle array'ler, image URL'leri, tanımlamalar) projede önceden kurulmuş olan arayüzleri (React componentlerini) bozmayacak şekilde olmalıdır. 

## Acceptance Criteria

### Veri Tamlığı ve Zenginliği
- [ ] Kariyer sayfasındaki Vizyon, Misyon, Hedefler vb. temel verilerin projeye aktarıldığı teyit edilmiş olmalı.
- [ ] Personel listesi veya haber duyuru içerikleri (sayfada var ise) tespit edilip `mockData` içerisine gömülmüş olmalı.

### Kaos (QA) Doğrulaması
- [ ] Bir "Chaos Engineer" veya Hakem ajan (QA), yeni veriler eklendikten sonra `npm run build` komutunun veya geliştirme sunucusunun başarıyla render alabildiğini doğrulamalıdır.
- [ ] UI tarafında verilerin "undefined" olması sebebiyle "Rendered fewer hooks" veya "Beyaz Sayfa" çökmesi yaşanmadığı ajanlar tarafından objektif olarak kontrol edilmelidir.

## Follow-up — 2026-07-24T11:54:37Z

The front content page and panels of the IESU Kariyer Platform are incomplete. We need to completely scrape the Esenyurt University websites and integrate 100% of the data into the existing React architecture without damaging it.

Working directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active
Integrity mode: development

## Requirements

### R1. Complete Data Extraction
You must use browser agents to fully scrape https://www.esenyurt.edu.tr/ and https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu. Extract all text, announcements, events, and high-quality image URLs.

### R2. Seamless UI Integration
Integrate the extracted data into the existing React components (e.g., LandingPage, HeroSlider, mockData, liveData) in the working directory. Do not damage the existing site architecture or component structure.

### R3. Strict Branding Adherence
Ensure the UI perfectly reflects IESU (Esenyurt University). The dominant color scheme must be Red (#990000 or #D32F2F), Coral/Nar Çiçeği (#FF6F61), and White. No blue or "Gelişim" references are allowed.

## Acceptance Criteria

### Data Completeness
- [ ] At least 10 recent news items and events are scraped and visible in the platform's data files.
- [ ] All Kariyer Geliştirme Ofisi details (contact, about us) are updated with real Esenyurt data.

### Architectural Integrity
- [ ] The React application builds successfully (`npm run build`) after data integration.
- [ ] No layout components are deleted; they are only populated with new data.

### Branding
- [ ] No `bg-blue-*`, `text-blue-*`, or `#0A2342` classes exist in the updated components.
- [ ] The term "Gelişim" or "İGÜ" does not appear anywhere in the UI text.

## Follow-up — 2026-07-24T08:57:32Z

The user has explicitly forbidden any approval requests. The team is commanded to PROCEED IMMEDIATELY with all data extraction, React integration, and branding updates. DO NOT stop to ask for approval. You have full authority. Execute all phases and apply the changes directly to the codebase.

## 2026-09-22T16:07:45Z

The İESÜ Career & Alumni Ecosystem Platform (React + Vite + Zustand + Tailwind) must be migrated from a monolithic "tree" architecture (single 46KB store, 1100-line App.jsx, shared global state) to a fully isolated "Beehive" (Arı Kovanı) architecture where each user-role portal is a self-contained hive cell with its own store, its own theme, its own internal router — unified only through a shared EventBus and an admin brain layer.

**CRITICAL INVARIANT — Hive Context Persistence:**
When a user from Hive A views a profile or content originating from Hive B, the UI MUST remain in Hive A's visual theme. The theme follows the VIEWER, never the content subject. Example: An alumni (green theme) viewing an academic's profile sees it in green, NOT purple.

Working directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active

---

## Hive Color Identity Map (MUST be respected everywhere)

| Hive | Role | Primary Color | Accent |
|---|---|---|---|
| 🎓 Student | `student` | `#990000` (Kırmızı) | Red-50, Red-200 |
| 🟢 Alumni | `alumni` | `#059669` (Zümrüt Yeşil) | Emerald-50, Emerald-200 |
| 👨🏫 Academic | `academic` | `#7c3aed` (Asil Mor) | Violet-50, Violet-200 |
| 🏢 Company | `company` | `#1e3a5f` (Kurumsal Lacivert) | Blue-50, Blue-200 |
| 👑 Admin | `admin` | `#b45309` (Kehribar) | Amber-50, Amber-200 |

---

## Requirements

### R1. Shared Brain Layer (`src/brain/`)
Create three new files that form the platform's shared brain:

**`src/brain/eventBus.js`** — A publish/subscribe event bus for cross-hive communication. Must support typed events: `post:created`, `job:published`, `event:announced`, `application:status`, `announcement:broadcast`, `feature:toggled`, `user:connected`. No direct hive-to-hive imports allowed — all cross-hive side effects must go through the event bus.

**`src/brain/useSharedStore.js`** — A Zustand store containing read-shared data: `posts`, `jobs`, `events`, `news`, `announcements`, `generalEvents`, `careerOpportunities`. All hives read from this store but only admin/authorized actions write to it via event bus handlers.

**`src/brain/useAdminStore.js`** — A Zustand store containing CMS data currently in useAppStore: `students`, `alumni`, `companies`, `academicStaff`, `surveys`, `siteConfig`, `auditLog`, `featureToggles`, all their setters. This is the "admin brain" — the single source of truth for managed content.

### R2. Per-Hive Isolated Stores (`src/hives/*/store/`)
Create four isolated Zustand stores, one per user-role hive:

- `src/hives/student/store/useStudentStore.js` — student-only state: `activeView` (default: `'feed'`), `previousView`, `activeTab`, `careerProgress`, `dailyQuestProgress`, `selectedJobId`
- `src/hives/alumni/store/useAlumniStore.js` — alumni-only state: `activeView` (default: `'feed'`), `previousView`, `activeTab`, `mentorMode`, `alumniCardActive`
- `src/hives/company/store/useCompanyStore.js` — company-only state: `activeView` (default: `'feed'`), `previousView`, `activeTab`, `atsBoard`, `activeJobListings`
- `src/hives/academic/store/useAcademicStore.js` — academic-only state: `activeView` (default: `'feed'`), `previousView`, `activeTab`, `researchMode`

Each hive store must expose a `setActiveView(view)` action and a `goBack()` action that restores `previousView`.

### R3. Per-Hive Context Wrapper (`src/hives/*/HiveContext.jsx`)
Create a React context for each hive that injects the hive's theme token (primary color, accent classes) into all child components without prop drilling:

- `src/hives/student/HiveContext.jsx` — provides `{ hiveColor: '#990000', hiveName: 'student', hiveAccent: 'red' }`
- `src/hives/alumni/HiveContext.jsx` — provides `{ hiveColor: '#059669', hiveName: 'alumni', hiveAccent: 'emerald' }`
- `src/hives/company/HiveContext.jsx` — provides `{ hiveColor: '#1e3a5f', hiveName: 'company', hiveAccent: 'blue' }`
- `src/hives/academic/HiveContext.jsx` — provides `{ hiveColor: '#7c3aed', hiveName: 'academic', hiveAccent: 'violet' }`

A `useHiveContext()` hook must be exported from each context. All hive-internal components use this hook for theming — no hardcoded color strings in child components.

### R4. Per-Hive Root Components (`src/hives/*/XxxHive.jsx`)
Create four hive root components that own all internal navigation for their portal:

- `src/hives/student/StudentHive.jsx`
- `src/hives/alumni/AlumniHive.jsx`
- `src/hives/company/CompanyHive.jsx`
- `src/hives/academic/AcademicHive.jsx`

Each hive component:
- Wraps its subtree with its own `HiveContext.Provider`
- Uses its own hive store (`useStudentStore` etc.) for internal `activeView` routing — NOT the global store
- Accepts only `currentUser` as a prop from App.jsx
- Lazily imports all its sub-views (StudentFeed, AlumniFeed, CompanyFeed, AcademicStaffFeed, etc. — the existing large feed components) as its views
- The existing large portal feed components (StudentFeed.jsx, AlumniFeed.jsx, etc.) remain AS-IS — hive components wrap around them, not replace them

### R5. Cross-Hive Profile Viewing — Hive Context Persistence
Modify `src/components/PublicUserProfile.jsx` and `src/components/UserProfile.jsx` so they accept a `viewerHive` prop (type: `'student' | 'alumni' | 'company' | 'academic' | 'admin'`). When rendering a profile:
- The header color, badge color, action button colors, and back-button label must use the VIEWER's hive color, NOT the profile subject's role color
- A small "You are viewing from [YourHive] portal" context badge must appear in the header
- The existing profile DATA (name, sector, jobs, etc.) remains unchanged — only the chrome/theme wrapping changes

### R6. App.jsx Simplification (`src/App.jsx`)
Reduce `src/App.jsx` to a hive selector. The file must be under 150 lines after the change. The only logic remaining in App.jsx:
- Auth state (currentUser, isAdmin)
- `activeHive` derived from `currentUser.role`
- A switch that renders the correct Hive component
- Global overlays: CommandPalette, FloatingChatWidget, PWAInstallPrompt, NotificationEngine, ToastContainer
- LandingPage, Login, Register routes for unauthenticated users

All view-level routing (the 90+ `validViews` array and its switch statement) must move INTO the respective hive components.

### R7. HiveHealthMonitor in Admin Panel
Create `src/brain/HiveHealthMonitor.jsx` — a dashboard widget for the admin panel showing:
- Each hive's status (active/idle) as a colored honeycomb cell
- EventBus event throughput counter (events per minute)
- Per-hive error count (reads from a `hiveErrors` field in useAdminStore)
- "All hives connected" green indicator when all 4 user-hive stores are initialized

Add this widget to `src/components/admin/OverviewPanel.jsx` at the top of the panel.

### R8. Store Migration — useAppStore Shrinkage
`src/store/useAppStore.js` must be reduced to ONLY contain:
- `userRole`, `setUserRole`
- `currentUser`, `setCurrentUser`
- `authenticatedUserId`, `setAuthenticatedUserId`
- `activeHive`, `setActiveHive`
- `previousHive`, `setPreviousHive`
- `selectedUserId`, `setSelectedUserId`
- `selectedGroupId`, `setSelectedGroupId`
- `logAction` (audit logger — writes to useAdminStore's auditLog via event bus)
- `activePortalBranch`, `setActivePortalBranch` (kept for backward compat during transition)

All other fields must move to `useSharedStore`, `useAdminStore`, or respective hive stores. The file must be under 12KB after migration.

---

## Acceptance Criteria

### Architecture
- [ ] `src/brain/eventBus.js` exists and exports `emit`, `on`, `off`, `once`
- [ ] `src/brain/useSharedStore.js` exists and contains posts, jobs, events, news, announcements
- [ ] `src/brain/useAdminStore.js` exists and contains students, alumni, companies, siteConfig
- [ ] `src/store/useAppStore.js` is under 12KB
- [ ] `src/App.jsx` is under 150 lines
- [ ] Four hive directories exist: `src/hives/student/`, `src/hives/alumni/`, `src/hives/company/`, `src/hives/academic/`
- [ ] Each hive directory contains: `XxxHive.jsx`, `HiveContext.jsx`, `store/useXxxStore.js`

### Hive Context Persistence (Critical)
- [ ] `PublicUserProfile.jsx` accepts `viewerHive` prop and uses viewer's hive color for chrome
- [ ] `UserProfile.jsx` accepts `viewerHive` prop and uses viewer's hive color for chrome
- [ ] A student viewing an alumni profile sees red chrome, not green
- [ ] An alumni viewing an academic profile sees green chrome, not purple

### Build & Tests
- [ ] `npx vite build` exits with code 0, no TypeScript/JSX errors
- [ ] `npx vitest run` — all 40 existing test files pass (360 tests)
- [ ] No regressions: existing portal functionality (login, feed, admin CMS, job listings) unchanged

### Code Quality
- [ ] No direct cross-hive imports (student hive must NOT import from alumni hive)
- [ ] No hardcoded color strings in hive child components — all colors via `useHiveContext()`
- [ ] `useAppStore` is NOT imported inside any hive store file

