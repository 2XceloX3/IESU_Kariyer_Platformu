const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../src');

const patterns = [
  { name: 'bg-blue', regex: /\bbg-blue-[a-z0-9-]+\b/gi },
  { name: 'text-blue', regex: /\btext-blue-[a-z0-9-]+\b/gi },
  { name: 'border-blue', regex: /\bborder-blue-[a-z0-9-]+\b/gi },
  { name: 'from-blue', regex: /\bfrom-blue-[a-z0-9-]+\b/gi },
  { name: 'to-blue', regex: /\bto-blue-[a-z0-9-]+\b/gi },
  { name: 'via-blue', regex: /\bvia-blue-[a-z0-9-]+\b/gi },
  { name: 'hex-0A2342', regex: /#0A2342/gi },
  { name: 'Gelişim', regex: /Gelişim|Gelisim/gi },
  { name: 'İGÜ', regex: /İGÜ|IGU|İGU|IGÜ/gi }
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
  const relativePath = path.relative(path.resolve(__dirname, '../..'), filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    patterns.forEach(p => {
      let match;
      p.regex.lastIndex = 0; // reset regex state
      while ((match = p.regex.exec(line)) !== null) {
        results.push({
          file: relativePath.replace(/\\/g, '/'),
          line: idx + 1,
          rule: p.name,
          matched: match[0],
          content: line.trim()
        });
      }
    });
  });
}

fs.writeFileSync(path.join(__dirname, 'branding_violations.json'), JSON.stringify(results, null, 2));
console.log(`Found ${results.length} branding violations.`);
