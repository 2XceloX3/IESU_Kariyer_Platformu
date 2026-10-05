import { auth, db } from '../utils/firebase';
import {
  doc, setDoc, updateDoc, getDocs, collection, query, where, serverTimestamp,
} from 'firebase/firestore';

export function currentAuthUid() {
  return auth?.currentUser?.uid || null;
}

/** Student creates own internship request (studentId must be auth.uid). */
export async function createInternshipRequest(data) {
  const uid = currentAuthUid();
  if (!uid) throw new Error('Oturum gerekli');
  const id = data?.id || `INT-${Date.now()}`;
  const payload = {
    ...data,
    id,
    studentId: uid,
    status: data.status || 'Onay Bekliyor',
    advisorStatus: data.advisorStatus || 'pending',
    companyStatus: data.companyStatus || 'pending',
    updatedAt: new Date().toISOString(),
    createdAt: data.createdAt || new Date().toISOString(),
  };
  await setDoc(doc(db, 'internships', id), {
    ...payload,
    createdAtServer: serverTimestamp(),
  }, { merge: true });
  return payload;
}

export async function fetchInternshipsForStudent(uid) {
  if (!uid) return [];
  const q = query(collection(db, 'internships'), where('studentId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchPendingInternships() {
  const q = query(collection(db, 'internships'), where('status', '==', 'Onay Bekliyor'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchAllInternships() {
  const snap = await getDocs(collection(db, 'internships'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Academic or admin sets approval outcome. */
export async function setInternshipDecision(internshipId, { status, advisorStatus, reviewerId, reviewerName }) {
  const uid = currentAuthUid();
  if (!uid) throw new Error('Oturum gerekli');
  if (!internshipId) throw new Error('internshipId gerekli');
  const patch = {
    status,
    advisorStatus: advisorStatus || (status === 'Onaylandı' ? 'approved' : status === 'Reddedildi' ? 'rejected' : 'pending'),
    reviewedBy: reviewerId || uid,
    reviewerName: reviewerName || null,
    reviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await updateDoc(doc(db, 'internships', internshipId), patch);
  return patch;
}

export { mapInternshipToPanelStatus } from './internshipMap';
