const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../explorer_m1_1/page_raw.html');
const rawHtml = fs.readFileSync(htmlPath, 'utf-8');

function cleanText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .join('\n');
}

const textLines = cleanText(rawHtml).split('\n');
textLines.forEach((line, idx) => console.log(`${idx}: ${line}`));
