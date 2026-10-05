# Core flows audit (HEAD 45cff7a → branch core-flows)

## a. Student
| Area | Status |
|------|--------|
| Profile edit/save | Works via ProfileUpdate + store; residual STU-001/ALU-001 fallbacks in ProfileUpdate/UserProfile (proposal) |
| CV builder save/load/export | AICVBuilder persists locally/store; Math.random only for client ids |
| Job apply | Fixed earlier (auth.uid, companyId); appears in store applications |
| Jobs → CV link + post-apply next step | **Fixed on this branch** |
| Progress %88 / A+ | **Fixed** — derived from 5 signals via `careerProgress.js` |

## b. Company
| Area | Status |
|------|--------|
| Create job | **Fixed** companyId = auth.uid (guard if missing) |
| Edit/close | Existing toggle on JobsAndInternships for own companyId |
| See applicants | **Fixed** — strict companyId filter; no INITIAL mock seed |
| Status change | updateDoc on applications (rules: company own jobs) |

## c. Academic
| Area | Status |
|------|--------|
| Internship approve/reject | UI updates store internships; may not always Firestore-persist advisorId (proposal) |
| Role gate | Doc-role fallback for academic; claim preferred (existing S3) |

## d. Analytics
| Area | Status | Notes |
|------|--------|-------|
| CMSAnalytics | OK after P0-05 | Real checkupRecords or "Veri yok" |

## e. Remaining fakes (proposals)
- UserProfile/PublicUserProfile/ProfileUpdate STU-001/ALU-001/CMP-001 fallbacks
- CMSMessageAudit demo threads
- CareerShorts/IesuWallet toast %88
- Academic internship Firestore write + advisorId rules tightening
