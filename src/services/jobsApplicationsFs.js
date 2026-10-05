import { auth, db } from '../utils/firebase';
import {
  doc, setDoc, updateDoc, getDocs, collection, query, where, serverTimestamp,
} from 'firebase/firestore';

export function currentAuthUid() {
  return auth?.currentUser?.uid || null;
}

export async function saveJobToFirestore(job) {
  const uid = currentAuthUid();
  if (!uid) throw new Error('Oturum gerekli');
  if (!job?.id) throw new Error('job.id gerekli');
  const payload = {
    ...job,
    companyId: uid,
    updatedAt: new Date().toISOString(),
    createdAt: job.createdAt || new Date().toISOString(),
  };
  await setDoc(doc(db, 'jobs', job.id), {
    ...payload,
    createdAtServer: serverTimestamp(),
  }, { merge: true });
  return payload;
}

export async function updateJobStatusFs(jobId, status) {
  const uid = currentAuthUid();
  if (!uid) throw new Error('Oturum gerekli');
  await updateDoc(doc(db, 'jobs', jobId), {
    status,
    updatedAt: new Date().toISOString(),
  });
}

export async function fetchJobsFromFirestore() {
  const snap = await getDocs(collection(db, 'jobs'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveApplicationToFirestore(app) {
  const uid = currentAuthUid();
  if (!uid) throw new Error('Oturum gerekli');
  if (!app?.id || !app?.jobId || !app?.companyId) {
    throw new Error('jobId/companyId/id zorunlu');
  }
  const payload = {
    ...app,
    applicantId: uid,
    status: app.status || 'Onay Bekliyor',
    updatedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'applications', app.id), {
    ...payload,
    createdAt: serverTimestamp(),
  }, { merge: true });
  return payload;
}

export async function fetchApplicationsForApplicant(uid) {
  if (!uid) return [];
  const q = query(collection(db, 'applications'), where('applicantId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchApplicationsForCompany(uid) {
  if (!uid) return [];
  const q = query(collection(db, 'applications'), where('companyId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateApplicationStatusFs(appId, status) {
  const uid = currentAuthUid();
  if (!uid) throw new Error('Oturum gerekli');
  await updateDoc(doc(db, 'applications', appId), {
    status,
    updatedAt: new Date().toISOString(),
  });
}
