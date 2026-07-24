import fs from 'fs';
import path from 'path';

const srcDirActive = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Active\\src';
const srcDirClean = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Clean\\src';

function scanAndFix(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndFix(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      // Fix any lingering corrupt text strings
      content = content.replace(/esenyurte/g, 'gelişime');
      content = content.replace(/esenyurttan/g, 'gelişimden');
      content = content.replace(/iesu-logo-blue-tr\.svg/g, 'iesu-logo.svg');
      content = content.replace(/%3Cspan%3E/g, '');
      content = content.replace(/%3C-span%3E/g, '');
      content = content.replace(/%3C\/span%3E/g, '');
      
      // Fix broken image placeholders
      content = content.replace(/https:\/\/www\.esenyurt\.edu\.tr\/assets\/frontend\/images\/empty\.png/g, '/kariyer_logo.png');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Cleaned corrupt strings & broken URLs in: ${fullPath}`);
      }
    }
  }
}

console.log('Scanning & repairing all codebase files for broken images and corrupted text...');
scanAndFix(srcDirActive);
scanAndFix(srcDirClean);
console.log('Scan & repair complete!');
