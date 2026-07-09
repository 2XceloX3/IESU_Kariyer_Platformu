const fs = require('fs');

let replaceModals = fs.readFileSync('replace_modals.cjs', 'utf8');
const jobModalStart = replaceModals.indexOf('{/* Job Publishing Modal (Live Preview & File Upload) */}');
const jobModalEnd = replaceModals.indexOf('{/* Voluntary Internship Modal */}');
const jobModal = replaceModals.substring(jobModalStart, jobModalEnd);

let jobPanel = fs.readFileSync('src/components/admin/panels/JobPanel.jsx', 'utf8');
jobPanel = jobPanel.replace('import { Briefcase, Download, Globe, Building2 } from \'lucide-react\';', 
  'import { Briefcase, Download, Globe, Building2, X, UploadCloud, CheckCircle, Eye, Building, MapPin } from \'lucide-react\';');
jobPanel = jobPanel.replace('const [jobs, setJobs] = useState([', 
  'const [showJobModal, setShowJobModal] = useState(false);\n  const [editingJob, setEditingJob] = useState(null);\n  const [jobForm, setJobForm] = useState({ title: \'\', company: \'\', type: \'TAM ZAMANLI\', location: \'\', description: \'\', poster: \'\' });\n  const handleSaveJob = (e) => { e.preventDefault(); setShowJobModal(false); alert(\'Ýlan kaydedildi!\'); };\n  const [jobs, setJobs] = useState([');

jobPanel = jobPanel.replace('return (\n    <div className=\"animate-fade-in pb-10\">', 
  'return (\n    <div className=\"animate-fade-in pb-10\">\n' + jobModal);

jobPanel = jobPanel.replace('<button className=\"flex items-center gap-2 bg-gradient-to-r',
  '<button onClick={() => setShowJobModal(true)} className=\"flex items-center gap-2 bg-gradient-to-r');

fs.writeFileSync('src/components/admin/panels/JobPanel.jsx', jobPanel);

const volModalStart = replaceModals.indexOf('{/* Voluntary Internship Modal */}');
const volModalEnd = replaceModals.lastIndexOf('</div>'); // Actually we just take everything until the end
let volModal = replaceModals.substring(volModalStart);
// clean up the last closing tags
volModal = volModal.replace('</div>\n  );\n}', '');

let volPanel = fs.readFileSync('src/components/admin/panels/VolunteerPanel.jsx', 'utf8');
volPanel = volPanel.replace('import { Globe, Download, Users } from \'lucide-react\';',
  'import { Globe, Download, Users, X, Info, Link } from \'lucide-react\';');
volPanel = volPanel.replace('const [volunteers, setVolunteers] = useState([',
  'const [showVoluntaryInternshipModal, setShowVoluntaryInternshipModal] = useState(false);\n  const [voluntaryForm, setVoluntaryForm] = useState({ title: \'\', company: \'\', description: \'\', link: \'\' });\n  const [volunteers, setVolunteers] = useState([');

volPanel = volPanel.replace('return (\n    <div className=\"animate-fade-in pb-10\">',
  'return (\n    <div className=\"animate-fade-in pb-10\">\n' + volModal);

volPanel = volPanel.replace('<button className=\"flex items-center gap-2 bg-gradient-to-r',
  '<button onClick={() => setShowVoluntaryInternshipModal(true)} className=\"flex items-center gap-2 bg-gradient-to-r');

fs.writeFileSync('src/components/admin/panels/VolunteerPanel.jsx', volPanel);

console.log('Panels updated successfully!');
