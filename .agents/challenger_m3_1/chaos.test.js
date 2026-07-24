import { describe, it, expect, vi } from 'vitest';
import { combineFeedItems } from '../../src/utils/feedCombiner.js';
import { exportToCSV } from '../../src/utils/export.js';
import { 
  getDepartmentsByFaculty, 
  getAllDepartments, 
  getAllFacultyNames,
  IESU_FACULTIES,
  IESU_MYO,
  IESU_YUKSEKOKUL,
  IESU_ENSTITU,
  IESU_KARIYER_MERKEZI
} from '../../src/utils/universityData.js';
import { 
  fetchStudentFromOBS, 
  verifyEDevlet, 
  syncAlumniData 
} from '../../src/utils/integrationService.js';
import { 
  initialNews, 
  initialEvents, 
  initialAnnouncements, 
  initialJobs, 
  initialSemCourses, 
  initialFeatured, 
  initialAcademicCatalog, 
  initialInternships, 
  initialAcademicApprovals, 
  initialGroups, 
  initialSurveys 
} from '../../src/utils/mockData.js';
import { innerPagesData } from '../../src/utils/innerPagesData.js';
import { 
  liveSliderData, 
  liveNewsData, 
  liveAnnouncementsData, 
  liveStatsData, 
  kariyerEventImages 
} from '../../src/utils/liveData.js';

