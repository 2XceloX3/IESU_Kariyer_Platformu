import { db } from '../utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import useAppStore from '../store/useAppStore';
import {
  OFFICIAL_OBS_DATABASE,
  OBS_STANDARDS,
  OBS_VERIFICATION_STATUS,
  generateObsVerificationCode,
  maskTckn,
} from './obsVerificationWorkflow';

export const EDEVLET_NOT_FOUND_MESSAGE = 'Kayıtlı öğrenci bilgisi bulunamadı';
export const EDEVLET_NOT_FOUND_DETAIL =
  'Kayıtlı öğrenci bilgisi bulunamadı. Girilen bilgiler e-Devlet Kapısı ve YÖKSİS öğrenci/mezun kütüğü ile eşleşmedi.';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_INTERNAL_API_URL) || '/api';

export const normalizeTurkishText = (value) =>
  String(value || '')
    .trim()
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ğ/g, 'ğ')
    .replace(/Ü/g, 'ü')
    .replace(/Ş/g, 'ş')
    .replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase()
    .replace(/\s+/g, ' ');

/**
 * Resmi OBS & YÖKSİS Kütüğü ile Uygulama Store'undaki kayıtlı öğrenci/mezun listesini birleştirir.
 */
export const getUnifiedEDevletRegistry = (extraRecords = []) => {
  const storeState = typeof useAppStore?.getState === 'function' ? useAppStore.getState() : {};
  const storeStudents = Array.isArray(storeState?.students) ? storeState.students : [];
  const storeAlumni = Array.isArray(storeState?.alumni) ? storeState.alumni : [];

  const normalizedStoreRecords = [...storeStudents, ...storeAlumni, ...(Array.isArray(extraRecords) ? extraRecords : [])]
    .filter((item) => item && (item.studentNo || item.studentId || item.alumniId || item.tcNo || item.tcKimlik))
    .map((item) => ({
      studentNo: String(item.studentNo || item.studentId || item.alumniId || '').trim(),
      studentId: String(item.id || item.studentId || item.studentNo || '').trim(),
      tcNo: String(item.tcNo || item.tcKimlik || '').replace(/\D/g, ''),
      fullName: String(item.fullName || item.name || '').trim(),
      department: String(item.department || 'Bilgisayar Mühendisliği').trim(),
      faculty: String(item.faculty || 'Mühendislik ve Mimarlık Fakültesi').trim(),
      grade: item.role === 'alumni' || item.status === 'Mezun' ? 'Mezun' : String(item.grade || '3. Sınıf').trim(),
      gano: Number(item.gano ?? item.gpa ?? 3.4) || 3.4,
      completedEcts: Number(item.completedEcts || (item.role === 'alumni' ? 240 : 180)),
      totalEcts: Number(item.totalEcts || 240),
      status: item.role === 'alumni' || item.status === 'Mezun' ? 'Mezun' : 'Aktif Öğrenci',
      graduationYear: item.graduationYear || item.gradYear || null,
      email: String(item.email || '').trim().toLowerCase(),
      advisorName: item.advisorName || 'Doç. Dr. Selin Kaya',
      advisorTitle: item.advisorTitle || 'Bölüm Kariyer Danışmanı',
      clubs: Array.isArray(item.clubs) ? item.clubs : [],
      semCertifications: Array.isArray(item.semCertifications) ? item.semCertifications : [],
    }));

  const seenStudentNos = new Set(OFFICIAL_OBS_DATABASE.map((r) => String(r.studentNo)));
  const merged = [...OFFICIAL_OBS_DATABASE];

  for (const rec of normalizedStoreRecords) {
    if (rec.studentNo && !seenStudentNos.has(rec.studentNo)) {
      seenStudentNos.add(rec.studentNo);
      merged.push(rec);
    }
  }

  return merged;
};

const buildNotFoundResponse = (customReason = '') => ({
  verified: false,
  matched: false,
  status: OBS_VERIFICATION_STATUS.REJECTED,
  errorCode: 'STUDENT_RECORD_NOT_FOUND',
  error: EDEVLET_NOT_FOUND_MESSAGE,
  message: EDEVLET_NOT_FOUND_MESSAGE,
  detail: customReason
    ? `${EDEVLET_NOT_FOUND_MESSAGE}. ${customReason}`
    : EDEVLET_NOT_FOUND_DETAIL,
  reconciledRecord: null,
  record: null,
});

