const fs = require('fs');

const filesToUpdate = [
  'src/components/NotificationsPanel.jsx',
  'src/components/MessagingInterface.jsx',
  'src/components/GroupsPanel.jsx',
  'src/components/JobsAndInternships.jsx'
];

for (const file of filesToUpdate) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');

  // Fix avatar fallback text
  const oldText = "encodeURIComponent(currentUser?.name || '-Yrenci')";
  // Wait, the encoding is messed up in PowerShell string literals sometimes, I will just use regex to match it loosely.
  const oldRegex = /encodeURIComponent\(currentUser\?\.name\s*\|\|\s*['"][^'"]*['"]\)/g;
  code = code.replace(oldRegex, "encodeURIComponent(currentUser?.name || 'Kullanici')");

  fs.writeFileSync(file, code);
  console.log('Fixed avatar in ' + file);
}
