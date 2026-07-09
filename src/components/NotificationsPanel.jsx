import React, { useState } from 'react';
import { ArrowLeft, Bell, Briefcase, Calendar, CheckCircle2, MessageSquare, Star, Info, Trash2, CheckCircle, Home, Compass, MessageCircle, Search } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

export default function NotificationsPanel({ userRole, notifications, setNotifications, currentUser, setView, setSelectedUserId }) {
  
  const myNotifications = (notifications || []).filter(n => n.userId === currentUser?.id).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  const unreadCount = (myNotifications || []).filter(n => !n.read).length;

  const getIcon = (type) => {
    switch(type) {
      case 'message': return <MessageSquare size={18} className="text-blue-500" />;
      case 'application': return <Briefcase size={18} className="text-emerald-500" />;
      case 'event': return <Calendar size={18} className="text-purple-500" />;
      case 'system': return <Info size={18} className="text-iesu-red" />;
      default: return <Bell size={18} className="text-gray-500" />;
    }
  };

  const markAllAsRead = () => {
    const updated = (notifications || []).map(n => n.userId === currentUser?.id ? { ...n, read: true } : n);
    setNotifications(updated);
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

  const NavIcon = ({ icon, label, badge, active, onClick }) => {
    const getClasses = () => {
      switch (label) {
        case 'Akış': return { text: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-500', glow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]' };
        case 'Kariyer Ağı': return { text: 'text-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-500', glow: 'drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]' };
        case 'İş ve Staj': return { text: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-500', glow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]' };
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
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-20">
      {/* Hyper-Modern Navbar (Glassmorphism) - Replicated from Feeds */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView(userRole === 'admin' ? 'admin' : (userRole || 'landing'))}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden lg:block">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>
          
          <div className="hidden md:flex relative group flex-1 max-w-md mx-auto shrink">
            <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-iesu-red transition-colors" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Öğrenci, mezun, firma, ilan veya başvuru ara..." 
              className="bg-gray-100/80 pl-10 pr-4 py-2 rounded-2xl text-[14px] w-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-iesu-coral/20 transition-all" 
            />
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <NavIcon icon={<Home />} label="Akış" active={activeTab === 'feed'} onClick={() => setView(userRole === 'admin' ? 'student' : (userRole || 'landing'))} />
            <NavIcon icon={<Compass />} label="Kariyer Ağı" active={activeTab === 'career_network'} onClick={() => {}} />
            <NavIcon icon={<Briefcase />} label="İş ve Staj" active={activeTab === 'jobs'} onClick={() => {}} />
            <NavIcon 
              icon={<MessageCircle />} 
              label="Mesajlar" 
              badge={0} 
              onClick={() => setView('messaging')} 
            />
            <NavIcon 
              icon={<Bell />} 
              label="Bildirimler" 
              badge={unreadCount} 
              active={true}
              onClick={() => setView('notifications')} 
            />
            
            <TopProfileMenu 
              currentUser={currentUser} 
              userRole={userRole} 
              setView={setView} 
              setSelectedUserId={setSelectedUserId} 
              setSelectedUserId={() => {}} 
              currentView="notifications" 
            />
          </div>
        </div>
      </nav>

      <main className="max-w-[800px] mx-auto px-4 lg:px-8 pt-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            Bildirimler
          </h1>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-sm font-bold text-gray-500 hover:text-iesu-red flex items-center gap-1 transition">
              <CheckCircle size={16} /> Tümünü Okundu İşaretle
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[var(--border-soft)] shadow-[var(--shadow-soft)] overflow-hidden">
          {myNotifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bell size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Henüz bildiriminiz bulunmuyor.</h3>
              <p className="text-gray-500 text-sm">Size gelen önemli güncellemeler burada listelenecektir.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(myNotifications || []).map(notification => (
                <div 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification.id, notification.link)}
                  className={`p-6 flex items-start gap-4 transition cursor-pointer relative group ${!notification.read ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-gray-50'}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h4 className={`text-sm mb-1 ${!notification.read ? 'font-black text-gray-900' : 'font-bold text-gray-800'}`}>
                      {notification.title}
                    </h4>
                    <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                      {notification.description}
                    </p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {new Date(notification.timestamp).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-iesu-red shrink-0 absolute right-6 top-8"></div>
                  )}
                  <button 
                    onClick={(e) => handleDelete(notification.id, e)}
                    className="absolute right-6 top-6 p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


