const fs = require('fs');
let code = fs.readFileSync('src/components/StudentFeed.jsx', 'utf8');

const target = '  const handleExpertiseChange = (area) => {';
const addition = `function StudentFeedRaw({ setView, posts, setPosts, surveys, userRole, news, events, students, alumni, companies }) {
  const [activeTab, setActiveTab] = useState('feed'); // feed, jobs, network
  const [searchQuery, setSearchQuery] = useState('');
  const [votedSurveys, setVotedSurveys] = useState({}); // Track local votes
  const [showMentorApplyModal, setShowMentorApplyModal] = useState(false);
  const [mentorApplyForm, setMentorApplyForm] = useState({ institution: '', title: '', experience: '', expertise: [], model: 'Online', linkedin: '' });

  const networkSuggestions = [
    ...(alumni || []).map(a => ({ name: a.name, title: (a.department || 'Bölüm') + ' Mezunu' })),
    ...(students || []).map(s => ({ name: s.name, title: (s.department || 'Bölüm') + ' Öğrencisi' }))
  ].slice(0, 4);

  const handleMentorApply = (e) => {
    e.preventDefault();
    alert('Başvurunuz başarıyla Kariyer Ofisine iletildi! Eşleştirme yapıldığında bilgilendirileceksiniz.');
    setShowMentorApplyModal(false);
    setMentorApplyForm({ institution: '', title: '', experience: '', expertise: [], model: 'Online', linkedin: '' });
  };

`;

code = code.replace(target, addition + target);
fs.writeFileSync('src/components/StudentFeed.jsx', code, 'utf8');
