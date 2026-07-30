import useAppStore from '../store/useAppStore';
import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageCircle, Briefcase, Bookmark, Heart, Send, Plus, Users, Compass, UserCircle2, MoreHorizontal, X, CreditCard, CheckCircle, Clock, ShieldCheck, Crown, CheckCircle2, LayoutDashboard, Star, UserCheck, ArrowRight, FileText, Calendar, Wand2, Home, ClipboardList, Target, ChevronDown, MapPin, ChevronRight } from 'lucide-react';
import JobsAndInternships from './JobsAndInternships';
import MessagingInterface from './MessagingInterface';
import PostComposer from './PostComposer';
import CareerShorts from './CareerShorts';
import StoriesBar from './StoriesBar';
import { combineFeedItems } from '../utils/feedCombiner';
import PostCard from './PostCard';
import CareerRadar from './CareerRadar';
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
  const featureCareerCheckup = useAppStore(state => state.featureCareerCheckup);
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
  const [adminMsgForm, setAdminMsgForm] = useState({ subject: '', email: '', phone: '', message: '' });

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
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-10"></div> {/* Left Spacer */}
          
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} className="flex items-center gap-3 cursor-pointer" onClick={() => {
            const currentRole = currentUser?.role || userRole;
            setView?.(currentRole === 'admin' ? 'admin' : (currentRole === 'employer' || currentRole === 'company') ? 'company' : currentRole === 'alumni' ? 'alumni' : currentRole === 'academic' ? 'academic' : 'student');
          }}>
            <Logo className="h-10 w-auto hover:scale-105 transition-transform shrink-0" /><div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-[#990000] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Portalı</p>
            </div>
          </div>
          {/* GLOBAL SEARCH BAR (LinkedIn Style) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input 
                id="main-search"
                type="text" 
                placeholder="Öğrenci, firma, mezun veya içerik ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#EEF3F8] text-gray-900 text-sm rounded-md focus:ring-2 focus:ring-red-500 focus:bg-white focus:outline-none block pl-10 p-2 transition-all"
              />
            </div>
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

                <button onClick={() => setView('admin')} className="mt-4 w-full flex items-center justify-center gap-2 bg-[#990000] hover:bg-red-800 text-white text-[13px] font-black py-3 rounded-xl transition-all shadow-md">
                  <LayoutDashboard size={16} /> Yönetim Panelini Aç
                </button>
              </div>
            ) : (
              <>
                <div className="text-center relative z-10 pt-2">
                  <div className="w-20 h-20 rounded-2xl border-2 border-red-100 overflow-hidden bg-white mx-auto shadow-md">
                    <img src={currentUser?.avatar || currentUser?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Firma')}&background=990000&color=fff`} alt="Company" className="w-full h-full object-contain p-1" />
                  </div>
                  <h2 className="text-[17px] font-black text-gray-900 leading-tight mt-3 mb-1">{currentUser?.name || 'Kurumsal Firma'}</h2>
                  <p className="text-[12px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full inline-block mb-3 border border-purple-100">
                    {currentUser?.sector || 'Sektör Lideri / Resmî Anlaşmalı Firma'}
                  </p>
                  
                  <div className="mt-2 text-center p-3 bg-red-50/50 rounded-xl border border-red-100">
                    <p className="text-[11px] font-bold text-[#990000]">Kariyer Geliştirme Merkezi</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Resmî Kurumsal İletişim Portalı</p>
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
              const allItems = combineFeedItems(posts, events, news, announcements, jobs);
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

        {/* RIGHT PANEL: Kurumsal İletişim & Onay Süreci */}
        <div className="hidden lg:block w-[320px] shrink-0 space-y-5">
          {/* YÖNETİCİ İLE MUHATAP OLMA BİLGİLENDİRME KARTI */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#990000]" /> Kurumsal İş Birliği Süreci
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#990000] px-2 py-0.5 rounded border border-red-100">
                Resmî
              </span>
            </div>
            
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Firmamız tarafından oluşturulan tüm ilan ve staj talepleri <strong>Kariyer Geliştirme Merkezi</strong> yönetici onayına sunulur.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 text-[#990000] flex items-center justify-center text-xs font-black shrink-0 mt-0.5">1</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Formu Doldurun</p>
                  <p className="text-[11px] text-slate-500">Pozisyon ve staj detaylarını form ile iletin.</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">2</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Yönetici Onayı</p>
                  <p className="text-[11px] text-slate-500">Talebiniz Kariyer Merkezi tarafından incelenir.</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">3</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Yayına Alınma</p>
                  <p className="text-[11px] text-slate-500">Onaylanan ilanlar öğrenci ve mezunlara sunulur.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsCreatingJob(true)}
              className="w-full py-3 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Yeni İlan Talebi Gönder
            </button>
          </div>

          {/* KURUMSAL DESTEK & İLETİŞİM KARTI */}
          <div className="bg-gradient-to-br from-[#7A0000] via-[#990000] to-[#5C0000] rounded-2xl p-5 shadow-xl text-white space-y-3 relative overflow-hidden border border-red-900">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest flex items-center gap-1">
              <Crown size={12} className="text-amber-300" /> Kariyer Geliştirme Merkezi
            </p>
            <h3 className="font-black text-base text-white leading-tight">Yönetici İletişim Hattı</h3>
            <p className="text-xs text-red-100 font-medium leading-relaxed">Özel protokoller, kurumsal iş birlikleri ve staj kontenjanı süreçleri için Kariyer Merkezi uzmanlarımızla iletişime geçin.</p>
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
              className="w-full py-2.5 bg-white text-[#990000] hover:bg-slate-100 rounded-xl text-xs font-black transition-all shadow-md uppercase tracking-wider flex items-center justify-center gap-2"
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
                  currentUser={currentUser || { id: 'alm-1', name: 'Mezun', avatar: 'https://ui-avatars.com/api/?name=Mezun&background=2563EB&color=fff' }} 
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
                  avatar: currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'M'}&background=0A2342&color=fff`,
                  hours: mentorshipForm.hours,
                  mode: mentorshipForm.mode,
                  motivation: mentorshipForm.motivation
                };
                
                if (setMentorships) {
                  setMentorships([newMentorship, ...(mentorships || [])]);
                } else {
                  try {
                    const storedMentorships = JSON.parse(localStorage.getItem('igu_mentorships_v2')) || [];
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
        {/* YÖNETİCİYE MESAJ GÖNDER POPUP FORM MODAL */}
        {showAdminMsgModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-slide-up relative">
              <div className="bg-gradient-to-r from-[#990000] to-[#7A0000] p-6 text-white relative">
                <button onClick={() => setShowAdminMsgModal(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white"><X size={16}/></button>
                <Crown size={32} className="mb-2 text-amber-300"/>
                <h2 className="text-xl font-black">Kariyer Merkezi Yönetici İletişim Formu</h2>
                <p className="text-red-100 text-xs mt-1">Özel protokoller, iş birliği ve staj talepleriniz doğrudan yönetici havuzuna iletilir.</p>
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
                setShowAdminMsgModal(false);
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 focus:border-[#990000] outline-none" 
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
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 focus:border-[#990000] outline-none" 
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
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 focus:border-[#990000] outline-none" 
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
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-200 focus:border-[#990000] outline-none" 
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setShowAdminMsgModal(false)} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition">İptal</button>
                  <button type="submit" className="flex-[2] bg-[#990000] text-white py-2.5 rounded-xl font-black text-sm hover:bg-red-800 transition shadow-md flex items-center justify-center gap-2">
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

      {/* FLOATING DOCK (VIBRANT MULTI-COLOR MODERN GLASS THEME) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[320px]">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-red-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(30,41,59,0.18)] flex items-center justify-around px-4 text-gray-800">
          
          {/* HOME - BLUE */}
          <button onClick={() => setActiveTab('feed')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'feed' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}`} title="Kurumsal Akış">
            <Home size={22} strokeWidth={2.2} />
          </button>
          
          {/* CREATE JOB FORM - RED CENTER BUTTON */}
          <button onClick={() => setIsCreatingJob(true)} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#7A0000] via-[#990000] to-red-600 text-white shadow-lg shadow-red-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50" title="İlan / Staj Talebi Oluştur">
            <Plus size={24} strokeWidth={2.8} />
          </button>

          {/* PROFILE AVATAR */}
          <button onClick={() => { if (setSelectedUserId) setSelectedUserId?.(currentUser?.id || 'CMP-001'); setView?.('user_profile'); }} className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-red-400/60 shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden" title="Firma Profilim">
            <img src={currentUser?.avatar || currentUser?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Firma')}&background=990000&color=fff`} className="w-full h-full rounded-full object-cover" alt="User" />
          </button>
        </div>
      </div>
      
      {/* CAREER SHORTS FULLSCREEN MODAL */}
      {showShorts && <CareerShorts setView={setView} onClose={() => setShowShorts(false)} />}
      
      {/* INTERACTIVE FOOTER MODAL DIALOGS */}
      <FooterModals activeModal={footerModal} onClose={() => setFooterModal(null)} setView={setView} />
    </div>
  );
}







