const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_data.json'), 'utf-8'));

const kadro = data.find(d => d.category.includes('Ekip') || d.category.includes('Kadro'));
if (kadro) {
    console.log('Kadro URL:', kadro.url);
    console.log('Status:', kadro.status);
    console.log('Text:\n', kadro.text);
} else {
    console.log('Kadro not found in json');
}
