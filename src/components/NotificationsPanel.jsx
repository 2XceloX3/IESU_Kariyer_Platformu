import React, { useState, useMemo } from 'react';
import { ArrowLeft, Bell, Briefcase, Calendar, CheckCircle2, MessageSquare, Star, Info, Trash2, CheckCircle, Home, Compass, MessageCircle, Search, Heart, Building2 } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import NavIcon from './shared/NavIcon';
import SafeAvatar from './shared/SafeAvatar';
import AdminOmniDock from './AdminOmniDock';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import useAppStore from '../store/useAppStore';

export default function NotificationsPanel({ previousView, userRole, currentUser, setView, setSelectedUserId }) {
  const activePortalBranch = useAppStore(state => state.activePortalBranch);
  const effectiveRole = (activePortalBranch === 'student' || previousView === 'student') ? 'student' : (activePortalBranch === 'alumni' || previousView === 'alumni') ? 'alumni' : (userRole || 'student');
  const notifications = useAppStore(state => state.notifications);
  const setNotifications = useAppStore(state => state.setNotifications);

  const myNotifications = useMemo(() => 
    (notifications || []).filter(n => n.userId === currentUser?.id).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  , [notifications, currentUser]);
  const unreadCount = useMemo(() => (myNotifications || []).filter(n => !n.read).length, [myNotifications]);

  const getIcon = (type) => {
    switch(type) {
      case 'message': return <MessageSquare size={18} className="text-red-500" />;
      case 'application': return <Briefcase size={18} className="text-emerald-500" />;
      case 'event': return <Calendar size={18} className="text-purple-500" />;
      case 'system': return <Info size={18} className="text-[#990000]" />;
      default: return <Bell size={18} className="text-gray-500" />;
    }
  };

  const markAllAsRead = () => {
    const updated = (notifications || []).map(n => n.userId === currentUser?.id ? { ...n, read: true } : n);
    setNotifications(updated);
    const store = useAppStore.getState();
    if (store.markAllNotificationsRead) store.markAllNotificationsRead();
  };

  const handleNotificationClick = (id, link) => {
    const updated = (notifications || []).map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    if (link) {
      setView(link); // Optional handling to route to specific view based on notification
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = (notifications || []).filter(n => n.id !== id);
    setNotifications(updated);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const activeTab = 'notifications';



  const isCompany = userRole === 'company' || userRole === 'employer' || currentUser?.role === 'company' || currentUser?.role === 'employer';

  // Seed default notifications if empty for rich experience
  const displayNotifications = useMemo(() => {
    if (myNotifications.length > 0) return myNotifications;
    if (isCompany) {
      return [
        {
          id: 'n1',
          title: 'Yeni İş Başvurusu Alındı',
          description: 'Alperen Yeni, Kıdemli Yazılım Mühendisi ilanınıza başvurdu.',
          type: 'application',
          timestamp: Date.now() - 3600000,
          read: false,
          link: 'company_ats'
        },
        {
          id: 'n2',
          title: 'İlanınız Onaylandı & Yayında',
          description: 'Frontend Developer ilanınız KGM yönetimi tarafından onaylandı.',
          type: 'system',
          timestamp: Date.now() - 86400000,
          read: true,
          link: 'company'
        },
        {
          id: 'n3',
          title: 'Stajyer Değerlendirme Hatırlatması',
          description: 'Zeynep Kaya isimli stajyerinizin ara dönem değerlendirme formunu doldurun.',
          type: 'event',
          timestamp: Date.now() - 172800000,
          read: true,
          link: 'staj'
        }
      ];
    }
    return [];
  }, [myNotifications, isCompany]);

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'all') return displayNotifications;
    if (activeCategory === 'applications') return displayNotifications.filter(n => n.type === 'application');
    if (activeCategory === 'events') return displayNotifications.filter(n => n.type === 'event' || n.type === 'message');
    if (activeCategory === 'system') return displayNotifications.filter(n => n.type === 'system');
    return displayNotifications;
  }, [displayNotifications, activeCategory]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-24">
      {/* Modern Header Navbar - Matched 100% to Main Feed Header */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1320px] mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* LEFT: Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (userRole === 'admin' || previousView === 'admin') setView('admin');
                else setView(previousView === 'academic' ? 'academic' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : (isCompany ? 'company' : 'student'));
              }}
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer shrink-0"
              title="Geri"
            >
              <ArrowLeft size={18} />
            </button>
            <div 
              role="button" 
              tabIndex={0} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => {
                if (userRole === 'admin' || previousView === 'admin') setView('admin');
                else setView(previousView === 'academic' ? 'academic' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : (isCompany ? 'company' : 'student'));
              }}
            >
              <Logo color={userRole === 'admin' ? 'amber' : 'red'} className="h-9 w-auto shrink-0" />
              <div className="text-left">
                <h1 className={`text-[13px] font-black tracking-tight leading-none mb-0.5 ${userRole === 'admin' ? 'text-amber-800' : 'text-[#990000]'}`}>İstanbul Esenyurt Üniversitesi</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{userRole === 'admin' ? 'KGM Süper Yönetici Portalı' : 'Kariyer Portalı'}</p>
              </div>
            </div>
          </div>
          
          {/* CENTER: Header Center Section */}
          {isCompany ? (
            <div className="hidden md:flex flex-col items-center justify-center text-center">
              <h2 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Building2 size={16} className="text-purple-600" /> Şirket Yönetim Merkezi
              </h2>
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Kurumsal Bildirim Paneli</span>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Bildirimlerde veya içerikte ara..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#EEF3F8] text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white focus:outline-none block pl-10 p-2 transition-all"
                />
              </div>
            </div>
          )}

          {/* RIGHT: Notifications Bell & Profile Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className="p-2 rounded-full transition-all flex items-center justify-center bg-red-50 text-[#990000]" title="Bildirimler">
              <div className="relative">
                <Bell size={22} strokeWidth={2.5} className="fill-current" />
              </div>
            </button>
            <TopProfileMenu currentUser={currentUser || { name: 'Kullanıcı' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="notifications" />
          </div>
          
        </div>
      </nav>

      <main className="max-w-[850px] mx-auto px-4 pt-24 space-y-6">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Bell className="text-[#990000]" size={24} /> Bildirim Merkezi
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {isCompany ? 'Kurumsal firma hesabınıza ait tüm başvuru, onay ve sistem bildirimleri.' : 'Hesabınıza ait tüm güncellemeler ve anlık bildirimler.'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead} 
              className="text-xs font-bold text-gray-600 hover:text-[#990000] bg-gray-100 hover:bg-red-50 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
            >
              <CheckCircle size={15} className="text-emerald-500" /> Tümünü Okundu İşaretle
            </button>
          )}
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button 
            onClick={() => setActiveCategory('all')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeCategory === 'all' ? 'bg-[#990000] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Tüm Bildirimler ({displayNotifications.length})
          </button>
          <button 
            onClick={() => setActiveCategory('applications')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeCategory === 'applications' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            💼 Başvurular
          </button>
          <button 
            onClick={() => setActiveCategory('events')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeCategory === 'events' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            📢 Duyuru & Etkinlik
          </button>
          <button 
            onClick={() => setActiveCategory('system')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeCategory === 'system' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            ⚙️ Sistem Güncellemeleri
          </button>
        </div>

        {/* Notification List Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-3 border border-gray-100">
                <Bell size={26} className="text-gray-400" />
              </div>
              <h3 className="text-base font-black text-gray-900 mb-1">Henüz bildiriminiz bulunmuyor</h3>
              <p className="text-gray-500 text-xs max-w-sm">Size gelen önemli güncellemeler ve ilan başvuruları burada listelenecektir.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map(notification => (
                <div 
                  role="button" 
                  tabIndex={0} 
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification.id, notification.link)}
                  className={`p-5 flex items-start gap-4 transition cursor-pointer relative group ${!notification.read ? 'bg-red-50/20 hover:bg-red-50/40' : 'hover:bg-gray-50/80'}`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-xs shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h4 className={`text-sm mb-1 flex items-center gap-2 ${!notification.read ? 'font-black text-gray-900' : 'font-bold text-gray-800'}`}>
                      {notification.title}
                      {!notification.read && <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>}
                    </h4>
                    <p className={`text-xs leading-relaxed ${!notification.read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                      {notification.description}
                    </p>
                    <span className="text-[11px] text-gray-400 font-medium mt-2 block">
                      {new Date(notification.timestamp || Date.now()).toLocaleString('tr-TR')}
                    </span>
                  </div>

                  <button 
                    onClick={(e) => handleDelete(notification.id, e)}
                    className="absolute right-5 top-5 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition"
                    title="Bildirimi Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FLOATING DOCK (ADMIN OMNIDOCK OR FIRMA DOCK) */}
      {effectiveRole === 'admin' ? (
        <AdminOmniDock theme="amber" currentUser={currentUser} setView={setView} setSelectedUserId={setSelectedUserId} activeTab="notifications" />
      ) : effectiveRole === 'student' ? (
        <SubPanelFloatingDock currentUser={currentUser} setView={setView} setSelectedUserId={setSelectedUserId} userRole="student" />
      ) : (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[320px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-purple-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(30,41,59,0.15)] flex items-center justify-around px-4">
            
            {/* HOME / FEED */}
            <button 
              onClick={() => setView(isCompany ? 'company' : (previousView === 'alumni' ? 'alumni' : 'student'))} 
              className="p-2.5 rounded-full transition-all flex items-center justify-center text-slate-600 hover:text-purple-600 hover:bg-purple-50" 
              title="Akış"
            >
              <Home size={24} strokeWidth={2.2} />
            </button>

            {/* SEARCH (CENTER GRADIENT ICON) */}
            <button 
              onClick={() => setView(isCompany ? 'company' : (previousView === 'alumni' ? 'alumni' : 'student'))} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/40" 
              title="Ara"
            >
              <Search size={22} strokeWidth={2.8} />
            </button>

            {/* PROFILE AVATAR */}
            <button 
              onClick={() => {
                const selfId = currentUser?.id || currentUser?.uid || currentUser?.studentNo || 'self';
                if (setSelectedUserId) setSelectedUserId(selfId);
                setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-purple-400/60 shadow-xs hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
              title="Profilim"
            >
              <SafeAvatar src={currentUser?.avatar} name={currentUser?.name || 'Kullanıcı'} size="xs" alt="Profile" />
            </button>

          </div>
        </div>
      )}
    </div>
  );
}





