import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchIesuKariyerData,
  scrapeLiveOrFallback,
  parseIesuHtmlPayload,
  parseIesuRssXml,
  deduplicateFeedItems,
  cleanScrapedText,
  extractAnnouncements,
  extractEvents,
  extractOfficeInfo,
  MOCK_IESU_KARIYER_DATA,
  STORAGE_KEY
} from '../services/scraper.js';

describe('İESU Kariyer Web Scraper Engine & Data Pipeline', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('fetchIesuKariyerData', () => {
    it('should return MOCK_IESU_KARIYER_DATA when localStorage is empty', () => {
      const data = fetchIesuKariyerData();
      expect(data).toBeDefined();
      expect(data.officeInfo.title).toContain('İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi');
      expect(data.announcements.length).toBeGreaterThan(0);
      expect(data.events.length).toBeGreaterThan(0);
      expect(data.source).toBe('fallback');
    });

    it('should return cached data if fresh (less than 1 hour old)', () => {
      const cachedPayload = {
        officeInfo: { ...MOCK_IESU_KARIYER_DATA.officeInfo, title: 'Cached Office Title' },
        announcements: [{ id: 'cached-1', title: 'Cached Announcement', date: '2026-03-01', category: 'General', summary: 'Summary', content: 'Content', link: '#' }],
        events: [],
        lastUpdated: new Date().toISOString(),
        source: 'live',
        status: 'success'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedPayload));

      const result = fetchIesuKariyerData();
      expect(result.officeInfo.title).toBe('Cached Office Title');
      expect(result.source).toBe('live');
      expect(result.announcements[0].title).toBe('Cached Announcement');
    });

    it('should return fallback data if cached data is expired', () => {
      const expiredDate = new Date(Date.now() - (2 * 60 * 60 * 1000)).toISOString(); // 2 hours old
      const expiredPayload = {
        officeInfo: { ...MOCK_IESU_KARIYER_DATA.officeInfo, title: 'Old Title' },
        announcements: [],
        events: [],
        lastUpdated: expiredDate,
        source: 'live',
        status: 'success'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expiredPayload));

      const result = fetchIesuKariyerData();
      expect(result).toEqual(MOCK_IESU_KARIYER_DATA);
    });

    it('should gracefully handle localStorage getItem errors', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError: LocalStorage disabled');
      });

      const result = fetchIesuKariyerData();
      expect(result).toEqual(MOCK_IESU_KARIYER_DATA);
    });
  });

  describe('scrapeLiveOrFallback', () => {
    it('should return fallback payload when live fetch fails (network/offline error)', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error / CODE_ONLY environment'));

      const result = await scrapeLiveOrFallback({ forceRefresh: true, timeoutMs: 100 });
      expect(result).toBeDefined();
      expect(result.source).toBe('fallback');
      expect(result.status).toBe('warning');
      expect(result.officeInfo.title).toBe(MOCK_IESU_KARIYER_DATA.officeInfo.title);
      expect(result.announcements).toBeDefined();
      expect(result.announcements.length).toBeGreaterThan(0);
    });

    it('should return parsed payload when live fetch succeeds', async () => {
      const mockHtml = `
        <!DOCTYPE html>
        <html>
          <head><title>İESU Kariyer</title></head>
          <body>
            <h1 class="page-title">İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi Koordinatörlüğü</h1>
            <div class="page-content">Kariyer Ofisi resmi duyuruları ve etkinlikleri.</div>
            <ul class="duyuru-list">
              <li>
                <a href="/duyuru/101">2026 Kariyer Zirvesi Kayıtları Açıldı</a>
                <span class="date">2026-04-01</span>
              </li>
            </ul>
          </body>
        </html>
      `;

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => mockHtml
      });

      const result = await scrapeLiveOrFallback({ forceRefresh: true });
      expect(result.source).toBe('live');
      expect(result.status).toBe('success');
      expect(result.announcements[0].title).toBe('2026 Kariyer Zirvesi Kayıtları Açıldı');
      expect(['https://www.esenyurt.edu.tr/duyuru/101', '/duyuru/101']).toContain(result.announcements[0].link);
    });

    it('should use cached live data if forceRefresh is false', async () => {
      const cachedPayload = {
        officeInfo: MOCK_IESU_KARIYER_DATA.officeInfo,
        announcements: MOCK_IESU_KARIYER_DATA.announcements,
        events: MOCK_IESU_KARIYER_DATA.events,
        lastUpdated: new Date().toISOString(),
        source: 'live',
        status: 'success'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedPayload));

      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      const result = await scrapeLiveOrFallback({ forceRefresh: false });

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(result.source).toBe('live');
    });
  });

  describe('parseIesuHtmlPayload and HTML extractors', () => {
    it('should parse announcement list items correctly', () => {
      const html = `
        <div class="announcement-item">
          <a href="https://www.esenyurt.edu.tr/duyuru/staj-2026">2026 Zorunlu Staj Başvuru Duyurusu</a>
          <span class="date">2026-03-20</span>
          <p class="summary">Staj evraklarının teslim tarihi duyurulmuştur.</p>
        </div>
      `;
      const parsed = parseIesuHtmlPayload(html);
      expect(parsed.announcements.length).toBe(1);
      expect(parsed.announcements[0].title).toBe('2026 Zorunlu Staj Başvuru Duyurusu');
      expect(parsed.announcements[0].link).toBe('https://www.esenyurt.edu.tr/duyuru/staj-2026');
      expect(parsed.announcements[0].date).toBe('2026-03-20');
      expect(parsed.announcements[0].summary).toBe('Staj evraklarının teslim tarihi duyurulmuştur.');
    });

    it('should parse event items correctly', () => {
      const html = `
        <div class="etkinlik-list">
          <div class="etkinlik-item">
            <h4 class="title">CV Hazırlama ve Mülakat Teknikleri Semineri</h4>
            <span class="event-date">2026-04-10 13:00</span>
            <span class="location">Konferans Salonu</span>
            <span class="speaker">Ayşe Yılmaz</span>
          </div>
        </div>
      `;
      const parsed = parseIesuHtmlPayload(html);
      expect(parsed.events.length).toBe(1);
      expect(parsed.events[0].title).toBe('CV Hazırlama ve Mülakat Teknikleri Semineri');
      expect(parsed.events[0].date).toBe('2026-04-10 13:00');
      expect(parsed.events[0].location).toBe('Konferans Salonu');
      expect(parsed.events[0].speaker).toBe('Ayşe Yılmaz');
    });

    it('should extract office info title and description from page content', () => {
      const html = `
        <div>
          <h1 class="page-title">İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi</h1>
          <div class="page-content">Öğrencilerimiz için kariyer olanakları ve staj rehberliği.</div>
        </div>
      `;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const info = extractOfficeInfo(doc, html);

      expect(info.title).toBe('İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi');
      expect(info.description).toBe('Öğrencilerimiz için kariyer olanakları ve staj rehberliği.');
      expect(info.coordinators.length).toBe(2);
    });

    it('should fallback to mock data when HTML payload is empty or invalid', () => {
      const parsed = parseIesuHtmlPayload('');
      expect(parsed.officeInfo.title).toBe(MOCK_IESU_KARIYER_DATA.officeInfo.title);
      expect(parsed.announcements).toEqual(MOCK_IESU_KARIYER_DATA.announcements);
      expect(parsed.events).toEqual(MOCK_IESU_KARIYER_DATA.events);
    });
  });

  describe('parseIesuRssXml and deduplicateFeedItems', () => {
    it('should parse RSS 2.0 XML into news, events, and announcements', () => {
      const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>İstanbul Esenyurt Üniversitesi RSS</title>
            <item>
              <title><![CDATA[İESÜ Bahar Kariyer Sempozyumu ve Sektör Buluşması]]></title>
              <link>https://www.esenyurt.edu.tr/etkinlik/bahar-kariyer-sempozyumu</link>
              <pubDate>Wed, 15 Apr 2026 10:00:00 GMT</pubDate>
              <category>Etkinlik</category>
              <description><![CDATA[<p>Sektör liderleriyle kariyer buluşması.</p>]]></description>
            </item>
            <item>
              <title>2026 Yaz Stajı Başvuru Takvimi Duyurusu</title>
              <link>/duyuru/yaz-staji-2026</link>
              <pubDate>Mon, 13 Apr 2026 09:00:00 GMT</pubDate>
              <category>Duyuru</category>
              <description>Zorunlu yaz stajı takvimi açıklanmıştır.</description>
            </item>
            <item>
              <title>Üniversitemiz TÜBİTAK 2209-A Projelerinde Rekor Kırdı</title>
              <link>https://www.esenyurt.edu.tr/haber/tubitak-rekoru</link>
              <pubDate>Sun, 12 Apr 2026 08:00:00 GMT</pubDate>
              <category>Haber</category>
              <description>Öğrencilerimizin araştırma projeleri kabul edildi.</description>
            </item>
          </channel>
        </rss>`;

      const parsed = parseIesuRssXml(rssXml);
      expect(parsed.events.length).toBe(1);
      expect(parsed.events[0].title).toBe('İESÜ Bahar Kariyer Sempozyumu ve Sektör Buluşması');
      expect(parsed.announcements.length).toBe(1);
      expect(parsed.announcements[0].link).toBe('https://www.esenyurt.edu.tr/duyuru/yaz-staji-2026');
      expect(parsed.news.length).toBe(1);
      expect(parsed.news[0].title).toBe('Üniversitemiz TÜBİTAK 2209-A Projelerinde Rekor Kırdı');
    });

    it('should deduplicate feed items by normalized title and preserve order', () => {
      const existing = [
        { id: '1', title: 'İESÜ Kariyer Günleri Başladı', url: 'https://www.esenyurt.edu.tr/1' },
        { id: '2', title: 'Teknofest Başvuruları', url: 'https://www.esenyurt.edu.tr/2' }
      ];
      const incoming = [
        { id: 'new-1', title: '<b>İESÜ Kariyer Günleri Başladı</b>', url: 'https://www.esenyurt.edu.tr/1-updated' },
        { id: 'new-3', title: 'Yeni Sanayi İş Birliği Protokolü', url: 'https://www.esenyurt.edu.tr/3' }
      ];

      const merged = deduplicateFeedItems(existing, incoming, 10);
      expect(merged.length).toBe(3);
      expect(merged[0].id).toBe('new-1');
      expect(merged[1].id).toBe('new-3');
      expect(merged[2].id).toBe('2');
      expect(cleanScrapedText('<p>Merhaba &amp; Dünya</p>')).toBe('Merhaba & Dünya');
    });
  });
});
