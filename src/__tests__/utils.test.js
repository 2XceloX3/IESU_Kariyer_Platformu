import { describe, it, expect } from 'vitest';
import { combineFeedItems } from '../utils/feedCombiner';
import { exportToCSV } from '../utils/export';

describe('Defensive Utils Integrity', () => {
  describe('combineFeedItems', () => {
    it('handles null, undefined, and non-array inputs gracefully', () => {
      expect(() => combineFeedItems(null, null, null, null, null)).not.toThrow();
      expect(combineFeedItems(null, undefined, {}, 123, 'str')).toEqual([]);
    });

    it('safely sorts items with missing, null, or invalid createdAt or date properties', () => {
      const posts = [
        { id: 1, content: 'Post 1', createdAt: null },
        { id: 2, content: 'Post 2', createdAt: '2026-01-01T00:00:00.000Z' },
      ];
      const events = [
        { id: 3, title: 'Event 1', createdAt: undefined, date: null },
      ];
      const res = combineFeedItems(posts, events, null, null, null);
      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(3);
    });
  });

  describe('exportToCSV', () => {
    it('handles null, undefined, and non-array data gracefully without throwing', () => {
      expect(() => exportToCSV(null, 'test.csv')).not.toThrow();
      expect(() => exportToCSV(undefined, 'test.csv')).not.toThrow();
      expect(() => exportToCSV(123, 'test.csv')).not.toThrow();
      expect(() => exportToCSV([null, undefined, 'string'], 'test.csv')).not.toThrow();
    });

    it('handles valid data array with null or undefined row properties', () => {
      const data = [
        { id: 1, name: 'Alice', role: null },
        { id: 2, name: undefined, role: 'Developer' },
      ];
      expect(() => exportToCSV(data, 'test.csv')).not.toThrow();
    });
  });
});
