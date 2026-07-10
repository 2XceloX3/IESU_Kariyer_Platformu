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
      <div className="pt-24 max-w-2xl mx-auto px-4 flex flex-col justify-center gap-6 pb-32 relative">

        {/* CENTER PANEL: Stories & Feed */}
        <div className="w-full shrink-0 space-y-6">
          
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

          {activeTab === 'career_network' && (
            <CareerNetwork companies={companies} events={events} academicStaff={academicStaff} setView={setView} setSelectedUserId={setSelectedUserId} />
          )}

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

      {/* FLOATING DOCK (INSTAGRAM STYLE - DARK PILL) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[380px]">
        <div className="bg-[#0f1419]/95 backdrop-blur-2xl border border-gray-800 p-2 sm:p-2.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between px-3">
          <button onClick={() => setActiveTab('feed')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'feed' ? 'text-white' : 'text-gray-400 hover:text-white'}`} title="Akış">
            <Home size={26} strokeWidth={activeTab === 'feed' ? 2.5 : 2} className={activeTab === 'feed' ? 'fill-current' : ''} />
          </button>
          <button onClick={() => setView('jobs')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'jobs' ? 'text-white' : 'text-gray-400 hover:text-white'}`} title="İlanlar">
            <Briefcase size={24} strokeWidth={activeTab === 'jobs' ? 2.5 : 2} />
          </button>
          
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-red-500 to-purple-600 text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0">
            <Plus size={24} strokeWidth={3} />
          </button>
          
          <button onClick={() => setActiveTab('applications')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'applications' ? 'text-white' : 'text-gray-400 hover:text-white'}`} title="Başvurularım">
            <FileText size={24} strokeWidth={activeTab === 'applications' ? 2.5 : 2} />
          </button>
          <button onClick={() => setView('profile_update')} className={`p-1 rounded-full transition-all flex items-center justify-center border-2 ${activeTab === 'profile' ? 'border-white' : 'border-transparent hover:border-gray-500'}`} title="Profil">
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Öğrenci')}&background=132A49&color=fff`} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>
    </div>
  );
}


