import {
  liveSliderData,
  liveNewsData,
  liveAnnouncementsData,
  liveAnnouncementData,
  liveEventData,
  liveStatsData
} from '../../src/utils/liveData.js';

console.log('--- STRESS & PLACEHOLDER CHECK ---');

const placeholderRegex = /lorem|ipsum|placeholder|test|dummy|foo|bar|sample/i;
const allExports = [
  { name: 'liveSliderData', data: liveSliderData },
  { name: 'liveNewsData', data: liveNewsData },
  { name: 'liveAnnouncementsData', data: liveAnnouncementsData },
  { name: 'liveAnnouncementData', data: liveAnnouncementData },
  { name: 'liveEventData', data: liveEventData },
  { name: 'liveStatsData', data: liveStatsData }
];

let issues = 0;

for (const exp of allExports) {
  exp.data.forEach((item, idx) => {
    const jsonStr = JSON.stringify(item);
    if (placeholderRegex.test(jsonStr)) {
      console.warn(`⚠️ Potential placeholder string found in ${exp.name} #${idx}: ${jsonStr}`);
      issues++;
    }
  });
}

if (issues === 0) {
  console.log('✅ Zero placeholder / dummy / test strings found across all datasets!');
} else {
  console.warn(`⚠️ Found ${issues} items with possible placeholder content.`);
}
