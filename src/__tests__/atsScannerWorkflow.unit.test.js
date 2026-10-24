import { describe, it, expect, beforeEach } from 'vitest';
import {
  normalizeAtsText,
  countKeywordOccurrences,
  extractKeywordsFromJobDescription,
  checkResumeAtsFormatting,
  scanResumeAgainstJob,
  generateAtsOptimizationSuggestions,
  saveAtsScanResult,
  getAtsScanHistory,
  clearAtsScanHistory
} from '../services/atsScannerWorkflow';

describe('atsScannerWorkflow Unit Tests', () => {
  beforeEach(() => {
    clearAtsScanHistory();
    localStorage.clear();
  });

  describe('normalizeAtsText', () => {
    it('handles null, undefined, numbers and non-strings safely', () => {
      expect(normalizeAtsText(null)).toBe('');
      expect(normalizeAtsText(undefined)).toBe('');
      expect(normalizeAtsText(12345)).toBe('');
      expect(normalizeAtsText({})).toBe('');
    });

    it('normalizes Turkish characters correctly and trims whitespace', () => {
      const input = '  İSTANBUL ESENYURT ÜNİVERSİTESİ • YAZILIM  ';
      const output = normalizeAtsText(input);
      expect(output).toContain('istanbul');
      expect(output).toContain('esenyurt');
      expect(output).toContain('yazilim');
      expect(output).not.toContain('•');
    });
  });

  describe('extractKeywordsFromJobDescription', () => {
    it('returns empty array on empty or null inputs', () => {
      expect(extractKeywordsFromJobDescription(null)).toEqual([]);
      expect(extractKeywordsFromJobDescription('')).toEqual([]);
    });

    it('extracts technical skills, cloud, and soft skills from real job description', () => {
      const jobDesc = `
        Aranan Nitelikler:
        - React, TypeScript ve Tailwind CSS teknolojilerinde en az 2 yıl deneyim
        - Node.js ve Docker ile mikroservis mimarilerine aşina
        - AWS üzerinde CI/CD süreçlerini yönetebilen
        - Takım çalışmasına yatkın ve analitik düşünme yeteneği yüksek
      `;
      const keywords = extractKeywordsFromJobDescription(jobDesc);
      const names = keywords.map(k => k.keyword);

      expect(names).toContain('React');
      expect(names).toContain('TypeScript');
      expect(names).toContain('Node.js');
      expect(names).toContain('Docker');
      expect(names).toContain('AWS');
    });

    it('falls back to frequent words if no known dictionary keywords are in text', () => {
      const jobDesc = 'Biyoistatistik mikrobiyoloji histopatoloji biyoenformatik analiz sorumlusu';
      const keywords = extractKeywordsFromJobDescription(jobDesc);
      expect(keywords.length).toBeGreaterThan(0);
      expect(keywords[0]).toHaveProperty('keyword');
    });
  });

  describe('checkResumeAtsFormatting', () => {
    it('flags extremely short or empty resumes with low score', () => {
      const res = checkResumeAtsFormatting('');
      expect(res.formatScore).toBeLessThanOrEqual(20);
      expect(res.issues.length).toBeGreaterThan(0);
      expect(res.issues[0].status).toBe('fail');
    });

    it('detects missing contact details, sections, and low metrics', () => {
      const resume = `
        Ahmet Yılmaz
        Yazılım Geliştirici
        Deneyim: Web projeleri yaptı.
      `;
      const res = checkResumeAtsFormatting(resume);
      expect(res.hasEmail).toBe(false);
      expect(res.hasPhone).toBe(false);
      expect(res.issues.some(i => i.rule.includes('E-Posta'))).toBe(true);
    });

    it('rewards complete CV with email, phone, metrics, action verbs, and standard sections', () => {
      const fullResume = `
        Ahmet Yılmaz | ahmet@iesu.edu.tr | +90 555 123 45 67 | linkedin.com/in/ahmetyilmaz
        
        Özet / Kariyer Hedefi:
        İstanbul Esenyurt Üniversitesi Yazılım Mühendisliği mezunuyum.

        İş & Staj Deneyimi:
        - Frontend Developer: React ve TypeScript ile kullanıcı panelini geliştirdi ve sayfa hızını %40 artırdı.
        - 5 kişilik ekiple 3 proje koordine etti ve bulut altyapısını optimize etti.

        Eğitim:
        İstanbul Esenyurt Üniversitesi, Lisans (GPA: 3.52)

        Yetkinlikler & Beceriler:
        React, Node.js, Docker, Git, REST API, Takım Çalışması.

        Projeler & Sertifikalar:
        EuroPass KGB Sertifikası, YÖK Onaylı Bitirme Projesi.
      `;
      const res = checkResumeAtsFormatting(fullResume);
      expect(res.hasEmail).toBe(true);
      expect(res.hasPhone).toBe(true);
      expect(res.metricsFound.length).toBeGreaterThan(0);
      expect(res.detectedActionVerbs.length).toBeGreaterThan(1);
      expect(res.formatScore).toBeGreaterThanOrEqual(80);
    });
  });

  describe('scanResumeAgainstJob', () => {
    it('computes overall ATS score and identifies matched vs missing keywords', () => {
      const jobDesc = 'We are looking for a Senior React and Docker developer with AWS and TypeScript experience.';
      const resume = `
        Caner Doğan | caner@iesu.edu.tr | +90 532 999 88 77
        Özet: Full-stack developer.
        İş & Staj Deneyimi:
        React ve TypeScript ile kurumsal projeler geliştirdi ve performansı %30 artırdı.
        Eğitim: İstanbul Esenyurt Üniversitesi
        Yetkinlikler: React, TypeScript, Git
      `;
      const report = scanResumeAgainstJob(resume, jobDesc, { jobTitle: 'Senior React Developer' });

      expect(report.overallScore).toBeGreaterThan(0);
      expect(report.matchedKeywords.some(m => m.keyword === 'React')).toBe(true);
      expect(report.matchedKeywords.some(m => m.keyword === 'TypeScript')).toBe(true);
      // Docker & AWS should be missing
      expect(report.missingKeywords.some(m => m.keyword === 'Docker')).toBe(true);
      expect(report.missingKeywords.some(m => m.keyword === 'AWS')).toBe(true);

      // System compatibility verification
      expect(report.systemCompatibility).toHaveProperty('workday');
      expect(report.systemCompatibility).toHaveProperty('greenhouse');
      expect(report.systemCompatibility).toHaveProperty('taleo');
      expect(report.systemCompatibility).toHaveProperty('lever');
    });

    it('generates actionable optimization suggestions', () => {
      const jobDesc = 'React, Kubernetes, AWS, Go Developer';
      const resume = 'Ali | ali@test.com | React developer';
      const report = scanResumeAgainstJob(resume, jobDesc);
      const suggestions = generateAtsOptimizationSuggestions(report, 'Cloud Developer');

      expect(suggestions).not.toBeNull();
      expect(suggestions.jobTitle).toBe('Cloud Developer');
      expect(suggestions.suggestedSummary).toContain('İstanbul Esenyurt Üniversitesi');
      expect(suggestions.suggestedBulletPoints.length).toBeGreaterThan(0);
    });
  });

  describe('LocalStorage Persistence', () => {
    it('saves, retrieves, and clears scan reports in localStorage', () => {
      const sampleReport = {
        id: 'scan_101',
        overallScore: 88,
        scannedAt: new Date().toISOString()
      };

      const saved = saveAtsScanResult(sampleReport);
      expect(saved).toBe(true);

      const history = getAtsScanHistory();
      expect(history.length).toBe(1);
      expect(history[0].id).toBe('scan_101');
      expect(history[0].overallScore).toBe(88);

      const cleared = clearAtsScanHistory();
      expect(cleared).toBe(true);
      expect(getAtsScanHistory()).toEqual([]);
    });
  });

  describe('Edge Cases: Turkish Action Verbs, Word Boundaries & Diacritics', () => {
    it('detects diverse Turkish action verbs accurately despite diacritics', () => {
      const resume = `
        Ahmet Yılmaz | ahmet@iesu.edu.tr | +90 555 111 22 33
        Özet: Yazılım Mühendisi
        Deneyim:
        - Yeni ödeme altyapısını geliştirdi ve performansı %50 artırdı.
        - 4 kişilik yazılım ekibini yönetti ve mimariyi tasarladı.
        - Mikroservisleri entegre etti ve veritabanını optimize etti.
        - CI/CD boru hattını kurdu ve sistem süreçlerini analiz etti.
        Eğitim: İstanbul Esenyurt Üniversitesi
        Yetkinlikler: React, Node.js
        Projeler: Bitirme Projesi
      `;
      const res = checkResumeAtsFormatting(resume);
      expect(res.detectedActionVerbs).toContain('Geliştirdi');
      expect(res.detectedActionVerbs).toContain('Yönetti');
      expect(res.detectedActionVerbs).toContain('Tasarladı');
      expect(res.detectedActionVerbs).toContain('Optimize etti');
      expect(res.detectedActionVerbs).toContain('Entegre etti');
      expect(res.detectedActionVerbs).toContain('Artırdı');
      expect(res.detectedActionVerbs).toContain('Kurdu');
      expect(res.detectedActionVerbs).toContain('Analiz etti');
      expect(res.detectedActionVerbs.length).toBeGreaterThanOrEqual(5);
    });

    it('isolates sub-words correctly: does not confuse Java with JavaScript or Go with algorithm', () => {
      const jsOnlyText = normalizeAtsText('Senior JavaScript and TypeScript developer building frontend apps');
      expect(countKeywordOccurrences(jsOnlyText, 'Java')).toBe(0);
      expect(countKeywordOccurrences(jsOnlyText, 'JavaScript')).toBe(1);

      const algoText = normalizeAtsText('Deep knowledge of algorithm design, graph traversal, and Google Cloud at scale');
      expect(countKeywordOccurrences(algoText, 'Go')).toBe(0);

      const actualGoText = normalizeAtsText('Backend development using Go, Docker, and Kubernetes');
      expect(countKeywordOccurrences(actualGoText, 'Go')).toBe(1);

      const cppText = normalizeAtsText('Embedded systems with C++ memory management');
      expect(countKeywordOccurrences(cppText, 'C++')).toBe(1);

      const cAndCppText = normalizeAtsText('Embedded systems with C/C++ memory management');
      expect(countKeywordOccurrences(cAndCppText, 'C/C++')).toBe(1);
      expect(countKeywordOccurrences(cAndCppText, 'C++')).toBe(1); // C++ matches inside compound C/C++
    });

    it('extracts metrics with diverse currency symbols and units', () => {
      const resumeWithCurrencies = `
        E-Posta: test@iesu.edu.tr | Tel: 05321112233
        Özet: Finans ve Yazılım
        Deneyim:
        - ₺250.000 bütçeli Ar-Ge projesini yönetti ve %35 maliyet tasarrufu sağladı.
        - $50k değerinde uluslararası hibeyi koordine etti ve 10 kişilik ekibe liderlik etti.
        - €1.2M cirolu e-ticaret platformunda 100.000 kullanıcıya hizmet verdi.
        Eğitim: İESÜ
        Yetkinlikler: Python, SQL
        Projeler: B2B Ödeme Portalı
      `;
      const res = checkResumeAtsFormatting(resumeWithCurrencies);
      expect(res.metricsFound.length).toBeGreaterThanOrEqual(4);
      const metricsJoined = res.metricsFound.join(' ');
      expect(metricsJoined).toMatch(/₺/);
      expect(metricsJoined).toMatch(/\$/);
      expect(metricsJoined).toMatch(/€/);
      expect(metricsJoined).toMatch(/%/);
    });

    it('recognizes standard sections whether written with Turkish diacritics or plain ASCII', () => {
      const asciiResume = `
        deneyim:
        Frontend developer olarak calisti.
        egitim:
        Istanbul Esenyurt Universitesi
        ozet:
        Kariyer hedefi bulut sistemleri.
        yetkinlikler:
        React, Git, Docker
        projeler:
        Bitirme tezi ve kisisel web sitesi.
        iletisim:
        email: test@test.com, phone: 05551234567
      `;
      const res = checkResumeAtsFormatting(asciiResume);
      expect(res.detectedSections).toContain('İletişim Bilgileri');
      expect(res.detectedSections).toContain('Özet / Kariyer Hedefi');
      expect(res.detectedSections).toContain('İş & Staj Deneyimi');
      expect(res.detectedSections).toContain('Eğitim');
      expect(res.detectedSections).toContain('Yetkinlikler & Beceriler');
      expect(res.detectedSections).toContain('Projeler & Sertifikalar');
      expect(res.missingSections).toHaveLength(0);
    });
  });
});
