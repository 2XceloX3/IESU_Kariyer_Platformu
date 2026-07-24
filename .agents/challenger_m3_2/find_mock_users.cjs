const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../src');

function scanDir(dir, results = []) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') scanDir(fullPath, results);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('mockData') || content.includes('mockAdminData') || content.includes('data/mock')) {
        results.push({ file: fullPath, content });
      }
    }
  });
  return results;
}

const mockImporters = scanDir(srcDir);
console.log(`Found ${mockImporters.length} files importing or referencing mock data:`);
mockImporters.forEach(item => console.log(' - ' + path.relative(srcDir, item.file)));
