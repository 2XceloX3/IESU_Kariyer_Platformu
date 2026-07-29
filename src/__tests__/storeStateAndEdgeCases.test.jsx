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
});
