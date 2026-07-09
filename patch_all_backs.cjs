const fs = require('fs');

function patchFile(filePath, isAicv) {
  let c = fs.readFileSync(filePath, 'utf8');

  // Fix props
  if (isAicv && !c.includes('userRole')) {
    c = c.replace(/export default function AICVBuilder\(\{ currentUser \}\) \{/, "export default function AICVBuilder({ currentUser, setView, userRole }) {");
  }

  // Find all onClick={() => setView(...)} or onClick={() => { if(typeof setView ... ) ... }}
  // The easiest is just replace ANY back button logic that sets view to landing/userRole with the safe version.
  
  const safeGoBack = `onClick={() => {
            if (typeof setView === 'function') {
              if (!userRole) { setView('landing'); }
              else if (userRole === 'employer') { setView('company'); }
              else { setView(userRole); }
            }
          }}`;

  // For UserProfile
  c = c.replace(/onClick=\{\(\) => setView\([^)]+\)\}/g, safeGoBack);
  
  // For the ones patched by my previous script
  c = c.replace(/onClick=\{\(\) => \{\s*if\s*\(typeof setView === 'function'\)\s*setView\(\(typeof userRole !== 'undefined' && userRole\)\s*\?\s*\(userRole === 'admin'\s*\?\s*'admin'\s*:\s*userRole\)\s*:\s*'landing'\);\s*\}\}/g, safeGoBack);

  fs.writeFileSync(filePath, c);
  console.log(`Patched ${filePath}`);
}

patchFile('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\components\\UserProfile.jsx', false);
patchFile('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\components\\NewsEvents.jsx', false);
patchFile('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\components\\ApplicationsPanel.jsx', false);
patchFile('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\components\\AICVBuilder.jsx', true);
patchFile('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\components\\MessagingInterface.jsx', false);
