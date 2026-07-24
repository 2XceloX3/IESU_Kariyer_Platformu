const fs = require('fs');
const path = require('path');

const rawHtml = fs.readFileSync(path.join(__dirname, 'page_raw.html'), 'utf-8');

console.log('HTML Length:', rawHtml.length);

// Extract title
const titleMatch = rawHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1].trim() : 'N/A');

// Clean html tags for text extraction or extract main content area
// Let's find head, body, links, images
const imgMatches = [];
const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
let m;
while ((m = imgRegex.exec(rawHtml)) !== null) {
    imgMatches.push(m[1]);
}
console.log('Found Images count:', imgMatches.length);

const linkMatches = [];
const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
while ((m = linkRegex.exec(rawHtml)) !== null) {
    const href = m[1];
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (href && text) {
        linkMatches.push({ href, text });
    }
}
console.log('Found Links count:', linkMatches.length);

// Filter career office related links or subpages
const careerLinks = linkMatches.filter(l => 
    l.href.includes('kariyer') || 
    l.href.includes('koordinator') || 
    l.href.includes('icerik') || 
    l.text.toLowerCase().includes('kariyer') ||
    l.text.toLowerCase().includes('duyuru') ||
    l.text.toLowerCase().includes('haber') ||
    l.text.toLowerCase().includes('etkinlik') ||
    l.text.toLowerCase().includes('personel') ||
    l.text.toLowerCase().includes('kadro')
);

console.log('Relevant Career Links count:', careerLinks.length);
console.log(JSON.stringify(careerLinks, null, 2));
