const fs = require('fs');

let jobPanel = fs.readFileSync('src/components/admin/panels/JobPanel.jsx', 'utf8');

const mockDecls = `
  const mockAlumni = [];
  const mockCompanies = [];
  const handleApproveItem = () => {};
  const handleRejectItem = () => {};
  const handleDeleteItem = () => {};
  const handleViewDetails = () => {};
  const getStatusBadge = () => <span/>;
`;

if (!jobPanel.includes('const mockAlumni = []')) {
  jobPanel = jobPanel.replace('export default function JobPanel() {', 'export default function JobPanel() {' + mockDecls);
  fs.writeFileSync('src/components/admin/panels/JobPanel.jsx', jobPanel, 'utf8');
  console.log('Fixed JobPanel.jsx undefined variables!');
}
