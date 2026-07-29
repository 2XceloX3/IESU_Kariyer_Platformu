# Detailed Investigation & Forensic Analysis: Live Content Hydration & University Image Assets

**Project:** IESU Kariyer Platformu — Milestone 1 Exploration  
**Agent:** Explorer 1.1  
**Target Scope:** `src/utils/liveData.js`, `src/services/scraper.js`, scraped JSON files (`esenyurt_scraped.json`, `scraped_full.json`, `esenyurt_main_page_fresh.json`), and UI components (`NewsEvents.jsx`, `NelerOluyorPanel.jsx`, `KgmNewsSection.jsx`, `AcademicStaffFeed.jsx`, `ExploreFeed.jsx`, `ScraperSyncBar.jsx`, `useAppStore.js`).

---

## 1. Executive Summary & Verification Verdict

### Primary Question:
Are all news, events, career announcements, and academic updates dynamically hydrated from official Esenyurt University pages (https://www.esenyurt.edu.tr/) with valid high-resolution university image assets?

### Forensic Verdict: **NON-COMPLIANT / PARTIALLY IMPLEMENTED WITH CRITICAL GAPS**

While the application contains mock datasets, scraped JSON files, and static data structures referencing official `esenyurt.edu.tr` URLs, it fails full dynamic compliance due to six key findings:
1. **Static Store Initialization**: `useAppStore.js` initializes state from static files (`liveData.js` and `mockData.js`) at boot time instead of executing live scraper hydration.
2. **Broken Scraper Store Method**: `ScraperSyncBar.jsx` calls `useAppStore.getState().refreshScrapedData(true)`, but `refreshScrapedData` is missing from `useAppStore.js`, breaking interactive live syncing.
3. **Non-University Stock Images**: Non-official stock images (e.g. Unsplash photos) are hardcoded in `src/utils/liveData.js` (line 152) and component fallback props (`NewsEvents.jsx` lines 103, 218).
4. **Missing & Reused Image Assets**: 8 out of 10 announcements in `scraped_full.json` have empty image URLs (`imageUrl: ""`). `esenyurt_main_page_fresh.json` contains server fallback images (`empty.png`). `scraper.js` announcement parser omits `imageUrl` extraction entirely.
5. **Corrupted / Empty JSON Files**: `esenyurt_scraped.json` is a 2-byte empty array (`[]`). `scraped_full.json` contains corrupted year dates (`26/07/2684` and `26/07/2657`).
6. **Academic Staff & Faculty Hydration Gap**: `AcademicStaffFeed.jsx` and academic updates rely on hardcoded static mock profiles rather than live hydration from official faculty pages.

---

## 2. Comprehensive Component & File Audit Findings

### A. `src/utils/liveData.js` Audit
- **Data Exported**: `liveSliderData` (10 items), `liveNewsData` (10 items), `liveAnnouncementsData` (10 items), `liveStatsData` (4 items), `liveEventData` (16 items), `kariyerEventImages`.
- **Image Asset Compliance**:
  - ❌ **Non-University Stock Image**: Item `news-tavsiyeler-2026` (Line 152) uses `https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80` instead of official university imagery for Rektör Prof. Dr. Süleyman Özdemir.
  - ⚠️ **Mismatched Image Reuse**: `news-veda-programi-2026` (Line 142) reuses `qd2nc7jccjlfr-universitemizin-14-yil-donumu-kutlu-olsun.jfif`, which is an anniversary graphic, not a farewell ceremony photo.
  - ⚠️ **Generic Image Recycling**: 8 out of 10 announcements in `liveAnnouncementsData` recycle 5 generic uploaded images (`mnsk4r65vzzss-yuksek-lisans.jpg`, `z6zk51zk7l2gc-.jpg`, etc.) rather than unique item assets.
  - ⚠️ **Raw Numeric Slugs**: Event item 11 (Line 428) uses image filename `t27y5gb7wceap-1234535848979.jpg`.

### B. `src/services/scraper.js` Engine Audit
- **Functions**: `fetchIesuKariyerData`, `scrapeLiveOrFallback`, `parseIesuHtmlPayload`, `extractAnnouncements`, `extractEvents`, `extractOfficeInfo`.
- **Extraction Deficiencies**:
  - ❌ **Missing Image Parser for Announcements**: `extractAnnouncements(doc, html)` (Lines 197–256) extracts `id`, `title`, `date`, `category`, `summary`, `content`, `link`, and `isPinned`, but **completely ignores `imageUrl` / `image`**.
  - ⚠️ **Property Schema Mismatch**: `extractEvents(doc, html)` assigns extracted images to key `image` (Line 288), whereas `useAppStore.js` and components expect `imageUrl`.
  - ⚠️ **Narrow Scrape Scope**: Scraper only targets `https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu`, ignoring main sub-hubs (`/duyurular`, `/haberler`, `/etkinlikler`).

### C. Scraped JSON Data Files Audit
1. `esenyurt_scraped.json`:
   - **Path**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\esenyurt_scraped.json`
   - **Status**: ❌ **Empty File (`[]`, 2 bytes)**. Scraping pipeline output was never written or was cleared.
2. `scraped_full.json`:
   - **Path**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\scraped_full.json`
   - **Contents**: `news` (20 items), `events` (16 items), `announcements` (10 items), `sliderImages` (20 items).
   - **Status**: ⚠️ **Incomplete / Corrupted**.
     - 8 of 10 announcements have `imageUrl: ""` (empty string).
     - Corrupted date strings in news items 5 and 8: `"26/07/2684"` and `"26/07/2657"`.
3. `esenyurt_main_page_fresh.json`:
   - **Path**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\esenyurt_main_page_fresh.json`
   - **Status**: ⚠️ Banners 5 through 12 contain server placeholder image links: `https://www.esenyurt.edu.tr/assets/frontend/images/empty.png`.

### D. Component Hydration & UI Rendering Audit
1. `src/store/useAppStore.js`:
   - Initializes `news`, `events`, `announcements` from `liveData.js` statically.
   - ❌ **Missing Store Action**: `refreshScrapedData` is not defined in `useAppStore.js`, causing `ScraperSyncBar.jsx` refresh button calls to fail.
2. `src/components/NewsEvents.jsx`:
   - Contains Unsplash fallback images at line 103 (`https://images.unsplash.com/photo-1523050854058-8df90110c9f1...`) and line 218 (`https://images.unsplash.com/photo-1540575467063-178a50c2df87...`).
3. `src/components/NelerOluyorPanel.jsx`:
   - Imports `liveNewsData` directly from `../utils/liveData.js` instead of consuming state from Zustand store `useAppStore`.
4. `src/components/KgmNewsSection.jsx`:
   - Reads `announcements` from Zustand store, but renders text-only cards without image banners.
5. `src/components/AcademicStaffFeed.jsx`:
   - Uses static mock data (`initialStaffList`, `generateAcademicStaff`). Does not hydrate faculty announcements or academic updates from official Esenyurt University academic pages.

---

## 3. Recommended Remediation Plan for Milestone 2

1. **Implement `refreshScrapedData` in `useAppStore.js`**:
   - Add state handler `refreshScrapedData: async (force) => { ... }` that invokes `scrapeLiveOrFallback({ forceRefresh: force })` and updates `news`, `events`, `announcements`, `officeInfo`, `lastUpdated`, `source`, `status`.
2. **Update Scraper Extraction & Schema Alignment**:
   - Modify `extractAnnouncements` in `src/services/scraper.js` to extract `imageUrl` from DOM nodes or fallback to valid official university graphics.
   - Normalize event image property from `image` to `imageUrl`.
3. **Clean Up Image Assets**:
   - Replace Unsplash stock photo in `liveData.js` (line 152) with an official Esenyurt University photo.
   - Replace Unsplash fallback image URLs in `NewsEvents.jsx` (lines 103, 218) with official high-res university asset placeholders.
4. **Repair JSON Files**:
   - Populate `esenyurt_scraped.json` with fresh scraped JSON data.
   - Fix corrupted dates (`2684`, `2657` -> `2026`) and missing `imageUrl` entries in `scraped_full.json`.
5. **Dynamic Academic Staff Hydration**:
   - Connect `AcademicStaffFeed.jsx` to live academic announcements and official staff list data pipeline.
