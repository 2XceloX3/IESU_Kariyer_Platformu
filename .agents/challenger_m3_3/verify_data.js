import {
  liveSliderData,
  liveNewsData,
  liveAnnouncementsData,
  liveAnnouncementData,
  liveEventData
} from '../../src/utils/liveData.js';

console.log('--- STARTING EMPIRICAL DATA INTEGRITY VERIFICATION ---');

const datasets = [
  { name: 'liveSliderData', data: liveSliderData, imageKey: 'image', urlKey: 'actionLink', dateRequired: false },
  { name: 'liveNewsData', data: liveNewsData, imageKey: 'imageUrl', urlKey: 'url', dateRequired: true },
  { name: 'liveAnnouncementsData', data: liveAnnouncementsData, imageKey: 'imageUrl', urlKey: 'url', dateRequired: true },
  { name: 'liveAnnouncementData', data: liveAnnouncementData, imageKey: 'imageUrl', urlKey: 'url', dateRequired: true },
  { name: 'liveEventData', data: liveEventData, imageKey: 'imageUrl', urlKey: 'url', dateRequired: true }
];

let totalItemsChecked = 0;
let totalFailures = 0;
const results = [];

for (const ds of datasets) {
  console.log(`\nChecking dataset: ${ds.name} (Count: ${ds.data?.length ?? 0})`);
  if (!Array.isArray(ds.data)) {
    console.error(`ERROR: ${ds.name} is not an array!`);
    totalFailures++;
    continue;
  }

  ds.data.forEach((item, index) => {
    totalItemsChecked++;
    const itemFailures = [];

    // 1. Check title
    if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
      itemFailures.push('Empty or missing title');
    }

    // 2. Check date (if required)
    if (ds.dateRequired) {
      if (!item.date || typeof item.date !== 'string' || item.date.trim() === '') {
        itemFailures.push('Empty or missing date');
      }
    }

    // 3. Check description or content
    const hasDesc = item.description && typeof item.description === 'string' && item.description.trim() !== '';
    const hasContent = item.content && typeof item.content === 'string' && item.content.trim() !== '';
    if (!hasDesc && !hasContent) {
      itemFailures.push('Both description and content are missing or empty');
    }

    // 4. Check image URL format
    const imgUrl = item[ds.imageKey];
    if (!imgUrl || typeof imgUrl !== 'string') {
      itemFailures.push(`Missing or invalid ${ds.imageKey} field`);
    } else if (!imgUrl.startsWith('https://www.esenyurt.edu.tr/uploads/')) {
      itemFailures.push(`Image URL does not start with https://www.esenyurt.edu.tr/uploads/ (Got: ${imgUrl})`);
    }

    // 5. Check detail page URL format
    const detailUrl = item[ds.urlKey];
    if (!detailUrl || typeof detailUrl !== 'string') {
      itemFailures.push(`Missing or invalid ${ds.urlKey} field`);
    } else if (!detailUrl.startsWith('https://www.esenyurt.edu.tr/') && !detailUrl.startsWith('https://aday.esenyurt.edu.tr/') && !detailUrl.startsWith('https://obs.esenyurt.edu.tr/')) {
      itemFailures.push(`Detail page URL does not match esenyurt.edu.tr domain (Got: ${detailUrl})`);
    }

    if (itemFailures.length > 0) {
      totalFailures++;
      console.error(`  ❌ [${ds.name} Item #${index} (${item.title || 'No Title'})]:`);
      itemFailures.forEach(f => console.error(`     - ${f}`));
      results.push({ dataset: ds.name, index, title: item.title, status: 'FAIL', failures: itemFailures });
    } else {
      console.log(`  ✅ [${ds.name} Item #${index}]: "${item.title.substring(0, 40)}..." OK`);
      results.push({ dataset: ds.name, index, title: item.title, status: 'PASS', failures: [] });
    }
  });
}

console.log('\n--- VERIFICATION SUMMARY ---');
console.log(`Total Items Verified: ${totalItemsChecked}`);
console.log(`Total Items Passed: ${totalItemsChecked - totalFailures}`);
console.log(`Total Items Failed: ${totalFailures}`);

if (totalFailures > 0) {
  console.log('\nFAILED ITEMS DETAILS:');
  results.filter(r => r.status === 'FAIL').forEach(r => {
    console.log(`- Dataset: ${r.dataset}, Index: ${r.index}, Title: ${r.title}`);
    r.failures.forEach(f => console.log(`  * ${f}`));
  });
  process.exit(1);
} else {
  console.log('\nALL CHECKS PASSED EMPIRICALLY!');
  process.exit(0);
}
