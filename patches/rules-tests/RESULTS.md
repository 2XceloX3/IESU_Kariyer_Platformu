# Rules unit test results (box)

Date: 2026-10-05 Europe/Istanbul

Command:
```
npx firebase emulators:exec --only firestore \
  "npx vitest run --config patches/rules-tests/vitest.rules.config.js"
```

Result: **8 passed / 8** (Test Files 1 passed)

Covered:
- create role=admin denied
- create role=academic denied
- create role=student allowed
- student cannot update own role to admin
- admin claim can update role
- apply as someone else denied
- apply as self with matching companyId allowed
- apply with wrong companyId denied

Java: OpenJDK 21 installed on box for emulator.
