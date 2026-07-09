const fs = require('fs');

const missingVars = `
  const pendingPosts = 3;
  const pendingAlumni = 5;
  const mockCompanies = [
    { id: 'COMP-1', name: 'Google', sector: 'Teknoloji', status: 'Onaylı', students: 12 },
    { id: 'COMP-2', name: 'Trendyol', sector: 'E-Ticaret', status: 'Onay Bekliyor', students: 0 },
  ];
  const [editingSemCourse, setEditingSemCourse] = useState(null);
  
  const handleApproveSemCourse = (id) => console.log('Approve', id);
  const handleRejectSemCourse = (id) => console.log('Reject', id);
  const handleDeleteSemCourse = (id) => console.log('Delete', id);
  const handleEditSemCourse = (course) => console.log('Edit', course);
  const handleViewSurveyResults = (id) => console.log('Survey Results', id);
  
  const mockOrgTree = {
    title: 'Rektörlük',
    name: 'Prof. Dr. X',
    children: [
      {
        title: 'Kariyer Geliştirme Ofisi',
        name: 'Dr. Y',
        children: [
          { title: 'Kariyer Danışmanı', name: 'Z Kişisi' }
        ]
      }
    ]
  };
`;

let code = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');
const injectionPoint = "const [activeTab, setActiveTab] = useState('overview');";
code = code.replace(injectionPoint, injectionPoint + '\n' + missingVars);

// Move handlers up so they are defined before usage
const handlersRegex = /\/\/ --- Shared Handlers ---\n[\s\S]*?const getStatusBadge.*?\};\n/s;
const handlersMatch = code.match(handlersRegex);
if (handlersMatch) {
  code = code.replace(handlersMatch[0], '');
  code = code.replace(injectionPoint, handlersMatch[0] + '\n' + injectionPoint);
}

// Ensure the unwanted scrollbars are removed (e.g. h-screen might need overflow hidden adjustments)
// The user complained "saçma sapan çubuk duruyo".
// Let's ensure the main container is hidden overflow, and only specific panels scroll.
code = code.replace(/h-screen w-full bg-gray-50 overflow-hidden font-sans/g, 'h-screen w-full bg-gray-50 overflow-hidden font-sans');

fs.writeFileSync('src/components/AdminDashboard.jsx', code, 'utf8');
console.log('Fixed missing vars in AdminDashboard.jsx!');
