const fs = require('fs');
let code = fs.readFileSync('src/components/admin/panels/OverviewPanel.jsx', 'utf8');

const imports = code.match(/import\s+.*?\s+from\s+['"].*?['"]/g);
console.log('Imports in Overview:', imports);
