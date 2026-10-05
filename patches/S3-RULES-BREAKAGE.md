# Rules change — flows that may break

| Flow | Risk | Mitigation |
|---|---|---|
| Existing admin without custom claim | **LOCKOUT** on all `isAdmin()` paths | Set claim before prod deploy (`ADMIN-CLAIMS.PLAN.md`) |
| Academic self-registration | Create with `role: 'academic'` denied | Register now writes `role: 'alumni'` + `requestedRole: 'academic'` + `status: 'Onay Bekliyor'`; admin promotes |
| Academic login before promotion | Blocked by `Onay Bekliyor` | Intentional |
| Application create with `applicantId` ≠ auth.uid (legacy STU-001) | Denied | Client must use Firebase uid |
| Application create when job missing / `companyId` mismatch / null | Denied | Jobs must have `companyId`; apply payload must copy job.companyId |
| Company updating application when `jobs/{id}.companyId` ≠ auth.uid | Denied | Legacy demo company ids (CMP-*) won't match Auth uid until real company accounts own jobs |
| Applicant setting employerDecision etc. on create | Denied | Expected |
| Client UI showing admin from doc role only | UI may disagree with rules | Align Login/App to require claim or accept read-only until claim |

Rules emulator: patches/rules-tests/RESULTS.md (8/8 passed on box 2026-10-05).
