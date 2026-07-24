const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../src');

function listTree(dir, depth = 0) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const rel = path.relative(srcDir, full).replace(/\\/g, '/');
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      console.log(`${'  '.repeat(depth)}[DIR] ${rel}`);
      listTree(full, depth + 1);
    } else {
      console.log(`${'  '.repeat(depth)}[FILE] ${rel}`);
    }
  }
}

listTree(srcDir);
