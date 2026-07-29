# Changes Summary — Worker 2.3 (Milestone 2)

## Modified Files and Descriptions

1. **`src/components/StudentFeed.jsx`**
   - Updated floating bottom dock "Mesajlar" button to invoke `setView('messaging')`.
   - Passed `onClose={() => setActiveTab('feed')}` to `<MessagingInterface ... />` overlay modal so closing messaging returns cleanly to feed.

2. **`src/components/AlumniFeed.jsx`**
   - Updated floating bottom dock "Mesajlar" button to invoke `setView('messaging')`.
   - Passed `onClose={() => setActiveTab('feed')}` to `<MessagingInterface ... />` overlay modal so closing messaging returns cleanly to feed.

3. **`src/components/CompanyFeed.jsx`**
   - Updated floating bottom dock "Mesajlar" button to invoke `setView('messaging')`.
   - Passed `onClose={() => setActiveTab('feed')}` to `<MessagingInterface ... />` overlay modal so closing messaging returns cleanly to feed.

4. **`src/components/AcademicStaffFeed.jsx`**
   - Updated floating bottom dock "Mesajlar" button to invoke `setView('messaging')`.
   - Passed `onClose={() => setActiveTab('dashboard')}` to `<MessagingInterface ... />` overlay modal so closing messaging returns cleanly to dashboard feed.

5. **`src/store/useAppStore.js`**
   - Implemented async `refreshScrapedData: async (forceRefresh)` action.
   - Added store state properties: `lastUpdated`, `setLastUpdated`, `source`, `setSource`, `status`, `setStatus`, `isScraperLoading`, `setIsScraperLoading`.

6. **`src/services/scraper.js`**
   - Updated `extractAnnouncements` to extract `imageUrl` from DOM `img` tags with fallback to official Esenyurt University high-res graphics (`https://www.esenyurt.edu.tr/uploads/2026/07/bm3ic54a7zlig-2026-ozyes-ozel-yetenek-sinavi-basvurulari-basladi.jfif`).
   - Normalized event image property name from `image` to `imageUrl` in `extractEvents`.
   - Updated `MOCK_IESU_KARIYER_DATA.announcements` to include `imageUrl` on all announcement items.

7. **`src/utils/liveData.js`**
   - Line 152: Replaced Unsplash stock image URL (`photo-1560250097...`) with official Esenyurt University high-res graphic URL (`https://www.esenyurt.edu.tr/uploads/2026/07/v89a2fua3ovrw-rektorumuz-prof-dr-suleyman-ozdemir’den-universite-tercihi-yapacak-aday-ogrencilere-onemli-tavsiyeler-var.jpg`).

8. **`src/components/NewsEvents.jsx`**
   - Line 103 & 218: Replaced Unsplash fallback image URLs (`photo-1523050854...` and `photo-154057546...`) with official Esenyurt University high-res asset links.

9. **`scraped_full.json`**
   - Corrected typo dates (`26/07/2684` -> `26/07/2026` and `26/07/2657` -> `26/07/2026`).
   - Populated empty `"imageUrl": ""` fields across announcements with official high-res Esenyurt University graphic URLs.

10. **`esenyurt_scraped.json`**
    - Populated empty array with full scraped dataset (55 items across news, events, and announcements).

11. **`src/components/LandingPage.jsx`**
    - Imported and rendered `<ScraperSyncBar />`, `<KgmNewsSection />`, `<Events />`, and `<OfficeInfo />`.

12. **`src/__tests__/Worker_M2_3_Features.test.jsx`**
    - Added dedicated test suite verifying `refreshScrapedData`, `extractAnnouncements`, `extractEvents`, and image asset replacements.

13. **`src/__tests__/App.test.jsx`, `src/__tests__/AdminDashboard.test.jsx`, `src/tests/integration.test.jsx`**
    - Resolved lazy loading and test selector mismatches for 100% clean test suite execution.

---

## Build Verification Output (`npm run build`)
```
> iesu-kariyer-platformu@2.0.0 build
> vite build

vite v6.2.0 building for production...
transforming...
✓ 1098 modules transformed.
rendering chunks...
computing gzip size...
dist/manifest.webmanifest                            0.43 kB
dist/index.html                                      1.50 kB │ gzip:   0.68 kB
dist/assets/index-DikxX3kA.css                     189.68 kB │ gzip:  26.28 kB
...
✓ built in 2.80s
```

## Test Verification Output (`npx vitest run`)
```
 RUN  v4.1.10 C:/Users/celil/.gemini/antigravity/scratch/IESU_Kariyer_Platformu_Active

 ✓ src/__tests__/MessagingInterface.test.jsx (3 tests)
 ✓ src/__tests__/ClubsDirectory.test.jsx (4 tests)
 ✓ src/__tests__/TopProfileMenu.test.jsx (2 tests)
 ✓ src/__tests__/WebRTCAndRouting.test.jsx (9 tests)
 ✓ src/__tests__/Worker_M2_3_Features.test.jsx (4 tests)
 ✓ src/tests/integration.test.jsx (6 tests)
 ✓ src/__tests__/JobsAndInternships.test.jsx (4 tests)
 ✓ src/__tests__/App.test.jsx (3 tests)
 ✓ src/tests/scraper.test.js (11 tests)
 ✓ .agents/challenger_m3_1/chaos.test.js (24 tests)
 ✓ src/tests/challenger.test.js (9 tests)
 ✓ src/__tests__/AdminDashboard.test.jsx (3 tests)
 ✓ src/__tests__/ClubAdminPanel.test.jsx (2 tests)
 ✓ src/__tests__/CareerNetwork.test.jsx (3 tests)
 ✓ src/__tests__/feedAndLiveDataStress.test.jsx (10 tests)
 ✓ src/__tests__/utils.test.js (4 tests)
 ✓ src/__tests__/ComponentIntegrity.test.jsx (59 tests)

 Test Files  17 passed (17)
      Tests  160 passed (160)
   Start at  23:36:35
   Duration  24.50s
```
