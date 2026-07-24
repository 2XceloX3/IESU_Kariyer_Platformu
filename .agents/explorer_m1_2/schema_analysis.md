# Codebase Schema Analysis Report — IESU Kariyer Platformu

**Author**: Explorer 2 (Codebase Schema Analyst)  
**Date**: 2026-07-24  
**Workspace**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu`  
**Target Scope**: `src/utils/` (`mockData.js`, `innerPagesData.js`, `universityData.js`, `liveData.js`, `feedCombiner.js`, `export.js`, `integrationService.js`), `src/data/` (`mockAdminData.js`, `AIEngine.js`), `src/store/useAppStore.js`, and consuming React components in `src/components/`.

---

## 1. Executive Summary & File Catalog

This analysis provides a comprehensive catalog of all mock data schemas, data structures, field types, default values, and component consumption flows across the IESU Kariyer Platformu application.

### Analyzed Utility & Data Files
1. `src/utils/mockData.js` (511 lines) — Primary mock data seeds for users, news, events, announcements, courses, jobs, catalog, groups, surveys, posts.
2. `src/utils/innerPagesData.js` (123 lines) — Static CMS content for static sub-pages (Hakkımızda, Hizmetlerimiz, Ulusal Staj, Akran Mentor, İşbirliklerimiz, Araştırma).
3. `src/utils/universityData.js` (140 lines) — Master university hierarchy (Faculties, MYO, Yüksekokul, Enstitü, Departments) and accessor functions.
4. `src/utils/liveData.js` (174 lines) — Live landing page sliders, news, announcements, statistics, and event photo gallery data.
5. `src/utils/feedCombiner.js` (86 lines) — Combiner function that normalizes posts, events, news, announcements, and jobs into a single unified social feed stream.
6. `src/utils/export.js` (36 lines) — CSV exporter utility for tabular dataset downloads.
7. `src/utils/integrationService.js` (99 lines) — Integration layer for OBS (Student Information System) and e-Devlet authentication proxies and fallbacks.
8. `src/data/mockAdminData.js` (56 lines) — Legacy admin dashboard mock seed data.
9. `src/data/AIEngine.js` (793 lines) — AI knowledge base archive and swarm intelligence search/reasoning engine data.
10. `src/store/useAppStore.js` (505 lines) — Zustand central state store managing global hydration, persistence, and slice mutations.

---

## 2. Exhaustive Mock Data Schemas & Field Catalog

### 2.1 `src/utils/mockData.js`

#### A. `generateStudents()` (Returns Array of Objects)
- **Object ID Range**: `STU-001` to `STU-005`
- **Field Catalog**:
  - `id`: `string` (e.g. `'STU-001'`) — Unique identifier
  - `studentId`: `string` (e.g. `'20240001'`) — School registration number
  - `name`: `string` (e.g. `'Alperen Yılmaz'`)
  - `department`: `string` (e.g. `'Yazılım Mühendisliği'`)
  - `year`: `number` (1 to 4)
  - `gpa`: `number` (e.g. `3.4`)
  - `email`: `string` (e.g. `'alperen@ogr.IESU.edu.tr'`)
  - `password`: `string` (`'password'`)
  - `role`: `string` (`'student'`)
  - `avatar`: `string` (UI Avatars image URL)
  - `internshipStatus`: `string` (`'Arıyor'` | `'Tamamlandı'` | `'İlgilenmiyor'` | `'Aktif Stajyer'`)
  - `pronouns`: `string` (e.g. `'o/onun'`) — *Optional* (present only on STU-001)
  - `doubleMajor`: `string` (e.g. `'Endüstri Mühendisliği'`) — *Optional* (present only on STU-002)

#### B. `generateAlumni()` (Returns Array of Objects)
- **Object ID Range**: `ALU-001` to `ALU-004`
- **Field Catalog**:
  - `id`: `string` (`'ALU-001'`)
  - `studentId`: `string` (`'20190001'`)
  - `name`: `string` (`'Caner Öztürk'`)
  - `department`: `string` (`'Yazılım Mühendisliği'`)
  - `gradYear`: `number` (e.g. `2023`)
  - `email`: `string` (`'caner@mezun.IESU.edu.tr'`)
  - `password`: `string` (`'password'`)
  - `role`: `string` (`'alumni'`)
  - `avatar`: `string` (UI Avatars URL)
  - `company`: `string` (e.g. `'Trendyol'`)
  - `title`: `string` (e.g. `'Frontend Developer'`)

#### C. `generateCompanies()` (Returns Array of Objects)
- **Object ID Range**: `CMP-001` to `CMP-004`
- **Field Catalog**:
  - `id`: `string` (`'CMP-001'`)
  - `username`: `string` (`'trendyol'`)
  - `name`: `string` (`'Trendyol'`)
  - `sector`: `string` (e.g. `'E-Ticaret'`)
  - `email`: `string` (`'ik@trendyol.com'`)
  - `password`: `string` (`'password'`)
  - `role`: `string` (`'employer'`) — *Note mismatch*: Seed sets role to `'employer'`, but some components query `role === 'company'`.
  - `avatar`: `string` (UI Avatars URL)
  - `website`: `string` (e.g. `'https://trendyol.com'`)
  - `location`: `string` (e.g. `'İstanbul, TR'`)

#### D. `generateAcademicStaff()` (Returns Array of Objects)
- **Object ID Range**: `ACAD-001` to `ACAD-003`
- **Field Catalog**:
  - `id`: `string` (`'ACAD-001'`)
  - `name`: `string` (e.g. `'Prof. Dr. Ahmet Yılmaz'`)
  - `email`: `string` (`'ayilmaz@IESU.edu.tr'`)
  - `department`: `string` (e.g. `'Bilgisayar Mühendisliği'`)
  - `password`: `string` (`'password'`)
  - `role`: `string` (`'academic'`)
  - `avatar`: `string` (UI Avatars URL)
  - `title`: `string` (e.g. `'Dekan'`, `'Bölüm Başkanı'`)

#### E. `initialNews` (Array of 10 Objects)
- **Field Catalog**:
  - `id`: `string` (`'NEWS-001'` to `'NEWS-010'`)
  - `title`: `string`
  - `description`: `string`
  - `imageUrl`: `string` (Panel IESU URL)
  - `status`: `string` (`'Aktif'`)
  - `date`: `string` (e.g. `'03 Aralık 2025 Çarşamba'`)

#### F. `initialEvents` (Array of 9 Objects)
- **Field Catalog**:
  - `id`: `string` (`'EVT-001'` to `'EVT-009'`)
  - `title`: `string`
  - `description`: `string`
  - `date`: `string` (`'Tarih belirtilmemiş'`)
  - `time`: `string` (`''`)
  - `location`: `string` (`'IESU Kampüsü'`)
  - `imageUrl`: `string` (Panel IESU URL)
  - `status`: `string` (`'Aktif'`)

#### G. `initialAnnouncements` (Array of 12 Objects)
- **Field Catalog**:
  - `id`: `string` (`'ANN-001'` to `'ANN-012'`)
  - `title`: `string`
  - `description`: `string`
  - `date`: `string` (e.g. `'11.05.2026 13:13:20'`)
  - `category`: `string` (`'Öğrenci ve Mezun'`)
  - `priority`: `string` (`'Yüksek'`)
  - `imageUrl`: `string` (Panel IESU URL)

#### H. `initialSemCourses` (Array of 5 Objects)
- **Field Catalog**:
  - `id`: `string` (`'SEM-001'` to `'SEM-005'`)
  - `title`: `string`
  - `description`: `string` (`'devamını oku'`)
  - `imageUrl`: `string` (S3 URL)
  - `status`: `string` (`'Aktif'`)
  - *Schema Gap*: Lacks `instructor`, `quota`, `enrolled` properties present in `mockAdminData.js` (`SEM_INIT`).

#### I. `initialJobs` (Array of 5 Objects)
- **Field Catalog**:
  - `id`: `string` (`'JOB-001'` to `'JOB-005'`)
  - `title`: `string`
  - `company`: `string` (`'IESU Kariyer Geliştirme Merkezi'`)
  - `location`: `string` (`'Türkiye Geneli'`, `'İstanbul IESU'`, `'Online'`)
  - `description`: `string`
  - `imageUrl`: `string` (Panel IESU URL)
  - `status`: `string` (`'Aktif'`)

#### J. `initialFeatured` (Array of 5 Objects)
- **Field Catalog**:
  - `id`: `string` (`'FTR-001'` to `'FTR-005'`)
  - `title`: `string`
  - `imageUrl`: `string`

#### K. Empty Array Exports
- `initialMentorships`: `[]`
- `initialVoluntaryInternships`: `[]`
- `initialAcademicApprovals`: `[]`
- `initialInternships`: `[]`
- `academicStaff`: `[]` (*Export collision with `generateAcademicStaff` function*)

#### L. `initialAcademicCatalog` (Generated Hierarchy)
- Top-level Unit object:
  - `id`: `string` (`'FAC-001'`)
  - `name`: `string` (Faculty/School Name)
  - `type`: `string` (`'Fakülte'` | `'Meslek Yüksekokulu'` | `'Yüksekokul'` | `'Enstitü'`)
  - `status`: `string` (`'Aktif'`)
  - `departments`: `Array<Department>`
    - `id`: `string` (`'DEP-001'`)
    - `name`: `string`
    - `status`: `string` (`'Aktif'`)
    - `programs`: `Array<Program>`
      - `id`: `string` (`'PRG-001'`)
      - `name`: `string`
      - `level`: `string` (`'Önlisans'` | `'Lisans'` | `'Lisansüstü'`)
      - `doubleMajorEligible`: `boolean` (`true`)
      - `status`: `string` (`'Aktif'`)

#### M. `initialGroups` (Array of 2 Objects)
- **Field Catalog**:
  - `id`: `string` (`'GRP-001'`, `'GRP-002'`)
  - `name`: `string`
  - `description`: `string`
  - `cover`: `string` (Unsplash URL)
  - `logo`: `string` (UI Avatars URL)
  - `type`: `string` (`'Öğrenci Kulübü'`, `'Mezun Ağı'`)
  - `memberCount`: `number`
  - `verified`: `boolean`
  - `createdBy`: `string` (`'admin_igu'`) | `number` (`1`)
  - `status`: `string` (`'Aktif'`)
  - `events`: `Array` (`[]`)
  - `boardMembers`: `Array<{ role: string, name: string, department: string }>`

#### N. `initialSurveys` (Array of 2 Objects)
- **Field Catalog**:
  - `id`: `string` (`'SRV-101'`, `'SRV-102'`)
  - `title`: `string`
  - `description`: `string`
  - `date`: `string` (ISO Date `'2026-07-15'`)
  - `status`: `string` (`'Aktif'`)
  - `type`: `string` (`'Genel Anket'`, `'Etkinlik Değerlendirme'`)
  - `targetAudience`: `string` (`'Mezunlar'`, `'Tümü'`)
  - `responses`: `number`
  - `questions`: `Array<{ id: string, text: string, type: 'likert' | 'text' }>`

#### O. `initialPosts` (Array of 4 Objects)
- **Field Catalog**:
  - `id`: `string` (`'POST-001'` to `'POST-004'`)
  - `author`: `Object` `{ id: string, name: string, avatar: string, title: string, role: string }`
  - `content`: `string`
  - `likes`: `number`
  - `comments`: `number`
  - `time`: `string` (e.g. `'2 saat önce'`, `'1 gün önce'`)

---

### 2.2 `src/utils/innerPagesData.js`

Exported constant `innerPagesData`:
- Keys: `hakkimizda`, `hizmetlerimiz`, `ulusal_staj`, `akran_mentor`, `isbirlikleri`, `arastirma`
- Schema per key:
  - `title`: `string`
  - `subtitle`: `string`
  - `heroImage`: `string` (Unsplash URL)
  - `sections`: `Array<{ id: string, title: string, content: string, icon: string, target?: string }>`
  - `contactInfo`: `Object` `{ email: string, phone: string, office: string }` (*Optional, present on `hakkimizda`*)
  - `externalLink`: `Object` `{ url: string, label: string }` (*Optional, present on `ulusal_staj`*)

---

### 2.3 `src/utils/liveData.js`

1. `liveSliderData`: `Array<{ badge: string, title: string, image: string, actionLink: string }>` (*Uses `image` property*)
2. `liveNewsData`: `Array<{ id: string, title: string, date: string, category: string, description: string, imageUrl: string }>` (*Uses `imageUrl` property*)
3. `liveAnnouncementsData`: `Array<{ id: string, title: string, date: string, category: string, description: string }>`
4. `liveStatsData`: `Array<{ label: string, value: string, color: string }>`
5. `kariyerEventImages`: `Array<{ url: string, title: string, category: string, date: string }>` (*Uses `url` property*)

---

### 2.4 `src/data/mockAdminData.js`

1. `STUDENTS`: Array of 10 objects (`{ id, name, dept, year, gpa, cv, status }`) — *Key Mismatch*: Uses `dept` instead of `department`.
2. `SURVEYS_INIT`: Array of 3 objects (`{ id, title, responses, total, status, date }`).
3. `SEM_INIT`: Array of 4 objects (`{ id, title, instructor, quota, enrolled, date, status }`) — *Key Addition*: Contains `instructor`, `quota`, `enrolled` missing from `initialSemCourses`.
4. `EVENTS_INIT`: Array of 3 objects (`{ id, title, category, type, date, quota, status }`).
5. `ORG`: Object tree `{ name: string, title: string, children: Array }`.

---

## 3. Data Key Mismatches & Inconsistencies Table

| Domain / Concept | Object Field 1 | Object Field 2 | Impacted Component / Utility | Severity |
| :--- | :--- | :--- | :--- | :--- |
| **Image URLs** | `imageUrl` (`mockData.js`, `liveNewsData`) | `image` (`liveSliderData`, `combineFeedItems`, `PostCard`) | Components checking `item.image` fail to render images from `mockData` items having `imageUrl`. | **MEDIUM** |
| **Company Role** | `role: 'employer'` (`generateCompanies()`) | `userRole === 'company'` (`App.jsx`, `CompanyFeed.jsx`, `TopProfileMenu.jsx`) | Role checks for company users can return `false` if checked against `'employer'` vs `'company'`. | **HIGH** |
| **Department Key** | `department` (`mockData.js`) | `dept` (`mockAdminData.js`) | Admin components expecting `student.dept` render `undefined` when passed data from `useAppStore.students` (which has `department`). | **HIGH** |
| **Academic Staff Export** | `generateAcademicStaff` (function) | `academicStaff = []` (empty array export in `mockData.js`) | Importing `academicStaff` directly from `mockData.js` returns an empty array instead of generated data. | **MEDIUM** |
| **Course Details** | `SEM_INIT` has `instructor`, `quota`, `enrolled` | `initialSemCourses` lacks `instructor`, `quota`, `enrolled` | `SemPanel.jsx` rendering `course.instructor` displays `undefined` for items from `initialSemCourses`. | **MEDIUM** |
| **Date Field Formatting** | `date: '03 Aralık 2025'` (Turkish text) | `date: '11.05.2026 13:13:20'` (D.M.Y format) | `combineFeedItems` running `new Date(a.date).getTime()` returns `NaN`, breaking deterministic feed sorting. | **HIGH** |

---

## 4. Component Data Flow & Potential Crash Risk Analysis

### Risk 1: `combineFeedItems` Date Parsing Failure (Crash / Unsorted Feed)
- **Location**: `src/utils/feedCombiner.js:79-82`
- **Code**:
  ```javascript
  return combined.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
    const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
    return timeB - timeA;
  });
  ```
- **Cause**: Items from `initialNews` (`date: "03 Aralık 2025 Çarşamba"`) and `initialEvents` (`date: "Tarih belirtilmemiş"`) do not have `createdAt`. `new Date("Tarih belirtilmemiş").getTime()` yields `NaN`.
- **Impact**: `NaN - NaN` corrupts JavaScript Array `.sort()`, causing erratic order or silent array rendering glitches in `StudentFeed.jsx` and `ExploreFeed.jsx`.

### Risk 2: `PostCard.jsx` Survey Data Unsafe Map Access
- **Location**: `src/components/PostCard.jsx:490`
- **Code**:
  ```javascript
  {post.surveyData.questions?.map((q, idx) => ( ... ))}
  ```
- **Cause**: While optional chaining `questions?.map` is present, if `post.type === 'anket'` but `post.surveyData` is `undefined`, accessing `post.surveyData.questions` throws a `TypeError: Cannot read properties of undefined (reading 'questions')`.
- **Impact**: Uncaught runtime crash when rendering custom survey posts.

### Risk 3: Empty Array Store Hydration Crash Points
- **Location**: `src/components/JobsAndInternships.jsx`, `src/components/TeamUpMentorHub.jsx`, `src/components/AlumniSurveys.jsx`
- **Cause**: `initialMentorships`, `initialVoluntaryInternships`, `initialInternships`, `initialAcademicApprovals` in `mockData.js` are initialized as empty arrays `[]`.
- **Impact**: Components accessing properties of first elements (e.g. `internships[0].title` or `mentorships[0].mentorName`) without nullish checks will crash on cold render.

### Risk 4: `AlumniSurveys.jsx` Question Mapping Missing Null Check
- **Location**: `src/components/AlumniSurveys.jsx`
- **Cause**: Direct mapping `survey.questions.map(...)` on dynamically created surveys without guaranteeing `questions` is an array.
- **Impact**: Crash if survey is created without questions or loaded with null questions.

---

## 5. Recommended Remediation & Schema Standardization Plan

1. **Normalize Role Names**: Standardize `employer` to `company` across `mockData.js` and `useAppStore.js`.
2. **Normalize Image Keys**: Provide getter aliases or normalize `imageUrl` to `image` in `feedCombiner.js` and component prop adapters.
3. **Safe Date Parsing in `feedCombiner`**: Implement a fallback timestamp parser that handles Turkish text dates or defaults to `Date.now()`.
4. **Synchronize SEM Schema**: Merge `instructor`, `quota`, `enrolled` into `initialSemCourses` in `mockData.js`.
5. **Add Mandatory Optional Chaining**: Enforce `?.map()` and default empty arrays `(items || []).map()` across all list-rendering React components.

---
*End of Schema Analysis Report*