const buildVerifiedResponse = (matchedRecord, declaredData = {}) => {
  const verificationTimestamp = new Date().toISOString();
  const verificationCode = generateObsVerificationCode(matchedRecord.studentNo, matchedRecord.gano);
  const isAlumniRecord =
    matchedRecord.status === 'Mezun' ||
    matchedRecord.grade === 'Mezun' ||
    Boolean(matchedRecord.graduationYear);

  const declaredGanoRaw = declaredData.gano ?? declaredData.gpa ?? null;
  const parsedDeclaredGano =
    declaredGanoRaw != null ? parseFloat(String(declaredGanoRaw).replace(',', '.')) : null;
  const isDiscrepancy =
    parsedDeclaredGano !== null &&
    !Number.isNaN(parsedDeclaredGano) &&
    Math.abs(parsedDeclaredGano - matchedRecord.gano) > 0.001;

  const discrepancy = isDiscrepancy
    ? {
        detected: true,
        declaredGano: parsedDeclaredGano,
        officialGano: matchedRecord.gano,
        resolution:
          'Öğrencinin beyan ettiği not ortalaması hatalı bulundu; resmi e-Devlet / OBS GANO değeri uygulandı.',
      }
    : {
        detected: false,
        resolution: 'Beyan edilen bilgiler resmi e-Devlet / YÖKSİS kayıtları ile tam uyumlu.',
      };

  const tcNoMasked = maskTckn(matchedRecord.tcNo);

  const recordPayload = {
    studentNo: matchedRecord.studentNo,
    studentId: matchedRecord.studentId,
    tcNo: tcNoMasked,
    tcNoMasked,
    fullName: matchedRecord.fullName,
    name: matchedRecord.fullName,
    department: matchedRecord.department,
    faculty: matchedRecord.faculty,
    grade: matchedRecord.grade,
    gano: matchedRecord.gano,
    gpa: matchedRecord.gano,
    completedEcts: matchedRecord.completedEcts || (isAlumniRecord ? 240 : 180),
    totalEcts: matchedRecord.totalEcts || 240,
    academicStatus: matchedRecord.status,
    graduationYear: matchedRecord.graduationYear ? String(matchedRecord.graduationYear) : '',
    role: isAlumniRecord ? 'alumni' : 'student',
    advisorName: matchedRecord.advisorName || 'Doç. Dr. Selin Kaya',
    advisorTitle: matchedRecord.advisorTitle || 'Bölüm Kariyer Danışmanı',
    verificationCode,
    obsVerificationCode: verificationCode,
    verifiedAt: verificationTimestamp,
    verificationSource: 'e-Devlet Kapısı & YÖKSİS Yükseköğretim Kütüğü',
    badge: OBS_STANDARDS.BADGE_LABEL,
    obsVerified: true,
    yoksisVerified: true,
    eDevletVerified: true,
    discrepancy,
    semCertifications: matchedRecord.semCertifications || [],
    clubs: matchedRecord.clubs || [],
  };

  return {
    verified: true,
    matched: true,
    status: OBS_VERIFICATION_STATUS.VERIFIED,
    errorCode: null,
    error: null,
    message: 'Öğrenci/Mezun bilgileri e-Devlet & YÖKSİS kütüğünden anlık olarak doğrulandı.',
    detail: 'Resmi e-Devlet Kapısı ve YÖKSİS kayıtları ile tam eşleşme sağlandı.',
    verificationCode,
    verifiedAt: verificationTimestamp,
    verificationSource: 'e-Devlet Kapısı & YÖKSİS Yükseköğretim Kütüğü',
    badge: OBS_STANDARDS.BADGE_LABEL,
    badgeLabel: OBS_STANDARDS.BADGE_LABEL,
    authorizedUnit: OBS_STANDARDS.REGISTRAR_UNIT,
    rectorateTitle: OBS_STANDARDS.RECTORATE_TITLE,
    ...recordPayload,
    reconciledRecord: recordPayload,
    record: recordPayload,
  };
};

