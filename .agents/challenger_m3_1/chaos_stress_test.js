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

const results = [];

function recordResult(suite, testName, passed, error = null, details = null) {
  results.push({
    suite,
    testName,
    passed,
    error: error ? (error.stack || error.toString()) : null,
    errorMessage: error ? error.message : null,
    errorName: error ? error.name : null,
    details
  });
  const statusSymbol = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${statusSymbol}] [${suite}] ${testName}`);
  if (!passed && error) {
    console.error(`   Error (${error.name}): ${error.message}`);
  }
}

async function runChaosSuite() {
  console.log('====================================================');
  console.log('   IESU KARIYER PLATFORMU - CHAOS STRESS SUITE     ');
  console.log('====================================================\n');

  // ----------------------------------------------------
  // TEST SUITE 1: combineFeedItems Chaos Injections
  // ----------------------------------------------------
  console.log('--- TEST SUITE 1: combineFeedItems ---');

  // 1.1 Undefined/null arguments
  try {
    const res = combineFeedItems();
    recordResult('combineFeedItems', '1.1 No parameters passed', Array.isArray(res));
  } catch (err) {
    recordResult('combineFeedItems', '1.1 No parameters passed', false, err);
  }

  try {
    const res = combineFeedItems(null, null, null, null, null);
    recordResult('combineFeedItems', '1.2 Null for all arguments', Array.isArray(res));
  } catch (err) {
    recordResult('combineFeedItems', '1.2 Null for all arguments', false, err);
  }

  try {
    const res = combineFeedItems(undefined, undefined, undefined, undefined, undefined);
    recordResult('combineFeedItems', '1.3 Undefined for all arguments', Array.isArray(res));
  } catch (err) {
    recordResult('combineFeedItems', '1.3 Undefined for all arguments', false, err);
  }

  // 1.2 Non-array inputs (truthy non-arrays like objects, numbers, strings, booleans)
  const nonArrayCases = [
    { name: 'Objects ({})', val: {} },
    { name: 'Numbers (123)', val: 123 },
    { name: 'Strings ("invalid")', val: "invalid" },
    { name: 'Booleans (true)', val: true }
  ];

  for (const c of nonArrayCases) {
    try {
      const res = combineFeedItems(c.val, c.val, c.val, c.val, c.val);
      recordResult('combineFeedItems', `1.4 Non-array input (${c.name})`, Array.isArray(res));
    } catch (err) {
      recordResult('combineFeedItems', `1.4 Non-array input (${c.name})`, false, err);
    }
  }

  // 1.3 Arrays containing null/undefined elements
  try {
    const postsWithNull = [null, undefined, { id: 'P-1', status: 'Yayında', title: 'Valid Post' }];
    const eventsWithNull = [null, { id: 'E-1', status: 'Aktif', title: 'Event' }, undefined];
    const newsWithNull = [undefined, null];
    const announcementsWithNull = [null];
    const jobsWithNull = [null, { id: 'J-1', status: 'Aktif', title: 'Job' }];

    const res = combineFeedItems(postsWithNull, eventsWithNull, newsWithNull, announcementsWithNull, jobsWithNull);
    recordResult('combineFeedItems', '1.5 Arrays with null/undefined items', Array.isArray(res));
  } catch (err) {
    recordResult('combineFeedItems', '1.5 Arrays with null/undefined items', false, err);
  }

  // 1.4 Malformed dates & undefined timestamps
  try {
    const malformedDateEvents = [
      { id: 'E-BAD1', status: 'Aktif', title: 'Event Bad Date 1', date: 'Tarih belirtilmemiş', time: undefined, createdAt: undefined },
      { id: 'E-BAD2', status: 'Aktif', title: 'Event Bad Date 2', date: null, time: null, createdAt: 'invalid-date-string' },
      { id: 'E-BAD3', status: 'Aktif', title: 'Event Bad Date 3', date: '', time: '', createdAt: 0 },
      { id: 'E-BAD4', status: 'Aktif', title: 'Event Bad Date 4', date: '31.02.2026', createdAt: NaN }
    ];
    const res = combineFeedItems([], malformedDateEvents, [], [], []);
    recordResult('combineFeedItems', '1.6 Malformed date strings & undefined timestamps', Array.isArray(res));
  } catch (err) {
    recordResult('combineFeedItems', '1.6 Malformed date strings & undefined timestamps', false, err);
  }

  // 1.5 Missing Image URLs and null nested fields
  try {
    const missingFieldsJobs = [
      { id: 'J-NOIMG1', status: 'Aktif', title: null, description: null, company: null, location: null, imageUrl: null, companyLogo: null },
      { id: 'J-NOIMG2', status: 'Aktif', title: undefined, description: undefined, imageUrl: undefined },
      { id: 'J-NOIMG3', status: 'Aktif' } // no other fields
    ];
    const res = combineFeedItems([], [], [], [], missingFieldsJobs);
    recordResult('combineFeedItems', '1.7 Missing image URLs and null nested fields', Array.isArray(res));
  } catch (err) {
    recordResult('combineFeedItems', '1.7 Missing image URLs and null nested fields', false, err);
  }

  // 1.6 Long strings and special characters
  try {
    const longStr = 'A'.repeat(150000);
    const extremePost = [
      { id: 'P-LONG', status: 'Yayında', title: longStr, description: longStr, author: { name: longStr } },
      { id: 'P-SPECIAL', status: 'Yayında', title: '<script>alert(1)</script> 🚀 🩵 \u0000 \uFFFF', content: 'Special chars & emojis' }
    ];
    const res = combineFeedItems(extremePost, [], [], [], []);
    recordResult('combineFeedItems', '1.8 Long strings and special characters', Array.isArray(res));
  } catch (err) {
    recordResult('combineFeedItems', '1.8 Long strings and special characters', false, err);
  }

  // 1.7 Non-standard IDs (Symbol, object, function, negative, NaN)
  try {
    const badIdNews = [
      { id: null, status: 'Aktif', title: 'News Null ID' },
      { id: undefined, status: 'Aktif', title: 'News Undefined ID' },
      { id: Symbol('test-id'), status: 'Aktif', title: 'News Symbol ID' },
      { id: {}, status: 'Aktif', title: 'News Object ID' },
      { id: NaN, status: 'Aktif', title: 'News NaN ID' }
    ];
    const res = combineFeedItems([], [], badIdNews, [], []);
    recordResult('combineFeedItems', '1.9 Non-standard IDs (Symbol, Object, NaN, null)', Array.isArray(res));
  } catch (err) {
    recordResult('combineFeedItems', '1.9 Non-standard IDs (Symbol, Object, NaN, null)', false, err);
  }


  // ----------------------------------------------------
  // TEST SUITE 2: Component Accessors & Search Filters
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 2: Component Accessors & Search Filters ---');

  // Test searching over combined items when properties are missing / null
  try {
    const chaoticFeed = combineFeedItems(
      [{ id: 1, content: null, author: null }],
      [{ id: 2, title: undefined, description: null }],
      [{ id: 3, title: null, description: undefined }],
      [{ id: 4, title: null, description: null, attachments: null, attachmentData: null }],
      [{ id: 5, title: null, company: null, location: null, description: null }]
    );

    const searchQuery = 'test search';
    const filtered = chaoticFeed.filter(post => 
      post.content?.toLowerCase()?.includes(searchQuery.toLowerCase()) || 
      post.author?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
    );
    recordResult('componentAccessors', '2.1 Safe content/author search filtering', Array.isArray(filtered));
  } catch (err) {
    recordResult('componentAccessors', '2.1 Safe content/author search filtering', false, err);
  }

  // Test unsafe search expression seen in some components: post.title.toLowerCase() or post.content.toLowerCase()
  try {
    const chaoticFeed = combineFeedItems(
      [{ id: 1, content: null, author: null }],
      [{ id: 2, title: undefined, description: null }]
    );

    let caughtError = null;
    try {
      // Unsafe filter simulation:
      chaoticFeed.filter(post => post.title.toLowerCase().includes('test'));
    } catch (e) {
      caughtError = e;
    }

    if (caughtError) {
      recordResult('componentAccessors', '2.2 Unsafe post.title.toLowerCase() detection', true, null, 'Caught expected crash vector when post.title is missing');
    } else {
      recordResult('componentAccessors', '2.2 Unsafe post.title.toLowerCase() detection', false, null, 'Did not throw error as expected when post.title was missing');
    }
  } catch (err) {
    recordResult('componentAccessors', '2.2 Unsafe post.title.toLowerCase() detection', false, err);
  }

  // Test date splitting logic seen in NewsEvents.jsx: item.date.split('.')
  try {
    const testDates = ['01.07.2026', 'Tarih belirtilmemiş', null, undefined, '11 Mayıs', 12345];
    let splitFailures = 0;
    for (const d of testDates) {
      try {
        if (typeof d === 'string') {
          const parts = d.split('.');
          const day = parts[0]?.trim();
          const month = parts[1]?.trim();
        } else {
          // Simulation of unsafe d.split('.')
          d.split('.');
        }
      } catch (e) {
        splitFailures++;
      }
    }
    if (splitFailures > 0) {
      recordResult('componentAccessors', '2.3 Date split accessor safety (item.date.split)', false, null, `Failed on ${splitFailures} non-string or malformed date items when unsafe split called`);
    } else {
      recordResult('componentAccessors', '2.3 Date split accessor safety (item.date.split)', true);
    }
  } catch (err) {
    recordResult('componentAccessors', '2.3 Date split accessor safety (item.date.split)', false, err);
  }


  // ----------------------------------------------------
  // TEST SUITE 3: exportToCSV Chaos Injections
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 3: exportToCSV ---');

  // Mock global window/document/alert for Node environment testing of exportToCSV
  global.window = {};
  global.alert = () => {};
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

  try {
    exportToCSV(null, 'test.csv');
    recordResult('exportToCSV', '3.1 exportToCSV(null)', true);
  } catch (err) {
    recordResult('exportToCSV', '3.1 exportToCSV(null)', false, err);
  }

  try {
    exportToCSV([], 'test.csv');
    recordResult('exportToCSV', '3.2 exportToCSV([])', true);
  } catch (err) {
    recordResult('exportToCSV', '3.2 exportToCSV([])', false, err);
  }

  try {
    exportToCSV([null], 'test.csv');
    recordResult('exportToCSV', '3.3 exportToCSV([null])', true);
  } catch (err) {
    recordResult('exportToCSV', '3.3 exportToCSV([null])', false, err);
  }

  try {
    exportToCSV([undefined], 'test.csv');
    recordResult('exportToCSV', '3.4 exportToCSV([undefined])', true);
  } catch (err) {
    recordResult('exportToCSV', '3.4 exportToCSV([undefined])', false, err);
  }

  try {
    exportToCSV([{ name: 'Test', status: null, date: undefined }], 'test.csv');
    recordResult('exportToCSV', '3.5 exportToCSV with null/undefined row values', true);
  } catch (err) {
    recordResult('exportToCSV', '3.5 exportToCSV with null/undefined row values', false, err);
  }


  // ----------------------------------------------------
  // TEST SUITE 4: universityData.js Accessors
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 4: universityData accessors ---');

  try {
    const res = getDepartmentsByFaculty(null);
    recordResult('universityData', '4.1 getDepartmentsByFaculty(null)', Array.isArray(res) && res.length === 0);
  } catch (err) {
    recordResult('universityData', '4.1 getDepartmentsByFaculty(null)', false, err);
  }

  try {
    const res = getDepartmentsByFaculty(undefined);
    recordResult('universityData', '4.2 getDepartmentsByFaculty(undefined)', Array.isArray(res) && res.length === 0);
  } catch (err) {
    recordResult('universityData', '4.2 getDepartmentsByFaculty(undefined)', false, err);
  }

  try {
    const res = getDepartmentsByFaculty(12345);
    recordResult('universityData', '4.3 getDepartmentsByFaculty(12345)', Array.isArray(res) && res.length === 0);
  } catch (err) {
    recordResult('universityData', '4.3 getDepartmentsByFaculty(12345)', false, err);
  }

  try {
    const depts = getAllDepartments();
    recordResult('universityData', '4.4 getAllDepartments()', Array.isArray(depts) && depts.length > 0);
  } catch (err) {
    recordResult('universityData', '4.4 getAllDepartments()', false, err);
  }

  try {
    const names = getAllFacultyNames();
    recordResult('universityData', '4.5 getAllFacultyNames()', Array.isArray(names) && names.length > 0);
  } catch (err) {
    recordResult('universityData', '4.5 getAllFacultyNames()', false, err);
  }


  // ----------------------------------------------------
  // TEST SUITE 5: integrationService.js Functions
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 5: integrationService ---');

  // Mock global fetch for Node testing
  global.fetch = async () => ({ ok: false });

  try {
    await fetchStudentFromOBS(null);
    recordResult('integrationService', '5.1 fetchStudentFromOBS(null) error handling', false, null, 'Expected function to throw on null studentNumber');
  } catch (err) {
    recordResult('integrationService', '5.1 fetchStudentFromOBS(null) error handling', true, null, 'Correctly threw Error on null student number');
  }

  try {
    const res = await verifyEDevlet(null);
    recordResult('integrationService', '5.2 verifyEDevlet(null)', res === null || res === false || res === undefined);
  } catch (err) {
    recordResult('integrationService', '5.2 verifyEDevlet(null)', false, err);
  }

  try {
    const res = await verifyEDevlet(12345678901); // number instead of string
    recordResult('integrationService', '5.3 verifyEDevlet(number)', typeof res === 'boolean' || res === false);
  } catch (err) {
    recordResult('integrationService', '5.3 verifyEDevlet(number)', false, err);
  }

  try {
    const res = await syncAlumniData();
    recordResult('integrationService', '5.4 syncAlumniData()', Array.isArray(res) && res.length > 0);
  } catch (err) {
    recordResult('integrationService', '5.4 syncAlumniData()', false, err);
  }


  // ----------------------------------------------------
  // TEST SUITE 6: Mock & Live Data Property Verification
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 6: Mock & Live Data Integrity ---');

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
    let isValid = Array.isArray(ds.data);
    let nullItems = 0;
    let missingIds = 0;
    if (isValid) {
      ds.data.forEach((item, idx) => {
        if (!item) nullItems++;
        else if (item.id === undefined && ds.name.includes('initial')) missingIds++;
      });
    }
    recordResult(
      'mockDataIntegrity', 
      `6.x ${ds.name} structure check`, 
      isValid && nullItems === 0, 
      null, 
      `Total items: ${ds.data?.length || 0}, Null items: ${nullItems}, Missing IDs: ${missingIds}`
    );
  }

  // ----------------------------------------------------
  // SUMMARY REPORT
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log('                  TEST SUMMARY                      ');
  console.log('====================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`Total Chaos Tests Run : ${total}`);
  console.log(`Passed                : ${passed}`);
  console.log(`Failed (Vulnerabilities): ${failed}`);
  console.log('====================================================\n');

  if (failed > 0) {
    console.log('--- DETAILED FAILURES ---');
    results.filter(r => !r.passed).forEach((f, i) => {
      console.log(`${i + 1}. [${f.suite}] ${f.testName}`);
      console.log(`   Error: ${f.errorName}: ${f.errorMessage}`);
      if (f.details) console.log(`   Details: ${f.details}`);
    });
  }

  return { total, passed, failed, results };
}

runChaosSuite().catch(console.error);
