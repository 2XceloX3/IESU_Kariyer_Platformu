# Proposal: department-scoped academic KPI access

**Status:** not implemented — `departmentId` is **not** present on users/records today (only free-text `department` name on Register).

## Minimal data model
- `users/{uid}.departmentId` (string, FK → `departments/{id}`)
- All KPI source docs (`employmentDeclarations`, `internships`, …) carry `departmentId`
- Optional `departments/{id}`: `{ name, facultyId }`

## Rules sketch
```
function sameDepartment(docDept) {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.departmentId == docDept;
}
match /employmentDeclarations/{id} {
  allow read: if isAdmin() || (isAcademic() && sameDepartment(resource.data.departmentId));
}
```

## Emulator test (when model lands)
- Academic uid A dept=D1 cannot get() declaration with departmentId=D2
- Can get() when D1

## Effort
~2–3 eng-days (migrate users + backfill + rules + UI filter + emulator tests).
