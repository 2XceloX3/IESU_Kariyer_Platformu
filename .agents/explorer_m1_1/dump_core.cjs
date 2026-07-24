const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_data.json'), 'utf-8'));

const targets = [
    'Main Page', 'Misyon & Vizyon', 'Biz Kimiz', 'Ekip Üyeleri (Kadro)', 
    'Koordinatörün Mesajı', 'Kariyer Merkezi Yönergesi', 'Organizasyon Yapımız',
    'İş Akış Şeması', 'İletişim', 'Organizasyon Şeması', 'Formlar ve Belgeler',
    'T.C. Ulusal Staj Programı', 'Gönüllü Staj'
];

data.filter(d => targets.includes(d.category)).forEach(p => {
    let raw = p.text || '';
    // Find content between navigation breadcrumb and "Bu içerik ... tarihinde güncellenmiştir" or "HABERDAR OLUN"
    let content = raw;
    const breadcrumbIdx = raw.indexOf('Menü');
    if (breadcrumbIdx !== -1) {
        content = raw.substring(breadcrumbIdx);
    }
    const endIdx = content.indexOf('HABERDAR OLUN');
    if (endIdx !== -1) {
        content = content.substring(0, endIdx);
    }

    console.log(`=== CATEGORY: ${p.category} ===`);
    console.log(`URL: ${p.url}`);
    console.log(`CONTENT:\n${content.trim()}\n`);
});
