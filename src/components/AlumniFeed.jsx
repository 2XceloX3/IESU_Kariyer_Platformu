import useAppStore from '../store/useAppStore';
import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageCircle, Briefcase, Bookmark, Heart, Send, Plus, Users, Compass, UserCircle2, User, MoreHorizontal, X, CreditCard, CheckCircle, Clock, ShieldCheck, Crown, CheckCircle2, LayoutDashboard, Star, UserCheck, ArrowRight, FileText, Calendar, Wand2, Home, ClipboardList, Target, Globe, ChevronDown, MapPin, Newspaper, Camera, GraduationCap, BookOpen } from 'lucide-react';
import ConnectionSuggestions from './ConnectionSuggestions';
import BranchNewsWidget from './BranchNewsWidget';
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
import SafeAvatar from './shared/SafeAvatar';

export default function AlumniFeed({ setView, setSelectedUserId, currentUser, userRole, academicRole, setSelectedGroupId }) {
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
  const [footerModal, setFooterModal] = useState(null);
  const [feedFilter, setFeedFilter] = useState('for_you'); // for_you, following // feed, jobs, network
  const [showShorts, setShowShorts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMentorshipModal, setShowMentorshipModal] = useState(false);
  const [mentorshipForm, setMentorshipForm] = useState({ title: '', hours: '', mode: 'Online', motivation: '' });
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({ tc: '', phone: '' });
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);

  // Guarantee Alumni branch isolation & auto-open evaluation questions
  useEffect(() => {
    const store = useAppStore.getState();
    if (store.setActivePortalBranch) store.setActivePortalBranch('alumni');

    // Automatically trigger evaluation questions popup when entering the alumni panel
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-survey-popup'));
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const isAdmin = userRole === 'admin' || currentUser?.role === 'admin';
  const alumniName = currentUser?.name || 'Mezun';
  const alumniDept = isAdmin ? 'Kariyer Geliştirme Koordinatörlüğü' : (currentUser?.department || 'Yazılım Mühendisliği');
  const alumniGradYear = (currentUser?.role === 'alumni' && (currentUser?.gradYear || currentUser?.graduationYear)) ? (currentUser.gradYear || currentUser.graduationYear) : '2023';
  const alumniAvatar = currentUser?.avatar || (isAdmin ? '/iesu-logo.svg' : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330');
  const alumniId = (currentUser?.role === 'alumni' && currentUser?.id && currentUser.id !== 'admin_1513') ? currentUser.id : 'ALU-001';

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
      {/* Hyper-Modern Navbar (Glassmorphism) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between relative">
          {/* LEFT: Logo & University Title */}
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('create_post')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-gray-100 ${activeTab === 'create_post' ? 'text-orange-500 bg-orange-50' : 'text-gray-600'}`} title="Gönderi Düzenle/Paylaş">
              <Star size={22} strokeWidth={activeTab === 'create_post' ? 2.5 : 2} className={activeTab === 'create_post' ? 'fill-current text-orange-500/10' : ''} />
            </button>
            
            <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center gap-3 cursor-pointer" onClick={() => setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')}>
              <Logo color="emerald" className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
              <div className="hidden sm:block text-left">
                <h1 className="text-[13px] font-black text-emerald-800 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">İESÜ Mezunlar Portalı</p>
              </div>
            </div>
          </div>

          {/* CENTER: Portal Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center pointer-events-none z-20">
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-md shadow-emerald-600/30 border border-emerald-300/60 flex items-center gap-2 whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0"></span>
              🎓 MEZUN AĞI & KARİYER PORTALI
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
            <TopProfileMenu currentUser={currentUser || { name: 'Mezun', avatar: 'https://ui-avatars.com/api/?name=Mezun&background=EA580C&color=fff' }} userRole={userRole || 'alumni'} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} currentView="alumni" />
          </div>
        </div>
      </nav>

      <div className="pt-24 max-w-6xl mx-auto px-4 flex justify-center gap-6 pb-20">
        <div className="hidden lg:block w-[300px] shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden text-center">
            <div className="h-24 bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-md flex items-center justify-center">
                  <SafeAvatar 
                    src={alumniAvatar} 
                    name={alumniName} 
                    size="2xl" 
                    className="w-full h-full" 
                    alt="Mezun Avatar" 
                  />
                </div>
              </div>
            </div>
            <div className="pt-12 pb-6 px-6 text-center">
                  <h2 
                    onClick={() => {
                      if (setSelectedUserId) setSelectedUserId(alumniId);
                      setView('user_profile');
                    }}
                    className="text-[17px] font-black text-gray-900 leading-tight mb-1 cursor-pointer hover:text-emerald-700 transition flex items-center justify-center gap-1.5"
                    title="Mezun Profilini Aç"
                  >
                    {alumniName}
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Mezun Durumu Aktif"></span>
                  </h2>
                  <p className="text-[12px] font-bold text-gray-500 mb-4">
                    {isAdmin ? 'Süper Yönetici & Koordinatör' : `${alumniDept} • Mezuniyet: ${alumniGradYear}`}
                  </p>
                  
                  <div className="flex justify-center gap-6 border-y border-gray-100 py-3 mb-4">
                    <div className="text-center cursor-pointer group">
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-wider mb-0.5">Mezun Ağı</p>
                      <p className="text-[15px] font-black text-gray-900 group-hover:text-emerald-700 transition">120 Bağlantı</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div className="text-center cursor-pointer group">
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-wider mb-0.5">Paylaşım</p>
                      <p className="text-[15px] font-black text-gray-900 group-hover:text-emerald-700 transition">15 Gönderi</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        if (setSelectedUserId) setSelectedUserId(alumniId);
                        setView('user_profile');
                      }} 
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <User size={14} /> Mezun Profilimi Görüntüle
                    </button>
                    <button 
                      onClick={() => setView('mbs')} 
                      className="w-full py-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <GraduationCap size={14} /> Mezun Bilgi Sistemi (MBS)
                    </button>
                  </div>
                </div>
          </div>

          {/* Mezun KGB — Kariyer Katkı & Mentörlük Karnesi */}
          <div className="mt-4 bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 rounded-2xl p-4 text-white shadow-sm border border-emerald-800/40 text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <BookOpen size={14} />
                </div>
                <div>
                  <h4 className="text-[12px] font-black leading-tight text-white">Mezun KGB Karnem</h4>
                  <p className="text-[9px] text-emerald-200/70">Kariyer & Mentörlük Katkısı</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black">
                Güçlü Ağ
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-white/10 mb-3 text-center">
              <div className="bg-white/5 rounded-xl p-2">
                <span className="block text-base font-black text-emerald-300">{currentUser?.mentoringSessions ?? 8}</span>
                <span className="block text-[8px] font-bold text-emerald-200 uppercase tracking-wider">Mentörlük</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2">
                <span className="block text-base font-black text-teal-300">{currentUser?.jobsShared ?? 15}</span>
                <span className="block text-[8px] font-bold text-teal-200 uppercase tracking-wider">İş İlanı</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2">
                <span className="block text-base font-black text-cyan-300">{currentUser?.eventsAttended ?? 4}</span>
                <span className="block text-[8px] font-bold text-cyan-200 uppercase tracking-wider">Etkinlik</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (setSelectedUserId) setSelectedUserId(alumniId);
                setView('user_profile');
              }}
              className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 hover:text-white rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen size={12} /> KGB Katkı Profilimi Gör
            </button>
          </div>
        </div>

        <div className="w-full max-w-[600px] shrink-0 space-y-6">
        {activeTab === 'create_post' && (
          <div className="bg-white rounded-xl w-full p-4 sm:p-6 shadow-[var(--shadow-soft)] border border-[var(--border-soft)] animate-fade-in mb-6">
             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Star className="text-emerald-600 fill-current" size={24} /> Gönderi Paylaş & Düzenle
             </h2>
             <PostComposer currentUser={currentUser} userRole={userRole} posts={posts} setPosts={setPosts} />
          </div>
        )}

        {activeTab === 'search' && (
          <ExploreFeed posts={posts} setView={setView} setSelectedUserId={setSelectedUserId} currentUser={currentUser} />
        )}

        {activeTab === 'feed' && (
          <div className="w-full shrink-0 flex flex-col gap-6 animate-fade-in">
          {/* Mezun Hızlı Erişim & Ekosistem Araçları */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#059669] inline-block animate-pulse"></span>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Mezun Ekosistem Araçları</h3>
              </div>
              <span className="text-xs font-medium text-emerald-600 font-semibold">İESÜ Ağı</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => {
                  const store = useAppStore.getState();
                  if (store.setActivePortalBranch) store.setActivePortalBranch('alumni');
                  setView('global_map');
                }}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-emerald-50/40 to-white hover:border-emerald-200 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-[#059669] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Globe size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#059669] transition-colors leading-tight">Küresel Harita</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Dünya geneli mezunlar</span>
              </button>

              <button
                onClick={() => {
                  if (setShowCardModal) setShowCardModal(true);
                  else setView('alumni_card');
                }}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-teal-50/40 to-white hover:border-teal-200 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CreditCard size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-teal-600 transition-colors leading-tight">Mezun Kartı</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Dijital kimlik & haklar</span>
              </button>

              <button
                onClick={() => {
                  const store = useAppStore.getState();
                  if (store.setActivePortalBranch) store.setActivePortalBranch('alumni');
                  setView('mezun_dernek');
                }}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-cyan-50/40 to-white hover:border-cyan-200 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-100/70 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <GraduationCap size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-cyan-600 transition-colors leading-tight">Mezunlar Birliği</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Dernek & projeler</span>
              </button>

              <button
                onClick={() => setView('cvbuilder')}
                className="group flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-linear-to-b from-slate-50/60 to-white hover:border-slate-300 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FileText size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-slate-900 transition-colors leading-tight">Özgeçmiş Hazırlayıcı</span>
                <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Kariyer CV oluşturucu</span>
              </button>
            </div>
          </div>
            <div className="flex items-center gap-6 border-b border-gray-200 mb-4 px-2">
            <button 
              onClick={() => setFeedFilter('for_you')} 
              className={`pb-3 font-semibold text-[15px] transition-colors relative ${feedFilter === 'for_you' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Senin İçin
              {feedFilter === 'for_you' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-emerald-600 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setFeedFilter('following')} 
              className={`pb-3 font-semibold text-[15px] transition-colors relative ${feedFilter === 'following' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Ağım
              {feedFilter === 'following' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-emerald-600 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                if (store.setActivePortalBranch) store.setActivePortalBranch('alumni');
                setView('mezun_dernek');
              }} 
              className="pb-3 font-semibold text-[15px] text-gray-500 hover:text-emerald-700 transition-colors relative cursor-pointer"
            >
              Mezunlar Derneği
            </button>
          </div>

          {/* Mezun Kariyer & Memnuniyet Değerlendirme Davet Kartı */}
          <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 shadow-sm border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
                <ClipboardList size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white truncate">Resmî Mezun Değerlendirme Anketi</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold shrink-0">10 Değerlendirme Sorusu</span>
                </div>
                <p className="text-[12px] text-emerald-200/80 font-medium line-clamp-1 mt-0.5">
                  Üniversitemizin akreditasyon ve kariyer kalitesini artırmak için deneyimlerinizi paylaşın.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-survey-popup'))}
              className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl transition shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer border border-emerald-400/30"
            >
              <span>Soruları Yanıtla</span>
              <ArrowRight size={13} className="text-white" />
            </button>
          </div>

          <div className="space-y-6">
            {(() => {
              const allItems = combineFeedItems(posts, events, news, announcements, jobs, generalEvents, careerOpportunities);
              const filtered = allItems.filter(post => post.content?.toLowerCase().includes(searchQuery.toLowerCase()) || post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
              
              if (filtered.length === 0) {
                return (
                  <div className="p-10 text-center bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><FileText size={32} /></div>
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

        {featureSurveys && activeTab === 'surveys' && (
          <div className="w-full shrink-0 animate-fade-in mb-6">
            <AlumniSurveys surveys={surveys} currentUser={currentUser} />
          </div>
        )}

        {featureClubsShowcase && activeTab === 'clubs' && (
          <div className="w-full shrink-0 animate-fade-in mb-6">
            <ClubsDirectory clubs={clubs} setClubs={setClubs} clubApplications={clubApplications} setClubApplications={setClubApplications} currentUser={currentUser} featureClubApplications={featureClubApplications} />
          </div>
        )}

        </div>

        <div className="hidden xl:block w-[300px] shrink-0 space-y-6">
          {/* 1. MEZUN DALI ÖZEL GÜNDEM & HABERLER WIDGET'I */}
          <BranchNewsWidget branch="alumni" currentUser={currentUser} setView={setView} />

          {/* 2. MEZUN DALI ÖZEL BAĞLANTI & AĞ ÖNERİLERİ */}
          <ConnectionSuggestions 
            branch="alumni"
            currentUser={currentUser}
            students={students}
            alumni={alumni}
            companies={companies}
            academicStaff={academicStaff}
            setView={setView}
            setSelectedUserId={setSelectedUserId}
            maxSuggestions={4}
          />

          <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
            <h3 className="font-black text-gray-900 mb-2">Mentor Olun</h3>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-4">Mezun olarak tecrübelerinizi öğrencilerle paylaşın ve onlara yol gösterin.</p>
            <button
              onClick={() => setShowMentorshipModal(true)}
              className="w-full py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-[13px] font-bold transition-colors cursor-pointer"
            >
              Mentorluk Başvurusu Yap
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-950 via-teal-800 to-emerald-900 rounded-2xl p-6 shadow-2xl text-white border border-emerald-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <p className="text-[11px] font-black text-amber-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Star size={13} className="text-amber-300 fill-current" /> Hızlı Erişim
            </p>
            <h3 className="font-black text-xl leading-tight mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Mezun Bilgi Sistemi
            </h3>
            <p className="text-xs text-white font-bold mb-5 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Kariyer Check-up, Mezun Kartı ve profil güncellemeleriniz için MBS'yi ziyaret edin.
            </p>
            <button 
              onClick={() => setView('mbs')} 
              className="w-full py-3.5 bg-white text-emerald-900 hover:bg-slate-100 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-white"
            >
              Mezun Bilgi Sistemi'ne Git <ArrowRight size={16} />
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
                    const storedMentorships = JSON.parse(localStorage.getItem('iesu_mentorships_v2') || localStorage.getItem('igu_mentorships_v2') || '[]');
                    localStorage.setItem('iesu_mentorships_v2', JSON.stringify([newMentorship, ...storedMentorships]));
                    localStorage.setItem('igu_mentorships_v2', JSON.stringify([newMentorship, ...storedMentorships]));
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
                    <label className="block text-xs font-bold text-gray-700 mb-1">Çalışma Åekli</label>
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
      {/* FLOATING DOCK (DEDICATED ALUMNI EMERALD DOCK - 100% INDEPENDENT BRANCH) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-emerald-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(5,150,105,0.18)] flex items-center justify-between px-4 text-gray-800">
          
          {/* HOME - EMERALD GREEN */}
          <button onClick={() => setActiveTab('feed')} className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${activeTab === 'feed' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'}`} title="Akış">
            <Home size={24} strokeWidth={2.2} />
          </button>
          
          {/* JOBS - VIBRANT GRADIENT EMERALD */}
          <button onClick={() => setView('jobs')} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-lg shadow-emerald-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-emerald-300/40 cursor-pointer" title="İş & Staj Olanakları">
            <Briefcase size={22} strokeWidth={2.5} />
          </button>
          
          {/* CENTER: SEARCH ICON (VIBRANT GRADIENT TEAL/EMERALD - KEŞFET & SOSYAL AĞ PORTALI) */}
          <button onClick={() => { setActiveTab('search'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-emerald-700 text-white shadow-lg shadow-teal-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer" title="Keşfet & Sosyal Ağ Portalı">
            <Search size={22} strokeWidth={2.8} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button 
            onClick={() => {
              if (setSelectedUserId) setSelectedUserId(alumniId);
              setView('user_profile');
            }} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-emerald-500 shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
            title="Profilim"
          >
            <SafeAvatar src={alumniAvatar} name={alumniName} size="xs" alt="Profile" />
          </button>
        </div>
      </div>
      

      {/* EVENTS MODAL */}
      {showEventsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto mx-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">Etkinlikler</h3>
              <button onClick={() => setShowEventsModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"><X size={18} className="text-gray-500"/></button>
            </div>
            <div className="p-5 space-y-4">
              {(events || []).length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">Henuz etkinlik bulunmuyor</p>
                  <p className="text-sm">Yeni etkinlikler eklendiginde burada gorunecek</p>
                </div>
              ) : (
                (events || []).map(e => (
                  <div key={e?.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition group cursor-pointer">
                    <div className="w-14 h-14 rounded-xl bg-red-50 flex flex-col items-center justify-center shrink-0">
                      <span className="text-lg font-black text-red-600 leading-none">{(e?.date || '').split(' ')[0] || '--'}</span>
                      <span className="text-[10px] font-bold text-red-500 uppercase">{(e?.date || '').split(' ')[1] || ''}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition">{e?.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{e?.description || e?.location || ''}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1"><Calendar size={11}/> {e?.date || 'TBD'}</span>
                        {e?.location && <span className="flex items-center gap-1"><MapPin size={11}/> {e?.location}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

            {/* SELECTED NEWS DETAIL MODAL */}
      {selectedNewsItem && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] relative">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-red-950 via-[#7A0000] to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center font-black">
                  <Newspaper size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                    {selectedNewsItem.category || 'Resmî Haber'}
                  </span>
                  <h3 className="font-black text-base text-white mt-1 leading-snug">{selectedNewsItem.title}</h3>
                </div>
              </div>

              <button 
                onClick={() => setSelectedNewsItem(null)} 
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 bg-slate-50/50">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 bg-white p-3 rounded-2xl border border-slate-100">
                <span>📅 {selectedNewsItem.date || selectedNewsItem.time}</span>
                <span>•</span>
                <span>📍 {selectedNewsItem.location || 'İESÜ Kampüsü'}</span>
                <span>•</span>
                <span>👁️ {selectedNewsItem.readers || 'Resmî Yayın'}</span>
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
    </div>
  );
}







