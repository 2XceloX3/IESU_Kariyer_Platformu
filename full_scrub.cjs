const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir(targetDir);
let totalReplaced = 0;

const replacements = [
    // Üniversite isim düzeltmeleri
    ['İstanbul Gelişim Üniversitesi', 'İstanbul Esenyurt Üniversitesi'],
    ['Istanbul Gelisim Universitesi', 'İstanbul Esenyurt Üniversitesi'],
    ['Gelişim Üniversitesi', 'İstanbul Esenyurt Üniversitesi'],
    ['Gelisim Universitesi', 'İstanbul Esenyurt Üniversitesi'],
    // Kısaltma düzeltmeleri
    ['İGÜ', 'İESÜ'],
    ['IGU', 'IESU'],
    ['İGÜ\'', 'İESÜ\''],
    // Domain düzeltmeleri
    ['gelisim.edu.tr', 'esenyurt.edu.tr'],
    ['gelişim.edu.tr', 'esenyurt.edu.tr'],
    // Genel isim düzeltmeleri (büyük harf)
    ['GELİŞİM', 'ESENYURT'],
    ['GELISIM', 'ESENYURT'],
    // Genel isim düzeltmeleri (küçük harf)
    ['gelisim', 'esenyurt'],
    ['gelişim', 'esenyurt'],
    // CDN/URL düzeltmeleri
    ['cdn.gelisim.edu.tr', 'www.esenyurt.edu.tr'],
    ['cdn.igu.edu.tr', 'www.esenyurt.edu.tr'],
    ['panel.igu.edu.tr', 'www.esenyurt.edu.tr'],
    ['cdn.iesu.edu.tr', 'www.esenyurt.edu.tr'],
    // Eski marka isimleri
    ['IGÜ', 'İESÜ'],
    ['ığu', 'iesü'],
];

files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;

    replacements.forEach(([from, to]) => {
        content = content.split(from).join(to);
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        totalReplaced++;
        console.log(`✓ Temizlendi: ${path.basename(file)}`);
    }
});

console.log(`\n✅ TAMAMLANDI: ${totalReplaced} dosya temizlendi.`);
