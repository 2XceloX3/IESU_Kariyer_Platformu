const fs = require('fs');
const path = require('path');

const dir = 'src/components/admin/panels/';
const files = fs.readdirSync(dir).map(f => path.join(dir, f));
files.push('src/components/admin/Sidebar.jsx');
files.push('src/components/AdminDashboard.jsx');

for (const file of files) {
  if (!file.endsWith('.jsx')) continue;
  let code = fs.readFileSync(file, 'utf8');

  // Fix the 'þ' back to 'Y' where it was a capital Y in Turkish words or React words
  code = code.replace(/þeni/g, 'Yeni')
             .replace(/þýlmaz/g, 'Yýlmaz')
             .replace(/þönetimi/g, 'Yönetimi')
             .replace(/þayýnla/g, 'Yayýnla')
             .replace(/þetki/g, 'Yetki')
             .replace(/þardým/g, 'Yardým')
             .replace(/þorum/g, 'Yorum')
             .replace(/þol/g, 'Yol')
             .replace(/þapam/g, 'Yapam')
             .replace(/þa\u015f/g, 'Ya\u015f')
             .replace(/þar\u0131\u015f/g, 'Yar\u0131\u015f')
             .replace(/þaz\u0131l\u0131m/g, 'Yaz\u0131l\u0131m')
             .replace(/þap\u0131l/g, 'Yap\u0131l')
             .replace(/þ\u00f6netim/g, 'Y\u00f6netim')
             .replace(/þ\u00f6nlendir/g, 'Y\u00f6nlendir')
             .replace(/þok/g, 'Yok');

  // Also fix any JSX tags if they got broken like <þouTube> -> <YouTube>
  code = code.replace(/<þ/g, '<Y')
             .replace(/<\/þ/g, '</Y')
             .replace(/þouTube/g, 'YouTube');

  // Any remaining '' (U+FFFD) is definitely wrong.
  code = code.replace(/\uFFFD/g, 'i'); // just fallback

  fs.writeFileSync(file, code, 'utf8');
}
console.log('Fixed Y!');
