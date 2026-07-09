const fs = require('fs');

function cleanFile(f) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/\\`/g, '`');
  c = c.replace(/\\\$/g, '$');
  fs.writeFileSync(f, c, 'utf8');
  console.log('Cleaned backslashes in', f);
}

const dir = 'src/components/admin/panels/';
const files = fs.readdirSync(dir);
for(const f of files) {
  cleanFile(dir + f);
}
cleanFile('src/components/admin/Sidebar.jsx');
