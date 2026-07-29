# Empirical & Adversarial Challenge Report — Portal Stability & Vite Build Execution

**Role**: Empirical Challenger 2 (critic, specialist)  
**Target Project**: Esenyurt University Career Portal (`IESU_Kariyer_Platformu_Active`)  
**Date**: 2026-07-26  

---

## Challenge Summary

**Overall risk assessment**: **MEDIUM**

The portal architecture, component integrity, and Vite build pipeline demonstrate strong baseline stability and comprehensive safety guards (e.g. ErrorBoundary, array null checks, fallback data handling, WCAG modal accessibility). However, empirical stress testing and static code analysis revealed critical edge case vulnerabilities:
1. **Unsplit Monolithic Vendor Bundle** (`dist/assets/vendor-CfXvWz6g.js` is **2.16 MB**), exceeding Vite bundle threshold. Large static assets (`pdf_extracted_logo.bmp` 4.66 MB, `iesu_panel_ici_28mb_veriyle_dolduruldu.html` 1.3 MB) reside directly in `dist/`.
2. **Test Suite Specification Mismatch** in `src/__tests__/TopProfileMenu.test.jsx`: Line 25 asserts `expect(screen.queryByText(/Panel Geçişi/i)).toBeNull()` for student role, but `TopProfileMenu.jsx` lines 215-236 recently added `"PANEL GEÇİŞİ"` for ALL roles, causing test assertion failure under Vitest.
3. **Unprotected Global Toast Invocations** in `CompanyFeed.jsx` (lines 90, 601) and `AlumniFeed.jsx` (line 670): `window.toast.success(...)` is called directly without optional chaining (`window.toast?.success(...)`), which throws an unhandled `TypeError` if components render outside `App.jsx` or before toast initialization.

---

## Challenges

### [Medium] Challenge 1: Monolithic Vendor Bundle & Large Asset Footprint in `dist/`
- **Assumption challenged**: Vite code splitting effectively isolates all third-party dependencies into lightweight chunks.
- **Attack scenario**: On slow or mobile connections (3G/4G), loading `vendor-CfXvWz6g.js` (2.16 MB) blocks Initial Page Load and causes First Contentful Paint (FCP) degradation. Heavy static files (`pdf_extracted_logo.bmp` 4.66 MB) are fetched unconditionally if linked.
- **Blast radius**: Increased initial page load latency, high bandwidth consumption for mobile portal users, potential PWA cache quota issues.
- **Mitigation**: Update `vite.config.js` `manualChunks` to split heavy libraries: `@supabase/supabase-js`, `firebase`, `three`, `recharts`, and `pdfkit`. Convert raw `.bmp` files to compressed `.webp` or `.png`.

### [Medium] Challenge 2: Test Suite Mismatch in `TopProfileMenu.test.jsx`
- **Assumption challenged**: All unit test suites pass cleanly under test execution without regression.
- **Attack scenario**: Running `npm test` triggers assertion failure in `TopProfileMenu.test.jsx` at line 25 (`expect(screen.queryByText(/Panel Geçişi/i)).toBeNull()`) because `TopProfileMenu.jsx` now renders `<p>PANEL GEÇİŞİ</p>` for student, alumni, company, and academic roles.
- **Blast radius**: CI/CD pipeline failure and broken automated verification suite.
- **Mitigation**: Synchronize `TopProfileMenu.test.jsx` assertion with updated component behavior (e.g. check for role-specific options inside panel switcher rather than asserting absence of panel switcher header).

### [Low] Challenge 3: Unprotected `window.toast` Call Risk in Form Submit Handlers
- **Assumption challenged**: `window.toast` is always initialized and available on global object during component interaction.
- **Attack scenario**: User submits `handleFairSubmit` or `handleCardSubmit` or mentorship forms in `CompanyFeed.jsx` / `AlumniFeed.jsx` when mounted in isolated tests or prior to `App.jsx` mounting `window.toast = toast`.
- **Blast radius**: Unhandled runtime `TypeError: Cannot read properties of undefined (reading 'success')` breaking form submission flow.
- **Mitigation**: Refactor direct calls `window.toast.success(...)` to optional chaining `window.toast?.success?.(...)`.

---

## Stress Test Results

1. **Vite Build Output Audit**:
   - `dist/assets/vendor-CfXvWz6g.js` (2,167,404 bytes / 2.16 MB) → Standard threshold < 500 kB → **FAIL (Chunk Oversize)**
   - `dist/assets/vendor-react-Ce9UJUDS.js` (890,571 bytes / 890 KB) → Split chunk → **PASS**
   - `dist/assets/AdminDashboard-BSqjVlrU.js` (480,849 bytes / 480 KB) → Lazy loaded chunk → **PASS**
   - `dist/assets/index-kywIfuGx.css` (191,578 bytes / 191 KB) → Stylesheet bundle → **PASS**
   - Output asset count: 96 JS/CSS chunks + 28 root assets in `dist/` → Assets generated successfully → **PASS**

2. **Component Integrity & Edge Case Stress Testing**:
   - `BMICalculatorModal`:
     - Normal BMI (24.2), Underweight BMI (15.4), Obese BMI (35.2) → Correct values & SKS advice → **PASS**
     - Boundary values (BMI = 18.5, 24.9, 25.0, 29.9, 30.0) → Category transitions accurate → **PASS**
     - Extreme inputs (Height 100cm..250cm, Weight 30kg..250kg) → Gauge pointer clamped 0%..100% → **PASS**
     - Escape key & backdrop click handling → Properly closes without state leaks → **PASS**
   - `TopProfileMenu`:
     - Null/Undefined user prop handling → Renders fallback "Giriş Yap" button without crash → **PASS**
     - Event listeners cleanup (`mousedown`, `keydown`) → Cleans up on unmount → **PASS**
     - Test assertion mismatch on line 25 (`/Panel Geçişi/i`) → Test code vs component mismatch → **FAIL (Test Assertion Mismatch)**
   - `CompanyFeed` & `AlumniFeed`:
     - `combineFeedItems` rendering with empty/null arrays → Gracefully falls back → **PASS**
     - Global search query filtering (`(post.content || '')`) → No crash on null content → **PASS**
     - Direct `window.toast.success` calls → Risk of unhandled exception if `window.toast` missing → **FAIL (Unprotected Global Access)**
   - `FooterModals`:
     - Escape key listener cleanup & `e.stopPropagation()` → Clean isolation, zero state leaks → **PASS**
   - `App.jsx`:
     - Lazy routing, `ErrorBoundary` coverage, `validViews` fallback, scroll reset → Solid structural integrity → **PASS**

---

## Unchallenged Areas

- **Backend Firebase Authentication & Firestore Queries**: Tested via mocks in unit tests; live Firestore DB permissions and security rules were out of review scope.
