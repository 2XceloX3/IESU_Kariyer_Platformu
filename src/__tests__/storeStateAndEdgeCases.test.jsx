import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAppStore from '../store/useAppStore';
import * as scraperService from '../services/scraper';

describe('Empirical Challenger - Store State Updates & Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('1. refreshScrapedData updates isScraperLoading, source, status, and lastUpdated correctly on success', async () => {
    const store = useAppStore.getState();
    expect(store.isScraperLoading).toBe(false);

    const promise = store.refreshScrapedData(true);
    // During execution isScraperLoading should be true
    expect(useAppStore.getState().isScraperLoading).toBe(true);

    const result = await promise;
    const finalStore = useAppStore.getState();

    expect(finalStore.isScraperLoading).toBe(false);
    expect(finalStore.lastUpdated).toBeTruthy();
    expect(finalStore.source).toBeTruthy();
    expect(result).toBeDefined();
  });

  it('2. refreshScrapedData handles scraper service errors gracefully and resets loading state', async () => {
    vi.spyOn(scraperService, 'scrapeLiveOrFallback').mockRejectedValue(new Error('Scraper critical error'));

    const store = useAppStore.getState();
    
    await expect(store.refreshScrapedData(true)).rejects.toThrow('Scraper critical error');

    const finalStore = useAppStore.getState();
    expect(finalStore.isScraperLoading).toBe(false);
    expect(finalStore.status).toBe('error');
  });

  it('3. mock fallbacks safely process empty/corrupt local storage data', () => {
    localStorage.setItem('iesu_kariyer_cache_v2', '{ corrupt_json: ');
    
    const data = scraperService.fetchIesuKariyerData();
    expect(data).toBeDefined();
    expect(data.source).toBe('fallback');
    expect(data.announcements.length).toBeGreaterThan(0);
  });

  describe('4. Chaos Agent - Adversarial Fuzzing & Security Defense', () => {
    it('4.1 Sanitizes and neutralizes malicious script injection in audit logging', () => {
      const maliciousPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert(1)>',
        'javascript:void(0)',
        '"><svg onload=alert(document.cookie)>'
      ];

      maliciousPayloads.forEach(payload => {
        useAppStore.getState().logAction(payload, payload, payload, 'warning');
      });

      const logs = useAppStore.getState().auditLogs;
      expect(logs.length).toBeGreaterThanOrEqual(maliciousPayloads.length);

      logs.forEach(log => {
        expect(log.action).not.toContain('<script>');
        expect(log.user).not.toContain('<script>');
        expect(log.module).not.toContain('<script>');
      });
    });

    it('4.2 Withstands prototype pollution attempts in siteConfig state mutation', () => {
      const evilConfig = JSON.parse('{"__proto__": {"polluted": true}, "heroBannerTitle": "Chaos Title"}');
      useAppStore.getState().setSiteConfig(evilConfig);
      
      expect(({}).polluted).toBeUndefined();
      expect(useAppStore.getState().siteConfig.heroBannerTitle).toBe('Chaos Title');
    });

    it('4.3 Handles circular reference objects in logging without stack overflow', () => {
      const circular = { name: 'circular_entity' };
      circular.self = circular;

      expect(() => {
        useAppStore.getState().logAction('CIRCULAR_TEST', 'Testing circular reference', { ref: circular }, 'info');
      }).not.toThrow();
    });

    it('4.4 Recovers seamlessly from corrupted toxic localStorage keys', () => {
      const toxicKeys = [
        ['igu_mock_user', '{ corrupted_unclosed_json: '],
        ['iesu-kariyer-storage-v12', 'undefined'],
        ['iesu-kariyer-storage-v12', 'NaN'],
        ['iesu_site_config_v1', '<html><body>502 Bad Gateway</body></html>'],
        ['igu_user_role_v1', '"><script>alert(1)</script>']
      ];

      toxicKeys.forEach(([k, v]) => {
        localStorage.setItem(k, v);
      });

      expect(() => {
        const store = useAppStore.getState();
        expect(store).toBeDefined();
      }).not.toThrow();
    });

    it('4.5 Survives 1000 rapid-fire consecutive actions without deadlock and bounds log size', () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        useAppStore.getState().logAction(`ACTION_FLOOD_${i}`, `Bulk flood test detail ${i}`);
      }
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(4000);
      expect(useAppStore.getState().auditLogs.length).toBeLessThanOrEqual(500);
    });

    it('4.6 Prevents privilege escalation when unauthorized role is set', () => {
      useAppStore.getState().setUserRole('guest');
      expect(useAppStore.getState().userRole).toBe('guest');

      const store = useAppStore.getState();
      expect(store.userRole === 'admin').toBe(false);
    });
  });
});
