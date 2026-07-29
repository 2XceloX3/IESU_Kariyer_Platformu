import * as liveData from '../../src/utils/liveData.js';

console.log('Export keys:', Object.keys(liveData));

function checkArray(name, arr, reqKeys, imgKey, linkKey) {
  console.log(`\n=== Checking ${name} (Count: ${arr ? arr.length : 0}) ===`);
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    console.error(`[FAIL] ${name} is empty or not an array!`);
    return false;
  }
  let clean = true;
  arr.forEach((item, idx) => {
    reqKeys.forEach(k => {
      if (!item[k] || typeof item[k] !== 'string' || item[k].trim() === '') {
        console.error(`[FAIL] ${name}[${idx}] missing or empty field: ${k}`);
        clean = false;
      }
    });
    if (imgKey) {
      if (!item[imgKey] || typeof item[imgKey] !== 'string' || !item[imgKey].startsWith('https://www.esenyurt.edu.tr/uploads/')) {
        console.error(`[FAIL] ${name}[${idx}] invalid image domain/path: ${item[imgKey]}`);
        clean = false;
      }
    }
    if (linkKey) {
      if (!item[linkKey] || typeof item[linkKey] !== 'string' || !item[linkKey].startsWith('https://')) {
        console.error(`[FAIL] ${name}[${idx}] invalid link: ${item[linkKey]}`);
        clean = false;
      }
    }
    // Check for mock keywords
    const text = JSON.stringify(item).toLowerCase();
    ['lorem', 'ipsum', 'placeholder', 'dummy', 'mock_event', 'test event', 'sample'].forEach(mock => {
      if (text.includes(mock)) {
        console.error(`[FAIL] ${name}[${idx}] contains mock keyword: '${mock}'`);
        clean = false;
      }
    });
  });
  if (clean) console.log(`[PASS] ${name} is 100% clean and valid.`);
  return clean;
}

const c1 = checkArray('liveSliderData', liveData.liveSliderData, ['title', 'content', 'image', 'actionLink'], 'image', 'actionLink');
const c2 = checkArray('liveNewsData', liveData.liveNewsData, ['id', 'title', 'date', 'description', 'content', 'imageUrl', 'url'], 'imageUrl', 'url');
const c3 = checkArray('liveAnnouncementsData', liveData.liveAnnouncementsData, ['id', 'title', 'date', 'description', 'content', 'imageUrl', 'url'], 'imageUrl', 'url');
const c4 = checkArray('liveEventData', liveData.liveEventData, ['id', 'title', 'date', 'description', 'content', 'imageUrl', 'url'], 'imageUrl', 'url');

if (c1 && c2 && c3 && c4) {
  console.log('\nFINAL RESULT: ALL DATA ARRAYS PASS CHEATING & STUB DETECTION');
  process.exit(0);
} else {
  console.error('\nFINAL RESULT: CHEATING OR STUB DETECTED');
  process.exit(1);
}
