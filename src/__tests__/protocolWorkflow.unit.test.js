import { describe, it, expect } from 'vitest';
import {
  PROTOCOL_STANDARDS,
  PROTOCOL_TYPES,
  PROTOCOL_STATUS,
  PROTOCOL_STATUS_LABELS,
  PROTOCOL_SECTORS,
  generateProtocolCode,
  validateProtocolCode,
  getDaysUntilExpiration,
  calculateProtocolStatus,
  calculateQuotaFulfillment,
  calculateProtocolAggregateStats,
  matchCandidateWithESBIM,
  matchSectorMentor,
  SAMPLE_CORPORATE_PROTOCOLS,
  SAMPLE_SECTOR_MENTORS,
  SAMPLE_ESBIM_EVENTS,
  SAMPLE_ISKUR_JOB_CLUB_COHORTS,
  generateSenateProtocolHtmlReport,
  generateSenateProtocolCsv,
} from '../services/protocolWorkflow';

describe('Kurumsal Protokol & Sanayi CRM Workflow Motoru (Unit Tests)', () => {
  describe('1. Kurumsal Kimlik & Standartlar (AGENTS.md Compliance)', () => {
    it('Resmî kurum adı ve koordinatörlük unvanlarını eksiksiz içerir', () => {
      expect(PROTOCOL_STANDARDS.INSTITUTION_NAME).toBe('İstanbul Esenyurt Üniversitesi (İESÜ)');
      expect(PROTOCOL_STANDARDS.RECTORATE_TITLE).toBe('T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ');
      expect(PROTOCOL_STANDARDS.COORDINATOR_UNIT).toBe('Kariyer Geliştirme Koordinatörlüğü');
      expect(PROTOCOL_STANDARDS.ALUMNI_PORTAL_NAME).toBe('İESÜ Mezunlar Portalı');
      expect(PROTOCOL_STANDARDS.ESBIM_PARTNER).toContain('Esenyurt Belediyesi İstihdam Merkezi');
      expect(PROTOCOL_STANDARDS.ISKUR_PARTNER).toContain('Türkiye İş Kurumu (İŞKUR)');
      expect(PROTOCOL_STANDARDS.DAYS_EXPIRING_SOON_THRESHOLD).toBe(30);
    });

    it('Resmî protokol türleri eksiksiz tanımlıdır', () => {
      expect(PROTOCOL_TYPES.COOPERATION).toBe('İş Birliği Protokolü');
      expect(PROTOCOL_TYPES.APPLIED_EDUCATION_7_PLUS_1).toBe('7+1 / 3+1 İşletmede Mesleki Eğitim');
      expect(PROTOCOL_TYPES.ISKUR_JOB_CLUB).toBe('İŞKUR İş Kulübü & İstihdam Masası');
      expect(PROTOCOL_TYPES.ESBİM_LOCAL_DESK).toBe('ESBİM Yerel İstihdam Masası');
      expect(PROTOCOL_TYPES.RND_TECHNOPARK).toBe('AR-GE & Teknokent Ortaklığı');
      expect(PROTOCOL_TYPES.SECTOR_ADVISORY).toBe('Sektörel Danışma Kurulu & Hami Eşleşmesi');
    });

    it('Protokol durum etiketleri doğru Türkçe karşılıkları içerir', () => {
      expect(PROTOCOL_STATUS_LABELS[PROTOCOL_STATUS.ACTIVE]).toBe('Aktif Protokol');
      expect(PROTOCOL_STATUS_LABELS[PROTOCOL_STATUS.EXPIRING_SOON]).toBe('Süresi Yaklaşan (Son 30 Gün)');
      expect(PROTOCOL_STATUS_LABELS[PROTOCOL_STATUS.RENEWAL_REQUESTED]).toBe('Yenileme Talep Edildi');
      expect(PROTOCOL_STATUS_LABELS[PROTOCOL_STATUS.EXPIRED]).toBe('Süresi Doldu');
      expect(PROTOCOL_STATUS_LABELS[PROTOCOL_STATUS.TERMINATED]).toBe('Feshedildi / Askıda');
    });
  });

  describe('2. Protokol Kodu Üretici & Doğrulayıcı', () => {
    it('Geçerli protokol kodları üretir', () => {
      expect(generateProtocolCode(1, 2026)).toBe('IESU-PRT-2026-001');
      expect(generateProtocolCode(42, 2026)).toBe('IESU-PRT-2026-042');
      expect(generateProtocolCode(150, 2026)).toBe('IESU-PRT-2026-150');
      expect(generateProtocolCode(9999, 2025)).toBe('IESU-PRT-2025-9999');
    });

    it('Hatalı veya eksik parametrelerde güvenli varsayılanlar kullanır', () => {
      expect(generateProtocolCode(null, 2026)).toBe('IESU-PRT-2026-001');
      expect(generateProtocolCode(-5, 2026)).toBe('IESU-PRT-2026-001');
      expect(generateProtocolCode('abc', 2026)).toBe('IESU-PRT-2026-001');
    });

    it('Protokol kodlarını doğrular', () => {
      expect(validateProtocolCode('IESU-PRT-2026-001')).toBe(true);
      expect(validateProtocolCode('IESU-PRT-2024-999')).toBe(true);
      expect(validateProtocolCode('IESU-PRT-2027-1002')).toBe(true);

      expect(validateProtocolCode('PRT-2026-001')).toBe(false);
      expect(validateProtocolCode('IESU-PRT-26-01')).toBe(false);
      expect(validateProtocolCode('')).toBe(false);
      expect(validateProtocolCode(null)).toBe(false);
      expect(validateProtocolCode(undefined)).toBe(false);
    });
  });

  describe('3. Kalan Gün & Dinamik Protokol Durum Motoru', () => {
    const fixedRef = new Date('2026-05-01T12:00:00Z');

    it('Kalan gün sayısını hatasız hesaplar', () => {
      expect(getDaysUntilExpiration('2026-05-15', fixedRef)).toBe(14);
      expect(getDaysUntilExpiration('2026-05-31', fixedRef)).toBe(30);
      expect(getDaysUntilExpiration('2026-05-01', fixedRef)).toBe(0);
      expect(getDaysUntilExpiration('2026-04-20', fixedRef)).toBe(-11);
      expect(getDaysUntilExpiration(null, fixedRef)).toBe(null);
      expect(getDaysUntilExpiration('invalid-date', fixedRef)).toBe(null);
    });

    it('Feshedilmiş veya yenileme bekleyen durumları doğrudan tanır', () => {
      expect(calculateProtocolStatus({ status: 'TERMINATED', validUntil: '2028-01-01' }, fixedRef))
        .toBe(PROTOCOL_STATUS.TERMINATED);
      expect(calculateProtocolStatus({ status: 'Feshedildi', validUntil: '2028-01-01' }, fixedRef))
        .toBe(PROTOCOL_STATUS.TERMINATED);
      expect(calculateProtocolStatus({ status: 'RENEWAL_REQUESTED', validUntil: '2028-01-01' }, fixedRef))
        .toBe(PROTOCOL_STATUS.RENEWAL_REQUESTED);
      expect(calculateProtocolStatus({ status: 'Yenileme Bekliyor', validUntil: '2028-01-01' }, fixedRef))
        .toBe(PROTOCOL_STATUS.RENEWAL_REQUESTED);
    });

    it('Tarihe göre EXPIRED, EXPIRING_SOON ve ACTIVE durumlarını belirler', () => {
      // Geçmiş tarih -> EXPIRED
      expect(calculateProtocolStatus({ validUntil: '2026-04-30' }, fixedRef))
        .toBe(PROTOCOL_STATUS.EXPIRED);

      // Tam bugün -> EXPIRING_SOON (0 gün)
      expect(calculateProtocolStatus({ validUntil: '2026-05-01' }, fixedRef))
        .toBe(PROTOCOL_STATUS.EXPIRING_SOON);

      // Son 30 gün içinde (örn 15 gün sonra) -> EXPIRING_SOON
      expect(calculateProtocolStatus({ validUntil: '2026-05-16' }, fixedRef))
        .toBe(PROTOCOL_STATUS.EXPIRING_SOON);

      // Tam 30 gün sonra -> EXPIRING_SOON
      expect(calculateProtocolStatus({ validUntil: '2026-05-31' }, fixedRef))
        .toBe(PROTOCOL_STATUS.EXPIRING_SOON);

      // 31+ gün sonra -> ACTIVE
      expect(calculateProtocolStatus({ validUntil: '2026-06-05' }, fixedRef))
        .toBe(PROTOCOL_STATUS.ACTIVE);
      expect(calculateProtocolStatus({ validUntil: '2027-12-31' }, fixedRef))
        .toBe(PROTOCOL_STATUS.ACTIVE);
    });

    it('Geçersiz protokol nesnelerinde ACTIVE geri döner', () => {
      expect(calculateProtocolStatus(null)).toBe(PROTOCOL_STATUS.ACTIVE);
      expect(calculateProtocolStatus({})).toBe(PROTOCOL_STATUS.ACTIVE);
    });
  });

  describe('4. Kontenjan Gerçekleşme ve CRM İstatistikleri', () => {
    it('Standart kontenjan doluluk oranını ve kalan kontenjanı hesaplar', () => {
      const q = calculateQuotaFulfillment(25, 18);
      expect(q.committedQuota).toBe(25);
      expect(q.placedCount).toBe(18);
      expect(q.fillRate).toBe(72);
      expect(q.remainingQuota).toBe(7);
      expect(q.isOverCapacity).toBe(false);
    });

    it('Kapasite aşımı durumunu tespit eder', () => {
      const q = calculateQuotaFulfillment(20, 25);
      expect(q.fillRate).toBe(125);
      expect(q.remainingQuota).toBe(0);
      expect(q.isOverCapacity).toBe(true);
    });

    it('Taahhüt sıfır veya negatif verildiğinde çökmeyi engeller', () => {
      const qZero = calculateQuotaFulfillment(0, 0);
      expect(qZero.fillRate).toBe(0);
      expect(qZero.remainingQuota).toBe(0);

      const qBonus = calculateQuotaFulfillment(0, 5);
      expect(qBonus.fillRate).toBe(100);
      expect(qBonus.isOverCapacity).toBe(true);

      const qNegative = calculateQuotaFulfillment(-10, -5);
      expect(qNegative.committedQuota).toBe(0);
      expect(qNegative.placedCount).toBe(0);
    });

    it('calculateProtocolAggregateStats havuz istatistiklerini doğru toplar', () => {
      const stats = calculateProtocolAggregateStats(SAMPLE_CORPORATE_PROTOCOLS);
      expect(stats.totalProtocols).toBe(10);
      expect(stats.totalCommittedQuota).toBeGreaterThan(0);
      expect(stats.totalPlacedCount).toBeGreaterThan(0);
      expect(stats.overallFillRate).toBeGreaterThan(50);
      expect(stats.overallFillRate).toBeLessThanOrEqual(100);

      // Sektör bazlı döküm
      expect(stats.bySector['Savunma Sanayii']).toBeDefined();
      expect(stats.bySector['Savunma Sanayii'].count).toBe(2);

      // Tür bazlı döküm
      expect(stats.byType[PROTOCOL_TYPES.COOPERATION]).toBeDefined();
      expect(stats.byType[PROTOCOL_TYPES.ESBİM_LOCAL_DESK]).toBeDefined();

      // Durum sayıları
      expect(stats.byStatus[PROTOCOL_STATUS.ACTIVE]).toBeGreaterThan(0);
    });
  });

  describe('5. İŞKUR & ESBİM Entegrasyon Köprüsü Algoritmaları', () => {
    it('Adayı lokasyon ve bölüme göre ESBİM açık pozisyonlarıyla eşleştirir', () => {
      const candidate = {
        name: 'Deniz Can',
        department: 'Lojistik Yönetimi',
        district: 'Esenyurt',
        city: 'İstanbul',
      };

      const vacancies = [
        { id: 'v1', title: 'Lojistik Depo Operatörü', field: 'Lojistik', district: 'Esenyurt', city: 'İstanbul' },
        { id: 'v2', title: 'Yazılım Destek Uzmanı', field: 'Bilişim', district: 'Kadıköy', city: 'İstanbul' },
        { id: 'v3', title: 'Tedarik Zinciri Asistanı', field: 'Lojistik', district: 'Beylikdüzü', city: 'İstanbul' },
      ];

      const matches = matchCandidateWithESBIM(candidate, vacancies);
      expect(matches).toHaveLength(3);
      // En yüksek eşleşme Esenyurt + Lojistik olmalı
      expect(matches[0].vacancy.id).toBe('v1');
      expect(matches[0].matchScore).toBe(100); // 50 taban + 25 ilçe + 25 alan
      expect(matches[0].isRecommended).toBe(true);

      // Kadıköy + Bilişim en düşük olmalı
      expect(matches[2].vacancy.id).toBe('v2');
      expect(matches[2].matchScore).toBe(60); // 50 taban + 10 il
      expect(matches[2].isRecommended).toBe(false);
    });

    it('Boş verilerde ESBİM eşleştirmesi güvenli boş dizi döner', () => {
      expect(matchCandidateWithESBIM(null, [])).toEqual([]);
      expect(matchCandidateWithESBIM({}, null)).toEqual([]);
    });

    it('Sektör hamisi ve danışma kurulu eşleşmesini doğru değerlendirir', () => {
      const mentor = SAMPLE_SECTOR_MENTORS[0]; // Dr. Mehmet Yılmaz - Aselsan, Savunma Sanayii, Bilgisayar Mühendisliği
      expect(matchSectorMentor(mentor, 'Savunma Sanayii')).toBe(true);
      expect(matchSectorMentor(mentor, 'Bilgisayar Mühendisliği')).toBe(true);
      expect(matchSectorMentor(mentor, 'Radar Sistemleri')).toBe(true);
      expect(matchSectorMentor(mentor, 'Gastronomi')).toBe(false);
    });

    it('Boş sektör veya boş departman içeren mentörlerde körlemesine eşleşmeyi engeller (Edge Case)', () => {
      const emptyMentor = {
        name: 'Ali Veli',
        sector: '',
        assignedDepartment: '',
        expertise: [],
      };
      expect(matchSectorMentor(emptyMentor, 'Bilişim')).toBe(false);
      expect(matchSectorMentor(emptyMentor, 'Mühendislik')).toBe(false);
      expect(matchSectorMentor(emptyMentor, '')).toBe(false);
      expect(matchSectorMentor(null, 'Bilişim')).toBe(false);
    });

    it('ESBİM açık pozisyonlar havuzunda null elemanlar olsa dahi çökmeyi engeller', () => {
      const candidate = { department: 'Lojistik', district: 'Esenyurt' };
      const corruptedVacancies = [
        null,
        undefined,
        { id: 'v1', title: 'Lojistik Sorumlusu', field: 'Lojistik', district: 'Esenyurt' },
      ];
      const matches = matchCandidateWithESBIM(candidate, corruptedVacancies);
      expect(matches).toHaveLength(1);
      expect(matches[0].vacancy.id).toBe('v1');
    });
  });

  describe('6. Senato & Rektörlük Protokol Raporu İhracı (PDF & CSV)', () => {
    it('Resmî HTML Senato Raporu üretir ve gerekli tüm kurumsal blokları içerir', () => {
      const html = generateSenateProtocolHtmlReport({
        protocols: SAMPLE_CORPORATE_PROTOCOLS,
        sectorMentors: SAMPLE_SECTOR_MENTORS,
        esbimEvents: SAMPLE_ESBIM_EVENTS,
        iskurCohorts: SAMPLE_ISKUR_JOB_CLUB_COHORTS,
        period: '2025-2026 Akademik Yılı',
        reportNo: 'İESÜ-TEST-PRT-001',
      });

      expect(html).toContain('T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ');
      expect(html).toContain('Kariyer Geliştirme Koordinatörlüğü');
      expect(html).toContain('İESÜ-TEST-PRT-001');
      expect(html).toContain('Aselsan A.Ş.');
      expect(html).toContain('Baykar Teknoloji');
      expect(html).toContain('Esenyurt Belediyesi İstihdam Merkezi (ESBİM)');
      expect(html).toContain('Türkiye İş Kurumu (İŞKUR)');
      expect(html).toContain('Prof. Dr. Süleyman Özdemir');
      expect(html).toContain('window.print()');
    });

    it('Parametresiz çağrıldığında generateSenateProtocolHtmlReport güvenli varsayılanlarla çalışır', () => {
      expect(() => generateSenateProtocolHtmlReport()).not.toThrow();
      const html = generateSenateProtocolHtmlReport();
      expect(html).toContain('T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ');
    });

    it('Resmî CSV Senato Raporu UTF-8 BOM, sep=; direktifi ve noktalı virgül ile formatlanır', () => {
      const csv = generateSenateProtocolCsv({
        protocols: SAMPLE_CORPORATE_PROTOCOLS,
        sectorMentors: SAMPLE_SECTOR_MENTORS,
        period: '2025-2026 Akademik Yılı',
        reportNo: 'İESÜ-TEST-PRT-CSV',
      });

      // UTF-8 BOM kontrolü (\uFEFF)
      expect(csv.charCodeAt(0)).toBe(0xFEFF);

      // Excel otomatik ayırıcı direktifi (sep=;)
      expect(csv).toContain('sep=;');

      expect(csv).toContain('T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ');
      expect(csv).toContain('RESMÎ SENATO KURUMSAL PROTOKOL & SANAYİ CRM KÜTÜĞÜ');
      expect(csv).toContain('IESU-PRT-2026-001');
      expect(csv).toContain('Aselsan A.Ş.');
      expect(csv).toContain('SEKTÖREL DANIŞMA KURULU VE SANAYİ HAMİLERİ');
      expect(csv).toContain('Dr. Mehmet Yılmaz');
    });

    it('Parametresiz çağrıldığında generateSenateProtocolCsv güvenli varsayılanlarla çalışır', () => {
      expect(() => generateSenateProtocolCsv()).not.toThrow();
      const csv = generateSenateProtocolCsv();
      expect(csv).toContain('sep=;');
      expect(csv).toContain('T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ');
    });
  });

  describe('7. Derin Sınır Değerleri & Tarih Saat Dilimi / Artık Yıl Testleri', () => {
    it('Artık yıl 29 Şubat tarihlerinde kalan gün sayısını hatasız hesaplar', () => {
      const refLeap = new Date('2028-02-15T12:00:00Z');
      expect(getDaysUntilExpiration('2028-02-29', refLeap)).toBe(14);
      expect(getDaysUntilExpiration('2028-03-01', refLeap)).toBe(15);
    });

    it('Tarihi olmayan ancak manuel EXPIRED veya SÜRESİ DOLDU işaretli protokolleri doğru tanır', () => {
      expect(calculateProtocolStatus({ status: 'EXPIRED' })).toBe(PROTOCOL_STATUS.EXPIRED);
      expect(calculateProtocolStatus({ status: 'SÜRESİ DOLDU' })).toBe(PROTOCOL_STATUS.EXPIRED);
      expect(calculateProtocolStatus({ status: 'PASİF' })).toBe(PROTOCOL_STATUS.EXPIRED);
      expect(calculateProtocolStatus({ status: 'Feshedildi' })).toBe(PROTOCOL_STATUS.TERMINATED);
    });

    it('calculateProtocolAggregateStats null / bozuk eleman içeren dizileri güvenle eler ve çökmez', () => {
      const corruptedList = [
        null,
        undefined,
        'corrupted-string',
        { protocolCode: 'PRT-1', companyName: 'X', committedQuota: 10, placedCount: 5, validUntil: '2027-01-01' },
      ];
      expect(() => calculateProtocolAggregateStats(corruptedList)).not.toThrow();
      const stats = calculateProtocolAggregateStats(corruptedList);
      expect(stats.totalProtocols).toBe(1);
      expect(stats.totalCommittedQuota).toBe(10);
      expect(stats.totalPlacedCount).toBe(5);
    });
  });
});
