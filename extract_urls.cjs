const fs = require('fs');
const c = fs.readFileSync('C:/Users/celil/.gemini/antigravity/brain/a8fbbcb9-3925-4d95-8121-c5241d9a59ec/.system_generated/steps/9138/content.md', 'utf8');
const urls = c.match(/https?:\/\/[^\s"'()<>]+?\.(?:png|jpg|jpeg)/gi);
fs.writeFileSync('sem_urls.txt', urls ? [...new Set(urls)].join('\n') : 'none');
console.log('Extracted URLs to sem_urls.txt');
