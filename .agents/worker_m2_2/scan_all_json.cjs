const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === '.agents') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else if (file.endsWith('.json')) {
      results.push(fullPath);
    }
  });
  return results;
}

const jsonFiles = walkDir(rootDir);
jsonFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(rootDir, filePath);
  if (content.includes('2684') || content.includes('2657')) {
    console.log(`FOUND 2684/2657 in: ${relPath}`);
  }
  // Check year regexes like 2684 or 2657 or 26XX where year should be 2026
  const matches = content.match(/\b26[0-9]{2}\b/g);
  if (matches) {
    console.log(`FOUND 26xx years in ${relPath}:`, Array.from(new Set(matches)));
  }
});
