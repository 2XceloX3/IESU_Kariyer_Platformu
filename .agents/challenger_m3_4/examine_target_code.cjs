const fs = require('fs');
const path = require('path');

function searchPatterns(dir) {
  const files = fs.readdirSync(dir, { recursive: true });
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isFile() && (file.endsWith('.js') || file.endsWith('.jsx'))) {
      const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('combineFeedItems') || line.includes('exportToCSV')) {
          console.log(`${file}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

searchPatterns(path.resolve(__dirname, '../../src'));
