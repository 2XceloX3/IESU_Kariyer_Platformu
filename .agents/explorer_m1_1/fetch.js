const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu';

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
    },
    rejectUnauthorized: false
};

console.log('Fetching:', url);

https.get(url, options, (res) => {
    console.log('StatusCode:', res.statusCode);
    console.log('Headers:', res.headers);

    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const outPath = path.join(__dirname, 'page_raw.html');
        fs.writeFileSync(outPath, data, 'utf-8');
        console.log(`Saved ${data.length} bytes to ${outPath}`);
    });
}).on('error', (err) => {
    console.error('Fetch Error:', err);
});
