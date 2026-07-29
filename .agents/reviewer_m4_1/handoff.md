# Handoff Report — M4 Reviewer & Critic (`reviewer_m4_1`)

## Review Summary

**Verdict**: **REQUEST_CHANGES**

---

## 1. Observation

Direct code inspection of `src/components/admin/CMSCareerFair.jsx`, `src/store/useAppStore.js`, and `src/__tests__/CMSCareerFair.test.jsx` revealed the following exact lines and behaviors:

1. **Dead Navigation Tab Button & Blank Screen**:
   - `src/components/admin/CMSCareerFair.jsx:931-936`:
     ```jsx
     <button 
       onClick={() => setActiveTab('live_stage')} 
       className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'live_stage' ? 'bg-white text-red-950 shadow-md' : 'text-white hover:bg-white/10'}`}
     >
       <Sparkles size={14} className="text-amber-300 animate-pulse" /> Canlı Zirve Sahnesi & Soru-Cevap
     </button>
     ```
   - Observed behavior: Clicking this button sets `activeTab` to `'live_stage'`. However, `CMSCareerFair.jsx` only defines render conditions for `'form_builder'`, `'stand_allocator'`, `'applications'`, and `'announcements'`. There is no `{activeTab === 'live_stage' && (...)}` block. This causes the main component area to render completely blank. Additionally, `text-white hover:bg-white/10` inside the white background container (`bg-white/90`) causes text to render invisible (white on light background).

2. **Zustand Store Stand Reassignment State Corruption**:
   - `src/store/useAppStore.js:438-446`:
     ```javascript
     const updatedApps = (state.careerFairApplications || []).map(app => {
       if (companyName && app.companyName === companyName) {
         return { ...app, tableNumber: newStatus === 'Boş' ? null : standCode };
       }
       if (app.tableNumber === standCode && newStatus === 'Boş') {
         return { ...app, tableNumber: null };
       }
       return app;
     });
     ```
   - Observed behavior: When Stand A-01 (previously assigned to "Baykar Teknoloji" with `tableNumber: 'Stant A-01'`) is reassigned to "Aselsan" with `newStatus = 'Atandı'`, "Aselsan" receives `tableNumber: 'Stant A-01'`, but "Baykar Teknoloji" is NOT disassociated because clearing only triggers when `newStatus === 'Boş'`. Consequently, both "Baykar Teknoloji" and "Aselsan" retain `tableNumber: 'Stant A-01'` in store state.

3. **Invalid Tailwind CSS Class Syntax**:
   - `src/components/admin/CMSCareerFair.jsx:347`:
     ```jsx
     <div className="space-y-[#990000] space-y-8 animate-fade-in font-sans pb-12">
     ```
   - Observed behavior: `space-y-[#990000]` is invalid Tailwind CSS. `space-y-` utility classes accept spacing scale values (e.g. `space-y-8`), not color hex strings.

4. **Corrupted ID Test Fixture String**:
   - `src/__tests__/CMSCareerFair.test.jsx:27`:
     ```javascript
     { id: 'APP-[#990000]102', companyId: 'CMP-002', companyName: 'Aselsan', appliedAt: '2026-07-21', status: 'Onaylandı', tableNumber: null, answers: {} }
     ```
   - Observed behavior: The application ID string literal contains `#990000` (`APP-[#990000]102`), indicating a corrupted string replace operation during theme refactoring.

---

## 2. Logic Chain

1. **Observation 1 → Conclusion on Navigation UI**: Setting `activeTab` to `'live_stage'` when no matching tab content block exists leaves the admin interface unresponsive and blank without any way to recover except refreshing or clicking another header tab. Furthermore, white text on white background violates basic accessibility and styling rules.
2. **Observation 2 → Conclusion on State Integrity**: Storing duplicate `tableNumber` values across multiple distinct company applications creates conflicting state records. If Company X and Company Y both show `tableNumber: 'Stant A-01'`, notification and table assignment queries return invalid data.
3. **Observation 3 → Conclusion on Styling Rules**: `space-y-[#990000]` is invalid CSS / Tailwind syntax and pollutes class declarations.
4. **Observation 4 → Conclusion on Test Fixtures**: `APP-[#990000]102` invalidates exact ID matching assertions in tests expecting standard format `APP-102`.

---

## 3. Caveats

- CLI interactive prompts for `run_command` (`npm run build`, `vitest`) timed out waiting for user confirmation in this non-interactive subagent execution environment. Verification was performed via rigorous static code inspection and logic tracing.

---

## 4. Conclusion & Findings

### Findings

#### [Major] Finding 1: Broken Tab Navigation & Dead UI Button (`CMSCareerFair.jsx:931`)
- **Where**: `src/components/admin/CMSCareerFair.jsx`, lines 931–936
- **Why**: Clicking `Canlı Zirve Sahnesi & Soru-Cevap` sets `activeTab = 'live_stage'`, but no component is rendered for `'live_stage'`, leading to a blank screen. Text color is also white-on-white (`text-white` on `bg-white/90`).
- **Suggestion**: Either implement the `live_stage` tab section or remove/fix the button action and ensure valid tab routing and readable contrast colors (`text-red-900 bg-red-50`).

#### [Major] Finding 2: Store Reassignment State Contamination (`useAppStore.js:438-446`)
- **Where**: `src/store/useAppStore.js`, line 442
- **Why**: Reassigning an occupied stand directly to a new company without setting status to `'Boş'` first fails to clear the `tableNumber` from the former occupant's application record.
- **Suggestion**: Update the disassociation condition in `assignStandToCompany` to clear `tableNumber` when `app.tableNumber === standCode && (newStatus === 'Boş' || app.companyName !== companyName)`.

#### [Minor] Finding 3: Invalid Tailwind Spacing Class (`CMSCareerFair.jsx:347`)
- **Where**: `src/components/admin/CMSCareerFair.jsx`, line 347
- **Why**: `space-y-[#990000]` is an invalid Tailwind CSS class.
- **Suggestion**: Remove `space-y-[#990000]` from the class string.

#### [Minor] Finding 4: Corrupted Test Fixture ID (`CMSCareerFair.test.jsx:27`)
- **Where**: `src/__tests__/CMSCareerFair.test.jsx`, line 27
- **Why**: Application ID is formatted as `'APP-[#990000]102'`.
- **Suggestion**: Fix string to `'APP-102'`.

---

## 5. Verified Claims & Requirements Matrix

| Requirement | Claim | Verification Result | Notes |
|---|---|---|---|
| **R1** | Crimson theme (#990000), glassmorphic design, rounded cards | **PARTIAL** | Crimson theme & glassmorphic cards implemented, but invalid `space-y-[#990000]` class found. |
| **R2** | 5-col Question Builder & 7-col Live Simulator reactivity with device view switcher | **PASS** | Form builder adds/edits/reorders questions reactively; device view switcher toggles desktop/tablet/mobile frames. |
| **R3** | 2D Floorplan Map (Zone A/B), StandAssignmentModal, company assignment, notification dispatch, audit logs | **FAIL** | 2D Map and Modal exist, but stand reassignment corrupts store application records and dead button `live_stage` breaks UI. |

---

## 6. Verification Method

To independently verify these findings:
1. Inspect `src/components/admin/CMSCareerFair.jsx` line 931 to see `setActiveTab('live_stage')` and check for missing tab render logic.
2. Inspect `src/store/useAppStore.js` line 442 to observe the `newStatus === 'Boş'` guard that skips clearing previous company `tableNumber` when reassigning stands.
3. Inspect `src/components/admin/CMSCareerFair.jsx` line 347 for `space-y-[#990000]`.
4. Inspect `src/__tests__/CMSCareerFair.test.jsx` line 27 for `APP-[#990000]102`.
