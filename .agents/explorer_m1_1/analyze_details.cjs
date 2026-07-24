const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_data.json'), 'utf-8'));

data.forEach(p => {
    console.log(`=== ${p.category} ===`);
    console.log(`URL: ${p.url}`);
    if (p.text) {
        const preview = p.text.substring(0, 300).replace(/\n/g, ' ');
        console.log(`Snippet: ${preview}...`);
    } else {
        console.log(`Snippet: [EMPTY]`);
    }
    console.log('---');
});
