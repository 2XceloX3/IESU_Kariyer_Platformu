const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_data.json'), 'utf-8'));

const targets = [
    'Main Page', 'Misyon & Vizyon', 'Biz Kimiz', 'Ekip Üyeleri (Kadro)', 
    'Koordinatörün Mesajı', 'Kariyer Merkezi Yönergesi', 'Organizasyon Yapımız',
    'İş Akış Şeması', 'İletişim', 'Organizasyon Şeması', 'CV Hazırlama Kılavuzu',
    'Bireysel Görüşme Randevusu', 'Formlar ve Belgeler', 'Portal Giriş ve Kullanım Kılavuzu'
];

data.filter(d => targets.includes(d.category)).forEach(p => {
    console.log(`========================================`);
    console.log(`CATEGORY: ${p.category}`);
    console.log(`URL: ${p.url}`);
    console.log(`STATUS: ${p.status}`);
    console.log(`----------------------------------------`);
    console.log(p.text || '[NO TEXT]');
    console.log(`\n`);
});
