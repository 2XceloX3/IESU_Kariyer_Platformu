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
  
  // Custom manual replacements using regex
  code = code.replace(/ocretsiz/g, '\u00dccretsiz')
             .replace(/-Yrenci/g, '\u00d6\u011frenci')
             .replace(/Ylemler/g, '\u0130\u015flemler')
             .replace(/leri/g, '\u0130leri')
             .replace(/D\u01eCzenle/g, 'D\u00fczenle')
             .replace(/DanYmanlk/g, 'Dan\u0131\u015fmanl\u0131k')
             .replace(/Ynetimi/g, 'Y\u00f6netimi')
             .replace(/Kaytl/g, 'Kay\u0131tl\u0131')
             .replace(/KiYi/g, 'Ki\u015fi')
             .replace(/Onayland/g, 'Onayland\u0131')
             .replace(/HazrlY/g, 'Haz\u0131rl\u0131\u011f\u0131')
             .replace(/ncelemesi/g, '\u0130ncelemesi')
             .replace(/EYitimi/g, 'E\u011fitimi')
             .replace(/M\u01eClakat/g, 'M\u00fclakat')
             .replace(/Gn\u01eCll\u01eC/g, 'G\u00f6n\u00fcll\u00fc')
             .replace(/ndirim/g, '\u0130ndirim')
             .replace(/NDRM/g, '\u0130ND\u0130R\u0130M')
             .replace(/zgemiY/g, '\u00d6zge\u00e7mi\u015f')
             .replace(/DeYerlendir/g, 'De\u011ferlendir')
             .replace(/YletiYim/g, '\u0130leti\u015fim')
             .replace(/Mezun/g, 'Mezun ')
             .replace(/BaYvuru/g, 'Ba\u015fvuru')
             .replace(/nceleniyor/g, '\u0130nceleniyor')
             .replace(/Yaynla/g, 'Yay\u0131nla')
             .replace(/\uFFFD/g, '\u0131')
             .replace(/Y/g, '\u015f')
             .replace(/\u01ec/g, '\u00fc');
             
  fs.writeFileSync(file, code, 'utf8');
}
console.log('Fixed panels encoded!');
