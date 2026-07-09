import React, { useState } from 'react';
import { Users, Building2, Calendar, FileSpreadsheet, Activity, LayoutDashboard, Settings, LogOut, CheckCircle, XCircle, Send, Image as ImageIcon, Briefcase, ExternalLink, Globe, Newspaper, GraduationCap, Check, X, AlertTriangle, MessageSquareQuote, MoreHorizontal, Heart, Bookmark, ArrowRight, Award, FileCheck, CreditCard, Network, Database, RefreshCw, Loader2, ShieldCheck, UploadCloud, Eye, Trash2, PlusCircle, Edit3, Download, Link, Info, MapPin, Building } from 'lucide-react';
import { generateStudents, generateAlumni, generateCompanies } from '../utils/mockData';
import Logo from './Logo';
export default function AdminDashboard({ setView, posts, setPosts, news, setNews, events, setEvents, semCourses, setSemCourses, surveys, setSurveys, students, setStudents, alumni, setAlumni, companies, setCompanies, academicRole = 'super_admin' }) {
  const [activeTab, setActiveTab] = useState(academicRole === 'content_admin' ? 'news_events' : academicRole === 'mentor_admin' ? 'mentorship' : 'overview'); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [alumniSearch, setAlumniSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
import AlumniAssocPanel from './panels/AlumniAssocPanel';
import AlumniCardPanel from './panels/AlumniCardPanel';
import ConsultingPanel from './panels/ConsultingPanel';
import NewsEventsPanel from './panels/NewsEventsPanel';
import SurveyPanel from './panels/SurveyPanel';
import OrgChartPanel from './panels/OrgChartPanel';
import { generateStudents } from '../../utils/mockData';
    }, 2000);
  };

  const handleDeleteStudent = (id) => {
    if(window.confirm('Bu öğrenciyi sistemden silmek istediğinize emin misiniz?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleDeleteAlumni = (id) => {
    if(window.confirm('Bu mezunu sistemden silmek istediğinize emin misiniz?')) {
      setAlumni(alumni.filter(a => a.id !== id));
    }
  };

  const handleDeleteCompany = (id) => {
    if(window.confirm('Bu firmayı sistemden silmek istediğinize emin misiniz?')) {
      setCompanies(companies.filter(c => c.id !== id));
    }
  };
    setTimeout(() => {
      if (type === 'students') setStudents(generateStudents());
  const handleDeleteCompany = (id) => {
    if(window.confirm('Bu firmayı sistemden silmek istediğinize emin misiniz?')) {
      setCompanies(companies.filter(c => c.id !== id));
    }
  };

  const [jobs, setJobs] = useState([
    { id: 1, title: 'İş ve Staj Danışmanlığı Hizmetleri', type: 'TAM ZAMANLI', company: 'Esenyurt Üniversitesi', date: '21/06/2026', status: 'Yayında', description: 'Öğrencilerimize iş ve staj bulma konusunda danışmanlık hizmeti sunuyoruz.', poster: '' },
    { id: 2, title: 'Ulusal Staj Programı Fırsatları', type: 'STAJ', company: 'Kariyer Kapısı', date: '15/06/2026', status: 'Yayında', description: 'Kariyer Kapısı üzerinden başvurabileceğiniz ulusal staj programları.', poster: '' },
    { id: 3, title: 'Yazılım Mühendisi', type: 'YARI ZAMANLI', company: 'TechNova', date: '10/06/2026', status: 'Beklemede', description: 'Haftada 3 gün çalışacak yarı zamanlı yazılım mühendisi arıyoruz.', poster: '' }
  ]);

  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({ title: '', company: '', type: 'TAM ZAMANLI', location: '', description: '', poster: '' });

  const handleSaveJob = (e) => {
    e.preventDefault();
    if (editingJob) {
      setJobs(jobs.map(j => j.id === editingJob.id ? { ...j, ...jobForm } : j));
    } else {
      const newJob = {
        id: Date.now(),
        ...jobForm,
        date: new Date().toLocaleDateString('tr-TR'),
        status: 'Yayında'
      };
      setJobs([newJob, ...jobs]);
      
      const newPost = {
        id: `job-${Date.now()}`,
        author: {
          name: "Süper Admin (Kariyer Ofisi)",
          title: "İlan / Duyuru",
          avatar: "/iesu-logo.svg"
        },
        time: "Şimdi",
        image: jobForm.poster || null,
        content: `**Yeni İlan:** ${jobForm.title} - ${jobForm.company}\n\n${jobForm.description}`,
        likes: 0,
        comments: 0,
        isJob: true,
        isApproved: true
      };
      setPosts([newPost, ...(posts || [])]);
      alert('İlan başarıyla yayınlandı ve havuza eklendi!');
    }
    setShowJobModal(false);
    setEditingJob(null);
    setJobForm({ title: '', company: '', type: 'TAM ZAMANLI', location: '', description: '', poster: '' });
  };
  
  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      company: job.company || '',
      type: job.type || 'TAM ZAMANLI',
      location: job.location || '',
      description: job.description || '',
      poster: job.poster || ''
    });
    setShowJobModal(true);
  };

  const [showMentorCallModal, setShowMentorCallModal] = useState(false);
  const [mentorCallForm, setMentorCallForm] = useState({ title: 'Kariyer Merkezi Mentorluk Programı Başvuruları Başladı!', description: 'Değerli mezunlarımız, yeni dönem mentorluk programımız için başvurular açılmıştır. Öğrencilerimize yol göstermek ve deneyimlerinizi paylaşmak isterseniz formu doldurabilirsiniz.' });

  const handlePublishMentorCall = (e) => {
    e.preventDefault();
    const newPost = {
      id: `mentor-call-${Date.now()}`,
      author: {
        name: "Süper Admin (Kariyer Ofisi)",
        title: "Mentorluk Programı Çağrısı",
        avatar: "/iesu-logo.svg"
      },
      time: "Şimdi",
      image: null,
      content: `**${mentorCallForm.title}**\n\n${mentorCallForm.description}`,
      likes: 0,
      comments: 0,
      isMentorCall: true,
      isApproved: true
    };
    setPosts([newPost, ...(posts || [])]);
    setShowMentorCallModal(false);
    alert('Mentorluk çağrısı başarıyla mezun akışında yayınlandı!');
  };
  const handleDeleteNewsEvent = (id, type) => {
    if(window.confirm('Bu içeriği sistemden silmek istediğinize emin misiniz?')) {
      if (type === 'haber') setNews(news?.filter(n => n.id !== id) || []);
      else setEvents(events?.filter(e => e.id !== id) || []);
    }
  };

  const handleDeleteJob = (id) => {
    if(window.confirm('Bu ilanı sistemden silmek istediğinize emin misiniz?')) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  const handleDeleteSem = (id) => {
    if(window.confirm('Bu kursu sistemden silmek istediğinize emin misiniz?')) {
      setSemCourses(semCourses?.filter(s => s.id !== id) || []);
    }
  };

  const handleDeletePost = (id) => {
    if(window.confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) {
      setPosts(posts?.filter(p => p.id !== id) || []);
    }
  };

  // Form States (CMS Feed)
  const [newPostContent, setNewPostContent] = useState('');

  const [counselingRequests, setCounselingRequests] = useState([
    { id: 1, name: 'Ahmet Yılmaz', type: 'CV Hazırlama', date: '25/06/2026', status: 'Bekliyor', dept: 'Bilgisayar Müh.' },
    { id: 2, name: 'Ayşe Demir', type: 'Mülakat Simülasyonu', date: '24/06/2026', status: 'Onaylandı', dept: 'İşletme' }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'TechNova İK', subject: 'Stajyer Kontenjanı Hakkında', date: '26/06/2026', status: 'Okunmadı' },
    { id: 2, sender: 'Mehmet Kaya', subject: 'Mezuniyet Sonrası Destek', date: '25/06/2026', status: 'Okundu' }
  ]);

  const handleDeleteCounseling = (id) => {
    if(window.confirm('Bu randevu talebini silmek istediğinize emin misiniz?')) {
      setCounselingRequests(counselingRequests.filter(c => c.id !== id));
    }
  };

  const handleDeleteMessage = (id) => {
    if(window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
      setMessages(messages.filter(m => m.id !== id));
    }
  };

  const [mentorships, setMentorships] = useState([
    { id: 1, mentor: 'Prof. Dr. Ali Yılmaz (Mühendislik)', mentee: 'Ayşe Kaya (Yazılım Müh. 3. Sınıf)', status: 'Aktif', date: '01/06/2026' },
    { id: 2, mentor: 'Zeynep Çelik (TechNova CEO)', mentee: 'Mehmet Demir (Bilgisayar Müh. 4. Sınıf)', status: 'Eşleştirme Bekliyor', date: '20/06/2026' }
  ]);

  const [volunteerInterns, setVolunteerInterns] = useState([
    { id: 1, student: 'Ahmet Yılmaz', department: 'Yazılım Mühendisliği', company: 'Aselsan', duration: '30 İş Günü', status: 'Onay Bekliyor', date: '22/06/2026' },
    { id: 2, student: 'Elif Can', department: 'Psikoloji', company: 'Esenyurt Hastanesi', duration: '20 İş Günü', status: 'Onaylandı', date: '18/06/2026' }
  ]);
  
  const handleDeleteMentorship = (id) => {
    if(window.confirm('Bu eşleştirmeyi silmek istediğinize emin misiniz?')) {
      setMentorships(mentorships.filter(m => m.id !== id));
    }
  };

  const handleDeleteIntern = (id) => {
    if(window.confirm('Bu staj başvurusunu silmek istediğinize emin misiniz?')) {
      setVolunteerInterns(volunteerInterns.filter(v => v.id !== id));
    }
  };

  const [alumniAssocMembers, setAlumniAssocMembers] = useState([]);
  const [alumniCardRequests, setAlumniCardRequests] = useState([]);
  const [orgChartMembers, setOrgChartMembers] = useState([]);
  
  const handleDeleteAlumniAssoc = (id) => {
    if(window.confirm('Bu dernek üyeliğini silmek istediğinize emin misiniz?')) {
      setAlumniAssocMembers(alumniAssocMembers.filter(a => a.id !== id));
    }
  };

  const handleDeleteAlumniCard = (id) => {
    if(window.confirm('Bu kart başvurusunu silmek istediğinize emin misiniz?')) {
      setAlumniCardRequests(alumniCardRequests.filter(c => c.id !== id));
    }
  };

  const handleDeleteOrgChart = (id) => {
    if(window.confirm('Bu personeli şemadan silmek istediğinize emin misiniz?')) {
      setOrgChartMembers(orgChartMembers.filter(o => o.id !== id));
    }
  };
  const [newPostImage, setNewPostImage] = useState('');
  const [isJobPost, setIsJobPost] = useState(false);

  // Form States (Survey)
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyQuestion, setSurveyQuestion] = useState('');

  const handleDeleteSurvey = (id) => {
    if(window.confirm('Bu anketi silmek istediğinize emin misiniz?')) {
      setSurveys(surveys.filter(s => s.id !== id));
    }
  };
      setSurveys(surveys.filter(s => s.id !== id));
    }
  };

  // Form States (News & Events)
  const [neType, setNeType] = useState('haber');
  const [neTitle, setNeTitle] = useState('');
  const [neDesc, setNeDesc] = useState('');
  // Form States (SEM)
  const [semTitle, setSemTitle] = useState('');
  const [semDesc, setSemDesc] = useState('');
  const [semImage, setSemImage] = useState('');
  const [semIsFree, setSemIsFree] = useState(true);
  const [semPrice, setSemPrice] = useState('');
  const [semDesc, setSemDesc] = useState('');
  const [semImage, setSemImage] = useState('');
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: {
        name: "Süper Admin (Kariyer Ofisi)",
        title: isJobPost ? "Öne Çıkan İlan" : "Resmi Duyuru",
        avatar: "https://www.esenyurt.edu.tr/uploads/2024/06/70ojf22yz63ip-esenyurt-universitesi-logo.png"
      },
      time: "Şimdi",
      image: newPostImage || null,
      content: newPostContent,
      likes: 0,
      comments: 0,
      isJob: isJobPost,
      isApproved: true
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostImage('');
    setIsJobPost(false);
    alert("Gönderi başarıyla Öğrenci/Mezun Ağına (Feed) gönderildi!");
  };

  const handleSurveySubmit = (e) => {
    e.preventDefault();
    if(!surveyTitle || !surveyQuestion) return;
    const newSurvey = {
      id: Date.now(),
      title: surveyTitle,
      question: surveyQuestion,
      time: "Şimdi",
      author: "Süper Admin (Kariyer Ofisi)",
      avatar: "https://www.esenyurt.edu.tr/uploads/2024/06/70ojf22yz63ip-esenyurt-universitesi-logo.png"
    };
    setSurveys([newSurvey, ...(surveys || [])]);
    setSurveyTitle('');
    setSurveyQuestion('');
    alert("Anket yayınlandı. Öğrenciler/Mezunlar Likert (1-5) oylamasını görebilecek.");
  };

  const handleNewsSubmit = (e) => {
    e.preventDefault();
    const newItem = { id: Date.now(), title: neTitle, description: neDesc, date: neDate };
  // Form States (News & Events)
  const [neType, setNeType] = useState('haber');
  const [neTitle, setNeTitle] = useState('');
  const [neDesc, setNeDesc] = useState('');
  const [neDate, setNeDate] = useState('');
  const [neImage, setNeImage] = useState('');
    alert("İçerik başarıyla vitrine eklendi!");
  };

  const handleSemSubmit = (e) => {
  const handleSemSubmit = (e) => {
    e.preventDefault();
    setSemCourses([{ id: Date.now(), title: semTitle, desc: semDesc, image: semImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", isFree: semIsFree, price: semPrice }, ...(semCourses || [])]);
    setSemTitle(''); setSemDesc(''); setSemIsFree(true); setSemPrice(''); setSemImage('');
    alert("SEM Kursu başarıyla oluşturuldu!");
  };
  const approvePost = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, isApproved: true, time: "Şimdi" } : p));
  };
        <header className="h-20 flex items-center justify-between px-10 shrink-0 border-b border-gray-200 bg-white shadow-sm relative z-20">
          <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
            {{
              overview: 'Sistem Gündemi ve Özet',
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-white/20 w-full flex justify-center mb-4 relative z-10">
            <img src="https://www.esenyurt.edu.tr/uploads/2024/06/70ojf22yz63ip-esenyurt-universitesi-logo.png" alt="İESÜ Logo" className="h-10 object-contain" />
  const SidebarButton = ({ active, onClick, icon, label, badge, pendingCount }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold ${active ? 'bg-white text-iesu-red shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
      {icon} {label}
      {(badge > 0 || pendingCount > 0) && (
        <span className="ml-auto bg-white text-iesu-red text-[10px] px-2 py-0.5 rounded-full font-black min-w-[20px] text-center">
          {badge || pendingCount}
        </span>
      )}
    </button>
  );

  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Prof. Dr. Ahmet Yılmaz', email: 'ahmet.yilmaz@esenyurt.edu.tr', role: 'super_admin' },
    { id: 2, name: 'Doç. Dr. Ayşe Kaya', email: 'ayse.kaya@esenyurt.edu.tr', role: 'content_admin' },
    { id: 3, name: 'Dr. Öğr. Üyesi Mehmet Demir', email: 'mehmet.demir@esenyurt.edu.tr', role: 'mentor_admin' },
    { id: 4, name: 'Araş. Gör. Zeynep Çelik', email: 'zeynep.celik@esenyurt.edu.tr', role: 'standard_academic' }
  ]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({ name: '', email: '', role: 'standard_academic' });

  const handleSaveStaff = (e) => {
    e.preventDefault();
    setStaffList([...staffList, { id: Date.now(), ...staffForm }]);
    setShowStaffModal(false);
    setStaffForm({ name: '', email: '', role: 'standard_academic' });
    alert("Akademik personel başarıyla eklendi.");
  };
        <div className="p-6 border-b border-white/10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <img src="https://www.esenyurt.edu.tr/uploads/2024/06/70ojf22yz63ip-esenyurt-universitesi-logo.png" alt="İESÜ Logo" className="h-12 object-contain brightness-0 invert opacity-100 drop-shadow-md mb-4 relative z-10" />
          <p className="text-white/80 text-[10px] uppercase tracking-[0.25em] font-black relative z-10">Kariyer Merkezi Paneli</p>
        <div className="p-6 border-b border-white/10 flex flex-col items-center relative overflow-hidden">
          <div className="w-full flex justify-center mt-2 relative z-10">
            <Logo className="h-12 w-auto text-white" />
          </div>
          <p className="text-white/80 text-[10px] uppercase tracking-[0.25em] font-black relative z-10 mt-3">Kariyer Merkezi Paneli</p>
        </div>
            </button>
            <button onClick={() => setView('company')} className="flex flex-col items-center justify-center bg-white/5 hover:bg-white/20 hover:border-white/30 border border-white/10 p-3 rounded-2xl transition-all duration-300 text-[10px] font-bold gap-2 text-white hover:text-white shadow-sm backdrop-blur-sm">
              <Building2 size={18} /> Firma Ağı
            </button>
          </div>
        </div>

            <SidebarButton active={activeTab === 'company'} onClick={() => setActiveTab('company')} icon={<Building2 size={18} />} label="Firma & İşveren Onayları" badge={companies?.filter(c => c.status === 'Onay Bekliyor')?.length || 0} />
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar relative z-10">
          
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar relative z-10">
          {['super_admin', 'content_admin'].includes(academicRole) && (
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/50"></div> Analiz & Özet
              </p>
              <SidebarButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} label="Gündem & İstatistikler" pendingCount={pendingPosts?.length} />
            </div>
          )}
          {['super_admin'].includes(academicRole) && (
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/50"></div> Kullanıcı Havuzları
              </p>
              <SidebarButton active={activeTab === 'student_pool'} onClick={() => setActiveTab('student_pool')} icon={<Users size={18} />} label="Öğrenci Bilgi Havuzu" badge={students?.length} />
              <SidebarButton active={activeTab === 'alumni_pool'} onClick={() => setActiveTab('alumni_pool')} icon={<GraduationCap size={18} />} label="Mezun Bilgi Havuzu" badge={alumni?.length} />
              <SidebarButton active={activeTab === 'company'} onClick={() => setActiveTab('company')} icon={<Building2 size={18} />} label="Firma & İşveren Onayları" badge={companies?.filter(c => c.status === 'Onay Bekliyor')?.length || 0} />
            </div>
          )}
          {['super_admin', 'mentor_admin'].includes(academicRole) && (
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/50"></div> Kariyer & Gelişim
              </p>
              <SidebarButton active={activeTab === 'mentorship'} onClick={() => setActiveTab('mentorship')} icon={<Heart size={18} />} label="Mentorluk Programı" badge={0} />
              {['super_admin'].includes(academicRole) && (
                <>
                  <SidebarButton active={activeTab === 'job_intern_approvals'} onClick={() => setActiveTab('job_intern_approvals')} icon={<Briefcase size={18} />} label="İş ve Staj İlanları" />
                  <SidebarButton active={activeTab === 'volunteer_intern'} onClick={() => setActiveTab('volunteer_intern')} icon={<FileCheck size={18} />} label="Gönüllü Staj Başvuruları" badge={0} />
                  <SidebarButton active={activeTab === 'sem'} onClick={() => setActiveTab('sem')} icon={<Award size={18} />} label="SEM Kurs Yönetimi" />
                </>
              )}
            </div>
          )}
          {['super_admin'].includes(academicRole) && (
            <div className="space-y-1 mt-6">
              <h4 className="text-[10px] uppercase font-black tracking-widest text-white/40 px-4 mb-2">Destek & İletişim</h4>
              <SidebarButton active={activeTab === 'counseling'} onClick={() => setActiveTab('counseling')} icon={<MessageSquareQuote size={18} />} label="Danışmanlık Talepleri" badge={0} />
              <SidebarButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={<Heart size={18} />} label="Gelen Mesajlar" badge={0} />
            </div>
          )}
          {['super_admin'].includes(academicRole) && (
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/50"></div> Mezunlar Ofisi
              </p>
              <SidebarButton active={activeTab === 'alumni_assoc'} onClick={() => setActiveTab('alumni_assoc')} icon={<Network size={18} />} label="Mezun Derneği Paneli" />
              <SidebarButton active={activeTab === 'alumni_card'} onClick={() => setActiveTab('alumni_card')} icon={<CreditCard size={18} />} label="Mezun Kart Başvuruları" />
            </div>
          )}
          {['super_admin', 'content_admin'].includes(academicRole) && (
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/50"></div> İletişim & İçerik
              </p>
              <SidebarButton active={activeTab === 'news_events'} onClick={() => setActiveTab('news_events')} icon={<Newspaper size={18} />} label="Ana Vitrin (Haber/Etkinlik)" />
              <SidebarButton active={activeTab === 'cms'} onClick={() => setActiveTab('cms')} icon={<Send size={18} />} label="Kariyer Ağı Gönderileri" />
              <SidebarButton active={activeTab === 'survey'} onClick={() => setActiveTab('survey')} icon={<MessageSquareQuote size={18} />} label="Anket Yönetimi" />
              <SidebarButton active={activeTab === 'org_chart'} onClick={() => setActiveTab('org_chart')} icon={<Users size={18} />} label="Organizasyon Şeması" />
            </div>
          )}
          {['super_admin'].includes(academicRole) && (
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/50"></div> Sistem
              </p>
              <SidebarButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} label="Genel Ayarlar" />
              <SidebarButton active={activeTab === 'staff_management'} onClick={() => setActiveTab('staff_management')} icon={<ShieldCheck size={18} />} label="Yetkili Kadro Yönetimi" />
            </div>
          )}
        </nav>
        <div className="p-5 border-t border-white/10 bg-black/10">
          <button onClick={() => setView('login')} className="flex items-center justify-center gap-3 text-red-200 hover:text-white w-full px-4 py-3.5 transition-all duration-300 font-bold rounded-2xl hover:bg-white/10 border border-transparent">
            <LogOut size={18} /> Güvenli Çıkış
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative bg-gradient-to-br from-red-50/80 via-white to-gray-50">
        <header className="h-24 flex items-center justify-between px-10 shrink-0 bg-transparent relative z-20 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-red-800 rounded-full"></div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-wide">
        <div className="p-5 border-t border-white/10 bg-black/10 flex flex-col gap-2">
          <button onClick={() => {
            if (window.confirm('Tüm kayıtlı kullanıcı ve mock verilerini silip sistemi tamamen sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
              localStorage.removeItem('iesu_mock_user');
              alert('Kayıtlar başarıyla silindi! Sistem yeniden başlatılıyor...');
              window.location.reload();
            }
          }} className="flex items-center justify-center gap-3 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 w-full px-4 py-3.5 transition-all duration-300 font-bold rounded-2xl border border-red-500/30">
            <Trash2 size={18} /> Sistemi Sıfırla
          </button>
          <button onClick={() => setView('login')} className="flex items-center justify-center gap-3 text-red-200 hover:text-white w-full px-4 py-3.5 transition-all duration-300 font-bold rounded-2xl hover:bg-white/10 border border-transparent">
            <LogOut size={18} /> Güvenli Çıkış
          </button>
        </div>
                sem: 'Sürekli Eğitim Merkezi (SEM)',
                student_pool: 'Öğrenci Data Havuzu',
                alumni_pool: 'Mezun Data Havuzu',
                company: 'Bekleyen Firma Kayıtları',
                staff_management: 'Akademik Kadro ve Yetkiler'
              }[activeTab] || 'Yönetici Paneli'}
            </h2>
          </div>
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/50 shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl hover:bg-white/80 cursor-pointer">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-black text-gray-900">{academicRole === 'super_admin' ? 'Kariyer Merkezi Başkanı' : academicRole === 'content_admin' ? 'Bölüm Moderatörü' : 'Danışman Akademisyen'}</span>
              <span className="text-[11px] uppercase tracking-wider text-red-500 font-bold">{academicRole === 'super_admin' ? 'Süper Admin' : academicRole === 'content_admin' ? 'İçerik Yöneticisi' : 'Sınırlı Panel'}</span>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-800 rounded-full flex items-center justify-center text-white font-black shadow-inner shadow-red-900/50 border-2 border-white">
              {academicRole === 'super_admin' ? 'SA' : academicRole === 'content_admin' ? 'İY' : 'DA'}
            </div>
          </div>
        </header>
                student_pool: 'Öğrenci Data Havuzu',
                alumni_pool: 'Mezun Data Havuzu',
                company: 'Bekleyen Firma Kayıtları'
              }[activeTab] || 'Yönetici Paneli'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/50 shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl hover:bg-white/80 cursor-pointer">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-black text-gray-900">Süper Admin</span>
              <span className="text-[11px] uppercase tracking-wider text-red-500 font-bold">Tam Yetkili</span>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-800 rounded-full flex items-center justify-center text-white font-black shadow-inner shadow-red-900/50 border-2 border-white">
              SA
            </div>
          </div>
        </header>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-10 relative z-10">
          {activeTab === 'overview' && (
            <div className="animate-fade-in max-w-7xl mx-auto">
              
              {/* Hoşgeldin Banner */}
              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-10 shadow-2xl mb-10 border border-gray-700 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
                
                <div className="relative z-10 text-center md:text-left">
                  <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-3 justify-center md:justify-start">
                    Hoş Geldiniz, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-200">Süper Yönetici</span>
                  </h2>
                  <p className="text-gray-400 font-medium text-lg">Kariyer merkezi verileri ve onay bekleyen işlemler hazır. Sistem şu an tıkır tıkır işliyor!</p>
                </div>
                <div className="relative z-10 mt-6 md:mt-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-800 rounded-2xl shadow-xl shadow-red-900/50 flex items-center justify-center border border-red-400/30">
                    <Activity className="text-white" size={36} />
                  </div>
                </div>
              </div>

              {/* Quick Stats (Metalik/Glassmorphism Versiyon) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center gap-5 hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
                    <Users className="text-white" size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Toplam Öğrenci</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{students?.length || 0}</p>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center gap-5 hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
                    <GraduationCap className="text-white" size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Toplam Mezun</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{alumni?.length || 0}</p>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center gap-5 hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 shrink-0">
                    <Building2 className="text-white" size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Partner Firma</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{companies?.length || 0}</p>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-red-100 p-6 rounded-[2rem] shadow-xl shadow-red-200/50 flex items-center gap-5 hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 shrink-0 relative z-10">
                    <AlertTriangle className="text-white animate-pulse" size={28} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm font-bold text-red-500 uppercase tracking-widest">Bekleyen İşlem</p>
                    <p className="text-3xl font-black text-red-700 mt-1">{(pendingPosts?.length || 0) + (companies?.filter(c => c.status === 'Onay Bekliyor')?.length || 0)}</p>
                  </div>
                </div>
              </div>

              {/* Pending Approvals (Gündem) */}
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mt-8">
                <div className="p-8 border-b border-white/50 flex items-center justify-between bg-gradient-to-r from-red-50/50 to-transparent">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <Activity className="text-red-500" size={28} /> Firma Gönderi Onayları (Gündem)
                  </h3>
                  <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold border border-red-200 shadow-sm">
                    {pendingPosts?.length || 0} Gönderi Bekliyor
                  </span>
                </div>

                {(!pendingPosts || pendingPosts.length === 0) ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white/80 rounded-full shadow-inner flex items-center justify-center mb-6 border border-white/60">
                      <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-800 mb-3">Gündem Temiz</h4>
                    <p className="text-gray-500 max-w-md font-medium">Harika! Onay bekleyen hiçbir gönderi bulunmuyor. Her şey kontrol altında.</p>
                  </div>
                ) : (
                  <div className="p-8 space-y-4">
                    {pendingPosts.map(post => (
                      <div key={post.id} className="bg-white/80 border border-white rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-white transition-all shadow-md hover:shadow-lg">
                        <div className="flex items-center gap-4 w-full md:w-auto md:min-w-[280px]">
                          <img src={post.author.avatar} alt="Avatar" className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                          <div>
                            <p className="font-black text-gray-900 text-lg">{post.author.name}</p>
                            <p className="text-sm font-bold text-gray-500">{post.author.title}</p>
                          </div>
                        </div>
                        <div className="flex-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                          <p className="text-base text-gray-700 font-medium italic">"{post.content}"</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto justify-end shrink-0">
                          <button onClick={() => approvePost(post.id)} className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5">
                            <Check size={18} /> Onayla
                          </button>
                          <button onClick={() => rejectPost(post.id)} className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-5 py-3 rounded-xl font-bold shadow-sm transition-all">
                            <X size={18} /> Reddet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cms' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sol Taraf: İçerik Yönetimi Formu */}
                <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden h-fit">
                  <div className="p-10 border-b border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-black relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black text-white flex items-center gap-3">
                        <Send className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" size={28} /> Kariyer Ağına Resmi Duyuru Gönder
                      </h3>
                      <p className="text-gray-300 mt-2 font-medium">Buradan paylaştığınız içerikler anında Öğrenci, Mezun ve Firma ağında "Resmi Duyuru" rozetiyle yayınlanır.</p>
                    </div>
                  </div>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handlePostSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Duyuru Metni</label>
                        <textarea 
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="Platformdaki herkese ne duyurmak istersiniz?" 
                          rows="5" 
                          className="w-full p-5 bg-white border border-gray-300 rounded-2xl focus:bg-gray-50 focus:ring-2 focus:ring-iesu-coral/30 outline-none resize-none text-gray-900 placeholder-gray-400 transition-all shadow-sm"
                          required
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Görsel Seç (İsteğe Bağlı)</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setNewPostImage(URL.createObjectURL(file));
                              }
                            }}
                            className="w-full pl-5 pr-5 py-3 bg-white border border-gray-300 rounded-2xl focus:bg-gray-50 focus:ring-2 focus:ring-iesu-coral/30 outline-none text-gray-700 transition-all shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-iesu-red file:text-white hover:file:bg-iesu-darkRed file:cursor-pointer file:transition-colors cursor-pointer"
                          />
                          {newPostImage && (
                            <button type="button" onClick={() => setNewPostImage('')} className="absolute right-4 top-4 text-gray-400 hover:text-red-500 font-bold text-sm">
                              Görseli Kaldır
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                        <input 
                          type="checkbox" 
                          id="isJob" 
                          checked={isJobPost}
                          onChange={(e) => setIsJobPost(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-iesu-red focus:ring-iesu-red" 
                        />
                        <label htmlFor="isJob" className="font-bold text-gray-700 cursor-pointer flex items-center gap-2">
                          <Briefcase size={20} className="text-iesu-coral" /> Bu Gönderiyi İş/Staj İlanı Olarak İşaretle
                        </label>
                      </div>

                      <div className="pt-4">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-iesu-red text-white font-bold px-6 py-4 rounded-2xl hover:bg-iesu-darkRed transition-all shadow-md text-lg">
                          <Send size={22} /> Hemen Yayınla
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Sağ Taraf: Canlı Önizleme */}
                <div className="bg-gray-100 rounded-3xl p-6 border border-gray-200 h-fit">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Activity size={16} /> Canlı Önizleme (Öğrenci Akışı)
                  </h3>
                  
                  {/* PREVIEW CARD - %100 BİREBİR KOPYA */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="p-4 flex justify-between items-center border-b border-gray-100 bg-red-50/30">
                      <div className="flex items-center gap-3">
                        <img src="https://ui-avatars.com/api/?name=Kariyer&background=D32F2F&color=fff" alt="Kariyer Merkezi" className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
                        <div>
                          <h3 className="font-bold text-gray-900 text-[14px]">İESÜ Kariyer Merkezi</h3>
                          <p className="text-iesu-red text-[11px] font-bold">Resmi Duyuru • Şimdi</p>
                        </div>
                      </div>
                      <MoreHorizontal className="text-gray-400" size={20} />
                    </div>

                    <div className="p-4">
                      {isJobPost && (
                        <div className="mb-3 inline-block bg-blue-50 text-blue-700 text-xs font-black px-3 py-1.5 rounded-lg border border-blue-100 uppercase">
                          Yeni İş/Staj İlanı
                        </div>
                      )}
                      
                      <p className="text-gray-800 text-[14px] leading-relaxed mb-4 whitespace-pre-wrap">
                        {newPostContent || "Duyuru metni buraya yazılacak..."}
                      </p>
                    </div>

                    {newPostImage && (
                      <div className="w-full bg-gray-50 border-t border-b border-gray-100">
                        <img src={newPostImage} alt="Post" className="w-full max-h-[400px] object-contain" />
                      </div>
                    )}

                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-50 text-gray-500">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-1.5 hover:text-iesu-red transition group">
                          <Heart size={20} className="group-hover:fill-iesu-red" />
                          <span className="text-sm font-semibold">0</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-iesu-red transition">
                          <MessageSquareQuote size={20} />
                          <span className="text-sm font-semibold">0</span>
                        </button>
          {activeTab === 'news_events' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden h-fit">
                  <div className="p-10 border-b border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-black relative">
                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                      <Newspaper className="text-emerald-400" size={28} /> Ana Vitrine Haber / Etkinlik Ekle
                    </h3>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handleNewsSubmit} className="space-y-6">
                      <div className="flex gap-6 p-4 bg-gray-50 border rounded-2xl">
                        <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer"><input type="radio" name="type" checked={neType === 'haber'} onChange={() => setNeType('haber')} /> Haber</label>
                        <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer"><input type="radio" name="type" checked={neType === 'etkinlik'} onChange={() => setNeType('etkinlik')} /> Etkinlik</label>
                      </div>
                      <input type="text" value={neTitle} onChange={e => setNeTitle(e.target.value)} placeholder="Başlık" className="w-full px-5 py-4 bg-white border rounded-2xl" required />
                      <input type="date" value={neDate} onChange={e => setNeDate(e.target.value)} className="w-full px-5 py-4 bg-white border rounded-2xl" required />
                      <textarea value={neDesc} onChange={e => setNeDesc(e.target.value)} placeholder="Açıklama..." rows="4" className="w-full p-5 bg-white border rounded-2xl" required></textarea>
                      <button type="submit" className="bg-gray-800 text-white font-bold px-6 py-4 rounded-2xl w-full text-lg">İçeriği Ekle</button>
                    </form>
                  </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 h-fit shadow-xl">
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2"><Activity size={16} /> Canlı Önizleme</h3>
                  <div className="bg-white rounded-[2rem] border border-white/50 shadow-2xl overflow-hidden">
                    <img src={neImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"} className="w-full h-48 object-cover" alt="Preview"/>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2">{neTitle || "İçerik Başlığı"}</h3>
                      <p className="text-sm text-gray-500 line-clamp-3">{neDesc || "İçerik açıklaması burada görünecek."}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mt-8">
                <div className="p-8 border-b border-white/50 flex justify-between items-center bg-white/50">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-2"><Newspaper size={20} className="text-emerald-500"/> Mevcut Haber & Etkinlikler</h3>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white/90 backdrop-blur shadow-sm z-10 border-b border-gray-200">
                      <tr className="text-gray-500 text-xs font-black uppercase tracking-widest">
                        <th className="p-5">Tür</th>
                        <th className="p-5">Başlık</th>
                        <th className="p-5 text-center">Tarih</th>
                        <th className="p-5 text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {[...(news || []), ...(events || [])].map(item => (
                        <tr key={`${item.type}-${item.id}`} className="hover:bg-white/60 transition-colors group">
                          <td className="p-5">
                            {item.type === 'haber' ? (
                              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1 w-max"><Newspaper size={12}/> Haber</span>
                            ) : (
                              <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-orange-100 flex items-center gap-1 w-max"><Calendar size={12}/> Etkinlik</span>
                            )}
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              {item.image && <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                              <div className="font-bold text-gray-900 line-clamp-1 max-w-sm">{item.title}</div>
                            </div>
                          </td>
                          <td className="p-5 text-center">
                            <span className="text-sm font-medium text-gray-600">{item.date}</span>
                          </td>
                          <td className="p-5 text-center">
                            <button onClick={() => handleDeleteNewsEvent(item.id, item.type)} className="p-2 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors" title="Sil">
                              <X size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {((!news || news.length === 0) && (!events || events.length === 0)) && (
                        <tr><td colSpan="4" className="p-10 text-center text-gray-500 font-medium">Henüz haber veya etkinlik bulunmuyor.</td></tr>
                      )}
          {activeTab === 'sem' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden h-fit">
                  <div className="p-10 border-b border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-black relative">
                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                      <Award className="text-yellow-400" size={28} /> SEM Kursu Tanımla
                    </h3>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handleSemSubmit} className="space-y-6">
                      <div className="flex gap-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                        <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer"><input type="radio" name="semType" checked={semIsFree} onChange={() => setSemIsFree(true)} className="text-iesu-red focus:ring-iesu-red w-5 h-5" /> Ücretsiz Eğitim</label>
                        <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer"><input type="radio" name="semType" checked={!semIsFree} onChange={() => setSemIsFree(false)} className="text-iesu-red focus:ring-iesu-red w-5 h-5" /> Ücretli Eğitim</label>
                      </div>
                      {!semIsFree && (
                        <input type="text" value={semPrice} onChange={e => setSemPrice(e.target.value)} placeholder="Örn: 2.500 TL" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-iesu-coral outline-none font-bold text-iesu-red" required />
                      )}
                      <input type="text" value={semTitle} onChange={e => setSemTitle(e.target.value)} placeholder="Eğitim Başlığı" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-iesu-coral outline-none" required />
                      <input type="file" accept="image/*" onChange={(e) => { if(e.target.files[0]) setSemImage(URL.createObjectURL(e.target.files[0])); }} className="w-full pl-5 pr-5 py-3 bg-white border border-gray-200 rounded-2xl focus:bg-gray-50 focus:ring-2 focus:ring-iesu-coral outline-none text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-800 file:text-white cursor-pointer" />
                      <textarea value={semDesc} onChange={e => setSemDesc(e.target.value)} placeholder="Eğitim İçeriği..." rows="5" className="w-full p-5 bg-white border border-gray-200 rounded-2xl resize-none shadow-sm focus:ring-2 focus:ring-iesu-coral outline-none" required></textarea>
                      <button type="submit" className="bg-iesu-coral text-white font-bold px-6 py-4 rounded-2xl hover:bg-red-600 transition shadow-md w-full text-lg">Kursu Yayına Al</button>
                    </form>
                  </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 h-fit shadow-xl">
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2"><Activity size={16} /> Canlı Önizleme</h3>
                  <div className="bg-white rounded-[2rem] border border-white/50 shadow-2xl overflow-hidden relative">
                    <img src={semImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} alt="Course" className="w-full h-48 object-cover"/>
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2">
                      {semIsFree ? <span className="text-emerald-600">ÜCRETSİZ</span> : <span className="text-iesu-red">{semPrice || 'ÜCRETLİ'}</span>}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{semTitle || "SEM Kurs Başlığı"}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3">{semDesc || "Kurs içeriği ve detayları..."}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mt-8">
                <div className="p-8 border-b border-white/50 flex justify-between items-center bg-white/50">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-2"><Award size={20} className="text-yellow-500"/> Mevcut SEM Kursları</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">{semCourses?.length || 0} Kurs</span>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white/90 backdrop-blur shadow-sm z-10 border-b border-gray-200">
                      <tr className="text-gray-500 text-xs font-black uppercase tracking-widest">
                        <th className="p-5">Kurs Görseli</th>
                        <th className="p-5">Kurs Başlığı</th>
                        <th className="p-5 text-center">Tür</th>
                        <th className="p-5 text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {(semCourses || []).map(course => (
                        <tr key={course.id} className="hover:bg-white/60 transition-colors group">
                          <td className="p-5">
                            <img src={course.image} alt="" className="w-16 h-10 rounded-lg object-cover shadow-sm border border-gray-200" />
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-gray-900">{course.title}</div>
                            <div className="text-xs font-medium text-gray-500 line-clamp-1 max-w-sm mt-1">{course.desc}</div>
                          </td>
                          <td className="p-5 text-center">
                            {course.isFree || course.isFree === undefined ? (
                              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-100">Ücretsiz</span>
                            ) : (
                              <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-red-100">{course.price || 'Ücretli'}</span>
                            )}
                          </td>
                          <td className="p-5 text-center">
                            <button onClick={() => handleDeleteSem(course.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50" title="Sil">
                              <X size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!semCourses || semCourses.length === 0) && (
                        <tr><td colSpan="4" className="p-10 text-center text-gray-500 font-medium">Henüz SEM kursu bulunmuyor.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
                </div>
              </div>
            </div>
          )}
                    </form>
                  </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 h-fit shadow-xl">
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2"><Activity size={16} /> Canlı Önizleme</h3>
                  <div className="bg-white rounded-[2rem] border border-white/50 shadow-2xl overflow-hidden relative">
                    <img src={semImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} alt="Course" className="w-full h-48 object-cover"/>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{semTitle || "SEM Kurs Başlığı"}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3">{semDesc || "Kurs içeriği ve detayları..."}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mt-8">
                <div className="p-8 border-b border-white/50 flex justify-between items-center bg-white/50">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-2"><Award size={20} className="text-yellow-500"/> Mevcut SEM Kursları</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">{semCourses?.length || 0} Kurs</span>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white/90 backdrop-blur shadow-sm z-10 border-b border-gray-200">
                      <tr className="text-gray-500 text-xs font-black uppercase tracking-widest">
                        <th className="p-5">Kurs Görseli</th>
                        <th className="p-5">Kurs Başlığı</th>
                        <th className="p-5">Açıklama Özeti</th>
                        <th className="p-5 text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {(semCourses || []).map(course => (
                        <tr key={course.id} className="hover:bg-white/60 transition-colors group">
                          <td className="p-5">
                            <img src={course.image} alt="" className="w-16 h-10 rounded-lg object-cover shadow-sm border border-gray-200" />
                          </td>
                          <td className="p-5 font-bold text-gray-900">{course.title}</td>
                          <td className="p-5 text-sm font-medium text-gray-600 line-clamp-1 max-w-sm">{course.desc}</td>
                          <td className="p-5 text-center">
                            <button onClick={() => handleDeleteSem(course.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50" title="Sil">
                              <X size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!semCourses || semCourses.length === 0) && (
                        <tr><td colSpan="4" className="p-10 text-center text-gray-500 font-medium">Henüz SEM kursu bulunmuyor.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
                      <input type="text" value={semTitle} onChange={e => setSemTitle(e.target.value)} placeholder="Eğitim Başlığı" className="w-full px-5 py-4 bg-white/60 border border-white/50 rounded-2xl shadow-sm focus:ring-2 focus:ring-iesu-coral outline-none" required />
                      <input type="file" accept="image/*" onChange={(e) => { if(e.target.files[0]) setSemImage(URL.createObjectURL(e.target.files[0])); }} className="w-full pl-5 pr-5 py-3 bg-white/60 border border-white/50 rounded-2xl focus:bg-white/80 focus:ring-2 focus:ring-iesu-coral outline-none text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-800 file:text-white cursor-pointer" />
                      <textarea value={semDesc} onChange={e => setSemDesc(e.target.value)} placeholder="Eğitim İçeriği..." rows="5" className="w-full p-5 bg-white/60 border border-white/50 rounded-2xl resize-none shadow-sm focus:ring-2 focus:ring-iesu-coral outline-none" required></textarea>
                      <button type="submit" className="bg-iesu-coral text-white font-bold px-6 py-4 rounded-2xl hover:bg-red-600 transition shadow-md w-full text-lg">Kursu Yayına Al</button>
                    </form>
                  </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 h-fit shadow-xl">
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2"><Activity size={16} /> Canlı Önizleme</h3>
                  <div className="bg-white rounded-[2rem] border border-white/50 shadow-2xl overflow-hidden relative">
                    <img src={semImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} alt="Course" className="w-full h-48 object-cover"/>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{semTitle || "SEM Kurs Başlığı"}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3">{semDesc || "Kurs içeriği ve detayları..."}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mt-8">
                <div className="p-8 border-b border-white/50 flex justify-between items-center bg-white/50">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-2"><Award size={20} className="text-yellow-500"/> Mevcut SEM Kursları</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">{semCourses?.length || 0} Kurs</span>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white/90 backdrop-blur shadow-sm z-10 border-b border-gray-200">
                      <tr className="text-gray-500 text-xs font-black uppercase tracking-widest">
                        <th className="p-5">Kurs Görseli</th>
                        <th className="p-5">Kurs Başlığı</th>
                        <th className="p-5">Açıklama Özeti</th>
                        <th className="p-5 text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {(semCourses || []).map(course => (
                        <tr key={course.id} className="hover:bg-white/60 transition-colors group">
                          <td className="p-5">
                            <img src={course.image} alt="" className="w-16 h-10 rounded-lg object-cover shadow-sm border border-gray-200" />
                          </td>
                          <td className="p-5 font-bold text-gray-900">{course.title}</td>
                          <td className="p-5 text-sm font-medium text-gray-600 line-clamp-1 max-w-sm">{course.desc}</td>
                          <td className="p-5 text-center">
                            <button onClick={() => handleDeleteSem(course.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50" title="Sil">
                              <X size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!semCourses || semCourses.length === 0) && (
                        <tr><td colSpan="4" className="p-10 text-center text-gray-500 font-medium">Henüz SEM kursu bulunmuyor.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
                      <MessageSquareQuote className="text-blue-400" size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-800 mb-3">Kayıt Bulunamadı</h4>
                    <p className="text-gray-500 max-w-md font-medium">Sistemde henüz yayınlanmış bir anket bulunmuyor. Yeni bir anket oluşturduğunuzda burada listelenecektir.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-white/80 backdrop-blur shadow-sm z-10 border-b border-white">
                        <tr className="text-gray-600 text-sm">
                          <th className="p-5 font-bold uppercase tracking-wider w-12 text-center">ID</th>
                          <th className="p-5 font-bold uppercase tracking-wider">Anket Soru & Başlığı</th>
                          <th className="p-5 font-bold uppercase tracking-wider text-center">Oluşturan</th>
                          <th className="p-5 font-bold uppercase tracking-wider text-center">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {surveys?.map((survey) => (
                          <tr key={survey.id} className="border-b border-white/40 hover:bg-white/50 transition-colors">
                            <td className="p-5 text-gray-400 font-mono text-center">#{survey.id}</td>
                            <td className="p-5">
                              <p className="font-bold text-gray-900">{survey.title}</p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-1">{survey.question}</p>
                            </td>
                            <td className="p-5 text-center">
                              <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold">{survey.author}</span>
                            </td>
                            <td className="p-5">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => alert('Düzenleme paneli yapım aşamasında.')} className="p-1.5 bg-white text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 border border-gray-200 shadow-sm transition tooltip" title="Düzenle">
                                  <MoreHorizontal size={16} />
                                </button>
                                <button onClick={() => handleDeleteSurvey(survey.id)} className="p-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 shadow-sm transition tooltip" title="Sil">
                                  <X size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

          {activeTab === 'news_events' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                
                {/* Sol Taraf: İçerik Yönetimi Formu */}
                <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden h-fit">
                  <div className="p-10 border-b border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-black relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black text-white flex items-center gap-3">
                        <Newspaper className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" size={28} /> Ana Vitrine Haber / Etkinlik Ekle
                      </h3>
                      <p className="text-gray-300 mt-2 font-medium">Bu içerikler genel websitesi (vitrin) arayüzündeki Haberler ve Etkinlikler sekmesinde yayınlanır.</p>
                    </div>
                  </div>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                  <div className="p-8 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">Ana Vitrine Haber / Etkinlik Ekle</h3>
                    <p className="text-gray-500 mt-2">Bu içerikler genel websitesi (vitrin) arayüzündeki Haberler ve Etkinlikler sekmesinde yayınlanır.</p>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handleNewsSubmit} className="space-y-6">
                      <div className="flex gap-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                        <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                          <input type="radio" name="type" checked={neType === 'haber'} onChange={() => setNeType('haber')} className="text-iesu-red focus:ring-iesu-red w-5 h-5" /> Haber / Duyuru
                        </label>
                        <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                          <input type="radio" name="type" checked={neType === 'etkinlik'} onChange={() => setNeType('etkinlik')} className="text-iesu-red focus:ring-iesu-red w-5 h-5" /> Etkinlik
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Başlık</label>
                        <input type="text" value={neTitle} onChange={e => setNeTitle(e.target.value)} placeholder="Haber/Etkinlik Başlığı" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm text-gray-900 focus:bg-gray-50 focus:ring-2 focus:ring-gray-300 outline-none transition-all" required />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tarih</label>
                        <input type="date" value={neDate} onChange={e => setNeDate(e.target.value)} className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl text-gray-600 shadow-sm focus:bg-gray-50 focus:ring-2 focus:ring-gray-300 outline-none transition-all" required />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Afiş / Görsel Seç (İsteğe Bağlı)</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setNeImage(URL.createObjectURL(file));
                              }
                            }}
                            className="w-full pl-5 pr-5 py-3 bg-white border border-gray-300 rounded-2xl focus:bg-gray-50 focus:ring-2 focus:ring-gray-300 outline-none text-gray-700 transition-all shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-800 file:text-white hover:file:bg-gray-900 file:cursor-pointer file:transition-colors cursor-pointer"
                          />
                          {neImage && (
                            <button type="button" onClick={() => setNeImage('')} className="absolute right-4 top-4 text-gray-400 hover:text-red-500 font-bold text-sm">
                              Görseli Kaldır
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">İçerik Detayları</label>
                        <textarea value={neDesc} onChange={e => setNeDesc(e.target.value)} placeholder="Etkinlik veya haberin detaylarını giriniz..." rows="4" className="w-full p-5 bg-white border border-gray-300 rounded-2xl resize-none shadow-sm focus:bg-gray-50 focus:ring-2 focus:ring-gray-300 outline-none text-gray-900 transition-all" required></textarea>
                      </div>
                      
                </div>
              </div>

              {/* MEVCUT İÇERİKLER (TABLO) */}
              <div className="mt-8 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden">
                <div className="p-8 border-b border-white/50 flex justify-between items-center bg-white/50">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-2"><Newspaper size={20} className="text-emerald-500"/> Mevcut Haber & Etkinlikler</h3>
                  <div className="flex gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{(news || []).length} Haber</span>
                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">{(events || []).length} Etkinlik</span>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white/90 backdrop-blur shadow-sm z-10">
                      <tr className="text-gray-500 text-xs font-black uppercase tracking-widest border-b border-gray-200">
                        <th className="p-5">Tür</th>
                        <th className="p-5">Başlık</th>
                        <th className="p-5 text-center">Tarih</th>
                        <th className="p-5 text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {[...(news || []), ...(events || [])].map(item => (
                        <tr key={`${item.type}-${item.id}`} className="hover:bg-white/60 transition-colors group">
                          <td className="p-5">
                            {item.type === 'haber' ? (
                              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1 w-max"><Newspaper size={12}/> Haber</span>
                            ) : (
                              <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-orange-100 flex items-center gap-1 w-max"><Calendar size={12}/> Etkinlik</span>
                            )}
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              {item.image && <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                              <div className="font-bold text-gray-900 line-clamp-1 max-w-sm">{item.title}</div>
                            </div>
                          </td>
                          <td className="p-5 text-center">
                            <span className="text-sm font-medium text-gray-600">{item.date}</span>
                          </td>
                          <td className="p-5">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleDeleteNewsEvent(item.id, item.type)} className="p-2 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors tooltip" title="Sil">
                                <X size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {((!news || news.length === 0) && (!events || events.length === 0)) && (
                        <tr><td colSpan="4" className="p-10 text-center text-gray-500 font-medium">Henüz haber veya etkinlik bulunmuyor.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sem' && (
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                  <div className="relative z-10">
                    <button onClick={() => {
                      setEditingJob(null);
                      setJobForm({ title: '', company: '', type: 'TAM ZAMANLI', location: '', description: '', poster: '' });
                      setShowJobModal(true);
                    }} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm w-full md:w-auto justify-center">
                      <Briefcase size={18} /> Yeni İlan Ekle
                    </button>
                  </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-iesu-red font-bold text-xs mb-3">
                        <Calendar size={14} /> {neDate ? new Date(neDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tarih Seçilmedi'}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                        {neTitle || "Haber Başlığı Buraya Gelecek"}
                      </h3>
                      
                      <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                        {neDesc || "İçerik açıklaması burada yer alacak..."}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-2 text-iesu-red font-bold text-sm group-hover:gap-3 transition-all">
                    <button onClick={() => alert('Başvuru Havuzu Excel olarak indiriliyor...')} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5 justify-center border border-emerald-400/50">
                      <Download size={18} /> Excel'e Aktar
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-gray-50/50 max-h-[600px] overflow-y-auto rounded-b-3xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-10">
                      <tr className="text-gray-500 text-xs border-b border-gray-200">
                        <th className="p-5 font-black uppercase tracking-widest text-center">ID</th>
                        <th className="p-5 font-black uppercase tracking-widest">İlan Başlığı & Türü</th>
                        <th className="p-5 font-black uppercase tracking-widest">Firma / Kurum</th>
                        <th className="p-5 font-black uppercase tracking-widest text-center">Tarih</th>
                        <th className="p-5 font-black uppercase tracking-widest text-center">Durum</th>
                        <th className="p-5 font-black uppercase tracking-widest text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {jobs.map((job) => (
                        <tr key={job.id} className="border-b border-gray-100 hover:bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all group relative z-0 hover:z-10">
                          <td className="p-5 text-gray-400 font-mono text-center font-medium">#{job.id}</td>
                          <td className="p-5">
                            <p className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</p>
                            <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider shadow-sm ${job.type === 'STAJ' ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200' : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200'}`}>
                              {job.type}
                            </span>
                          </td>
                          <td className="p-5 text-gray-700 font-bold flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                              <Building2 size={14} className="text-gray-400" />
                            </div>
                            {job.company}
                          </td>
                          <td className="p-5 text-gray-500 font-mono text-center text-xs font-bold">{job.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm ${job.status === 'Yayında' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200'}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            {job.status === 'Beklemede' && (
                              <button onClick={() => setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'Yayında' } : j))} className="text-green-700 hover:text-white hover:bg-green-600 bg-green-50 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm">Yayınla</button>
                            )}
                            <button onClick={() => handleEditJob(job)} className="text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm">Düzenle</button>
                            <button onClick={() => handleDeleteJob(job.id)} className="text-red-500 hover:text-white hover:bg-red-500 bg-red-50 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                  <div className="relative z-10 flex gap-3 flex-col md:flex-row w-full md:w-auto">
                    <button onClick={() => setShowMentorCallModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-0.5 w-full justify-center border border-red-400/50">
                      <Send size={18} /> Çağrı Yayınla
                    </button>
                    <button onClick={() => alert('Yeni eşleştirme paneli yapım aşamasında.')} className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all w-full justify-center border border-white/20">
                      <Heart size={18} /> Eşleştirme
                    </button>
                  </div>
                <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden h-fit">
                  <div className="p-8 border-b border-white/50 bg-gradient-to-r from-gray-50/50 to-transparent">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <Award className="text-iesu-coral" size={24} /> SEM Kursu Tanımla
                    </h3>
                    <p className="text-gray-600 mt-2 font-medium">Sürekli Eğitim Merkezi (SEM) portalında yayınlanmak üzere yeni sertifika kursları ekleyin.</p>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handleSemSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Eğitim Başlığı</label>
                    <button onClick={() => alert('Başvurular Excel olarak indiriliyor...')} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5 justify-center border border-emerald-400/50">
                      <Download size={18} /> Excel'e Aktar
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto bg-gray-50/50 max-h-[600px] overflow-y-auto rounded-b-3xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-10">
                      <tr className="text-gray-500 text-xs border-b border-gray-200">
                        <th className="p-5 font-black uppercase tracking-widest text-center">ID</th>
                        <th className="p-5 font-black uppercase tracking-widest">Mentor (Uzman)</th>
                        <th className="p-5 font-black uppercase tracking-widest">Menti (Öğrenci)</th>
                        <th className="p-5 font-black uppercase tracking-widest text-center">Tarih</th>
                        <th className="p-5 font-black uppercase tracking-widest text-center">Durum</th>
                        <th className="p-5 font-black uppercase tracking-widest text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {mentorships.map((m) => (
                        <tr key={m.id} className="border-b border-gray-100 hover:bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all group relative z-0 hover:z-10">
                          <td className="p-5 text-gray-400 font-mono text-center font-medium">#{m.id}</td>
                          <td className="p-5 font-black text-gray-900 group-hover:text-purple-600 transition-colors">{m.mentor}</td>
                          <td className="p-5 text-gray-700 font-bold">{m.mentee}</td>
                          <td className="p-5 text-gray-500 font-mono text-center text-xs font-bold">{m.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm ${m.status === 'Aktif' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200'}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            {m.status === 'Eşleştirme Bekliyor' && (
                              <button onClick={() => setMentorships(mentorships.map(x => x.id === m.id ? { ...x, status: 'Aktif' } : x))} className="text-green-700 hover:text-white hover:bg-green-600 bg-green-50 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm">Onayla</button>
                            )}
                            <button onClick={() => handleDeleteMentorship(m.id)} className="text-red-500 hover:text-white hover:bg-red-500 bg-red-50 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                        <th className="p-5 font-black uppercase tracking-widest">Menti (Öğrenci)</th>
                        <th className="p-5 font-black uppercase tracking-widest text-center">Tarih</th>
                        <th className="p-5 font-black uppercase tracking-widest text-center">Durum</th>
                        <th className="p-5 font-black uppercase tracking-widest text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {mentorships.map((m) => (
                        <tr key={m.id} className="border-b border-gray-100 hover:bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all group relative z-0 hover:z-10">
                          <td className="p-5 text-gray-400 font-mono text-center font-medium">#{m.id}</td>
                          <td className="p-5 font-black text-gray-900 group-hover:text-purple-600 transition-colors">{m.mentor}</td>
                          <td className="p-5 text-gray-700 font-bold">{m.mentee}</td>
                          <td className="p-5 text-gray-500 font-mono text-center text-xs font-bold">{m.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm ${m.status === 'Aktif' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200'}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            {m.status === 'Eşleştirme Bekliyor' && (
                              <button onClick={() => setMentorships(mentorships.map(x => x.id === m.id ? { ...x, status: 'Aktif' } : x))} className="text-green-700 hover:text-white hover:bg-green-600 bg-green-50 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm">Onayla</button>
                            )}
                            <button onClick={() => handleDeleteMentorship(m.id)} className="text-red-500 hover:text-white hover:bg-red-500 bg-red-50 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Sağ Taraf: Canlı Önizleme */}
                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 h-fit shadow-xl shadow-slate-200/50">
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Activity size={16} /> Canlı Önizleme (SEM Kartı)
                  </h3>
                  
                  <div className="bg-white rounded-[2rem] border border-white/50 shadow-2xl overflow-hidden flex flex-col group cursor-pointer hover:border-iesu-coral transition-all duration-300 h-full max-w-sm mx-auto relative">
                    <div className="relative h-48 overflow-hidden bg-gray-50">
                      <img 
                        src={semImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} 
                        alt="Course cover" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-iesu-red shadow-sm flex items-center gap-2">
                        <CheckCircle size={14} /> Sertifikalı
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-iesu-coral transition-colors">
                    </div>
                  </div>
                </div>
              </div>

              {/* MEVCUT İÇERİKLER (TABLO) */}
              <div className="mt-8 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden">
                <div className="p-8 border-b border-white/50 flex justify-between items-center bg-white/50">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-2"><Award size={20} className="text-yellow-500"/> Mevcut SEM Kursları</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">{semCourses?.length || 0} Kurs</span>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white/90 backdrop-blur shadow-sm z-10">
                      <tr className="text-gray-500 text-xs font-black uppercase tracking-widest border-b border-gray-200">
                        <th className="p-5">Kurs Görseli</th>
                        <th className="p-5">Kurs Başlığı</th>
                        <th className="p-5">Açıklama Özeti</th>
                        <th className="p-5 text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {(semCourses || []).map(course => (
                        <tr key={course.id} className="hover:bg-white/60 transition-colors group">
                          <td className="p-5">
                            <img src={course.image} alt="" className="w-16 h-10 rounded-lg object-cover shadow-sm border border-gray-200" />
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-gray-900">{course.title}</div>
                          </td>
                          <td className="p-5">
                            <div className="text-sm font-medium text-gray-600 line-clamp-1 max-w-sm">{course.desc}</div>
                          </td>
                          <td className="p-5 text-center">
                            <button onClick={() => handleDeleteSem(course.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50" title="Sil">
                              <X size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!semCourses || semCourses.length === 0) && (
                        <tr><td colSpan="4" className="p-10 text-center text-gray-500 font-medium">Henüz SEM kursu bulunmuyor.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alumni_assoc' && (
                  <span className="bg-gray-200/50 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-300/30">{semCourses?.length || 0} Kurs</span>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white/80 backdrop-blur shadow-sm z-10 border-b border-white">
                      <tr className="text-gray-600 text-sm">
                        <th className="p-5 font-bold uppercase tracking-wider w-12 text-center">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider w-24 text-center">Afiş</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Eğitim Başlığı & İçerik Özeti</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {semCourses?.map((course) => (
                        <tr key={course.id} className="border-b border-white/40 hover:bg-white/50 transition-colors">
                          <td className="p-5 text-gray-400 font-mono text-center">#{course.id}</td>
                          <td className="p-5">
                            <div className="w-16 h-12 rounded bg-gray-100 mx-auto overflow-hidden border border-gray-200/50 shadow-sm">
                              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-5">
                            <p className="font-bold text-gray-900 line-clamp-1">{course.title}</p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-1">{course.desc}</p>
                          </td>
                          <td className="p-5">
                  <div className="overflow-x-auto">
                    {/* Tablo Gelecek */}
                  </div>
                )}
              </div>
          {activeTab === 'messages' && (
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
                          </td>
                  <div>
                    <button onClick={() => alert('Personel ekleme formu yapım aşamasında')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm w-full md:w-auto justify-center">
                      <Plus size={18} /> Personel Ekle
                    </button>
                  </div>
                </div>
                {orgChartMembers.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white/80 rounded-full shadow-inner flex items-center justify-center mb-6 border border-white/60">
                      <Users className="text-blue-400" size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-800 mb-3">Şema Boş</h4>
                    <p className="text-gray-500 max-w-md font-medium">Organizasyon şemasına henüz personel eklenmemiş. "Personel Ekle" butonunu kullanarak ekibinizi kurabilirsiniz.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Tablo Gelecek */}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ayarlar İskeleti */}
          {['settings'].includes(activeTab) && (
            <div className="max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center mb-6 shadow-sm border border-white/60">
                <Settings size={48} className="text-gray-400 animate-spin-slow" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Sistem Ayarları Modülü</h2>
              <p className="text-gray-500 max-w-lg mb-8 font-medium">
                Sistem genel ayarları, API entegrasyonları, kullanıcı rolleri ve güvenlik tercihleri burada yönetilecektir.
              </p>
              <button onClick={() => setActiveTab('overview')} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-xl hover:shadow-2xl">
                Ana Özete Dön
              </button>
            </div>
          )}

          {/* Yetkili Kadro Yönetimi */}
          {activeTab === 'staff_management' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Akademik Kadro ve Yetkiler</h3>
                  <p className="text-gray-500 text-sm mt-1">Sisteme erişebilen hocaların yetki seviyelerini buradan yönetebilirsiniz.</p>
                </div>
                <button onClick={() => setShowStaffModal(true)} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-[0.98]">
                  <ShieldCheck size={18} /> Yeni Personel Ekle
                </button>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Personel Adı</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">E-Posta</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Yetki Seviyesi</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                                {staff.name.charAt(0)}
                              </div>
                              <span className="font-bold text-gray-900">{staff.name}</span>
                            </div>
                          </td>
                          <td className="p-5 text-gray-600 font-medium text-[14px]">{staff.email}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              staff.role === 'super_admin' ? 'bg-red-100 text-red-700' : 
                              staff.role === 'content_admin' ? 'bg-blue-100 text-blue-700' : 
                              staff.role === 'mentor_admin' ? 'bg-purple-100 text-purple-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {staff.role === 'super_admin' ? 'Süper Admin' : 
                               staff.role === 'content_admin' ? 'İçerik Yöneticisi' : 
                               staff.role === 'mentor_admin' ? 'Danışman Mentor' : 
                               'Standart Akademisyen'}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button onClick={() => {
                              if(window.confirm('Bu personeli silmek istediğinize emin misiniz?')) {
                                setStaffList(staffList.filter(s => s.id !== staff.id));
                              }
                            }} className="text-gray-400 hover:text-red-600 transition-colors">
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Staff Modal */}
              {showStaffModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-900">Yeni Personel Ekle</h3>
                        <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      </div>
                      <form onSubmit={handleSaveStaff} className="space-y-5">
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Ad Soyad Unvan</label>
                          <input type="text" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Örn: Prof. Dr. Ahmet Yılmaz" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">E-Posta Adresi</label>
                          <input type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="E-Posta" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Yetki Seviyesi</label>
                          <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" required>
                            <option value="super_admin">Süper Admin (Tam Yetki)</option>
                            <option value="content_admin">İçerik Yöneticisi (Haber/Etkinlik)</option>
                            <option value="mentor_admin">Danışman (Sadece Mentorluk)</option>
                            <option value="standard_academic">Standart (Sadece Akış Paylaşımı)</option>
                          </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                          <button type="button" onClick={() => setShowStaffModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                          <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg transition-all">Kaydet</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'counseling' && (
            <div className="max-w-4xl mx-auto animate-fade-in p-12 text-center bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 mt-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-6 text-iesu-red shadow-lg shadow-red-500/20">
                  <MessageSquareQuote size={40} />
                </div>
                <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">Danışmanlık Talepleri (Yakında)</h2>
                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed font-medium">
                  Öğrencilerin ve mezunların kariyer danışmanlık randevuları ve talepleri bu alanda listelenecektir. Takvim entegrasyonu ve onay süreçleri aktif edildiğinde bu panel kullanıma açılacaktır.
                </p>
              </div>
            </div>
          )}
                      <Users className="text-blue-400" size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-800 mb-3">Şema Boş</h4>
                    <p className="text-gray-500 max-w-md font-medium">Organizasyon şemasına henüz personel eklenmemiş. "Personel Ekle" butonunu kullanarak ekibinizi kurabilirsiniz.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Tablo Gelecek */}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ayarlar İskeleti */}
          {['settings'].includes(activeTab) && (
            <div className="max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center mb-6 shadow-sm border border-white/60">
                <Settings size={48} className="text-gray-400 animate-spin-slow" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Sistem Ayarları Modülü</h2>
              <p className="text-gray-500 max-w-lg mb-8 font-medium">
                Sistem genel ayarları, API entegrasyonları, kullanıcı rolleri ve güvenlik tercihleri burada yönetilecektir.
              </p>
              <button onClick={() => setActiveTab('overview')} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-xl hover:shadow-2xl">
                Ana Özete Dön
              </button>
            </div>
          )}

          {/* Yetkili Kadro Yönetimi */}
          {activeTab === 'staff_management' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Akademik Kadro ve Yetkiler</h3>
                  <p className="text-gray-500 text-sm mt-1">Sisteme erişebilen hocaların yetki seviyelerini buradan yönetebilirsiniz.</p>
                </div>
                <button onClick={() => setShowStaffModal(true)} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-[0.98]">
                  <ShieldCheck size={18} /> Yeni Personel Ekle
                </button>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Personel Adı</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">E-Posta</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Yetki Seviyesi</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                                {staff.name.charAt(0)}
                              </div>
                              <span className="font-bold text-gray-900">{staff.name}</span>
                            </div>
                          </td>
                          <td className="p-5 text-gray-600 font-medium text-[14px]">{staff.email}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              staff.role === 'super_admin' ? 'bg-red-100 text-red-700' : 
                              staff.role === 'content_admin' ? 'bg-blue-100 text-blue-700' : 
                              staff.role === 'mentor_admin' ? 'bg-purple-100 text-purple-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {staff.role === 'super_admin' ? 'Süper Admin' : 
                               staff.role === 'content_admin' ? 'İçerik Yöneticisi' : 
                               staff.role === 'mentor_admin' ? 'Danışman Mentor' : 
                               'Standart Akademisyen'}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button onClick={() => {
                              if(window.confirm('Bu personeli silmek istediğinize emin misiniz?')) {
                                setStaffList(staffList.filter(s => s.id !== staff.id));
                              }
                            }} className="text-gray-400 hover:text-red-600 transition-colors">
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Staff Modal */}
              {showStaffModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-900">Yeni Personel Ekle</h3>
                        <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      </div>
                      <form onSubmit={handleSaveStaff} className="space-y-5">
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Ad Soyad Unvan</label>
                          <input type="text" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Örn: Prof. Dr. Ahmet Yılmaz" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">E-Posta Adresi</label>
                          <input type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="E-Posta" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Yetki Seviyesi</label>
                          <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" required>
                            <option value="super_admin">Süper Admin (Tam Yetki)</option>
                            <option value="content_admin">İçerik Yöneticisi (Haber/Etkinlik)</option>
                            <option value="mentor_admin">Danışman (Sadece Mentorluk)</option>
                            <option value="standard_academic">Standart (Sadece Akış Paylaşımı)</option>
                          </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                          <button type="button" onClick={() => setShowStaffModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                          <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg transition-all">Kaydet</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'counseling' && (
            <div className="max-w-4xl mx-auto animate-fade-in p-12 text-center bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 mt-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-6 text-iesu-red shadow-lg shadow-red-500/20">
                  <MessageSquareQuote size={40} />
                </div>
                <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">Danışmanlık Talepleri (Yakında)</h2>
                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed font-medium">
                  Öğrencilerin ve mezunların kariyer danışmanlık randevuları ve talepleri bu alanda listelenecektir. Takvim entegrasyonu ve onay süreçleri aktif edildiğinde bu panel kullanıma açılacaktır.
                </p>
              </div>
            </div>
          )}
          {/* Yetkili Kadro Yönetimi */}
          {activeTab === 'staff_management' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Akademik Kadro ve Yetkiler</h3>
                  <p className="text-gray-500 text-sm mt-1">Sisteme erişebilen hocaların yetki seviyelerini buradan yönetebilirsiniz.</p>
                </div>
                <button onClick={() => setShowStaffModal(true)} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-[0.98]">
                  <ShieldCheck size={18} /> Yeni Personel Ekle
                </button>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Personel Adı</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">E-Posta</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Yetki Seviyesi</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                                {staff.name.charAt(0)}
                              </div>
                              <span className="font-bold text-gray-900">{staff.name}</span>
                            </div>
                          </td>
                          <td className="p-5 text-gray-600 font-medium text-[14px]">{staff.email}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              staff.role === 'super_admin' ? 'bg-red-100 text-red-700' : 
                              staff.role === 'content_admin' ? 'bg-blue-100 text-blue-700' : 
                              staff.role === 'mentor_admin' ? 'bg-purple-100 text-purple-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {staff.role === 'super_admin' ? 'Süper Admin' : 
                               staff.role === 'content_admin' ? 'İçerik Yöneticisi' : 
                               staff.role === 'mentor_admin' ? 'Danışman Mentor' : 
                               'Standart Akademisyen'}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button onClick={() => {
                              if(window.confirm('Bu personeli silmek istediğinize emin misiniz?')) {
                                setStaffList(staffList.filter(s => s.id !== staff.id));
                              }
                            }} className="text-gray-400 hover:text-red-600 transition-colors">
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Staff Modal */}
              {showStaffModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-900">Yeni Personel Ekle</h3>
                        <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      </div>
                      <form onSubmit={handleSaveStaff} className="space-y-5">
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Ad Soyad Unvan</label>
                          <input type="text" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Örn: Prof. Dr. Ahmet Yılmaz" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">E-Posta Adresi</label>
                          <input type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="E-Posta" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Yetki Seviyesi</label>
                          <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" required>
                            <option value="super_admin">Süper Admin (Tam Yetki)</option>
                            <option value="content_admin">İçerik Yöneticisi (Haber/Etkinlik)</option>
                            <option value="mentor_admin">Danışman (Sadece Mentorluk)</option>
                            <option value="standard_academic">Standart (Sadece Akış Paylaşımı)</option>
                          </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                          <button type="button" onClick={() => setShowStaffModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                          <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg transition-all">Kaydet</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'counseling' && (
          {activeTab === 'staff_management' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Akademik Kadro ve Yetkiler</h3>
                  <p className="text-gray-500 text-sm mt-1">Sisteme erişebilen hocaların yetki seviyelerini buradan yönetebilirsiniz.</p>
                </div>
                <button onClick={() => setShowStaffModal(true)} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-[0.98]">
                  + Yeni Personel Ekle
                </button>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Personel Adı</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">E-Posta</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Yetki Seviyesi</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                                {staff.name.charAt(0)}
                              </div>
                              <span className="font-bold text-gray-900">{staff.name}</span>
                            </div>
                          </td>
                          <td className="p-5 text-gray-600 font-medium text-[14px]">{staff.email}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              staff.role === 'super_admin' ? 'bg-red-100 text-red-700' : 
                              staff.role === 'content_admin' ? 'bg-blue-100 text-blue-700' : 
                              staff.role === 'mentor_admin' ? 'bg-purple-100 text-purple-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {staff.role === 'super_admin' ? 'Süper Admin' : 
                               staff.role === 'content_admin' ? 'İçerik Yöneticisi' : 
                               staff.role === 'mentor_admin' ? 'Danışman Mentor' : 
                               'Standart Akademisyen'}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button onClick={() => {
                              if(window.confirm('Bu personeli silmek istediğinize emin misiniz?')) {
                                setStaffList(staffList.filter(s => s.id !== staff.id));
                              }
                            }} className="text-gray-400 hover:text-red-600 transition-colors">
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Staff Modal */}
              {showStaffModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-900">Yeni Personel Ekle</h3>
                        <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      </div>
                      <form onSubmit={handleSaveStaff} className="space-y-5">
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Ad Soyad Unvan</label>
                          <input type="text" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Örn: Prof. Dr. Ahmet Yılmaz" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">E-Posta Adresi</label>
                          <input type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="E-Posta" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Yetki Seviyesi</label>
                          <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" required>
                            <option value="super_admin">Süper Admin (Tam Yetki)</option>
                            <option value="content_admin">İçerik Yöneticisi (Haber/Etkinlik)</option>
                            <option value="mentor_admin">Danışman (Sadece Mentorluk)</option>
                            <option value="standard_academic">Standart (Sadece Akış Paylaşımı)</option>
                          </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                          <button type="button" onClick={() => setShowStaffModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                          <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg transition-all">Kaydet</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
          {/* Ayarlar İskeleti */}
          {['settings'].includes(activeTab) && (
            <div className="max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center mb-6 shadow-sm border border-white/60">
                <Settings size={48} className="text-gray-400 animate-spin-slow" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Sistem Ayarları Modülü</h2>
              <p className="text-gray-500 max-w-lg mb-8 font-medium">
                Sistem genel ayarları, API entegrasyonları, kullanıcı rolleri ve güvenlik tercihleri burada yönetilecektir.
              </p>
              <button onClick={() => setActiveTab('overview')} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-xl hover:shadow-2xl">
                Ana Özete Dön
              </button>
            </div>
          )}

          {/* Yetkili Kadro Yönetimi */}
          {activeTab === 'staff_management' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Akademik Kadro ve Yetkiler</h3>
                  <p className="text-gray-500 text-sm mt-1">Sisteme erişebilen hocaların yetki seviyelerini buradan yönetebilirsiniz.</p>
                </div>
                <button onClick={() => setShowStaffModal(true)} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-[0.98]">
                  + Yeni Personel Ekle
                </button>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Personel Adı</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">E-Posta</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Yetki Seviyesi</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                                {staff.name.charAt(0)}
                              </div>
                              <span className="font-bold text-gray-900">{staff.name}</span>
                            </div>
                          </td>
                          <td className="p-5 text-gray-600 font-medium text-[14px]">{staff.email}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              staff.role === 'super_admin' ? 'bg-red-100 text-red-700' : 
                              staff.role === 'content_admin' ? 'bg-blue-100 text-blue-700' : 
                              staff.role === 'mentor_admin' ? 'bg-purple-100 text-purple-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {staff.role === 'super_admin' ? 'Süper Admin' : 
                               staff.role === 'content_admin' ? 'İçerik Yöneticisi' : 
                               staff.role === 'mentor_admin' ? 'Danışman Mentor' : 
                               'Standart Akademisyen'}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button onClick={() => {
                              if(window.confirm('Bu personeli silmek istediğinize emin misiniz?')) {
                                setStaffList(staffList.filter(s => s.id !== staff.id));
                              }
                            }} className="text-gray-400 hover:text-red-600 transition-colors">
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Staff Modal */}
              {showStaffModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-900">Yeni Personel Ekle</h3>
                        <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      </div>
                      <form onSubmit={handleSaveStaff} className="space-y-5">
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Ad Soyad Unvan</label>
                          <input type="text" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Örn: Prof. Dr. Ahmet Yılmaz" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">E-Posta Adresi</label>
                          <input type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="E-Posta" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Yetki Seviyesi</label>
                          <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" required>
                            <option value="super_admin">Süper Admin (Tam Yetki)</option>
                            <option value="content_admin">İçerik Yöneticisi (Haber/Etkinlik)</option>
                            <option value="mentor_admin">Danışman (Sadece Mentorluk)</option>
                            <option value="standard_academic">Standart (Sadece Akış Paylaşımı)</option>
                          </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                          <button type="button" onClick={() => setShowStaffModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                          <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg transition-all">Kaydet</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'counseling' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Akademik Kadro ve Yetkiler</h3>
                  <p className="text-gray-500 text-sm mt-1">Sisteme erişebilen hocaların yetki seviyelerini buradan yönetebilirsiniz.</p>
                </div>
                <button onClick={() => setShowStaffModal(true)} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-[0.98]">
                  + Yeni Personel Ekle
                </button>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Personel Adı</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">E-Posta</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Yetki Seviyesi</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                                {staff.name.charAt(0)}
                              </div>
                              <span className="font-bold text-gray-900">{staff.name}</span>
                            </div>
                          </td>
                          <td className="p-5 text-gray-600 font-medium text-[14px]">{staff.email}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              staff.role === 'super_admin' ? 'bg-red-100 text-red-700' : 
                              staff.role === 'content_admin' ? 'bg-blue-100 text-blue-700' : 
                              staff.role === 'mentor_admin' ? 'bg-purple-100 text-purple-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {staff.role === 'super_admin' ? 'Süper Admin' : 
                               staff.role === 'content_admin' ? 'İçerik Yöneticisi' : 
                               staff.role === 'mentor_admin' ? 'Danışman Mentor' : 
                               'Standart Akademisyen'}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button onClick={() => {
                              if(window.confirm('Bu personeli silmek istediğinize emin misiniz?')) {
                                setStaffList(staffList.filter(s => s.id !== staff.id));
                              }
                            }} className="text-gray-400 hover:text-red-600 transition-colors">
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Staff Modal */}
              {showStaffModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-900">Yeni Personel Ekle</h3>
                        <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      </div>
                      <form onSubmit={handleSaveStaff} className="space-y-5">
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Ad Soyad Unvan</label>
                          <input type="text" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Örn: Prof. Dr. Ahmet Yılmaz" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">E-Posta Adresi</label>
                          <input type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="E-Posta" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Yetki Seviyesi</label>
                          <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" required>
                            <option value="super_admin">Süper Admin (Tam Yetki)</option>
                            <option value="content_admin">İçerik Yöneticisi (Haber/Etkinlik)</option>
                            <option value="mentor_admin">Danışman (Sadece Mentorluk)</option>
                            <option value="standard_academic">Standart (Sadece Akış Paylaşımı)</option>
                          </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                          <button type="button" onClick={() => setShowStaffModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                          <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-iesu-red text-white hover:bg-iesu-darkRed transition-all">Kaydet</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Akademik Kadro ve Yetkiler</h3>
                  <p className="text-gray-500 text-sm mt-1">Sisteme erişebilen hocaların yetki seviyelerini buradan yönetebilirsiniz.</p>
                </div>
                <button onClick={() => setShowStaffModal(true)} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-[0.98]">
                  + Yeni Personel Ekle
                </button>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Personel Adı</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">E-Posta</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Yetki Seviyesi</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                                {staff.name.charAt(0)}
                              </div>
                              <span className="font-bold text-gray-900">{staff.name}</span>
                            </div>
                          </td>
                          <td className="p-5 text-gray-600 font-medium text-[14px]">{staff.email}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              staff.role === 'super_admin' ? 'bg-red-100 text-red-700' : 
                              staff.role === 'content_admin' ? 'bg-blue-100 text-blue-700' : 
                              staff.role === 'mentor_admin' ? 'bg-purple-100 text-purple-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {staff.role === 'super_admin' ? 'Süper Admin' : 
                               staff.role === 'content_admin' ? 'İçerik Yöneticisi' : 
                               staff.role === 'mentor_admin' ? 'Danışman Mentor' : 
                               'Standart Akademisyen'}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button onClick={() => {
                              if(window.confirm('Bu personeli silmek istediğinize emin misiniz?')) {
                                setStaffList(staffList.filter(s => s.id !== staff.id));
                              }
                            }} className="text-gray-400 hover:text-red-600 transition-colors">
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Staff Modal */}
              {showStaffModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-900">Yeni Personel Ekle</h3>
                        <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      </div>
                      <form onSubmit={handleSaveStaff} className="space-y-5">
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Ad Soyad Unvan</label>
                          <input type="text" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Örn: Prof. Dr. Ahmet Yılmaz" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">E-Posta Adresi</label>
                          <input type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="E-Posta" required />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Yetki Seviyesi</label>
                          <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" required>
                            <option value="super_admin">Süper Admin (Tam Yetki)</option>
                            <option value="content_admin">İçerik Yöneticisi (Haber/Etkinlik)</option>
                            <option value="mentor_admin">Danışman (Sadece Mentorluk)</option>
                            <option value="standard_academic">Standart (Sadece Akış Paylaşımı)</option>
                          </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                          <button type="button" onClick={() => setShowStaffModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                          <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-iesu-red text-white hover:bg-iesu-darkRed transition-all">Kaydet</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
                    <input type="text" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Öğrenci Ara..." className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-iesu-coral outline-none text-sm w-full md:w-64 shadow-sm" />
                    <label className={`flex items-center gap-2 bg-gradient-to-r from-iesu-red to-iesu-coral text-white px-6 py-3 rounded-xl font-bold transition-all border border-transparent w-full md:w-auto justify-center ${isSyncing ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-red-500/30 cursor-pointer'}`}>
                      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />} 
                      {isSyncing ? 'Excel Verisi İşleniyor...' : "Excel'den Toplu İçe Aktar"}
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { if(e.target.files.length) handleSync('students'); }} disabled={isSyncing} />
                    </label>
                      disabled={isSyncing}
                      className="flex items-center gap-2 bg-gradient-to-r from-iesu-red to-iesu-coral text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all border border-transparent disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                    >
                      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />} 
                      {isSyncing ? 'Excel Verisi İşleniyor...' : "Excel'den Toplu İçe Aktar"}
                    </button>
                    {students?.length > 0 && (
                      <button className="flex items-center gap-2 bg-white text-green-600 px-5 py-3 rounded-xl font-bold hover:bg-green-50 transition border border-green-200 shadow-sm shrink-0 w-full md:w-auto justify-center">
                        <FileSpreadsheet size={18} /> Excel Olarak İndir
                      </button>
                    )}
                  </div>
                </div>
                
                {students?.length === 0 ? (
                    <label className={`flex items-center gap-2 bg-white border-2 border-iesu-red text-iesu-red px-8 py-3 rounded-full font-bold transition-all shadow-sm ${isSyncing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-iesu-red hover:text-white cursor-pointer'}`}>
                      {isSyncing ? <Loader2 size={20} className="animate-spin" /> : <FileSpreadsheet size={20} />}
                      {isSyncing ? 'Veri İşleniyor...' : "Excel'den Toplu Aktar"}
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { if(e.target.files.length) handleSync('students'); }} disabled={isSyncing} />
                    </label>
                  </div>
                      className="flex items-center gap-2 bg-white border-2 border-iesu-red text-iesu-red px-8 py-3 rounded-full font-bold hover:bg-iesu-red hover:text-white transition-all shadow-sm"
                    >
                      {isSyncing ? <Loader2 size={20} className="animate-spin" /> : <FileSpreadsheet size={20} />}
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Durum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredStudents?.map((student) => (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        </nav>
      </div>

      {/* Job Publishing Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{editingJob ? 'İlanı Düzenle' : 'Yeni İlan Yayınla'}</h3>
                  <p className="text-gray-500 text-sm mt-1">{editingJob ? 'İlan bilgilerini güncelleyin.' : 'Öğrenci ve mezunların akışına yeni bir ilan ekleyin.'}</p>
                </div>
                <button onClick={() => setShowJobModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSaveJob} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">İlan Başlığı</label>
                    <input type="text" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Firma / Kurum Adı</label>
                    <input type="text" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Çalışma Türü</label>
                    <select value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                      <option value="TAM ZAMANLI">Tam Zamanlı</option>
                      <option value="YARI ZAMANLI">Yarı Zamanlı</option>
                      <option value="STAJ">Staj</option>
                      <option value="GÖNÜLLÜ">Gönüllü</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Konum (Şehir/İlçe)</label>
                    <input type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Afiş / Görsel URL (Opsiyonel)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="url" placeholder="https://ornek.com/afis.jpg" value={jobForm.poster} onChange={e => setJobForm({...jobForm, poster: e.target.value})} className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">İlanın akışta daha dikkat çekici görünmesi için afiş URL'si girebilirsiniz.</p>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">İlan Detayı / Açıklama</label>
                  <textarea value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} rows="4" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" required></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button type="button" onClick={() => setShowJobModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">
                    <CheckCircle size={18} /> {editingJob ? 'Güncelle' : 'Yayınla ve Havuza Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mentor Call Modal */}
      {showMentorCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-xl text-red-600">
                    <Send size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Mentorluk Çağrısı Yayınla</h3>
                    <p className="text-gray-500 text-xs mt-1">Mezun akışına başvuru formu çağrısı gönder.</p>
                  </div>
                </div>
                <button onClick={() => setShowMentorCallModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handlePublishMentorCall} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Çağrı Başlığı</label>
                  <input type="text" value={mentorCallForm.title} onChange={e => setMentorCallForm({...mentorCallForm, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Çağrı İçeriği</label>
                  <textarea value={mentorCallForm.description} onChange={e => setMentorCallForm({...mentorCallForm, description: e.target.value})} rows="4" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none" required></textarea>
                </div>

                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3">
                  <Heart className="text-red-500 shrink-0" size={20} />
                  <p className="text-xs text-red-800 leading-relaxed font-medium">
                    Bu çağrı yayınlandığında, öğrenci ve mezunların akışında belirecek. Çağrıyı gören kullanıcılar <strong>"Hemen Başvur"</strong> butonuna tıklayarak doğrudan Mentorluk Başvuru Formunu doldurabilecekler.
                  </p>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button type="button" onClick={() => setShowMentorCallModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-red-500 to-red-700 text-white hover:shadow-lg transition-all flex items-center gap-2">
                    <Send size={18} /> Akışta Yayınla
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs">{student.name.charAt(0)}</div>
                            {student.name}
                          </td>
                          <td className="p-5 text-gray-500 font-mono">{student.no}</td>
                          <td className="p-5 text-gray-700">{student.department} <span className="text-gray-400 font-medium">({student.year})</span></td>
                          <td className="p-5 text-gray-700 text-center font-bold">{student.gpa}</td>
                          <td className="p-5 text-gray-500 text-center">{student.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button onClick={() => alert('Düzenleme paneli yapım aşamasında.')} className="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition mr-2">Düzenle</button>
                            <button onClick={() => handleDeleteStudent(student.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
            </div>
          )}
              </div>
            </div>
          )}
          )}

          {activeTab === 'sem' && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-8 border-b border-gray-100 bg-gray-50">
                    </tbody>
                  </table>
          {activeTab === 'alumni_pool' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 mb-8 overflow-hidden">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <GraduationCap className="text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" size={32} /> Mezun Data Havuzu
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">İESÜ Mezunlarının kayıtları ve güncel istihdam durumları ({alumni?.length || 0} kayıt).</p>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
                    <input type="text" value={alumniSearch} onChange={(e) => setAlumniSearch(e.target.value)} placeholder="Mezun Ara..." className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm w-full md:w-64 shadow-sm" />
                    <label className={`flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all border border-transparent w-full md:w-auto justify-center ${isSyncing ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer'}`}>
                      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />} 
                      {isSyncing ? 'Excel Verisi İşleniyor...' : "Excel'den Toplu İçe Aktar"}
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { if(e.target.files.length) handleSync('alumni'); }} disabled={isSyncing} />
                    </label>
                    >
                      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />} 
                      {isSyncing ? 'Sistemden Senkronize Ediliyor...' : 'Mezuniyet / OBS Senkronizasyonu'}
                    </button>
                    {alumni?.length > 0 && (
                    <button 
                      onClick={() => handleSync('alumni')}
                      disabled={isSyncing}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all border border-transparent disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                    >
                      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />} 
                      {isSyncing ? 'Excel Verisi İşleniyor...' : "Excel'den Toplu İçe Aktar"}
                    </button>
                    {alumni?.length > 0 && (
                    <label className={`flex items-center gap-2 bg-white border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-full font-bold transition-all shadow-sm ${isSyncing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}`}>
                      {isSyncing ? <Loader2 size={20} className="animate-spin" /> : <FileSpreadsheet size={20} />}
                      {isSyncing ? 'Veri İşleniyor...' : "Excel'den Toplu Aktar"}
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { if(e.target.files.length) handleSync('alumni'); }} disabled={isSyncing} />
                    </label>
                  </div>
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <GraduationCap size={40} className="text-blue-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">Mezun Havuzu Şu An Boş</h4>
                    <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">Mezunlar portal üzerinden E-Devlet ile kayıt olduklarında otomatik olarak bu havuza düşeceklerdir. Alternatif olarak mevcut mezun listenizi Excel ile sisteme yükleyebilirsiniz.</p>
                    <button 
                      onClick={() => handleSync('alumni')}
                      disabled={isSyncing}
                        <th className="p-5 font-bold uppercase tracking-wider">İletişim</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredAlumni?.map((alum) => (
                        <tr key={alum.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-5 text-gray-400 font-mono text-center">#{alum.id}</td>
                          <td className="p-5 font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-iesu-red text-white flex items-center justify-center font-bold text-xs">{alum.name.charAt(0)}</div>
                            {alum.name}
                          </td>
                          <td className="p-5 text-gray-600">{alum.department} <span className="font-bold text-gray-400">({alum.gradYear})</span></td>
                          <td className="p-5 text-blue-600 font-bold">{alum.company}</td>
                          <td className="p-5 text-gray-700">{alum.title}</td>
                          <td className="p-5 text-gray-500 text-xs">{alum.email}</td>
                          <td className="p-5 text-right">
                            <button onClick={() => alert('Düzenleme paneli yapım aşamasında.')} className="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition mr-2">Düzenle</button>
                            <button onClick={() => handleDeleteAlumni(alum.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">GNO</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Kayıt Tarihi</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {students?.map((student) => (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-5 text-gray-400 font-mono text-center">#{student.id}</td>
          {activeTab === 'company' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 mb-8 overflow-hidden">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <Building2 className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" size={32} /> Firma Veritabanı & Onaylar
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Sisteme kayıtlı veya onay bekleyen şirketler ({companies?.length || 0} kayıt).</p>
                  </div>
                    <input type="text" value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} placeholder="Şirket Ara..." className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none text-sm w-full md:w-64 shadow-sm" />
                    <label className={`flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-xl font-bold transition-all border border-transparent w-full md:w-auto justify-center ${isSyncing ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-gray-900/30 cursor-pointer'}`}>
                      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />} 
                      {isSyncing ? 'Veriler Alınıyor...' : "Excel'den Firma Listesi Aktar"}
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { if(e.target.files.length) handleSync('companies'); }} disabled={isSyncing} />
                    </label>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gray-300/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                      <Building2 className="text-gray-700" size={28} /> Firma Veritabanı & Onaylar
                    </h3>
                    <p className="text-gray-500 mt-2 font-medium">Sisteme kayıtlı veya onay bekleyen şirketler ({companies?.length || 0} kayıt).</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
                    <button 
                      onClick={() => handleSync('companies')}
                    <label className={`flex items-center gap-2 bg-white border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full font-bold transition-all shadow-sm ${isSyncing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}>
                      {isSyncing ? <Loader2 size={20} className="animate-spin" /> : <FileSpreadsheet size={20} />}
                      {isSyncing ? 'İşleniyor...' : "Excel'den Firma Aktar"}
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { if(e.target.files.length) handleSync('companies'); }} disabled={isSyncing} />
                    </label>
                  </div>
                      </button>
                    )}
                  </div>
                </div>
                
                {companies?.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center bg-white/40">
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Durum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredCompanies?.map((company) => (
                        <tr key={company.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-5 font-bold text-gray-900 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-400">
                              {company.name.charAt(0)}
                            </div>
                            <div>
                              {company.name}
                              <div className="text-xs font-normal text-gray-500">{company.sector}</div>
                            </div>
                          </td>
                          <td className="p-5 text-gray-600">{company.contact} <span className="text-gray-400 text-xs block">{company.email}</span></td>
                          <td className="p-5 text-gray-500 font-mono text-sm">{company.taxNo}</td>
                          <td className="p-5 text-gray-500 text-center">{company.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${company.status === 'Onaylandı' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {company.status}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end">
                            {company.status === 'Beklemede' && (
                              <button onClick={() => setCompanies(companies.map(c => c.id === company.id ? { ...c, status: 'Onaylandı' } : c))} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold transition mr-2">Onayla</button>
                            )}
                            <button onClick={() => alert('Düzenleme paneli yapım aşamasında.')} className="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition mr-2">Düzenle</button>
                            <button onClick={() => handleDeleteCompany(company.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />} 
                      {isSyncing ? 'Veriler Alınıyor...' : 'Sistem Senkronizasyonu'}
                    </button>
                    {companies?.length > 0 && (
                      <button className="flex items-center gap-2 bg-white text-gray-700 px-5 py-3 rounded-xl font-bold hover:bg-gray-50 transition border border-gray-200 shadow-sm shrink-0 w-full md:w-auto justify-center">
                        <Building2 size={18} /> Yeni Firma Ekle
                      </button>
                            <div className="flex justify-center gap-2">
                              {company.status === 'Onay Bekliyor' ? (
                                <>
                                  <button onClick={() => setCompanies(companies.map(c => c.id === company.id ? { ...c, status: 'Onaylı' } : c))} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition tooltip" title="Onayla">
                                    <Check size={18} />
                                  </button>
                                  <button onClick={() => handleDeleteCompany(company.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition tooltip" title="Reddet">
                                    <X size={18} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => alert('Düzenleme paneli yapım aşamasında.')} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-xs font-bold whitespace-nowrap">
                                    Düzenle
                                  </button>
                                  <button onClick={() => handleDeleteCompany(company.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-xs font-bold whitespace-nowrap">
                                    Sil
                                  </button>
                                </>
                              )}
                            </div>
                      {isSyncing ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                      Senkronizasyonu Başlat
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto bg-white/40">
                    <button className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2.5 rounded-xl font-bold hover:bg-green-200 transition border border-green-200 shadow-sm shrink-0">
                      <FileSpreadsheet size={18} /> Excel'e Aktar
                    </button>
                  </div>
          {activeTab === 'job_intern_approvals' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <Briefcase className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" size={32} /> İş ve Staj İlanları Havuzu
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Sistemde yayınlanan ve onay bekleyen ilanları yönetin ({jobs.length} İlan).</p>
                  </div>
                  <div className="relative z-10">
                  </div>
                  <div className="relative z-10">
                    <button onClick={() => alert('Yeni İlan ekleme paneli yapım aşamasında.')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm w-full md:w-auto justify-center">
                      <Briefcase size={18} /> Yeni İlan Ekle
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-white/40 max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className="text-gray-500 text-sm border-b border-gray-200">
                        <th className="p-5 font-bold uppercase tracking-wider text-center">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider">İlan Başlığı & Türü</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Firma / Kurum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Tarih</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Durum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {jobs.map((job) => (
                        <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-5 text-gray-400 font-mono text-center">#{job.id}</td>
                          <td className="p-5 font-bold text-gray-900">
                            {job.title}
                            <span className={`block mt-1 w-max px-2 py-0.5 rounded text-[10px] font-bold ${job.type === 'STAJ' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                              {job.type}
                            </span>
                          </td>
                          <td className="p-5 text-gray-600 font-medium">{job.company}</td>
                          <td className="p-5 text-gray-500 font-mono text-center">{job.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'Yayında' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2">
                            {job.status === 'Beklemede' && (
                              <button onClick={() => setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'Yayında' } : j))} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Yayınla</button>
                            )}
                            <button onClick={() => alert('Düzenleme paneli yapım aşamasında.')} className="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Düzenle</button>
                            <button onClick={() => handleDeleteJob(job.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'mentorship' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-red-950 via-gray-900 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <Heart className="text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" size={32} /> Mentorluk Programı
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Mentor (Uzman) ve Menti (Öğrenci) eşleştirmelerini ve program süreçlerini yönetin ({mentorships.length} Kayıt).</p>
                  </div>
                  <div className="relative z-10">
                    <button onClick={() => alert('Yeni eşleştirme paneli yapım aşamasında.')} className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-0.5 w-full md:w-auto justify-center border border-red-400/50">
                      <Heart size={18} /> Yeni Eşleştirme
                    </button>
                  </div>
                </div>
                      <Heart size={18} /> Yeni Eşleştirme
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/50 border-b border-white">
                      <tr className="text-gray-600 text-sm">
                        <th className="p-5 font-bold uppercase tracking-wider text-center">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Mentor (Uzman)</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Menti (Öğrenci)</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Tarih</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Durum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {mentorships.map((m) => (
                        <tr key={m.id} className="border-b border-white/40 hover:bg-white/50 transition-colors">
                          <td className="p-5 text-gray-400 font-mono text-center">#{m.id}</td>
                          <td className="p-5 font-bold text-gray-900">{m.mentor}</td>
                          <td className="p-5 text-gray-700 font-medium">{m.mentee}</td>
                          <td className="p-5 text-gray-600 font-mono text-center">{m.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2">
                            {m.status === 'Eşleştirme Bekliyor' && (
                              <button onClick={() => setMentorships(mentorships.map(x => x.id === m.id ? { ...x, status: 'Aktif' } : x))} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Onayla</button>
                            )}
                            <button onClick={() => handleDeleteMentorship(m.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          {activeTab === 'volunteer_intern' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <FileCheck className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" size={32} /> Gönüllü Staj Başvuruları
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Öğrencilerin gönüllü staj başvuru süreçlerini ve kurum onaylarını takip edin ({volunteerInterns.length} Başvuru).</p>
                  </div>
                </div>
                    </h3>
                    <p className="text-gray-600 mt-2 font-medium">Öğrencilerin gönüllü staj başvuru süreçlerini ve kurum onaylarını takip edin ({volunteerInterns.length} Başvuru).</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/50 border-b border-white">
                      <tr className="text-gray-600 text-sm">
                        <th className="p-5 font-bold uppercase tracking-wider text-center">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Öğrenci & Bölüm</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Staj Yapılacak Kurum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Süre</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Durum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {volunteerInterns.map((v) => (
                        <tr key={v.id} className="border-b border-white/40 hover:bg-white/50 transition-colors">
                          <td className="p-5 text-gray-400 font-mono text-center">#{v.id}</td>
                          <td className="p-5 font-bold text-gray-900">
                            {v.student}
                            <span className="block text-xs text-gray-500 font-medium">{v.department}</span>
                          </td>
                          <td className="p-5 text-gray-700 font-medium">{v.company}</td>
                          <td className="p-5 text-gray-600 font-mono text-center">{v.duration}</td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${v.status === 'Onaylandı' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {v.status}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2">
                            {v.status === 'Onay Bekliyor' && (
                              <button onClick={() => setVolunteerInterns(volunteerInterns.map(x => x.id === v.id ? { ...x, status: 'Onaylandı' } : x))} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Onayla</button>
                            )}
                            <button onClick={() => handleDeleteIntern(v.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          {activeTab === 'alumni_assoc' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <Network className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" size={32} /> Mezun Derneği Paneli
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Mezun derneği üyelerini, aidat ve katılım durumlarını yönetin.</p>
                  </div>
                </div>
                    </h3>
                    <p className="text-gray-600 mt-2 font-medium">Mezun derneği üyelerini, aidat ve katılım durumlarını yönetin.</p>
                  </div>
                </div>
                {alumniAssocMembers.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white/80 rounded-full shadow-inner flex items-center justify-center mb-6 border border-white/60">
                      <Users className="text-emerald-400" size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-800 mb-3">Kayıt Bulunamadı</h4>
                    <p className="text-gray-500 max-w-md font-medium">Sistemde henüz onaylanmış veya bekleyen bir mezun derneği üyelik kaydı bulunmuyor. Yeni başvurular buraya düşecektir.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Tablo Gelecek */}
                  </div>
                )}
              </div>
          {activeTab === 'alumni_card' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <CreditCard className="text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" size={32} /> Mezun Kart Başvuruları
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Öğrencilerin ve mezunların fiziksel/dijital mezun kart basım süreçlerini takip edin.</p>
                  </div>
                </div>
                    </h3>
                    <p className="text-gray-600 mt-2 font-medium">Öğrencilerin ve mezunların fiziksel/dijital mezun kart basım süreçlerini takip edin.</p>
                  </div>
                </div>
                {alumniCardRequests.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white/80 rounded-full shadow-inner flex items-center justify-center mb-6 border border-white/60">
                      <CreditCard className="text-purple-400" size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-800 mb-3">Başvuru Bulunamadı</h4>
                    <p className="text-gray-500 max-w-md font-medium">Sistemde henüz basım bekleyen veya onaylanmış bir mezun kartı başvurusu bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Tablo Gelecek */}
                  </div>
                )}
              </div>
          {activeTab === 'org_chart' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <Users className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" size={32} /> Organizasyon Şeması
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Kariyer merkezi ekibini, yönetici ve danışmanları düzenleyin.</p>
                  </div>
                      <Users className="text-blue-600" size={28} /> Organizasyon Şeması
                    </h3>
                    <p className="text-gray-600 mt-2 font-medium">Kariyer merkezi ekibini, yönetici ve danışmanları düzenleyin.</p>
                  </div>
                  <div>
                    <button onClick={() => alert('Personel ekleme formu yapım aşamasında')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm w-full md:w-auto justify-center">
                      <Plus size={18} /> Personel Ekle
                    </button>
                  </div>
                </div>
                {orgChartMembers.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white/80 rounded-full shadow-inner flex items-center justify-center mb-6 border border-white/60">
                      <Users className="text-blue-400" size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-800 mb-3">Şema Boş</h4>
                    <p className="text-gray-500 max-w-md font-medium">Organizasyon şemasına henüz personel eklenmemiş. "Personel Ekle" butonunu kullanarak ekibinizi kurabilirsiniz.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Tablo Gelecek */}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ayarlar İskeleti */}
          {['settings'].includes(activeTab) && (
            <div className="max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center mb-6 shadow-sm border border-white/60">
                <Settings size={48} className="text-gray-400 animate-spin-slow" />
              </div>
          {activeTab === 'counseling' && (
            <div className="max-w-4xl mx-auto animate-fade-in p-12 text-center bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 mt-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-6 text-iesu-red shadow-lg shadow-red-500/20">
                  <MessageSquareQuote size={40} />
                </div>
                <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">Danışmanlık Talepleri (Yakında)</h2>
                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed font-medium">
                  Öğrencilerin ve mezunların kariyer danışmanlık randevuları ve talepleri bu alanda listelenecektir. Takvim entegrasyonu ve onay süreçleri aktif edildiğinde bu panel kullanıma açılacaktır.
                </p>
              </div>
            </div>
          )}
                <MessageSquareQuote size={40} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Danışmanlık Talepleri (Yakında)</h2>
              <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                Öğrencilerin ve mezunların kariyer danışmanlık randevuları ve talepleri bu alanda listelenecektir. Takvim entegrasyonu ve onay süreçleri aktif edildiğinde bu panel kullanıma açılacaktır.
              </p>
            </div>
          {activeTab === 'messages' && (
            <div className="max-w-4xl mx-auto animate-fade-in p-12 text-center bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 mt-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 shadow-lg shadow-blue-500/20">
                  <Heart size={40} />
                </div>
                <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">Gelen Mesajlar (Yakında)</h2>
                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed font-medium">
                  Öğrencilerden, firmalardan veya diğer paydaşlardan gelen doğrudan mesajlar burada toplanacaktır. İletişim altyapısı kurulduğunda mesaj paneli devreye alınacaktır.
                </p>
              </div>
            </div>
          )}
            </div>
          )}

        </main>
              <p className="text-gray-500 max-w-md mx-auto">Öğrencilerin ve mezunların kariyer danışmanlık randevuları ve talepleri bu alanda listelenecektir.</p>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="max-w-4xl mx-auto animate-fade-in p-8 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                <Heart size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gelen Mesajlar (Yakında)</h2>
              <p className="text-gray-500 max-w-md mx-auto">Öğrencilerden, firmalardan veya diğer paydaşlardan gelen doğrudan mesajlar burada toplanacaktır.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
                          <td className="p-5 font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-iesu-red text-white flex items-center justify-center font-bold text-xs">{alum.name.charAt(0)}</div>
                            {alum.name}
                          </td>
                          <td className="p-5 text-gray-600">{alum.department} <span className="font-bold text-gray-400">({alum.gradYear})</span></td>
                          <td className="p-5 text-blue-600 font-bold">{alum.company}</td>
                          <td className="p-5 text-gray-700">{alum.title}</td>
                          <td className="p-5 text-gray-500 text-xs">{alum.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
                        <td className="p-5 text-gray-700">Kıdemli Frontend Geliştirici</td>
          {activeTab === 'company' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Firma Veritabanı & Onaylar</h3>
                    <p className="text-gray-500 mt-1">Sisteme kayıtlı veya onay bekleyen şirketler ({companies?.length || 0} kayıt).</p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <input type="text" placeholder="Şirket Ara..." className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-iesu-coral outline-none text-sm w-full md:w-64" />
          {/* Counseling & Messages moved out of StatCard */}
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Settings size={48} className="text-gray-400 animate-spin-slow" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Modül Yapım Aşamasında</h2>
              <p className="text-gray-500 max-w-lg mb-8">
                Bu özellik Kariyer Merkezi altyapısına başarıyla eklendi. Sitenin diğer bölümleriyle entegrasyon sağlandıkça 
                bu panelin detayları (Tablolar, formlar, eşleştirme sistemleri) adım adım devreye alınacaktır.
              </p>
              <button onClick={() => setActiveTab('overview')} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-sm">
                Ana Özete Dön
              </button>
            </div>
          )}

        </main>
                            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-400">
                              <Building2 size={18} />
                            </div>
function SidebarButton({ active, onClick, icon, label, pendingCount, badge }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-bold group border mb-1.5 ${
        active 
          ? 'bg-white/20 text-white border-white/30 backdrop-blur-md shadow-lg shadow-black/10' 
          : 'bg-transparent text-red-100/70 hover:text-white hover:bg-white/10 border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? 'text-white' : 'text-red-200/50 group-hover:text-white transition-colors'}`}>{icon}</span>
        <span className="text-[13px]">{label}</span>
      </div>
      {pendingCount > 0 && (
        <span className="bg-white text-iesu-red text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
          {pendingCount}
        </span>
      )}
      {badge > 0 && (
        <span className="bg-black/20 text-white/90 text-[10px] font-black px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
          {badge}
        </span>
      )}
    </button>
  );
          {badge}
        </span>
      )}
    </button>
  );
                                  <button className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition tooltip" title="Reddet">
                                    <X size={18} />
                                  </button>
                                </>
                              ) : (
                                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-xs font-bold whitespace-nowrap">
                                  Profili İncele
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-5 py-3 rounded-xl font-bold text-sm transition border border-green-200">
                        <CheckCircle size={18} /> Onayla
                      </button>
                      <button className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-5 py-3 rounded-xl font-bold text-sm transition border border-red-200">
                        <XCircle size={18} /> Reddet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Helper Components
function SidebarButton({ active, onClick, icon, label, pendingCount, badge }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 font-bold group border ${
        active 
          ? 'bg-iesu-red text-white border-iesu-red shadow-md' 
          : 'bg-transparent text-gray-600 hover:text-iesu-red hover:bg-red-50 border-transparent hover:border-red-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-iesu-red'}`}>{icon}</span>
        {label}
      </div>
      {pendingCount > 0 && (
        <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
          {pendingCount}
        </span>
      )}
      {badge > 0 && (
        <span className="bg-gray-200 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ title, value, color, icon, bg }) {
  return (
    <div className={`bg-white p-6 rounded-3xl border border-gray-100 ${color} border-b-4 shadow-sm relative overflow-hidden group`}>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{title}</p>
          <h3 className={`text-4xl font-black mt-2 text-gray-900`}>{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl ${bg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}