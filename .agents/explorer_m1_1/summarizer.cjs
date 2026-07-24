const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_data.json'), 'utf-8'));

console.log(`Total Pages Crawled: ${data.length}`);

let report = `# Extracted Web Data: İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi Koordinatörlüğü

**Source URL**: https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu  
**Extraction Date**: 2026-07-24  
**Extraction Scope**: Full Extraction Mode (Main Page & 32 Subpages)  

---

## Executive Summary & Key Metadata

- **Institution**: İstanbul Esenyurt Üniversitesi (İESÜ)
- **Unit**: Kariyer Geliştirme Ofisi Koordinatörlüğü
- **Total Pages Scraped**: ${data.length} pages
- **Core Sections Extracted**:
  - Vizyon & Misyon
  - Biz Kimiz & Koordinatörün Mesajı
  - Ekip Üyeleri (Kadro)
  - Kariyer Danışmanlığı & Hizmetler
  - Staj ve İş İlanları (T.C. Ulusal Staj Programı, Gönüllü Staj, vb.)
  - Mezun Takip & Mentorluk Programı
  - Yetenek Kapısı Portalı
  - Haberler, Duyurular ve Etkinlikler
  - Formlar, Belgeler ve Yönergeler
  - Medya & Görseller (Logo, Fotoğraflar, Şemalar)

---

## Detailed Content by Category

`;

data.forEach((page, idx) => {
    report += `### ${idx + 1}. ${page.category}\n`;
    report += `- **URL**: ${page.url}\n`;
    report += `- **HTTP Status**: ${page.status}\n`;
    report += `- **Text Content Length**: ${page.textLength || 0} chars\n`;
    
    if (page.images && page.images.length > 0) {
        report += `- **Images (${page.images.length})**:\n`;
        page.images.slice(0, 10).forEach(img => {
            report += `  - ![${img.alt || 'image'}](${img.src})\n`;
        });
        if (page.images.length > 10) report += `  - ...and ${page.images.length - 10} more images\n`;
    }
    
    if (page.files && page.files.length > 0) {
        report += `- **Attached Files (${page.files.length})**:\n`;
        page.files.forEach(f => {
            report += `  - [${f.text || 'File'}](${f.href})\n`;
        });
    }

    report += `\n**Extracted Content Text**:\n\n\`\`\`text\n${page.text || 'No text content extracted or empty page.'}\n\`\`\`\n\n---\n\n`;
});

fs.writeFileSync(path.join(__dirname, 'extracted_web_data.md'), report, 'utf-8');
console.log('Saved extracted_web_data.md');
