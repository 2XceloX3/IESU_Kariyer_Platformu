const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_data.json'), 'utf-8'));

data.forEach(p => {
    // Strip header and footer boilerplate
    let text = p.text || '';
    // Find content between header menu and footer
    const startIndex = text.indexOf('Ana Sayfa');
    if (startIndex !== -1) {
        text = text.substring(startIndex);
    }
    const footerIndex = text.indexOf('İletişim Bilgileri');
    if (footerIndex !== -1) {
        text = text.substring(0, footerIndex);
    }
    
    console.log(`========================================`);
    console.log(`CATEGORY: ${p.category}`);
    console.log(`URL: ${p.url}`);
    console.log(`----------------------------------------`);
    console.log(text.trim());
    console.log(`\n`);
});
