const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'branding_violations.json'), 'utf8'));

const byFile = {};
const byRule = {};

data.forEach(v => {
  byFile[v.file] = (byFile[v.file] || 0) + 1;
  byRule[v.rule] = (byRule[v.rule] || 0) + 1;
});

console.log('=== Violations by Rule ===');
console.log(JSON.stringify(byRule, null, 2));

console.log('\n=== Violations by File ===');
console.log(JSON.stringify(byFile, null, 2));
