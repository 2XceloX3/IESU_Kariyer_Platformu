import useAppStore from '../store/useAppStore';
import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageCircle, Briefcase, Bookmark, Heart, Send, Plus, Users, Compass, UserCircle2, MoreHorizontal, X, CreditCard, CheckCircle, Clock, ShieldCheck, Crown, CheckCircle2, LayoutDashboard, Star, UserCheck, ArrowRight, FileText, Calendar, Wand2, Home, ClipboardList, Target, ChevronDown, MapPin, ChevronRight, GraduationCap, Award } from 'lucide-react';
import JobsAndInternships from './JobsAndInternships';
import BranchNewsWidget from './BranchNewsWidget';
import ConnectionSuggestions from './ConnectionSuggestions';
import MessagingInterface from './MessagingInterface';
import PostComposer from './PostComposer';
import CareerShorts from './CareerShorts';
import { combineFeedItems } from '../utils/feedCombiner';
import PostCard from './PostCard';
import CareerNetwork from './CareerNetwork';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import CalendarPlanning from './CalendarPlanning';

import AICVBuilder from './AICVBuilder';
import ApplicationsPanel from './ApplicationsPanel';
import NavIcon from './shared/NavIcon';
import AlumniSurveys from './AlumniSurveys';
import ClubsDirectory from './ClubsDirectory';
import ExploreFeed from './ExploreFeed';
import FooterModals from './FooterModals';

import JobCreator from './JobCreator';
import { exportPDF } from '../lib/pdfExporter';
import SafeAvatar from './shared/SafeAvatar';

