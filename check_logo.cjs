const fs = require('fs');
const svg = fs.readFileSync('public/logo.svg', 'utf8');
const pngSize = fs.statSync('public/logo.png').size;
console.log('logo.png size:', pngSize);
console.log('SVG has currentColor:', svg.includes('currentColor'));
console.log('SVG has fill:#:', svg.includes('fill:#'));
const idx = svg.indexOf('fill');
console.log('First fill occurrence:', svg.substring(idx, idx + 80));
