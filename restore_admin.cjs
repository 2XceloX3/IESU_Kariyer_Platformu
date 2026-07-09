const fs = require('fs');

// Load the best version (step 5167 - 58822 bytes with all features including preview)
let code = fs.readFileSync('C:/Users/celil/.gemini/antigravity/scratch/admin_step_5167.jsx', 'utf8');

// ── FIX 1: Logo - use logo.png instead of logo.svg (svg renders invisible on red bg)
code = code.replace(/src="\/logo\.svg"/g, 'src="/logo.png"');
code = code.replace(/src='\/logo\.svg'/g, "src='/logo.png'");

// ── FIX 2: Remove scrollbar from body/html - handled in CSS
// Fix the root container to use h-screen overflow-hidden
code = code.replace(/min-h-screen bg-gray-50 flex font-sans text-gray-900/g, 'h-screen overflow-hidden bg-gray-50 flex font-sans text-gray-900');
code = code.replace(/min-h-screen bg-gray-50 flex font-sans/g, 'h-screen overflow-hidden bg-gray-50 flex font-sans');

// ── FIX 3: Fix any "ş" character corruption (Y -> ş issue)
code = code.replace(/şılmaz/g, 'Yılmaz')
           .replace(/şazılım/g, 'Yazılım')
           .replace(/şeni /g, 'Yeni ')
           .replace(/\bşeni\b/g, 'Yeni')
           .replace(/şayınla/g, 'Yayınla')
           .replace(/şayında/g, 'Yayında')
           .replace(/\bşayın\b/g, 'Yayın')
           .replace(/şaklaşan/g, 'Yaklaşan')
           .replace(/şönetimi/g, 'Yönetimi')
           .replace(/şönetici/g, 'Yönetici')
           .replace(/\bşap\b/g, 'Yap');

// ── FIX 4: Make sidebar overflow-y scrollable but no scrollbar
code = code.replace(/overflow-y-auto p-4 space-y-1\.5 no-scrollbar/g, 'overflow-y-auto p-4 space-y-0.5');
code = code.replace(/overflow-y-auto custom-scrollbar/g, 'overflow-y-auto');

// Write the fixed file
fs.writeFileSync('src/components/AdminDashboard.jsx', code, 'utf8');
console.log('SUCCESS! Written', code.length, 'bytes to AdminDashboard.jsx');
console.log('Lines:', code.split('\n').length);

// Verify key features
const features = ['EtkinlikPanel', 'preview', 'MentorlukPanel', 'OperasyonPanel', 'FirmaPanel', 'AkademikPanel', 'AnketPanel', 'OrgPanel', 'GonulluPanel'];
features.forEach(f => {
  console.log(f + ':', code.includes(f) ? '✓' : '✗ MISSING');
});