export default function CompanyFeed({ setView, setSelectedUserId, currentUser, userRole, academicRole, setSelectedGroupId }) {
  const [footerModal, setFooterModal] = useState(null);
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  const stories = useAppStore(state => state.stories);
  const setStories = useAppStore(state => state.setStories);
  const notifications = useAppStore(state => state.notifications);
  const setNotifications = useAppStore(state => state.setNotifications);
  const surveys = useAppStore(state => state.surveys);
  const news = useAppStore(state => state.news);
  const events = useAppStore(state => state.events);
  const generalEvents = useAppStore(state => state.generalEvents);
  const careerOpportunities = useAppStore(state => state.careerOpportunities);
  const students = useAppStore(state => state.students);
  const alumni = useAppStore(state => state.alumni);
  const companies = useAppStore(state => state.companies);
  const featuredOpportunities = useAppStore(state => state.featuredOpportunities);
  const mentorships = useAppStore(state => state.mentorships);
  const setMentorships = useAppStore(state => state.setMentorships);
  const voluntaryInternships = useAppStore(state => state.voluntaryInternships);
  const applications = useAppStore(state => state.applications);
  const setApplications = useAppStore(state => state.setApplications);
  const jobs = useAppStore(state => state.jobs);
  const adminMessages = useAppStore(state => state.adminMessages);
  const setAdminMessages = useAppStore(state => state.setAdminMessages);
  const academicStaff = useAppStore(state => state.academicStaff);
  const announcements = useAppStore(state => state.announcements);
  const groups = useAppStore(state => state.groups);
  const setGroups = useAppStore(state => state.setGroups);
  const featureClubsShowcase = useAppStore(state => state.featureClubsShowcase);
  const featureClubApplications = useAppStore(state => state.featureClubApplications);
  const clubs = useAppStore(state => state.clubs);
  const setClubs = useAppStore(state => state.setClubs);
  const clubApplications = useAppStore(state => state.clubApplications);
  const setClubApplications = useAppStore(state => state.setClubApplications);
  const messages = useAppStore(state => state.messages);
  const setMessages = useAppStore(state => state.setMessages);
  const featureSurveys = useAppStore(state => state.featureSurveys);
  const featureAlumniCard = useAppStore(state => state.featureAlumniCard);
  const alumniCardApplications = useAppStore(state => state.alumniCardApplications);
  const setAlumniCardApplications = useAppStore(state => state.setAlumniCardApplications);
  const alumniCardForms = useAppStore(state => state.alumniCardForms);
  
  const featureCareerFair = useAppStore(state => state.featureCareerFair);
  const careerFairEvent = useAppStore(state => state.careerFairEvent);
  const careerFairFormTemplate = useAppStore(state => state.careerFairFormTemplate);
  const careerFairApplications = useAppStore(state => state.careerFairApplications);
  const setCareerFairApplications = useAppStore(state => state.setCareerFairApplications);

  const [showFairModal, setShowFairModal] = useState(false);
  const [fairForm, setFairForm] = useState({});
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [showAdminMsgModal, setShowAdminMsgModal] = useState(false);
  const [showCompanyAppsModal, setShowCompanyAppsModal] = useState(false);
  const [adminMsgForm, setAdminMsgForm] = useState({ subject: '', email: '', phone: '', message: '' });
  const [atsStatusFilter, setAtsStatusFilter] = useState('Tümü');
  const [selectedCandidateCvModal, setSelectedCandidateCvModal] = useState(null);

  const [companyCandidateApps, setCompanyCandidateApps] = useState([
    {
      id: 'APP-CELIL-001',
      applicantName: 'Celil Başaran',
      applicantDept: 'Uluslararası Ticaret ve Finansman & Havacılık Yönetimi (ÇAP)',
      jobTitle: 'Saha Operasyonu & Proje Yönetimi Uzmanı',
      status: 'İletişime Geçildi',
      applicantPhone: '0543-187-59-90',
      applicantEmail: 'Celil.basaran23@gmail.com',
      linkedin: 'Linkedin : Celilbasaran',
      cvType: 'KGM Akredite İESÜ Dijital CV',
      coverLetter: 'Uluslararası Ticaret ve Finansman bölümünden mezun oldum. İstanbul Esenyurt Üniversitesi Havacılık Yönetimi çift ana dal programında son sınıf öğrencisiyim. Zorunlu derslerimi tamamladığım için tam zamanlı çalışmaya uygunum. Yaklaşık 9,5 yıllık iş tecrübem boyunca saha operasyonları, ekip koordinasyonu ve kriz yönetimi alanlarında deneyim kazandım.',
      experiences: [
        { role: 'Stajyer', company: 'İstanbul Büyükşehir Belediyesi', date: '01.02.2013 – 01.02.2017' },
        { role: 'Aşçı Yardımcısı', company: 'İSPER A.Ş.', date: '01.02.2017-22.09.2022' },
        { role: 'Stajyer', company: 'Ziraat Bankası', date: '19.08.2024-16.09.2024' },
        { role: 'Kütüphane Görevlisi', company: 'T.C. Gençlik ve Spor Bakanlığı', date: '01.02.2026-01.06.2026' }
      ],
      projects: [
        { title: 'Fakülte Öğrenci Temsilciliği ve Üniversite Öğrenci Temsilciliği', date: '2023 - 2026' },
        { title: 'Gençlik ve Spor Bakanlığı Üniversite Öğrenci Temsilciliği', date: '2024 - 2026' },
        { title: 'Kalite Koordinatörlüğü Fakülte Öğrenci Temsilciliği', date: '2025 - 2026' },
        { title: 'Kalite Koordinatörlüğü Üniversite Öğrenci Temsilciliği', date: '2025 - 2026' },
        { title: 'Genç Yeşilay Kulüp Başkanlığı', date: '2025 - 2026' },
        { title: 'Güneydoğu Anadolu İhracatçı Birlikleri Eğitimi', date: '09.07.2024', desc: 'Turquality® Dünyanın İlk ve Tek Devlet Destekli Markalaşma Programı / Excel\'de Kısa Yollar ve Pratik Uygulamalar' },
        { title: 'TÜBİTAK 2209-A Araştırma Projesi Üniversite Öğrencileri Araştırma Projesi', date: '2024 -2024', subTitle: '"Dijital Dalgada Savrulanlar: Z Kuşağının İmtihanı"', desc: 'Proje ekibinde görev aldım. Araştırma ve raporlama süreçlerine katkı sağladım.' },
        { title: 'STAR Akreditasyon', date: '2026', desc: 'İşletme ve Yönetimi Bilimleri Fakültesi Öğrenci Temsilcisi olarak görev aldım' },
        { title: 'Medek Akreditasyon', desc: 'Kariyer Geliştirme Merkezi Fakülte Öğrenci Temsilcisi olarak görev aldım' },
        { title: 'MayFest 26 Bahar Festivali', date: '2026', desc: 'Mayfest 26 Üniversite Öğrenci Temsilcisi olarak öğrenci organizasyon katılımı ve yönetimi süreçlerinde görev aldım' }
      ],
      skillsTech: ['MS Office', 'Excel', 'Yapay zekâ araçları (ChatGPT, Claude, Gemini, Codex)', 'Google Workspace'],
      skillsPersonal: ['Analitik düşünme', 'Problem çözme', 'Takım çalışması', 'Organizasyon', 'Zaman yönetimi', 'Kriz yönetimi'],
      interests: ['Gitar', 'Yapay zekâ teknolojileri', 'Dijital teknolojiler', 'Havacılık', 'Uluslararası ticaret ve lojistik', 'Kişisel gelişim', 'Dövüş Sporları'],
      trainings: ['AFAD Temel Afet Farkındalık Eğitimi', 'AFAD Gönüllülük Eğitimi', 'Temel İlk Yardım Eğitimi', 'Kariyer ve Liderlik Seminerleri'],
      language: 'İngilizce — Temel Seviye (A2)'
    },
    {
      id: 'APP-DEMO-002',
      applicantName: 'Zeynep Kaya',
      applicantDept: 'Bilgisayar Mühendisliği & Yazılım Müh. (ÇAP)',
      jobTitle: 'Veri Analisti Stajyeri',
      status: 'Kabul Edildi',
      applicantPhone: '0543 892 10 33',
      applicantEmail: 'zeynep.kaya@ogrenci.esenyurt.edu.tr',
      linkedin: 'Linkedin : zeynep-kaya-dev',
      cvType: 'KGM Akredite İESÜ Dijital CV',
      coverLetter: 'Python ve SQL ile veri analizi ve raporlama projeleri gerçekleştirdim. Makine öğrenimi algoritmaları ve veri görselleştirme araçları ile kurumsal staj hedefliyorum.',
      experiences: [
        { role: 'Veri Analitiği Stajyeri', company: 'ASELSAN Ar-Ge Merkezi', date: '01.06.2025 - 01.09.2025' },
        { role: 'Yazılım Destek Asistanı', company: 'İESÜ Bilgi İşlem Daire Başk.', date: '15.10.2024 - 15.05.2025' }
      ],
      projects: [
        { title: 'TÜBİTAK 2209-A "Büyük Veri İle Kampüs Enerji Verimliliği Modeli"', date: '2025', desc: 'Veri madenciliği metodolojisi ile kampüs enerji tüketim trend analizi yapıldı.' },
        { title: 'İESÜ Siber Güvenlik ve Veri Kulübü Başkan Yardımcılığı', date: '2024 - 2026', desc: 'Veri analitiği workshop serisi koordine edildi.' }
      ],
      skillsTech: ['Python', 'SQL & PostgreSQL', 'Power BI & Tableau', 'Pandas & NumPy', 'Git & GitHub'],
      skillsPersonal: ['Veri Odaklı Düşünme', 'Sistem Analizi', 'Sunum & Raporlama', 'Takım Çalışması'],
      interests: ['Büyük Veri Teknolojileri', 'Yapay Zekâ Analitiği', 'Satranç', 'Veri Görselleştirme'],
      trainings: ['İESÜ Veri Bilimi Akademisi Sertifikası', 'Google Data Analytics Sertifikası', 'AFAD Afet Gönüllüsü'],
      language: 'İngilizce — İleri Seviye (B2)'
    },
    {
      id: 'APP-DEMO-003',
      applicantName: 'Mert Yıldız',
      applicantDept: 'Endüstri Mühendisliği',
      jobTitle: 'Proje Yönetim Asistanı',
      status: 'İletişime Geçildi',
      applicantPhone: '0555 123 45 67',
      applicantEmail: 'mert.yildiz@ogrenci.esenyurt.edu.tr',
      linkedin: 'Linkedin : mertyildiz-ie',
      cvType: 'KGM Akredite İESÜ Dijital CV',
      coverLetter: 'Süreç optimizasyonu ve Agile metodolojileri üzerine çalışmalar yapıyorum. Üretim ve hizmet sektöründe verimlilik projelerine katkı sunmak istiyorum.',
      experiences: [
        { role: 'Üretim Planlama Stajyeri', company: 'Arçelik A.Ş.', date: '01.07.2025 - 31.08.2025' },
        { role: 'Kalite Güvence Görevlisi', company: 'İESÜ Kalite Koordinatörlüğü', date: '2024 - 2026' }
      ],
      projects: [
        { title: 'Yalın Üretim ve Kaizen Süreç İyileştirme Projesi', date: '2025', desc: 'Montaj hattında %14 verimlilik artışı sağlayan simülasyon çalışması yapıldı.' },
        { title: 'MÜDEK Akreditasyon Komitesi Öğrenci Üyesi', date: '2025 - 2026', desc: 'Bölüm müfredat ve çıktı değerlendirme süreçlerinde görev alındı.' }
      ],
      skillsTech: ['MS Project & Jira', 'SAP ERP Üretim Modülü', 'ARENA Simülasyon', 'Lean & Six Sigma'],
      skillsPersonal: ['Süreç Optimizasyonu', 'Liderlik', 'Zaman Yönetimi', 'Probleme Hızlı Müdahale'],
      interests: ['Tedarik Zinciri Yönetimi', 'Endüstri 4.0', 'Doğa Sporları', 'Yüzme'],
      trainings: ['Yalın Altı Sigma Yeşil Kuşak Eğitimi', 'KGM Proje Yönetimi Sertifikası'],
      language: 'İngilizce — Orta-İleri Seviye (B2)'
    }
  ]);

  const filteredCandidateApps = React.useMemo(() => {
    if (atsStatusFilter === 'Tümü') return companyCandidateApps;
    return companyCandidateApps.filter(a => a.status === atsStatusFilter);
  }, [companyCandidateApps, atsStatusFilter]);

  const updateCandidateStatus = (appId, newStatus) => {
    setCompanyCandidateApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    if (setApplications) {
      setApplications(prev => (prev || []).map(a => a.id === appId ? { ...a, status: newStatus } : a));
    }
    const targetCandidate = companyCandidateApps.find(a => a.id === appId);
    window.toast?.success?.(`Aday (${targetCandidate?.applicantName || 'Öğrenci'}) durumu "${newStatus}" olarak güncellendi.`);
  };

  const hasApplied = React.useMemo(() => {
    return careerFairApplications?.some(app => app.companyId === currentUser?.id);
  }, [careerFairApplications, currentUser]);

  const handleFairSubmit = (e) => {
    e.preventDefault();
    const newApp = {
      id: 'CFA-' + Math.random().toString(36).substr(2, 9),
      companyId: currentUser?.id || 'CMP-Unknown',
      companyName: currentUser?.name || 'Firma Adı',
      status: 'Beklemede',
      appliedAt: new Date().toISOString(),
      answers: fairForm
    };
    setCareerFairApplications([newApp, ...(careerFairApplications || [])]);
    setShowFairModal(false);
    window.toast?.success?.('Başvurunuz başarıyla alındı! İlgili birim dönüş yapacaktır.');
  };

  const [activeTab, setActiveTab] = useState('feed'); 
  const [feedFilter, setFeedFilter] = useState('for_you'); // for_you, following // feed, jobs, network
  const [showShorts, setShowShorts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMentorshipModal, setShowMentorshipModal] = useState(false);
  const [mentorshipForm, setMentorshipForm] = useState({ title: '', hours: '', mode: 'Online', motivation: '' });
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({ tc: '', phone: '' });

  const existingApp = (alumniCardApplications || []).find(a => a.tc === currentUser?.tc || a.email === currentUser?.email || a.name === currentUser?.name);
  const isFormActive = (alumniCardForms || []).length > 0 ? alumniCardForms[0]?.isActive : true;

  const handleCardSubmit = (e) => {
    e.preventDefault();
    const newApp = {
      id: `KART-${Date.now()}`,
      name: currentUser?.name || 'Mezun',
      tc: cardForm.tc,
      department: currentUser?.department || 'Mezun',
      gradYear: currentUser?.graduationYear || '2023',
      email: currentUser?.email || 'mezun@esenyurt.edu.tr',
      phone: cardForm.phone,
      date: new Date().toLocaleDateString('tr-TR'),
      status: 'Bekliyor'
    };
    if (setAlumniCardApplications) {
      setAlumniCardApplications([newApp, ...(alumniCardApplications || [])]);
    }
    setShowCardModal(false);
  };

  // Removed mock stories and defaultPosts
  
  const getManagedClubs = () => {
    if (userRole === 'admin' || currentUser?.role === 'admin') return clubs || [];
    if (!currentUser?.name) return [];
    return (clubs || []).filter(c => c.president?.name === currentUser?.name);
  };
  const isClubAdmin = getManagedClubs().length > 0;

  if (isCreatingJob) {
    return (
      <JobCreator 
        setView={(view) => {
          if (view === 'company') setIsCreatingJob(false);
          else if (setView) setView(view);
          else setIsCreatingJob(false);
        }} 
        currentUser={currentUser} 
        addNotification={(notif) => {
          if (setNotifications) setNotifications(prev => [notif, ...(prev || [])]);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-transparent font-sans">
      {/* Hyper-Modern Navbar (Glassmorphism) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between relative">
          {/* LEFT: Logo & University Title */}
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} className="flex items-center gap-3 cursor-pointer" onClick={() => {
            const currentRole = currentUser?.role || userRole;
            setView?.(currentRole === 'admin' ? 'admin' : (currentRole === 'employer' || currentRole === 'company') ? 'company' : currentRole === 'alumni' ? 'alumni' : currentRole === 'academic' ? 'academic' : 'student');
          }}>
            <Logo color="blue" className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-blue-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kurumsal İnsan Kaynakları Portalı</p>
            </div>
          </div>

          {/* CENTER: Portal Badge (Firma & İşveren - Gece Safiri Kurumsal Tema #0A2342) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center pointer-events-none z-20">
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-950 shadow-md shadow-blue-950/40 border border-blue-400/40 flex items-center gap-2 whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse shrink-0"></span>
              🏢 FİRMA & İŞVEREN PORTALI
            </span>
          </div>

          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-red-50 text-[#990000]`} title="Bildirimler">
              <div className="relative">
                <Bell size={24} strokeWidth={2.5} className="fill-current text-[#990000]/10" />
                {((notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>
            <TopProfileMenu currentUser={currentUser || { name: 'Kurumsal Firma', avatar: 'https://ui-avatars.com/api/?name=Firma&background=990000&color=fff' }} userRole={userRole || 'company'} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} currentView="company" />
          </div>
        </div>
      </nav>

      {/* Main Container - Padded for Navbar */}
      <div className="pt-24 max-w-6xl mx-auto px-4 flex justify-center gap-6 pb-20">
        
        {/* LEFT PANEL: Corporate Profile & Quick ATS Actions */}
        <div className="hidden lg:block w-[300px] shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg sticky top-24 space-y-4 p-5">
            {userRole === 'admin' ? (
              <div className="text-center">
                <div className="relative inline-block mb-2">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm mx-auto p-2">
                    <img src="/iesu-logo.svg" alt="Admin" className="w-full h-full object-contain" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-1.5 rounded-xl shadow-md border-2 border-white">
                    <Crown size={14} />
                  </div>
                </div>
                <h2 className="text-[16px] font-black text-gray-900 mt-3 leading-tight">Kariyer Geliştirme Merkezi</h2>
                <p className="text-[12px] font-bold text-orange-600 mt-1 uppercase tracking-wider">SÜPER YÖNETİCİ</p>
                
                <div className="mt-4 flex flex-col gap-2 text-left bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Firma İlan & Aday Yetkileri</p>
                  <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Kurumsal İlan Yayınlama
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Yetenek Arama & CV İnceleme
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Doğrudan Aday Mülakatı
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 w-full">
                  <button 
                    onClick={() => setView('company_ats')} 
                    className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#152843] text-white text-[13px] font-bold py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Briefcase size={15} /> Aday Takip Panosu (ATS)
                  </button>
                  <button 
                    onClick={() => setView('create_job')} 
                    className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[13px] font-bold py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Plus size={15} /> Yeni İlan Yayınla
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center relative z-10 pt-2">
                  <div className="mx-auto flex justify-center">
                    <SafeAvatar 
                      src={currentUser?.avatar || currentUser?.logo} 
                      name={currentUser?.name || 'Kurumsal Firma'} 
                      size="2xl" 
                      rounded="rounded-2xl" 
                      className="border-2 border-red-100 bg-white mx-auto shadow-md p-1" 
                      alt="Company" 
                    />
                  </div>
                  <h2 className="text-[17px] font-black text-gray-900 leading-tight mt-3 mb-1">{currentUser?.name || 'Kurumsal Firma'}</h2>
                  <p className="text-[12px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full inline-block mb-3 border border-purple-100">
                    {currentUser?.sector || 'Sektör Lideri / Resmî Anlaşmalı Firma'}
                  </p>
                  
                  <div className="mt-2 text-center p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                    <p className="text-[11px] font-bold text-purple-900">Kariyer Geliştirme Merkezi</p>
                    <p className="text-[10px] text-purple-600 font-medium mt-0.5">Resmî Kurumsal İletişim Portalı</p>
                  </div>

                  <div className="mt-3 flex flex-col gap-2 w-full">
                    <button 
                      onClick={() => setView('company_ats')}
                      className="w-full py-2.5 bg-[#1e3a5f] hover:bg-[#152843] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Briefcase size={15} /> ATS Aday Takip Panosu
                    </button>
                    <button 
                      onClick={() => setView('create_job')}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus size={15} /> Yeni İlan Yayınla
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CENTER PANEL: Stories & Feed */}
        <div className="w-full max-w-[600px] shrink-0 space-y-6">
          
        {/* Create Post Native View */}
        {activeTab === 'create_post' && (
          <div className="bg-white rounded-xl w-full p-4 sm:p-6 shadow-[var(--shadow-soft)] border border-[var(--border-soft)] animate-fade-in mb-6">
             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Star className="text-orange-500 fill-current" size={24} /> Gönderi Paylaş & Düzenle
             </h2>
             <PostComposer currentUser={currentUser} userRole={userRole} posts={posts} setPosts={setPosts} />
          </div>
        )}

        {/* Explore Native View */}
        {activeTab === 'search' && (
          <ExploreFeed posts={posts} />
        )}

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="w-full shrink-0 flex flex-col gap-6 animate-fade-in">
          {/* Kurumsal Hızlı Erişim & Yönetim Araçları */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-100 shadow-xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1e3a5f] inline-block animate-pulse"></span>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Kurumsal İşe Alım & Yönetim</h3>
              </div>
              <span className="text-xs font-medium text-blue-600 font-semibold">İESÜ İşveren Ağı</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setView('company_ats')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-blue-50/40 to-white hover:border-blue-200 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#1e3a5f] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Briefcase size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#1e3a5f] transition-colors leading-tight">ATS Panosu</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Aday & başvuru yönetimi</span>
              </button>

              <button
                onClick={() => setView('create_job')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-emerald-50/40 to-white hover:border-emerald-200 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Plus size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-700 transition-colors leading-tight">Yeni İlan Yayınla</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Staj & iş ilanı oluştur</span>
              </button>

              <button
                onClick={() => setView('jobs')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-slate-50/60 to-white hover:border-slate-300 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <ClipboardList size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-slate-900 transition-colors leading-tight">İlanlarım</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Yayınlanan fırsatlar</span>
              </button>

              <button
                onClick={() => setView('network')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-purple-50/40 to-white hover:border-purple-200 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100/70 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Users size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-purple-700 transition-colors leading-tight">Yetenek Havuzu</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Öğrenci & mezun ağı</span>
              </button>
            </div>
          </div>
          
          {/* FEED TABS (Sadece Senin İçin) */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-4 px-2">
            <div className="pb-3 font-black text-[15px] text-gray-900 relative">
              Senin İçin
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#990000] rounded-t-full"></div>
            </div>
          </div>

          {/* FEED POSTS */}
          <div className="space-y-6">
            {(() => {
              const allItems = combineFeedItems(posts, events, news, announcements, jobs, generalEvents, careerOpportunities);
              // Firma akışında sadece yönetici / Kariyer Geliştirme Merkezi resmi içerikleri gösterilir
              const adminOnlyItems = allItems.filter(item => {
                const authorName = typeof item.author === 'string' ? item.author : item.author?.name || item.authorName;
                const authorRole = item.author?.role;
                const isOfficial = item.isOfficial || item.type === 'announcement' || item.type === 'news' || item.type === 'event';
                const isAdmin = authorRole === 'admin' || authorName === 'Kariyer Geliştirme Merkezi' || authorName === 'Kariyer Geliştirme Koordinatörlüğü';
                return isOfficial || isAdmin;
              });

              const filtered = adminOnlyItems.filter(post => 
                (post.content || post.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                (post.author?.name || post.authorName || '').toLowerCase().includes(searchQuery.toLowerCase())
              );
              
              if (filtered.length === 0) {
                return (
                  <div className="p-10 text-center bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-red-50 text-[#990000] rounded-2xl flex items-center justify-center mb-6 shadow-sm"><FileText size={32} /></div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Henüz görüntülenecek yayın bulunmuyor.</h3>
                    <p className="text-sm text-gray-500 font-medium max-w-sm leading-relaxed">Duyuru, etkinlik, staj ve mentorluk içerikleri yayınlandığında burada görünecek.</p>
                  </div>
                );
              }
              
              return filtered.map(post => (
                <PostCard key={post.id} post={post} currentUser={currentUser}  students={students || []} alumni={alumni || []} setPosts={setPosts} />
              ));
            })()}
          </div>
          </div>
        )}

        {/* SURVEYS TAB */}
        {featureSurveys && activeTab === 'surveys' && (
          <div className="w-full shrink-0 animate-fade-in mb-6">
            <AlumniSurveys surveys={surveys} currentUser={currentUser} />
          </div>
        )}

        </div>

        {/* RIGHT PANEL: Kurumsal İletişim, Şube Gündemi & Aday Takip Havuzu */}
        <div className="hidden lg:block w-[320px] shrink-0 space-y-5">
          {/* 1. FİRMA/KURUMSAL DAL ÖZEL İK & YETENEK BÜLTENİ */}
          <BranchNewsWidget branch="company" currentUser={currentUser} setView={setView} />

          {/* 2. FİRMA/KURUMSAL DAL ÖZEL YETENEK & STAJYER AĞI */}
          <ConnectionSuggestions 
            branch="company"
            currentUser={currentUser}
            students={students || []}
            alumni={alumni || []}
            companies={companies || []}
            academicStaff={academicStaff || []}
            setView={setView}
            setSelectedUserId={setSelectedUserId}
            maxSuggestions={3}
          />
          
          {/* ─── ULTRA-MODERN CORPORATE NAVY ADAY TAKİP HAVUZU KARTI (#0A2342) ─── */}
          <div id="candidate-pool-panel" className="bg-gradient-to-br from-slate-950 via-[#0A2342] to-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-blue-800/60 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-600/30 shrink-0 mt-0.5">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="font-black text-white text-base tracking-tight leading-tight">Aday Takip & Staj Havuzu</h3>
                <p className="text-[11px] text-blue-200/80 font-medium leading-snug mt-0.5">
                  Başvuran adayların verilerini ve aşamalarını bu panelden yönetebilirsiniz.
                </p>
              </div>
            </div>

            {/* Metrik İstatistik Izgarası */}
            <div className="grid grid-cols-3 gap-2 bg-black/30 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl relative z-10">
              <div className="text-center border-r border-white/10 pr-1">
                <p className="text-[9px] text-slate-300 font-black uppercase tracking-wider">Başvuru</p>
                <p className="font-black text-white text-base mt-0.5">
                  {(applications || []).length > 0 ? (applications || []).length : 5}
                </p>
              </div>
              <div className="text-center border-r border-white/10 px-1">
                <p className="text-[9px] text-sky-300 font-black uppercase tracking-wider">İletişim</p>
                <p className="font-black text-sky-300 text-base mt-0.5">
                  {(applications || []).filter(a => a.companyContacted || a.status === 'İletişime Geçildi' || a.status === 'Kabul Edildi').length}
                </p>
              </div>
              <div className="text-center pl-1">
                <p className="text-[9px] text-emerald-300 font-black uppercase tracking-wider">Kabul</p>
                <p className="font-black text-emerald-400 text-base mt-0.5">
                  {(applications || []).filter(a => a.status === 'Kabul Edildi').length}
                </p>
              </div>
            </div>

            {/* SAĞ PANEL İÇİ ANLIK ADAY LİSTESİ AKIŞI */}
            <div className="space-y-2 pt-1 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-200 uppercase tracking-wider">Son Başvuran Adaylar</span>
                <span className="text-[9px] text-slate-400 font-bold">Anlık Canlı</span>
              </div>

              {/* SAĞ PANEL İÇİ ANLIK ADAY LİSTESİ AKIŞI (TEMİZ TEMPORARY BOX LAYOUT) */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                {companyCandidateApps.slice(0, 4).map((app) => (
                  <div key={app.id} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all space-y-2 shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {(app.applicantName || 'Aday').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-white leading-tight truncate">{app.applicantName}</p>
                          <p className="text-[10px] text-blue-300 font-medium truncate mt-0.5">{app.applicantDept}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 whitespace-nowrap ${
                        app.status === 'Kabul Edildi' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        app.status === 'Mülakata Çağrıldı' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        app.status === 'İletişime Geçildi' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                        app.status === 'Reddedildi' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                        'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1.5 border-t border-white/10 gap-2">
                      <span className="truncate flex-1 font-medium text-[10px] text-slate-300">{app.jobTitle}</span>
                      {app.status === 'İletişime Geçildi' || app.status === 'Kabul Edildi' ? (
                        <button 
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('iesu_open_chat', {
                              detail: {
                                candidateId: app.id,
                                candidateName: app.applicantName,
                                candidateAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.applicantName || 'A')}&background=0A2342&color=fff`,
                                candidateDept: app.applicantDept,
                                candidateRole: app.jobTitle,
                                initialMessage: `Merhaba ${app.applicantName}, "${app.jobTitle}" başvurunuzla ilgili görüşmemizi bu panelden sürdürebiliriz.`
                              }
                            }));
                          }}
                          className="text-emerald-400 font-bold text-[10px] shrink-0 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <MessageCircle size={12} /> Mesajı Aç
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            updateCandidateStatus(app.id, 'İletişime Geçildi');
                            window.dispatchEvent(new CustomEvent('iesu_open_chat', {
                              detail: {
                                candidateId: app.id,
                                candidateName: app.applicantName,
                                candidateAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.applicantName || 'A')}&background=0A2342&color=fff`,
                                candidateDept: app.applicantDept,
                                candidateRole: app.jobTitle,
                                initialMessage: `Merhaba ${app.applicantName}, "${app.jobTitle}" başvurunuzu inceledik. Süreç hakkında görüşmek isteriz.`
                              }
                            }));
                          }} 
                          className="text-emerald-300 hover:text-emerald-200 font-bold hover:underline cursor-pointer shrink-0 text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/30 transition flex items-center gap-1"
                        >
                          <MessageCircle size={11} /> İletişime Geç
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS Detay Yönet Butonu */}
            <div className="pt-1 mt-1 space-y-2">
              <button 
                onClick={() => setView('company_ats')}
                className="w-full py-3 bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 cursor-pointer border border-red-400/40 hover:scale-[1.02] relative z-10"
              >
                <Briefcase size={16} /> ATS Aday Takip Panosu (Kanban)
              </button>
              <button 
                onClick={() => setShowCompanyAppsModal(true)}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-950/40 flex items-center justify-center gap-2 cursor-pointer border border-blue-400/40 hover:scale-[1.02] relative z-10"
              >
                <Users size={16} /> Hızlı Aday Tablosu
              </button>
            </div>
          </div>

          {/* YÖNETİCİ İLE MUHATAP OLMA BİLGİLENDİRME KARTI */}
          <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck size={18} className="text-purple-700" /> Kurumsal İş Birliği Süreci
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100">
                Resmî
              </span>
            </div>
            
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Firmamız tarafından oluşturulan tüm ilan ve staj talepleri <strong>Kariyer Geliştirme Merkezi</strong> yönetici onayına sunulur.
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3 bg-purple-50/50 border border-purple-100/60 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">1</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Formu Doldurun</p>
                  <p className="text-[11px] text-slate-500 font-medium">Pozisyon ve staj detaylarını form ile iletin.</p>
                </div>
              </div>
              <div className="p-3 bg-amber-50/50 border border-amber-100/60 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">2</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Yönetici Onayı</p>
                  <p className="text-[11px] text-slate-500 font-medium">Talebiniz Kariyer Merkezi tarafından incelenir.</p>
                </div>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-100/60 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">3</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Yayına Alınma</p>
                  <p className="text-[11px] text-slate-500 font-medium">Onaylanan ilanlar öğrenci ve mezunlara sunulur.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsCreatingJob(true)}
              className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-purple-900/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Yeni İlan Talebi Gönder
            </button>
          </div>

          {/* KURUMSAL DESTEK & İLETİŞİM KARTI */}
          <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 rounded-2xl p-5 shadow-xl text-white space-y-3 relative overflow-hidden border border-purple-800">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest flex items-center gap-1">
              <Crown size={12} className="text-amber-300" /> Kariyer Geliştirme Merkezi
            </p>
            <h3 className="font-black text-base text-white leading-tight">Yönetici İletişim Hattı</h3>
            <p className="text-xs text-purple-200 font-medium leading-relaxed">Özel protokoller, kurumsal iş birlikleri ve staj kontenjanı süreçleri için Kariyer Merkezi uzmanlarımızla iletişime geçin.</p>
            <button 
              onClick={() => {
                setAdminMsgForm({
                  subject: '',
                  email: currentUser?.email || '',
                  phone: currentUser?.phone || '',
                  message: ''
                });
                setShowAdminMsgModal(true);
              }} 
              className="w-full py-2.5 bg-white text-purple-900 hover:bg-purple-50 rounded-xl text-xs font-black transition-all shadow-md uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle size={14} /> Yöneticiye Mesaj Gönder
            </button>
          </div>

          {/* PROFESSIONAL RIGHT SIDEBAR FOOTER */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-6 text-[11px] text-slate-400 font-medium px-4 text-center">
            <button onClick={() => setFooterModal('privacy')} className="hover:text-[#990000] transition-colors cursor-pointer">Kurumsal Sözleşme & KVKK</button>
            <button onClick={() => setFooterModal('help')} className="hover:text-[#990000] transition-colors cursor-pointer">Destek & İletişim</button>
            <button onClick={() => setFooterModal('about')} className="hover:text-[#990000] transition-colors cursor-pointer">Hakkımızda</button>
            <button onClick={() => setFooterModal('accessibility')} className="hover:text-[#990000] transition-colors cursor-pointer">Erişilebilirlik</button>
            <button onClick={() => setFooterModal('ads')} className="hover:text-[#990000] transition-colors cursor-pointer">Reklam Seçenekleri</button>
            <button onClick={() => setFooterModal('careers')} className="hover:text-[#990000] transition-colors cursor-pointer">Kariyer</button>
            <div className="w-full flex items-center justify-center gap-1 mt-2">
              <span className="font-black text-[#990000]">İESÜ Kurumsal Portalı</span>
              <span>© 2026</span>
            </div>
          </div>
        </div>

        {/* Applications Interface Overlay */}
        {activeTab === 'applications' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-5xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl animate-fade-in relative">
              <button 
                onClick={() => setActiveTab('feed')}
                className="absolute top-4 right-4 z-50 p-2 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full shadow-md transition border border-gray-100"
              >
                <X size={20} />
              </button>
              <div className="p-4">
                <ApplicationsPanel 
                  applications={applications} 
                  setApplications={setApplications} 
                  jobs={jobs} 
                  currentUser={currentUser || { id: 'cmp-1', name: 'Kurumsal Firma', role: 'employer' }} 
                  userRole={userRole || 'employer'} 
                  setView={setView}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messaging' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/40 flex items-end sm:items-center justify-center p-0 sm:p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl h-[95vh] sm:h-[85vh] sm:rounded-xl rounded-t-3xl overflow-hidden flex flex-col shadow-2xl animate-slide-up sm:animate-fade-in relative">
              {/* Modal Native Header */}
              <div className="h-12 w-full bg-white border-b border-gray-100 shrink-0 flex items-center justify-between px-4 z-50">
                <div className="w-10 h-1 bg-gray-200 rounded-full absolute left-1/2 -translate-x-1/2 top-2 sm:hidden"></div>
                <div className="font-bold text-gray-800 text-[15px] mx-auto sm:ml-2 mt-2 sm:mt-0">Mesajlar</div>
                <button onClick={() => setActiveTab('feed')} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition absolute right-3 top-2">
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
              <div className="w-full flex-1 overflow-hidden flex flex-col relative">
              <MessagingInterface 
                currentUser={currentUser || { id: 'alm-1', name: 'Mezun', avatar: 'https://ui-avatars.com/api/?name=Mezun&background=2563EB&color=fff' }} 
                userRole={userRole} 
                contacts={[...(students || []), ...(alumni || []), ...(companies || []), ...(academicStaff || [])]} 
                groups={groups}
                setGroups={setGroups}
                stories={stories}
                setStories={setStories}
                setView={setView}
                setSelectedUserId={setSelectedUserId}
                isOverlay={true}
                onClose={() => setActiveTab('feed')}
              />
              </div>
            </div>
          </div>
        )}

        {/* Calendar Overlay */}
        {activeTab === 'calendar' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in relative">
              <button 
                onClick={() => setActiveTab('feed')}
                className="absolute top-4 right-4 z-50 p-2 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full shadow-md transition border border-gray-100"
              >
                <X size={20} />
              </button>
              <CalendarPlanning events={events} jobs={jobs} userRole={userRole} />
            </div>
          </div>
        )}

        {/* CV Builder Overlay */}
        {activeTab === 'cvbuilder' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in relative">
              <button 
                onClick={() => setActiveTab('feed')}
                className="absolute top-4 right-4 z-50 p-2 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full shadow-md transition border border-gray-100"
              >
                <X size={20} />
              </button>
              <div className="h-full mt-12">
                <AICVBuilder currentUser={currentUser} />
              </div>
            </div>
          </div>
        )}

        {/* Mezun Kartı Modal */}
        {showCardModal && (
          <div className="fixed inset-0 z-[100] bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
              <div className="bg-gradient-to-r from-iesu-navy to-iesu-navy p-6 text-white relative">
                <button onClick={() => setShowCardModal(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"><X size={16}/></button>
                <CreditCard size={32} className="mb-3 opacity-90"/>
                <h2 className="text-xl font-black">Mezun Kartı Başvurusu</h2>
                <p className="text-red-100 text-sm mt-1">Kartınızı almak için bilgilerinizi doğrulayın.</p>
              </div>
              <form onSubmit={handleCardSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Ad Soyad</label>
                  <input type="text" disabled value={currentUser?.name || 'Mezun'} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Bölüm & Mezuniyet Yılı</label>
                  <input type="text" disabled value={`${currentUser?.department || 'Mezun'} - ${currentUser?.graduationYear || '2023'}`} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">E-posta Adresi</label>
                  <input type="email" disabled value={currentUser?.email || 'mezun@esenyurt.edu.tr'} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">TC Kimlik No (Zorunlu)</label>
                  <input type="text" required maxLength="11" pattern="\d{11}" value={cardForm.tc} onChange={e => setCardForm({...cardForm, tc: e.target.value.replace(/\D/g,'')})} placeholder="11 Haneli TC Kimlik No" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-300 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Telefon Numarası</label>
                  <input type="tel" required value={cardForm.phone} onChange={e => setCardForm({...cardForm, phone: e.target.value})} placeholder="05XX XXX XX XX" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-300 outline-none" />
                </div>
                
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-start pt-1">
                      <input type="checkbox" required className="w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500 cursor-pointer" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium leading-relaxed group-hover:text-gray-700 transition">
                      Kişisel verilerimin Mezun Kartı basımı ve işlemleri amacıyla işlenmesine dair <button type="button" className="text-red-600 font-bold hover:underline">KVKK Aydınlatma Metni'ni</button> okudum ve onaylıyorum.
                    </span>
                  </label>
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-100 flex gap-3">
                  <button type="button" onClick={() => setShowCardModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition">İptal</button>
                  <button type="submit" className="flex-[2] bg-[#990000] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition shadow-sm">Başvuruyu Tamamla</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mentorship Application Modal */}
        {showMentorshipModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <h3 className="font-black text-gray-900 text-lg">Mentorluk Başvurusu</h3>
                <button onClick={() => setShowMentorshipModal(false)} className="text-gray-500 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"><X size={20} /></button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const newMentorship = {
                  id: Date.now(),
                  mentorName: currentUser?.name || 'Mezun',
                  department: currentUser?.department || 'Mezun',
                  programTitle: mentorshipForm.title,
                  status: 'Beklemede', // PENDING ADMIN APPROVAL
                  avatar: currentUser?.avatar || null,
                  hours: mentorshipForm.hours,
                  mode: mentorshipForm.mode,
                  motivation: mentorshipForm.motivation
                };
                
                if (setMentorships) {
                  setMentorships([newMentorship, ...(mentorships || [])]);
                } else {
                  try {
                    const storedMentorships = JSON.parse(localStorage.getItem('iesu_mentorships_v2') || localStorage.getItem('igu_mentorships_v2') || '[]');
                    localStorage.setItem('iesu_mentorships_v2', JSON.stringify([newMentorship, ...storedMentorships]));
                    localStorage.setItem('igu_mentorships_v2', JSON.stringify([newMentorship, ...storedMentorships]));
                  } catch (err) {}
                }

                window.toast?.success?.("Başvurunuz başarıyla alınmıştır. Kariyer Geliştirme Merkezi yöneticisi tarafından onaylandıktan sonra ilan edilecektir.");
                setShowMentorshipModal(false);
                setMentorshipForm({ title: '', hours: '', mode: 'Online', motivation: '' });
              }} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Uzmanlık / Program Başlığı</label>
                  <input required type="text" value={mentorshipForm.title} onChange={e => setMentorshipForm({...mentorshipForm, title: e.target.value})} placeholder="Örn: Yazılım Mühendisliği Kariyer Rehberliği" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Haftalık Uygunluk (Saat)</label>
                    <input required type="number" min="1" max="20" value={mentorshipForm.hours} onChange={e => setMentorshipForm({...mentorshipForm, hours: e.target.value})} placeholder="Örn: 2" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Çalışma Şekli</label>
                    <select value={mentorshipForm.mode} onChange={e => setMentorshipForm({...mentorshipForm, mode: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500">
                      <option value="Online">Online</option>
                      <option value="Yüz Yüze">Yüz Yüze</option>
                      <option value="Hibrit">Hibrit</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Motivasyon / Kısa Özgeçmiş</label>
                  <textarea required rows={3} value={mentorshipForm.motivation} onChange={e => setMentorshipForm({...mentorshipForm, motivation: e.target.value})} placeholder="Öğrencilerimize nasıl destek olabileceğinizi kısaca anlatın..." className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"></textarea>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors">Başvuruyu Gönder</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* YÖNETİCİYE MESAJ GÖNDER POPUP FORM MODAL (CORPORATE MIDNIGHT SAPPHIRE THEME #0A2342) */}
        {showAdminMsgModal && (
          <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-slide-up relative">
              <div className="bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-900 p-6 text-white relative border-b border-blue-800/60">
                <button onClick={() => setShowAdminMsgModal(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white cursor-pointer"><X size={16}/></button>
                <Crown size={32} className="mb-2 text-amber-300"/>
                <h2 className="text-xl font-black">Kariyer Merkezi Yönetici İletişim Formu</h2>
                <p className="text-blue-200 text-xs mt-1">Özel protokoller, iş birliği ve staj talepleriniz doğrudan yönetici havuzuna iletilir.</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const newMsg = {
                  id: 'ADM-MSG-' + Date.now(),
                  companyName: currentUser?.name || 'Kurumsal Firma',
                  email: adminMsgForm.email || currentUser?.email || 'Belirtilmedi',
                  phone: adminMsgForm.phone || 'Belirtilmedi',
                  subject: adminMsgForm.subject,
                  message: adminMsgForm.message,
                  date: new Date().toLocaleString('tr-TR'),
                  status: 'Beklemede'
                };
                if (setAdminMessages) {
                  setAdminMessages(prev => [newMsg, ...(prev || [])]);
                }
                try {
                  const stored = JSON.parse(localStorage.getItem('iesu_admin_messages_v1') || '[]');
                  localStorage.setItem('iesu_admin_messages_v1', JSON.stringify([newMsg, ...stored]));
                } catch (err) {}
                setShowAdminMsgModal(false);
                setAdminMsgForm({ subject: '', email: '', phone: '', message: '' });
                window.toast?.success?.("Mesajınız Kariyer Geliştirme Merkezi yöneticilerine iletilmiştir. Sizinle iletişime geçilecektir.");
              }} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kurum / Firma Adı</label>
                  <input type="text" disabled value={currentUser?.name || 'Kurumsal Firma'} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 text-slate-500 font-bold" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Konu Başlığı *</label>
                  <input 
                    type="text" 
                    required 
                    value={adminMsgForm.subject} 
                    onChange={e => setAdminMsgForm({...adminMsgForm, subject: e.target.value})} 
                    placeholder="Örn: 2026 Mühendislik Staj Kontenjanı Talebi" 
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 focus:border-[#0A2342] outline-none" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">E-Posta Adresi *</label>
                    <input 
                      type="email" 
                      required 
                      value={adminMsgForm.email} 
                      onChange={e => setAdminMsgForm({...adminMsgForm, email: e.target.value})} 
                      placeholder="kurumsal@sirket.com" 
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 focus:border-[#0A2342] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">İletişim Telefonu *</label>
                    <input 
                      type="tel" 
                      required 
                      value={adminMsgForm.phone} 
                      onChange={e => setAdminMsgForm({...adminMsgForm, phone: e.target.value})} 
                      placeholder="0212 XXX XX XX" 
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 focus:border-[#0A2342] outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mesajınız & İş Birliği Detayı *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={adminMsgForm.message} 
                    onChange={e => setAdminMsgForm({...adminMsgForm, message: e.target.value})} 
                    placeholder="Talebinizi ve detaylarını açıklayın..." 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-[#0A2342] outline-none" 
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setShowAdminMsgModal(false)} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition cursor-pointer">İptal</button>
                  <button type="submit" className="flex-[2] bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-900 hover:from-slate-900 hover:to-blue-800 text-white py-3 rounded-xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 border border-blue-800/60 cursor-pointer">
                    <Send size={16} /> Yöneticiye İlet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Career Fair Modal Overlay */}
        {showFairModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-slide-up relative">
              <div className="bg-gradient-to-r from-[#990000] to-[#7A0000] p-6 text-white relative">
                <button onClick={() => setShowFairModal(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white"><X size={16}/></button>
                <Calendar size={32} className="mb-2 text-amber-300"/>
                <h2 className="text-xl font-black">{careerFairEvent?.title || 'Kariyer Fuarı Katılım Başvurusu'}</h2>
                <p className="text-red-100 text-xs mt-1">Stand kurulumu ve stajyer/aday mülakat katılım başvurusu.</p>
              </div>
              <form onSubmit={handleFairSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kurum / Firma Adı</label>
                  <input type="text" disabled value={currentUser?.name || 'Kurumsal Firma'} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 text-slate-500 font-bold" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Katılım Amacı & Notlar</label>
                  <textarea 
                    required 
                    rows={3} 
                    value={fairForm.notes || ''} 
                    onChange={e => setFairForm({...fairForm, notes: e.target.value})} 
                    placeholder="Fuar stant talebiniz, aradığınız yetenek profilleri ve ek notlarınız..." 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-200 focus:border-[#990000] outline-none" 
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setShowFairModal(false)} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition">İptal</button>
                  <button type="submit" className="flex-[2] bg-[#990000] text-white py-2.5 rounded-xl font-black text-sm hover:bg-red-800 transition shadow-md">Başvuruyu Gönder</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      
      {/* CAREER SHORTS FULLSCREEN MODAL */}
      {showShorts && <CareerShorts setView={setView} onClose={() => setShowShorts(false)} />}
      
      {/* INTERACTIVE FOOTER MODAL DIALOGS */}
      <FooterModals activeModal={footerModal} onClose={() => setFooterModal(null)} setView={setView} />

      {/* ─── FİRMA İLAN BAŞVURULARI & ADAY TAKİP HAVUZU MODALI (Z-[9999]) ─── */}
      {showCompanyAppsModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[85vh] relative">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 text-white flex items-center justify-between shrink-0 border-b border-purple-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-purple-300 flex items-center justify-center font-black shadow-md shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">{currentUser?.name || 'Kurumsal Firma'} — İlan Başvuruları & ATS Aday Havuzu</h3>
                  <p className="text-[11px] text-purple-200 font-medium">Kurumsal Aday Yönetim Paneli</p>
                </div>
              </div>

              <button 
                onClick={() => setShowCompanyAppsModal(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer shrink-0 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Sub-Header & Status Filter Tabs */}
            <div className="p-4 sm:p-5 bg-purple-50/50 border-b border-purple-100 shrink-0 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">Gelen Aday Başvuruları & Statü Yönetimi</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Başvuran öğrencilerin durumunu güncelleyip iletişime geçebilirsiniz.</p>
                </div>
                <span className="bg-purple-100 text-purple-900 font-black text-xs px-3.5 py-1.5 rounded-xl border border-purple-200 shadow-2xs">
                  Toplam {companyCandidateApps.length} Aday Başvurusu
                </span>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
                {['Tümü', 'Beklemede', 'İletişime Geçildi', 'Mülakata Çağrıldı', 'Kabul Edildi', 'Reddedildi'].map(filterTab => (
                  <button
                    key={filterTab}
                    onClick={() => setAtsStatusFilter(filterTab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      atsStatusFilter === filterTab
                        ? 'bg-purple-900 text-white shadow-sm font-black'
                        : 'bg-white text-slate-600 hover:bg-purple-100/60 border border-slate-200/80'
                    }`}
                  >
                    {filterTab} {filterTab === 'Tümü' ? `(${companyCandidateApps.length})` : `(${companyCandidateApps.filter(a => a.status === filterTab).length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 flex-1 text-slate-700 bg-white custom-scrollbar">
              {filteredCandidateApps.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Briefcase size={40} className="text-purple-300 mx-auto mb-3 opacity-50" />
                  <p className="font-black text-slate-800 text-sm">Seçilen Filtrede Aday Bulunmuyor</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Filtrenizi değiştirebilir veya tüm adayları listeleyebilirsiniz.</p>
                </div>
              ) : (
                filteredCandidateApps.map((app) => (
                  <div key={app.id} className="p-4 sm:p-4.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-purple-300 transition-all space-y-3">
                    
                    {/* Top Bar: Name, Dept, Position & Status Badge */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-black text-slate-900 text-sm leading-tight">{app.applicantName}</h5>
                          <span className="bg-purple-50 text-purple-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-purple-200/70 leading-none">
                            {app.applicantDept}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-purple-800">
                          Başvurulan Pozisyon: <span className="font-black text-slate-900">{app.jobTitle}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[11px] font-black px-3 py-1 rounded-lg uppercase tracking-wider leading-none shadow-2xs ${
                          app.status === 'Kabul Edildi' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          app.status === 'Mülakata Çağrıldı' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                          app.status === 'İletişime Geçildi' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                          app.status === 'Reddedildi' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                          'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {app.status}
                        </span>
                        
                        <button 
                          onClick={() => setSelectedCandidateCvModal(app)} 
                          className="px-2.5 py-1 bg-slate-900 hover:bg-black text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <FileText size={13} /> CV İncele
                        </button>
                        <button 
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('iesu_open_chat', {
                              detail: {
                                candidateId: app.id,
                                candidateName: app.applicantName,
                                candidateAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.applicantName || 'A')}&background=0A2342&color=fff`,
                                candidateDept: app.applicantDept,
                                candidateRole: app.jobTitle,
                                initialMessage: `Merhaba ${app.applicantName}, "${app.jobTitle}" başvurunuzu inceledik. Süreç hakkında sizinle görüşmek isteriz.`
                              }
                            }));
                          }} 
                          className="px-2.5 py-1 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <MessageCircle size={13} /> Mesaj Gönder
                        </button>
                      </div>
                    </div>

                    {/* Contact Info & Cover Letter Box */}
                    <div className="p-3 bg-slate-50/90 rounded-xl space-y-2 text-[11px] text-slate-700 border border-slate-200/70">
                      <div className="flex items-center gap-3 flex-wrap font-medium text-slate-800 text-[11px]">
                        <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200/60 shadow-2xs">📱 Tel: {app.applicantPhone}</span>
                        <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200/60 shadow-2xs">✉️ E-Posta: {app.applicantEmail}</span>
                        <span className="text-purple-800 font-extrabold bg-purple-50 px-2.5 py-0.5 rounded border border-purple-100 shadow-2xs">📄 {app.cvType}</span>
                      </div>

                      {app.coverLetter && (
                        <div className="pt-1.5 border-t border-slate-200/60 space-y-0.5">
                          <span className="font-bold text-slate-900 text-[10px] uppercase tracking-wider block">Ön Yazı / Mesaj:</span>
                          <p className="italic text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200/70 leading-relaxed font-medium text-[11px]">
                            "{app.coverLetter}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons for Company Status Change (LIVE REACT MUTATION) */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap border-t border-slate-100">
                      <span className="text-[11px] font-black text-slate-600 mr-1 uppercase tracking-wider">Aday Durumu Güncelle:</span>
                      {[
                        { label: 'İletişime Geçildi', activeColor: 'bg-purple-700 text-white font-black border-purple-800 shadow-xs', defaultColor: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200' },
                        { label: 'Mülakata Çağrıldı', activeColor: 'bg-blue-700 text-white font-black border-blue-800 shadow-xs', defaultColor: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
                        { label: 'Kabul Edildi', activeColor: 'bg-emerald-700 text-white font-black border-emerald-800 shadow-xs', defaultColor: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
                        { label: 'Reddedildi', activeColor: 'bg-rose-700 text-white font-black border-rose-800 shadow-xs', defaultColor: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' }
                      ].map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => updateCandidateStatus(app.id, act.label)}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            app.status === act.label ? act.activeColor : act.defaultColor
                          }`}
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-medium">İESÜ Kariyer Geliştirme Merkezi Doğrulanmış Aday Paneli</span>
              <button 
                onClick={() => setShowCompanyAppsModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── KGM AKREDİTE GERÇEK A4 DİJİTAL CV MODALI & İNDİRME / YAZDIRMA (Z-[10000]) ─── */}
      {selectedCandidateCvModal && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
          <div className="bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-purple-800/40 overflow-hidden flex flex-col max-h-[94vh] relative">
            
            {/* Top Toolbar (İNDİR, YAZDIR & İLETİŞİM) */}
            <div className="p-4 bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 text-white flex items-center justify-between shrink-0 border-b border-purple-800/40 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center font-black shadow-md shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">{selectedCandidateCvModal.applicantName} — Resmi A4 Dijital CV</h3>
                  <p className="text-[11px] text-purple-200 font-medium">İESÜ Kariyer Geliştirme Merkezi Akredite Belge</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    const filename = `${(selectedCandidateCvModal.applicantName || 'Öğrenci').replace(/\s+/g, '_')}_IESU_Akredite_CV.pdf`;
                    exportPDF('printable-a4-cv', filename);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FileText size={15} /> 📥 A4 PDF İndir
                </button>

                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  🖨️ Yazdır
                </button>

                <button
                  onClick={() => {
                    updateCandidateStatus(selectedCandidateCvModal.id, 'İletişime Geçildi');
                    setSelectedCandidateCvModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  📱 Adayla İletişime Geç
                </button>

                <button 
                  onClick={() => setSelectedCandidateCvModal(null)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer font-bold shrink-0 ml-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body Container (A4 Printable Canvas Area) */}
            <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-800/60 custom-scrollbar flex justify-center">
              
              {/* ─── REALISTIC A4 SHEET CANVAS (210mm x 297mm Ratio - Celil Başaran Authentic Design) ─── */}
              <div id="printable-a4-cv" className="w-full max-w-[210mm] bg-white text-slate-900 p-8 sm:p-10 shadow-2xl rounded-sm border border-slate-300 space-y-6 font-sans text-left relative min-h-[297mm]">
                
                {/* TOP NAME & CONTACT BAR (Celil Başaran Authentic Design - Contact Details Flush at Divider Line) */}
                <div className="flex justify-between items-start border-b border-slate-300 pb-3 gap-4">
                  <div className="flex-1 flex flex-col justify-between min-h-[7rem]">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-2">{selectedCandidateCvModal.applicantName}</h1>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 flex-wrap pt-2">
                      <span>📱 {selectedCandidateCvModal.applicantPhone || '0543-187-59-90'}</span>
                      <span>✉️ {selectedCandidateCvModal.applicantEmail || 'Celil.basaran23@gmail.com'}</span>
                      <span>🔗 {selectedCandidateCvModal.linkedin || 'Linkedin : Celilbasaran'}</span>
                    </div>
                  </div>

                  {/* Profile Photo / Avatar Frame */}
                  <div className="w-24 h-28 bg-slate-100 border border-slate-300 rounded-lg shadow-xs overflow-hidden shrink-0 flex items-center justify-center">
                    {selectedCandidateCvModal.photo ? (
                      <img src={selectedCandidateCvModal.photo} alt={selectedCandidateCvModal.applicantName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-purple-800 to-indigo-900 text-white font-black text-xl flex items-center justify-center">
                        {selectedCandidateCvModal.applicantName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* MAIN TWO-COLUMN BODY LAYOUT (Image 3 Architecture) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT MAIN COLUMN (Approx 68% - 8 Cols) */}
                  <div className="md:col-span-8 space-y-4 text-xs text-slate-800 leading-relaxed">
                    
                    {/* Hakkımda */}
                    <section className="space-y-1 border-b border-slate-200 pb-3.5">
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Hakkımda</h2>
                      <p className="text-[11.5px] text-slate-700 leading-relaxed font-normal">
                        {selectedCandidateCvModal.coverLetter || 'Uluslararası Ticaret ve Finansman bölümünden mezun oldum. İstanbul Esenyurt Üniversitesi Havacılık Yönetimi çift ana dal programında son sınıf öğrencisiyim. Zorunlu derslerimi tamamladığım için tam zamanlı çalışmaya uygunum. Yaklaşık 9,5 yıllık iş tecrübem boyunca saha operasyonları, ekip koordinasyonu ve kriz yönetimi alanlarında deneyim kazandım.'}
                      </p>
                    </section>

                    {/* İş Deneyimi */}
                    <section className="space-y-2 border-b border-slate-200 pb-3.5">
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">İş Deneyimi</h2>
                      <div className="space-y-2 text-xs">
                        {(selectedCandidateCvModal.experiences || [
                          { role: 'Stajyer', company: 'İstanbul Büyükşehir Belediyesi', date: '01.02.2013 – 01.02.2017' },
                          { role: 'Aşçı Yardımcısı', company: 'İSPER A.Ş.', date: '01.02.2017-22.09.2022' },
                          { role: 'Stajyer', company: 'Ziraat Bankası', date: '19.08.2024-16.09.2024' },
                          { role: 'Kütüphane Görevlisi', company: 'T.C. Gençlik ve Spor Bakanlığı', date: '01.02.2026-01.06.2026' }
                        ]).map((exp, idx) => (
                          <div key={idx} className="flex justify-between items-baseline text-xs">
                            <div>
                              <span className="font-black text-slate-900 mr-2">{exp.role}</span>
                              <span className="font-semibold text-slate-700">{exp.company}</span>
                            </div>
                            <span className="font-mono text-[11px] text-slate-600 font-bold shrink-0">{exp.date}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Projeler ve Organizasyon Deneyimi */}
                    <section className="space-y-2">
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Projeler ve Organizasyon Deneyimi</h2>
                      <div className="space-y-2.5">
                        {(selectedCandidateCvModal.projects || [
                          { title: 'Fakülte Öğrenci Temsilciliği ve Üniversite Öğrenci Temsilciliği', date: '2023 - 2026' },
                          { title: 'Gençlik ve Spor Bakanlığı Üniversite Öğrenci Temsilciliği', date: '2024 - 2026' },
                          { title: 'Kalite Koordinatörlüğü Fakülte Öğrenci Temsilciliği', date: '2025 - 2026' },
                          { title: 'Kalite Koordinatörlüğü Üniversite Öğrenci Temsilciliği', date: '2025 - 2026' },
                          { title: 'Genç Yeşilay Kulüp Başkanlığı', date: '2025 - 2026' },
                          { title: 'Güneydoğu Anadolu İhracatçı Birlikleri Eğitimi', date: '09.07 2024', desc: 'Turquality® Dünyanın İlk ve Tek Devlet Destekli Markalaşma Programı / Excel\'de Kısa Yollar ve Pratik Uygulamalar' },
                          { title: 'TÜBİTAK 2209-A Araştırma Projesi Üniversite Öğrencileri Araştırma Projesi', date: '2024 -2024', subTitle: '"Dijital Dalgada Savrulanlar: Z Kuşağının İmtihanı"', desc: 'Proje ekibinde görev aldım. Araştırma ve raporlama süreçlerine katkı sağladım.' },
                          { title: 'Gençlik ve Spor Bakanlığı Unides Projesi', date: '2025 - 2026', desc: '(Proje Ekibi/Yürütücüsü) 4 ve 5 Dönem (Yeşil Fest)' },
                          { title: 'STAR Akreditasyon', date: '2026', desc: 'İşletme ve Yönetimi Bilimleri Fakültesi Öğrenci Temsilcisi olarak görev aldım' },
                          { title: 'Medek Akreditasyon', desc: 'Kalite Koordinatörlüğü Üniversite Öğrenci Temsilcisi olarak görev aldım' },
                          { title: 'MayFest 26 Bahar Festivali', date: '2026', desc: 'Mayfest 26 Üniversite Öğrenci Temsilcisi olarak öğrenci organizasyon katılımı ve yönetimi süreçlerinde görev aldım' }
                        ]).map((proj, idx) => (
                          <div key={idx} className="space-y-0.5 border-l-2 border-slate-200 pl-2.5">
                            <div className="flex justify-between items-baseline">
                              <span className="font-bold text-slate-900">{proj.title}</span>
                              {proj.date && <span className="font-mono text-[11px] text-slate-600 font-bold shrink-0 ml-2">{proj.date}</span>}
                            </div>
                            {proj.subTitle && <p className="font-semibold text-slate-800 text-[11px]">{proj.subTitle}</p>}
                            {proj.desc && <p className="text-slate-600 text-[11px] font-normal">{proj.desc}</p>}
                          </div>
                        ))}
                      </div>
                    </section>

                  </div>

                  {/* RIGHT SIDEBAR COLUMN (Approx 32% - 4 Cols) */}
                  <div className="md:col-span-4 space-y-4 text-xs text-slate-800 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-4">
                    
                    {/* Eğitim */}
                    <section className="space-y-0.5">
                      <h3 className="font-black text-slate-900 uppercase tracking-wide text-xs">Eğitim</h3>
                      <p className="font-bold text-slate-900">İstanbul Esenyurt Üniversitesi</p>
                      <p className="text-slate-700 font-medium">{selectedCandidateCvModal.applicantDept || 'Uluslararası Ticaret ve Finansman'}</p>
                      <p className="text-[11px] text-slate-500 font-bold">2022-2026</p>
                    </section>

                    {/* Teknik Yetkinlikler */}
                    <section className="space-y-0.5">
                      <h3 className="font-black text-slate-900 uppercase tracking-wide text-xs">Teknik Yetkinlikler</h3>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 font-medium">
                        {(selectedCandidateCvModal.skillsTech || ['MS Office', 'Excel', 'Yapay zekâ araçları (ChatGPT, Claude, Gemini, Codex)', 'Google Workspace']).map((sk, i) => (
                          <li key={i}>{sk}</li>
                        ))}
                      </ul>
                    </section>

                    {/* Kişisel Yetkinlikler */}
                    <section className="space-y-0.5">
                      <h3 className="font-black text-slate-900 uppercase tracking-wide text-xs">Kişisel Yetkinlikler</h3>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 font-medium">
                        {(selectedCandidateCvModal.skillsPersonal || ['Analitik düşünme', 'Problem çözme', 'Takım çalışması', 'Organizasyon', 'Zaman yönetimi', 'Kriz yönetimi']).map((sk, i) => (
                          <li key={i}>{sk}</li>
                        ))}
                      </ul>
                    </section>

                    {/* İlgi Alanları */}
                    <section className="space-y-0.5">
                      <h3 className="font-black text-slate-900 uppercase tracking-wide text-xs">İlgi Alanları</h3>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 font-medium">
                        {(selectedCandidateCvModal.interests || ['Gitar', 'Yapay zekâ teknolojileri', 'Dijital teknolojiler', 'Havacılık', 'Uluslararası ticaret ve lojistik', 'Kişisel gelişim', 'Dövüş Sporları']).map((sk, i) => (
                          <li key={i}>{sk}</li>
                        ))}
                      </ul>
                    </section>

                    {/* KİŞİSEL VE MESLEKİ GELİŞİM */}
                    <section className="space-y-0.5">
                      <h3 className="font-black text-slate-900 uppercase tracking-wide text-xs">KİŞİSEL VE MESLEKİ GELİŞİM</h3>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 font-medium">
                        {(selectedCandidateCvModal.trainings || ['AFAD Temel Afet Farkındalık Eğitimi', 'AFAD Gönüllülük Eğitimi', 'Temel İlk Yardım Eğitimi', 'Kariyer ve Liderlik Seminerleri']).map((tr, i) => (
                          <li key={i}>{tr}</li>
                        ))}
                      </ul>
                    </section>

                    {/* Dil */}
                    <section className="space-y-0.5">
                      <h3 className="font-black text-slate-900 uppercase tracking-wide text-xs">Dil</h3>
                      <p className="font-bold text-slate-900">İngilizce</p>
                      <p className="text-[11px] text-slate-600 font-medium">{selectedCandidateCvModal.language || 'İngilizce — Temel Seviye (A2)'}</p>
                    </section>

                  </div>

                </div>

                {/* FOOTER VERIFICATION SEAL */}
                <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-700" />
                    <span className="font-extrabold text-slate-800">İstanbul Esenyurt Üniversitesi KGM Akredite Belge — e-İmza Onaylı</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">Ref: KGM-CV-2026</span>
                </div>

              </div>

            </div>

            {/* Modal Footer Bar */}
            <div className="p-4 bg-slate-950 border-t border-purple-900/40 flex items-center justify-between shrink-0">
              <span className="text-xs text-purple-200/70 font-medium">A4 Printable Format & Live PDF Exporter</span>
              <button 
                onClick={() => setSelectedCandidateCvModal(null)}
                className="px-5 py-2 bg-white hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── CORPORATE NAVY FLOATING 4-BUTTON DOCK (#0A2342) ─── */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-blue-200 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(10,35,66,0.22)] flex items-center justify-between px-4 text-slate-800">
          
          {/* HOME - CORPORATE NAVY */}
          <button 
            onClick={() => setActiveTab('feed')} 
            className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'feed' ? 'bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-950 text-white shadow-md shadow-blue-950/40' : 'text-slate-600 hover:text-[#0A2342] hover:bg-blue-50'}`} 
            title="Kurumsal Akış"
          >
            <Home size={22} strokeWidth={2.2} />
          </button>
          
          {/* YENİ İLAN YAYINLA - CORPORATE SAPPHIRE BLUE */}
          <button 
            onClick={() => setIsCreatingJob(true)} 
            className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-[#0A2342] to-indigo-800 text-white shadow-lg shadow-blue-950/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-blue-300/40 cursor-pointer" 
            title="Yeni İlan Yayınla"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
          
          {/* ADAY TAKİP / ATS HAVUZU */}
          <button 
            onClick={() => setView('company_ats')} 
            className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer" 
            title="ATS Aday Takip Panosu (Kanban)"
          >
            <Briefcase size={22} strokeWidth={2.5} />
          </button>
          
          {/* FİRMA KGM KİMLİK LOGOSU / PROFİL */}
          <button 
            onClick={() => { if (setSelectedUserId) setSelectedUserId((currentUser?.role === 'company' || currentUser?.role === 'employer') ? currentUser.id : 'CMP-001'); setView('user_profile'); }} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#0A2342] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
            title="Kurumsal Firma Profilim"
          >
            <SafeAvatar src={currentUser?.avatar || currentUser?.logo} name={currentUser?.name || 'Firma'} size="xs" alt="Profile" />
          </button>
        </div>
      </div>
    </div>
  );
}







