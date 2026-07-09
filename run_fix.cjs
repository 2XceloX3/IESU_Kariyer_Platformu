const fs = require('fs');
const path = require('path');

const dir = 'src/components/admin/panels/';
const files = fs.readdirSync(dir).map(f => path.join(dir, f));
files.push('src/components/admin/Sidebar.jsx');
files.push('src/components/AdminDashboard.jsx');

for (const file of files) {
  if (!file.endsWith('.jsx')) continue;
  let code = fs.readFileSync(file, 'utf8');
  
  const ephemIdx = code.indexOf('The following is an <EPHEMERAL_MESSAGE>');
  if (ephemIdx > -1) {
    code = code.substring(0, ephemIdx).trim();
  }
  
  const replacements = {
    'ocretsiz': '\u00dccretsiz',
    '-Yrenci': '\u00d6\u011frenci',
    'Ylemler': '\u0130\u015flemler',
    'leri': '\u0130leri',
    'D\u01eCzenle': 'D\u00fczenle',
    'DanYmanlk': 'Dan\u0131\u015fmanl\u0131k',
    'Ynetimi': 'Y\u00f6netimi',
    'Kaytl': 'Kay\u0131tl\u0131',
    'KiYi': 'Ki\u015fi',
    'Onayland': 'Onayland\u0131',
    'HazrlY': 'Haz\u0131rl\u0131\u011f\u0131',
    'ncelemesi': '\u0130ncelemesi',
    'EYitimi': 'E\u011fitimi',
    'M\u01eClakat': 'M\u00fclakat',
    'Gn\u01eCll\u01eC': 'G\u00f6n\u00fcll\u00fc',
    'ndirim': '\u0130ndirim',
    'NDRM': '\u0130ND\u0130R\u0130M',
    'zgemiY': '\u00d6zge\u00e7mi\u015f',
    'DeYerlendir': 'De\u011ferlendir',
    'YletiYim': '\u0130leti\u015fim',
    'BaYvuru': 'Ba\u015fvuru',
    'nceleniyor': '\u0130nceleniyor',
    'Yaynla': 'Yay\u0131nla',
    'Ylmaz': 'Y\u0131lmaz',
    'D\u01eCzey': 'D\u00fczey',
    'ocret': '\u00dccret',
    '\uFFFD': '\u0131',
    'Y': '\u015f',
    '\u01ec': '\u00fc'
  };

  for (const [key, value] of Object.entries(replacements)) {
    code = code.split(key).join(value);
  }
  
  fs.writeFileSync(file, code, 'utf8');
}
console.log('Done mapping.');
