import React, { useState, useMemo } from 'react';
import { Search, Bell, MessageCircle, Briefcase, Bookmark, Heart, Send, Plus, Users, Compass, UserCircle2, MoreHorizontal, X, ClipboardList, Building2, Settings, ShieldCheck, Crown, CheckCircle2, LayoutDashboard, Calendar, Home, Star, UserCheck, ArrowRight, FileText, Wand2, UserPlus, Target, MapPin, Share2 } from 'lucide-react';
import JobsAndInternships from './JobsAndInternships';
import MessagingInterface from './MessagingInterface';
import ApplicationsPanel from './ApplicationsPanel';
import PostComposer from './PostComposer';
import PostCard from './PostCard';

import { combineFeedItems } from '../utils/feedCombiner';
import CareerNetwork from './CareerNetwork';
import GroupsPanel from './GroupsPanel';
import NotificationsPanel from './NotificationsPanel';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import CalendarPlanning from './CalendarPlanning';
import AICVBuilder from './AICVBuilder';
import NavIcon from './shared/NavIcon';
import ClubsDirectory from './ClubsDirectory';
import CareerShorts from './CareerShorts';
import StoriesBar from './StoriesBar';

export default function StudentFeed({ setView, setSelectedUserId, notifications = [], setNotifications, posts, setPosts, stories, setStories, surveys, userRole, news, events, students, alumni, companies, currentUser, featuredOpportunities, mentorships, voluntaryInternships, messages, setMessages, applications, setApplications, jobs, academicStaff, announcements, academicRole, groups, setGroups, setSelectedGroupId, featureClubsShowcase, featureClubApplications, clubs, setClubs, clubApplications, setClubApplications }) {
  const [activeTab, setActiveTab] = useState('feed'); // feed, jobs, network
  const [showShorts, setShowShorts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllConnections, setShowAllConnections] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const getManagedClubs = useMemo(() => {
    try {
      const clubsData = clubs || [];
      return clubsData.filter(c => c.presidentId === currentUser?.id || (c.admins || []).includes(currentUser?.id));
    } catch {
      return [];
    }
  }, [clubs, currentUser?.id]);
  const isClubAdmin = getManagedClubs.length > 0;



  return (
    <div className="min-h-screen bg-transparent font-sans">
      {/* Hyper-Modern Navbar (Glassmorphism) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* LEFT: Star Icon for Post Creation */}
          <button onClick={() => setActiveTab('create_post')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-gray-100 ${activeTab === 'create_post' ? 'text-iesu-red bg-red-50' : 'text-gray-600'}`} title="Gönderi Düzenle/Paylaş">
            <Star size={24} strokeWidth={activeTab === 'create_post' ? 2.5 : 2} className={activeTab === 'create_post' ? 'fill-current text-iesu-red/10' : ''} />
          </button>
          
          {/* CENTER: Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>
          
          {/* RIGHT: Heart Icon for Notifications */}
          <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-gray-100 text-gray-600`} title="Bildirimler">
            <div className="relative">
              <Bell size={24} strokeWidth={2} />
              {((notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length > 0) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </div>
          </button>
          
        </div>
      </nav>

      {/* Main Container - 3 Column Layout */}
      <div className="pt-24 max-w-[1400px] mx-auto px-4 flex justify-center gap-6 pb-32 relative">
        
        {/* LEFT PANEL: Club Radar & Profile Stats */}
        <div className="hidden xl:block w-[280px] shrink-0 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <Compass className="text-iesu-red" size={20} /> Trend Kulüpler
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">Y</div>
                <div>
                  <h4 className="font-bold text-[14px] text-gray-900">Yazılım Kulübü</h4>
                  <p className="text-[12px] text-gray-500 flex items-center gap-1"><UserCircle2 size={12}/> 342 Üye</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold">G</div>
                <div>
                  <h4 className="font-bold text-[14px] text-gray-900">Girişimcilik</h4>
                  <p className="text-[12px] text-gray-500 flex items-center gap-1"><Star size={12}/> Onaylı Kulüp</p>
                </div>
              </div>
            </div>
            <button onClick={() => setView('club_portal')} className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition">Tüm Kulüpleri Gör</button>
          </div>
        </div>

        {/* CENTER PANEL: Main Feed */}
        <div className="w-full max-w-2xl shrink-0 flex flex-col gap-6">
        {activeTab === 'feed' && (
          <div className="w-full shrink-0 space-y-6 animate-fade-in">
            
            {/* STORIES */}
            <StoriesBar currentUser={currentUser} stories={stories} setStories={setStories} />
            
            {/* POST COMPOSER */}
            <PostComposer currentUser={currentUser} setPosts={setPosts} />

          {/* FEED POSTS */}
          <div className="space-y-6">
            {(() => {
              const allItems = React.useMemo(() => combineFeedItems(posts, events, news, announcements, jobs), [posts, events, news, announcements, jobs]);
              const filtered = React.useMemo(() => allItems.filter(post => post.content?.toLowerCase().includes(searchQuery.toLowerCase()) || post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())), [allItems, searchQuery]);
              
              if (filtered.length === 0) {
                return (
              <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-[var(--brand-soft-red)] rounded-2xl flex items-center justify-center mb-4 text-[var(--brand-coral)]">
                  <FileText size={32} />
                </div>
                <h3 className="text-gray-900 font-black text-lg mb-2">Henüz görüntülenecek yayın bulunmuyor.</h3>
                <p className="text-gray-500 font-medium text-sm mb-6 max-w-sm">
                  Duyuru, etkinlik, staj ve mentorluk içerikleri yayınlandığında burada görünecek.
                </p>
                {userRole === 'admin' && (
                  <div className="flex flex-wrap justify-center gap-2">
                    <button onClick={() => setView('admin')} className="px-4 py-2 bg-iesu-red/10 text-iesu-red hover:bg-iesu-red hover:text-white rounded-xl text-xs font-bold transition">Yeni Duyuru Yayınla</button>
                    <button onClick={() => setView('admin')} className="px-4 py-2 bg-iesu-red/10 text-iesu-red hover:bg-iesu-red hover:text-white rounded-xl text-xs font-bold transition">Yeni Etkinlik Ekle</button>
                    <button onClick={() => setView('admin')} className="px-4 py-2 bg-iesu-red/10 text-iesu-red hover:bg-iesu-red hover:text-white rounded-xl text-xs font-bold transition">Yeni İş İlanı Ekle</button>
                  </div>
                )}
              </div>
              );
              }
              
              return filtered.map(post => (
                <PostCard key={post.id} post={post} currentUser={currentUser} setMessages={setMessages} students={students || []} alumni={alumni || []} setPosts={setPosts} />
              ));
            })()}
          </div>

        </div>
        )}

        {/* Search Native View */}
        {activeTab === 'search' && (
          <div className="bg-white rounded-3xl w-full p-6 shadow-[var(--shadow-soft)] border border-[var(--border-soft)] animate-fade-in mb-6 min-h-[75vh]">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Search className="text-iesu-red" size={24} strokeWidth={2.5} /> Arama ve Keşfet
            </h2>
            <div className="relative group w-full mb-8">
              <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-iesu-red transition-colors" size={20} />
              <input 
                id="main-search"
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={userRole === 'admin' ? "Öğrenci, mezun, firma, ilan veya başvuru ara..." : "İlan, staj, etkinlik veya mentorluk ara..."} 
                className="bg-gray-50 pl-12 pr-4 py-3.5 rounded-2xl text-[15px] w-full focus:outline-none focus:ring-2 focus:ring-iesu-red/20 border border-gray-200 transition-all shadow-inner" 
              />
            </div>
            
            <div className="text-center text-gray-500 py-12 mt-12 border-2 border-dashed border-gray-100 rounded-3xl">
              <Compass size={48} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
              <h3 className="text-lg font-bold text-gray-700 mb-2">Keşfetmeye Başlayın</h3>
              <p className="max-w-sm mx-auto text-sm">Öğrenciler, İlanlar, Firmalar veya Etkinlikleri aramak için yukarıdaki alanı kullanın.</p>
            </div>
          </div>
        )}

        {/* Create Post Native View */}
        {activeTab === 'create_post' && (
          <div className="bg-white rounded-3xl w-full p-4 sm:p-6 shadow-[var(--shadow-soft)] border border-[var(--border-soft)] animate-fade-in mb-6">
             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Star className="text-iesu-red fill-current" size={24} /> Gönderi Paylaş & Düzenle
             </h2>
             <PostComposer currentUser={currentUser} userRole={userRole} posts={posts} setPosts={setPosts} />
          </div>
        )}

          {activeTab === 'career_network' && (
            <CareerNetwork companies={companies} events={events} academicStaff={academicStaff} setView={setView} setSelectedUserId={setSelectedUserId} />
          )}

        {/* Applications Interface Overlay */}
        {activeTab === 'applications' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl animate-fade-in relative">
              <button 
                onClick={() => setActiveTab('feed')}
                className="absolute top-4 right-4 z-50 p-2 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full shadow-md transition border border-gray-100"
              >
                <X size={20} />
              </button>
              <div className="p-4 sm:p-6">
                <ApplicationsPanel 
                  applications={applications} 
                  setApplications={setApplications} 
                  jobs={jobs} 
                  currentUser={currentUser || { id: 'std-1', name: 'Öğrenci', avatar: 'https://ui-avatars.com/api/?name=O&background=132A49&color=fff' }} 
                  userRole="student" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Messaging Interface Overlay */}
        {activeTab === 'messaging' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/40 flex items-end sm:items-center justify-center p-0 sm:p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl h-[95vh] sm:h-[85vh] sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col shadow-2xl animate-slide-up sm:animate-fade-in relative">
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
                messages={messages} 
                setMessages={setMessages} 
                currentUser={currentUser} 
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
            <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in relative">
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
            <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in relative">
              <button 
                onClick={() => setActiveTab('feed')}
                className="absolute top-4 right-4 z-50 p-2 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full shadow-md transition border border-gray-100"
              >
                <X size={20} />
              </button>
              <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                <AICVBuilder currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} messages={messages} setMessages={setMessages} academicRole={academicRole} />
              </div>
            </div>
          </div>
        )}

        {/* CLUBS TAB */}
        {featureClubsShowcase && activeTab === 'clubs' && (
          <div className="w-full shrink-0 animate-fade-in mb-6">
            <ClubsDirectory clubs={clubs} setClubs={setClubs} clubApplications={clubApplications} setClubApplications={setClubApplications} currentUser={currentUser} featureClubApplications={featureClubApplications} />
          </div>
        )}

      </div> {/* END CENTER PANEL */}

        {/* RIGHT PANEL: Networking & Vision */}
        <div className="hidden lg:block w-[320px] shrink-0 space-y-6">
          
          {/* Kulüpler Vitrini */}
          {featureClubsShowcase && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="font-black text-emerald-900 mb-4 flex items-center gap-2">
                <Target className="text-emerald-500" size={20} /> Öğrenci Kulüpleri
              </h3>
              <p className="text-sm text-emerald-700 font-medium mb-4">Sosyalleşin, yeteneklerinizi geliştirin ve üniversite hayatını dolu dolu yaşayın.</p>
              
              <div className="flex -space-x-2 mb-5">
                {(clubs || []).slice(0, 4).map((club, idx) => (
                  <img key={idx} src={club.logo} alt={club.name} title={club.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                ))}
                {(clubs || []).length > 4 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold z-10">
                    +{clubs.length - 4}
                  </div>
                )}
              </div>

              <button 
                onClick={() => { setView('club_portal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-md flex justify-center"
              >
                Tüm Kulüpleri Gör
              </button>
            </div>
          )}
          
          {/* Önerilen Bağlantılar */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <Users className="text-blue-500" size={20} /> Önerilen Bağlantılar
            </h3>
            <div className="space-y-4">
              {(alumni || []).slice(0, 3).map((person, index) => (
                <div key={`alumni-${index}`} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 cursor-pointer transition">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&color=fff`} className="w-12 h-12 rounded-full object-cover" alt={person.name} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[13px] text-gray-900 truncate">{person.name}</h4>
                    <p className="text-[11px] text-gray-500 truncate">{person.department || 'Mezun'}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); window.toast.success("Bağlantı isteği gönderildi!"); }} className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition">
                    <UserPlus size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowAllConnections(true)} className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition">Tümünü Gör</button>
          </div>

          {/* Öne Çıkan Firmalar */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="text-iesu-red" size={20} /> Öne Çıkan Firmalar
            </h3>
            <div className="space-y-4">
              {(companies || []).slice(0, 3).map((company, index) => (
                <div key={`company-${index}`} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 cursor-pointer transition">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center p-2">
                    <Building2 className="text-gray-400" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[13px] text-gray-900 truncate">{company.name}</h4>
                    <p className="text-[11px] text-gray-500 truncate">{company.sector || 'Sektör Lideri'}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedCompany(company); }} className="text-xs font-bold text-iesu-red hover:text-red-700 transition">İncele</button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* FLOATING DOCK (INSTAGRAM STYLE - LIGHT/BRAND THEME) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[380px]">
        <div className="bg-white/90 backdrop-blur-2xl border border-gray-200/50 p-2 sm:p-2.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-between px-3">
          <button onClick={() => setActiveTab('feed')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'feed' ? 'text-iesu-red' : 'text-gray-400 hover:text-gray-900'}`} title="Akış">
            <Home size={26} strokeWidth={activeTab === 'feed' ? 2.5 : 2} className={activeTab === 'feed' ? 'fill-current text-iesu-red/10' : ''} />
          </button>
          
          <button onClick={() => setView('jobs')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'jobs' ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-900'}`} title="İlanlar">
            <Briefcase size={24} strokeWidth={activeTab === 'jobs' ? 2.5 : 2} />
          </button>
          
          {/* CENTER: SEARCH ICON */}
          <button onClick={() => { setActiveTab('search'); setTimeout(() => document.getElementById('main-search')?.focus(), 100); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-iesu-red to-iesu-coral text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0" title="Ara">
            <Search size={24} strokeWidth={2.5} />
          </button>
          
          {/* MESSAGES */}
          <button onClick={() => setActiveTab('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'messaging' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-900'}`} title="Mesajlar">
            <MessageCircle size={24} strokeWidth={activeTab === 'messaging' ? 2.5 : 2} className={activeTab === 'messaging' ? 'fill-current text-blue-500/10' : ''} />
          </button>
          
          {/* CLUB ADMIN */}
          <button onClick={() => setView('club_admin')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'club_admin' ? 'text-emerald-500 bg-emerald-50' : 'text-emerald-400 hover:text-emerald-600'}`} title="Kulüp Yönetim Paneli">
            <Crown size={24} strokeWidth={activeTab === 'club_admin' ? 2.5 : 2} className={activeTab === 'club_admin' ? 'fill-current text-emerald-500/20' : ''} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button onClick={() => {
            if (setSelectedUserId) setSelectedUserId(currentUser?.id || 'std-1');
            setView('user_profile');
          }} className="p-1 rounded-full transition-all flex items-center justify-center border-2 border-transparent hover:border-gray-200" title="Profilim">
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Öğrenci')}&background=132A49&color=fff`} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>

      {/* CAREER SHORTS FULLSCREEN MODAL */}
      {showShorts && <CareerShorts setView={setView} onClose={() => setShowShorts(false)} />}
      {/* All Connections Modal */}
      {showAllConnections && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowAllConnections(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden relative z-10 animate-fade-in flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-xl text-gray-900 flex items-center gap-2"><Users className="text-blue-500"/> Önerilen Bağlantılar</h3>
              <button onClick={() => setShowAllConnections(false)} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-700 transition"><X size={18}/></button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3 flex-1">
              {(alumni || []).map((person, index) => (
                <div key={`modal-alumni-${index}`} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&color=fff`} className="w-14 h-14 rounded-full object-cover shadow-sm" alt={person.name} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[15px] text-gray-900 truncate">{person.name}</h4>
                    <p className="text-[13px] text-gray-500 truncate">{person.department || 'Mezun'}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{person.company || 'Açık İş Arıyor'}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); window.toast.success("Bağlantı isteği gönderildi!"); }} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs transition flex items-center gap-1">
                    <UserPlus size={14} /> Bağlan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Company Profile Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedCompany(null)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-fade-in flex flex-col">
            <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900 relative">
              <button onClick={() => setSelectedCompany(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center text-white transition"><X size={18}/></button>
            </div>
            <div className="px-8 pb-8">
              <div className="flex justify-between items-end -mt-12 mb-6">
                <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                  <Building2 className="text-gray-300" size={40} />
                </div>
                <button onClick={() => window.toast.success("Firmayı takip etmeye başladınız!")} className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-md">Takip Et</button>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">{selectedCompany.name}</h2>
              <p className="text-gray-500 font-medium mb-6 flex items-center gap-2"><MapPin size={16}/> İstanbul, Türkiye • {selectedCompany.sector || 'Teknoloji'}</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[15px] font-black text-gray-900 mb-2">Hakkımızda</h4>
                  <p className="text-[14px] text-gray-600 leading-relaxed">{selectedCompany.description || "Şirket profili ve detaylı bilgileri en kısa sürede eklenecektir. Yenilikçi projelerimizde yer almak için ilanlarımızı takip edin."}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[11px] text-gray-500 font-bold uppercase mb-1">Çalışan Sayısı</p>
                    <p className="font-black text-gray-900">50-200</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[11px] text-gray-500 font-bold uppercase mb-1">Açık İlanlar</p>
                    <p className="font-black text-iesu-red">3 İlan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


