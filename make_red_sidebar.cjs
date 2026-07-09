const fs = require('fs');

let redCode = fs.readFileSync('red_sidebar.txt', 'utf8');

// The `red_sidebar.txt` code has some EPHEMERAL_MESSAGE at the bottom, let's strip it!
const ephemIdx = redCode.indexOf('The following is an <EPHEMERAL_MESSAGE>');
if (ephemIdx > -1) {
  redCode = redCode.substring(0, ephemIdx).trim();
}

const sidebarCode = `import React from 'react';
import { 
  LayoutDashboard, Users, Briefcase, Calendar, 
  MessageSquareQuote, Layout, Trash2, LogOut,
  HelpCircle, Building, CreditCard, Newspaper, BarChart3, Network, Building2, Settings
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, setView }) {
  const SidebarButton = ({ active, onClick, icon, label, badge, pendingCount }) => (
    <button onClick={onClick} className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold \${active ? 'bg-white text-iesu-red shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}\`}>
      {icon} {label}
      {(badge > 0 || pendingCount > 0) && (
        <span className="ml-auto bg-white text-iesu-red text-[10px] px-2 py-0.5 rounded-full font-black min-w-[20px] text-center">
          {badge || pendingCount}
        </span>
      )}
    </button>
  );

  return (
    ${redCode}
  );
}
`;
fs.writeFileSync('src/components/admin/Sidebar.jsx', sidebarCode, 'utf8');
console.log('Sidebar replaced with red metallic!');

const panelsDir = 'src/components/admin/panels/';
const files = fs.readdirSync(panelsDir);
for(const f of files) {
  let c = fs.readFileSync(panelsDir + f, 'utf8');
  c = c.replace(/\uFFFD/g, 'i');
  // Handle invalid unicode escapes.
  // We'll just replace the literal string "\u" that is followed by anything other than 4 hex digits.
  c = c.replace(/\\u(?=[^0-9a-fA-F]|$)/g, 'i');
  // specifically fix the mentorship string issue
  c = c.replace(/\\u/g, ''); 
  fs.writeFileSync(panelsDir + f, c, 'utf8');
}
console.log('Fixed encodings!');
