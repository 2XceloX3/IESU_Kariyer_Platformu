import React, { useState } from 'react';
import { Search, Bell, MessageCircle, Briefcase, Bookmark, Heart, Send, Plus, Users, Compass, UserCircle2, MoreHorizontal, X, ClipboardList, Building2, Settings, ShieldCheck, Crown, CheckCircle2, LayoutDashboard, Calendar, Home, Star, UserCheck, ArrowRight, FileText, Wand2 } from 'lucide-react';
import JobsAndInternships from './JobsAndInternships';
import MessagingInterface from './MessagingInterface';
import ApplicationsPanel from './ApplicationsPanel';
import PostComposer from './PostComposer';
import PostCard from './PostCard';

import { combineFeedItems } from '../utils/feedCombiner';
import CareerRadar from './CareerRadar';
import CareerNetwork from './CareerNetwork';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import CalendarPlanning from './CalendarPlanning';
import AICVBuilder from './AICVBuilder';

export default function StudentFeed({ setView, setSelectedUserId, notifications = [], setNotifications, posts, setPosts, surveys, userRole, news, events, students, alumni, companies, currentUser, featuredOpportunities, mentorships, messages, setMessages, applications, setApplications, jobs, academicStaff, announcements, academicRole }) {
  const [activeTab, setActiveTab] = useState('feed'); // feed, jobs, network
  const [searchQuery, setSearchQuery] = useState('');

  const NavIcon = ({ icon, label, badge, active, onClick }) => {
    const getClasses = () => {
      switch (label) {
        case 'Akış': return { text: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-500', glow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]' };
        case 'Kariyer Ağı': return { text: 'text-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-500', glow: 'drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]' };
        case 'İş ve Staj': return { text: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-500', glow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]' };
        case 'Topluluklar': return { text: 'text-teal-500', bg: 'bg-teal-50', badge: 'bg-teal-500', glow: 'drop-shadow-[0_0_12px_rgba(20,184,166,0.8)]' };
        case 'Mesajlar': return { text: 'text-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-500', glow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' };
        case 'Bildirimler': return { text: 'text-rose-500', bg: 'bg-rose-50', badge: 'bg-rose-500', glow: 'drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]' };
        default: return { text: 'text-iesu-red', bg: 'bg-red-50', badge: 'bg-iesu-red', glow: 'drop-shadow-[0_0_12px_rgba(220,38,38,0.8)]' };
      }
    };
    const c = getClasses();
    return (
      <button 
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-14 rounded-2xl transition-all duration-500 group ${active ? `${c.bg} ${c.text} shadow-sm` : `text-gray-400 hover:${c.text} hover:${c.bg}`}`}
        title={label}
      >
        {React.cloneElement(icon, { size: active ? 22 : 20, className: `mb-1 transition-all duration-500 ${active ? `scale-110 ${c.glow}` : `group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:${c.glow}`}` })}
        <span className={`text-[9px] font-bold tracking-wide transition-all duration-500 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block'}`}>
          {label}
        </span>
        {badge > 0 && (
          <span className={`absolute top-1 right-2 sm:right-3 w-4 h-4 ${c.badge} text-white text-[9px] flex items-center justify-center rounded-full font-bold shadow-sm ring-2 ring-white`}>
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-transparent font-sans">
      {/* Hyper-Modern Navbar (Glassmorphism) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* LEFT: Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView(userRole === 'admin' ? 'student' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden lg:block">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Merkeziüğü</p>
            </div>
          </div>
          {/* MIDDLE: Search Bar */}
          <div className="hidden md:flex relative group flex-1 max-w-md mx-auto shrink">
            <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-iesu-red transition-colors" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={userRole === 'admin' ? "Öğrenci, mezun, firma, ilan veya başvuru ara..." : "İlan, staj, etkinlik veya mentorluk ara..."} 
              className="bg-gray-100/80 pl-10 pr-4 py-2 rounded-2xl text-[14px] w-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-iesu-coral/20 transition-all" 
            />
          </div>
          
          {/* RIGHT: Navigation Icons & Profile */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <NavIcon icon={<Home />} label="Akış" active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />
            <NavIcon icon={<Compass />} label="Kariyer Ağı" active={activeTab === 'career_network'} onClick={() => setActiveTab('career_network')} />
            <NavIcon icon={<Users />} label="Topluluklar" active={false} onClick={() => setView('groups')} />
            <NavIcon icon={<Briefcase />} label="İş ve Staj" active={false} onClick={() => setView('jobs')} />
            <NavIcon 
              icon={<MessageCircle />} 
              label="Mesajlar" 
              badge={messages?.filter(m => m.receiverId === currentUser?.id && !m.read).length || 0} 
              active={activeTab === 'messaging'} 
              onClick={() => setActiveTab('messaging')} 
            />
            <NavIcon 
              icon={<Bell />} 
              label="Bildirimler" 
              badge={(notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length || 0} 
              active={activeTab === 'notifications'} 
              onClick={() => setView('notifications')} 
            />
            
            <TopProfileMenu currentUser={currentUser || { name: 'Öğrenci', avatar: 'https://ui-avatars.com/api/?name=Sen&background=132A49&color=fff' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} currentView="student" />
          </div>
        </div>
      </nav>

      {/* Main Container - Padded for Navbar */}
      <div className="pt-24 max-w-6xl mx-auto px-4 flex justify-center gap-6 pb-20">
        
        {/* LEFT PANEL: Profile (Fast Access) */}
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
                <h2 className="text-[16px] font-black text-gray-900 mt-4 leading-tight">Kariyer Merkezi</h2>
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
              <div className="text-center">
                <div className="relative inline-block">
                  <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Öğrenci')}&background=132A49&color=fff`} className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto object-cover" alt="Profile" />
                  <button className="absolute bottom-0 right-0 bg-iesu-red text-white p-1.5 rounded-full shadow-md hover:bg-iesu-darkRed transition">
                    <Plus size={16} />
                  </button>
                </div>
                <h2 className="text-lg font-black text-gray-900 mt-4">{userRole === 'admin' ? 'Kariyer Merkezi' : (currentUser?.name || 'Öğrenci')}</h2>
                <p className="text-[13px] font-medium text-gray-500 mt-1">
                  {userRole === 'admin' ? (academicRole === 'super_admin' ? 'Süper Yönetici' : 'Yönetim Ekibi') : 
                  `${currentUser?.department || 'Bölüm Bilgisi Yok'}, ${currentUser?.year || 'Sınıf Bilgisi Yok'}`}
                </p>
                
                <div className="mt-8 flex justify-between text-center px-2">
                  <div>
                    <p className="text-2xl font-black text-gray-900">{currentUser?.connections || 0}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">Bağlantı</p>
                  </div>
                  <div className="w-px bg-gray-200"></div>
                  <div>
                    <p className="text-2xl font-black text-iesu-coral">{currentUser?.cvViews || 0}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">CV Gösterimi</p>
                  </div>
                </div>

                <button onClick={() => setView('profile_update')} className="mt-8 w-full bg-gray-900 hover:bg-black text-white text-[14px] font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-[0.98]">
                  Profilini Görüntüle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CENTER PANEL: Stories & Feed */}
        <div className="w-full max-w-[600px] shrink-0 space-y-6">
          
          {/* PROFESSIONAL HIGHLIGHTS */}
          <CareerRadar announcements={announcements} events={events} jobs={jobs} setView={setView} />

          {/* CREATE POST (Quick Action) */}
          <PostComposer currentUser={currentUser} userRole={userRole} posts={posts} setPosts={setPosts} />

          {/* FEED POSTS */}
          <div className="space-y-6">
            {(() => {
              const allItems = combineFeedItems(posts, events, news, announcements, jobs);
              const filtered = allItems.filter(post => post.content?.toLowerCase().includes(searchQuery.toLowerCase()) || post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
              
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

        {/* RIGHT PANEL: Dynamic Data */}
        <div className="hidden xl:block w-[300px] shrink-0 space-y-6">
          
          {userRole === 'admin' ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2"><ClipboardList size={18} className="text-iesu-coral" /> Yönetim Özeti</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bekleyen Firma Onayları</p>
                    <p className="text-xl font-black text-gray-900">{companies?.filter(c => c.status !== 'Onaylı').length || 0}</p>
                  </div>
                  <Building2 size={20} className="text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bekleyen İlanlar</p>
                    <p className="text-xl font-black text-gray-900">{jobs?.filter(j => j.status === 'Beklemede').length || 0}</p>
                  </div>
                  <Briefcase size={20} className="text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bekleyen Mentorluk Başvuruları</p>
                    <p className="text-xl font-black text-gray-900">0</p>
                  </div>
                  <UserCheck size={20} className="text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Yaklaşan Etkinlikler</p>
                    <p className="text-xl font-black text-gray-900">{events?.length || 0}</p>
                  </div>
                  <Calendar size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-black text-gray-900 mb-2">Profilini Tamamla</h3>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div className="bg-iesu-red h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs text-gray-500 font-medium mb-4">Profilin %40 oranında tamamlandı. İş ilanlarında öne çıkmak için özgeçmişini doldur.</p>
              <button onClick={() => setView('profile_update')} className="w-full py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl text-[13px] font-bold transition-colors">Özgeçmişini Düzenle</button>
            </div>
          )}

          {/* Featured Opportunities */}
          {featuredOpportunities && (featuredOpportunities || []).filter(f => f.status === 'Yayında').length > 0 && (
            <div className="sticky top-24 bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
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
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck size={18} className="text-blue-500" /> Mentorluk Başvuruları
              </h3>
              <div className="space-y-3">
                {(mentorships || []).filter(m => m.status === 'Aktif').slice(0,3).map(mnt => (
                  <div key={mnt.id} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 hover:border-blue-300 transition cursor-pointer group">
                    <p className="text-[12px] font-black text-gray-900 group-hover:text-blue-700 transition">{mnt.programTitle}</p>
                    <p className="text-[11px] text-gray-500">{mnt.mentorName} • {mnt.department}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'career_network' && (
            <CareerNetwork companies={companies} events={events} academicStaff={academicStaff} setView={setView} setSelectedUserId={setSelectedUserId} />
          )}

        </div>

        {/* Applications Interface Overlay */}
        {activeTab === 'applications' && (
          <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl animate-fade-in relative">
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
                  currentUser={currentUser || { id: 'std-1', name: 'Öğrenci', avatar: 'https://ui-avatars.com/api/?name=O&background=132A49&color=fff' }} 
                  userRole="student" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Messaging Interface Overlay */}
        {activeTab === 'messaging' && (
          <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in relative">
              <button 
                onClick={() => setActiveTab('feed')}
                className="absolute top-4 right-4 z-50 p-2 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full shadow-md transition border border-gray-100"
              >
                <X size={20} />
              </button>
              <MessagingInterface 
                messages={messages} 
                setMessages={setMessages} 
                currentUser={currentUser} 
                userRole={userRole} 
                contacts={[...(students || []), ...(alumni || []), ...(companies || []), ...(academicStaff || [])]}
                setView={setView}
                setSelectedUserId={setSelectedUserId}
                isOverlay={true}
              />
            </div>
          </div>
        )}

        {/* Calendar Overlay */}
        {activeTab === 'calendar' && (
          <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
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
          <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in relative">
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

      </div>
    </div>
  );
}


