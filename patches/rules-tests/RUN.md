# Firestore rules unit tests

```bash
cd /workspace/iesu
npx firebase emulators:exec --only firestore \
  "npx vitest run --config patches/rules-tests/vitest.rules.config.js"
```

Or manually: start emulator, then run vitest against `firestore.rules.test.mjs`.
