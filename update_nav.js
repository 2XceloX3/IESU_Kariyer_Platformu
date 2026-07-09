const fs = require('fs');
const path = require('path');

const newNavIcon = const NavIcon = ({ icon, label, badge, active, onClick }) => (
  <button 
    onClick={onClick}
    className={\elative flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-14 rounded-2xl transition-all duration-300 group \\}
    title={label}
  >
    {React.cloneElement(icon, { size: active ? 22 : 20, className: \\\mb-1 transition-transform duration-300 \\\\ })}
    <span className={\	ext-[9px] font-bold tracking-wide transition-all duration-300 \\}>
      {label}
    </span>
    {badge > 0 && (
      <span className="absolute top-1 right-2 sm:right-3 w-4 h-4 bg-iesu-red text-white text-[9px] flex items-center justify-center rounded-full font-bold shadow-sm ring-2 ring-white">
        {badge > 9 ? '9+' : badge}
      </span>
    )}
  </button>
);;

const files = [
    'src/components/StudentFeed.jsx',
    'src/components/AlumniFeed.jsx',
    'src/components/CompanyFeed.jsx',
    'src/components/AcademicStaffFeed.jsx',
    'src/components/UserProfile.jsx',
    'src/components/NotificationsPanel.jsx',
    'src/components/MessagingInterface.jsx'
];

files.forEach(file => {
    const filepath = path.join(process.cwd(), file);
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    const regex = /const NavIcon = \([^)]*\)\s*=>\s*\([\s\S]*?\n\s*\);/;
    
    if (regex.test(content)) {
        content = content.replace(regex, newNavIcon);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('Replaced in ' + file);
    } else {
        console.log('Not found in ' + file);
    }
});
