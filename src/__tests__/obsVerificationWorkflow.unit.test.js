import { describe, it, expect } from 'vitest';
import {
  OBS_STANDARDS,
  OBS_VERIFICATION_STATUS,
  OBS_VERIFICATION_STATUS_LABELS,
  OFFICIAL_OBS_DATABASE,
  generateObsVerificationCode,
  validateObsVerificationCode,
  generateKgbCode,
  validateKgbCode,
  maskTckn,
  maskPhone,
  maskEmail,
  verifyKvkkConsent,
  maskSensitiveData,
  verifyStudentObsRecord,
  isObsVerified,
  getObsVerificationBadge,
  generateQrCodeSvg,
  generateOfficialKgbDocument,
  exportKgbDocumentAsJson,
} from '../services/obsVerificationWorkflow';

describe('Adım 4: OBS & YÖKSİS Doğrulama Mimarisi ve KVKK Maskeleme Unit Test Suite', () => {

  /* -------------------------------------------------------------------------- */
  /* 1. Kurumsal Standartlar & Değişmezler (AGENTS.md & YÖK Uyumu)             */
  /* -------------------------------------------------------------------------- */
  describe('1. Kurumsal Standartlar & İsimlendirme Uyumu', () => {
    it('official institutional titles comply strictly with AGENTS.md', () => {
      expect(OBS_STANDARDS.INSTITUTION_NAME).toBe('İstanbul Esenyurt Üniversitesi (İESÜ)');
      expect(OBS_STANDARDS.COORDINATOR_UNIT).toBe('Kariyer Geliştirme Koordinatörlüğü');
      expect(OBS_STANDARDS.RECTORATE_TITLE).toBe('T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ');
      expect(OBS_STANDARDS.BADGE_LABEL).toBe('İESÜ OBS & YÖKSİS Doğrulanmış');
    });

    it('defines official verification statuses and labels', () => {
      expect(OBS_VERIFICATION_STATUS.VERIFIED).toBe('VERIFIED');
      expect(OBS_VERIFICATION_STATUS.REJECTED).toBe('REJECTED');
      expect(OBS_VERIFICATION_STATUS_LABELS.VERIFIED).toBe('İESÜ OBS & YÖKSİS Doğrulanmış');
    });

    it('contains official institutional OBS records with high fidelity', () => {
      expect(OFFICIAL_OBS_DATABASE.length).toBeGreaterThanOrEqual(4);
      const ahmet = OFFICIAL_OBS_DATABASE.find(s => s.studentNo === '2023010482');
      expect(ahmet).toBeDefined();
      expect(ahmet.fullName).toBe('Ahmet Yılmaz');
      expect(ahmet.gano).toBe(3.84);
      expect(ahmet.department).toBe('Bilgisayar Mühendisliği');
      expect(ahmet.completedEcts).toBe(180);
      expect(ahmet.semCertifications.length).toBeGreaterThan(0);
      expect(ahmet.clubs.length).toBeGreaterThan(0);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 2. Kriptografik Kod Üretimi & Doğrulama (IESU-OBS-VERIFIED-XXXXX)        */
  /* -------------------------------------------------------------------------- */
  describe('2. Kriptografik OBS ve KGB Doğrulama Kodları', () => {
    it('generates cryptographic OBS verification code matching IESU-OBS-VERIFIED-XXXXX', () => {
      const code = generateObsVerificationCode('2023010482', 3.84);
      expect(code).toMatch(/^IESU-OBS-VERIFIED-[A-Z0-9]{5,10}$/);
      expect(validateObsVerificationCode(code)).toBe(true);
    });

    it('rejects tampered or invalid verification codes', () => {
      expect(validateObsVerificationCode('FAKE-CODE-12345')).toBe(false);
      expect(validateObsVerificationCode('IESU-OBS-INVALID')).toBe(false);
      expect(validateObsVerificationCode('')).toBe(false);
      expect(validateObsVerificationCode(null)).toBe(false);
      expect(validateObsVerificationCode(undefined)).toBe(false);
    });

    it('generates and validates official KGB document registration numbers', () => {
      const kgbCode = generateKgbCode(2026, '2023010482');
      expect(kgbCode).toBe('IESU-KGB-2026-0482');
      expect(validateKgbCode(kgbCode)).toBe(true);
      expect(validateKgbCode('INVALID-KGB')).toBe(false);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 3. KVKK & CBDO Bilgi Güvenliği Rehberi Veri Maskeleme Motoru               */
  /* -------------------------------------------------------------------------- */
  describe('3. KVKK ve CBDO Hassas Veri Maskeleme Motoru', () => {
    it('masks 11-digit TCKN to 123*****789 format', () => {
      expect(maskTckn('12345678789')).toBe('123*****789');
      expect(maskTckn('10000000146')).toBe('100*****146');
      expect(maskTckn('')).toBe('');
      expect(maskTckn(null)).toBe('');
    });

    it('masks phone number to 0532 *** ** 12 format', () => {
      expect(maskPhone('05321234512')).toBe('0532 *** ** 12');
      expect(maskPhone('0532 123 45 12')).toBe('0532 *** ** 12');
      expect(maskPhone('+905321234512')).toBe('0532 *** ** 12');
      // Idempotency: already masked phone numbers are preserved
      expect(maskPhone('0532 *** ** 12')).toBe('0532 *** ** 12');
      expect(maskPhone('')).toBe('');
    });

    it('masks email addresses preserving domain and partial prefix', () => {
      expect(maskEmail('ahmet.yilmaz@ogr.esenyurt.edu.tr')).toBe('ahm***@ogr.esenyurt.edu.tr');
      expect(maskEmail('zeynep@esenyurt.edu.tr')).toBe('zey***@esenyurt.edu.tr');
      expect(maskEmail('ab@test.com')).toBe('a***@test.com');
      // Idempotency: already masked email addresses are preserved
      expect(maskEmail('ahm***@ogr.esenyurt.edu.tr')).toBe('ahm***@ogr.esenyurt.edu.tr');
      expect(maskEmail('')).toBe('');
    });

    it('verifies KVKK explicit consent payloads', () => {
      const validConsent = {
        accepted: true,
        scope: 'İşveren Başvuru İletişimi',
        timestamp: '2026-03-15T10:00:00.000Z',
        version: '2026.1'
      };
      const result = verifyKvkkConsent(validConsent);
      expect(result.isValid).toBe(true);
      expect(result.scope).toBe('İşveren Başvuru İletişimi');
      expect(result.policyReference).toContain('6698 Sayılı KVKK');

      const rejectedConsent = { accepted: false };
      expect(verifyKvkkConsent(rejectedConsent).isValid).toBe(false);
      expect(verifyKvkkConsent(null).isValid).toBe(false);
    });

    it('masks sensitive data for company and unauthorized third party viewers', () => {
      const user = {
        id: 'STU-01',
        name: 'Ahmet Yılmaz',
        tcNo: '10000000146',
        phone: '05321234512',
        email: 'ahmet.yilmaz@ogr.esenyurt.edu.tr',
        department: 'Bilgisayar Mühendisliği'
      };

      // Firma veya yetkisiz kullanıcı baktığında maskelenir
      const masked = maskSensitiveData(user, { viewerRole: 'company' });
      expect(masked.isMasked).toBe(true);
      expect(masked.tcNo).toBe('100*****146');
      expect(masked.phone).toBe('0532 *** ** 12');
      expect(masked.email).toBe('ahm***@ogr.esenyurt.edu.tr');
      expect(masked.department).toBe('Bilgisayar Mühendisliği'); // Açık alanlar korunur

      // Öğrencinin kendisi baktığında maskelenmez
      const selfView = maskSensitiveData(user, { viewerRole: 'student', viewerId: 'STU-01' });
      expect(selfView.isMasked).toBe(false);
      expect(selfView.tcNo).toBe('10000000146');
      expect(selfView.phone).toBe('05321234512');

      // Admin baktığında tam erişim sağlanır
      const adminView = maskSensitiveData(user, { viewerRole: 'admin' });
      expect(adminView.isMasked).toBe(false);
      expect(adminView.tcNo).toBe('10000000146');

      // Açık rıza varsa maskelenmez
      const consentView = maskSensitiveData(user, { viewerRole: 'company', explicitConsent: true });
      expect(consentView.isMasked).toBe(false);
      expect(consentView.phone).toBe('05321234512');
    });

    it('masks application-level candidate fields (applicantPhone, applicantEmail, tckn, contactEmail)', () => {
      const candidateApp = {
        id: 'APP-99',
        applicantName: 'Merve Demir',
        tckn: '20000000192',
        applicantPhone: '05441234567',
        applicantEmail: 'merve.demir@esenyurt.edu.tr',
        contactEmail: 'merve.iletisim@gmail.com'
      };

      const maskedApp = maskSensitiveData(candidateApp, { viewerRole: 'company' });
      expect(maskedApp.isMasked).toBe(true);
      expect(maskedApp.tckn).toBe('200*****192');
      expect(maskedApp.applicantPhone).toBe('0544 *** ** 67');
      expect(maskedApp.applicantEmail).toBe('mer***@esenyurt.edu.tr');
      expect(maskedApp.contactEmail).toBe('mer***@gmail.com');
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 4. OBS & YÖKSİS Doğrulama Motoru ve Sahte Beyan Denetimi                  */
  /* -------------------------------------------------------------------------- */
  describe('4. OBS Doğrulama ve Sahte GANO Beyanı Engelleme', () => {
    it('verifies student successfully from institutional OBS registry', () => {
      const result = verifyStudentObsRecord({ studentNo: '2023010482' });
      expect(result.verified).toBe(true);
      expect(result.status).toBe(OBS_VERIFICATION_STATUS.VERIFIED);
      expect(result.fullName).toBe('Ahmet Yılmaz');
      expect(result.department).toBe('Bilgisayar Mühendisliği');
      expect(result.grade).toBe('3. Sınıf');
      expect(result.gano).toBe(3.84);
      expect(result.completedEcts).toBe(180);
      expect(result.badge).toBe('İESÜ OBS & YÖKSİS Doğrulanmış');
      expect(result.verificationCode).toMatch(/^IESU-OBS-VERIFIED-[A-Z0-9]+$/);
    });

    it('detects and reconciles fraudulent / inflated GANO declaration to official OBS value', () => {
      // Öğrenci sistemde kendini 3.99 olarak beyan etmiş olsun
      const fraudulentDeclaration = {
        studentNo: '2023010482',
        declaredGano: 3.99,
        declaredDepartment: 'Bilgisayar Mühendisliği'
      };

      const result = verifyStudentObsRecord(fraudulentDeclaration);
      expect(result.verified).toBe(true);
      // GANO resmi OBS değeri olan 3.84'e çekilmeli, sahte beyan engellenmeli
      expect(result.gano).toBe(3.84);
      expect(result.discrepancy.detected).toBe(true);
      expect(result.discrepancy.declaredGano).toBe(3.99);
      expect(result.discrepancy.officialGano).toBe(3.84);
      expect(result.discrepancy.resolution).toContain('resmi OBS GANO değeri uygulandı');
    });

    it('rejects verification when no valid studentNo or tcNo is provided', () => {
      const result = verifyStudentObsRecord({});
      expect(result.verified).toBe(false);
      expect(result.status).toBe(OBS_VERIFICATION_STATUS.REJECTED);
      expect(result.error).toContain('Öğrenci Numarası');
    });

    it('correctly parses Turkish comma decimal GANO inputs without discrepancy', () => {
      const commaDeclaration = {
        studentNo: '2023010482',
        declaredGano: '3,84',
      };
      const result = verifyStudentObsRecord(commaDeclaration);
      expect(result.verified).toBe(true);
      expect(result.gano).toBe(3.84);
      expect(result.discrepancy.detected).toBe(false);
    });

    it('recognizes verified users via isObsVerified and returns badge info', () => {
      const verifiedUser = {
        obsVerified: true,
        verificationCode: 'IESU-OBS-VERIFIED-9941A',
        gano: 3.84
      };
      expect(isObsVerified(verifiedUser)).toBe(true);

      const unverifiedUser = { obsVerified: false };
      expect(isObsVerified(unverifiedUser)).toBe(false);

      const badge = getObsVerificationBadge(verifiedUser);
      expect(badge.isVerified).toBe(true);
      expect(badge.label).toBe('İESÜ OBS & YÖKSİS Doğrulanmış');
      expect(badge.code).toBe('IESU-OBS-VERIFIED-9941A');
      expect(badge.institution).toBe('İstanbul Esenyurt Üniversitesi (İESÜ)');
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 5. Resmî Kariyer Gelişim Belgesi (KGB) & Diploma Eki Motoru                */
  /* -------------------------------------------------------------------------- */
  describe('5. Resmî KGB & Diploma Eki Derleyici Motoru', () => {
    it('compiles official KGB document with 4 sections, QR code, seal and 3-tier signatures', () => {
      const studentInput = {
        studentNo: '2023010482',
        id: 'STU-01',
        name: 'Ahmet Yılmaz',
        department: 'Bilgisayar Mühendisliği',
        faculty: 'Mühendislik ve Mimarlık Fakültesi',
        grade: '3. Sınıf',
        advisorName: 'Doç. Dr. Selin Kaya'
      };

      const kgb = generateOfficialKgbDocument(studentInput);

      // Üst Başlık & Kurum
      expect(kgb.institutionName).toBe('İstanbul Esenyurt Üniversitesi (İESÜ)');
      expect(kgb.rectorateTitle).toBe('T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ');
      expect(kgb.coordinatorUnit).toBe('Kariyer Geliştirme Koordinatörlüğü');
      expect(kgb.documentId).toMatch(/^IESU-KGB-2026-\d{4}$/);

      // Öğrenci & OBS Doğrulanmış Verileri
      expect(kgb.student.studentNo).toBe('2023010482');
      expect(kgb.student.fullName).toBe('Ahmet Yılmaz');
      expect(kgb.student.gano).toBe(3.84);
      expect(kgb.student.obsVerificationCode).toMatch(/^IESU-OBS-VERIFIED-[A-Z0-9]+$/);
      expect(kgb.student.obsBadge).toBe('İESÜ OBS & YÖKSİS Doğrulanmış');

      // 4 Ana Bölüm
      // 1. Bölüm: Resmî ve Ar-Ge Stajları
      expect(kgb.sections.internships.items.length).toBeGreaterThan(0);
      const firstInternship = kgb.sections.internships.items[0];
      expect(firstInternship.company).toBeDefined();
      expect(firstInternship.status).toBe('Onaylandı');
      expect(firstInternship.ects).toBeDefined();

      // 2. Bölüm: Akredite SEM Sertifikaları
      expect(kgb.sections.certifications.items.length).toBeGreaterThan(0);
      expect(kgb.sections.certifications.items[0].title).toBeDefined();

      // 3. Bölüm: SKS Onaylı Kulüp Başkanlıkları
      expect(kgb.sections.clubs.items.length).toBeGreaterThan(0);
      expect(kgb.sections.clubs.items[0].role).toContain('Başkan');

      // 4. Bölüm: Mesleki Atölye ve Seminerler
      expect(kgb.sections.workshops.items.length).toBeGreaterThan(0);

      // Metrikler
      expect(kgb.metrics.totalInternshipDays).toBeGreaterThan(0);
      expect(kgb.metrics.careerScore).toBeGreaterThanOrEqual(70);
      expect(kgb.metrics.careerGrade).toContain('Düzeyi');

      // QR Kod & Doğrulama
      expect(kgb.verification.qrSvg).toContain('<svg');
      expect(kgb.verification.qrSvg).toContain('rect');
      expect(kgb.verification.verificationUrl).toContain('kariyer.esenyurt.edu.tr/dogrula/kgb');

      // Üçlü İmza Blokları
      const sigs = kgb.verification.signatures;
      expect(sigs.advisor.signed).toBe(true);
      expect(sigs.advisor.name).toBe('Doç. Dr. Selin Kaya');
      expect(sigs.coordinator.signed).toBe(true);
      expect(sigs.coordinator.unit).toBe('Kariyer Geliştirme Koordinatörlüğü');
      expect(sigs.rectorate.signed).toBe(true);
      expect(sigs.rectorate.badge).toContain('Diploma Eki');

      // JSON Dışa Aktarma
      const jsonStr = exportKgbDocumentAsJson(kgb);
      expect(jsonStr).toContain('IESU-KGB-');
      const parsed = JSON.parse(jsonStr);
      expect(parsed.documentId).toBe(kgb.documentId);
    });

    it('generates crisp vector QR code SVG without external dependencies', () => {
      const svg = generateQrCodeSvg('https://kariyer.esenyurt.edu.tr/dogrula/kgb?kod=TEST', 120);
      expect(svg).toContain('<svg');
      expect(svg).toContain('viewBox="0 0 120 120"');
      expect(svg).toContain('shape-rendering="crispEdges"');
    });
  });
});
