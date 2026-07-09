const fs = require('fs');
let code = fs.readFileSync('src/components/admin/Sidebar.jsx', 'utf8');

const correctImports = `import { 
  Globe, Building2, LayoutDashboard, Users, GraduationCap, Heart, 
  Briefcase, FileCheck, Award, Network, CreditCard, Newspaper, 
  Send, MessageSquareQuote, Settings, LogOut
} from 'lucide-react';`;

code = code.replace(/import \{[\s\S]*?\} from 'lucide-react';/, correctImports);
fs.writeFileSync('src/components/admin/Sidebar.jsx', code, 'utf8');
console.log('Fixed missing lucide-react imports!');
