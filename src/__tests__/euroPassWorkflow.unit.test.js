/**
 * src/__tests__/euroPassWorkflow.unit.test.js
 * EuroPass, Bologna Diploma Supplement, Erasmus+ LAT ve QS/THE Sıralama Motoru Kapsamlı Birim Testleri
 */

import { describe, it, expect } from 'vitest';
import {
  EUROPASS_STANDARDS,
  ECTS_GRADING_SCALE,
  generateEuroPassCVJsonLD,
  generateBolognaDiplomaSupplement,
  generateErasmusLearningAgreement,
  validateEuroPassProfile,
  validateEuroPassCompliance,
  exportDocumentToPrintableHTML,
  exportEuroPassHTML,
  computeVerificationChecksum
} from '../services/euroPassWorkflow';
import {
  QS_RANKING_STANDARDS,
  GLOBAL_2000_TARGET_COMPANIES,
  computeQSMetrics,
  generateGlobalQSRankingReport,
  exportQSRankingReportHTML
} from '../services/qsRankingWorkflow';
import {
  GLOBAL_CITIES_PARITY_DATA,
  calculateLivingParity
} from '../components/global/GlobalCareerCostCalculator';

describe('EuroPass Workflow & Bologna Diploma Supplement Engine', () => {
  const sampleStudent = {
    id: 'STU-01',
    studentNo: '2023010482',
    name: 'Ahmet Yılmaz',
    tcNo: '10000000146',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik ve Mimarlık Fakültesi',
    gano: 3.84,
    completedEcts: 180,
    totalEcts: 240,
    email: 'ahmet.yilmaz@ogrenci.esenyurt.edu.tr',
    phone: '+90 532 100 2030',
    skills: ['C++', 'Python', 'React', 'Docker'],
    internships: [
      {
        company: 'Baykar Teknoloji',
        position: 'Gömülü Yazılım Stajyeri',
        duration: '20 İş Günü',
        date: '07/2025 - 08/2025',
        summary: 'İHA telemetri optimizasyonu',
        skills: ['C++', 'ROS2']
      }
    ]
  };

  describe('EUROPASS_STANDARDS Constants', () => {
    it('contains official institutional names and Erasmus code', () => {
      expect(EUROPASS_STANDARDS.INSTITUTION_NAME).toBe('İstanbul Esenyurt Üniversitesi (İESÜ)');
      expect(EUROPASS_STANDARDS.INSTITUTION_NAME_EN).toBe('Istanbul Esenyurt University (IESU)');
      expect(EUROPASS_STANDARDS.ERASMUS_CODE).toBe('TR ISTANBU35');
      expect(EUROPASS_STANDARDS.COORDINATION_OFFICE).toBe('Kariyer Geliştirme Koordinatörlüğü');
      expect(EUROPASS_STANDARDS.EQF_LEVEL_BACHELOR).toBe(6);
      expect(EUROPASS_STANDARDS.STANDARD_BACHELOR_ECTS).toBe(240);
    });
  });

  describe('generateEuroPassCVJsonLD', () => {
    it('generates W3C & EuroPass compliant JSON-LD structure', () => {
      const jsonLd = generateEuroPassCVJsonLD(sampleStudent, { language: 'en' });

      expect(jsonLd).toBeDefined();
      expect(jsonLd['@context']).toContain('https://europa.eu/europass/schema/v1.0');
      expect(jsonLd['@type']).toContain('EuropassCV');
      expect(jsonLd.id).toBe('urn:europass:cv:IESU-2023010482');
      expect(jsonLd.issuingAuthority.name).toBe('İstanbul Esenyurt Üniversitesi (İESÜ)');
      expect(jsonLd.issuingAuthority.erasmusCode).toBe('TR ISTANBU35');

      // Person Details
      expect(jsonLd.person.givenNames).toBe('Ahmet');
      expect(jsonLd.person.familyName).toBe('Yılmaz');
      expect(jsonLd.person.nationalIdMasked).toContain('*****');

      // Education & EQF Level
      expect(jsonLd.educationAndTraining.length).toBeGreaterThan(0);
      expect(jsonLd.educationAndTraining[0].eqfLevel).toBe(6);
      expect(jsonLd.educationAndTraining[0].ectsCredits).toBe(240);
      expect(jsonLd.educationAndTraining[0].gpaValue).toBe('3.84');

      // Languages & CEFR
      expect(jsonLd.motherTongue).toBe('tr');
      expect(jsonLd.otherLanguages.length).toBeGreaterThan(0);
      expect(jsonLd.otherLanguages[0].proficiency.listening).toBeDefined();

      // Checksum
      expect(jsonLd.verificationChecksum).toMatch(/^IESU-EUROPASS-EHEA-/);
    });

    it('handles empty profile gracefully with sensible institutional defaults', () => {
      const jsonLd = generateEuroPassCVJsonLD({});
      expect(jsonLd).toBeDefined();
      expect(jsonLd.issuingAuthority.erasmusCode).toBe('TR ISTANBU35');
      expect(jsonLd.educationAndTraining[0].eqfLevel).toBe(6);
      expect(jsonLd.verificationChecksum).toBeDefined();
    });
  });

  describe('generateBolognaDiplomaSupplement', () => {
    it('generates all 8 standard EHEA Bologna sections', () => {
      const ds = generateBolognaDiplomaSupplement(sampleStudent, { language: 'en' });

      expect(ds).toBeDefined();
      expect(ds.dsNumber).toBe('IESU-DS-2026-2023010482');

      // Section 1: Holder
      expect(ds.section1.title).toContain('1.');
      expect(ds.section1.familyName).toBe('Yılmaz');
      expect(ds.section1.givenNames).toBe('Ahmet');
      expect(ds.section1.studentIdentificationNumber).toBe('2023010482');

      // Section 2: Qualification
      expect(ds.section2.title).toContain('2.');
      expect(ds.section2.awardingInstitution).toBe('İstanbul Esenyurt Üniversitesi (İESÜ)');
      expect(ds.section2.erasmusCode).toBe('TR ISTANBU35');

      // Section 3: Level & Duration
      expect(ds.section3.title).toContain('3.');
      expect(ds.section3.levelOfQualification).toContain('EQF Level 6');
      expect(ds.section3.officialLengthOfProgramme).toContain('240 ECTS');

      // Section 4: Results
      expect(ds.section4.title).toContain('4.');
      expect(ds.section4.gpa).toBe(3.84);
      expect(ds.section4.ectsGrade).toBe('A'); // 3.84 matches top tier 'A'
      expect(ds.section4.completedEcts).toBe(180);

      // Section 5: Function
      expect(ds.section5.title).toContain('5.');
      expect(ds.section5.accessToFurtherStudy).toContain('Second Cycle');

      // Section 6: Additional Info
      expect(ds.section6.title).toContain('6.');
      expect(ds.section6.institutionalAccreditation).toContain('YÖKAK');

      // Section 7: Certification
      expect(ds.section7.title).toContain('7.');
      expect(ds.section7.officials.length).toBe(2);
      expect(ds.section7.digitalSeal).toBe(EUROPASS_STANDARDS.RECTORATE_TITLE);

      // Section 8: National System
      expect(ds.section8.title).toContain('8.');
      expect(ds.section8.summary).toContain('Council of Higher Education (YÖK)');
    });

    it('generates Turkish language version with accurate translations', () => {
      const dsTr = generateBolognaDiplomaSupplement(sampleStudent, { language: 'tr' });
      expect(dsTr.language).toBe('tr');
      expect(dsTr.section1.title).toContain('DİPLOMA SAHİBİNİN');
      expect(dsTr.section2.awardingInstitution).toBe('İstanbul Esenyurt Üniversitesi (İESÜ)');
      expect(dsTr.section4.ectsGrade).toBe('A');
      expect(dsTr.section4.performanceLabel).toContain('Pekiyi');
    });

    it('maps grades to correct ECTS scale', () => {
      const dsLow = generateBolognaDiplomaSupplement({ ...sampleStudent, gano: 2.20 });
      expect(dsLow.section4.ectsGrade).toBe('E');

      const dsMid = generateBolognaDiplomaSupplement({ ...sampleStudent, gano: 3.20 });
      expect(dsMid.section4.ectsGrade).toBe('C');
    });
  });

  describe('generateErasmusLearningAgreement', () => {
    it('creates compliant Erasmus+ Traineeship Learning Agreement', () => {
      const traineeshipData = {
        companyName: 'Siemens AG',
        country: 'Germany',
        city: 'Munich',
        position: 'IoT Software Trainee',
        startDate: '2026-07-01',
        endDate: '2026-09-30',
        ects: 12
      };

      const lat = generateErasmusLearningAgreement(sampleStudent, traineeshipData, { language: 'en' });

      expect(lat.agreementId).toContain('IESU-ERASMUS-LAT-');
      expect(lat.sendingInstitution.erasmusCode).toBe('TR ISTANBU35');
      expect(lat.receivingOrganisation.name).toBe('Siemens AG');
      expect(lat.receivingOrganisation.country).toBe('Germany');

      // Table A
      expect(lat.tableA.detailedProgramme.length).toBeGreaterThan(0);
      expect(lat.tableA.plannedPeriod.startDate).toBe('2026-07-01');

      // Table B
      expect(lat.tableB.ectsAwarded).toBe(12);
      expect(lat.tableB.recordInDiplomaSupplement).toBe(true);
      expect(lat.tableB.insuranceCoverage.accidentInsurance).toContain('3308');

      // Digital Signatures
      expect(lat.digitalSignatures.length).toBe(3);
    });
  });

  describe('validateEuroPassProfile', () => {
    it('passes for complete profile', () => {
      const res = validateEuroPassProfile(sampleStudent);
      expect(res.valid).toBe(true);
      expect(res.errors.length).toBe(0);
    });

    it('rejects missing name', () => {
      const res = validateEuroPassProfile({ ...sampleStudent, name: '' });
      expect(res.valid).toBe(false);
      expect(res.errors).toContain('Öğrencinin adı ve soyadı zorunludur.');
    });

    it('rejects missing department', () => {
      const res = validateEuroPassProfile({ ...sampleStudent, department: '', program: '' });
      expect(res.valid).toBe(false);
      expect(res.errors).toContain('Akademik bölüm / program adı zorunludur.');
    });

    it('warns on out-of-bounds GPA', () => {
      const res = validateEuroPassProfile({ ...sampleStudent, gano: 4.8 });
      expect(res.warnings.length).toBeGreaterThan(0);
    });

    it('handles null and invalid objects defensively', () => {
      expect(validateEuroPassProfile(null).valid).toBe(false);
      expect(validateEuroPassProfile(undefined).valid).toBe(false);
    });
  });

  describe('exportEuroPassHTML', () => {
    it('produces valid HTML document string with official headers', () => {
      const ds = generateBolognaDiplomaSupplement(sampleStudent, { language: 'en' });
      const html = exportEuroPassHTML(ds, { language: 'en' });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('İstanbul Esenyurt Üniversitesi (İESÜ)');
      expect(html).toContain('DIPLOMA SUPPLEMENT');
      expect(html).toContain(ds.section1.familyName);
      expect(html).toContain(ds.verificationCode);
    });
  });

  describe('validateEuroPassCompliance Engine', () => {
    it('validates a complete EuroPass CV doc structure', () => {
      const cv = generateEuroPassCVJsonLD(sampleStudent, { language: 'en' });
      const res = validateEuroPassCompliance(cv, 'cv');
      expect(res.valid).toBe(true);
      expect(res.errors.length).toBe(0);
    });

    it('rejects an empty or malformed CV doc', () => {
      const res = validateEuroPassCompliance({}, 'cv');
      expect(res.valid).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
    });

    it('validates a complete Bologna Diploma Supplement', () => {
      const ds = generateBolognaDiplomaSupplement(sampleStudent, { language: 'en' });
      const res = validateEuroPassCompliance(ds, 'ds');
      expect(res.valid).toBe(true);
      expect(res.errors.length).toBe(0);
    });

    it('validates a complete Erasmus+ Learning Agreement for Traineeships', () => {
      const erasmus = generateErasmusLearningAgreement(sampleStudent, {}, { language: 'en' });
      const res = validateEuroPassCompliance(erasmus, 'erasmus');
      expect(res.valid).toBe(true);
      expect(res.errors.length).toBe(0);
    });

    it('defensively handles null and undefined documents', () => {
      expect(validateEuroPassCompliance(null, 'cv').valid).toBe(false);
      expect(validateEuroPassCompliance(undefined, 'ds').valid).toBe(false);
      expect(validateEuroPassCompliance(null, 'erasmus').valid).toBe(false);
    });
  });

  describe('exportDocumentToPrintableHTML Engine', () => {
    it('exports EuroPass CV to printable HTML with CEFR matrix', () => {
      const cv = generateEuroPassCVJsonLD(sampleStudent, { language: 'en' });
      const html = exportDocumentToPrintableHTML('cv', cv, { language: 'en' });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('EUROPASS CURRICULUM VITAE');
      expect(html).toContain('Ahmet');
      expect(html).toContain('Yılmaz');
      expect(html).toContain('Baykar Teknoloji');
    });

    it('exports Bologna Diploma Supplement with all 8 EHEA sections', () => {
      const ds = generateBolognaDiplomaSupplement(sampleStudent, { language: 'en' });
      const html = exportDocumentToPrintableHTML('ds', ds, { language: 'en' });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('DIPLOMA SUPPLEMENT');
      expect(html).toContain('INFORMATION IDENTIFYING THE HOLDER');
      expect(html).toContain('INFORMATION ON THE FUNCTION OF THE QUALIFICATION');
      expect(html).toContain('CERTIFICATION OF THE SUPPLEMENT');
      expect(html).toContain(ds.verificationCode);
    });

    it('exports Erasmus+ Learning Agreement for Traineeships with tripartite sign-off', () => {
      const erasmus = generateErasmusLearningAgreement(sampleStudent, {}, { language: 'en' });
      const html = exportDocumentToPrintableHTML('erasmus', erasmus, { language: 'en' });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('LEARNING AGREEMENT FOR TRAINEESHIPS');
      expect(html).toContain('TR ISTANBU35');
      expect(html).toContain('Sending Institution');
      expect(html).toContain('Receiving Enterprise');
      expect(html).toContain('Student');
    });
  });
});

