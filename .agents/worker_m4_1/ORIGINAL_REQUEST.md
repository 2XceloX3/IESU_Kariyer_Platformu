## 2026-07-26T09:25:31Z
You are worker_m4_1 for Esenyurt University Career Portal project.
Your working directory is: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\worker_m4_1
Project root is: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active

Your task:
Apply 4 precise fixes to `src/components/admin/CMSCareerFair.jsx`, `src/store/useAppStore.js`, and `src/__tests__/CMSCareerFair.test.jsx`:

1. **Fix 1: `CMSCareerFair.jsx` - Live Stage Tab & Contrast Fix**:
   - Implement `{activeTab === 'live_stage' && (...)}` content panel in `CMSCareerFair.jsx` for "Canlı Zirve Sahnesi & Soru-Cevap".
   - Include Google Stitch crimson design (#990000), Live Stream indicator ("Rektörlük & Kariyer Merkezi Ana Sahne"), Speaker agenda card, and Interactive Live Q&A / Audience Question Feed simulator.
   - Fix header tab button contrast styling (`activeTab === 'live_stage'` active state and unselected hover state).

2. **Fix 2: `src/store/useAppStore.js` - Stand Reassignment Disassociation**:
   - Update `assignStandToCompany` in `useAppStore.js` so that when a stand code is assigned to a new company, any previous company application holding `app.tableNumber === standCode` gets `tableNumber: null` cleared:
     `if (app.tableNumber === standCode && (newStatus === 'Boş' || app.companyName !== companyName)) return { ...app, tableNumber: null };`

3. **Fix 3: `CMSCareerFair.jsx` - Invalid Tailwind Class Cleanup**:
   - Remove invalid class string `space-y-[#990000]` from line 347.

4. **Fix 4: `src/__tests__/CMSCareerFair.test.jsx` - Fixture ID & Live Stage Test**:
   - Fix corrupted string ID `'APP-[#990000]102'` to `'APP-102'`.
   - Add test case verifying `Canlı Zirve Sahnesi & Soru-Cevap` tab button navigation renders the live stage panel properly.

5. **Verification**:
   - Run `npm run build` and `npm test` using run_command to verify 100% clean compilation and test pass.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your handoff report to `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\worker_m4_1\handoff.md` and send a message when done.

## 2026-07-26T09:25:35Z
Message from parent:
**Context**: Additional validation fix for `CMSCareerFair.jsx`
**Content**: Challenger 1 identified a minor validation gap in `handleSaveEditField` (line 142 of `CMSCareerFair.jsx`):
Please add empty title validation: `if (!editingFieldData.label || !editingFieldData.label.trim()) return;` inside `handleSaveEditField` so inline question title edits cannot save empty strings.
**Action**: Include this validation check in your fixes for `CMSCareerFair.jsx`.

## 2026-07-26T09:26:38Z
Message from parent:
**Context**: Double Stand Assignment Clearing & Notification Counter Logic for `useAppStore.js`
**Content**: Challenger 2 identified two store state refinement requirements for `assignStandToCompany` in `src/store/useAppStore.js`:
1. **Stand Re-assignment Clearing**:
   When assigning `standCode` to `companyName` with `newStatus === 'Atandı'` or `'Rezerve'`:
   - In `stands`: also clear any previous stand occupied by `companyName` (`if (s.assignedCompanyName === companyName && s.code !== standCode) return { ...s, status: 'Boş', assignedCompanyId: null, assignedCompanyName: null };`).
   - In `applications`: set `app.tableNumber = standCode` for `companyName`, and clear `app.tableNumber = null` for any other application previously assigned `standCode`.
2. **Notification Unread Counter**:
   When dispatching notification in `assignStandToCompany`, also increment `unreadNotificationsCount`: `unreadNotificationsCount: (state.unreadNotificationsCount || 0) + 1`.
**Action**: Incorporate these refinements into your store updates.
