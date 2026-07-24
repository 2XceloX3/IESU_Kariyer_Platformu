const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../src/components');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getFiles(srcDir);
const arrayMethods = ['map', 'filter', 'find', 'slice', 'reduce', 'forEach', 'some', 'every'];

let results = [];

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(srcDir, filePath);
  
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    arrayMethods.forEach(method => {
      // Look for identifier.method( where identifier is not preceded by || []) or ?.
      const regex = new RegExp(`(?<!\\?\\.|\\|\\|\\s*\\[\\]\\s*\\)\\.)\\b([a-zA-Z0-9_$]+)\\.${method}\\(`, 'g');
      let match;
      while ((match = regex.exec(line)) !== null) {
        const varName = match[1];
        // Ignore standard built-ins or obvious literals
        if (!['Array', 'Object', 'Math', 'String', 'console', 'e', 'arr', 'list', 'items', 'rows'].includes(varName)) {
          // Check if line contains optional chaining or fallback
          if (!line.includes(`(${varName} || [])`) && !line.includes(`${varName}?.${method}`)) {
            results.push({
              file: relPath,
              line: idx + 1,
              varName,
              method,
              code: line.trim()
            });
          }
        }
      }
    });
  });
});

console.log(`Found ${results.length} potential unsafe array method calls:`);
results.slice(0, 30).forEach(r => {
  console.log(`[${r.file}:${r.line}] ${r.varName}.${r.method}() -> ${r.code}`);
});
