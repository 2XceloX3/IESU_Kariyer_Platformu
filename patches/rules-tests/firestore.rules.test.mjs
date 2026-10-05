/**
 * Firestore rules unit tests (emulator).
 * Run: see patches/rules-tests/RUN.md
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const EMU = Boolean(process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_EMULATOR_HUB);

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const PROJECT_ID = 'iesu-rules-test';

let testEnv;

beforeAll(async () => {
  if (!EMU) return;
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: readFileSync(resolve(root, 'firestore.rules'), 'utf8'),
    },
  });
});

afterAll(async () => {
  if (!EMU) return;
  await testEnv?.cleanup();
});

beforeEach(async () => {
  if (!EMU || !testEnv) return;
  await testEnv.clearFirestore();
});

function authed(uid, token = {}) {
  return testEnv.authenticatedContext(uid, token).firestore();
}

describe.skipIf(!EMU)('users role escalation', () => {
  it('denies create with role=admin', async () => {
    const db = authed('stu1');
    await assertFails(setDoc(doc(db, 'users/stu1'), { role: 'admin', name: 'X' }));
  });

  it('denies create with role=academic', async () => {
    const db = authed('stu1');
    await assertFails(setDoc(doc(db, 'users/stu1'), { role: 'academic', name: 'X' }));
  });

  it('allows create with role=student', async () => {
    const db = authed('stu1');
    await assertSucceeds(setDoc(doc(db, 'users/stu1'), { role: 'student', name: 'Ogrenci' }));
  });

  it('denies student self-update role to admin', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users/stu1'), { role: 'student', name: 'Ogrenci' });
    });
    const db = authed('stu1');
    await assertFails(updateDoc(doc(db, 'users/stu1'), { role: 'admin' }));
  });

  it('allows admin-claim to change role', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users/stu1'), { role: 'student', name: 'Ogrenci' });
    });
    const db = authed('admin1', { role: 'admin' });
    await assertSucceeds(updateDoc(doc(db, 'users/stu1'), { role: 'academic' }));
  });
});

describe.skipIf(!EMU)('applications applicant binding', () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await setDoc(doc(db, 'jobs/job1'), { companyId: 'co1', title: 'Staj' });
      await setDoc(doc(db, 'users/stu1'), { role: 'student' });
      await setDoc(doc(db, 'users/co1'), { role: 'company' });
    });
  });

  it('denies apply as someone else', async () => {
    const db = authed('stu1');
    await assertFails(setDoc(doc(db, 'applications/a1'), {
      applicantId: 'stuOTHER',
      jobId: 'job1',
      companyId: 'co1',
      status: 'Beklemede',
    }));
  });

  it('allows apply as self with matching job companyId', async () => {
    const db = authed('stu1');
    await assertSucceeds(setDoc(doc(db, 'applications/a1'), {
      applicantId: 'stu1',
      jobId: 'job1',
      companyId: 'co1',
      status: 'Beklemede',
    }));
  });

  it('denies apply with wrong companyId', async () => {
    const db = authed('stu1');
    await assertFails(setDoc(doc(db, 'applications/a1'), {
      applicantId: 'stu1',
      jobId: 'job1',
      companyId: 'OTHER',
      status: 'Beklemede',
    }));
  });
});
