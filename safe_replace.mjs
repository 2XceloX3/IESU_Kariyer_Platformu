import fs from 'fs';
import path from 'path';

const searchUrls = [
  'https://cdn.gelisim.edu.tr/logo/logo_3.png',
  'https://cdn.esenyurt.edu.tr/logo/logo_3.png'
];
const replaceUrl = '/logo.png';
const searchDir = 'src';

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processDir(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      for (const searchUrl of searchUrls) {
        if (content.includes(searchUrl)) {
          content = content.replaceAll(searchUrl, replaceUrl);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Replaced in: ${filePath}`);
      }
    }
  }
}

processDir(searchDir);
console.log('Finished UTF-8 safe search and replace.');
