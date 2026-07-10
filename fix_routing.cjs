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

  // The bad string that always throws admin out
  const badTarget = "setView(userRole === 'admin' ? 'admin' : previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'user_profile' ? (userRole || 'landing') : userRole === 'employer' ? 'company' : userRole || 'landing')";
  
  // The good string that respects previousView first!
  const goodTarget = "setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')";
  
  // Replace all occurrences
  code = code.split(badTarget).join(goodTarget);

  fs.writeFileSync(file, code);
  console.log('Fixed routing in ' + file);
}

// Now fix AcademicStaffFeed Logo
let academicCode = fs.readFileSync('src/components/AcademicStaffFeed.jsx', 'utf8');
academicCode = academicCode.replace(
  /onClick=\{\(\) => setView\(userRole === 'admin' \? 'admin' : 'academic'\)\}/g,
  "onClick={() => setActiveTab('feed')}"
);
fs.writeFileSync('src/components/AcademicStaffFeed.jsx', academicCode);
console.log('Fixed AcademicStaffFeed Logo');

