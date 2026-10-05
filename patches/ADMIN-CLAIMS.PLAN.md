# Admin custom claims — PLAN (not applied)

## Why
`firestore.rules` `isAdmin()` is **claim-only**: `request.auth.token.role == 'admin'`.
Reading `users/{uid}.role == 'admin'` was removed so a user cannot self-elevate by writing their own doc.

## WARNING — lockout
Any account that today is admin **only** via `users/{uid}.role = 'admin'` (no custom claim) will **lose all admin rule access** (CMS writes, audit_logs, catch-all, role promotions) until a claim is set.
App UI may still *look* admin if the client reads the Firestore doc; **rules will deny**. Set the claim before deploying these rules to production.

## How claims get set
Uses **Firebase Admin SDK** (Cloud Function or one-shot script). Clients must never set claims.

### Minimal Cloud Function (skeleton — do not deploy from this patch alone)

```js
// functions/setAdminClaim.js (skeleton)
const functions = require('firebase-functions');
const admin = require('firebase-admin');
if (!admin.apps.length) admin.initializeApp();

// Callable only by an existing claim-admin OR run once as a privileged ops script.
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Admin claim required');
  }
  const uid = data.uid;
  if (!uid) throw new functions.https.HttpsError('invalid-argument', 'uid required');
  await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
  await admin.firestore().doc(`users/${uid}`).set({ role: 'admin' }, { merge: true });
  return { ok: true, uid };
});
```

### One-shot ops script (bootstrap first admin)

```js
// scripts/bootstrapAdminClaim.mjs (skeleton)
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'))) });
const uid = process.argv[2];
if (!uid) { console.error('Usage: node bootstrapAdminClaim.mjs <uid>'); process.exit(1); }
await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
await admin.firestore().doc(`users/${uid}`).set({ role: 'admin' }, { merge: true });
console.log('Claim set for', uid, '— user must refresh ID token (re-login).');
```

### Academic / company claims (optional later)
Same pattern: `{ role: 'academic' | 'company' | 'employer' }`. Until then, rules allow **doc-role fallback** for those non-admin roles only.

## Deploy order
1. Identify bootstrap admin UID in Firebase Auth.
2. Run bootstrap script → set claim.
3. That user re-logins (token refresh).
4. Deploy `firestore.rules`.
5. Promote academics via admin client or Admin SDK (`role: 'academic'` on users doc).
