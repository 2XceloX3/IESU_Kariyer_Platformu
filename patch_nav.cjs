const fs = require('fs');

const files = ['AlumniFeed.jsx', 'StudentFeed.jsx', 'CompanyFeed.jsx', 'AcademicStaffFeed.jsx'];

const newNavIcon = `// Helper component for Navbar Icons
const NavIcon = ({ icon, label, badge, active, onClick }) => (
  <button onClick={onClick} className={\`flex flex-col items-center justify-center min-w-[56px] gap-1 p-1 sm:p-2 transition-all relative rounded-xl \${active ? 'text-iesu-red' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}\`}>
    <div className={\`flex items-center justify-center transition-transform \${active ? 'scale-110' : ''}\`}>{icon}</div>
    <span className={\`text-[9px] sm:text-[10px] whitespace-nowrap \${active ? 'font-black' : 'font-bold'}\`}>{label}</span>
    {badge > 0 && <span className="absolute top-0 right-0 sm:right-2 w-4 h-4 bg-iesu-red text-white text-[9px] flex items-center justify-center rounded-full font-black ring-2 ring-white">{badge}</span>}
    {active && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-iesu-red rounded-full"></div>}
  </button>
);`;

files.forEach(f => {
  const p = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\components\\' + f;
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/\/\/ Helper component for Navbar Icons\s+const NavIcon = \(\{ icon, label, badge, active, onClick \}\) => \([\s\S]*?<\/button>\s*\);/g, newNavIcon);
    fs.writeFileSync(p, c);
    console.log('Patched NavIcon in', f);
  }
});
