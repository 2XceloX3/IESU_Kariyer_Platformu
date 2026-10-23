/**
 * src/__tests__/accreditationWorkflow.unit.test.js
 * Comprehensive unit test suite for YOK / YOKAK Accreditation & Employment Reporting Engine
 */

import { describe, it, expect } from 'vitest';
import {
  calculateYokakIndicators,
  calculatePukoScorecards,
  isEmploymentInField,
  isPlacementUnder90d,
  isPlacementUnder6m,
  isPlacementUnder1y,
  normalizeTr,
  maskTCKN,
  escapeHtml,
  escapeCsvField,
  generateYokakAuditHtmlReport,
  generateYokakAuditCsv,
  SAMPLE_ACCREDITATION_DECLARATIONS,
  ACCREDITATION_STANDARDS,
  PUKO_CYCLE_STAGES,
  SALARY_BRACKETS,
} from '../services/accreditationWorkflow';
import { computeKpi } from '../kpi/compute';

describe('accreditationWorkflow Unit Tests', () => {
  describe('KVKK, XSS & CWE-1236 Formula Injection Guards', () => {
    it('maskTCKN correctly masks 11-digit TCKN preserving first 4 and last 2 digits', () => {
      expect(maskTCKN('12345678901')).toBe('1234*****01');
      expect(maskTCKN('98765432109')).toBe('9876*****09');
      expect(maskTCKN('123')).toBe('1234*****90');
      expect(maskTCKN(null)).toBe('1111*****11');
    });

    it('escapeHtml protects against Stored XSS injection', () => {
      const malicious = '<script>alert("XSS")</script>&"\'';
      const safe = escapeHtml(malicious);
      expect(safe).not.toContain('<script>');
      expect(safe).toContain('&lt;script&gt;');
      expect(safe).toContain('&amp;');
      expect(safe).toContain('&quot;');
      expect(safe).toContain('&#39;');
      expect(escapeHtml(null)).toBe('');
    });

    it('escapeCsvField protects against CWE-1236 Formula Injection', () => {
      expect(escapeCsvField('=SUM(A1:A10)')).toBe('"\'=SUM(A1:A10)"');
      expect(escapeCsvField('+cmd|calc')).toBe('"\'+cmd|calc"');
      expect(escapeCsvField('-123')).toBe('"\'-123"');
      expect(escapeCsvField('@evil')).toBe('"\'@evil"');
      expect(escapeCsvField('|calc')).toBe('"\'|calc"');
      expect(escapeCsvField('%evil')).toBe('"\'%evil"');
      expect(escapeCsvField('Normal Text')).toBe('"Normal Text"');
      expect(escapeCsvField('Text with "quotes"')).toBe('"Text with ""quotes"""');
      expect(escapeCsvField(null)).toBe('""');
    });
  });

  describe('Sectoral Alignment & In-Field Employment Determination', () => {
    it('honors explicit relatedToMajor boolean or text', () => {
      expect(isEmploymentInField({ relatedToMajor: true })).toBe(true);
      expect(isEmploymentInField({ relatedToMajor: 'Evet' })).toBe(true);
      expect(isEmploymentInField({ relatedToMajor: false })).toBe(false);
      expect(isEmploymentInField({ relatedToMajor: 'Hayır' })).toBe(false);
    });

    it('matches department to in-field sector semantics when not declared', () => {
      // Yazılım Mühendisliği -> Bilişim / Yazılım / Teknoloji
      expect(isEmploymentInField({
        department: 'Yazılım Mühendisliği',
        sector: 'Teknoloji & Yazılım',
        title: 'Backend Geliştirici'
      })).toBe(true);

      // Hemşirelik -> Sağlık / Hastane
      expect(isEmploymentInField({
        department: 'Hemşirelik',
        sector: 'Özel Hastane',
        title: 'Yoğun Bakım Hemşiresi'
      })).toBe(true);

      // İşletme -> Finans / Bankacılık
      expect(isEmploymentInField({
        department: 'İşletme',
        sector: 'Bankacılık & Finans',
        title: 'Kredi Portföy Yöneticisi'
      })).toBe(true);
    });

    it('identifies out-of-field employment correctly', () => {
      // Bilgisayar Mühendisliği mezununun perakende satış danışmanı olması
      expect(isEmploymentInField({
        department: 'Bilgisayar Mühendisliği',
        sector: 'Tekstil & Mağazacılık',
        title: 'Kasiyer'
      })).toBe(false);
    });

    it('handles Turkish uppercase/lowercase and whitespace distinctions in department names', () => {
      expect(isEmploymentInField({
        department: 'BİLGİSAYAR MÜHENDİSLİĞİ',
        sector: 'BİLİŞİM & YAZILIM',
        title: 'YAZILIM GELİŞTİRİCİ'
      })).toBe(true);

      expect(isEmploymentInField({
        department: '  işletme  ',
        sector: 'bankacılık',
        title: 'uzman'
      })).toBe(true);
    });
  });

  describe('YÖK A.1.1 Timing Determination Functions', () => {
    it('returns false for all timing indicators when graduate is unemployed', () => {
      const unemployed = { employed: false, jobTiming: '0 - 3 Ay İçinde' };
      expect(isPlacementUnder90d(unemployed)).toBe(false);
      expect(isPlacementUnder6m(unemployed)).toBe(false);
      expect(isPlacementUnder1y(unemployed)).toBe(false);
    });

    it('correctly classifies fast placement <= 90 days', () => {
      const fast = { employed: true, jobTiming: '0 - 3 Ay İçinde' };
      expect(isPlacementUnder90d(fast)).toBe(true);
      expect(isPlacementUnder6m(fast)).toBe(true);
      expect(isPlacementUnder1y(fast)).toBe(true);
    });

    it('correctly classifies 3-6 months placement (under 6m but not under 90d)', () => {
      const medium = { employed: true, jobTiming: '3 - 6 Ay İçinde' };
      expect(isPlacementUnder90d(medium)).toBe(false);
      expect(isPlacementUnder6m(medium)).toBe(true);
      expect(isPlacementUnder1y(medium)).toBe(true);
    });

    it('correctly classifies 6-12 months placement (under 1y but NOT under 6m)', () => {
      const late = {
        employed: true,
        jobTiming: '6 Ay - 1 Yıl',
        graduationDate: '2025-06-30',
        startDate: '2026-01-15' // ~199 days
      };
      expect(isPlacementUnder90d(late)).toBe(false);
      expect(isPlacementUnder6m(late)).toBe(false);
      expect(isPlacementUnder1y(late)).toBe(true);
    });
  });

  describe('YOKAK Indicators Calculation (A.1.1, Sektörel Uyum & Piramitler)', () => {
    it('correctly calculates sample metrics from SAMPLE_ACCREDITATION_DECLARATIONS', () => {
      const indicators = calculateYokakIndicators({
        declarations: SAMPLE_ACCREDITATION_DECLARATIONS,
        period: '2026-H1'
      });

      expect(indicators.status).toBe('ok');
      expect(indicators.totalAudited).toBe(20);
      expect(indicators.employedCount).toBe(18); // 20 - 2 unemployed
      expect(indicators.generalEmploymentRate).toBe(90.0); // 18 / 20 * 100

      // İlk 6 Ay ve 1 Yıl YÖK A.1.1
      expect(indicators.placement6mCount).toBeGreaterThanOrEqual(15);
      expect(indicators.placement6mRate).toBeGreaterThanOrEqual(75.0);
      expect(indicators.placement1yCount).toBeGreaterThanOrEqual(17);
      expect(indicators.placement1yRate).toBeGreaterThanOrEqual(85.0);

      // Sektörel Uyum
      expect(indicators.sectoralAlignmentCoefficient).toBeGreaterThan(0.70);
      expect(indicators.inFieldRate).toBeGreaterThan(70.0);
      expect(indicators.outOfFieldRate).toBeLessThan(30.0);

      // Maaş Piramidi (5 kademe eksiksiz)
      expect(indicators.salaryPyramid).toHaveLength(5);
      const totalPyramidCounts = indicators.salaryPyramid.reduce((a, b) => a + b.count, 0);
      expect(totalPyramidCounts).toBe(indicators.employedCount);

      // Sektör Piramidi
      expect(indicators.sectorPyramid.length).toBeGreaterThan(0);
      expect(indicators.sectorPyramid[0]).toHaveProperty('sector');
      expect(indicators.sectorPyramid[0]).toHaveProperty('percentage');

      // Çalışma Modelleri
      expect(indicators.workModeStats).toHaveProperty('ofis');
      expect(indicators.workModeStats).toHaveProperty('hibrit');
      expect(indicators.workModeStats).toHaveProperty('remote');
    });

    it('handles empty records cleanly without throwing', () => {
      const empty = calculateYokakIndicators({ declarations: [], checkupRecords: [] });
      expect(empty.status).toBe('empty');
      expect(empty.totalAudited).toBe(0);
      expect(empty.generalEmploymentRate).toBeNull();
      expect(empty.placement6mRate).toBeNull();
      expect(empty.sectoralAlignmentCoefficient).toBeNull();
      expect(empty.salaryPyramid).toHaveLength(5);
    });

    it('integrates with pure computeKpi engine for placement_6m_rate and placement_1y_rate', () => {
      const kpi6m = computeKpi('placement_6m_rate', SAMPLE_ACCREDITATION_DECLARATIONS, { period: '2026-H1' });
      expect(kpi6m.status).toBe('ok');
      expect(kpi6m.value).toBeGreaterThanOrEqual(75.0);
      expect(kpi6m.denominator).toBeGreaterThanOrEqual(10);

      const kpi1y = computeKpi('placement_1y_rate', SAMPLE_ACCREDITATION_DECLARATIONS, { period: '2026-H1' });
      expect(kpi1y.status).toBe('ok');
      expect(kpi1y.value).toBeGreaterThanOrEqual(80.0);

      const kpiSector = computeKpi('sectoral_alignment_rate', SAMPLE_ACCREDITATION_DECLARATIONS, { period: '2026-H1' });
      expect(kpiSector.status).toBe('ok');
    });
  });

  describe('PUKÖ Quality Scorecards & PDCA Closed-Loop Engine', () => {
    it('generates department scorecards with satisfaction scores and PUKO cycle stage', () => {
      const scorecards = calculatePukoScorecards({
        declarations: SAMPLE_ACCREDITATION_DECLARATIONS,
      });

      expect(scorecards.length).toBeGreaterThanOrEqual(8);
      const seDept = scorecards.find(s => s.department === 'Yazılım Mühendisliği');
      expect(seDept).toBeDefined();
      expect(seDept.alumniScore).toBeGreaterThanOrEqual(1.0);
      expect(seDept.alumniScore).toBeLessThanOrEqual(5.0);
      expect(seDept.employerScore).toBeGreaterThanOrEqual(1.0);
      expect(seDept.pukoIndex).toBeGreaterThanOrEqual(0);
      expect(seDept.pukoIndex).toBeLessThanOrEqual(100);
      expect([
        PUKO_CYCLE_STAGES.PLAN,
        PUKO_CYCLE_STAGES.DO,
        PUKO_CYCLE_STAGES.CHECK,
        PUKO_CYCLE_STAGES.ACT
      ]).toContain(seDept.pukoStatus);
    });

    it('allows custom actions to close PUKO cycle', () => {
      const customActions = {
        'Yazılım Mühendisliği': {
          status: PUKO_CYCLE_STAGES.ACT,
          isClosed: true,
          actionDecision: 'Yapay zeka ve bulut bilişim modülleri eklendi; döngü kapatıldı.'
        }
      };

      const scorecards = calculatePukoScorecards({
        declarations: SAMPLE_ACCREDITATION_DECLARATIONS,
        customActions
      });

      const seDept = scorecards.find(s => s.department === 'Yazılım Mühendisliği');
      expect(seDept.isClosed).toBe(true);
      expect(seDept.pukoStatus).toBe(PUKO_CYCLE_STAGES.ACT);
      expect(seDept.actionDecision).toContain('bulut bilişim');
    });
  });

  describe('Official Audit Document Exports (HTML/PDF & CSV)', () => {
    it('generateYokakAuditHtmlReport includes rectorate title, coordinator, approval blocks, and masked TCKN', () => {
      const indicators = calculateYokakIndicators({ declarations: SAMPLE_ACCREDITATION_DECLARATIONS });
      const scorecards = calculatePukoScorecards({ declarations: SAMPLE_ACCREDITATION_DECLARATIONS });

      const html = generateYokakAuditHtmlReport({
        indicators,
        pukoScorecards: scorecards,
        period: '2026-H1',
        reportNo: 'İESÜ-YÖKAK-2026-TEST-01'
      });

      expect(html).toContain('T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ');
      expect(html).toContain('Kariyer Geliştirme Koordinatörlüğü');
      expect(html).toContain('YÖKAK A.1.1 MEZUNİYET SONRASI İSTİHDAM PERFORMANS TABLOSU');
      expect(html).toContain('BÖLÜM BAZLI PUKÖ');
      expect(html).toContain('Raporu Tanzim Eden');
      expect(html).toContain('Kalite Güvence ve Akreditasyon Komisyonu');
      expect(html).toContain('Makam Onayı / Tasdik Eden');
      expect(html).toContain('İESÜ-YÖKAK-2026-TEST-01');

      // TCKN Masking verification in table
      expect(html).toContain('*****');
      expect(html).not.toContain('12345678901'); // raw TCKN must never appear!

      // Table row placement accuracy: not every graduate found a job in 6 months
      expect(html).toContain('pill-green');
      expect(html).toContain('pill-amber');
      expect(html).toContain('Hayır');
    });

    it('generateYokakAuditCsv starts directly with UTF-8 BOM, includes official headers and safe escaped fields', () => {
      const indicators = calculateYokakIndicators({ declarations: SAMPLE_ACCREDITATION_DECLARATIONS });
      const scorecards = calculatePukoScorecards({ declarations: SAMPLE_ACCREDITATION_DECLARATIONS });

      const csv = generateYokakAuditCsv({
        indicators,
        pukoScorecards: scorecards,
        period: '2026-H1'
      });

      // UTF-8 BOM must be directly attached to the first character (no blank newline at row 1)
      expect(csv.startsWith('\uFEFF"T.C. İSTANBUL')).toBe(true);
      const lines = csv.split('\r\n');
      expect(lines[0].startsWith('\uFEFF"T.C. İSTANBUL')).toBe(true);

      expect(csv).toContain('İSTANBUL ESENYURT ÜNİVERSİTESİ');
      expect(csv).toContain('Kariyer Geliştirme Koordinatörlüğü');
      expect(csv).toContain('İlk 6 Ayda İstihdam Oranı (YÖK A.1.1)');
      expect(csv).toContain('İlk 1 Yılda İstihdam Oranı (YÖK A.1.1)');
      expect(csv).toContain('Sektörel Uyum Katsayısı');
      expect(csv).toContain('Maskelenmiş TCKN (KVKK)');
      expect(csv).not.toContain('12345678901');

      // Verify Buse Kurt (dec 12) is NOT marked Evet for 6m, but IS marked Evet for 1y
      const buseRow = lines.find(l => l.includes('Buse Kurt'));
      expect(buseRow).toBeDefined();
      expect(buseRow).toContain(';"Hayır";"Evet";');

      // Verify Tarık Aksoy (dec 18 unemployed) is marked Hayır for both
      const tarikRow = lines.find(l => l.includes('Tarık Aksoy'));
      expect(tarikRow).toBeDefined();
      expect(tarikRow).toContain(';"Hayır";"Hayır";');
    });
  });
});
