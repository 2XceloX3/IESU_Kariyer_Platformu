## 2026-07-26T09:19:19Z
You are worker_1 for Esenyurt University Career Portal project.
Your working directory is: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\worker_1
Project root is: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active

Your task:
Implement Milestones 2 & 3 for the Geleneksel Kariyer Günleri Google Stitch Yükseltmesi in `src/components/admin/CMSCareerFair.jsx` and store `src/store/useAppStore.js`, plus tests in `src/__tests__/CMSCareerFair.test.jsx`.

Requirements:
1. **R1: Google Stitch Design & Crimson Corporate Language (`CMSCareerFair.jsx`)**:
   - Redesign `CMSCareerFair.jsx` with Google Stitch crimson/bordo (#990000, #7A0000, #5C0000) color scheme.
   - Apply glassmorphism effects (`backdrop-blur-xl bg-white/80 border border-white/20`), rounded premium cards (`rounded-2xl`), micro-animations, and polished corporate tabs.

2. **R2: Live Side-by-Side Simulator & Form Architecture**:
   - Implement dynamic 12-column responsive layout (`lg:grid-cols-12`) in the Form Builder panel.
   - Left column (5 cols): Form Manager & Question Builder (add field, remove field, edit question text/field type [text, textarea, select, file, checkbox], required toggle, order).
   - Right column (7 cols): `sticky top-24` Live Preview Simulator rendering real-time applicant view.
   - As questions or form details change in the left column, the simulator on the right MUST update dynamically and instantly in real-time. Include Desktop/Tablet/Mobile view toggle.

3. **R3: Event Stand & Table Interactive Floorplan Map / Layout Allocator**:
   - Implement visual 2D interactive floorplan map for stand/table assignments in Stand Allocator tab.
   - Floorplan grid matrix: Zone A (Stant A-01 to A-12) and Zone B (Stant B-01 to B-12) (24 total stands).
   - Each stand slot displays booth code (e.g. Stant A-12), status badge (Green = Boş, Red = Atandı, Amber = Rezerve), and assigned company name.
   - Clicking a stand opens a glassmorphic assignment modal allowing single-click assignment of approved companies (`careerFairApplications` filtered by `status === 'Onaylandı'`).
   - Confirming stand assignment updates stand status, assigns company, triggers system notification in Zustand store (`notifications`), records audit log, and displays automated notification/email alert trigger.

4. **Acceptance & Verification**:
   - Use safe optional chaining everywhere (`questions?.length || 0`, `stands?.length || 0`, `applications?.length || 0`) to guarantee zero `.length` undefined errors.
   - Create or update Vitest unit tests in `src/__tests__/CMSCareerFair.test.jsx` verifying Stitch UI, Live Simulator updates, and Stand Allocation.
   - Execute `npm run build` and `npm test` using run_command to verify 100% build and test pass.

5. **MANDATORY INTEGRITY WARNING**:
   DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your report in `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\worker_1\handoff.md` and send a message when done.
