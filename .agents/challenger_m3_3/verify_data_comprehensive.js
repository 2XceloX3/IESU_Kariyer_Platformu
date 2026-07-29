import {
  liveSliderData,
  liveNewsData,
  liveAnnouncementsData,
  liveAnnouncementData,
  liveEventData,
  liveStatsData
} from '../../src/utils/liveData.js';

console.log('================================================================================');
console.log('         EMPIRICAL DATA INTEGRITY VERIFICATION - COMPREHENSIVE REPORT          ');
console.log('================================================================================\n');

const report = {
  timestamp: new Date().toISOString(),
  totalDatasets: 5,
  totalRecordsChecked: 0,
  passedRecords: 0,
  failedRecords: 0,
  datasetSummaries: {},
  anomalies: []
};

// Data sets to check
const datasets = [
  { id: 'liveSliderData', data: liveSliderData, imgKey: 'image', urlKey: 'actionLink', requireDate: false },
  { id: 'liveNewsData', data: liveNewsData, imgKey: 'imageUrl', urlKey: 'url', requireDate: true },
  { id: 'liveAnnouncementsData', data: liveAnnouncementsData, imgKey: 'imageUrl', urlKey: 'url', requireDate: true },
  { id: 'liveAnnouncementData', data: liveAnnouncementData, imgKey: 'imageUrl', urlKey: 'url', requireDate: true },
  { id: 'liveEventData', data: liveEventData, imgKey: 'imageUrl', urlKey: 'url', requireDate: true }
];

for (const ds of datasets) {
  const items = ds.data;
  const count = items ? items.length : 0;
  console.log(`🔍 Dataset [${ds.id}] — Total Items: ${count}`);

  const summary = {
    total: count,
    passed: 0,
    failed: 0,
    items: []
  };

  if (!Array.isArray(items)) {
    report.anomalies.push({ dataset: ds.id, error: 'Dataset is not an array' });
    report.datasetSummaries[ds.id] = summary;
    continue;
  }

  items.forEach((item, idx) => {
    report.totalRecordsChecked++;
    const errors = [];
    const warnings = [];

    // 1. Check Title
    if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
      errors.push('CRITICAL: Title is missing or empty.');
    }

    // 2. Check Date (if required)
    if (ds.requireDate) {
      if (!item.date || typeof item.date !== 'string' || item.date.trim() === '') {
        errors.push('CRITICAL: Date field is missing or empty.');
      }
    }

    // 3. Check Description / Content
    const hasDesc = typeof item.description === 'string' && item.description.trim() !== '';
    const hasContent = typeof item.content === 'string' && item.content.trim() !== '';
    if (!hasDesc && !hasContent) {
      errors.push('CRITICAL: Neither description nor content is provided.');
    }

    // 4. Check Image URL
    const img = item[ds.imgKey];
    if (!img || typeof img !== 'string' || img.trim() === '') {
      errors.push(`CRITICAL: Image field [${ds.imgKey}] is missing or empty.`);
    } else {
      if (!img.startsWith('https://www.esenyurt.edu.tr/uploads/')) {
        errors.push(`INVALID_IMAGE_PREFIX: Image URL does not start with "https://www.esenyurt.edu.tr/uploads/". Value: "${img}"`);
      }
      // Check valid file extension
      const lowerImg = img.toLowerCase();
      if (!/\.(jpg|jpeg|png|jfif|webp|gif|svg)$/.test(lowerImg)) {
        warnings.push(`IMAGE_EXTENSION_WARNING: Image URL has non-standard image extension. Value: "${img}"`);
      }
    }

    // 5. Check Detail Page URL
    const link = item[ds.urlKey];
    if (!link || typeof link !== 'string' || link.trim() === '') {
      errors.push(`CRITICAL: Detail URL field [${ds.urlKey}] is missing or empty.`);
    } else {
      const validPrefixes = [
        'https://www.esenyurt.edu.tr/',
        'https://www.esenyurt.edu.tr',
        'https://aday.esenyurt.edu.tr/',
        'https://obs.esenyurt.edu.tr/'
      ];
      const isDomainValid = validPrefixes.some(p => link.startsWith(p));
      if (!isDomainValid) {
        errors.push(`INVALID_DETAIL_URL: URL does not start with valid esenyurt.edu.tr domain. Value: "${link}"`);
      }

      if (link === 'https://www.esenyurt.edu.tr') {
        warnings.push(`GENERIC_HOMEPAGE_URL: Detail page URL points to root home page rather than a specific subpage path.`);
      }
    }

    const itemStatus = errors.length === 0 ? 'PASS' : 'FAIL';
    if (itemStatus === 'PASS') {
      summary.passed++;
      report.passedRecords++;
    } else {
      summary.failed++;
      report.failedRecords++;
    }

    summary.items.push({
      index: idx,
      id: item.id || `item-${idx}`,
      title: item.title,
      status: itemStatus,
      errors,
      warnings
    });
  });

  report.datasetSummaries[ds.id] = summary;
}

// Check Alias identity
console.log('\n🔗 Checking Alias Identity [liveAnnouncementsData === liveAnnouncementData]:');
if (liveAnnouncementsData === liveAnnouncementData) {
  console.log('   ✅ liveAnnouncementData is exact reference export of liveAnnouncementsData.');
} else {
  console.log('   ⚠️ liveAnnouncementData is a separate array copy.');
}

console.log('\n================================================================================');
console.log('                            FINAL SUMMARY STATS                                 ');
console.log('================================================================================');
console.log(`Total Records Checked: ${report.totalRecordsChecked}`);
console.log(`Total Passed:         ${report.passedRecords} (${((report.passedRecords / report.totalRecordsChecked) * 100).toFixed(1)}%)`);
console.log(`Total Failed:         ${report.failedRecords} (${((report.failedRecords / report.totalRecordsChecked) * 100).toFixed(1)}%)`);
console.log('================================================================================\n');

for (const [dsName, summary] of Object.entries(report.datasetSummaries)) {
  console.log(`📊 ${dsName}: ${summary.passed}/${summary.total} Passed`);
  const failedItems = summary.items.filter(i => i.status === 'FAIL');
  if (failedItems.length > 0) {
    failedItems.forEach(fi => {
      console.log(`   ❌ Item #${fi.index} ("${fi.title}"):`);
      fi.errors.forEach(e => console.log(`      - ${e}`));
    });
  }
  const warningItems = summary.items.filter(i => i.warnings.length > 0);
  if (warningItems.length > 0) {
    warningItems.forEach(wi => {
      console.log(`   ⚠️ Item #${wi.index} ("${wi.title}") Warnings:`);
      wi.warnings.forEach(w => console.log(`      - ${w}`));
    });
  }
}

if (report.failedRecords > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
