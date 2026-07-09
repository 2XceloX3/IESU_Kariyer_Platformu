const fs = require('fs');

for (const file of ['src/components/admin/panels/VolunteerPanel.jsx', 'src/components/admin/panels/JobPanel.jsx']) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.split('\\`').join('\`');
  code = code.split('\\$').join('\$');
  fs.writeFileSync(file, code);
}
