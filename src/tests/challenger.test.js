import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  fetchIesuKariyerData,
  scrapeLiveOrFallback,
  parseIesuHtmlPayload,
  extractAnnouncements,
  extractEvents,
  extractOfficeInfo,
  MOCK_IESU_KARIYER_DATA,
  STORAGE_KEY
} from '../services/scraper.js';

describe('Adversarial Challenger Suite: Scraper Resilience, Edge Cases & Branding', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('1. Scraper Resilience & Fallback Tests', () => {
    it('1.1 Should safely handle non-string and malformed HTML inputs in parseIesuHtmlPayload', () => {
      const inputs = [
        null,
        undefined,
        12345,
        { malformed: 'object' },
        true,
        [],
        '',
        '<<<>>>bad tags syntax error!!!',
        '<div><a href="/test">Truncated HTML without closing tags',
        '<html><body><script>alert("xss")</script></body></html>'
      ];

      inputs.forEach(input => {
        const result = parseIesuHtmlPayload(input);
        expect(result).toBeDefined();
        expect(result.announcements).toBeDefined();
        expect(Array.isArray(result.announcements)).toBe(true);
        expect(result.announcements.length).toBeGreaterThan(0);
        expect(result.events).toBeDefined();
        expect(Array.isArray(result.events)).toBe(true);
        expect(result.events.length).toBeGreaterThan(0);
        expect(result.officeInfo).toBeDefined();
        expect(result.officeInfo.title).toContain('İstanbul Esenyurt Üniversitesi');
      });
    });

    it('1.2 Should trigger fallback when network timeout or AbortController occurs during scrapeLiveOrFallback', async () => {
      // Mock fetch throwing AbortError (simulating AbortController trigger / network timeout)
      const abortError = new DOMException('The operation was aborted.', 'AbortError');
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(abortError);

      const result = await scrapeLiveOrFallback({ forceRefresh: true, timeoutMs: 50 });
      expect(result).toBeDefined();
      expect(result.source).toBe('fallback');
      expect(result.status).toBe('warning');
      expect(result.announcements).toEqual(MOCK_IESU_KARIYER_DATA.announcements);
      expect(result.events).toEqual(MOCK_IESU_KARIYER_DATA.events);
      expect(result.officeInfo.title).toBe(MOCK_IESU_KARIYER_DATA.officeInfo.title);
    });

    it('1.3 Should trigger fallback when live fetch returns non-OK HTTP status code', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const result = await scrapeLiveOrFallback({ forceRefresh: true });
      expect(result.source).toBe('fallback');
      expect(result.status).toBe('warning');
      expect(result.announcements.length).toBeGreaterThan(0);
    });

    it('1.4 Should handle LocalStorage quotaExceeded and SecurityError exceptions gracefully', async () => {
      // Test localStorage getItem exception
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('Access denied', 'SecurityError');
      });

      const fetchResult = fetchIesuKariyerData();
      expect(fetchResult).toEqual(MOCK_IESU_KARIYER_DATA);

      // Test localStorage setItem QuotaExceededError during scrapeLiveOrFallback
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
      });

      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network offline'));
      const scrapeResult = await scrapeLiveOrFallback({ forceRefresh: true });
      expect(scrapeResult).toBeDefined();
      expect(scrapeResult.source).toBe('fallback');
      expect(scrapeResult.status).toBe('warning');
    });

    it('1.5 Should fallback to default data when parsing HTML with empty DOM elements or missing target selectors', () => {
      const emptyHtml = `
        <!DOCTYPE html>
        <html>
          <head><title>Empty Page</title></head>
          <body>
            <div id="container">
              <p>No announcement classes or event containers here.</p>
              <div class="duyuru-list"><li></li></div>
            </div>
          </body>
        </html>
      `;

      const result = parseIesuHtmlPayload(emptyHtml);
      expect(result.announcements).toEqual(MOCK_IESU_KARIYER_DATA.announcements);
      expect(result.events).toEqual(MOCK_IESU_KARIYER_DATA.events);
      expect(result.officeInfo.title).toBe(MOCK_IESU_KARIYER_DATA.officeInfo.title);
    });

    it('1.6 Should verify that MOCK_IESU_KARIYER_DATA contains all required schema fields and non-empty arrays', () => {
      expect(MOCK_IESU_KARIYER_DATA.officeInfo).toBeDefined();
      expect(MOCK_IESU_KARIYER_DATA.officeInfo.title).toContain('İstanbul Esenyurt Üniversitesi');
      expect(MOCK_IESU_KARIYER_DATA.officeInfo.email).toBe('kariyer@esenyurt.edu.tr');
      expect(MOCK_IESU_KARIYER_DATA.officeInfo.phone).toBe('444 9 123 / +90 (212) 699 09 90');
      expect(MOCK_IESU_KARIYER_DATA.officeInfo.address).toContain('Esenyurt / İstanbul');

      expect(Array.isArray(MOCK_IESU_KARIYER_DATA.officeInfo.coordinators)).toBe(true);
      expect(MOCK_IESU_KARIYER_DATA.officeInfo.coordinators.length).toBeGreaterThanOrEqual(2);

      expect(Array.isArray(MOCK_IESU_KARIYER_DATA.announcements)).toBe(true);
      expect(MOCK_IESU_KARIYER_DATA.announcements.length).toBeGreaterThan(0);
      MOCK_IESU_KARIYER_DATA.announcements.forEach(ann => {
        expect(ann).toHaveProperty('id');
        expect(ann).toHaveProperty('title');
        expect(ann).toHaveProperty('date');
        expect(ann).toHaveProperty('summary');
      });

      expect(Array.isArray(MOCK_IESU_KARIYER_DATA.events)).toBe(true);
      expect(MOCK_IESU_KARIYER_DATA.events.length).toBeGreaterThan(0);
      MOCK_IESU_KARIYER_DATA.events.forEach(evt => {
        expect(evt).toHaveProperty('id');
        expect(evt).toHaveProperty('title');
        expect(evt).toHaveProperty('date');
        expect(evt).toHaveProperty('location');
      });
    });
  });

  describe('2. Corporate Identity & Branding Verification', () => {
    it('2.1 Should verify :root CSS variables in src/index.css compute to İESU Nar Çiçeği Red palette', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');

      expect(cssContent).toContain('--brand-primary: #A80016');
      expect(cssContent).toContain('--brand-secondary: #800000');
      expect(cssContent).toContain('--brand-accent: #9E0B0F');
      expect(cssContent).toContain('--brand-soft-red: #FFF5F5');
      expect(cssContent).toContain('--brand-white: #FFFFFF');
    });

    it('2.2 Should verify tailwind.config.js configures colors.iesu palette correctly', () => {
      const configPath = path.resolve(process.cwd(), 'tailwind.config.js');
      const configContent = fs.readFileSync(configPath, 'utf8');

      expect(configContent).toContain('iesu:');
      expect(configContent).toContain("primary: '#990000'");
      expect(configContent).toContain("secondary: '#D32F2F'");
      expect(configContent).toContain("accent: '#FF6F61'");
      expect(configContent).toContain("soft: '#FFF5F5'");
    });

    it('2.3 Should verify mandatory corporate identity branding strings exist in fallback data and service layer', () => {
      const mockStr = JSON.stringify(MOCK_IESU_KARIYER_DATA);

      expect(mockStr).toContain('İstanbul Esenyurt Üniversitesi');
      expect(mockStr).toContain('esenyurt.edu.tr');
      expect(mockStr).toContain('Kariyer Geliştirme Ofisi Koordinatörlüğü');
    });
  });
});
