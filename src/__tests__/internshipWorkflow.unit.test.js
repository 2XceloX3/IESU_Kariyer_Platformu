import { describe, it, expect } from 'vitest';
import {
  validateTCKN,
  validateSGKSicil,
  validateVKN,
  calculateWorkDays,
  parseDateSafe,
  isNationalHoliday,
  isWorkDay,
  validateLogbookEntry,
  validateForm1Submission,
  advanceInternshipStatus,
  generateSGKBulkExportData,
  exportSGKToCSV,
  exportSGKToJSON,
  calculateLogbookProgress,
  INTERNSHIP_STATUS,
  LAW_REFERENCES,
  SAMPLE_ENTERPRISE_INTERNSHIPS,
  MIN_INTERNSHIP_WORK_DAYS
} from '../services/internshipWorkflow';

describe('Internship Workflow & Legal Engine (3308 / 5510 Sayılı Kanun)', () => {
  describe('validateTCKN Algorithm', () => {
    it('validates official Turkish algorithmic TCKN correctly', () => {
      // 10000000146 is a known valid algorithmic test TCKN
      expect(validateTCKN('10000000146')).toBe(true);
      expect(validateTCKN(10000000146)).toBe(true);
    });

    it('rejects invalid TCKNs (length, non-digits, leading zero, wrong checksum)', () => {
      expect(validateTCKN('')).toBe(false);
      expect(validateTCKN(null)).toBe(false);
      expect(validateTCKN('01234567890')).toBe(false); // starts with 0
      expect(validateTCKN('1234567890')).toBe(false);  // 10 digits
      expect(validateTCKN('123456789012')).toBe(false); // 12 digits
      expect(validateTCKN('10000000147')).toBe(false); // invalid checksum (last digit should be 6)
      expect(validateTCKN('abcdefghijk')).toBe(false);
    });
  });

  describe('validateSGKSicil and validateVKN', () => {
    it('validates SGK workplace registration numbers correctly', () => {
      expect(validateSGKSicil('2.4510.01.01.1234567.034.01-44')).toBe(true);
      expect(validateSGKSicil('24510010112345670340144')).toBe(true);
      expect(validateSGKSicil('123')).toBe(false);
      expect(validateSGKSicil('')).toBe(false);
    });

    it('validates 10-digit VKN or 11-digit TCKN', () => {
      expect(validateVKN('1234567890')).toBe(true);
      expect(validateVKN('10000000146')).toBe(true); // valid 11-digit TCKN
      expect(validateVKN('12345')).toBe(false);
      expect(validateVKN('00000000000')).toBe(false);
    });
  });

  describe('calculateWorkDays', () => {
    it('correctly calculates business days excluding Sundays (and Saturdays if configured)', () => {
      // 2026-07-01 (Wednesday) to 2026-07-07 (Tuesday) -> Wed, Thu, Fri, Mon, Tue = 5 work days (excl Sat & Sun)
      const days = calculateWorkDays('2026-07-01', '2026-07-07', false);
      expect(days).toBe(5);

      // With Saturdays included -> 6 work days
      const daysWithSat = calculateWorkDays('2026-07-01', '2026-07-07', true);
      expect(daysWithSat).toBe(6);
    });

    it('excludes Turkish national holidays (e.g. 15 Temmuz)', () => {
      // 2026-07-13 (Monday) to 2026-07-17 (Friday) -> Mon, Tue, (Wed 15 Temmuz holiday), Thu, Fri = 4 days
      const days = calculateWorkDays('2026-07-13', '2026-07-17', false);
      expect(days).toBe(4);
    });

    it('returns 0 for invalid or inverted dates', () => {
      expect(calculateWorkDays('', '')).toBe(0);
      expect(calculateWorkDays('2026-07-10', '2026-07-01')).toBe(0);
    });
  });

  describe('validateForm1Submission', () => {
    const validForm = {
      studentName: 'Ayşe Kaya',
      studentNo: '20220101001',
      tcNo: '10000000146',
      department: 'Bilgisayar Mühendisliği',
      phone: '0555 111 2233',
      email: 'ayse.kaya@ogr.esenyurt.edu.tr',
      companyName: 'Aselsan A.Ş.',
      sgkSicilNo: '2.4510.01.01.1234567.034.01-44',
      taxNo: '1234567890',
      companyAddress: 'ODTÜ Teknokent Ankara',
      companyAuthorizedPerson: 'Ahmet Yılmaz',
      companyAuthorizedEmail: 'ahmet@aselsan.com.tr',
      startDate: '2026-07-01',
      endDate: '2026-07-31',
      workDays: 22,
      includeSaturdays: false,
      hasFamilyGss: true,
      isEmployedElsewhere: false,
      sgkCommitmentApproved: true,
      employerApproved: true,
    };

    it('passes for a complete and compliant Form-1', () => {
      const result = validateForm1Submission(validForm);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('catches missing student data or invalid TCKN', () => {
      const invalid = { ...validForm, tcNo: '00000000000' };
      const res = validateForm1Submission(invalid);
      expect(res.isValid).toBe(false);
      expect(res.errors.some(e => e.includes('Kimlik'))).toBe(true);
    });

    it('catches missing SGK declaration & commitment', () => {
      const invalid = { ...validForm, sgkCommitmentApproved: false };
      const res = validateForm1Submission(invalid);
      expect(res.isValid).toBe(false);
      expect(res.errors.some(e => e.includes('Taahhütname'))).toBe(true);
    });

    it('catches durations less than legal minimum 20 work days', () => {
      const invalid = {
        ...validForm,
        startDate: '2026-07-01',
        endDate: '2026-07-05',
        workDays: 4,
      };
      const res = validateForm1Submission(invalid);
      expect(res.isValid).toBe(false);
      expect(res.errors.some(e => e.includes('asgari'))).toBe(true);
    });

    it('rejects invalid or unparseable calendar dates', () => {
      const invalid = {
        ...validForm,
        startDate: 'invalid-start-date',
        endDate: 'invalid-end-date',
      };
      const res = validateForm1Submission(invalid);
      expect(res.isValid).toBe(false);
      expect(res.errors.some(e => e.includes('Geçersiz staj başlangıç'))).toBe(true);
    });

    it('rejects discrepancy when declared work days exceed available calendar work days', () => {
      const invalid = {
        ...validForm,
        startDate: '2026-07-01',
        endDate: '2026-07-03', // Only 3 work days
        workDays: 25, // Declaring 25 days in a 3-day calendar window
      };
      const res = validateForm1Submission(invalid);
      expect(res.isValid).toBe(false);
      expect(res.errors.some(e => e.includes('asgari') || e.includes('fazla olamaz'))).toBe(true);
    });

    it('rejects paid internship without positive monthly wage under 3308 SK', () => {
      const invalidNegative = {
        ...validForm,
        isPaid: true,
        monthlyWage: -5000,
      };
      const resNeg = validateForm1Submission(invalidNegative);
      expect(resNeg.isValid).toBe(false);
      expect(resNeg.errors.some(e => e.includes('3308'))).toBe(true);

      const invalidZero = {
        ...validForm,
        isPaid: true,
        monthlyWage: 0,
      };
      const resZero = validateForm1Submission(invalidZero);
      expect(resZero.isValid).toBe(false);
      expect(resZero.errors.some(e => e.includes('3308'))).toBe(true);
    });
  });

  describe('advanceInternshipStatus (State Machine)', () => {
    const baseInternship = {
      id: 'INT-TEST-1',
      status: INTERNSHIP_STATUS.DRAFT,
      studentName: 'Ayşe Kaya',
      studentNo: '20220101001',
      tcNo: '10000000146',
      department: 'Bilgisayar Mühendisliği',
      phone: '0555 111 2233',
      email: 'ayse.kaya@ogr.esenyurt.edu.tr',
      companyName: 'Aselsan A.Ş.',
      sgkSicilNo: '2.4510.01.01.1234567.034.01-44',
      taxNo: '1234567890',
      companyAddress: 'ODTÜ Teknokent Ankara',
      companyAuthorizedPerson: 'Ahmet Yılmaz',
      companyAuthorizedEmail: 'ahmet@aselsan.com.tr',
      startDate: '2026-07-01',
      endDate: '2026-07-31',
      workDays: 22,
      includeSaturdays: false,
      hasFamilyGss: true,
      isEmployedElsewhere: false,
      sgkCommitmentApproved: true,
      employerApproved: true,
    };

    it('transitions DRAFT -> COMMISSION_PENDING on SUBMIT_FORM_1', () => {
      const updated = advanceInternshipStatus(baseInternship, 'SUBMIT_FORM_1');
      expect(updated.status).toBe(INTERNSHIP_STATUS.COMMISSION_PENDING);
      expect(updated.history.length).toBe(1);
    });

    it('transitions COMMISSION_PENDING -> COMMISSION_APPROVED on COMMISSION_APPROVE', () => {
      const pending = { ...baseInternship, status: INTERNSHIP_STATUS.COMMISSION_PENDING };
      const approved = advanceInternshipStatus(pending, 'COMMISSION_APPROVE', {
        reviewerName: 'Dr. Öğr. Üyesi Mehmet Can',
        note: 'Staj yeri ve tarihleri onaylandı.'
      });
      expect(approved.status).toBe(INTERNSHIP_STATUS.COMMISSION_APPROVED);
      expect(approved.advisorStatus).toBe('approved');
      expect(approved.reviewerName).toBe('Dr. Öğr. Üyesi Mehmet Can');
    });

    it('transitions COMMISSION_PENDING -> REVISION_REQUESTED with revision note', () => {
      const pending = { ...baseInternship, status: INTERNSHIP_STATUS.COMMISSION_PENDING };
      const revised = advanceInternshipStatus(pending, 'COMMISSION_REQUEST_REVISION', {
        revisionNote: 'SGK Sicil numarasının doğrulanması gerekiyor.'
      });
      expect(revised.status).toBe(INTERNSHIP_STATUS.REVISION_REQUESTED);
      expect(revised.revisionNote).toBe('SGK Sicil numarasının doğrulanması gerekiyor.');
    });

    it('transitions COMMISSION_APPROVED -> SGK_REGISTERED with generated barcode', () => {
      const approved = {
        ...baseInternship,
        status: INTERNSHIP_STATUS.COMMISSION_APPROVED,
        hasFamilyGss: true,
      };
      const sgkDone = advanceInternshipStatus(approved, 'SGK_REGISTER_ENTRY', {
        officerName: 'Personel Daire SGK Şefi',
      });
      expect(sgkDone.status).toBe(INTERNSHIP_STATUS.SGK_REGISTERED);
      expect(sgkDone.sgkStatus).toBe('Aktif');
      expect(sgkDone.sgkBarcode).toContain('IESU-SGK-5510');
      expect(sgkDone.gssStatus).toBe(LAW_REFERENCES.GSS_EXEMPT);
    });

    it('submits digital logbook and records entries', () => {
      const inProgress = {
        ...baseInternship,
        status: INTERNSHIP_STATUS.IN_PROGRESS,
      };
      const entries = [
        { day: 1, date: '2026-07-01', unit: 'Ar-Ge', activity: 'Sistem mimarisi analizi ve oryantasyon programı.' },
      ];
      const submitted = advanceInternshipStatus(inProgress, 'SUBMIT_NOTEBOOK', { entries });
      expect(submitted.status).toBe(INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED);
      expect(submitted.notebookEntries.length).toBe(1);
    });

    it('records employer evaluation and grade', () => {
      const submitted = {
        ...baseInternship,
        status: INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED,
      };
      const evaluated = advanceInternshipStatus(submitted, 'EMPLOYER_EVALUATE', {
        score: 95,
        feedback: 'Öğrenci teknik anlamda çok başarılıydı.',
      });
      expect(evaluated.status).toBe(INTERNSHIP_STATUS.EMPLOYER_EVALUATED);
      expect(evaluated.employerScore).toBe(95);
      expect(evaluated.companyStatus).toBe('completed');
    });

    it('records commission final grading: passes with S if weighted score >= 60', () => {
      const evaluated = {
        ...baseInternship,
        status: INTERNSHIP_STATUS.EMPLOYER_EVALUATED,
        employerScore: 90,
      };
      const graded = advanceInternshipStatus(evaluated, 'COMMISSION_FINAL_GRADE', {
        commissionScore: 85,
        tutanakNo: 'TUT-2026-99',
      });
      expect(graded.status).toBe(INTERNSHIP_STATUS.GRADED_PASSED);
      expect(graded.finalGrade).toBe('S');
      expect(graded.weightedScore).toBe(87); // 90*0.4 + 85*0.6 = 36 + 51 = 87
      expect(graded.obsExportReady).toBe(true);
    });

    it('records commission final grading: fails with U if weighted score < 60', () => {
      const evaluated = {
        ...baseInternship,
        status: INTERNSHIP_STATUS.EMPLOYER_EVALUATED,
        employerScore: 40,
      };
      const graded = advanceInternshipStatus(evaluated, 'COMMISSION_FINAL_GRADE', {
        commissionScore: 50,
      });
      expect(graded.status).toBe(INTERNSHIP_STATUS.GRADED_FAILED);
      expect(graded.finalGrade).toBe('U');
    });

    it('blocks illegal state transitions and enforces university FSM lifecycle', () => {
      // Cannot grade a draft
      expect(() => {
        advanceInternshipStatus({ status: INTERNSHIP_STATUS.DRAFT }, 'COMMISSION_FINAL_GRADE', { commissionScore: 85 });
      }).toThrow(/Bu aşamada final notlandırması yapılamaz/);

      // Cannot start an internship that has not been registered with SGK
      expect(() => {
        advanceInternshipStatus({ status: INTERNSHIP_STATUS.DRAFT }, 'START_INTERNSHIP');
      }).toThrow(/SGK işe giriş bildirgesi tescil edilmeden/);

      // Cannot submit notebook for an unapproved draft
      expect(() => {
        advanceInternshipStatus({ status: INTERNSHIP_STATUS.DRAFT }, 'SUBMIT_NOTEBOOK', {
          entries: [{ day: 1, activity: 'Test activity exceeding 20 characters.' }]
        });
      }).toThrow(/yalnızca staj devam ederken/);
    });
  });

  describe('generateSGKBulkExportData, CSV and JSON', () => {
    it('generates compliant 5510/5-b bulk export rows for approved internships', () => {
      const exportRows = generateSGKBulkExportData(SAMPLE_ENTERPRISE_INTERNSHIPS);
      expect(exportRows.length).toBeGreaterThan(0);

      const first = exportRows[0];
      expect(first.sigortaKoluKodu).toBe('07');
      expect(first.kanunKapsami).toContain('5510');
      expect(first.tcKimlikNo).toBe('10000000146');
      expect(first.toplamIsGunu).toBeGreaterThanOrEqual(MIN_INTERNSHIP_WORK_DAYS);
    });

    it('correctly splits Turkish given names and surname (MERNIS compliance)', () => {
      const testCases = [
        {
          studentName: 'Ahmet Can Öztürk',
          status: INTERNSHIP_STATUS.COMMISSION_APPROVED,
          tcNo: '10000000146',
          startDate: '2026-07-01',
          endDate: '2026-07-31',
          workDays: 22,
        },
        {
          studentName: '  Elif   Nur   Yılmaz  ',
          status: INTERNSHIP_STATUS.COMMISSION_APPROVED,
          tcNo: '10000000146',
          startDate: '2026-07-01',
          endDate: '2026-07-31',
          workDays: 22,
        },
        {
          studentName: 'Ayşe',
          status: INTERNSHIP_STATUS.COMMISSION_APPROVED,
          tcNo: '10000000146',
          startDate: '2026-07-01',
          endDate: '2026-07-31',
          workDays: 22,
        }
      ];

      const rows = generateSGKBulkExportData(testCases);
      expect(rows[0].ad).toBe('Ahmet Can');
      expect(rows[0].soyad).toBe('Öztürk');

      expect(rows[1].ad).toBe('Elif Nur');
      expect(rows[1].soyad).toBe('Yılmaz');

      expect(rows[2].ad).toBe('Ayşe');
      expect(rows[2].soyad).toBe('');
    });

    it('includes EMPLOYER_EVALUATED internships in SGK bulk export', () => {
      const evaluated = [
        {
          ...SAMPLE_ENTERPRISE_INTERNSHIPS[0],
          status: INTERNSHIP_STATUS.EMPLOYER_EVALUATED,
        }
      ];
      const rows = generateSGKBulkExportData(evaluated);
      expect(rows.length).toBe(1);
    });

    it('exports CSV with UTF-8 BOM, semi-colon delimiters, and header row', () => {
      const csv = exportSGKToCSV(SAMPLE_ENTERPRISE_INTERNSHIPS);
      expect(csv.startsWith('\uFEFF')).toBe(true);
      expect(csv).toContain('T.C. Kimlik No');
      expect(csv).toContain('Sigorta Kolu Kodu');
      expect(csv).toContain('10000000146');
    });

    it('exports structured JSON for SGK Web Service', () => {
      const jsonStr = exportSGKToJSON(SAMPLE_ENTERPRISE_INTERNSHIPS);
      const parsed = JSON.parse(jsonStr);
      expect(parsed.kurum).toContain('İstanbul Esenyurt Üniversitesi');
      expect(parsed.birim).toContain('Personel Dairesi Başkanlığı');
      expect(Array.isArray(parsed.kayitlar)).toBe(true);
      expect(parsed.kayitlar.length).toBeGreaterThan(0);
    });
  });

  describe('calculateLogbookProgress', () => {
    it('accurately calculates logbook progress percentage and unique skills', () => {
      const entries = [
        { day: 1, activity: 'React ve Tailwind ile UI bileşenleri geliştirildi.', skills: ['React', 'Tailwind'] },
        { day: 2, activity: 'Vitest ve Mock servisleri ile birim testler yazıldı.', skills: ['Vitest', 'Testing'] },
        { day: 3, activity: 'kısa', skills: ['CSS'] }, // Less than 20 chars, not counted as complete
      ];
      const prog = calculateLogbookProgress(entries, 20);
      expect(prog.completedDays).toBe(2);
      expect(prog.targetDays).toBe(20);
      expect(prog.percentage).toBe(10);
      expect(prog.isComplete).toBe(false);
      expect(prog.skillsLearned).toContain('React');
      expect(prog.skillsLearned).toContain('Vitest');
    });

    it('deduplicates duplicate day entries to prevent artificial completion cheating', () => {
      const duplicated = Array.from({ length: 20 }, () => ({
        day: 1,
        activity: 'Aynı günün kaydı mükerrer olarak defalarca kopyalandı.',
        skills: ['Testing']
      }));
      const prog = calculateLogbookProgress(duplicated, 20);
      expect(prog.completedDays).toBe(1);
      expect(prog.isComplete).toBe(false);
      expect(prog.percentage).toBe(5);
    });
  });

  describe('validateLogbookEntry & Date/Holiday Helpers', () => {
    const sampleInternship = {
      startDate: '2026-07-01',
      endDate: '2026-07-31',
      includeSaturdays: false,
    };

    it('parseDateSafe safely creates local dates and rejects invalid calendar days', () => {
      const d = parseDateSafe('2026-07-01');
      expect(d).not.toBeNull();
      expect(d.getDate()).toBe(1);
      expect(d.getMonth()).toBe(6); // July is 6

      expect(parseDateSafe('invalid-date')).toBeNull();
      expect(parseDateSafe('')).toBeNull();
      expect(parseDateSafe(null)).toBeNull();
      expect(parseDateSafe('2026-02-30')).toBeNull(); // Feb 30 does not exist
    });

    it('isNationalHoliday identifies statutory fixed holidays', () => {
      expect(isNationalHoliday('2026-10-29')).toBe(true); // Cumhuriyet Bayramı
      expect(isNationalHoliday('2026-07-15')).toBe(true); // 15 Temmuz
      expect(isNationalHoliday('2026-07-01')).toBe(false);
    });

    it('isWorkDay rejects Sundays and conditionally checks Saturdays', () => {
      // 2026-07-05 is Sunday
      expect(isWorkDay('2026-07-05', true)).toBe(false);
      expect(isWorkDay('2026-07-05', false)).toBe(false);

      // 2026-07-04 is Saturday
      expect(isWorkDay('2026-07-04', false)).toBe(false);
      expect(isWorkDay('2026-07-04', true)).toBe(true);

      // 2026-07-15 is 15 Temmuz Wednesday (Holiday)
      expect(isWorkDay('2026-07-15', true)).toBe(false);
    });

    it('validateLogbookEntry validates statutory constraints (Sunday, holiday, duplicates, length)', () => {
      const existing = [
        { day: 1, date: '2026-07-01', activity: 'Şirket oryantasyonu ve birim tanıtımı gerçekleştirildi.' }
      ];

      // Sunday rejection
      const sundayEntry = { day: 2, date: '2026-07-05', activity: 'Pazar günü ofise giderek test senaryoları çalışıldı.' };
      const sundayRes = validateLogbookEntry(sundayEntry, sampleInternship, existing);
      expect(sundayRes.isValid).toBe(false);
      expect(sundayRes.errors.some(e => e.includes('Pazar'))).toBe(true);

      // Holiday rejection
      const holidayEntry = { day: 2, date: '2026-07-15', activity: '15 Temmuz resmî tatil günü yapılan ar-ge analizleri.' };
      const holidayRes = validateLogbookEntry(holidayEntry, sampleInternship, existing);
      expect(holidayRes.isValid).toBe(false);
      expect(holidayRes.errors.some(e => e.includes('tatil'))).toBe(true);

      // Duplicate day rejection
      const dupEntry = { day: 1, date: '2026-07-02', activity: 'İkinci gün faaliyeti fakat gün numarası 1 girildi.' };
      const dupRes = validateLogbookEntry(dupEntry, sampleInternship, existing);
      expect(dupRes.isValid).toBe(false);
      expect(dupRes.errors.some(e => e.includes('zaten bir staj kaydı'))).toBe(true);

      // Short activity rejection
      const shortEntry = { day: 2, date: '2026-07-02', activity: 'kod yazdım' };
      const shortRes = validateLogbookEntry(shortEntry, sampleInternship, existing);
      expect(shortRes.isValid).toBe(false);
      expect(shortRes.errors.some(e => e.includes('20 karakter'))).toBe(true);

      // Valid entry passes
      const validEntry = { day: 2, date: '2026-07-02', activity: 'React ve Tailwind ile UI bileşenleri geliştirildi ve test edildi.' };
      const validRes = validateLogbookEntry(validEntry, sampleInternship, existing);
      expect(validRes.isValid).toBe(true);
      expect(validRes.errors.length).toBe(0);
    });
  });
});
