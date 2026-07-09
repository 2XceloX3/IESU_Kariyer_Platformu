const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');

const stateInjection = `
  const [showVoluntaryInternshipModal, setShowVoluntaryInternshipModal] = useState(false);
  const [voluntaryForm, setVoluntaryForm] = useState({ title: '', company: '', location: '', description: '', link: '' });

  const [showMentorFormBuilder, setShowMentorFormBuilder] = useState(false);
  const [mentorFormFields, setMentorFormFields] = useState([
    { id: 1, type: 'text', label: 'Bölümünüz', required: true },
    { id: 2, type: 'select', label: 'Sınıfınız', options: '1. Sınıf, 2. Sınıf, 3. Sınıf, 4. Sınıf, Mezun', required: true },
    { id: 3, type: 'textarea', label: 'Kariyer Hedefiniz Nelerdir?', required: true },
    { id: 4, type: 'textarea', label: 'Hangi konularda mentorluk almak istiyorsunuz?', required: true }
  ]);
`;

const target = 'const [showJobModal, setShowJobModal] = useState(false);';
code = code.replace(target, stateInjection + '\n  ' + target);

fs.writeFileSync('src/components/AdminDashboard.jsx', code, 'utf8');