describe('QS / THE World University Ranking Reporting Engine', () => {
  it('computes realistic graduate employment rates and Fortune 500 ratio', () => {
    const metrics = computeQSMetrics();

    expect(metrics.graduateEmploymentRate6Months).toBeGreaterThanOrEqual(80);
    expect(metrics.graduateEmploymentRate12Months).toBeGreaterThanOrEqual(90);
    expect(metrics.fortune500Global2000PlacementRate).toBeGreaterThan(0);
    expect(metrics.employerReputationIndex).toBeGreaterThan(50);
    expect(metrics.compositeQSEmployabilityScore).toBeGreaterThan(70);
    expect(metrics.projectedRankTier).toContain('Global Employability');
  });

  it('handles custom alumni array with unemployed graduates accurately (avoiding default 3-month bug)', () => {
    const customAlumni = [
      { id: 'A1', name: 'Alum 1', isEmployed: false, employedWithinMonths: -1 },
      { id: 'A2', name: 'Alum 2', isEmployed: false, employedWithinMonths: null },
      { id: 'A3', name: 'Alum 3', isEmployed: false, employedWithinMonths: undefined },
    ];
    const metrics = computeQSMetrics(customAlumni);
    expect(metrics.totalAlumniTracked).toBe(3);
    expect(metrics.employedWithin6mCount).toBe(0);
    expect(metrics.graduateEmploymentRate6Months).toBe(0);
    expect(metrics.employedWithin12mCount).toBe(0);
    expect(metrics.graduateEmploymentRate12Months).toBe(0);
  });

  it('generates official audit dossier with SHA-256 seal', () => {
    const report = generateGlobalQSRankingReport();

    expect(report.reportId).toMatch(/^IESU-QS-/);
    expect(report.institution.nameEn).toBe('Istanbul Esenyurt University (IESU)');
    expect(report.auditIndicators.length).toBeGreaterThanOrEqual(4);
    expect(report.sampleEnterprisePlacements.length).toBeGreaterThan(0);
    expect(report.signatories.length).toBe(2);
    expect(report.cryptographicSeal.verified).toBe(true);
  });

  it('exports printable English audit dossier HTML', () => {
    const report = generateGlobalQSRankingReport();
    const html = exportQSRankingReportHTML(report);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('QS & THE RANKINGS AUDIT REPORT');
    expect(html).toContain('Istanbul Esenyurt University (IESU)');
    expect(html).toContain(report.reportId);
  });
});

