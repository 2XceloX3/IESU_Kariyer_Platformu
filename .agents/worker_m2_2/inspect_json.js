const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const scrapedFullPath = path.join(rootDir, 'scraped_full.json');
const esenyurtScrapedPath = path.join(rootDir, 'esenyurt_scraped.json');

const scrapedFull = JSON.parse(fs.readFileSync(scrapedFullPath, 'utf8'));

console.log('--- SCRAPED FULL KEYS ---');
console.log(Object.keys(scrapedFull));

let datesCount = 0;
let dateYears = {};
let emptyImageCount = 0;

function checkArray(arr, name) {
  if (!Array.isArray(arr)) return;
  arr.forEach((item, index) => {
    if (item.date) {
      datesCount++;
      const dateStr = String(item.date);
      // match any year-like number 20xx, 26xx, etc
      const years = dateStr.match(/\b(19|20|26)\d{2}\b/g);
      if (years) {
        years.forEach(y => dateYears[y] = (dateYears[y] || 0) + 1);
      }
      if (dateStr.includes('2684') || dateStr.includes('2657')) {
        console.log(`Bad date in ${name}[${index}]: ${dateStr}`);
      }
    }
    if (item.imageUrl === '' || item.imageUrl === null) {
      emptyImageCount++;
      console.log(`Empty imageUrl in ${name}[${index}]: title="${item.title}"`);
    }
  });
}

checkArray(scrapedFull.news, 'news');
checkArray(scrapedFull.events, 'events');
checkArray(scrapedFull.announcements, 'announcements');

console.log('Date Years distribution:', dateYears);
console.log('Empty image count:', emptyImageCount);
