const fs = require('fs');
let line = fs.readFileSync('C:/Users/celil/.gemini/antigravity/scratch/BiggestAdmin.txt', 'utf8');

fs.writeFileSync('C:/Users/celil/.gemini/antigravity/scratch/BiggestAdmin_Formatted.json', JSON.stringify(JSON.parse(line), null, 2), 'utf8');
console.log('Saved Formatted JSON!');
