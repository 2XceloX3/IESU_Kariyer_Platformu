/**
 * src/services/internshipWorkflow.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) Resmî Staj, 3308 & 5510 Sayılı Kanun SGK İş Akışı ve Komisyon Motoru
 *
 * Yasal Mevzuat Referansları:
 * - 3308 Sayılı Mesleki Eğitim Kanunu (Madde 25: Ücret ve Devlet Katkısı)
 * - 5510 Sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu (Madde 5/b: Yükseköğrenim Stajyerleri)
 * - SGK Sigortalı İşe Giriş Bildirgesi (Sigorta Kolu: 07 - Çırak / Stajyer / Kursiyer)
 */

export const LAW_REFERENCES = {
  LAW_3308: '3308 Sayılı Mesleki Eğitim Kanunu',
  LAW_5510_5B: '5510 Sayılı Kanun Madde 5/b (İş Kazası, Meslek Hastalığı ve GSS)',
  SGK_BRANCH_CODE: '07', // Çırak, Stajyer ve Kursiyer
  SGK_BRANCH_NAME: '07 - Çırak / Stajyer / Kursiyer',
  GSS_EXEMPT: '1 - Bakmakla Yükümlü (Sağlık primi hariç, %1 İK/MH)',
  GSS_INCLUDED: '2 - Bakmakla Yükümlü Değil (Üniversitece GSS Dahil, %6 Prim)',
  INSTITUTION_NAME: 'İstanbul Esenyurt Üniversitesi (İESÜ)',
  COORDINATOR_UNIT: 'Kariyer Geliştirme Koordinatörlüğü',
  PERSONNEL_DEPT: 'Personel Dairesi Başkanlığı - SGK Masası',
};

export const MIN_INTERNSHIP_WORK_DAYS = 20;
export const MAX_INTERNSHIP_WORK_DAYS = 60;

export const INTERNSHIP_STATUS = {
  DRAFT: 'Taslak',
  COMMISSION_PENDING: 'Komisyon Onayı Bekliyor',
  REVISION_REQUESTED: 'Revizyon İstendi',
  COMMISSION_APPROVED: 'Komisyon Onayladı',
  COMMISSION_REJECTED: 'Komisyon Reddetti',
  SGK_REGISTERED: 'SGK Girişi Yapıldı',
  IN_PROGRESS: 'Staj Devam Ediyor',
  NOTEBOOK_SUBMITTED: 'Staj Defteri Teslim Edildi',
  EMPLOYER_EVALUATED: 'İşyeri Değerlendirdi',
  GRADED_PASSED: 'Başarılı (S / Geçti)',
  GRADED_FAILED: 'Başarısız (U / Kaldı)',
};

/**
 * Resmi Türkiye Cumhuriyeti Kimlik Numarası Doğrulama Algoritması
 * - 11 basamaktan oluşmalıdır.
 * - İlk basamak 0 olamaz.
 * - 1, 3, 5, 7 ve 9. basamakların toplamının 7 katından, 2, 4, 6 ve 8. basamakların toplamı çıkarıldığında mod 10 = 10. basamak.
 * - İlk 10 basamağın toplamının mod 10'u = 11. basamak.
 */
export function validateTCKN(tc) {
  if (typeof tc !== 'string' && typeof tc !== 'number') return false;
  const str = String(tc).trim();
  if (!/^\d{11}$/.test(str)) return false;
  if (str[0] === '0') return false;

  const digits = str.split('').map(Number);
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];

  const digit10 = (oddSum * 7 - evenSum) % 10;
  const normalizedDigit10 = digit10 < 0 ? digit10 + 10 : digit10;
  if (normalizedDigit10 !== digits[9]) return false;

  const first10Sum = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  if (first10Sum % 10 !== digits[10]) return false;

  return true;
}

/**
 * SGK İşyeri Sicil Numarası Format Kontrolü (Minimum 18 - 26 karakter)
 */
export function validateSGKSicil(sicilNo) {
  if (!sicilNo || typeof sicilNo !== 'string') return false;
  const clean = sicilNo.replace(/[^0-9a-zA-Z]/g, '');
  return clean.length >= 10 && clean.length <= 32;
}

/**
 * Vergi Kimlik Numarası (VKN 10 hane) veya Şahıs Firması TCKN (11 hane) Kontrolü
 */
export function validateVKN(vkn) {
  if (!vkn) return false;
  const clean = String(vkn).trim();
  if (/^\d{10}$/.test(clean)) return true;
  if (/^\d{11}$/.test(clean)) return validateTCKN(clean);
  return false;
}

/**
 * Türkiye resmî tatilleri (Örnek referans sabitleri)
 */
export const OFFICIAL_HOLIDAYS_FIXED = [
  '01-01', // Yılbaşı
  '04-23', // Ulusal Egemenlik ve Çocuk Bayramı
  '05-01', // Emek ve Dayanışma Günü
  '05-19', // Atatürk'ü Anma, Gençlik ve Spor Bayramı
  '07-15', // Demokrasi ve Milli Birlik Günü
  '08-30', // Zafer Bayramı
  '10-29', // Cumhuriyet Bayramı
];

