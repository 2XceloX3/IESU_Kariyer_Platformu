const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_data.json'), 'utf-8'));

['Biz Kimiz', 'Koordinatörün Mesajı', 'Misyon & Vizyon'].forEach(cat => {
    const page = data.find(d => d.category === cat);
    if (page) {
        console.log(`=== ${cat} ===`);
        console.log(page.text);
        console.log('\n');
    }
});
