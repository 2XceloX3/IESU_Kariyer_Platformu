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


describe.skipIf(!EMU)('jobs companyId create binding', () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await setDoc(doc(db, 'users/co1'), { role: 'company' });
      await setDoc(doc(db, 'users/co2'), { role: 'company' });
      await setDoc(doc(db, 'users/stu1'), { role: 'student' });
    });
  });

  it('allows company create with companyId == auth.uid', async () => {
    const db = authed('co1', { role: 'company' });
    await assertSucceeds(setDoc(doc(db, 'jobs/j-own'), {
      companyId: 'co1',
      title: 'Staj',
      status: 'Aktif',
    }));
  });

  it('denies company create with foreign companyId', async () => {
    const db = authed('co1', { role: 'company' });
    await assertFails(setDoc(doc(db, 'jobs/j-other'), {
      companyId: 'co2',
      title: 'Staj',
      status: 'Aktif',
    }));
  });

  it('denies student create job', async () => {
    const db = authed('stu1');
    await assertFails(setDoc(doc(db, 'jobs/j-stu'), {
      companyId: 'stu1',
      title: 'Staj',
      status: 'Aktif',
    }));
  });

  it('allows owner company to update status', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'jobs/j-upd'), {
        companyId: 'co1',
        title: 'Staj',
        status: 'Aktif',
      });
    });
    const db = authed('co1', { role: 'company' });
    await assertSucceeds(updateDoc(doc(db, 'jobs/j-upd'), { status: 'Pasif' }));
  });

  it('denies other company update', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'jobs/j-upd2'), {
        companyId: 'co1',
        title: 'Staj',
        status: 'Aktif',
      });
    });
    const db = authed('co2', { role: 'company' });
    await assertFails(updateDoc(doc(db, 'jobs/j-upd2'), { status: 'Pasif' }));
  });
});


describe.skipIf(!EMU)('internships student binding', () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await setDoc(doc(db, 'users/stu1'), { role: 'student' });
      await setDoc(doc(db, 'users/acad1'), { role: 'academic' });
      await setDoc(doc(db, 'users/stu2'), { role: 'student' });
    });
  });

  it('allows student create with studentId == auth.uid', async () => {
    const db = authed('stu1');
    await assertSucceeds(setDoc(doc(db, 'internships/i1'), {
      studentId: 'stu1',
      company: 'Firma A',
      status: 'Onay Bekliyor',
      advisorStatus: 'pending',
    }));
  });

  it('denies student create for another studentId', async () => {
    const db = authed('stu1');
    await assertFails(setDoc(doc(db, 'internships/i2'), {
      studentId: 'stu2',
      company: 'Firma A',
      status: 'Onay Bekliyor',
      advisorStatus: 'pending',
    }));
  });

  it('allows academic to approve', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'internships/i3'), {
        studentId: 'stu1',
        company: 'Firma A',
        status: 'Onay Bekliyor',
        advisorStatus: 'pending',
      });
    });
    const db = authed('acad1', { role: 'academic' });
    await assertSucceeds(updateDoc(doc(db, 'internships/i3'), {
      status: 'Onaylandı',
      advisorStatus: 'approved',
      studentId: 'stu1',
      reviewedBy: 'acad1',
    }));
  });

  it('denies other student reading foreign internship', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'internships/i4'), {
        studentId: 'stu1',
        company: 'Firma A',
        status: 'Onay Bekliyor',
      });
    });
    const db = authed('stu2');
    await assertFails(getDoc(doc(db, 'internships/i4')));
  });

  it('allows owner student to read own internship', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'internships/i5'), {
        studentId: 'stu1',
        company: 'Firma A',
        status: 'Onay Bekliyor',
      });
    });
    const db = authed('stu1');
    await assertSucceeds(getDoc(doc(db, 'internships/i5')));
  });
});