/**
 * Güvenli ve Saat Diliminden (Timezone) Etkilenmeyen Takvim Tarihi Ayrıştırıcısı.
 * YYYY-MM-DD veya Date nesnesini yerel saat diliminde öğlen saatine (12:00:00) sabitler.
 * Bu sayede UTC/GMT gerisi saat dilimlerinde bir gün geriye kayma (shift) önlenir.
 */
export function parseDateSafe(dateInput) {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime())
      ? null
      : new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate(), 12, 0, 0);
  }
  const str = String(dateInput).trim();
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const y = parseInt(m[1], 10);
    const mon = parseInt(m[2], 10) - 1;
    const d = parseInt(m[3], 10);
    const dt = new Date(y, mon, d, 12, 0, 0);
    // Takvim geçerlilik kontrolü (ör. 30 Şubat geçersizdir)
    if (isNaN(dt.getTime()) || dt.getMonth() !== mon || dt.getDate() !== d) return null;
    return dt;
  }
  const fallback = new Date(str);
  if (isNaN(fallback.getTime())) return null;
  return new Date(fallback.getFullYear(), fallback.getMonth(), fallback.getDate(), 12, 0, 0);
}

/**
 * Verilen tarihin resmî tatil olup olmadığını kontrol eder.
 */
export function isNationalHoliday(dateInput) {
  const dt = parseDateSafe(dateInput);
  if (!dt) return false;
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return OFFICIAL_HOLIDAYS_FIXED.includes(`${mm}-${dd}`);
}

/**
 * Verilen tarihin fiilî iş günü olup olmadığını kontrol eder (Pazar hariç, opsiyonel Cumartesi).
 */
export function isWorkDay(dateInput, includeSaturdays = false) {
  const dt = parseDateSafe(dateInput);
  if (!dt) return false;
  const dayOfWeek = dt.getDay(); // 0: Sunday, 6: Saturday
  if (dayOfWeek === 0) return false;
  if (!includeSaturdays && dayOfWeek === 6) return false;
  return !isNationalHoliday(dt);
}

/**
 * İki tarih arasındaki fiilî iş günü sayısını hesaplar (Pazar hariç, opsiyonel Cumartesi)
 */
