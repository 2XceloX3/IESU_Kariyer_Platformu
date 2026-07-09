const fs = require('fs');
let code = fs.readFileSync('reconstructed_admin.jsx', 'utf8');

// Also remove the VIEW_FILE output prefix:
// "content":"Created At: 2026-07-06T10:44:58Z\nCompleted At: 2026-07-06T10:45:00Z\n\n\t\t\t\tThe command completed successfully.\n\t\t\t\tOutput:\n\t\t\t\t\n> iesukariyer@0.0.0 build...
const startIdx = code.indexOf('import React');
if(startIdx > -1) {
    code = code.substring(startIdx);
}

// Remove ephemeral messages
const regex = /The following is an <EPHEMERAL_MESSAGE>[\s\S]*?<\/EPHEMERAL_MESSAGE>/g;
code = code.replace(regex, '');

fs.writeFileSync('reconstructed_admin_clean.jsx', code, 'utf8');
console.log('Cleaned reconstructed_admin.jsx!');
