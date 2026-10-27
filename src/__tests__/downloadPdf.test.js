import { describe, it, expect, vi } from 'vitest';
import { buildReportHTML, downloadReportPdf } from '../utils/downloadPdf';

describe('Institutional UTF-8 PDF & Report Generation Suite', () => {
  it('preserves full Turkish UTF-8 characters without transliteration or ASCII mangling', () => {
    const title = 'İESÜ Çağdaş Gelişim & Bilişim Raporu';
    const lines = [
      'Öğrenci Adı: Şeyma Yağız',
      'Bölüm: Çocuk Gelişimi ve Eğitimi',
      'Yetkinlikler: Türkçe Dilbilgisi, İleri Düzey Araştırma, Çok Yönlü İletişim',
      'Açıklama: Çözüm odaklı yaklaşımıyla üniversitemizin kurumsal standartlarını karşılamaktadır.'
    ];

    const html = buildReportHTML(title, lines);

    expect(html).toContain('T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ');
    expect(html).toContain('Kariyer Geliştirme Koordinatörlüğü');
    expect(html).toContain('İESÜ Çağdaş Gelişim & Bilişim Raporu');
    expect(html).toContain('Şeyma Yağız');
    expect(html).toContain('Çocuk Gelişimi');
    expect(html).toContain('Türkçe Dilbilgisi');
    expect(html).toContain('Çözüm odaklı');
  });

  it('supports more than 46 lines without arbitrary truncation', () => {
    const title = '100 Satırlık Kapsamlı Faaliyet Raporu';
    const lines = Array.from({ length: 80 }, (_, idx) => `Madde ${idx + 1}: İESÜ Kariyer Gelişim Aktivitesi`);

    const html = buildReportHTML(title, lines);

    expect(html).toContain('Madde 1:');
    expect(html).toContain('Madde 46:');
    expect(html).toContain('Madde 47:');
    expect(html).toContain('Madde 80:');
  });

  it('safely triggers download in headless browser without throwing exceptions', async () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');

    await expect(downloadReportPdf('test_rapor', 'Test Başlığı', ['Satır 1', 'Satır 2'])).resolves.not.toThrow();

    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });
});
