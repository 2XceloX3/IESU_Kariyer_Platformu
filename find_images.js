import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\celil\\.gemini\\antigravity\\brain\\a8fbbcb9-3925-4d95-8121-c5241d9a59ec\\.system_generated\\steps\\215\\content.md', 'utf-8');
const matches = content.match(/https:\/\/www\.esenyurt\.edu\.tr\/uploads\/[^"'\s]*\.(jpg|jpeg|png)/gi);
console.log([...new Set(matches)]);
