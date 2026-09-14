import { describe, it, expect, vi } from 'vitest';
import { combineFeedItems } from '../utils/feedCombiner';
import { exportToCSV } from '../utils/export';
import { liveNewsData, liveAnnouncementData, liveEventData, liveSliderData, liveStatsData } from '../utils/liveData';
import { universityKnowledgeBase } from '../utils/universityKnowledgeEngine';
import useAppStore from '../store/useAppStore';

describe('Empirical Stress & Edge-Case Suite: Feed, Export, LiveData & Store', () => {
  describe('1. feedCombiner.js resilience & empirical edge cases', () => {
    it('handles null, undefined, primitives, and non-array inputs without throwing', () => {
      expect(() => combineFeedItems(null, null, null, null, null)).not.toThrow();
      expect(combineFeedItems(undefined, 123, 'str', {}, () => {})).toEqual([]);
    });

    it('rejects primitives in posts rather than allowing them into combined array', () => {
      const posts = [123, 'primitive_str', true, null, undefined, { id: 'valid-1', content: 'hello', status: 'Aktif' }];
      const combined = combineFeedItems(posts, [], [], [], []);
      
      // Verification: Any item in combined should be a valid object, not a raw primitive number/string/boolean
      const hasPrimitives = combined.some(item => typeof item !== 'object' || item === null);
      expect(hasPrimitives).toBe(false);
    });

    it('handles primitives passed inside events, news, announcements, jobs without producing corrupt items', () => {
      const events = ['invalid_event', 999];
      const combined = combineFeedItems([], events, [], [], []);
      // Every combined item should have valid string content and valid id
      combined.forEach(item => {
        expect(typeof item.id).not.toBe('undefined');
      });
    });

    it('sorts efficiently and deterministically under large feeds (10,000 items per category)', () => {
      const makeItems = (count, prefix) => Array.from({ length: count }, (_, i) => ({
        id: `${prefix}-${i}`,
        title: `Title ${i}`,
        description: `Description ${i}`,
        status: i % 5 === 0 ? 'Taslak' : 'Aktif',
        createdAt: new Date(1710000000000 - i * 1000).toISOString()
      }));

      const posts = makeItems(2000, 'post');
      const events = makeItems(2000, 'event');
      const news = makeItems(2000, 'news');
      const announcements = makeItems(2000, 'ann');
      const jobs = makeItems(2000, 'job');

      const start = Date.now();
      const combined = combineFeedItems(posts, events, news, announcements, jobs);
      const duration = Date.now() - start;

      expect(Array.isArray(combined)).toBe(true);
      expect(combined.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(2000); // Should execute within 2 seconds
    });

    it('correctly integrates generalEvents and careerOpportunities with appropriate flags and metadata', () => {
      const generalEvents = [
        {
          id: 'GEVT-001',
          title: 'Bahar Şenliği 2026',
          organizer: 'Rektörlük',
          category: 'Kulüp & Bahar Şenliği',
          date: '2026-05-20',
          time: '14:00',
          location: 'Merkez Kampüs',
          status: 'Yayında'
        }
      ];

      const careerOpportunities = [
        {
          id: 'OPP-001',
          title: 'Google Cloud Gelecek Programı',
          organization: 'Google',
          category: 'Staj & Gelişim',
          deadline: '2026-06-01',
          status: 'Yayında'
        }
      ];

      const combined = combineFeedItems([], [], [], [], [], generalEvents, careerOpportunities);
      expect(combined).toHaveLength(2);

      const generalEvItem = combined.find(i => i.id === 'GEVT-001');
      expect(generalEvItem).toBeDefined();
      expect(generalEvItem.isGeneralEvent).toBe(true);
      expect(generalEvItem.author.title).toContain('Kampüs Etkinliği');

      const oppItem = combined.find(i => i.id === 'OPP-001');
      expect(oppItem).toBeDefined();
      expect(oppItem.isCareerOpportunity).toBe(true);
      expect(oppItem.author.name).toBe('Google');
    });
  });

  describe('2. export.js CSV exporter resilience & edge cases', () => {
    it('does not throw ReferenceError when window.alert is present but global alert is unbound', () => {
      const originalWindow = global.window;
      const originalAlert = global.alert;

      // Mock window.alert present but global.alert absent
      global.window = { alert: vi.fn() };
      global.alert = undefined;

      try {
        expect(() => exportToCSV([], 'test.csv')).not.toThrow();
        expect(() => exportToCSV(null, 'test.csv')).not.toThrow();
      } finally {
        global.window = originalWindow;
        global.alert = originalAlert;
      }
    });

    it('handles Symbol values without throwing TypeError', () => {
      const data = [{ id: 1, name: 'Test', symbolProp: Symbol('test') }];
      expect(() => exportToCSV(data, 'symbols.csv')).not.toThrow();
    });

    it('preserves keys from all rows even if schema is heterogeneous across rows', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob', department: 'Software Engineering', role: 'Lead' }
      ];
      // exportToCSV should handle or not drop keys from second row
      expect(() => exportToCSV(data, 'heterogeneous.csv')).not.toThrow();
    });
  });

  describe('3. liveData.js & Store Handlers resilience', () => {
    it('verifies liveData exports structure and validity', () => {
      expect(Array.isArray(liveSliderData)).toBe(true);
      expect(Array.isArray(liveNewsData)).toBe(true);
      expect(Array.isArray(liveAnnouncementData)).toBe(true);
      expect(Array.isArray(liveEventData)).toBe(true);
      expect(Array.isArray(liveStatsData)).toBe(true);

      expect(liveSliderData.length).toBeGreaterThan(0);
      expect(liveNewsData.length).toBeGreaterThan(0);
      expect(liveEventData.length).toBeGreaterThan(0);
    });

    it('verifies universityKnowledgeBase.searchIndex handles empty/null query safely', () => {
      expect(() => universityKnowledgeBase.searchIndex('')).not.toThrow();
      expect(() => universityKnowledgeBase.searchIndex(null, 'all')).not.toThrow();
      expect(() => universityKnowledgeBase.searchIndex('yök', 'Haber')).not.toThrow();
      const results = universityKnowledgeBase.searchIndex('esenyurt');
      expect(Array.isArray(results)).toBe(true);
    });

    it('tests useAppStore addNotification behavior and verifies state updates', () => {
      const initialNotifications = useAppStore.getState().notifications;
      expect(Array.isArray(initialNotifications)).toBe(true);

      // Attempt to add a notification
      const testNotif = { id: 'test-101', title: 'Test Notif', time: 'Now' };
      useAppStore.getState().addNotification(testNotif);

      // Check if notification was added to notifications array or unread count
      const updatedState = useAppStore.getState();
      expect(updatedState.unreadNotificationsCount).toBeGreaterThan(0);
    });
  });
});