describe('M3 Chaos Engineering Suite — feedCombiner & Utility Resilience', () => {

  describe('1. combineFeedItems Chaos Stress Injections', () => {
    it('1.1 should execute safely with no arguments', () => {
      expect(() => combineFeedItems()).not.toThrow();
      const res = combineFeedItems();
      expect(Array.isArray(res)).toBe(true);
    });

    it('1.2 should execute safely when all arguments are null', () => {
      expect(() => combineFeedItems(null, null, null, null, null)).not.toThrow();
      const res = combineFeedItems(null, null, null, null, null);
      expect(Array.isArray(res)).toBe(true);
    });

    it('1.3 should execute safely when all arguments are undefined', () => {
      expect(() => combineFeedItems(undefined, undefined, undefined, undefined, undefined)).not.toThrow();
      const res = combineFeedItems(undefined, undefined, undefined, undefined, undefined);
      expect(Array.isArray(res)).toBe(true);
    });

    it('1.4 should handle non-array inputs without throwing uncaught exceptions', () => {
      const nonArrays = [{}, 123, "invalid", true];
      for (const input of nonArrays) {
        expect(() => combineFeedItems(input, input, input, input, input)).not.toThrow();
      }
    });

    it('1.5 should handle arrays containing null and undefined items', () => {
      const postsWithNull = [null, undefined, { id: 'P-1', status: 'Yayında', title: 'Valid Post' }];
      const eventsWithNull = [null, { id: 'E-1', status: 'Aktif', title: 'Event' }, undefined];
      const newsWithNull = [undefined, null];
      const announcementsWithNull = [null];
      const jobsWithNull = [null, { id: 'J-1', status: 'Aktif', title: 'Job' }];

      expect(() => combineFeedItems(postsWithNull, eventsWithNull, newsWithNull, announcementsWithNull, jobsWithNull)).not.toThrow();
      const res = combineFeedItems(postsWithNull, eventsWithNull, newsWithNull, announcementsWithNull, jobsWithNull);
      expect(Array.isArray(res)).toBe(true);
    });

    it('1.6 should handle malformed date strings and undefined timestamps', () => {
      const malformedDateEvents = [
        { id: 'E-BAD1', status: 'Aktif', title: 'Event Bad Date 1', date: 'Tarih belirtilmemiş', time: undefined, createdAt: undefined },
        { id: 'E-BAD2', status: 'Aktif', title: 'Event Bad Date 2', date: null, time: null, createdAt: 'invalid-date-string' },
        { id: 'E-BAD3', status: 'Aktif', title: 'Event Bad Date 3', date: '', time: '', createdAt: 0 },
        { id: 'E-BAD4', status: 'Aktif', title: 'Event Bad Date 4', date: '31.02.2026', createdAt: NaN }
      ];
      expect(() => combineFeedItems([], malformedDateEvents, [], [], [])).not.toThrow();
      const res = combineFeedItems([], malformedDateEvents, [], [], []);
      expect(Array.isArray(res)).toBe(true);
    });

    it('1.7 should handle missing image URLs and null nested fields', () => {
      const missingFieldsJobs = [
        { id: 'J-NOIMG1', status: 'Aktif', title: null, description: null, company: null, location: null, imageUrl: null, companyLogo: null },
        { id: 'J-NOIMG2', status: 'Aktif', title: undefined, description: undefined, imageUrl: undefined },
        { id: 'J-NOIMG3', status: 'Aktif' }
      ];
      expect(() => combineFeedItems([], [], [], [], missingFieldsJobs)).not.toThrow();
      const res = combineFeedItems([], [], [], [], missingFieldsJobs);
      expect(Array.isArray(res)).toBe(true);
    });

    it('1.8 should handle long strings and special characters', () => {
      const longStr = 'A'.repeat(150000);
      const extremePosts = [
        { id: 'P-LONG', status: 'Yayında', title: longStr, description: longStr, author: { name: longStr } },
        { id: 'P-SPECIAL', status: 'Yayında', title: '<script>alert(1)</script> 🚀 🩵 \u0000 \uFFFF', content: 'Special chars & emojis' }
      ];
      expect(() => combineFeedItems(extremePosts, [], [], [], [])).not.toThrow();
      const res = combineFeedItems(extremePosts, [], [], [], []);
      expect(res.length).toBe(2);
    });

    it('1.9 should handle non-standard IDs (null, undefined, Symbol, Object, NaN)', () => {
      const badIdNews = [
        { id: null, status: 'Aktif', title: 'News Null ID' },
        { id: undefined, status: 'Aktif', title: 'News Undefined ID' },
        { id: Symbol('test-id'), status: 'Aktif', title: 'News Symbol ID' },
        { id: {}, status: 'Aktif', title: 'News Object ID' },
        { id: NaN, status: 'Aktif', title: 'News NaN ID' }
      ];
      expect(() => combineFeedItems([], [], badIdNews, [], [])).not.toThrow();
      const res = combineFeedItems([], [], badIdNews, [], []);
      expect(Array.isArray(res)).toBe(true);
    });
  });

  describe('2. Component Accessors & Search Filtering Vulnerability Analysis', () => {
    it('2.1 safe optional chaining filter should handle missing properties', () => {
      const chaoticFeed = combineFeedItems(
        [{ id: 1, content: null, author: null }],
        [{ id: 2, title: undefined, description: null }],
        [{ id: 3, title: null, description: undefined }],
        [{ id: 4, title: null, description: null }],
        [{ id: 5, title: null, company: null, location: null }]
      );

      const searchQuery = 'test';
      expect(() => {
        chaoticFeed.filter(post => 
          post.content?.toLowerCase()?.includes(searchQuery.toLowerCase()) || 
          post.author?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
        );
      }).not.toThrow();
    });

    it('2.2 unsafe property accessor check: missing title/date accessor risks', () => {
      const itemWithMissingDate = { title: 'Test Event', date: undefined };
      
      // Demonstrates crash vector in components that call item.date.split('.') without null-checks
      let threwTypeError = false;
      try {
        itemWithMissingDate.date.split('.');
      } catch (err) {
        threwTypeError = err instanceof TypeError;
      }
      expect(threwTypeError).toBe(true);
    });
  });

  describe('3. exportToCSV Resilience', () => {
    // Setup window/document mocks for Node environment
    if (typeof window === 'undefined') {
      global.window = {};
      global.alert = vi.fn();
      global.document = {
        createElement: () => ({
          setAttribute: () => {},
          style: {},
          click: () => {}
        }),
        body: {
          appendChild: () => {},
          removeChild: () => {}
        }
      };
      global.Blob = class Blob { constructor(content, opts) {} };
      global.URL = { createObjectURL: () => 'blob:test' };
    }

    it('3.1 exportToCSV should handle null data gracefully', () => {
      expect(() => exportToCSV(null, 'test.csv')).not.toThrow();
    });

    it('3.2 exportToCSV should handle empty array gracefully', () => {
      expect(() => exportToCSV([], 'test.csv')).not.toThrow();
    });

    it('3.3 exportToCSV should handle array with null element safely', () => {
      expect(() => exportToCSV([null], 'test.csv')).not.toThrow();
    });

    it('3.4 exportToCSV should handle array with undefined element safely', () => {
      expect(() => exportToCSV([undefined], 'test.csv')).not.toThrow();
    });

    it('3.5 exportToCSV should export rows with null and undefined property values', () => {
      expect(() => exportToCSV([{ name: 'Test', status: null, date: undefined }], 'test.csv')).not.toThrow();
    });
  });

  describe('4. universityData.js Accessors', () => {
    it('4.1 getDepartmentsByFaculty should return [] on null, undefined, or invalid type', () => {
      expect(getDepartmentsByFaculty(null)).toEqual([]);
      expect(getDepartmentsByFaculty(undefined)).toEqual([]);
      expect(getDepartmentsByFaculty(12345)).toEqual([]);
      expect(getDepartmentsByFaculty({})).toEqual([]);
    });

    it('4.2 getAllDepartments should return populated department list', () => {
      const depts = getAllDepartments();
      expect(Array.isArray(depts)).toBe(true);
      expect(depts.length).toBeGreaterThan(0);
      expect(depts[0]).toHaveProperty('faculty');
      expect(depts[0]).toHaveProperty('department');
    });

    it('4.3 getAllFacultyNames should return array of faculty strings', () => {
      const names = getAllFacultyNames();
      expect(Array.isArray(names)).toBe(true);
      expect(names.length).toBeGreaterThan(0);
      expect(typeof names[0]).toBe('string');
    });
  });

  describe('5. integrationService.js Functions', () => {
    it('5.1 fetchStudentFromOBS should throw error on null studentNumber', async () => {
      await expect(fetchStudentFromOBS(null)).rejects.toThrow('Öğrenci numarası gereklidir.');
    });

    it('5.2 verifyEDevlet should handle null tcKimlik gracefully', async () => {
      const res = await verifyEDevlet(null);
      expect(Boolean(res)).toBe(false);
    });

    it('5.3 verifyEDevlet should handle numeric tcKimlik gracefully', async () => {
      const res = await verifyEDevlet(12345678901);
      expect(Boolean(res)).toBe(false);
    });

    it('5.4 syncAlumniData should resolve array of alumni records', async () => {
      const res = await syncAlumniData();
      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBeGreaterThan(0);
    });
  });

  describe('6. Mock & Live Data Integrity', () => {
    it('6.1 initial datasets should be non-empty valid arrays without null elements', () => {
      const datasets = [
        { name: 'initialNews', data: initialNews },
        { name: 'initialEvents', data: initialEvents },
        { name: 'initialAnnouncements', data: initialAnnouncements },
        { name: 'initialJobs', data: initialJobs },
        { name: 'initialSemCourses', data: initialSemCourses },
        { name: 'initialFeatured', data: initialFeatured },
        { name: 'initialAcademicCatalog', data: initialAcademicCatalog },
        { name: 'initialInternships', data: initialInternships },
        { name: 'initialAcademicApprovals', data: initialAcademicApprovals },
        { name: 'initialGroups', data: initialGroups },
        { name: 'initialSurveys', data: initialSurveys },
        { name: 'liveSliderData', data: liveSliderData },
        { name: 'liveNewsData', data: liveNewsData },
        { name: 'liveAnnouncementsData', data: liveAnnouncementsData },
        { name: 'liveStatsData', data: liveStatsData },
        { name: 'kariyerEventImages', data: kariyerEventImages }
      ];

      for (const ds of datasets) {
        expect(Array.isArray(ds.data)).toBe(true);
        expect(ds.data.every(item => item !== null && item !== undefined)).toBe(true);
      }
    });
  });
});
