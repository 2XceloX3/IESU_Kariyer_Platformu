import React, { useState } from 'react';
import { Search, Bell, MessageCircle, Briefcase, Bookmark, Heart, Send, Plus, Users, Compass, UserCircle2, MoreHorizontal, ChevronRight, Calendar, MapPin, X, FileText, ShieldCheck, Crown, CheckCircle2, LayoutDashboard, Home, Wand2 } from 'lucide-react';
import Logo from './Logo';
import MessagingInterface from './MessagingInterface';
import CareerShorts from './CareerShorts';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import CareerNetwork from './CareerNetwork';
import GroupProfile from './GroupProfile';

import { combineFeedItems } from '../utils/feedCombiner';
import TopProfileMenu from './TopProfileMenu';
import ApplicationsPanel from './ApplicationsPanel';
import NavIcon from './shared/NavIcon';

export default function CompanyFeed({ setView, setSelectedUserId, notifications = [], setNotifications, posts, setPosts, stories, setStories, surveys, news, events, students, alumni, companies, messages, setMessages, applications, setApplications, jobs, announcements, academicStaff, currentUser, userRole, academicRole, groups, setGroups, setSelectedGroupId }) {
  const [activeTab, setActiveTab] = useState('feed'); // feed, jobs, network
  const [showShorts, setShowShorts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sağ menü networking önerileri
  const networkSuggestions = [
    ...(alumni || []).map(a => ({ name: a.name, title: a.department, badge: "Mezun" })),
    ...(students || []).map(s => ({ name: s.name, title: s.department, badge: "Öğrenci" }))
  ].slice(0, 5);

  return (
    <div className="min-h-screen bg-transparent font-sans">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-10"></div> {/* Spacer */}
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden sm:block text-center">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-red-50 text-iesu-red`} title="Bildirimler">
              <div className="relative">
                <Heart size={24} strokeWidth={2.5} className="fill-current text-iesu-red/10" />
                {((notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>
            <TopProfileMenu currentUser={currentUser || { name: 'Firma', avatar: 'https://ui-avatars.com/api/?name=Firma&background=2563EB&color=fff' }} userRole={userRole || 'company'} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} currentView="company" />
          </div>
        </div>
      </nav>

      <div className="pt-24 max-w-6xl mx-auto px-4 flex justify-center gap-6 pb-20">
        
        {/* LEFT PANEL */}
        <div className="hidden lg:block w-[300px] shrink-0">
          <div className="sticky top-24 bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
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
                <h2 className="text-[16px] font-black text-gray-900 mt-4 leading-tight">Kariyer Geliştirme Ofisi</h2>
                <p className="text-[12px] font-bold text-orange-600 mt-1 uppercase tracking-wider">SÜPER YÖNETİCİ</p>
                
                <div className="mt-6 flex flex-col gap-2 text-left bg-gray-50 p-3 rounded-2xl">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sistem Yetkileri</p>
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
                <div className="text-center">
                  <div className="relative inline-block">
                    <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Firma')}&background=2563EB&color=fff`} className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto object-cover" alt="Profile" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 mt-4">{currentUser?.name || 'Firma Adı'}</h2>
                  <p className="text-[13px] font-medium text-gray-500 mt-1">
                    {currentUser?.sector || 'Sektör Bilgisi Yok'}
                  </p>
                </div>

                <div className="mt-8 flex justify-between text-center px-2">
                  <div>
                    <p className="font-black text-xl text-gray-900">45</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Görüntülenme</p>
                  </div>
                  <div className="w-px bg-gray-200"></div>
                  <div>
                    <p className="font-black text-xl text-gray-900">12</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Başvuru</p>
                  </div>
                </div>

                <div className="mt-8">
                  <button onClick={() => setView('create_job')} className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Plus size={18} /> Yeni İlan Oluştur
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CENTER PANEL */}
        <div className="flex-1 max-w-[600px] w-full min-w-0">
          
          {activeTab === 'feed' && (
            <>
              <PostComposer currentUser={currentUser} userRole={userRole} posts={posts} setPosts={setPosts} />
              
              <div className="space-y-6">
            {(() => {
              const allItems = combineFeedItems(posts, events, news, announcements, jobs);
              const filtered = allItems.filter(post => post.content?.toLowerCase().includes(searchQuery.toLowerCase()) || post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
              
              if (filtered.length === 0) {
                return (
                  <div className="p-10 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-red-50 text-iesu-red rounded-2xl flex items-center justify-center mb-6 shadow-sm"><FileText size={32} /></div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Henüz görüntülenecek yayın bulunmuyor.</h3>
                    <p className="text-sm text-gray-500 font-medium max-w-sm leading-relaxed">Duyuru, etkinlik, staj ve mentorluk içerikleri yayınlandığında burada görünecek.</p>
                  </div>
                );
              }
              
              return filtered.map(post => (
                <PostCard key={post.id} post={post} currentUser={currentUser} setMessages={setMessages} students={students || []} alumni={alumni || []} setPosts={setPosts} />
              ));
            })()}
              </div>
            </>
          )}

          {activeTab === 'career_network' && (
            <CareerNetwork companies={companies} events={events} setView={setView} setSelectedUserId={setSelectedUserId} />
          )}

        </div>

        {/* RIGHT PANEL */}
        <div className="hidden xl:block w-[300px] shrink-0 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
            <h3 className="font-black text-gray-900 mb-2">Firma Profili</h3>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-4">Profiliniz %60 oranında tamamlandı.</p>
            <button onClick={() => setView('company_profile')} className="w-full py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl text-[13px] font-bold transition-colors">Profili Güncelle</button>
          </div>

          <div className="sticky top-24 bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <Users size={18} className="text-blue-500" /> Yetenekleri Keşfedin
            </h3>
            
            <div className="space-y-4">
              {(networkSuggestions || []).map((person, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <img src={`https://ui-avatars.com/api/?name=${person.name}&background=random&color=fff`} className="w-12 h-12 rounded-full object-cover" alt={person.name} />
                  <div className="flex-grow">
                    <p className="text-[13px] font-bold text-gray-900 line-clamp-1">{person.name}</p>
                    <p className="text-[11px] text-gray-500 line-clamp-1 font-medium">{person.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {activeTab === 'jobs' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl relative">
              <button onClick={() => setActiveTab('feed')} className="absolute top-4 right-4 z-50 p-2 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full shadow-md transition border border-gray-100">
                <X size={20} />
              </button>
              <div className="p-4">
                <ApplicationsPanel 
                  applications={applications} 
                  setApplications={setApplications} 
                  jobs={jobs} 
                  currentUser={currentUser || { id: 'cmp-1', name: 'Kayıtlı Firma' }} 
                  userRole="company" 
                />
              </div>
            </div>
          </div>
        )}

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
                currentUser={currentUser || { id: 'cmp-1', name: 'Örnek Firma', avatar: 'https://ui-avatars.com/api/?name=Firma&background=2563EB&color=fff' }} 
                userRole="company" 
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

      </div>
      {/* FLOATING DOCK (INSTAGRAM STYLE - LIGHT/BRAND THEME) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[380px]">
        <div className="bg-white/90 backdrop-blur-2xl border border-gray-200/50 p-2 sm:p-2.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-between px-3">
          <button onClick={() => setActiveTab('feed')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'feed' ? 'text-iesu-red' : 'text-gray-400 hover:text-gray-900'}`} title="Akış">
            <Home size={26} strokeWidth={2} />
          </button>
          
          <button onClick={() => setView('jobs')} className="p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900" title="İlanlar">
            <Briefcase size={24} strokeWidth={2} />
          </button>
          
          {/* CENTER: SEARCH ICON */}
          <button onClick={() => { setActiveTab('search'); setTimeout(() => document.getElementById('main-search')?.focus(), 100); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-600 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0" title="Ara">
            <Search size={24} strokeWidth={2.5} />
          </button>
          
          {/* MESSAGES */}
          <button onClick={() => setActiveTab('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'messaging' ? 'text-iesu-red' : 'text-gray-400 hover:text-gray-900'}`} title="Mesajlar">
            <MessageCircle size={24} strokeWidth={2} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button onClick={() => setView('user_profile')} className="p-1 rounded-full transition-all flex items-center justify-center border-2 border-transparent hover:border-gray-200" title="Profilim">
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=Firma&background=2563EB&color=fff`} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>
      
      {/* CAREER SHORTS FULLSCREEN MODAL */}
      {showShorts && <CareerShorts setView={setView} onClose={() => setShowShorts(false)} />}
    </div>
  );
}


