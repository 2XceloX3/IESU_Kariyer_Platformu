import useAppStore from '../store/useAppStore';
import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageCircle, Briefcase, Bookmark, Heart, Send, Plus, Users, Compass, UserCircle2, MoreHorizontal, X, CreditCard, CheckCircle, Clock, ShieldCheck, Crown, CheckCircle2, LayoutDashboard, Star, UserCheck, ArrowRight, FileText, Calendar, Wand2, Home, ClipboardList, Target, Globe, ChevronDown, Sparkles, Newspaper, MapPin, Share2 } from 'lucide-react';
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
import DailyQuestsPanel from './DailyQuestsPanel';
import TeamUpMentorHub from './TeamUpMentorHub';
import FooterModals from './FooterModals';

export default function StudentFeed({ setView, setSelectedUserId, currentUser, userRole, academicRole, setSelectedGroupId }) {
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
  const [mentorshipForm, setMentorshipForm] = useState({ title: '', hours: '', mode: 'Online', motivation: '' });
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({ tc: '', phone: '' });
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [showAllNewsModal, setShowAllNewsModal] = useState(false);

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
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* LEFT: Star Icon for Post Creation */}
          <button onClick={() => setActiveTab('create_post')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-gray-100 ${activeTab === 'create_post' ? 'text-orange-500 bg-orange-50' : 'text-gray-600'}`} title="Gönderi Düzenle/Paylaş">
            <Star size={24} strokeWidth={activeTab === 'create_post' ? 2.5 : 2} className={activeTab === 'create_post' ? 'fill-current text-orange-500/10' : ''} />
          </button>
          
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center gap-3 cursor-pointer" onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')}>
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
                type="text" 
                placeholder="Öğrenci, firma, mezun veya içerik ara..." 
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
            <TopProfileMenu currentUser={currentUser || { name: 'Mezun', avatar: 'https://ui-avatars.com/api/?name=Mezun&background=EA580C&color=fff' }} userRole={userRole || 'alumni'} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} currentView="student" />
          </div>
        </div>
      </nav>

      {/* Main Container - Padded for Navbar */}
      <div className="pt-24 max-w-6xl mx-auto px-4 flex justify-center gap-6 pb-20">
        
        {/* LEFT PANEL: Profile (Fast Access) */}
        <div className="hidden lg:block w-[300px] shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
            {userRole === 'admin' || currentUser?.role === 'admin' ? (
              <div className="p-6 text-center">
                <div className="relative inline-block mb-2">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm mx-auto p-2">
                    <Logo size="lg" className="w-full h-full justify-center" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-1.5 rounded-xl shadow-md border-2 border-white">
                    <Crown size={14} />
                  </div>
                </div>
                <h2 className="text-[16px] font-black text-gray-900 mt-4 leading-tight">Kariyer Geliştirme Merkezi</h2>
                <p className="text-[12px] font-bold text-orange-600 mt-1 uppercase tracking-wider">SÜPER YÖNETİCİ</p>
                
                <div className="mt-6 flex flex-col gap-2 text-left bg-gray-50 p-3 rounded-2xl">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Sistem Yetkileri</p>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-700">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Tüm panellere tam erişim
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-700">
                    <CheckCircle2 size={14} className="text-emerald-500" /> İçerik yönetimi
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-700">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Kullanıcı onayları
                  </div>
                </div>

                <button onClick={() => setView('admin')} className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-[13px] font-bold py-3 rounded-xl transition-all shadow-md">
                  <LayoutDashboard size={16} /> Yönetim Panelini Aç
                </button>
              </div>
            ) : (
              <>
                <div className="h-24 bg-gradient-to-r from-[#8F0808] to-[#990000] relative">
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                      <img 
                        src={(currentUser?.role === 'admin' || currentUser?.avatar === '/logo.png') ? '/iesu-logo.svg' : (currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Mezun')}&background=990000&color=fff`)} 
                        alt="User" 
                        className="w-full h-full object-contain p-1" 
                        onError={(e) => { e.target.onerror = null; e.target.src = '/iesu-logo.svg'; }}
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6 text-center">
                  <h2 className="text-[18px] font-black text-gray-900 leading-none mb-1 cursor-pointer hover:text-[#990000] transition">{currentUser?.name || 'Mezun'}</h2>
                  <p className="text-[13px] font-medium text-gray-500 mb-4">
                    {`${currentUser?.department || 'Mezun'}${currentUser?.graduationYear ? `, ${currentUser.graduationYear}` : ''}`}
                  </p>
                  
                  <div className="flex justify-center gap-6 border-y border-gray-50 py-4 mb-4">
                    <div className="text-center cursor-pointer group">
                      <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-0.5">Ağım</p>
                      <p className="text-[16px] font-black text-gray-900 group-hover:text-[#990000] transition">120</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div className="text-center cursor-pointer group">
                      <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-0.5">Gönderi</p>
                      <p className="text-[16px] font-black text-gray-900 group-hover:text-[#990000] transition">15</p>
                    </div>
                  </div>
                  <button onClick={() => setView('user_profile')} className="w-full py-2.5 bg-red-50 text-[#990000] hover:bg-red-100 rounded-xl text-[13px] font-bold transition-colors">
                    Kariyer Durumunu Güncelle
                  </button>
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
          <ExploreFeed posts={posts} setView={setView} setSelectedUserId={setSelectedUserId} currentUser={currentUser} />
        )}

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="w-full shrink-0 flex flex-col gap-6 animate-fade-in">
          

          
          
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
            {featureAlumniAssocToggle && (
              <button 
                onClick={() => setView('mezun_dernek')} 
                className={`pb-3 font-bold text-[15px] transition-colors relative shrink-0 text-[#990000] hover:text-red-700 flex items-center gap-1.5`}
              >
                <Crown size={16} className="text-amber-500 fill-current" /> Mezunlar Derneği
              </button>
            )}
          </div>

          {/* FEED POSTS */}
          <div className="space-y-6">
            {(() => {
              const allItems = combineFeedItems(posts, events, news, announcements, jobs);
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
        <div className="hidden xl:block w-[300px] shrink-0 space-y-6">
          {/* KGM Haberleri (Stitch Protocol Redesign) */}
          <div className="relative bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group mb-6">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150 pointer-events-none"></div>
            
            <div className="p-5 sm:p-6 relative z-10">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-50 text-[#990000] rounded-xl">
                    <Newspaper size={16} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-black text-slate-900 text-[15px] tracking-tight">KGM Haberleri</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-100 rounded-full">
                  <div className="w-1.5 h-1.5 bg-[#990000] rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black text-[#990000] uppercase tracking-wider">Canlı</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {[
                  { id: 'h1', title: 'Yeni Kariyer Fuarı Duyuruldu', time: '12 saat önce', readers: '4.2B okuyucu', category: 'Fuar', summary: 'İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi tarafından düzenlenen 2026 Ulusal Kariyer Fuarı için kayıtlar başladı. 50+ lider savunma, bilişim ve sanayi firması kampüsümüzde stajyer ve mezun adaylarla buluşuyor.', location: 'Ana Kampüs Konferans Salonu', date: '15 Nisan 2026' },
                  { id: 'h2', title: 'Yapay Zeka ve İstihdam Raporu', time: '1 gün önce', readers: '3.1B okuyucu', category: 'Rapor', summary: 'İESÜ Araştırma OS Merkezi tarafından hazırlanan 2026 Yapay Zeka ve Geleceğin Meslekleri raporu yayımlandı. Rapor, veri analitiği, istem mühendisliği ve yapay zeka entegrasyonunun mezun istihdamındaki %45 artışını belgeliyor.', location: 'İESÜ Ar-Ge OS Merkezi', date: '10 Nisan 2026' },
                  { id: 'h3', title: 'Mezunlar Zirvesi Başlıyor', time: '2 gün önce', readers: '8.4B okuyucu', category: 'Zirve', summary: 'Geleneksel İESÜ Mezunlar ve Sektör Zirvesi bu yıl hibrit katılım modeliyle kapılarını açıyor. Türkiye ve dünyadaki mezunlarımız deneyimlerini aktif öğrencilerimizle paylaşacak.', location: 'İESÜ Kültür Merkezi & Online Stream', date: '22 Nisan 2026' }
                ].map((newsItem) => (
                  <div key={newsItem.id} onClick={() => setSelectedNewsItem(newsItem)} className="group/item cursor-pointer flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-2 group-hover/item:bg-[#990000] group-hover/item:scale-150 transition-all duration-300"></div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-slate-800 group-hover/item:text-[#990000] transition-colors leading-snug">
                        {newsItem.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold text-slate-500">{newsItem.time}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-[10px] font-semibold text-slate-500">{newsItem.readers}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setShowAllNewsModal(true)}
                className="mt-5 w-full bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-[#990000] text-xs font-bold py-2.5 rounded-xl border border-slate-100 hover:border-red-100 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                Tüm Haberleri Keşfet <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <DailyQuestsPanel />
          
          {/* Senin İçin Önerilenler (Instagram Style) */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-500 text-[13px]">Senin için önerilenler</h3>
              <button onClick={() => setView('network')} className="text-gray-900 text-[12px] font-bold hover:text-red-600 transition-colors cursor-pointer">Tümünü gör</button>
            </div>
            
            <div className="flex flex-col gap-4">
              {[
                { id: 1, name: 'Ayşe Yılmaz', subtitle: 'Senin için öneriliyor', role: 'İşletme Öğrencisi', verified: false, userId: 'st_1' },
                { id: 2, name: 'Caner Demir', subtitle: 'Ahmet ve 2 diğer kişi takip ediyor', role: 'Yazılım Mezunu', verified: true, userId: 'al_1' },
                { id: 3, name: 'Zeynep Kaya', subtitle: 'Senin için öneriliyor', role: 'Tasarım', verified: false, userId: 'st_2' }
              ].map((user) => (
                <div key={user.id} className="flex items-center justify-between group">
                  <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      if (setSelectedUserId) setSelectedUserId(user.userId);
                      setView('user_profile');
                    }}
                  >
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                      className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform" 
                      alt={user.name} 
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-gray-900 flex items-center gap-1 group-hover:text-red-500 transition-colors">
                        {user.name.toLowerCase().replace(' ', '_')}
                        {user.verified && <span className="text-red-500"><CheckCircle2 size={12} className="fill-current text-white" /></span>}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate w-32">{user.subtitle}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.currentTarget.innerText = e.currentTarget.innerText === 'Takip Et' ? 'Takip Ediliyor' : 'Takip Et';
                      e.currentTarget.className = e.currentTarget.innerText === 'Takip Ediliyor' ? 'text-[12px] font-bold text-gray-400' : 'text-[12px] font-bold text-red-500 hover:text-gray-900 transition-colors';
                    }}
                    className="text-[12px] font-bold text-red-500 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    Takip Et
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-50 text-[11px] text-gray-400 flex flex-wrap gap-x-2 gap-y-1">
              <button onClick={() => setFooterModal('about')} className="hover:text-red-600 transition-colors cursor-pointer">Hakkında</button> · 
              <button onClick={() => setFooterModal('help')} className="hover:text-red-600 transition-colors cursor-pointer">Yardım</button> · 
              <button onClick={() => setView('jobs')} className="hover:text-red-600 transition-colors cursor-pointer">İş Fırsatları</button> · 
              <button onClick={() => setFooterModal('privacy')} className="hover:text-red-600 transition-colors cursor-pointer">Gizlilik</button> · 
              <button onClick={() => setFooterModal('privacy')} className="hover:text-red-600 transition-colors cursor-pointer">Koşullar</button>
              <p className="w-full mt-2 uppercase tracking-wider text-[10px] text-gray-500 font-bold">© 2026 İSTANBUL ESENYURT ÜNİVERSİTESİ KGM</p>
            </div>
          </div>





          {/* Mentorluk Widget (Öğrenci için Mentor Bul, Mezun için Mentor Ol) */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
            <h3 className="font-black text-gray-900 mb-2">
              {userRole === 'student' ? 'Mentor Bulun' : 'Mentor Olun'}
            </h3>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-4">
              {userRole === 'student' 
                ? 'Mezun ve akademisyen mentorlarımızdan birebir kariyer rehberliği ve destek alın.' 
                : 'Mezun veya akademisyen olarak tecrübelerinizi öğrencilerle paylaşın.'}
            </p>
            <button
              onClick={() => {
                if (userRole === 'student') setView('career_network');
                else setShowMentorshipModal(true);
              }}
              className="w-full py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl text-[13px] font-bold transition-colors cursor-pointer"
            >
              {userRole === 'student' ? 'Mentorları İncele' : 'Mentorluk Başvurusu Yap'}
            </button>
          </div>

          {/* Öğrenci Bilgi Düzenleme shortcut */}
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
              onClick={() => setView('mbs')} 
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

        {/* All News Modal (Stitch Protocol) */}
        {showAllNewsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            {/* Premium Blurred Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAllNewsModal(false)}></div>
            
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl relative z-10 flex flex-col overflow-hidden border border-slate-100/50 transform transition-all">
              {/* Header */}
              <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#990000] flex items-center justify-center shadow-inner">
                    <Newspaper size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">KGM Haber Merkezi</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1"><Sparkles size={12} className="text-amber-500" /> Kariyer, etkinlik ve kampüs haberleri</p>
                  </div>
                </div>
                <button onClick={() => setShowAllNewsModal(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-[#990000] transition-colors cursor-pointer">
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { id: 'h1', title: 'Yeni Kariyer Fuarı Duyuruldu', time: '12 saat önce', readers: '4.2B okuyucu', category: 'Fuar', summary: 'İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi tarafından düzenlenen 2026 Ulusal Kariyer Fuarı için kayıtlar başladı. 50+ lider savunma, bilişim ve sanayi firması kampüsümüzde stajyer ve mezun adaylarla buluşuyor.', location: 'Ana Kampüs Konferans Salonu', date: '15 Nisan 2026' },
                    { id: 'h2', title: 'Yapay Zeka ve İstihdam Raporu', time: '1 gün önce', readers: '3.1B okuyucu', category: 'Rapor', summary: 'İESÜ Araştırma OS Merkezi tarafından hazırlanan 2026 Yapay Zeka ve Geleceğin Meslekleri raporu yayımlandı. Rapor, veri analitiği, istem mühendisliği ve yapay zeka entegrasyonunun mezun istihdamındaki %45 artışını belgeliyor.', location: 'İESÜ Ar-Ge OS Merkezi', date: '10 Nisan 2026' },
                    { id: 'h3', title: 'Mezunlar Zirvesi Başlıyor', time: '2 gün önce', readers: '8.4B okuyucu', category: 'Zirve', summary: 'Geleneksel İESÜ Mezunlar ve Sektör Zirvesi bu yıl hibrit katılım modeliyle kapılarını açıyor. Türkiye ve dünyadaki mezunlarımız deneyimlerini aktif öğrencilerimizle paylaşacak.', location: 'İESÜ Kültür Merkezi & Online Stream', date: '22 Nisan 2026' },
                    { id: 'h4', title: 'Yurtdışı Staj Programları', time: '3 gün önce', readers: '5.2B okuyucu', category: 'Staj', summary: 'Erasmus+ ve uluslararası konsorsiyum ortaklıkları çerçevesinde 2026-2027 dönemi yurt dışı zorunlu/gönüllü staj başvuruları ve hibe kontenjanları açıklandı.', location: 'Dış İlişkiler & Erasmus Ofisi', date: '01 Mayıs 2026' }
                  ].map((item, idx) => (
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
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider group-hover:bg-red-50 group-hover:text-[#990000] transition-colors">{item.category}</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={12} /> {item.time}</span>
                        </div>
                        <h3 className="text-[15px] font-black text-slate-900 leading-snug mb-2 group-hover:text-[#990000] transition-colors">{item.title}</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{item.summary}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5"><Users size={12} /> {item.readers}</span>
                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#990000] group-hover:text-white transition-colors">
                          <ArrowRight size={12} strokeWidth={3} />
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
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl" onClick={() => setSelectedNewsItem(null)}></div>
            <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh] border border-slate-100">
              
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
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => { setSelectedNewsItem(null); setView('haberler'); }}
                  className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  Tüm Haberler Paneline Git <ArrowRight size={14} />
                </button>
                <button 
                  onClick={() => setSelectedNewsItem(null)}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
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
                    const storedMentorships = JSON.parse(localStorage.getItem('igu_mentorships_v2')) || [];
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
      {/* FLOATING DOCK (VIBRANT MULTI-COLOR MODERN GLASS THEME) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-indigo-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(30,41,59,0.18)] flex items-center justify-between px-4 text-gray-800">
          
          {/* HOME - BLUE */}
          <button onClick={() => setActiveTab('feed')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'feed' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}`} title="Akış">
            <Home size={24} strokeWidth={2.2} />
          </button>
          
          {/* JOBS - PURPLE */}
          <button onClick={() => setView('jobs')} className="p-2.5 rounded-full transition-all flex items-center justify-center text-slate-600 hover:text-purple-600 hover:bg-purple-50" title="İlanlar">
            <Briefcase size={22} strokeWidth={2} />
          </button>
          
          {/* CENTER: SEARCH ICON (VIBRANT GRADIENT ORANGE/CORAL) */}
          <button onClick={() => { setActiveTab('search'); setTimeout(() => document.getElementById('main-search')?.focus(), 100); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50" title="Ara">
            <Search size={22} strokeWidth={2.8} />
          </button>
          
          {/* SURVEYS - EMERALD GREEN */}
          {featureSurveys && (
            <button onClick={() => setActiveTab('surveys')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'surveys' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'}`} title="Anketler">
              <ClipboardList size={22} strokeWidth={2} />
            </button>
          )}
          
          {/* MESSAGES - PINK/INDIGO */}
          <button onClick={() => setView('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'messaging' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'}`} title="Mesajlar">
            <MessageCircle size={22} strokeWidth={2} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button 
            onClick={() => setView('user_profile')} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-indigo-400/60 shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden" 
            title="Profilim"
          >
            {currentUser?.role === 'admin' ? (
              <Logo size="sm" className="w-full h-full justify-center" />
            ) : (
              <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=4F46E5&color=fff`} className="w-full h-full rounded-full object-cover" alt="Profile" />
            )}
          </button>
        </div>
      </div>
      
      {/* CAREER SHORTS FULLSCREEN MODAL */}
      {showShorts && <CareerShorts setView={setView} onClose={() => setShowShorts(false)} />}
      
      {/* INTERACTIVE FOOTER MODALS */}
      <FooterModals activeModal={footerModal} onClose={() => setFooterModal(null)} setView={setView} />
    </div>
  );
}