describe('Purchasing Power Parity (PPP) Living Cost Calculator', () => {
  it('calculates Berlin vs Istanbul parity correctly', () => {
    const parity = calculateLivingParity({
      targetCityKey: 'berlin',
      salaryInput: 4500,
      isGross: true,
      housingType: 'center1BR',
      lifestyle: 'balanced'
    });

    expect(parity.target.city).toBe('Berlin');
    expect(parity.target.currency).toBe('EUR');
    expect(parity.netSalary).toBeLessThan(4500); // reduced by tax
    expect(parity.totalMonthlyExpenses).toBeGreaterThan(1500);
    expect(parity.netMonthlySavings).toBeDefined();
    expect(parity.equivalentIstanbulNetSalary).toBeGreaterThan(40000);
    expect(parity.purchasingPowerFactor).toBeDefined();
  });

  it('handles Zurich high-income and Amsterdam comparisons', () => {
    const zurich = calculateLivingParity({
      targetCityKey: 'zurich',
      salaryInput: 8500,
      isGross: true
    });
    expect(zurich.netSalary).toBeGreaterThan(6000);
    expect(zurich.totalMonthlyExpenses).toBeGreaterThan(3000);

    const amsterdam = calculateLivingParity({
      targetCityKey: 'amsterdam',
      salaryInput: 5000,
      isGross: true
    });
    expect(amsterdam.target.city).toBe('Amsterdam');
    expect(amsterdam.netSalaryInTry).toBeGreaterThan(100000);
  });

  it('handles Dubai 0% tax policy properly', () => {
    const dubai = calculateLivingParity({
      targetCityKey: 'dubai',
      salaryInput: 18000,
      isGross: true
    });
    // In Dubai tax is 0% so gross == net
    expect(dubai.netSalary).toBe(18000);
  });
});
