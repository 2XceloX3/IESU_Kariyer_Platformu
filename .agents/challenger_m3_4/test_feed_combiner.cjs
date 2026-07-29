const path = require('path');
const { pathToFileURL } = require('url');

async function testFeedCombiner() {
  const fileUrl = pathToFileURL(path.resolve(__dirname, '../../src/utils/feedCombiner.js')).href;
  const { combineFeedItems } = await import(fileUrl);

  console.log('--- TEST 1: Primitive items in posts ---');
  try {
    const res = combineFeedItems([123, 'hello', true], [], [], [], []);
    console.log('Result for primitives in posts:', res);
    if (res.includes(123) || res.includes('hello') || res.includes(true)) {
      console.log('BUG CONFIRMED: combineFeedItems allows non-object primitives in posts!');
    }
  } catch (err) {
    console.error('Error in TEST 1:', err);
  }

  console.log('\n--- TEST 2: Null and Undefined feeds ---');
  try {
    const res1 = combineFeedItems(null, null, null, null, null);
    console.log('Result for nulls:', res1);
    const res2 = combineFeedItems(undefined, undefined, undefined, undefined, undefined);
    console.log('Result for undefined:', res2);
  } catch (err) {
    console.error('Error in TEST 2:', err);
  }

  console.log('\n--- TEST 3: Non-array feeds (numbers, strings, objects) ---');
  try {
    const res = combineFeedItems(123, 'str', { a: 1 }, true, () => {});
    console.log('Result for non-arrays:', res);
  } catch (err) {
    console.error('Error in TEST 3:', err);
  }

  console.log('\n--- TEST 4: Array containing null/undefined elements ---');
  try {
    const res = combineFeedItems([null, undefined], [null, undefined], [null, undefined], [null, undefined], [null, undefined]);
    console.log('Result for null/undefined elements:', res);
  } catch (err) {
    console.error('Error in TEST 4:', err);
  }

  console.log('\n--- TEST 5: Large feed stress test (100,000 items across all categories) ---');
  try {
    const makeItems = (count, prefix) => Array.from({ length: count }, (_, i) => ({
      id: `${prefix}-${i}`,
      title: `Item ${i}`,
      description: `Description ${i}`,
      status: i % 10 === 0 ? 'Taslak' : 'Aktif',
      createdAt: new Date(1710000000000 - i * 1000).toISOString()
    }));

    const posts = makeItems(20000, 'post');
    const events = makeItems(20000, 'event');
    const news = makeItems(20000, 'news');
    const announcements = makeItems(20000, 'ann');
    const jobs = makeItems(20000, 'job');

    const start = Date.now();
    const res = combineFeedItems(posts, events, news, announcements, jobs);
    const duration = Date.now() - start;
    console.log(`Combined ${res.length} items out of 100,000 in ${duration} ms.`);
  } catch (err) {
    console.error('Error in TEST 5:', err);
  }

  console.log('\n--- TEST 6: Extreme item ID / sum in getDeterministicDate ---');
  try {
    const longId = 'A'.repeat(100000); // 100k char string -> sum = 6,500,000
    const events = [{ id: longId, status: 'Aktif', title: 'Test' }];
    const res = combineFeedItems([], events, [], [], []);
    console.log('Result for long ID:', res[0].createdAt);
  } catch (err) {
    console.error('Error in TEST 6:', err);
  }

  console.log('\n--- TEST 7: Invalid date values sorting test ---');
  try {
    const posts = [
      { id: '1', status: 'Aktif', createdAt: 'Invalid-Date-String-XYZ' },
      { id: '2', status: 'Aktif', createdAt: '2026-01-01T00:00:00Z' },
      { id: '3', status: 'Aktif', createdAt: null }
    ];
    const res = combineFeedItems(posts, [], [], [], []);
    console.log('Sorted posts with invalid/null dates count:', res.length);
  } catch (err) {
    console.error('Error in TEST 7:', err);
  }
}

testFeedCombiner();
