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
    'ocretsiz': 'Ücretsiz',
    '-Yrenci': 'Öğrenci',
    'Ylemler': 'İşlemler',
    'leri': 'İleri',
    'DǬzenle': 'Düzenle',
    'DanYmanlk': 'Danışmanlık',
    'Ynetimi': 'Yönetimi',
    'Kaytl': 'Kayıtlı',
    'KiYi': 'Kişi',
    'Onayland': 'Onaylandı',
    'HazrlY': 'Hazırlığı',
    'ncelemesi': 'İncelemesi',
    'EYitimi': 'Eğitimi',
    'MǬlakat': 'Mülakat',
    'GnǬllǬ': 'Gönüllü',
    'ndirim': 'İndirim',
    'NDRM': 'İNDİRİM',
    'zgemiY': 'Özgeçmiş',
    'DeYerlendir': 'Değerlendir',
    'YletiYim': 'İletişim',
    'BaYvuru': 'Başvuru',
    'nceleniyor': 'İnceleniyor',
    'Onayl': 'Onaylı',
    'Yaynla': 'Yayınla',
    'DanYmanlk Talepleri': 'Danışmanlık Talepleri',
    'Ylmaz': 'Yılmaz',
    'ncelemesi': 'İncelemesi',
    'MǬlakat HazrlY': 'Mülakat Hazırlığı',
    'Onayland': 'Onaylandı',
    'DanYmanlk Talepleri': 'Danışmanlık Talepleri',
    '-Yrenci Ad': 'Öğrenci Adı',
    'DanYmanlk Konusu': 'Danışmanlık Konusu',
    'Ylemler': 'İşlemler',
    'lan': 'İlan',
    'Ynetimi': 'Yönetimi',
    'ocretsiz': 'Ücretsiz',
    'EYitimi': 'Eğitimi',
    'leri': 'İleri',
    'DǬzey': 'Düzey',
    'ocret': 'Ücret',
    '-Yrenci': 'Öğrenci',
    'ndirimi': 'İndirimi',
    'Kaytl KiYi': 'Kayıtlı Kişi',
    'Ylemler': 'İşlemler',
    'NDRM': 'İNDİRİM',
    'DǬzenle': 'Düzenle'
  };

  for (const [key, value] of Object.entries(replacements)) {
    code = code.split(key).join(value);
  }
  
  // also clean up any remaining 
  code = code.replace(//g, 'ı');
  
  fs.writeFileSync(file, code, 'utf8');
}
console.log('Fixed properly!');
