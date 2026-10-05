# F-ATS progress (box `core-flows`)

## Done (folded into core items 1–4)

| ID | Status |
|----|--------|
| F-ATS-001 | CompanyFeed seed `[]`; filter `companyId === uid`; CV modal PII scrubbed |
| F-ATS-002 | companyId-only matching (Feed + ApplicationsPanel company path) |
| F-ATS-003 | JobCreator → `saveJobToFirestore` / `setDoc(jobs)` with `companyId = auth.uid` |
| F-ATS-004 | Jobs: company own-job Pasife Al/Aktife Al + `updateJobStatusFs` |
| F-ATS-005 | `firestore.rules` jobs create requires `companyId == auth.uid`; update cannot reassign companyId; emulator tests added in `patches/rules-tests/firestore.rules.test.mjs` (not run here — firebase CLI missing on box) |
| F-ATS-006 | `INITIAL_APPLICANTS` emptied; `iesu_company_ats_board_v1` cleared on load / not re-persisted |
| F-ATS-007 | CMP-001 fallbacks removed from JobCreator / Jobs branchTargetId |
| F-ATS-008 | ApplicationsPanel: no `app_demo_*`; FS load; companyId filter; status → `updateDoc` |
| F-ATS-009 | GPA placeholders → `—` |
| F-ATS-010 | `useAdminStore` `initialApplications = []` |
| Extra | Fake 76–84 match scores gated; guest label Misafir; apply toast only after FS write |

## New service
`src/services/jobsApplicationsFs.js` — jobs/applications CRUD helpers.

## Still open (next)
- Internship approval Firestore + rules + STU-001 scrub in internship modal
- StudentOnboarding (do not touch Register/Login)
- Run `npm run test:rules` when firebase CLI/emulator available
- Apply format-patch/bundle to Windows by owner (do not auto-push)
