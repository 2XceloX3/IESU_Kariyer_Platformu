const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../src');

// Regex patterns according to rules
const patterns = [
  { name: 'blue-class', regex: /\b(?:[a-z0-9:-]+:)?(?:bg|text|border|from|to|via|ring|divide|outline|shadow)-blue-[a-z0-9-]+\b/gi },
  { name: 'hex-0A2342', regex: /#0A2342\b/gi },
  { name: 'Gelişim-text', regex: /Gelişim|Gelisim/gi },
  { name: 'İGÜ-text', regex: /İGÜ|IGU|İGU|IGÜ/gi }
];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles(srcDir);
const results = [];

for (const filePath of files) {
  const relativePath = path.relative(path.resolve(__dirname, '../..'), filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    patterns.forEach(p => {
      let match;
      p.regex.lastIndex = 0;
      while ((match = p.regex.exec(line)) !== null) {
        results.push({
          file: relativePath,
          line: idx + 1,
          ruleGroup: p.name,
          matched: match[0],
          content: line.trim()
        });
      }
    });
  });
}

fs.writeFileSync(path.join(__dirname, 'branding_violations_detailed.json'), JSON.stringify(results, null, 2));
console.log(`Detailed audit complete. Total matches: ${results.length}`);
