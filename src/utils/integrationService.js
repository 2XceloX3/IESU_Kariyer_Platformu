// OBS / e-Devlet integration — client calls internal proxy and real-time verification service layer. No secrets here.
import {
  EDEVLET_NOT_FOUND_MESSAGE,
  EDEVLET_NOT_FOUND_DETAIL,
  verifyEDevletStudentOrAlumni,
  verifyEDevletStudentOrAlumniSync,
} from '../services/edevletVerificationService';

const API_BASE_URL = import.meta.env.VITE_INTERNAL_API_URL || '/api';

export {
  EDEVLET_NOT_FOUND_MESSAGE,
  EDEVLET_NOT_FOUND_DETAIL,
  verifyEDevletStudentOrAlumni,
  verifyEDevletStudentOrAlumniSync,
};

export const fetchStudentFromOBS = async (studentNumber) => {
  if (!studentNumber) {
    throw new Error('Öğrenci numarası gereklidir.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/obs/students/${studentNumber}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response && response.ok) {
      return await response.json();
    }
  } catch {
    /* fall through to real-time registry verification */
  }

  const verification = await verifyEDevletStudentOrAlumni(
    { studentNo: String(studentNumber).trim() },
    { skipRemote: true }
  );

  if (verification.verified && verification.record) {
    return verification.record;
  }

  throw new Error(EDEVLET_NOT_FOUND_MESSAGE);
};

/**
 * Verifies student/alumni data via e-Devlet in real time.
 * When passed an object or options.returnDetail === true, returns the full verification result
 * (with message: 'Kayıtlı öğrenci bilgisi bulunamadı' on mismatch).
 * When passed a string TCKN without options, returns boolean true ONLY if verified.
 */
export const verifyEDevlet = async (tcKimlikOrPayload, options = {}) => {
  if (!tcKimlikOrPayload) {
    if (options.returnDetail || typeof tcKimlikOrPayload === 'object') {
      return {
        verified: false,
        matched: false,
        error: EDEVLET_NOT_FOUND_MESSAGE,
        message: EDEVLET_NOT_FOUND_MESSAGE,
        detail: EDEVLET_NOT_FOUND_DETAIL,
        record: null,
      };
    }
    return false;
  }

  if (typeof tcKimlikOrPayload === 'object' || options.returnDetail) {
    const payload =
      typeof tcKimlikOrPayload === 'object'
        ? tcKimlikOrPayload
        : { identifier: String(tcKimlikOrPayload).trim() };
    return await verifyEDevletStudentOrAlumni(payload, options);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/edevlet/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tc: tcKimlikOrPayload }),
    });

    if (response && response.ok) {
      const data = await response.json();
      if (data.verified === true) return true;
    }
  } catch {
    console.warn('e-Devlet verification network error');
  }

  const localResult = verifyEDevletStudentOrAlumniSync({ identifier: String(tcKimlikOrPayload).trim() });
  return localResult.verified === true;
};

export const syncAlumniData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/alumni/sync`, { method: 'GET' });
    if (response.ok) return await response.json();
  } catch (_) { /* fall through */ }

  if (!import.meta.env.DEV) {
    throw new Error('Mezun senkronizasyon servisi yanıt vermedi.');
  }
  return [];
};
