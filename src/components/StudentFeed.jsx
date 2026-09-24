import useAppStore from '../store/useAppStore';
import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageCircle, Briefcase, Bookmark, Heart, Send, Plus, Users, Compass, UserCircle2, MoreHorizontal, X, CreditCard, CheckCircle, Clock, ShieldCheck, Crown, CheckCircle2, LayoutDashboard, Star, UserCheck, ArrowRight, FileText, Calendar, Wand2, Home, ClipboardList, Target, Globe, ChevronDown, Sparkles, Newspaper, MapPin, Share2, Award, User, Settings, BookOpen, GraduationCap, Rocket, Zap } from 'lucide-react';
import JobsAndInternships from './JobsAndInternships';
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
import TeamUpMentorHub from './TeamUpMentorHub';
import SafeAvatar from './shared/SafeAvatar';
import FooterModals from './FooterModals';
import ConnectionSuggestions from './ConnectionSuggestions';
import BranchNewsWidget from './BranchNewsWidget';

export default function StudentFeed({ setView, setSelectedUserId, currentUser, userRole, academicRole, setSelectedGroupId }) {
  const [footerModal, setFooterModal] = useState(null);
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
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
  const voluntaryInternships = useAppStore(state => state.voluntaryInternships);
  const applications = useAppStore(state => state.applications);
  const setApplications = useAppStore(state => state.setApplications);
  const jobs = useAppStore(state => state.jobs);
  const academicStaff = useAppStore(state => state.academicStaff);
  const announcements = useAppStore(state => state.announcements);
  const groups = useAppStore(state => state.groups);
  const featureAlumniAssocToggle = useAppStore(state => state.featureAlumniAssocToggle);
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
  const [activeTab, setActiveTab] = useState('feed');
  const [feedFilter, setFeedFilter] = useState('for_you'); // for_you, following // feed, jobs, network
  const [showShorts, setShowShorts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMentorshipModal, setShowMentorshipModal] = useState(false);
  const [showMentorsModal, setShowMentorsModal] = useState(false);
  const [mentorshipForm, setMentorshipForm] = useState({ title: '', hours: '', mode: 'Online', motivation: '' });
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({ tc: '', phone: '' });
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [showAllNewsModal, setShowAllNewsModal] = useState(false);

  // Guarantee Student branch isolation
  useEffect(() => {
    const store = useAppStore.getState();
    if (store.setActivePortalBranch) store.setActivePortalBranch('student');
  }, []);

  const isAdmin = userRole === 'admin' || currentUser?.role === 'admin';
  const studentName = currentUser?.name || 'Öğrenci';
  const studentDept = isAdmin ? 'Kariyer Geliştirme Koordinatörlüğü' : (currentUser?.department || 'Yazılım Mühendisliği');
  const studentAvatar = currentUser?.avatar || (isAdmin ? '/iesu-logo.svg' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde');
  const studentId = (currentUser?.role === 'student' && currentUser?.id && currentUser.id !== 'admin_1513') ? currentUser.id : 'STU-001';

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

  return (
    <div className="min-h-screen bg-transparent font-sans">
      {/* Hyper-Modern Navbar (Z-40 — Sağ panel ve içeriklerin üstünde, Modaller z-9999 altında) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-40">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between relative">
          {/* LEFT: Logo & University Title */}
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('create_post')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-gray-100 ${activeTab === 'create_post' ? 'text-orange-500 bg-orange-50' : 'text-gray-600'}`} title="Gönderi Düzenle/Paylaş">
              <Star size={22} strokeWidth={activeTab === 'create_post' ? 2.5 : 2} className={activeTab === 'create_post' ? 'fill-current text-orange-500/10' : ''} />
            </button>
            
            <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center gap-3 cursor-pointer" onClick={() => setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')}>
              <Logo color="red" className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
              <div className="hidden sm:block text-left">
                <h1 className="text-[13px] font-black text-[#990000] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Merkezi</p>
              </div>
            </div>
          </div>

          {/* CENTER: Portal Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center pointer-events-none z-20">
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-red-900 via-[#990000] to-red-700 shadow-md shadow-red-900/30 border border-red-300/60 flex items-center gap-2 whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0"></span>
              🎓 ÖĞRENCİ AĞI & KARİYER PORTALI
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
            <TopProfileMenu currentUser={currentUser || { name: 'Öğrenci', avatar: 'https://ui-avatars.com/api/?name=Ogrenci&background=990000&color=fff' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} currentView="student" />
          </div>
        </div>
      </nav>

      {/* Main Container - Padded for Navbar */}
      <div className="pt-24 max-w-[1320px] mx-auto px-4 flex items-start justify-center gap-6 pb-20">
        
        {/* LEFT PANEL: Profile & KGB Kariyer Karnesi */}
        <div className="hidden lg:block w-[280px] shrink-0 sticky top-24 space-y-3 self-start h-fit max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar z-20">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="h-20 bg-gradient-to-r from-[#8F0808] to-[#990000] relative">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                <div className="w-16 h-16 rounded-full border-3 border-white overflow-hidden bg-white shadow-md flex items-center justify-center">
                  <SafeAvatar 
                    src={studentAvatar} 
                    name={studentName} 
                    size="2xl" 
                    className="w-full h-full" 
                    alt="User" 
                  />
                </div>
              </div>
            </div>
            <div className="pt-10 pb-4 px-4 text-center">
              <h2 onClick={() => { if (setSelectedUserId) setSelectedUserId(studentId); setView('user_profile'); }} className="text-[16px] font-black text-gray-900 leading-tight mb-0.5 cursor-pointer hover:text-[#990000] transition">{studentName}</h2>
              <p className="text-[12px] font-medium text-gray-500 mb-3">
                {isAdmin ? 'Süper Yönetici & Koordinatör' : `${studentDept}${currentUser?.role === 'student' && currentUser?.graduationYear ? `, ${currentUser.graduationYear}` : ', 3. Sınıf'}`}
              </p>
                  
              <div className="flex justify-center gap-6 border-y border-gray-50 py-2.5 mb-3">
                <div className="text-center cursor-pointer group">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Ağım</p>
                  <p className="text-[14px] font-black text-gray-900 group-hover:text-[#990000] transition">120</p>
                </div>
                <div className="w-px bg-gray-100"></div>
                <div className="text-center cursor-pointer group">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Gönderi</p>
                  <p className="text-[14px] font-black text-gray-900 group-hover:text-[#990000] transition">15</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => { if (setSelectedUserId) setSelectedUserId(studentId); setView('user_profile'); }} 
                  className="w-full py-2 bg-gradient-to-r from-red-900 via-[#990000] to-red-700 hover:from-red-800 hover:to-red-600 text-white rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs border border-red-400/30"
                >
                  <User size={13} /> Öğrenci Profilimi Görüntüle
                </button>
                <button 
                  onClick={() => setView('profile_update')} 
                  className="w-full py-1.5 bg-red-50 text-[#990000] hover:bg-red-100 rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Settings size={12} /> Kariyer Durumunu Güncelle
                </button>
              </div>
            </div>
          </div>

          {/* Öğrenci KGB — Kariyer Gelişim Belgesi & Yetenek Karnesi Özeti */}
          <div className="bg-white rounded-2xl border border-red-100 shadow-[0_4px_20px_rgb(153,0,0,0.03)] p-3.5 text-left transition-all hover:border-red-200">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-red-50 border border-red-200/60 flex items-center justify-center text-[#990000] shadow-2xs">
                  <GraduationCap size={15} />
                </div>
                <div>
                  <h4 className="text-[12px] font-black leading-tight text-gray-900">KGB Kariyer Karnem</h4>
                  <p className="text-[9px] font-semibold text-gray-500">Kariyer Gelişim Durumu</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black">
                Aktif • %88
              </span>
            </div>

            {/* İlerleme Çubuğu */}
            <div className="mb-2.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                <span>YÖK Kariyer Standartları</span>
                <span className="text-[#990000] font-black">A+ Seviye</span>
              </div>
              <div className="h-1.5 w-full bg-red-50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 via-[#990000] to-emerald-500 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 py-2 border-y border-gray-100 mb-2.5 text-center">
              <div className="bg-slate-50 rounded-xl p-1.5 border border-gray-100/80">
                <span className="block text-sm font-black text-[#990000]">{currentUser?.internships ?? 2}</span>
                <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider">Staj</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-1.5 border border-gray-100/80">
                <span className="block text-sm font-black text-amber-700">{currentUser?.certifications ?? 3}</span>
                <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider">Sertifika</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-1.5 border border-gray-100/80">
                <span className="block text-sm font-black text-blue-700">{currentUser?.workshopsAttended ?? 7}</span>
                <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider">Workshop</span>
              </div>
            </div>

            <button
              onClick={() => setView('student_kgb')}
              className="w-full py-2 bg-gradient-to-r from-red-900 via-[#990000] to-red-700 hover:from-red-800 hover:to-red-600 text-white rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-red-400/30"
            >
              <BookOpen size={13} /> Detaylı KGB Karnesini Aç
            </button>
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
          <ExploreFeed posts={posts} setView={setView} setSelectedUserId={setSelectedUserId} currentUser={currentUser} />
        )}

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="w-full shrink-0 flex flex-col gap-6 animate-fade-in">
          {/* Hızlı Erişim: Kariyer & Gelişim Araçları (Bento Grid) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#990000] inline-block animate-pulse"></span>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Kariyer & Gelişim Araçları</h3>
              </div>
              <span className="text-xs font-medium text-gray-400">Merkezi Hizmetler</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setView('cvbuilder')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-red-50/40 to-white hover:border-red-200 hover:shadow-xs transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100/70 text-[#990000] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FileText size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#990000] transition-colors leading-tight">Özgeçmiş Hazırlayıcı</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Profesyonel CV</span>
              </button>

              <button
                onClick={() => setView('interview_sim')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-orange-50/40 to-white hover:border-orange-200 hover:shadow-xs transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100/70 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Zap size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-orange-600 transition-colors leading-tight">Mülakat Provası</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Sektörel simülasyon</span>
              </button>

              <button
                onClick={() => setView('career_roadmap')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-blue-50/40 to-white hover:border-blue-200 hover:shadow-xs transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Compass size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">Kariyer Haritası</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Adım adım rota</span>
              </button>

              <button
                onClick={() => setView('career_test')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-purple-50/40 to-white hover:border-purple-200 hover:shadow-xs transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100/70 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Target size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-purple-600 transition-colors leading-tight">Kariyer Testi</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Yetenek & eğilim</span>
              </button>

              <button
                onClick={() => setView('applications')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-emerald-50/40 to-white hover:border-emerald-200 hover:shadow-xs transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <ClipboardList size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-600 transition-colors leading-tight">Başvurularım</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">İş & staj takibi</span>
              </button>

              <button
                onClick={() => setView('startup_incubator')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-amber-50/40 to-white hover:border-amber-200 hover:shadow-xs transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Rocket size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-amber-600 transition-colors leading-tight">Kuluçka Merkezi</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Girişim & proje</span>
              </button>

              <button
                onClick={() => setView('club_portal')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-sky-50/40 to-white hover:border-sky-200 hover:shadow-xs transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-100/70 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Users size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-sky-600 transition-colors leading-tight">Kulüpler Portalı</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Öğrenci kulüpleri</span>
              </button>

              <button
                onClick={() => setView('sem')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-indigo-50/40 to-white hover:border-indigo-200 hover:shadow-xs transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Award size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition-colors leading-tight">SEM Akademi</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Sertifika & eğitim</span>
              </button>
            </div>
          </div>
          {/* FEED TABS (LINKEDIN STYLE) */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-4 px-2 overflow-x-auto">
            <button 
              onClick={() => setFeedFilter('for_you')} 
              className={`pb-3 font-semibold text-[15px] transition-colors relative shrink-0 ${feedFilter === 'for_you' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Senin İçin
              {feedFilter === 'for_you' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setFeedFilter('following')} 
              className={`pb-3 font-semibold text-[15px] transition-colors relative shrink-0 ${feedFilter === 'following' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Ağım
              {feedFilter === 'following' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 rounded-t-full"></div>}
            </button>
          </div>

          {/* FEED POSTS */}
          <div className="space-y-6">
            {(() => {
              const allItems = combineFeedItems(posts, events, news, announcements, jobs, generalEvents, careerOpportunities);
              const filtered = allItems.filter(post => post.content?.toLowerCase().includes(searchQuery.toLowerCase()) || post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
              
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

        {/* TEAM & MENTOR TAB */}
        {activeTab === 'team_mentor' && (
          <TeamUpMentorHub currentUser={currentUser} />
        )}

        {/* SURVEYS TAB */}
        {featureSurveys && activeTab === 'surveys' && (
          <div className="w-full shrink-0 animate-fade-in mb-6">
            <AlumniSurveys surveys={surveys} currentUser={currentUser} />
          </div>
        )}

        {/* CLUBS TAB */}
        {featureClubsShowcase && activeTab === 'clubs' && (
          <div className="w-full shrink-0 animate-fade-in mb-6">
            <ClubsDirectory clubs={clubs} setClubs={setClubs} clubApplications={clubApplications} setClubApplications={setClubApplications} currentUser={currentUser} featureClubApplications={featureClubApplications} />
          </div>
        )}

        </div>

        {/* RIGHT PANEL: Dynamic Data */}
        <div className="hidden xl:block w-[300px] shrink-0 space-y-7">
          {/* 1. ÖĞRENCİ DALI ÖZEL GÜNDEM & HABERLER WIDGET'I */}
          <BranchNewsWidget branch="student" currentUser={currentUser} setView={setView} />

          {/* 2. ÖĞRENCİ DALI ÖZEL BAĞLANTI & AKRAN/MENTÖR ÖNERİLERİ */}
          <ConnectionSuggestions 
            branch="student"
            currentUser={currentUser}
            students={students}
            alumni={alumni}
            companies={companies}
            academicStaff={academicStaff}
            setView={setView}
            setSelectedUserId={setSelectedUserId}
            maxSuggestions={4}
          />



          {/* 3. GOOGLE STITCH CANLI MENTÖRLÜK REHBERİ KARTI (NET 24PX BOŞLUK) */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0F766E] to-teal-950 text-white rounded-3xl p-6 shadow-xl border border-teal-800/40 relative overflow-hidden my-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="bg-teal-400/20 text-teal-300 border border-teal-400/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Birebir Kariyer Rehberliği
              </span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            </div>

            <h3 className="font-black text-xl text-white leading-tight mb-2">Mentor Bulun</h3>
            <p className="text-xs text-teal-100 font-medium mb-4 leading-relaxed">
              Mezun ve akademisyen mentörlerimizden birebir kariyer rehberliği ve mentörlük desteği alın.
            </p>

            <div className="w-full bg-white/10 rounded-full h-2 mb-5 p-0.5">
              <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '85%' }}></div>
            </div>

            <button
              onClick={() => setShowMentorsModal(true)}
              className="w-full py-3 bg-white text-teal-900 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              Mentorları İncele <ArrowRight size={15} />
            </button>
          </div>

          {/* ─── IN-APP MENTORS REHBERİ MODALI (Z-300 ABSOLUTE OVERLAY & ZERO HEADER BLEED) ─── */}
          {showMentorsModal && (
            <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[9999] flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[70vh]">
                
                {/* Modal Header */}
                <div className="p-6 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                      <Award size={22} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-white">Doğrulanmış İESÜ Mentör Rehberi</h3>
                      <p className="text-xs text-teal-200 font-medium">Birebir Mentörlük Desteği Veren Akademisyen ve Mezunlarımız</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowMentorsModal(false)}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mentors List */}
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  {[...(alumni || []), ...(academicStaff || [])].slice(0, 8).map((mentorItem) => (
                    <div 
                      key={mentorItem.id}
                      className="p-4 bg-slate-50 hover:bg-teal-50/50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition cursor-pointer"
                      onClick={() => { setShowMentorsModal(false); setSelectedUserId?.(mentorItem.id); setView?.('public_profile'); }}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-slate-200 shrink-0">
                          <img 
                            src={mentorItem.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorItem.name||'M')}&background=0F766E&color=fff&size=100`} 
                            alt={mentorItem.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            {mentorItem.name} <ShieldCheck size={16} className="text-teal-600" />
                          </h4>
                          <p className="text-xs font-semibold text-teal-700">{mentorItem.title || mentorItem.department || 'Onaylı Mentör'}</p>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">İstanbul Esenyurt Üniversitesi • Mentörlük Saati: 2 Saat/Hafta</p>
                        </div>
                      </div>

                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setShowMentorsModal(false); 
                          setSelectedUserId?.(mentorItem.id); 
                          setView?.('public_profile'); 
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-black transition shrink-0 cursor-pointer shadow-md"
                      >
                        Mentörlük İste
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}


          {/* Öğrenci Bilgi Düzenleme shortcut (NET 24PX BOŞLUK) */}
          <div className="bg-gradient-to-br from-[#7A0000] via-[#990000] to-[#5C0000] rounded-2xl p-6 shadow-2xl text-white border border-red-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <p className="text-[11px] font-black text-amber-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Sparkles size={13} className="text-amber-300" /> Hızlı Erişim
            </p>
            <h3 className="font-black text-xl leading-tight mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {userRole === 'alumni' ? 'Mezun Bilgi Sistemi' : 'Bilgilerimi Düzenle'}
            </h3>
            <p className="text-xs text-white font-bold mb-5 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {userRole === 'alumni' 
                ? "Kariyer Check-up, Mezun Kartı ve profil güncellemeleriniz için MBS'yi ziyaret edin." 
                : "Akademik geçmişinizi, yeteneklerinizi ve CV tercihlerinizi profil alanından güncelleyin."}
            </p>
            <button 
              onClick={() => setView(userRole === 'alumni' ? 'mbs' : 'profile_update')} 
              className="w-full py-3.5 bg-white text-[#990000] hover:bg-slate-100 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-white"
            >
              {userRole === 'alumni' ? "Mezun Bilgi Sistemi'ne Git" : "Bilgilerimi Düzenle"} <ArrowRight size={16} />
            </button>
          </div>

          {/* Featured Opportunities */}
          {featuredOpportunities && (featuredOpportunities || []).filter(f => f.status === 'Yayında').length > 0 && (
            <div className="sticky top-24 bg-white/80 backdrop-blur-xl rounded-xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <Star size={18} className="text-yellow-500 fill-current" /> Öne Çıkanlar
              </h3>
              <div className="space-y-4">
                {(featuredOpportunities || []).filter(f => f.status === 'Yayında').slice(0,2).map(feat => (
                  <div key={feat.id} className="group cursor-pointer">
                    <div className="h-24 bg-gray-200 rounded-xl overflow-hidden mb-3 relative">
                      {feat.banner ? <img src={feat.banner} className="w-full h-full object-cover group-hover:scale-105 transition" /> : <div className="w-full h-full bg-gradient-to-r from-red-600 to-red-800"></div>}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-[12px] font-black truncate">{feat.title}</p>
                        <p className="text-white/80 text-[10px] font-medium truncate">{feat.organization}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentorships */}
          {mentorships && (mentorships || []).filter(m => m.status === 'Aktif').length > 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck size={18} className="text-red-500" /> Mentorluk Başvuruları
              </h3>
              <div className="space-y-3">
                {(mentorships || []).filter(m => m.status === 'Aktif').slice(0,3).map(mnt => (
                  <div key={mnt.id} className="p-3 bg-red-50/50 rounded-xl border border-red-100 hover:border-red-300 transition cursor-pointer group">
                    <p className="text-[12px] font-black text-gray-900 group-hover:text-red-700 transition">{mnt.programTitle}</p>
                    <p className="text-[11px] text-gray-500">{mnt.mentorName} • {mnt.department}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'career_network' && (
            <CareerNetwork companies={companies} events={events} academicStaff={academicStaff} setView={setView} setSelectedUserId={setSelectedUserId} />
          )}


          {/* PROFESSIONAL RIGHT SIDEBAR FOOTER */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-6 text-[12px] text-gray-500 font-medium px-4 text-center">
            <button onClick={() => setFooterModal('about')} className="hover:text-[#990000] transition-colors cursor-pointer">Hakkımızda</button>
            <button onClick={() => setFooterModal('accessibility')} className="hover:text-[#990000] transition-colors cursor-pointer">Erişilebilirlik</button>
            <button onClick={() => setFooterModal('help')} className="hover:text-[#990000] transition-colors cursor-pointer">Yardım Merkezi</button>
            <button onClick={() => setFooterModal('privacy')} className="hover:text-[#990000] transition-colors cursor-pointer">Gizlilik ve Şartlar</button>
            <button onClick={() => setFooterModal('ads')} className="hover:text-[#990000] transition-colors cursor-pointer">Reklam Seçenekleri</button>
            <button onClick={() => setFooterModal('careers')} className="hover:text-[#990000] transition-colors cursor-pointer">Kariyer</button>
            <div className="w-full flex items-center justify-center gap-1 mt-2">
              <span className="font-bold text-[#990000]">İESÜ Kariyer Portalı</span>
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
                  currentUser={currentUser || { id: 'alm-1', name: 'Mezun', avatar: 'https://ui-avatars.com/api/?name=Mezun&background=10B981&color=fff' }} 
                  userRole="student" 
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
                currentUser={currentUser || { id: 'alm-1', name: 'Mezun', avatar: 'https://ui-avatars.com/api/?name=Mezun&background=10B981&color=fff' }} 
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

        {/* KGM HABER MERKEZİ MODALI (APPLICATION SAFE Z-120 & GOOGLE STITCH DESIGN) */}
        {showAllNewsModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 pb-24 animate-fade-in">
            {/* Premium Blurred Backdrop */}
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" onClick={() => setShowAllNewsModal(false)}></div>
            
            <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-[32px] shadow-2xl relative z-10 flex flex-col overflow-hidden border border-slate-100/50 transform transition-all">
              {/* Header */}
              <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-[#990000] text-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center shadow-inner">
                    <Newspaper size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">KGM Basın & Duyuru Haber Merkezi</h2>
                    <p className="text-xs font-semibold text-red-200 mt-0.5 flex items-center gap-1"><Sparkles size={12} className="text-amber-400" /> Kariyer, etkinlik, staj ve kampüs haberleri</p>
                  </div>
                </div>
                <button onClick={() => setShowAllNewsModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { id: 'h1', title: '2026 Ulusal Kariyer Fuarı Başlıyor', time: '12 saat önce', readers: '4.2B okuyucu', category: 'Fuar', summary: 'İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi tarafından düzenlenen 2026 Ulusal Kariyer Fuarı için kayıtlar başladı. 50+ lider savunma, bilişim ve sanayi firması kampüsümüzde stajyer ve mezun adaylarla buluşuyor.', location: 'Ana Kampüs Konferans Salonu', date: '15 Nisan 2026' },
                    { id: 'h2', title: 'Yapay Zeka ve Geleceğin Meslekleri Raporu', time: '1 gün önce', readers: '3.1B okuyucu', category: 'Rapor', summary: 'İESÜ Araştırma OS Merkezi tarafından hazırlanan 2026 Yapay Zeka ve Geleceğin Meslekleri raporu yayımlandı. Rapor, veri analitiği, istem mühendisliği ve yapay zeka entegrasyonunun mezun istihdamındaki %45 artışını belgeliyor.', location: 'İESÜ Ar-Ge OS Merkezi', date: '10 Nisan 2026' },
                    { id: 'h3', title: 'Geleneksel Mezunlar ve Sektör Zirvesi', time: '2 gün önce', readers: '8.4B okuyucu', category: 'Zirve', summary: 'Geleneksel İESÜ Mezunlar ve Sektör Zirvesi bu yıl hibrit katılım modeliyle kapılarını açıyor. Türkiye ve dünyadaki mezunlarımız deneyimlerini aktif öğrencilerimizle paylaşacak.', location: 'İESÜ Kültür Merkezi & Online Stream', date: '22 Nisan 2026' },
                    { id: 'h4', title: 'Erasmus+ & Uluslararası Staj Kontenjanları', time: '3 gün önce', readers: '5.2B okuyucu', category: 'Staj', summary: 'Erasmus+ ve uluslararası konsorsiyum ortaklıkları çerçevesinde 2026-2027 dönemi yurt dışı zorunlu/gönüllü staj başvuruları ve hibe kontenjanları açıklandı.', location: 'Dış İlişkiler & Erasmus Ofisi', date: '01 Mayıs 2026' }
                  ].map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        setShowAllNewsModal(false);
                        setTimeout(() => setSelectedNewsItem(item), 100);
                      }}
                      className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-red-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-2.5 py-1 rounded-lg bg-red-50 text-[#990000] text-[10px] font-black uppercase tracking-wider group-hover:bg-[#990000] group-hover:text-white transition-colors">{item.category}</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={12} /> {item.time}</span>
                        </div>
                        <h3 className="text-[15px] font-black text-slate-900 leading-snug mb-2 group-hover:text-[#990000] transition-colors">{item.title}</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{item.summary}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5"><Users size={12} /> {item.readers}</span>
                        <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#990000] group-hover:text-white transition-colors">
                          <ArrowRight size={13} strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stitch News Detail Modal Overlay */}
        {selectedNewsItem && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 pb-24 animate-fade-in">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setSelectedNewsItem(null)}></div>
            <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[80vh] border border-slate-100">
              
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7A0000] via-[#990000] to-[#400000] z-0"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
                
                <div className="relative z-10 p-8 sm:p-10 text-white">
                  <button 
                    onClick={() => setSelectedNewsItem(null)} 
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition cursor-pointer"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 border border-white/20 text-[10px] font-black uppercase tracking-widest text-amber-300 mb-4 shadow-sm">
                    <Sparkles size={12} className="text-amber-300" /> KGM Resmi Duyurusu
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">{selectedNewsItem.title}</h2>
                  <div className="flex items-center gap-4 text-xs font-semibold text-red-100 mt-4 opacity-90">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {selectedNewsItem.time}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                    <span className="flex items-center gap-1.5"><Users size={14} /> {selectedNewsItem.readers}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 overflow-y-auto space-y-6 text-slate-700 bg-white custom-scrollbar">
                {(selectedNewsItem.location || selectedNewsItem.date) && (
                  <div className="flex items-center gap-4 flex-wrap">
                    {selectedNewsItem.location && (
                      <div className="flex items-center gap-2 text-slate-800">
                        <MapPin size={16} className="text-[#990000]" /> {selectedNewsItem.location}
                      </div>
                    )}
                    {selectedNewsItem.date && (
                      <div className="flex items-center gap-2 text-slate-800">
                        <Calendar size={16} className="text-[#990000]" /> {selectedNewsItem.date}
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-sm font-medium leading-relaxed whitespace-pre-line text-slate-600">
                  {selectedNewsItem.summary || 'İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi tarafından yapılan resmi duyuru ve haber içeriği.'}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setSelectedNewsItem(null)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm"
                >
                  Kapat
                </button>
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
                  avatar: currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'M'}&background=0A2342&color=fff`,
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

                window.toast.success("Başvurunuz başarıyla alınmıştır. Kariyer Geliştirme Merkezi yöneticisi tarafından onaylandıktan sonra ilan edilecektir.");
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

      </div>
      {/* FLOATING DOCK (DEDICATED STUDENT CRIMSON DOCK - 100% INDEPENDENT BRANCH) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-red-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(153,0,0,0.18)] flex items-center justify-between px-4 text-gray-800">
          
          {/* HOME - CRIMSON RED */}
          <button onClick={() => setActiveTab('feed')} className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${activeTab === 'feed' ? 'bg-[#990000] text-white shadow-md shadow-red-900/30' : 'text-slate-600 hover:text-[#990000] hover:bg-red-50'}`} title="Akış">
            <Home size={24} strokeWidth={2.2} />
          </button>
          
          {/* JOBS - VIBRANT GRADIENT CRIMSON */}
          <button onClick={() => setView('jobs')} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 text-white shadow-lg shadow-red-900/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-red-300/40 cursor-pointer" title="İş & Staj Olanakları">
            <Briefcase size={22} strokeWidth={2.5} />
          </button>
          
          {/* CENTER: SEARCH ICON (VIBRANT CRIMSON GRADIENT - KEŞFET & SOSYAL AĞ PORTALI) */}
          <button onClick={() => { setActiveTab('search'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 text-white shadow-lg shadow-red-900/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-red-300/40 cursor-pointer" title="Keşfet & Sosyal Ağ Portalı">
            <Search size={22} strokeWidth={2.8} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button 
            onClick={() => {
              if (setSelectedUserId) setSelectedUserId(studentId);
              setView('user_profile');
            }} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#990000] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
            title="Profilim"
          >
            <SafeAvatar src={studentAvatar} name={studentName} size="xs" alt="Profile" />
          </button>
        </div>
      </div>
      
      {/* KGM HABERLERİ POP-UP MODAL (Google Stitch Ultra Design) */}
      {selectedNewsItem && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100 animate-slide-up relative">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#990000] via-[#7A0000] to-slate-900 p-6 text-white shrink-0 relative">
              <button 
                onClick={() => setSelectedNewsItem(null)} 
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  {selectedNewsItem.category || 'KGM Duyuru'}
                </span>
                <span className="text-[10px] text-red-200 font-semibold">• {selectedNewsItem.time}</span>
              </div>
              <h3 className="text-xl font-black text-white leading-tight">{selectedNewsItem.title}</h3>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#990000]"/> Tarih: {selectedNewsItem.date || 'Bugün'}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#990000]"/> Konum: {selectedNewsItem.location || 'Kampüs'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#990000] tracking-wider">Haber & İçerik Detayı</h4>
                <p className="text-sm font-medium leading-relaxed text-slate-800 bg-white p-4 rounded-2xl border border-slate-100">
                  {selectedNewsItem.summary}
                </p>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-xs font-bold">
                <span>İlgili Birim: Kariyer Geliştirme Merkezi</span>
                <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[10px] uppercase font-black">Resmî Haber</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedNewsItem(null)} 
                className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAREER SHORTS FULLSCREEN MODAL */}
      {showShorts && <CareerShorts setView={setView} onClose={() => setShowShorts(false)} />}
      

      {/* INTERACTIVE FOOTER MODALS */}
      <FooterModals activeModal={footerModal} onClose={() => setFooterModal(null)} setView={setView} />
    </div>
  );
}







