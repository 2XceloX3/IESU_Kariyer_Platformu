const fs = require('fs');
const path = require('path');

const panelsDir = 'src/components/admin/panels';
let allCode = '';
const files = fs.readdirSync(panelsDir);
for (const file of files) {
  if (file.endsWith('.jsx')) {
    allCode += fs.readFileSync(path.join(panelsDir, file), 'utf8') + '\n';
  }
}

// 1. Extract all useState definitions that contain arrays or objects (dummy data)
const stateRegex = /const \[[a-zA-Z0-9_]+,\s*set[a-zA-Z0-9_]+\]\s*=\s*useState\((?:\[.*?\]|\{.*?\})\);/gs;
let states = allCode.match(stateRegex) || [];

// 2. Extract the stats array from OverviewPanel.jsx
const overview = fs.readFileSync(path.join(panelsDir, 'OverviewPanel.jsx'), 'utf8');
const statsMatch = overview.match(/const stats = \[.*?\];/s);
let statsDecl = statsMatch ? statsMatch[0] : '';

// 3. Define the dummy handler functions that panels use
const handlers = `
  const handleApproveItem = (id) => console.log('Approved', id);
  const handleRejectItem = (id) => console.log('Rejected', id);
  const handleDeleteItem = (id) => console.log('Deleted', id);
  const handleViewDetails = (id) => console.log('View Details', id);
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Yayında': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Yayında</span>;
      case 'Beklemede': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Beklemede</span>;
      case 'Aktif': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Aktif</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{status}</span>;
    }
  };
`;

// 4. Combine all the data and fix the Turkish character errors
let combinedData = '\n  // --- Extracted Dummy Data from Panels ---\n' + 
                   states.join('\n\n  ') + 
                   '\n\n  ' + statsDecl + 
                   '\n\n  // --- Shared Handlers ---\n' + handlers + '\n';

const fixText = (text) => {
  return text.replace(/şılmaz/g, 'Yılmaz')
             .replace(/şazılım/g, 'Yazılım')
             .replace(/şeni\b/g, 'Yeni')
             .replace(/şeni /g, 'Yeni ')
             .replace(/şayınla/g, 'Yayınla')
             .replace(/şayında/g, 'Yayında')
             .replace(/şayın\b/g, 'Yayın')
             .replace(/şaklaşan/g, 'Yaklaşan')
             .replace(/şönetimi/g, 'Yönetimi')
             .replace(/şap\b/g, 'Yap')
             .replace(/şönetici/g, 'Yönetici')
             .replace(/şönlendir/g, 'Yönlendir')
             .replace(/gradşear/g, 'gradYear'); // Common typo if Year -> şear
}

combinedData = fixText(combinedData);

// 5. Load ExtractedAdmin.jsx
let adminCode = fs.readFileSync('C:/Users/celil/.gemini/antigravity/scratch/ExtractedAdmin.jsx', 'utf8');
adminCode = fixText(adminCode);

// 6. Fix the Logo
adminCode = adminCode.replace(
  /<h1 className="text-3xl font-black text-iesu-red drop-shadow-sm">İESÜ Admin<\/h1>/g,
  '<img src="/logo.svg" alt="İESÜ Logo" className="h-10 object-contain mb-2" /><h1 className="text-3xl font-black text-iesu-red drop-shadow-sm">İESÜ Admin</h1>'
);

// Remove the `bg-white/80` or anything that leaked in
adminCode = adminCode.replace(/bg-white\/80/g, 'bg-white').replace(/backdrop-blur-xl/g, '');

// Inject the combinedData
const injectionPoint = "const [activeTab, setActiveTab] = useState('overview');";
adminCode = adminCode.replace(injectionPoint, injectionPoint + '\n' + combinedData);

// 7. Write to src/components/AdminDashboard.jsx
fs.writeFileSync('src/components/AdminDashboard.jsx', adminCode, 'utf8');
console.log('Built src/components/AdminDashboard.jsx successfully!');
