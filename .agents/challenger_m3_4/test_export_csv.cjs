const path = require('path');
const { pathToFileURL } = require('url');

// Mock browser globals for Node environment testing
global.window = { alert: (msg) => console.log('[Alert Mock]:', msg) };
global.document = {
  createElement: (tag) => {
    return {
      style: {},
      setAttribute: function(k, v) { this[k] = v; },
      click: function() { this.clicked = true; }
    };
  },
  body: {
    appendChild: () => {},
    removeChild: () => {}
  }
};
global.Blob = class Blob {
  constructor(parts, options) {
    this.parts = parts;
    this.options = options;
  }
};
global.URL = {
  createObjectURL: (blob) => 'blob:http://localhost/mock-url'
};

async function testExportToCSV() {
  const fileUrl = pathToFileURL(path.resolve(__dirname, '../../src/utils/export.js')).href;
  const { exportToCSV } = await import(fileUrl);

  console.log('--- TEST 1: Symbol value inside row property ---');
  try {
    const data = [{ id: 1, sym: Symbol('testSymbol') }];
    exportToCSV(data, 'test_symbol.csv');
    console.log('TEST 1 Passed');
  } catch (err) {
    console.log('BUG CONFIRMED IN TEST 1: exportToCSV throws TypeError on Symbol values:', err.message);
  }

  console.log('\n--- TEST 2: BigInt value inside row property ---');
  try {
    const data = [{ id: 1, big: 12345678901234567890n }];
    exportToCSV(data, 'test_bigint.csv');
    console.log('TEST 2 Passed');
  } catch (err) {
    console.log('BUG CONFIRMED IN TEST 2: exportToCSV throws on BigInt values:', err.message);
  }

  console.log('\n--- TEST 3: Heterogeneous row schemas (Row 1 has different keys than Row 2) ---');
  try {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob', extraField: 'SecretData', status: 'Active' }
    ];
    exportToCSV(data, 'test_hetero.csv');
    console.log('TEST 3 Executed (Note: sub-fields in row 2 ignored if not in row 1)');
  } catch (err) {
    console.error('Error in TEST 3:', err);
  }

  console.log('\n--- TEST 4: Null / Undefined / Non-array inputs ---');
  try {
    exportToCSV(null, 'null.csv');
    exportToCSV(undefined, 'undef.csv');
    exportToCSV(123, 'num.csv');
    exportToCSV("string", 'str.csv');
    exportToCSV([], 'empty.csv');
    console.log('TEST 4 Passed');
  } catch (err) {
    console.error('Error in TEST 4:', err);
  }

  console.log('\n--- TEST 5: Array of non-objects or empty objects ---');
  try {
    exportToCSV([1, 2, "hello", null, undefined], 'primitives.csv');
    exportToCSV([{}, {}], 'empty_objects.csv');
    console.log('TEST 5 Passed');
  } catch (err) {
    console.error('Error in TEST 5:', err);
  }

  console.log('\n--- TEST 6: Large Dataset Stress Test (100,000 rows x 10 columns) ---');
  try {
    const largeData = Array.from({ length: 100000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      role: i % 2 === 0 ? 'Admin' : 'Student',
      department: 'Computer Science',
      status: 'Active',
      created: '2026-07-25',
      score: i * 1.5,
      notes: `Note "quoted" line ${i}`,
      code: `CODE_${i}`
    }));

    const start = Date.now();
    exportToCSV(largeData, 'large_export.csv');
    const duration = Date.now() - start;
    console.log(`Exported 100,000 rows in ${duration} ms.`);
  } catch (err) {
    console.error('Error in TEST 6:', err);
  }
}

testExportToCSV();
