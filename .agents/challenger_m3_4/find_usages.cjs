const fs = require('fs');
const path = require('path');

function searchInDir(dir, pattern) {
  const files = fs.readdirSync(dir, { recursive: true });
  const results = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isFile() && (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(pattern)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const srcDir = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Active\\src';
console.log('=== Feed Combiner Usages ===');
console.log(searchInDir(srcDir, 'feedCombiner'));
console.log('=== Export Usages ===');
console.log(searchInDir(srcDir, 'exportToCSV'));
console.log('=== liveData Usages ===');
console.log(searchInDir(srcDir, 'liveData'));
