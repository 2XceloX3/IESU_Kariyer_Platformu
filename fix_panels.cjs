const fs = require('fs');

const filesToUpdate = [
  'src/components/JobsAndInternships.jsx',
  'src/components/NotificationsPanel.jsx',
  'src/components/MessagingInterface.jsx',
  'src/components/GroupsPanel.jsx',
  'src/components/UserProfile.jsx'
];

for (const file of filesToUpdate) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');

  // Replace old setView string with the context-aware one
  const oldTarget = /setView\(userRole === 'admin' \? 'admin' : userRole === 'employer' \? 'company' : userRole \|\| 'landing'\)/g;
  const newTarget = "setView(userRole === 'admin' ? 'admin' : previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'user_profile' ? (userRole || 'landing') : userRole === 'employer' ? 'company' : userRole || 'landing')";
  code = code.replace(oldTarget, newTarget);
  
  // Also fix the standalone logo routing in NotificationsPanel
  const oldTarget2 = /setView\(userRole === 'admin' \? 'admin' : \(userRole \|\| 'landing'\)\)/g;
  code = code.replace(oldTarget2, newTarget);

  fs.writeFileSync(file, code);
  console.log('Updated ' + file);
}
