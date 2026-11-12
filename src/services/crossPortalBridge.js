import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

export async function syncInternshipToAcademicApproval(applicationData, companyDecision) {
  if (!db || !applicationData) return null;
  const approvalId = `ACAD_APP_${applicationData.id || Date.now()}`;
  const approvalPayload = {
    id: approvalId,
    applicationId: applicationData.id || '',
    studentId: applicationData.applicantId || applicationData.studentId || '',
    studentName: applicationData.applicantName || applicationData.studentName || '',
    department: applicationData.department || 'Genel',
    companyId: applicationData.companyId || '',
    companyName: applicationData.companyName || '',
    internshipType: applicationData.internshipType || 'Zorunlu Staj',
    companyStatus: companyDecision,
    academicStatus: companyDecision === 'company_approved' ? 'pending_academic_review' : 'cancelled',
    sgkInsuranceStatus: 'pending_sgk_entry',
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'academicApprovals', approvalId), approvalPayload, { merge: true });
  await addDoc(collection(db, 'notifications'), {
    recipientId: approvalPayload.studentId,
    title: 'Staj Başvurunuz Akademik Onaya İletildi',
    message: `${approvalPayload.companyName} staj başvurunuzu onayladı. Akademik koordinatör onayı bekleniyor.`,
    type: 'internship_workflow',
    read: false,
    createdAt: serverTimestamp(),
  });
  await addDoc(collection(db, 'audit_logs'), {
    action: 'INTERNSHIP_ACADEMIC_BRIDGE_SYNC',
    targetId: approvalId,
    actorRole: 'company',
    summary: `${approvalPayload.studentName} staj başvurusu akademik onay kuyruğuna aktarıldı.`,
    timestamp: serverTimestamp(),
  });
  return approvalPayload;
}

export async function notifyApplicantOnATSStatusChange(application, nextStatus, note = '') {
  if (!db || !application?.applicantId) return;
  const statusLabels = {
    inceleniyor: 'İnceleniyor',
    mulakat: 'Mülakat Aşamasına Geçti',
    teklif: 'Teklif İletildi',
    kabul: 'Kabul Edildi',
    red: 'Olumsuz Sonuçlandı',
  };
  const humanStatus = statusLabels[nextStatus] || nextStatus;
  await addDoc(collection(db, 'notifications'), {
    recipientId: application.applicantId,
    title: `Başvuru Durumu Güncellendi: ${humanStatus}`,
    message: `${application.companyName || 'Firma'} - ${application.jobTitle || 'İlan'} başvurunuzun durumu "${humanStatus}" olarak güncellendi.${note ? ' Not: ' + note : ''}`,
    type: 'ats_status_update',
    relatedApplicationId: application.id || '',
    read: false,
    createdAt: serverTimestamp(),
  });
}
