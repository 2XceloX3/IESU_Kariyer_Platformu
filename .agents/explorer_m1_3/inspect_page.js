const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../explorer_m1_1/page_raw.html');
if (!fs.existsSync(htmlPath)) {
  console.log("page_raw.html not found at", htmlPath);
  process.exit(1);
}

const rawHtml = fs.readFileSync(htmlPath, 'utf-8');

// Strip tags function
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

console.log("=== CLEAN TEXT EXTRACT (First 300 lines) ===");
const textLines = cleanText(rawHtml).split('\n');
console.log(textLines.slice(0, 150).join('\n'));