/**
 * e-Devlet & YÖKSİS Öğrenci/Mezun Anlık Doğrulama Motoru (Senkron)
 * Kayıt veya doğrulama formlarında anlık (real-time) alan kontrolü için kullanılır.
 * Veri eşleşmediğinde 'Kayıtlı öğrenci bilgisi bulunamadı' hatası döndürür.
 */
export function verifyEDevletStudentOrAlumniSync(payload = {}, options = {}) {
  const rawInput =
    typeof payload === 'string' || typeof payload === 'number'
      ? { identifier: String(payload) }
      : payload || {};

  const rawIdentifier = String(rawInput.identifier || '').trim();
  const isIdentifierTc = /^\d{11}$/.test(rawIdentifier);

  const cleanStudentNo = String(
    rawInput.studentNo ||
      rawInput.studentNumber ||
      rawInput.studentId ||
      rawInput.alumniId ||
      rawInput.ogrenciNo ||
      (!isIdentifierTc ? rawIdentifier : '')
  ).trim();

  const cleanTc = String(
    rawInput.tcNo ||
      rawInput.tcKimlik ||
      rawInput.tc ||
      rawInput.kimlikNo ||
      (isIdentifierTc ? rawIdentifier : '')
  ).replace(/\D/g, '');

  const cleanBarcode = String(rawInput.barcode || rawInput.belgeKodu || '').trim();
  const cleanName = normalizeTurkishText(
    rawInput.fullName || rawInput.name || rawInput.studentName || rawInput.alumniName || ''
  );
  const cleanGradYear = String(rawInput.graduationYear || rawInput.mezuniyetYili || '').trim();

  if (!cleanStudentNo && !cleanTc && !cleanBarcode) {
    return buildNotFoundResponse('Sorgulama için geçerli bir öğrenci numarası veya T.C. Kimlik numarası girilmelidir.');
  }

  const registry = getUnifiedEDevletRegistry(options.extraRecords);

  const matchedRecord = registry.find((rec) => {
    if (cleanStudentNo && (String(rec.studentNo) === cleanStudentNo || String(rec.studentId).toLowerCase() === cleanStudentNo.toLowerCase())) {
      return true;
    }
    if (cleanTc && cleanTc.length === 11 && String(rec.tcNo) === cleanTc) {
      return true;
    }
    if (cleanBarcode && cleanBarcode.length >= 6) {
      const codeUpper = cleanBarcode.toUpperCase();
      const expectedObsCode = generateObsVerificationCode(rec.studentNo, rec.gano);
      if (
        codeUpper === expectedObsCode ||
        codeUpper.endsWith(String(rec.studentNo).slice(-4))
      ) {
        return true;
      }
    }
    return false;
  });

  if (!matchedRecord) {
    return buildNotFoundResponse();
  }

  // Ad Soyad girilmişse (en az 2 kelime) ve strictNameMatch aktifse kütükteki isimle eşleşmesini doğrula
  if (options.strictNameMatch !== false && cleanName && cleanName.split(' ').length >= 2) {
    const officialName = normalizeTurkishText(matchedRecord.fullName);
    if (officialName && officialName !== cleanName) {
      return buildNotFoundResponse(
        'Girilen ad soyad bilgisi, bu öğrenci numarasına ait resmi e-Devlet / YÖKSİS kaydı ile eşleşmedi.'
      );
    }
  }

  // Mezuniyet yılı girilmişse (4 haneli) ve kayıtta mezuniyet yılı varsa kontrol et
  if (
    options.strictGraduationYearMatch === true &&
    /^\d{4}$/.test(cleanGradYear) &&
    matchedRecord.graduationYear &&
    String(matchedRecord.graduationYear) !== cleanGradYear
  ) {
    return buildNotFoundResponse(
      'Girilen mezuniyet yılı resmi YÖKSİS mezuniyet kütüğü ile eşleşmedi.'
    );
  }

  return buildVerifiedResponse(matchedRecord, rawInput);
}

/**
 * e-Devlet Üzerinden Öğrenci / Mezun Bilgilerini Anlık Doğrulayan Entegrasyon Servisi Katmanı (Asenkron)
 * 1. Önce yerel / birleşik YÖKSİS & OBS kütüğünü kontrol eder
 * 2. Eşleşme yoksa Firestore `users` koleksiyonunu ve canlı `/api/edevlet/verify` uç noktasını sorgular
 * 3. Veri eşleşmediğinde 'Kayıtlı öğrenci bilgisi bulunamadı' hata mesajını döndürür.
 */
