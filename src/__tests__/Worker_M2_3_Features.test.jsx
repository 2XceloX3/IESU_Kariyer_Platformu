import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import useAppStore from '../store/useAppStore';
import { extractAnnouncements, extractEvents } from '../services/scraper';
import { liveNewsData } from '../utils/liveData';

describe('Worker 2.3 Feature Implementations', () => {
  it('1. refreshScrapedData action exists and updates store state', async () => {
    const store = useAppStore.getState();
    expect(typeof store.refreshScrapedData).toBe('function');
    
    const result = await store.refreshScrapedData(true);
    expect(result).toBeTruthy();
    
    const updatedStore = useAppStore.getState();
    expect(updatedStore.isScraperLoading).toBe(false);
    expect(updatedStore.lastUpdated).toBeTruthy();
    expect(updatedStore.source).toBeTruthy();
  });

  it('2. extractAnnouncements extracts imageUrl property', () => {
    const html = `
      <div class="duyuru-list">
        <li>
          <a href="/duyuru/101">Test Duyuru Title</a>
          <img src="/uploads/test.jpg" />
          <span class="date">2026-07-25</span>
        </li>
      </div>
    `;
    let doc = null;
    if (typeof DOMParser !== 'undefined') {
      doc = new DOMParser().parseFromString(html, 'text/html');
    }
    const announcements = extractAnnouncements(doc, html);
    expect(announcements.length).toBeGreaterThan(0);
    expect(announcements[0]).toHaveProperty('imageUrl');
    expect(announcements[0].imageUrl).toContain('test.jpg');
  });

  it('3. extractEvents normalizes image to imageUrl property', () => {
    const html = `
      <div class="etkinlik-list">
        <div class="etkinlik-item">
          <a href="/etkinlik/101" class="title">Test Etkinlik</a>
          <img src="/uploads/event.jpg" />
          <span class="event-date">2026-07-25</span>
        </div>
      </div>
    `;
    let doc = null;
    if (typeof DOMParser !== 'undefined') {
      doc = new DOMParser().parseFromString(html, 'text/html');
    }
    const events = extractEvents(doc, html);
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty('imageUrl');
    expect(events[0]).not.toHaveProperty('image');
    expect(events[0].imageUrl).toContain('event.jpg');
  });

  it('4. liveData line 152 replaced Unsplash stock image with official Esenyurt asset', () => {
    const tavsiyelerNews = liveNewsData.find(n => n.id === 'news-tavsiyeler-2026');
    expect(tavsiyelerNews).toBeTruthy();
    expect(tavsiyelerNews.imageUrl).not.toContain('unsplash.com');
    expect(tavsiyelerNews.imageUrl).toContain('esenyurt.edu.tr');
  });
});