export function calculateWorkDays(startDateIso, endDateIso, includeSaturdays = false) {
  const start = parseDateSafe(startDateIso);
  const end = parseDateSafe(endDateIso);
  if (!start || !end || end < start) return 0;

  let workDays = 0;
  const cur = new Date(start.getTime());

  while (cur <= end) {
    if (isWorkDay(cur, includeSaturdays)) {
      workDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return workDays;
}

/**
 * Form-1 (Staj Kabul ve SGK Taahhüt Formu) Yasal & Mantıksal Doğrulayıcısı
 */
export function validateForm1Submission(formData) {
  const errors = [];
  if (!formData || typeof formData !== 'object') {
    return { isValid: false, errors: ['Form verisi eksik veya geçersiz.'] };
  }

  // 1. Öğrenci Bilgileri
  if (!formData.studentName || formData.studentName.trim().length < 3) {
    errors.push('Öğrenci adı ve soyadı en az 3 karakter olmalıdır.');
  }
  if (!formData.studentNo || !/^\d{6,15}$/.test(String(formData.studentNo).trim())) {
    errors.push('Geçerli bir öğrenci numarası girilmelidir (en az 6 haneli).');
  }
  if (!validateTCKN(formData.tcNo)) {
    errors.push('Geçersiz T.C. Kimlik Numarası. Lütfen 11 haneli resmî kimlik numaranızı kontrol ediniz.');
  }
  if (!formData.department || formData.department.trim().length < 2) {
    errors.push('Öğrencinin kayıtlı olduğu fakülte / bölüm bilgisi girilmelidir.');
  }
  if (!formData.phone || !/^[0-9+\s()-]{10,20}$/.test(formData.phone)) {
    errors.push('Geçerli bir iletişim telefon numarası girilmelidir.');
  }
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push('Geçerli bir e-posta adresi girilmelidir.');
  }

  // 2. İşyeri Bilgileri
  if (!formData.companyName || formData.companyName.trim().length < 2) {
    errors.push('Staj yapılacak kurum / işletme ünvanı girilmelidir.');
  }
  if (!validateSGKSicil(formData.sgkSicilNo)) {
    errors.push('Geçersiz SGK İşyeri Sicil Numarası. Kurum muhasebesinden resmî sicil no teyit edilmelidir.');
  }
  if (!validateVKN(formData.taxNo)) {
    errors.push('Geçersiz Vergi Kimlik No (VKN 10 hane veya Şahıs TCKN 11 hane olmalıdır).');
  }
  if (!formData.companyAddress || formData.companyAddress.trim().length < 5) {
    errors.push('İşletme açık adresi girilmelidir.');
  }
  if (!formData.companyAuthorizedPerson || formData.companyAuthorizedPerson.trim().length < 3) {
    errors.push('Kurum staj yetkilisinin adı ve soyadı girilmelidir.');
  }
  if (!formData.companyAuthorizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyAuthorizedEmail)) {
    errors.push('Kurum yetkilisi kurumsal e-posta adresi girilmelidir.');
  }

  // 3. Staj Tarihleri & İş Günü Hesabı
  if (!formData.startDate || !formData.endDate) {
    errors.push('Staj başlangıç ve bitiş tarihleri seçilmelidir.');
  } else {
    const start = parseDateSafe(formData.startDate);
    const end = parseDateSafe(formData.endDate);
    if (!start || !end) {
      errors.push('Geçersiz staj başlangıç veya bitiş tarihi. Lütfen geçerli bir takvim tarihi giriniz.');
    } else if (end <= start) {
      errors.push('Staj bitiş tarihi, başlangıç tarihinden sonra olmalıdır.');
    } else {
      const calcDays = calculateWorkDays(formData.startDate, formData.endDate, Boolean(formData.includeSaturdays));
      if (calcDays < MIN_INTERNSHIP_WORK_DAYS) {
        errors.push(`Staj süresi yasal asgari süreden (${MIN_INTERNSHIP_WORK_DAYS} iş günü) az olamaz. Mevcut iş günü: ${calcDays}`);
      } else if (calcDays > MAX_INTERNSHIP_WORK_DAYS) {
        errors.push(`Tek seferde yapılacak staj süresi ${MAX_INTERNSHIP_WORK_DAYS} iş gününü aşamaz. Mevcut iş günü: ${calcDays}`);
      }

      // Eğer formda beyan edilen iş günü varsa, takvimdeki fiilî iş gününü aşamaz
      if (formData.workDays !== undefined && formData.workDays !== null && formData.workDays !== '') {
        const declaredDays = Number(formData.workDays);
        if (isNaN(declaredDays) || declaredDays < MIN_INTERNSHIP_WORK_DAYS) {
          errors.push(`Staj süresi yasal asgari süreden (${MIN_INTERNSHIP_WORK_DAYS} iş günü) az olamaz.`);
        } else if (declaredDays > calcDays) {
          errors.push(`Beyan edilen staj süresi (${declaredDays} iş günü), seçilen takvim aralığındaki fiilî iş gününden (${calcDays} gün) fazla olamaz.`);
        }
      }
    }
  }

  // 4. 5510 Sayılı Kanun SGK Beyanı & Taahhütname
  if (typeof formData.hasFamilyGss !== 'boolean') {
    errors.push('SGK Beyanı: Anne/babanız üzerinden Genel Sağlık Sigortası (GSS) durumunuzu (Evet/Hayır) işaretleyiniz.');
  }
  if (typeof formData.isEmployedElsewhere !== 'boolean') {
    errors.push('SGK Beyanı: Bir başka işyerinde sigortalı çalışma durumunuzu işaretleyiniz.');
  }
  if (!formData.sgkCommitmentApproved) {
    errors.push('5510 ve 3308 Sayılı Kanunlar uyarınca Resmî SGK Taahhütnamesi onaylanmalıdır.');
  }

  // 5. İşveren Onayı ve 3308 Ücret & İşsizlik Fonu Katkısı
  if (formData.isPaid) {
    const wage = Number(formData.monthlyWage);
    if (isNaN(wage) || wage <= 0) {
      errors.push('3308 Sayılı Kanun kapsamında stajyer ücreti ödenecekse geçerli ve pozitif bir aylık net ücret girilmelidir.');
    }
  }
  if (!formData.employerApproved) {
    errors.push('İşveren staj kabul ve taahhüt onayı verilmelidir.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Staj Statü Geçiş Motoru (State Transition Engine)
 */
export function advanceInternshipStatus(internship, action, payload = {}) {
  if (!internship) throw new Error('Staj nesnesi eksik.');
  const now = new Date().toISOString();
  const currentStatus = internship.status || INTERNSHIP_STATUS.DRAFT;

  switch (action) {
    case 'SUBMIT_FORM_1': {
      const validation = validateForm1Submission({ ...internship, ...payload });
      if (!validation.isValid) {
        throw new Error(`Form-1 doğrulaması başarısız: ${validation.errors.join('; ')}`);
      }
      return {
        ...internship,
        ...payload,
        status: INTERNSHIP_STATUS.COMMISSION_PENDING,
        advisorStatus: 'pending',
        companyStatus: 'approved',
        submittedAt: now,
        updatedAt: now,
        history: [
          ...(internship.history || []),
          { action: 'SUBMIT_FORM_1', from: currentStatus, to: INTERNSHIP_STATUS.COMMISSION_PENDING, date: now, note: 'Form-1 komisyon onayına iletildi.' }
        ]
      };
    }

    case 'COMMISSION_APPROVE': {
      if (currentStatus !== INTERNSHIP_STATUS.COMMISSION_PENDING && currentStatus !== INTERNSHIP_STATUS.REVISION_REQUESTED) {
        throw new Error(`Bu aşamada komisyon onayı verilemez. Mevcut durum: ${currentStatus}`);
      }
      return {
        ...internship,
        status: INTERNSHIP_STATUS.COMMISSION_APPROVED,
        advisorStatus: 'approved',
        reviewerId: payload.reviewerId || 'KOMISYON_BASKANI',
        reviewerName: payload.reviewerName || 'Bölüm Staj Komisyonu',
        reviewedAt: now,
        commissionDecisionNo: payload.decisionNo || `KMS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        commissionNote: payload.note || 'Staj yeri ve tarihleri komisyon tarafından uygun bulunarak onaylanmıştır.',
        updatedAt: now,
        history: [
          ...(internship.history || []),
          { action: 'COMMISSION_APPROVE', from: currentStatus, to: INTERNSHIP_STATUS.COMMISSION_APPROVED, date: now, reviewer: payload.reviewerName, note: payload.note }
        ]
      };
    }

    case 'COMMISSION_REQUEST_REVISION': {
      if (!payload.revisionNote || payload.revisionNote.trim().length < 5) {
        throw new Error('Revizyon gerekçesi en az 5 karakter olmalıdır.');
      }
      return {
        ...internship,
        status: INTERNSHIP_STATUS.REVISION_REQUESTED,
        advisorStatus: 'pending',
        revisionNote: payload.revisionNote,
        reviewerId: payload.reviewerId || 'KOMISYON',
        reviewerName: payload.reviewerName || 'Bölüm Staj Komisyonu',
        reviewedAt: now,
        updatedAt: now,
        history: [
          ...(internship.history || []),
          { action: 'COMMISSION_REQUEST_REVISION', from: currentStatus, to: INTERNSHIP_STATUS.REVISION_REQUESTED, date: now, note: payload.revisionNote }
        ]
      };
    }

    case 'COMMISSION_REJECT': {
      if (!payload.rejectionNote || payload.rejectionNote.trim().length < 5) {
        throw new Error('Ret gerekçesi en az 5 karakter olmalıdır.');
      }
      return {
        ...internship,
        status: INTERNSHIP_STATUS.COMMISSION_REJECTED,
        advisorStatus: 'rejected',
        rejectionReason: payload.rejectionNote,
        reviewerId: payload.reviewerId || 'KOMISYON',
        reviewerName: payload.reviewerName || 'Bölüm Staj Komisyonu',
        reviewedAt: now,
        updatedAt: now,
        history: [
          ...(internship.history || []),
          { action: 'COMMISSION_REJECT', from: currentStatus, to: INTERNSHIP_STATUS.COMMISSION_REJECTED, date: now, note: payload.rejectionNote }
        ]
      };
    }

    case 'SGK_REGISTER_ENTRY': {
      if (currentStatus !== INTERNSHIP_STATUS.COMMISSION_APPROVED && currentStatus !== INTERNSHIP_STATUS.SGK_REGISTERED) {
        throw new Error(`SGK işe giriş kaydı yalnızca komisyonca onaylanmış stajlar için yapılabilir. Mevcut: ${currentStatus}`);
      }
      const barcode = payload.sgkBarcode || `IESU-SGK-5510-${Date.now().toString().slice(-8)}`;
      return {
        ...internship,
        status: INTERNSHIP_STATUS.SGK_REGISTERED,
        sgkStatus: 'Aktif',
        sgkBarcode: barcode,
        sgkRegistrationDate: now,
        sgkRegisteredBy: payload.officerName || 'Personel Dairesi Başkanlığı (SGK Masası)',
        sgkBranchCode: LAW_REFERENCES.SGK_BRANCH_CODE,
        gssStatus: internship.hasFamilyGss ? LAW_REFERENCES.GSS_EXEMPT : LAW_REFERENCES.GSS_INCLUDED,
        updatedAt: now,
        history: [
          ...(internship.history || []),
          { action: 'SGK_REGISTER_ENTRY', from: currentStatus, to: INTERNSHIP_STATUS.SGK_REGISTERED, date: now, barcode, note: '5510/5-b Sigortalı İşe Giriş Bildirgesi tescil edildi.' }
        ]
      };
    }

    case 'START_INTERNSHIP': {
      if (currentStatus !== INTERNSHIP_STATUS.SGK_REGISTERED && currentStatus !== INTERNSHIP_STATUS.IN_PROGRESS) {
        throw new Error(`SGK işe giriş bildirgesi tescil edilmeden staja başlanamaz. Mevcut durum: ${currentStatus}`);
      }
      return {
        ...internship,
        status: INTERNSHIP_STATUS.IN_PROGRESS,
        updatedAt: now,
        history: [
          ...(internship.history || []),
          { action: 'START_INTERNSHIP', from: currentStatus, to: INTERNSHIP_STATUS.IN_PROGRESS, date: now }
        ]
      };
    }

    case 'SUBMIT_NOTEBOOK': {
      if (
        currentStatus !== INTERNSHIP_STATUS.IN_PROGRESS && 
        currentStatus !== INTERNSHIP_STATUS.SGK_REGISTERED && 
        currentStatus !== INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED &&
        currentStatus !== INTERNSHIP_STATUS.EMPLOYER_EVALUATED
      ) {
        throw new Error(`Staj defteri yalnızca staj devam ederken veya tamamlandıktan sonra teslim edilebilir. Mevcut durum: ${currentStatus}`);
      }
      const entries = payload.entries || internship.notebookEntries || [];
      if (!entries.length) {
        throw new Error('Staj defteri teslimi için en az 1 günlük staj kaydı bulunmalıdır.');
      }
      return {
        ...internship,
        status: INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED,
        notebookEntries: entries,
        notebookSubmittedAt: now,
        updatedAt: now,
        history: [
          ...(internship.history || []),
          { action: 'SUBMIT_NOTEBOOK', from: currentStatus, to: INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED, date: now, note: `${entries.length} günlük staj defteri teslim edildi.` }
        ]
      };
    }

    case 'EMPLOYER_EVALUATE': {
      if (
        currentStatus !== INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED && 
        currentStatus !== INTERNSHIP_STATUS.IN_PROGRESS && 
        currentStatus !== INTERNSHIP_STATUS.EMPLOYER_EVALUATED
      ) {
        throw new Error(`İşyeri değerlendirmesi için stajın başlamış veya defterin sunulmuş olması gerekmektedir. Mevcut durum: ${currentStatus}`);
      }
      const score = Number(payload.score);
      if (isNaN(score) || score < 0 || score > 100) {
        throw new Error('İşveren stajyer değerlendirme notu 0 ile 100 arasında olmalıdır.');
      }
      return {
        ...internship,
        status: INTERNSHIP_STATUS.EMPLOYER_EVALUATED,
        companyStatus: 'completed',
        employerScore: score,
        employerFeedback: payload.feedback || '',
        employerEvaluator: payload.evaluatorName || internship.companyAuthorizedPerson,
        employerEvaluatedAt: now,
        updatedAt: now,
        history: [
          ...(internship.history || []),
          { action: 'EMPLOYER_EVALUATE', from: currentStatus, to: INTERNSHIP_STATUS.EMPLOYER_EVALUATED, date: now, score, note: 'İşyeri değerlendirme formu dolduruldu.' }
        ]
      };
    }

    case 'COMMISSION_FINAL_GRADE': {
      if (
        currentStatus === INTERNSHIP_STATUS.DRAFT ||
        currentStatus === INTERNSHIP_STATUS.COMMISSION_REJECTED ||
        currentStatus === INTERNSHIP_STATUS.REVISION_REQUESTED
      ) {
        throw new Error(`Bu aşamada final notlandırması yapılamaz. Mevcut durum: ${currentStatus}`);
      }
      const commissionScore = Number(payload.commissionScore);
      if (isNaN(commissionScore) || commissionScore < 0 || commissionScore > 100) {
        throw new Error('Komisyon mülakat / defter inceleme notu 0-100 arasında olmalıdır.');
      }

      const employerScore = Number(internship.employerScore || payload.employerScore || 100);
      // Komisyon %60, İşyeri %40 ağırlıklı notlandırma
      const weightedScore = Math.round(employerScore * 0.4 + commissionScore * 0.6);
      const isPassed = payload.isPassed !== undefined ? Boolean(payload.isPassed) : weightedScore >= 60;
      const finalStatus = isPassed ? INTERNSHIP_STATUS.GRADED_PASSED : INTERNSHIP_STATUS.GRADED_FAILED;

      return {
        ...internship,
        status: finalStatus,
        commissionScore,
        employerScore,
        weightedScore,
        finalGrade: isPassed ? 'S' : 'U', // S: Başarılı / Satisfactory, U: Başarısız / Unsatisfactory
        commissionDecisionTutanakNo: payload.tutanakNo || `TUT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        gradedBy: payload.graderName || 'Staj Değerlendirme Komisyonu',
        gradedAt: now,
        obsExportReady: true,
        updatedAt: now,
        history: [
          ...(internship.history || []),
          { action: 'COMMISSION_FINAL_GRADE', from: currentStatus, to: finalStatus, date: now, score: weightedScore, finalGrade: isPassed ? 'S' : 'U', note: payload.note || 'Final notu onaylandı.' }
        ]
      };
    }

    default:
      throw new Error(`Bilinmeyen iş akışı aksiyonu: ${action}`);
  }
}

/**
 * Personel Dairesi Başkanlığı Toplu SGK Bildirge Tablosu Verisi Hazırlayıcı
 */
export function generateSGKBulkExportData(internships = []) {
  return (internships || [])
    .filter((item) => item && (
      item.status === INTERNSHIP_STATUS.COMMISSION_APPROVED ||
      item.status === INTERNSHIP_STATUS.SGK_REGISTERED ||
      item.status === INTERNSHIP_STATUS.IN_PROGRESS ||
      item.status === INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED ||
      item.status === INTERNSHIP_STATUS.EMPLOYER_EVALUATED ||
      item.status === INTERNSHIP_STATUS.GRADED_PASSED ||
      (item.status === INTERNSHIP_STATUS.GRADED_FAILED && item.sgkBarcode)
    ))
    .map((item, idx) => {
      // Resmi MERNIS formatı: Son kelime soyadı, önceki kelimeler ad(lar)
      const parts = (item.studentName || '').trim().split(/\s+/).filter(Boolean);
      const soyad = parts.length > 1 ? parts.pop() : '';
      const ad = parts.join(' ');
      const workDays = item.workDays || calculateWorkDays(item.startDate, item.endDate, Boolean(item.includeSaturdays)) || 20;

      return {
        siraNo: idx + 1,
        id: item.id || `INT-${idx + 1}`,
        tcKimlikNo: item.tcNo || '',
        ad: ad.trim(),
        soyad: soyad.trim(),
        ogrenciNo: item.studentNo || '',
        fakulte: item.faculty || 'Mühendislik ve Doğa Bilimleri Fakültesi',
        bolum: item.department || '',
        sigortaKoluKodu: LAW_REFERENCES.SGK_BRANCH_CODE,
        sigortaKoluAdi: LAW_REFERENCES.SGK_BRANCH_NAME,
        kanunKapsami: LAW_REFERENCES.LAW_5510_5B,
        saglikHizmetiKapsami: item.hasFamilyGss ? LAW_REFERENCES.GSS_EXEMPT : LAW_REFERENCES.GSS_INCLUDED,
        stajBaslangicTarihi: item.startDate || '',
        stajBitisTarihi: item.endDate || '',
        toplamIsGunu: workDays,
        haftalikCalismaGunu: item.includeSaturdays ? 6 : 5,
        isletmeAdi: item.companyName || item.company || '',
        isletmeSgkSicilNo: item.sgkSicilNo || '',
        isletmeVergiNo: item.taxNo || '',
        ucretDurumu: item.isPaid ? `Ücretli (${item.monthlyWage || 0} ₺)` : 'Ücretsiz',
        issizlikFonuKatkisi: item.hasUnemploymentFundSupport ? 'Talep Edildi' : 'Talep Edilmedi',
        sgkTescilDurumu: item.sgkBarcode ? 'Tescil Edildi' : 'Onay Bekliyor',
        sgkBarkodNo: item.sgkBarcode || 'SGK-BEKLEMEDE',
      };
    });
}

/**
 * SGK Bildirgelerini UTF-8 BOM destekli CSV olarak ihraç eder (Excel ve SGK e-Sigorta uyumlu)
 */
export function exportSGKToCSV(internships = []) {
  const rows = generateSGKBulkExportData(internships);
  const headers = [
    'Sıra No',
    'T.C. Kimlik No',
    'Adı',
    'Soyadı',
    'Öğrenci No',
    'Bölüm / Program',
    'Sigorta Kolu Kodu',
    'Sağlık Yardımı (GSS) Durumu',
    'Staj Başlangıç (İşe Giriş)',
    'Staj Bitiş',
    'Toplam İş Günü',
    'Haftalık Gün',
    'Staj Yeri / Kurum',
    'SGK İşyeri Sicil No',
    'Vergi Kimlik No',
    '3308 Ücret Durumu',
    'SGK Barkod Referans No'
  ];

  const escapeCell = (val) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvRows = [
    headers.map(escapeCell).join(';'),
    ...rows.map((r) => [
      r.siraNo,
      r.tcKimlikNo,
      r.ad,
      r.soyad,
      r.ogrenciNo,
      r.bolum,
      r.sigortaKoluKodu,
      r.saglikHizmetiKapsami,
      r.stajBaslangicTarihi,
      r.stajBitisTarihi,
      r.toplamIsGunu,
      r.haftalikCalismaGunu,
      r.isletmeAdi,
      r.isletmeSgkSicilNo,
      r.isletmeVergiNo,
      r.ucretDurumu,
      r.sgkBarkodNo
    ].map(escapeCell).join(';'))
  ];

  // UTF-8 BOM eklenerek Excel'de Türkçe karakter bozulması engellenir
  return '\uFEFF' + csvRows.join('\r\n');
}

/**
 * SGK Web Servis uyumlu JSON çıktısı
 */
export function exportSGKToJSON(internships = []) {
  const data = generateSGKBulkExportData(internships);
  return JSON.stringify({
    kurum: LAW_REFERENCES.INSTITUTION_NAME,
    birim: LAW_REFERENCES.PERSONNEL_DEPT,
    olusturmaTarihi: new Date().toISOString(),
    toplamBildirge: data.length,
    kayitlar: data
  }, null, 2);
}

/**
 * Günlük Staj Defteri Kayıt Yasal ve Mantıksal Doğrulayıcısı
 */
export function validateLogbookEntry(entry, internship = {}, existingEntries = []) {
  const errors = [];
  if (!entry || typeof entry !== 'object') {
    return { isValid: false, errors: ['Günlük staj kaydı verisi eksik.'] };
  }

  const dayNum = Number(entry.day);
  if (isNaN(dayNum) || dayNum < 1) {
    errors.push('Geçerli bir staj günü numarası (1, 2, ...) belirtilmelidir.');
  }

  if (!entry.activity || entry.activity.trim().length < 20) {
    errors.push('Yapılan iş ve kazanımlar en az 20 karakter olacak şekilde açıklanmalıdır.');
  }

  if (!entry.date) {
    errors.push('Staj çalışma tarihi seçilmelidir.');
  } else {
    const dt = parseDateSafe(entry.date);
    if (!dt) {
      errors.push('Geçersiz staj çalışma tarihi.');
    } else {
      // Staj başlangıç ve bitiş sınırları
      if (internship?.startDate && internship?.endDate) {
        const start = parseDateSafe(internship.startDate);
        const end = parseDateSafe(internship.endDate);
        if (start && end && (dt < start || dt > end)) {
          errors.push(`Staj defteri tarihi (${entry.date}), staj başlangıç (${internship.startDate}) ve bitiş (${internship.endDate}) tarihleri arasında olmalıdır.`);
        }
      }

      // Pazar günü ve cumartesi kontrolü
      if (dt.getDay() === 0) {
        errors.push('Pazar günleri yasal olarak staj faaliyeti gerçekleştirilemez.');
      } else if (dt.getDay() === 6 && !internship?.includeSaturdays) {
        errors.push('Cumartesi günleri staj onayı bulunmayan işletmelerde Cumartesi çalışması yapılamaz.');
      }

      // Resmî tatil kontrolü
      if (isNationalHoliday(dt)) {
        errors.push(`Resmî tatil günlerinde (${entry.date}) staj defteri kaydı girilemez.`);
      }
    }
  }

  // Mükerrer gün kontrolü
  const isDuplicateDay = (existingEntries || []).some(e => e && e !== entry && Number(e.day) === dayNum);
  if (isDuplicateDay) {
    errors.push(`${dayNum}. Gün için zaten bir staj kaydı bulunmaktadır.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Dijital Staj Defteri İlerleme & İstatistik Hesaplayıcı
 */
export function calculateLogbookProgress(entries = [], targetDays = 20) {
  const safeEntries = Array.isArray(entries) ? entries : [];
  
  // Mükerrer günleri tek sayarak gerçek ilerlemeyi hesapla
  const uniqueValidDays = new Set();
  safeEntries.forEach(e => {
    if (e && e.day !== undefined && e.day !== null && e.activity && e.activity.trim().length >= 20) {
      uniqueValidDays.add(Number(e.day));
    }
  });

  const completedDays = uniqueValidDays.size;
  const percentage = Math.min(100, Math.round((completedDays / (targetDays || 20)) * 100));

  const skillSet = new Set();
  safeEntries.forEach(e => {
    if (Array.isArray(e.skills)) {
      e.skills.forEach(s => skillSet.add(s));
    }
  });

  return {
    completedDays,
    targetDays,
    percentage,
    isComplete: completedDays >= targetDays,
    skillsLearned: Array.from(skillSet),
    totalWords: safeEntries.reduce((acc, e) => acc + (e?.activity || '').split(/\s+/).filter(Boolean).length, 0),
  };
}

/**
 * Örnek başlangıç staj verileri (Testler ve gerçekçi arayüz akışı için)
 */
export const SAMPLE_ENTERPRISE_INTERNSHIPS = [
  {
    id: 'INT-2026-001',
    studentId: 'STD-001',
    studentName: 'Ayşe Kaya',
    studentNo: '20220101001',
    tcNo: '10000000146',
    faculty: 'Mühendislik ve Doğa Bilimleri Fakültesi',
    department: 'Bilgisayar Mühendisliği',
    phone: '0555 111 2233',
    email: 'ayse.kaya@ogr.esenyurt.edu.tr',
    companyName: 'Aselsan A.Ş.',
    companyAddress: 'ODTÜ Teknokent Titanyum Blok No:12 Çankaya/Ankara',
    sgkSicilNo: '2.4510.01.01.1234567.034.01-44',
    taxNo: '1234567890',
    companyAuthorizedPerson: 'Ahmet Yılmaz',
    companyAuthorizedTitle: 'Yazılım Grup Lideri',
    companyAuthorizedEmail: 'ahmet.yilmaz@aselsan.com.tr',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    workDays: 22,
    includeSaturdays: false,
    hasFamilyGss: true,
    isEmployedElsewhere: false,
    receivesPension: false,
    sgkCommitmentApproved: true,
    employerApproved: true,
    isPaid: true,
    monthlyWage: 17500,
    hasUnemploymentFundSupport: true,
    status: INTERNSHIP_STATUS.COMMISSION_PENDING,
    advisorStatus: 'pending',
    companyStatus: 'approved',
    createdAt: '2026-05-10T10:00:00.000Z',
    updatedAt: '2026-05-10T10:00:00.000Z',
  },
  {
    id: 'INT-2026-002',
    studentId: 'STD-002',
    studentName: 'Mehmet Demir',
    studentNo: '20220101002',
    tcNo: '10000000146',
    faculty: 'Mühendislik ve Doğa Bilimleri Fakültesi',
    department: 'Endüstri Mühendisliği',
    phone: '0555 222 3344',
    email: 'mehmet.demir@ogr.esenyurt.edu.tr',
    companyName: 'Baykar Teknoloji',
    companyAddress: 'Hadımköy Sanayi Bölgesi Esenyurt/İstanbul',
    sgkSicilNo: '2.4520.02.02.9876543.034.02-88',
    taxNo: '9876543210',
    companyAuthorizedPerson: 'Selin Yıldız',
    companyAuthorizedTitle: 'İnsan Kaynakları Müdürü',
    companyAuthorizedEmail: 'ik@baykar.com',
    startDate: '2026-07-15',
    endDate: '2026-08-15',
    workDays: 24,
    includeSaturdays: false,
    hasFamilyGss: false, // Üniversite GSS primini ödeyecek
    isEmployedElsewhere: false,
    receivesPension: false,
    sgkCommitmentApproved: true,
    employerApproved: true,
    isPaid: true,
    monthlyWage: 21000,
    hasUnemploymentFundSupport: true,
    status: INTERNSHIP_STATUS.COMMISSION_APPROVED,
    advisorStatus: 'approved',
    companyStatus: 'approved',
    commissionDecisionNo: 'KMS-2026-4421',
    reviewerName: 'Dr. Öğr. Üyesi Mehmet Can',
    reviewedAt: '2026-05-15T14:30:00.000Z',
    createdAt: '2026-05-11T09:00:00.000Z',
    updatedAt: '2026-05-15T14:30:00.000Z',
  },
  {
    id: 'INT-2026-003',
    studentId: 'STD-003',
    studentName: 'Elif Şahin',
    studentNo: '20220101003',
    tcNo: '10000000146',
    faculty: 'İşletme ve Yönetim Bilimleri Fakültesi',
    department: 'İşletme',
    phone: '0555 333 4455',
    email: 'elif.sahin@ogr.esenyurt.edu.tr',
    companyName: 'Türkiye İş Bankası A.Ş.',
    companyAddress: 'İş Kuleleri Levent Beşiktaş/İstanbul',
    sgkSicilNo: '2.4530.03.03.3456789.034.03-99',
    taxNo: '4567890123',
    companyAuthorizedPerson: 'Murat Koç',
    companyAuthorizedTitle: 'Şube Operasyon Yöneticisi',
    companyAuthorizedEmail: 'murat.koc@isbank.com.tr',
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    workDays: 22,
    includeSaturdays: false,
    hasFamilyGss: true,
    isEmployedElsewhere: false,
    receivesPension: false,
    sgkCommitmentApproved: true,
    employerApproved: true,
    isPaid: true,
    monthlyWage: 18000,
    hasUnemploymentFundSupport: true,
    status: INTERNSHIP_STATUS.SGK_REGISTERED,
    advisorStatus: 'approved',
    companyStatus: 'approved',
    sgkBarcode: 'IESU-SGK-5510-98231456',
    sgkRegistrationDate: '2026-06-01T11:00:00.000Z',
    commissionDecisionNo: 'KMS-2026-1109',
    reviewerName: 'Doç. Dr. Ayşe Yılmaz',
    notebookEntries: [
      { day: 1, date: '2026-06-15', unit: 'Bireysel Bankacılık', activity: 'Müşteri hesap açılışları ve dijital kanallara entegrasyon süreçlerinin incelenmesi.', skills: ['Bankacılık', 'Müşteri İlişkileri'] },
      { day: 2, date: '2026-06-16', unit: 'Krediler Birimi', activity: 'Kredi tahsis ve istihbarat belgelerinin SGK ve KKB sorgulama mekanizmaları analizi.', skills: ['Risk Analizi', 'KKB'] }
    ],
    createdAt: '2026-05-01T10:00:00.000Z',
    updatedAt: '2026-06-01T11:00:00.000Z',
  }
];
