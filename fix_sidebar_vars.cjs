const fs = require('fs');
let code = fs.readFileSync('src/components/admin/Sidebar.jsx', 'utf8');

const mockVars = `
  const pendingPosts = [];
  const pendingAlumni = [];
`;

code = code.replace(
  'export default function Sidebar({ activeTab, setActiveTab, setView }) {',
  'export default function Sidebar({ activeTab, setActiveTab, setView }) {' + mockVars
);

fs.writeFileSync('src/components/admin/Sidebar.jsx', code, 'utf8');
console.log('Fixed pendingPosts ReferenceError!');