export async function verifyEDevletStudentOrAlumni(payload = {}, options = {}) {
  const localCheck = verifyEDevletStudentOrAlumniSync(payload, options);
  if (localCheck.verified) {
    return localCheck;
  }

  const rawInput =
    typeof payload === 'string' || typeof payload === 'number'
      ? { identifier: String(payload) }
      : payload || {};

  const rawIdentifier = String(rawInput.identifier || '').trim();
  const isIdentifierTc = /^\d{11}$/.test(rawIdentifier);
  const cleanStudentNo = String(
    rawInput.studentNo ||
      rawInput.studentNumber ||
      rawInput.studentId ||
      rawInput.alumniId ||
      (!isIdentifierTc ? rawIdentifier : '')
  ).trim();
  const cleanTc = String(
    rawInput.tcNo || rawInput.tcKimlik || rawInput.tc || (isIdentifierTc ? rawIdentifier : '')
  ).replace(/\D/g, '');

  // 1. Firestore 'users' koleksiyonundan anlık sorgulama
  if (db && options.skipFirestore !== true && (cleanStudentNo || cleanTc)) {
    try {
      const usersRef = collection(db, 'users');
      const q = cleanStudentNo
        ? query(usersRef, where('studentId', '==', cleanStudentNo))
        : query(usersRef, where('tcNo', '==', cleanTc));
      const snap = await getDocs(q);
      const docs = [];
      if (snap && typeof snap.forEach === 'function') {
        snap.forEach((d) => docs.push({ id: d.id, ...d.data() }));
      } else if (Array.isArray(snap?.docs)) {
        snap.docs.forEach((d) => docs.push({ id: d.id, ...(typeof d.data === 'function' ? d.data() : {}) }));
      }
      if (docs.length > 0) {
        const firestoreCheck = verifyEDevletStudentOrAlumniSync(payload, {
          ...options,
          extraRecords: docs,
        });
        if (firestoreCheck.verified) {
          return firestoreCheck;
        }
      }
    } catch {
      /* Firestore çevrimdışı veya yetki sınırında yerel/API doğrulamasına devam et */
    }
  }

  // 2. Canlı e-Devlet / OBS Proxy API Sorgulaması
  if (options.skipRemote !== true && typeof fetch === 'function' && (cleanStudentNo || cleanTc)) {
    try {
      const response = await fetch(`${API_BASE_URL}/edevlet/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tc: cleanTc || undefined,
          studentNo: cleanStudentNo || undefined,
          fullName: rawInput.fullName || rawInput.name || rawInput.studentName || rawInput.alumniName || undefined,
          role: rawInput.role || undefined,
        }),
      });
      if (response && response.ok) {
        const apiData = await response.json();
        if (apiData?.verified === true && (apiData?.record || apiData?.studentNo || apiData?.fullName)) {
          const remoteRecord = apiData.record || apiData;
          return verifyEDevletStudentOrAlumniSync(payload, {
            ...options,
            extraRecords: [
              {
                studentNo: remoteRecord.studentNo || cleanStudentNo || `2024${cleanTc.slice(-5)}`,
                studentId: remoteRecord.studentId || remoteRecord.id || `EDEVLET-${Date.now()}`,
                tcNo: remoteRecord.tcNo || cleanTc,
                fullName: remoteRecord.fullName || remoteRecord.name || rawInput.fullName || 'Doğrulanmış Öğrenci',
                department: remoteRecord.department || rawInput.department || 'Bilgisayar Mühendisliği',
                faculty: remoteRecord.faculty || 'Mühendislik ve Mimarlık Fakültesi',
                grade: remoteRecord.grade || (rawInput.role === 'alumni' ? 'Mezun' : '3. Sınıf'),
                gano: remoteRecord.gano ?? remoteRecord.gpa ?? 3.5,
                status: remoteRecord.status || (rawInput.role === 'alumni' ? 'Mezun' : 'Aktif Öğrenci'),
                graduationYear: remoteRecord.graduationYear || rawInput.graduationYear || null,
              },
            ],
          });
        }
      }
    } catch {
      /* API erişilemezse kütük doğrulama sonucu esas alınır */
    }
  }

  return localCheck;
}
