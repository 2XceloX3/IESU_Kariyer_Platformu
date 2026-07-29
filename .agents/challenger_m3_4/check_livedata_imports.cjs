const fs = require('fs');
const path = require('path');

function checkLiveDataImports(dir) {
  const files = fs.readdirSync(dir, { recursive: true });
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isFile() && (file.endsWith('.js') || file.endsWith('.jsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('liveData')) {
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('liveData') && (line.includes('import') || line.includes('require'))) {
            console.log(`${file}:${idx + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

checkLiveDataImports(path.resolve(__dirname, '../../src'));
