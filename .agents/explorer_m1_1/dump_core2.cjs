const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_data.json'), 'utf-8'));

const targets = [
    'Misyon & Vizyon', 'Biz Kimiz', 'Ekip Üyeleri (Kadro)', 
    'Koordinatörün Mesajı', 'Kariyer Merkezi Yönergesi', 'İletişim'
];

data.filter(d => targets.includes(d.category)).forEach(p => {
    let raw = p.text || '';
    console.log(`=== CATEGORY: ${p.category} ===`);
    console.log(`URL: ${p.url}`);
    console.log(`RAW LENGTH: ${raw.length}`);
    console.log(`FULL TEXT:\n${raw}\n`);
});
