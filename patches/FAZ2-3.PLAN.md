# Faz 2 & Faz 3 — Implementation Plan (NOT implemented yet)

Source: `yasayan-kovan-mimari.md`. Faz 0 cleanup is in the P0 patches; this plan is for owner approval only.

## Faz 2 — Mezun istihdam beyanı → Firestore → Analytics

**Goal:** Real `employmentDeclarations` documents drive CMSAnalytics ratios; 0 records ⇒ empty UI / blocked export. minN gate (e.g. 10).

**Data model (new collection):**
```
employmentDeclarations/{id}
  alumniId, employerName, employerCompanyId?, employed, relatedToMajor,
  sector, workMode, startDate, period, departmentId, programId?,
  source: self_report|employer_confirmed|admin_corrected,
  status, createdBy, createdAt, updatedAt, verifiedBy?, verifiedAt?
```

**Files to touch:**
| File | Change |
|---|---|
| `src/components/AlumniInformationSystem.jsx` / `ProfileUpdate.jsx` | Form writes Firestore doc (not only local checkupRecords) with source+period+departmentId |
| `src/brain/useAdminStore.js` / `useAppStore` | Slice + sync for employmentDeclarations |
| `src/services/dbSync.js` | Add collection to sync list |
| `src/components/admin/CMSAnalytics.jsx` | Compute KPIs only from employmentDeclarations (fallback checkupRecords deprecated); minN empty state |
| `firestore.rules` | Alumni create/update own; academic/admin aggregate read |
| Cloud Function (optional) | Write `kpiSnapshots` from declarations |

**Rules sketch:** alumni `create` if `request.auth.uid == alumniId`; no client write to `kpiSnapshots`.

**Effort:** ~3–5 eng-days (UI form harden + rules + analytics rewire + tests). Higher if CF + period lock included.

**Acceptance:** 1 alumni submit → doc listed; CMSAnalytics ratio = pay/payda only from these docs; 0 docs ⇒ "Henüz veri yok", export disabled.

## Faz 3 — Akademisyen staj / bölüm KPI

**Goal:** CMSAcademicRadar + AcademicStaffFeed use `internships` + `internshipEvaluations`; demo arrays gone (Faz 0); advisor writes require `advisorId` + academic role; department-scoped KPIs; n < minN ⇒ empty.

**Data model:**
```
internships/{id}: studentId, companyId, advisorId, statuses, departmentId, period
internshipEvaluations/{id}: internshipId, companyId, scores, hireIntent
kpiSnapshots/{id}: backend-only aggregates
```

**Files to touch:**
| File | Change |
|---|---|
| `AcademicStaffFeed.jsx` | Approve/reject writes internship advisorStatus; KPIs from store internships filtered by advisor department |
| `CMSAcademicRadar.jsx` | Replace localStorage-first with Firestore/store internships; faculty cards from aggregates or empty |
| `firestore.rules` | `isAcademic()` already added in S3; tighten internship update to advisorId match |
| Company ATS / student staj panels | Ensure they write the same internship docs (shared protocol) |
| Tests | Hive isolation + advisor permission |

**Effort:** ~5–8 eng-days (triple-status protocol across student/company/academic + rules + UI).

**Acceptance:** No demo arrays; academic approve persists with advisorId; department KPI only own dept; n < minN empty; company/student/alumni hive application flows unchanged.

## Out of scope here
YÖK Atlas scrape as KPI source; client secrets; Faz 1 full collection bootstrap (can land with Faz 2).
