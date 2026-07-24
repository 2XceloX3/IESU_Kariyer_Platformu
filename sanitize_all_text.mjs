import fs from 'fs';
import path from 'path';

const liveDataActive = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Active\\src\\utils\\liveData.js';
const liveDataClean = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Clean\\src\\utils\\liveData.js';
const mockDataActive = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Active\\src\\utils\\mockData.js';
const mockDataClean = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Clean\\src\\utils\\mockData.js';

function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  try {
    str = decodeURIComponent(str);
  } catch (e) {}
  return str
    .replace(/%E2%80%99/g, "'")
    .replace(/%C3%A2/g, "â")
    .replace(/%E2%80%93/g, "–")
    .replace(/%E2%80%9C/g, '"')
    .replace(/%E2%80%9D/g, '"')
    .replace(/###\s*\.?/g, '')
    .replace(/^\.\s*$/g, 'İstanbul Esenyurt Üniversitesi Duyurusu')
    .trim();
}

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Decode URI encodings
  content = content.replace(/https?:\/\/[^\s"']+/g, (url) => {
    try {
      return decodeURIComponent(url);
    } catch (e) {
      return url;
    }
  });

  content = content.replace(/%E2%80%99/g, "'");
  content = content.replace(/%C3%A2/g, "â");
  content = content.replace(/%E2%80%93/g, "–");
  content = content.replace(/### \./g, '');
  content = content.replace(/"title": "\."/g, '"title": "İstanbul Esenyurt Üniversitesi Duyurusu"');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Sanitized text and URLs in: ${filePath}`);
}

console.log('Sanitizing all text breaks and URL encodings...');
cleanFile(liveDataActive);
cleanFile(liveDataClean);
cleanFile(mockDataActive);
cleanFile(mockDataClean);
console.log('Sanitization complete!');
