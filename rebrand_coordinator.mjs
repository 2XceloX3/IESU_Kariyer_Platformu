import fs from 'fs';
import path from 'path';

const dirs = [
  'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Active\\src',
  'C:\\Users\\celil\\.gemini\antigravity\\scratch\\IESU_Kariyer_Platformu_Clean\\src'
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Global replacements
  content = content.replace(/Kariyer Geliştirme Merkezi/g, 'Kariyer Geliştirme Koordinatörlüğü');
  content = content.replace(/Kariyer Geliştirme Merkezi/g, 'Kariyer Geliştirme Koordinatörlüğü');
  content = content.replace(/KARIYER GELIŞTIRME MERKEZI/g, 'KARİYER GELİŞTİRME KOORDİNATÖRLÜĞÜ');
  content = content.replace(/Kariyer Merkezi/g, 'Kariyer Geliştirme Koordinatörlüğü');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Rebranded coordinator title in: ${filePath}`);
  }
}

function traverseDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

console.log('Starting global rebranding: Kariyer Geliştirme Merkezi -> Kariyer Geliştirme Koordinatörlüğü...');
dirs.forEach(d => traverseDir(d));
console.log('Done!');
