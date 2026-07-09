const fs = require('fs');

let code = fs.readFileSync('C:/Users/celil/.gemini/antigravity/scratch/admin_step_5201.jsx', 'utf8');

// FIX 1: logo.svg -> logo.png (svg renders invisible on red bg)
code = code.replace(/src="\/logo\.svg"/g, 'src="/logo.png"');
code = code.replace(/src='\/logo\.svg'/g, "src='/logo.png'");

// FIX 2: min-h-screen -> h-screen overflow-hidden  (kills the page scrollbar)
code = code.replace(
  '"h-screen overflow-hidden bg-gray-50 flex font-sans"',
  '"h-screen overflow-hidden bg-gray-50 flex font-sans"'
);
// catch all variants
code = code.replace(/className="min-h-screen bg-gray-50 flex font-sans text-gray-900"/g,
  'className="h-screen overflow-hidden bg-gray-50 flex font-sans text-gray-900"');
code = code.replace(/className="min-h-screen bg-gray-50 flex font-sans"/g,
  'className="h-screen overflow-hidden bg-gray-50 flex font-sans"');

// FIX 3: Fix Turkish character corruptions
const fixes = [
  [/şılmaz/g, 'Yılmaz'],   [/şazılım/g, 'Yazılım'],
  [/\bşeni /g, 'Yeni '],    [/şayınla/g, 'Yayınla'],
  [/şayında/g, 'Yayında'],  [/\bşayın\b/g, 'Yayın'],
  [/şaklaşan/g, 'Yaklaşan'],[/şönetim/g, 'Yönetim'],
  [/\bşap\b/g, 'Yap'],      [/gradşear/g, 'gradYear'],
];
fixes.forEach(([pat, rep]) => { code = code.replace(pat, rep); });

// FIX 4: Make sure root wrapper has overflow-hidden
if (!code.includes('h-screen overflow-hidden')) {
  code = code.replace('className="h-screen', 'className="h-screen overflow-hidden');
}

// Write final file
fs.writeFileSync('src/components/AdminDashboard.jsx', code, 'utf8');
console.log('Written:', code.length, 'bytes,', code.split('\n').length, 'lines');

// Verify
const checks = [
  'STUDENTS', 'ALUMNI', 'COMPANIES',
  'EtkinlikPanel', 'MentorlukPanel', 'GonulluPanel',
  'OperasyonPanel', 'AkademikPanel', 'FirmaPanel',
  'SEMPanel', 'AnketPanel', 'OrgPanel',
  'IlanPanel', 'IcerikPanel', 'MesajlarPanel',
  'logo.png', 'YÖNETİM MERKEZİ',
  'Kontrol Merkezi', 'Operasyon Özeti', 'Firma Bilgi Havuzu',
];
let allOk = true;
checks.forEach(f => {
  const ok = code.includes(f);
  if (!ok) { console.log('MISSING:', f); allOk = false; }
});
if (allOk) console.log('✓ ALL FEATURES VERIFIED!');
